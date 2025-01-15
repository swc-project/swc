use std::sync::Arc;

use anyhow::{Context, Error};
use napi::{
    bindgen_prelude::{AbortSignal, AsyncTask, Buffer, External},
    JsObject, Task,
};
use serde::Deserialize;
use swc_compiler_base::{
    minify_file_comments, parse_js, IdentCollector, PrintArgs, SourceMapsConfig, TransformOutput,
};
use swc_config::config_types::BoolOr;
use swc_core::{
    base::JsMinifyExtras,
    common::{
        collections::AHashMap,
        comments::{Comments, SingleThreadedComments},
        sync::Lrc,
        FileName, Mark, SourceFile, SourceMap,
    },
    ecma::{
        minifier::{
            js::{JsMinifyCommentOption, JsMinifyOptions},
            option::{MangleCache, MinifyOptions, SimpleMangleCache, TopLevelOptions},
        },
        parser::{EsSyntax, Syntax},
        transforms::base::{fixer::fixer, hygiene::hygiene, resolver},
        visit::{FoldWith, VisitMutWith, VisitWith},
    },
};
use swc_nodejs_common::{deserialize_json, get_deserialized, MapErr};

use crate::util::try_with;

#[napi(object)]
pub struct NapiMinifyExtra {
    #[napi(ts_type = "object")]
    pub mangle_name_cache: Option<NameMangleCache>,
}

struct MinifyTask {
    code: String,
    options: String,
    extras: JsMinifyExtras,
}

#[derive(Deserialize)]
#[serde(untagged)]
enum MinifyTarget {
    /// Code to minify.
    Single(String),
    /// `{ filename: code }`
    Map(AHashMap<String, String>),
}

impl MinifyTarget {
    fn to_file(&self, cm: Lrc<SourceMap>) -> Lrc<SourceFile> {
        match self {
            MinifyTarget::Single(code) => cm.new_source_file(FileName::Anon.into(), code.clone()),
            MinifyTarget::Map(codes) => {
                assert_eq!(
                    codes.len(),
                    1,
                    "swc.minify does not support concatting multiple files yet"
                );

                let (filename, code) = codes.iter().next().unwrap();

                cm.new_source_file(FileName::Real(filename.clone().into()).into(), code.clone())
            }
        }
    }
}

