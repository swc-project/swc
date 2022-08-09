export { };
export { };
// @filename: component.tsx
//!
//!  x Spread children are not supported in React.
//!   ,----
//! 5 | export const MySFC = (props: {x: number, y: number, children?: predom.JSX.Element[]}) => <p>{props.x} + {props.y} = {props.x + props.y}{...this.props.children}</p>;
//!   :                                                                                                                                        ^^^^^^^^^^^^^^^^^^^^^^^^
//!   `----
//!
//!  x Spread children are not supported in React.
//!    ,----
//! 13 | {...this.props.children}
//!    : ^^^^^^^^^^^^^^^^^^^^^^^^
//!    `----
// @filename: index.tsx
//!
//!  x Spread children are not supported in React.
//!    ,----
//! 14 | return <p>{this.props.x} + {this.props.y} = {this.props.x + this.props.y}{...this.props.children}</p>;
//!    :                                                                          ^^^^^^^^^^^^^^^^^^^^^^^^
//!    `----
