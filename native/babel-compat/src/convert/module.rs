use super::Context;
use crate::ast::{
    stmt::Statement,
    module::ModuleDeclaration,
};
use crate::convert::Babelify;
use swc_ecma_ast::{ModuleItem};
use serde::{Serialize, Deserialize};

// #[ast_node]
// #[derive(Eq, Hash, Is, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub enum Program {
//     #[tag("Module")]
//     Module(Module),
//     #[tag("Script")]
//     Script(Script),
// }
//
// #[ast_node("Module")]
// #[derive(Eq, Hash, EqIgnoreSpan)]
// pub struct Module {
//     pub span: Span,
//
//     pub body: Vec<ModuleItem>,
//
//     #[serde(default, rename = "interpreter")]
//     pub shebang: Option<JsWord>,
// }
//
// #[cfg(feature = "arbitrary")]
// impl arbitrary::Arbitrary for Module {
//     fn arbitrary(u: &mut arbitrary::Unstructured<'_>) -> arbitrary::Result<Self> {
//         let span = u.arbitrary()?;
//         let body = u.arbitrary()?;
//         Ok(Self {
//             span,
//             body,
//             shebang: None,
//         })
//     }
// }
//
// #[ast_node("Script")]
// #[derive(Eq, Hash, EqIgnoreSpan)]
// pub struct Script {
//     pub span: Span,
//
//     pub body: Vec<Stmt>,
//
//     #[serde(default, rename = "interpreter")]
//     pub shebang: Option<JsWord>,
// }
//
// #[cfg(feature = "arbitrary")]
// impl arbitrary::Arbitrary for Script {
//     fn arbitrary(u: &mut arbitrary::Unstructured<'_>) -> arbitrary::Result<Self> {
//         let span = u.arbitrary()?;
//         let body = u.arbitrary()?;
//         Ok(Self {
//             span,
//             body,
//             shebang: None,
//         })
//     }
// }
//

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ModuleItemOutput {
    ModuleDecl(ModuleDeclaration),
    Stmt(Statement),
}

impl Babelify for ModuleItem {
    type Output = ModuleItemOutput;

    fn babelify(self, ctx: &Context) -> Self::Output {
        match self {
            ModuleItem::ModuleDecl(d) => ModuleItemOutput::ModuleDecl(d.babelify(ctx)),
            ModuleItem::Stmt(s) => ModuleItemOutput::Stmt(s.babelify(ctx)),
        }
    }
}

impl From<ModuleItemOutput> for Statement {
    fn from(m: ModuleItemOutput) -> Self {
        match m {
            ModuleItemOutput::Stmt(s) => s,
            _ => panic!("illegal conversion"),
        }
    }
}
// #[ast_node]
// #[derive(Eq, Hash, Is, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub enum ModuleItem {
//     #[tag("ImportDeclaration")]
//     #[tag("ExportDeclaration")]
//     #[tag("ExportNamedDeclaration")]
//     #[tag("ExportDefaultDeclaration")]
//     #[tag("ExportDefaultExpression")]
//     #[tag("ExportAllDeclaration")]
//     #[tag("TsImportEqualsDeclaration")]
//     #[tag("TsExportAssignment")]
//     #[tag("TsNamespaceExportDeclaration")]
//     ModuleDecl(ModuleDecl),
//     #[tag("*")]
//     Stmt(Stmt),
// }
//
