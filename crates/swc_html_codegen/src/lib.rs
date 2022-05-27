#![deny(clippy::all)]
#![allow(clippy::needless_update)]

pub use std::fmt::Result;

use swc_common::Spanned;
use swc_html_ast::*;
use swc_html_codegen_macros::emitter;
use writer::HtmlWriter;

pub use self::emit::*;
use self::{ctx::Ctx, list::ListFormat};

#[macro_use]
mod macros;
mod ctx;
mod emit;
mod list;
pub mod writer;

#[derive(Debug, Clone, Copy, Default)]
pub struct CodegenConfig {
    pub minify: bool,
    pub scripting_enabled: bool,
}

#[derive(Debug)]
pub struct CodeGenerator<W>
where
    W: HtmlWriter,
{
    wr: W,
    config: CodegenConfig,
    ctx: Ctx,
    // For legacy `<plaintext>`
    is_plaintext: bool,
}

impl<W> CodeGenerator<W>
where
    W: HtmlWriter,
{
    pub fn new(wr: W, config: CodegenConfig) -> Self {
        CodeGenerator {
            wr,
            config,
            ctx: Default::default(),
            is_plaintext: false,
        }
    }

    #[emitter]
    fn emit_document(&mut self, n: &Document) -> Result {
        self.emit_list(&n.children, ListFormat::NotDelimited)?;
    }

    #[emitter]
    fn emit_document_fragment(&mut self, n: &DocumentFragment) -> Result {
        self.emit_list(&n.children, ListFormat::NotDelimited)?;
    }

    #[emitter]
    fn emit_child(&mut self, n: &Child) -> Result {
        match n {
            Child::DocumentType(n) => emit!(self, n),
            Child::Element(n) => emit!(self, n),
            Child::Text(n) => emit!(self, n),
            Child::Comment(n) => emit!(self, n),
        }
    }

    #[emitter]
    fn emit_document_doctype(&mut self, n: &DocumentType) -> Result {
        let mut doctype = String::new();

        doctype.push('<');
        doctype.push('!');

        if self.config.minify {
            doctype.push_str("doctype");
        } else {
            doctype.push_str("DOCTYPE");
        }

        if let Some(name) = &n.name {
            doctype.push(' ');
            doctype.push_str(name);
        }

        if let Some(public_id) = &n.public_id {
            doctype.push(' ');

            if self.config.minify {
                doctype.push_str("public");
            } else {
                doctype.push_str("PUBLIC");
            }

            doctype.push(' ');

            let public_id_quote = if public_id.contains('"') { '\'' } else { '"' };

            doctype.push(public_id_quote);
            doctype.push_str(public_id);
            doctype.push(public_id_quote);

            if let Some(system_id) = &n.system_id {
                doctype.push(' ');

                let system_id_quote = if system_id.contains('"') { '\'' } else { '"' };

                doctype.push(system_id_quote);
                doctype.push_str(system_id);
                doctype.push(system_id_quote);
            }
        } else if let Some(system_id) = &n.system_id {
            doctype.push(' ');

            if self.config.minify {
                doctype.push_str("system");
            } else {
                doctype.push_str("SYSTEM");
            }

            let system_id_quote = if system_id.contains('"') { '\'' } else { '"' };

            doctype.push(' ');
            doctype.push(system_id_quote);
            doctype.push_str(system_id);
            doctype.push(system_id_quote);
        }

        doctype.push('>');

        write_raw!(self, n.span, &doctype);
        formatting_newline!(self);
    }

    fn basic_emit_element(
        &mut self,
        n: &Element,
        parent: Option<&Element>,
        prev: Option<&Child>,
        next: Option<&Child>,
    ) -> Result {
        let has_attributes = !n.attributes.is_empty();
        let can_omit_start_tag = self.config.minify
            && !has_attributes
            && n.namespace == Namespace::HTML
            && match &*n.tag_name {
                // Tag omission in text/html:
                // An html element's start tag can be omitted if the first thing inside the html
                // element is not a comment.
                "html" if matches!(n.children.get(0), Some(Child::Comment(..))) => true,
                // A head element's start tag can be omitted if the element is empty, or if the
                // first thing inside the head element is an element.
                "head"
                    if n.children.is_empty()
                        || matches!(n.children.get(0), Some(Child::Element(..))) =>
                {
                    true
                }
                // A body element's start tag can be omitted if the element is empty, or if the
                // first thing inside the body element is not ASCII whitespace or a comment, except
                // if the first thing inside the body element is a meta, link, script, style, or
                // template element.
                // TODO improve me
                "body"
                    if n.children.is_empty()
                        || (match n.children.get(0) {
                            Some(Child::Text(text))
                                if text.value.chars().next().unwrap().is_ascii_whitespace() =>
                            {
                                false
                            }
                            Some(Child::Comment(..)) => false,
                            Some(Child::Element(Element {
                                namespace,
                                tag_name,
                                ..
                            })) if *namespace == Namespace::HTML
                                && matches!(
                                    &**tag_name,
                                    "meta" | "link" | "script" | "style" | "template"
                                ) =>
                            {
                                false
                            }
                            _ => true,
                        }) =>
                {
                    true
                }
                // A colgroup element's start tag can be omitted if the first thing inside the
                // colgroup element is a col element, and if the element is not immediately preceded
                // by another colgroup element whose end tag has been omitted. (It can't be omitted
                // if the element is empty.)
                "colgroup"
                    if match n.children.get(0) {
                        Some(Child::Element(element))
                            if element.namespace == Namespace::HTML
                                && &*element.tag_name == "col" =>
                        {
                            match prev {
                                // We don't need to check on omitted end tag, because we always
                                // omit an end tag
                                Some(Child::Element(element))
                                    if element.namespace == Namespace::HTML
                                        && &*element.tag_name == "colgroup" =>
                                {
                                    false
                                }
                                _ => true,
                            }
                        }
                        _ => false,
                    } =>
                {
                    true
                }
                // A tbody element's start tag can be omitted if the first thing inside the tbody
                // element is a tr element, and if the element is not immediately preceded by a
                // tbody, thead, or tfoot element whose end tag has been omitted. (It can't be
                // omitted if the element is empty.)
                "tbody"
                    if match n.children.get(0) {
                        Some(Child::Element(element))
                            if element.namespace == Namespace::HTML
                                && &*element.tag_name == "tr" =>
                        {
                            match prev {
                                // We don't need to check on omitted end tag, because we always
                                // omit an end tag
                                Some(Child::Element(element))
                                    if element.namespace == Namespace::HTML
                                        && matches!(
                                            &*element.tag_name,
                                            "tbody" | "thead" | "tfoot"
                                        ) =>
                                {
                                    false
                                }
                                _ => true,
                            }
                        }
                        _ => false,
                    } =>
                {
                    true
                }
                _ => false,
            };

        if !can_omit_start_tag {
            write_raw!(self, "<");
            write_raw!(self, &n.tag_name);

            if has_attributes {
                space!(self);

                self.emit_list(&n.attributes, ListFormat::SpaceDelimited)?;
            }

            write_raw!(self, ">");

            if !self.config.minify && n.namespace == Namespace::HTML && &*n.tag_name == "html" {
                newline!(self);
            }
        }

        let no_children = n.namespace == Namespace::HTML
            && matches!(
                &*n.tag_name,
                "area"
                    | "base"
                    | "basefont"
                    | "bgsound"
                    | "br"
                    | "col"
                    | "embed"
                    | "frame"
                    | "hr"
                    | "img"
                    | "input"
                    | "keygen"
                    | "link"
                    | "meta"
                    | "param"
                    | "source"
                    | "track"
                    | "wbr"
            );

        if no_children {
            return Ok(());
        }

        self.is_plaintext = matches!(&*n.tag_name, "plaintext");

        if let Some(content) = &n.content {
            emit!(self, content);
        } else if !n.children.is_empty() {
            let skip_escape_text = match &*n.tag_name {
                "style" | "script" | "xmp" | "iframe" | "noembed" | "noframes" => true,
                "noscript" => self.config.scripting_enabled,
                _ if self.is_plaintext => true,
                _ => false,
            };
            let need_extra_newline_in_text =
                n.namespace == Namespace::HTML && matches!(&*n.tag_name, "textarea" | "pre");

            let ctx = Ctx {
                skip_escape_text,
                need_extra_newline_in_text,
                ..self.ctx
            };

            if self.config.minify {
                self.with_ctx(ctx)
                    .emit_list_for_tag_omission(n, &n.children)?;
            } else {
                self.with_ctx(ctx)
                    .emit_list(&n.children, ListFormat::NotDelimited)?;
            }
        }

        let can_omit_end_tag = self.is_plaintext
            || (self.config.minify
                && n.namespace == Namespace::HTML
                && match &*n.tag_name {
                    // Tag omission in text/html:

                    // An html element's end tag can be omitted if the html element is not
                    // immediately followed by a comment.
                    //
                    // A body element's end tag can be omitted if the body element is not
                    // immediately followed by a comment.
                    "html" | "body" => !matches!(next, Some(Child::Comment(..))),
                    // A head element's end tag can be omitted if the head element is not
                    // immediately followed by ASCII whitespace or a comment.
                    "head" => match next {
                        Some(Child::Text(text))
                            if text.value.chars().next().unwrap().is_ascii_whitespace() =>
                        {
                            false
                        }
                        Some(Child::Comment(..)) => false,
                        _ => true,
                    },
                    // A p element's end tag can be omitted if the p element is immediately followed
                    // by an address, article, aside, blockquote, details, div, dl, fieldset,
                    // figcaption, figure, footer, form, h1, h2, h3, h4, h5, h6, header, hgroup, hr,
                    // main, menu, nav, ol, p, pre, section, table, or ul element, or if there is no
                    // more content in the parent element and the parent element is an HTML element
                    // that is not an a, audio, del, ins, map, noscript, or video element, or an
                    // autonomous custom element.
                    "p" => match next {
                        Some(Child::Element(Element {
                            namespace,
                            tag_name,
                            ..
                        })) if *namespace == Namespace::HTML
                            && matches!(
                                &**tag_name,
                                "address"
                                    | "article"
                                    | "aside"
                                    | "blockquote"
                                    | "details"
                                    | "div"
                                    | "dl"
                                    | "fieldset"
                                    | "figcaption"
                                    | "figure"
                                    | "footer"
                                    | "form"
                                    | "h1"
                                    | "h2"
                                    | "h3"
                                    | "h4"
                                    | "h5"
                                    | "h6"
                                    | "header"
                                    | "hgroup"
                                    | "hr"
                                    | "main"
                                    | "menu"
                                    | "nav"
                                    | "ol"
                                    | "p"
                                    | "pre"
                                    | "section"
                                    | "table"
                                    | "ul"
                            ) =>
                        {
                            true
                        }
                        None if match parent {
                            Some(Element {
                                namespace,
                                tag_name,
                                ..
                            }) if is_html_tag_name(*namespace, &**tag_name)
                                && !matches!(
                                    &**tag_name,
                                    "a" | "audio" | "del" | "ins" | "map" | "noscript" | "video"
                                ) =>
                            {
                                true
                            }
                            _ => false,
                        } =>
                        {
                            true
                        }
                        _ => false,
                    },
                    // An li element's end tag can be omitted if the li element is immediately
                    // followed by another li element or if there is no more content in the parent
                    // element.
                    "li" => match next {
                        Some(Child::Element(Element {
                            namespace,
                            tag_name,
                            ..
                        })) if *namespace == Namespace::HTML && tag_name == "li" => true,
                        None => true,
                        _ => false,
                    },
                    // A dt element's end tag can be omitted if the dt element is immediately
                    // followed by another dt element or a dd element.
                    "dt" => match next {
                        Some(Child::Element(Element {
                            namespace,
                            tag_name,
                            ..
                        })) if *namespace == Namespace::HTML
                            && (tag_name == "dt" || tag_name == "dd") =>
                        {
                            true
                        }
                        _ => false,
                    },
                    // A dd element's end tag can be omitted if the dd element is immediately
                    // followed by another dd element or a dt element, or if there is no more
                    // content in the parent element.
                    "dd" => match next {
                        Some(Child::Element(Element {
                            namespace,
                            tag_name,
                            ..
                        })) if *namespace == Namespace::HTML
                            && (tag_name == "dd" || tag_name == "dt") =>
                        {
                            true
                        }
                        None => true,
                        _ => false,
                    },
                    // An rt element's end tag can be omitted if the rt element is immediately
                    // followed by an rt or rp element, or if there is no more content in the parent
                    // element.
                    //
                    // An rp element's end tag can be omitted if the rp element is immediately
                    // followed by an rt or rp element, or if there is no more content in the parent
                    // element.
                    "rt" | "rp" => match next {
                        Some(Child::Element(Element {
                            namespace,
                            tag_name,
                            ..
                        })) if *namespace == Namespace::HTML
                            && (tag_name == "rt" || tag_name == "rp") =>
                        {
                            true
                        }
                        None => true,
                        _ => false,
                    },
                    // The end tag can be omitted if the element is immediately followed by an <rt>,
                    // <rtc>, or <rp> element or another <rb> element, or if there is no more
                    // content in the parent element.
                    "rb" => match next {
                        Some(Child::Element(Element {
                            namespace,
                            tag_name,
                            ..
                        })) if *namespace == Namespace::HTML
                            && (tag_name == "rt"
                                || tag_name == "rtc"
                                || tag_name == "rp"
                                || tag_name == "rb") =>
                        {
                            true
                        }
                        None => true,
                        _ => false,
                    },
                    // 	The closing tag can be omitted if it is immediately followed by a <rb>, <rtc>
                    // or <rt> element opening tag or by its parent closing tag.
                    "rtc" => match next {
                        Some(Child::Element(Element {
                            namespace,
                            tag_name,
                            ..
                        })) if *namespace == Namespace::HTML
                            && (tag_name == "rb" || tag_name == "rtc" || tag_name == "rt") =>
                        {
                            true
                        }
                        None => true,
                        _ => false,
                    },
                    // An optgroup element's end tag can be omitted if the optgroup element is
                    // immediately followed by another optgroup element, or if there is no more
                    // content in the parent element.
                    "optgroup" => match next {
                        Some(Child::Element(Element {
                            namespace,
                            tag_name,
                            ..
                        })) if *namespace == Namespace::HTML && tag_name == "optgroup" => true,
                        None => true,
                        _ => false,
                    },
                    // An option element's end tag can be omitted if the option element is
                    // immediately followed by another option element, or if it is immediately
                    // followed by an optgroup element, or if there is no more content in the parent
                    // element.
                    "option" => match next {
                        Some(Child::Element(Element {
                            namespace,
                            tag_name,
                            ..
                        })) if *namespace == Namespace::HTML
                            && (tag_name == "option" || tag_name == "optgroup") =>
                        {
                            true
                        }
                        None => true,
                        _ => false,
                    },
                    // A caption element's end tag can be omitted if the caption element is not
                    // immediately followed by ASCII whitespace or a comment.
                    //
                    // A colgroup element's end tag can be omitted if the colgroup element is not
                    // immediately followed by ASCII whitespace or a comment.
                    "caption" | "colgroup" => match next {
                        Some(Child::Text(text))
                            if text.value.chars().next().unwrap().is_ascii_whitespace() =>
                        {
                            false
                        }
                        Some(Child::Comment(..)) => false,
                        _ => true,
                    },
                    // A tbody element's end tag can be omitted if the tbody element is immediately
                    // followed by a tbody or tfoot element, or if there is no more content in the
                    // parent element.
                    "tbody" => match next {
                        Some(Child::Element(Element {
                            namespace,
                            tag_name,
                            ..
                        })) if *namespace == Namespace::HTML
                            && (tag_name == "tbody" || tag_name == "tfoot") =>
                        {
                            true
                        }
                        None => true,
                        _ => false,
                    },
                    // A thead element's end tag can be omitted if the thead element is immediately
                    // followed by a tbody or tfoot element.
                    "thead" => match next {
                        Some(Child::Element(Element {
                            namespace,
                            tag_name,
                            ..
                        })) if *namespace == Namespace::HTML
                            && (tag_name == "tbody" || tag_name == "tfoot") =>
                        {
                            true
                        }
                        _ => false,
                    },
                    // A tfoot element's end tag can be omitted if there is no more content in the
                    // parent element.
                    "tfoot" => matches!(next, None),
                    // A tr element's end tag can be omitted if the tr element is immediately
                    // followed by another tr element, or if there is no more content in the parent
                    // element.
                    "tr" => match next {
                        Some(Child::Element(Element {
                            namespace,
                            tag_name,
                            ..
                        })) if *namespace == Namespace::HTML && tag_name == "tr" => true,
                        None => true,
                        _ => false,
                    },
                    // A th element's end tag can be omitted if the th element is immediately
                    // followed by a td or th element, or if there is no more content in the parent
                    // element.
                    "td" | "th" => match next {
                        Some(Child::Element(Element {
                            namespace,
                            tag_name,
                            ..
                        })) if *namespace == Namespace::HTML
                            && (tag_name == "td" || tag_name == "th") =>
                        {
                            true
                        }
                        None => true,
                        _ => false,
                    },
                    _ => false,
                });

        if can_omit_end_tag {
            return Ok(());
        }

        write_raw!(self, "<");
        write_raw!(self, "/");
        write_raw!(self, &n.tag_name);
        write_raw!(self, ">");

        Ok(())
    }

    #[emitter]
    fn emit_element(&mut self, n: &Element) -> Result {
        self.basic_emit_element(n, None, None, None)?;
    }

    #[emitter]
    fn emit_attribute(&mut self, n: &Attribute) -> Result {
        let mut attribute = String::new();

        if let Some(prefix) = &n.prefix {
            attribute.push_str(prefix);
            attribute.push(':');
        }

        attribute.push_str(&n.name);

        if let Some(value) = &n.value {
            attribute.push('=');

            if self.config.minify {
                let minifier = minify_attribute_value(value);

                attribute.push_str(&minifier);
            } else {
                let normalized = normalize_attribute_value(value);

                attribute.push_str(&normalized);
            }
        }

        write_str!(self, n.span, &attribute);
    }

    #[emitter]
    fn emit_text(&mut self, n: &Text) -> Result {
        if self.ctx.skip_escape_text {
            write_str!(self, n.span, &n.value);
        } else {
            let mut data = String::with_capacity(n.value.len());

            if self.ctx.need_extra_newline_in_text && n.value.contains('\n') {
                data.push('\n');
            }

            if self.config.minify {
                data.push_str(&minify_text(&n.value));
            } else {
                data.push_str(&escape_string(&n.value, false));
            }

            write_str!(self, n.span, &data);
        }
    }

    #[emitter]
    fn emit_comment(&mut self, n: &Comment) -> Result {
        let mut comment = String::with_capacity(n.data.len() + 7);

        comment.push_str("<!--");
        comment.push_str(&n.data);
        comment.push_str("-->");

        write_str!(self, n.span, &comment);
    }

    #[emitter]
    fn emit_token_and_span(&mut self, n: &TokenAndSpan) -> Result {
        let span = n.span;

        match &n.token {
            Token::Doctype {
                raw_keyword,
                name,
                raw_name,
                public_quote,
                raw_public_keyword,
                public_id,
                raw_system_keyword,
                system_quote,
                system_id,
                ..
            } => {
                let mut doctype = String::new();

                doctype.push('<');
                doctype.push('!');

                if let Some(raw_keyword) = &raw_keyword {
                    doctype.push_str(raw_keyword);
                } else {
                    doctype.push_str("DOCTYPE");
                }

                if let Some(raw_name) = &raw_name {
                    doctype.push(' ');
                    doctype.push_str(raw_name);
                } else if let Some(name) = &name {
                    doctype.push(' ');
                    doctype.push_str(name);
                }

                if let Some(public_id) = &public_id {
                    doctype.push(' ');

                    match raw_public_keyword {
                        Some(raw_public_keyword) => {
                            doctype.push_str(raw_public_keyword);
                            doctype.push(' ');
                        }
                        _ => {
                            doctype.push_str("PUBLIC");
                            doctype.push(' ');
                        }
                    }

                    match public_quote {
                        Some(public_quote) => {
                            doctype.push(*public_quote);
                        }
                        _ => {
                            doctype.push('"');
                        }
                    }

                    doctype.push_str(public_id);

                    match public_quote {
                        Some(public_quote) => {
                            doctype.push(*public_quote);
                        }
                        _ => {
                            doctype.push('"');
                        }
                    }

                    if let Some(system_id) = &system_id {
                        doctype.push(' ');

                        match system_quote {
                            Some(system_quote) => {
                                doctype.push(*system_quote);
                            }
                            _ => {
                                doctype.push('"');
                            }
                        }

                        doctype.push_str(system_id);

                        match system_quote {
                            Some(system_quote) => {
                                doctype.push(*system_quote);
                            }
                            _ => {
                                doctype.push('"');
                            }
                        }
                    }
                } else if let Some(system_id) = &system_id {
                    doctype.push(' ');

                    match raw_system_keyword {
                        Some(raw_system_keyword) => {
                            doctype.push_str(raw_system_keyword);
                            doctype.push(' ');
                        }
                        _ => {
                            doctype.push_str("SYSTEM");
                            doctype.push(' ');
                        }
                    }

                    match system_quote {
                        Some(system_quote) => {
                            doctype.push(*system_quote);
                        }
                        _ => {
                            doctype.push('"');
                        }
                    }

                    doctype.push_str(system_id);

                    match system_quote {
                        Some(system_quote) => {
                            doctype.push(*system_quote);
                        }
                        _ => {
                            doctype.push('"');
                        }
                    }
                }

                doctype.push('>');

                write_raw!(self, span, &doctype);
            }
            Token::StartTag {
                tag_name,
                raw_tag_name,
                attributes,
                self_closing,
            } => {
                let mut start_tag = String::new();

                start_tag.push('<');

                match raw_tag_name {
                    Some(raw_tag_name) => {
                        start_tag.push_str(raw_tag_name);
                    }
                    _ => {
                        start_tag.push_str(tag_name);
                    }
                }

                for attribute in attributes {
                    start_tag.push(' ');

                    match &attribute.raw_name {
                        Some(raw_name) => {
                            start_tag.push_str(raw_name);
                        }
                        _ => {
                            start_tag.push_str(&attribute.name);
                        }
                    }
                    if let Some(raw_value) = &attribute.raw_value {
                        start_tag.push('=');

                        start_tag.push_str(raw_value);
                    } else if let Some(value) = &attribute.value {
                        start_tag.push('=');

                        let quote = if value.contains('"') { '\'' } else { '"' };

                        start_tag.push(quote);
                        start_tag.push_str(value);
                        start_tag.push(quote);
                    }
                }

                if *self_closing {
                    start_tag.push('/');
                }

                start_tag.push('>');

                write_raw!(self, span, &start_tag);
            }
            Token::EndTag {
                tag_name,
                raw_tag_name,
                attributes,
                ..
            } => {
                let mut start_tag = String::new();

                start_tag.push_str("</");

                match raw_tag_name {
                    Some(raw_tag_name) => {
                        start_tag.push_str(raw_tag_name);
                    }
                    _ => {
                        start_tag.push_str(tag_name);
                    }
                }

                for attribute in attributes {
                    start_tag.push(' ');

                    match &attribute.raw_name {
                        Some(raw_name) => {
                            start_tag.push_str(raw_name);
                        }
                        _ => {
                            start_tag.push_str(&attribute.name);
                        }
                    }

                    if let Some(raw_value) = &attribute.raw_value {
                        start_tag.push('=');

                        start_tag.push_str(raw_value);
                    } else if let Some(value) = &attribute.value {
                        start_tag.push('=');

                        let quote = if value.contains('"') { '\'' } else { '"' };

                        start_tag.push(quote);
                        start_tag.push_str(value);
                        start_tag.push(quote);
                    }
                }

                start_tag.push('>');

                write_str!(self, span, &start_tag);
            }
            Token::Comment { data } => {
                let mut comment = String::new();

                comment.push_str("<!--");
                comment.push_str(data);
                comment.push_str("-->");

                write_str!(self, span, &comment);
            }
            Token::Character { value, .. } => {
                let new_value = match value {
                    '&' => String::from("&amp;"),
                    '<' => String::from("&lt;"),
                    '>' => String::from("&gt;"),
                    '\u{00A0}' => String::from("&nbsp;"),
                    _ => value.to_string(),
                };

                write_str!(self, span, &new_value);
            }
            Token::Eof => {}
        }
    }

    fn emit_list<N>(&mut self, nodes: &[N], format: ListFormat) -> Result
    where
        Self: Emit<N>,
        N: Spanned,
    {
        for (idx, node) in nodes.iter().enumerate() {
            if idx != 0 {
                self.write_delim(format)?;

                if format & ListFormat::LinesMask == ListFormat::MultiLine {
                    formatting_newline!(self);
                }
            }

            emit!(self, node)
        }

        Ok(())
    }

    fn emit_list_for_tag_omission(&mut self, parent: &Element, nodes: &[Child]) -> Result {
        for (idx, node) in nodes.iter().enumerate() {
            match node {
                Child::Element(element) => {
                    let prev = if idx > 0 { nodes.get(idx - 1) } else { None };
                    let next = nodes.get(idx + 1);

                    self.basic_emit_element(element, Some(parent), prev, next)?;
                }
                _ => {
                    emit!(self, node)
                }
            }
        }

        Ok(())
    }

    fn write_delim(&mut self, f: ListFormat) -> Result {
        match f & ListFormat::DelimitersMask {
            ListFormat::None => {}
            ListFormat::SpaceDelimited => {
                space!(self)
            }
            _ => unreachable!(),
        }

        Ok(())
    }
}

