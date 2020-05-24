use super::{
    expr::TypeOfMode,
    scope::{ScopeKind, VarInfo},
    util::Comparator,
    Analyzer,
};
use crate::{
    analyzer::util::ResultExt,
    errors::Error,
    id::Id,
    name::Name,
    ty::{Tuple, Type, TypeElement, TypeLit},
    type_facts::TypeFacts,
    util::EndsWithRet,
    validator::{Validate, ValidateWith},
    ValidationResult,
};
use fxhash::FxHashMap;
use macros::validator;
use std::{
    collections::hash_map::Entry,
    convert::TryFrom,
    hash::Hash,
    iter::once,
    mem::replace,
    ops::{AddAssign, BitOr, Not},
};
use swc_common::{Span, Spanned, VisitMutWith};
use swc_ecma_ast::*;

/// Conditional facts
#[derive(Debug, Clone, Default)]
pub(crate) struct CondFacts {
    pub facts: FxHashMap<Name, TypeFacts>,
    pub vars: FxHashMap<Name, Type>,
    pub excludes: FxHashMap<Name, Vec<Type>>,
    pub types: FxHashMap<Id, Type>,
}

impl CondFacts {
    fn extend(&mut self, other: Self) {
        self.facts.extend(other.facts);
        self.vars.extend(other.vars);
        self.types.extend(other.types);
    }

    fn or<K, T>(mut map: FxHashMap<K, T>, map2: FxHashMap<K, T>) -> FxHashMap<K, T>
    where
        K: Eq + Hash,
        T: Merge,
    {
        for (k, v) in map2 {
            match map.entry(k) {
                Entry::Occupied(mut e) => {
                    e.get_mut().or(v);
                }
                Entry::Vacant(e) => {
                    e.insert(v);
                }
            }
        }

        map
    }
}

#[derive(Debug, Default)]
pub(super) struct Facts {
    true_facts: CondFacts,
    false_facts: CondFacts,
}

impl Not for Facts {
    type Output = Self;
    #[inline]
    fn not(self) -> Self {
        Facts {
            true_facts: self.false_facts,
            false_facts: self.true_facts,
        }
    }
}

impl AddAssign for Facts {
    fn add_assign(&mut self, rhs: Self) {
        self.true_facts += rhs.true_facts;
        self.false_facts += rhs.false_facts;
    }
}

impl AddAssign<Option<Self>> for Facts {
    fn add_assign(&mut self, rhs: Option<Self>) {
        match rhs {
            Some(rhs) => {
                *self += rhs;
            }
            None => {}
        }
    }
}

impl BitOr for Facts {
    type Output = Self;

    fn bitor(self, rhs: Self) -> Self {
        Facts {
            true_facts: self.true_facts | rhs.true_facts,
            false_facts: self.false_facts | rhs.false_facts,
        }
    }
}

trait Merge {
    fn or(&mut self, other: Self);
}

impl<T> Merge for Vec<T> {
    fn or(&mut self, other: Self) {
        self.extend(other)
    }
}

impl Merge for TypeFacts {
    fn or(&mut self, other: Self) {
        *self |= other
    }
}

impl Merge for VarInfo {
    fn or(&mut self, other: Self) {
        self.copied |= other.copied;
        self.initialized |= other.initialized;
        Merge::or(&mut self.ty, other.ty);
    }
}

impl Merge for Type {
    fn or(&mut self, r: Self) {
        let l_span = self.span();

        let l = replace(self, Type::never(l_span));

        *self = Type::union(once(l).chain(once(r)));
    }
}

impl<T> Merge for Option<T>
where
    T: Merge,
{
    fn or(&mut self, other: Self) {
        match *self {
            Some(ref mut v) => match other {
                Some(other) => v.or(other),
                None => {}
            },
            _ => *self = other,
        }
    }
}

impl AddAssign for CondFacts {
    fn add_assign(&mut self, rhs: Self) {
        self.types.extend(rhs.types);
        self.vars.extend(rhs.vars);
        self.excludes.extend(rhs.excludes);
    }
}

impl AddAssign<Option<Self>> for CondFacts {
    fn add_assign(&mut self, rhs: Option<Self>) {
        match rhs {
            Some(rhs) => {
                *self += rhs;
            }
            None => {}
        }
    }
}

