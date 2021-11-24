use scoped_tls::scoped_thread_local;

scoped_thread_local!(static FLAVOR: Flavor);

#[derive(Debug, Clone, Copy, Eq, PartialEq, Hash)]
pub enum Flavor {
    Babel,
    Acorn,
}

impl Default for Flavor {
    fn default() -> Self {
        Flavor::Babel
    }
}

impl Flavor {
    pub fn with<F, Ret>(self, op: F) -> Ret
    where
        F: FnOnce() -> Ret,
    {
        FLAVOR.set(&self, || op())
    }
}
