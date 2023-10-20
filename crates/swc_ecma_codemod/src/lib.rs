use swc_common::Span;

#[derive(Debug)]
pub struct TextEdit {
    pub span: Span,

    pub new_text: String,
}
