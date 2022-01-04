"use strict";
(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[7022],{

/***/ 7022:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "z0": function() { return /* binding */ IonMenu; }
});

// UNUSED EXPORTS: CreateAnimation, DefaultIonLifeCycleContext, IonActionSheet, IonAlert, IonApp, IonAvatar, IonBackButton, IonBackdrop, IonBadge, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCheckbox, IonChip, IonCol, IonContent, IonDatetime, IonFab, IonFabButton, IonFabList, IonFooter, IonGrid, IonHeader, IonIcon, IonImg, IonInfiniteScroll, IonInfiniteScrollContent, IonInput, IonItem, IonItemDivider, IonItemGroup, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonLifeCycleContext, IonList, IonListHeader, IonLoading, IonMenuButton, IonMenuToggle, IonModal, IonNav, IonNote, IonPage, IonPicker, IonPickerColumn, IonPopover, IonProgressBar, IonRadio, IonRadioGroup, IonRange, IonRedirect, IonRefresher, IonRefresherContent, IonReorder, IonReorderGroup, IonRippleEffect, IonRoute, IonRouterContext, IonRouterLink, IonRouterOutlet, IonRow, IonSearchbar, IonSegment, IonSegmentButton, IonSelect, IonSelectOption, IonSelectPopover, IonSkeletonText, IonSlide, IonSlides, IonSpinner, IonSplitPane, IonTab, IonTabBar, IonTabButton, IonTabs, IonTabsContext, IonText, IonTextarea, IonThumbnail, IonTitle, IonToast, IonToggle, IonToolbar, IonVirtualScroll, IonicSafeString, IonicSlides, IonicSwiper, LocationHistory, NavContext, NavManager, RouteManagerContext, StackContext, ViewLifeCycleManager, ViewStacks, createAnimation, createGesture, generateId, getConfig, getPlatforms, iosTransitionAnimation, isPlatform, mdTransitionAnimation, setupConfig, useIonActionSheet, useIonAlert, useIonLoading, useIonModal, useIonPicker, useIonPopover, useIonRouter, useIonToast, useIonViewDidEnter, useIonViewDidLeave, useIonViewWillEnter, useIonViewWillLeave, withIonLifeCycle

// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(7294);
// EXTERNAL MODULE: ./node_modules/@ionic/core/dist/esm-es5/index-7a8b7a1c.js
var index_7a8b7a1c = __webpack_require__(5121);
// EXTERNAL MODULE: ./node_modules/@ionic/core/dist/esm-es5/ionic-global-63a97a32.js
var ionic_global_63a97a32 = __webpack_require__(3007);
;// CONCATENATED MODULE: ./node_modules/@ionic/core/dist/esm-es5/app-globals-fd807b9a.js
var globalScripts=ionic_global_63a97a32.i;
;// CONCATENATED MODULE: ./node_modules/@ionic/core/dist/esm-es5/loader.js
var patchEsm=function(){if(!(index_7a8b7a1c.C&&index_7a8b7a1c.C.supports&&index_7a8b7a1c.C.supports("color","var(--c)"))){return __webpack_require__.e(/* import() */ 5999).then(__webpack_require__.t.bind(__webpack_require__, 5999, 23)).then((function(){if(index_7a8b7a1c.p.$cssShim$=index_7a8b7a1c.w.__cssshim){return index_7a8b7a1c.p.$cssShim$.i()}else{return 0}}))}return (0,index_7a8b7a1c.a)()};var defineCustomElements=function(e,o){if(typeof window==="undefined")return Promise.resolve();return patchEsm().then((function(){globalScripts();return (0,index_7a8b7a1c.b)(JSON.parse('[["ion-select_3",[[2,"ion-select-popover",{"header":[1],"subHeader":[1,"sub-header"],"message":[1],"options":[16]},[[0,"ionChange","onSelect"]]],[33,"ion-select",{"disabled":[4],"cancelText":[1,"cancel-text"],"okText":[1,"ok-text"],"placeholder":[1],"name":[1],"selectedText":[1,"selected-text"],"multiple":[4],"interface":[1],"interfaceOptions":[8,"interface-options"],"compareWith":[1,"compare-with"],"value":[1032],"isExpanded":[32],"open":[64]}],[1,"ion-select-option",{"disabled":[4],"value":[8]}]]],["ion-menu_3",[[33,"ion-menu-button",{"color":[513],"disabled":[4],"menu":[1],"autoHide":[4,"auto-hide"],"type":[1],"visible":[32]},[[16,"ionMenuChange","visibilityChanged"],[16,"ionSplitPaneVisible","visibilityChanged"]]],[33,"ion-menu",{"contentId":[513,"content-id"],"menuId":[513,"menu-id"],"type":[1025],"disabled":[1028],"side":[513],"swipeGesture":[4,"swipe-gesture"],"maxEdgeStart":[2,"max-edge-start"],"isPaneVisible":[32],"isEndSide":[32],"isOpen":[64],"isActive":[64],"open":[64],"close":[64],"toggle":[64],"setOpen":[64]},[[16,"ionSplitPaneVisible","onSplitPaneChanged"],[2,"click","onBackdropClick"],[0,"keydown","onKeydown"]]],[1,"ion-menu-toggle",{"menu":[1],"autoHide":[4,"auto-hide"],"visible":[32]},[[16,"ionMenuChange","visibilityChanged"],[16,"ionSplitPaneVisible","visibilityChanged"]]]]],["ion-action-sheet",[[34,"ion-action-sheet",{"overlayIndex":[2,"overlay-index"],"keyboardClose":[4,"keyboard-close"],"enterAnimation":[16],"leaveAnimation":[16],"buttons":[16],"cssClass":[1,"css-class"],"backdropDismiss":[4,"backdrop-dismiss"],"header":[1],"subHeader":[1,"sub-header"],"translucent":[4],"animated":[4],"htmlAttributes":[16],"present":[64],"dismiss":[64],"onDidDismiss":[64],"onWillDismiss":[64]}]]],["ion-fab_3",[[33,"ion-fab-button",{"color":[513],"activated":[4],"disabled":[4],"download":[1],"href":[1],"rel":[1],"routerDirection":[1,"router-direction"],"routerAnimation":[16],"target":[1],"show":[4],"translucent":[4],"type":[1],"size":[1],"closeIcon":[1,"close-icon"]}],[1,"ion-fab",{"horizontal":[1],"vertical":[1],"edge":[4],"activated":[1028],"close":[64]}],[1,"ion-fab-list",{"activated":[4],"side":[1]}]]],["ion-refresher_2",[[0,"ion-refresher-content",{"pullingIcon":[1025,"pulling-icon"],"pullingText":[1,"pulling-text"],"refreshingSpinner":[1025,"refreshing-spinner"],"refreshingText":[1,"refreshing-text"]}],[32,"ion-refresher",{"pullMin":[2,"pull-min"],"pullMax":[2,"pull-max"],"closeDuration":[1,"close-duration"],"snapbackDuration":[1,"snapback-duration"],"pullFactor":[2,"pull-factor"],"disabled":[4],"nativeRefresher":[32],"state":[32],"complete":[64],"cancel":[64],"getProgress":[64]}]]],["ion-alert",[[34,"ion-alert",{"overlayIndex":[2,"overlay-index"],"keyboardClose":[4,"keyboard-close"],"enterAnimation":[16],"leaveAnimation":[16],"cssClass":[1,"css-class"],"header":[1],"subHeader":[1,"sub-header"],"message":[1],"buttons":[16],"inputs":[1040],"backdropDismiss":[4,"backdrop-dismiss"],"translucent":[4],"animated":[4],"htmlAttributes":[16],"present":[64],"dismiss":[64],"onDidDismiss":[64],"onWillDismiss":[64]},[[4,"keydown","onKeydown"]]]]],["ion-back-button",[[33,"ion-back-button",{"color":[513],"defaultHref":[1025,"default-href"],"disabled":[516],"icon":[1],"text":[1],"type":[1],"routerAnimation":[16]}]]],["ion-loading",[[34,"ion-loading",{"overlayIndex":[2,"overlay-index"],"keyboardClose":[4,"keyboard-close"],"enterAnimation":[16],"leaveAnimation":[16],"message":[1],"cssClass":[1,"css-class"],"duration":[2],"backdropDismiss":[4,"backdrop-dismiss"],"showBackdrop":[4,"show-backdrop"],"spinner":[1025],"translucent":[4],"animated":[4],"htmlAttributes":[16],"present":[64],"dismiss":[64],"onDidDismiss":[64],"onWillDismiss":[64]}]]],["ion-toast",[[33,"ion-toast",{"overlayIndex":[2,"overlay-index"],"color":[513],"enterAnimation":[16],"leaveAnimation":[16],"cssClass":[1,"css-class"],"duration":[2],"header":[1],"message":[1],"keyboardClose":[4,"keyboard-close"],"position":[1],"buttons":[16],"translucent":[4],"animated":[4],"htmlAttributes":[16],"present":[64],"dismiss":[64],"onDidDismiss":[64],"onWillDismiss":[64]}]]],["ion-card_5",[[33,"ion-card",{"color":[513],"button":[4],"type":[1],"disabled":[4],"download":[1],"href":[1],"rel":[1],"routerDirection":[1,"router-direction"],"routerAnimation":[16],"target":[1]}],[32,"ion-card-content"],[33,"ion-card-header",{"color":[513],"translucent":[4]}],[33,"ion-card-subtitle",{"color":[513]}],[33,"ion-card-title",{"color":[513]}]]],["ion-item-option_3",[[33,"ion-item-option",{"color":[513],"disabled":[4],"download":[1],"expandable":[4],"href":[1],"rel":[1],"target":[1],"type":[1]}],[32,"ion-item-options",{"side":[1],"fireSwipeEvent":[64]}],[0,"ion-item-sliding",{"disabled":[4],"state":[32],"getOpenAmount":[64],"getSlidingRatio":[64],"open":[64],"close":[64],"closeOpened":[64]}]]],["ion-infinite-scroll_2",[[32,"ion-infinite-scroll-content",{"loadingSpinner":[1025,"loading-spinner"],"loadingText":[1,"loading-text"]}],[0,"ion-infinite-scroll",{"threshold":[1],"disabled":[4],"position":[1],"isLoading":[32],"complete":[64]}]]],["ion-reorder_2",[[33,"ion-reorder",null,[[2,"click","onClick"]]],[0,"ion-reorder-group",{"disabled":[4],"state":[32],"complete":[64]}]]],["ion-segment_2",[[33,"ion-segment-button",{"disabled":[4],"layout":[1],"type":[1],"value":[1],"checked":[32]}],[33,"ion-segment",{"color":[513],"disabled":[4],"scrollable":[4],"swipeGesture":[4,"swipe-gesture"],"value":[1025],"activated":[32]}]]],["ion-tab-bar_2",[[33,"ion-tab-button",{"disabled":[4],"download":[1],"href":[1],"rel":[1],"layout":[1025],"selected":[1028],"tab":[1],"target":[1]},[[8,"ionTabBarChanged","onTabBarChanged"]]],[33,"ion-tab-bar",{"color":[513],"selectedTab":[1,"selected-tab"],"translucent":[4],"keyboardVisible":[32]}]]],["ion-chip",[[33,"ion-chip",{"color":[513],"outline":[4],"disabled":[4]}]]],["ion-modal",[[34,"ion-modal",{"overlayIndex":[2,"overlay-index"],"delegate":[16],"keyboardClose":[4,"keyboard-close"],"enterAnimation":[16],"leaveAnimation":[16],"component":[1],"componentProps":[16],"cssClass":[1,"css-class"],"backdropDismiss":[4,"backdrop-dismiss"],"showBackdrop":[4,"show-backdrop"],"animated":[4],"swipeToClose":[4,"swipe-to-close"],"presentingElement":[16],"htmlAttributes":[16],"present":[64],"dismiss":[64],"onDidDismiss":[64],"onWillDismiss":[64]}]]],["ion-popover",[[34,"ion-popover",{"delegate":[16],"overlayIndex":[2,"overlay-index"],"enterAnimation":[16],"leaveAnimation":[16],"component":[1],"componentProps":[16],"keyboardClose":[4,"keyboard-close"],"cssClass":[1,"css-class"],"backdropDismiss":[4,"backdrop-dismiss"],"event":[8],"showBackdrop":[4,"show-backdrop"],"translucent":[4],"animated":[4],"htmlAttributes":[16],"present":[64],"dismiss":[64],"onDidDismiss":[64],"onWillDismiss":[64]}]]],["ion-searchbar",[[34,"ion-searchbar",{"color":[513],"animated":[4],"autocomplete":[1],"autocorrect":[1],"cancelButtonIcon":[1,"cancel-button-icon"],"cancelButtonText":[1,"cancel-button-text"],"clearIcon":[1,"clear-icon"],"debounce":[2],"disabled":[4],"inputmode":[1],"enterkeyhint":[1],"placeholder":[1],"searchIcon":[1,"search-icon"],"showCancelButton":[1,"show-cancel-button"],"showClearButton":[1,"show-clear-button"],"spellcheck":[4],"type":[1],"value":[1025],"focused":[32],"noAnimate":[32],"setFocus":[64],"getInputElement":[64]}]]],["ion-app_8",[[0,"ion-app"],[34,"ion-buttons",{"collapse":[4]}],[1,"ion-content",{"color":[513],"fullscreen":[4],"forceOverscroll":[1028,"force-overscroll"],"scrollX":[4,"scroll-x"],"scrollY":[4,"scroll-y"],"scrollEvents":[4,"scroll-events"],"getScrollElement":[64],"scrollToTop":[64],"scrollToBottom":[64],"scrollByPoint":[64],"scrollToPoint":[64]},[[8,"appload","onAppLoad"],[2,"click","onClick"]]],[36,"ion-footer",{"translucent":[4]}],[36,"ion-header",{"collapse":[1],"translucent":[4]}],[1,"ion-router-outlet",{"mode":[1025],"delegate":[16],"animated":[4],"animation":[16],"swipeHandler":[16],"commit":[64],"setRouteId":[64],"getRouteId":[64]}],[33,"ion-title",{"color":[513],"size":[1]}],[33,"ion-toolbar",{"color":[513]},[[0,"ionStyle","childrenStyle"]]]]],["ion-route_4",[[0,"ion-route",{"url":[1],"component":[1],"componentProps":[16],"beforeLeave":[16],"beforeEnter":[16]}],[0,"ion-route-redirect",{"from":[1],"to":[1]}],[0,"ion-router",{"root":[1],"useHash":[4,"use-hash"],"canTransition":[64],"push":[64],"back":[64],"printDebug":[64],"navChanged":[64]},[[8,"popstate","onPopState"],[4,"ionBackButton","onBackButton"]]],[1,"ion-router-link",{"color":[513],"href":[1],"rel":[1],"routerDirection":[1,"router-direction"],"routerAnimation":[16],"target":[1]}]]],["ion-avatar_3",[[33,"ion-avatar"],[33,"ion-badge",{"color":[513]}],[1,"ion-thumbnail"]]],["ion-col_3",[[1,"ion-col",{"offset":[1],"offsetXs":[1,"offset-xs"],"offsetSm":[1,"offset-sm"],"offsetMd":[1,"offset-md"],"offsetLg":[1,"offset-lg"],"offsetXl":[1,"offset-xl"],"pull":[1],"pullXs":[1,"pull-xs"],"pullSm":[1,"pull-sm"],"pullMd":[1,"pull-md"],"pullLg":[1,"pull-lg"],"pullXl":[1,"pull-xl"],"push":[1],"pushXs":[1,"push-xs"],"pushSm":[1,"push-sm"],"pushMd":[1,"push-md"],"pushLg":[1,"push-lg"],"pushXl":[1,"push-xl"],"size":[1],"sizeXs":[1,"size-xs"],"sizeSm":[1,"size-sm"],"sizeMd":[1,"size-md"],"sizeLg":[1,"size-lg"],"sizeXl":[1,"size-xl"]},[[9,"resize","onResize"]]],[1,"ion-grid",{"fixed":[4]}],[1,"ion-row"]]],["ion-nav_2",[[1,"ion-nav",{"delegate":[16],"swipeGesture":[1028,"swipe-gesture"],"animated":[4],"animation":[16],"rootParams":[16],"root":[1],"push":[64],"insert":[64],"insertPages":[64],"pop":[64],"popTo":[64],"popToRoot":[64],"removeIndex":[64],"setRoot":[64],"setPages":[64],"setRouteId":[64],"getRouteId":[64],"getActive":[64],"getByIndex":[64],"canGoBack":[64],"getPrevious":[64]}],[0,"ion-nav-link",{"component":[1],"componentProps":[16],"routerDirection":[1,"router-direction"],"routerAnimation":[16]}]]],["ion-slide_2",[[0,"ion-slide"],[36,"ion-slides",{"options":[8],"pager":[4],"scrollbar":[4],"update":[64],"updateAutoHeight":[64],"slideTo":[64],"slideNext":[64],"slidePrev":[64],"getActiveIndex":[64],"getPreviousIndex":[64],"length":[64],"isEnd":[64],"isBeginning":[64],"startAutoplay":[64],"stopAutoplay":[64],"lockSwipeToNext":[64],"lockSwipeToPrev":[64],"lockSwipes":[64],"getSwiper":[64]}]]],["ion-tab_2",[[1,"ion-tab",{"active":[1028],"delegate":[16],"tab":[1],"component":[1],"setActive":[64]}],[1,"ion-tabs",{"useRouter":[1028,"use-router"],"selectedTab":[32],"select":[64],"getTab":[64],"getSelected":[64],"setRouteId":[64],"getRouteId":[64]}]]],["ion-checkbox",[[33,"ion-checkbox",{"color":[513],"name":[1],"checked":[1028],"indeterminate":[1028],"disabled":[4],"value":[1]}]]],["ion-img",[[1,"ion-img",{"alt":[1],"src":[1],"loadSrc":[32],"loadError":[32]}]]],["ion-input",[[34,"ion-input",{"fireFocusEvents":[4,"fire-focus-events"],"color":[513],"accept":[1],"autocapitalize":[1],"autocomplete":[1],"autocorrect":[1],"autofocus":[4],"clearInput":[4,"clear-input"],"clearOnEdit":[4,"clear-on-edit"],"debounce":[2],"disabled":[4],"enterkeyhint":[1],"inputmode":[1],"max":[1],"maxlength":[2],"min":[1],"minlength":[2],"multiple":[4],"name":[1],"pattern":[1],"placeholder":[1],"readonly":[4],"required":[4],"spellcheck":[4],"step":[1],"size":[2],"type":[1],"value":[1032],"hasFocus":[32],"setFocus":[64],"setBlur":[64],"getInputElement":[64]}]]],["ion-progress-bar",[[33,"ion-progress-bar",{"type":[1],"reversed":[4],"value":[2],"buffer":[2],"color":[513]}]]],["ion-range",[[33,"ion-range",{"color":[513],"debounce":[2],"name":[1],"dualKnobs":[4,"dual-knobs"],"min":[2],"max":[2],"pin":[4],"snaps":[4],"step":[2],"ticks":[4],"disabled":[4],"value":[1026],"ratioA":[32],"ratioB":[32],"pressedKnob":[32]}]]],["ion-split-pane",[[33,"ion-split-pane",{"contentId":[513,"content-id"],"disabled":[4],"when":[8],"visible":[32]}]]],["ion-text",[[1,"ion-text",{"color":[513]}]]],["ion-textarea",[[34,"ion-textarea",{"fireFocusEvents":[4,"fire-focus-events"],"color":[513],"autocapitalize":[1],"autofocus":[4],"clearOnEdit":[1028,"clear-on-edit"],"debounce":[2],"disabled":[4],"inputmode":[1],"enterkeyhint":[1],"maxlength":[2],"minlength":[2],"name":[1],"placeholder":[1],"readonly":[4],"required":[4],"spellcheck":[4],"cols":[2],"rows":[2],"wrap":[1],"autoGrow":[4,"auto-grow"],"value":[1025],"hasFocus":[32],"setFocus":[64],"setBlur":[64],"getInputElement":[64]}]]],["ion-toggle",[[33,"ion-toggle",{"color":[513],"name":[1],"checked":[1028],"disabled":[4],"value":[1],"activated":[32]}]]],["ion-virtual-scroll",[[0,"ion-virtual-scroll",{"approxItemHeight":[2,"approx-item-height"],"approxHeaderHeight":[2,"approx-header-height"],"approxFooterHeight":[2,"approx-footer-height"],"headerFn":[16],"footerFn":[16],"items":[16],"itemHeight":[16],"headerHeight":[16],"footerHeight":[16],"renderItem":[16],"renderHeader":[16],"renderFooter":[16],"nodeRender":[16],"domRender":[16],"totalHeight":[32],"positionForItem":[64],"checkRange":[64],"checkEnd":[64]},[[9,"resize","onResize"]]]]],["ion-datetime_3",[[34,"ion-picker",{"overlayIndex":[2,"overlay-index"],"keyboardClose":[4,"keyboard-close"],"enterAnimation":[16],"leaveAnimation":[16],"buttons":[16],"columns":[16],"cssClass":[1,"css-class"],"duration":[2],"showBackdrop":[4,"show-backdrop"],"backdropDismiss":[4,"backdrop-dismiss"],"animated":[4],"htmlAttributes":[16],"presented":[32],"present":[64],"dismiss":[64],"onDidDismiss":[64],"onWillDismiss":[64],"getColumn":[64]}],[33,"ion-datetime",{"name":[1],"disabled":[4],"readonly":[4],"min":[1025],"max":[1025],"displayFormat":[1,"display-format"],"displayTimezone":[1,"display-timezone"],"pickerFormat":[1,"picker-format"],"cancelText":[1,"cancel-text"],"doneText":[1,"done-text"],"yearValues":[8,"year-values"],"monthValues":[8,"month-values"],"dayValues":[8,"day-values"],"hourValues":[8,"hour-values"],"minuteValues":[8,"minute-values"],"monthNames":[1,"month-names"],"monthShortNames":[1,"month-short-names"],"dayNames":[1,"day-names"],"dayShortNames":[1,"day-short-names"],"pickerOptions":[16],"placeholder":[1],"value":[1025],"isExpanded":[32],"open":[64]}],[32,"ion-picker-column",{"col":[16]}]]],["ion-radio_2",[[33,"ion-radio",{"color":[513],"name":[1],"disabled":[4],"value":[8],"checked":[32],"buttonTabindex":[32],"setFocus":[64],"setButtonTabindex":[64]}],[0,"ion-radio-group",{"allowEmptySelection":[4,"allow-empty-selection"],"name":[1],"value":[1032]},[[4,"keydown","onKeydown"]]]]],["ion-spinner",[[1,"ion-spinner",{"color":[513],"duration":[2],"name":[1],"paused":[4]}]]],["ion-backdrop",[[33,"ion-backdrop",{"visible":[4],"tappable":[4],"stopPropagation":[4,"stop-propagation"]},[[2,"click","onMouseDown"]]]]],["ion-ripple-effect",[[1,"ion-ripple-effect",{"type":[1],"addRipple":[64]}]]],["ion-button_2",[[33,"ion-button",{"color":[513],"buttonType":[1025,"button-type"],"disabled":[516],"expand":[513],"fill":[1537],"routerDirection":[1,"router-direction"],"routerAnimation":[16],"download":[1],"href":[1],"rel":[1],"shape":[513],"size":[513],"strong":[4],"target":[1],"type":[1]}],[1,"ion-icon",{"mode":[1025],"color":[1],"ariaLabel":[1537,"aria-label"],"ariaHidden":[513,"aria-hidden"],"ios":[1],"md":[1],"flipRtl":[4,"flip-rtl"],"name":[513],"src":[1],"icon":[8],"size":[1],"lazy":[4],"sanitize":[4],"svgContent":[32],"isVisible":[32]}]]],["ion-item_8",[[33,"ion-item-divider",{"color":[513],"sticky":[4]}],[32,"ion-item-group"],[33,"ion-note",{"color":[513]}],[1,"ion-skeleton-text",{"animated":[4]}],[49,"ion-item",{"color":[513],"button":[4],"detail":[4],"detailIcon":[1,"detail-icon"],"disabled":[4],"download":[1],"href":[1],"rel":[1],"lines":[1],"routerAnimation":[16],"routerDirection":[1,"router-direction"],"target":[1],"type":[1],"multipleInputs":[32],"focusable":[32]},[[0,"ionColor","labelColorChanged"],[0,"ionStyle","itemStyle"]]],[34,"ion-label",{"color":[513],"position":[1],"noAnimate":[32]}],[32,"ion-list",{"lines":[1],"inset":[4],"closeSlidingItems":[64]}],[33,"ion-list-header",{"color":[513],"lines":[1]}]]]]'),o)}))};
;// CONCATENATED MODULE: ./node_modules/@ionic/core/loader/index.js

(function(){if("undefined"!==typeof window&&void 0!==window.Reflect&&void 0!==window.customElements){var a=HTMLElement;window.HTMLElement=function(){return Reflect.construct(a,[],this.constructor)};HTMLElement.prototype=a.prototype;HTMLElement.prototype.constructor=HTMLElement;Object.setPrototypeOf(HTMLElement,a)}})();



