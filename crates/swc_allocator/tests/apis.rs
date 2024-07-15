use criterion::black_box;
use swc_allocator::Allocator;

#[test]
fn direct_alloc_std() {
    let mut buf = std::vec::Vec::new();
    for i in 0..1000 {
        let item: std::boxed::Box<usize> = black_box(std::boxed::Box::new(black_box(i)));
        buf.push(item);
    }
}

#[test]
fn direct_alloc_no_scope() {
    let mut vec = swc_allocator::vec::Vec::new();
    for i in 0..1000 {
        let item: swc_allocator::boxed::Box<usize> =
            black_box(swc_allocator::boxed::Box::new(black_box(i)));
        vec.push(item);
    }
}

#[test]
fn direct_alloc_in_scope() {
    let allocator = Allocator::default();

    allocator.scope(|| {
        let mut vec = swc_allocator::vec::Vec::new();

        for i in 0..1000 {
            let item: swc_allocator::boxed::Box<usize> =
                black_box(swc_allocator::boxed::Box::new(black_box(i)));
            vec.push(item);
        }
    });
}
