use anymap::AnyMap;
use swc_common::{Fold};

#[derive(Debug)]
pub struct Registrar {
    folders: AnyMap,
}

impl Registrar {
    pub fn new() -> Registrar {
        Registrar {
            folders: AnyMap::new(),
        }
    }

    pub fn register<A, F>(&mut self, folder: F) -> &mut Self
    where F: Fold<A> + 'static,
          A: 'static,
    {
        self.folders.entry::<Vec<Box<dyn Fold<A>>>>()
            .or_insert_with(Vec::new)
            .push(Box::new(folder));

        self
    }

    pub(crate) fn get_mut<A: 'static>(&mut self) -> &mut [Box<dyn Fold<A>>] {
        self.folders.get_mut::<Vec<Box<dyn Fold<A>>>>()
            .map(|folders| folders.as_mut_slice())
            .unwrap_or(&mut [])
    }

    pub fn len(&self) -> usize {
        self.folders.len()
    }

    pub fn is_empty(&self) -> bool {
        self.folders.is_empty()
    }
}

impl Default for Registrar {
    fn default() -> Registrar {
        Registrar::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    struct Foo;
    
    impl Fold<usize> for Foo {
        fn fold(&mut self, node: usize) -> usize {
            node
        }
    }

    #[test]
    fn insert_a_folder_and_get_it_back() {
        let mut registrar = Registrar::new();
        assert!(registrar.is_empty());

        registrar.register::<usize, _>(Foo);
        assert_eq!(registrar.len(), 1);

        let got = registrar.get_mut::<usize>();
        assert_eq!(got.len(), 1);
    }
}