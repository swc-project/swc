//! Named capture groups transformation.
//!
//! Transforms named capture groups and named backreferences to their indexed
//! forms for broader syntax compatibility.

use std::collections::HashMap;

use swc_atoms::Atom;
use swc_ecma_regexp_ast::{CapturingGroup, IndexedReference, Pattern, Term};
use swc_ecma_regexp_visit::{Visit, VisitMut, VisitMutWith, VisitWith};

/// Transforms named capture groups and named backreferences in a regex pattern.
///
/// This transformation is syntax-only:
/// - `(?<name>...)` -> `(...)`
/// - `\k<name>` -> `\N`
///
/// If a named backreference cannot be resolved, it is left unchanged.
pub fn transform_named_capture_groups(pattern: &mut Pattern) {
    let mut collector = CaptureGroupCollector::default();
    pattern.visit_with(&mut collector);

    if collector.name_to_index.is_empty() {
        return;
    }

    let mut transformer = NamedCaptureGroupTransformer {
        name_to_index: &collector.name_to_index,
    };
    pattern.visit_mut_with(&mut transformer);
}

#[derive(Default)]
struct CaptureGroupCollector {
    next_index: u32,
    name_to_index: HashMap<Atom, u32>,
}

impl Visit for CaptureGroupCollector {
    fn visit_capturing_group(&mut self, group: &CapturingGroup) {
        self.next_index += 1;

        if let Some(name) = &group.name {
            self.name_to_index
                .entry(name.clone())
                .or_insert(self.next_index);
        }

        group.body.visit_with(self);
    }
}

struct NamedCaptureGroupTransformer<'a> {
    name_to_index: &'a HashMap<Atom, u32>,
}

impl VisitMut for NamedCaptureGroupTransformer<'_> {
    fn visit_mut_term(&mut self, term: &mut Term) {
        match term {
            Term::CapturingGroup(group) => {
                group.name = None;
                group.body.visit_mut_with(self);
            }
            Term::NamedReference(named_ref) => {
                if let Some(&index) = self.name_to_index.get(&named_ref.name) {
                    *term = Term::IndexedReference(Box::new(IndexedReference {
                        span: named_ref.span,
                        index,
                    }));
                }
            }
            _ => {
                term.visit_mut_children_with(self);
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use swc_ecma_regexp::{LiteralParser, Options};

    use super::transform_named_capture_groups;

    fn parse_and_transform(pattern: &str, flags: &str) -> String {
        let mut ast = LiteralParser::new(pattern, Some(flags), Options::default())
            .parse()
            .unwrap();
        transform_named_capture_groups(&mut ast);
        ast.to_string()
    }

    #[test]
    fn removes_named_capture_group_syntax() {
        let actual = parse_and_transform(r"(?<year>\d{4})-(?<month>\d{2})", "");
        assert_eq!(actual, r"(\d{4})-(\d{2})");
    }

    #[test]
    fn transforms_named_backreference_to_indexed_reference() {
        let actual = parse_and_transform(r"(?<tag>a)\k<tag>", "");
        assert_eq!(actual, r"(a)\1");
    }

    #[test]
    fn keeps_mixed_capture_indices_stable() {
        let actual = parse_and_transform(r"(.)(?<a>b)(?<b>c)\k<a>\k<b>", "");
        assert_eq!(actual, r"(.)(b)(c)\2\3");
    }
}
