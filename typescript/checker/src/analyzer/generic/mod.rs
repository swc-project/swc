use self::remover::TypeParamRemover;
use super::Analyzer;
use crate::{
    analyzer::scope::Scope,
    builtin_types,
    debug::print_backtrace,
    id::Id,
    ty::{
        self, Alias, Array, CallSignature, Conditional, FnParam, IndexSignature, IndexedAccessType,
        Interface, Mapped, Operator, PropertySignature, Ref, Tuple, Type, Type::Param, TypeElement,
        TypeLit, TypeOrSpread, TypeParam, TypeParamDecl, TypeParamInstantiation, Union,
    },
    util::{EqIgnoreSpan, TypeEq},
    ValidationResult,
};
use fxhash::{FxHashMap, FxHashSet};
use itertools::{EitherOrBoth, Itertools};
use std::{collections::hash_map::Entry, mem::take};
use swc_atoms::js_word;
use swc_common::{
    Fold, FoldWith, Span, Spanned, Visit, VisitMut, VisitMutWith, VisitWith, DUMMY_SP,
};
use swc_ecma_ast::*;

mod expander;
mod remover;

#[derive(Debug, Default)]
struct InferData {
    /// Inferred type parameters
    type_params: FxHashMap<Id, Type>,

    /// Type parameters which requires renaming.
    pending_type_params: FxHashMap<Id, Type>,

    type_elements: FxHashMap<Id, Type>,
}

/// Type inference for arguments.
impl Analyzer<'_, '_> {
    /// Create [TypeParamInstantiation] from inferred type information.
    pub(super) fn instantiate(
        &mut self,
        span: Span,
        type_params: &[TypeParam],
        mut inferred: FxHashMap<Id, Type>,
    ) -> ValidationResult<TypeParamInstantiation> {
        let mut params = Vec::with_capacity(type_params.len());
        for type_param in type_params {
            if let Some(ty) = inferred.remove(&type_param.name) {
                log::info!("infer_arg_type: {}", type_param.name);
                params.push(ty);
            } else {
                match type_param.constraint {
                    Some(box Type::Param(ref p)) => {
                        // TODO: Handle complex inheritance like
                        //      function foo<A extends B, B extends C>(){ }

                        if let Some(actual) = inferred.remove(&p.name) {
                            log::info!(
                                "infer_arg_type: {} => {} => {:?} because of the extends clause",
                                type_param.name,
                                p.name,
                                actual
                            );
                            params.push(actual);
                        } else {
                            log::info!(
                                "infer_arg_type: {} => {} because of the extends clause",
                                type_param.name,
                                p.name
                            );
                            params.push(Type::Param(p.clone()));
                        }
                        continue;
                    }
                    _ => {}
                }

                if type_param.constraint.is_some()
                    && is_literals(&type_param.constraint.as_ref().unwrap())
                {
                    params.push(*type_param.constraint.clone().unwrap());
                    continue;
                }

                if type_param.constraint.is_some()
                    && match **type_param.constraint.as_ref().unwrap() {
                        Type::Interface(..)
                        | Type::Keyword(..)
                        | Type::Ref(..)
                        | Type::TypeLit(..) => true,
                        _ => false,
                    }
                {
                    let ty =
                        self.expand_fully(span, *type_param.constraint.clone().unwrap(), false)?;
                    params.push(ty);
                    continue;
                }

                log::warn!(
                    "instantiate: A type parameter {} defaults to {{}}",
                    type_param.name
                );

                // Defaults to {}
                params.push(Type::TypeLit(TypeLit {
                    span,
                    members: vec![],
                }));
            }
        }

        Ok(TypeParamInstantiation {
            span: DUMMY_SP,
            params,
        })
    }

