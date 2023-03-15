use std::path::PathBuf;

use swc_common::{errors::Handler, input::SourceFileInput, Spanned};
use swc_html_ast::*;
use swc_html_parser::{
    lexer::Lexer,
    parser::{PResult, Parser, ParserConfig},
};
use swc_html_visit::{Visit, VisitMut, VisitMutWith, VisitWith};
use testing::NormalizedOutput;

#[allow(dead_code)]
pub fn document_test(input: PathBuf, config: ParserConfig) {
    testing::run_test2(false, |cm, handler| {
        let json_path = input.parent().unwrap().join("output.json");
        let fm = cm.load_file(&input).unwrap();
        let lexer = Lexer::new(SourceFileInput::from(&*fm));
        let mut parser = Parser::new(lexer, config);
        let document: PResult<Document> = parser.parse_document();
        let errors = parser.take_errors();

        for err in &errors {
            err.to_diagnostics(&handler).emit();
        }

        if !errors.is_empty() {
            return Err(());
        }

        match document {
            Ok(document) => {
                let actual_json = serde_json::to_string_pretty(&document)
                    .map(NormalizedOutput::from)
                    .expect("failed to serialize document");

                actual_json.compare_to_file(json_path).unwrap();

                Ok(())
            }
            Err(err) => {
                let mut d = err.to_diagnostics(&handler);

                d.note(&format!("current token = {}", parser.dump_cur()));
                d.emit();

                Err(())
            }
        }
    })
    .unwrap();
}

pub struct DomVisualizer<'a> {
    pub dom_buf: &'a mut String,
    pub indent: usize,
}

impl DomVisualizer<'_> {
    fn get_ident(&self) -> String {
        let mut indent = String::new();

        indent.push_str("| ");
        indent.push_str(&"  ".repeat(self.indent));

        indent
    }
}

impl VisitMut for DomVisualizer<'_> {
    fn visit_mut_document_type(&mut self, n: &mut DocumentType) {
        let mut document_type = String::new();

        document_type.push_str(&self.get_ident());
        document_type.push_str("<!DOCTYPE ");

        if let Some(name) = &n.name {
            document_type.push_str(name);
        }

        if let Some(public_id) = &n.public_id {
            document_type.push(' ');
            document_type.push('"');
            document_type.push_str(public_id);
            document_type.push('"');

            if let Some(system_id) = &n.system_id {
                document_type.push(' ');
                document_type.push('"');
                document_type.push_str(system_id);
                document_type.push('"');
            } else {
                document_type.push(' ');
                document_type.push('"');
                document_type.push('"');
            }
        } else if let Some(system_id) = &n.system_id {
            document_type.push(' ');
            document_type.push('"');
            document_type.push('"');
            document_type.push(' ');
            document_type.push('"');
            document_type.push_str(system_id);
            document_type.push('"');
        }

        document_type.push('>');
        document_type.push('\n');

        self.dom_buf.push_str(&document_type);

        n.visit_mut_children_with(self);
    }

    fn visit_mut_element(&mut self, n: &mut Element) {
        let mut element = String::new();

        element.push_str(&self.get_ident());
        element.push('<');

        match n.namespace {
            Namespace::SVG => {
                element.push_str("svg ");
            }
            Namespace::MATHML => {
                element.push_str("math ");
            }
            _ => {}
        }

        element.push_str(&n.tag_name);
        element.push('>');
        element.push('\n');

        let is_template = n.namespace == Namespace::HTML && &*n.tag_name == "template";

        if is_template {
            self.indent += 1;

            element.push_str(&self.get_ident());
            element.push_str("content");
            element.push('\n');
        }

        n.attributes
            .sort_by(|a, b| a.name.partial_cmp(&b.name).unwrap());

        self.dom_buf.push_str(&element);

        let old_indent = self.indent;

        self.indent += 1;

        n.visit_mut_children_with(self);

        self.indent = old_indent;

        if is_template {
            self.indent -= 1;
        }
    }

    fn visit_mut_attribute(&mut self, n: &mut Attribute) {
        let mut attribute = String::new();

        attribute.push_str(&self.get_ident());

        if let Some(prefix) = &n.prefix {
            attribute.push_str(prefix);
            attribute.push(' ');
        }

        attribute.push_str(&n.name);
        attribute.push('=');
        attribute.push('"');

        if let Some(value) = &n.value {
            attribute.push_str(value);
        }

        attribute.push('"');
        attribute.push('\n');

        self.dom_buf.push_str(&attribute);

        n.visit_mut_children_with(self);
    }

    fn visit_mut_text(&mut self, n: &mut Text) {
        let mut text = String::new();

        text.push_str(&self.get_ident());
        text.push('"');
        text.push_str(&n.data);
        text.push('"');
        text.push('\n');

        self.dom_buf.push_str(&text);

        n.visit_mut_children_with(self);
    }

    fn visit_mut_comment(&mut self, n: &mut Comment) {
        let mut comment = String::new();

        comment.push_str(&self.get_ident());
        comment.push_str("<!-- ");
        comment.push_str(&n.data);
        comment.push_str(" -->");
        comment.push('\n');

        self.dom_buf.push_str(&comment);

        n.visit_mut_children_with(self);
    }
}

