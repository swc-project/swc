use crate::{
    config::{CompiledPaths, GlobalPassOption, JsMinifyOptions, JscTarget, ModuleConfig},
    SwcComments,
};
use compat::es2020::export_namespace_from;
use either::Either;
use std::{cell::RefCell, collections::HashMap, rc::Rc, sync::Arc};
use swc_atoms::JsWord;
use swc_common::{
    chain, comments::Comments, errors::Handler, sync::Lrc, FileName, Mark, SourceMap,
};
use swc_ecma_ast::Module;
use swc_ecma_minifier::{hygiene_optimizer, option::MinifyOptions, unique_scope};
use swc_ecma_parser::Syntax;
use swc_ecma_transforms::{
    compat, fixer, helpers, hygiene, hygiene::hygiene_with_config, modules, modules::util::Scope,
    optimization::const_modules, pass::Optional, proposals::import_assertions, typescript,
};
use swc_ecma_transforms_base::ext::MapWithMut;
use swc_ecma_visit::{as_folder, noop_visit_mut_type, VisitMut};

/// Builder is used to create a high performance `Compiler`.
pub struct PassBuilder<'a, 'b, P: swc_ecma_visit::Fold> {
    cm: &'a Arc<SourceMap>,
    handler: &'b Handler,
    env: Option<swc_ecma_preset_env::Config>,
    pass: P,
    /// [Mark] for top level bindings and unresolved identifier references.
    global_mark: Mark,
    target: JscTarget,
    loose: bool,
    hygiene: Option<hygiene::Config>,
    optimize_hygiene: bool,
    fixer: bool,
    inject_helpers: bool,
    minify: Option<JsMinifyOptions>,
}

impl<'a, 'b, P: swc_ecma_visit::Fold> PassBuilder<'a, 'b, P> {
    pub fn new(
        cm: &'a Arc<SourceMap>,
        handler: &'b Handler,
        loose: bool,
        global_mark: Mark,
        pass: P,
    ) -> Self {
        PassBuilder {
            cm,
            handler,
            env: None,
            pass,
            global_mark,
            target: JscTarget::Es5,
            loose,
            hygiene: Some(Default::default()),
            optimize_hygiene: false,
            fixer: true,
            inject_helpers: true,
            minify: None,
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
            global_mark: self.global_mark,
            target: self.target,
            loose: self.loose,
            hygiene: self.hygiene,
            optimize_hygiene: self.optimize_hygiene,
            fixer: self.fixer,
            inject_helpers: self.inject_helpers,
            minify: self.minify,
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

    pub fn optimize_hygiene(mut self, enable: bool) -> Self {
        self.optimize_hygiene = enable;
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
        let pass = c.build(&self.cm, &self.handler);
        self.then(pass)
    }

    pub fn target(mut self, target: JscTarget) -> Self {
        self.target = target;
        self
    }

    pub fn preset_env(mut self, env: Option<swc_ecma_preset_env::Config>) -> Self {
        self.env = env;
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
        base_url: String,
        paths: CompiledPaths,
        base: &FileName,
        syntax: Syntax,
        module: Option<ModuleConfig>,
        comments: Option<&'cmt SwcComments>,
    ) -> impl 'cmt + swc_ecma_visit::Fold
    where
        P: 'cmt,
    {
        let need_interop_analysis = match module {
            Some(ModuleConfig::CommonJs(ref c)) => !c.no_interop,
            Some(ModuleConfig::Amd(ref c)) => !c.config.no_interop,
            Some(ModuleConfig::Umd(ref c)) => !c.config.no_interop,
            Some(ModuleConfig::Es6) | None => false,
        };

        // compat
        let compat_pass = if let Some(env) = self.env {
            Either::Left(chain!(
                import_assertions(),
                Optional::new(typescript::strip(), syntax.typescript()),
                swc_ecma_preset_env::preset_env(self.global_mark, comments.clone(), env)
            ))
        } else {
            Either::Right(chain!(
                import_assertions(),
                Optional::new(compat::es2021::es2021(), self.target < JscTarget::Es2021),
                Optional::new(compat::es2020::es2020(), self.target < JscTarget::Es2020),
                Optional::new(typescript::strip(), syntax.typescript()),
                Optional::new(compat::es2018(), self.target <= JscTarget::Es2018),
                Optional::new(compat::es2017(), self.target <= JscTarget::Es2017),
                Optional::new(compat::es2016(), self.target <= JscTarget::Es2016),
                Optional::new(
                    compat::es2015(
                        self.global_mark,
                        comments.clone(),
                        compat::es2015::Config {
                            for_of: compat::es2015::for_of::Config {
                                assume_array: self.loose
                            },
                            spread: compat::es2015::spread::Config { loose: self.loose },
                            destructuring: compat::es2015::destructuring::Config {
                                loose: self.loose
                            },
                        }
                    ),
                    self.target <= JscTarget::Es2015
                ),
                Optional::new(
                    compat::es3(syntax.dynamic_import()),
                    cfg!(feature = "es3") && self.target <= JscTarget::Es3
                )
            ))
        };

        let module_scope = Rc::new(RefCell::new(Scope::default()));
        chain!(
            self.pass,
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
                self.global_mark,
                module,
                Rc::clone(&module_scope)
            ),
            as_folder(MinifierPass {
                options: self.minify,
                cm: self.cm.clone(),
                comments: comments.cloned(),
                top_level_mark: self.global_mark,
            }),
            Optional::new(
                chain!(
                    Optional::new(
                        chain!(unique_scope(), hygiene_optimizer(self.global_mark)),
                        self.optimize_hygiene
                    ),
                    hygiene_with_config(self.hygiene.clone().unwrap_or_default())
                ),
                self.hygiene.is_some()
            ),
            Optional::new(fixer(comments.map(|v| v as &dyn Comments)), self.fixer),
        )
    }
}

struct MinifierPass {
    options: Option<JsMinifyOptions>,
    cm: Lrc<SourceMap>,
    comments: Option<SwcComments>,
    top_level_mark: Mark,
}

impl VisitMut for MinifierPass {
    noop_visit_mut_type!();

    fn visit_mut_module(&mut self, m: &mut Module) {
        if let Some(options) = &self.options {
            let opts = MinifyOptions {
                compress: options
                    .compress
                    .clone()
                    .into_obj()
                    .map(|v| v.into_config(self.cm.clone())),
                mangle: options.mangle.clone().into_obj(),
                ..Default::default()
            };

            m.map_with_mut(|m| {
                swc_ecma_minifier::optimize(
                    m,
                    self.cm.clone(),
                    self.comments.as_ref().map(|v| v as &dyn Comments),
                    None,
                    &opts,
                    &swc_ecma_minifier::option::ExtraOptions {
                        top_level_mark: self.top_level_mark,
                    },
                )
            })
        }
    }
}
