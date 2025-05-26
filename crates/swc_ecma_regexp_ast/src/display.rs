use std::{
    borrow::Cow,
    fmt::{self, Display},
    iter::Peekable,
};

use swc_ecma_regexp_common::{combine_surrogate_pair, is_lead_surrogate, is_trail_surrogate};

use super::*;

impl Display for Pattern {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        self.body.fmt(f)
    }
}

impl Display for Disjunction {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write_join(f, "|", &self.body)
    }
}

impl Display for Alternative {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        fn as_character(term: &Term) -> Option<&Character> {
            if let Term::Character(ch) = term {
                Some(ch)
            } else {
                None
            }
        }

        write_join_with(f, "", &self.body, |iter| {
            let next = iter.next()?;
            let Some(next) = as_character(next) else {
                return Some(Cow::Owned(next.to_string()));
            };

            let peek = iter.peek().and_then(|it| as_character(it));
            let (result, eat) = character_to_string(next, peek);
            if eat {
                iter.next();
            }

            Some(result)
        })
    }
}

impl Display for Term {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            Self::BoundaryAssertion(it) => it.fmt(f),
            Self::LookAroundAssertion(it) => it.fmt(f),
            Self::Quantifier(it) => it.fmt(f),
            Self::Character(it) => it.fmt(f),
            Self::Dot(it) => it.fmt(f),
            Self::CharacterClassEscape(it) => it.fmt(f),
            Self::UnicodePropertyEscape(it) => it.fmt(f),
            Self::CharacterClass(it) => it.fmt(f),
            Self::CapturingGroup(it) => it.fmt(f),
            Self::IgnoreGroup(it) => it.fmt(f),
            Self::IndexedReference(it) => it.fmt(f),
            Self::NamedReference(it) => it.fmt(f),
        }
    }
}

impl Display for BoundaryAssertion {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        self.kind.fmt(f)
    }
}

impl Display for BoundaryAssertionKind {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        let s = match self {
            Self::Start => "^",
            Self::End => "$",
            Self::Boundary => r"\b",
            Self::NegativeBoundary => r"\B",
        };
        f.write_str(s)
    }
}

impl Display for LookAroundAssertion {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "({}{})", self.kind, self.body)
    }
}

impl Display for LookAroundAssertionKind {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        let s = match self {
            Self::Lookahead => "?=",
            Self::NegativeLookahead => "?!",
            Self::Lookbehind => "?<=",
            Self::NegativeLookbehind => "?<!",
        };
        f.write_str(s)
    }
}

impl Display for Quantifier {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        self.body.fmt(f)?;

        match (self.min, self.max) {
            (0, None) => f.write_str("*")?,
            (1, None) => f.write_str("+")?,
            (0, Some(1)) => f.write_str("?")?,
            (min, Some(max)) if min == max => write!(f, "{{{min}}}",)?,
            (min, Some(max)) => {
                write!(f, "{{{min},{max}}}",)?;
            }
            (min, None) => {
                write!(f, "{{{min},}}",)?;
            }
        }

        if !self.greedy {
            f.write_str("?")?;
        }

        Ok(())
    }
}

impl Display for Character {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        let (string, _) = character_to_string(self, None);
        string.fmt(f)
    }
}

impl Display for Dot {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        f.write_str(".")
    }
}

impl Display for CharacterClassEscape {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        self.kind.fmt(f)
    }
}

impl Display for CharacterClassEscapeKind {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        let escape = match self {
            Self::D => r"\d",
            Self::NegativeD => r"\D",
            Self::S => r"\s",
            Self::NegativeS => r"\S",
            Self::W => r"\w",
            Self::NegativeW => r"\W",
        };
        f.write_str(escape)
    }
}

impl Display for UnicodePropertyEscape {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        f.write_str(if self.negative { r"\P{" } else { r"\p{" })?;
        match (&self.name, &self.value) {
            (name, Some(value)) if name == "General_Category" => value.fmt(f),
            (name, Some(value)) => write!(f, "{name}={value}"),
            (name, _) => name.fmt(f),
        }?;
        f.write_str("}")
    }
}

impl Display for CharacterClass {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        fn as_character(content: &CharacterClassContents) -> Option<&Character> {
            if let CharacterClassContents::Character(ch) = content {
                Some(ch)
            } else {
                None
            }
        }

        f.write_str("[")?;
        if self.negative {
            f.write_str("^")?;
        }

        if !self.body.is_empty() {
            let sep = match self.kind {
                CharacterClassContentsKind::Union => "",
                CharacterClassContentsKind::Subtraction => "--",
                CharacterClassContentsKind::Intersection => "&&",
            };

            write_join_with(f, sep, &self.body, |iter| {
                let next = iter.next()?;
                let Some(next) = as_character(next) else {
                    return Some(Cow::Owned(next.to_string()));
                };

                let peek = iter.peek().and_then(|it| as_character(it));
                let (result, eat) = character_to_string(next, peek);
                if eat {
                    iter.next();
                }

                Some(result)
            })?;
        }

        f.write_str("]")
    }
}

impl Display for CharacterClassContents {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            Self::CharacterClassRange(it) => it.fmt(f),
            Self::CharacterClassEscape(it) => it.fmt(f),
            Self::UnicodePropertyEscape(it) => it.fmt(f),
            Self::Character(it) => it.fmt(f),
            Self::NestedCharacterClass(it) => it.fmt(f),
            Self::ClassStringDisjunction(it) => it.fmt(f),
        }
    }
}