    /// This method accepts Option<&[TypeParamInstantiation]> because user may
    /// provide only some of type arguments.
    pub(super) fn infer_arg_types(
        &mut self,
        span: Span,
        base: Option<&TypeParamInstantiation>,
        type_params: &[TypeParam],
        params: &[FnParam],
        args: &[TypeOrSpread],
    ) -> ValidationResult<FxHashMap<Id, Type>> {
        log::debug!(
            "infer_arg_types: {:?}",
            type_params
                .iter()
                .map(|p| format!("{}, ", p.name))
                .collect::<String>()
        );

        let mut inferred = InferData::default();

        if let Some(base) = base {
            for (param, type_param) in base.params.iter().zip(type_params) {
                inferred
                    .type_params
                    .insert(type_param.name.clone(), param.clone());
            }
        }

        // TODO: Handle optional parameters
        // TODO: Convert this to error.
        assert!(args.len() <= params.len());

        for (p, arg) in params.iter().zip(args) {
            assert_eq!(
                arg.spread, None,
                "argument inference for spread argument in a function / method call is not \
                 implemented yet"
            );

            self.infer_type(&mut inferred, &p.ty, &arg.ty)?;
        }

        for type_param in type_params {
            if inferred.type_params.contains_key(&type_param.name) {
                continue;
            }

            match type_param.constraint {
                Some(box Type::Param(ref p)) => {
                    // TODO: Handle complex inheritance like
                    //      function foo<A extends B, B extends C>(){ }

                    if let Some(actual) = inferred.type_params.remove(&p.name) {
                        log::info!(
                            "infer_arg_type: {} => {} => {:?} because of the extends clause",
                            type_param.name,
                            p.name,
                            actual
                        );
                        inferred.type_params.insert(p.name.clone(), actual.clone());
                        inferred.type_params.insert(type_param.name.clone(), actual);
                    } else {
                        log::info!(
                            "infer_arg_type: {} => {} because of the extends clause",
                            type_param.name,
                            p.name
                        );
                        inferred
                            .type_params
                            .insert(type_param.name.clone(), Type::Param(p.clone()));
                    }
                    continue;
                }
                _ => {}
            }

            if type_param.constraint.is_some()
                && is_literals(&type_param.constraint.as_ref().unwrap())
            {
                inferred.type_params.insert(
                    type_param.name.clone(),
                    *type_param.constraint.clone().unwrap(),
                );
                continue;
            }

            if type_param.constraint.is_some()
                && match **type_param.constraint.as_ref().unwrap() {
                    Type::Interface(..) | Type::Keyword(..) | Type::Ref(..) | Type::TypeLit(..) => {
                        true
                    }
                    _ => false,
                }
            {
                let ty = self.expand_fully(span, *type_param.constraint.clone().unwrap(), false)?;
                inferred.type_params.insert(type_param.name.clone(), ty);
                continue;
            }

            log::warn!(
                "infer: A type parameter {} defaults to {{}}",
                type_param.name
            );

            // Defaults to {}
            inferred.type_params.insert(
                type_param.name.clone(),
                Type::TypeLit(TypeLit {
                    span,
                    members: vec![],
                }),
            );
        }

        Ok(inferred.type_params)
    }

