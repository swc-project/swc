//@filename: file2.tsx
// Should not elide React import
import * as React from 'react';
export class MyClass {
}
/*#__PURE__*/ React.createElement(MyClass, null);
