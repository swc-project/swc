pub(crate) struct Node<T>(Rc<RefCell<Module>>, Box<dyn Fn(RefCell<Module>) -> T>);
