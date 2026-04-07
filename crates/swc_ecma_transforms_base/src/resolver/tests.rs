use swc_atoms::atom;
use swc_common::{FileName, Globals, GLOBALS};
use swc_ecma_ast::NodeId;
use swc_ecma_parser::{Parser, StringInput, Syntax, TsSyntax};
use swc_ecma_visit::{Visit, VisitWith};

use super::*;
use crate::{hygiene::Config, scope::ScopeData};

// struct TsHygiene {
//     top_level_mark: Mark,
// }

// impl VisitMut for TsHygiene {
//     fn visit_mut_ident(&mut self, i: &mut Ident) {
//         if SyntaxContext::empty().apply_mark(self.top_level_mark) ==
// i.ctxt {             println!("ts_hygiene: {} is top-level", i.sym);
//             return;
//         }

//         let ctxt = format!("{:?}", i.ctxt).replace("#", "");
//         i.sym = format!("{}__{}", i.sym, ctxt).into();
//         i.span = i.span.with_ctxt(SyntaxContext::empty());
//     }

//     fn visit_mut_member_expr(&mut self, n: &mut MemberExpr) {
//         n.obj.visit_mut_with(self);
//         if n.computed {
//             n.prop.visit_mut_with(self);
//         }
//     }

//     fn visit_mut_prop_name(&mut self, n: &mut PropName) {
//         match n {
//             PropName::Computed(n) => {
//                 n.visit_mut_with(self);
//             }
//             _ => {}
//         }
//     }

//     fn visit_mut_ts_qualified_name(&mut self, q: &mut TsQualifiedName) {
//         q.left.visit_mut_with(self);
//     }
// }

fn run_test_with_config<F, V>(
    syntax: Syntax,
    tr: F,
    src: &str,
    to: &str,
    config: impl FnOnce() -> crate::hygiene::Config,
) where
    F: FnOnce() -> V,
    V: Pass,
{
    crate::tests::test_transform(syntax, |_| tr(), src, to, true, config);
}

fn parse_program(syntax: Syntax, src: &str) -> Program {
    ::testing::run_test(false, |cm, handler| {
        let fm = cm.new_source_file(
            FileName::Custom("resolver-scope-test.js".into()).into(),
            src.to_string(),
        );

        let mut parser = Parser::new(syntax, StringInput::from(&*fm), None);
        let program = parser
            .parse_program()
            .map_err(|err| err.into_diagnostic(handler).emit())?;

        for err in parser.take_errors() {
            err.into_diagnostic(handler).emit();
        }

        Ok(program)
    })
    .unwrap()
}

fn analyze_scope_data(program: &Program, typescript: bool) -> ScopeData {
    let globals = Globals::new();
    GLOBALS.set(&globals, || ScopeData::analyze(program, typescript))
}

#[derive(Default)]
struct IdentCollector {
    bindings: Vec<(String, NodeId)>,
    value_refs: Vec<(String, NodeId)>,
    type_refs: Vec<(String, NodeId)>,
    in_type: bool,
}

impl IdentCollector {
    fn binding_ids(&self, sym: &str) -> Vec<NodeId> {
        self.bindings
            .iter()
            .filter_map(|(name, node_id)| (name == sym).then_some(*node_id))
            .collect()
    }

    fn value_ref_ids(&self, sym: &str) -> Vec<NodeId> {
        self.value_refs
            .iter()
            .filter_map(|(name, node_id)| (name == sym).then_some(*node_id))
            .collect()
    }

    fn type_ref_ids(&self, sym: &str) -> Vec<NodeId> {
        self.type_refs
            .iter()
            .filter_map(|(name, node_id)| (name == sym).then_some(*node_id))
            .collect()
    }

    fn record_binding(&mut self, ident: &Ident) {
        self.bindings.push((ident.sym.to_string(), ident.node_id));
    }
}

impl Visit for IdentCollector {
    fn visit_binding_ident(&mut self, node: &BindingIdent) {
        self.record_binding(&node.id);
        node.type_ann.visit_with(self);
    }

    fn visit_class_decl(&mut self, node: &ClassDecl) {
        self.record_binding(&node.ident);
        node.class.visit_with(self);
    }

    fn visit_fn_decl(&mut self, node: &FnDecl) {
        self.record_binding(&node.ident);
        node.function.visit_with(self);
    }

    fn visit_ident(&mut self, node: &Ident) {
        let refs = if self.in_type {
            &mut self.type_refs
        } else {
            &mut self.value_refs
        };

        refs.push((node.sym.to_string(), node.node_id));
    }

