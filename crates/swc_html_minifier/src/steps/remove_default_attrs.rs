use swc_html_ast::*;

fn is_default_attribute_value(
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
    )
}

pub fn remove_default_attributes(element: &mut Element) {
    element.attributes.retain(|attribute| {
        if attribute.value.is_none() {
            return true;
        }

        match &*attribute.name {
            _ if is_default_attribute_value(
                element.namespace,
                &element.tag_name,
                &attribute.name,
                attribute.value.as_ref().unwrap(),
            ) =>
            {
                false
            }
            _ => true,
        }
    });
}
