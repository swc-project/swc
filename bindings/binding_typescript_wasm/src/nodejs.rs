//! Node.js-specific helpers for `@swc/wasm-typescript`.
//!
//! These functions intentionally expose only the compact operations Node needs
//! from Rust. They avoid serializing SWC ASTs into JavaScript while keeping the
//! public package API under the `nodejs` namespace.

use serde::Serialize;
use swc_common::{comments::SingleThreadedComments, sync::Lrc, FileName, SourceMap, Span, Spanned};
use swc_ecma_ast::{
    CallExpr, Callee, Decl, DefaultDecl, EsVersion, ExportDefaultDecl, ExportSpecifier, ImportDecl,
    ImportSpecifier, Module, ModuleDecl, ModuleExportName, ModuleItem, NamedExport, ObjectLit,
};
use swc_ecma_parser::{
    error::{Error as ParseError, SyntaxError},
    lexer::Lexer,
    unstable::{Token, TokenAndSpan},
    EsSyntax, Parser, StringInput, Syntax, TsSyntax,
};
use swc_ecma_visit::{Visit, VisitWith};

const DYNAMIC_IMPORT_NAME: &str = "__nodeREPLDynamicImport";

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ModuleSyntaxTransformOutput {
    pub code: String,
    pub had_module_syntax: bool,
}

/// Rewrites Node REPL module syntax into script syntax.
///
/// The transform follows Node's edit-list approach: static imports become
/// awaited dynamic imports, dynamic `import(...)` is routed through Node's REPL
/// helper, and exports are unwrapped or dropped depending on whether they have
/// runtime declarations.
pub fn transform_module_syntax(code: String) -> ModuleSyntaxTransformOutput {
    if !code.contains("import") && !code.contains("export") {
        return ModuleSyntaxTransformOutput {
            code,
            had_module_syntax: false,
        };
    }

    let Some(module) = parse_module(&code) else {
        return ModuleSyntaxTransformOutput {
            code,
            had_module_syntax: false,
        };
    };

    let (edits, hoisted) = {
        let mut transform = ModuleSyntaxTransform::new(&code);

        for item in &module.body {
            transform.collect_module_item_edit(item);
        }

        let replaced_ranges = transform
            .edits
            .iter()
            .map(|edit| (edit.start, edit.end))
            .collect::<Vec<_>>();
        module.visit_with(&mut DynamicImportCollector {
            code: &code,
            edits: &mut transform.edits,
            replaced_ranges: &replaced_ranges,
        });

        if transform.edits.is_empty() && transform.hoisted.is_empty() {
            return ModuleSyntaxTransformOutput {
                code,
                had_module_syntax: false,
            };
        }

        (transform.edits, transform.hoisted)
    };

    ModuleSyntaxTransformOutput {
        code: prepend_hoisted_imports(apply_edits(code, edits), hoisted),
        had_module_syntax: true,
    }
}

/// Extracts the first source expression associated with a V8 error column.
///
/// `start_column` is interpreted as a JavaScript UTF-16 code-unit column to
/// match Node/V8 source locations. The implementation uses only lexer tokens
/// because the source line can be incomplete JavaScript.
pub fn get_first_expression(code: String, start_column: u32) -> String {
    let start_byte = utf16_column_to_byte_pos(&code, start_column);
    let mut last_token = None;
    let mut first_member_access_name_token = None;
    let mut pending_optional_chain_name_token = None;
    let mut terminating_byte = None;
    let mut paren_level = 0u32;

    for token in tokenize(&code) {
        if token.token == Token::Eof {
            break;
        }

        let Some((token_start, token_end)) = span_range(token.span) else {
            continue;
        };

        if token_start < start_byte {
            if token.token == Token::Semi {
                first_member_access_name_token = None;
                pending_optional_chain_name_token = None;
                last_token = None;
                continue;
            }

            if token.token == Token::QuestionMark
                && last_token
                    .as_ref()
                    .is_some_and(|last: &TokenAndSpan| is_member_identifier_token(last.token))
            {
                pending_optional_chain_name_token = last_token;
                last_token = Some(token);
                continue;
            }

            if token.token == Token::Dot
                && last_token
                    .as_ref()
                    .is_some_and(|last: &TokenAndSpan| last.token == Token::QuestionMark)
            {
                if let Some(name_token) = pending_optional_chain_name_token.take() {
                    first_member_access_name_token.get_or_insert(name_token);
                    last_token = Some(token);
                    continue;
                }
            } else if pending_optional_chain_name_token.take().is_some() {
                first_member_access_name_token = None;
            }

            if is_member_access_token(token.token) {
                if last_token
                    .as_ref()
                    .is_some_and(|last: &TokenAndSpan| is_member_identifier_token(last.token))
                {
                    first_member_access_name_token.get_or_insert(last_token.unwrap());
                    last_token = Some(token);
                    continue;
                }
            } else if !is_member_name_token(token.token) {
                first_member_access_name_token = None;
            }

            last_token = Some(token);
            continue;
        }

        match token.token {
            Token::LParen => {
                paren_level += 1;
            }
            Token::RParen => {
                paren_level = paren_level.saturating_sub(1);
                if paren_level == 0 {
                    terminating_byte = Some(token_end);
                    break;
                }
            }
            Token::Semi => {
                terminating_byte = Some(token_start);
                break;
            }
            _ => {}
        }
    }

    let start = first_member_access_name_token
        .and_then(|token| span_range(token.span).map(|(start, _)| start))
        .unwrap_or(start_byte);
    let end = terminating_byte.unwrap_or(code.len());

    if start >= code.len()
        || start > end
        || !code.is_char_boundary(start)
        || !code.is_char_boundary(end)
    {
        return String::new();
    }

    code[start..end].to_string()
}

