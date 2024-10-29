use swc_ecma_ast::Pass;

pub use self::logical_assignments::logical_assignments;

mod logical_assignments;

pub fn es2021() -> impl Pass {
    logical_assignments()
}
