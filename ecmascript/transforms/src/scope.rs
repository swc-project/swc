use ast::*;
use fnv::{FnvHashMap, FnvHashSet};
use std::cell::{Cell, RefCell};
use swc_atoms::JsWord;
use swc_common::{Fold, FoldWith, SyntaxContext};

/// Contextual folder
pub trait Traverse {
    fn fold_var_decl(&mut self, _scope: &mut Scope, decl: VarDecl) -> VarDecl {
        decl
    }
    fn fold_pat(&mut self, _scope: &mut Scope, pat: Pat) -> Pat {
        pat
    }
    fn fold_binding_ident(&mut self, _scope: &mut Scope, ident: Ident) -> Ident {
        ident
    }
}

#[derive(Debug, PartialEq, Eq)]
pub struct Scope<'a> {
    /// Parent scope of this scope
    pub parent: Option<&'a Scope<'a>>,

    /// Kind of the scope.
    pub kind: ScopeKind,

    /// Whether or not the `super` keyword was used
    pub used_super: Cell<bool>,

    /// Whether or not the `this` keyword was used
    pub used_this: Cell<bool>,

    /// All references used in this scope
    pub used_refs: FnvHashSet<Ident>,

    /// All references declared in this scope
    pub declared_refs: FnvHashSet<Ident>,

    pub declared_symbols: FnvHashMap<JsWord, SyntaxContext>,
    /* /// All children of the this scope
     * pub children: Vec<Scope<'a>>, */
    pub(crate) ops: RefCell<Vec<ScopeOp>>,
}

pub struct Operator<'a>(&'a [ScopeOp]);

impl<'a> Fold<Prop> for Operator<'a> {
    fn fold(&mut self, prop: Prop) -> Prop {
        match prop {
            Prop::Shorthand(i) => {
                // preserve key
                match self.rename_ident(i.clone()) {
                    Ok(renamed) => Prop::KeyValue(KeyValueProp {
                        key: PropName::Ident(Ident {
                            // clear mark
                            span: i.span.with_ctxt(SyntaxContext::empty()),
                            ..i
                        }),
                        value: box Expr::Ident(renamed),
                    }),
                    Err(i) => Prop::Shorthand(i),
                }
            }
            _ => prop.fold_children(self),
        }
    }
}

impl<'a> Operator<'a> {
    /// Returns `Ok(renamed_ident)` if ident should be renamed.
    fn rename_ident(&mut self, ident: Ident) -> Result<Ident, Ident> {
        for op in self.0 {
            match *op {
                ScopeOp::Rename { ref from, ref to }
                    if *from.sym == ident.sym && from.span.ctxt() == ident.span.ctxt() =>
                {
                    return Ok(Ident {
                        // Clear mark
                        span: ident.span.with_ctxt(SyntaxContext::empty()),
                        sym: to.clone(),
                    });
                }
                _ => {}
            }
        }
        Err(ident)
    }
}

impl<'a> Fold<Ident> for Operator<'a> {
    fn fold(&mut self, ident: Ident) -> Ident {
        match self.rename_ident(ident) {
            Ok(i) | Err(i) => i,
        }
    }
}

impl<'a> Scope<'a> {
    pub fn new(kind: ScopeKind, parent: Option<&'a Scope<'a>>) -> Self {
        Scope {
            parent,
            kind,
            used_super: Cell::new(false),
            used_this: Cell::new(false),
            used_refs: Default::default(),
            declared_refs: Default::default(),
            declared_symbols: Default::default(),
            // children: Default::default(),
            ops: Default::default(),
        }
    }

