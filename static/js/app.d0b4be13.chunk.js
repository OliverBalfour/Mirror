(this.webpackJsonp=this.webpackJsonp||[]).push([[0],{204:function(e,t,n){n(205),e.exports=n(320)},205:function(e,t){"serviceWorker"in navigator&&window.addEventListener("load",(function(){navigator.serviceWorker.register("/Mirror/expo-service-worker.js",{scope:"/Mirror/"}).then((function(e){})).catch((function(e){console.info("Failed to register service-worker",e)}))}))},320:function(e,t,n){"use strict";n.r(t);var a=n(381),r=n(0),o=n.n(r),c=n(15),l=n.n(c),i=n(34),u=n(61),s=n(17),d=n(363),m=n(379),f=n(364),p=n(365),b=n(69),g=n.n(b),E=n(181),h=n(386),y=function(e){var t=e.map,n=e.children,a=r.useState(null),o=l()(a,2),c=o[0],i=o[1],u=function(){return i(null)};return r.createElement(r.Fragment,null,r.createElement(E.a,{anchorEl:c,keepMounted:!0,open:Boolean(c),onClose:u},Object.entries(t).map((function(e){var t=l()(e,2),n=t[0],a=t[1];return r.createElement(h.a,{key:n,onClick:function(){u(),a()}},n)}))),r.cloneElement(n,{onClick:function(e){return i(e.currentTarget)}}))},v=function(e){var t=e.show,n=e.children;return r.createElement("div",{hidden:!t,style:{height:"calc(100% - 48px)"}},t&&n)},O=function(e){var t=e.tabs,n=e.render,a=e.children,o=e.index,c=e.setIndex,l=e.addTab,u=e.renameTab,s=e.deleteTab,b=e.moveTab,E=function(e,n){return n>=0&&n<t.length&&c(n)};return r.createElement("div",{style:{flex:1}},r.createElement(d.a,{position:"static",style:{backgroundColor:"white",zIndex:2,position:"relative"}},r.createElement(m.a,{value:o,onChange:E,indicatorColor:"primary",textColor:"primary"},t.map((function(e){return r.createElement(f.a,{label:e,key:e})})),r.createElement(i.a,{style:{flexGrow:1}}),r.createElement(y,{map:{"Add tab":function(){return l()},"Rename tab":function(){return u(o)},"Delete tab":function(){return s(o)},"Move tab left":function(){return b([o,o-1]),E(0,o-1)},"Move tab right":function(){return b([o,o+1]),E(0,o+1)}}},r.createElement(p.a,null,r.createElement(g.a,null))),a)),t.map((function(e,t){return r.createElement(v,{show:o===t,key:e},o===t&&n(t))})))},C=n(24),w=n.n(C),D=n(366),x=n(323),j=(Object(D.a)((function(e){return{button:{}}})),n(367)),k=n(167),I=n.n(k),S=n(168),T=n.n(S),P=n(101),M=n.n(P),A=function(e){var t=e.active,n=e.setActive;return o.a.createElement(o.a.Fragment,null,o.a.createElement(d.a,{color:"primary",style:{top:"auto",bottom:0}},o.a.createElement(j.a,{style:{minHeight:0}},o.a.createElement(p.a,{edge:"start",color:"inherit",onClick:function(){return console.log("open menu")}},o.a.createElement(I.a,null)),o.a.createElement(m.a,{value:t,onChange:function(e,t){return n(t)},TabIndicatorProps:{style:{backgroundColor:"white"}}},o.a.createElement(f.a,{label:o.a.createElement("div",null,o.a.createElement(T.a,{style:{verticalAlign:"middle"}})," Board")}),o.a.createElement(f.a,{label:o.a.createElement("div",null,o.a.createElement(M.a,{style:{verticalAlign:"middle"}})," Notes")})),o.a.createElement("div",{style:{flexGrow:1}}),o.a.createElement(y,{map:{"Export state":function(){return window.prompt("Copy/paste this into a file",localStorage.kanban)},"Import state":function(){localStorage.kanban=window.prompt("Paste your exported state here. Press cancel (or the undo button after pressing OK) to revert. Refresh the page to confirm and reload state.")},"Clear saved state":function(){return"YES"===window.prompt("Delete all saved state? Pressing undo will fix this. Type YES to confirm","NO")&&localStorage.clear()}}},o.a.createElement(p.a,{edge:"end",color:"inherit"},o.a.createElement(g.a,null))))))},R=n(169),N=n.n(R),L=n(170),F=n.n(L),_=n(60),z=n.n(_),W=function(){var e=Object(s.c)();return r.createElement(r.Fragment,null,r.createElement(p.a,{onClick:function(){return e(_.ActionCreators.undo())}},r.createElement(N.a,null)),r.createElement(p.a,{onClick:function(){return e(_.ActionCreators.redo())}},r.createElement(F.a,null)))},B=n(125),H=n.n(B),K=n(16),G=n.n(K),U=n(383),V=n(369),J=n(370),Y=n(371),X=n(372),q=n(384),Q=n(389),Z=n(380),$=n(375),ee=n(376),te=n(21),ne=n(368),ae=n(180);function re(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}var oe,ce=function(){return Math.random().toString().substring(2)},le=function(){var e=function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?re(Object(n),!0).forEach((function(t){G()(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):re(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}({tabs:[{name:"Main",id:ce()},{name:"Secondary",id:ce()}]},function(e,t){for(var n=e.reduce((function(e,t){return e+t}),0),a=[],r=["Wash the dishes","Make cool app","Run out of ideas for sample tasks for the app you're making","Cook pizza for dinner","Finish your chemistry homework","Write a tutorial explaining how monads are isomorphic to burritos in the category of food","Forget to wrap a line at 300 characters","Learn Common Lisp","Do normal human things","Prove P=NP for N=1","Eat some chocolate","Stop eating so much chocolate","Write witty comment","\ud83d\ude42"],o=0;o<n;o++){var c=(o+1).toString()+"-"+ce();a.push({id:c,content:r[Math.floor(Math.random()*r.length)]})}for(var l=[],i=0,u=0;i<e.length;i++){var s=a.slice(u,u+e[i]).map((function(e){return e.id})),d=(i+1).toString()+"-"+ce();l.push({id:d,items:s,name:t[i]}),u+=e[i]}return{cards:a,columns:l}}([9,2,6,5,4],["To Do","Doing","Done","Misc 1","Misc 2"])),t=e.columns.map((function(e){return e.id}));return e.tabs[0].columns=[t[0],t[1],t[2]],e.tabs[1].columns=[t[3],t[4]],e},ie=function(e){var t=new Date(e),n=new Date,a=function(e){return 0===e.getHours()&&0===e.getMinutes()?null:0===e.getMinutes()?ae.a(e,"haaa"):ae.a(e,"h:mmaaa")}(t);return function(e){var t=ne.a(e,n);return 0===t?"Today":-1===t?"Yesterday":1===t?"Tomorrow":t>0&&t<7?ae.a(e,"EEE"):t>-7&&t<0?"Last "+ae.a(e,"EEE"):ae.a(e,"MMM do")}(t)+(a?" "+a:"")};function ue(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function se(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?ue(Object(n),!0).forEach((function(t){G()(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):ue(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var de=Object(te.b)("kanban/TRANSFER_CARD"),me=Object(te.b)("kanban/REORDER_CARD"),fe=Object(te.b)("kanban/ADD_CARD"),pe=Object(te.b)("kanban/EDIT_CARD_CONTENT"),be=Object(te.b)("kanban/EDIT_CARD"),ge=Object(te.b)("kanban/DELETE_CARD"),Ee=Object(te.b)("kanban/ADD_COLUMN"),he=Object(te.b)("kanban/DELETE_COLUMN"),ye=Object(te.b)("kanban/RENAME_COLUMN"),ve=Object(te.b)("kanban/MOVE_COLUMN"),Oe=Object(te.b)("kanban/ARCHIVE_ALL_COLUMN"),Ce=Object(te.b)("kanban/ADD_TAB"),we=Object(te.b)("kanban/DELETE_TAB"),De=Object(te.b)("kanban/RENAME_TAB"),xe=Object(te.b)("kanban/MOVE_TAB"),je=function(e,t){return e.map((function(e){return e.id===t})).indexOf(!0)},ke=function(e,t){return e.splice(je(e,t),1)},Ie=function(e,t){var n=e.indexOf(t);-1!==n&&e.splice(n,1)},Se={getColumnsInTabs:function(e){return e.tabs.map((function(t,n){return e.tabs[n].columns.map((function(t){return e.columns[je(e.columns,t)]})).map((function(t){return se(se({},t),{},{items:t.items.map((function(t){return e.cards[je(e.cards,t)]}))})}))}))},columns:function(e){return e.columns},tabs:function(e){return e.tabs},cards:function(e){return e.cards},archivedCards:function(e){return e.cards.filter((function(e){return-1!==Object.keys(e).indexOf("archived")}))},activeCards:function(e){return e.cards.filter((function(e){return-1===Object.keys(e).indexOf("archived")}))}},Te=function(){try{if(!localStorage.hasOwnProperty("kanban"))return le();var e=JSON.parse(localStorage.getItem("kanban"));if(null!==e)return e}catch(t){return le()}}(),Pe=function(e,t){var n=je(e.columns,t);e.columns[n].items.forEach((function(t){return ke(e.cards,t)})),e.tabs.forEach((function(e){return Ie(e.columns,t)})),ke(e.columns,t)},Me=Object(te.c)(Te,(oe={},G()(oe,de,(function(e,t){var n=je(e.columns,t.payload.srcColID),a=je(e.columns,t.payload.dstColID),r=e.columns[n].items,o=e.columns[a].items,c=r.splice(t.payload.srcIndex,1),i=l()(c,1)[0];o.splice(t.payload.dstIndex,0,i)})),G()(oe,me,(function(e,t){var n=je(e.columns,t.payload.colID),a=e.columns[n].items,r=a.splice(t.payload.srcIndex,1),o=l()(r,1)[0];a.splice(t.payload.dstIndex,0,o),e.columns[n].items=a})),G()(oe,fe,(function(e,t){var n=t.payload,a=n.content,r=(n.colID,je(e.columns,t.payload.colID)),o=ce();e.cards.push({id:o,content:a}),e.columns[r].items.unshift(o)})),G()(oe,he,(function(e,t){Pe(e,t.payload)})),G()(oe,ye,(function(e,t){e.columns[je(e.columns,t.payload.colID)].name=t.payload.name})),G()(oe,pe,(function(e,t){e.cards[je(e.cards,t.payload.cardID)].content=t.payload.content})),G()(oe,ge,(function(e,t){je(e.cards,t.payload);e.columns.forEach((function(e){return Ie(e.items,t.payload)})),ke(e.cards,t.payload)})),G()(oe,Ee,(function(e,t){var n=ce();e.columns.push({id:n,items:[],name:t.payload.name}),e.tabs[je(e.tabs,t.payload.tabID)].columns.push(n)})),G()(oe,be,(function(e,t){e.cards[je(e.cards,t.payload.card.id)]=t.payload.card;var n=e.columns.map((function(e){return-1!==e.items.indexOf(t.payload.card.id)})).indexOf(!0),a=je(e.columns,t.payload.colID);n!==a&&(Ie(e.columns[n].items,t.payload.card.id),e.columns[a].items.unshift(t.payload.card.id))})),G()(oe,we,(function(e,t){for(;e.tabs[t.payload].columns.length;)Pe(e,e.tabs[t.payload].columns[0]);e.tabs.splice(t.payload,1)})),G()(oe,Ce,(function(e,t){e.tabs.push({name:t.payload,id:ce(),columns:[]})})),G()(oe,De,(function(e,t){e.tabs[je(e.tabs,t.payload.tabID)].name=t.payload.name})),G()(oe,ve,(function(e,t){var n=l()(t.payload,3),a=n[0],r=n[1],o=n[2],c=e.tabs[o].columns,i=c.splice(a,1),u=l()(i,1)[0];c.splice(r,0,u),e.tabs[o].columns=c})),G()(oe,xe,(function(e,t){var n=l()(t.payload,2),a=n[0],r=n[1];if(!(r<0||r>=e.tabs.length)){var o=e.tabs,c=o.splice(a,1),i=l()(c,1)[0];o.splice(r,0,i),e.tabs=o}})),G()(oe,Oe,(function(e,t){var n=je(e.columns,t.payload);e.columns[n].items.forEach((function(n){e.cards[je(e.cards,n)].archived={date:(new Date).getTime(),colID:t.payload}})),e.columns[n].items=[]})),oe)),Ae=z()(Me,{limit:50}),Re=n(19),Ne=Object(Re.c)({boards:Ae}),Le=Object(te.a)({reducer:Ne});try{document.addEventListener("keyup",(function(e){e.ctrlKey&&90===e.which?Le.dispatch(_.ActionCreators.undo()):(e.ctrlKey&&e.shiftKey&&90===e.which||e.ctrlKey&&89===e.which)&&Le.dispatch(_.ActionCreators.redo())}))}catch(Et){}var Fe=function(){return function(e){try{if(localStorage){var t=JSON.stringify(e);localStorage.setItem("kanban",t)}}catch(Et){}}(Le.getState().boards.present)};Le.subscribe(Fe),Fe();var _e,ze,We=Le,Be=function(e){return e.boards.present},He={boards:(_e=Se,ze=function(e){return function(t){return e(Be(t))}},Object.keys(_e).reduce((function(e,t){return e[t]=ze(_e[t]),e}),{}))},Ke=n(105),Ge=n.n(Ke),Ue=n(20),Ve=n(378),Je=n(179);function Ye(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function Xe(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?Ye(Object(n),!0).forEach((function(t){G()(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):Ye(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var qe=function(e){var t=e.open,n=e.respond,a=e.title,o=e.subtitle,c=e.labels,l=void 0===c?["Cancel","OK"]:c;return r.createElement(U.a,{open:t,onClose:function(){return n(null)}},r.createElement(V.a,null,a),r.createElement(J.a,null,r.createElement(Y.a,null,o)),r.createElement(X.a,null,r.createElement(x.a,{onClick:function(){return n(!1)},color:"primary"},l[0]),r.createElement(x.a,{onClick:function(){return n(!0)},color:"primary",variant:"contained",autoFocus:!0},l[1])))},Qe=function(e){var t=e.open,n=e.respond,a=e.title,o=e.subtitle,c=e.labels,i=void 0===c?["Cancel","OK"]:c,u=e.label,s=e.inputType,d=void 0===s?"text":s,m=e.placeholder,f=void 0===m?"":m,p=e.buttons,b=void 0===p?null:p,g=r.useState(f),E=l()(g,2),h=E[0],y=E[1],v=function(e){n(e),y(f)};return r.createElement(U.a,{open:t,onClose:function(){return v(null)}},r.createElement(V.a,null,a),r.createElement(J.a,null,"string"===typeof o&&r.createElement(Y.a,null,o),r.createElement(q.a,{autoFocus:!0,margin:"dense",fullWidth:!0,label:u,type:d,value:h,onChange:function(e){return y(e.target.value)}})),r.createElement(X.a,null,b,r.createElement(x.a,{onClick:function(){return v(!1)},color:"primary"},i[0]),r.createElement(x.a,{onClick:function(){return v(h)},color:"primary",variant:"contained"},i[1])))},Ze=function(e){var t=e.respond,n=e.card,a=Object(s.c)(),o=Object(s.d)((function(e){return Be(e).columns.filter((function(e){return-1!==e.items.indexOf(n.id)}))[0].id})),c=r.useState({card:Xe({},n),colID:o}),i=l()(c,2),u=i[0],d=i[1],m=function(e){return d(Xe(Xe({},u),{},{card:Xe(Xe({},u.card),{},{content:e})}))},f=function(e){return d(Xe(Xe({},u),{},{card:Xe(Xe({},u.card),{},{time:e})}))},p=r.useState(!1),b=l()(p,2),g=b[0],E=b[1],y=H()(Object(s.d)(He.boards.columns)),v=Object(s.d)(He.boards.tabs),O=function(){return t(),m(n.content)},C=[ce()];return r.createElement(U.a,{open:!0,onClose:function(){return O()},fullWidth:!0,maxWidth:"md"},r.createElement(V.a,null,"Edit card"),r.createElement(J.a,null,r.createElement(Q.a,{id:C[0]},"Column"),r.createElement(Z.a,{labelId:C[0],value:u.colID,onChange:function(e){return t=e.target.value,d(Xe(Xe({},u),{},{colID:t}));var t}},v.flatMap((function(e){return[r.createElement($.a,{key:e.id},e.name)].concat(H()(e.columns.map((function(e){var t=y[function(e){return y.map((function(t){return t.id===e})).indexOf(!0)}(e)];return r.createElement(h.a,{value:e,key:e},t.name)}))))}))),r.createElement(q.a,{label:"Title",margin:"dense",autoFocus:!0,fullWidth:!0,variant:"filled",multiline:!0,rowsMax:3,value:u.card.content,onChange:function(e){return m(e.target.value)}}),g?r.createElement(ee.a,{onClickAway:function(){return E(!1)}},r.createElement(q.a,{label:"Description",margin:"dense",autoFocus:!0,fullWidth:!0,variant:"outlined",multiline:!0,rows:6,rowsMax:16,value:u.card.description,onChange:function(e){return t=e.target.value,d(Xe(Xe({},u),{},{card:Xe(Xe({},u.card),{},{description:t.length?t:void 0})}));var t}})):r.createElement("div",{onClick:function(){return E(!0)},style:{marginTop:8}},r.createElement("span",{style:{color:"grey"}},"Description"),r.createElement(Ge.a,{source:u.card.description})),u.card.time?r.createElement("div",{style:{marginTop:10}},r.createElement(Ue.a,{utils:Je.a},r.createElement(Ve.a,{value:new Date(u.card.time),onChange:function(e){return f(e.getTime())},label:"Due date / event time",showTodayButton:!0,format:"MMMM do hh:mm aaa"})),r.createElement(x.a,{color:"primary",variant:"outlined",style:{float:"right",marginTop:12},onClick:function(){return f(null)}},"Reset date")):r.createElement("span",{style:{color:"grey"},onClick:function(){return f((new Date).getTime())}},"Due date / event time")),r.createElement(X.a,null,r.createElement(x.a,{onClick:function(){return a(be(u)),a(ge(n.id)),O()}},"Delete"),r.createElement(x.a,{onClick:O,color:"primary"},"Cancel"),r.createElement(x.a,{onClick:function(){return a(be(u)),O()},color:"primary",variant:"contained"},"OK")))},$e=n(377),et=n(390),tt=n(126),nt=n.n(tt),at=n(171),rt=n.n(at),ot=n(172),ct=n.n(ot),lt=n(66),it=Object(D.a)((function(e){return{root:{height:"100%",display:"flex",flexDirection:"row",flexWrap:"nowrap",padding:8,fontSize:"14px","& *":{flexShrink:0}},column:{background:"#DFEEEE",padding:8,paddingBottom:24,width:300,border:"1px solid #CCDCDC",borderRadius:5,margin:8,transition:"border 0.2s",height:"calc(100vh - 160px)",overflow:"hidden"},columnHeaderContainer:{padding:"8 0",display:"flex",justifyContent:"space-between"},columnHeaderText:{paddingLeft:8,paddingBottom:0,fontSize:"1.4em"},columnHeaderRule:{overflow:"hidden",border:"none",color:"#CCDCDC",backgroundColor:"#CCDCDC",height:"1px",width:317,marginLeft:-9},card:{userSelect:"none",padding:"10px 13px",margin:"0 0 8px 0",background:"white",borderRadius:5,transition:"opacity 0.3s",overflow:"hidden","&:hover, &:focus":{boxShadow:"0 1px 3px rgba(100, 100, 100, 0.3)"},"&>p":{margin:0}},draggingCard:{opacity:.7,boxShadow:"0 1px 3px rgba(100, 100, 100, 0.3)"},columnContainer:{transition:"opacity 0.6s"},draggingColumn:{opacity:.7}}})),ut=function(e){var t=e.tabInfo,n=t.index,a=t.tab,o=Object(s.c)(),c=it(),u=Object(s.d)(He.boards.getColumnsInTabs)[n],d=r.useState(!1),m=l()(d,2),f=m[0],p=m[1];return r.createElement(i.a,{style:{width:"100vw",overflowX:"auto",height:"100%"}},r.createElement(lt.a,{onDragEnd:function(e){e.destination&&("card"===e.type?o(function(e){var t=l()(e,4),n=t[0],a=t[1],r=t[2],o=t[3];return n===a?me({colID:n,srcIndex:r,dstIndex:o}):de({srcColID:n,dstColID:a,srcIndex:r,dstIndex:o})}([e.source.droppableId,e.destination.droppableId,e.source.index,e.destination.index])):"column"===e.type&&o(ve([e.source.index,e.destination.index,n])))}},r.createElement(lt.c,{droppableId:"default",style:{flexGrow:1,height:"100%"},direction:"horizontal",type:"column"},(function(e,t){return r.createElement(r.Fragment,null,r.createElement("div",{className:c.root,ref:e.innerRef},u.map((function(e,t){return r.createElement(st,{col:e,styles:c,key:e.id,index:t})})),r.createElement(pt,{styles:c,add:function(){return p(!0)},hide:t.isDraggingOver||t.draggingFromThisWith})),e.placeholder)}))),f&&r.createElement(Qe,{open:!0,respond:function(e){return p(!1)||"string"===typeof e&&e.length&&o(Ee({tabID:a.id,name:e}))},title:"Add column",label:"Name"}))},st=function(e){var t=e.styles,n=e.col,a=e.index,o=n.id,c=n.items,i=(n.name,r.useState(!1)),u=l()(i,2),d=u[0],m=u[1],f=r.useState(""),p=l()(f,2),b=p[0],g=p[1],E=Object(s.c)(),h=function(){b.length&&E(fe({content:b,colID:o})),g(""),m(!1)},y=function(){d&&g(""),m(!d)},v=function(){console.log("pressed menu button")},O=r.createElement(lt.c,{droppableId:o,style:{flexGrow:1,height:"100%"},type:"card",ignoreContainerClipping:!0},(function(e,n){return r.createElement(r.Fragment,null,r.createElement("div",{style:{width:300,overflowY:"auto",overflowX:"hidden",height:n.isDraggingOver?"calc(100% - 120px)":"calc(100% - 20px)",paddingBottom:n.isDraggingOver?100:0},ref:e.innerRef},d&&r.createElement(dt,{value:b,setValue:g,add:h,cancel:function(){g(""),m(!1)}}),c.map((function(e,n){return r.createElement(ft,{card:e,styles:t,index:n,key:e.id})}))),e.placeholder)}));return r.createElement(lt.b,{draggableId:o,index:a},(function(e,a){return r.createElement("div",w()({ref:e.innerRef},e.draggableProps,{className:t.columnContainer+(a.isDragging?" "+t.draggingColumn:""),style:e.draggableProps.style}),r.createElement("div",{className:t.column},r.createElement("div",e.dragHandleProps,r.createElement(mt,{styles:t,col:n,add:y,menu:v})),O))}))},dt=function(e){var t=e.value,n=e.setValue,a=e.add,o=e.cancel;return r.createElement("div",null,r.createElement(q.a,{label:"New Card",multiline:!0,rowsMax:6,value:t,onChange:function(e){return n(e.target.value)},variant:"filled",style:{width:"100%"}}),r.createElement($e.a,{variant:"contained",size:"small",style:{marginBottom:8,boxShadow:"0px 4px 2px -2px rgba(0,0,0,0.15)",width:"100%"}},r.createElement(x.a,{style:{flexGrow:1},variant:"contained",onClick:a},"Done"),r.createElement(x.a,{onClick:o},r.createElement(rt.a,{style:{color:"#555"}}))))},mt=function(e){var t=e.styles,n=e.col,a=e.add,o=(e.menu,Object(s.c)()),c=r.useState(!1),i=l()(c,2),u=i[0],d=i[1],m=r.useState(!1),f=l()(m,2),b=f[0],E=f[1];return r.createElement("div",null,r.createElement("div",{className:t.columnHeaderContainer},r.createElement("div",{className:t.columnHeaderText},n.name),r.createElement("div",null,r.createElement(et.a,{size:"small",label:"0/6"}),r.createElement(et.a,{size:"small",label:"3h"}),r.createElement(p.a,{size:"small",onClick:function(){return a()}},r.createElement(nt.a,null)),r.createElement(y,{map:{"Archive all":function(){return o(Oe(n.id))},Rename:function(){return E(!0)},Delete:function(){return d(!0)}}},r.createElement(p.a,{size:"small"},r.createElement(g.a,null))))),r.createElement("hr",{className:t.columnHeaderRule}),u&&r.createElement(qe,{open:!0,respond:function(e){return d(!1)||e&&o(he(n.id))},title:"Delete this column?",subtitle:"Don't worry, this action can be undone."}),b&&r.createElement(Qe,{open:!0,respond:function(e){return E(!1)||"string"===typeof e&&e.length&&o(ye({colID:n.id,name:e}))},title:'Rename column "'+n.name+'"',subtitle:"Don't worry, this action can be undone.",label:"Name",placeholder:n.name}))},ft=function(e){var t=e.card,n=e.styles,a=e.index,o=t.id,c=t.content,i=(Object(s.c)(),r.useState(!1)),u=l()(i,2),d=u[0],m=u[1],f={description:M.a,time:ct.a};return r.createElement(r.Fragment,null,r.createElement(lt.b,{draggableId:o,index:a},(function(e,a){return r.createElement("div",w()({ref:e.innerRef},e.draggableProps,e.dragHandleProps,{className:n.card+(a.isDragging?" "+n.draggingCard:""),style:e.draggableProps.style,onClick:function(){return m(!0)}}),r.createElement(Ge.a,{source:c}),t.description&&function(){var e=f.description;return r.createElement(et.a,{size:"small",icon:e?r.createElement(e,null):null,label:"",style:{borderRadius:3,background:"white"},title:t.description.split("\n\n").join("\n").substring(0,256)+(t.description.length>256?"...":""),variant:"outlined"})}(),t.time&&function(){var e=f.time;return r.createElement(et.a,{size:"small",icon:e?r.createElement(e,null):null,label:ie(t.time),title:Object(ae.a)(new Date(t.time),"dd/MM/yyyy hh:mmaaa"),style:{borderRadius:3,background:"white"},variant:"outlined"})}())})),d&&r.createElement(Ze,{respond:function(){return m(!1)},card:t}))},pt=function(e){var t=e.styles,n=e.add,a=e.hide;return r.createElement("div",{className:t.column,style:{width:300,display:"flex",justifyContent:"center",alignItems:"center",height:"100px",marginLeft:a?342:8}},r.createElement(p.a,{onClick:n},r.createElement(nt.a,null)))},bt=function(){var e=Object(s.c)(),t=r.useState(0),n=l()(t,2),a=n[0],o=n[1],c=r.useState(!1),i=l()(c,2),u=i[0],d=i[1],m=r.useState(!1),f=l()(m,2),p=f[0],b=f[1],g=r.useState(!1),E=l()(g,2),h=E[0],y=E[1],v=Object(s.d)(He.boards.tabs);return r.createElement(r.Fragment,null,r.createElement(O,{tabs:v.map((function(e){return e.name})),render:function(e){return r.createElement(ut,{tabInfo:{tab:v[e],index:e}})},addTab:function(){return b(!0)},renameTab:function(){return y(!0)},deleteTab:function(){return v.length>1?d(!0):alert("Cannot delete only tab")},moveTab:function(t){return e(xe(t))},children:r.createElement(W,null),index:a,setIndex:o}),u&&r.createElement(qe,{open:!0,respond:function(t){return d(!1)||t&&(e(we(a)),o(Math.max(0,a-1)))},title:"Delete this tab?",subtitle:"Don't worry, this action can be undone."}),p&&r.createElement(Qe,{open:!0,respond:function(t){return b(!1)||"string"===typeof t&&t.length&&e(Ce(t))},title:"Add tab",label:"Name"}),h&&r.createElement(Qe,{open:!0,respond:function(t){return y(!1)||"string"===typeof t&&t.length&&e(De({tabID:v[a].id,name:t}))},title:"Rename tab "+v[a].name,label:"Name"}))},gt=function(){var e=o.a.useState(0),t=l()(e,2),n=t[0],a=t[1],r="web"===u.a.OS?{height:"calc(100% - 48px)"}:{flexGrow:1};return o.a.createElement(s.a,{store:We},o.a.createElement(i.a,{style:{top:0,left:0,height:"100%",width:"100%",display:"flex",flexDirection:"column"}},o.a.createElement(i.a,{style:r},0===n&&o.a.createElement(bt,null)),o.a.createElement(A,{active:n,setActive:a})))};Object(a.a)((function(e){return o.a.createElement(gt,{style:{top:0,left:0,height:"100%",width:"100%"}})}))}},[[204,1,2]]]);
//# sourceMappingURL=app.d0b4be13.chunk.js.map