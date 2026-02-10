ARG NODE_VERSION="24.13.0"
ARG PNPM_VERSION="10.21.0"

FROM docker.io/library/node:${NODE_VERSION}-bookworm-slim as development

RUN apt update && apt install --no-install-recommends -y \
	ca-certificates \
	curl \
	bash

RUN chsh -s /bin/bash node

RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate

USER node:node

WORKDIR /home/node/project

ENV NODE_ENV=development

COPY --chown=node:node package.json pnpm-lock.yaml ./

RUN pnpm fetch

COPY --chown=node:node ./ ./

RUN pnpm install --frozen-lockfile

RUN pnpm run build

STOPSIGNAL SIGTERM

CMD pnpm run start
