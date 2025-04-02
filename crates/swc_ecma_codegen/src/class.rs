use swc_common::{SourceMapper, Spanned};
use swc_ecma_ast::*;
use swc_ecma_codegen_macros::emitter;

use crate::{
    text_writer::WriteJs, util::StartsWithAlphaNum, Emitter, ListFormat, Result, SourceMapperExt,
};

#[node_impl]
impl MacroNode for ClassExpr {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        srcmap!(self, true);

        for dec in &self.class.decorators {
            emit!(dec);
        }

        if self.class.is_abstract {
            keyword!("abstract");
            space!();
        }

        keyword!("class");

        if let Some(ref i) = self.ident {
            space!();
            emit!(i);
            emit!(self.class.type_params);
        }

        emitter.emit_class_trailing(&self.class)?;
    }
}

#[node_impl]
impl MacroNode for Class {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        if self.super_class.is_some() {
            space!();
            keyword!("extends");

            {
                let starts_with_alpha_num =
                    self.super_class.as_ref().unwrap().starts_with_alpha_num();

                if starts_with_alpha_num {
                    space!();
                } else {
                    formatting_space!()
                }
            }
            emit!(self.super_class);
            emit!(self.super_type_params);
        }

        if !self.implements.is_empty() {
            space!();
            keyword!("implements");

            space!();

            emitter.emit_list(
                self.span,
                Some(&self.implements),
                ListFormat::ClassHeritageClauses,
            )?;
        }

        formatting_space!();

        punct!("{");

        emitter.emit_list(self.span, Some(&self.body), ListFormat::ClassMembers)?;

        srcmap!(self, false, true);
        punct!("}");
    }
}

#[node_impl]
impl MacroNode for ClassMember {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        match self {
            ClassMember::Constructor(ref n) => emit!(n),
            ClassMember::ClassProp(ref n) => emit!(n),
            ClassMember::Method(ref n) => emit!(n),
            ClassMember::PrivateMethod(ref n) => emit!(n),
            ClassMember::PrivateProp(ref n) => emit!(n),
            ClassMember::TsIndexSignature(ref n) => emit!(n),
            ClassMember::Empty(ref n) => emit!(n),
            ClassMember::StaticBlock(ref n) => emit!(n),
            ClassMember::AutoAccessor(ref n) => emit!(n),
        }
    }
}

#[node_impl]
impl MacroNode for AutoAccessor {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_list(self.span, Some(&self.decorators), ListFormat::Decorators)?;

        emitter.emit_accessibility(self.accessibility)?;

        if self.is_static {
            keyword!("static");
            space!();
        }

        if self.is_abstract {
            keyword!("abstract");
            space!();
        }

        if self.is_override {
            keyword!("override");
            space!();
        }

        keyword!("accessor");
        space!();

        emit!(self.key);

        if let Some(type_ann) = &self.type_ann {
            if self.definite {
                punct!("!");
            }
            punct!(":");
            space!();
            emit!(type_ann);
        }

        if let Some(init) = &self.value {
            formatting_space!();
            punct!("=");
            formatting_space!();
            emit!(init);
        }

        semi!();
    }
}

#[node_impl]
impl MacroNode for Key {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        match self {
            Key::Private(n) => emit!(n),
            Key::Public(n) => emit!(n),
        }
    }
}

#[node_impl]
impl MacroNode for PrivateMethod {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        srcmap!(self, true);

        if self.is_static {
            keyword!("static");
            space!();
        }
        match self.kind {
            MethodKind::Method => {
                if self.function.is_async {
                    keyword!("async");
                    space!();
                }
                if self.function.is_generator {
                    punct!("*");
                }

                emit!(self.key);
            }
            MethodKind::Getter => {
                keyword!("get");
                space!();

                emit!(self.key);
            }
            MethodKind::Setter => {
                keyword!("set");
                space!();

                emit!(self.key);
            }
        }

        emitter.emit_fn_trailing(&self.function)?;
    }
}

#[node_impl]
impl MacroNode for ClassMethod {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        emitter.emit_leading_comments_of_span(self.key.span(), false)?;

        srcmap!(self, true);

        for d in &self.function.decorators {
            emit!(d);
        }

