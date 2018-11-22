use ast::*;
use std::{
    cell::{Cell, RefCell},
    collections::HashSet,
};
use swc_atoms::JsWord;
use swc_common::{Fold, FoldWith, Span, SyntaxContext};

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
    pub used_refs: HashSet<Ident>,

    /// All references declared in this scope
    pub declared_refs: HashSet<Ident>,

    pub declared_symbols: HashSet<JsWord>,
    /* /// All children of the this scope
     * pub children: Vec<Scope<'a>>, */
    ops: RefCell<Vec<ScopeOp>>,
}

pub fn hygiene() -> impl Fold<Module> {
    struct MarkClearer;
    impl Fold<Span> for Folder {
        fn fold(&mut self, span: Span) -> Span {
            span.with_ctxt(SyntaxContext::empty())
        }
    }

    struct Folder;
    impl Fold<Module> for Folder {
        fn fold(&mut self, module: Module) -> Module {
            let module = apply_hygiene(module);
            module.fold_with(&mut MarkClearer)
        }
    }

    Folder
}

#[doc(hidden)]
pub struct Hygiene;
impl Traverse for Hygiene {}

pub struct Operator<'a>(&'a [ScopeOp]);

impl<'a> Fold<Ident> for Operator<'a> {
    fn fold(&mut self, ident: Ident) -> Ident {
        for op in self.0 {
            match *op {
                ScopeOp::Rename { ref from, ref to }
                    if *from.sym == ident.sym && from.span.ctxt() == ident.span.ctxt() =>
                {
                    return Ident {
                        // TODO: Clear mark
                        span: ident.span,
                        sym: to.clone(),
                    };
                }
                _ => {}
            }
        }

        ident
    }
}

pub fn apply_hygiene<T>(node: T) -> T
where
    for<'a, 'b> ScopeAnalyzer<'a, 'b, Hygiene>: Fold<T>,
    T: for<'o> FoldWith<Operator<'o>>,
{
    let mut hygiene = Hygiene;
    let mut analyzer = ScopeAnalyzer::new(&mut hygiene);
    let node = analyzer.fold(node);
    analyzer.apply_ops(node)
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

    fn scope_of(&self, ident: &Ident) -> &'a Scope {
        if self.declared_refs.contains(ident) {
            self
        } else {
            match self.parent {
                Some(ref parent) => parent.scope_of(ident),
                _ => self,
            }
        }
    }

    fn is_declared(&self, sym: &JsWord) -> bool {
        if self.declared_symbols.contains(sym) {
            return true;
        }
        match self.parent {
            Some(parent) => parent.is_declared(sym),
            _ => false,
        }
    }

    fn add_declared_ref(&mut self, ident: Ident) {
        if self.declared_symbols.insert(ident.sym.clone()) {
            // First symbol
            return;
        }

        // symbol conflicts
        let renamed = {
            debug_assert!(self.is_declared(&ident.sym));

            let mut i = 0;
            loop {
                i += 1;
                let sym: JsWord = format!("{}{}", ident.sym, i).into();

                if !self.is_declared(&sym) {
                    break sym;
                }
            }
        };

        self.scope_of(&ident)
            .ops
            .borrow_mut()
            .push(ScopeOp::Rename {
                from: ident,
                to: renamed,
            });
    }
}

#[derive(Debug, PartialEq, Eq)]
enum ScopeOp {
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
            Some(ident) => self.current.add_declared_ref(ident),
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
        match pat {
            Pat::Ident(ref ident) => {
                self.current.add_declared_ref(ident.clone());
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
        match node {
            Expr::Ident(ref ident) => {
                self.current.used_refs.insert(ident.clone());
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
    use std::collections::HashMap;
    use swc_common::{hygiene::*, Fold, Span, DUMMY_SP};

    struct Marker {
        map: HashMap<JsWord, Mark>,
    }

    fn marker(markers: &[(&str, Mark)]) -> Marker {
        Marker {
            map: markers.iter().map(|(k, v)| ((*k).into(), *v)).collect(),
        }
    }

    impl Fold<Ident> for Marker {
        fn fold(&mut self, mut ident: Ident) -> Ident {
            if let Some(mark) = self.map.get(&ident.sym) {
                ident.span = ident.span.apply_mark(*mark);
            }

            ident
        }
    }

    #[test]
    fn hygiene_simple() {
        ::tests::Tester::run(|tester| {
            let mark1 = Mark::fresh(Mark::root());
            let mark2 = Mark::fresh(Mark::root());

            let stmts = vec![
                tester
                    .parse_stmt("actual.js", "var foo = 1;")?
                    .fold_with(&mut marker(&[("foo", mark1)])),
                tester
                    .parse_stmt("actual.js", "var foo = 2;")?
                    .fold_with(&mut marker(&[("foo", mark2)])),
                tester
                    .parse_stmt("actual.js", "use(foo)")?
                    .fold_with(&mut marker(&[("foo", mark1)])),
            ];

            let module = Module {
                span: DUMMY_SP,
                body: stmts.into_iter().map(ModuleItem::Stmt).collect(),
            };

            let module = apply_hygiene(module);

            let actual = tester.print(&module);

            let expected = {
                let expected = tester.with_parser(
                    "expected.js",
                    "var foo = 1;\nvar foo1 = 2;\nuse(foo);",
                    |p| p.parse_module(),
                )?;
                tester.print(&expected)
            };

            if actual != expected {
                panic!(
                    "\n>>>>> Actual <<<<<\n{}\n>>>>> Expected <<<<<\n{}",
                    actual, expected
                );
            }

            Ok(())
        });
    }

    // #[test]
    // fn scope_analysis() {
    //     ::tests::Tester::run(|tester| {
    //         let (module, mut root) = Scope::analyze(module);

    //         assert_eq!(root.parent, None);
    //         assert_eq!(root.kind, ScopeKind::Fn);
    //         assert!(root.used_refs.is_empty());
    //         assert!(root.declared_refs.contains(&"test_function".into()));
    //         // assert!(root.children.len() == 1);

    //         // let mut test_function = root.children.pop().unwrap();

    //         // // assert_eq!(test_function.parent, Some(root));
    //         // assert_eq!(test_function.kind, ScopeKind::Fn);
    //         // assert!(test_function.used_refs.contains(&"doge".into()));
    //         // assert!(test_function.declared_refs.contains(&"bar".into()));

    //         // let moon = test_function.children.pop().unwrap();

    //         // // assert_eq!(moon.parent, Some(test_function));
    //         // assert_eq!(moon.kind, ScopeKind::Block);
    //         // assert!(moon.used_refs.contains(&"moon".into()));
    //         // assert!(moon.declared_refs.is_empty());
    //         // assert!(moon.children.is_empty());

    //         Ok(())
    //     });
    // }
}
