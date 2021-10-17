use crate::common::Mode;
use pmutil::q;
use proc_macro2::{Span, TokenStream};
use syn::{Expr, Ident, ImplItem, ImplItemMethod, ItemImpl, Type};

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

fn post_visit_hook(mode: Mode, suffix: &str) -> Option<Expr> {
    match suffix {
        "module_items" => Some(match mode {
            Mode::Fold => q!(({
                swc_ecma_transforms_base::perf::Parallel::after_module_items(self, &mut nodes);
            }))
            .parse(),
            Mode::VisitMut => q!(({
                swc_ecma_transforms_base::perf::Parallel::after_module_items(self, nodes);
            }))
            .parse(),
        }),
        "stmts" => Some(match mode {
            Mode::Fold => q!(({
                swc_ecma_transforms_base::perf::Parallel::after_stmts(self, &mut nodes);
            }))
            .parse(),
            Mode::VisitMut => q!(({
                swc_ecma_transforms_base::perf::Parallel::after_stmts(self, nodes);
            }))
            .parse(),
        }),
        _ => None,
    }
}

fn make_par_visit_method(mode: Mode, suffix: &str, threshold: usize) -> ImplItemMethod {
    let method_name = Ident::new(&format!("{}_{}", mode.prefix(), suffix), Span::call_site());
    let hook = post_visit_hook(mode, suffix);

    match mode {
        Mode::Fold => q!(
            Vars {
                NodeType: node_type(suffix),
                threshold,
                method_name,
                hook,
            },
            {
                fn method_name(&mut self, nodes: Vec<NodeType>) -> Vec<NodeType> {
                    use swc_ecma_visit::FoldWith;
                    
                    #[cfg(feature = "rayon")]
                    if nodes.len() >= threshold {
                        use rayon::prelude::*;  

                        let (visitor, mut nodes) = ::swc_common::GLOBALS.with(|globals| {
                            swc_ecma_transforms_base::helpers::HELPERS.with(|helpers| {
                                swc_ecma_utils::HANDLER.with(|handler| {
                                    nodes
                                        .into_par_iter()
                                        .map(|node| {
                                            ::swc_common::GLOBALS.set(&globals, || {
                                                swc_ecma_transforms_base::helpers::HELPERS.set(
                                                    helpers,
                                                    || {
                                                        swc_ecma_utils::HANDLER.set(handler, || {
                                                            let mut visitor = swc_ecma_transforms_base::perf::Parallel::create(&*self);
                                                            let node = node.fold_with(&mut visitor);

                                                            (visitor, node)
                                                        })
                                                    },
                                                )
                                            })
                                        })
                                        .fold(
                                            || (swc_ecma_transforms_base::perf::Parallel::create(&*self), vec![]),
                                            |mut a, b| {
                                                swc_ecma_transforms_base::perf::Parallel::merge(
                                                    &mut a.0, b.0,
                                                );
                                                a.1.push(b.1);
                                                a
                                            },
                                        )
                                        .reduce(
                                            ||(swc_ecma_transforms_base::perf::Parallel::create(&*self), vec![]),
                                            |mut a, b| {
                                                swc_ecma_transforms_base::perf::Parallel::merge(
                                                    &mut a.0, b.0,
                                                );

                                                a.1.extend(b.1);

                                                a
                                            }
                                        )
                                })
                            })
                        });

                        {
                            hook;
                        }

                        swc_ecma_transforms_base::perf::Parallel::merge(self, visitor);

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
                method_name,
                hook,
            },
            {
                fn method_name(&mut self, nodes: &mut Vec<NodeType>) {
                    use swc_ecma_visit::VisitMutWith;

                    #[cfg(feature = "rayon")]
                    if nodes.len() >= threshold {
                        ::swc_common::GLOBALS.with(|globals| {
                            swc_ecma_transforms_base::helpers::HELPERS.with(|helpers| {
                                swc_ecma_utils::HANDLER.with(|handler| {
                                    use rayon::prelude::*;

                                    let visitor = nodes
                                        .into_par_iter()
                                        .map(|node| {
                                            ::swc_common::GLOBALS.set(&globals, || {
                                                swc_ecma_transforms_base::helpers::HELPERS.set(
                                                    helpers,
                                                    || {
                                                        swc_ecma_utils::HANDLER.set(handler, || {
                                                            let mut visitor = swc_ecma_transforms_base::perf::Parallel::create(&*self);
                                                            node.visit_mut_with(&mut visitor);

                                                            visitor
                                                        })
                                                    },
                                                )
                                            })
                                        })
                                        .reduce(
                                            || swc_ecma_transforms_base::perf::Parallel::create(&*self),
                                            |mut a, b| {
                                                swc_ecma_transforms_base::perf::Parallel::merge(
                                                    &mut a, b,
                                                );

                                                a
                                            },
                                        );

                                    {
                                        hook;
                                    }

                                    swc_ecma_transforms_base::perf::Parallel::merge(self, visitor);
                                })
                            })
                        });

                        return;
                    }

                    nodes.visit_mut_children_with(self);
                }
            }
        )
        .parse(),
    }
}
