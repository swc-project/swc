#![allow(clippy::let_unit_value)]
#![deny(non_snake_case)]

use rustc_hash::FxHashMap;
use swc_atoms::Atom;
use swc_common::{comments::Comments, input::StringInput, BytePos, Span, Spanned};
use swc_ecma_ast::*;

use crate::{
    error::SyntaxError,
    input::Buffer,
    lexer::{Token, TokenAndSpan, TokenValue},
    parser::{
        input::Tokens,
        state::{State, WithState},
        util::ExprExt,
    },
    syntax::SyntaxFlags,
    Context, Syntax,
};
#[cfg(test)]
extern crate test;
#[cfg(test)]
use test::Bencher;

use crate::error::Error;

#[macro_use]
mod macros;
mod class_and_fn;
mod context;
mod expr;
mod ident;
pub mod input;
mod jsx;
mod module_item;
mod object;
mod pat;
mod state;
mod stmt;
#[cfg(test)]
mod tests;
#[cfg(feature = "tsrx")]
pub(crate) mod tsrx;
#[cfg(feature = "typescript")]
mod typescript;
#[cfg(not(feature = "typescript"))]
mod typescript_stubs;
mod util;
#[cfg(feature = "verify")]
mod verifier;

use self::context::{
    BoundaryContext, FunctionKind, GrammarContext, StatementContext, StatementGrammar,
    SyntaxContext, TypeContext,
};

pub type PResult<T> = Result<T, crate::error::Error>;

#[cfg(feature = "typescript")]
pub struct ParserCheckpoint<I: Tokens> {
    lexer: I::Checkpoint,
    diagnostic_lengths: (usize, usize),
    buffer_prev_span: Span,
    buffer_cur: TokenAndSpan,
    buffer_next: Option<crate::lexer::NextTokenAndSpan>,
    grammar_context: GrammarContext,
    boundary_context: BoundaryContext,
    syntax_context: SyntaxContext,
    statement_context: StatementContext,
    type_context: TypeContext,
    #[cfg(feature = "flow")]
    allow_super_call: bool,
}

struct ProgramCheckpoint<I: Tokens> {
    lexer: I::Checkpoint,
    buffer_prev_span: Span,
    buffer_cur: TokenAndSpan,
    buffer_next: Option<crate::lexer::NextTokenAndSpan>,
    state: State,
    found_module_item: bool,
    ambiguous_script_different_ast: bool,
    program_parse_mode: ProgramParseMode,
    diagnostic_lengths: (usize, usize),
    token_flags: crate::lexer::TokenFlags,
    grammar_context: GrammarContext,
    boundary_context: BoundaryContext,
    syntax_context: SyntaxContext,
    statement_context: StatementContext,
    type_context: TypeContext,
    #[cfg(feature = "flow")]
    allow_super_call: bool,
}

struct ParsedProgram {
    start: BytePos,
    shebang: Option<Atom>,
    body: Vec<ModuleItem>,
}

#[derive(Clone, Copy, Debug, Eq, PartialEq)]
enum ProgramParseMode {
    None,
    Module,
    Script,
}

#[derive(Clone, Copy, Debug, Eq, PartialEq)]
enum UnambiguousParseAction {
    KeepModule,
    RelabelAsScript,
    RetryAsScript,
}

#[derive(Clone, Copy, Debug, Eq, PartialEq)]
enum ProgramGrammar {
    Module,
    Script,
}

/// EcmaScript parser.
#[derive(Clone)]
pub struct Parser<I: self::input::Tokens> {
    state: State,
    input: self::input::Buffer<I>,
    /// ECMAScript `[In]`, `[Yield]`, `[Await]`, and `[Return]` grammatical
    /// parameters.
    grammar_context: GrammarContext,
    /// State inherited across function, class, and program boundaries.
    boundary_context: BoundaryContext,
    /// The nearest syntactic region used for parser early errors.
    syntax_context: SyntaxContext,
    /// State derived from the enclosing statement grammar.
    statement_context: StatementContext,
    /// TypeScript, Flow, and cover-grammar parsing state.
    type_context: TypeContext,
    found_module_item: bool,
    #[cfg(feature = "tsrx")]
    tsrx: tsrx::TsrxState,
    /// Whether a top-level `await` has a different valid Script interpretation.
    ambiguous_script_different_ast: bool,
    /// Whether module-only syntax at the current position can classify an
    /// unambiguous Program as a Module.
    program_parse_mode: ProgramParseMode,
    #[cfg(feature = "flow")]
    allow_super_call: bool,
}

impl<I: Tokens> Parser<I> {
    #[inline(always)]
    pub fn input(&self) -> &Buffer<I> {
        &self.input
    }

    #[inline(always)]
    pub fn input_mut(&mut self) -> &mut Buffer<I> {
        &mut self.input
    }

    #[inline(always)]
    fn state(&self) -> &State {
        &self.state
    }

    #[inline(always)]
    fn state_mut(&mut self) -> &mut State {
        &mut self.state
    }

    fn program_checkpoint_save(&self) -> ProgramCheckpoint<I> {
        ProgramCheckpoint {
            lexer: self.input.iter.checkpoint_save(),
            buffer_cur: self.input.cur,
            buffer_next: self.input.next.clone(),
            buffer_prev_span: self.input.prev_span,
            state: self.state.clone(),
            found_module_item: self.found_module_item,
            ambiguous_script_different_ast: self.ambiguous_script_different_ast,
            program_parse_mode: self.program_parse_mode,
            diagnostic_lengths: self.input.iter.diagnostic_checkpoint_save(),
            token_flags: self.input.iter.token_flags(),
            grammar_context: self.grammar_context,
            boundary_context: self.boundary_context,
            syntax_context: self.syntax_context,
            statement_context: self.statement_context,
            type_context: self.type_context,
            #[cfg(feature = "flow")]
            allow_super_call: self.allow_super_call,
        }
    }

    fn program_checkpoint_load(&mut self, checkpoint: ProgramCheckpoint<I>) {
        self.input.iter.checkpoint_load(checkpoint.lexer);
        self.input
            .iter
            .diagnostic_checkpoint_load(checkpoint.diagnostic_lengths);
        self.input
            .iter
            .update_token_flags(|flags| *flags = checkpoint.token_flags);
        self.input.cur = checkpoint.buffer_cur;
        self.input.next = checkpoint.buffer_next;
        self.input.prev_span = checkpoint.buffer_prev_span;
        self.state = checkpoint.state;
        self.found_module_item = checkpoint.found_module_item;
        self.ambiguous_script_different_ast = checkpoint.ambiguous_script_different_ast;
        self.program_parse_mode = checkpoint.program_parse_mode;
        self.grammar_context = checkpoint.grammar_context;
        self.boundary_context = checkpoint.boundary_context;
        self.syntax_context = checkpoint.syntax_context;
        self.statement_context = checkpoint.statement_context;
        self.type_context = checkpoint.type_context;
        #[cfg(feature = "flow")]
        {
            self.allow_super_call = checkpoint.allow_super_call;
        }
    }

