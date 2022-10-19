import Delta from 'quill-delta';
import { EmbedBlot, Scope } from 'parchment';
import Quill from '../core/quill';
import logger from '../core/logger';
import Module from '../core/module';
const debug = logger('quill:toolbar');
class Toolbar extends Module {
    constructor(quill, options){
        if (super(quill, options), Array.isArray(this.options.container)) {
            const container = document.createElement('div');
            addControls(container, this.options.container), quill.container.parentNode.insertBefore(container, quill.container), this.container = container;
        } else 'string' == typeof this.options.container ? this.container = document.querySelector(this.options.container) : this.container = this.options.container;
        if (!(this.container instanceof HTMLElement)) {
            debug.error('Container required for toolbar', this.options);
            return;
        }
        this.container.classList.add('ql-toolbar'), this.controls = [], this.handlers = {}, Object.keys(this.options.handlers).forEach((format)=>{
            this.addHandler(format, this.options.handlers[format]);
        }), Array.from(this.container.querySelectorAll('button, select')).forEach((input)=>{
            this.attach(input);
        }), this.quill.on(Quill.events.EDITOR_CHANGE, (type, range)=>{
            type === Quill.events.SELECTION_CHANGE && this.update(range);
        }), this.quill.on(Quill.events.SCROLL_OPTIMIZE, ()=>{
            const [range] = this.quill.selection.getRange();
            this.update(range);
        });
    }
    addHandler(format, handler) {
        this.handlers[format] = handler;
    }
    attach(input) {
        let format = Array.from(input.classList).find((className)=>0 === className.indexOf('ql-'));
        if (!format) return;
        if (format = format.slice(3), 'BUTTON' === input.tagName && input.setAttribute('type', 'button'), null == this.handlers[format] && null == this.quill.scroll.query(format)) {
            debug.warn('ignoring attaching to nonexistent format', format, input);
            return;
        }
        const eventName = 'SELECT' === input.tagName ? 'change' : 'click';
        input.addEventListener(eventName, (e)=>{
            let value;
            if ('SELECT' === input.tagName) {
                if (input.selectedIndex < 0) return;
                const selected = input.options[input.selectedIndex];
                value = !selected.hasAttribute('selected') && (selected.value || !1);
            } else value = !input.classList.contains('ql-active') && (input.value || !input.hasAttribute('value')), e.preventDefault();
            this.quill.focus();
            const [range] = this.quill.selection.getRange();
            if (null != this.handlers[format]) this.handlers[format].call(this, value);
            else if (this.quill.scroll.query(format).prototype instanceof EmbedBlot) {
                if (!(value = prompt(`Enter ${format}`))) return;
                this.quill.updateContents(new Delta().retain(range.index).delete(range.length).insert({
                    [format]: value
                }), Quill.sources.USER);
            } else this.quill.format(format, value, Quill.sources.USER);
            this.update(range);
        }), this.controls.push([
            format,
            input
        ]);
    }
    update(range) {
        const formats = null == range ? {} : this.quill.getFormat(range);
        this.controls.forEach((pair)=>{
            const [format, input] = pair;
            if ('SELECT' === input.tagName) {
                let option;
                if (null == range) option = null;
                else if (null == formats[format]) option = input.querySelector('option[selected]');
                else if (!Array.isArray(formats[format])) {
                    let value = formats[format];
                    'string' == typeof value && (value = value.replace(/"/g, '\\"')), option = input.querySelector(`option[value="${value}"]`);
                }
                null == option ? (input.value = '', input.selectedIndex = -1) : option.selected = !0;
            } else if (null == range) input.classList.remove('ql-active');
            else if (input.hasAttribute('value')) {
                const isActive = formats[format] === input.getAttribute('value') || null != formats[format] && formats[format].toString() === input.getAttribute('value') || null == formats[format] && !input.getAttribute('value');
                input.classList.toggle('ql-active', isActive);
            } else input.classList.toggle('ql-active', null != formats[format]);
        });
    }
}
function addButton(container, format, value) {
    const input = document.createElement('button');
    input.setAttribute('type', 'button'), input.classList.add(`ql-${format}`), null != value && (input.value = value), container.appendChild(input);
}
function addControls(container, groups) {
    Array.isArray(groups[0]) || (groups = [
        groups
    ]), groups.forEach((controls)=>{
        const group = document.createElement('span');
        group.classList.add('ql-formats'), controls.forEach((control)=>{
            if ('string' == typeof control) addButton(group, control);
            else {
                const format = Object.keys(control)[0], value = control[format];
                Array.isArray(value) ? function(container, format, values) {
                    const input = document.createElement('select');
                    input.classList.add(`ql-${format}`), values.forEach((value)=>{
                        const option = document.createElement('option');
                        !1 !== value ? option.setAttribute('value', value) : option.setAttribute('selected', 'selected'), input.appendChild(option);
                    }), container.appendChild(input);
                }(group, format, value) : addButton(group, format, value);
            }
        }), container.appendChild(group);
    });
}
Toolbar.DEFAULTS = {}, Toolbar.DEFAULTS = {
    container: null,
    handlers: {
        clean () {
            const range = this.quill.getSelection();
            if (null != range) {
                if (0 === range.length) {
                    const formats = this.quill.getFormat();
                    Object.keys(formats).forEach((name)=>{
                        null != this.quill.scroll.query(name, Scope.INLINE) && this.quill.format(name, !1, Quill.sources.USER);
                    });
                } else this.quill.removeFormat(range, Quill.sources.USER);
            }
        },
        direction (value) {
            const { align  } = this.quill.getFormat();
            'rtl' === value && null == align ? this.quill.format('align', 'right', Quill.sources.USER) : value || 'right' !== align || this.quill.format('align', !1, Quill.sources.USER), this.quill.format('direction', value, Quill.sources.USER);
        },
        indent (value) {
            const range = this.quill.getSelection(), formats = this.quill.getFormat(range), indent = parseInt(formats.indent || 0, 10);
            if ('+1' === value || '-1' === value) {
                let modifier = '+1' === value ? 1 : -1;
                'rtl' === formats.direction && (modifier *= -1), this.quill.format('indent', indent + modifier, Quill.sources.USER);
            }
        },
        link (value) {
            !0 === value && (value = prompt('Enter link URL:')), this.quill.format('link', value, Quill.sources.USER);
        },
        list (value) {
            const range = this.quill.getSelection(), formats = this.quill.getFormat(range);
            'check' === value ? 'checked' === formats.list || 'unchecked' === formats.list ? this.quill.format('list', !1, Quill.sources.USER) : this.quill.format('list', 'unchecked', Quill.sources.USER) : this.quill.format('list', value, Quill.sources.USER);
        }
    }
};
export { Toolbar as default, addControls };
