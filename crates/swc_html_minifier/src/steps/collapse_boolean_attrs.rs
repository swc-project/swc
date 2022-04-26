use swc_html_ast::*;

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

pub fn collapse_boolean_attributes(attribute: &mut Attribute) {
    if attribute.value.is_some() && BOOLEAN_ATTRIBUTES.contains(&attribute.name.as_ref()) {
        attribute.value = None;
    }
}
