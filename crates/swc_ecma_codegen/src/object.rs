use swc_common::{Span, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_codegen_macros::node_impl;

use crate::{is_empty_comments, ListFormat};

#[node_impl]
impl MacroNode for ObjectLit {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        let lo = only_new!(emitter.wr.get_pos());

        srcmap!(emitter, self, true);

        punct!(emitter, "{");

        let emit_new_line = !emitter.cfg.minify
            && !(self.props.is_empty() && is_empty_comments(&self.span(), &emitter.comments));

        if emit_new_line {
            emitter.wr.write_line()?;
        }

        let mut list_format =
            ListFormat::ObjectLiteralExpressionProperties | ListFormat::CanSkipTrailingComma;

        if !emit_new_line {
            list_format -= ListFormat::MultiLine | ListFormat::Indented;
        }

        emitter.emit_list(self.span(), Some(&self.props), list_format)?;

        if emit_new_line {
            emitter.wr.write_line()?;
        }

        srcmap!(emitter, self, false, true);
        punct!(emitter, "}");

        let hi = only_new!(emitter.wr.get_pos());

        Ok(only_new!(ObjectLit {
            span: Span::new(lo, hi),
            ..self.clone()
        }))
    }
}

#[node_impl]
impl MacroNode for Prop {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        match self {
            Prop::Shorthand(ref n) => {
                let n = emit!(emitter, n);

                Ok(only_new!(Prop::Shorthand(n)))
            }
            Prop::KeyValue(ref n) => {
                let n = emit!(emitter, n);

                Ok(only_new!(Prop::KeyValue(n)))
            }
            Prop::Assign(ref n) => {
                let n = emit!(emitter, n);

                Ok(only_new!(Prop::Assign(n)))
            }
            Prop::Getter(ref n) => {
                let n = emit!(emitter, n);

                Ok(only_new!(Prop::Getter(n)))
            }
            Prop::Setter(ref n) => {
                let n = emit!(emitter, n);

                Ok(only_new!(Prop::Setter(n)))
            }
            Prop::Method(ref n) => {
                let n = emit!(emitter, n);

                Ok(only_new!(Prop::Method(n)))
            }
        }
    }
}

#[node_impl]
impl MacroNode for KeyValueProp {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        let key_span = self.key.span();
        let value_span = self.value.span();
        if !key_span.is_dummy() {
            emitter.wr.add_srcmap(key_span.lo)?;
        }
        emit!(emitter, self.key);
        if !key_span.is_dummy() && value_span.is_dummy() {
            emitter.wr.add_srcmap(key_span.hi)?;
        }
        punct!(emitter, ":");
        formatting_space!(emitter);
        if key_span.is_dummy() && !value_span.is_dummy() {
            emitter.wr.add_srcmap(value_span.lo)?;
        }
        emit!(emitter, self.value);

        Ok(only_new!(KeyValueProp { ..self.clone() }))
    }
}

#[node_impl]
impl MacroNode for AssignProp {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        let lo = only_new!(emitter.wr.get_pos());

        srcmap!(emitter, self, true);

        emit!(emitter, self.key);
        punct!(emitter, "=");
        emit!(emitter, self.value);

        let hi = only_new!(emitter.wr.get_pos());

        Ok(only_new!(AssignProp {
            span: Span::new(lo, hi),
            ..self.clone()
        }))
    }
}

#[node_impl]
impl MacroNode for GetterProp {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        let lo = only_new!(emitter.wr.get_pos());

        srcmap!(emitter, self, true);

        keyword!(emitter, "get");

        let starts_with_alpha_num = match self.key {
            PropName::Str(_) | PropName::Computed(_) => false,
            _ => true,
        };
        if starts_with_alpha_num {
            space!(emitter);
        } else {
            formatting_space!(emitter);
        }
        emit!(emitter, self.key);
        formatting_space!(emitter);
        punct!(emitter, "(");
        punct!(emitter, ")");
        formatting_space!(emitter);
        emit!(emitter, self.body);

        let hi = only_new!(emitter.wr.get_pos());

