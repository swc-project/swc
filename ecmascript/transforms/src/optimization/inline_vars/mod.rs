use self::{preventer::prevent, var::VarInfo};
use crate::{
    pass::Pass,
    scope::ScopeKind,
    util::{id, ident::IdentLike, undefined, DestructuringFinder, Id, StmtLike},
};
use either::Either;
use fxhash::FxHashMap;
use serde::Deserialize;
use std::{
    cell::{RefCell, RefMut},
    collections::{hash_map::Entry, VecDeque},
};
use swc_common::{
    fold::VisitWith, util::move_map::MoveMap, Fold, FoldWith, SyntaxContext, DUMMY_SP,
};
use swc_ecma_ast::*;

mod hoister;
mod preventer;
#[cfg(test)]
mod tests;
mod var;

macro_rules! check {
    ($i:expr) => {{
        if $i.scope.id != 0 {
            assert!(
                $i.scope.parent.is_some(),
                "Scope({}) does not have parent",
                $i.scope.id
            );
        }
    }};
}

/// Scope id generator.
#[derive(Debug, Clone, Default)]
struct Gen(usize);
impl Gen {
    #[inline]
    fn get(&mut self) -> usize {
        self.0 += 1;
        self.0
    }
}

/// Ported from [`InlineVariables`](https://github.com/google/closure-compiler/blob/master/src/com/google/javascript/jscomp/InlineVariables.java)
/// of the google closure compiler.
pub fn inline_vars(_: Config) -> impl 'static + Pass {
    Inline::root()
}

impl Inline<'static> {
    fn root() -> Self {
        Inline {
            scope: Scope {
                id: 0,
                parent: None,
                // This is important.
                kind: ScopeKind::Block,
                vars: Default::default(),
                children: Default::default(),
            },
            phase: Phase::Analysis,
            changed: false,
            top_level: true,
            id_gen: Default::default(),
        }
    }
}

#[derive(Debug, Default, Deserialize)]
pub struct Config {
    #[serde(default)]
    pub locals_only: bool,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum Phase {
    Analysis,
    /// Saving value of variables into the scope.
    Storage,
    Inlining,
}

/// Reason that we should inline a variable.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum Reason {
    SingleUse,
    Cheap,
}

#[derive(Debug)]
struct Scope<'a> {
    id: usize,
    parent: Option<&'a Scope<'a>>,
    kind: ScopeKind,
    /// Stored only if value is statically known.
    vars: RefCell<FxHashMap<Id, VarInfo>>,
    children: RefCell<VecDeque<Scope<'static>>>,
}

#[derive(Debug)]
struct Inline<'a> {
    phase: Phase,
    changed: bool,
    scope: Scope<'a>,
    top_level: bool,
    id_gen: Gen,
}

impl Inline<'_> {
    fn child<T, F>(&mut self, kind: ScopeKind, op: F) -> T
    where
        F: for<'any> FnOnce(&mut Inline<'any>) -> T,
    {
        check!(self);

        match self.phase {
            Phase::Analysis => {
                let id = self.id_gen.get();

                let (res, vars, children) = {
                    let mut c = Inline {
                        scope: Scope {
                            id,
                            parent: Some(&self.scope),
                            kind,
                            vars: Default::default(),
                            children: Default::default(),
                        },
                        phase: self.phase,
                        changed: false,
                        top_level: false,
                        id_gen: self.id_gen.clone(),
                    };

                    let res = op(&mut c);
                    (res, c.scope.vars, c.scope.children)
                };

                self.scope.children.borrow_mut().push_back(Scope {
                    id,
                    parent: None,
                    kind,
                    vars,
                    children,
                });

                res
            }

            Phase::Storage | Phase::Inlining => {
                let mut scope = self.scope.children.get_mut().pop_front().unwrap();
                //println!(
                //    "child(of {}): Scope({}): {:?}",
                //    self.scope.id,
                //    scope.id,
                //    *scope.vars.borrow()
                //);
                scope.parent = Some(&self.scope);

                assert_eq!(kind, scope.kind);

                let mut c = Inline {
                    scope,
                    phase: self.phase,
                    top_level: false,
                    changed: self.changed,
                    id_gen: self.id_gen.clone(),
                };

                let res = op(&mut c);

                self.changed |= c.changed;

                // Treat children as a ring. Note that we don't remove an empty block statement
                // to preserve scope order.
                self.scope.children.borrow_mut().push_back(Scope {
                    id: c.scope.id,
                    parent: None,
                    kind,
                    vars: c.scope.vars,
                    children: c.scope.children,
                });

                res
            }
        }
    }
}

