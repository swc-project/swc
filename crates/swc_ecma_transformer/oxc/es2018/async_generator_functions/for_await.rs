//! This module is responsible for transforming `for await` to `for` statement

use oxc_allocator::{TakeIn, Vec as ArenaVec};
use oxc_ast::{NONE, ast::*};
use oxc_semantic::{ScopeFlags, ScopeId, SymbolFlags};
use oxc_span::SPAN;
use oxc_traverse::{Ancestor, BoundIdentifier};

use crate::{common::helper_loader::Helper, context::TraverseCtx};

use super::AsyncGeneratorFunctions;

impl<'a> AsyncGeneratorFunctions<'a, '_> {
    /// Check the parent node to see if multiple statements are allowed.
    fn is_multiple_statements_allowed(ctx: &TraverseCtx<'a>) -> bool {
        matches!(
            ctx.parent(),
            Ancestor::ProgramBody(_)
                | Ancestor::FunctionBodyStatements(_)
                | Ancestor::BlockStatementBody(_)
                | Ancestor::SwitchCaseConsequent(_)
                | Ancestor::StaticBlockBody(_)
                | Ancestor::TSModuleBlockBody(_)
        )
    }

    pub(crate) fn transform_statement(&self, stmt: &mut Statement<'a>, ctx: &mut TraverseCtx<'a>) {
        let (for_of, label) = match stmt {
            Statement::LabeledStatement(labeled) => {
                let LabeledStatement { label, body, .. } = labeled.as_mut();
                if let Statement::ForOfStatement(for_of) = body {
                    (for_of, Some(label))
                } else {
                    return;
                }
            }
            Statement::ForOfStatement(for_of) => (for_of, None),
            _ => return,
        };

        if !for_of.r#await {
            return;
        }

        let allow_multiple_statements = Self::is_multiple_statements_allowed(ctx);
        let parent_scope_id = if allow_multiple_statements {
            ctx.current_scope_id()
        } else {
            ctx.create_child_scope_of_current(ScopeFlags::empty())
        };

        // We need to replace the current statement with new statements,
        // but we don't have a such method to do it, so we leverage the statement injector.
        //
        // Now, we use below steps to workaround it:
        // 1. Use the last statement as the new statement.
        // 2. insert the rest of the statements before the current statement.
        // TODO: Once we have a method to replace the current statement, we can simplify this logic.
        let mut statements = self.transform_for_of_statement(for_of, parent_scope_id, ctx);
        let mut new_stmt = statements.pop().unwrap();

        // If it's a labeled statement, we need to wrap the ForStatement with a labeled statement.
        if let Some(label) = label {
            let Statement::TryStatement(try_statement) = &mut new_stmt else {
                unreachable!(
                    "The last statement should be a try statement, please see the `build_for_await` function"
                );
            };
            let try_statement_block_body = &mut try_statement.block.body;
            let for_statement = try_statement_block_body.pop().unwrap();
            try_statement_block_body.push(ctx.ast.statement_labeled(
                SPAN,
                label.clone(),
                for_statement,
            ));
        }
        self.ctx.statement_injector.insert_many_before(&new_stmt, statements);

        // If the parent node doesn't allow multiple statements, we need to wrap the new statement
        // with a block statement, this way we can ensure can insert statement correctly.
        // e.g. `if (true) statement` to `if (true) { statement }`
        if !allow_multiple_statements {
            new_stmt = ctx.ast.statement_block_with_scope_id(
                SPAN,
                ctx.ast.vec1(new_stmt),
                parent_scope_id,
            );
        }
        *stmt = new_stmt;
    }

    pub(self) fn transform_for_of_statement(
        &self,
        stmt: &mut ForOfStatement<'a>,
        parent_scope_id: ScopeId,
        ctx: &mut TraverseCtx<'a>,
    ) -> ArenaVec<'a, Statement<'a>> {
        let step_key =
            ctx.generate_uid("step", ctx.current_scope_id(), SymbolFlags::FunctionScopedVariable);
        // step.value
        let step_value = Expression::from(ctx.ast.member_expression_static(
            SPAN,
            step_key.create_read_expression(ctx),
            ctx.ast.identifier_name(SPAN, "value"),
            false,
        ));

        let assignment_statement = match &mut stmt.left {
            ForStatementLeft::VariableDeclaration(variable) => {
                // for await (let i of test)
                let mut declarator = variable.declarations.pop().unwrap();
                declarator.init = Some(step_value);
                Statement::VariableDeclaration(ctx.ast.alloc_variable_declaration(
                    SPAN,
                    declarator.kind,
                    ctx.ast.vec1(declarator),
                    false,
                ))
            }
            left @ match_assignment_target!(ForStatementLeft) => {
                // for await (i of test), for await ({ i } of test)
                let target = left.to_assignment_target_mut().take_in(ctx.ast);
                let expression = ctx.ast.expression_assignment(
                    SPAN,
                    AssignmentOperator::Assign,
                    target,
                    step_value,
                );
                ctx.ast.statement_expression(SPAN, expression)
            }
        };

        let body = {
            let mut statements = ctx.ast.vec_with_capacity(2);
            statements.push(assignment_statement);
            let stmt_body = &mut stmt.body;
            if let Statement::BlockStatement(block) = stmt_body {
                if block.body.is_empty() {
                    // If the block is empty, we don’t need to add it to the body;
                    // instead, we need to remove the useless scope.
                    ctx.scoping_mut().delete_scope(block.scope_id());
                } else {
                    statements.push(stmt_body.take_in(ctx.ast));
                }
            }
            statements
        };

        let iterator = stmt.right.take_in(ctx.ast);
        let iterator = self.ctx.helper_call_expr(
            Helper::AsyncIterator,
            SPAN,
            ctx.ast.vec1(Argument::from(iterator)),
            ctx,
        );
        Self::build_for_await(iterator, &step_key, body, stmt.scope_id(), parent_scope_id, ctx)
    }

    /// Build a `for` statement used to replace the `for await` statement.
    ///
    /// This function builds the following code:
    ///
    /// ```js
    // var ITERATOR_ABRUPT_COMPLETION = false;
    // var ITERATOR_HAD_ERROR_KEY = false;
    // var ITERATOR_ERROR_KEY;
    // try {
    //   for (
    //     var ITERATOR_KEY = GET_ITERATOR(OBJECT), STEP_KEY;
    //     ITERATOR_ABRUPT_COMPLETION = !(STEP_KEY = await ITERATOR_KEY.next()).done;
    //     ITERATOR_ABRUPT_COMPLETION = false
    //   ) {
    //   }
    // } catch (err) {
    //   ITERATOR_HAD_ERROR_KEY = true;
    //   ITERATOR_ERROR_KEY = err;
    // } finally {
    //   try {
    //     if (ITERATOR_ABRUPT_COMPLETION && ITERATOR_KEY.return != null) {
    //       await ITERATOR_KEY.return();
    //     }
    //   } finally {
    //     if (ITERATOR_HAD_ERROR_KEY) {
    //       throw ITERATOR_ERROR_KEY;
    //     }
    //   }
    // }
    /// ```
    ///
    /// Based on Babel's implementation:
    /// <https://github.com/babel/babel/blob/d20b314c14533ab86351ecf6ca6b7296b66a57b3/packages/babel-plugin-transform-async-generator-functions/src/for-await.ts#L3-L30>
    fn build_for_await(
        iterator: Expression<'a>,
        step_key: &BoundIdentifier<'a>,
        body: ArenaVec<'a, Statement<'a>>,
        for_of_scope_id: ScopeId,
        parent_scope_id: ScopeId,
        ctx: &mut TraverseCtx<'a>,
    ) -> ArenaVec<'a, Statement<'a>> {
        let var_scope_id = ctx.current_scope_id();

        let iterator_had_error_key =
            ctx.generate_uid("didIteratorError", var_scope_id, SymbolFlags::FunctionScopedVariable);
        let iterator_abrupt_completion = ctx.generate_uid(
            "iteratorAbruptCompletion",
            var_scope_id,
            SymbolFlags::FunctionScopedVariable,
        );
        let iterator_error_key =
            ctx.generate_uid("iteratorError", var_scope_id, SymbolFlags::FunctionScopedVariable);

        let mut items = ctx.ast.vec_with_capacity(4);
        items.push(Statement::from(ctx.ast.declaration_variable(
            SPAN,
            VariableDeclarationKind::Var,
            ctx.ast.vec1(ctx.ast.variable_declarator(
                SPAN,
                VariableDeclarationKind::Var,
                iterator_abrupt_completion.create_binding_pattern(ctx),
                Some(ctx.ast.expression_boolean_literal(SPAN, false)),
                false,
            )),
            false,
        )));
        items.push(Statement::from(ctx.ast.declaration_variable(
            SPAN,
            VariableDeclarationKind::Var,
            ctx.ast.vec1(ctx.ast.variable_declarator(
                SPAN,
                VariableDeclarationKind::Var,
                iterator_had_error_key.create_binding_pattern(ctx),
                Some(ctx.ast.expression_boolean_literal(SPAN, false)),
                false,
            )),
            false,
        )));
        items.push(Statement::from(ctx.ast.declaration_variable(
            SPAN,
            VariableDeclarationKind::Var,
            ctx.ast.vec1(ctx.ast.variable_declarator(
                SPAN,
                VariableDeclarationKind::Var,
                iterator_error_key.create_binding_pattern(ctx),
                None,
                false,
            )),
            false,
        )));

        let iterator_key =
            ctx.generate_uid("iterator", var_scope_id, SymbolFlags::FunctionScopedVariable);
        let block = {
            let block_scope_id = ctx.create_child_scope(parent_scope_id, ScopeFlags::empty());
            let for_statement_scope_id =
                ctx.create_child_scope(block_scope_id, ScopeFlags::empty());

            let for_statement = ctx.ast.statement_for_with_scope_id(
                SPAN,
                Some(ctx.ast.for_statement_init_variable_declaration(
                    SPAN,
                    VariableDeclarationKind::Var,
                    ctx.ast.vec_from_array([
                        ctx.ast.variable_declarator(
                            SPAN,
                            VariableDeclarationKind::Var,
                            iterator_key.create_binding_pattern(ctx),
                            Some(iterator),
                            false,
                        ),
                        ctx.ast.variable_declarator(
                            SPAN,
                            VariableDeclarationKind::Var,
                            step_key.create_binding_pattern(ctx),
                            None,
                            false,
                        ),
                    ]),
                    false,
                )),
                Some(ctx.ast.expression_assignment(
                    SPAN,
                    AssignmentOperator::Assign,
                    iterator_abrupt_completion.create_write_target(ctx),
                    ctx.ast.expression_unary(
                        SPAN,
                        UnaryOperator::LogicalNot,
                        Expression::from(ctx.ast.member_expression_static(
                            SPAN,
                            ctx.ast.expression_parenthesized(
                                SPAN,
                                ctx.ast.expression_assignment(
                                    SPAN,
                                    AssignmentOperator::Assign,
                                    step_key.create_write_target(ctx),
                                    ctx.ast.expression_await(
                                        SPAN,
                                        ctx.ast.expression_call(
                                            SPAN,
                                            Expression::from(ctx.ast.member_expression_static(
                                                SPAN,
                                                iterator_key.create_read_expression(ctx),
                                                ctx.ast.identifier_name(SPAN, "next"),
                                                false,
                                            )),
                                            NONE,
                                            ctx.ast.vec(),
                                            false,
                                        ),
                                    ),
                                ),
                            ),
                            ctx.ast.identifier_name(SPAN, "done"),
                            false,
                        )),
                    ),
                )),
                Some(ctx.ast.expression_assignment(
                    SPAN,
                    AssignmentOperator::Assign,
                    iterator_abrupt_completion.create_write_target(ctx),
                    ctx.ast.expression_boolean_literal(SPAN, false),
                )),
                {
                    // Handle the for-of statement move to the body of new for-statement
                    let for_statement_body_scope_id = for_of_scope_id;
                    {
                        ctx.scoping_mut().change_scope_parent_id(
                            for_statement_body_scope_id,
                            Some(for_statement_scope_id),
                        );
                    }

                    ctx.ast.statement_block_with_scope_id(SPAN, body, for_of_scope_id)
                },
                for_statement_scope_id,
            );

            ctx.ast.block_statement_with_scope_id(SPAN, ctx.ast.vec1(for_statement), block_scope_id)
        };

        let catch_clause = {
            let catch_scope_id = ctx.create_child_scope(parent_scope_id, ScopeFlags::CatchClause);
            let block_scope_id = ctx.create_child_scope(catch_scope_id, ScopeFlags::empty());
            let err_ident = ctx.generate_binding(
                Atom::from("err"),
                block_scope_id,
                SymbolFlags::CatchVariable | SymbolFlags::FunctionScopedVariable,
            );
            Some(ctx.ast.catch_clause_with_scope_id(
                SPAN,
                Some(ctx.ast.catch_parameter(SPAN, err_ident.create_binding_pattern(ctx))),
                {
                    ctx.ast.block_statement_with_scope_id(
                        SPAN,
                        ctx.ast.vec_from_array([
                            ctx.ast.statement_expression(
                                SPAN,
                                ctx.ast.expression_assignment(
                                    SPAN,
                                    AssignmentOperator::Assign,
                                    iterator_had_error_key.create_write_target(ctx),
                                    ctx.ast.expression_boolean_literal(SPAN, true),
                                ),
                            ),
                            ctx.ast.statement_expression(
                                SPAN,
                                ctx.ast.expression_assignment(
                                    SPAN,
                                    AssignmentOperator::Assign,
                                    iterator_error_key.create_write_target(ctx),
                                    err_ident.create_read_expression(ctx),
                                ),
                            ),
                        ]),
                        block_scope_id,
                    )
                },
                catch_scope_id,
            ))
        };

        let finally = {
            let finally_scope_id = ctx.create_child_scope(parent_scope_id, ScopeFlags::empty());
            let try_statement = {
                let try_block_scope_id =
                    ctx.create_child_scope(finally_scope_id, ScopeFlags::empty());
                let if_statement = {
                    let if_block_scope_id =
                        ctx.create_child_scope(try_block_scope_id, ScopeFlags::empty());
                    ctx.ast.statement_if(
                        SPAN,
                        ctx.ast.expression_logical(
                            SPAN,
                            iterator_abrupt_completion.create_read_expression(ctx),
                            LogicalOperator::And,
                            ctx.ast.expression_binary(
                                SPAN,
                                Expression::from(ctx.ast.member_expression_static(
                                    SPAN,
                                    iterator_key.create_read_expression(ctx),
                                    ctx.ast.identifier_name(SPAN, "return"),
                                    false,
                                )),
                                BinaryOperator::Inequality,
                                ctx.ast.expression_null_literal(SPAN),
                            ),
                        ),
                        ctx.ast.statement_block_with_scope_id(
                            SPAN,
                            ctx.ast.vec1(ctx.ast.statement_expression(
                                SPAN,
                                ctx.ast.expression_await(
                                    SPAN,
                                    ctx.ast.expression_call(
                                        SPAN,
                                        Expression::from(ctx.ast.member_expression_static(
                                            SPAN,
                                            iterator_key.create_read_expression(ctx),
                                            ctx.ast.identifier_name(SPAN, "return"),
                                            false,
                                        )),
                                        NONE,
                                        ctx.ast.vec(),
                                        false,
                                    ),
                                ),
                            )),
                            if_block_scope_id,
                        ),
                        None,
                    )
                };
                let block = ctx.ast.block_statement_with_scope_id(
                    SPAN,
                    ctx.ast.vec1(if_statement),
                    try_block_scope_id,
                );
                let finally = {
                    let finally_scope_id =
                        ctx.create_child_scope(finally_scope_id, ScopeFlags::empty());
                    let if_statement = {
                        let if_block_scope_id =
                            ctx.create_child_scope(finally_scope_id, ScopeFlags::empty());
                        ctx.ast.statement_if(
                            SPAN,
                            iterator_had_error_key.create_read_expression(ctx),
                            ctx.ast.statement_block_with_scope_id(
                                SPAN,
                                ctx.ast.vec1(ctx.ast.statement_throw(
                                    SPAN,
                                    iterator_error_key.create_read_expression(ctx),
                                )),
                                if_block_scope_id,
                            ),
                            None,
                        )
                    };
                    ctx.ast.block_statement_with_scope_id(
                        SPAN,
                        ctx.ast.vec1(if_statement),
                        finally_scope_id,
                    )
                };
                ctx.ast.statement_try(SPAN, block, NONE, Some(finally))
            };

            let block_statement = ctx.ast.block_statement_with_scope_id(
                SPAN,
                ctx.ast.vec1(try_statement),
                finally_scope_id,
            );
            Some(block_statement)
        };

        let try_statement = ctx.ast.statement_try(SPAN, block, catch_clause, finally);

        items.push(try_statement);
        items
    }
}
