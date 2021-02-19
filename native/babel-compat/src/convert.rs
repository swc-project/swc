#[derive(Debug, Clone)]
pub struct Context {
    pub cm: Arc<SourceMap>,
}

pub trait Babelify {
    type Output;

    fn babelify(self, ctx: &mut Context) -> Self::Output;
}
