use self::util::{PatExt, TypeExt};
use crate::errors::Error;
use swc_atoms::JsWord;
use swc_common::{Fold, FoldWith, Spanned};
use swc_ecma_ast::*;
use toolshed::{map::Map, Arena};

mod expr;
#[cfg(test)]
mod tests;
mod util;

struct Analyzer<'a> {
    info: Info,
    arena: &'a Arena,
    scope: &'a Scope<'a>,
    errors: Vec<Error>,
}

impl<'a> Analyzer<'a> {
    pub fn new(arena: &'a Arena, scope: &'a Scope<'a>) -> Self {
        Analyzer {
            arena,
            scope,
            info: Default::default(),
            errors: Default::default(),
        }
    }
}

#[derive(Debug, Clone, Copy)]
pub struct Scope<'a> {
    parent: Option<&'a Scope<'a>>,
    vars: &'a Map<'a, &'a str, (VarDeclKind, &'a TsType)>,
}

impl<'a> Scope<'a> {
    fn new(arena: &'a Arena, parent: &'a Scope<'a>) -> Self {
        Scope {
            vars: arena.alloc(Map::new()),
            parent: Some(parent),
        }
    }

    fn root(arena: &'a Arena) -> Self {
        Scope {
            parent: None,
            vars: &*arena.alloc(Map::new()),
        }
    }
}

#[derive(Debug, Default)]
pub struct Info {
    pub imports: Vec<ImportInfo>,
    pub exports: Vec<ExportInfo>,
    pub errors: Vec<Error>,
}

#[derive(Debug)]
pub struct ImportInfo {
    pub src: JsWord,
}

#[derive(Debug)]
pub struct ExportInfo {}

// impl<T> Fold<Vec<T>> for Analyzer<'_>
// where
//     Vec<T>: FoldWith<Self>,
//     T: FoldWith<Self>,
//     T: StmtLike + ModuleItemLike,
// {
//     fn fold(&mut self, items: Vec<T>) -> Vec<T> {
//         let mut buf = vec![];

//         for item in items {
//             match item.try_into_stmt() {
//                 Ok(stmt) => {}
//                 Err(item) => match item.try_into_module_decl() {
//                     Ok(decl) => {}
//                     Err(..) => unreachable!(),
//                 },
//             }
//         }

//         buf
//     }
// }

impl Fold<BlockStmt> for Analyzer<'_> {
    fn fold(&mut self, stmt: BlockStmt) -> BlockStmt {
        let scope = self.arena.alloc(Scope::new(self.arena, self.scope));
        let mut analyzer = Analyzer::new(self.arena, scope);

        stmt.fold_children(&mut analyzer)
    }
}

impl Fold<VarDeclarator> for Analyzer<'_> {
    fn fold(&mut self, v: VarDeclarator) -> VarDeclarator {
        if let Some(ref init) = v.init {
            //  Check if v_ty is assignable to ty
            let value_ty = self.type_of(&init);

            match v.name.get_ty() {
                Some(ref ty) => {
                    let errors = value_ty.assign_to(ty);

                    self.errors.extend(errors);
                }
                // Infer type from value.
                None => {
                    // v.name.set_ty(value_ty.map(Box::new))
                }
            }

            return v;
        }

        // There's no initializer, so undefined is required.
        if !v.name.get_ty().contains_undefined() {
            self.errors.push(Error::ShouldIncludeUndefinedType {
                span: v.name.span(),
            })
        }

        v
    }
}

/// Analyzes a module.
///
/// Constants are propagated, and
pub fn analyze_module(m: Module) -> (Module, Info) {
    let arena = toolshed::Arena::new();
    let scope = arena.alloc(Scope::root(&arena));

    let mut a = Analyzer::new(&arena, scope);
    let m = m.fold_with(&mut a);

    (m, a.info)
}
