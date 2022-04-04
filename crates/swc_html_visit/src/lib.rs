#![deny(clippy::all)]
#![allow(clippy::ptr_arg)]

use swc_common::Span;
use swc_html_ast::*;
use swc_visit::define;

/// Visitable nodes.
pub trait Node {}

define!({
    pub struct TokenAndSpan {
        pub span: Span,
        pub token: Token,
    }

    pub struct Document {
        pub span: Span,
        pub children: Vec<TokenAndSpan>,
    }
});

impl<T: ?Sized> Node for T {}
