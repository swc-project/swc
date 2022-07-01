#![deny(clippy::all)]

use std::mem::take;

use once_cell::sync::Lazy;
use serde_json::Value;
use swc_atoms::{js_word, JsWord};
use swc_cached::regex::CachedRegex;
use swc_common::{collections::AHashSet, sync::Lrc, FileName, FilePathMapping, Mark, SourceMap};
use swc_html_ast::*;
use swc_html_parser::parser::ParserConfig;
use swc_html_visit::{VisitMut, VisitMutWith};

use crate::option::{CollapseWhitespaces, MinifierType, MinifyOptions};
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

static COMMA_SEPARATED_SVG_ATTRIBUTES: &[(&str, &str)] = &[("style", "media")];

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

struct Minifier {
    current_element: Option<Element>,
    latest_element: Option<Child>,

    descendant_of_pre: bool,

    force_set_html5_doctype: bool,
    collapse_whitespaces: CollapseWhitespaces,

    remove_empty_metedata_elements: bool,

    remove_comments: bool,
    preserve_comments: Option<Vec<CachedRegex>>,
    minify_conditional_comments: bool,
    remove_empty_attributes: bool,
    remove_redundant_attributes: bool,
    collapse_boolean_attributes: bool,
    normalize_attributes: bool,
    minify_json: bool,
    minify_js: bool,
    minify_css: bool,
    minify_additional_attributes: Option<Vec<(CachedRegex, MinifierType)>>,
    minify_additional_scripts_content: Option<Vec<(CachedRegex, MinifierType)>>,