fn do_work(
    input: MinifyTarget,
    options: JsMinifyOptions,
    extras: JsMinifyExtras,
) -> napi::Result<TransformOutput> {
    let cm: Arc<SourceMap> = Arc::default();

    let fm = input.to_file(cm.clone());

    try_with(cm.clone(), false, |handler| {
        let target = options.ecma.clone().into();

        let (source_map, orig) = options
            .source_map
            .as_ref()
            .map(|obj| -> Result<_, Error> {
                Ok((
                    SourceMapsConfig::Bool(true),
                    obj.content.as_ref().map(|s| s.to_sourcemap()).transpose()?,
                ))
            })
            .unwrap_as_option(|v| {
                Some(Ok(match v {
                    Some(true) => (SourceMapsConfig::Bool(true), None),
                    _ => (SourceMapsConfig::Bool(false), None),
                }))
            })
            .unwrap()?;

        let mut min_opts = MinifyOptions {
            compress: options
                .compress
                .clone()
                .unwrap_as_option(|default| match default {
                    Some(true) | None => Some(Default::default()),
                    _ => None,
                })
                .map(|v| v.into_config(cm.clone())),
            mangle: options
                .mangle
                .clone()
                .unwrap_as_option(|default| match default {
                    Some(true) | None => Some(Default::default()),
                    _ => None,
                }),
            ..Default::default()
        };

        let comments = SingleThreadedComments::default();

        let module = parse_js(
            cm.clone(),
            fm.clone(),
            handler,
            target,
            Syntax::Es(EsSyntax {
                jsx: true,
                decorators: true,
                decorators_before_export: true,
                import_attributes: true,
                ..Default::default()
            }),
            options.module,
            Some(&comments),
        )
        .context("failed to parse input file")?;

        // top_level defaults to true if module is true

        // https://github.com/swc-project/swc/issues/2254

        if module.is_module() {
            if let Some(opts) = &mut min_opts.compress {
                if opts.top_level.is_none() {
                    opts.top_level = Some(TopLevelOptions { functions: true });
                }
            }

            if let Some(opts) = &mut min_opts.mangle {
                if opts.top_level.is_none() {
                    opts.top_level = Some(true);
                }
            }
        }

        if options.keep_fnames {
            if let Some(opts) = &mut min_opts.compress {
                opts.keep_fnames = true;
            }
            if let Some(opts) = &mut min_opts.mangle {
                opts.keep_fn_names = true;
            }
        }

        let source_map_names = if source_map.enabled() {
            let mut v = IdentCollector {
                names: Default::default(),
            };

            module.visit_with(&mut v);

            v.names
        } else {
            Default::default()
        };

        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        let is_mangler_enabled = min_opts.mangle.is_some();

        let module = {
            let module = module.apply(resolver(unresolved_mark, top_level_mark, false));

            let mut module = swc_core::ecma::minifier::optimize(
                module,
                cm.clone(),
                Some(&comments),
                None,
                &min_opts,
                &swc_core::ecma::minifier::option::ExtraOptions {
                    unresolved_mark,
                    top_level_mark,
                    mangle_name_cache: extras.mangle_name_cache,
                },
            );

            if !is_mangler_enabled {
                module.visit_mut_with(&mut hygiene())
            }
            module.visit_mut_with(&mut fixer(Some(&comments as &dyn Comments)));
            module
        };

        let preserve_comments = options
            .format
            .comments
            .clone()
            .into_inner()
            .unwrap_or(BoolOr::Data(JsMinifyCommentOption::PreserveSomeComments));
        minify_file_comments(
            &comments,
            preserve_comments,
            options.format.preserve_annotations,
        );

        swc_compiler_base::print(
            cm.clone(),
            &module,
            PrintArgs {
                source_file_name: Some(&fm.name.to_string()),
                output_path: options.output_path.clone().map(From::from),
                inline_sources_content: options.inline_sources_content,
                source_map,
                source_map_names: &source_map_names,
                orig: orig.as_ref(),
                comments: Some(&comments),
                emit_source_map_columns: options.emit_source_map_columns,
                preamble: &options.format.preamble,
                codegen_config: swc_core::ecma::codegen::Config::default()
                    .with_target(target)
                    .with_minify(true)
                    .with_ascii_only(options.format.ascii_only)
                    .with_emit_assert_for_import_attributes(
                        options.format.emit_assert_for_import_attributes,
                    ),
                ..Default::default()
            },
        )
    })
    .convert_err()
}

#[napi]
impl Task for MinifyTask {
    type JsValue = TransformOutput;
    type Output = TransformOutput;

    fn compute(&mut self) -> napi::Result<Self::Output> {
        let input: MinifyTarget = deserialize_json(&self.code)?;
        let options: JsMinifyOptions = deserialize_json(&self.options)?;

        do_work(input, options, self.extras.clone())
    }

    fn resolve(&mut self, _env: napi::Env, output: Self::Output) -> napi::Result<Self::JsValue> {
        Ok(output)
    }
}

type NameMangleCache = External<Arc<dyn MangleCache>>;

#[napi(ts_return_type = "object")]
fn new_mangle_name_cache() -> NameMangleCache {
    let cache = Arc::new(SimpleMangleCache::default());
    External::new(cache)
}

#[napi]
fn minify(
    code: Buffer,
    opts: Buffer,
    extras: NapiMinifyExtra,
    signal: Option<AbortSignal>,
) -> AsyncTask<MinifyTask> {
    crate::util::init_default_trace_subscriber();
    let code = String::from_utf8_lossy(code.as_ref()).to_string();
    let options = String::from_utf8_lossy(opts.as_ref()).to_string();
    let extras = JsMinifyExtras::default()
        .with_mangle_name_cache(extras.mangle_name_cache.as_deref().cloned());

    let task = MinifyTask {
        code,
        options,
        extras,
    };

    AsyncTask::with_optional_signal(task, signal)
}

#[napi]
pub fn minify_sync(
    code: Buffer,
    opts: Buffer,
    extras: NapiMinifyExtra,
) -> napi::Result<TransformOutput> {
    crate::util::init_default_trace_subscriber();
    let input: MinifyTarget = get_deserialized(code)?;
    let options = get_deserialized(opts)?;
    let extras = JsMinifyExtras::default()
        .with_mangle_name_cache(extras.mangle_name_cache.as_deref().cloned());

    do_work(input, options, extras)
}
