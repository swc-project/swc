#![deny(warnings)]

use std::sync::Arc;

use swc_common::{FileName, SourceMap, GLOBALS};
use swc_ecma_ast::*;
use swc_ecma_minifier::{
    optimize,
    option::{ExtraOptions, MangleOptions, MinifyOptions},
};
use swc_ecma_parser::{parse_file_as_module, Syntax};
use swc_ecma_visit::{Visit, VisitWith};

// A simple visitor to count class method names
struct MethodNameCounter {
    method_names: Vec<String>,
}

impl Visit for MethodNameCounter {
    fn visit_class_method(&mut self, n: &ClassMethod) {
        if let PropName::Ident(ident) = &n.key {
            // Skip constructor
            if ident.sym != "constructor" && ident.sym != "toString" {
                self.method_names.push(ident.sym.to_string());
            }
        }

        n.visit_children_with(self);
    }

    fn visit_method_prop(&mut self, n: &MethodProp) {
        if let PropName::Ident(ident) = &n.key {
            self.method_names.push(ident.sym.to_string());
        }

        n.visit_children_with(self);
    }
}

fn count_method_names(program: &Program) -> Vec<String> {
    let mut counter = MethodNameCounter {
        method_names: Vec::new(),
    };
    program.visit_with(&mut counter);
    counter.method_names
}

#[test]
fn test_method_mangling_enabled() {
    GLOBALS.set(&Default::default(), || {
        let src = include_str!("method_mangling.js");

        let cm = Arc::new(SourceMap::default());
        let fm = cm.new_source_file(FileName::Anon.into(), src.into());

        let p = parse_file_as_module(
            &fm,
            Syntax::default(),
            EsVersion::Es2020,
            None,
            &mut Vec::new(),
        )
        .unwrap();

        // Get the original method names
        let original_method_names = count_method_names(&Program::Module(p.clone()));

        // Ensure original method names are as expected
        assert!(original_method_names.contains(&"calculateValue".to_string()));
        assert!(original_method_names.contains(&"increaseValue".to_string()));
        assert!(original_method_names.contains(&"usePrivate".to_string()));
        assert!(original_method_names.contains(&"methodA".to_string()));
        assert!(original_method_names.contains(&"methodB".to_string()));

        let unresolved_mark = Default::default();
        let top_level_mark = Default::default();

        let optimized = optimize(
            Program::Module(p),
            cm.clone(),
            None,
            None,
            &MinifyOptions {
                mangle: Some(MangleOptions {
                    mangle_methods: true,
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

        // Get the mangled method names
        let mangled_method_names = count_method_names(&optimized);

        // Print out for debugging
        println!("Original method names: {original_method_names:?}",);
        println!("Mangled method names: {mangled_method_names:?}",);

        // Verify that methods were mangled - they should be shorter
        for name in &mangled_method_names {
            assert!(
                name.len() <= 2,
                "Method name should be mangled to a short name: {name}",
            );
        }

        // Verify we have the correct number of methods
        assert_eq!(
            mangled_method_names.len(),
            5,
            "Expected 5 method names after mangling"
        );
    });
}

#[test]
fn test_method_mangling_disabled() {
    GLOBALS.set(&Default::default(), || {
        let src = include_str!("method_mangling.js");

        let cm = Arc::new(SourceMap::default());
        let fm = cm.new_source_file(FileName::Anon.into(), src.into());

        let p = parse_file_as_module(
            &fm,
            Syntax::default(),
            EsVersion::Es2020,
            None,
            &mut Vec::new(),
        )
        .unwrap();

        // Get the original method names
        let original_method_names = count_method_names(&Program::Module(p.clone()));

        let unresolved_mark = Default::default();
        let top_level_mark = Default::default();

        let optimized = optimize(
            Program::Module(p),
            cm.clone(),
            None,
            None,
            &MinifyOptions {
                mangle: Some(MangleOptions {
                    mangle_methods: false,
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

        let output_method_names = count_method_names(&optimized);

        println!("Original method names: {original_method_names:?}");
        println!("Output method names: {output_method_names:?}");

        assert!(output_method_names.contains(&"calculateValue".to_string()));
        assert!(output_method_names.contains(&"increaseValue".to_string()));
        assert!(output_method_names.contains(&"usePrivate".to_string()));
        assert!(output_method_names.contains(&"methodA".to_string()));
        assert!(output_method_names.contains(&"methodB".to_string()));
    });
}
