//! Declaration parser implementation
//!
//! This module provides the implementation for parsing declarations,
//! including variable declarations, function declarations, and class
//! declarations.

use swc_common::Span;
use swc_ecma_ast as ast;

use super::super::Parser;
use crate::{
    error::{Error, ErrorKind, Result},
    token::{Token, TokenType, TokenValue},
};

impl<'a> Parser<'a> {
    /// Parse a variable declaration: var id = init;
    pub(crate) fn parse_var_declaration(&mut self) -> Result<ast::VarDecl> {
        let start_span = self.cur_token.span;
        self.expect(TokenType::Var)?; // Expect 'var'

        // Parse the variable declarators
        let decls = self.parse_var_declarations()?;

        self.consume_semicolon(); // Consume semicolon

        // Create the variable declaration
        Ok(ast::VarDecl {
            span: start_span.merge_with(self.prev_token.span),
            kind: ast::VarDeclKind::Var,
            decls,
            declare: false,
        })
    }

    /// Parse let declarations: let id = init;
    pub(crate) fn parse_let_declaration(&mut self) -> Result<ast::VarDecl> {
        let start_span = self.cur_token.span;
        self.expect(TokenType::Let)?; // Expect 'let'

        // Parse the variable declarators
        let decls = self.parse_var_declarations()?;

        self.consume_semicolon(); // Consume semicolon

        // Create the variable declaration
        Ok(ast::VarDecl {
            span: start_span.merge_with(self.prev_token.span),
            kind: ast::VarDeclKind::Let,
            decls,
            declare: false,
            ..Default::default()
        })
    }

    /// Parse const declarations: const id = init;
    pub(crate) fn parse_const_declaration(&mut self) -> Result<ast::VarDecl> {
        let start_span = self.cur_token.span;
        self.expect(TokenType::Const)?; // Expect 'const'

        // Parse the variable declarators
        let decls = self.parse_var_declarations()?;

        self.consume_semicolon(); // Consume semicolon

        // Create the variable declaration
        Ok(ast::VarDecl {
            span: start_span.merge_with(self.prev_token.span),
            kind: ast::VarDeclKind::Const,
            decls,
            declare: false,
        })
    }

    /// Parse variable declarators: id = init, id2 = init2, ...
    pub(crate) fn parse_var_declarations(&mut self) -> Result<Vec<ast::VarDeclarator>> {
        let mut decls = Vec::new();

        // Parse the first declarator
        let is_const = self.prev_token.token_type == TokenType::Const;
        let decl = self.parse_var_declarator(is_const)?;
        decls.push(decl);

        // Parse additional declarators if present
        while self.is_token_type(TokenType::Comma) {
            self.next_token(); // Skip ','

            let decl = self.parse_var_declarator(is_const)?;
            decls.push(decl);
        }

        Ok(decls)
    }

    /// Parse a variable declarator: id = init
    pub(crate) fn parse_var_declarator(&mut self, is_const: bool) -> Result<ast::VarDeclarator> {
        // Parse the pattern
        let name = self.parse_binding_pattern()?;
        let name_span = name.span();

        // Parse the initializer if present
        let init = if self.is_token_type(TokenType::Assign) {
            self.next_token(); // Skip '='

            Some(Box::new(self.parse_assignment_expression()?))
        } else {
            // Const declarations must have an initializer
            if is_const {
                return Err(self.error(ErrorKind::General {
                    message: "Missing initializer in const declaration".into(),
                }));
            }

            None
        };

        // Create the variable declarator
        Ok(ast::VarDeclarator {
            span: name_span.merge_with(if let Some(ref init) = init {
                init.span()
            } else {
                name_span
            }),
            name,
            init,
            definite: false,
        })
    }

