use swc_allocator::{boxed::Box, Allocator};

#[test]
fn escape() {
    let allocator = Allocator::default();

    let obj = allocator.scope(|| Box::new(1234));

    assert_eq!(*obj, 1234);
    // It should not segfault, because the allocator is still alive.
    drop(obj);
}
