use self::ops::{Operator, ScopeOp};
use crate::{
    compat::es2015::classes::native::is_native,
    pass::Pass,
    scope::{IdentType, ScopeKind},
};
use smallvec::{smallvec, SmallVec};
use std::{cell::RefCell, collections::HashMap};
use swc_atoms::JsWord;
use swc_common::{chain, Fold, FoldWith, Span, SyntaxContext};
use swc_ecma_ast::*;

mod ops;
#[cfg(test)]
mod tests;

const LOG: bool = false;

struct Hygiene<'a> {
    current: Scope<'a>,
    ident_type: IdentType,
}

noop_fold_type!(Hygiene<'_>);

type Contexts = SmallVec<[SyntaxContext; 32]>;

impl<'a> Hygiene<'a> {
    fn add_declared_ref(&mut self, ident: Ident) {
        let ctxt = ident.span.ctxt();

        if cfg!(debug_assertions) && LOG {
            eprintln!("Declaring {}{:?} ", ident.sym, ctxt);
        }

        let can_declare_without_renaming = self.current.can_declare(ident.sym.clone(), ctxt);
        let sym = self.current.change_symbol(ident.sym, ctxt);

        self.current
            .declared_symbols
            .borrow_mut()
            .entry(sym.clone())
            .or_insert_with(Vec::new)
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

    fn add_used_ref(&mut self, ident: Ident) {
        let ctxt = ident.span.ctxt();

        self.current
            .declared_symbols
            .borrow_mut()
            .entry(ident.sym.clone())
            .or_insert_with(Vec::new)
            .push(ctxt);

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
        let scope = self.current.scope_of(sym.clone(), ctxt);

        // Update symbol list
        let mut declared_symbols = scope.declared_symbols.borrow_mut();

        let is_not_renamed = scope.ops.borrow().iter().all(|op| match *op {
            ScopeOp::Rename { ref from, .. } => from.0 != sym || from.1 != ctxt,
        });

        debug_assert!(
            is_not_renamed,
            "failed to rename {}{:?}: should not rename an ident multiple time\n{:?}",
            sym,
            ctxt,
            scope.ops.borrow(),
        );

        let old = declared_symbols.entry(sym.clone()).or_default();
        assert!(
            old.contains(&ctxt),
            "{:?} does not contain {}{:?}",
            declared_symbols,
            sym,
            ctxt
        );
        old.retain(|c| *c != ctxt);
        //        debug_assert!(old.is_empty() || old.len() == 1);

        let new = declared_symbols.entry(renamed.clone()).or_default();
        new.push(ctxt);
        debug_assert!(new.len() == 1);

        scope.ops.borrow_mut().push(ScopeOp::Rename {
            from: (sym, ctxt),
            to: renamed,
        });
    }
}

pub fn hygiene() -> impl Pass + 'static {
    #[derive(Clone, Copy)]
    struct MarkClearer;
    impl Fold<Span> for MarkClearer {
        fn fold(&mut self, span: Span) -> Span {
            span.with_ctxt(SyntaxContext::empty())
        }
    }

    chain!(
        Hygiene {
            current: Default::default(),
            ident_type: IdentType::Ref,
        },
        MarkClearer
    )
}

impl<'a> Hygiene<'a> {
    fn apply_ops<N>(&mut self, node: N) -> N
    where
        for<'o> N: FoldWith<Operator<'o>>,
    {
        let ops = self.current.ops.borrow();

        if ops.is_empty() {
            return node;
        }
        node.fold_with(&mut Operator(&ops))
    }
}

impl<'a> Fold<Module> for Hygiene<'a> {
    fn fold(&mut self, module: Module) -> Module {
        let module = validate!(module.fold_children(self));

        validate!(self.apply_ops(module))
    }
}

impl<'a> Fold<TryStmt> for Hygiene<'a> {
    fn fold(&mut self, node: TryStmt) -> TryStmt {
        TryStmt {
            span: node.span,
            block: node.block.fold_children(self),
            handler: node.handler.fold_with(self),
            finalizer: node.finalizer.fold_children(self),
        }
    }
}

impl<'a> Fold<BlockStmt> for Hygiene<'a> {
    fn fold(&mut self, node: BlockStmt) -> BlockStmt {
        let mut folder = Hygiene {
            current: Scope::new(ScopeKind::Block, Some(&self.current)),
            ident_type: IdentType::Ref,
        };
        let node = node.fold_children(&mut folder);

        folder.apply_ops(node)
    }
}

impl Fold<ObjectLit> for Hygiene<'_> {
    fn fold(&mut self, node: ObjectLit) -> ObjectLit {
        let mut folder = Hygiene {
            current: Scope::new(ScopeKind::Block, Some(&self.current)),
            ident_type: IdentType::Ref,
        };
        let node = node.fold_children(&mut folder);

        folder.apply_ops(node)
    }
}

