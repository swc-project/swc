use ast::Expr;
use fxhash::FxHashMap;
use inflector::Inflector;
use serde::{Deserialize, Serialize};
use swc_atoms::JsWord;
use swc_common::{
    errors::{ColorConfig, Handler},
    sync::Lrc,
    FileName, SourceMap,
};
use swc_ecma_parser::{Parser, Session, SourceFileInput, Syntax};

#[derive(Default, Clone, Serialize, Deserialize)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct Config {
    pub globals: FxHashMap<String, String>,
}

impl Config {
    pub(super) fn build(self, cm: Lrc<SourceMap>) -> BuiltConfig {
        let handler = Handler::with_tty_emitter(ColorConfig::Always, false, true, Some(cm.clone()));

        let session = Session { handler: &handler };

        BuiltConfig {
            globals: self
                .globals
                .into_iter()
                .map(|(k, v)| {
                    let parse = |s| {
                        let fm = cm
                            .new_source_file(FileName::Custom(format!("<umd-config-{}.js>", s)), s);

                        Parser::new(session, Syntax::default(), SourceFileInput::from(&*fm))
                            .parse_expr()
                            .map_err(|mut e| {
                                e.emit();
                                ()
                            })
                            .unwrap()
                    };
                    (k, parse(v))
                })
                .collect(),
        }
    }
}
#[derive(Clone)]
pub(super) struct BuiltConfig {
    pub globals: FxHashMap<String, Box<Expr>>,
}

impl BuiltConfig {
    pub fn global_name(&self, src: &JsWord) -> JsWord {
        if !src.contains("/") {
            return src.to_camel_case().into();
        }

        return src.split("/").last().unwrap().to_camel_case().into();
    }
    pub fn determine_export_name(&self, filename: FileName) -> Box<Expr> {
        match filename {
            FileName::Real(ref path) => {
                let s = match path.file_stem() {
                    Some(stem) => self.global_name(&stem.to_string_lossy().into()),
                    None => self.global_name(&path.display().to_string().into()),
                };

                box Expr::Ident(quote_ident!(s))
            }
            _ => unimplemented!("determine_export_name({:?})", filename),
        }
    }
}
