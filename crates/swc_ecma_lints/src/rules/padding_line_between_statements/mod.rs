// TODO cases https://eslint.org/docs/rules/padding-line-between-statements
// "block"
// "cjs-export"
// "cjs-import"
// "directive"
// "empty"
// "iife"

mod config;

use std::{
    fmt::{self, Debug},
    mem,
    sync::Arc,
};

pub use config::PaddingLineBetweenStatementsConfig;
use config::{GroupedRules, LineBreakType, StatementType};
use swc_common::{errors::HANDLER, SourceMap, Span};
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

use crate::{
    config::{LintRuleReaction, RuleConfig},
    rule::{visitor_rule, Rule},
};

const EXPECTED_BLANK_MESSAGE: &str = "Expected blank line before this statement";
const UNEXPECTED_BLANK_MESSAGE: &str = "Unexpected blank line before this statement";

pub fn padding_line_between_statements(
    source_map: &Arc<SourceMap>,
    config: &RuleConfig<PaddingLineBetweenStatementsConfig>,
) -> Option<Box<dyn Rule>> {
    match config.get_rule_reaction() {
        LintRuleReaction::Off => None,
        _ => Some(visitor_rule(PaddingLineBetweenStatements::new(
            source_map.clone(),
            config,
        ))),
    }
}

#[derive(Default, Debug)]
struct Scope {
    current: Option<StatementType>,
    current_span: Option<Span>,
    current_is_multiline: bool,
    prev: Option<StatementType>,
    prev_span: Option<Span>,
    prev_is_multiline: bool,
}

#[derive(Default)]
struct PaddingLineBetweenStatements {
    expected_reaction: LintRuleReaction,
    source_map: Arc<SourceMap>,
    grouped_rules: GroupedRules,
    blocks: Vec<Scope>,
}

impl Debug for PaddingLineBetweenStatements {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.debug_struct("PaddingLineBetweenStatements")
            .field("expected_reaction", &self.expected_reaction)
            .field("grouped_rules", &self.grouped_rules)
            .field("blocks", &self.blocks)
            .finish()
    }
}

impl PaddingLineBetweenStatements {
    fn new(
        source_map: Arc<SourceMap>,
        config: &RuleConfig<PaddingLineBetweenStatementsConfig>,
    ) -> Self {
        let rule_config = config.get_rule_config();

        Self {
            expected_reaction: config.get_rule_reaction(),
            source_map,
            grouped_rules: rule_config.rules.clone(),

            blocks: vec![Default::default()],
        }
    }

    fn emit_report(&self, span: Span, message: &str) {
        HANDLER.with(|handler| match self.expected_reaction {
            LintRuleReaction::Error => {
                handler.struct_span_err(span, message).emit();
            }
            LintRuleReaction::Warning => {
                handler.struct_span_warn(span, message).emit();
            }
            _ => {}
        });
    }

    fn new_lines_between_statements_count(&self) -> usize {
        let current_block = self.blocks.last().unwrap();
        let left_span = current_block.prev_span.unwrap();
        let right_span = current_block.current_span.unwrap();

        let left = self.source_map.lookup_byte_offset(left_span.hi);
        let right = self.source_map.lookup_byte_offset(right_span.lo);

        let left_idx = left.pos.0 as usize;
        let right_idx = right.pos.0 as usize;
        let src = &left.sf.src;

        let mut new_lines_count: usize = 0;

        for ch in (&src[left_idx..right_idx]).chars() {
            if ch == '\n' {
                new_lines_count += 1;
            }

            if new_lines_count == 2 {
                return new_lines_count;
            }
        }

        new_lines_count
    }

    fn is_multiline(&self, span: &Span) -> bool {
        let source = self.source_map.lookup_byte_offset(span.lo);

        let left_idx = span.lo.0 as usize;
        let right_idx = span.hi.0 as usize;
        let src = &source.sf.src[left_idx..right_idx];

        for ch in src.chars() {
            if ch == '\n' {
                return true;
            }
        }

        false
    }

