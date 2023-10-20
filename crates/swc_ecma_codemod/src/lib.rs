use swc_common::Span;

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
