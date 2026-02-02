#![deny(warnings)]

use std::{
    path::{Path, PathBuf},
    process::{Command, Stdio},
};

use swc_atoms::atom;
use swc_common::{errors::Handler, sync::Lrc, FileName, Mark, SourceFile, SourceMap};
use swc_ecma_ast::*;
use swc_ecma_codegen::{
    text_writer::{omit_trailing_semi, JsWriter, WriteJs},
    Emitter,
};
use swc_ecma_minifier::{
    optimize,
    option::{ExtraOptions, MangleOptions, ManglePropertiesOptions, MinifyOptions},
};
use swc_ecma_parser::parse_file_as_program;
use swc_ecma_transforms_base::{fixer::paren_remover, resolver};
use swc_ecma_utils::drop_span;
use swc_ecma_visit::VisitMutWith;
use testing::{assert_eq, NormalizedOutput};
use tracing::warn;

fn print(cm: Lrc<SourceMap>, p: &Program, minify: bool) -> String {
    let mut buf = Vec::new();

    {
        let mut wr = Box::new(JsWriter::new(cm.clone(), "\n", &mut buf, None)) as Box<dyn WriteJs>;

        if minify {
            wr = Box::new(omit_trailing_semi(wr));
        }

        let mut emitter = Emitter {
            cfg: swc_ecma_codegen::Config::default().with_minify(minify),
            cm,
            comments: None,
            wr,
        };

        emitter.emit_program(p).unwrap();
    }

    String::from_utf8(buf).unwrap()
}

fn parse(handler: &Handler, cm: Lrc<SourceMap>, path: &Path) -> Result<Program, ()> {
    let fm = cm.load_file(path).unwrap();
    parse_fm(handler, fm)
}

fn parse_fm(handler: &Handler, fm: Lrc<SourceFile>) -> Result<Program, ()> {
    parse_file_as_program(
        &fm,
        Default::default(),
        EsVersion::latest(),
        None,
        &mut Vec::new(),
    )
    .map_err(|err| {
        err.into_diagnostic(handler).emit();
    })
}

#[testing::fixture("tests/terser/**/input.js")]
fn snapshot_compress_fixture(input: PathBuf) {
    let output_path = input.parent().unwrap().join("output.mangleOnly.js");

    let _ = testing::run_test2(false, |cm, handler| {
        let mut m = parse(&handler, cm.clone(), &input)?;

        if option_env!("CI") != Some("1") {
            let mut c = Command::new("node");
            c.arg("scripts/mangler/charfreq.js");
            c.arg(&input);
            c.stderr(Stdio::inherit());
            let output = c.output().unwrap();

            warn!(
                "Chars of terser: {}",
                String::from_utf8_lossy(&output.stdout)
            );
        }

        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        m.visit_mut_with(&mut resolver(unresolved_mark, top_level_mark, false));

        let p = optimize(
            m,
            cm.clone(),
            None,
            None,
            &MinifyOptions {
                mangle: Some(MangleOptions {
                    top_level: Some(true),
                    ..Default::default()
                }),
                compress: None,
                ..Default::default()
            },
            &ExtraOptions {
                unresolved_mark,
                top_level_mark,
                mangle_name_cache: None,
            },
        );

        if output_path.exists() {
            // Compare AST, and mark test as a success if ast is identical.

            let mut actual = p.clone();
            actual.visit_mut_with(&mut paren_remover(None));
            actual = drop_span(actual);

            let mut expected = parse(&handler, cm.clone(), &output_path)?;
            expected.visit_mut_with(&mut paren_remover(None));
            expected = drop_span(expected);

            if actual == expected {
                return Ok(());
            }

            let actual = print(cm.clone(), &actual, false);
            let expected = print(cm.clone(), &expected, false);

            if actual == expected {
                return Ok(());
            }
        }

        let mangled = print(cm, &p, false);

        NormalizedOutput::from(mangled)
            .compare_to_file(output_path)
            .unwrap();

        Ok(())
    });
}

