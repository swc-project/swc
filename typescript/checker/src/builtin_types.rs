use crate::ty::{Type, TypeRef};
use swc_atoms::JsWord;
use swc_ts_builtin_types::load;
pub use swc_ts_builtin_types::Lib;

pub fn get<'a>(libs: &[Lib], name: &JsWord) -> Option<&'a Type<'static>> {
    unimplemented!("get")
}
