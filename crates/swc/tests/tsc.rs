use std::{
    borrow::Cow,
    ffi::OsStr,
    fmt::Write,
    fs::create_dir_all,
    mem,
    panic::{catch_unwind, resume_unwind, AssertUnwindSafe},
    path::{Path, PathBuf},
    sync::Arc,
};

use once_cell::sync::Lazy;
use regex::Regex;
use serde::de::DeserializeOwned;
use serde_json::from_str;
use swc::{
    config::{
        Config, JsMinifyOptions, JscConfig, JscExperimental, ModuleConfig, Options, TransformConfig,
    },
    try_with_handler, Compiler,
};
use swc_common::{
    collections::AHashSet, errors::ColorConfig, FileName, SourceFile, SourceMap, GLOBALS,
};
use swc_ecma_ast::EsVersion;
use swc_ecma_parser::{Syntax, TsSyntax};
use testing::NormalizedOutput;

#[testing::fixture(
    "../swc_ecma_parser/tests/tsc/**/*.ts",
    exclude(
        "autoAccessor",
        "enumConstantMembers.ts",
        "privateNameAndAny.ts",
        "privateNameAndIndexSignature.ts",
        "privateNameImplicitDeclaration.ts",
        "privateNameStaticAccessorsDerivedClasses.ts",
        "privateNameStaticAccessorssDerivedClasses.ts",
        "jsDeclarationsEnums.ts",
        "typeofAnExportedType.ts"
    )
)]
#[testing::fixture(
    "../swc_ecma_parser/tests/tsc/**/*.tsx",
    exclude(
        "checkJsxNamespaceNamesQuestionableForms.tsx",
        "jsxEsprimaFbTestSuite.tsx",
        "jsxInvalidEsprimaTestSuite.tsx",
        "tsxGenericArrowFunctionParsing.tsx",
    )
)]
fn fixture(input: PathBuf) {
    if input.to_string_lossy().contains("jsdoc") {
        return;
    }

    let panics = matrix(&input)
        .into_iter()
        .filter_map(|test_unit_data| {
            //

            catch_unwind(AssertUnwindSafe(|| {
                let output_dir = Path::new("tests").join("tsc-references");

                let _ = create_dir_all(&output_dir);

                let output_path = output_dir.join(&test_unit_data.output);

                compile(&output_path, test_unit_data);
            }))
            .err()
        })
        .collect::<Vec<_>>();

    if panics.is_empty() {
        return;
    }

    resume_unwind(panics.into_iter().next().unwrap());
}

fn from_json<T>(s: &str) -> T
where
    T: DeserializeOwned,
{
    serde_json::from_str(s).unwrap()
}

struct TestUnitData {
    cm: Arc<SourceMap>,
    files: Vec<Arc<SourceFile>>,
    opts: Options,
    output: String,
}

static OPTION_REGEX: Lazy<Regex> =
    Lazy::new(|| Regex::new(r"^[\\/]{2}\s*@(\w+)\s*:\s*([^\r\n]*)").unwrap());

