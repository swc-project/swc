#![deny(clippy::all)]
#![allow(clippy::ptr_arg)]

use swc_atoms::JsWord;
use swc_common::Span;
use swc_html_ast::*;
use swc_visit::define;

/// Visitable nodes.
pub trait Node {}

define!({
    pub struct Document {
        pub span: Span,
        pub mode: DocumentMode,
        pub children: Vec<Child>,
    }

    pub struct DocumentFragment {
        pub span: Span,
        pub children: Vec<Child>,
    }

    pub enum DocumentMode {
        NoQuirks,
        LimitedQuirks,
        Quirks,
    }

    pub enum Child {
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

    pub enum Namespace {
        HTML,
        MATHML,
        SVG,
        XLINK,
        XML,
        XMLNS,
    }

    pub struct Element {
        pub span: Span,
        pub tag_name: JsWord,
        pub namespace: Namespace,
        pub attributes: Vec<Attribute>,
        pub children: Vec<Child>,
        pub content: Option<DocumentFragment>,
    }

    pub struct Attribute {
        pub span: Span,
        pub namespace: Option<Namespace>,
        pub prefix: Option<JsWord>,
        pub name: JsWord,
        pub value: Option<JsWord>,
    }

    pub struct Text {
        pub span: Span,
        pub data: JsWord,
    }

    pub struct Comment {
        pub span: Span,
        pub data: JsWord,
    }
});

impl<T: ?Sized> Node for T {}
