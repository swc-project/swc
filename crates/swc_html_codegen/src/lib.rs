#![deny(clippy::all)]
#![allow(clippy::needless_update)]
#![allow(clippy::match_like_matches_macro)]

pub use std::fmt::Result;
use std::{iter::Peekable, str::Chars};

use swc_atoms::{js_word, JsWord};
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
    /// By default `true` when `minify` enabled, otherwise `false`
    pub tag_omission: Option<bool>,
    /// By default `false` when `minify` enabled, otherwise `true`
    pub self_closing_void_elements: Option<bool>,
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
}

impl<'a, W> CodeGenerator<'a, W>
where
    W: HtmlWriter,
{
    pub fn new(wr: W, config: CodegenConfig<'a>) -> Self {
        let tag_omission = config.tag_omission.unwrap_or(config.minify);
        let self_closing_void_elements = config.tag_omission.unwrap_or(!config.minify);

        CodeGenerator {
            wr,
            config,
            ctx: Default::default(),
            is_plaintext: false,
            tag_omission,
            self_closing_void_elements,
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
        if self.is_plaintext {
            return Ok(());
        }

        let has_attributes = !n.attributes.is_empty();
        let can_omit_start_tag = self.tag_omission
            && !has_attributes
            && n.namespace == Namespace::HTML
            && match n.tag_name {
                // Tag omission in text/html:
                // An html element's start tag can be omitted if the first thing inside the html
                // element is not a comment.
                js_word!("html") if !matches!(n.children.get(0), Some(Child::Comment(..))) => true,
                // A head element's start tag can be omitted if the element is empty, or if the
                // first thing inside the head element is an element.
                js_word!("head")
                    if n.children.is_empty()
                        || matches!(n.children.get(0), Some(Child::Element(..))) =>
                {
                    true
                }
                // A body element's start tag can be omitted if the element is empty, or if the
                // first thing inside the body element is not ASCII whitespace or a comment, except
                // if the first thing inside the body element is a meta, link, script, style, or
                // template element.
                js_word!("body")
                    if n.children.is_empty()
                        || (match n.children.get(0) {
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
                                    *tag_name,
                                    js_word!("meta")
                                        | js_word!("link")
                                        | js_word!("script")
                                        | js_word!("style")
                                        | js_word!("template")
                                        | js_word!("bgsound")
                                        | js_word!("basefont")
                                        | js_word!("base")
                                        | js_word!("title")
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
                js_word!("colgroup")
                    if match n.children.get(0) {
                        Some(Child::Element(element))
                            if element.namespace == Namespace::HTML
                                && element.tag_name == js_word!("col") =>
                        {
                            !matches!(prev, Some(Child::Element(element)) if element.namespace == Namespace::HTML
                                        && element.tag_name == js_word!("colgroup"))
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
                js_word!("tbody")
                    if match n.children.get(0) {
                        Some(Child::Element(element))
                            if element.namespace == Namespace::HTML
                                && element.tag_name == js_word!("tr") =>
                        {
                            !matches!(prev, Some(Child::Element(element)) if element.namespace == Namespace::HTML
                            && matches!(
                                element.tag_name,
                                js_word!("tbody") | js_word!("thead") | js_word!("tfoot")
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
                n.tag_name,
                js_word!("area")
                    | js_word!("base")
                    | js_word!("basefont")
                    | js_word!("bgsound")
                    | js_word!("br")
                    | js_word!("col")
                    | js_word!("embed")
                    | js_word!("frame")
                    | js_word!("hr")
                    | js_word!("img")
                    | js_word!("input")
                    | js_word!("keygen")
                    | js_word!("link")
                    | js_word!("meta")
                    | js_word!("param")
                    | js_word!("source")
                    | js_word!("track")
                    | js_word!("wbr")
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

            if !self.config.minify
                && n.namespace == Namespace::HTML
                && n.tag_name == js_word!("html")
            {
                newline!(self);
            }
        }

        if is_void_element {
            return Ok(());
        }

        if !self.is_plaintext {
            self.is_plaintext = matches!(n.tag_name, js_word!("plaintext"));
        }

        if let Some(content) = &n.content {
            emit!(self, content);
        } else if !n.children.is_empty() {
            let ctx = self.create_context_for_element(n);

            let need_extra_newline = n.namespace == Namespace::HTML
                && matches!(n.tag_name, js_word!("textarea") | js_word!("pre"));

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
                && match n.tag_name {
                    // Tag omission in text/html:

                    // An html element's end tag can be omitted if the html element is not
                    // immediately followed by a comment.
                    //
                    // A body element's end tag can be omitted if the body element is not
                    // immediately followed by a comment.
                    js_word!("html") | js_word!("body") => {
                        !matches!(next, Some(Child::Comment(..)))
                    }
                    // A head element's end tag can be omitted if the head element is not
                    // immediately followed by ASCII whitespace or a comment.
                    js_word!("head") => match next {
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
                    js_word!("p") => match next {
                        Some(Child::Element(Element {
                            namespace,
                            tag_name,
                            ..
                        })) if *namespace == Namespace::HTML
                            && matches!(
                                *tag_name,
                                js_word!("address")
                                    | js_word!("article")
                                    | js_word!("aside")
                                    | js_word!("blockquote")
                                    | js_word!("details")
                                    | js_word!("div")
                                    | js_word!("dl")
                                    | js_word!("fieldset")
                                    | js_word!("figcaption")
                                    | js_word!("figure")
                                    | js_word!("footer")
                                    | js_word!("form")
                                    | js_word!("h1")
                                    | js_word!("h2")
                                    | js_word!("h3")
                                    | js_word!("h4")
                                    | js_word!("h5")
                                    | js_word!("h6")
                                    | js_word!("header")
                                    | js_word!("hgroup")
                                    | js_word!("hr")
                                    | js_word!("main")
                                    | js_word!("menu")
                                    | js_word!("nav")
                                    | js_word!("ol")
                                    | js_word!("p")
                                    | js_word!("pre")
                                    | js_word!("section")
                                    | js_word!("table")
                                    | js_word!("ul")
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
                                    *tag_name,
                                    js_word!("a")
                                        | js_word!("audio")
                                        | js_word!("acronym")
                                        | js_word!("big")
                                        | js_word!("del")
                                        | js_word!("font")
                                        | js_word!("ins")
                                        | js_word!("tt")
                                        | js_word!("strike")
                                        | js_word!("map")
                                        | js_word!("noscript")
                                        | js_word!("video")
                                        | js_word!("kbd")
                                        | js_word!("rbc")
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
                    js_word!("li")
                        if match parent {
                            Some(Element {
                                namespace,
                                tag_name,
                                ..
                            }) if *namespace == Namespace::HTML
                                && matches!(
                                    *tag_name,
                                    js_word!("ul") | js_word!("ol") | js_word!("menu")
                                ) =>
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
                            })) if *namespace == Namespace::HTML && *tag_name == js_word!("li") => {
                                true
                            }
                            None => true,
                            _ => false,
                        }
                    }
                    // A dt element's end tag can be omitted if the dt element is immediately
                    // followed by another dt element or a dd element.
                    js_word!("dt") => match next {
                        Some(Child::Element(Element {
                            namespace,
                            tag_name,
                            ..
                        })) if *namespace == Namespace::HTML
                            && (*tag_name == js_word!("dt") || *tag_name == js_word!("dd")) =>
                        {
                            true
                        }
                        _ => false,
                    },
                    // A dd element's end tag can be omitted if the dd element is immediately
                    // followed by another dd element or a dt element, or if there is no more
                    // content in the parent element.
                    js_word!("dd") => match next {
                        Some(Child::Element(Element {
                            namespace,
                            tag_name,
                            ..
                        })) if *namespace == Namespace::HTML
                            && (*tag_name == js_word!("dd") || *tag_name == js_word!("dt")) =>
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
                    js_word!("rt") | js_word!("rp") => match next {
                        Some(Child::Element(Element {
                            namespace,
                            tag_name,
                            ..
                        })) if *namespace == Namespace::HTML
                            && (*tag_name == js_word!("rt") || *tag_name == js_word!("rp")) =>
                        {
                            true
                        }
                        None => true,
                        _ => false,
                    },
                    // The end tag can be omitted if the element is immediately followed by an <rt>,
                    // <rtc>, or <rp> element or another <rb> element, or if there is no more
                    // content in the parent element.
                    js_word!("rb") => match next {
                        Some(Child::Element(Element {
                            namespace,
                            tag_name,
                            ..
                        })) if *namespace == Namespace::HTML
                            && (*tag_name == js_word!("rt")
                                || *tag_name == js_word!("rtc")
                                || *tag_name == js_word!("rp")
                                || *tag_name == js_word!("rb")) =>
                        {
                            true
                        }
                        None => true,
                        _ => false,
                    },
                    // 	The closing tag can be omitted if it is immediately followed by a <rb>, <rtc>
                    // or <rt> element opening tag or by its parent closing tag.
                    js_word!("rtc") => match next {
                        Some(Child::Element(Element {
                            namespace,
                            tag_name,
                            ..
                        })) if *namespace == Namespace::HTML
                            && (*tag_name == js_word!("rb")
                                || *tag_name == js_word!("rtc")
                                || *tag_name == js_word!("rt")) =>
                        {
                            true
                        }
                        None => true,
                        _ => false,
                    },
                    // An optgroup element's end tag can be omitted if the optgroup element is
                    // immediately followed by another optgroup element, or if there is no more
                    // content in the parent element.
                    js_word!("optgroup") => match next {
                        Some(Child::Element(Element {
                            namespace,
                            tag_name,
                            ..
                        })) if *namespace == Namespace::HTML
                            && *tag_name == js_word!("optgroup") =>
                        {
                            true
                        }
                        None => true,
                        _ => false,
                    },
                    // An option element's end tag can be omitted if the option element is
                    // immediately followed by another option element, or if it is immediately
                    // followed by an optgroup element, or if there is no more content in the parent
                    // element.
                    js_word!("option") => match next {
                        Some(Child::Element(Element {
                            namespace,
                            tag_name,
                            ..
                        })) if *namespace == Namespace::HTML
                            && (*tag_name == js_word!("option")
                                || *tag_name == js_word!("optgroup")) =>
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
                    js_word!("caption") | js_word!("colgroup") => match next {
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
                    js_word!("tbody") => match next {
                        Some(Child::Element(Element {
                            namespace,
                            tag_name,
                            ..
                        })) if *namespace == Namespace::HTML
                            && (*tag_name == js_word!("tbody")
                                || *tag_name == js_word!("tfoot")) =>
                        {
                            true
                        }
                        None => true,
                        _ => false,
                    },
                    // A thead element's end tag can be omitted if the thead element is immediately
                    // followed by a tbody or tfoot element.
                    js_word!("thead") => match next {
                        Some(Child::Element(Element {
                            namespace,
                            tag_name,
                            ..
                        })) if *namespace == Namespace::HTML
                            && (*tag_name == js_word!("tbody")
                                || *tag_name == js_word!("tfoot")) =>
                        {
                            true
                        }
                        _ => false,
                    },
                    // A tfoot element's end tag can be omitted if there is no more content in the
                    // parent element.
                    js_word!("tfoot") => matches!(next, None),
                    // A tr element's end tag can be omitted if the tr element is immediately
                    // followed by another tr element, or if there is no more content in the parent
                    // element.
                    js_word!("tr") => match next {
                        Some(Child::Element(Element {
                            namespace,
                            tag_name,
                            ..
                        })) if *namespace == Namespace::HTML && *tag_name == js_word!("tr") => true,
                        None => true,
                        _ => false,
                    },
                    // A th element's end tag can be omitted if the th element is immediately
                    // followed by a td or th element, or if there is no more content in the parent
                    // element.
                    js_word!("td") | js_word!("th") => match next {
                        Some(Child::Element(Element {
                            namespace,
                            tag_name,
                            ..
                        })) if *namespace == Namespace::HTML
                            && (*tag_name == js_word!("td") || *tag_name == js_word!("th")) =>
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
                let minifier = minify_attribute_value(value);

                attribute.push_str(&minifier);
            } else {
                let normalized = normalize_attribute_value(value);

                attribute.push_str(&normalized);
            }
        }

        write_multiline_raw!(self, n.span, &attribute);
    }

    #[emitter]
    fn emit_text(&mut self, n: &Text) -> Result {
        if self.ctx.need_escape_text {
            let mut data = String::with_capacity(n.data.len());

            if self.config.minify {
                data.push_str(&minify_text(&n.data));
            } else {
                data.push_str(&escape_string(&n.data, false));
            }

            write_multiline_raw!(self, n.span, &data);
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
        let need_escape_text = match n.tag_name {
            js_word!("style")
            | js_word!("script")
            | js_word!("xmp")
            | js_word!("iframe")
            | js_word!("noembed")
            | js_word!("noframes")
            | js_word!("plaintext") => false,
            js_word!("noscript") => !self.config.scripting_enabled,
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

fn minify_attribute_value(value: &str) -> String {
    if value.is_empty() {
        return "\"\"".to_string();
    }

    let mut minified = String::with_capacity(value.len());

    let mut unquoted = true;
    let mut dq = 0;
    let mut sq = 0;

    let mut chars = value.chars().peekable();

    while let Some(c) = chars.next() {
        match c {
            '&' => {
                minified.push_str(&minify_amp(&mut chars));

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
        format!("'{}'", minified.replace('\'', "&apos;"))
    } else {
        format!("\"{}\"", minified.replace('"', "&quot;"))
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
    let mut chars = value.chars().peekable();

    while let Some(c) = chars.next() {
        match c {
            '&' => {
                result.push_str(&minify_amp(&mut chars));
            }
            '<' => {
                result.push_str("&lt;");
            }
            _ => result.push(c),
        }
    }

    result
}

fn minify_amp(chars: &mut Peekable<Chars>) -> String {
    let mut result = String::with_capacity(7);

    match chars.next() {
        Some(hash @ '#') => {
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
        Some(c @ 'a'..='z') | Some(c @ 'A'..='Z') => {
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

            if let Some(any) = any {
                result.push(any);
            }
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

fn is_html_tag_name(namespace: Namespace, tag_name: &JsWord) -> bool {
    if namespace != Namespace::HTML {
        return false;
    }

    matches!(
        *tag_name,
        js_word!("a") | js_word!("abbr")
            | js_word!("acronym")
            | js_word!("address")
            | js_word!("applet")
            | js_word!("area")
            | js_word!("article")
            | js_word!("aside")
            | js_word!("audio")
            | js_word!("b")
            | js_word!("base")
            | js_word!("basefont")
            | js_word!("bdi")
            | js_word!("bdo")
            | js_word!("big")
            | js_word!("blockquote")
            | js_word!("body")
            | js_word!("br")
            | js_word!("button")
            | js_word!("canvas")
            | js_word!("caption")
            | js_word!("center")
            | js_word!("cite")
            | js_word!("code")
            | js_word!("col")
            | js_word!("colgroup")
            | js_word!("data")
            | js_word!("datalist")
            | js_word!("dd")
            | js_word!("del")
            | js_word!("details")
            | js_word!("dfn")
            | js_word!("dialog")
            | js_word!("dir")
            | js_word!("div")
            | js_word!("dl")
            | js_word!("dt")
            | js_word!("em")
            | js_word!("embed")
            | js_word!("fieldset")
            | js_word!("figcaption")
            | js_word!("figure")
            | js_word!("font")
            | js_word!("footer")
            | js_word!("form")
            | js_word!("frame")
            | js_word!("frameset")
            | js_word!("h1")
            | js_word!("h2")
            | js_word!("h3")
            | js_word!("h4")
            | js_word!("h5")
            | js_word!("h6")
            | js_word!("head")
            | js_word!("header")
            | js_word!("hgroup")
            | js_word!("hr")
            | js_word!("html")
            | js_word!("i")
            | js_word!("iframe")
            | js_word!("image")
            | js_word!("img")
            | js_word!("input")
            | js_word!("ins")
            | js_word!("isindex")
            | js_word!("kbd")
            | js_word!("keygen")
            | js_word!("label")
            | js_word!("legend")
            | js_word!("li")
            | js_word!("link")
            | js_word!("listing")
            | js_word!("main")
            | js_word!("map")
            | js_word!("mark")
            | js_word!("marquee")
            | js_word!("menu")
            // Removed from spec, but we keep here to track it
            // | js_word!("menuitem")
            | js_word!("meta")
            | js_word!("meter")
            | js_word!("nav")
            | js_word!("nobr")
            | js_word!("noembed")
            | js_word!("noframes")
            | js_word!("noscript")
            | js_word!("object")
            | js_word!("ol")
            | js_word!("optgroup")
            | js_word!("option")
            | js_word!("output")
            | js_word!("p")
            | js_word!("param")
            | js_word!("picture")
            | js_word!("plaintext")
            | js_word!("pre")
            | js_word!("progress")
            | js_word!("q")
            | js_word!("rb")
            | js_word!("rbc")
            | js_word!("rp")
            | js_word!("rt")
            | js_word!("rtc")
            | js_word!("ruby")
            | js_word!("s")
            | js_word!("samp")
            | js_word!("script")
            | js_word!("section")
            | js_word!("select")
            | js_word!("small")
            | js_word!("source")
            | js_word!("span")
            | js_word!("strike")
            | js_word!("strong")
            | js_word!("style")
            | js_word!("sub")
            | js_word!("summary")
            | js_word!("sup")
            | js_word!("table")
            | js_word!("tbody")
            | js_word!("td")
            | js_word!("template")
            | js_word!("textarea")
            | js_word!("tfoot")
            | js_word!("th")
            | js_word!("thead")
            | js_word!("time")
            | js_word!("title")
            | js_word!("tr")
            | js_word!("track")
            | js_word!("tt")
            | js_word!("u")
            | js_word!("ul")
            | js_word!("var")
            | js_word!("video")
            | js_word!("wbr")
            | js_word!("xmp")
    )
}
