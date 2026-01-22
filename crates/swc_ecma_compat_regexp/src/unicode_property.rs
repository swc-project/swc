//! Unicode property escape transformation.
//!
//! Transforms `\p{Property}` and `\P{Property}` escapes into character classes
//! that are compatible with older JavaScript engines.

use std::ops::RangeInclusive;

use icu_properties::{
    props::{
        Alphabetic, AsciiHexDigit, BidiControl, BidiMirrored, CaseIgnorable, Cased,
        ChangesWhenCasefolded, ChangesWhenCasemapped, ChangesWhenLowercased,
        ChangesWhenNfkcCasefolded, ChangesWhenTitlecased, ChangesWhenUppercased, Dash,
        DefaultIgnorableCodePoint, Deprecated, Diacritic, Emoji, EmojiComponent, EmojiModifier,
        EmojiModifierBase, EmojiPresentation, ExtendedPictographic, Extender, GeneralCategory,
        GeneralCategoryGroup, GraphemeBase, GraphemeExtend, HexDigit, IdContinue, IdStart,
        Ideographic, IdsBinaryOperator, IdsTrinaryOperator, JoinControl, LogicalOrderException,
        Lowercase, Math, NoncharacterCodePoint, PatternSyntax, PatternWhiteSpace, QuotationMark,
        Radical, RegionalIndicator, Script, SentenceTerminal, SoftDotted, TerminalPunctuation,
        UnifiedIdeograph, Uppercase, VariationSelector, WhiteSpace, XidContinue, XidStart,
    },
    CodePointMapData, CodePointSetData,
};
use swc_ecma_regexp_ast::{
    Character, CharacterClass, CharacterClassContents, CharacterClassContentsKind,
    CharacterClassRange, CharacterKind, Pattern, Term, UnicodePropertyEscape,
};
use swc_ecma_regexp_visit::{VisitMut, VisitMutWith};

/// Transforms unicode property escapes in a regex pattern into character
/// classes.
///
/// # Arguments
/// * `pattern` - The parsed regex pattern AST
/// * `use_unicode_flag` - If true, output uses `\u{XXXX}` escapes (for patterns
///   that will keep the `u` flag). If false, output uses surrogate pairs for
///   astral code points.
///
/// # Returns
/// The transformed pattern with unicode property escapes expanded to character
/// classes.
pub fn transform_unicode_property_escapes(pattern: &mut Pattern, use_unicode_flag: bool) {
    let mut transformer = UnicodePropertyTransformer { use_unicode_flag };
    pattern.visit_mut_with(&mut transformer);
}

struct UnicodePropertyTransformer {
    use_unicode_flag: bool,
}

impl VisitMut for UnicodePropertyTransformer {
    fn visit_mut_terms(&mut self, terms: &mut Vec<Term>) {
        let mut new_terms = Vec::with_capacity(terms.len());

        for term in terms.drain(..) {
            match term {
                Term::UnicodePropertyEscape(prop) => {
                    if let Some(class) = expand_unicode_property(&prop, self.use_unicode_flag) {
                        new_terms.push(Term::CharacterClass(Box::new(class)));
                    } else {
                        // If we can't expand it, keep the original
                        new_terms.push(Term::UnicodePropertyEscape(prop));
                    }
                }
                Term::Quantifier(mut q) => {
                    // Handle quantified unicode property escapes
                    if let Term::UnicodePropertyEscape(prop) = &q.body {
                        if let Some(class) = expand_unicode_property(prop, self.use_unicode_flag) {
                            q.body = Term::CharacterClass(Box::new(class));
                        }
                    }
                    // Recursively transform the body
                    let mut body_terms = vec![q.body];
                    self.visit_mut_terms(&mut body_terms);
                    q.body = body_terms.into_iter().next().unwrap();
                    new_terms.push(Term::Quantifier(q));
                }
                other => {
                    new_terms.push(other);
                }
            }
        }

        *terms = new_terms;

        // Continue visiting children
        for term in terms.iter_mut() {
            term.visit_mut_children_with(self);
        }
    }

