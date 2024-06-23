/// Returns true if it's done
pub(super) type ByteHandler = Option<for<'aa> fn(&mut SkipWhitespace<'aa>) -> u32>;

/// Lookup table for whitespace
static BYTE_HANDLERS: [ByteHandler; 256] = [
    //   0    1    2    3    4    5    6    7    8    9    A    B    C    D    E    F   //
    ___, ___, ___, ___, ___, ___, ___, ___, ___, SPC, NLN, SPC, SPC, NLN, ___, ___, // 0
    ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, // 1
    SPC, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, // 2
    ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, // 3
    ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, // 4
    ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, // 5
    ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, // 6
    ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, // 7
    UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, // 8
    UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, // 9
    UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, // A
    UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, // B
    UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, // C
    UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, // D
    UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, // E
    UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, // F
];

/// Stop
const ___: ByteHandler = None;

/// Newline
const NLN: ByteHandler = Some(|skip| {
    skip.newline = true;

    1
});

/// Space
const SPC: ByteHandler = Some(|_| 1);

/// Unicode
const UNI: ByteHandler = Some(|skip| {
    let s = unsafe {
        // Safety: `skip.offset` is always valid
        skip.input.get_unchecked(skip.offset as usize..)
    };

    let c = unsafe {
        // Safety: Byte handlers are called only when `skip.input` is not empty
        s.chars().next().unwrap_unchecked()
    };

    match c {
        // white spaces
        '\u{feff}' => {}
        // line breaks
        '\u{2028}' | '\u{2029}' => {
            skip.newline = true;
        }

        _ if c.is_whitespace() => {}

        _ => return 0,
    }

    c.len_utf8() as u32
});

/// API is taked from oxc by Boshen (https://github.com/Boshen/oxc/pull/26)
pub(super) struct SkipWhitespace<'a> {
    pub input: &'a str,

    /// Total offset
    pub offset: u32,

    /// Found newline
    pub newline: bool,
}

impl SkipWhitespace<'_> {
    #[inline(always)]
    pub fn scan(&mut self) {
        let mut byte;
        loop {
            byte = match self.input.as_bytes().get(self.offset as usize).copied() {
                Some(v) => v,
                None => return,
            };

            let handler = unsafe { *(&BYTE_HANDLERS as *const ByteHandler).offset(byte as isize) };

            if let Some(handler) = handler {
                let delta = handler(self);
                if delta == 0 {
                    return;
                }
                self.offset += delta;
            } else {
                return;
            }
        }
    }
}
