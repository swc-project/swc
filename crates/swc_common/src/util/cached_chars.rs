/// A character iterator that caches up to N characters ahead.
///
/// This allows peeking ahead in the character stream while maintaining
/// the ability to get the remaining string slice via `as_str()`.
#[derive(Clone)]
pub(crate) struct CachingChars<'a, const N: usize> {
    /// The original source string
    source: &'a str,
    /// Current byte offset in the source string
    offset: usize,
    /// Cached characters that have been peeked ahead
    peeked: [Option<char>; N],
    /// Number of valid entries in the peeked array
    peeked_count: usize,
}

impl<'a, const N: usize> CachingChars<'a, N> {
    /// Creates a new CachingChars iterator from a string slice.
    #[inline]
    pub fn new(source: &'a str) -> Self {
        Self {
            source,
            offset: 0,
            peeked: [None; N],
            peeked_count: 0,
        }
    }

    pub fn peek(&self, n: usize) -> Option<char> {
        self.peeked.get(n).and_then(|c| *c)
    }

    /// Returns the remaining string slice that has not been consumed yet.
    ///
    /// This includes any characters that have been peeked but not consumed.
    #[inline]
    pub fn as_str(&self) -> &'a str {
        &self.source[self.offset..]
    }
}

impl<'a, const N: usize> Iterator for CachingChars<'a, N> {
    type Item = char;

    #[inline]
    fn next(&mut self) -> Option<char> {
        // If we have peeked characters, return the first one
        if self.peeked_count > 0 {
            let ch = self.peeked[0];
            // Shift remaining peeked characters
            for i in 1..self.peeked_count {
                self.peeked[i - 1] = self.peeked[i];
            }
            self.peeked[self.peeked_count - 1] = None;
            self.peeked_count -= 1;

            // Advance offset by the character's byte length
            if let Some(c) = ch {
                self.offset += c.len_utf8();
            }

            return ch;
        }

        // Otherwise, get the next character from the source
        let remaining = &self.source[self.offset..];
        let mut chars = remaining.chars();

        if let Some(ch) = chars.next() {
            self.offset += ch.len_utf8();
            Some(ch)
        } else {
            None
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_basic_iteration() {
        let s = "hello";
        let mut iter = CachingChars::<4>::new(s);

        assert_eq!(iter.next(), Some('h'));
        assert_eq!(iter.next(), Some('e'));
        assert_eq!(iter.next(), Some('l'));
        assert_eq!(iter.next(), Some('l'));
        assert_eq!(iter.next(), Some('o'));
        assert_eq!(iter.next(), None);
    }

    #[test]
    fn test_as_str_initial() {
        let s = "hello world";
        let iter = CachingChars::<4>::new(s);

        assert_eq!(iter.as_str(), "hello world");
    }

    #[test]
    fn test_as_str_after_consuming() {
        let s = "hello world";
        let mut iter = CachingChars::<4>::new(s);

        iter.next(); // consume 'h'
        assert_eq!(iter.as_str(), "ello world");

        iter.next(); // consume 'e'
        assert_eq!(iter.as_str(), "llo world");

        // Consume all
        while iter.next().is_some() {}
        assert_eq!(iter.as_str(), "");
    }

    #[test]
    fn test_unicode_characters() {
        let s = "한글테스트";
        let mut iter = CachingChars::<4>::new(s);

        assert_eq!(iter.next(), Some('한'));
        assert_eq!(iter.as_str(), "글테스트");

        assert_eq!(iter.next(), Some('글'));
        assert_eq!(iter.as_str(), "테스트");
    }

    #[test]
    fn test_empty_string() {
        let s = "";
        let mut iter = CachingChars::<4>::new(s);

        assert_eq!(iter.next(), None);
        assert_eq!(iter.as_str(), "");
    }

    #[test]
    fn test_collect() {
        let s = "test";
        let iter = CachingChars::<4>::new(s);
        let collected: String = iter.collect();

        assert_eq!(collected, "test");
    }
}