/// Returns true when the source parses as a program or expression.
pub fn is_valid_syntax(code: String) -> bool {
    parses_as_program(&code) || parses_as_program(&format!("_={code}"))
}

/// Returns true for parser errors that should keep a Node REPL input open.
pub fn is_recoverable_error(code: String) -> bool {
    if code.trim_start().starts_with('{') && is_recoverable_error(format!("({code}")) {
        return true;
    }

    match parse_program_result(&code) {
        ParseOutcome::Valid => false,
        ParseOutcome::Invalid(errors) => errors
            .iter()
            .any(|error| is_recoverable_parse_error(&code, error)),
    }
}

struct ModuleSyntaxTransform<'a> {
    code: &'a str,
    edits: Vec<Edit>,
    hoisted: Vec<String>,
}

impl<'a> ModuleSyntaxTransform<'a> {
    fn new(code: &'a str) -> Self {
        Self {
            code,
            edits: Vec::new(),
            hoisted: Vec::new(),
        }
    }

    fn collect_module_item_edit(&mut self, item: &ModuleItem) {
        let ModuleItem::ModuleDecl(decl) = item else {
            return;
        };

        match decl {
            ModuleDecl::Import(import) => {
                self.delete_span(import.span);
                if !import.type_only {
                    if let Some(script) = import_decl_to_script(self.code, import) {
                        self.hoisted.push(script);
                    }
                }
            }
            ModuleDecl::ExportDecl(export) => {
                if is_type_only_decl(&export.decl) {
                    self.delete_span(export.span);
                } else if let (Some((start, _)), Some((decl_start, _))) =
                    (span_range(export.span), span_range(export.decl.span()))
                {
                    push_range_edit(&mut self.edits, self.code, start, decl_start, String::new());
                }
            }
            ModuleDecl::ExportNamed(export) => {
                self.delete_span(export.span);
                if let Some(src) = &export.src {
                    if named_export_loads_source(export) {
                        self.hoist_import(&src.value.to_string_lossy(), export.with.as_deref());
                    }
                }
            }
            ModuleDecl::ExportDefaultDecl(export) => {
                self.replace_span(export.span, default_decl_to_script(self.code, export));
            }
            ModuleDecl::ExportDefaultExpr(export) => {
                self.unwrap_default_expression(export.span, export.expr.span());
            }
            ModuleDecl::ExportAll(export) => {
                self.delete_span(export.span);
                if !export.type_only {
                    self.hoist_import(&export.src.value.to_string_lossy(), export.with.as_deref());
                }
            }
            ModuleDecl::TsImportEquals(..)
            | ModuleDecl::TsExportAssignment(..)
            | ModuleDecl::TsNamespaceExport(..) => {}
        }
    }

    fn delete_span(&mut self, span: Span) {
        self.replace_span(span, String::new());
    }

    fn replace_span(&mut self, span: Span, text: String) {
        push_span_edit(&mut self.edits, self.code, span, text);
    }