    fn infer_type(
        &mut self,
        inferred: &mut InferData,
        param: &Type,
        arg: &Type,
    ) -> ValidationResult<()> {
        let param = param.normalize();
        let arg = arg.normalize();

        match arg {
            Type::Union(arg) => {
                //
                for a in &arg.types {
                    self.infer_type(inferred, param, a)?;
                }

                return Ok(());
            }

            _ => {}
        }

        match param {
            Type::Param(TypeParam {
                ref name,
                ref constraint,
                ..
            }) => {
                log::trace!("infer_type: type parameter: {} = {:?}", name, constraint);

                if constraint.is_some() && is_literals(&constraint.as_ref().unwrap()) {
                    log::info!("infer from literal constraint: {} = {:?}", name, constraint);
                    if let Some(orig) = inferred
                        .type_params
                        .insert(name.clone(), *constraint.clone().unwrap())
                    {
                        if !orig.eq_ignore_span(&constraint.as_ref().unwrap()) {
                            print_backtrace();
                            panic!(
                                "Cannot override T in `T extends <literal>`\nOrig: \
                                 {:?}\nConstraints: {:?}",
                                orig, constraint
                            )
                        }
                    }

                    return Ok(());
                }

                if constraint.is_some()
                    && match **constraint.as_ref().unwrap() {
                        Type::Interface(..)
                        | Type::Keyword(..)
                        | Type::Ref(..)
                        | Type::TypeLit(..) => true,
                        _ => false,
                    }
                {
                    log::info!("infer from constraint: {} = {:?}", name, constraint);
                    inferred
                        .type_params
                        .insert(name.clone(), *constraint.clone().unwrap())
                        .expect_none("Cannot override");
                    return Ok(());
                }

                log::info!("({}): infer: {} = {:?}", self.scope.depth(), name, arg);
                match inferred.type_params.entry(name.clone()) {
                    Entry::Occupied(mut e) => {
                        // Use this for type inference.
                        let (name, param_ty) = e.remove_entry();

                        // We pass in inverse order to infer type of arg from the type information
                        // of parameter
                        self.infer_type(inferred, &arg, &param_ty)?;

                        if let Some(orig) = inferred
                            .type_params
                            .insert(name, Type::union(vec![param_ty, arg.clone()]))
                        {
                            match orig {
                                Type::Union(..) => {
                                    // TODO: Verify that orig is union of
                                    // param_ty and arg_ty
                                }
                                _ => {
                                    print_backtrace();
                                    panic!(
                                        "Cannot override T in `T = param_ty | arg_ty`\nOrig: {:?}",
                                        orig
                                    )
                                }
                            }
                        }
                    }
                    Entry::Vacant(e) => {
                        e.insert(arg.clone());
                    }
                }

                return Ok(());
            }

            Type::Array(Array { elem_type, .. }) => match arg {
                Type::Array(Array {
                    elem_type: arg_elem_type,
                    ..
                }) => return self.infer_type(inferred, &elem_type, &arg_elem_type),

                Type::Tuple(arg) => {
                    let arg = Type::union(arg.types.iter().cloned());
                    return self.infer_type(inferred, &elem_type, &arg);
                }

                _ => {}
            },

            // TODO: Check if index type extends `keyof obj_type`
            Type::IndexedAccessType(IndexedAccessType {
                obj_type: box Type::Param(param_obj),
                index_type:
                    box Type::Param(TypeParam {
                        constraint: Some(..),
                        ..
                    }),
                ..
            }) => {
                match inferred.type_elements.entry(param_obj.name.clone()) {
                    Entry::Occupied(mut e) => {
                        let (name, prev_ty) = e.remove_entry();

                        inferred
                            .type_elements
                            .insert(name, Type::union(vec![prev_ty, arg.clone()]))
                            .expect_none("Cannot override");
                    }
                    Entry::Vacant(e) => {
                        e.insert(arg.clone());
                    }
                }

                return Ok(());
            }

            Type::Function(p) => match arg {
                Type::Function(a) => {
                    self.infer_type_of_fn_params(inferred, &p.params, &a.params)?;
                    self.infer_type(inferred, &p.ret_ty, &a.ret_ty)?;
                    if let Some(arg_type_params) = &a.type_params {
                        self.rename_inferred(inferred, arg_type_params)?;
                    }
                    return Ok(());
                }
                _ => {
                    dbg!();
                }
            },

            Type::TypeLit(param) => match arg {
                Type::TypeLit(arg) => return self.infer_type_lit(inferred, param, arg),
                _ => {
                    dbg!();
                }
            },

            Type::Tuple(param) => match arg {
                Type::Tuple(arg) => return self.infer_tuple(inferred, param, arg),
                _ => {
                    dbg!();
                }
            },

            Type::Keyword(..) => {
                dbg!();
            }

            Type::Predicate(..) => {
                dbg!();
            }

            Type::Ref(param) => match arg {
                Type::Ref(arg) => {
                    if param.type_args.is_none() && arg.type_args.is_none() {
                        return Ok(());
                    }
                    if param.type_args.is_none() || arg.type_args.is_none() {
                        unimplemented!(
                            "Comparing `Ref<T>` (with type args) and `Ref` (without type args)"
                        );
                    }

                    for pa in param
                        .type_args
                        .as_ref()
                        .unwrap()
                        .params
                        .iter()
                        .zip_longest(arg.type_args.as_ref().unwrap().params.iter())
                    {
                        match pa {
                            EitherOrBoth::Both(param, arg) => {
                                self.infer_type(inferred, param, arg)?;
                            }
                            _ => {
                                unimplemented!(
                                    "type inference: Comparison of Ref<Arg1, Arg2> and Ref<Arg1> \
                                     (different length)"
                                );
                            }
                        }
                    }
                    return Ok(());
                }
                _ => {
                    let param = self.expand_fully(param.span(), Type::Ref(param.clone()), true)?;
                    match param {
                        Type::Ref(..) => {
                            dbg!();

                            log::info!("Ref: {:?}", param);
                        }
                        _ => return self.infer_type(inferred, &param, arg),
                    }
                }
            },

            Type::Lit(..) => match arg {
                Type::Lit(..) => return Ok(()),
                _ => {
                    dbg!();
                }
            },

            // TODO: implement
            Type::Union(param) => {
                //
                for p in &param.types {
                    self.infer_type(inferred, p, arg)?;
                }

                return Ok(());
            }

            Type::Alias(param) => {
                self.infer_type(inferred, &param.ty, arg)?;
                if let Some(type_params) = &param.type_params {
                    self.rename_inferred(inferred, type_params)?;
                }
                return Ok(());
            }

            Type::Mapped(
                param
                @
                Mapped {
                    type_param:
                        TypeParam {
                            constraint:
                                Some(box Type::Operator(Operator {
                                    op: TsTypeOperatorOp::KeyOf,
                                    ty: box Type::Param(..),
                                    ..
                                })),
                            ..
                        },
                    ..
                },
            ) => {
                let name = match param.type_param.constraint {
                    Some(box Type::Operator(Operator {
                        ty: box Type::Param(TypeParam { ref name, .. }),
                        ..
                    })) => name.clone(),
                    _ => unreachable!(),
                };
                //
                match arg {
                    Type::TypeLit(arg) => {
                        if let Some(param_ty) = &param.ty {
                            let mut new_members =
                                Vec::<TypeElement>::with_capacity(arg.members.len());
                            for member in &arg.members {
                                match member {
                                    TypeElement::Property(p) => {
                                        //
                                        let old = take(&mut inferred.type_elements);
                                        let type_ann: Option<_> = if let Some(pt) = &p.type_ann {
                                            self.infer_type(inferred, param_ty, pt)?;

                                            inferred.type_elements.get(&name).cloned()
                                        } else {
                                            None
                                        };
                                        let type_ann = type_ann.or_else(|| p.type_ann.clone());

                                        new_members.push(TypeElement::Property(
                                            PropertySignature {
                                                type_ann,
                                                ..p.clone()
                                            },
                                        ));

                                        inferred.type_elements = old;
                                    }
                                    TypeElement::Index(i) => {
                                        let old = take(&mut inferred.type_elements);

                                        let type_ann = if let Some(pt) = &i.type_ann {
                                            self.infer_type(inferred, param_ty, pt)?;
                                            // inferred.type_elements.remove(&name)
                                            None
                                        } else {
                                            Some(Type::any(i.span))
                                        };
                                        new_members.push(TypeElement::Index(IndexSignature {
                                            type_ann,
                                            ..i.clone()
                                        }));

                                        inferred.type_elements = old;
                                    }

                                    _ => unimplemented!(
                                        "infer_type: Mapped <- Assign: TypeElement({:#?})",
                                        member
                                    ),
                                }
                            }

                            assert_eq!(
                                inferred.type_params.insert(
                                    name,
                                    Type::TypeLit(TypeLit {
                                        span: arg.span,
                                        members: new_members
                                    })
                                ),
                                None
                            );
                        }

                        return Ok(());
                    }
                    // Handled by generic expander, so let's return it as-is.
                    _ => {}
                }
            }

            Type::Mapped(
                param
                @
                Mapped {
                    type_param:
                        TypeParam {
                            constraint: Some(box Type::Param(..)),
                            ..
                        },
                    ..
                },
            ) => {
                let name = match param.type_param.constraint {
                    Some(box Type::Param(TypeParam { ref name, .. })) => name.clone(),
                    _ => unreachable!(),
                };
                //
                dbg!(&name);

                match arg {
                    Type::TypeLit(arg) => {
                        //
                        if let Some(param_ty) = &param.ty {
                            let mut members = Vec::with_capacity(arg.members.len());

                            for m in &arg.members {
                                match m {
                                    TypeElement::Property(p) => {
                                        //
                                        if let Some(ref type_ann) = p.type_ann {
                                            self.infer_type(inferred, &param_ty, &type_ann)?;
                                        }
                                        members.push(TypeElement::Property(PropertySignature {
                                            type_ann: None,
                                            ..p.clone()
                                        }));
                                    }

                                    _ => unimplemented!(
                                        "infer_type: Mapped <- Assign: TypeElement({:?})",
                                        m
                                    ),
                                }
                            }

                            let list_ty = Type::TypeLit(TypeLit {
                                span: arg.span,
                                members,
                            });

                            inferred
                                .type_params
                                .insert(name.clone(), list_ty)
                                .expect_none("Cannot override");
                        }

                        return Ok(());
                    }
                    // Handled by generic expander, so let's return it as-is.
                    _ => {}
                }
            }

            // Type::Mapped(
            //     param
            //     @
            //     Mapped {
            //         type_param:
            //             TypeParam {
            //                 constraint:
            //                     Some(box Type::Operator(Operator {
            //                         op: TsTypeOperatorOp::KeyOf,
            //                         ty:
            //                             box Type::IndexedAccessType(IndexedAccessType {
            //                                 obj_type: box Type::Param(..),
            //                                 index_type: box Type::Param(..),
            //                                 ..
            //                             }),
            //                         ..
            //                     })),
            //                 ..
            //             },
            //         ty: Some(..),
            //         ..
            //     },
            // ) => {
            //     let param_ty = param.ty.unwrap();
            //     let name = param.type_param.name.clone();
            //     let (obj_ty, index_ty) = match &**param.type_param.constraint.as_ref().unwrap() {
            //         Type::Operator(Operator {
            //             ty:
            //                 box Type::IndexedAccessType(IndexedAccessType {
            //                     obj_type: box Type::Param(obj_ty),
            //                     index_type: box Type::Param(index_ty),
            //                     ..
            //                 }),
            //             ..
            //         }) => (obj_ty, index_ty),
            //         _ => unreachable!(),
            //     };
            //     if name == index_ty.name {
            //         match arg {
            //             Type::TypeLit(arg) => {
            //                 let mut members = Vec::with_capacity(arg.members.len());
            //
            //                 for m in &arg.members {
            //                     match m {
            //                         TypeElement::Property(p) => {
            //                             //
            //                             if let Some(ref type_ann) = p.type_ann {
            //                                 self.infer_type(inferred, &param_ty, &type_ann)?;
            //                             }
            //                             members.push(TypeElement::Property(PropertySignature {
            //                                 type_ann: None,
            //                                 ..p.clone()
            //                             }));
            //                         }
            //
            //                         _ => unimplemented!(
            //                             "infer_type: Mapped <- Assign: TypeElement({:?})",
            //                             m
            //                         ),
            //                     }
            //                 }
            //
            //                 let list_ty = Type::TypeLit(TypeLit {
            //                     span: arg.span,
            //                     members,
            //                 });
            //
            //                 inferred
            //                     .type_params
            //                     .insert(name.clone(), list_ty)
            //                     .expect_none("Cannot override");
            //                 return Ok(());
            //             }
            //
            //             _ => {}
            //         }
            //     }
            // }
            _ => {}
        }

        match arg {
            // Handled by generic expander, so let's return it as-is.
            Type::Mapped(..) => {}
            Type::Keyword(..) => {}
            Type::Ref(..) => {
                let arg = self.expand(arg.span(), arg.clone())?;
                match arg {
                    Type::Ref(..) => {}
                    _ => {
                        return self.infer_type(inferred, param, &arg);
                    }
                }
            }
            Type::Alias(arg) => return self.infer_type(inferred, param, &arg.ty),
            _ => {}
        }

        log::error!(
            "infer_arg_type: unimplemented\nparam  = {:#?}\narg = {:#?}",
            param,
            arg,
        );
        Ok(())
    }

