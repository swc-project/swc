use rkyv::{AlignedVec, Deserialize};
use swc_plugin::{ast::*, DUMMY_SP};

struct ConsoleOutputReplacer;

/// An example plugin replaces any `console.log(${text})` into
/// `console.log('changed_via_plugin')`.
impl VisitMut for ConsoleOutputReplacer {
    fn visit_mut_call_expr(&mut self, call: &mut CallExpr) {
        if let ExprOrSuper::Expr(expr) = &call.callee {
            if let Expr::Member(MemberExpr { obj, .. }) = &**expr {
                if let ExprOrSuper::Expr(expr) = obj {
                    if let Expr::Ident(ident) = &**expr {
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
}

#[no_mangle]
// TODO:
// - this is not complete signature, need to take config_json
// - swc_plugin macro to support ergonomic interfaces
// - better developer experience: println / dbg!() doesn't emit anything
// - typed json config instead of str, which requires additional deserialization
pub fn process(ast_ptr: *mut u8, len: u32) -> (i32, i32) {
    // Read raw serialized bytes from wasm's memory space. Host (SWC) should allocated memory, copy bytes and pass ptr to it.
    let raw_serialized_bytes = unsafe { std::slice::from_raw_parts(ast_ptr, len.try_into().unwrap()) };

    // Reconstruct AlignedVec from raw bytes
    let mut serialized_program = AlignedVec::with_capacity(len.try_into().unwrap());
    serialized_program.extend_from_slice(raw_serialized_bytes);

    // TODO: trait bound complaining in deserialize_for_plugin<T>
    // Actual deserialization
    let archived = unsafe { rkyv::archived_root::<Program>(&serialized_program[..]) };
    let program: Program = archived.deserialize(&mut rkyv::Infallible).unwrap();

    // Actual plugin transformation
    let transformed_program = program.fold_with(&mut as_folder(ConsoleOutputReplacer));

    // Serialize transformed result, return back to the host.
    let serialized_result = rkyv::to_bytes::<_, 512>(&transformed_program).expect("Should serializable");
    (serialized_result.as_ptr() as _, serialized_result.len().try_into().unwrap())
}
