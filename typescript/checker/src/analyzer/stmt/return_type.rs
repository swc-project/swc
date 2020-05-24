use crate::{
    analyzer::{util::ResultExt, Analyzer},
    errors::Error,
    ty::Type,
    validator::{Validate, ValidateWith},
    ValidationResult,
};
use swc_common::{Visit, VisitMut, VisitMutWith, VisitWith};
use swc_ecma_ast::*;
use swc_ecma_utils::{ExprExt, Value::Known};

impl Analyzer<'_, '_> {
    pub(in crate::analyzer) fn visit_stmts_for_return(
        &mut self,
        stmts: &mut [Stmt],
    ) -> Result<Option<Type>, Error> {
        log::debug!("visit_stmts_for_return()");

        // let mut old_ret_tys = self.scope.return_types.take();

        let types = {
            // let order = self.reorder_stmts(&*stmts);
            // assert_eq!(order.len(), stmts.len());

            let mut v = ReturnTypeCollector {
                analyzer: &mut *self,
                types: Default::default(),
                in_conditional: false,
                forced_never: false,
            };

            // for idx in order {
            //     stmts[idx].visit_mut_with(&mut v);
            // }

            stmts.visit_mut_children(&mut v);

            v.types
        };

        log::debug!("visit_stmts_for_return: types.len() = {}", types.len());

        let mut buf = Vec::with_capacity(types.len());
        for ty in types {
            buf.extend(ty.store(&mut self.info.errors));
        }

        if buf.is_empty() {
            return Ok(None);
        }

        Ok(Some(Type::union(buf)))
    }
}

trait MyVisitor: VisitMut<Stmt> + Validate<Expr, Output = ValidationResult> {}
impl MyVisitor for Analyzer<'_, '_> {}

struct ReturnTypeCollector<'a, A>
where
    A: MyVisitor,
{
    pub analyzer: &'a mut A,
    pub types: Vec<Result<Type, Error>>,
    /// Are we in if or switch statement?
    pub in_conditional: bool,
    pub forced_never: bool,
}

impl<A> ReturnTypeCollector<'_, A>
where
    A: MyVisitor,
{
    fn is_always_true(&mut self, e: &mut Expr) -> bool {
        if let (_, Known(v)) = e.as_bool() {
            return v;
        }

        match self.analyzer.validate(e) {
            Ok(ty) => {
                if let Known(v) = ty.as_bool() {
                    return v;
                }
            }
            Err(err) => {
                self.types.push(Err(err));
                return false;
            }
        }

        false
    }
}

impl<A> VisitMut<Expr> for ReturnTypeCollector<'_, A>
where
    A: MyVisitor,
{
    fn visit_mut(&mut self, e: &mut Expr) {
        let ty: Result<_, Error> = try {
            let ty = e.validate_with(self.analyzer)?;
            match ty.normalize() {
                Type::Keyword(TsKeywordType {
                    kind: TsKeywordTypeKind::TsNeverKeyword,
                    ..
                }) => {
                    log::info!("found never type");
                    self.types.push(Ok(ty))
                }
                _ => {}
            }

            ()
        };

        match ty {
            Ok(()) => {}
            Err(err) => self.types.push(Err(err)),
        }
    }
}

impl<A> VisitMut<ReturnStmt> for ReturnTypeCollector<'_, A>
where
    A: MyVisitor,
{
    fn visit_mut(&mut self, s: &mut ReturnStmt) {
        if let Some(ty) = s.arg.validate_with(self.analyzer) {
            self.types.push(ty)
        }
    }
}

impl<A> VisitMut<Stmt> for ReturnTypeCollector<'_, A>
where
    A: MyVisitor,
{
    fn visit_mut(&mut self, s: &mut Stmt) {
        let old_in_conditional = self.in_conditional;
        self.in_conditional |= match s {
            Stmt::If(_) => true,
            Stmt::Switch(_) => true,
            _ => false,
        };

        s.visit_mut_children(self);

        // Of `s` is always executed and we enter infinite loop, return type should be
        // never
        if !self.in_conditional {
            log::trace!("Checking for infinite loop");
            let mut v = LoopBreakerFinder { found: false };
            s.visit_with(&mut v);
            let has_break = v.found;
            if !has_break {
                match s {
                    Stmt::While(s) => {
                        if self.is_always_true(&mut s.test) {
                            self.forced_never = true;
                        }
                    }
                    Stmt::DoWhile(s) => {
                        if self.is_always_true(&mut s.test) {
                            self.forced_never = true;
                        }
                    }
                    Stmt::For(s) => {
                        if let Some(test) = &mut s.test {
                            if self.is_always_true(test) {
                                self.forced_never = true;
                            }
                        } else {
                            self.forced_never = true;
                        }
                    }
                    _ => {}
                }
            }
        }

        self.in_conditional = old_in_conditional;
    }
}

macro_rules! noop {
    ($T:ty) => {
        impl<A> VisitMut<$T> for ReturnTypeCollector<'_, A>
        where
            A: MyVisitor,
        {
            #[inline]
            fn visit_mut(&mut self, _: &mut $T) {}
        }
    };
}

noop!(Function);
noop!(ArrowExpr);

macro_rules! simple {
    ($T:ty) => {
        impl<A> VisitMut<$T> for ReturnTypeCollector<'_, A>
        where
            A: MyVisitor,
        {
            fn visit_mut(&mut self, node: &mut $T) {
                // TODO: Prevent recursion of analyzer
                node.visit_mut_with(self.analyzer);
                node.visit_mut_children(self);
            }
        }
    };
}

simple!(BlockStmt);
simple!(LabeledStmt);
simple!(BreakStmt);
simple!(ContinueStmt);
simple!(IfStmt);
simple!(SwitchStmt);
simple!(ThrowStmt);
simple!(TryStmt);
simple!(WhileStmt);
simple!(DoWhileStmt);
simple!(ForStmt);
simple!(ForInStmt);
simple!(ForOfStmt);
simple!(Decl);
simple!(ExprStmt);

struct LoopBreakerFinder {
    found: bool,
}

impl Visit<BreakStmt> for LoopBreakerFinder {
    fn visit(&mut self, _: &BreakStmt) {
        self.found = true;
    }
}

impl Visit<ThrowStmt> for LoopBreakerFinder {
    fn visit(&mut self, _: &ThrowStmt) {
        self.found = true;
    }
}

impl Visit<ReturnStmt> for LoopBreakerFinder {
    fn visit(&mut self, _: &ReturnStmt) {
        self.found = true;
    }
}
