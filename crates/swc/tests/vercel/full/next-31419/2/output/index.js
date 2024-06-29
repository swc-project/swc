var e;
import { _ as r } from "@swc/helpers/_/_async_to_generator";
Promise.all(assignAll).then((e = r(function*(e) {
    for(let e in obj){
        let r = obj[e];
        r.id, (yield t(r.id)).forEach((e)=>{
            insertQuery += `INSERT INTO "TABLE"("UUID", id, other_ids_here) VALUES ('${uuidv4()}', '${r.id}', now());`;
        });
    }
}), function(r) {
    return e.apply(this, arguments);
}));
let t = function(e) {
    var t;
    return new Promise((t = r(function*(r, t) {
        let n = `Select Distinct id from "TABLE" Where id = '${e}' And user_id IS not null`;
        postgreSQL.query(n, null, function(e, n) {
            e ? t(e) : r(n.rows);
        });
    }), function(e, r) {
        return t.apply(this, arguments);
    }));
};
import "@swc/helpers/_/_async_to_generator";
export { t as listOfUser };
