//! Code generation for programs produced by the direct compilation pipeline.

use std::{path::PathBuf, sync::Arc};

use anyhow::Error;
use rustc_hash::FxHashMap;
use swc_atoms::Atom;
use swc_common::{comments::SingleThreadedComments, BytePos, SourceMap};
use swc_compiler_base::{PrintArgs, SourceMapsConfig, TransformOutput};
use swc_config::file_pattern::FilePattern;
use swc_ecma_ast::{EsVersion, Program};

/// Metadata captured after resolver hooks and before runtime plugins and
/// built-in transforms run.
#[derive(Default)]
pub(super) struct CodegenMetadata {
    pub(super) source_map_names: FxHashMap<BytePos, Atom>,
    pub(super) original_source_map: Option<crate::sourcemap::SourceMap>,
}

/// Configuration required by the code-generation terminal.
pub(super) struct CodegenOptions {
    pub(super) source_maps: SourceMapsConfig,
    pub(super) output_path: Option<PathBuf>,
    pub(super) source_root: Option<String>,
    pub(super) source_file_name: Option<String>,
    pub(super) source_map_ignore_list: Option<FilePattern>,
    pub(super) inline_sources_content: bool,
    pub(super) emit_source_map_columns: bool,
    pub(super) preamble: String,
    pub(super) source_map_url: Option<String>,
    pub(super) ascii_only: bool,
    pub(super) minify: bool,
    pub(super) emit_assert_for_import_attributes: bool,
    pub(super) emit_source_map_scopes: bool,
    pub(super) inline_script: bool,
}

/// A fully transformed program together with metadata prepared for emit.
pub(super) struct CodegenInput {
    pub(super) source_map: Arc<SourceMap>,
    pub(super) program: Program,
    pub(super) comments: SingleThreadedComments,
    pub(super) metadata: CodegenMetadata,
    pub(super) transform_output: FxHashMap<String, String>,
    pub(super) target: EsVersion,
    pub(super) options: CodegenOptions,
}

impl CodegenInput {
    /// Generates code from the prepared emit state.
    pub(super) fn codegen(self) -> Result<TransformOutput, Error> {
        let Self {
            source_map,
            program,
            comments,
            metadata,
            transform_output,
            target,
            options,
        } = self;
        let transform_output = if transform_output.is_empty() {
            None
        } else {
            Some(transform_output)
        };

        swc_compiler_base::print(
            source_map,
            &program,
            PrintArgs {
                source_root: options.source_root.as_deref(),
                source_file_name: options.source_file_name.as_deref(),
                source_map_ignore_list: options.source_map_ignore_list,
                output_path: options.output_path,
                inline_sources_content: options.inline_sources_content,
                source_map: options.source_maps,
                source_map_names: &metadata.source_map_names,
                orig: metadata.original_source_map,
                comments: Some(&comments),
                emit_source_map_columns: options.emit_source_map_columns,
                emit_source_map_scopes: options.emit_source_map_scopes,
                preamble: &options.preamble,
                codegen_config: swc_ecma_codegen::Config::default()
                    .with_target(target)
                    .with_minify(options.minify)
                    .with_ascii_only(options.ascii_only)
                    .with_emit_assert_for_import_attributes(
                        options.emit_assert_for_import_attributes,
                    )
                    .with_inline_script(options.inline_script),
                output: transform_output,
                source_map_url: options.source_map_url.as_deref(),
            },
        )
    }
}
