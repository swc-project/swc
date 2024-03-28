use std::{cell::RefCell, rc::Rc};

use swc_ecma_ast::Program;

/// TODO: Make this generic over the root.
pub(crate) struct Data<'a, T: 'static>(
    Rc<RefCell<Program>>,
    Rc<dyn 'a + Fn(&Program) -> &T>,
    Rc<dyn 'a + Fn(&mut Program) -> &mut T>,
);

impl<T: 'static> Clone for Data<'_, T> {
    fn clone(&self) -> Self {
        Data(self.0.clone(), self.1.clone(), self.2.clone())
    }
}

impl<'a, T: 'static> Data<'a, T> {
    pub fn new_root(root: Program) -> Data<'a, Program> {
        Data(
            Rc::new(RefCell::new(root)),
            Rc::new(|root| root),
            Rc::new(|root| root),
        )
    }

    pub fn map<N>(
        &'a self,
        f1: impl 'a + Fn(&T) -> &N,
        f2: impl 'a + Fn(&mut T) -> &mut N,
    ) -> Data<'a, N>
    where
        N: 'static,
    {
        Data(
            self.0.clone(),
            Rc::new(move |data| f1((self.1)(data))),
            Rc::new(move |data| f2((self.2)(data))),
        )
    }

    pub fn map_opt<N>(
        &'a self,
        f1: impl 'a + Fn(&T) -> Option<&N>,
        f2: impl 'a + Fn(&mut T) -> Option<&mut N>,
    ) -> Option<Data<'a, N>>
    where
        N: 'static,
    {
        {
            let data = self.0.borrow();
            // Check it using actual data
            f1((self.1)(&data))?;
        }
        Some(Data(
            self.0.clone(),
            Rc::new(move |data| f1((self.1)(data)).unwrap()),
            Rc::new(move |data| f2((self.2)(data)).unwrap()),
        ))
    }

    pub fn with<Ret>(&self, f: impl FnOnce(&T) -> Ret) -> Ret {
        f((self.1)(&mut self.0.borrow()))
    }

    pub fn with_mut<Ret>(&self, f: impl FnOnce(&mut T) -> Ret) -> Ret {
        f((self.2)(&mut self.0.borrow_mut()))
    }
}
