#![deny(clippy::all)]

use serde_json::Value;
use swc_atoms::JsWord;
use swc_common::collections::AHashSet;
use swc_html_ast::*;
use swc_html_visit::{VisitMut, VisitMutWith};

static BOOLEAN_ATTRIBUTES: &[&str] = &[
    "allowfullscreen",
    "async",
    "autofocus",
    "autoplay",
    "checked",
    "compact",
    "controls",
    "declare",
    "default",
    "defaultchecked",
    "defaultmuted",
    "defaultselected",
    "defer",
    "disabled",
    "enabled",
    "formnovalidate",
    "hidden",
    "indeterminate",
    "inert",
    "ismap",
    "itemscope",
    "loop",
    "multiple",
    "muted",
    "nohref",
    "noresize",
    "noshade",
    "novalidate",
    "nowrap",
    "open",
    "pauseonexit",
    "readonly",
    "required",
    "reversed",
    "scoped",
    "seamless",
    "selected",
    "sortable",
    "truespeed",
    "typemustmatch",
    "visible",
];

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

static ALLOW_TO_TRIM_ATTRIBUTES: &[&str] = &[
    "class",
    "style",
    "tabindex",
    "maxlength",
    "size",
    "rows",
    "cols",
    "span",
    "rowspan",
    "colspan",
];

static COMMA_SEPARATED_ATTRIBUTES: &[&str] = &["srcset", "sizes"];

static SPACE_SEPARATED_ATTRIBUTES: &[&str] = &[
    "class",
    "rel",
    "aria-describedby",
    "aria-labelledby",
    "aria-owns",
    "autocomplete",
];

struct Minifier {
    current_element_namespace: Option<Namespace>,
    is_script_json_ld: bool,
}

impl Minifier {
    fn is_boolean_attribute(&self, name: &str) -> bool {
        BOOLEAN_ATTRIBUTES.contains(&name)
    }

    fn is_event_handler_attribute(&self, name: &str) -> bool {
        EVENT_HANDLER_ATTRIBUTES.contains(&name)
    }

    fn is_comma_separated_attribute(&self, name: &str) -> bool {
        COMMA_SEPARATED_ATTRIBUTES.contains(&name)
    }

    fn is_space_separated_attribute(&self, name: &str) -> bool {
        SPACE_SEPARATED_ATTRIBUTES.contains(&name)
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
        )
    }

    fn is_conditional_comment(&self, data: &str) -> bool {
        let trimmed = data.trim();

        if trimmed.starts_with("[if") || trimmed.ends_with("[endif]") {
            return true;
        }

        false
    }

    fn allow_to_trim(&self, name: &str) -> bool {
        ALLOW_TO_TRIM_ATTRIBUTES.contains(&name) || EVENT_HANDLER_ATTRIBUTES.contains(&name)
    }
}

impl VisitMut for Minifier {
    fn visit_mut_element(&mut self, n: &mut Element) {
        let old_current_element_namespace = self.current_element_namespace.take();
        let old_value_is_script_json_ld = self.is_script_json_ld;

        self.current_element_namespace = Some(n.namespace);
        self.is_script_json_ld = n.namespace == Namespace::HTML
            && &*n.tag_name == "script"
            && n.attributes.iter().any(|attribute| match &*attribute.name {
                "type"
                    if attribute.value.is_some()
                        && matches!(
                            &**attribute.value.as_ref().unwrap(),
                            "application/ld+json" | "importmap" | "speculationrules"
                        ) =>
                {
                    true
                }
                _ => false,
            });

        n.visit_mut_children_with(self);

        self.current_element_namespace = old_current_element_namespace;
        self.is_script_json_ld = old_value_is_script_json_ld;

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

            let is_empty_value = (&*attribute.value.as_ref().unwrap()).trim().is_empty();

            if self.is_default_attribute_value(
                n.namespace,
                &n.tag_name,
                &attribute.name,
                match &*n.tag_name {
                    "script" if n.namespace == Namespace::HTML => {
                        let original_value = attribute.value.as_ref().unwrap();

                        if let Some(next) = value.split(';').next() {
                            next
                        } else {
                            original_value
                        }
                    }
                    _ => attribute.value.as_ref().unwrap(),
                },
            ) || (matches!(&*attribute.name, "id" | "class" | "style") && is_empty_value)
            {
                return false;
            }

            if self.is_event_handler_attribute(&attribute.name) && is_empty_value {
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

        let is_element_html_namespace = self.current_element_namespace == Some(Namespace::HTML);

        if is_element_html_namespace && self.is_boolean_attribute(&n.name) {
            n.value = None;

            return;
        }

        let mut value = match &n.value {
            Some(value) => value.to_string(),
            _ => {
                unreachable!();
            }
        };

        if is_element_html_namespace {
            if &n.name == "contenteditable" && value == "true" {
                n.value = Some("".into());

                return;
            }

            if self.is_comma_separated_attribute(&n.name) {
                let values = value.split(',');

                let mut new_values = vec![];

                for value in values {
                    new_values.push(value.trim());
                }

                n.value = Some(new_values.join(",").into());

                return;
            }

            if self.is_space_separated_attribute(&n.name) {
                value = value.split_whitespace().collect::<Vec<_>>().join(" ");

                n.value = Some(value.into());

                return;
            }
        }

        if self.allow_to_trim(&n.name) {
            value = value.trim().to_string();
        }

        if self.is_event_handler_attribute(&n.name)
            && value.to_lowercase().starts_with("javascript:")
        {
            value = value.chars().skip(11).collect();
        }

        n.value = Some(value.into());
    }

    fn visit_mut_text(&mut self, n: &mut Text) {
        n.visit_mut_children_with(self);

        if self.is_script_json_ld {
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
        is_script_json_ld: false,
    });
}
