use scoped_tls::scoped_thread_local;

use crate::Allocator;

scoped_thread_local!(pub(crate) static ALLOC: Allocator);

fn with_allocator(f: impl FnOnce(&dyn allocator_api2::alloc::Allocator)) {
    if ALLOC.is_set() {
        ALLOC.with(|a| {
            //
            f(&&**a as &dyn allocator_api2::alloc::Allocator)
        });
    } else {
        f(&allocator_api2::alloc::Global);
    }
}

pub(crate) struct SwcAlloc;

impl allocator_api2::alloc::Allocator for SwcAlloc {}
