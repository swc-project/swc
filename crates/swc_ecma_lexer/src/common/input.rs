use swc_common::BytePos;
use swc_ecma_ast::EsVersion;

use super::context::Context;
use crate::{common::syntax::SyntaxFlags, error::Error, lexer};

/// Clone should be cheap if you are parsing typescript because typescript
/// syntax requires backtracking.
pub trait Tokens<TokenAndSpan>: Clone + Iterator<Item = TokenAndSpan> {
    type Checkpoint;

    fn set_ctx(&mut self, ctx: Context);
    fn ctx(&self) -> Context;
    fn ctx_mut(&mut self) -> &mut Context;
    fn syntax(&self) -> SyntaxFlags;
    fn target(&self) -> EsVersion;

    fn checkpoint_save(&self) -> Self::Checkpoint;
    fn checkpoint_load(&mut self, checkpoint: Self::Checkpoint);

    fn start_pos(&self) -> BytePos {
        BytePos(0)
    }

    fn set_expr_allowed(&mut self, allow: bool);
    fn set_next_regexp(&mut self, start: Option<BytePos>);

    fn token_context(&self) -> &lexer::TokenContexts;
    fn token_context_mut(&mut self) -> &mut lexer::TokenContexts;
    fn set_token_context(&mut self, c: lexer::TokenContexts);

    /// Implementors should use Rc<RefCell<Vec<Error>>>.
    ///
    /// It is required because parser should backtrack while parsing typescript
    /// code.
    fn add_error(&mut self, error: Error);

    /// Add an error which is valid syntax in script mode.
    ///
    /// This errors should be dropped if it's not a module.
    ///
    /// Implementor should check for if [Context].module, and buffer errors if
    /// module is false. Also, implementors should move errors to the error
    /// buffer on set_ctx if the parser mode become module mode.
    fn add_module_mode_error(&mut self, error: Error);

    fn end_pos(&self) -> BytePos;

    fn take_errors(&mut self) -> Vec<Error>;

    /// If the program was parsed as a script, this contains the module
    /// errors should the program be identified as a module in the future.
    fn take_script_module_errors(&mut self) -> Vec<Error>;
    fn update_token_flags(&mut self, f: impl FnOnce(&mut lexer::TokenFlags));
    fn token_flags(&self) -> lexer::TokenFlags;
}
