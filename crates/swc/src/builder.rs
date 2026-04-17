use swc_common::{comments::Comments, sync::Lrc, util::take::Take, Mark, SourceMap};
use swc_ecma_ast::{Pass, Program};
use swc_ecma_minifier::option::{terser::TerserTopLevelOptions, MinifyOptions};
use swc_ecma_transforms::{hygiene::hygiene_with_config, resolver};
use swc_ecma_visit::VisitMutWith;

use crate::config::JsMinifyOptions;

pub struct MinifierPass<'a> {
    pub options: Option<JsMinifyOptions>,
    pub cm: Lrc<SourceMap>,
    pub comments: Option<&'a dyn Comments>,
    pub top_level_mark: Mark,
}

impl Pass for MinifierPass<'_> {
    fn process(&mut self, n: &mut Program) {
        if let Some(options) = &self.options {
            let opts = MinifyOptions {
                compress: options
                    .compress
                    .clone()
                    .unwrap_as_option(|default| match default {
                        Some(true) => Some(Default::default()),
                        _ => None,
                    })
                    .map(|mut v| {
                        if v.const_to_let.is_none() {
                            v.const_to_let = Some(true);
                        }
                        if v.toplevel.is_none() && n.is_module() {
                            v.toplevel = Some(TerserTopLevelOptions::Bool(true));
                        }

                        if n.is_script() {
                            v.module = false;
                        }

                        v.into_config(self.cm.clone())
                    }),
                mangle: options
                    .mangle
                    .clone()
                    .unwrap_as_option(|default| match default {
                        Some(true) => Some(Default::default()),
                        _ => None,
                    }),
                ..Default::default()
            };

            if opts.compress.is_none() && opts.mangle.is_none() {
                return;
            }

            n.visit_mut_with(&mut hygiene_with_config(
                swc_ecma_transforms_base::hygiene::Config {
                    top_level_mark: self.top_level_mark,
                    ..Default::default()
                },
            ));

            let unresolved_mark = Mark::new();
            let top_level_mark = Mark::new();

            n.visit_mut_with(&mut resolver(unresolved_mark, top_level_mark, false));

            *n = swc_ecma_minifier::optimize(
                n.take(),
                self.cm.clone(),
                self.comments.as_ref().map(|v| v as &dyn Comments),
                None,
                &opts,
                &swc_ecma_minifier::option::ExtraOptions {
                    unresolved_mark,
                    top_level_mark,
                    mangle_name_cache: None,
                },
            )
        }
    }
}
