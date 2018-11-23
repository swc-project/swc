use ast::*;
use crate::scope::{Operator, Scope, ScopeAnalyzer, ScopeOp, Traverse};
use swc_atoms::JsWord;
use swc_common::{Fold, FoldWith, Span, SyntaxContext};

pub struct Hygiene;

impl Hygiene {
    fn add_declared_ref(&self, scope: &mut Scope, ident: Ident) {
        if !scope.is_declared(&ident.sym) {
            // First symbol

            scope.declared_symbols.insert(ident.sym.clone());
            return;
        }

        // symbol conflicts
        let renamed = {
            debug_assert!(scope.is_declared(&ident.sym));

            let mut i = 0;
            loop {
                i += 1;
                let sym: JsWord = format!("{}{}", ident.sym, i).into();

                if !scope.is_declared(&sym) {
                    break sym;
                }
            }
        };

        scope
            .scope_of(&ident)
            .ops
            .borrow_mut()
            .push(ScopeOp::Rename {
                from: ident,
                to: renamed,
            });
    }
}

impl Traverse for Hygiene {
    fn fold_binding_ident(&mut self, scope: &mut Scope, ident: Ident) -> Ident {
        self.add_declared_ref(scope, ident.clone());
        ident
    }
}

pub fn hygiene() -> impl Fold<Module> {
    struct MarkClearer;
    impl Fold<Span> for MarkClearer {
        fn fold(&mut self, span: Span) -> Span {
            span.with_ctxt(SyntaxContext::empty())
        }
    }

    struct Folder;
    impl Fold<Module> for Folder {
        fn fold(&mut self, module: Module) -> Module {
            let mut hygiene = Hygiene;
            let mut analyzer = ScopeAnalyzer::new(&mut hygiene);
            let module = analyzer.fold(module);

            module.fold_with(&mut MarkClearer)
        }
    }

    Folder
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

            let module = hygiene().fold(module);

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

    #[test]
    fn hygiene_block_scoping() {
        ::tests::Tester::run(|tester| {
            let mark1 = Mark::fresh(Mark::root());
            let mark2 = Mark::fresh(Mark::root());

            let stmts = vec![
                tester
                    .parse_stmt("actual.js", "var foo = 1;")?
                    .fold_with(&mut marker(&[("foo", mark1)])),
                tester
                    .parse_stmt("actual.js", "{ let foo = 2; use(foo); }")?
                    .fold_with(&mut marker(&[("foo", mark2)])),
                tester
                    .parse_stmt("actual.js", "use(foo)")?
                    .fold_with(&mut marker(&[("foo", mark1)])),
            ];

            let module = Module {
                span: DUMMY_SP,
                body: stmts.into_iter().map(ModuleItem::Stmt).collect(),
            };

            let module = hygiene().fold(module);

            let actual = tester.print(&module);

            let expected = {
                let expected = tester.with_parser(
                    "expected.js",
                    "var foo = 1;
                        {
                            let foo1 = 2;
                            use(foo1);
                        }
                    use(foo);",
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
}
