#![cfg_attr(docsrs, feature(doc_cfg))]
#![deny(clippy::all)]
#![allow(clippy::ptr_arg)]

use swc_atoms::Atom;
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
        pub name: Option<Atom>,
        pub public_id: Option<Atom>,
        pub system_id: Option<Atom>,
        pub raw: Option<Atom>,
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
        pub tag_name: Atom,
        pub namespace: Namespace,
        pub attributes: Vec<Attribute>,
        pub children: Vec<Child>,
        pub content: Option<DocumentFragment>,
        pub is_self_closing: bool,
    }

    pub struct Attribute {
        pub span: Span,
        pub namespace: Option<Namespace>,
        pub prefix: Option<Atom>,
        pub name: Atom,
        pub raw_name: Option<Atom>,
        pub value: Option<Atom>,
        pub raw_value: Option<Atom>,
    }

    pub struct Text {
        pub span: Span,
        pub data: Atom,
        pub raw: Option<Atom>,
    }

    pub struct Comment {
        pub span: Span,
        pub data: Atom,
        pub raw: Option<Atom>,
    }
});

impl<T: ?Sized> Node for T {}
