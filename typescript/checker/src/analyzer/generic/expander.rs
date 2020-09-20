use crate::{
    analyzer::Analyzer,
    ty::{
        self, Array, IndexedAccessType, Mapped, Operator, PropertySignature, Ref, Type,
        TypeElement, TypeLit,
    },
    ValidationResult,
};
use fxhash::{FxHashMap, FxHashSet};
use swc_atoms::js_word;
use swc_common::Spanned;
use swc_ecma_ast::{TsEntityName, TsTypeOperatorOp};
use swc_ts_types::{FoldWith as _, Id};

/// Generic expander.
impl Analyzer<'_, '_> {
    pub(in super::super) fn expand_type_params(
        &mut self,
        params: &FxHashMap<Id, Box<Type>>,
        ty: Box<Type>,
    ) -> ValidationResult {
        self.expand_type_params_inner(params, ty, false)
    }

    ///
    ///
    ///  This methods handle special types like mapped type.
    ///
    ///  e.g.
    ///      type BadNested<T> = {
    ///          x: T extends number ? T : string;
    ///      };
    ///      T extends {
    ///          [K in keyof BadNested<infer P>]: BadNested<infer P>[K];
    ///      } ? P : never;
    ///
    ///
    ///z     T extends {
    ///          x: infer P extends number ? infer P : string;
    ///      } ? P : never
    fn expand_type_params_inner(
        &mut self,
        params: &FxHashMap<Id, Box<Type>>,
        ty: Box<Type>,
        fully: bool,
    ) -> ValidationResult {
        let mut ty = ty.fold_with(&mut GenericExpander {
            params,
            fully,
            dejavu: Default::default(),
        });

        Ok(ty)
    }

    /// Returns `Some(true)` if `child` extends `parent`.
    fn extends(&self, child: &Type, parent: &Type) -> Option<bool> {
        match child {
            Type::Ref(..) => return None,
            _ => {}
        }
        match parent {
            Type::Ref(..) => return None,
            _ => {}
        }

        let span = child.span();

        match self.assign(parent, child, span) {
            Ok(()) => Some(true),
            _ => None,
        }
    }
}

/// This struct does not expands ref to other thpe. See Analyzer.expand to do
/// such operation.
struct GenericExpander<'a> {
    params: &'a FxHashMap<Id, Box<Type>>,
    /// Expand fully?
    fully: bool,
    dejavu: FxHashSet<Id>,
}