    // "singleline-const" is single-line const variable declarations.
    // "singleline-let" is single-line let variable declarations.
    // "singleline-var" is single-line var variable declarations.
    // "multiline-let" is multiline let variable declarations.
    // "multiline-var" is multiline var variable declarations.
    // "multiline-const" is multiline const variable declarations.
    // "multiline-block-like" is block like statements. This is the same as
    // block-like type, but only if the block is multiline.
    // "multiline-expression" is expression statements. This is the same as
    // expression type, but only if the statement is multiline.
    fn resolve_to_single_or_multiline(
        &self,
        is_multiline: bool,
        statement_type: StatementType,
    ) -> StatementType {
        use StatementType::*;

        match (is_multiline, statement_type) {
            (true, Expression) => MultilineExpression,
            (true, Var) => MultilineVar,
            (true, Const) => MultilineConst,
            (true, Let) => MultilineLet,
            (true, If) => MultilineIf,
            (true, Function) => MultilineFunction,
            (true, Try) => MultilineTry,
            (true, While) => MultilineWhile,
            (true, DoWhile) => MultilineDoWhile,
            (true, Switch) => MultilineSwitch,
            (true, With) => MultilineWith,
            (true, Class) => MultilineClass,
            (true, For) => MultilineFor,
            (false, Var) => SinglelineVar,
            (false, Const) => SinglelineConst,
            (false, Let) => SinglelineLet,
            (false, If) => SinglelineIf,
            (false, Function) => SinglelineFunction,
            (false, Try) => SinglelineTry,
            (false, While) => SinglelineWhile,
            (false, DoWhile) => SinglelineDoWhile,
            (false, Switch) => SinglelineSwitch,
            (false, With) => SinglelineWith,
            (false, Class) => SinglelineClass,
            (false, For) => SinglelineFor,
            (false, Expression) => SinglelineExpression,
            _ => statement_type,
        }
    }

    fn lookup_rule(&self) -> Option<&LineBreakType> {
        let current_block = self.blocks.last().unwrap();

        if let (Some(prev), Some(current)) = (current_block.prev, current_block.current) {
            let prev = self.resolve_to_single_or_multiline(current_block.prev_is_multiline, prev);
            let current =
                self.resolve_to_single_or_multiline(current_block.current_is_multiline, current);

            return self
                .grouped_rules
                .get(&(prev, current))
                // "*" is wildcard. This matches any statements.
                .or_else(|| self.grouped_rules.get(&(prev, StatementType::Any)))
                .or_else(|| self.grouped_rules.get(&(StatementType::Any, current)))
                .or_else(|| {
                    self.grouped_rules
                        .get(&(StatementType::Any, StatementType::Any))
                });
        }

        None
    }

    fn update_and_check(&mut self, current_stmt: StatementType, current_span: Span) {
        let current_is_multiline = if current_stmt.can_be_multiline() {
            self.is_multiline(&current_span)
        } else {
            false
        };

        // Update state for current block
        {
            let current_block = self.blocks.last_mut().unwrap();

            current_block.prev = mem::take(&mut current_block.current);
            current_block.prev_span = mem::take(&mut current_block.current_span);
            current_block.current = Some(current_stmt);
            current_block.current_span = Some(current_span);
            current_block.prev_is_multiline = current_block.current_is_multiline;
            current_block.current_is_multiline = current_is_multiline;
        };

        match self.lookup_rule() {
            Some(LineBreakType::Never) => {
                if self.new_lines_between_statements_count() > 1 {
                    self.emit_report(current_span, UNEXPECTED_BLANK_MESSAGE);
                }
            }
            Some(LineBreakType::Always) => {
                if self.new_lines_between_statements_count() < 2 {
                    self.emit_report(current_span, EXPECTED_BLANK_MESSAGE);
                }
            }
            Some(LineBreakType::Any) | None => {}
        };
    }

