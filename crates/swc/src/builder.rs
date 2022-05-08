use std::{cell::RefCell, collections::HashMap, path::PathBuf, rc::Rc, sync::Arc};

use compat::{es2015::regenerator, es2020::export_namespace_from};
use either::Either;
use swc_atoms::JsWord;
use swc_common::{
    chain,
    comments::{Comments, SingleThreadedComments},
    errors::Handler,
    sync::Lrc,
    util::take::Take,
    FileName, Mark, SourceMap,
};
use swc_ecma_ast::{EsVersion, Module};
use swc_ecma_minifier::option::{terser::TerserTopLevelOptions, MinifyOptions};
use swc_ecma_parser::Syntax;
use swc_ecma_transforms::{
    compat, compat::es2022::private_in_object, fixer, helpers, hygiene,
    hygiene::hygiene_with_config, modules, modules::util::Scope, optimization::const_modules,
    pass::Optional, Assumptions,
};
use swc_ecma_visit::{as_folder, noop_visit_mut_type, VisitMut};

use crate::config::{
    util::BoolOrObject, CompiledPaths, GlobalPassOption, JsMinifyOptions, ModuleConfig,
};

/// Builder is used to create a high performance `Compiler`.
pub struct PassBuilder<'a, 'b, P: swc_ecma_visit::Fold> {
    cm: &'a Arc<SourceMap>,
    handler: &'b Handler,
    env: Option<swc_ecma_preset_env::Config>,
    pass: P,
    /// [Mark] for top level bindings .
    top_level_mark: Mark,

    /// [Mark] for unresolved refernces.
    unresolved_mark: Mark,

    target: EsVersion,
    loose: bool,
    assumptions: Assumptions,
    hygiene: Option<hygiene::Config>,
    fixer: bool,
    inject_helpers: bool,
    minify: Option<JsMinifyOptions>,
    regenerator: regenerator::Config,
}

impl<'a, 'b, P: swc_ecma_visit::Fold> PassBuilder<'a, 'b, P> {
    pub fn new(
        cm: &'a Arc<SourceMap>,
        handler: &'b Handler,
        loose: bool,
        assumptions: Assumptions,
        top_level_mark: Mark,
        unresolved_mark: Mark,
        pass: P,
    ) -> Self {
        PassBuilder {
            cm,
            handler,
            env: None,
            pass,
            top_level_mark,
            unresolved_mark,
            target: EsVersion::Es5,
            loose,
            assumptions,
            hygiene: Some(Default::default()),
            fixer: true,
            inject_helpers: true,
            minify: None,
            regenerator: Default::default(),
        }
    }

    pub fn then<N>(self, next: N) -> PassBuilder<'a, 'b, swc_visit::AndThen<P, N>>
    where
        N: swc_ecma_visit::Fold,
    {
        let pass = chain!(self.pass, next);
        PassBuilder {
            cm: self.cm,
            handler: self.handler,
            env: self.env,
            pass,
            top_level_mark: self.top_level_mark,
            unresolved_mark: self.unresolved_mark,
            target: self.target,
            loose: self.loose,
            assumptions: self.assumptions,
            hygiene: self.hygiene,
            fixer: self.fixer,
            inject_helpers: self.inject_helpers,
            minify: self.minify,
            regenerator: self.regenerator,
        }
    }

    pub fn skip_helper_injection(mut self, skip: bool) -> Self {
        self.inject_helpers = !skip;
        self
    }

    pub fn minify(mut self, options: Option<JsMinifyOptions>) -> Self {
        self.minify = options;
        self
    }

    /// Note: fixer is enabled by default.
    pub fn fixer(mut self, enable: bool) -> Self {
        self.fixer = enable;
        self
    }

    /// Note: hygiene is enabled by default.
    ///
    /// If you pass [None] to this method, the `hygiene` pass will be disabled.
    pub fn hygiene(mut self, config: Option<hygiene::Config>) -> Self {
        self.hygiene = config;
        self
    }

    pub fn const_modules(
        self,
        globals: HashMap<JsWord, HashMap<JsWord, String>>,
    ) -> PassBuilder<'a, 'b, impl swc_ecma_visit::Fold> {
        let cm = self.cm.clone();
        self.then(const_modules(cm, globals))
    }

