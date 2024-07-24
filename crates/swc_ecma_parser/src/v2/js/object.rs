use oxc_allocator::Box;
use oxc_syntax::operator::AssignmentOperator;
use swc_common::Span;
use swc_ecma_ast::*;

use super::super::{lexer::Kind, modifiers::Modifier, Context, ParserImpl};
use crate::v2::{diagnostics, diagnostics::Result};

impl<'a> ParserImpl<'a> {
    /// [Object Expression](https://tc39.es/ecma262/#sec-object-initializer)
    /// `ObjectLiteral`[Yield, Await] :
    ///     { }
    ///     { `PropertyDefinitionList`[?Yield, ?Await] }
    ///     { `PropertyDefinitionList`[?Yield, ?Await] , }
    pub(crate) fn parse_object_expression(&mut self) -> Result<Expr> {
        let span = self.start_span();
        self.expect(Kind::LCurly)?;
        let object_expression_properties = self.context(Context::In, Context::empty(), |p| {
            p.parse_delimited_list(
                Kind::RCurly,
                Kind::Comma,
                /* trailing_separator */ false,
                Self::parse_object_expression_property,
            )
        })?;
        let trailing_comma = self.at(Kind::Comma).then(|| {
            let span = self.start_span();
            self.bump_any();
            self.end_span(span)
        });
        self.expect(Kind::RCurly)?;
        Ok(self.ast.expression_object(
            self.end_span(span),
            object_expression_properties,
            trailing_comma,
        ))
    }