;// CONCATENATED MODULE: ./node_modules/ionicons/dist/esm-es5/utils-b4648582.js
var CACHED_MAP;var getIconMap=function(){if(typeof window==="undefined"){return new Map}else{if(!CACHED_MAP){var r=window;r.Ionicons=r.Ionicons||{};CACHED_MAP=r.Ionicons.map=r.Ionicons.map||new Map}return CACHED_MAP}};var addIcons=function(r){var e=getIconMap();Object.keys(r).forEach((function(t){return e.set(t,r[t])}))};var getUrl=function(r){var e=getSrc(r.src);if(e){return e}e=getName(r.name,r.icon,r.mode,r.ios,r.md);if(e){return getNamedUrl(e)}if(r.icon){e=getSrc(r.icon);if(e){return e}e=getSrc(r.icon[r.mode]);if(e){return e}}return null};var getNamedUrl=function(r){var e=getIconMap().get(r);if(e){return e}return getAssetPath("svg/"+r+".svg")};var getName=function(r,e,t,n,i){t=(t&&toLower(t))==="ios"?"ios":"md";if(n&&t==="ios"){r=toLower(n)}else if(i&&t==="md"){r=toLower(i)}else{if(!r&&e&&!isSrc(e)){r=e}if(isStr(r)){r=toLower(r)}}if(!isStr(r)||r.trim()===""){return null}var o=r.replace(/[a-z]|-|\d/gi,"");if(o!==""){return null}return r};var getSrc=function(r){if(isStr(r)){r=r.trim();if(isSrc(r)){return r}}return null};var isSrc=function(r){return r.length>0&&/(\/|\.)/.test(r)};var isStr=function(r){return typeof r==="string"};var toLower=function(r){return r.toLowerCase()};
// EXTERNAL MODULE: ./node_modules/ionicons/icons/index.mjs
var icons = __webpack_require__(8903);
// EXTERNAL MODULE: ./node_modules/@ionic/core/dist/index.js + 1 modules
var dist = __webpack_require__(6510);
;// CONCATENATED MODULE: ./node_modules/tslib/tslib.es6.js
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    }
    return __assign.apply(this, arguments);
}

function tslib_es6_rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __createBinding(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}

function __exportStar(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) exports[p] = m[p];
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result.default = mod;
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
}

function __classPrivateFieldSet(receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
}

// EXTERNAL MODULE: ./node_modules/react-dom/index.js
var react_dom = __webpack_require__(3935);
;// CONCATENATED MODULE: ./node_modules/@ionic/react/dist/index.esm.js
/* provided dependency */ var process = __webpack_require__(4155);









const IonLifeCycleContext = /*@__PURE__*/ react.createContext({
    onIonViewWillEnter: () => {
        return;
    },
    ionViewWillEnter: () => {
        return;
    },
    onIonViewDidEnter: () => {
        return;
    },
    ionViewDidEnter: () => {
        return;
    },
    onIonViewWillLeave: () => {
        return;
    },
    ionViewWillLeave: () => {
        return;
    },
    onIonViewDidLeave: () => {
        return;
    },
    ionViewDidLeave: () => {
        return;
    },
});
const DefaultIonLifeCycleContext = class {
    constructor() {
        this.ionViewWillEnterCallbacks = [];
        this.ionViewDidEnterCallbacks = [];
        this.ionViewWillLeaveCallbacks = [];
        this.ionViewDidLeaveCallbacks = [];
    }
    onIonViewWillEnter(callback) {
        if (callback.id) {
            const index = this.ionViewWillEnterCallbacks.findIndex((x) => x.id === callback.id);
            if (index > -1) {
                this.ionViewWillEnterCallbacks[index] = callback;
            }
            else {
                this.ionViewWillEnterCallbacks.push(callback);
            }
        }
        else {
            this.ionViewWillEnterCallbacks.push(callback);
        }
    }
    ionViewWillEnter() {
        this.ionViewWillEnterCallbacks.forEach((cb) => cb());
    }
    onIonViewDidEnter(callback) {
        if (callback.id) {
            const index = this.ionViewDidEnterCallbacks.findIndex((x) => x.id === callback.id);
            if (index > -1) {
                this.ionViewDidEnterCallbacks[index] = callback;
            }
            else {
                this.ionViewDidEnterCallbacks.push(callback);
            }
        }
        else {
            this.ionViewDidEnterCallbacks.push(callback);
        }
    }
    ionViewDidEnter() {
        this.ionViewDidEnterCallbacks.forEach((cb) => cb());
    }
    onIonViewWillLeave(callback) {
        if (callback.id) {
            const index = this.ionViewWillLeaveCallbacks.findIndex((x) => x.id === callback.id);
            if (index > -1) {
                this.ionViewWillLeaveCallbacks[index] = callback;
            }
            else {
                this.ionViewWillLeaveCallbacks.push(callback);
            }
        }
        else {
            this.ionViewWillLeaveCallbacks.push(callback);
        }
    }
    ionViewWillLeave() {
        this.ionViewWillLeaveCallbacks.forEach((cb) => cb());
    }
    onIonViewDidLeave(callback) {
        if (callback.id) {
            const index = this.ionViewDidLeaveCallbacks.findIndex((x) => x.id === callback.id);
            if (index > -1) {
                this.ionViewDidLeaveCallbacks[index] = callback;
            }
            else {
                this.ionViewDidLeaveCallbacks.push(callback);
            }
        }
        else {
            this.ionViewDidLeaveCallbacks.push(callback);
        }
    }
    ionViewDidLeave() {
        this.ionViewDidLeaveCallbacks.forEach((cb) => cb());
        this.componentCanBeDestroyed();
    }
    onComponentCanBeDestroyed(callback) {
        this.componentCanBeDestroyedCallback = callback;
    }
    componentCanBeDestroyed() {
        if (this.componentCanBeDestroyedCallback) {
            this.componentCanBeDestroyedCallback();
        }
    }
};

const withIonLifeCycle = (WrappedComponent) => {
    return class IonLifeCycle extends React.Component {
        constructor(props) {
            super(props);
            this.componentRef = React.createRef();
        }
        componentDidMount() {
            const element = this.componentRef.current;
            this.context.onIonViewWillEnter(() => {
                if (element && element.ionViewWillEnter) {
                    element.ionViewWillEnter();
                }
            });
            this.context.onIonViewDidEnter(() => {
                if (element && element.ionViewDidEnter) {
                    element.ionViewDidEnter();
                }
            });
            this.context.onIonViewWillLeave(() => {
                if (element && element.ionViewWillLeave) {
                    element.ionViewWillLeave();
                }
            });
            this.context.onIonViewDidLeave(() => {
                if (element && element.ionViewDidLeave) {
                    element.ionViewDidLeave();
                }
            });
        }
        render() {
            return (React.createElement(IonLifeCycleContext.Consumer, null, (context) => {
                this.context = context;
                return React.createElement(WrappedComponent, Object.assign({ ref: this.componentRef }, this.props));
            }));
        }
    };
};

const useIonViewWillEnter = (callback, deps = []) => {
    const context = useContext(IonLifeCycleContext);
    const id = useRef();
    id.current = id.current || Math.floor(Math.random() * 1000000);
    useEffect(() => {
        callback.id = id.current;
        context.onIonViewWillEnter(callback);
    }, deps);
};
const useIonViewDidEnter = (callback, deps = []) => {
    const context = useContext(IonLifeCycleContext);
    const id = useRef();
    id.current = id.current || Math.floor(Math.random() * 1000000);
    useEffect(() => {
        callback.id = id.current;
        context.onIonViewDidEnter(callback);
    }, deps);
};
const useIonViewWillLeave = (callback, deps = []) => {
    const context = useContext(IonLifeCycleContext);
    const id = useRef();
    id.current = id.current || Math.floor(Math.random() * 1000000);
    useEffect(() => {
        callback.id = id.current;
        context.onIonViewWillLeave(callback);
    }, deps);
};
const useIonViewDidLeave = (callback, deps = []) => {
    const context = useContext(IonLifeCycleContext);
    const id = useRef();
    id.current = id.current || Math.floor(Math.random() * 1000000);
    useEffect(() => {
        callback.id = id.current;
        context.onIonViewDidLeave(callback);
    }, deps);
};

const NavContext = /*@__PURE__*/ react.createContext({
    getIonRedirect: () => undefined,
    getIonRoute: () => undefined,
    getPageManager: () => undefined,
    getStackManager: () => undefined,
    goBack: (route) => {
        if (typeof window !== 'undefined') {
            if (typeof route === 'string') {
                window.location.pathname = route;
            }
            else {
                window.history.back();
            }
        }
    },
    navigate: (path) => {
        if (typeof window !== 'undefined') {
            window.location.pathname = path;
        }
    },
    hasIonicRouter: () => false,
    routeInfo: undefined,
    setCurrentTab: () => undefined,
    changeTab: (_tab, path) => {
        if (typeof window !== 'undefined') {
            window.location.pathname = path;
        }
    },
    resetTab: (_tab, path) => {
        if (typeof window !== 'undefined') {
            window.location.pathname = path;
        }
    },
});

const dashToPascalCase = (str) => str
    .toLowerCase()
    .split('-')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join('');
const camelToDashCase = (str) => str.replace(/([A-Z])/g, (m) => `-${m[0].toLowerCase()}`);

const attachProps = (node, newProps, oldProps = {}) => {
    // some test frameworks don't render DOM elements, so we test here to make sure we are dealing with DOM first
    if (node instanceof Element) {
        // add any classes in className to the class list
        const className = getClassName(node.classList, newProps, oldProps);
        if (className !== '') {
            node.className = className;
        }
        Object.keys(newProps).forEach((name) => {
            if (name === 'children' ||
                name === 'style' ||
                name === 'ref' ||
                name === 'class' ||
                name === 'className' ||
                name === 'forwardedRef') {
                return;
            }
            if (name.indexOf('on') === 0 && name[2] === name[2].toUpperCase()) {
                const eventName = name.substring(2);
                const eventNameLc = eventName[0].toLowerCase() + eventName.substring(1);
                if (!isCoveredByReact(eventNameLc)) {
                    syncEvent(node, eventNameLc, newProps[name]);
                }
            }
            else {
                const propType = typeof newProps[name];
                if (propType === 'string') {
                    node.setAttribute(camelToDashCase(name), newProps[name]);
                }
                else {
                    node[name] = newProps[name];
                }
            }
        });
    }
};
const getClassName = (classList, newProps, oldProps) => {
    const newClassProp = newProps.className || newProps.class;
    const oldClassProp = oldProps.className || oldProps.class;
    // map the classes to Maps for performance
    const currentClasses = arrayToMap(classList);
    const incomingPropClasses = arrayToMap(newClassProp ? newClassProp.split(' ') : []);
    const oldPropClasses = arrayToMap(oldClassProp ? oldClassProp.split(' ') : []);
    const finalClassNames = [];
    // loop through each of the current classes on the component
    // to see if it should be a part of the classNames added
    currentClasses.forEach((currentClass) => {
        if (incomingPropClasses.has(currentClass)) {
            // add it as its already included in classnames coming in from newProps
            finalClassNames.push(currentClass);
            incomingPropClasses.delete(currentClass);
        }
        else if (!oldPropClasses.has(currentClass)) {
            // add it as it has NOT been removed by user
            finalClassNames.push(currentClass);
        }
    });
    incomingPropClasses.forEach((s) => finalClassNames.push(s));
    return finalClassNames.join(' ');
};
/**
 * Checks if an event is supported in the current execution environment.
 * @license Modernizr 3.0.0pre (Custom Build) | MIT
 */
const isCoveredByReact = (eventNameSuffix) => {
    if (typeof document === 'undefined') {
        return true;
    }
    else {
        const eventName = 'on' + eventNameSuffix;
        let isSupported = eventName in document;
        if (!isSupported) {
            const element = document.createElement('div');
            element.setAttribute(eventName, 'return;');
            isSupported = typeof element[eventName] === 'function';
        }
        return isSupported;
    }
};
const syncEvent = (node, eventName, newEventHandler) => {
    const eventStore = node.__events || (node.__events = {});
    const oldEventHandler = eventStore[eventName];
    // Remove old listener so they don't double up.
    if (oldEventHandler) {
        node.removeEventListener(eventName, oldEventHandler);
    }
    // Bind new listener.
    node.addEventListener(eventName, (eventStore[eventName] = function handler(e) {
        if (newEventHandler) {
            newEventHandler.call(this, e);
        }
    }));
};
const arrayToMap = (arr) => {
    const map = new Map();
    arr.forEach((s) => map.set(s, s));
    return map;
};

const createForwardRef = (ReactComponent, displayName) => {
    const forwardRef = (props, ref) => {
        return react.createElement(ReactComponent, Object.assign({}, props, { forwardedRef: ref }));
    };
    forwardRef.displayName = displayName;
    return react.forwardRef(forwardRef);
};
const setRef = (ref, value) => {
    if (typeof ref === 'function') {
        ref(value);
    }
    else if (ref != null) {
        // Cast as a MutableRef so we can assign current
        ref.current = value;
    }
};
const mergeRefs = (...refs) => {
    return (value) => {
        refs.forEach(ref => {
            setRef(ref, value);
        });
    };
};
const isPlatform = (platform) => {
    return (0,dist/* isPlatform */.n$)(window, platform);
};
const getPlatforms = () => {
    return getPlatforms$1(window);
};
const getConfig = () => {
    if (typeof window !== 'undefined') {
        const Ionic = window.Ionic;
        if (Ionic && Ionic.config) {
            return Ionic.config;
        }
    }
    return null;
};

