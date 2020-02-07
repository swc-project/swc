use std::borrow::Cow;

pub trait CompilerPass {
    // TODO: timing with
    //      fn name() -> Cow<'static, str>;
}

pub trait RepeatedPass: CompilerPass {
    /// Should run again?
    fn changed(&self) -> bool;

    /// Reset.
    fn reset(&mut self);
}
