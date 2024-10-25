#![deny(clippy::all)]

use std::{borrow::Cow, cmp::Ordering, mem::take};

use once_cell::sync::Lazy;
use serde_json::Value;
use swc_atoms::{js_word, JsWord};
use swc_cached::regex::CachedRegex;
use swc_common::{
    collections::AHashMap, comments::SingleThreadedComments, sync::Lrc, EqIgnoreSpan, FileName,
    FilePathMapping, Mark, SourceMap, DUMMY_SP,
};
use swc_html_ast::*;
use swc_html_parser::parser::ParserConfig;
use swc_html_utils::{HTML_ELEMENTS_AND_ATTRIBUTES, SVG_ELEMENTS_AND_ATTRIBUTES};
use swc_html_visit::{VisitMut, VisitMutWith};

#[cfg(feature = "default-css-minifier")]
use crate::option::CssOptions;
use crate::option::{
    CollapseWhitespaces, JsOptions, JsParserOptions, JsonOptions, MinifierType, MinifyCssOption,
    MinifyJsOption, MinifyJsonOption, MinifyOptions, RemoveRedundantAttributes,
};

pub mod option;

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

static ALLOW_TO_TRIM_SVG_ATTRIBUTES: &[(&str, &str)] = &[("a", "href")];

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
    ("svg", "viewBox"),
    ("symbol", "preserveAspectRatio"),
    ("symbol", "viewBox"),
    ("image", "preserveAspectRatio"),
    ("feImage", "preserveAspectRatio"),
    ("marker", "preserveAspectRatio"),
    ("pattern", "preserveAspectRatio"),
    ("pattern", "viewBox"),
    ("pattern", "patternTransform"),
    ("view", "preserveAspectRatio"),
    ("view", "viewBox"),
    ("path", "d"),
    // TODO improve me more
    ("textPath", "path"),
    ("animateMotion", "path"),
    ("glyph", "d"),
    ("missing-glyph", "d"),
    ("feColorMatrix", "values"),
    ("feConvolveMatrix", "kernelMatrix"),
    ("text", "rotate"),
    ("tspan", "rotate"),
    ("feFuncA", "tableValues"),
    ("feFuncB", "tableValues"),
    ("feFuncG", "tableValues"),
    ("feFuncR", "tableValues"),
    ("linearGradient", "gradientTransform"),
    ("radialGradient", "gradientTransform"),
    ("font-face", "panose-1"),
    ("a", "rel"),
];

static SEMICOLON_SEPARATED_SVG_ATTRIBUTES: &[(&str, &str)] = &[
    ("animate", "keyTimes"),
    ("animate", "keySplines"),
    ("animate", "values"),
    ("animate", "begin"),
    ("animate", "end"),
    ("animateColor", "keyTimes"),
    ("animateColor", "keySplines"),
    ("animateColor", "values"),
    ("animateColor", "begin"),
    ("animateColor", "end"),
    ("animateMotion", "keyTimes"),
    ("animateMotion", "keySplines"),
    ("animateMotion", "values"),
    ("animateMotion", "values"),
    ("animateMotion", "end"),
    ("animateTransform", "keyTimes"),
    ("animateTransform", "keySplines"),
    ("animateTransform", "values"),
    ("animateTransform", "begin"),
    ("animateTransform", "end"),
    ("discard", "begin"),
    ("set", "begin"),
    ("set", "end"),
];

pub enum CssMinificationMode {
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

struct Minifier<'a, C: MinifyCss> {
    options: &'a MinifyOptions<C::Options>,

    current_element: Option<Element>,
    latest_element: Option<Child>,
    descendant_of_pre: bool,
    attribute_name_counter: Option<AHashMap<JsWord, usize>>,

    css_minifier: &'a C,
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

impl<C: MinifyCss> Minifier<'_, C> {
    fn is_event_handler_attribute(&self, attribute: &Attribute) -> bool {
        matches!(
            &*attribute.name,
            "onabort"
                | "onautocomplete"
                | "onautocompleteerror"
                | "onauxclick"
                | "onbeforematch"
                | "oncancel"
                | "oncanplay"
                | "oncanplaythrough"
                | "onchange"
                | "onclick"
                | "onclose"
                | "oncontextlost"
                | "oncontextmenu"
                | "oncontextrestored"
                | "oncuechange"
                | "ondblclick"
                | "ondrag"
                | "ondragend"
                | "ondragenter"
                | "ondragexit"
                | "ondragleave"
                | "ondragover"
                | "ondragstart"
                | "ondrop"
                | "ondurationchange"
                | "onemptied"
                | "onended"
                | "onformdata"
                | "oninput"
                | "oninvalid"
                | "onkeydown"
                | "onkeypress"
                | "onkeyup"
                | "onmousewheel"
                | "onmousedown"
                | "onmouseenter"
                | "onmouseleave"
                | "onmousemove"
                | "onmouseout"
                | "onmouseover"
                | "onmouseup"
                | "onpause"
                | "onplay"
                | "onplaying"
                | "onprogress"
                | "onratechange"
                | "onreset"
                | "onsecuritypolicyviolation"
                | "onseeked"
                | "onseeking"
                | "onselect"
                | "onslotchange"
                | "onstalled"
                | "onsubmit"
                | "onsuspend"
                | "ontimeupdate"
                | "ontoggle"
                | "onvolumechange"
                | "onwaiting"
                | "onwebkitanimationend"
                | "onwebkitanimationiteration"
                | "onwebkitanimationstart"
                | "onwebkittransitionend"
                | "onwheel"
                | "onblur"
                | "onerror"
                | "onfocus"
                | "onload"
                | "onloadeddata"
                | "onloadedmetadata"
                | "onloadstart"
                | "onresize"
                | "onscroll"
                | "onafterprint"
                | "onbeforeprint"
                | "onbeforeunload"
                | "onhashchange"
                | "onlanguagechange"
                | "onmessage"
                | "onmessageerror"
                | "onoffline"
                | "ononline"
                | "onpagehide"
                | "onpageshow"
                | "onpopstate"
                | "onrejectionhandled"
                | "onstorage"
                | "onunhandledrejection"
                | "onunload"
                | "oncut"
                | "oncopy"
                | "onpaste"
                | "onreadystatechange"
                | "onvisibilitychange"
                | "onshow"
                | "onsort"
                | "onbegin"
                | "onend"
                | "onrepeat"
        )
    }

    fn is_boolean_attribute(&self, element: &Element, attribute: &Attribute) -> bool {
        if element.namespace != Namespace::HTML {
            return false;
        }

        if let Some(global_pseudo_element) = HTML_ELEMENTS_AND_ATTRIBUTES.get(&js_word!("*")) {
            if let Some(element) = global_pseudo_element.other.get(&attribute.name) {
                if element.boolean.is_some() && element.boolean.unwrap() {
                    return true;
                }
            }
        }

        if let Some(element) = HTML_ELEMENTS_AND_ATTRIBUTES.get(&element.tag_name) {
            if let Some(element) = element.other.get(&attribute.name) {
                if element.boolean.is_some() && element.boolean.unwrap() {
                    return true;
                }
            }
        }

        false
    }

    fn is_trimable_separated_attribute(&self, element: &Element, attribute: &Attribute) -> bool {
        match &*attribute.name {
            "style" | "tabindex" | "itemid" => return true,
            _ => {}
        }

        match element.namespace {
            Namespace::HTML => {
                ALLOW_TO_TRIM_HTML_ATTRIBUTES.contains(&(&element.tag_name, &attribute.name))
            }
            Namespace::SVG => {
                ALLOW_TO_TRIM_SVG_ATTRIBUTES.contains(&(&element.tag_name, &attribute.name))
            }
            _ => false,
        }
    }