impl ty::Fold for GenericExpander<'_> {
    fn fold_type(&mut self, mut ty: Type) -> Type {
        let old_fully = self.fully;
        self.fully |= match ty {
            Type::Mapped(..) => true,
            _ => false,
        };
        let span = ty.span();

        log::info!("generic_expand: {:?}", &ty);

        match ty {
            Type::Ref(Ref {
                span,
                type_name: TsEntityName::Ident(ref i),
                ref type_args,
                ..
            }) => {
                if i.sym == js_word!("Array") {
                    return Type::Array(Array {
                        span,
                        elem_type: type_args
                            .as_ref()
                            .and_then(|args| args.params.iter().next().cloned())
                            .unwrap_or_else(|| Type::any(span)),
                    });
                }

                if self.dejavu.contains(&i.into()) {
                    log::debug!("Dejavu: {}", i.sym);
                    return ty;
                }

                log::info!("Ref: {}", Id::from(i));

                if let Some(ty) = self.params.get(&i.into()) {
                    return *ty.clone();
                }

                return ty.fold_children_with(self);
            }

            Type::Ref(..) => return ty.fold_children_with(self),

            Type::Param(mut param) => {
                param = param.fold_with(self);

                if let Some(ty) = self.params.get(&param.name) {
                    log::info!("generic_expand: Type parameter: {} => {:?}", param.name, ty);
                    return *ty.clone();
                }

                log::warn!(
                    "generic_expand: Failed to found type parameter instantiation: {}",
                    param.name,
                );

                return Type::Param(param);
            }

            // Alias returns other than self.
            Type::Alias(mut alias) => {
                alias = alias.fold_with(self);
                //
                if let Some(..) = &alias.type_params {
                    // TODO: Handle unresolved type parameter
                    log::warn!("An type alias has type parameters. It may not be fully expanded.");
                }
                return *alias.ty;
            }

            Type::Interface(mut i) if self.fully => {
                i = i.fold_with(self);

                if let Some(..) = &i.type_params {
                    log::error!("An interface has type parameters. It may not be fully expanded.");
                }

                // TODO: Handle super
                if !i.extends.is_empty() {
                    log::error!("not yet implemented: expanding interface which has a parent");
                    return Type::Interface(i);
                }

                return Type::TypeLit(TypeLit {
                    span: i.span,
                    members: i.body,
                });
            }
            Type::Class(mut c) => {
                c = c.fold_with(self);

                if let Some(..) = &c.type_params {
                    log::error!("A class has type parameters. It may not be fully expanded.");
                }

                return Type::Class(c);
            }

            Type::Conditional(mut c) => {
                c = c.fold_with(self);

                // if let Some(v) = self.analyzer.extends(&c.check_type, &c.extends_type) {
                //     return if v { *c.true_type } else { *c.false_type };
                // }

                return Type::Conditional(c);
            }

            Type::Mapped(mut m @ Mapped { ty: Some(..), .. }) => {
                m = m.fold_with(self);

                match m.type_param.constraint {
                    Some(box Type::TypeLit(lit)) => {
                        let ty = m.ty.clone();

                        let members = lit
                            .members
                            .into_iter()
                            .map(|mut v| match v {
                                TypeElement::Property(ref mut p) => {
                                    p.type_ann = ty.clone().map(|v| v.clone());

                                    v
                                }
                                _ => unimplemented!(
                                    "type element other than property in a mapped type"
                                ),
                            })
                            .collect();
                        return Type::TypeLit(TypeLit { span, members });
                    }

                    Some(box Type::Operator(Operator {
                        op: TsTypeOperatorOp::KeyOf,
                        ty: box Type::Union(ref u),
                        ..
                    })) => {
                        log::error!("Union!");
                    }
                    _ => {}
                }

                m.ty = match m.ty {
                    Some(box Type::IndexedAccessType(IndexedAccessType {
                        span,
                        readonly,
                        obj_type,
                        index_type,
                    })) => {
                        match *obj_type {
                            Type::TypeLit(TypeLit { span, members, .. })
                                if members.iter().all(|m| match m {
                                    TypeElement::Property(_) => true,
                                    _ => false,
                                }) =>
                            {
                                let mut new_members = Vec::with_capacity(members.len());
                                for m in members {
                                    match m {
                                        ty::TypeElement::Property(p) => {
                                            //
                                            new_members.push(ty::TypeElement::Property(p));
                                        }
                                        _ => unreachable!(),
                                    }
                                }

                                return Type::TypeLit(TypeLit {
                                    span,
                                    members: new_members,
                                });
                            }

                            _ => Some(box Type::IndexedAccessType(IndexedAccessType {
                                span,
                                readonly,
                                obj_type,
                                index_type,
                            })),
                        }
                    }
                    _ => m.ty,
                };

                if let Some(constraint) = &m.type_param.constraint {
                    match &**constraint {
                        Type::Operator(Operator {
                            span,
                            op: TsTypeOperatorOp::KeyOf,
                            ty,
                        }) => match &**ty {
                            Type::Keyword(..) => return *ty.clone(),
                            Type::TypeLit(TypeLit { span, members, .. })
                                if members.iter().all(|m| match m {
                                    TypeElement::Property(_) => true,
                                    TypeElement::Method(_) => true,
                                    _ => false,
                                }) =>
                            {
                                let mut new_members = Vec::with_capacity(members.len());
                                for member in members {
                                    match member {
                                        ty::TypeElement::Method(method) => {
                                            new_members.push(ty::TypeElement::Property(
                                                PropertySignature {
                                                    span: method.span,
                                                    readonly: method.readonly,
                                                    key: method.key.clone(),
                                                    computed: method.computed,
                                                    optional: method.optional,
                                                    params: vec![],
                                                    type_ann: m.ty.clone().map(|v| v),
                                                    type_params: None,
                                                },
                                            ));
                                        }
                                        ty::TypeElement::Property(p) => {
                                            let mut p = p.clone();
                                            if let Some(ty) = &m.ty {
                                                p.type_ann = Some(ty.clone());
                                            }
                                            //
                                            new_members.push(ty::TypeElement::Property(p));
                                        }
                                        _ => unreachable!(),
                                    }
                                }

                                return Type::TypeLit(TypeLit {
                                    span: *span,
                                    members: new_members,
                                });
                            }
                            _ => {}
                        },

                        _ => {}
                    }
                }

                return Type::Mapped(m);
            }

            Type::This(..) | Type::Keyword(..) | Type::TypeLit(..) | Type::Lit(..) => {
                return ty.fold_children_with(self)
            }

            Type::Query(..)
            | Type::Operator(..)
            | Type::Tuple(..)
            | Type::Infer(..)
            | Type::Import(..)
            | Type::Predicate(..)
            | Type::Array(..)
            | Type::Union(..)
            | Type::Intersection(..)
            | Type::IndexedAccessType(..)
            | Type::Function(..)
            | Type::Constructor(..)
            | Type::Method(..)
            | Type::Enum(..)
            | Type::EnumVariant(..)
            | Type::Interface(..)
            | Type::Namespace(..)
            | Type::Module(..)
            | Type::ClassInstance(..)
            | Type::Mapped(..) => return ty.fold_children_with(self),

            Type::Static(s) => return s.ty.clone().fold_with(self),
            Type::Arc(a) => return (*a).clone().fold_with(self),
        }
    }
}
