use swc_atoms::JsWord;
use swc_common::SyntaxContext;
use swc_ecma_ast::Id;

#[derive(Debug, Default)]
pub(crate) struct JsWordList {
    words: Vec<JsWord>,
}

#[repr(transparent)]
#[derive(Debug, Clone, Copy, Default, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub(crate) struct JsWordIndex(usize);

impl JsWordList {
    pub fn store(&mut self, w: &JsWord) -> JsWordIndex {
        JsWordIndex(if let Some(i) = self.words.iter().position(|x| x == w) {
            i
        } else {
            let i = self.words.len();
            self.words.push(w.clone());
            i
        })
    }

    pub fn id(&mut self, w: &Id) -> (JsWordIndex, SyntaxContext) {
        (self.store(&w.0), w.1)
    }

    pub fn get(&self, i: JsWordIndex) -> &JsWord {
        &self.words[i.0]
    }

    pub fn get_id(&self, i: (JsWordIndex, SyntaxContext)) -> Id {
        (self.get(i.0).clone(), i.1)
    }
}