    fn hoist_import(&mut self, specifier: &str, with: Option<&ObjectLit>) {
        self.hoisted.push(format!(
            "await {};",
            await_import(self.code, specifier, with)
        ));
    }

    fn unwrap_default_expression(&mut self, export_span: Span, expr_span: Span) {
        let (Some((export_start, export_end)), Some((expr_start, expr_end))) =
            (span_range(export_span), span_range(expr_span))
        else {
            return;
        };

        push_range_edit(
            &mut self.edits,
            self.code,
            export_start,
            expr_start,
            String::new(),
        );

        let has_separator = self
            .code
            .get(expr_end..export_end)
            .is_some_and(|tail| tail.contains(';'));
        if !has_separator {
            push_range_edit(
                &mut self.edits,
                self.code,
                expr_end,
                expr_end,
                ";".to_string(),
            );
        }
    }
}

fn await_import(code: &str, specifier: &str, with: Option<&ObjectLit>) -> String {
    let mut out = format!("{DYNAMIC_IMPORT_NAME}({}", json_string(specifier));
    if let Some(options) = import_options_to_dynamic_options(code, with) {
        out.push_str(", ");
        out.push_str(&options);
    }
    out.push(')');
    out
}

fn import_decl_to_script(code: &str, node: &ImportDecl) -> Option<String> {
    let specifier = node.src.value.to_string_lossy();
    let with = node.with.as_deref();

    if node.specifiers.is_empty() {
        return Some(format!("await {};", await_import(code, &specifier, with)));
    }

    let mut namespace_name = None;
    let mut default_name = None;
    let mut named = Vec::new();

    for specifier in &node.specifiers {
        match specifier {
            ImportSpecifier::Namespace(specifier) => {
                namespace_name = Some(specifier.local.sym.to_string());
            }
            ImportSpecifier::Default(specifier) => {
                default_name = Some(specifier.local.sym.to_string());
            }
            ImportSpecifier::Named(specifier) => {
                if specifier.is_type_only {
                    continue;
                }

                let local = specifier.local.sym.to_string();
                let imported = specifier
                    .imported
                    .as_ref()
                    .map(module_export_name)
                    .unwrap_or_else(|| local.clone());

                if imported == local {
                    named.push(imported);
                } else {
                    named.push(format!("{}: {local}", json_string(&imported)));
                }
            }
        }
    }

    if let Some(namespace_name) = namespace_name {
        let mut out = format!(
            "const {namespace_name} = await {};",
            await_import(code, &specifier, with)
        );
        if let Some(default_name) = default_name {
            out.push_str(&format!(
                " const {default_name} = {namespace_name}.default;"
            ));
        }
        return Some(out);
    }

    if let Some(default_name) = default_name {
        named.push(format!("default: {default_name}"));
    }

    if named.is_empty() {
        return None;
    }

    Some(format!(
        "const {{ {} }} = await {};",
        named.join(", "),
        await_import(code, &specifier, with)
    ))
}

fn default_decl_to_script(code: &str, export: &ExportDefaultDecl) -> String {
    let Some(text) = slice_span(code, export.decl.span()) else {
        return String::new();
    };

    match &export.decl {
        DefaultDecl::Class(class) if class.ident.is_none() => format!("({text});"),
        DefaultDecl::Fn(function) if function.ident.is_none() => format!("({text});"),
        DefaultDecl::TsInterfaceDecl(..) => String::new(),
        _ => text.to_string(),
    }
}

fn import_options_to_dynamic_options(code: &str, with: Option<&ObjectLit>) -> Option<String> {
    let attributes = slice_span(code, with?.span)?;
    Some(format!("{{ with: {attributes} }}"))
}

fn is_type_only_decl(decl: &Decl) -> bool {
    matches!(decl, Decl::TsInterface(..) | Decl::TsTypeAlias(..))
}

fn named_export_loads_source(export: &NamedExport) -> bool {
    if export.type_only {
        return false;
    }

    if export.specifiers.is_empty() {
        return true;
    }

    export.specifiers.iter().any(|specifier| match specifier {
        ExportSpecifier::Named(named) => !named.is_type_only,
        ExportSpecifier::Namespace(..) | ExportSpecifier::Default(..) => true,
    })
}

