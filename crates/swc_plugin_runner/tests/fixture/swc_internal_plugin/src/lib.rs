use swc_core::{
    common::DUMMY_SP,
    ecma::{ast::*, atoms::*, visit::*},
    plugin::{
        errors::HANDLER,
        metadata::{TransformPluginMetadataContextKind, TransformPluginProgramMetadata},
        plugin_transform,
    },
    quote,
};

struct ConsoleOutputReplacer;

/// An example plugin replaces any `console.log(${text})` into
/// `console.log('changed_via_plugin')`.
impl VisitMut for ConsoleOutputReplacer {
    fn visit_mut_call_expr(&mut self, call: &mut CallExpr) {
        if let Callee::Expr(expr) = &call.callee {
            if let Expr::Member(MemberExpr { obj, .. }) = &**expr {
                if let Expr::Ident(ident) = &**obj {
                    if ident.sym == *"console" {
                        call.args[0].expr = Box::new(Expr::Lit(Lit::Str(Str {
                            span: DUMMY_SP,
                            value: JsWord::from("changed_via_plugin"),
                            raw: Some(Atom::from("\"changed_via_plugin\"")),
                        })));
                    }
                }
            }
        }
    }
}

/// An example plugin function with macro support.
/// `plugin_transform` macro interop pointers into deserialized structs, as well
/// as returning ptr back to host.
///
/// It is possible to opt out from macro by writing transform fn manually via
/// `__transform_plugin_process_impl(
///     ast_ptr: *const u8,
///     ast_ptr_len: i32,
///     config_str_ptr: *const u8,
///     config_str_ptr_len: i32,
///     context_str_ptr: *const u8,
///     context_str_ptr_len: i32,
///     should_enable_comments: i32) ->
///     i32 /*  0 for success, fail otherwise.
///             Note this is only for internal pointer interop result,
///             not actual transform result */
///
/// if plugin need to handle low-level ptr directly. However, there are
/// important steps manually need to be performed like sending transformed
/// results back to host. Refer swc_plugin_macro how does it work internally.
#[plugin_transform]
pub fn process(program: Program, metadata: TransformPluginProgramMetadata) -> Program {
    HANDLER.with(|handler| {
        handler
            .struct_span_err(DUMMY_SP, "Test diagnostics from plugin")
            .emit();
    });

    let _stmt = quote!(
        "const $name = 4;" as Stmt,
        name = Ident::new("ref".into(), DUMMY_SP)
    );

    let env = metadata
        .get_context(&TransformPluginMetadataContextKind::Env)
        .expect("Metadata should exists");
    if env != "development" {
        panic!("Env should be development");
    }

    let experimental_value = metadata
        .get_experimental_context("TestExperimental")
        .expect("Experimental metadata should exist");

    // Let test fail if metadata is not correctly passed
    if &experimental_value != "ExperimentalValue" {
        panic!("Experimental metadata should be `ExperimentalValue`");
    }

    let experimental_value = metadata
        .get_experimental_context("OtherTest")
        .expect("Experimental metadata 'othertest' should exist");

    if &experimental_value != "OtherVal" {
        panic!("Experimental metadata 'othertest' should be `OtherVal`");
    }

    let nonexistent_value = metadata.get_experimental_context("Nonexistent");

    if nonexistent_value.is_some() {
        panic!("Experimental metadata 'nonexistent' should not exist");
    }

    let plugin_config = metadata
        .get_transform_plugin_config()
        .expect("Plugin config should exist");
    if plugin_config != "{\"pluginConfig\":\"testValue\"}" {
        panic!("Plugin config should be testValue");
    }

    program.fold_with(&mut as_folder(ConsoleOutputReplacer))
}
