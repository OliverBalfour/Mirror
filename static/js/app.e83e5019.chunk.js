(this.webpackJsonp=this.webpackJsonp||[]).push([[0],{149:function(e,t,n){n(150),e.exports=n(185)},150:function(e,t){"serviceWorker"in navigator&&window.addEventListener("load",(function(){navigator.serviceWorker.register("/Mirror/expo-service-worker.js",{scope:"/Mirror/"}).then((function(e){})).catch((function(e){console.info("Failed to register service-worker",e)}))}))},185:function(e,t,n){"use strict";n.r(t);var r=n(241),a=n(0),o=n.n(a),c=n(13),l=n.n(c),i=n(26),u=n(45),s=n(14),d=n(223),m=n(238),f=n(227),p=function(e){var t=e.show,n=e.children;return a.createElement("div",{hidden:!t,style:{height:"calc(100% - 48px)"}},t&&n)},b=function(e){var t=e.tabs,n=e.render,r=e.children,o=a.useState(0),c=l()(o,2),u=c[0],s=c[1];return a.createElement("div",{style:{flex:1}},a.createElement(d.a,{position:"static",style:{backgroundColor:"white",zIndex:2,position:"relative"}},a.createElement(m.a,{value:u,onChange:function(e,t){return s(t)},indicatorColor:"primary",textColor:"primary"},t.map((function(e){return a.createElement(f.a,{label:e,key:e})})),a.createElement(i.a,{style:{flexGrow:1}}),r)),t.map((function(e,t){return a.createElement(p,{show:u===t,key:e},u===t&&n(t))})))},E=n(19),y=n.n(E),h=n(228),g=n(188),v=(Object(h.a)((function(e){return{button:{}}})),n(229)),O=n(230),C=n(122),w=n.n(C),D=n(78),x=n.n(D),j=n(123),k=n.n(j),I=n(124),S=n.n(I),P=n(134),N=n(244),R=function(e){var t=e.map,n=e.children,r=a.useState(null),o=l()(r,2),c=o[0],i=o[1],u=function(){return i(null)};return a.createElement(a.Fragment,null,a.createElement(P.a,{anchorEl:c,keepMounted:!0,open:Boolean(c),onClose:u},Object.entries(t).map((function(e){var t=l()(e,2),n=t[0],r=t[1];return a.createElement(N.a,{key:n,onClick:function(){u(),r()}},n)}))),a.cloneElement(n,{onClick:function(e){return i(e.currentTarget)}}))},A=function(e){var t=e.active,n=e.setActive;return o.a.createElement(o.a.Fragment,null,o.a.createElement(d.a,{color:"primary",style:{top:"auto",bottom:0}},o.a.createElement(v.a,{style:{minHeight:0}},o.a.createElement(O.a,{edge:"start",color:"inherit",onClick:function(){return console.log("open menu")}},o.a.createElement(w.a,null)),o.a.createElement(m.a,{value:t,onChange:function(e,t){return n(t)},TabIndicatorProps:{style:{backgroundColor:"white"}}},o.a.createElement(f.a,{label:o.a.createElement("div",null,o.a.createElement(k.a,{style:{verticalAlign:"middle"}})," Board")}),o.a.createElement(f.a,{label:o.a.createElement("div",null,o.a.createElement(S.a,{style:{verticalAlign:"middle"}})," Notes")})),o.a.createElement("div",{style:{flexGrow:1}}),o.a.createElement(R,{map:{"Clear saved state":function(){return localStorage.clear()}}},o.a.createElement(O.a,{edge:"end",color:"inherit"},o.a.createElement(x.a,null))))))},M=n(125),T=n.n(M),F=n(126),L=n.n(F),z=n(44),W=n.n(z),_=function(){var e=Object(s.c)();return a.createElement(a.Fragment,null,a.createElement(O.a,{onClick:function(){return e(z.ActionCreators.undo())}},a.createElement(T.a,null)),a.createElement(O.a,{onClick:function(){return e(z.ActionCreators.redo())}},a.createElement(L.a,null)))},B=n(12),H=n.n(B),K=n(242),G=n(231),J=n(232),U=n(233),V=n(234),X=n(243),Y=n(246),q=n(240),Q=n(24);function Z(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}var $,ee=function(){return Math.random().toString().substring(2)},te=function(){var e=function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?Z(Object(n),!0).forEach((function(t){H()(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):Z(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}({tabs:[{name:"Main",id:ee()},{name:"Secondary",id:ee()}]},function(e,t){for(var n=e.reduce((function(e,t){return e+t}),0),r=[],a=["Wash the dishes","Make cool app","Run out of ideas for sample tasks for the app you're making","Cook pizza for dinner","Finish your chemistry homework","Write a tutorial explaining how monads are isomorphic to burritos in the category of food","Forget to wrap a line at 300 characters","Learn Common Lisp","Do normal human things","Prove P=NP for N=1","Eat some chocolate","Stop eating so much chocolate","Write witty comment","\ud83d\ude42"],o=0;o<n;o++){var c=(o+1).toString()+"-"+ee();r.push({id:c,content:a[Math.floor(Math.random()*a.length)]})}for(var l=[],i=0,u=0;i<e.length;i++){var s=r.slice(u,u+e[i]).map((function(e){return e.id})),d=(i+1).toString()+"-"+ee();l.push({id:d,items:s,name:t[i]}),u+=e[i]}return{cards:r,columns:l}}([9,2,6,5,4],["To Do","Doing","Done","Misc 1","Misc 2"])),t=e.columns.map((function(e){return e.id}));return e.tabs[0].columns=[t[0],t[1],t[2]],e.tabs[1].columns=[t[3],t[4]],e};function ne(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function re(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?ne(Object(n),!0).forEach((function(t){H()(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):ne(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var ae=Object(Q.b)("kanban/TRANSFER_CARD"),oe=Object(Q.b)("kanban/REORDER_CARD"),ce=Object(Q.b)("kanban/ADD_CARD"),le=Object(Q.b)("kanban/EDIT_CARD_CONTENT"),ie=Object(Q.b)("kanban/EDIT_CARD"),ue=Object(Q.b)("kanban/DELETE_CARD"),se=Object(Q.b)("kanban/ADD_COLUMN"),de=Object(Q.b)("kanban/DELETE_COLUMN"),me=Object(Q.b)("kanban/RENAME_COLUMN"),fe=function(e){return function(t){return e.cards.filter((function(e){return e.id===t}))[0]}},pe=function(e,t){return e.map((function(e){return e.id===t})).indexOf(!0)},be=function(e){return function(t){return e.splice(pe(e,t),1)}},Ee=function(e,t){var n=e.indexOf(t);-1!==n&&e.splice(n,1)},ye=function(){try{return localStorage.hasOwnProperty("kanban")?JSON.parse(localStorage.getItem("kanban")):te()}catch(e){return te()}}(),he=Object(Q.c)(ye,($={},H()($,ae,(function(e,t){var n=pe(e.columns,t.payload.srcColID),r=pe(e.columns,t.payload.dstColID),a=e.columns[n].items,o=e.columns[r].items,c=a.splice(t.payload.srcIndex,1),i=l()(c,1)[0];o.splice(t.payload.dstIndex,0,i)})),H()($,oe,(function(e,t){var n=pe(e.columns,t.payload.colID),r=e.columns[n].items,a=r.splice(t.payload.srcIndex,1),o=l()(a,1)[0];r.splice(t.payload.dstIndex,0,o),e.columns[n].items=r})),H()($,ce,(function(e,t){var n=t.payload,r=n.content,a=(n.colID,pe(e.columns,t.payload.colID)),o=ee();e.cards.push({id:o,content:r}),e.columns[a].items.unshift(o)})),H()($,de,(function(e,t){var n=pe(e.columns,t.payload);e.columns[n].items.forEach(be(e.cards)),e.tabs.forEach((function(e){return Ee(e.columns,t.payload)})),be(e.columns)(t.payload)})),H()($,me,(function(e,t){e.columns[pe(e.columns,t.payload.colID)].name=t.payload.name})),H()($,le,(function(e,t){e.cards[pe(e.cards,t.payload.cardID)].content=t.payload.content})),H()($,ue,(function(e,t){pe(e.cards,t.payload);e.columns.forEach((function(e){return Ee(e.items,t.payload)})),be(e.cards)(t.payload)})),H()($,se,(function(e,t){var n=ee();e.columns.push({id:n,items:[],name:t.payload.name}),e.tabs[pe(e.tabs,t.payload.tabID)].columns.push(n)})),H()($,ie,(function(e,t){e.cards[pe(e.cards,t.payload.card.id)]=t.payload.card,e.columns.forEach((function(e){return Ee(e.items,t.payload.card.id)})),e.columns[pe(e.columns,t.payload.colID)].items.unshift(t.payload.card.id)})),$)),ge=W()(he,{limit:10});function ve(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function Oe(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?ve(Object(n),!0).forEach((function(t){H()(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):ve(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var Ce=function(e){var t=e.open,n=e.respond,r=e.title,o=e.subtitle,c=e.labels,l=void 0===c?["Cancel","OK"]:c;return a.createElement(K.a,{open:t,onClose:function(){return n(null)}},a.createElement(G.a,null,r),a.createElement(J.a,null,a.createElement(U.a,null,o)),a.createElement(V.a,null,a.createElement(g.a,{onClick:function(){return n(!1)},color:"primary"},l[0]),a.createElement(g.a,{onClick:function(){return n(!0)},color:"primary",variant:"contained",autoFocus:!0},l[1])))},we=function(e){var t=e.open,n=e.respond,r=e.title,o=e.subtitle,c=e.labels,i=void 0===c?["Cancel","OK"]:c,u=e.label,s=e.inputType,d=void 0===s?"text":s,m=e.placeholder,f=void 0===m?"":m,p=e.buttons,b=void 0===p?null:p,E=a.useState(f),y=l()(E,2),h=y[0],v=y[1],O=function(e){n(e),v(f)};return a.createElement(K.a,{open:t,onClose:function(){return O(null)}},a.createElement(G.a,null,r),a.createElement(J.a,null,"string"===typeof o&&a.createElement(U.a,null,o),a.createElement(X.a,{autoFocus:!0,margin:"dense",fullWidth:!0,label:u,type:d,value:h,onChange:function(e){return v(e.target.value)}})),a.createElement(V.a,null,b,a.createElement(g.a,{onClick:function(){return O(!1)},color:"primary"},i[0]),a.createElement(g.a,{onClick:function(){return O(h)},color:"primary",variant:"contained"},i[1])))},De=function(e){var t=e.respond,n=e.card,r=Object(s.c)(),o=Object(s.d)((function(e){return e.boards.present.columns.filter((function(e){return-1!==e.items.indexOf(n.id)}))[0].id})),c=a.useState({card:Oe({},n),colID:o}),i=l()(c,2),u=i[0],d=i[1],m=function(e){return d(Oe(Oe({},u),{},{card:Oe(Oe({},u.card),{},{content:e})}))},f=Object(s.d)((function(e){return e.boards.present.columns})),p=function(){return t(),m(n.content)},b=[ee()];return a.createElement(K.a,{open:!0,onClose:function(){return p()},fullWidth:!0,maxWidth:"md"},a.createElement(G.a,null,"Edit card"),a.createElement(J.a,null,a.createElement(Y.a,{id:b[0]},"Column"),a.createElement(q.a,{labelId:b[0],value:u.colID,onChange:function(e){return t=e.target.value,d(Oe(Oe({},u),{},{colID:t}));var t}},f.map((function(e){return a.createElement(N.a,{value:e.id,key:e.id},e.name)}))),a.createElement(X.a,{label:"Title",margin:"dense",autoFocus:!0,fullWidth:!0,variant:"filled",multiline:!0,rowsMax:6,value:u.card.content,onChange:function(e){return m(e.target.value)}})),a.createElement(V.a,null,a.createElement(g.a,{onClick:function(){return r(ue(n.id)),p()}},"Delete"),a.createElement(g.a,{onClick:p,color:"primary"},"Cancel"),a.createElement(g.a,{onClick:function(){return r(ie(u)),p()},color:"primary",variant:"contained"},"OK")))},xe=n(237),je=n(247),ke=n(89),Ie=n.n(ke),Se=n(127),Pe=n.n(Se),Ne=n(83),Re=n(88),Ae=n.n(Re),Me=Object(h.a)((function(e){return{root:{height:"100%",display:"flex",flexDirection:"row",flexWrap:"nowrap",padding:8,fontSize:"14px","& *":{flexShrink:0}},column:{background:"#DFEEEE",padding:8,paddingBottom:24,width:300,border:"1px solid #CCDCDC",borderRadius:5,margin:8,transition:"border 0.2s",maxHeight:"calc(100vh - 160px)",overflow:"hidden"},draggingOverColumn:{border:"1px solid #BBCBCB"},columnHeaderContainer:{padding:"8 0",display:"flex",justifyContent:"space-between"},columnHeaderText:{paddingLeft:8,paddingBottom:0,fontSize:"1.4em"},columnHeaderRule:{overflow:"hidden",border:"none",color:"#CCDCDC",backgroundColor:"#CCDCDC",height:"1px",width:317,marginLeft:-9},card:{userSelect:"none",padding:"10px 13px",margin:"0 0 8px 0",background:"white",borderRadius:5,transition:"opacity 0.3s",overflow:"hidden","&:hover, &:focus":{boxShadow:"0 1px 3px rgba(100, 100, 100, 0.3)"},"&>p":{margin:0}},draggingCard:{opacity:.7,boxShadow:"0 1px 3px rgba(100, 100, 100, 0.3)"}}})),Te=function(e){var t=e.tabInfo,n=t.index,r=t.tab,o=Object(s.c)(),c=Me(),u=Object(s.d)((function(e){return function(e){return function(t){return t.tabs[e].columns.map(function(e){return function(t){return e.columns.filter((function(e){return e.id===t}))[0]}}(t)).map((function(e){return re(re({},e),{},{items:e.items.map(fe(t))})}))}}(n)(e.boards.present)})),d=a.useState(!1),m=l()(d,2),f=m[0],p=m[1];return a.createElement(i.a,{style:{width:"100vw",overflowX:"auto",height:"100%"}},a.createElement(Ne.a,{onDragEnd:function(e){return e.destination?o((t=e.source.droppableId,n=e.destination.droppableId,r=e.source.index,a=e.destination.index,t===n?oe({colID:t,srcIndex:r,dstIndex:a}):ae({srcColID:t,dstColID:n,srcIndex:r,dstIndex:a}))):null;var t,n,r,a}},a.createElement("div",{className:c.root},u.map((function(e){return a.createElement(Fe,{col:e,styles:c,key:e.id})})),a.createElement(_e,{styles:c,add:function(){return p(!0)}}))),f&&a.createElement(we,{open:!0,respond:function(e){return p(!1)||"string"===typeof e&&e.length&&o(se({tabID:r.id,name:e}))},title:"Add column",label:"Name"}))},Fe=function(e){var t=e.styles,n=e.col,r=n.id,o=n.items,c=(n.name,a.useState(!1)),i=l()(c,2),u=i[0],d=i[1],m=a.useState(""),f=l()(m,2),p=f[0],b=f[1],E=Object(s.c)(),y=function(){p.length&&E(ce({content:p,colID:r})),b(""),d(!1)},h=function(){u&&b(""),d(!u)},g=function(){console.log("pressed menu button")};return a.createElement(Ne.c,{droppableId:r,style:{flexGrow:1}},(function(e,r){return a.createElement("div",{ref:e.innerRef,className:Ae()(t.column,H()({},t.draggingOverColumn,r.isDraggingOver))},a.createElement(ze,{styles:t,col:n,add:h,menu:g}),a.createElement("div",{style:{width:300,overflowY:"auto",overflowX:"hidden",height:"100%"}},u&&a.createElement(Le,{value:p,setValue:b,add:y,cancel:function(){b(""),d(!1)}}),a.createElement("div",{style:{width:300}}," ",o.map((function(e,n){return a.createElement(We,{card:e,styles:t,index:n,key:e.id})})))),e.placeholder)}))},Le=function(e){var t=e.value,n=e.setValue,r=e.add,o=e.cancel;return a.createElement("div",null,a.createElement(X.a,{label:"New Card",multiline:!0,rowsMax:6,value:t,onChange:function(e){return n(e.target.value)},variant:"filled",style:{width:"100%"}}),a.createElement(xe.a,{variant:"contained",size:"small",style:{marginBottom:8,boxShadow:"0px 4px 2px -2px rgba(0,0,0,0.15)",width:"100%"}},a.createElement(g.a,{style:{flexGrow:1},variant:"contained",onClick:r},"Done"),a.createElement(g.a,{onClick:o},a.createElement(Pe.a,{style:{color:"#555"}}))))},ze=function(e){var t=e.styles,n=e.col,r=e.add,o=(e.menu,Object(s.c)()),c=a.useState(!1),i=l()(c,2),u=i[0],d=i[1],m=a.useState(!1),f=l()(m,2),p=f[0],b=f[1];return a.createElement("div",null,a.createElement("div",{className:t.columnHeaderContainer},a.createElement("div",{className:t.columnHeaderText},n.name),a.createElement("div",null,a.createElement(je.a,{size:"small",label:"0/6"}),a.createElement(je.a,{size:"small",label:"3h"}),a.createElement(O.a,{size:"small",onClick:function(){return r()}},a.createElement(Ie.a,null)),a.createElement(R,{map:{Rename:function(){return b(!0)},Delete:function(){return d(!0)}}},a.createElement(O.a,{size:"small"},a.createElement(x.a,null))))),a.createElement("hr",{className:t.columnHeaderRule}),u&&a.createElement(Ce,{open:!0,respond:function(e){return d(!1)||!0===e&&o(de(n.id))},title:"Delete this column?",subtitle:"Don't worry, this action can be undone."}),p&&a.createElement(we,{open:!0,respond:function(e){return b(!1)||"string"===typeof e&&e.length&&o(me({colID:n.id,name:e}))},title:'Rename column "'+n.name+'"',subtitle:"Don't worry, this action can be undone.",label:"Name",placeholder:n.name}))},We=function(e){var t=e.card,n=e.styles,r=e.index,o=t.id,c=t.content,i=(Object(s.c)(),a.useState(!1)),u=l()(i,2),d=u[0],m=u[1];return a.createElement(a.Fragment,null,a.createElement(Ne.b,{draggableId:o,index:r},(function(e,t){return a.createElement("div",y()({ref:e.innerRef},e.draggableProps,e.dragHandleProps,{className:Ae()(n.card,H()({},n.draggingCard,t.isDragging)),style:e.draggableProps.style,onClick:function(){return m(!0)}}),c.split("\n").map((function(e,t){return a.createElement("p",{key:t},e)})))})),d&&a.createElement(De,{respond:function(){return m(!1)},card:t}))},_e=function(e){var t=e.styles,n=e.add;return a.createElement("div",{className:t.column,style:{width:300,display:"flex",justifyContent:"center",alignItems:"center",height:"100px"}},a.createElement(O.a,{onClick:n},a.createElement(Ie.a,null)))},Be=function(){var e=Object(s.d)((function(e){return e.boards.present.tabs}));return a.createElement(b,{tabs:e.map((function(e){return e.name})),render:function(t){return a.createElement(Te,{tabInfo:{tab:e[t],index:t}})},children:a.createElement(_,null)})},He=n(15),Ke=Object(He.c)({boards:ge}),Ge=Object(Q.a)({reducer:Ke});try{document.addEventListener("keyup",(function(e){e.ctrlKey&&90===e.which?Ge.dispatch(z.ActionCreators.undo()):(e.ctrlKey&&e.shiftKey&&90===e.which||e.ctrlKey&&89===e.which)&&Ge.dispatch(z.ActionCreators.redo())}))}catch(Xe){}var Je=function(){return function(e){try{if(localStorage){var t=JSON.stringify(e);localStorage.setItem("kanban",t)}}catch(Xe){}}(Ge.getState().boards.present)};Ge.subscribe(Je),Je();var Ue=Ge,Ve=function(){var e=o.a.useState(0),t=l()(e,2),n=t[0],r=t[1],a="web"===u.a.OS?{height:"calc(100% - 48px)"}:{flexGrow:1};return o.a.createElement(s.a,{store:Ue},o.a.createElement(i.a,{style:{top:0,left:0,height:"100%",width:"100%",display:"flex",flexDirection:"column"}},o.a.createElement(i.a,{style:a},0===n&&o.a.createElement(Be,null)),o.a.createElement(A,{active:n,setActive:r})))};Object(r.a)((function(e){return o.a.createElement(Ve,{style:{top:0,left:0,height:"100%",width:"100%"}})}))}},[[149,1,2]]]);
//# sourceMappingURL=app.e83e5019.chunk.js.map