use super::filter;
use backtrace::Backtrace;
use fxhash::FxHashMap;
use std::fmt::Debug;
use swc_common::Spanned;

#[derive(Debug, Default)]
pub(crate) struct DuplicateTracker {
    visited: FxHashMap<String, Backtrace>,
}

impl DuplicateTracker {
    pub fn record<N>(&mut self, node: &N)
    where
        N: Debug + Spanned,
    {
        if node.span().is_dummy() {
            return;
        }

        let key = format!("{:?}", node);
        let bt = Backtrace::new_unresolved();

        self.insert(format!("{:?}", key), bt)
    }

    fn insert(&mut self, key: String, bt: Backtrace) {
        if let Some(bt1) = self.visited.remove(&*key) {
            let (l, r) = remove_common(bt1, bt);
            panic!("Duplicated detected:\n{}\n{:?}\n{:?}", key, l, r)
        }

        self.visited.insert(key, bt);
    }

    pub fn record_all(&mut self, other: DuplicateTracker) {
        for (k, v) in other.visited {
            self.insert(k, v);
        }
    }
}

fn remove_common(l: Backtrace, r: Backtrace) -> (Backtrace, Backtrace) {
    let (l, r) = (filter(l), filter(r));
    let (l, r): (Vec<_>, Vec<_>) = (l.into(), r.into());

    //    let mut start = 0;
    //    for i in 0..min(l.len(), r.len()) {
    //        let (lf, rf) = (&l[i], &r[i]);
    //        let (ls, rs) = (lf.symbols(), rf.symbols());
    //
    //        let mut eq = true;
    //
    //        if ls.len() == rs.len() {
    //            for j in 0..ls.len() {
    //                let (ls, rs) = (&ls[j], &rs[j]);
    //
    //                if ls.filename().is_none()
    //                    || rs.filename().is_none()
    //                    || ls.lineno().is_none()
    //                    || rs.lineno().is_none()
    //                    || ls.filename() != rs.filename()
    //                    || ls.lineno() != rs.lineno()
    //                {
    //                    eq = false;
    //                    break;
    //                }
    //            }
    //        } else {
    //            eq = false;
    //        }
    //
    //        if eq {
    //            start = i
    //        }
    //    }
    //    start -= 1;

    //    l.drain(..start);
    //    r.drain(..start);

    (l.into(), r.into())
}