    fn is_comma_separated_attribute(&self, element: &Element, attribute: &Attribute) -> bool {
        match element.namespace {
            Namespace::HTML => match &*attribute.name {
                "content"
                    if element.tag_name == "meta"
                        && (self.element_has_attribute_with_value(
                            element,
                            "name",
                            &["viewport", "keywords"],
                        )) =>
                {
                    true
                }
                "imagesrcset"
                    if element.tag_name == "link"
                        && self.element_has_attribute_with_value(element, "rel", &["preload"]) =>
                {
                    true
                }
                "imagesizes"
                    if element.tag_name == "link"
                        && self.element_has_attribute_with_value(element, "rel", &["preload"]) =>
                {
                    true
                }
                "accept"
                    if element.tag_name == "input"
                        && self.element_has_attribute_with_value(element, "type", &["file"]) =>
                {
                    true
                }
                _ if attribute.name == "exportparts" => true,
                _ => {
                    COMMA_SEPARATED_HTML_ATTRIBUTES.contains(&(&element.tag_name, &attribute.name))
                }
            },
            Namespace::SVG => {
                COMMA_SEPARATED_SVG_ATTRIBUTES.contains(&(&element.tag_name, &attribute.name))
            }
            _ => false,
        }
    }

    fn is_space_separated_attribute(&self, element: &Element, attribute: &Attribute) -> bool {
        match &*attribute.name {
            "class" | "itemprop" | "itemref" | "itemtype" | "part" | "accesskey"
            | "aria-describedby" | "aria-labelledby" | "aria-owns" => return true,
            _ => {}
        }

        match element.namespace {
            Namespace::HTML => {
                SPACE_SEPARATED_HTML_ATTRIBUTES.contains(&(&element.tag_name, &attribute.name))
            }
            Namespace::SVG => {
                match &*attribute.name {
                    "transform" | "stroke-dasharray" | "clip-path" | "requiredFeatures" => {
                        return true
                    }
                    _ => {}
                }

                SPACE_SEPARATED_SVG_ATTRIBUTES.contains(&(&element.tag_name, &attribute.name))
            }
            _ => false,
        }
    }

    fn is_semicolon_separated_attribute(&self, element: &Element, attribute: &Attribute) -> bool {
        match element.namespace {
            Namespace::SVG => {
                SEMICOLON_SEPARATED_SVG_ATTRIBUTES.contains(&(&element.tag_name, &attribute.name))
            }
            _ => false,
        }
    }

    fn is_attribute_value_unordered_set(&self, element: &Element, attribute: &Attribute) -> bool {
        if matches!(
            &*attribute.name,
            "class" | "part" | "itemprop" | "itemref" | "itemtype"
        ) {
            return true;
        }

        match element.namespace {
            Namespace::HTML => match &*element.tag_name {
                "link" if attribute.name == "blocking" => true,
                "script" if attribute.name == "blocking" => true,
                "style" if attribute.name == "blocking" => true,
                "output" if attribute.name == "for" => true,
                "td" if attribute.name == "headers" => true,
                "th" if attribute.name == "headers" => true,
                "form" if attribute.name == "rel" => true,
                "a" if attribute.name == "rel" => true,
                "area" if attribute.name == "rel" => true,
                "link" if attribute.name == "rel" => true,
                "iframe" if attribute.name == "sandbox" => true,
                "link"
                    if self.element_has_attribute_with_value(
                        element,
                        "rel",
                        &["icon", "apple-touch-icon", "apple-touch-icon-precomposed"],
                    ) && attribute.name == "sizes" =>
                {
                    true
                }
                _ => false,
            },
            Namespace::SVG => {
                matches!(&*element.tag_name, "a" if attribute.name == "rel")
            }
            _ => false,
        }
    }