        emitter.emit_accessibility(self.accessibility)?;

        if self.is_static {
            keyword!("static");

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
                space!();
            } else {
                formatting_space!();
            }
        }

        if self.is_abstract {
            keyword!("abstract");
            space!()
        }

        if self.is_override {
            keyword!("override");
            space!()
        }

        match self.kind {
            MethodKind::Method => {
                if self.function.is_async {
                    keyword!("async");
                    space!();
                }
                if self.function.is_generator {
                    punct!("*");
                }

                emit!(self.key);
            }
            MethodKind::Getter => {
                keyword!("get");

                if self.key.starts_with_alpha_num() {
                    space!();
                } else {
                    formatting_space!()
                }

                emit!(self.key);
            }
            MethodKind::Setter => {
                keyword!("set");

                if self.key.starts_with_alpha_num() {
                    space!();
                } else {
                    formatting_space!()
                }

                emit!(self.key);
            }
        }

        if self.is_optional {
            punct!("?");
        }

        if let Some(type_params) = &self.function.type_params {
            emit!(type_params);
        }

        punct!("(");
        emitter.emit_list(
            self.function.span,
            Some(&self.function.params),
            ListFormat::CommaListElements,
        )?;

        punct!(")");

        if let Some(ty) = &self.function.return_type {
            punct!(":");
            formatting_space!();
            emit!(ty);
        }

        if let Some(body) = &self.function.body {
            formatting_space!();
            emit!(body);
        } else {
            formatting_semi!()
        }
    }
}

#[node_impl]
impl MacroNode for PrivateProp {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        srcmap!(self, true);

        emitter.emit_list(self.span, Some(&self.decorators), ListFormat::Decorators)?;

        emitter.emit_accessibility(self.accessibility)?;

        if self.is_static {
            keyword!("static");
            space!();
        }

        if self.is_override {
            keyword!("override");
            space!()
        }

        if self.readonly {
            keyword!("readonly");
            space!();
        }

        emit!(self.key);

        if self.is_optional {
            punct!("?");
        }

        if let Some(type_ann) = &self.type_ann {
            if self.definite {
                punct!("!");
            }
            punct!(":");
            space!();
            emit!(type_ann);
        }

        if let Some(value) = &self.value {
            formatting_space!();
            punct!("=");
            formatting_space!();

            if value.is_seq() {
                punct!("(");
                emit!(value);
                punct!(")");
            } else {
                emit!(value);
            }
        }

        semi!();

        srcmap!(self, false);
    }
}

#[node_impl]
impl MacroNode for ClassProp {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;
        srcmap!(self, true);

        for dec in &self.decorators {
            emit!(dec)
        }

        if self.declare {
            keyword!("declare");
            space!();
        }

        emitter.emit_accessibility(self.accessibility)?;

        if self.is_static {
            keyword!("static");
            space!();
        }

        if self.is_abstract {
            keyword!("abstract");
            space!()
        }

        if self.is_override {
            keyword!("override");
            space!()
        }

        if self.readonly {
            keyword!("readonly");
            space!()
        }

        emit!(self.key);

        if self.is_optional {
            punct!("?");
        }

        if let Some(ty) = &self.type_ann {
            if self.definite {
                punct!("!");
            }
            punct!(":");
            space!();
            emit!(ty);
        }

        if let Some(v) = &self.value {
            formatting_space!();
            punct!("=");
            formatting_space!();

            if v.is_seq() {
                punct!("(");
                emit!(v);
                punct!(")");
            } else {
                emit!(v);
            }
        }

        semi!();

        srcmap!(self, false);
    }
}

#[node_impl]
impl MacroNode for Constructor {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        srcmap!(self, true);

        emitter.emit_accessibility(self.accessibility)?;

        keyword!("constructor");
        punct!("(");
        emitter.emit_list(self.span(), Some(&self.params), ListFormat::Parameters)?;
        punct!(")");

        if let Some(body) = &self.body {
            emit!(body);
        } else {
            formatting_semi!();
        }
    }
}

#[node_impl]
impl MacroNode for StaticBlock {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        srcmap!(self, true);

        keyword!("static");
        emit!(self.body);

        srcmap!(self, false);
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
