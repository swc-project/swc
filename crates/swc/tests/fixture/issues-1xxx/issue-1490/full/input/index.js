"use strict";

class Element {
    getChildElements() {
        return this.childElements;
    }
}

class CanvasElement extends Element {
    createFacets(hidden) {
        const childElements = this.getChildElements();

        ///
    }
}

class ColouredCanvasElement extends CanvasElement {
    createFacets(hidden) {
        hidden = super.createFacets(hidden);  ///

        ///
    }
}

class ColouredSquare extends ColouredCanvasElement { }

const bugExample = () => {

    const colouredSquare = new ColouredSquare(),
        hidden = false;

    colouredSquare.createFacets(hidden);
}

bugExample()