fn module_export_name(name: &ModuleExportName) -> String {
    match name {
        ModuleExportName::Ident(ident) => ident.sym.to_string(),
        ModuleExportName::Str(string) => string.value.to_string_lossy().into_owned(),
    }
}

#[derive(Clone, Debug, Eq, PartialEq)]
struct Edit {
    start: usize,
    end: usize,
    text: String,
}

fn push_span_edit(edits: &mut Vec<Edit>, code: &str, span: Span, text: String) {
    if let Some((start, end)) = span_range(span) {
        push_range_edit(edits, code, start, end, text);
    }
}

fn push_range_edit(edits: &mut Vec<Edit>, code: &str, start: usize, end: usize, text: String) {
    if start <= end && end <= code.len() {
        edits.push(Edit { start, end, text });
    }
}

fn apply_edits(mut code: String, mut edits: Vec<Edit>) -> String {
    edits.sort_by(|a, b| b.start.cmp(&a.start).then_with(|| b.end.cmp(&a.end)));

    for edit in edits {
        if edit.start <= edit.end
            && edit.end <= code.len()
            && code.is_char_boundary(edit.start)
            && code.is_char_boundary(edit.end)
        {
            code.replace_range(edit.start..edit.end, &edit.text);
        }
    }

    code
}

fn prepend_hoisted_imports(code: String, hoisted: Vec<String>) -> String {
    if hoisted.is_empty() {
        return code;
    }

    let imports = hoisted.join("\n");
    if code.is_empty() {
        imports
    } else if code.starts_with('\n') || code.starts_with("\r\n") {
        format!("{imports}{code}")
    } else {
        format!("{imports}\n{code}")
    }
}

struct DynamicImportCollector<'a, 'b> {
    code: &'a str,
    edits: &'b mut Vec<Edit>,
    replaced_ranges: &'b [(usize, usize)],
}

impl Visit for DynamicImportCollector<'_, '_> {
    fn visit_call_expr(&mut self, node: &CallExpr) {
        if matches!(node.callee, Callee::Import(..)) {
            if let Some((start, end)) = span_range(node.span) {
                if !self
                    .replaced_ranges
                    .iter()
                    .any(|(replace_start, replace_end)| {
                        start >= *replace_start && end <= *replace_end
                    })
                {
                    let original = &self.code[start..end];
                    if let Some(rest) = original.strip_prefix("import") {
                        self.edits.push(Edit {
                            start,
                            end,
                            text: format!("{DYNAMIC_IMPORT_NAME}{rest}"),
                        });
                    }
                }
            }
        }

        node.visit_children_with(self);
    }
}

enum ParseOutcome {
    Valid,
    Invalid(Vec<ParseError>),
}

fn parse_program_result(code: &str) -> ParseOutcome {
    let cm = Lrc::new(SourceMap::default());
    let fm = cm.new_source_file(FileName::Anon.into(), code.to_string());
    let comments = SingleThreadedComments::default();
    let lexer = Lexer::new(
        Syntax::Es(es_syntax()),
        EsVersion::latest(),
        StringInput::from(&*fm),
        Some(&comments),
    );
    let mut parser = Parser::new_from(lexer);

    match parser.parse_program() {
        Ok(..) => {
            let errors = parser.take_errors();
            if errors.is_empty() {
                ParseOutcome::Valid
            } else {
                ParseOutcome::Invalid(errors)
            }
        }
        Err(error) => {
            let mut errors = vec![error];
            errors.extend(parser.take_errors());
            ParseOutcome::Invalid(errors)
        }
    }
}

fn parse_module(code: &str) -> Option<Module> {
    parse_module_with_syntax(code, Syntax::Es(es_syntax()))
        .or_else(|| parse_module_with_syntax(code, Syntax::Typescript(ts_syntax())))
}

fn parse_module_with_syntax(code: &str, syntax: Syntax) -> Option<Module> {
    let cm = Lrc::new(SourceMap::default());
    let fm = cm.new_source_file(FileName::Anon.into(), code.to_string());
    let comments = SingleThreadedComments::default();
    let lexer = Lexer::new(
        syntax,
        EsVersion::latest(),
        StringInput::from(&*fm),
        Some(&comments),
    );
    let mut parser = Parser::new_from(lexer);
    let module = parser.parse_module().ok()?;

    if parser.take_errors().is_empty() {
        Some(module)
    } else {
        None
    }
}

