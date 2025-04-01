use swc_common::{SourceMapper, Spanned};
use swc_ecma_ast::*;
use swc_ecma_codegen_macros::emitter;

use crate::{
    text_writer::WriteJs, util::StartsWithAlphaNum, Emitter, ListFormat, Result, SourceMapperExt,
};

impl<W, S: SourceMapper> Emitter<'_, W, S>
where
    W: WriteJs,
    S: SourceMapperExt,
{
    #[emitter]
    pub fn emit_class_expr(&mut self, node: &ClassExpr) -> Result {
        self.emit_leading_comments_of_span(node.span(), false)?;

        srcmap!(node, true);

        for dec in &node.class.decorators {
            emit!(dec);
        }

        if node.class.is_abstract {
            keyword!("abstract");
            space!();
        }

        keyword!("class");

        if let Some(ref i) = node.ident {
            space!();
            emit!(i);
            emit!(node.class.type_params);
        }

        self.emit_class_trailing(&node.class)?;
    }

    #[emitter]
    pub fn emit_class_trailing(&mut self, node: &Class) -> Result {
        if node.super_class.is_some() {
            space!();
            keyword!("extends");

            {
                let starts_with_alpha_num =
                    node.super_class.as_ref().unwrap().starts_with_alpha_num();

                if starts_with_alpha_num {
                    space!();
                } else {
                    formatting_space!()
                }
            }
            emit!(node.super_class);
            emit!(node.super_type_params);
        }

        if !node.implements.is_empty() {
            space!();
            keyword!("implements");

            space!();

            self.emit_list(
                node.span,
                Some(&node.implements),
                ListFormat::ClassHeritageClauses,
            )?;
        }

        formatting_space!();

        punct!("{");

        self.emit_list(node.span, Some(&node.body), ListFormat::ClassMembers)?;

        srcmap!(node, false, true);
        punct!("}");
    }

    #[emitter]
    pub fn emit_class_member(&mut self, node: &ClassMember) -> Result {
        match *node {
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

    #[emitter]
    pub fn emit_auto_accessor(&mut self, n: &AutoAccessor) -> Result {
        self.emit_list(n.span, Some(&n.decorators), ListFormat::Decorators)?;

        self.emit_accessibility(n.accessibility)?;

        if n.is_static {
            keyword!("static");
            space!();
        }

        if n.is_abstract {
            keyword!("abstract");
            space!();
        }

        if n.is_override {
            keyword!("override");
            space!();
        }

        keyword!("accessor");
        space!();

        emit!(n.key);

        if let Some(type_ann) = &n.type_ann {
            if n.definite {
                punct!("!");
            }
            punct!(":");
            space!();
            emit!(type_ann);
        }

        if let Some(init) = &n.value {
            formatting_space!();
            punct!("=");
            formatting_space!();
            emit!(init);
        }

        semi!();
    }

    #[emitter]
    pub fn emit_key(&mut self, n: &Key) -> Result {
        match n {
            Key::Private(n) => emit!(n),
            Key::Public(n) => emit!(n),
        }
    }

    #[emitter]
    pub fn emit_private_method(&mut self, n: &PrivateMethod) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        srcmap!(n, true);

        if n.is_static {
            keyword!("static");
            space!();
        }
        match n.kind {
            MethodKind::Method => {
                if n.function.is_async {
                    keyword!("async");
                    space!();
                }
                if n.function.is_generator {
                    punct!("*");
                }

                emit!(n.key);
            }
            MethodKind::Getter => {
                keyword!("get");
                space!();

                emit!(n.key);
            }
            MethodKind::Setter => {
                keyword!("set");
                space!();

                emit!(n.key);
            }
        }

        self.emit_fn_trailing(&n.function)?;
    }

    #[emitter]
    pub fn emit_class_method(&mut self, n: &ClassMethod) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        self.emit_leading_comments_of_span(n.key.span(), false)?;

        srcmap!(n, true);

        for d in &n.function.decorators {
            emit!(d);
        }

        self.emit_accessibility(n.accessibility)?;

        if n.is_static {
            keyword!("static");

            let starts_with_alpha_num = match n.kind {
                MethodKind::Method => {
                    if n.function.is_async {
                        true
                    } else if n.function.is_generator {
                        false
                    } else {
                        n.key.starts_with_alpha_num()
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

        if n.is_abstract {
            keyword!("abstract");
            space!()
        }

        if n.is_override {
            keyword!("override");
            space!()
        }

        match n.kind {
            MethodKind::Method => {
                if n.function.is_async {
                    keyword!("async");
                    space!();
                }
                if n.function.is_generator {
                    punct!("*");
                }

                emit!(n.key);
            }
            MethodKind::Getter => {
                keyword!("get");

                if n.key.starts_with_alpha_num() {
                    space!();
                } else {
                    formatting_space!()
                }

                emit!(n.key);
            }
            MethodKind::Setter => {
                keyword!("set");

                if n.key.starts_with_alpha_num() {
                    space!();
                } else {
                    formatting_space!()
                }

                emit!(n.key);
            }
        }

        if n.is_optional {
            punct!("?");
        }

        if let Some(type_params) = &n.function.type_params {
            emit!(type_params);
        }

        punct!("(");
        self.emit_list(
            n.function.span,
            Some(&n.function.params),
            ListFormat::CommaListElements,
        )?;

        punct!(")");

        if let Some(ty) = &n.function.return_type {
            punct!(":");
            formatting_space!();
            emit!(ty);
        }

        if let Some(body) = &n.function.body {
            formatting_space!();
            emit!(body);
        } else {
            formatting_semi!()
        }
    }

    #[emitter]
    pub fn emit_private_prop(&mut self, n: &PrivateProp) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        srcmap!(n, true);

        self.emit_list(n.span, Some(&n.decorators), ListFormat::Decorators)?;

        self.emit_accessibility(n.accessibility)?;

        if n.is_static {
            keyword!("static");
            space!();
        }

        if n.is_override {
            keyword!("override");
            space!()
        }

        if n.readonly {
            keyword!("readonly");
            space!();
        }

        emit!(n.key);

        if n.is_optional {
            punct!("?");
        }

        if let Some(type_ann) = &n.type_ann {
            if n.definite {
                punct!("!");
            }
            punct!(":");
            space!();
            emit!(type_ann);
        }

        if let Some(value) = &n.value {
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

        srcmap!(n, false);
    }

    #[emitter]
    pub fn emit_class_prop(&mut self, n: &ClassProp) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;
        srcmap!(n, true);

        for dec in &n.decorators {
            emit!(dec)
        }

        if n.declare {
            keyword!("declare");
            space!();
        }

        self.emit_accessibility(n.accessibility)?;

        if n.is_static {
            keyword!("static");
            space!();
        }

        if n.is_abstract {
            keyword!("abstract");
            space!()
        }

        if n.is_override {
            keyword!("override");
            space!()
        }

        if n.readonly {
            keyword!("readonly");
            space!()
        }

        emit!(n.key);

        if n.is_optional {
            punct!("?");
        }

        if let Some(ty) = &n.type_ann {
            if n.definite {
                punct!("!");
            }
            punct!(":");
            space!();
            emit!(ty);
        }

        if let Some(v) = &n.value {
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

        srcmap!(n, false);
    }

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

    #[emitter]
    pub fn emit_class_constructor(&mut self, n: &Constructor) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        srcmap!(n, true);

        self.emit_accessibility(n.accessibility)?;

        keyword!("constructor");
        punct!("(");
        self.emit_list(n.span(), Some(&n.params), ListFormat::Parameters)?;
        punct!(")");

        if let Some(body) = &n.body {
            emit!(body);
        } else {
            formatting_semi!();
        }
    }

    #[emitter]
    pub fn emit_static_block(&mut self, n: &StaticBlock) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        srcmap!(n, true);

        keyword!("static");
        emit!(n.body);

        srcmap!(n, false);
    }
}