impl<'a> Hygiene<'a> {
    fn fold_fn(&mut self, ident: Option<Ident>, mut node: Function) -> Function {
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
        node.decorators = node.decorators.fold_with(&mut folder);

        folder.ident_type = IdentType::Binding;
        node.params = node.params.fold_with(&mut folder);

        folder.ident_type = IdentType::Ref;
        node.body = node.body.map(|stmt| stmt.fold_children(&mut folder));

        folder.apply_ops(node)
    }
}

impl<'a> Fold<VarDeclarator> for Hygiene<'a> {
    fn fold(&mut self, decl: VarDeclarator) -> VarDeclarator {
        let old = self.ident_type;
        self.ident_type = IdentType::Binding;
        let name = decl.name.fold_with(self);
        self.ident_type = old;

        let init = decl.init.fold_with(self);
        VarDeclarator { name, init, ..decl }
    }
}

impl<'a> Fold<FnExpr> for Hygiene<'a> {
    fn fold(&mut self, mut node: FnExpr) -> FnExpr {
        node.function = self.fold_fn(node.ident.clone(), node.function);

        node
    }
}

impl<'a> Fold<FnDecl> for Hygiene<'a> {
    fn fold(&mut self, mut node: FnDecl) -> FnDecl {
        node.function = self.fold_fn(Some(node.ident.clone()), node.function);

        node
    }
}

impl<'a> Fold<Ident> for Hygiene<'a> {
    /// Invoked for `IdetifierRefrence` / `BindingIdentifier`
    fn fold(&mut self, i: Ident) -> Ident {
        if i.sym == js_word!("arguments") || i.sym == js_word!("undefined") {
            return i;
        }

        match self.ident_type {
            IdentType::Binding => self.add_declared_ref(i.clone()),
            IdentType::Ref => {
                // Special cases
                if is_native(&i.sym) {
                    return i;
                }

                self.add_used_ref(i.clone());
            }
            IdentType::Label => {
                // We currently does not touch labels
                return i;
            }
        }

        i
    }
}

impl<'a> Fold<Expr> for Hygiene<'a> {
    fn fold(&mut self, node: Expr) -> Expr {
        let old = self.ident_type;
        self.ident_type = IdentType::Ref;
        let node = match node {
            Expr::Ident(..) => node.fold_children(self),
            Expr::Member(e) => {
                if e.computed {
                    Expr::Member(MemberExpr {
                        obj: e.obj.fold_with(self),
                        prop: e.prop.fold_with(self),
                        ..e
                    })
                } else {
                    Expr::Member(MemberExpr {
                        obj: e.obj.fold_with(self),
                        ..e
                    })
                }
            }

            Expr::This(..) => node,

            _ => node.fold_children(self),
        };

        self.ident_type = old;

        node
    }
}

