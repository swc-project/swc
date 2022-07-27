//!
//!  x the name `React` is defined multiple times
//!    ,-[13:1]
//! 13 | export var React;
//!    :            ^^|^^
//!    :              `-- previous definition of `React` here
//! 14 | 
//! 15 | //@filename: react-consumer.tsx
//! 16 | import {React} from "./test";
//!    :         ^^|^^
//!    :           `-- `React` redefined here
//!    `----