impl Display for CharacterClassRange {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{}-{}", self.min, self.max)
    }
}

impl Display for ClassStringDisjunction {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        f.write_str(r"\q{")?;
        write_join(f, "|", &self.body)?;
        f.write_str("}")
    }
}

impl Display for ClassString {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write_join(f, "", &self.body)
    }
}

impl Display for CapturingGroup {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        f.write_str("(")?;
        if let Some(name) = &self.name {
            write!(f, "?<{name}>")?;
        }
        write!(f, "{})", &self.body)
    }
}

impl Display for IgnoreGroup {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        fn write_flags(f: &mut fmt::Formatter, flags: Modifier) -> fmt::Result {
            if flags.contains(Modifier::I) {
                f.write_str("i")?;
            }
            if flags.contains(Modifier::M) {
                f.write_str("m")?;
            }
            if flags.contains(Modifier::S) {
                f.write_str("s")?;
            }
            Ok(())
        }

        f.write_str("(?")?;

        if let Some(modifiers) = &self.modifiers {
            if !modifiers.enabling.is_empty() {
                write_flags(f, modifiers.enabling)?;
            }
            if !modifiers.disabling.is_empty() {
                f.write_str("-")?;
                write_flags(f, modifiers.disabling)?;
            }
        }

        write!(f, ":{})", self.body)
    }
}

impl Display for IndexedReference {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, r"\{}", self.index)
    }
}

impl Display for NamedReference {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, r"\k<{}>", self.name)
    }
}

// ---

fn character_to_string(
    this: &Character,
    peek: Option<&Character>,
) -> (
    /* result */ Cow<'static, str>,
    /* true of peek should be consumed */ bool,
) {
    let cp = this.value;

    if matches!(
        this.kind,
        CharacterKind::Symbol | CharacterKind::UnicodeEscape
    ) {
        // Trail only
        if is_trail_surrogate(cp) {
            return (Cow::Owned(format!(r"\u{cp:X}")), false);
        }

        if is_lead_surrogate(cp) {
            if let Some(peek) = peek.filter(|peek| is_trail_surrogate(peek.value)) {
                // Lead+Trail
                let cp = combine_surrogate_pair(cp, peek.value);
                let ch = char::from_u32(cp).expect("Invalid surrogate pair `Character`!");
                return (Cow::Owned(format!("{ch}")), true);
            }

            // Lead only
            return (Cow::Owned(format!(r"\u{cp:X}")), false);
        }
    }

    let ch = char::from_u32(cp).expect("Invalid `Character`!");
    let result = match this.kind {
        // Not a surrogate, like BMP, or all units in unicode mode
        CharacterKind::Symbol => Cow::Owned(ch.to_string()),
        CharacterKind::ControlLetter => match ch {
            '\n' => Cow::Borrowed(r"\cJ"),
            '\r' => Cow::Borrowed(r"\cM"),
            '\t' => Cow::Borrowed(r"\cI"),
            '\u{0019}' => Cow::Borrowed(r"\cY"),
            _ => Cow::Owned(format!(r"\c{ch}")),
        },
        CharacterKind::Identifier => Cow::Owned(format!(r"\{ch}")),
        CharacterKind::SingleEscape => match ch {
            '\n' => Cow::Borrowed(r"\n"),
            '\r' => Cow::Borrowed(r"\r"),
            '\t' => Cow::Borrowed(r"\t"),
            '\u{b}' => Cow::Borrowed(r"\v"),
            '\u{c}' => Cow::Borrowed(r"\f"),
            '\u{8}' => Cow::Borrowed(r"\b"),
            '\u{2D}' => Cow::Borrowed(r"\-"),
            _ => Cow::Owned(format!(r"\{ch}")),
        },
        CharacterKind::Null => Cow::Borrowed(r"\0"),
        CharacterKind::UnicodeEscape => {
            let hex = &format!("{cp:04X}");
            if hex.len() <= 4 {
                Cow::Owned(format!(r"\u{hex}"))
            } else {
                Cow::Owned(format!(r"\u{{{hex}}}"))
            }
        }
        CharacterKind::HexadecimalEscape => Cow::Owned(format!(r"\x{cp:02X}")),
        CharacterKind::Octal1 => Cow::Owned(format!(r"\{cp:o}")),
        CharacterKind::Octal2 => Cow::Owned(format!(r"\{cp:02o}")),
        CharacterKind::Octal3 => Cow::Owned(format!(r"\{cp:03o}")),
    };

    (result, false)
}

// ---

fn write_join<S, I, E>(f: &mut fmt::Formatter, sep: S, items: I) -> fmt::Result
where
    S: AsRef<str>,
    E: Display,
    I: IntoIterator<Item = E>,
{
    write_join_with(f, sep, items, |iter| iter.next().map(|it| it.to_string()))
}

fn write_join_with<S, I, E, F, D>(f: &mut fmt::Formatter, sep: S, items: I, next: F) -> fmt::Result
where
    S: AsRef<str>,
    E: Display,
    I: IntoIterator<Item = E>,
    F: Fn(&mut Peekable<I::IntoIter>) -> Option<D>,
    D: Display,
{
    let sep = sep.as_ref();
    let iter = &mut items.into_iter().peekable();

    if let Some(first) = next(iter) {
        first.fmt(f)?;
    }

    while let Some(it) = next(iter) {
        write!(f, "{sep}{it}")?;
    }

    Ok(())
}