fn parses_as_program(code: &str) -> bool {
    matches!(parse_program_result(code), ParseOutcome::Valid)
}

fn tokenize(code: &str) -> Vec<TokenAndSpan> {
    let cm = Lrc::new(SourceMap::default());
    let fm = cm.new_source_file(FileName::Anon.into(), code.to_string());
    let comments = SingleThreadedComments::default();
    Lexer::new(
        Syntax::Es(es_syntax()),
        EsVersion::latest(),
        StringInput::from(&*fm),
        Some(&comments),
    )
    .collect()
}

fn es_syntax() -> EsSyntax {
    EsSyntax {
        auto_accessors: true,
        explicit_resource_management: true,
        import_attributes: true,
        ..Default::default()
    }
}

fn ts_syntax() -> TsSyntax {
    TsSyntax {
        decorators: true,
        ..Default::default()
    }
}

fn is_recoverable_parse_error(code: &str, error: &ParseError) -> bool {
    match error.kind() {
        SyntaxError::Eof | SyntaxError::UnterminatedTpl | SyntaxError::UnterminatedBlockComment => {
            true
        }
        SyntaxError::UnterminatedStrLit => has_trailing_line_continuation(code),
        SyntaxError::Expected(_, got) => got == "<eof>",
        _ => false,
    }
}

fn has_trailing_line_continuation(code: &str) -> bool {
    code.ends_with("\\\n")
        || code.ends_with("\\\r")
        || code.ends_with("\\\r\n")
        || code.ends_with("\\\u{2028}")
        || code.ends_with("\\\u{2029}")
}

fn is_member_access_token(token: Token) -> bool {
    matches!(
        token,
        Token::Dot | Token::OptionalChain | Token::LBracket | Token::RBracket
    )
}

fn is_member_name_token(token: Token) -> bool {
    matches!(token, Token::Ident | Token::Str | Token::Num) || token.is_known_ident()
}

fn is_member_identifier_token(token: Token) -> bool {
    token == Token::Ident || token.is_known_ident()
}

fn slice_span(code: &str, span: Span) -> Option<&str> {
    let (start, end) = span_range(span)?;
    code.get(start..end)
}

fn span_range(span: Span) -> Option<(usize, usize)> {
    if span.lo.is_dummy() || span.hi.is_dummy() {
        return None;
    }

    let start = span.lo.0.checked_sub(1)? as usize;
    let end = span.hi.0.checked_sub(1)? as usize;
    Some((start, end))
}

fn utf16_column_to_byte_pos(code: &str, column: u32) -> usize {
    let mut utf16_pos = 0u32;

    for (byte_pos, ch) in code.char_indices() {
        if utf16_pos >= column {
            return byte_pos;
        }

        utf16_pos += ch.len_utf16() as u32;
        if utf16_pos > column {
            return byte_pos;
        }
    }

    code.len()
}

