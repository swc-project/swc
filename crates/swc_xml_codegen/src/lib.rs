#![deny(clippy::all)]
#![allow(clippy::needless_update)]
#![allow(non_local_definitions)]

pub use std::fmt::Result;
use std::{iter::Peekable, str::Chars};

use swc_common::Spanned;
use swc_xml_ast::*;
use swc_xml_codegen_macros::emitter;
use writer::XmlWriter;

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
}

#[derive(Debug)]
pub struct CodeGenerator<'a, W>
where
    W: XmlWriter,
{
    wr: W,
    config: CodegenConfig<'a>,
    ctx: Ctx,
}

impl<'a, W> CodeGenerator<'a, W>
where
    W: XmlWriter,
{
    pub fn new(wr: W, config: CodegenConfig<'a>) -> Self {
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
    fn emit_child(&mut self, n: &Child) -> Result {
        match n {
            Child::DocumentType(n) => emit!(self, n),
            Child::Element(n) => emit!(self, n),
            Child::Text(n) => emit!(self, n),
            Child::Comment(n) => emit!(self, n),
            Child::ProcessingInstruction(n) => emit!(self, n),
            Child::CdataSection(n) => emit!(self, n),
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

    fn basic_emit_element(&mut self, n: &Element) -> Result {
        let has_attributes = !n.attributes.is_empty();
        let is_void_element = n.children.is_empty();

        write_raw!(self, "<");
        write_raw!(self, &n.tag_name);

        if has_attributes {
            space!(self);

            self.emit_list(&n.attributes, ListFormat::SpaceDelimited)?;
        }

        if is_void_element {
            if !self.config.minify {
                write_raw!(self, " ");
            }

            write_raw!(self, "/");
        }

        write_raw!(self, ">");

        if is_void_element {
            return Ok(());
        }

        if !n.children.is_empty() {
            let ctx = self.create_context_for_element(n);

            self.with_ctx(ctx)
                .emit_list(&n.children, ListFormat::NotDelimited)?;
        }

        write_raw!(self, "<");
        write_raw!(self, "/");
        write_raw!(self, &n.tag_name);
        write_raw!(self, ">");

        Ok(())
    }

    #[emitter]
    fn emit_element(&mut self, n: &Element) -> Result {
        self.basic_emit_element(n)?;
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

            let normalized = normalize_attribute_value(value);

            attribute.push_str(&normalized);
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

    #[emitter]
    fn emit_processing_instruction(&mut self, n: &ProcessingInstruction) -> Result {
        let mut processing_instruction = String::with_capacity(n.target.len() + n.data.len() + 5);

        processing_instruction.push_str("<?");
        processing_instruction.push_str(&n.target);
        processing_instruction.push(' ');
        processing_instruction.push_str(&n.data);
        processing_instruction.push_str("?>");

        write_multiline_raw!(self, n.span, &processing_instruction);
    }

    #[emitter]
    fn emit_cdata_section(&mut self, n: &CdataSection) -> Result {
        let mut cdata_section = String::with_capacity(n.data.len() + 12);

        cdata_section.push_str("<![CDATA[");
        cdata_section.push_str(&n.data);
        cdata_section.push_str("]]>");

        write_multiline_raw!(self, n.span, &cdata_section);
    }

    fn create_context_for_element(&self, n: &Element) -> Ctx {
        let need_escape_text = match &*n.tag_name {
            "noscript" => !self.config.scripting_enabled,
            _ => true,
        };

        Ctx {
            need_escape_text,
            ..self.ctx
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

#[allow(clippy::unused_peekable)]
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
            '>' => {
                result.push_str("&gt;");
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

            result.push('&');
            result.push_str(&entity_temporary_buffer[1..]);
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
            '"' if is_attribute_mode => result.push_str("&quot;"),
            '<' => {
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
