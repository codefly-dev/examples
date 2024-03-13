# The builder image, used to build the virtual environment
FROM python:3.11-buster as builder

RUN pip install poetry==1.4.2

ENV POETRY_NO_INTERACTION=1 \
    POETRY_VIRTUALENVS_IN_PROJECT=1 \
    POETRY_VIRTUALENVS_CREATE=1 \
    POETRY_CACHE_DIR=/tmp/poetry_cache

WORKDIR /app

COPY src/pyproject.toml src/poetry.lock ./

RUN poetry install --without dev --no-root && rm -rf $POETRY_CACHE_DIR

# Runner
FROM python:3.11-slim-buster as runtime

RUN apt-get update


RUN apt-get install -y libpq5


RUN rm -rf /var/lib/apt/lists/*

WORKDIR /app
# Set up a non-root user
RUN adduser appuser
USER appuser
ENV VIRTUAL_ENV=/app/.venv \
    PATH="/app/.venv/bin:$PATH"

COPY --chown=appuser --from=builder ${VIRTUAL_ENV} ${VIRTUAL_ENV}
COPY --chown=appuser service.codefly.yaml .

# We go be smarter here

COPY --chown=appuser service.codefly.yaml service.codefly.yaml

COPY --chown=appuser src src


EXPOSE 8080



WORKDIR /app/src
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
