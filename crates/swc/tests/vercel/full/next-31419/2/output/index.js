import { _ as n } from "@swc/helpers/_/_async_to_generator";
Promise.all(assignAll).then(function() {
    var r = n(function*(n) {
        for(let n in obj){
            let r = obj[n];
            r.id, (yield listOfUser(r.id)).forEach((n)=>{
                insertQuery += `INSERT INTO "TABLE"("UUID", id, other_ids_here) VALUES ('${uuidv4()}', '${r.id}', now());`;
            });
        }
    });
    return function(n) {
        return r.apply(this, arguments);
    };
}());
export const listOfUser = function(r) {
    var e;
    return new Promise((e = n(function*(n, e) {
        let t = `Select Distinct id from "TABLE" Where id = '${r}' And user_id IS not null`;
        postgreSQL.query(t, null, function(r, t) {
            r ? e(r) : n(t.rows);
        });
    }), function(n, r) {
        return e.apply(this, arguments);
    }));
};
