use std::{cell::RefCell, mem, rc::Rc};

use active_formatting_element_stack::*;
use doctypes::*;
use node::*;
use open_elements_stack::*;
use swc_atoms::Atom;
use swc_common::{Span, DUMMY_SP};
use swc_html_ast::*;

use self::input::{Buffer, ParserInput};
use crate::{
    error::{Error, ErrorKind},
    lexer::State,
};

#[macro_use]
mod macros;
mod active_formatting_element_stack;
mod doctypes;
pub mod input;
mod node;
mod open_elements_stack;

pub type PResult<T> = Result<T, Error>;

#[derive(Debug, Clone, Copy, Default, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct ParserConfig {
    pub scripting_enabled: bool,
    pub iframe_srcdoc: bool,
    // #8459
    pub allow_self_closing: bool,
}

enum Bookmark<RcNode> {
    Replace(RcNode),
    InsertAfter(RcNode),
}

enum AdjustAttributes {
    MathML,
    Svg,
}

#[derive(Debug, Clone, Default)]
enum InsertionMode {
    #[default]
    Initial,
    BeforeHtml,
    BeforeHead,
    InHead,
    InHeadNoScript,
    AfterHead,
    InBody,
    Text,
    InTable,
    InTableText,
    InCaption,
    InColumnGroup,
    InTableBody,
    InRow,
    InCell,
    InSelect,
    InSelectInTable,
    InTemplate,
    AfterBody,
    InFrameset,
    AfterFrameset,
    AfterAfterBody,
    AfterAfterFrameset,
}

enum InsertionPosition {
    LastChild(RcNode),
    BeforeSibling(RcNode),
}

