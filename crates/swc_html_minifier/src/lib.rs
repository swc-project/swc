#![deny(clippy::all)]

use serde_json::Value;
use swc_atoms::{js_word, JsWord};
use swc_common::collections::AHashSet;
use swc_html_ast::*;
use swc_html_visit::{VisitMut, VisitMutWith};

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

static COMMA_SEPARATED_GLOBAL_ATTRIBUTES: &[&str] = &["class"];

static COMMA_SEPARATED_HTML_ATTRIBUTES: &[(&str, &str)] = &[
    ("img", "srcset"),
    ("source", "srcset"),
    ("img", "sizes"),
    ("source", "sizes"),
    ("link", "media"),
    ("source", "media"),
    ("style", "media"),
];

static SPACE_SEPARATED_GLOBAL_ATTRIBUTES: &[&str] = &[
    "class",
    "itemtype",
    "itemref",
    "itemprop",
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
    ("input", "autocomplete"),
    ("form", "autocomplete"),
    ("iframe", "sandbox"),
    ("td", "headers"),
    ("th", "headers"),
    ("output", "for"),
    ("link", "blocking"),
    ("script", "blocking"),
    ("style", "blocking"),
];

enum MetaElementContentType {
    CommaSeparated,
    SemiSeparated,
}

struct Minifier {
    current_element_namespace: Option<Namespace>,
    current_element_tag_name: Option<JsWord>,
    is_script_with_json: bool,
    meta_element_content_type: Option<MetaElementContentType>,
}

impl Minifier {
    fn is_event_handler_attribute(&self, name: &str) -> bool {
        EVENT_HANDLER_ATTRIBUTES.contains(&name)
    }

    fn is_boolean_attribute(&self, name: &str) -> bool {
        HTML_BOOLEAN_ATTRIBUTES.contains(&name)
    }

    fn is_global_trimable_attribute(&self, name: &str) -> bool {
        ALLOW_TO_TRIM_GLOBAL_ATTRIBUTES.contains(&name)
    }

    fn is_html_trimable_attribute(
        &self,
        tag_name: Option<&JsWord>,
        attribute_name: &JsWord,
    ) -> bool {
        let tag_name = match tag_name {
            Some(tag_name) => tag_name,
            _ => return false,
        };

        ALLOW_TO_TRIM_HTML_ATTRIBUTES.contains(&(tag_name, attribute_name))
    }

    fn is_global_comma_separated_attribute(&self, name: &str) -> bool {
        COMMA_SEPARATED_GLOBAL_ATTRIBUTES.contains(&name)
    }

    fn is_html_comma_separated_attribute(
        &self,
        tag_name: Option<&JsWord>,
        attribute_name: &JsWord,
    ) -> bool {
        let tag_name = match tag_name {
            Some(tag_name) => tag_name,
            _ => return false,
        };

        COMMA_SEPARATED_HTML_ATTRIBUTES.contains(&(tag_name, attribute_name))
    }

    fn is_global_space_separated_attribute(&self, name: &str) -> bool {
        SPACE_SEPARATED_GLOBAL_ATTRIBUTES.contains(&name)
    }

    fn is_html_space_separated_attribute(
        &self,
        tag_name: Option<&JsWord>,
        attribute_name: &JsWord,
    ) -> bool {
        let tag_name = match tag_name {
            Some(tag_name) => tag_name,
            _ => return false,
        };

        SPACE_SEPARATED_HTML_ATTRIBUTES.contains(&(tag_name, attribute_name))
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
            (Namespace::HTML, "iframe", "height", "150")
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
        )
    }

    fn is_conditional_comment(&self, data: &str) -> bool {
        let trimmed = data.trim();

        if trimmed.starts_with("[if") || trimmed.ends_with("[endif]") {
            return true;
        }

        false
    }
}

