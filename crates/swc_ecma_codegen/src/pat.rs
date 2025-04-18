use swc_common::{Span, Spanned};
use swc_ecma_ast::*;
use swc_ecma_codegen_macros::node_impl;

#[node_impl]
impl MacroNode for Param {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        let lo = only_new!(emitter.wr.get_pos());

        srcmap!(emitter, self, true);

        emitter.emit_list(self.span, Some(&self.decorators), ListFormat::Decorators)?;

        emit!(emitter, self.pat);

        srcmap!(emitter, self, false);

        let hi = only_new!(emitter.wr.get_pos());

        Ok(only_new!(Param {
            span: Span::new(lo, hi),
            ..self.clone()
        }))
    }
}

#[node_impl]
impl MacroNode for Pat {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        let result = match self {
            Pat::Array(ref n) => {
                let n = emit!(emitter, n);

                only_new!(Pat::Array(n))
            }
            Pat::Assign(ref n) => {
                let n = emit!(emitter, n);

                only_new!(Pat::Assign(n))
            }
            Pat::Expr(ref n) => {
                let n = emit!(emitter, n);

                only_new!(Pat::Expr(n))
            }
            Pat::Ident(ref n) => {
                let n = emit!(emitter, n);

                only_new!(Pat::Ident(n))
            }
            Pat::Object(ref n) => {
                let n = emit!(emitter, n);

                only_new!(Pat::Object(n))
            }
            Pat::Rest(ref n) => {
                let n = emit!(emitter, n);

                only_new!(Pat::Rest(n))
            }
            Pat::Invalid(n) => {
                let n = emit!(emitter, n);

                only_new!(Pat::Invalid(n))
            }
        };

        if emitter.comments.is_some() {
            emitter.emit_trailing_comments_of_pos(self.span().hi, true, true)?;
        }

        Ok(result)
    }
}

#[node_impl]
impl MacroNode for RestPat {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        let lo = only_new!(emitter.wr.get_pos());

        punct!(emitter, self.dot3_token, "...");
        emit!(emitter, self.arg);

        if let Some(type_ann) = &self.type_ann {
            punct!(emitter, ":");
            formatting_space!(emitter);
            emit!(emitter, type_ann);
        }

        let hi = only_new!(emitter.wr.get_pos());

        Ok(only_new!(RestPat {
            span: Span::new(lo, hi),
            ..self.clone()
        }))
    }
}

#[node_impl]
impl MacroNode for PropOrSpread {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        match self {
            PropOrSpread::Prop(ref n) => {
                let n = emit!(emitter, n);

                only_new!(PropOrSpread::Prop(n))
            }
            PropOrSpread::Spread(ref n) => {
                let n = emit!(emitter, n);

                only_new!(PropOrSpread::Spread(n))
            }
        }
    }
}

#[node_impl]
impl MacroNode for SpreadElement {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        if emitter.comments.is_some() {
            emitter.emit_leading_comments_of_span(self.span(), false)?;
        }

        let lo = only_new!(emitter.wr.get_pos());

        srcmap!(emitter, self, true);

        punct!(emitter, "...");
        emit!(emitter, self.expr);

        srcmap!(emitter, self, false);

        let hi = only_new!(emitter.wr.get_pos());

        Ok(only_new!(SpreadElement {
            span: Span::new(lo, hi),
            ..self.clone()
        }))
    }
}

#[node_impl]
impl MacroNode for AssignTarget {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        match self {
            AssignTarget::Simple(ref n) => emit!(emitter, n),
            AssignTarget::Pat(ref n) => emit!(emitter, n),
        }

        Ok(())
    }
}

