#[derive(Debug)]
pub(super) struct Scope<'a> {
    parent: Option<&'a Scope<'a>>,
}

impl Scope<'static> {
    pub fn root() -> Self {
        Self { parent: None }
    }
}

impl<'a> Scope<'a> {}
