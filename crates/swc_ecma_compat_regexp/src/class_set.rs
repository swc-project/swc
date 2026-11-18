//! Evaluation of character classes to explicit sets.

use icu_properties::{props::BasicEmoji, EmojiSetData};
use swc_ecma_regexp_ast::{
    CharacterClass, CharacterClassContents, CharacterClassContentsKind, CharacterClassEscapeKind,
    ClassStringDisjunction, UnicodePropertyEscape,
};

use crate::{
    case_fold::{case_closure, simple_case_folding_key, CaseMode},
    char_set::{CharSet, MAX_CODE_POINT, MAX_CODE_UNIT},
    error::LowerError,
    unicode_property::get_property_ranges,
};

/// The characters and strings that a character class matches.
#[derive(Debug, Clone, Default, PartialEq, Eq)]
pub(crate) struct ClassSet {
    pub chars: CharSet,
    /// Strings whose length is not 1, sorted and without duplicates. Only a
    /// class of a `v` pattern can contain strings.
    pub strings: Vec<Vec<u32>>,
}

impl ClassSet {
    fn from_chars(chars: CharSet) -> Self {
        Self {
            chars,
            strings: Vec::new(),
        }
    }

    /// Returns the union of all `sets`. The ranges and strings are collected
    /// first and normalized once, so a class with many operands takes
    /// `O(n log n)` time.
    fn union_all(sets: Vec<Self>) -> Self {
        let mut ranges = Vec::new();
        let mut strings = Vec::new();
        for set in sets {
            ranges.extend_from_slice(set.chars.ranges());
            strings.extend(set.strings);
        }
        strings.sort_unstable();
        strings.dedup();

        Self {
            chars: CharSet::from_ranges(ranges),
            strings,
        }
    }

    fn intersection(mut self, other: &Self) -> Self {
        self.chars = self.chars.intersection(&other.chars);
        self.strings
            .retain(|s| other.strings.binary_search(s).is_ok());
        self
    }

    fn difference(mut self, other: &Self) -> Self {
        self.chars = self.chars.difference(&other.chars);
        self.strings
            .retain(|s| other.strings.binary_search(s).is_err());
        self
    }
}

/// The flags that change the meaning of a character class.
#[derive(Debug, Clone, Copy)]
pub(crate) struct ClassContext {
    /// The `u` or the `v` flag is set.
    pub unicode: bool,
    /// The `v` flag is set.
    pub unicode_sets: bool,
    /// The `i` flag, or an `i` modifier, applies to the class.
    pub ignore_case: bool,
}

impl ClassContext {
    /// The largest character that the pattern can match.
    pub(crate) fn max_char(self) -> u32 {
        if self.unicode {
            MAX_CODE_POINT
        } else {
            MAX_CODE_UNIT
        }
    }

    pub(crate) fn case_mode(self) -> CaseMode {
        if self.unicode {
            CaseMode::Unicode
        } else {
            CaseMode::Legacy
        }
    }

    /// In a case-insensitive `v` pattern, every operand is case folded
    /// (`MaybeSimpleCaseFolding` of ECMA-262) before set operations and
    /// complements are applied.
    ///
    /// This function returns the case closure of `chars` instead of the folded
    /// set. Both describe the same characters, because the engine matches a
    /// character if its simple case folding is in the folded set. Closed sets
    /// keep this property under union, intersection, subtraction and
    /// complement, so the result of the operations is also closed.
    fn fold_operand(self, chars: CharSet) -> CharSet {
        if self.unicode_sets && self.ignore_case {
            case_closure(&chars, CaseMode::Unicode)
        } else {
            chars
        }
    }

    /// Folds the characters of a string in a case-insensitive `v` pattern.
    fn fold_string(self, string: &mut [u32]) {
        if self.unicode_sets && self.ignore_case {
            for cp in string {
                *cp = simple_case_folding_key(*cp);
            }
        }
    }
}

/// Evaluates the contents of `class` without its `^` negation.
///
/// The caller applies the negation, because its meaning depends on whether the
/// `i` flag is lowered. For a `v` pattern, the operands are case folded as
/// described in [`ClassContext::fold_operand`].
pub(crate) fn eval_class_contents(
    class: &CharacterClass,
    ctx: ClassContext,
) -> Result<ClassSet, LowerError> {
    if class.kind == CharacterClassContentsKind::Union {
        let operands = class
            .body
            .iter()
            .map(|operand| eval_contents(operand, ctx))
            .collect::<Result<Vec<_>, _>>()?;
        return Ok(ClassSet::union_all(operands));
    }

    let mut operands = class.body.iter();
    let Some(first) = operands.next() else {
        return Ok(ClassSet::default());
    };

    let mut result = eval_contents(first, ctx)?;
    for operand in operands {
        let operand = eval_contents(operand, ctx)?;
        result = if class.kind == CharacterClassContentsKind::Intersection {
            result.intersection(&operand)
        } else {
            result.difference(&operand)
        };
    }

    Ok(result)
}

