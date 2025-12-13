use std::borrow::Cow;

use memchr::memchr;

use oxc_ast::Comment;

use crate::{JsxOptions, JsxRuntime, TransformCtx, TypeScriptOptions};

/// Scan through all comments and find the following pragmas:
///
/// * @jsx Preact.h
/// * @jsxRuntime classic / automatic
/// * @jsxImportSource custom-jsx-library
/// * @jsxFrag Preact.Fragment
///
/// The comment does not need to be a JSDoc comment,
/// otherwise `JSDoc` could be used instead.
///
/// This behavior is aligned with ESBuild.
/// Babel is less liberal - it doesn't accept multiple pragmas in a single line
/// e.g. `/** @jsx h @jsxRuntime classic */`
/// <https://github.com/oxc-project/oxc/issues/10955>
pub fn update_options_with_comments(
    comments: &[Comment],
    typescript: &mut TypeScriptOptions,
    jsx: &mut JsxOptions,
    ctx: &TransformCtx,
) {
    let source_text = ctx.source_text;
    for comment in comments {
        update_options_with_comment(typescript, jsx, comment, source_text);
    }
}

fn update_options_with_comment(
    typescript: &mut TypeScriptOptions,
    jsx: &mut JsxOptions,
    comment: &Comment,
    source_text: &str,
) {
    let mut comment_str = comment.content_span().source_text(source_text);

    while let Some((keyword, value, remainder)) = find_jsx_pragma(comment_str) {
        match keyword {
            // @jsx
            PragmaType::Jsx => {
                // Don't set React option unless React transform is enabled
                // otherwise can cause error in `ReactJsx::new`
                if jsx.jsx_plugin || jsx.development {
                    jsx.pragma = Some(value.to_string());
                }
                typescript.jsx_pragma = Cow::Owned(value.to_string());
            }
            // @jsxRuntime
            PragmaType::JsxRuntime => match value {
                "classic" => jsx.runtime = JsxRuntime::Classic,
                "automatic" => jsx.runtime = JsxRuntime::Automatic,
                _ => {}
            },
            // @jsxImportSource
            PragmaType::JsxImportSource => {
                jsx.import_source = Some(value.to_string());
            }
            // @jsxFrag
            PragmaType::JsxFrag => {
                // Don't set React option unless React transform is enabled
                // otherwise can cause error in `ReactJsx::new`
                if jsx.jsx_plugin || jsx.development {
                    jsx.pragma_frag = Some(value.to_string());
                }
                typescript.jsx_pragma_frag = Cow::Owned(value.to_string());
            }
        }

        // Search again for another pragma
        comment_str = remainder;
    }
}

/// Type of JSX pragma directive.
#[derive(Clone, Copy, PartialEq, Eq, Debug)]
enum PragmaType {
    Jsx,
    JsxRuntime,
    JsxImportSource,
    JsxFrag,
}

/// Search comment for a JSX pragma.
///
/// If found, returns:
///
/// * `PragmaType` representing the type of the pragma.
/// * Value following `@jsx` / `@jsxRuntime` / etc.
/// * The remainder of the comment, to search again for another pragma.
///
/// If no pragma found, returns `None`.
fn find_jsx_pragma(mut comment_str: &str) -> Option<(PragmaType, &str, &str)> {
    let pragma_type;
    loop {
        // Search for `@`.
        // Note: Using `memchr::memmem::Finder` to search for `@jsx` is slower than only using `memchr`
        // to find `@` characters, and then checking if `@` is followed by `jsx` separately.
        let at_sign_index = memchr(b'@', comment_str.as_bytes())?;

        // Check `@` is start of `@jsx`.
        // Note: Checking 4 bytes including leading `@` is faster than checking the 3 bytes after `@`,
        // because 4 bytes is a `u32`.
        let next4 = comment_str.as_bytes().get(at_sign_index..at_sign_index + 4)?;
        if next4 != b"@jsx" {
            // Not `@jsx`. Trim off up to and including `@` and search again.
            // SAFETY: Byte at `at_sign_index` is `@`, so `at_sign_index + 1` is either within string
            // or end of string, and on a UTF-8 char boundary.
            comment_str = unsafe { comment_str.get_unchecked(at_sign_index + 1..) };
            continue;
        }

        // Trim `@jsx` and everything before it from start of `comment_str`.
        // SAFETY: 4 bytes starting at `at_sign_index` are `@jsx`, so `at_sign_index + 4` is within string
        // or end of string, and must be on a UTF-8 character boundary.
        comment_str = unsafe { comment_str.get_unchecked(at_sign_index + 4..) };

        // Get rest of keyword e.g. `Runtime` in `@jsxRuntime`
        let space_index = comment_str.as_bytes().iter().position(|&b| matches!(b, b' ' | b'\t'))?;
        // SAFETY: Byte at `space_index` is ASCII, so `space_index` is in bounds and on a UTF-8 char boundary
        let keyword_str = unsafe { comment_str.get_unchecked(..space_index) };
        // SAFETY: Byte at `space_index` is ASCII, so `space_index + 1` is in bounds and on a UTF-8 char boundary
        comment_str = unsafe { comment_str.get_unchecked(space_index + 1..) };

        pragma_type = match keyword_str {
            "" => PragmaType::Jsx,
            "Runtime" => PragmaType::JsxRuntime,
            "ImportSource" => PragmaType::JsxImportSource,
            "Frag" => PragmaType::JsxFrag,
            _ => {
                // Unrecognised pragma - search for another
                continue;
            }
        };
        break;
    }

    // Consume any further spaces / tabs after keyword
    loop {
        let next_byte = *comment_str.as_bytes().first()?;
        if !matches!(next_byte, b' ' | b'\t') {
            break;
        }
        // SAFETY: First byte of string is ASCII, so trimming it off must leave a valid UTF-8 string
        comment_str = unsafe { comment_str.get_unchecked(1..) };
    }

    // Get value
    let space_index = comment_str.as_bytes().iter().position(|&b| is_ascii_whitespace(b));
    let value;
    if let Some(space_index) = space_index {
        // SAFETY: Byte at `space_index` is ASCII, so `space_index` is in bounds and on a UTF-8 char boundary
        value = unsafe { comment_str.get_unchecked(..space_index) };
        // SAFETY: Byte at `space_index` is ASCII, so `space_index + 1` is in bounds and on a UTF-8 char boundary
        comment_str = unsafe { comment_str.get_unchecked(space_index + 1..) };
    } else {
        value = comment_str;
        comment_str = "";
    }

    if value.is_empty() { None } else { Some((pragma_type, value, comment_str)) }
}