    #[cfg(all(feature = "typescript", feature = "flow"))]
    fn checkpoint_save(&self) -> ParserCheckpoint<I> {
        ParserCheckpoint {
            lexer: self.input.iter.checkpoint_save(),
            diagnostic_lengths: self.input.iter.diagnostic_checkpoint_save(),
            buffer_cur: self.input.cur,
            buffer_next: self.input.next.clone(),
            buffer_prev_span: self.input.prev_span,
            grammar_context: self.grammar_context,
            boundary_context: self.boundary_context,
            syntax_context: self.syntax_context,
            statement_context: self.statement_context,
            type_context: self.type_context,
            allow_super_call: self.allow_super_call,
        }
    }

    #[cfg(all(feature = "typescript", not(feature = "flow")))]
    fn checkpoint_save(&self) -> ParserCheckpoint<I> {
        ParserCheckpoint {
            lexer: self.input.iter.checkpoint_save(),
            diagnostic_lengths: self.input.iter.diagnostic_checkpoint_save(),
            buffer_cur: self.input.cur,
            buffer_next: self.input.next.clone(),
            buffer_prev_span: self.input.prev_span,
            grammar_context: self.grammar_context,
            boundary_context: self.boundary_context,
            syntax_context: self.syntax_context,
            statement_context: self.statement_context,
            type_context: self.type_context,
        }
    }

    #[cfg(all(feature = "typescript", feature = "flow"))]
    fn checkpoint_load(&mut self, checkpoint: ParserCheckpoint<I>) {
        self.input.iter.checkpoint_load(checkpoint.lexer);
        self.input
            .iter
            .diagnostic_checkpoint_load(checkpoint.diagnostic_lengths);
        self.input.cur = checkpoint.buffer_cur;
        self.input.next = checkpoint.buffer_next;
        self.input.prev_span = checkpoint.buffer_prev_span;
        self.grammar_context = checkpoint.grammar_context;
        self.boundary_context = checkpoint.boundary_context;
        self.syntax_context = checkpoint.syntax_context;
        self.statement_context = checkpoint.statement_context;
        self.type_context = checkpoint.type_context;
        self.allow_super_call = checkpoint.allow_super_call;
    }

    #[cfg(all(feature = "typescript", not(feature = "flow")))]
    fn checkpoint_load(&mut self, checkpoint: ParserCheckpoint<I>) {
        self.input.iter.checkpoint_load(checkpoint.lexer);
        self.input
            .iter
            .diagnostic_checkpoint_load(checkpoint.diagnostic_lengths);
        self.input.cur = checkpoint.buffer_cur;
        self.input.next = checkpoint.buffer_next;
        self.input.prev_span = checkpoint.buffer_prev_span;
        self.grammar_context = checkpoint.grammar_context;
        self.boundary_context = checkpoint.boundary_context;
        self.syntax_context = checkpoint.syntax_context;
        self.statement_context = checkpoint.statement_context;
        self.type_context = checkpoint.type_context;
    }

    #[cfg(feature = "flow")]
    #[inline(always)]
    pub fn allow_super_call(&self) -> bool {
        self.allow_super_call
    }

    #[cfg(not(feature = "flow"))]
    #[inline(always)]
    pub fn allow_super_call(&self) -> bool {
        false
    }

    #[cfg(feature = "flow")]
    #[inline(always)]
    pub fn set_allow_super_call(&mut self, value: bool) {
        self.allow_super_call = value;
    }

    #[cfg(not(feature = "flow"))]
    #[inline(always)]
    pub fn set_allow_super_call(&mut self, _value: bool) {}

    #[cfg(feature = "flow")]
    #[inline(always)]
    pub fn is_flow_syntax(&self) -> bool {
        self.syntax().flow()
    }

    #[cfg(not(feature = "flow"))]
    #[inline(always)]
    pub fn is_flow_syntax(&self) -> bool {
        false
    }

    #[inline(always)]
    fn mark_found_module_item(&mut self) {
        self.found_module_item = true;
    }

    /// Allows module-only syntax in a direct parser entry point without
    /// changing the source to module code.
    ///
    /// Program-level entry points configure this automatically. This is
    /// intended for callers which invoke methods such as [`Parser::parse_expr`]
    /// directly and need constructs such as `import.meta` or top-level `await`.
    #[inline(always)]
    pub fn allow_module_syntax(&mut self) {
        self.set_boundary_ctx(self.boundary_ctx() | BoundaryContext::CanBeModule);
    }
}

impl<'a> Parser<crate::lexer::Lexer<'a>> {
    pub fn new(syntax: Syntax, input: StringInput<'a>, comments: Option<&'a dyn Comments>) -> Self {
        let lexer = crate::lexer::Lexer::new(syntax, Default::default(), input, comments);
        Self::new_from(lexer)
    }
}

impl<I: Tokens> Parser<I> {
    pub fn new_from(input: I) -> Self {
        let in_declare = input.syntax().dts();
        let grammar_context = GrammarContext::empty();
        let boundary_context = BoundaryContext::TopLevel;
        let statement_context = StatementContext::empty();
        let mut type_context = TypeContext::empty();
        type_context.set(TypeContext::InDeclare, in_declare);

        let start_pos = input.start_pos();
        let mut p = Parser {
            state: Default::default(),
            input: crate::parser::input::Buffer::new(input),
            grammar_context,
            boundary_context,
            syntax_context: SyntaxContext::Program,
            statement_context,
            type_context,
            found_module_item: false,
            #[cfg(feature = "tsrx")]
            tsrx: Default::default(),
            ambiguous_script_different_ast: false,
            program_parse_mode: ProgramParseMode::None,
            #[cfg(feature = "flow")]
            allow_super_call: false,
        };

        // consume EOF
        p.input.first_bump();
        // This is a workaround to make comments work when there are only comments in a
        // source file.
        if p.input.cur.token == Token::Eof {
            p.input.cur.span = Span::new_with_checked(start_pos, start_pos);
        }

        p
    }

