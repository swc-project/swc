use crate::{
    analyzer::{util::ResultExt, Analyzer, Ctx},
    errors::Error,
    ty::{Array, Type},
    validator::{Validate, ValidateWith},
    ValidationResult,
};
use swc_common::Spanned;
use swc_ecma_ast::*;
use swc_ecma_utils::{ExprExt, Value::Known};
use swc_ecma_visit::{Visit, VisitMut, VisitMutWith, VisitWith};

impl Analyzer<'_, '_> {
    pub(in crate::analyzer) fn visit_stmts_for_return(
        &mut self,
        stmts: &mut [Stmt],
    ) -> Result<Option<Box<Type>>, Error> {
        log::debug!("visit_stmts_for_return()");

        // let mut old_ret_tys = self.scope.return_types.take();

        let mut types = {
            let order = self.reorder_stmts(&*stmts);
            assert_eq!(order.len(), stmts.len());

            let ctx = Ctx {
                preserve_ref: true,
                ..self.ctx
            };
            self.with_ctx(ctx).with(|analyzer| {
                let mut v = ReturnTypeCollector {
                    analyzer,
                    types: Default::default(),
                    in_conditional: false,
                    forced_never: false,
                };

                for idx in order {
                    stmts[idx].visit_mut_with(&mut v);
                }

                //  Expand return types if no element references a type parameter

                v.types
            })
        };

        {
            let can_expand = types.iter().all(|ty| match ty {
                Ok(ty) => {
                    if should_preserve_ref(ty) {
                        return false;
                    }

                    true
                }
                _ => false,
            });

            if can_expand {
                types = types
                    .into_iter()
                    .map(|res| match res {
                        Ok(ty) => self.expand_fully(ty.span(), ty, true),
                        Err(e) => Err(e),
                    })
                    .collect();
            }
        }

        log::debug!("visit_stmts_for_return: types.len() = {}", types.len());

        let mut buf = Vec::with_capacity(types.len());
        for ty in types {
            let ty = ty.map(|ty| {
                //
                self.generalize_ret_ty(ty)
            });
            buf.extend(ty.store(&mut self.info.errors));
        }

        if buf.is_empty() {
            return Ok(None);
        }

        Ok(Some(Type::union(buf)))
    }
}

trait MyVisitor: Validate<Expr, Output = ValidationResult> {}
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

macro_rules! simple {
    ($name:ident, $T:ty) => {
        fn $name(&mut self, node: &mut $T) {
            // TODO: Prevent recursion of analyzer
            node.visit_mut_with(self.analyzer);
            node.visit_mut_children(self);
        }
    };
}

impl<A> VisitMut for ReturnTypeCollector<'_, A>
where
    A: MyVisitor,
{
    simple!(visit_mut_block_stmt, BlockStmt);
    simple!(visit_mut_labeled_stmt, LabeledStmt);
    simple!(visit_mut_break_stmt, BreakStmt);
    simple!(visit_mut_continue_stmt, ContinueStmt);
    simple!(visit_mut_if_stmt, IfStmt);
    simple!(visit_mut_switch_stmt, SwitchStmt);
    simple!(visit_mut_throw_stmt, ThrowStmt);
    simple!(visit_mut_try_stmt, TryStmt);
    simple!(visit_mut_while_stmt, WhileStmt);
    simple!(visit_mut_do_while_stmt, DoWhileStmt);
    simple!(visit_mut_for_stmt, ForStmt);
    simple!(visit_mut_for_in_stmt, ForInStmt);
    simple!(visit_mut_for_of_stmt, ForOfStmt);
    simple!(visit_mut_decl, Decl);
    simple!(visit_mut_expr_stmt, ExprStmt);

    fn visit_mut_expr(&mut self, e: &mut Expr) {
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

    fn visit_mut_return_stmt(&mut self, s: &mut ReturnStmt) {
        if let Some(ty) = s.arg.validate_with(self.analyzer) {
            self.types.push(ty)
        } else {
            // TODO: Add void
        }
    }

    fn visit_mut_stmt(&mut self, s: &mut Stmt) {
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

    /// no-op
    fn visit_mut_arrow_expr(&mut self, _: &mut ArrowExpr) {}

    /// no-op
    fn visit_mut_function(&mut self, _: &mut Function) {}
}

struct LoopBreakerFinder {
    found: bool,
}

impl Visit for LoopBreakerFinder {
    fn visit_break_stmt(&mut self, _: &BreakStmt) {
        self.found = true;
    }

    fn visit_throw_stmt(&mut self, _: &ThrowStmt) {
        self.found = true;
    }

    fn visit_return_stmt(&mut self, _: &ReturnStmt) {
        self.found = true;
    }
}

fn should_preserve_ref(ty: &Type) -> bool {
    match ty {
        Type::IndexedAccessType(..) => true,
        Type::Array(Array { elem_type, .. }) => should_preserve_ref(&elem_type),
        // TODO: More work
        _ => false,
    }
}
