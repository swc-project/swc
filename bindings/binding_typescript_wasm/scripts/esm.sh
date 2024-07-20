wasm-pack build --out-name wasm --out-dir esm --release --scope=swc --target web
node ./scripts/esm.mjs
