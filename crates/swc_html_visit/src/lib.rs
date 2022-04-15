#![deny(clippy::all)]
#![allow(clippy::ptr_arg)]

use swc_atoms::JsWord;
use swc_common::Span;
use swc_html_ast::{Node as AstNode, *};
use swc_visit::define;

/// Visitable nodes.
pub trait Node {}

define!({
    pub struct Document {
        pub span: Span,
        pub children: Vec<AstNode>,
    }

    pub enum AstNode {
        DocumentType(DocumentType),
        Element(Element),
        Text(Text),
        Comment(Comment),
    }

    pub struct DocumentType {
        pub span: Span,
        pub name: Option<JsWord>,
        pub public_id: Option<JsWord>,
        pub system_id: Option<JsWord>,
    }

    pub struct Element {
        pub span: Span,
        pub tag_name: JsWord,
        pub start_tag: Option<Tag>,
        pub children: Vec<AstNode>,
        pub end_tag: Option<Tag>,
    }

    pub struct Tag {
        pub span: Span,
        pub attributes: Vec<Attribute>,
    }

    pub struct Attribute {
        pub span: Span,
        pub name: JsWord,
        pub value: JsWord,
    }

    pub struct Text {
        pub span: Span,
        pub value: JsWord,
    }

    pub struct Comment {
        pub span: Span,
        pub data: JsWord,
    }

    pub struct TokenAndSpan {
        pub span: Span,
        pub token: Token,
    }
});

impl<T: ?Sized> Node for T {}