    fn infer_type_lit(
        &mut self,
        inferred: &mut InferData,
        param: &TypeLit,
        arg: &TypeLit,
    ) -> ValidationResult<()> {
        for p in &param.members {
            for a in &arg.members {
                //

                match p {
                    TypeElement::Property(p) => match a {
                        TypeElement::Property(a) => {
                            if p.key.type_eq(&a.key) {
                                if let Some(pt) = &p.type_ann {
                                    if let Some(at) = &a.type_ann {
                                        self.infer_type(inferred, pt, at)?;
                                    } else {
                                        dbg!((&p, &a));
                                    }
                                } else {
                                    dbg!((&p, &a));
                                }
                            }
                        }
                        _ => {}
                    },
                    TypeElement::Index(p) => match a {
                        TypeElement::Property(a) => {
                            if p.params.len() != 1 {
                                unimplemented!(
                                    "handling of IndexSignature with zero / multiple parameters"
                                );
                            }

                            if let Some(p_type_ann) = &p.type_ann {
                                if let Some(a_type_ann) = &a.type_ann {
                                    self.infer_type(inferred, p_type_ann, a_type_ann)?;
                                }
                            }
                        }
                        TypeElement::Index(a) => {
                            if p.params.type_eq(&a.params) {
                                if let Some(pt) = &p.type_ann {
                                    if let Some(at) = &a.type_ann {
                                        self.infer_type(inferred, pt, at)?;
                                    }
                                } else {
                                    dbg!((&p, &a));
                                }
                            } else {
                                dbg!((&p, &a));
                            }
                        }
                        _ => {}
                    },
                    _ => unimplemented!("TypeElement({:#?}) in type literal", p),
                }
            }
        }

        Ok(())
    }