    fn visit_mut_character_class_contentss(&mut self, contents: &mut Vec<CharacterClassContents>) {
        let mut new_contents = Vec::with_capacity(contents.len());

        for content in contents.drain(..) {
            match content {
                CharacterClassContents::UnicodePropertyEscape(prop) => {
                    // Inside a character class, we need to inline the ranges directly
                    if let Some(ranges) = get_property_ranges(&prop) {
                        for range in ranges {
                            let start = *range.start();
                            let end = *range.end();
                            if start == end {
                                new_contents.push(CharacterClassContents::Character(Box::new(
                                    Character {
                                        span: prop.span,
                                        kind: CharacterKind::UnicodeEscape,
                                        value: start,
                                    },
                                )));
                            } else {
                                new_contents.push(CharacterClassContents::CharacterClassRange(
                                    Box::new(CharacterClassRange {
                                        span: prop.span,
                                        min: Character {
                                            span: prop.span,
                                            kind: CharacterKind::UnicodeEscape,
                                            value: start,
                                        },
                                        max: Character {
                                            span: prop.span,
                                            kind: CharacterKind::UnicodeEscape,
                                            value: end,
                                        },
                                    }),
                                ));
                            }
                        }
                    } else {
                        // Keep original if we can't expand
                        new_contents.push(CharacterClassContents::UnicodePropertyEscape(prop));
                    }
                }
                other => {
                    new_contents.push(other);
                }
            }
        }

        *contents = new_contents;

        // Continue visiting children
        for content in contents.iter_mut() {
            content.visit_mut_children_with(self);
        }
    }
}

/// Expands a unicode property escape into a character class.
fn expand_unicode_property(
    prop: &UnicodePropertyEscape,
    _use_unicode_flag: bool,
) -> Option<CharacterClass> {
    let ranges = get_property_ranges(prop)?;

    let mut body = Vec::new();

    for range in ranges {
        let start = *range.start();
        let end = *range.end();

        if start == end {
            body.push(CharacterClassContents::Character(Box::new(Character {
                span: prop.span,
                kind: CharacterKind::UnicodeEscape,
                value: start,
            })));
        } else {
            body.push(CharacterClassContents::CharacterClassRange(Box::new(
                CharacterClassRange {
                    span: prop.span,
                    min: Character {
                        span: prop.span,
                        kind: CharacterKind::UnicodeEscape,
                        value: start,
                    },
                    max: Character {
                        span: prop.span,
                        kind: CharacterKind::UnicodeEscape,
                        value: end,
                    },
                },
            )));
        }
    }

    Some(CharacterClass {
        span: prop.span,
        negative: prop.negative,
        strings: false,
        kind: CharacterClassContentsKind::Union,
        body,
    })
}

/// Gets the code point ranges for a unicode property.
fn get_property_ranges(prop: &UnicodePropertyEscape) -> Option<Vec<RangeInclusive<u32>>> {
    let name = prop.name.as_str();
    let value = prop.value.as_deref();

    get_unicode_property_ranges(name, value)
}

/// Gets the code point ranges for a unicode property.
fn get_unicode_property_ranges(
    name: &str,
    value: Option<&str>,
) -> Option<Vec<RangeInclusive<u32>>> {
    match (name, value) {
        // General_Category with value
        ("General_Category" | "gc", Some(val)) => get_general_category_ranges(val),

        // Script property
        ("Script" | "sc", Some(val)) => get_script_ranges(val),

        // Script_Extensions property
        ("Script_Extensions" | "scx", Some(val)) => get_script_extensions_ranges(val),

        // Lone property name - could be General_Category value or binary property
        (name_or_value, None) => {
            // First try as General_Category value
            if let Some(ranges) = get_general_category_ranges(name_or_value) {
                return Some(ranges);
            }
            // Then try as binary property
            get_binary_property_ranges(name_or_value)
        }

        _ => None,
    }
}

