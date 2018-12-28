use ast::*;
use serde::{Deserialize, Serialize};
use swc_common::{
    errors::{ColorConfig, Handler},
    sync::Lrc,
    FileName, Fold, SourceMap,
};
use swc_ecma_parser::{Parser, Session, SourceFileInput, Syntax};

#[cfg(test)]
mod tests;

#[derive(Debug, Serialize, Deserialize)]
pub struct Options {
    #[serde(default = "default_pragma")]
    pub pragma: String,
    #[serde(default = "default_pragma_frag")]
    pub pragma_frag: String,

    #[serde(default = "default_throw_if_namespace")]
    pub throw_if_namespace: bool,

    #[serde(default)]
    pub development: bool,

    #[serde(default)]
    pub use_builtins: bool,
}

fn default_pragma() -> String {
    "React.createElement".into()
}

fn default_pragma_frag() -> String {
    "React.Fragment".into()
}

fn default_throw_if_namespace() -> bool {
    true
}

/// `@babel/plugin-transform-react-jsx`
///
/// Turn JSX into React function calls
pub fn jsx(cm: Lrc<SourceMap>, options: Options) -> impl Fold<Module> {
    let handler = Handler::with_tty_emitter(ColorConfig::Always, false, true, Some(cm.clone()));

    let session = Session {
        cfg: Default::default(),
        handler: &handler,
    };
    let parse = |name, s| {
        let fm = cm.new_source_file(FileName::Custom(format!("<jsx-config-{}.js>", name)), s);

        Parser::new(session, Syntax::Es2019, SourceFileInput::from(&*fm))
            .parse_expr()
            .unwrap()
    };

    Jsx {
        pragma: parse("pragma", options.pragma),
        pragma_frag: parse("pragma_frag", options.pragma_frag),
        throw_if_namespace: options.throw_if_namespace,
        development: options.development,
        use_builtins: options.use_builtins,
    }
}

struct Jsx {
    pragma: Box<Expr>,
    pragma_frag: Box<Expr>,
    throw_if_namespace: bool,
    development: bool,
    use_builtins: bool,
}