/// Test if a byte is ASCII whitespace, using the same group of ASCII chars that `std::str::trim_start` uses.
/// These the are ASCII chars which `char::is_whitespace` returns `true` for.
/// Note: Slightly different from `u8::is_ascii_whitespace`, which does not include VT.
/// <https://doc.rust-lang.org/std/primitive.u8.html#method.is_ascii_whitespace>
#[inline]
fn is_ascii_whitespace(byte: u8) -> bool {
    const VT: u8 = 0x0B;
    const FF: u8 = 0x0C;
    matches!(byte, b' ' | b'\t' | b'\r' | b'\n' | VT | FF)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_find_jsx_pragma() {
        let cases: &[(&str, &[(PragmaType, &str)])] = &[
            // No valid pragmas
            ("", &[]),
            ("blah blah blah", &[]),
            ("@jsxDonkey abc", &[]),
            // Single pragma
            ("@jsx h", &[(PragmaType::Jsx, "h")]),
            ("@jsx React.createDumpling", &[(PragmaType::Jsx, "React.createDumpling")]),
            ("@jsxRuntime classic", &[(PragmaType::JsxRuntime, "classic")]),
            ("@jsxImportSource preact", &[(PragmaType::JsxImportSource, "preact")]),
            ("@jsxFrag Fraggy", &[(PragmaType::JsxFrag, "Fraggy")]),
            // Multiple pragmas
            (
                "@jsx h @jsxRuntime classic",
                &[(PragmaType::Jsx, "h"), (PragmaType::JsxRuntime, "classic")],
            ),
            (
                "* @jsx h\n  * @jsxRuntime classic\n  *",
                &[(PragmaType::Jsx, "h"), (PragmaType::JsxRuntime, "classic")],
            ),
            (
                "@jsx h @jsxRuntime classic @jsxImportSource importer-a-go-go @jsxFrag F",
                &[
                    (PragmaType::Jsx, "h"),
                    (PragmaType::JsxRuntime, "classic"),
                    (PragmaType::JsxImportSource, "importer-a-go-go"),
                    (PragmaType::JsxFrag, "F"),
                ],
            ),
            (
                "* @jsx h\n  * @jsxRuntime classic\n  * @jsxImportSource importer-a-go-go\n  * @jsxFrag F\n  *",
                &[
                    (PragmaType::Jsx, "h"),
                    (PragmaType::JsxRuntime, "classic"),
                    (PragmaType::JsxImportSource, "importer-a-go-go"),
                    (PragmaType::JsxFrag, "F"),
                ],
            ),
            // Text in between pragmas
            (
                "@jsx h blah blah @jsxRuntime classic",
                &[(PragmaType::Jsx, "h"), (PragmaType::JsxRuntime, "classic")],
            ),
            (
                "blah blah\n  * @jsx h \n  * blah blah\n  * @jsxRuntime classic \n  * blah blah",
                &[(PragmaType::Jsx, "h"), (PragmaType::JsxRuntime, "classic")],
            ),
            // Pragma without value
            ("@jsx", &[]),
            ("@jsxRuntime", &[]),
            // Other invalid pragmas surrounding valid one
            ("@moon @jsx h @moon", &[(PragmaType::Jsx, "h")]),
            ("@jsxX @jsx h @jsxX", &[(PragmaType::Jsx, "h")]),
            ("@jsxMoon @jsx h @jsxMoon", &[(PragmaType::Jsx, "h")]),
            ("@jsx @jsx h", &[(PragmaType::Jsx, "@jsx")]),
            // Multiple `@` signs
            ("@@@@@jsx h", &[(PragmaType::Jsx, "h")]),
        ];

        let prefixes = ["", "    ", "\n\n", "*\n* "];
        let postfixes = ["", "    ", "\n\n", "\n*"];

        for (comment_str, expected) in cases {
            for prefix in prefixes {
                for postfix in postfixes {
                    let comment_str = format!("{prefix}{comment_str}{postfix}");
                    let mut comment_str = comment_str.as_str();
                    let mut pragmas = vec![];
                    while let Some((pragma_type, value, remaining)) = find_jsx_pragma(comment_str) {
                        pragmas.push((pragma_type, value));
                        comment_str = remaining;
                    }
                    assert_eq!(&pragmas, expected);
                }
            }
        }
    }
}
