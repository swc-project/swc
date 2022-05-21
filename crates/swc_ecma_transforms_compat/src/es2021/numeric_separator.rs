use swc_atoms::JsWord;
use swc_ecma_ast::*;
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut};

pub fn numeric_separator() -> impl Fold + VisitMut {
    as_folder(Remover::default())
}

#[derive(Debug, Default)]
struct Remover;

impl VisitMut for Remover {
    noop_visit_mut_type!();

    fn visit_mut_number(&mut self, n: &mut Number) {
        if let Some(raw) = &n.raw {
            if raw.contains('_') {
                n.raw = removed_raw(raw);
            }
        }
    }

    fn visit_mut_big_int(&mut self, n: &mut BigInt) {
        if let Some(raw) = &n.raw {
            if raw.contains('_') {
                n.raw = removed_raw(raw);
            }
        }
    }
}

fn removed_raw(raw: &JsWord) -> Option<JsWord> {
    let raw = raw
        .as_bytes()
        .iter()
        .filter(|x| **x != b'_')
        .cloned()
        .collect();
    let raw = String::from_utf8(raw).expect("unexpected number raw");

    Some(JsWord::from(raw))
}
