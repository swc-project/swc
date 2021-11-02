var Formatting1;
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
!function(Formatting) {
    var Indenter = function() {
        "use strict";
        var Constructor, protoProps, staticProps;
        function Indenter(logger, tree, snapshot, languageHostIndentation, editorOptions, firstToken, smartIndent) {
            !function(instance, Constructor) {
                if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
            }(this, Indenter), this.logger = logger, this.tree = tree, this.snapshot = snapshot, this.languageHostIndentation = languageHostIndentation, this.editorOptions = editorOptions, this.firstToken = firstToken, this.smartIndent = smartIndent, this.indentationBag = new IndentationBag(this.snapshot), this.scriptBlockBeginLineNumber = -1, this.offsetIndentationDeltas = new Dictionary_int_int(), this.tree.Root.SetIndentationOverride(""), this.ApplyScriptBlockIndentation(this.languageHostIndentation, this.tree), this.FillInheritedIndentation(this.tree);
        }
        return Constructor = Indenter, protoProps = [
            {
                key: "GetIndentationEdits",
                value: function(token, nextToken, node, sameLineIndent) {
                    this.logger.information() && this.logger.log("GetIndentationEdits(t1=[" + token.Span.startPosition() + "," + token.Span.endPosition() + "], t2=[" + (null == nextToken ? "null" : nextToken.Span.startPosition() + "," + nextToken.Span.endPosition()) + "])");
                    var result = this.GetIndentationEditsWorker(token, nextToken, node, sameLineIndent);
                    if (this.logger.information()) for(var i = 0; i < result.count(); i++){
                        var edit = result.get(i);
                        this.logger.log("edit: minChar=" + edit.position + ", limChar=" + (edit.position + edit.length) + ", text=\"" + TypeScript.stringToLiteral(edit.replaceWith, 30) + "\"");
                    }
                    return result;
                }
            },
            {
                key: "GetIndentationEditsWorker",
                value: function(token, nextToken, node, sameLineIndent) {
                    var result = new List_TextEditInfo(), indentationInfo = null;
                    if (this.AdjustStartOffsetIfNeeded(token, node), this.scriptBlockBeginLineNumber == token.lineNumber()) return result;
                    if (!sameLineIndent && this.IsMultiLineString(token)) return result;
                    if (null == (indentationInfo = this.GetSpecialCaseIndentation(token, node))) {
                        for(; !node.CanIndent() && null != node.Parent && token.Span.span.start() == node.Parent.AuthorNode.Details.StartOffset;)node = node.Parent;
                        indentationInfo = node.CanIndent() && token.Span.span.start() == node.AuthorNode.Details.StartOffset ? node.GetEffectiveIndentation(this) : token.Token == AuthorTokenKind.atkIdentifier && null != nextToken && nextToken.Token == AuthorTokenKind.atkColon ? node.GetEffectiveChildrenIndentation(this) : this.ApplyIndentationDeltaFromParent(token, node);
                    }
                    if (null != indentationInfo) {
                        var edit = this.GetIndentEdit(indentationInfo, token.Span.startPosition(), sameLineIndent);
                        null != edit && (this.RegisterIndentation(edit, sameLineIndent), result.add(edit), token.Token == AuthorTokenKind.atkComment) && this.GetCommentIndentationEdits(token).foreach(function(item) {
                            result.add(item);
                        });
                    }
                    return result;
                }
            },
            {
                key: "GetCommentIndentationEdits",
                value: function(token) {
                    var result = new List_TextEditInfo();
                    if (token.Token != AuthorTokenKind.atkComment) return result;
                    var commentLastLineNumber = this.snapshot.GetLineNumberFromPosition(token.Span.endPosition());
                    if (token.lineNumber() == commentLastLineNumber) return result;
                    var commentFirstLineIndentationDelta = this.GetIndentationDelta(token.Span.startPosition(), null);
                    if (void 0 != commentFirstLineIndentationDelta) for(var line = token.lineNumber() + 1; line <= commentLastLineNumber; line++){
                        var lineStartPosition = this.snapshot.GetLineFromLineNumber(line).startPosition(), lineIndent = this.GetLineIndentationForOffset(lineStartPosition), commentIndentationInfo = this.ApplyIndentationDelta2(lineIndent, commentFirstLineIndentationDelta);
                        if (null != commentIndentationInfo) {
                            var tokenStartPosition = lineStartPosition + lineIndent.length, commentIndentationEdit = this.GetIndentEdit(commentIndentationInfo, tokenStartPosition, !1);
                            null != commentIndentationEdit && result.add(commentIndentationEdit);
                        }
                    }
                    return result;
                }
            },
            {
                key: "GetSpecialCaseIndentation",
                value: function(token, node) {
                    var indentationInfo = null;
                    switch(token.Token){
                        case AuthorTokenKind.atkLCurly:
                            return indentationInfo = this.GetSpecialCaseIndentationForLCurly(node);
                        case AuthorTokenKind.atkElse:
                        case AuthorTokenKind.atkRBrack:
                            return indentationInfo = node.GetNodeStartLineIndentation(this);
                        case AuthorTokenKind.atkRCurly:
                            return node.AuthorNode.Details.Kind == AuthorParseNodeKind.apnkBlock && node.AuthorNode.EdgeLabel == AuthorParseNodeEdge.apneBody && (node = node.Parent), indentationInfo = node.GetNodeStartLineIndentation(this);
                        case AuthorTokenKind.atkWhile:
                            if (node.AuthorNode.Details.Kind == AuthorParseNodeKind.apnkDoWhile) return indentationInfo = node.GetNodeStartLineIndentation(this);
                            return null;
                        case AuthorTokenKind.atkSColon:
                            return this.GetSpecialCaseIndentationForSemicolon(token, node);
                        case AuthorTokenKind.atkComment:
                            return this.GetSpecialCaseIndentationForComment(token, node);
                        default:
                            return indentationInfo;
                    }
                }
            },
            {
                key: "GetSpecialCaseIndentationForLCurly",
                value: function(node) {
                    return node.AuthorNode.Details.Kind == AuthorParseNodeKind.apnkFncDecl || node.AuthorNode.EdgeLabel == AuthorParseNodeEdge.apneThen || node.AuthorNode.EdgeLabel == AuthorParseNodeEdge.apneElse ? node.GetNodeStartLineIndentation(this) : node.AuthorNode.Details.Kind != AuthorParseNodeKind.apnkObject || node.CanIndent() ? node.GetEffectiveIndentation(this) : null;
                }
            },
            {
                key: "GetSpecialCaseIndentationForSemicolon",
                value: function(token, node) {
                    if (this.smartIndent) return node.GetEffectiveChildrenIndentation(this);
                    if (node.AuthorNode.Details.Kind != AuthorParseNodeKind.apnkFor) {
                        var semiColonStartSpan = new Span(token.Span.startPosition(), 0);
                        return (node = ParseTree.FindCommonParentNode(semiColonStartSpan, semiColonStartSpan, node)).GetEffectiveChildrenIndentation(this);
                    }
                    return null;
                }
            },
            {
                key: "GetSpecialCaseIndentationForComment",
                value: function(token, node) {
                    var indentationInfo = null, twoCharSpan = token.Span.Intersection(new Span(token.Span.startPosition(), 2));
                    if (null != twoCharSpan && ("//" == twoCharSpan.GetText() || "/*" == twoCharSpan.GetText())) {
                        for(; null == node.ChildrenIndentationDelta && null != node.Parent;)node = node.Parent;
                        indentationInfo = this.CanIndentComment(token, node) ? node.GetEffectiveChildrenIndentationForComment(this) : this.ApplyIndentationDeltaFromParent(token, node);
                    }
                    return indentationInfo;
                }
            },
            {
                key: "CanIndentComment",
                value: function(token, node) {
                    switch(node.AuthorNode.Details.Kind){
                        case AuthorParseNodeKind.apnkProg:
                        case AuthorParseNodeKind.apnkBlock:
                        case AuthorParseNodeKind.apnkSwitch:
                        case AuthorParseNodeKind.apnkCase:
                        case AuthorParseNodeKind.apnkDefaultCase:
                        case AuthorParseNodeKind.apnkIf:
                        case AuthorParseNodeKind.apnkFor:
                        case AuthorParseNodeKind.apnkForIn:
                        case AuthorParseNodeKind.apnkWhile:
                        case AuthorParseNodeKind.apnkWith:
                        case AuthorParseNodeKind.apnkDoWhile:
                        case AuthorParseNodeKind.apnkObject:
                            return !0;
                        case AuthorParseNodeKind.apnkFncDecl:
                            var result = !0;
                            return ParseNodeExtensions.FindChildrenWithEdge(node, AuthorParseNodeEdge.apneArgument).foreach(function(argumentNode) {
                                token.Span.startPosition() < argumentNode.AuthorNode.Details.StartOffset && (result = !1);
                            }), result;
                    }
                    return !1;
                }
            },
            {
                key: "ApplyScriptBlockIndentation",
                value: function(languageHostIndentation, tree) {
                    if (null != languageHostIndentation && null != tree.StartNodeSelf) {
                        var scriptBlockIndentation = this.ApplyIndentationLevel(languageHostIndentation, 1);
                        tree.Root.SetIndentationOverride(scriptBlockIndentation);
                    }
                }
            },
            {
                key: "GetIndentEdit",
                value: function(indentInfo, tokenStartPosition, sameLineIndent) {
                    var indentText = this.ApplyIndentationLevel(indentInfo.Prefix, indentInfo.Level);
                    if (sameLineIndent) return new TextEditInfo(tokenStartPosition, 0, indentText);
                    var snapshotLine = this.snapshot.GetLineFromPosition(tokenStartPosition), currentIndentSpan = new Span(snapshotLine.startPosition(), tokenStartPosition - snapshotLine.startPosition()), currentIndentText = this.snapshot.GetText(currentIndentSpan);
                    if (currentIndentText !== indentText) {
                        if (this.logger.debug()) for(var i = 0, len = currentIndentText.length; i < len; i++){
                            var c = currentIndentText.charCodeAt(i);
                            if (!StringUtils.IsWhiteSpace(c)) {
                                Debug.Fail("Formatting error: Will remove user code when indenting the line: " + snapshotLine.getText());
                                break;
                            }
                        }
                        return new TextEditInfo(currentIndentSpan.start(), currentIndentSpan.length(), indentText);
                    }
                    return null;
                }
            },
            {
                key: "ApplyIndentationLevel",
                value: function(existingIndentation, level) {
                    var indentSize = this.editorOptions.IndentSize, tabSize = this.editorOptions.TabSize, convertTabsToSpaces = this.editorOptions.ConvertTabsToSpaces;
                    if (level < 0) {
                        if (StringUtils.IsNullOrEmpty(existingIndentation)) return "";
                        var totalIndent = 0;
                        return (StringUtils.foreach(existingIndentation, function(c) {
                            "\t" == c ? totalIndent += tabSize : totalIndent++;
                        }), (totalIndent += level * indentSize) < 0) ? "" : this.GetIndentString(null, totalIndent, tabSize, convertTabsToSpaces);
                    }
                    return this.GetIndentString(existingIndentation, level * indentSize, tabSize, convertTabsToSpaces);
                }
            },
            {
                key: "GetIndentString",
                value: function(prefix, totalIndentSize, tabSize, convertTabsToSpaces) {
                    var tabString = convertTabsToSpaces ? StringUtils.create(" ", tabSize) : "\t", text = "";
                    StringUtils.IsNullOrEmpty(prefix) || (text += prefix);
                    for(var pos = 0; pos <= totalIndentSize - tabSize;)text += tabString, pos += tabSize;
                    for(; pos < totalIndentSize;)text += " ", pos++;
                    return text;
                }
            },
            {
                key: "ApplyIndentationDeltaFromParent",
                value: function(token, node) {
                    for(var indentationInfo = null, indentableParent = node; null != indentableParent && !indentableParent.CanIndent();)indentableParent = indentableParent.Parent;
                    if (null != indentableParent && indentableParent.AuthorNode.Details.Kind != AuthorParseNodeKind.apnkProg) {
                        var parentIndentationDeltaSize = this.GetIndentationDelta(indentableParent.AuthorNode.Details.StartOffset, token.Span.startPosition());
                        void 0 !== parentIndentationDeltaSize && (indentationInfo = this.ApplyIndentationDelta1(token.Span.startPosition(), parentIndentationDeltaSize));
                    }
                    return indentationInfo;
                }
            },
            {
                key: "ApplyIndentationDelta1",
                value: function(tokenStartPosition, delta) {
                    var snapshotLine = this.snapshot.GetLineFromPosition(tokenStartPosition), currentIndentSpan = new Span(snapshotLine.startPosition(), tokenStartPosition - snapshotLine.startPosition()), currentIndent = this.snapshot.GetText(currentIndentSpan);
                    return this.ApplyIndentationDelta2(currentIndent, delta);
                }
            },
            {
                key: "ApplyIndentationDelta2",
                value: function(currentIndent, delta) {
                    if (0 == delta) return null;
                    var newIndentSize = Indenter.GetIndentSizeFromIndentText(currentIndent, this.editorOptions) + delta;
                    newIndentSize < 0 && (newIndentSize = 0);
                    var newIndent = this.GetIndentString(null, newIndentSize, this.editorOptions.TabSize, this.editorOptions.ConvertTabsToSpaces);
                    return null != newIndent ? new IndentationInfo(newIndent, 0) : null;
                }
            },
            {
                key: "GetIndentationDelta",
                value: function(tokenStartPosition, childTokenStartPosition) {
                    Debug.Assert(void 0 !== childTokenStartPosition, "Error: caller must pass 'null' for undefined position");
                    var indentationDeltaSize = this.offsetIndentationDeltas.GetValue(tokenStartPosition);
                    if (null === indentationDeltaSize) {
                        var indentEditInfo = this.indentationBag.FindIndent(tokenStartPosition);
                        if (null == indentEditInfo) return null;
                        var origIndentText = this.snapshot.GetText(new Span(indentEditInfo.OrigIndentPosition, indentEditInfo.OrigIndentLength())), newIndentText = indentEditInfo.Indentation(), origIndentSize = Indenter.GetIndentSizeFromText(origIndentText, this.editorOptions, !0), newIndentSize = Indenter.GetIndentSizeFromIndentText(newIndentText, this.editorOptions);
                        if (null !== childTokenStartPosition) {
                            var childTokenLineStartPosition = this.snapshot.GetLineFromPosition(childTokenStartPosition).startPosition(), childIndentText = this.snapshot.GetText(new Span(childTokenLineStartPosition, childTokenStartPosition - childTokenLineStartPosition));
                            Indenter.GetIndentSizeFromIndentText(childIndentText, this.editorOptions) < origIndentSize && (origIndentSize = Indenter.GetIndentSizeFromIndentText(origIndentText, this.editorOptions));
                        }
                        indentationDeltaSize = newIndentSize - origIndentSize, this.offsetIndentationDeltas.Add(tokenStartPosition, indentationDeltaSize);
                    }
                    return indentationDeltaSize;
                }
            },
            {
                key: "FillInheritedIndentation",
                value: function(tree) {
                    var offset = -1, indentNode = null;
                    if (null != tree.StartNodeSelf) if (this.smartIndent || null === tree.StartNodePreviousSibling || 0 != tree.StartNodeSelf.AuthorNode.Label || 0 != tree.StartNodePreviousSibling.Label) {
                        if (this.smartIndent) for(parent = tree.StartNodeSelf; null != parent && parent.AuthorNode.Details.StartOffset == this.firstToken.Span.startPosition();)parent = parent.Parent;
                        else {
                            var startNodeLineNumber = this.snapshot.GetLineNumberFromPosition(tree.StartNodeSelf.AuthorNode.Details.StartOffset);
                            for(parent = tree.StartNodeSelf.Parent; null != parent && startNodeLineNumber == this.snapshot.GetLineNumberFromPosition(parent.AuthorNode.Details.StartOffset);)parent = parent.Parent;
                        }
                        for(; null != parent && !parent.CanIndent();)parent = parent.Parent;
                        null != parent && parent.AuthorNode.Details.Kind != AuthorParseNodeKind.apnkProg && (offset = parent.AuthorNode.Details.StartOffset, indentNode = parent);
                    } else {
                        indentNode = tree.StartNodeSelf, offset = tree.StartNodePreviousSibling.Details.StartOffset;
                        for(var parent, lineNum = this.snapshot.GetLineNumberFromPosition(offset), node = indentNode; null != node.Parent && this.snapshot.GetLineNumberFromPosition(node.Parent.AuthorNode.Details.StartOffset) == lineNum;)(node = node.Parent).CanIndent() && ((indentNode = node).IndentationDelta = 0);
                    }
                    if (null != indentNode) {
                        var indentOverride = this.GetLineIndentationForOffset(offset);
                        this.smartIndent || null === tree.StartNodePreviousSibling || null == indentNode.Parent || ParseNodeExtensions.GetChildren(indentNode.Parent).foreach(function(sibling) {
                            sibling !== indentNode && sibling.CanIndent() && sibling.SetIndentationOverride(indentOverride);
                        });
                        var lastDelta = 0, lastLine = this.snapshot.GetLineNumberFromPosition(indentNode.AuthorNode.Details.StartOffset);
                        do {
                            var currentLine = this.snapshot.GetLineNumberFromPosition(indentNode.AuthorNode.Details.StartOffset);
                            lastLine != currentLine && (lastLine = currentLine, indentOverride = this.ApplyIndentationLevel(indentOverride, -lastDelta), lastDelta = 0), indentNode.CanIndent() && (indentNode.SetIndentationOverride(indentOverride), lastDelta = indentNode.IndentationDelta), indentNode = indentNode.Parent;
                        }while (null != indentNode)
                    }
                }
            },
            {
                key: "GetLineIndentationForOffset",
                value: function(offset) {
                    var indentationEdit;
                    if (null != (indentationEdit = this.indentationBag.FindIndent(offset))) return indentationEdit.Indentation();
                    for(var lineText = this.snapshot.GetLineFromPosition(offset).getText(), index = 0; index < lineText.length && (" " == lineText.charAt(index) || "\t" == lineText.charAt(index));)++index;
                    return lineText.substr(0, index);
                }
            },
            {
                key: "RegisterIndentation",
                value: function(indent, sameLineIndent) {
                    var indentationInfo = null;
                    if (sameLineIndent) {
                        var lineStartPosition = this.snapshot.GetLineFromPosition(indent.Position).startPosition(), lineIndentLength = indent.Position - lineStartPosition;
                        indentationInfo = IndentationEditInfo.create2(indent.Position, indent.ReplaceWith, lineStartPosition, lineIndentLength);
                    } else indentationInfo = new IndentationEditInfo(indent);
                    this.indentationBag.AddIndent(indentationInfo);
                }
            },
            {
                key: "RegisterIndentation2",
                value: function(position, indent) {
                    this.RegisterIndentation(new TextEditInfo(position, 0, indent), !1);
                }
            },
            {
                key: "AdjustStartOffsetIfNeeded",
                value: function(token, node) {
                    if (null != token) {
                        var updateStartOffset = !1;
                        switch(token.Token){
                            case AuthorTokenKind.atkFunction:
                                updateStartOffset = node.AuthorNode.Details.Kind == AuthorParseNodeKind.apnkFncDecl;
                                break;
                            case AuthorTokenKind.atkLCurly:
                                updateStartOffset = node.AuthorNode.Details.Kind == AuthorParseNodeKind.apnkObject;
                                break;
                            case AuthorTokenKind.atkLBrack:
                                updateStartOffset = node.AuthorNode.Details.Kind == AuthorParseNodeKind.apnkArray;
                                break;
                        }
                        updateStartOffset && ParseNodeExtensions.SetNodeSpan(node, token.Span.startPosition(), node.AuthorNode.Details.EndOffset);
                    }
                }
            },
            {
                key: "IsMultiLineString",
                value: function(token) {
                    return token.tokenID === TypeScript.TokenID.StringLiteral && this.snapshot.GetLineNumberFromPosition(token.Span.endPosition()) > this.snapshot.GetLineNumberFromPosition(token.Span.startPosition());
                }
            }
        ], staticProps = [
            {
                key: "GetIndentSizeFromIndentText",
                value: function(indentText, editorOptions) {
                    return GetIndentSizeFromText(indentText, editorOptions, !1);
                }
            },
            {
                key: "GetIndentSizeFromText",
                value: function(text, editorOptions, includeNonIndentChars) {
                    for(var indentSize = 0, i = 0; i < text.length; i++){
                        var c = text.charAt(i);
                        if ("\t" == c) indentSize = indentSize + editorOptions.TabSize - indentSize % editorOptions.TabSize;
                        else if (" " == c) indentSize += 1;
                        else if (includeNonIndentChars) indentSize += 1;
                        else break;
                    }
                    return indentSize;
                }
            }
        ], protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), Indenter;
    }();
    Formatting.Indenter = Indenter;
}(Formatting1 || (Formatting1 = {
}));
