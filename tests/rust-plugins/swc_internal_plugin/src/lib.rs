use swc_plugin::{ast::*, plugin_module, PluginError, DUMMY_SP};

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
                            has_escape: false,
                            kind: StrKind::default(),
                            value: JsWord::from("changed_via_plugin"),
                        })));
                    }
                }
            }
        }
    }
}

/// An example plugin function with macro support.
/// `plugin_module` macro interop pointers into deserialized structs, as well as
/// returning ptr back to host.
///
/// It is possible to opt out from macro by writing transform fn manually via
/// `__plugin_process_impl(
///     ast_ptr: *const u8,
///     ast_ptr_len: i32,
///     config_str_ptr: *const u8,
///     config_str_ptr_len: i32) ->
///     i32 /* 0 means success */
///
/// if plugin need to handle low-level ptr directly. However, there are important steps
/// manually need to be performed like transformed results back to host. Refer swc_plugin_macro
/// how does it work internally.
#[plugin_module]
pub fn process(program: Program, _plugin_config: String) -> Result<Program, PluginError> {
    let transformed_program = program.fold_with(&mut as_folder(ConsoleOutputReplacer));
    Ok(transformed_program)
}
