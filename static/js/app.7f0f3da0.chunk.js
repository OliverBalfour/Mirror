(this.webpackJsonp=this.webpackJsonp||[]).push([[0],{127:function(e,t,n){n(128),e.exports=n(161)},128:function(e,t){"serviceWorker"in navigator&&window.addEventListener("load",(function(){navigator.serviceWorker.register("/Mirror/expo-service-worker.js",{scope:"/Mirror/"}).then((function(e){})).catch((function(e){console.info("Failed to register service-worker",e)}))}))},161:function(e,t,n){"use strict";n.r(t);var r=n(208),a=n(0),o=n.n(a),c=n(23),l=n.n(c),i=n(26),u=n(37),s=n(28),d=n(197),m=n(207),f=n(201),p=function(e){var t=e.show,n=e.children;return a.createElement("div",{hidden:!t},t&&n)},b=function(e){var t=e.tabs,n=e.render,r=a.useState(0),o=l()(r,2),c=o[0],i=o[1];return a.createElement("div",{style:{flex:1}},a.createElement(d.a,{position:"static",style:{backgroundColor:"white",zIndex:2,position:"relative"}},a.createElement(m.a,{value:c,onChange:function(e,t){return i(t)},indicatorColor:"primary",textColor:"primary"},t.map((function(e){return a.createElement(f.a,{label:e,key:e})})))),t.map((function(e,t){return a.createElement(p,{show:c===t,key:e},c===t&&n(t))})))},g=n(16),v=n.n(g),E=n(202),y=n(203),h=(Object(E.a)((function(e){return{button:{}}})),n(204)),O=n(205),x=n(91),w=n.n(x),C=n(66),D=n.n(C),j=n(92),k=n.n(j),I=n(93),P=n.n(I),S=function(e){var t=e.active,n=e.setActive;return o.a.createElement(o.a.Fragment,null,o.a.createElement(d.a,{color:"primary",style:{top:"auto",bottom:0}},o.a.createElement(h.a,{style:{minHeight:0}},o.a.createElement(O.a,{edge:"start",color:"inherit",onClick:function(){return console.log("open menu")}},o.a.createElement(w.a,null)),o.a.createElement(m.a,{value:t,onChange:function(e,t){return n(t)},TabIndicatorProps:{style:{backgroundColor:"white"}}},o.a.createElement(f.a,{label:o.a.createElement("div",null,o.a.createElement(k.a,{style:{verticalAlign:"middle"}})," Board")}),o.a.createElement(f.a,{label:o.a.createElement("div",null,o.a.createElement(P.a,{style:{verticalAlign:"middle"}})," Notes")})),o.a.createElement("div",{style:{flexGrow:1}}),o.a.createElement(O.a,{edge:"end",color:"inherit"},o.a.createElement(D.a,null)))))},R=n(19),A=n.n(R),B=n(39);function H(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}var N,z=function(){return Math.random().toString().substring(15)};function M(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function F(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?M(Object(n),!0).forEach((function(t){A()(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):M(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var T=Object(B.b)("kanban/TRANSFER_CARD"),W=Object(B.b)("kanban/REORDER_CARD"),G=Object(B.b)("kanban/ADD_CARD"),_=function(e){return function(t){return e.cards.filter((function(e){return e.id===t}))[0]}},J=function(e,t){return e.map((function(e){return e.id===t})).indexOf(!0)},L=function(){var e=function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?H(Object(n),!0).forEach((function(t){A()(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):H(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}({tabs:[{name:"Main"},{name:"Secondary"}]},function(e){for(var t=e.reduce((function(e,t){return e+t}),0),n=[],r=0;r<t;r++){var a=(r+1).toString()+"-"+z();n.push({id:a,content:"Item "+(r+1)})}for(var o=[],c=0,l=0;c<e.length;c++){var i=n.slice(l,l+e[c]).map((function(e){return e.id})),u=(c+1).toString()+"-"+z();o.push({id:u,items:i,name:"Column ("+u+")"}),l+=e[c]}return{cards:n,columns:o}}([12,9,6,8,10])),t=e.columns.map((function(e){return e.id}));return e.tabs[0].columns=[t[0],t[1],t[2]],e.tabs[1].columns=[t[3],t[4]],e}(),V=Object(B.c)(L,(N={},A()(N,T,(function(e,t){var n=J(e.columns,t.payload.srcColID),r=J(e.columns,t.payload.dstColID),a=e.columns[n].items,o=e.columns[r].items,c=a.splice(t.payload.srcIndex,1),i=l()(c,1)[0];o.splice(t.payload.dstIndex,0,i)})),A()(N,W,(function(e,t){var n=J(e.columns,t.payload.colID),r=e.columns[n].items,a=r.splice(t.payload.srcIndex,1),o=l()(a,1)[0];r.splice(t.payload.dstIndex,0,o),e.columns[n].items=r})),A()(N,G,(function(e,t){var n=t.payload,r=n.content,a=(n.colID,J(e.columns,t.payload.colID)),o=z();e.cards.push({id:o,content:r}),e.columns[a].items.unshift(o)})),N)),X=n(71),Y=n(76),q=n.n(Y),K=n(206),Q=n(209),U=n(109),Z=n.n(U),$=Object(E.a)((function(e){return{root:{height:"100%",display:"flex",flexDirection:"row",flexWrap:"nowrap",padding:8},column:{background:"#DFEEEE",padding:8,paddingBottom:24,width:350,border:"1px solid #CCDCDC",borderRadius:5,margin:8,maxHeight:"calc(100vh - 160px)",overflow:"hidden"},draggingOverColumn:{background:"#DAEBEB",border:"1px solid #BBCBCB"},columnHeaderContainer:{padding:"8 0",display:"flex",justifyContent:"space-between"},columnHeaderText:{marginBottom:4,fontFamily:"sans-serif",fontWeight:500,fontSize:"1.2em"},columnHeaderRule:{overflow:"hidden",border:"none",color:"#CCDCDC",backgroundColor:"#CCDCDC",height:"1px",width:367,marginLeft:-9},card:{userSelect:"none",padding:16,margin:"0 0 8px 0",background:"white",borderRadius:5,overflow:"hidden","&:hover, &:focus":{boxShadow:"0 1px 3px rgba(100, 100, 100, 0.3)"},"&>p":{margin:0}},draggingCard:{background:"rgba(255, 255, 255, 0.6)",boxShadow:"0 1px 3px rgba(100, 100, 100, 0.3)"}}})),ee=function(e){var t=e.tab,n=Object(s.c)(),r=$(),o=Object(s.d)((function(e){return function(e){return function(t){return t.tabs[e].columns.map(function(e){return function(t){return e.columns.filter((function(e){return e.id===t}))[0]}}(t)).map((function(e){return F(F({},e),{},{items:e.items.map(_(t))})}))}}(t)(e.boards)}));return a.createElement(i.a,null,a.createElement(X.a,{onDragEnd:function(e){return e.destination?n((t=e.source.droppableId,r=e.destination.droppableId,a=e.source.index,o=e.destination.index,t===r?W({colID:t,srcIndex:a,dstIndex:o}):T({srcColID:t,dstColID:r,srcIndex:a,dstIndex:o}))):null;var t,r,a,o}},a.createElement("div",{className:r.root},o.map((function(e){return a.createElement(te,{col:e,styles:r,key:e.id})})))))},te=function(e){var t=e.styles,n=e.col,r=n.id,o=n.items,c=n.name,i=a.useState(!1),u=l()(i,2),d=u[0],m=u[1],f=a.useState(""),p=l()(f,2),b=p[0],g=p[1],v=Object(s.c)(),E=function(){v(G({content:b,colID:r})),g(""),m(!1)},y=function(){d&&g(""),m(!d)};return a.createElement(X.c,{droppableId:r,style:{flexGrow:1}},(function(e,n){return a.createElement("div",{ref:e.innerRef,className:q()(t.column,A()({},t.draggingOverColumn,n.isDraggingOver))},a.createElement(re,{styles:t,name:c,add:y}),a.createElement("div",{style:{width:350,overflowY:"auto",overflowX:"hidden",height:"100%"}},d&&a.createElement(ne,{value:b,setValue:g,add:E}),a.createElement("div",{style:{width:350}}," ",o.map((function(e,n){return a.createElement(ae,{card:e,styles:t,index:n,key:e.id})})))),e.placeholder)}))},ne=function(e){var t=e.value,n=e.setValue,r=e.add;return a.createElement("div",null,a.createElement(K.a,{label:"New Card",multiline:!0,rowsMax:6,value:t,onChange:function(e){return n(e.target.value)},variant:"filled",style:{width:"100%"}}),a.createElement(y.a,{style:{width:"100%",marginBottom:8,boxShadow:"0px 4px 2px -2px rgba(0,0,0,0.15)"},variant:"contained",onClick:r},"Done"))},re=function(e){var t=e.styles,n=e.name,r=e.add;return a.createElement("div",null,a.createElement("div",{className:t.columnHeaderContainer},a.createElement("div",{className:t.columnHeaderText},n),a.createElement("div",null,a.createElement(Q.a,{size:"small",label:"0/6"}),a.createElement(Q.a,{size:"small",label:"3h"}),a.createElement(O.a,{size:"small",onClick:function(){return r()}},a.createElement(Z.a,null)),a.createElement(O.a,{size:"small"},a.createElement(D.a,null)))),a.createElement("hr",{className:t.columnHeaderRule}))},ae=function(e){var t=e.card,n=e.styles,r=e.index,o=t.id,c=t.content;return a.createElement(X.b,{draggableId:o,index:r},(function(e,t){return a.createElement("div",v()({ref:e.innerRef},e.draggableProps,e.dragHandleProps,{className:q()(n.card,A()({},n.draggingCard,t.isDragging)),style:e.draggableProps.style}),c.split("\n").map((function(e){return a.createElement("p",null,e)})))}))},oe=function(){return o.a.createElement(b,{tabs:["one","two"],render:function(e){return o.a.createElement(ee,{tab:e})}})},ce=n(11),le=Object(ce.c)({boards:V}),ie=Object(B.a)({reducer:le}),ue=function(){var e=o.a.useState(0),t=l()(e,2),n=t[0],r=t[1],a="web"===u.a.OS?{maxHeight:"calc(100% - 48px)"}:{flexGrow:1};return o.a.createElement(s.a,{store:ie},o.a.createElement(i.a,{style:{top:0,left:0,height:"100%",width:"100%",display:"flex",flexDirection:"column"}},o.a.createElement(i.a,{style:a},0===n&&o.a.createElement(oe,null)),o.a.createElement(S,{active:n,setActive:r})))};try{document.title="Mirror App"}catch(se){}Object(r.a)((function(e){return o.a.createElement(ue,{style:{top:0,left:0,height:"100%",width:"100%"}})}))}},[[127,1,2]]]);
//# sourceMappingURL=app.7f0f3da0.chunk.js.map