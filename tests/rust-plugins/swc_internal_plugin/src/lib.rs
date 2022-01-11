use swc_plugin::{ast::*, Serialized, DUMMY_SP};

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

#[no_mangle]
// TODO:
// - this is not complete signature, need to take config_json
// - swc_plugin macro to support ergonomic interfaces
// - better developer experience: println / dbg!() doesn't emit anything
pub fn process(ast_ptr: *mut u8, len: i32) -> (i32, i32) {
    // Read raw serialized bytes from wasm's memory space. Host (SWC) should
    // allocate memory, copy bytes and pass ptr to plugin.
    let raw_serialized_bytes =
        unsafe { std::slice::from_raw_parts(ast_ptr, len.try_into().unwrap()) };

    // Reconstruct SerializedProgram from raw bytes
    let serialized_program = Serialized::new_for_plugin(raw_serialized_bytes, len);

    // TODO: Returning error pointer instead of unwrap
    let program: Program =
        Serialized::deserialize(&serialized_program).expect("Should able to deserialize");

    // Actual plugin transformation
    let transformed_program = program.fold_with(&mut as_folder(ConsoleOutputReplacer));

    // Serialize transformed result, return back to the host.
    let serialized_result =
        Serialized::serialize(&transformed_program).expect("Should serializable");

    let serialized_result = serialized_result.as_ref();

    (
        serialized_result.as_ptr() as _,
        serialized_result.len().try_into().unwrap(),
    )
}
