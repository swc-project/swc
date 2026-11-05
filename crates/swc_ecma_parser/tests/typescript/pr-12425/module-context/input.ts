declare module "m" { import type { X } from "n"; } var await = 1;
declare module "m" { import { X } from "n"; } var eval = 1;
declare module "m" { import "n"; } var yield = 1;
declare module "m" { import X = require("n"); } var arguments = 1;
declare module "m" { namespace N { import type { X } from "n"; } const await = 1; }
namespace N { import type { X } from "n"; } var await = 1;
declare global { import type { X } from "n"; } var eval = 1;
declare module "m" { import "n"; }"\8";