#[testing::fixture("tests/mangle/**/input.js")]
fn fixture(input: PathBuf) {
    testing::run_test2(false, |cm, handler| {
        let mut p = parse(&handler, cm.clone(), &input)?;

        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        p.visit_mut_with(&mut resolver(unresolved_mark, top_level_mark, false));

        let p = optimize(
            p,
            cm.clone(),
            None,
            None,
            &MinifyOptions {
                mangle: Some(MangleOptions {
                    top_level: Some(true),
                    ..Default::default()
                }),
                compress: None,
                ..Default::default()
            },
            &ExtraOptions {
                unresolved_mark,
                top_level_mark,
                mangle_name_cache: None,
            },
        );

        let mangled = print(cm, &p, false);

        NormalizedOutput::from(mangled)
            .compare_to_file(input.parent().unwrap().join("output.js"))
            .unwrap();

        Ok(())
    })
    .unwrap();
}

#[track_caller]
fn assert_mangled(src: &str, expected: &str, opts: MangleOptions) {
    testing::run_test2(false, |cm, handler| {
        let fm = cm.new_source_file(FileName::Anon.into(), src.to_string());

        let p = parse_fm(&handler, fm)?;

        let unresolved_mark = Mark::fresh(Mark::root());
        let top_level_mark = Mark::fresh(Mark::root());

        let m = optimize(
            p,
            cm.clone(),
            None,
            None,
            &MinifyOptions {
                mangle: Some(opts),
                compress: None,
                ..Default::default()
            },
            &ExtraOptions {
                unresolved_mark,
                top_level_mark,
                mangle_name_cache: None,
            },
        );

        let mangled = print(cm, &m, false);

        assert_eq!(
            NormalizedOutput::from(mangled),
            NormalizedOutput::from(expected.to_owned())
        );

        Ok(())
    })
    .unwrap()
}

/// Helper to assert that certain properties are preserved (not mangled) and
/// others are mangled This is more flexible than exact output matching because
/// it doesn't depend on variable naming order.
#[track_caller]
fn assert_props_preserved_and_mangled(
    src: &str,
    preserved_props: &[&str],
    mangled_props: &[&str],
    opts: MangleOptions,
) {
    testing::run_test2(false, |cm, handler| {
        let fm = cm.new_source_file(FileName::Anon.into(), src.to_string());

        let p = parse_fm(&handler, fm)?;

        let unresolved_mark = Mark::fresh(Mark::root());
        let top_level_mark = Mark::fresh(Mark::root());

        let m = optimize(
            p,
            cm.clone(),
            None,
            None,
            &MinifyOptions {
                mangle: Some(opts),
                compress: None,
                ..Default::default()
            },
            &ExtraOptions {
                unresolved_mark,
                top_level_mark,
                mangle_name_cache: None,
            },
        );

        let mangled = print(cm, &m, false);

        // Check preserved properties still exist
        for prop in preserved_props {
            assert!(
                mangled.contains(prop),
                "Property '{prop}' should be preserved but was not found in output:\n{mangled}",
            );
        }

        // Check mangled properties no longer exist with original name
        for prop in mangled_props {
            // Check that the original property name doesn't appear as a property
            // (it might appear in strings, so we look for property access patterns)
            let prop_access = format!(".{prop}");
            let prop_def = format!("{prop}: ");
            let prop_def2 = format!("{prop}(");
            assert!(
                !mangled.contains(&prop_access)
                    && !mangled.contains(&prop_def)
                    && !mangled.contains(&prop_def2),
                "Property '{prop}' should be mangled but was found in output:\n{mangled}",
            );
        }

        Ok(())
    })
    .unwrap()
}

#[test]
fn reserved_func_names() {
    let src = "function func1() {
    console.log(1);
}
function func2() {
    console.log(2);
}";

    let expected = "function func1() {
    console.log(1);
}
function n() {
    console.log(2);
}";

    assert_mangled(
        src,
        expected,
        MangleOptions {
            top_level: Some(true),
            reserved: vec![atom!("func1")],
            ..Default::default()
        },
    )
}

#[test]
fn reserved_class_names() {
    let src = "class Class1 {
    hello1 = 1;
}
class Class2 {
    hello2 = 2;
}";

    let expected = "class Class1 {
    hello1 = 1;
}
class l {
    hello2 = 2;
}";

    assert_mangled(
        src,
        expected,
        MangleOptions {
            top_level: Some(true),
            reserved: vec![atom!("Class1")],
            ..Default::default()
        },
    )
}

#[test]
fn reserved_class_props() {
    let src = "class Class1 {
    hello1 = 1;
}
class Class2 {
    hello2 = 2;
}";

    let expected = "class l {
    l = 1;
}
class s {
    hello2 = 2;
}";

    assert_mangled(
        src,
        expected,
        MangleOptions {
            top_level: Some(true),
            reserved: vec![atom!("hello1")],
            props: Some(ManglePropertiesOptions {
                reserved: vec![atom!("hello2")],
                ..Default::default()
            }),
            ..Default::default()
        },
    )
}

