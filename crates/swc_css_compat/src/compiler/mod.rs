use swc_css_ast::{AtRule, Rule};
use swc_css_visit::{VisitMut, VisitMutWith};

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

impl VisitMut for Compiler {
    fn visit_mut_at_rule(&mut self, n: &mut AtRule) {
        n.visit_mut_children_with(self);

        if self.c.process.contains(Features::CUSTOM_MEDIA) {
            self.custom_media.store_custom_media(n);
        }
    }

    fn visit_mut_rules(&mut self, n: &mut Vec<Rule>) {
        n.visit_mut_children_with(self);

        n.retain(|n| match n {
            Rule::AtRule(n) => {
                if self.c.process.contains(Features::CUSTOM_MEDIA) && n.name == *"custom-media" {
                    return false;
                }

                true
            }
            _ => true,
        });
    }
}
