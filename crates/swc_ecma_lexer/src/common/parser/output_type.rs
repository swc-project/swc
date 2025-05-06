use swc_common::Span;
use swc_ecma_ast::{
    Class, ClassDecl, ClassExpr, Decl, DefaultDecl, ExportDefaultDecl, Expr, FnDecl, FnExpr,
    Function, Ident,
};

use crate::error::SyntaxError;

pub trait OutputType: Sized {
    const IS_IDENT_REQUIRED: bool;

    /// From babel..
    ///
    /// When parsing function expression, the binding identifier is parsed
    /// according to the rules inside the function.
    /// e.g. (function* yield() {}) is invalid because "yield" is disallowed in
    /// generators.
    /// This isn't the case with function declarations: function* yield() {} is
    /// valid because yield is parsed as if it was outside the generator.
    /// Therefore, this.state.inGenerator is set before or after parsing the
    /// function id according to the "isStatement" parameter.
    fn is_fn_expr() -> bool {
        false
    }

    fn finish_fn(span: Span, ident: Option<Ident>, f: Box<Function>) -> Result<Self, SyntaxError>;

    fn finish_class(
        span: Span,
        ident: Option<Ident>,
        class: Box<Class>,
    ) -> Result<Self, SyntaxError>;
}

impl OutputType for Box<Expr> {
    const IS_IDENT_REQUIRED: bool = false;

    fn is_fn_expr() -> bool {
        true
    }

    fn finish_fn(
        _span: Span,
        ident: Option<Ident>,
        function: Box<Function>,
    ) -> Result<Self, SyntaxError> {
        Ok(FnExpr { ident, function }.into())
    }

    fn finish_class(
        _span: Span,
        ident: Option<Ident>,
        class: Box<Class>,
    ) -> Result<Self, SyntaxError> {
        Ok(ClassExpr { ident, class }.into())
    }
}

impl OutputType for ExportDefaultDecl {
    const IS_IDENT_REQUIRED: bool = false;

    fn finish_fn(
        span: Span,
        ident: Option<Ident>,
        function: Box<Function>,
    ) -> Result<Self, SyntaxError> {
        Ok(ExportDefaultDecl {
            span,
            decl: DefaultDecl::Fn(FnExpr { ident, function }),
        })
    }

    fn finish_class(
        span: Span,
        ident: Option<Ident>,
        class: Box<Class>,
    ) -> Result<Self, SyntaxError> {
        Ok(ExportDefaultDecl {
            span,
            decl: DefaultDecl::Class(ClassExpr { ident, class }),
        })
    }
}

impl OutputType for Decl {
    const IS_IDENT_REQUIRED: bool = true;

    fn finish_fn(
        _span: Span,
        ident: Option<Ident>,
        function: Box<Function>,
    ) -> Result<Self, SyntaxError> {
        let ident = ident.ok_or(SyntaxError::ExpectedIdent)?;

        Ok(FnDecl {
            declare: false,
            ident,
            function,
        }
        .into())
    }

    fn finish_class(_: Span, ident: Option<Ident>, class: Box<Class>) -> Result<Self, SyntaxError> {
        let ident = ident.ok_or(SyntaxError::ExpectedIdent)?;

        Ok(ClassDecl {
            declare: false,
            ident,
            class,
        }
        .into())
    }
}
