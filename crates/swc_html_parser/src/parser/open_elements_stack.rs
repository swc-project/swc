use swc_html_ast::*;

use crate::parser::{
    is_html_integration_point, is_mathml_text_integration_point, is_same_node, Data, RcNode,
};

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

pub struct OpenElementsStack {
    pub items: Vec<RcNode>,
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

    pub fn insert(&mut self, index: usize, node: RcNode) {
        if get_tag_name!(node) == "template" {
            self.template_element_count += 1;
        }

        self.items.insert(index, node);
    }

    pub fn replace(&mut self, index: usize, node: RcNode) {
        if let Some(item) = self.items.get(index) {
            if get_tag_name!(item) == "template" {
                self.template_element_count -= 1;
            }

            if get_tag_name!(node) == "template" {
                self.template_element_count += 1;
            }

            self.items[index] = node;
        }
    }

    pub fn remove(&mut self, node: &RcNode) {
        let position = self.items.iter().rposition(|x| is_same_node(node, x));

        if let Some(position) = position {
            if get_tag_name!(node) == "template" {
                self.template_element_count -= 1;
            }

            self.items.remove(position);
        }
    }

    pub fn contains_template_element(&self) -> bool {
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

    pub fn has_node_in_scope(&self, target: &RcNode) -> bool {
        let mut iter = self.items.iter().rev();
        // 1. Initialize node to be the current node (the bottommost node of the stack).
        let mut node = iter.next();

        while let Some(inner_node) = node {
            // 2. If node is the target node, terminate in a match state.
            if is_same_node(target, inner_node) {
                return true;
            }

            // 3. Otherwise, if node is one of the element types in list, terminate in a
            // failure state.
            for element_and_ns in SPECIFIC_SCOPE {
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
        while let Some(node) = self.pop() {
            if tag_name.contains(&get_tag_name!(node)) && get_namespace!(node) == Namespace::HTML {
                break;
            }
        }
    }

    pub fn pop_until_node(&mut self, until_to_node: &RcNode) {
        while let Some(node) = &self.pop() {
            if is_same_node(node, until_to_node) {
                break;
            }
        }
    }

    // While the current node is not a MathML text integration point, an HTML
    // integration point, or an element in the HTML namespace, pop elements from
    // the stack of open elements.
    pub fn pop_until_in_foreign(&mut self) {
        while let Some(node) = self.pop() {
            match &node.data {
                Data::Element(Element { namespace, .. }) if *namespace == Namespace::HTML => {
                    break;
                }
                _ if is_mathml_text_integration_point(Some(&node))
                    || is_html_integration_point(Some(&node)) =>
                {
                    break;
                }
                _ => {}
            }
        }
    }
}