    sort_space_separated_attribute_values: bool,
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

impl Minifier {
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
        attribute_name: &str,
        attribute_value: &str,
    ) -> bool {
        matches!(
            (
                namespace,
                tag_name,
                attribute_name,
                attribute_value.to_ascii_lowercase().trim()
            ),
            (
                Namespace::HTML,
                "html",
                "xmlns",
                "http://www.w3.org/1999/xhtml"
            ) | (
                Namespace::HTML,
                "html",
                "xmlns:xlink",
                "http://www.w3.org/1999/xlink"
            ) | (Namespace::HTML, "iframe", "height", "150")
                | (Namespace::HTML, "iframe", "width", "300")
                | (Namespace::HTML, "iframe", "frameborder", "1")
                | (Namespace::HTML, "iframe", "loading", "eager")
                | (Namespace::HTML, "iframe", "fetchpriority", "auto")
                | (
                    Namespace::HTML,
                    "iframe",
                    "referrerpolicy",
                    "strict-origin-when-cross-origin"
                )
                | (
                    Namespace::HTML,
                    "a",
                    "referrerpolicy",
                    "strict-origin-when-cross-origin"
                )
                | (Namespace::HTML, "a", "target", "_self")
                | (Namespace::HTML, "area", "target", "_self")
                | (Namespace::HTML, "area", "shape", "rect")
                | (
                    Namespace::HTML,
                    "area",
                    "referrerpolicy",
                    "strict-origin-when-cross-origin"
                )
                | (Namespace::HTML, "form", "method", "get")
                | (Namespace::HTML, "form", "target", "_self")
                | (
                    Namespace::HTML,
                    "form",
                    "enctype",
                    "application/x-www-form-urlencoded"
                )
                | (Namespace::HTML, "input", "type", "text")
                | (Namespace::HTML, "input", "size", "20")
                | (Namespace::HTML, "track", "kind", "subtitles")
                | (Namespace::HTML, "textarea", "cols", "20")
                | (Namespace::HTML, "textarea", "rows", "2")
                | (Namespace::HTML, "textarea", "wrap", "sort")
                | (Namespace::HTML, "progress", "max", "1")
                | (Namespace::HTML, "meter", "min", "0")
                | (Namespace::HTML, "img", "decoding", "auto")
                | (Namespace::HTML, "img", "fetchpriority", "auto")
                | (Namespace::HTML, "img", "loading", "eager")
                | (
                    Namespace::HTML,
                    "img",
                    "referrerpolicy",
                    "strict-origin-when-cross-origin"
                )
                | (Namespace::HTML, "link", "type", "text/css")
                | (Namespace::HTML, "link", "fetchpriority", "auto")
                | (
                    Namespace::HTML,
                    "link",
                    "referrerpolicy",
                    "strict-origin-when-cross-origin"
                )
                | (Namespace::HTML, "style", "type", "text/css")
                | (Namespace::HTML, "script", "language", "javascript")
                | (Namespace::HTML, "script", "language", "javascript1.2")
                | (Namespace::HTML, "script", "language", "javascript1.3")
                | (Namespace::HTML, "script", "language", "javascript1.4")
                | (Namespace::HTML, "script", "language", "javascript1.5")
                | (Namespace::HTML, "script", "language", "javascript1.6")
                | (Namespace::HTML, "script", "language", "javascript1.7")
                | (Namespace::HTML, "script", "type", "text/javascript")
                | (Namespace::HTML, "script", "type", "text/ecmascript")
                | (Namespace::HTML, "script", "type", "text/jscript")
                | (Namespace::HTML, "script", "type", "application/javascript")
                | (
                    Namespace::HTML,
                    "script",
                    "type",
                    "application/x-javascript"
                )
                | (Namespace::HTML, "script", "type", "application/ecmascript")
                | (Namespace::HTML, "script", "fetchpriority", "auto")
                | (
                    Namespace::HTML,
                    "script",
                    "referrerpolicy",
                    "strict-origin-when-cross-origin"
                )
                | (Namespace::HTML, "ol", "type", "1")
                | (Namespace::HTML, "base", "target", "_self")
                | (Namespace::HTML, "canvas", "height", "150")
                | (Namespace::HTML, "canvas", "width", "300")
                | (Namespace::HTML, "col", "span", "1")
                | (Namespace::HTML, "colgroup", "span", "1")
                | (Namespace::HTML, "td", "colspan", "1")
                | (Namespace::HTML, "td", "rowspan", "1")
                | (Namespace::HTML, "th", "colspan", "1")
                | (Namespace::HTML, "th", "rowspan", "1")
                | (Namespace::HTML, "button", "type", "submit")
                | (Namespace::SVG, "svg", "xmlns", "http://www.w3.org/2000/svg")
                | (
                    Namespace::SVG,
                    "svg",
                    "xlink",
                    "http://www.w3.org/1999/xlink"
                )
                | (Namespace::SVG, "style", "type", "text/css")
                | (Namespace::SVG, "script", "language", "javascript")
                | (Namespace::SVG, "script", "language", "javascript1.2")
                | (Namespace::SVG, "script", "language", "javascript1.3")
                | (Namespace::SVG, "script", "language", "javascript1.4")
                | (Namespace::SVG, "script", "language", "javascript1.5")
                | (Namespace::SVG, "script", "language", "javascript1.6")
                | (Namespace::SVG, "script", "language", "javascript1.7")
                | (Namespace::SVG, "script", "type", "text/javascript")
                | (Namespace::SVG, "script", "type", "text/ecmascript")
                | (Namespace::SVG, "script", "type", "text/jscript")
                | (Namespace::SVG, "script", "type", "application/javascript")
                | (Namespace::SVG, "script", "type", "application/x-javascript")
                | (Namespace::SVG, "script", "type", "application/ecmascript")
                | (Namespace::SVG, "script", "fetchpriority", "auto")
                | (
                    Namespace::SVG,
                    "script",
                    "referrerpolicy",
                    "strict-origin-when-cross-origin"
                )
                | (
                    Namespace::MATHML,
                    "math",
                    "xmlns",
                    "http://www.w3.org/1998/math/mathml"
                )
                | (
                    Namespace::MATHML,
                    "math",
                    "xlink",
                    "http://www.w3.org/1999/xlink"
                )
        )
    }

    fn is_preserved_comment(&self, data: &str) -> bool {
        if let Some(preserve_comments) = &self.preserve_comments {
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
        !matches!(self.collapse_whitespaces, CollapseWhitespaces::None)
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
            _ => Display::Inline,
        }
    }

