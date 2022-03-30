extern crate proc_macro;
use proc_macro::TokenStream;
use proc_macro2::{Ident, Span};
use quote::quote;
use syn::{Item as SynItem, ItemFn};

#[proc_macro_attribute]
pub fn plugin_transform(
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

        // Declaration for imported function from swc host.
        // Refer swc_plugin_runner for the actual implementation.
        #[cfg(target_arch = "wasm32")] // Allow testing
        extern "C" {
            fn __set_transform_result(bytes_ptr: i32, bytes_ptr_len: i32);
        }


        /// Call hosts's imported fn to set transform results.
        /// __set_transform_result is host side imported fn, which read and copies guest's byte into host.
        fn send_transform_result_to_host(bytes_ptr: i32, bytes_ptr_len: i32) {
            #[cfg(target_arch = "wasm32")] // Allow testing
            unsafe {
                __set_transform_result(bytes_ptr, bytes_ptr_len);
            }
        }

        /// Internal function plugin_macro uses to create ptr to PluginError.
        fn construct_error_ptr(plugin_error: swc_plugin::PluginError) -> i32 {
            let ret = swc_plugin::Serialized::serialize(&plugin_error).expect("Should able to serialize PluginError");
            let ret_ref = ret.as_ref();

            send_transform_result_to_host(
                ret_ref.as_ptr() as _,
                std::convert::TryInto::try_into(ret_ref.len()).expect("Should able to convert size of PluginError")
            );
            1
        }

        // Macro to allow compose plugin's transform function without manual pointer operation.
        // Internally it wraps pointer operation also bubbles up error in forms of PluginError.
        // There are some cases error won't be wrapped up however - for example, we expect
        // serialization of PluginError itself should succeed.
        #[no_mangle]
        pub fn #process_impl_ident(ast_ptr: *const u8, ast_ptr_len: i32, config_str_ptr: *const u8, config_str_ptr_len: i32, context_str_ptr: *const u8, context_str_ptr_len: i32) -> i32 {
            let ast_ptr_len_usize: Result<usize, std::num::TryFromIntError> = std::convert::TryInto::try_into(ast_ptr_len);
            let config_str_ptr_len_usize: Result<usize, std::num::TryFromIntError> = std::convert::TryInto::try_into(config_str_ptr_len);
            let context_str_ptr_len_usize: Result<usize, std::num::TryFromIntError> = std::convert::TryInto::try_into(context_str_ptr_len);

            if ast_ptr_len_usize.is_err() {
                let err = swc_plugin::PluginError::SizeInteropFailure("Failed to convert size of AST pointer".to_string());
                return construct_error_ptr(err);
            }

            if config_str_ptr_len_usize.is_err() {
                let err = swc_plugin::PluginError::SizeInteropFailure("Failed to convert size of plugin config string pointer".to_string());
                return construct_error_ptr(err);
            }

            if context_str_ptr_len_usize.is_err() {
                let err = swc_plugin::PluginError::SizeInteropFailure("Failed to convert size of context string pointer".to_string());
                return construct_error_ptr(err);
            }

            // Read raw serialized bytes from wasm's memory space. Host (SWC) should
            // allocate memory, copy bytes and pass ptr to plugin.
            let raw_ast_serialized_bytes =
                unsafe { std::slice::from_raw_parts(ast_ptr, ast_ptr_len_usize.unwrap()) };
            let raw_config_serialized_bytes =
                unsafe { std::slice::from_raw_parts(config_str_ptr, config_str_ptr_len_usize.unwrap()) };
            let raw_context_serialized_bytes =
                unsafe { std::slice::from_raw_parts(context_str_ptr, context_str_ptr_len_usize.unwrap()) };

            // Reconstruct SerializedProgram from raw bytes
            let serialized_program = swc_plugin::Serialized::new_for_plugin(raw_ast_serialized_bytes, ast_ptr_len);
            let serialized_config = swc_plugin::Serialized::new_for_plugin(raw_config_serialized_bytes, config_str_ptr_len);
            let serialized_context = swc_plugin::Serialized::new_for_plugin(raw_context_serialized_bytes, context_str_ptr_len);

            // Reconstruct `Program` & config string from serialized program
            let program = swc_plugin::Serialized::deserialize(&serialized_program);
            let config = swc_plugin::Serialized::deserialize(&serialized_config);
            let context = swc_plugin::Serialized::deserialize(&serialized_context);

            if program.is_err() {
                let err = swc_plugin::PluginError::Deserialize(
                        ("Failed to deserialize program received from host".to_string(),
                            raw_ast_serialized_bytes.to_vec())
                    );
                return construct_error_ptr(err);
            }
            let program: Program = program.expect("Should be a program");

            if config.is_err() {
                let err = swc_plugin::PluginError::Deserialize(
                        ("Failed to deserialize config string received from host".to_string(),
                            raw_config_serialized_bytes.to_vec())
                    );
                return construct_error_ptr(err);
            }
            let config: String = config.expect("Should be a string");

            if context.is_err() {
                let err = swc_plugin::PluginError::Deserialize(
                        ("Failed to deserialize context string received from host".to_string(),
                        raw_context_serialized_bytes.to_vec())
                    );
                return construct_error_ptr(err);
            }
            let context: String = context.expect("Should be a string");

            // Create a handler wired with plugin's diagnostic emitter, set it for global context.
            let handler = swc_plugin::errors::Handler::with_emitter(
                true,
                false,
                Box::new(swc_plugin::environment::PluginDiagnosticsEmitter {})
            );
            let handler_set_result = swc_plugin::errors::HANDLER.inner.set(handler);

            if handler_set_result.is_err() {
                let err = swc_plugin::PluginError::Serialize(
                        "Failed to set handler for plugin".to_string()
                    );
                return construct_error_ptr(err);
            }

            // Construct proxy to the comments directly in guest's runtime
            let mut plugin_comments_proxy = swc_plugin::comments::PluginCommentsProxy;

            // Take original plugin fn ident, then call it with interop'ed args
            let transformed_program = #ident(program, Some(plugin_comments_proxy), config, context);

            // Serialize transformed result, return back to the host.
            let serialized_result = swc_plugin::Serialized::serialize(&transformed_program);

            if serialized_result.is_err() {
                let err = swc_plugin::PluginError::Serialize("Failed to serialize transformed program".to_string());
                return construct_error_ptr(err);
            }

            let serialized_result = serialized_result.expect("Should be a realized transformed program");
            let serialized_result = serialized_result.as_ref();

            let serialized_result_len: Result<i32, std::num::TryFromIntError> = std::convert::TryInto::try_into(serialized_result.len());

            if serialized_result_len.is_err() {
                let err = swc_plugin::PluginError::SizeInteropFailure("Failed to convert size of transformed AST pointer".to_string());
                return construct_error_ptr(err);
            }

            send_transform_result_to_host(serialized_result.as_ptr() as _, serialized_result_len.expect("Should be an i32"));
            0
        }
    };

    ret.into()
}
