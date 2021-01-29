use anyhow::anyhow;
use anyhow::bail;
use anyhow::Error;
use std::sync::Arc;
use swc_common::input::SourceFileInput;
use swc_common::SourceFile;
use swc_common::Spanned;
use swc_ecma_ast::EsVersion;
use swc_ecma_ast::*;
use swc_ecma_parser::lexer::Lexer;
use swc_ecma_parser::Parser;
use swc_ecma_parser::Syntax;

pub(super) fn load_json_as_module(fm: &Arc<SourceFile>) -> Result<Module, Error> {
    let lexer = Lexer::new(
        Syntax::default(),
        EsVersion::Es2020,
        SourceFileInput::from(&**fm),
        None,
    );
    let mut parser = Parser::new_from(lexer);
    let expr = parser
        .parse_expr()
        .map_err(|err| anyhow!("failed parse json as javascript object: {:#?}", err))?;

    match *expr {
        Expr::Object(obj) => {
            let mut body = vec![];
            // Convert to exports.
            for prop in obj.props {
                match prop {
                    PropOrSpread::Spread(_) => {
                        bail!("json does not support object spread syntax")
                    }
                    PropOrSpread::Prop(prop) => match *prop {
                        Prop::KeyValue(kv) => {
                            //
                            let kv_span = kv.span();

                            match kv.key {
                                PropName::Str(key) => {
                                    let decl = VarDeclarator {
                                        span: kv.value.span(),
                                        name: Pat::Ident(Ident::new(key.value.clone(), key.span)),
                                        init: Some(kv.value),
                                        definite: false,
                                    };

                                    body.push(ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(
                                        ExportDecl {
                                            span: kv_span,
                                            decl: Decl::Var(VarDecl {
                                                span: key.span,
                                                kind: VarDeclKind::Const,
                                                declare: false,
                                                decls: vec![decl],
                                            }),
                                        },
                                    )))
                                }
                                _ => {
                                    bail!("keys in json file must be strings")
                                }
                            }
                        }
                        _ => {
                            bail!("json should only contains properties in form of `key: value`")
                        }
                    },
                }
            }

            Ok(Module {
                span: obj.span,
                body,
                shebang: None,
            })
        }
        _ => {
            bail!("json loader currently only supports object")
        }
    }
}
