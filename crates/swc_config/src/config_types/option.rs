use crate::merge::Merge;

pub struct MergingOption<T>(Option<T>)
where
    T: Merge;

impl<T> MergingOption<T> where T: Merge {}

impl<T> Merge for MergingOption<T> where T: Merge {}
