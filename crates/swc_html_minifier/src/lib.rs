#![deny(clippy::all)]

use std::cmp::Ordering;

use once_cell::sync::Lazy;
use serde_json::Value;
use swc_atoms::{js_word, JsWord};
use swc_cached::regex::CachedRegex;
use swc_common::{
    collections::{AHashMap, AHashSet},
    comments::SingleThreadedComments,
    sync::Lrc,
    FileName, FilePathMapping, Mark, SourceMap,
};
use swc_html_ast::*;
use swc_html_parser::parser::ParserConfig;
use swc_html_utils::{HTML_DEFAULT_ATTRIBUTES, SVG_ELEMENTS_AND_ATTRIBUTES};
use swc_html_visit::{VisitMut, VisitMutWith};

use crate::option::{
    CollapseWhitespaces, CssOptions, JsOptions, JsParserOptions, JsonOptions, MinifierType,
    MinifyCssOption, MinifyJsOption, MinifyJsonOption, MinifyOptions,
};
pub mod option;

static HTML_BOOLEAN_ATTRIBUTES: &[&str] = &[
    "allowfullscreen",
    "async",
    "autofocus",
    "autoplay",
    "checked",
    "controls",
    "default",
    "defer",
    "disabled",
    "formnovalidate",
    "hidden",
    "inert",
    "ismap",
    "itemscope",
    "loop",
    "multiple",
    "muted",
    "nomodule",
    "novalidate",
    "open",
    "playsinline",
    "readonly",
    "required",
    "reversed",
    "selected",
    // Legacy
    "declare",
    "defaultchecked",
    "defaultmuted",
    "defaultselected",
    "enabled",
    "compact",
    "indeterminate",
    "sortable",
    "nohref",
    "noresize",
    "noshade",
    "truespeed",
    "typemustmatch",
    "nowrap",
    "visible",
    "pauseonexit",
    "scoped",
    "seamless",
];

// Global attributes
static EVENT_HANDLER_ATTRIBUTES: &[&str] = &[
    "onabort",
    "onautocomplete",
    "onautocompleteerror",
    "onauxclick",
    "onbeforematch",
    "oncancel",
    "oncanplay",
    "oncanplaythrough",
    "onchange",
    "onclick",
    "onclose",
    "oncontextlost",
    "oncontextmenu",
    "oncontextrestored",
    "oncuechange",
    "ondblclick",
    "ondrag",
    "ondragend",
    "ondragenter",
    "ondragexit",
    "ondragleave",
    "ondragover",
    "ondragstart",
    "ondrop",
    "ondurationchange",
    "onemptied",
    "onended",
    "onformdata",
    "oninput",
    "oninvalid",
    "onkeydown",
    "onkeypress",
    "onkeyup",
    "onmousewheel",
    "onmousedown",
    "onmouseenter",
    "onmouseleave",
    "onmousemove",
    "onmouseout",
    "onmouseover",
    "onmouseup",
    "onpause",
    "onplay",
    "onplaying",
    "onprogress",
    "onratechange",
    "onreset",
    "onsecuritypolicyviolation",
    "onseeked",
    "onseeking",
    "onselect",
    "onslotchange",
    "onstalled",
    "onsubmit",
    "onsuspend",
    "ontimeupdate",
    "ontoggle",
    "onvolumechange",
    "onwaiting",
    "onwebkitanimationend",
    "onwebkitanimationiteration",
    "onwebkitanimationstart",
    "onwebkittransitionend",
    "onwheel",
    "onblur",
    "onerror",
    "onfocus",
    "onload",
    "onloadeddata",
    "onloadedmetadata",
    "onloadstart",
    "onresize",
    "onscroll",
    "onafterprint",
    "onbeforeprint",
    "onbeforeunload",
    "onhashchange",
    "onlanguagechange",
    "onmessage",
    "onmessageerror",
    "onoffline",
    "ononline",
    "onpagehide",
    "onpageshow",
    "onpopstate",
    "onrejectionhandled",
    "onstorage",
    "onunhandledrejection",
    "onunload",
    "oncut",
    "oncopy",
    "onpaste",
    "onreadystatechange",
    "onvisibilitychange",
    "onshow",
    "onsort",
];

static ALLOW_TO_TRIM_GLOBAL_ATTRIBUTES: &[&str] = &["style", "tabindex", "itemid"];

static ALLOW_TO_TRIM_HTML_ATTRIBUTES: &[(&str, &str)] = &[
    ("head", "profile"),
    ("audio", "src"),
    ("embed", "src"),
    ("iframe", "src"),
    ("img", "src"),
    ("input", "src"),
    ("input", "usemap"),
    ("input", "longdesc"),
    ("script", "src"),
    ("source", "src"),
    ("track", "src"),
    ("video", "src"),
    ("video", "poster"),
    ("td", "colspan"),
    ("td", "rowspan"),
    ("th", "colspan"),
    ("th", "rowspan"),
    ("col", "span"),
    ("colgroup", "span"),
    ("textarea", "cols"),
    ("textarea", "rows"),
    ("textarea", "maxlength"),
    ("input", "size"),
    ("input", "formaction"),
    ("input", "maxlength"),
    ("button", "formaction"),
    ("select", "size"),
    ("form", "action"),
    ("object", "data"),
    ("object", "codebase"),
    ("object", "classid"),
    ("applet", "codebase"),
    ("a", "href"),
    ("area", "href"),
    ("link", "href"),
    ("base", "href"),
    ("q", "cite"),
    ("blockquote", "cite"),
    ("del", "cite"),
    ("ins", "cite"),
    ("img", "usemap"),
    ("object", "usemap"),
];

static COMMA_SEPARATED_HTML_ATTRIBUTES: &[(&str, &str)] = &[
    ("img", "srcset"),
    ("source", "srcset"),
    ("img", "sizes"),
    ("source", "sizes"),
    ("link", "media"),
    ("source", "media"),
    ("style", "media"),
];

static COMMA_SEPARATED_SVG_ATTRIBUTES: &[(&str, &str)] = &[
    ("style", "media"),
    ("polyline", "points"),
    ("polygon", "points"),
];

static SPACE_SEPARATED_GLOBAL_ATTRIBUTES: &[&str] = &[
    "class",
    "itemprop",
    "itemref",
    "itemtype",
    "part",
    "accesskey",
    "aria-describedby",
    "aria-labelledby",
    "aria-owns",
];

static SPACE_SEPARATED_HTML_ATTRIBUTES: &[(&str, &str)] = &[
    ("a", "rel"),
    ("a", "ping"),
    ("area", "rel"),
    ("area", "ping"),
    ("link", "rel"),
    ("link", "sizes"),
    ("link", "blocking"),
    ("iframe", "sandbox"),
    ("td", "headers"),
    ("th", "headers"),
    ("output", "for"),
    ("script", "blocking"),
    ("style", "blocking"),
    ("input", "autocomplete"),
    ("form", "rel"),
    ("form", "autocomplete"),
];

static SPACE_SEPARATED_SVG_ATTRIBUTES: &[(&str, &str)] = &[
    ("svg", "preserveAspectRatio"),
    ("symbol", "preserveAspectRatio"),
    ("image", "preserveAspectRatio"),
    ("feImage", "preserveAspectRatio"),
    ("pattern", "preserveAspectRatio"),
    ("view", "preserveAspectRatio"),
];

enum CssMinificationMode {
    Stylesheet,
    ListOfDeclarations,
    MediaQueryList,
}

enum HtmlMinificationMode {
    ConditionalComments,
    DocumentIframeSrcdoc,
}

enum HtmlRoot {
    Document(Document),
    DocumentFragment(DocumentFragment),
}

#[inline(always)]
fn is_whitespace(c: char) -> bool {
    matches!(c, '\x09' | '\x0a' | '\x0c' | '\x0d' | '\x20')
}

#[derive(Debug, Copy, Clone)]
struct WhitespaceMinificationMode {
    pub trim: bool,
    pub collapse: bool,
}

#[derive(Debug, Eq, PartialEq)]
enum Display {
    None,
    Inline,
    InlineBlock,
    Block,
    ListItem,
    Ruby,
    RubyBase,
    RubyText,
    Table,
    TableColumnGroup,
    TableCaption,
    TableColumn,
    TableRow,
    TableCell,
    TableHeaderGroup,
    TableRowGroup,
    TableFooterGroup,
    Contents,
}

