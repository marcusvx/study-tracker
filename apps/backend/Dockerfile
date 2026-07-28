FROM node:20-alpine AS builder

WORKDIR /app

# Copy manifest first for better layer caching.
COPY package.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "-r", "./dist/instrumentation.js", "dist/main.js"]
