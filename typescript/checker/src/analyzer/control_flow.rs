use super::{
    scope::{Scope, ScopeKind, VarInfo},
    type_facts::TypeFacts,
    Analyzer, Name,
};
use crate::{
    errors::Error,
    ty::{Intersection, Type, Union},
};
use fxhash::FxHashMap;
use std::{
    borrow::Cow,
    collections::hash_map::Entry,
    convert::TryFrom,
    iter, mem,
    ops::{AddAssign, BitOr, Not},
};
use swc_atoms::JsWord;
use swc_common::{Spanned, Visit, VisitWith};
use swc_ecma_ast::*;

#[derive(Debug, Default)]
struct Facts {
    true_facts: CondFacts,
    false_facts: CondFacts,
}

impl Not for Facts {
    type Output = Self;
    #[inline(always)]
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

/// Conditional facts
#[derive(Debug, Clone, Default)]
pub(super) struct CondFacts {
    pub facts: FxHashMap<Name, TypeFacts>,
    pub types: FxHashMap<Name, VarInfo>,
}

impl CondFacts {
    fn extend(&mut self, other: Self) {
        self.facts.extend(other.facts);
        self.types.extend(other.types);
    }

    fn or<T>(mut map: FxHashMap<Name, T>, map2: FxHashMap<Name, T>) -> FxHashMap<Name, T>
    where
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

trait Merge {
    fn or(&mut self, other: Self);
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

impl Merge for Type<'_> {
    fn or(&mut self, r: Self) {
        let l_span = self.span();

        let l = mem::replace(
            self,
            TsType::TsKeywordType(TsKeywordType {
                span: l_span,
                kind: TsKeywordTypeKind::TsNeverKeyword,
            })
            .into(),
        );

        let mut tys = vec![];
        for mut ty in iter::once(l).chain(iter::once(r)) {
            match ty {
                Type::Union(Union { ref mut types, .. }) => {
                    tys.append(types);
                }

                _ => tys.push(Cow::Owned(ty)),
            }
        }

        *self = match tys.len() {
            0 => unreachable!(),
            1 => tys.into_iter().next().unwrap().into_owned(),
            _ => Type::Union(Union {
                span: l_span,
                types: tys,
            }),
        };
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
    fn bitor(mut self, rhs: Self) -> Self {
        CondFacts {
            facts: CondFacts::or(self.facts, rhs.facts),
            types: CondFacts::or(self.types, rhs.types),
        }
    }
}

impl Analyzer<'_, '_> {
    #[inline]
    fn child(&self, kind: ScopeKind, facts: CondFacts) -> Analyzer {
        Analyzer::new(
            self.libs,
            self.rule,
            Scope::new(&self.scope, kind, facts),
            self.path.clone(),
            self.loader,
        )
    }