impl Scope<'_> {
    fn drop_usage(&self, e: &Expr) {
        match e {
            Expr::Ident(i) => {
                if let Some(mut v) = self.find(i) {
                    println!("cnt--; {}: usage", i.sym);
                    v.usage -= 1;
                }
            }

            Expr::Assign(e) => {
                self.drop_assign(&e.left);
                self.drop_usage(&e.right);
            }

            _ => {}
        }
    }

    fn drop_assign(&self, p: &PatOrExpr) {
        match p {
            PatOrExpr::Pat(box p) => match p {
                Pat::Ident(i) => {
                    if let Some(mut v) = self.find(i) {
                        v.assign -= 1;
                    }
                }
                _ => {}
            },

            _ => {}
        }
    }

    fn is_root(&self) -> bool {
        self.parent.is_none()
    }

    fn root(&self) -> &Self {
        self.parent.map(|p| p.root()).unwrap_or(self)
    }

    /// Find a scope with kind == ScopeKind::Fn
    fn find_fn_scope(&self) -> Option<&Self> {
        match self.kind {
            ScopeKind::Fn => Some(self),
            _ => self.parent.and_then(|p| p.find_fn_scope()),
        }
    }

    fn scope_for<I>(&self, i: &I) -> Option<&Self>
    where
        I: IdentLike,
    {
        match self.vars.borrow().get(&i.to_id()) {
            Some(..) => Some(self),
            None => self.parent.and_then(|p| p.scope_for(i)),
        }
    }

    fn find<I>(&self, i: &I) -> Option<RefMut<VarInfo>>
    where
        I: IdentLike,
    {
        //println!("          scope.find:");

        if self.vars.borrow().get(&i.to_id()).is_none() {
            //println!("              none");

            let r = self.parent.and_then(|p| p.find(i))?;
            return match r.value() {
                Some(&Expr::This(..)) => None,
                _ => Some(r),
            };
        }

        //println!("              some");

        let r = RefMut::map(self.vars.borrow_mut(), |vars| {
            //
            let var_info = vars.get_mut(&i.to_id()).unwrap();

            var_info
        });

        Some(r)
    }

    fn take_var(&self, i: &Ident) -> Option<VarInfo> {
        let var = match self.vars.borrow_mut().entry(id(i)) {
            Entry::Occupied(o) => Some(o.remove()),
            Entry::Vacant(..) => self.parent.and_then(|p| p.take_var(i)),
        }?;

        println!("take_var({}): {:?}", i.sym, var);

        Some(var)
    }
}

impl Fold<UpdateExpr> for Inline<'_> {
    fn fold(&mut self, e: UpdateExpr) -> UpdateExpr {
        match *e.arg {
            Expr::Ident(ref i) => self.prevent_inline(i),

            _ => {}
        }

        let e = e.fold_children(self);

        e
    }
}

impl Fold<Function> for Inline<'_> {
    fn fold(&mut self, f: Function) -> Function {
        check!(self);

        let res = self.child(ScopeKind::Fn, |folder| {
            // Hoist vars
            match folder.phase {
                Phase::Analysis => {
                    let vars = hoister::find_vars(&f);

                    for i in vars {
                        folder.store(&i, &mut *undefined(DUMMY_SP), Some(VarDeclKind::Var));
                    }
                }
                _ => {}
            }

            // Handle function
            Function {
                params: f.params.fold_with(folder),
                body: match f.body {
                    Some(bs) => Some(bs.fold_children(folder)),
                    None => None,
                },
                ..f
            }
        });

        res
    }
}

impl Fold<BlockStmt> for Inline<'_> {
    fn fold(&mut self, s: BlockStmt) -> BlockStmt {
        check!(self);

        self.child(ScopeKind::Block, |c| s.fold_children(c))
    }
}

impl Fold<SwitchCase> for Inline<'_> {
    fn fold(&mut self, s: SwitchCase) -> SwitchCase {
        check!(self);

        self.child(ScopeKind::Block, |c| s.fold_children(c))
    }
}