        Ok(only_new!(GetterProp {
            span: Span::new(lo, hi),
            ..self.clone()
        }))
    }
}

#[node_impl]
impl MacroNode for SetterProp {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        let lo = only_new!(emitter.wr.get_pos());

        srcmap!(emitter, self, true);

        keyword!(emitter, "set");

        let starts_with_alpha_num = match self.key {
            PropName::Str(_) | PropName::Computed(_) => false,
            _ => true,
        };

        if starts_with_alpha_num {
            space!(emitter);
        } else {
            formatting_space!(emitter);
        }

        emit!(emitter, self.key);
        formatting_space!(emitter);

        punct!(emitter, "(");
        if let Some(this) = &self.this_param {
            emit!(emitter, this);
            punct!(emitter, ",");

            formatting_space!(emitter);
        }

        emit!(emitter, self.param);

        punct!(emitter, ")");

        emit!(emitter, self.body);

        let hi = only_new!(emitter.wr.get_pos());

        Ok(only_new!(SetterProp {
            span: Span::new(lo, hi),
            ..self.clone()
        }))
    }
}

#[node_impl]
impl MacroNode for MethodProp {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        let lo = only_new!(emitter.wr.get_pos());

        srcmap!(emitter, self, true);

        if self.function.is_async {
            keyword!(emitter, "async");
            space!(emitter);
        }

        if self.function.is_generator {
            punct!(emitter, "*");
        }

        emit!(emitter, self.key);
        formatting_space!(emitter);
        // TODO
        emitter.emit_fn_trailing(&self.function)?;

        let hi = only_new!(emitter.wr.get_pos());

        Ok(only_new!(MethodProp {
            function: Box::new(Function {
                span: Span::new(lo, hi),
                ..*self.function.clone()
            }),
            ..self.clone()
        }))
    }
}

#[node_impl]
impl MacroNode for PropName {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        match self {
            PropName::Ident(ident) => {
                // TODO: Use write_symbol when ident is a symbol.
                emitter.emit_leading_comments_of_span(ident.span, false)?;

                let target = emitter.cfg.target;
                let lo = only_new!(emitter.wr.get_pos());

                // Source map
                emitter.wr.commit_pending_semi()?;

                srcmap!(emitter, ident, true);

                if emitter.cfg.ascii_only {
                    if emitter.wr.can_ignore_invalid_unicodes() {
                        emitter.wr.write_symbol(
                            DUMMY_SP,
                            &crate::get_ascii_only_ident(&ident.sym, true, target),
                        )?;
                    } else {
                        emitter.wr.write_symbol(
                            DUMMY_SP,
                            &crate::get_ascii_only_ident(
                                &crate::handle_invalid_unicodes(&ident.sym),
                                true,
                                target,
                            ),
                        )?;
                    }
                } else {
                    emit!(emitter, ident);
                }

                let hi = only_new!(emitter.wr.get_pos());

                Ok(only_new!(PropName::Ident(IdentName {
                    span: Span::new(lo, hi),
                    ..ident.clone()
                })))
            }
            PropName::Str(ref n) => {
                let n = emit!(emitter, n);

                Ok(only_new!(PropName::Str(n)))
            }
            PropName::Num(ref n) => {
                let n = emit!(emitter, n);

                Ok(only_new!(PropName::Num(n)))
            }
            PropName::BigInt(ref n) => {
                let n = emit!(emitter, n);

                Ok(only_new!(PropName::BigInt(n)))
            }
            PropName::Computed(ref n) => {
                let n = emit!(emitter, n);

                Ok(only_new!(PropName::Computed(n)))
            }
        }
    }
}

#[node_impl]
impl MacroNode for ComputedPropName {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        srcmap!(emitter, self, true);

        let lo = only_new!(emitter.wr.get_pos());

        punct!(emitter, "[");
        emit!(emitter, self.expr);
        punct!(emitter, "]");

        srcmap!(emitter, self, false);

        let hi = only_new!(emitter.wr.get_pos());

        Ok(only_new!(ComputedPropName {
            span: Span::new(lo, hi),
            ..self.clone()
        }))
    }
}
