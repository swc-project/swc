// @Filename: declarations.d.ts
// @Filename: user.ts
///<reference path="declarations.d.ts" />
import { foo, baz } from "foobarbaz";
import { foos } from "foosball";
// Works with relative file name
import fileText from "./file!text";
foo(baz);
foo(foos);
foo(fileText);
