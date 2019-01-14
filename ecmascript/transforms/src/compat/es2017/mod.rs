pub use self::async_to_generator::async_to_generator;
use crate::{helpers::Helpers, pass::Pass};
use std::sync::Arc;

mod async_to_generator;

pub fn es2017(helpers: &Arc<Helpers>) -> impl Pass {
    async_to_generator(helpers.clone())
}
