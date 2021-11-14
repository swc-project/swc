use swc_common::{Span, Spanned};
use swc_ecma_ast::*;

#[derive(Debug, Clone, PartialEq, Spanned)]
pub struct MdxFile {
    pub span: Span,
    pub content: Vec<BlockNode>,
}

#[derive(Debug, Clone, PartialEq)]
pub enum BlockNode {
    /// Ecmascript node
    Es(ModuleItem),

    Header(Header),
    Paragraph {
        span: Span,
        content: Vec<TextNode>,
    },
    BlockQuote(BlockQuote),
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
    Text(Vec<TextNode>),
    Hr {
        span: Span,
    },

    Jsx(Box<Expr>),
}

#[derive(Debug, Clone, PartialEq)]
pub struct Header {
    pub span: Span,
    pub hash_cnt: usize,
    pub content: Vec<TextNode>,
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

#[derive(Debug, Clone, PartialEq, Spanned)]
pub struct BlockQuote {
    pub span: Span,
    pub content: Vec<BlockNode>,
}
