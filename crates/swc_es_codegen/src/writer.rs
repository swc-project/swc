use ryu_js::Buffer;

use crate::CodegenError;

#[derive(Default)]
pub(crate) struct Writer {
    buf: Vec<u8>,
}

impl Writer {
    #[inline]
    pub fn new() -> Self {
        Self {
            buf: Vec::with_capacity(16 * 1024),
        }
    }

    #[inline]
    pub fn into_string(self) -> Result<String, CodegenError> {
        String::from_utf8(self.buf)
            .map_err(|_| CodegenError::invalid_ast("codegen produced non-utf8 output"))
    }

    #[inline]
    pub fn push_byte(&mut self, b: u8) {
        self.buf.push(b);
    }

    #[inline]
    pub fn push_char(&mut self, ch: char) {
        let mut scratch = [0; 4];
        let encoded = ch.encode_utf8(&mut scratch);
        self.buf.extend_from_slice(encoded.as_bytes());
    }

    #[inline]
    pub fn push_str(&mut self, s: &str) {
        self.buf.extend_from_slice(s.as_bytes());
    }

    #[inline]
    pub fn write_number(&mut self, value: f64) {
        if value.is_nan() {
            self.push_str("NaN");
            return;
        }
        if value.is_infinite() {
            if value.is_sign_negative() {
                self.push_str("-Infinity");
            } else {
                self.push_str("Infinity");
            }
            return;
        }

        let mut buf = Buffer::new();
        self.push_str(buf.format(value));
    }

    pub fn write_js_string(&mut self, value: &str) {
        self.push_byte(b'"');
        for ch in value.chars() {
            match ch {
                '\\' => self.push_str("\\\\"),
                '"' => self.push_str("\\\""),
                '\n' => self.push_str("\\n"),
                '\r' => self.push_str("\\r"),
                '\t' => self.push_str("\\t"),
                '\u{08}' => self.push_str("\\b"),
                '\u{0c}' => self.push_str("\\f"),
                '\u{2028}' => self.push_str("\\u2028"),
                '\u{2029}' => self.push_str("\\u2029"),
                _ if ch.is_control() => self.write_hex_escape(ch as u32),
                _ => self.push_char(ch),
            }
        }
        self.push_byte(b'"');
    }

    pub fn write_template_chunk(&mut self, value: &str) {
        let mut chars = value.chars().peekable();
        while let Some(ch) = chars.next() {
            match ch {
                '\\' => self.push_str("\\\\"),
                '`' => self.push_str("\\`"),
                '$' => {
                    if chars.peek() == Some(&'{') {
                        self.push_str("\\$");
                    } else {
                        self.push_char('$');
                    }
                }
                '\u{2028}' => self.push_str("\\u2028"),
                '\u{2029}' => self.push_str("\\u2029"),
                _ => self.push_char(ch),
            }
        }
    }

    fn write_hex_escape(&mut self, value: u32) {
        self.push_str("\\u");
        if value <= 0xffff {
            self.write_hex_fixed(value, 4);
            return;
        }

        self.push_byte(b'{');
        self.write_hex_compact(value);
        self.push_byte(b'}');
    }

    fn write_hex_fixed(&mut self, value: u32, width: usize) {
        const HEX: &[u8; 16] = b"0123456789abcdef";
        for i in (0..width).rev() {
            let shift = i * 4;
            let nibble = ((value >> shift) & 0x0f) as usize;
            self.push_byte(HEX[nibble]);
        }
    }

    fn write_hex_compact(&mut self, mut value: u32) {
        const HEX: &[u8; 16] = b"0123456789abcdef";
        let mut scratch = [0u8; 8];
        let mut i = scratch.len();

        loop {
            i -= 1;
            scratch[i] = HEX[(value & 0x0f) as usize];
            value >>= 4;
            if value == 0 {
                break;
            }
        }

        self.buf.extend_from_slice(&scratch[i..]);
    }
}

#[inline]
pub(crate) fn is_ascii_ident_name(sym: &str) -> bool {
    let mut chars = sym.chars();
    let Some(first) = chars.next() else {
        return false;
    };

    if !(first == '$' || first == '_' || first.is_ascii_alphabetic()) {
        return false;
    }

    chars.all(|ch| ch == '$' || ch == '_' || ch.is_ascii_alphanumeric())
}
