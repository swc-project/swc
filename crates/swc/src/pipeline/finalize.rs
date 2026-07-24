use anyhow::Error;
use swc_common::{comments::Comments, util::take::Take};
use swc_config::types::BoolOr;
use swc_ecma_ext_transforms::jest;
use swc_ecma_transforms::{fixer::fixer, hygiene::hygiene_with_config};

use super::{
    state::{CompilationUnit, PipelineContextData},
    Pipeline,
};
use crate::{
    config::JsMinifyCommentOption, dropped_comments_preserver::dropped_comments_preserver,
};

/// Final AST cleanup and comment policy.
pub(super) struct FinalizeStageOptions {
    pub(super) builtins: Option<BuiltinFinalizeOptions>,
    pub(super) preserve_comments: BoolOr<JsMinifyCommentOption>,
    pub(super) preserve_annotations: bool,
}

pub(super) struct BuiltinFinalizeOptions {
    pub(super) hygiene_config: Option<swc_ecma_transforms::hygiene::Config>,
    pub(super) run_fixer: bool,
    pub(super) run_jest: bool,
    pub(super) preserve_dropped_comments: bool,
}

impl Pipeline<'_> {
    pub(super) fn finalize(
        &self,
        unit: &mut CompilationUnit,
        context: &PipelineContextData,
        options: FinalizeStageOptions,
    ) -> Result<(), Error> {
        if let Some(builtins) = options.builtins {
            if let Some(config) = builtins.hygiene_config {
                unit.program.mutate(hygiene_with_config(
                    swc_ecma_transforms_base::hygiene::Config {
                        top_level_mark: context.top_level_mark,
                        ..config
                    },
                ));
            }

            if builtins.run_fixer {
                unit.program
                    .mutate(fixer(Some(&unit.comments as &dyn Comments)));
            }
            if builtins.run_jest {
                unit.program.mutate(jest::jest());
            }
            if builtins.preserve_dropped_comments {
                unit.program
                    .mutate(dropped_comments_preserver(Some(unit.comments.clone())));
            }
        }

        if unit.flow_strip_script_like_module {
            unit.program = crate::flow::downgrade_script_like_module(unit.program.take())?;
        }

        swc_compiler_base::minify_file_comments(
            &unit.comments,
            options.preserve_comments,
            BoolOr::Bool(false),
            options.preserve_annotations,
        );

        Ok(())
    }
}