    pub fn take_errors(&mut self) -> Vec<Error> {
        self.input.iter.take_errors()
    }

    pub fn take_script_module_errors(&mut self) -> Vec<Error> {
        self.input.iter.take_script_module_errors()
    }

    pub fn parse_script(&mut self) -> PResult<Script> {
        trace_cur!(self, parse_script);
        self.enter_program_syntax_context();

        #[cfg(feature = "tsrx")]
        self.tsrx.enter_non_module();

        let lexical_context = self.ctx() - Context::Module;
        self.input_mut().set_ctx(lexical_context);
        enter_grammar_context!(&mut self.grammar_context, ?Yield, ?Await, ~Return);
        self.set_boundary_ctx(self.boundary_ctx() | BoundaryContext::TopLevel);

        let start = self.cur_pos();

        let shebang = self.parse_shebang()?;

        let ret = self.parse_stmt_block_body(true, None).map(|body| Script {
            span: self.span(start),
            body,
            shebang,
        })?;

        debug_assert!(self.input().cur() == Token::Eof);
        self.input_mut().bump();

        Ok(ret)
    }

    pub fn parse_commonjs(&mut self) -> PResult<Script> {
        trace_cur!(self, parse_commonjs);
        self.enter_program_syntax_context();

        #[cfg(feature = "tsrx")]
        self.tsrx.enter_non_module();

        // CommonJS module is acctually in a function scope
        let lexical_context = self.ctx() - Context::Module;
        self.input_mut().set_ctx(lexical_context);
        enter_grammar_context!(&mut self.grammar_context, ?Yield, ?Await, +Return);
        self.syntax_context = SyntaxContext::FunctionBody;
        self.set_boundary_ctx(self.boundary_ctx() | BoundaryContext::InsideNonArrowFunctionScope);

        let start = self.cur_pos();
        let shebang = self.parse_shebang()?;

        let ret = self.parse_stmt_block_body(true, None).map(|body| Script {
            span: self.span(start),
            body,
            shebang,
        })?;

        debug_assert!(self.input().cur() == Token::Eof);
        self.input_mut().bump();

        Ok(ret)
    }

    pub fn parse_typescript_module(&mut self) -> PResult<Module> {
        trace_cur!(self, parse_typescript_module);
        self.enter_program_syntax_context();

        #[cfg(feature = "tsrx")]
        self.tsrx.enter_module();

        debug_assert!(self.syntax().typescript());

        //TODO: parse() -> PResult<Program>
        let ctx = (self.ctx() | Context::Module) - Context::Strict;
        // Module code is always in strict mode
        self.input_mut().set_ctx(ctx);
        enter_grammar_context!(&mut self.grammar_context, ?Yield, ?Await, ~Return);
        self.set_boundary_ctx(self.boundary_ctx() | BoundaryContext::TopLevel);

        let start = self.cur_pos();
        let shebang = self.parse_shebang()?;

        let ret = self
            .parse_module_item_block_body(true, None)
            .map(|body| Module {
                span: self.span(start),
                body,
                shebang,
            })?;
        #[cfg(feature = "tsrx")]
        let mut ret = ret;
        #[cfg(feature = "tsrx")]
        self.finish_tsrx_module(&mut ret.body);

        debug_assert!(self.input().cur() == Token::Eof);
        self.input_mut().bump();

        Ok(ret)
    }

    /// Returns [Module] if it's a module and returns [Script] if it's not a
    /// module.
    ///
    /// Note: This is not perfect yet. It means, some strict mode violations may
    /// not be reported even if the method returns [Module].
    pub fn parse_program(&mut self) -> PResult<Program> {
        #[cfg(feature = "tsrx")]
        if self.syntax().tsrx() {
            self.tsrx.enter_module();
            return self.parse_module().map(Program::Module);
        }

        self.input_mut().iter_mut().set_defer_comments(true);
        let result = self.parse_unambiguous_program();
        self.input_mut().iter_mut().finalize_comments();

        result
    }

    fn parse_unambiguous_program(&mut self) -> PResult<Program> {
        // Probe with the Module Await grammar first. Most programs commit this
        // pass directly; only syntax with a distinct Script interpretation is
        // reparsed.
        let module_checkpoint = self.program_checkpoint_save();
        self.enter_unambiguous_module_context();

        let module_result = self.parse_program_once();
        let preserve_module_result_on_script_error =
            module_result.is_err() || self.ambiguous_script_different_ast;
        let action = match &module_result {
            Ok(parsed) => self.unambiguous_parse_action(&parsed.body),
            Err(_) => UnambiguousParseAction::RetryAsScript,
        };

        match action {
            UnambiguousParseAction::KeepModule => {
                let Ok(parsed) = module_result else {
                    unreachable!("a failed Module probe always retries as Script")
                };
                return Ok(self.finish_program(parsed, ProgramGrammar::Module));
            }
            UnambiguousParseAction::RelabelAsScript => {
                let Ok(parsed) = module_result else {
                    unreachable!("a failed Module probe always retries as Script")
                };
                return Ok(self.finish_program(parsed, ProgramGrammar::Script));
            }
            UnambiguousParseAction::RetryAsScript => {}
        }

        // Keep the first Module result and its diagnostics intact while probing
        // Script. If both probes report errors, preserve Module only for a fatal
        // Module failure or a known grammar ambiguity; otherwise the absence of
        // module syntax still classifies the recoverable program as Script.
        let mut script_parser = self.clone();
        script_parser.program_checkpoint_load(module_checkpoint);
        script_parser.enter_unambiguous_script_context();

        if let Ok(parsed) = script_parser.parse_program_once() {
            let script_has_errors = script_parser.input.iter.has_errors();
            let has_module_syntax = script_parser.has_module_syntax(&parsed.body);
            let can_commit_script = !has_module_syntax
                && (!script_has_errors || !preserve_module_result_on_script_error);
            if can_commit_script {
                let program = script_parser.finish_program(parsed, ProgramGrammar::Script);
                *self = script_parser;
                return Ok(program);
            }
        }

        module_result.map(|parsed| self.finish_program(parsed, ProgramGrammar::Module))
    }

    fn parse_program_once(&mut self) -> PResult<ParsedProgram> {
        let start = self.cur_pos();
        let shebang = self.parse_shebang()?;

        let body = self.parse_module_item_block_body(true, None)?;

        Ok(ParsedProgram {
            start,
            shebang,
            body,
        })
    }