#[derive(Debug, Eq, PartialEq)]
enum WhiteSpace {
    Pre,
    Normal,
}

pub static CONDITIONAL_COMMENT_START: Lazy<CachedRegex> =
    Lazy::new(|| CachedRegex::new("^\\[if\\s[^\\]+]").unwrap());

pub static CONDITIONAL_COMMENT_END: Lazy<CachedRegex> =
    Lazy::new(|| CachedRegex::new("\\[endif]").unwrap());

struct Minifier<'a> {
    options: &'a MinifyOptions,

    current_element: Option<Element>,
    latest_element: Option<Child>,
    descendant_of_pre: bool,
    attribute_name_counter: Option<AHashMap<JsWord, usize>>,
}

fn get_white_space(namespace: Namespace, tag_name: &str) -> WhiteSpace {
    match namespace {
        Namespace::HTML => match tag_name {
            "textarea" | "code" | "pre" | "listing" | "plaintext" | "xmp" => WhiteSpace::Pre,
            _ => WhiteSpace::Normal,
        },
        _ => WhiteSpace::Normal,
    }
}

impl Minifier<'_> {
    fn is_event_handler_attribute(&self, name: &str) -> bool {
        EVENT_HANDLER_ATTRIBUTES.contains(&name)
    }

    fn is_boolean_attribute(&self, name: &str) -> bool {
        HTML_BOOLEAN_ATTRIBUTES.contains(&name)
    }

    fn is_trimable_separated_attribute(&self, element: &Element, attribute_name: &str) -> bool {
        if ALLOW_TO_TRIM_GLOBAL_ATTRIBUTES.contains(&attribute_name) {
            return true;
        }

        match element.namespace {
            Namespace::HTML => {
                ALLOW_TO_TRIM_HTML_ATTRIBUTES.contains(&(&element.tag_name, attribute_name))
            }
            _ => false,
        }
    }

    fn is_comma_separated_attribute(&self, element: &Element, attribute_name: &str) -> bool {
        match element.namespace {
            Namespace::HTML => match attribute_name {
                "content"
                    if &*element.tag_name == "meta"
                        && (self.element_has_attribute_with_value(
                            element,
                            "name",
                            &["viewport", "keywords"],
                        )) =>
                {
                    true
                }
                "imagesrcset"
                    if &*element.tag_name == "link"
                        && self.element_has_attribute_with_value(element, "rel", &["preload"]) =>
                {
                    true
                }
                "imagesizes"
                    if &*element.tag_name == "link"
                        && self.element_has_attribute_with_value(element, "rel", &["preload"]) =>
                {
                    true
                }
                "accept"
                    if &*element.tag_name == "input"
                        && self.element_has_attribute_with_value(element, "type", &["file"]) =>
                {
                    true
                }
                _ => COMMA_SEPARATED_HTML_ATTRIBUTES.contains(&(&element.tag_name, attribute_name)),
            },
            Namespace::SVG => {
                COMMA_SEPARATED_SVG_ATTRIBUTES.contains(&(&element.tag_name, attribute_name))
            }
            _ => false,
        }
    }

    fn is_space_separated_attribute(&self, element: &Element, attribute_name: &str) -> bool {
        if SPACE_SEPARATED_GLOBAL_ATTRIBUTES.contains(&attribute_name) {
            return true;
        }

        match element.namespace {
            Namespace::HTML => {
                SPACE_SEPARATED_HTML_ATTRIBUTES.contains(&(&element.tag_name, attribute_name))
            }
            Namespace::SVG => {
                SPACE_SEPARATED_SVG_ATTRIBUTES.contains(&(&element.tag_name, attribute_name))
            }
            _ => false,
        }
    }

    fn is_attribute_value_unordered_set(&self, element: &Element, attribute_name: &str) -> bool {
        if matches!(
            attribute_name,
            "class" | "part" | "itemprop" | "itemref" | "itemtype"
        ) {
            return true;
        }

        match element.namespace {
            Namespace::HTML => match &*element.tag_name {
                "link" if attribute_name == "blocking" => true,
                "script" if attribute_name == "blocking" => true,
                "style" if attribute_name == "blocking" => true,
                "output" if attribute_name == "for" => true,
                "td" if attribute_name == "headers" => true,
                "th" if attribute_name == "headers" => true,
                "form" if attribute_name == "rel" => true,
                "a" if attribute_name == "rel" => true,
                "area" if attribute_name == "rel" => true,
                "link" if attribute_name == "rel" => true,
                "iframe" if attribute_name == "sandbox" => true,
                "link"
                    if self.element_has_attribute_with_value(
                        element,
                        "rel",
                        &["icon", "apple-touch-icon", "apple-touch-icon-precomposed"],
                    ) && attribute_name == "sizes" =>
                {
                    true
                }
                _ => false,
            },
            Namespace::SVG => matches!(&*element.tag_name, "a" if attribute_name == "rel"),
            _ => false,
        }
    }

    fn element_has_attribute_with_value(
        &self,
        element: &Element,
        attribute_name: &str,
        attribute_value: &[&str],
    ) -> bool {
        element.attributes.iter().any(|attribute| {
            &*attribute.name == attribute_name
                && attribute.value.is_some()
                && attribute_value
                    .contains(&&*attribute.value.as_ref().unwrap().to_ascii_lowercase())
        })
    }

    fn is_default_attribute_value(
        &self,
        namespace: Namespace,
        tag_name: &str,
        attribute: &Attribute,
    ) -> bool {
        let attribute_value = attribute.value.as_ref().unwrap();

        match namespace {
            Namespace::HTML | Namespace::SVG => {
                // Legacy attributes, not in spec
                if tag_name == "script" {
                    match &*attribute.name {
                        "type" => {
                            let value = if let Some(next) = attribute_value.split(';').next() {
                                next
                            } else {
                                attribute_value
                            };

                            match value {
                                // Legacy JavaScript MIME types
                                "application/javascript"
                                | "application/ecmascript"
                                | "application/x-ecmascript"
                                | "application/x-javascript"
                                | "text/ecmascript"
                                | "text/javascript1.0"
                                | "text/javascript1.1"
                                | "text/javascript1.2"
                                | "text/javascript1.3"
                                | "text/javascript1.4"
                                | "text/javascript1.5"
                                | "text/jscript"
                                | "text/livescript"
                                | "text/x-ecmascript"
                                | "text/x-javascript" => return true,
                                _ => {}
                            }
                        }
                        "language" => match &*attribute_value.trim().to_ascii_lowercase() {
                            "javascript" | "javascript1.2" | "javascript1.3" | "javascript1.4"
                            | "javascript1.5" | "javascript1.6" | "javascript1.7" => return true,
                            _ => {}
                        },
                        _ => {}
                    }
                }

                let default_attributes = if namespace == Namespace::HTML {
                    &HTML_DEFAULT_ATTRIBUTES
                } else {
                    &SVG_ELEMENTS_AND_ATTRIBUTES
                };

                let attribute_name = if let Some(prefix) = &attribute.prefix {
                    let mut with_namespace =
                        String::with_capacity(prefix.len() + 1 + attribute.name.len());

                    with_namespace.push_str(prefix);
                    with_namespace.push(':');
                    with_namespace.push_str(&attribute.name);

                    with_namespace
                } else {
                    attribute.name.to_string()
                };
                let normalized_value = attribute_value.trim();

                let attributes = match default_attributes.get(tag_name) {
                    Some(element) => element,
                    None => return false,
                };

                let attribute_info = match attributes.other.get(&attribute_name) {
                    Some(attribute_info) => attribute_info,
                    None => return false,
                };

                match (attribute_info.inherited, &attribute_info.initial) {
                    (None, Some(initial)) | (Some(false), Some(initial)) => {
                        initial == normalized_value
                    }
                    _ => false,
                }
            }
            _ => {
                matches!(
                    (
                        namespace,
                        tag_name,
                        &*attribute.name,
                        attribute_value.to_ascii_lowercase().trim()
                    ),
                    |(Namespace::MATHML, "math", "xmlns", "http://www.w3.org/1998/math/mathml")| (
                        Namespace::MATHML,
                        "math",
                        "xlink",
                        "http://www.w3.org/1999/xlink"
                    )
                )
            }
        }
    }

    fn is_preserved_comment(&self, data: &str) -> bool {
        if let Some(preserve_comments) = &self.options.preserve_comments {
            return preserve_comments.iter().any(|regex| regex.is_match(data));
        }

        false
    }

    fn is_conditional_comment(&self, data: &str) -> bool {
        if CONDITIONAL_COMMENT_START.is_match(data) || CONDITIONAL_COMMENT_END.is_match(data) {
            return true;
        }

        false
    }

    fn need_collapse_whitespace(&self) -> bool {
        !matches!(self.options.collapse_whitespaces, CollapseWhitespaces::None)
    }

    fn is_custom_element(&self, tag_name: &str) -> bool {
        // https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name
        match tag_name {
            "annotation-xml" | "color-profile" | "font-face" | "font-face-src"
            | "font-face-uri" | "font-face-format" | "font-face-name" | "missing-glyph" => false,
            _ => matches!(tag_name.chars().next(), Some('a'..='z')) && tag_name.contains('-'),
        }
    }

    fn get_display(&self, namespace: Namespace, tag_name: &str) -> Display {
        match namespace {
            Namespace::HTML => {
                match tag_name {
                    "area" | "base" | "basefont" | "datalist" | "head" | "link" | "meta"
                    | "noembed" | "noframes" | "param" | "rp" | "script" | "style" | "template"
                    | "title" => Display::None,

                    "a" | "abbr" | "acronym" | "b" | "bdi" | "bdo" | "cite" | "data" | "big"
                    | "del" | "dfn" | "em" | "i" | "ins" | "kbd" | "mark" | "q" | "nobr"
                    | "rtc" | "s" | "samp" | "small" | "span" | "strike" | "strong" | "sub"
                    | "sup" | "time" | "tt" | "u" | "var" | "wbr" | "object" | "audio" | "code"
                    | "label" | "br" | "img" | "video" | "noscript" | "picture" | "source"
                    | "track" | "map" | "applet" | "bgsound" | "blink" | "canvas" | "command"
                    | "content" | "embed" | "frame" | "iframe" | "image" | "isindex" | "keygen"
                    | "output" | "rbc" | "shadow" | "spacer" => Display::Inline,

                    "html" | "body" | "address" | "blockquote" | "center" | "div" | "figure"
                    | "figcaption" | "footer" | "form" | "header" | "hr" | "legend" | "listing"
                    | "main" | "p" | "plaintext" | "pre" | "xmp" | "details" | "summary"
                    | "optgroup" | "option" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
                    | "fieldset" | "ul" | "ol" | "menu" | "dir" | "dl" | "dt" | "dd"
                    | "section" | "nav" | "hgroup" | "aside" | "article" | "dialog" | "element"
                    | "font" | "frameset" => Display::Block,

                    "li" => Display::ListItem,

                    "button" | "meter" | "progress" | "select" | "textarea" | "input"
                    | "marquee" => Display::InlineBlock,

                    "ruby" => Display::Ruby,

                    "rb" => Display::RubyBase,

                    "rt" => Display::RubyText,

                    "table" => Display::Table,

                    "caption" => Display::TableCaption,

                    "colgroup" => Display::TableColumnGroup,

                    "col" => Display::TableColumn,

                    "thead" => Display::TableHeaderGroup,

                    "tbody" => Display::TableRowGroup,

                    "tfoot" => Display::TableFooterGroup,

                    "tr" => Display::TableRow,

                    "td" | "th" => Display::TableCell,

                    "slot" => Display::Contents,

                    _ => Display::Inline,
                }
            }
            Namespace::SVG => match tag_name {
                "text" | "foreignObject" => Display::Block,

                _ => Display::Inline,
            },
            _ => Display::Inline,
        }
    }

    fn is_element_displayed(&self, namespace: Namespace, tag_name: &str) -> bool {
        match namespace {
            Namespace::HTML => {
                // https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Content_categories#metadata_content
                //
                // Excluded:
                // `noscript` - can be displayed if JavaScript disabled
                // `script` - can insert markup using `document.write`
                !matches!(
                    tag_name,
                    "base" | "command" | "link" | "meta" | "style" | "title" | "template"
                )
            }
            Namespace::SVG => !matches!(tag_name, "style"),
            _ => true,
        }
    }

    fn remove_leading_and_trailing_whitespaces(
        &self,
        children: &mut Vec<Child>,
        only_first: bool,
        only_last: bool,
    ) {
        if only_first {
            if let Some(last) = children.first_mut() {
                match last {
                    Child::Text(text) => {
                        text.data = text.data.trim_start_matches(is_whitespace).into();

                        if text.data.is_empty() {
                            children.remove(0);
                        }
                    }
                    Child::Element(Element {
                        namespace,
                        tag_name,
                        children,
                        ..
                    }) if get_white_space(*namespace, tag_name) == WhiteSpace::Normal => {
                        self.remove_leading_and_trailing_whitespaces(children, true, false);
                    }
                    _ => {}
                }
            }
        }

        if only_last {
            if let Some(last) = children.last_mut() {
                match last {
                    Child::Text(text) => {
                        text.data = text.data.trim_end_matches(is_whitespace).into();

                        if text.data.is_empty() {
                            children.pop();
                        }
                    }
                    Child::Element(Element {
                        namespace,
                        tag_name,
                        children,
                        ..
                    }) if get_white_space(*namespace, tag_name) == WhiteSpace::Normal => {
                        self.remove_leading_and_trailing_whitespaces(children, false, true);
                    }
                    _ => {}
                }
            }
        }
    }

    fn get_prev_displayed_node<'a>(
        &self,
        children: &'a Vec<Child>,
        index: usize,
    ) -> Option<&'a Child> {
        let prev = children.get(index);

        match prev {
            Some(Child::Comment(_)) => {
                if index >= 1 {
                    self.get_prev_displayed_node(children, index - 1)
                } else {
                    None
                }
            }
            Some(Child::Element(element)) => {
                if !self.is_element_displayed(element.namespace, &element.tag_name) && index >= 1 {
                    self.get_prev_displayed_node(children, index - 1)
                } else if !element.children.is_empty() {
                    self.get_prev_displayed_node(&element.children, element.children.len() - 1)
                } else {
                    prev
                }
            }
            Some(_) => prev,
            _ => None,
        }
    }

    fn get_last_displayed_text_node<'a>(
        &self,
        children: &'a Vec<Child>,
        index: usize,
    ) -> Option<&'a Text> {
        let prev = children.get(index);

        match prev {
            Some(Child::Comment(_)) => {
                if index >= 1 {
                    self.get_last_displayed_text_node(children, index - 1)
                } else {
                    None
                }
            }
            Some(Child::Element(element)) => {
                if !self.is_element_displayed(element.namespace, &element.tag_name) && index >= 1 {
                    self.get_last_displayed_text_node(children, index - 1)
                } else if !element.children.is_empty() {
                    for index in (0..=element.children.len() - 1).rev() {
                        if let Some(text) =
                            self.get_last_displayed_text_node(&element.children, index)
                        {
                            return Some(text);
                        }
                    }

                    None
                } else {
                    None
                }
            }
            Some(Child::Text(text)) => Some(text),
            _ => None,
        }
    }

    fn get_first_displayed_text_node<'a>(
        &self,
        children: &'a Vec<Child>,
        index: usize,
    ) -> Option<&'a Text> {
        let next = children.get(index);

        match next {
            Some(Child::Comment(_)) => self.get_first_displayed_text_node(children, index + 1),
            Some(Child::Element(element)) => {
                if !self.is_element_displayed(element.namespace, &element.tag_name) && index >= 1 {
                    self.get_first_displayed_text_node(children, index - 1)
                } else if !element.children.is_empty() {
                    for index in 0..=element.children.len() - 1 {
                        if let Some(text) =
                            self.get_first_displayed_text_node(&element.children, index)
                        {
                            return Some(text);
                        }
                    }

                    None
                } else {
                    None
                }
            }
            Some(Child::Text(text)) => Some(text),
            _ => None,
        }
    }

    fn get_next_displayed_node<'a>(
        &self,
        children: &'a Vec<Child>,
        index: usize,
    ) -> Option<&'a Child> {
        let next = children.get(index);

        match next {
            Some(Child::Comment(_)) => self.get_next_displayed_node(children, index + 1),
            Some(Child::Element(element))
                if !self.is_element_displayed(element.namespace, &element.tag_name) =>
            {
                self.get_next_displayed_node(children, index + 1)
            }
            Some(_) => next,
            _ => None,
        }
    }

    fn get_whitespace_minification_for_tag(
        &self,
        namespace: Namespace,
        tag_name: &str,
    ) -> WhitespaceMinificationMode {
        let default_trim = match self.options.collapse_whitespaces {
            CollapseWhitespaces::All => true,
            CollapseWhitespaces::Smart
            | CollapseWhitespaces::Conservative
            | CollapseWhitespaces::OnlyMetadata
            | CollapseWhitespaces::None => false,
        };

        match namespace {
            Namespace::HTML => match tag_name {
                "script" | "style" => WhitespaceMinificationMode {
                    collapse: false,
                    trim: true,
                },
                _ => {
                    if get_white_space(namespace, tag_name) == WhiteSpace::Pre {
                        WhitespaceMinificationMode {
                            collapse: false,
                            trim: false,
                        }
                    } else {
                        WhitespaceMinificationMode {
                            collapse: true,
                            trim: default_trim,
                        }
                    }
                }
            },
            Namespace::SVG => match tag_name {
                "script" | "style" => WhitespaceMinificationMode {
                    collapse: false,
                    trim: true,
                },
                // https://svgwg.org/svg2-draft/render.html#Definitions
                _ if matches!(
                    tag_name,
                    "a" | "circle"
                        | "ellipse"
                        | "foreignobject"
                        | "g"
                        | "image"
                        | "line"
                        | "path"
                        | "polygon"
                        | "polyline"
                        | "rect"
                        | "svg"
                        | "switch"
                        | "symbol"
                        | "text"
                        | "textpath"
                        | "tspan"
                        | "use"
                        | "symbol’"
                ) =>
                {
                    WhitespaceMinificationMode {
                        collapse: true,
                        trim: default_trim,
                    }
                }
                _ => WhitespaceMinificationMode {
                    collapse: true,
                    trim: true,
                },
            },
            _ => WhitespaceMinificationMode {
                collapse: false,
                trim: default_trim,
            },
        }
    }

    fn collapse_whitespace(&self, data: &str) -> String {
        let mut collapsed = String::with_capacity(data.len());
        let mut in_whitespace = false;

        for c in data.chars() {
            if is_whitespace(c) {
                if in_whitespace {
                    // Skip this character.
                    continue;
                };

                in_whitespace = true;

                collapsed.push(' ');
            } else {
                in_whitespace = false;

                collapsed.push(c);
            };
        }

        collapsed
    }

    fn is_additional_minifier_attribute(&self, name: &str) -> Option<MinifierType> {
        if let Some(minify_additional_attributes) = &self.options.minify_additional_attributes {
            for item in minify_additional_attributes {
                if item.0.is_match(name) {
                    return Some(item.1.clone());
                }
            }
        }

        None
    }

    fn empty_children(&self, children: &Vec<Child>) -> bool {
        for child in children {
            match child {
                Child::Text(text) if text.data.chars().all(is_whitespace) => {
                    continue;
                }
                _ => return false,
            }
        }

        true
    }

    fn minify_children(&mut self, children: &Vec<Child>) -> Vec<Child> {
        let (namespace, tag_name) = match &self.current_element {
            Some(element) => (element.namespace, &element.tag_name),
            _ => {
                unreachable!();
            }
        };

        let mode = self.get_whitespace_minification_for_tag(namespace, tag_name);

        let child_will_be_retained = |child: &mut Child, children: &Vec<Child>, index: usize| {
            match child {
                Child::Comment(comment) if self.options.remove_comments => {
                    self.is_preserved_comment(&comment.data)
                }
                Child::Element(element)
                    if self.options.remove_empty_metedata_elements
                        && (!self.is_element_displayed(element.namespace, &element.tag_name)
                            || (matches!(element.namespace, Namespace::HTML | Namespace::SVG)
                                && &*element.tag_name == "script")
                            || (element.namespace == Namespace::HTML
                                && &*element.tag_name == "noscript"))
                        && element.attributes.is_empty()
                        && self.empty_children(&element.children)
                        && element.content.is_none() =>
                {
                    false
                }
                Child::Text(text) if text.data.is_empty() => false,
                Child::Text(text)
                    if self.need_collapse_whitespace()
                        && namespace == Namespace::HTML
                        && matches!(&**tag_name, "html" | "head")
                        && text.data.chars().all(is_whitespace) =>
                {
                    false
                }
                Child::Text(text)
                    if !self.descendant_of_pre
                        && get_white_space(namespace, tag_name) == WhiteSpace::Normal
                        && matches!(
                            self.options.collapse_whitespaces,
                            CollapseWhitespaces::All
                                | CollapseWhitespaces::Smart
                                | CollapseWhitespaces::Conservative
                        ) =>
                {
                    let mut is_smart_left_trim = false;
                    let mut is_smart_right_trim = false;

                    if self.options.collapse_whitespaces == CollapseWhitespaces::Smart {
                        let prev = if index >= 1 {
                            children.get(index - 1)
                        } else {
                            None
                        };
                        let prev_display = match prev {
                            Some(Child::Element(Element {
                                namespace,
                                tag_name,
                                ..
                            })) => Some(self.get_display(*namespace, tag_name)),
                            Some(Child::Comment(_)) => Some(Display::None),
                            _ => None,
                        };

                        is_smart_left_trim = match prev_display {
                            // Block-level containers:
                            //
                            // `Display::Block`    - `display: block flow`
                            // `Display::ListItem` - `display: block flow list-item`
                            // `Display::Table`    - `display: block table`
                            //
                            // + internal table display (only whitespace characters allowed there)
                            Some(
                                Display::Block
                                | Display::ListItem
                                | Display::Table
                                | Display::TableColumnGroup
                                | Display::TableCaption
                                | Display::TableColumn
                                | Display::TableRow
                                | Display::TableCell
                                | Display::TableHeaderGroup
                                | Display::TableRowGroup
                                | Display::TableFooterGroup,
                            ) => true,
                            // Elements are not displayed
                            // And
                            // Inline box
                            Some(Display::None) | Some(Display::Inline) => {
                                // A custom element can contain any elements, we cannot predict the
                                // behavior of spaces
                                let is_custom_element = if let Some(Child::Element(element)) = &prev
                                {
                                    self.is_custom_element(&*element.tag_name)
                                } else {
                                    false
                                };

                                if is_custom_element {
                                    false
                                } else {
                                    match &self.get_prev_displayed_node(children, index - 1) {
                                        Some(Child::Text(text)) => {
                                            text.data.ends_with(is_whitespace)
                                        }
                                        Some(Child::Element(element)) => {
                                            let deep = if !element.children.is_empty() {
                                                self.get_last_displayed_text_node(
                                                    &element.children,
                                                    element.children.len() - 1,
                                                )
                                            } else {
                                                None
                                            };

                                            if let Some(deep) = deep {
                                                deep.data.ends_with(is_whitespace)
                                            } else {
                                                false
                                            }
                                        }
                                        _ => {
                                            let parent_display =
                                                self.get_display(namespace, tag_name);

                                            match parent_display {
                                                Display::Inline => {
                                                    if let Some(Child::Text(Text {
                                                        data, ..
                                                    })) = &self.latest_element
                                                    {
                                                        data.ends_with(is_whitespace)
                                                    } else {
                                                        false
                                                    }
                                                }
                                                _ => true,
                                            }
                                        }
                                    }
                                }
                            }
                            // Inline level containers and etc
                            Some(_) => false,
                            None => {
                                // Template can be used in any place, so let's keep whitespaces
                                //
                                // For custom elements - an unnamed `<slot>` will be filled with all
                                // of the custom element's top-level
                                // child nodes that do not have the slot
                                // attribute. This includes text nodes.
                                // Also they can be used for custom logic

                                if (namespace == Namespace::HTML && tag_name == "template")
                                    || self.is_custom_element(tag_name)
                                {
                                    false
                                } else {
                                    let parent_display = self.get_display(namespace, tag_name);

                                    match parent_display {
                                        Display::Inline => {
                                            if let Some(Child::Text(Text { data, .. })) =
                                                &self.latest_element
                                            {
                                                data.ends_with(is_whitespace)
                                            } else {
                                                false
                                            }
                                        }
                                        _ => true,
                                    }
                                }
                            }
                        };

                        let next = children.get(index + 1);
                        let next_display = match next {
                            Some(Child::Element(Element {
                                namespace,
                                tag_name,
                                ..
                            })) => Some(self.get_display(*namespace, tag_name)),
                            Some(Child::Comment(_)) => Some(Display::None),
                            _ => None,
                        };

                        is_smart_right_trim = match next_display {
                            // Block-level containers:
                            //
                            // `Display::Block`    - `display: block flow`
                            // `Display::ListItem` - `display: block flow list-item`
                            // `Display::Table`    - `display: block table`
                            //
                            // + internal table display (only whitespace characters allowed there)
                            Some(
                                Display::Block
                                | Display::ListItem
                                | Display::Table
                                | Display::TableColumnGroup
                                | Display::TableCaption
                                | Display::TableColumn
                                | Display::TableRow
                                | Display::TableCell
                                | Display::TableHeaderGroup
                                | Display::TableRowGroup
                                | Display::TableFooterGroup,
                            ) => true,
                            // These elements are not displayed
                            Some(Display::None) => {
                                match &self.get_next_displayed_node(children, index + 1) {
                                    Some(Child::Text(text)) => text.data.starts_with(is_whitespace),
                                    Some(Child::Element(element)) => {
                                        let deep = self
                                            .get_first_displayed_text_node(&element.children, 0);

                                        if let Some(deep) = deep {
                                            !deep.data.starts_with(is_whitespace)
                                        } else {
                                            false
                                        }
                                    }
                                    _ => {
                                        let parent_display = self.get_display(namespace, tag_name);

                                        !matches!(parent_display, Display::Inline)
                                    }
                                }
                            }
                            Some(_) => false,
                            None => {
                                // Template can be used in any place, so let's keep whitespaces
                                let is_template =
                                    namespace == Namespace::HTML && tag_name == "template";

                                if is_template {
                                    false
                                } else {
                                    let parent_display = self.get_display(namespace, tag_name);

                                    !matches!(parent_display, Display::Inline)
                                }
                            }
                        };
                    }

                    let mut value = if (mode.trim) || is_smart_left_trim {
                        text.data.trim_start_matches(is_whitespace)
                    } else {
                        &*text.data
                    };

                    value = if (mode.trim) || is_smart_right_trim {
                        value.trim_end_matches(is_whitespace)
                    } else {
                        value
                    };

                    if value.is_empty() {
                        false
                    } else if mode.collapse {
                        text.data = self.collapse_whitespace(value).into();

                        true
                    } else {
                        text.data = value.into();

                        true
                    }
                }
                _ => true,
            }
        };

        let mut new_children = Vec::with_capacity(children.len());

        for (index, child) in children.iter().enumerate() {
            let mut child = child.clone();

            // Merge adjacent text nodes
            let merged = match &mut child {
                Child::Text(text) => {
                    if let Some(Child::Text(prev_text)) = new_children.last_mut() {
                        let mut new_data =
                            String::with_capacity(prev_text.data.len() + text.data.len());

                        new_data.push_str(&prev_text.data);
                        new_data.push_str(&text.data);

                        text.data = new_data.into();

                        new_children.pop();

                        true
                    } else {
                        false
                    }
                }
                _ => false,
            };

            let mut merged_children = new_children.clone();

            let (merged_children, offset) = if merged {
                merged_children.push(child.clone());

                let offset = merged_children.len() - 1;

                merged_children.extend_from_slice(&children[index + 1..]);

                (merged_children, offset)
            } else {
                let offset = merged_children.len();

                merged_children.extend_from_slice(&children[index..]);

                (merged_children, offset)
            };

            let result = child_will_be_retained(&mut child, &merged_children, offset);

            if result {
                new_children.push(child);
            }
        }

        new_children
    }

    fn get_attribute_value(&self, attributes: &Vec<Attribute>, name: &str) -> Option<JsWord> {
        let mut type_attribute_value = None;

        for attribute in attributes {
            if &*attribute.name == name {
                if let Some(value) = &attribute.value {
                    type_attribute_value = Some(value.clone());
                }

                break;
            }
        }

        type_attribute_value
    }

    fn is_additional_scripts_content(&self, name: &str) -> Option<MinifierType> {
        if let Some(minify_additional_scripts_content) =
            &self.options.minify_additional_scripts_content
        {
            for item in minify_additional_scripts_content {
                if item.0.is_match(name) {
                    return Some(item.1.clone());
                }
            }
        }

        None
    }

    fn need_minify_json(&self) -> bool {
        match self.options.minify_json {
            MinifyJsonOption::Bool(value) => value,
            MinifyJsonOption::Options(_) => true,
        }
    }

    fn get_json_options(&self) -> JsonOptions {
        match &self.options.minify_json {
            MinifyJsonOption::Bool(_) => JsonOptions { pretty: false },
            MinifyJsonOption::Options(json_options) => *json_options.clone(),
        }
    }

    fn minify_json(&self, data: String) -> Option<String> {
        let json = match serde_json::from_str::<Value>(&data) {
            Ok(json) => json,
            _ => return None,
        };

        let options = self.get_json_options();
        let result = match options.pretty {
            true => serde_json::to_string_pretty(&json),
            false => serde_json::to_string(&json),
        };

        match result {
            Ok(minified_json) => Some(minified_json),
            _ => None,
        }
    }

    fn need_minify_js(&self) -> bool {
        match self.options.minify_js {
            MinifyJsOption::Bool(value) => value,
            MinifyJsOption::Options(_) => true,
        }
    }

    fn get_js_options(&self) -> JsOptions {
        match &self.options.minify_js {
            MinifyJsOption::Bool(_) => JsOptions {
                parser: JsParserOptions::default(),
                minifier: swc_ecma_minifier::option::MinifyOptions {
                    compress: Some(swc_ecma_minifier::option::CompressOptions::default()),
                    mangle: Some(swc_ecma_minifier::option::MangleOptions::default()),
                    ..Default::default()
                },
                codegen: swc_ecma_codegen::Config::default(),
            },
            MinifyJsOption::Options(js_options) => *js_options.clone(),
        }
    }

    // TODO source map url output for JS and CSS?
    fn minify_js(&self, data: String, is_module: bool, is_attribute: bool) -> Option<String> {
        let mut errors: Vec<_> = vec![];

        let cm = Lrc::new(SourceMap::new(FilePathMapping::empty()));
        let fm = cm.new_source_file(FileName::Anon, data);
        let mut options = self.get_js_options();

        if let swc_ecma_parser::Syntax::Es(es_config) = &mut options.parser.syntax {
            es_config.allow_return_outside_function = !is_module && is_attribute;
        }

        let comments = SingleThreadedComments::default();

        let mut program = if is_module {
            match swc_ecma_parser::parse_file_as_module(
                &fm,
                options.parser.syntax,
                options.parser.target,
                if options.parser.comments {
                    Some(&comments)
                } else {
                    None
                },
                &mut errors,
            ) {
                Ok(module) => swc_ecma_ast::Program::Module(module),
                _ => return None,
            }
        } else {
            match swc_ecma_parser::parse_file_as_script(
                &fm,
                options.parser.syntax,
                options.parser.target,
                if options.parser.comments {
                    Some(&comments)
                } else {
                    None
                },
                &mut errors,
            ) {
                Ok(script) => swc_ecma_ast::Program::Script(script),
                _ => return None,
            }
        };

        // Avoid compress potential invalid JS
        if !errors.is_empty() {
            return None;
        }

        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        if let Some(compress_options) = &mut options.minifier.compress {
            compress_options.module = is_module;
        } else {
            options.minifier.compress = Some(swc_ecma_minifier::option::CompressOptions {
                ecma: options.parser.target,
                ..Default::default()
            });
        }

        swc_ecma_visit::VisitMutWith::visit_mut_with(
            &mut program,
            &mut swc_ecma_transforms_base::resolver(unresolved_mark, top_level_mark, false),
        );

        let program = swc_ecma_minifier::optimize(
            program,
            cm.clone(),
            if options.parser.comments {
                Some(&comments)
            } else {
                None
            },
            None,
            &options.minifier,
            &swc_ecma_minifier::option::ExtraOptions {
                unresolved_mark,
                top_level_mark,
            },
        );

        let mut buf = vec![];

        {
            let mut wr = Box::new(swc_ecma_codegen::text_writer::JsWriter::new(
                cm.clone(),
                "\n",
                &mut buf,
                None,
            )) as Box<dyn swc_ecma_codegen::text_writer::WriteJs>;

            wr = Box::new(swc_ecma_codegen::text_writer::omit_trailing_semi(wr));

            options.codegen.minify = true;
            options.codegen.target = options.parser.target;

            let mut emitter = swc_ecma_codegen::Emitter {
                cfg: options.codegen,
                cm,
                comments: if options.parser.comments {
                    Some(&comments)
                } else {
                    None
                },
                wr,
            };

            emitter.emit_program(&program).unwrap();
        }

        let minified = match String::from_utf8(buf) {
            Ok(minified) => minified,
            _ => return None,
        };

        Some(minified)
    }

    fn need_minify_css(&self) -> bool {
        match self.options.minify_css {
            MinifyCssOption::Bool(value) => value,
            MinifyCssOption::Options(_) => true,
        }
    }

    fn minify_sizes(&self, value: &str) -> Option<String> {
        let values = value
            .rsplitn(2, |c| matches!(c, '\t' | '\n' | '\x0C' | '\r' | ' '))
            .collect::<Vec<&str>>();

        if values.len() != 2 {
            return None;
        }

        let media_condition =
            // It should be `MediaCondition`, but `<media-query> = <media-condition>` and other values is just invalid size
            match self.minify_css(values[1].to_string(), CssMinificationMode::MediaQueryList) {
                Some(minified) => minified,
                _ => return None,
            };

        let source_size_value = values[0];
        let mut minified = String::with_capacity(media_condition.len() + source_size_value.len());

        minified.push_str(&media_condition);
        minified.push(' ');
        minified.push_str(source_size_value);

        Some(minified)
    }

    fn get_css_options(&self) -> CssOptions {
        match &self.options.minify_css {
            MinifyCssOption::Bool(_) => CssOptions {
                parser: swc_css_parser::parser::ParserConfig::default(),
                minifier: swc_css_minifier::options::MinifyOptions::default(),
                codegen: swc_css_codegen::CodegenConfig::default(),
            },
            MinifyCssOption::Options(css_options) => *css_options.clone(),
        }
    }

    fn minify_css(&self, data: String, mode: CssMinificationMode) -> Option<String> {
        let mut errors: Vec<_> = vec![];

        let cm = Lrc::new(SourceMap::new(FilePathMapping::empty()));
        let fm = cm.new_source_file(FileName::Anon, data);

        let mut options = self.get_css_options();

        let mut stylesheet = match mode {
            CssMinificationMode::Stylesheet => {
                match swc_css_parser::parse_file(&fm, options.parser, &mut errors) {
                    Ok(stylesheet) => stylesheet,
                    _ => return None,
                }
            }
            CssMinificationMode::ListOfDeclarations => {
                match swc_css_parser::parse_file::<Vec<swc_css_ast::DeclarationOrAtRule>>(
                    &fm,
                    options.parser,
                    &mut errors,
                ) {
                    Ok(list_of_declarations) => {
                        let declaration_list: Vec<swc_css_ast::ComponentValue> =
                            list_of_declarations
                                .into_iter()
                                .map(swc_css_ast::ComponentValue::DeclarationOrAtRule)
                                .collect();

                        swc_css_ast::Stylesheet {
                            span: Default::default(),
                            rules: vec![swc_css_ast::Rule::QualifiedRule(
                                swc_css_ast::QualifiedRule {
                                    span: Default::default(),
                                    prelude: swc_css_ast::QualifiedRulePrelude::SelectorList(
                                        swc_css_ast::SelectorList {
                                            span: Default::default(),
                                            children: vec![],
                                        },
                                    ),
                                    block: swc_css_ast::SimpleBlock {
                                        span: Default::default(),
                                        name: '{',
                                        value: declaration_list,
                                    },
                                },
                            )],
                        }
                    }
                    _ => return None,
                }
            }
            CssMinificationMode::MediaQueryList => {
                match swc_css_parser::parse_file::<swc_css_ast::MediaQueryList>(
                    &fm,
                    options.parser,
                    &mut errors,
                ) {
                    Ok(media_query_list) => swc_css_ast::Stylesheet {
                        span: Default::default(),
                        rules: vec![swc_css_ast::Rule::AtRule(swc_css_ast::AtRule {
                            span: Default::default(),
                            name: swc_css_ast::AtRuleName::Ident(swc_css_ast::Ident {
                                span: Default::default(),
                                value: "media".into(),
                                raw: None,
                            }),
                            prelude: Some(swc_css_ast::AtRulePrelude::MediaPrelude(
                                media_query_list,
                            )),
                            block: Some(swc_css_ast::SimpleBlock {
                                span: Default::default(),
                                name: '{',
                                // TODO make the `compress_empty` option for CSS minifier and remove
                                // it
                                value: vec![swc_css_ast::ComponentValue::Str(swc_css_ast::Str {
                                    span: Default::default(),
                                    value: "placeholder".into(),
                                    raw: None,
                                })],
                            }),
                        })],
                    },
                    _ => return None,
                }
            }
        };

        // Avoid compress potential invalid CSS
        if !errors.is_empty() {
            return None;
        }

        swc_css_minifier::minify(&mut stylesheet, options.minifier);

        let mut minified = String::new();
        let wr = swc_css_codegen::writer::basic::BasicCssWriter::new(
            &mut minified,
            None,
            swc_css_codegen::writer::basic::BasicCssWriterConfig::default(),
        );

        options.codegen.minify = true;

        let mut gen = swc_css_codegen::CodeGenerator::new(wr, options.codegen);

        match mode {
            CssMinificationMode::Stylesheet => {
                swc_css_codegen::Emit::emit(&mut gen, &stylesheet).unwrap();
            }
            CssMinificationMode::ListOfDeclarations => {
                let swc_css_ast::Stylesheet { rules, .. } = &stylesheet;

                // Because CSS is grammar free, protect for fails
                if let Some(swc_css_ast::Rule::QualifiedRule(swc_css_ast::QualifiedRule {
                    block,
                    ..
                })) = rules.get(0)
                {
                    swc_css_codegen::Emit::emit(&mut gen, &block).unwrap();

                    minified = minified[1..minified.len() - 1].to_string();
                } else {
                    return None;
                }
            }
            CssMinificationMode::MediaQueryList => {
                let swc_css_ast::Stylesheet { rules, .. } = &stylesheet;

                // Because CSS is grammar free, protect for fails
                if let Some(swc_css_ast::Rule::AtRule(swc_css_ast::AtRule { prelude, .. })) =
                    rules.get(0)
                {
                    swc_css_codegen::Emit::emit(&mut gen, &prelude).unwrap();

                    minified = minified.trim().to_string();
                } else {
                    return None;
                }
            }
        }

        Some(minified)
    }

    fn minify_html(&self, data: String, mode: HtmlMinificationMode) -> Option<String> {
        let mut errors: Vec<_> = vec![];

        let cm = Lrc::new(SourceMap::new(FilePathMapping::empty()));
        let fm = cm.new_source_file(FileName::Anon, data);

        // Emulate content inside conditional comments like content inside the
        // `template` element
        let mut context_element = None;

        let mut document_or_document_fragment = match mode {
            HtmlMinificationMode::ConditionalComments => {
                // Emulate content inside conditional comments like content inside the
                // `template` element, because it can be used in any place in source code
                context_element = Some(Element {
                    span: Default::default(),
                    tag_name: "template".into(),
                    namespace: Namespace::HTML,
                    attributes: vec![],
                    children: vec![],
                    content: None,
                    is_self_closing: false,
                });

                match swc_html_parser::parse_file_as_document_fragment(
                    &fm,
                    context_element.as_ref().unwrap(),
                    DocumentMode::NoQuirks,
                    None,
                    Default::default(),
                    &mut errors,
                ) {
                    Ok(document_fragment) => HtmlRoot::DocumentFragment(document_fragment),
                    _ => return None,
                }
            }
            HtmlMinificationMode::DocumentIframeSrcdoc => {
                match swc_html_parser::parse_file_as_document(
                    &fm,
                    ParserConfig {
                        iframe_srcdoc: true,
                        ..Default::default()
                    },
                    &mut errors,
                ) {
                    Ok(document) => HtmlRoot::Document(document),
                    _ => return None,
                }
            }
        };

        // Avoid compress potential invalid CSS
        if !errors.is_empty() {
            return None;
        }

        match document_or_document_fragment {
            HtmlRoot::Document(ref mut document) => {
                minify_document(document, self.options);
            }
            HtmlRoot::DocumentFragment(ref mut document_fragment) => minify_document_fragment(
                document_fragment,
                context_element.as_ref().unwrap(),
                self.options,
            ),
        }

        let mut minified = String::new();
        let wr = swc_html_codegen::writer::basic::BasicHtmlWriter::new(
            &mut minified,
            None,
            swc_html_codegen::writer::basic::BasicHtmlWriterConfig::default(),
        );
        let mut gen = swc_html_codegen::CodeGenerator::new(
            wr,
            swc_html_codegen::CodegenConfig {
                minify: true,
                scripting_enabled: false,
                context_element: context_element.as_ref(),
                tag_omission: None,
                self_closing_void_elements: None,
            },
        );

        match document_or_document_fragment {
            HtmlRoot::Document(document) => {
                swc_html_codegen::Emit::emit(&mut gen, &document).unwrap();
            }
            HtmlRoot::DocumentFragment(document_fragment) => {
                swc_html_codegen::Emit::emit(&mut gen, &document_fragment).unwrap();
            }
        }

        Some(minified)
    }
}

