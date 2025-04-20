use swc_common::{SourceMapper, Span, Spanned};
use swc_ecma_ast::*;
use swc_ecma_codegen_macros::node_impl;

use crate::{
    text_writer::WriteJs, util::StartsWithAlphaNum, Emitter, ListFormat, Result, SourceMapperExt,
};

impl<W, S: SourceMapper> Emitter<'_, W, S>
where
    W: WriteJs,
    S: SourceMapperExt,
{
    pub fn emit_class_trailing(&mut self, node: &Class) -> Result {
        if node.super_class.is_some() {
            space!(self);
            keyword!(self, "extends");

            {
                let starts_with_alpha_num =
                    node.super_class.as_ref().unwrap().starts_with_alpha_num();

                if starts_with_alpha_num {
                    space!(self);
                } else {
                    formatting_space!(self)
                }
            }
            emit!(true, self, node.super_class);
            emit!(true, self, node.super_type_params);
        }

        if !node.implements.is_empty() {
            space!(self);
            keyword!(self, "implements");

            space!(self);

            self.emit_list(
                node.span,
                Some(&node.implements),
                ListFormat::ClassHeritageClauses,
            )?;
        }

        formatting_space!(self);

        punct!(self, "{");

        self.emit_list(node.span, Some(&node.body), ListFormat::ClassMembers)?;

        srcmap!(self, node, false, true);
        punct!(self, "}");

        Ok(())
    }
}

#[node_impl]
impl MacroNode for ClassExpr {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        let lo = only_new!(emitter.wr.get_pos());

        srcmap!(emitter, self, true);

        for dec in &self.class.decorators {
            emit!(emitter, dec);
        }

        if self.class.is_abstract {
            keyword!(emitter, "abstract");
            space!(emitter);
        }

        keyword!(emitter, "class");

        if let Some(ref i) = self.ident {
            space!(emitter);
            emit!(emitter, i);
            emit!(emitter, self.class.type_params);
        }

        emitter.emit_class_trailing(&self.class)?;

        let hi = only_new!(emitter.wr.get_pos());

        Ok(only_new!(ClassExpr {
            span: Span::new(lo, hi),
            ..self.clone()
        }))
    }
}

#[node_impl]
impl MacroNode for Class {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        let lo = only_new!(emitter.wr.get_pos());

        if self.super_class.is_some() {
            space!(emitter);
            keyword!(emitter, "extends");

            {
                let starts_with_alpha_num =
                    self.super_class.as_ref().unwrap().starts_with_alpha_num();

                if starts_with_alpha_num {
                    space!(emitter);
                } else {
                    formatting_space!(emitter)
                }
            }
            emit!(emitter, self.super_class);
            emit!(emitter, self.super_type_params);
        }

        if !self.implements.is_empty() {
            space!(emitter);
            keyword!(emitter, "implements");

            space!(emitter);

            emitter.emit_list(
                self.span,
                Some(&self.implements),
                ListFormat::ClassHeritageClauses,
            )?;
        }

        formatting_space!(emitter);

        punct!(emitter, "{");

        emitter.emit_list(self.span, Some(&self.body), ListFormat::ClassMembers)?;

        srcmap!(emitter, self, false, true);
        punct!(emitter, "}");

        let hi = only_new!(emitter.wr.get_pos());

        Ok(only_new!(Class {
            span: Span::new(lo, hi),
            ..self.clone()
        }))
    }
}

#[node_impl]
impl MacroNode for ClassMember {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        Ok(match self {
            ClassMember::Constructor(ref n) => {
                let n = emit!(emitter, n);

                only_new!(ClassMember::Constructor(n))
            }
            ClassMember::ClassProp(ref n) => {
                let n = emit!(emitter, n);

                only_new!(ClassMember::ClassProp(n))
            }
            ClassMember::Method(ref n) => {
                let n = emit!(emitter, n);

                only_new!(ClassMember::Method(n))
            }
            ClassMember::PrivateMethod(ref n) => {
                let n = emit!(emitter, n);

                only_new!(ClassMember::PrivateMethod(n))
            }
            ClassMember::PrivateProp(ref n) => {
                let n = emit!(emitter, n);

                only_new!(ClassMember::PrivateProp(n))
            }
            ClassMember::TsIndexSignature(ref n) => {
                let n = emit!(emitter, n);

                only_new!(ClassMember::TsIndexSignature(n))
            }
            ClassMember::Empty(ref n) => {
                let n = emit!(emitter, n);

                only_new!(ClassMember::Empty(n))
            }
            ClassMember::StaticBlock(ref n) => {
                let n = emit!(emitter, n);

                only_new!(ClassMember::StaticBlock(n))
            }
            ClassMember::AutoAccessor(ref n) => {
                let n = emit!(emitter, n);

                only_new!(ClassMember::AutoAccessor(n))
            }
        })
    }
}

#[node_impl]
impl MacroNode for AutoAccessor {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_list(self.span, Some(&self.decorators), ListFormat::Decorators)?;