#[test]
fn reserved_private_props() {
    let src = "class Class1 {
    #hello1 = 1;
}
class Class2 {
    #hello2 = 2;
}";

    let expected = "class l {
    #l = 1;
}
class s {
    #s = 2;
}";

    assert_mangled(
        src,
        expected,
        MangleOptions {
            top_level: Some(true),
            reserved: vec![atom!("hello1")],
            ..Default::default()
        },
    )
}

#[test]
fn reserved_all_private_props() {
    let src = "class Class1 {
    #hello1 = 1;
}
class Class2 {
    #hello2 = 2;
}";

    let expected = "class l {
    #hello1 = 1;
}
class s {
    #hello2 = 2;
}";

    assert_mangled(
        src,
        expected,
        MangleOptions {
            top_level: Some(true),
            keep_private_props: true,
            ..Default::default()
        },
    )
}

/// Test basic property mangling - all properties should be mangled when there's
/// no dynamic access
#[test]
fn basic_property_mangling() {
    let src = r#"const obj = { foo: 1, bar: 2 };
console.log(obj.foo, obj.bar);"#;

    let expected = r#"const o = {
    o: 1,
    a: 2
};
console.log(o.o, o.a);
"#;

    assert_mangled(
        src,
        expected,
        MangleOptions {
            top_level: Some(true),
            props: Some(ManglePropertiesOptions {
                ..Default::default()
            }),
            ..Default::default()
        },
    )
}

/// Test nested property mangling - nested properties should be mangled
#[test]
fn nested_property_mangling() {
    let src = r#"const obj = { nested: { foo: 1, bar: 2 } };
console.log(obj.nested.foo, obj.nested.bar);"#;

    let expected = r#"const e = {
    e: {
        o: 1,
        n: 2
    }
};
console.log(e.e.o, e.e.n);
"#;

    assert_mangled(
        src,
        expected,
        MangleOptions {
            top_level: Some(true),
            props: Some(ManglePropertiesOptions {
                ..Default::default()
            }),
            ..Default::default()
        },
    )
}

/// Test that dynamically accessed properties are NOT mangled
#[test]
fn dynamic_access_no_mangle() {
    // When obj[key] is accessed with a dynamic key, the direct properties should
    // NOT be mangled
    let src = r#"const obj = { foo: 1, bar: 2 };
function get(key) {
    return obj[key];
}"#;

    // foo and bar should NOT be mangled because they're accessed dynamically
    let expected = r#"const n = {
    foo: 1,
    bar: 2
};
function o(o) {
    return n[o];
}
"#;

    assert_mangled(
        src,
        expected,
        MangleOptions {
            top_level: Some(true),
            props: Some(ManglePropertiesOptions {
                ..Default::default()
            }),
            ..Default::default()
        },
    )
}

/// Simpler test: nested properties should be mangled when accessed statically
/// Using "xval" instead of "inner" because "inner" is a reserved DOM property
#[test]
fn nested_props_static_access_mangled() {
    let src = r#"const obj = {
    foo: { xval: 1 }
};
console.log(obj.foo.xval);"#;

    // Both foo and xval should be mangled
    let expected = r#"const o = {
    o: {
        l: 1
    }
};
console.log(o.o.l);
"#;

    assert_mangled(
        src,
        expected,
        MangleOptions {
            top_level: Some(true),
            props: Some(ManglePropertiesOptions {
                ..Default::default()
            }),
            ..Default::default()
        },
    )
}

/// Test: only top-level props should be protected with dynamic access
#[test]
fn dynamic_access_only_top_level_protected() {
    // When obj[key] is accessed with a dynamic key, only the TOP-LEVEL
    // properties should NOT be mangled. Nested properties remain mangleable.
    // Using "xval" instead of "inner" because "inner" is a reserved DOM property
    let src = r#"const obj = {
    foo: { xval: 1 }
};
function get(key) {
    return obj[key].xval;
}"#;

    // foo should NOT be mangled (dynamic access)
    // xval SHOULD be mangled (static access)
    let expected = r#"const n = {
    foo: {
        n: 1
    }
};
function o(o) {
    return n[o].n;
}
"#;

    assert_mangled(
        src,
        expected,
        MangleOptions {
            top_level: Some(true),
            props: Some(ManglePropertiesOptions {
                ..Default::default()
            }),
            ..Default::default()
        },
    )
}

