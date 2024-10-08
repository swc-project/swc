#![deny(clippy::all)]
#![allow(clippy::needless_update)]
#![allow(clippy::match_like_matches_macro)]
#![allow(non_local_definitions)]

pub use std::fmt::Result;
use std::{borrow::Cow, iter::Peekable, str::Chars};

use swc_atoms::JsWord;
use swc_common::Spanned;
use swc_html_ast::*;
use swc_html_codegen_macros::emitter;
use swc_html_utils::HTML_ENTITIES;
use writer::HtmlWriter;

pub use self::emit::*;
use self::{ctx::Ctx, list::ListFormat};

#[macro_use]
mod macros;
mod ctx;
mod emit;
mod list;
pub mod writer;

#[derive(Debug, Clone, Default)]
pub struct CodegenConfig<'a> {
    pub minify: bool,
    pub scripting_enabled: bool,
    /// Should be used only for `DocumentFragment` code generation
    pub context_element: Option<&'a Element>,
    /// Don't print optional tags (only when `minify` enabled)
    /// By default `true` when `minify` enabled, otherwise `false`
    pub tag_omission: Option<bool>,
    /// Making SVG and MathML elements self-closing where possible (only when
    /// `minify` enabled) By default `false` when `minify` enabled,
    /// otherwise `true`
    pub self_closing_void_elements: Option<bool>,
    /// Always print quotes or remove them where possible (only when `minify`
    /// enabled) By default `false` when `minify` enabled, otherwise `true`
    pub quotes: Option<bool>,
}

