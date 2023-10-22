use std::{cell::RefCell, rc::Rc};

use swc_ecma_ast::Program;

pub(crate) struct Data<'a, T>(
    Rc<RefCell<Program>>,
    Rc<dyn 'a + Fn(&Program) -> &T>,
    Rc<dyn 'a + Fn(&mut Program) -> &mut T>,
);

impl<T> Clone for Data<'_, T> {
    fn clone(&self) -> Self {
        Data(self.0.clone(), self.1.clone(), self.2.clone())
    }
}

impl<'a, T> Data<'a, T> {
    pub fn new_root(root: Program) -> Data<'a, Program> {
        Data(
            Rc::new(RefCell::new(root)),
            Rc::new(|root| root),
            Rc::new(|root| root),
        )
    }

    pub fn map<N>(&self, f1: impl Fn(&T) -> &N, f2: impl Fn(&mut T) -> &mut N) -> Data<N> {
        Data(
            self.0.clone(),
            Rc::new(|data| f1((self.1)(data))),
            Rc::new(|data| f2((self.2)(data))),
        )
    }

    pub fn with<Ret>(&self, f: impl FnOnce(&T) -> Ret) -> Ret {
        f((self.1)(&mut self.0.borrow()))
    }

    pub fn with_mut<Ret>(&self, f: impl FnOnce(&mut T) -> Ret) -> Ret {
        f((self.2)(&mut self.0.borrow_mut()))
    }
}
