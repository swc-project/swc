#![deny(clippy::all)]
#![allow(clippy::needless_update)]

pub use std::fmt::Result;

use swc_common::Spanned;
use swc_html_ast::*;
use swc_html_codegen_macros::emitter;
use writer::HtmlWriter;

pub use self::emit::*;
use self::list::ListFormat;

#[macro_use]
mod macros;
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
}

impl<W> CodeGenerator<W>
where
    W: HtmlWriter,
{
    pub fn new(wr: W, config: CodegenConfig) -> Self {
        CodeGenerator { wr, config }
    }

    #[emitter]
    fn emit_document(&mut self, n: &Document) -> Result {
        self.emit_list(&n.children, ListFormat::NotDelimited)?;
    }

    #[emitter]
    fn emit_token_and_span(&mut self, n: &TokenAndSpan) -> Result {
        let span = n.span;

        match &n.token {
            Token::Doctype {
                name,
                public_id,
                system_id,
                ..
            } => {
                let mut doctype = String::new();

                doctype.push('<');
                doctype.push('!');
                doctype.push_str("DOCTYPE");

                if let Some(name) = &name {
                    doctype.push(' ');
                    doctype.push_str(name);
                }

                if let Some(public_id) = &public_id {
                    doctype.push(' ');
                    doctype.push_str("PUBLIC");
                    doctype.push(' ');
                    doctype.push('"');
                    doctype.push_str(public_id);
                    doctype.push('"');
                }

                if let Some(system_id) = &system_id {
                    doctype.push(' ');
                    doctype.push('"');
                    doctype.push_str(system_id);
                    doctype.push('"');
                }

                doctype.push('>');

                write_raw!(self, span, &doctype);
            }
            Token::StartTag {
                tag_name,
                attributes,
                self_closing,
            } => {
                let mut start_tag = String::new();

                start_tag.push('<');
                start_tag.push_str(tag_name);

                for attribute in attributes {
                    start_tag.push(' ');
                    start_tag.push_str(&attribute.name);

                    if let Some(value) = &attribute.value {
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

                write_str!(self, span, &start_tag);
            }
            Token::EndTag {
                tag_name,
                attributes,
                ..
            } => {
                let mut start_tag = String::new();

                start_tag.push_str("</");
                start_tag.push_str(tag_name);

                for attribute in attributes {
                    start_tag.push(' ');
                    start_tag.push_str(&attribute.name);

                    if let Some(value) = &attribute.value {
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
            ListFormat::CommaDelimited => {
                write_raw!(self, ",");
                formatting_space!(self);
            }
            ListFormat::SpaceDelimited => {
                space!(self)
            }
            ListFormat::SemiDelimited => {
                write_raw!(self, ";")
            }
            ListFormat::DotDelimited => {
                write_raw!(self, ".");
            }
            _ => unreachable!(),
        }

        Ok(())
    }
}
