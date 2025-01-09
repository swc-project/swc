#![cfg_attr(not(feature = "parallel"), allow(unused_variables))]

use std::{cell::RefCell, mem::transmute};

pub mod items;

#[derive(Default)]
pub struct MaybeScope<'a>(ScopeLike<'a>);

enum ScopeLike<'a> {
    Scope(Scope<'a>),
    #[cfg(feature = "parallel")]
    Global(Option<chili::Scope<'a>>),
}

impl Default for ScopeLike<'_> {
    fn default() -> Self {
        #[cfg(feature = "parallel")]
        {
            ScopeLike::Global(None)
        }

        #[cfg(not(feature = "parallel"))]
        {
            ScopeLike::Scope(Scope(std::marker::PhantomData))
        }
    }
}

impl<'a> From<Scope<'a>> for MaybeScope<'a> {
    fn from(value: Scope<'a>) -> Self {
        MaybeScope(ScopeLike::Scope(value))
    }
}

impl<'a> MaybeScope<'a> {
    #[allow(clippy::redundant_closure)]
    pub fn with<F, R>(&mut self, f: F) -> R
    where
        F: FnOnce(Scope<'a>) -> R,
    {
        #[cfg(feature = "parallel")]
        let scope: &mut chili::Scope = match &mut self.0 {
            ScopeLike::Scope(scope) => unsafe {
                // Safety: chili Scope will be alive until the end of the function, because it's
                // contract of 'a lifetime in the type.
                transmute::<&mut chili::Scope, &mut chili::Scope>(&mut scope.0)
            },
            #[cfg(feature = "parallel")]
            ScopeLike::Global(global_scope) => {
                // Initialize global scope lazily, and only once.
                let scope = global_scope.get_or_insert_with(|| chili::Scope::global());

                unsafe {
                    // Safety: Global scope is not dropped until the end of the program, and no one
                    // can access this **instance** of the global scope in the same time.
                    transmute::<&mut chili::Scope, &mut chili::Scope>(scope)
                }
            }
        };

        #[cfg(feature = "parallel")]
        let scope = Scope(scope);

        #[cfg(not(feature = "parallel"))]
        let scope = Scope(std::marker::PhantomData);

        f(scope)
    }
}

#[cfg(not(feature = "parallel"))]
pub struct Scope<'a>(std::marker::PhantomData<&'a ()>);

#[cfg(feature = "parallel")]
pub struct Scope<'a>(&'a mut chili::Scope<'a>);

#[inline]
pub fn join<A, B, RA, RB>(oper_a: A, oper_b: B) -> (RA, RB)
where
    A: Send + FnOnce() -> RA,
    B: Send + FnOnce() -> RB,
    RA: Send,
    RB: Send,
{
    thread_local! {
        static SCOPE: RefCell<Option<MaybeScope<'static>>> = Default::default();
    }

    struct RemoveScopeGuard;

    impl Drop for RemoveScopeGuard {
        fn drop(&mut self) {
            SCOPE.set(None);
        }
    }

    let mut scope = SCOPE.take().unwrap_or_default();

    let (ra, rb) = join_maybe_scoped(
        &mut scope,
        |scope| {
            let scope = unsafe {
                // Safety: inner scope cannot outlive the outer scope
                transmute::<Scope, Scope>(scope)
            };
            let _guard = RemoveScopeGuard;
            SCOPE.set(Some(MaybeScope(ScopeLike::Scope(scope))));

            oper_a()
        },
        |scope| {
            let scope = unsafe {
                // Safety: inner scope cannot outlive the outer scope
                transmute::<Scope, Scope>(scope)
            };
            let _guard = RemoveScopeGuard;
            SCOPE.set(Some(MaybeScope(ScopeLike::Scope(scope))));

            oper_b()
        },
    );

    // In case of panic, we does not restore the scope so it will be None.
    SCOPE.set(Some(scope));

    (ra, rb)
}

#[inline]
pub fn join_maybe_scoped<'a, A, B, RA, RB>(
    scope: &mut MaybeScope<'a>,
    oper_a: A,
    oper_b: B,
) -> (RA, RB)
where
    A: Send + FnOnce(Scope<'a>) -> RA,
    B: Send + FnOnce(Scope<'a>) -> RB,
    RA: Send,
    RB: Send,
{
    scope.with(|scope| join_scoped(scope, oper_a, oper_b))
}

#[inline]
pub fn join_scoped<'a, A, B, RA, RB>(scope: Scope<'a>, oper_a: A, oper_b: B) -> (RA, RB)
where
    A: Send + FnOnce(Scope<'a>) -> RA,
    B: Send + FnOnce(Scope<'a>) -> RB,
    RA: Send,
    RB: Send,
{
    #[cfg(feature = "parallel")]
    let (ra, rb) = scope.0.join(
        |scope| {
            let scope = Scope(unsafe {
                // Safety: This can be dangerous if the user do transmute on the scope, but it's
                // not our fault if the user uses transmute.
                transmute::<&mut chili::Scope, &mut chili::Scope>(scope)
            });

            oper_a(scope)
        },
        |scope| {
            let scope = Scope(unsafe {
                // Safety: This can be dangerous if the user do transmute on the scope, but it's
                // not our fault if the user uses transmute.
                transmute::<&mut chili::Scope, &mut chili::Scope>(scope)
            });

            oper_b(scope)
        },
    );

    #[cfg(not(feature = "parallel"))]
    let (ra, rb) = (
        oper_a(Scope(std::marker::PhantomData)),
        oper_b(Scope(std::marker::PhantomData)),
    );

    (ra, rb)
}