    fn infer_tuple(
        &mut self,
        inferred: &mut InferData,
        param: &Tuple,
        arg: &Tuple,
    ) -> ValidationResult<()> {
        for item in param.types.iter().zip_longest(&arg.types) {
            match item {
                EitherOrBoth::Both(param, arg) => self.infer_type(inferred, param, arg)?,
                EitherOrBoth::Left(_) => {}
                EitherOrBoth::Right(_) => {}
            }
        }

        Ok(())
    }

    fn infer_type_of_fn_param(
        &mut self,
        inferred: &mut InferData,
        param: &FnParam,
        arg: &FnParam,
    ) -> ValidationResult<()> {
        self.infer_type(inferred, &param.ty, &arg.ty)
    }

    fn infer_type_of_fn_params(
        &mut self,
        inferred: &mut InferData,
        params: &[FnParam],
        args: &[FnParam],
    ) -> ValidationResult<()> {
        for (param, arg) in params.iter().zip(args) {
            self.infer_type_of_fn_param(inferred, param, arg)?
        }

        Ok(())
    }

    fn rename_inferred(
        &mut self,
        inferred: &mut InferData,
        arg_type_params: &TypeParamDecl,
    ) -> ValidationResult<()> {
        struct Renamer<'a> {
            fixed: &'a FxHashMap<Id, Type>,
        }

