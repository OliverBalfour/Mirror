(this.webpackJsonpmirror=this.webpackJsonpmirror||[]).push([[0],{207:function(e,t,n){e.exports=n(376)},336:function(e,t){},373:function(e,t,n){},374:function(e,t,n){},375:function(e,t,n){},376:function(e,t,n){"use strict";n.r(t);var a={};n.r(a),n.d(a,"Edit",(function(){return Ge})),n.d(a,"Indicator",(function(){return Ye}));var r={};n.r(r),n.d(r,"Edit",(function(){return at})),n.d(r,"Indicator",(function(){return rt}));var c={};n.r(c),n.d(c,"Edit",(function(){return ut})),n.d(c,"Indicator",(function(){return ft}));var o,l=n(0),i=n.n(l),u=n(16),s=n.n(u),d=n(10),m=n(11),f=n(170),b=n(18),p=n(17),E=n(186),v=n(410),g=n(411),h=n(412),O=null,y=function(){var e="yyyyMMdd-hhmmss",t=E.a(new Date,e);return null!==O&&O.substring(0,e.length)===t&&(O.length===e.length?t+="-1":t+="-"+(parseInt(O.substring(e.length+1,O.length))+1)),O=t,t},j=function(){var e,t=(new Date).getTime(),n=[y(),y()],a=Object(p.a)({tabs:(e={},Object(b.a)(e,n[0],{name:"Main",id:n[0],created:t,edited:t}),Object(b.a)(e,n[1],{name:"Secondary",id:n[1],created:t,edited:t}),e)},function(e,t){for(var n=e.reduce((function(e,t){return e+t}),0),a={},r=["Wash the dishes","Make cool app","Run out of ideas for sample tasks for the app you're making","Cook pizza for dinner","Finish your chemistry homework","Write a tutorial explaining how monads are isomorphic to burritos in the category of food","Forget to wrap a line at 300 characters","Learn Common Lisp","Do normal human things","Prove P=NP for N=1","Eat some chocolate","Stop eating so much chocolate","Write witty comment","\ud83d\ude42"],c=(new Date).getTime(),o=0;o<n;o++){var l=y();a[l]={id:l,type:0,content:r[Math.floor(Math.random()*r.length)],created:c,edited:c,moved:c}}for(var i={},u=0,s=0;u<e.length;u++){var d=Object.keys(a).slice(s,s+e[u]),m=y();i[m]={id:m,items:d,name:t[u],created:c,edited:c},s+=e[u]}return{cards:a,columns:i}}([9,2,6,5,4],["To Do","Doing","Done","Misc 1","Misc 2"])),r=Object.keys(a.columns);return a.tabs[n[0]].columns=[r[0],r[1],r[2]],a.tabs[n[1]].columns=[r[3],r[4]],a.tabOrder=n,a.cards.main={id:"main",content:"Welcome",type:1,description:"Welcome to your Zettelkasten! You can edit this and use `[[wikilink]]` syntax to link to other nodes.",created:t,edited:t},a},C=function(e,t,n){if(localStorage.version===e){var a=JSON.parse(localStorage.kanban);n(a),localStorage.kanban=JSON.stringify(a),localStorage.version=t}},w=function(e,t){return Object.keys(e).reduce((function(n,a){return n[a]=t(e[a]),n}),{})},k=function(e){var t=new Date(e),n=new Date,a=function(e){return 0===e.getHours()&&0===e.getMinutes()?null:0===e.getMinutes()?E.a(e,"haaa"):E.a(e,"h:mmaaa")}(t);return function(e){var t=v.a(e,n),a=g.a(e,n,{weekStartsOn:1}),r=h.a(e,n);if(0===t)return"Today";if(-1===t)return"Yesterday";if(1===t)return"Tomorrow";var c=E.a(e,"EEE");return 0===a&&t>=0?c:t>=-7&&t<0?"Last ".concat(c):t>0&&t<=7?"Next ".concat(c):t>7&&t<=14?"".concat(c," Week"):0===r?E.a(e,"MMM do"):E.a(e,"MMM do yyyy")}(t)+(a?" "+a:"")},x=function(){return window.location.hash.replace("#","")||"/"},D=function(){var e=l.useState(x()),t=Object(d.a)(e,2),n=t[0],a=t[1];return l.useEffect((function(){var e=function(){return a(x())};return window.addEventListener("hashchange",e),function(){return window.removeEventListener("hashchange",e)}}),[]),[n,l.useCallback((function(e){return window.location.hash=e}),[]),l.useCallback((function(e){history.replaceState(void 0,void 0,"#"+e),a(e)}),[])]},T=function(e){if(!e)return"unknown";var t=e.content.split("\n")[0];return t.length>40?t.substring(0,37)+"...":t},N=function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];var a=t.filter(Boolean);return a.length?0===a.length?a[0]:function(e){var t,n=Object(f.a)(a);try{for(n.s();!(t=n.n()).done;){var r=t.value;"function"===typeof r?r(e):r&&(r.current=e)}}catch(c){n.e(c)}finally{n.f()}}:null},I=function(e){var t=e.shouldProtect,n=void 0===t||t;return l.useEffect((function(){return n&&(window.onbeforeunload=function(e){return"Are you sure you want to quit?"}),function(){return window.onbeforeunload=null}})),null},S=n(416),M=n(433),A=n(417),R=n(418),L=n(67),z=n.n(L),_=n(187),F=n(440),P=function(e){var t=e.map,n=e.children,a=l.useState(null),r=Object(d.a)(a,2),c=r[0],o=r[1],i=function(){return o(null)};return l.createElement(l.Fragment,null,l.createElement(_.a,{anchorEl:c,keepMounted:!0,open:Boolean(c),onClose:i},Object.entries(t).map((function(e){var t=Object(d.a)(e,2),n=t[0],a=t[1];return l.createElement(F.a,{key:n,onClick:function(){i(),a()}},n)}))),l.cloneElement(n,{onClick:function(e){return o(e.currentTarget)}}))},B=function(e){var t=e.show,n=e.children;return l.createElement("div",{hidden:!t,style:{height:"calc(100% - 48px)"}},t&&n)},W=function(e){var t=e.tabs,n=e.render,a=e.children,r=e.index,c=e.setIndex,o=e.addTab,i=e.renameTab,u=e.deleteTab,s=e.moveTab,d=function(e,n){return n>=0&&n<t.length&&c(n)},m=function(){return l.createElement("div",{style:{flexGrow:1}})};return l.createElement("div",{style:{flex:1}},l.createElement(S.a,{position:"static",style:{backgroundColor:"white",zIndex:2,position:"relative"}},l.createElement(M.a,{value:r,onChange:d,indicatorColor:"primary",textColor:"primary"},t.map((function(e){return l.createElement(A.a,{label:e,key:e})})),l.createElement(m,null),l.createElement(P,{map:{"Add tab":function(){return o()},"Rename tab":function(){return i(r)},"Delete tab":function(){return u(r)},"Move tab left":function(){return s([r,r-1]),d(0,r-1)},"Move tab right":function(){return s([r,r+1]),d(0,r+1)}}},l.createElement(R.a,null,l.createElement(z.a,null))),a)),t.map((function(e,t){return l.createElement(B,{show:r===t,key:e},r===t&&n(t))})))},Z=n(419),J=n(378),K=(Object(Z.a)((function(e){return{button:{}}})),n(423)),H=n(178),U=n.n(H),V=n(179),G=n.n(V),Y=n(102),$=n.n(Y),q=n(104),Q=n(438),X=n(428),ee=n(424),te=n(429),ne=n(425),ae=n(437),re=n(442),ce=n(435),oe=n(430),le=n(19),ie=n(55),ue=n.n(ie),se=Object(le.b)("kanban/TRANSFER_CARD"),de=Object(le.b)("kanban/REORDER_CARD"),me=Object(le.b)("kanban/ADD_CARD"),fe=Object(le.b)("kanban/EDIT_CARD_CONTENT"),be=Object(le.b)("kanban/EDIT_CARD"),pe=Object(le.b)("kanban/DELETE_CARD"),Ee=Object(le.b)("kanban/ADD_COLUMN"),ve=Object(le.b)("kanban/DELETE_COLUMN"),ge=Object(le.b)("kanban/RENAME_COLUMN"),he=Object(le.b)("kanban/MOVE_COLUMN"),Oe=Object(le.b)("kanban/ARCHIVE_ALL_COLUMN"),ye=Object(le.b)("kanban/ADD_TAB"),je=Object(le.b)("kanban/DELETE_TAB"),Ce=Object(le.b)("kanban/RENAME_TAB"),we=Object(le.b)("kanban/MOVE_TAB"),ke=Object(le.b)("zettelkasten/ADD_ZETTEL"),xe=Object(le.b)("zettelkasten/EDIT_ZETTEL"),De=Object(le.b)("zettelkasten/DELETE_ZETTEL"),Te=Object(le.b)("zettelkasten/TOGGLE_STARRED"),Ne=function(e,t){var n=e.indexOf(t);return-1!==n&&e.splice(n,1),-1!==n},Ie={getColumnsInTabs:function(e){return w(e.tabs,(function(t){return t.columns.map((function(t){return e.columns[t]})).map((function(t){return Object(p.a)(Object(p.a)({},t),{},{items:t.items.map((function(t){return e.cards[t]}))})}))}))},columns:function(e){return e.columns},tabs:function(e){return e.tabs},tabOrder:function(e){return e.tabOrder},cards:function(e){return e.cards},archivedCards:function(e){return Object.values(e.cards).filter((function(e){return-1!==Object.keys(e).indexOf("archived")}))},activeCards:function(e){return Object.values(e.cards).filter((function(e){return-1===Object.keys(e).indexOf("archived")}))},starredZettels:function(e){return e.starredZettels?e.starredZettels:[]},cardsByTab:function(e){return w(e.tabs,(function(t){return t.columns.flatMap((function(t){return e.columns[t].items}))}))}},Se=function(){try{if(!localStorage.version)throw new Error;if(C("0.1.0","0.2.0",(function(e){var t=(new Date).getTime();return e.cards.main={id:"main",content:"Welcome",description:"Welcome to your Zettelkasten! You can edit this and use `[[wikilink]]` syntax to link to other nodes.",created:t,edited:t},e})),C("0.2.0","0.2.1",(function(e){var t=function(t){var n=Object.values(e.columns).filter((function(e){return-1!==e.items.indexOf(t)})).length;e.cards[t].type=n?0:1};for(var n in e.cards)t(n);return e.cards.main.type=1,e})),localStorage.hasOwnProperty("kanban"))return JSON.parse(localStorage.kanban)||j()}catch(e){}return j()}(),Me=Object(le.c)(Se,(o={},Object(b.a)(o,se,(function(e,t){var n=t.payload,a=n.srcColID,r=n.dstColID,c=n.srcIndex,o=n.dstIndex,l=e.columns[a].items,i=e.columns[r].items,u=l.splice(c,1),s=Object(d.a)(u,1)[0],m=(new Date).getTime();e.cards[s].moved=m,e.columns[a].edited=m,e.columns[r].edited=m,i.splice(o,0,s)})),Object(b.a)(o,de,(function(e,t){var n=t.payload,a=n.colID,r=n.srcIndex,c=n.dstIndex,o=(new Date).getTime();e.columns[a].edited=o;var l=e.columns[a].items,i=l.splice(r,1),u=Object(d.a)(i,1)[0];e.cards[u].moved=o,l.splice(c,0,u),e.columns[a].items=l})),Object(b.a)(o,me,(function(e,t){var n=t.payload,a=n.content,r=n.colID,c=y(),o=(new Date).getTime();e.cards[c]={id:c,content:a,type:0,created:o,edited:o,moved:o},e.columns[r].items.unshift(c),e.columns[r].edited=o})),Object(b.a)(o,ve,(function(e,t){var n=t.payload,a=Object.values(e.tabs).map((function(e){return-1!==e.columns.indexOf(t.payload)})).indexOf(!0);a>=0&&(e.tabs[e.tabOrder[a]].edited=(new Date).getTime()),e.columns[n].items.forEach((function(t){return delete e.cards[t]})),Object.values(e.tabs).forEach((function(e){return Ne(e.columns,n)})),delete e.columns[n]})),Object(b.a)(o,ge,(function(e,t){var n=t.payload,a=n.colID,r=n.name;e.columns[a].name=r,e.columns[a].edited=(new Date).getTime()})),Object(b.a)(o,fe,(function(e,t){var n=t.payload,a=n.cardID,r=n.content;e.cards[a].content=r,e.cards[a].edited=(new Date).getTime()})),Object(b.a)(o,pe,(function(e,t){Object.values(e.columns).forEach((function(e){Ne(e.items,t.payload)&&(e.edited=(new Date).getTime())})),delete e.cards[t.payload]})),Object(b.a)(o,Ee,(function(e,t){var n=t.payload,a=n.tabID,r=n.name,c=y(),o=(new Date).getTime();e.columns[c]={id:c,items:[],name:r,created:o,edited:o},e.tabs[a].columns.push(c),e.tabs[a].edited=o})),Object(b.a)(o,be,(function(e,t){var n=t.payload,a=n.card,r=n.colID,c=(new Date).getTime();e.cards[a.id]=t.payload.card,e.cards[a.id].edited=c;var o=Object.keys(e.columns).filter((function(t){return-1!==e.columns[t].items.indexOf(a.id)}))[0],l=r;o!==l&&(Ne(e.columns[o].items,a.id),e.columns[l].items.unshift(a.id),e.columns[o].edited=e.columns[l].edited=c)})),Object(b.a)(o,je,(function(e,t){for(var n=t.payload,a=e.tabs[e.tabOrder[n]];a.columns.length;){var r=a.columns[0];e.columns[r].items.forEach((function(t){return delete e.cards[t]})),delete e.columns[r],a.columns.shift()}delete e.tabs[e.tabOrder[n]],e.tabOrder.splice(n,1)})),Object(b.a)(o,ye,(function(e,t){var n=y(),a=t.payload;e.tabs[n]={name:a,id:n,columns:[],created:(new Date).getTime()},e.tabOrder.push(n)})),Object(b.a)(o,Ce,(function(e,t){var n=t.payload,a=n.tabID,r=n.name;e.tabs[a].name=r,e.tabs[a].edited=(new Date).getTime()})),Object(b.a)(o,he,(function(e,t){var n=Object(d.a)(t.payload,3),a=n[0],r=n[1],c=n[2],o=e.tabOrder[c],l=e.tabs[o].columns,i=l.splice(a,1),u=Object(d.a)(i,1)[0];l.splice(r,0,u),e.tabs[o].columns=l,e.tabs[o].edited=(new Date).getTime()})),Object(b.a)(o,we,(function(e,t){var n=Object(d.a)(t.payload,2),a=n[0],r=n[1];if(!(r<0||r>=e.tabs.length)){var c=e.tabOrder,o=c.splice(a,1),l=Object(d.a)(o,1)[0];c.splice(r,0,l),e.tabOrder=c}})),Object(b.a)(o,Oe,(function(e,t){var n=t.payload,a=(new Date).getTime();e.columns[n].items.forEach((function(n){var r=e.cards[n];r.moved=r.edited=r.archived=a,r.archivedFromColID=t.payload})),e.columns[n].items=[],e.columns[n].edited=a})),Object(b.a)(o,ke,(function(e,t){var n=t.payload.zettel,a=n.id||y(),r=(new Date).getTime();e.cards[a]=Object(p.a)({id:a,type:1,created:r,edited:r,moved:r},n)})),Object(b.a)(o,xe,(function(e,t){var n=t.payload.zettel,a=(new Date).getTime();-1!==Object.keys(e.cards).indexOf(n.id)&&(e.cards[n.id]=n,e.cards[n.id].edited=a)})),Object(b.a)(o,De,(function(e,t){delete e.cards[t.payload]})),Object(b.a)(o,Te,(function(e,t){e.starredZettels||(e.starredZettels=[]),-1===e.starredZettels.indexOf(t.payload)?e.starredZettels.push(t.payload):Ne(e.starredZettels,t.payload)})),o)),Ae=ue()(Me,{limit:20}),Re=n(84),Le=Object(le.a)({reducer:Ae,middleware:function(e){return e().concat(Re.a)}});try{document.addEventListener("keyup",(function(e){-1===["input","textarea"].indexOf(document.activeElement.tagName.toLowerCase())&&(e.ctrlKey&&90===e.which&&!e.shiftKey?Le.dispatch(ie.ActionCreators.undo()):(e.ctrlKey&&e.shiftKey&&90===e.which||e.ctrlKey&&89===e.which)&&Le.dispatch(ie.ActionCreators.redo()))}))}catch(qt){}var ze=Le,_e=function(e){return e.present},Fe={boards:w(Ie,(function(e){return function(t){return e(_e(t))}}))},Pe=function(){return function(e){try{if(localStorage){var t=JSON.stringify(e);localStorage.setItem("kanban",t),localStorage.setItem("version","0.2.1")}}catch(qt){}}(_e(Le.getState()))};Le.subscribe(Pe),Pe();var Be=n(443),We=n(174),Ze=n.n(We),Je=(n(297),function(e){var t=e.cards?function(e,t){for(var n,a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"#/notes/",r=/(\[\[[A-Za-z0-9_-]+\]\])/gm;null!==(n=r.exec(e));){n.index===r.lastIndex&&r.lastIndex++;var c=(e.substring(0,n.index).match(/`/gm)||[]).length%2===0;if(c){var o=n[1].substring(2,n[1].length-2),l=e.substring(0,n.index),i=T(t[o]),u=a+o,s=e.substring(n.index+n[1].length,e.length);e=l+"[".concat(i,"](").concat(u,")")+s}}return e}(e.source,e.cards):e.source;return l.createElement(Ze.a,{source:t,escapeHtml:!1})}),Ke=n(422),He=n(130),Ue=n(175),Ve=function(e){var t=e.value,n=e.setValue,a=e.autoFocus,r=void 0!==a&&a,c=e.addNote,o=e.rows,i=e.rowsMax,u=l.useRef(null),s=Object(m.d)(Fe.boards.cards);return l.useEffect((function(){var e=new Ue.TextareaEditor(u.current),t={context:function(e){return e.indexOf("[[")>=0},match:/\[\[([A-Za-z0-9_ -]+)$/,search:function(e,t,n){return t([].concat(Object(q.a)(function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:10,a=[],r=e.toLowerCase();for(var c in t)if(t[c].content.toLowerCase().includes(r)&&(a.push(c),a.length===n))return a;for(var o in t)if(t[o].description&&t[o].description.toLowerCase().includes(r)&&(a.push(o),a.length===n))return a;for(var l in t)if(l.toLowerCase().includes(r)&&(a.push(l),a.length===n))return a;return a}(e,s)),[0]))},cache:!0,template:function(e){return 0===e?c?"<em>Add note</em>":"":T(s[e])},replace:function(e){if(0===e&&c){var t=y();return setTimeout((function(){return c(t)}),0),"[[".concat(t,"]]")}return"[[".concat(e,"]]")}},n=new He.Textcomplete(e,[t],{dropdown:{rotate:!0,maxCount:10}});return function(){n.destroy(),delete window.__addNote}})),l.createElement(ae.a,{margin:"dense",fullWidth:!0,variant:"outlined",autoFocus:r,multiline:!0,rows:o,rowsMax:i,value:t,onChange:function(e){return n(e.target.value)},inputProps:{ref:u}})},Ge=function(e){var t=e.card,n=e.setCard,a=l.useState(!1),r=Object(d.a)(a,2),c=r[0],o=r[1],i=Object(m.d)(Fe.boards.cards);return c||"string"===typeof t.description?c?l.createElement(l.Fragment,null,l.createElement(re.a,{className:"custom-label"},"Description"),l.createElement(Ke.a,{onClickAway:function(){return o(!1)}},l.createElement("div",{style:{width:"100%",height:"100%"}},l.createElement(Ve,{value:t.description,setValue:function(e){return n(Object(p.a)(Object(p.a)({},t),{},{description:e.length?e:void 0}))},autoFocus:!0,rows:6,rowsMax:24})))):l.createElement("div",{style:{marginTop:8}},l.createElement("div",{onClick:function(){return o(!0)}},l.createElement(re.a,{className:"custom-label"},"Description")),l.createElement(Je,{source:t.description,cards:i})):l.createElement(Et,{onClick:function(){return o(!0)}},"Add description")},Ye=function(e){var t=e.card;if(t.description){var n=t.description.split("\n\n").join("\n").substring(0,500)+(t.description.length>500?"...":"");return l.createElement(pt,{label:null,title:n,icon:l.createElement($.a,null)})}return null},$e=n(176),qe=n.n($e),Qe=n(21),Xe=n(432),et=n(185),tt=n(426),nt=n(445);nt.a.weekStart=1;var at=function(e){var t=e.card,n=e.setCard,a=function(e){return n(Object(p.a)(Object(p.a)({},t),{},{time:e}))};return t.time?l.createElement("div",{style:{marginTop:10}},l.createElement(re.a,{className:"custom-label"},"Date & time"),l.createElement(Qe.a,{utils:et.a,locale:nt.a},l.createElement(Xe.a,{value:new Date(t.time),onChange:function(e){return a(e.getTime())},showTodayButton:!0,format:"MMMM do hh:mm aaa"})),l.createElement(J.a,{color:"primary",variant:"outlined",style:{float:"right",marginTop:12},onClick:function(){return a(null)}},"Reset date")):l.createElement(Et,{onClick:function(){return a(Object(tt.a)())}},"Add date & time")},rt=function(e){var t=e.card;return t.time?l.createElement(pt,{icon:l.createElement(qe.a,null),label:k(t.time),title:Object(E.a)(new Date(t.time),"dd/MM/yyyy hh:mmaaa")}):null},ct=n(427),ot=n(436),lt=n(177),it=n.n(lt),ut=function(e){var t=e.card,n=e.setCard,a=function(e){return n(Object(p.a)(Object(p.a)({},t),{},{ebs:Object(p.a)(Object(p.a)({},t.ebs),e)}))},r=l.useState(t.ebs?dt(t.ebs.estimate):""),c=Object(d.a)(r,2),o=c[0],i=c[1],u=l.useState(t.ebs?dt(t.ebs.elapsed):""),s=Object(d.a)(u,2),f=s[0],b=s[1],E=Object(m.d)((function(e){return Object.values(_e(e).cards).filter((function(e){return e.hasOwnProperty("ebs")&&null!==e.ebs})).filter((function(e){return e.ebs.elapsed&&e.ebs.estimate})).map((function(e){return e.ebs}))})),v=function(e){i(e);var t=mt(e);"number"===typeof t&&a({estimate:t,computed:st(t,E)})};if(!t.ebs)return l.createElement(Et,{onClick:function(){return v("1h")}},"Add time estimate");var g=function(e){return""!==e&&null!==e&&null===mt(e)};return l.createElement("div",{style:{marginTop:10}},l.createElement(re.a,{className:"custom-label"},"Time estimate"),l.createElement("div",{style:{width:"30%",float:"left",marginRight:16}},l.createElement(ae.a,{label:"Estimate (predicted ".concat(dt(st(mt(o)||0,E)),")"),margin:"dense",fullWidth:!0,value:o,error:g(o),helperText:g(o)?"Example format: 1h30m":null,onChange:function(e){return v(e.target.value)}})),l.createElement("div",{style:{width:"30%",float:"left",marginRight:16}},l.createElement(ae.a,{label:"Elapsed",margin:"dense",fullWidth:!0,value:f,error:g(f),helperText:g(f)?"Example format: 1h30m":null,onChange:function(e){return function(e){b(e);var t=mt(e);"number"===typeof t&&a({elapsed:t})}(e.target.value)}})),l.createElement("div",{style:{marginTop:12,float:"left"}},l.createElement(ct.a,{label:"Exact duration",control:l.createElement(ot.a,{color:"primary",checked:Boolean(t.ebs.exact),onChange:function(e){return a({exact:e.target.checked})}})})),l.createElement("div",{style:{flexGrow:1}}),l.createElement(J.a,{color:"primary",variant:"outlined",size:"medium",style:{float:"right",marginTop:12},onClick:function(){return i(""),b(""),n(Object(p.a)(Object(p.a)({},t),{},{ebs:null}))}},"Reset estimate"))},st=function(e,t){if("number"!==typeof e)return e;var n=t.reduce((function(e,n){return e+n.elapsed/n.estimate/t.length}),0);n||(n=1),t.length<10&&(n=(n+1)/2);for(var a=e*n,r=0,c=[3600,900,300];r<c.length;r++){var o=c[r];if(e%o===0&&Math.abs(a-e)>o/2)return o*Math.round(a/o)}return 60*Math.round(a/60)},dt=function(e){if("string"===typeof e)return e;var t=Math.floor(e/3600),n=Math.floor(e%3600/60);return 0===t&&0===n?"0":(t?t+"h":"")+(n?n+"m":"")},mt=function(e){if("0"===e)return 0;var t=/^(\d+h|\d*\.\d+h)?(\d+m|\d*\.\d+m)?$/m.exec(e);if(!t||3!==t.length||!t.slice(1).filter((function(e){return e})).length)return null;var n=function(e){return parseFloat(e.substring(0,e.length-1))};return 3600*n((t=t.slice(1))[0]||"00")+60*n(t[1]||"00")},ft=function(e){var t=e.card;if(t.ebs){var n=(t.ebs.elapsed?dt(t.ebs.elapsed)+"/":"")+dt(t.ebs.exact?t.ebs.estimate:t.ebs.computed),a=t.ebs.elapsed?"Elapsed: ".concat(dt(t.ebs.elapsed)):"",r=t.ebs.exact?"Duration: ".concat(dt(t.ebs.estimate),"\n").concat(a):"Estimate: ".concat(dt(t.ebs.estimate),"\nComputed: ").concat(dt(t.ebs.computed),"\n").concat(a),c=l.createElement(it.a,null);return l.createElement(pt,{label:n,title:r,icon:c})}return null},bt=Object(Z.a)({label:{padding:3},header:{marginBottom:6,marginTop:6}}),pt=function(e){var t=e.icon,n=e.label,a=e.title;return l.createElement(Be.a,{size:"small",icon:t,label:n,title:a,classes:n&&n.length?null:{label:bt().label},style:{borderRadius:3,background:"white",marginRight:2},variant:"outlined"})},Et=function(e){return l.createElement("div",{className:bt().header},l.createElement(J.a,Object.assign({variant:"outlined",color:"primary",size:"small"},e)))},vt=function(e){var t=e.open,n=e.respond,a=e.title,r=e.subtitle,c=e.labels,o=void 0===c?["Cancel","OK"]:c;return l.createElement(Q.a,{open:t,onClose:function(){return n(null)}},l.createElement(X.a,null,a),l.createElement(ee.a,null,l.createElement(te.a,null,r)),l.createElement(ne.a,null,l.createElement(J.a,{onClick:function(){return n(!1)},color:"primary"},o[0]),l.createElement(J.a,{onClick:function(){return n(!0)},color:"primary",variant:"contained",autoFocus:!0},o[1])))},gt=function(e){var t=e.open,n=e.respond,a=e.title,r=e.subtitle,c=e.labels,o=void 0===c?["Cancel","OK"]:c,i=e.label,u=e.inputType,s=void 0===u?"text":u,m=e.placeholder,f=void 0===m?"":m,b=e.buttons,p=void 0===b?null:b,E=l.useState(f),v=Object(d.a)(E,2),g=v[0],h=v[1],O=function(e){n(e),h(f)};return l.createElement(Q.a,{open:t,onClose:function(){return O(null)}},l.createElement(X.a,null,a),l.createElement(ee.a,null,"string"===typeof r&&l.createElement(te.a,null,r),l.createElement(ae.a,{autoFocus:!0,margin:"dense",fullWidth:!0,label:i,type:s,value:g,onChange:function(e){return h(e.target.value)}})),l.createElement(ne.a,null,p,l.createElement(J.a,{onClick:function(){return O(!1)},color:"primary"},o[0]),l.createElement(J.a,{onClick:function(){return O(g)},color:"primary",variant:"contained"},o[1])))},ht=function(e){var t=e.respond,n=e.card,o=Object(m.c)(),i=Object(m.d)((function(e){return Object.values(_e(e).columns).filter((function(e){return-1!==e.items.indexOf(n.id)}))[0].id})),u=l.useState(i),s=Object(d.a)(u,2),f=s[0],b=s[1],E=l.useState(n),v=Object(d.a)(E,2),g=v[0],h=v[1],O=function(e){return h(Object(p.a)(Object(p.a)({},g),{},{content:e}))},y=Object(m.d)(Fe.boards.columns),j=Object(m.d)(Fe.boards.tabs),C=function(){return t(),O(n.content)};return l.createElement(Q.a,{open:!0,onClose:function(){return C()},fullWidth:!0,maxWidth:"md",disableBackdropClick:JSON.stringify(g)!==JSON.stringify(n)},l.createElement(I,{shouldProtect:JSON.stringify(g)!==JSON.stringify(n)}),l.createElement(X.a,null,"Edit card"),l.createElement(ee.a,null,l.createElement(re.a,{id:"kanban/card-column",className:"custom-label"},"Column"),l.createElement(ce.a,{labelId:"kanban/card-column",value:f,onChange:function(e){return b(e.target.value)}},Object.values(j).flatMap((function(e){return[l.createElement(oe.a,{key:e.id},e.name)].concat(Object(q.a)(e.columns.map((function(e){return l.createElement(F.a,{value:e,key:e},y[e].name)}))))}))),l.createElement(re.a,{id:"kanban/card-title",className:"custom-label"},"Title"),l.createElement(ae.a,{margin:"dense",autoFocus:!0,fullWidth:!0,multiline:!0,rowsMax:3,value:g.content,onChange:function(e){return O(e.target.value)}}),l.createElement(a.Edit,{card:g,setCard:h}),l.createElement(r.Edit,{card:g,setCard:h}),l.createElement(c.Edit,{card:g,setCard:h})),l.createElement(ne.a,null,l.createElement(J.a,{onClick:function(){return o(be({card:g,colID:f})),o(pe(n.id)),C()}},"Delete"),l.createElement(J.a,{onClick:C,color:"primary"},"Cancel"),l.createElement(J.a,{onClick:function(){return o(be({card:g,colID:f})),C()},color:"primary",variant:"contained"},"OK")))},Ot=function(e){var t=e.open,n=e.respond;return l.createElement(Q.a,{open:t,onClose:n,fullWidth:!0},l.createElement(X.a,null,"About Mirror"),l.createElement(ee.a,null,l.createElement(te.a,null,"A free and open source personal task management and note taking app.",l.createElement("br",null),"Made by Oliver Balfour. \xa9 2020.",l.createElement("br",null),"App icon is ",l.createElement("a",{href:"https://thenounproject.com/term/mirror/340140/"},"Mirror"),"\xa0 by Lastspark from ",l.createElement("a",{href:"http://thenounproject.com/"},"The Noun Project"),".")),l.createElement(ne.a,null,l.createElement(J.a,{onClick:n,color:"primary",variant:"contained",autoFocus:!0},"OK")))},yt=function(e){var t=e.active,n=e.setActive,a=i.a.useState(!1),r=Object(d.a)(a,2),c=r[0],o=r[1];return i.a.createElement(i.a.Fragment,null,i.a.createElement(S.a,{color:"primary",style:{top:"auto",bottom:0}},i.a.createElement(K.a,{style:{minHeight:0}},i.a.createElement(R.a,{edge:"start",color:"inherit",onClick:function(){return console.log("open menu")}},i.a.createElement(U.a,null)),i.a.createElement(M.a,{value:t,onChange:function(e,t){return n(t)},TabIndicatorProps:{style:{backgroundColor:"white"}}},i.a.createElement(A.a,{label:i.a.createElement("div",null,i.a.createElement(G.a,{style:{verticalAlign:"middle"}})," Board")}),i.a.createElement(A.a,{label:i.a.createElement("div",null,i.a.createElement($.a,{style:{verticalAlign:"middle"}})," Notes")})),i.a.createElement("div",{style:{flexGrow:1}}),i.a.createElement(P,{map:{"Submit feedback":function(){return window.open("mailto:oliver.leo.balfour+mirrorsupport@googlemail.com","_blank")},About:function(){return o(!0)},"Clear saved state":function(){return"YES"===window.prompt("Delete all saved state? Pressing undo will fix this. Type YES to confirm","NO")&&localStorage.clear()},"Import state":function(){localStorage.kanban=window.prompt("Paste your exported state here. Press cancel (or the undo button after pressing OK) to revert. Refresh the page to confirm and reload state.")},"Export state":function(){return function(e,t,n){n||(n="application/octet-stream");var a=document.createElement("a"),r=new Blob([e],{type:n});a.href=window.URL.createObjectURL(r),a.download=t,a.click()}(localStorage.kanban,"mirror-backup.json","application/json")}}},i.a.createElement(R.a,{edge:"end",color:"inherit"},i.a.createElement(z.a,null))))),i.a.createElement(Ot,{open:c,respond:function(){return o(!1)}}))},jt=n(180),Ct=n.n(jt),wt=n(181),kt=n.n(wt),xt=function(){var e=Object(m.c)();return l.createElement(l.Fragment,null,l.createElement(R.a,{onClick:function(){return e(ie.ActionCreators.undo())}},l.createElement(Ct.a,null)),l.createElement(R.a,{onClick:function(){return e(ie.ActionCreators.redo())}},l.createElement(kt.a,null)))},Dt=n(50),Tt=n(431),Nt=n(68),It=n.n(Nt),St=n(103),Mt=n.n(St),At=function(e){var t=e.col,n=e.add,a=(e.menu,Object(m.c)()),r=l.useState(!1),c=Object(d.a)(r,2),o=c[0],i=c[1],u=l.useState(!1),s=Object(d.a)(u,2),f=s[0],b=s[1];return l.createElement("div",null,l.createElement("div",{className:"columnHeaderContainer"},l.createElement("div",{className:"columnHeaderText"},t.name),l.createElement("div",null,l.createElement(R.a,{size:"small",onClick:function(){return n()}},l.createElement(It.a,null)),l.createElement(P,{map:{"Archive all":function(){return a(Oe(t.id))},Rename:function(){return b(!0)},Delete:function(){return i(!0)}}},l.createElement(R.a,{size:"small"},l.createElement(z.a,null))))),l.createElement("hr",{className:"columnHeaderRule"}),o&&l.createElement(vt,{open:!0,respond:function(e){i(!1),e&&a(ve(t.id))},title:"Delete this column?",subtitle:"Don't worry, this action can be undone."}),f&&l.createElement(gt,{open:!0,respond:function(e){b(!1),"string"===typeof e&&e.length&&a(ge({colID:t.id,name:e}))},title:'Rename column "'.concat(t.name,'"'),subtitle:"Don't worry, this action can be undone.",label:"Name",placeholder:t.name}))},Rt=l.memo((function(e){var t=e.card,n=e.index,o=e.setEditingCard,i=Object(m.d)(Fe.boards.cards);if(!t)return null;var u=t.id,s=t.content;return l.createElement(l.Fragment,null,l.createElement(Dt.b,{draggableId:u,index:n},(function(e,n){return l.createElement("div",Object.assign({ref:e.innerRef},e.draggableProps,e.dragHandleProps,{className:"card"+(n.isDragging?" draggingCard":""),style:e.draggableProps.style,onClick:function(){return o(u)}}),l.createElement(Je,{source:s,cards:i}),l.createElement(a.Indicator,{card:t}),l.createElement(r.Indicator,{card:t}),l.createElement(c.Indicator,{card:t}))})))})),Lt=l.memo((function(e){var t=e.col,n=e.index,a=e.setEditingCard,r=t.id,c=t.items,o=l.useState(!1),i=Object(d.a)(o,2),u=i[0],s=i[1],f=l.useState(""),b=Object(d.a)(f,2),p=b[0],E=b[1],v=Object(m.c)(),g=function(){p.length&&v(me({content:p,colID:r})),E(""),s(!1)},h=function(){u?E(""):O.current.scrollTop=0,s(!u)},O=l.useRef(null),y=function(){console.log("pressed menu button")},j=l.createElement(Dt.c,{droppableId:r,className:"card-droppable",type:"card",ignoreContainerClipping:!0},(function(e,t){return l.createElement(l.Fragment,null,l.createElement("div",{className:"column-internals"+(t.isDraggingOver?" dragging-over":""),ref:N(e.innerRef,O)},u&&l.createElement(zt,{value:p,setValue:E,add:g,cancel:function(){E(""),s(!1)}}),c.map((function(e,t){return e?l.createElement(Rt,{card:e,index:t,key:e.id,setEditingCard:a}):null}))),e.placeholder)}));return l.createElement(Dt.b,{draggableId:r,index:n},(function(e,n){return l.createElement("div",Object.assign({ref:e.innerRef},e.draggableProps,{className:"columnContainer"+(n.isDragging?" draggingColumn":""),style:e.draggableProps.style}),l.createElement("div",{className:"column"},l.createElement("div",e.dragHandleProps,l.createElement(At,{col:t,add:h,menu:y})),j))}))})),zt=function(e){var t=e.value,n=e.setValue,a=e.add,r=e.cancel;return l.createElement("div",null,l.createElement(ae.a,{label:"New Card",multiline:!0,autoFocus:!0,rowsMax:6,value:t,onChange:function(e){return n(e.target.value)},variant:"filled",style:{width:"100%"}}),l.createElement(Tt.a,{variant:"contained",size:"small",className:"editingCardButtons"},l.createElement(J.a,{style:{flexGrow:1},variant:"contained",onClick:a},"Done"),l.createElement(J.a,{onClick:r},l.createElement(Mt.a,{style:{color:"#555"}}))))},_t=function(e){var t=e.add,n=e.hide;return l.createElement("div",{className:"addColumnContainer"+(n?" hidden":"")},l.createElement("div",{className:"addColumn"},l.createElement(R.a,{onClick:t},l.createElement(It.a,null))))},Ft=(n(373),function(e){var t=e.tabInfo,n=t.index,a=t.tab,r=Object(m.c)(),c=Object(m.d)(Fe.boards.tabOrder),o=Object(m.d)(Fe.boards.getColumnsInTabs)[c[n]],i=Object(m.d)(Fe.boards.tabs),u=Object(m.d)(Fe.boards.cards),s=i[c[n]].columns,f=l.useState(!1),b=Object(d.a)(f,2),p=b[0],E=b[1],v=D(),g=Object(d.a)(v,2),h=g[0],O=g[1],y="edit"===h.split("/")[4]?h.split("/")[3]:null,j=Object(m.d)(Fe.boards.cardsByTab),C=function(e){return O(e?"/boards/".concat(i[function(e){return Object.keys(j).filter((function(t){return-1!==j[t].indexOf(e)}))}(e)].name.toLowerCase(),"/").concat(e,"/edit"):"/boards/".concat(h.split("/")[2]))};return l.createElement("div",{className:"boardview-root"},l.createElement(Dt.a,{onDragEnd:function(e){e.destination&&("card"===e.type?r(function(e){var t=Object(d.a)(e,4),n=t[0],a=t[1],r=t[2],c=t[3];return n===a?de({colID:n,srcIndex:r,dstIndex:c}):se({srcColID:n,dstColID:a,srcIndex:r,dstIndex:c})}([e.source.droppableId,e.destination.droppableId,e.source.index,e.destination.index])):"column"===e.type&&r(he([e.source.index,e.destination.index,n])))}},l.createElement(Dt.c,{droppableId:"default",className:"column-droppable",direction:"horizontal",type:"column"},(function(e,t){return l.createElement(l.Fragment,null,l.createElement("div",{className:"root",ref:e.innerRef},s.map((function(e,t){return l.createElement(Lt,{col:o[t],key:e,index:t,setEditingCard:C})})),l.createElement(_t,{add:function(){return E(!0)},hide:t.isDraggingOver||t.draggingFromThisWith})),e.placeholder)}))),p&&l.createElement(gt,{open:!0,respond:function(e){E(!1),"string"===typeof e&&e.length&&r(Ee({tabID:a.id,name:e}))},title:"Add column",label:"Name"}),y&&u.hasOwnProperty(y)&&l.createElement(ht,{respond:function(){return C(null)},card:u[y]}))}),Pt=function(){var e=Object(m.c)(),t=D(),n=Object(d.a)(t,2),a=n[0],r=n[1],c=Object(m.d)(Fe.boards.tabs),o=Object(m.d)(Fe.boards.tabOrder),i=o.map((function(e){return c[e].name.toLowerCase()===a.split("/")[2]})).indexOf(!0),u=function(e){return r("/boards/"+c[o[e]].name.toLowerCase())};i<0&&(i=0);var s=l.useState(!1),f=Object(d.a)(s,2),b=f[0],p=f[1],E=l.useState(!1),v=Object(d.a)(E,2),g=v[0],h=v[1],O=l.useState(!1),y=Object(d.a)(O,2),j=y[0],C=y[1];return l.createElement(l.Fragment,null,l.createElement(W,{tabs:o.map((function(e){return c[e].name})),render:function(e){return l.createElement(Ft,{tabInfo:{tab:c[o[e]],index:e}})},addTab:function(){return h(!0)},renameTab:function(){return C(!0)},deleteTab:function(){return Object.values(c).length>1?p(!0):alert("Cannot delete only tab")},moveTab:function(t){return e(we(t))},children:l.createElement(xt,null),index:i,setIndex:u}),b&&l.createElement(vt,{open:!0,respond:function(t){return p(!1)||t&&(e(je(i)),u(Math.max(0,i-1)))},title:"Delete this tab?",subtitle:"Don't worry, this action can be undone."}),g&&l.createElement(gt,{open:!0,respond:function(t){return h(!1)||"string"===typeof t&&t.length&&e(ye(t))},title:"Add tab",label:"Name"}),j&&l.createElement(gt,{open:!0,respond:function(t){return C(!1)||"string"===typeof t&&t.length&&e(Ce({tabID:o[i],name:t}))},title:"Rename tab ".concat(c[o[i]].name),label:"Name"}))},Bt=n(182),Wt=n.n(Bt),Zt=n(131),Jt=n.n(Zt),Kt=n(184),Ht=n.n(Kt),Ut=n(183),Vt=n.n(Ut),Gt=(n(374),function(){var e=D(),t=Object(d.a)(e,3),n=t[0],a=t[1],r=t[2],c=Object(m.c)(),o=Object(m.d)(Fe.boards.cards),i=Object(m.d)(Fe.boards.starredZettels),u=n.split("/")[2]||"main",s=o[u],f=l.useState(Object(p.a)({},s)),b=Object(d.a)(f,2),E=b[0],v=b[1],g=function(e){return v(Object(p.a)(Object(p.a)({},E),e))};if("object"!==typeof s)return null;var h="edit"===n.split("/")[3],O=function(e){return r(e?"/notes/".concat(u,"/edit"):"/notes/".concat(u))},j=function(){return c(Te(u))};s.id!==E.id&&(c(xe({zettel:E})),v(Object(p.a)({},s)));var C=function(e){c(ke({zettel:{content:"New note",description:"...",id:e}})),a("/notes/".concat(e,"/edit"))};return l.createElement(l.Fragment,null,l.createElement(I,{shouldProtect:JSON.stringify(E)!==JSON.stringify(s)}),l.createElement("div",{className:"zettelContainer"},h&&l.createElement("div",{className:"zettel"},l.createElement(ae.a,{margin:"dense",autoFocus:!0,fullWidth:!0,multiline:!0,rowsMax:3,value:E.content||"",onChange:function(e){return g({content:e.target.value})}}),l.createElement(Ve,{value:E.description||"",setValue:function(e){return g({description:e})},addNote:function(e){c(xe({zettel:E})),C(e)}}),l.createElement("div",{className:"zettelEditingButtons"},l.createElement(J.a,{onClick:function(){O(!1),v(Object(p.a)({},s))},color:"primary"},"Cancel"),l.createElement(J.a,{onClick:function(){return c(xe({zettel:E})),void O(!1)},color:"primary",variant:"contained"},"Save"))),l.createElement("div",{className:"zettel"+(h?" notes-editing":"")},l.createElement("div",{className:"zettelTitle"},(h?E.content:s.content)||""),l.createElement(Je,{source:(h?E.description:s.description)||"",cards:o}))),l.createElement("div",{className:"zettelButtons",id:"zettel-buttons-container"},l.createElement(Tt.a,{variant:"contained",color:"primary"},!h&&l.createElement(J.a,{onClick:function(){return O(!0)},title:"Edit note"},l.createElement(Wt.a,null)),"main"!==s.id&&l.createElement(J.a,{onClick:function(){c(pe(u)),r("/notes/main")},title:"Delete note"},l.createElement(Mt.a,null)),!h&&l.createElement(J.a,{onClick:function(){return C(y())},title:"Add note"},l.createElement(It.a,null)),l.createElement(J.a,{onClick:function(){return alert("TODO")},title:"Search notes"},l.createElement(Jt.a,null)),-1===i.indexOf(s.id)?l.createElement(J.a,{onClick:j,title:"Star this note"},l.createElement(Vt.a,null)):l.createElement(J.a,{onClick:j,title:"Unstar this note"},l.createElement(Ht.a,null)))))}),Yt=["/boards","/notes"],$t=function(){var e=D(),t=Object(d.a)(e,2),n=t[0],a=t[1],r=function(e){var t="/"+e.split("/")[1];return Math.max(Yt.indexOf(t),0)}(n);return i.a.createElement(m.a,{store:ze},i.a.createElement("div",{style:{top:0,left:0,height:"100%",width:"100%",display:"flex",flexDirection:"column"}},i.a.createElement("div",{style:{height:"calc(100% - 48px)"}},0===r&&i.a.createElement(Pt,null),1===r&&i.a.createElement(Gt,null)),i.a.createElement(yt,{active:r,setActive:function(e){return a(function(e){if(0===e){var t=_e(ze.getState());return"/boards/"+t.tabs[t.tabOrder[0]].name.toLowerCase()}return Yt[e]}(e))}})))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));n(375);s.a.render(i.a.createElement($t,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[207,1,2]]]);
//# sourceMappingURL=main.1f923018.chunk.js.map