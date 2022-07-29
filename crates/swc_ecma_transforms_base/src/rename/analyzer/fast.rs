use swc_atoms::JsWord;

pub(super) struct JsWordList {
    words: Vec<JsWord>,
}

pub(super) struct JsWordIndex(usize);

impl JsWordList {
    pub fn get(&mut self, w: &JsWord) -> JsWordIndex {
        JsWordIndex(if let Some(i) = self.words.iter().position(|x| x == w) {
            i
        } else {
            let i = self.words.len();
            self.words.push(w.clone());
            i
        })
    }
}
