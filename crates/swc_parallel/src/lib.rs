use once_cell::sync::Lazy;

static GLOBAL_SCOPE: Lazy<GlobalScope> = Lazy::new(|| GlobalScope(chili::Scope::global()));

#[cfg(not(feature = "parallel"))]
pub struct Scope<'a>(std::marker::PhantomData<&'a ()>);

#[cfg(feature = "parallel")]
pub struct Scope<'a>(chili::Scope<'a>);

#[cfg(feature = "parallel")]
struct GlobalScope(chili::Scope<'static>);

#[cfg(feature = "parallel")]
unsafe impl Sync for GlobalScope {}
#[cfg(feature = "parallel")]
unsafe impl Send for GlobalScope {}

pub fn join<A, B, RA, RB>(oper_a: A, oper_b: B) -> (RA, RB)
where
    A: Send + FnOnce() -> RA,
    B: Send + FnOnce() -> RB,
    RA: Send,
    RB: Send,
{
    let (ra, rb) = GLOBAL_SCOPE.0.join(|scope| {}, |scope| {});
}
