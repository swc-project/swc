use std::{
    env::current_dir,
    path::{Path, PathBuf},
};

use indexmap::IndexMap;
use swc_common::{chain, FileName};
use swc_ecma_ast::*;
use swc_ecma_loader::resolvers::{node::NodeModulesResolver, tsc::TsConfigResolver};
use swc_ecma_parser::Syntax;
use swc_ecma_transforms_module::{
    path::{ImportResolver, NodeImportResolver},
    rewriter::import_rewriter,
};
use swc_ecma_transforms_testing::test_fixture;
use swc_ecma_visit::{as_folder, VisitMut, VisitMutWith};
use testing::run_test2;

type TestProvider = NodeImportResolver<NodeModulesResolver>;

#[test]
fn node_modules() {
    let provider = TestProvider::default();

    run_test2(false, |cm, _| {
        let fm = cm.new_source_file(FileName::Real("foo".into()), "".into());

        let resolved = provider
            .resolve_import(&fm.name, "core-js")
            .expect("should success");

        assert_eq!(&*resolved, "core-js");

        Ok(())
    })
    .unwrap();
}

struct Normalizer;

impl VisitMut for Normalizer {
    fn visit_mut_import_decl(&mut self, i: &mut ImportDecl) {
        if cfg!(target_os = "windows") {
            let path = Path::new(&*i.src.value).with_extension("ts");
            if path.is_file() {
                let p = path.canonicalize().unwrap().with_extension("");
                i.src.value = p.display().to_string().into()
            }
        }
    }

    fn visit_mut_call_expr(&mut self, i: &mut CallExpr) {
        i.visit_mut_children_with(self);

        if let Callee::Import(..) = i.callee {
            if let Expr::Lit(Lit::Str(s)) = &mut *i.args[0].expr {
                let path = Path::new(&*s.value).with_extension("ts");
                if path.is_file() {
                    let p = path.canonicalize().unwrap().with_extension("");
                    s.value = p.display().to_string().into()
                }
            }
        }
    }
}

#[test]
fn issue_4730() {
    let dir = Path::new("tests/fixture-manual/issue-4730");
    let input_dir = dir.join("input");
    let output_dir = dir.join("output");

    test_fixture(
        Syntax::default(),
        &|_| {
            let mut paths = IndexMap::new();
            paths.insert(
                "@print/a".into(),
                vec![current_dir()
                    .unwrap()
                    .join("tests")
                    .join("fixture-manual")
                    .join("issue-4730")
                    .join("input")
                    .join("packages")
                    .join("a")
                    .join("src")
                    .join("index.ts")
                    .display()
                    .to_string()],
            );
            paths.insert(
                "@print/b".into(),
                vec![current_dir()
                    .unwrap()
                    .join("tests")
                    .join("fixture-manual")
                    .join("issue-4730")
                    .join("input")
                    .join("packages")
                    .join("b")
                    .join("src")
                    .join("index.ts")
                    .display()
                    .to_string()],
            );

            let rules = paths.into_iter().collect();

            let resolver = paths_resolver(&input_dir, rules);

            chain!(
                import_rewriter(
                    FileName::Real(input_dir.join("src").join("index.js")),
                    resolver,
                ),
                as_folder(Normalizer)
            )
        },
        &input_dir.join("src").join("index.js"),
        &output_dir.join("index.js"),
    );
}

type JscPathsProvider = NodeImportResolver<TsConfigResolver<NodeModulesResolver>>;

fn paths_resolver(
    base_url: impl AsRef<Path>,
    rules: Vec<(String, Vec<String>)>,
) -> JscPathsProvider {
    NodeImportResolver::new(TsConfigResolver::new(
        NodeModulesResolver::new(swc_ecma_loader::TargetEnv::Node, Default::default(), true),
        base_url.as_ref().to_path_buf(),
        rules,
    ))
}

#[testing::fixture("tests/paths/**/input")]
fn fixture(input_dir: PathBuf) {
    let output_dir = input_dir.parent().unwrap().join("output");

    let index_path = input_dir.join("index.ts");

    test_fixture(
        Syntax::default(),
        &|_| {
            let paths_json_path = input_dir.join("paths.json");
            let paths_json = std::fs::read_to_string(&paths_json_path).unwrap();
            let paths = serde_json::from_str::<IndexMap<String, Vec<String>>>(&paths_json).unwrap();

            let rules = paths.into_iter().collect();

            let resolver = paths_resolver(&input_dir, rules);

            import_rewriter(FileName::Real(index_path.clone()), resolver)
        },
        &index_path,
        &output_dir.join("index.ts"),
    );
}
