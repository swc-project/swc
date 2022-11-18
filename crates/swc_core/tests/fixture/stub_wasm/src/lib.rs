use swc_core::binding_macros::{
    build_minify, build_minify_sync, build_parse, build_parse_sync, build_print, build_print_sync,
    build_transform, build_transform_sync,
};
use wasm_bindgen::prelude::*;

build_minify_sync!(#[wasm_bindgen(js_name = "minifySync")]);
build_minify!(#[wasm_bindgen(js_name = "minify")]);
build_parse_sync!(#[wasm_bindgen(js_name = "parseSync")]);
build_parse!(#[wasm_bindgen(js_name = "parse")]);
build_print_sync!(#[wasm_bindgen(js_name = "printSync")]);
build_print!(#[wasm_bindgen(js_name = "print")]);
build_transform_sync!(#[wasm_bindgen(js_name = "transformSync")]);
build_transform!(#[wasm_bindgen(js_name = "transform")]);