/// Test for issue #10332: Safe property mangling for local objects
/// Nested properties accessed with static keys should be mangled
/// even when parent is accessed with dynamic keys
#[test]
fn safe_property_mangling_nested_static() {
    // The top-level properties A4 and Letter are accessed dynamically via
    // sizes[paper], so they should NOT be mangled
    // However, xwidth and xheight are always accessed statically via
    // sizes[paper].xwidth, so they SHOULD be mangled
    // Using xwidth/xheight instead of width/height because the latter are
    // reserved DOM properties
    let src = r#"const sizes = {
    A4: { xwidth: '21cm', xheight: '29.7cm' },
    Letter: { xwidth: '8.5in', xheight: '11in' }
};
function printSize(paper) {
    return sizes[paper].xwidth + sizes[paper].xheight;
}"#;

    // xwidth and xheight should be mangled
    // A4 and Letter should NOT be mangled
    let expected = r#"const t = {
    A4: {
        t: '21cm',
        h: '29.7cm'
    },
    Letter: {
        t: '8.5in',
        h: '11in'
    }
};
function h(h) {
    return t[h].t + t[h].h;
}
"#;

    assert_mangled(
        src,
        expected,
        MangleOptions {
            top_level: Some(true),
            props: Some(ManglePropertiesOptions {
                ..Default::default()
            }),
            ..Default::default()
        },
    )
}

// ==================== Additional Test Cases for Safe Property Mangling
// ====================

/// Test dynamic access using function call result as key
#[test]
fn dynamic_access_function_call_key() {
    let src = r#"const obj = { foo: 1, bar: 2 };
function getKey() { return 'foo'; }
function getValue() {
    return obj[getKey()];
}"#;

    // foo and bar should NOT be mangled because they're accessed dynamically
    assert_props_preserved_and_mangled(
        src,
        &["foo", "bar"], // preserved
        &[],             // mangled
        MangleOptions {
            top_level: Some(true),
            props: Some(ManglePropertiesOptions {
                ..Default::default()
            }),
            ..Default::default()
        },
    )
}

/// Test dynamic access using template literal as key
#[test]
fn dynamic_access_template_literal_key() {
    let src = r#"const obj = { prefixFoo: 1, prefixBar: 2 };
function get(name) {
    return obj[`prefix${name}`];
}"#;

    // Properties should NOT be mangled due to dynamic template literal access
    assert_props_preserved_and_mangled(
        src,
        &["prefixFoo", "prefixBar"], // preserved
        &[],                         // mangled
        MangleOptions {
            top_level: Some(true),
            props: Some(ManglePropertiesOptions {
                ..Default::default()
            }),
            ..Default::default()
        },
    )
}

/// Test that static string access still allows mangling
#[test]
fn static_string_access_allows_mangling() {
    let src = r#"const obj = { propA: 1, propB: 2 };
const a = obj["propA"];
const b = obj.propB;"#;

    // Both should be mangled because they use static string keys
    assert_props_preserved_and_mangled(
        src,
        &[],                 // preserved
        &["propA", "propB"], // mangled
        MangleOptions {
            top_level: Some(true),
            props: Some(ManglePropertiesOptions {
                ..Default::default()
            }),
            ..Default::default()
        },
    )
}

/// Test that numeric access doesn't prevent mangling
#[test]
fn numeric_access_allows_mangling() {
    let src = r#"const obj = { propA: 1 };
const arr = obj[0];
console.log(obj.propA);"#;

    // propA should be mangled, numeric access doesn't affect it
    assert_props_preserved_and_mangled(
        src,
        &[],        // preserved
        &["propA"], // mangled
        MangleOptions {
            top_level: Some(true),
            props: Some(ManglePropertiesOptions {
                ..Default::default()
            }),
            ..Default::default()
        },
    )
}

/// Test multiple objects with different access patterns
#[test]
fn multiple_objects_different_access() {
    let src = r#"const objStatic = { xfoo: 1, xbar: 2 };
const objDynamic = { xbaz: 3, xqux: 4 };
function getValue(key) {
    return objDynamic[key];
}
console.log(objStatic.xfoo, objStatic.xbar);"#;

    // objStatic properties should be mangled (static access only)
    // objDynamic properties should NOT be mangled (dynamic access)
    assert_props_preserved_and_mangled(
        src,
        &["xbaz", "xqux"], // preserved (dynamic access)
        &["xfoo", "xbar"], // mangled (static only)
        MangleOptions {
            top_level: Some(true),
            props: Some(ManglePropertiesOptions {
                ..Default::default()
            }),
            ..Default::default()
        },
    )
}

