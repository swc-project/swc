use swc_common::{comments::NoopComments, pass::Optional, Mark};
use swc_ecma_ast::Pass;
use swc_ecma_parser::{Syntax, TsSyntax};
use swc_ecma_transforms_base::resolver;
use swc_ecma_transforms_compat::class_fields_use_set::class_fields_use_set;
use swc_ecma_transforms_proposal::decorators;
use swc_ecma_transforms_react::jsx;
use swc_ecma_transforms_testing::{test_exec, Tester};
use swc_ecma_transforms_typescript::typescript;

fn tr(t: &mut Tester) -> impl Pass {
    tr_config(t, None, None, false)
}

fn tr_config(
    t: &mut Tester,
    config: Option<typescript::Config>,
    decorators_config: Option<decorators::Config>,
    use_define_for_class_fields: bool,
) -> impl Pass {
    let unresolved_mark = Mark::new();
    let top_level_mark = Mark::new();
    let has_decorators = decorators_config.is_some();
    let config = config.unwrap_or_else(|| typescript::Config {
        no_empty_export: true,
        ..Default::default()
    });

    (
        Optional::new(
            decorators(decorators_config.unwrap_or_default()),
            has_decorators,
        ),
        resolver(unresolved_mark, top_level_mark, true),
        typescript(config, unresolved_mark, top_level_mark),
        jsx(
            t.cm.clone(),
            None::<NoopComments>,
            Default::default(),
            top_level_mark,
            unresolved_mark,
        ),
        Optional::new(class_fields_use_set(true), !use_define_for_class_fields),
    )
}

test_exec!(
    Syntax::Typescript(TsSyntax {
        decorators: true,
        ..Default::default()
    }),
    |t| (
        decorators(decorators::Config {
            legacy: true,
            ..Default::default()
        }),
        tr(t)
    ),
    issue_960_2,
    "function DefineAction() { return function(_a, _b, c) { return c } }

    class Base {
      constructor() {
        this.action = 1
      }
    }

    class Child extends Base {
      @DefineAction() declare action: number

      callApi() {
        console.log(this.action) // undefined
        return this.action
      }
    }

    const c = new Child()

    c.callApi()
    expect(c.callApi()).not.toBe(undefined)
    expect(c.action).toBe(1);
    "
);
