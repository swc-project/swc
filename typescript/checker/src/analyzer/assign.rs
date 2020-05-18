use super::Analyzer;
use crate::{
    analyzer::util::ResultExt,
    debug::print_backtrace,
    errors::{Error, Errors},
    ty::{
        Array, Class, ClassInstance, ClassMember, EnumVariant, FnParam, Function, Interface,
        Intersection, Tuple, Type, TypeElement, TypeLit, TypeParam, Union,
    },
    util::{EqIgnoreSpan, TypeEq},
    ValidationResult,
};
use swc_atoms::js_word;
use swc_common::{Span, Spanned};
use swc_ecma_ast::*;

impl Analyzer<'_, '_> {
    pub fn assign(&self, left: &Type, right: &Type, span: Span) -> Result<(), Error> {
        if self.is_builtin {
            return Ok(());
        }

        debug_assert!(!span.is_dummy());

        self.verify_before_assign("lhs", left);
        self.verify_before_assign("rhs", right);

        let res = self.assign_inner(left, right, span);
        match res {
            Err(Error::Errors { errors, .. }) if errors.is_empty() => return Ok(()),
            _ => {}
        }

        res.map_err(|err| match err {
            Error::AssignFailed { .. } => err,
            Error::Errors { .. } => err,
            _ => Error::AssignFailed {
                span: err.span(),
                left: left.clone(),
                right: right.clone(),
                cause: vec![err],
            },
        })
    }

    /// Verifies that `ty` is
    ///
    ///     - Not a reference
    ///     - Not a type parameter declared on child scope.
    fn verify_before_assign(&self, ctx: &'static str, ty: &Type) {
        match ty.normalize() {
            Type::Ref(ref r) => {
                print_backtrace();
                panic!(
                    "A reference type (in {}) should be expanded before calling .assign()\n{:?}",
                    ctx, r,
                )
            }

            _ => {}
        }
    }

