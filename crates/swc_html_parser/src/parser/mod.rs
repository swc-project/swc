use std::{
    cell::{Cell, RefCell},
    mem,
    mem::take,
    rc::{Rc, Weak},
};

use swc_atoms::JsWord;
use swc_common::{EqIgnoreSpan, Span};
use swc_html_ast::*;

use self::input::{Buffer, ParserInput};
use crate::{
    error::{Error, ErrorKind},
    lexer::State,
    Parse,
};

#[macro_use]
mod macros;
pub mod input;

pub type PResult<T> = Result<T, Error>;

#[derive(Debug, Clone, Copy, Default, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct ParserConfig {
    pub scripting_enabled: bool,
}

#[derive(Debug, Clone)]
struct TokenAndInfo {
    pub span: Span,
    pub acknowledged: bool,
    pub token: Token,
}

#[derive(Debug, Clone)]
enum InsertionMode {
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

impl Default for InsertionMode {
    fn default() -> Self {
        InsertionMode::Initial
    }
}

type Data = Child;

struct Node {
    pub parent: Cell<Option<WeakNode>>,
    pub children: RefCell<Vec<RcNode>>,
    pub data: Data,
}

impl Node {
    /// Create a new node from its contents
    pub fn new(data: Data) -> Rc<Self> {
        Rc::new(Node {
            parent: Cell::new(None),
            children: RefCell::new(Vec::new()),
            data,
        })
    }
}

impl Drop for Node {
    fn drop(&mut self) {
        let mut nodes = mem::take(&mut *self.children.borrow_mut());

        while let Some(node) = nodes.pop() {
            let children = mem::take(&mut *node.children.borrow_mut());

            nodes.extend(children.into_iter());

            // TODO fix me
            // if let Element { ref children, .. } = node.data {
            //     if let Some(template_contents) = children.borrow_mut().take()
            //     {     nodes.push(template_contents);
            //     }
            // }
        }
    }
}

type RcNode = Rc<Node>;
type WeakNode = Weak<Node>;

#[allow(dead_code)]
enum InsertionPosition {
    LastChild(RcNode),
    BeforeSibling(RcNode),
    TableFosterParenting {
        element: RcNode,
        prev_element: RcNode,
    },
}

#[allow(dead_code)]
static LIMITED_QUIRKY_PUBLIC_PREFIXES: &[&str] = &[
    "-//w3c//dtd xhtml 1.0 frameset//",
    "-//w3c//dtd xhtml 1.0 transitional//",
];

#[allow(dead_code)]
static HTML4_PUBLIC_PREFIXES: &[&str] = &[
    "-//w3c//dtd html 4.01 frameset//",
    "-//w3c//dtd html 4.01 transitional//",
];

#[allow(dead_code)]
static QUIRKY_PUBLIC_PREFIXES: &[&str] = &[
    "-//advasoft ltd//dtd html 3.0 aswedit + extensions//",
    "-//as//dtd html 3.0 aswedit + extensions//",
    "-//ietf//dtd html 2.0 level 1//",
    "-//ietf//dtd html 2.0 level 2//",
    "-//ietf//dtd html 2.0 strict level 1//",
    "-//ietf//dtd html 2.0 strict level 2//",
    "-//ietf//dtd html 2.0 strict//",
    "-//ietf//dtd html 2.0//",
    "-//ietf//dtd html 2.1e//",
    "-//ietf//dtd html 3.0//",
    "-//ietf//dtd html 3.2 final//",
    "-//ietf//dtd html 3.2//",
    "-//ietf//dtd html 3//",
    "-//ietf//dtd html level 0//",
    "-//ietf//dtd html level 1//",
    "-//ietf//dtd html level 2//",
    "-//ietf//dtd html level 3//",
    "-//ietf//dtd html strict level 0//",
    "-//ietf//dtd html strict level 1//",
    "-//ietf//dtd html strict level 2//",
    "-//ietf//dtd html strict level 3//",
    "-//ietf//dtd html strict//",
    "-//ietf//dtd html//",
    "-//metrius//dtd metrius presentational//",
    "-//microsoft//dtd internet explorer 2.0 html strict//",
    "-//microsoft//dtd internet explorer 2.0 html//",
    "-//microsoft//dtd internet explorer 2.0 tables//",
    "-//microsoft//dtd internet explorer 3.0 html strict//",
    "-//microsoft//dtd internet explorer 3.0 html//",
    "-//microsoft//dtd internet explorer 3.0 tables//",
    "-//netscape comm. corp.//dtd html//",
    "-//netscape comm. corp.//dtd strict html//",
    "-//o'reilly and associates//dtd html 2.0//",
    "-//o'reilly and associates//dtd html extended 1.0//",
    "-//o'reilly and associates//dtd html extended relaxed 1.0//",
    "-//softquad software//dtd hotmetal pro 6.0::19990601::extensions to html 4.0//",
    "-//softquad//dtd hotmetal pro 4.0::19971010::extensions to html 4.0//",
    "-//spyglass//dtd html 2.0 extended//",
    "-//sq//dtd html 2.0 hotmetal + extensions//",
    "-//sun microsystems corp.//dtd hotjava html//",
    "-//sun microsystems corp.//dtd hotjava strict html//",
    "-//w3c//dtd html 3 1995-03-24//",
    "-//w3c//dtd html 3.2 draft//",
    "-//w3c//dtd html 3.2 final//",
    "-//w3c//dtd html 3.2//",
    "-//w3c//dtd html 3.2s draft//",
    "-//w3c//dtd html 4.0 frameset//",
    "-//w3c//dtd html 4.0 transitional//",
    "-//w3c//dtd html experimental 19960712//",
    "-//w3c//dtd html experimental 970421//",
    "-//w3c//dtd w3 html//",
    "-//w3o//dtd w3 html 3.0//",
    "-//webtechs//dtd mozilla html 2.0//",
    "-//webtechs//dtd mozilla html//",
];

#[allow(dead_code)]
static QUIRKY_PUBLIC_MATCHES: &[&str] = &[
    "-//w3o//dtd w3 html strict 3.0//en//",
    "-/w3c/dtd html 4.0 transitional/en",
    "html",
];

#[allow(dead_code)]
static QUIRKY_SYSTEM_MATCHES: &[&str] =
    &["http://www.ibm.com/data/dtd/v11/ibmxhtml1-transitional.dtd"];

static IMPLICIT_END_TAG_REQUIRED: &[&str] = &[
    "dd", "dt", "li", "optgroup", "option", "p", "rb", "rp", "rt", "rtc",
];

static IMPLICIT_END_TAG_REQUIRED_THOROUGHLY: &[&str] = &[
    "caption", "colgroup", "dd", "dt", "li", "optgroup", "option", "p", "rb", "rp", "rt", "rtc",
    "tbody", "td", "tfoot", "th", "thead", "tr",
];

static SPECIFIC_SCOPE: &[(&str, Namespace)] = &[
    ("applet", Namespace::HTML),
    ("caption", Namespace::HTML),
    ("html", Namespace::HTML),
    ("marquee", Namespace::HTML),
    ("object", Namespace::HTML),
    ("table", Namespace::HTML),
    ("td", Namespace::HTML),
    ("template", Namespace::HTML),
    ("th", Namespace::HTML),
    ("annotation-xml", Namespace::MATHML),
    ("mi", Namespace::MATHML),
    ("mn", Namespace::MATHML),
    ("mo", Namespace::MATHML),
    ("ms", Namespace::MATHML),
    ("mtext", Namespace::MATHML),
    ("desc", Namespace::SVG),
    ("foreignObject", Namespace::SVG),
    ("title", Namespace::SVG),
];

static LIST_ITEM_SCOPE: &[(&str, Namespace)] = &[
    ("applet", Namespace::HTML),
    ("caption", Namespace::HTML),
    ("html", Namespace::HTML),
    ("marquee", Namespace::HTML),
    ("object", Namespace::HTML),
    ("table", Namespace::HTML),
    ("td", Namespace::HTML),
    ("template", Namespace::HTML),
    ("th", Namespace::HTML),
    ("annotation-xml", Namespace::MATHML),
    ("mi", Namespace::MATHML),
    ("mn", Namespace::MATHML),
    ("mo", Namespace::MATHML),
    ("ms", Namespace::MATHML),
    ("mtext", Namespace::MATHML),
    ("desc", Namespace::SVG),
    ("foreignObject", Namespace::SVG),
    ("title", Namespace::SVG),
    ("ol", Namespace::HTML),
    ("ul", Namespace::HTML),
];

static BUTTON_SCOPE: &[(&str, Namespace)] = &[
    ("applet", Namespace::HTML),
    ("caption", Namespace::HTML),
    ("html", Namespace::HTML),
    ("marquee", Namespace::HTML),
    ("object", Namespace::HTML),
    ("table", Namespace::HTML),
    ("td", Namespace::HTML),
    ("template", Namespace::HTML),
    ("th", Namespace::HTML),
    ("annotation-xml", Namespace::MATHML),
    ("mi", Namespace::MATHML),
    ("mn", Namespace::MATHML),
    ("mo", Namespace::MATHML),
    ("ms", Namespace::MATHML),
    ("mtext", Namespace::MATHML),
    ("desc", Namespace::SVG),
    ("foreignObject", Namespace::SVG),
    ("title", Namespace::SVG),
    ("button", Namespace::HTML),
];

static TABLE_SCOPE: &[(&str, Namespace)] = &[
    ("html", Namespace::HTML),
    ("table", Namespace::HTML),
    ("template", Namespace::HTML),
];

static SELECT_SCOPE: &[(&str, Namespace)] =
    &[("optgroup", Namespace::HTML), ("option", Namespace::HTML)];

struct OpenElementsStack {
    items: Vec<RcNode>,
    template_element_count: usize,
}

impl OpenElementsStack {
    pub fn new() -> Self {
        OpenElementsStack {
            items: vec![],
            template_element_count: 0,
        }
    }

    pub fn push(&mut self, node: RcNode) {
        if get_tag_name!(node) == "template" {
            self.template_element_count += 1;
        }

        self.items.push(node);
    }

    pub fn pop(&mut self) -> Option<RcNode> {
        let popped = self.items.pop();

        if let Some(node) = &popped {
            if get_tag_name!(node) == "template" {
                self.template_element_count -= 1;
            }
        }

        popped
    }

    pub fn remove(&mut self, node: &RcNode) {
        let position = self.items.iter().rposition(|x| is_same_node(node, x));

        if let Some(position) = position {
            if get_tag_name!(node) == "template" {
                self.template_element_count -= 1;
            }

            self.items.remove(position);
            self.pop();
        }
    }

    pub fn contains_template_element(&mut self) -> bool {
        self.template_element_count > 0
    }

    // The stack of open elements is said to have an element target node in a
    // specific scope consisting of a list of element types list when the following
    // algorithm terminates in a match state:
    fn has_element_target_node_in_specific_scope(
        &self,
        tag_name: &str,
        list: &[(&str, Namespace)],
    ) -> bool {
        let mut iter = self.items.iter().rev();
        // 1. Initialize node to be the current node (the bottommost node of the stack).
        let mut node = iter.next();

        while let Some(inner_node) = node {
            // 2. If node is the target node, terminate in a match state.
            if get_tag_name!(inner_node) == tag_name
                && get_namespace!(inner_node) == Namespace::HTML
            {
                return true;
            }

            // 3. Otherwise, if node is one of the element types in list, terminate in a
            // failure state.
            for element_and_ns in list {
                if get_tag_name!(inner_node) == element_and_ns.0
                    && get_namespace!(inner_node) == element_and_ns.1
                {
                    return false;
                }
            }

            // 4. Otherwise, set node to the previous entry in the stack of open elements
            // and return to step 2. (This will never fail, since the loop will always
            // terminate in the previous step if the top of the stack — an html element — is
            // reached.)
            node = iter.next();
        }

        false
    }

    // The stack of open elements is said to have a particular element in scope when
    // it has that element in the specific scope consisting of the following element
    // types:
    //
    // applet
    // caption
    // html
    // table
    // td
    // th
    // marquee
    // object
    // template
    // MathML mi
    // MathML mo
    // MathML mn
    // MathML ms
    // MathML mtext
    // MathML annotation-xml
    // SVG foreignObject
    // SVG desc
    // SVG title
    pub fn has_in_scope(&self, tag_name: &str) -> bool {
        self.has_element_target_node_in_specific_scope(tag_name, SPECIFIC_SCOPE)
    }

    // The stack of open elements is said to have a particular element in list item
    // scope when it has that element in the specific scope consisting of the
    // following element types:
    //
    // All the element types listed above for the has an element in scope algorithm.
    // ol in the HTML namespace
    // ul in the HTML namespace
    pub fn has_in_list_item_scope(&self, tag_name: &str) -> bool {
        self.has_element_target_node_in_specific_scope(tag_name, LIST_ITEM_SCOPE)
    }

    // The stack of open elements is said to have a particular element in button
    // scope when it has that element in the specific scope consisting of the
    // following element types:
    //
    // All the element types listed above for the has an element in scope algorithm.
    // button in the HTML namespace
    pub fn has_in_button_scope(&self, tag_name: &str) -> bool {
        self.has_element_target_node_in_specific_scope(tag_name, BUTTON_SCOPE)
    }

    // The stack of open elements is said to have a particular element in table
    // scope when it has that element in the specific scope consisting of the
    // following element types:
    //
    // html in the HTML namespace
    // table in the HTML namespace
    // template in the HTML namespace
    pub fn has_in_table_scope(&self, tag_name: &str) -> bool {
        self.has_element_target_node_in_specific_scope(tag_name, TABLE_SCOPE)
    }

    // The stack of open elements is said to have a particular element in select
    // scope when it has that element in the specific scope consisting of all
    // element types except the following:
    //
    // optgroup in the HTML namespace
    // option in the HTML namespace
    pub fn has_in_select_scope(&self, tag_name: &str) -> bool {
        self.has_element_target_node_in_specific_scope(tag_name, SELECT_SCOPE)
    }

