//// [checkJsxChildrenProperty16.tsx]
/// <reference path="/.lib/react16.d.ts" />
// repro from #53493
export var Test = function() {
    return <>
      <Foo>{function(value) {}}</Foo>
      <Foo renderNumber>{function(value) {}}</Foo>

      <Foo children={function(value) {}}/>
      <Foo renderNumber children={function(value) {}}/>
    </>;
};