    fn assign_inner(&self, to: &Type, rhs: &Type, span: Span) -> Result<(), Error> {
        debug_assert!(!span.is_dummy(), "\n\t{:?}\n<-\n\t{:?}", to, rhs);

        macro_rules! fail {
            () => {{
                return Err(Error::AssignFailed {
                    span,
                    left: to.clone(),
                    right: rhs.clone(),
                    cause: vec![],
                });
            }};
        }

        macro_rules! handle_enum_in_rhs {
            ($e:expr) => {{
                let e = $e;

                // Allow
                //      let e: E = E.a
                //
                // and
                //
                //      let e1: E = E.a
                //      let e2: E = e1
                match *to.normalize() {
                    Type::Enum(ref left_enum) => {
                        if left_enum.id.sym == *e.id.sym {
                            return Ok(());
                        }
                        fail!()
                    }
                    _ => {}
                }

                if !e.has_str && !e.has_num {
                    return self.assign_inner(
                        to,
                        &Type::Keyword(TsKeywordType {
                            span,
                            kind: TsKeywordTypeKind::TsNumberKeyword,
                        }),
                        span,
                    );
                }

                if !e.has_num {
                    return self.assign_inner(
                        to,
                        &Type::Keyword(TsKeywordType {
                            span,
                            kind: TsKeywordTypeKind::TsStringKeyword,
                        }),
                        span,
                    );
                }

                if !e.has_str {
                    return self.assign_inner(
                        to,
                        &Type::Keyword(TsKeywordType {
                            span,
                            kind: TsKeywordTypeKind::TsNumberKeyword,
                        }),
                        span,
                    );
                }

                return self.assign_inner(
                    to,
                    &Type::union(vec![
                        Type::Keyword(TsKeywordType {
                            span,
                            kind: TsKeywordTypeKind::TsNumberKeyword,
                        }),
                        Type::Keyword(TsKeywordType {
                            span,
                            kind: TsKeywordTypeKind::TsStringKeyword,
                        }),
                    ])
                    ,
                    span,
                );
            }};
        }

        {
            // Handle special cases.
            // Assigning boolean to Boolean is ok, but assigning Boolean to boolean is an
            // error.
            let special_cases = &[
                (TsKeywordTypeKind::TsBooleanKeyword, "Boolean"),
                (TsKeywordTypeKind::TsStringKeyword, "String"),
                (TsKeywordTypeKind::TsNumberKeyword, "Number"),
            ];

            for (kwd, interface) in special_cases {
                let rhs = rhs.clone().generalize_lit();
                match to.normalize() {
                    Type::Keyword(k) if k.kind == *kwd => match *rhs.normalize() {
                        Type::Interface(ref i) => {
                            if i.name.as_str() == *interface {
                                return Err(Error::AssignedWrapperToPrimitive { span });
                            }
                        }
                        _ => {}
                    },
                    Type::Interface(ref i) if i.name.as_str() == *interface => {
                        match *rhs.normalize() {
                            Type::Keyword(ref k) if k.kind == *kwd => return Ok(()),
                            _ => {}
                        }
                    }
                    _ => {}
                }
            }
        }

        match *to.normalize() {
            // let a: any = 'foo'
            Type::Keyword(TsKeywordType {
                kind: TsKeywordTypeKind::TsAnyKeyword,
                ..
            }) => return Ok(()),

            Type::Keyword(TsKeywordType {
                kind: TsKeywordTypeKind::TsUndefinedKeyword,
                ..
            }) => return Ok(()),

            // Anything is assignable to unknown
            Type::Keyword(TsKeywordType {
                kind: TsKeywordTypeKind::TsUnknownKeyword,
                ..
            }) => return Ok(()),

            // Everything is assignable to Object
            Type::Interface(ref i) if i.name.as_str() == "Object" => return Ok(()),

            Type::Module(..) => {
                return Err(Error::InvalidLValue { span: to.span() });
            }
            Type::Enum(ref e) => {
                match *rhs.normalize() {
                    Type::Lit(TsLitType {
                        lit: TsLit::Number(..),
                        ..
                    })
                    | Type::Keyword(TsKeywordType {
                        kind: TsKeywordTypeKind::TsNumberKeyword,
                        ..
                    }) => {
                        // validEnumAssignments.ts insists that this is valid.
                        return Ok(());
                    }
                    _ => {}
                }
            }
            Type::EnumVariant(ref e) => {
                return Err(Error::InvalidLValue { span: e.span });
            }

            Type::Intersection(ref i) => {
                let mut errors = Errors::default();

                for ty in &i.types {
                    match self.assign_inner(&ty, rhs, span) {
                        Ok(..) => {}
                        Err(err) => errors.push(err),
                    }
                }

                if errors.is_empty() {
                    return Ok(());
                }

                return Err(Error::Errors {
                    span,
                    errors: errors.into(),
                });
            }

            Type::Class(ref l) => match rhs.normalize() {
                Type::Interface(..) | Type::TypeLit(..) | Type::Lit(..) => fail!(),
                Type::ClassInstance(r) => return self.assign_class(span, l, &r.cls),
                _ => {}
            },

            _ => {}
        }

        match *rhs.normalize() {
            // When strict null check is disabled, we can assign null / undefined to many things.
            Type::Keyword(TsKeywordType {
                kind: TsKeywordTypeKind::TsUndefinedKeyword,
                ..
            })
            | Type::Keyword(TsKeywordType {
                kind: TsKeywordTypeKind::TsNullKeyword,
                ..
            }) => {
                // Deny assigning null to class. (not instance)

                match *to.normalize() {
                    Type::Class(..) | Type::Function(..) => fail!(),
                    _ => {}
                }

                if !self.rule.strict_null_checks {
                    return Ok(());
                }
            }
            Type::Union(Union {
                ref types, span, ..
            }) => {
                let errors = types
                    .iter()
                    .filter_map(|rhs| match self.assign_inner(to, rhs, span) {
                        Ok(()) => None,
                        Err(err) => Some(err),
                    })
                    .collect::<Vec<_>>();
                if errors.is_empty() {
                    return Ok(());
                }
                return Err(Error::UnionError { span, errors });
            }

            Type::Keyword(TsKeywordType {
                kind: TsKeywordTypeKind::TsAnyKeyword,
                ..
            }) => return Ok(()),

            // Handle unknown on rhs
            Type::Keyword(TsKeywordType {
                kind: TsKeywordTypeKind::TsUnknownKeyword,
                ..
            }) => {
                if to.is_kwd(TsKeywordTypeKind::TsAnyKeyword)
                    || to.is_kwd(TsKeywordTypeKind::TsUndefinedKeyword)
                {
                    return Ok(());
                }

                fail!();
            }

            Type::Param(TypeParam {
                ref name,
                ref constraint,
                ..
            }) => {
                //
                match to.normalize() {
                    Type::Param(TypeParam {
                        name: ref l_name, ..
                    }) => {
                        if name == l_name {
                            return Ok(());
                        }

                        {}
                    }

                    _ => {}
                }

                match *constraint {
                    Some(ref c) => {
                        return self.assign_inner(to, c, span);
                    }
                    None => match to.normalize() {
                        Type::TypeLit(TypeLit { ref members, .. }) if members.is_empty() => {
                            return Ok(())
                        }
                        _ => {}
                    },
                }

                fail!()
            }

            Type::Enum(ref e) => handle_enum_in_rhs!(e),

            Type::EnumVariant(EnumVariant { ref enum_name, .. }) => {
                if let Some(types) = self.find_type(enum_name) {
                    for ty in types {
                        if let Type::Enum(ref e) = ty {
                            handle_enum_in_rhs!(e);
                        }
                    }
                }

                fail!()
            }

            _ => {}
        }

        match *to.normalize() {
            Type::Param(TypeParam {
                constraint: Some(ref c),
                ..
            }) => {
                return self.assign_inner(c, rhs, span);
            }

            Type::Array(Array { ref elem_type, .. }) => match rhs {
                Type::Array(Array {
                    elem_type: ref rhs_elem_type,
                    ..
                }) => {
                    //
                    return self
                        .assign_inner(&elem_type, &rhs_elem_type, span)
                        .map_err(|cause| Error::AssignFailed {
                            span,
                            left: to.clone(),
                            right: rhs.clone(),
                            cause: vec![cause],
                        });
                }

                Type::Tuple(Tuple { ref types, .. }) => {
                    for ty in types {
                        self.assign_inner(elem_type, ty, span)?;
                    }
                    return Ok(());
                }
                _ => fail!(),
            },

            // let a: string | number = 'string';
            Type::Union(Union { ref types, .. }) => {
                let vs = types
                    .iter()
                    .map(|to| self.assign_inner(&to, rhs, span))
                    .collect::<Vec<_>>();
                if vs.iter().any(Result::is_ok) {
                    return Ok(());
                }
                return Err(Error::UnionError {
                    span,
                    errors: vs.into_iter().map(Result::unwrap_err).collect(),
                });
            }

            Type::Intersection(Intersection { ref types, .. }) => {
                let vs = types
                    .iter()
                    .map(|to| self.assign_inner(&to, rhs, span))
                    .collect::<Vec<_>>();

                // TODO: Multiple error
                for v in vs {
                    if let Err(error) = v {
                        return Err(Error::IntersectionError {
                            span,
                            error: box error,
                        });
                    }
                }

                return Ok(());
            }

            Type::Keyword(TsKeywordType {
                kind: TsKeywordTypeKind::TsObjectKeyword,
                ..
            }) => {
                // let a: object = {};
                match *rhs {
                    Type::Keyword(TsKeywordType {
                        kind: TsKeywordTypeKind::TsNumberKeyword,
                        ..
                    })
                    | Type::Keyword(TsKeywordType {
                        kind: TsKeywordTypeKind::TsStringKeyword,
                        ..
                    })
                    | Type::Function(..)
                    | Type::Constructor(..)
                    | Type::Enum(..)
                    | Type::Class(..)
                    | Type::TypeLit(..) => return Ok(()),

                    _ => {}
                }
            }

            // Handle same keyword type.
            Type::Keyword(TsKeywordType { kind, .. }) => {
                match *rhs {
                    Type::Keyword(TsKeywordType { kind: rhs_kind, .. }) => {
                        if rhs_kind == kind {
                            return Ok(());
                        }

                        if rhs_kind == TsKeywordTypeKind::TsUndefinedKeyword
                            && kind == TsKeywordTypeKind::TsVoidKeyword
                        {
                            return Ok(());
                        }

                        if kind == TsKeywordTypeKind::TsUndefinedKeyword
                            && rhs_kind == TsKeywordTypeKind::TsVoidKeyword
                        {
                            return Ok(());
                        }

                        fail!()
                    }

                    Type::Array(..) => fail!(),

                    _ => {}
                }

                match kind {
                    TsKeywordTypeKind::TsStringKeyword => match *rhs {
                        Type::Lit(TsLitType {
                            lit: TsLit::Str(..),
                            ..
                        }) => return Ok(()),
                        Type::Lit(..) => fail!(),
                        _ => {}
                    },

                    TsKeywordTypeKind::TsNumberKeyword => match *rhs {
                        Type::Lit(TsLitType {
                            lit: TsLit::Number(..),
                            ..
                        }) => return Ok(()),
                        Type::Lit(..) => fail!(),

                        Type::EnumVariant(ref v) => {
                            // Allow assigning enum with numeric values to
                            // number.
                            if let Some(types) = self.find_type(&v.enum_name) {
                                for ty in types {
                                    match *ty.normalize() {
                                        Type::Enum(ref e) => {
                                            let is_num = !e.has_str;
                                            if is_num {
                                                return Ok(());
                                            }
                                        }
                                        _ => {}
                                    }
                                }
                            }

                            fail!()
                        }
                        _ => {}
                    },

                    TsKeywordTypeKind::TsBooleanKeyword => match *rhs {
                        Type::Lit(TsLitType {
                            lit: TsLit::Bool(..),
                            ..
                        }) => return Ok(()),
                        Type::Lit(..) => fail!(),
                        _ => return Ok(()),
                    },

                    TsKeywordTypeKind::TsVoidKeyword | TsKeywordTypeKind::TsUndefinedKeyword => {
                        //

                        match *rhs.normalize() {
                            Type::Keyword(TsKeywordType {
                                kind: TsKeywordTypeKind::TsVoidKeyword,
                                ..
                            }) => return Ok(()),
                            Type::Lit(..)
                            | Type::Keyword(..)
                            | Type::TypeLit(..)
                            | Type::Class(..)
                            | Type::ClassInstance(..)
                            | Type::Interface(..)
                            | Type::Module(..)
                            | Type::EnumVariant(..) => fail!(),
                            Type::Function(..) => {
                                return Err(Error::CannotAssignToNonVariable { span: rhs.span() })
                            }
                            _ => {}
                        }
                    }

                    TsKeywordTypeKind::TsSymbolKeyword => {
                        //

                        match *rhs.normalize() {
                            Type::Keyword(TsKeywordType {
                                kind: TsKeywordTypeKind::TsSymbolKeyword,
                                ..
                            }) => return Ok(()),
                            _ => fail!(),
                        }
                    }

                    _ => {}
                }
            }

            Type::Enum(ref e) => {
                //
                match *rhs {
                    Type::EnumVariant(ref r) => {
                        if r.enum_name == e.id {
                            return Ok(());
                        }
                    }
                    _ => {}
                }

                return Err(Error::AssignFailed {
                    span,
                    left: Type::Enum(e.clone()),
                    right: rhs.clone(),
                    cause: vec![],
                });
            }

            Type::EnumVariant(ref l) => match *rhs {
                Type::EnumVariant(ref r) => {
                    if l.enum_name == r.enum_name && l.name == r.name {
                        return Ok(());
                    }

                    fail!()
                }
                _ => {
                    return Err(Error::InvalidLValue { span });
                }
            },

            Type::This(TsThisType { span }) => return Err(Error::CannotAssingToThis { span }),

            Type::Interface(Interface { ref body, .. }) => {
                self.assign_to_type_elements(span, to.span(), &body, rhs)?;

                // TODO: Handle extends

                return Ok(());
            }

            Type::TypeLit(TypeLit { ref members, .. }) => {
                self.assign_to_type_elements(span, to.span(), &members, rhs)?;

                return Ok(());
            }

            Type::Lit(TsLitType { ref lit, .. }) => match *rhs {
                Type::Lit(TsLitType { lit: ref r_lit, .. }) => {
                    if lit.eq_ignore_span(r_lit) {
                        return Ok(());
                    }

                    // Extra check to handle "has_escape"
                    match (lit, r_lit) {
                        (&TsLit::Str(ref l), &TsLit::Str(ref r)) if l.value == r.value => {
                            return Ok(())
                        }
                        _ => {}
                    }

                    fail!()
                }
                // TODO: allow
                // let a: true | false = bool
                _ => fail!(),
            },

            Type::Function(Function { ref ret_ty, .. }) => {
                // var fnr2: () => any = fnReturn2();
                match *rhs.normalize() {
                    Type::Function(Function {
                        ret_ty: ref r_ret_ty,
                        ..
                    }) => {
                        // TODO: Verify type parameters.
                        self.assign_inner(ret_ty, r_ret_ty, span)?;
                        // TODO: Verify parameter counts

                        return Ok(());
                    }

                    Type::Lit(..) => return Err(Error::CannotAssignToNonVariable { span }),
                    _ => fail!(),
                }
            }

            Type::Tuple(Tuple { ref types, .. }) => {
                //
                match *rhs.normalize() {
                    Type::Tuple(Tuple {
                        types: ref r_types, ..
                    }) => {
                        if types.len() < r_types.len() {
                            fail!();
                        }

                        for (l, r) in types.into_iter().zip(r_types) {
                            match self.assign_inner(l, r, span) {
                                // Great
                                Ok(()) => {}
                                Err(err) => {
                                    // I don't know why, but
                                    //
                                    //      var [a, b]: [number, any] = [undefined, undefined];
                                    //
                                    // is valid typescript.
                                    match *r.normalize() {
                                        Type::Keyword(TsKeywordType {
                                            kind: TsKeywordTypeKind::TsUndefinedKeyword,
                                            ..
                                        }) => {}
                                        _ => return Err(err),
                                    }
                                }
                            }
                        }

                        return Ok(());
                    }
                    _ => {}
                }
            }

            //Type::Simple(ref s) => match **s {
            //    TsType::TsTypePredicate(..) => match *rhs.normalize() {
            //        Type::Keyword(TsKeywordType {
            //            kind: TsKeywordTypeKind::TsBooleanKeyword,
            //            ..
            //        })
            //        | Type::Lit(TsLitType {
            //            lit: TsLit::Bool(..),
            //            ..
            //        }) => return Ok(()),
            //        _ => {}
            //    },
            //
            //    _ => {}
            //},

            // TODO: Check type arguments
            Type::ClassInstance(ClassInstance { cls: ref l_cls, .. }) => match *rhs.normalize() {
                Type::Keyword(..) | Type::TypeLit(..) | Type::Lit(..) => fail!(),

                Type::ClassInstance(ClassInstance { ref cls, .. }) => {
                    return self.assign_class(span, l_cls, cls)
                }
                _ => {}
            },

            Type::Constructor(ref lc) => match *rhs.normalize() {
                Type::Lit(..)
                | Type::Class(Class {
                    is_abstract: true, ..
                }) => fail!(),
                _ => {}
            },

            _ => {}
        }

        // This is slow (at the time of writing)
        if to.type_eq(&rhs) {
            return Ok(());
        }

        // TODO: Implement full type checker
        //  unimplemented!("assign: \nLeft: {:?}\nRight: {:?}", to, rhs)
        Ok(())
    }

