use rustc_hash::{FxHashMap, FxHashSet};
use swc_atoms::Atom;

use crate::parser::reader::Reader;

/// Currently all of properties are read only from outside of this module.
/// Even inside of this module, it is not changed after initialized.
#[derive(Debug)]
pub struct State {
    // Mode flags
    pub unicode_mode: bool,
    pub unicode_sets_mode: bool,
    pub named_capture_groups: bool,
    // Other states
    pub num_of_capturing_groups: u32,
    pub capturing_group_names: FxHashSet<Atom>,
}

type DuplicatedNamedCapturingGroupOffsets = Vec<(u32, u32)>;

impl State {
    pub fn new(unicode_mode: bool, unicode_sets_mode: bool) -> Self {
        Self {
            unicode_mode,
            unicode_sets_mode,
            named_capture_groups: false,
            num_of_capturing_groups: 0,
            capturing_group_names: FxHashSet::default(),
        }
    }

    pub fn initialize_with_parsing(
        &mut self,
        reader: &mut Reader,
    ) -> Result<(), DuplicatedNamedCapturingGroupOffsets> {
        let (num_of_left_capturing_parens, capturing_group_names) = parse_capturing_groups(reader)?;

        // In Annex B, this is `false` by default.
        // It is `true`
        // - if `u` or `v` flag is set
        // - or if `GroupName` is found in pattern
        self.named_capture_groups =
            self.unicode_mode || self.unicode_sets_mode || !capturing_group_names.is_empty();

        self.num_of_capturing_groups = num_of_left_capturing_parens;
        self.capturing_group_names = capturing_group_names;

        Ok(())
    }
}

enum SimpleUnit {
    Open,
    Close,
    Pipe,
    GroupName(Atom),
}