impl BitOr for CondFacts {
    type Output = Self;
    fn bitor(self, rhs: Self) -> Self {
        CondFacts {
            facts: CondFacts::or(self.facts, rhs.facts),
            vars: CondFacts::or(self.vars, rhs.vars),
            types: CondFacts::or(self.types, rhs.types),
            excludes: CondFacts::or(self.excludes, rhs.excludes),
        }
    }
}

#[validator]
impl Validate<IfStmt> for Analyzer<'_, '_> {
    type Output = ValidationResult<()>;

    fn validate(&mut self, stmt: &mut IfStmt) -> Self::Output {
        let mut facts = Default::default();
        match self.detect_facts(&mut stmt.test, &mut facts) {
            Ok(()) => (),
            Err(err) => {
                self.info.errors.push(err);
                return Ok(());
            }
        };
        let ends_with_ret = stmt.cons.ends_with_ret();
        self.with_child(ScopeKind::Flow, facts.true_facts, |child| {
            stmt.cons.validate_with(child);
        });

        if let Some(ref mut alt) = stmt.alt {
            self.with_child(ScopeKind::Flow, facts.false_facts.clone(), |child| {
                alt.validate_with(child);
            });
        }

        if ends_with_ret {
            self.scope.facts.extend(facts.false_facts);
        }

        Ok(())
    }
}

impl Analyzer<'_, '_> {
    fn check_switch_discriminant(&mut self, s: &mut SwitchStmt) -> ValidationResult {
        let discriminant_ty = self.validate(&mut s.discriminant)?;
        for case in &mut s.cases {
            if let Some(ref mut test) = case.test {
                let case_ty = self.validate(test)?;
                self.assign(&case_ty, &discriminant_ty, test.span())?
            }
        }

        Ok(discriminant_ty)
    }
}

#[validator]
impl Validate<SwitchStmt> for Analyzer<'_, '_> {
    type Output = ValidationResult<()>;

    fn validate(&mut self, stmt: &mut SwitchStmt) -> Self::Output {
        self.record(stmt);

        let discriminant_ty = self
            .check_switch_discriminant(stmt)
            .store(&mut self.info.errors);

        let mut false_facts = CondFacts::default();
        let mut true_facts = CondFacts::default();
        // Declared at here as it's important to know if last one ends with return.
        let mut ends_with_ret = false;
        let len = stmt.cases.len();
        let stmt_span = stmt.span();

        let mut errored = false;
        // Check cases *in order*
        for (i, case) in stmt.cases.iter_mut().enumerate() {
            if errored {
                break;
            }

            let span = case
                .test
                .as_ref()
                .map(|v| v.span())
                .unwrap_or_else(|| stmt_span);

            let SwitchCase { cons, .. } = case;
            let last = i == len - 1;
            let mut facts = Default::default();

            ends_with_ret = cons.ends_with_ret();

            match case.test {
                Some(ref test) => {
                    match self.detect_facts(
                        &mut Expr::Bin(BinExpr {
                            op: op!("==="),
                            span,
                            left: stmt.discriminant.clone(),
                            right: test.clone(),
                        }),
                        &mut facts,
                    ) {
                        Ok(()) => {}
                        Err(err) => {
                            self.info.errors.push(err);
                            errored = true;
                            continue;
                        }
                    }
                }
                None => {}
            }

            true_facts = true_facts | facts.true_facts;
            self.with_child(ScopeKind::Flow, true_facts.clone(), |child| {
                cons.visit_mut_with(child);
            });
            false_facts += facts.false_facts;

            if ends_with_ret || last {
                true_facts = CondFacts::default();
                true_facts += false_facts.clone();
            }
        }

        if ends_with_ret {
            self.scope.facts.extend(false_facts);
        }

        Ok(())
    }
}

impl Analyzer<'_, '_> {
    pub(super) fn try_assign(&mut self, span: Span, lhs: &mut PatOrExpr, ty: &Type) {
        let res: Result<(), Error> = try {
            match *lhs {
                PatOrExpr::Expr(ref mut expr) | PatOrExpr::Pat(box Pat::Expr(ref mut expr)) => {
                    let lhs_ty = self.validate_expr(expr, TypeOfMode::LValue, None)?;
                    let lhs_ty = self.expand(span, lhs_ty)?;

                    self.assign(&lhs_ty, &ty, span)?;

                    match **expr {
                        // TODO: Validate
                        Expr::Member(MemberExpr { .. }) => return,
                        _ => unimplemented!("assign: {:?} = {:?}", expr, ty),
                    }
                }

                PatOrExpr::Pat(ref mut pat) => {
                    self.try_assign_pat(span, pat, ty)?;
                }
            }
        };

        match res {
            Ok(()) => {}
            Err(err) => self.info.errors.push(err),
        }
    }

