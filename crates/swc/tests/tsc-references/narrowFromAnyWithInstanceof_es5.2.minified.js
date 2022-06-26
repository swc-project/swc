import _instanceof from "@swc/helpers/src/_instanceof.mjs";
_instanceof(x, Function) && (x(), x(1, 2, 3), x("hello!"), x.prop), _instanceof(x, Object) && (x.method(), x()), _instanceof(x, Error) && (x.message, x.mesage), _instanceof(x, Date) && (x.getDate(), x.getHuors());
