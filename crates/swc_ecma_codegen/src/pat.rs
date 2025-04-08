use swc_common::Spanned;
use swc_ecma_ast::*;
use swc_ecma_codegen_macros::node_impl;

#[node_impl]
impl MacroNode for Param {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        srcmap!(emitter, self, true);

        emitter.emit_list(self.span, Some(&self.decorators), ListFormat::Decorators)?;

        emit!(self.pat);

        srcmap!(emitter, self, false);

        Ok(())
    }
}

#[node_impl]
impl MacroNode for Pat {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        match self {
            Pat::Array(n) => emit!(n),
            Pat::Assign(n) => emit!(n),
            Pat::Expr(n) => emit!(n),
            Pat::Ident(n) => emit!(n),
            Pat::Object(n) => emit!(n),
            Pat::Rest(n) => emit!(n),
            Pat::Invalid(n) => emit!(n),
        }

        if emitter.comments.is_some() {
            emitter.emit_trailing_comments_of_pos(self.span().hi, true, true)?;
        }

        Ok(())
    }
}

#[node_impl]
impl MacroNode for RestPat {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        punct!(emitter, self.dot3_token, "...");
        emit!(self.arg);

        if let Some(type_ann) = ref_maybe_mut!(self.type_ann) {
            punct!(emitter, ":");
            formatting_space!(emitter);
            emit!(type_ann);
        }

        Ok(())
    }
}

#[node_impl]
impl MacroNode for PropOrSpread {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        match self {
            PropOrSpread::Prop(n) => emit!(n),
            PropOrSpread::Spread(n) => emit!(n),
        }

        Ok(())
    }
}

#[node_impl]
impl MacroNode for SpreadElement {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        if emitter.comments.is_some() {
            emitter.emit_leading_comments_of_span(self.span(), false)?;
        }

        srcmap!(emitter, self, true);

        punct!(emitter, "...");
        emit!(self.expr);

        srcmap!(emitter, self, false);

        Ok(())
    }
}

#[node_impl]
impl MacroNode for AssignTarget {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        match self {
            AssignTarget::Simple(n) => emit!(n),
            AssignTarget::Pat(n) => emit!(n),
        }

        Ok(())
    }
}

#[node_impl]
impl MacroNode for SimpleAssignTarget {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        match self {
            SimpleAssignTarget::Ident(n) => emit!(n),
            SimpleAssignTarget::Member(n) => emit!(n),
            SimpleAssignTarget::Invalid(n) => emit!(n),
            SimpleAssignTarget::SuperProp(n) => emit!(n),
            SimpleAssignTarget::Paren(n) => emit!(n),
            SimpleAssignTarget::OptChain(n) => emit!(n),
            SimpleAssignTarget::TsAs(n) => emit!(n),
            SimpleAssignTarget::TsNonNull(n) => emit!(n),
            SimpleAssignTarget::TsSatisfies(n) => emit!(n),
            SimpleAssignTarget::TsTypeAssertion(n) => emit!(n),
            SimpleAssignTarget::TsInstantiation(n) => emit!(n),
        }

        Ok(())
    }
}

#[node_impl]
impl MacroNode for AssignTargetPat {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        match self {
            AssignTargetPat::Array(n) => emit!(n),
            AssignTargetPat::Object(n) => emit!(n),
            AssignTargetPat::Invalid(n) => emit!(n),
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

        if let Some(type_ann) = ref_maybe_mut!(self.type_ann) {
            punct!(emitter, ":");
            space!(emitter);
            emit!(type_ann);
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

        emit!(self.left);
        formatting_space!(emitter);
        punct!(emitter, "=");
        formatting_space!(emitter);
        emit!(self.right);

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
            emit!(type_ann);
        }

        srcmap!(emitter, self, false);

        Ok(())
    }
}

#[node_impl]
impl MacroNode for ObjectPatProp {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        match self {
            ObjectPatProp::KeyValue(node) => emit!(node),
            ObjectPatProp::Assign(node) => emit!(node),
            ObjectPatProp::Rest(node) => emit!(node),
        }

        Ok(())
    }
}

#[node_impl]
impl MacroNode for KeyValuePatProp {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        srcmap!(emitter, self, true);

        emit!(self.key);
        punct!(emitter, ":");
        formatting_space!(emitter);
        emit!(self.value);

        srcmap!(emitter, self, false);

        Ok(())
    }
}

#[node_impl]
impl MacroNode for AssignPatProp {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        srcmap!(emitter, self, true);

        emit!(self.key);
        if let Some(value) = ref_maybe_mut!(self.value) {
            formatting_space!(emitter);
            punct!(emitter, "=");
            formatting_space!(emitter);
            emit!(value);
        }

        srcmap!(emitter, self, false);

        Ok(())
    }
}

#[node_impl]
impl MacroNode for ForHead {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        match self {
            ForHead::Pat(n) => emit!(n),
            ForHead::VarDecl(n) => emit!(n),
            ForHead::UsingDecl(n) => emit!(n),
        }

        Ok(())
    }
}
