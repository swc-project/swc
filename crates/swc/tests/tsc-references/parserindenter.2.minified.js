//// [parserindenter.ts]
var Formatting, Formatting1, Indenter;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
Formatting1 = Formatting || (Formatting = {}), Indenter = /*#__PURE__*/ function() {
    function Indenter(logger, tree, snapshot, languageHostIndentation, editorOptions, firstToken, smartIndent) {
        _class_call_check(this, Indenter), this.logger = logger, this.tree = tree, this.snapshot = snapshot, this.languageHostIndentation = languageHostIndentation, this.editorOptions = editorOptions, this.firstToken = firstToken, this.smartIndent = smartIndent, this.indentationBag = new IndentationBag(this.snapshot), this.scriptBlockBeginLineNumber = -1, this.offsetIndentationDeltas = new Dictionary_int_int(), this.tree.Root.SetIndentationOverride(""), this.ApplyScriptBlockIndentation(this.languageHostIndentation, this.tree), this.FillInheritedIndentation(this.tree);
    }
    var _proto = Indenter.prototype;
    return _proto.GetIndentationEdits = function(token, nextToken, node, sameLineIndent) {
        this.logger.information() && this.logger.log("GetIndentationEdits(t1=[" + token.Span.startPosition() + "," + token.Span.endPosition() + "], t2=[" + (null == nextToken ? "null" : nextToken.Span.startPosition() + "," + nextToken.Span.endPosition()) + "])");
        var result = this.GetIndentationEditsWorker(token, nextToken, node, sameLineIndent);
        if (this.logger.information()) for(var i = 0; i < result.count(); i++){
            var edit = result.get(i);
            this.logger.log("edit: minChar=" + edit.position + ", limChar=" + (edit.position + edit.length) + ", text=\"" + TypeScript.stringToLiteral(edit.replaceWith, 30) + "\"");
        }
        return result;
    }, _proto.GetIndentationEditsWorker = function(token, nextToken, node, sameLineIndent) {
        var result = new List_TextEditInfo(), indentationInfo = null;
        if (this.AdjustStartOffsetIfNeeded(token, node), this.scriptBlockBeginLineNumber == token.lineNumber() || !sameLineIndent && this.IsMultiLineString(token)) return result;
        if (null == (indentationInfo = this.GetSpecialCaseIndentation(token, node))) {
            for(; !node.CanIndent() && null != node.Parent && token.Span.span.start() == node.Parent.AuthorNode.Details.StartOffset;)node = node.Parent;
            node.CanIndent() && token.Span.span.start() == node.AuthorNode.Details.StartOffset ? indentationInfo = node.GetEffectiveIndentation(this) : token.Token == AuthorTokenKind.atkIdentifier && null != nextToken && nextToken.Token == AuthorTokenKind.atkColon ? indentationInfo = node.GetEffectiveChildrenIndentation(this) : indentationInfo = this.ApplyIndentationDeltaFromParent(token, node);
        }
        if (null != indentationInfo) {
            var edit = this.GetIndentEdit(indentationInfo, token.Span.startPosition(), sameLineIndent);
            null != edit && (this.RegisterIndentation(edit, sameLineIndent), result.add(edit), token.Token == AuthorTokenKind.atkComment && this.GetCommentIndentationEdits(token).foreach(function(item) {
                result.add(item);
            }));
        }
        return result;
    }, _proto.GetCommentIndentationEdits = function(token) {
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
    }, _proto.GetSpecialCaseIndentation = function(token, node) {
        var indentationInfo = null;
        switch(token.Token){
            case AuthorTokenKind.atkLCurly:
                return this.GetSpecialCaseIndentationForLCurly(node);
            case AuthorTokenKind.atkElse:
            case AuthorTokenKind.atkRBrack:
                return node.GetNodeStartLineIndentation(this);
            case AuthorTokenKind.atkRCurly:
                return node.AuthorNode.Details.Kind == AuthorParseNodeKind.apnkBlock && node.AuthorNode.EdgeLabel == AuthorParseNodeEdge.apneBody && (node = node.Parent), indentationInfo = node.GetNodeStartLineIndentation(this);
            case AuthorTokenKind.atkWhile:
                if (node.AuthorNode.Details.Kind == AuthorParseNodeKind.apnkDoWhile) return node.GetNodeStartLineIndentation(this);
                return null;
            case AuthorTokenKind.atkSColon:
                return this.GetSpecialCaseIndentationForSemicolon(token, node);
            case AuthorTokenKind.atkComment:
                return this.GetSpecialCaseIndentationForComment(token, node);
            default:
                return indentationInfo;
        }
    }, _proto.GetSpecialCaseIndentationForLCurly = function(node) {
        return node.AuthorNode.Details.Kind == AuthorParseNodeKind.apnkFncDecl || node.AuthorNode.EdgeLabel == AuthorParseNodeEdge.apneThen || node.AuthorNode.EdgeLabel == AuthorParseNodeEdge.apneElse ? node.GetNodeStartLineIndentation(this) : node.AuthorNode.Details.Kind != AuthorParseNodeKind.apnkObject || node.CanIndent() ? node.GetEffectiveIndentation(this) : null;
    }, _proto.GetSpecialCaseIndentationForSemicolon = function(token, node) {
        if (this.smartIndent) return node.GetEffectiveChildrenIndentation(this);
        if (node.AuthorNode.Details.Kind != AuthorParseNodeKind.apnkFor) {
            var semiColonStartSpan = new Span(token.Span.startPosition(), 0);
            return (node = ParseTree.FindCommonParentNode(semiColonStartSpan, semiColonStartSpan, node)).GetEffectiveChildrenIndentation(this);
        }
        return null;
    }, _proto.GetSpecialCaseIndentationForComment = function(token, node) {
        var indentationInfo = null, twoCharSpan = token.Span.Intersection(new Span(token.Span.startPosition(), 2));
        if (null != twoCharSpan && ("//" == twoCharSpan.GetText() || "/*" == twoCharSpan.GetText())) {
            for(; null == node.ChildrenIndentationDelta && null != node.Parent;)node = node.Parent;
            indentationInfo = this.CanIndentComment(token, node) ? node.GetEffectiveChildrenIndentationForComment(this) : this.ApplyIndentationDeltaFromParent(token, node);
        }
        return indentationInfo;
    }, _proto.CanIndentComment = function(token, node) {
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
    }, _proto.ApplyScriptBlockIndentation = function(languageHostIndentation, tree) {
        if (null != languageHostIndentation && null != tree.StartNodeSelf) {
            var scriptBlockIndentation = this.ApplyIndentationLevel(languageHostIndentation, 1);
            tree.Root.SetIndentationOverride(scriptBlockIndentation);
        }
    }, _proto.GetIndentEdit = function(indentInfo, tokenStartPosition, sameLineIndent) {
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
    }, _proto.ApplyIndentationLevel = function(existingIndentation, level) {
        var indentSize = this.editorOptions.IndentSize, tabSize = this.editorOptions.TabSize, convertTabsToSpaces = this.editorOptions.ConvertTabsToSpaces;
        if (level < 0) {
            if (StringUtils.IsNullOrEmpty(existingIndentation)) return "";
            var totalIndent = 0;
            return (StringUtils.foreach(existingIndentation, function(c) {
                '\t' == c ? totalIndent += tabSize : totalIndent++;
            }), (totalIndent += level * indentSize) < 0) ? "" : this.GetIndentString(null, totalIndent, tabSize, convertTabsToSpaces);
        }
        return this.GetIndentString(existingIndentation, level * indentSize, tabSize, convertTabsToSpaces);
    }, _proto.GetIndentString = function(prefix, totalIndentSize, tabSize, convertTabsToSpaces) {
        var tabString = convertTabsToSpaces ? StringUtils.create(' ', tabSize) : "\t", text = "";
        StringUtils.IsNullOrEmpty(prefix) || (text += prefix);
        for(var pos = 0; pos <= totalIndentSize - tabSize;)text += tabString, pos += tabSize;
        for(; pos < totalIndentSize;)text += ' ', pos++;
        return text;
    }, _proto.ApplyIndentationDeltaFromParent = function(token, node) {
        for(var indentationInfo = null, indentableParent = node; null != indentableParent && !indentableParent.CanIndent();)indentableParent = indentableParent.Parent;
        if (null != indentableParent && indentableParent.AuthorNode.Details.Kind != AuthorParseNodeKind.apnkProg) {
            var parentIndentationDeltaSize = this.GetIndentationDelta(indentableParent.AuthorNode.Details.StartOffset, token.Span.startPosition());
            void 0 !== parentIndentationDeltaSize && (indentationInfo = this.ApplyIndentationDelta1(token.Span.startPosition(), parentIndentationDeltaSize));
        }
        return indentationInfo;
    }, _proto.ApplyIndentationDelta1 = function(tokenStartPosition, delta) {
        var snapshotLine = this.snapshot.GetLineFromPosition(tokenStartPosition), currentIndentSpan = new Span(snapshotLine.startPosition(), tokenStartPosition - snapshotLine.startPosition()), currentIndent = this.snapshot.GetText(currentIndentSpan);
        return this.ApplyIndentationDelta2(currentIndent, delta);
    }, _proto.ApplyIndentationDelta2 = function(currentIndent, delta) {
        if (0 == delta) return null;
        var newIndentSize = Indenter.GetIndentSizeFromIndentText(currentIndent, this.editorOptions) + delta;
        newIndentSize < 0 && (newIndentSize = 0);
        var newIndent = this.GetIndentString(null, newIndentSize, this.editorOptions.TabSize, this.editorOptions.ConvertTabsToSpaces);
        return null != newIndent ? new IndentationInfo(newIndent, 0) : null;
    }, _proto.GetIndentationDelta = function(tokenStartPosition, childTokenStartPosition) {
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
    }, _proto.FillInheritedIndentation = function(tree) {
        var offset = -1, indentNode = null;
        if (null != tree.StartNodeSelf) {
            if (this.smartIndent || null === tree.StartNodePreviousSibling || 0 != tree.StartNodeSelf.AuthorNode.Label || 0 != tree.StartNodePreviousSibling.Label) {
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
            }while (null != indentNode);
        }
    }, _proto.GetLineIndentationForOffset = function(offset) {
        if (null != (indentationEdit = this.indentationBag.FindIndent(offset))) return indentationEdit.Indentation();
        for(var indentationEdit, lineText = this.snapshot.GetLineFromPosition(offset).getText(), index = 0; index < lineText.length && (' ' == lineText.charAt(index) || '\t' == lineText.charAt(index));)++index;
        return lineText.substr(0, index);
    }, _proto.RegisterIndentation = function(indent, sameLineIndent) {
        var indentationInfo = null;
        if (sameLineIndent) {
            var lineStartPosition = this.snapshot.GetLineFromPosition(indent.Position).startPosition(), lineIndentLength = indent.Position - lineStartPosition;
            indentationInfo = IndentationEditInfo.create2(indent.Position, indent.ReplaceWith, lineStartPosition, lineIndentLength);
        } else indentationInfo = new IndentationEditInfo(indent);
        this.indentationBag.AddIndent(indentationInfo);
    }, _proto.RegisterIndentation2 = function(position, indent) {
        this.RegisterIndentation(new TextEditInfo(position, 0, indent), !1);
    }, _proto.AdjustStartOffsetIfNeeded = function(token, node) {
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
            }
            updateStartOffset && ParseNodeExtensions.SetNodeSpan(node, token.Span.startPosition(), node.AuthorNode.Details.EndOffset);
        }
    }, _proto.IsMultiLineString = function(token) {
        return token.tokenID === TypeScript.TokenID.StringLiteral && this.snapshot.GetLineNumberFromPosition(token.Span.endPosition()) > this.snapshot.GetLineNumberFromPosition(token.Span.startPosition());
    }, Indenter.GetIndentSizeFromIndentText = function(indentText, editorOptions) {
        return GetIndentSizeFromText(indentText, editorOptions, !1);
    }, Indenter.GetIndentSizeFromText = function(text, editorOptions, includeNonIndentChars) {
        for(var indentSize = 0, i = 0; i < text.length; i++){
            var c = text.charAt(i);
            if ('\t' == c) indentSize = indentSize + editorOptions.TabSize - indentSize % editorOptions.TabSize;
            else if (' ' == c) indentSize += 1;
            else if (includeNonIndentChars) indentSize += 1;
            else break;
        }
        return indentSize;
    }, Indenter;
}(), Formatting1.Indenter = Indenter;