    pub(super) fn with_child<F>(&mut self, kind: ScopeKind, facts: CondFacts, op: F)
    where
        F: for<'a, 'b> FnOnce(&mut Analyzer<'a, 'b>),
    {
        let errors = {
            let mut child = self.child(kind, facts);

            op(&mut child);

            assert_eq!(
                child.info.exports,
                Default::default(),
                "Child node cannot export"
            );
            child.info.errors
        };

        self.info.errors.extend(errors);
    }
}

impl Analyzer<'_, '_> {
    pub(super) fn try_assign<'any>(&mut self, lhs: &PatOrExpr, ty: &'any Type<'any>) {
        match *lhs {
            PatOrExpr::Expr(ref expr) | PatOrExpr::Pat(box Pat::Expr(ref expr)) => match **expr {
                // TODO(kdy1): Validate
                Expr::Member(MemberExpr { .. }) => return,
                _ => unimplemented!(
                    "assign: {:?} = {:?}\nFile: {}",
                    expr,
                    ty,
                    self.path.display()
                ),
            },

            PatOrExpr::Pat(ref pat) => {
                // Update variable's type
                match **pat {
                    Pat::Ident(ref i) => {
                        if let Some(var_info) = self.scope.vars.get_mut(&i.sym) {
                            // Variable is declared.

                            let var_ty = if let Some(ref var_ty) = var_info.ty {
                                // let foo: string;
                                // let foo = 'value';

                                let errors = ty.assign_to(&var_ty);
                                if errors.is_none() {
                                    Some(ty.into_owned())
                                } else {
                                    self.info.errors.extend(errors);
                                    None
                                }
                            } else {
                                // let v = foo;
                                // v = bar;
                                None
                            };
                            if let Some(var_ty) = var_ty {
                                if var_info.ty.is_none() || !var_info.ty.as_ref().unwrap().is_any()
                                {
                                    var_info.ty = Some(var_ty);
                                }
                            }
                        } else {
                            let var_info = if let Some(var_info) = self.scope.search_parent(&i.sym)
                            {
                                VarInfo {
                                    ty: if var_info.ty.is_some()
                                        && var_info.ty.as_ref().unwrap().is_any()
                                    {
                                        Some(Type::any(var_info.ty.as_ref().unwrap().span()))
                                    } else {
                                        Some(ty.into_owned())
                                    },
                                    copied: true,
                                    ..var_info.clone()
                                }
                            } else {
                                if let Some(Type::Module(..)) = self.scope.find_type(&i.sym) {
                                    self.info.errors.push(Error::NotVariable {
                                        span: i.span,
                                        left: lhs.span(),
                                    });
                                }
                                // undefined symbol
                                self.info
                                    .errors
                                    .push(Error::UndefinedSymbol { span: i.span });
                                return;
                            };
                            // Variable is defined on parent scope.
                            //
                            // We copy varinfo with enhanced type.
                            self.scope.vars.insert(i.sym.clone(), var_info);
                        }
                    }

                    _ => unimplemented!("assignment with complex pattern"),
                }
            }
        }
    }

    fn add_true_false(&self, facts: &mut Facts, sym: &JsWord, ty: &Type) {
        macro_rules! base {
            () => {{
                match self.find_var(&sym) {
                    Some(v) => VarInfo {
                        copied: true,
                        ..v.clone()
                    },
                    None => {
                        unimplemented!("error reporting: add_true_false: undefined symbol {}", sym)
                    }
                }
            }};
        }

        facts.true_facts.types.insert(
            sym.into(),
            VarInfo {
                ty: Some(ty.clone().remove_falsy().into_owned()),
                ..base!()
            },
        );
        facts.false_facts.types.insert(
            sym.into(),
            VarInfo {
                ty: Some(ty.clone().remove_truthy().into_owned()),
                ..base!()
            },
        );
    }

    /// Returns (type facts when test is matched, type facts when test is not
    /// matched)
    fn detect_facts(&self, test: &Expr, facts: &mut Facts) -> Result<(), Error> {
        let span = test.span();

        match *test {
            // Useless
            Expr::Fn(..)
            | Expr::Arrow(..)
            | Expr::Lit(Lit::Bool(..))
            | Expr::Lit(Lit::Str(..))
            | Expr::Lit(Lit::Null(..))
            | Expr::Lit(Lit::Num(..))
            | Expr::MetaProp(..)
            | Expr::JSXFragment(..)
            | Expr::JSXNamespacedName(..)
            | Expr::JSXEmpty(..) => return Ok(()),

            // Object literal *may* have side effect.
            Expr::Object(..) => {}

            // Array literal *may* have side effect.
            Expr::Array(..) => {}

            Expr::Await(AwaitExpr { arg: ref expr, .. })
            | Expr::TsNonNull(TsNonNullExpr { ref expr, .. }) => {
                self.detect_facts(expr, facts)?;
            }

            Expr::Seq(SeqExpr { ref exprs, .. }) => {
                for expr in exprs {
                    self.detect_facts(expr, facts)?;
                }
            }

            Expr::Paren(ParenExpr { ref expr, .. }) => self.detect_facts(expr, facts)?,

            Expr::Ident(ref i) => {
                let ty = self.type_of(test)?;
                self.add_true_false(facts, &i.sym, ty);
            }

            Expr::Bin(BinExpr {
                op: op!("&&"),
                ref left,
                ref right,
                ..
            }) => {
                // order is important
                self.detect_facts(left, facts)?;
                self.detect_facts(right, facts)?;
            }

            Expr::Bin(BinExpr {
                op: op!("||"),
                ref left,
                ref right,
                ..
            }) => {
                let (mut l_facts, mut r_facts) = Default::default();
                self.detect_facts(&left, &mut l_facts)?;
                self.detect_facts(&right, &mut r_facts)?;

                *facts += l_facts | r_facts;

                return Ok(());
            }

            Expr::Bin(BinExpr {
                op,
                ref left,
                ref right,
                ..
            }) => {
                let l_ty = self.type_of(left)?;
                let r_ty = self.type_of(right)?;

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
                                }) => match r {
                                    Expr::Lit(Lit::Str(Str { ref value, .. })) => Some((
                                        Name::try_from(&**arg),
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
                                },
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

                        match c.take(|(l, l_ty), (r, r_ty)| match l_ty {
                            Type::Simple(ref l_ty) => match **l_ty {
                                TsType::TsKeywordType(TsKeywordType {
                                    kind: TsKeywordTypeKind::TsUnknownKeyword,
                                    ..
                                }) => {
                                    //
                                    Some((Name::try_from(l), r_ty))
                                }
                                _ => None,
                            },
                            _ => None,
                        }) {
                            Some((Ok(name), ty)) => {
                                let v = VarInfo {
                                    kind: VarDeclKind::Const,
                                    initialized: true,
                                    copied: true,
                                    ty: Some(ty.into_owned()),
                                };
                                if is_eq {
                                    facts.true_facts.types.insert(name, v);
                                } else {
                                    facts.false_facts.types.insert(name, v);
                                }
                                return Ok(());
                            }
                            _ => {}
                        }

                        return Ok(());
                    }

                    _ => {}
                }

                unimplemented!("detect_facts({:?})", test)
            }

