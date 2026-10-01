declare module "m" { import "n"; } var await = 1;
declare module "m" { import { X } from "n"; } var yield = 1;
declare module "m" { import X = require("n"); } var eval = 1;
declare module "m" { import type { X } from "n"; } var arguments = 1;
declare module "m" { import "n"; } function nested() { var await = 1; }
declare module "m" { namespace N { import "n"; } const await = 1; }
declare global { namespace N { import "n"; } } var await = 1;
namespace N { import X = M.X; } var await = 1;
declare module "m" { export { X }; } var await = 1;
declare module "m" {} var await = 1;
