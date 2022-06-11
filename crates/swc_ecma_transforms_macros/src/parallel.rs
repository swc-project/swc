use pmutil::q;
use proc_macro2::{Span, TokenStream};
use syn::{Expr, Ident, ImplItem, ImplItemMethod, ItemImpl, Meta, Type};

use crate::common::Mode;

pub fn expand(attr: TokenStream, mut item: ItemImpl) -> ItemImpl {
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
    let meta = if attr.is_empty() {
        None
    } else {
        Some(syn::parse2::<Meta>(attr).expect("failed to parse meta"))
    };
    let explode = meta
        .as_ref()
        .map(|v| v.path().is_ident("explode"))
        .unwrap_or(false);

    item.items.push(ImplItem::Method(make_par_visit_method(
        mode,
        "module_items",
        explode,
        1,
    )));
    item.items.push(ImplItem::Method(make_par_visit_method(
        mode, "stmts", explode, 1,
    )));

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

fn explode_hook_method_name(explode: bool, suffix: &str) -> Option<Ident> {
    if !explode {
        return None;
    }
    match suffix {
        "module_items" => Some(Ident::new("after_one_module_item", Span::call_site())),
        "stmts" => Some(Ident::new("after_one_stmt", Span::call_site())),
        _ => None,
    }
}

fn make_par_visit_method(
    mode: Mode,
    suffix: &str,
    explode: bool,
    threshold: usize,
) -> ImplItemMethod {
    let method_name = Ident::new(&format!("{}_{}", mode.prefix(), suffix), Span::call_site());
    let hook = post_visit_hook(mode, suffix);
    let explode_method_name = explode_hook_method_name(explode, suffix);

    let threshold = q!(Vars { threshold }, {
        (swc_ecma_transforms_base::perf::cpu_count() * threshold)
    });

    match (mode, explode_method_name) {
        (Mode::Fold, Some(explode_method_name)) => q!(
            Vars {
                NodeType: node_type(suffix),
                threshold,
                method_name,
                hook,
                explode_method_name,
            },
            {
                fn method_name(&mut self, mut nodes: Vec<NodeType>) -> Vec<NodeType> {
                    use swc_common::errors::HANDLER;
                    use swc_ecma_transforms_base::perf::{ParExplode, Parallel};
                    use swc_ecma_visit::FoldWith;

                    #[cfg(feature = "rayon")]
                    if nodes.len() >= threshold {
                        use rayon::prelude::*;

                        let (visitor, mut nodes) = ::swc_common::GLOBALS.with(|globals| {
                            swc_ecma_transforms_base::helpers::HELPERS.with(|helpers| {
                                HANDLER.with(|handler| {
                                    nodes
                                        .into_par_iter()
                                        .map(|node| {
                                            ::swc_common::GLOBALS.set(&globals, || {
                                                swc_ecma_transforms_base::helpers::HELPERS.set(
                                                    helpers,
                                                    || {
                                                        HANDLER.set(handler, || {
                                                            let mut visitor =
                                                                Parallel::create(&*self);
                                                            let node = node.fold_with(&mut visitor);
                                                            let mut nodes = Vec::with_capacity(4);

                                                            ParExplode::explode_method_name(
                                                                &mut visitor,
                                                                &mut nodes,
                                                            );

                                                            nodes.push(node);

                                                            (visitor, nodes)
                                                        })
                                                    },
                                                )
                                            })
                                        })
                                        .reduce(
                                            || (Parallel::create(&*self), vec![]),
                                            |mut a, b| {
                                                Parallel::merge(&mut a.0, b.0);

                                                a.1.extend(b.1);

                                                a
                                            },
                                        )
                                })
                            })
                        });

                        Parallel::merge(self, visitor);

                        {
                            hook;
                        }

                        return nodes;
                    }

                    let mut buf = Vec::with_capacity(nodes.len());

                    for node in nodes {
                        let mut visitor = Parallel::create(&*self);
                        let node = node.fold_with(&mut visitor);
                        ParExplode::explode_method_name(&mut visitor, &mut buf);
                        buf.push(node);
                    }

                    let mut nodes = buf;
                    {
                        hook;
                    }

                    nodes
                }
            }
        )
        .parse(),

        (Mode::Fold, None) => q!(
            Vars {
                NodeType: node_type(suffix),
                threshold,
                method_name,
                hook,
            },
            {
                fn method_name(&mut self, nodes: Vec<NodeType>) -> Vec<NodeType> {
                    use swc_common::errors::HANDLER;
                    use swc_ecma_transforms_base::perf::Parallel;
                    use swc_ecma_visit::FoldWith;

                    #[cfg(feature = "rayon")]
                    if nodes.len() >= threshold {
                        use rayon::prelude::*;

                        let (visitor, mut nodes) = ::swc_common::GLOBALS.with(|globals| {
                            swc_ecma_transforms_base::helpers::HELPERS.with(|helpers| {
                                HANDLER.with(|handler| {
                                    nodes
                                        .into_par_iter()
                                        .map(|node| {
                                            ::swc_common::GLOBALS.set(&globals, || {
                                                swc_ecma_transforms_base::helpers::HELPERS.set(
                                                    helpers,
                                                    || {
                                                        HANDLER.set(handler, || {
                                                            let mut visitor =
                                                                Parallel::create(&*self);
                                                            let node = node.fold_with(&mut visitor);

                                                            (visitor, node)
                                                        })
                                                    },
                                                )
                                            })
                                        })
                                        .fold(
                                            || (Parallel::create(&*self), vec![]),
                                            |mut a, b| {
                                                Parallel::merge(&mut a.0, b.0);

                                                a.1.push(b.1);

                                                a
                                            },
                                        )
                                        .reduce(
                                            || (Parallel::create(&*self), vec![]),
                                            |mut a, b| {
                                                Parallel::merge(&mut a.0, b.0);

                                                a.1.extend(b.1);

                                                a
                                            },
                                        )
                                })
                            })
                        });

                        Parallel::merge(self, visitor);

                        {
                            hook;
                        }

                        return nodes;
                    }

                    let mut nodes = nodes.fold_children_with(self);
                    {
                        hook;
                    }

                    nodes
                }
            }
        )
        .parse(),

        (Mode::VisitMut, Some(explode_method_name)) => q!(
            Vars {
                NodeType: node_type(suffix),
                threshold,
                method_name,
                hook,
                explode_method_name
            },
            {
                fn method_name(&mut self, nodes: &mut Vec<NodeType>) {
                    use std::mem::take;

                    use swc_common::errors::HANDLER;
                    use swc_ecma_transforms_base::perf::{ParExplode, Parallel};
                    use swc_ecma_visit::VisitMutWith;

                    #[cfg(feature = "rayon")]
                    if nodes.len() >= threshold {
                        ::swc_common::GLOBALS.with(|globals| {
                            swc_ecma_transforms_base::helpers::HELPERS.with(|helpers| {
                                HANDLER.with(|handler| {
                                    use rayon::prelude::*;

                                    let (visitor, new_nodes) = take(nodes)
                                        .into_par_iter()
                                        .map(|mut node| {
                                            ::swc_common::GLOBALS.set(&globals, || {
                                                swc_ecma_transforms_base::helpers::HELPERS.set(
                                                    helpers,
                                                    || {
                                                        HANDLER.set(handler, || {
                                                            let mut visitor =
                                                                Parallel::create(&*self);
                                                            node.visit_mut_with(&mut visitor);

                                                            let mut nodes = Vec::with_capacity(4);

                                                            ParExplode::explode_method_name(
                                                                &mut visitor,
                                                                &mut nodes,
                                                            );

                                                            nodes.push(node);

                                                            (visitor, nodes)
                                                        })
                                                    },
                                                )
                                            })
                                        })
                                        .reduce(
                                            || (Parallel::create(&*self), vec![]),
                                            |mut a, b| {
                                                Parallel::merge(&mut a.0, b.0);

                                                a.1.extend(b.1);

                                                a
                                            },
                                        );

                                    Parallel::merge(self, visitor);

                                    {
                                        hook;
                                    }

                                    *nodes = new_nodes;
                                })
                            })
                        });

                        return;
                    }

                    let mut buf = Vec::with_capacity(nodes.len());

                    for mut node in take(nodes) {
                        let mut visitor = Parallel::create(&*self);
                        node.visit_mut_with(&mut visitor);
                        ParExplode::explode_method_name(&mut visitor, &mut buf);
                        buf.push(node);
                    }

                    *nodes = buf;

                    {
                        hook;
                    }
                }
            }
        )
        .parse(),

        (Mode::VisitMut, None) => q!(
            Vars {
                NodeType: node_type(suffix),
                threshold,
                method_name,
                hook,
            },
            {
                fn method_name(&mut self, nodes: &mut Vec<NodeType>) {
                    use swc_common::errors::HANDLER;
                    use swc_ecma_transforms_base::perf::Parallel;
                    use swc_ecma_visit::VisitMutWith;

                    #[cfg(feature = "rayon")]
                    if nodes.len() >= threshold {
                        ::swc_common::GLOBALS.with(|globals| {
                            swc_ecma_transforms_base::helpers::HELPERS.with(|helpers| {
                                HANDLER.with(|handler| {
                                    use rayon::prelude::*;

                                    let visitor = nodes
                                        .into_par_iter()
                                        .map(|node| {
                                            ::swc_common::GLOBALS.set(&globals, || {
                                                swc_ecma_transforms_base::helpers::HELPERS.set(
                                                    helpers,
                                                    || {
                                                        HANDLER.set(handler, || {
                                                            let mut visitor =
                                                                Parallel::create(&*self);
                                                            node.visit_mut_with(&mut visitor);

                                                            visitor
                                                        })
                                                    },
                                                )
                                            })
                                        })
                                        .reduce(
                                            || Parallel::create(&*self),
                                            |mut a, b| {
                                                Parallel::merge(&mut a, b);

                                                a
                                            },
                                        );

                                    Parallel::merge(self, visitor);

                                    {
                                        hook;
                                    }
                                })
                            })
                        });

                        return;
                    }

                    nodes.visit_mut_children_with(self);
                    {
                        hook;
                    }
                }
            }
        )
        .parse(),
    }
}
