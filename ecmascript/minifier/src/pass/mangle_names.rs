use super::compute_char_freq::CharFreqInfo;
use swc_ecma_visit::VisitMut;

pub fn mangle_names(_char_freq_info: CharFreqInfo) -> impl VisitMut {
    Mangler {}
}

#[derive(Debug)]
struct Mangler {}

impl VisitMut for Mangler {}
