use oxc_ast::syntax_directed_operations::PropName;
use swc_common::{Span, Spanned};
use swc_ecma_ast::{Accessibility, Expr, Stmt, *};

use crate::{
    types::{AccessorPropertyType, ClassType, MethodDefinitionKind},
    v2::{
        diagnostics::{self, Result},
        lexer::Kind,
        modifiers::{ModifierFlags, ModifierKind, Modifiers},
        Context, ParserImpl, StatementContext,
    },
};

type Extends<'a> = Vec<(Expr, Option<Box<TsTypeParamInstantiation>>, Span)>;

type Implements<'a> = Vec<TsExprWithTypeArgs>;

/// Section 15.7 Class Definitions
impl<'a> ParserImpl<'a> {
    // `start_span` points at the start of all decoractors and `class` keyword.
    pub(crate) fn parse_class_statement(
        &mut self,
        stmt_ctx: StatementContext,
        start_span: Span,
    ) -> Result<Stmt> {
        let modifiers = self.parse_modifiers(
            /* allow_decorators */ true, /* permit_const_as_modifier */ false,
            /* stop_on_start_of_class_static_block */ true,
        );
        let decl = self.parse_class_declaration(start_span, &modifiers)?;

        if stmt_ctx.is_single_statement() {
            self.error(diagnostics::class_declaration(Span::new(
                decl.span.lo,
                decl.body.span.lo,
            )));
        }

        Ok(Stmt::ClassDeclaration(decl))
    }

    /// Section 15.7 Class Definitions
    pub(crate) fn parse_class_declaration(
        &mut self,
        start_span: Span,
        modifiers: &Modifiers<'a>,
    ) -> Result<Box<Class>> {
        self.parse_class(start_span, ClassType::ClassDeclaration, modifiers)
    }

    /// Section [Class Definitions](https://tc39.es/ecma262/#prod-ClassExpression)
    /// `ClassExpression`[Yield, Await] :
    ///     class `BindingIdent`[?Yield, ?Await]opt `ClassTail`[?Yield,
    /// ?Await]
    pub(crate) fn parse_class_expression(&mut self) -> Result<Box<Expr>> {
        let class = self.parse_class(
            self.start_span(),
            ClassType::ClassExpression,
            &Modifiers::empty(),
        )?;
        Ok(self.ast.expr_from_class(class))
    }

    fn parse_class(
        &mut self,
        start_span: Span,
        r#type: ClassType,
        modifiers: &Modifiers<'a>,
    ) -> Result<Box<Class>> {
        self.bump_any(); // advance `class`

        let decorators = self.consume_decorators();
        let start_span = decorators.iter().next().map_or(start_span, |d| d.span);

        let id = if self.cur_kind().is_binding_identifier() && !self.at(Kind::Implements) {
            Some(self.parse_binding_identifier()?)
        } else {
            None
        };

        let type_parameters = if self.ts_enabled() {
            self.parse_ts_type_parameters()?
        } else {
            None
        };
        let (extends, implements) = self.parse_heritage_clause()?;
        let mut super_class = None;
        let mut super_type_parameters = None;
        if let Some(mut extends) = extends {
            if !extends.is_empty() {
                let first_extends = extends.remove(0);
                super_class = Some(first_extends.0);
                super_type_parameters = first_extends.1;
            }
        }
        let body = self.parse_class_body()?;

        self.verify_modifiers(
            modifiers,
            ModifierFlags::DECLARE | ModifierFlags::ABSTRACT,
            diagnostics::modifier_cannot_be_used_here,
        );

        Ok(self.ast.alloc_class(
            r#type,
            self.end_span(start_span),
            decorators,
            id,
            type_parameters,
            super_class,
            super_type_parameters,
            implements,
            body,
            modifiers.contains_abstract(),
            modifiers.contains_declare(),
        ))
    }

    pub(crate) fn parse_heritage_clause(
        &mut self,
    ) -> Result<(Option<Extends<'a>>, Option<Implements<'a>>)> {
        let mut extends = None;
        let mut implements = None;

        loop {
            match self.cur_kind() {
                Kind::Extends => {
                    extends = Some(self.parse_extends_clause()?);
                }
                Kind::Implements => {
                    implements = Some(self.parse_ts_implements_clause()?);
                }
                _ => break,
            }
        }

        Ok((extends, implements))
    }

    /// `ClassHeritage`
    /// extends `LeftHandSideExpression`[?Yield, ?Await]
    fn parse_extends_clause(&mut self) -> Result<Extends<'a>> {
        self.bump_any(); // bump `extends`
        let mut extends = vec![];

        let span = self.start_span();
        let mut first_extends = self.parse_lhs_expression_or_higher()?;
        let first_type_argument;
        if let Expr::TsInstantiation(expr) = first_extends {
            first_extends = *expr.expr;
            first_type_argument = Some(expr.type_args);
        } else {
            first_type_argument = self.try_parse_type_arguments()?;
        }
        extends.push((first_extends, first_type_argument, self.end_span(span)));