    /// Parse a function declaration: function id(params) { body }
    pub(crate) fn parse_function_declaration(
        &mut self,
        is_async: bool,
        is_generator: bool,
    ) -> Result<ast::FnDecl> {
        let start_span = self.cur_token.span;
        self.expect(TokenType::Function)?; // Expect 'function'

        // Check for generator function
        let is_generator = if self.is_token_type(TokenType::Mul) {
            self.next_token(); // Skip '*'
            true
        } else {
            is_generator
        };

        // Parse the function identifier
        let id = self.parse_binding_identifier()?;

        // Create a new scope for the function
        self.enter_scope(super::super::ScopeKind::Function);

        // Remember we're in a function
        let prev_in_function = self.in_function;
        let prev_in_generator = self.in_generator;
        let prev_in_async = self.in_async;
        self.in_function = true;
        self.in_generator = is_generator;
        self.in_async = is_async;

        // Parse function parameters and body
        let (params, body) = self.parse_function_params_and_body()?;

        // Restore previous function state
        self.in_function = prev_in_function;
        self.in_generator = prev_in_generator;
        self.in_async = prev_in_async;

        // Exit the function scope
        self.exit_scope();

        // Create the function declaration
        Ok(ast::FnDecl {
            ident: id.id,
            declare: false,
            function: ast::Function {
                params,
                decorators: Vec::new(),
                span: start_span.merge_with(body.span),
                body: Some(body),
                is_generator,
                is_async,
                type_params: None,
                return_type: None,
            },
        })
    }

    /// Parse a class declaration: class id { ... }
    pub(crate) fn parse_class_declaration(&mut self) -> Result<ast::ClassDecl> {
        let start_span = self.cur_token.span;
        self.expect(TokenType::Class)?; // Expect 'class'

        // Parse the class identifier
        let id = self.parse_binding_identifier()?;

        // Parse class heritage (extends clause)
        let super_class = if self.is_token_type(TokenType::Extends) {
            self.next_token(); // Skip 'extends'

            // Parse the super class expression
            Some(Box::new(self.parse_left_hand_side_expression()?))
        } else {
            None
        };

        // Create a new scope for the class
        self.enter_scope(super::super::ScopeKind::Class);

        // Parse the class body
        let class_body = self.parse_class_body()?;

        // Exit the class scope
        self.exit_scope();

        // Create the class declaration
        Ok(ast::ClassDecl {
            ident: id.id,
            declare: false,
            class: ast::Class {
                span: start_span.merge_with(class_body.span),
                decorators: Vec::new(),
                body: class_body.body,
                super_class,
                is_abstract: false,
                type_params: None,
                super_type_params: None,
                implements: Vec::new(),
            },
        })
    }

    /// Parse a binding pattern
    pub(crate) fn parse_binding_pattern(&mut self) -> Result<ast::Pat> {
        match self.cur_token.token_type {
            // Identifier pattern
            TokenType::Ident => {
                let id = self.parse_binding_identifier()?;
                Ok(ast::Pat::Ident(id))
            }

            // Array pattern
            TokenType::LBracket => self.parse_array_pattern(),

            // Object pattern
            TokenType::LBrace => self.parse_object_pattern(),

            // Invalid pattern
            _ => Err(self.error(ErrorKind::UnexpectedToken {
                expected: Some("identifier, array pattern, or object pattern"),
                got: format!("{}", self.cur_token.token_type),
            })),
        }
    }

    /// Parse a binding identifier
    pub(crate) fn parse_binding_identifier(&mut self) -> Result<ast::BindingIdent> {
        // Parse the identifier
        let id = self.parse_identifier_name()?;

        // Check for reserved words
        if self.strict_mode {
            // In strict mode, 'eval' and 'arguments' cannot be binding names
            if id.sym.to_string() == "eval" || id.sym.to_string() == "arguments" {
                return Err(self.error(ErrorKind::General {
                    message: format!("Cannot use '{}' as a binding name in strict mode", id.sym),
                }));
            }
        }

        // Add the identifier to the current scope
        self.add_binding(id.sym.to_string());

        // Create the binding identifier
        Ok(ast::BindingIdent { id, type_ann: None })
    }
}