    fn try_assign_pat(&mut self, span: Span, lhs: &mut Pat, ty: &Type) -> Result<(), Error> {
        // Update variable's type
        match *lhs {
            Pat::Ident(ref i) => {
                println!("Symbol: {}", i.sym);

                if let Some(ref var_info) = self.scope.get_var(&i.into()) {
                    if let Some(ref var_ty) = var_info.ty {
                        let var_ty = var_ty.clone();
                        // let foo: string;
                        // let foo = 'value';
                        let var_ty = self.expand_fully(span, var_ty, true)?;
                        self.assign(&var_ty, ty, i.span)?;
                        return Ok(());
                    }
                }

                {
                    if let Some(var_info) = self.scope.get_var_mut(&i.into()) {
                        let var_ty = ty;

                        if var_info.ty.is_none()
                            || (!var_info.ty.as_ref().unwrap().is_any()
                                && !var_info.ty.as_ref().unwrap().is_unknown())
                        {
                            //                            var_info.ty =
                            // Some(var_ty);
                        }
                        return Ok(());
                    } else {
                        let var_info = if let Some(var_info) = self.scope.search_parent(&i.into()) {
                            let ty = if var_info.ty.is_some()
                                && var_info.ty.as_ref().unwrap().is_any()
                            {
                                Some(Type::any(var_info.ty.as_ref().unwrap().span()))
                            } else if var_info.ty.is_some()
                                && var_info.ty.as_ref().unwrap().is_unknown()
                            {
                                // Type narrowing
                                Some(ty.clone())
                            } else {
                                return Ok(());
                            };

                            VarInfo {
                                ty,
                                copied: true,
                                ..var_info.clone()
                            }
                        } else {
                            if let Some(types) = self.find_type(&i.into()) {
                                for ty in types {
                                    match ty {
                                        Type::Module(..) => {
                                            return Err(Error::NotVariable {
                                                span: i.span,
                                                left: lhs.span(),
                                            });
                                        }
                                        _ => {}
                                    }
                                }
                            }

                            return if self.ctx.allow_ref_declaring
                                && self.scope.declaring.contains(&i.into())
                            {
                                Ok(())
                            } else {
                                // undefined symbol
                                Err(Error::UndefinedSymbol {
                                    sym: i.into(),
                                    span: i.span,
                                })
                            };
                        };

                        // Variable is defined on parent scope.
                        //
                        // We copy varinfo with enhanced type.
                        println!(
                            "({}) vars.insert({}, {:?})",
                            self.scope.depth(),
                            i.sym,
                            var_info
                        );
                        self.scope.insert_var(i.into(), var_info);

                        return Ok(());
                    }
                }
            }

            Pat::Array(ref mut arr) => {
                //
                for (i, elem) in arr.elems.iter_mut().enumerate() {
                    if let Some(elem) = elem.as_mut() {
                        match ty.normalize() {
                            ty if ty.is_any() => {
                                self.try_assign_pat(span, elem, ty)?;
                            }

                            Type::Tuple(Tuple { types, .. }) => {
                                if types.len() > i {
                                    self.try_assign_pat(span, elem, &types[i])?;
                                }
                            }

                            _ => unimplemented!(
                                "assignment with array pattern\nPat: {:?}\nType: {:?}",
                                lhs,
                                ty
                            ),
                        }
                    }
                }
                return Ok(());
            }

            Pat::Object(ref mut obj) => {
                //
                for prop in obj.props.iter_mut() {
                    match ty.normalize() {
                        ty if ty.is_any() => {
                            self.try_assign_pat(
                                span,
                                match prop {
                                    ObjectPatProp::KeyValue(kv) => &mut kv.value,
                                    ObjectPatProp::Assign(a) => {
                                        if a.key.type_ann.is_none() {
                                            a.key.type_ann = Some(TsTypeAnn {
                                                span,
                                                type_ann: box TsType::TsKeywordType(
                                                    TsKeywordType {
                                                        span,
                                                        kind: TsKeywordTypeKind::TsAnyKeyword,
                                                    },
                                                ),
                                            })
                                        }
                                        continue;
                                    }
                                    ObjectPatProp::Rest(r) => {
                                        if r.type_ann.is_none() {
                                            r.type_ann = Some(TsTypeAnn {
                                                span,
                                                type_ann: box TsType::TsKeywordType(
                                                    TsKeywordType {
                                                        span,
                                                        kind: TsKeywordTypeKind::TsAnyKeyword,
                                                    },
                                                ),
                                            })
                                        }
                                        continue;
                                    }
                                },
                                &Type::any(ty.span()),
                            )?;
                        }

                        Type::Ref(..) => {}

                        Type::TypeLit(TypeLit { span, ref members }) => {
                            // Iterate over members, and assign if key matches.
                            for member in members {
                                match member {
                                    TypeElement::Call(_) => unimplemented!(),
                                    TypeElement::Constructor(_) => unimplemented!(),
                                    TypeElement::Property(p) => match prop {
                                        ObjectPatProp::KeyValue(prop) => {
                                            //
                                        }
                                        ObjectPatProp::Assign(_) => {}
                                        ObjectPatProp::Rest(_) => {}
                                    },
                                    TypeElement::Method(_) => unimplemented!(),
                                    TypeElement::Index(_) => unimplemented!(),
                                }
                            }
                        }
                        _ => unimplemented!(
                            "assignment with object pattern\nPat: {:?}\nType: {:?}",
                            lhs,
                            ty
                        ),
                    }
                }

                return Ok(());
            }

            _ => {}
        }

        unimplemented!(
            "assignment with complex pattern\nPat: {:?}\nType: {:?}",
            lhs,
            ty
        )
    }

