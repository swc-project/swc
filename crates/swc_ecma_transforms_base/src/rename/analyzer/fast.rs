use swc_atoms::JsWord;

pub struct JsWordList {
    words: Vec<JsWord>,
}

impl JsWordList {
    pub fn get(&mut self, w: &JsWord) -> usize {
        if let Some(i) = self.words.iter().position(|x| x == w) {
            i
        } else {
            let i = self.words.len();
            self.words.push(w.clone());
            i
        }
    }
}