impl<'a> Parser<'a> {
    /// Parse function parameters and body
    pub(crate) fn parse_function_params_and_body(
        &mut self,
    ) -> Result<(Vec<ast::Param>, ast::BlockStmt)> {
        self.expect(TokenType::LParen)?; // Expect '('

        // Parse the parameters
        let mut params = Vec::new();

        if !self.is_token_type(TokenType::RParen) {
            loop {
                // Check for rest parameter
                let is_rest = if self.is_token_type(TokenType::Ellipsis) {
                    self.next_token(); // Skip '...'
                    true
                } else {
                    false
                };

                // Parse the parameter pattern
                let pat = self.parse_binding_pattern()?;

                // Create the parameter
                let param = if is_rest {
                    ast::Param {
                        span: pat.span(),
                        decorators: Vec::new(),
                        pat: ast::Pat::Rest(ast::RestPat {
                            span: pat.span(),
                            arg: Box::new(pat),
                            type_ann: None,
                        }),
                    }
                } else {
                    ast::Param {
                        span: pat.span(),
                        decorators: Vec::new(),
                        pat,
                    }
                };

                params.push(param);

                // Rest parameter must be the last parameter
                if is_rest {
                    if !self.is_token_type(TokenType::RParen) {
                        return Err(self.error(ErrorKind::General {
                            message: "Rest parameter must be the last parameter".into(),
                        }));
                    }
                    break;
                }

                // Check for comma or end of parameters
                if self.is_token_type(TokenType::Comma) {
                    self.next_token(); // Skip ','

                    // Handle trailing comma
                    if self.is_token_type(TokenType::RParen) {
                        break;
                    }
                } else {
                    break;
                }
            }
        }

        self.expect(TokenType::RParen)?; // Expect ')'

        // Parse the function body
        let body = self.parse_block_stmt()?;

        Ok((params, body))
    }

    /// Parse an array pattern: [a, b, ...rest]
    pub(crate) fn parse_array_pattern(&mut self) -> Result<ast::Pat> {
        let start_span = self.cur_token.span;
        self.expect(TokenType::LBracket)?; // Expect '['

        let mut elements = Vec::new();

        // Parse the elements
        while !self.is_token_type(TokenType::RBracket) {
            // Handle elision (hole)
            if self.is_token_type(TokenType::Comma) {
                elements.push(None);
                self.next_token(); // Skip ','
                continue;
            }

            // Check for rest element
            let is_rest = if self.is_token_type(TokenType::Ellipsis) {
                self.next_token(); // Skip '...'
                true
            } else {
                false
            };

            // Parse the element pattern
            let pat = self.parse_binding_pattern()?;

            // Create the element
            let element = if is_rest {
                Some(ast::Pat::Rest(ast::RestPat {
                    span: pat.span(),
                    arg: Box::new(pat),
                    type_ann: None,
                }))
            } else {
                Some(pat)
            };

            elements.push(element);

            // Rest element must be the last element
            if is_rest {
                if !self.is_token_type(TokenType::RBracket) {
                    return Err(self.error(ErrorKind::General {
                        message: "Rest element must be the last element".into(),
                    }));
                }
                break;
            }

            // Check for comma or end of elements
            if self.is_token_type(TokenType::Comma) {
                self.next_token(); // Skip ','

                // Handle trailing comma
                if self.is_token_type(TokenType::RBracket) {
                    break;
                }
            } else {
                break;
            }
        }

        let end_span = self.cur_token.span;
        self.expect(TokenType::RBracket)?; // Expect ']'

        // Create the array pattern
        Ok(ast::Pat::Array(ast::ArrayPat {
            span: start_span.merge_with(end_span),
            elems: elements,
            optional: false,
            type_ann: None,
        }))
    }