    fn assign_class(&self, span: Span, l: &Class, r: &Class) -> ValidationResult<()> {
        debug_assert!(!span.is_dummy());

        if l.eq_ignore_span(r) {
            return Ok(());
        }

        let mut parent = &r.super_class;

        // class Child extends Parent
        // let c: Child;
        // let p: Parent;
        // `p = c` is valid
        while let Some(ref p) = parent {
            match p.normalize() {
                Type::Class(ref p_cls) => {
                    if l.eq_ignore_span(p_cls) {
                        return Ok(());
                    }

                    parent = &p_cls.super_class;
                }
                _ => Err(vec![])?,
            }
        }

        Err(vec![])?
    }

    /// This method is called when lhs of assignment is interface or type
    /// literal.
    ///
    /// ```js
    /// interface A {}
    /// let a: A = foo;
    /// let b: { key: string } = foo;
    /// ```
    fn assign_to_type_elements(
        &self,
        span: Span,
        lhs_span: Span,
        lhs: &[TypeElement],
        rhs: &Type,
    ) -> ValidationResult<()> {
        debug_assert!(!span.is_dummy());

        let mut errors = Errors::default();
        let mut missing_fields = vec![];

        let numeric_keyed_ty: Option<Option<&Type>> = lhs
            .iter()
            .filter_map(|e| match e {
                TypeElement::Index(ref i)
                    if i.params.len() == 1
                        && i.params[0].ty.is_kwd(TsKeywordTypeKind::TsNumberKeyword) =>
                {
                    Some(i.type_ann.as_ref())
                }

                _ => None,
            })
            .next();

        if let Some(numeric_keyed_ty) = numeric_keyed_ty {
            let any = Type::any(span);
            let numeric_keyed_ty = numeric_keyed_ty.unwrap_or(&any);

            match *rhs.normalize() {
                Type::Array(Array { ref elem_type, .. }) => {
                    return self.assign_inner(numeric_keyed_ty, elem_type, span)
                }

                Type::Tuple(Tuple { ref types, .. }) => {
                    let mut errors = Errors::default();
                    for ty in types {
                        self.assign_inner(numeric_keyed_ty, ty, ty.span())
                            .store(&mut errors);
                    }
                    return if errors.is_empty() {
                        Ok(())
                    } else {
                        Err(Error::Errors {
                            span,
                            errors: errors.into(),
                        })
                    };
                }

                _ => {}
            }
        }

        {
            let mut unhandled_rhs = vec![];

            macro_rules! handle_type_elements {
                ($rhs:expr) => {{
                    for r in $rhs {
                        unhandled_rhs.push(r.span());
                    }

                    for (i, m) in lhs.into_iter().enumerate() {
                        let res = self.assign_type_elements_to_type_element(
                            span,
                            &mut missing_fields,
                            m,
                            $rhs,
                        );

                        let success = match res {
                            Ok(()) => true,
                            Err(Error::Errors { ref errors, .. }) if errors.is_empty() => true,
                            Err(err) => {
                                errors.push(err);
                                false
                            }
                        };
                        if success {
                            unhandled_rhs
                                .remove_item(&$rhs[i].span())
                                .expect("it should be removable");
                        }
                    }
                }};
            }

            match *rhs.normalize() {
                Type::TypeLit(TypeLit {
                    members: ref rhs_members,
                    ..
                }) => {
                    handle_type_elements!(&*rhs_members);
                }

                Type::Interface(Interface { ref body, .. }) => {
                    handle_type_elements!(&*body);
                    // TODO: Check parent interface
                }

                _ => {}
            }

            if !errors.is_empty() {
                return Err(errors)?;
            }

            if !unhandled_rhs.is_empty() {
                // The code below is invalid as c is not defined in type.
                //
                //      var c { [n: number]: { a: string; b: number; }; } = [{ a:
                // '', b: 0, c: '' }];

                return Err(Error::Errors {
                    span,
                    errors: unhandled_rhs
                        .into_iter()
                        .map(|span| Error::UnknownPropertyInObjectLiteralAssignment { span })
                        .collect(),
                });
            }
        }

        'l: for m in lhs {
            // Handle `toString()`
            match m {
                TypeElement::Method(ref m) => {
                    //
                    match *m.key {
                        Expr::Ident(ref i) if i.sym == js_word!("toString") => continue,
                        _ => {}
                    }
                }
                _ => {}
            }

            // Handle optional
            match m {
                TypeElement::Method(ref m) if m.optional => continue,
                TypeElement::Property(ref m) if m.optional => continue,
                _ => {}
            }

            match *rhs.normalize() {
                // Check class itself
                Type::Class(Class { ref body, .. }) => {
                    match m {
                        TypeElement::Call(_) => {
                            unimplemented!("assign: interface {{ () => ret; }} = class Foo {{}}")
                        }
                        TypeElement::Constructor(_) => {
                            // TODO: Check # of parameters
                            for rm in body {
                                match rm {
                                    ClassMember::Constructor(..) => continue 'l,
                                    _ => {}
                                }
                            }

                            errors.push(Error::ConstructorRequired {
                                span,
                                lhs: lhs_span,
                                rhs: rhs.span(),
                            });
                        }
                        TypeElement::Property(p) => {
                            //

                            for rm in body {
                                match rm {
                                    ClassMember::Constructor(..) => continue 'l,
                                    _ => {}
                                }
                            }
                        }
                        TypeElement::Method(_) => unimplemented!(
                            "assign: interface {{ method() => ret; }} = class Foo {{}}"
                        ),
                        TypeElement::Index(_) => unimplemented!(
                            "assign: interface {{ [key: string]: Type; }} = class Foo {{}}"
                        ),
                    }

                    // TODO: missing fields
                }

                // Check class members
                Type::ClassInstance(ClassInstance {
                    cls: Class { ref body, .. },
                    ..
                }) => {
                    match m {
                        TypeElement::Call(_) => {
                            unimplemented!("assign: interface {{ () => ret; }} = new Foo()")
                        }
                        TypeElement::Constructor(_) => {
                            unimplemented!("assign: interface {{ new () => ret; }} = new Foo()")
                        }
                        TypeElement::Property(ref lp) => {
                            for rm in body {
                                match rm {
                                    ClassMember::Property(ref rp) => {
                                        match rp.accessibility {
                                            Some(Accessibility::Private)
                                            | Some(Accessibility::Protected) => {
                                                errors.push(Error::AccessibilityDiffers { span });
                                            }
                                            _ => {}
                                        }

                                        if is_key_eq(&lp.key, &rp.key) {
                                            continue 'l;
                                        }
                                    }
                                    _ => {}
                                }
                            }

                            unimplemented!("assign: interface {{ prop: string; }} = new Foo()")
                        }
                        TypeElement::Method(_) => {
                            unimplemented!("assign: interface {{ method() => ret; }} = new Foo()")
                        }
                        TypeElement::Index(_) => unimplemented!(
                            "assign: interface {{ [key: string]: Type; }} = new Foo()"
                        ),
                    }
                    // TOOD: missing fields
                }

                Type::Tuple(..)
                | Type::Array(..)
                | Type::Lit(..)
                | Type::Keyword(TsKeywordType {
                    kind: TsKeywordTypeKind::TsUndefinedKeyword,
                    ..
                })
                | Type::Keyword(TsKeywordType {
                    kind: TsKeywordTypeKind::TsVoidKeyword,
                    ..
                }) => return Err(vec![])?,

                _ => {}
            }
        }