impl VisitMut for Minifier<'_> {
    fn visit_mut_document(&mut self, n: &mut Document) {
        n.visit_mut_children_with(self);

        n.children
            .retain(|child| !matches!(child, Child::Comment(_) if self.options.remove_comments));
    }

    fn visit_mut_document_fragment(&mut self, n: &mut DocumentFragment) {
        n.children = self.minify_children(&n.children);

        n.visit_mut_children_with(self);
    }

    fn visit_mut_document_type(&mut self, n: &mut DocumentType) {
        n.visit_mut_children_with(self);

        if !self.options.force_set_html5_doctype {
            return;
        }

        n.name = Some("html".into());
        n.system_id = None;
        n.public_id = None;
    }

    fn visit_mut_child(&mut self, n: &mut Child) {
        n.visit_mut_children_with(self);

        self.current_element = None;

        if self.options.collapse_whitespaces == CollapseWhitespaces::Smart {
            match n {
                Child::Text(_) | Child::Element(_) => {
                    self.latest_element = Some(n.clone());
                }
                _ => {}
            }
        }
    }

    fn visit_mut_element(&mut self, n: &mut Element) {
        // Don't copy children to save memory
        self.current_element = Some(Element {
            span: Default::default(),
            tag_name: n.tag_name.clone(),
            namespace: n.namespace,
            attributes: n.attributes.clone(),
            children: vec![],
            content: None,
            is_self_closing: n.is_self_closing,
        });

        let old_descendant_of_pre = self.descendant_of_pre;

        if self.need_collapse_whitespace() && !old_descendant_of_pre {
            self.descendant_of_pre = get_white_space(n.namespace, &n.tag_name) == WhiteSpace::Pre;
        }

        n.children = self.minify_children(&n.children);

        n.visit_mut_children_with(self);

        // Remove all leading and trailing whitespaces for the `body` element
        if n.namespace == Namespace::HTML
            && &*n.tag_name == "body"
            && self.need_collapse_whitespace()
        {
            self.remove_leading_and_trailing_whitespaces(&mut n.children, true, true);
        }

        if self.need_collapse_whitespace() {
            self.descendant_of_pre = old_descendant_of_pre;
        }

        let mut already_seen: AHashSet<JsWord> = Default::default();

        n.attributes.retain(|attribute| {
            if already_seen.contains(&attribute.name) {
                return false;
            }

            already_seen.insert(attribute.name.clone());

            if attribute.value.is_none() {
                return true;
            }

            if self.options.remove_redundant_attributes
                && self.is_default_attribute_value(n.namespace, &n.tag_name, attribute)
            {
                return false;
            }

            if self.options.remove_empty_attributes {
                let value = attribute.value.as_ref().unwrap();

                if (matches!(&*attribute.name, "id") && value.is_empty())
                    || (matches!(&*attribute.name, "class" | "style") && value.is_empty())
                    || self.is_event_handler_attribute(&attribute.name) && value.is_empty()
                {
                    return false;
                }
            }

            true
        });

        if let Some(attribute_name_counter) = &self.attribute_name_counter {
            n.attributes.sort_by(|a, b| {
                let ordeing = attribute_name_counter
                    .get(&b.name)
                    .cmp(&attribute_name_counter.get(&a.name));

                match ordeing {
                    Ordering::Equal => b.name.cmp(&a.name),
                    _ => ordeing,
                }
            });
        }
    }

    fn visit_mut_attribute(&mut self, n: &mut Attribute) {
        n.visit_mut_children_with(self);

        if n.value.is_none() {
            return;
        }

        let mut value = match &n.value {
            Some(value) => value.to_string(),
            _ => {
                unreachable!();
            }
        };

        if value.is_empty() {
            return;
        }

        let current_element = self.current_element.as_ref().unwrap();

        if self.options.collapse_boolean_attributes
            && current_element.namespace == Namespace::HTML
            && self.is_boolean_attribute(&n.name)
        {
            n.value = None;

            return;
        } else if self.options.normalize_attributes {
            if self.is_space_separated_attribute(current_element, &n.name) {
                value = value.split_whitespace().collect::<Vec<_>>().join(" ");
            } else if self.is_comma_separated_attribute(current_element, &n.name) {
                let mut new_values = vec![];

                for value in value.trim().split(',') {
                    if matches!(&*n.name, "sizes" | "imagesizes") {
                        let trimmed = value.trim();

                        match self.minify_sizes(trimmed) {
                            Some(minified) => {
                                new_values.push(minified);
                            }
                            _ => {
                                new_values.push(trimmed.to_string());
                            }
                        };
                    } else if matches!(&*n.name, "points") {
                        new_values.push(self.collapse_whitespace(value.trim()));
                    } else {
                        new_values.push(value.trim().to_string());
                    }
                }

                value = new_values.join(",");
            } else if self.is_trimable_separated_attribute(current_element, &n.name) {
                value = value.trim().to_string();
            } else if current_element.namespace == Namespace::HTML
                && &n.name == "contenteditable"
                && value == "true"
            {
                n.value = Some(js_word!(""));

                return;
            } else if &n.name == "content"
                && self.element_has_attribute_with_value(
                    current_element,
                    "http-equiv",
                    &["content-security-policy"],
                )
            {
                let values = value.trim().split(';');

                let mut new_values = vec![];

                for value in values {
                    new_values.push(
                        value
                            .trim()
                            .split(' ')
                            .filter(|s| !s.is_empty())
                            .collect::<Vec<_>>()
                            .join(" "),
                    );
                }

                value = new_values.join(";");

                if value.ends_with(';') {
                    value.pop();
                }
            } else if self.is_event_handler_attribute(&n.name) {
                value = value.trim().into();

                if value.trim().to_lowercase().starts_with("javascript:") {
                    value = value.chars().skip(11).collect();
                }
            } else if current_element.namespace == Namespace::HTML
                && &*current_element.tag_name == "iframe"
                && &n.name == "srcdoc"
            {
                value = match self
                    .minify_html(value.clone(), HtmlMinificationMode::DocumentIframeSrcdoc)
                {
                    Some(minified) => minified,
                    _ => value,
                };
            } else if matches!(current_element.namespace, Namespace::HTML | Namespace::SVG)
                && matches!(
                    &*current_element.tag_name,
                    "style" | "link" | "script" | "input"
                )
                && &n.name == "type"
            {
                value = value.trim().to_ascii_lowercase();
            }
        }

        if self.options.sort_space_separated_attribute_values
            && self.is_attribute_value_unordered_set(current_element, &n.name)
        {
            let mut values = value.split_whitespace().collect::<Vec<_>>();

            values.sort_unstable();

            value = values.join(" ");
        } else if self.is_event_handler_attribute(&n.name) {
            value = match self.minify_js(value.clone(), false, true) {
                Some(minified) => minified,
                _ => value,
            };
        } else if self.need_minify_css() && &*n.name == "media" && !value.is_empty() {
            if let Some(minified) =
                self.minify_css(value.clone(), CssMinificationMode::MediaQueryList)
            {
                value = minified;
            }
        } else if self.need_minify_css() && &*n.name == "style" && !value.is_empty() {
            if let Some(minified) =
                self.minify_css(value.clone(), CssMinificationMode::ListOfDeclarations)
            {
                value = minified;
            }
        }

        if self.options.minify_additional_attributes.is_some() {
            let minifier_type = self.is_additional_minifier_attribute(&n.name);

            match minifier_type {
                Some(MinifierType::JsScript) if self.need_minify_js() => {
                    value = match self.minify_js(value.clone(), false, true) {
                        Some(minified) => minified,
                        _ => value,
                    };
                }
                Some(MinifierType::JsModule) if self.need_minify_js() => {
                    value = match self.minify_js(value.clone(), true, true) {
                        Some(minified) => minified,
                        _ => value,
                    };
                }
                Some(MinifierType::Json) if self.need_minify_json() => {
                    value = match self.minify_json(value.clone()) {
                        Some(minified) => minified,
                        _ => value,
                    };
                }
                Some(MinifierType::Css) if self.need_minify_css() => {
                    value = match self
                        .minify_css(value.clone(), CssMinificationMode::ListOfDeclarations)
                    {
                        Some(minified) => minified,
                        _ => value,
                    };
                }
                Some(MinifierType::Html) => {
                    value = match self
                        .minify_html(value.clone(), HtmlMinificationMode::DocumentIframeSrcdoc)
                    {
                        Some(minified) => minified,
                        _ => value,
                    };
                }
                _ => {}
            }
        }

        n.value = Some(value.into());
    }

    fn visit_mut_text(&mut self, n: &mut Text) {
        n.visit_mut_children_with(self);

        if n.data.len() == 0 {
            return;
        }

        let mut text_type = None;

        if let Some(current_element) = &self.current_element {
            match &*current_element.tag_name {
                "script"
                    if (self.need_minify_json() || self.need_minify_js())
                        && matches!(
                            current_element.namespace,
                            Namespace::HTML | Namespace::SVG
                        )
                        && !current_element
                            .attributes
                            .iter()
                            .any(|attribute| matches!(&*attribute.name, "src")) =>
                {
                    let type_attribute_value = self
                        .get_attribute_value(&current_element.attributes, "type")
                        .map(|v| v.trim().to_ascii_lowercase());

                    match type_attribute_value.as_deref() {
                        Some("module") if self.need_minify_js() => {
                            text_type = Some(MinifierType::JsModule);
                        }
                        Some(
                            "text/javascript"
                            | "text/ecmascript"
                            | "text/jscript"
                            | "application/javascript"
                            | "application/x-javascript"
                            | "application/ecmascript",
                        )
                        | None
                            if self.need_minify_js() =>
                        {
                            text_type = Some(MinifierType::JsScript);
                        }
                        Some(
                            "application/json"
                            | "application/ld+json"
                            | "importmap"
                            | "speculationrules",
                        ) if self.need_minify_json() => {
                            text_type = Some(MinifierType::Json);
                        }
                        Some(script_type)
                            if self.options.minify_additional_scripts_content.is_some() =>
                        {
                            if let Some(minifier_type) =
                                self.is_additional_scripts_content(script_type)
                            {
                                text_type = Some(minifier_type);
                            }
                        }
                        _ => {}
                    }
                }
                "style"
                    if self.need_minify_css()
                        && matches!(
                            current_element.namespace,
                            Namespace::HTML | Namespace::SVG
                        ) =>
                {
                    let mut type_attribute_value = None;

                    for attribute in &current_element.attributes {
                        if &*attribute.name == "type" && attribute.value.is_some() {
                            type_attribute_value = Some(
                                attribute
                                    .value
                                    .as_ref()
                                    .unwrap()
                                    .trim()
                                    .to_ascii_lowercase(),
                            );

                            break;
                        }
                    }

                    if type_attribute_value.is_none()
                        || type_attribute_value == Some("text/css".into())
                    {
                        text_type = Some(MinifierType::Css)
                    }
                }
                _ => {}
            }
        }

        match text_type {
            Some(MinifierType::JsScript) => {
                let minified = match self.minify_js(n.data.to_string(), false, false) {
                    Some(minified) => minified,
                    None => return,
                };

                n.data = minified.into();
            }
            Some(MinifierType::JsModule) => {
                let minified = match self.minify_js(n.data.to_string(), true, false) {
                    Some(minified) => minified,
                    None => return,
                };

                n.data = minified.into();
            }
            Some(MinifierType::Json) => {
                let minified = match self.minify_json(n.data.to_string()) {
                    Some(minified) => minified,
                    None => return,
                };

                n.data = minified.into();
            }
            Some(MinifierType::Css) => {
                let minified =
                    match self.minify_css(n.data.to_string(), CssMinificationMode::Stylesheet) {
                        Some(minified) => minified,
                        None => return,
                    };

                n.data = minified.into();
            }
            Some(MinifierType::Html) => {
                let minified = match self.minify_html(
                    n.data.to_string(),
                    HtmlMinificationMode::ConditionalComments,
                ) {
                    Some(minified) => minified,
                    None => return,
                };

                n.data = minified.into();
            }
            _ => {}
        }
    }

    fn visit_mut_comment(&mut self, n: &mut Comment) {
        n.visit_mut_children_with(self);

        if !self.options.minify_conditional_comments {
            return;
        }

        if self.is_conditional_comment(&n.data) && n.data.len() > 0 {
            let start_pos = match n.data.find("]>") {
                Some(start_pos) => start_pos,
                _ => return,
            };
            let end_pos = match n.data.find("<![") {
                Some(end_pos) => end_pos,
                _ => return,
            };

            let html = n
                .data
                .chars()
                .skip(start_pos)
                .take(end_pos - start_pos)
                .collect();

            let minified = match self.minify_html(html, HtmlMinificationMode::ConditionalComments) {
                Some(minified) => minified,
                _ => return,
            };
            let before: String = n.data.chars().take(start_pos).collect();
            let after: String = n.data.chars().skip(end_pos).take(n.data.len()).collect();
            let mut data = String::with_capacity(n.data.len());

            data.push_str(&before);
            data.push_str(&minified);
            data.push_str(&after);

            n.data = data.into();
        }
    }
}

