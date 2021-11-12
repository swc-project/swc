pub mod load;
pub mod module_id;

pub struct ModuleGraph<L, R> {
    loader: L,
    resolver: R,
}
