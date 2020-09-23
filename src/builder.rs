use crate::config::{GlobalPassOption, JscTarget, ModuleConfig};
use either::Either;
use std::{collections::HashMap, sync::Arc};
use swc_atoms::JsWord;
use swc_common::{chain, comments::Comments, errors::Handler, Mark, SourceMap};
use swc_ecma_parser::Syntax;
use swc_ecma_transforms::{
    compat, const_modules, fixer, helpers, hygiene, modules, pass::Optional,
    proposals::import_assertions, typescript,
};

/// Builder is used to create a high performance `Compiler`.
pub struct PassBuilder<'a, 'b, P: swc_ecma_visit::Fold> {
    cm: &'a Arc<SourceMap>,
    handler: &'b Handler,
    env: Option<swc_ecma_preset_env::Config>,
    pass: P,
    global_mark: Mark,
    target: JscTarget,
    loose: bool,
    hygiene: bool,
    fixer: bool,
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
            pass,
            target: JscTarget::Es5,
            global_mark,
            loose,
            hygiene: true,
            env: None,
            fixer: true,
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
            pass,
            target: self.target,
            loose: self.loose,
            hygiene: self.hygiene,
            env: self.env,
            global_mark: self.global_mark,
            fixer: self.fixer,
        }
    }

    /// Note: fixer is enabled by default.
    pub fn fixer(mut self, enable: bool) -> Self {
        self.fixer = enable;
        self
    }

    /// Note: hygiene is enabled by default.
    pub fn hygiene(mut self, enable: bool) -> Self {
        self.hygiene = enable;
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
        syntax: Syntax,
        module: Option<ModuleConfig>,
        comments: Option<&'cmt dyn Comments>,
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
                Optional::new(typescript::strip(), syntax.typescript()),
                swc_ecma_preset_env::preset_env(self.global_mark, env)
            ))
        } else {
            Either::Right(chain!(
                import_assertions(),
                Optional::new(
                    compat::es2020::nullish_coalescing(),
                    self.target < JscTarget::Es2020
                ),
                Optional::new(
                    compat::es2020::optional_chaining(),
                    self.target < JscTarget::Es2020
                ),
                Optional::new(
                    compat::es2020::class_properties(),
                    self.target < JscTarget::Es2020,
                ),
                Optional::new(typescript::strip(), syntax.typescript()),
                Optional::new(compat::es2018(), self.target <= JscTarget::Es2018),
                Optional::new(compat::es2017(), self.target <= JscTarget::Es2017),
                Optional::new(compat::es2016(), self.target <= JscTarget::Es2016),
                Optional::new(
                    compat::es2015(
                        self.global_mark,
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
                    self.target <= JscTarget::Es3
                )
            ))
        };

        chain!(
            self.pass,
            compat_pass,
            compat::reserved_words::reserved_words(),
            // module / helper
            Optional::new(
                modules::import_analysis::import_analyzer(),
                need_interop_analysis
            ),
            helpers::inject_helpers(),
            ModuleConfig::build(self.cm.clone(), self.global_mark, module),
            Optional::new(hygiene(), self.hygiene),
            Optional::new(fixer(comments), self.fixer),
        )
    }
}
