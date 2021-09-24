use self::ops::{Operations, Operator};
use crate::{
    native::is_native_word,
    scope::{IdentType, ScopeKind},
};
use fxhash::{FxHashMap, FxHashSet};
use smallvec::{smallvec, SmallVec};
use std::{cell::RefCell, collections::HashMap};
use swc_atoms::{js_word, JsWord};
use swc_common::{chain, util::take::Take, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_utils::{ident::IdentLike, Id};
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};

mod ops;
#[cfg(test)]
mod tests;

const LOG: bool = false;

#[derive(Debug, Clone, Default)]
pub struct Config {
    /// If true, the `hygiene` pass will preserve class names.
    pub keep_class_names: bool,
}

trait ToBoxedStr {
    fn to_boxed_str(&self) -> Box<str>;
}

impl ToBoxedStr for JsWord {
    fn to_boxed_str(&self) -> Box<str> {
        (**self).to_owned().into_boxed_str()
    }
}

struct Hygiene<'a> {
    config: Config,
    current: Scope<'a>,
    ident_type: IdentType,
    var_kind: Option<VarDeclKind>,
}

type Contexts = SmallVec<[SyntaxContext; 32]>;

impl<'a> Hygiene<'a> {
    /// Check `id` while exiting scope.
    fn enqueue_check(&mut self, id: Id) {
        if self.current.check_queue.contains(&id) {
            return;
        }
        self.current.check_queue.push(id);
    }

    fn add_decl(&mut self, ident: Ident) {
        let ctxt = ident.span.ctxt();

        if cfg!(debug_assertions) && LOG {
            eprintln!(
                "({}) Declaring {}{:?} ",
                self.current.depth(),
                ident.sym,
                ctxt
            );
        }

        let sym = self.current.change_symbol(ident.sym, ctxt);

        if cfg!(debug_assertions) && LOG {
            eprintln!("\tChanged symbol to {}{:?} ", sym, ctxt);
        }

        {
            let mut b = self.current.declared_symbols.borrow_mut();
            let e = b.entry(sym.to_boxed_str()).or_default();
            if !e.contains(&ctxt) {
                e.push(ctxt);
            }
        }

        {
            let mut need_work = false;
            let mut is_cur = true;
            let mut cur = Some(&self.current);

            while let Some(c) = cur {
                let mut used = c.used.borrow_mut();
                let e = used.entry(sym.to_boxed_str()).or_default();

                if !e.contains(&ctxt) {
                    e.push(ctxt);
                }

                if e.len() <= 1 {
                } else {
                    if is_cur {
                        need_work = true;
                    }
                }

                // Preserve first one.
                if e.len() == 1 && e[0] == ctxt {
                } else {
                    if is_cur {
                        need_work = true;
                    }
                }

                is_cur = false;
                cur = c.parent;
            }

            if !need_work {
                return;
            }
        }

        if cfg!(debug_assertions) && LOG {
            eprintln!("Renaming from decl");
        }
        self.rename(sym, ctxt);
    }

