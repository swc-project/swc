//! The rayon prelude imports the various `ParallelIterator` traits.
//! The intention is that one can include `use swc_par_iter::prelude::*` and
//! have easy access to the various traits and methods you will need.

pub use crate::{
    iter::{
        FromParallelIterator, IndexedParallelIterator, IntoParallelIterator,
        IntoParallelRefIterator, IntoParallelRefMutIterator, ParallelDrainFull, ParallelDrainRange,
        ParallelExtend, ParallelIterator,
    },
    slice::{ParallelSlice, ParallelSliceMut},
    str::ParallelString,
};