const createReactComponent = (tagName, routerLinkComponent = false) => {
    const displayName = dashToPascalCase(tagName);
    const ReactComponent = class extends react.Component {
        constructor(props) {
            super(props);
            this.handleClick = (e) => {
                const { routerLink, routerDirection, routerOptions, routerAnimation } = this.props;
                if (routerLink !== undefined) {
                    e.preventDefault();
                    this.context.navigate(routerLink, routerDirection, undefined, routerAnimation, routerOptions);
                }
            };
            // Create a local ref to to attach props to the wrapped element.
            this.ref = react.createRef();
            // React refs must be stable (not created inline).
            this.stableMergedRefs = mergeRefs(this.ref, this.props.forwardedRef);
        }
        componentDidMount() {
            this.componentDidUpdate(this.props);
        }
        componentDidUpdate(prevProps) {
            const node = this.ref.current;
            attachProps(node, this.props, prevProps);
        }
        render() {
            const _a = this.props, { children, forwardedRef, style, className, ref } = _a, cProps = tslib_es6_rest(_a, ["children", "forwardedRef", "style", "className", "ref"]);
            const propsToPass = Object.keys(cProps).reduce((acc, name) => {
                if (name.indexOf('on') === 0 && name[2] === name[2].toUpperCase()) {
                    const eventName = name.substring(2).toLowerCase();
                    if (isCoveredByReact(eventName)) {
                        acc[name] = cProps[name];
                    }
                }
                else if (['string', 'boolean', 'number'].includes(typeof cProps[name])) {
                    acc[camelToDashCase(name)] = cProps[name];
                }
                return acc;
            }, {});
            const newProps = Object.assign(Object.assign({}, propsToPass), { ref: this.stableMergedRefs, style });
            if (routerLinkComponent) {
                if (this.props.routerLink && !this.props.href) {
                    newProps.href = this.props.routerLink;
                }
                if (newProps.onClick) {
                    const oldClick = newProps.onClick;
                    newProps.onClick = (e) => {
                        oldClick(e);
                        if (!e.defaultPrevented) {
                            this.handleClick(e);
                        }
                    };
                }
                else {
                    newProps.onClick = this.handleClick;
                }
            }
            return react.createElement(tagName, newProps, children);
        }
        static get displayName() {
            return displayName;
        }
        static get contextType() {
            return NavContext;
        }
    };
    return createForwardRef(ReactComponent, displayName);
};

// ionic/core
const IonApp = /*@__PURE__*/ (/* unused pure expression or super */ null && (createReactComponent('ion-app')));
const IonTab = /*@__PURE__*/ (/* unused pure expression or super */ null && (createReactComponent('ion-tab')));
const IonRouterLink = /*@__PURE__*/ (/* unused pure expression or super */ null && (createReactComponent('ion-router-link', true)));
const IonAvatar = /*@__PURE__*/ (/* unused pure expression or super */ null && (createReactComponent('ion-avatar')));
const IonBackdrop = /*@__PURE__*/ (/* unused pure expression or super */ null && (createReactComponent('ion-backdrop')));
const IonBadge = /*@__PURE__*/ (/* unused pure expression or super */ null && (createReactComponent('ion-badge')));
const IonButton = /*@__PURE__*/ (/* unused pure expression or super */ null && (createReactComponent('ion-button', true)));
const IonButtons = /*@__PURE__*/ (/* unused pure expression or super */ null && (createReactComponent('ion-buttons')));
const IonCard = /*@__PURE__*/ (/* unused pure expression or super */ null && (createReactComponent('ion-card', true)));
const IonCardContent = /*@__PURE__*/ (/* unused pure expression or super */ null && (createReactComponent('ion-card-content')));
const IonCardHeader = /*@__PURE__*/ (/* unused pure expression or super */ null && (createReactComponent('ion-card-header')));
const IonCardSubtitle = /*@__PURE__*/ (/* unused pure expression or super */ null && (createReactComponent('ion-card-subtitle')));
const IonCardTitle = /*@__PURE__*/ (/* unused pure expression or super */ null && (createReactComponent('ion-card-title')));
const IonCheckbox = /*@__PURE__*/ (/* unused pure expression or super */ null && (createReactComponent('ion-checkbox')));
const IonCol = /*@__PURE__*/ (/* unused pure expression or super */ null && (createReactComponent('ion-col')));
const IonContent = /*@__PURE__*/ (/* unused pure expression or super */ null && (createReactComponent('ion-content')));
const IonChip = /*@__PURE__*/ (/* unused pure expression or super */ null && (createReactComponent('ion-chip')));
const IonDatetime = /*@__PURE__*/ (/* unused pure expression or super */ null && (createReactComponent('ion-datetime')));
const IonFab = /*@__PURE__*/ (/* unused pure expression or super */ null && (createReactComponent('ion-fab')));
const IonFabButton = /*@__PURE__*/ (/* unused pure expression or super */ null && (createReactComponent('ion-fab-button', true)));
const IonFabList = /*@__PURE__*/ (/* unused pure expression or super */ null && (createReactComponent('ion-fab-list')));
const IonFooter = /*@__PURE__*/ (/* unused pure expression or super */ null && (createReactComponent('ion-footer')));
const IonGrid = /*@__PURE__*/ (/* unused pure expression or super */ null && (createReactComponent('ion-grid')));
const IonHeader = /*@__PURE__*/ (/* unused pure expression or super */ null && (createReactComponent('ion-header')));
const IonImg = /*@__PURE__*/ (/* unused pure expression or super */ null && (createReactComponent('ion-img')));
const IonInfiniteScroll = /*@__PURE__*/ (/* unused pure expression or super */ null && (createReactComponent('ion-infinite-scroll')));
const IonInfiniteScrollContent = /*@__PURE__*/ (/* unused pure expression or super */ null && (createReactComponent('ion-infinite-scroll-content')));
const IonInput = /*@__PURE__*/ (/* unused pure expression or super */ null && (createReactComponent('ion-input')));
const IonItem = /*@__PURE__*/ (/* unused pure expression or super */ null && (createReactComponent('ion-item', true)));
const IonItemDivider = /*@__PURE__*/ (/* unused pure expression or super */ null && (createReactComponent('ion-item-divider')));
const IonItemGroup = /*@__PURE__*/ (/* unused pure expression or super */ null && (createReactComponent('ion-item-group')));
const IonItemOption = /*@__PURE__*/ (/* unused pure expression or super */ null && (createReactComponent('ion-item-option', true)));
const IonItemOptions = /*@__PURE__*/ (/* unused pure expression or super */ null && (createReactComponent('ion-item-options')));
const IonItemSliding = /*@__PURE__*/ (/* unused pure expression or super */ null && (createReactComponent('ion-item-sliding')));
const IonLabel = /*@__PURE__*/ (/* unused pure expression or super */ null && (createReactComponent('ion-label')));
const IonList = /*@__PURE__*/ (/* unused pure expression or super */ null && (createReactComponent('ion-list')));
const IonListHeader = /*@__PURE__*/ (/* unused pure expression or super */ null && (createReactComponent('ion-list-header')));
const IonMenu = /*@__PURE__*/ createReactComponent('ion-menu');
const IonMenuButton = /*@__PURE__*/ (/* unused pure expression or super */ null && (createReactComponent('ion-menu-button')));
const IonMenuToggle = /*@__PURE__*/ (/* unused pure expression or super */ null && (createReactComponent('ion-menu-toggle')));
const IonNote = /*@__PURE__*/ (/* unused pure expression or super */ null && (createReactComponent('ion-note')));
const IonPickerColumn = /*@__PURE__*/ (/* unused pure expression or super */ null && (createReactComponent('ion-picker-column')));
const IonNav = /*@__PURE__*/ (/* unused pure expression or super */ null && (createReactComponent('ion-nav')));
const IonProgressBar = /*@__PURE__*/ (/* unused pure expression or super */ null && (createReactComponent('ion-progress-bar')));
const IonRadio = /*@__PURE__*/ (/* unused pure expression or super */ null && (createReactComponent('ion-radio')));
const IonRadioGroup = /*@__PURE__*/ (/* unused pure expression or super */ null && (createReactComponent('ion-radio-group')));
const IonRange = /*@__PURE__*/ (/* unused pure expression or super */ null && (createReactComponent('ion-range')));
const IonRefresher = /*@__PURE__*/ (/* unused pure expression or super */ null && (createReactComponent('ion-refresher')));
const IonRefresherContent = /*@__PURE__*/ (/* unused pure expression or super */ null && (createReactComponent('ion-refresher-content')));
const IonReorder = /*@__PURE__*/ (/* unused pure expression or super */ null && (createReactComponent('ion-reorder')));
const IonReorderGroup = /*@__PURE__*/ (/* unused pure expression or super */ null && (createReactComponent('ion-reorder-group')));
const IonRippleEffect = /*@__PURE__*/ (/* unused pure expression or super */ null && (createReactComponent('ion-ripple-effect')));
const IonRow = /*@__PURE__*/ (/* unused pure expression or super */ null && (createReactComponent('ion-row')));
const IonSearchbar = /*@__PURE__*/ (/* unused pure expression or super */ null && (createReactComponent('ion-searchbar')));
const IonSegment = /*@__PURE__*/ (/* unused pure expression or super */ null && (createReactComponent('ion-segment')));
const IonSegmentButton = /*@__PURE__*/ (/* unused pure expression or super */ null && (createReactComponent('ion-segment-button')));
const IonSelect = /*@__PURE__*/ (/* unused pure expression or super */ null && (createReactComponent('ion-select')));
const IonSelectOption = /*@__PURE__*/ (/* unused pure expression or super */ null && (createReactComponent('ion-select-option')));
const IonSelectPopover = /*@__PURE__*/ (/* unused pure expression or super */ null && (createReactComponent('ion-select-popover')));
const IonSkeletonText = /*@__PURE__*/ (/* unused pure expression or super */ null && (createReactComponent('ion-skeleton-text')));
const IonSlide = /*@__PURE__*/ (/* unused pure expression or super */ null && (createReactComponent('ion-slide')));
const IonSlides = /*@__PURE__*/ (/* unused pure expression or super */ null && (createReactComponent('ion-slides')));
const IonSpinner = /*@__PURE__*/ (/* unused pure expression or super */ null && (createReactComponent('ion-spinner')));
const IonSplitPane = /*@__PURE__*/ (/* unused pure expression or super */ null && (createReactComponent('ion-split-pane')));
const IonText = /*@__PURE__*/ (/* unused pure expression or super */ null && (createReactComponent('ion-text')));
const IonTextarea = /*@__PURE__*/ (/* unused pure expression or super */ null && (createReactComponent('ion-textarea')));
const IonThumbnail = /*@__PURE__*/ (/* unused pure expression or super */ null && (createReactComponent('ion-thumbnail')));
const IonTitle = /*@__PURE__*/ (/* unused pure expression or super */ null && (createReactComponent('ion-title')));
const IonToggle = /*@__PURE__*/ (/* unused pure expression or super */ null && (createReactComponent('ion-toggle')));
const IonToolbar = /*@__PURE__*/ (/* unused pure expression or super */ null && (createReactComponent('ion-toolbar')));
const IonVirtualScroll = /*@__PURE__*/ (/* unused pure expression or super */ null && (createReactComponent('ion-virtual-scroll')));

const createControllerComponent = (displayName, controller) => {
    const didDismissEventName = `on${displayName}DidDismiss`;
    const didPresentEventName = `on${displayName}DidPresent`;
    const willDismissEventName = `on${displayName}WillDismiss`;
    const willPresentEventName = `on${displayName}WillPresent`;
    class Overlay extends React.Component {
        constructor(props) {
            super(props);
            this.isUnmounted = false;
            this.handleDismiss = this.handleDismiss.bind(this);
        }
        static get displayName() {
            return displayName;
        }
        async componentDidMount() {
            const { isOpen } = this.props;
            if (isOpen) {
                this.present();
            }
        }
        componentWillUnmount() {
            this.isUnmounted = true;
            if (this.overlay) {
                this.overlay.dismiss();
            }
        }
        async componentDidUpdate(prevProps) {
            if (prevProps.isOpen !== this.props.isOpen && this.props.isOpen === true) {
                this.present(prevProps);
            }
            if (this.overlay && prevProps.isOpen !== this.props.isOpen && this.props.isOpen === false) {
                await this.overlay.dismiss();
            }
        }
        handleDismiss(event) {
            if (this.props.onDidDismiss) {
                this.props.onDidDismiss(event);
            }
            setRef(this.props.forwardedRef, null);
        }
        async present(prevProps) {
            const _a = this.props, cProps = __rest(_a, ["isOpen", "onDidDismiss", "onDidPresent", "onWillDismiss", "onWillPresent"]);
            this.overlay = await controller.create(Object.assign({}, cProps));
            attachProps(this.overlay, {
                [didDismissEventName]: this.handleDismiss,
                [didPresentEventName]: (e) => this.props.onDidPresent && this.props.onDidPresent(e),
                [willDismissEventName]: (e) => this.props.onWillDismiss && this.props.onWillDismiss(e),
                [willPresentEventName]: (e) => this.props.onWillPresent && this.props.onWillPresent(e),
            }, prevProps);
            // Check isOpen again since the value could have changed during the async call to controller.create
            // It's also possible for the component to have become unmounted.
            if (this.props.isOpen === true && this.isUnmounted === false) {
                setRef(this.props.forwardedRef, this.overlay);
                await this.overlay.present();
            }
        }
        render() {
            return null;
        }
    }
    return React.forwardRef((props, ref) => {
        return React.createElement(Overlay, Object.assign({}, props, { forwardedRef: ref }));
    });
};