        let lo = only_new!(emitter.wr.get_pos());

        emitter.emit_accessibility(self.accessibility)?;

        if self.is_static {
            keyword!(emitter, "static");
            space!(emitter);
        }

        if self.is_abstract {
            keyword!(emitter, "abstract");
            space!(emitter);
        }

        if self.is_override {
            keyword!(emitter, "override");
            space!(emitter);
        }

        keyword!(emitter, "accessor");
        space!(emitter);

        emit!(emitter, self.key);

        if let Some(type_ann) = &self.type_ann {
            if self.definite {
                punct!(emitter, "!");
            }
            punct!(emitter, ":");
            space!(emitter);
            emit!(emitter, type_ann);
        }

        if let Some(init) = &self.value {
            formatting_space!(emitter);
            punct!(emitter, "=");
            formatting_space!(emitter);
            emit!(emitter, init);
        }

        semi!(emitter);

        let hi = only_new!(emitter.wr.get_pos());

        Ok(only_new!(AutoAccessor {
            span: Span::new(lo, hi),
            ..self.clone()
        }))
    }
}

#[node_impl]
impl MacroNode for Key {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        Ok(match self {
            Key::Private(n) => {
                let n = emit!(emitter, n);

                only_new!(Key::Private(n))
            }
            Key::Public(n) => {
                let n = emit!(emitter, n);

                only_new!(Key::Public(n))
            }
        })
    }
}

#[node_impl]
impl MacroNode for PrivateMethod {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        let lo = only_new!(emitter.wr.get_pos());

        srcmap!(emitter, self, true);

        if self.is_static {
            keyword!(emitter, "static");
            space!(emitter);
        }
        match self.kind {
            MethodKind::Method => {
                if self.function.is_async {
                    keyword!(emitter, "async");
                    space!(emitter);
                }
                if self.function.is_generator {
                    punct!(emitter, "*");
                }

                emit!(emitter, self.key);
            }
            MethodKind::Getter => {
                keyword!(emitter, "get");
                space!(emitter);

                emit!(emitter, self.key);
            }
            MethodKind::Setter => {
                keyword!(emitter, "set");
                space!(emitter);

                emit!(emitter, self.key);
            }
        }

        emitter.emit_fn_trailing(&self.function)?;

        let hi = only_new!(emitter.wr.get_pos());

        Ok(only_new!(PrivateMethod {
            span: Span::new(lo, hi),
            ..self.clone()
        }))
    }
}

#[node_impl]
impl MacroNode for ClassMethod {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        emitter.emit_leading_comments_of_span(self.key.span(), false)?;

        let lo = only_new!(emitter.wr.get_pos());

        srcmap!(emitter, self, true);

        for d in &self.function.decorators {
            emit!(emitter, d);
        }

        emitter.emit_accessibility(self.accessibility)?;

        if self.is_static {
            keyword!(emitter, "static");

            let starts_with_alpha_num = match self.kind {
                MethodKind::Method => {
                    if self.function.is_async {
                        true
                    } else if self.function.is_generator {
                        false
                    } else {
                        self.key.starts_with_alpha_num()
                    }
                }
                MethodKind::Getter => true,
                MethodKind::Setter => true,
            };

            if starts_with_alpha_num {
                space!(emitter);
            } else {
                formatting_space!(emitter);
            }
        }

        if self.is_abstract {
            keyword!(emitter, "abstract");
            space!(emitter)
        }

        if self.is_override {
            keyword!(emitter, "override");
            space!(emitter)
        }

        match self.kind {
            MethodKind::Method => {
                if self.function.is_async {
                    keyword!(emitter, "async");
                    space!(emitter);
                }
                if self.function.is_generator {
                    punct!(emitter, "*");
                }

                emit!(emitter, self.key);
            }
            MethodKind::Getter => {
                keyword!(emitter, "get");

                if self.key.starts_with_alpha_num() {
                    space!(emitter);
                } else {
                    formatting_space!(emitter)
                }

                emit!(emitter, self.key);
            }
            MethodKind::Setter => {
                keyword!(emitter, "set");

                if self.key.starts_with_alpha_num() {
                    space!(emitter);
                } else {
                    formatting_space!(emitter)
                }

                emit!(emitter, self.key);
            }
        }

        if self.is_optional {
            punct!(emitter, "?");
        }

        if let Some(type_params) = &self.function.type_params {
            emit!(emitter, type_params);
        }

        punct!(emitter, "(");
        emitter.emit_list(
            self.function.span,
            Some(&self.function.params),
            ListFormat::CommaListElements,
        )?;

        punct!(emitter, ")");

        if let Some(ty) = &self.function.return_type {
            punct!(emitter, ":");
            formatting_space!(emitter);
            emit!(emitter, ty);
        }

        if let Some(body) = &self.function.body {
            formatting_space!(emitter);
            emit!(emitter, body);
        } else {
            formatting_semi!(emitter)
        }

