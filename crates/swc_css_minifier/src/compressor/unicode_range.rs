use swc_css_ast::*;

use super::Compressor;

impl Compressor {
    pub(super) fn compress_unicode_range(&self, unicode_range: &mut UnicodeRange) {
        if unicode_range.end.is_none() {
            unicode_range.start = self.remove_leading_zeros(&unicode_range.start).into();

            return;
        }

        let start = &unicode_range.start;
        let end = unicode_range.end.as_ref().unwrap();
        let merged = self.merge_start_and_end(start, end);

        if let Some(merged) = &merged {
            unicode_range.start = self.remove_leading_zeros(merged).into();
            unicode_range.end = None;
        } else {
            unicode_range.start = self.remove_leading_zeros(start).into();
            unicode_range.end = Some(self.remove_leading_zeros(end).into());
        }
    }

    fn remove_leading_zeros(&self, value: &str) -> String {
        let mut result = String::with_capacity(value.len());
        let mut is_leading = true;

        for c in value.chars() {
            if c == '0' && is_leading {
                continue;
            }

            is_leading = false;

            result.push(c);
        }

        result
    }

    fn merge_start_and_end(&self, start: &str, end: &str) -> Option<String> {
        let mut minified = String::new();
        let mut question_counter = 0;

        for (idx, start_c) in start.chars().enumerate() {
            if let Some(end_c) = &end.chars().nth(idx) {
                if start_c == *end_c && question_counter == 0 {
                    minified.push(start_c);
                } else if start_c == '0' && *end_c == 'f' {
                    question_counter += 1;

                    minified.push('?')
                } else {
                    return None;
                }
            } else {
                return None;
            }
        }

        Some(minified)
    }
}