        while self.eat(Kind::Comma) {
            let span = self.start_span();
            let mut extend = self.parse_lhs_expression_or_higher()?;
            let type_argument;
            if let Expr::TsInstantiation(expr) = extend {
                extend = *expr.expr;
                type_argument = Some(expr.type_args);
            } else {
                type_argument = self.try_parse_type_arguments()?;
            }

            extends.push((extend, type_argument, self.end_span(span)));
        }

        Ok(extends)
    }

    fn parse_class_body(&mut self) -> Result<Box<ClassBody>> {
        let span = self.start_span();
        let class_elements =
            self.parse_normal_list(Kind::LCurly, Kind::RCurly, Self::parse_class_element)?;
        Ok(self
            .ast
            .alloc_class_body(self.end_span(span), class_elements))
    }

    pub(crate) fn parse_class_element(&mut self) -> Result<Option<ClassMember>> {
        // skip empty class element `;`
        while self.at(Kind::Semicolon) {
            self.bump_any();
        }
        if self.at(Kind::RCurly) {
            return Ok(None);
        }

        let span = self.start_span();

        let modifiers = self.parse_modifiers(true, false, true);

        let mut kind = MethodDefinitionKind::Method;
        let mut generator = false;

        let mut key_name = None;

        let accessibility = modifiers.accessibility();
        let accessor = modifiers.contains(ModifierKind::Accessor);
        let declare = modifiers.contains(ModifierKind::Declare);
        let readonly = modifiers.contains(ModifierKind::Readonly);
        let is_override = modifiers.contains(ModifierKind::Override);
        let is_abstract = modifiers.contains(ModifierKind::Abstract);
        let mut is_static = modifiers.contains(ModifierKind::Static);
        let mut is_async = modifiers.contains(ModifierKind::Async);

        if self.at(Kind::Static) {
            // static { block }
            if self.peek_at(Kind::LCurly) {
                self.bump(Kind::Static);
                return self.parse_class_static_block(span).map(Some);
            }

            // static ...
            if self.peek_kind().is_class_element_name_start() || self.peek_at(Kind::Star) {
                self.bump(Kind::Static);
                is_static = true;
            } else {
                key_name = Some(self.parse_class_element_name()?);
            }
        }

        // async ...
        if key_name.is_none() && self.at(Kind::Async) && !self.peek_at(Kind::Question) {
            if !self.peek_token().is_on_new_line
                && (self.peek_kind().is_class_element_name_start() || self.peek_at(Kind::Star))
            {
                self.bump(Kind::Async);
                is_async = true;
            } else {
                key_name = Some(self.parse_class_element_name()?);
            }
        }

        if self.is_at_ts_index_signature_member() {
            if let TsTypeElement::TsIndexSignature(sig) = self.parse_ts_index_signature_member()? {
                return Ok(Some(ClassMember::TsIndexSignature(sig)));
            }
        }

        // * ...
        if key_name.is_none() && self.eat(Kind::Star) {
            generator = true;
        }

        if key_name.is_none() && !is_async && !generator {
            // get ... / set ...
            let peeked_class_element = self.peek_kind().is_class_element_name_start();
            key_name = match self.cur_kind() {
                Kind::Get if peeked_class_element => {
                    self.bump(Kind::Get);
                    kind = MethodDefinitionKind::Get;
                    Some(self.parse_class_element_name()?)
                }
                Kind::Set if peeked_class_element => {
                    self.bump(Kind::Set);
                    kind = MethodDefinitionKind::Set;
                    Some(self.parse_class_element_name()?)
                }
                kind if kind.is_class_element_name_start() => {
                    Some(self.parse_class_element_name()?)
                }
                _ => return Err(self.unexpected()),
            }
        }

        let (key, computed) = if let Some(result) = key_name {
            result
        } else {
            self.parse_class_element_name()?
        };

        let optional = self.eat(Kind::Question);
        let definite = self.eat(Kind::Bang);

        if let Key::Private(private_ident) = &key {
            // `private #foo`, etc. is illegal
            if self.ts_enabled() {
                self.verify_modifiers(
                    &modifiers,
                    ModifierFlags::all() - ModifierFlags::ACCESSIBILITY,
                    diagnostics::accessibility_modifier_on_private_property,
                );
            }
            if private_ident.name == "constructor" {
                self.error(diagnostics::private_name_constructor(private_ident.span));
            }
        }

        if accessor {
            self.parse_ts_type_annotation()?;
            self.parse_class_accessor_property(span, key, computed, is_static, is_abstract)
                .map(Some)
        } else if self.at(Kind::LParen) || self.at(Kind::LAngle) || is_async || generator {
            // LAngle for start of type parameters `foo<T>`
            //                                         ^
            let definition = self.parse_class_method_definition(
                span,
                kind,
                key,
                computed,
                is_static,
                is_async,
                generator,
                is_override,
                is_abstract,
                accessibility,
                optional,
            )?;
            if let Some((name, span)) = definition.prop_name() {
                if is_static && name == "prototype" && !self.ctx.has_ambient() {
                    self.error(diagnostics::static_prototype(span));
                }
                if !is_static && name == "constructor" {
                    if kind == MethodDefinitionKind::Get || kind == MethodDefinitionKind::Set {
                        self.error(diagnostics::constructor_getter_setter(span));
                    }
                    if is_async {
                        self.error(diagnostics::constructor_async(span));
                    }
                    if generator {
                        self.error(diagnostics::constructor_generator(span));
                    }
                }
            }
            Ok(Some(definition))
        } else {
            // getter and setter has no ts type annotation
            if !kind.is_method() {
                return Err(self.unexpected());
            }
            let definition = self.parse_class_property_definition(
                span,
                key,
                computed,
                is_static,
                declare,
                is_override,
                readonly,
                is_abstract,
                accessibility,
                optional,
                definite,
            )?;
            if let Some((name, span)) = definition.prop_name() {
                if name == "constructor" {
                    self.error(diagnostics::field_constructor(span));
                }
                if is_static && name == "prototype" && !self.ctx.has_ambient() {
                    self.error(diagnostics::static_prototype(span));
                }
            }
            Ok(Some(definition))
        }
    }

    fn parse_class_element_name(&mut self) -> Result<(Key, bool)> {
        match self.cur_kind() {
            Kind::Private => {
                let private_ident = self.parse_private_identifier();
                Ok((Key::Private(private_ident), false))
            }
            _ => self.parse_property_name(),
        }
    }

    #[allow(clippy::too_many_arguments, clippy::fn_params_excessive_bools)]
    fn parse_class_method_definition(
        &mut self,
        span: Span,
        kind: MethodDefinitionKind,
        key: Key,
        computed: bool,
        is_static: bool,
        is_async: bool,
        generator: bool,
        is_override: bool,
        is_abstract: bool,
        accessibility: Option<Accessibility>,
        optional: bool,
    ) -> Result<ClassMember> {
        let kind = if !is_static
            && !computed
            && key
                .prop_name()
                .map_or(false, |(name, _)| name == "constructor")
        {
            MethodDefinitionKind::Constructor
        } else {
            kind
        };

        let decorators = self.consume_decorators();

        let value = self.parse_method(is_async, generator)?;

        if kind == MethodDefinitionKind::Constructor {
            if let Some(this_param) = &value.this_param {
                // class Foo { constructor(this: number) {} }
                self.error(diagnostics::ts_constructor_this_parameter(this_param.span));
            }

            if is_static {
                self.error(diagnostics::static_constructor(key.span()));
            }
        }

        let method_definition = ClassMethod {
            span: self.end_span(span),
            key,
            value,
            kind,
            computed,
            is_static,
            is_override,
            accessibility,
            is_optional: optional,
            is_abstract,
            decorators,
        };
        Ok(ClassMember::Method(method_definition))
    }

    /// `FieldDefinition`[?Yield, ?Await] ;
    #[allow(clippy::too_many_arguments, clippy::fn_params_excessive_bools)]
    fn parse_class_property_definition(
        &mut self,
        span: Span,
        key: Key,
        computed: bool,
        is_static: bool,
        declare: bool,
        is_override: bool,
        readonly: bool,
        is_abstract: bool,
        accessibility: Option<Accessibility>,
        optional: bool,
        definite: bool,
    ) -> Result<ClassMember> {
        let type_annotation = if self.ts_enabled() {
            self.parse_ts_type_annotation()?
        } else {
            None
        };
        let value = if self.eat(Kind::Eq) {
            // let current_flags = self.scope.current_flags();
            // self.scope.set_current_flags(self.scope.current_flags());
            let expr = self.parse_expr()?;
            // self.scope.set_current_flags(current_flags);
            Some(expr)
        } else {
            None
        };
        self.asi()?;

        let property_definition = ClassProp {
            span: self.end_span(span),
            key,
            value,
            computed,
            is_abstract,
            is_static,
            declare,
            is_override,
            readonly,
            type_ann: type_annotation,
            accessibility,
            is_optional: optional,
            definite,
            decorators: self.consume_decorators(),
        };
        Ok(ClassMember::ClassProp(property_definition))
    }

    /// `ClassStaticBlockStatementList` :
    ///    `StatementList`[~Yield, +Await, ~Return]
    fn parse_class_static_block(&mut self, span: Span) -> Result<ClassMember> {
        let block = self.context(
            Context::Await,
            Context::Yield | Context::Return,
            Self::parse_block,
        )?;
        Ok(self
            .ast
            .class_element_static_block(self.end_span(span), block.body))
    }

    /// <https://github.com/tc39/proposal-decorators>
    fn parse_class_accessor_property(
        &mut self,
        span: Span,
        key: Key,
        computed: bool,
        is_static: bool,
        is_abstract: bool,
    ) -> Result<ClassMember> {
        let value = self
            .eat(Kind::Eq)
            .then(|| self.parse_assignment_expression_or_higher())
            .transpose()?;
        let r#type = if is_abstract {
            AccessorPropertyType::TsAbstractAccessorProperty
        } else {
            AccessorPropertyType::AccessorProperty
        };

        let decorators = self.consume_decorators();
        Ok(self.ast.class_element_accessor_property(
            r#type,
            self.end_span(span),
            decorators,
            key,
            value,
            computed,
            is_static,
        ))
    }
}