const IonAlert = /*@__PURE__*/ (/* unused pure expression or super */ null && (createControllerComponent('IonAlert', alertController)));

const IonLoading = /*@__PURE__*/ (/* unused pure expression or super */ null && (createControllerComponent('IonLoading', loadingController)));

const toastController = {
    create: (options) => dist/* toastController.create */.Mn.create(options),
    dismiss: (data, role, id) => dist/* toastController.dismiss */.Mn.dismiss(data, role, id),
    getTop: () => dist/* toastController.getTop */.Mn.getTop(),
};
const IonToast = /*@__PURE__*/ (/* unused pure expression or super */ null && (createControllerComponent('IonToast', toastController)));

const IonPicker = /*@__PURE__*/ (/* unused pure expression or super */ null && (createControllerComponent('IonPicker', pickerController)));

const createOverlayComponent = (displayName, controller) => {
    const didDismissEventName = `on${displayName}DidDismiss`;
    const didPresentEventName = `on${displayName}DidPresent`;
    const willDismissEventName = `on${displayName}WillDismiss`;
    const willPresentEventName = `on${displayName}WillPresent`;
    class Overlay extends React.Component {
        constructor(props) {
            super(props);
            this.isDismissing = false;
            if (typeof document !== 'undefined') {
                this.el = document.createElement('div');
            }
            this.handleDismiss = this.handleDismiss.bind(this);
        }
        static get displayName() {
            return displayName;
        }
        componentDidMount() {
            if (this.props.isOpen) {
                this.present();
            }
        }
        componentWillUnmount() {
            if (this.overlay) {
                this.overlay.dismiss();
            }
        }
        handleDismiss(event) {
            if (this.props.onDidDismiss) {
                this.props.onDidDismiss(event);
            }
            setRef(this.props.forwardedRef, null);
        }
        shouldComponentUpdate(nextProps) {
            // Check if the overlay component is about to dismiss
            if (this.overlay && nextProps.isOpen !== this.props.isOpen && nextProps.isOpen === false) {
                this.isDismissing = true;
            }
            return true;
        }
        async componentDidUpdate(prevProps) {
            if (this.overlay) {
                attachProps(this.overlay, this.props, prevProps);
            }
            if (prevProps.isOpen !== this.props.isOpen && this.props.isOpen === true) {
                this.present(prevProps);
            }
            if (this.overlay && prevProps.isOpen !== this.props.isOpen && this.props.isOpen === false) {
                await this.overlay.dismiss();
                this.isDismissing = false;
                /**
                 * Now that the overlay is dismissed
                 * we need to render again so that any
                 * inner components will be unmounted
                 */
                this.forceUpdate();
            }
        }
        async present(prevProps) {
            const _a = this.props, cProps = __rest(_a, ["children", "isOpen", "onDidDismiss", "onDidPresent", "onWillDismiss", "onWillPresent"]);
            const elementProps = Object.assign(Object.assign({}, cProps), { ref: this.props.forwardedRef, [didDismissEventName]: this.handleDismiss, [didPresentEventName]: (e) => this.props.onDidPresent && this.props.onDidPresent(e), [willDismissEventName]: (e) => this.props.onWillDismiss && this.props.onWillDismiss(e), [willPresentEventName]: (e) => this.props.onWillPresent && this.props.onWillPresent(e) });
            this.overlay = await controller.create(Object.assign(Object.assign({}, elementProps), { component: this.el, componentProps: {} }));
            setRef(this.props.forwardedRef, this.overlay);
            attachProps(this.overlay, elementProps, prevProps);
            await this.overlay.present();
        }
        render() {
            /**
             * Continue to render the component even when
             * overlay is dismissing otherwise component
             * will be hidden before animation is done.
             */
            return ReactDOM.createPortal(this.props.isOpen || this.isDismissing ? this.props.children : null, this.el);
        }
    }
    return React.forwardRef((props, ref) => {
        return React.createElement(Overlay, Object.assign({}, props, { forwardedRef: ref }));
    });
};

const actionSheetController = {
    create: (options) => dist/* actionSheetController.create */.BO.create(options),
    dismiss: (data, role, id) => dist/* actionSheetController.dismiss */.BO.dismiss(data, role, id),
    getTop: () => dist/* actionSheetController.getTop */.BO.getTop(),
};
const IonActionSheet = /*@__PURE__*/ (/* unused pure expression or super */ null && (createOverlayComponent('IonActionSheet', actionSheetController)));

const IonModal = /*@__PURE__*/ (/* unused pure expression or super */ null && (createOverlayComponent('IonModal', modalController)));

const IonPopover = /*@__PURE__*/ (/* unused pure expression or super */ null && (createOverlayComponent('IonPopover', popoverController)));

const StackContext = react.createContext({
    registerIonPage: () => undefined,
    isInOutlet: () => false,
});

class PageManager extends react.PureComponent {
    constructor(props) {
        super(props);
        this.ionPageElementRef = react.createRef();
        // React refs must be stable (not created inline).
        this.stableMergedRefs = mergeRefs(this.ionPageElementRef, this.props.forwardedRef);
    }
    componentDidMount() {
        if (this.ionPageElementRef.current) {
            if (this.context.isInOutlet()) {
                this.ionPageElementRef.current.classList.add('ion-page-invisible');
            }
            this.context.registerIonPage(this.ionPageElementRef.current, this.props.routeInfo);
            this.ionPageElementRef.current.addEventListener('ionViewWillEnter', this.ionViewWillEnterHandler.bind(this));
            this.ionPageElementRef.current.addEventListener('ionViewDidEnter', this.ionViewDidEnterHandler.bind(this));
            this.ionPageElementRef.current.addEventListener('ionViewWillLeave', this.ionViewWillLeaveHandler.bind(this));
            this.ionPageElementRef.current.addEventListener('ionViewDidLeave', this.ionViewDidLeaveHandler.bind(this));
        }
    }
    componentWillUnmount() {
        if (this.ionPageElementRef.current) {
            this.ionPageElementRef.current.removeEventListener('ionViewWillEnter', this.ionViewWillEnterHandler.bind(this));
            this.ionPageElementRef.current.removeEventListener('ionViewDidEnter', this.ionViewDidEnterHandler.bind(this));
            this.ionPageElementRef.current.removeEventListener('ionViewWillLeave', this.ionViewWillLeaveHandler.bind(this));
            this.ionPageElementRef.current.removeEventListener('ionViewDidLeave', this.ionViewDidLeaveHandler.bind(this));
        }
    }
    ionViewWillEnterHandler() {
        this.ionLifeCycleContext.ionViewWillEnter();
    }
    ionViewDidEnterHandler() {
        this.ionLifeCycleContext.ionViewDidEnter();
    }
    ionViewWillLeaveHandler() {
        this.ionLifeCycleContext.ionViewWillLeave();
    }
    ionViewDidLeaveHandler() {
        this.ionLifeCycleContext.ionViewDidLeave();
    }
    render() {
        const _a = this.props, { className, children, routeInfo, forwardedRef } = _a, props = tslib_es6_rest(_a, ["className", "children", "routeInfo", "forwardedRef"]);
        return (react.createElement(IonLifeCycleContext.Consumer, null, (context) => {
            this.ionLifeCycleContext = context;
            return (react.createElement("div", Object.assign({ className: className ? `${className} ion-page` : `ion-page`, ref: this.stableMergedRefs }, props), children));
        }));
    }
    static get contextType() {
        return StackContext;
    }
}

class IonPageInternal extends react.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const _a = this.props, { className, children, forwardedRef } = _a, props = tslib_es6_rest(_a, ["className", "children", "forwardedRef"]);
        return this.context.hasIonicRouter() ? (react.createElement(PageManager, Object.assign({ className: className ? `${className}` : '', routeInfo: this.context.routeInfo, forwardedRef: forwardedRef }, props), children)) : (react.createElement("div", Object.assign({ className: className ? `ion-page ${className}` : 'ion-page', ref: forwardedRef }, props), children));
    }
    static get displayName() {
        return 'IonPage';
    }
    static get contextType() {
        return NavContext;
    }
}
const IonPage = createForwardRef(IonPageInternal, 'IonPage');

const IonTabsContext = react.createContext({
    activeTab: undefined,
    selectTab: () => false,
});

const HTMLElementSSR = (typeof HTMLElement !== 'undefined'
    ? HTMLElement
    : class {
    });

const IonTabButtonInner = /*@__PURE__*/ createReactComponent('ion-tab-button');
const IonTabBarInner = /*@__PURE__*/ createReactComponent('ion-tab-bar');
const IonBackButtonInner = /*@__PURE__*/ (/* unused pure expression or super */ null && (createReactComponent('ion-back-button')));
const IonRouterOutletInner = /*@__PURE__*/ createReactComponent('ion-router-outlet');
// ionicons
const IonIconInner = /*@__PURE__*/ createReactComponent('ion-icon');

class OutletPageManager extends react.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        if (this.ionRouterOutlet) {
            setTimeout(() => {
                this.context.registerIonPage(this.ionRouterOutlet, this.props.routeInfo);
            }, 25);
            this.ionRouterOutlet.addEventListener('ionViewWillEnter', this.ionViewWillEnterHandler.bind(this));
            this.ionRouterOutlet.addEventListener('ionViewDidEnter', this.ionViewDidEnterHandler.bind(this));
            this.ionRouterOutlet.addEventListener('ionViewWillLeave', this.ionViewWillLeaveHandler.bind(this));
            this.ionRouterOutlet.addEventListener('ionViewDidLeave', this.ionViewDidLeaveHandler.bind(this));
        }
    }
    componentWillUnmount() {
        if (this.ionRouterOutlet) {
            this.ionRouterOutlet.removeEventListener('ionViewWillEnter', this.ionViewWillEnterHandler.bind(this));
            this.ionRouterOutlet.removeEventListener('ionViewDidEnter', this.ionViewDidEnterHandler.bind(this));
            this.ionRouterOutlet.removeEventListener('ionViewWillLeave', this.ionViewWillLeaveHandler.bind(this));
            this.ionRouterOutlet.removeEventListener('ionViewDidLeave', this.ionViewDidLeaveHandler.bind(this));
        }
    }
    ionViewWillEnterHandler() {
        this.ionLifeCycleContext.ionViewWillEnter();
    }
    ionViewDidEnterHandler() {
        this.ionLifeCycleContext.ionViewDidEnter();
    }
    ionViewWillLeaveHandler() {
        this.ionLifeCycleContext.ionViewWillLeave();
    }
    ionViewDidLeaveHandler() {
        this.ionLifeCycleContext.ionViewDidLeave();
    }
    render() {
        const _a = this.props, { StackManager, children, routeInfo } = _a, props = tslib_es6_rest(_a, ["StackManager", "children", "routeInfo"]);
        return (react.createElement(IonLifeCycleContext.Consumer, null, (context) => {
            this.ionLifeCycleContext = context;
            return (react.createElement(StackManager, { routeInfo: routeInfo },
                react.createElement(IonRouterOutletInner, Object.assign({ setRef: (val) => (this.ionRouterOutlet = val) }, props), children)));
        }));
    }
    static get contextType() {
        return StackContext;
    }
}

class IonRouterOutletContainer extends react.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const StackManager = this.context.getStackManager();
        const _a = this.props, { children, forwardedRef } = _a, props = tslib_es6_rest(_a, ["children", "forwardedRef"]);
        return this.context.hasIonicRouter() ? (props.ionPage ? (react.createElement(OutletPageManager, Object.assign({ StackManager: StackManager, routeInfo: this.context.routeInfo }, props), children)) : (react.createElement(StackManager, { routeInfo: this.context.routeInfo },
            react.createElement(IonRouterOutletInner, Object.assign({}, props, { forwardedRef: forwardedRef }), children)))) : (react.createElement(IonRouterOutletInner, Object.assign({ ref: forwardedRef }, this.props), this.props.children));
    }
    static get contextType() {
        return NavContext;
    }
}
const IonRouterOutlet = createForwardRef(IonRouterOutletContainer, 'IonRouterOutlet');

class IonTabButton extends react.Component {
    constructor(props) {
        super(props);
        this.handleIonTabButtonClick = this.handleIonTabButtonClick.bind(this);
    }
    handleIonTabButtonClick() {
        if (this.props.onClick) {
            this.props.onClick(new CustomEvent('ionTabButtonClick', {
                detail: {
                    tab: this.props.tab,
                    href: this.props.href,
                    routeOptions: this.props.routerOptions,
                },
            }));
        }
    }
    render() {
        const _a = this.props, rest = tslib_es6_rest(_a, ["onClick"]);
        return (react.createElement(IonTabButtonInner, Object.assign({ onIonTabButtonClick: this.handleIonTabButtonClick }, rest)));
    }
    static get displayName() {
        return 'IonTabButton';
    }
}