    fn before_visit(&mut self, current_stmt: StatementType) {
        if current_stmt.is_block_like() {
            self.blocks.push(Default::default());
        }
    }

    fn after_visit(&mut self, current_stmt: StatementType) {
        if current_stmt.is_block_like() {
            self.blocks.pop();
        }
    }
}

impl Visit for PaddingLineBetweenStatements {
    noop_visit_type!();

    // "if" is if statements.
    fn visit_if_stmt(&mut self, if_stmt: &IfStmt) {
        self.update_and_check(StatementType::If, if_stmt.span);
        self.before_visit(StatementType::If);

        if_stmt.visit_children_with(self);

        self.after_visit(StatementType::If);
    }

    // "return" is return statements.
    fn visit_return_stmt(&mut self, return_stmt: &ReturnStmt) {
        self.update_and_check(StatementType::Return, return_stmt.span);
        self.before_visit(StatementType::Return);

        return_stmt.visit_children_with(self);

        self.after_visit(StatementType::Return);
    }

    // handle singleline and multiline let, const, var
    fn visit_var_decl(&mut self, var_decl: &VarDecl) {
        let statement_type = match var_decl.kind {
            // "const" is const variable declarations, both single-line and multiline.
            VarDeclKind::Const => StatementType::Const,
            // "let" is let variable declarations, both single-line and multiline.
            VarDeclKind::Let => StatementType::Let,
            // "var" is var variable declarations, both single-line and multiline.
            VarDeclKind::Var => StatementType::Var,
        };

        self.update_and_check(statement_type, var_decl.span);
        self.before_visit(statement_type);

        var_decl.visit_children_with(self);

        self.after_visit(statement_type);
    }

    // "function" is function declarations.
    fn visit_function(&mut self, function: &Function) {
        self.update_and_check(StatementType::Function, function.span);
        self.before_visit(StatementType::Function);

        function.visit_children_with(self);

        self.after_visit(StatementType::Function);
    }

    // "function" is function declarations.
    fn visit_arrow_expr(&mut self, arrow_expr: &ArrowExpr) {
        self.update_and_check(StatementType::Function, arrow_expr.span);
        self.before_visit(StatementType::Function);

        arrow_expr.visit_children_with(self);

        self.after_visit(StatementType::Function);
    }

    // "try" is try statements.
    fn visit_try_stmt(&mut self, try_stmt: &TryStmt) {
        self.update_and_check(StatementType::Try, try_stmt.span);
        self.before_visit(StatementType::Try);

        try_stmt.visit_children_with(self);

        self.after_visit(StatementType::Try);
    }

    // "while" is while loop statements.
    fn visit_while_stmt(&mut self, while_stmt: &WhileStmt) {
        self.update_and_check(StatementType::While, while_stmt.span);
        self.before_visit(StatementType::While);

        while_stmt.visit_children_with(self);

        self.after_visit(StatementType::While);
    }

    // "do" is do-while statements. This matches all statements that the first token
    // is do keyword.
    fn visit_do_while_stmt(&mut self, do_while_stmt: &DoWhileStmt) {
        self.update_and_check(StatementType::DoWhile, do_while_stmt.span);
        self.before_visit(StatementType::DoWhile);

        do_while_stmt.visit_children_with(self);

        self.after_visit(StatementType::DoWhile);
    }

    // "throw" is throw statements.
    fn visit_throw_stmt(&mut self, throw_stmt: &ThrowStmt) {
        self.update_and_check(StatementType::Throw, throw_stmt.span);
        self.before_visit(StatementType::Throw);

        throw_stmt.visit_children_with(self);

        self.after_visit(StatementType::Throw);
    }

    // "switch" is switch statements.
    fn visit_switch_stmt(&mut self, switch_stmt: &SwitchStmt) {
        self.update_and_check(StatementType::Switch, switch_stmt.span);
        self.before_visit(StatementType::Switch);

        switch_stmt.visit_children_with(self);

        self.after_visit(StatementType::Switch);
    }

