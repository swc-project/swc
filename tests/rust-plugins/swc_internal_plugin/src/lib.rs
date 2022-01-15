use swc_plugin::{ast::*, plugin_module, DUMMY_SP};

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
/// `__plugin_process_impl(*const u8, i32, *const u8, i32) -> (i32,i32)`
/// if plugin need to handle low-level ptr directly.
///
/// TODO:
/// - better developer experience: println / dbg!() doesn't emit anything
#[plugin_module]
pub fn process(program: Program, _plugin_config: String) -> Result<Program, std::fmt::Error> {
    let transformed_program = program.fold_with(&mut as_folder(ConsoleOutputReplacer));
    Ok(transformed_program)
}
