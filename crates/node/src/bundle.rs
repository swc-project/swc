use crate::{
    get_compiler,
    util::{CtxtExt, MapErr},
};
use anyhow::{bail, Error};
use napi::{CallContext, Env, JsObject, Status, Task};
use serde::Deserialize;
use std::{
    panic::{catch_unwind, AssertUnwindSafe},
    sync::Arc,
};
use swc::{
    config::SourceMapsConfig,
    resolver::{environment_resolver, paths_resolver},
    Compiler, TransformOutput,
};
use swc_atoms::{js_word, JsWord};
use swc_bundler::{BundleKind, Bundler, Load, ModuleRecord, Resolve};
use swc_common::{collections::AHashMap, Span};
use swc_ecma_ast::{
    Bool, Expr, ExprOrSuper, Ident, KeyValueProp, Lit, MemberExpr, MetaPropExpr, PropName, Str,
};
use swc_ecma_loader::{TargetEnv, NODE_BUILTINS};

struct ConfigItem {
    loader: Box<dyn Load>,
    resolver: Box<dyn Resolve>,
    static_items: StaticConfigItem,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct StaticConfigItem {
    #[serde(flatten)]
    config: swc_node_bundler::config::Config,
}

struct BundleTask {
    swc: Arc<swc::Compiler>,
    config: ConfigItem,
}

impl Task for BundleTask {
    type Output = AHashMap<String, TransformOutput>;
    type JsValue = JsObject;

    fn compute(&mut self) -> napi::Result<Self::Output> {
        let builtins = if let TargetEnv::Node = self.config.static_items.config.target {
            NODE_BUILTINS
                .to_vec()
                .into_iter()
                .map(JsWord::from)
                .collect::<Vec<_>>()
        } else {
            vec![]
        };

        // Defaults to es3
        let codegen_target = self
            .config
            .static_items
            .config
            .codegen_target()
            .unwrap_or_default();

        let res = catch_unwind(AssertUnwindSafe(|| {
            let mut bundler = Bundler::new(
                self.swc.globals(),
                self.swc.cm.clone(),
                &self.config.loader,
                &self.config.resolver,
                swc_bundler::Config {
                    require: true,
                    external_modules: builtins
                        .into_iter()
                        .chain(
                            self.config
                                .static_items
                                .config
                                .external_modules
                                .iter()
                                .cloned(),
                        )
                        .collect(),
                    ..Default::default()
                },
                Box::new(Hook),
            );

            let result = bundler
                .bundle(self.config.static_items.config.entry.clone().into())
                .convert_err()?;

            let result = result
                .into_iter()
                .map(|bundle| match bundle.kind {
                    BundleKind::Named { name } | BundleKind::Lib { name } => {
                        Ok((name, bundle.module))
                    }
                    BundleKind::Dynamic => bail!("unimplemented: dynamic code splitting"),
                })
                .map(|res| {
                    res.and_then(|(k, m)| {
                        // TODO: Source map
                        let minify = self
                            .config
                            .static_items
                            .config
                            .options
                            .as_ref()
                            .map(|v| v.config.minify)
                            .unwrap_or(false);

                        let output = self.swc.print(
                            &m,
                            None,
                            None,
                            true,
                            codegen_target,
                            SourceMapsConfig::Bool(true),
                            // TODO
                            &Default::default(),
                            None,
                            minify,
                            None,
                        )?;

                        Ok((k, output))
                    })
                })
                .collect::<Result<_, _>>()
                .convert_err()?;

            Ok(result)
        }));

        let err = match res {
            Ok(v) => return v,
            Err(err) => err,
        };

        if let Some(s) = err.downcast_ref::<String>() {
            return Err(napi::Error::new(
                Status::GenericFailure,
                format!("panic detected: {}", s),
            ));
        }

        Err(napi::Error::new(
            Status::GenericFailure,
            format!("panic detected"),
        ))
    }

    fn resolve(self, env: Env, output: Self::Output) -> napi::Result<Self::JsValue> {
        env.to_js_value(&output)?.coerce_to_object()
    }
}

#[js_function(1)]
pub(crate) fn bundle(cx: CallContext) -> napi::Result<JsObject> {
    let c: Arc<Compiler> = get_compiler(&cx);

    let static_items: StaticConfigItem = cx.get_deserialized(0)?;

    let loader = Box::new(swc_node_bundler::loaders::swc::SwcLoader::new(
        c.clone(),
        static_items
            .config
            .options
            .as_ref()
            .cloned()
            .unwrap_or_else(|| {
                serde_json::from_value(serde_json::Value::Object(Default::default())).unwrap()
            }),
    ));

    let target_env = static_items.config.target;

    let paths = static_items.config.options.as_ref().map(|options| {
        let paths: Vec<(String, Vec<String>)> = options
            .config
            .jsc
            .paths
            .iter()
            .map(|(k, v)| (k.clone(), v.clone()))
            .collect();
        (options.config.jsc.base_url.clone(), paths)
    });

    let alias = static_items
        .config
        .alias
        .get(&target_env)
        .map(|a| a.clone())
        .unwrap_or_else(|| Default::default());

    let resolver: Box<dyn Resolve> = if let Some((base_url, paths)) = paths {
        Box::new(paths_resolver(target_env, alias, base_url, paths))
    } else {
        Box::new(environment_resolver(target_env, alias))
    };

    cx.env
        .spawn(BundleTask {
            swc: c.clone(),
            config: ConfigItem {
                loader,
                resolver,
                static_items,
            },
        })
        .map(|t| t.promise_object())
}

struct Hook;

impl swc_bundler::Hook for Hook {
    fn get_import_meta_props(
        &self,
        span: Span,
        module_record: &ModuleRecord,
    ) -> Result<Vec<KeyValueProp>, Error> {
        Ok(vec![
            KeyValueProp {
                key: PropName::Ident(Ident::new(js_word!("url"), span)),
                value: Box::new(Expr::Lit(Lit::Str(Str {
                    span,
                    value: module_record.file_name.to_string().into(),
                    has_escape: false,
                    kind: Default::default(),
                }))),
            },
            KeyValueProp {
                key: PropName::Ident(Ident::new(js_word!("main"), span)),
                value: Box::new(if module_record.is_entry {
                    Expr::Member(MemberExpr {
                        span,
                        obj: ExprOrSuper::Expr(Box::new(Expr::MetaProp(MetaPropExpr {
                            meta: Ident::new(js_word!("import"), span),
                            prop: Ident::new(js_word!("meta"), span),
                        }))),
                        prop: Box::new(Expr::Ident(Ident::new(js_word!("main"), span))),
                        computed: false,
                    })
                } else {
                    Expr::Lit(Lit::Bool(Bool { span, value: false }))
                }),
            },
        ])
    }
}
