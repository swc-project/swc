/* 1.1 L import */ import('test') /* 1.2 T import*/;

/* 2.1 L import */ import /* 2.2 L string */ (/* 2.3 L string */ 'test' /* 2.4 T string */) /* 2.5 T import */;

/* 3.1 L import */ import Foo from 'Bar'; /* 3.2 T import */

/* 4.1 L import */ import { /* 4.2 L id */ Foo /* 4.3 T id */ as /* 4.4 L id */ Bar /* 4.5 T id */ } from /* 4.6 L lit */ 'Baz' /* 4.7 T lit */; /* 4.8 T import */

/* 5.1 L import */ import * as /* 5.2 L id */ Foo /* 5.3 T id */ from /* 5.4 L lit */ 'Bar' /* 5.5 T lit */; /* 5.6 T import */

import 'source' /* 6.1 T string lit */

import Foo from 'source' /* 7.1 T string lit */

import {Foo} from 'source' /* 8.1 T string lit */
