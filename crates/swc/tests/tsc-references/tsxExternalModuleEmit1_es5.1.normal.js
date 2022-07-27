//!
//!  x the name `React` is defined multiple times
//!    ,-[10:1]
//! 10 | import * as React from 'react';
//!    :             ^^|^^
//!    :               `-- previous definition of `React` here
//! 11 | 
//! 12 | // Should see var button_1 = require('./button') here
//! 13 | import { Button } from './button';
//! 14 | 
//! 15 | export class App extends React.Component<any, any> {
//! 16 | 
//! 17 |     render() {
//! 18 |         return <Button />;
//! 19 |     }
//! 20 | 
//! 21 | }
//! 22 | 
//! 23 | //@filename: button.tsx
//! 24 | import * as React from 'react';
//!    :             ^^|^^
//!    :               `-- `React` redefined here
//!    `----
//!
//!  x the name `Button` is defined multiple times
//!    ,-[13:1]
//! 13 | import { Button } from './button';
//!    :          ^^^|^^
//!    :             `-- previous definition of `Button` here
//! 14 | 
//! 15 | export class App extends React.Component<any, any> {
//! 16 | 
//! 17 |     render() {
//! 18 |         return <Button />;
//! 19 |     }
//! 20 | 
//! 21 | }
//! 22 | 
//! 23 | //@filename: button.tsx
//! 24 | import * as React from 'react';
//! 25 | 
//! 26 | export class Button extends React.Component<any, any> {
//!    :              ^^^|^^
//!    :                 `-- `Button` redefined here
//!    `----
