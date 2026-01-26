use swc_common::SyntaxContext;
use swc_ecma_transforms_base::assumptions::Assumptions;

pub use crate::{
    bugfix::BugfixOptions, decorators::DecoratorOptions, es2015::Es2015Options,
    es2016::Es2016Options, es2017::Es2017Options, es2018::Es2018Options, es2019::Es2019Options,
    es2020::Es2020Options, es2021::Es2021Options, es2022::Es2022Options, es2026::Es2026Options,
    jsx::JsxOptions, regexp::RegExpOptions, typescript::TypescriptOptions,
};

#[derive(Debug, Default)]
#[non_exhaustive]
pub struct Options {
    pub unresolved_ctxt: SyntaxContext,
    pub assumptions: Assumptions,

    pub typescript: Option<TypescriptOptions>,
    pub decorator: Option<DecoratorOptions>,
    pub jsx: Option<JsxOptions>,

    pub env: EnvOptions,
}

#[derive(Debug, Default)]
#[non_exhaustive]
pub struct EnvOptions {
    pub es2026: Es2026Options,
    pub es2022: Es2022Options,
    pub es2021: Es2021Options,
    pub es2020: Es2020Options,
    pub es2019: Es2019Options,
    pub es2018: Es2018Options,
    pub es2017: Es2017Options,
    pub es2016: Es2016Options,
    pub es2015: Es2015Options,
    pub regexp: RegExpOptions,
    pub bugfix: BugfixOptions,
}

impl EnvOptions {
    /// Returns true if any transform is enabled.
    pub fn is_enabled(&self) -> bool {
        self.es2026.is_enabled()
            || self.es2022.is_enabled()
            || self.es2021.is_enabled()
            || self.es2020.is_enabled()
            || self.es2019.is_enabled()
            || self.es2018.is_enabled()
            || self.es2017.is_enabled()
            || self.es2016.is_enabled()
            || self.es2015.is_enabled()
            || self.regexp.is_enabled()
            || self.bugfix.is_enabled()
    }
}
