use self::ops::{Operations, Operator};
use crate::{
    compat::es2015::classes::native::is_native,
    scope::{IdentType, ScopeKind},
};
use fxhash::FxHashMap;
use smallvec::{smallvec, SmallVec};
use std::cell::RefCell;
use swc_atoms::JsWord;
use swc_common::{chain, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};

mod ops;
#[cfg(test)]
mod tests;

const LOG: bool = true;

trait ToBoxedStr {
    fn to_boxed_str(&self) -> Box<str>;
}

impl ToBoxedStr for JsWord {
    fn to_boxed_str(&self) -> Box<str> {
        (**self).to_owned().into_boxed_str()
    }
}

struct Hygiene<'a> {
    current: Scope<'a>,
    ident_type: IdentType,
}

type Contexts = SmallVec<[SyntaxContext; 32]>;

impl<'a> Hygiene<'a> {
    fn add_declared_ref(&mut self, ident: Ident) {
        let ctxt = ident.span.ctxt();

        if cfg!(debug_assertions) && LOG {
            eprintln!("Declaring {}{:?} ", ident.sym, ctxt);
        }

        let can_declare_without_renaming =
            self.current.can_declare(&ident.sym.to_boxed_str(), ctxt);
        let sym = self.current.change_symbol(ident.sym, ctxt);

        if cfg!(debug_assertions) && LOG {
            eprintln!("Changed symbol to {}{:?} ", sym, ctxt);
        }

        self.current
            .declared_symbols
            .borrow_mut()
            .entry(sym.to_boxed_str())
            .or_default()
            .push(ctxt);

        if can_declare_without_renaming {
            // skip if previous symbol is declared on the same level.
            return;
        }

        if cfg!(debug_assertions) && LOG {
            eprintln!("Renaming from decl");
        }
        self.rename(sym, ctxt);
    }

