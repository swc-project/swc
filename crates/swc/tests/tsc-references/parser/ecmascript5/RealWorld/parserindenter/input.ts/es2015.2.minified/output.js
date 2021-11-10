var Formatting1;
!function(Formatting) {
    class Indenter {
        GetIndentationEdits(token, nextToken, node, sameLineIndent) {
            this.logger.information() && this.logger.log("GetIndentationEdits(t1=[" + token.Span.startPosition() + "," + token.Span.endPosition() + "], t2=[" + (null == nextToken ? "null" : nextToken.Span.startPosition() + "," + nextToken.Span.endPosition()) + "])");
            var result = this.GetIndentationEditsWorker(token, nextToken, node, sameLineIndent);
            if (this.logger.information()) for(var i = 0; i < result.count(); i++){
                var edit = result.get(i);
                this.logger.log("edit: minChar=" + edit.position + ", limChar=" + (edit.position + edit.length) + ", text=\"" + TypeScript.stringToLiteral(edit.replaceWith, 30) + "\"");
            }
            return result;
        }
        GetIndentationEditsWorker(token1, nextToken1, node1, sameLineIndent1) {
            var result = new List_TextEditInfo(), indentationInfo = null;
            if (this.AdjustStartOffsetIfNeeded(token1, node1), this.scriptBlockBeginLineNumber == token1.lineNumber()) return result;
            if (!sameLineIndent1 && this.IsMultiLineString(token1)) return result;
            if (null == (indentationInfo = this.GetSpecialCaseIndentation(token1, node1))) {
                for(; !node1.CanIndent() && null != node1.Parent && token1.Span.span.start() == node1.Parent.AuthorNode.Details.StartOffset;)node1 = node1.Parent;
                indentationInfo = node1.CanIndent() && token1.Span.span.start() == node1.AuthorNode.Details.StartOffset ? node1.GetEffectiveIndentation(this) : token1.Token == AuthorTokenKind.atkIdentifier && null != nextToken1 && nextToken1.Token == AuthorTokenKind.atkColon ? node1.GetEffectiveChildrenIndentation(this) : this.ApplyIndentationDeltaFromParent(token1, node1);
            }
            if (null != indentationInfo) {
                var edit = this.GetIndentEdit(indentationInfo, token1.Span.startPosition(), sameLineIndent1);
                null != edit && (this.RegisterIndentation(edit, sameLineIndent1), result.add(edit), token1.Token == AuthorTokenKind.atkComment) && this.GetCommentIndentationEdits(token1).foreach((item)=>{
                    result.add(item);
                });
            }
            return result;
        }
        GetCommentIndentationEdits(token2) {
            var result = new List_TextEditInfo();
            if (token2.Token != AuthorTokenKind.atkComment) return result;
            var commentLastLineNumber = this.snapshot.GetLineNumberFromPosition(token2.Span.endPosition());
            if (token2.lineNumber() == commentLastLineNumber) return result;
            var commentFirstLineIndentationDelta = this.GetIndentationDelta(token2.Span.startPosition(), null);
            if (void 0 != commentFirstLineIndentationDelta) for(var line = token2.lineNumber() + 1; line <= commentLastLineNumber; line++){
                var lineStartPosition = this.snapshot.GetLineFromLineNumber(line).startPosition(), lineIndent = this.GetLineIndentationForOffset(lineStartPosition), commentIndentationInfo = this.ApplyIndentationDelta2(lineIndent, commentFirstLineIndentationDelta);
                if (null != commentIndentationInfo) {
                    var tokenStartPosition = lineStartPosition + lineIndent.length, commentIndentationEdit = this.GetIndentEdit(commentIndentationInfo, tokenStartPosition, !1);
                    null != commentIndentationEdit && result.add(commentIndentationEdit);
                }
            }
            return result;
        }
        static GetIndentSizeFromIndentText(indentText, editorOptions) {
            return GetIndentSizeFromText(indentText, editorOptions, !1);
        }
        static GetIndentSizeFromText(text, editorOptions1, includeNonIndentChars) {
            for(var indentSize = 0, i = 0; i < text.length; i++){
                var c = text.charAt(i);
                if ("\t" == c) indentSize = indentSize + editorOptions1.TabSize - indentSize % editorOptions1.TabSize;
                else if (" " == c) indentSize += 1;
                else if (includeNonIndentChars) indentSize += 1;
                else break;
            }
            return indentSize;
        }
        GetSpecialCaseIndentation(token3, node2) {
            var indentationInfo = null;
            switch(token3.Token){
                case AuthorTokenKind.atkLCurly:
                    return indentationInfo = this.GetSpecialCaseIndentationForLCurly(node2);
                case AuthorTokenKind.atkElse:
                case AuthorTokenKind.atkRBrack:
                    return indentationInfo = node2.GetNodeStartLineIndentation(this);
                case AuthorTokenKind.atkRCurly:
                    return node2.AuthorNode.Details.Kind == AuthorParseNodeKind.apnkBlock && node2.AuthorNode.EdgeLabel == AuthorParseNodeEdge.apneBody && (node2 = node2.Parent), indentationInfo = node2.GetNodeStartLineIndentation(this);
                case AuthorTokenKind.atkWhile:
                    if (node2.AuthorNode.Details.Kind == AuthorParseNodeKind.apnkDoWhile) return indentationInfo = node2.GetNodeStartLineIndentation(this);
                    return null;
                case AuthorTokenKind.atkSColon:
                    return this.GetSpecialCaseIndentationForSemicolon(token3, node2);
                case AuthorTokenKind.atkComment:
                    return this.GetSpecialCaseIndentationForComment(token3, node2);
                default:
                    return indentationInfo;
            }
        }
        GetSpecialCaseIndentationForLCurly(node3) {
            return node3.AuthorNode.Details.Kind == AuthorParseNodeKind.apnkFncDecl || node3.AuthorNode.EdgeLabel == AuthorParseNodeEdge.apneThen || node3.AuthorNode.EdgeLabel == AuthorParseNodeEdge.apneElse ? node3.GetNodeStartLineIndentation(this) : node3.AuthorNode.Details.Kind != AuthorParseNodeKind.apnkObject || node3.CanIndent() ? node3.GetEffectiveIndentation(this) : null;
        }
        GetSpecialCaseIndentationForSemicolon(token4, node4) {
            if (this.smartIndent) return node4.GetEffectiveChildrenIndentation(this);
            if (node4.AuthorNode.Details.Kind != AuthorParseNodeKind.apnkFor) {
                var semiColonStartSpan = new Span(token4.Span.startPosition(), 0);
                return (node4 = ParseTree.FindCommonParentNode(semiColonStartSpan, semiColonStartSpan, node4)).GetEffectiveChildrenIndentation(this);
            }
            return null;
        }
        GetSpecialCaseIndentationForComment(token5, node5) {
            var indentationInfo = null, twoCharSpan = token5.Span.Intersection(new Span(token5.Span.startPosition(), 2));
            if (null != twoCharSpan && ("//" == twoCharSpan.GetText() || "/*" == twoCharSpan.GetText())) {
                for(; null == node5.ChildrenIndentationDelta && null != node5.Parent;)node5 = node5.Parent;
                indentationInfo = this.CanIndentComment(token5, node5) ? node5.GetEffectiveChildrenIndentationForComment(this) : this.ApplyIndentationDeltaFromParent(token5, node5);
            }
            return indentationInfo;
        }
        CanIndentComment(token6, node6) {
            switch(node6.AuthorNode.Details.Kind){
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
                    return ParseNodeExtensions.FindChildrenWithEdge(node6, AuthorParseNodeEdge.apneArgument).foreach((argumentNode)=>{
                        token6.Span.startPosition() < argumentNode.AuthorNode.Details.StartOffset && (result = !1);
                    }), result;
            }
            return !1;
        }
        ApplyScriptBlockIndentation(languageHostIndentation, tree) {
            if (null != languageHostIndentation && null != tree.StartNodeSelf) {
                var scriptBlockIndentation = this.ApplyIndentationLevel(languageHostIndentation, 1);
                tree.Root.SetIndentationOverride(scriptBlockIndentation);
            }
        }
        GetIndentEdit(indentInfo, tokenStartPosition, sameLineIndent2) {
            var indentText = this.ApplyIndentationLevel(indentInfo.Prefix, indentInfo.Level);
            if (sameLineIndent2) return new TextEditInfo(tokenStartPosition, 0, indentText);
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
        ApplyIndentationLevel(existingIndentation, level) {
            var indentSize = this.editorOptions.IndentSize, tabSize = this.editorOptions.TabSize, convertTabsToSpaces = this.editorOptions.ConvertTabsToSpaces;
            if (level < 0) {
                if (StringUtils.IsNullOrEmpty(existingIndentation)) return "";
                var totalIndent = 0;
                return (StringUtils.foreach(existingIndentation, (c)=>{
                    "\t" == c ? totalIndent += tabSize : totalIndent++;
                }), (totalIndent += level * indentSize) < 0) ? "" : this.GetIndentString(null, totalIndent, tabSize, convertTabsToSpaces);
            }
            return this.GetIndentString(existingIndentation, level * indentSize, tabSize, convertTabsToSpaces);
        }
        GetIndentString(prefix, totalIndentSize, tabSize, convertTabsToSpaces) {
            var tabString = convertTabsToSpaces ? StringUtils.create(" ", tabSize) : "\t", text = "";
            StringUtils.IsNullOrEmpty(prefix) || (text += prefix);
            for(var pos = 0; pos <= totalIndentSize - tabSize;)text += tabString, pos += tabSize;
            for(; pos < totalIndentSize;)text += " ", pos++;
            return text;
        }
        ApplyIndentationDeltaFromParent(token7, node7) {
            for(var indentationInfo = null, indentableParent = node7; null != indentableParent && !indentableParent.CanIndent();)indentableParent = indentableParent.Parent;
            if (null != indentableParent && indentableParent.AuthorNode.Details.Kind != AuthorParseNodeKind.apnkProg) {
                var parentIndentationDeltaSize = this.GetIndentationDelta(indentableParent.AuthorNode.Details.StartOffset, token7.Span.startPosition());
                void 0 !== parentIndentationDeltaSize && (indentationInfo = this.ApplyIndentationDelta1(token7.Span.startPosition(), parentIndentationDeltaSize));
            }
            return indentationInfo;
        }
        ApplyIndentationDelta1(tokenStartPosition1, delta) {
            var snapshotLine = this.snapshot.GetLineFromPosition(tokenStartPosition1), currentIndentSpan = new Span(snapshotLine.startPosition(), tokenStartPosition1 - snapshotLine.startPosition()), currentIndent = this.snapshot.GetText(currentIndentSpan);
            return this.ApplyIndentationDelta2(currentIndent, delta);
        }
        ApplyIndentationDelta2(currentIndent, delta1) {
            if (0 == delta1) return null;
            var newIndentSize = Indenter.GetIndentSizeFromIndentText(currentIndent, this.editorOptions) + delta1;
            newIndentSize < 0 && (newIndentSize = 0);
            var newIndent = this.GetIndentString(null, newIndentSize, this.editorOptions.TabSize, this.editorOptions.ConvertTabsToSpaces);
            return null != newIndent ? new IndentationInfo(newIndent, 0) : null;
        }
        GetIndentationDelta(tokenStartPosition2, childTokenStartPosition) {
            Debug.Assert(void 0 !== childTokenStartPosition, "Error: caller must pass 'null' for undefined position");
            var indentationDeltaSize = this.offsetIndentationDeltas.GetValue(tokenStartPosition2);
            if (null === indentationDeltaSize) {
                var indentEditInfo = this.indentationBag.FindIndent(tokenStartPosition2);
                if (null == indentEditInfo) return null;
                var origIndentText = this.snapshot.GetText(new Span(indentEditInfo.OrigIndentPosition, indentEditInfo.OrigIndentLength())), newIndentText = indentEditInfo.Indentation(), origIndentSize = Indenter.GetIndentSizeFromText(origIndentText, this.editorOptions, !0), newIndentSize = Indenter.GetIndentSizeFromIndentText(newIndentText, this.editorOptions);
                if (null !== childTokenStartPosition) {
                    var childTokenLineStartPosition = this.snapshot.GetLineFromPosition(childTokenStartPosition).startPosition(), childIndentText = this.snapshot.GetText(new Span(childTokenLineStartPosition, childTokenStartPosition - childTokenLineStartPosition));
                    Indenter.GetIndentSizeFromIndentText(childIndentText, this.editorOptions) < origIndentSize && (origIndentSize = Indenter.GetIndentSizeFromIndentText(origIndentText, this.editorOptions));
                }
                indentationDeltaSize = newIndentSize - origIndentSize, this.offsetIndentationDeltas.Add(tokenStartPosition2, indentationDeltaSize);
            }
            return indentationDeltaSize;
        }
        FillInheritedIndentation(tree1) {
            var offset = -1, indentNode = null;
            if (null != tree1.StartNodeSelf) if (this.smartIndent || null === tree1.StartNodePreviousSibling || 0 != tree1.StartNodeSelf.AuthorNode.Label || 0 != tree1.StartNodePreviousSibling.Label) {
                if (this.smartIndent) for(parent = tree1.StartNodeSelf; null != parent && parent.AuthorNode.Details.StartOffset == this.firstToken.Span.startPosition();)parent = parent.Parent;
                else {
                    var startNodeLineNumber = this.snapshot.GetLineNumberFromPosition(tree1.StartNodeSelf.AuthorNode.Details.StartOffset);
                    for(parent = tree1.StartNodeSelf.Parent; null != parent && startNodeLineNumber == this.snapshot.GetLineNumberFromPosition(parent.AuthorNode.Details.StartOffset);)parent = parent.Parent;
                }
                for(; null != parent && !parent.CanIndent();)parent = parent.Parent;
                null != parent && parent.AuthorNode.Details.Kind != AuthorParseNodeKind.apnkProg && (offset = parent.AuthorNode.Details.StartOffset, indentNode = parent);
            } else {
                indentNode = tree1.StartNodeSelf, offset = tree1.StartNodePreviousSibling.Details.StartOffset;
                for(var parent, lineNum = this.snapshot.GetLineNumberFromPosition(offset), node = indentNode; null != node.Parent && this.snapshot.GetLineNumberFromPosition(node.Parent.AuthorNode.Details.StartOffset) == lineNum;)(node = node.Parent).CanIndent() && ((indentNode = node).IndentationDelta = 0);
            }
            if (null != indentNode) {
                var indentOverride = this.GetLineIndentationForOffset(offset);
                this.smartIndent || null === tree1.StartNodePreviousSibling || null == indentNode.Parent || ParseNodeExtensions.GetChildren(indentNode.Parent).foreach((sibling)=>{
                    sibling !== indentNode && sibling.CanIndent() && sibling.SetIndentationOverride(indentOverride);
                });
                var lastDelta = 0, lastLine = this.snapshot.GetLineNumberFromPosition(indentNode.AuthorNode.Details.StartOffset);
                do {
                    var currentLine = this.snapshot.GetLineNumberFromPosition(indentNode.AuthorNode.Details.StartOffset);
                    lastLine != currentLine && (lastLine = currentLine, indentOverride = this.ApplyIndentationLevel(indentOverride, -lastDelta), lastDelta = 0), indentNode.CanIndent() && (indentNode.SetIndentationOverride(indentOverride), lastDelta = indentNode.IndentationDelta), indentNode = indentNode.Parent;
                }while (null != indentNode)
            }
        }
        GetLineIndentationForOffset(offset) {
            var indentationEdit;
            if (null != (indentationEdit = this.indentationBag.FindIndent(offset))) return indentationEdit.Indentation();
            for(var lineText = this.snapshot.GetLineFromPosition(offset).getText(), index = 0; index < lineText.length && (" " == lineText.charAt(index) || "\t" == lineText.charAt(index));)++index;
            return lineText.substr(0, index);
        }
        RegisterIndentation(indent, sameLineIndent3) {
            var indentationInfo = null;
            if (sameLineIndent3) {
                var lineStartPosition = this.snapshot.GetLineFromPosition(indent.Position).startPosition(), lineIndentLength = indent.Position - lineStartPosition;
                indentationInfo = IndentationEditInfo.create2(indent.Position, indent.ReplaceWith, lineStartPosition, lineIndentLength);
            } else indentationInfo = new IndentationEditInfo(indent);
            this.indentationBag.AddIndent(indentationInfo);
        }
        RegisterIndentation2(position, indent1) {
            this.RegisterIndentation(new TextEditInfo(position, 0, indent1), !1);
        }
        AdjustStartOffsetIfNeeded(token8, node8) {
            if (null != token8) {
                var updateStartOffset = !1;
                switch(token8.Token){
                    case AuthorTokenKind.atkFunction:
                        updateStartOffset = node8.AuthorNode.Details.Kind == AuthorParseNodeKind.apnkFncDecl;
                        break;
                    case AuthorTokenKind.atkLCurly:
                        updateStartOffset = node8.AuthorNode.Details.Kind == AuthorParseNodeKind.apnkObject;
                        break;
                    case AuthorTokenKind.atkLBrack:
                        updateStartOffset = node8.AuthorNode.Details.Kind == AuthorParseNodeKind.apnkArray;
                        break;
                }
                updateStartOffset && ParseNodeExtensions.SetNodeSpan(node8, token8.Span.startPosition(), node8.AuthorNode.Details.EndOffset);
            }
        }
        IsMultiLineString(token9) {
            return token9.tokenID === TypeScript.TokenID.StringLiteral && this.snapshot.GetLineNumberFromPosition(token9.Span.endPosition()) > this.snapshot.GetLineNumberFromPosition(token9.Span.startPosition());
        }
        constructor(logger, tree2, snapshot, languageHostIndentation1, editorOptions2, firstToken, smartIndent){
            this.logger = logger, this.tree = tree2, this.snapshot = snapshot, this.languageHostIndentation = languageHostIndentation1, this.editorOptions = editorOptions2, this.firstToken = firstToken, this.smartIndent = smartIndent, this.indentationBag = new IndentationBag(this.snapshot), this.scriptBlockBeginLineNumber = -1, this.offsetIndentationDeltas = new Dictionary_int_int(), this.tree.Root.SetIndentationOverride(""), this.ApplyScriptBlockIndentation(this.languageHostIndentation, this.tree), this.FillInheritedIndentation(this.tree);
        }
    }
    Formatting.Indenter = Indenter;
}(Formatting1 || (Formatting1 = {
}));
