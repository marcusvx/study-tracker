import { Logger } from '@nestjs/common';
import {
  Span,
  SpanStatusCode,
  context,
  trace,
  type Attributes,
  type Exception,
} from '@opentelemetry/api';
import { SeverityNumber, logs } from '@opentelemetry/api-logs';

export type LogAttributes = Record<
  string,
  string | number | boolean | undefined | null
>;

const TRACER_NAME = 'study-tracker-backend';

function toOtelAttributes(attributes?: LogAttributes): Attributes {
  if (!attributes) return {};
  const out: Attributes = {};
  for (const [key, value] of Object.entries(attributes)) {
    if (value === undefined || value === null) continue;
    out[key] = value;
  }
  return out;
}

function formatForNest(message: string, attributes?: LogAttributes): string {
  if (!attributes || Object.keys(attributes).length === 0) {
    return message;
  }
  const compact: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(attributes)) {
    if (value === undefined || value === null) continue;
    compact[key] = value;
  }
  return `${message} ${JSON.stringify(compact)}`;
}

/**
 * Nest Logger + OpenTelemetry Logs API, with active trace/span context attached.
 * Do not pass secrets, tokens, or Authorization headers in attributes.
 */
export class AppLogger {
  private readonly nest: Logger;
  private readonly otel = logs.getLogger(TRACER_NAME);

  constructor(contextName: string) {
    this.nest = new Logger(contextName);
  }

  info(message: string, attributes?: LogAttributes): void {
    this.nest.log(formatForNest(message, attributes));
    this.emit(SeverityNumber.INFO, 'INFO', message, attributes);
  }

  warn(message: string, attributes?: LogAttributes): void {
    this.nest.warn(formatForNest(message, attributes));
    this.emit(SeverityNumber.WARN, 'WARN', message, attributes);
  }

  error(message: string, attributes?: LogAttributes): void {
    this.nest.error(formatForNest(message, attributes));
    this.emit(SeverityNumber.ERROR, 'ERROR', message, attributes);
  }

  debug(message: string, attributes?: LogAttributes): void {
    this.nest.debug(formatForNest(message, attributes));
    this.emit(SeverityNumber.DEBUG, 'DEBUG', message, attributes);
  }

  private emit(
    severityNumber: SeverityNumber,
    severityText: string,
    body: string,
    attributes?: LogAttributes,
  ): void {
    const span = trace.getSpan(context.active());
    const spanContext = span?.spanContext();

    this.otel.emit({
      severityNumber,
      severityText,
      body,
      attributes: {
        ...toOtelAttributes(attributes),
        ...(spanContext
          ? {
              'trace.id': spanContext.traceId,
              'span.id': spanContext.spanId,
            }
          : {}),
      },
    });
  }
}

export async function withSpan<T>(
  name: string,
  fn: (span: Span) => Promise<T>,
  attributes?: LogAttributes,
): Promise<T> {
  const tracer = trace.getTracer(TRACER_NAME);
  return tracer.startActiveSpan(name, async (span) => {
    try {
      const attrs = toOtelAttributes(attributes);
      if (Object.keys(attrs).length > 0) {
        span.setAttributes(attrs);
      }
      return await fn(span);
    } catch (err) {
      span.recordException(err as Exception);
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: err instanceof Error ? err.message : 'error',
      });
      throw err;
    } finally {
      span.end();
    }
  });
}
