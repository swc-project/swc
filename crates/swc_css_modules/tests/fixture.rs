use std::{ffi::OsString, path::Path};

use swc_common::{input::SourceFileInput, sync::Lrc, FileName, SourceMap};
use swc_css_codegen::{
    writer::basic::{BasicCssWriter, BasicCssWriterConfig},
    CodeGenerator, CodegenConfig, Emit,
};
use swc_css_modules::transform_with_css_modules;
use swc_css_parser::{
    lexer::Lexer,
    parser::{Parser, ParserConfig},
};
use testing::DebugUsingDisplay;

fn path_resolve(path: &str) -> String {
    let work_cwd = env!("CARGO_MANIFEST_DIR");
    let os_work_cwd = OsString::from(work_cwd);
    Path::new(&os_work_cwd)
        .join(path)
        .into_os_string()
        .into_string()
        .unwrap()
}

fn readfile(path: &str) -> Result<String, String> {
    let filepath = Path::new(path);

    if filepath.exists() {
        if filepath.is_dir() {
            return Err(format!(
                "file is not file maybe is dir ?! filepath is{}",
                path
            ));
        }
        match std::fs::read_to_string(filepath) {
            Ok(content) => Ok(content),
            Err(ex) => Err(ex.to_string()),
        }
    } else {
        Err(format!("file is not exists filepath is {}", path))
    }
}

fn test_css_modules(filepath: &str) -> String {
    let content = readfile(filepath).unwrap();
    println!("Content:\n{}", content);
    let config = ParserConfig {
        ..Default::default()
    };
    let cm: Lrc<SourceMap> = Default::default();
    let fm = cm.new_source_file(
        FileName::Custom(filepath.to_string()),
        content.clone().into(),
    );
    let lexer = Lexer::new(SourceFileInput::from(&*fm), config);
    let mut parser = Parser::new(lexer, config);
    let stylesheet = parser.parse_all().unwrap();
    let new_stylesheet = transform_with_css_modules(stylesheet, filepath);
    let mut css_str = String::new();
    {
        let wr = BasicCssWriter::new(
            &mut css_str,
            None, // Some(&mut src_map_buf),
            BasicCssWriterConfig::default(),
        );
        let mut gen = CodeGenerator::new(wr, CodegenConfig { minify: false });
        gen.emit(&new_stylesheet).unwrap();
    }
    css_str
}

#[test]
fn test() {
    let case = path_resolve("tests/fixture/demo3.css");
    let res = test_css_modules(case.as_str());
    println!("{}", res);
}

#[test]
fn test_css_modules_case() {
    let case_1 = path_resolve("tests/fixture/demo1.css");
    let res1 = test_css_modules(case_1.as_str());
    let target_code = r#"
.x {
  display: inline-block;
  width: 20px;
}
h2,
h3 {
  font-size: 10px;
  display: block;
}
h2 .fixture_demo1_14738004728310336865_a,
h3 .fixture_demo1_14738004728310336865_a {
  display: block;
  box-sizing: border-box;
}
h2 .fixture_demo1_14738004728310336865_m .tap h2 ,
h3 .fixture_demo1_14738004728310336865_m .tap h2  {
  word-break: break-all;
  width: 40px;
}
.fixture_demo1_14738004728310336865_kol h2 .fixture_demo1_14738004728310336865_m .tap h2 ,
.fixture_demo1_14738004728310336865_kol h3 .fixture_demo1_14738004728310336865_m .tap h2  {
  width: 100px;
}
.fixture_demo1_14738004728310336865_u h2,
.fixture_demo1_14738004728310336865_u h3 {
  display: inline-block;
  width: 20px;
}
h2  .b,
h3  .b {
  display: inline-block;
  width: 20px;
}
.fixture_demo1_14738004728310336865_c h2 ,
.fixture_demo1_14738004728310336865_c h3  {
  display: inline-block;
  width: 20px;
}
  "#;
    assert_eq!(DebugUsingDisplay(target_code), DebugUsingDisplay(&res1));

    let case_2 = path_resolve("tests/fixture/demo2.css");
    let res2 = test_css_modules(case_2.as_str());
    let target_code = r#"
.fixture_demo2_6789844810353091540_a {
  width: 20px;
}
.fixture_demo2_6789844810353091540_x  .a .c,
.fixture_demo2_6789844810353091540_d  .b {
  width: 40px;
}
.fixture_demo2_6789844810353091540_b .a > .b.c  .fixture_demo2_6789844810353091540_x {
  width: 30px;
}
 .a  .fixture_demo2_6789844810353091540_b,
 .x  {
  width: 40px;
}
,
 .fixture_demo2_6789844810353091540_b {
  width: 40px;
}
 .a  .fixture_demo2_6789844810353091540_b,
 .x  .fixture_demo2_6789844810353091540_m {
  width: 40px;
}
.fixture_demo2_6789844810353091540_a.b .c {
  width: 50px;
}
  "#;
    assert_eq!(DebugUsingDisplay(target_code), DebugUsingDisplay(&res2));

    let case_3 = path_resolve("tests/fixture/demo3.css");
    let res3 = test_css_modules(case_3.as_str());
    let target_code = r#"
.x .fixture_demo3_16401825995056589139_b > .fixture_demo3_16401825995056589139_c  {
  width: 20px;
}
  "#;
    assert_eq!(DebugUsingDisplay(target_code), DebugUsingDisplay(&res3));
}