    // When the steps above require the UA to clear the stack back to a table
    // context, it means that the UA must, while the current node is not a table,
    // template, or html element, pop elements from the stack of open elements.
    pub fn clear_back_to_table_context(&mut self) {
        while let Some(node) = self.items.last() {
            if !matches!(get_tag_name!(node), "table" | "template" | "html") {
                self.pop();
            } else {
                break;
            }
        }
    }

    // When the steps above require the UA to clear the stack back to a table row
    // context, it means that the UA must, while the current node is not a tr,
    // template, or html element, pop elements from the stack of open elements.
    pub fn clear_back_to_table_row_context(&mut self) {
        while let Some(node) = self.items.last() {
            if !matches!(get_tag_name!(node), "tr" | "template" | "html") {
                self.pop();
            } else {
                break;
            }
        }
    }

    // When the steps above require the UA to clear the stack back to a table body
    // context, it means that the UA must, while the current node is not a tbody,
    // tfoot, thead, template, or html element, pop elements from the stack of open
    // elements.
    pub fn clear_back_to_table_body_context(&mut self) {
        while let Some(node) = self.items.last() {
            if !matches!(
                get_tag_name!(node),
                "thead" | "tfoot" | "tbody" | "template" | "html"
            ) {
                self.pop();
            } else {
                break;
            }
        }
    }

    // When the steps below require the UA to generate implied end tags, then, while
    // the current node is a dd element, a dt element, an li element, an optgroup
    // element, an option element, a p element, an rb element, an rp element, an rt
    // element, or an rtc element, the UA must pop the current node off the stack of
    // open elements.
    //
    // If a step requires the UA to generate implied end tags but lists an element
    // to exclude from the process, then the UA must perform the above steps as if
    // that element was not in the above list.
    pub fn generate_implied_end_tags(&mut self) {
        while let Some(node) = self.items.last() {
            if IMPLICIT_END_TAG_REQUIRED.contains(&get_tag_name!(node)) {
                self.pop();
            } else {
                break;
            }
        }
    }

    pub fn generate_implied_end_tags_with_exclusion(&mut self, tag_name: &str) {
        while let Some(node) = self.items.last() {
            // TODO fix me
            if get_tag_name!(node) == tag_name {
                break;
            }

            if IMPLICIT_END_TAG_REQUIRED.contains(&get_tag_name!(node)) {
                self.pop();
            } else {
                break;
            }
        }
    }

    // When the steps below require the UA to generate all implied end tags
    // thoroughly, then, while the current node is a caption element, a colgroup
    // element, a dd element, a dt element, an li element, an optgroup element, an
    // option element, a p element, an rb element, an rp element, an rt element, an
    // rtc element, a tbody element, a td element, a tfoot element, a th element, a
    // thead element, or a tr element, the UA must pop the current node off the
    // stack of open elements.
    pub fn generate_implied_end_tags_thoroughly(&mut self) {
        while let Some(node) = self.items.last() {
            if IMPLICIT_END_TAG_REQUIRED_THOROUGHLY.contains(&get_tag_name!(node)) {
                self.pop();
            } else {
                break;
            }
        }
    }

    pub fn pop_until_tag_name_popped(&mut self, tag_name: &[&str]) {
        while let Some(node) = self.items.pop() {
            if tag_name.contains(&get_tag_name!(node)) && get_namespace!(node) == Namespace::HTML {
                break;
            }
        }
    }
}

struct ActiveFormattingElementStack {
    items: Vec<RcNode>,
}

impl ActiveFormattingElementStack {
    pub fn new() -> Self {
        ActiveFormattingElementStack { items: vec![] }
    }

    pub fn push(&mut self, node: RcNode) {
        self.items.push(node);
    }

    pub fn insert_marker(&mut self) {}

