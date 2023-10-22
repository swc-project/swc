use std::{cell::RefCell, rc::Rc};

use swc_ecma_ast::Program;

pub(crate) struct Data<T>(
    Rc<RefCell<Program>>,
    Box<dyn Fn(&Program) -> &T>,
    Box<dyn Fn(&mut Program) -> &mut T>,
);

impl<T> Data<T> {
    pub fn new_root(root: Program) -> Data<Program> {
        Data(
            Rc::new(RefCell::new(root)),
            Box::new(|root| root),
            Box::new(|root| root),
        )
    }
}