class IonTabBarUnwrapped extends react.PureComponent {
    constructor(props) {
        super(props);
        this.setActiveTabOnContext = (_tab) => { };
        const tabs = {};
        react.Children.forEach(props.children, (child) => {
            var _a, _b, _c, _d;
            if (child != null &&
                typeof child === 'object' &&
                child.props &&
                (child.type === IonTabButton || child.type.isTabButton)) {
                tabs[child.props.tab] = {
                    originalHref: child.props.href,
                    currentHref: child.props.href,
                    originalRouteOptions: child.props.href === ((_a = props.routeInfo) === null || _a === void 0 ? void 0 : _a.pathname)
                        ? (_b = props.routeInfo) === null || _b === void 0 ? void 0 : _b.routeOptions : undefined,
                    currentRouteOptions: child.props.href === ((_c = props.routeInfo) === null || _c === void 0 ? void 0 : _c.pathname)
                        ? (_d = props.routeInfo) === null || _d === void 0 ? void 0 : _d.routeOptions : undefined,
                };
            }
        });
        this.state = {
            tabs,
        };
        this.onTabButtonClick = this.onTabButtonClick.bind(this);
        this.renderTabButton = this.renderTabButton.bind(this);
        this.setActiveTabOnContext = this.setActiveTabOnContext.bind(this);
        this.selectTab = this.selectTab.bind(this);
    }
    componentDidMount() {
        const tabs = this.state.tabs;
        const tabKeys = Object.keys(tabs);
        const activeTab = tabKeys.find((key) => {
            const href = tabs[key].originalHref;
            return this.props.routeInfo.pathname.startsWith(href);
        });
        if (activeTab) {
            this.setState({
                activeTab,
            });
        }
    }
    componentDidUpdate() {
        if (this.state.activeTab) {
            this.setActiveTabOnContext(this.state.activeTab);
        }
    }
    selectTab(tab) {
        const tabUrl = this.state.tabs[tab];
        if (tabUrl) {
            this.onTabButtonClick(new CustomEvent('ionTabButtonClick', {
                detail: {
                    href: tabUrl.currentHref,
                    tab,
                    selected: tab === this.state.activeTab,
                    routeOptions: undefined,
                },
            }));
            return true;
        }
        return false;
    }
    static getDerivedStateFromProps(props, state) {
        var _a, _b, _c;
        const tabs = Object.assign({}, state.tabs);
        const tabKeys = Object.keys(state.tabs);
        const activeTab = tabKeys.find((key) => {
            const href = state.tabs[key].originalHref;
            return props.routeInfo.pathname.startsWith(href);
        });
        // Check to see if the tab button href has changed, and if so, update it in the tabs state
        react.Children.forEach(props.children, (child) => {
            if (child != null &&
                typeof child === 'object' &&
                child.props &&
                (child.type === IonTabButton || child.type.isTabButton)) {
                const tab = tabs[child.props.tab];
                if (!tab || tab.originalHref !== child.props.href) {
                    tabs[child.props.tab] = {
                        originalHref: child.props.href,
                        currentHref: child.props.href,
                        originalRouteOptions: child.props.routeOptions,
                        currentRouteOptions: child.props.routeOptions,
                    };
                }
            }
        });
        const { activeTab: prevActiveTab } = state;
        if (activeTab && prevActiveTab) {
            const prevHref = state.tabs[prevActiveTab].currentHref;
            const prevRouteOptions = state.tabs[prevActiveTab].currentRouteOptions;
            if (activeTab !== prevActiveTab ||
                prevHref !== ((_a = props.routeInfo) === null || _a === void 0 ? void 0 : _a.pathname) ||
                prevRouteOptions !== ((_b = props.routeInfo) === null || _b === void 0 ? void 0 : _b.routeOptions)) {
                tabs[activeTab] = {
                    originalHref: tabs[activeTab].originalHref,
                    currentHref: props.routeInfo.pathname + (props.routeInfo.search || ''),
                    originalRouteOptions: tabs[activeTab].originalRouteOptions,
                    currentRouteOptions: (_c = props.routeInfo) === null || _c === void 0 ? void 0 : _c.routeOptions,
                };
                if (props.routeInfo.routeAction === 'pop' && activeTab !== prevActiveTab) {
                    // If navigating back and the tabs change, set the prev tab back to its original href
                    tabs[prevActiveTab] = {
                        originalHref: tabs[prevActiveTab].originalHref,
                        currentHref: tabs[prevActiveTab].originalHref,
                        originalRouteOptions: tabs[prevActiveTab].originalRouteOptions,
                        currentRouteOptions: tabs[prevActiveTab].currentRouteOptions,
                    };
                }
            }
        }
        activeTab && props.onSetCurrentTab(activeTab, props.routeInfo);
        return {
            activeTab,
            tabs,
        };
    }
    onTabButtonClick(e) {
        const tappedTab = this.state.tabs[e.detail.tab];
        const originalHref = tappedTab.originalHref;
        const currentHref = e.detail.href;
        const { activeTab: prevActiveTab } = this.state;
        // this.props.onSetCurrentTab(e.detail.tab, this.props.routeInfo);
        // Clicking the current tab will bring you back to the original href
        if (prevActiveTab === e.detail.tab) {
            if (originalHref !== currentHref) {
                this.context.resetTab(e.detail.tab, originalHref, tappedTab.originalRouteOptions);
            }
        }
        else {
            if (this.props.onIonTabsWillChange) {
                this.props.onIonTabsWillChange(new CustomEvent('ionTabWillChange', { detail: { tab: e.detail.tab } }));
            }
            if (this.props.onIonTabsDidChange) {
                this.props.onIonTabsDidChange(new CustomEvent('ionTabDidChange', { detail: { tab: e.detail.tab } }));
            }
            this.setActiveTabOnContext(e.detail.tab);
            this.context.changeTab(e.detail.tab, currentHref, e.detail.routeOptions);
        }
    }
    renderTabButton(activeTab) {
        return (child) => {
            var _a, _b;
            if (child != null &&
                child.props &&
                (child.type === IonTabButton || child.type.isTabButton)) {
                const href = child.props.tab === activeTab
                    ? (_a = this.props.routeInfo) === null || _a === void 0 ? void 0 : _a.pathname : this.state.tabs[child.props.tab].currentHref;
                const routeOptions = child.props.tab === activeTab
                    ? (_b = this.props.routeInfo) === null || _b === void 0 ? void 0 : _b.routeOptions : this.state.tabs[child.props.tab].currentRouteOptions;
                return react.cloneElement(child, {
                    href,
                    routeOptions,
                    onClick: this.onTabButtonClick,
                });
            }
            return null;
        };
    }
    render() {
        const { activeTab } = this.state;
        return (react.createElement(IonTabBarInner, Object.assign({}, this.props, { selectedTab: activeTab }), react.Children.map(this.props.children, this.renderTabButton(activeTab))));
    }
    static get contextType() {
        return NavContext;
    }
}
const IonTabBarContainer = react.memo((_a) => {
    var { forwardedRef } = _a, props = tslib_es6_rest(_a, ["forwardedRef"]);
    const context = (0,react.useContext)(NavContext);
    return (react.createElement(IonTabBarUnwrapped, Object.assign({ ref: forwardedRef }, props, { routeInfo: props.routeInfo || context.routeInfo || { pathname: window.location.pathname }, onSetCurrentTab: context.setCurrentTab }), props.children));
});
const IonTabBar = createForwardRef(IonTabBarContainer, 'IonTabBar');

class IonTabsElement extends HTMLElementSSR {
    constructor() {
        super();
    }
}
if (typeof window !== 'undefined' && window.customElements) {
    const element = customElements.get('ion-tabs');
    if (!element) {
        customElements.define('ion-tabs', IonTabsElement);
    }
}
const hostStyles = {
    display: 'flex',
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    contain: 'layout size style',
};
const tabsInner = {
    position: 'relative',
    flex: 1,
    contain: 'layout size style',
};
class IonTabs extends react.Component {
    constructor(props) {
        super(props);
        this.routerOutletRef = React.createRef();
        this.tabBarRef = React.createRef();
        this.ionTabContextState = {
            activeTab: undefined,
            selectTab: () => false,
        };
    }
    componentDidMount() {
        if (this.tabBarRef.current) {
            // Grab initial value
            this.ionTabContextState.activeTab = this.tabBarRef.current.state.activeTab;
            // Override method
            this.tabBarRef.current.setActiveTabOnContext = (tab) => {
                this.ionTabContextState.activeTab = tab;
            };
            this.ionTabContextState.selectTab = this.tabBarRef.current.selectTab;
        }
    }
    render() {
        let outlet;
        let tabBar;
        const _a = this.props, { className, onIonTabsDidChange, onIonTabsWillChange } = _a, props = __rest(_a, ["className", "onIonTabsDidChange", "onIonTabsWillChange"]);
        const children = typeof this.props.children === 'function'
            ? this.props.children(this.ionTabContextState)
            : this.props.children;
        React.Children.forEach(children, (child) => {
            if (child == null || typeof child !== 'object' || !child.hasOwnProperty('type')) {
                return;
            }
            if (child.type === IonRouterOutlet || child.type.isRouterOutlet) {
                outlet = React.cloneElement(child, { tabs: true });
            }
            else if (child.type === Fragment && child.props.children[0].type === IonRouterOutlet) {
                outlet = child.props.children[0];
            }
            let childProps = {
                ref: this.tabBarRef
            };
            /**
             * Only pass these props
             * down from IonTabs to IonTabBar
             * if they are defined, otherwise
             * if you have a handler set on
             * IonTabBar it will be overridden.
             */
            if (onIonTabsDidChange !== undefined) {
                childProps = Object.assign(Object.assign({}, childProps), { onIonTabsDidChange });
            }
            if (onIonTabsWillChange !== undefined) {
                childProps = Object.assign(Object.assign({}, childProps), { onIonTabsWillChange });
            }
            if (child.type === IonTabBar || child.type.isTabBar) {
                tabBar = React.cloneElement(child, childProps);
            }
            else if (child.type === Fragment &&
                (child.props.children[1].type === IonTabBar || child.props.children[1].type.isTabBar)) {
                tabBar = React.cloneElement(child.props.children[1], childProps);
            }
        });
        if (!outlet) {
            throw new Error('IonTabs must contain an IonRouterOutlet');
        }
        if (!tabBar) {
            throw new Error('IonTabs needs a IonTabBar');
        }
        return (React.createElement(IonTabsContext.Provider, { value: this.ionTabContextState }, this.context.hasIonicRouter() ? (React.createElement(PageManager, Object.assign({ className: className ? `${className}` : '', routeInfo: this.context.routeInfo }, props),
            React.createElement("ion-tabs", { className: "ion-tabs", style: hostStyles },
                tabBar.props.slot === 'top' ? tabBar : null,
                React.createElement("div", { style: tabsInner, className: "tabs-inner" }, outlet),
                tabBar.props.slot === 'bottom' ? tabBar : null))) : (React.createElement("div", Object.assign({ className: className ? `${className}` : 'ion-tabs' }, props, { style: hostStyles }),
            tabBar.props.slot === 'top' ? tabBar : null,
            React.createElement("div", { style: tabsInner, className: "tabs-inner" }, outlet),
            tabBar.props.slot === 'bottom' ? tabBar : null))));
    }
    static get contextType() {
        return NavContext;
    }
}

const IonBackButton = /*@__PURE__*/ (/* unused pure expression or super */ null && ((() => class extends React.Component {
    constructor() {
        super(...arguments);
        this.clickButton = (e) => {
            const { defaultHref, routerAnimation } = this.props;
            if (this.context.hasIonicRouter()) {
                e.stopPropagation();
                this.context.goBack(defaultHref, routerAnimation);
            }
            else if (defaultHref !== undefined) {
                window.location.href = defaultHref;
            }
        };
    }
    render() {
        return React.createElement(IonBackButtonInner, Object.assign({ onClick: this.clickButton }, this.props));
    }
    static get displayName() {
        return 'IonBackButton';
    }
    static get contextType() {
        return NavContext;
    }
})()));

const isDevMode = () => {
    return process && process.env && "production" === 'development';
};
const warnings = {};
const deprecationWarning = (key, message) => {
    if (isDevMode()) {
        if (!warnings[key]) {
            console.warn(message);
            warnings[key] = true;
        }
    }
};