    fn add_true_false(&mut self, facts: &mut Facts, sym: &Id, ty: &Type) {
        facts.insert_var(sym, ty.clone(), false);
    }

    /// Returns (type facts when test is matched, type facts when test is not
    /// matched)
    fn detect_facts(&mut self, test: &mut Expr, facts: &mut Facts) -> ValidationResult<()> {
        match *test {
            // Useless
            Expr::Fn(..)
            | Expr::Arrow(..)
            | Expr::Lit(Lit::Bool(..))
            | Expr::Lit(Lit::Str(..))
            | Expr::Lit(Lit::Null(..))
            | Expr::Lit(Lit::Num(..))
            | Expr::Lit(Lit::Regex(..))
            | Expr::MetaProp(..)
            | Expr::JSXFragment(..)
            | Expr::JSXNamespacedName(..)
            | Expr::JSXEmpty(..) => return Ok(()),

            Expr::Call(..) => {
                let ty = self.validate(test)?;
                //match *ty.normalize() {
                //    Type::Simple(ref sty) => match **sty {
                //        TsType::TsTypePredicate(ref pred) => {
                //            //
                //            let name = Name::from(&pred.param_name);
                //            let ty = Type::from(pred.type_ann.clone());
                //            facts.insert_var(name.clone(), ty.clone(), false);
                //        }
                //        _ => {}
                //    },
                //    _ => {}
                //}

                return Ok(());
            }

            // Object literal *may* have side effect.
            Expr::Object(..) => {}

            // Array literal *may* have side effect.
            Expr::Array(..) => {}

            Expr::Await(AwaitExpr {
                arg: ref mut expr, ..
            })
            | Expr::TsNonNull(TsNonNullExpr { ref mut expr, .. }) => {
                self.detect_facts(expr, facts)?;
            }

            Expr::Seq(SeqExpr { ref mut exprs, .. }) => {
                for expr in exprs {
                    self.detect_facts(expr, facts)?;
                }
            }

            Expr::Paren(ParenExpr { ref mut expr, .. }) => self.detect_facts(expr, facts)?,

            Expr::Ident(ref i) => {
                let sym = i.into();
                let ty = self.validate(test)?;
                self.add_true_false(facts, &sym, &ty);
            }

            Expr::Bin(BinExpr {
                op: op!("&&"),
                ref mut left,
                ref mut right,
                ..
            }) => {
                // order is important
                self.detect_facts(left, facts)?;
                self.detect_facts(right, facts)?;
            }

            Expr::Bin(BinExpr {
                op: op!("||"),
                ref mut left,
                ref mut right,
                ..
            }) => {
                let (mut l_facts, mut r_facts) = Default::default();
                self.detect_facts(left, &mut l_facts)?;
                self.detect_facts(right, &mut r_facts)?;

                *facts += l_facts | r_facts;

                return Ok(());
            }

            Expr::Bin(BinExpr {
                op,
                ref mut left,
                ref mut right,
                ..
            }) => {
                let l_ty = self.validate(left)?;
                let r_ty = self.validate(right)?;

                match op {
                    op!("===") | op!("!==") | op!("==") | op!("!=") => {
                        let is_eq = op == op!("===") || op == op!("==");

                        let c = Comparator {
                            left: &**left,
                            right: &**right,
                        };

                        // Check typeof a === 'string'
                        {
                            match c.take(|l, r| match l {
                                Expr::Unary(UnaryExpr {
                                    op: op!("typeof"),
                                    ref arg,
                                    ..
                                }) => {
                                    //
                                    let name = Name::try_from(&**arg);
                                    log::info!("cond_facts: typeof {:?}", name);
                                    match r {
                                        Expr::Lit(Lit::Str(Str { ref value, .. })) => Some((
                                            name,
                                            if is_eq {
                                                (
                                                    TypeFacts::typeof_eq(&*value),
                                                    TypeFacts::typeof_neq(&*value),
                                                )
                                            } else {
                                                (
                                                    TypeFacts::typeof_neq(&*value),
                                                    TypeFacts::typeof_eq(&*value),
                                                )
                                            },
                                        )),
                                        _ => None,
                                    }
                                }
                                _ => None,
                            }) {
                                Some((Ok(name), (Some(t), Some(f)))) => {
                                    // Add type facts

                                    facts.true_facts.facts.insert(name.clone(), t);
                                    facts.false_facts.facts.insert(name.clone(), f);
                                    return Ok(());
                                }
                                _ => {}
                            }
                        }

                        // Try narrowing type
                        let c = Comparator {
                            left: (&**left, &l_ty),
                            right: (&**right, &r_ty),
                        };

                        match c.take(|(l, l_ty), (_, r_ty)| match *l_ty {
                            Type::Keyword(TsKeywordType {
                                kind: TsKeywordTypeKind::TsUnknownKeyword,
                                ..
                            }) => {
                                //
                                Some((Name::try_from(l), r_ty))
                            }
                            _ => None,
                        }) {
                            Some((Ok(name), ty)) => {
                                if is_eq {
                                    facts.insert_var(name.clone(), ty.clone(), false);
                                } else {
                                    facts.insert_var(name.clone(), ty.clone(), true);
                                }
                                return Ok(());
                            }
                            _ => {}
                        }

                        return Ok(());
                    }

                    op!("instanceof") => {
                        match **left {
                            Expr::Ident(ref i) => {
                                //

                                facts.true_facts.vars.insert(Name::from(i), r_ty);

                                return Ok(());
                            }

                            _ => {}
                        }
                    }

                    _ => {}
                }

                unimplemented!("detect_facts({:?})", test)
            }

            Expr::Unary(UnaryExpr {
                op: op!("!"),
                ref mut arg,
                ..
            }) => {
                let mut f = Default::default();
                self.detect_facts(arg, &mut f)?;
                *facts += !f;
            }

            _ => unimplemented!("detect_facts({:?})", test),
        }

        Ok(())
    }
}

