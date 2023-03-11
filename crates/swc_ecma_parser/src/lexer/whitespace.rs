/// Returns true if it's done
pub(super) type ByteHandler = Option<for<'aa> fn(&mut SkipWhitespace<'aa>) -> bool>;

/// Lookup table for whitespace
static BYTE_HANDLERS: [ByteHandler; 256] = [
    //   0    1    2    3    4    5    6    7    8    9    A    B    C    D    E    F   //
    ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, NLN, ___, SPC, NLN, ___, ___, // 0
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
    skip.offset += 1;
    skip.newline = true;

    false
});

/// Space
const SPC: ByteHandler = Some(|skip| {
    skip.offset += 1;

    false
});

/// Unicode
const UNI: ByteHandler = Some(|skip| {
    let s = unsafe {
        // Safety: `skip.offset` is always valid
        skip.input.get_unchecked(skip.offset..)
    };

    let (len, c) = unsafe {
        // Safety: Byte handlers are called only when `skip.input` is not empty
        s.char_indices().next().unwrap_unchecked()
    };

    match c {
        // white spaces
        '\u{feff}' => {}
        // line breaks
        '\u{2028}' | '\u{2029}' => {
            skip.newline = true;
        }

        _ if c.is_whitespace() => {}

        _ => return true,
    }

    skip.offset += len;

    false
});

/// API is taked from oxc by Boshen (https://github.com/Boshen/oxc/pull/26)
pub(super) struct SkipWhitespace<'a> {
    pub input: &'a str,

    /// Total offset
    pub offset: usize,

    /// Found newline
    pub newline: bool,
}

macro_rules! unwind_loop {
    ($e:expr) => {{
        $e;
        $e;
        $e;
        $e;
        $e;
        $e;
        $e;
        $e;
    }};
}

impl SkipWhitespace<'_> {
    pub fn scan(&mut self) {
        let mut byte;

        loop {
            unwind_loop!({
                byte = self.input.as_bytes().get(self.offset).copied();

                if let Some(byte) = byte {
                    let handler =
                        unsafe { *(&BYTE_HANDLERS as *const ByteHandler).offset(byte as isize) };

                    if let Some(handler) = handler {
                        if handler(self) {
                            return;
                        }
                    } else {
                        return;
                    }
                } else {
                    return;
                }
            })
        }
    }
}
