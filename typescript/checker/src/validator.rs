use std::any::type_name;
use swc_common::VisitMutWith;

/// Visit with output
pub trait Validate<T: ?Sized> {
    type Output: Output;

    fn validate(&mut self, node: &mut T) -> Self::Output;
}

impl<T, V> Validate<T> for V
where
    T: VisitMutWith<Self>,
{
    default type Output = ();

    default fn validate(&mut self, node: &mut T) -> Self::Output {
        node.validate_children(self);
        Self::Output::unit()
    }
}

impl<T, V> Validate<Box<T>> for V
where
    T: VisitMutWith<Self>,
    Self: Validate<T>,
{
    type Output = <Self as Validate<T>>::Output;

    fn validate(&mut self, node: &mut Box<T>) -> Self::Output {
        self.validate(&mut **node)
    }
}

impl<T, V> Validate<Option<T>> for V
where
    T: VisitMutWith<Self>,
    Self: Validate<T>,
{
    type Output = Option<<Self as Validate<T>>::Output>;

    fn validate(&mut self, node: &mut Option<T>) -> Self::Output {
        match node {
            Some(ref mut n) => Some(self.validate(n)),
            None => None,
        }
    }
}

impl<T, V, O, E> Validate<Vec<T>> for V
where
    T: VisitMutWith<Self>,
    Self: Validate<T, Output = Result<O, E>>,
{
    type Output = Result<Vec<O>, E>;

    default fn validate(&mut self, nodes: &mut Vec<T>) -> Self::Output {
        nodes.iter_mut().map(|node| self.validate(node)).collect()
    }
}

pub trait ValidateWith<V> {
    type Output;
    fn validate_with(&mut self, v: &mut V) -> Self::Output;

    fn validate_children(&mut self, v: &mut V);
}

impl<V, T> ValidateWith<V> for T
where
    V: Validate<T>,
    T: VisitMutWith<V>,
{
    type Output = V::Output;

    #[inline]
    fn validate_with(&mut self, v: &mut V) -> Self::Output {
        v.validate(self)
    }

    #[inline]
    fn validate_children(&mut self, v: &mut V) {
        self.visit_mut_children(v);
    }
}

pub trait Output: Sized {
    fn unit() -> Self;
}

impl<T> Output for T {
    default fn unit() -> Self {
        unreachable!()
    }
}

impl Output for () {
    fn unit() -> Self {}
}
