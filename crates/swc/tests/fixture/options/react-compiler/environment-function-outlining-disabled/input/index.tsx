import * as React from 'react';
function createFoo() {
  function Bar() {
    return 'Bar';
  }
  return function Foo() {
    'use memo';
    const renderBar = React.useCallback(() => {
      return <Bar />;
    }, []);

    return renderBar();
  }
}
