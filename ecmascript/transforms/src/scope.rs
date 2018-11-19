use ast::*;
use std::{
    cell::{Cell, RefCell},
    collections::HashSet,
};
use swc_atoms::JsWord;
use swc_common::{Fold, FoldWith, Visit, VisitWith};

/// Contextual folder
pub trait Traverse {
    fn fold_var_decl(&mut self, _scope: &mut Scope, decl: VarDecl) -> VarDecl {
        decl
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
    pub used_refs: HashSet<JsWord>,

    /// All references declared in this scope
    pub declared_refs: HashSet<JsWord>,

    /// All children of the this scope
    pub children: Vec<Scope<'a>>,
}

impl<'a> Scope<'a> {
    pub fn analyze(module: Module) -> (Module, Scope<'a>) {
        struct Noop;
        impl Traverse for Noop {}

        let mut noop = Noop;
        let mut visitor = ScopeAnalyzer::new(&mut noop);

        let module = module.fold_with(&mut visitor);

        (module, visitor.current)
    }

    pub fn new(kind: ScopeKind, parent: Option<&'a Scope<'a>>) -> Self {
        Scope {
            parent,
            kind,
            used_super: Cell::new(false),
            used_this: Cell::new(false),
            used_refs: Default::default(),
            declared_refs: Default::default(),
            children: Default::default(),
        }
    }
}

struct ScopeAnalyzer<'a, 'b, T: Traverse> {
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
}

impl<'a, 'b, T: Traverse> Fold<BlockStmt> for ScopeAnalyzer<'a, 'b, T> {
    fn fold(&mut self, node: BlockStmt) -> BlockStmt {
        let mut analyzer = ScopeAnalyzer {
            // TODO
            current: Scope::new(ScopeKind::Block, None),
            visitor: self.visitor,
        };

        let node = node.fold_children(&mut analyzer);

        self.current.children.push(analyzer.current);

        node
    }
}

impl<'a, 'b, T: Traverse> ScopeAnalyzer<'a, 'b, T> {
    fn fold_fn(&mut self, ident: Option<Ident>, mut node: Function) -> Function {
        self.current.declared_refs.extend(ident.map(|i| i.sym));

        let mut analyzer = ScopeAnalyzer {
            // TODO
            current: Scope::new(ScopeKind::Fn, None),
            visitor: self.visitor,
        };

        node.params = node.params.fold_children(&mut analyzer);
        node.body = node.body.fold_children(&mut analyzer);

        self.current.children.push(analyzer.current);

        node
    }
}

impl<'a, 'b, T: Traverse> Fold<Pat> for ScopeAnalyzer<'a, 'b, T> {
    fn fold(&mut self, pat: Pat) -> Pat {
        match pat {
            Pat::Ident(ref ident) => {
                self.current.declared_refs.insert(ident.sym.clone());
            }
            _ => unimplemented!("Pattern other than ident"),
        }

        pat
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
        println!("node: {:?}\n{:?}", self.current, node);

        match node {
            Expr::Ident(ref ident) => {
                self.current.used_refs.insert(ident.sym.clone());
            }
            Expr::This(..) => {
                self.current.used_this.set(true);
            }
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

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn scope_analysis() {
        ::tests::Tester::run(|tester| {
            let module = tester.apply_transform(
                ::testing::DropSpan,
                "src.js",
                "function test_function(bar) { doge; { moon; } return 10; }".into(),
            )?;
            let (module, mut root) = Scope::analyze(module);

            assert_eq!(root.parent, None);
            assert_eq!(root.kind, ScopeKind::Fn);
            assert!(root.used_refs.is_empty());
            assert!(root.declared_refs.contains(&"test_function".into()));
            assert!(root.children.len() == 1);

            let mut test_function = root.children.pop().unwrap();

            // assert_eq!(test_function.parent, Some(root));
            assert_eq!(test_function.kind, ScopeKind::Fn);
            assert!(test_function.used_refs.contains(&"doge".into()));
            assert!(test_function.declared_refs.contains(&"bar".into()));

            let moon = test_function.children.pop().unwrap();

            // assert_eq!(moon.parent, Some(test_function));
            assert_eq!(moon.kind, ScopeKind::Block);
            assert!(moon.used_refs.contains(&"moon".into()));
            assert!(moon.declared_refs.is_empty());
            assert!(moon.children.is_empty());

            Ok(())
        });
    }
}
