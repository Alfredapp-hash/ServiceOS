FROM node:22-alpine AS base
WORKDIR /app
RUN corepack enable

FROM base AS dependencies
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/package.json
RUN pnpm install --filter @serviceos/api... --frozen-lockfile=false

FROM dependencies AS build
COPY apps/api apps/api
RUN pnpm --filter @serviceos/api build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001
RUN addgroup -S serviceos && adduser -S serviceos -G serviceos
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=build /app/apps/api/dist ./dist
COPY apps/api/package.json ./package.json
USER serviceos
EXPOSE 3001
CMD ["node", "dist/main.js"]