    /// Parse an object pattern: { a, b: c, ...rest }
    pub(crate) fn parse_object_pattern(&mut self) -> Result<ast::Pat> {
        let start_span = self.cur_token.span;
        self.expect(TokenType::LBrace)?; // Expect '{'

        let mut properties = Vec::new();

        // Parse the properties
        while !self.is_token_type(TokenType::RBrace) {
            // Check for rest element
            if self.is_token_type(TokenType::Ellipsis) {
                self.next_token(); // Skip '...'

                // Parse the rest element pattern
                let pat = self.parse_binding_pattern()?;

                // Create the rest element
                properties.push(ast::ObjectPatProp::Rest(ast::RestPat {
                    span: pat.span(),
                    arg: Box::new(pat),
                    type_ann: None,
                }));

                // Rest element must be the last property
                if !self.is_token_type(TokenType::RBrace) {
                    return Err(self.error(ErrorKind::General {
                        message: "Rest element must be the last property".into(),
                    }));
                }
                break;
            }

            // Parse the property
            let prop = self.parse_object_pattern_property()?;
            properties.push(prop);

            // Check for comma or end of properties
            if self.is_token_type(TokenType::Comma) {
                self.next_token(); // Skip ','

                // Handle trailing comma
                if self.is_token_type(TokenType::RBrace) {
                    break;
                }
            } else {
                break;
            }
        }

        let end_span = self.cur_token.span;
        self.expect(TokenType::RBrace)?; // Expect '}'

        // Create the object pattern
        Ok(ast::Pat::Object(ast::ObjectPat {
            span: start_span.merge_with(end_span),
            props: properties,
            optional: false,
            type_ann: None,
        }))
    }

    /// Parse an object pattern property: key, key: value, or [computed]: value
    pub(crate) fn parse_object_pattern_property(&mut self) -> Result<ast::ObjectPatProp> {
        match self.cur_token.token_type {
            // Identifier property
            TokenType::Ident => {
                let id = self.parse_identifier_name()?;

                // Check for key-value pair: key: value
                if self.is_token_type(TokenType::Colon) {
                    self.next_token(); // Skip ':'

                    // Parse the value pattern
                    let value = self.parse_binding_pattern()?;

                    // Create the key-value property
                    Ok(ast::ObjectPatProp::KeyValue(ast::KeyValuePatProp {
                        key: ast::PropName::Ident(id),
                        value: Box::new(value),
                    }))
                } else {
                    // Create the shorthand property
                    let binding_id = ast::BindingIdent { id, type_ann: None };

                    Ok(ast::ObjectPatProp::Assign(ast::AssignPatProp {
                        span: binding_id.id.span,
                        key: binding_id.id,
                        value: None,
                    }))
                }
            }

            // String property
            TokenType::Str => {
                let str_lit = match &self.cur_token.value {
                    TokenValue::String(s) => ast::Str {
                        span: self.cur_token.span,
                        value: s.clone().into(),
                        raw: None,
                    },
                    _ => unreachable!("Expected string literal"),
                };

                self.next_token(); // Skip string

                self.expect(TokenType::Colon)?; // Expect ':'

                // Parse the value pattern
                let value = self.parse_binding_pattern()?;

                // Create the key-value property
                Ok(ast::ObjectPatProp::KeyValue(ast::KeyValuePatProp {
                    key: ast::PropName::Str(str_lit),
                    value: Box::new(value),
                }))
            }

            // Numeric property
            TokenType::Num => {
                let num_lit = match &self.cur_token.value {
                    TokenValue::Number(n) => ast::Number {
                        span: self.cur_token.span,
                        value: *n,
                        raw: None,
                    },
                    _ => unreachable!("Expected number literal"),
                };

                self.next_token(); // Skip number

                self.expect(TokenType::Colon)?; // Expect ':'

                // Parse the value pattern
                let value = self.parse_binding_pattern()?;

                // Create the key-value property
                Ok(ast::ObjectPatProp::KeyValue(ast::KeyValuePatProp {
                    key: ast::PropName::Num(num_lit),
                    value: Box::new(value),
                }))
            }

            // Computed property: [expr]: value
            TokenType::LBracket => {
                let start_span = self.cur_token.span;
                self.next_token(); // Skip '['

                // Parse the computed key expression
                let key = self.parse_assignment_expression()?;

                self.expect(TokenType::RBracket)?; // Expect ']'
                self.expect(TokenType::Colon)?; // Expect ':'

                // Parse the value pattern
                let value = self.parse_binding_pattern()?;

                // Create the key-value property
                Ok(ast::ObjectPatProp::KeyValue(ast::KeyValuePatProp {
                    key: ast::PropName::Computed(ast::ComputedPropName {
                        span: start_span.merge_with(self.prev_token.span),
                        expr: Box::new(key),
                    }),
                    value: Box::new(value),
                }))
            }

            // Invalid property
            _ => Err(self.error(ErrorKind::UnexpectedToken {
                expected: Some("identifier, string, number, or computed property"),
                got: format!("{}", self.cur_token.token_type),
            })),
        }
    }

