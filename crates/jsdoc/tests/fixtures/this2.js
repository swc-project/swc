/** @constructor */
function TemplateBuilder(templateType) {
    //** document me */
    //this.templateType = templateType;

    /** @constructor */
    this.Template = function() { // nested constructor of constructor TemplateFactory
        /** document me */
        this.render = function(data) {
            /** document me */
            this.rendered = true;
        }
    };

}