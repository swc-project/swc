use std::{cell::RefCell, rc::Rc};

use swc_ecma_ast::Program;

pub(crate) struct Data<T>(Rc<RefCell<Program>>, Box<dyn Fn(RefCell<Program>) -> T>);

impl<T> Data<T> {
    pub fn new_root(root: Program) -> Data<Program> {}
}