    fn is_element_displayed(&self, namespace: Namespace, tag_name: &str) -> bool {
        match namespace {
            // https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Content_categories#metadata_content
            //
            // Excluded:
            // `noscript` - can be displayed if JavaScript disabled
            // `script` - can insert markup using `document.write`
            Namespace::HTML => !matches!(
                tag_name,
                "base" | "command" | "link" | "meta" | "style" | "title"
            ),
            Namespace::SVG => !matches!(tag_name, "style"),
            _ => true,
        }
    }

    fn remove_leading_and_trailing_whitespaces(&self, children: &mut Vec<Child>) {
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
                    self.remove_leading_and_trailing_whitespaces(children);
                }
                _ => {}
            }
        }

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
                    self.remove_leading_and_trailing_whitespaces(children);
                }
                _ => {}
            }
        }
    }

    fn get_deep_last_text_element<'a>(&self, node: &'a Child) -> Option<&'a Text> {
        match node {
            Child::Text(text) => Some(text),
            Child::Element(Element {
                namespace,
                tag_name,
                children,
                ..
            }) if get_white_space(*namespace, tag_name) == WhiteSpace::Normal => {
                if let Some(last) = children.last() {
                    self.get_deep_last_text_element(last)
                } else {
                    None
                }
            }
            _ => None,
        }
    }

    fn get_prev_non_comment_node<'a>(
        &self,
        children: &'a Vec<Child>,
        index: usize,
    ) -> Option<&'a Child> {
        let prev = children.get(index);

        match prev {
            Some(Child::Comment(_)) if index >= 1 => {
                self.get_prev_non_comment_node(children, index - 1)
            }
            Some(_) => prev,
            _ => None,
        }
    }

    fn get_next_non_comment_node<'a>(
        &self,
        children: &'a Vec<Child>,
        index: usize,
    ) -> Option<&'a Child> {
        let next = children.get(index);

        match next {
            Some(Child::Comment(_)) => self.get_next_non_comment_node(children, index + 1),
            Some(_) => next,
            _ => None,
        }
    }

    fn get_next_text_node<'a>(&self, children: &'a Vec<Child>, index: usize) -> Option<&'a Child> {
        let next = children.get(index);

        match next {
            Some(Child::Text(_)) => next,
            Some(Child::Element(_)) => None,
            Some(_) => self.get_next_text_node(children, index + 1),
            _ => None,
        }
    }

    fn get_whitespace_minification_for_tag(
        &self,
        namespace: Namespace,
        tag_name: &str,
    ) -> WhitespaceMinificationMode {
        let default_trim = match self.collapse_whitespaces {
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
        if let Some(minify_additional_attributes) = &self.minify_additional_attributes {
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

    fn minify_children(&mut self, children: &mut Vec<Child>) {
        let (namespace, tag_name) = match &self.current_element {
            Some(element) => (element.namespace, &element.tag_name),
            _ => return,
        };

        let mode = self.get_whitespace_minification_for_tag(namespace, tag_name);

        let child_will_be_retained = |child: &mut Child,
                                      prev: Option<&Child>,
                                      next: Option<&Child>| {
        let child_will_be_retained = |child: &mut Child, children: &Vec<Child>, index: usize| {
            match child {
                Child::Comment(comment) if self.remove_comments => {
                    self.is_preserved_comment(&comment.data)
                }
                Child::Element(element)
                    if self.remove_empty_metedata_elements
                        && (!self.is_element_displayed(element.namespace, &element.tag_name)
                            || (matches!(element.namespace, Namespace::HTML | Namespace::SVG)
                                && &*element.tag_name == "script")
                            || (element.namespace == Namespace::HTML
                                && &*element.tag_name == "noscript"))
                        && element.attributes.is_empty()
                        && self.empty_children(&element.children) =>
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
                            self.collapse_whitespaces,
                            CollapseWhitespaces::All
                                | CollapseWhitespaces::Smart
                                | CollapseWhitespaces::Conservative
                        ) =>
                {
                    let mut is_smart_left_trim = false;
                    let mut is_smart_right_trim = false;

                    if self.collapse_whitespaces == CollapseWhitespaces::Smart {
                        let prev_display = if let Some(Child::Element(Element {
                            namespace,
                            tag_name,
                            ..
                        })) = &prev
                        {
                            Some(self.get_display(*namespace, tag_name))
                        let prev = if index >= 1 {
                            self.get_prev_non_comment_node(&children, index - 1)
                        } else {
                            None
                        };

                        let prev_display = if let Some(Child::Element(Element {
                            namespace,
                            tag_name,
                            ..
                        })) = &prev
                        {
                            Some(self.get_display(*namespace, tag_name))
                        } else {
                            None
                        };

                        is_smart_left_trim = match prev_display {
                            // Block-level containers:
                            //
                            // `Display::Block`    - `display: block flow`
                            // `Display::ListItem` - `display: block flow list-item`
                            // `Display::Table`    - `display: block table`
                            // + internal table display (only whitespace characters allowed
                            // there)
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
                            Some(Display::None) if prev.is_some() => {
                                if let Some(Child::Element(Element {
                                    namespace,
                                    tag_name,
                                    ..
                                })) = &prev
                                {
                                    !self.is_element_displayed(*namespace, tag_name)
                                    !self.is_metadata_element_displayed(*namespace, tag_name)
                                } else {
                                    true
                                }
                            }
                            // Inline box
                            Some(Display::Inline) => {
                                if let Some(prev) = &prev {
                                    let deep = self.get_deep_last_text_element(prev);

                                    if let Some(deep) = deep {
                                        deep.data.ends_with(is_whitespace)
                                    } else {
                                        false
                                    }
                                } else {
                                    false
                                }
                            }
                            // Inline level containers and etc
                            Some(_) => false,
                            None => {
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
                        };

                        let next = self.get_next_non_comment_node(&children, index + 1);
                        let next_display = if let Some(Child::Element(Element {
                            namespace,
                            tag_name,
                            ..
                        })) = &next
                        {
                            Some(self.get_display(*namespace, tag_name))
                        } else {
                            None
                        };

                        is_smart_right_trim = match next_display {
                            // Block-level containers:
                            //
                            // `Display::Block`    - `display: block flow`
                            // `Display::ListItem` - `display: block flow list-item`
                            // `Display::Table`    - `display: block table`
                            // + internal table display (only whitespace characters allowed
                            // there)
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
                            Some(Display::None) if prev.is_some() => {
                                if let Some(Child::Element(Element {
                                    namespace,
                                    tag_name,
                                    ..
                                })) = &next
                                {
                                    !self.is_element_displayed(*namespace, tag_name)
                                    !self.is_metadata_element_displayed(*namespace, tag_name)
                                } else {
                                    true
                                }
                            }
                            Some(_) => false,
                            None => {
                                let parent_display = self.get_display(namespace, tag_name);

                                !matches!(parent_display, Display::Inline)
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

        let cloned_children = children.clone();

        let mut index = 0;
        let mut pending_text = vec![];

        children.retain_mut(|child| {
            match child {
                Child::Text(text)
                    if self
                        .get_next_text_node(&cloned_children, index + 1)
                        .is_some()
                        && !child_will_be_retained(
                            &mut cloned_children.get(index + 1).cloned().unwrap(),
                            &cloned_children,
                            index + 1,
                        ) =>
                {
                    pending_text.push(text.data.clone());

                    index += 1;

                    return false;
                }
                Child::Text(text) if !pending_text.is_empty() => {
                    let mut new_value = String::new();

                    for text in take(&mut pending_text) {
                        new_value.push_str(&text);
                    }

                    new_value.push_str(&text.data);

                    text.data = new_value.into();
                }
                _ => {}
            }

            let result = child_will_be_retained(child, &cloned_children, index);

            index += 1;

            result
        });
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
        if let Some(minify_additional_scripts_content) = &self.minify_additional_scripts_content {
            for item in minify_additional_scripts_content {
                if item.0.is_match(name) {
                    return Some(item.1.clone());
                }
            }
        }

        None
    }

    fn minify_json(&self, data: String) -> Option<String> {
        let json = match serde_json::from_str::<Value>(&data) {
            Ok(json) => json,
            _ => return None,
        };

        match serde_json::to_string(&json) {
            Ok(minified_json) => Some(minified_json),
            _ => None,
        }
    }

    // TODO source map url output for JS and CSS?
    // TODO allow preserve comments
    fn minify_js(&self, data: String, is_module: bool, is_attribute: bool) -> Option<String> {
        let mut errors: Vec<_> = vec![];

        let cm = Lrc::new(SourceMap::new(FilePathMapping::empty()));
        let fm = cm.new_source_file(FileName::Anon, data);

        let syntax = swc_ecma_parser::Syntax::Es(swc_ecma_parser::EsConfig {
            allow_return_outside_function: !is_module && is_attribute,
            ..Default::default()
        });

        let target = swc_ecma_ast::EsVersion::latest();
        let mut program = if is_module {
            match swc_ecma_parser::parse_file_as_module(&fm, syntax, target, None, &mut errors) {
                Ok(module) => swc_ecma_ast::Program::Module(module),
                _ => return None,
            }
        } else {
            match swc_ecma_parser::parse_file_as_script(&fm, syntax, target, None, &mut errors) {
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

        swc_ecma_visit::VisitMutWith::visit_mut_with(
            &mut program,
            &mut swc_ecma_transforms_base::resolver(unresolved_mark, top_level_mark, false),
        );

        let options = swc_ecma_minifier::option::MinifyOptions {
            compress: Some(swc_ecma_minifier::option::CompressOptions {
                ecma: target,
                module: is_module,
                negate_iife: false,
                ..Default::default()
            }),
            mangle: Some(swc_ecma_minifier::option::MangleOptions {
                ..Default::default()
            }),
            ..Default::default()
        };

        let program = swc_ecma_minifier::optimize(
            program,
            cm.clone(),
            None,
            None,
            &options,
            &swc_ecma_minifier::option::ExtraOptions {
                unresolved_mark,
                top_level_mark,
            },
        );

        let mut buf = vec![];

        {
            let mut wr = Box::new(swc_ecma_codegen::text_writer::JsWriter::new(
                cm.clone(),
                "",
                &mut buf,
                None,
            )) as Box<dyn swc_ecma_codegen::text_writer::WriteJs>;

            wr = Box::new(swc_ecma_codegen::text_writer::omit_trailing_semi(wr));

            let mut emitter = swc_ecma_codegen::Emitter {
                cfg: swc_ecma_codegen::Config {
                    minify: true,
                    target,
                    ..Default::default()
                },
                cm,
                comments: None,
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

    fn minify_css(&self, data: String, mode: CssMinificationMode) -> Option<String> {
        let mut errors: Vec<_> = vec![];

        let cm = Lrc::new(SourceMap::new(FilePathMapping::empty()));
        let fm = cm.new_source_file(FileName::Anon, data);

        let mut stylesheet = match mode {
            CssMinificationMode::Stylesheet => {
                match swc_css_parser::parse_file(&fm, Default::default(), &mut errors) {
                    Ok(stylesheet) => stylesheet,
                    _ => return None,
                }
            }
            CssMinificationMode::ListOfDeclarations => {
                match swc_css_parser::parse_file::<Vec<swc_css_ast::DeclarationOrAtRule>>(
                    &fm,
                    Default::default(),
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
                    Default::default(),
                    &mut errors,
                ) {
                    Ok(media_query_list) => swc_css_ast::Stylesheet {
                        span: Default::default(),
                        rules: vec![swc_css_ast::Rule::AtRule(swc_css_ast::AtRule {
                            span: Default::default(),
                            name: swc_css_ast::AtRuleName::Ident(swc_css_ast::Ident {
                                span: Default::default(),
                                value: "media".into(),
                                raw: "media".into(),
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
                                    raw: "placeholder".into(),
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

        swc_css_minifier::minify(&mut stylesheet);

        let mut minified = String::new();
        let wr = swc_css_codegen::writer::basic::BasicCssWriter::new(
            &mut minified,
            None,
            swc_css_codegen::writer::basic::BasicCssWriterConfig::default(),
        );
        let mut gen = swc_css_codegen::CodeGenerator::new(
            wr,
            swc_css_codegen::CodegenConfig { minify: true },
        );

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
                // `template` element
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

        let minify_options = MinifyOptions {
            force_set_html5_doctype: self.force_set_html5_doctype,
            collapse_whitespaces: self.collapse_whitespaces.clone(),
            remove_empty_metedata_elements: self.remove_empty_metedata_elements,
            remove_comments: self.remove_comments,
            preserve_comments: self.preserve_comments.clone(),
            minify_conditional_comments: self.minify_conditional_comments,
            remove_empty_attributes: self.remove_empty_attributes,
            remove_redundant_attributes: self.remove_empty_attributes,
            collapse_boolean_attributes: self.collapse_boolean_attributes,
            normalize_attributes: self.normalize_attributes,
            minify_js: self.minify_js,
            minify_json: self.minify_json,
            minify_css: self.minify_css,
            minify_additional_scripts_content: self.minify_additional_scripts_content.clone(),
            minify_additional_attributes: self.minify_additional_attributes.clone(),
            sort_space_separated_attribute_values: self.sort_space_separated_attribute_values,
        };

        match document_or_document_fragment {
            HtmlRoot::Document(ref mut document) => {
                minify_document(document, &minify_options);
            }
            HtmlRoot::DocumentFragment(ref mut document_fragment) => minify_document_fragment(
                document_fragment,
                context_element.as_ref().unwrap(),
                &minify_options,
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

impl VisitMut for Minifier {
    fn visit_mut_document(&mut self, n: &mut Document) {
        n.visit_mut_children_with(self);

        n.children
            .retain(|child| !matches!(child, Child::Comment(_) if self.remove_comments));
    }

    fn visit_mut_document_fragment(&mut self, n: &mut DocumentFragment) {
        self.minify_children(&mut n.children);

        n.visit_mut_children_with(self);
    }

    fn visit_mut_document_type(&mut self, n: &mut DocumentType) {
        n.visit_mut_children_with(self);

        if !self.force_set_html5_doctype {
            return;
        }

        n.name = Some("html".into());
        n.system_id = None;
        n.public_id = None;
    }

    fn visit_mut_child(&mut self, n: &mut Child) {
        n.visit_mut_children_with(self);

        self.current_element = None;

        if self.need_collapse_whitespace() {
            self.latest_element = Some(n.clone());
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

        self.minify_children(&mut n.children);

        n.visit_mut_children_with(self);

        // Remove all leading and trailing whitespaces for the `body` element
        if n.namespace == Namespace::HTML
            && &*n.tag_name == "body"
            && self.need_collapse_whitespace()
        {
            self.remove_leading_and_trailing_whitespaces(&mut n.children);
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

            if self.remove_redundant_attributes
                && self.is_default_attribute_value(
                    n.namespace,
                    &n.tag_name,
                    &attribute.name,
                    match &*n.tag_name {
                        "script" if matches!(n.namespace, Namespace::HTML | Namespace::SVG) => {
                            let original_value = attribute.value.as_ref().unwrap();

                            if let Some(next) = original_value.split(';').next() {
                                next
                            } else {
                                original_value
                            }
                        }
                        _ => attribute.value.as_ref().unwrap(),
                    },
                )
            {
                return false;
            }

            if self.remove_empty_attributes {
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

        if self.collapse_boolean_attributes
            && current_element.namespace == Namespace::HTML
            && self.is_boolean_attribute(&n.name)
        {
            n.value = None;

            return;
        } else if self.normalize_attributes {
            if self.is_space_separated_attribute(current_element, &n.name) {
                value = value.split_whitespace().collect::<Vec<_>>().join(" ");
            } else if self.is_comma_separated_attribute(current_element, &n.name) {
                let is_sizes = matches!(&*n.name, "sizes" | "imagesizes");

                let mut new_values = vec![];

                for value in value.trim().split(',') {
                    if is_sizes {
                        let trimmed = value.trim();

                        match self.minify_sizes(trimmed) {
                            Some(minified) => {
                                new_values.push(minified);
                            }
                            _ => {
                                new_values.push(trimmed.to_string());
                            }
                        };
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
            }
        }

        if self.sort_space_separated_attribute_values
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
        } else if self.minify_css && &*n.name == "media" && !value.is_empty() {
            if let Some(minified) =
                self.minify_css(value.clone(), CssMinificationMode::MediaQueryList)
            {
                value = minified;
            }
        } else if self.minify_css && &*n.name == "style" && !value.is_empty() {
            if let Some(minified) =
                self.minify_css(value.clone(), CssMinificationMode::ListOfDeclarations)
            {
                value = minified;
            }
        }

        if self.minify_additional_attributes.is_some() {
            let minifier_type = self.is_additional_minifier_attribute(&n.name);

            match minifier_type {
                Some(MinifierType::JsScript) if self.minify_js => {
                    value = match self.minify_js(value.clone(), false, true) {
                        Some(minified) => minified,
                        _ => value,
                    };
                }
                Some(MinifierType::JsModule) if self.minify_js => {
                    value = match self.minify_js(value.clone(), true, true) {
                        Some(minified) => minified,
                        _ => value,
                    };
                }
                Some(MinifierType::Json) if self.minify_json => {
                    value = match self.minify_json(value.clone()) {
                        Some(minified) => minified,
                        _ => value,
                    };
                }
                Some(MinifierType::Css) if self.minify_css => {
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
                    if (self.minify_json || self.minify_js)
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
                        Some("module") if self.minify_js => {
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
                            if self.minify_js =>
                        {
                            text_type = Some(MinifierType::JsScript);
                        }
                        Some(
                            "application/json"
                            | "application/ld+json"
                            | "importmap"
                            | "speculationrules",
                        ) if self.minify_json => {
                            text_type = Some(MinifierType::Json);
                        }
                        Some(script_type) if self.minify_additional_scripts_content.is_some() => {
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
                    if self.minify_css
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

        if !self.minify_conditional_comments {
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

fn create_minifier(context_element: Option<&Element>, options: &MinifyOptions) -> Minifier {
    let mut current_element = None;
    let mut is_pre = false;

    if let Some(context_element) = context_element {
        current_element = Some(context_element.clone());
        is_pre = get_white_space(context_element.namespace, &context_element.tag_name)
            == WhiteSpace::Pre;
    }

    Minifier {
        current_element,
        latest_element: None,

        descendant_of_pre: is_pre,

        force_set_html5_doctype: options.force_set_html5_doctype,
        remove_comments: options.remove_comments,
        preserve_comments: options.preserve_comments.clone(),
        minify_conditional_comments: options.minify_conditional_comments,

        collapse_whitespaces: options.collapse_whitespaces.clone(),

        remove_empty_metedata_elements: options.remove_empty_metedata_elements,

        remove_empty_attributes: options.remove_empty_attributes,
        remove_redundant_attributes: options.remove_redundant_attributes,
        collapse_boolean_attributes: options.collapse_boolean_attributes,
        normalize_attributes: options.normalize_attributes,

        minify_js: options.minify_js,
        minify_json: options.minify_json,
        minify_css: options.minify_css,
        minify_additional_attributes: options.minify_additional_attributes.clone(),
        minify_additional_scripts_content: options.minify_additional_scripts_content.clone(),

        sort_space_separated_attribute_values: options.sort_space_separated_attribute_values,
    }
}

pub fn minify_document(document: &mut Document, options: &MinifyOptions) {
    let mut minifier = create_minifier(None, options);

    document.visit_mut_with(&mut minifier);
}

pub fn minify_document_fragment(
    document: &mut DocumentFragment,
    context_element: &Element,
    options: &MinifyOptions,
) {
    let mut minifier = create_minifier(Some(context_element), options);

    document.visit_mut_with(&mut minifier);
}
