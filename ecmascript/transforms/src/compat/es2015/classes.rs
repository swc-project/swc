use super::Helpers;
use std::sync::{atomic::Ordering, Arc};
use swc_common::{Fold, FoldWith, Spanned, DUMMY_SP};
use swc_ecma_ast::*;

/// `@babel/plugin-transform-classes`
///
/// # In
/// ```js
/// class Test {
///   constructor(name) {
///     this.name = name;
///   }
///
///   logger () {
///     console.log("Hello", this.name);
///   }
/// }
/// ```
///
/// # Out
/// ```js
/// var Test = function () {
///   function Test(name) {
///     _classCallCheck(this, Test);
///
///     this.name = name;
///   }
///
///   Test.prototype.logger = function logger() {
///     console.log("Hello", this.name);
///   };
///
///   return Test;
/// }();
/// ```
#[derive(Debug, Clone, Default)]
pub struct Classes {
  pub helpers: Arc<Helpers>,
}

impl Fold<Stmt> for Classes {
  fn fold(&mut self, n: Stmt) -> Stmt {
    let n = n.fold_children(self);

    match n {
      // TODO: Don't wrap simple classes with function
      //
      //    class Foo {}
      //
      // should be
      //
      //    var Foo = function Foo() {
      //        _classCallCheck(this, Foo);
      //    };
      //
      // instead of
      //    var Foo = function(){
      //      function Foo() {
      //          _classCallCheck(this, Foo);
      //      }
      //
      //      return Foo;
      //    }();
      Stmt::Decl(Decl::Class(decl)) => {
        let span = mark!(decl.span());
        let rhs = self.fold_class(Some(decl.ident.clone()), decl.class);

        Stmt::Decl(Decl::Var(VarDecl {
          span,
          kind: VarDeclKind::Var,
          decls: vec![VarDeclarator {
            span,
            init: Some(box rhs),
            // Foo in var Foo =
            name: decl.ident.into(),
          }],
        }))
      }
      _ => n,
    }
  }
}

impl Fold<Expr> for Classes {
  fn fold(&mut self, n: Expr) -> Expr {
    let n = n.fold_children(self);

    match n {
      Expr::Class(e) => self.fold_class(e.ident, e.class),
      _ => n,
    }
  }
}

impl Classes {
  /// Turns class expresion into iife.
  ///
  /// ```js
  /// class Foo {}
  /// ```
  ///
  /// ```js
  /// function() {
  ///   var Foo = function Foo(){
  ///   };
  /// }()
  /// ```
  fn fold_class(&mut self, class_name: Option<Ident>, class: Class) -> Expr {
    let (params, args) = if let Some(ref super_class) = class.super_class {
      // TODO
      (vec![], vec![])
    } else {
      (vec![], vec![])
    };

    let body = BlockStmt {
      span: DUMMY_SP,
      stmts: self.class_to_stmts(class_name, class),
    };

    Expr::Call(CallExpr {
      span: DUMMY_SP,
      callee: ExprOrSuper::Expr(box Expr::Fn(FnExpr {
        ident: None,
        function: Function {
          span: DUMMY_SP,
          async: None,
          generator: None,
          params,
          body,
        },
      })),
      args,
    })
  }

  /// Returned `stmts` contains `return Foo`
  fn class_to_stmts(&mut self, class_name: Option<Ident>, mut class: Class) -> Vec<Stmt> {
    if let Some(_) = class.super_class {
      // inject helper methods
      self.helpers.inherits.store(true, Ordering::SeqCst);
      self
        .helpers
        .possible_constructor_return
        .store(true, Ordering::SeqCst);
    }

    let ident = class_name.unwrap_or_else(|| Ident::new("_Class".into(), DUMMY_SP));

    let mut stmts = vec![];

    // Process constructor
    // TODO: inject class call check
    // TODO: inject possible return check
    {
      let constructor = {
        // Find constuctor
        let pos = class.body.iter().position(|m| match m.kind {
          ClassMethodKind::Constructor => true,
          _ => false,
        });
        match pos {
          Some(pos) => Some(class.body.remove(pos)),
          _ => None,
        }
      };
      let function = constructor.map(|c| c.function).unwrap_or_else(|| Function {
        async: None,
        generator: None,
        span: ident.span,
        params: vec![],
        body: BlockStmt {
          span: DUMMY_SP,
          stmts: vec![],
        },
      });

      // Process constructor
      // TODO: inject classCallCheck
      // TODO: inject possibleReturnCheck

      stmts.push(Stmt::Decl(Decl::Fn(FnDecl {
        ident: ident.clone(),
        function,
      })));
    }

    // convert class methods
    stmts.extend(
      class
        .body
        .into_iter()
        .map(|m| self.fold_class_method(ident.clone(), m)),
    );

    // `return Foo`
    stmts.push(Stmt::Return(ReturnStmt {
      span: DUMMY_SP,
      arg: Some(box Expr::Ident(ident)),
    }));

    stmts
  }

  fn fold_class_method(&mut self, class: Ident, m: ClassMethod) -> Stmt {
    let span = mark!(m.span());

    match m.kind {
      ClassMethodKind::Constructor => unreachable!(),
      //
      //  Foo.staticMethod
      //  Foo.prototype.method
      ClassMethodKind::Method => {
        let lhs_obj = if let Some(_static_token) = m.static_token {
          Expr::Ident(class)
        } else {
          // Foo.prototype
          Expr::Member(MemberExpr {
            span,
            obj: ExprOrSuper::Expr(box Expr::Ident(class)),
            computed: false,
            prop: member_expr!(DUMMY_SP, prototype),
          })
        };

        let name = match m.key {
          PropName::Ident(ident) => ident,
          _ => unimplemented!("PropName: {:?}", m.key),
        };

        Stmt::Expr(box Expr::Assign(AssignExpr {
          span,
          left: PatOrExpr::Expr(box Expr::Member(MemberExpr {
            span,
            obj: ExprOrSuper::Expr(box lhs_obj),
            computed: false,
            prop: box Expr::Ident(name.clone()),
          })),
          op: op!("="),
          right: box Expr::Fn(FnExpr {
            ident: Some(name),
            function: m.function,
          }),
        }))
      }
      _ => unimplemented!(),
    }
  }
}

#[cfg(test)]
mod tests {
  use super::*;

  test!(
    Classes::default(),
    basic,
    r#"class Test {
  constructor(name) {
    this.name = name;
  }

  logger () {
    console.log("Hello", this.name);
  }
}"#,
    r#"var Test = function () {
  function Test(name) {
    _classCallCheck(this, Test);

    this.name = name;
  }

  Test.prototype.logger = function logger() {
    console.log("Hello", this.name);
  };

  return Test;
}();"#
  );
}
