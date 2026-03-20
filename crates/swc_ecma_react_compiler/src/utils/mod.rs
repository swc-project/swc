use swc_ecma_ast::{BlockStmt, Expr, Lit, Stmt};

/// Returns directive values from the top of a statement list.
pub fn collect_directives(stmts: &[Stmt]) -> Vec<String> {
    let mut directives = Vec::new();

    for stmt in stmts {
        let Some(value) = directive_from_stmt(stmt) else {
            break;
        };
        directives.push(value);
    }

    directives
}

/// Returns directive values from a block body.
pub fn collect_block_directives(block: &BlockStmt) -> Vec<String> {
    collect_directives(&block.stmts)
}

/// Returns directive value for a single statement.
pub fn directive_from_stmt(stmt: &Stmt) -> Option<String> {
    let Stmt::Expr(expr_stmt) = stmt else {
        return None;
    };
    let Expr::Lit(Lit::Str(str_lit)) = &*expr_stmt.expr else {
        return None;
    };

    Some(str_lit.value.to_string_lossy().into_owned())
}

pub fn is_hook_name(name: &str) -> bool {
    let Some(rest) = name.strip_prefix("use") else {
        return false;
    };
    matches!(
        rest.chars().next(),
        Some(c) if c.is_ascii_uppercase() || c.is_ascii_digit()
    )
}

pub fn is_component_name(name: &str) -> bool {
    name == "component" || matches!(name.chars().next(), Some(c) if c.is_ascii_uppercase())
}

pub fn is_valid_identifier(value: &str) -> bool {
    swc_ecma_ast::Ident::verify_symbol(value).is_ok()
}