    fn add_used_ref(&mut self, ident: &Ident) {
        if cfg!(debug_assertions) && LOG {
            eprintln!(
                "({}) Ident ref: {}{:?}",
                self.current.depth(),
                ident.sym,
                ident.span.ctxt
            );
        }

        let ctxt = ident.span.ctxt();

        {
            let mut decl_cnt = 0;

            let mut cur = Some(&self.current);

            while let Some(c) = cur {
                let b = c.declared_symbols.borrow();

                if let Some(ctxts) = b.get(&*ident.sym) {
                    decl_cnt += ctxts.len();
                }

                cur = c.parent;
            }

            if decl_cnt >= 2 {
                self.enqueue_check(ident.to_id());
            }
        }

        {
            let mut need_work = false;

            let mut is_cur = true;
            let mut cur = Some(&self.current);

            while let Some(c) = cur {
                let mut used = c.used.borrow_mut();
                let e = used.entry(ident.sym.to_boxed_str()).or_default();

                if !e.contains(&ctxt) {
                    e.push(ctxt);
                }

                if e.len() <= 1 {
                } else {
                    if is_cur {
                        need_work = true;
                    }
                }

                if e.len() == 1 && e[0] == ctxt {
                } else {
                    if is_cur {
                        need_work = true;
                    }
                }

                is_cur = false;
                cur = c.parent;
            }

            if !need_work {
                return;
            }
        }

        if cfg!(debug_assertions) && LOG {
            eprintln!("Renaming from reference");
        }

        // We rename declaration instead of usage
        let conflicts = self.current.conflicts(ident.sym.clone(), ctxt);

        if cfg!(debug_assertions) && LOG && !conflicts.is_empty() {
            eprintln!("({}) Renaming from usage", self.current.depth());
        }

        for cx in conflicts {
            self.rename(ident.sym.clone(), cx)
        }
    }

    fn rename(&mut self, sym: JsWord, ctxt: SyntaxContext) {
        // symbol conflicts
        let renamed = {
            let mut i = 0;
            loop {
                i += 1;
                let sym = format!("{}{}", sym, i);

                if !self.current.is_declared(&sym) {
                    break sym;
                }
            }
        };

        if cfg!(debug_assertions) && LOG {
            eprintln!("\t{}{:?} -> {}", sym, ctxt, renamed);
        }

        let sym = self.current.change_symbol(sym, ctxt);
        let boxed_sym = sym.to_boxed_str();
        {
            let scope = self.current.scope_of(&boxed_sym, ctxt, self.var_kind);

            // Update symbol list
            let mut declared_symbols = scope.declared_symbols.borrow_mut();

            {
                // This assertion was correct in old time, but bundler creates
                // same variable with same name and same span
                // hygiene, so this assertion is not valid anymore.
                //
                // I decided not to remove this code because I may modify the
                // bundler to be correct in aspect of original span hygiene.

                // let is_not_renamed =
                // !scope.ops.borrow().rename.contains_key(&(sym.clone(),
                // ctxt));

                // debug_assert!(
                //     is_not_renamed,
                //     "failed to rename {}{:?}: should not rename an ident
                // multiple time\n{:?}",     sym,
                //     ctxt,
                //     scope.ops.borrow(),
                // );
            }

            let old = declared_symbols.entry(sym.to_boxed_str()).or_default();
            old.retain(|c| *c != ctxt);
            //        debug_assert!(old.is_empty() || old.len() == 1);

            let new = declared_symbols
                .entry(renamed.clone().into_boxed_str())
                .or_insert_with(|| Vec::with_capacity(2));
            new.push(ctxt);
            debug_assert!(new.len() == 1);

            scope
                .ops
                .borrow_mut()
                .rename
                .insert((sym, ctxt), renamed.clone().into());
        }
        self.current.renamed.insert(renamed.into());
    }
}

/// See [hygiene_with_config] for doc. Creates a `hygiene` pass with default
/// value of [Config].
pub fn hygiene() -> impl Fold + 'static {
    hygiene_with_config(Default::default())
}

/// The pass actually modifies the identifiers in the way that different
/// identifier (with respect to span hygiene) becomes different identifier.
/// (e.g. `a1` for `a#6`, `a2` for `a#23`)
pub fn hygiene_with_config(config: Config) -> impl 'static + Fold + VisitMut {
    chain!(
        as_folder(Hygiene {
            config,
            current: Default::default(),
            ident_type: IdentType::Ref,
            var_kind: None,
        }),
        as_folder(MarkClearer)
    )
}

#[derive(Clone, Copy)]
struct MarkClearer;
impl VisitMut for MarkClearer {
    noop_visit_mut_type!();

    fn visit_mut_ident(&mut self, ident: &mut Ident) {
        ident.span.ctxt = SyntaxContext::empty();
    }
}