    // "with" is with statements.
    fn visit_with_stmt(&mut self, with_stmt: &WithStmt) {
        self.update_and_check(StatementType::With, with_stmt.span);
        self.before_visit(StatementType::With);

        with_stmt.visit_children_with(self);

        self.after_visit(StatementType::With);
    }

    // "break" is break statements.
    fn visit_break_stmt(&mut self, break_stmt: &BreakStmt) {
        self.update_and_check(StatementType::Break, break_stmt.span);
        self.before_visit(StatementType::Break);

        break_stmt.visit_children_with(self);

        self.after_visit(StatementType::Break);
    }

    // "case" is case clauses in switch statements.
    // "default" is default clauses in switch statements. ??????
    fn visit_switch_case(&mut self, switch_case: &SwitchCase) {
        self.update_and_check(StatementType::Case, switch_case.span);
        self.before_visit(StatementType::Case);

        switch_case.visit_children_with(self);

        self.after_visit(StatementType::Case);
    }

    // "class" is class declarations.
    fn visit_class(&mut self, class: &Class) {
        self.update_and_check(StatementType::Class, class.span);
        self.before_visit(StatementType::Class);

        class.visit_children_with(self);

        self.after_visit(StatementType::Class);
    }

    // "continue" is continue statements.
    fn visit_continue_stmt(&mut self, continue_stmt: &ContinueStmt) {
        self.update_and_check(StatementType::Continue, continue_stmt.span);
        self.before_visit(StatementType::Continue);

        continue_stmt.visit_children_with(self);

        self.after_visit(StatementType::Continue);
    }

    // "debugger" is debugger statements.
    fn visit_debugger_stmt(&mut self, debugger_stmt: &DebuggerStmt) {
        self.update_and_check(StatementType::Debugger, debugger_stmt.span);
        self.before_visit(StatementType::Debugger);

        debugger_stmt.visit_children_with(self);

        self.after_visit(StatementType::Debugger);
    }

    // "export" is export declarations.
    fn visit_export_decl(&mut self, export_decl: &ExportDecl) {
        self.update_and_check(StatementType::Export, export_decl.span);
        self.before_visit(StatementType::Export);

        export_decl.visit_children_with(self);

        self.after_visit(StatementType::Export);
    }

    // "for" is for loop families. This matches all statements that the first token
    // is for keyword.
    fn visit_for_in_stmt(&mut self, for_stmt: &ForInStmt) {
        self.update_and_check(StatementType::For, for_stmt.span);
        self.before_visit(StatementType::For);

        for_stmt.visit_children_with(self);

        self.after_visit(StatementType::For);
    }

    // "for" is for loop families. This matches all statements that the first token
    // is for keyword.
    fn visit_for_of_stmt(&mut self, for_stmt: &ForOfStmt) {
        self.update_and_check(StatementType::For, for_stmt.span);
        self.before_visit(StatementType::For);

        for_stmt.visit_children_with(self);

        self.after_visit(StatementType::For);
    }

    // "for" is for loop families. This matches all statements that the first token
    // is for keyword.
    fn visit_for_stmt(&mut self, for_stmt: &ForStmt) {
        self.update_and_check(StatementType::For, for_stmt.span);
        self.before_visit(StatementType::For);

        for_stmt.visit_children_with(self);

        self.after_visit(StatementType::For);
    }

    // "import" is import declarations.
    fn visit_import_decl(&mut self, import_decl: &ImportDecl) {
        self.update_and_check(StatementType::Import, import_decl.span);
        self.before_visit(StatementType::Import);

        import_decl.visit_children_with(self);

        self.after_visit(StatementType::Import);
    }

    // "expression" is expression statements.
    fn visit_expr_stmt(&mut self, expr: &ExprStmt) {
        self.update_and_check(StatementType::Expression, expr.span);
        self.before_visit(StatementType::Expression);

        expr.visit_children_with(self);

        self.after_visit(StatementType::Expression);
    }
}