enum TagOmissionParent<'a> {
    Document(&'a Document),
    DocumentFragment(&'a DocumentFragment),
    Element(&'a Element),
}

#[derive(Debug)]
pub struct CodeGenerator<'a, W>
where
    W: HtmlWriter,
{
    wr: W,
    config: CodegenConfig<'a>,
    ctx: Ctx,
    // For legacy `<plaintext>`
    is_plaintext: bool,
    tag_omission: bool,
    self_closing_void_elements: bool,
    quotes: bool,
}

impl<'a, W> CodeGenerator<'a, W>
where
    W: HtmlWriter,
{
    pub fn new(wr: W, config: CodegenConfig<'a>) -> Self {
        let tag_omission = config.tag_omission.unwrap_or(config.minify);
        let self_closing_void_elements = config.tag_omission.unwrap_or(!config.minify);
        let quotes = config.quotes.unwrap_or(!config.minify);

        CodeGenerator {
            wr,
            config,
            ctx: Default::default(),
            is_plaintext: false,
            tag_omission,
            self_closing_void_elements,
            quotes,
        }
    }

    #[emitter]
    fn emit_document(&mut self, n: &Document) -> Result {
        if self.tag_omission {
            self.emit_list_for_tag_omission(TagOmissionParent::Document(n))?;
        } else {
            self.emit_list(&n.children, ListFormat::NotDelimited)?;
        }
    }

    #[emitter]
    fn emit_document_fragment(&mut self, n: &DocumentFragment) -> Result {
        let ctx = if let Some(context_element) = &self.config.context_element {
            self.create_context_for_element(context_element)
        } else {
            Default::default()
        };

        if self.tag_omission {
            self.with_ctx(ctx)
                .emit_list_for_tag_omission(TagOmissionParent::DocumentFragment(n))?;
        } else {
            self.with_ctx(ctx)
                .emit_list(&n.children, ListFormat::NotDelimited)?;
        }
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
        let mut doctype = String::with_capacity(
            10 + if let Some(name) = &n.name {
                name.len() + 1
            } else {
                0
            } + if let Some(public_id) = &n.public_id {
                let mut len = public_id.len() + 10;

                if let Some(system_id) = &n.system_id {
                    len += system_id.len() + 3
                }

                len
            } else if let Some(system_id) = &n.system_id {
                system_id.len() + 10
            } else {
                0
            },
        );

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

            doctype.push(' ');

            let system_id_quote = if system_id.contains('"') { '\'' } else { '"' };

            doctype.push(system_id_quote);
            doctype.push_str(system_id);
            doctype.push(system_id_quote);
        }

        doctype.push('>');

        write_multiline_raw!(self, n.span, &doctype);
        formatting_newline!(self);
    }

    fn basic_emit_element(
        &mut self,
        n: &Element,
        parent: Option<&Element>,
        prev: Option<&Child>,
        next: Option<&Child>,
    ) -> Result {
        if self.is_plaintext {
            return Ok(());
        }

        let has_attributes = !n.attributes.is_empty();
        let can_omit_start_tag = self.tag_omission
            && !has_attributes
            && n.namespace == Namespace::HTML
            && match &*n.tag_name {
                // Tag omission in text/html:
                // An html element's start tag can be omitted if the first thing inside the html
                // element is not a comment.
                "html" if !matches!(n.children.first(), Some(Child::Comment(..))) => true,
                // A head element's start tag can be omitted if the element is empty, or if the
                // first thing inside the head element is an element.
                "head"
                    if n.children.is_empty()
                        || matches!(n.children.first(), Some(Child::Element(..))) =>
                {
                    true
                }
                // A body element's start tag can be omitted if the element is empty, or if the
                // first thing inside the body element is not ASCII whitespace or a comment, except
                // if the first thing inside the body element would be parsed differently outside.
                "body"
                    if n.children.is_empty()
                        || (match n.children.first() {
                            Some(Child::Text(text))
                                if text.data.len() > 0
                                    && text.data.chars().next().unwrap().is_ascii_whitespace() =>
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
                                    "base"
                                        | "basefont"
                                        | "bgsound"
                                        | "frameset"
                                        | "link"
                                        | "meta"
                                        | "noframes"
                                        | "noscript"
                                        | "script"
                                        | "style"
                                        | "template"
                                        | "title"
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
                    if match n.children.first() {
                        Some(Child::Element(element))
                            if element.namespace == Namespace::HTML
                                && element.tag_name == "col" =>
                        {
                            !matches!(prev, Some(Child::Element(element)) if element.namespace == Namespace::HTML
                                        && element.tag_name == "colgroup")
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
                    if match n.children.first() {
                        Some(Child::Element(element))
                            if element.namespace == Namespace::HTML && element.tag_name == "tr" =>
                        {
                            !matches!(prev, Some(Child::Element(element)) if element.namespace == Namespace::HTML
                            && matches!(
                                &*element.tag_name,
                                "tbody" | "thead" | "tfoot"
                            ))
                        }
                        _ => false,
                    } =>
                {
                    true
                }
                _ => false,
            };

        let is_void_element = match n.namespace {
            Namespace::HTML => matches!(
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
            ),
            Namespace::SVG => n.children.is_empty(),
            Namespace::MATHML => n.children.is_empty(),
            _ => false,
        };

        if !can_omit_start_tag {
            write_raw!(self, "<");
            write_raw!(self, &n.tag_name);

            if has_attributes {
                space!(self);

                self.emit_list(&n.attributes, ListFormat::SpaceDelimited)?;
            }

            if (matches!(n.namespace, Namespace::SVG | Namespace::MATHML) && is_void_element)
                || (self.self_closing_void_elements
                    && n.is_self_closing
                    && is_void_element
                    && matches!(n.namespace, Namespace::HTML))
            {
                if self.config.minify {
                    let need_space = match n.attributes.last() {
                        Some(Attribute {
                            value: Some(value), ..
                        }) => !value.chars().any(|c| match c {
                            c if c.is_ascii_whitespace() => true,
                            '`' | '=' | '<' | '>' | '"' | '\'' => true,
                            _ => false,
                        }),
                        _ => false,
                    };

                    if need_space {
                        write_raw!(self, " ");
                    }
                } else {
                    write_raw!(self, " ");
                }

                write_raw!(self, "/");
            }

            write_raw!(self, ">");

            if !self.config.minify && n.namespace == Namespace::HTML && n.tag_name == "html" {
                newline!(self);
            }
        }

        if is_void_element {
            return Ok(());
        }

        if !self.is_plaintext {
            self.is_plaintext = matches!(&*n.tag_name, "plaintext");
        }

        if let Some(content) = &n.content {
            emit!(self, content);
        } else if !n.children.is_empty() {
            let ctx = self.create_context_for_element(n);

            let need_extra_newline =
                n.namespace == Namespace::HTML && matches!(&*n.tag_name, "textarea" | "pre");

            if need_extra_newline {
                if let Some(Child::Text(Text { data, .. })) = &n.children.first() {
                    if data.contains('\n') {
                        newline!(self);
                    } else {
                        formatting_newline!(self);
                    }
                }
            }

            if self.tag_omission {
                self.with_ctx(ctx)
                    .emit_list_for_tag_omission(TagOmissionParent::Element(n))?;
            } else {
                self.with_ctx(ctx)
                    .emit_list(&n.children, ListFormat::NotDelimited)?;
            }
        }

        let can_omit_end_tag = self.is_plaintext
            || (self.tag_omission
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
                            if text.data.chars().next().unwrap().is_ascii_whitespace() =>
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
                            }) if is_html_tag_name(*namespace, tag_name)
                                && !matches!(
                                    &**tag_name,
                                    "a" | "audio"
                                        | "acronym"
                                        | "big"
                                        | "del"
                                        | "font"
                                        | "ins"
                                        | "tt"
                                        | "strike"
                                        | "map"
                                        | "noscript"
                                        | "video"
                                        | "kbd"
                                        | "rbc"
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
                    "li" if match parent {
                        Some(Element {
                            namespace,
                            tag_name,
                            ..
                        }) if *namespace == Namespace::HTML
                            && matches!(&**tag_name, "ul" | "ol" | "menu") =>
                        {
                            true
                        }
                        _ => false,
                    } =>
                    {
                        match next {
                            Some(Child::Element(Element {
                                namespace,
                                tag_name,
                                ..
                            })) if *namespace == Namespace::HTML && *tag_name == "li" => true,
                            None => true,
                            _ => false,
                        }
                    }
                    // A dt element's end tag can be omitted if the dt element is immediately
                    // followed by another dt element or a dd element.
                    "dt" => match next {
                        Some(Child::Element(Element {
                            namespace,
                            tag_name,
                            ..
                        })) if *namespace == Namespace::HTML
                            && (*tag_name == "dt" || *tag_name == "dd") =>
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
                            && (*tag_name == "dd" || *tag_name == "dt") =>
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
                            && (*tag_name == "rt" || *tag_name == "rp") =>
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
                            && (*tag_name == "rt"
                                || *tag_name == "rtc"
                                || *tag_name == "rp"
                                || *tag_name == "rb") =>
                        {
                            true
                        }
                        None => true,
                        _ => false,
                    },
                    // 	The closing tag can be omitted if it is immediately followed by a <rb>,
                    // <rtc> or <rt> element opening tag or by its parent
                    // closing tag.
                    "rtc" => match next {
                        Some(Child::Element(Element {
                            namespace,
                            tag_name,
                            ..
                        })) if *namespace == Namespace::HTML
                            && (*tag_name == "rb" || *tag_name == "rtc" || *tag_name == "rt") =>
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
                        })) if *namespace == Namespace::HTML && *tag_name == "optgroup" => true,
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
                            && (*tag_name == "option" || *tag_name == "optgroup") =>
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
                            if text.data.chars().next().unwrap().is_ascii_whitespace() =>
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
                            && (*tag_name == "tbody" || *tag_name == "tfoot") =>
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
                            && (*tag_name == "tbody" || *tag_name == "tfoot") =>
                        {
                            true
                        }
                        _ => false,
                    },
                    // A tfoot element's end tag can be omitted if there is no more content in the
                    // parent element.
                    "tfoot" => next.is_none(),
                    // A tr element's end tag can be omitted if the tr element is immediately
                    // followed by another tr element, or if there is no more content in the parent
                    // element.
                    "tr" => match next {
                        Some(Child::Element(Element {
                            namespace,
                            tag_name,
                            ..
                        })) if *namespace == Namespace::HTML && *tag_name == "tr" => true,
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
                            && (*tag_name == "td" || *tag_name == "th") =>
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
        let mut attribute = String::with_capacity(
            if let Some(prefix) = &n.prefix {
                prefix.len() + 1
            } else {
                0
            } + n.name.len()
                + if let Some(value) = &n.value {
                    value.len() + 1
                } else {
                    0
                },
        );

        if let Some(prefix) = &n.prefix {
            attribute.push_str(prefix);
            attribute.push(':');
        }

        attribute.push_str(&n.name);

        if let Some(value) = &n.value {
            attribute.push('=');

            if self.config.minify {
                let (minifier, quote) = minify_attribute_value(value, self.quotes);

                if let Some(quote) = quote {
                    attribute.push(quote);
                }

                attribute.push_str(&minifier);

                if let Some(quote) = quote {
                    attribute.push(quote);
                }
            } else {
                let normalized = escape_string(value, true);

                attribute.push('"');
                attribute.push_str(&normalized);
                attribute.push('"');
            }
        }

        write_multiline_raw!(self, n.span, &attribute);
    }

    #[emitter]
    fn emit_text(&mut self, n: &Text) -> Result {
        if self.ctx.need_escape_text {
            if self.config.minify {
                write_multiline_raw!(self, n.span, &minify_text(&n.data));
            } else {
                write_multiline_raw!(self, n.span, &escape_string(&n.data, false));
            }
        } else {
            write_multiline_raw!(self, n.span, &n.data);
        }
    }

    #[emitter]
    fn emit_comment(&mut self, n: &Comment) -> Result {
        let mut comment = String::with_capacity(n.data.len() + 7);

        comment.push_str("<!--");
        comment.push_str(&n.data);
        comment.push_str("-->");

        write_multiline_raw!(self, n.span, &comment);
    }

    fn create_context_for_element(&self, n: &Element) -> Ctx {
        let need_escape_text = match &*n.tag_name {
            "style" | "script" | "xmp" | "iframe" | "noembed" | "noframes" | "plaintext" => false,
            "noscript" => !self.config.scripting_enabled,
            _ if self.is_plaintext => false,
            _ => true,
        };

        Ctx {
            need_escape_text,
            ..self.ctx
        }
    }

    fn emit_list_for_tag_omission(&mut self, parent: TagOmissionParent) -> Result {
        let nodes = match &parent {
            TagOmissionParent::Document(document) => &document.children,
            TagOmissionParent::DocumentFragment(document_fragment) => &document_fragment.children,
            TagOmissionParent::Element(element) => &element.children,
        };
        let parent = match parent {
            TagOmissionParent::Element(element) => Some(element),
            _ => None,
        };

        for (idx, node) in nodes.iter().enumerate() {
            match node {
                Child::Element(element) => {
                    let prev = if idx > 0 { nodes.get(idx - 1) } else { None };
                    let next = nodes.get(idx + 1);

                    self.basic_emit_element(element, parent, prev, next)?;
                }
                _ => {
                    emit!(self, node)
                }
            }
        }

        Ok(())
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

#[allow(clippy::unused_peekable)]
fn minify_attribute_value(value: &str, quotes: bool) -> (Cow<'_, str>, Option<char>) {
    if value.is_empty() {
        return (Cow::Borrowed(value), Some('"'));
    }

    // Fast-path
    if !quotes
        && value.chars().all(|c| match c {
            '&' | '`' | '=' | '<' | '>' | '"' | '\'' => false,
            c if c.is_ascii_whitespace() => false,
            _ => true,
        })
    {
        return (Cow::Borrowed(value), None);
    }

    let mut minified = String::with_capacity(value.len());

    let mut unquoted = true;
    let mut dq = 0;
    let mut sq = 0;

    let mut chars = value.chars().peekable();

    while let Some(c) = chars.next() {
        match c {
            '&' => {
                let next = chars.next();

                if let Some(next) = next {
                    if matches!(next, '#' | 'a'..='z' | 'A'..='Z') {
                        minified.push_str(&minify_amp(next, &mut chars));
                    } else {
                        minified.push('&');
                        minified.push(next);
                    }
                } else {
                    minified.push('&');
                }

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

    if !quotes && unquoted {
        return (Cow::Owned(minified), None);
    }

    if dq > sq {
        (Cow::Owned(minified.replace('\'', "&apos;")), Some('\''))
    } else {
        (Cow::Owned(minified.replace('"', "&quot;")), Some('"'))
    }
}

#[allow(clippy::unused_peekable)]
fn minify_text(value: &str) -> Cow<'_, str> {
    // Fast-path
    if value.is_empty() {
        return Cow::Borrowed(value);
    }

    // Fast-path
    if value.chars().all(|c| match c {
        '&' | '<' => false,
        _ => true,
    }) {
        return Cow::Borrowed(value);
    }

    let mut result = String::with_capacity(value.len());
    let mut chars = value.chars().peekable();

    while let Some(c) = chars.next() {
        match c {
            '&' => {
                let next = chars.next();

                if let Some(next) = next {
                    if matches!(next, '#' | 'a'..='z' | 'A'..='Z') {
                        result.push_str(&minify_amp(next, &mut chars));
                    } else {
                        result.push('&');
                        result.push(next);
                    }
                } else {
                    result.push('&');
                }
            }
            '<' => {
                result.push_str("&lt;");
            }
            _ => result.push(c),
        }
    }

    Cow::Owned(result)
}

fn minify_amp(next: char, chars: &mut Peekable<Chars>) -> String {
    let mut result = String::with_capacity(7);

    match next {
        hash @ '#' => {
            match chars.next() {
                // HTML CODE
                // Prevent `&amp;#38;` -> `&#38`
                Some(number @ '0'..='9') => {
                    result.push_str("&amp;");
                    result.push(hash);
                    result.push(number);
                }
                Some(x @ 'x' | x @ 'X') => {
                    match chars.peek() {
                        // HEX CODE
                        // Prevent `&amp;#x38;` -> `&#x38`
                        Some(c) if c.is_ascii_hexdigit() => {
                            result.push_str("&amp;");
                            result.push(hash);
                            result.push(x);
                        }
                        _ => {
                            result.push('&');
                            result.push(hash);
                            result.push(x);
                        }
                    }
                }
                any => {
                    result.push('&');
                    result.push(hash);

                    if let Some(any) = any {
                        result.push(any);
                    }
                }
            }
        }
        // Named entity
        // Prevent `&amp;current` -> `&current`
        c @ 'a'..='z' | c @ 'A'..='Z' => {
            let mut entity_temporary_buffer = String::with_capacity(33);

            entity_temporary_buffer.push('&');
            entity_temporary_buffer.push(c);

            let mut found_entity = false;

            // No need to validate input, because we reset position if nothing was found
            for c in chars {
                entity_temporary_buffer.push(c);

                if HTML_ENTITIES.get(&entity_temporary_buffer).is_some() {
                    found_entity = true;

                    break;
                } else {
                    // We stop when:
                    //
                    // - not ascii alphanumeric
                    // - we consume more characters than the longest entity
                    if !c.is_ascii_alphanumeric() || entity_temporary_buffer.len() > 32 {
                        break;
                    }
                }
            }

            if found_entity {
                result.push_str("&amp;");
                result.push_str(&entity_temporary_buffer[1..]);
            } else {
                result.push('&');
                result.push_str(&entity_temporary_buffer[1..]);
            }
        }
        any => {
            result.push('&');
            result.push(any);
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
fn escape_string(value: &str, is_attribute_mode: bool) -> Cow<'_, str> {
    // Fast-path
    if value.is_empty() {
        return Cow::Borrowed(value);
    }

    if value.chars().all(|c| match c {
        '&' | '\u{00A0}' => false,
        '"' if is_attribute_mode => false,
        '<' if !is_attribute_mode => false,
        '>' if !is_attribute_mode => false,
        _ => true,
    }) {
        return Cow::Borrowed(value);
    }

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

    Cow::Owned(result)
}

fn is_html_tag_name(namespace: Namespace, tag_name: &JsWord) -> bool {
    if namespace != Namespace::HTML {
        return false;
    }

    matches!(
        &**tag_name,
        "a" | "abbr"
            | "acronym"
            | "address"
            | "applet"
            | "area"
            | "article"
            | "aside"
            | "audio"
            | "b"
            | "base"
            | "basefont"
            | "bdi"
            | "bdo"
            | "big"
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
            | "font"
            | "footer"
            | "form"
            | "frame"
            | "frameset"
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
            | "isindex"
            | "kbd"
            | "keygen"
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
            // Removed from spec, but we keep here to track it
            // | "menuitem"
            | "meta"
            | "meter"
            | "nav"
            | "nobr"
            | "noembed"
            | "noframes"
            | "noscript"
            | "object"
            | "ol"
            | "optgroup"
            | "option"
            | "output"
            | "p"
            | "param"
            | "picture"
            | "plaintext"
            | "pre"
            | "progress"
            | "q"
            | "rb"
            | "rbc"
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
            | "strike"
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
            | "tt"
            | "u"
            | "ul"
            | "var"
            | "video"
            | "wbr"
            | "xmp"
    )
}
