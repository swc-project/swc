pub use self::edge_default_param::edge_default_param;
use swc_common::chain;
use swc_ecma_visit::Fold;

mod edge_default_param;

pub fn bugfixes() -> impl Fold {
  edge_default_param()
}
