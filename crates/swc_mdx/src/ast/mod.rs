use swc_common::{Span, Spanned};
use swc_ecma_ast::*;

#[derive(Debug, Clone, PartialEq, Spanned)]
pub struct MdxFile {
    pub span: Span,
    pub content: Vec<BlockNode>,
}

#[derive(Debug, Clone, PartialEq)]
pub enum BlockNode {
    Es6(ModuleDecl),

    JsxEl(JSXElement),
    JsxFrag(JSXFragment),

    Header {
        span: Span,
        hash_cnt: usize,
        content: Vec<TextNode>,
    },
    Paragraph {
        span: Span,
        content: Vec<TextNode>,
    },
    Blockquote {
        span: Span,
        content: Vec<BlockNode>,
    },
    CodeBlock {
        span: Span,
        lang: Option<String>,
        content: String,
    },
    OrderedList {
        span: Span,
        items: Vec<ListItem>,
        list_type: String,
    },
    UnorderedList {
        span: Span,
        items: Vec<ListItem>,
    },
    Raw(Text),
    Hr {
        span: Span,
    },
}

#[derive(Debug, Clone, PartialEq)]
pub enum ListItem {
    Simple(Vec<TextNode>),
    Paragraph(Vec<BlockNode>),
}

#[derive(Debug, Clone, PartialEq, Spanned)]
pub struct TextNode {
    pub span: Span,
    pub kind: TextNodeKind,
}

#[derive(Debug, Clone, PartialEq)]
pub enum TextNodeKind {
    Break,
    Text(String),
    Code(String),
    Link(String, String, Option<String>),
    Image(String, String, Option<String>),
    Emphasis(Vec<TextNode>),
    Strong(Vec<TextNode>),
}

#[derive(Debug, Clone, PartialEq, Spanned)]
pub enum InlineNode {
    Jsx(JSXElement),
}

#[derive(Debug, Clone, PartialEq, Spanned)]
pub struct Text {
    pub span: Span,
    pub value: String,
}
