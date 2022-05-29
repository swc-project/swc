use anyhow::Result;
use wasm_bindgen::prelude::*;

#[wasm_bindgen(module = "./wasm-rt.js")]
extern "C" {
    fn run(src: &str);
}

pub async fn exec_js(src: &str, data: Vec<u8>) -> Result<Vec<u8>> {}
