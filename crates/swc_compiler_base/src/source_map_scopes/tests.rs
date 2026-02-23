use swc_common::{sync::Lrc, FileName, FilePathMapping, SourceMap};
use swc_ecma_ast::EsVersion;
use swc_ecma_parser::{parse_file_as_program, EsSyntax, Syntax};

use super::{
    bindings::build_scope_bindings,
    collect::{collect_scopes, CollectedScope, CollectedVariable},
    encode::{
        encode_scopes, BindingTransition, BindingValue, Callsite, GeneratedRange, OriginalScope,
        ScopeInfo, ScopePosition,
    },
    positions::{MappingIndex, MappingPoint},
    SourceResolver,
};

#[test]
fn codec_emits_tags_in_spec_order() {
    let mut names = Vec::new();
    let info = ScopeInfo {
        scopes: vec![Some(OriginalScope {
            id: 0,
            start: ScopePosition { line: 0, column: 0 },
            end: ScopePosition {
                line: 0,
                column: 20,
            },
            name: Some("f".into()),
            kind: Some("Function".into()),
            is_stack_frame: true,
            variables: vec!["x".into()],
            children: vec![],
        })],
        ranges: vec![GeneratedRange {
            start: ScopePosition { line: 0, column: 0 },
            end: ScopePosition {
                line: 0,
                column: 20,
            },
            is_stack_frame: true,
            is_hidden: false,
            original_scope_id: Some(0),
            callsite: Some(Callsite {
                source_idx: 0,
                line: 0,
                column: 0,
            }),
            values: vec![BindingValue::WithSubRanges {
                initial: Some("x".into()),
                transitions: vec![BindingTransition {
                    from: ScopePosition {
                        line: 0,
                        column: 10,
                    },
                    value: Some("a".into()),
                }],
            }],
            children: vec![],
        }],
    };

    let encoded = encode_scopes(&info, &mut names).unwrap();
    let tags = encoded
        .split(',')
        .filter_map(|part| part.chars().next())
        .collect::<Vec<_>>();

    assert_eq!(tags, vec!['B', 'D', 'C', 'E', 'G', 'H', 'I', 'F']);
    assert!(names.iter().any(|name| name == "f"));
    assert!(names.iter().any(|name| name == "Function"));
    assert!(names.iter().any(|name| name == "x"));
    assert!(names.iter().any(|name| name == "a"));
}

#[test]
fn collect_scopes_tracks_nested_shadowed_bindings() {
    let cm = Lrc::new(SourceMap::new(FilePathMapping::empty()));
    let fm = cm.new_source_file(
        FileName::Real("input.js".into()).into(),
        "function outer(a) { let x = 1; { let x = 2; } catchIt(); }",
    );

    let mut errors = Vec::new();
    let program = parse_file_as_program(
        &fm,
        Syntax::Es(EsSyntax::default()),
        EsVersion::Es2022,
        None,
        &mut errors,
    )
    .unwrap();
    assert!(errors.is_empty());

    let resolver = SourceResolver::new(None, None, &["input.js".into()]);
    let collected = collect_scopes(cm, &program, resolver, 1);

    let x_scope_count = collected
        .scopes
        .iter()
        .filter(|scope| scope.variables.iter().any(|variable| variable.name == "x"))
        .count();
    assert!(x_scope_count >= 2);

    let has_outer_function = collected.scopes.iter().any(|scope| {
        scope.kind.as_deref() == Some("Function") && scope.name.as_deref() == Some("outer")
    });
    assert!(has_outer_function);
}

#[test]
fn bindings_emit_sub_ranges_when_generated_name_changes() {
    let scope = CollectedScope {
        source_idx: Some(0),
        start: ScopePosition { line: 0, column: 0 },
        end: ScopePosition {
            line: 0,
            column: 10,
        },
        name: Some("scope".into()),
        kind: Some("Function".into()),
        is_stack_frame: true,
        is_function_boundary: true,
        parent: None,
        children: vec![],
        variables: vec![CollectedVariable {
            name: "value".into(),
            start: ScopePosition { line: 0, column: 0 },
            end: ScopePosition {
                line: 0,
                column: 10,
            },
        }],
    };
    let mappings = MappingIndex::from_points(vec![vec![
        MappingPoint {
            original: ScopePosition { line: 0, column: 1 },
            generated: ScopePosition { line: 0, column: 1 },
            generated_name: Some("a".into()),
        },
        MappingPoint {
            original: ScopePosition { line: 0, column: 5 },
            generated: ScopePosition { line: 0, column: 5 },
            generated_name: Some("a".into()),
        },
        MappingPoint {
            original: ScopePosition { line: 0, column: 8 },
            generated: ScopePosition { line: 0, column: 8 },
            generated_name: Some("b".into()),
        },
    ]]);

    let values = build_scope_bindings(
        &scope,
        0,
        ScopePosition { line: 0, column: 0 },
        ScopePosition {
            line: 0,
            column: 12,
        },
        &mappings,
    );

    match &values[0] {
        BindingValue::WithSubRanges {
            initial,
            transitions,
        } => {
            assert_eq!(initial.as_deref(), Some("a"));
            assert_eq!(transitions.len(), 1);
            assert_eq!(transitions[0].value.as_deref(), Some("b"));
        }
        other => panic!("expected sub-range binding, got {other:?}"),
    }
}

#[test]
fn bindings_emit_unavailable_when_name_is_missing() {
    let scope = CollectedScope {
        source_idx: Some(0),
        start: ScopePosition { line: 0, column: 0 },
        end: ScopePosition { line: 0, column: 5 },
        name: None,
        kind: Some("Block".into()),
        is_stack_frame: false,
        is_function_boundary: false,
        parent: None,
        children: vec![],
        variables: vec![CollectedVariable {
            name: "value".into(),
            start: ScopePosition { line: 0, column: 0 },
            end: ScopePosition { line: 0, column: 5 },
        }],
    };
    let mappings = MappingIndex::from_points(vec![vec![MappingPoint {
        original: ScopePosition { line: 0, column: 1 },
        generated: ScopePosition { line: 0, column: 1 },
        generated_name: None,
    }]]);

    let values = build_scope_bindings(
        &scope,
        0,
        ScopePosition { line: 0, column: 0 },
        ScopePosition { line: 0, column: 6 },
        &mappings,
    );

    assert!(matches!(values[0], BindingValue::Simple(None)));
}