    fn finish_program(&mut self, parsed: ParsedProgram, grammar: ProgramGrammar) -> Program {
        let ParsedProgram {
            start,
            shebang,
            body,
        } = parsed;

        let ret = match grammar {
            ProgramGrammar::Module => {
                let ctx = self.ctx() | Context::Module | Context::Strict;
                // Emit buffered strict mode / module code violations.
                self.input_mut().set_ctx(ctx);
                self.set_boundary_ctx(
                    self.boundary_ctx() | BoundaryContext::CanBeModule | BoundaryContext::TopLevel,
                );
                if self.syntax().flow() {
                    self.report_duplicate_exports(&body);
                }
                Program::Module(Module {
                    span: self.span(start),
                    body,
                    shebang,
                })
            }
            ProgramGrammar::Script => {
                let lexical_context = self.ctx() - Context::Module;
                self.input_mut().set_ctx(lexical_context);
                self.set_boundary_ctx(
                    (self.boundary_ctx() - BoundaryContext::CanBeModule)
                        | BoundaryContext::TopLevel,
                );
                enter_grammar_context!(&mut self.grammar_context, ?Yield, ~Await, ?Return);

                let requires_module_ast = body
                    .iter()
                    .any(|item| matches!(item, ModuleItem::ModuleDecl(..)));
                if requires_module_ast {
                    // TypeScript internal import aliases use Script grammar, but the AST can
                    // only represent them as module declarations.
                    Program::Module(Module {
                        span: self.span(start),
                        body,
                        shebang,
                    })
                } else {
                    let body = body
                        .into_iter()
                        .map(|item| match item {
                            ModuleItem::ModuleDecl(_) => unreachable!("handled above"),
                            ModuleItem::Stmt(stmt) => stmt,
                            #[cfg(swc_ast_unknown)]
                            _ => unreachable!(),
                        })
                        .collect();
                    Program::Script(Script {
                        span: self.span(start),
                        body,
                        shebang,
                    })
                }
            }
        };

        debug_assert!(self.input().cur() == Token::Eof);
        self.input_mut().bump();

        self.program_parse_mode = ProgramParseMode::None;
        ret
    }

    fn enter_unambiguous_module_context(&mut self) {
        self.enter_program_syntax_context();
        let lexical_context = self.ctx() - Context::Module;
        self.input_mut().set_ctx(lexical_context);
        enter_grammar_context!(&mut self.grammar_context, ?Yield, ?Await, ~Return);
        self.set_boundary_ctx(
            self.boundary_ctx() | BoundaryContext::CanBeModule | BoundaryContext::TopLevel,
        );
        self.program_parse_mode = ProgramParseMode::Module;
        self.ambiguous_script_different_ast = false;
    }

    fn enter_unambiguous_script_context(&mut self) {
        self.enter_program_syntax_context();
        let lexical_context = self.ctx() - Context::Module;
        self.input_mut().set_ctx(lexical_context);
        enter_grammar_context!(&mut self.grammar_context, ?Yield, ?Await, ~Return);
        self.set_boundary_ctx(
            (self.boundary_ctx() - BoundaryContext::CanBeModule) | BoundaryContext::TopLevel,
        );
        enter_grammar_context!(&mut self.grammar_context, ?Yield, ~Await, ?Return);
        self.program_parse_mode = ProgramParseMode::Script;
        self.ambiguous_script_different_ast = false;
    }

    fn unambiguous_parse_action(&self, body: &[ModuleItem]) -> UnambiguousParseAction {
        if self.has_module_syntax(body) {
            UnambiguousParseAction::KeepModule
        } else if self.input.iter.has_errors() || self.ambiguous_script_different_ast {
            UnambiguousParseAction::RetryAsScript
        } else {
            UnambiguousParseAction::RelabelAsScript
        }
    }

    fn has_module_syntax(&self, body: &[ModuleItem]) -> bool {
        self.found_module_item
            || body.iter().any(|item| {
                let ModuleItem::ModuleDecl(module_decl) = item else {
                    return false;
                };

                match module_decl {
                    ModuleDecl::TsImportEquals(import) => {
                        import.is_export
                            || matches!(&import.module_ref, TsModuleRef::TsExternalModuleRef(..))
                    }
                    _ => true,
                }
            })
    }

    fn is_unambiguous_module(&self) -> bool {
        self.program_parse_mode == ProgramParseMode::Module
    }

    fn can_classify_module(&self) -> bool {
        self.is_unambiguous_module()
            && self.syntax_context == SyntaxContext::Program
            && !self.boundary_ctx().intersects(
                BoundaryContext::InParameters
                    .union(BoundaryContext::InClassField)
                    .union(BoundaryContext::InStaticBlock),
            )
    }

    pub fn parse_module(&mut self) -> PResult<Module> {
        self.enter_program_syntax_context();
        #[cfg(feature = "tsrx")]
        self.tsrx.enter_module();

        let ctx = self.ctx() | Context::Module | Context::Strict;
        // Module code is always in strict mode
        self.input_mut().set_ctx(ctx);
        enter_grammar_context!(&mut self.grammar_context, ?Yield, ?Await, ~Return);
        self.set_boundary_ctx(
            self.boundary_ctx() | BoundaryContext::CanBeModule | BoundaryContext::TopLevel,
        );

        let start = self.cur_pos();
        let shebang = self.parse_shebang()?;

        let ret = self
            .parse_module_item_block_body(true, None)
            .map(|body| Module {
                span: self.span(start),
                body,
                shebang,
            })?;
        #[cfg(feature = "tsrx")]
        let mut ret = ret;
        #[cfg(feature = "tsrx")]
        self.finish_tsrx_module(&mut ret.body);
        if self.syntax().flow() {
            self.report_duplicate_exports(&ret.body);
        }

        debug_assert!(self.input().cur() == Token::Eof);
        self.input_mut().bump();

        Ok(ret)
    }

    pub fn parse_shebang(&mut self) -> PResult<Option<Atom>> {
        let cur = self.input().cur();
        Ok(if cur == Token::Shebang {
            let ret = self.input_mut().expect_shebang_token_and_bump();
            Some(ret)
        } else {
            None
        })
    }
}

