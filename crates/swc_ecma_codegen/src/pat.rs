use swc_common::{SourceMapper, Spanned};
use swc_ecma_ast::*;
use swc_ecma_codegen_macros::emitter;

use crate::{text_writer::WriteJs, Emitter, Result, SourceMapperExt};

/// Patterns
impl<W, S: SourceMapper> Emitter<'_, W, S>
where
    W: WriteJs,
    S: SourceMapperExt,
{
    #[emitter]
    fn emit_param(&mut self, node: &Param) -> Result {
        self.emit_leading_comments_of_span(node.span(), false)?;

        srcmap!(node, true);

        self.emit_list(node.span, Some(&node.decorators), ListFormat::Decorators)?;

        emit!(node.pat);

        srcmap!(node, false);
    }

    #[emitter]
    fn emit_pat(&mut self, node: &Pat) -> Result {
        match node {
            Pat::Array(ref n) => emit!(n),
            Pat::Assign(ref n) => emit!(n),
            Pat::Expr(ref n) => emit!(n),
            Pat::Ident(ref n) => emit!(n),
            Pat::Object(ref n) => emit!(n),
            Pat::Rest(ref n) => emit!(n),
            Pat::Invalid(n) => emit!(n),
        }

        if self.comments.is_some() {
            self.emit_trailing_comments_of_pos(node.span().hi, true, true)?;
        }
    }

    #[emitter]
    fn emit_rest_pat(&mut self, node: &RestPat) -> Result {
        self.emit_leading_comments_of_span(node.span(), false)?;

        punct!(node.dot3_token, "...");
        emit!(node.arg);

        if let Some(type_ann) = &node.type_ann {
            punct!(":");
            formatting_space!();
            emit!(type_ann);
        }
    }

    #[emitter]
    fn emit_prop_or_spread(&mut self, node: &PropOrSpread) -> Result {
        match *node {
            PropOrSpread::Prop(ref n) => emit!(n),
            PropOrSpread::Spread(ref n) => emit!(n),
        }
    }

    #[emitter]
    fn emit_spread_element(&mut self, node: &SpreadElement) -> Result {
        if self.comments.is_some() {
            self.emit_leading_comments_of_span(node.span(), false)?;
        }

        srcmap!(node, true);

        punct!("...");
        emit!(node.expr);

        srcmap!(node, false);
    }

    #[emitter]
    fn emit_assign_target(&mut self, node: &AssignTarget) -> Result {
        match *node {
            AssignTarget::Simple(ref n) => emit!(n),
            AssignTarget::Pat(ref n) => emit!(n),
        }
    }

    #[emitter]
    fn emit_simple_assign_target(&mut self, node: &SimpleAssignTarget) -> Result {
        match node {
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
    }

    #[emitter]
    fn emit_assign_target_pat(&mut self, node: &AssignTargetPat) -> Result {
        match node {
            AssignTargetPat::Array(n) => emit!(n),
            AssignTargetPat::Object(n) => emit!(n),
            AssignTargetPat::Invalid(n) => emit!(n),
        }
    }

    #[emitter]
    fn emit_array_pat(&mut self, node: &ArrayPat) -> Result {
        self.emit_leading_comments_of_span(node.span(), false)?;

        srcmap!(node, true);

        punct!("[");

        let mut format = ListFormat::ArrayBindingPatternElements;

        if let Some(None) = node.elems.last() {
            format |= ListFormat::ForceTrailingComma;
        }

        self.emit_list(node.span(), Some(&node.elems), format)?;
        punct!("]");
        if node.optional {
            punct!("?");
        }

        if let Some(type_ann) = &node.type_ann {
            punct!(":");
            space!();
            emit!(type_ann);
        }

        srcmap!(node, false);
    }

    #[emitter]
    fn emit_assign_pat(&mut self, node: &AssignPat) -> Result {
        self.emit_leading_comments_of_span(node.span(), false)?;

        srcmap!(node, true);

        emit!(node.left);
        formatting_space!();
        punct!("=");
        formatting_space!();
        emit!(node.right);

        srcmap!(node, false);
    }

    #[emitter]
    fn emit_object_pat(&mut self, node: &ObjectPat) -> Result {
        self.emit_leading_comments_of_span(node.span(), false)?;

        srcmap!(node, true);
        punct!("{");

        self.emit_list(
            node.span(),
            Some(&node.props),
            ListFormat::ObjectBindingPatternElements | ListFormat::CanSkipTrailingComma,
        )?;

        punct!("}");

        if node.optional {
            punct!("?");
        }

        if let Some(type_ann) = &node.type_ann {
            punct!(":");
            space!();
            emit!(type_ann);
        }

        srcmap!(node, false);
    }

    #[emitter]
    fn emit_object_pat_prop(&mut self, node: &ObjectPatProp) -> Result {
        match *node {
            ObjectPatProp::KeyValue(ref node) => emit!(node),
            ObjectPatProp::Assign(ref node) => emit!(node),
            ObjectPatProp::Rest(ref node) => emit!(node),
        }
    }

    #[emitter]
    fn emit_object_kv_pat(&mut self, node: &KeyValuePatProp) -> Result {
        self.emit_leading_comments_of_span(node.span(), false)?;

        srcmap!(node, true);

        emit!(node.key);
        punct!(":");
        formatting_space!();
        emit!(node.value);

        srcmap!(node, false);
    }

    #[emitter]
    fn emit_object_assign_pat(&mut self, node: &AssignPatProp) -> Result {
        self.emit_leading_comments_of_span(node.span(), false)?;

        srcmap!(node, true);

        emit!(node.key);
        if let Some(value) = &node.value {
            formatting_space!();
            punct!("=");
            formatting_space!();
            emit!(value);
        }

        srcmap!(node, false);
    }

    #[emitter]
    fn emit_for_head(&mut self, node: &ForHead) -> Result {
        match node {
            ForHead::Pat(n) => emit!(n),
            ForHead::VarDecl(n) => emit!(n),
            ForHead::UsingDecl(n) => emit!(n),
        }
    }
}
