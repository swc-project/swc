use swc_common::{SourceMapper, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_codegen_macros::emitter;

use crate::{
    is_empty_comments, text_writer::WriteJs, Emitter, ListFormat, Result, SourceMapperExt,
};

impl<W, S: SourceMapper> Emitter<'_, W, S>
where
    W: WriteJs,
    S: SourceMapperExt,
{
    #[emitter]
    pub fn emit_object_lit(&mut self, node: &ObjectLit) -> Result {
        self.emit_leading_comments_of_span(node.span(), false)?;

        srcmap!(node, true);

        punct!("{");

        let emit_new_line = !self.cfg.minify
            && !(node.props.is_empty() && is_empty_comments(&node.span(), &self.comments));

        if emit_new_line {
            self.wr.write_line()?;
        }

        let mut list_format =
            ListFormat::ObjectLiteralExpressionProperties | ListFormat::CanSkipTrailingComma;

        if !emit_new_line {
            list_format -= ListFormat::MultiLine | ListFormat::Indented;
        }

        self.emit_list(node.span(), Some(&node.props), list_format)?;

        if emit_new_line {
            self.wr.write_line()?;
        }

        srcmap!(node, false, true);
        punct!("}");
    }

    #[emitter]
    pub fn emit_prop(&mut self, node: &Prop) -> Result {
        match *node {
            Prop::Shorthand(ref n) => emit!(n),
            Prop::KeyValue(ref n) => emit!(n),
            Prop::Assign(ref n) => emit!(n),
            Prop::Getter(ref n) => emit!(n),
            Prop::Setter(ref n) => emit!(n),
            Prop::Method(ref n) => emit!(n),
        }
    }

    #[emitter]
    pub fn emit_kv_prop(&mut self, node: &KeyValueProp) -> Result {
        self.emit_leading_comments_of_span(node.span(), false)?;
        let key_span = node.key.span();
        let value_span = node.value.span();
        if !key_span.is_dummy() {
            self.wr.add_srcmap(key_span.lo)?;
        }
        emit!(node.key);
        if !key_span.is_dummy() && value_span.is_dummy() {
            self.wr.add_srcmap(key_span.hi)?;
        }
        punct!(":");
        formatting_space!();
        if key_span.is_dummy() && !value_span.is_dummy() {
            self.wr.add_srcmap(value_span.lo)?;
        }
        emit!(node.value);
    }

    #[emitter]
    pub fn emit_assign_prop(&mut self, node: &AssignProp) -> Result {
        self.emit_leading_comments_of_span(node.span(), false)?;

        srcmap!(node, true);

        emit!(node.key);
        punct!("=");
        emit!(node.value);
    }

    #[emitter]
    pub fn emit_getter_prop(&mut self, node: &GetterProp) -> Result {
        self.emit_leading_comments_of_span(node.span(), false)?;

        srcmap!(node, true);

        keyword!("get");

        let starts_with_alpha_num = match node.key {
            PropName::Str(_) | PropName::Computed(_) => false,
            _ => true,
        };
        if starts_with_alpha_num {
            space!();
        } else {
            formatting_space!();
        }
        emit!(node.key);
        formatting_space!();
        punct!("(");
        punct!(")");
        formatting_space!();
        emit!(node.body);
    }

    #[emitter]
    pub fn emit_setter_prop(&mut self, node: &SetterProp) -> Result {
        self.emit_leading_comments_of_span(node.span(), false)?;

        srcmap!(node, true);

        keyword!("set");

        let starts_with_alpha_num = match node.key {
            PropName::Str(_) | PropName::Computed(_) => false,
            _ => true,
        };

        if starts_with_alpha_num {
            space!();
        } else {
            formatting_space!();
        }

        emit!(node.key);
        formatting_space!();

        punct!("(");
        if let Some(this) = &node.this_param {
            emit!(this);
            punct!(",");

            formatting_space!();
        }

        emit!(node.param);

        punct!(")");

        emit!(node.body);
    }

    #[emitter]
    pub fn emit_method_prop(&mut self, node: &MethodProp) -> Result {
        self.emit_leading_comments_of_span(node.span(), false)?;

        srcmap!(node, true);

        if node.function.is_async {
            keyword!("async");
            space!();
        }

        if node.function.is_generator {
            punct!("*");
        }

        emit!(node.key);
        formatting_space!();
        // TODO
        self.emit_fn_trailing(&node.function)?;
    }

    #[emitter]
    pub fn emit_prop_name(&mut self, node: &PropName) -> Result {
        match node {
            PropName::Ident(ident) => {
                // TODO: Use write_symbol when ident is a symbol.
                self.emit_leading_comments_of_span(ident.span, false)?;

                // Source map
                self.wr.commit_pending_semi()?;

                srcmap!(ident, true);

                if self.cfg.ascii_only {
                    if self.wr.can_ignore_invalid_unicodes() {
                        self.wr.write_symbol(
                            DUMMY_SP,
                            &crate::get_ascii_only_ident(&ident.sym, true, self.cfg.target),
                        )?;
                    } else {
                        self.wr.write_symbol(
                            DUMMY_SP,
                            &crate::get_ascii_only_ident(
                                &crate::handle_invalid_unicodes(&ident.sym),
                                true,
                                self.cfg.target,
                            ),
                        )?;
                    }
                } else {
                    emit!(ident);
                }
            }
            PropName::Str(ref n) => emit!(n),
            PropName::Num(ref n) => emit!(n),
            PropName::BigInt(ref n) => emit!(n),
            PropName::Computed(ref n) => emit!(n),
        }
    }

    #[emitter]
    pub fn emit_computed_prop_name(&mut self, n: &ComputedPropName) -> Result {
        srcmap!(n, true);

        punct!("[");
        emit!(n.expr);
        punct!("]");

        srcmap!(n, false);
    }
}
