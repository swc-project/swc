use scoped_tls::scoped_thread_local;

use crate::Allocator;

scoped_thread_local!(pub(crate) static ALLOC: Allocator);