fn minify_attribute_value(value: &str) -> String {
    if value.is_empty() {
        return "\"\"".to_string();
    }

    let mut minified = String::with_capacity(value.len());

    let mut unquoted = true;
    let mut dq = 0;
    let mut sq = 0;

    for c in value.chars() {
        match c {
            '&' => {
                minified.push_str("&amp;");

                continue;
            }
            c if c.is_ascii_whitespace() => {
                unquoted = false;
            }
            '`' | '=' | '<' | '>' => {
                unquoted = false;
            }
            '"' => {
                unquoted = false;
                dq += 1;
            }
            '\'' => {
                unquoted = false;
                sq += 1;
            }

            _ => {}
        };

        minified.push(c);
    }

    if unquoted {
        return minified;
    }

    if dq > sq {
        format!("'{}'", minified)
    } else {
        format!("\"{}\"", minified)
    }
}

fn normalize_attribute_value(value: &str) -> String {
    if value.is_empty() {
        return "\"\"".to_string();
    }

    let mut normalized = String::with_capacity(value.len() + 2);

    normalized.push('"');
    normalized.push_str(&escape_string(value, true));
    normalized.push('"');

    normalized
}

fn minify_text(value: &str) -> String {
    let mut result = String::with_capacity(value.len());

    for c in value.chars() {
        match c {
            '&' => {
                result.push_str("&amp;");
            }
            '<' => {
                result.push_str("&lt;");
            }
            _ => result.push(c),
        }
    }

    result
}