impl<'a> Hygiene<'a> {
    /// Move `check_queue` to `ops`.
    fn check_enqueued(&mut self) {
        if self.current.check_queue.is_empty() {
            return;
        }

        dbg!(&self.current.check_queue);

        for (sym, ctxt) in self.current.check_queue.take() {
            if let Some(decls) = self
                .current
                .declared_symbols
                .borrow()
                .get(&sym.to_boxed_str())
            {
                if !decls.contains(&ctxt) {
                    continue;
                }
            }
            dbg!(&sym, ctxt);

            {
                let mut other_ctxts = vec![];

                let used = self.current.used.borrow();

                if let Some(ctxts) = used.get(&*sym) {
                    'add_loop: for &cx in ctxts {
                        if cx == ctxt {
                            continue;
                        }
                        if other_ctxts.contains(&cx) {
                            continue;
                        }

                        let mut cur = Some(&self.current);
                        while let Some(c) = cur {
                            let ops = c.ops.borrow();

                            if ops.rename.contains_key(&(sym.clone(), cx)) {
                                continue 'add_loop;
                            }
                            cur = c.parent;
                        }

                        other_ctxts.push(cx);
                    }
                }

                if other_ctxts.is_empty() {
                    continue;
                }

                dbg!(&other_ctxts);
            }

            self.rename(sym, ctxt);
        }
    }

    fn apply_ops<N>(&mut self, node: &mut N)
    where
        for<'o> N: VisitMutWith<Operator<'o>>,
    {
        self.check_enqueued();

        let ops = self.current.ops.borrow();

        let ids_to_remove = self.current.declared_symbols.borrow();

        {
            let mut cur = Some(&self.current);
            while let Some(c) = cur {
                let mut used = c.used.borrow_mut();

                for (sym, ctxts) in ids_to_remove.iter() {
                    let e = used.entry(sym.clone()).or_default();

                    for ctxt in ctxts.iter().copied() {
                        if let Some(pos) = e.iter().position(|&c| c == ctxt) {
                            e.remove(pos);
                        }
                    }
                }

                for ((sym, ctxt), _) in &ops.rename {
                    let e = used.entry(sym.to_boxed_str()).or_default();

                    if let Some(pos) = e.iter().position(|c| *c == *ctxt) {
                        e.remove(pos);
                    }
                }

                cur = c.parent;
            }
        }

        if ops.rename.is_empty() {
            return;
        }

        node.visit_mut_with(&mut Operator(&ops))
    }

    fn keep_class_name(&mut self, ident: &mut Ident, class: &mut Class) -> Option<ClassExpr> {
        if !self.config.keep_class_names {
            return None;
        }

        let mut orig_name = ident.clone();
        orig_name.span.ctxt = SyntaxContext::empty();

        {
            // Remove span hygiene of the class.
            let mut rename = HashMap::default();

            rename.insert(ident.to_id(), orig_name.sym.clone());

            let ops = Operations { rename };
            let mut operator = Operator(&ops);

            class.visit_mut_with(&mut operator);
        }

        {
            let old = self.ident_type;
            self.ident_type = IdentType::Binding;
            ident.visit_mut_with(self);
            self.ident_type = old;
        }
        class.visit_mut_with(self);

        let class_expr = ClassExpr {
            ident: Some(orig_name),
            class: class.take(),
        };

        Some(class_expr)
    }
}

