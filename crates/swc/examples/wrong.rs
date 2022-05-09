use swc::{self};
use swc_atoms::JsWord;
use swc_common::{
    chain, comments::SingleThreadedComments, sync::Lrc, FileName, Globals, Mark, SourceMap,
    SyntaxContext, DUMMY_SP,
};
use swc_ecma_ast::{Ident, Module};
use swc_ecma_codegen::{text_writer::JsWriter, Config, Emitter};
use swc_ecma_parser::{lexer::Lexer, EsConfig, PResult, Parser, StringInput, Syntax, TsConfig};
use swc_ecma_preset_env::{preset_env, BrowserData, Mode, Targets, Version};
use swc_ecma_transforms::{
    compat::reserved_words::reserved_words,
    fixer,
    fixer::paren_remover,
    helpers, hygiene,
    optimization::simplify::{dead_branch_remover, expr_simplifier},
    react, resolver,
};
use swc_ecma_visit::{Fold, FoldWith};

fn main() {
    let cm = Lrc::<SourceMap>::default();
    let src = r#"
let x;
class B {
    get [Symbol.toStringTag]() {
        return x;
    }
}      
"#;
    let (module, comments) = parse(src, "test.js", &cm).unwrap();

    swc_common::GLOBALS.set(&Globals::new(), || {
        helpers::HELPERS.set(&helpers::Helpers::default(), || {
            let unresolved_mark = Mark::fresh(Mark::root());
            let top_level_mark = Mark::fresh(Mark::root());
            let module = module.fold_with(&mut resolver(unresolved_mark, top_level_mark, false));

            // let transform = &mut react::react(
            //     cm.clone(),
            //     Some(&comments),
            //     react::Options {
            //         development: true,
            //         refresh: Some(Default::default()),
            //         ..Default::default()
            //     },
            //     global_mark,
            // );
            // let module = module.fold_with(&mut chain!(
            //     paren_remover(Some(&comments)),
            //     expr_simplifier(unresolved_mark, Default::default()),
            //     dead_branch_remover(unresolved_mark)
            // ));
            let module = module.fold_with(&mut preset_env(
                top_level_mark,
                Some(&comments),
                swc_ecma_preset_env::Config {
                    targets: Some(Targets::Versions(BrowserData {
                        chrome: Some(Version {
                            major: 60,
                            minor: 0,
                            patch: 0,
                        }),
                        ..Default::default()
                    })),
                    bugfixes: true,
                    ..Default::default()
                },
                Default::default(),
            ));

            // let module = module.fold_with(&mut chain!(
            //     hygiene(),
            //     resolver(unresolved_mark, top_level_mark, false)
            // ));
            let module = module.fold_with(&mut hygiene());
            let module = module.fold_with(&mut resolver(unresolved_mark, top_level_mark, false));

            let module = module.fold_with(&mut ShowSyntaxContext {
                top_level_mark,
                unresolved_mark,
            });

            let module = module.fold_with(&mut chain!(
                reserved_words(),
                hygiene(),
                fixer(Some(&comments))
            ));

            let code = emit(&module, &comments, cm);
            println!("{}", code);
        });
    });
}

struct ShowSyntaxContext {
    top_level_mark: Mark,
    unresolved_mark: Mark,
}
impl Fold for ShowSyntaxContext {
    fn fold_ident(&mut self, node: Ident) -> Ident {
        let new_name: JsWord = format!(
            "{}_{}{}",
            node.sym,
            node.span.ctxt().as_u32(),
            if node.span.has_mark(self.top_level_mark) {
                "_top"
            } else {
                ""
            }
        )
        .into();
        Ident::new(new_name, node.span)
    }
}

fn parse(
    code: &str,
    filename: &str,
    cm: &Lrc<SourceMap>,
) -> PResult<(Module, SingleThreadedComments)> {
    let source_file = cm.new_source_file(FileName::Real(filename.into()), code.into());
    let comments = SingleThreadedComments::default();

    let lexer = Lexer::new(
        Syntax::Es(EsConfig {
            jsx: true,
            ..Default::default()
        }),
        // Syntax::Typescript(TsConfig {
        //     tsx: true,
        //     ..Default::default()
        // }),
        Default::default(),
        StringInput::from(&*source_file),
        Some(&comments),
    );
    let mut parser = Parser::new_from(lexer);
    match parser.parse_module() {
        Err(err) => Err(err),
        Ok(module) => Ok((module, comments)),
    }
}

fn emit(module: &Module, comments: &SingleThreadedComments, cm: Lrc<SourceMap>) -> String {
    let mut buf = vec![];
    {
        let writer = Box::new(JsWriter::new(cm.clone(), "\n", &mut buf, None));
        let config = Config { minify: false };
        let mut emitter = Emitter {
            cfg: config,
            comments: Some(&comments),
            cm,
            wr: writer,
        };
        emitter.emit_module(&module).unwrap();
    }

    String::from_utf8(buf).unwrap()
}
