use crate::deps::EnumKind;
use fxhash::FxHashMap;
use std::sync::Arc;
use swc_atoms::js_word;
use swc_atoms::JsWord;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_visit::Node;
use swc_ecma_visit::Visit;
use swc_ecma_visit::VisitWith;

/// Helper struct to help implementing dependency analyzer.
#[derive(Debug)]
pub struct ModuleData {
    pub metadata_types: Arc<FxHashMap<JsWord, Box<Expr>>>,
}

pub fn analyze(module: &Module) -> ModuleData {
    let mut v = Analyzer::default();
    module.visit_with(&Invalid { span: DUMMY_SP }, &mut v);

    ModuleData {
        metadata_types: v.metadata_types.into(),
    }
}

#[derive(Debug, Default)]
struct Analyzer {
    metadata_types: FxHashMap<JsWord, Box<Expr>>,
}

impl Visit for Analyzer {
    fn visit_export_decl(&mut self, n: &ExportDecl, _: &dyn Node) {
        match &n.decl {
            Decl::TsEnum(e) => {
                let kind = EnumKind::from(e);

                self.metadata_types.insert(
                    e.id.sym.clone(),
                    Box::new(Expr::Ident(Ident::new(
                        match kind {
                            EnumKind::Mixed => {
                                js_word!("Object")
                            }
                            EnumKind::Str => {
                                js_word!("String")
                            }
                            EnumKind::Num => {
                                js_word!("Number")
                            }
                        },
                        e.id.span,
                    ))),
                );
            }
            _ => {}
        }
    }
}
