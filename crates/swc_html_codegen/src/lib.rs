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

#[derive(Debug, Clone, Copy)]
pub struct CodegenConfig {
    pub minify: bool,
}
#[derive(Debug)]
pub struct CodeGenerator<W>
where
    W: HtmlWriter,
{
    wr: W,
    config: CodegenConfig,
    ctx: Ctx,
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
            doctype.push('"');
            doctype.push_str(public_id);
            doctype.push('"');

            if let Some(system_id) = &n.system_id {
                doctype.push(' ');
                doctype.push('"');
                doctype.push_str(system_id);
                doctype.push('"');
            }
        } else if let Some(system_id) = &n.system_id {
            doctype.push(' ');

            if self.config.minify {
                doctype.push_str("system");
            } else {
                doctype.push_str("SYSTEM");
            }

            doctype.push(' ');
            doctype.push('"');
            doctype.push_str(system_id);
            doctype.push('"');
        }

        doctype.push('>');

        write_raw!(self, n.span, &doctype);
    }

    #[emitter]
    fn emit_element(&mut self, n: &Element) -> Result {
        write_raw!(self, "<");
        write_raw!(self, &n.tag_name);

        if !n.attributes.is_empty() {
            space!(self);

            self.emit_list(&n.attributes, ListFormat::SpaceDelimited)?;
        }

        write_raw!(self, ">");

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

        if !n.children.is_empty() {
            let skip_escape_text = matches!(
                &*n.tag_name,
                "style"
                | "script"
                | "xmp"
                | "iframe"
                | "noembed"
                | "noframes"
                | "plaintext"
                // TODO we need option here
                | "noscript"
            );

            let ctx = Ctx {
                skip_escape_text,
                ..self.ctx
            };

            self.with_ctx(ctx)
                .emit_list(&n.children, ListFormat::NotDelimited)?;
        }

        write_raw!(self, "<");
        write_raw!(self, "/");
        write_raw!(self, &n.tag_name);
        write_raw!(self, ">");
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
                let quote = if value.contains('"') { '\'' } else { '"' };

                attribute.push(quote);
                attribute.push_str(value);
                attribute.push(quote);
            }
        }

        write_str!(self, n.span, &attribute);
    }

    #[emitter]
    fn emit_text(&mut self, n: &Text) -> Result {
        if self.ctx.skip_escape_text {
            write_str!(self, n.span, &n.value);
        } else {
            let mut text = String::new();

            for c in n.value.chars() {
                match c {
                    '&' => {
                        text.push_str(&String::from("&amp;"));
                    }
                    '<' => {
                        text.push_str(&String::from("&lt;"));
                    }
                    '>' => {
                        text.push_str(&String::from("&gt;"));
                    }
                    '\u{00A0}' => text.push_str(&String::from("&nbsp;")),
                    _ => text.push(c),
                }
            }

            write_str!(self, n.span, &text);
        }
    }

    #[emitter]
    fn emit_comment(&mut self, n: &Comment) -> Result {
        let mut comment = String::new();

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

    let mut minified = String::new();

    let mut unquoted = true;
    let mut dq = 0;
    let mut sq = 0;

    for c in value.chars() {
        match c {
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
