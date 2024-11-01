use once_cell::sync::OnceCell;
#[cfg(feature = "rkyv-impl")]
use rkyv::Archive;

/// Wrapper for [OnceCell] with support for [rkyv].
#[derive(Clone, Debug)]
#[cfg_attr(feature = "rkyv-impl", derive(Archive))]
pub struct CacheCell<T>(#[cfg_attr(feature = "rkyv-impl", archive(omit_bounds))] OnceCell<T>);