        impl VisitMut<Type> for Renamer<'_> {
            fn visit_mut(&mut self, node: &mut Type) {
                match node {
                    Type::Param(p) if self.fixed.contains_key(&p.name) => {
                        *node = (*self.fixed.get(&p.name).unwrap()).clone();
                    }
                    _ => node.visit_mut_children(self),
                }
            }
        }

        //
        let mut fixed = FxHashMap::default();

        inferred.type_params.iter().for_each(|(param_name, ty)| {
            // Ignore unrelated type parameters
            if arg_type_params.params.iter().all(|v| *param_name != v.name) {
                return;
            }
            fixed.insert(param_name.clone(), ty.clone());
        });

        let mut v = Renamer { fixed: &fixed };
        inferred.type_params.iter_mut().for_each(|(_, ty)| {
            ty.visit_mut_with(&mut v);
        });

        Ok(())
    }
}

/// Handles renaming of the type parameters.
impl Analyzer<'_, '_> {
    pub(super) fn rename_type_params(
        &mut self,
        span: Span,
        mut ty: Type,
        type_ann: Option<&Type>,
    ) -> ValidationResult {
        if self.is_builtin {
            return Ok(ty);
        }
        log::debug!(
            "rename_type_params(has_ann = {:?}, ty = {:?})",
            type_ann.is_some(),
            ty
        );

        // ty = self.expand(span, ty)?;

        let mut usage_visitor = TypeParamUsageFinder::default();
        ty.normalize().visit_with(&mut usage_visitor);
        if usage_visitor.params.is_empty() {
            log::debug!("rename_type_param: No type parameter is used in type");
            match ty {
                Type::Function(ref mut f) => {
                    f.type_params = None;
                }

                _ => {}
            }

            return Ok(ty);
        }

        let mut inferred = InferData::default();

        if let Some(type_ann) = type_ann {
            self.infer_type(&mut inferred, &ty, type_ann)?;
            log::info!(
                "renaming type parameters based on type annotation provided by user\ntype_ann = \
                 {:?}",
                type_ann
            );
            return Ok(ty.into_owned().fold_with(&mut TypeParamRenamer {
                inferred: inferred.type_params,
            }));
        }

        let decl = Some(TypeParamDecl {
            span: DUMMY_SP,
            params: usage_visitor.params,
        });

        match ty {
            Type::Function(ref mut f) => {
                f.type_params = decl;
            }

            _ => {}
        }

        Ok(ty.fold_with(&mut TypeParamRemover::new()))
    }
}

