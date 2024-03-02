var r;
import { _ as e } from "@swc/helpers/_/_async_to_generator";
import { _ as t } from "@swc/helpers/_/_ts_generator";
import { _ as n } from "@swc/helpers/_/_ts_values";
Promise.all(assignAll).then((r = e(function(r) {
    var e, s, i, c, o, a;
    return t(this, function(u) {
        switch(u.label){
            case 0:
                for(c in e = function(e) {
                    var n;
                    return t(this, function(t) {
                        switch(t.label){
                            case 0:
                                return n = r[e], s += "'".concat(n.id, "', "), [
                                    4,
                                    listOfUser(n.id)
                                ];
                            case 1:
                                return t.sent().forEach(function(r) {
                                    insertQuery += 'INSERT INTO "TABLE"("UUID", id, other_ids_here) VALUES (\''.concat(uuidv4(), "', '").concat(n.id, "', now());");
                                }), [
                                    2
                                ];
                        }
                    });
                }, s = 'DELETE FROM "TABLE" WHERE "UUID" IN ( ', i = [], r)i.push(c);
                o = 0, u.label = 1;
            case 1:
                if (!(o < i.length)) return [
                    3,
                    4
                ];
                return a = i[o], [
                    5,
                    n(e(a))
                ];
            case 2:
                u.sent(), u.label = 3;
            case 3:
                return o++, [
                    3,
                    1
                ];
            case 4:
                return [
                    2
                ];
        }
    });
}), function(e) {
    return r.apply(this, arguments);
}));
export var listOfUser = function(r) {
    var n;
    return new Promise((n = e(function(e, n) {
        var s;
        return t(this, function(t) {
            return s = 'Select Distinct id from "TABLE" Where id = \''.concat(r, "' And user_id IS not null"), postgreSQL.query(s, null, function(r, t) {
                r ? n(r) : e(t.rows);
            }), [
                2
            ];
        });
    }), function(r, e) {
        return n.apply(this, arguments);
    }));
};