        let hi = only_new!(emitter.wr.get_pos());

        Ok(only_new!(ClassMethod {
            span: Span::new(lo, hi),
            ..self.clone()
        }))
    }
}

#[node_impl]
impl MacroNode for PrivateProp {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        let lo = only_new!(emitter.wr.get_pos());

        srcmap!(emitter, self, true);

        emitter.emit_list(self.span, Some(&self.decorators), ListFormat::Decorators)?;

        emitter.emit_accessibility(self.accessibility)?;

        if self.is_static {
            keyword!(emitter, "static");
            space!(emitter);
        }

        if self.is_override {
            keyword!(emitter, "override");
            space!(emitter)
        }

        if self.readonly {
            keyword!(emitter, "readonly");
            space!(emitter);
        }

        emit!(emitter, self.key);

        if self.is_optional {
            punct!(emitter, "?");
        }

        if let Some(type_ann) = &self.type_ann {
            if self.definite {
                punct!(emitter, "!");
            }
            punct!(emitter, ":");
            space!(emitter);
            emit!(emitter, type_ann);
        }

        if let Some(value) = &self.value {
            formatting_space!(emitter);
            punct!(emitter, "=");
            formatting_space!(emitter);

            if value.is_seq() {
                punct!(emitter, "(");
                emit!(emitter, value);
                punct!(emitter, ")");
            } else {
                emit!(emitter, value);
            }
        }

        semi!(emitter);

        srcmap!(emitter, self, false);

        let hi = only_new!(emitter.wr.get_pos());

        Ok(only_new!(PrivateProp {
            span: Span::new(lo, hi),
            ..self.clone()
        }))
    }
}

#[node_impl]
impl MacroNode for ClassProp {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        let lo = only_new!(emitter.wr.get_pos());

        srcmap!(emitter, self, true);

        for dec in &self.decorators {
            emit!(emitter, dec)
        }

        if self.declare {
            keyword!(emitter, "declare");
            space!(emitter);
        }

        emitter.emit_accessibility(self.accessibility)?;

        if self.is_static {
            keyword!(emitter, "static");
            space!(emitter);
        }

        if self.is_abstract {
            keyword!(emitter, "abstract");
            space!(emitter)
        }

        if self.is_override {
            keyword!(emitter, "override");
            space!(emitter)
        }

        if self.readonly {
            keyword!(emitter, "readonly");
            space!(emitter)
        }

        emit!(emitter, self.key);

        if self.is_optional {
            punct!(emitter, "?");
        }

        if let Some(ty) = &self.type_ann {
            if self.definite {
                punct!(emitter, "!");
            }
            punct!(emitter, ":");
            space!(emitter);
            emit!(emitter, ty);
        }

        if let Some(v) = &self.value {
            formatting_space!(emitter);
            punct!(emitter, "=");
            formatting_space!(emitter);

            if v.is_seq() {
                punct!(emitter, "(");
                emit!(emitter, v);
                punct!(emitter, ")");
            } else {
                emit!(emitter, v);
            }
        }

        semi!(emitter);

        srcmap!(emitter, self, false);

        let hi = only_new!(emitter.wr.get_pos());

        Ok(only_new!(ClassProp {
            span: Span::new(lo, hi),
            ..self.clone()
        }))
    }
}

#[node_impl]
impl MacroNode for Constructor {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        let lo = only_new!(emitter.wr.get_pos());

        srcmap!(emitter, self, true);

        emitter.emit_accessibility(self.accessibility)?;

        keyword!(emitter, "constructor");
        punct!(emitter, "(");
        emitter.emit_list(self.span(), Some(&self.params), ListFormat::Parameters)?;
        punct!(emitter, ")");

        if let Some(body) = &self.body {
            emit!(emitter, body);
        } else {
            formatting_semi!(emitter);
        }

        let hi = only_new!(emitter.wr.get_pos());

        Ok(only_new!(Constructor {
            span: Span::new(lo, hi),
            ..self.clone()
        }))
    }
}

#[node_impl]
impl MacroNode for StaticBlock {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        let lo = only_new!(emitter.wr.get_pos());

        srcmap!(emitter, self, true);

        keyword!(emitter, "static");
        emit!(emitter, self.body);

        srcmap!(emitter, self, false);

        let hi = only_new!(emitter.wr.get_pos());

        Ok(only_new!(StaticBlock {
            span: Span::new(lo, hi),
            ..self.clone()
        }))
    }
}

impl<W, S: SourceMapper> Emitter<'_, W, S>
where
    W: WriteJs,
    S: SourceMapperExt,
{
    pub fn emit_accessibility(&mut self, n: Option<Accessibility>) -> Result {
        if let Some(a) = n {
            match a {
                Accessibility::Public => keyword!(self, "public"),
                Accessibility::Protected => keyword!(self, "protected"),
                Accessibility::Private => keyword!(self, "private"),
            }
            space!(self);
        }

        Ok(())
    }
}
