use super::input::Tokens;

pub mod expr_ext;
pub mod state;

pub trait Parser<TokenAndSpan, I: Tokens<TokenAndSpan>>: Sized {
    fn state_mut(&mut self) -> &mut self::state::State;
    fn with_state(
        &mut self,
        state: self::state::State,
    ) -> self::state::WithState<TokenAndSpan, I, Self> {
        let orig_state = std::mem::replace(self.state_mut(), state);
        self::state::WithState {
            orig_state,
            inner: self,
            marker: std::marker::PhantomData,
        }
    }
}
