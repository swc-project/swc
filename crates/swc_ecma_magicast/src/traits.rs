pub trait Proxy {}

pub trait Ensurable: Proxy {
    fn ensure(&mut self) -> Result<Box<Self>, ()>;
}
