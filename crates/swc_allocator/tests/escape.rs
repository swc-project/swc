use swc_allocator::{boxed::Box, Allocator, FastAlloc};

#[test]
fn escape() {
    let allocator = Allocator::default();

    let obj = allocator.scope(|| Box::new(1234));

    assert_eq!(*obj, 1234);
    // It should not segfault, because the allocator is still alive.
    drop(obj);
}

#[test]
fn global_allocator() {
    let allocator = Allocator::default();

    let obj = allocator.scope(|| Box::new_in(1234, FastAlloc::global()));

    assert_eq!(*obj, 1234);
    drop(allocator);
    // Object created with global allocator should outlive the allocator.
    drop(obj);
}
