use swc_atoms::JsWord;

#[derive(Debug, Default)]
pub(super) struct JsWordList {
    words: Vec<JsWord>,
}

#[repr(transparent)]
#[derive(Debug, Clone, Copy, Default, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub(super) struct JsWordIndex(usize);

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

    pub fn get(&self, i: JsWordIndex) -> &JsWord {
        &self.words[i.0]
    }
}
