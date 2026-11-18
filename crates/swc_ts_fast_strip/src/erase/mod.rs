//! AST-driven type erasure with explicit edit plans and item contexts.
//!
//! Statement and class lists retain the previous runtime item across erased
//! declarations. Separators are written into erased source characters, keeping
//! UTF-16 positions and line terminators intact.

use std::borrow::Cow;

use swc_common::{
    errors::{DiagnosticId, Handler},
    BytePos, Span, Spanned,
};
use swc_ecma_ast::*;
use swc_ecma_parser::unstable::{Token, TokenAndSpan};
use swc_ecma_visit::{Visit, VisitWith};

use crate::{
    edit::{EditPlan, FixedSubstitution},
    token_cursor::TokenCursor,
};

mod classes;
mod declarations;
mod expressions;

pub(crate) struct StripDiagnostic {
    pub span: Span,
    kind: UnsupportedSyntax,
}

#[derive(Clone, Copy)]
enum UnsupportedSyntax {
    Enum,
    Namespace,
    ImportEquals,
    ExportAssignment,
    ParameterProperty,
    TypeAssertion,
    UnaryExponentiation,
}

impl StripDiagnostic {
    pub(crate) fn emit(self, handler: &Handler) {
        let message = match self.kind {
            UnsupportedSyntax::Enum => "TypeScript enum is not supported in strip-only mode",
            UnsupportedSyntax::Namespace => {
                "TypeScript namespace declaration is not supported in strip-only mode"
            }
            UnsupportedSyntax::ImportEquals => {
                "TypeScript import equals declaration is not supported in strip-only mode"
            }
            UnsupportedSyntax::ExportAssignment => {
                "TypeScript export assignment is not supported in strip-only mode"
            }
            UnsupportedSyntax::ParameterProperty => {
                "TypeScript parameter property is not supported in strip-only mode"
            }
            UnsupportedSyntax::TypeAssertion => {
                "The angle-bracket syntax for type assertions, `<T>expr`, is not supported in type \
                 strip mode. Instead, use the 'as' syntax: `expr as T`."
            }
            UnsupportedSyntax::UnaryExponentiation => {
                "A unary or await expression on the left-hand side of `**` must be parenthesized \
                 in strip-only mode"
            }
        };
        handler
            .struct_span_err(self.span, message)
            .code(DiagnosticId::Error("UnsupportedSyntax".into()))
            .emit();
    }
}

pub(crate) fn strip<'a>(
    program: &Program,
    source: &'a str,
    source_start: BytePos,
    tokens: &'a [TokenAndSpan],
) -> Result<Cow<'a, str>, Vec<StripDiagnostic>> {
    let mut eraser = TypeEraser {
        tokens: TokenCursor::new(source, source_start, tokens),
        edits: EditPlan::default(),
        diagnostics: Vec::new(),
        item_context: ItemContext::default(),
    };
    program.visit_with(&mut eraser);
    if eraser.diagnostics.is_empty() {
        Ok(eraser.edits.render(source_start, source))
    } else {
        Err(eraser.diagnostics)
    }
}

#[derive(Clone, Copy, Default)]
struct ItemContext {
    previous_retained: Option<Span>,
    terminates_directive_prologue: bool,
    is_directive: bool,
    required_statement: bool,
    erased: bool,
}

struct TypeEraser<'a> {
    tokens: TokenCursor<'a>,
    edits: EditPlan,
    diagnostics: Vec<StripDiagnostic>,
    item_context: ItemContext,
}

impl TypeEraser<'_> {
    fn report_unsupported(&mut self, span: Span, kind: UnsupportedSyntax) {
        self.diagnostics.push(StripDiagnostic { span, kind });
    }

    fn erase_token(&mut self, start: BytePos, end: BytePos, tag: Token) -> Option<BytePos> {
        let token = self.tokens.find_forward(start, end, tag)?;
        self.edits.blank(token.span);
        Some(token.span.lo)
    }

    fn substitute_character(&mut self, start: BytePos, replacement: FixedSubstitution) {
        if let Some(span) = self.tokens.leading_character_span(start) {
            self.edits.substitute(span, replacement);
        }
    }

    fn erase_statement(&mut self, span: Span) {
        self.edits.blank(span);
        self.item_context.erased = true;
        if !self.item_context.terminates_directive_prologue
            && !self.needs_semicolon_before_erasure()
        {
            return;
        }
        if let Some(first) = self.tokens.first_in_range(span.lo, span.hi) {
            self.substitute_character(first.span.lo, FixedSubstitution::Semicolon);
        }
    }

    fn needs_semicolon_before_erasure(&self) -> bool {
        if self.item_context.required_statement {
            return true;
        }
        let Some(previous) = self.item_context.previous_retained else {
            return false;
        };
        !self
            .tokens
            .last_in_range(previous.lo, previous.hi)
            .is_some_and(|t| t.token == Token::Semi)
    }

    fn visit_item_list<N>(&mut self, items: &[N], mut directive_prologue: bool)
    where
        N: Spanned + VisitWith<Self>,
    {
        let saved_context = self.item_context;
        let mut previous_retained = None;
        for item in items {
            self.item_context = ItemContext {
                previous_retained,
                terminates_directive_prologue: directive_prologue,
                ..ItemContext::default()
            };
            item.visit_with(self);
            // The first non-directive ends the original prologue even if it
            // is erased. Its replacement semicolon preserves that boundary.
            directive_prologue &= self.item_context.is_directive;
            if !self.item_context.erased {
                previous_retained = Some(item.span());
            }
        }
        self.item_context = saved_context;
    }

    fn visit_required_statement(&mut self, statement: &Stmt) {
        let saved_context = self.item_context;
        self.item_context = ItemContext {
            required_statement: true,
            ..ItemContext::default()
        };
        statement.visit_with(self);
        self.item_context = saved_context;
    }
}

