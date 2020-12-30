#[derive(Debug)]
pub struct Tester {}

pub fn test<F>(op: F)
where
    F: FnOnce(&mut Tester),
{
}
