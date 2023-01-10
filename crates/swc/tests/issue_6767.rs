use swc_atoms::JsWord;
use swc_common::{
    chain,
    comments::SingleThreadedComments,
    errors::{DiagnosticBuilder, Emitter},
    source_map::SourceMapGenConfig,
    sync::Lrc,
    FileName, Mark, SourceMap, DUMMY_SP,
};
use swc_ecma_ast::{Ident, ImportDecl, Module, ModuleDecl, ModuleItem};
use swc_ecma_codegen::{text_writer::JsWriter, Config};
use swc_ecma_parser::{lexer::Lexer, PResult, Parser, StringInput, Syntax, TsConfig};
use swc_ecma_transforms::{
    compat::reserved_words::reserved_words, fixer, helpers, hygiene, resolver,
};
use swc_ecma_visit::{Fold, FoldWith};

#[derive(Debug, Clone, Default)]
pub struct ErrorBuffer(std::sync::Arc<std::sync::Mutex<Vec<swc_common::errors::Diagnostic>>>);

type SourceMapBuffer = Vec<(swc_common::BytePos, swc_common::LineCol)>;

impl Emitter for ErrorBuffer {
    fn emit(&mut self, db: &DiagnosticBuilder) {
        self.0.lock().unwrap().push((**db).clone());
    }
}

#[test]
fn issue_6767() {
    testing::run_test(false, |cm, _| {
        let src = r#"/*------------------------------------
        ------------------------------------*/
      var _a;
      import z from "./z.js";
      console.log("xyz", z);
      "#;

        let (module, comments) = parse(src, "test.js", &cm).unwrap();

        helpers::HELPERS.set(&helpers::Helpers::new(true), || {
            if false {
                return Ok(());
            }

            let unresolved_mark = Mark::fresh(Mark::root());
            let top_level_mark = Mark::fresh(Mark::root());
            let mut module =
                module.fold_with(&mut resolver(unresolved_mark, top_level_mark, false));

            module.body.splice(
                0..0,
                vec![ModuleItem::ModuleDecl(ModuleDecl::Import(ImportDecl {
                    specifiers: vec![],
                    asserts: None,
                    span: DUMMY_SP,
                    src: Box::new("new".into()),
                    type_only: false,
                }))],
            );

            let module = module.fold_with(&mut chain!(
                reserved_words(),
                hygiene(),
                fixer(Some(&comments))
            ));

            let mut map_buf = vec![];
            let (code, src_map_buf) = emit(cm.clone(), comments, &module).unwrap();

            dbg!(&src_map_buf);

            struct SourceMapConfigImpl;

            impl SourceMapGenConfig for SourceMapConfigImpl {
                fn file_name_to_source(&self, f: &swc_common::FileName) -> String {
                    f.to_string()
                }

                fn inline_sources_content(&self, _: &swc_common::FileName) -> bool {
                    true
                }
            }
            cm.build_source_map_with_config(&src_map_buf, None, SourceMapConfigImpl)
                .to_writer(&mut map_buf)
                .unwrap();

            println!(
                "{}",
                visualizer_url(&code, &String::from_utf8(map_buf).unwrap())
            );
            panic!()
        })
    })
    .unwrap();
}

fn visualizer_url(code: &str, map: &str) -> String {
    println!("{}", code);
    println!("{}", map);
    let code_len = format!("{}\0", code.len());
    let map_len = format!("{}\0", map.len());
    let hash = base64::encode(format!("{}{}{}{}", code_len, code, map_len, map));
    format!("https://evanw.github.io/source-map-visualization/#{}", hash)
}

struct ShowSyntaxContext {
    top_level_mark: Mark,
    unresolved_mark: Mark,
}
impl Fold for ShowSyntaxContext {
    fn fold_ident(&mut self, node: Ident) -> Ident {
        let new_name: JsWord = format!(
            "{}_{}{}{}",
            node.sym,
            node.span.ctxt().as_u32(),
            if node.span.has_mark(self.top_level_mark) {
                "_top"
            } else {
                ""
            },
            if node.span.has_mark(self.unresolved_mark) {
                "_unres"
            } else {
                ""
            },
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
        // Syntax::Es(EsConfig {
        //     jsx: true,
        //     ..Default::default()
        // }),
        Syntax::Typescript(TsConfig {
            tsx: true,
            ..Default::default()
        }),
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

fn emit(
    source_map: Lrc<SourceMap>,
    comments: SingleThreadedComments,
    module: &Module,
) -> Result<(String, SourceMapBuffer), std::io::Error> {
    let mut src_map_buf = vec![];
    let mut buf = vec![];
    {
        let writer = Box::new(JsWriter::new(
            source_map.clone(),
            "\n",
            &mut buf,
            Some(&mut src_map_buf),
        ));
        let config = Config {
            minify: false,
            ascii_only: false,
            omit_last_semi: false,
            ..Default::default()
        };
        let mut emitter = swc_ecma_codegen::Emitter {
            cfg: config,
            comments: Some(&comments),
            cm: source_map,
            wr: writer,
        };

        emitter.emit_module(module)?;
    }

    Ok((String::from_utf8(buf).unwrap(), src_map_buf))
}