/// Test deeply nested object access
#[test]
fn deeply_nested_dynamic_access() {
    let src = r#"const config = {
    level1: {
        level2: {
            propA: 1,
            propB: 2
        }
    }
};
function get(key) {
    return config[key].level2.propA;
}"#;

    // level1 should NOT be mangled (direct dynamic access)
    // level2, propA, propB should be mangled (static access)
    assert_props_preserved_and_mangled(
        src,
        &["level1"],                   // preserved
        &["level2", "propA", "propB"], // mangled
        MangleOptions {
            top_level: Some(true),
            props: Some(ManglePropertiesOptions {
                ..Default::default()
            }),
            ..Default::default()
        },
    )
}

/// Test object with methods - dynamic access
#[test]
fn object_with_methods_dynamic_access() {
    let src = r#"const handlers = {
    onClick: function() { return 1; },
    onHover: function() { return 2; }
};
function trigger(eventName) {
    return handlers[eventName]();
}"#;

    // onClick and onHover should NOT be mangled
    assert_props_preserved_and_mangled(
        src,
        &["onClick", "onHover"], // preserved
        &[],                     // mangled
        MangleOptions {
            top_level: Some(true),
            props: Some(ManglePropertiesOptions {
                ..Default::default()
            }),
            ..Default::default()
        },
    )
}

/// Test object with getter/setter methods - static access
#[test]
fn object_with_getters_setters_static() {
    let src = r#"const obj = {
    get xvalue() { return 1; },
    set xvalue(v) { }
};
console.log(obj.xvalue);
obj.xvalue = 5;"#;

    // xvalue should be mangled (static access only)
    assert_props_preserved_and_mangled(
        src,
        &[],         // preserved
        &["xvalue"], // mangled
        MangleOptions {
            top_level: Some(true),
            props: Some(ManglePropertiesOptions {
                ..Default::default()
            }),
            ..Default::default()
        },
    )
}

/// Test class static properties
#[test]
fn class_static_properties() {
    let src = r#"class MyClass {
    static xprop1 = 1;
    static xprop2 = 2;
}
console.log(MyClass.xprop1, MyClass.xprop2);"#;

    // Static properties should be mangled (static access only)
    assert_props_preserved_and_mangled(
        src,
        &[],                   // preserved
        &["xprop1", "xprop2"], // mangled
        MangleOptions {
            top_level: Some(true),
            props: Some(ManglePropertiesOptions {
                ..Default::default()
            }),
            ..Default::default()
        },
    )
}

/// Test class instance properties
#[test]
fn class_instance_properties() {
    let src = r#"class MyClass {
    xprop1 = 1;
    xprop2 = 2;
    getValues() {
        return this.xprop1 + this.xprop2;
    }
}
const instance = new MyClass();
console.log(instance.xprop1);"#;

    // Instance properties should be mangled (static access only)
    assert_props_preserved_and_mangled(
        src,
        &[],                   // preserved
        &["xprop1", "xprop2"], // mangled
        MangleOptions {
            top_level: Some(true),
            props: Some(ManglePropertiesOptions {
                ..Default::default()
            }),
            ..Default::default()
        },
    )
}

/// Test object destructuring with dynamic access
#[test]
fn object_destructuring_dynamic_access() {
    let src = r#"const data = {
    userA: { xname: 'Alice', xage: 30 },
    userB: { xname: 'Bob', xage: 25 }
};
function getUser(id) {
    const { xname, xage } = data[id];
    return xname + xage;
}"#;

    // userA, userB should NOT be mangled (dynamic access)
    // xname, xage should be mangled (static access on nested object)
    assert_props_preserved_and_mangled(
        src,
        &["userA", "userB"], // preserved
        &["xname", "xage"],  // mangled
        MangleOptions {
            top_level: Some(true),
            props: Some(ManglePropertiesOptions {
                ..Default::default()
            }),
            ..Default::default()
        },
    )
}

