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
        SynItem::Fn(func) => handle_func(func, Ident::new("Program", Span::call_site())),
        _ => panic!("Please confirm if plugin macro is specified for the function"),
    }
}

#[proc_macro_attribute]
pub fn css_plugin_transform(
    _args: proc_macro::TokenStream,
    input: proc_macro::TokenStream,
) -> proc_macro::TokenStream {
    let token = proc_macro2::TokenStream::from(input);
    let parsed_results = syn::parse2::<SynItem>(token).expect("Failed to parse tokens");
    match parsed_results {
        SynItem::Fn(func) => handle_func(func, Ident::new("Stylesheet", Span::call_site())),
        _ => panic!("Please confirm if plugin macro is specified for the function"),
    }
}

#[allow(clippy::redundant_clone)]
fn handle_func(func: ItemFn, ast_type: Ident) -> TokenStream {
    let ident = func.sig.ident.clone();
    let transform_process_impl_ident =
        Ident::new("__transform_plugin_process_impl", Span::call_site());
    let transform_core_pkg_diag_ident =
        Ident::new("__get_transform_plugin_core_pkg_diag", Span::call_site());

    let ret = quote! {
        #func

        // Declaration for imported function from swc host.
        // Refer swc_plugin_runner for the actual implementation.
        #[cfg(target_arch = "wasm32")] // Allow testing
        extern "C" {
            fn __set_transform_result(bytes_ptr: u32, bytes_ptr_len: u32);
            fn __set_transform_plugin_core_pkg_diagnostics(bytes_ptr: u32, bytes_ptr_len: u32);
            fn __emit_diagnostics(bytes_ptr: u32, bytes_ptr_len: u32);
        }

        /// An emitter for the Diagnostic in plugin's context by borrowing host's
        /// environment context.
        ///
        /// It is not expected to call this directly inside of plugin transform.
        /// Instead, it is encouraged to use global HANDLER.
        pub struct PluginDiagnosticsEmitter;

        impl swc_core::common::errors::Emitter for PluginDiagnosticsEmitter {
            #[cfg_attr(not(target_arch = "wasm32"), allow(unused))]
            fn emit(&mut self, db: &swc_core::common::errors::DiagnosticBuilder<'_>) {
                let diag = swc_core::common::plugin::serialized::PluginSerializedBytes::try_serialize(&*db.diagnostic)
                    .expect("Should able to serialize Diagnostic");
                let (ptr, len) = diag.as_ptr();

                #[cfg(target_arch = "wasm32")] // Allow testing
                unsafe {
                    __emit_diagnostics(ptr as u32, len as u32);
                }
            }
        }


        /// Call hosts's imported fn to set transform results.
        /// __set_transform_result is host side imported fn, which read and copies guest's byte into host.
        fn send_transform_result_to_host(bytes_ptr: u32, bytes_ptr_len: u32) {
            #[cfg(target_arch = "wasm32")] // Allow testing
            unsafe {
                __set_transform_result(bytes_ptr, bytes_ptr_len);
            }
        }

        /// Internal function plugin_macro uses to create ptr to PluginError.
        fn construct_error_ptr(plugin_error: swc_core::common::plugin::serialized::PluginError) -> u32 {
            let ret = swc_core::common::plugin::serialized::PluginSerializedBytes::try_serialize(&plugin_error).expect("Should able to serialize PluginError");
            let (ptr, len) = ret.as_ptr();

            send_transform_result_to_host(
                ptr as _,
                len as u32
            );
            1
        }

        #[no_mangle]
        #[allow(clippy::not_unsafe_ptr_arg_deref)]
        pub fn #transform_core_pkg_diag_ident() -> u32 {
            let schema_version = swc_core::common::plugin::PLUGIN_TRANSFORM_AST_SCHEMA_VERSION;
            let core_pkg_diag = swc_core::diagnostics::get_core_engine_diagnostics();

            let result = swc_core::common::plugin::diagnostics::PluginCorePkgDiagnostics {
                ast_schema_version: schema_version,
                pkg_version: core_pkg_diag.package_semver,
                git_sha: core_pkg_diag.git_sha,
                cargo_features: core_pkg_diag.cargo_features,
            };

            let serialized_result = swc_core::common::plugin::serialized::PluginSerializedBytes::try_serialize(
                &result
            ).expect("Diagnostics should be always serializable");

            let (serialized_result_ptr, serialized_result_ptr_len) = serialized_result.as_ptr();

            #[cfg(target_arch = "wasm32")] // Allow testing
            unsafe {
                __set_transform_plugin_core_pkg_diagnostics(serialized_result_ptr as _, serialized_result_ptr_len as u32);
            }
            0
        }

        // Macro to allow compose plugin's transform function without manual pointer operation.
        // Internally it wraps pointer operation also bubbles up error in forms of PluginError.
        // There are some cases error won't be wrapped up however - for example, we expect
        // serialization of PluginError itself should succeed.
        #[no_mangle]
        #[allow(clippy::not_unsafe_ptr_arg_deref)]
        pub fn #transform_process_impl_ident(
            ast_ptr: *const u8, ast_ptr_len: u32,
            unresolved_mark: u32, should_enable_comments_proxy: i32) -> u32 {
            // Reconstruct `Program` & config string from serialized program
            // Host (SWC) should allocate memory, copy bytes and pass ptr to plugin.
            let program = unsafe { swc_core::common::plugin::serialized::deserialize_from_ptr(ast_ptr, ast_ptr_len) };
            if program.is_err() {
                let err = swc_core::common::plugin::serialized::PluginError::Deserialize("Failed to deserialize program received from host".to_string());
                return construct_error_ptr(err);
            }
            let program: #ast_type = program.expect("Should be a program");

            // Create a handler wired with plugin's diagnostic emitter, set it for global context.
            let handler = swc_core::common::errors::Handler::with_emitter(
                true,
                false,
                Box::new(PluginDiagnosticsEmitter)
            );
            let handler_set_result = swc_core::plugin::errors::HANDLER.inner.set(handler);

            if handler_set_result.is_err() {
                let err = swc_core::common::plugin::serialized::PluginError::Serialize(
                        "Failed to set handler for plugin".to_string()
                    );
                return construct_error_ptr(err);
            }

            // Construct metadata to the `Program` for the transform plugin.
            let plugin_comments_proxy = if should_enable_comments_proxy == 1 { Some(swc_core::plugin::proxies::PluginCommentsProxy) } else { None };
            let mut metadata = swc_core::plugin::metadata::TransformPluginProgramMetadata {
                comments: plugin_comments_proxy,
                source_map: swc_core::plugin::proxies::PluginSourceMapProxy { source_file: swc_core::common::sync::OnceCell::new() },
                unresolved_mark: swc_core::common::Mark::from_u32(unresolved_mark as u32),
            };

            // Take original plugin fn ident, then call it with interop'ed args
            let transformed_program = #ident(program, metadata);

            // Serialize transformed result, return back to the host.
            let serialized_result = swc_core::common::plugin::serialized::PluginSerializedBytes::try_serialize(
                &transformed_program
            );

            if serialized_result.is_err() {
                let err = swc_core::common::plugin::serialized::PluginError::Serialize("Failed to serialize transformed program".to_string());
                return construct_error_ptr(err);
            }

            let serialized_result = serialized_result.expect("Should be a realized transformed program");
            let (serialized_result_ptr, serialized_result_ptr_len) = serialized_result.as_ptr();

            send_transform_result_to_host(serialized_result_ptr as _, serialized_result_ptr_len as u32);
            0
        }
    };

    ret.into()
}
