//   This Source Code Form is subject to the terms of the Mozilla Public
//   License, v. 2.0. If a copy of the MPL was not distributed with this
//   file, You can obtain one at http://mozilla.org/MPL/2.0/.

use std::str;

/// Escape a string to a valid ident for use in CSS.
#[inline]
pub fn escape(input: &str) -> String {
    escape_ident(input)
}

// https://github.com/servo/rust-cssparser/blob/4c5d065798ea1be649412532bde481dbd404f44a/src/serializer.rs#L193
fn escape_ident(mut value: &str) -> String{
    if value.is_empty() {
        return "".to_string();
    }
    let mut result = "".to_string();

    if let Some(stripped) = value.strip_prefix("--") {
        result += "--";
        result += &*escape_name(stripped);
    } else if value == "-" {
        result += "\\-";
    } else {
        if value.as_bytes()[0] == b'-' {
            result += "-";
            value = &value[1..];
        }
        if let digit @ b'0'..=b'9' = value.as_bytes()[0] {
            result += &*hex_escape(digit);
            value = &value[1..];
        }
        result += &*escape_name(value);
    }

    result
}

// https://github.com/servo/rust-cssparser/blob/4c5d065798ea1be649412532bde481dbd404f44a/src/serializer.rs#L220
fn escape_name(value: &str) -> String {
    let mut result = "".to_string();
    let mut chunk_start = 0;
    for (i, b) in value.bytes().enumerate() {
        let escaped = match b {
            b'0'..=b'9' | b'A'..=b'Z' | b'a'..=b'z' | b'_' | b'-' => continue,
            _ if !b.is_ascii() => continue,
            b'\0' => Some("\u{FFFD}"),
            _ => None,
        };
        result += &value[chunk_start..i];
        result += &*(if let Some(escaped) = escaped {
            escaped.to_string()
        } else if (b'\x01'..=b'\x1F').contains(&b) || b == b'\x7F' {
            hex_escape(b)
        } else {
            char_escape(b)
        });
        chunk_start = i + 1;
    }

    result += &value[chunk_start..];
    result
}

// https://github.com/servo/rust-cssparser/blob/4c5d065798ea1be649412532bde481dbd404f44a/src/serializer.rs#L166
fn hex_escape(ascii_byte: u8) -> String {
    static HEX_DIGITS: &[u8; 16] = b"0123456789abcdef";
    let b3;
    let b4;
    let bytes = if ascii_byte > 0x0F {
        let high = (ascii_byte >> 4) as usize;
        let low = (ascii_byte & 0x0F) as usize;
        b4 = [b'\\', HEX_DIGITS[high], HEX_DIGITS[low], b' '];
        &b4[..]
    } else {
        b3 = [b'\\', HEX_DIGITS[ascii_byte as usize], b' '];
        &b3[..]
    };
    unsafe { str::from_utf8_unchecked(bytes) }.to_string()
}

// https://github.com/servo/rust-cssparser/blob/4c5d065798ea1be649412532bde481dbd404f44a/src/serializer.rs#L185
fn char_escape(ascii_byte: u8) -> String {
    let bytes = [b'\\', ascii_byte];
    unsafe { str::from_utf8_unchecked(&bytes) }.to_string()
}