    pub fn scope_of(&self, ident: &Ident) -> &'a Scope {
        if self.declared_refs.contains(ident) {
            self
        } else {
            match self.parent {
                Some(ref parent) => parent.scope_of(ident),
                _ => self,
            }
        }
    }

    pub(crate) fn is_declared(&self, sym: &JsWord) -> bool {
        if self.declared_symbols.contains_key(sym) {
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

#[derive(Debug, PartialEq, Eq)]
pub(crate) enum ScopeOp {
    Rename { from: Ident, to: JsWord },
}

#[doc(hidden)]
pub struct ScopeAnalyzer<'a, 'b, T: Traverse> {
    current: Scope<'a>,
    visitor: &'b mut T,
}
impl<'a, 'b, T: Traverse> ScopeAnalyzer<'a, 'b, T> {
    pub fn new(visitor: &'b mut T) -> Self {
        ScopeAnalyzer {
            current: Scope::new(ScopeKind::Fn, None),
            visitor,
        }
    }

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

impl<'a, 'b, T: Traverse> Fold<Module> for ScopeAnalyzer<'a, 'b, T> {
    fn fold(&mut self, module: Module) -> Module {
        let module = module.fold_children(self);

        self.apply_ops(module)
    }
}

impl<'a, 'b, T: Traverse> Fold<TryStmt> for ScopeAnalyzer<'a, 'b, T> {
    fn fold(&mut self, node: TryStmt) -> TryStmt {
        TryStmt {
            span: node.span,
            block: node.block.fold_children(self),
            handler: node.handler.fold_with(self),
            finalizer: node.finalizer.fold_children(self),
        }
    }
}

impl<'a, 'b, T: Traverse> Fold<BlockStmt> for ScopeAnalyzer<'a, 'b, T> {
    fn fold(&mut self, node: BlockStmt) -> BlockStmt {
        let node = {
            let mut analyzer = ScopeAnalyzer {
                current: Scope::new(ScopeKind::Block, Some(&self.current)),
                visitor: self.visitor,
            };

            node.fold_children(&mut analyzer)
        };

        self.apply_ops(node)
    }
}

impl<'a, 'b, T: Traverse> ScopeAnalyzer<'a, 'b, T> {
    fn fold_fn(&mut self, ident: Option<Ident>, mut node: Function) -> Function {
        match ident {
            Some(ident) => {
                self.visitor.fold_binding_ident(&mut self.current, ident);
            }
            _ => {}
        }

        let mut analyzer = ScopeAnalyzer {
            current: Scope::new(ScopeKind::Fn, Some(&self.current)),
            visitor: self.visitor,
        };

        node.params = node.params.fold_children(&mut analyzer);
        node.body = node.body.fold_children(&mut analyzer);

        // self.current.children.push(analyzer.current);

        self.apply_ops(node)
    }
}

impl<'a, 'b, T: Traverse> Fold<Pat> for ScopeAnalyzer<'a, 'b, T> {
    fn fold(&mut self, pat: Pat) -> Pat {
        let pat = self.visitor.fold_pat(&mut self.current, pat);

        match pat {
            Pat::Ident(ident) => {
                Pat::Ident(self.visitor.fold_binding_ident(&mut self.current, ident))
            }
            // TODO
            _ => pat.fold_children(self),
        }
    }
}

impl<'a, 'b, T: Traverse> Fold<FnExpr> for ScopeAnalyzer<'a, 'b, T> {
    fn fold(&mut self, mut node: FnExpr) -> FnExpr {
        node.function = self.fold_fn(node.ident.clone(), node.function);

        node
    }
}

impl<'a, 'b, T: Traverse> Fold<FnDecl> for ScopeAnalyzer<'a, 'b, T> {
    fn fold(&mut self, mut node: FnDecl) -> FnDecl {
        node.function = self.fold_fn(Some(node.ident.clone()), node.function);

        node
    }
}

impl<'a, 'b, T: Traverse> Fold<VarDecl> for ScopeAnalyzer<'a, 'b, T> {
    fn fold(&mut self, node: VarDecl) -> VarDecl {
        let node = node.fold_children(self);

        let node = self.visitor.fold_var_decl(&mut self.current, node);

        node
    }
}

impl<'a, 'b, T: Traverse> Fold<Expr> for ScopeAnalyzer<'a, 'b, T> {
    fn fold(&mut self, node: Expr) -> Expr {
        match node {
            Expr::Ident(ref ident) => {
                self.current.used_refs.insert(ident.clone());
            }
            Expr::This(..) => {
                self.current.used_this.set(true);
            }

            Expr::Fn(..) | Expr::Call(..) => return node.fold_children(self),
            _ => {}
        }

        node
    }
}

impl<'a, 'b, T: Traverse> Fold<ExprOrSuper> for ScopeAnalyzer<'a, 'b, T> {
    fn fold(&mut self, node: ExprOrSuper) -> ExprOrSuper {
        match node {
            ExprOrSuper::Super(..) => {
                self.current.used_super.set(true);
                node
            }
            _ => node.fold_children(self),
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ScopeKind {
    Block,
    Fn,
}
