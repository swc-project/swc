function createStandardXHR() {
    try {
        return new window.XMLHttpRequest();
    } catch (e) {
    }
}
function createActiveXHR() {
    try {
        return new window.ActiveXObject("Microsoft.XMLHTTP");
    } catch (e) {
    }
}
jQuery.ajaxSettings.xhr = window.ActiveXObject ? function() {
    return !this.isLocal && createStandardXHR() || createActiveXHR();
} : createStandardXHR;