#[validator]
impl Validate<CondExpr> for Analyzer<'_, '_> {
    type Output = ValidationResult;

    fn validate(&mut self, mut e: &mut CondExpr) -> Self::Output {
        self.record(e);

        let CondExpr {
            span,
            ref mut test,
            ref mut alt,
            ref mut cons,
            ..
        } = *e;

        let mut facts = Default::default();
        self.detect_facts(test, &mut facts)?;

        self.validate(test)?;
        let cons = self.with_child(ScopeKind::Flow, facts.true_facts, |child| {
            child.validate(cons)
        })?;
        let alt = self.with_child(ScopeKind::Flow, facts.false_facts, |child| {
            child.validate(alt)
        })?;

        match **test {
            Expr::Ident(ref i) => {
                // Check `declaring` before checking variables.
                if self.scope.declaring.contains(&i.into()) {
                    return if self.ctx.allow_ref_declaring {
                        Ok(Type::any(span))
                    } else {
                        Err(Error::ReferencedInInit { span })
                    };
                }
            }
            _ => {}
        }

        Ok(Type::union(vec![cons, alt]))
    }
}

impl Facts {
    fn insert_var<N: Into<Name>>(&mut self, name: N, ty: Type, negate: bool) {
        let name = name.into();

        if negate {
            self.false_facts.vars.insert(name.clone(), ty.clone());
            self.true_facts.excludes.entry(name).or_default().push(ty);
        } else {
            self.true_facts.vars.insert(name.clone(), ty.clone());
            self.false_facts.excludes.entry(name).or_default().push(ty);
        }
    }
}