/// Test computed property names in object literal
#[test]
fn computed_property_names_in_literal() {
    let src = r#"const KEY = 'dynamicKey';
const obj = {
    [KEY]: 1,
    staticKey: 2
};
console.log(obj.staticKey);"#;

    // staticKey should be mangled (static access)
    assert_props_preserved_and_mangled(
        src,
        &[],            // preserved
        &["staticKey"], // mangled
        MangleOptions {
            top_level: Some(true),
            props: Some(ManglePropertiesOptions {
                ..Default::default()
            }),
            ..Default::default()
        },
    )
}

/// Test object spread with dynamic access
#[test]
fn object_spread_dynamic_access() {
    let src = r#"const base = { xfoo: 1 };
const extended = { ...base, xbar: 2 };
function get(key) {
    return extended[key];
}"#;

    // extended properties should NOT be mangled (dynamic access)
    assert_props_preserved_and_mangled(
        src,
        &["xbar"], // preserved (dynamic access on extended)
        &["xfoo"], // mangled (base is not accessed dynamically)
        MangleOptions {
            top_level: Some(true),
            props: Some(ManglePropertiesOptions {
                ..Default::default()
            }),
            ..Default::default()
        },
    )
}

/// Test array of objects with static access
#[test]
fn array_of_objects_static_access() {
    let src = r#"const items = [
    { xname: 'one', xval: 1 },
    { xname: 'two', xval: 2 }
];
console.log(items[0].xname, items[1].xval);"#;

    // xname and xval should be mangled (static property access)
    assert_props_preserved_and_mangled(
        src,
        &[],                // preserved
        &["xname", "xval"], // mangled
        MangleOptions {
            top_level: Some(true),
            props: Some(ManglePropertiesOptions {
                ..Default::default()
            }),
            ..Default::default()
        },
    )
}

/// Test for-in loop (potential dynamic access pattern)
#[test]
fn for_in_loop_access() {
    let src = r#"const obj = { xfoo: 1, xbar: 2 };
for (const key in obj) {
    console.log(obj[key]);
}"#;

    // Properties should NOT be mangled due to for-in dynamic access
    assert_props_preserved_and_mangled(
        src,
        &["xfoo", "xbar"], // preserved
        &[],               // mangled
        MangleOptions {
            top_level: Some(true),
            props: Some(ManglePropertiesOptions {
                ..Default::default()
            }),
            ..Default::default()
        },
    )
}

/// Test Object.keys iteration (potential dynamic access)
#[test]
fn object_keys_iteration() {
    let src = r#"const obj = { xfoo: 1, xbar: 2 };
Object.keys(obj).forEach(key => console.log(obj[key]));"#;

    // Properties should NOT be mangled due to Object.keys + dynamic access
    assert_props_preserved_and_mangled(
        src,
        &["xfoo", "xbar"], // preserved
        &[],               // mangled
        MangleOptions {
            top_level: Some(true),
            props: Some(ManglePropertiesOptions {
                ..Default::default()
            }),
            ..Default::default()
        },
    )
}

/// Test mixed static and dynamic access on same object
#[test]
fn mixed_static_dynamic_access() {
    let src = r#"const obj = { xstatic: 1, xdynamic: 2 };
console.log(obj.xstatic);
function get(key) {
    return obj[key];
}"#;

    // Both xstatic and xdynamic should NOT be mangled (obj has dynamic access)
    assert_props_preserved_and_mangled(
        src,
        &["xstatic", "xdynamic"], // preserved
        &[],                      // mangled
        MangleOptions {
            top_level: Some(true),
            props: Some(ManglePropertiesOptions {
                ..Default::default()
            }),
            ..Default::default()
        },
    )
}

/// Test conditional dynamic access
#[test]
fn conditional_dynamic_access() {
    let src = r#"const obj = { xfoo: 1, xbar: 2 };
function get(useFirst) {
    const key = useFirst ? 'xfoo' : 'xbar';
    return obj[key];
}"#;

    // Properties should NOT be mangled (key is a variable, dynamic access)
    assert_props_preserved_and_mangled(
        src,
        &["xfoo", "xbar"], // preserved
        &[],               // mangled
        MangleOptions {
            top_level: Some(true),
            props: Some(ManglePropertiesOptions {
                ..Default::default()
            }),
            ..Default::default()
        },
    )
}

/// Test arrow function returning dynamic access
#[test]
fn arrow_function_dynamic_access() {
    let src = r#"const lookup = { xone: 1, xtwo: 2, xthree: 3 };
const get = (k) => lookup[k];"#;

    // Properties should NOT be mangled
    assert_props_preserved_and_mangled(
        src,
        &["xone", "xtwo", "xthree"], // preserved
        &[],                         // mangled
        MangleOptions {
            top_level: Some(true),
            props: Some(ManglePropertiesOptions {
                ..Default::default()
            }),
            ..Default::default()
        },
    )
}