impl<I: Tokens> Parser<I> {
    #[inline(always)]
    pub fn with_state<'w>(&'w mut self, state: State) -> WithState<'w, I> {
        let orig_state = std::mem::replace(self.state_mut(), state);
        WithState {
            orig_state,
            inner: self,
        }
    }

    /// Runs `op` in a grammar production whose Await parameter does not come
    /// from an enclosing potential async arrow.
    #[inline(always)]
    fn without_async_arrow_param_await_collection<T>(
        &mut self,
        op: impl FnOnce(&mut Self) -> T,
    ) -> T {
        if !self.state().collect_async_arrow_param_await {
            return op(self);
        }

        self.state_mut().collect_async_arrow_param_await = false;
        let pending = self.state_mut().pending_async_arrow_param_await.take();
        let result = op(self);
        self.state_mut().collect_async_arrow_param_await = true;
        self.state_mut().pending_async_arrow_param_await = pending;
        result
    }

    #[inline(always)]
    pub fn ctx(&self) -> Context {
        self.input().get_ctx()
    }

    #[inline(always)]
    pub fn set_ctx(&mut self, ctx: Context) {
        self.input_mut().set_ctx(ctx);
    }

    #[inline(always)]
    fn grammar_ctx(&self) -> GrammarContext {
        self.grammar_context
    }

    #[inline(always)]
    fn set_grammar_ctx(&mut self, grammar_context: GrammarContext) {
        self.grammar_context = grammar_context;
    }

    #[inline(always)]
    fn boundary_ctx(&self) -> BoundaryContext {
        self.boundary_context
    }

    #[inline(always)]
    fn set_boundary_ctx(&mut self, boundary_context: BoundaryContext) {
        self.boundary_context = boundary_context;
    }

    #[inline(always)]
    fn statement_ctx(&self) -> StatementContext {
        self.statement_context
    }

    #[inline(always)]
    fn set_statement_ctx(&mut self, statement_context: StatementContext) {
        self.statement_context = statement_context;
    }

    #[inline(always)]
    fn type_ctx(&self) -> TypeContext {
        self.type_context
    }

    #[inline(always)]
    fn set_type_ctx(&mut self, type_context: TypeContext) {
        self.type_context = type_context;
    }

    /// Runs with derived grammatical parameters, restoring them on success or
    /// error.
    #[inline]
    fn with_grammar_context<T>(
        &mut self,
        context: GrammarContext,
        f: impl FnOnce(&mut Self) -> T,
    ) -> T {
        let grammar_context = self.grammar_ctx();
        self.set_grammar_ctx(context);
        let result = f(self);
        self.set_grammar_ctx(grammar_context);
        result
    }

    #[inline]
    fn do_inside_of_boundary_context<T>(
        &mut self,
        context: BoundaryContext,
        f: impl FnOnce(&mut Self) -> T,
    ) -> T {
        let previous = self.boundary_ctx();
        self.set_boundary_ctx(previous | context);
        let result = f(self);
        self.set_boundary_ctx(previous);
        result
    }

    #[inline]
    fn do_outside_of_boundary_context<T>(
        &mut self,
        context: BoundaryContext,
        f: impl FnOnce(&mut Self) -> T,
    ) -> T {
        let previous = self.boundary_ctx();
        self.set_boundary_ctx(previous - context);
        let result = f(self);
        self.set_boundary_ctx(previous);
        result
    }

    #[inline]
    fn do_inside_of_statement_context<T>(
        &mut self,
        context: StatementContext,
        f: impl FnOnce(&mut Self) -> T,
    ) -> T {
        let previous = self.statement_ctx();
        self.set_statement_ctx(previous | context);
        let result = f(self);
        self.set_statement_ctx(previous);
        result
    }

    #[inline]
    fn do_outside_of_statement_context<T>(
        &mut self,
        context: StatementContext,
        f: impl FnOnce(&mut Self) -> T,
    ) -> T {
        let previous = self.statement_ctx();
        self.set_statement_ctx(previous - context);
        let result = f(self);
        self.set_statement_ctx(previous);
        result
    }

    #[inline]
    fn do_inside_of_type_context<T>(
        &mut self,
        context: TypeContext,
        f: impl FnOnce(&mut Self) -> T,
    ) -> T {
        let previous = self.type_ctx();
        self.set_type_ctx(previous | context);
        let result = f(self);
        self.set_type_ctx(previous);
        result
    }

    #[inline]
    fn do_outside_of_type_context<T>(
        &mut self,
        context: TypeContext,
        f: impl FnOnce(&mut Self) -> T,
    ) -> T {
        let previous = self.type_ctx();
        self.set_type_ctx(previous - context);
        let result = f(self);
        self.set_type_ctx(previous);
        result
    }

    #[inline(always)]
    fn includes_in_expr(&self) -> bool {
        self.grammar_ctx().contains(GrammarContext::In)
    }

    #[inline(always)]
    fn includes_yield_expr(&self) -> bool {
        self.grammar_ctx().contains(GrammarContext::Yield)
    }

    #[inline(always)]
    fn includes_await_expr(&self) -> bool {
        self.grammar_ctx().contains(GrammarContext::Await)
    }

    /// Applies the class initializer early error to every syntactic form of
    /// `await`, independently of the enclosing production's Await parameter.
    /// Function bodies establish their own boundary, even inside a class field.
    fn is_await_forbidden_in_initializer(&self) -> bool {
        self.syntax_context != SyntaxContext::FunctionBody
            && self
                .boundary_ctx()
                .intersects(BoundaryContext::InClassField | BoundaryContext::InStaticBlock)
    }

    #[inline(always)]
    fn allows_return_stmt(&self) -> bool {
        self.grammar_ctx().contains(GrammarContext::Return)
    }

    fn enter_program_syntax_context(&mut self) {
        self.syntax_context = SyntaxContext::Program;
    }

    /// Runs within a nested syntactic region, restoring it on success or error.
    /// These regions cannot classify their enclosing program as a module.
    fn with_syntax_context<T>(
        &mut self,
        context: SyntaxContext,
        f: impl FnOnce(&mut Self) -> T,
    ) -> T {
        let previous = self.syntax_context;
        self.syntax_context = context;
        let result = f(self);
        self.syntax_context = previous;
        result
    }

    #[inline]
    pub fn do_inside_of_context<T>(
        &mut self,
        context: Context,
        f: impl FnOnce(&mut Self) -> T,
    ) -> T {
        let ctx = self.ctx();
        let new_ctx = ctx.union(context);
        self.set_ctx(new_ctx);
        let result = f(self);
        self.set_ctx(ctx);
        result
    }

    #[inline]
    pub fn do_outside_of_context<T>(
        &mut self,
        context: Context,
        f: impl FnOnce(&mut Self) -> T,
    ) -> T {
        let ctx = self.ctx();
        let new_ctx = ctx.difference(context);
        self.set_ctx(new_ctx);
        let result = f(self);
        self.set_ctx(ctx);
        result
    }

    #[inline(always)]
    pub fn strict_mode<T>(&mut self, f: impl FnOnce(&mut Self) -> T) -> T {
        self.do_inside_of_context(Context::Strict, f)
    }

    /// Enters type grammar without changing tokenization. Only the type-grammar
    /// flag is restored on exit; unrelated parser state is left intact.
    #[inline(always)]
    pub fn in_type<T>(&mut self, f: impl FnOnce(&mut Self) -> T) -> T {
        let previous = self.type_context.contains(TypeContext::InType);
        self.type_context.insert(TypeContext::InType);
        let result = f(self);
        self.type_context.set(TypeContext::InType, previous);
        result
    }

    #[inline(always)]
    pub fn syntax(&self) -> SyntaxFlags {
        self.input().syntax()
    }

    #[inline(always)]
    fn token_is_reserved(&self, token: Token) -> bool {
        match token {
            Token::Await => {
                self.includes_await_expr()
                    || self.boundary_ctx().contains(BoundaryContext::InStaticBlock)
                    || self.ctx().contains(Context::Module)
            }
            Token::Yield => self.includes_yield_expr() || self.ctx().contains(Context::Strict),
            _ => token.is_reserved(self.ctx()),
        }
    }

    #[inline(always)]
    fn word_is_reserved(&self, word: &Atom) -> bool {
        match &**word {
            "null" | "true" | "false" | "break" | "case" | "catch" | "continue" | "debugger"
            | "default" | "do" | "export" | "else" | "finally" | "for" | "function" | "if"
            | "return" | "switch" | "throw" | "try" | "var" | "const" | "while" | "with"
            | "new" | "this" | "super" | "class" | "extends" | "import" | "in" | "instanceof"
            | "typeof" | "void" | "delete" | "enum" => true,
            "let" => self.ctx().contains(Context::Strict),
            "await" => {
                self.includes_await_expr()
                    || self.boundary_ctx().contains(BoundaryContext::InStaticBlock)
                    || self.ctx().contains(Context::Module)
            }
            "yield" => self.includes_yield_expr() || self.ctx().contains(Context::Strict),
            "implements" | "package" | "protected" | "interface" | "private" | "public"
                if self.ctx().contains(Context::Strict) =>
            {
                true
            }
            _ => false,
        }
    }

    /// Captures an escape diagnostic before an IdentifierName's role is known.
    /// Contextual keywords depend on parser grammar, not just lexical state.
    /// Read the buffered token value: lexer flags may describe lookahead
    /// instead.
    #[inline]
    fn escaped_keyword_error(&self) -> Option<Error> {
        if !self.input().has_escaped_keyword() {
            return None;
        }
        self.reserved_word_escape_error()
    }

    /// Checks contextual reservation and owns the diagnostic only on the
    /// uncommon path containing an escaped keyword.
    #[cold]
    #[inline(never)]
    fn reserved_word_escape_error(&self) -> Option<Error> {
        if !self.token_is_reserved(self.input().cur()) {
            return None;
        }
        let Some(TokenValue::Word(word)) = self.input().get_token_value() else {
            return None;
        };
        Some(Error::new(
            self.input().cur_span(),
            SyntaxError::EscapeInReservedWord { word: word.clone() },
        ))
    }

    fn check_current_token_escape(&mut self) -> PResult<()> {
        let token = self.input().cur();
        // Buffer validates the other keywords when they are consumed. Only
        // these contextual keywords depend on parser-owned grammar parameters.
        if !matches!(token, Token::Await | Token::Yield) {
            return Ok(());
        }
        if let Some(error) = self.escaped_keyword_error() {
            return Err(error);
        }

        Ok(())
    }

    #[cold]
    pub fn emit_err(&mut self, span: Span, error: SyntaxError) {
        if self.ctx().contains(Context::IgnoreError) || !self.syntax().early_errors() {
            return;
        }
        self.emit_error(crate::error::Error::new(span, error))
    }

    #[cold]
    pub fn emit_error(&mut self, error: crate::error::Error) {
        if self.ctx().contains(Context::IgnoreError) || !self.syntax().early_errors() {
            return;
        }
        let cur = self.input().cur();
        if cur == Token::Error {
            let err = self.input_mut().expect_error_token_and_bump();
            self.input_mut().iter_mut().add_error(err);
        }
        self.input_mut().iter_mut().add_error(error);
    }

    #[cold]
    pub fn emit_strict_mode_err(&mut self, span: Span, error: SyntaxError) {
        if self.ctx().contains(Context::IgnoreError) {
            return;
        }
        let error = crate::error::Error::new(span, error);
        if self.ctx().contains(Context::Strict) {
            self.input_mut().iter_mut().add_error(error);
        } else {
            self.input_mut().iter_mut().add_module_mode_error(error);
        }
    }

    #[cold]
    /// Buffers an early error which only applies if an unambiguous Program is
    /// ultimately classified as a Module.
    pub fn emit_module_mode_err(&mut self, span: Span, error: SyntaxError) {
        if self.ctx().contains(Context::IgnoreError) || !self.syntax().early_errors() {
            return;
        }

        let error = crate::error::Error::new(span, error);
        if self.ctx().contains(Context::Module) {
            self.input_mut().iter_mut().add_error(error);
        } else {
            self.input_mut().iter_mut().add_module_mode_error(error);
        }
    }

    fn report_duplicate_exports(&mut self, body: &[ModuleItem]) {
        let mut exported = FxHashMap::<Atom, Span>::default();
        for item in body {
            let ModuleItem::ModuleDecl(module_decl) = item else {
                continue;
            };
            self.collect_exported_names(module_decl, &mut exported);
        }
    }

    fn record_exported_name(
        &mut self,
        exported: &mut FxHashMap<Atom, Span>,
        name: Atom,
        span: Span,
    ) {
        if exported.insert(name.clone(), span).is_some() {
            self.emit_err(span, SyntaxError::TS1003);
        }
    }

    fn collect_decl_exported_names(&mut self, decl: &Decl, exported: &mut FxHashMap<Atom, Span>) {
        match decl {
            Decl::Class(class_decl) => {
                self.record_exported_name(
                    exported,
                    class_decl.ident.sym.clone(),
                    class_decl.ident.span,
                );
            }
            Decl::Fn(fn_decl) => {
                self.record_exported_name(exported, fn_decl.ident.sym.clone(), fn_decl.ident.span);
            }
            Decl::Var(var_decl) => {
                for declarator in &var_decl.decls {
                    if let Pat::Ident(ident) = &declarator.name {
                        self.record_exported_name(exported, ident.id.sym.clone(), ident.id.span);
                    }
                }
            }
            Decl::TsEnum(enum_decl) => {
                self.record_exported_name(exported, enum_decl.id.sym.clone(), enum_decl.id.span);
            }
            Decl::TsModule(module_decl) => {
                if let TsModuleName::Ident(ident) = &module_decl.id {
                    self.record_exported_name(exported, ident.sym.clone(), ident.span);
                }
            }
            Decl::TsInterface(..) | Decl::TsTypeAlias(..) | Decl::Using(..) => {}
            #[cfg(swc_ast_unknown)]
            _ => {}
        }
    }

    fn collect_exported_names(&mut self, decl: &ModuleDecl, exported: &mut FxHashMap<Atom, Span>) {
        match decl {
            ModuleDecl::ExportDecl(export_decl) => {
                self.collect_decl_exported_names(&export_decl.decl, exported);
            }
            ModuleDecl::ExportNamed(named_export) => {
                for spec in &named_export.specifiers {
                    match spec {
                        ExportSpecifier::Named(named) => {
                            if named.is_type_only {
                                continue;
                            }
                            let export_name = named.exported.as_ref().unwrap_or(&named.orig);
                            if let ModuleExportName::Ident(ident) = export_name {
                                self.record_exported_name(exported, ident.sym.clone(), ident.span);
                            }
                        }
                        ExportSpecifier::Default(default) => {
                            self.record_exported_name(
                                exported,
                                default.exported.sym.clone(),
                                default.exported.span,
                            );
                        }
                        ExportSpecifier::Namespace(namespace) => {
                            if let ModuleExportName::Ident(ident) = &namespace.name {
                                self.record_exported_name(exported, ident.sym.clone(), ident.span);
                            }
                        }
                        #[cfg(swc_ast_unknown)]
                        _ => {}
                    }
                }
            }
            ModuleDecl::ExportDefaultExpr(default_expr) => {
                self.record_exported_name(exported, Atom::from("default"), default_expr.span);
            }
            ModuleDecl::ExportDefaultDecl(default_decl) => {
                self.record_exported_name(exported, Atom::from("default"), default_decl.span);
            }
            ModuleDecl::ExportAll(..) => {}
            ModuleDecl::Import(..)
            | ModuleDecl::TsImportEquals(..)
            | ModuleDecl::TsExportAssignment(..)
            | ModuleDecl::TsNamespaceExport(..) => {}
            #[cfg(swc_ast_unknown)]
            _ => {}
        }
    }

    pub fn verify_expr(&mut self, expr: Box<Expr>) -> PResult<Box<Expr>> {
        #[cfg(feature = "verify")]
        {
            use swc_ecma_visit::Visit;
            let mut v = self::verifier::Verifier { errors: Vec::new() };
            v.visit_expr(&expr);
            for (span, error) in v.errors {
                self.emit_err(span, error);
            }
        }
        Ok(expr)
    }

    #[inline(always)]
    pub fn cur_pos(&self) -> BytePos {
        self.input().cur_pos()
    }

    #[inline(always)]
    pub fn last_pos(&self) -> BytePos {
        self.input().prev_span().hi
    }

    #[inline]
    pub fn is_general_semi(&mut self) -> bool {
        let cur = self.input().cur();
        matches!(cur, Token::Semi | Token::RBrace | Token::Eof)
            || self.input().had_line_break_before_cur()
    }

    pub fn eat_general_semi(&mut self) -> bool {
        if cfg!(feature = "debug") {
            #[cfg(debug_assertions)]
            tracing::trace!("eat(';'): cur={:?}", self.input().cur());
        }
        let cur = self.input().cur();
        if cur == Token::Semi {
            self.bump();
            true
        } else {
            cur == Token::RBrace || self.input().had_line_break_before_cur() || cur == Token::Eof
        }
    }

    #[inline]
    pub fn expect_general_semi(&mut self) -> PResult<()> {
        if !self.eat_general_semi() {
            let span = self.input().cur_span();
            let cur = self.input_mut().dump_cur();
            syntax_error!(self, span, SyntaxError::Expected(";".to_string(), cur))
        }
        Ok(())
    }

    #[inline]
    pub fn expect(&mut self, t: Token) -> PResult<()> {
        if !self.input_mut().eat(t) {
            let span = self.input().cur_span();
            let cur = self.input_mut().dump_cur();
            syntax_error!(self, span, SyntaxError::Expected(format!("{t:?}"), cur))
        } else {
            Ok(())
        }
    }

    #[inline(always)]
    pub fn expect_without_advance(&mut self, t: Token) -> PResult<()> {
        if !self.input_mut().is(t) {
            let span = self.input().cur_span();
            let cur = self.input_mut().dump_cur();
            syntax_error!(self, span, SyntaxError::Expected(format!("{t:?}"), cur))
        } else {
            Ok(())
        }
    }

    #[inline(always)]
    pub fn bump(&mut self) {
        debug_assert!(
            self.input().cur() != Token::Eof,
            "parser should not call bump() without knowing current token"
        );
        self.input_mut().bump()
    }

    #[inline]
    pub fn span(&self, start: BytePos) -> Span {
        let end = self.last_pos();
        debug_assert!(
            start <= end,
            "assertion failed: (span.start <= span.end). start = {start:?}, end = {end:?}",
        );
        Span::new_with_checked(start, end)
    }

    #[inline(always)]
    pub fn assert_and_bump(&mut self, token: Token) {
        debug_assert!(
            self.input().is(token),
            "assertion failed: expected {token:?}, got {:?}",
            self.input().cur()
        );
        self.bump();
    }

    pub fn check_assign_target(&mut self, expr: &Expr, deny_call: bool) {
        if !expr.is_valid_simple_assignment_target(self.ctx().contains(Context::Strict)) {
            self.emit_err(expr.span(), SyntaxError::TS2406);
        }

        // We follow behavior of tsc
        if self.input().syntax().typescript() && self.syntax().early_errors() {
            let is_eval_or_arguments = match expr {
                Expr::Ident(i) => i.is_reserved_in_strict_bind(),
                _ => false,
            };

            if is_eval_or_arguments {
                self.emit_strict_mode_err(expr.span(), SyntaxError::TS1100);
            }

            fn should_deny(e: &Expr, deny_call: bool) -> bool {
                match e {
                    Expr::Lit(..) => false,
                    Expr::Call(..) => deny_call,
                    Expr::Bin(..) => false,
                    Expr::Paren(ref p) => should_deny(&p.expr, deny_call),

                    _ => true,
                }
            }

            // It is an early Reference Error if LeftHandSideExpression is neither
            // an ObjectLiteral nor an ArrayLiteral and
            // IsValidSimpleAssignmentTarget of LeftHandSideExpression is false.
            if !is_eval_or_arguments
                && !expr.is_valid_simple_assignment_target(self.ctx().contains(Context::Strict))
                && should_deny(expr, deny_call)
            {
                self.emit_err(expr.span(), SyntaxError::TS2406);
            }
        }
    }

    /// spec: 'PropertyName'
    pub fn parse_prop_name(&mut self) -> PResult<PropName> {
        trace_cur!(self, parse_prop_name);
        let start = self.input().cur_pos();
        let cur = self.input().cur();
        let v = if cur == Token::Str {
            PropName::Str(self.parse_str_lit())
        } else if cur == Token::Num {
            let token_span = self.input.cur_span();
            let value = self.input_mut().expect_number_token_value();
            self.bump();

            let raw = self.input.iter.read_string(token_span);
            PropName::Num(Number {
                span: self.span(start),
                value,
                raw: Some(Atom::new(raw)),
            })
        } else if cur == Token::BigInt {
            let token_span = self.input.cur_span();
            let value = self.input_mut().expect_bigint_token_value();
            self.bump();

            let raw = self.input.iter.read_string(token_span);
            PropName::BigInt(BigInt {
                span: self.span(start),
                value,
                raw: Some(Atom::new(raw)),
            })
        } else if self.syntax().flow()
            && cur == Token::At
            && peek!(self).is_some_and(|peek| peek == Token::At)
        {
            self.assert_and_bump(Token::At);
            self.assert_and_bump(Token::At);
            if !self.input().cur().is_word() {
                unexpected!(self, "identifier");
            }
            let key = self.input_mut().expect_word_token_and_bump();
            PropName::Str(Str {
                span: self.span(start),
                value: format!("@@{key}").into(),
                raw: None,
            })
        } else if cur.is_word() {
            PropName::Ident(self.parse_ident_name()?)
        } else if cur == Token::LBracket {
            self.bump();
            let inner_start = self.input().cur_pos();
            let mut expr =
                with_grammar_context!(self, [+In, ?Yield, ?Await], Self::parse_assignment_expr)?;
            if self.syntax().typescript() && self.input().is(Token::Comma) {
                let mut exprs = vec![expr];
                while self.input_mut().eat(Token::Comma) {
                    //
                    exprs.push(with_grammar_context!(self, [+In, ?Yield, ?Await], Self::parse_assignment_expr)?);
                }
                self.emit_err(self.span(inner_start), SyntaxError::TS1171);
                expr = Box::new(
                    SeqExpr {
                        span: self.span(inner_start),
                        exprs,
                    }
                    .into(),
                );
            }
            expect!(self, Token::RBracket);
            PropName::Computed(ComputedPropName {
                span: self.span(start),
                expr,
            })
        } else {
            unexpected!(
                self,
                "identifier, string literal, numeric literal or [ for the computed key"
            )
        };
        Ok(v)
    }

    #[inline]
    pub fn is_ident_ref(&mut self) -> bool {
        let cur = self.input().cur();
        cur.is_word() && !self.token_is_reserved(cur)
    }

    #[inline]
    pub fn peek_is_ident_ref(&mut self) -> bool {
        peek!(self).is_some_and(|peek| peek.is_word() && !self.token_is_reserved(peek))
    }

    #[inline(always)]
    pub fn eat_ident_ref(&mut self) -> bool {
        if self.is_ident_ref() {
            self.bump();
            true
        } else {
            false
        }
    }

    #[cold]
    #[inline(never)]
    pub fn eof_error(&mut self) -> Error {
        debug_assert!(
            self.input().cur() == Token::Eof,
            "Parser should not call throw_eof_error() without knowing current token"
        );
        let pos = self.input().end_pos();
        let last = Span { lo: pos, hi: pos };
        Error::new(last, SyntaxError::Eof)
    }
}

