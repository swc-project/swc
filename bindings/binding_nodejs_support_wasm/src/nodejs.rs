//! Node.js-specific helpers for `@swc/nodejs-support-wasm`.
//!
//! These functions intentionally expose only the compact operations Node needs
//! from Rust and avoid serializing SWC ASTs into JavaScript.

use serde::Serialize;
use swc_common::{comments::SingleThreadedComments, sync::Lrc, FileName, SourceMap, Span, Spanned};
use swc_ecma_ast::{
    ArrowExpr, AssignExpr, AssignTarget, AssignTargetPat, BindingIdent, BlockStmt, BlockStmtOrExpr,
    CallExpr, Callee, CatchClause, Class, ClassDecl, Decl, DefaultDecl, EsVersion, ExportSpecifier,
    Expr, FnDecl, Function, ImportDecl, ImportSpecifier, MetaPropExpr, MetaPropKind, Module,
    ModuleDecl, ModuleExportName, ModuleItem, NamedExport, ObjectLit, ObjectPatProp, Pat, Prop,
    SimpleAssignTarget, Stmt, UpdateExpr, VarDecl, VarDeclKind,
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
        module.visit_with(&mut ModuleFeatureCollector {
            code: &code,
            edits: &mut transform.edits,
            replaced_ranges: &replaced_ranges,
        });
        module.visit_with(&mut ImportBindingReferenceCollector {
            code: &code,
            edits: &mut transform.edits,
            replaced_ranges: &replaced_ranges,
            bindings: &transform.import_bindings,
            scopes: vec![Vec::new()],
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
    let mut potential_expression_start_token = None;
    let mut first_member_access_name_token = None;
    let mut pending_optional_chain_name_token = None;
    let mut terminating_byte = None;
    let mut paren_level = 0u32;
    let mut member_bracket_depth = 0u32;

    for token in tokenize(&code) {
        if token.token == Token::Eof {
            break;
        }

        let Some((token_start, token_end)) = span_range(token.span) else {
            continue;
        };
        if token_start < start_byte {
            if token.token == Token::Semi {
                potential_expression_start_token = None;
                first_member_access_name_token = None;
                pending_optional_chain_name_token = None;
                member_bracket_depth = 0;
                last_token = None;
                continue;
            }

            if member_bracket_depth > 0 {
                match token.token {
                    Token::LBracket => member_bracket_depth += 1,
                    Token::RBracket => {
                        member_bracket_depth = member_bracket_depth.saturating_sub(1);
                    }
                    _ => {}
                }
                last_token = Some(token);
                continue;
            }

            if is_member_identifier_token(&code, &token)
                && first_member_access_name_token.is_none()
                && potential_expression_start_token.is_none()
            {
                potential_expression_start_token = Some(token);
            }

            if token.token == Token::QuestionMark
                && last_token
                    .as_ref()
                    .is_some_and(|last: &TokenAndSpan| is_member_identifier_token(&code, last))
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

            if token.token == Token::LBracket
                && last_token
                    .as_ref()
                    .is_some_and(|last: &TokenAndSpan| is_member_identifier_token(&code, last))
            {
                first_member_access_name_token
                    .get_or_insert(potential_expression_start_token.unwrap_or(last_token.unwrap()));
                member_bracket_depth = 1;
                last_token = Some(token);
                continue;
            }

            if is_member_access_token(token.token) {
                if last_token
                    .as_ref()
                    .is_some_and(|last: &TokenAndSpan| is_member_identifier_token(&code, last))
                {
                    first_member_access_name_token.get_or_insert(
                        potential_expression_start_token.unwrap_or(last_token.unwrap()),
                    );
                    last_token = Some(token);
                    continue;
                }
            } else if token.token != Token::LParen && !is_member_name_token(&code, &token) {
                potential_expression_start_token = None;
                first_member_access_name_token = None;
            }

            if token.token == Token::LParen && first_member_access_name_token.is_some() {
                paren_level += 1;
                last_token = Some(token);
                continue;
            }

            if token.token == Token::LParen
                && last_token
                    .as_ref()
                    .is_some_and(|last: &TokenAndSpan| is_member_identifier_token(&code, last))
            {
                first_member_access_name_token
                    .get_or_insert(potential_expression_start_token.unwrap_or(last_token.unwrap()));
                paren_level += 1;
                last_token = Some(token);
                continue;
            }

            last_token = Some(token);
            continue;
        }

        if token.token == Token::LParen
            && last_token
                .as_ref()
                .is_some_and(|last: &TokenAndSpan| is_member_identifier_token(&code, last))
        {
            first_member_access_name_token
                .get_or_insert(potential_expression_start_token.unwrap_or(last_token.unwrap()));
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
    match parse_program_result(&code) {
        ParseOutcome::Valid => false,
        ParseOutcome::Invalid(errors) => {
            if errors
                .iter()
                .any(|error| is_recoverable_parse_error(&code, error))
            {
                return true;
            }

            code.trim_start().starts_with('{') && is_recoverable_error(format!("({code}"))
        }
    }
}

struct ModuleSyntaxTransform<'a> {
    code: &'a str,
    edits: Vec<Edit>,
    hoisted: Vec<String>,
    import_bindings: Vec<ImportBinding>,
    import_namespace_count: u32,
}

impl<'a> ModuleSyntaxTransform<'a> {
    fn new(code: &'a str) -> Self {
        Self {
            code,
            edits: Vec::new(),
            hoisted: Vec::new(),
            import_bindings: Vec::new(),
            import_namespace_count: 0,
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
                    if let Some(script) = self.import_decl_to_script(import) {
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
                    if let Some(required_exports) = named_export_source_imports(export) {
                        self.hoist_validated_import(
                            &src.value.to_string_lossy(),
                            export.with.as_deref(),
                            &required_exports,
                        );
                    }
                }
            }
            ModuleDecl::ExportDefaultDecl(export) => {
                self.unwrap_default_declaration(export.span, export.decl.span(), &export.decl);
            }
            ModuleDecl::ExportDefaultExpr(export) => {
                self.unwrap_default_expression(
                    export.span,
                    export.expr.span(),
                    matches!(&*export.expr, Expr::Object(..)),
                );
            }
            ModuleDecl::ExportAll(export) => {
                self.delete_span(export.span);
                if !export.type_only {
                    self.hoist_import(&export.src.value.to_string_lossy(), export.with.as_deref());
                }
            }
            ModuleDecl::TsImportEquals(import) => {
                if import.is_type_only {
                    self.delete_span(import.span);
                }
            }
            ModuleDecl::TsNamespaceExport(export) => {
                self.delete_span(export.span);
            }
            ModuleDecl::TsExportAssignment(..) => {}
        }
    }

    fn delete_span(&mut self, span: Span) {
        let replacement = if needs_statement_separator(self.code, span) {
            ";"
        } else {
            ""
        };
        self.replace_span(span, replacement.to_string());
    }

    fn replace_span(&mut self, span: Span, text: String) {
        push_span_edit(&mut self.edits, self.code, span, text);
    }

    fn hoist_import(&mut self, specifier: &str, with: Option<&ObjectLit>) {
        self.hoisted.push(format!(
            "await {};",
            await_import(self.code, specifier, with, &[])
        ));
    }

    fn hoist_validated_import(
        &mut self,
        specifier: &str,
        with: Option<&ObjectLit>,
        required_exports: &[String],
    ) {
        self.hoisted.push(format!(
            "await {};",
            await_import(self.code, specifier, with, required_exports)
        ));
    }

    fn import_decl_to_script(&mut self, node: &ImportDecl) -> Option<String> {
        let specifier = node.src.value.to_string_lossy();
        let with = node.with.as_deref();

        if node.specifiers.is_empty() {
            return Some(format!(
                "await {};",
                await_import(self.code, &specifier, with, &[])
            ));
        }

        let mut namespace_name = None;
        let mut default_name = None;
        let mut named = Vec::new();
        let mut required_exports = Vec::new();

        for specifier in &node.specifiers {
            match specifier {
                ImportSpecifier::Namespace(specifier) => {
                    namespace_name = Some(specifier.local.sym.to_string());
                }
                ImportSpecifier::Default(specifier) => {
                    default_name = Some(specifier.local.sym.to_string());
                    push_required_export(&mut required_exports, "default".to_string());
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
                    push_required_export(&mut required_exports, imported.clone());
                    named.push((local, imported));
                }
            }
        }

        if namespace_name.is_none() && default_name.is_none() && named.is_empty() {
            return None;
        }

        let namespace_name = namespace_name.unwrap_or_else(|| self.fresh_import_namespace_name());
        let out = format!(
            "const {namespace_name} = await {};",
            await_import(self.code, &specifier, with, &required_exports)
        );

        if let Some(default_name) = default_name {
            self.import_bindings.push(ImportBinding {
                local: default_name,
                namespace: namespace_name.clone(),
                export_name: "default".to_string(),
            });
        }

        for (local, export_name) in named {
            self.import_bindings.push(ImportBinding {
                local,
                namespace: namespace_name.clone(),
                export_name,
            });
        }

        Some(out)
    }

    fn fresh_import_namespace_name(&mut self) -> String {
        loop {
            let candidate = format!("__nodeREPLImport{}", self.import_namespace_count);
            self.import_namespace_count += 1;

            if !self.code.contains(&candidate) {
                return candidate;
            }
        }
    }

    fn unwrap_default_declaration(
        &mut self,
        export_span: Span,
        decl_span: Span,
        decl: &DefaultDecl,
    ) {
        if matches!(decl, DefaultDecl::TsInterfaceDecl(..)) {
            self.delete_span(export_span);
            return;
        }

        let (Some((export_start, _)), Some((decl_start, decl_end))) =
            (span_range(export_span), span_range(decl_span))
        else {
            return;
        };

        push_range_edit(
            &mut self.edits,
            self.code,
            export_start,
            decl_start,
            String::new(),
        );

        if default_declaration_needs_parentheses(decl) {
            push_range_edit(
                &mut self.edits,
                self.code,
                decl_start,
                decl_start,
                "(".to_string(),
            );
            push_range_edit(
                &mut self.edits,
                self.code,
                decl_end,
                decl_end,
                ");".to_string(),
            );
        }
    }

    fn unwrap_default_expression(
        &mut self,
        export_span: Span,
        expr_span: Span,
        needs_parentheses: bool,
    ) {
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

        if needs_parentheses {
            push_range_edit(
                &mut self.edits,
                self.code,
                expr_start,
                expr_start,
                "(".to_string(),
            );
        }

        let has_separator = self
            .code
            .get(expr_end..export_end)
            .is_some_and(|tail| tail.contains(';'));
        if needs_parentheses || !has_separator {
            let mut suffix = String::new();
            if needs_parentheses {
                suffix.push(')');
            }
            if !has_separator {
                suffix.push(';');
            }
            push_range_edit(&mut self.edits, self.code, expr_end, expr_end, suffix);
        }
    }
}

fn await_import(
    code: &str,
    specifier: &str,
    with: Option<&ObjectLit>,
    required_exports: &[String],
) -> String {
    let mut out = format!("{DYNAMIC_IMPORT_NAME}({}", json_string(specifier));
    if let Some(options) = import_options_to_dynamic_options(code, with) {
        out.push_str(", ");
        out.push_str(&options);
    }
    out.push(')');
    if !required_exports.is_empty() {
        out.push_str(".then((m) => { ");
        for export_name in required_exports {
            out.push_str("if (!(");
            out.push_str(&json_string(export_name));
            out.push_str(" in m)) throw new SyntaxError(");
            out.push_str(&json_string(&format!(
                "The requested module '{specifier}' does not provide an export named \
                 '{export_name}'"
            )));
            out.push_str("); ");
        }
        out.push_str("return m; })");
    }
    out
}

fn import_options_to_dynamic_options(code: &str, with: Option<&ObjectLit>) -> Option<String> {
    let attributes = slice_span(code, with?.span)?;
    Some(format!("{{ with: {attributes} }}"))
}

fn default_declaration_needs_parentheses(decl: &DefaultDecl) -> bool {
    matches!(decl, DefaultDecl::Class(class) if class.ident.is_none())
        || matches!(decl, DefaultDecl::Fn(function) if function.ident.is_none())
}

fn is_type_only_decl(decl: &Decl) -> bool {
    matches!(decl, Decl::TsInterface(..) | Decl::TsTypeAlias(..))
}

fn named_export_source_imports(export: &NamedExport) -> Option<Vec<String>> {
    if export.type_only {
        return None;
    }

    let mut loads_source = export.specifiers.is_empty();
    let mut required_exports = Vec::new();

    for specifier in &export.specifiers {
        match specifier {
            ExportSpecifier::Named(named) => {
                if named.is_type_only {
                    continue;
                }

                loads_source = true;
                push_required_export(&mut required_exports, module_export_name(&named.orig));
            }
            ExportSpecifier::Default(..) => {
                loads_source = true;
                push_required_export(&mut required_exports, "default".to_string());
            }
            ExportSpecifier::Namespace(..) => {
                loads_source = true;
            }
        }
    }

    loads_source.then_some(required_exports)
}

fn push_required_export(required_exports: &mut Vec<String>, export_name: String) {
    if !required_exports
        .iter()
        .any(|required| required == &export_name)
    {
        required_exports.push(export_name);
    }
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

#[derive(Debug)]
struct ImportBinding {
    local: String,
    namespace: String,
    export_name: String,
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

fn needs_statement_separator(code: &str, span: Span) -> bool {
    let Some((start, end)) = span_range(span) else {
        return false;
    };

    code[..start].chars().any(|ch| !ch.is_whitespace())
        && code[end..].chars().any(|ch| !ch.is_whitespace())
}

fn prepend_hoisted_imports(code: String, hoisted: Vec<String>) -> String {
    if hoisted.is_empty() {
        return code;
    }

    let imports = hoisted.join("\n");
    if code.starts_with("#!") {
        if let Some(line_end) = code.find('\n') {
            let insert_at = line_end + 1;
            let (hashbang, rest) = code.split_at(insert_at);
            if rest.is_empty() || rest.starts_with('\n') {
                format!("{hashbang}{imports}{rest}")
            } else {
                format!("{hashbang}{imports}\n{rest}")
            }
        } else {
            format!("{code}\n{imports}")
        }
    } else if code.is_empty() {
        imports
    } else if code.starts_with('\n') || code.starts_with("\r\n") {
        format!("{imports}{code}")
    } else {
        format!("{imports}\n{code}")
    }
}

struct ModuleFeatureCollector<'a, 'b> {
    code: &'a str,
    edits: &'b mut Vec<Edit>,
    replaced_ranges: &'b [(usize, usize)],
}

impl Visit for ModuleFeatureCollector<'_, '_> {
    fn visit_call_expr(&mut self, node: &CallExpr) {
        if matches!(node.callee, Callee::Import(..)) {
            if let Some((start, end)) = span_range(node.span) {
                if !range_is_replaced(self.replaced_ranges, start, end) {
                    let original = &self.code[start..end];
                    if original.starts_with("import") {
                        self.edits.push(Edit {
                            start,
                            end: start + "import".len(),
                            text: DYNAMIC_IMPORT_NAME.to_string(),
                        });
                    }
                }
            }
        }

        node.visit_children_with(self);
    }

    fn visit_meta_prop_expr(&mut self, node: &MetaPropExpr) {
        if node.kind == MetaPropKind::ImportMeta {
            if let Some((start, end)) = span_range(node.span) {
                if !range_is_replaced(self.replaced_ranges, start, end) {
                    self.edits.push(Edit {
                        start,
                        end,
                        text: import_meta_error_expression(),
                    });
                }
            }
        }
    }
}

struct ImportBindingReferenceCollector<'a, 'b> {
    code: &'a str,
    edits: &'b mut Vec<Edit>,
    replaced_ranges: &'b [(usize, usize)],
    bindings: &'b [ImportBinding],
    scopes: Vec<Vec<String>>,
}

impl Visit for ImportBindingReferenceCollector<'_, '_> {
    fn visit_assign_expr(&mut self, node: &AssignExpr) {
        if self.import_binding_for_assign_target(&node.left).is_some() {
            self.replace_expression_with_import_assignment_error(node.span);
            return;
        }

        node.visit_children_with(self);
    }

    fn visit_update_expr(&mut self, node: &UpdateExpr) {
        if let Expr::Ident(ident) = &*node.arg {
            if self.binding_for_unshadowed(ident.sym.as_ref()).is_some() {
                self.replace_expression_with_import_assignment_error(node.span);
                return;
            }
        }

        node.visit_children_with(self);
    }

    fn visit_function(&mut self, node: &Function) {
        let shadowed = function_scope_shadowed_bindings(node, self.bindings);
        self.with_scope(shadowed, |this| node.visit_children_with(this));
    }

    fn visit_arrow_expr(&mut self, node: &ArrowExpr) {
        let shadowed = arrow_scope_shadowed_bindings(node, self.bindings);
        self.with_scope(shadowed, |this| node.visit_children_with(this));
    }

    fn visit_block_stmt(&mut self, node: &BlockStmt) {
        let shadowed = direct_block_shadowed_bindings(node, self.bindings);
        self.with_scope(shadowed, |this| node.visit_children_with(this));
    }

    fn visit_catch_clause(&mut self, node: &CatchClause) {
        let mut shadowed = Vec::new();
        if let Some(param) = &node.param {
            collect_shadowed_pat_bindings(&mut shadowed, param, self.bindings);
        }

        self.with_scope(shadowed, |this| node.visit_children_with(this));
    }

    fn visit_expr(&mut self, node: &Expr) {
        if let Expr::Ident(ident) = node {
            self.replace_identifier(ident.span, ident.sym.as_ref());
            return;
        }

        node.visit_children_with(self);
    }

    fn visit_prop(&mut self, node: &Prop) {
        if let Prop::Shorthand(ident) = node {
            if let Some(binding) = self.binding_for_unshadowed(ident.sym.as_ref()) {
                if let Some((start, end)) = span_range(ident.span) {
                    if !range_is_replaced(self.replaced_ranges, start, end) {
                        let access = import_binding_access(binding);
                        self.edits.push(Edit {
                            start,
                            end,
                            text: format!("{}: {access}", ident.sym),
                        });
                    }
                }
            }
            return;
        }

        node.visit_children_with(self);
    }
}

impl ImportBindingReferenceCollector<'_, '_> {
    fn replace_identifier(&mut self, span: Span, local: &str) {
        let Some(binding) = self.binding_for_unshadowed(local) else {
            return;
        };

        let Some((start, end)) = span_range(span) else {
            return;
        };

        if range_is_replaced(self.replaced_ranges, start, end) {
            return;
        }

        if !self.code.get(start..end).is_some_and(|text| text == local) {
            return;
        }

        self.edits.push(Edit {
            start,
            end,
            text: import_binding_access(binding),
        });
    }

    fn binding_for(&self, local: &str) -> Option<&ImportBinding> {
        self.bindings.iter().find(|binding| binding.local == local)
    }

    fn binding_for_unshadowed(&self, local: &str) -> Option<&ImportBinding> {
        if self.is_shadowed(local) {
            return None;
        }

        self.binding_for(local)
    }

    fn import_binding_for_assign_target(&self, target: &AssignTarget) -> Option<&ImportBinding> {
        match target {
            AssignTarget::Simple(SimpleAssignTarget::Ident(ident)) => {
                self.binding_for_unshadowed(ident.id.sym.as_ref())
            }
            AssignTarget::Pat(pat) => self.import_binding_for_assign_target_pat(pat),
            _ => None,
        }
    }

    fn import_binding_for_assign_target_pat(
        &self,
        target: &AssignTargetPat,
    ) -> Option<&ImportBinding> {
        match target {
            AssignTargetPat::Array(array) => array
                .elems
                .iter()
                .flatten()
                .find_map(|pat| self.import_binding_for_pat(pat)),
            AssignTargetPat::Object(object) => object.props.iter().find_map(|prop| match prop {
                ObjectPatProp::KeyValue(prop) => self.import_binding_for_pat(&prop.value),
                ObjectPatProp::Assign(prop) => {
                    self.binding_for_unshadowed(prop.key.id.sym.as_ref())
                }
                ObjectPatProp::Rest(prop) => self.import_binding_for_pat(&prop.arg),
            }),
            AssignTargetPat::Invalid(..) => None,
        }
    }

    fn import_binding_for_pat(&self, pat: &Pat) -> Option<&ImportBinding> {
        match pat {
            Pat::Ident(ident) => self.binding_for_unshadowed(ident.id.sym.as_ref()),
            Pat::Array(array) => array
                .elems
                .iter()
                .flatten()
                .find_map(|pat| self.import_binding_for_pat(pat)),
            Pat::Rest(rest) => self.import_binding_for_pat(&rest.arg),
            Pat::Object(object) => object.props.iter().find_map(|prop| match prop {
                ObjectPatProp::KeyValue(prop) => self.import_binding_for_pat(&prop.value),
                ObjectPatProp::Assign(prop) => {
                    self.binding_for_unshadowed(prop.key.id.sym.as_ref())
                }
                ObjectPatProp::Rest(prop) => self.import_binding_for_pat(&prop.arg),
            }),
            Pat::Assign(assign) => self.import_binding_for_pat(&assign.left),
            Pat::Invalid(..) | Pat::Expr(..) => None,
        }
    }

    fn replace_expression_with_import_assignment_error(&mut self, span: Span) {
        let Some((start, end)) = span_range(span) else {
            return;
        };

        if range_is_replaced(self.replaced_ranges, start, end) {
            return;
        }

        self.edits.push(Edit {
            start,
            end,
            text: import_assignment_error_expression(),
        });
    }

    fn with_scope(&mut self, shadowed: Vec<String>, op: impl FnOnce(&mut Self)) {
        self.scopes.push(shadowed);
        op(self);
        self.scopes.pop();
    }

    fn is_shadowed(&self, local: &str) -> bool {
        self.scopes
            .iter()
            .rev()
            .any(|scope| scope.iter().any(|name| name == local))
    }
}

fn function_scope_shadowed_bindings(node: &Function, bindings: &[ImportBinding]) -> Vec<String> {
    let mut shadowed = Vec::new();
    for param in &node.params {
        collect_shadowed_pat_bindings(&mut shadowed, &param.pat, bindings);
    }
    if let Some(body) = &node.body {
        collect_function_var_shadowed_bindings(&mut shadowed, body, bindings);
    }
    shadowed
}

fn arrow_scope_shadowed_bindings(node: &ArrowExpr, bindings: &[ImportBinding]) -> Vec<String> {
    let mut shadowed = Vec::new();
    for param in &node.params {
        collect_shadowed_pat_bindings(&mut shadowed, param, bindings);
    }
    if let BlockStmtOrExpr::BlockStmt(body) = &*node.body {
        collect_function_var_shadowed_bindings(&mut shadowed, body, bindings);
    }
    shadowed
}

fn collect_function_var_shadowed_bindings(
    out: &mut Vec<String>,
    body: &BlockStmt,
    bindings: &[ImportBinding],
) {
    let mut collector = FunctionScopedVarCollector {
        bindings,
        shadowed: out,
    };
    body.visit_with(&mut collector);
}

struct FunctionScopedVarCollector<'a, 'b> {
    bindings: &'a [ImportBinding],
    shadowed: &'b mut Vec<String>,
}

impl Visit for FunctionScopedVarCollector<'_, '_> {
    fn visit_var_decl(&mut self, node: &VarDecl) {
        if node.kind == VarDeclKind::Var {
            collect_shadowed_var_decl_bindings(self.shadowed, node, self.bindings);
        }
    }

    fn visit_function(&mut self, _: &Function) {}

    fn visit_arrow_expr(&mut self, _: &ArrowExpr) {}

    fn visit_class(&mut self, _: &Class) {}
}

fn direct_block_shadowed_bindings(node: &BlockStmt, bindings: &[ImportBinding]) -> Vec<String> {
    let mut shadowed = Vec::new();

    for stmt in &node.stmts {
        if let Stmt::Decl(decl) = stmt {
            collect_shadowed_decl_bindings(&mut shadowed, decl, bindings);
        }
    }

    shadowed
}

fn collect_shadowed_decl_bindings(out: &mut Vec<String>, decl: &Decl, bindings: &[ImportBinding]) {
    match decl {
        Decl::Class(ClassDecl { ident, .. }) | Decl::Fn(FnDecl { ident, .. }) => {
            push_shadowed_ident_binding(out, ident.sym.as_ref(), bindings);
        }
        Decl::Var(var) => {
            collect_shadowed_var_decl_bindings(out, var, bindings);
        }
        Decl::Using(using) => {
            for declarator in &using.decls {
                collect_shadowed_pat_bindings(out, &declarator.name, bindings);
            }
        }
        Decl::TsInterface(..) | Decl::TsTypeAlias(..) | Decl::TsEnum(..) | Decl::TsModule(..) => {}
    }
}

fn collect_shadowed_var_decl_bindings(
    out: &mut Vec<String>,
    decl: &VarDecl,
    bindings: &[ImportBinding],
) {
    for declarator in &decl.decls {
        collect_shadowed_pat_bindings(out, &declarator.name, bindings);
    }
}

fn collect_shadowed_pat_bindings(out: &mut Vec<String>, pat: &Pat, bindings: &[ImportBinding]) {
    match pat {
        Pat::Ident(ident) => push_shadowed_binding_ident(out, ident, bindings),
        Pat::Array(array) => {
            for elem in array.elems.iter().flatten() {
                collect_shadowed_pat_bindings(out, elem, bindings);
            }
        }
        Pat::Rest(rest) => collect_shadowed_pat_bindings(out, &rest.arg, bindings),
        Pat::Object(object) => {
            for prop in &object.props {
                match prop {
                    ObjectPatProp::KeyValue(prop) => {
                        collect_shadowed_pat_bindings(out, &prop.value, bindings);
                    }
                    ObjectPatProp::Assign(prop) => {
                        push_shadowed_binding_ident(out, &prop.key, bindings);
                    }
                    ObjectPatProp::Rest(prop) => {
                        collect_shadowed_pat_bindings(out, &prop.arg, bindings);
                    }
                }
            }
        }
        Pat::Assign(assign) => collect_shadowed_pat_bindings(out, &assign.left, bindings),
        Pat::Invalid(..) | Pat::Expr(..) => {}
    }
}

fn push_shadowed_binding_ident(
    out: &mut Vec<String>,
    ident: &BindingIdent,
    bindings: &[ImportBinding],
) {
    push_shadowed_ident_binding(out, ident.id.sym.as_ref(), bindings);
}

fn push_shadowed_ident_binding(out: &mut Vec<String>, local: &str, bindings: &[ImportBinding]) {
    if bindings.iter().any(|binding| binding.local == local)
        && !out.iter().any(|name| name == local)
    {
        out.push(local.to_string());
    }
}

fn range_is_replaced(replaced_ranges: &[(usize, usize)], start: usize, end: usize) -> bool {
    replaced_ranges
        .iter()
        .any(|(replace_start, replace_end)| start >= *replace_start && end <= *replace_end)
}

fn import_binding_access(binding: &ImportBinding) -> String {
    format!(
        "{}{}",
        binding.namespace,
        export_property_access(&binding.export_name)
    )
}

fn export_property_access(export_name: &str) -> String {
    if is_identifier_name(export_name) {
        format!(".{export_name}")
    } else {
        format!("[{}]", json_string(export_name))
    }
}

fn import_meta_error_expression() -> String {
    "(() => { throw new SyntaxError(\"Cannot use import.meta outside a module\"); })()".to_string()
}

fn import_assignment_error_expression() -> String {
    "(() => { throw new TypeError(\"Assignment to constant variable.\"); })()".to_string()
}

fn is_identifier_name(value: &str) -> bool {
    let mut chars = value.chars();
    let Some(first) = chars.next() else {
        return false;
    };

    if !(first == '_' || first == '$' || first.is_ascii_alphabetic()) {
        return false;
    }

    chars.all(|ch| ch == '_' || ch == '$' || ch.is_ascii_alphanumeric())
}

enum ParseOutcome {
    Valid,
    Invalid(Vec<ParseError>),
}

fn parse_program_result(code: &str) -> ParseOutcome {
    let es = parse_program_result_with_syntax(code, Syntax::Es(es_syntax()));
    if matches!(es, ParseOutcome::Valid) {
        return es;
    }

    parse_program_result_with_syntax(code, Syntax::Typescript(ts_syntax()))
}

fn parse_program_result_with_syntax(code: &str, syntax: Syntax) -> ParseOutcome {
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

fn is_member_name_token(code: &str, token: &TokenAndSpan) -> bool {
    matches!(token.token, Token::Ident | Token::Str | Token::Num)
        || token.token.is_known_ident()
        || token_text_is_identifier(code, token)
}

fn is_member_identifier_token(code: &str, token: &TokenAndSpan) -> bool {
    token.token == Token::Ident
        || token.token.is_known_ident()
        || token_text_is_identifier(code, token)
}

fn token_text_is_identifier(code: &str, token: &TokenAndSpan) -> bool {
    slice_span(code, token.span).is_some_and(is_identifier_name)
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

    fn validated_import(specifier: &str, required_exports: &[&str]) -> String {
        validated_import_with_options(specifier, None, required_exports)
    }

    fn validated_import_with_options(
        specifier: &str,
        options: Option<&str>,
        required_exports: &[&str],
    ) -> String {
        let mut out = format!("{DYNAMIC_IMPORT_NAME}({}", json_string(specifier));
        if let Some(options) = options {
            out.push_str(", ");
            out.push_str(options);
        }
        out.push(')');

        if !required_exports.is_empty() {
            out.push_str(".then((m) => { ");
            for export_name in required_exports {
                out.push_str("if (!(");
                out.push_str(&json_string(export_name));
                out.push_str(" in m)) throw new SyntaxError(");
                out.push_str(&json_string(&format!(
                    "The requested module '{specifier}' does not provide an export named \
                     '{export_name}'"
                )));
                out.push_str("); ");
            }
            out.push_str("return m; })");
        }

        out
    }

    #[test]
    fn transform_import_forms() {
        assert_eq!(
            transform_module_syntax("import \"node:fs\";".into()).code,
            "await __nodeREPLDynamicImport(\"node:fs\");"
        );
        assert_eq!(
            transform_module_syntax("import fs from \"node:fs\";".into()).code,
            format!(
                "const __nodeREPLImport0 = await {};",
                validated_import("node:fs", &["default"])
            )
        );
        assert_eq!(
            transform_module_syntax("import { readFile as rf } from \"node:fs\";".into()).code,
            format!(
                "const __nodeREPLImport0 = await {};",
                validated_import("node:fs", &["readFile"])
            )
        );
        assert_eq!(
            transform_module_syntax("import { readFile as rf } from \"node:fs\";\nrf();".into())
                .code,
            format!(
                "const __nodeREPLImport0 = await {};\n__nodeREPLImport0.readFile();",
                validated_import("node:fs", &["readFile"])
            )
        );
        assert_eq!(
            transform_module_syntax("import def, * as ns from \"mod\";".into()).code,
            format!(
                "const ns = await {};",
                validated_import("mod", &["default"])
            )
        );
        assert_eq!(
            transform_module_syntax("import def, * as ns from \"mod\";\ndef; ns;".into()).code,
            format!(
                "const ns = await {};\nns.default; ns;",
                validated_import("mod", &["default"])
            )
        );
        assert_eq!(
            transform_module_syntax("import { \"a-b\" as c } from \"mod\";".into()).code,
            format!(
                "const __nodeREPLImport0 = await {};",
                validated_import("mod", &["a-b"])
            )
        );
        assert_eq!(
            transform_module_syntax("import { \"a-b\" as c } from \"mod\";\nc;".into()).code,
            format!(
                "const __nodeREPLImport0 = await {};\n__nodeREPLImport0[\"a-b\"];",
                validated_import("mod", &["a-b"])
            )
        );
        assert_eq!(
            transform_module_syntax(
                "import data from \"./data.json\" with { type: \"json\" };".into()
            )
            .code,
            format!(
                "const __nodeREPLImport0 = await {};",
                validated_import_with_options(
                    "./data.json",
                    Some("{ with: { type: \"json\" } }"),
                    &["default"]
                )
            )
        );
        assert_eq!(
            transform_module_syntax("console.log(typeof fs);\nimport fs from \"node:fs\";".into())
                .code,
            format!(
                "const __nodeREPLImport0 = await {};\nconsole.log(typeof \
                 __nodeREPLImport0.default);\n",
                validated_import("node:fs", &["default"])
            )
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
            transform_module_syntax("export default { ...config };".into()).code,
            "({ ...config });"
        );
        assert_eq!(
            transform_module_syntax("export default function () {}".into()).code,
            "(function () {});"
        );
        assert_eq!(
            transform_module_syntax(
                "export default function f() { return import(\"node:fs\"); }".into()
            )
            .code,
            "function f() { return __nodeREPLDynamicImport(\"node:fs\"); }"
        );
        assert_eq!(
            transform_module_syntax(
                "export default function () { return import(\"node:fs\"); }".into()
            )
            .code,
            "(function () { return __nodeREPLDynamicImport(\"node:fs\"); });"
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
            format!(
                "await {};\nconsole.log(1);\n",
                validated_import("mod", &["value"])
            )
        );
    }

    #[test]
    fn transform_preserves_missing_export_failures() {
        let missing_default = transform_module_syntax("import missing from \"mod\";".into());
        assert!(missing_default.code.contains("\"default\" in m"));
        assert!(missing_default.code.contains("export named 'default'"));

        let missing_named = transform_module_syntax("import { missing, ok } from \"mod\";".into());
        assert!(missing_named.code.contains("\"missing\" in m"));
        assert!(missing_named.code.contains("\"ok\" in m"));

        let re_export = transform_module_syntax("export { missing } from \"mod\";".into());
        assert!(re_export.code.contains("\"missing\" in m"));
    }

    #[test]
    fn transform_preserves_import_binding_semantics() {
        assert_eq!(
            transform_module_syntax("import { spec } from \"m\";\nimport(spec);".into()).code,
            format!(
                "const __nodeREPLImport0 = await \
                 {};\n__nodeREPLDynamicImport(__nodeREPLImport0.spec);",
                validated_import("m", &["spec"])
            )
        );

        assert_eq!(
            transform_module_syntax(
                "import { x } from \"m\";\nfunction f(x) { return x; }\nx;".into()
            )
            .code,
            format!(
                "const __nodeREPLImport0 = await {};\nfunction f(x) {{ return x; \
                 }}\n__nodeREPLImport0.x;",
                validated_import("m", &["x"])
            )
        );

        assert_eq!(
            transform_module_syntax("import { x } from \"m\";\n{ const x = 1; x; }\nx;".into())
                .code,
            format!(
                "const __nodeREPLImport0 = await {};\n{{ const x = 1; x; }}\n__nodeREPLImport0.x;",
                validated_import("m", &["x"])
            )
        );

        assert_eq!(
            transform_module_syntax("import { x } from \"m\";\ntry {} catch (x) { x; }\nx;".into())
                .code,
            format!(
                "const __nodeREPLImport0 = await {};\ntry {{}} catch (x) {{ x; \
                 }}\n__nodeREPLImport0.x;",
                validated_import("m", &["x"])
            )
        );

        assert_eq!(
            transform_module_syntax(
                "import { x } from \"m\";\nfunction f(){ if (ok) { var x = 1; } return x; }\nx;"
                    .into()
            )
            .code,
            format!(
                "const __nodeREPLImport0 = await {};\nfunction f(){{ if (ok) {{ var x = 1; }} \
                 return x; }}\n__nodeREPLImport0.x;",
                validated_import("m", &["x"])
            )
        );

        assert_eq!(
            transform_module_syntax("import { readFile } from \"node:fs\";\nreadFile = 1;".into())
                .code,
            format!(
                "const __nodeREPLImport0 = await {};\n(() => {{ throw new TypeError(\"Assignment \
                 to constant variable.\"); }})();",
                validated_import("node:fs", &["readFile"])
            )
        );

        assert_eq!(
            transform_module_syntax(
                "import { readFile } from \"node:fs\";\n({ readFile } = obj);".into()
            )
            .code,
            format!(
                "const __nodeREPLImport0 = await {};\n((() => {{ throw new TypeError(\"Assignment \
                 to constant variable.\"); }})());",
                validated_import("node:fs", &["readFile"])
            )
        );

        assert_eq!(
            transform_module_syntax("import { readFile } from \"node:fs\";\nreadFile++;".into())
                .code,
            format!(
                "const __nodeREPLImport0 = await {};\n(() => {{ throw new TypeError(\"Assignment \
                 to constant variable.\"); }})();",
                validated_import("node:fs", &["readFile"])
            )
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

        let import_meta = transform_module_syntax("console.log(import.meta.url);".into());
        assert!(import_meta.had_module_syntax);
        assert!(import_meta
            .code
            .contains("Cannot use import.meta outside a module"));
    }

    #[test]
    fn transform_preserves_statement_boundaries() {
        let hashbang = transform_module_syntax(
            "#!/usr/bin/env node\nimport fs from \"node:fs\";\nfs.readFile;".into(),
        )
        .code;
        assert!(hashbang.starts_with("#!/usr/bin/env node\nconst __nodeREPLImport0 = await "));
        assert!(hashbang.contains("\n__nodeREPLImport0.default.readFile;"));

        assert_eq!(
            transform_module_syntax("foo()\nimport \"x\";\n[1].forEach(bar)".into()).code,
            "await __nodeREPLDynamicImport(\"x\");\nfoo()\n;\n[1].forEach(bar)"
        );
    }

    #[test]
    fn transform_typescript_module_syntax() {
        assert_eq!(
            transform_module_syntax("import fs from \"node:fs\";\nconst x: number = 1;".into())
                .code,
            format!(
                "const __nodeREPLImport0 = await {};\nconst x: number = 1;",
                validated_import("node:fs", &["default"])
            )
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

        let import_equals =
            transform_module_syntax("import type Foo = require(\"foo\");\nconst x = 1;".into());
        assert!(import_equals.had_module_syntax);
        assert_eq!(import_equals.code, "\nconst x = 1;");

        let namespace_export =
            transform_module_syntax("export as namespace Foo;\nconst x = 1;".into());
        assert!(namespace_export.had_module_syntax);
        assert_eq!(namespace_export.code, "\nconst x = 1;");
    }

    #[test]
    fn first_expression_from_error_column() {
        assert_eq!(
            get_first_expression("assert(value)".into(), 6),
            "assert(value)"
        );
        assert_eq!(get_first_expression("ok(value)".into(), 3), "ok(value)");
        assert_eq!(
            get_first_expression("assert.ok(value)".into(), 9),
            "assert.ok(value)"
        );
        assert_eq!(
            get_first_expression("assert['ok'](value)".into(), 12),
            "assert['ok'](value)"
        );
        assert_eq!(
            get_first_expression("assert[method + suffix](value)".into(), 23),
            "assert[method + suffix](value)"
        );
        assert_eq!(
            get_first_expression("assert.deepEqual(foo(), 1)".into(), 17),
            "assert.deepEqual(foo(), 1)"
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
        assert!(is_valid_syntax("const x: number = 1".into()));
        assert!(!is_valid_syntax("function foo(".into()));
    }

    #[test]
    fn recoverable_syntax_checks() {
        assert!(is_recoverable_error("function foo() {".into()));
        assert!(is_recoverable_error("{".into()));
        assert!(is_recoverable_error("`template".into()));
        assert!(is_recoverable_error("/* comment".into()));
        assert!(is_recoverable_error("\"continued\\\n".into()));
        assert!(!is_recoverable_error("const x: number = 1".into()));
        assert!(!is_recoverable_error("{ value: 1 }".into()));
        assert!(!is_recoverable_error("{}".into()));
        assert!(!is_recoverable_error("2e".into()));
        assert!(!is_recoverable_error("\"unterminated".into()));
    }
}
