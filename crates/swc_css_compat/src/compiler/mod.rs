use swc_css_visit::VisitMut;

mod custom_media;

/// Compiles a modern CSS file to a legacy CSS file.
#[derive(Debug)]
pub struct Compiler {
    c: Config,
}

#[derive(Debug, Default)]
pub struct Config {}

impl Compiler {
    pub fn new(config: Config) -> Self {
        Self { c: config }
    }
}

impl VisitMut for Compiler {}