#[node_impl]
impl MacroNode for SimpleAssignTarget {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        match self {
            SimpleAssignTarget::Ident(n) => emit!(emitter, n),
            SimpleAssignTarget::Member(n) => emit!(emitter, n),
            SimpleAssignTarget::Invalid(n) => emit!(emitter, n),
            SimpleAssignTarget::SuperProp(n) => emit!(emitter, n),
            SimpleAssignTarget::Paren(n) => emit!(emitter, n),
            SimpleAssignTarget::OptChain(n) => emit!(emitter, n),
            SimpleAssignTarget::TsAs(n) => emit!(emitter, n),
            SimpleAssignTarget::TsNonNull(n) => emit!(emitter, n),
            SimpleAssignTarget::TsSatisfies(n) => emit!(emitter, n),
            SimpleAssignTarget::TsTypeAssertion(n) => emit!(emitter, n),
            SimpleAssignTarget::TsInstantiation(n) => emit!(emitter, n),
        }

        Ok(())
    }
}

#[node_impl]
impl MacroNode for AssignTargetPat {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        match self {
            AssignTargetPat::Array(n) => emit!(emitter, n),
            AssignTargetPat::Object(n) => emit!(emitter, n),
            AssignTargetPat::Invalid(n) => emit!(emitter, n),
        }

        Ok(())
    }
}

#[node_impl]
impl MacroNode for ArrayPat {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        srcmap!(emitter, self, true);

        punct!(emitter, "[");

        let mut format = ListFormat::ArrayBindingPatternElements;

        if let Some(None) = self.elems.last() {
            format |= ListFormat::ForceTrailingComma;
        }

        emitter.emit_list(self.span(), Some(&self.elems), format)?;
        punct!(emitter, "]");
        if self.optional {
            punct!(emitter, "?");
        }

        if let Some(type_ann) = &self.type_ann {
            punct!(emitter, ":");
            space!(emitter);
            emit!(emitter, type_ann);
        }

        srcmap!(emitter, self, false);

        Ok(())
    }
}

#[node_impl]
impl MacroNode for AssignPat {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        srcmap!(emitter, self, true);

        emit!(emitter, self.left);
        formatting_space!(emitter);
        punct!(emitter, "=");
        formatting_space!(emitter);
        emit!(emitter, self.right);

        srcmap!(emitter, self, false);

        Ok(())
    }
}

#[node_impl]
impl MacroNode for ObjectPat {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        srcmap!(emitter, self, true);
        punct!(emitter, "{");

        emitter.emit_list(
            self.span(),
            Some(&self.props),
            ListFormat::ObjectBindingPatternElements | ListFormat::CanSkipTrailingComma,
        )?;

        punct!(emitter, "}");

        if self.optional {
            punct!(emitter, "?");
        }

        if let Some(type_ann) = &self.type_ann {
            punct!(emitter, ":");
            space!(emitter);
            emit!(emitter, type_ann);
        }

        srcmap!(emitter, self, false);

        Ok(())
    }
}

#[node_impl]
impl MacroNode for ObjectPatProp {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        match self {
            ObjectPatProp::KeyValue(ref node) => emit!(emitter, node),
            ObjectPatProp::Assign(ref node) => emit!(emitter, node),
            ObjectPatProp::Rest(ref node) => emit!(emitter, node),
        }

        Ok(())
    }
}

#[node_impl]
impl MacroNode for KeyValuePatProp {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        srcmap!(emitter, self, true);

        emit!(emitter, self.key);
        punct!(emitter, ":");
        formatting_space!(emitter);
        emit!(emitter, self.value);

        srcmap!(emitter, self, false);

        Ok(())
    }
}

#[node_impl]
impl MacroNode for AssignPatProp {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        srcmap!(emitter, self, true);

        emit!(emitter, self.key);
        if let Some(value) = &self.value {
            formatting_space!(emitter);
            punct!(emitter, "=");
            formatting_space!(emitter);
            emit!(emitter, value);
        }

        srcmap!(emitter, self, false);

        Ok(())
    }
}

#[node_impl]
impl MacroNode for ForHead {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        match self {
            ForHead::Pat(n) => emit!(emitter, n),
            ForHead::VarDecl(n) => emit!(emitter, n),
            ForHead::UsingDecl(n) => emit!(emitter, n),
        }

        Ok(())
    }
}