#[cfg(test)]
pub fn test_parser<F, Ret>(s: &'static str, syntax: Syntax, f: F) -> Ret
where
    F: FnOnce(&mut Parser<crate::lexer::Lexer>) -> Result<Ret, Error>,
{
    crate::with_test_sess(s, |handler, input| {
        let lexer = crate::lexer::Lexer::new(syntax, EsVersion::Es2019, input, None);
        let mut p = Parser::new_from(lexer);
        let ret = f(&mut p);
        let mut error = false;

        for err in p.take_errors() {
            error = true;
            err.into_diagnostic(handler).emit();
        }

        let res = ret.map_err(|err| err.into_diagnostic(handler).emit())?;

        if error {
            return Err(());
        }

        Ok(res)
    })
    .unwrap_or_else(|output| panic!("test_parser(): failed to parse \n{s}\n{output}"))
}

#[cfg(test)]
pub fn test_parser_comment<F, Ret>(c: &dyn Comments, s: &'static str, syntax: Syntax, f: F) -> Ret
where
    F: FnOnce(&mut Parser<crate::lexer::Lexer>) -> Result<Ret, Error>,
{
    crate::with_test_sess(s, |handler, input| {
        let lexer = crate::lexer::Lexer::new(syntax, EsVersion::Es2019, input, Some(&c));
        let mut p = Parser::new_from(lexer);
        let ret = f(&mut p);

        for err in p.take_errors() {
            err.into_diagnostic(handler).emit();
        }

        ret.map_err(|err| err.into_diagnostic(handler).emit())
    })
    .unwrap_or_else(|output| panic!("test_parser(): failed to parse \n{s}\n{output}"))
}

#[cfg(test)]
pub fn bench_parser<F>(b: &mut Bencher, s: &'static str, syntax: Syntax, mut f: F)
where
    F: for<'a> FnMut(&'a mut Parser<crate::lexer::Lexer<'a>>) -> PResult<()>,
{
    b.bytes = s.len() as u64;

    let _ = crate::with_test_sess(s, |handler, input| {
        b.iter(|| {
            let lexer = crate::lexer::Lexer::new(syntax, Default::default(), input.clone(), None);
            let _ =
                f(&mut Parser::new_from(lexer)).map_err(|err| err.into_diagnostic(handler).emit());
        });

        Ok(())
    });
}