// Escaping a string (for the purposes of the algorithm above) consists of
// running the following steps:
//
// 1. Replace any occurrence of the "&" character by the string "&amp;".
//
// 2. Replace any occurrences of the U+00A0 NO-BREAK SPACE character by the
// string "&nbsp;".
//
// 3. If the algorithm was invoked in the attribute mode, replace any
// occurrences of the """ character by the string "&quot;".
//
// 4. If the algorithm was not invoked in the attribute mode, replace any
// occurrences of the "<" character by the string "&lt;", and any occurrences of
// the ">" character by the string "&gt;".
fn escape_string(value: &str, is_attribute_mode: bool) -> String {
    let mut result = String::with_capacity(value.len());

    for c in value.chars() {
        match c {
            '&' => {
                result.push_str("&amp;");
            }
            '\u{00A0}' => result.push_str("&nbsp;"),
            '"' if is_attribute_mode => result.push_str("&quot;"),
            '<' if !is_attribute_mode => {
                result.push_str("&lt;");
            }
            '>' if !is_attribute_mode => {
                result.push_str("&gt;");
            }
            _ => result.push(c),
        }
    }

    result
}

fn is_html_tag_name(namespace: Namespace, tag_name: &str) -> bool {
    if namespace != Namespace::HTML {
        return false;
    }

    matches!(
        tag_name,
        "a" | "abbr"
            | "address"
            | "applet"
            | "area"
            | "article"
            | "aside"
            | "audio"
            | "b"
            | "base"
            | "bdi"
            | "bdo"
            | "blockquote"
            | "body"
            | "br"
            | "button"
            | "canvas"
            | "caption"
            | "center"
            | "cite"
            | "code"
            | "col"
            | "colgroup"
            | "data"
            | "datalist"
            | "dd"
            | "del"
            | "details"
            | "dfn"
            | "dialog"
            | "dir"
            | "div"
            | "dl"
            | "dt"
            | "em"
            | "embed"
            | "fieldset"
            | "figcaption"
            | "figure"
            | "footer"
            | "form"
            | "h1"
            | "h2"
            | "h3"
            | "h4"
            | "h5"
            | "h6"
            | "head"
            | "header"
            | "hgroup"
            | "hr"
            | "html"
            | "i"
            | "iframe"
            | "image"
            | "img"
            | "input"
            | "ins"
            | "label"
            | "legend"
            | "li"
            | "link"
            | "listing"
            | "main"
            | "map"
            | "mark"
            | "marquee"
            | "menu"
            | "menuitem"
            | "meta"
            | "meter"
            | "nav"
            | "nobr"
            | "noembed"
            | "noscript"
            | "object"
            | "ol"
            | "optgroup"
            | "option"
            | "output"
            | "p"
            | "param"
            | "picture"
            | "pre"
            | "progress"
            | "q"
            | "rb"
            | "rp"
            | "rt"
            | "rtc"
            | "ruby"
            | "s"
            | "samp"
            | "script"
            | "section"
            | "select"
            | "small"
            | "source"
            | "span"
            | "strong"
            | "style"
            | "sub"
            | "summary"
            | "sup"
            | "table"
            | "tbody"
            | "td"
            | "template"
            | "textarea"
            | "tfoot"
            | "th"
            | "thead"
            | "time"
            | "title"
            | "tr"
            | "track"
            | "u"
            | "ul"
            | "var"
            | "video"
            | "wbr"
            | "xmp"
    )
}
