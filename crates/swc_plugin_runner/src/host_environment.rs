use wasmer::Memory;

/// An external environment state imported (declared in host, injected into
/// guest) fn can access. This'll allow host to read from updated state from
/// guest.
///
/// This is `base` environment exposes nothing. For other
/// calls requires additional data to be set in the host, separate
/// hostenvironments are declared. Refer `CommentsHostEnvironment` for an
/// example.
///
/// ref: https://docs.wasmer.io/integrations/examples/host-functions#declaring-the-data
#[derive(Clone)]
pub struct BaseHostEnvironment {
    pub memory: Option<Memory>,
}

impl BaseHostEnvironment {
    pub fn new() -> BaseHostEnvironment {
        BaseHostEnvironment { memory: None }
    }
}
