//! Named capture groups transformation.
//!
//! Transforms named capture groups and named backreferences to their indexed
//! forms for broader syntax compatibility.

use std::collections::HashMap;

use swc_atoms::Atom;
use swc_ecma_regexp_ast::{CapturingGroup, IndexedReference, Pattern, Term};
use swc_ecma_regexp_visit::{Visit, VisitMut, VisitMutWith, VisitWith};

/// Named capture group mapping used for runtime group reconstruction.
///
/// Each entry contains the group name and the list of positional capture
/// indices associated with that name.
pub type NamedCaptureGroups = Vec<(Atom, Vec<u32>)>;

/// Transforms named capture groups and named backreferences in a regex pattern.
///
/// This transformation is syntax-only:
/// - `(?<name>...)` -> `(...)`
/// - `\k<name>` -> `\N`
///
/// If a named backreference cannot be resolved, it is left unchanged.
pub fn transform_named_capture_groups(pattern: &mut Pattern) {
    let _ = transform_named_capture_groups_with_info(pattern);
}

/// Transforms named capture groups and named backreferences while collecting
/// positional indices for each named capture group.
pub fn transform_named_capture_groups_with_info(pattern: &mut Pattern) -> NamedCaptureGroups {
    let mut collector = CaptureGroupCollector::default();
    pattern.visit_with(&mut collector);

    if collector.first_index_by_name.is_empty() {
        return Vec::new();
    }

    let mut transformer = NamedCaptureGroupTransformer {
        first_index_by_name: &collector.first_index_by_name,
    };
    pattern.visit_mut_with(&mut transformer);

    collector.named_groups
}

#[derive(Default)]
struct CaptureGroupCollector {
    next_index: u32,
    first_index_by_name: HashMap<Atom, u32>,
    name_to_slot: HashMap<Atom, usize>,
    named_groups: NamedCaptureGroups,
}

impl Visit for CaptureGroupCollector {
    fn visit_capturing_group(&mut self, group: &CapturingGroup) {
        self.next_index += 1;

        if let Some(name) = &group.name {
            self.first_index_by_name
                .entry(name.clone())
                .or_insert(self.next_index);

            let slot = *self.name_to_slot.entry(name.clone()).or_insert_with(|| {
                let slot = self.named_groups.len();
                self.named_groups.push((name.clone(), Vec::new()));
                slot
            });
            self.named_groups[slot].1.push(self.next_index);
        }

        group.body.visit_with(self);
    }
}

struct NamedCaptureGroupTransformer<'a> {
    first_index_by_name: &'a HashMap<Atom, u32>,
}

impl VisitMut for NamedCaptureGroupTransformer<'_> {
    fn visit_mut_term(&mut self, term: &mut Term) {
        match term {
            Term::CapturingGroup(group) => {
                group.name = None;
                group.body.visit_mut_with(self);
            }
            Term::NamedReference(named_ref) => {
                if let Some(&index) = self.first_index_by_name.get(&named_ref.name) {
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
    use swc_atoms::Atom;
    use swc_ecma_regexp::{LiteralParser, Options};

    use super::{transform_named_capture_groups, transform_named_capture_groups_with_info};

    fn parse_and_transform(pattern: &str, flags: &str) -> String {
        let mut ast = LiteralParser::new(pattern, Some(flags), Options::default())
            .parse()
            .unwrap();
        transform_named_capture_groups(&mut ast);
        ast.to_string()
    }

    fn parse_transform_and_collect(pattern: &str, flags: &str) -> (String, Vec<(Atom, Vec<u32>)>) {
        let mut ast = LiteralParser::new(pattern, Some(flags), Options::default())
            .parse()
            .unwrap();
        let named_groups = transform_named_capture_groups_with_info(&mut ast);
        (ast.to_string(), named_groups)
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

    #[test]
    fn collects_named_capture_group_indices_for_runtime_mapping() {
        let (actual, named_groups) = parse_transform_and_collect(r"(?<left>a)|(?<left>b)", "");

        assert_eq!(actual, r"(a)|(b)");
        assert_eq!(named_groups, vec![(Atom::from("left"), vec![1, 2])]);
    }
}
