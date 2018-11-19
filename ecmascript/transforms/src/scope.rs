use ast::*;
use std::{
    cell::{Cell, RefCell},
    collections::HashSet,
};
use swc_atoms::JsWord;
use swc_common::{Fold, FoldWith, Visit, VisitWith};

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
    pub fn analyze<'ast>(module: &Module) -> Scope<'ast> {
        let mut visitor = ScopeAnalyzer::new();

        let module = module.visit_with(&mut visitor);

        visitor.current
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

struct ScopeAnalyzer<'a> {
    pub current: Scope<'a>,
}

impl<'ast> ScopeAnalyzer<'ast> {
    pub fn new() -> Self {
        let current = Scope::new(ScopeKind::Fn, None);

        ScopeAnalyzer { current }
    }
}

impl<'a> Visit<BlockStmt> for ScopeAnalyzer<'a> {
    fn visit(&mut self, node: &BlockStmt) {
        let mut analyzer = ScopeAnalyzer {
            // TODO
            current: Scope::new(ScopeKind::Block, None),
        };

        node.visit_children(&mut analyzer);

        self.current.children.push(analyzer.current);
    }
}

impl<'a> ScopeAnalyzer<'a> {
    fn visit_fn(&mut self, ident: Option<Ident>, node: &Function) {
        self.current.declared_refs.extend(ident.map(|i| i.sym));

        let mut analyzer = ScopeAnalyzer {
            // TODO
            current: Scope::new(ScopeKind::Fn, None),
        };

        node.params.visit_children(&mut analyzer);
        node.body.visit_children(&mut analyzer);

        self.current.children.push(analyzer.current);
    }
}

impl<'a> Visit<Pat> for ScopeAnalyzer<'a> {
    fn visit(&mut self, pat: &Pat) {
        match *pat {
            Pat::Ident(ref ident) => {
                self.current.declared_refs.insert(ident.sym.clone());
            }
            _ => unimplemented!("Pattern other than ident"),
        }
    }
}

impl<'a> Visit<FnExpr> for ScopeAnalyzer<'a> {
    fn visit(&mut self, node: &FnExpr) {
        self.visit_fn(node.ident.clone(), &node.function);
    }
}

impl<'a> Visit<FnDecl> for ScopeAnalyzer<'a> {
    fn visit(&mut self, node: &FnDecl) {
        self.visit_fn(Some(node.ident.clone()), &node.function);
    }
}

impl<'a> Visit<VarDecl> for ScopeAnalyzer<'a> {
    fn visit(&mut self, node: &VarDecl) {
        node.visit_children(self);
        // TODO
    }
}

impl<'a> Visit<Expr> for ScopeAnalyzer<'a> {
    fn visit(&mut self, node: &Expr) {
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
    }
}

impl<'a> Visit<ExprOrSuper> for ScopeAnalyzer<'a> {
    fn visit(&mut self, node: &ExprOrSuper) {
        match node {
            ExprOrSuper::Super(..) => self.current.used_super.set(true),
            _ => node.visit_children(self),
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
            let (mut root) = Scope::analyze(&module);

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