/// Handle lhs of AssignExpr
impl Fold<PatOrExpr> for Inline<'_> {
    fn fold(&mut self, p: PatOrExpr) -> PatOrExpr {
        match p {
            PatOrExpr::Pat(p) => {
                let p = p.fold_with(self);

                match *p {
                    Pat::Ident(ref i) => match self.phase {
                        Phase::Analysis => {
                            if let Some(mut var) = self.scope.find(i) {
                                var.assign += 1;
                            }
                        }
                        Phase::Storage => {}
                        Phase::Inlining => {}
                    },
                    _ => {
                        self.required(&p);
                    }
                }

                return PatOrExpr::Pat(p);
            }
            _ => {}
        }

        p
    }
}

impl Fold<AssignExpr> for Inline<'_> {
    fn fold(&mut self, e: AssignExpr) -> AssignExpr {
        check!(self);

        let mut e = e.fold_children(self);

        match e.left {
            PatOrExpr::Pat(box Pat::Ident(ref i)) => match self.phase {
                Phase::Analysis | Phase::Storage => {
                    if e.op == op!("=") {
                        self.store(i, &mut e.right, None);
                    } else {
                        self.prevent_inline(i)
                    }
                }
                Phase::Inlining => {}
            },

            _ => {
                self.required(&e.left);
            }
        }

        e
    }
}

impl Fold<VarDecl> for Inline<'_> {
    fn fold(&mut self, v: VarDecl) -> VarDecl {
        check!(self);

        let id = self.scope.id;
        let kind = v.kind;
        let is_root = self.scope.is_root();
        let mut v = v.fold_children(self);

        match self.phase {
            Phase::Analysis | Phase::Storage => {
                for decl in &mut v.decls {
                    match decl.name {
                        Pat::Ident(ref i) => match decl.init {
                            Some(ref mut e) => {
                                self.store(i, e, Some(kind));
                            }
                            None => self.store(i, &mut *undefined(DUMMY_SP), Some(kind)),
                        },
                        _ => {}
                    }
                }
            }
            Phase::Inlining => {
                v.decls = v.decls.move_flat_map(|mut decl| {
                    match decl.init {
                        Some(box Expr::Invalid(..)) => return None,
                        _ => {}
                    }

                    if self.phase == Phase::Inlining && !is_root {
                        // If variable is used, we can't remove it.
                        let var = match decl.name {
                            Pat::Ident(ref i) => {
                                let scope = match self.scope.scope_for(i) {
                                    // We can't remove variables in top level
                                    Some(v) if v.is_root() => return Some(decl),
                                    Some(v) => v,
                                    None => return Some(decl),
                                };

                                let remove = scope
                                    .find(i)
                                    .as_ref()
                                    .map(|var| var.can_be_removed())
                                    .unwrap_or(false);
                                if remove {
                                    if let Some(ref e) = decl.init {
                                        self.changed = true;
                                        scope.drop_usage(&e);
                                    }
                                }

                                if remove {
                                    Either::Left(scope.take_var(i).unwrap())
                                } else if let Some(var) = scope.find(i) {
                                    // println!("Scope({}, {}): {}: {:?}", scope_id, scope.id,
                                    // i.sym, var);
                                    Either::Right(var)
                                } else {
                                    return Some(decl);
                                }
                            }
                            // Be conservative
                            _ => return Some(decl),
                        };

                        match var {
                            Either::Left(var) => {
                                if var.can_be_removed() {
                                    println!(
                                        "Scope({}): removing var {:?} as it's not used (including \
                                         {:?})",
                                        id, decl.name, var
                                    );
                                    return None;
                                }
                            }
                            Either::Right(var) => {
                                if var.can_be_removed() {
                                    println!(
                                        "Scope({}): removing var {:?} as it's not used ({:?})",
                                        id, decl.name, *var
                                    );
                                    return None;
                                }
                            }
                        }
                    }

                    Some(decl)
                });
            }
        }

        v
    }
}

impl Fold<IfStmt> for Inline<'_> {
    fn fold(&mut self, s: IfStmt) -> IfStmt {
        let s = s.fold_children(self);

        match self.phase {
            Phase::Analysis => {
                let mut ids = prevent(&s.cons);

                for i in ids {
                    if let Some(mut var) = self.scope.find(&i) {
                        var.prevent_inline();
                    }
                }
            }
            _ => {}
        }

        s
    }
}

