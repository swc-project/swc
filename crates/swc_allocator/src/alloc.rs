use scoped_tls::scoped_thread_local;

use crate::Allocator;

scoped_thread_local!(pub(crate) static ALLOC: Allocator);

pub(crate) struct SwcAlloc;

impl allocator_api2::alloc::Allocator for SwcAlloc {}
