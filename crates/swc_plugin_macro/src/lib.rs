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
    let process_impl_ident = Ident::new("__plugin_process_impl", Span::call_site());

    let ret = quote! {
        #func

        /// Internal function plugin_macro uses to create ptr to PluginError.
        fn construct_error_ptr(plugin_error: PluginError) -> (i32, i32, i32) {
            let ret = swc_plugin::Serialized::serialize(&plugin_error).expect("Should able to serialize PluginError");
            let ret_ref = ret.as_ref();

            (
                1,
                ret_ref.as_ptr() as _,
                ret_ref.len().try_into().expect("Should able to convert size of PluginError")
            )
        }

        // Macro to allow compose plugin's transform function without manual pointer operation.
        // Internally it wraps pointer operation also bubbles up error in forms of PluginError.
        // There are some cases error won't be wrapped up however - for example, we expect
        // serialization of PluginError itself should succeed.
        #[no_mangle]
        pub fn #process_impl_ident(ast_ptr: *const u8, ast_ptr_len: i32, config_str_ptr: *const u8, config_str_ptr_len: i32) -> (i32, i32, i32) {
            let ast_ptr_len_usize: Result<usize, std::num::TryFromIntError> = ast_ptr_len.try_into();
            let config_str_ptr_len_usize: Result<usize, std::num::TryFromIntError> = config_str_ptr_len.try_into();

            if ast_ptr_len_usize.is_err() {
                let err = swc_plugin::PluginError::SizeInteropFailure("Failed to convert size of AST pointer".to_string());
                return construct_error_ptr(err);
            }

            if config_str_ptr_len_usize.is_err() {
                let err = swc_plugin::PluginError::SizeInteropFailure("Failed to convert size of plugin config string pointer".to_string());
                return construct_error_ptr(err);
            }

            // Read raw serialized bytes from wasm's memory space. Host (SWC) should
            // allocate memory, copy bytes and pass ptr to plugin.
            let raw_ast_serialized_bytes =
                unsafe { std::slice::from_raw_parts(ast_ptr, ast_ptr_len_usize.unwrap()) };
            let raw_config_serialized_bytes =
                unsafe { std::slice::from_raw_parts(config_str_ptr, config_str_ptr_len_usize.unwrap()) };

            // Reconstruct SerializedProgram from raw bytes
            let serialized_program = swc_plugin::Serialized::new_for_plugin(raw_ast_serialized_bytes, ast_ptr_len);
            let serialized_config = swc_plugin::Serialized::new_for_plugin(raw_config_serialized_bytes, config_str_ptr_len);

            // Reconstruct `Program` & config string from serialized program
            let program = swc_plugin::Serialized::deserialize(&serialized_program);
            let config = swc_plugin::Serialized::deserialize(&serialized_config);

            if program.is_err() {
                let err = swc_plugin::PluginError::Deserialize(
                        ("Failed to deserialize program received from host".to_string(),
                            raw_ast_serialized_bytes.to_vec())
                    );
                return construct_error_ptr(err);
            }
            let program = program.expect("Should be a program");

            if config.is_err() {
                let err = swc_plugin::PluginError::Deserialize(
                        ("Failed to deserialize config string received from host".to_string(),
                            raw_config_serialized_bytes.to_vec())
                    );
                return construct_error_ptr(err);
            }
            let config = config.expect("Should be a string");

            // Take original plugin fn ident, then call it with interop'ed args
            let transformed_program = #ident(program, config);
            if transformed_program.is_err() {
                let err = transformed_program.expect_err("Should be an error");
                return construct_error_ptr(err);
            }

            let transformed_program = transformed_program.expect("Should be a transformed program");

            // Serialize transformed result, return back to the host.
            let serialized_result = swc_plugin::Serialized::serialize(&transformed_program);

            if serialized_result.is_err() {
                let err = swc_plugin::PluginError::Serialize("Failed to serialize transformed program".to_string());
                return construct_error_ptr(err);
            }

            let serialized_result = serialized_result.expect("Should be a realized transformed program");
            let serialized_result = serialized_result.as_ref();

            let serialized_result_len: Result<i32, std::num::TryFromIntError> = serialized_result.len().try_into();

            if serialized_result_len.is_err() {
                let err = swc_plugin::PluginError::SizeInteropFailure("Failed to convert size of transformed AST pointer".to_string());
                return construct_error_ptr(err);
            }

            (
                0,
                serialized_result.as_ptr() as _,
                serialized_result_len.expect("Should be an i32"),
            )
        }
    };

    ret.into()
}