class IonIconContainer extends react.PureComponent {
    constructor(props) {
        super(props);
        if (this.props.name) {
            deprecationWarning('icon-name', 'In Ionic React, you import icons from "ionicons/icons" and set the icon you imported to the "icon" property. Setting the "name" property has no effect.');
        }
    }
    render() {
        var _a, _b;
        const _c = this.props, { icon, ios, md } = _c, rest = tslib_es6_rest(_c, ["icon", "ios", "md"]);
        let iconToUse;
        if (ios || md) {
            if (isPlatform('ios')) {
                iconToUse = (_a = ios !== null && ios !== void 0 ? ios : md) !== null && _a !== void 0 ? _a : icon;
            }
            else {
                iconToUse = (_b = md !== null && md !== void 0 ? md : ios) !== null && _b !== void 0 ? _b : icon;
            }
        }
        else {
            iconToUse = icon;
        }
        return (react.createElement(IonIconInner, Object.assign({ ref: this.props.forwardedRef, icon: iconToUse }, rest), this.props.children));
    }
    static get contextType() {
        return NavContext;
    }
}
const IonIcon = createForwardRef(IonIconContainer, 'IonIcon');

class IonRoute extends react.PureComponent {
    render() {
        const IonRouteInner = this.context.getIonRoute();
        if (!this.context.hasIonicRouter() || !IonRoute) {
            console.error('You either do not have an Ionic Router package, or your router does not support using <IonRoute>');
            return null;
        }
        return React.createElement(IonRouteInner, Object.assign({}, this.props));
    }
    static get contextType() {
        return NavContext;
    }
}

class IonRedirect extends react.PureComponent {
    render() {
        const IonRedirectInner = this.context.getIonRedirect();
        if (!this.context.hasIonicRouter() || !IonRedirect) {
            console.error('You either do not have an Ionic Router package, or your router does not support using <IonRedirect>');
            return null;
        }
        return React.createElement(IonRedirectInner, Object.assign({}, this.props));
    }
    static get contextType() {
        return NavContext;
    }
}

const IonRouterContext = react.createContext({
    routeInfo: undefined,
    push: () => {
        throw new Error('An Ionic Router is required for IonRouterContext');
    },
    back: () => {
        throw new Error('An Ionic Router is required for IonRouterContext');
    },
    canGoBack: () => {
        throw new Error('An Ionic Router is required for IonRouterContext');
    },
    nativeBack: () => {
        throw new Error('An Ionic Router is required for IonRouterContext');
    },
});
/**
 * A hook for more direct control over routing in an Ionic React applicaiton. Allows you to pass additional meta-data to the router before the call to the native router.
 */
function useIonRouter() {
    const context = useContext(IonRouterContext);
    return {
        back: context.back,
        push: context.push,
        goBack: context.back,
        canGoBack: context.canGoBack,
        routeInfo: context.routeInfo,
    };
}

class CreateAnimation extends react.PureComponent {
    constructor(props) {
        super(props);
        this.nodes = new Map();
        this.animation = createAnimation(props.id);
    }
    setupAnimation(props) {
        const animation = this.animation;
        if (this.nodes.size > 0) {
            animation.addElement(Array.from(this.nodes.values()));
        }
        checkConfig(animation, props);
        checkPlayback(animation, props);
    }
    componentDidMount() {
        const props = this.props;
        this.setupAnimation(props);
    }
    componentDidUpdate(prevProps) {
        const animation = this.animation;
        const props = this.props;
        checkConfig(animation, props, prevProps);
        checkProgress(animation, props, prevProps);
        checkPlayback(animation, props, prevProps);
    }
    render() {
        const { children } = this.props;
        return (React.createElement(React.Fragment, null, React.Children.map(children, (child, id) => React.cloneElement(child, { ref: (el) => this.nodes.set(id, el) }))));
    }
}
const checkConfig = (animation, currentProps = {}, prevProps = {}) => {
    const reservedProps = [
        'children',
        'progressStart',
        'progressStep',
        'progressEnd',
        'pause',
        'stop',
        'destroy',
        'play',
        'from',
        'to',
        'fromTo',
        'onFinish',
    ];
    for (const key in currentProps) {
        if (currentProps.hasOwnProperty(key) &&
            !reservedProps.includes(key) &&
            currentProps[key] !== prevProps[key]) {
            animation[key](currentProps[key]);
        }
    }
    const fromValues = currentProps.from;
    if (fromValues && fromValues !== prevProps.from) {
        const values = Array.isArray(fromValues) ? fromValues : [fromValues];
        values.forEach((val) => animation.from(val.property, val.value));
    }
    const toValues = currentProps.to;
    if (toValues && toValues !== prevProps.to) {
        const values = Array.isArray(toValues) ? toValues : [toValues];
        values.forEach((val) => animation.to(val.property, val.value));
    }
    const fromToValues = currentProps.fromTo;
    if (fromToValues && fromToValues !== prevProps.fromTo) {
        const values = Array.isArray(fromToValues) ? fromToValues : [fromToValues];
        values.forEach((val) => animation.fromTo(val.property, val.fromValue, val.toValue));
    }
    const onFinishValues = currentProps.onFinish;
    if (onFinishValues && onFinishValues !== prevProps.onFinish) {
        const values = Array.isArray(onFinishValues) ? onFinishValues : [onFinishValues];
        values.forEach((val) => animation.onFinish(val.callback, val.opts));
    }
};
const checkProgress = (animation, currentProps = {}, prevProps = {}) => {
    var _a, _b, _c, _d, _e;
    const { progressStart, progressStep, progressEnd } = currentProps;
    if (progressStart &&
        (((_a = prevProps.progressStart) === null || _a === void 0 ? void 0 : _a.forceLinearEasing) !== (progressStart === null || progressStart === void 0 ? void 0 : progressStart.forceLinearEasing) ||
            ((_b = prevProps.progressStart) === null || _b === void 0 ? void 0 : _b.step) !== (progressStart === null || progressStart === void 0 ? void 0 : progressStart.step))) {
        animation.progressStart(progressStart.forceLinearEasing, progressStart.step);
    }
    if (progressStep && ((_c = prevProps.progressStep) === null || _c === void 0 ? void 0 : _c.step) !== (progressStep === null || progressStep === void 0 ? void 0 : progressStep.step)) {
        animation.progressStep(progressStep.step);
    }
    if (progressEnd &&
        (((_d = prevProps.progressEnd) === null || _d === void 0 ? void 0 : _d.playTo) !== (progressEnd === null || progressEnd === void 0 ? void 0 : progressEnd.playTo) ||
            ((_e = prevProps.progressEnd) === null || _e === void 0 ? void 0 : _e.step) !== (progressEnd === null || progressEnd === void 0 ? void 0 : progressEnd.step) ||
            (prevProps === null || prevProps === void 0 ? void 0 : prevProps.dur) !== (progressEnd === null || progressEnd === void 0 ? void 0 : progressEnd.dur))) {
        animation.progressEnd(progressEnd.playTo, progressEnd.step, progressEnd.dur);
    }
};
const checkPlayback = (animation, currentProps = {}, prevProps = {}) => {
    if (!prevProps.play && currentProps.play) {
        animation.play();
    }
    if (!prevProps.pause && currentProps.pause) {
        animation.pause();
    }
    if (!prevProps.stop && currentProps.stop) {
        animation.stop();
    }
    if (!prevProps.destroy && currentProps.destroy) {
        animation.destroy();
    }
};

function useController(displayName, controller) {
    const overlayRef = useRef();
    const didDismissEventName = useMemo(() => `on${displayName}DidDismiss`, [displayName]);
    const didPresentEventName = useMemo(() => `on${displayName}DidPresent`, [displayName]);
    const willDismissEventName = useMemo(() => `on${displayName}WillDismiss`, [displayName]);
    const willPresentEventName = useMemo(() => `on${displayName}WillPresent`, [displayName]);
    const present = useCallback(async (options) => {
        if (overlayRef.current) {
            return;
        }
        const { onDidDismiss, onWillDismiss, onDidPresent, onWillPresent } = options, rest = __rest(options, ["onDidDismiss", "onWillDismiss", "onDidPresent", "onWillPresent"]);
        const handleDismiss = (event) => {
            if (onDidDismiss) {
                onDidDismiss(event);
            }
            overlayRef.current = undefined;
        };
        overlayRef.current = await controller.create(Object.assign({}, rest));
        attachProps(overlayRef.current, {
            [didDismissEventName]: handleDismiss,
            [didPresentEventName]: (e) => onDidPresent && onDidPresent(e),
            [willDismissEventName]: (e) => onWillDismiss && onWillDismiss(e),
            [willPresentEventName]: (e) => onWillPresent && onWillPresent(e),
        });
        overlayRef.current.present();
    }, [controller]);
    const dismiss = useCallback(async () => {
        overlayRef.current && (await overlayRef.current.dismiss());
        overlayRef.current = undefined;
    }, []);
    return {
        present,
        dismiss,
    };
}

/**
 * A hook for presenting/dismissing an IonActionSheet component
 * @returns Returns the present and dismiss methods in an array
 */
function useIonActionSheet() {
    const controller = useController('IonActionSheet', actionSheetController$1);
    const present = useCallback((buttonsOrOptions, header) => {
        if (Array.isArray(buttonsOrOptions)) {
            controller.present({
                buttons: buttonsOrOptions,
                header,
            });
        }
        else {
            controller.present(buttonsOrOptions);
        }
    }, [controller.present]);
    return [present, controller.dismiss];
}

/**
 * A hook for presenting/dismissing an IonAlert component
 * @returns Returns the present and dismiss methods in an array
 */
function useIonAlert() {
    const controller = useController('IonAlert', alertController);
    const present = useCallback((messageOrOptions, buttons) => {
        if (typeof messageOrOptions === 'string') {
            controller.present({
                message: messageOrOptions,
                buttons: buttons !== null && buttons !== void 0 ? buttons : [{ text: 'Ok' }],
            });
        }
        else {
            controller.present(messageOrOptions);
        }
    }, [controller.present]);
    return [present, controller.dismiss];
}

/**
 * A hook for presenting/dismissing an IonToast component
 * @returns Returns the present and dismiss methods in an array
 */
function useIonToast() {
    const controller = useController('IonToast', toastController$1);
    const present = useCallback((messageOrOptions, duration) => {
        if (typeof messageOrOptions === 'string') {
            controller.present({
                message: messageOrOptions,
                duration
            });
        }
        else {
            controller.present(messageOrOptions);
        }
    }, [controller.present]);
    return [
        present,
        controller.dismiss
    ];
}

function useOverlay(displayName, controller, component, componentProps) {
    const overlayRef = useRef();
    const containerElRef = useRef();
    const didDismissEventName = useMemo(() => `on${displayName}DidDismiss`, [displayName]);
    const didPresentEventName = useMemo(() => `on${displayName}DidPresent`, [displayName]);
    const willDismissEventName = useMemo(() => `on${displayName}WillDismiss`, [displayName]);
    const willPresentEventName = useMemo(() => `on${displayName}WillPresent`, [displayName]);
    const [isOpen, setIsOpen] = useState(false);
    useEffect(() => {
        if (isOpen && component && containerElRef.current) {
            if (React.isValidElement(component)) {
                ReactDOM.render(component, containerElRef.current);
            }
            else {
                ReactDOM.render(React.createElement(component, componentProps), containerElRef.current);
            }
        }
    }, [component, containerElRef.current, isOpen, componentProps]);
    const present = useCallback(async (options) => {
        if (overlayRef.current) {
            return;
        }
        const { onDidDismiss, onWillDismiss, onDidPresent, onWillPresent } = options, rest = __rest(options, ["onDidDismiss", "onWillDismiss", "onDidPresent", "onWillPresent"]);
        if (typeof document !== 'undefined') {
            containerElRef.current = document.createElement('div');
        }
        overlayRef.current = await controller.create(Object.assign(Object.assign({}, rest), { component: containerElRef.current }));
        attachProps(overlayRef.current, {
            [didDismissEventName]: handleDismiss,
            [didPresentEventName]: (e) => onDidPresent && onDidPresent(e),
            [willDismissEventName]: (e) => onWillDismiss && onWillDismiss(e),
            [willPresentEventName]: (e) => onWillPresent && onWillPresent(e),
        });
        overlayRef.current.present();
        setIsOpen(true);
        function handleDismiss(event) {
            if (onDidDismiss) {
                onDidDismiss(event);
            }
            overlayRef.current = undefined;
            containerElRef.current = undefined;
            setIsOpen(false);
        }
    }, []);
    const dismiss = useCallback(async () => {
        overlayRef.current && await overlayRef.current.dismiss();
        overlayRef.current = undefined;
        containerElRef.current = undefined;
    }, []);
    return {
        present,
        dismiss,
    };
}

/**
 * A hook for presenting/dismissing an IonModal component
 * @param component The component that the modal will show. Can be a React Component, a functional component, or a JSX Element
 * @param componentProps The props that will be passed to the component, if required
 * @returns Returns the present and dismiss methods in an array
 */
function useIonModal(component, componentProps) {
    const controller = useOverlay('IonModal', modalController, component, componentProps);
    const present = useCallback((options = {}) => {
        controller.present(options);
    }, [controller.present]);
    return [present, controller.dismiss];
}

/**
 * A hook for presenting/dismissing an IonPicker component
 * @param component The component that the popover will show. Can be a React Component, a functional component, or a JSX Element
 * @param componentProps The props that will be passed to the component, if required
 * @returns Returns the present and dismiss methods in an array
 */
