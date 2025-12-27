use std::marker::PhantomData;

#[derive(Default)]
pub struct TransformState<'a> {
    data: PhantomData<&'a ()>,
}