#[derive(Debug)]
struct Scope<'a> {
    /// Parent scope of this scope
    pub parent: Option<&'a Scope<'a>>,

    /// Kind of the scope.
    pub kind: ScopeKind,

    /// All references declared in this scope
    pub declared_symbols: RefCell<HashMap<JsWord, Vec<SyntaxContext>>>,

    pub(crate) ops: RefCell<Vec<ScopeOp>>,
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

    fn scope_of(&self, sym: JsWord, ctxt: SyntaxContext) -> &'a Scope<'_> {
        if let Some(prev) = self.declared_symbols.borrow().get(&sym) {
            if prev.contains(&ctxt) {
                return self;
            }
        }

        match self.parent {
            Some(ref parent) => parent.scope_of(sym, ctxt),
            _ => self,
        }
    }

    fn can_declare(&self, sym: JsWord, ctxt: SyntaxContext) -> bool {
        match self.parent {
            None => {}
            Some(parent) => {
                if !parent.can_declare(sym.clone(), ctxt) {
                    return false;
                }
            }
        }

        if is_native(&sym) {
            return false;
        }

        if let Some(ctxts) = self.declared_symbols.borrow().get(&sym) {
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
            if let Some(cxs) = self.declared_symbols.get_mut().get(&sym) {
                if cxs.len() != 1 || cxs[0] != ctxt {
                    ctxts.extend_from_slice(&cxs);
                }
            }
        }

        let mut cur = self.parent;

        while let Some(scope) = cur {
            if let Some(cxs) = scope.declared_symbols.borrow().get(&sym) {
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
            for op in scope.ops.borrow().iter() {
                match *op {
                    ScopeOp::Rename { ref from, ref to } if from.0 == *sym && from.1 == ctxt => {
                        if cfg!(debug_assertions) && LOG {
                            eprintln!("Changing symbol: {}{:?} -> {}", sym, ctxt, to);
                        }
                        sym = to.clone()
                    }
                    _ => {}
                }
            }

            cur = scope.parent;
        }

        sym
    }

    fn is_declared(&self, sym: &JsWord) -> bool {
        if self.declared_symbols.borrow().contains_key(sym) {
            return true;
        }
        for op in self.ops.borrow().iter() {
            match *op {
                ScopeOp::Rename { ref to, .. } if sym == to => return true,
                _ => {}
            }
        }
        match self.parent {
            Some(parent) => parent.is_declared(sym),
            _ => false,
        }
    }
}

impl Fold<Constructor> for Hygiene<'_> {
    fn fold(&mut self, c: Constructor) -> Constructor {
        let old = self.ident_type;
        self.ident_type = IdentType::Binding;
        let params = c.params.fold_with(self);
        self.ident_type = old;

        let body = c.body.map(|bs| bs.fold_children(self));
        let key = c.key.fold_with(self);

        let c = Constructor {
            params,
            body,
            key,
            ..c
        };

        self.apply_ops(c)
    }
}

