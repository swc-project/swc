//@jsx: react
//@module: amd
//@filename: react.d.ts
//@filename: file1.tsx
export class MyClass {
}
//@filename: file2.tsx
// Should not elide React import
import * as React from 'react';
import { MyClass } from './file1';
/*#__PURE__*/ React.createElement(MyClass, null);