        if !missing_fields.is_empty() {
            errors.push(Error::MissingFields {
                span,
                fields: missing_fields,
            });
        }

        if !errors.is_empty() {
            return Err(Error::Errors {
                span,
                errors: errors.into(),
            });
        }

        Ok(())
    }

    /// This method assigns each property to corresponding property.
    fn assign_type_elements_to_type_element(
        &self,
        span: Span,
        missing_fields: &mut Vec<TypeElement>,
        m: &TypeElement,
        rhs_members: &[TypeElement],
    ) -> ValidationResult<()> {
        // We need this to show error if not all of rhs_member is matched

        if let Some(l_key) = m.key() {
            for rm in rhs_members {
                if let Some(r_key) = rm.key() {
                    if l_key.eq_ignore_span(r_key) {
                        match m {
                            TypeElement::Property(ref el) => match rm {
                                TypeElement::Property(ref r_el) => {
                                    self.assign_inner(
                                        el.type_ann.as_ref().unwrap_or(&Type::any(span)),
                                        r_el.type_ann.as_ref().unwrap_or(&Type::any(span)),
                                        span,
                                    )?;
                                    return Ok(());
                                }
                                _ => {}
                            },

                            // `foo(a: string) is assignable to foo(a: any)`
                            TypeElement::Method(ref lm) => match rm {
                                TypeElement::Method(ref rm) => {
                                    //
                                    if count_required_params(&lm.params)
                                        > count_required_params(&rm.params)
                                    {
                                        unimplemented!(
                                            "assignment: method property in type literal"
                                        )
                                    }

                                    for (i, r) in rm.params.iter().enumerate() {
                                        if let Some(ref l) = lm.params.get(i) {
                                            let l_ty = &l.ty;
                                            let r_ty = &r.ty;

                                            self.assign_inner(l_ty, r_ty, span)?;
                                        }
                                    }
                                }
                                _ => {}
                            },
                            _ => {}
                        }
                    }
                }
            }

            // No property with `key` found.
            missing_fields.push(m.clone());
        } else {
            match m {
                // TODO: Check type of the index.
                TypeElement::Index(..) => return Ok(()),
                TypeElement::Call(..) => {
                    //
                    for rm in rhs_members {
                        match rm {
                            // TODO: Check type of parameters
                            // TODO: Check return type
                            TypeElement::Call(..) => return Ok(()),
                            _ => {}
                        }
                    }

                    missing_fields.push(m.clone());
                }
                _ => unreachable!(),
            }
        }

        Err(vec![])?
    }
}

/// Returns true if l and r are lieteral and equal to each other.
fn is_key_eq(l: &Expr, r: &Expr) -> bool {
    (match (l, r) {
        (&Expr::Ident(..), &Expr::Ident(..)) => true,
        (&Expr::Member(..), &Expr::Member(..)) => true,
        _ => false,
    }) && l.eq_ignore_span(r)
}

fn count_required_params(v: &[FnParam]) -> usize {
    v.iter().filter(|v| v.required).count()
}

//fn type_of_ts_fn_param<'a>(p: &TsFnParam) -> Type {
//    match p {
//        TsFnParam::Ident(Ident { type_ann, .. })
//        | TsFnParam::Array(ArrayPat { type_ann, .. })
//        | TsFnParam::Object(ObjectPat { type_ann, .. })
//        | TsFnParam::Rest(RestPat { type_ann, .. }) => type_ann
//            .clone()
//            .map(|ty| Type::from(ty))
//            .unwrap_or(Type::any(p.span())),
//    }
//}
