pub use self::object_rest_spread::object_rest_spread;

use crate::{helpers::Helpers, pass::Pass};
use std::sync::Arc;

mod object_rest_spread;

pub fn es2018(helpers: &Arc<Helpers>) -> impl Pass + Clone {
    object_rest_spread(helpers.clone())
}
