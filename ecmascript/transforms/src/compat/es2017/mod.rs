pub use self::async_to_generator::async_to_generator;
use crate::pass::Pass;

mod async_to_generator;

pub fn es2017() -> impl Pass + Clone {
    async_to_generator()
}