/// Test shorthand property syntax
#[test]
fn shorthand_property_syntax() {
    let src = r#"const xfoo = 1;
const xbar = 2;
const obj = { xfoo, xbar };
console.log(obj.xfoo, obj.xbar);"#;

    // Properties should be mangled (static access)
    assert_props_preserved_and_mangled(
        src,
        &[],               // preserved
        &["xfoo", "xbar"], // mangled
        MangleOptions {
            top_level: Some(true),
            props: Some(ManglePropertiesOptions {
                ..Default::default()
            }),
            ..Default::default()
        },
    )
}

/// Test optional chaining with dynamic access
#[test]
fn optional_chaining_dynamic_access() {
    let src = r#"const obj = { xfoo: { xbar: 1 } };
function get(key) {
    return obj?.[key]?.xbar;
}"#;

    // xfoo should NOT be mangled (dynamic access with optional chaining)
    // xbar should be mangled (static access)
    assert_props_preserved_and_mangled(
        src,
        &["xfoo"], // preserved
        &["xbar"], // mangled
        MangleOptions {
            top_level: Some(true),
            props: Some(ManglePropertiesOptions {
                ..Default::default()
            }),
            ..Default::default()
        },
    )
}

/// Test assignment to dynamically accessed property
#[test]
fn assignment_to_dynamic_property() {
    let src = r#"const obj = { xfoo: 1, xbar: 2 };
function set(key, value) {
    obj[key] = value;
}"#;

    // Properties should NOT be mangled (dynamic assignment)
    assert_props_preserved_and_mangled(
        src,
        &["xfoo", "xbar"], // preserved
        &[],               // mangled
        MangleOptions {
            top_level: Some(true),
            props: Some(ManglePropertiesOptions {
                ..Default::default()
            }),
            ..Default::default()
        },
    )
}

/// Test increment/decrement on dynamic property
#[test]
fn increment_dynamic_property() {
    let src = r#"const counters = { xone: 0, xtwo: 0 };
function increment(name) {
    counters[name]++;
}"#;

    // Properties should NOT be mangled
    assert_props_preserved_and_mangled(
        src,
        &["xone", "xtwo"], // preserved
        &[],               // mangled
        MangleOptions {
            top_level: Some(true),
            props: Some(ManglePropertiesOptions {
                ..Default::default()
            }),
            ..Default::default()
        },
    )
}

/// Test delete operator with dynamic key
#[test]
fn delete_operator_dynamic_key() {
    let src = r#"const obj = { xfoo: 1, xbar: 2 };
function remove(key) {
    delete obj[key];
}"#;

    // Properties should NOT be mangled
    assert_props_preserved_and_mangled(
        src,
        &["xfoo", "xbar"], // preserved
        &[],               // mangled
        MangleOptions {
            top_level: Some(true),
            props: Some(ManglePropertiesOptions {
                ..Default::default()
            }),
            ..Default::default()
        },
    )
}

/// Test multilevel nesting with mixed access
#[test]
fn multilevel_nesting_mixed_access() {
    let src = r#"const data = {
    levelA: {
        nested: {
            xval: 1
        }
    }
};
function get(key) {
    return data[key].nested.xval;
}"#;

    // levelA should NOT be mangled (direct dynamic access)
    // nested and xval should be mangled (static access)
    assert_props_preserved_and_mangled(
        src,
        &["levelA"],         // preserved
        &["nested", "xval"], // mangled
        MangleOptions {
            top_level: Some(true),
            props: Some(ManglePropertiesOptions {
                ..Default::default()
            }),
            ..Default::default()
        },
    )
}

/// Test object as function argument (static access)
#[test]
fn object_as_function_arg() {
    let src = r#"function process(obj) {
    return obj.xprop;
}
const myObj = { xprop: 1 };
process(myObj);"#;

    // xprop should be mangled (static access)
    assert_props_preserved_and_mangled(
        src,
        &[],        // preserved
        &["xprop"], // mangled
        MangleOptions {
            top_level: Some(true),
            props: Some(ManglePropertiesOptions {
                ..Default::default()
            }),
            ..Default::default()
        },
    )
}