impl Visit for TypeEraser<'_> {
    fn visit_stmt(&mut self, n: &Stmt) {
        self.item_context.is_directive = n.can_precede_directive();
        n.visit_children_with(self);
    }

    fn visit_expr(&mut self, n: &Expr) {
        if !n.is_ident() {
            n.visit_children_with(self);
        }
    }

    fn visit_bin_expr(&mut self, n: &BinExpr) {
        if n.op == BinaryOp::Exp {
            self.check_exponentiation_operand(&n.left);
        }
        n.visit_children_with(self);
    }

    fn visit_script(&mut self, n: &Script) {
        self.visit_item_list(&n.body, true);
    }

    fn visit_module(&mut self, n: &Module) {
        self.visit_item_list(&n.body, true);
    }

    fn visit_function_body(&mut self, n: &FunctionBody) {
        self.visit_item_list(&n.stmts, true);
    }

    fn visit_ts_module_block(&mut self, n: &TsModuleBlock) {
        self.visit_item_list(&n.body, true);
    }

    fn visit_stmts(&mut self, n: &[Stmt]) {
        self.visit_item_list(n, false);
    }

    fn visit_class_members(&mut self, n: &[ClassMember]) {
        self.visit_item_list(n, false);
    }

    fn visit_if_stmt(&mut self, n: &IfStmt) {
        n.test.visit_with(self);
        self.visit_required_statement(&n.cons);
        if let Some(alt) = &n.alt {
            self.visit_required_statement(alt);
        }
    }

    fn visit_labeled_stmt(&mut self, n: &LabeledStmt) {
        self.visit_required_statement(&n.body);
    }

    fn visit_while_stmt(&mut self, n: &WhileStmt) {
        n.test.visit_with(self);
        self.visit_required_statement(&n.body);
    }

    fn visit_do_while_stmt(&mut self, n: &DoWhileStmt) {
        self.visit_required_statement(&n.body);
        n.test.visit_with(self);
    }

    fn visit_for_stmt(&mut self, n: &ForStmt) {
        n.init.visit_with(self);
        n.test.visit_with(self);
        n.update.visit_with(self);
        self.visit_required_statement(&n.body);
    }

    fn visit_for_in_stmt(&mut self, n: &ForInStmt) {
        n.left.visit_with(self);
        n.right.visit_with(self);
        self.visit_required_statement(&n.body);
    }

    fn visit_for_of_stmt(&mut self, n: &ForOfStmt) {
        n.left.visit_with(self);
        n.right.visit_with(self);
        self.visit_required_statement(&n.body);
    }

    fn visit_with_stmt(&mut self, n: &WithStmt) {
        n.obj.visit_with(self);
        self.visit_required_statement(&n.body);
    }

    fn visit_class(&mut self, n: &Class) {
        self.erase_class(n);
    }

    fn visit_class_prop(&mut self, n: &ClassProp) {
        self.erase_class_prop(n);
    }

    fn visit_class_method(&mut self, n: &ClassMethod) {
        self.erase_class_method(n);
    }

    fn visit_private_prop(&mut self, n: &PrivateProp) {
        self.erase_private_prop(n);
    }

    fn visit_private_method(&mut self, n: &PrivateMethod) {
        self.erase_private_method(n);
    }

    fn visit_auto_accessor(&mut self, n: &AutoAccessor) {
        self.erase_auto_accessor(n);
    }

    fn visit_constructor(&mut self, n: &Constructor) {
        self.erase_constructor(n);
    }

    fn visit_decl(&mut self, n: &Decl) {
        self.erase_decl(n);
    }

    fn visit_export_decl(&mut self, n: &ExportDecl) {
        self.erase_export_decl(n);
    }

    fn visit_export_default_decl(&mut self, n: &ExportDefaultDecl) {
        self.erase_export_default_decl(n);
    }

    fn visit_import_decl(&mut self, n: &ImportDecl) {
        self.erase_import_decl(n);
    }

    fn visit_named_export(&mut self, n: &NamedExport) {
        self.erase_named_export(n);
    }

    fn visit_export_all(&mut self, n: &ExportAll) {
        if n.type_only {
            self.erase_statement(n.span);
        }
    }

    fn visit_ts_module_decl(&mut self, n: &TsModuleDecl) {
        self.erase_ts_module_decl(n);
    }

    fn visit_ts_enum_decl(&mut self, n: &TsEnumDecl) {
        if n.declare {
            self.erase_statement(n.span);
            return;
        }
        self.report_unsupported(n.span, UnsupportedSyntax::Enum);
    }

    fn visit_ts_import_equals_decl(&mut self, n: &TsImportEqualsDecl) {
        if n.is_type_only {
            self.erase_statement(n.span);
        } else {
            self.report_unsupported(n.span, UnsupportedSyntax::ImportEquals);
        }
    }

    fn visit_ts_export_assignment(&mut self, n: &TsExportAssignment) {
        self.report_unsupported(n.span, UnsupportedSyntax::ExportAssignment);
    }

    fn visit_ts_param_prop(&mut self, n: &TsParamProp) {
        n.decorators.visit_with(self);
        self.report_unsupported(n.param.span(), UnsupportedSyntax::ParameterProperty);
    }

    fn visit_ts_namespace_export_decl(&mut self, n: &TsNamespaceExportDecl) {
        self.erase_statement(n.span);
    }

    fn visit_ts_index_signature(&mut self, n: &TsIndexSignature) {
        self.erase_statement(n.span);
    }

    fn visit_ts_interface_decl(&mut self, n: &TsInterfaceDecl) {
        self.erase_statement(n.span);
    }

    fn visit_ts_type_alias_decl(&mut self, n: &TsTypeAliasDecl) {
        self.erase_statement(n.span);
    }

    fn visit_ts_type_ann(&mut self, n: &TsTypeAnn) {
        self.edits.blank(n.span);
    }

    fn visit_ts_type_param_decl(&mut self, n: &TsTypeParamDecl) {
        self.edits.blank(n.span);
    }

    fn visit_ts_type_param_instantiation(&mut self, n: &TsTypeParamInstantiation) {
        self.edits.blank(n.span);
    }

    fn visit_arrow_expr(&mut self, n: &ArrowExpr) {
        self.erase_arrow(n);
    }

    fn visit_ts_this_param(&mut self, n: &TsThisParam) {
        let end = self
            .tokens
            .at_or_after(n.span.hi)
            .filter(|t| t.token == Token::Comma)
            .map_or(n.span.hi, |t| t.span.hi);
        self.edits.blank(Span::new(n.span.lo, end));
    }

    fn visit_var_declarator(&mut self, n: &VarDeclarator) {
        if n.definite {
            if let Pat::Ident(id) = &n.name {
                self.erase_token(id.id.span.hi, n.span.hi, Token::Bang);
            }
        }
        n.visit_children_with(self);
    }

    fn visit_binding_ident(&mut self, n: &BindingIdent) {
        if n.optional {
            self.erase_optional_parameter(n.type_ann.as_deref(), n.span);
        }
        n.visit_children_with(self);
    }

    fn visit_array_pat(&mut self, n: &ArrayPat) {
        if n.optional {
            self.erase_optional_parameter(n.type_ann.as_deref(), n.span);
        }
        n.visit_children_with(self);
    }

    fn visit_object_pat(&mut self, n: &ObjectPat) {
        if n.optional {
            self.erase_optional_parameter(n.type_ann.as_deref(), n.span);
        }
        n.visit_children_with(self);
    }

    fn visit_ts_as_expr(&mut self, n: &TsAsExpr) {
        n.expr.visit_with(self);
        self.erase_postfix_type_assertion(&n.expr, n.span);
    }

    fn visit_ts_satisfies_expr(&mut self, n: &TsSatisfiesExpr) {
        n.expr.visit_with(self);
        self.erase_postfix_type_assertion(&n.expr, n.span);
    }

    fn visit_ts_non_null_expr(&mut self, n: &TsNonNullExpr) {
        n.expr.visit_with(self);
        self.erase_suffix_expression(&n.expr, n.span);
    }

    fn visit_ts_instantiation(&mut self, n: &TsInstantiation) {
        n.expr.visit_with(self);
        self.erase_suffix_expression(&n.expr, n.span);
    }

    fn visit_ts_type_assertion(&mut self, n: &TsTypeAssertion) {
        self.erase_prefix_assertion(&n.expr, n.span);
    }

    fn visit_ts_const_assertion(&mut self, n: &TsConstAssertion) {
        if n.span.lo < n.expr.span_lo() {
            self.erase_prefix_assertion(&n.expr, n.span);
        } else {
            n.expr.visit_with(self);
            self.erase_postfix_type_assertion(&n.expr, n.span);
        }
    }
}
