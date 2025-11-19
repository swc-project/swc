/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/ import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _instanceof } from "@swc/helpers/_/_instanceof";
import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
import { _ as _type_of } from "@swc/helpers/_/_type_of";
import { groupBy } from '../../../base/common/arrays.js';
import { dispose } from '../../../base/common/lifecycle.js';
import { getLeadingWhitespace } from '../../../base/common/strings.js';
import './snippetSession.css';
import { EditOperation } from '../../common/core/editOperation.js';
import { Range } from '../../common/core/range.js';
import { Selection } from '../../common/core/selection.js';
import { ModelDecorationOptions } from '../../common/model/textModel.js';
import { ILabelService } from '../../../platform/label/common/label.js';
import { IWorkspaceContextService } from '../../../platform/workspace/common/workspace.js';
import { Choice, Placeholder, SnippetParser, Text } from './snippetParser.js';
import { ClipboardBasedVariableResolver, CommentBasedVariableResolver, CompositeSnippetVariableResolver, ModelBasedVariableResolver, RandomBasedVariableResolver, SelectionBasedVariableResolver, TimeBasedVariableResolver, WorkspaceBasedVariableResolver } from './snippetVariables.js';
export var OneSnippet = /*#__PURE__*/ function() {
    "use strict";
    function OneSnippet(_editor, _snippet, _offset, _snippetLineLeadingWhitespace) {
        _class_call_check(this, OneSnippet);
        this._editor = _editor;
        this._snippet = _snippet;
        this._offset = _offset;
        this._snippetLineLeadingWhitespace = _snippetLineLeadingWhitespace;
        this._nestingLevel = 1;
        this._placeholderGroups = groupBy(_snippet.placeholders, Placeholder.compareByIndex);
        this._placeholderGroupsIdx = -1;
    }
    _create_class(OneSnippet, [
        {
            key: "dispose",
            value: function dispose() {
                if (this._placeholderDecorations) {
                    this._editor.deltaDecorations(_to_consumable_array(this._placeholderDecorations.values()), []);
                }
                this._placeholderGroups.length = 0;
            }
        },
        {
            key: "_initDecorations",
            value: function _initDecorations() {
                var _this = this;
                if (this._placeholderDecorations) {
                    // already initialized
                    return;
                }
                this._placeholderDecorations = new Map();
                var model = this._editor.getModel();
                this._editor.changeDecorations(function(accessor) {
                    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    try {
                        // create a decoration for each placeholder
                        for(var _iterator = _this._snippet.placeholders[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                            var placeholder = _step.value;
                            var placeholderOffset = _this._snippet.offset(placeholder);
                            var placeholderLen = _this._snippet.fullLen(placeholder);
                            var range = Range.fromPositions(model.getPositionAt(_this._offset + placeholderOffset), model.getPositionAt(_this._offset + placeholderOffset + placeholderLen));
                            var options = placeholder.isFinalTabstop ? OneSnippet._decor.inactiveFinal : OneSnippet._decor.inactive;
                            var handle = accessor.addDecoration(range, options);
                            _this._placeholderDecorations.set(placeholder, handle);
                        }
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally{
                        try {
                            if (!_iteratorNormalCompletion && _iterator.return != null) {
                                _iterator.return();
                            }
                        } finally{
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }
                });
            }
        },
        {
            key: "move",
            value: function move(fwd) {
                var _this = this;
                if (!this._editor.hasModel()) {
                    return [];
                }
                this._initDecorations();
                // Transform placeholder text if necessary
                if (this._placeholderGroupsIdx >= 0) {
                    var operations = [];
                    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    try {
                        for(var _iterator = this._placeholderGroups[this._placeholderGroupsIdx][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                            var placeholder = _step.value;
                            // Check if the placeholder has a transformation
                            if (placeholder.transform) {
                                var id = this._placeholderDecorations.get(placeholder);
                                var range = this._editor.getModel().getDecorationRange(id);
                                var currentValue = this._editor.getModel().getValueInRange(range);
                                var transformedValueLines = placeholder.transform.resolve(currentValue).split(/\r\n|\r|\n/);
                                // fix indentation for transformed lines
                                for(var i = 1; i < transformedValueLines.length; i++){
                                    transformedValueLines[i] = this._editor.getModel().normalizeIndentation(this._snippetLineLeadingWhitespace + transformedValueLines[i]);
                                }
                                operations.push(EditOperation.replace(range, transformedValueLines.join(this._editor.getModel().getEOL())));
                            }
                        }
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally{
                        try {
                            if (!_iteratorNormalCompletion && _iterator.return != null) {
                                _iterator.return();
                            }
                        } finally{
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }
                    if (operations.length > 0) {
                        this._editor.executeEdits('snippet.placeholderTransform', operations);
                    }
                }
                var couldSkipThisPlaceholder = false;
                if (fwd === true && this._placeholderGroupsIdx < this._placeholderGroups.length - 1) {
                    this._placeholderGroupsIdx += 1;
                    couldSkipThisPlaceholder = true;
                } else if (fwd === false && this._placeholderGroupsIdx > 0) {
                    this._placeholderGroupsIdx -= 1;
                    couldSkipThisPlaceholder = true;
                } else {
                // the selection of the current placeholder might
                // not acurate any more -> simply restore it
                }
                var newSelections = this._editor.getModel().changeDecorations(function(accessor) {
                    var activePlaceholders = new Set();
                    // change stickiness to always grow when typing at its edges
                    // because these decorations represent the currently active
                    // tabstop.
                    // Special case #1: reaching the final tabstop
                    // Special case #2: placeholders enclosing active placeholders
                    var selections = [];
                    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    try {
                        for(var _iterator = _this._placeholderGroups[_this._placeholderGroupsIdx][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                            var placeholder = _step.value;
                            var id = _this._placeholderDecorations.get(placeholder);
                            var range = _this._editor.getModel().getDecorationRange(id);
                            selections.push(new Selection(range.startLineNumber, range.startColumn, range.endLineNumber, range.endColumn));
                            // consider to skip this placeholder index when the decoration
                            // range is empty but when the placeholder wasn't. that's a strong
                            // hint that the placeholder has been deleted. (all placeholder must match this)
                            couldSkipThisPlaceholder = couldSkipThisPlaceholder && _this._hasPlaceholderBeenCollapsed(placeholder);
                            accessor.changeDecorationOptions(id, placeholder.isFinalTabstop ? OneSnippet._decor.activeFinal : OneSnippet._decor.active);
                            activePlaceholders.add(placeholder);
                            var _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;
                            try {
                                for(var _iterator1 = _this._snippet.enclosingPlaceholders(placeholder)[Symbol.iterator](), _step1; !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true){
                                    var enclosingPlaceholder = _step1.value;
                                    var id1 = _this._placeholderDecorations.get(enclosingPlaceholder);
                                    accessor.changeDecorationOptions(id1, enclosingPlaceholder.isFinalTabstop ? OneSnippet._decor.activeFinal : OneSnippet._decor.active);
                                    activePlaceholders.add(enclosingPlaceholder);
                                }
                            } catch (err) {
                                _didIteratorError1 = true;
                                _iteratorError1 = err;
                            } finally{
                                try {
                                    if (!_iteratorNormalCompletion1 && _iterator1.return != null) {
                                        _iterator1.return();
                                    }
                                } finally{
                                    if (_didIteratorError1) {
                                        throw _iteratorError1;
                                    }
                                }
                            }
                        }
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally{
                        try {
                            if (!_iteratorNormalCompletion && _iterator.return != null) {
                                _iterator.return();
                            }
                        } finally{
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }
                    var _iteratorNormalCompletion2 = true, _didIteratorError2 = false, _iteratorError2 = undefined;
                    try {
                        // change stickness to never grow when typing at its edges
                        // so that in-active tabstops never grow
                        for(var _iterator2 = _this._placeholderDecorations[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true){
                            var _step_value = _sliced_to_array(_step2.value, 2), placeholder1 = _step_value[0], id2 = _step_value[1];
                            if (!activePlaceholders.has(placeholder1)) {
                                accessor.changeDecorationOptions(id2, placeholder1.isFinalTabstop ? OneSnippet._decor.inactiveFinal : OneSnippet._decor.inactive);
                            }
                        }
                    } catch (err) {
                        _didIteratorError2 = true;
                        _iteratorError2 = err;
                    } finally{
                        try {
                            if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                                _iterator2.return();
                            }
                        } finally{
                            if (_didIteratorError2) {
                                throw _iteratorError2;
                            }
                        }
                    }
                    return selections;
                });
                return !couldSkipThisPlaceholder ? newSelections !== null && newSelections !== void 0 ? newSelections : [] : this.move(fwd);
            }
        },
        {
            key: "_hasPlaceholderBeenCollapsed",
            value: function _hasPlaceholderBeenCollapsed(placeholder) {
                // A placeholder is empty when it wasn't empty when authored but
                // when its tracking decoration is empty. This also applies to all
                // potential parent placeholders
                var marker = placeholder;
                while(marker){
                    if (_instanceof(marker, Placeholder)) {
                        var id = this._placeholderDecorations.get(marker);
                        var range = this._editor.getModel().getDecorationRange(id);
                        if (range.isEmpty() && marker.toString().length > 0) {
                            return true;
                        }
                    }
                    marker = marker.parent;
                }
                return false;
            }
        },
        {
            key: "isAtFirstPlaceholder",
            get: function get() {
                return this._placeholderGroupsIdx <= 0 || this._placeholderGroups.length === 0;
            }
        },
        {
            key: "isAtLastPlaceholder",
            get: function get() {
                return this._placeholderGroupsIdx === this._placeholderGroups.length - 1;
            }
        },
        {
            key: "hasPlaceholder",
            get: function get() {
                return this._snippet.placeholders.length > 0;
            }
        },
        {
            key: "computePossibleSelections",
            value: function computePossibleSelections() {
                var result = new Map();
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    for(var _iterator = this._placeholderGroups[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var placeholdersWithEqualIndex = _step.value;
                        var ranges = void 0;
                        var _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;
                        try {
                            for(var _iterator1 = placeholdersWithEqualIndex[Symbol.iterator](), _step1; !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true){
                                var placeholder = _step1.value;
                                if (placeholder.isFinalTabstop) {
                                    break;
                                }
                                if (!ranges) {
                                    ranges = [];
                                    result.set(placeholder.index, ranges);
                                }
                                var id = this._placeholderDecorations.get(placeholder);
                                var range = this._editor.getModel().getDecorationRange(id);
                                if (!range) {
                                    // one of the placeholder lost its decoration and
                                    // therefore we bail out and pretend the placeholder
                                    // (with its mirrors) doesn't exist anymore.
                                    result.delete(placeholder.index);
                                    break;
                                }
                                ranges.push(range);
                            }
                        } catch (err) {
                            _didIteratorError1 = true;
                            _iteratorError1 = err;
                        } finally{
                            try {
                                if (!_iteratorNormalCompletion1 && _iterator1.return != null) {
                                    _iterator1.return();
                                }
                            } finally{
                                if (_didIteratorError1) {
                                    throw _iteratorError1;
                                }
                            }
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
                return result;
            }
        },
        {
            key: "choice",
            get: function get() {
                return this._placeholderGroups[this._placeholderGroupsIdx][0].choice;
            }
        },
        {
            key: "merge",
            value: function merge(others) {
                var _this = this;
                var model = this._editor.getModel();
                this._nestingLevel *= 10;
                this._editor.changeDecorations(function(accessor) {
                    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    try {
                        // For each active placeholder take one snippet and merge it
                        // in that the placeholder (can be many for `$1foo$1foo`). Because
                        // everything is sorted by editor selection we can simply remove
                        // elements from the beginning of the array
                        for(var _iterator = _this._placeholderGroups[_this._placeholderGroupsIdx][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                            var placeholder = _step.value;
                            var nested = others.shift();
                            console.assert(!nested._placeholderDecorations);
                            // Massage placeholder-indicies of the nested snippet to be
                            // sorted right after the insertion point. This ensures we move
                            // through the placeholders in the correct order
                            var indexLastPlaceholder = nested._snippet.placeholderInfo.last.index;
                            var _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;
                            try {
                                for(var _iterator1 = nested._snippet.placeholderInfo.all[Symbol.iterator](), _step1; !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true){
                                    var nestedPlaceholder = _step1.value;
                                    if (nestedPlaceholder.isFinalTabstop) {
                                        nestedPlaceholder.index = placeholder.index + (indexLastPlaceholder + 1) / _this._nestingLevel;
                                    } else {
                                        nestedPlaceholder.index = placeholder.index + nestedPlaceholder.index / _this._nestingLevel;
                                    }
                                }
                            } catch (err) {
                                _didIteratorError1 = true;
                                _iteratorError1 = err;
                            } finally{
                                try {
                                    if (!_iteratorNormalCompletion1 && _iterator1.return != null) {
                                        _iterator1.return();
                                    }
                                } finally{
                                    if (_didIteratorError1) {
                                        throw _iteratorError1;
                                    }
                                }
                            }
                            _this._snippet.replace(placeholder, nested._snippet.children);
                            // Remove the placeholder at which position are inserting
                            // the snippet and also remove its decoration.
                            var id = _this._placeholderDecorations.get(placeholder);
                            accessor.removeDecoration(id);
                            _this._placeholderDecorations.delete(placeholder);
                            var _iteratorNormalCompletion2 = true, _didIteratorError2 = false, _iteratorError2 = undefined;
                            try {
                                // For each *new* placeholder we create decoration to monitor
                                // how and if it grows/shrinks.
                                for(var _iterator2 = nested._snippet.placeholders[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true){
                                    var placeholder1 = _step2.value;
                                    var placeholderOffset = nested._snippet.offset(placeholder1);
                                    var placeholderLen = nested._snippet.fullLen(placeholder1);
                                    var range = Range.fromPositions(model.getPositionAt(nested._offset + placeholderOffset), model.getPositionAt(nested._offset + placeholderOffset + placeholderLen));
                                    var handle = accessor.addDecoration(range, OneSnippet._decor.inactive);
                                    _this._placeholderDecorations.set(placeholder1, handle);
                                }
                            } catch (err) {
                                _didIteratorError2 = true;
                                _iteratorError2 = err;
                            } finally{
                                try {
                                    if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                                        _iterator2.return();
                                    }
                                } finally{
                                    if (_didIteratorError2) {
                                        throw _iteratorError2;
                                    }
                                }
                            }
                        }
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally{
                        try {
                            if (!_iteratorNormalCompletion && _iterator.return != null) {
                                _iterator.return();
                            }
                        } finally{
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }
                    // Last, re-create the placeholder groups by sorting placeholders by their index.
                    _this._placeholderGroups = groupBy(_this._snippet.placeholders, Placeholder.compareByIndex);
                });
            }
        }
    ]);
    return OneSnippet;
}();
OneSnippet._decor = {
    active: ModelDecorationOptions.register({
        description: 'snippet-placeholder-1',
        stickiness: 0 /* AlwaysGrowsWhenTypingAtEdges */ ,
        className: 'snippet-placeholder'
    }),
    inactive: ModelDecorationOptions.register({
        description: 'snippet-placeholder-2',
        stickiness: 1 /* NeverGrowsWhenTypingAtEdges */ ,
        className: 'snippet-placeholder'
    }),
    activeFinal: ModelDecorationOptions.register({
        description: 'snippet-placeholder-3',
        stickiness: 1 /* NeverGrowsWhenTypingAtEdges */ ,
        className: 'finish-snippet-placeholder'
    }),
    inactiveFinal: ModelDecorationOptions.register({
        description: 'snippet-placeholder-4',
        stickiness: 1 /* NeverGrowsWhenTypingAtEdges */ ,
        className: 'finish-snippet-placeholder'
    })
};
var _defaultOptions = {
    overwriteBefore: 0,
    overwriteAfter: 0,
    adjustWhitespace: true,
    clipboardText: undefined,
    overtypingCapturer: undefined
};
export var SnippetSession = /*#__PURE__*/ function() {
    "use strict";
    function SnippetSession(editor, template) {
        var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : _defaultOptions;
        _class_call_check(this, SnippetSession);
        this._templateMerges = [];
        this._snippets = [];
        this._editor = editor;
        this._template = template;
        this._options = options;
    }
    _create_class(SnippetSession, [
        {
            key: "dispose",
            value: function dispose1() {
                dispose(this._snippets);
            }
        },
        {
            key: "_logInfo",
            value: function _logInfo() {
                return 'template="'.concat(this._template, '", merged_templates="').concat(this._templateMerges.join(' -> '), '"');
            }
        },
        {
            key: "insert",
            value: function insert() {
                var _this = this;
                if (!this._editor.hasModel()) {
                    return;
                }
                // make insert edit and start with first selections
                var _SnippetSession_createEditsAndSnippets = SnippetSession.createEditsAndSnippets(this._editor, this._template, this._options.overwriteBefore, this._options.overwriteAfter, false, this._options.adjustWhitespace, this._options.clipboardText, this._options.overtypingCapturer), edits = _SnippetSession_createEditsAndSnippets.edits, snippets = _SnippetSession_createEditsAndSnippets.snippets;
                this._snippets = snippets;
                this._editor.executeEdits('snippet', edits, function(undoEdits) {
                    if (_this._snippets[0].hasPlaceholder) {
                        return _this._move(true);
                    } else {
                        return undoEdits.filter(function(edit) {
                            return !!edit.identifier;
                        }) // only use our undo edits
                        .map(function(edit) {
                            return Selection.fromPositions(edit.range.getEndPosition());
                        });
                    }
                });
                this._editor.revealRange(this._editor.getSelections()[0]);
            }
        },
        {
            key: "merge",
            value: function merge(template) {
                var _this = this;
                var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : _defaultOptions;
                if (!this._editor.hasModel()) {
                    return;
                }
                this._templateMerges.push([
                    this._snippets[0]._nestingLevel,
                    this._snippets[0]._placeholderGroupsIdx,
                    template
                ]);
                var _SnippetSession_createEditsAndSnippets = SnippetSession.createEditsAndSnippets(this._editor, template, options.overwriteBefore, options.overwriteAfter, true, options.adjustWhitespace, options.clipboardText, options.overtypingCapturer), edits = _SnippetSession_createEditsAndSnippets.edits, snippets = _SnippetSession_createEditsAndSnippets.snippets;
                this._editor.executeEdits('snippet', edits, function(undoEdits) {
                    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    try {
                        for(var _iterator = _this._snippets[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                            var snippet = _step.value;
                            snippet.merge(snippets);
                        }
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally{
                        try {
                            if (!_iteratorNormalCompletion && _iterator.return != null) {
                                _iterator.return();
                            }
                        } finally{
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }
                    console.assert(snippets.length === 0);
                    if (_this._snippets[0].hasPlaceholder) {
                        return _this._move(undefined);
                    } else {
                        return undoEdits.filter(function(edit) {
                            return !!edit.identifier;
                        }) // only use our undo edits
                        .map(function(edit) {
                            return Selection.fromPositions(edit.range.getEndPosition());
                        });
                    }
                });
            }
        },
        {
            key: "next",
            value: function next() {
                var newSelections = this._move(true);
                this._editor.setSelections(newSelections);
                this._editor.revealPositionInCenterIfOutsideViewport(newSelections[0].getPosition());
            }
        },
        {
            key: "prev",
            value: function prev() {
                var newSelections = this._move(false);
                this._editor.setSelections(newSelections);
                this._editor.revealPositionInCenterIfOutsideViewport(newSelections[0].getPosition());
            }
        },
        {
            key: "_move",
            value: function _move(fwd) {
                var selections = [];
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    for(var _iterator = this._snippets[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var snippet = _step.value;
                        var _selections;
                        var oneSelection = snippet.move(fwd);
                        (_selections = selections).push.apply(_selections, _to_consumable_array(oneSelection));
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
                return selections;
            }
        },
        {
            key: "isAtFirstPlaceholder",
            get: function get() {
                return this._snippets[0].isAtFirstPlaceholder;
            }
        },
        {
            key: "isAtLastPlaceholder",
            get: function get() {
                return this._snippets[0].isAtLastPlaceholder;
            }
        },
        {
            key: "hasPlaceholder",
            get: function get() {
                return this._snippets[0].hasPlaceholder;
            }
        },
        {
            key: "choice",
            get: function get() {
                return this._snippets[0].choice;
            }
        },
        {
            key: "isSelectionWithinPlaceholders",
            value: function isSelectionWithinPlaceholders() {
                if (!this.hasPlaceholder) {
                    return false;
                }
                var selections = this._editor.getSelections();
                if (selections.length < this._snippets.length) {
                    // this means we started snippet mode with N
                    // selections and have M (N > M) selections.
                    // So one snippet is without selection -> cancel
                    return false;
                }
                var allPossibleSelections = new Map();
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    var _loop = function() {
                        var snippet = _step.value;
                        var possibleSelections = snippet.computePossibleSelections();
                        // for the first snippet find the placeholder (and its ranges)
                        // that contain at least one selection. for all remaining snippets
                        // the same placeholder (and their ranges) must be used.
                        if (allPossibleSelections.size === 0) {
                            var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                            try {
                                for(var _iterator = possibleSelections[Symbol.iterator](), _step1; !(_iteratorNormalCompletion = (_step1 = _iterator.next()).done); _iteratorNormalCompletion = true){
                                    var _step_value = _sliced_to_array(_step1.value, 2), index = _step_value[0], ranges = _step_value[1];
                                    ranges.sort(Range.compareRangesUsingStarts);
                                    var _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;
                                    try {
                                        for(var _iterator1 = selections[Symbol.iterator](), _step2; !(_iteratorNormalCompletion1 = (_step2 = _iterator1.next()).done); _iteratorNormalCompletion1 = true){
                                            var selection = _step2.value;
                                            if (ranges[0].containsRange(selection)) {
                                                allPossibleSelections.set(index, []);
                                                break;
                                            }
                                        }
                                    } catch (err) {
                                        _didIteratorError1 = true;
                                        _iteratorError1 = err;
                                    } finally{
                                        try {
                                            if (!_iteratorNormalCompletion1 && _iterator1.return != null) {
                                                _iterator1.return();
                                            }
                                        } finally{
                                            if (_didIteratorError1) {
                                                throw _iteratorError1;
                                            }
                                        }
                                    }
                                }
                            } catch (err) {
                                _didIteratorError = true;
                                _iteratorError = err;
                            } finally{
                                try {
                                    if (!_iteratorNormalCompletion && _iterator.return != null) {
                                        _iterator.return();
                                    }
                                } finally{
                                    if (_didIteratorError) {
                                        throw _iteratorError;
                                    }
                                }
                            }
                        }
                        if (allPossibleSelections.size === 0) {
                            // return false if we couldn't associate a selection to
                            // this (the first) snippet
                            return {
                                v: false
                            };
                        }
                        // add selections from 'this' snippet so that we know all
                        // selections for this placeholder
                        allPossibleSelections.forEach(function(array, index) {
                            var _array;
                            (_array = array).push.apply(_array, _to_consumable_array(possibleSelections.get(index)));
                        });
                    };
                    for(var _iterator = this._snippets[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var _ret = _loop();
                        if (_type_of(_ret) === "object") return _ret.v;
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
                // sort selections (and later placeholder-ranges). then walk both
                // arrays and make sure the placeholder-ranges contain the corresponding
                // selection
                selections.sort(Range.compareRangesUsingStarts);
                var _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;
                try {
                    for(var _iterator1 = allPossibleSelections[Symbol.iterator](), _step1; !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true){
                        var _step_value = _sliced_to_array(_step1.value, 2), index = _step_value[0], ranges = _step_value[1];
                        if (ranges.length !== selections.length) {
                            allPossibleSelections.delete(index);
                            continue;
                        }
                        ranges.sort(Range.compareRangesUsingStarts);
                        for(var i = 0; i < ranges.length; i++){
                            if (!ranges[i].containsRange(selections[i])) {
                                allPossibleSelections.delete(index);
                                continue;
                            }
                        }
                    }
                } catch (err) {
                    _didIteratorError1 = true;
                    _iteratorError1 = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion1 && _iterator1.return != null) {
                            _iterator1.return();
                        }
                    } finally{
                        if (_didIteratorError1) {
                            throw _iteratorError1;
                        }
                    }
                }
                // from all possible selections we have deleted those
                // that don't match with the current selection. if we don't
                // have any left, we don't have a selection anymore
                return allPossibleSelections.size > 0;
            }
        }
    ], [
        {
            key: "adjustWhitespace",
            value: function adjustWhitespace(model, position, snippet, adjustIndentation, adjustNewlines) {
                var line = model.getLineContent(position.lineNumber);
                var lineLeadingWhitespace = getLeadingWhitespace(line, 0, position.column - 1);
                // the snippet as inserted
                var snippetTextString;
                snippet.walk(function(marker) {
                    // all text elements that are not inside choice
                    if (!_instanceof(marker, Text) || _instanceof(marker.parent, Choice)) {
                        return true;
                    }
                    var lines = marker.value.split(/\r\n|\r|\n/);
                    if (adjustIndentation) {
                        // adjust indentation of snippet test
                        // -the snippet-start doesn't get extra-indented (lineLeadingWhitespace), only normalized
                        // -all N+1 lines get extra-indented and normalized
                        // -the text start get extra-indented and normalized when following a linebreak
                        var offset = snippet.offset(marker);
                        if (offset === 0) {
                            // snippet start
                            lines[0] = model.normalizeIndentation(lines[0]);
                        } else {
                            // check if text start is after a linebreak
                            snippetTextString = snippetTextString !== null && snippetTextString !== void 0 ? snippetTextString : snippet.toString();
                            var prevChar = snippetTextString.charCodeAt(offset - 1);
                            if (prevChar === 10 /* LineFeed */  || prevChar === 13 /* CarriageReturn */ ) {
                                lines[0] = model.normalizeIndentation(lineLeadingWhitespace + lines[0]);
                            }
                        }
                        for(var i = 1; i < lines.length; i++){
                            lines[i] = model.normalizeIndentation(lineLeadingWhitespace + lines[i]);
                        }
                    }
                    var newValue = lines.join(model.getEOL());
                    if (newValue !== marker.value) {
                        marker.parent.replace(marker, [
                            new Text(newValue)
                        ]);
                        snippetTextString = undefined;
                    }
                    return true;
                });
                return lineLeadingWhitespace;
            }
        },
        {
            key: "adjustSelection",
            value: function adjustSelection(model, selection, overwriteBefore, overwriteAfter) {
                if (overwriteBefore !== 0 || overwriteAfter !== 0) {
                    // overwrite[Before|After] is compute using the position, not the whole
                    // selection. therefore we adjust the selection around that position
                    var positionLineNumber = selection.positionLineNumber, positionColumn = selection.positionColumn;
                    var positionColumnBefore = positionColumn - overwriteBefore;
                    var positionColumnAfter = positionColumn + overwriteAfter;
                    var range = model.validateRange({
                        startLineNumber: positionLineNumber,
                        startColumn: positionColumnBefore,
                        endLineNumber: positionLineNumber,
                        endColumn: positionColumnAfter
                    });
                    selection = Selection.createWithDirection(range.startLineNumber, range.startColumn, range.endLineNumber, range.endColumn, selection.getDirection());
                }
                return selection;
            }
        },
        {
            key: "createEditsAndSnippets",
            value: function createEditsAndSnippets(editor, template, overwriteBefore, overwriteAfter, enforceFinalTabstop, adjustWhitespace, clipboardText, overtypingCapturer) {
                var edits = [];
                var snippets = [];
                if (!editor.hasModel()) {
                    return {
                        edits: edits,
                        snippets: snippets
                    };
                }
                var model = editor.getModel();
                var workspaceService = editor.invokeWithinContext(function(accessor) {
                    return accessor.get(IWorkspaceContextService);
                });
                var modelBasedVariableResolver = editor.invokeWithinContext(function(accessor) {
                    return new ModelBasedVariableResolver(accessor.get(ILabelService), model);
                });
                var readClipboardText = function() {
                    return clipboardText;
                };
                var delta = 0;
                // know what text the overwrite[Before|After] extensions
                // of the primary curser have selected because only when
                // secondary selections extend to the same text we can grow them
                var firstBeforeText = model.getValueInRange(SnippetSession.adjustSelection(model, editor.getSelection(), overwriteBefore, 0));
                var firstAfterText = model.getValueInRange(SnippetSession.adjustSelection(model, editor.getSelection(), 0, overwriteAfter));
                // remember the first non-whitespace column to decide if
                // `keepWhitespace` should be overruled for secondary selections
                var firstLineFirstNonWhitespace = model.getLineFirstNonWhitespaceColumn(editor.getSelection().positionLineNumber);
                // sort selections by their start position but remeber
                // the original index. that allows you to create correct
                // offset-based selection logic without changing the
                // primary selection
                var indexedSelections = editor.getSelections().map(function(selection, idx) {
                    return {
                        selection: selection,
                        idx: idx
                    };
                }).sort(function(a, b) {
                    return Range.compareRangesUsingStarts(a.selection, b.selection);
                });
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    for(var _iterator = indexedSelections[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var _step_value = _step.value, selection = _step_value.selection, idx = _step_value.idx;
                        // extend selection with the `overwriteBefore` and `overwriteAfter` and then
                        // compare if this matches the extensions of the primary selection
                        var extensionBefore = SnippetSession.adjustSelection(model, selection, overwriteBefore, 0);
                        var extensionAfter = SnippetSession.adjustSelection(model, selection, 0, overwriteAfter);
                        if (firstBeforeText !== model.getValueInRange(extensionBefore)) {
                            extensionBefore = selection;
                        }
                        if (firstAfterText !== model.getValueInRange(extensionAfter)) {
                            extensionAfter = selection;
                        }
                        // merge the before and after selection into one
                        var snippetSelection = selection.setStartPosition(extensionBefore.startLineNumber, extensionBefore.startColumn).setEndPosition(extensionAfter.endLineNumber, extensionAfter.endColumn);
                        var snippet = new SnippetParser().parse(template, true, enforceFinalTabstop);
                        // adjust the template string to match the indentation and
                        // whitespace rules of this insert location (can be different for each cursor)
                        // happens when being asked for (default) or when this is a secondary
                        // cursor and the leading whitespace is different
                        var start = snippetSelection.getStartPosition();
                        var snippetLineLeadingWhitespace = SnippetSession.adjustWhitespace(model, start, snippet, adjustWhitespace || idx > 0 && firstLineFirstNonWhitespace !== model.getLineFirstNonWhitespaceColumn(selection.positionLineNumber), true);
                        snippet.resolveVariables(new CompositeSnippetVariableResolver([
                            modelBasedVariableResolver,
                            new ClipboardBasedVariableResolver(readClipboardText, idx, indexedSelections.length, editor.getOption(70 /* multiCursorPaste */ ) === 'spread'),
                            new SelectionBasedVariableResolver(model, selection, idx, overtypingCapturer),
                            new CommentBasedVariableResolver(model, selection),
                            new TimeBasedVariableResolver,
                            new WorkspaceBasedVariableResolver(workspaceService),
                            new RandomBasedVariableResolver
                        ]));
                        var offset = model.getOffsetAt(start) + delta;
                        delta += snippet.toString().length - model.getValueLengthInRange(snippetSelection);
                        // store snippets with the index of their originating selection.
                        // that ensures the primiary cursor stays primary despite not being
                        // the one with lowest start position
                        edits[idx] = EditOperation.replace(snippetSelection, snippet.toString());
                        edits[idx].identifier = {
                            major: idx,
                            minor: 0
                        }; // mark the edit so only our undo edits will be used to generate end cursors
                        snippets[idx] = new OneSnippet(editor, snippet, offset, snippetLineLeadingWhitespace);
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
                return {
                    edits: edits,
                    snippets: snippets
                };
            }
        }
    ]);
    return SnippetSession;
}();
