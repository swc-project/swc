use swc_ecma_visit::VisitMut;

pub fn compressor() -> impl VisitMut {
    Compressor::default()
}

#[derive(Debug, Default)]
struct Compressor {}

impl VisitMut for Compressor {}
