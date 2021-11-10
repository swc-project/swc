const one_name = "PASS";
var get_one = () => {
    if (one_name) return one_name;
};
{
    let one_name = get_one();
    console.log(one_name);
}