#[allow(dead_code)]
pub fn document_dom_visualizer(input: PathBuf, config: ParserConfig) {
    let dir = input.parent().unwrap().to_path_buf();

    testing::run_test2(false, |cm, handler| {
        // Type annotation
        if false {
            return Ok(());
        }

        let fm = cm.load_file(&input).unwrap();
        let lexer = Lexer::new(SourceFileInput::from(&*fm));
        let mut parser = Parser::new(lexer, config);

        let document: PResult<Document> = parser.parse_document();

        match document {
            Ok(mut document) => {
                let mut dom_buf = String::new();

                document.visit_mut_with(&mut DomVisualizer {
                    dom_buf: &mut dom_buf,
                    indent: 0,
                });

                NormalizedOutput::from(dom_buf)
                    .compare_to_file(dir.join("dom.rust-debug"))
                    .unwrap();

                Ok(())
            }
            Err(err) => {
                let mut d = err.to_diagnostics(&handler);

                d.note(&format!("current token = {}", parser.dump_cur()));
                d.emit();

                panic!();
            }
        }
    })
    .unwrap();
}

struct SpanVisualizer<'a> {
    handler: &'a Handler,
}

macro_rules! mtd {
    ($T:ty,$name:ident) => {
        fn $name(&mut self, n: &$T) {
            let span = n.span();

            self.handler.struct_span_err(span, stringify!($T)).emit();

            n.visit_children_with(self);
        }
    };
}

impl Visit for SpanVisualizer<'_> {
    mtd!(Document, visit_document);

    mtd!(DocumentFragment, visit_document_fragment);

    mtd!(Child, visit_child);

    mtd!(DocumentType, visit_document_type);

    mtd!(Element, visit_element);

    mtd!(Attribute, visit_attribute);

    mtd!(Text, visit_text);

    mtd!(Comment, visit_comment);
}

pub fn document_span_visualizer(input: PathBuf, config: ParserConfig, relative_to_file: bool) {
    let dir = input.parent().unwrap().to_path_buf();

    let output = testing::run_test2(false, |cm, handler| {
        // Type annotation
        if false {
            return Ok(());
        }

        let fm = cm.load_file(&input).unwrap();
        let lexer = Lexer::new(SourceFileInput::from(&*fm));
        let mut parser = Parser::new(lexer, config);

        let document: PResult<Document> = parser.parse_document();

        match document {
            Ok(document) => {
                document.visit_with(&mut SpanVisualizer { handler: &handler });

                Err(())
            }
            Err(err) => {
                let mut d = err.to_diagnostics(&handler);

                d.note(&format!("current token = {}", parser.dump_cur()));
                d.emit();

                panic!();
            }
        }
    })
    .unwrap_err();

    let output_path = if relative_to_file {
        input.with_extension("span.rust-debug")
    } else {
        dir.join("span.rust-debug")
    };

    output.compare_to_file(output_path).unwrap();
}
