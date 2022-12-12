use swc_css_visit::VisitMut;

use self::custom_media::CustomMediaHandler;
use crate::feature::Features;

mod custom_media;

/// Compiles a modern CSS file to a CSS file which works with old browsers.
#[derive(Debug)]
pub struct Compiler {
    #[allow(unused)]
    c: Config,
    custom_media: CustomMediaHandler,
}

#[derive(Debug)]
pub struct Config {
    /// The list of features to **process**.
    pub process: Features,
}

impl Compiler {
    pub fn new(config: Config) -> Self {
        Self {
            c: config,
            custom_media: Default::default(),
        }
    }
}

impl VisitMut for Compiler {}
