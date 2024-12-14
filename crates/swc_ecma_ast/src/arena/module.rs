use is_macro::Is;
use swc_allocator::arena::{Allocator, Box, Vec};
use swc_atoms::Atom;
use swc_common::{arena::ast_node, arena::Take, EqIgnoreSpan, Span, DUMMY_SP};

use super::{module_decl::ModuleDecl, stmt::Stmt};

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum Program<'a> {
    // #[tag("Module")]
    Module(Box<'a, Module<'a>>),
    // #[tag("Script")]
    Script(Box<'a, Script<'a>>),
}

impl<'a> Take<'a> for Program<'a> {
    fn dummy(alloc: &'a Allocator) -> Self {
        Program::Script(Box::new_in(
            Script {
                span: DUMMY_SP,
                shebang: None,
                body: Vec::new_in(alloc),
            },
            alloc,
        ))
    }
}

#[ast_node("Module")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct Module<'a> {
    pub span: Span,

    pub body: Vec<'a, ModuleItem<'a>>,

    #[cfg_attr(feature = "serde-impl", serde(default, rename = "interpreter"))]
    pub shebang: Option<Atom>,
}

#[cfg(feature = "arbitrary")]
#[cfg_attr(docsrs, doc(cfg(feature = "arbitrary")))]
impl<'a> arbitrary::Arbitrary<'a> for Module {
    fn arbitrary(u: &mut arbitrary::Unstructured<'_>) -> arbitrary::Result<Self> {
        let span = u.arbitrary()?;
        let body = u.arbitrary()?;
        Ok(Self {
            span,
            body,
            shebang: None,
        })
    }
}

// impl Take for Module {
//     fn dummy() -> Self {
//         Module {
//             span: DUMMY_SP,
//             body: Take::dummy(),
//             shebang: Take::dummy(),
//         }
//     }
// }

#[ast_node("Script")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct Script<'a> {
    pub span: Span,

    pub body: Vec<'a, Stmt<'a>>,

    #[cfg_attr(feature = "serde-impl", serde(default, rename = "interpreter"))]
    pub shebang: Option<Atom>,
}

#[cfg(feature = "arbitrary")]
#[cfg_attr(docsrs, doc(cfg(feature = "arbitrary")))]
impl<'a> arbitrary::Arbitrary<'a> for Script {
    fn arbitrary(u: &mut arbitrary::Unstructured<'_>) -> arbitrary::Result<Self> {
        let span = u.arbitrary()?;
        let body = u.arbitrary()?;
        Ok(Self {
            span,
            body,
            shebang: None,
        })
    }
}

// impl Take for Script {
//     fn dummy() -> Self {
//         Script {
//             span: DUMMY_SP,
//             body: Take::dummy(),
//             shebang: Take::dummy(),
//         }
//     }
// }

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum ModuleItem<'a> {
    // #[tag("ImportDeclaration")]
    // #[tag("ExportDeclaration")]
    // #[tag("ExportNamedDeclaration")]
    // #[tag("ExportDefaultDeclaration")]
    // #[tag("ExportDefaultExpression")]
    // #[tag("ExportAllDeclaration")]
    // #[tag("TsImportEqualsDeclaration")]
    // #[tag("TsExportAssignment")]
    // #[tag("TsNamespaceExportDeclaration")]
    ModuleDecl(ModuleDecl<'a>),
    // #[tag("*")]
    Stmt(Stmt<'a>),
}

// impl Take for ModuleItem {
//     fn dummy() -> Self {
//         Self::Stmt(Default::default())
//     }
// }
