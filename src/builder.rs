use crate::config::{GlobalPassOption, JscTarget, ModuleConfig};
use either::Either;
use std::{collections::HashMap, sync::Arc};
use swc_atoms::JsWord;
use swc_common::{chain, errors::Handler, fold::and_then::AndThen, Mark, SourceMap};
use swc_ecmascript::{
    parser::Syntax,
    preset_env,
    transforms::{
        compat, const_modules, fixer, helpers, hygiene, modules,
        pass::{Optional, Pass},
        typescript,
    },
};

/// Builder is used to create a high performance `Compiler`.
pub struct PassBuilder<'a, 'b, P: Pass> {
    cm: &'a Arc<SourceMap>,
    handler: &'b Handler,
    env: Option<preset_env::Config>,
    pass: P,
    target: JscTarget,
    loose: bool,
}

impl<'a, 'b, P: Pass> PassBuilder<'a, 'b, P> {
    pub fn new(cm: &'a Arc<SourceMap>, handler: &'b Handler, loose: bool, pass: P) -> Self {
        PassBuilder {
            cm,
            handler,
            pass,
            target: JscTarget::Es5,
            loose,
            env: None,
        }
    }

    pub fn then<N>(self, next: N) -> PassBuilder<'a, 'b, AndThen<P, N>> {
        let pass = chain!(self.pass, next);
        PassBuilder {
            cm: self.cm,
            handler: self.handler,
            pass,
            target: self.target,
            loose: self.loose,
            env: self.env,
        }
    }

    pub fn const_modules(
        self,
        globals: HashMap<JsWord, HashMap<JsWord, String>>,
    ) -> PassBuilder<'a, 'b, impl Pass> {
        self.then(const_modules(globals))
    }

    pub fn inline_globals(self, c: GlobalPassOption) -> PassBuilder<'a, 'b, impl Pass> {
        let pass = c.build(&self.cm, &self.handler);
        self.then(pass)
    }

    pub fn strip_typescript(self) -> PassBuilder<'a, 'b, impl Pass> {
        self.then(typescript::strip())
    }

    pub fn target(mut self, target: JscTarget) -> Self {
        self.target = target;
        self
    }

    pub fn preset_env(mut self, env: Option<preset_env::Config>) -> Self {
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
    ///  - identifier hygiene handler
    ///  - fixer
    pub fn finalize(
        self,
        root_mark: Mark,
        syntax: Syntax,
        module: Option<ModuleConfig>,
    ) -> impl Pass {
        let need_interop_analysis = match module {
            Some(ModuleConfig::CommonJs(ref c)) => !c.no_interop,
            Some(ModuleConfig::Amd(ref c)) => !c.config.no_interop,
            Some(ModuleConfig::Umd(ref c)) => !c.config.no_interop,
            None => false,
        };

        // compat
        let compat_pass = if let Some(env) = self.env {
            Either::Left(preset_env::preset_env(env))
        } else {
            Either::Right(chain!(
                Optional::new(compat::es2018(), self.target <= JscTarget::Es2018),
                Optional::new(compat::es2017(), self.target <= JscTarget::Es2017),
                Optional::new(compat::es2016(), self.target <= JscTarget::Es2016),
                Optional::new(
                    compat::es2015(compat::es2015::Config {
                        for_of: compat::es2015::for_of::Config {
                            assume_array: self.loose
                        },
                        spread: compat::es2015::spread::Config { loose: self.loose },
                        destructuring: compat::es2015::destructuring::Config { loose: self.loose },
                    }),
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
            // module / helper
            Optional::new(
                modules::import_analysis::import_analyzer(),
                need_interop_analysis
            ),
            helpers::InjectHelpers,
            ModuleConfig::build(self.cm.clone(), root_mark, module),
            // hygiene
            hygiene(),
            // fixer
            fixer(),
        )
    }
}
