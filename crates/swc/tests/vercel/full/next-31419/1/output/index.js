import { _ as r } from "@swc/helpers/_/_async_to_generator";
import { _ as e } from "@swc/helpers/_/_ts_generator";
import { _ as t } from "@swc/helpers/_/_ts_values";
Promise.all(assignAll).then((n = r(function(r) {
    var n, i, o, c, a, u;
    return e(this, function(l) {
        switch(l.label){
            case 0:
                for(c in n = function(t) {
                    var n;
                    return e(this, function(e) {
                        switch(e.label){
                            case 0:
                                return n = r[t], i += "'".concat(n.id, "', "), [
                                    4,
                                    s(n.id)
                                ];
                            case 1:
                                return e.sent().forEach(function(r) {
                                    insertQuery += 'INSERT INTO "TABLE"("UUID", id, other_ids_here) VALUES (\''.concat(uuidv4(), "', '").concat(n.id, "', now());");
                                }), [
                                    2
                                ];
                        }
                    });
                }, i = 'DELETE FROM "TABLE" WHERE "UUID" IN ( ', o = [], r)o.push(c);
                a = 0, l.label = 1;
            case 1:
                if (!(a < o.length)) return [
                    3,
                    4
                ];
                return u = o[a], [
                    5,
                    t(n(u))
                ];
            case 2:
                l.sent(), l.label = 3;
            case 3:
                return a++, [
                    3,
                    1
                ];
            case 4:
                return [
                    2
                ];
        }
    });
}), function(r) {
    return n.apply(this, arguments);
}));
var n, s = function(t) {
    var n;
    return new Promise((n = r(function(r, n) {
        var s;
        return e(this, function(e) {
            return s = 'Select Distinct id from "TABLE" Where id = \''.concat(t, "' And user_id IS not null"), postgreSQL.query(s, null, function(e, t) {
                e ? n(e) : r(t.rows);
            }), [
                2
            ];
        });
    }), function(r, e) {
        return n.apply(this, arguments);
    }));
};
import "@swc/helpers/_/_async_to_generator";
import "@swc/helpers/_/_ts_generator";
import "@swc/helpers/_/_ts_values";
export { s as listOfUser };
