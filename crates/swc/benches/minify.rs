use criterion::{criterion_group, criterion_main};

criterion_group!(benches, files_group);
criterion_main!(benches);
