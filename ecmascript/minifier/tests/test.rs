use std::fs::read_to_string;
use std::path::PathBuf;
use swc_common::FileName;
use swc_common::DUMMY_SP;
use swc_ecma_ast::Invalid;
use swc_ecma_parser::lexer::input::SourceFileInput;
use swc_ecma_parser::lexer::Lexer;
use swc_ecma_parser::Parser;
use swc_ecma_visit::Visit;
use walkdir::WalkDir;

/// Tests ported from uglifyjs.
#[testing::fixture("uglifyjs/**/input.js")]
fn uglify_js(path: PathBuf) {}

/// Generate tests using uglify js.
#[test]
#[ignore = "It's a script to update tests and it's not a test"]
fn update_uglifyjs_tests() {
    testing::run_test(true, |cm, handler| {
        // Walk uglifyjs test directories.
        let root = PathBuf::from(env!("CARGO_MANIFEST_DIR").to_string())
            .join("..")
            .join("..")
            .join("vendor")
            .join("UglifyJS")
            .join("test")
            .join("compress")
            .canonicalize()
            .unwrap();

        eprintln!("Loading tests from {}", root.display());

        for entry in WalkDir::new(&root) {
            let entry = entry.unwrap();
            if entry.file_type().is_dir() {
                continue;
            }
            let path = entry.path();
            let path_str = path.to_string_lossy();
            if path_str.contains("tools") || !path_str.ends_with(".js") {
                continue;
            }
            let rel_path = path.strip_prefix(&root).unwrap().to_path_buf();

            let src = read_to_string(path).expect("failed to read source code of a test?");
            let src = format!("{{{}}}", src);

            let fm = cm.new_source_file(FileName::Real(path.to_path_buf()), src);
            let lexer = Lexer::new(
                Default::default(),
                Default::default(),
                SourceFileInput::from(&*fm),
                None,
            );
            let mut parser = Parser::new_from(lexer);
            let expr = parser.parse_expr().unwrap_or_else(|err| {
                panic!(
                    "failed to parser test source as object\nFile: {}\nError: {:?}",
                    path.display(),
                    err
                )
            });

            expr.visit_with(
                &Invalid { span: DUMMY_SP },
                &mut UglifyJsTestGenerator { rel_path },
            );
        }

        Ok(())
    })
    .unwrap();
}

struct UglifyJsTestGenerator {
    rel_path: PathBuf,
}

impl Visit for UglifyJsTestGenerator {}
