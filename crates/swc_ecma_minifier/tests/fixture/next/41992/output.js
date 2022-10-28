"use strict";
(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
    [
        954
    ],
    {
        24588: function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
            class ht extends m.Component {
                constructor(e){
                    super(e), (0, W.default)(this, "onChange", (e, t, r)=>{
                        let { specActions: { changeParamByIdentity: a  } , onChangeKey: n  } = this.props;
                        a(n, e, t, r);
                    }), (0, W.default)(this, "onChangeConsumesWrapper", (e)=>{
                        let { specActions: { changeConsumesValue: t  } , onChangeKey: r  } = this.props;
                        t(r, e);
                    }), (0, W.default)(this, "toggleTab", (e)=>"parameters" === e ? this.setState({
                            parametersVisible: !0,
                            callbackVisible: !1
                        }) : "callbacks" === e ? this.setState({
                            callbackVisible: !0,
                            parametersVisible: !1
                        }) : void 0), (0, W.default)(this, "onChangeMediaType", (e)=>{
                        let { value: t , pathMethod: r  } = e, { specActions: a , oas3Selectors: n , oas3Actions: l  } = this.props;
                        const s = n.hasUserEditedBody(...r), o = n.shouldRetainRequestBodyValue(...r);
                        l.setRequestContentType({
                            value: t,
                            pathMethod: r
                        }), l.initRequestBodyValidateError({
                            pathMethod: r
                        }), s || (o || l.setRequestBodyValue({
                            value: void 0,
                            pathMethod: r
                        }), a.clearResponse(...r), a.clearRequest(...r), a.clearValidateParams(r));
                    }), this.state = {
                        callbackVisible: !1,
                        parametersVisible: !0
                    };
                }
                render() {
                    var e;
                    let { onTryoutClick: t , parameters: r , allowTryItOut: a , tryItOutEnabled: n , specPath: l , fn: s , getComponent: o , getConfigs: i , specSelectors: u , specActions: d , pathMethod: g , oas3Actions: v , oas3Selectors: E , operation: b  } = this.props;
                    const S = o("parameterRow"), _ = o("TryItOutButton"), w = o("contentType"), C = o("Callbacks", !0), x = o("RequestBody", !0), A = n && a, I = u.isOAS3(), R = b.get("requestBody"), N = (0, p.default)(e = (0, ft.default)((0, p.default)(r).call(r, (e, t)=>{
                        const r = t.get("in");
                        return e[r] ?? (e[r] = []), e[r].push(t), e;
                    }, {}))).call(e, (e, t)=>(0, h.default)(e).call(e, t), []);
                    return m.default.createElement("div", {
                        className: "opblock-section"
                    }, m.default.createElement("div", {
                        className: "opblock-section-header"
                    }, I ? m.default.createElement("div", {
                        className: "tab-header"
                    }, m.default.createElement("div", {
                        onClick: ()=>this.toggleTab("parameters"),
                        className: `tab-item ${this.state.parametersVisible && "active"}`
                    }, m.default.createElement("h4", {
                        className: "opblock-title"
                    }, m.default.createElement("span", null, "Parameters"))), b.get("callbacks") ? m.default.createElement("div", {
                        onClick: ()=>this.toggleTab("callbacks"),
                        className: `tab-item ${this.state.callbackVisible && "active"}`
                    }, m.default.createElement("h4", {
                        className: "opblock-title"
                    }, m.default.createElement("span", null, "Callbacks"))) : null) : m.default.createElement("div", {
                        className: "tab-header"
                    }, m.default.createElement("h4", {
                        className: "opblock-title"
                    }, "Parameters")), a ? m.default.createElement(_, {
                        isOAS3: u.isOAS3(),
                        hasUserEditedBody: E.hasUserEditedBody(...g),
                        enabled: n,
                        onCancelClick: this.props.onCancelClick,
                        onTryoutClick: t,
                        onResetClick: ()=>v.setRequestBodyValue({
                                value: void 0,
                                pathMethod: g
                            })
                    }) : null), this.state.parametersVisible ? m.default.createElement("div", {
                        className: "parameters-container"
                    }, N.length ? m.default.createElement("div", {
                        className: "table-container"
                    }, m.default.createElement("table", {
                        className: "parameters"
                    }, m.default.createElement("thead", null, m.default.createElement("tr", null, m.default.createElement("th", {
                        className: "col_header parameters-col_name"
                    }, "Name"), m.default.createElement("th", {
                        className: "col_header parameters-col_description"
                    }, "Description"))), m.default.createElement("tbody", null, (0, f.default)(N).call(N, (e, t)=>m.default.createElement(S, {
                            fn: s,
                            specPath: l.push(t.toString()),
                            getComponent: o,
                            getConfigs: i,
                            rawParam: e,
                            param: u.parameterWithMetaByIdentity(g, e),
                            key: `${e.get("in")}.${e.get("name")}`,
                            onChange: this.onChange,
                            onChangeConsumes: this.onChangeConsumesWrapper,
                            specSelectors: u,
                            specActions: d,
                            oas3Actions: v,
                            oas3Selectors: E,
                            pathMethod: g,
                            isExecute: A
                        }))))) : m.default.createElement("div", {
                        className: "opblock-description-wrapper"
                    }, m.default.createElement("p", null, "No parameters"))) : null, this.state.callbackVisible ? m.default.createElement("div", {
                        className: "callbacks-container opblock-description-wrapper"
                    }, m.default.createElement(C, {
                        callbacks: (0, y.Map)(b.get("callbacks")),
                        specPath: (0, c.default)(l).call(l, 0, -1).push("callbacks")
                    })) : null, I && R && this.state.parametersVisible && m.default.createElement("div", {
                        className: "opblock-section opblock-section-request-body"
                    }, m.default.createElement("div", {
                        className: "opblock-section-header"
                    }, m.default.createElement("h4", {
                        className: `opblock-title parameter__name ${R.get("required") && "required"}`
                    }, "Request body"), m.default.createElement("label", null, m.default.createElement(w, {
                        value: E.requestContentType(...g),
                        contentTypes: R.get("content", (0, y.List)()).keySeq(),
                        onChange: (e)=>{
                            this.onChangeMediaType({
                                value: e,
                                pathMethod: g
                            });
                        },
                        className: "body-param-content-type",
                        ariaLabel: "Request content type"
                    }))), m.default.createElement("div", {
                        className: "opblock-description-wrapper"
                    }, m.default.createElement(x, {
                        setRetainRequestBodyValueFlag: (e)=>v.setRetainRequestBodyValueFlag({
                                value: e,
                                pathMethod: g
                            }),
                        userHasEditedBody: E.hasUserEditedBody(...g),
                        specPath: (0, c.default)(l).call(l, 0, -1).push("requestBody"),
                        requestBody: R,
                        requestBodyValue: E.requestBodyValue(...g),
                        requestBodyInclusionSetting: E.requestBodyInclusionSetting(...g),
                        requestBodyErrors: E.requestBodyErrors(...g),
                        isExecute: A,
                        getConfigs: i,
                        activeExamplesKey: E.activeExamplesMember(...g, "requestBody", "requestBody"),
                        updateActiveExamplesKey: (e)=>{
                            this.props.oas3Actions.setActiveExamplesMember({
                                name: e,
                                pathMethod: this.props.pathMethod,
                                contextType: "requestBody",
                                contextName: "requestBody"
                            });
                        },
                        onChange: (e, t)=>{
                            if (t) {
                                const r = E.requestBodyValue(...g), a = y.Map.isMap(r) ? r : (0, y.Map)();
                                return v.setRequestBodyValue({
                                    pathMethod: g,
                                    value: a.setIn(t, e)
                                });
                            }
                            v.setRequestBodyValue({
                                value: e,
                                pathMethod: g
                            });
                        },
                        onChangeIncludeEmpty: (e, t)=>{
                            v.setRequestBodyInclusion({
                                pathMethod: g,
                                value: t,
                                name: e
                            });
                        },
                        contentType: E.requestContentType(...g)
                    }))));
                }
            }
            (0, W.default)(ht, "defaultProps", {
                onTryoutClick: Function.prototype,
                onCancelClick: Function.prototype,
                tryItOutEnabled: !1,
                allowTryItOut: !0,
                onChangeKey: [],
                specPath: []
            });
        }
    }
]);