impl Fold<ForOfStmt> for Inline<'_> {
    fn fold(&mut self, s: ForOfStmt) -> ForOfStmt {
        check!(self);

        let s = ForOfStmt {
            span: s.span,
            await_token: s.await_token,
            left: s.left,
            right: s.right.fold_with(self),
            body: s.body.fold_with(self),
        };

        if self.phase == Phase::Analysis {
            self.required(&s.left);
        }

        s
    }
}

impl Fold<ForInStmt> for Inline<'_> {
    fn fold(&mut self, s: ForInStmt) -> ForInStmt {
        check!(self);

        let s = ForInStmt {
            span: s.span,
            left: s.left,
            right: s.right.fold_with(self),
            body: s.body.fold_with(self),
        };

        if self.phase == Phase::Analysis {
            self.required(&s.left);
        }

        s
    }
}

impl Fold<Expr> for Inline<'_> {
    fn fold(&mut self, e: Expr) -> Expr {
        check!(self);

        let e = e.fold_children(self);

        match e {
            Expr::Ident(i) => {
                match self.phase {
                    Phase::Analysis => {
                        if let Some(mut var) = self.scope.find(&i) {
                            println!("cnt++; {}: usage", i.sym);
                            var.usage += 1;

                            let declared_in_outer_fn = var.scope_id() != self.scope.id
                                && Some(var.scope_id())
                                    != self.scope.find_fn_scope().map(|scope| scope.id);
                            if declared_in_outer_fn {
                                var.prevent_inline();
                            }
                        }
                    }

                    Phase::Storage => {}

                    Phase::Inlining => {
                        let e: Option<Expr> = if let Some(mut var) = self.scope.find(&i) {
                            if var.no_inline() {
                                return Expr::Ident(i);
                            }

                            if var.assign == 0 && var.usage == 1 {
                                println!("Taking value of {}", i.sym);
                                var.take_value()
                            } else if var.assign == 0 {
                                if let Some(e) = var.value() {
                                    Some(e.clone())
                                } else {
                                    None
                                }
                            } else {
                                None
                            }
                        } else {
                            None
                        };
                        if let Some(e) = e {
                            println!("Scope({}): inlined '{}'", self.scope.id, i.sym);

                            self.changed = true;
                            self.scope.drop_usage(&Expr::Ident(i));

                            // Inline again if required.
                            return e.fold_with(self);
                        }
                    }
                }

                return Expr::Ident(i);
            }
            _ => {}
        }

        e
    }
}

