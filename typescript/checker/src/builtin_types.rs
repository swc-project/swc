use crate::ty::TypeRef;
use chashmap::{CHashMap, ReadGuard};
use lazy_static::lazy_static;
use swc_atoms::{js_word, JsWord};
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ts_builtin_types::load;
pub use swc_ts_builtin_types::Lib;

type Type = crate::ty::Type<'static>;
type Merged = TsModuleBlock;

fn merge<'a>(ls: &[Lib]) -> ReadGuard<Vec<Lib>, Merged> {
    lazy_static! {
        static ref CACHE: CHashMap<Vec<Lib>, Merged> = Default::default();
    }

    let libs = ls.to_vec();
    if let Some(cached) = CACHE.get(&libs) {
        return cached;
    }

    let mut items = vec![];

    for module in load(ls) {
        match *module.body {
            TsNamespaceBody::TsModuleBlock(TsModuleBlock { ref body, .. }) => {
                items.reserve(body.len());

                for item in body {
                    match item {
                        ModuleItem::ModuleDecl(ref md) => unreachable!("ModuleDecl: {:#?}", md),
                        ModuleItem::Stmt(ref stmt) => match *stmt {
                            Stmt::Decl(Decl::Var(..))
                            | Stmt::Decl(Decl::Fn(..))
                            | Stmt::Decl(Decl::Class(..))
                            | Stmt::Decl(Decl::TsModule(..))
                            | Stmt::Decl(Decl::TsTypeAlias(..)) => items.push(item.clone()),

                            // Merge interface
                            Stmt::Decl(Decl::TsInterface(ref i)) => {
                                let mut mutated = false;
                                items.iter_mut().for_each(|v| match v {
                                    ModuleItem::Stmt(Stmt::Decl(Decl::TsInterface(ref mut v))) => {
                                        mutated = true;
                                        v.body.body.extend(i.body.body.clone());
                                    }
                                    _ => {}
                                });
                                if !mutated {
                                    items.push(item.clone())
                                }
                            }

                            _ => panic!("{:#?}", item),
                        },
                    }
                }
            }
            _ => unreachable!(),
        }
    }

    let module = TsModuleBlock {
        span: DUMMY_SP,
        body: items,
    };
    CACHE.insert(libs, module);

    return CACHE.get(ls).unwrap();
}

pub fn get<'a>(libs: &[Lib], name: &JsWord) -> Option<&'a Type> {
    let lib = merge(libs);

    for i in &lib.body {
        
    }

    unimplemented!("get")
}
