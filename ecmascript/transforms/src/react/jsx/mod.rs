use crate::util::ExprFactory;
use ast::*;
use serde::{Deserialize, Serialize};
use std::iter;
use swc_atoms::JsWord;
use swc_common::{
    errors::{ColorConfig, Handler},
    sync::Lrc,
    FileName, Fold, FoldWith, SourceMap, Spanned, DUMMY_SP,
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

impl Default for Options {
    fn default() -> Self {
        Options {
            pragma: default_pragma(),
            pragma_frag: default_pragma_frag(),
            throw_if_namespace: default_throw_if_namespace(),
            development: false,
            use_builtins: false,
        }
    }
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
            .map(ExprOrSuper::Expr)
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
    pragma: ExprOrSuper,
    pragma_frag: ExprOrSuper,
    throw_if_namespace: bool,
    development: bool,
    use_builtins: bool,
}

impl Fold<Expr> for Jsx {
    fn fold(&mut self, expr: Expr) -> Expr {
        let expr = expr.fold_children(self);

        match expr {
            Expr::JSXElement(el) => {
                // <div></div> => React.createElement('div', null);
                let span = el.span();

                let name = jsx_name(el.opening.name);

                Expr::Call(CallExpr {
                    span,
                    callee: self.pragma.clone(),
                    args: iter::once({
                        // Tag
                        name.as_arg()
                    })
                    .chain(iter::once({
                        // Attributes
                        Lit::Null(Null { span: DUMMY_SP }).as_arg()
                    }))
                    .collect(),
                })
            }
            _ => expr,
        }
    }
}

fn jsx_name(name: JSXElementName) -> Box<Expr> {
    let span = name.span();
    match name {
        JSXElementName::Ident(i) => {
            // If it starts with lowercase digit
            let c = i.sym.chars().next().unwrap();

            if c.is_ascii_lowercase() {
                box Expr::Lit(Lit::Str(Str {
                    span,
                    value: i.sym,
                    has_escape: false,
                }))
            } else {
                box Expr::Ident(i)
            }
        }
        JSXElementName::JSXNamespacedName(JSXNamespacedName { ref ns, ref name }) => {
            box Expr::Lit(Lit::Str(Str {
                span,
                value: format!("{}:{}", ns.sym, name.sym).into(),
                has_escape: false,
            }))
        }
        JSXElementName::JSXMemberExpr(JSXMemberExpr { obj, prop }) => {
            fn convert_obj(obj: JSXObject) -> ExprOrSuper {
                let span = obj.span();
                match obj {
                    JSXObject::Ident(i) => i.as_obj(),
                    JSXObject::JSXMemberExpr(box JSXMemberExpr { obj, prop }) => MemberExpr {
                        span,
                        obj: convert_obj(obj),
                        prop: box Expr::Ident(prop),
                        computed: false,
                    }
                    .as_obj(),
                }
            }
            box Expr::Member(MemberExpr {
                span,
                obj: convert_obj(obj),
                prop: box Expr::Ident(prop),
                computed: false,
            })
        }
    }
}
