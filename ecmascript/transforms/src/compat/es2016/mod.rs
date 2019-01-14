pub use self::exponentation::exponentation;
use crate::pass::Pass;

mod exponentation;

pub fn es2016() -> impl Pass + Clone {
    exponentation()
}
