pub use self::object_rest_spread::object_rest_spread;

use crate::pass::Pass;

mod object_rest_spread;

pub fn es2018() -> impl Pass {
    object_rest_spread()
}
