//!
//!  x the name `MyClass` is defined multiple times
//!    ,-[13:1]
//! 13 | export class MyClass { }
//!    :              ^^^|^^^
//!    :                 `-- previous definition of `MyClass` here
//! 14 | 
//! 15 | //@filename: file2.tsx
//! 16 | 
//! 17 | // Should not elide React import
//! 18 | import * as React from 'react';
//! 19 | import {MyClass} from './file1';
//!    :         ^^^|^^^
//!    :            `-- `MyClass` redefined here
//!    `----