            Expr::Unary(UnaryExpr {
                op: op!("!"),
                ref arg,
                ..
            }) => {
                let mut f = Default::default();
                self.detect_facts(&arg, &mut f)?;
                *facts += !f;
            }

            _ => unimplemented!("detect_facts({:?})", test),
        }

        Ok(())
    }
}

/// SImple utility to check (l, r) and (r, l) with same code.
#[derive(Debug, Clone, Copy)]
struct Comparator<T>
where
    T: Copy,
{
    left: T,
    right: T,
}

impl<T> Comparator<T>
where
    T: Copy,
{
    fn take<F, R>(&self, mut op: F) -> Option<R>
    where
        F: FnMut(T, T) -> Option<R>,
    {
        op(self.left, self.right).or_else(|| op(self.right, self.left))
    }
}

impl Visit<IfStmt> for Analyzer<'_, '_> {
    fn visit(&mut self, stmt: &IfStmt) {
        let mut facts = Default::default();
        match self.detect_facts(&stmt.test, &mut facts) {
            Ok(()) => (),
            Err(err) => {
                self.info.errors.push(err);
                return;
            }
        };
        let ends_with_ret = stmt.cons.ends_with_ret();
        self.with_child(ScopeKind::Flow, facts.true_facts, |child| {
            stmt.visit_children(child)
        });
        if ends_with_ret {
            self.scope.facts.extend(facts.false_facts);
        }
    }
}

impl Visit<SwitchStmt> for Analyzer<'_, '_> {
    fn visit(&mut self, stmt: &SwitchStmt) {
        let mut false_facts = CondFacts::default();
        let mut true_facts = CondFacts::default();
        // Declared at here as it's important to know if last one ends with return.
        let mut ends_with_ret = false;
        let len = stmt.cases.len();

        // Check cases *in order*
        for (i, case) in stmt.cases.iter().enumerate() {
            let last = i == len - 1;
            let mut facts = Default::default();

            ends_with_ret = case.cons.ends_with_ret();
            let span = case
                .test
                .as_ref()
                .map(|v| v.span())
                .unwrap_or_else(|| stmt.span());

            match case.test {
                Some(ref test) => {
                    match self.detect_facts(
                        &Expr::Bin(BinExpr {
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
                            return;
                        }
                    }
                }
                None => {}
            }

            true_facts = true_facts | facts.true_facts;
            self.with_child(ScopeKind::Flow, true_facts.clone(), |child| {
                case.cons.visit_with(child);
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
    }
}

pub(super) trait RemoveTypes<'a> {
    /// Removes falsy values from `self`.
    fn remove_falsy(self) -> Type<'a>;

    /// Removes truthy values from `self`.
    fn remove_truthy(self) -> Type<'a>;
}

impl<'a> RemoveTypes<'a> for Cow<'a, TsType> {
    fn remove_falsy(self) -> Type<'a> {
        match *self {
            TsType::TsKeywordType(TsKeywordType { kind, span }) => match kind {
                TsKeywordTypeKind::TsUndefinedKeyword | TsKeywordTypeKind::TsNullKeyword => {
                    return Type::never(span)
                }
                _ => {}
            },
            TsType::TsLitType(ty) => match ty.lit {
                TsLit::Bool(Bool { value: false, span }) => return Type::never(span),
                _ => return ty.into(),
            },
            _ => {}
        }

        Type::Simple(self)
    }

    fn remove_truthy(self) -> Type<'a> {
        match *self {
            TsType::TsLitType(ty) => match ty.lit {
                TsLit::Bool(Bool { value: true, span }) => return Type::never(span),
                _ => return TsType::TsLitType(ty).into(),
            },
            _ => {}
        }

        Type::Simple(self)
    }
}

