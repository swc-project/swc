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

use oxc_ast::ast::*;
use oxc_data_structures::rope::{Rope, get_line_column};
use oxc_diagnostics::OxcDiagnostic;
use oxc_span::{SPAN, Span};
use oxc_syntax::{number::NumberBase, symbol::SymbolFlags};
use oxc_traverse::{BoundIdentifier, Traverse};

use crate::{
    context::{TransformCtx, TraverseCtx},
    state::TransformState,
};

const SOURCE: &str = "__source";
const FILE_NAME_VAR: &str = "jsxFileName";

pub struct JsxSource<'a, 'ctx> {
    filename_var: Option<BoundIdentifier<'a>>,
    source_rope: Option<Rope>,
    ctx: &'ctx TransformCtx<'a>,
}

impl<'a, 'ctx> JsxSource<'a, 'ctx> {
    pub fn new(ctx: &'ctx TransformCtx<'a>) -> Self {
        Self { filename_var: None, source_rope: None, ctx }
    }
}

impl<'a> Traverse<'a, TransformState<'a>> for JsxSource<'a, '_> {
    fn exit_program(&mut self, _program: &mut Program<'a>, ctx: &mut TraverseCtx<'a>) {
        if let Some(stmt) = self.get_filename_var_statement(ctx) {
            self.ctx.top_level_statements.insert_statement(stmt);
        }
    }

    fn enter_jsx_opening_element(
        &mut self,
        elem: &mut JSXOpeningElement<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        self.add_source_attribute(elem, ctx);
    }
}

impl<'a> JsxSource<'a, '_> {
    /// Get line and column from offset and source text.
    ///
    /// Line number starts at 1.
    /// Column number is in UTF-16 characters, and starts at 1.
    ///
    /// This matches Babel's output.
    pub fn get_line_column(&mut self, offset: u32) -> (u32, u32) {
        let source_rope =
            self.source_rope.get_or_insert_with(|| Rope::from_str(self.ctx.source_text));
        let (line, column) = get_line_column(source_rope, offset, self.ctx.source_text);
        // line and column are zero-indexed, but we want 1-indexed
        (line + 1, column + 1)
    }

    pub fn get_object_property_kind_for_jsx_plugin(
        &mut self,
        line: u32,
        column: u32,
        ctx: &mut TraverseCtx<'a>,
    ) -> ObjectPropertyKind<'a> {
        let kind = PropertyKind::Init;
        let key = ctx.ast.property_key_static_identifier(SPAN, SOURCE);
        let value = self.get_source_object(line, column, ctx);
        ctx.ast.object_property_kind_object_property(SPAN, kind, key, value, false, false, false)
    }

    pub fn report_error(&self, span: Span) {
        let error = OxcDiagnostic::warn("Duplicate __source prop found.").with_label(span);
        self.ctx.error(error);
    }

    /// `<sometag __source={ { fileName: 'this/file.js', lineNumber: 10, columnNumber: 1 } } />`
    ///           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    fn add_source_attribute(
        &mut self,
        elem: &mut JSXOpeningElement<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        // Don't add `__source` if this node was generated
        if elem.span.is_unspanned() {
            return;
        }

        // Check if `__source` attribute already exists
        for item in &elem.attributes {
            if let JSXAttributeItem::Attribute(attribute) = item
                && let JSXAttributeName::Identifier(ident) = &attribute.name
                && ident.name == SOURCE
            {
                self.report_error(ident.span);
                return;
            }
        }

        let key = ctx.ast.jsx_attribute_name_identifier(SPAN, SOURCE);
        // TODO: We shouldn't calculate line + column from scratch each time as it's expensive.
        // Build a table of byte indexes of each line's start on first usage, and save it.
        // Then calculate line and column from that.
        let (line, column) = self.get_line_column(elem.span.start);
        let object = self.get_source_object(line, column, ctx);
        let value =
            ctx.ast.jsx_attribute_value_expression_container(SPAN, JSXExpression::from(object));
        let attribute_item = ctx.ast.jsx_attribute_item_attribute(SPAN, key, Some(value));
        elem.attributes.push(attribute_item);
    }

    #[expect(clippy::cast_lossless)]
    pub fn get_source_object(
        &mut self,
        line: u32,
        column: u32,
        ctx: &mut TraverseCtx<'a>,
    ) -> Expression<'a> {
        let kind = PropertyKind::Init;

        let filename = {
            let key = ctx.ast.property_key_static_identifier(SPAN, "fileName");
            let value = self.get_filename_var(ctx).create_read_expression(ctx);
            ctx.ast
                .object_property_kind_object_property(SPAN, kind, key, value, false, false, false)
        };

        let line_number = {
            let key = ctx.ast.property_key_static_identifier(SPAN, "lineNumber");
            let value =
                ctx.ast.expression_numeric_literal(SPAN, line as f64, None, NumberBase::Decimal);
            ctx.ast
                .object_property_kind_object_property(SPAN, kind, key, value, false, false, false)
        };

        let column_number = {
            let key = ctx.ast.property_key_static_identifier(SPAN, "columnNumber");
            let value =
                ctx.ast.expression_numeric_literal(SPAN, column as f64, None, NumberBase::Decimal);
            ctx.ast
                .object_property_kind_object_property(SPAN, kind, key, value, false, false, false)
        };

        let properties = ctx.ast.vec_from_array([filename, line_number, column_number]);
        ctx.ast.expression_object(SPAN, properties)
    }

    pub fn get_filename_var_statement(&self, ctx: &TraverseCtx<'a>) -> Option<Statement<'a>> {
        let decl = self.get_filename_var_declarator(ctx)?;

        let var_decl = Statement::VariableDeclaration(ctx.ast.alloc_variable_declaration(
            SPAN,
            VariableDeclarationKind::Var,
            ctx.ast.vec1(decl),
            false,
        ));
        Some(var_decl)
    }

    pub fn get_filename_var_declarator(
        &self,
        ctx: &TraverseCtx<'a>,
    ) -> Option<VariableDeclarator<'a>> {
        let filename_var = self.filename_var.as_ref()?;

        let id = filename_var.create_binding_pattern(ctx);
        let source_path = ctx.ast.atom(&self.ctx.source_path.to_string_lossy());
        let init = ctx.ast.expression_string_literal(SPAN, source_path, None);
        let decl =
            ctx.ast.variable_declarator(SPAN, VariableDeclarationKind::Var, id, Some(init), false);
        Some(decl)
    }

    fn get_filename_var(&mut self, ctx: &mut TraverseCtx<'a>) -> &BoundIdentifier<'a> {
        self.filename_var.get_or_insert_with(|| {
            ctx.generate_uid_in_root_scope(FILE_NAME_VAR, SymbolFlags::FunctionScopedVariable)
        })
    }
}
