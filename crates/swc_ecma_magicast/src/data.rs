use std::{cell::RefCell, rc::Rc};

use swc_ecma_ast::Program;

pub(crate) struct Data<T>(
    Rc<RefCell<Program>>,
    Box<dyn Fn(&Program) -> &T>,
    Box<dyn Fn(&mut Program) -> &mut T>,
);

impl<T> Clone for Data<T> {
    fn clone(&self) -> Self {
        Data(
            self.0.clone(),
            Box::new(|data| (self.1)(data)),
            Box::new(|data| (self.2)(data)),
        )
    }
}

impl<T> Data<T> {
    pub fn new_root(root: Program) -> Data<Program> {
        Data(
            Rc::new(RefCell::new(root)),
            Box::new(|root| root),
            Box::new(|root| root),
        )
    }
}