    pub fn inline_globals(
        self,
        c: GlobalPassOption,
    ) -> PassBuilder<'a, 'b, impl swc_ecma_visit::Fold> {
        let pass = c.build(self.cm, self.handler);
        self.then(pass)
    }

    pub fn target(mut self, target: EsVersion) -> Self {
        self.target = target;
        self
    }

    pub fn preset_env(mut self, env: Option<swc_ecma_preset_env::Config>) -> Self {
        self.env = env;
        self
    }

    pub fn regenerator(mut self, config: regenerator::Config) -> Self {
        self.regenerator = config;
        self
    }

    /// # Arguments
    /// ## module
    ///  - Use `None` if you want swc to emit import statements.
    ///
    ///
    /// Returned pass includes
    ///
    ///  - compatibility helper
    ///  - module handler
    ///  - helper injector
    ///  - identifier hygiene handler if enabled
    ///  - fixer if enabled
    pub fn finalize<'cmt>(
        self,
        base_url: PathBuf,
        paths: CompiledPaths,
        base: &FileName,
        syntax: Syntax,
        module: Option<ModuleConfig>,
        comments: Option<&'cmt SingleThreadedComments>,
    ) -> impl 'cmt + swc_ecma_visit::Fold
    where
        P: 'cmt,
    {
        let need_interop_analysis = match module {
            Some(ModuleConfig::CommonJs(ref c)) => !c.no_interop,
            Some(ModuleConfig::Amd(ref c)) => !c.config.no_interop,
            Some(ModuleConfig::Umd(ref c)) => !c.config.no_interop,
            Some(ModuleConfig::SystemJs(_)) | Some(ModuleConfig::Es6) | None => false,
        };

        // compat
        let compat_pass = if let Some(env) = self.env {
            Either::Left(swc_ecma_preset_env::preset_env(
                self.top_level_mark,
                comments,
                env,
                self.assumptions,
            ))
        } else {
            let assumptions = self.assumptions;
            Either::Right(chain!(
                Optional::new(
                    compat::es2022::es2022(
                        comments,
                        compat::es2022::Config {
                            class_properties: compat::es2022::class_properties::Config {
                                private_as_properties: assumptions.private_fields_as_properties,
                                constant_super: assumptions.constant_super,
                                set_public_fields: assumptions.set_public_class_fields,
                                no_document_all: assumptions.no_document_all
                            }
                        }
                    ),
                    should_enable(self.target, EsVersion::Es2022)
                ),
                Optional::new(
                    compat::es2021::es2021(),
                    should_enable(self.target, EsVersion::Es2021)
                ),
                Optional::new(
                    compat::es2020::es2020(compat::es2020::Config {
                        nullish_coalescing: compat::es2020::nullish_coalescing::Config {
                            no_document_all: assumptions.no_document_all
                        },
                        optional_chaining: compat::es2020::opt_chaining::Config {
                            no_document_all: assumptions.no_document_all,
                            pure_getter: assumptions.pure_getters
                        }
                    }),
                    should_enable(self.target, EsVersion::Es2020)
                ),
                Optional::new(
                    compat::es2019::es2019(),
                    should_enable(self.target, EsVersion::Es2019)
                ),
                Optional::new(
                    compat::es2018(compat::es2018::Config {
                        object_rest_spread: compat::es2018::object_rest_spread::Config {
                            no_symbol: assumptions.object_rest_no_symbols,
                            set_property: assumptions.set_spread_properties
                        }
                    }),
                    should_enable(self.target, EsVersion::Es2018)
                ),
                Optional::new(
                    compat::es2017(compat::es2017::Config {
                        async_to_generator: compat::es2017::async_to_generator::Config {
                            ignore_function_name: assumptions.ignore_function_name,
                            ignore_function_length: assumptions.ignore_function_length
                        }
                    }),
                    should_enable(self.target, EsVersion::Es2017)
                ),
                Optional::new(
                    compat::es2016(),
                    should_enable(self.target, EsVersion::Es2016)
                ),
                Optional::new(
                    compat::es2015(
                        self.unresolved_mark,
                        comments,
                        compat::es2015::Config {
                            classes: compat::es2015::classes::Config {
                                constant_super: assumptions.constant_super,
                                no_class_calls: assumptions.no_class_calls,
                                set_class_methods: assumptions.set_class_methods,
                                super_is_callable_constructor: assumptions
                                    .super_is_callable_constructor
                            },
                            computed_props: compat::es2015::computed_props::Config {
                                loose: self.loose
                            },
                            for_of: compat::es2015::for_of::Config {
                                assume_array: self.loose
                            },
                            spread: compat::es2015::spread::Config { loose: self.loose },
                            destructuring: compat::es2015::destructuring::Config {
                                loose: self.loose
                            },
                            regenerator: self.regenerator,
                            template_literal: compat::es2015::template_literal::Config {
                                ignore_to_primitive: assumptions.ignore_to_primitive_hint,
                                mutable_template: assumptions.mutable_template_object
                            },
                            parameters: compat::es2015::parameters::Config {
                                ignore_function_length: assumptions.ignore_function_length,
                            },
                            typescript: syntax.typescript()
                        }
                    ),
                    should_enable(self.target, EsVersion::Es2015)
                ),
                Optional::new(
                    compat::es3(true),
                    cfg!(feature = "es3") && self.target == EsVersion::Es3
                )
            ))
        };

        let is_mangler_enabled = self
            .minify
            .as_ref()
            .map(|v| matches!(v.mangle, BoolOrObject::Bool(true) | BoolOrObject::Obj(_)))
            .unwrap_or(false);

        let module_scope = Rc::new(RefCell::new(Scope::default()));
        chain!(
            self.pass,
            Optional::new(private_in_object(), syntax.private_in_object()),
            compat_pass,
            // module / helper
            Optional::new(
                modules::import_analysis::import_analyzer(Rc::clone(&module_scope)),
                need_interop_analysis
            ),
            compat::reserved_words::reserved_words(),
            Optional::new(export_namespace_from(), need_interop_analysis),
            Optional::new(helpers::inject_helpers(), self.inject_helpers),
            ModuleConfig::build(
                self.cm.clone(),
                base_url,
                paths,
                base,
                self.unresolved_mark,
                module,
                Rc::clone(&module_scope)
            ),
            as_folder(MinifierPass {
                options: self.minify,
                cm: self.cm.clone(),
                comments: comments.cloned(),
                unresolved_mark: self.unresolved_mark,
                top_level_mark: self.top_level_mark,
            }),
            Optional::new(
                hygiene_with_config(self.hygiene.clone().unwrap_or_default()),
                self.hygiene.is_some() && !is_mangler_enabled
            ),
            Optional::new(fixer(comments.map(|v| v as &dyn Comments)), self.fixer),
        )
    }
}

