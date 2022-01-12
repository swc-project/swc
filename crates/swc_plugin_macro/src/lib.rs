extern crate proc_macro;
use proc_macro::TokenStream;

use proc_macro2::{Ident, Span};
use quote::quote;
use syn::{Item as SynItem, ItemFn};

#[proc_macro_attribute]
pub fn plugin_module(
    _args: proc_macro::TokenStream,
    input: proc_macro::TokenStream,
) -> proc_macro::TokenStream {
    let token = proc_macro2::TokenStream::from(input);
    let parsed_results = syn::parse2::<SynItem>(token).expect("Failed to parse tokens");
    match parsed_results {
        SynItem::Fn(func) => handle_func(func),
        _ => panic!("Please confirm if plugin macro is specified for the function"),
    }
}

fn handle_func(func: ItemFn) -> TokenStream {
    let ident = func.sig.ident.clone();
    let process_impl_ident = Ident::new(&format!("__plugin_process_impl"), Span::call_site());

    let ret = quote! {
        #func

        // TODO:
        // error handling & bubbling
        #[no_mangle]
        pub fn #process_impl_ident(ast_ptr: *const u8, ast_ptr_len: i32, config_str_ptr: *const u8, config_str_ptr_len: i32) -> (i32, i32) {
            // Read raw serialized bytes from wasm's memory space. Host (SWC) should
            // allocate memory, copy bytes and pass ptr to plugin.
            let raw_ast_serialized_bytes =
                unsafe { std::slice::from_raw_parts(ast_ptr, ast_ptr_len.try_into().unwrap()) };

            let raw_config_serialized_bytes =
                unsafe { std::slice::from_raw_parts(config_str_ptr, config_str_ptr_len.try_into().unwrap()) };

            // Reconstruct SerializedProgram from raw bytes
            let serialized_program = Serialized::new_for_plugin(raw_ast_serialized_bytes, ast_ptr_len);
            let serialized_config = Serialized::new_for_plugin(raw_config_serialized_bytes, config_str_ptr_len);

            // TODO: Returning error pointer instead of unwrap
            let program: Program =
                Serialized::deserialize(&serialized_program).expect("Should able to deserialize");
            let config: String = Serialized::deserialize(&serialized_config).expect("Should able to deserialize");

            // Take original plugin fn ident, then call it with interop-ed args
            let transformed_program = #ident(program, config).expect("Should return program for now");

            // Serialize transformed result, return back to the host.
            let serialized_result =
                Serialized::serialize(&transformed_program).expect("Should serializable");

            let serialized_result = serialized_result.as_ref();

            (
                serialized_result.as_ptr() as _,
                serialized_result.len().try_into().unwrap(),
            )
        }
    };

    ret.into()
}