struct AttributeNameCounter {
    tree: AHashMap<JsWord, usize>,
}

impl VisitMut for AttributeNameCounter {
    fn visit_mut_attribute(&mut self, n: &mut Attribute) {
        n.visit_mut_children_with(self);

        *self.tree.entry(n.name.clone()).or_insert(0) += 1;
    }
}

fn create_minifier<'a>(
    context_element: Option<&Element>,
    options: &'a MinifyOptions,
) -> Minifier<'a> {
    let mut current_element = None;
    let mut is_pre = false;

    if let Some(context_element) = context_element {
        current_element = Some(context_element.clone());
        is_pre = get_white_space(context_element.namespace, &context_element.tag_name)
            == WhiteSpace::Pre;
    }

    Minifier {
        options,

        current_element,
        latest_element: None,
        descendant_of_pre: is_pre,
        attribute_name_counter: None,
    }
}

pub fn minify_document(document: &mut Document, options: &MinifyOptions) {
    let mut minifier = create_minifier(None, options);

    if options.sort_attributes {
        let mut attribute_name_counter = AttributeNameCounter {
            tree: Default::default(),
        };

        document.visit_mut_with(&mut attribute_name_counter);

        minifier.attribute_name_counter = Some(attribute_name_counter.tree);
    }

    document.visit_mut_with(&mut minifier);
}

pub fn minify_document_fragment(
    document_fragment: &mut DocumentFragment,
    context_element: &Element,
    options: &MinifyOptions,
) {
    let mut minifier = create_minifier(Some(context_element), options);

    if options.sort_attributes {
        let mut attribute_name_counter = AttributeNameCounter {
            tree: Default::default(),
        };

        document_fragment.visit_mut_with(&mut attribute_name_counter);

        minifier.attribute_name_counter = Some(attribute_name_counter.tree);
    }

    document_fragment.visit_mut_with(&mut minifier);
}