    fn visit_import_default_specifier(&mut self, node: &ImportDefaultSpecifier) {
        self.record_binding(&node.local);
    }

    fn visit_import_named_specifier(&mut self, node: &ImportNamedSpecifier) {
        self.record_binding(&node.local);
    }

    fn visit_import_star_as_specifier(&mut self, node: &ImportStarAsSpecifier) {
        self.record_binding(&node.local);
    }

    fn visit_ts_type(&mut self, node: &TsType) {
        let old_in_type = self.in_type;
        self.in_type = true;
        node.visit_children_with(self);
        self.in_type = old_in_type;
    }
}

fn collect_idents(program: &Program) -> IdentCollector {
    let mut collector = IdentCollector::default();
    program.visit_with(&mut collector);
    collector
}

fn only_node_id(ids: Vec<NodeId>) -> NodeId {
    match &ids[..] {
        [node_id] => *node_id,
        _ => panic!("expected exactly one node id, got {ids:?}"),
    }
}

#[test]
fn test_mark_for() {
    ::testing::run_test(false, |_, _| {
        let mark1 = Mark::fresh(Mark::root());
        let mark2 = Mark::fresh(mark1);
        let mark3 = Mark::fresh(mark2);
        let mark4 = Mark::fresh(mark3);

        let folder1 = Resolver::new(
            Scope::new(ScopeKind::Block, mark1, NodeId::DUMMY, None),
            InnerConfig {
                handle_types: true,
                unresolved_mark: Mark::fresh(Mark::root()),
                top_level_mark: mark1,
            },
        );
        let mut folder2 = Resolver::new(
            Scope::new(
                ScopeKind::Block,
                mark2,
                NodeId::DUMMY,
                Some(&folder1.current),
            ),
            InnerConfig {
                handle_types: true,
                unresolved_mark: Mark::fresh(Mark::root()),
                top_level_mark: mark2,
            },
        );
        folder2
            .current
            .declared_symbols
            .insert(atom!("foo"), DeclKind::Var);

        let mut folder3 = Resolver::new(
            Scope::new(
                ScopeKind::Block,
                mark3,
                NodeId::DUMMY,
                Some(&folder2.current),
            ),
            InnerConfig {
                handle_types: true,
                unresolved_mark: Mark::fresh(Mark::root()),
                top_level_mark: mark3,
            },
        );
        folder3
            .current
            .declared_symbols
            .insert(atom!("bar"), DeclKind::Var);
        assert_eq!(folder3.mark_for_ref(&atom!("bar")), Some(mark3));

        let mut folder4 = Resolver::new(
            Scope::new(
                ScopeKind::Block,
                mark4,
                NodeId::DUMMY,
                Some(&folder3.current),
            ),
            InnerConfig {
                handle_types: true,
                unresolved_mark: Mark::fresh(Mark::root()),
                top_level_mark: mark4,
            },
        );
        folder4
            .current
            .declared_symbols
            .insert(atom!("foo"), DeclKind::Var);

        assert_eq!(folder4.mark_for_ref(&atom!("foo")), Some(mark4));
        assert_eq!(folder4.mark_for_ref(&atom!("bar")), Some(mark3));
        Ok(())
    })
    .unwrap();
}

#[test]
fn scope_data_tracks_shadowing_and_scope_hierarchy() {
    let program = parse_program(Syntax::Es(Default::default()), "let a; { let a; a; } a;");
    let scope_data = analyze_scope_data(&program, false);
    let ids = collect_idents(&program);

    let binding_ids = ids.binding_ids("a");
    assert_eq!(binding_ids.len(), 2);
    let inner_ref = only_node_id(vec![ids.value_ref_ids("a")[0]]);
    let outer_ref = only_node_id(vec![ids.value_ref_ids("a")[1]]);

    assert_eq!(
        scope_data.canonical_decl_for_decl(binding_ids[0]),
        Some(binding_ids[0])
    );
    assert_eq!(
        scope_data.canonical_decl_for_decl(binding_ids[1]),
        Some(binding_ids[1])
    );
    assert_eq!(
        scope_data.canonical_decl_for_ref(inner_ref),
        Some(binding_ids[1])
    );
    assert_eq!(
        scope_data.canonical_decl_for_ref(outer_ref),
        Some(binding_ids[0])
    );

    let (script_id, block_id) = match &program {
        Program::Script(script) => match &script.body[1] {
            Stmt::Block(block) => (script.node_id, block.node_id),
            other => panic!("expected block statement, got {other:?}"),
        },
        other => panic!("expected script program, got {other:?}"),
    };

    assert_eq!(scope_data.scope_kind.get(&script_id), Some(&ScopeKind::Fn));
    assert_eq!(
        scope_data.scope_kind.get(&block_id),
        Some(&ScopeKind::Block)
    );
    assert_eq!(scope_data.scope_parent.get(&block_id), Some(&script_id));
}

