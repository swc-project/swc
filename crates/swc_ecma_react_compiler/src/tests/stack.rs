use std::path::PathBuf;

use swc_atoms::Atom;
use swc_ecma_ast::{Callee, Decl, Expr, MemberProp, ModuleDecl, ModuleItem, OptChainBase, Program};
use swc_ecma_parser::{parse_file_as_program, EsSyntax, Syntax};
use testing::run_test2;

use crate::{
    convert_ast::convert_program, convert_ast_reverse::convert_program_to_swc,
    stack::with_compiler_stack,
};

#[derive(Debug, PartialEq, Eq)]
enum ChainLink {
    Call { optional: bool },
    Member { optional: bool, name: Atom },
    Root(Atom),
}

/// Compare the complete chain without recursively cloning, formatting, or
/// comparing either AST, which would obscure the converters' own stack usage.
fn chain_shape(program: &Program) -> Vec<ChainLink> {
    let Program::Module(module) = program else {
        panic!("fixture should remain a module");
    };
    let ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(export)) = &module.body[0] else {
        panic!("fixture should export its value");
    };
    let Decl::Var(decl) = &export.decl else {
        panic!("fixture should export a variable");
    };
    let mut expr = decl.decls[0].init.as_deref().unwrap();
    let mut shape = Vec::new();
    loop {
        match expr {
            Expr::Call(call) => {
                assert!(call.args.is_empty());
                shape.push(ChainLink::Call { optional: false });
                let Callee::Expr(callee) = &call.callee else {
                    panic!("expected expression callee");
                };
                expr = callee;
            }
            Expr::Member(member) => {
                let MemberProp::Ident(property) = &member.prop else {
                    panic!("expected static member");
                };
                shape.push(ChainLink::Member {
                    optional: false,
                    name: property.sym.clone(),
                });
                expr = &member.obj;
            }
            Expr::OptChain(chain) => match &*chain.base {
                OptChainBase::Call(call) => {
                    assert!(call.args.is_empty());
                    shape.push(ChainLink::Call {
                        optional: chain.optional,
                    });
                    expr = &call.callee;
                }
                OptChainBase::Member(member) => {
                    let MemberProp::Ident(property) = &member.prop else {
                        panic!("expected static member");
                    };
                    shape.push(ChainLink::Member {
                        optional: chain.optional,
                        name: property.sym.clone(),
                    });
                    expr = &member.obj;
                }
            },
            Expr::Ident(root) => {
                shape.push(ChainLink::Root(root.sym.clone()));
                break;
            }
            _ => panic!("unexpected expression in fixture chain"),
        }
    }
    shape
}

#[testing::fixture("tests/fixture/skip-pass/*")]
fn long_chain_round_trip(input: PathBuf) {
    std::thread::Builder::new()
        .stack_size(2 * 1024 * 1024)
        .spawn(move || {
            run_test2(false, |cm, _| {
                let fm = cm.load_file(&input).unwrap();
                let mut errors = Vec::new();
                let program = parse_file_as_program(
                    &fm,
                    Syntax::Es(EsSyntax {
                        jsx: true,
                        ..Default::default()
                    }),
                    Default::default(),
                    None,
                    &mut errors,
                )
                .unwrap();
                assert!(errors.is_empty());
                let expected = chain_shape(&program);
                assert_eq!(expected.len(), 2 * 1000 + 1);

                // Each converter starts on the 2 MiB worker stack, rather than
                // inheriting transform's larger budget for the upstream compiler.
                let converted = convert_program(&program, &fm.src, None);
                let round_tripped =
                    convert_program_to_swc(&converted.file, converted.preserved_ast);
                assert_eq!(chain_shape(&round_tripped), expected);

                // The upstream AST's recursive destructor also needs its usual
                // stack budget; it is not part of expression conversion.
                with_compiler_stack(|| drop(converted.file));
                Ok(())
            })
            .unwrap();
        })
        .expect("spawn conversion worker")
        .join()
        .expect("conversion worker panicked");
}
