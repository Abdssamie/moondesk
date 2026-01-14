# Moondesk Go Makefile

BINARY_API=bin/api
BINARY_WORKER=bin/worker

.PHONY: all build clean test lint run swagger

all: build

build: build-api build-worker

build-api:
	@echo "Building API..."
	@go build -o $(BINARY_API) ./cmd/api

build-worker:
	@echo "Building Worker..."
	@go build -o $(BINARY_WORKER) ./cmd/worker

run: build-api
	@echo "Running API..."
	@./$(BINARY_API)

test:
	@echo "Running Tests..."
	@go test -v ./...

lint:
	@echo "Running Linter..."
	@go vet ./...
	@test -z $$(gofmt -l .)

clean:
	@echo "Cleaning..."
	@rm -rf bin/

# Swagger / OpenAPI
# Requires: go install github.com/swaggo/swag/cmd/swag@latest
swagger:
	@echo "Generating Swagger Docs..."
	@swag init -g cmd/api/main.go --output docs --parseDependency --parseInternal
