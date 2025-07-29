//// [component.d.ts]
import * as React from "react";
//// [file.jsx]
import { MyComp } from "./component";
var x = <MyComp a={10} b="hi"/>; // error, no type arguments in js
