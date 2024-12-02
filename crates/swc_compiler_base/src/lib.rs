use std::{
    env,
    path::{Path, PathBuf},
};

use anyhow::{Context, Error};
use base64::prelude::{Engine, BASE64_STANDARD};
use once_cell::sync::Lazy;
use rustc_hash::FxHashMap;
#[allow(unused)]
use serde::{Deserialize, Serialize};
use swc_allocator::maybe::vec::Vec;
use swc_atoms::JsWord;
use swc_common::{
    collections::AHashMap,
    comments::{Comment, CommentKind, Comments, SingleThreadedComments},
    errors::Handler,
    source_map::SourceMapGenConfig,
    sync::Lrc,
    BytePos, FileName, SourceFile, SourceMap,
};
use swc_config::config_types::BoolOr;
pub use swc_config::IsModule;
use swc_ecma_ast::{EsVersion, Ident, IdentName, Program};
use swc_ecma_codegen::{text_writer::WriteJs, Emitter, Node};
use swc_ecma_minifier::js::JsMinifyCommentOption;
use swc_ecma_parser::{parse_file_as_module, parse_file_as_program, parse_file_as_script, Syntax};
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};
use swc_timer::timer;

#[cfg(feature = "node")]
#[napi_derive::napi(object)]
#[derive(Debug, Serialize)]
pub struct TransformOutput {
    pub code: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub map: Option<String>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub output: Option<String>,
}

#[cfg(not(feature = "node"))]
#[derive(Debug, Serialize)]
pub struct TransformOutput {
    pub code: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub map: Option<String>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub output: Option<String>,
}

/// This method parses a javascript / typescript file
///
/// This should be called in a scope of [swc_common::GLOBALS].
pub fn parse_js(
    _cm: Lrc<SourceMap>,
    fm: Lrc<SourceFile>,
    handler: &Handler,
    target: EsVersion,
    syntax: Syntax,
    is_module: IsModule,
    comments: Option<&dyn Comments>,
) -> Result<Program, Error> {
    let mut res = (|| {
        let mut error = false;

        let mut errors = std::vec::Vec::new();
        let program_result = match is_module {
            IsModule::Bool(true) => {
                parse_file_as_module(&fm, syntax, target, comments, &mut errors)
                    .map(Program::Module)
            }
            IsModule::Bool(false) => {
                parse_file_as_script(&fm, syntax, target, comments, &mut errors)
                    .map(Program::Script)
            }
            IsModule::Unknown => parse_file_as_program(&fm, syntax, target, comments, &mut errors),
        };

        for e in errors {
            e.into_diagnostic(handler).emit();
            error = true;
        }

        let program = program_result.map_err(|e| {
            e.into_diagnostic(handler).emit();
            Error::msg("Syntax Error")
        })?;

        if error {
            return Err(anyhow::anyhow!("Syntax Error"));
        }

        Ok(program)
    })();

    if env::var("SWC_DEBUG").unwrap_or_default() == "1" {
        res = res.with_context(|| format!("Parser config: {:?}", syntax));
    }

    res
}

pub struct PrintArgs<'a> {
    pub source_root: Option<&'a str>,
    pub source_file_name: Option<&'a str>,
    pub output_path: Option<PathBuf>,
    pub inline_sources_content: bool,
    pub source_map: SourceMapsConfig,
    pub source_map_names: &'a AHashMap<BytePos, JsWord>,
    pub orig: Option<&'a sourcemap::SourceMap>,
    pub comments: Option<&'a dyn Comments>,
    pub emit_source_map_columns: bool,
    pub preamble: &'a str,
    pub codegen_config: swc_ecma_codegen::Config,
    pub output: Option<FxHashMap<String, serde_json::Value>>,
}

impl Default for PrintArgs<'_> {
    fn default() -> Self {
        static DUMMY_NAMES: Lazy<AHashMap<BytePos, JsWord>> = Lazy::new(Default::default);

        PrintArgs {
            source_root: None,
            source_file_name: None,
            output_path: None,
            inline_sources_content: false,
            source_map: Default::default(),
            source_map_names: &DUMMY_NAMES,
            orig: None,
            comments: None,
            emit_source_map_columns: false,
            preamble: "",
            codegen_config: Default::default(),
            output: None,
        }
    }
}

