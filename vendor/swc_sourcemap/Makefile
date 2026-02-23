all: check test
.PHONY: all

check: style lint
.PHONY: check

clean:
	cargo clean
.PHONY: clean

build:
	cargo build
.PHONY: build

test:
	cargo test --all
	cargo test --all --all-features
.PHONY: test

style:
	@rustup component add rustfmt --toolchain stable 2> /dev/null
	cargo +stable fmt -- --check
.PHONY: style

lint:
	@rustup component add clippy --toolchain stable 2> /dev/null
	cargo +stable clippy --all-features --all --tests --examples -- -D clippy::all
.PHONY: lint

format:
	@rustup component add rustfmt --toolchain stable 2> /dev/null
	cargo +stable fmt
.PHONY: format

docs: build
	@cargo doc --no-deps --all-features
.PHONY: docs

upload-docs: docs
	@./upload-docs.sh
.PHONY: upload-docs