    /// Parse a class body: { method() {}, field = value, ... }
    pub(crate) fn parse_class_body(&mut self) -> Result<ast::ClassBody> {
        let start_span = self.cur_token.span;
        self.expect(TokenType::LBrace)?; // Expect '{'

        let mut body = Vec::new();

        // Parse class elements
        while !self.is_token_type(TokenType::RBrace) && !self.is_token_type(TokenType::EOF) {
            // Skip empty elements (semicolons)
            if self.is_token_type(TokenType::Semicolon) {
                self.next_token(); // Skip ';'
                continue;
            }

            // Check for static keyword
            let is_static = if self.is_token_identifier_eq("static") {
                self.next_token(); // Skip 'static'
                true
            } else {
                false
            };

            // Check for access modifiers (TypeScript)
            let accessibility = if self.syntax.typescript
                && (self.is_token_identifier_eq("public")
                    || self.is_token_identifier_eq("private")
                    || self.is_token_identifier_eq("protected"))
            {
                let modifier = match self.cur_token.value {
                    TokenValue::String(ref s) if s == "public" => Some(ast::Accessibility::Public),
                    TokenValue::String(ref s) if s == "private" => {
                        Some(ast::Accessibility::Private)
                    }
                    TokenValue::String(ref s) if s == "protected" => {
                        Some(ast::Accessibility::Protected)
                    }
                    _ => None,
                };

                self.next_token(); // Skip modifier
                modifier
            } else {
                None
            };

            // Parse the class element
            match self.parse_class_element(is_static, accessibility) {
                Ok(element) => body.push(element),
                Err(err) => {
                    // Report the error but continue parsing
                    self.report_error(err);
                    self.error_recovery();
                }
            }
        }

        let end_span = self.cur_token.span;
        self.expect(TokenType::RBrace)?; // Expect '}'

        // Create the class body
        Ok(ast::ClassBody {
            span: start_span.merge_with(end_span),
            body,
        })
    }

