import * as React from 'react';

export function Counter() {
  'use memo';
  // This callback captures no local variables (only the `console` global), so
  // it is safe to outline into a top-level helper when outlining is enabled.
  const onClick = React.useCallback(() => {
    console.log('clicked');
  }, []);

  return <button onClick={onClick} />;
}