/// Converts ast node to source string and sourcemap.
///
///
/// This method receives target file path, but does not write file to the
/// path. See: https://github.com/swc-project/swc/issues/1255
///
///
///
/// This should be called in a scope of [swc_common::GLOBALS].
#[allow(clippy::too_many_arguments)]
pub fn print<T>(
    cm: Lrc<SourceMap>,
    node: &T,
    PrintArgs {
        source_root,
        source_file_name,
        output_path,
        inline_sources_content,
        source_map,
        source_map_names,
        orig,
        comments,
        emit_source_map_columns,
        preamble,
        codegen_config,
        output,
    }: PrintArgs,
) -> Result<TransformOutput, Error>
where
    T: Node + VisitWith<IdentCollector>,
{
    let _timer = timer!("Compiler::print");

    let mut src_map_buf = Vec::new();

    let src = {
        let mut buf = std::vec::Vec::new();
        {
            let mut w = swc_ecma_codegen::text_writer::JsWriter::new(
                cm.clone(),
                "\n",
                &mut buf,
                if source_map.enabled() {
                    Some(&mut src_map_buf)
                } else {
                    None
                },
            );
            w.preamble(preamble).unwrap();
            let mut wr = Box::new(w) as Box<dyn WriteJs>;

            if codegen_config.minify {
                wr = Box::new(swc_ecma_codegen::text_writer::omit_trailing_semi(wr));
            }

            let mut emitter = Emitter {
                cfg: codegen_config,
                comments,
                cm: cm.clone(),
                wr,
            };

            node.emit_with(&mut emitter)
                .context("failed to emit module")?;
        }
        // Invalid utf8 is valid in javascript world.
        String::from_utf8(buf).expect("invalid utf8 character detected")
    };

    if cfg!(debug_assertions)
        && !src_map_buf.is_empty()
        && src_map_buf.iter().all(|(bp, _)| bp.is_dummy())
        && src.lines().count() >= 3
        && option_env!("SWC_DEBUG") == Some("1")
    {
        panic!("The module contains only dummy spans\n{}", src);
    }

    let mut map = if source_map.enabled() {
        Some(cm.build_source_map_with_config(
            &src_map_buf,
            orig,
            SwcSourceMapConfig {
                source_file_name,
                output_path: output_path.as_deref(),
                names: source_map_names,
                inline_sources_content,
                emit_columns: emit_source_map_columns,
            },
        ))
    } else {
        None
    };

    if let Some(map) = &mut map {
        if source_root.is_some() {
            map.set_source_root(source_root)
        }
    }

    let (code, map) = match source_map {
        SourceMapsConfig::Bool(v) => {
            if v {
                let mut buf = std::vec::Vec::new();

                map.unwrap()
                    .to_writer(&mut buf)
                    .context("failed to write source map")?;
                let map = String::from_utf8(buf).context("source map is not utf-8")?;
                (src, Some(map))
            } else {
                (src, None)
            }
        }
        SourceMapsConfig::Str(_) => {
            let mut src = src;
            let mut buf = std::vec::Vec::new();

            map.unwrap()
                .to_writer(&mut buf)
                .context("failed to write source map file")?;
            let map = String::from_utf8(buf).context("source map is not utf-8")?;

            src.push_str("\n//# sourceMappingURL=data:application/json;base64,");
            BASE64_STANDARD.encode_string(map.as_bytes(), &mut src);
            (src, None)
        }
    };

    Ok(TransformOutput {
        code,
        map,
        output: output
            .map(|v| serde_json::to_string(&v).context("failed to serilaize output"))
            .transpose()?,
    })
}

struct SwcSourceMapConfig<'a> {
    source_file_name: Option<&'a str>,
    /// Output path of the `.map` file.
    output_path: Option<&'a Path>,

    names: &'a AHashMap<BytePos, JsWord>,

    inline_sources_content: bool,

    emit_columns: bool,
}