    fn parse_object_expression_property(&mut self) -> Result<ObjectPropertyKind<'a>> {
        match self.cur_kind() {
            Kind::Dot3 => self
                .parse_spread_element()
                .map(ObjectPropertyKind::SpreadProperty),
            _ => self
                .parse_property_definition()
                .map(ObjectPropertyKind::ObjectProperty),
        }
    }

    /// `PropertyDefinition`[Yield, Await]
    pub(crate) fn parse_property_definition(&mut self) -> Result<Box<'a, ObjectProperty<'a>>> {
        let peek_kind = self.peek_kind();
        let class_element_name = peek_kind.is_class_element_name_start();
        match self.cur_kind() {
            // get ClassElementName
            Kind::Get if class_element_name => self.parse_method_getter(),
            // set ClassElementName
            Kind::Set if class_element_name => self.parse_method_setter(),
            // AsyncMethod
            // AsyncGeneratorMethod
            Kind::Async
                if (class_element_name || peek_kind == Kind::Star)
                    && !self.peek_token().is_on_new_line =>
            {
                self.parse_property_definition_method()
            }
            // GeneratorMethod
            Kind::Star if class_element_name => self.parse_property_definition_method(),
            // Report and handle illegal modifiers
            // e.g. const x = { public foo() {} }
            modifier_kind
                if self.ts_enabled()
                    && modifier_kind.is_modifier_kind()
                    && peek_kind.is_identifier_or_keyword() =>
            {
                if let Ok(modifier) = Modifier::try_from(self.cur_token()) {
                    self.error(diagnostics::modifier_cannot_be_used_here(&modifier));
                } else {
                    #[cfg(debug_assertions)]
                    panic!(
                        "Kind::is_modifier_kind() is true but the token could not be converted to \
                         a Modifier."
                    )
                }
                // re-parse
                self.bump_any();
                self.parse_property_definition()
            }
            // IdentReference
            kind if kind.is_identifier_reference(false, false)
                // test Kind::Dot to ignore ({ foo.bar: baz })
                // see <https://stackoverflow.com/questions/30285947/syntaxerror-unexpected-token>
                && !matches!(
                    peek_kind,
                    Kind::LParen | Kind::Colon | Kind::LAngle | Kind::ShiftLeft | Kind::Dot
                ) =>
            {
                self.parse_property_definition_shorthand()
            }
            _ => {
                let span = self.start_span();
                let (key, computed) = self.parse_property_name()?;

                if self.at(Kind::Colon) {
                    return self.parse_property_definition_assignment(span, key, computed);
                }

                if matches!(
                    self.cur_kind(),
                    Kind::LParen | Kind::LAngle | Kind::ShiftLeft
                ) {
                    let method = self.parse_method(false, false)?;
                    return Ok(self.ast.alloc_object_property(
                        self.end_span(span),
                        PropertyKind::Init,
                        key,
                        self.ast.expression_from_function(method),
                        /* init */ None,
                        /* method */ true,
                        /* shorthand */ false,
                        /* computed */ computed,
                    ));
                }

                Err(self.unexpected())
            }
        }
    }

    /// `PropertyDefinition`[Yield, Await] :
    ///   ... `AssignmentExpression`[+In, ?Yield, ?Await]
    pub(crate) fn parse_spread_element(&mut self) -> Result<Box<'a, SpreadElement<'a>>> {
        let span = self.start_span();
        self.bump_any(); // advance `...`
        let argument = self.parse_assignment_expression_or_higher()?;
        Ok(self.ast.alloc_spread_element(self.end_span(span), argument))
    }

    /// `PropertyDefinition`[Yield, Await] :
    ///   `IdentReference`[?Yield, ?Await]
    ///   `CoverInitializedName`[?Yield, ?Await]
    fn parse_property_definition_shorthand(&mut self) -> Result<Box<'a, ObjectProperty<'a>>> {
        let span = self.start_span();
        let identifier = self.parse_identifier_reference()?;
        let key = self.ast.alloc(IdentName {
            span: identifier.span,
            name: identifier.name.clone(),
        });
        // IdentReference ({ foo })
        let value = Expr::Ident(self.ast.alloc(identifier.clone()));
        // CoverInitializedName ({ foo = bar })
        let init = if self.eat(Kind::Eq) {
            let right = self.parse_assignment_expression_or_higher()?;
            let left = AssignmentTarget::AssignmentTargetIdent(self.ast.alloc(identifier));
            Some(self.ast.expression_assignment(
                self.end_span(span),
                AssignmentOperator::Assign,
                left,
                right,
            ))
        } else {
            None
        };
        Ok(self.ast.alloc_object_property(
            self.end_span(span),
            PropertyKind::Init,
            PropertyKey::StaticIdent(key),
            value,
            init,
            /* method */ false,
            /* shorthand */ true,
            /* computed */ false,
        ))
    }

    /// `PropertyDefinition`[Yield, Await] :
    ///   `PropertyName`[?Yield, ?Await] : `AssignmentExpression`[+In, ?Yield,
    /// ?Await]
    fn parse_property_definition_assignment(
        &mut self,
        span: Span,
        key: PropertyKey<'a>,
        computed: bool,
    ) -> Result<Box<'a, ObjectProperty<'a>>> {
        self.bump_any(); // bump `:`
        let value = self.parse_assignment_expression_or_higher()?;
        Ok(self.ast.alloc_object_property(
            self.end_span(span),
            PropertyKind::Init,
            key,
            value,
            None,
            /* method */ false,
            /* shorthand */ false,
            /* computed */ computed,
        ))
    }

    /// `PropertyName`[Yield, Await] :
    ///    `LiteralPropertyName`
    ///    `ComputedPropertyName`[?Yield, ?Await]
    pub(crate) fn parse_property_name(&mut self) -> Result<(PropertyKey<'a>, bool)> {
        let mut computed = false;
        let key = match self.cur_kind() {
            Kind::Str => self.parse_literal_expression().map(PropertyKey::from)?,
            kind if kind.is_number() => self.parse_literal_expression().map(PropertyKey::from)?,
            // { [foo]() {} }
            Kind::LBrack => {
                computed = true;
                self.parse_computed_property_name().map(PropertyKey::from)?
            }
            _ => {
                let ident = self.parse_identifier_name()?;
                PropertyKey::StaticIdent(self.ast.alloc(ident))
            }
        };
        Ok((key, computed))
    }

    /// `ComputedPropertyName`[Yield, Await] : [ `AssignmentExpression`[+In,
    /// ?Yield, ?Await] ]
    pub(crate) fn parse_computed_property_name(&mut self) -> Result<Expr> {
        self.bump_any(); // advance `[`

        let expression = self.context(
            Context::In,
            Context::empty(),
            Self::parse_assignment_expression_or_higher,
        )?;

        self.expect(Kind::RBrack)?;
        Ok(expression)
    }

    /// `PropertyDefinition`[Yield, Await] :
    ///   `MethodDefinition`[?Yield, ?Await]
    fn parse_property_definition_method(&mut self) -> Result<Box<'a, ObjectProperty<'a>>> {
        let span = self.start_span();
        let r#async = self.eat(Kind::Async);
        let generator = self.eat(Kind::Star);
        let (key, computed) = self.parse_property_name()?;
        let method = self.parse_method(r#async, generator)?;
        let value = self.ast.expression_from_function(method);
        Ok(self.ast.alloc_object_property(
            self.end_span(span),
            PropertyKind::Init,
            key,
            value,
            /* init */ None,
            /* method */ true,
            /* shorthand */ false,
            /* computed */ computed,
        ))
    }

    /// `MethodDefinition`[Yield, Await] :
    ///   get `ClassElementName`[?Yield, ?Await] ( ) { `FunctionBody`[~Yield,
    /// ~Await] }
    fn parse_method_getter(&mut self) -> Result<Box<'a, ObjectProperty<'a>>> {
        let span = self.start_span();
        self.expect(Kind::Get)?;
        let (key, computed) = self.parse_property_name()?;
        let method = self.parse_method(false, false)?;
        let value = self.ast.expression_from_function(method);
        Ok(self.ast.alloc_object_property(
            self.end_span(span),
            PropertyKind::Get,
            key,
            value,
            /* init */ None,
            /* method */ false,
            /* shorthand */ false,
            /* computed */ computed,
        ))
    }

    /// `MethodDefinition`[Yield, Await] :
    /// set `ClassElementName`[?Yield, ?Await] ( `PropertySetParameterList` ) {
    /// `FunctionBody`[~Yield, ~Await] }
    fn parse_method_setter(&mut self) -> Result<Box<'a, ObjectProperty<'a>>> {
        let span = self.start_span();
        self.expect(Kind::Set)?;
        let (key, computed) = self.parse_property_name()?;
        let method = self.parse_method(false, false)?;

        Ok(self.ast.alloc_object_property(
            self.end_span(span),
            PropertyKind::Set,
            key,
            self.ast.expression_from_function(method),
            /* init */ None,
            /* method */ false,
            /* shorthand */ false,
            /* computed */ computed,
        ))
    }
}