    fn is_crossorigin_attribute(&self, current_element: &Element, attribute: &Attribute) -> bool {
        matches!(
            (
                current_element.namespace,
                &*current_element.tag_name,
                &*attribute.name,
            ),
            (
                Namespace::HTML,
                "img" | "audio" | "video" | "script" | "link",
                "crossorigin",
            ) | (Namespace::SVG, "image", "crossorigin")
        )
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

    fn is_type_text_javascript(&self, value: &str) -> bool {
        let value = value.trim().to_ascii_lowercase();
        let value = if let Some(next) = value.split(';').next() {
            next
        } else {
            &value
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
            | "text/x-javascript" => true,
            "text/javascript" => true,
            _ => false,
        }
    }

    fn is_type_text_css(&self, value: &JsWord) -> bool {
        let value = value.trim().to_ascii_lowercase();

        matches!(&*value, "text/css")
    }

    fn is_default_attribute_value(&self, element: &Element, attribute: &Attribute) -> bool {
        let attribute_value = match &attribute.value {
            Some(value) => value,
            _ => return false,
        };

        match element.namespace {
            Namespace::HTML | Namespace::SVG => {
                match &*element.tag_name {
                    "html" => match &*attribute.name {
                        "xmlns" => {
                            if &*attribute_value.trim().to_ascii_lowercase()
                                == "http://www.w3.org/1999/xhtml"
                            {
                                return true;
                            }
                        }
                        "xmlns:xlink" => {
                            if &*attribute_value.trim().to_ascii_lowercase()
                                == "http://www.w3.org/1999/xlink"
                            {
                                return true;
                            }
                        }
                        _ => {}
                    },
                    "script" => match &*attribute.name {
                        "type" => {
                            if self.is_type_text_javascript(attribute_value) {
                                return true;
                            }
                        }
                        "language" => match &*attribute_value.trim().to_ascii_lowercase() {
                            "javascript" | "javascript1.2" | "javascript1.3" | "javascript1.4"
                            | "javascript1.5" | "javascript1.6" | "javascript1.7" => return true,
                            _ => {}
                        },
                        _ => {}
                    },
                    "link" => {
                        if attribute.name == "type" && self.is_type_text_css(attribute_value) {
                            return true;
                        }
                    }

                    "svg" => {
                        if attribute.name == "xmlns"
                            && &*attribute_value.trim().to_ascii_lowercase()
                                == "http://www.w3.org/2000/svg"
                        {
                            return true;
                        }
                    }
                    _ => {}
                }

                let default_attributes = if element.namespace == Namespace::HTML {
                    &HTML_ELEMENTS_AND_ATTRIBUTES
                } else {
                    &SVG_ELEMENTS_AND_ATTRIBUTES
                };

                let attributes = match default_attributes.get(&element.tag_name) {
                    Some(element) => element,
                    None => return false,
                };

                let attribute_info = if let Some(prefix) = &attribute.prefix {
                    let mut with_namespace =
                        String::with_capacity(prefix.len() + 1 + attribute.name.len());

                    with_namespace.push_str(prefix);
                    with_namespace.push(':');
                    with_namespace.push_str(&attribute.name);

                    attributes.other.get(&JsWord::from(with_namespace))
                } else {
                    attributes.other.get(&attribute.name)
                };

                let attribute_info = match attribute_info {
                    Some(attribute_info) => attribute_info,
                    None => return false,
                };

                match (attribute_info.inherited, &attribute_info.initial) {
                    (None, Some(initial)) | (Some(false), Some(initial)) => {
                        let normalized_value = attribute_value.trim();

                        match self.options.remove_redundant_attributes {
                            RemoveRedundantAttributes::None => false,
                            RemoveRedundantAttributes::Smart => {
                                if initial == normalized_value {
                                    // It is safe to remove deprecated redundant attributes, they
                                    // should not be used
                                    if attribute_info.deprecated == Some(true) {
                                        return true;
                                    }

                                    // It it safe to remove svg redundant attributes, they used for
                                    // styling
                                    if element.namespace == Namespace::SVG {
                                        return true;
                                    }

                                    // It it safe to remove redundant attributes for metadata
                                    // elements
                                    if element.namespace == Namespace::HTML
                                        && matches!(
                                            &*element.tag_name,
                                            "base"
                                                | "link"
                                                | "noscript"
                                                | "script"
                                                | "style"
                                                | "title"
                                        )
                                    {
                                        return true;
                                    }
                                }

                                false
                            }
                            RemoveRedundantAttributes::All => initial == normalized_value,
                        }
                    }
                    _ => false,
                }
            }
            _ => {
                matches!(
                    (
                        element.namespace,
                        &*element.tag_name,
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

    fn is_javascript_url_element(&self, element: &Element) -> bool {
        match (element.namespace, &*element.tag_name) {
            (Namespace::HTML | Namespace::SVG, "a") => return true,
            (Namespace::HTML, "iframe") => return true,
            _ => {}
        }

        false
    }

    fn is_preserved_comment(&self, data: &JsWord) -> bool {
        if let Some(preserve_comments) = &self.options.preserve_comments {
            return preserve_comments.iter().any(|regex| regex.is_match(data));
        }

        false
    }

    fn is_conditional_comment(&self, data: &JsWord) -> bool {
        if CONDITIONAL_COMMENT_START.is_match(data) || CONDITIONAL_COMMENT_END.is_match(data) {
            return true;
        }

        false
    }

    fn need_collapse_whitespace(&self) -> bool {
        !matches!(self.options.collapse_whitespaces, CollapseWhitespaces::None)
    }

    fn is_custom_element(&self, element: &Element) -> bool {
        // https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name
        match &*element.tag_name {
            "annotation-xml" | "color-profile" | "font-face" | "font-face-src"
            | "font-face-uri" | "font-face-format" | "font-face-name" | "missing-glyph" => false,
            _ => {
                matches!(element.tag_name.chars().next(), Some('a'..='z'))
                    && element.tag_name.contains('-')
            }
        }
    }

    fn get_display(&self, element: &Element) -> Display {
        match element.namespace {
            Namespace::HTML => {
                match &*element.tag_name {
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
            Namespace::SVG => match &*element.tag_name {
                "text" | "foreignObject" => Display::Block,
                _ => Display::Inline,
            },
            _ => Display::Inline,
        }
    }

    fn is_element_displayed(&self, element: &Element) -> bool {
        match element.namespace {
            Namespace::HTML => {
                // https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Content_categories#metadata_content
                //
                // Excluded:
                // `noscript` - can be displayed if JavaScript disabled
                // `script` - can insert markup using `document.write`
                !matches!(
                    &*element.tag_name,
                    "base" | "command" | "link" | "meta" | "style" | "title" | "template"
                )
            }
            Namespace::SVG => !matches!(&*element.tag_name, "style"),
            _ => true,
        }
    }

    #[allow(clippy::only_used_in_recursion)]
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
                if !self.is_element_displayed(element) && index >= 1 {
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
                if !self.is_element_displayed(element) && index >= 1 {
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
                if !self.is_element_displayed(element) && index >= 1 {
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
            Some(Child::Element(element)) if !self.is_element_displayed(element) => {
                self.get_next_displayed_node(children, index + 1)
            }
            Some(_) => next,
            _ => None,
        }
    }

    fn get_whitespace_minification_for_tag(&self, element: &Element) -> WhitespaceMinificationMode {
        let default_collapse = match self.options.collapse_whitespaces {
            CollapseWhitespaces::All
            | CollapseWhitespaces::Smart
            | CollapseWhitespaces::Conservative
            | CollapseWhitespaces::AdvancedConservative => true,
            CollapseWhitespaces::OnlyMetadata | CollapseWhitespaces::None => false,
        };
        let default_trim = match self.options.collapse_whitespaces {
            CollapseWhitespaces::All => true,
            CollapseWhitespaces::Smart
            | CollapseWhitespaces::Conservative
            | CollapseWhitespaces::OnlyMetadata
            | CollapseWhitespaces::AdvancedConservative
            | CollapseWhitespaces::None => false,
        };

        match element.namespace {
            Namespace::HTML => match &*element.tag_name {
                "script" | "style" => WhitespaceMinificationMode {
                    collapse: false,
                    trim: !matches!(
                        self.options.collapse_whitespaces,
                        CollapseWhitespaces::None | CollapseWhitespaces::OnlyMetadata
                    ),
                },
                _ => {
                    if get_white_space(element.namespace, &element.tag_name) == WhiteSpace::Pre {
                        WhitespaceMinificationMode {
                            collapse: false,
                            trim: false,
                        }
                    } else {
                        WhitespaceMinificationMode {
                            collapse: default_collapse,
                            trim: default_trim,
                        }
                    }
                }
            },
            Namespace::SVG => match &*element.tag_name {
                "script" | "style" => WhitespaceMinificationMode {
                    collapse: false,
                    trim: true,
                },
                // https://svgwg.org/svg2-draft/render.html#Definitions
                _ if matches!(
                    &*element.tag_name,
                    "a" | "circle"
                        | "ellipse"
                        | "foreignObject"
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
                        | "textPath"
                        | "tspan"
                        | "use"
                ) =>
                {
                    WhitespaceMinificationMode {
                        collapse: default_collapse,
                        trim: default_trim,
                    }
                }
                _ => WhitespaceMinificationMode {
                    collapse: default_collapse,
                    trim: !matches!(
                        self.options.collapse_whitespaces,
                        CollapseWhitespaces::None | CollapseWhitespaces::OnlyMetadata
                    ),
                },
            },
            _ => WhitespaceMinificationMode {
                collapse: false,
                trim: default_trim,
            },
        }
    }

    fn collapse_whitespace<'a>(&self, data: &'a str) -> Cow<'a, str> {
        if data.is_empty() {
            return Cow::Borrowed(data);
        }

        if data.chars().all(|c| !matches!(c, c if is_whitespace(c))) {
            return Cow::Borrowed(data);
        }

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

        Cow::Owned(collapsed)
    }

    fn is_additional_minifier_attribute(&self, name: &JsWord) -> Option<MinifierType> {
        if let Some(minify_additional_attributes) = &self.options.minify_additional_attributes {
            for item in minify_additional_attributes {
                if item.0.is_match(name) {
                    return Some(item.1.clone());
                }
            }
        }

        None
    }

    fn is_empty_metadata_element(&self, child: &Child) -> bool {
        if let Child::Element(element) = child {
            if matches!(element.namespace, Namespace::HTML | Namespace::SVG)
                && element.tag_name == "style"
                && self.is_empty_children(&element.children)
            {
                if element.attributes.is_empty() {
                    return true;
                }

                if element.attributes.len() == 1 {
                    return element.attributes.iter().all(|attr| {
                        attr.name == "type"
                            && attr.value.is_some()
                            && self.is_type_text_css(attr.value.as_ref().unwrap())
                    });
                }
            } else if matches!(element.namespace, Namespace::HTML | Namespace::SVG)
                && element.tag_name == "script"
                && self.is_empty_children(&element.children)
            {
                if element.attributes.is_empty() {
                    return true;
                }

                if element.attributes.len() == 1 {
                    return element.attributes.iter().all(|attr| {
                        attr.name == "type"
                            && attr.value.is_some()
                            && (attr.value.as_deref() == Some("module")
                                || self.is_type_text_javascript(attr.value.as_ref().unwrap()))
                    });
                }
            } else if (!self.is_element_displayed(element)
                || (element.namespace == Namespace::HTML && element.tag_name == "noscript"))
                && element.attributes.is_empty()
                && self.is_empty_children(&element.children)
                && element.content.is_none()
            {
                return true;
            }
        }

        false
    }

    fn is_empty_children(&self, children: &Vec<Child>) -> bool {
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

    fn allow_elements_to_merge(&self, left: Option<&Child>, right: &Element) -> bool {
        if let Some(Child::Element(left)) = left {
            let is_style_tag = matches!(left.namespace, Namespace::HTML | Namespace::SVG)
                && left.tag_name == "style"
                && matches!(right.namespace, Namespace::HTML | Namespace::SVG)
                && right.tag_name == "style";
            let is_script_tag = matches!(left.namespace, Namespace::HTML | Namespace::SVG)
                && left.tag_name == "script"
                && matches!(right.namespace, Namespace::HTML | Namespace::SVG)
                && right.tag_name == "script";

            if is_style_tag || is_script_tag {
                let mut need_skip = false;

                let mut left_attributes = left
                    .attributes
                    .clone()
                    .into_iter()
                    .filter(|attribute| match &*attribute.name {
                        "src" if is_script_tag => {
                            need_skip = true;

                            true
                        }
                        "type" => {
                            if let Some(value) = &attribute.value {
                                if (is_style_tag && self.is_type_text_css(value))
                                    || (is_script_tag && self.is_type_text_javascript(value))
                                {
                                    false
                                } else if is_script_tag
                                    && value.trim().to_ascii_lowercase() == "module"
                                {
                                    true
                                } else {
                                    need_skip = true;

                                    true
                                }
                            } else {
                                true
                            }
                        }
                        _ => !self.is_default_attribute_value(left, attribute),
                    })
                    .map(|mut attribute| {
                        self.minify_attribute(left, &mut attribute);

                        attribute
                    })
                    .collect::<Vec<Attribute>>();

                if need_skip {
                    return false;
                }

                let mut right_attributes = right
                    .attributes
                    .clone()
                    .into_iter()
                    .filter(|attribute| match &*attribute.name {
                        "src" if is_script_tag => {
                            need_skip = true;

                            true
                        }
                        "type" => {
                            if let Some(value) = &attribute.value {
                                if (is_style_tag && self.is_type_text_css(value))
                                    || (is_script_tag && self.is_type_text_javascript(value))
                                {
                                    false
                                } else if is_script_tag
                                    && value.trim().to_ascii_lowercase() == "module"
                                {
                                    true
                                } else {
                                    need_skip = true;

                                    true
                                }
                            } else {
                                true
                            }
                        }
                        _ => !self.is_default_attribute_value(right, attribute),
                    })
                    .map(|mut attribute| {
                        self.minify_attribute(right, &mut attribute);

                        attribute
                    })
                    .collect::<Vec<Attribute>>();

                if need_skip {
                    return false;
                }

                left_attributes.sort_by(|a, b| a.name.cmp(&b.name));
                right_attributes.sort_by(|a, b| a.name.cmp(&b.name));

                return left_attributes.eq_ignore_span(&right_attributes);
            }
        }

        false
    }

    fn merge_text_children(&self, left: &Element, right: &Element) -> Option<Vec<Child>> {
        let is_script_tag = matches!(left.namespace, Namespace::HTML | Namespace::SVG)
            && left.tag_name == "script"
            && matches!(right.namespace, Namespace::HTML | Namespace::SVG)
            && right.tag_name == "script";

        // `script`/`style` elements should have only one text child
        let left_data = match left.children.first() {
            Some(Child::Text(left)) => left.data.to_string(),
            None => String::new(),
            _ => return None,
        };

        let right_data = match right.children.first() {
            Some(Child::Text(right)) => right.data.to_string(),
            None => String::new(),
            _ => return None,
        };

        let mut data = String::with_capacity(left_data.len() + right_data.len());

        if is_script_tag {
            let is_modules = if is_script_tag {
                left.attributes.iter().any(|attribute| matches!(&attribute.value, Some(value) if value.trim().to_ascii_lowercase() == "module"))
            } else {
                false
            };

            match self.merge_js(left_data, right_data, is_modules) {
                Some(minified) => {
                    data.push_str(&minified);
                }
                _ => {
                    return None;
                }
            }
        } else {
            data.push_str(&left_data);
            data.push_str(&right_data);
        }

        if data.is_empty() {
            return Some(Vec::new());
        }

        Some(vec![Child::Text(Text {
            span: DUMMY_SP,
            data: data.into(),
            raw: None,
        })])
    }

    fn minify_children(&mut self, children: &mut Vec<Child>) -> Vec<Child> {
        if children.is_empty() {
            return Vec::new();
        }

        let parent = match &self.current_element {
            Some(element) => element,
            _ => return children.to_vec(),
        };

        let mode = self.get_whitespace_minification_for_tag(parent);

        let child_will_be_retained =
            |child: &mut Child, prev_children: &mut Vec<Child>, next_children: &mut Vec<Child>| {
                match child {
                    Child::Comment(comment) if self.options.remove_comments => {
                        self.is_preserved_comment(&comment.data)
                    }
                    Child::Element(element)
                        if self.options.merge_metadata_elements
                            && self.allow_elements_to_merge(prev_children.last(), element) =>
                    {
                        if let Some(Child::Element(prev)) = prev_children.last_mut() {
                            if let Some(children) = self.merge_text_children(prev, element) {
                                prev.children = children;

                                false
                            } else {
                                true
                            }
                        } else {
                            true
                        }
                    }
                    Child::Text(text) if text.data.is_empty() => false,
                    Child::Text(text)
                        if self.need_collapse_whitespace()
                            && parent.namespace == Namespace::HTML
                            && matches!(&*parent.tag_name, "html" | "head")
                            && text.data.chars().all(is_whitespace) =>
                    {
                        false
                    }
                    Child::Text(text)
                        if !self.descendant_of_pre
                            && get_white_space(parent.namespace, &parent.tag_name)
                                == WhiteSpace::Normal
                            && matches!(
                                self.options.collapse_whitespaces,
                                CollapseWhitespaces::All
                                    | CollapseWhitespaces::Smart
                                    | CollapseWhitespaces::OnlyMetadata
                                    | CollapseWhitespaces::Conservative
                                    | CollapseWhitespaces::AdvancedConservative
                            ) =>
                    {
                        let mut is_smart_left_trim = false;
                        let mut is_smart_right_trim = false;

                        if matches!(
                            self.options.collapse_whitespaces,
                            CollapseWhitespaces::Smart
                                | CollapseWhitespaces::OnlyMetadata
                                | CollapseWhitespaces::AdvancedConservative
                        ) {
                            let need_remove_metadata_whitespaces = matches!(
                                self.options.collapse_whitespaces,
                                CollapseWhitespaces::OnlyMetadata
                                    | CollapseWhitespaces::AdvancedConservative
                            );

                            let prev = prev_children.last();
                            let prev_display = match prev {
                                Some(Child::Element(element)) => Some(self.get_display(element)),
                                Some(Child::Comment(_)) => match need_remove_metadata_whitespaces {
                                    true => None,
                                    _ => Some(Display::None),
                                },
                                _ => None,
                            };

                            let allow_to_trim_left = match prev_display {
                                // Block-level containers:
                                //
                                // `Display::Block`    - `display: block flow`
                                // `Display::ListItem` - `display: block flow list-item`
                                // `Display::Table`    - `display: block table`
                                //
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
                                // Elements are not displayed
                                // And
                                // Inline box
                                Some(Display::None) | Some(Display::Inline) => {
                                    // A custom element can contain any elements, we cannot predict
                                    // the behavior of spaces
                                    let is_custom_element =
                                        if let Some(Child::Element(element)) = &prev {
                                            self.is_custom_element(element)
                                        } else {
                                            false
                                        };

                                    if is_custom_element {
                                        false
                                    } else {
                                        match &self.get_prev_displayed_node(
                                            prev_children,
                                            prev_children.len() - 1,
                                        ) {
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
                                                let parent_display = self.get_display(parent);

                                                match parent_display {
                                                    Display::Inline => {
                                                        if let Some(Child::Text(Text {
                                                            data,
                                                            ..
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
                                    // For custom elements - an unnamed `<slot>` will be filled with
                                    // all of the custom
                                    // element's top-level child
                                    // nodes that do not have the slot
                                    // attribute. This includes text nodes.
                                    // Also they can be used for custom logic

                                    if (parent.namespace == Namespace::HTML
                                        && parent.tag_name == "template")
                                        || self.is_custom_element(parent)
                                    {
                                        false
                                    } else {
                                        let parent_display = self.get_display(parent);

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

                            let next = next_children.first();
                            let next_display = match next {
                                Some(Child::Element(element)) => Some(self.get_display(element)),
                                Some(Child::Comment(_)) => match need_remove_metadata_whitespaces {
                                    true => None,
                                    _ => Some(Display::None),
                                },
                                _ => None,
                            };

                            let allow_to_trim_right = match next_display {
                                // Block-level containers:
                                //
                                // `Display::Block`    - `display: block flow`
                                // `Display::ListItem` - `display: block flow list-item`
                                // `Display::Table`    - `display: block table`
                                //
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
                                Some(Display::None) => {
                                    match &self.get_next_displayed_node(next_children, 0) {
                                        Some(Child::Text(text)) => {
                                            text.data.starts_with(is_whitespace)
                                        }
                                        Some(Child::Element(element)) => {
                                            let deep = self.get_first_displayed_text_node(
                                                &element.children,
                                                0,
                                            );

                                            if let Some(deep) = deep {
                                                !deep.data.starts_with(is_whitespace)
                                            } else {
                                                false
                                            }
                                        }
                                        _ => {
                                            let parent_display = self.get_display(parent);

                                            !matches!(parent_display, Display::Inline)
                                        }
                                    }
                                }
                                Some(_) => false,
                                None => {
                                    // Template can be used in any place, so let's keep whitespaces
                                    let is_template = parent.namespace == Namespace::HTML
                                        && parent.tag_name == "template";

                                    if is_template {
                                        false
                                    } else {
                                        let parent_display = self.get_display(parent);

                                        !matches!(parent_display, Display::Inline)
                                    }
                                }
                            };

                            if matches!(
                                self.options.collapse_whitespaces,
                                CollapseWhitespaces::Smart
                            ) || (need_remove_metadata_whitespaces
                                && (prev_display == Some(Display::None)
                                    && next_display == Some(Display::None)))
                            {
                                is_smart_left_trim = allow_to_trim_left;
                                is_smart_right_trim = allow_to_trim_right;
                            }
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

        for _ in 0..children.len() {
            let mut child = children.remove(0);

            if let Child::Text(text) = &mut child {
                if let Some(Child::Text(prev_text)) = new_children.last_mut() {
                    let mut new_data =
                        String::with_capacity(prev_text.data.len() + text.data.len());

                    new_data.push_str(&prev_text.data);
                    new_data.push_str(&text.data);

                    text.data = new_data.into();

                    new_children.pop();
                }
            };

            let result = child_will_be_retained(&mut child, &mut new_children, children);

            if self.options.remove_empty_metadata_elements {
                if let Some(last_child @ Child::Element(_)) = new_children.last() {
                    if self.is_empty_metadata_element(last_child) {
                        new_children.pop();

                        if let Child::Text(text) = &mut child {
                            if let Some(Child::Text(prev_text)) = new_children.last_mut() {
                                let mut new_data =
                                    String::with_capacity(prev_text.data.len() + text.data.len());

                                new_data.push_str(&prev_text.data);
                                new_data.push_str(&text.data);

                                text.data = new_data.into();

                                new_children.pop();
                            }
                        }
                    }
                }
            }

            if result {
                new_children.push(child);
            }
        }

        new_children
    }

    fn get_attribute_value<'a>(
        &self,
        attributes: &'a Vec<Attribute>,
        name: &str,
    ) -> Option<&'a JsWord> {
        let mut type_attribute_value = None;

        for attribute in attributes {
            if attribute.name == name {
                if let Some(value) = &attribute.value {
                    type_attribute_value = Some(value);
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

    fn merge_js(&self, left: String, right: String, is_modules: bool) -> Option<String> {
        let comments = SingleThreadedComments::default();
        let cm = Lrc::new(SourceMap::new(FilePathMapping::empty()));

        // Left
        let mut left_errors: Vec<_> = Vec::new();
        let left_fm = cm.new_source_file(FileName::Anon.into(), left);
        let syntax = swc_ecma_parser::Syntax::default();
        // Use the latest target for merging
        let target = swc_ecma_ast::EsVersion::latest();

        let mut left_program = if is_modules {
            match swc_ecma_parser::parse_file_as_module(
                &left_fm,
                syntax,
                target,
                Some(&comments),
                &mut left_errors,
            ) {
                Ok(module) => swc_ecma_ast::Program::Module(module),
                _ => return None,
            }
        } else {
            match swc_ecma_parser::parse_file_as_script(
                &left_fm,
                syntax,
                target,
                Some(&comments),
                &mut left_errors,
            ) {
                Ok(script) => swc_ecma_ast::Program::Script(script),
                _ => return None,
            }
        };

        // Avoid compress potential invalid JS
        if !left_errors.is_empty() {
            return None;
        }

        let unresolved_mark = Mark::new();
        let left_top_level_mark = Mark::new();

        swc_ecma_visit::VisitMutWith::visit_mut_with(
            &mut left_program,
            &mut swc_ecma_transforms_base::resolver(unresolved_mark, left_top_level_mark, false),
        );

        // Right
        let mut right_errors: Vec<_> = Vec::new();
        let right_fm = cm.new_source_file(FileName::Anon.into(), right);

        let mut right_program = if is_modules {
            match swc_ecma_parser::parse_file_as_module(
                &right_fm,
                syntax,
                target,
                Some(&comments),
                &mut right_errors,
            ) {
                Ok(module) => swc_ecma_ast::Program::Module(module),
                _ => return None,
            }
        } else {
            match swc_ecma_parser::parse_file_as_script(
                &right_fm,
                syntax,
                target,
                Some(&comments),
                &mut right_errors,
            ) {
                Ok(script) => swc_ecma_ast::Program::Script(script),
                _ => return None,
            }
        };

        // Avoid compress potential invalid JS
        if !right_errors.is_empty() {
            return None;
        }

        let right_top_level_mark = Mark::new();

        swc_ecma_visit::VisitMutWith::visit_mut_with(
            &mut right_program,
            &mut swc_ecma_transforms_base::resolver(unresolved_mark, right_top_level_mark, false),
        );

        // Merge
        match &mut left_program {
            swc_ecma_ast::Program::Module(left_program) => match right_program {
                swc_ecma_ast::Program::Module(right_program) => {
                    left_program.body.extend(right_program.body);
                }
                _ => {
                    unreachable!();
                }
            },
            swc_ecma_ast::Program::Script(left_program) => match right_program {
                swc_ecma_ast::Program::Script(right_program) => {
                    left_program.body.extend(right_program.body);
                }
                _ => {
                    unreachable!();
                }
            },
        }

        if is_modules {
            swc_ecma_visit::VisitMutWith::visit_mut_with(
                &mut left_program,
                &mut swc_ecma_transforms_base::hygiene::hygiene(),
            );
        }

        let left_program =
            left_program.apply(swc_ecma_transforms_base::fixer::fixer(Some(&comments)));

        let mut buf = Vec::new();

        {
            let wr = Box::new(swc_ecma_codegen::text_writer::JsWriter::new(
                cm.clone(),
                "\n",
                &mut buf,
                None,
            )) as Box<dyn swc_ecma_codegen::text_writer::WriteJs>;

            let mut emitter = swc_ecma_codegen::Emitter {
                cfg: swc_ecma_codegen::Config::default().with_target(target),
                cm,
                comments: Some(&comments),
                wr,
            };

            emitter.emit_program(&left_program).unwrap();
        }

        let code = match String::from_utf8(buf) {
            Ok(minified) => minified,
            _ => return None,
        };

        Some(code)
    }

    // TODO source map url output for JS and CSS?
    fn minify_js(&self, data: String, is_module: bool, is_attribute: bool) -> Option<String> {
        let mut errors: Vec<_> = Vec::new();

        let cm = Lrc::new(SourceMap::new(FilePathMapping::empty()));
        let fm = cm.new_source_file(FileName::Anon.into(), data);
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

        if let Some(compress_options) = &mut options.minifier.compress {
            compress_options.module = is_module;
        } else {
            options.minifier.compress = Some(swc_ecma_minifier::option::CompressOptions {
                ecma: options.parser.target,
                ..Default::default()
            });
        }

        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        swc_ecma_visit::VisitMutWith::visit_mut_with(
            &mut program,
            &mut swc_ecma_transforms_base::resolver(unresolved_mark, top_level_mark, false),
        );

        let program = program.apply(swc_ecma_transforms_base::fixer::paren_remover(Some(
            &comments,
        )));

        let program = swc_ecma_minifier::optimize(
            program,
            cm.clone(),
            if options.parser.comments {
                Some(&comments)
            } else {
                None
            },
            None,
            // TODO allow to keep `var`/function/etc on top level
            &options.minifier,
            &swc_ecma_minifier::option::ExtraOptions {
                unresolved_mark,
                top_level_mark,
                mangle_name_cache: None,
            },
        );

        let program = program.apply(swc_ecma_transforms_base::fixer::fixer(Some(&comments)));

        let mut buf = Vec::new();

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
            options.codegen.omit_last_semi = true;

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
            // Avoid generating the sequence "</script" in JS code
            // TODO move it to ecma codegen under the option?
            Ok(minified) => minified.replace("</script>", "<\\/script>"),
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
            .rsplitn(2, ['\t', '\n', '\x0C', '\r', ' '])
            .collect::<Vec<&str>>();

        if values.len() != 2 {
            return None;
        }

        if !values[1].starts_with('(') {
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
        self.css_minifier
            .minify_css(&self.options.minify_css, data, mode)
    }

    fn minify_html(&self, data: String, mode: HtmlMinificationMode) -> Option<String> {
        let mut errors: Vec<_> = Vec::new();

        let cm = Lrc::new(SourceMap::new(FilePathMapping::empty()));
        let fm = cm.new_source_file(FileName::Anon.into(), data);

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
                    attributes: Vec::new(),
                    children: Vec::new(),
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
                minify_document_with_custom_css_minifier(document, self.options, self.css_minifier);
            }
            HtmlRoot::DocumentFragment(ref mut document_fragment) => {
                minify_document_fragment_with_custom_css_minifier(
                    document_fragment,
                    context_element.as_ref().unwrap(),
                    self.options,
                    self.css_minifier,
                )
            }
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
                quotes: None,
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

    fn minify_attribute(&self, element: &Element, n: &mut Attribute) {
        if let Some(value) = &n.value {
            if value.is_empty() {
                if (self.options.collapse_boolean_attributes
                    && self.is_boolean_attribute(element, n))
                    || (self.options.normalize_attributes
                        && self.is_crossorigin_attribute(element, n)
                        && value.is_empty())
                {
                    n.value = None;
                }

                return;
            }

            match (element.namespace, &*element.tag_name, &*n.name) {
                (Namespace::HTML, "iframe", "srcdoc") => {
                    if let Some(minified) = self.minify_html(
                        value.to_string(),
                        HtmlMinificationMode::DocumentIframeSrcdoc,
                    ) {
                        n.value = Some(minified.into());
                    };
                }
                (
                    Namespace::HTML | Namespace::SVG,
                    "style" | "link" | "script" | "input",
                    "type",
                ) if self.options.normalize_attributes => {
                    n.value = Some(value.trim().to_ascii_lowercase().into());
                }
                _ if self.options.normalize_attributes
                    && self.is_crossorigin_attribute(element, n)
                    && value.to_ascii_lowercase() == "anonymous" =>
                {
                    n.value = None;
                }
                _ if self.options.collapse_boolean_attributes
                    && self.is_boolean_attribute(element, n) =>
                {
                    n.value = None;
                }
                _ if self.is_event_handler_attribute(n) => {
                    let mut value = value.to_string();

                    if self.options.normalize_attributes {
                        value = value.trim().into();

                        if value.trim().to_lowercase().starts_with("javascript:") {
                            value = value.chars().skip(11).collect();
                        }
                    }

                    if self.need_minify_js() {
                        if let Some(minified) = self.minify_js(value, false, true) {
                            n.value = Some(minified.into());
                        };
                    } else {
                        n.value = Some(value.into());
                    }
                }
                _ if self.options.normalize_attributes
                    && element.namespace == Namespace::HTML
                    && n.name == "contenteditable"
                    && n.value.as_deref() == Some("true") =>
                {
                    n.value = Some(js_word!(""));
                }
                _ if self.options.normalize_attributes
                    && self.is_semicolon_separated_attribute(element, n) =>
                {
                    n.value = Some(
                        value
                            .split(';')
                            .map(|value| self.collapse_whitespace(value.trim()))
                            .collect::<Vec<_>>()
                            .join(";")
                            .into(),
                    );
                }
                _ if self.options.normalize_attributes
                    && n.name == "content"
                    && self.element_has_attribute_with_value(
                        element,
                        "http-equiv",
                        &["content-security-policy"],
                    ) =>
                {
                    let mut new_values = Vec::new();

                    for value in value.trim().split(';') {
                        new_values.push(
                            value
                                .trim()
                                .split(' ')
                                .filter(|s| !s.is_empty())
                                .collect::<Vec<_>>()
                                .join(" "),
                        );
                    }

                    let mut value = new_values.join(";");

                    if value.ends_with(';') {
                        value.pop();
                    }

                    n.value = Some(value.into());
                }
                _ if self.options.sort_space_separated_attribute_values
                    && self.is_attribute_value_unordered_set(element, n) =>
                {
                    let mut values = value.split_whitespace().collect::<Vec<_>>();

                    values.sort_unstable();

                    n.value = Some(values.join(" ").into());
                }
                _ if self.options.normalize_attributes
                    && self.is_space_separated_attribute(element, n) =>
                {
                    n.value = Some(
                        value
                            .split_whitespace()
                            .collect::<Vec<_>>()
                            .join(" ")
                            .into(),
                    );
                }
                _ if self.is_comma_separated_attribute(element, n) => {
                    let mut value = value.to_string();

                    if self.options.normalize_attributes {
                        value = value
                            .split(',')
                            .map(|value| {
                                if matches!(&*n.name, "sizes" | "imagesizes") {
                                    let trimmed = value.trim();

                                    match self.minify_sizes(trimmed) {
                                        Some(minified) => minified,
                                        _ => trimmed.to_string(),
                                    }
                                } else if matches!(&*n.name, "points") {
                                    self.collapse_whitespace(value.trim()).to_string()
                                } else if matches!(&*n.name, "exportparts") {
                                    value.chars().filter(|c| !c.is_whitespace()).collect()
                                } else {
                                    value.trim().to_string()
                                }
                            })
                            .collect::<Vec<_>>()
                            .join(",");
                    }

                    if self.need_minify_css() && n.name == "media" && !value.is_empty() {
                        if let Some(minified) =
                            self.minify_css(value, CssMinificationMode::MediaQueryList)
                        {
                            n.value = Some(minified.into());
                        }
                    } else {
                        n.value = Some(value.into());
                    }
                }
                _ if self.is_trimable_separated_attribute(element, n) => {
                    let mut value = value.to_string();

                    let fallback = |n: &mut Attribute| {
                        if self.options.normalize_attributes {
                            n.value = Some(value.trim().into());
                        }
                    };

                    if self.need_minify_css() && n.name == "style" && !value.is_empty() {
                        let value = value.trim();

                        if let Some(minified) = self
                            .minify_css(value.to_string(), CssMinificationMode::ListOfDeclarations)
                        {
                            n.value = Some(minified.into());
                        } else {
                            fallback(n);
                        }
                    } else if self.need_minify_js() && self.is_javascript_url_element(element) {
                        if value.trim().to_lowercase().starts_with("javascript:") {
                            value = value.trim().chars().skip(11).collect();

                            if let Some(minified) = self.minify_js(value, false, true) {
                                let mut with_javascript =
                                    String::with_capacity(11 + minified.len());

                                with_javascript.push_str("javascript:");
                                with_javascript.push_str(&minified);

                                n.value = Some(with_javascript.into());
                            }
                        } else {
                            fallback(n);
                        }
                    } else {
                        fallback(n);
                    }
                }
                _ if self.options.minify_additional_attributes.is_some() => {
                    match self.is_additional_minifier_attribute(&n.name) {
                        Some(MinifierType::JsScript) if self.need_minify_js() => {
                            if let Some(minified) = self.minify_js(value.to_string(), false, true) {
                                n.value = Some(minified.into());
                            }
                        }
                        Some(MinifierType::JsModule) if self.need_minify_js() => {
                            if let Some(minified) = self.minify_js(value.to_string(), true, true) {
                                n.value = Some(minified.into());
                            }
                        }
                        Some(MinifierType::Json) if self.need_minify_json() => {
                            if let Some(minified) = self.minify_json(value.to_string()) {
                                n.value = Some(minified.into());
                            }
                        }
                        Some(MinifierType::Css) if self.need_minify_css() => {
                            if let Some(minified) = self.minify_css(
                                value.to_string(),
                                CssMinificationMode::ListOfDeclarations,
                            ) {
                                n.value = Some(minified.into());
                            }
                        }
                        Some(MinifierType::Html) => {
                            if let Some(minified) = self.minify_html(
                                value.to_string(),
                                HtmlMinificationMode::DocumentIframeSrcdoc,
                            ) {
                                n.value = Some(minified.into());
                            };
                        }
                        _ => {}
                    }
                }
                _ => {}
            }
        }
    }
}

impl<C: MinifyCss> VisitMut for Minifier<'_, C> {
    fn visit_mut_document(&mut self, n: &mut Document) {
        n.visit_mut_children_with(self);

        n.children
            .retain(|child| !matches!(child, Child::Comment(_) if self.options.remove_comments));
    }

    fn visit_mut_document_fragment(&mut self, n: &mut DocumentFragment) {
        n.children = self.minify_children(&mut n.children);

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

        if matches!(
            self.options.collapse_whitespaces,
            CollapseWhitespaces::Smart
                | CollapseWhitespaces::AdvancedConservative
                | CollapseWhitespaces::OnlyMetadata
        ) {
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
            children: Vec::new(),
            content: None,
            is_self_closing: n.is_self_closing,
        });

        let old_descendant_of_pre = self.descendant_of_pre;

        if self.need_collapse_whitespace() && !old_descendant_of_pre {
            self.descendant_of_pre = get_white_space(n.namespace, &n.tag_name) == WhiteSpace::Pre;
        }

        n.children = self.minify_children(&mut n.children);

        n.visit_mut_children_with(self);

        // Remove all leading and trailing whitespaces for the `body` element
        if n.namespace == Namespace::HTML && n.tag_name == "body" && self.need_collapse_whitespace()
        {
            self.remove_leading_and_trailing_whitespaces(&mut n.children, true, true);
        }

        if self.need_collapse_whitespace() {
            self.descendant_of_pre = old_descendant_of_pre;
        }

        let mut remove_list = Vec::new();

        for (i, i1) in n.attributes.iter().enumerate() {
            if i1.value.is_some() {
                if self.options.remove_redundant_attributes != RemoveRedundantAttributes::None
                    && self.is_default_attribute_value(n, i1)
                {
                    remove_list.push(i);

                    continue;
                }

                if self.options.remove_empty_attributes {
                    let value = i1.value.as_ref().unwrap();

                    if (matches!(&*i1.name, "id") && value.is_empty())
                        || (matches!(&*i1.name, "class" | "style") && value.is_empty())
                        || self.is_event_handler_attribute(i1) && value.is_empty()
                    {
                        remove_list.push(i);

                        continue;
                    }
                }
            }

            for (j, j1) in n.attributes.iter().enumerate() {
                if i < j && i1.name == j1.name {
                    remove_list.push(j);
                }
            }
        }

        // Fast path. We don't face real duplicates in most cases.
        if !remove_list.is_empty() {
            let new = take(&mut n.attributes)
                .into_iter()
                .enumerate()
                .filter_map(|(idx, value)| {
                    if remove_list.contains(&idx) {
                        None
                    } else {
                        Some(value)
                    }
                })
                .collect::<Vec<_>>();

            n.attributes = new;
        }

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

        let element = match &self.current_element {
            Some(current_element) => current_element,
            _ => return,
        };

        self.minify_attribute(element, n);
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
                    let type_attribute_value: Option<JsWord> = self
                        .get_attribute_value(&current_element.attributes, "type")
                        .map(|v| v.to_ascii_lowercase().trim().into());

                    match type_attribute_value.as_deref() {
                        Some("module") if self.need_minify_js() => {
                            text_type = Some(MinifierType::JsModule);
                        }
                        Some(value)
                            if self.need_minify_js() && self.is_type_text_javascript(value) =>
                        {
                            text_type = Some(MinifierType::JsScript);
                        }
                        None if self.need_minify_js() => {
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
                        if attribute.name == "type" && attribute.value.is_some() {
                            type_attribute_value = Some(attribute.value.as_ref().unwrap());

                            break;
                        }
                    }

                    if type_attribute_value.is_none()
                        || self.is_type_text_css(type_attribute_value.as_ref().unwrap())
                    {
                        text_type = Some(MinifierType::Css)
                    }
                }
                "title" if current_element.namespace == Namespace::HTML => {
                    n.data = self.collapse_whitespace(&n.data).trim().into();
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

pub trait MinifyCss {
    type Options;
    fn minify_css(
        &self,
        options: &MinifyCssOption<Self::Options>,
        data: String,
        mode: CssMinificationMode,
    ) -> Option<String>;
}

#[cfg(feature = "default-css-minifier")]
struct DefaultCssMinifier;

#[cfg(feature = "default-css-minifier")]
impl DefaultCssMinifier {
    fn get_css_options(&self, options: &MinifyCssOption<CssOptions>) -> CssOptions {
        match options {
            MinifyCssOption::Bool(_) => CssOptions {
                parser: swc_css_parser::parser::ParserConfig::default(),
                minifier: swc_css_minifier::options::MinifyOptions::default(),
                codegen: swc_css_codegen::CodegenConfig::default(),
            },
            MinifyCssOption::Options(css_options) => css_options.clone(),
        }
    }
}

#[cfg(feature = "default-css-minifier")]
impl MinifyCss for DefaultCssMinifier {
    type Options = CssOptions;

    fn minify_css(
        &self,
        options: &MinifyCssOption<Self::Options>,
        data: String,
        mode: CssMinificationMode,
    ) -> Option<String> {
        let mut errors: Vec<_> = Vec::new();

        let cm = Lrc::new(SourceMap::new(FilePathMapping::empty()));
        let fm = cm.new_source_file(FileName::Anon.into(), data);

        let mut options = self.get_css_options(options);

        let mut stylesheet = match mode {
            CssMinificationMode::Stylesheet => {
                match swc_css_parser::parse_file(&fm, None, options.parser, &mut errors) {
                    Ok(stylesheet) => stylesheet,
                    _ => return None,
                }
            }
            CssMinificationMode::ListOfDeclarations => {
                match swc_css_parser::parse_file::<Vec<swc_css_ast::DeclarationOrAtRule>>(
                    &fm,
                    None,
                    options.parser,
                    &mut errors,
                ) {
                    Ok(list_of_declarations) => {
                        let declaration_list: Vec<swc_css_ast::ComponentValue> =
                            list_of_declarations
                                .into_iter()
                                .map(|node| node.into())
                                .collect();

                        swc_css_ast::Stylesheet {
                            span: Default::default(),
                            rules: vec![swc_css_ast::Rule::QualifiedRule(
                                swc_css_ast::QualifiedRule {
                                    span: Default::default(),
                                    prelude: swc_css_ast::QualifiedRulePrelude::SelectorList(
                                        swc_css_ast::SelectorList {
                                            span: Default::default(),
                                            children: Vec::new(),
                                        },
                                    ),
                                    block: swc_css_ast::SimpleBlock {
                                        span: Default::default(),
                                        name: swc_css_ast::TokenAndSpan {
                                            span: DUMMY_SP,
                                            token: swc_css_ast::Token::LBrace,
                                        },
                                        value: declaration_list,
                                    },
                                }
                                .into(),
                            )],
                        }
                    }
                    _ => return None,
                }
            }
            CssMinificationMode::MediaQueryList => {
                match swc_css_parser::parse_file::<swc_css_ast::MediaQueryList>(
                    &fm,
                    None,
                    options.parser,
                    &mut errors,
                ) {
                    Ok(media_query_list) => swc_css_ast::Stylesheet {
                        span: Default::default(),
                        rules: vec![swc_css_ast::Rule::AtRule(
                            swc_css_ast::AtRule {
                                span: Default::default(),
                                name: swc_css_ast::AtRuleName::Ident(swc_css_ast::Ident {
                                    span: Default::default(),
                                    value: "media".into(),
                                    raw: None,
                                }),
                                prelude: Some(
                                    swc_css_ast::AtRulePrelude::MediaPrelude(media_query_list)
                                        .into(),
                                ),
                                block: Some(swc_css_ast::SimpleBlock {
                                    span: Default::default(),
                                    name: swc_css_ast::TokenAndSpan {
                                        span: DUMMY_SP,
                                        token: swc_css_ast::Token::LBrace,
                                    },
                                    // TODO make the `compress_empty` option for CSS minifier and
                                    // remove it
                                    value: vec![swc_css_ast::ComponentValue::Str(Box::new(
                                        swc_css_ast::Str {
                                            span: Default::default(),
                                            value: "placeholder".into(),
                                            raw: None,
                                        },
                                    ))],
                                }),
                            }
                            .into(),
                        )],
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
                let Some(swc_css_ast::Rule::QualifiedRule(qualified_rule)) = rules.first() else {
                    return None;
                };

                let swc_css_ast::QualifiedRule { block, .. } = &**qualified_rule;

                swc_css_codegen::Emit::emit(&mut gen, &block).unwrap();

                minified = minified[1..minified.len() - 1].to_string();
            }
            CssMinificationMode::MediaQueryList => {
                let swc_css_ast::Stylesheet { rules, .. } = &stylesheet;

                // Because CSS is grammar free, protect for fails
                let Some(swc_css_ast::Rule::AtRule(at_rule)) = rules.first() else {
                    return None;
                };

                let swc_css_ast::AtRule { prelude, .. } = &**at_rule;

                swc_css_codegen::Emit::emit(&mut gen, &prelude).unwrap();

                minified = minified.trim().to_string();
            }
        }

        Some(minified)
    }
}

fn create_minifier<'a, C: MinifyCss>(
    context_element: Option<&Element>,
    options: &'a MinifyOptions<C::Options>,
    css_minifier: &'a C,
) -> Minifier<'a, C> {
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

        css_minifier,
    }
}

pub fn minify_document_with_custom_css_minifier<C: MinifyCss>(
    document: &mut Document,
    options: &MinifyOptions<C::Options>,
    css_minifier: &C,
) {
    let mut minifier = create_minifier(None, options, css_minifier);

    if options.sort_attributes {
        let mut attribute_name_counter = AttributeNameCounter {
            tree: Default::default(),
        };

        document.visit_mut_with(&mut attribute_name_counter);

        minifier.attribute_name_counter = Some(attribute_name_counter.tree);
    }

    document.visit_mut_with(&mut minifier);
}

pub fn minify_document_fragment_with_custom_css_minifier<C: MinifyCss>(
    document_fragment: &mut DocumentFragment,
    context_element: &Element,
    options: &MinifyOptions<C::Options>,
    css_minifier: &C,
) {
    let mut minifier = create_minifier(Some(context_element), options, css_minifier);

    if options.sort_attributes {
        let mut attribute_name_counter = AttributeNameCounter {
            tree: Default::default(),
        };

        document_fragment.visit_mut_with(&mut attribute_name_counter);

        minifier.attribute_name_counter = Some(attribute_name_counter.tree);
    }

    document_fragment.visit_mut_with(&mut minifier);
}

#[cfg(feature = "default-css-minifier")]
pub fn minify_document(document: &mut Document, options: &MinifyOptions<CssOptions>) {
    minify_document_with_custom_css_minifier(document, options, &DefaultCssMinifier)
}

#[cfg(feature = "default-css-minifier")]
pub fn minify_document_fragment(
    document_fragment: &mut DocumentFragment,
    context_element: &Element,
    options: &MinifyOptions<CssOptions>,
) {
    minify_document_fragment_with_custom_css_minifier(
        document_fragment,
        context_element,
        options,
        &DefaultCssMinifier,
    )
}
