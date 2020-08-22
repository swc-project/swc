pub use self::input::Input;
use nom::IResult;
use swc_css_ast::Stylesheet;

pub type PResult<'a, T> = IResult<T, Input<'a>>;

mod input;

pub fn parse(s: Input) -> PResult<Stylesheet> {}