/// Test object returned from function
#[test]
fn object_returned_from_function() {
    let src = r#"function createObj() {
    return { xfoo: 1, xbar: 2 };
}
const obj = createObj();
console.log(obj.xfoo);"#;

    // Properties should be mangled (static access)
    assert_props_preserved_and_mangled(
        src,
        &[],               // preserved
        &["xfoo", "xbar"], // mangled
        MangleOptions {
            top_level: Some(true),
            props: Some(ManglePropertiesOptions {
                ..Default::default()
            }),
            ..Default::default()
        },
    )
}

/// Test callback with property access
#[test]
fn callback_property_access() {
    let src = r#"const state = { xcount: 0 };
[1, 2, 3].forEach(() => {
    state.xcount++;
});
console.log(state.xcount);"#;

    // xcount should be mangled
    assert_props_preserved_and_mangled(
        src,
        &[],         // preserved
        &["xcount"], // mangled
        MangleOptions {
            top_level: Some(true),
            props: Some(ManglePropertiesOptions {
                ..Default::default()
            }),
            ..Default::default()
        },
    )
}

/// Test logical assignment operators
#[test]
fn logical_assignment_operators() {
    let src = r#"const obj = { xfoo: null };
obj.xfoo ||= 1;
obj.xfoo &&= 2;
obj.xfoo ??= 3;
console.log(obj.xfoo);"#;

    // xfoo should be mangled
    assert_props_preserved_and_mangled(
        src,
        &[],       // preserved
        &["xfoo"], // mangled
        MangleOptions {
            top_level: Some(true),
            props: Some(ManglePropertiesOptions {
                ..Default::default()
            }),
            ..Default::default()
        },
    )
}

/// Test empty object literal with later assignment
#[test]
fn empty_object_literal() {
    let src = r#"const obj = {};
obj.xfoo = 1;
console.log(obj.xfoo);"#;

    // Dynamically added property should be mangled
    assert_props_preserved_and_mangled(
        src,
        &[],       // preserved
        &["xfoo"], // mangled
        MangleOptions {
            top_level: Some(true),
            props: Some(ManglePropertiesOptions {
                ..Default::default()
            }),
            ..Default::default()
        },
    )
}

/// Test issue #10332 original scenario - paper sizes
#[test]
fn issue_10332_paper_sizes() {
    let src = r#"const sizes = {
    A4: { xwidth: '21cm', xheight: '29.7cm' },
    Letter: { xwidth: '8.5in', xheight: '11in' },
    Legal: { xwidth: '8.5in', xheight: '14in' }
};
function getSize(paper) {
    const { xwidth, xheight } = sizes[paper];
    return xwidth + ' x ' + xheight;
}
console.log(getSize('A4'));"#;

    // A4, Letter, Legal should NOT be mangled (dynamic access)
    // xwidth, xheight should be mangled (static access on nested)
    assert_props_preserved_and_mangled(
        src,
        &["A4", "Letter", "Legal"], // preserved
        &["xwidth", "xheight"],     // mangled
        MangleOptions {
            top_level: Some(true),
            props: Some(ManglePropertiesOptions {
                ..Default::default()
            }),
            ..Default::default()
        },
    )
}

/// Test i18n-like pattern with double dynamic access
/// Note: Currently the feature only protects direct properties of
/// dynamically-accessed objects. For double dynamic access like `obj[a][b]`,
/// the intermediate properties (at the first level) are protected, but nested
/// properties (at the second level) may still be mangled since tracking runtime
/// return values is not supported.
#[test]
fn i18n_like_pattern() {
    let src = r#"const translations = {
    en: { xhello: 'Hello', xgoodbye: 'Goodbye' },
    es: { xhello: 'Hola', xgoodbye: 'Adiós' }
};
function translate(lang, key) {
    return translations[lang][key];
}
console.log(translate('en', 'xhello'));"#;

    // en, es should NOT be mangled (dynamic access on translations)
    // xhello, xgoodbye ARE mangled because the current implementation doesn't
    // track that the result of translations[lang] is also accessed dynamically.
    // This is a known limitation - tracking runtime return values would require
    // more complex data flow analysis.
    assert_props_preserved_and_mangled(
        src,
        &["en", "es"],           // preserved (direct dynamic access)
        &["xhello", "xgoodbye"], // mangled (nested objects not tracked)
        MangleOptions {
            top_level: Some(true),
            props: Some(ManglePropertiesOptions {
                ..Default::default()
            }),
            ..Default::default()
        },
    )
}
