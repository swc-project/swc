cargo build --target wasm32-wasi --features plugin
wasm-bindgen --target deno --out-dir ./dist-deno ../target/wasm32-unknown-unknown/debug/binding_core_wasm.wasm