pub struct Parser<I>
where
    I: ParserInput,
{
    #[allow(dead_code)]
    config: ParserConfig,
    input: Buffer<I>,
    stopped: bool,
    is_fragment_case: bool,
    context_element: Option<RcNode>,
    insertion_mode: InsertionMode,
    original_insertion_mode: InsertionMode,
    template_insertion_mode_stack: Vec<InsertionMode>,
    document: Option<RcNode>,
    head_element_pointer: Option<RcNode>,
    form_element_pointer: Option<RcNode>,
    open_elements_stack: OpenElementsStack,
    active_formatting_elements: ActiveFormattingElementStack,
    pending_character_tokens: Vec<TokenAndInfo>,
    frameset_ok: bool,
    foster_parenting_enabled: bool,
    errors: Vec<Error>,
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
            is_fragment_case: false,
            context_element: None,
            insertion_mode: Default::default(),
            original_insertion_mode: Default::default(),
            template_insertion_mode_stack: Vec::with_capacity(16),
            document: None,
            head_element_pointer: None,
            form_element_pointer: None,
            open_elements_stack: OpenElementsStack::new(),
            active_formatting_elements: ActiveFormattingElementStack::new(),
            pending_character_tokens: Vec::with_capacity(16),
            frameset_ok: true,
            foster_parenting_enabled: false,
            errors: Default::default(),
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

        self.document = Some(self.create_document(None));

        self.run()?;

        let document = &mut self.document.take().unwrap();
        let nodes = document.children.take();
        let mut children = Vec::with_capacity(nodes.len());

        for node in nodes {
            children.push(self.node_to_child(node));
        }

        let last = self.input.last_pos()?;
        let mode = match &document.data {
            Data::Document { mode, .. } => *mode.borrow(),
            _ => {
                unreachable!();
            }
        };

        Ok(Document {
            span: Span::new(start.lo(), last),
            mode,
            children,
        })
    }

    // The following steps form the HTML fragment parsing algorithm. The algorithm
    // takes as input an Element node, referred to as the context element, which
    // gives the context for the parser, as well as input, a string to parse, and
    // returns a list of zero or more nodes.
    //
    // Parts marked fragment case in algorithms in the parser section are parts that
    // only occur if the parser was created for the purposes of this algorithm. The
    // algorithms have been annotated with such markings for informational purposes
    // only; such markings have no normative weight. If it is possible for a
    // condition described as a fragment case to occur even when the parser wasn't
    // created for the purposes of handling this algorithm, then that is an error in
    // the specification.
    //
    // 1. Create a new Document node, and mark it as being an HTML document.
    //
    // 2. If the node document of the context element is in quirks mode, then let
    // the Document be in quirks mode. Otherwise, the node document of the
    // context element is in limited-quirks mode, then let the Document be in
    // limited-quirks mode. Otherwise, leave the Document in no-quirks mode.
    //
    // 3. Create a new HTML parser, and associate it with the just created Document
    // node.
    //
    // 4. Set the state of the HTML parser's tokenization stage as follows,
    // switching on the context element:
    //
    // title
    // textarea
    //
    // Switch the tokenizer to the RCDATA state.
    //
    // style
    // xmp
    // iframe
    // noembed
    // noframes
    //
    // Switch the tokenizer to the RAWTEXT state.
    //
    // script
    //
    // Switch the tokenizer to the script data state.
    //
    // noscript
    //
    // If the scripting flag is enabled, switch the tokenizer to the RAWTEXT state.
    // Otherwise, leave the tokenizer in the data state. plaintext
    //
    // Switch the tokenizer to the PLAINTEXT state.
    //
    // Any other element
    //
    // Leave the tokenizer in the data state.
    //
    // For performance reasons, an implementation that does not report errors and
    // that uses the actual state machine described in this specification directly
    // could use the PLAINTEXT state instead of the RAWTEXT and script data states
    // where those are mentioned in the list above. Except for rules regarding parse
    // errors, they are equivalent, since there is no appropriate end tag token in
    // the fragment case, yet they involve far fewer state transitions.
    //
    // 5. Let root be a new html element with no attributes.
    //
    // 6. Append the element root to the Document node created above.
    //
    // 7. Set up the parser's stack of open elements so that it contains just the
    // single element root.
    //
    // 8. If the context element is a template element, push "in template" onto the
    // stack of template insertion modes so that it is the new current template
    // insertion mode.
    //
    // 9. Create a start tag token whose name is the local name of context and whose
    // attributes are the attributes of context.
    //
    // Let this start tag token be the start tag token of the context node, e.g. for
    // the purposes of determining if it is an HTML integration point.
    //
    // 10. Reset the parser's insertion mode appropriately.
    //
    // The parser will reference the context element as part of that algorithm.
    //
    // 11. Set the parser's form element pointer to the nearest node to the context
    // element that is a form element (going straight up the ancestor chain, and
    // including the element itself, if it is a form element), if any. (If there is
    // no such form element, the form element pointer keeps its initial value,
    // null.)
    //
    // 12. Place the input into the input stream for the HTML parser just created.
    // The encoding confidence is irrelevant.
    //
    // 13. Start the parser and let it run until it has consumed all the characters
    // just inserted into the input stream.
    //
    // 14. Return the child nodes of root, in tree order.
    pub fn parse_document_fragment(
        &mut self,
        context_element: Element,
        mode: DocumentMode,
        form_element: Option<Element>,
    ) -> PResult<DocumentFragment> {
        // 1.
        // 2.
        self.document = Some(self.create_document(Some(mode)));

        // 3.
        // Parser already created
        let context_node = Node::new(
            Data::Element {
                namespace: context_element.namespace,
                tag_name: context_element.tag_name,
                attributes: RefCell::new(context_element.attributes),
                is_self_closing: context_element.is_self_closing,
            },
            DUMMY_SP,
        );

        // 4.
        match get_tag_name!(context_node) {
            "title" | "textarea" if get_namespace!(context_node) == Namespace::HTML => {
                self.input.set_input_state(State::Rcdata);
            }
            "style" | "xmp" | "iframe" | "noembed" | "noframes"
                if get_namespace!(context_node) == Namespace::HTML =>
            {
                self.input.set_input_state(State::Rawtext);
            }
            "script" if get_namespace!(context_node) == Namespace::HTML => {
                self.input.set_input_state(State::ScriptData);
            }
            "noscript" if get_namespace!(context_node) == Namespace::HTML => {
                if self.config.scripting_enabled {
                    self.input.set_input_state(State::Rawtext);
                } else {
                    self.input.set_input_state(State::Data)
                }
            }
            "plaintext" if get_namespace!(context_node) == Namespace::HTML => {
                self.input.set_input_state(State::PlainText)
            }
            _ => self.input.set_input_state(State::Data),
        }

        // 5.
        let root = self.create_fake_html_element();

        // 6.
        self.append_node(self.document.as_ref().unwrap(), root.clone());

        // 7.
        self.open_elements_stack.push(root.clone());

        // 8.
        if is_html_element!(context_node, "template") {
            self.template_insertion_mode_stack
                .push(InsertionMode::InTemplate);
        }

        // 9.
        self.context_element = Some(context_node.clone());
        self.is_fragment_case = true;

        // 10.
        self.reset_insertion_mode();

        // 11.
        if is_html_element!(context_node, "form") {
            self.form_element_pointer = Some(context_node);
        } else if let Some(form_element) = form_element {
            self.form_element_pointer = Some(Node::new(
                Data::Element {
                    namespace: form_element.namespace,
                    tag_name: form_element.tag_name,
                    attributes: RefCell::new(form_element.attributes),
                    is_self_closing: form_element.is_self_closing,
                },
                DUMMY_SP,
            ));
        }

        // 12.
        // We do preprocess input stream inside lexer

        // 13.
        let start = self.input.cur_span()?;

        self.run()?;

        let nodes = root.children.take();
        let mut children = Vec::with_capacity(nodes.len());

        for node in nodes {
            children.push(self.node_to_child(node));
        }

        let last = self.input.last_pos()?;

        Ok(DocumentFragment {
            span: Span::new(start.lo(), last),
            children,
        })
    }

    fn create_document(&self, mode: Option<DocumentMode>) -> RcNode {
        Node::new(
            Data::Document {
                mode: RefCell::new(mode.unwrap_or(DocumentMode::NoQuirks)),
            },
            DUMMY_SP,
        )
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
                namespace,
                tag_name,
                attributes,
                is_self_closing,
            } => {
                let nodes = node.children.take();
                let mut new_children = Vec::with_capacity(nodes.len());

                for node in nodes {
                    new_children.push(self.node_to_child(node));
                }

                let attributes = attributes.take();

                match &*tag_name {
                    "html" | "body" if namespace == Namespace::HTML => {
                        // Elements and text after `</html>` are moving into `<body>`
                        // Elements and text after `</body>` are moving into `<body>`
                        let span = if start_span.is_dummy() {
                            start_span
                        } else {
                            let end_body = match node.end_span.take() {
                                Some(end_tag_span) => end_tag_span,
                                _ => start_span,
                            };
                            let end_children = match self.get_deep_end_span(&new_children) {
                                Some(end_span) => end_span,
                                _ => start_span,
                            };

                            let end = if end_body.hi() >= end_children.hi() {
                                end_body
                            } else {
                                end_children
                            };

                            Span::new(start_span.lo(), end.hi())
                        };

                        Child::Element(Element {
                            span,
                            namespace,
                            tag_name,
                            attributes,
                            is_self_closing,
                            children: new_children,
                            content: None,
                        })
                    }
                    _ => {
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
                        let (children, content) =
                            if namespace == Namespace::HTML && &tag_name == "template" {
                                (
                                    Vec::new(),
                                    Some(DocumentFragment {
                                        span,
                                        children: new_children,
                                    }),
                                )
                            } else {
                                (new_children, None)
                            };

                        Child::Element(Element {
                            span,
                            namespace,
                            tag_name,
                            attributes,
                            is_self_closing,
                            children,
                            content,
                        })
                    }
                }
            }
            Data::Text { data, raw } => {
                let span = if let Some(end_span) = node.end_span.take() {
                    Span::new(start_span.lo(), end_span.hi())
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
            _ => {
                unreachable!();
            }
        }
    }

    fn run(&mut self) -> PResult<()> {
        while !self.stopped {
            let adjusted_current_node = self.get_adjusted_current_node();
            let is_element_in_html_namespace = is_element_in_html_namespace(adjusted_current_node);

            self.input
                .set_adjusted_current_node_to_html_namespace(is_element_in_html_namespace);

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

            // When a start tag token is emitted with its self-closing flag set,
            // if the flag is not acknowledged when it is processed by the tree
            // construction stage, that is a parse error.
            if let Token::StartTag {
                is_self_closing, ..
            } = &token_and_info.token
            {
                if *is_self_closing && !token_and_info.acknowledged {
                    self.errors.push(Error::new(
                        token_and_info.span,
                        ErrorKind::NonVoidHtmlElementStartTagWithTrailingSolidus,
                    ));
                }
            }
        }

        Ok(())
    }

    fn tree_construction_dispatcher(&mut self, token_and_info: &mut TokenAndInfo) -> PResult<()> {
        // As each token is emitted from the tokenizer, the user agent must follow the
        // appropriate steps from the following list, known as the tree construction
        // dispatcher:
        //
        // If the stack of open elements is empty
        //
        // If the adjusted current node is an element in the HTML namespace
        //
        // If the adjusted current node is a MathML text integration point and the token
        // is a start tag whose tag name is neither "mglyph" nor "malignmark"
        //
        // If the adjusted current node is a MathML text integration point and the token
        // is a character token
        //
        // If the adjusted current node is a MathML annotation-xml element and the token
        // is a start tag whose tag name is "svg"
        //
        // If the adjusted current node is an HTML integration point and the token is a
        // start tag
        //
        // If the adjusted current node is an HTML integration point and the token is a
        // character token
        //
        // If the token is an end-of-file token
        //
        // Process the token according to the rules given in the section corresponding
        // to the current insertion mode in HTML content.
        let adjusted_current_node = self.get_adjusted_current_node();

        let is_element_in_html_namespace = is_element_in_html_namespace(adjusted_current_node);
        let is_mathml_text_integration_point =
            is_mathml_text_integration_point(adjusted_current_node);
        let is_mathml_annotation_xml = is_mathml_annotation_xml(adjusted_current_node);
        let is_html_integration_point = is_html_integration_point(adjusted_current_node);

        if self.open_elements_stack.items.is_empty()
            || is_element_in_html_namespace
            || (is_mathml_text_integration_point
                && matches!(&token_and_info.token, Token::StartTag { tag_name, .. } if *tag_name != "mglyph" && *tag_name != "malignmark"))
            || (is_mathml_text_integration_point
                && matches!(&token_and_info.token, Token::Character { .. }))
            || (is_mathml_annotation_xml
                && matches!(&token_and_info.token, Token::StartTag { tag_name, .. } if tag_name == "svg"))
            || (is_html_integration_point
                && matches!(&token_and_info.token, Token::StartTag { .. }))
            || (is_html_integration_point
                && matches!(&token_and_info.token, Token::Character { .. }))
            || matches!(&token_and_info.token, Token::Eof)
        {
            self.process_token(token_and_info, None)?;
        }
        // Otherwise
        // Process the token according to the rules given in the section for parsing tokens in
        // foreign content.
        else {
            self.process_token_in_foreign_content(token_and_info)?;
        }

        Ok(())
    }

    // The adjusted current node is the context element if the parser was created as
    // part of the HTML fragment parsing algorithm and the stack of open elements
    // has only one element in it (fragment case); otherwise, the adjusted current
    // node is the current node.
    fn get_adjusted_current_node(&self) -> Option<&RcNode> {
        if self.is_fragment_case && self.open_elements_stack.items.len() == 1 {
            return self.context_element.as_ref();
        }

        self.open_elements_stack.items.last()
    }

    fn process_token_in_foreign_content(
        &mut self,
        token_and_info: &mut TokenAndInfo,
    ) -> PResult<()> {
        let TokenAndInfo { token, .. } = &token_and_info;

        match token {
            // A character token that is U+0000 NULL
            //
            // Parse error. Insert a U+FFFD REPLACEMENT CHARACTER character.
            Token::Character { value, .. } if *value == '\x00' => {
                self.errors.push(Error::new(
                    token_and_info.span,
                    ErrorKind::UnexpectedNullCharacter,
                ));

                token_and_info.token = Token::Character {
                    value: '\u{FFFD}',
                    raw: Some(Raw::Atom(Atom::new(String::from('\x00')))),
                };

                println!("{:?}", token_and_info.token);

                self.insert_character(token_and_info)?;
            }
            // A character token that is one of U+0009 CHARACTER TABULATION, U+000A LINE FEED (LF),
            // U+000C FORM FEED (FF), U+000D CARRIAGE RETURN (CR), or U+0020 SPACE
            //
            // Insert the token's character.
            Token::Character {
                value: '\x09' | '\x0A' | '\x0C' | '\x0D' | '\x20',
                ..
            } => {
                self.insert_character(token_and_info)?;
            }
            // Any other character token
            //
            // Insert the token's character.
            //
            // Set the frameset-ok flag to "not ok".
            Token::Character { .. } => {
                self.insert_character(token_and_info)?;

                self.frameset_ok = false;
            }
            // A comment token
            //
            // Insert a comment.
            Token::Comment { .. } => {
                self.insert_comment(token_and_info)?;
            }
            // A DOCTYPE token
            // Parse error. Ignore the token.
            Token::Doctype { .. } => {
                self.errors
                    .push(Error::new(token_and_info.span, ErrorKind::StrayDoctype));
            }
            // A start tag whose tag name is one of: "b", "big", "blockquote", "body", "br",
            // "center", "code", "dd", "div", "dl", "dt", "em", "embed", "h1", "h2", "h3", "h4",
            // "h5", "h6", "head", "hr", "i", "img", "li", "listing", "menu", "meta", "nobr", "ol",
            // "p", "pre", "ruby", "s", "small", "span", "strong", "strike", "sub", "sup", "table",
            // "tt", "u", "ul", "var"
            //
            // A start tag whose tag name is "font", if the token has any attributes named "color",
            // "face", or "size"
            //
            // An end tag whose tag name is "br", "p"
            //
            // Parse error.
            //
            // While the current node is not a MathML text integration point, an HTML integration
            // point, or an element in the HTML namespace, pop elements from the stack of open
            // elements.
            //
            // Reprocess the token according to the rules given in the section corresponding to the
            // current insertion mode in HTML content.
            Token::StartTag { tag_name, .. }
                if matches!(
                    &**tag_name,
                    "b" | "big"
                        | "blockquote"
                        | "body"
                        | "br"
                        | "center"
                        | "code"
                        | "dd"
                        | "div"
                        | "dl"
                        | "dt"
                        | "em"
                        | "embed"
                        | "h1"
                        | "h2"
                        | "h3"
                        | "h4"
                        | "h5"
                        | "h6"
                        | "head"
                        | "hr"
                        | "i"
                        | "img"
                        | "li"
                        | "listing"
                        | "menu"
                        | "meta"
                        | "nobr"
                        | "ol"
                        | "p"
                        | "pre"
                        | "ruby"
                        | "s"
                        | "small"
                        | "span"
                        | "strong"
                        | "strike"
                        | "sub"
                        | "sup"
                        | "table"
                        | "tt"
                        | "u"
                        | "ul"
                        | "var"
                ) =>
            {
                self.errors.push(Error::new(
                    token_and_info.span,
                    ErrorKind::HtmlStartTagInForeignContext(tag_name.clone()),
                ));
                self.open_elements_stack.pop_until_in_foreign();
                self.process_token(token_and_info, None)?;
            }
            Token::StartTag {
                tag_name,
                attributes,
                ..
            } if tag_name == "font"
                && attributes
                    .iter()
                    .any(|attribute| matches!(&*attribute.name, "color" | "face" | "size")) =>
            {
                self.errors.push(Error::new(
                    token_and_info.span,
                    ErrorKind::HtmlStartTagInForeignContext(tag_name.clone()),
                ));
                self.open_elements_stack.pop_until_in_foreign();
                self.process_token(token_and_info, None)?;
            }
            Token::EndTag { tag_name, .. } if matches!(&**tag_name, "br" | "p") => {
                let last = get_tag_name!(self.open_elements_stack.items.last().unwrap());

                self.errors.push(Error::new(
                    token_and_info.span,
                    ErrorKind::EndTagDidNotMatchCurrentOpenElement(tag_name.clone(), last.into()),
                ));
                self.open_elements_stack.pop_until_in_foreign();
                self.process_token(token_and_info, None)?;
            }
            // Any other start tag
            //
            // If the adjusted current node is an element in the MathML namespace, adjust MathML
            // attributes for the token. (This fixes the case of MathML attributes that are not all
            // lowercase.)
            //
            // If the adjusted current node is an element in the SVG namespace, and the token's tag
            // name is one of the ones in the first column of the following table, change the tag
            // name to the name given in the corresponding cell in the second column. (This fixes
            // the case of SVG elements that are not all lowercase.)
            //
            // Tag name	            Element name
            // altglyph	            altGlyph
            // altglyphdef	        altGlyphDef
            // altglyphitem	        altGlyphItem
            // animatecolor	        animateColor
            // animatemotion	    animateMotion
            // animatetransform	    animateTransform
            // clippath	            clipPath
            // feblend	            feBlend
            // fecolormatrix	    feColorMatrix
            // fecomponenttransfer	feComponentTransfer
            // fecomposite	        feComposite
            // feconvolvematrix	    feConvolveMatrix
            // fediffuselighting	feDiffuseLighting
            // fedisplacementmap	feDisplacementMap
            // fedistantlight	    feDistantLight
            // fedropshadow	        feDropShadow
            // feflood	            feFlood
            // fefunca	            feFuncA
            // fefuncb	            feFuncB
            // fefuncg	            feFuncG
            // fefuncr	            feFuncR
            // fegaussianblur	    feGaussianBlur
            // feimage	            feImage
            // femerge	            feMerge
            // femergenode	        feMergeNode
            // femorphology	        feMorphology
            // feoffset	            feOffset
            // fepointlight	        fePointLight
            // fespecularlighting	feSpecularLighting
            // fespotlight	        feSpotLight
            // fetile	            feTile
            // feturbulence	        feTurbulence
            // foreignobject	    foreignObject
            // glyphref	            glyphRef
            // lineargradient	    linearGradient
            // radialgradient	    radialGradient
            // textpath	            textPath
            //
            // If the adjusted current node is an element in the SVG namespace, adjust SVG
            // attributes for the token. (This fixes the case of SVG attributes that are not all
            // lowercase.)
            //
            // Adjust foreign attributes for the token. (This fixes the use of namespaced
            // attributes, in particular XLink in SVG.)
            //
            // Insert a foreign element for the token, in the same namespace as the adjusted current
            // node.
            //
            // If the token has its self-closing flag set, then run the appropriate steps from the
            // following list:
            //
            //      If the token's tag name is "script", and the new current node is in the SVG
            //      namespace
            //
            //      Acknowledge the token's self-closing flag, and then act as
            //      described in the steps for a "script" end tag below.
            //
            // Otherwise
            //      Pop the current node off the stack of open elements and acknowledge the token's
            //      self-closing flag.
            Token::StartTag {
                tag_name,
                raw_tag_name,
                is_self_closing,
                attributes,
            } => {
                let is_self_closing = *is_self_closing;
                let is_script = tag_name == "script";
                let adjusted_current_node = self.get_adjusted_current_node();
                let namespace = match adjusted_current_node {
                    Some(node) => {
                        get_namespace!(node)
                    }
                    _ => {
                        unreachable!();
                    }
                };
                let adjust_attributes = match namespace {
                    Namespace::MATHML => Some(AdjustAttributes::MathML),
                    Namespace::SVG => Some(AdjustAttributes::Svg),
                    _ => None,
                };

                if namespace == Namespace::SVG {
                    let new_tag_name = match &**tag_name {
                        "altglyph" => Some("altGlyph"),
                        "altglyphdef" => Some("altGlyphDef"),
                        "altglyphitem" => Some("altGlyphItem"),
                        "animatecolor" => Some("animateColor"),
                        "animatemotion" => Some("animateMotion"),
                        "animatetransform" => Some("animateTransform"),
                        "clippath" => Some("clipPath"),
                        "feblend" => Some("feBlend"),
                        "fecolormatrix" => Some("feColorMatrix"),
                        "fecomponenttransfer" => Some("feComponentTransfer"),
                        "fecomposite" => Some("feComposite"),
                        "feconvolvematrix" => Some("feConvolveMatrix"),
                        "fediffuselighting" => Some("feDiffuseLighting"),
                        "fedisplacementmap" => Some("feDisplacementMap"),
                        "fedistantlight" => Some("feDistantLight"),
                        "fedropshadow" => Some("feDropShadow"),
                        "feflood" => Some("feFlood"),
                        "fefunca" => Some("feFuncA"),
                        "fefuncb" => Some("feFuncB"),
                        "fefuncg" => Some("feFuncG"),
                        "fefuncr" => Some("feFuncR"),
                        "fegaussianblur" => Some("feGaussianBlur"),
                        "feimage" => Some("feImage"),
                        "femerge" => Some("feMerge"),
                        "femergenode" => Some("feMergeNode"),
                        "femorphology" => Some("feMorphology"),
                        "feoffset" => Some("feOffset"),
                        "fepointlight" => Some("fePointLight"),
                        "fespecularlighting" => Some("feSpecularLighting"),
                        "fespotlight" => Some("feSpotLight"),
                        "fetile" => Some("feTile"),
                        "feturbulence" => Some("feTurbulence"),
                        "foreignobject" => Some("foreignObject"),
                        "glyphref" => Some("glyphRef"),
                        "lineargradient" => Some("linearGradient"),
                        "radialgradient" => Some("radialGradient"),
                        "textpath" => Some("textPath"),
                        _ => None,
                    };

                    if let Some(new_tag_name) = new_tag_name {
                        token_and_info.token = Token::StartTag {
                            tag_name: new_tag_name.into(),
                            raw_tag_name: raw_tag_name.clone(),
                            is_self_closing,
                            attributes: attributes.clone(),
                        }
                    }
                }

                self.insert_foreign_element(token_and_info, namespace, adjust_attributes)?;

                if is_self_closing {
                    if is_script
                        && match self.open_elements_stack.items.last() {
                            Some(node) => get_namespace!(node) == Namespace::SVG,
                            _ => false,
                        }
                    {
                        token_and_info.acknowledged = true;

                        self.open_elements_stack.pop();
                    } else {
                        self.open_elements_stack.pop();

                        token_and_info.acknowledged = true;
                    }
                }
            }
            // An end tag whose tag name is "script", if the current node is an SVG script element
            //
            // Pop the current node off the stack of open elements.
            //
            // Let the old insertion point have the same value as the current insertion point. Let
            // the insertion point be just before the next input character.
            //
            // Increment the parser's script nesting level by one. Set the parser pause flag to
            // true.
            //
            // If the active speculative HTML parser is null and the user agent supports SVG, then
            // Process the SVG script element according to the SVG rules. [SVG]
            //
            // Even if this causes new characters to be inserted into the tokenizer, the parser will
            // not be executed reentrantly, since the parser pause flag is true.
            //
            // Decrement the parser's script nesting level by one. If the parser's script nesting
            // level is zero, then set the parser pause flag to false.
            //
            // Let the insertion point have the value of the old insertion point. (In other words,
            // restore the insertion point to its previous value. This value might be the
            // "undefined" value.)
            Token::EndTag { tag_name, .. } if tag_name == "script" => {
                let popped = self.open_elements_stack.pop();

                self.update_end_tag_span(popped.as_ref(), token_and_info.span);

                // No need to handle other steps
            }
            // Any other end tag
            //
            // Run these steps:
            //
            // Initialize node to be the current node (the bottommost node of the stack).
            //
            // If node's tag name, converted to ASCII lowercase, is not the same as the tag name of
            // the token, then this is a parse error.
            //
            // Loop: If node is the topmost element in the stack of open elements, then return.
            // (fragment case)
            //
            // If node's tag name, converted to ASCII lowercase, is the same as the tag name of the
            // token, pop elements from the stack of open elements until node has been popped from
            // the stack, and then return.
            //
            // Set node to the previous entry in the stack of open elements.
            //
            // If node is not an element in the HTML namespace, return to the step labeled loop.
            //
            // Otherwise, process the token according to the rules given in the section
            // corresponding to the current insertion mode in HTML content.
            Token::EndTag { tag_name, .. } => {
                let mut node = self.open_elements_stack.items.last();
                let mut stack_idx = self.open_elements_stack.items.len() - 1;

                if let Some(node) = &node {
                    let node_tag_name = get_tag_name!(node);

                    if node_tag_name.to_ascii_lowercase() != **tag_name {
                        if stack_idx == 0 {
                            self.errors.push(Error::new(
                                token_and_info.span,
                                ErrorKind::StrayEndTag(tag_name.clone()),
                            ));
                        } else {
                            self.errors.push(Error::new(
                                token_and_info.span,
                                ErrorKind::EndTagDidNotMatchCurrentOpenElement(
                                    tag_name.clone(),
                                    node_tag_name.into(),
                                ),
                            ));
                        }
                    }
                }

                loop {
                    if stack_idx == 0 || node.is_none() {
                        return Ok(());
                    }

                    let inner_node = node.unwrap();

                    match &inner_node.data {
                        Data::Element {
                            tag_name: node_tag_name,
                            ..
                        } if node_tag_name.to_ascii_lowercase() == **tag_name => {
                            let clone = inner_node.clone();
                            let popped = self.open_elements_stack.pop_until_node(&clone);

                            self.update_end_tag_span(popped.as_ref(), token_and_info.span);

                            return Ok(());
                        }
                        _ => {}
                    }

                    stack_idx -= 1;
                    node = self.open_elements_stack.items.get(stack_idx);

                    if let Some(node) = node {
                        if get_namespace!(node) == Namespace::HTML {
                            break;
                        }
                    }
                }

                self.process_token(token_and_info, None)?;
            }
            // EOF token is not reachable here
            _ => {
                unreachable!();
            }
        }

        Ok(())
    }

    fn process_token(
        &mut self,
        token_and_info: &mut TokenAndInfo,
        override_insertion_mode: Option<InsertionMode>,
    ) -> PResult<()> {
        let TokenAndInfo { token, .. } = &token_and_info;
        let insertion_mode = match override_insertion_mode {
            Some(insertion_mode) => insertion_mode,
            _ => self.insertion_mode.clone(),
        };

        /// Convenience: allow non-void HTML elements to self-close when
        /// a relevant config flag is set. It is achieved by processing the
        /// matching end tag right after the starting self-closing tag.
        macro_rules! maybe_allow_self_closing {
            ($is_self_closing: ident, $tag_name: ident) => {
                if self.config.allow_self_closing && *$is_self_closing {
                    let mut end_token_and_info = TokenAndInfo {
                        span: token_and_info.span,
                        acknowledged: false,
                        token: Token::EndTag {
                            tag_name: $tag_name.to_owned(),
                            raw_tag_name: None,
                            is_self_closing: false,
                            attributes: Vec::new(),
                        },
                    };
                    self.process_token(&mut end_token_and_info, None)?;
                }
            };
        }

        match insertion_mode {
            // The "initial" insertion mode
            InsertionMode::Initial => {
                // A Document object has an associated parser cannot change the mode flag (a
                // boolean). It is initially false.

                // When the user agent is to apply the rules for the "initial" insertion mode,
                // the user agent must handle the token as follows:
                match token {
                    // A character token that is one of U+0009 CHARACTER TABULATION, U+000A LINE
                    // FEED (LF), U+000C FORM FEED (FF), U+000D CARRIAGE RETURN (CR), or U+0020
                    // SPACE
                    //
                    // Ignore the token.
                    Token::Character {
                        value: '\x09' | '\x0A' | '\x0C' | '\x0D' | '\x20',
                        ..
                    } => {
                        return Ok(());
                    }
                    // A comment token
                    //
                    // Insert a comment as the last child of the Document object.
                    Token::Comment { .. } => {
                        self.insert_comment_as_last_child_of_document(token_and_info)?;
                    }
                    // A DOCTYPE token
                    //
                    // If the DOCTYPE token's name is not "html", or the token's public identifier
                    // is not missing, or the token's system identifier is neither missing nor
                    // "about:legacy-compat", then there is a parse error.
                    //
                    // Append a DocumentType node to the Document node, with its name set to the
                    // name given in the DOCTYPE token, or the empty string if the name was missing;
                    // its public ID set to the public identifier given in the DOCTYPE token, or the
                    // empty string if the public identifier was missing; and its system ID set to
                    // the system identifier given in the DOCTYPE token, or the empty string if the
                    // system identifier was missing.
                    //
                    // Then, if the document is not an iframe srcdoc document, and the parser cannot
                    // change the mode flag is false, and the DOCTYPE token matches one of the
                    // conditions in the following list, then set the Document to quirks mode:
                    //
                    // The force-quirks flag is set to on.
                    //
                    // The name is not "html".
                    //
                    // The public identifier is set to: "-//W3O//DTD W3 HTML Strict 3.0//EN//"
                    //
                    // The public identifier is set to: "-/W3C/DTD HTML 4.0 Transitional/EN"
                    //
                    // The public identifier is set to: "HTML"
                    //
                    // The system identifier is set to: "http://www.ibm.com/data/dtd/v11/ibmxhtml1-transitional.dtd"
                    //
                    // The public identifier starts with: "+//Silmaril//dtd html Pro v0r11
                    // 19970101//"
                    //
                    // The public identifier starts with: "-//AS//DTD HTML 3.0 asWedit +
                    // extensions//"
                    //
                    // The public identifier starts with: "-//AdvaSoft Ltd//DTD HTML 3.0 asWedit +
                    // extensions//"
                    //
                    // The public identifier starts with: "-//IETF//DTD HTML 2.0 Level 1//"
                    //
                    // The public identifier starts with: "-//IETF//DTD HTML 2.0 Level 2//"
                    //
                    // The public identifier starts with: "-//IETF//DTD HTML 2.0 Strict Level 1//"
                    //
                    // The public identifier starts with: "-//IETF//DTD HTML 2.0 Strict Level 2//"
                    //
                    // The public identifier starts with: "-//IETF//DTD HTML 2.0 Strict//"
                    //
                    // The public identifier starts with: "-//IETF//DTD HTML 2.0//"
                    //
                    // The public identifier starts with: "-//IETF//DTD HTML 2.1E//"
                    //
                    // The public identifier starts with: "-//IETF//DTD HTML 3.0//"
                    //
                    // The public identifier starts with: "-//IETF//DTD HTML 3.2 Final//"
                    //
                    // The public identifier starts with: "-//IETF//DTD HTML 3.2//"
                    //
                    // The public identifier starts with: "-//IETF//DTD HTML 3//"
                    //
                    // The public identifier starts with: "-//IETF//DTD HTML Level 0//"
                    //
                    // The public identifier starts with: "-//IETF//DTD HTML Level 1//"
                    //
                    // The public identifier starts with: "-//IETF//DTD HTML Level 2//"
                    //
                    // The public identifier starts with: "-//IETF//DTD HTML Level 3//"
                    //
                    // The public identifier starts with: "-//IETF//DTD HTML Strict Level 0//"
                    //
                    // The public identifier starts with: "-//IETF//DTD HTML Strict Level 1//"
                    //
                    // The public identifier starts with: "-//IETF//DTD HTML Strict Level 2//"
                    //
                    // The public identifier starts with: "-//IETF//DTD HTML Strict Level 3//"
                    //
                    // The public identifier starts with: "-//IETF//DTD HTML Strict//"
                    //
                    // The public identifier starts with: "-//IETF//DTD HTML//"
                    //
                    // The public identifier starts with: "-//Metrius//DTD Metrius Presentational//"
                    //
                    // The public identifier starts with: "-//Microsoft//DTD Internet Explorer 2.0
                    // HTML Strict//"
                    //
                    // The public identifier starts with: "-//Microsoft//DTD Internet Explorer 2.0
                    // HTML//"
                    //
                    // The public identifier starts with: "-//Microsoft//DTD Internet Explorer 2.0
                    // Tables//"
                    //
                    // The public identifier starts with: "-//Microsoft//DTD Internet Explorer 3.0
                    // HTML Strict//"
                    //
                    // The public identifier starts with: "-//Microsoft//DTD Internet Explorer 3.0
                    // HTML//"
                    //
                    // The public identifier starts with: "-//Microsoft//DTD Internet Explorer 3.0
                    // Tables//"
                    //
                    // The public identifier starts with: "-//Netscape Comm. Corp.//DTD HTML//"
                    //
                    // The public identifier starts with: "-//Netscape Comm. Corp.//DTD Strict
                    // HTML//"
                    //
                    // The public identifier starts with: "-//O'Reilly and Associates//DTD HTML
                    // 2.0//"
                    //
                    // The public identifier starts with: "-//O'Reilly and Associates//DTD HTML
                    // Extended 1.0//"
                    //
                    // The public identifier starts with: "-//O'Reilly and Associates//DTD HTML
                    // Extended Relaxed 1.0//"
                    //
                    // The public identifier starts with: "-//SQ//DTD HTML 2.0 HoTMetaL +
                    // extensions//"
                    //
                    // The public identifier starts with: "-//SoftQuad Software//DTD HoTMetaL PRO
                    // 6.0::19990601::extensions to HTML 4.0//"
                    //
                    // The public identifier starts with: "-//SoftQuad//DTD HoTMetaL PRO
                    // 4.0::19971010::extensions to HTML 4.0//"
                    //
                    // The public identifier starts with: "-//Spyglass//DTD HTML 2.0 Extended//"
                    //
                    // The public identifier starts with: "-//Sun Microsystems Corp.//DTD HotJava
                    // HTML//"
                    //
                    // The public identifier starts with: "-//Sun Microsystems Corp.//DTD HotJava
                    // Strict HTML//"
                    //
                    // The public identifier starts with: "-//W3C//DTD HTML 3 1995-03-24//"
                    //
                    // The public identifier starts with: "-//W3C//DTD HTML 3.2 Draft//"
                    //
                    // The public identifier starts with: "-//W3C//DTD HTML 3.2 Final//"
                    //
                    // The public identifier starts with: "-//W3C//DTD HTML 3.2//"
                    //
                    // The public identifier starts with: "-//W3C//DTD HTML 3.2S Draft//"
                    //
                    // The public identifier starts with: "-//W3C//DTD HTML 4.0 Frameset//"
                    //
                    // The public identifier starts with: "-//W3C//DTD HTML 4.0 Transitional//"
                    //
                    // The public identifier starts with: "-//W3C//DTD HTML Experimental 19960712//"
                    //
                    // The public identifier starts with: "-//W3C//DTD HTML Experimental 970421//"
                    //
                    // The public identifier starts with: "-//W3C//DTD W3 HTML//"
                    //
                    // The public identifier starts with: "-//W3O//DTD W3 HTML 3.0//"
                    //
                    // The public identifier starts with: "-//WebTechs//DTD Mozilla HTML 2.0//"
                    //
                    // The public identifier starts with: "-//WebTechs//DTD Mozilla HTML//"
                    //
                    // The system identifier is missing and the public identifier starts with:
                    // "-//W3C//DTD HTML 4.01 Frameset//"
                    //
                    // The system identifier is missing and the public identifier starts with:
                    // "-//W3C//DTD HTML 4.01 Transitional//"
                    //
                    // Otherwise, if the document is not an iframe srcdoc document, and the parser
                    // cannot change the mode flag is false, and the DOCTYPE token matches one of
                    // the conditions in the following list, then then set the Document to
                    // limited-quirks mode:
                    //
                    // The public identifier starts with: "-//W3C//DTD XHTML 1.0 Frameset//"
                    //
                    // The public identifier starts with: "-//W3C//DTD XHTML 1.0 Transitional//"
                    //
                    // The system identifier is not missing and the public identifier starts with:
                    // "-//W3C//DTD HTML 4.01 Frameset//"
                    //
                    // The system identifier is not missing and the public identifier starts with:
                    // "-//W3C//DTD HTML 4.01 Transitional//"
                    //
                    // The system identifier and public identifier strings must be compared to the
                    // values given in the lists above in an ASCII case-insensitive manner. A system
                    // identifier whose value is the empty string is not considered missing for the
                    // purposes of the conditions above.
                    //
                    // Then, switch the insertion mode to "before html".
                    Token::Doctype {
                        name,
                        public_id,
                        system_id,
                        force_quirks,
                        raw,
                        ..
                    } => {
                        let is_html_name =
                            matches!(name, Some(name) if name.eq_ignore_ascii_case("html"));
                        let is_conforming_doctype = is_html_name
                            && public_id.is_none()
                            && (system_id.is_none()
                                || matches!(system_id, Some(system_id) if system_id == "about:legacy-compat"));

                        if !is_conforming_doctype {
                            self.errors.push(Error::new(
                                token_and_info.span,
                                ErrorKind::NonConformingDoctype,
                            ));
                        }

                        let document_type = Node::new(
                            Data::DocumentType {
                                name: name.clone(),
                                public_id: public_id.clone(),
                                system_id: system_id.clone(),
                                raw: raw.clone(),
                            },
                            token_and_info.span,
                        );

                        self.append_node(self.document.as_ref().unwrap(), document_type);

                        if !self.config.iframe_srcdoc
                            && (*force_quirks
                                || !is_html_name
                                || matches!(public_id, Some(public_id) if QUIRKY_PUBLIC_MATCHES
                                    .contains(&&*public_id.to_ascii_lowercase()) || QUIRKY_PUBLIC_PREFIXES.contains(&&*public_id.to_ascii_lowercase()))
                                || matches!(system_id, Some(system_id) if QUIRKY_SYSTEM_MATCHES
                                .contains(&&*system_id.to_ascii_lowercase()) || HTML4_PUBLIC_PREFIXES.contains(
                                    &&*system_id.to_ascii_lowercase()
                                )))
                        {
                            self.set_document_mode(DocumentMode::Quirks);
                        } else if let Some(public_id) = public_id {
                            if LIMITED_QUIRKY_PUBLIC_PREFIXES
                                .contains(&&*public_id.as_ref().to_ascii_lowercase())
                            {
                                self.set_document_mode(DocumentMode::Quirks);
                            }
                        } else if let Some(system_id) = system_id {
                            if HTML4_PUBLIC_PREFIXES
                                .contains(&&*system_id.as_ref().to_ascii_lowercase())
                            {
                                self.set_document_mode(DocumentMode::Quirks);
                            }
                        }

                        self.insertion_mode = InsertionMode::BeforeHtml;
                    }
                    // Anything else
                    //
                    // If the document is not an iframe srcdoc document, then this is a parse error;
                    // if the parser cannot change the mode flag is false, set the Document to
                    // quirks mode.
                    //
                    // In any case, switch the insertion mode to "before html", then reprocess the
                    // token.
                    _ => {
                        if !self.config.iframe_srcdoc {
                            match &token {
                                Token::StartTag { .. } => {
                                    self.errors.push(Error::new(
                                        token_and_info.span,
                                        ErrorKind::StartTagWithoutDoctype,
                                    ));
                                }
                                Token::EndTag { .. } => {
                                    self.errors.push(Error::new(
                                        token_and_info.span,
                                        ErrorKind::EndTagSeenWithoutDoctype,
                                    ));
                                }
                                Token::Character { .. } => {
                                    self.errors.push(Error::new(
                                        token_and_info.span,
                                        ErrorKind::NonSpaceCharacterWithoutDoctype,
                                    ));
                                }
                                Token::Eof => {
                                    self.errors.push(Error::new(
                                        token_and_info.span,
                                        ErrorKind::EofWithoutDoctype,
                                    ));
                                }
                                _ => {
                                    unreachable!();
                                }
                            }

                            self.set_document_mode(DocumentMode::Quirks);
                        }

                        self.insertion_mode = InsertionMode::BeforeHtml;
                        self.process_token(token_and_info, None)?;
                    }
                }
            }
            // The "before html" insertion mode
            InsertionMode::BeforeHtml => {
                let anything_else =
                    |parser: &mut Parser<I>, token_and_info: &mut TokenAndInfo| -> PResult<()> {
                        let element = parser.create_fake_html_element();

                        parser.open_elements_stack.push(element.clone());

                        // Never be `None`
                        if let Some(document) = &parser.document {
                            parser.append_node(document, element);
                        }

                        parser.insertion_mode = InsertionMode::BeforeHead;
                        parser.process_token(token_and_info, None)?;

                        Ok(())
                    };

                // When the user agent is to apply the rules for the "before html" insertion
                // mode, the user agent must handle the token as follows:
                match token {
                    // A DOCTYPE token
                    //
                    // Parse error. Ignore the token.
                    Token::Doctype { .. } => {
                        self.errors
                            .push(Error::new(token_and_info.span, ErrorKind::StrayDoctype));
                    }
                    // A comment token
                    //
                    // Insert a comment as the last child of the Document object.
                    Token::Comment { .. } => {
                        self.insert_comment_as_last_child_of_document(token_and_info)?;
                    }
                    // A character token that is one of U+0009 CHARACTER TABULATION, U+000A LINE
                    // FEED (LF), U+000C FORM FEED (FF), U+000D CARRIAGE RETURN (CR), or U+0020
                    // SPACE
                    //
                    // Ignore the token.
                    Token::Character {
                        value: '\x09' | '\x0A' | '\x0C' | '\x0D' | '\x20',
                        ..
                    } => {
                        return Ok(());
                    }
                    // A start tag whose tag name is "html"
                    //
                    // Create an element for the token in the HTML namespace, with the Document as
                    // the intended parent. Append it to the Document object. Put this element in
                    // the stack of open elements.
                    //
                    // Switch the insertion mode to "before head".
                    Token::StartTag {
                        tag_name,
                        attributes,
                        is_self_closing,
                        ..
                    } if tag_name == "html" => {
                        let element = Node::new(
                            Data::Element {
                                namespace: Namespace::HTML,
                                tag_name: tag_name.clone(),
                                attributes: RefCell::new(
                                    attributes
                                        .iter()
                                        .map(|token_attribute| Attribute {
                                            span: token_attribute.span,
                                            namespace: None,
                                            prefix: None,
                                            name: token_attribute.name.clone(),
                                            raw_name: token_attribute.raw_name.clone(),
                                            value: token_attribute.value.clone(),
                                            raw_value: token_attribute.raw_value.clone(),
                                        })
                                        .collect(),
                                ),
                                is_self_closing: *is_self_closing,
                            },
                            token_and_info.span,
                        );

                        self.open_elements_stack.push(element.clone());

                        // Never be `None`
                        if let Some(document) = &self.document {
                            self.append_node(document, element);
                        }

                        self.insertion_mode = InsertionMode::BeforeHead;
                    }
                    // An end tag whose tag name is one of: "head", "body", "html", "br"
                    //
                    // Act as described in the "anything else" entry below.
                    Token::EndTag { tag_name, .. }
                        if matches!(&**tag_name, "head" | "body" | "html" | "br") =>
                    {
                        anything_else(self, token_and_info)?;
                    }
                    // Any other end tag
                    //
                    // Parse error. Ignore the token.
                    Token::EndTag { tag_name, .. } => {
                        self.errors.push(Error::new(
                            token_and_info.span,
                            ErrorKind::StrayEndTag(tag_name.clone()),
                        ));
                    }
                    // Anything else
                    //
                    // Create an html element whose node document is the Document object. Append it
                    // to the Document object. Put this element in the stack of open elements.
                    //
                    // Switch the insertion mode to "before head", then reprocess the token.
                    _ => {
                        anything_else(self, token_and_info)?;
                    }
                }

                // The document element can end up being removed from the
                // Document object, e.g. by scripts; nothing in particular
                // happens in such cases, content continues being appended to
                // the nodes as described in the next section.
            }
            // The "before head" insertion mode
            InsertionMode::BeforeHead => {
                let anything_else = |parser: &mut Parser<I>,
                                     token_and_info: &mut TokenAndInfo|
                 -> PResult<()> {
                    let element = parser
                        .insert_html_element(&parser.create_fake_token_and_info("head", None))?;

                    parser.head_element_pointer = Some(element);
                    parser.insertion_mode = InsertionMode::InHead;
                    parser.process_token(token_and_info, None)?;

                    Ok(())
                };

                // When the user agent is to apply the rules for the "before head" insertion
                // mode, the user agent must handle the token as follows:
                match token {
                    // A character token that is one of U+0009 CHARACTER TABULATION, U+000A LINE
                    // FEED (LF), U+000C FORM FEED (FF), U+000D CARRIAGE RETURN (CR), or U+0020
                    // SPACE
                    //
                    // Ignore the token.
                    Token::Character {
                        value: '\x09' | '\x0A' | '\x0C' | '\x0D' | '\x20',
                        ..
                    } => {
                        return Ok(());
                    }
                    // A comment token
                    //
                    // Insert a comment.
                    Token::Comment { .. } => {
                        self.insert_comment(token_and_info)?;
                    }
                    // A DOCTYPE token
                    //
                    // Parse error. Ignore the token.
                    Token::Doctype { .. } => {
                        self.errors
                            .push(Error::new(token_and_info.span, ErrorKind::StrayDoctype));
                    }
                    // A start tag whose tag name is "html"
                    //
                    // Process the token using the rules for the "in body" insertion mode.
                    Token::StartTag { tag_name, .. } if tag_name == "html" => {
                        self.process_token_using_rules(token_and_info, InsertionMode::InBody)?;
                    }
                    // A start tag whose tag name is "head"
                    //
                    // Insert an HTML element for the token.
                    //
                    // Set the head element pointer to the newly created head element.
                    //
                    // Switch the insertion mode to "in head".
                    Token::StartTag { tag_name, .. } if tag_name == "head" => {
                        let element = self.insert_html_element(token_and_info)?;

                        self.head_element_pointer = Some(element);
                        self.insertion_mode = InsertionMode::InHead;
                    }
                    // An end tag whose tag name is one of: "head", "body", "html", "br"
                    //
                    // Act as described in the "anything else" entry below.
                    Token::EndTag { tag_name, .. }
                        if matches!(&**tag_name, "head" | "body" | "html" | "br") =>
                    {
                        anything_else(self, token_and_info)?;
                    }
                    // Any other end tag
                    //
                    // Parse error. Ignore the token.
                    Token::EndTag { tag_name, .. } => {
                        self.errors.push(Error::new(
                            token_and_info.span,
                            ErrorKind::StrayEndTag(tag_name.clone()),
                        ));
                    }
                    // Anything else
                    //
                    // Insert an HTML element for a "head" start tag token with no attributes.
                    //
                    // Set the head element pointer to the newly created head element.
                    //
                    // Switch the insertion mode to "in head".
                    //
                    // Reprocess the current token.
                    _ => {
                        anything_else(self, token_and_info)?;
                    }
                }
            }
            // The "in head" insertion mode
            InsertionMode::InHead => {
                let anything_else =
                    |parser: &mut Parser<I>, token_and_info: &mut TokenAndInfo| -> PResult<()> {
                        parser.open_elements_stack.pop();
                        parser.insertion_mode = InsertionMode::AfterHead;
                        parser.process_token(token_and_info, None)?;

                        Ok(())
                    };

                // When the user agent is to apply the rules for the "in head" insertion mode,
                // the user agent must handle the token as follows:
                match token {
                    // A character token that is one of U+0009 CHARACTER TABULATION, U+000A LINE
                    // FEED (LF), U+000C FORM FEED (FF), U+000D CARRIAGE RETURN (CR), or U+0020
                    // SPACE
                    //
                    // Insert the character.
                    Token::Character {
                        value: '\x09' | '\x0A' | '\x0C' | '\x0D' | '\x20',
                        ..
                    } => {
                        self.insert_character(token_and_info)?;
                    }
                    // A comment token
                    //
                    // Insert a comment.
                    Token::Comment { .. } => {
                        self.insert_comment(token_and_info)?;
                    }
                    // A DOCTYPE token
                    //
                    // Parse error. Ignore the token.
                    Token::Doctype { .. } => {
                        self.errors
                            .push(Error::new(token_and_info.span, ErrorKind::StrayDoctype));
                    }
                    // A start tag whose tag name is "html"
                    //
                    // Process the token using the rules for the "in body" insertion mode.
                    Token::StartTag { tag_name, .. } if tag_name == "html" => {
                        self.process_token_using_rules(token_and_info, InsertionMode::InBody)?;
                    }
                    // A start tag whose tag name is one of: "base", "basefont", "bgsound", "link"
                    //
                    // Insert an HTML element for the token. Immediately pop the current node off
                    // the stack of open elements.
                    //
                    // Acknowledge the token's self-closing flag, if it is set.
                    Token::StartTag {
                        tag_name,
                        is_self_closing,
                        ..
                    } if matches!(&**tag_name, "base" | "basefont" | "bgsound" | "link") => {
                        let is_self_closing = *is_self_closing;

                        self.insert_html_element(token_and_info)?;
                        self.open_elements_stack.pop();

                        if is_self_closing {
                            token_and_info.acknowledged = true;
                        }
                    }
                    // A start tag whose tag name is "meta"
                    //
                    // Insert an HTML element for the token. Immediately pop the current node off
                    // the stack of open elements.
                    //
                    // Acknowledge the token's self-closing flag, if it is set.
                    //
                    // If the active speculative HTML parser is null, then:
                    //
                    // If the element has a charset attribute, and getting an encoding from its
                    // value results in an encoding, and the confidence is currently tentative, then
                    // change the encoding to the resulting encoding.
                    //
                    // Otherwise, if the element has an http-equiv attribute whose value is an ASCII
                    // case-insensitive match for the string "Content-Type", and the element has a
                    // content attribute, and applying the algorithm for extracting a character
                    // encoding from a meta element to that attribute's value returns an encoding,
                    // and the confidence is currently tentative, then change the encoding to the
                    // extracted encoding.
                    Token::StartTag {
                        tag_name,
                        is_self_closing,
                        ..
                    } if tag_name == "meta" => {
                        let is_self_closing = *is_self_closing;

                        self.insert_html_element(token_and_info)?;
                        self.open_elements_stack.pop();

                        if is_self_closing {
                            token_and_info.acknowledged = true;
                        }
                    }
                    // A start tag whose tag name is "title"
                    //
                    // Follow the generic RCDATA element parsing algorithm.
                    Token::StartTag { tag_name, .. } if tag_name == "title" => {
                        self.parse_generic_text_element(token_and_info, false)?;
                    }
                    // A start tag whose tag name is "noscript", if the scripting flag is enabled
                    // A start tag whose tag name is one of: "noframes", "style"
                    //
                    // Follow the generic raw text element parsing algorithm.
                    Token::StartTag { tag_name, .. }
                        if tag_name == "noscript" && self.config.scripting_enabled =>
                    {
                        self.parse_generic_text_element(token_and_info, true)?;
                    }
                    Token::StartTag { tag_name, .. }
                        if matches!(&**tag_name, "noframes" | "style") =>
                    {
                        self.parse_generic_text_element(token_and_info, true)?;
                    }
                    // A start tag whose tag name is "noscript", if the scripting flag is disabled
                    //
                    // Insert an HTML element for the token.
                    //
                    // Switch the insertion mode to "in head noscript".
                    Token::StartTag { tag_name, .. }
                        if tag_name == "noscript" && !self.config.scripting_enabled =>
                    {
                        self.insert_html_element(token_and_info)?;
                        self.insertion_mode = InsertionMode::InHeadNoScript;
                    }
                    // A start tag whose tag name is "script"
                    //
                    // Run these steps:
                    //
                    // 1. Let the adjusted insertion location be the appropriate place for inserting
                    // a node.
                    //
                    // 2. Create an element for the token in the HTML namespace, with the intended
                    // parent being the element in which the adjusted insertion location finds
                    // itself.
                    //
                    // 3. Set the element's parser document to the Document, and unset the element's
                    // "non-blocking" flag.
                    //
                    // This ensures that, if the script is external, any document.write() calls in
                    // the script will execute in-line, instead of blowing the document away, as
                    // would happen in most other cases. It also prevents the script from executing
                    // until the end tag is seen.
                    //
                    // 4. If the parser was created as part of the HTML fragment parsing algorithm,
                    // then mark the script element as "already started". (fragment case)
                    //
                    // 5. If the parser was invoked via the document.write() or document.writeln()
                    // methods, then optionally mark the script element as "already started". (For
                    // example, the user agent might use this clause to prevent execution of
                    // cross-origin scripts inserted via document.write() under slow network
                    // conditions, or when the page has already taken a long time to load.)
                    //
                    // 6. Insert the newly created element at the adjusted insertion location.
                    //
                    // 7. Push the element onto the stack of open elements so that it is the new
                    // current node.
                    //
                    // 8. Switch the tokenizer to the script data state.
                    //
                    // 9. Let the original insertion mode be the current insertion mode.
                    //
                    // 10. Switch the insertion mode to "text".
                    Token::StartTag {
                        tag_name,
                        is_self_closing,
                        ..
                    } if tag_name == "script" => {
                        let adjusted_insertion_location =
                            self.get_appropriate_place_for_inserting_node(None)?;
                        let node = self.create_element_for_token(
                            token_and_info.token.clone(),
                            token_and_info.span,
                            Some(Namespace::HTML),
                            None,
                        );

                        // Skip script handling

                        self.insert_at_position(adjusted_insertion_location, node.clone());
                        self.open_elements_stack.push(node);
                        self.input.set_input_state(State::ScriptData);
                        self.original_insertion_mode = self.insertion_mode.clone();
                        self.insertion_mode = InsertionMode::Text;
                        maybe_allow_self_closing!(is_self_closing, tag_name);
                    }
                    // An end tag whose tag name is "head"
                    //
                    // Pop the current node (which will be the head element) off the stack of open
                    // elements.
                    //
                    // Switch the insertion mode to "after head".
                    Token::EndTag { tag_name, .. } if tag_name == "head" => {
                        let popped = self.open_elements_stack.pop();

                        self.update_end_tag_span(popped.as_ref(), token_and_info.span);
                        self.insertion_mode = InsertionMode::AfterHead;
                    }
                    // An end tag whose tag name is one of: "body", "html", "br"
                    //
                    // Act as described in the "anything else" entry below.
                    Token::EndTag { tag_name, .. }
                        if matches!(&**tag_name, "body" | "html" | "br") =>
                    {
                        anything_else(self, token_and_info)?;
                    }
                    // A start tag whose tag name is "template"
                    //
                    // Insert an HTML element for the token.
                    //
                    // Insert a marker at the end of the list of active formatting elements.
                    //
                    // Set the frameset-ok flag to "not ok".
                    //
                    // Switch the insertion mode to "in template".
                    //
                    // Push "in template" onto the stack of template insertion modes so that it is
                    // the new current template insertion mode.
                    Token::StartTag {
                        tag_name,
                        is_self_closing,
                        ..
                    } if tag_name == "template" => {
                        self.insert_html_element(token_and_info)?;
                        self.active_formatting_elements.insert_marker();
                        self.frameset_ok = false;
                        self.insertion_mode = InsertionMode::InTemplate;
                        self.template_insertion_mode_stack
                            .push(InsertionMode::InTemplate);
                        maybe_allow_self_closing!(is_self_closing, tag_name);
                    }
                    // An end tag whose tag name is "template"
                    //
                    // If there is no template element on the stack of open elements, then this is a
                    // parse error; ignore the token.
                    //
                    // Otherwise, run these steps:
                    //
                    // Generate all implied end tags thoroughly.
                    //
                    // If the current node is not a template element, then this is a parse error.
                    //
                    // Pop elements from the stack of open elements until a template element has
                    // been popped from the stack.
                    //
                    // Clear the list of active formatting elements up to the last marker.
                    // Pop the current template insertion mode off the stack of template insertion
                    // modes.
                    //
                    // Reset the insertion mode appropriately.
                    Token::EndTag { tag_name, .. } if tag_name == "template" => {
                        if !self.open_elements_stack.contains_template_element() {
                            self.errors.push(Error::new(
                                token_and_info.span,
                                ErrorKind::StrayEndTag(tag_name.clone()),
                            ));
                        } else {
                            self.open_elements_stack
                                .generate_implied_end_tags_thoroughly();

                            match self.open_elements_stack.items.last() {
                                Some(node) if !is_html_element!(node, "template") => {
                                    self.errors.push(Error::new(
                                        token_and_info.span,
                                        ErrorKind::UnclosedElements(tag_name.clone()),
                                    ));
                                }
                                _ => {}
                            }

                            let popped = self
                                .open_elements_stack
                                .pop_until_tag_name_popped(&["template"]);

                            self.update_end_tag_span(popped.as_ref(), token_and_info.span);
                            self.active_formatting_elements.clear_to_last_marker();
                            self.template_insertion_mode_stack.pop();
                            self.reset_insertion_mode();
                        }
                    }
                    // A start tag whose tag name is "head"
                    //
                    // Any other end tag
                    //
                    // Parse error. Ignore the token.
                    Token::StartTag { tag_name, .. } if tag_name == "head" => {
                        self.errors.push(Error::new(
                            token_and_info.span,
                            ErrorKind::SomethingSeenWhenSomethingOpen(tag_name.clone()),
                        ));
                    }
                    Token::EndTag { tag_name, .. } => {
                        self.errors.push(Error::new(
                            token_and_info.span,
                            ErrorKind::StrayEndTag(tag_name.clone()),
                        ));
                    }
                    // Anything else
                    //
                    // Pop the current node (which will be the head element) off the stack of open
                    // elements.
                    //
                    // Switch the insertion mode to "after head".
                    //
                    // Reprocess the token.
                    _ => {
                        anything_else(self, token_and_info)?;
                    }
                }
            }
            // The "in head noscript" insertion mode
            InsertionMode::InHeadNoScript => {
                let anything_else =
                    |parser: &mut Parser<I>, token_and_info: &mut TokenAndInfo| -> PResult<()> {
                        match &token_and_info.token {
                            Token::Character { .. } => {
                                parser.errors.push(Error::new(
                                    token_and_info.span,
                                    ErrorKind::NonSpaceCharacterInNoscriptInHead,
                                ));
                            }
                            Token::StartTag { tag_name, .. } => {
                                parser.errors.push(Error::new(
                                    token_and_info.span,
                                    ErrorKind::BadStartTagInNoscriptInHead(tag_name.clone()),
                                ));
                            }
                            Token::EndTag { tag_name, .. } => {
                                parser.errors.push(Error::new(
                                    token_and_info.span,
                                    ErrorKind::StrayEndTag(tag_name.clone()),
                                ));
                            }
                            Token::Eof => {
                                parser.errors.push(Error::new(
                                    token_and_info.span,
                                    ErrorKind::EofWithUnclosedElements,
                                ));
                            }
                            _ => {
                                unreachable!()
                            }
                        }

                        parser.open_elements_stack.pop();
                        parser.insertion_mode = InsertionMode::InHead;
                        parser.process_token(token_and_info, None)?;

                        Ok(())
                    };

                // When the user agent is to apply the rules for the "in head noscript"
                // insertion mode, the user agent must handle the token as follows:
                match token {
                    // A DOCTYPE token
                    //
                    // Parse error. Ignore the token.
                    Token::Doctype { .. } => {
                        self.errors
                            .push(Error::new(token_and_info.span, ErrorKind::StrayDoctype));
                    }
                    // A start tag whose tag name is "html"
                    //
                    // Process the token using the rules for the "in body" insertion mode.
                    Token::StartTag { tag_name, .. } if tag_name == "html" => {
                        self.process_token_using_rules(token_and_info, InsertionMode::InBody)?;
                    }
                    // An end tag whose tag name is "noscript"
                    //
                    // Pop the current node (which will be a noscript element) from the stack of
                    // open elements; the new current node will be a head element.
                    //
                    // Switch the insertion mode to "in head".
                    Token::EndTag { tag_name, .. } if tag_name == "noscript" => {
                        let popped = self.open_elements_stack.pop();

                        self.update_end_tag_span(popped.as_ref(), token_and_info.span);
                        self.insertion_mode = InsertionMode::InHead;
                    }
                    // A character token that is one of U+0009 CHARACTER TABULATION, U+000A LINE
                    // FEED (LF), U+000C FORM FEED (FF), U+000D CARRIAGE RETURN (CR), or U+0020
                    // SPACE
                    //
                    // A comment token
                    //
                    // A start tag whose tag name is one of: "basefont", "bgsound", "link", "meta",
                    // "noframes", "style"
                    //
                    // Process the token using the rules for the "in head" insertion mode.
                    Token::Character {
                        value: '\x09' | '\x0A' | '\x0C' | '\x0D' | '\x20',
                        ..
                    } => {
                        self.process_token_using_rules(token_and_info, InsertionMode::InHead)?;
                    }
                    Token::Comment { .. } => {
                        self.process_token_using_rules(token_and_info, InsertionMode::InHead)?;
                    }
                    Token::StartTag { tag_name, .. }
                        if matches!(
                            &**tag_name,
                            "basefont" | "bgsound" | "link" | "meta" | "noframes" | "style"
                        ) =>
                    {
                        self.process_token_using_rules(token_and_info, InsertionMode::InHead)?;
                    }
                    // An end tag whose tag name is "br"
                    //
                    // Act as described in the "anything else" entry below.
                    Token::EndTag { tag_name, .. } if tag_name == "br" => {
                        anything_else(self, token_and_info)?;
                    }
                    // A start tag whose tag name is one of: "head", "noscript"
                    //
                    // Any other end tag
                    //
                    // Parse error. Ignore the token.
                    Token::StartTag { tag_name, .. }
                        if matches!(&**tag_name, "head" | "noscript") =>
                    {
                        self.errors.push(Error::new(
                            token_and_info.span,
                            ErrorKind::SomethingSeenWhenSomethingOpen(tag_name.clone()),
                        ));
                    }
                    Token::EndTag { tag_name, .. } => {
                        self.errors.push(Error::new(
                            token_and_info.span,
                            ErrorKind::StrayEndTag(tag_name.clone()),
                        ));
                    }
                    // Anything else
                    //
                    // Parse error.
                    //
                    // Pop the current node (which will be a noscript element) from the stack of
                    // open elements; the new current node will be a head element.
                    //
                    // Switch the insertion mode to "in head".
                    //
                    // Reprocess the token.
                    _ => {
                        anything_else(self, token_and_info)?;
                    }
                }
            }
            // The "after head" insertion mode
            InsertionMode::AfterHead => {
                let anything_else = |parser: &mut Parser<I>,
                                     token_and_info: &mut TokenAndInfo|
                 -> PResult<()> {
                    let span = if matches!(&token_and_info.token, Token::EndTag { tag_name, .. } if tag_name == "body")
                    {
                        Some(token_and_info.span)
                    } else {
                        None
                    };
                    let body_token = parser.create_fake_token_and_info("body", span);

                    parser.insert_html_element(&body_token)?;
                    parser.insertion_mode = InsertionMode::InBody;
                    parser.process_token(token_and_info, None)?;

                    Ok(())
                };
                // When the user agent is to apply the rules for the "after head" insertion
                // mode, the user agent must handle the token as follows:
                match token {
                    // A character token that is one of U+0009 CHARACTER TABULATION, U+000A LINE
                    // FEED (LF), U+000C FORM FEED (FF), U+000D CARRIAGE RETURN (CR), or U+0020
                    // SPACE
                    //
                    // Insert the character.
                    Token::Character {
                        value: '\x09' | '\x0A' | '\x0C' | '\x0D' | '\x20',
                        ..
                    } => {
                        self.insert_character(token_and_info)?;
                    }
                    // A comment token
                    //
                    // Insert a comment.
                    Token::Comment { .. } => {
                        self.insert_comment(token_and_info)?;
                    }
                    // A DOCTYPE token
                    //
                    // Parse error. Ignore the token.
                    Token::Doctype { .. } => {
                        self.errors
                            .push(Error::new(token_and_info.span, ErrorKind::StrayDoctype));
                    }
                    // A start tag whose tag name is "html"
                    //
                    // Process the token using the rules for the "in body" insertion mode.
                    Token::StartTag { tag_name, .. } if tag_name == "html" => {
                        self.process_token_using_rules(token_and_info, InsertionMode::InBody)?;
                    }
                    // A start tag whose tag name is "body"
                    //
                    // Insert an HTML element for the token.
                    //
                    // Set the frameset-ok flag to "not ok".
                    //
                    // Switch the insertion mode to "in body".
                    Token::StartTag {
                        tag_name,
                        is_self_closing,
                        ..
                    } if tag_name == "body" => {
                        self.insert_html_element(token_and_info)?;
                        self.frameset_ok = false;
                        self.insertion_mode = InsertionMode::InBody;
                        maybe_allow_self_closing!(is_self_closing, tag_name);
                    }
                    // A start tag whose tag name is "frameset"
                    //
                    // Insert an HTML element for the token.
                    //
                    // Switch the insertion mode to "in frameset".
                    Token::StartTag {
                        tag_name,
                        is_self_closing,
                        ..
                    } if tag_name == "frameset" => {
                        self.insert_html_element(token_and_info)?;
                        self.insertion_mode = InsertionMode::InFrameset;
                        maybe_allow_self_closing!(is_self_closing, tag_name);
                    }
                    // A start tag whose tag name is one of: "base", "basefont", "bgsound", "link",
                    // "meta", "noframes", "script", "style", "template", "title"
                    //
                    // Parse error.
                    //
                    // Push the node pointed to by the head element pointer onto the stack of open
                    // elements.
                    //
                    // Process the token using the rules for the "in head" insertion mode.
                    //
                    // Remove the node pointed to by the head element pointer from the stack of open
                    // elements. (It might not be the current node at this point.)
                    Token::StartTag { tag_name, .. }
                        if matches!(
                            &**tag_name,
                            "base"
                                | "basefont"
                                | "bgsound"
                                | "link"
                                | "meta"
                                | "noframes"
                                | "script"
                                | "style"
                                | "template"
                                | "title"
                        ) =>
                    {
                        self.errors.push(Error::new(
                            token_and_info.span,
                            ErrorKind::SomethingBetweenHeadAndBody(tag_name.clone()),
                        ));

                        let head = self
                            .head_element_pointer
                            .as_ref()
                            .expect("no head element")
                            .clone();

                        self.open_elements_stack.push(head.clone());
                        self.process_token_using_rules(token_and_info, InsertionMode::InHead)?;
                        self.open_elements_stack.remove(&head);
                    }
                    // An end tag whose tag name is "template"
                    //
                    // Process the token using the rules for the "in head" insertion mode.
                    Token::EndTag { tag_name, .. } if tag_name == "template" => {
                        self.process_token_using_rules(token_and_info, InsertionMode::InHead)?;
                    }
                    // An end tag whose tag name is one of: "body", "html", "br"
                    //
                    // Act as described in the "anything else" entry below.
                    Token::EndTag { tag_name, .. }
                        if matches!(&**tag_name, "body" | "html" | "br") =>
                    {
                        anything_else(self, token_and_info)?;
                    }
                    // A start tag whose tag name is "head"
                    //
                    // Any other end tag
                    //
                    // Parse error. Ignore the token.
                    Token::StartTag { tag_name, .. } if tag_name == "head" => {
                        self.errors.push(Error::new(
                            token_and_info.span,
                            ErrorKind::StrayStartTag(tag_name.clone()),
                        ));
                    }
                    Token::EndTag { tag_name, .. } => {
                        self.errors.push(Error::new(
                            token_and_info.span,
                            ErrorKind::StrayEndTag(tag_name.clone()),
                        ));
                    }
                    // Anything else
                    //
                    // Insert an HTML element for a "body" start tag token with no attributes.
                    //
                    // Switch the insertion mode to "in body".
                    //
                    // Reprocess the current token.
                    _ => {
                        anything_else(self, token_and_info)?;
                    }
                }
            }
            // The "in body" insertion mode
            InsertionMode::InBody => {
                // When the user agent is to apply the rules for the "in body" insertion mode,
                // the user agent must handle the token as follows:
                match token {
                    // A character token that is U+0000 NULL
                    //
                    // Parse error. Ignore the token.
                    Token::Character { value, .. } if *value == '\x00' => self.errors.push(
                        Error::new(token_and_info.span, ErrorKind::UnexpectedNullCharacter),
                    ),
                    // A character token that is one of U+0009 CHARACTER TABULATION, U+000A LINE
                    // FEED (LF), U+000C FORM FEED (FF), U+000D CARRIAGE RETURN (CR), or U+0020
                    // SPACE
                    //
                    // Reconstruct the active formatting elements, if any.
                    //
                    // Insert the token's character.
                    Token::Character {
                        value: '\x09' | '\x0A' | '\x0C' | '\x0D' | '\x20',
                        ..
                    } => {
                        self.reconstruct_active_formatting_elements()?;
                        self.insert_character(token_and_info)?;
                    }
                    // Any other character token
                    //
                    // Reconstruct the active formatting elements, if any.
                    //
                    // Insert the token's character.
                    //
                    // Set the frameset-ok flag to "not ok".
                    Token::Character { .. } => {
                        self.reconstruct_active_formatting_elements()?;
                        self.insert_character(token_and_info)?;
                        self.frameset_ok = false;
                    }
                    // A comment token
                    //
                    // Insert a comment.
                    Token::Comment { .. } => {
                        self.insert_comment(token_and_info)?;
                    }
                    // A DOCTYPE token
                    //
                    // Parse error. Ignore the token.
                    Token::Doctype { .. } => {
                        self.errors
                            .push(Error::new(token_and_info.span, ErrorKind::StrayDoctype));
                    }
                    // A start tag whose tag name is "html"
                    //
                    // Parse error.
                    //
                    // If there is a template element on the stack of open elements, then ignore the
                    // token.
                    //
                    // Otherwise, for each attribute on the token, check to see if the attribute is
                    // already present on the top element of the stack of open elements. If it is
                    // not, add the attribute and its corresponding value to that element.
                    Token::StartTag {
                        tag_name,
                        attributes,
                        ..
                    } if tag_name == "html" => {
                        self.errors.push(Error::new(
                            token_and_info.span,
                            ErrorKind::StrayStartTag(tag_name.clone()),
                        ));

                        if self.open_elements_stack.contains_template_element() {
                            // Ignore
                            return Ok(());
                        }

                        if let Some(top) = self.open_elements_stack.items.first() {
                            let mut node_attributes = match &top.data {
                                Data::Element { attributes, .. } => attributes.borrow_mut(),
                                _ => {
                                    unreachable!();
                                }
                            };

                            for token_attribute in attributes {
                                let mut found = false;

                                for attribute in node_attributes.iter() {
                                    if attribute.name == token_attribute.name {
                                        found = true;

                                        break;
                                    }
                                }

                                if !found {
                                    node_attributes.push(Attribute {
                                        span: token_attribute.span,
                                        namespace: None,
                                        prefix: None,
                                        name: token_attribute.name.clone(),
                                        raw_name: token_attribute.raw_name.clone(),
                                        value: token_attribute.value.clone(),
                                        raw_value: token_attribute.raw_value.clone(),
                                    });
                                }
                            }
                        }
                    }
                    // A start tag whose tag name is one of: "base", "basefont", "bgsound", "link",
                    // "meta", "noframes", "script", "style", "template", "title"
                    //
                    // An end tag whose tag name is "template"
                    //
                    // Process the token using the rules for the "in head" insertion mode.
                    Token::StartTag { tag_name, .. }
                        if matches!(
                            &**tag_name,
                            "base"
                                | "basefont"
                                | "bgsound"
                                | "link"
                                | "meta"
                                | "noframes"
                                | "script"
                                | "style"
                                | "template"
                                | "title"
                        ) =>
                    {
                        self.process_token_using_rules(token_and_info, InsertionMode::InHead)?;
                    }
                    Token::EndTag { tag_name, .. } if tag_name == "template" => {
                        self.process_token_using_rules(token_and_info, InsertionMode::InHead)?;
                    }
                    // A start tag whose tag name is "body"
                    //
                    // Parse error.
                    //
                    // If the second element on the stack of open elements is not a body element, if
                    // the stack of open elements has only one node on it, or if there is a template
                    // element on the stack of open elements, then ignore the token. (fragment case)
                    //
                    // Otherwise, set the frameset-ok flag to "not ok"; then, for each attribute on
                    // the token, check to see if the attribute is already present on the body
                    // element (the second element) on the stack of open elements, and if it is not,
                    // add the attribute and its corresponding value to that element.
                    Token::StartTag {
                        tag_name,
                        attributes,
                        ..
                    } if tag_name == "body" => {
                        self.errors.push(Error::new(
                            token_and_info.span,
                            ErrorKind::SomethingSeenWhenSomethingOpen(tag_name.clone()),
                        ));

                        let is_second_body = matches!(self.open_elements_stack.items.get(1), Some(node) if is_html_element!(node, "body"));

                        if !is_second_body
                            || self.open_elements_stack.items.len() == 1
                            || self.open_elements_stack.contains_template_element()
                        {
                            // Ignore
                            // Fragment case
                            return Ok(());
                        }

                        self.frameset_ok = false;

                        if let Some(top) = self.open_elements_stack.items.get(1) {
                            let mut node_attributes = match &top.data {
                                Data::Element { attributes, .. } => attributes.borrow_mut(),
                                _ => {
                                    unreachable!();
                                }
                            };

                            for token_attribute in attributes {
                                let mut found = false;

                                for attribute in node_attributes.iter() {
                                    if attribute.name == token_attribute.name {
                                        found = true;

                                        break;
                                    }
                                }

                                if !found {
                                    node_attributes.push(Attribute {
                                        span: token_attribute.span,
                                        namespace: None,
                                        prefix: None,
                                        name: token_attribute.name.clone(),
                                        raw_name: token_attribute.raw_name.clone(),
                                        value: token_attribute.value.clone(),
                                        raw_value: token_attribute.raw_value.clone(),
                                    });
                                }
                            }
                        }
                    }
                    // A start tag whose tag name is "frameset"
                    //
                    // Parse error.
                    //
                    // If the stack of open elements has only one node on it, or if the second
                    // element on the stack of open elements is not a body element, then ignore the
                    // token. (fragment case)
                    //
                    // If the frameset-ok flag is set to "not ok", ignore the token.
                    //
                    // Otherwise, run the following steps:
                    //
                    // Remove the second element on the stack of open elements from its parent node,
                    // if it has one.
                    //
                    // Pop all the nodes from the bottom of the stack of open elements, from the
                    // current node up to, but not including, the root html element.
                    //
                    // Insert an HTML element for the token.
                    //
                    // Switch the insertion mode to "in frameset".
                    Token::StartTag { tag_name, .. } if tag_name == "frameset" => {
                        self.errors.push(Error::new(
                            token_and_info.span,
                            ErrorKind::StrayStartTag(tag_name.clone()),
                        ));

                        let len = self.open_elements_stack.items.len();
                        let body = self.open_elements_stack.items.get(1);
                        let is_second_body =
                            matches!(body, Some(node) if is_html_element!(node, "body"));

                        if len == 1 || !is_second_body {
                            // Fragment case
                            // Ignore the token
                            return Ok(());
                        }

                        if !self.frameset_ok {
                            // Ignore
                            return Ok(());
                        }

                        if let Some(body) = &body {
                            if let Some((parent, i)) = self.get_parent_and_index(body) {
                                parent.children.borrow_mut().remove(i);

                                body.parent.set(None);
                            }
                        }

                        self.open_elements_stack.items.truncate(1);
                        self.insert_html_element(token_and_info)?;
                        self.insertion_mode = InsertionMode::InFrameset;
                    }
                    // An end-of-file token
                    //
                    // If the stack of template insertion modes is not empty, then process the token
                    // using the rules for the "in template" insertion mode.
                    //
                    // Otherwise, follow these steps:
                    //
                    // If there is a node in the stack of open elements that is not either a dd
                    // element, a dt element, an li element, an optgroup element, an option element,
                    // a p element, an rb element, an rp element, an rt element, an rtc element, a
                    // tbody element, a td element, a tfoot element, a th element, a thead element,
                    // a tr element, the body element, or the html element, then this is a parse
                    // error.
                    //
                    // Stop parsing.
                    Token::Eof => {
                        if !self.template_insertion_mode_stack.is_empty() {
                            self.process_token_using_rules(
                                token_and_info,
                                InsertionMode::InTemplate,
                            )?;

                            return Ok(());
                        }

                        self.update_end_tag_span(
                            self.open_elements_stack.items.last(),
                            token_and_info.span,
                        );

                        for node in &self.open_elements_stack.items {
                            if !is_html_element!(
                                node,
                                "dd" | "dt"
                                    | "li"
                                    | "optgroup"
                                    | "option"
                                    | "p"
                                    | "rb"
                                    | "rp"
                                    | "rt"
                                    | "rtc"
                                    | "tbody"
                                    | "td"
                                    | "tfoot"
                                    | "th"
                                    | "thead"
                                    | "tr"
                                    | "body"
                                    | "html"
                            ) {
                                self.errors.push(Error::new(
                                    token_and_info.span,
                                    ErrorKind::EofWithUnclosedElements,
                                ));

                                break;
                            }
                        }

                        self.stopped = true;
                    }
                    // An end tag whose tag name is "body"
                    //
                    // If the stack of open elements does not have a body element in scope, this is
                    // a parse error; ignore the token.
                    //
                    // Otherwise, if there is a node in the stack of open elements that is not
                    // either a dd element, a dt element, an li element, an optgroup element, an
                    // option element, a p element, an rb element, an rp element, an rt element, an
                    // rtc element, a tbody element, a td element, a tfoot element, a th element, a
                    // thead element, a tr element, the body element, or the html element, then this
                    // is a parse error.
                    //
                    // Switch the insertion mode to "after body".
                    Token::EndTag { tag_name, .. } if tag_name == "body" => {
                        if !self.open_elements_stack.has_in_scope("body") {
                            self.errors.push(Error::new(
                                token_and_info.span,
                                ErrorKind::StrayEndTag(tag_name.clone()),
                            ));

                            return Ok(());
                        } else {
                            self.update_end_tag_span(
                                self.open_elements_stack.items.get(1),
                                token_and_info.span,
                            );
                        }

                        for node in &self.open_elements_stack.items {
                            if !is_html_element!(
                                node,
                                "dd" | "dt"
                                    | "li"
                                    | "optgroup"
                                    | "option"
                                    | "p"
                                    | "rb"
                                    | "rp"
                                    | "rt"
                                    | "rtc"
                                    | "tbody"
                                    | "td"
                                    | "tfoot"
                                    | "th"
                                    | "thead"
                                    | "tr"
                                    | "body"
                                    | "html"
                            ) {
                                self.errors.push(Error::new(
                                    token_and_info.span,
                                    ErrorKind::EndTagWithUnclosedElements("body".into()),
                                ));

                                break;
                            }
                        }

                        self.insertion_mode = InsertionMode::AfterBody;
                    }
                    // An end tag whose tag name is "html"
                    //
                    // If the stack of open elements does not have a body element in scope, this is
                    // a parse error; ignore the token.
                    //
                    // Otherwise, if there is a node in the stack of open elements that is not
                    // either a dd element, a dt element, an li element, an optgroup element, an
                    // option element, a p element, an rb element, an rp element, an rt element, an
                    // rtc element, a tbody element, a td element, a tfoot element, a th element, a
                    // thead element, a tr element, the body element, or the html element, then this
                    // is a parse error.
                    //
                    // Switch the insertion mode to "after body".
                    //
                    // Reprocess the token.
                    Token::EndTag { tag_name, .. } if tag_name == "html" => {
                        if !self.open_elements_stack.has_in_scope("body") {
                            self.errors.push(Error::new(
                                token_and_info.span,
                                ErrorKind::StrayEndTag(tag_name.clone()),
                            ));

                            return Ok(());
                        } else {
                            self.update_end_tag_span(
                                self.open_elements_stack.items.first(),
                                token_and_info.span,
                            );
                        }

                        for node in &self.open_elements_stack.items {
                            if !is_html_element!(
                                node,
                                "dd" | "dt"
                                    | "li"
                                    | "optgroup"
                                    | "option"
                                    | "p"
                                    | "rb"
                                    | "rp"
                                    | "rt"
                                    | "rtc"
                                    | "tbody"
                                    | "td"
                                    | "tfoot"
                                    | "th"
                                    | "thead"
                                    | "tr"
                                    | "body"
                                    | "html"
                            ) {
                                self.errors.push(Error::new(
                                    token_and_info.span,
                                    ErrorKind::EndTagWithUnclosedElements("html".into()),
                                ));

                                break;
                            }
                        }

                        self.insertion_mode = InsertionMode::AfterBody;
                        self.process_token(token_and_info, None)?;
                    }
                    // A start tag whose tag name is one of: "address", "article", "aside",
                    // "blockquote", "center", "details", "dialog", "dir", "div", "dl", "fieldset",
                    // "figcaption", "figure", "footer", "header", "hgroup", "main", "menu", "nav",
                    // "ol", "p", "section", "summary", "ul"
                    //
                    // If the stack of open elements has a p element in button scope, then close a p
                    // element.
                    //
                    // Insert an HTML element for the token.
                    Token::StartTag {
                        tag_name,
                        is_self_closing,
                        ..
                    } if matches!(
                        &**tag_name,
                        "address"
                            | "article"
                            | "aside"
                            | "blockquote"
                            | "center"
                            | "details"
                            | "dialog"
                            | "dir"
                            | "div"
                            | "dl"
                            | "fieldset"
                            | "figcaption"
                            | "figure"
                            | "footer"
                            | "header"
                            | "hgroup"
                            | "main"
                            | "menu"
                            | "nav"
                            | "ol"
                            | "p"
                            | "section"
                            | "summary"
                            | "ul"
                    ) =>
                    {
                        if self.open_elements_stack.has_in_button_scope("p") {
                            self.close_p_element(token_and_info, false);
                        }

                        self.insert_html_element(token_and_info)?;
                        maybe_allow_self_closing!(is_self_closing, tag_name);
                    }
                    // A start tag whose tag name is one of: "h1", "h2", "h3", "h4", "h5", "h6"
                    //
                    // If the stack of open elements has a p element in button scope, then close a p
                    // element.
                    //
                    // If the current node is an HTML element whose tag name is one of "h1", "h2",
                    // "h3", "h4", "h5", or "h6", then this is a parse error; pop the current node
                    // off the stack of open elements.
                    //
                    // Insert an HTML element for the token.
                    Token::StartTag {
                        tag_name,
                        is_self_closing,
                        ..
                    } if matches!(&**tag_name, "h1" | "h2" | "h3" | "h4" | "h5" | "h6") => {
                        if self.open_elements_stack.has_in_button_scope("p") {
                            self.close_p_element(token_and_info, false);
                        }

                        match self.open_elements_stack.items.last() {
                            Some(node)
                                if is_html_element!(
                                    node,
                                    "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
                                ) =>
                            {
                                self.errors.push(Error::new(
                                    token_and_info.span,
                                    ErrorKind::HeadingWhenHeadingOpen,
                                ));

                                self.open_elements_stack.pop();
                            }
                            _ => {}
                        }

                        self.insert_html_element(token_and_info)?;
                        maybe_allow_self_closing!(is_self_closing, tag_name);
                    }
                    // A start tag whose tag name is one of: "pre", "listing"
                    //
                    // If the stack of open elements has a p element in button scope, then close a p
                    // element.
                    //
                    // Insert an HTML element for the token.
                    //
                    // If the next token is a U+000A LINE FEED (LF) character token, then ignore
                    // that token and move on to the next one. (Newlines at the start of pre blocks
                    // are ignored as an authoring convenience.)
                    //
                    // Set the frameset-ok flag to "not ok".
                    Token::StartTag { tag_name, .. }
                        if matches!(&**tag_name, "pre" | "listing") =>
                    {
                        if self.open_elements_stack.has_in_button_scope("p") {
                            self.close_p_element(token_and_info, false);
                        }

                        self.insert_html_element(token_and_info)?;

                        match self.input.cur()? {
                            Some(Token::Character { value, .. }) if *value == '\n' => {
                                bump!(self);
                            }
                            _ => {}
                        }

                        self.frameset_ok = false;
                    }
                    // A start tag whose tag name is "form"
                    //
                    // If the form element pointer is not null, and there is no template element on
                    // the stack of open elements, then this is a parse error; ignore the token.
                    //
                    // Otherwise:
                    //
                    // If the stack of open elements has a p element in button scope, then close a p
                    // element.
                    //
                    // Insert an HTML element for the token, and, if there is no template element on
                    // the stack of open elements, set the form element pointer to point to the
                    // element created.
                    Token::StartTag {
                        tag_name,
                        is_self_closing,
                        ..
                    } if tag_name == "form" => {
                        if self.form_element_pointer.is_some()
                            && !self.open_elements_stack.contains_template_element()
                        {
                            self.errors
                                .push(Error::new(token_and_info.span, ErrorKind::FormWhenFormOpen));

                            return Ok(());
                        }

                        if self.open_elements_stack.has_in_button_scope("p") {
                            self.close_p_element(token_and_info, false);
                        }

                        let element = self.insert_html_element(token_and_info)?;

                        if !self.open_elements_stack.contains_template_element() {
                            self.form_element_pointer = Some(element);
                        }

                        maybe_allow_self_closing!(is_self_closing, tag_name);
                    }
                    // A start tag whose tag name is "li"
                    //
                    // Run these steps:
                    //
                    // Set the frameset-ok flag to "not ok".
                    //
                    // Initialize node to be the current node (the bottommost node of the stack).
                    //
                    // Loop: If node is an li element, then run these substeps:
                    //
                    // Generate implied end tags, except for li elements.
                    //
                    // If the current node is not an li element, then this is a parse error.
                    //
                    // Pop elements from the stack of open elements until an li element has been
                    // popped from the stack.
                    //
                    // Jump to the step labeled done below.
                    //
                    // If node is in the special category, but is not an address, div, or p element,
                    // then jump to the step labeled done below.
                    //
                    // Otherwise, set node to the previous entry in the stack of open elements and
                    // return to the step labeled loop.
                    //
                    // Done: If the stack of open elements has a p element in button scope, then
                    // close a p element.
                    //
                    // Finally, insert an HTML element for the token.
                    Token::StartTag {
                        tag_name,
                        is_self_closing,
                        ..
                    } if tag_name == "li" => {
                        self.frameset_ok = false;

                        // Initialise node to be the current node (the bottommost node of
                        // the stack).
                        // Step "Loop".
                        for node in self.open_elements_stack.items.iter().rev() {
                            if is_html_element!(node, "li") {
                                // Generate implied end tags, except for li elements.
                                self.open_elements_stack
                                    .generate_implied_end_tags_with_exclusion("li");

                                // If the current node is not an li element, then this is a
                                // parse error.
                                match self.open_elements_stack.items.last() {
                                    Some(node) if !is_html_element!(node, "li") => {
                                        self.errors.push(Error::new(
                                            token_and_info.span,
                                            ErrorKind::UnclosedElementsImplied("li".into()),
                                        ));
                                    }
                                    _ => {}
                                }

                                // Pop elements from the stack of open elements until an li
                                // element has been popped from the stack.
                                self.open_elements_stack.pop_until_tag_name_popped(&["li"]);

                                // Jump to the step labeled done below.
                                break;
                            }

                            // If node is in the special category, but is not an address,
                            // div, or p element, then jump to the step labeled done below.
                            // Otherwise, set node to the previous entry in the stack
                            // of open elements and return to the step labeled loop.
                            if self.is_special_element(node)
                                && !is_html_element!(node, "address" | "div" | "p")
                            {
                                break;
                            }
                        }

                        // Step "Done".
                        // If the stack of open elements has a p element in button scope,
                        // then close a p element.
                        if self.open_elements_stack.has_in_button_scope("p") {
                            self.close_p_element(token_and_info, false);
                        }

                        self.insert_html_element(token_and_info)?;
                        maybe_allow_self_closing!(is_self_closing, tag_name);
                    }
                    // A start tag whose tag name is one of: "dd", "dt"
                    //
                    // Run these steps:
                    //
                    // Set the frameset-ok flag to "not ok".
                    //
                    // Initialize node to be the current node (the bottommost node of the stack).
                    //
                    // Loop: If node is a dd element, then run these substeps:
                    //
                    // Generate implied end tags, except for dd elements.
                    //
                    // If the current node is not a dd element, then this is a parse error.
                    //
                    // Pop elements from the stack of open elements until a dd element has been
                    // popped from the stack.
                    //
                    // Jump to the step labeled done below.
                    //
                    // If node is a dt element, then run these substeps:
                    //
                    // Generate implied end tags, except for dt elements.
                    //
                    // If the current node is not a dt element, then this is a parse error.
                    //
                    // Pop elements from the stack of open elements until a dt element has been
                    // popped from the stack.
                    //
                    // Jump to the step labeled done below.
                    //
                    // If node is in the special category, but is not an address, div, or p element,
                    // then jump to the step labeled done below.
                    //
                    // Otherwise, set node to the previous entry in the stack of open elements and
                    // return to the step labeled loop.
                    //
                    // Done: If the stack of open elements has a p element in button scope, then
                    // close a p element.
                    //
                    // Finally, insert an HTML element for the token.
                    Token::StartTag {
                        tag_name,
                        is_self_closing,
                        ..
                    } if matches!(&**tag_name, "dd" | "dt") => {
                        self.frameset_ok = false;

                        // Initialise node to be the current node (the bottommost node of
                        // the stack).
                        // Step "Loop".
                        for node in self.open_elements_stack.items.iter().rev() {
                            if is_html_element!(node, "dd") {
                                // Generate implied end tags, except for dd elements.
                                self.open_elements_stack
                                    .generate_implied_end_tags_with_exclusion("dd");

                                // If the current node is not an dd element, then this is a
                                // parse error.
                                match self.open_elements_stack.items.last() {
                                    Some(node) if !is_html_element!(node, "dd") => {
                                        self.errors.push(Error::new(
                                            token_and_info.span,
                                            ErrorKind::UnclosedElementsImplied("dd".into()),
                                        ));
                                    }
                                    _ => {}
                                }

                                // Pop elements from the stack of open elements until an dd
                                // element has been popped from the stack.
                                self.open_elements_stack.pop_until_tag_name_popped(&["dd"]);

                                // Jump to the step labeled done below.
                                break;
                            } else if is_html_element!(node, "dt") {
                                // Generate implied end tags, except for li elements.
                                self.open_elements_stack
                                    .generate_implied_end_tags_with_exclusion("dt");

                                // If the current node is not an dt element, then this is a
                                // parse error.
                                match self.open_elements_stack.items.last() {
                                    Some(node) if !is_html_element!(node, "dt") => {
                                        self.errors.push(Error::new(
                                            token_and_info.span,
                                            ErrorKind::UnclosedElementsImplied("dt".into()),
                                        ));
                                    }
                                    _ => {}
                                }

                                // Pop elements from the stack of open elements until an dt
                                // element has been popped from the stack.
                                self.open_elements_stack.pop_until_tag_name_popped(&["dt"]);

                                // Jump to the step labeled done below.
                                break;
                            }

                            // If node is in the special category, but is not an address,
                            // div, or p element, then jump to the step labeled done below.
                            // Otherwise, set node to the previous entry in the stack of
                            // open elements and return to the step labeled loop.
                            if self.is_special_element(node)
                                && !is_html_element!(node, "address" | "div" | "p")
                            {
                                break;
                            }
                        }

                        // Step "Done".
                        // If the stack of open elements has a p element in button scope,
                        // then close a p element.
                        if self.open_elements_stack.has_in_button_scope("p") {
                            self.close_p_element(token_and_info, false);
                        }

                        self.insert_html_element(token_and_info)?;
                        maybe_allow_self_closing!(is_self_closing, tag_name);
                    }
                    // A start tag whose tag name is "plaintext"
                    //
                    // If the stack of open elements has a p element in button scope, then close a p
                    // element.
                    //
                    // Insert an HTML element for the token.
                    //
                    // Switch the tokenizer to the PLAINTEXT state.
                    Token::StartTag { tag_name, .. } if tag_name == "plaintext" => {
                        if self.open_elements_stack.has_in_button_scope("p") {
                            self.close_p_element(token_and_info, false);
                        }

                        self.insert_html_element(token_and_info)?;
                        self.input.set_input_state(State::PlainText);
                    }
                    // A start tag whose tag name is "button"
                    //
                    // 1. If the stack of open elements has a button element in scope, then run
                    // these substeps:
                    //
                    // 1. Parse error.
                    //
                    // 2. Generate implied end tags.
                    //
                    // 3. Pop elements from the stack of open elements until a button element has
                    // been popped from the stack.
                    //
                    // 2. Reconstruct the active formatting elements, if any.
                    //
                    // 3. Insert an HTML element for the token.
                    //
                    // 4. Set the frameset-ok flag to "not ok".
                    Token::StartTag { tag_name, .. } if tag_name == "button" => {
                        if self.open_elements_stack.has_in_scope("button") {
                            self.errors.push(Error::new(
                                token_and_info.span,
                                ErrorKind::SomethingSeenWhenSomethingOpen(tag_name.clone()),
                            ));
                            self.open_elements_stack.generate_implied_end_tags();
                            self.open_elements_stack
                                .pop_until_tag_name_popped(&["button"]);
                        }

                        self.reconstruct_active_formatting_elements()?;
                        self.insert_html_element(token_and_info)?;
                        self.frameset_ok = false;
                    }
                    // An end tag whose tag name is one of: "address", "article", "aside",
                    // "blockquote", "button", "center", "details", "dialog", "dir", "div", "dl",
                    // "fieldset", "figcaption", "figure", "footer", "header", "hgroup", "listing",
                    // "main", "menu", "nav", "ol", "pre", "section", "summary", "ul"
                    //
                    // If the stack of open elements does not have an element in scope that is an
                    // HTML element with the same tag name as that of the token, then this is a
                    // parse error; ignore the token.
                    //
                    // Otherwise, run these steps:
                    //
                    // Generate implied end tags.
                    //
                    // If the current node is not an HTML element with the same tag name as that of
                    // the token, then this is a parse error.
                    //
                    // Pop elements from the stack of open elements until an HTML element with the
                    // same tag name as the token has been popped from the stack.
                    Token::EndTag { tag_name, .. }
                        if matches!(
                            &**tag_name,
                            "address"
                                | "article"
                                | "aside"
                                | "blockquote"
                                | "button"
                                | "center"
                                | "details"
                                | "dialog"
                                | "dir"
                                | "div"
                                | "dl"
                                | "fieldset"
                                | "figcaption"
                                | "figure"
                                | "footer"
                                | "header"
                                | "hgroup"
                                | "listing"
                                | "main"
                                | "menu"
                                | "nav"
                                | "ol"
                                | "pre"
                                | "section"
                                | "summary"
                                | "ul"
                        ) =>
                    {
                        if !self.open_elements_stack.has_in_scope(tag_name) {
                            self.errors.push(Error::new(
                                token_and_info.span,
                                ErrorKind::StrayEndTag(tag_name.clone()),
                            ));
                        } else {
                            self.open_elements_stack.generate_implied_end_tags();

                            match self.open_elements_stack.items.last() {
                                Some(node) if !is_html_element_with_tag_name!(node, tag_name) => {
                                    self.errors.push(Error::new(
                                        token_and_info.span,
                                        ErrorKind::UnclosedElements(tag_name.clone()),
                                    ));
                                }
                                _ => {}
                            }

                            let popped = self
                                .open_elements_stack
                                .pop_until_tag_name_popped(&[tag_name]);

                            self.update_end_tag_span(popped.as_ref(), token_and_info.span);
                        }
                    }
                    // An end tag whose tag name is "form"
                    //
                    // If there is no template element on the stack of open elements, then run these
                    // substeps:
                    //
                    // 1. Let node be the element that the form element pointer is set to, or null
                    // if it is not set to an element.
                    //
                    // 2. Set the form element pointer to null.
                    //
                    // 3. If node is null or if the stack of open elements does not have node in
                    // scope, then this is a parse error; return and ignore the
                    // token.
                    //
                    // 4. Generate implied end tags.
                    //
                    // 5. If the current node is not node, then this is a parse error.
                    //
                    // 6. Remove node from the stack of open elements.
                    //
                    // If there is a template element on the stack of open elements, then run these
                    // substeps instead:
                    //
                    // 1. If the stack of open elements does not have a form element in scope, then
                    // this is a parse error; return and ignore the token.
                    //
                    // 2, Generate implied end tags.
                    //
                    // 3. If the current node is not a form element, then this is a parse error.
                    //
                    // 4. Pop elements from the stack of open elements until a form element has been
                    // popped from the stack.
                    Token::EndTag { tag_name, .. } if tag_name == "form" => {
                        if !self.open_elements_stack.contains_template_element() {
                            let node = match self.form_element_pointer.take() {
                                None => {
                                    self.errors.push(Error::new(
                                        token_and_info.span,
                                        ErrorKind::StrayEndTag(tag_name.clone()),
                                    ));

                                    return Ok(());
                                }
                                Some(x) => Some(x),
                            };

                            self.form_element_pointer = None;

                            if node.is_none()
                                || !self
                                    .open_elements_stack
                                    .has_node_in_scope(node.as_ref().unwrap())
                            {
                                self.errors.push(Error::new(
                                    token_and_info.span,
                                    ErrorKind::StrayEndTag(tag_name.clone()),
                                ));

                                return Ok(());
                            }

                            let node = node.unwrap();

                            self.open_elements_stack.generate_implied_end_tags();

                            let current = self.open_elements_stack.items.last();

                            if !is_same_node(&node, current.unwrap()) {
                                self.errors.push(Error::new(
                                    token_and_info.span,
                                    ErrorKind::UnclosedElements(tag_name.clone()),
                                ));
                            } else {
                                self.update_end_tag_span(Some(&node), token_and_info.span);
                            }

                            self.open_elements_stack.remove(&node);
                        } else {
                            if !self.open_elements_stack.has_in_scope("form") {
                                self.errors.push(Error::new(
                                    token_and_info.span,
                                    ErrorKind::StrayEndTag(tag_name.clone()),
                                ));

                                return Ok(());
                            }

                            self.open_elements_stack.generate_implied_end_tags();

                            match self.open_elements_stack.items.last() {
                                Some(node) if !is_html_element!(node, "form") => {
                                    self.errors.push(Error::new(
                                        token_and_info.span,
                                        ErrorKind::UnclosedElements(tag_name.clone()),
                                    ));
                                }
                                _ => {}
                            }

                            let popped = self
                                .open_elements_stack
                                .pop_until_tag_name_popped(&["form"]);

                            self.update_end_tag_span(popped.as_ref(), token_and_info.span);
                        }
                    }
                    // An end tag whose tag name is "p"
                    //
                    // If the stack of open elements does not have a p element in button scope, then
                    // this is a parse error; insert an HTML element for a "p" start tag token with
                    // no attributes.
                    //
                    // Close a p element.
                    Token::EndTag { tag_name, .. } if tag_name == "p" => {
                        if !self.open_elements_stack.has_in_button_scope("p") {
                            self.errors.push(Error::new(
                                token_and_info.span,
                                ErrorKind::NoElementToCloseButEndTagSeen(tag_name.clone()),
                            ));

                            self.insert_html_element(
                                &self.create_fake_token_and_info("p", Some(token_and_info.span)),
                            )?;
                        }

                        self.close_p_element(token_and_info, true);
                    }
                    // An end tag whose tag name is "li"
                    //
                    // If the stack of open elements does not have an li element in list item scope,
                    // then this is a parse error; ignore the token.
                    //
                    // Otherwise, run these steps:
                    //
                    // Generate implied end tags, except for li elements.
                    //
                    // If the current node is not an li element, then this is a parse error.
                    //
                    // Pop elements from the stack of open elements until an li element has been
                    // popped from the stack.
                    Token::EndTag { tag_name, .. } if tag_name == "li" => {
                        if !self.open_elements_stack.has_in_list_item_scope("li") {
                            self.errors.push(Error::new(
                                token_and_info.span,
                                ErrorKind::NoElementToCloseButEndTagSeen(tag_name.clone()),
                            ));
                        } else {
                            self.open_elements_stack
                                .generate_implied_end_tags_with_exclusion("li");

                            match self.open_elements_stack.items.last() {
                                Some(node) if !is_html_element!(node, "li") => {
                                    self.errors.push(Error::new(
                                        token_and_info.span,
                                        ErrorKind::UnclosedElements(tag_name.clone()),
                                    ));
                                }
                                _ => {}
                            }

                            let popped =
                                self.open_elements_stack.pop_until_tag_name_popped(&["li"]);

                            self.update_end_tag_span(popped.as_ref(), token_and_info.span);
                        }
                    }
                    // An end tag whose tag name is one of: "dd", "dt"
                    //
                    // If the stack of open elements does not have an element in scope that is an
                    // HTML element with the same tag name as that of the token, then this is a
                    // parse error; ignore the token.
                    //
                    // Otherwise, run these steps:
                    //
                    // Generate implied end tags, except for HTML elements with the same tag name as
                    // the token.
                    //
                    // If the current node is not an HTML element with the same tag name as that of
                    // the token, then this is a parse error.
                    //
                    // Pop elements from the stack of open elements until an HTML element with the
                    // same tag name as the token has been popped from the stack.
                    Token::EndTag { tag_name, .. } if matches!(&**tag_name, "dd" | "dt") => {
                        if !self.open_elements_stack.has_in_scope(tag_name) {
                            self.errors.push(Error::new(
                                token_and_info.span,
                                ErrorKind::NoElementToCloseButEndTagSeen(tag_name.clone()),
                            ));
                        } else {
                            self.open_elements_stack
                                .generate_implied_end_tags_with_exclusion(tag_name);

                            match self.open_elements_stack.items.last() {
                                Some(node) if !is_html_element_with_tag_name!(node, tag_name) => {
                                    self.errors.push(Error::new(
                                        token_and_info.span,
                                        ErrorKind::UnclosedElements(tag_name.clone()),
                                    ));
                                }
                                _ => {}
                            }

                            let popped = self
                                .open_elements_stack
                                .pop_until_tag_name_popped(&[tag_name]);

                            self.update_end_tag_span(popped.as_ref(), token_and_info.span);
                        }
                    }
                    // An end tag whose tag name is one of: "h1", "h2", "h3", "h4", "h5", "h6"
                    //
                    // If the stack of open elements does not have an element in scope that is an
                    // HTML element and whose tag name is one of "h1", "h2", "h3", "h4", "h5", or
                    // "h6", then this is a parse error; ignore the token.
                    //
                    // Otherwise, run these steps:
                    //
                    // Generate implied end tags.
                    //
                    // If the current node is not an HTML element with the same tag name as that of
                    // the token, then this is a parse error.
                    //
                    // Pop elements from the stack of open elements until an HTML element whose tag
                    // name is one of "h1", "h2", "h3", "h4", "h5", or "h6" has been popped from the
                    // stack.
                    Token::EndTag { tag_name, .. }
                        if matches!(&**tag_name, "h1" | "h2" | "h3" | "h4" | "h5" | "h6") =>
                    {
                        if !self.open_elements_stack.has_in_scope("h1")
                            && !self.open_elements_stack.has_in_scope("h2")
                            && !self.open_elements_stack.has_in_scope("h3")
                            && !self.open_elements_stack.has_in_scope("h4")
                            && !self.open_elements_stack.has_in_scope("h5")
                            && !self.open_elements_stack.has_in_scope("h6")
                        {
                            self.errors.push(Error::new(
                                token_and_info.span,
                                ErrorKind::StrayEndTag(tag_name.clone()),
                            ));
                        } else {
                            self.open_elements_stack.generate_implied_end_tags();

                            if let Some(node) = self.open_elements_stack.items.last() {
                                if !is_html_element_with_tag_name!(node, tag_name) {
                                    self.errors.push(Error::new(
                                        token_and_info.span,
                                        ErrorKind::UnclosedElements(tag_name.clone()),
                                    ));
                                } else {
                                    self.update_end_tag_span(Some(node), token_and_info.span);
                                }
                            }

                            self.open_elements_stack
                                .pop_until_tag_name_popped(&["h1", "h2", "h3", "h4", "h5", "h6"]);
                        }
                    }
                    // An end tag whose tag name is "sarcasm"
                    //
                    // Take a deep breath, then act as described in the "any other end tag" entry
                    // below.
                    //
                    // Skip, we will be in `Token::EndTag` branch with the same logic
                    //
                    //
                    //
                    // A start tag whose tag name is "a"
                    //
                    // If the list of active formatting elements contains an a element between the
                    // end of the list and the last marker on the list (or the start of the list if
                    // there is no marker on the list), then this is a parse error; run the adoption
                    // agency algorithm for the token, then remove that element from the list of
                    // active formatting elements and the stack of open elements if the adoption
                    // agency algorithm didn't already remove it (it might not have if the element
                    // is not in table scope).
                    //
                    // Reconstruct the active formatting elements, if any.
                    //
                    // Insert an HTML element for the token. Push onto the list of active formatting
                    // elements that element.
                    Token::StartTag {
                        tag_name,
                        is_self_closing,
                        ..
                    } if tag_name == "a" => {
                        if !self.active_formatting_elements.items.is_empty() {
                            let mut node = None;

                            for element in self.active_formatting_elements.items.iter().rev() {
                                match element {
                                    ActiveFormattingElement::Marker => {
                                        break;
                                    }
                                    ActiveFormattingElement::Element(item, _) => {
                                        if is_html_element!(item, "a") {
                                            node = Some(item);

                                            break;
                                        }
                                    }
                                }
                            }

                            if let Some(element) = node {
                                self.errors.push(Error::new(
                                    token_and_info.span,
                                    ErrorKind::SomethingSeenWhenSomethingOpen(tag_name.clone()),
                                ));

                                let remove = element.clone();

                                self.run_the_adoption_agency_algorithm(token_and_info, false)?;
                                self.active_formatting_elements.remove(&remove);
                                self.open_elements_stack.remove(&remove);
                            }
                        }

                        self.reconstruct_active_formatting_elements()?;

                        let element = self.insert_html_element(token_and_info)?;

                        self.active_formatting_elements
                            .push(ActiveFormattingElement::Element(
                                element,
                                token_and_info.clone(),
                            ));

                        maybe_allow_self_closing!(is_self_closing, tag_name);
                    }
                    // A start tag whose tag name is one of: "b", "big", "code", "em", "font", "i",
                    // "s", "small", "strike", "strong", "tt", "u"
                    //
                    // Reconstruct the active formatting elements, if any.
                    //
                    // Insert an HTML element for the token. Push onto the list of active formatting
                    // elements that element.
                    Token::StartTag {
                        tag_name,
                        is_self_closing,
                        ..
                    } if matches!(
                        &**tag_name,
                        "b" | "big"
                            | "code"
                            | "em"
                            | "font"
                            | "i"
                            | "s"
                            | "small"
                            | "strike"
                            | "strong"
                            | "tt"
                            | "u"
                    ) =>
                    {
                        self.reconstruct_active_formatting_elements()?;

                        let element = self.insert_html_element(token_and_info)?;

                        self.active_formatting_elements
                            .push(ActiveFormattingElement::Element(
                                element,
                                token_and_info.clone(),
                            ));

                        maybe_allow_self_closing!(is_self_closing, tag_name);
                    }
                    // A start tag whose tag name is "nobr"
                    //
                    // Reconstruct the active formatting elements, if any.
                    //
                    // If the stack of open elements has a nobr element in scope, then this is a
                    // parse error; run the adoption agency algorithm for the token, then once again
                    // reconstruct the active formatting elements, if any.
                    //
                    // Insert an HTML element for the token. Push onto the list of active formatting
                    // elements that element.
                    Token::StartTag {
                        tag_name,
                        is_self_closing,
                        ..
                    } if tag_name == "nobr" => {
                        self.reconstruct_active_formatting_elements()?;

                        if self.open_elements_stack.has_in_scope("nobr") {
                            self.errors.push(Error::new(
                                token_and_info.span,
                                ErrorKind::SomethingSeenWhenSomethingOpen(tag_name.clone()),
                            ));

                            self.run_the_adoption_agency_algorithm(token_and_info, false)?;
                            self.reconstruct_active_formatting_elements()?;
                        }

                        let element = self.insert_html_element(token_and_info)?;

                        self.active_formatting_elements
                            .push(ActiveFormattingElement::Element(
                                element,
                                token_and_info.clone(),
                            ));
                        maybe_allow_self_closing!(is_self_closing, tag_name);
                    }
                    // An end tag whose tag name is one of: "a", "b", "big", "code", "em", "font",
                    // "i", "nobr", "s", "small", "strike", "strong", "tt", "u"
                    //
                    // Run the adoption agency algorithm for the token.
                    Token::EndTag { tag_name, .. }
                        if matches!(
                            &**tag_name,
                            "a" | "b"
                                | "big"
                                | "code"
                                | "em"
                                | "font"
                                | "i"
                                | "nobr"
                                | "s"
                                | "small"
                                | "strike"
                                | "strong"
                                | "tt"
                                | "u"
                        ) =>
                    {
                        self.run_the_adoption_agency_algorithm(token_and_info, true)?;
                    }
                    // A start tag whose tag name is one of: "applet", "marquee", "object"
                    //
                    // Reconstruct the active formatting elements, if any.
                    //
                    // Insert an HTML element for the token.
                    //
                    // Insert a marker at the end of the list of active formatting elements.
                    //
                    // Set the frameset-ok flag to "not ok".
                    Token::StartTag { tag_name, .. }
                        if matches!(&**tag_name, "applet" | "marquee" | "object") =>
                    {
                        self.reconstruct_active_formatting_elements()?;
                        self.insert_html_element(token_and_info)?;
                        self.active_formatting_elements.insert_marker();
                        self.frameset_ok = false;
                    }
                    // An end tag token whose tag name is one of: "applet", "marquee", "object"
                    //
                    // If the stack of open elements does not have an element in scope that is an
                    // HTML element with the same tag name as that of the token, then this is a
                    // parse error; ignore the token.
                    //
                    // Otherwise, run these steps:
                    //
                    // Generate implied end tags.
                    //
                    // If the current node is not an HTML element with the same tag name as that of
                    // the token, then this is a parse error.
                    //
                    // Pop elements from the stack of open elements until an HTML element with the
                    // same tag name as the token has been popped from the stack.
                    //
                    // Clear the list of active formatting elements up to the last marker.
                    Token::EndTag { tag_name, .. }
                        if matches!(&**tag_name, "applet" | "marquee" | "object") =>
                    {
                        if !self.open_elements_stack.has_in_scope(tag_name) {
                            self.errors.push(Error::new(
                                token_and_info.span,
                                ErrorKind::StrayEndTag(tag_name.clone()),
                            ));
                        } else {
                            self.open_elements_stack.generate_implied_end_tags();

                            match self.open_elements_stack.items.last() {
                                Some(node) if !is_html_element_with_tag_name!(node, tag_name) => {
                                    self.errors.push(Error::new(
                                        token_and_info.span,
                                        ErrorKind::UnclosedElements(tag_name.clone()),
                                    ));
                                }
                                _ => {}
                            }

                            let popped = self
                                .open_elements_stack
                                .pop_until_tag_name_popped(&[tag_name]);

                            self.update_end_tag_span(popped.as_ref(), token_and_info.span);
                            self.active_formatting_elements.clear_to_last_marker();
                        }
                    }
                    // A start tag whose tag name is "table"
                    //
                    // If the Document is not set to quirks mode, and the stack of open elements has
                    // a p element in button scope, then close a p element.
                    //
                    // Insert an HTML element for the token.
                    //
                    // Set the frameset-ok flag to "not ok".
                    //
                    // Switch the insertion mode to "in table".
                    Token::StartTag {
                        tag_name,
                        is_self_closing,
                        ..
                    } if tag_name == "table" => {
                        if get_document_mode!(self.document.as_ref().unwrap())
                            != DocumentMode::Quirks
                            && self.open_elements_stack.has_in_button_scope("p")
                        {
                            self.close_p_element(token_and_info, false);
                        }

                        self.insert_html_element(token_and_info)?;
                        self.frameset_ok = false;
                        self.insertion_mode = InsertionMode::InTable;
                        maybe_allow_self_closing!(is_self_closing, tag_name);
                    }
                    // An end tag whose tag name is "br"
                    //
                    // Parse error. Drop the attributes from the token, and act as described in the
                    // next entry; i.e. act as if this was a "br" start tag token with no
                    // attributes, rather than the end tag token that it actually is.
                    Token::EndTag {
                        tag_name,
                        is_self_closing,
                        ..
                    } if tag_name == "br" => {
                        let is_self_closing = *is_self_closing;

                        self.errors
                            .push(Error::new(token_and_info.span, ErrorKind::EndTagBr));

                        self.reconstruct_active_formatting_elements()?;
                        self.insert_html_element(
                            &self.create_fake_token_and_info("br", Some(token_and_info.span)),
                        )?;
                        self.open_elements_stack.pop();

                        if is_self_closing {
                            token_and_info.acknowledged = true;
                        }

                        self.frameset_ok = false;
                    }
                    // A start tag whose tag name is one of: "area", "br", "embed", "img", "keygen",
                    // "wbr"
                    //
                    // Reconstruct the active formatting elements, if any.
                    //
                    // Insert an HTML element for the token. Immediately pop the current node off
                    // the stack of open elements.
                    //
                    // Acknowledge the token's self-closing flag, if it is set.
                    //
                    // Set the frameset-ok flag to "not ok".
                    Token::StartTag {
                        tag_name,
                        is_self_closing,
                        ..
                    } if matches!(
                        &**tag_name,
                        "area" | "br" | "embed" | "img" | "keygen" | "wbr"
                    ) =>
                    {
                        let is_self_closing = *is_self_closing;

                        self.reconstruct_active_formatting_elements()?;
                        self.insert_html_element(token_and_info)?;
                        self.open_elements_stack.pop();

                        if is_self_closing {
                            token_and_info.acknowledged = true;
                        }

                        self.frameset_ok = false;
                    }
                    // A start tag whose tag name is "input"
                    //
                    // Reconstruct the active formatting elements, if any.
                    //
                    // Insert an HTML element for the token. Immediately pop the current node off
                    // the stack of open elements.
                    //
                    // Acknowledge the token's self-closing flag, if it is set.
                    //
                    // If the token does not have an attribute with the name "type", or if it does,
                    // but that attribute's value is not an ASCII case-insensitive match for the
                    // string "hidden", then: set the frameset-ok flag to "not ok".
                    Token::StartTag {
                        tag_name,
                        is_self_closing,
                        attributes,
                        ..
                    } if tag_name == "input" => {
                        let is_self_closing = *is_self_closing;
                        let input_type =
                            attributes.iter().find(|attribute| attribute.name == "type");
                        let is_hidden = match &input_type {
                            Some(input_type) => match &input_type.value {
                                Some(value) if value.as_ref().eq_ignore_ascii_case("hidden") => {
                                    true
                                }
                                _ => false,
                            },
                            _ => false,
                        };

                        self.reconstruct_active_formatting_elements()?;

                        // To avoid extra cloning, it doesn't have effect on logic
                        if input_type.is_none() || !is_hidden {
                            self.frameset_ok = false;
                        }

                        self.insert_html_element(token_and_info)?;
                        self.open_elements_stack.pop();

                        if is_self_closing {
                            token_and_info.acknowledged = true;
                        }
                    }
                    // A start tag whose tag name is one of: "param", "source", "track"
                    //
                    // Insert an HTML element for the token. Immediately pop the current node off
                    // the stack of open elements.
                    //
                    // Acknowledge the token's self-closing flag, if it is set.
                    Token::StartTag {
                        tag_name,
                        is_self_closing,
                        ..
                    } if matches!(&**tag_name, "param" | "source" | "track") => {
                        let is_self_closing = *is_self_closing;

                        self.insert_html_element(token_and_info)?;
                        self.open_elements_stack.pop();

                        if is_self_closing {
                            token_and_info.acknowledged = true;
                        }
                    }
                    // A start tag whose tag name is "hr"
                    //
                    // If the stack of open elements has a p element in button scope, then close a p
                    // element.
                    //
                    // Insert an HTML element for the token. Immediately pop the current node off
                    // the stack of open elements.
                    //
                    // Acknowledge the token's self-closing flag, if it is set.
                    //
                    // Set the frameset-ok flag to "not ok".
                    Token::StartTag {
                        tag_name,
                        is_self_closing,
                        ..
                    } if tag_name == "hr" => {
                        let is_self_closing = *is_self_closing;

                        if self.open_elements_stack.has_in_button_scope("p") {
                            self.close_p_element(token_and_info, false);
                        }

                        self.insert_html_element(token_and_info)?;
                        self.open_elements_stack.pop();

                        if is_self_closing {
                            token_and_info.acknowledged = true;
                        }

                        self.frameset_ok = false;
                    }
                    // A start tag whose tag name is "image"
                    //
                    // Parse error. Change the token's tag name to "img" and reprocess it. (Don't
                    // ask.)
                    Token::StartTag { tag_name, .. } if tag_name == "image" => {
                        self.errors.push(Error::new(
                            token_and_info.span,
                            ErrorKind::UnexpectedImageStartTag,
                        ));

                        match token_and_info {
                            TokenAndInfo {
                                token: Token::StartTag { tag_name, .. },
                                ..
                            } => {
                                *tag_name = "img".into();
                            }
                            _ => {
                                unreachable!();
                            }
                        }

                        self.process_token(token_and_info, None)?;
                    }
                    // A start tag whose tag name is "textarea"
                    //
                    // Run these steps:
                    //
                    // Insert an HTML element for the token.
                    //
                    // If the next token is a U+000A LINE FEED (LF) character token, then ignore
                    // that token and move on to the next one. (Newlines at the start of textarea
                    // elements are ignored as an authoring convenience.)
                    //
                    // Switch the tokenizer to the RCDATA state.
                    //
                    // Let the original insertion mode be the current insertion mode.
                    //
                    // Set the frameset-ok flag to "not ok".
                    //
                    // Switch the insertion mode to "text".
                    Token::StartTag { tag_name, .. } if tag_name == "textarea" => {
                        self.insert_html_element(token_and_info)?;

                        // To prevent parsing more tokens in lexer we set state before taking
                        self.input.set_input_state(State::Rcdata);

                        match self.input.cur()? {
                            Some(Token::Character { value, .. }) if *value == '\x0A' => {
                                bump!(self);
                            }
                            _ => {}
                        };

                        self.original_insertion_mode = self.insertion_mode.clone();
                        self.frameset_ok = false;
                        self.insertion_mode = InsertionMode::Text;
                    }
                    // A start tag whose tag name is "xmp"
                    //
                    // If the stack of open elements has a p element in button scope, then close a p
                    // element.
                    //
                    // Reconstruct the active formatting elements, if any.
                    //
                    // Set the frameset-ok flag to "not ok".
                    //
                    // Follow the generic raw text element parsing algorithm.
                    Token::StartTag {
                        tag_name,
                        is_self_closing,
                        ..
                    } if tag_name == "xmp" => {
                        if self.open_elements_stack.has_in_button_scope("p") {
                            self.close_p_element(token_and_info, false);
                        }

                        self.reconstruct_active_formatting_elements()?;
                        self.frameset_ok = false;
                        self.parse_generic_text_element(token_and_info, true)?;
                        maybe_allow_self_closing!(is_self_closing, tag_name);
                    }
                    // A start tag whose tag name is "iframe"
                    //
                    // Set the frameset-ok flag to "not ok".
                    //
                    // Follow the generic raw text element parsing algorithm.
                    Token::StartTag {
                        tag_name,
                        is_self_closing,
                        ..
                    } if tag_name == "iframe" => {
                        self.frameset_ok = false;
                        self.parse_generic_text_element(token_and_info, true)?;
                        maybe_allow_self_closing!(is_self_closing, tag_name);
                    }
                    // A start tag whose tag name is "noembed"
                    //
                    // A start tag whose tag name is "noscript", if the scripting flag is enabled
                    //
                    // Follow the generic raw text element parsing algorithm.
                    Token::StartTag {
                        tag_name,
                        is_self_closing,
                        ..
                    } if tag_name == "noembed"
                        || (tag_name == "noscript" && self.config.scripting_enabled) =>
                    {
                        self.parse_generic_text_element(token_and_info, true)?;
                        maybe_allow_self_closing!(is_self_closing, tag_name);
                    }
                    // A start tag whose tag name is "select"
                    //
                    // Reconstruct the active formatting elements, if any.
                    //
                    // Insert an HTML element for the token.
                    //
                    // Set the frameset-ok flag to "not ok".
                    //
                    // If the insertion mode is one of "in table", "in caption", "in table body",
                    // "in row", or "in cell", then switch the insertion mode to "in select in
                    // table". Otherwise, switch the insertion mode to "in select".
                    Token::StartTag {
                        tag_name,
                        is_self_closing,
                        ..
                    } if tag_name == "select" => {
                        self.reconstruct_active_formatting_elements()?;
                        self.insert_html_element(token_and_info)?;
                        self.frameset_ok = false;

                        match self.insertion_mode {
                            InsertionMode::InTable
                            | InsertionMode::InCaption
                            | InsertionMode::InTableBody
                            | InsertionMode::InRow
                            | InsertionMode::InCell => {
                                self.insertion_mode = InsertionMode::InSelectInTable;
                            }
                            _ => {
                                self.insertion_mode = InsertionMode::InSelect;
                            }
                        }

                        maybe_allow_self_closing!(is_self_closing, tag_name);
                    }
                    // A start tag whose tag name is one of: "optgroup", "option"
                    //
                    // If the current node is an option element, then pop the current node off the
                    // stack of open elements.
                    //
                    // Reconstruct the active formatting elements, if any.
                    //
                    // Insert an HTML element for the token.
                    Token::StartTag {
                        tag_name,
                        is_self_closing,
                        ..
                    } if matches!(&**tag_name, "optgroup" | "option") => {
                        match self.open_elements_stack.items.last() {
                            Some(node) if is_html_element!(node, "option") => {
                                self.open_elements_stack.pop();
                            }
                            _ => {}
                        }

                        self.reconstruct_active_formatting_elements()?;
                        self.insert_html_element(token_and_info)?;
                        maybe_allow_self_closing!(is_self_closing, tag_name);
                    }
                    // A start tag whose tag name is one of: "rb", "rtc"
                    //
                    // If the stack of open elements has a ruby element in scope, then generate
                    // implied end tags. If the current node is not now a ruby element, this is a
                    // parse error.
                    //
                    // Insert an HTML element for the token.
                    Token::StartTag {
                        tag_name,
                        is_self_closing,
                        ..
                    } if matches!(&**tag_name, "rb" | "rtc") => {
                        let is_scope = self.open_elements_stack.has_in_scope("ruby");

                        if is_scope {
                            self.open_elements_stack.generate_implied_end_tags();
                        }

                        match self.open_elements_stack.items.last() {
                            Some(node) if !is_html_element!(node, "ruby") => {
                                if !is_scope {
                                    self.errors.push(Error::new(
                                        token_and_info.span,
                                        ErrorKind::StartTagSeenWithoutRuby(tag_name.clone()),
                                    ));
                                } else {
                                    self.errors.push(Error::new(
                                        token_and_info.span,
                                        ErrorKind::UnclosedChildrenInRuby,
                                    ));
                                }
                            }
                            _ => {}
                        }

                        self.insert_html_element(token_and_info)?;
                        maybe_allow_self_closing!(is_self_closing, tag_name);
                    }
                    // A start tag whose tag name is one of: "rp", "rt"
                    //
                    // If the stack of open elements has a ruby element in scope, then generate
                    // implied end tags, except for rtc elements. If the current node is not now a
                    // rtc element or a ruby element, this is a parse error.
                    //
                    // Insert an HTML element for the token.
                    Token::StartTag {
                        tag_name,
                        is_self_closing,
                        ..
                    } if matches!(&**tag_name, "rp" | "rt") => {
                        let in_scope = self.open_elements_stack.has_in_scope("ruby");

                        if in_scope {
                            self.open_elements_stack
                                .generate_implied_end_tags_with_exclusion("rtc");
                        }

                        match self.open_elements_stack.items.last() {
                            Some(node) if !is_html_element!(node, "rtc" | "ruby") => {
                                if !in_scope {
                                    self.errors.push(Error::new(
                                        token_and_info.span,
                                        ErrorKind::StartTagSeenWithoutRuby(tag_name.clone()),
                                    ));
                                } else {
                                    self.errors.push(Error::new(
                                        token_and_info.span,
                                        ErrorKind::UnclosedChildrenInRuby,
                                    ));
                                }
                            }
                            _ => {}
                        }

                        self.insert_html_element(token_and_info)?;
                        maybe_allow_self_closing!(is_self_closing, tag_name);
                    }
                    // A start tag whose tag name is "math"
                    //
                    // Reconstruct the active formatting elements, if any.
                    //
                    // Adjust MathML attributes for the token. (This fixes the case of MathML
                    // attributes that are not all lowercase.)
                    //
                    // Adjust foreign attributes for the token. (This fixes the use of namespaced
                    // attributes, in particular XLink.)
                    //
                    // Insert a foreign element for the token, in the MathML namespace.
                    //
                    // If the token has its self-closing flag set, pop the current node off the
                    // stack of open elements and acknowledge the token's self-closing flag.
                    Token::StartTag {
                        tag_name,
                        is_self_closing,
                        ..
                    } if tag_name == "math" => {
                        let is_self_closing = *is_self_closing;

                        self.reconstruct_active_formatting_elements()?;
                        self.insert_foreign_element(
                            token_and_info,
                            Namespace::MATHML,
                            Some(AdjustAttributes::MathML),
                        )?;

                        if is_self_closing {
                            self.open_elements_stack.pop();

                            token_and_info.acknowledged = true;
                        }
                    }
                    // A start tag whose tag name is "svg"
                    //
                    // Reconstruct the active formatting elements, if any.
                    //
                    // Adjust SVG attributes for the token. (This fixes the case of SVG attributes
                    // that are not all lowercase.)
                    //
                    // Adjust foreign attributes for the token. (This fixes the use of namespaced
                    // attributes, in particular XLink in SVG.)
                    //
                    // Insert a foreign element for the token, in the SVG namespace.
                    //
                    // If the token has its self-closing flag set, pop the current node off the
                    // stack of open elements and acknowledge the token's self-closing flag.
                    Token::StartTag {
                        tag_name,
                        is_self_closing,
                        ..
                    } if tag_name == "svg" => {
                        let is_self_closing = *is_self_closing;

                        self.reconstruct_active_formatting_elements()?;
                        self.insert_foreign_element(
                            token_and_info,
                            Namespace::SVG,
                            Some(AdjustAttributes::Svg),
                        )?;

                        if is_self_closing {
                            self.open_elements_stack.pop();

                            token_and_info.acknowledged = true;
                        }
                    }

                    // A start tag whose tag name is one of: "caption", "col", "colgroup", "frame",
                    // "head", "tbody", "td", "tfoot", "th", "thead", "tr"
                    //
                    // Parse error. Ignore the token.
                    Token::StartTag { tag_name, .. }
                        if matches!(
                            &**tag_name,
                            "caption"
                                | "col"
                                | "colgroup"
                                | "frame"
                                | "head"
                                | "tbody"
                                | "td"
                                | "tfoot"
                                | "th"
                                | "thead"
                                | "tr"
                        ) =>
                    {
                        self.errors.push(Error::new(
                            token_and_info.span,
                            ErrorKind::StrayStartTag(tag_name.clone()),
                        ));
                    }
                    // Any other start tag
                    //
                    // Reconstruct the active formatting elements, if any.
                    //
                    // Insert an HTML element for the token.
                    Token::StartTag {
                        is_self_closing,
                        tag_name,
                        ..
                    } => {
                        self.reconstruct_active_formatting_elements()?;
                        self.insert_html_element(token_and_info)?;
                        maybe_allow_self_closing!(is_self_closing, tag_name);
                    }
                    // Any other end tag
                    Token::EndTag { .. } => {
                        self.any_other_end_tag_for_in_body_insertion_mode(token_and_info);
                    }
                }

                // When the steps above say the user agent is to close a p
                // element, it means that the user agent must run the following
                // steps:
                //
                // Generate implied end tags, except for p elements.
                //
                // If the current node is not a p element, then this is a parse
                // error.
                //
                // Pop elements from the stack of open elements until a p
                // element has been popped from the stack.
                //
                // The adoption agency algorithm, which takes as its only
                // argument a token token for which the algorithm is being run,
                // consists of the following steps:
                //
                // Let subject be token's tag name.
                //
                // If the current node is an HTML element whose tag name is
                // subject, and the current node is not in the list of active
                // formatting elements, then pop the current node off the stack
                // of open elements and return.
                //
                // Let outer loop counter be 0.
                //
                // While true:
                //
                // If outer loop counter is greater than or equal to 8, then
                // return.
                //
                // Increment outer loop counter by 1.
                //
                // Let formatting element be the last element in the list of
                // active formatting elements that:
                //
                // is between the end of the list and the last marker in the
                // list, if any, or the start of the list otherwise, and
                // has the tag name subject.
                // If there is no such element, then return and instead act as
                // described in the "any other end tag" entry above.
                //
                // If formatting element is not in the stack of open elements,
                // then this is a parse error; remove the element from the list,
                // and return.
                //
                // If formatting element is in the stack of open elements, but
                // the element is not in scope, then this is a parse error;
                // return.
                //
                // If formatting element is not the current node, this is a
                // parse error. (But do not return.)
                //
                // Let furthest block be the topmost node in the stack of open
                // elements that is lower in the stack than formatting element,
                // and is an element in the special category. There might not be
                // one.
                //
                // If there is no furthest block, then the UA must first pop all
                // the nodes from the bottom of the stack of open elements, from
                // the current node up to and including formatting element, then
                // remove formatting element from the list of active formatting
                // elements, and finally return.
                //
                // Let common ancestor be the element immediately above
                // formatting element in the stack of open elements.
                //
                // Let a bookmark note the position of formatting element in the
                // list of active formatting elements relative to the elements
                // on either side of it in the list.
                //
                // Let node and last node be furthest block.
                //
                // Let inner loop counter be 0.
                //
                // While true:
                //
                // Increment inner loop counter by 1.
                //
                // Let node be the element immediately above node in the stack
                // of open elements, or if node is no longer in the stack of
                // open elements (e.g. because it got removed by this
                // algorithm), the element that was immediately above node in
                // the stack of open elements before node was removed.
                //
                // If node is formatting element, then break.
                //
                // If inner loop counter is greater than 3 and node is in the
                // list of active formatting elements, then remove node from the
                // list of active formatting elements.
                //
                // If node is not in the list of active formatting elements,
                // then remove node from the stack of open elements and
                // continue.
                //
                // Create an element for the token for which the element node
                // was created, in the HTML namespace, with common ancestor as
                // the intended parent; replace the entry for node in the list
                // of active formatting elements with an entry for the new
                // element, replace the entry for node in the stack of open
                // elements with an entry for the new element, and let node be
                // the new element.
                //
                // If last node is furthest block, then move the aforementioned
                // bookmark to be immediately after the new node in the list of
                // active formatting elements.
                //
                // Append last node to node.
                //
                // Set last node to node.
                //
                // Insert whatever last node ended up being in the previous step
                // at the appropriate place for inserting a node, but using
                // common ancestor as the override target.
                //
                // Create an element for the token for which formatting element
                // was created, in the HTML namespace, with furthest block as
                // the intended parent.
                //
                // Take all of the child nodes of furthest block and append them
                // to the element created in the last step.
                //
                // Append that new element to furthest block.
                //
                // Remove formatting element from the list of active formatting
                // elements, and insert the new element into the list of active
                // formatting elements at the position of the aforementioned
                // bookmark.
                //
                // Remove formatting element from the stack of open elements,
                // and insert the new element into the stack of open elements
                // immediately below the position of furthest block in that
                // stack.
            }
            // The "text" insertion mode
            InsertionMode::Text => {
                // When the user agent is to apply the rules for the "text" insertion mode, the
                // user agent must handle the token as follows:
                match token {
                    // A character token
                    //
                    // Insert the token's character.
                    Token::Character { .. } => {
                        self.insert_character(token_and_info)?;
                    }
                    // An end-of-file token
                    //
                    // Parse error.
                    //
                    // If the current node is a script element, mark the script element as "already
                    // started".
                    //
                    // Pop the current node off the stack of open elements.
                    //
                    // Switch the insertion mode to the original insertion mode and reprocess the
                    // token.
                    Token::Eof => {
                        self.errors
                            .push(Error::new(token_and_info.span, ErrorKind::EofInText));

                        let popped = self.open_elements_stack.pop();

                        self.update_end_tag_span(popped.as_ref(), token_and_info.span);
                        self.insertion_mode = self.original_insertion_mode.clone();
                        self.process_token(token_and_info, None)?;
                    }
                    // An end tag whose tag name is "script"
                    //
                    // If the active speculative HTML parser is null and the JavaScript execution
                    // context stack is empty, then perform a microtask checkpoint.
                    //
                    // Let script be the current node (which will be a script element).
                    //
                    // Pop the current node off the stack of open elements.
                    //
                    // Switch the insertion mode to the original insertion mode.
                    //
                    // Let the old insertion point have the same value as the current insertion
                    // point. Let the insertion point be just before the next input character.
                    //
                    // Increment the parser's script nesting level by one.
                    //
                    // If the active speculative HTML parser is null, then prepare the script. This
                    // might cause some script to execute, which might cause new characters to be
                    // inserted into the tokenizer, and might cause the tokenizer to output more
                    // tokens, resulting in a reentrant invocation of the parser.
                    //
                    // Decrement the parser's script nesting level by one. If the parser's script
                    // nesting level is zero, then set the parser pause flag to false.
                    //
                    // Let the insertion point have the value of the old insertion point. (In other
                    // words, restore the insertion point to its previous value. This value might be
                    // the "undefined" value.)
                    //
                    // At this stage, if there is a pending parsing-blocking script, then:
                    //
                    // If the script nesting level is not zero:
                    // Set the parser pause flag to true, and abort the processing of any nested
                    // invocations of the tokenizer, yielding control back to the caller.
                    // (Tokenization will resume when the caller returns to the "outer" tree
                    // construction stage.)
                    //
                    // The tree construction stage of this particular parser is being called
                    // reentrantly, say from a call to document.write().
                    //
                    // Otherwise:
                    // Run these steps:
                    //
                    // Let the script be the pending parsing-blocking script. There is no longer a
                    // pending parsing-blocking script.
                    //
                    // Start the speculative HTML parser for this instance of the HTML parser.
                    //
                    // Block the tokenizer for this instance of the HTML parser, such that the event
                    // loop will not run tasks that invoke the tokenizer.
                    //
                    // If the parser's Document has a style sheet that is blocking scripts or the
                    // script's "ready to be parser-executed" flag is not set: spin the event loop
                    // until the parser's Document has no style sheet that is blocking scripts and
                    // the script's "ready to be parser-executed" flag is set.
                    //
                    // If this parser has been aborted in the meantime, return.
                    //
                    // This could happen if, e.g., while the spin the event loop algorithm is
                    // running, the browsing context gets closed, or the document.open() method gets
                    // invoked on the Document.
                    //
                    // Stop the speculative HTML parser for this instance of the HTML parser.
                    //
                    // Unblock the tokenizer for this instance of the HTML parser, such that tasks
                    // that invoke the tokenizer can again be run.
                    //
                    // Let the insertion point be just before the next input character.
                    //
                    // Increment the parser's script nesting level by one (it should be zero before
                    // this step, so this sets it to one).
                    //
                    // Execute the script.
                    //
                    // Decrement the parser's script nesting level by one. If the parser's script
                    // nesting level is zero (which it always should be at this point), then set the
                    // parser pause flag to false.
                    //
                    // Let the insertion point be undefined again.
                    //
                    // If there is once again a pending parsing-blocking script, then repeat these
                    // steps from step 1.
                    Token::EndTag { tag_name, .. } if tag_name == "script" => {
                        // More things can be implemented to intercept script execution
                        let popped = self.open_elements_stack.pop();

                        self.update_end_tag_span(popped.as_ref(), token_and_info.span);
                        self.insertion_mode = self.original_insertion_mode.clone();
                    }
                    // Any other end tag
                    //
                    // Pop the current node off the stack of open elements.
                    //
                    // Switch the insertion mode to the original insertion mode.
                    _ => {
                        if let Token::EndTag { .. } = token {
                            self.update_end_tag_span(
                                self.open_elements_stack.items.last(),
                                token_and_info.span,
                            );
                        }

                        self.open_elements_stack.pop();
                        self.insertion_mode = self.original_insertion_mode.clone();
                    }
                }
            }
            // The "in table" insertion mode
            InsertionMode::InTable => {
                // When the user agent is to apply the rules for the "in table" insertion mode,
                // the user agent must handle the token as follows:
                match token {
                    // A character token, if the current node is table, tbody, tfoot, thead, or tr
                    // element
                    //
                    // Let the pending table character tokens be an empty list of tokens.
                    //
                    // Let the original insertion mode be the current insertion mode.
                    //
                    // Switch the insertion mode to "in table text" and reprocess the token.
                    Token::Character { .. }
                        if match self.open_elements_stack.items.last() {
                            Some(node)
                                if is_html_element!(
                                    node,
                                    "table" | "tbody" | "tfoot" | "thead" | "tr" | "template"
                                ) =>
                            {
                                true
                            }
                            _ => false,
                        } =>
                    {
                        self.pending_character_tokens.clear();
                        self.original_insertion_mode = self.insertion_mode.clone();
                        self.insertion_mode = InsertionMode::InTableText;
                        self.process_token(token_and_info, None)?;
                    }
                    // A comment token
                    //
                    // Insert a comment.
                    Token::Comment { .. } => {
                        self.insert_comment(token_and_info)?;
                    }
                    // A DOCTYPE token
                    //
                    // Parse error. Ignore the token.
                    Token::Doctype { .. } => {
                        self.errors
                            .push(Error::new(token_and_info.span, ErrorKind::StrayDoctype));
                    }
                    // A start tag whose tag name is "caption"
                    //
                    // Clear the stack back to a table context. (See below.)
                    //
                    // Insert a marker at the end of the list of active formatting elements.
                    //
                    // Insert an HTML element for the token, then switch the insertion mode to "in
                    // caption".
                    Token::StartTag {
                        tag_name,
                        is_self_closing,
                        ..
                    } if tag_name == "caption" => {
                        self.open_elements_stack.clear_back_to_table_context();
                        self.active_formatting_elements.insert_marker();
                        self.insert_html_element(token_and_info)?;
                        self.insertion_mode = InsertionMode::InCaption;
                        maybe_allow_self_closing!(is_self_closing, tag_name);
                    }
                    // A start tag whose tag name is "colgroup"
                    //
                    // Clear the stack back to a table context. (See below.)
                    //
                    // Insert an HTML element for the token, then switch the insertion mode to "in
                    // column group".
                    Token::StartTag {
                        tag_name,
                        is_self_closing,
                        ..
                    } if tag_name == "colgroup" => {
                        self.open_elements_stack.clear_back_to_table_context();
                        self.insert_html_element(token_and_info)?;
                        self.insertion_mode = InsertionMode::InColumnGroup;
                        maybe_allow_self_closing!(is_self_closing, tag_name);
                    }
                    // A start tag whose tag name is "col"
                    //
                    // Clear the stack back to a table context. (See below.)
                    //
                    // Insert an HTML element for a "colgroup" start tag token with no attributes,
                    // then switch the insertion mode to "in column group".
                    //
                    // Reprocess the current token.
                    Token::StartTag { tag_name, .. } if tag_name == "col" => {
                        self.open_elements_stack.clear_back_to_table_context();
                        self.insert_html_element(
                            &self.create_fake_token_and_info("colgroup", None),
                        )?;
                        self.insertion_mode = InsertionMode::InColumnGroup;
                        self.process_token(token_and_info, None)?;
                    }
                    // A start tag whose tag name is one of: "tbody", "tfoot", "thead"
                    //
                    // Clear the stack back to a table context. (See below.)
                    //
                    // Insert an HTML element for the token, then switch the insertion mode to "in
                    // table body".
                    Token::StartTag {
                        tag_name,
                        is_self_closing,
                        ..
                    } if matches!(&**tag_name, "tbody" | "tfoot" | "thead") => {
                        self.open_elements_stack.clear_back_to_table_context();
                        self.insert_html_element(token_and_info)?;
                        self.insertion_mode = InsertionMode::InTableBody;
                        maybe_allow_self_closing!(is_self_closing, tag_name);
                    }
                    // A start tag whose tag name is one of: "td", "th", "tr"
                    //
                    // Clear the stack back to a table context. (See below.)
                    //
                    // Insert an HTML element for a "tbody" start tag token with no attributes, then
                    // switch the insertion mode to "in table body".
                    //
                    // Reprocess the current token.
                    Token::StartTag { tag_name, .. }
                        if matches!(&**tag_name, "td" | "th" | "tr") =>
                    {
                        self.open_elements_stack.clear_back_to_table_context();
                        self.insert_html_element(&self.create_fake_token_and_info("tbody", None))?;
                        self.insertion_mode = InsertionMode::InTableBody;
                        self.process_token(token_and_info, None)?;
                    }
                    // A start tag whose tag name is "table"
                    //
                    // Parse error.
                    //
                    // If the stack of open elements does not have a table element in table scope,
                    // ignore the token.
                    //
                    // Otherwise:
                    //
                    // Pop elements from this stack until a table element has been popped from the
                    // stack.
                    //
                    // Reset the insertion mode appropriately.
                    //
                    // Reprocess the token.
                    Token::StartTag { tag_name, .. } if tag_name == "table" => {
                        self.errors.push(Error::new(
                            token_and_info.span,
                            ErrorKind::TableSeenWhileTableOpen,
                        ));

                        if !self.open_elements_stack.has_in_table_scope("table") {
                            // Ignore

                            return Ok(());
                        }

                        self.open_elements_stack
                            .pop_until_tag_name_popped(&["table"]);
                        self.reset_insertion_mode();
                        self.process_token(token_and_info, None)?;
                    }
                    // An end tag whose tag name is "table"
                    //
                    // If the stack of open elements does not have a table element in table scope,
                    // this is a parse error; ignore the token.
                    //
                    // Otherwise:
                    //
                    // Pop elements from this stack until a table element has been popped from the
                    // stack.
                    //
                    // Reset the insertion mode appropriately.
                    Token::EndTag { tag_name, .. } if tag_name == "table" => {
                        if !self.open_elements_stack.has_in_table_scope("table") {
                            self.errors.push(Error::new(
                                token_and_info.span,
                                ErrorKind::StrayEndTag(tag_name.clone()),
                            ));
                        } else {
                            let popped = self
                                .open_elements_stack
                                .pop_until_tag_name_popped(&["table"]);

                            self.update_end_tag_span(popped.as_ref(), token_and_info.span);
                            self.reset_insertion_mode();
                        }
                    }
                    // An end tag whose tag name is one of: "body", "caption", "col", "colgroup",
                    // "html", "tbody", "td", "tfoot", "th", "thead", "tr"
                    //
                    // Parse error. Ignore the token.
                    Token::EndTag { tag_name, .. }
                        if matches!(
                            &**tag_name,
                            "body"
                                | "caption"
                                | "col"
                                | "colgroup"
                                | "html"
                                | "tbody"
                                | "td"
                                | "tfoot"
                                | "th"
                                | "thead"
                                | "tr"
                        ) =>
                    {
                        self.errors.push(Error::new(
                            token_and_info.span,
                            ErrorKind::StrayEndTag(tag_name.clone()),
                        ));
                    }
                    // A start tag whose tag name is one of: "style", "script", "template"
                    //
                    // An end tag whose tag name is "template"
                    //
                    // Process the token using the rules for the "in head" insertion mode.
                    Token::StartTag { tag_name, .. }
                        if matches!(&**tag_name, "style" | "script" | "template") =>
                    {
                        self.process_token_using_rules(token_and_info, InsertionMode::InHead)?;
                    }
                    Token::EndTag { tag_name, .. } if tag_name == "template" => {
                        self.process_token_using_rules(token_and_info, InsertionMode::InHead)?;
                    }
                    // A start tag whose tag name is "input"
                    //
                    // If the token does not have an attribute with the name "type", or if it does,
                    // but that attribute's value is not an ASCII case-insensitive match for the
                    // string "hidden", then: act as described in the "anything else" entry below.
                    //
                    // Otherwise:
                    //
                    // Parse error.
                    //
                    // Insert an HTML element for the token.
                    //
                    // Pop that input element off the stack of open elements.
                    //
                    // Acknowledge the token's self-closing flag, if it is set.
                    Token::StartTag {
                        tag_name,
                        attributes,
                        is_self_closing,
                        ..
                    } if tag_name == "input" => {
                        let is_self_closing = *is_self_closing;
                        let input_type =
                            attributes.iter().find(|attribute| attribute.name == "type");
                        let is_hidden = match &input_type {
                            Some(input_type) => match &input_type.value {
                                Some(value) if value.as_ref().eq_ignore_ascii_case("hidden") => {
                                    true
                                }
                                _ => false,
                            },
                            _ => false,
                        };

                        if input_type.is_none() || !is_hidden {
                            self.process_token_in_table_insertion_mode_anything_else(
                                token_and_info,
                            )?;
                        } else {
                            self.errors.push(Error::new(
                                token_and_info.span,
                                ErrorKind::StartTagInTable(tag_name.clone()),
                            ));

                            self.insert_html_element(token_and_info)?;
                            self.open_elements_stack.pop();

                            if is_self_closing {
                                token_and_info.acknowledged = true;
                            }
                        }
                    }
                    // A start tag whose tag name is "form"
                    //
                    // Parse error.
                    //
                    // If there is a template element on the stack of open elements, or if the form
                    // element pointer is not null, ignore the token.
                    //
                    // Otherwise:
                    //
                    // Insert an HTML element for the token, and set the form element pointer to
                    // point to the element created.
                    //
                    // Pop that form element off the stack of open elements.
                    Token::StartTag { tag_name, .. } if tag_name == "form" => {
                        self.errors.push(Error::new(
                            token_and_info.span,
                            ErrorKind::StartTagInTable(tag_name.clone()),
                        ));

                        if self.open_elements_stack.contains_template_element()
                            || self.form_element_pointer.is_some()
                        {
                            // Ignore
                            return Ok(());
                        }

                        let element = self.insert_html_element(token_and_info)?;

                        self.form_element_pointer = Some(element);
                        self.open_elements_stack.pop();
                    }
                    // An end-of-file token
                    //
                    // Process the token using the rules for the "in body" insertion mode.
                    Token::Eof => {
                        self.process_token_using_rules(token_and_info, InsertionMode::InBody)?;
                    }
                    // Anything else
                    //
                    // Parse error. Enable foster parenting, process the token using the rules for
                    // the "in body" insertion mode, and then disable foster parenting.
                    _ => {
                        self.process_token_in_table_insertion_mode_anything_else(token_and_info)?;
                    }
                }
            }
            // The "in table text" insertion mode
            InsertionMode::InTableText => {
                // When the user agent is to apply the rules for the "in table text" insertion
                // mode, the user agent must handle the token as follows:
                match token {
                    // A character token that is U+0000 NULL
                    //
                    // Parse error. Ignore the token.
                    Token::Character { value, .. } if *value == '\x00' => {
                        self.errors.push(Error::new(
                            token_and_info.span,
                            ErrorKind::UnexpectedNullCharacter,
                        ));
                    }
                    // Any other character token
                    //
                    // Append the character token to the pending table character tokens list.
                    Token::Character { .. } => {
                        self.pending_character_tokens.push(token_and_info.clone());
                    }
                    // Anything else
                    //
                    // If any of the tokens in the pending table character tokens list are character
                    // tokens that are not ASCII whitespace, then this is a parse error: reprocess
                    // the character tokens in the pending table character tokens list using the
                    // rules given in the "anything else" entry in the "in table" insertion mode.
                    //
                    // Otherwise, insert the characters given by the pending table character tokens
                    // list.
                    //
                    // Switch the insertion mode to the original insertion mode and reprocess the
                    // token.
                    _ => {
                        let mut has_non_ascii_whitespace = false;

                        for character_token in &self.pending_character_tokens {
                            match character_token.token {
                                Token::Character { value, .. }
                                    if !matches!(
                                        value,
                                        '\x09' | '\x0A' | '\x0C' | '\x0D' | '\x20'
                                    ) =>
                                {
                                    has_non_ascii_whitespace = true;

                                    break;
                                }
                                _ => {}
                            }
                        }

                        if has_non_ascii_whitespace {
                            for mut character_token in mem::take(&mut self.pending_character_tokens)
                            {
                                self.process_token_in_table_insertion_mode_anything_else(
                                    &mut character_token,
                                )?;
                            }
                        } else {
                            for mut character_token in mem::take(&mut self.pending_character_tokens)
                            {
                                self.insert_character(&mut character_token)?;
                            }
                        }

                        self.insertion_mode = self.original_insertion_mode.clone();
                        self.process_token(token_and_info, None)?;
                    }
                }
            }
            // The "in caption" insertion mode
            InsertionMode::InCaption => {
                match token {
                    // An end tag whose tag name is "caption"
                    //
                    // If the stack of open elements does not have a caption element in table scope,
                    // this is a parse error; ignore the token. (fragment case)
                    //
                    // Otherwise:
                    //
                    // Generate implied end tags.
                    //
                    // Now, if the current node is not a caption element, then this is a parse
                    // error.
                    //
                    // Pop elements from this stack until a caption element has been popped from the
                    // stack.
                    //
                    // Clear the list of active formatting elements up to the last marker.
                    //
                    // Switch the insertion mode to "in table".
                    Token::EndTag { tag_name, .. } if tag_name == "caption" => {
                        if !self.open_elements_stack.has_in_table_scope("caption") {
                            self.errors.push(Error::new(
                                token_and_info.span,
                                ErrorKind::StrayEndTag(tag_name.clone()),
                            ));
                        } else {
                            self.open_elements_stack.generate_implied_end_tags();

                            match self.open_elements_stack.items.last() {
                                Some(node) if !is_html_element!(node, "caption") => {
                                    self.errors.push(Error::new(
                                        token_and_info.span,
                                        ErrorKind::UnclosedElements(tag_name.clone()),
                                    ));
                                }
                                _ => {}
                            }

                            let popped = self
                                .open_elements_stack
                                .pop_until_tag_name_popped(&["caption"]);

                            self.update_end_tag_span(popped.as_ref(), token_and_info.span);
                            self.active_formatting_elements.clear_to_last_marker();
                            self.insertion_mode = InsertionMode::InTable;
                        }
                    }
                    // A start tag whose tag name is one of: "caption", "col", "colgroup", "tbody",
                    // "td", "tfoot", "th", "thead", "tr"
                    //
                    // An end tag whose tag name is "table"
                    //
                    // If the stack of open elements does not have a caption element in table scope,
                    // this is a parse error; ignore the token. (fragment case)
                    //
                    // Otherwise:
                    //
                    // Generate implied end tags.
                    //
                    // Now, if the current node is not a caption element, then this is a parse
                    // error.
                    //
                    // Pop elements from this stack until a caption element has been popped from the
                    // stack.
                    //
                    // Clear the list of active formatting elements up to the last marker.
                    //
                    // Switch the insertion mode to "in table".
                    //
                    // Reprocess the token.
                    Token::StartTag { tag_name, .. }
                        if matches!(
                            &**tag_name,
                            "caption"
                                | "col"
                                | "colgroup"
                                | "tbody"
                                | "td"
                                | "tfoot"
                                | "th"
                                | "thead"
                                | "tr"
                        ) =>
                    {
                        if !self.open_elements_stack.has_in_table_scope("caption") {
                            self.errors.push(Error::new(
                                token_and_info.span,
                                ErrorKind::StrayStartTag(tag_name.clone()),
                            ));
                        } else {
                            self.open_elements_stack.generate_implied_end_tags();

                            match self.open_elements_stack.items.last() {
                                Some(node) if !is_html_element!(node, "caption") => {
                                    self.errors.push(Error::new(
                                        token_and_info.span,
                                        ErrorKind::UnclosedElementsOnStack,
                                    ));
                                }
                                _ => {}
                            }

                            self.open_elements_stack
                                .pop_until_tag_name_popped(&["caption"]);
                            self.active_formatting_elements.clear_to_last_marker();
                            self.insertion_mode = InsertionMode::InTable;
                            self.process_token(token_and_info, None)?;
                        }
                    }
                    Token::EndTag { tag_name, .. } if tag_name == "table" => {
                        if !self.open_elements_stack.has_in_table_scope("caption") {
                            self.errors.push(Error::new(
                                token_and_info.span,
                                ErrorKind::StrayEndTag(tag_name.clone()),
                            ));
                        } else {
                            self.open_elements_stack.generate_implied_end_tags();

                            match self.open_elements_stack.items.last() {
                                Some(node) if !is_html_element!(node, "caption") => {
                                    self.errors.push(Error::new(
                                        token_and_info.span,
                                        ErrorKind::UnclosedElementsOnStack,
                                    ));
                                }
                                _ => {}
                            }

                            self.open_elements_stack
                                .pop_until_tag_name_popped(&["caption"]);
                            self.active_formatting_elements.clear_to_last_marker();
                            self.insertion_mode = InsertionMode::InTable;
                            self.process_token(token_and_info, None)?;
                        }
                    }
                    // An end tag whose tag name is one of: "body", "col", "colgroup", "html",
                    // "tbody", "td", "tfoot", "th", "thead", "tr"
                    //
                    // Parse error. Ignore the token.
                    Token::EndTag { tag_name, .. }
                        if matches!(
                            &**tag_name,
                            "body"
                                | "col"
                                | "colgroup"
                                | "html"
                                | "tbody"
                                | "td"
                                | "tfoot"
                                | "th"
                                | "thead"
                                | "tr"
                        ) =>
                    {
                        self.errors.push(Error::new(
                            token_and_info.span,
                            ErrorKind::StrayEndTag(tag_name.clone()),
                        ));
                    }
                    // Anything else
                    //
                    // Process the token using the rules for the "in body" insertion mode.
                    _ => {
                        self.process_token_using_rules(token_and_info, InsertionMode::InBody)?;
                    }
                }
            }
            // The "in column group" insertion mode
            InsertionMode::InColumnGroup => {
                // When the user agent is to apply the rules for the "in column group" insertion
                // mode, the user agent must handle the token as follows:
                match token {
                    // A character token that is one of U+0009 CHARACTER TABULATION, U+000A LINE
                    // FEED (LF), U+000C FORM FEED (FF), U+000D CARRIAGE RETURN (CR), or U+0020
                    // SPACE
                    //
                    // Insert the character.
                    Token::Character {
                        value: '\x09' | '\x0A' | '\x0C' | '\x0D' | '\x20',
                        ..
                    } => {
                        self.insert_character(token_and_info)?;
                    }
                    // A comment token
                    //
                    // Insert a comment.
                    Token::Comment { .. } => {
                        self.insert_comment(token_and_info)?;
                    }
                    // A DOCTYPE token
                    //
                    // Parse error. Ignore the token.
                    Token::Doctype { .. } => {
                        self.errors
                            .push(Error::new(token_and_info.span, ErrorKind::StrayDoctype));
                    }
                    // A start tag whose tag name is "html"
                    //
                    // Process the token using the rules for the "in body" insertion mode.
                    Token::StartTag { tag_name, .. } if tag_name == "html" => {
                        self.process_token_using_rules(token_and_info, InsertionMode::InBody)?;
                    }
                    // A start tag whose tag name is "col"
                    //
                    // Insert an HTML element for the token. Immediately pop the current node off
                    // the stack of open elements.
                    //
                    // Acknowledge the token's self-closing flag, if it is set.
                    Token::StartTag {
                        tag_name,
                        is_self_closing,
                        ..
                    } if tag_name == "col" => {
                        let is_self_closing = *is_self_closing;

                        self.insert_html_element(token_and_info)?;
                        self.open_elements_stack.pop();

                        if is_self_closing {
                            token_and_info.acknowledged = true;
                        }
                    }
                    // An end tag whose tag name is "colgroup"
                    //
                    // If the current node is not a colgroup element, then this is a parse error;
                    // ignore the token.
                    //
                    // Otherwise, pop the current node from the stack of open elements. Switch the
                    // insertion mode to "in table".
                    Token::EndTag { tag_name, .. } if tag_name == "colgroup" => {
                        match self.open_elements_stack.items.last() {
                            Some(node) if !is_html_element!(node, "colgroup") => {
                                self.errors.push(Error::new(
                                    token_and_info.span,
                                    ErrorKind::UnclosedElements(tag_name.clone()),
                                ));
                            }
                            _ => {
                                let popped = self.open_elements_stack.pop();

                                self.update_end_tag_span(popped.as_ref(), token_and_info.span);
                                self.insertion_mode = InsertionMode::InTable;
                            }
                        }
                    }
                    // An end tag whose tag name is "col"
                    //
                    // Parse error. Ignore the token.
                    Token::EndTag { tag_name, .. } if tag_name == "col" => {
                        self.errors.push(Error::new(
                            token_and_info.span,
                            ErrorKind::StrayEndTag(tag_name.clone()),
                        ));
                    }
                    // A start tag whose tag name is "template"
                    //
                    // An end tag whose tag name is "template"
                    //
                    // Process the token using the rules for the "in head" insertion mode.
                    Token::StartTag { tag_name, .. } if tag_name == "template" => {
                        self.process_token_using_rules(token_and_info, InsertionMode::InHead)?;
                    }
                    Token::EndTag { tag_name, .. } if tag_name == "template" => {
                        self.process_token_using_rules(token_and_info, InsertionMode::InHead)?;
                    }
                    // An end-of-file token
                    // Process the token using the rules for the "in body" insertion mode.
                    Token::Eof => {
                        self.process_token_using_rules(token_and_info, InsertionMode::InBody)?;
                    }
                    // Anything else
                    //
                    // If the current node is not a colgroup element, then this is a parse error;
                    // ignore the token.
                    //
                    // Otherwise, pop the current node from the stack of open elements.
                    //
                    // Switch the insertion mode to "in table".
                    //
                    // Reprocess the token.
                    _ => match self.open_elements_stack.items.last() {
                        Some(node) if !is_html_element!(node, "colgroup") => match token {
                            Token::Character { .. } => {
                                self.errors.push(Error::new(
                                    token_and_info.span,
                                    ErrorKind::NonSpaceCharacterInColumnGroup,
                                ));
                            }
                            _ => {
                                self.errors.push(Error::new(
                                    token_and_info.span,
                                    ErrorKind::GarbageInColumnGroup,
                                ));
                            }
                        },
                        _ => {
                            self.open_elements_stack.pop();
                            self.insertion_mode = InsertionMode::InTable;
                            self.process_token(token_and_info, None)?;
                        }
                    },
                }
            }
            // The "in table body" insertion mode
            InsertionMode::InTableBody => {
                // When the user agent is to apply the rules for the "in table body" insertion
                // mode, the user agent must handle the token as follows:
                match token {
                    // A start tag whose tag name is "tr"
                    //
                    // Clear the stack back to a table body context. (See below.)
                    //
                    // Insert an HTML element for the token, then switch the insertion mode to "in
                    // row".
                    Token::StartTag {
                        tag_name,
                        is_self_closing,
                        ..
                    } if tag_name == "tr" => {
                        self.open_elements_stack.clear_back_to_table_body_context();
                        self.insert_html_element(token_and_info)?;
                        self.insertion_mode = InsertionMode::InRow;
                        maybe_allow_self_closing!(is_self_closing, tag_name);
                    }
                    // A start tag whose tag name is one of: "th", "td"
                    //
                    // Parse error.
                    //
                    // Clear the stack back to a table body context. (See below.)
                    //
                    // Insert an HTML element for a "tr" start tag token with no attributes, then
                    // switch the insertion mode to "in row".
                    //
                    // Reprocess the current token.
                    Token::StartTag { tag_name, .. } if matches!(&**tag_name, "th" | "td") => {
                        self.errors.push(Error::new(
                            token_and_info.span,
                            ErrorKind::StartTagInTableBody(tag_name.clone()),
                        ));
                        self.open_elements_stack.clear_back_to_table_body_context();
                        self.insert_html_element(&self.create_fake_token_and_info("tr", None))?;
                        self.insertion_mode = InsertionMode::InRow;
                        self.process_token(token_and_info, None)?;
                    }
                    // An end tag whose tag name is one of: "tbody", "tfoot", "thead"
                    //
                    // If the stack of open elements does not have an element in table scope that is
                    // an HTML element with the same tag name as the token, this is a parse error;
                    // ignore the token.
                    //
                    // Otherwise:
                    //
                    // Clear the stack back to a table body context. (See below.)
                    //
                    // Pop the current node from the stack of open elements. Switch the insertion
                    // mode to "in table".
                    Token::EndTag { tag_name, .. }
                        if matches!(&**tag_name, "tbody" | "tfoot" | "thead") =>
                    {
                        if !self.open_elements_stack.has_in_table_scope(tag_name) {
                            self.errors.push(Error::new(
                                token_and_info.span,
                                ErrorKind::StrayEndTag(tag_name.clone()),
                            ));
                        } else {
                            self.open_elements_stack.clear_back_to_table_body_context();
                            self.update_end_tag_span(
                                self.open_elements_stack.items.last(),
                                token_and_info.span,
                            );
                            self.open_elements_stack.pop();
                            self.insertion_mode = InsertionMode::InTable;
                        }
                    }
                    // A start tag whose tag name is one of: "caption", "col", "colgroup", "tbody",
                    // "tfoot", "thead"
                    //
                    // An end tag whose tag name is "table"
                    //
                    // If the stack of open elements does not have a tbody, thead, or tfoot element
                    // in table scope, this is a parse error; ignore the token.
                    //
                    // Otherwise:
                    //
                    // Clear the stack back to a table body context. (See below.)
                    //
                    // Pop the current node from the stack of open elements. Switch the insertion
                    // mode to "in table".
                    //
                    // Reprocess the token.
                    Token::StartTag { tag_name, .. }
                        if matches!(
                            &**tag_name,
                            "caption" | "col" | "colgroup" | "tbody" | "tfoot" | "thead"
                        ) =>
                    {
                        if !(self.open_elements_stack.has_in_table_scope("tbody")
                            || self.open_elements_stack.has_in_table_scope("thead")
                            || self.open_elements_stack.has_in_table_scope("tfoot"))
                        {
                            self.errors.push(Error::new(
                                token_and_info.span,
                                ErrorKind::StrayStartTag(tag_name.clone()),
                            ));
                        } else {
                            self.open_elements_stack.clear_back_to_table_body_context();
                            self.open_elements_stack.pop();
                            self.insertion_mode = InsertionMode::InTable;
                            self.process_token(token_and_info, None)?;
                        }
                    }
                    Token::EndTag { tag_name, .. } if tag_name == "table" => {
                        if !(self.open_elements_stack.has_in_table_scope("tbody")
                            || self.open_elements_stack.has_in_table_scope("thead")
                            || self.open_elements_stack.has_in_table_scope("tfoot"))
                        {
                            self.errors.push(Error::new(
                                token_and_info.span,
                                ErrorKind::StrayEndTag(tag_name.clone()),
                            ));
                        } else {
                            self.open_elements_stack.clear_back_to_table_body_context();
                            self.open_elements_stack.pop();
                            self.insertion_mode = InsertionMode::InTable;
                            self.process_token(token_and_info, None)?;
                        }
                    }
                    // An end tag whose tag name is one of: "body", "caption", "col", "colgroup",
                    // "html", "td", "th", "tr"
                    //
                    // Parse error. Ignore the token.
                    Token::EndTag { tag_name, .. }
                        if matches!(
                            &**tag_name,
                            "body" | "caption" | "col" | "colgroup" | "html" | "td" | "th" | "tr"
                        ) =>
                    {
                        self.errors.push(Error::new(
                            token_and_info.span,
                            ErrorKind::StrayEndTag(tag_name.clone()),
                        ));
                    }
                    // Anything else
                    //
                    // Process the token using the rules for the "in table" insertion mode.
                    _ => {
                        self.process_token_using_rules(token_and_info, InsertionMode::InTable)?;
                    }
                }
            }
            // The "in row" insertion mode
            InsertionMode::InRow => {
                // When the user agent is to apply the rules for the "in row" insertion mode,
                // the user agent must handle the token as follows:
                match token {
                    // A start tag whose tag name is one of: "th", "td"
                    //
                    // Clear the stack back to a table row context. (See below.)
                    //
                    // Insert an HTML element for the token, then switch the insertion mode to "in
                    // cell".
                    //
                    // Insert a marker at the end of the list of active formatting elements.
                    Token::StartTag {
                        tag_name,
                        is_self_closing,
                        ..
                    } if matches!(&**tag_name, "th" | "td") => {
                        self.open_elements_stack.clear_back_to_table_row_context();
                        self.insert_html_element(token_and_info)?;
                        self.insertion_mode = InsertionMode::InCell;
                        self.active_formatting_elements.insert_marker();
                        maybe_allow_self_closing!(is_self_closing, tag_name);
                    }
                    // An end tag whose tag name is "tr"
                    //
                    // If the stack of open elements does not have a tr element in table scope, this
                    // is a parse error; ignore the token.
                    //
                    // Otherwise:
                    //
                    // Clear the stack back to a table row context. (See below.)
                    //
                    // Pop the current node (which will be a tr element) from the stack of open
                    // elements. Switch the insertion mode to "in table body".
                    Token::EndTag { tag_name, .. } if tag_name == "tr" => {
                        if !self.open_elements_stack.has_in_table_scope("tr") {
                            self.errors.push(Error::new(
                                token_and_info.span,
                                ErrorKind::NoTableRowToClose,
                            ));
                        } else {
                            self.open_elements_stack.clear_back_to_table_row_context();
                            self.update_end_tag_span(
                                self.open_elements_stack.items.last(),
                                token_and_info.span,
                            );
                            self.open_elements_stack.pop();
                            self.insertion_mode = InsertionMode::InTableBody;
                        }
                    }
                    // A start tag whose tag name is one of: "caption", "col", "colgroup", "tbody",
                    // "tfoot", "thead", "tr"
                    //
                    // An end tag whose tag name is "table"
                    //
                    // If the stack of open elements does not have a tr element in table scope, this
                    // is a parse error; ignore the token.
                    //
                    // Otherwise:
                    //
                    // Clear the stack back to a table row context. (See below.)
                    //
                    // Pop the current node (which will be a tr element) from the stack of open
                    // elements. Switch the insertion mode to "in table body".
                    //
                    // Reprocess the token.
                    Token::StartTag { tag_name, .. }
                        if matches!(
                            &**tag_name,
                            "caption" | "col" | "colgroup" | "tbody" | "tfoot" | "thead" | "tr"
                        ) =>
                    {
                        if !self.open_elements_stack.has_in_table_scope("tr") {
                            self.errors.push(Error::new(
                                token_and_info.span,
                                ErrorKind::NoTableRowToClose,
                            ));
                        } else {
                            self.open_elements_stack.clear_back_to_table_row_context();
                            self.open_elements_stack.pop();
                            self.insertion_mode = InsertionMode::InTableBody;
                            self.process_token(token_and_info, None)?;
                        }
                    }
                    Token::EndTag { tag_name, .. } if tag_name == "table" => {
                        if !self.open_elements_stack.has_in_table_scope("tr") {
                            self.errors.push(Error::new(
                                token_and_info.span,
                                ErrorKind::NoTableRowToClose,
                            ));
                        } else {
                            self.open_elements_stack.clear_back_to_table_row_context();
                            self.open_elements_stack.pop();
                            self.insertion_mode = InsertionMode::InTableBody;
                            self.process_token(token_and_info, None)?;
                        }
                    }
                    // An end tag whose tag name is one of: "tbody", "tfoot", "thead"
                    //
                    // If the stack of open elements does not have an element in table scope that is
                    // an HTML element with the same tag name as the token, this is a parse error;
                    // ignore the token.
                    //
                    // If the stack of open elements does not have a tr element in table scope,
                    // ignore the token.
                    //
                    // Otherwise:
                    //
                    // Clear the stack back to a table row context. (See below.)
                    //
                    // Pop the current node (which will be a tr element) from the stack of open
                    // elements. Switch the insertion mode to "in table body".
                    //
                    // Reprocess the token.
                    Token::EndTag { tag_name, .. }
                        if matches!(&**tag_name, "tbody" | "tfoot" | "thead") =>
                    {
                        if !self.open_elements_stack.has_in_table_scope(tag_name) {
                            self.errors.push(Error::new(
                                token_and_info.span,
                                ErrorKind::StrayEndTag(tag_name.clone()),
                            ));
                        } else if !self.open_elements_stack.has_in_table_scope("tr") {
                            // Ignore

                            return Ok(());
                        } else {
                            self.open_elements_stack.clear_back_to_table_row_context();
                            self.open_elements_stack.pop();
                            self.insertion_mode = InsertionMode::InTableBody;
                            self.process_token(token_and_info, None)?;
                        }
                    }
                    // An end tag whose tag name is one of: "body", "caption", "col", "colgroup",
                    // "html", "td", "th"
                    //
                    // Parse error. Ignore the token.
                    Token::EndTag { tag_name, .. }
                        if matches!(
                            &**tag_name,
                            "body" | "caption" | "col" | "colgroup" | "html" | "td" | "th"
                        ) =>
                    {
                        self.errors.push(Error::new(
                            token_and_info.span,
                            ErrorKind::StrayEndTag(tag_name.clone()),
                        ));
                    }
                    // Anything else
                    //
                    // Process the token using the rules for the "in table" insertion mode.
                    _ => {
                        self.process_token_using_rules(token_and_info, InsertionMode::InTable)?;
                    }
                }
            }
            // The "in cell" insertion mode
            InsertionMode::InCell => {
                // When the user agent is to apply the rules for the "in cell" insertion mode,
                // the user agent must handle the token as follows:
                match token {
                    // An end tag whose tag name is one of: "td", "th"
                    //
                    // If the stack of open elements does not have an element in table scope that is
                    // an HTML element with the same tag name as that of the token, then this is a
                    // parse error; ignore the token.
                    //
                    // Otherwise:
                    //
                    // Generate implied end tags.
                    //
                    // Now, if the current node is not an HTML element with the same tag name as the
                    // token, then this is a parse error.
                    //
                    // Pop elements from the stack of open elements stack until an HTML element with
                    // the same tag name as the token has been popped from the stack.
                    //
                    // Clear the list of active formatting elements up to the last marker.
                    //
                    // Switch the insertion mode to "in row".
                    Token::EndTag { tag_name, .. } if matches!(&**tag_name, "td" | "th") => {
                        if !self.open_elements_stack.has_in_table_scope(tag_name) {
                            self.errors.push(Error::new(
                                token_and_info.span,
                                ErrorKind::StrayEndTag(tag_name.clone()),
                            ));
                        } else {
                            self.open_elements_stack.generate_implied_end_tags();

                            match self.open_elements_stack.items.last() {
                                Some(node) if !is_html_element_with_tag_name!(node, tag_name) => {
                                    self.errors.push(Error::new(
                                        token_and_info.span,
                                        ErrorKind::UnclosedElements(tag_name.clone()),
                                    ));
                                }
                                _ => {}
                            }

                            let popped = self
                                .open_elements_stack
                                .pop_until_tag_name_popped(&[tag_name]);

                            self.update_end_tag_span(popped.as_ref(), token_and_info.span);
                            self.active_formatting_elements.clear_to_last_marker();
                            self.insertion_mode = InsertionMode::InRow;
                        }
                    }
                    // A start tag whose tag name is one of: "caption", "col", "colgroup", "tbody",
                    // "td", "tfoot", "th", "thead", "tr"
                    //
                    // If the stack of open elements does not have a td or th element in table
                    // scope, then this is a parse error; ignore the token. (fragment case)
                    //
                    // Otherwise, close the cell (see below) and reprocess the token.
                    Token::StartTag { tag_name, .. }
                        if matches!(
                            &**tag_name,
                            "caption"
                                | "col"
                                | "colgroup"
                                | "tbody"
                                | "td"
                                | "tfoot"
                                | "th"
                                | "thead"
                                | "tr"
                        ) =>
                    {
                        if !self.open_elements_stack.has_in_table_scope("td")
                            && !self.open_elements_stack.has_in_table_scope("th")
                        {
                            self.errors
                                .push(Error::new(token_and_info.span, ErrorKind::NoCellToClose));
                        } else {
                            self.close_the_cell();
                            self.process_token(token_and_info, None)?;
                        }
                    }
                    // An end tag whose tag name is one of: "body", "caption", "col", "colgroup",
                    // "html"
                    //
                    // Parse error. Ignore the token.
                    Token::EndTag { tag_name, .. }
                        if matches!(
                            &**tag_name,
                            "body" | "caption" | "col" | "colgroup" | "html"
                        ) =>
                    {
                        self.errors.push(Error::new(
                            token_and_info.span,
                            ErrorKind::StrayEndTag(tag_name.clone()),
                        ));
                    }
                    // An end tag whose tag name is one of: "table", "tbody", "tfoot", "thead", "tr"
                    //
                    // If the stack of open elements does not have an element in table scope that is
                    // an HTML element with the same tag name as that of the token, then this is a
                    // parse error; ignore the token.
                    //
                    // Otherwise, close the cell (see below) and reprocess the token.
                    Token::EndTag { tag_name, .. }
                        if matches!(&**tag_name, "table" | "tbody" | "tfoot" | "thead" | "tr") =>
                    {
                        if !self.open_elements_stack.has_in_table_scope(tag_name) {
                            self.errors.push(Error::new(
                                token_and_info.span,
                                ErrorKind::StrayEndTag(tag_name.clone()),
                            ))
                        } else {
                            self.close_the_cell();
                            self.process_token(token_and_info, None)?;
                        }
                    }
                    // Anything else
                    //
                    // Process the token using the rules for the "in body" insertion mode.
                    _ => {
                        self.process_token_using_rules(token_and_info, InsertionMode::InBody)?;
                    }
                }

                // Where the steps above say to close the cell, they mean to run
                // the following algorithm:
                //
                // Generate implied end tags.
                //
                // If the current node is not now a td element or a th element,
                // then this is a parse error.
                //
                // Pop elements from the stack of open elements stack until a td
                // element or a th element has been popped from the stack.
                //
                // Clear the list of active formatting elements up to the last
                // marker.
                //
                // Switch the insertion mode to "in row".
            }
            // The "in select" insertion mode
            InsertionMode::InSelect => {
                match token {
                    // A character token that is U+0000 NULL
                    //
                    // Parse error. Ignore the token.
                    Token::Character { value, .. } if *value == '\x00' => self.errors.push(
                        Error::new(token_and_info.span, ErrorKind::UnexpectedNullCharacter),
                    ),
                    // Any other character token
                    //
                    // Insert the token's character.
                    Token::Character { .. } => {
                        self.insert_character(token_and_info)?;
                    }
                    // A comment token
                    //
                    // Insert a comment.
                    Token::Comment { .. } => {
                        self.insert_comment(token_and_info)?;
                    }
                    // A DOCTYPE token
                    //
                    // Parse error. Ignore the token.
                    Token::Doctype { .. } => {
                        self.errors
                            .push(Error::new(token_and_info.span, ErrorKind::StrayDoctype));
                    }
                    // A start tag whose tag name is "html"
                    //
                    // Process the token using the rules for the "in body" insertion mode.
                    Token::StartTag { tag_name, .. } if tag_name == "html" => {
                        self.process_token_using_rules(token_and_info, InsertionMode::InBody)?;
                    }
                    // A start tag whose tag name is "option"
                    //
                    // If the current node is an option element, pop that node from the stack of
                    // open elements.
                    //
                    // Insert an HTML element for the token.
                    Token::StartTag {
                        tag_name,
                        is_self_closing,
                        ..
                    } if tag_name == "option" => {
                        match self.open_elements_stack.items.last() {
                            Some(node) if is_html_element!(node, "option") => {
                                self.open_elements_stack.pop();
                            }
                            _ => {}
                        }

                        self.insert_html_element(token_and_info)?;
                        maybe_allow_self_closing!(is_self_closing, tag_name);
                    }
                    // A start tag whose tag name is "optgroup"
                    //
                    // If the current node is an option element, pop that node from the stack of
                    // open elements.
                    //
                    // If the current node is an optgroup element, pop that node from the stack of
                    // open elements.
                    //
                    // Insert an HTML element for the token.
                    Token::StartTag {
                        tag_name,
                        is_self_closing,
                        ..
                    } if tag_name == "optgroup" => {
                        match self.open_elements_stack.items.last() {
                            Some(node) if is_html_element!(node, "option") => {
                                self.open_elements_stack.pop();
                            }
                            _ => {}
                        }

                        match self.open_elements_stack.items.last() {
                            Some(node) if is_html_element!(node, "optgroup") => {
                                self.open_elements_stack.pop();
                            }
                            _ => {}
                        }

                        self.insert_html_element(token_and_info)?;
                        maybe_allow_self_closing!(is_self_closing, tag_name);
                    }
                    // An end tag whose tag name is "optgroup"
                    //
                    // First, if the current node is an option element, and the node immediately
                    // before it in the stack of open elements is an optgroup element, then pop the
                    // current node from the stack of open elements.
                    //
                    // If the current node is an optgroup element, then pop that node from the stack
                    // of open elements. Otherwise, this is a parse error; ignore the token.
                    Token::EndTag { tag_name, .. } if tag_name == "optgroup" => {
                        match self.open_elements_stack.items.last() {
                            Some(node) if is_html_element!(node, "option") => {
                                match self
                                    .open_elements_stack
                                    .items
                                    // `-1` is `current node`, because `The current node is the
                                    // bottommost node in this stack of open elements.`
                                    // `-2` is node immediately before it in the stack of open
                                    // elements
                                    .get(self.open_elements_stack.items.len() - 2)
                                {
                                    Some(node) if is_html_element!(node, "optgroup") => {
                                        let popped = self.open_elements_stack.pop();

                                        self.update_end_tag_span(
                                            popped.as_ref(),
                                            token_and_info.span,
                                        );
                                    }
                                    _ => {}
                                }
                            }
                            _ => {}
                        }

                        match self.open_elements_stack.items.last() {
                            Some(node) if is_html_element!(node, "optgroup") => {
                                let popped = self.open_elements_stack.pop();

                                self.update_end_tag_span(popped.as_ref(), token_and_info.span);
                            }
                            _ => self.errors.push(Error::new(
                                token_and_info.span,
                                ErrorKind::StrayEndTag(tag_name.clone()),
                            )),
                        }
                    }
                    // An end tag whose tag name is "option"
                    //
                    // If the current node is an option element, then pop that node from the stack
                    // of open elements. Otherwise, this is a parse error; ignore the token.
                    Token::EndTag { tag_name, .. } if tag_name == "option" => {
                        match self.open_elements_stack.items.last() {
                            Some(node) if is_html_element!(node, "option") => {
                                let popped = self.open_elements_stack.pop();

                                self.update_end_tag_span(popped.as_ref(), token_and_info.span);
                            }
                            _ => self.errors.push(Error::new(
                                token_and_info.span,
                                ErrorKind::StrayEndTag(tag_name.clone()),
                            )),
                        }
                    }
                    // An end tag whose tag name is "select"
                    //
                    // If the stack of open elements does not have a select element in select scope,
                    // this is a parse error; ignore the token. (fragment case)
                    //
                    // Otherwise:
                    //
                    // Pop elements from the stack of open elements until a select element has been
                    // popped from the stack.
                    //
                    // Reset the insertion mode appropriately.
                    Token::EndTag { tag_name, .. } if tag_name == "select" => {
                        if !self.open_elements_stack.has_in_select_scope("select") {
                            self.errors.push(Error::new(
                                token_and_info.span,
                                ErrorKind::StrayEndTag(tag_name.clone()),
                            ));
                        } else {
                            let popped = self
                                .open_elements_stack
                                .pop_until_tag_name_popped(&["select"]);

                            self.update_end_tag_span(popped.as_ref(), token_and_info.span);
                            self.reset_insertion_mode();
                        }
                    }
                    // A start tag whose tag name is "select"
                    //
                    // Parse error.
                    //
                    // If the stack of open elements does not have a select element in select scope,
                    // ignore the token. (fragment case)
                    //
                    // Otherwise:
                    //
                    // Pop elements from the stack of open elements until a select element has been
                    // popped from the stack.
                    //
                    // Reset the insertion mode appropriately.
                    Token::StartTag { tag_name, .. } if tag_name == "select" => {
                        self.errors.push(Error::new(
                            token_and_info.span,
                            ErrorKind::StartSelectWhereEndSelectExpected,
                        ));

                        if !self.open_elements_stack.has_in_select_scope("select") {
                            // Ignore

                            return Ok(());
                        }

                        self.open_elements_stack
                            .pop_until_tag_name_popped(&["select"]);
                        self.reset_insertion_mode();
                    }
                    // A start tag whose tag name is one of: "input", "keygen", "textarea"
                    //
                    // Parse error.
                    //
                    // If the stack of open elements does not have a select element in select scope,
                    // ignore the token. (fragment case)
                    //
                    // Otherwise:
                    //
                    // Pop elements from the stack of open elements until a select element has been
                    // popped from the stack.
                    //
                    // Reset the insertion mode appropriately.
                    //
                    // Reprocess the token.
                    Token::StartTag { tag_name, .. }
                        if matches!(&**tag_name, "input" | "keygen" | "textarea") =>
                    {
                        self.errors.push(Error::new(
                            token_and_info.span,
                            ErrorKind::StartTagWithSelectOpen(tag_name.clone()),
                        ));

                        if !self.open_elements_stack.has_in_select_scope("select") {
                            // Ignore
                            return Ok(());
                        }

                        self.open_elements_stack
                            .pop_until_tag_name_popped(&["select"]);
                        self.reset_insertion_mode();
                        self.process_token(token_and_info, None)?;
                    }
                    // A start tag whose tag name is one of: "script", "template"
                    //
                    // An end tag whose tag name is "template"
                    //
                    // Process the token using the rules for the "in head" insertion mode.
                    Token::StartTag { tag_name, .. }
                        if matches!(&**tag_name, "script" | "template") =>
                    {
                        self.process_token_using_rules(token_and_info, InsertionMode::InHead)?;
                    }
                    Token::EndTag { tag_name, .. } if tag_name == "template" => {
                        self.process_token_using_rules(token_and_info, InsertionMode::InHead)?;
                    }
                    // An end-of-file token
                    //
                    // Process the token using the rules for the "in body" insertion mode.
                    Token::Eof => {
                        self.process_token_using_rules(token_and_info, InsertionMode::InBody)?;
                    }
                    // Anything else
                    //
                    // Parse error. Ignore the token.
                    _ => match token {
                        Token::StartTag { tag_name, .. } => {
                            self.errors.push(Error::new(
                                token_and_info.span,
                                ErrorKind::StrayStartTag(tag_name.clone()),
                            ));
                        }
                        Token::EndTag { tag_name, .. } => {
                            self.errors.push(Error::new(
                                token_and_info.span,
                                ErrorKind::StrayEndTag(tag_name.clone()),
                            ));
                        }
                        _ => {
                            unreachable!()
                        }
                    },
                }
            }
            // The "in select in table" insertion mode
            InsertionMode::InSelectInTable => {
                // When the user agent is to apply the rules for the "in select in table"
                // insertion mode, the user agent must handle the token as follows:
                match token {
                    // A start tag whose tag name is one of: "caption", "table", "tbody", "tfoot",
                    // "thead", "tr", "td", "th"
                    //
                    // Parse error.
                    //
                    // Pop elements from the stack of open elements until a select element has been
                    // popped from the stack.
                    //
                    // Reset the insertion mode appropriately.
                    //
                    // Reprocess the token.
                    Token::StartTag { tag_name, .. }
                        if matches!(
                            &**tag_name,
                            "caption" | "table" | "tbody" | "tfoot" | "thead" | "tr" | "td" | "th"
                        ) =>
                    {
                        self.errors.push(Error::new(
                            token_and_info.span,
                            ErrorKind::StartTagWithSelectOpen(tag_name.clone()),
                        ));
                        self.open_elements_stack
                            .pop_until_tag_name_popped(&["select"]);
                        self.reset_insertion_mode();
                        self.process_token(token_and_info, None)?;
                    }
                    // An end tag whose tag name is one of: "caption", "table", "tbody", "tfoot",
                    // "thead", "tr", "td", "th"
                    //
                    // Parse error.
                    //
                    // If the stack of open elements does not have an element in table scope that is
                    // an HTML element with the same tag name as that of the token, then ignore the
                    // token.
                    //
                    // Otherwise:
                    //
                    // Pop elements from the stack of open elements until a select element has been
                    // popped from the stack.
                    //
                    // Reset the insertion mode appropriately.
                    //
                    // Reprocess the token.
                    Token::EndTag { tag_name, .. }
                        if matches!(
                            &**tag_name,
                            "caption" | "table" | "tbody" | "tfoot" | "thead" | "tr" | "td" | "th"
                        ) =>
                    {
                        self.errors.push(Error::new(
                            token_and_info.span,
                            ErrorKind::EndTagSeenWithSelectOpen(tag_name.clone()),
                        ));

                        if !self.open_elements_stack.has_in_table_scope(tag_name) {
                            // Ignore
                            return Ok(());
                        }

                        self.open_elements_stack
                            .pop_until_tag_name_popped(&["select"]);
                        self.reset_insertion_mode();
                        self.process_token(token_and_info, None)?;
                    }
                    // Anything else
                    //
                    // Process the token using the rules for the "in select" insertion mode.
                    _ => {
                        self.process_token_using_rules(token_and_info, InsertionMode::InSelect)?;
                    }
                }
            }
            // The "in template" insertion mode
            InsertionMode::InTemplate => {
                // When the user agent is to apply the rules for the "in template" insertion
                // mode, the user agent must handle the token as follows:
                match token {
                    // A character token
                    // A comment token
                    // A DOCTYPE token
                    //
                    // Process the token using the rules for the "in body" insertion mode.
                    Token::Character { .. } | Token::Comment { .. } | Token::Doctype { .. } => {
                        self.process_token_using_rules(token_and_info, InsertionMode::InBody)?;
                    }
                    // A start tag whose tag name is one of: "base", "basefont", "bgsound", "link",
                    // "meta", "noframes", "script", "style", "template", "title"
                    //
                    // An end tag whose tag name is "template"
                    //
                    // Process the token using the rules for the "in head" insertion mode.
                    Token::StartTag { tag_name, .. }
                        if matches!(
                            &**tag_name,
                            "base"
                                | "basefont"
                                | "bgsound"
                                | "link"
                                | "meta"
                                | "noframes"
                                | "script"
                                | "style"
                                | "template"
                                | "title"
                        ) =>
                    {
                        self.process_token_using_rules(token_and_info, InsertionMode::InHead)?;
                    }
                    Token::EndTag { tag_name, .. } if tag_name == "template" => {
                        self.process_token_using_rules(token_and_info, InsertionMode::InHead)?;
                    }
                    // A start tag whose tag name is one of: "caption", "colgroup", "tbody",
                    // "tfoot", "thead"
                    //
                    // Pop the current template insertion mode off the stack of template insertion
                    // modes.
                    //
                    // Push "in table" onto the stack of template insertion modes so that it is the
                    // new current template insertion mode.
                    //
                    // Switch the insertion mode to "in table", and reprocess the token.
                    Token::StartTag { tag_name, .. }
                        if matches!(
                            &**tag_name,
                            "caption" | "colgroup" | "tbody" | "tfoot" | "thead"
                        ) =>
                    {
                        self.template_insertion_mode_stack.pop();
                        self.template_insertion_mode_stack
                            .push(InsertionMode::InTable);
                        self.insertion_mode = InsertionMode::InTable;
                        self.process_token(token_and_info, None)?;
                    }
                    // A start tag whose tag name is "col"
                    //
                    // Pop the current template insertion mode off the stack of template insertion
                    // modes.
                    //
                    // Push "in column group" onto the stack of template insertion modes so that it
                    // is the new current template insertion mode.
                    //
                    // Switch the insertion mode to "in column group", and reprocess the token.
                    Token::StartTag { tag_name, .. } if tag_name == "col" => {
                        self.template_insertion_mode_stack.pop();
                        self.template_insertion_mode_stack
                            .push(InsertionMode::InColumnGroup);
                        self.insertion_mode = InsertionMode::InColumnGroup;
                        self.process_token(token_and_info, None)?;
                    }
                    // A start tag whose tag name is "tr"
                    //
                    // Pop the current template insertion mode off the stack of template insertion
                    // modes.
                    //
                    // Push "in table body" onto the stack of template insertion modes so that it is
                    // the new current template insertion mode.
                    //
                    // Switch the insertion mode to "in table body", and reprocess the token.
                    Token::StartTag { tag_name, .. } if tag_name == "tr" => {
                        self.template_insertion_mode_stack.pop();
                        self.template_insertion_mode_stack
                            .push(InsertionMode::InTableBody);
                        self.insertion_mode = InsertionMode::InTableBody;
                        self.process_token(token_and_info, None)?;
                    }
                    // A start tag whose tag name is one of: "td", "th"
                    //
                    // Pop the current template insertion mode off the stack of template insertion
                    // modes.
                    //
                    // Push "in row" onto the stack of template insertion modes so that it is the
                    // new current template insertion mode.
                    //
                    // Switch the insertion mode to "in row", and reprocess the token.
                    Token::StartTag { tag_name, .. } if matches!(&**tag_name, "td" | "th") => {
                        self.template_insertion_mode_stack.pop();
                        self.template_insertion_mode_stack
                            .push(InsertionMode::InRow);
                        self.insertion_mode = InsertionMode::InRow;
                        self.process_token(token_and_info, None)?;
                    }
                    // Any other start tag
                    //
                    // Pop the current template insertion mode off the stack of template insertion
                    // modes.
                    //
                    // Push "in body" onto the stack of template insertion modes so that it is the
                    // new current template insertion mode.
                    //
                    // Switch the insertion mode to "in body", and reprocess the token.
                    Token::StartTag { .. } => {
                        self.template_insertion_mode_stack.pop();
                        self.template_insertion_mode_stack
                            .push(InsertionMode::InBody);
                        self.insertion_mode = InsertionMode::InBody;
                        self.process_token(token_and_info, None)?;
                    }
                    // Any other end tag
                    //
                    // Parse error. Ignore the token.
                    Token::EndTag { tag_name, .. } => {
                        self.errors.push(Error::new(
                            token_and_info.span,
                            ErrorKind::StrayEndTag(tag_name.clone()),
                        ));
                    }
                    // An end-of-file token
                    //
                    // If there is no template element on the stack of open elements, then stop
                    // parsing. (fragment case)
                    //
                    // Otherwise, this is a parse error.
                    //
                    // Pop elements from the stack of open elements until a template element has
                    // been popped from the stack.
                    //
                    // Clear the list of active formatting elements up to the last marker.
                    //
                    // Pop the current template insertion mode off the stack of template insertion
                    // modes.
                    //
                    // Reset the insertion mode appropriately.
                    //
                    // Reprocess the token.
                    Token::Eof => {
                        if !self.open_elements_stack.contains_template_element() {
                            self.stopped = true;
                        } else {
                            self.update_end_tag_span(
                                self.open_elements_stack.items.last(),
                                token_and_info.span,
                            );
                            self.errors.push(Error::new(
                                token_and_info.span,
                                ErrorKind::EofWithUnclosedElements,
                            ));
                            self.open_elements_stack
                                .pop_until_tag_name_popped(&["template"]);
                            self.active_formatting_elements.clear_to_last_marker();
                            self.template_insertion_mode_stack.pop();
                            self.reset_insertion_mode();
                            self.process_token(token_and_info, None)?;
                        }
                    }
                }
            }
            // The "after body" insertion mode
            InsertionMode::AfterBody => {
                // When the user agent is to apply the rules for the "after body" insertion
                // mode, the user agent must handle the token as follows:
                match token {
                    // A character token that is one of U+0009 CHARACTER TABULATION, U+000A LINE
                    // FEED (LF), U+000C FORM FEED (FF), U+000D CARRIAGE RETURN (CR), or U+0020
                    // SPACE
                    //
                    // Process the token using the rules for the "in body" insertion mode.
                    Token::Character {
                        value: '\x09' | '\x0A' | '\x0C' | '\x0D' | '\x20',
                        ..
                    } => {
                        self.process_token_using_rules(token_and_info, InsertionMode::InBody)?;
                    }
                    // A comment token
                    //
                    // Insert a comment as the last child of the first element in the stack of open
                    // elements (the html element).
                    Token::Comment { .. } => {
                        self.insert_comment_as_last_child_of_first_element(token_and_info)?;
                    }
                    // A DOCTYPE token
                    //
                    // Parse error. Ignore the token.
                    Token::Doctype { .. } => {
                        self.errors
                            .push(Error::new(token_and_info.span, ErrorKind::StrayDoctype));
                    }
                    // A start tag whose tag name is "html"
                    //
                    // Process the token using the rules for the "in body" insertion mode.
                    Token::StartTag { tag_name, .. } if tag_name == "html" => {
                        self.process_token_using_rules(token_and_info, InsertionMode::InBody)?;
                    }
                    // An end tag whose tag name is "html"
                    //
                    // If the parser was created as part of the HTML fragment parsing algorithm,
                    // this is a parse error; ignore the token. (fragment case)
                    //
                    // Otherwise, switch the insertion mode to "after after body".
                    Token::EndTag { tag_name, .. } if tag_name == "html" => {
                        if self.is_fragment_case {
                            self.errors.push(Error::new(
                                token_and_info.span,
                                ErrorKind::StrayEndTag(tag_name.clone()),
                            ));
                        } else {
                            self.update_end_tag_span(
                                self.open_elements_stack.items.first(),
                                token_and_info.span,
                            );
                            self.insertion_mode = InsertionMode::AfterAfterBody;
                        }
                    }
                    // An end-of-file token
                    //
                    // Stop parsing.
                    Token::Eof => {
                        self.update_end_tag_span(
                            self.open_elements_stack.items.last(),
                            token_and_info.span,
                        );
                        self.stopped = true;
                    }
                    // Anything else
                    //
                    // Parse error. Switch the insertion mode to "in body" and reprocess the token.
                    _ => {
                        match token {
                            // Doctype handled above
                            // Comment handled above
                            // EOF handled above
                            Token::Character { .. } => {
                                self.errors.push(Error::new(
                                    token_and_info.span,
                                    ErrorKind::NonSpaceCharacterAfterBody,
                                ));
                            }
                            Token::StartTag { tag_name, .. } => {
                                self.errors.push(Error::new(
                                    token_and_info.span,
                                    ErrorKind::StrayStartTag(tag_name.clone()),
                                ));
                            }
                            Token::EndTag { .. } => {
                                self.errors.push(Error::new(
                                    token_and_info.span,
                                    ErrorKind::EndTagAfterBody,
                                ));
                            }
                            _ => {
                                unreachable!();
                            }
                        }

                        self.insertion_mode = InsertionMode::InBody;
                        self.process_token(token_and_info, None)?;
                    }
                }
            }
            // The "in frameset" insertion mode
            InsertionMode::InFrameset => {
                // When the user agent is to apply the rules for the "in frameset" insertion
                // mode, the user agent must handle the token as follows:
                match token {
                    // A character token that is one of U+0009 CHARACTER TABULATION, U+000A LINE
                    // FEED (LF), U+000C FORM FEED (FF), U+000D CARRIAGE RETURN (CR), or U+0020
                    // SPACE
                    //
                    // Insert the character.
                    Token::Character {
                        value: '\x09' | '\x0A' | '\x0C' | '\x0D' | '\x20',
                        ..
                    } => {
                        self.insert_character(token_and_info)?;
                    }
                    // A comment token
                    //
                    // Insert a comment.
                    Token::Comment { .. } => {
                        self.insert_comment(token_and_info)?;
                    }
                    // A DOCTYPE token
                    //
                    // Parse error. Ignore the token.
                    Token::Doctype { .. } => {
                        self.errors
                            .push(Error::new(token_and_info.span, ErrorKind::StrayDoctype));
                    }
                    // A start tag whose tag name is "html"
                    //
                    // Process the token using the rules for the "in body" insertion mode.
                    Token::StartTag { tag_name, .. } if tag_name == "html" => {
                        self.process_token_using_rules(token_and_info, InsertionMode::InBody)?;
                    }
                    // A start tag whose tag name is "frameset"
                    //
                    // Insert an HTML element for the token.
                    Token::StartTag {
                        tag_name,
                        is_self_closing,
                        ..
                    } if tag_name == "frameset" => {
                        self.insert_html_element(token_and_info)?;
                        maybe_allow_self_closing!(is_self_closing, tag_name);
                    }
                    // An end tag whose tag name is "frameset"
                    //
                    // If the current node is the root html element, then this is a parse error;
                    // ignore the token. (fragment case)
                    //
                    // Otherwise, pop the current node from the stack of open elements.
                    //
                    // If the parser was not created as part of the HTML fragment parsing algorithm
                    // (fragment case), and the current node is no longer a frameset element, then
                    // switch the insertion mode to "after frameset".
                    Token::EndTag { tag_name, .. } if tag_name == "frameset" => {
                        let is_root_html_document = match self.open_elements_stack.items.last() {
                            Some(node)
                                if is_html_element!(node, "html")
                                    && self.open_elements_stack.items.len() == 1 =>
                            {
                                true
                            }
                            _ => false,
                        };

                        if is_root_html_document {
                            self.errors.push(Error::new(
                                token_and_info.span,
                                ErrorKind::StrayEndTag(tag_name.clone()),
                            ));
                        } else {
                            let popped = self.open_elements_stack.pop();

                            self.update_end_tag_span(popped.as_ref(), token_and_info.span);

                            if !self.is_fragment_case {
                                match self.open_elements_stack.items.last() {
                                    Some(node) if !is_html_element!(node, "frameset") => {
                                        self.insertion_mode = InsertionMode::AfterFrameset;
                                    }
                                    _ => {}
                                }
                            }
                        }
                    }
                    // A start tag whose tag name is "frame"
                    //
                    // Insert an HTML element for the token. Immediately pop the current node off
                    // the stack of open elements.
                    //
                    // Acknowledge the token's self-closing flag, if it is set.
                    Token::StartTag {
                        tag_name,
                        is_self_closing,
                        ..
                    } if tag_name == "frame" => {
                        let is_self_closing = *is_self_closing;

                        self.insert_html_element(token_and_info)?;
                        self.open_elements_stack.pop();

                        if is_self_closing {
                            token_and_info.acknowledged = true;
                        }
                    }
                    // A start tag whose tag name is "noframes"
                    //
                    // Process the token using the rules for the "in head" insertion mode.
                    Token::StartTag { tag_name, .. } if tag_name == "noframes" => {
                        self.process_token_using_rules(token_and_info, InsertionMode::InHead)?;
                    }
                    // An end-of-file token
                    //
                    // If the current node is not the root html element, then this is a parse error.
                    //
                    // Note: The current node can only be the root html element in the fragment
                    // case.
                    //
                    // Stop parsing.
                    Token::Eof => {
                        self.update_end_tag_span(
                            self.open_elements_stack.items.last(),
                            token_and_info.span,
                        );

                        match self.open_elements_stack.items.last() {
                            Some(node) if !is_html_element!(node, "html") => {
                                self.errors.push(Error::new(
                                    token_and_info.span,
                                    ErrorKind::EofWithUnclosedElements,
                                ));
                            }
                            _ => {}
                        }

                        self.stopped = true;
                    }
                    // Anything else
                    //
                    // Parse error. Ignore the token.
                    _ => match token {
                        // Doctype handled above
                        // Comment handled above
                        // EOF handled above
                        Token::Character { .. } => {
                            self.errors.push(Error::new(
                                token_and_info.span,
                                ErrorKind::NonSpaceCharacterInFrameset,
                            ));
                        }
                        Token::StartTag { tag_name, .. } => {
                            self.errors.push(Error::new(
                                token_and_info.span,
                                ErrorKind::StrayStartTag(tag_name.clone()),
                            ));
                        }
                        Token::EndTag { tag_name, .. } => {
                            self.errors.push(Error::new(
                                token_and_info.span,
                                ErrorKind::StrayEndTag(tag_name.clone()),
                            ));
                        }
                        _ => {
                            unreachable!()
                        }
                    },
                }
            }
            // The "after frameset" insertion mode
            InsertionMode::AfterFrameset => {
                // When the user agent is to apply the rules for the "after frameset" insertion
                // mode, the user agent must handle the token as follows:
                match token {
                    // A character token that is one of U+0009 CHARACTER TABULATION, U+000A LINE
                    // FEED (LF), U+000C FORM FEED (FF), U+000D CARRIAGE RETURN (CR), or U+0020
                    // SPACE
                    //
                    // Insert the character.
                    Token::Character {
                        value: '\x09' | '\x0A' | '\x0C' | '\x0D' | '\x20',
                        ..
                    } => {
                        self.insert_character(token_and_info)?;
                    }
                    // A comment token
                    //
                    // Insert a comment.
                    Token::Comment { .. } => {
                        self.insert_comment(token_and_info)?;
                    }
                    // A DOCTYPE token
                    //
                    // Parse error. Ignore the token.
                    Token::Doctype { .. } => {
                        self.errors
                            .push(Error::new(token_and_info.span, ErrorKind::StrayDoctype));
                    }
                    // A start tag whose tag name is "html"
                    //
                    // Process the token using the rules for the "in body" insertion mode.
                    Token::StartTag { tag_name, .. } if tag_name == "html" => {
                        self.process_token_using_rules(token_and_info, InsertionMode::InBody)?;
                    }
                    // An end tag whose tag name is "html"
                    //
                    // Switch the insertion mode to "after after frameset".
                    Token::EndTag { tag_name, .. } if tag_name == "html" => {
                        self.update_end_tag_span(
                            self.open_elements_stack.items.last(),
                            token_and_info.span,
                        );
                        self.insertion_mode = InsertionMode::AfterAfterFrameset;
                    }
                    // A start tag whose tag name is "noframes"
                    //
                    // Process the token using the rules for the "in head" insertion mode.
                    Token::StartTag { tag_name, .. } if tag_name == "noframes" => {
                        self.process_token_using_rules(token_and_info, InsertionMode::InHead)?;
                    }
                    // An end-of-file token
                    //
                    // Stop parsing.
                    Token::Eof => {
                        self.stopped = true;
                    }
                    // Anything else
                    //
                    // Parse error. Ignore the token.
                    _ => match token {
                        // Doctype handled above
                        // Comment handled above
                        // EOF handled above
                        Token::Character { .. } => {
                            self.errors.push(Error::new(
                                token_and_info.span,
                                ErrorKind::NonSpaceCharacterAfterFrameset,
                            ));
                        }
                        Token::StartTag { tag_name, .. } => {
                            self.errors.push(Error::new(
                                token_and_info.span,
                                ErrorKind::StrayStartTag(tag_name.clone()),
                            ));
                        }
                        Token::EndTag { tag_name, .. } => {
                            self.errors.push(Error::new(
                                token_and_info.span,
                                ErrorKind::StrayEndTag(tag_name.clone()),
                            ));
                        }
                        _ => {
                            unreachable!()
                        }
                    },
                }
            }
            // The "after after body" insertion mode
            InsertionMode::AfterAfterBody => {
                // When the user agent is to apply the rules for the "after after body"
                // insertion mode, the user agent must handle the token as follows:
                match token {
                    // A comment token
                    //
                    // Insert a comment as the last child of the Document object.
                    Token::Comment { .. } => {
                        self.insert_comment_as_last_child_of_document(token_and_info)?;
                    }
                    // A DOCTYPE token
                    //
                    // A character token that is one of U+0009 CHARACTER TABULATION, U+000A LINE
                    // FEED (LF), U+000C FORM FEED (FF), U+000D CARRIAGE RETURN (CR), or U+0020
                    // SPACE
                    //
                    // A start tag whose tag name is "html"
                    //
                    // Process the token using the rules for the "in body" insertion mode.
                    Token::Doctype { .. } => {
                        self.process_token_using_rules(token_and_info, InsertionMode::InBody)?;
                    }
                    Token::Character {
                        value: '\x09' | '\x0A' | '\x0C' | '\x0D' | '\x20',
                        ..
                    } => {
                        self.process_token_using_rules(token_and_info, InsertionMode::InBody)?;
                    }
                    Token::StartTag { tag_name, .. } if tag_name == "html" => {
                        self.process_token_using_rules(token_and_info, InsertionMode::InBody)?;
                    }
                    // An end-of-file token
                    //
                    // Stop parsing.
                    Token::Eof => {
                        self.stopped = true;
                    }
                    // Anything else
                    //
                    // Parse error. Switch the insertion mode to "in body" and reprocess the token.
                    _ => {
                        match token {
                            // Doctype handled above
                            // Comment handled above
                            // EOF handled above
                            Token::Character { .. } => {
                                self.errors.push(Error::new(
                                    token_and_info.span,
                                    ErrorKind::NonSpaceCharacterInTrailer,
                                ));
                            }
                            Token::StartTag { tag_name, .. } => {
                                self.errors.push(Error::new(
                                    token_and_info.span,
                                    ErrorKind::StrayStartTag(tag_name.clone()),
                                ));
                            }
                            Token::EndTag { tag_name, .. } => {
                                self.errors.push(Error::new(
                                    token_and_info.span,
                                    ErrorKind::StrayEndTag(tag_name.clone()),
                                ));
                            }
                            _ => {
                                unreachable!();
                            }
                        }

                        self.insertion_mode = InsertionMode::InBody;
                        self.process_token(token_and_info, None)?;
                    }
                }
            }
            // The "after after frameset" insertion mode
            InsertionMode::AfterAfterFrameset => {
                // When the user agent is to apply the rules for the "after after frameset"
                // insertion mode, the user agent must handle the token as follows:
                match token {
                    // A comment token
                    //
                    // Insert a comment as the last child of the Document object.
                    Token::Comment { .. } => {
                        self.insert_comment_as_last_child_of_document(token_and_info)?;
                    }
                    // A DOCTYPE token
                    //
                    // A character token that is one of U+0009 CHARACTER TABULATION, U+000A LINE
                    // FEED (LF), U+000C FORM FEED (FF), U+000D CARRIAGE RETURN (CR), or U+0020
                    // SPACE
                    //
                    // A start tag whose tag name is "html"
                    //
                    // Process the token using the rules for the "in body" insertion mode.
                    Token::Doctype { .. } => {
                        self.process_token_using_rules(token_and_info, InsertionMode::InBody)?;
                    }
                    Token::Character {
                        value: '\x09' | '\x0A' | '\x0C' | '\x0D' | '\x20',
                        ..
                    } => {
                        self.process_token_using_rules(token_and_info, InsertionMode::InBody)?;
                    }
                    Token::StartTag { tag_name, .. } if tag_name == "html" => {
                        self.process_token_using_rules(token_and_info, InsertionMode::InBody)?;
                    }
                    // An end-of-file token
                    //
                    // Stop parsing.
                    Token::Eof => {
                        self.update_end_tag_span(
                            self.open_elements_stack.items.last(),
                            token_and_info.span,
                        );
                        self.stopped = true;
                    }
                    // A start tag whose tag name is "noframes"
                    //
                    // Process the token using the rules for the "in head" insertion mode.
                    Token::StartTag { tag_name, .. } if tag_name == "noframes" => {
                        self.process_token_using_rules(token_and_info, InsertionMode::InHead)?;
                    }
                    // Anything else
                    //
                    // Parse error. Ignore the token.
                    // Anything else
                    //
                    // Parse error. Ignore the token.
                    _ => match token {
                        // Doctype handled above
                        // Comment handled above
                        // EOF handled above
                        Token::Character { .. } => {
                            self.errors.push(Error::new(
                                token_and_info.span,
                                ErrorKind::NonSpaceCharacterInTrailer,
                            ));
                        }
                        Token::StartTag { tag_name, .. } => {
                            self.errors.push(Error::new(
                                token_and_info.span,
                                ErrorKind::StrayStartTag(tag_name.clone()),
                            ));
                        }
                        Token::EndTag { tag_name, .. } => {
                            self.errors.push(Error::new(
                                token_and_info.span,
                                ErrorKind::StrayEndTag(tag_name.clone()),
                            ));
                        }
                        _ => {
                            unreachable!();
                        }
                    },
                }
            }
        }

        Ok(())
    }

    fn process_token_in_table_insertion_mode_anything_else(
        &mut self,
        token_and_info: &mut TokenAndInfo,
    ) -> PResult<()> {
        match &token_and_info.token {
            Token::StartTag { tag_name, .. } => {
                self.errors.push(Error::new(
                    token_and_info.span,
                    ErrorKind::StartTagInTable(tag_name.clone()),
                ));
            }
            Token::EndTag { tag_name, .. } => {
                self.errors.push(Error::new(
                    token_and_info.span,
                    ErrorKind::StrayEndTag(tag_name.clone()),
                ));
            }
            Token::Character { .. } => {
                self.errors.push(Error::new(
                    token_and_info.span,
                    ErrorKind::NonSpaceCharacterInTable,
                ));
            }
            _ => {
                unreachable!();
            }
        }

        let saved_foster_parenting_state = self.foster_parenting_enabled;

        self.foster_parenting_enabled = true;
        self.process_token_using_rules(token_and_info, InsertionMode::InBody)?;
        self.foster_parenting_enabled = saved_foster_parenting_state;

        Ok(())
    }

    // Any other end tag
    //
    // Run these steps:
    //
    // 1. Initialize node to be the current node (the bottommost node of the stack).
    //
    // 2. Loop: If node is an HTML element with the same tag name as the token,
    // then:
    //
    //   1. Generate implied end tags, except for HTML elements with the same tag
    // name as the token.
    //
    //   2. If node is not the current node, then this is a parse error.
    //
    //   3. Pop all the nodes from the current node up to node, including node, then
    // stop these steps.
    //
    // 3. Otherwise, if node is in the special category, then this is a parse error;
    // ignore the token, and return.
    //
    // 4. Set node to the previous entry in the stack of open elements.
    //
    // 5. Return to the step labeled loop.
    fn any_other_end_tag_for_in_body_insertion_mode(&mut self, token_and_info: &TokenAndInfo) {
        let mut match_idx = None;
        let tag_name = match &token_and_info.token {
            Token::StartTag { tag_name, .. } | Token::EndTag { tag_name, .. } => tag_name,
            _ => {
                unreachable!();
            }
        };

        // 1., 2., 4. and 5.
        for (i, node) in self.open_elements_stack.items.iter().enumerate().rev() {
            if is_html_element_with_tag_name!(node, tag_name) {
                match_idx = Some(i);

                break;
            }

            // 3.
            if self.is_special_element(node) {
                self.errors.push(Error::new(
                    token_and_info.span,
                    ErrorKind::StrayEndTag(tag_name.clone()),
                ));

                return;
            }
        }

        let match_idx = match match_idx {
            None => {
                self.errors.push(Error::new(
                    token_and_info.span,
                    ErrorKind::StrayEndTag(tag_name.clone()),
                ));

                return;
            }
            Some(x) => x,
        };

        // 2. - 1.
        self.open_elements_stack
            .generate_implied_end_tags_with_exclusion(tag_name);

        // 2. - 2.
        if match_idx != self.open_elements_stack.items.len() - 1 {
            self.errors.push(Error::new(
                token_and_info.span,
                ErrorKind::UnclosedElements(tag_name.clone()),
            ));
        } else {
            let node = self.open_elements_stack.items.last();

            self.update_end_tag_span(node, token_and_info.span);
        }

        // 2.- 3.
        self.open_elements_stack.items.truncate(match_idx);
    }

    fn process_token_using_rules(
        &mut self,
        token_and_info: &mut TokenAndInfo,
        insertion_mode: InsertionMode,
    ) -> PResult<()> {
        self.process_token(token_and_info, Some(insertion_mode))?;

        Ok(())
    }

    // When the steps below require the user agent to adjust MathML attributes for a
    // token, then, if the token has an attribute named definitionurl, change its
    // name to definitionURL (note the case difference).
    fn adjust_math_ml_attribute(&self, attribute: &mut Attribute) {
        if attribute.name == "definitionurl" {
            attribute.name = "definitionURL".into();
        }
    }

    // When the steps below require the user agent to adjust SVG attributes for a
    // token, then, for each attribute on the token whose attribute name is one of
    // the ones in the first column of the following table, change the attribute's
    // name to the name given in the corresponding cell in the second column. (This
    // fixes the case of SVG attributes that are not all lowercase.)
    //
    // Attribute name on token	Attribute name on element
    // attributename	        attributeName
    // attributetype	        attributeType
    // basefrequency	        baseFrequency
    // baseprofile	            baseProfile
    // calcmode	                calcMode
    // clippathunits	        clipPathUnits
    // diffuseconstant	        diffuseConstant
    // edgemode	                edgeMode
    // filterunits	            filterUnits
    // glyphref	                glyphRef
    // gradienttransform	    gradientTransform
    // gradientunits	        gradientUnits
    // kernelmatrix	            kernelMatrix
    // kernelunitlength	        kernelUnitLength
    // keypoints	            keyPoints
    // keysplines	            keySplines
    // keytimes	                keyTimes
    // lengthadjust	            lengthAdjust
    // limitingconeangle	    limitingConeAngle
    // markerheight	            markerHeight
    // markerunits	            markerUnits
    // markerwidth	            markerWidth
    // maskcontentunits	        maskContentUnits
    // maskunits	            maskUnits
    // numoctaves	            numOctaves
    // pathlength	            pathLength
    // patterncontentunits	    patternContentUnits
    // patterntransform	        patternTransform
    // patternunits	            patternUnits
    // pointsatx	            pointsAtX
    // pointsaty	            pointsAtY
    // pointsatz	            pointsAtZ
    // preservealpha	        preserveAlpha
    // preserveaspectratio	    preserveAspectRatio
    // primitiveunits	        primitiveUnits
    // refx	                    refX
    // refy	                    refY
    // repeatcount	            repeatCount
    // repeatdur	            repeatDur
    // requiredextensions	    requiredExtensions
    // requiredfeatures	        requiredFeatures
    // specularconstant	        specularConstant
    // specularexponent	        specularExponent
    // spreadmethod	            spreadMethod
    // startoffset	            startOffset
    // stddeviation	            stdDeviation
    // stitchtiles	            stitchTiles
    // surfacescale	            surfaceScale
    // systemlanguage	        systemLanguage
    // tablevalues	            tableValues
    // targetx	                targetX
    // targety	                targetY
    // textlength	            textLength
    // viewbox	                viewBox
    // viewtarget	            viewTarget
    // xchannelselector	        xChannelSelector
    // ychannelselector	        yChannelSelector
    // zoomandpan	            zoomAndPan
    fn adjust_svg_attribute(&self, attribute: &mut Attribute) {
        match &*attribute.name {
            "attributename" => attribute.name = "attributeName".into(),
            "attributetype" => attribute.name = "attributeType".into(),
            "basefrequency" => attribute.name = "baseFrequency".into(),
            "baseprofile" => attribute.name = "baseProfile".into(),
            "calcmode" => attribute.name = "calcMode".into(),
            "clippathunits" => attribute.name = "clipPathUnits".into(),
            "diffuseconstant" => attribute.name = "diffuseConstant".into(),
            "edgemode" => attribute.name = "edgeMode".into(),
            "filterunits" => attribute.name = "filterUnits".into(),
            "glyphref" => attribute.name = "glyphRef".into(),
            "gradienttransform" => attribute.name = "gradientTransform".into(),
            "gradientunits" => attribute.name = "gradientUnits".into(),
            "kernelmatrix" => attribute.name = "kernelMatrix".into(),
            "kernelunitlength" => attribute.name = "kernelUnitLength".into(),
            "keypoints" => attribute.name = "keyPoints".into(),
            "keysplines" => attribute.name = "keySplines".into(),
            "keytimes" => attribute.name = "keyTimes".into(),
            "lengthadjust" => attribute.name = "lengthAdjust".into(),
            "limitingconeangle" => attribute.name = "limitingConeAngle".into(),
            "markerheight" => attribute.name = "markerHeight".into(),
            "markerunits" => attribute.name = "markerUnits".into(),
            "markerwidth" => attribute.name = "markerWidth".into(),
            "maskcontentunits" => attribute.name = "maskContentUnits".into(),
            "maskunits" => attribute.name = "maskUnits".into(),
            "numoctaves" => attribute.name = "numOctaves".into(),
            "pathlength" => attribute.name = "pathLength".into(),
            "patterncontentunits" => attribute.name = "patternContentUnits".into(),
            "patterntransform" => attribute.name = "patternTransform".into(),
            "patternunits" => attribute.name = "patternUnits".into(),
            "pointsatx" => attribute.name = "pointsAtX".into(),
            "pointsaty" => attribute.name = "pointsAtY".into(),
            "pointsatz" => attribute.name = "pointsAtZ".into(),
            "preservealpha" => attribute.name = "preserveAlpha".into(),
            "preserveaspectratio" => attribute.name = "preserveAspectRatio".into(),
            "primitiveunits" => attribute.name = "primitiveUnits".into(),
            "refx" => attribute.name = "refX".into(),
            "refy" => attribute.name = "refY".into(),
            "repeatcount" => attribute.name = "repeatCount".into(),
            "repeatdur" => attribute.name = "repeatDur".into(),
            "requiredextensions" => attribute.name = "requiredExtensions".into(),
            "requiredfeatures" => attribute.name = "requiredFeatures".into(),
            "specularconstant" => attribute.name = "specularConstant".into(),
            "specularexponent" => attribute.name = "specularExponent".into(),
            "spreadmethod" => attribute.name = "spreadMethod".into(),
            "startoffset" => attribute.name = "startOffset".into(),
            "stddeviation" => attribute.name = "stdDeviation".into(),
            "stitchtiles" => attribute.name = "stitchTiles".into(),
            "surfacescale" => attribute.name = "surfaceScale".into(),
            "systemlanguage" => attribute.name = "systemLanguage".into(),
            "tablevalues" => attribute.name = "tableValues".into(),
            "targetx" => attribute.name = "targetX".into(),
            "targety" => attribute.name = "targetY".into(),
            "textlength" => attribute.name = "textLength".into(),
            "viewbox" => attribute.name = "viewBox".into(),
            "viewtarget" => attribute.name = "viewTarget".into(),
            "xchannelselector" => attribute.name = "xChannelSelector".into(),
            "ychannelselector" => attribute.name = "yChannelSelector".into(),
            "zoomandpan" => attribute.name = "zoomAndPan".into(),
            _ => {}
        }
    }

    // When the steps below require the user agent to adjust foreign attributes for
    // a token, then, if any of the attributes on the token match the strings given
    // in the first column of the following table, let the attribute be a namespaced
    // attribute, with the prefix being the string given in the corresponding cell
    // in the second column, the local name being the string given in the
    // corresponding cell in the third column, and the namespace being the namespace
    // given in the corresponding cell in the fourth column. (This fixes the use of
    // namespaced attributes, in particular lang attributes in the XML namespace.)
    //
    //
    // Attribute name	Prefix	Local name	Namespace
    //
    // xlink:actuate	xlink	actuate	    XLink namespace
    // xlink:arcrole	xlink	arcrole	    XLink namespace
    // xlink:href	    xlink	href	    XLink namespace
    // xlink:role	    xlink	role	    XLink namespace
    // xlink:show	    xlink	show	    XLink namespace
    // xlink:title	    xlink	title	    XLink namespace
    // xlink:type	    xlink	type	    XLink namespace
    // xml:lang	        xml	    lang	    XML namespace
    // xml:space	    xml	    space	    XML namespace
    // xmlns	        (none)	xmlns	    XMLNS namespace
    // xmlns:xlink	    xmlns	xlink	    XMLNS namespace
    fn adjust_foreign_attribute(&self, attribute: &mut Attribute) {
        match &*attribute.name {
            "xlink:actuate" => {
                attribute.namespace = Some(Namespace::XLINK);
                attribute.prefix = Some("xlink".into());
                attribute.name = "actuate".into();
            }
            "xlink:arcrole" => {
                attribute.namespace = Some(Namespace::XLINK);
                attribute.prefix = Some("xlink".into());
                attribute.name = "arcrole".into();
            }
            "xlink:href" => {
                attribute.namespace = Some(Namespace::XLINK);
                attribute.prefix = Some("xlink".into());
                attribute.name = "href".into();
            }
            "xlink:role" => {
                attribute.namespace = Some(Namespace::XLINK);
                attribute.prefix = Some("xlink".into());
                attribute.name = "role".into();
            }
            "xlink:show" => {
                attribute.namespace = Some(Namespace::XLINK);
                attribute.prefix = Some("xlink".into());
                attribute.name = "show".into();
            }
            "xlink:title" => {
                attribute.namespace = Some(Namespace::XLINK);
                attribute.prefix = Some("xlink".into());
                attribute.name = "title".into();
            }
            "xlink:type" => {
                attribute.namespace = Some(Namespace::XLINK);
                attribute.prefix = Some("xlink".into());
                attribute.name = "type".into();
            }
            "xml:lang" => {
                attribute.namespace = Some(Namespace::XML);
                attribute.prefix = Some("xml".into());
                attribute.name = "lang".into();
            }
            "xml:space" => {
                attribute.namespace = Some(Namespace::XML);
                attribute.prefix = Some("xml".into());
                attribute.name = "space".into();
            }
            "xmlns" => {
                attribute.namespace = Some(Namespace::XMLNS);
                attribute.prefix = None;
                attribute.name = "xmlns".into();
            }
            "xmlns:xlink" => {
                attribute.namespace = Some(Namespace::XMLNS);
                attribute.prefix = Some("xmlns".into());
                attribute.name = "xlink".into();
            }
            _ => {}
        }
    }

    fn create_element_for_token(
        &self,
        token: Token,
        span: Span,
        namespace: Option<Namespace>,
        adjust_attributes: Option<AdjustAttributes>,
    ) -> RcNode {
        let element = match token {
            Token::StartTag {
                tag_name,
                attributes,
                is_self_closing,
                ..
            }
            | Token::EndTag {
                tag_name,
                attributes,
                is_self_closing,
                ..
            } => {
                let attributes = attributes
                    .into_iter()
                    .map(|attribute_token| {
                        let mut attribute = Attribute {
                            span: attribute_token.span,
                            namespace: None,
                            prefix: None,
                            name: attribute_token.name,
                            raw_name: attribute_token.raw_name,
                            value: attribute_token.value,
                            raw_value: attribute_token.raw_value,
                        };

                        match adjust_attributes {
                            Some(AdjustAttributes::MathML) => {
                                self.adjust_math_ml_attribute(&mut attribute);
                                self.adjust_foreign_attribute(&mut attribute);
                            }
                            Some(AdjustAttributes::Svg) => {
                                self.adjust_svg_attribute(&mut attribute);
                                self.adjust_foreign_attribute(&mut attribute);
                            }
                            None => {}
                        }

                        attribute
                    })
                    .collect();

                Data::Element {
                    tag_name,
                    namespace: namespace.unwrap(),
                    attributes: RefCell::new(attributes),
                    is_self_closing,
                }
            }
            _ => {
                unreachable!();
            }
        };

        Node::new(element, span)
    }

    // The adoption agency algorithm, which takes as its only argument a token token
    // for which the algorithm is being run, consists of the following steps:
    //
    // 1. Let subject be token's tag name.
    //
    // 2. If the current node is an HTML element whose tag name is subject, and the
    // current node is not in the list of active formatting elements, then pop the
    // current node off the stack of open elements and return.
    //
    // 3. Let outer loop counter be 0.
    //
    // 4. While true:
    //
    //    1. If outer loop counter is greater than or equal to 8, then return.
    //
    //    2. Increment outer loop counter by 1.
    //
    //    3. Let formatting element be the last element in the list of active
    // formatting elements that:
    //
    //        is between the end of the list and the last marker in the list, if
    // any, or the start of the list otherwise, and has the tag name subject.
    //
    //        If there is no such element, then return and instead act as described
    // in the "any other end tag" entry above.
    //
    //    4. If formatting element is not in the stack of open elements, then this
    // is a    parse error; remove the element from the list, and return.
    //
    //    5. If formatting element is in the stack of open elements, but the element
    // is not in scope, then this is a parse error; return.
    //
    //    6. If formatting element is not the current node, this is a parse error.
    // (But do not return.)
    //
    //    7. Let furthest block be the topmost node in the stack of open elements
    // that is lower in the stack than formatting element, and is an element
    // in the special category. There might not be one.
    //
    //    8. If there is no furthest block, then the UA must first pop all the nodes
    // from the bottom of the stack of open elements, from the current node
    // up to and including formatting element, then remove formatting element
    // from the list of active formatting elements, and finally return.
    //
    //    9. Let common ancestor be the element immediately above formatting element
    // in the stack of open elements.
    //
    //    10. Let a bookmark note the position of formatting element in the list of
    // active formatting elements relative to the elements on either side of
    // it in the list.
    //
    //    11. Let node and last node be furthest block.
    //
    //    12. Let inner loop counter be 0.
    //
    //    13. While true:
    //
    //        1. Increment inner loop counter by 1.
    //
    //        2. Let node be the element immediately above node in the stack of open
    //          elements, or if node is no longer in the stack of open
    //          elements (e.g. because it got removed by this algorithm), the
    //          element that was immediately above node in the stack of open
    //          elements before node was removed.
    //
    //        3. If node is formatting element, then break.
    //
    //        4. If inner loop counter is greater than 3 and node is in the list of
    //          active formatting elements, then remove node from the list of
    //          active formatting elements.
    //
    //        5. If node is not in the list of active formatting elements, then
    //          remove node from the stack of open elements and continue.
    //
    //        6. Create an element for the token for which the element node was
    //          created, in the HTML namespace, with common ancestor as the
    //          intended parent; replace the entry for node in the list of active
    //          formatting elements with an entry for the new element, replace the
    //          entry for node in the stack of open elements with an entry for the
    //          new element, and let node be the new element.
    //
    //        7. If last node is furthest block, then move the aforementioned
    //          bookmark to be immediately after the new node in the list of
    //          active formatting elements.
    //
    //        8. Append last node to node.
    //
    //        9. Set last node to node.
    //
    // 14. Insert whatever last node ended up being in the previous step at the
    // appropriate place for inserting a node, but using common ancestor as the
    // override target.
    //
    // 15, Create an element for the token for which formatting element was created,
    // in the HTML namespace, with furthest block as the intended parent.
    //
    // 16. Take all of the child nodes of furthest block and append them to the
    // element created in the last step.
    //
    // 17. Append that new element to furthest block.
    //
    // 18. Remove formatting element from the list of active formatting elements,
    // and insert the new element into the list of active formatting elements at
    // the position of the aforementioned bookmark.
    //
    // 19. Remove formatting element from the stack of open elements, and insert the
    // new element into the stack of open elements immediately below the
    // position of furthest block in that stack.
    //
    // This algorithm's name, the "adoption agency algorithm", comes from the way it
    // causes elements to change parents, and is in contrast with other possible
    // algorithms for dealing with misnested content.
    fn run_the_adoption_agency_algorithm(
        &mut self,
        token_and_info: &TokenAndInfo,
        is_closing: bool,
    ) -> PResult<()> {
        // 1.
        let subject = match &token_and_info.token {
            Token::StartTag { tag_name, .. } | Token::EndTag { tag_name, .. } => tag_name.clone(),
            _ => {
                unreachable!();
            }
        };

        // 2.
        let last = self.open_elements_stack.items.last();

        if let Some(last) = last {
            if is_html_element_with_tag_name!(last, &subject)
                && self.active_formatting_elements.get_position(last).is_none()
            {
                let popped = self.open_elements_stack.pop();

                if is_closing {
                    self.update_end_tag_span(popped.as_ref(), token_and_info.span);
                }

                return Ok(());
            }
        }

        // 3.
        let mut counter = 0;

        // 4.
        loop {
            // 1.
            if counter >= 8 {
                return Ok(());
            }

            // 2.
            counter += 1;

            // 3.
            let formatting_element = self
                .active_formatting_elements
                .items
                .iter()
                .enumerate()
                .rev()
                .find(|info| match &info.1 {
                    ActiveFormattingElement::Element(element, _) => {
                        is_html_element_with_tag_name!(element, &subject)
                    }
                    _ => false,
                })
                .map(|(i, e)| match e {
                    ActiveFormattingElement::Element(node, token_and_info) => {
                        (i, node.clone(), token_and_info.clone())
                    }
                    _ => {
                        unreachable!()
                    }
                });

            if formatting_element.is_none() {
                self.any_other_end_tag_for_in_body_insertion_mode(token_and_info);

                return Ok(());
            }

            let formatting_element = formatting_element.unwrap();

            // 4.
            let formatting_element_stack_index = self
                .open_elements_stack
                .items
                .iter()
                .rposition(|n| is_same_node(n, &formatting_element.1));

            if formatting_element_stack_index.is_none() {
                self.errors.push(Error::new(
                    token_and_info.span,
                    ErrorKind::NoElementToCloseButEndTagSeen(subject),
                ));
                self.active_formatting_elements
                    .remove(&formatting_element.1);

                return Ok(());
            }

            // 5.
            if formatting_element_stack_index.is_some()
                && !self
                    .open_elements_stack
                    .has_node_in_scope(&formatting_element.1)
            {
                self.errors.push(Error::new(
                    token_and_info.span,
                    ErrorKind::NoElementToCloseButEndTagSeen(subject),
                ));

                return Ok(());
            }

            let formatting_element_stack_index = formatting_element_stack_index.unwrap();

            // 6.
            if let Some(node) = self.open_elements_stack.items.last() {
                if !is_same_node(node, &formatting_element.1) {
                    self.errors.push(Error::new(
                        token_and_info.span,
                        ErrorKind::EndTagViolatesNestingRules(subject.clone()),
                    ));
                }
            }

            // 7.
            let furthest_block = self
                .open_elements_stack
                .items
                .iter()
                .enumerate()
                .skip(formatting_element_stack_index)
                .find(|&(_, open_element)| self.is_special_element(open_element))
                .map(|(i, h)| (i, h.clone()));

            // 8.
            if furthest_block.is_none() {
                while let Some(node) = self.open_elements_stack.pop() {
                    if is_same_node(&node, &formatting_element.1) {
                        if is_closing {
                            self.update_end_tag_span(Some(&node), token_and_info.span);
                        }

                        break;
                    }
                }

                self.active_formatting_elements
                    .remove(&formatting_element.1);

                return Ok(());
            }

            // 9.
            let common_ancestor =
                self.open_elements_stack.items[formatting_element_stack_index - 1].clone();

            // 10.
            let mut bookmark = Bookmark::Replace(formatting_element.1.clone());

            // 11.
            let furthest_block = furthest_block.unwrap();
            let mut node;
            let mut node_index = furthest_block.0;
            let mut last_node = furthest_block.1.clone();

            // 12.
            let mut inner_loop_counter = 0;

            // 13.
            loop {
                // 13.1
                inner_loop_counter += 1;

                // 13.2
                node_index -= 1;
                node = self.open_elements_stack.items[node_index].clone();

                // 13.3
                if is_same_node(&node, &formatting_element.1) {
                    break;
                }

                // 13.4
                let node_formatting_index = self.active_formatting_elements.get_position(&node);
                let mut node_in_list = node_formatting_index.is_some();

                if inner_loop_counter > 3 && node_in_list {
                    self.active_formatting_elements.remove(&node);

                    node_in_list = false;
                }

                // 13.5
                if !node_in_list {
                    self.open_elements_stack.remove(&node);

                    continue;
                }

                // 13.6
                let node_formatting_index = node_formatting_index.unwrap();
                let token_and_info =
                    match self.active_formatting_elements.items[node_formatting_index] {
                        ActiveFormattingElement::Element(ref h, ref t) => {
                            assert!(is_same_node(h, &node));

                            t.clone()
                        }
                        ActiveFormattingElement::Marker => {
                            panic!("Found marker during adoption agency")
                        }
                    };
                let new_element = self.create_element_for_token(
                    token_and_info.token.clone(),
                    token_and_info.span,
                    Some(Namespace::HTML),
                    None,
                );

                self.active_formatting_elements.items[node_formatting_index] =
                    ActiveFormattingElement::Element(new_element.clone(), token_and_info);
                self.open_elements_stack
                    .replace(node_index, new_element.clone());

                node = new_element;

                // 13.7
                if is_same_node(&last_node, &furthest_block.1) {
                    bookmark = Bookmark::InsertAfter(node.clone());
                }

                // 13.8
                if let Some((parent, i)) = self.get_parent_and_index(&last_node) {
                    parent.children.borrow_mut().remove(i);
                    last_node.parent.set(None);
                }

                self.append_node(&node, last_node);

                // 13.9
                last_node = node;
            }

            // 14.
            if let Some((parent, i)) = self.get_parent_and_index(&last_node) {
                parent.children.borrow_mut().remove(i);

                last_node.parent.set(None);
            }

            let appropriate_place =
                self.get_appropriate_place_for_inserting_node(Some(common_ancestor))?;

            self.insert_at_position(appropriate_place, last_node.clone());

            // 15.
            let start_span = match &furthest_block.1.children.borrow().first() {
                Some(first) => first.start_span.borrow().lo,
                _ => token_and_info.span.lo(),
            };
            let new_element = self.create_element_for_token(
                formatting_element.2.token.clone(),
                Span::new(start_span, token_and_info.span.hi()),
                Some(Namespace::HTML),
                None,
            );

            // 16.
            self.reparent_children(&furthest_block.1, &new_element);

            // 17.
            self.append_node(&furthest_block.1, new_element.clone());

            // 18.
            match bookmark {
                Bookmark::Replace(to_replace) => {
                    let index = self
                        .active_formatting_elements
                        .get_position(&to_replace)
                        .expect("bookmark not found in active formatting elements");

                    self.active_formatting_elements.items[index] =
                        ActiveFormattingElement::Element(new_element.clone(), formatting_element.2);
                }
                Bookmark::InsertAfter(previous) => {
                    let index = self
                        .active_formatting_elements
                        .get_position(&previous)
                        .expect("bookmark not found in active formatting elements")
                        + 1;

                    self.active_formatting_elements.items.insert(
                        index,
                        ActiveFormattingElement::Element(new_element.clone(), formatting_element.2),
                    );

                    let old_index = self
                        .active_formatting_elements
                        .get_position(&formatting_element.1)
                        .expect("formatting element not found in active formatting elements");

                    self.active_formatting_elements.items.remove(old_index);
                }
            }

            // 19.
            self.open_elements_stack.remove(&formatting_element.1);

            let new_furthest_block_index = self
                .open_elements_stack
                .items
                .iter()
                .position(|n| is_same_node(n, &furthest_block.1))
                .expect("furthest block missing from open element stack");

            self.open_elements_stack
                .insert(new_furthest_block_index + 1, new_element);
        }
    }

    fn reparent_children(&mut self, node: &RcNode, new_parent: &RcNode) {
        let mut children = node.children.borrow_mut();
        let mut new_children = new_parent.children.borrow_mut();

        for child in children.iter() {
            let previous_parent = child.parent.replace(Some(Rc::downgrade(new_parent)));

            // It is possible when new created element doesn't have parent
            if let Some(previous_parent) = previous_parent {
                assert!(is_same_node(
                    node,
                    &previous_parent.upgrade().expect("dangling weak")
                ));
            }
        }

        new_children.extend(std::mem::take(&mut *children));
    }

    // When the steps below require the UA to reconstruct the active formatting
    // elements, the UA must perform the following steps:
    //
    // 1. If there are no entries in the list of active formatting elements, then
    // there is nothing to reconstruct; stop this algorithm.
    //
    // 2. If the last (most recently added) entry in the list of active formatting
    // elements is a marker, or if it is an element that is in the stack of open
    // elements, then there is nothing to reconstruct; stop this algorithm.
    //
    // 3. Let entry be the last (most recently added) element in the list of active
    // formatting elements.
    //
    // 4. Rewind: If there are no entries before entry in the list of active
    // formatting elements, then jump to the step labeled create.
    //
    // 5. Let entry be the entry one earlier than entry in the list of active
    // formatting elements.
    //
    // 6. If entry is neither a marker nor an element that is also in the stack of
    // open elements, go to the step labeled rewind.
    //
    // 7. Advance: Let entry be the element one later than entry in the list of
    // active formatting elements.
    //
    // 8. Create: Insert an HTML element for the token for which the element entry
    // was created, to obtain new element.
    //
    // 9. Replace the entry for entry in the list with an entry for new element.
    //
    // 10. If the entry for new element in the list of active formatting elements is
    // not the last entry in the list, return to the step labeled advance.
    //
    // This has the effect of reopening all the formatting elements that were opened
    // in the current body, cell, or caption (whichever is youngest) that haven't
    // been explicitly closed.
    fn reconstruct_active_formatting_elements(&mut self) -> PResult<()> {
        let last = match self.active_formatting_elements.items.last() {
            None => {
                return Ok(());
            }
            Some(x) => x,
        };

        if self.is_marker_or_open(last) {
            return Ok(());
        }

        let mut entry_index = self.active_formatting_elements.items.len() - 1;

        loop {
            if entry_index == 0 {
                break;
            }

            entry_index -= 1;

            if self.is_marker_or_open(&self.active_formatting_elements.items[entry_index]) {
                entry_index += 1;

                break;
            }
        }

        loop {
            let token_and_info = match self.active_formatting_elements.items[entry_index] {
                ActiveFormattingElement::Element(_, ref t) => t.clone(),
                ActiveFormattingElement::Marker => {
                    panic!("Found marker during formatting element reconstruction")
                }
            };

            let new_element = self.insert_html_element(&token_and_info)?;

            self.active_formatting_elements.items[entry_index] =
                ActiveFormattingElement::Element(new_element, token_and_info);

            if entry_index == self.active_formatting_elements.items.len() - 1 {
                break Ok(());
            }

            entry_index += 1;
        }
    }

    fn is_marker_or_open(&self, entry: &ActiveFormattingElement) -> bool {
        match *entry {
            ActiveFormattingElement::Marker => true,
            ActiveFormattingElement::Element(ref node, _) => self
                .open_elements_stack
                .items
                .iter()
                .rev()
                .any(|n| is_same_node(n, node)),
        }
    }

    fn create_fake_html_element(&self) -> RcNode {
        Node::new(
            Data::Element {
                tag_name: "html".into(),
                namespace: Namespace::HTML,
                attributes: RefCell::new(Vec::new()),
                is_self_closing: false,
            },
            DUMMY_SP,
        )
    }

    fn create_fake_token_and_info(&self, tag_name: &str, span: Option<Span>) -> TokenAndInfo {
        TokenAndInfo {
            span: match span {
                Some(span) => span,
                _ => DUMMY_SP,
            },
            acknowledged: false,
            token: Token::StartTag {
                tag_name: tag_name.into(),
                raw_tag_name: None,
                is_self_closing: false,
                attributes: Vec::new(),
            },
        }
    }

    // Parsing elements that contain only text
    // The generic raw text element parsing algorithm and the generic RCDATA element
    // parsing algorithm consist of the following steps. These algorithms are always
    // invoked in response to a start tag token.
    fn parse_generic_text_element(
        &mut self,
        token_and_info: &TokenAndInfo,
        is_raw_text_element_algorithm: bool,
    ) -> PResult<()> {
        // Insert an HTML element for the token.
        self.insert_html_element(token_and_info)?;

        // If the algorithm that was invoked is the generic raw text element
        // parsing algorithm, switch the tokenizer to the RAWTEXT state;
        // otherwise the algorithm invoked was the generic RCDATA element
        // parsing algorithm, switch the tokenizer to the RCDATA state.
        if is_raw_text_element_algorithm {
            self.input.set_input_state(State::Rawtext);
        } else {
            self.input.set_input_state(State::Rcdata);
        }

        // Let the original insertion mode be the current insertion mode.
        self.original_insertion_mode = self.insertion_mode.clone();
        // Then, switch the insertion mode to "text".
        self.insertion_mode = InsertionMode::Text;

        Ok(())
    }

    fn close_p_element(&mut self, token_and_info: &TokenAndInfo, is_close_p: bool) {
        // When the steps above say the user agent is to close a p element, it means
        // that the user agent must run the following steps:

        // 1. Generate implied end tags, except for p elements.
        self.open_elements_stack
            .generate_implied_end_tags_with_exclusion("p");

        // 2. If the current node is not a p element, then this is a parse error.
        match self.open_elements_stack.items.last() {
            Some(node) if !is_html_element!(node, "p") => {
                let tag_name = match &token_and_info.token {
                    Token::StartTag { tag_name, .. } | Token::EndTag { tag_name, .. } => {
                        tag_name.clone()
                    }
                    _ => {
                        unreachable!();
                    }
                };

                self.errors.push(Error::new(
                    token_and_info.span,
                    ErrorKind::UnclosedElementsImplied(tag_name),
                ));
            }
            _ => {}
        }

        // 3. Pop elements from the stack of open elements until a p element has been
        // popped from the stack.
        let popped = self.open_elements_stack.pop_until_tag_name_popped(&["p"]);

        if is_close_p {
            self.update_end_tag_span(popped.as_ref(), token_and_info.span)
        }
    }

    fn close_the_cell(&mut self) {
        // Generate implied end tags.
        self.open_elements_stack.generate_implied_end_tags();

        // If the current node is not now a td element or a th element, then this is a
        // parse error.
        match self.open_elements_stack.items.last() {
            Some(node) if !is_html_element!(node, "td" | "th") => {
                self.errors.push(Error::new(
                    *node.start_span.borrow(),
                    ErrorKind::UnclosedElementsCell,
                ));
            }
            _ => {}
        }

        // Pop elements from the stack of open elements stack until a td
        // element or a th element has been popped from the stack.
        self.open_elements_stack
            .pop_until_tag_name_popped(&["td", "th"]);

        // Clear the list of active formatting elements up to the last marker.
        self.active_formatting_elements.clear_to_last_marker();

        // Switch the insertion mode to "in row".
        self.insertion_mode = InsertionMode::InRow;

        // NOTE: The stack of open elements cannot have both a td and a th
        // element in table scope at the same time, nor can it have neither
        // when the close the cell algorithm is invoked.
    }

    fn reset_insertion_mode(&mut self) {
        // 1. Let last be false.
        let mut last = false;

        let mut iter = self.open_elements_stack.items.iter().rev();
        let first = self.open_elements_stack.items.first();

        // 2. Let node be the last node in the stack of open elements.
        while let Some(mut inner_node) = iter.next() {
            // 3. Loop: If node is the first node in the stack of open elements, then set
            // last to true, and, if the parser was created as part of the HTML fragment
            // parsing algorithm (fragment case), set node to the context element passed to
            // that algorithm.
            if let Some(first) = first {
                if is_same_node(first, inner_node) {
                    last = true;

                    if self.is_fragment_case {
                        // Fragment case
                        if let Some(context_element) = &self.context_element {
                            inner_node = context_element;
                        }
                    }
                }
            }

            // Optimization - logic below only works with HTML namespaces, so we can skip
            // extra checks
            if get_namespace!(inner_node) != Namespace::HTML {
                if last {
                    self.insertion_mode = InsertionMode::InBody;

                    return;
                }

                continue;
            }

            let tag_name = get_tag_name!(inner_node);

            // 4. If node is a select element, run these substeps:
            //
            //   1. If last is true, jump to the step below labeled done.
            //
            //   2. Let ancestor be node.
            //
            //   3. Loop: If ancestor is the first node in the stack of open elements, jump
            // to the step below labeled done.
            //
            //   4. Let ancestor be the node before ancestor in the stack of open elements.
            //
            //   5. If ancestor is a template node, jump to the step below labeled done.
            //
            //   6. If ancestor is a table node, switch the insertion mode to "in select in
            // table" and return.
            //
            //   7. Jump back to the step labeled loop.
            //
            //   8. Done: Switch the insertion mode to "in select" and return.
            if tag_name == "select" {
                if !last {
                    let mut ancestor = Some(inner_node);

                    while ancestor.is_some() {
                        if let Some(ancestor) = ancestor {
                            if let Some(first) = first {
                                if is_same_node(ancestor, first) {
                                    break;
                                }
                            }
                        }

                        ancestor = iter.next();

                        if let Some(ancestor) = ancestor {
                            if is_html_element!(ancestor, "template") {
                                break;
                            } else if is_html_element!(ancestor, "table") {
                                self.insertion_mode = InsertionMode::InSelectInTable;

                                return;
                            }
                        }
                    }
                }

                self.insertion_mode = InsertionMode::InSelect;

                return;
            }

            // 5. If node is a td or th element and last is false, then switch the insertion
            // mode to "in cell" and return.
            if (tag_name == "td" || tag_name == "th") && !last {
                self.insertion_mode = InsertionMode::InCell;

                return;
            }

            // 6. If node is a tr element, then switch the insertion mode to "in row" and
            // return.
            if tag_name == "tr" {
                self.insertion_mode = InsertionMode::InRow;

                return;
            }

            // 7. If node is a tbody, thead, or tfoot element, then switch the insertion
            // mode to "in table body" and return.
            if tag_name == "tbody" || tag_name == "thead" || tag_name == "tfoot" {
                self.insertion_mode = InsertionMode::InTableBody;

                return;
            }

            // 8. If node is a caption element, then switch the insertion mode to "in
            // caption" and return.
            if tag_name == "caption" {
                self.insertion_mode = InsertionMode::InCaption;

                return;
            }

            // 9. If node is a colgroup element, then switch the insertion mode to "in
            // column group" and return.
            if tag_name == "colgroup" {
                self.insertion_mode = InsertionMode::InColumnGroup;

                return;
            }

            // // 10. If node is a table element, then switch the insertion mode to "in
            // table" and return.
            if tag_name == "table" {
                self.insertion_mode = InsertionMode::InTable;

                return;
            }

            // 11. If node is a template element, then switch the insertion mode to the
            // current template insertion mode and return.
            if tag_name == "template" {
                if let Some(last) = self.template_insertion_mode_stack.last() {
                    self.insertion_mode = last.clone();

                    return;
                }
            }

            // 12. If node is a head element and last is false, then switch the insertion
            // mode to "in head" and return.
            if tag_name == "head" && !last {
                self.insertion_mode = InsertionMode::InHead;

                return;
            }

            // 13. If node is a body element, then switch the insertion mode to "in body"
            // and return.
            if tag_name == "body" {
                self.insertion_mode = InsertionMode::InBody;

                return;
            }

            // 14. If node is a frameset element, then switch the insertion mode to "in
            // frameset" and return. (fragment case)
            if tag_name == "frameset" {
                self.insertion_mode = InsertionMode::InFrameset;

                return;
            }

            // 15. If node is an html element, run these substeps:
            //
            //   1. If the head element pointer is null, switch the insertion mode to
            // "before head" and return. (fragment case)
            //
            //   2. Otherwise, the head element pointer is not null, switch the insertion
            // mode to "after head" and return.
            if tag_name == "html" {
                if self.head_element_pointer.is_none() {
                    // Fragment case
                    self.insertion_mode = InsertionMode::BeforeHead;
                } else {
                    self.insertion_mode = InsertionMode::AfterHead;
                }

                return;
            }

            // 16. If last is true, then switch the insertion mode to "in body" and return.
            // (fragment case)
            if last {
                self.insertion_mode = InsertionMode::InBody;

                return;
            }

            // 17. Let node now be the node before node in the stack of open
            // elements.
            //
            // 18. Return to the step labeled loop.
        }
    }

    fn set_document_mode(&mut self, document_mode: DocumentMode) {
        if let Some(document) = &self.document {
            match &document.data {
                Data::Document { mode, .. } => {
                    let mut mode = mode.borrow_mut();

                    *mode = document_mode;
                }
                _ => {
                    unreachable!();
                }
            }
        }
    }

    fn is_special_element(&self, node: &RcNode) -> bool {
        if is_html_element!(
            node,
            "address"
                | "applet"
                | "area"
                | "article"
                | "aside"
                | "base"
                | "basefont"
                | "bgsound"
                | "blockquote"
                | "body"
                | "br"
                | "button"
                | "caption"
                | "center"
                | "col"
                | "colgroup"
                | "dd"
                | "details"
                | "dir"
                | "div"
                | "dl"
                | "dt"
                | "embed"
                | "fieldset"
                | "figcaption"
                | "figure"
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
                | "iframe"
                | "img"
                | "input"
                | "keygen"
                | "li"
                | "link"
                | "listing"
                | "main"
                | "marquee"
                | "menu"
                | "meta"
                | "nav"
                | "noembed"
                | "noframes"
                | "noscript"
                | "object"
                | "ol"
                | "p"
                | "param"
                | "plaintext"
                | "pre"
                | "script"
                | "section"
                | "select"
                | "source"
                | "style"
                | "summary"
                | "table"
                | "tbody"
                | "td"
                | "template"
                | "textarea"
                | "tfoot"
                | "th"
                | "thead"
                | "title"
                | "tr"
                | "track"
                | "ul"
                | "wbr"
                | "xmp"
        ) || is_mathml_element!(node, "mi" | "mo" | "mn" | "ms" | "mtext" | "annotation-xml")
            || is_svg_element!(node, "title" | "foreignObject" | "desc")
        {
            return true;
        }

        false
    }

    // While the parser is processing a token, it can enable or disable foster
    // parenting. This affects the following algorithm.
    //
    // The appropriate place for inserting a node, optionally using a particular
    // override target, is the position in an element returned by running the
    // following steps:
    //
    // 1. If there was an override target specified, then let target be the override
    // target.
    //
    // Otherwise, let target be the current node.
    //
    // 2. Determine the adjusted insertion location using the first matching steps
    // from the following list:
    //
    // If foster parenting is enabled and target is a table, tbody, tfoot, thead, or
    // tr element Foster parenting happens when content is misnested in tables.
    //
    // Run these substeps:
    //
    // 1. Let last template be the last template element in the stack of open
    // elements, if any.
    //
    // 2. Let last table be the last table element in the stack of open elements, if
    // any.
    //
    // 3. If there is a last template and either there is no last table, or there is
    // one, but last template is lower (more recently added) than last table in the
    // stack of open elements, then: let adjusted insertion location be inside last
    // template's template contents, after its last child (if any), and abort these
    // steps.
    //
    // 4. If there is no last table, then let adjusted insertion location be inside
    // the first element in the stack of open elements (the html element), after
    // its last child (if any), and abort these steps. (fragment case)
    //
    // 5. If last table has a parent node, then let adjusted insertion location be
    // inside last table's parent node, immediately before last table, and abort
    // these steps.
    //
    // 6. Let previous element be the element immediately above last table in the
    // stack of open elements.
    //
    // 7. Let adjusted insertion location be inside previous element, after its last
    // child (if any).
    //
    // These steps are involved in part because it's possible for elements, the
    // table element in this case in particular, to have been moved by a script
    // around in the DOM, or indeed removed from the DOM entirely, after the element
    // was inserted by the parser.
    //
    // Otherwise
    // Let adjusted insertion location be inside target, after its last child (if
    // any).
    //
    // 3. If the adjusted insertion location is inside a template element, let it
    // instead be inside the template element's template contents, after its last
    // child (if any).
    //
    // 4. Return the adjusted insertion location.
    fn get_appropriate_place_for_inserting_node(
        &mut self,
        override_target: Option<RcNode>,
    ) -> PResult<InsertionPosition> {
        // 1.
        let target = override_target.unwrap_or_else(|| {
            if let Some(last) = self.open_elements_stack.items.last() {
                last.clone()
            } else {
                // Unreachable, because we always have `html` element on top
                unreachable!();
            }
        });

        // 2.
        let mut adjusted_insertion_location = if self.foster_parenting_enabled
            && is_html_element!(target, "table" | "tbody" | "tfoot" | "thead" | "tr")
        {
            // 2.1
            let mut last_template = None;
            let mut last_template_index = 0;

            // 2.2
            let mut last_table = None;
            let mut last_table_index = 0;

            for (i, node) in self.open_elements_stack.items.iter().enumerate().rev() {
                if is_html_element!(node, "template") && last_template.is_none() {
                    last_template = Some(node);
                    last_template_index = i;

                    if last_table.is_some() {
                        break;
                    }
                } else if is_html_element!(node, "table") && last_table.is_none() {
                    last_table = Some(node);
                    last_table_index = i;

                    if last_template.is_some() {
                        break;
                    }
                }
            }

            // 2.3
            if (last_table.is_none()
                || (last_table.is_some() && last_template_index > last_table_index))
                && last_template.is_some()
            {
                let last_template = if let Some(last_template) = last_template {
                    last_template.clone()
                } else {
                    unreachable!();
                };

                InsertionPosition::LastChild(last_template)
            }
            // 2.4
            // Fragment case
            else if last_table.is_none() && !self.open_elements_stack.items.is_empty() {
                let first = if let Some(first) = self.open_elements_stack.items.first() {
                    first.clone()
                } else {
                    unreachable!();
                };

                InsertionPosition::LastChild(first)
            }
            // 2.5
            else if match last_table {
                Some(last_table) => {
                    let parent = last_table.parent.take();
                    let has_parent = parent.is_some();

                    last_table.parent.set(parent);

                    has_parent
                }
                _ => false,
            } {
                let sibling =
                    if let Some(sibling) = self.open_elements_stack.items.get(last_table_index) {
                        sibling.clone()
                    } else {
                        unreachable!()
                    };

                InsertionPosition::BeforeSibling(sibling)
            } else {
                // 2.6
                let previous_element = if let Some(previous_element) =
                    self.open_elements_stack.items.get(last_table_index - 1)
                {
                    previous_element.clone()
                } else {
                    unreachable!()
                };

                // 2.7
                InsertionPosition::LastChild(previous_element)
            }
        } else {
            InsertionPosition::LastChild(target)
        };

        // 3.
        adjusted_insertion_location = match &adjusted_insertion_location {
            InsertionPosition::LastChild(node) | InsertionPosition::BeforeSibling(node) => {
                match &node.data {
                    Data::Element {
                        namespace,
                        tag_name,
                        ..
                    } if tag_name == "template" && *namespace == Namespace::HTML => {
                        adjusted_insertion_location
                    }
                    _ => adjusted_insertion_location,
                }
            }
        };

        // 4.
        Ok(adjusted_insertion_location)
    }

    // Inserts a comment node in to the document while processing a comment token.
    fn insert_comment(&mut self, token_and_info: &mut TokenAndInfo) -> PResult<()> {
        // Let data be the data given in the comment token being processed.
        // If position was specified, then let the adjusted insertion location
        // be position. Otherwise, let adjusted insertion location be the
        // appropriate place for inserting a node.
        let adjusted_insertion_location = self.get_appropriate_place_for_inserting_node(None)?;

        // Create a Comment node whose data attribute is set to data and whose
        // node document is the same as that of the node in which the adjusted
        // insertion location finds itself.
        let (data, raw) = match &token_and_info.token {
            Token::Comment { data, raw } => (data.clone(), raw.clone()),
            _ => {
                unreachable!()
            }
        };

        let comment = Node::new(Data::Comment { data, raw }, token_and_info.span);

        // Insert the newly created node at the adjusted insertion location.
        self.insert_at_position(adjusted_insertion_location, comment);

        Ok(())
    }

    fn insert_comment_as_last_child_of_document(
        &mut self,
        token_and_info: &mut TokenAndInfo,
    ) -> PResult<()> {
        let (data, raw) = match &token_and_info.token {
            Token::Comment { data, raw } => (data.clone(), raw.clone()),
            _ => {
                unreachable!()
            }
        };

        let comment = Node::new(Data::Comment { data, raw }, token_and_info.span);

        if let Some(document) = &self.document {
            self.append_node(document, comment);
        }

        Ok(())
    }

    fn insert_comment_as_last_child_of_first_element(
        &mut self,
        token_and_info: &mut TokenAndInfo,
    ) -> PResult<()> {
        let (data, raw) = match &token_and_info.token {
            Token::Comment { data, raw } => (data.clone(), raw.clone()),
            _ => {
                unreachable!()
            }
        };

        let comment = Node::new(Data::Comment { data, raw }, token_and_info.span);

        if let Some(html) = &self.open_elements_stack.items.first() {
            self.append_node(html, comment);
        }

        Ok(())
    }

    // Inserts a sequence of characters in to a preexisting text node or creates
    // a new text node if one does not exist in the expected insertion location.
    fn insert_character(&mut self, token_and_info: &mut TokenAndInfo) -> PResult<()> {
        // Let data be the characters passed to the algorithm, or, if no
        // characters were explicitly specified, the character of the character
        // token being processed.

        // Let the adjusted insertion location be the appropriate place for
        // inserting a node.
        let adjusted_insertion_location = self.get_appropriate_place_for_inserting_node(None)?;

        // If the adjusted insertion location is in a Document node, then abort
        // these steps.
        // NOTE: The DOM will not let Document nodes have Text node children, so
        // they are dropped on the floor.
        // Note: we don't use document in stack elements, so we can't have Document here

        // If there is a Text node immediately before the adjusted insertion location,
        // then append data to that Text node's data. Otherwise, create
        // a new Text node whose data is data and whose node document is the
        // same as that of the element in which the adjusted insertion location
        // finds itself, and insert the newly created node at the adjusted
        // insertion location.
        match &adjusted_insertion_location {
            InsertionPosition::LastChild(parent) => {
                let children = parent.children.borrow();

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

                                if let Some(Raw::Same) = raw_c {
                                    raw_data.borrow_mut().push(*c);
                                } else if let Some(Raw::Atom(raw_c)) = raw_c {
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
            InsertionPosition::BeforeSibling(node) => {
                if let Some((parent, i)) = self.get_parent_and_index(node) {
                    if i > 0 {
                        let children = parent.children.borrow();

                        if let Some(previous) = children.get(i - 1) {
                            if let Data::Text {
                                data,
                                raw: raw_data,
                            } = &previous.data
                            {
                                match &token_and_info.token {
                                    Token::Character {
                                        value: c,
                                        raw: raw_c,
                                    } => {
                                        data.borrow_mut().push(*c);

                                        if let Some(Raw::Same) = raw_c {
                                            raw_data.borrow_mut().push(*c);
                                        } else if let Some(Raw::Atom(raw_c)) = raw_c {
                                            raw_data.borrow_mut().push_str(raw_c);
                                        }
                                    }
                                    _ => {
                                        unreachable!();
                                    }
                                }

                                let mut span = previous.end_span.borrow_mut();

                                *span = Some(token_and_info.span);

                                return Ok(());
                            }
                        }
                    }
                }
            }
        }

        // Otherwise, create a new Text node whose data is data and whose node document
        // is the same as that of the element in which the adjusted insertion location
        // finds itself, and insert the newly created node at the adjusted insertion
        // location.
        let (data, raw) = match &token_and_info.token {
            Token::Character {
                value: c,
                raw: raw_c,
            } => {
                let mut data = String::with_capacity(64);

                data.push(*c);

                let mut raw = String::with_capacity(64);

                if let Some(Raw::Same) = raw_c {
                    raw.push(*c);
                } else if let Some(Raw::Atom(raw_c)) = raw_c {
                    raw.push_str(raw_c);
                }

                (RefCell::new(data), RefCell::new(raw))
            }
            _ => {
                unreachable!()
            }
        };

        let text = Node::new(Data::Text { data, raw }, token_and_info.span);

        self.insert_at_position(adjusted_insertion_location, text);

        Ok(())
    }

    fn insert_html_element(&mut self, token_and_info: &TokenAndInfo) -> PResult<RcNode> {
        self.insert_foreign_element(token_and_info, Namespace::HTML, None)
    }

    fn insert_foreign_element(
        &mut self,
        token_and_info: &TokenAndInfo,
        namespace: Namespace,
        adjust_attributes: Option<AdjustAttributes>,
    ) -> PResult<RcNode> {
        // Let the adjusted insertion location be the appropriate place for
        // inserting a node.
        let adjusted_insertion_location = self.get_appropriate_place_for_inserting_node(None)?;

        // Create an element for the token in the given namespace, with the
        // intended parent being the element in which the adjusted insertion
        // location finds itself.
        let node = self.create_element_for_token(
            token_and_info.token.clone(),
            token_and_info.span,
            Some(namespace),
            adjust_attributes,
        );

        // If it is possible to insert an element at the adjusted insertion
        // location, then insert the newly created element at the adjusted
        // insertion location.
        // NOTE: If the adjusted insertion location cannot accept more
        // elements, e.g. because it's a Document that already has an
        // element child, then the newly created element is dropped on the
        // floor.
        self.insert_at_position(adjusted_insertion_location, node.clone());

        // Push the element onto the stack of open elements so that it is the
        // new current node.
        self.open_elements_stack.push(node.clone());

        // Return the newly created element.
        Ok(node)
    }

    fn append_node(&self, parent: &RcNode, child: RcNode) {
        let previous_parent = child.parent.replace(Some(Rc::downgrade(parent)));

        // Invariant: child cannot have existing parent
        assert!(previous_parent.is_none());

        parent.children.borrow_mut().push(child);
    }

    fn get_parent_and_index(&self, node: &RcNode) -> Option<(RcNode, usize)> {
        if let Some(weak) = node.parent.take() {
            let parent = weak.upgrade().expect("dangling weak pointer");

            node.parent.set(Some(weak));

            let i = match parent
                .children
                .borrow()
                .iter()
                .enumerate()
                .find(|&(_, child)| is_same_node(child, node))
            {
                Some((i, _)) => i,
                None => {
                    // Unreachable, otherwise node has a parent but couldn't found in parent's
                    // children
                    unreachable!();
                }
            };
            Some((parent, i))
        } else {
            None
        }
    }

    fn append_node_before_sibling(&self, parent: &RcNode, child: RcNode) {
        let (parent, i) = self
            .get_parent_and_index(parent)
            .expect("append_node_before_sibling called on node without parent");

        if let Some((parent, i)) = self.get_parent_and_index(&child) {
            parent.children.borrow_mut().remove(i);

            child.parent.set(None);
        }

        child.parent.set(Some(Rc::downgrade(&parent)));
        parent.children.borrow_mut().insert(i, child);
    }

    fn insert_at_position(&mut self, insertion_point: InsertionPosition, node: RcNode) {
        match insertion_point {
            InsertionPosition::LastChild(parent) => {
                self.append_node(&parent, node);
            }
            InsertionPosition::BeforeSibling(sibling) => {
                self.append_node_before_sibling(&sibling, node)
            }
        }
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

fn is_same_node(a: &RcNode, b: &RcNode) -> bool {
    Rc::ptr_eq(a, b)
}

// The HTML namespace is "http://www.w3.org/1999/xhtml".
fn is_element_in_html_namespace(node: Option<&RcNode>) -> bool {
    if let Some(node) = node {
        match &node.data {
            Data::Element { namespace, .. } if *namespace == Namespace::HTML => {
                return true;
            }
            _ => {
                return false;
            }
        }
    }

    false
}

// A node is a MathML text integration point if it is one of the following
// elements:
//
// A MathML mi element
// A MathML mo element
// A MathML mn element
// A MathML ms element
// A MathML mtext element
fn is_mathml_text_integration_point(node: Option<&RcNode>) -> bool {
    if let Some(node) = node {
        match &node.data {
            Data::Element {
                namespace,
                tag_name,
                ..
            } if *namespace == Namespace::MATHML
                && matches!(&**tag_name, "mi" | "mo" | "mn" | "ms" | "mtext") =>
            {
                return true;
            }
            _ => {
                return false;
            }
        }
    }

    false
}

fn is_mathml_annotation_xml(node: Option<&RcNode>) -> bool {
    if let Some(node) = node {
        match &node.data {
            Data::Element {
                namespace,
                tag_name,
                ..
            } if *namespace == Namespace::MATHML && tag_name == "annotation-xml" => {
                return true;
            }
            _ => {
                return false;
            }
        }
    }

    false
}

// A node is an HTML integration point if it is one of the following elements:
//
// A MathML annotation-xml element whose start tag token had an attribute with
// the name "encoding" whose value was an ASCII case-insensitive match for the
// string "text/html" A MathML annotation-xml element whose start tag token
// had an attribute with the name "encoding" whose value was an ASCII
// case-insensitive match for the string "application/xhtml+xml"
// An SVG foreignObject element
// An SVG desc element
// An SVG title element
fn is_html_integration_point(node: Option<&RcNode>) -> bool {
    if let Some(node) = node {
        match &node.data {
            Data::Element {
                namespace,
                tag_name,
                attributes,
                ..
            } if *namespace == Namespace::MATHML && tag_name == "annotation-xml" => {
                for attribute in &*attributes.borrow() {
                    if &*attribute.name == "encoding"
                        && (attribute.value.is_some()
                            && matches!(
                                &*attribute.value.as_ref().unwrap().to_ascii_lowercase(),
                                "text/html" | "application/xhtml+xml"
                            ))
                    {
                        return true;
                    }
                }

                return false;
            }
            Data::Element {
                namespace,
                tag_name,
                ..
            } if *namespace == Namespace::SVG
                && matches!(&**tag_name, "foreignObject" | "desc" | "title") =>
            {
                return true;
            }
            _ => {
                return false;
            }
        }
    }

    false
}