#[derive(Debug)]
struct TypeParamRenamer {
    inferred: FxHashMap<Id, Type>,
}

impl Fold<Type> for TypeParamRenamer {
    fn fold(&mut self, mut ty: Type) -> Type {
        ty = ty.fold_children(self);

        match ty {
            Type::Param(ref param) => {
                if let Some(ty) = self.inferred.get(&param.name) {
                    return ty.clone();
                }
            }
            _ => {}
        }

        ty
    }
}

#[derive(Debug, Default)]
struct TypeParamUsageFinder {
    params: Vec<TypeParam>,
}

impl Visit<TypeParamDecl> for TypeParamUsageFinder {
    #[inline]
    fn visit(&mut self, _: &TypeParamDecl) {}
}

impl Visit<TypeParam> for TypeParamUsageFinder {
    fn visit(&mut self, node: &TypeParam) {
        for p in &self.params {
            if node.name == p.name {
                return;
            }
        }

        log::info!("Found type parameter({})", node.name);

        self.params.push(node.clone());
    }
}

/// This method returns true for types like `'foo'` and `'foo' | 'bar'`.
pub(super) fn is_literals(ty: &Type) -> bool {
    match ty.normalize() {
        Type::Lit(_) => true,
        Type::Union(Union { ref types, .. }) => types.iter().all(|v| is_literals(v)),
        _ => false,
    }
}
