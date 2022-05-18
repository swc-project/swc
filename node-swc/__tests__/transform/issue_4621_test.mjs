import swc from "../../..";
import { dirname, join } from "path";
import { platform } from "os";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

it("should auto-detect tsx", async () => {
    const filename = join(__dirname, '..', '..', 'tests', "issue-4621", '1', 'index.tsx');
    console.log(filename);
    const { code } = await swc.transformFile(filename, {
        jsc: {
            target: "es5",
            parser: {
                syntax: 'typescript'
            }
        },
    });
    expect(code).toMatchInlineSnapshot(`
        "function _arrayLikeToArray(arr, len) {
            if (len == null || len > arr.length) len = arr.length;
            for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
            return arr2;
        }
        function _arrayWithHoles(arr) {
            if (Array.isArray(arr)) return arr;
        }
        function _assertThisInitialized(self) {
            if (self === void 0) {
                throw new ReferenceError(\\"this hasn't been initialised - super() hasn't been called\\");
            }
            return self;
        }
        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError(\\"Cannot call a class as a function\\");
            }
        }
        function _decorate(decorators, factory, superClass) {
            var r = factory(function initialize(O) {
                _initializeInstanceElements(O, decorated.elements);
            }, superClass);
            var decorated1 = _decorateClass(_coalesceClassElements(r.d.map(_createElementDescriptor)), decorators);
            _initializeClassElements(r.F, decorated1.elements);
            return _runClassFinishers(r.F, decorated1.finishers);
        }
        function _createElementDescriptor(def) {
            var key = _toPropertyKey(def.key);
            var descriptor;
            if (def.kind === \\"method\\") {
                descriptor = {
                    value: def.value,
                    writable: true,
                    configurable: true,
                    enumerable: false
                };
                Object.defineProperty(def.value, \\"name\\", {
                    value: _typeof(key) === \\"symbol\\" ? \\"\\" : key,
                    configurable: true
                });
            } else if (def.kind === \\"get\\") {
                descriptor = {
                    get: def.value,
                    configurable: true,
                    enumerable: false
                };
            } else if (def.kind === \\"set\\") {
                descriptor = {
                    set: def.value,
                    configurable: true,
                    enumerable: false
                };
            } else if (def.kind === \\"field\\") {
                descriptor = {
                    configurable: true,
                    writable: true,
                    enumerable: true
                };
            }
            var element = {
                kind: def.kind === \\"field\\" ? \\"field\\" : \\"method\\",
                key: key,
                placement: def.static ? \\"static\\" : def.kind === \\"field\\" ? \\"own\\" : \\"prototype\\",
                descriptor: descriptor
            };
            if (def.decorators) element.decorators = def.decorators;
            if (def.kind === \\"field\\") element.initializer = def.value;
            return element;
        }
        function _coalesceGetterSetter(element, other) {
            if (element.descriptor.get !== undefined) {
                other.descriptor.get = element.descriptor.get;
            } else {
                other.descriptor.set = element.descriptor.set;
            }
        }
        function _coalesceClassElements(elements) {
            var newElements = [];
            var isSameElement = function isSameElement(other) {
                return other.kind === \\"method\\" && other.key === element.key && other.placement === element.placement;
            };
            for(var i = 0; i < elements.length; i++){
                var element1 = elements[i];
                var other1;
                if (element1.kind === \\"method\\" && (other1 = newElements.find(isSameElement))) {
                    if (_isDataDescriptor(element1.descriptor) || _isDataDescriptor(other1.descriptor)) {
                        if (_hasDecorators(element1) || _hasDecorators(other1)) {
                            throw new ReferenceError(\\"Duplicated methods (\\" + element1.key + \\") can't be decorated.\\");
                        }
                        other1.descriptor = element1.descriptor;
                    } else {
                        if (_hasDecorators(element1)) {
                            if (_hasDecorators(other1)) {
                                throw new ReferenceError(\\"Decorators can't be placed on different accessors with for \\" + \\"the same property (\\" + element1.key + \\").\\");
                            }
                            other1.decorators = element1.decorators;
                        }
                        _coalesceGetterSetter(element1, other1);
                    }
                } else {
                    newElements.push(element1);
                }
            }
            return newElements;
        }
        function _hasDecorators(element) {
            return element.decorators && element.decorators.length;
        }
        function _isDataDescriptor(desc) {
            return desc !== undefined && !(desc.value === undefined && desc.writable === undefined);
        }
        function _initializeClassElements(F, elements) {
            var proto = F.prototype;
            [
                \\"method\\",
                \\"field\\"
            ].forEach(function(kind) {
                elements.forEach(function(element) {
                    var placement = element.placement;
                    if (element.kind === kind && (placement === \\"static\\" || placement === \\"prototype\\")) {
                        var receiver = placement === \\"static\\" ? F : proto;
                        _defineClassElement(receiver, element);
                    }
                });
            });
        }
        function _initializeInstanceElements(O, elements) {
            [
                \\"method\\",
                \\"field\\"
            ].forEach(function(kind) {
                elements.forEach(function(element) {
                    if (element.kind === kind && element.placement === \\"own\\") {
                        _defineClassElement(O, element);
                    }
                });
            });
        }
        function _defineClassElement(receiver, element) {
            var descriptor = element.descriptor;
            if (element.kind === \\"field\\") {
                var initializer = element.initializer;
                descriptor = {
                    enumerable: descriptor.enumerable,
                    writable: descriptor.writable,
                    configurable: descriptor.configurable,
                    value: initializer === void 0 ? void 0 : initializer.call(receiver)
                };
            }
            Object.defineProperty(receiver, element.key, descriptor);
        }
        function _decorateClass(elements, decorators) {
            var newElements = [];
            var finishers = [];
            var placements = {
                static: [],
                prototype: [],
                own: []
            };
            elements.forEach(function(element) {
                _addElementPlacement(element, placements);
            });
            elements.forEach(function(element) {
                if (!_hasDecorators(element)) return newElements.push(element);
                var elementFinishersExtras = _decorateElement(element, placements);
                newElements.push(elementFinishersExtras.element);
                newElements.push.apply(newElements, elementFinishersExtras.extras);
                finishers.push.apply(finishers, elementFinishersExtras.finishers);
            });
            if (!decorators) {
                return {
                    elements: newElements,
                    finishers: finishers
                };
            }
            var result = _decorateConstructor(newElements, decorators);
            finishers.push.apply(finishers, result.finishers);
            result.finishers = finishers;
            return result;
        }
        function _addElementPlacement(element, placements, silent) {
            var keys = placements[element.placement];
            if (!silent && keys.indexOf(element.key) !== -1) {
                throw new TypeError(\\"Duplicated element (\\" + element.key + \\")\\");
            }
            keys.push(element.key);
        }
        function _decorateElement(element, placements) {
            var extras = [];
            var finishers = [];
            for(var decorators = element.decorators, i = decorators.length - 1; i >= 0; i--){
                var keys = placements[element.placement];
                keys.splice(keys.indexOf(element.key), 1);
                var elementObject = _fromElementDescriptor(element);
                var elementFinisherExtras = _toElementFinisherExtras((0, decorators[i])(elementObject) || elementObject);
                element = elementFinisherExtras.element;
                _addElementPlacement(element, placements);
                if (elementFinisherExtras.finisher) {
                    finishers.push(elementFinisherExtras.finisher);
                }
                var newExtras = elementFinisherExtras.extras;
                if (newExtras) {
                    for(var j = 0; j < newExtras.length; j++){
                        _addElementPlacement(newExtras[j], placements);
                    }
                    extras.push.apply(extras, newExtras);
                }
            }
            return {
                element: element,
                finishers: finishers,
                extras: extras
            };
        }
        function _decorateConstructor(elements, decorators) {
            var finishers = [];
            for(var i = decorators.length - 1; i >= 0; i--){
                var obj = _fromClassDescriptor(elements);
                var elementsAndFinisher = _toClassDescriptor((0, decorators[i])(obj) || obj);
                if (elementsAndFinisher.finisher !== undefined) {
                    finishers.push(elementsAndFinisher.finisher);
                }
                if (elementsAndFinisher.elements !== undefined) {
                    elements = elementsAndFinisher.elements;
                    for(var j = 0; j < elements.length - 1; j++){
                        for(var k = j + 1; k < elements.length; k++){
                            if (elements[j].key === elements[k].key && elements[j].placement === elements[k].placement) {
                                throw new TypeError(\\"Duplicated element (\\" + elements[j].key + \\")\\");
                            }
                        }
                    }
                }
            }
            return {
                elements: elements,
                finishers: finishers
            };
        }
        function _fromElementDescriptor(element) {
            var obj = {
                kind: element.kind,
                key: element.key,
                placement: element.placement,
                descriptor: element.descriptor
            };
            var desc = {
                value: \\"Descriptor\\",
                configurable: true
            };
            Object.defineProperty(obj, Symbol.toStringTag, desc);
            if (element.kind === \\"field\\") obj.initializer = element.initializer;
            return obj;
        }
        function _toElementDescriptors(elementObjects) {
            if (elementObjects === undefined) return;
            return _toArray(elementObjects).map(function(elementObject) {
                var element = _toElementDescriptor(elementObject);
                _disallowProperty(elementObject, \\"finisher\\", \\"An element descriptor\\");
                _disallowProperty(elementObject, \\"extras\\", \\"An element descriptor\\");
                return element;
            });
        }
        function _toElementDescriptor(elementObject) {
            var kind = String(elementObject.kind);
            if (kind !== \\"method\\" && kind !== \\"field\\") {
                throw new TypeError('An element descriptor\\\\'s .kind property must be either \\"method\\" or' + ' \\"field\\", but a decorator created an element descriptor with' + ' .kind \\"' + kind + '\\"');
            }
            var key = _toPropertyKey(elementObject.key);
            var placement = String(elementObject.placement);
            if (placement !== \\"static\\" && placement !== \\"prototype\\" && placement !== \\"own\\") {
                throw new TypeError('An element descriptor\\\\'s .placement property must be one of \\"static\\",' + ' \\"prototype\\" or \\"own\\", but a decorator created an element descriptor' + ' with .placement \\"' + placement + '\\"');
            }
            var descriptor = elementObject.descriptor;
            _disallowProperty(elementObject, \\"elements\\", \\"An element descriptor\\");
            var element = {
                kind: kind,
                key: key,
                placement: placement,
                descriptor: Object.assign({}, descriptor)
            };
            if (kind !== \\"field\\") {
                _disallowProperty(elementObject, \\"initializer\\", \\"A method descriptor\\");
            } else {
                _disallowProperty(descriptor, \\"get\\", \\"The property descriptor of a field descriptor\\");
                _disallowProperty(descriptor, \\"set\\", \\"The property descriptor of a field descriptor\\");
                _disallowProperty(descriptor, \\"value\\", \\"The property descriptor of a field descriptor\\");
                element.initializer = elementObject.initializer;
            }
            return element;
        }
        function _toElementFinisherExtras(elementObject) {
            var element = _toElementDescriptor(elementObject);
            var finisher = _optionalCallableProperty(elementObject, \\"finisher\\");
            var extras = _toElementDescriptors(elementObject.extras);
            return {
                element: element,
                finisher: finisher,
                extras: extras
            };
        }
        function _fromClassDescriptor(elements) {
            var obj = {
                kind: \\"class\\",
                elements: elements.map(_fromElementDescriptor)
            };
            var desc = {
                value: \\"Descriptor\\",
                configurable: true
            };
            Object.defineProperty(obj, Symbol.toStringTag, desc);
            return obj;
        }
        function _toClassDescriptor(obj) {
            var kind = String(obj.kind);
            if (kind !== \\"class\\") {
                throw new TypeError('A class descriptor\\\\'s .kind property must be \\"class\\", but a decorator' + ' created a class descriptor with .kind \\"' + kind + '\\"');
            }
            _disallowProperty(obj, \\"key\\", \\"A class descriptor\\");
            _disallowProperty(obj, \\"placement\\", \\"A class descriptor\\");
            _disallowProperty(obj, \\"descriptor\\", \\"A class descriptor\\");
            _disallowProperty(obj, \\"initializer\\", \\"A class descriptor\\");
            _disallowProperty(obj, \\"extras\\", \\"A class descriptor\\");
            var finisher = _optionalCallableProperty(obj, \\"finisher\\");
            var elements = _toElementDescriptors(obj.elements);
            return {
                elements: elements,
                finisher: finisher
            };
        }
        function _disallowProperty(obj, name, objectType) {
            if (obj[name] !== undefined) {
                throw new TypeError(objectType + \\" can't have a .\\" + name + \\" property.\\");
            }
        }
        function _optionalCallableProperty(obj, name) {
            var value = obj[name];
            if (value !== undefined && typeof value !== \\"function\\") {
                throw new TypeError(\\"Expected '\\" + name + \\"' to be a function\\");
            }
            return value;
        }
        function _runClassFinishers(constructor, finishers) {
            for(var i = 0; i < finishers.length; i++){
                var newConstructor = (0, finishers[i])(constructor);
                if (newConstructor !== undefined) {
                    if (typeof newConstructor !== \\"function\\") {
                        throw new TypeError(\\"Finishers must return a constructor.\\");
                    }
                    constructor = newConstructor;
                }
            }
            return constructor;
        }
        function _getPrototypeOf(o1) {
            _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
                return o.__proto__ || Object.getPrototypeOf(o);
            };
            return _getPrototypeOf(o1);
        }
        function _inherits(subClass, superClass) {
            if (typeof superClass !== \\"function\\" && superClass !== null) {
                throw new TypeError(\\"Super expression must either be null or a function\\");
            }
            subClass.prototype = Object.create(superClass && superClass.prototype, {
                constructor: {
                    value: subClass,
                    writable: true,
                    configurable: true
                }
            });
            if (superClass) _setPrototypeOf(subClass, superClass);
        }
        function _iterableToArray(iter) {
            if (typeof Symbol !== \\"undefined\\" && iter[Symbol.iterator] != null || iter[\\"@@iterator\\"] != null) return Array.from(iter);
        }
        function _nonIterableRest() {
            throw new TypeError(\\"Invalid attempt to destructure non-iterable instance.\\\\\\\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\\");
        }
        function _possibleConstructorReturn(self, call) {
            if (call && (_typeof(call) === \\"object\\" || typeof call === \\"function\\")) {
                return call;
            }
            return _assertThisInitialized(self);
        }
        function _setPrototypeOf(o2, p1) {
            _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
                o.__proto__ = p;
                return o;
            };
            return _setPrototypeOf(o2, p1);
        }
        function _toArray(arr) {
            return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
        }
        function _toPrimitive(input, hint) {
            if (_typeof(input) !== \\"object\\" || input === null) return input;
            var prim = input[Symbol.toPrimitive];
            if (prim !== undefined) {
                var res = prim.call(input, hint || \\"default\\");
                if (_typeof(res) !== \\"object\\") return res;
                throw new TypeError(\\"@@toPrimitive must return a primitive value.\\");
            }
            return (hint === \\"string\\" ? String : Number)(input);
        }
        function _toPropertyKey(arg) {
            var key = _toPrimitive(arg, \\"string\\");
            return _typeof(key) === \\"symbol\\" ? key : String(key);
        }
        var _typeof = function(obj) {
            \\"@swc/helpers - typeof\\";
            return obj && typeof Symbol !== \\"undefined\\" && obj.constructor === Symbol ? \\"symbol\\" : typeof obj;
        };
        function _unsupportedIterableToArray(o, minLen) {
            if (!o) return;
            if (typeof o === \\"string\\") return _arrayLikeToArray(o, minLen);
            var n = Object.prototype.toString.call(o).slice(8, -1);
            if (n === \\"Object\\" && o.constructor) n = o.constructor.name;
            if (n === \\"Map\\" || n === \\"Set\\") return Array.from(n);
            if (n === \\"Arguments\\" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
        }
        function _isNativeReflectConstruct() {
            if (typeof Reflect === \\"undefined\\" || !Reflect.construct) return false;
            if (Reflect.construct.sham) return false;
            if (typeof Proxy === \\"function\\") return true;
            try {
                Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
                return true;
            } catch (e) {
                return false;
            }
        }
        function _createSuper(Derived) {
            var hasNativeReflectConstruct = _isNativeReflectConstruct();
            return function _createSuperInternal() {
                var Super = _getPrototypeOf(Derived), result;
                if (hasNativeReflectConstruct) {
                    var NewTarget = _getPrototypeOf(this).constructor;
                    result = Reflect.construct(Super, arguments, NewTarget);
                } else {
                    result = Super.apply(this, arguments);
                }
                return _possibleConstructorReturn(this, result);
            };
        }
        import React from \\"react\\";
        import { connect } from \\"react-redux\\";
        var App = _decorate([
            connect(function(state) {
                return xxxx;
            })
        ], function(_initialize, _Component1) {
            var App = /*#__PURE__*/ function(_Component) {
                \\"use strict\\";
                _inherits(App, _Component);
                var _super = _createSuper(App);
                function App() {
                    _classCallCheck(this, App);
                    var _this;
                    _this = _super.apply(this, arguments);
                    _initialize(_assertThisInitialized(_this));
                    return _this;
                }
                return App;
            }(_Component1);
            return {
                F: App,
                d: []
            };
        }, React.Component);
        export default App;
        "
    `);
});