/// Maps General_Category value names to their ranges.
fn get_general_category_ranges(value: &str) -> Option<Vec<RangeInclusive<u32>>> {
    let gc_map = CodePointMapData::<GeneralCategory>::new();

    // Handle category groups (e.g., L, M, N, P, S, Z, C)
    let group = match value {
        "L" | "Letter" => Some(GeneralCategoryGroup::Letter),
        "M" | "Mark" | "Combining_Mark" => Some(GeneralCategoryGroup::Mark),
        "N" | "Number" => Some(GeneralCategoryGroup::Number),
        "P" | "Punctuation" | "punct" => Some(GeneralCategoryGroup::Punctuation),
        "S" | "Symbol" => Some(GeneralCategoryGroup::Symbol),
        "Z" | "Separator" => Some(GeneralCategoryGroup::Separator),
        "C" | "Other" => Some(GeneralCategoryGroup::Other),
        "LC" | "Cased_Letter" => Some(GeneralCategoryGroup::CasedLetter),
        _ => None,
    };

    if let Some(group) = group {
        let ranges: Vec<_> = gc_map.iter_ranges_for_group(group).collect();
        return Some(ranges);
    }

    // Handle individual categories
    let gc = match value {
        "Lu" | "Uppercase_Letter" => Some(GeneralCategory::UppercaseLetter),
        "Ll" | "Lowercase_Letter" => Some(GeneralCategory::LowercaseLetter),
        "Lt" | "Titlecase_Letter" => Some(GeneralCategory::TitlecaseLetter),
        "Lm" | "Modifier_Letter" => Some(GeneralCategory::ModifierLetter),
        "Lo" | "Other_Letter" => Some(GeneralCategory::OtherLetter),
        "Mn" | "Nonspacing_Mark" => Some(GeneralCategory::NonspacingMark),
        "Mc" | "Spacing_Mark" => Some(GeneralCategory::SpacingMark),
        "Me" | "Enclosing_Mark" => Some(GeneralCategory::EnclosingMark),
        "Nd" | "Decimal_Number" | "digit" => Some(GeneralCategory::DecimalNumber),
        "Nl" | "Letter_Number" => Some(GeneralCategory::LetterNumber),
        "No" | "Other_Number" => Some(GeneralCategory::OtherNumber),
        "Pc" | "Connector_Punctuation" => Some(GeneralCategory::ConnectorPunctuation),
        "Pd" | "Dash_Punctuation" => Some(GeneralCategory::DashPunctuation),
        "Ps" | "Open_Punctuation" => Some(GeneralCategory::OpenPunctuation),
        "Pe" | "Close_Punctuation" => Some(GeneralCategory::ClosePunctuation),
        "Pi" | "Initial_Punctuation" => Some(GeneralCategory::InitialPunctuation),
        "Pf" | "Final_Punctuation" => Some(GeneralCategory::FinalPunctuation),
        "Po" | "Other_Punctuation" => Some(GeneralCategory::OtherPunctuation),
        "Sm" | "Math_Symbol" => Some(GeneralCategory::MathSymbol),
        "Sc" | "Currency_Symbol" => Some(GeneralCategory::CurrencySymbol),
        "Sk" | "Modifier_Symbol" => Some(GeneralCategory::ModifierSymbol),
        "So" | "Other_Symbol" => Some(GeneralCategory::OtherSymbol),
        "Zs" | "Space_Separator" => Some(GeneralCategory::SpaceSeparator),
        "Zl" | "Line_Separator" => Some(GeneralCategory::LineSeparator),
        "Zp" | "Paragraph_Separator" => Some(GeneralCategory::ParagraphSeparator),
        "Cc" | "Control" | "cntrl" => Some(GeneralCategory::Control),
        "Cf" | "Format" => Some(GeneralCategory::Format),
        "Cs" | "Surrogate" => Some(GeneralCategory::Surrogate),
        "Co" | "Private_Use" => Some(GeneralCategory::PrivateUse),
        "Cn" | "Unassigned" => Some(GeneralCategory::Unassigned),
        _ => None,
    }?;

    let ranges: Vec<_> = gc_map.iter_ranges_for_value(gc).collect();
    Some(ranges)
}

/// Gets the ranges for a Script property value.
fn get_script_ranges(value: &str) -> Option<Vec<RangeInclusive<u32>>> {
    let script = parse_script_name(value)?;
    let script_map = CodePointMapData::<Script>::new();
    let ranges: Vec<_> = script_map.iter_ranges_for_value(script).collect();
    Some(ranges)
}

/// Gets the ranges for a Script_Extensions property value.
fn get_script_extensions_ranges(value: &str) -> Option<Vec<RangeInclusive<u32>>> {
    let script = parse_script_name(value)?;
    let scx = icu_properties::script::ScriptWithExtensionsBorrowed::new();

    // Get all code points that have this script in their extensions
    let inv_list = scx.get_script_extensions_set(script);
    let ranges: Vec<_> = inv_list.iter_ranges().collect();
    Some(ranges)
}