impl<'a> RemoveTypes<'a> for Type<'a> {
    fn remove_falsy(self) -> Type<'a> {
        match self {
            Type::Simple(ty) => ty.remove_falsy(),
            Type::Union(u) => u.remove_falsy(),
            Type::Intersection(i) => i.remove_falsy(),
            _ => self,
        }
    }

    fn remove_truthy(self) -> Type<'a> {
        match self {
            Type::Simple(ty) => ty.remove_truthy(),
            Type::Union(u) => u.remove_truthy(),
            Type::Intersection(i) => i.remove_truthy(),
            _ => self,
        }
    }
}

impl<'a> RemoveTypes<'a> for Intersection<'a> {
    fn remove_falsy(self) -> Type<'a> {
        let types = self
            .types
            .into_iter()
            .map(|ty| ty.remove_falsy())
            .collect::<Vec<_>>();
        if types.iter().any(Type::is_never) {
            return Type::never(self.span);
        }

        Intersection {
            span: self.span,
            types,
        }
        .into()
    }

    fn remove_truthy(self) -> Type<'a> {
        let types = self
            .types
            .into_iter()
            .map(|ty| ty.remove_truthy())
            .collect::<Vec<_>>();
        if types.iter().any(|ty| ty.is_never()) {
            return Type::never(self.span);
        }

        Intersection {
            span: self.span,
            types,
        }
        .into()
    }
}

impl<'a> RemoveTypes<'a> for Union<'a> {
    fn remove_falsy(mut self) -> Type<'a> {
        let types = self
            .types
            .into_iter()
            .map(|ty| ty.remove_falsy())
            .filter(|ty| !ty.is_never())
            .collect();
        Union {
            span: self.span,
            types,
        }
        .into()
    }

    fn remove_truthy(mut self) -> Type<'a> {
        let types = self
            .types
            .into_iter()
            .map(|ty| ty.remove_truthy())
            .filter(|ty| !ty.is_never())
            .collect();
        Union {
            span: self.span,
            types,
        }
        .into()
    }
}

impl<'a, T> RemoveTypes<'a> for Box<T>
where
    T: RemoveTypes<'a>,
{
    fn remove_falsy(self) -> Type<'a> {
        (*self).remove_falsy()
    }

    fn remove_truthy(self) -> Type<'a> {
        (*self).remove_truthy()
    }
}

trait EndsWithRet {
    /// Returns true if the statement ends with return, break, continue;
    fn ends_with_ret(&self) -> bool;
}

impl EndsWithRet for Stmt {
    /// Returns true if the statement ends with return, break, continue;
    fn ends_with_ret(&self) -> bool {
        match *self {
            Stmt::Return(..) | Stmt::Break(..) | Stmt::Continue(..) => true,
            Stmt::Block(ref stmt) => stmt.ends_with_ret(),
            _ => false,
        }
    }
}

impl EndsWithRet for BlockStmt {
    /// Returns true if the statement ends with return, break, continue;
    fn ends_with_ret(&self) -> bool {
        self.stmts.ends_with_ret()
    }
}

impl<T> EndsWithRet for Vec<T>
where
    T: EndsWithRet,
{
    /// Returns true if the statement ends with return, break, continue;
    fn ends_with_ret(&self) -> bool {
        match self.last() {
            Some(ref stmt) => stmt.ends_with_ret(),
            _ => false,
        }
    }
}
