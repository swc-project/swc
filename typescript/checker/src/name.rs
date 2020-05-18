use crate::id::Id;
use smallvec::{smallvec, SmallVec};
use std::{
    convert::TryFrom,
    fmt::{self, Debug, Formatter},
};
use swc_atoms::js_word;
use swc_common::{iter::IdentifyLast, Fold, DUMMY_SP};
use swc_ecma_ast::*;

type Inner = SmallVec<[Id; 4]>;

/// Efficient alternative for [TsEntityName].
#[derive(Clone, Fold, PartialEq, Eq, Hash)]
pub struct Name(#[fold(ignore)] Inner);

impl Debug for Name {
    #[cold]
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), fmt::Error> {
        let mut buf = String::new();
        for (last, s) in self.0.iter().identify_last() {
            buf.push_str(s.as_str());
            if !last {
                buf.push('.');
            }
        }

        write!(f, "{}", buf)?;

        Ok(())
    }
}

impl From<&'_ Ident> for Name {
    #[inline]
    fn from(i: &Ident) -> Name {
        Id::from(i).into()
    }
}

impl From<Ident> for Name {
    #[inline]
    fn from(i: Ident) -> Name {
        Id::from(i).into()
    }
}

impl From<&'_ Id> for Name {
    #[inline]
    fn from(v: &Id) -> Name {
        Name(smallvec![v.clone()])
    }
}

impl From<Id> for Name {
    #[inline]
    fn from(v: Id) -> Name {
        Name(smallvec![v])
    }
}

impl From<TsEntityName> for Name {
    fn from(n: TsEntityName) -> Self {
        fn expand(buf: &mut Inner, n: TsEntityName) {
            match n {
                TsEntityName::Ident(i) => buf.push(Id::word(i.sym)),

                TsEntityName::TsQualifiedName(box q) => {
                    expand(buf, q.left);
                    buf.push(Id::word(q.right.sym));
                }
            }
        }

        let mut buf = Inner::default();
        expand(&mut buf, n);
        Self(buf)
    }
}

impl From<&'_ TsEntityName> for Name {
    fn from(n: &TsEntityName) -> Self {
        fn expand(buf: &mut Inner, n: &TsEntityName) {
            match n {
                TsEntityName::Ident(i) => buf.push(i.into()),

                TsEntityName::TsQualifiedName(box q) => {
                    expand(buf, &q.left);
                    buf.push(q.right.clone().into());
                }
            }
        }

        let mut buf = Inner::default();
        expand(&mut buf, n);
        Self(buf)
    }
}

impl TryFrom<&'_ Expr> for Name {
    type Error = ();

    fn try_from(e: &Expr) -> Result<Self, Self::Error> {
        match *e {
            Expr::Ident(ref i) => Ok(i.into()),
            // TODO
            _ => Err(()),
        }
    }
}

impl From<&'_ TsThisTypeOrIdent> for Name {
    fn from(ty: &TsThisTypeOrIdent) -> Self {
        match *ty {
            TsThisTypeOrIdent::TsThisType(..) => Name::from(Ident::new(js_word!("this"), DUMMY_SP)),
            TsThisTypeOrIdent::Ident(ref i) => Name::from(i),
        }
    }
}