/// Parses a script name to a Script enum value.
fn parse_script_name(name: &str) -> Option<Script> {
    // Common scripts - add more as needed
    Some(match name {
        "Latn" | "Latin" => Script::Latin,
        "Grek" | "Greek" => Script::Greek,
        "Cyrl" | "Cyrillic" => Script::Cyrillic,
        "Arab" | "Arabic" => Script::Arabic,
        "Hebr" | "Hebrew" => Script::Hebrew,
        "Hani" | "Han" => Script::Han,
        "Hira" | "Hiragana" => Script::Hiragana,
        "Kana" | "Katakana" => Script::Katakana,
        "Hang" | "Hangul" => Script::Hangul,
        "Thai" => Script::Thai,
        "Deva" | "Devanagari" => Script::Devanagari,
        "Beng" | "Bengali" => Script::Bengali,
        "Taml" | "Tamil" => Script::Tamil,
        "Telu" | "Telugu" => Script::Telugu,
        "Knda" | "Kannada" => Script::Kannada,
        "Mlym" | "Malayalam" => Script::Malayalam,
        "Sinh" | "Sinhala" => Script::Sinhala,
        "Mymr" | "Myanmar" => Script::Myanmar,
        "Geor" | "Georgian" => Script::Georgian,
        "Armn" | "Armenian" => Script::Armenian,
        "Ethi" | "Ethiopic" => Script::Ethiopian,
        "Copt" | "Coptic" => Script::Coptic,
        "Tibt" | "Tibetan" => Script::Tibetan,
        "Khmr" | "Khmer" => Script::Khmer,
        "Laoo" | "Lao" => Script::Lao,
        "Bopo" | "Bopomofo" => Script::Bopomofo,
        "Zyyy" | "Common" => Script::Common,
        "Zinh" | "Inherited" | "Qaai" => Script::Inherited,
        "Zzzz" | "Unknown" => Script::Unknown,
        _ => return None,
    })
}