impl<'a> Hygiene<'a> {
    fn visit_mut_fn(&mut self, ident: &mut Option<Ident>, node: &mut Function, is_decl: bool) {
        if is_decl {
            match ident.clone() {
                Some(ident) => {
                    self.add_decl(ident.clone());
                }
                _ => {}
            }
        }

        let mut folder = Hygiene {
            config: self.config.clone(),
            current: Scope::new(ScopeKind::Fn, Some(&self.current)),
            ident_type: IdentType::Ref,
            var_kind: None,
        };

        if !is_decl {
            match ident {
                Some(ident) => {
                    folder.add_decl(ident.clone());
                }
                _ => {}
            }
        }

        folder.ident_type = IdentType::Ref;
        node.decorators.visit_mut_with(&mut folder);

        folder.ident_type = IdentType::Binding;
        node.params.visit_mut_with(&mut folder);

        folder.ident_type = IdentType::Ref;
        node.body
            .as_mut()
            .map(|stmt| stmt.visit_mut_children_with(&mut folder));

        folder.apply_ops(ident);
        folder.apply_ops(node);
    }
}

#[derive(Debug)]
struct Scope<'a> {
    /// Parent scope of this scope
    pub parent: Option<&'a Scope<'a>>,

    /// Kind of the scope.
    pub kind: ScopeKind,

    pub used: RefCell<FxHashMap<Box<str>, Vec<SyntaxContext>>>,

    /// All references declared in this scope
    pub declared_symbols: RefCell<FxHashMap<Box<str>, Vec<SyntaxContext>>>,

    pub(crate) ops: RefCell<Operations>,
    pub renamed: FxHashSet<JsWord>,

    check_queue: Vec<Id>,
}

impl<'a> Default for Scope<'a> {
    fn default() -> Self {
        Scope::new(ScopeKind::Fn, None)
    }
}

impl<'a> Scope<'a> {
    fn depth(&self) -> usize {
        match self.parent {
            Some(parent) => parent.depth() + 1,
            None => 0,
        }
    }

    pub fn new(kind: ScopeKind, parent: Option<&'a Scope<'a>>) -> Self {
        Scope {
            parent,
            kind,
            declared_symbols: Default::default(),
            // children: Default::default(),
            ops: Default::default(),
            renamed: Default::default(),
            used: Default::default(),
            check_queue: Default::default(),
        }
    }

    fn scope_of(
        &self,
        sym: &Box<str>,
        ctxt: SyntaxContext,
        var_kind: Option<VarDeclKind>,
    ) -> &'a Scope<'_> {
        // In case of `var` declarations, we should use function scope instead of
        // current scope. This is to handle code like
        //
        // function foo() {
        //      if (a) {
        //          var b;
        //      }
        //      if (c) {
        //          b = foo()
        //      }
        // }
        //
        match var_kind {
            Some(VarDeclKind::Var) => {
                // `var`s are function-scoped.
                if self.kind == ScopeKind::Fn {
                    if let Some(prev) = self.declared_symbols.borrow().get(sym) {
                        if prev.contains(&ctxt) {
                            return self;
                        }
                    }
                }
            }
            _ => {
                if let Some(prev) = self.declared_symbols.borrow().get(sym) {
                    if prev.contains(&ctxt) {
                        return self;
                    }
                }
            }
        }

        match self.parent {
            Some(ref parent) => parent.scope_of(sym, ctxt, var_kind),
            _ => self,
        }
    }

    /// Returns all **conflicting** contexts.
    ///
    /// It other words, all `SyntaxContext`s with same `sym` will be returned,
    /// even when defined on parent scope.

    fn conflicts(&mut self, sym: JsWord, ctxt: SyntaxContext) -> Contexts {
        if cfg!(debug_assertions) && LOG {
            eprintln!("Finding conflicts for {}{:?} ", sym, ctxt);
        }

        let sym = self.change_symbol(sym, ctxt);

        let mut ctxts = smallvec![];
        {
            if let Some(cxs) = self.declared_symbols.get_mut().get(&*sym) {
                if cxs.len() != 1 || cxs[0] != ctxt {
                    ctxts.extend_from_slice(&cxs);
                }
            }
        }

        let mut cur = self.parent;

        while let Some(scope) = cur {
            if let Some(cxs) = scope.declared_symbols.borrow().get(&*sym) {
                if cxs.len() != 1 || cxs[0] != ctxt {
                    ctxts.extend_from_slice(&cxs);
                }
            }

            cur = scope.parent;
        }

        ctxts.retain(|c| *c != ctxt);
        ctxts.dedup();

        ctxts
    }

