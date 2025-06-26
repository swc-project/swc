//// [checkJsxChildrenProperty16.tsx]
export var Test = function() {
    return <>
      <Foo>{function(value) {}}</Foo>
      <Foo renderNumber>{function(value) {}}</Foo>

      <Foo children={function(value) {}}/>
      <Foo renderNumber children={function(value) {}}/>
    </>;
};