impl VisitMut for Minifier {
    fn visit_mut_element(&mut self, n: &mut Element) {
        self.current_element_namespace = Some(n.namespace);
        self.current_element_tag_name = Some(n.tag_name.clone());

        if n.namespace == Namespace::HTML {
            match &*n.tag_name {
                "meta" => {
                    if n.attributes.iter().any(|attribute| {
                        match &*attribute.name.to_ascii_lowercase() {
                            "name"
                                if attribute.value.is_some()
                                    && &*attribute.value.as_ref().unwrap().to_ascii_lowercase()
                                        == "viewport" =>
                            {
                                true
                            }
                            _ => false,
                        }
                    }) {
                        self.meta_element_content_type =
                            Some(MetaElementContentType::CommaSeparated);
                    } else if n.attributes.iter().any(|attribute| {
                        match &*attribute.name.to_ascii_lowercase() {
                            "http-equiv"
                                if attribute.value.is_some()
                                    && &*attribute.value.as_ref().unwrap().to_ascii_lowercase()
                                        == "content-security-policy" =>
                            {
                                true
                            }
                            _ => false,
                        }
                    }) {
                        self.meta_element_content_type =
                            Some(MetaElementContentType::SemiSeparated);
                    } else {
                        self.meta_element_content_type = None;
                    }
                }
                "script"
                    if n.attributes.iter().any(|attribute| match &*attribute.name {
                        "type"
                            if attribute.value.is_some()
                                && matches!(
                                    &**attribute.value.as_ref().unwrap(),
                                    "application/json"
                                        | "application/ld+json"
                                        | "importmap"
                                        | "speculationrules"
                                ) =>
                        {
                            true
                        }
                        _ => false,
                    }) =>
                {
                    self.is_script_with_json = true;
                }
                _ => {
                    self.meta_element_content_type = None;
                    self.is_script_with_json = false;
                }
            }
        }

        n.visit_mut_children_with(self);

        let allow_to_remove_spaces = &*n.tag_name == "head" && n.namespace == Namespace::HTML;

        n.children.retain(|child| match child {
            Child::Comment(comment) if !self.is_conditional_comment(&comment.data) => false,
            Child::Text(_) if allow_to_remove_spaces => false,
            _ => true,
        });

        let mut already_seen: AHashSet<JsWord> = Default::default();

        n.attributes.retain(|attribute| {
            if already_seen.contains(&attribute.name) {
                return false;
            }

            already_seen.insert(attribute.name.clone());

            if attribute.value.is_none() {
                return true;
            }

            if self.is_default_attribute_value(
                n.namespace,
                &n.tag_name,
                &attribute.name,
                match &*n.tag_name {
                    "script" if n.namespace == Namespace::HTML => {
                        let original_value = attribute.value.as_ref().unwrap();

                        if let Some(next) = original_value.split(';').next() {
                            next
                        } else {
                            original_value
                        }
                    }
                    _ => attribute.value.as_ref().unwrap(),
                },
            ) {
                return false;
            }

            let value = &*attribute.value.as_ref().unwrap();

            if (matches!(&*attribute.name, "id") && value.is_empty())
                || (matches!(&*attribute.name, "class" | "style") && value.is_empty())
                || self.is_event_handler_attribute(&attribute.name) && value.is_empty()
            {
                return false;
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

        let is_element_html_namespace = self.current_element_namespace == Some(Namespace::HTML);

        if is_element_html_namespace && self.is_boolean_attribute(&n.name) {
            n.value = None;

            return;
        } else if self.is_global_space_separated_attribute(&n.name)
            || (is_element_html_namespace
                && self.is_html_space_separated_attribute(
                    self.current_element_tag_name.as_ref(),
                    &n.name,
                ))
        {
            let mut values = value.split_whitespace().collect::<Vec<_>>();

            if &*n.name == "class" {
                values.sort_unstable();
            }

            value = values.join(" ");
        } else if self.is_global_comma_separated_attribute(&n.name)
            || (is_element_html_namespace
                && ((&n.name == "content"
                    && matches!(
                        self.meta_element_content_type,
                        Some(MetaElementContentType::CommaSeparated)
                    ))
                    || self.is_html_comma_separated_attribute(
                        self.current_element_tag_name.as_ref(),
                        &n.name,
                    )))
        {
            let values = value.trim().split(',');

            let mut new_values = vec![];

            for value in values {
                new_values.push(value.trim());
            }

            value = new_values.join(",");
        } else if self.is_global_trimable_attribute(&n.name)
            || (is_element_html_namespace
                && self.is_html_trimable_attribute(self.current_element_tag_name.as_ref(), &n.name))
        {
            value = value.trim().to_string();
        } else if is_element_html_namespace && &n.name == "contenteditable" && value == "true" {
            n.value = Some(js_word!(""));

            return;
        } else if &n.name == "content"
            && matches!(
                self.meta_element_content_type,
                Some(MetaElementContentType::SemiSeparated)
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
        }

        n.value = Some(value.into());
    }

    fn visit_mut_text(&mut self, n: &mut Text) {
        n.visit_mut_children_with(self);

        if self.is_script_with_json {
            let json = match serde_json::from_str::<Value>(&*n.value) {
                Ok(json) => json,
                _ => return,
            };
            let minified_json = match serde_json::to_string(&json) {
                Ok(minified_json) => minified_json,
                _ => return,
            };

            n.value = minified_json.into()
        }
    }
}

pub fn minify(document: &mut Document) {
    document.visit_mut_with(&mut Minifier {
        current_element_namespace: None,
        current_element_tag_name: None,
        is_script_with_json: false,
        meta_element_content_type: None,
    });
}
