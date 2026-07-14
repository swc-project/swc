use swc_common::{comments::Comments, util::take::Take, Mark};
use swc_config::types::BoolOrDataConfig;
use swc_ecma_minifier::{
    optimize,
    option::{
        terser::{TerserCompressorOptions, TerserTopLevelOptions},
        MangleOptions, MinifyOptions,
    },
};
use swc_ecma_transforms::{hygiene::hygiene_with_config, resolver};

use super::{
    state::{CompilationUnit, PipelineContextData},
    Pipeline,
};

/// AST minifier options, distinct from code generator minification.
pub(super) struct MinifyStageOptions {
    pub(super) compress: BoolOrDataConfig<TerserCompressorOptions>,
    pub(super) mangle: BoolOrDataConfig<MangleOptions>,
}

impl Pipeline<'_> {
    pub(super) fn minify(
        &self,
        unit: &mut CompilationUnit,
        context: &PipelineContextData,
        options: Option<MinifyStageOptions>,
    ) {
        let Some(options) = options else {
            return;
        };

        let minify_options = MinifyOptions {
            compress: options
                .compress
                .unwrap_as_option(|default| match default {
                    Some(true) => Some(Default::default()),
                    _ => None,
                })
                .map(|mut compress| {
                    if compress.const_to_let.is_none() {
                        compress.const_to_let = Some(true);
                    }
                    if compress.toplevel.is_none() && unit.program.is_module() {
                        compress.toplevel = Some(TerserTopLevelOptions::Bool(true));
                    }
                    if unit.program.is_script() {
                        compress.module = false;
                    }
                    compress.into_config(self.compiler.cm.clone())
                }),
            mangle: options.mangle.unwrap_as_option(|default| match default {
                Some(true) => Some(Default::default()),
                _ => None,
            }),
            ..Default::default()
        };

        if minify_options.compress.is_none() && minify_options.mangle.is_none() {
            return;
        }

        unit.program.mutate(hygiene_with_config(
            swc_ecma_transforms_base::hygiene::Config {
                top_level_mark: context.top_level_mark,
                ..swc_ecma_transforms_base::hygiene::Config::hygiene_default()
            },
        ));

        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();
        unit.program
            .mutate(resolver(unresolved_mark, top_level_mark, false));

        unit.program = optimize(
            unit.program.take(),
            self.compiler.cm.clone(),
            Some(&unit.comments as &dyn Comments),
            None,
            &minify_options,
            &swc_ecma_minifier::option::ExtraOptions {
                unresolved_mark,
                top_level_mark,
                mangle_name_cache: None,
            },
        );
    }
}