function useIonPopover(component, componentProps) {
    const controller = useOverlay('IonPopover', popoverController, component, componentProps);
    const present = useCallback((options = {}) => {
        controller.present(options);
    }, [controller.present]);
    return [
        present,
        controller.dismiss
    ];
}

/**
 * A hook for presenting/dismissing an IonPicker component
 * @returns Returns the present and dismiss methods in an array
 */
function useIonPicker() {
    const controller = useController('IonPicker', pickerController);
    const present = useCallback((columnsOrOptions, buttons) => {
        if (Array.isArray(columnsOrOptions)) {
            controller.present({
                columns: columnsOrOptions,
                buttons: buttons !== null && buttons !== void 0 ? buttons : [{ text: 'Ok' }],
            });
        }
        else {
            controller.present(columnsOrOptions);
        }
    }, [controller.present]);
    return [present, controller.dismiss];
}

/**
 * A hook for presenting/dismissing an IonLoading component
 * @returns Returns the present and dismiss methods in an array
 */
function useIonLoading() {
    const controller = useController('IonLoading', loadingController);
    const present = useCallback((messageOrOptions = '', duration, spinner) => {
        if (typeof messageOrOptions === 'string') {
            controller.present({
                message: messageOrOptions,
                duration,
                spinner: spinner !== null && spinner !== void 0 ? spinner : 'lines',
            });
        }
        else {
            controller.present(messageOrOptions);
        }
    }, [controller.present]);
    return [present, controller.dismiss];
}

// Icons that are used by internal components
addIcons({
    'arrow-back-sharp': icons/* arrowBackSharp */.qVp,
    'caret-back-sharp': icons/* caretBackSharp */.pYd,
    'chevron-back': icons/* chevronBack */.Mny,
    'chevron-forward': icons/* chevronForward */.XXs,
    close: icons/* close */.xvD,
    'close-circle': icons/* closeCircle */.XZx,
    'close-sharp': icons/* closeSharp */.Uy3,
    'menu-outline': icons/* menuOutline */.Xa5,
    'menu-sharp': icons/* menuSharp */.g8K,
    'reorder-two-sharp': icons/* reorderTwoSharp */.e2c,
    'reorder-three-outline': icons/* reorderThreeOutline */.Ngh,
    'search-outline': icons/* searchOutline */.W6I,
    'search-sharp': icons/* searchSharp */.YJw,
});
// TODO: defineCustomElements() is asyncronous
// We need to use the promise
if (typeof window !== 'undefined') {
    defineCustomElements(window);
}

const RouteManagerContext = /*@__PURE__*/ react.createContext({
    addViewItem: () => undefined,
    canGoBack: () => undefined,
    clearOutlet: () => undefined,
    createViewItem: () => undefined,
    findViewItemByPathname: () => undefined,
    findLeavingViewItemByRouteInfo: () => undefined,
    findViewItemByRouteInfo: () => undefined,
    getChildrenToRender: () => undefined,
    goBack: () => undefined,
    unMountViewItem: () => undefined,
});

class ViewLifeCycleManager extends react.Component {
    constructor(props) {
        super(props);
        this.ionLifeCycleContext = new DefaultIonLifeCycleContext();
        this._isMounted = false;
        this.ionLifeCycleContext.onComponentCanBeDestroyed(() => {
            if (!this.props.mount) {
                if (this._isMounted) {
                    this.setState({
                        show: false,
                    }, () => this.props.removeView());
                }
            }
        });
        this.state = {
            show: true,
        };
    }
    componentDidMount() {
        this._isMounted = true;
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    render() {
        const { show } = this.state;
        return (React.createElement(IonLifeCycleContext.Provider, { value: this.ionLifeCycleContext }, show && this.props.children));
    }
}

// const RESTRICT_SIZE = 100;
class LocationHistory {
    constructor() {
        this.locationHistory = [];
        this.tabHistory = {};
    }
    add(routeInfo) {
        if (routeInfo.routeAction === 'push' || routeInfo.routeAction == null) {
            this._add(routeInfo);
        }
        else if (routeInfo.routeAction === 'pop') {
            this._pop(routeInfo);
        }
        else if (routeInfo.routeAction === 'replace') {
            this._replace(routeInfo);
        }
        if (routeInfo.routeDirection === 'root') {
            this._clear();
            this._add(routeInfo);
        }
    }
    clearTabStack(tab) {
        const routeInfos = this._getRouteInfosByKey(tab);
        if (routeInfos) {
            routeInfos.forEach((ri) => {
                this.locationHistory = this.locationHistory.filter((x) => x.id !== ri.id);
            });
            this.tabHistory[tab] = [];
        }
    }
    update(routeInfo) {
        const locationIndex = this.locationHistory.findIndex((x) => x.id === routeInfo.id);
        if (locationIndex > -1) {
            this.locationHistory.splice(locationIndex, 1, routeInfo);
        }
        const tabArray = this.tabHistory[routeInfo.tab || ''];
        if (tabArray) {
            const tabIndex = tabArray.findIndex((x) => x.id === routeInfo.id);
            if (tabIndex > -1) {
                tabArray.splice(tabIndex, 1, routeInfo);
            }
            else {
                tabArray.push(routeInfo);
            }
        }
        else if (routeInfo.tab) {
            this.tabHistory[routeInfo.tab] = [routeInfo];
        }
    }
    _add(routeInfo) {
        const routeInfos = this._getRouteInfosByKey(routeInfo.tab);
        if (routeInfos) {
            // If the latest routeInfo is the same (going back and forth between tabs), replace it
            if (this._areRoutesEqual(routeInfos[routeInfos.length - 1], routeInfo)) {
                routeInfos.pop();
            }
            routeInfos.push(routeInfo);
        }
        this.locationHistory.push(routeInfo);
    }
    _areRoutesEqual(route1, route2) {
        if (!route1 || !route2) {
            return false;
        }
        return route1.pathname === route2.pathname && route1.search === route2.search;
    }
    _pop(routeInfo) {
        const routeInfos = this._getRouteInfosByKey(routeInfo.tab);
        if (routeInfos) {
            // Pop the previous route
            routeInfos.pop();
            // Replace the current route with an updated version
            routeInfos.pop();
            routeInfos.push(routeInfo);
        }
        // Pop the previous route
        this.locationHistory.pop();
        // Replace the current route with an updated version
        this.locationHistory.pop();
        this.locationHistory.push(routeInfo);
    }
    _replace(routeInfo) {
        const routeInfos = this._getRouteInfosByKey(routeInfo.tab);
        routeInfos && routeInfos.pop();
        this.locationHistory.pop();
        this._add(routeInfo);
    }
    _clear() {
        const keys = Object.keys(this.tabHistory);
        keys.forEach((k) => (this.tabHistory[k] = []));
        this.locationHistory = [];
    }
    _getRouteInfosByKey(key) {
        let routeInfos;
        if (key) {
            routeInfos = this.tabHistory[key];
            if (!routeInfos) {
                routeInfos = this.tabHistory[key] = [];
            }
        }
        return routeInfos;
    }
    getFirstRouteInfoForTab(tab) {
        const routeInfos = this._getRouteInfosByKey(tab);
        if (routeInfos) {
            return routeInfos[0];
        }
        return undefined;
    }
    getCurrentRouteInfoForTab(tab) {
        const routeInfos = this._getRouteInfosByKey(tab);
        if (routeInfos) {
            return routeInfos[routeInfos.length - 1];
        }
        return undefined;
    }
    findLastLocation(routeInfo) {
        const routeInfos = this._getRouteInfosByKey(routeInfo.tab);
        if (routeInfos) {
            for (let i = routeInfos.length - 2; i >= 0; i--) {
                const ri = routeInfos[i];
                if (ri) {
                    if (ri.pathname === routeInfo.pushedByRoute) {
                        return ri;
                    }
                }
            }
        }
        for (let i = this.locationHistory.length - 2; i >= 0; i--) {
            const ri = this.locationHistory[i];
            if (ri) {
                if (ri.pathname === routeInfo.pushedByRoute) {
                    return ri;
                }
            }
        }
        return undefined;
    }
    previous() {
        return (this.locationHistory[this.locationHistory.length - 2] ||
            this.locationHistory[this.locationHistory.length - 1]);
    }
    current() {
        return this.locationHistory[this.locationHistory.length - 1];
    }
    canGoBack() {
        return this.locationHistory.length > 1;
    }
}

class NavManager extends react.PureComponent {
    constructor(props) {
        super(props);
        this._isMounted = false;
        this.ionRouterContextValue = {
            push: (pathname, routerDirection, routeAction, routerOptions, animationBuilder) => {
                this.navigate(pathname, routerDirection, routeAction, animationBuilder, routerOptions);
            },
            back: (animationBuilder) => {
                this.goBack(undefined, animationBuilder);
            },
            canGoBack: () => this.props.locationHistory.canGoBack(),
            nativeBack: () => this.props.onNativeBack(),
            routeInfo: this.props.routeInfo,
        };
        this.state = {
            goBack: this.goBack.bind(this),
            hasIonicRouter: () => true,
            navigate: this.navigate.bind(this),
            getIonRedirect: this.getIonRedirect.bind(this),
            getIonRoute: this.getIonRoute.bind(this),
            getStackManager: this.getStackManager.bind(this),
            getPageManager: this.getPageManager.bind(this),
            routeInfo: this.props.routeInfo,
            setCurrentTab: this.props.onSetCurrentTab,
            changeTab: this.props.onChangeTab,
            resetTab: this.props.onResetTab,
        };
        if (typeof document !== 'undefined') {
            this.handleHardwareBackButton = this.handleHardwareBackButton.bind(this);
            document.addEventListener('ionBackButton', this.handleHardwareBackButton);
        }
    }
    componentDidMount() {
        this._isMounted = true;
    }
    componentWillUnmount() {
        if (typeof document !== 'undefined') {
            document.removeEventListener('ionBackButton', this.handleHardwareBackButton);
            this._isMounted = false;
        }
    }
    handleHardwareBackButton(e) {
        e.detail.register(0, (processNextHandler) => {
            if (this._isMounted) {
                this.nativeGoBack();
                processNextHandler();
            }
        });
    }
    goBack(route, animationBuilder) {
        this.props.onNavigateBack(route, animationBuilder);
    }
    nativeGoBack() {
        this.props.onNativeBack();
    }
    navigate(path, direction = 'forward', action = 'push', animationBuilder, options, tab) {
        this.props.onNavigate(path, action, direction, animationBuilder, options, tab);
    }
    getPageManager() {
        return PageManager;
    }
    getIonRedirect() {
        return this.props.ionRedirect;
    }
    getIonRoute() {
        return this.props.ionRoute;
    }
    getStackManager() {
        return this.props.stackManager;
    }
    render() {
        return (React.createElement(NavContext.Provider, { value: Object.assign(Object.assign({}, this.state), { routeInfo: this.props.routeInfo }) },
            React.createElement(IonRouterContext.Provider, { value: Object.assign(Object.assign({}, this.ionRouterContextValue), { routeInfo: this.props.routeInfo }) }, this.props.children)));
    }
}

class ViewStacks {
    constructor() {
        this.viewStacks = {};
        this.add = this.add.bind(this);
        this.clear = this.clear.bind(this);
        this.getViewItemsForOutlet = this.getViewItemsForOutlet.bind(this);
        this.remove = this.remove.bind(this);
    }
    add(viewItem) {
        const { outletId } = viewItem;
        if (!this.viewStacks[outletId]) {
            this.viewStacks[outletId] = [viewItem];
        }
        else {
            this.viewStacks[outletId].push(viewItem);
        }
    }
    clear(outletId) {
        // Give some time for the leaving views to transition before removing
        setTimeout(() => {
            // console.log('Removing viewstack for outletID ' + outletId);
            delete this.viewStacks[outletId];
        }, 500);
    }
    getViewItemsForOutlet(outletId) {
        return this.viewStacks[outletId] || [];
    }
    remove(viewItem) {
        const { outletId } = viewItem;
        const viewStack = this.viewStacks[outletId];
        if (viewStack) {
            const viewItemToRemove = viewStack.find((x) => x.id === viewItem.id);
            if (viewItemToRemove) {
                viewItemToRemove.mount = false;
                this.viewStacks[outletId] = viewStack.filter((x) => x.id !== viewItemToRemove.id);
            }
        }
    }
    getStackIds() {
        return Object.keys(this.viewStacks);
    }
    getAllViewItems() {
        const keys = this.getStackIds();
        const viewItems = [];
        keys.forEach((k) => {
            viewItems.push(...this.viewStacks[k]);
        });
        return viewItems;
    }
}

const ids = { main: 0 };
const generateId = (type = 'main') => {
    var _a;
    const id = ((_a = ids[type]) !== null && _a !== void 0 ? _a : 0) + 1;
    ids[type] = id;
    return id.toString();
};


//# sourceMappingURL=index.esm.js.map


/***/ })

}]);