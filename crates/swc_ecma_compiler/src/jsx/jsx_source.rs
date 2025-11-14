//! React JSX Source
//!
//! This plugin adds `__source` attribute to JSX elements.
//!
//! > This plugin is included in `preset-react`.
//!
//! ## Example
//!
//! Input:
//! ```js
//! <div>foo</div>;
//! <Bar>foo</Bar>;
//! <>foo</>;
//! ```
//!
//! Output:
//! ```js
//! var _jsxFileName = "<CWD>/test.js";
//! <div __source={
//!     { fileName: _jsxFileName, lineNumber: 1, columnNumber: 1 }
//! }>foo</div>;
//! <Bar __source={
//!     { fileName: _jsxFileName, lineNumber: 2, columnNumber: 1 }
//! }>foo</Bar>;
//! <>foo</>;
//! ```
//!
//! ## Implementation
//!
//! Implementation based on [@babel/plugin-transform-react-jsx-source](https://babeljs.io/docs/babel-plugin-transform-react-jsx-source).
//!
//! ## References:
//!
//! * Babel plugin implementation: <https://github.com/babel/babel/blob/v7.26.2/packages/babel-plugin-transform-react-jsx-source/src/index.ts>

use swc_common::{
    errors::{Diagnostic, Level},
    SyntaxContext, DUMMY_SP,
};
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;

use crate::context::TraverseCtx;

const SOURCE: &str = "__source";
const FILE_NAME_VAR: &str = "jsxFileName";

pub struct JsxSource {
    filename_var: Option<Ident>,
    filename_var_created: bool,
}

impl JsxSource {
    pub fn new() -> Self {
        Self {
            filename_var: None,
            filename_var_created: false,
        }
    }
}

impl VisitMutHook<TraverseCtx<'_>> for JsxSource {
    fn exit_program(&mut self, _program: &mut Program, ctx: &mut TraverseCtx) {
        if let Some(stmt) = self.get_filename_var_statement(ctx) {
            ctx.top_level_statements.insert_statement(stmt);
        }
    }

    fn enter_jsx_opening_element(&mut self, elem: &mut JSXOpeningElement, ctx: &mut TraverseCtx) {
        self.add_source_attribute(elem, ctx);
    }
}

impl JsxSource {
    /// Get line and column from offset and source text.
    ///
    /// Line number starts at 1.
    /// Column number is in UTF-16 characters, and starts at 1.
    ///
    /// This matches Babel's output.
    ///
    /// Note: This is a simplified implementation. In a full implementation,
    /// we would use the source map to get accurate line/column information.
    pub fn get_line_column(&self, _offset: u32) -> (u32, u32) {
        // For now, return default values (1, 1).
        // A full implementation would need access to source map or source text
        // to calculate accurate line and column numbers.
        // This should be enhanced when proper source map integration is available.
        (1, 1)
    }