    fn change_symbol(&self, mut sym: JsWord, ctxt: SyntaxContext) -> JsWord {
        let mut cur = Some(self);

        while let Some(scope) = cur {
            if let Some(to) = scope.ops.borrow().rename.get(&(sym.clone(), ctxt)) {
                if cfg!(debug_assertions) && LOG {
                    eprintln!("\tChanging symbol: {}{:?} -> {}", sym, ctxt, to);
                }
                sym = to.clone()
            }

            cur = scope.parent;
        }

        sym
    }

    fn is_declared(&self, sym: &str) -> bool {
        if self.declared_symbols.borrow().contains_key(sym) {
            return true;
        }
        for (_, to) in &self.ops.borrow().rename {
            if to == sym {
                return true;
            }
        }
        match self.parent {
            Some(parent) => parent.is_declared(sym),
            _ => false,
        }
    }
}

macro_rules! track_ident_mut {
    () => {
        fn visit_mut_export_specifier(&mut self, s: &mut ExportSpecifier) {
            let old = self.ident_type;
            self.ident_type = IdentType::Ref;
            s.visit_mut_children_with(self);
            self.ident_type = old;
        }

        fn visit_mut_import_specifier(&mut self, s: &mut ImportSpecifier) {
            let old = self.ident_type;
            self.ident_type = IdentType::Binding;

            match s {
                ImportSpecifier::Named(ImportNamedSpecifier { imported: None, .. })
                | ImportSpecifier::Namespace(..)
                | ImportSpecifier::Default(..) => s.visit_mut_children_with(self),
                ImportSpecifier::Named(s) => s.local.visit_mut_with(self),
            };

            self.ident_type = old;
        }

        fn visit_mut_getter_prop(&mut self, f: &mut GetterProp) {
            let old = self.ident_type;
            self.ident_type = IdentType::Ref;
            f.key.visit_mut_with(self);
            self.ident_type = old;

            f.type_ann.visit_mut_with(self);

            f.body.visit_mut_with(self);
        }

        // impl<'a> Fold for $T<'a> {
        //     fn fold(&mut self, f: GetterProp) -> GetterProp {
        //         let body = f.body.visit_mut_with(self);

        //         GetterProp { body, ..c }
        //     }
        // }

        fn visit_mut_labeled_stmt(&mut self, s: &mut LabeledStmt) {
            let old = self.ident_type;
            self.ident_type = IdentType::Label;
            s.label.visit_mut_with(self);
            self.ident_type = old;

            s.body.visit_mut_with(self);
        }

        fn visit_mut_break_stmt(&mut self, s: &mut BreakStmt) {
            let old = self.ident_type;
            self.ident_type = IdentType::Label;
            s.label.visit_mut_with(self);
            self.ident_type = old;
        }

        fn visit_mut_continue_stmt(&mut self, s: &mut ContinueStmt) {
            let old = self.ident_type;
            self.ident_type = IdentType::Label;
            s.label.visit_mut_with(self);
            self.ident_type = old;
        }

        fn visit_mut_key_value_pat_prop(&mut self, n: &mut KeyValuePatProp) {
            n.key.visit_mut_with(self);
            n.value.visit_mut_with(self);
        }

        fn visit_mut_class(&mut self, c: &mut Class) {
            let old = self.ident_type;
            self.ident_type = IdentType::Ref;
            c.decorators.visit_mut_with(self);

            self.ident_type = IdentType::Ref;
            c.super_class.visit_mut_with(self);

            self.ident_type = IdentType::Binding;
            c.type_params.visit_mut_with(self);

            self.ident_type = IdentType::Ref;
            c.super_type_params.visit_mut_with(self);

            self.ident_type = IdentType::Ref;
            c.implements.visit_mut_with(self);
            self.ident_type = old;

            c.body.visit_mut_with(self);
        }

        fn visit_mut_prop_name(&mut self, n: &mut PropName) {
            match n {
                PropName::Computed(c) => {
                    c.visit_mut_with(self);
                }
                _ => {}
            }
        }
    };
}