/// Returns: Result<(num_of_left_parens, capturing_group_names),
/// duplicated_named_capturing_group_offsets>
fn parse_capturing_groups<'a>(
    reader: &mut Reader<'a>,
) -> Result<(u32, FxHashSet<Atom>), DuplicatedNamedCapturingGroupOffsets> {
    // Count only normal CapturingGroup(named, unnamed)
    //   (?<name>...), (...)
    // IgnoreGroup, and LookaroundAssertions are ignored
    //   (?:...)
    //   (?=...), (?!...), (?<=...), (?<!...)
    let mut num_of_left_capturing_parens = 0;

    // Collect capturing group names
    let mut group_names: FxHashMap<Atom, (u32, u32)> = FxHashMap::default();
    // At the same time, check duplicates
    // If you want to process this most efficiently:
    // - define a scope for each Disjunction
    // - then check for duplicates for each `|` while inheriting the parent-child
    //   relationship
    // ref. https://source.chromium.org/chromium/chromium/src/+/main:v8/src/regexp/regexp-parser.cc;l=1644
    // However, duplicates are rare in the first place.
    // And as long as it works simply, this may be enough.
    let mut may_duplicates: FxHashMap<Atom, DuplicatedNamedCapturingGroupOffsets> =
        FxHashMap::default();
    let mut simplified: Vec<SimpleUnit> = vec![];

    let mut in_escape = false;
    let mut in_character_class = false;
    while let Some(cp) = reader.peek() {
        if in_escape {
            in_escape = false;
        } else if cp == '\\' as u32 {
            in_escape = true;
        } else if cp == '[' as u32 {
            in_character_class = true;
        } else if cp == ']' as u32 {
            in_character_class = false;
        } else if !in_character_class && cp == '|' as u32 {
            simplified.push(SimpleUnit::Pipe);
        } else if !in_character_class && cp == ')' as u32 {
            simplified.push(SimpleUnit::Close);
        } else if !in_character_class && cp == '(' as u32 {
            reader.advance();

            simplified.push(SimpleUnit::Open);

            // Skip IgnoreGroup
            if reader.eat2('?', ':')
            // Skip LookAroundAssertion
                || reader.eat2('?', '=')
                || reader.eat2('?', '!')
                || reader.eat3('?', '<', '=')
                || reader.eat3('?', '<', '!')
            {
                continue;
            }

            // Count named or unnamed capturing groups
            num_of_left_capturing_parens += 1;

            // Collect capturing group names
            if reader.eat2('?', '<') {
                let span_start = reader.offset();
                while let Some(ch) = reader.peek() {
                    if ch == '>' as u32 {
                        break;
                    }
                    reader.advance();
                }
                let span_end = reader.offset();

                if reader.eat('>') {
                    let group_name = reader.atom(span_start, span_end);

                    simplified.push(SimpleUnit::GroupName(group_name.clone()));
                    // Check duplicates later
                    if let Some(last_span) = group_names.get(&group_name) {
                        let entry = may_duplicates.entry(group_name).or_default();
                        entry.push(*last_span);
                        entry.push((span_start, span_end));
                    } else {
                        group_names.insert(group_name, (span_start, span_end));
                    }

                    continue;
                }
            }

            // Unnamed
            continue;
        }

        reader.advance();
    }

    // Check duplicates and emit error if exists
    if !may_duplicates.is_empty() {
        // Check must be done for each group name
        for (group_name, spans) in may_duplicates {
            let iter = simplified.iter().clone();

            let mut alternative_depth = FxHashSet::default();
            let mut depth = 0_u32;
            let mut is_first = true;

            'outer: for token in iter {
                match token {
                    SimpleUnit::Open => {
                        depth += 1;
                    }
                    SimpleUnit::Close => {
                        // May panic if the pattern has invalid, unbalanced parens
                        depth = depth.saturating_sub(1);
                    }
                    SimpleUnit::Pipe => {
                        if !is_first {
                            alternative_depth.insert(depth);
                        }
                    }
                    SimpleUnit::GroupName(name) => {
                        // Check target group name only
                        if *name != group_name {
                            continue;
                        }
                        // Skip the first one, because it is not duplicated
                        if is_first {
                            is_first = false;
                            continue;
                        }

                        // If left outer `|` is found, both can participate
                        // `|(?<n>)`
                        //  ^   ^ depth: 1
                        //  ^ depth: 0
                        for i in (0..depth).rev() {
                            if alternative_depth.contains(&i) {
                                // Remove it, next duplicates requires another `|`
                                alternative_depth.remove(&i);
                                continue 'outer;
                            }
                        }

                        return Err(spans);
                    }
                }
            }
        }
    }

    Ok((
        num_of_left_capturing_parens,
        group_names.keys().cloned().collect(),
    ))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn count_capturing_groups() {
        for (source_text, expected) in [
            ("()", (1, 0)),
            (r"\1()", (1, 0)),
            ("(foo)", (1, 0)),
            ("(foo)(bar)", (2, 0)),
            ("(foo(bar))", (2, 0)),
            ("(foo)[(bar)]", (1, 0)),
            (r"(foo)\(bar\)", (1, 0)),
            ("(foo)(?<n>bar)", (2, 1)),
            ("(foo)(?=...)(?!...)(?<=...)(?<!...)(?:...)", (1, 0)),
            ("(foo)(?<n>bar)(?<nn>baz)", (3, 2)),
            ("(?<n>.)(?<m>.)|(?<n>..)|(?<m>.)", (4, 2)),
            ("(?<n>.)(?<m>.)|(?:..)|(?<m>.)", (3, 2)),
        ] {
            let mut reader = Reader::initialize(source_text, true, false).unwrap();

            let (num_of_left_capturing_parens, capturing_group_names) =
                parse_capturing_groups(&mut reader).unwrap();

            let actual = (num_of_left_capturing_parens, capturing_group_names.len());
            assert_eq!(expected, actual, "{source_text}");
        }
    }

    #[test]
    fn duplicated_named_capturing_groups() {
        for source_text in [
            "(?<n>.)(?<n>..)",
            "(?<n>.(?<n>..))",
            "|(?<n>.(?<n>..))",
            "(?<m>.)|(?<n>.(?<n>..))",
        ] {
            let mut reader = Reader::initialize(source_text, true, false).unwrap();

            assert!(
                parse_capturing_groups(&mut reader).is_err(),
                "{source_text}"
            );
        }
    }
}