    pub fn clear_to_last_marker(&mut self) {}
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
            insertion_mode: Default::default(),
            original_insertion_mode: Default::default(),
            template_insertion_mode_stack: vec![],
            document: None,
            head_element_pointer: None,
            form_element_pointer: None,
            open_elements_stack: OpenElementsStack::new(),
            active_formatting_elements: ActiveFormattingElementStack::new(),
            pending_character_tokens: vec![],
            frameset_ok: true,
            foster_parenting_enabled: false,
            errors: Default::default(),
        }
    }

    pub fn dump_cur(&mut self) -> String {
        format!("{:?}", self.input.cur())
    }

    /// Take **recovered** errors.
    pub fn take_errors(&mut self) -> Vec<Error> {
        take(&mut self.errors)
    }

    // TODO parse_fragment
    pub fn parse_document(&mut self) -> PResult<Document> {
        let start = self.input.cur_span()?;

        // TODO fix me
        self.document = Some(Node::new(Data::Element(Element {
            span: Default::default(),
            // mode: DocumentMode::NoQuirks,
            tag_name: "html".into(),
            namespace: Namespace::HTML,
            attributes: vec![],
            children: vec![],
        })));

        while !self.stopped {
            let span = self.input.cur_span()?;
            let token = match self.input.cur()? {
                Some(_) => {
                    bump!(self)
                }
                _ => Token::Eof,
            };
            let mut token_and_info = TokenAndInfo {
                span: span!(self, span.lo),
                acknowledged: false,
                token,
            };

            self.tree_construction_dispatcher(&mut token_and_info)?;

            // TODO more errors and check me
            // When a start tag token is emitted with its self-closing flag set,
            // if the flag is not acknowledged when it is processed by the tree
            // construction stage, that is a parse error.
            if let Token::StartTag { .. } = &token_and_info.token {
                if !token_and_info.acknowledged {
                    self.errors.push(Error::new(
                        token_and_info.span,
                        ErrorKind::NonConformingDoctype,
                    ));
                }
            }
        }

        let last = self.input.last_pos()?;

        // TODO optimize me
        fn extract(node: &mut RcNode) -> Child {
            match &node.data {
                Child::DocumentType(document_type) => {
                    let DocumentType {
                        span,
                        name,
                        public_id,
                        system_id,
                    } = document_type;

                    Child::DocumentType(DocumentType {
                        span: *span,
                        name: name.clone(),
                        public_id: public_id.clone(),
                        system_id: system_id.clone(),
                    })
                }
                Child::Element(element) => {
                    let Element {
                        span,
                        tag_name,
                        namespace,
                        attributes,
                        ..
                    } = element;

                    let mut new_children = vec![];

                    for node in &mut node.children.borrow_mut().iter_mut() {
                        new_children.push(extract(node));
                    }

                    Child::Element(Element {
                        span: *span,
                        tag_name: tag_name.clone(),
                        namespace: *namespace,
                        attributes: attributes.clone(),
                        children: new_children,
                    })
                }
                Child::Text(text) => {
                    let Text { span, value } = text;

                    Child::Text(Text {
                        span: *span,
                        value: value.clone(),
                    })
                }
                Child::Comment(comment) => {
                    let Comment { span, data } = comment;

                    Child::Comment(Comment {
                        span: *span,
                        data: data.clone(),
                    })
                }
            }
        }

        let mut document = Document {
            span: Default::default(),
            mode: DocumentMode::Quirks,
            children: vec![],
        };

        for node in &mut self
            .document
            .as_ref()
            .unwrap()
            .children
            .borrow_mut()
            .iter_mut()
        {
            document.children.push(extract(node));
        }

        document.span = Span::new(start.lo, last, Default::default());

        Ok(document)
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
        // to the current insertion mode in HTML content. TODO
        if false {
            todo!()
        }
        // Otherwise
        // Process the token according to the rules given in the section for parsing tokens in
        // foreign content.
        else {
            self.process_token(token_and_info, None)?
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
                    Token::Character { value, .. }
                        if matches!(value, '\x09' | '\x0A' | '\x0C' | '\x0D' | '\x20') =>
                    {
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
                    // Then, switch the insertion mode to "before html".
                    Token::Doctype {
                        name,
                        public_id,
                        system_id,
                        ..
                    } => {
                        let is_html = matches!(name, Some(name) if name.as_ref().eq_ignore_ascii_case("html"));
                        let is_legacy_compat = match system_id {
                            Some(name)
                                if name.as_ref().eq_ignore_ascii_case("about:legacy-compat") =>
                            {
                                true
                            }
                            _ => false,
                        };

                        if !is_html
                            || public_id.is_some()
                            || (system_id.is_some() || !is_legacy_compat)
                        {
                            self.errors.push(Error::new(
                                token_and_info.span,
                                ErrorKind::NonConformingDoctype,
                            ));
                        }

                        let document_type = Node::new(Child::DocumentType(DocumentType {
                            span: span!(self, token_and_info.span.lo),
                            name: name.clone(),
                            public_id: public_id.clone(),
                            system_id: system_id.clone(),
                        }));

                        // Never be `None`
                        if let Some(document) = &self.document {
                            self.append_node(document, document_type);
                        }

                        // TODO handle - an iframe srcdoc document

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
                        // TODO fix me for `srcdoc`
                        // if self.document.is_iframe_srcdoc() {
                        //     self.errors
                        //         .push(Error::new(token_and_info.span,
                        // ErrorKind::UnexpectedToken));
                        //
                        //     self.document.mode = DocumentMode::Quirks;
                        // }

                        self.insertion_mode = InsertionMode::BeforeHtml;
                        self.process_token(token_and_info, None)?;
                    }
                }
            }
            // The "before html" insertion mode
            InsertionMode::BeforeHtml => {
                // When the user agent is to apply the rules for the "before html" insertion
                // mode, the user agent must handle the token as follows:
                match token {
                    // A DOCTYPE token
                    //
                    // Parse error. Ignore the token.
                    Token::Doctype { .. } => {
                        self.errors
                            .push(Error::new(token_and_info.span, ErrorKind::MisplacedDoctype));
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
                    Token::Character { value, .. }
                        if matches!(value, '\x09' | '\x0A' | '\x0C' | '\x0D' | '\x20') =>
                    {
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
                        ..
                    } if tag_name == "html" => {
                        let element = create_node_for_element(Element {
                            span: span!(self, token_and_info.span.lo),
                            tag_name: tag_name.into(),
                            namespace: Namespace::HTML,
                            children: vec![],
                            attributes: attributes
                                .iter()
                                .map(|attribute| Attribute {
                                    span: Default::default(),
                                    name: attribute.name.clone(),
                                    value: attribute.value.clone(),
                                })
                                .collect(),
                        });

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
                        if matches!(tag_name.as_ref(), "head" | "body" | "html" | "br") =>
                    {
                        let element = self.create_fake_html_element();

                        self.open_elements_stack.push(element.clone());

                        // Never be `None`
                        if let Some(document) = &self.document {
                            self.append_node(document, element);
                        }

                        self.insertion_mode = InsertionMode::BeforeHead;
                        self.process_token(token_and_info, None)?;
                    }
                    // Any other end tag
                    //
                    // Parse error. Ignore the token.
                    Token::EndTag { .. } => {
                        self.errors.push(Error::new(
                            token_and_info.span,
                            ErrorKind::EndTagWithoutMatchingOpenElement,
                        ));
                    }
                    // Anything else
                    //
                    // Create an html element whose node document is the Document object. Append it
                    // to the Document object. Put this element in the stack of open elements.
                    //
                    // Switch the insertion mode to "before head", then reprocess the token.
                    _ => {
                        let element = self.create_fake_html_element();

                        self.open_elements_stack.push(element.clone());

                        // Never be `None`
                        if let Some(document) = &self.document {
                            self.append_node(document, element);
                        }

                        self.insertion_mode = InsertionMode::BeforeHead;
                        self.process_token(token_and_info, None)?;
                    }
                }

                // The document element can end up being removed from the
                // Document object, e.g. by scripts; nothing in particular
                // happens in such cases, content continues being appended to
                // the nodes as described in the next section.
            }
            // The "before head" insertion mode
            InsertionMode::BeforeHead => {
                // When the user agent is to apply the rules for the "before head" insertion
                // mode, the user agent must handle the token as follows:
                match token {
                    // A character token that is one of U+0009 CHARACTER TABULATION, U+000A LINE
                    // FEED (LF), U+000C FORM FEED (FF), U+000D CARRIAGE RETURN (CR), or U+0020
                    // SPACE
                    //
                    // Ignore the token.
                    Token::Character { value, .. }
                        if matches!(value, '\x09' | '\x0A' | '\x0C' | '\x0D' | '\x20') =>
                    {
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
                            .push(Error::new(token_and_info.span, ErrorKind::MisplacedDoctype));
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
                        if matches!(tag_name.as_ref(), "head" | "body" | "html" | "br") =>
                    {
                        let element = self.insert_html_element(&mut TokenAndInfo {
                            span: Default::default(),
                            acknowledged: false,
                            token: Token::StartTag {
                                tag_name: "head".into(),
                                raw_tag_name: Some("head".into()),
                                self_closing: false,
                                attributes: vec![],
                            },
                        })?;

                        self.head_element_pointer = Some(element);
                        self.insertion_mode = InsertionMode::InHead;
                        self.process_token(token_and_info, None)?;
                    }
                    // Any other end tag
                    //
                    // Parse error. Ignore the token.
                    Token::EndTag { .. } => {
                        self.errors.push(Error::new(
                            token_and_info.span,
                            ErrorKind::EndTagWithoutMatchingOpenElement,
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
                        let element = self.insert_html_element(&mut TokenAndInfo {
                            span: Default::default(),
                            acknowledged: false,
                            token: Token::StartTag {
                                tag_name: "head".into(),
                                raw_tag_name: Some("head".into()),
                                self_closing: false,
                                attributes: vec![],
                            },
                        })?;

                        self.head_element_pointer = Some(element);
                        self.insertion_mode = InsertionMode::InHead;
                        self.process_token(token_and_info, None)?;
                    }
                }
            }
            // The "in head" insertion mode
            InsertionMode::InHead => {
                // When the user agent is to apply the rules for the "in head" insertion mode,
                // the user agent must handle the token as follows:
                match token {
                    // A character token that is one of U+0009 CHARACTER TABULATION, U+000A LINE
                    // FEED (LF), U+000C FORM FEED (FF), U+000D CARRIAGE RETURN (CR), or U+0020
                    // SPACE
                    //
                    // Insert the character.
                    Token::Character { value, .. }
                        if matches!(value, '\x09' | '\x0A' | '\x0C' | '\x0D' | '\x20') =>
                    {
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
                            .push(Error::new(token_and_info.span, ErrorKind::MisplacedDoctype));
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
                        self_closing,
                        ..
                    } if matches!(tag_name.as_ref(), "base" | "basefont" | "bgsound" | "link") => {
                        let is_self_closing = *self_closing;

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
                        self_closing,
                        ..
                    } if tag_name == "meta" => {
                        let is_self_closing = *self_closing;

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
                        if matches!(tag_name.as_ref(), "noframes" | "style") =>
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
                    Token::StartTag { tag_name, .. } if tag_name == "script" => {
                        let last_pos = self.input.last_pos()?;
                        let adjusted_insertion_location =
                            self.get_appropriate_place_for_inserting_node(None);
                        let node = create_node_for_element(create_element_for_token(
                            token_and_info.token.clone(),
                            Span::new(token_and_info.span.lo, last_pos, Default::default()),
                            Some(Namespace::HTML),
                        )?);

                        // Skip script handling

                        self.insert_at_position(adjusted_insertion_location, node.clone());
                        self.open_elements_stack.push(node);
                        self.input.set_input_state(State::ScriptData);
                        self.original_insertion_mode = self.insertion_mode.clone();
                        self.insertion_mode = InsertionMode::Text;
                    }
                    // An end tag whose tag name is "head"
                    //
                    // Pop the current node (which will be the head element) off the stack of open
                    // elements.
                    //
                    // Switch the insertion mode to "after head".
                    Token::EndTag { tag_name, .. } if tag_name == "head" => {
                        self.open_elements_stack.pop();
                        self.insertion_mode = InsertionMode::AfterHead;
                    }
                    // An end tag whose tag name is one of: "body", "html", "br"
                    //
                    // Act as described in the "anything else" entry below.
                    Token::EndTag { tag_name, .. }
                        if matches!(tag_name.as_ref(), "body" | "html" | "br") =>
                    {
                        self.open_elements_stack.pop();
                        self.insertion_mode = InsertionMode::AfterHead;
                        self.process_token(token_and_info, None)?;
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
                    Token::StartTag { tag_name, .. } if tag_name == "template" => {
                        self.insert_html_element(token_and_info)?;
                        self.active_formatting_elements.insert_marker();
                        self.frameset_ok = false;
                        self.insertion_mode = InsertionMode::InTemplate;
                        self.template_insertion_mode_stack
                            .push(InsertionMode::InTemplate);
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
                            self.errors
                                .push(Error::new(token_and_info.span, ErrorKind::UnexpectedToken));
                        } else {
                            self.open_elements_stack
                                .generate_implied_end_tags_thoroughly();

                            match self.open_elements_stack.items.last() {
                                Some(node) if get_tag_name!(node) != "template" => {
                                    self.errors.push(Error::new(
                                        token_and_info.span,
                                        ErrorKind::UnexpectedToken,
                                    ));
                                }
                                _ => {}
                            }

                            self.open_elements_stack
                                .pop_until_tag_name_popped(&["template"]);
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
                        self.errors
                            .push(Error::new(token_and_info.span, ErrorKind::UnexpectedToken));
                    }
                    Token::EndTag { .. } => {
                        self.errors
                            .push(Error::new(token_and_info.span, ErrorKind::UnexpectedToken));
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
                        self.open_elements_stack.pop();
                        self.insertion_mode = InsertionMode::AfterHead;
                        self.process_token(token_and_info, None)?;
                    }
                }
            }
            // The "in head noscript" insertion mode
            InsertionMode::InHeadNoScript => {
                // When the user agent is to apply the rules for the "in head noscript"
                // insertion mode, the user agent must handle the token as follows:
                match token {
                    // A DOCTYPE token
                    //
                    // Parse error. Ignore the token.
                    Token::Doctype { .. } => {
                        self.errors
                            .push(Error::new(token_and_info.span, ErrorKind::MisplacedDoctype));
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
                        self.open_elements_stack.pop();
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
                    Token::Character { value, .. }
                        if matches!(value, '\x09' | '\x0A' | '\x0C' | '\x0D' | '\x20') =>
                    {
                        self.process_token_using_rules(token_and_info, InsertionMode::InHead)?;
                    }
                    Token::Comment { .. } => {
                        self.process_token_using_rules(token_and_info, InsertionMode::InHead)?;
                    }
                    Token::StartTag { tag_name, .. }
                        if matches!(
                            tag_name.as_ref(),
                            "basefont" | "bgsound" | "link" | "meta" | "noframes" | "style"
                        ) =>
                    {
                        self.process_token_using_rules(token_and_info, InsertionMode::InHead)?;
                    }
                    // An end tag whose tag name is "br"
                    //
                    // Act as described in the "anything else" entry below.
                    Token::EndTag { tag_name, .. } if tag_name == "br" => {
                        self.errors
                            .push(Error::new(token_and_info.span, ErrorKind::UnexpectedToken));
                        self.open_elements_stack.pop();
                        self.insertion_mode = InsertionMode::InHead;
                        self.process_token(token_and_info, None)?;
                    }
                    // A start tag whose tag name is one of: "head", "noscript"
                    //
                    // Any other end tag
                    //
                    // Parse error. Ignore the token.
                    Token::StartTag { tag_name, .. }
                        if matches!(tag_name.as_ref(), "head" | "noscript") =>
                    {
                        self.errors
                            .push(Error::new(token_and_info.span, ErrorKind::UnexpectedToken));
                    }
                    Token::EndTag { .. } => {
                        self.errors
                            .push(Error::new(token_and_info.span, ErrorKind::UnexpectedToken));
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
                        self.errors
                            .push(Error::new(token_and_info.span, ErrorKind::UnexpectedToken));
                        self.open_elements_stack.pop();
                        self.insertion_mode = InsertionMode::InHead;
                        self.process_token(token_and_info, None)?;
                    }
                }
            }
            // The "after head" insertion mode
            InsertionMode::AfterHead => {
                // When the user agent is to apply the rules for the "after head" insertion
                // mode, the user agent must handle the token as follows:
                match token {
                    // A character token that is one of U+0009 CHARACTER TABULATION, U+000A LINE
                    // FEED (LF), U+000C FORM FEED (FF), U+000D CARRIAGE RETURN (CR), or U+0020
                    // SPACE
                    //
                    // Insert the character.
                    Token::Character { value, .. }
                        if matches!(value, '\x09' | '\x0A' | '\x0C' | '\x0D' | '\x20') =>
                    {
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
                            .push(Error::new(token_and_info.span, ErrorKind::MisplacedDoctype));
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
                    Token::StartTag { tag_name, .. } if tag_name == "body" => {
                        self.insert_html_element(token_and_info)?;
                        self.frameset_ok = false;
                        self.insertion_mode = InsertionMode::InBody;
                    }
                    // A start tag whose tag name is "frameset"
                    //
                    // Insert an HTML element for the token.
                    //
                    // Switch the insertion mode to "in frameset".
                    Token::StartTag { tag_name, .. } if tag_name == "frameset" => {
                        self.insert_html_element(token_and_info)?;
                        self.insertion_mode = InsertionMode::InFrameset;
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
                            tag_name.as_ref(),
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
                        self.errors
                            .push(Error::new(token_and_info.span, ErrorKind::UnexpectedToken));

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
                        if matches!(tag_name.as_ref(), "body" | "html" | "br") =>
                    {
                        self.insert_html_element(&mut TokenAndInfo {
                            span: Default::default(),
                            acknowledged: false,
                            token: Token::StartTag {
                                tag_name: "body".into(),
                                raw_tag_name: Some("body".into()),
                                self_closing: false,
                                attributes: vec![],
                            },
                        })?;
                        self.insertion_mode = InsertionMode::InBody;
                        self.process_token(token_and_info, None)?;
                    }
                    // A start tag whose tag name is "head"
                    //
                    // Any other end tag
                    //
                    // Parse error. Ignore the token.
                    Token::StartTag { tag_name, .. } if tag_name == "head" => {
                        self.errors
                            .push(Error::new(token_and_info.span, ErrorKind::UnexpectedToken));
                    }
                    Token::EndTag { .. } => {
                        self.errors
                            .push(Error::new(token_and_info.span, ErrorKind::UnexpectedToken));
                    }
                    // Anything else
                    //
                    // Insert an HTML element for a "body" start tag token with no attributes.
                    //
                    // Switch the insertion mode to "in body".
                    //
                    // Reprocess the current token.
                    _ => {
                        self.insert_html_element(&mut TokenAndInfo {
                            span: Default::default(),
                            acknowledged: false,
                            token: Token::StartTag {
                                tag_name: "body".into(),
                                raw_tag_name: Some("body".into()),
                                self_closing: false,
                                attributes: vec![],
                            },
                        })?;
                        self.insertion_mode = InsertionMode::InBody;
                        self.process_token(token_and_info, None)?;
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
                    Token::Character { value, .. }
                        if matches!(value, '\x09' | '\x0A' | '\x0C' | '\x0D' | '\x20') =>
                    {
                        self.reconstruct_the_active_formatting_elements()?;
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
                        self.reconstruct_the_active_formatting_elements()?;
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
                            .push(Error::new(token_and_info.span, ErrorKind::MisplacedDoctype));
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
                        self.errors
                            .push(Error::new(token_and_info.span, ErrorKind::UnexpectedToken));

                        if self.open_elements_stack.contains_template_element() {
                            // Ignore
                            return Ok(());
                        }

                        let first = self.open_elements_stack.items.first_mut();

                        for _attribute in attributes {
                            let has_attribute = if let Some(_element) = &first {
                                // TODO
                                false
                            } else {
                                false
                            };

                            if !has_attribute {
                                // TODO fix me
                                // if let Some(node) = &mut first {
                                //     node.data.attributes.push(Attribute {
                                //         span: Default::default(),
                                //         name: attribute.name.clone(),
                                //         value: attribute.value.clone(),
                                //     });
                                // }
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
                            tag_name.as_ref(),
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
                        self.errors
                            .push(Error::new(token_and_info.span, ErrorKind::UnexpectedToken));

                        let is_second_body = matches!(self.open_elements_stack.items.get(1), Some(node) if get_tag_name!(node) == "body");

                        if !is_second_body
                            || self.open_elements_stack.items.len() == 1
                            || self.open_elements_stack.contains_template_element()
                        {
                            return Ok(());
                        }

                        self.frameset_ok = false;

                        for _attribute in attributes {
                            // TODO fix me
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
                        self.errors
                            .push(Error::new(token_and_info.span, ErrorKind::UnexpectedToken));

                        let len = self.open_elements_stack.items.len();
                        let is_second_body = matches!(self.open_elements_stack.items.get(1), Some(node) if get_tag_name!(node) == "body");

                        if len == 1 || !is_second_body {
                            // Ignore

                            return Ok(());
                        }

                        if !self.frameset_ok {
                            // Ignore

                            return Ok(());
                        }

                        let _body = self.open_elements_stack.items.get(1);
                        // TODO remove the second element
                        let parent: Option<Element> = None;

                        if parent.is_some() {
                            // $parent->removeChild($body);
                        }

                        let mut i = len - 1;

                        while i > 0 {
                            self.open_elements_stack.pop();
                            i -= 1;
                        }

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
                        } else {
                            let mut errored = false;

                            for node in &self.open_elements_stack.items {
                                match &node.data {
                                    Child::Element(Element { tag_name, .. })
                                        if matches!(
                                            &**tag_name,
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
                                        ) =>
                                    {
                                        errored = true;

                                        break;
                                    }
                                    _ => {}
                                }
                            }

                            if errored {
                                self.errors.push(Error::new(
                                    token_and_info.span,
                                    ErrorKind::UnexpectedToken,
                                ));
                            }

                            self.stopped = true;
                        }
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
                            self.errors
                                .push(Error::new(token_and_info.span, ErrorKind::UnexpectedToken));
                        } else {
                            let mut errored = false;

                            for node in &self.open_elements_stack.items {
                                match &node.data {
                                    Child::Element(Element { tag_name, .. })
                                        if matches!(
                                            &**tag_name,
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
                                        ) =>
                                    {
                                        errored = true;

                                        break;
                                    }
                                    _ => {}
                                }
                            }

                            if errored {
                                self.errors.push(Error::new(
                                    token_and_info.span,
                                    ErrorKind::UnexpectedToken,
                                ));
                            }

                            self.insertion_mode = InsertionMode::AfterBody;
                        }
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
                            self.errors
                                .push(Error::new(token_and_info.span, ErrorKind::UnexpectedToken));
                        } else {
                            let mut errored = false;

                            for node in &self.open_elements_stack.items {
                                match &node.data {
                                    Child::Element(Element { tag_name, .. })
                                        if matches!(
                                            &**tag_name,
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
                                        ) =>
                                    {
                                        errored = true;

                                        break;
                                    }
                                    _ => {}
                                }
                            }

                            if errored {
                                self.errors.push(Error::new(
                                    token_and_info.span,
                                    ErrorKind::UnexpectedToken,
                                ));
                            }

                            self.insertion_mode = InsertionMode::AfterBody;
                            self.process_token(token_and_info, None)?;
                        }
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
                    Token::StartTag { tag_name, .. }
                        if matches!(
                            tag_name.as_ref(),
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
                            self.close_p_element();
                        }

                        self.insert_html_element(token_and_info)?;
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
                    Token::StartTag { tag_name, .. }
                        if matches!(tag_name.as_ref(), "h1" | "h2" | "h3" | "h4" | "h5" | "h6") =>
                    {
                        if self.open_elements_stack.has_in_button_scope("p") {
                            self.close_p_element();
                        }

                        match self.open_elements_stack.items.last() {
                            Some(node)
                                if matches!(
                                    get_tag_name!(node),
                                    "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
                                ) =>
                            {
                                self.errors.push(Error::new(
                                    token_and_info.span,
                                    ErrorKind::UnexpectedToken,
                                ));

                                self.open_elements_stack.pop();
                            }
                            _ => {}
                        }

                        self.insert_html_element(token_and_info)?;
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
                        if matches!(tag_name.as_ref(), "pre" | "listing") =>
                    {
                        if self.open_elements_stack.has_in_button_scope("p") {
                            self.close_p_element();
                        }

                        self.insert_html_element(token_and_info)?;

                        match self.input.cur()? {
                            Some(Token::Character { value, .. }) if *value == '\x0A' => {
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
                    Token::StartTag { tag_name, .. } if tag_name == "form" => {
                        if self.form_element_pointer.is_some()
                            && !self.open_elements_stack.contains_template_element()
                        {
                            self.errors
                                .push(Error::new(token_and_info.span, ErrorKind::UnexpectedToken));
                        } else {
                            if self.open_elements_stack.has_in_button_scope("p") {
                                self.close_p_element();
                            }

                            let element = self.insert_html_element(token_and_info)?;

                            if !self.open_elements_stack.contains_template_element() {
                                self.form_element_pointer = Some(element);
                            }
                        }
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
                    Token::StartTag { tag_name, .. } if tag_name == "li" => {
                        self.frameset_ok = false;

                        // Initialise node to be the current node (the bottommost node of
                        // the stack).
                        // Step "Loop".
                        for node in self.open_elements_stack.items.iter().rev() {
                            match &node.data {
                                Child::Element(Element { tag_name, .. }) if &*tag_name == "li" => {
                                    // Generate implied end tags, except for li elements.
                                    self.open_elements_stack
                                        .generate_implied_end_tags_with_exclusion("li");

                                    // If the current node is not an li element, then this is a
                                    // parse error.
                                    match self.open_elements_stack.items.last() {
                                        Some(node) if get_tag_name!(node) != "li" => {
                                            self.errors.push(Error::new(
                                                token_and_info.span,
                                                ErrorKind::UnexpectedToken,
                                            ));
                                        }
                                        _ => {}
                                    }

                                    // Pop elements from the stack of open elements until an li
                                    // element has been popped from the stack.
                                    self.open_elements_stack
                                        .generate_implied_end_tags_with_exclusion("li");

                                    // Jump to the step labeled done below.
                                    break;
                                }
                                _ => {}
                            }

                            // If node is in the special category, but is not an address,
                            // div, or p element, then jump to the step labeled done below.
                            // Otherwise, set node to the previous entry in the stack
                            // of open elements and return to the step labeled loop.
                            if self.is_special_element(node)
                                && !match &node.data {
                                    Child::Element(Element { tag_name, .. })
                                        if matches!(tag_name.as_ref(), "address" | "div" | "p") =>
                                    {
                                        true
                                    }
                                    _ => false,
                                }
                            {
                                break;
                            }
                        }

                        // Step "Done".
                        // If the stack of open elements has a p element in button scope,
                        // then close a p element.
                        if self.open_elements_stack.has_in_button_scope("p") {
                            self.close_p_element();
                        }

                        self.insert_html_element(token_and_info)?;
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
                    Token::StartTag { tag_name, .. }
                        if matches!(tag_name.as_ref(), "dd" | "dt") =>
                    {
                        self.frameset_ok = false;

                        // Initialise node to be the current node (the bottommost node of
                        // the stack).
                        // Step "Loop".
                        for node in self.open_elements_stack.items.iter().rev() {
                            match &node.data {
                                Child::Element(Element { tag_name, .. }) if &*tag_name == "dd" => {
                                    // Generate implied end tags, except for dd elements.
                                    self.open_elements_stack
                                        .generate_implied_end_tags_with_exclusion("dd");

                                    // If the current node is not an li element, then this is a
                                    // parse error.
                                    match self.open_elements_stack.items.last() {
                                        Some(node) if get_tag_name!(node) != "dd" => {
                                            self.errors.push(Error::new(
                                                token_and_info.span,
                                                ErrorKind::UnexpectedToken,
                                            ));
                                        }
                                        _ => {}
                                    }

                                    // Pop elements from the stack of open elements until an dd
                                    // element has been popped from the stack.
                                    self.open_elements_stack.pop_until_tag_name_popped(&["dd"]);

                                    // Jump to the step labeled done below.
                                    break;
                                }
                                Child::Element(Element { tag_name, .. }) if &*tag_name == "dt" => {
                                    // Generate implied end tags, except for li elements.
                                    self.open_elements_stack
                                        .generate_implied_end_tags_with_exclusion("dt");

                                    // If the current node is not an li element, then this is a
                                    // parse error.
                                    match self.open_elements_stack.items.last() {
                                        Some(node) if get_tag_name!(node) != "dt" => {
                                            self.errors.push(Error::new(
                                                token_and_info.span,
                                                ErrorKind::UnexpectedToken,
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
                                _ => {}
                            }

                            // If node is in the special category, but is not an address,
                            // div, or p element, then jump to the step labeled done below.
                            // Otherwise, set node to the previous entry in the stack of
                            // open elements and return to the step labeled loop.
                            if self.is_special_element(node)
                                && !match &node.data {
                                    Child::Element(Element { tag_name, .. })
                                        if matches!(tag_name.as_ref(), "address" | "div" | "p") =>
                                    {
                                        true
                                    }
                                    _ => false,
                                }
                            {
                                break;
                            }
                        }

                        // Step "Done".
                        // If the stack of open elements has a p element in button scope,
                        // then close a p element.
                        if self.open_elements_stack.has_in_button_scope("p") {
                            self.close_p_element();
                        }

                        self.insert_character(token_and_info)?;
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
                            self.close_p_element();
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
                            self.errors
                                .push(Error::new(token_and_info.span, ErrorKind::UnexpectedToken));
                            self.open_elements_stack.generate_implied_end_tags();
                            self.open_elements_stack
                                .pop_until_tag_name_popped(&["button"]);
                        }

                        self.reconstruct_the_active_formatting_elements()?;
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
                            tag_name.as_ref(),
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
                            self.errors
                                .push(Error::new(token_and_info.span, ErrorKind::UnexpectedToken));
                        } else {
                            self.open_elements_stack.generate_implied_end_tags();

                            match self.open_elements_stack.items.last() {
                                Some(node) if get_tag_name!(node) != tag_name => {
                                    self.errors.push(Error::new(
                                        token_and_info.span,
                                        ErrorKind::UnexpectedToken,
                                    ));
                                }
                                _ => {}
                            }

                            self.open_elements_stack
                                .pop_until_tag_name_popped(&[tag_name]);
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
                                    // TODO error?
                                    return Ok(());
                                }
                                Some(x) => Some(x),
                            };

                            self.form_element_pointer = None;

                            if node.is_none()
                            // TODO fix me
                            // || !self
                            //     .open_elements_stack
                            //     .in_scope(default_scope, |n| is_same_node(&node.unwrap(), &n))
                            {
                                self.errors.push(Error::new(
                                    token_and_info.span,
                                    ErrorKind::UnexpectedToken,
                                ));

                                return Ok(());
                            }

                            self.open_elements_stack.generate_implied_end_tags();

                            let current = self.open_elements_stack.items.last();

                            if !is_same_node(&node.unwrap(), current.unwrap()) {
                                self.errors.push(Error::new(
                                    token_and_info.span,
                                    ErrorKind::UnexpectedToken,
                                ));
                            }

                            // TODO fix me
                            // if let Some(node) = &node {
                            //     self.open_elements_stack.remove(node);
                            // }

                            // TODO error?
                        } else {
                            if self.open_elements_stack.has_in_scope("form") {
                                self.errors.push(Error::new(
                                    token_and_info.span,
                                    ErrorKind::UnexpectedToken,
                                ));

                                return Ok(());
                            }

                            self.open_elements_stack.generate_implied_end_tags();

                            match self.open_elements_stack.items.last() {
                                Some(node) if get_tag_name!(node) != "form" => {
                                    self.errors.push(Error::new(
                                        token_and_info.span,
                                        ErrorKind::UnexpectedToken,
                                    ));
                                }
                                _ => {}
                            }

                            self.open_elements_stack
                                .pop_until_tag_name_popped(&["form"]);
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
                            self.errors
                                .push(Error::new(token_and_info.span, ErrorKind::UnexpectedToken));

                            self.insert_html_element(&mut TokenAndInfo {
                                span: Default::default(),
                                acknowledged: false,
                                token: Token::StartTag {
                                    tag_name: "p".into(),
                                    raw_tag_name: Some("p".into()),
                                    self_closing: false,
                                    attributes: vec![],
                                },
                            })?;
                        }

                        self.close_p_element();
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
                            self.errors
                                .push(Error::new(token_and_info.span, ErrorKind::UnexpectedToken));
                        } else {
                            self.open_elements_stack
                                .generate_implied_end_tags_with_exclusion("li");

                            match self.open_elements_stack.items.last() {
                                Some(node) if get_tag_name!(node) != "li" => {
                                    self.errors.push(Error::new(
                                        token_and_info.span,
                                        ErrorKind::UnexpectedToken,
                                    ));
                                }
                                _ => {}
                            }

                            self.open_elements_stack.pop_until_tag_name_popped(&["li"]);
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
                    Token::EndTag { tag_name, .. } if matches!(tag_name.as_ref(), "dd" | "dt") => {
                        if !self.open_elements_stack.has_in_scope(tag_name) {
                            self.errors
                                .push(Error::new(token_and_info.span, ErrorKind::UnexpectedToken));
                        } else {
                            self.open_elements_stack
                                .generate_implied_end_tags_with_exclusion(tag_name);

                            match self.open_elements_stack.items.last() {
                                Some(node) if get_tag_name!(node) != tag_name => {
                                    self.errors.push(Error::new(
                                        token_and_info.span,
                                        ErrorKind::UnexpectedToken,
                                    ));
                                }
                                _ => {}
                            }

                            self.open_elements_stack
                                .pop_until_tag_name_popped(&[tag_name]);
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
                        if matches!(tag_name.as_ref(), "h1" | "h2" | "h3" | "h4" | "h5" | "h6") =>
                    {
                        if !self.open_elements_stack.has_in_scope("h1")
                            && !self.open_elements_stack.has_in_scope("h2")
                            && !self.open_elements_stack.has_in_scope("h3")
                            && !self.open_elements_stack.has_in_scope("h4")
                            && !self.open_elements_stack.has_in_scope("h5")
                            && !self.open_elements_stack.has_in_scope("h6")
                        {
                            self.errors
                                .push(Error::new(token_and_info.span, ErrorKind::UnexpectedToken));
                        } else {
                            self.open_elements_stack.generate_implied_end_tags();

                            match self.open_elements_stack.items.last() {
                                Some(node) if get_tag_name!(node) != tag_name => {
                                    self.errors.push(Error::new(
                                        token_and_info.span,
                                        ErrorKind::UnexpectedToken,
                                    ));
                                }
                                _ => {}
                            }

                            self.open_elements_stack
                                .pop_until_tag_name_popped(&["h1", "h2", "h3", "h4", "h5", "h6"]);
                        }
                    }
                    // An end tag whose tag name is "sarcasm"
                    //
                    // Take a deep breath, then act as described in the "any other end tag" entry
                    // below.
                    Token::EndTag { tag_name, .. } if tag_name == "sarcasm" => {
                        // TODO
                    }
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
                    Token::StartTag { tag_name, .. } if tag_name == "a" => {
                        // TODO
                        // if !self.active_formatting_elements.is_empty() {
                        //     let has_anchor_element = false;
                        //     let element = None;
                        //
                        //    for element in self.active_formatting_elements {
                        //         match element {
                        //             Element { tag_name, .. } if tag_name = "market" => {
                        //                 break;
                        //             }
                        //            Element { tag_name, .. } if &*tag_name == "a" => {
                        //                  break;
                        //              }
                        //             _ => {}
                        //          }
                        //      }
                        //
                        //     if has_anchor_element {
                        //         // Parse error.
                        //        self.run_the_adoption_agency_algorithm(token_and_info);
                        //
                        //        if (element.is_some() &&
                        // self.activeFormattingElements.contains(element))
                        //        {
                        //           self.active_formatting_elements.remove(element);
                        //           self.open_element_stack.remove($element);
                        //        }
                        //     }
                        // }

                        self.reconstruct_the_active_formatting_elements()?;

                        let element = self.insert_html_element(token_and_info)?;

                        self.active_formatting_elements.push(element);
                    }
                    // A start tag whose tag name is one of: "b", "big", "code", "em", "font", "i",
                    // "s", "small", "strike", "strong", "tt", "u"
                    //
                    // Reconstruct the active formatting elements, if any.
                    //
                    // Insert an HTML element for the token. Push onto the list of active formatting
                    // elements that element.
                    Token::StartTag { tag_name, .. }
                        if matches!(
                            tag_name.as_ref(),
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
                        self.reconstruct_the_active_formatting_elements()?;

                        let element = self.insert_html_element(token_and_info)?;

                        self.active_formatting_elements.push(element);
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
                    Token::StartTag { tag_name, .. } if tag_name == "nobr" => {
                        self.reconstruct_the_active_formatting_elements()?;

                        if self.open_elements_stack.has_in_scope("nobr") {
                            self.errors
                                .push(Error::new(token_and_info.span, ErrorKind::UnexpectedToken));

                            self.run_the_adoption_agency_algorithm(token_and_info);
                            self.reconstruct_the_active_formatting_elements()?;
                        } else {
                            let element = self.insert_html_element(token_and_info)?;

                            self.active_formatting_elements.push(element);
                        }
                    }
                    // An end tag whose tag name is one of: "a", "b", "big", "code", "em", "font",
                    // "i", "nobr", "s", "small", "strike", "strong", "tt", "u"
                    //
                    // Run the adoption agency algorithm for the token.
                    Token::EndTag { tag_name, .. }
                        if matches!(
                            tag_name.as_ref(),
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
                        self.run_the_adoption_agency_algorithm(token_and_info);
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
                        if matches!(tag_name.as_ref(), "applet" | "marquee" | "object") =>
                    {
                        self.reconstruct_the_active_formatting_elements()?;
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
                        if matches!(tag_name.as_ref(), "applet" | "marquee" | "object") =>
                    {
                        if self.open_elements_stack.has_in_scope(tag_name) {
                            self.errors
                                .push(Error::new(token_and_info.span, ErrorKind::UnexpectedToken));
                        } else {
                            self.open_elements_stack.generate_implied_end_tags();

                            match self.open_elements_stack.items.last() {
                                Some(node) if get_tag_name!(node) != tag_name => {
                                    self.errors.push(Error::new(
                                        token_and_info.span,
                                        ErrorKind::UnexpectedToken,
                                    ));
                                }
                                _ => {}
                            }

                            self.open_elements_stack
                                .pop_until_tag_name_popped(&[tag_name]);
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
                    Token::StartTag { tag_name, .. } if tag_name == "table" => {
                        // match &self.document {
                        //     Some(node)
                        //         if *node.mode != DocumentMode::Quirks
                        //             && self.open_elements_stack.has_in_button_scope("p") =>
                        //     {
                        //         self.close_p_element();
                        //     }
                        //     _ => {}
                        // }

                        self.insert_html_element(token_and_info)?;
                        self.frameset_ok = false;
                        self.insertion_mode = InsertionMode::InTable;
                    }
                    // An end tag whose tag name is "br"
                    //
                    // Parse error. Drop the attributes from the token, and act as described in the
                    // next entry; i.e. act as if this was a "br" start tag token with no
                    // attributes, rather than the end tag token that it actually is.
                    Token::EndTag {
                        tag_name,
                        raw_tag_name,
                        self_closing,
                        ..
                    } if tag_name == "br" => {
                        self.errors
                            .push(Error::new(token_and_info.span, ErrorKind::UnexpectedToken));

                        self.reconstruct_the_active_formatting_elements()?;
                        self.insert_html_element(&mut TokenAndInfo {
                            span: Default::default(),
                            acknowledged: false,
                            token: Token::StartTag {
                                tag_name: tag_name.clone(),
                                raw_tag_name: raw_tag_name.clone(),
                                self_closing: *self_closing,
                                attributes: vec![],
                            },
                        })?;
                        self.open_elements_stack.pop();

                        // TODO fix me

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
                        self_closing,
                        ..
                    } if matches!(
                        tag_name.as_ref(),
                        "area" | "br" | "embed" | "img" | "keygen" | "wbr"
                    ) =>
                    {
                        let is_self_closing = *self_closing;

                        self.reconstruct_the_active_formatting_elements()?;
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
                        self_closing,
                        attributes,
                        ..
                    } if tag_name == "input" => {
                        let is_self_closing = *self_closing;
                        let input_type = attributes
                            .clone()
                            .into_iter()
                            .find(|attribute| attribute.name.as_ref() == "type");
                        let is_hidden = match &input_type {
                            Some(input_type) => match &input_type.value {
                                Some(value) if value.as_ref().eq_ignore_ascii_case("hidden") => {
                                    true
                                }
                                _ => false,
                            },
                            _ => false,
                        };

                        self.reconstruct_the_active_formatting_elements()?;
                        self.insert_html_element(token_and_info)?;
                        self.open_elements_stack.pop();

                        if is_self_closing {
                            token_and_info.acknowledged = true;
                        }

                        if input_type.is_none() || !is_hidden {
                            self.frameset_ok = false;
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
                        self_closing,
                        ..
                    } if matches!(tag_name.as_ref(), "param" | "source" | "track") => {
                        let is_self_closing = *self_closing;

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
                        self_closing,
                        ..
                    } if tag_name == "hr" => {
                        if self.open_elements_stack.has_in_button_scope("p") {
                            self.close_p_element();
                        }

                        let is_self_closing = *self_closing;

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
                        let mut new_token_and_info = token_and_info.clone();

                        match &mut new_token_and_info {
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

                        self.process_token(&mut new_token_and_info, None)?;
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

                        match self.input.cur()? {
                            Some(Token::Character { value, .. }) if *value == '\x0A' => {
                                bump!(self);
                            }
                            _ => {}
                        }

                        self.input.set_input_state(State::Rcdata);
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
                    Token::StartTag { tag_name, .. } if tag_name == "xmp" => {
                        if self.open_elements_stack.has_in_button_scope("p") {
                            self.close_p_element();
                        }

                        self.reconstruct_the_active_formatting_elements()?;
                        self.frameset_ok = false;
                        self.parse_generic_text_element(token_and_info, true)?;
                    }
                    // A start tag whose tag name is "iframe"
                    //
                    // Set the frameset-ok flag to "not ok".
                    //
                    // Follow the generic raw text element parsing algorithm.
                    Token::StartTag { tag_name, .. } if tag_name == "iframe" => {
                        self.frameset_ok = false;
                        self.parse_generic_text_element(token_and_info, true)?;
                    }
                    // A start tag whose tag name is "noembed"
                    //
                    // A start tag whose tag name is "noscript", if the scripting flag is enabled
                    //
                    // Follow the generic raw text element parsing algorithm.
                    Token::StartTag { tag_name, .. } if tag_name == "noembed" => {
                        self.parse_generic_text_element(token_and_info, true)?;
                    }
                    Token::StartTag { tag_name, .. }
                        if tag_name == "noscript" && self.config.scripting_enabled =>
                    {
                        self.parse_generic_text_element(token_and_info, true)?;
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
                    Token::StartTag { tag_name, .. } if tag_name == "select" => {
                        self.reconstruct_the_active_formatting_elements()?;
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
                    }
                    // A start tag whose tag name is one of: "optgroup", "option"
                    //
                    // If the current node is an option element, then pop the current node off the
                    // stack of open elements.
                    //
                    // Reconstruct the active formatting elements, if any.
                    //
                    // Insert an HTML element for the token.
                    Token::StartTag { tag_name, .. }
                        if matches!(tag_name.as_ref(), "optgroup" | "option") =>
                    {
                        match self.open_elements_stack.items.last() {
                            Some(node) if get_tag_name!(node) == "option" => {
                                self.open_elements_stack.pop();
                            }
                            _ => {}
                        }

                        self.reconstruct_the_active_formatting_elements()?;
                        self.insert_html_element(token_and_info)?;
                    }
                    // A start tag whose tag name is one of: "rb", "rtc"
                    //
                    // If the stack of open elements has a ruby element in scope, then generate
                    // implied end tags. If the current node is not now a ruby element, this is a
                    // parse error.
                    //
                    // Insert an HTML element for the token.
                    Token::StartTag { tag_name, .. }
                        if matches!(tag_name.as_ref(), "rb" | "rtc") =>
                    {
                        if self.open_elements_stack.has_in_scope("ruby") {
                            self.open_elements_stack.generate_implied_end_tags();
                        }

                        match self.open_elements_stack.items.last() {
                            Some(node) if get_tag_name!(node) != "ruby" => {
                                self.errors.push(Error::new(
                                    token_and_info.span,
                                    ErrorKind::UnexpectedToken,
                                ));
                            }
                            _ => {}
                        }

                        self.insert_html_element(token_and_info)?;
                    }
                    // A start tag whose tag name is one of: "rp", "rt"
                    //
                    // If the stack of open elements has a ruby element in scope, then generate
                    // implied end tags, except for rtc elements. If the current node is not now a
                    // rtc element or a ruby element, this is a parse error.
                    //
                    // Insert an HTML element for the token.
                    Token::StartTag { tag_name, .. }
                        if matches!(tag_name.as_ref(), "rp" | "rt") =>
                    {
                        if self.open_elements_stack.has_in_scope("ruby") {
                            self.open_elements_stack
                                .generate_implied_end_tags_with_exclusion("rtc");
                        }

                        match self.open_elements_stack.items.last() {
                            Some(node) if !matches!(get_tag_name!(node), "rtc" | "ruby") => {
                                self.errors.push(Error::new(
                                    token_and_info.span,
                                    ErrorKind::UnexpectedToken,
                                ));
                            }
                            _ => {}
                        }

                        self.insert_html_element(token_and_info)?;
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
                        self_closing,
                        ..
                    } if tag_name == "math" => {
                        let is_self_closing = *self_closing;

                        self.reconstruct_the_active_formatting_elements()?;
                        self.adjust_math_ml_attributes(token_and_info);
                        self.adjust_foreign_attributes_for_the_token(token_and_info);
                        self.insert_foreign_element(token_and_info, Namespace::MATHML)?;

                        if is_self_closing {
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
                        self_closing,
                        ..
                    } if tag_name == "svg" => {
                        let is_self_closing = *self_closing;

                        self.reconstruct_the_active_formatting_elements()?;
                        self.adjust_svg_attributes(token_and_info);
                        self.adjust_foreign_attributes_for_the_token(token_and_info);
                        self.insert_foreign_element(token_and_info, Namespace::SVG)?;

                        if is_self_closing {
                            token_and_info.acknowledged = true;
                        }
                    }

                    // A start tag whose tag name is one of: "caption", "col", "colgroup", "frame",
                    // "head", "tbody", "td", "tfoot", "th", "thead", "tr"
                    //
                    // Parse error. Ignore the token.
                    Token::StartTag { tag_name, .. }
                        if matches!(
                            tag_name.as_ref(),
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
                        self.errors
                            .push(Error::new(token_and_info.span, ErrorKind::UnexpectedToken));
                    }
                    // Any other start tag
                    //
                    // Reconstruct the active formatting elements, if any.
                    //
                    // Insert an HTML element for the token.
                    Token::StartTag { .. } => {
                        self.reconstruct_the_active_formatting_elements()?;
                        self.insert_html_element(token_and_info)?;
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
                    // name as   the token.
                    //
                    //   2. If node is not the current node, then this is a parse error.
                    //
                    //   3. Pop all the nodes from the current node up to node, including node, then
                    // stop   these steps.
                    //
                    // 3. Otherwise, if node is in the special category, then this is a parse error;
                    // ignore the token, and return.
                    //
                    // 4. Set node to the previous entry in the stack of open elements.
                    //
                    // 5. Return to the step labeled loop.
                    Token::EndTag { tag_name: _, .. } => {
                        for node in &self.open_elements_stack.items {
                            // TODO fix me
                            if false {
                                // Generate implied end tags, except for HTML
                                // elements with
                                // the same tag name as the token.
                                // self.open_elements_stack.
                                // generate_implied_end_tags_with_exclusion(tag_name);

                                // If node is not the current node, then this is
                                // a parse error.
                                // match &self.open_elements_stack.items.last()
                                // {
                                //     Some(Element { tag_name, .. })
                                //         if !matches!(tag_name.as_ref(), "rtc"
                                // | "ruby") =>
                                //     {
                                //         self.errors.push(Error::new(
                                //             token_and_info.span,
                                //             ErrorKind::UnexpectedToken,
                                //         ));
                                //     }
                                //     _ => {}
                                // }

                                // Pop all the nodes from the current node up to
                                // node, including
                                // node, then stop these steps.
                                // while (!self.open_elements_stack.is_empty() {
                                //     if (self.open_elements_stack.pop() ==
                                // element) {
                                //         break 2;
                                //     }
                                // }
                            } else if self.is_special_element(node) {
                                // Parse error.
                                // Ignore the token.
                                self.errors.push(Error::new(
                                    token_and_info.span,
                                    ErrorKind::UnexpectedToken,
                                ));

                                return Ok(());
                            }
                        }
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
                            .push(Error::new(token_and_info.span, ErrorKind::UnexpectedToken));
                        self.open_elements_stack.pop();
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
                        // TODO
                        // self.open_elements_stack.bottom();
                        self.open_elements_stack.pop();
                        self.insertion_mode = self.original_insertion_mode.clone();
                    }
                    // Any other end tag
                    //
                    // Pop the current node off the stack of open elements.
                    //
                    // Switch the insertion mode to the original insertion mode.
                    _ => {
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
                                if matches!(
                                    get_tag_name!(node),
                                    "table" | "tbody" | "tfoot" | "thead" | "tr"
                                ) =>
                            {
                                true
                            }
                            _ => false,
                        } =>
                    {
                        self.pending_character_tokens = vec![];
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
                            .push(Error::new(token_and_info.span, ErrorKind::MisplacedDoctype));
                    }
                    // A start tag whose tag name is "caption"
                    //
                    // Clear the stack back to a table context. (See below.)
                    //
                    // Insert a marker at the end of the list of active formatting elements.
                    //
                    // Insert an HTML element for the token, then switch the insertion mode to "in
                    // caption".
                    Token::StartTag { tag_name, .. } if tag_name == "caption" => {
                        self.open_elements_stack.clear_back_to_table_context();
                        self.active_formatting_elements.insert_marker();
                        self.insert_html_element(token_and_info)?;
                        self.insertion_mode = InsertionMode::InCaption;
                    }
                    // A start tag whose tag name is "colgroup"
                    //
                    // Clear the stack back to a table context. (See below.)
                    //
                    // Insert an HTML element for the token, then switch the insertion mode to "in
                    // column group".
                    Token::StartTag { tag_name, .. } if tag_name == "colgroup" => {
                        self.open_elements_stack.clear_back_to_table_context();
                        self.insert_html_element(token_and_info)?;
                        self.insertion_mode = InsertionMode::InColumnGroup;
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
                        self.open_elements_stack.clear_back_to_table_body_context();
                        self.insert_html_element(&mut TokenAndInfo {
                            span: Default::default(),
                            acknowledged: true,
                            token: Token::StartTag {
                                tag_name: "colgroup".into(),
                                raw_tag_name: Some("colgroup".into()),
                                self_closing: false,
                                attributes: vec![],
                            },
                        })?;
                        self.insertion_mode = InsertionMode::InColumnGroup;
                        self.process_token(token_and_info, None)?;
                    }
                    // A start tag whose tag name is one of: "tbody", "tfoot", "thead"
                    //
                    // Clear the stack back to a table context. (See below.)
                    //
                    // Insert an HTML element for the token, then switch the insertion mode to "in
                    // table body".
                    Token::StartTag { tag_name, .. }
                        if matches!(tag_name.as_ref(), "tbody" | "tfoot" | "thead") =>
                    {
                        self.open_elements_stack.clear_back_to_table_context();
                        self.insert_html_element(token_and_info)?;
                        self.insertion_mode = InsertionMode::InTableBody;
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
                        if matches!(tag_name.as_ref(), "td" | "th" | "tr") =>
                    {
                        self.open_elements_stack.clear_back_to_table_body_context();
                        self.insert_html_element(&mut TokenAndInfo {
                            span: Default::default(),
                            acknowledged: false,
                            token: Token::StartTag {
                                tag_name: "tbody".into(),
                                raw_tag_name: Some("tbody".into()),
                                self_closing: false,
                                attributes: vec![],
                            },
                        })?;
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
                            ErrorKind::UnexpectedNullCharacter,
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
                            self.errors
                                .push(Error::new(token_and_info.span, ErrorKind::UnexpectedToken));
                        } else {
                            self.open_elements_stack
                                .pop_until_tag_name_popped(&["table"]);
                            self.reset_insertion_mode();
                        }
                    }
                    // An end tag whose tag name is one of: "body", "caption", "col", "colgroup",
                    // "html", "tbody", "td", "tfoot", "th", "thead", "tr"
                    //
                    // Parse error. Ignore the token.
                    Token::EndTag { tag_name, .. }
                        if matches!(
                            tag_name.as_ref(),
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
                        self.errors
                            .push(Error::new(token_and_info.span, ErrorKind::UnexpectedToken));
                    }
                    // A start tag whose tag name is one of: "style", "script", "template"
                    //
                    // An end tag whose tag name is "template"
                    //
                    // Process the token using the rules for the "in head" insertion mode.
                    Token::StartTag { tag_name, .. }
                        if matches!(tag_name.as_ref(), "style" | "script" | "template") =>
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
                        self_closing,
                        ..
                    } if tag_name == "input" => {
                        let is_self_closing = *self_closing;
                        let input_type = attributes
                            .clone()
                            .into_iter()
                            .find(|attribute| attribute.name.as_ref() == "type");
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
                            self.errors.push(Error::new(
                                token_and_info.span,
                                ErrorKind::UnexpectedNullCharacter,
                            ));

                            let saved_foster_parenting_state = self.foster_parenting_enabled;

                            self.foster_parenting_enabled = true;
                            self.process_token_using_rules(token_and_info, InsertionMode::InBody)?;
                            self.foster_parenting_enabled = saved_foster_parenting_state;
                        } else {
                            self.errors
                                .push(Error::new(token_and_info.span, ErrorKind::UnexpectedToken));

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
                        self.errors
                            .push(Error::new(token_and_info.span, ErrorKind::UnexpectedToken));

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
                        self.errors.push(Error::new(
                            token_and_info.span,
                            ErrorKind::UnexpectedNullCharacter,
                        ));

                        let saved_foster_parenting_state = self.foster_parenting_enabled;

                        self.foster_parenting_enabled = true;
                        self.process_token_using_rules(token_and_info, InsertionMode::InBody)?;
                        self.foster_parenting_enabled = saved_foster_parenting_state;
                    }
                }
                // When the steps above require the UA to clear the stack back
                // to a table context, it means that the UA must, while the
                // current node is not a table, template, or html element, pop
                // elements from the stack of open elements.
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
                            self.errors.push(Error::new(
                                token_and_info.span,
                                ErrorKind::UnexpectedNullCharacter,
                            ));

                            for mut character_token in take(&mut self.pending_character_tokens) {
                                let saved_foster_parenting_state = self.foster_parenting_enabled;

                                self.foster_parenting_enabled = true;
                                self.process_token_using_rules(
                                    &mut character_token,
                                    InsertionMode::InBody,
                                )?;
                                self.foster_parenting_enabled = saved_foster_parenting_state;
                            }
                        } else {
                            for mut character_token in take(&mut self.pending_character_tokens) {
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
                            self.errors
                                .push(Error::new(token_and_info.span, ErrorKind::UnexpectedToken));
                        } else {
                            self.open_elements_stack.generate_implied_end_tags();

                            match self.open_elements_stack.items.last() {
                                Some(node) if get_tag_name!(node) != "caption" => {
                                    self.errors.push(Error::new(
                                        token_and_info.span,
                                        ErrorKind::UnexpectedToken,
                                    ));
                                }
                                _ => {}
                            }

                            self.open_elements_stack
                                .pop_until_tag_name_popped(&["caption"]);
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
                            tag_name.as_ref(),
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
                            self.errors
                                .push(Error::new(token_and_info.span, ErrorKind::UnexpectedToken));
                        } else {
                            self.open_elements_stack.generate_implied_end_tags();

                            match self.open_elements_stack.items.last() {
                                Some(node) if get_tag_name!(node) != "caption" => {
                                    self.errors.push(Error::new(
                                        token_and_info.span,
                                        ErrorKind::UnexpectedToken,
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
                            self.errors
                                .push(Error::new(token_and_info.span, ErrorKind::UnexpectedToken));
                        } else {
                            self.open_elements_stack.generate_implied_end_tags();

                            match self.open_elements_stack.items.last() {
                                Some(node) if get_tag_name!(node) != "caption" => {
                                    self.errors.push(Error::new(
                                        token_and_info.span,
                                        ErrorKind::UnexpectedToken,
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
                            tag_name.as_ref(),
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
                        self.errors
                            .push(Error::new(token_and_info.span, ErrorKind::UnexpectedToken));
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
                    Token::Character { value, .. }
                        if matches!(value, '\x09' | '\x0A' | '\x0C' | '\x0D' | '\x20') =>
                    {
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
                            .push(Error::new(token_and_info.span, ErrorKind::MisplacedDoctype));
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
                        self_closing,
                        ..
                    } if tag_name == "col" => {
                        let is_self_closing = *self_closing;

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
                            Some(node) if get_tag_name!(node) != "colgroup" => {
                                self.errors.push(Error::new(
                                    token_and_info.span,
                                    ErrorKind::UnexpectedToken,
                                ));
                            }
                            _ => {
                                self.open_elements_stack.pop();
                                self.insertion_mode = InsertionMode::InTable;
                            }
                        }
                    }
                    // An end tag whose tag name is "col"
                    //
                    // Parse error. Ignore the token.
                    Token::EndTag { tag_name, .. } if tag_name == "col" => {
                        self.errors
                            .push(Error::new(token_and_info.span, ErrorKind::UnexpectedToken));
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
                        Some(node) if get_tag_name!(node) != "colgroup" => {
                            self.errors
                                .push(Error::new(token_and_info.span, ErrorKind::UnexpectedToken));
                        }
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
                    Token::EndTag { tag_name, .. } if tag_name == "tr" => {
                        self.open_elements_stack.clear_back_to_table_body_context();
                        self.insert_html_element(token_and_info)?;
                        self.insertion_mode = InsertionMode::InRow;
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
                    Token::StartTag { tag_name, .. }
                        if matches!(tag_name.as_ref(), "th" | "td") =>
                    {
                        self.errors
                            .push(Error::new(token_and_info.span, ErrorKind::UnexpectedToken));
                        self.open_elements_stack.clear_back_to_table_body_context();
                        self.insert_html_element(&mut TokenAndInfo {
                            span: Default::default(),
                            acknowledged: false,
                            token: Token::StartTag {
                                tag_name: "tr".into(),
                                raw_tag_name: Some("tr".into()),
                                self_closing: false,
                                attributes: vec![],
                            },
                        })?;
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
                        if matches!(tag_name.as_ref(), "tbody" | "tfoot" | "thead") =>
                    {
                        if !self.open_elements_stack.has_in_table_scope(tag_name) {
                            self.errors
                                .push(Error::new(token_and_info.span, ErrorKind::UnexpectedToken));
                        } else {
                            self.open_elements_stack.clear_back_to_table_body_context();
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
                            tag_name.as_ref(),
                            "caption" | "col" | "colgroup" | "tbody" | "tfoot" | "thead"
                        ) =>
                    {
                        if !(self.open_elements_stack.has_in_table_scope("tbody")
                            || self.open_elements_stack.has_in_table_scope("thead")
                            || self.open_elements_stack.has_in_table_scope("tfoot"))
                        {
                            self.errors
                                .push(Error::new(token_and_info.span, ErrorKind::UnexpectedToken));
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
                            self.errors
                                .push(Error::new(token_and_info.span, ErrorKind::UnexpectedToken));
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
                            tag_name.as_ref(),
                            "body" | "caption" | "col" | "colgroup" | "html" | "td" | "th" | "tr"
                        ) =>
                    {
                        self.errors
                            .push(Error::new(token_and_info.span, ErrorKind::UnexpectedToken));
                    }
                    // Anything else
                    //
                    // Process the token using the rules for the "in table" insertion mode.
                    _ => {
                        self.process_token_using_rules(token_and_info, InsertionMode::InTable)?;
                    }
                }
                // When the steps above require the UA to clear the stack back
                // to a table body context, it means that the UA must, while the
                // current node is not a tbody, tfoot, thead, template, or html
                // element, pop elements from the stack of open elements.
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
                    Token::StartTag { tag_name, .. }
                        if matches!(tag_name.as_ref(), "th" | "td") =>
                    {
                        self.open_elements_stack.clear_back_to_table_row_context();
                        self.insert_html_element(token_and_info)?;
                        self.insertion_mode = InsertionMode::InCell;
                        self.active_formatting_elements.insert_marker();
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
                            self.errors
                                .push(Error::new(token_and_info.span, ErrorKind::UnexpectedToken));
                        } else {
                            self.open_elements_stack.clear_back_to_table_row_context();
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
                            tag_name.as_ref(),
                            "caption" | "col" | "colgroup" | "tbody" | "tfoot" | "thead" | "tr"
                        ) =>
                    {
                        if !self.open_elements_stack.has_in_table_scope("tr") {
                            self.errors
                                .push(Error::new(token_and_info.span, ErrorKind::UnexpectedToken));
                        } else {
                            self.open_elements_stack.clear_back_to_table_row_context();
                            self.open_elements_stack.pop();
                            self.insertion_mode = InsertionMode::InTableBody;
                            self.process_token(token_and_info, None)?;
                        }
                    }
                    Token::EndTag { tag_name, .. } if tag_name == "table" => {
                        if !self.open_elements_stack.has_in_table_scope("tr") {
                            self.errors
                                .push(Error::new(token_and_info.span, ErrorKind::UnexpectedToken));
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
                        if matches!(tag_name.as_ref(), "tbody" | "tfoot" | "thead") =>
                    {
                        if !self.open_elements_stack.has_in_table_scope(tag_name) {
                            self.errors.push(Error::new(
                                token_and_info.span,
                                ErrorKind::EndTagWithoutMatchingOpenElement,
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
                            tag_name.as_ref(),
                            "body" | "caption" | "col" | "colgroup" | "html" | "td" | "th"
                        ) =>
                    {
                        self.errors
                            .push(Error::new(token_and_info.span, ErrorKind::UnexpectedToken));
                    }
                    // Anything else
                    //
                    // Process the token using the rules for the "in table" insertion mode.
                    _ => {
                        self.process_token_using_rules(token_and_info, InsertionMode::InTable)?;
                    }
                }
                // When the steps above require the UA to clear the stack back
                // to a table row context, it means that the UA must, while the
                // current node is not a tr, template, or html element, pop
                // elements from the stack of open elements.
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
                    Token::EndTag { tag_name, .. } if matches!(tag_name.as_ref(), "td" | "th") => {
                        if !self.open_elements_stack.has_in_table_scope(tag_name) {
                            self.errors
                                .push(Error::new(token_and_info.span, ErrorKind::UnexpectedToken));
                        } else {
                            self.open_elements_stack.generate_implied_end_tags();

                            match self.open_elements_stack.items.last() {
                                Some(node) if get_tag_name!(node) != tag_name => {
                                    self.errors.push(Error::new(
                                        token_and_info.span,
                                        ErrorKind::UnexpectedToken,
                                    ));
                                }
                                _ => {}
                            }

                            self.open_elements_stack
                                .pop_until_tag_name_popped(&[tag_name]);
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
                            tag_name.as_ref(),
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
                                .push(Error::new(token_and_info.span, ErrorKind::UnexpectedToken));
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
                            tag_name.as_ref(),
                            "body" | "caption" | "col" | "colgroup" | "html"
                        ) =>
                    {
                        self.errors
                            .push(Error::new(token_and_info.span, ErrorKind::UnexpectedToken));
                    }
                    // An end tag whose tag name is one of: "table", "tbody", "tfoot", "thead", "tr"
                    //
                    // If the stack of open elements does not have an element in table scope that is
                    // an HTML element with the same tag name as that of the token, then this is a
                    // parse error; ignore the token.
                    //
                    // Otherwise, close the cell (see below) and reprocess the token.
                    Token::EndTag { tag_name, .. }
                        if matches!(
                            tag_name.as_ref(),
                            "table" | "tbody" | "tfoot" | "thead" | "tr"
                        ) =>
                    {
                        if !self.open_elements_stack.has_in_table_scope(tag_name) {
                            self.errors
                                .push(Error::new(token_and_info.span, ErrorKind::UnexpectedToken))
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
                            .push(Error::new(token_and_info.span, ErrorKind::MisplacedDoctype));
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
                    Token::StartTag { tag_name, .. } if tag_name == "option" => {
                        match self.open_elements_stack.items.last() {
                            Some(node) if get_tag_name!(node) == "option" => {
                                self.open_elements_stack.pop();
                            }
                            _ => {}
                        }

                        self.insert_character(token_and_info)?;
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
                    Token::StartTag { tag_name, .. } if tag_name == "optgroup" => {
                        match self.open_elements_stack.items.last() {
                            Some(node) if get_tag_name!(node) == "option" => {
                                self.open_elements_stack.pop();
                            }
                            _ => {}
                        }

                        match self.open_elements_stack.items.last() {
                            Some(node) if get_tag_name!(node) == "optgroup" => {
                                self.open_elements_stack.pop();
                            }
                            _ => {}
                        }

                        self.insert_html_element(token_and_info)?;
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
                            Some(node) if get_tag_name!(node) == "option" => {
                                match self
                                    .open_elements_stack
                                    .items
                                    // `-1` is `current node`, because `The current node is the
                                    // bottommost node in this stack of open elements.`
                                    // `-2` is node immediately before it in the stack of open
                                    // elements
                                    .get(self.open_elements_stack.items.len() - 2)
                                {
                                    Some(node) if get_tag_name!(node) == "optgroup" => {
                                        self.open_elements_stack.pop();
                                    }
                                    _ => {}
                                }
                            }
                            _ => {}
                        }

                        match self.open_elements_stack.items.last() {
                            Some(node) if get_tag_name!(node) == "optgroup" => {
                                self.open_elements_stack.pop();
                            }
                            _ => self
                                .errors
                                .push(Error::new(token_and_info.span, ErrorKind::UnexpectedToken)),
                        }
                    }
                    // An end tag whose tag name is "option"
                    //
                    // If the current node is an option element, then pop that node from the stack
                    // of open elements. Otherwise, this is a parse error; ignore the token.
                    Token::EndTag { tag_name, .. } if tag_name == "option" => {
                        match self.open_elements_stack.items.last() {
                            Some(node) if get_tag_name!(node) == "option" => {
                                self.open_elements_stack.pop();
                            }
                            _ => self
                                .errors
                                .push(Error::new(token_and_info.span, ErrorKind::UnexpectedToken)),
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
                            self.errors
                                .push(Error::new(token_and_info.span, ErrorKind::UnexpectedToken));
                        } else {
                            self.open_elements_stack
                                .pop_until_tag_name_popped(&["select"]);
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
                        self.errors
                            .push(Error::new(token_and_info.span, ErrorKind::UnexpectedToken));

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
                        if matches!(tag_name.as_ref(), "input" | "keygen" | "textarea") =>
                    {
                        self.errors
                            .push(Error::new(token_and_info.span, ErrorKind::UnexpectedToken));

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
                        if matches!(tag_name.as_ref(), "script" | "template") =>
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
                    _ => {
                        self.errors
                            .push(Error::new(token_and_info.span, ErrorKind::UnexpectedToken));
                    }
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
                            tag_name.as_ref(),
                            "caption" | "table" | "tbody" | "tfoot" | "thead" | "tr" | "td" | "th"
                        ) =>
                    {
                        self.errors
                            .push(Error::new(token_and_info.span, ErrorKind::UnexpectedToken));
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
                            tag_name.as_ref(),
                            "caption" | "table" | "tbody" | "tfoot" | "thead" | "tr" | "td" | "th"
                        ) =>
                    {
                        self.errors
                            .push(Error::new(token_and_info.span, ErrorKind::UnexpectedToken));

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
                            tag_name.as_ref(),
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
                            tag_name.as_ref(),
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
                    Token::StartTag { tag_name, .. }
                        if matches!(tag_name.as_ref(), "td" | "th") =>
                    {
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
                    Token::EndTag { .. } => {
                        self.errors
                            .push(Error::new(token_and_info.span, ErrorKind::UnexpectedToken));
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
                            self.errors
                                .push(Error::new(token_and_info.span, ErrorKind::UnexpectedToken));
                        }

                        self.open_elements_stack
                            .pop_until_tag_name_popped(&["template"]);
                        self.active_formatting_elements.clear_to_last_marker();
                        self.template_insertion_mode_stack.pop();
                        self.reset_insertion_mode();
                        self.process_token(token_and_info, None)?;
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
                    Token::Character { value, .. }
                        if matches!(value, '\x09' | '\x0A' | '\x0C' | '\x0D' | '\x20') =>
                    {
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
                            .push(Error::new(token_and_info.span, ErrorKind::MisplacedDoctype));
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
                            self.errors
                                .push(Error::new(token_and_info.span, ErrorKind::UnexpectedToken));
                        } else {
                            self.insertion_mode = InsertionMode::AfterAfterBody;
                        }
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
                        self.errors
                            .push(Error::new(token_and_info.span, ErrorKind::UnexpectedToken));

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
                    Token::Character { value, .. }
                        if matches!(value, '\x09' | '\x0A' | '\x0C' | '\x0D' | '\x20') =>
                    {
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
                            .push(Error::new(token_and_info.span, ErrorKind::MisplacedDoctype));
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
                    Token::StartTag { tag_name, .. } if tag_name == "frameset" => {
                        self.insert_html_element(token_and_info)?;
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
                                if get_tag_name!(node) == "html"
                                    && self.open_elements_stack.items.len() == 1 =>
                            {
                                true
                            }
                            _ => false,
                        };

                        if is_root_html_document {
                            self.errors
                                .push(Error::new(token_and_info.span, ErrorKind::UnexpectedToken));
                        } else {
                            self.open_elements_stack.pop();

                            if !self.is_fragment_case {
                                match self.open_elements_stack.items.last() {
                                    Some(node) if get_tag_name!(node) != "frameset" => {
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
                        self_closing,
                        ..
                    } if tag_name == "frame" => {
                        let is_self_closing = *self_closing;

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
                        match self.open_elements_stack.items.last() {
                            Some(node) if get_tag_name!(node) != "html" => {
                                self.errors
                                    .push(Error::new(token_and_info.span, ErrorKind::Eof));
                            }
                            _ => {}
                        }

                        self.stopped = true;
                    }
                    // Anything else
                    //
                    // Parse error. Ignore the token.
                    _ => {
                        self.errors
                            .push(Error::new(token_and_info.span, ErrorKind::UnexpectedToken));
                    }
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
                    Token::Character { value, .. }
                        if matches!(value, '\x09' | '\x0A' | '\x0C' | '\x0D' | '\x20') =>
                    {
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
                            .push(Error::new(token_and_info.span, ErrorKind::MisplacedDoctype));
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
                    _ => {
                        self.errors
                            .push(Error::new(token_and_info.span, ErrorKind::UnexpectedToken));
                    }
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
                    Token::Character { value, .. }
                        if matches!(value, '\x09' | '\x0A' | '\x0C' | '\x0D' | '\x20') =>
                    {
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
                        self.errors
                            .push(Error::new(token_and_info.span, ErrorKind::UnexpectedToken));
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
                    Token::Character { value, .. }
                        if matches!(value, '\x09' | '\x0A' | '\x0C' | '\x0D' | '\x20') =>
                    {
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
                    // A start tag whose tag name is "noframes"
                    //
                    // Process the token using the rules for the "in head" insertion mode.
                    Token::StartTag { tag_name, .. } if tag_name == "noframes" => {
                        self.process_token_using_rules(token_and_info, InsertionMode::InHead)?;
                    }
                    // Anything else
                    //
                    // Parse error. Ignore the token.
                    _ => {}
                }
            }
        }

        Ok(())
    }

    fn process_token_using_rules(
        &mut self,
        token_and_info: &mut TokenAndInfo,
        insertion_mode: InsertionMode,
    ) -> PResult<()> {
        self.process_token(token_and_info, Some(insertion_mode))?;

        Ok(())
    }

    fn adjust_attributes<F>(&mut self, token_and_info: &mut TokenAndInfo, mut map: F)
    where
        F: FnMut(JsWord) -> Option<JsWord>,
    {
        let attributes = match &mut token_and_info.token {
            Token::StartTag { attributes, .. } => attributes,
            _ => {
                unreachable!();
            }
        };

        for &mut AttributeToken { ref mut name, .. } in attributes {
            if let Some(replacement) = map(name.clone()) {
                *name = replacement;
            }
        }
    }

    fn adjust_math_ml_attributes(&mut self, token_and_info: &mut TokenAndInfo) {
        self.adjust_attributes(token_and_info, |attribute| match &*attribute {
            "definitionurl" => Some("definitionURL".into()),
            _ => None,
        });
    }

    fn adjust_svg_attributes(&mut self, token_and_info: &mut TokenAndInfo) {
        self.adjust_attributes(token_and_info, |attribute| match &*attribute {
            "attributename" => Some("attributeName".into()),
            "attributetype" => Some("attributeType".into()),
            "basefrequency" => Some("baseFrequency".into()),
            "baseprofile" => Some("baseProfile".into()),
            "calcmode" => Some("calcMode".into()),
            "clippathunits" => Some("clipPathUnits".into()),
            "diffuseconstant" => Some("diffuseConstant".into()),
            "edgemode" => Some("edgeMode".into()),
            "filterunits" => Some("filterUnits".into()),
            "glyphref" => Some("glyphRef".into()),
            "gradienttransform" => Some("gradientTransform".into()),
            "gradientunits" => Some("gradientUnits".into()),
            "kernelmatrix" => Some("kernelMatrix".into()),
            "kernelunitlength" => Some("kernelUnitLength".into()),
            "keypoints" => Some("keyPoints".into()),
            "keysplines" => Some("keySplines".into()),
            "keytimes" => Some("keyTimes".into()),
            "lengthadjust" => Some("lengthAdjust".into()),
            "limitingconeangle" => Some("limitingConeAngle".into()),
            "markerheight" => Some("markerHeight".into()),
            "markerunits" => Some("markerUnits".into()),
            "markerwidth" => Some("markerWidth".into()),
            "maskcontentunits" => Some("maskContentUnits".into()),
            "maskunits" => Some("maskUnits".into()),
            "numoctaves" => Some("numOctaves".into()),
            "pathlength" => Some("pathLength".into()),
            "patterncontentunits" => Some("patternContentUnits".into()),
            "patterntransform" => Some("patternTransform".into()),
            "patternunits" => Some("patternUnits".into()),
            "pointsatx" => Some("pointsAtX".into()),
            "pointsaty" => Some("pointsAtY".into()),
            "pointsatz" => Some("pointsAtZ".into()),
            "preservealpha" => Some("preserveAlpha".into()),
            "preserveaspectratio" => Some("preserveAspectRatio".into()),
            "primitiveunits" => Some("primitiveUnits".into()),
            "refx" => Some("refX".into()),
            "refy" => Some("refY".into()),
            "repeatcount" => Some("repeatCount".into()),
            "repeatdur" => Some("repeatDur".into()),
            "requiredextensions" => Some("requiredExtensions".into()),
            "requiredfeatures" => Some("requiredFeatures".into()),
            "specularconstant" => Some("specularConstant".into()),
            "specularexponent" => Some("specularExponent".into()),
            "spreadmethod" => Some("spreadMethod".into()),
            "startoffset" => Some("startOffset".into()),
            "stddeviation" => Some("stdDeviation".into()),
            "stitchtiles" => Some("stitchTiles".into()),
            "surfacescale" => Some("surfaceScale".into()),
            "systemlanguage" => Some("systemLanguage".into()),
            "tablevalues" => Some("tableValues".into()),
            "targetx" => Some("targetX".into()),
            "targety" => Some("targetY".into()),
            "textlength" => Some("textLength".into()),
            "viewbox" => Some("viewBox".into()),
            "viewtarget" => Some("viewTarget".into()),
            "xchannelselector" => Some("xChannelSelector".into()),
            "ychannelselector" => Some("yChannelSelector".into()),
            "zoomandpan" => Some("zoomAndPan".into()),
            _ => None,
        });
    }

    fn adjust_foreign_attributes_for_the_token(&mut self, _token_and_info: &mut TokenAndInfo) {}

    fn run_the_adoption_agency_algorithm(&mut self, _token_and_info: &mut TokenAndInfo) {}

    fn reconstruct_the_active_formatting_elements(&mut self) -> PResult<()> {
        Ok(())
    }

    fn create_fake_html_element(&self) -> RcNode {
        Node::new(Child::Element(Element {
            span: Default::default(),
            tag_name: "html".into(),
            namespace: Namespace::HTML,
            attributes: vec![],
            children: vec![],
        }))
    }

    // Parsing elements that contain only text
    // The generic raw text element parsing algorithm and the generic RCDATA element
    // parsing algorithm consist of the following steps. These algorithms are always
    // invoked in response to a start tag token.
    fn parse_generic_text_element(
        &mut self,
        token_and_info: &mut TokenAndInfo,
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

    fn close_p_element(&mut self) {
        // When the steps above say the user agent is to close a p element, it means
        // that the user agent must run the following steps:

        // 1. Generate implied end tags, except for p elements.
        self.open_elements_stack
            .generate_implied_end_tags_with_exclusion("p");

        // 2. If the current node is not a p element, then this is a parse error.
        match self.open_elements_stack.items.last() {
            Some(node) if get_tag_name!(node) == "p" => match &node.data {
                Child::Element(element) => {
                    self.errors
                        .push(Error::new(element.span, ErrorKind::UnexpectedToken));
                }
                _ => {
                    unreachable!();
                }
            },
            _ => {}
        }

        // 3. Pop elements from the stack of open elements until a p element has been
        // popped from the stack.
        self.open_elements_stack.pop_until_tag_name_popped(&["p"]);
    }

    fn close_the_cell(&mut self) {
        // Generate implied end tags.
        self.open_elements_stack.generate_implied_end_tags();

        // If the current node is not now a td element or a th element, then this is a
        // parse error.
        match self.open_elements_stack.items.last() {
            Some(node) if matches!(get_tag_name!(node).as_ref(), "td" | "th") => {
                match &node.data {
                    Child::Element(element) => {
                        self.errors
                            .push(Error::new(element.span, ErrorKind::UnexpectedToken));
                    }
                    _ => {
                        unreachable!();
                    }
                };
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
        // 2. Let node be the last node in the stack of open elements.
        let mut iter = self.open_elements_stack.items.iter().rev();
        let mut node = iter.next();

        let first = self.open_elements_stack.items.first();

        while let Some(inner_node) = node {
            // 3. Loop: If node is the first node in the stack of open elements, then set
            // last to true, and, if the parser was created as part of the HTML fragment
            // parsing algorithm (fragment case), set node to the context element passed to
            // that algorithm.
            // TODO eq with/without span?
            if is_same_node(first.unwrap(), inner_node) {
                last = true;

                if self.is_fragment_case {
                    // Fragment case

                    // node = self.context_element;
                }
            }

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
            if get_tag_name!(inner_node) == "select" {
                if !last {
                    let mut ancestor = node;

                    while ancestor.is_some() {
                        if let Some(ancestor) = ancestor {
                            if let Some(first) = first {
                                if ancestor.data.eq_ignore_span(&first.data) {
                                    break;
                                }
                            }
                        }

                        ancestor = iter.next();

                        if let Some(ancestor) = ancestor {
                            if get_tag_name!(ancestor) == "template" {
                                break;
                            } else if get_tag_name!(ancestor) == "table" {
                                self.insertion_mode = InsertionMode::InSelectInTable;

                                return;
                            }
                        }
                    }
                }

                self.insertion_mode = InsertionMode::InSelect;
            }

            // 5. If node is a td or th element and last is false, then switch the insertion
            // mode to "in cell" and return.
            if (get_tag_name!(inner_node) == "td" || get_tag_name!(inner_node) == "th") && !last {
                self.insertion_mode = InsertionMode::InCell;

                break;
            }

            // 6. If node is a tr element, then switch the insertion mode to "in row" and
            // return.
            if get_tag_name!(inner_node) == "tr" {
                self.insertion_mode = InsertionMode::InRow;

                break;
            }

            // 7. If node is a tbody, thead, or tfoot element, then switch the insertion
            // mode to "in table body" and return.
            if get_tag_name!(inner_node) == "tbody"
                || get_tag_name!(inner_node) == "thead"
                || get_tag_name!(inner_node) == "tfoot"
            {
                self.insertion_mode = InsertionMode::InTableBody;

                break;
            }

            // 8. If node is a caption element, then switch the insertion mode to "in
            // caption" and return.
            if get_tag_name!(inner_node) == "caption" {
                self.insertion_mode = InsertionMode::InCaption;

                break;
            }

            // 9. If node is a colgroup element, then switch the insertion mode to "in
            // column group" and return.
            if get_tag_name!(inner_node) == "colgroup" {
                self.insertion_mode = InsertionMode::InColumnGroup;

                break;
            }

            // 10. If node is a table element, then switch the insertion mode to "in table"
            // and return.
            if get_tag_name!(inner_node) == "table" {
                self.insertion_mode = InsertionMode::InTable;

                break;
            }

            // 11. If node is a template element, then switch the insertion mode to the
            // current template insertion mode and return.
            if get_tag_name!(inner_node) == "template" {
                self.insertion_mode = match self.template_insertion_mode_stack.first() {
                    Some(insertion_mode) => insertion_mode.clone(),
                    _ => {
                        unreachable!();
                    }
                };

                break;
            }

            // 12. If node is a head element and last is false, then switch the insertion
            // mode to "in head" and return.
            if get_tag_name!(inner_node) == "head" && !last {
                self.insertion_mode = InsertionMode::InHead;

                break;
            }

            // 13. If node is a body element, then switch the insertion mode to "in body"
            // and return.
            if get_tag_name!(inner_node) == "body" {
                self.insertion_mode = InsertionMode::InBody;

                break;
            }

            // 14. If node is a frameset element, then switch the insertion mode to "in
            // frameset" and return. (fragment case)
            if get_tag_name!(inner_node) == "frameset" {
                self.insertion_mode = InsertionMode::InFrameset;

                break;
            }

            // 15. If node is an html element, run these substeps:
            //
            //   1. If the head element pointer is null, switch the insertion mode to
            // "before head" and return. (fragment case)
            //
            //   2. Otherwise, the head element pointer is not null, switch the insertion
            // mode to "after head" and return.
            if get_tag_name!(inner_node) == "html" {
                if self.head_element_pointer.is_none() {
                    // Fragment case
                    self.insertion_mode = InsertionMode::BeforeHead;
                } else {
                    self.insertion_mode = InsertionMode::AfterHead;
                }

                break;
            }

            // 16. If last is true, then switch the insertion mode to "in body" and return.
            // (fragment case)
            if last {
                self.insertion_mode = InsertionMode::InBody;

                break;
            }

            // 17. Let node now be the node before node in the stack of open elements.
            node = iter.next();
            // 18. Return to the step labeled loop.
        }
    }

    fn is_special_element(&self, node: &RcNode) -> bool {
        if get_namespace!(node) == Namespace::HTML {
            return matches!(
                get_tag_name!(node),
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
            );
        } else if get_namespace!(node) == Namespace::MATHML {
            return matches!(
                get_tag_name!(node),
                "mi" | "mo" | "mn" | "ms" | "mtext" | "annotation-xml"
            );
        } else if get_namespace!(node) == Namespace::SVG {
            return matches!(get_tag_name!(node), "title" | "foreignObject" | "desc");
        }

        false
    }

    // Gets the appropriate place to insert the node.
    fn get_appropriate_place_for_inserting_node(
        &mut self,
        override_target: Option<RcNode>,
    ) -> InsertionPosition {
        // If there was an override target specified, then let target be the
        // override target. Otherwise, let target be the current node.
        // TODO avoid unwrap, i.e. self.open_elems.last().expect("no current element")
        let target = override_target
            .unwrap_or_else(|| self.open_elements_stack.items.last().unwrap().clone());

        // NOTE: Foster parenting happens when content is misnested in tables.
        // TODO fix me
        // let adjusted_insertion_cocation = if self.foster_parenting_enabled {
        //     target
        // } else {
        //     target
        // };

        // TODO handle document
        // let html_elem = self.html_elem();

        InsertionPosition::LastChild(target)
    }

    // Inserts a comment node in to the document while processing a comment token.
    fn insert_comment(&mut self, token_and_info: &mut TokenAndInfo) -> PResult<()> {
        // Let data be the data given in the comment token being processed.
        // If position was specified, then let the adjusted insertion location
        // be position. Otherwise, let adjusted insertion location be the
        // appropriate place for inserting a node.
        let adjusted_insertion_location = self.get_appropriate_place_for_inserting_node(None);

        // Create a Comment node whose data attribute is set to data and whose
        // node document is the same as that of the node in which the adjusted
        // insertion location finds itself.
        let last_pos = self.input.last_pos()?;
        let comment = Node::new(Child::Comment(Comment {
            span: Span::new(token_and_info.span.lo, last_pos, Default::default()),
            data: match &token_and_info.token {
                Token::Comment { data } => data.into(),
                _ => {
                    unreachable!()
                }
            },
        }));

        // Insert the newly created node at the adjusted insertion location.
        self.insert_at_position(adjusted_insertion_location, comment);

        Ok(())
    }

    fn insert_comment_as_last_child_of_document(
        &mut self,
        token_and_info: &mut TokenAndInfo,
    ) -> PResult<()> {
        let last_pos = self.input.last_pos()?;
        let comment = Node::new(Child::Comment(Comment {
            span: Span::new(token_and_info.span.lo, last_pos, Default::default()),
            data: match &token_and_info.token {
                Token::Comment { data } => data.into(),
                _ => {
                    unreachable!()
                }
            },
        }));

        if let Some(document) = &self.document {
            self.append_node(document, comment);
        }

        Ok(())
    }

    fn insert_comment_as_last_child_of_first_element(
        &mut self,
        token_and_info: &mut TokenAndInfo,
    ) -> PResult<()> {
        let last_pos = self.input.last_pos()?;
        let comment = Node::new(Child::Comment(Comment {
            span: Span::new(token_and_info.span.lo, last_pos, Default::default()),
            data: match &token_and_info.token {
                Token::Comment { data } => data.into(),
                _ => {
                    unreachable!()
                }
            },
        }));

        if let Some(html) = &self.open_elements_stack.items.get(0) {
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
        let adjusted_insertion_location = self.get_appropriate_place_for_inserting_node(None);

        // If the adjusted insertion location is in a Document node, then abort
        // these steps.
        // NOTE: The DOM will not let Document nodes have Text node children, so
        // they are dropped on the floor.
        // TODO fix me

        // If there is a Text node immediately before the adjusted insertion location,
        // then append data to that Text node's data. Otherwise, create
        // a new Text node whose data is data and whose node document is the
        // same as that of the element in which the adjusted insertion location
        // finds itself, and insert the newly created node at the adjusted
        // insertion location.
        match &adjusted_insertion_location {
            InsertionPosition::LastChild(parent) => {
                let mut children = parent.children.borrow_mut();

                if let Some(last) = children.last() {
                    if let Child::Text(text) = &last.data {
                        let mut new_value = String::new();

                        new_value.push_str(&*text.value);

                        match &token_and_info.token {
                            Token::Character { value, .. } => {
                                new_value.push(*value);
                            }
                            _ => {
                                unreachable!();
                            }
                        }

                        let first_pos = text.span.lo;
                        let last_pos = self.input.last_pos()?;
                        let index = children.len() - 1;

                        children[index] = Node::new(Child::Text(Text {
                            span: swc_common::Span::new(first_pos, last_pos, Default::default()),
                            value: new_value.into(),
                        }));

                        return Ok(());
                    }
                }
            }
            InsertionPosition::BeforeSibling(_node) => {
                // TODO improve me for another, not happens for comments right
                // now
            }
            InsertionPosition::TableFosterParenting { .. } => {
                // TODO improve me for another, but we don't support foster yet
            }
        }

        // Otherwise, create a new Text node whose data is data and whose node document
        // is the same as that of the element in which the adjusted insertion location
        // finds itself, and insert the newly created node at the adjusted insertion
        // location.
        let last_pos = self.input.last_pos()?;
        let text = Node::new(Child::Text(Text {
            span: Span::new(token_and_info.span.lo, last_pos, Default::default()),
            value: match &token_and_info.token {
                Token::Character { value, .. } => value.to_string().into(),
                _ => {
                    unreachable!()
                }
            },
        }));

        self.insert_at_position(adjusted_insertion_location, text);

        Ok(())
    }

    fn insert_html_element(&mut self, token_and_info: &mut TokenAndInfo) -> PResult<RcNode> {
        self.insert_foreign_element(token_and_info, Namespace::HTML)
    }

    fn insert_foreign_element(
        &mut self,
        token_and_info: &mut TokenAndInfo,
        namespace: Namespace,
    ) -> PResult<RcNode> {
        // Let the adjusted insertion location be the appropriate place for
        // inserting a node.
        let adjusted_insertion_location = self.get_appropriate_place_for_inserting_node(None);
        let (_node1, _node2) = match adjusted_insertion_location {
            InsertionPosition::LastChild(ref p) | InsertionPosition::BeforeSibling(ref p) => {
                (p.clone(), None)
            }
            InsertionPosition::TableFosterParenting {
                ref element,
                ref prev_element,
            } => (element.clone(), Some(prev_element.clone())),
        };

        // Create an element for the token in the given namespace, with the
        // intended parent being the element in which the adjusted insertion
        // location finds itself.
        let last_pos = self.input.last_pos()?;
        let element = create_element_for_token(
            token_and_info.token.clone(),
            Span::new(token_and_info.span.lo, last_pos, Default::default()),
            Some(namespace),
        )?;
        let node = create_node_for_element(element);

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
                // TODO span?
                .find(|&(_, child)| Rc::ptr_eq(child, node))
            {
                Some((i, _)) => i,
                None => {
                    // TODO error - have parent but couldn't find in parent's children
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
            InsertionPosition::TableFosterParenting {
                element,
                prev_element,
            } => {
                let parent = element.parent.take();
                let has_parent = parent.is_some();

                element.parent.set(parent);

                if has_parent {
                    self.append_node_before_sibling(&element, node);
                } else {
                    self.append_node(&prev_element, node);
                }
            }
        }
    }
}

fn create_node_for_element(element: Element) -> RcNode {
    Node::new(Child::Element(element))
}

fn is_same_node(a: &RcNode, b: &RcNode) -> bool {
    Rc::ptr_eq(a, b)
}

fn create_element_for_token(
    token: Token,
    span: Span,
    namespace: Option<Namespace>,
) -> PResult<Element> {
    let element = match token {
        Token::StartTag {
            tag_name,
            attributes,
            ..
        }
        | Token::EndTag {
            tag_name,
            attributes,
            ..
        } => {
            Element {
                span,
                tag_name,
                namespace: namespace.unwrap(),
                // TODO span
                attributes: attributes
                    .into_iter()
                    .map(|attribute| Attribute {
                        span: Default::default(),
                        name: attribute.name.clone(),
                        value: attribute.value,
                    })
                    .collect(),
                children: vec![],
            }
        }
        _ => {
            unreachable!();
        }
    };

    Ok(element)
}

impl<I> Parse<Document> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<Document> {
        self.parse_document()
    }
}
