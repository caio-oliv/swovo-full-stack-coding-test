ARG PYTHON_VERSION="3.12.12"

FROM docker.io/library/python:${PYTHON_VERSION}-slim-trixie as development

RUN apt update && apt install --no-install-recommends -y \
	ca-certificates \
	curl \
	bash

RUN groupadd --gid 1000 importer \
	&& useradd importer --uid 1000 --gid 1000 --create-home --shell /bin/bash

USER importer:importer

WORKDIR /home/importer/project

ENV FLASK_ENV=development

RUN python3 -m venv .venv \
	&& .venv/bin/python -m pip install --upgrade pip

COPY --chown=importer:importer requirements.txt ./

RUN .venv/bin/pip install -r requirements.txt

COPY --chown=importer:importer ./ ./

STOPSIGNAL SIGTERM

CMD .venv/bin/python run.py
