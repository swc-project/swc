use std::{env, fs};

use swc_common::{errors::HANDLER, FileName};
use swc_html_ast::Document;
use swc_html_codegen::{writer::basic::BasicHtmlWriter, Emit};
use swc_html_minifier::{minify_document, option::MinifyOptions};
use swc_html_parser::parse_file_as_document;

pub fn main() {
    let path = env::args().nth(1).expect("should provide a path to file");
    let src = fs::read_to_string(path).unwrap();
    testing::run_test2(false, |cm, handler| {
        HANDLER.set(&handler, || {
            let fm = cm.new_source_file(FileName::Anon.into(), src);

            let mut errors = Vec::new();
            let mut document: Document =
                parse_file_as_document(&fm, Default::default(), &mut errors).unwrap();

            for err in errors {
                err.to_diagnostics(&handler).emit();
            }

            minify_document(&mut document, &MinifyOptions::default());

            let mut buf = String::new();
            {
                let wr = BasicHtmlWriter::new(&mut buf, None, Default::default());
                let mut generator = swc_html_codegen::CodeGenerator::new(
                    wr,
                    swc_html_codegen::CodegenConfig {
                        minify: true,
                        ..Default::default()
                    },
                );

                generator.emit(&document).unwrap();
            }

            println!("{buf}");

            Ok(())
        })
    })
    .unwrap();
}
