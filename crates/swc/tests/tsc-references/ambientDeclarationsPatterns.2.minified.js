//// [declarations.d.ts]
//// [user.ts]
///<reference path="declarations.d.ts" />
import { foo, baz } from "foobarbaz";
foo(baz);
import { foos } from "foosball";
foo(foos);
// Works with relative file name
import fileText from "./file!text";
foo(fileText);