impl SourceMapGenConfig for SwcSourceMapConfig<'_> {
    fn file_name_to_source(&self, f: &FileName) -> String {
        if let Some(file_name) = self.source_file_name {
            return file_name.to_string();
        }

        let base_path = match self.output_path {
            Some(v) => v,
            None => return f.to_string(),
        };
        let target = match f {
            FileName::Real(v) => v,
            _ => return f.to_string(),
        };

        let rel = pathdiff::diff_paths(target, base_path);
        match rel {
            Some(v) => {
                let s = v.to_string_lossy().to_string();
                if cfg!(target_os = "windows") {
                    s.replace('\\', "/")
                } else {
                    s
                }
            }
            None => f.to_string(),
        }
    }

    fn name_for_bytepos(&self, pos: BytePos) -> Option<&str> {
        self.names.get(&pos).map(|v| &**v)
    }

    fn inline_sources_content(&self, _: &FileName) -> bool {
        self.inline_sources_content
    }

    fn emit_columns(&self, _f: &FileName) -> bool {
        self.emit_columns
    }

    fn skip(&self, f: &FileName) -> bool {
        match f {
            FileName::Internal(..) => true,
            FileName::Custom(s) => s.starts_with('<'),
            _ => false,
        }
    }
}

pub fn minify_file_comments(
    comments: &SingleThreadedComments,
    preserve_comments: BoolOr<JsMinifyCommentOption>,
    preserve_annotations: bool,
) {
    match preserve_comments {
        BoolOr::Bool(true) | BoolOr::Data(JsMinifyCommentOption::PreserveAllComments) => {}

        BoolOr::Data(JsMinifyCommentOption::PreserveSomeComments) => {
            let preserve_excl = |_: &BytePos, vc: &mut std::vec::Vec<Comment>| -> bool {
                // Preserve license comments.
                //
                // See https://github.com/terser/terser/blob/798135e04baddd94fea403cfaab4ba8b22b1b524/lib/output.js#L175-L181
                vc.retain(|c: &Comment| {
                    c.text.contains("@lic")
                        || c.text.contains("@preserve")
                        || c.text.contains("@copyright")
                        || c.text.contains("@cc_on")
                        || (preserve_annotations
                            && (c.text.contains("__PURE__")
                                || c.text.contains("__INLINE__")
                                || c.text.contains("__NOINLINE__")
                                || c.text.contains("@vite-ignore")))
                        || (c.kind == CommentKind::Block && c.text.starts_with('!'))
                });
                !vc.is_empty()
            };
            let (mut l, mut t) = comments.borrow_all_mut();

            l.retain(preserve_excl);
            t.retain(preserve_excl);
        }

        BoolOr::Bool(false) => {
            let (mut l, mut t) = comments.borrow_all_mut();
            l.clear();
            t.clear();
        }
    }
}

/// Configuration related to source map generated by swc.
#[derive(Clone, Serialize, Deserialize, Debug)]
#[serde(untagged)]
pub enum SourceMapsConfig {
    Bool(bool),
    Str(String),
}

impl SourceMapsConfig {
    pub fn enabled(&self) -> bool {
        match *self {
            SourceMapsConfig::Bool(b) => b,
            SourceMapsConfig::Str(ref s) => {
                assert_eq!(s, "inline", "Source map must be true, false or inline");
                true
            }
        }
    }
}

impl Default for SourceMapsConfig {
    fn default() -> Self {
        SourceMapsConfig::Bool(true)
    }
}

pub struct IdentCollector {
    pub names: AHashMap<BytePos, JsWord>,
}

impl Visit for IdentCollector {
    noop_visit_type!();

    fn visit_ident(&mut self, ident: &Ident) {
        self.names.insert(ident.span.lo, ident.sym.clone());
    }

    fn visit_ident_name(&mut self, ident: &IdentName) {
        self.names.insert(ident.span.lo, ident.sym.clone());
    }
}
