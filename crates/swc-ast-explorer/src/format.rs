use std::sync::OnceLock;

use owo_colors::OwoColorize;
use regex::{NoExpand, Regex};
use swc_ecma_ast::Program;

static STRUCT_SPAN_FIELD: OnceLock<Regex> = OnceLock::new();
static RANGE_SPAN_FIELD: OnceLock<Regex> = OnceLock::new();
static ALTERNATE_WS: OnceLock<Regex> = OnceLock::new();
static INDENT_WS: OnceLock<Regex> = OnceLock::new();

/// Formats an SWC program using the same tree-like debug output as the
/// original explorer.
pub fn format_program(program: &Program, keep_spans: bool) -> String {
    let print = format!("{program:#?}");
    let stripped = if keep_spans {
        print
    } else {
        strip_spans(&print)
    };

    colorize_indentation(&stripped)
}

fn strip_spans(print: &str) -> String {
    let print = struct_span_field().replace_all(print, NoExpand(""));

    range_span_field()
        .replace_all(&print, NoExpand(""))
        .into_owned()
}

fn colorize_indentation(print: &str) -> String {
    let alternate = format!("{}{}", "    ".on_default_color(), "    ".on_black());
    let alternating = alternate_ws().replace_all(print, NoExpand(&alternate));

    indent_ws()
        .replace_all(&alternating, NoExpand("  "))
        .into_owned()
}

fn struct_span_field() -> &'static Regex {
    STRUCT_SPAN_FIELD.get_or_init(|| Regex::new(r"(?m)^\s+\w*span\w*: Span \{[^}]*\},\n").unwrap())
}

fn range_span_field() -> &'static Regex {
    RANGE_SPAN_FIELD.get_or_init(|| Regex::new(r"(?m)^\s+\w*span\w*: \d+\.\.\d+,\n").unwrap())
}

fn alternate_ws() -> &'static Regex {
    ALTERNATE_WS.get_or_init(|| Regex::new(r" {8}").unwrap())
}

fn indent_ws() -> &'static Regex {
    INDENT_WS.get_or_init(|| Regex::new(r" {4}").unwrap())
}
