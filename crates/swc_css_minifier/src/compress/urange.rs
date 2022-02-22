use swc_css_ast::*;
use swc_css_visit::{VisitMut, VisitMutWith};

pub fn compress_urange() -> impl VisitMut {
    CompressUrange {}
}

struct CompressUrange {}

impl CompressUrange {
    fn remove_leading_zeros(&mut self, value: &str) -> String {
        let mut result = String::new();
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

    fn merge_start_and_end(&mut self, start: &str, end: &str) -> Option<String> {
        let mut minified = String::new();
        let mut question_counter = 0;

        for (idx, start_c) in start.chars().enumerate() {
            if let Some(end_c) = &end.chars().nth(idx) {
                if start_c.eq_ignore_ascii_case(end_c) && question_counter == 0 {
                    minified.push(start_c);
                } else if start_c == '0' && end_c.eq_ignore_ascii_case(&'f') {
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

// IE and Edge before 16 version ignore the unicode-range if the 'U' is
// lowercase

impl VisitMut for CompressUrange {
    fn visit_mut_urange(&mut self, urange: &mut Urange) {
        urange.visit_mut_children_with(self);

        let str_value = &urange.value[2..];

        if !urange.value.contains('-') {
            let mut value = String::new();

            value.push_str("U+");
            value.push_str(&self.remove_leading_zeros(str_value));

            urange.value = value.into();

            return;
        }

        let parts: Vec<&str> = str_value.split('-').collect();

        if parts.len() != 2 {
            return;
        }

        let start = parts[0];
        let end = parts[1];
        let merged = self.merge_start_and_end(start, end);

        if let Some(merged) = &merged {
            let mut value = String::new();

            value.push_str("U+");
            value.push_str(&self.remove_leading_zeros(merged));

            urange.value = value.into();
        } else {
            let mut value = String::new();

            value.push_str("U+");
            value.push_str(&self.remove_leading_zeros(start));
            value.push('-');
            value.push_str(&self.remove_leading_zeros(end));

            urange.value = value.into();
        }
    }
}