struct MinifierPass {
    options: Option<JsMinifyOptions>,
    cm: Lrc<SourceMap>,
    comments: Option<SingleThreadedComments>,
    unresolved_mark: Mark,
    top_level_mark: Mark,
}

impl VisitMut for MinifierPass {
    noop_visit_mut_type!();

    fn visit_mut_module(&mut self, m: &mut Module) {
        if let Some(options) = &self.options {
            let opts = MinifyOptions {
                compress: options.compress.clone().into_obj().map(|mut v| {
                    if v.const_to_let.is_none() {
                        v.const_to_let = Some(true);
                    }
                    if v.toplevel.is_none() {
                        v.toplevel = Some(TerserTopLevelOptions::Bool(true));
                    }

                    v.into_config(self.cm.clone())
                }),
                mangle: options.mangle.clone().into_obj(),
                ..Default::default()
            };

            if opts.compress.is_none() && opts.mangle.is_none() {
                return;
            }

            m.map_with_mut(|m| {
                swc_ecma_minifier::optimize(
                    m,
                    self.cm.clone(),
                    self.comments.as_ref().map(|v| v as &dyn Comments),
                    None,
                    &opts,
                    &swc_ecma_minifier::option::ExtraOptions {
                        unresolved_mark: self.unresolved_mark,
                        top_level_mark: self.top_level_mark,
                    },
                )
            })
        }
    }
}

fn should_enable(target: EsVersion, feature: EsVersion) -> bool {
    target < feature
}
