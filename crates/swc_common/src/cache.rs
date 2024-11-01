use once_cell::sync::OnceCell;
#[cfg(feature = "rkyv-impl")]
use rkyv::Archive;

/// Wrapper for [OnceCell] with support for [rkyv].
#[derive(Clone, Debug)]
#[cfg_attr(feature = "rkyv-impl", derive(Archive))]
#[cfg_attr(
    feature = "rkyv-impl",
    archive(check_bytes, bound(archive = "T: rkyv::Archive"))
)]
pub struct CacheCell<T>(#[cfg_attr(feature = "rkyv-impl", archive(omit_bounds))] OnceCell<T>);
