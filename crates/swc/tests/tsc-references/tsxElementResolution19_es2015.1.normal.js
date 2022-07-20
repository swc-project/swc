//@jsx: react
//@module: amd
//@filename: react.d.ts
export class MyClass {
}
//@filename: file2.tsx
// Should not elide React import
import * as React from 'react';
/*#__PURE__*/ React.createElement(MyClass, null);
