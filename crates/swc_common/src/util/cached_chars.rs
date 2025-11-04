use std::str::Chars;

pub(crate) struct CahcingChars<'a, const N: usize> {
    iter: Chars<'a>,
    peeked: [Option<char>; N],
}
