function work() {
    console.log("run");
}
const tag = "metadata";
const candidate_run = ()=>work(), candidate_objectMeta_value = tag, candidate_arrayMeta = [
    tag
], candidate_negatedMeta = !tag;
candidate_run();
console.log(candidate_objectMeta_value);
console.log(candidate_arrayMeta[0]);
console.log(candidate_negatedMeta);
