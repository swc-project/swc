use pmutil::q;
use proc_macro2::TokenStream;
use swc_macros_common::call_site;
use syn::{FnArg, Ident, ImplItem, ImplItemMethod, ItemImpl, Pat, Path, Stmt};

pub fn expand(attr: TokenStream, item: ItemImpl) -> ItemImpl {
    let expander = Expander {
        handler: syn::parse2(attr).expect("Usage should be like #[fast_path(ArrowVisitor)]"),
        mode: detect_mode(&item),
    };
    let items = expander.inject_default_methods(item.items);

    ItemImpl {
        items: items
            .into_iter()
            .map(|item| match item {
                ImplItem::Method(m) => ImplItem::Method(expander.patch_method(m)),
                _ => item,
            })
            .collect(),
        ..item
    }
}
#[derive(Debug, Clone, Copy)]
pub enum Mode {
    Fold,
    VisitMut,
}

impl Mode {
    pub fn prefix(self) -> &'static str {
        match self {
            Mode::Fold => "fold",
            Mode::VisitMut => "visit_mut",
        }
    }
}

fn detect_mode(i: &ItemImpl) -> Mode {
    if i.items.iter().any(|item| match item {
        ImplItem::Method(m) => m.sig.ident.to_string().starts_with("fold"),
        _ => false,
    }) {
        return Mode::Fold;
    }

    Mode::VisitMut
}

struct Expander {
    mode: Mode,
    handler: Path,
}

impl Expander {
    fn inject_default_methods(&self, mut items: Vec<ImplItem>) -> Vec<ImplItem> {
        let list = &[
            ("stmt", q!({ swc_ecma_ast::Stmt })),
            ("stmts", q!({ Vec<swc_ecma_ast::Stmt> })),
            ("module_decl", q!({ swc_ecma_ast::ModuleDecl })),
            ("module_item", q!({ swc_ecma_ast::ModuleItem })),
            ("module_items", q!({ Vec<swc_ecma_ast::ModuleItem> })),
            ("expr", q!({ swc_ecma_ast::Expr })),
            ("exprs", q!({ Vec<Box<swc_ecma_ast::Expr>> })),
            ("decl", q!({ swc_ecma_ast::Decl })),
            ("pat", q!({ swc_ecma_ast::Pat })),
        ];

        for (name, ty) in list {
            let has = items.iter().any(|item| match item {
                ImplItem::Method(i) => i.sig.ident.to_string().ends_with(name),
                _ => false,
            });
            if has {
                continue;
            }
            let name = Ident::new(&format!("{}_{}", self.mode.prefix(), name), call_site());

            let method = match self.mode {
                Mode::Fold => q!(
                    Vars {
                        method: &name,
                        Type: ty,
                    },
                    {
                        fn method(&mut self, node: Type) -> Type {
                            node.fold_children_with(self)
                        }
                    }
                ),
                Mode::VisitMut => q!(
                    Vars {
                        method: &name,
                        Type: ty,
                    },
                    {
                        fn method(&mut self, node: &mut Type) {
                            node.visit_mut_children_with(self)
                        }
                    }
                ),
            };

            items.push(method.parse());
        }

        items
    }

    /// Add fast path to a method
    fn patch_method(&self, mut m: ImplItemMethod) -> ImplItemMethod {
        let ty_arg = m
            .sig
            .inputs
            .last()
            .expect("method of Fold / VisitMut must accept two parameters");
        let ty_arg = match ty_arg {
            FnArg::Receiver(_) => unreachable!(),
            FnArg::Typed(ty) => ty,
        };
        if m.sig.ident == "visit_mut_ident" || m.sig.ident == "fold_ident" {
            return m;
        }
        if m.block.stmts.is_empty() {
            return m;
        }

        let arg = match &*ty_arg.pat {
            Pat::Ident(i) => &i.ident,
            _ => unimplemented!(
                "Fast-path injection for Fold / VisitMut where pattern is not an ident"
            ),
        };

        let fast_path = match self.mode {
            Mode::Fold => q!(
                Vars {
                    Checker: &self.handler,
                    arg
                },
                {
                    if !swc_ecma_transforms_base::perf::should_work::<Checker, _>(&arg) {
                        return arg;
                    }
                }
            )
            .parse::<Stmt>(),
            Mode::VisitMut => q!(
                Vars {
                    Checker: &self.handler,
                    arg
                },
                {
                    if !swc_ecma_transforms_base::perf::should_work::<Checker, _>(&*arg) {
                        return;
                    }
                }
            )
            .parse::<Stmt>(),
        };
        let mut stmts = vec![fast_path];
        stmts.extend(m.block.stmts);

        m.block.stmts = stmts;
        m
    }
}