#[macro_export]
macro_rules! track_ident {
    ($T:tt) => {
        impl<'a> Fold<ExportSpecifier> for $T<'a> {
            fn fold(&mut self, s: ExportSpecifier) -> ExportSpecifier {
                let old = self.ident_type;
                self.ident_type = IdentType::Ref;

                let s = s.fold_children(self);

                self.ident_type = old;

                s
            }
        }

        impl<'a> Fold<ImportSpecifier> for $T<'a> {
            fn fold(&mut self, s: ImportSpecifier) -> ImportSpecifier {
                let old = self.ident_type;
                self.ident_type = IdentType::Binding;

                let s = match s {
                    ImportSpecifier::Specific(ImportSpecific { imported: None, .. })
                    | ImportSpecifier::Namespace(..)
                    | ImportSpecifier::Default(..) => s.fold_children(self),
                    ImportSpecifier::Specific(s) => ImportSpecifier::Specific(ImportSpecific {
                        local: s.local.fold_with(self),
                        ..s
                    }),
                };

                self.ident_type = old;

                s
            }
        }

        impl<'a> Fold<SetterProp> for $T<'a> {
            fn fold(&mut self, f: SetterProp) -> SetterProp {
                let old = self.ident_type;
                self.ident_type = IdentType::Binding;
                let param = f.param.fold_with(self);
                self.ident_type = old;

                let body = f.body.fold_with(self);

                SetterProp { param, body, ..f }
            }
        }

        // impl<'a> Fold<GetterProp> for $T<'a> {
        //     fn fold(&mut self, f: GetterProp) -> GetterProp {
        //         let body = f.body.fold_with(self);

        //         GetterProp { body, ..c }
        //     }
        // }

        impl<'a> Fold<LabeledStmt> for $T<'a> {
            fn fold(&mut self, s: LabeledStmt) -> LabeledStmt {
                let old = self.ident_type;
                self.ident_type = IdentType::Label;
                let label = s.label.fold_with(self);
                self.ident_type = old;

                let body = s.body.fold_with(self);

                LabeledStmt { label, body, ..s }
            }
        }

        impl<'a> Fold<BreakStmt> for $T<'a> {
            fn fold(&mut self, s: BreakStmt) -> BreakStmt {
                let old = self.ident_type;
                self.ident_type = IdentType::Label;
                let label = s.label.fold_with(self);
                self.ident_type = old;

                BreakStmt { label, ..s }
            }
        }

        impl<'a> Fold<ContinueStmt> for $T<'a> {
            fn fold(&mut self, s: ContinueStmt) -> ContinueStmt {
                let old = self.ident_type;
                self.ident_type = IdentType::Label;
                let label = s.label.fold_with(self);
                self.ident_type = old;

                ContinueStmt { label, ..s }
            }
        }

        impl<'a> Fold<ClassDecl> for $T<'a> {
            fn fold(&mut self, n: ClassDecl) -> ClassDecl {
                let old = self.ident_type;
                self.ident_type = IdentType::Binding;
                let ident = n.ident.fold_with(self);
                self.ident_type = old;

                let class = n.class.fold_with(self);

                ClassDecl { ident, class, ..n }
            }
        }

        impl<'a> Fold<ClassExpr> for $T<'a> {
            fn fold(&mut self, n: ClassExpr) -> ClassExpr {
                let old = self.ident_type;
                self.ident_type = IdentType::Binding;
                let ident = n.ident.fold_with(self);
                self.ident_type = old;

                let class = n.class.fold_with(self);

                ClassExpr { ident, class, ..n }
            }
        }

        impl<'a> Fold<KeyValuePatProp> for $T<'a> {
            fn fold(&mut self, n: KeyValuePatProp) -> KeyValuePatProp {
                KeyValuePatProp {
                    key: n.key.fold_with(self),
                    value: n.value.fold_with(self),
                    ..n
                }
            }
        }

        impl Fold<Class> for $T<'_> {
            fn fold(&mut self, c: Class) -> Class {
                let old = self.ident_type;
                self.ident_type = IdentType::Ref;
                let decorators = c.decorators.fold_with(self);
                self.ident_type = IdentType::Ref;
                let super_class = c.super_class.fold_with(self);
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
                    type_params: c.type_params,
                    super_type_params: c.super_type_params,
                }
            }
        }

        impl Fold<PropName> for $T<'_> {
            fn fold(&mut self, n: PropName) -> PropName {
                match n {
                    PropName::Computed(c) => PropName::Computed(c.fold_with(self)),
                    _ => n,
                }
            }
        }
    };
}

track_ident!(Hygiene);

impl<'a> Fold<ArrowExpr> for Hygiene<'a> {
    fn fold(&mut self, mut node: ArrowExpr) -> ArrowExpr {
        let mut folder = Hygiene {
            current: Scope::new(ScopeKind::Fn, Some(&self.current)),
            ident_type: IdentType::Ref,
        };

        folder.ident_type = IdentType::Binding;
        node.params = node.params.fold_with(&mut folder);

        folder.ident_type = IdentType::Ref;
        node.body = node.body.fold_with(&mut folder);

        folder.apply_ops(node)
    }
}

impl Fold<CatchClause> for Hygiene<'_> {
    fn fold(&mut self, c: CatchClause) -> CatchClause {
        let mut folder = Hygiene {
            current: Scope::new(ScopeKind::Fn, Some(&self.current)),
            ident_type: IdentType::Ref,
        };
        folder.ident_type = IdentType::Binding;
        let param = c.param.fold_with(&mut folder);
        folder.ident_type = IdentType::Ref;

        let body = c.body.fold_with(&mut folder);

        CatchClause { param, body, ..c }
    }
}
