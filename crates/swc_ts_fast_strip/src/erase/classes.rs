use super::*;

#[derive(Default)]
struct Modifiers {
    readonly: bool,
    is_override: bool,
    accessibility: Option<Accessibility>,
}

struct FieldSuffix<'a> {
    key: Span,
    end: BytePos,
    marker: Option<Token>,
    annotation: Option<&'a TsTypeAnn>,
    value: Option<&'a Expr>,
}

impl TypeEraser<'_> {
    pub(super) fn erase_class(&mut self, class: &Class) {
        if class.is_abstract {
            let start = modifiers_start(class.span.lo, &class.decorators);
            self.erase_token(start, class.span.hi, Token::Abstract);
        }
        if let (Some(first), Some(last)) = (class.implements.first(), class.implements.last()) {
            if let Some(keyword) =
                self.tokens
                    .find_backward(class.span.lo, first.span.lo, Token::Implements)
            {
                self.edits.blank(Span::new(keyword.span.lo, last.span.hi));
            }
        }
        class.visit_children_with(self);
    }

    fn erase_modifiers(
        &mut self,
        start: BytePos,
        end: BytePos,
        modifiers: Modifiers,
    ) -> Option<BytePos> {
        let accessibility = modifiers
            .accessibility
            .map(|accessibility| match accessibility {
                Accessibility::Public => Token::Public,
                Accessibility::Protected => Token::Protected,
                Accessibility::Private => Token::Private,
            });
        let mut first = None;
        for tag in [
            modifiers.readonly.then_some(Token::Readonly),
            modifiers.is_override.then_some(Token::Override),
            accessibility,
        ]
        .into_iter()
        .flatten()
        {
            if let Some(position) = self.erase_token(start, end, tag) {
                first = Some(first.map_or(position, |previous: BytePos| previous.min(position)));
            }
        }
        first
    }

    fn separate_hazardous_class_element(
        &mut self,
        member: Span,
        first_modifier: Option<BytePos>,
        hazardous: bool,
        protected: bool,
    ) {
        if hazardous
            && !protected
            && first_modifier == Some(member.lo)
            && self.needs_semicolon_before_erasure()
        {
            self.substitute_character(member.lo, FixedSubstitution::Semicolon);
        }
    }

    fn erase_field_suffix(&mut self, field: FieldSuffix<'_>) {
        let marker_end = field
            .annotation
            .map_or(field.end, |a| a.span.lo)
            .min(field.value.map_or(field.end, Spanned::span_lo));
        let marker_start = field
            .marker
            .and_then(|tag| self.erase_token(field.key.hi, marker_end, tag));
        let separator = field.annotation.map(|a| a.span.lo).or(marker_start);
        if field.value.is_some() {
            return;
        }
        let Some(separator) = separator else {
            return;
        };
        let Some(key) = self.tokens.first_in_range(field.key.lo, field.key.hi) else {
            return;
        };
        if matches!(key.token, Token::Get | Token::Set | Token::Static) {
            self.substitute_character(separator, FixedSubstitution::Semicolon);
        }
    }

    pub(super) fn erase_class_prop(&mut self, field: &ClassProp) {
        if field.declare || field.is_abstract {
            self.erase_statement(field.span);
            return;
        }
        let key = field.key.span();
        let start = modifiers_start(field.span.lo, &field.decorators);
        let first = self.erase_modifiers(
            start,
            key.lo,
            Modifiers {
                readonly: field.readonly,
                is_override: field.is_override,
                accessibility: field.accessibility,
            },
        );
        self.separate_hazardous_class_element(
            field.span,
            first,
            hazardous_key(&field.key),
            field.is_static || !field.decorators.is_empty(),
        );
        self.erase_field_suffix(FieldSuffix {
            key,
            end: field.span.hi,
            marker: if field.is_optional {
                Some(Token::QuestionMark)
            } else {
                field.definite.then_some(Token::Bang)
            },
            annotation: field.type_ann.as_deref(),
            value: field.value.as_deref(),
        });
        field.visit_children_with(self);
    }

    pub(super) fn erase_class_method(&mut self, method: &ClassMethod) {
        if method.is_abstract || method.function.body.is_none() {
            self.erase_statement(method.span);
            return;
        }
        let start = modifiers_start(method.span.lo, &method.function.decorators);
        let key = method.key.span();
        let first = self.erase_modifiers(
            start,
            key.lo,
            Modifiers {
                is_override: method.is_override,
                accessibility: method.accessibility,
                ..Default::default()
            },
        );
        self.separate_hazardous_class_element(
            method.span,
            first,
            hazardous_key(&method.key) || method.function.is_generator,
            method.is_static || !method.function.decorators.is_empty(),
        );
        if method.is_optional {
            self.erase_token(key.hi, method.function.span.hi, Token::QuestionMark);
        }
        method.visit_children_with(self);
    }

    pub(super) fn erase_private_prop(&mut self, field: &PrivateProp) {
        let start = modifiers_start(field.span.lo, &field.decorators);
        self.erase_modifiers(
            start,
            field.key.span.lo,
            Modifiers {
                readonly: field.readonly,
                is_override: field.is_override,
                accessibility: field.accessibility,
            },
        );
        self.erase_field_suffix(FieldSuffix {
            key: field.key.span,
            end: field.span.hi,
            marker: if field.is_optional {
                Some(Token::QuestionMark)
            } else {
                field.definite.then_some(Token::Bang)
            },
            annotation: field.type_ann.as_deref(),
            value: field.value.as_deref(),
        });
        field.visit_children_with(self);
    }

    pub(super) fn erase_private_method(&mut self, method: &PrivateMethod) {
        if method.is_abstract || method.function.body.is_none() {
            self.erase_statement(method.span);
            return;
        }
        let start = modifiers_start(method.span.lo, &method.function.decorators);
        self.erase_modifiers(
            start,
            method.key.span.lo,
            Modifiers {
                is_override: method.is_override,
                accessibility: method.accessibility,
                ..Default::default()
            },
        );
        if method.is_optional {
            self.erase_token(
                method.key.span.hi,
                method.function.span.hi,
                Token::QuestionMark,
            );
        }
        method.visit_children_with(self);
    }

    pub(super) fn erase_auto_accessor(&mut self, field: &AutoAccessor) {
        if field.is_abstract {
            self.erase_statement(field.span);
            return;
        }
        let start = modifiers_start(field.span.lo, &field.decorators);
        self.erase_modifiers(
            start,
            field.key.span_lo(),
            Modifiers {
                is_override: field.is_override,
                accessibility: field.accessibility,
                ..Default::default()
            },
        );
        self.erase_field_suffix(FieldSuffix {
            key: field.key.span(),
            end: field.span.hi,
            marker: field.definite.then_some(Token::Bang),
            annotation: field.type_ann.as_deref(),
            value: field.value.as_deref(),
        });
        field.visit_children_with(self);
    }

    pub(super) fn erase_constructor(&mut self, constructor: &Constructor) {
        if constructor.body.is_none() {
            self.erase_statement(constructor.span);
            return;
        }
        self.erase_modifiers(
            constructor.span.lo,
            constructor.key.span_lo(),
            Modifiers {
                accessibility: constructor.accessibility,
                ..Default::default()
            },
        );
        constructor.visit_children_with(self);
    }
}

fn hazardous_key(key: &PropName) -> bool {
    key.is_computed()
        || key
            .as_ident()
            .is_some_and(|key| matches!(key.sym.as_ref(), "in" | "instanceof"))
}

pub(super) fn modifiers_start(start: BytePos, decorators: &[Decorator]) -> BytePos {
    decorators.last().map_or(start, Spanned::span_hi)
}
