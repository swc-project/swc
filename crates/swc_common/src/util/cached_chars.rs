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

    /// Peeks at the nth character ahead without consuming it.
    /// Returns None if there are fewer than n+1 characters remaining.
    #[inline]
    pub fn peek(&mut self, n: usize) -> Option<char> {
        // If n is beyond our cache size, we can't peek that far
        if n >= N {
            return None;
        }

        // Fill the cache up to position n if needed
        while self.peeked_count <= n {
            let remaining = &self.source[self.offset..];
            let mut chars = remaining.chars();

            // Skip already peeked characters
            for _ in 0..self.peeked_count {
                chars.next();
            }

            if let Some(ch) = chars.next() {
                self.peeked[self.peeked_count] = Some(ch);
                self.peeked_count += 1;
            } else {
                // No more characters available
                return None;
            }
        }

        self.peeked[n]
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

    #[test]
    fn test_peek() {
        let s = "hello";
        let mut iter = CachingChars::<4>::new(s);

        // Peek at first character
        assert_eq!(iter.peek(0), Some('h'));
        // Should be able to peek multiple times
        assert_eq!(iter.peek(0), Some('h'));

        // Peek ahead
        assert_eq!(iter.peek(1), Some('e'));
        assert_eq!(iter.peek(2), Some('l'));
        assert_eq!(iter.peek(3), Some('l'));

        // Peek beyond cache size should return None
        assert_eq!(iter.peek(4), None);

        // Consume a character and peek again
        assert_eq!(iter.next(), Some('h'));
        assert_eq!(iter.peek(0), Some('e'));
        assert_eq!(iter.peek(1), Some('l'));
    }

    #[test]
    fn test_peek_and_consume() {
        let s = "abc";
        let mut iter = CachingChars::<4>::new(s);

        // Peek and then consume
        assert_eq!(iter.peek(0), Some('a'));
        assert_eq!(iter.peek(1), Some('b'));
        assert_eq!(iter.next(), Some('a'));

        // After consuming, peek should show next characters
        assert_eq!(iter.peek(0), Some('b'));
        assert_eq!(iter.peek(1), Some('c'));
        assert_eq!(iter.next(), Some('b'));

        assert_eq!(iter.peek(0), Some('c'));
        assert_eq!(iter.peek(1), None);
        assert_eq!(iter.next(), Some('c'));

        assert_eq!(iter.peek(0), None);
        assert_eq!(iter.next(), None);
    }

    #[test]
    fn test_peek_unicode() {
        let s = "한글";
        let mut iter = CachingChars::<4>::new(s);

        assert_eq!(iter.peek(0), Some('한'));
        assert_eq!(iter.peek(1), Some('글'));
        assert_eq!(iter.peek(2), None);

        assert_eq!(iter.next(), Some('한'));
        assert_eq!(iter.peek(0), Some('글'));
    }
}