#[test]
fn scope_data_canonicalizes_duplicate_var_decls() {
    let program = parse_program(Syntax::Es(Default::default()), "var a; var a; a;");
    let scope_data = analyze_scope_data(&program, false);
    let ids = collect_idents(&program);

    let binding_ids = ids.binding_ids("a");
    let ref_id = only_node_id(ids.value_ref_ids("a"));

    assert_eq!(binding_ids.len(), 2);
    assert_eq!(
        scope_data.canonical_decl_for_decl(binding_ids[0]),
        Some(binding_ids[0])
    );
    assert_eq!(
        scope_data.canonical_decl_for_decl(binding_ids[1]),
        Some(binding_ids[0])
    );
    assert_eq!(
        scope_data.canonical_decl_for_ref(ref_id),
        Some(binding_ids[0])
    );
    assert_eq!(
        scope_data.decl_kind.get(&binding_ids[0]),
        Some(&DeclKind::Var)
    );
}

#[test]
fn scope_data_tracks_import_bindings_in_type_and_value_positions() {
    let program = parse_program(
        Syntax::Typescript(TsSyntax {
            ..Default::default()
        }),
        "import { Foo } from 'foo'; let value: Foo; Foo;",
    );
    let scope_data = analyze_scope_data(&program, true);
    let ids = collect_idents(&program);

    let import_binding = only_node_id(ids.binding_ids("Foo"));
    let type_ref = only_node_id(ids.type_ref_ids("Foo"));
    let value_ref = only_node_id(ids.value_ref_ids("Foo"));

    assert_eq!(
        scope_data.canonical_decl_for_decl(import_binding),
        Some(import_binding)
    );
    assert_eq!(
        scope_data.canonical_decl_for_ref(type_ref),
        Some(import_binding)
    );
    assert_eq!(
        scope_data.canonical_decl_for_ref(value_ref),
        Some(import_binding)
    );
    assert_eq!(
        scope_data.decl_kind.get(&import_binding),
        Some(&DeclKind::Lexical)
    );
}

#[test]
fn scope_data_tracks_catch_param_refs() {
    let program = parse_program(
        Syntax::Es(Default::default()),
        "try { throw 1; } catch (e) { e; }",
    );
    let scope_data = analyze_scope_data(&program, false);
    let ids = collect_idents(&program);

    let catch_binding = only_node_id(ids.binding_ids("e"));
    let catch_ref = only_node_id(ids.value_ref_ids("e"));

    assert_eq!(
        scope_data.canonical_decl_for_decl(catch_binding),
        Some(catch_binding)
    );
    assert_eq!(
        scope_data.canonical_decl_for_ref(catch_ref),
        Some(catch_binding)
    );
}

#[test]
fn issue_1279_1() {
    run_test_with_config(
        Default::default(),
        || resolver(Mark::new(), Mark::new(), false),
        "class Foo {
            static f = 1;
            static g = Foo.f;
        }",
        "
        let Foo = class Foo {
            static f = 1;
            static g = Foo.f;
        };
        ",
        || Config {
            keep_class_names: true,
            ..Default::default()
        },
    );
}

#[test]
fn issue_1279_2() {
    run_test_with_config(
        Default::default(),
        || resolver(Mark::new(), Mark::new(), false),
        "class Foo {
            static f = 1;
            static g = Foo.f;
            method() {
                class Foo {
                    static nested = 1;
                    static nested2 = Foo.nested;
                }
            }
        }",
        "
        let Foo = class Foo {
            static f = 1;
            static g = Foo.f;
            method() {
                let Foo = class Foo {
                    static nested = 1;
                    static nested2 = Foo.nested;
                };
            }
        };
        ",
        || Config {
            keep_class_names: true,
            ..Default::default()
        },
    );
}

#[test]
fn issue_2516() {
    run_test_with_config(
        Default::default(),
        || resolver(Mark::new(), Mark::new(), false),
        "class A {
            static A = class {}
          }",
        "
        let A = class A {
            static A = class {}
          };
        ",
        || Config {
            keep_class_names: true,
            ..Default::default()
        },
    );
}
