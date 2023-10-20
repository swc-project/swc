use swc_common::Span;

pub mod modifications;

#[derive(Debug)]
pub struct TextEdit {
    pub span: Span,

    pub new_text: String,
}

/// One modification to a file. All text edits must be applied or none.
#[derive(Debug)]
pub struct Modification {
    pub edits: Vec<TextEdit>,
}

pub struct Operator {
    /// The modifications to apply to the file.
    ///
    /// These are applied in order.
    pub modifications: Vec<Modification>,
}

#[derive(Debug)]
pub enum Error {
    InvalidRange {
        start: usize,
        end: usize,
        offset: isize,
    },
}

impl Operator {
    pub fn apply(&self, to: &str) -> Result<String, Error> {
        let mut result = to.to_string();

        let mut offset = 0isize;

        for modification in &self.modifications {
            for edit in &modification.edits {
                let start = edit.span.lo.0 as isize + offset - 1;
                let end = edit.span.hi.0 as isize + offset - 1;

                if start < 0 || end > (result.len() as isize) || end < start {
                    return Err(Error::InvalidRange {
                        start: start as usize,
                        end: end as usize,
                        offset,
                    });
                }

                result.replace_range((start as usize)..(end as usize), &edit.new_text);

                offset += edit.new_text.len() as isize - (end - start);
            }
        }

        Ok(result)
    }
}
