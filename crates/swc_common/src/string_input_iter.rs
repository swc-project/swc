#[derive(Debug, Clone)]
pub(super) struct StringInputIter<'a> {
    bytes: &'a [u8],
    pos: usize,
}

impl Iterator for StringInputIter<'_> {
    type Item = char;

    fn next(&mut self) -> Option<Self::Item> {
        unsafe {
            self.next_code_point()
                .map(|ch| char::from_u32_unchecked(ch))
        }
    }

    fn nth(&mut self, n: usize) -> Option<Self::Item> {
        self.advance_by(n).ok()?;
        self.next()
    }

    fn count(self) -> usize {
        // While `count_chars` would technically be the correct approach here, this can
        // be safely omitted as the parent function remains uncalled in our
        // current execution flow
        unreachable!();
    }

    fn last(self) -> Option<char> {
        unreachable!();
    }

    fn size_hint(&self) -> (usize, Option<usize>) {
        unreachable!();
    }
}

impl<'a> StringInputIter<'a> {
    pub fn as_str(&self) -> &'a str {
        debug_assert!(self.pos <= self.bytes.len());
        unsafe { std::str::from_utf8_unchecked(self.bytes.get_unchecked(self.pos..)) }
    }

    pub fn cur_byte(&self) -> Option<u8> {
        self.bytes.get(self.pos).copied()
    }

    pub fn new(s: &'a str) -> Self {
        Self {
            bytes: s.as_bytes(),
            pos: 0,
        }
    }

    fn advance_by(&mut self, mut remainder: usize) -> Result<(), ()> {
        while remainder > 0 && self.pos < self.bytes.len() {
            remainder -= 1;
            let b = unsafe { *self.bytes.get_unchecked(self.pos) };
            let slurp = char_validation::utf8_char_width(b);
            self.pos += slurp;
        }
        Ok(())
    }
}

/// COMMENT: most of the code is port from `core::src::str`
mod char_validation {
    const CONT_MASK: u8 = 0b0011_1111;

    #[inline]
    const fn utf8_first_byte(byte: u8, width: u32) -> u32 {
        (byte & (0x7f >> width)) as u32
    }

    #[inline]
    const fn utf8_acc_cont_byte(ch: u32, byte: u8) -> u32 {
        (ch << 6) | (byte & CONT_MASK) as u32
    }

    #[must_use]
    #[inline]
    pub const fn utf8_char_width(b: u8) -> usize {
        const UTF8_CHAR_WIDTH: &[u8; 256] = &[
            // 1  2  3  4  5  6  7  8  9  A  B  C  D  E  F
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 0
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 1
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 2
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 3
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 4
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 5
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 6
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 7
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 8
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 9
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // A
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // B
            0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, // C
            2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, // D
            3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, // E
            4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // F
        ];
        UTF8_CHAR_WIDTH[b as usize] as usize
    }

    impl super::StringInputIter<'_> {
        fn next_byte(&mut self) -> Option<u8> {
            self.bytes.get(self.pos).copied().map(|x| {
                self.pos += 1;
                x
            })
        }

        pub fn next_code_point(&mut self) -> Option<u32> {
            let x = self.next_byte()?;
            if x < 128 {
                return Some(x as u32);
            }

            let init = utf8_first_byte(x, 2);
            let y = unsafe { self.next_byte().unwrap_unchecked() };
            let mut ch = utf8_acc_cont_byte(init, y);
            if x >= 0xe0 {
                let z = unsafe { self.next_byte().unwrap_unchecked() };
                let y_z = utf8_acc_cont_byte((y & CONT_MASK) as u32, z);
                ch = init << 12 | y_z;
                if x >= 0xf0 {
                    let w = unsafe { self.next_byte().unwrap_unchecked() };
                    ch = (init & 7) << 18 | utf8_acc_cont_byte(y_z, w);
                }
            }

            Some(ch)
        }
    }
}
