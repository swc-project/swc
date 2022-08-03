use rustc_hash::FxHashSet;
use swc_atoms::JsWord;
use swc_common::{chain, sync::Lrc, SourceMap};
use swc_ecma_ast::{Module, *};
use swc_ecma_codegen::{text_writer::JsWriter, Emitter};
use swc_ecma_transforms_base::rename::{renamer, Renamer};
use swc_ecma_visit::VisitMut;

use self::preserver::idents_to_preserve;
use crate::{option::MangleOptions, util::base54};

mod preserver;
mod private_name;

pub(crate) struct CharFreq([i32; 64]);

impl CharFreq {
    pub fn scan(&mut self, s: &str, delta: i32) {
        if delta == 0 {
            return;
        }

        for c in s.chars() {
            match c {
                'a'..='z' => {
                    self.0[c as usize - 'a' as usize] += delta;
                }
                'A'..='Z' => {
                    self.0[c as usize - 'A' as usize + 26] += delta;
                }
                '0'..='9' => {
                    self.0[c as usize - '0' as usize + 52] += delta;
                }
                '_' => {
                    self.0[62] += delta;
                }
                '$' => {
                    self.0[63] += delta;
                }

                _ => {}
            }
        }
    }
}

fn compute_char_freq(p: &Program) {
    let mut buf = vec![];
    let cm = Lrc::new(SourceMap::default());

    {
        let mut emitter = Emitter {
            cfg: Default::default(),
            cm: cm.clone(),
            comments: None,
            wr: Box::new(JsWriter::new(cm, "\n", &mut buf, None)),
        };

        emitter.emit_program(&p).unwrap();
    }

    let code = String::from_utf8(buf).unwrap();
}

pub(crate) fn name_mangler(options: MangleOptions, program: &Program) -> impl VisitMut {
    chain!(
        self::private_name::private_name_mangler(options.keep_private_props),
        renamer(Default::default(), ManglingRenamer { options })
    )
}

struct ManglingRenamer {
    options: MangleOptions,
}

impl Renamer for ManglingRenamer {
    const PARALLEL: bool = true;
    const RESET_N: bool = false;

    fn preserved_ids_for_module(&mut self, n: &Module) -> FxHashSet<Id> {
        idents_to_preserve(self.options.clone(), n)
    }

    fn preserved_ids_for_script(&mut self, n: &Script) -> FxHashSet<Id> {
        idents_to_preserve(self.options.clone(), n)
    }

    fn new_name_for(&self, _: &Id, n: &mut usize) -> JsWord {
        base54::encode(n, true)
    }
}
