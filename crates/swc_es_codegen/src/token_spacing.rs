#[inline]
fn first_non_ws(text: &str) -> Option<char> {
    text.chars().find(|c| !c.is_whitespace())
}

#[inline]
fn is_ident_like(c: char) -> bool {
    c == '_' || c == '$' || c == '#' || c.is_ascii_alphanumeric()
}

#[inline]
fn forms_merged_punct(prev: char, next: char) -> bool {
    matches!(
        (prev, next),
        ('>', '=')
            | ('<', '=')
            | ('=', '>')
            | ('!', '=')
            | ('=', '=')
            | ('&', '&')
            | ('|', '|')
            | ('?', '?')
            | ('*', '*')
    )
}

/// Returns `true` when an explicit space is required before `next`.
#[inline]
pub fn needs_space(prev: Option<char>, next: &str) -> bool {
    let Some(prev) = prev else {
        return false;
    };

    if prev.is_whitespace() {
        return false;
    }

    let Some(next) = first_non_ws(next) else {
        return false;
    };

    if is_ident_like(prev) && is_ident_like(next) {
        return true;
    }

    if (prev == '+' && next == '+') || (prev == '-' && next == '-') {
        return true;
    }

    if forms_merged_punct(prev, next) {
        return true;
    }

    if prev == '/' && (next == '/' || next == '*') {
        return true;
    }

    if prev == '<' && next == '!' {
        return true;
    }

    if prev == '.' && next.is_ascii_digit() {
        return true;
    }

    false
}