/// Gets the ranges for a binary Unicode property.
fn get_binary_property_ranges(name: &str) -> Option<Vec<RangeInclusive<u32>>> {
    // Helper macro to reduce boilerplate
    macro_rules! binary_prop {
        ($prop:ty) => {{
            let set = CodePointSetData::new::<$prop>();
            let ranges: Vec<_> = set.iter_ranges().collect();
            Some(ranges)
        }};
    }

    match name {
        // Most common binary properties
        "ASCII" => Some(vec![0..=0x7f]),
        "ASCII_Hex_Digit" | "AHex" => binary_prop!(AsciiHexDigit),
        "Alphabetic" | "Alpha" => binary_prop!(Alphabetic),
        "Bidi_Control" | "Bidi_C" => binary_prop!(BidiControl),
        "Bidi_Mirrored" | "Bidi_M" => binary_prop!(BidiMirrored),
        "Case_Ignorable" | "CI" => binary_prop!(CaseIgnorable),
        "Cased" => binary_prop!(Cased),
        "Changes_When_Casefolded" | "CWCF" => binary_prop!(ChangesWhenCasefolded),
        "Changes_When_Casemapped" | "CWCM" => binary_prop!(ChangesWhenCasemapped),
        "Changes_When_Lowercased" | "CWL" => binary_prop!(ChangesWhenLowercased),
        "Changes_When_NFKC_Casefolded" | "CWKCF" => binary_prop!(ChangesWhenNfkcCasefolded),
        "Changes_When_Titlecased" | "CWT" => binary_prop!(ChangesWhenTitlecased),
        "Changes_When_Uppercased" | "CWU" => binary_prop!(ChangesWhenUppercased),
        "Dash" => binary_prop!(Dash),
        "Default_Ignorable_Code_Point" | "DI" => binary_prop!(DefaultIgnorableCodePoint),
        "Deprecated" | "Dep" => binary_prop!(Deprecated),
        "Diacritic" | "Dia" => binary_prop!(Diacritic),
        "Emoji" => binary_prop!(Emoji),
        "Emoji_Component" | "EComp" => binary_prop!(EmojiComponent),
        "Emoji_Modifier" | "EMod" => binary_prop!(EmojiModifier),
        "Emoji_Modifier_Base" | "EBase" => binary_prop!(EmojiModifierBase),
        "Emoji_Presentation" | "EPres" => binary_prop!(EmojiPresentation),
        "Extended_Pictographic" | "ExtPict" => binary_prop!(ExtendedPictographic),
        "Extender" | "Ext" => binary_prop!(Extender),
        "Grapheme_Base" | "Gr_Base" => binary_prop!(GraphemeBase),
        "Grapheme_Extend" | "Gr_Ext" => binary_prop!(GraphemeExtend),
        "Hex_Digit" | "Hex" => binary_prop!(HexDigit),
        "IDS_Binary_Operator" | "IDSB" => binary_prop!(IdsBinaryOperator),
        "IDS_Trinary_Operator" | "IDST" => binary_prop!(IdsTrinaryOperator),
        "ID_Continue" | "IDC" => binary_prop!(IdContinue),
        "ID_Start" | "IDS" => binary_prop!(IdStart),
        "Ideographic" | "Ideo" => binary_prop!(Ideographic),
        "Join_Control" | "Join_C" => binary_prop!(JoinControl),
        "Logical_Order_Exception" | "LOE" => binary_prop!(LogicalOrderException),
        "Lowercase" | "Lower" => binary_prop!(Lowercase),
        "Math" => binary_prop!(Math),
        "Noncharacter_Code_Point" | "NChar" => binary_prop!(NoncharacterCodePoint),
        "Pattern_Syntax" | "Pat_Syn" => binary_prop!(PatternSyntax),
        "Pattern_White_Space" | "Pat_WS" => binary_prop!(PatternWhiteSpace),
        "Quotation_Mark" | "QMark" => binary_prop!(QuotationMark),
        "Radical" => binary_prop!(Radical),
        "Regional_Indicator" | "RI" => binary_prop!(RegionalIndicator),
        "Sentence_Terminal" | "STerm" => binary_prop!(SentenceTerminal),
        "Soft_Dotted" | "SD" => binary_prop!(SoftDotted),
        "Terminal_Punctuation" | "Term" => binary_prop!(TerminalPunctuation),
        "Unified_Ideograph" | "UIdeo" => binary_prop!(UnifiedIdeograph),
        "Uppercase" | "Upper" => binary_prop!(Uppercase),
        "Variation_Selector" | "VS" => binary_prop!(VariationSelector),
        "White_Space" | "space" => binary_prop!(WhiteSpace),
        "XID_Continue" | "XIDC" => binary_prop!(XidContinue),
        "XID_Start" | "XIDS" => binary_prop!(XidStart),

        // Special values
        "Any" => Some(vec![0..=0x10ffff]),
        "Assigned" => {
            // Assigned is the complement of Unassigned (gc=Cn)
            let gc_map = CodePointMapData::<GeneralCategory>::new();
            let ranges: Vec<_> = gc_map
                .iter_ranges_for_value_complemented(GeneralCategory::Unassigned)
                .collect();
            Some(ranges)
        }

        _ => None,
    }
}

#[cfg(test)]
mod tests {
    use swc_ecma_regexp::{LiteralParser, Options};

    use super::*;

    fn parse_and_transform(pattern: &str, flags: &str) -> String {
        let mut ast = LiteralParser::new(pattern, Some(flags), Options::default())
            .parse()
            .unwrap();
        transform_unicode_property_escapes(&mut ast, true);
        ast.to_string()
    }

    #[test]
    fn test_letter_property() {
        let result = parse_and_transform(r"\p{L}", "u");
        // Should contain character class with letter ranges
        assert!(result.starts_with('['));
        assert!(result.ends_with(']'));
    }

    #[test]
    fn test_uppercase_letter() {
        let result = parse_and_transform(r"\p{Lu}", "u");
        assert!(result.starts_with('['));
    }

    #[test]
    fn test_script_latin() {
        let result = parse_and_transform(r"\p{Script=Latin}", "u");
        assert!(result.starts_with('['));
    }

    #[test]
    fn test_negative_property() {
        let result = parse_and_transform(r"\P{L}", "u");
        assert!(result.starts_with("[^"));
    }

    #[test]
    fn test_id_start_property() {
        let result = parse_and_transform(r"\p{ID_Start}", "u");
        assert!(result.starts_with('['));
    }

    #[test]
    fn test_ascii_property() {
        let result = parse_and_transform(r"\p{ASCII}", "u");
        assert!(result.starts_with('['));
        // ASCII should be \u0000-\u007F
        assert!(result.contains("\\u0000-\\u007F"));
    }
}
