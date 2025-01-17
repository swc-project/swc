import type * as Member from "some-path/my_module";
export interface IMember extends Member.C<"SimpleEntity"> {}

import type * as Ident from "some-path/my_module";
export interface IIdent extends Ident {}

import * as Paren from "some-path/my_module";
export class CParen extends Paren {}

import * as OptChain from "some-path/my_module";
export class COptChain extends OptChain?.C<"SimpleEntity"> {}
