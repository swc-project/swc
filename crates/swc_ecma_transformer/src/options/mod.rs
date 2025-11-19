pub struct Options {
    pub typescript: TypescriptOptions,
    pub decorator: DecoratorOptions,
    pub jsx: JsxOptions,

    pub env: EnvOptions,
}

pub struct EnvOptions {
    pub es2026: Es2026Options,
    pub es2022: Es2022Options,
    pub es2021: ES2021Options,
    pub es2020: ES2020Options,
    pub es2019: ES2019Options,
    pub es2018: ES2018Options,
    pub es2017: ES2017Options,
    pub es2016: ES2016Options,
    pub es2015: ES2015Options,
    pub regexp: RegExpOptions,
    pub common: CommonOptions,
}
