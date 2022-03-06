import * as swcHelpers from "@swc/helpers";
swcHelpers._instanceof(x, Function) && (x(), x(1, 2, 3), x("hello!"), x.prop), swcHelpers._instanceof(x, Object) && (x.method(), x()), swcHelpers._instanceof(x, Error) && (x.message, x.mesage), swcHelpers._instanceof(x, Date) && (x.getDate(), x.getHuors());
