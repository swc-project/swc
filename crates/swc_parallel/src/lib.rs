use std::{cell::RefCell, mem::transmute};

#[cfg(not(feature = "parallel"))]
pub struct Scope<'a>(std::marker::PhantomData<&'a ()>);

#[cfg(feature = "parallel")]
pub struct Scope<'a>(&'a mut chili::Scope<'a>);

pub fn join<A, B, RA, RB>(oper_a: A, oper_b: B) -> (RA, RB)
where
    A: Send + FnOnce() -> RA,
    B: Send + FnOnce() -> RB,
    RA: Send,
    RB: Send,
{
    thread_local! {
        static SCOPE: RefCell<Option<Scope<'static>>> = const { RefCell::new(None) };
    }

    let mut global_scope;
    let scope = SCOPE.try_with(|s| s.borrow_mut().take()).unwrap();

    let scope = match scope {
        Some(scope) => scope,
        None => {
            global_scope = chili::Scope::global();

            Scope(unsafe { transmute::<&mut chili::Scope, &mut chili::Scope>(&mut global_scope) })
        }
    };

    let (ra, rb) = scope.0.join(
        |scope| {
            let scope = Scope(unsafe { transmute::<&mut chili::Scope, &mut chili::Scope>(scope) });
            SCOPE.set(Some(scope));
            let ret = oper_a();
            SCOPE.set(None);
            ret
        },
        |scope| {
            let scope = Scope(unsafe { transmute::<&mut chili::Scope, &mut chili::Scope>(scope) });
            SCOPE.set(Some(scope));
            let ret = oper_b();
            SCOPE.set(None);
            ret
        },
    );

    (ra, rb)
}
