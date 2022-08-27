//// [renderer.d.ts]
export { };
//// [renderer2.d.ts]
export { };
//// [component.tsx]
//! 
//!   x Expected a semicolon
//!    ,----
//!  4 | export const MySFC = (props: {x: number, y: number, children?: predom.JSX.Element[]}) => <p>{props.x} + {props.y} = {props.x + props.y}{...this.props.children}</p>;
//!    :                                                                                                   ^
//!    `----
//! 
//!   x Expected ',', got '.'
//!    ,----
//!  4 | export const MySFC = (props: {x: number, y: number, children?: predom.JSX.Element[]}) => <p>{props.x} + {props.y} = {props.x + props.y}{...this.props.children}</p>;
//!    :                                                                                                   ^
//!    `----
//// [index.tsx]
//! 
//!   x Unexpected token `regexp literal (h>; , )`. Expected an identifier, void, yield, null, await, break, a string literal, a numeric literal, true, false, `, -, import, this, typeof, {, [, (
//!    ,----
//!  5 | elem = <h></h>; // Expect assignability error here
//!    :            ^^^^^^
//!    `----