fn json_string(value: &str) -> String {
    serde_json::to_string(value).expect("serializing a string should not fail")
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn transform_import_forms() {
        assert_eq!(
            transform_module_syntax("import \"node:fs\";".into()).code,
            "await __nodeREPLDynamicImport(\"node:fs\");"
        );
        assert_eq!(
            transform_module_syntax("import fs from \"node:fs\";".into()).code,
            "const { default: fs } = await __nodeREPLDynamicImport(\"node:fs\");"
        );
        assert_eq!(
            transform_module_syntax("import { readFile as rf } from \"node:fs\";".into()).code,
            "const { \"readFile\": rf } = await __nodeREPLDynamicImport(\"node:fs\");"
        );
        assert_eq!(
            transform_module_syntax("import def, * as ns from \"mod\";".into()).code,
            "const ns = await __nodeREPLDynamicImport(\"mod\"); const def = ns.default;"
        );
        assert_eq!(
            transform_module_syntax("import { \"a-b\" as c } from \"mod\";".into()).code,
            "const { \"a-b\": c } = await __nodeREPLDynamicImport(\"mod\");"
        );
        assert_eq!(
            transform_module_syntax(
                "import data from \"./data.json\" with { type: \"json\" };".into()
            )
            .code,
            "const { default: data } = await __nodeREPLDynamicImport(\"./data.json\", { with: { \
             type: \"json\" } });"
        );
        assert_eq!(
            transform_module_syntax("console.log(typeof fs);\nimport fs from \"node:fs\";".into())
                .code,
            "const { default: fs } = await \
             __nodeREPLDynamicImport(\"node:fs\");\nconsole.log(typeof fs);\n"
        );
    }

    #[test]
    fn transform_export_forms() {
        assert_eq!(
            transform_module_syntax("export const x = 1;".into()).code,
            "const x = 1;"
        );
        assert_eq!(
            transform_module_syntax("export default value;".into()).code,
            "value;"
        );
        assert_eq!(
            transform_module_syntax("export default foo; doSomething();".into()).code,
            "foo; doSomething();"
        );
        assert_eq!(
            transform_module_syntax("export default function () {}".into()).code,
            "(function () {});"
        );
        assert_eq!(
            transform_module_syntax("export default class {}".into()).code,
            "(class {});"
        );
        assert_eq!(transform_module_syntax("export { x };".into()).code, "");
        assert_eq!(
            transform_module_syntax("export * from \"mod\";".into()).code,
            "await __nodeREPLDynamicImport(\"mod\");"
        );
        assert_eq!(
            transform_module_syntax("console.log(1);\nexport { value } from \"mod\";".into()).code,
            "await __nodeREPLDynamicImport(\"mod\");\nconsole.log(1);\n"
        );
    }

    #[test]
    fn transform_dynamic_import_and_noops() {
        assert_eq!(
            transform_module_syntax("const mod = import(\"node:fs\");".into()).code,
            "const mod = __nodeREPLDynamicImport(\"node:fs\");"
        );

        let no_module_syntax = transform_module_syntax("const importName = \"import\";".into());
        assert!(!no_module_syntax.had_module_syntax);
        assert_eq!(no_module_syntax.code, "const importName = \"import\";");

        let incomplete = transform_module_syntax("import {".into());
        assert!(!incomplete.had_module_syntax);
        assert_eq!(incomplete.code, "import {");
    }

    #[test]
    fn transform_typescript_module_syntax() {
        assert_eq!(
            transform_module_syntax("import fs from \"node:fs\";\nconst x: number = 1;".into())
                .code,
            "const { default: fs } = await __nodeREPLDynamicImport(\"node:fs\");\nconst x: number \
             = 1;"
        );

        let type_only = transform_module_syntax(
            "import type { Foo } from \"types\";\nexport type { Foo };\nconst x: number = 1;"
                .into(),
        );
        assert!(type_only.had_module_syntax);
        assert!(!type_only.code.contains("__nodeREPLDynamicImport"));
        assert!(!type_only.code.contains("import type"));
        assert!(!type_only.code.contains("export type"));

        let re_export_type =
            transform_module_syntax("export { type Foo } from \"types\";\nconst x = 1;".into());
        assert!(!re_export_type.code.contains("__nodeREPLDynamicImport"));
        assert_eq!(re_export_type.code, "\nconst x = 1;");
    }

    #[test]
    fn first_expression_from_error_column() {
        assert_eq!(
            get_first_expression("assert.ok(value)".into(), 9),
            "assert.ok(value)"
        );
        assert_eq!(
            get_first_expression("assert['ok'](value)".into(), 12),
            "assert['ok'](value)"
        );
        assert_eq!(
            get_first_expression("assert?.ok(value)".into(), 10),
            "assert?.ok(value)"
        );
        assert_eq!(
            get_first_expression("a(); assert.ok(value); b()".into(), 13),
            "assert.ok(value)"
        );
        assert_eq!(
            get_first_expression("const 🍣 = 1; assert.ok(🍣)".into(), 23),
            "assert.ok(🍣)"
        );
    }

    #[test]
    fn valid_syntax_checks() {
        assert!(is_valid_syntax("await foo".into()));
        assert!(is_valid_syntax("{ value: 1 }".into()));
        assert!(is_valid_syntax("foo + bar".into()));
        assert!(!is_valid_syntax("function foo(".into()));
    }

    #[test]
    fn recoverable_syntax_checks() {
        assert!(is_recoverable_error("function foo() {".into()));
        assert!(is_recoverable_error("`template".into()));
        assert!(is_recoverable_error("/* comment".into()));
        assert!(is_recoverable_error("\"continued\\\n".into()));
        assert!(!is_recoverable_error("2e".into()));
        assert!(!is_recoverable_error("\"unterminated".into()));
    }
}