impl<'a> VisitMut for Hygiene<'a> {
    noop_visit_mut_type!();

    track_ident_mut!();

    fn visit_mut_arrow_expr(&mut self, node: &mut ArrowExpr) {
        let mut folder = Hygiene {
            config: self.config.clone(),
            current: Scope::new(ScopeKind::Fn, Some(&self.current)),
            ident_type: IdentType::Ref,
            var_kind: None,
        };

        folder.ident_type = IdentType::Binding;
        node.params.visit_mut_with(&mut folder);

        folder.ident_type = IdentType::Ref;
        node.body.visit_mut_with(&mut folder);

        folder.apply_ops(node)
    }

    fn visit_mut_block_stmt(&mut self, node: &mut BlockStmt) {
        let mut folder = Hygiene {
            config: self.config.clone(),
            current: Scope::new(ScopeKind::Block, Some(&self.current)),
            ident_type: IdentType::Ref,
            var_kind: None,
        };
        node.visit_mut_children_with(&mut folder);

        folder.apply_ops(node)
    }

    fn visit_mut_catch_clause(&mut self, c: &mut CatchClause) {
        self.ident_type = IdentType::Binding;
        c.param.visit_mut_with(self);

        let mut folder = Hygiene {
            config: self.config.clone(),
            current: Scope::new(ScopeKind::Fn, Some(&self.current)),
            ident_type: IdentType::Ref,
            var_kind: None,
        };
        folder.ident_type = IdentType::Ref;

        c.body.visit_mut_with(&mut folder);

        folder.apply_ops(c);
    }

    fn visit_mut_class_decl(&mut self, n: &mut ClassDecl) {
        let old = self.ident_type;
        self.ident_type = IdentType::Binding;
        n.ident.visit_mut_with(self);
        self.ident_type = old;

        n.class.visit_mut_with(self);
    }

    fn visit_mut_class_expr(&mut self, n: &mut ClassExpr) {
        if let Some(ident) = &mut n.ident {
            if let Some(expr) = self.keep_class_name(ident, &mut n.class) {
                *n = expr;
                return;
            }
        }
        let old = self.ident_type;
        self.ident_type = IdentType::Binding;
        n.ident.visit_mut_with(self);
        self.ident_type = old;

        n.class.visit_mut_with(self);
    }

    fn visit_mut_class_method(&mut self, n: &mut ClassMethod) {
        n.function.decorators.visit_mut_with(self);

        let mut folder = Hygiene {
            config: self.config.clone(),
            current: Scope::new(ScopeKind::Fn, None),
            ident_type: IdentType::Ref,
            var_kind: None,
        };

        folder.ident_type = IdentType::Binding;
        n.function.params.visit_mut_children_with(&mut folder);

        folder.ident_type = IdentType::Ref;

        n.function.body.visit_mut_with(self);
        n.key.visit_mut_with(self);

        folder.apply_ops(&mut n.function);
    }

    fn visit_mut_constructor(&mut self, c: &mut Constructor) {
        let mut folder = Hygiene {
            config: self.config.clone(),
            current: Scope::new(ScopeKind::Fn, None),
            ident_type: IdentType::Ref,
            var_kind: None,
        };

        let old = folder.ident_type;
        folder.ident_type = IdentType::Binding;
        c.params.visit_mut_with(&mut folder);
        folder.ident_type = old;

        c.body
            .as_mut()
            .map(|bs| bs.visit_mut_children_with(&mut folder));
        c.key.visit_mut_with(&mut folder);

        folder.apply_ops(c)
    }