    /// Parse a class element: method, getter, setter, or field
    pub(crate) fn parse_class_element(
        &mut self,
        is_static: bool,
        accessibility: Option<ast::Accessibility>,
    ) -> Result<ast::ClassMember> {
        // Check for constructor
        let is_constructor = if !is_static && self.is_token_identifier_eq("constructor") {
            self.next_token(); // Skip 'constructor'
            true
        } else {
            false
        };

        // Check for async method
        let is_async = if self.is_token_type(TokenType::Async) && !self.peek_token().had_line_break
        {
            self.next_token(); // Skip 'async'
            true
        } else {
            false
        };

        // Check for generator method
        let is_generator = if self.is_token_type(TokenType::Mul) {
            self.next_token(); // Skip '*'
            true
        } else {
            false
        };

        // Check for getter or setter
        let kind = if self.is_token_identifier_eq("get")
            && !self.peek_token().had_line_break
            && !is_async
            && !is_generator
        {
            self.next_token(); // Skip 'get'
            ast::MethodKind::Getter
        } else if self.is_token_identifier_eq("set")
            && !self.peek_token().had_line_break
            && !is_async
            && !is_generator
        {
            self.next_token(); // Skip 'set'
            ast::MethodKind::Setter
        } else if is_constructor {
            ast::MethodKind::Constructor
        } else {
            ast::MethodKind::Method
        };

        // Parse the key
        let key = self.parse_property_name()?;

        // Check for computed field
        if self.is_token_type(TokenType::Assign) {
            // Class field
            self.next_token(); // Skip '='

            // Parse the initializer
            let value = Some(Box::new(self.parse_assignment_expression()?));

            self.consume_semicolon(); // Consume semicolon

            // Create the class property
            Ok(ast::ClassMember::ClassProp(ast::ClassProp {
                span: key.span().merge_with(self.prev_token.span),
                key: match key {
                    ast::PropName::Ident(id) => Box::new(ast::Expr::Ident(id)),
                    ast::PropName::Str(s) => Box::new(ast::Expr::Lit(ast::Lit::Str(s))),
                    ast::PropName::Num(n) => Box::new(ast::Expr::Lit(ast::Lit::Num(n))),
                    ast::PropName::Computed(c) => Box::new(ast::Expr::Paren(ast::ParenExpr {
                        span: c.span,
                        expr: c.expr,
                    })),
                    _ => unreachable!("Invalid property name"),
                },
                value,
                type_ann: None,
                is_static,
                decorators: Vec::new(),
                accessibility,
                is_abstract: false,
                is_optional: false,
                is_override: false,
                readonly: false,
                declare: false,
                definite: false,
            }))
        } else {
            // Method definition
            self.expect(TokenType::LParen)?; // Expect '('

            // Remember we're in a function
            let prev_in_function = self.in_function;
            let prev_in_generator = self.in_generator;
            let prev_in_async = self.in_async;
            self.in_function = true;
            self.in_generator = is_generator;
            self.in_async = is_async;

            // Create a new scope for the method
            self.enter_scope(super::super::ScopeKind::Function);

            // Parse parameters and body
            let (params, body) = self.parse_function_params_and_body()?;

            // Exit the method scope
            self.exit_scope();

            // Restore previous function state
            self.in_function = prev_in_function;
            self.in_generator = prev_in_generator;
            self.in_async = prev_in_async;

            // Create the class method
            Ok(ast::ClassMember::Method(ast::ClassMethod {
                span: key.span().merge_with(body.span),
                key,
                function: ast::Function {
                    params,
                    decorators: Vec::new(),
                    span: key.span().merge_with(body.span),
                    body: Some(body),
                    is_generator,
                    is_async,
                    type_params: None,
                    return_type: None,
                    ctxt: Default::default(),
                },
                kind,
                is_static,
                accessibility,
                is_abstract: false,
                is_optional: false,
                is_override: false,
            }))
        }
    }

    /// Parse a property name: identifier, string, number, or computed property
    pub(crate) fn parse_property_name(&mut self) -> Result<ast::PropName> {
        match self.cur_token.token_type {
            // Identifier property
            TokenType::Ident => {
                let id = self.parse_identifier_name()?;
                Ok(ast::PropName::Ident(id))
            }

            // String property
            TokenType::Str => {
                let str_lit = match &self.cur_token.value {
                    TokenValue::String(s) => ast::Str {
                        span: self.cur_token.span,
                        value: s.clone().into(),
                        raw: None,
                    },
                    _ => unreachable!("Expected string literal"),
                };

                self.next_token(); // Skip string

                Ok(ast::PropName::Str(str_lit))
            }

            // Numeric property
            TokenType::Num => {
                let num_lit = match &self.cur_token.value {
                    TokenValue::Number(n) => ast::Number {
                        span: self.cur_token.span,
                        value: *n,
                        raw: None,
                    },
                    _ => unreachable!("Expected number literal"),
                };

                self.next_token(); // Skip number

                Ok(ast::PropName::Num(num_lit))
            }

            // Computed property: [expr]
            TokenType::LBracket => {
                let start_span = self.cur_token.span;
                self.next_token(); // Skip '['

                // Parse the computed key expression
                let expr = self.parse_assignment_expression()?;

                let end_span = self.cur_token.span;
                self.expect(TokenType::RBracket)?; // Expect ']'

                Ok(ast::PropName::Computed(ast::ComputedPropName {
                    span: start_span.merge_with(end_span),
                    expr: Box::new(expr),
                }))
            }

            // Invalid property name
            _ => Err(self.error(ErrorKind::UnexpectedToken {
                expected: Some("identifier, string, number, or computed property name"),
                got: format!("{}", self.cur_token.token_type),
            })),
        }
    }
}
