use wasm_bindgen::prelude::*;

#[wasm_bindgen(module = "/wasm-rt.js")]
extern "C" {
    fn run(src: &str);
}
