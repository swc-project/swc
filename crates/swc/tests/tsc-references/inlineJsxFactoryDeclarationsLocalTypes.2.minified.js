//// [renderer.d.ts]
export { };
//// [renderer2.d.ts]
export { };
//// [component.tsx]
//! 
//!   x Spread children are not supported in React.
//!    ,----
//!  4 | export const MySFC = (props: {x: number, y: number, children?: predom.JSX.Element[]}) => <p>{props.x} + {props.y} = {props.x + props.y}{...this.props.children}</p>;
//!    :                                                                                                                                        ^^^^^^^^^^^^^^^^^^^^^^^^
//!    `----
//! 
//!   x Spread children are not supported in React.
//!     ,----
//!  12 | {...this.props.children}
//!     : ^^^^^^^^^^^^^^^^^^^^^^^^
//!     `----
//// [index.tsx]
//! 
//!   x Spread children are not supported in React.
//!     ,----
//!  13 | return <p>{this.props.x} + {this.props.y} = {this.props.x + this.props.y}{...this.props.children}</p>;
//!     :                                                                          ^^^^^^^^^^^^^^^^^^^^^^^^
//!     `----