fn eval_contents(
    contents: &CharacterClassContents,
    ctx: ClassContext,
) -> Result<ClassSet, LowerError> {
    Ok(match contents {
        CharacterClassContents::Character(ch) => {
            ClassSet::from_chars(ctx.fold_operand(CharSet::single(ch.value)))
        }
        CharacterClassContents::CharacterClassRange(range) => ClassSet::from_chars(
            ctx.fold_operand(CharSet::from_ranges([(range.min.value, range.max.value)])),
        ),
        CharacterClassContents::CharacterClassEscape(escape) => {
            ClassSet::from_chars(class_escape_chars(escape.kind, ctx))
        }
        CharacterClassContents::UnicodePropertyEscape(prop) => property_set(prop, ctx)?,
        CharacterClassContents::NestedCharacterClass(nested) => {
            let mut set = eval_class_contents(nested, ctx)?;
            if nested.negative {
                // A negated class cannot contain strings (early error).
                set.chars = set.chars.complement(ctx.max_char());
            }
            set
        }
        CharacterClassContents::ClassStringDisjunction(disjunction) => {
            string_disjunction_set(disjunction, ctx)
        }
    })
}

/// Returns the characters of `\d`, `\s`, `\w` and their negations.
pub(crate) fn class_escape_chars(kind: CharacterClassEscapeKind, ctx: ClassContext) -> CharSet {
    let (positive, negative) = match kind {
        CharacterClassEscapeKind::D => (digit_chars(), false),
        CharacterClassEscapeKind::NegativeD => (digit_chars(), true),
        CharacterClassEscapeKind::S => (space_chars(), false),
        CharacterClassEscapeKind::NegativeS => (space_chars(), true),
        CharacterClassEscapeKind::W => (word_chars(ctx), false),
        CharacterClassEscapeKind::NegativeW => (word_chars(ctx), true),
    };

    // `\d` and `\s` have no case variants, and `word_chars` is already closed.
    if negative {
        positive.complement(ctx.max_char())
    } else {
        positive
    }
}

fn digit_chars() -> CharSet {
    CharSet::from_ranges([('0' as u32, '9' as u32)])
}

/// `WhiteSpace` and `LineTerminator` of ECMA-262.
fn space_chars() -> CharSet {
    CharSet::from_ranges([
        (0x09, 0x0d),
        (0x20, 0x20),
        (0xa0, 0xa0),
        (0x1680, 0x1680),
        (0x2000, 0x200a),
        (0x2028, 0x2029),
        (0x202f, 0x202f),
        (0x205f, 0x205f),
        (0x3000, 0x3000),
        (0xfeff, 0xfeff),
    ])
}

/// `WordCharacters(rer)` of ECMA-262.
///
/// With the `u` or `v` flag and case-insensitive matching, the set also
/// contains the characters that case fold to a basic word character:
/// `U+017F` (ſ) and `U+212A` (Kelvin sign).
fn word_chars(ctx: ClassContext) -> CharSet {
    let basic = CharSet::from_ranges([
        ('0' as u32, '9' as u32),
        ('A' as u32, 'Z' as u32),
        ('_' as u32, '_' as u32),
        ('a' as u32, 'z' as u32),
    ]);

    if ctx.unicode && ctx.ignore_case {
        case_closure(&basic, CaseMode::Unicode)
    } else {
        basic
    }
}

/// Evaluates a Unicode property escape.
fn property_set(prop: &UnicodePropertyEscape, ctx: ClassContext) -> Result<ClassSet, LowerError> {
    if prop.strings {
        // `\P{...}` of a property of strings is an early error.
        return property_of_strings_set(prop, ctx);
    }

    let chars = CharSet::from_ranges(
        get_property_ranges(prop)
            .ok_or(LowerError::UnsupportedProperty)?
            .into_iter()
            .map(|range| (*range.start(), *range.end())),
    );

    // In a `v` pattern, `\P{...}` is the complement of the folded property.
    // Elsewhere it is the plain complement, and case-insensitive matching is
    // applied to the result.
    let chars = ctx.fold_operand(chars);
    Ok(ClassSet::from_chars(if prop.negative {
        chars.complement(ctx.max_char())
    } else {
        chars
    }))
}

/// Evaluates a property of strings, such as `\p{Basic_Emoji}`.
///
/// Only `Basic_Emoji` is available in the Unicode data of this crate. The
/// other properties of strings (`RGI_Emoji` and its parts) are reported as
/// unsupported.
fn property_of_strings_set(
    prop: &UnicodePropertyEscape,
    ctx: ClassContext,
) -> Result<ClassSet, LowerError> {
    if prop.name != "Basic_Emoji" || prop.value.is_some() {
        return Err(LowerError::UnsupportedProperty);
    }

    let data = EmojiSetData::new::<BasicEmoji>().static_to_owned();
    let list = data.to_code_point_inversion_list_string_list();

    let chars = CharSet::from_ranges(
        list.code_points()
            .iter_ranges()
            .map(|range| (*range.start(), *range.end())),
    );
    let mut strings: Vec<Vec<u32>> = list
        .strings()
        .iter()
        .map(|s| {
            let mut string: Vec<u32> = s.chars().map(|ch| ch as u32).collect();
            ctx.fold_string(&mut string);
            string
        })
        .collect();
    strings.sort_unstable();
    strings.dedup();

    Ok(ClassSet {
        chars: ctx.fold_operand(chars),
        strings,
    })
}

/// Evaluates `\q{...}`. A string of one character is added to the characters.
fn string_disjunction_set(disjunction: &ClassStringDisjunction, ctx: ClassContext) -> ClassSet {
    let mut set = ClassSet::default();

    for string in &disjunction.body {
        if let [ch] = string.body.as_slice() {
            set.chars = set
                .chars
                .union(&ctx.fold_operand(CharSet::single(ch.value)));
        } else {
            let mut string: Vec<u32> = string.body.iter().map(|ch| ch.value).collect();
            ctx.fold_string(&mut string);
            set.strings.push(string);
        }
    }

    set.strings.sort_unstable();
    set.strings.dedup();
    set
}