    fn add_used_ref(&mut self, ident: &Ident) {
        if cfg!(debug_assertions) && LOG {
            eprintln!("Ident ref: {}{:?}", ident.sym, ident.span.ctxt);
        }

        let ctxt = ident.span.ctxt();

        // Commented out because of https://github.com/swc-project/swc/issues/962

        // self.current
        //     .declared_symbols
        //     .borrow_mut()
        //     .entry(ident.sym.clone())
        //     .or_insert_with(Vec::new)
        //     .push(ctxt);

        // We rename declaration instead of usage
        let conflicts = self.current.conflicts(ident.sym.clone(), ctxt);

        if cfg!(debug_assertions) && LOG && !conflicts.is_empty() {
            eprintln!("Renaming from usage");
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
                let sym: JsWord = format!("{}{}", sym, i).into();

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
        let scope = self.current.scope_of(&boxed_sym, ctxt);

        // Update symbol list
        let mut declared_symbols = scope.declared_symbols.borrow_mut();

        let is_not_renamed = !scope.ops.borrow().rename.contains_key(&(sym.clone(), ctxt));

        debug_assert!(
            is_not_renamed,
            "failed to rename {}{:?}: should not rename an ident multiple time\n{:?}",
            sym,
            ctxt,
            scope.ops.borrow(),
        );

        let old = declared_symbols.entry(sym.to_boxed_str()).or_default();
        assert!(
            old.contains(&ctxt),
            "{:?} does not contain {}{:?}",
            declared_symbols,
            sym,
            ctxt
        );
        old.retain(|c| *c != ctxt);
        //        debug_assert!(old.is_empty() || old.len() == 1);

        let new = declared_symbols.entry(renamed.to_boxed_str()).or_default();
        new.push(ctxt);
        debug_assert!(new.len() == 1);

        scope.ops.borrow_mut().rename.insert((sym, ctxt), renamed);
    }
}

pub fn hygiene() -> impl Fold + 'static {
    chain!(
        as_folder(Hygiene {
            current: Default::default(),
            ident_type: IdentType::Ref,
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
    fn apply_ops<N>(&mut self, node: &mut N)
    where
        for<'o> N: VisitMutWith<Operator<'o>>,
    {
        let ops = self.current.ops.borrow();

        if ops.rename.is_empty() {
            return;
        }
        node.visit_mut_with(&mut Operator(&ops))
    }
}

impl<'a> Hygiene<'a> {
    fn visit_mut_fn(&mut self, ident: Option<Ident>, node: &mut Function) {
        match ident {
            Some(ident) => {
                self.add_declared_ref(ident);
            }
            _ => {}
        }

        let mut folder = Hygiene {
            current: Scope::new(ScopeKind::Fn, Some(&self.current)),
            ident_type: IdentType::Ref,
        };

        folder.ident_type = IdentType::Ref;
        node.decorators.visit_mut_with(&mut folder);

        folder.ident_type = IdentType::Binding;
        node.params.visit_mut_with(&mut folder);

        folder.ident_type = IdentType::Ref;
        node.body
            .as_mut()
            .map(|stmt| stmt.visit_mut_children_with(&mut folder));

        folder.apply_ops(node)
    }
}

#[derive(Debug)]
struct Scope<'a> {
    /// Parent scope of this scope
    pub parent: Option<&'a Scope<'a>>,

    /// Kind of the scope.
    pub kind: ScopeKind,

    /// All references declared in this scope
    pub declared_symbols: RefCell<FxHashMap<Box<str>, Vec<SyntaxContext>>>,

    pub(crate) ops: RefCell<Operations>,
}

impl<'a> Default for Scope<'a> {
    fn default() -> Self {
        Scope::new(ScopeKind::Fn, None)
    }
}

impl<'a> Scope<'a> {
    pub fn new(kind: ScopeKind, parent: Option<&'a Scope<'a>>) -> Self {
        Scope {
            parent,
            kind,
            declared_symbols: Default::default(),
            // children: Default::default(),
            ops: Default::default(),
        }
    }

    fn scope_of(&self, sym: &Box<str>, ctxt: SyntaxContext) -> &'a Scope<'_> {
        if let Some(prev) = self.declared_symbols.borrow().get(sym) {
            if prev.contains(&ctxt) {
                return self;
            }
        }

        match self.parent {
            Some(ref parent) => parent.scope_of(sym, ctxt),
            _ => self,
        }
    }

    fn can_declare(&self, sym: &Box<str>, ctxt: SyntaxContext) -> bool {
        match self.parent {
            None => {}
            Some(parent) => {
                if !parent.can_declare(sym, ctxt) {
                    return false;
                }
            }
        }

        if is_native(&sym) {
            return false;
        }

        if let Some(ctxts) = self.declared_symbols.borrow().get(sym) {
            ctxts.contains(&ctxt)
        } else {
            // No variable named `sym` is declared
            true
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
                    eprintln!("Changing symbol: {}{:?} -> {}", sym, ctxt, to);
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

#[macro_export]
#[deprecated = "Not a public api"]
macro_rules! track_ident {
    () => {
        fn fold_export_specifier(&mut self, s: ExportSpecifier) -> ExportSpecifier {
            let old = self.ident_type;
            self.ident_type = IdentType::Ref;
            let s = s.fold_children_with(self);
            self.ident_type = old;
            s
        }

        fn fold_import_specifier(&mut self, s: ImportSpecifier) -> ImportSpecifier {
            let old = self.ident_type;
            self.ident_type = IdentType::Binding;

            let s = match s {
                ImportSpecifier::Named(ImportNamedSpecifier { imported: None, .. })
                | ImportSpecifier::Namespace(..)
                | ImportSpecifier::Default(..) => s.fold_children_with(self),
                ImportSpecifier::Named(s) => ImportSpecifier::Named(ImportNamedSpecifier {
                    local: s.local.fold_with(self),
                    ..s
                }),
            };

            self.ident_type = old;

            s
        }

        fn fold_setter_prop(&mut self, f: SetterProp) -> SetterProp {
            let old = self.ident_type;
            self.ident_type = IdentType::Binding;
            let param = f.param.fold_with(self);
            self.ident_type = old;

            let body = f.body.fold_with(self);

            SetterProp { param, body, ..f }
        }

        // impl<'a> Fold for $T<'a> {
        //     fn fold(&mut self, f: GetterProp) -> GetterProp {
        //         let body = f.body.fold_with(self);

        //         GetterProp { body, ..c }
        //     }
        // }

        fn fold_labeled_stmt(&mut self, s: LabeledStmt) -> LabeledStmt {
            let old = self.ident_type;
            self.ident_type = IdentType::Label;
            let label = s.label.fold_with(self);
            self.ident_type = old;

            let body = s.body.fold_with(self);

            LabeledStmt { label, body, ..s }
        }

        fn fold_break_stmt(&mut self, s: BreakStmt) -> BreakStmt {
            let old = self.ident_type;
            self.ident_type = IdentType::Label;
            let label = s.label.fold_with(self);
            self.ident_type = old;

            BreakStmt { label, ..s }
        }

        fn fold_continue_stmt(&mut self, s: ContinueStmt) -> ContinueStmt {
            let old = self.ident_type;
            self.ident_type = IdentType::Label;
            let label = s.label.fold_with(self);
            self.ident_type = old;

            ContinueStmt { label, ..s }
        }

        fn fold_class_decl(&mut self, n: ClassDecl) -> ClassDecl {
            let old = self.ident_type;
            self.ident_type = IdentType::Binding;
            let ident = n.ident.fold_with(self);
            self.ident_type = old;

            let class = n.class.fold_with(self);

            ClassDecl { ident, class, ..n }
        }

        fn fold_class_expr(&mut self, n: ClassExpr) -> ClassExpr {
            let old = self.ident_type;
            self.ident_type = IdentType::Binding;
            let ident = n.ident.fold_with(self);
            self.ident_type = old;

            let class = n.class.fold_with(self);

            ClassExpr { ident, class, ..n }
        }

        fn fold_key_value_pat_prop(&mut self, n: KeyValuePatProp) -> KeyValuePatProp {
            KeyValuePatProp {
                key: n.key.fold_with(self),
                value: n.value.fold_with(self),
                ..n
            }
        }

        fn fold_class(&mut self, c: Class) -> Class {
            let old = self.ident_type;
            self.ident_type = IdentType::Ref;
            let decorators = c.decorators.fold_with(self);

            self.ident_type = IdentType::Ref;
            let super_class = c.super_class.fold_with(self);

            self.ident_type = IdentType::Binding;
            let type_params = c.type_params.fold_with(self);

            self.ident_type = IdentType::Ref;
            let super_type_params = c.super_type_params.fold_with(self);

            self.ident_type = IdentType::Ref;
            let implements = c.implements.fold_with(self);
            self.ident_type = old;

            let body = c.body.fold_with(self);

            Class {
                span: c.span,
                decorators,
                is_abstract: c.is_abstract,
                implements,
                body,
                super_class,
                type_params,
                super_type_params,
            }
        }

        fn fold_prop_name(&mut self, n: PropName) -> PropName {
            match n {
                PropName::Computed(c) => PropName::Computed(c.fold_with(self)),
                _ => n,
            }
        }
    };
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

        fn visit_mut_setter_prop(&mut self, f: &mut SetterProp) {
            let old = self.ident_type;
            self.ident_type = IdentType::Binding;
            f.param.visit_mut_with(self);
            self.ident_type = old;

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

        fn visit_mut_class_decl(&mut self, n: &mut ClassDecl) {
            let old = self.ident_type;
            self.ident_type = IdentType::Binding;
            n.ident.visit_mut_with(self);
            self.ident_type = old;

            n.class.visit_mut_with(self);
        }

        fn visit_mut_class_expr(&mut self, n: &mut ClassExpr) {
            let old = self.ident_type;
            self.ident_type = IdentType::Binding;
            n.ident.visit_mut_with(self);
            self.ident_type = old;

            n.class.visit_mut_with(self);
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
            current: Scope::new(ScopeKind::Fn, Some(&self.current)),
            ident_type: IdentType::Ref,
        };

        folder.ident_type = IdentType::Binding;
        node.params.visit_mut_with(&mut folder);

        folder.ident_type = IdentType::Ref;
        node.body.visit_mut_with(&mut folder);

        folder.apply_ops(node)
    }

    fn visit_mut_block_stmt(&mut self, node: &mut BlockStmt) {
        let mut folder = Hygiene {
            current: Scope::new(ScopeKind::Block, Some(&self.current)),
            ident_type: IdentType::Ref,
        };
        node.visit_mut_children_with(&mut folder);

        folder.apply_ops(node)
    }

    fn visit_mut_catch_clause(&mut self, c: &mut CatchClause) {
        let mut folder = Hygiene {
            current: Scope::new(ScopeKind::Fn, Some(&self.current)),
            ident_type: IdentType::Ref,
        };
        folder.ident_type = IdentType::Binding;
        c.param.visit_mut_with(&mut folder);
        folder.ident_type = IdentType::Ref;

        c.body.visit_mut_with(&mut folder);
    }

    fn visit_mut_constructor(&mut self, c: &mut Constructor) {
        let old = self.ident_type;
        self.ident_type = IdentType::Binding;
        c.params.visit_mut_with(self);
        self.ident_type = old;

        c.body.as_mut().map(|bs| bs.visit_mut_children_with(self));
        c.key.visit_mut_with(self);

        self.apply_ops(c)
    }

    fn visit_mut_expr(&mut self, node: &mut Expr) {
        let old = self.ident_type;
        self.ident_type = IdentType::Ref;
        match node {
            Expr::Ident(..) => node.visit_mut_children_with(self),
            Expr::Member(e) => {
                if e.computed {
                    e.obj.visit_mut_with(self);
                    e.prop.visit_mut_with(self);
                } else {
                    e.obj.visit_mut_with(self)
                }
            }

            Expr::This(..) => {}

            _ => node.visit_mut_children_with(self),
        };

        self.ident_type = old;
    }

    fn visit_mut_fn_decl(&mut self, node: &mut FnDecl) {
        self.visit_mut_fn(Some(node.ident.clone()), &mut node.function);
    }

    fn visit_mut_fn_expr(&mut self, node: &mut FnExpr) {
        self.visit_mut_fn(node.ident.clone(), &mut node.function);
    }

    /// Invoked for `IdetifierRefrence` / `BindingIdentifier`
    fn visit_mut_ident(&mut self, i: &mut Ident) {
        if i.sym == js_word!("arguments") || i.sym == js_word!("undefined") {
            return;
        }

        match self.ident_type {
            IdentType::Binding => self.add_declared_ref(i.clone()),
            IdentType::Ref => {
                // Special cases
                if is_native(&i.sym) {
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

    fn visit_mut_module(&mut self, module: &mut Module) {
        module.visit_mut_children_with(self);

        self.apply_ops(module)
    }

    fn visit_mut_object_lit(&mut self, node: &mut ObjectLit) {
        let mut folder = Hygiene {
            current: Scope::new(ScopeKind::Block, Some(&self.current)),
            ident_type: IdentType::Ref,
        };
        node.visit_mut_children_with(&mut folder);

        folder.apply_ops(node)
    }

    fn visit_mut_try_stmt(&mut self, node: &mut TryStmt) {
        node.block.visit_mut_children_with(self);

        node.handler.visit_mut_with(self);
        node.finalizer.visit_mut_children_with(self);
    }

    fn visit_mut_var_declarator(&mut self, decl: &mut VarDeclarator) {
        let old = self.ident_type;
        self.ident_type = IdentType::Binding;
        decl.name.visit_mut_with(self);
        self.ident_type = old;

        decl.init.visit_mut_with(self);
    }
}