    fn visit_mut_decl(&mut self, decl: &mut Decl) {
        match decl {
            Decl::Class(cls) if self.config.keep_class_names => {
                let span = cls.class.span;

                let expr = self.keep_class_name(&mut cls.ident, &mut cls.class);
                if let Some(expr) = expr {
                    let var = VarDeclarator {
                        span,
                        name: Pat::Ident(cls.ident.clone().into()),
                        init: Some(Box::new(Expr::Class(expr))),
                        definite: false,
                    };
                    *decl = Decl::Var(VarDecl {
                        span,
                        kind: VarDeclKind::Let,
                        declare: false,
                        decls: vec![var],
                    });
                    return;
                }

                return;
            }
            _ => {}
        }

        decl.visit_mut_children_with(self);
    }

    fn visit_mut_expr(&mut self, node: &mut Expr) {
        let old = self.ident_type;
        self.ident_type = IdentType::Ref;
        match node {
            Expr::Ident(..) => node.visit_mut_children_with(self),

            Expr::This(..) => {}

            _ => node.visit_mut_children_with(self),
        };

        self.ident_type = old;
    }

    fn visit_mut_fn_decl(&mut self, node: &mut FnDecl) {
        let mut new_id = Some(node.ident.clone());
        self.visit_mut_fn(&mut new_id, &mut node.function, true);
        node.ident = new_id.unwrap();
    }

    fn visit_mut_fn_expr(&mut self, node: &mut FnExpr) {
        let mut new_id = node.ident.clone();
        self.visit_mut_fn(&mut new_id, &mut node.function, false);
        node.ident = new_id;
    }

    /// Invoked for `IdentifierReference` / `BindingIdentifier`
    fn visit_mut_ident(&mut self, i: &mut Ident) {
        if i.sym == js_word!("arguments") || i.sym == js_word!("undefined") {
            return;
        }

        match self.ident_type {
            IdentType::Binding => self.add_decl(i.clone()),
            IdentType::Ref => {
                // Special cases
                if is_native_word(&i.sym) {
                    return;
                }

                self.add_used_ref(&i);
            }
            IdentType::Label => {
                // We currently does not touch labels
                return;
            }
        }
    }

    fn visit_mut_member_expr(&mut self, e: &mut MemberExpr) {
        e.obj.visit_mut_with(self);

        if e.computed {
            e.prop.visit_mut_with(self);
        }
    }

    fn visit_mut_module(&mut self, module: &mut Module) {
        module.visit_mut_children_with(self);

        self.apply_ops(module)
    }

    fn visit_mut_private_name(&mut self, _: &mut PrivateName) {}

    fn visit_mut_setter_prop(&mut self, f: &mut SetterProp) {
        let old = self.ident_type;
        self.ident_type = IdentType::Ref;
        f.key.visit_mut_with(self);
        self.ident_type = old;

        let old = self.ident_type;
        self.ident_type = IdentType::Binding;
        f.param.visit_mut_with(self);
        self.ident_type = old;

        f.body.visit_mut_with(self);
    }

    fn visit_mut_try_stmt(&mut self, node: &mut TryStmt) {
        node.block.visit_mut_children_with(self);

        node.handler.visit_mut_with(self);
        node.finalizer.visit_mut_children_with(self);
    }

    fn visit_mut_var_decl(&mut self, var: &mut VarDecl) {
        let old = self.var_kind;
        self.var_kind = Some(var.kind);
        var.visit_mut_children_with(self);
        self.var_kind = old;
    }

    fn visit_mut_var_declarator(&mut self, decl: &mut VarDeclarator) {
        let old = self.var_kind;
        self.var_kind = None;
        decl.init.visit_mut_with(self);
        self.var_kind = old;

        let old = self.ident_type;
        self.ident_type = IdentType::Binding;
        decl.name.visit_mut_with(self);
        self.ident_type = old;
    }
}
