use crate::common::Mode;
use pmutil::q;
use proc_macro2::TokenStream;
use syn::{ImplItem, ImplItemMethod, ItemImpl, Type};

pub fn expand(_attr: TokenStream, mut item: ItemImpl) -> ItemImpl {
    let mode = {
        let p = &item.trait_.as_ref().unwrap().1;
        if p.is_ident("Fold") {
            Mode::Fold
        } else if p.is_ident("VisitMut") {
            Mode::VisitMut
        } else {
            unimplemented!("Unknown visitor type: {:?}", p)
        }
    };

    item.items.push(ImplItem::Method(make_par_visit_method(
        mode,
        "module_items",
        8,
    )));
    item.items
        .push(ImplItem::Method(make_par_visit_method(mode, "stmts", 7)));

    item
}

fn node_type(suffix: &str) -> Type {
    match suffix {
        "module_items" => q!((ModuleItem)).parse(),
        "stmts" => q!((Stmt)).parse(),
        _ => {
            unimplemented!("Unknown suffix `{}`", suffix)
        }
    }
}

fn make_par_visit_method(mode: Mode, suffix: &str, threshold: usize) -> ImplItemMethod {
    match mode {
        Mode::Fold => q!(
            Vars {
                NodeType: node_type(suffix),
                threshold,
            },
            {
                fn method_name(&mut self, nodes: Vec<NodeType>) -> Vec<NodeType> {
                    #[cfg(feature = "rayon")]
                    if nodes.len() >= threshold {
                        use rayon::prelude::*;

                        let (visitor, nodes) = nodes
                            .into_par_iter()
                            .map(|node| {
                                let mut visitor = Self::default();
                                let node = node.fold_with(&mut visitor);

                                (visitor, node)
                            })
                            .fold(
                                || (Self::default(), vec![]),
                                |mut a, b| {
                                    swc_ecma_transforms_base::parallel::Parallel::merge(
                                        &mut a.0, b.0,
                                    );
                                    a.1.push(b.1);
                                    a
                                },
                            );
                        swc_ecma_transforms_base::parallel::Parallel::merge(self, vistor);

                        return nodes;
                    }

                    nodes.fold_children_with(self)
                }
            }
        )
        .parse(),
        Mode::VisitMut => q!(
            Vars {
                NodeType: node_type(suffix),
                threshold,
            },
            {
                fn method_name(&mut self, nodes: &mut Vec<NodeType>) {
                    #[cfg(feature = "rayon")]
                    if nodes.len() >= threshold {
                        use rayon::prelude::*;

                        let visitor = nodes
                            .into_par_iter()
                            .map(|node| {
                                let mut visitor = Self::default();
                                node.visit_mut_with(&mut visitor);

                                visitor
                            })
                            .reduce(
                                || Self::default(),
                                |mut a, b| {
                                    swc_ecma_transforms_base::parallel::Parallel::merge(a, b);
                                },
                            );

                        swc_ecma_transforms_base::parallel::Parallel::merge(self, vistor);

                        return;
                    }

                    nodes.visit_mut_children_with(self);
                }
            }
        )
        .parse(),
    }
}
