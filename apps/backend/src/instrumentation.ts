/**
 * OpenTelemetry bootstrap — must load before Nest/Express (first import in main,
 * or via `node -r ./dist/instrumentation.js`).
 *
 * Env:
 * - OTEL_SDK_DISABLED=true → no-op
 * - OTEL_SERVICE_NAME (default: study-tracker-backend)
 * - OTEL_EXPORTER_OTLP_ENDPOINT (e.g. http://localhost:4318) → OTLP export
 * - Without OTLP endpoint → console exporters (logs always; traces if OTEL_TRACES_EXPORTER=console)
 */
import { DiagConsoleLogger, DiagLogLevel, diag } from '@opentelemetry/api';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import {
  BatchLogRecordProcessor,
  ConsoleLogRecordExporter,
  SimpleLogRecordProcessor,
} from '@opentelemetry/sdk-logs';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { NodeSDK } from '@opentelemetry/sdk-node';
import {
  BatchSpanProcessor,
  ConsoleSpanExporter,
  SimpleSpanProcessor,
} from '@opentelemetry/sdk-trace-base';
import {
  ATTR_DEPLOYMENT_ENVIRONMENT_NAME,
  ATTR_SERVICE_NAME,
} from '@opentelemetry/semantic-conventions';

const GLOBAL_KEY = '__study_tracker_otel_started__';

type GlobalOtel = typeof globalThis & { [GLOBAL_KEY]?: boolean };

function isDisabled(): boolean {
  const raw = process.env.OTEL_SDK_DISABLED?.trim().toLowerCase();
  return raw === 'true' || raw === '1';
}

function startOpenTelemetry(): void {
  const g = globalThis as GlobalOtel;
  if (g[GLOBAL_KEY] || isDisabled()) {
    return;
  }
  g[GLOBAL_KEY] = true;

  if (process.env.OTEL_DIAG_LOG_LEVEL?.toLowerCase() === 'debug') {
    diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);
  }

  const serviceName =
    process.env.OTEL_SERVICE_NAME?.trim() || 'study-tracker-backend';
  const environment =
    process.env.OTEL_DEPLOYMENT_ENVIRONMENT?.trim() ||
    process.env.NODE_ENV?.trim() ||
    'development';
  const otlpEndpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT?.trim();
  const useOtlp = Boolean(otlpEndpoint);
  const consoleTraces =
    process.env.OTEL_TRACES_EXPORTER?.trim().toLowerCase() === 'console';

  const resource = resourceFromAttributes({
    [ATTR_SERVICE_NAME]: serviceName,
    [ATTR_DEPLOYMENT_ENVIRONMENT_NAME]: environment,
  });

  const spanProcessors = useOtlp
    ? [new BatchSpanProcessor(new OTLPTraceExporter())]
    : consoleTraces
      ? [new SimpleSpanProcessor(new ConsoleSpanExporter())]
      : [];

  const logRecordProcessors = useOtlp
    ? [new BatchLogRecordProcessor({ exporter: new OTLPLogExporter() })]
    : [
        new SimpleLogRecordProcessor({
          exporter: new ConsoleLogRecordExporter(),
        }),
      ];

  const metricReaders = useOtlp
    ? [
        new PeriodicExportingMetricReader({
          exporter: new OTLPMetricExporter(),
          exportIntervalMillis: 60_000,
        }),
      ]
    : [];

  const sdk = new NodeSDK({
    resource,
    spanProcessors,
    logRecordProcessors,
    metricReaders,
    instrumentations: [
      getNodeAutoInstrumentations({
        '@opentelemetry/instrumentation-fs': { enabled: false },
        '@opentelemetry/instrumentation-dns': { enabled: false },
        '@opentelemetry/instrumentation-net': { enabled: false },
      }),
    ],
  });

  sdk.start();

  const shutdown = (): void => {
    void sdk.shutdown().catch(() => undefined);
  };
  process.once('SIGTERM', shutdown);
  process.once('SIGINT', shutdown);
}

startOpenTelemetry();
