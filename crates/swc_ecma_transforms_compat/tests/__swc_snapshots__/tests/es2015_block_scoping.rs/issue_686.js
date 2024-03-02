module.exports = function(values) {
    var vars = [];
    var elem = null, name, val;
    for(var i = 0; i < this.elements.length; i++){
        elem = this.elements[i];
        name = elem.name;
        if (!name) continue;
        val = values[name];
        if (val == null) val = '';
        switch(elem.type){
            case 'submit':
                break;
            case 'radio':
            case 'checkbox':
                elem.checked = val.some(function(str) {
                    return str.toString() == elem.value;
                });
                break;
            case 'select-multiple':
                elem.fill(val);
                break;
            case 'textarea':
                elem.innerText = val;
                break;
            case 'hidden':
                break;
            default:
                if (elem.fill) {
                    elem.fill(val);
                } else {
                    elem.value = val;
                }
                break;
        }
    }
    return vars;
};
