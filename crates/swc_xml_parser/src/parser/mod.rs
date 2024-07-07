use std::{cell::RefCell, mem, rc::Rc};

use node::*;
use open_elements_stack::*;
use swc_common::{Span, DUMMY_SP};
use swc_xml_ast::*;

use self::input::{Buffer, ParserInput};
use crate::error::{Error, ErrorKind};

#[macro_use]
mod macros;
pub mod input;
mod node;
mod open_elements_stack;

pub type PResult<T> = Result<T, Error>;

#[derive(Debug, Clone, Copy, Default, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct ParserConfig {}

#[derive(Debug, Default)]
pub enum Phase {
    #[default]
    StartPhase,
    MainPhase,
    EndPhase,
}

pub struct Parser<I>
where
    I: ParserInput,
{
    #[allow(dead_code)]
    config: ParserConfig,
    input: Buffer<I>,
    stopped: bool,
    document: Option<RcNode>,
    open_elements_stack: OpenElementsStack,
    errors: Vec<Error>,
    phase: Phase,
}

impl<I> Parser<I>
where
    I: ParserInput,
{
    pub fn new(input: I, config: ParserConfig) -> Self {
        Parser {
            config,
            input: Buffer::new(input),
            stopped: false,
            document: None,
            open_elements_stack: OpenElementsStack::new(),
            errors: Default::default(),
            phase: Phase::default(),
        }
    }

    pub fn dump_cur(&mut self) -> String {
        format!("{:?}", self.input.cur())
    }

    pub fn take_errors(&mut self) -> Vec<Error> {
        mem::take(&mut self.errors)
    }

    pub fn parse_document(&mut self) -> PResult<Document> {
        let start = self.input.cur_span()?;

        self.document = Some(self.create_document());

        self.run()?;

        let document = &mut self.document.take().unwrap();
        let nodes = document.children.take();
        let mut children = Vec::with_capacity(nodes.len());

        for node in nodes {
            children.push(self.node_to_child(node));
        }

        let last = self.input.last_pos()?;

        Ok(Document {
            span: Span::new(start.lo(), last),
            children,
        })
    }

    fn create_document(&self) -> RcNode {
        Node::new(Data::Document, DUMMY_SP)
    }

    #[allow(clippy::only_used_in_recursion)]
    fn get_deep_end_span(&mut self, children: &[Child]) -> Option<Span> {
        match children.last() {
            Some(Child::DocumentType(DocumentType { span, .. })) => Some(*span),
            Some(Child::Element(Element { span, children, .. })) => {
                if span.is_dummy() {
                    return self.get_deep_end_span(children);
                }

                Some(*span)
            }
            Some(Child::Comment(Comment { span, .. })) => Some(*span),
            Some(Child::Text(Text { span, .. })) => Some(*span),
            _ => None,
        }
    }

    fn node_to_child(&mut self, node: RcNode) -> Child {
        let start_span = node.start_span.take();

        match node.data.clone() {
            Data::DocumentType {
                name,
                public_id,
                system_id,
                raw,
            } => Child::DocumentType(DocumentType {
                span: start_span,
                name,
                public_id,
                system_id,
                raw,
            }),
            Data::Element {
                tag_name,
                attributes,
            } => {
                let nodes = node.children.take();
                let mut new_children = Vec::with_capacity(nodes.len());

                for node in nodes {
                    new_children.push(self.node_to_child(node));
                }

                let attributes = attributes.take();

                let span = if start_span.is_dummy() {
                    start_span
                } else {
                    let end_span = match node.end_span.take() {
                        Some(end_span) if !end_span.is_dummy() => end_span,
                        _ => match self.get_deep_end_span(&new_children) {
                            Some(end_span) => end_span,
                            _ => start_span,
                        },
                    };

                    Span::new(start_span.lo(), end_span.hi())
                };

                Child::Element(Element {
                    span,
                    tag_name,
                    attributes,
                    children: new_children,
                })
            }
            Data::Text { data, raw } => {
                let span = if let Some(end_span) = node.end_span.take() {
                    swc_common::Span::new(start_span.lo(), end_span.hi())
                } else {
                    start_span
                };

                Child::Text(Text {
                    span,
                    data: data.take().into(),
                    raw: Some(raw.take().into()),
                })
            }
            Data::Comment { data, raw } => Child::Comment(Comment {
                span: start_span,
                data,
                raw,
            }),
            Data::ProcessingInstruction { target, data } => {
                Child::ProcessingInstruction(ProcessingInstruction {
                    span: start_span,
                    target,
                    data,
                })
            }
            Data::CdataSection { data, raw } => Child::CdataSection(CdataSection {
                span: start_span,
                data,
                raw,
            }),
            _ => {
                unreachable!();
            }
        }
    }

    fn run(&mut self) -> PResult<()> {
        while !self.stopped {
            let mut token_and_info = match self.input.cur()? {
                Some(_) => {
                    let span = self.input.cur_span()?;
                    let token = bump!(self);

                    TokenAndInfo {
                        span: span!(self, span.lo()),
                        acknowledged: false,
                        token,
                    }
                }
                None => {
                    let start_pos = self.input.start_pos()?;
                    let last_pos = self.input.last_pos()?;

                    TokenAndInfo {
                        span: Span::new(start_pos, last_pos),
                        acknowledged: false,
                        token: Token::Eof,
                    }
                }
            };

            // Re-emit errors from tokenizer
            for error in self.input.take_errors() {
                let (span, kind) = *error.into_inner();

                self.errors.push(Error::new(span, kind));
            }

            self.tree_construction_dispatcher(&mut token_and_info)?;
        }

        Ok(())
    }

    fn tree_construction_dispatcher(&mut self, token_and_info: &mut TokenAndInfo) -> PResult<()> {
        self.process_token(token_and_info, None)
    }

    fn process_token(
        &mut self,
        token_and_info: &mut TokenAndInfo,
        phase: Option<Phase>,
    ) -> PResult<()> {
        let phase = match &phase {
            Some(phase) => phase,
            _ => &self.phase,
        };

        match phase {
            Phase::StartPhase => match &token_and_info.token {
                Token::StartTag { .. } => {
                    let element = self.create_element_for_token(token_and_info.clone());

                    self.append_node(self.document.as_ref().unwrap(), element.clone());
                    self.open_elements_stack.items.push(element);
                    self.phase = Phase::MainPhase;
                }
                Token::EmptyTag { .. } => {
                    let element = self.create_element_for_token(token_and_info.clone());

                    self.append_node(self.document.as_ref().unwrap(), element);
                    self.phase = Phase::EndPhase;
                }
                Token::Comment { .. } => {
                    self.append_comment_to_doc(token_and_info)?;
                }
                Token::ProcessingInstruction { .. } => {
                    self.append_processing_instruction_to_doc(token_and_info)?;
                }
                Token::Cdata { .. } => {
                    self.errors.push(Error::new(
                        token_and_info.span,
                        ErrorKind::UnexpectedTokenInStartPhase,
                    ));

                    self.append_cdata_to_doc(token_and_info)?;
                }
                Token::Character { value, .. } => {
                    if !is_whitespace(*value) {
                        self.errors.push(Error::new(
                            token_and_info.span,
                            ErrorKind::UnexpectedCharacter,
                        ));
                    }
                }
                Token::Eof => {
                    self.errors.push(Error::new(
                        token_and_info.span,
                        ErrorKind::UnexpectedEofInStartPhase,
                    ));

                    self.process_token(token_and_info, Some(Phase::EndPhase))?;
                }
                Token::Doctype { .. } => {
                    let document_type = self.create_document_type_for_token(token_and_info);

                    self.append_node(self.document.as_ref().unwrap(), document_type);
                }
                _ => {
                    self.errors.push(Error::new(
                        token_and_info.span,
                        ErrorKind::UnexpectedTokenInStartPhase,
                    ));
                }
            },
            Phase::MainPhase => match &token_and_info.token {
                Token::Character { .. } => {
                    self.append_character_to_current_element(token_and_info)?;
                }
                Token::StartTag { .. } => {
                    let element = self.create_element_for_token(token_and_info.clone());

                    self.append_node(self.get_current_element(), element.clone());
                    self.open_elements_stack.items.push(element);
                }
                Token::EmptyTag { .. } => {
                    let element = self.create_element_for_token(token_and_info.clone());

                    self.append_node(self.get_current_element(), element);
                }
                Token::EndTag { tag_name, .. } => {
                    if get_tag_name!(self.get_current_element()) != tag_name {
                        self.errors.push(Error::new(
                            token_and_info.span,
                            ErrorKind::OpeningAndEndingTagMismatch,
                        ));
                    }

                    let is_closed = self
                        .open_elements_stack
                        .items
                        .iter()
                        .rev()
                        .any(|node| get_tag_name!(node) == tag_name);

                    if is_closed {
                        let popped = self
                            .open_elements_stack
                            .pop_until_tag_name_popped(&[tag_name]);

                        self.update_end_tag_span(popped.as_ref(), token_and_info.span);
                    }

                    if self.open_elements_stack.items.is_empty() {
                        self.phase = Phase::EndPhase;
                    }
                }
                Token::Comment { .. } => {
                    let comment = self.create_comment(token_and_info);

                    self.append_node(self.get_current_element(), comment);
                }
                Token::ProcessingInstruction { .. } => {
                    let processing_instruction = self.create_processing_instruction(token_and_info);

                    self.append_node(self.get_current_element(), processing_instruction);
                }
                Token::Cdata { .. } => {
                    let cdata = self.create_cdata_section(token_and_info);

                    self.append_node(self.get_current_element(), cdata);
                }
                Token::Eof => {
                    self.errors.push(Error::new(
                        token_and_info.span,
                        ErrorKind::UnexpectedEofInMainPhase,
                    ));

                    self.process_token(token_and_info, Some(Phase::EndPhase))?;
                }
                _ => {
                    self.errors.push(Error::new(
                        token_and_info.span,
                        ErrorKind::UnexpectedTokenInMainPhase,
                    ));
                }
            },
            Phase::EndPhase => match &token_and_info.token {
                Token::Comment { .. } => {
                    self.append_comment_to_doc(token_and_info)?;
                }
                Token::ProcessingInstruction { .. } => {
                    self.append_processing_instruction_to_doc(token_and_info)?;
                }
                Token::Cdata { .. } => {
                    self.errors.push(Error::new(
                        token_and_info.span,
                        ErrorKind::UnexpectedTokenInEndPhase,
                    ));

                    self.append_cdata_to_doc(token_and_info)?;
                }
                Token::Character { value, .. } => {
                    if !is_whitespace(*value) {
                        self.errors.push(Error::new(
                            token_and_info.span,
                            ErrorKind::UnexpectedCharacter,
                        ));
                    }
                }
                Token::Eof => {
                    self.stopped = true;
                }
                _ => {
                    self.errors.push(Error::new(
                        token_and_info.span,
                        ErrorKind::UnexpectedTokenInEndPhase,
                    ));
                }
            },
        }

        Ok(())
    }

    fn append_node(&self, parent: &RcNode, child: RcNode) {
        let previous_parent = child.parent.replace(Some(Rc::downgrade(parent)));

        // Invariant: child cannot have existing parent
        assert!(previous_parent.is_none());

        parent.children.borrow_mut().push(child);
    }

    fn get_current_element(&self) -> &RcNode {
        self.open_elements_stack
            .items
            .last()
            .expect("no current element")
    }

    fn create_document_type_for_token(&self, token_and_info: &mut TokenAndInfo) -> RcNode {
        let (name, public_id, system_id, raw) = match &token_and_info.token {
            Token::Doctype {
                name,
                public_id,
                system_id,
                raw,
            } => (
                name.clone(),
                public_id.clone(),
                system_id.clone(),
                raw.clone(),
            ),
            _ => {
                unreachable!()
            }
        };

        Node::new(
            Data::DocumentType {
                name,
                public_id,
                system_id,
                raw,
            },
            token_and_info.span,
        )
    }

    fn create_element_for_token(&self, token_and_info: TokenAndInfo) -> RcNode {
        let element = match token_and_info.token {
            Token::StartTag {
                tag_name,
                attributes,
                ..
            }
            | Token::EndTag {
                tag_name,
                attributes,
                ..
            }
            | Token::EmptyTag {
                tag_name,
                attributes,
                ..
            } => {
                let attributes = attributes
                    .into_iter()
                    .map(|attribute_token| Attribute {
                        span: attribute_token.span,
                        namespace: None,
                        prefix: None,
                        name: attribute_token.name,
                        raw_name: attribute_token.raw_name,
                        value: attribute_token.value,
                        raw_value: attribute_token.raw_value,
                    })
                    .collect();

                Data::Element {
                    tag_name,
                    attributes: RefCell::new(attributes),
                }
            }
            _ => {
                unreachable!();
            }
        };

        Node::new(element, token_and_info.span)
    }

    fn append_character_to_current_element(
        &mut self,
        token_and_info: &mut TokenAndInfo,
    ) -> PResult<()> {
        if let Some(last) = self.open_elements_stack.items.last() {
            let children = last.children.borrow();

            if let Some(last) = children.last() {
                if let Data::Text {
                    data,
                    raw: raw_data,
                } = &last.data
                {
                    match &token_and_info.token {
                        Token::Character {
                            value: c,
                            raw: raw_c,
                        } => {
                            data.borrow_mut().push(*c);

                            if let Some(raw_c) = raw_c {
                                raw_data.borrow_mut().push_str(raw_c);
                            }
                        }
                        _ => {
                            unreachable!();
                        }
                    }

                    let mut span = last.end_span.borrow_mut();

                    *span = Some(token_and_info.span);

                    return Ok(());
                }
            }
        }

        let (data, raw) = match &token_and_info.token {
            Token::Character {
                value: c,
                raw: raw_c,
            } => {
                let mut data = String::with_capacity(255);

                data.push(*c);

                let mut raw = String::with_capacity(255);

                if let Some(raw_c) = raw_c {
                    raw.push_str(raw_c);
                }

                (RefCell::new(data), RefCell::new(raw))
            }
            _ => {
                unreachable!()
            }
        };

        let text = Node::new(Data::Text { data, raw }, token_and_info.span);

        self.append_node(self.get_current_element(), text);

        Ok(())
    }

    fn create_comment(&self, token_and_info: &mut TokenAndInfo) -> RcNode {
        let (data, raw) = match &token_and_info.token {
            Token::Comment { data, raw } => (data.clone(), Some(raw.clone())),
            _ => {
                unreachable!()
            }
        };

        Node::new(Data::Comment { data, raw }, token_and_info.span)
    }

    fn append_comment_to_doc(&mut self, token_and_info: &mut TokenAndInfo) -> PResult<()> {
        let comment = self.create_comment(token_and_info);

        self.append_node(self.document.as_ref().unwrap(), comment);

        Ok(())
    }

    fn create_processing_instruction(&self, token_and_info: &mut TokenAndInfo) -> RcNode {
        let (target, data) = match &token_and_info.token {
            Token::ProcessingInstruction { target, data } => (target.clone(), data.clone()),
            _ => {
                unreachable!()
            }
        };

        Node::new(
            Data::ProcessingInstruction { target, data },
            token_and_info.span,
        )
    }

    fn append_processing_instruction_to_doc(
        &mut self,
        token_and_info: &mut TokenAndInfo,
    ) -> PResult<()> {
        let child = self.create_processing_instruction(token_and_info);

        self.append_node(self.document.as_ref().unwrap(), child);

        Ok(())
    }

    fn create_cdata_section(&self, token_and_info: &mut TokenAndInfo) -> RcNode {
        let (data, raw) = match &token_and_info.token {
            Token::Cdata { data, raw } => (data.clone(), Some(raw.clone())),
            _ => {
                unreachable!()
            }
        };

        Node::new(Data::CdataSection { data, raw }, token_and_info.span)
    }

    fn append_cdata_to_doc(&mut self, token_and_info: &mut TokenAndInfo) -> PResult<()> {
        let child = self.create_cdata_section(token_and_info);

        self.append_node(self.document.as_ref().unwrap(), child);

        Ok(())
    }

    fn update_end_tag_span(&self, node: Option<&RcNode>, span: Span) {
        if let Some(node) = node {
            if node.start_span.borrow().is_dummy() {
                return;
            }

            let mut end_tag_span = node.end_span.borrow_mut();

            *end_tag_span = Some(span);
        }
    }
}

fn is_whitespace(c: char) -> bool {
    matches!(c, '\t' | '\r' | '\n' | '\x0C' | ' ')
}
