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
// Compile the custom-pass overload; binding_core_wasm covers the default path.
build_transform_sync!(
    #[wasm_bindgen(js_name = "transformSync")],
    |_| swc_core::ecma::ast::noop_pass(),
    |_| swc_core::ecma::ast::noop_pass()
);
build_transform!(#[wasm_bindgen(js_name = "transform")]);
