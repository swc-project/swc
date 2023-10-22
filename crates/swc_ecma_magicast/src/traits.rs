pub trait Proxy {
    type Item;

    /// Creates a new proxied data using self as the context, and new_data as
    /// the data
    fn new_proxied(&self, new_data: Self::Item) -> Result<Box<Self>, ()>;
}

pub trait Ensurable: Proxy {
    fn ensure(&mut self) -> Self::Item;
}
