import * as a from "@swc/helpers";
Promise.all(assignAll).then(function(b) {
    var c = a.asyncToGenerator(function*(b) {
        let c = "DELETE FROM \"TABLE\" WHERE \"UUID\" IN ( ";
        for(let d in obj){
            let e = obj[d];
            c += `'${e.id}', `;
            let f = yield listOfUser(e.id);
            f.forEach((a)=>{
                insertQuery += `INSERT INTO "TABLE"("UUID", id, other_ids_here) VALUES ('${uuidv4()}', '${e.id}', now());`;
            });
        }
    });
    return function() {
        return c.apply(this, arguments);
    };
}());
export const listOfUser = function(b) {
    return new Promise(function(c, d) {
        var e = a.asyncToGenerator(function*(c, d) {
            const e = `Select Distinct id from "TABLE" Where id = '${b}' And user_id IS not null`;
            postgreSQL.query(e, null, function(a, b) {
                a ? (void 0)(a) : (void 0)(b.rows);
            });
        });
        return function() {
            return e.apply(this, arguments);
        };
    }());
};
