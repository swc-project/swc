use oxc_allocator::Box;
use swc_common::Span;
use swc_ecma_ast::*;

use super::{
    js::{FunctionKind, VariableDeclarationContext, VariableDeclarationParent},
    lexer::Kind,
    modifiers::{ModifierFlags, ModifierKind, Modifiers},
    ParserImpl,
};
use crate::{diagnostics, diagnostics::Result};

impl<'a> ParserImpl<'a> {
    /** ------------------- Enum ------------------ */

    pub(crate) fn is_at_enum_declaration(&mut self) -> bool {
        self.at(Kind::Enum) || (self.at(Kind::Const) && self.peek_at(Kind::Enum))
    }

    /// `https://www.typescriptlang.org/docs/handbook/enums.html`
    pub(crate) fn parse_ts_enum_declaration(
        &mut self,
        span: Span,
        modifiers: &Modifiers<'a>,
    ) -> Result<Declaration<'a>> {
        self.bump_any(); // bump `enum`
        let id = self.parse_binding_identifier()?;
        self.expect(Kind::LCurly)?;
        let members = self.parse_delimited_list(
            Kind::RCurly,
            Kind::Comma,
            /* trailing_separator */ true,
            Self::parse_ts_enum_member,
        )?;
        self.expect(Kind::RCurly)?;
        let span = self.end_span(span);
        self.verify_modifiers(
            modifiers,
            ModifierFlags::DECLARE | ModifierFlags::CONST,
            diagnostics::modifier_cannot_be_used_here,
        );
        Ok(self.ast.declaration_ts_enum(
            span,
            id,
            members,
            modifiers.contains_const(),
            modifiers.contains_declare(),
        ))
    }

    pub(crate) fn parse_ts_enum_member(&mut self) -> Result<TSEnumMember<'a>> {
        let span = self.start_span();
        let id = self.parse_ts_enum_member_name()?;

        let initializer = if self.eat(Kind::Eq) {
            Some(self.parse_assignment_expression_or_higher()?)
        } else {
            None
        };

        Ok(TSEnumMember {
            span: self.end_span(span),
            id,
            initializer,
        })
    }

    fn parse_ts_enum_member_name(&mut self) -> Result<TSEnumMemberName<'a>> {
        match self.cur_kind() {
            Kind::LBrack => {
                let node = self.parse_computed_property_name()?;
                Ok(self.ast.ts_enum_member_name_expression(node))
            }
            Kind::Str => {
                let node = self.parse_literal_string()?;
                Ok(self.ast.ts_enum_member_name_from_string_literal(node))
            }
            kind if kind.is_number() => {
                let node = self.parse_literal_number()?;
                Ok(self.ast.ts_enum_member_name_from_numeric_literal(node))
            }
            _ => {
                let node = self.parse_identifier_name()?;
                Ok(self.ast.ts_enum_member_name_from_identifier_name(node))
            }
        }
    }

    /** ------------------- Annotation ----------------- */

    pub(crate) fn parse_ts_type_annotation(
        &mut self,
    ) -> Result<Option<Box<'a, TSTypeAnnotation<'a>>>> {
        if !self.ts_enabled() {
            return Ok(None);
        }
        if !self.at(Kind::Colon) {
            return Ok(None);
        }
        let span = self.start_span();
        self.bump_any(); // bump ':'
        let type_annotation = self.parse_ts_type()?;
        Ok(Some(self.ast.alloc_ts_type_annotation(
            self.end_span(span),
            type_annotation,
        )))
    }

    pub(crate) fn parse_ts_type_alias_declaration(
        &mut self,
        span: Span,
        modifiers: &Modifiers<'a>,
    ) -> Result<Declaration<'a>> {
        self.expect(Kind::Type)?;

        let id = self.parse_binding_identifier()?;
        let params = self.parse_ts_type_parameters()?;
        self.expect(Kind::Eq)?;

        let annotation = self.parse_ts_type()?;

        self.asi()?;
        let span = self.end_span(span);

        self.verify_modifiers(
            modifiers,
            ModifierFlags::DECLARE,
            diagnostics::modifier_cannot_be_used_here,
        );

        Ok(self.ast.declaration_ts_type_alias(
            span,
            id,
            params,
            annotation,
            modifiers.contains_declare(),
        ))
    }

    /** ---------------------  Interface  ------------------------ */

    pub(crate) fn parse_ts_interface_declaration(
        &mut self,
        span: Span,
        modifiers: &Modifiers<'a>,
    ) -> Result<Declaration<'a>> {
        self.expect(Kind::Interface)?; // bump interface
        let id = self.parse_binding_identifier()?;
        let type_parameters = self.parse_ts_type_parameters()?;
        let (extends, _) = self.parse_heritage_clause()?;
        let body = self.parse_ts_interface_body()?;
        let extends = extends.map(|e| self.ast.ts_interface_heritages(e));

        self.verify_modifiers(
            modifiers,
            ModifierFlags::DECLARE,
            diagnostics::modifier_cannot_be_used_here,
        );

        Ok(self.ast.declaration_ts_interface(
            self.end_span(span),
            id,
            extends,
            type_parameters,
            body,
            modifiers.contains_declare(),
        ))
    }

    fn parse_ts_interface_body(&mut self) -> Result<Box<'a, TSInterfaceBody<'a>>> {
        let span = self.start_span();
        let body_list =
            self.parse_normal_list(Kind::LCurly, Kind::RCurly, Self::parse_ts_type_signature)?;
        Ok(self
            .ast
            .alloc_ts_interface_body(self.end_span(span), body_list))
    }

    pub(crate) fn is_at_interface_declaration(&mut self) -> bool {
        if !self.at(Kind::Interface) || self.peek_token().is_on_new_line {
            false
        } else {
            self.peek_token().kind.is_binding_identifier() || self.peek_at(Kind::LCurly)
        }
    }

    pub(crate) fn parse_ts_type_signature(&mut self) -> Result<Option<TSSignature<'a>>> {
        if self.is_at_ts_index_signature_member() {
            return self.parse_ts_index_signature_member().map(Some);
        }

        match self.cur_kind() {
            Kind::LParen | Kind::LAngle => self.parse_ts_call_signature_member(),
            Kind::New if self.peek_at(Kind::LParen) || self.peek_at(Kind::LAngle) => {
                self.parse_ts_constructor_signature_member()
            }
            Kind::Get if self.is_next_at_type_member_name() => {
                self.parse_ts_getter_signature_member()
            }
            Kind::Set if self.is_next_at_type_member_name() => {
                self.parse_ts_setter_signature_member()
            }
            _ => self.parse_ts_property_or_method_signature_member(),
        }
        .map(Some)
    }

    /// Must be at `[ident:` or `<modifiers> [ident:`
    pub(crate) fn is_at_ts_index_signature_member(&mut self) -> bool {
        let mut offset = 0;
        while self.is_nth_at_modifier(offset, false) {
            offset += 1;
        }

        if !self.nth_at(offset, Kind::LBrack) {
            return false;
        }

        if !self.nth_kind(offset + 1).is_identifier() {
            return false;
        }

        self.nth_at(offset + 2, Kind::Colon)
    }

    pub(crate) fn is_nth_at_modifier(&mut self, n: u8, is_constructor_parameter: bool) -> bool {
        let nth = self.nth(n);
        if !(matches!(
            nth.kind,
            Kind::Public
                | Kind::Protected
                | Kind::Private
                | Kind::Static
                | Kind::Abstract
                | Kind::Readonly
                | Kind::Declare
                | Kind::Override
        )) {
            return false;
        }

        let next = self.nth(n + 1);

        if next.is_on_new_line {
            false
        } else {
            let followed_by_any_member =
                matches!(next.kind, Kind::PrivateIdentifier | Kind::LBrack)
                    || next.kind.is_literal_property_name();
            let followed_by_class_member = !is_constructor_parameter && next.kind == Kind::Star;
            // allow `...` for error recovery
            let followed_by_parameter = is_constructor_parameter
                && matches!(next.kind, Kind::LCurly | Kind::LBrack | Kind::Dot3);

            followed_by_any_member || followed_by_class_member || followed_by_parameter
        }
    }

    /** ----------------------- Namespace & Module ----------------------- */

    fn parse_ts_module_block(&mut self) -> Result<Box<'a, TSModuleBlock<'a>>> {
        let span = self.start_span();
        self.expect(Kind::LCurly)?;
        let (directives, statements) =
            self.parse_directives_and_statements(/* is_top_level */ false)?;
        self.expect(Kind::RCurly)?;
        Ok(self
            .ast
            .alloc_ts_module_block(self.end_span(span), directives, statements))
    }

    pub(crate) fn parse_ts_namespace_or_module_declaration_body(
        &mut self,
        span: Span,
        kind: TSModuleDeclarationKind,
        modifiers: &Modifiers<'a>,
    ) -> Result<Box<'a, TSModuleDeclaration<'a>>> {
        self.verify_modifiers(
            modifiers,
            ModifierFlags::DECLARE | ModifierFlags::EXPORT,
            diagnostics::modifier_cannot_be_used_here,
        );
        let id = match self.cur_kind() {
            Kind::Str => self
                .parse_literal_string()
                .map(TSModuleDeclarationName::StringLiteral),
            _ => self
                .parse_identifier_name()
                .map(TSModuleDeclarationName::Identifier),
        }?;

        let body = if self.eat(Kind::Dot) {
            let span = self.start_span();
            let decl = self.parse_ts_namespace_or_module_declaration_body(
                span,
                kind,
                &Modifiers::empty(),
            )?;
            Some(TSModuleDeclarationBody::TSModuleDeclaration(decl))
        } else if self.at(Kind::LCurly) {
            let block = self.parse_ts_module_block()?;
            Some(TSModuleDeclarationBody::TSModuleBlock(block))
        } else {
            None
        };

        self.verify_modifiers(
            modifiers,
            ModifierFlags::DECLARE,
            diagnostics::modifier_cannot_be_used_here,
        );

        Ok(self.ast.alloc_ts_module_declaration(
            self.end_span(span),
            id,
            body,
            kind,
            modifiers.contains_declare(),
        ))
    }

    /** ----------------------- declare --------------------- */

    pub(crate) fn parse_ts_declaration_statement(&mut self, start_span: Span) -> Result<Stmt> {
        let reserved_ctx = self.ctx;
        let modifiers = self.eat_modifiers_before_declaration()?;
        self.ctx = self
            .ctx
            .union_ambient_if(modifiers.contains_declare())
            .and_await(modifiers.contains_async());
        let result = self.parse_declaration(start_span, &modifiers);
        self.ctx = reserved_ctx;
        result.map(Stmt::from)
    }

    pub(crate) fn parse_declaration(
        &mut self,
        start_span: Span,
        modifiers: &Modifiers<'a>,
    ) -> Result<Declaration<'a>> {
        match self.cur_kind() {
            Kind::Namespace => {
                let kind = TSModuleDeclarationKind::Namespace;
                self.bump_any();
                self.parse_ts_namespace_or_module_declaration_body(start_span, kind, modifiers)
                    .map(Declaration::TSModuleDeclaration)
            }
            Kind::Module => {
                let kind = TSModuleDeclarationKind::Module;
                self.bump_any();
                self.parse_ts_namespace_or_module_declaration_body(start_span, kind, modifiers)
                    .map(Declaration::TSModuleDeclaration)
            }
            Kind::Global => {
                // declare global { }
                let kind = TSModuleDeclarationKind::Global;
                self.parse_ts_namespace_or_module_declaration_body(start_span, kind, modifiers)
                    .map(Declaration::TSModuleDeclaration)
            }
            Kind::Type => self.parse_ts_type_alias_declaration(start_span, modifiers),
            Kind::Enum => self.parse_ts_enum_declaration(start_span, modifiers),
            Kind::Interface if self.is_at_interface_declaration() => {
                self.parse_ts_interface_declaration(start_span, modifiers)
            }
            Kind::Class => self
                .parse_class_declaration(start_span, modifiers)
                .map(Declaration::ClassDeclaration),
            Kind::Import => {
                self.bump_any();
                self.parse_ts_import_equals_declaration(start_span)
            }
            kind if kind.is_variable_declaration() => self
                .parse_variable_declaration(
                    start_span,
                    VariableDeclarationContext::new(VariableDeclarationParent::Clause),
                    modifiers,
                )
                .map(Declaration::VariableDeclaration),
            _ if self.at_function_with_async() => {
                let declare = modifiers.contains(ModifierKind::Declare);
                if declare {
                    self.parse_ts_declare_function(start_span, modifiers)
                        .map(Declaration::FunctionDeclaration)
                } else if self.ts_enabled() {
                    self.parse_ts_function_impl(start_span, FunctionKind::Declaration, modifiers)
                        .map(Declaration::FunctionDeclaration)
                } else {
                    self.parse_function_impl(FunctionKind::Declaration)
                        .map(Declaration::FunctionDeclaration)
                }
            }
            _ => Err(self.unexpected()),
        }
    }

    pub(crate) fn parse_ts_declare_function(
        &mut self,
        start_span: Span,
        modifiers: &Modifiers<'a>,
    ) -> Result<Box<'a, Function<'a>>> {
        let r#async = modifiers.contains(ModifierKind::Async);
        self.expect(Kind::Function)?;
        let func_kind = FunctionKind::TSDeclaration;
        let id = self.parse_function_id(func_kind, r#async, false)?;
        self.parse_function(start_span, id, r#async, false, func_kind, modifiers)
    }

    pub(crate) fn parse_ts_type_assertion(&mut self) -> Result<Expr> {
        let span = self.start_span();
        self.expect(Kind::LAngle)?;
        let type_annotation = self.parse_ts_type()?;
        self.expect(Kind::RAngle)?;
        let lhs_span = self.start_span();
        let expression = self.parse_simple_unary_expression(lhs_span)?;
        Ok(self
            .ast
            .expression_ts_type_assertion(self.end_span(span), expression, type_annotation))
    }

    pub(crate) fn parse_ts_import_equals_declaration(
        &mut self,
        span: Span,
    ) -> Result<Declaration<'a>> {
        let import_kind = if !self.peek_at(Kind::Eq) && self.eat(Kind::Type) {
            ImportOrExportKind::Type
        } else {
            ImportOrExportKind::Value
        };

        let id = self.parse_binding_identifier()?;

        self.expect(Kind::Eq)?;

        let reference_span = self.start_span();
        let module_reference = if self.eat(Kind::Require) {
            self.expect(Kind::LParen)?;
            let expression = self.parse_literal_string()?;
            self.expect(Kind::RParen)?;
            self.ast.ts_module_reference_external_module_reference(
                self.end_span(reference_span),
                expression,
            )
        } else {
            let node = self.parse_ts_type_name()?;
            self.ast.ts_module_reference_type_name(node)
        };

        self.asi()?;

        Ok(self.ast.declaration_ts_import_equals(
            self.end_span(span),
            id,
            module_reference,
            import_kind,
        ))
    }

    pub(crate) fn parse_ts_this_parameter(&mut self) -> Result<TSThisParameter<'a>> {
        let span = self.start_span();
        self.parse_class_element_modifiers(true);
        self.eat_decorators()?;
        let this = {
            let (span, name) = self.parse_identifier_kind(Kind::This);
            IdentifierName { span, name }
        };
        let type_annotation = self.parse_ts_type_annotation()?;
        Ok(self
            .ast
            .ts_this_parameter(self.end_span(span), this, type_annotation))
    }

    pub(crate) fn eat_decorators(&mut self) -> Result<()> {
        if !self.at(Kind::At) {
            return Ok(());
        }

        let mut decorators = vec![];
        while self.at(Kind::At) {
            let decorator = self.parse_decorator()?;
            decorators.push(decorator);
        }

        self.state.decorators = decorators;
        Ok(())
    }

    pub(crate) fn at_start_of_ts_declaration(&mut self) -> bool {
        self.lookahead(Self::at_start_of_ts_declaration_worker)
    }

    /// Check if the parser is at a start of a declaration
    fn at_start_of_ts_declaration_worker(&mut self) -> bool {
        loop {
            match self.cur_kind() {
                Kind::Var | Kind::Let | Kind::Const | Kind::Function | Kind::Class | Kind::Enum => {
                    return true;
                }
                Kind::Interface | Kind::Type => {
                    self.bump_any();
                    return self.cur_kind().is_binding_identifier()
                        && !self.cur_token().is_on_new_line;
                }
                Kind::Module | Kind::Namespace => {
                    self.bump_any();
                    return !self.cur_token().is_on_new_line
                        && (self.cur_kind().is_binding_identifier()
                            || self.cur_kind() == Kind::Str);
                }
                Kind::Abstract
                | Kind::Accessor
                | Kind::Async
                | Kind::Declare
                | Kind::Private
                | Kind::Protected
                | Kind::Public
                | Kind::Readonly => {
                    self.bump_any();
                    if self.cur_token().is_on_new_line {
                        return false;
                    }
                }
                Kind::Global => {
                    self.bump_any();
                    return matches!(self.cur_kind(), Kind::Ident | Kind::LCurly | Kind::Export);
                }
                Kind::Import => {
                    self.bump_any();
                    return matches!(self.cur_kind(), Kind::Str | Kind::Star | Kind::LCurly)
                        || self.cur_kind().is_identifier();
                }
                Kind::Export => {
                    self.bump_any();
                    let kind = if self.cur_kind() == Kind::Type {
                        self.peek_kind()
                    } else {
                        self.cur_kind()
                    };
                    // This allows constructs like
                    // `export *`, `export default`, `export {}`, `export = {}` along with all
                    // export [declaration]
                    if matches!(
                        kind,
                        Kind::Eq | Kind::Star | Kind::Default | Kind::LCurly | Kind::At | Kind::As
                    ) {
                        return true;
                    }
                    // falls through to check next token
                }
                Kind::Static => {
                    self.bump_any();
                }
                _ => {
                    return false;
                }
            }
        }
    }
}