    pub fn get_object_property_kind_for_jsx_plugin(
        &mut self,
        line: u32,
        column: u32,
    ) -> PropOrSpread {
        let key = PropName::Ident(IdentName {
            span: DUMMY_SP,
            sym: SOURCE.into(),
        });

        let value = Box::new(self.get_source_object(line, column));

        PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp { key, value })))
    }

    pub fn report_error(&self, span: swc_common::Span, ctx: &TraverseCtx) {
        let mut diagnostic = Diagnostic::new(Level::Error, "Duplicate __source prop found.");
        diagnostic.span_label(span, "duplicate __source");
        ctx.error(diagnostic);
    }

    /// `<sometag __source={ { fileName: 'this/file.js', lineNumber: 10,
    /// columnNumber: 1 } } />`
    ///           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    fn add_source_attribute(&mut self, elem: &mut JSXOpeningElement, ctx: &TraverseCtx) {
        // Don't add `__source` if this node was generated
        if elem.span.is_dummy() {
            return;
        }

        // Check if `__source` attribute already exists
        for item in &elem.attrs {
            if let JSXAttrOrSpread::JSXAttr(attribute) = item {
                if let JSXAttrName::Ident(ident) = &attribute.name {
                    if &*ident.sym == SOURCE {
                        self.report_error(ident.span, ctx);
                        return;
                    }
                }
            }
        }

        let key = JSXAttrName::Ident(IdentName {
            span: DUMMY_SP,
            sym: SOURCE.into(),
        });

        // Get line and column from span
        let (line, column) = self.get_line_column(elem.span.lo.0);
        let object = self.get_source_object(line, column);

        let value = Some(JSXAttrValue::JSXExprContainer(JSXExprContainer {
            span: DUMMY_SP,
            expr: JSXExpr::Expr(Box::new(object)),
        }));

        let attribute_item = JSXAttrOrSpread::JSXAttr(JSXAttr {
            span: DUMMY_SP,
            name: key,
            value,
        });

        elem.attrs.push(attribute_item);
    }

    #[allow(clippy::cast_lossless)]
    pub fn get_source_object(&mut self, line: u32, column: u32) -> Expr {
        let filename_prop = {
            let key = PropName::Ident(IdentName {
                span: DUMMY_SP,
                sym: "fileName".into(),
            });

            let filename_ident = self.get_filename_var();
            let value = Box::new(Expr::Ident(filename_ident));

            PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp { key, value })))
        };

        let line_number_prop = {
            let key = PropName::Ident(IdentName {
                span: DUMMY_SP,
                sym: "lineNumber".into(),
            });

            let value = Box::new(Expr::Lit(Lit::Num(Number {
                span: DUMMY_SP,
                value: line as f64,
                raw: None,
            })));

            PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp { key, value })))
        };

        let column_number_prop = {
            let key = PropName::Ident(IdentName {
                span: DUMMY_SP,
                sym: "columnNumber".into(),
            });

            let value = Box::new(Expr::Lit(Lit::Num(Number {
                span: DUMMY_SP,
                value: column as f64,
                raw: None,
            })));

            PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp { key, value })))
        };

        Expr::Object(ObjectLit {
            span: DUMMY_SP,
            props: vec![filename_prop, line_number_prop, column_number_prop],
        })
    }

    pub fn get_filename_var_statement(&self, ctx: &TraverseCtx) -> Option<Stmt> {
        if !self.filename_var_created {
            return None;
        }

        let decl = self.get_filename_var_declarator(ctx)?;

        let var_decl = Stmt::Decl(Decl::Var(Box::new(VarDecl {
            span: DUMMY_SP,
            kind: VarDeclKind::Var,
            declare: false,
            decls: vec![decl],
            ..Default::default()
        })));

        Some(var_decl)
    }

    pub fn get_filename_var_declarator(&self, ctx: &TraverseCtx) -> Option<VarDeclarator> {
        let filename_var = self.filename_var.as_ref()?;

        let id = Pat::Ident(BindingIdent {
            id: filename_var.clone(),
            type_ann: None,
        });

        let source_path = ctx.source_path.to_string_lossy();
        let init = Some(Box::new(Expr::Lit(Lit::Str(Str {
            span: DUMMY_SP,
            value: source_path.as_ref().into(),
            raw: None,
        }))));

        let decl = VarDeclarator {
            span: DUMMY_SP,
            name: id,
            init,
            definite: false,
        };

        Some(decl)
    }

    fn get_filename_var(&mut self) -> Ident {
        if let Some(ref var) = self.filename_var {
            return var.clone();
        }

        // Create a unique identifier for the filename variable
        // In a full implementation, this should use proper UID generation
        // to avoid name collisions
        let ident = Ident {
            span: DUMMY_SP,
            ctxt: SyntaxContext::empty(),
            sym: FILE_NAME_VAR.into(),
            optional: false,
        };

        self.filename_var = Some(ident.clone());
        self.filename_var_created = true;

        ident
    }
}
