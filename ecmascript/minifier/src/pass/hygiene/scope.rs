#[derive(Debug)]
pub(super) struct Scope<'a> {
    parent: Option<&'a Scope<'a>>,
}

impl Scope<'static> {
    pub fn root() -> Self {
        Self { parent: None }
    }
}

impl<'a> Scope<'a> {
    pub fn new(parent: &'a Scope<'a>) -> Self {
        Self {
            parent: Some(parent),
        }
    }
}
