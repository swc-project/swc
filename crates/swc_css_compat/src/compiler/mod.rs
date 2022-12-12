use swc_css_visit::VisitMut;

use crate::feature::Features;

mod custom_media;

/// Compiles a modern CSS file to a legacy CSS file.
#[derive(Debug)]
pub struct Compiler {
    #[allow(unused)]
    c: Config,
}

#[derive(Debug)]
pub struct Config {
    /// The list of features to **process**.
    pub process: Features,
}

impl Compiler {
    pub fn new(config: Config) -> Self {
        Self { c: config }
    }
}

impl VisitMut for Compiler {}