fn matrix(input: &Path) -> Vec<TestUnitData> {
    let cm = Arc::<SourceMap>::default();
    let fm = cm.load_file(input).expect("failed to load file");

    let mut targets = Vec::<EsVersion>::default();

    let mut modules = Vec::<Module>::default();
    let mut decorators = false;
    let mut decorator_metadata = false;
    let mut use_define_for_class_fields = false;
    let mut verbatim_module_syntax = false;

    let filename = input
        .file_name()
        .map(OsStr::to_string_lossy)
        .unwrap_or_else(|| "input.ts".into());

    let mut sub_filename = filename;

    let mut files = Vec::new();

    let mut buffer = String::default();
    for line in fm.src.lines() {
        if let Some(cap) = OPTION_REGEX.captures(line) {
            let meta_data_name = cap.get(1).unwrap().as_str().to_lowercase();
            let meta_data_value = cap.get(2).unwrap().as_str();
            // https://github.com/microsoft/TypeScript/blob/71b2ba6111e934f2b4ee112bc4d8d2f47ced22f5/src/testRunner/compilerRunner.ts#L118-L148
            match &*meta_data_name {
                "module" => {
                    modules.extend(module(&meta_data_value.to_lowercase()));
                }
                "moduleresolution" => {}
                "moduledetection" => {}
                "target" => {
                    targets.extend(target(&meta_data_value.to_lowercase()));
                }
                "jsx" => {}
                "removecomments" => {}
                "importhelpers" => {}
                "downleveliteration" => {}
                "isolatedmodules" => {}
                "strict" => {}
                "noimplicitany" => {}
                "strictnullchecks" => {}
                "strictfunctiontypes" => {}
                "strictbindcallapply" => {}
                "strictpropertyinitialization" => {}
                "noimplicitthis" => {}
                "alwaysstrict" => {}
                "allowsyntheticdefaultimports" => {}
                "esmoduleinterop" => {}
                "emitdecoratormetadata" => {
                    if meta_data_value.trim() == "true" {
                        decorator_metadata = true;
                    }
                }
                "experimentaldecorators" => {
                    if meta_data_value.trim() == "true" {
                        decorators = true;
                    }
                }
                "skipdefaultlibcheck" => {}
                "preserveconstenums" => {}
                "skiplibcheck" => {}
                "exactoptionalpropertytypes" => {}
                "usedefineforclassfields" => {
                    if meta_data_value.trim() == "true" {
                        use_define_for_class_fields = true;
                    }
                }
                "useunknownincatchvariables" => {}
                "nouncheckedindexedaccess" => {}
                "nopropertyaccessfromindexsignature" => {}
                "filename" => {
                    files.extend(sub_file(cm.clone(), &mut buffer, sub_filename));

                    sub_filename = Cow::from(meta_data_value.trim());
                }
                "verbatimmodulesyntax" => {
                    if meta_data_value.trim() == "true" {
                        verbatim_module_syntax = true;
                    }
                }
                _ => {}
            }
        } else {
            buffer += line;
            buffer.push('\n');
        }
    }
    files.extend(sub_file(cm.clone(), &mut buffer, sub_filename));

    if targets.is_empty() {
        targets = vec![EsVersion::default()]
    }

    if modules.is_empty() {
        modules = vec![Module::Es6]
    }

    fn sub_file(
        cm: Arc<SourceMap>,
        buffer: &mut String,
        filename: Cow<str>,
    ) -> Option<Arc<SourceFile>> {
        if !buffer.is_empty() {
            let mut source = String::default();
            mem::swap(&mut source, buffer);

            Some(cm.new_source_file(
                swc_common::FileName::Custom(filename.to_string()).into(),
                source,
            ))
        } else {
            None
        }
    }

    // "ES3", "ES5", "ES6", "ES2015", "ES2016", "ES2017", "ES2018", "ES2019",
    // "ES2020", "ES2021", "ES2022", "ESNext"
    fn target(value: &str) -> AHashSet<EsVersion> {
        let mut versions = AHashSet::<EsVersion>::default();

        value.split(',').for_each(|v| {
            let mut v = v.trim();
            match v {
                "*" => {
                    versions.extend(vec![
                        EsVersion::Es5,
                        EsVersion::Es2015,
                        EsVersion::Es2016,
                        EsVersion::Es2017,
                        EsVersion::Es2018,
                        EsVersion::Es2019,
                        EsVersion::Es2020,
                        EsVersion::Es2021,
                        EsVersion::Es2022,
                        EsVersion::EsNext,
                    ]);
                }
                "es6" | "es2015" => {
                    versions.insert(EsVersion::Es2015);
                }
                _ => {
                    let mut is_remove = false;
                    if v.starts_with('-') {
                        is_remove = true;
                        v = &v[1..];
                    }

                    if let Some(v) = from_str(&format!(r##""{}""##, v)).unwrap_or_default() {
                        if is_remove {
                            versions.remove(&v);
                        } else {
                            versions.insert(v);
                        }
                    }
                }
            }
        });

        versions
    }

    // "CommonJS", "AMD", "System", "UMD", "ES6", "ES2015", "ES2020", "ESNext",
    // "None", "ES2022", "Node16", "NodeNext"
    fn module(value: &str) -> AHashSet<Module> {
        let mut modules = AHashSet::<Module>::default();

        value.split(',').for_each(|v| {
            let v = v.trim();
            match v {
                "es6" | "es2015" | "es2020" | "esnext" | "none" | "es2022" => {
                    modules.insert(Module::Es6);
                }
                "commonjs" => {
                    modules.insert(Module::CommonJs);
                }
                "amd" => {
                    modules.insert(Module::Amd);
                }
                "umd" => {
                    modules.insert(Module::Umd);
                }
                "system" => {
                    modules.insert(Module::SystemJs);
                }
                "node16" | "nodenext" => {
                    modules.insert(Module::NodeNext);
                }
                _ => {}
            };
        });

        modules
    }

    #[derive(Debug, Clone, PartialEq, Eq, Hash)]
    enum Module {
        CommonJs,
        Umd,
        Amd,
        SystemJs,
        Es6,
        NodeNext,
    }

    impl std::fmt::Display for Module {
        fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
            match &self {
                Module::CommonJs => f.write_str("commonjs"),
                Module::Umd => f.write_str("umd"),
                Module::Amd => f.write_str("amd"),
                Module::SystemJs => f.write_str("system"),
                Module::Es6 => f.write_str("es6"),
                Module::NodeNext => f.write_str("nodenext"),
            }
        }
    }

    #[allow(clippy::from_over_into)]
    impl Into<ModuleConfig> for Module {
        fn into(self) -> ModuleConfig {
            match self {
                Self::CommonJs => ModuleConfig::CommonJs(Default::default()),
                Self::Umd => ModuleConfig::Umd(Default::default()),
                Self::Amd => ModuleConfig::Amd(Default::default()),
                Self::SystemJs => ModuleConfig::SystemJs(Default::default()),
                Self::Es6 => ModuleConfig::Es6(Default::default()),
                Self::NodeNext => ModuleConfig::NodeNext(Default::default()),
            }
        }
    }

    let default_minify: JsMinifyOptions = from_json(
        r#"
        {
            "compress": {
                "toplevel": true,
                "module": true,
                "passes": 0
            },
            "mangle": false,
            "toplevel": true
        }
    "#,
    );

    let mut test_unit_data_list = Vec::new();

    let is_jsx = input
        .extension()
        .map(|ext| ext == "tsx")
        .unwrap_or_default();

    let base_name = input.with_extension("");
    let base_name = base_name.file_name().map(OsStr::to_string_lossy).unwrap();

    for minify in [None, Some(default_minify)] {
        for target in targets.clone() {
            for module in modules.clone() {
                let mut vary_name = Vec::new();

                if modules.len() > 1 {
                    vary_name.push(format!("module={}", &module));
                }

                if targets.len() > 1 {
                    vary_name.push(format!(
                        "target={}",
                        serde_json::to_string(&target).unwrap().replace('"', "")
                    ));
                }

                let mut filename = base_name.to_string();
                if !vary_name.is_empty() {
                    filename.push('(');
                    filename.push_str(&vary_name.join(","));
                    filename.push(')');
                }

                if minify.is_some() {
                    filename.push_str(".2.minified.js");
                } else {
                    filename.push_str(".1.normal.js");
                }

                let opts = Options {
                    config: Config {
                        jsc: JscConfig {
                            syntax: Some(Syntax::Typescript(TsSyntax {
                                tsx: is_jsx,
                                decorators,
                                dts: false,
                                no_early_errors: false,
                                disallow_ambiguous_jsx_like: false,
                            })),
                            external_helpers: true.into(),
                            target: Some(target),
                            minify: minify.clone(),
                            transform: Some(TransformConfig {
                                use_define_for_class_fields: use_define_for_class_fields.into(),
                                decorator_metadata: decorator_metadata.into(),
                                verbatim_module_syntax: verbatim_module_syntax.into(),
                                ..Default::default()
                            })
                            .into(),
                            experimental: JscExperimental {
                                disable_all_lints: false.into(),
                                ..Default::default()
                            },
                            ..Default::default()
                        },
                        module: Some(module.into()),
                        ..Default::default()
                    },
                    ..Default::default()
                };

                test_unit_data_list.push(TestUnitData {
                    cm: cm.clone(),
                    files: files.clone(),
                    opts,
                    output: filename,
                })
            }
        }
    }

    test_unit_data_list
}

fn compile(output: &Path, test_unit_data: TestUnitData) {
    let _testing = testing::init();

    let cm = test_unit_data.cm;

    let c = Compiler::new(cm.clone());

    let mut result = String::default();

    for file in test_unit_data.files {
        let filename = match &*file.name {
            FileName::Custom(filename) => filename,
            _ => unreachable!(),
        };

        writeln!(result, "//// [{}]", filename).unwrap();

        GLOBALS.set(&Default::default(), || {
            match try_with_handler(
                cm.clone(),
                swc::HandlerOpts {
                    color: ColorConfig::Never,
                    skip_filename: true,
                },
                |handler| c.process_js_file(file, handler, &test_unit_data.opts),
            ) {
                Ok(res) => {
                    result += &res.code;
                }
                Err(ref err) => {
                    for line in err.to_string().lines() {
                        writeln!(result, "//! {}", line).unwrap();
                    }
                }
            }
        })
    }

    NormalizedOutput::from(result)
        .compare_to_file(output)
        .unwrap();
}
