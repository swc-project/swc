FROM node:24-bookworm

ENV DEBIAN_FRONTEND=noninteractive \
    CARGO_HOME=/opt/cargo \
    RUSTUP_HOME=/opt/rustup \
    RUST_BACKTRACE=1 \
    RUST_MIN_STACK=16777216 \
    RUSTFLAGS="-C force-frame-pointers=yes"
ENV PATH="/opt/cargo/bin:${PATH}"

RUN apt-get update && apt-get install -y --no-install-recommends \
      build-essential clang cmake curl git libssl-dev ninja-build \
      pkg-config python3 gdb \
    && rm -rf /var/lib/apt/lists/*
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs -o /tmp/rustup-init.sh \
    && sh /tmp/rustup-init.sh -y --profile minimal --default-toolchain none \
    && rm /tmp/rustup-init.sh

COPY . /src
WORKDIR /src

# Resolve the tool versions from the checkout being scanned.
RUN rustup show active-toolchain \
    && rustup component add rust-src \
    && rustup target add wasm32-wasip1 \
    && npm install --global "$(node -p 'require("./package.json").packageManager')"
RUN pnpm install --frozen-lockfile
RUN git submodule update --init --recursive
# Prepare preset-env data even if lifecycle scripts are disabled by pnpm.
RUN node crates/swc_ecma_preset_env/scripts/copy-data.js
RUN cargo fetch --locked \
    && cargo build --locked -p swc_allocator -p swc_arena -p swc_atoms \
      -p swc_common -p swc_ecma_parser -p swc_ecma_codegen -p swc_ecma_minifier \
    && cargo test --locked --no-run -p swc_allocator -p swc_arena -p swc_atoms \
      -p swc_common -p swc_ecma_parser -p swc_ecma_codegen -p swc_ecma_minifier \
    && pnpm --dir packages/core build:dev

# Compile and run focused tests without allowing an implicit network fetch.
ENV CARGO_NET_OFFLINE=true
RUN cargo test --offline --locked -p swc_allocator -p swc_arena -p swc_atoms
# Node integration and parser fixture suites are available for focused reproduction.
