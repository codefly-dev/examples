FROM golang:alpine AS builder
WORKDIR /app

# Copy go mod and sum files to cache download
COPY src/go.mod src/go.sum ./
RUN go mod download


COPY service.codefly.yaml service.codefly.yaml

COPY src src

COPY src/go.mod src/go.mod


WORKDIR /app/src
# Build the binary
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o app

FROM alpine:latest
WORKDIR /app

ENV CODEFLY_ENDPOINT__COUNTER-GO-GRPC-NEXTJS-POSTGRES__BACKEND___GRPC localhost:9090

ENV CODEFLY_ENDPOINT__COUNTER-GO-GRPC-NEXTJS-POSTGRES__BACKEND___REST localhost:8080

# Set up a non-root user
RUN adduser -D appuser
USER appuser
COPY --chown=appuser service.codefly.yaml .
COPY --chown=appuser --from=builder /app/src/app .
EXPOSE 8080
EXPOSE 9090



CMD ["./app"]