impl Inline<'_> {
    fn required<T: for<'any> VisitWith<DestructuringFinder<'any, Id>>>(&mut self, node: &T) {
        if self.phase != Phase::Analysis {
            return;
        }

        let mut found = vec![];
        let mut v = DestructuringFinder { found: &mut found };
        node.visit_with(&mut v);

        for id in found {
            let var = self.scope.find(&id);
            if let Some(mut var) = var {
                var.mark_as_needed()
            }
        }
    }

    fn should_store(&self, i: &Id, e: &Expr) -> Option<Reason> {
        //println!("  should store:");

        if self.phase == Phase::Analysis {
            return Some(Reason::Cheap);
        }

        if self.phase == Phase::Storage {
            if let Some(ref v) = self.scope.find(i) {
                //println!(
                //    "      Scope({}): found var: {}: {:?}",
                //    self.scope.id, i.0, v
                //);
                if v.no_inline() {
                    return None;
                }

                if v.assign == 0 && v.usage == 1 {
                    return Some(Reason::SingleUse);
                }
            }

            //println!("          not handled");
            return Some(Reason::Cheap);
        }

        match e {
            Expr::Lit(..) | Expr::Ident(..) | Expr::This(..) => return Some(Reason::Cheap),
            _ => {}
        }

        None
    }

    fn store<I>(&mut self, i: &I, e: &mut Expr, kind: Option<VarDeclKind>)
    where
        I: IdentLike,
    {
        assert_ne!(
            self.phase,
            Phase::Inlining,
            "store() should not be called while inlining"
        );

        let scope_id = self.scope.id;
        let i = i.to_id();

        //println!(
        //    "Scope({}): {:?}: {}: store {:?}",
        //    self.scope.id, self.phase, i.0, kind
        //);

        let reason = if let Some(reason) = self.should_store(&i, e) {
            //println!("  reason: {:?}", reason);
            reason
        } else {
            //println!("  no_inline");
            if let Some(mut info) = self.scope.find(&i) {
                info.prevent_inline()
            }
            return;
        };

        let value = if self.phase == Phase::Storage {
            let e = if reason == Reason::SingleUse {
                //                replace(e, Expr::Invalid(Invalid { span }))
                e.clone()
            } else {
                e.clone()
            };
            let mut changed = true;
            let mut e = e;

            while changed {
                changed = false;

                match e {
                    Expr::Ident(ref i) => {
                        if let Some(expr) = self.scope.find(i).and_then(|var| var.value().cloned())
                        {
                            println!("Storage: changed {:?} -> {:?}", e, expr);
                            // self.scope.drop_usage(&e);
                            changed = true;
                            e = expr;
                        }
                    }

                    _ => {}
                };
            }

            Some(e)
        } else {
            None
        };

        if self.phase == Phase::Storage {
            assert!(value.is_some());
        }

        let mut v = match kind {
            // Not hoisted
            Some(VarDeclKind::Let) | Some(VarDeclKind::Const) => self.scope.vars.borrow_mut(),

            // Hoisted
            Some(VarDeclKind::Var) => {
                if let Some(fn_scope) = self.scope.find_fn_scope() {
                    fn_scope.vars.borrow_mut()
                } else {
                    self.scope.root().vars.borrow_mut()
                }
            }

            None => {
                let scope = self
                    .scope
                    .scope_for(&i)
                    .unwrap_or_else(|| self.scope.root());

                scope.vars.borrow_mut()
            }
        };

        if self.phase == Phase::Storage {
            assert!(v.get(&i).is_some(), "{:?}", v);
            assert!(value.is_some());
        }

        let v = v.entry(i).or_insert_with(|| VarInfo::new(scope_id));
        if let Some(value) = value {
            v.set_value(value);
        }

        if kind.is_none() && self.phase == Phase::Analysis {
            v.assign += 1;
        }
    }

    fn prevent_inline<I>(&mut self, i: &I)
    where
        I: IdentLike,
    {
        if self.phase != Phase::Analysis {
            return;
        }

        if let Some(mut v) = self.scope.find(i) {
            v.prevent_inline()
        }
    }
}

/// Removes empty variable statement.
impl Fold<Stmt> for Inline<'_> {
    fn fold(&mut self, s: Stmt) -> Stmt {
        let s = s.fold_children(self);

        match s {
            Stmt::Decl(Decl::Var(ref v)) if v.decls.is_empty() => {
                return Stmt::Empty(EmptyStmt { span: v.span })
            }
            _ => {}
        }

        s
    }
}

impl<T: StmtLike> Fold<Vec<T>> for Inline<'_>
where
    T: FoldWith<Self>,
    Vec<T>: FoldWith<Self>,
{
    fn fold(&mut self, stmts: Vec<T>) -> Vec<T> {
        let top_level = self.top_level;
        self.top_level = false;

        let stmts = stmts.fold_children(self);

        println!(
            "---- ---- ({}) {:?} ---- ----\n{:?}",
            self.scope.id,
            self.phase,
            *self.scope.vars.borrow()
        );

        match self.phase {
            Phase::Analysis => {
                if top_level {
                    self.phase = Phase::Storage;
                    // Inline variables
                    let stmts = stmts.fold_with(self);

                    self.phase = Phase::Inlining;
                    // Inline variables
                    let mut stmts = stmts;
                    loop {
                        stmts = stmts.fold_with(self);

                        if !self.changed {
                            break;
                        }
                        self.changed = false;
                    }
                    stmts
                } else {
                    stmts
                }
            }
            Phase::Storage => {
                for (_i, _v) in self.scope.vars.borrow().iter() {
                    //                    debug_assert!(
                    //                        v.value().is_some() ||
                    // v.no_inline(),
                    // "Scope({}): {}: value should be stored. But got {:?}",
                    //                        self.scope.id,
                    //                        i,
                    //                        v
                    //                    );
                }

                stmts
            }
            Phase::Inlining => {
                stmts.move_flat_map(|stmt| {
                    // Remove unused variables

                    Some(match stmt.try_into_stmt() {
                        Ok(stmt) => T::from_stmt(match stmt {
                            Stmt::Empty(..) => return None,

                            _ => stmt,
                        }),
                        Err(item) => item,
                    })
                })
            }
        }
    }
}
