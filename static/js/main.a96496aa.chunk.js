(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{171:function(e,t,a){e.exports=a(247)},247:function(e,t,a){"use strict";a.r(t);var n=a(0),i=a.n(n),s=a(12),r=a.n(s),o=a(48),l=a(72),d=a(298),c=a(25),p=a(297),m=a(78),h=a(248),u=a(143),g=a.n(u),y=a(99);const E=()=>n.createElement("span",{style:{display:"none"}});class b extends n.Component{constructor(...e){super(...e),this.dateInput=n.createRef(),this.handleChange=(e=>{this.props.onChange(e)}),this.openCalendar=(()=>{null!=this.dateInput.current&&this.dateInput.current.open()}),this.closeCalendar=(()=>{this.setState({calendarIsOpen:!1})})}render(){const e=this.props.value;return n.createElement(n.Fragment,null,n.createElement(h.a,{onClick:()=>this.openCalendar(),color:"inherit"},n.createElement(g.a,null)),n.createElement(y.a,{onChange:this.handleChange,value:e,ref:this.dateInput,TextFieldComponent:E,autoOk:!0,showTodayButton:!0}))}}var f=a(34),v=a(93),D=a.n(v);const S=e=>{const t=e.search;let a=D.a.parse(t).date;return null==a&&(a=""),a instanceof Array&&(a=a[0]),new Date(a)},T=Object(c.a)(p.a)`
  display: flex;
  justify-content: space-between;
`;var C=Object(o.f)(class extends n.Component{constructor(...e){super(...e),this.handleDateChange=(e=>{const t=this.props.history,a=Object(f.a)(e,"yyyy-MM-dd");t.push(`?date=${a}`)})}render(){const e=this.props.location,t=S(e);return n.createElement(d.a,{position:"static",color:"primary",style:{marginBottom:"0.5rem"}},n.createElement(T,null,n.createElement(m.a,{variant:"h6",color:"inherit",className:"alignRight"},"Babba tracker"),n.createElement(b,{value:t,onChange:this.handleDateChange})))}}),w=(a(219),a(56));a(139),a(221),a(224);const F=w,I=(w.initializeApp({apiKey:"AIzaSyCLtPtjhDedOYHLfrOZ_yVvMWjL2hFgDO0",authDomain:"babba-68803.firebaseapp.com",databaseURL:"https://babba-68803.firebaseio.com",projectId:"babba-68803",storageBucket:"babba-68803.appspot.com",messagingSenderId:"831726193262"}),w.database(),w.firestore()),O=w.auth();var k=new class{constructor(){this.feeds=void 0,this.nappies=void 0,this.sleeps=void 0,this.isInitialised=void 0,this.initialise=(async()=>{if(!this.isInitialised)return this.isInitialised=!0,{feeds:this.feeds,nappies:this.nappies,sleeps:this.sleeps};console.warn("Attempt to re-initialise firebase class, already done")}),this.getFeeds=(()=>[...this.feeds]),this.getNappies=(()=>[...this.nappies]),this.getSleeps=(()=>[...this.sleeps]),this.feeds=[],this.nappies=[],this.sleeps=[],this.isInitialised=!1}},j=a(296),x=a(316),N=a(153),B=a.n(N),L=a(27);let W,A,M;!function(e){e.Feed="feed",e.Nappy="nappy",e.Sleep="sleep"}(W||(W={})),function(e){e.Millilitres="ml",e.FluidOz="fl oz"}(A||(A={})),function(e){e.Feeds="feeds",e.Nappies="nappies",e.Sleeps="sleeps"}(M||(M={}));const U=[M.Feeds,M.Nappies,M.Sleeps];var P=()=>e=>(class extends n.Component{constructor(...e){super(...e),this.state={feeds:k.getFeeds(),nappies:k.getNappies(),sleeps:k.getSleeps()},this.firestore=I,this.unsubscriptions=[],this.getDataByDate=(async({startDate:e,endDate:t})=>{const a=U.map(a=>this.firestore.collection(a).where("time",">",e.getTime()).where("time","<",t?t.getTime():(new Date).getTime()).where("archived","==",!1).orderBy("time","desc").get());try{(await Promise.all(a)).forEach(e=>e.docs.forEach(e=>{this.docAlreadyExists(e)||this.setState(t=>this.addDataReducer(e.id,e.data(),t))}))}catch(n){console.error("Error getting data by date",n)}}),this.subscribeByDate=(({startDate:e,endDate:t})=>{const a=[];return this.setState({feeds:[],nappies:[],sleeps:[]}),U.map(n=>{const i=this.firestore.collection(n).where("time",">",e.getTime()).where("time","<",t?t.getTime():(new Date).getTime()).where("archived","==",!1).orderBy("time","desc").onSnapshot(e=>{e.docChanges().forEach(e=>this.handleFirebaseChangeEvent(e))},this.handleSubscribeError);a.push(i)}),this.unsubscriptions=[...this.unsubscriptions,...a],a}),this.handleSubscribeError=(e=>{console.error("Error getting snapshot from subscription",e)}),this.getTimestamp=(()=>(new Date).getTime()),this.docAlreadyExists=(e=>this.getListFromType(e.data().type).some(t=>t.id===e.id)),this.mapEventFeedDataToItem=((e,t)=>({id:e,type:W.Feed,amount:null!=t.amount?t.amount:"",unit:null!=t.unit?t.unit:"",note:t.note,time:null!=t.time?t.time:void 0,lastEdit:void 0!==t.lastEdit?t.lastEdit:void 0})),this.mapEventNappyDataToItem=((e,t)=>({id:e,type:W.Nappy,isPoop:t.isPoop,isWee:t.isWee,note:t.note,time:null!=t.time?t.time:void 0,lastEdit:void 0!==t.lastEdit?t.lastEdit:void 0})),this.mapEventSleepDataToItem=((e,t)=>({id:e,type:W.Sleep,endTime:t.endTime,note:t.note,time:null!=t.time?t.time:void 0,lastEdit:void 0!==t.lastEdit?t.lastEdit:void 0})),this.handleAddData=(e=>{void 0!=e.time&&e.time||(e.time=this.getTimestamp());const t=O.currentUser;try{this.firestore.collection(this.getKeyFromType(e.type)).doc(e.id).set(Object(L.a)({},e,{lastEdit:{email:t?t.email:"",time:(new Date).getTime()}}))}catch(a){console.error("Error adding Firebase data",a,e)}}),this.handleUpdateData=(async e=>{const t=O.currentUser;try{this.firestore.collection(this.getKeyFromType(e.type)).doc(e.id).update(Object(L.a)({},e,{lastEdit:{email:t?t.email:"",time:(new Date).getTime()}}))}catch(a){console.error("Error updating Firebase data",a,e)}}),this.handleArchiveData=(e=>{const t=O.currentUser;try{this.firestore.collection(this.getKeyFromType(e.type)).doc(e.id).update(Object(L.a)({},e,{archived:!0,lastEdit:{email:t?t.email:"",time:(new Date).getTime()}}))}catch(a){console.error("Error removing Firebase data",a,e)}}),this.handleUnarchiveData=(e=>{const t=O.currentUser;try{this.firestore.collection(this.getKeyFromType(e.type)).doc(e.id).update(Object(L.a)({},e,{archived:!1,lastEdit:{email:t?t.email:"",time:(new Date).getTime()}}))}catch(a){console.error("Error removing Firebase data",a,e)}})}componentDidMount(){if(!k.isInitialised)throw Error("Attempt to render component with Firebase wrapper before Firebase has been initialised")}componentWillUnmount(){0!==this.unsubscriptions.length&&this.unsubscriptions.forEach(e=>e())}addDataReducer(e,t,a){const n=a.feeds,i=a.nappies,s=a.sleeps;if(t.type==W.Feed){const a=this.mapEventFeedDataToItem(e,t);return{feeds:[...n,a],nappies:i,sleeps:s}}if(t.type==W.Nappy){const a=this.mapEventNappyDataToItem(e,t);return{feeds:n,nappies:[...i,a],sleeps:s}}if(t.type==W.Sleep){const a=this.mapEventSleepDataToItem(e,t);return{feeds:n,nappies:i,sleeps:[...s,a]}}return console.error("Unrecognised doc type added to firebase:",t.type),{feeds:n,nappies:i,sleeps:s}}updateDataReducer(e,t,a){const n=a.feeds,i=a.nappies,s=a.sleeps;if(t.type==W.Feed){const a=this.mapEventFeedDataToItem(e,t);return{feeds:n.map(t=>t.id!=e?t:a),nappies:i,sleeps:s}}if(t.type==W.Nappy){const a=this.mapEventNappyDataToItem(e,t);return{feeds:n,nappies:i.map(t=>t.id!=e?t:a),sleeps:s}}if(t.type==W.Sleep){const a=this.mapEventSleepDataToItem(e,t);return{feeds:n,nappies:i,sleeps:s.map(t=>t.id!=e?t:a)}}return console.error("Unrecognised doc type updated in firebase"),{feeds:n,nappies:i,sleeps:s}}removeDataReducer(e,t,a){const n=a.feeds,i=a.nappies,s=a.sleeps;return t.type==W.Feed?{feeds:n.filter(t=>t.id!=e),nappies:i,sleeps:s}:t.type==W.Nappy?{feeds:n,nappies:i.filter(t=>t.id!=e),sleeps:s}:t.type==W.Sleep?{feeds:n,nappies:i,sleeps:s.filter(t=>t.id!=e)}:(console.error("Unrecognised doc type removed from firebase"),{feeds:n,nappies:i,sleeps:s})}getKeyFromType(e){switch(e){case W.Feed:return M.Feeds;case W.Nappy:return M.Nappies;case W.Sleep:return M.Sleeps;default:return"unknown_type"}}getListFromType(e){switch(e){case W.Feed:return this.state[M.Feeds];case W.Nappy:return this.state[M.Nappies];case W.Sleep:return this.state[M.Sleeps];default:return[]}}handleFirebaseChangeEvent(e){switch(e.type){case"added":if(this.docAlreadyExists(e.doc))return;this.setState(t=>this.addDataReducer(e.doc.id,e.doc.data(),t));break;case"modified":this.setState(t=>this.updateDataReducer(e.doc.id,e.doc.data(),t));break;case"removed":this.setState(t=>this.removeDataReducer(e.doc.id,e.doc.data(),t));break;default:console.error("Unrecognised firebase document change type: ",e.type)}}render(){const t={addEntry:this.handleAddData,updateEntry:this.handleUpdateData,archiveEntry:this.handleArchiveData,unarchiveEntry:this.handleUnarchiveData,subscribeByDate:this.subscribeByDate,getDataByDate:this.getDataByDate};return n.createElement(e,Object.assign({},t,this.props,this.state))}}),z=a(312),R=a(148),$=a(294),H=a(300),K=a(301),q=a(302),_=a(303),J=a(304),V=a(150),Z=a.n(V),Y=a(149),G=a.n(Y),Q=a(299);const X="iiii do LLL",ee="Evelyn";var te=class extends n.Component{constructor(...e){super(...e),this.state={isShowingUndoDelete:!1},this.renderDate=(e=>{const t=Object(R.convertToLocalTime)(e,{timeZone:"Europe/London"});return Object(f.a)(t,X)}),this.renderSleepingTitle=(e=>null==e.endTime||0===e.endTime?`${ee} is sleeping...`:`${ee} slept for ${Object(z.a)(e.time,e.endTime)}`),this.renderTitle=(e=>{switch(e.type){case W.Feed:return n.createElement(n.Fragment,null,ee," drank ",e.amount," ",e.unit,"1"===e.amount?"s":"");case W.Nappy:return`${ee} did a ${e.isWee?"wee":""}${e.isWee&&e.isPoop?" and a ":""}${e.isPoop?"poop":""}`;case W.Sleep:return this.renderSleepingTitle(e);default:return"Unrecognised item \ud83e\udd14"}}),this.renderEntryDate=(e=>{if(null!=e.time)return n.createElement(n.Fragment,null,Object(f.a)(new Date(e.time),"h:mm a "))}),this.renderTypeIcon=(e=>e.type===W.Feed?n.createElement("span",{style:{fontSize:"1.5rem",color:"initial"}},"\ud83c\udf7c"):e.type===W.Sleep?n.createElement("span",{style:{fontSize:"1.5rem",color:"initial"}},"\ud83d\ude34"):e.type===W.Nappy&&e.isPoop&&e.isWee?n.createElement("span",{style:{fontSize:"0.6rem",color:"initial"}},"\ud83d\udca9\ud83d\udca6"):e.type===W.Nappy&&e.isPoop?n.createElement("span",{style:{fontSize:"1.5rem",color:"initial"}},"\ud83d\udca9"):e.type===W.Nappy&&e.isWee?n.createElement("span",{style:{fontSize:"1.5rem",color:"initial"}},"\ud83d\udca6"):n.createElement(n.Fragment,null)),this.renderLastEditDetails=(e=>{const t=e.lastEdit;if(void 0!==t)return n.createElement("span",{style:{marginLeft:"1rem"}},t.email," (",Object(f.a)(t.time,"p"),")")}),this.renderSortedEntries=(()=>{const e=this.props,t=e.nappies,a=e.feeds,i=e.sleeps,s=e.date,r=e.onChangeEntry,o=e.removeEntry,l=e.isLoading,d=[...t,...a,...i];return l?n.createElement(n.Fragment,null,n.createElement(m.a,{style:{fontSize:"1rem",paddingTop:"1.5rem",paddingBottom:"3rem",fontWeight:500,color:"rgba(0, 0, 0, 0.54)"},variant:"h2"},this.renderDate(s)),n.createElement("div",{style:{display:"flex",marginTop:"5rem"}},n.createElement(Q.a,{style:{marginRight:"auto",marginLeft:"auto"}}))):0===d.length?n.createElement(n.Fragment,null,n.createElement(m.a,{style:{fontSize:"1rem",paddingTop:"1.5rem",paddingBottom:"3rem",fontWeight:500,color:"rgba(0, 0, 0, 0.54)"},variant:"h2"},this.renderDate(s)),n.createElement(m.a,{style:{fontSize:"1.5rem"},variant:"h3"},"Nothing today")):(d.sort((e,t)=>e.time-t.time),n.createElement(n.Fragment,null,n.createElement(m.a,{style:{fontSize:"1rem",paddingTop:"1.5rem",paddingBottom:"1rem",fontWeight:500,position:"sticky",top:"0",zIndex:1,color:"rgba(0, 0, 0, 0.54)",backgroundColor:"#f5f5f5"},variant:"h2"},this.renderDate(s)),n.createElement("div",{style:{marginBottom:"104px",backgroundColor:"#fff"}},n.createElement($.a,null,d.map((e,t)=>n.createElement("div",{key:e.id},n.createElement(H.a,null,n.createElement(K.a,null,this.renderTypeIcon(e)),n.createElement(q.a,{primary:this.renderTitle(e),secondary:this.renderEntryDate(e)}),n.createElement(_.a,null,n.createElement(h.a,{onClick:()=>r(e),"aria-label":"Edit"},n.createElement(G.a,null)),n.createElement(h.a,{onClick:()=>o(e),"aria-label":"Delete"},n.createElement(Z.a,null)))),t+1<d.length&&n.createElement(J.a,{variant:"middle"})))))))})}render(){return this.renderSortedEntries()}},ae=a(68),ne=a(127),ie=a(152),se=a.n(ie),re=a(151),oe=a.n(re),le=a(305);const de=c.a.div`
  background-color: #fff;
  padding: 1rem 0rem;
  margin: 1rem;
  color: rgba(0, 0, 0, 0.87);
  display: flex;
  align-items: center;
`,ce=4;var pe=P()(class extends n.Component{constructor(...e){super(...e),this.getTimeOfLatestFeed=(()=>{const e=this.props.feeds[0];return null==e?0:e.time})}componentDidMount(){(0,this.props.subscribeByDate)({startDate:Object(ae.a)(new Date),endDate:Object(ne.a)(new Date)})}render(){const e=this.getTimeOfLatestFeed(),t=Object(le.a)(e,(new Date).getTime())<=-ce;return 0===e?null:n.createElement(de,null,t?n.createElement(oe.a,{color:"error",fontSize:"large"}):n.createElement(se.a,{color:"secondary",fontSize:"large"}),n.createElement(m.a,{variant:"body1",component:"p",style:{marginLeft:"1rem"}},"Last ate"," ",n.createElement("b",null,Object(z.a)(e,(new Date).getTime())," ago")))}}),me=a(160);var he=Object(o.f)(P()(class extends n.Component{constructor(...e){super(...e),this.state={unsubscriptions:[],date:new Date,isLoading:!1,isShowingDeleteConfirmation:!1,reversableDelete:void 0},this.componentWillMount=(async()=>{const e=this.props,t=e.location,a=e.getDataByDate,n=e.subscribeByDate,i=S(t),s=n({startDate:Object(ae.a)(i),endDate:Object(ne.a)(i)});this.setState({unsubscriptions:s,date:i,isLoading:!0}),await a({startDate:Object(ae.a)(i),endDate:Object(ne.a)(i)}),this.setState({isLoading:!1})}),this.componentWillReceiveProps=(e=>{const t=e.location,a=S(this.props.location),n=S(t);a.getTime()!==n.getTime()&&this.handleDateChange(n)}),this.handleDateChange=(async e=>{const t=this.state.unsubscriptions,a=this.props,n=a.subscribeByDate,i=a.getDataByDate;t.forEach(e=>e());const s=n({startDate:Object(ae.a)(e),endDate:Object(ne.a)(e)});this.setState({unsubscriptions:s,date:e,isLoading:!0}),await i({startDate:Object(ae.a)(e),endDate:Object(ne.a)(e)}),this.setState({isLoading:!1})}),this.undoDelete=(e=>{this.closeDeleteConfirmation(),void 0!==e&&this.props.unarchiveEntry(e)}),this.handleRemove=(e=>{this.showDeleteConfirmation(e),this.props.archiveEntry(e)}),this.showDeleteConfirmation=(e=>this.setState({reversableDelete:e})),this.closeDeleteConfirmation=(()=>this.setState({reversableDelete:void 0}))}render(){const e=this.props,t=e.onChangeEntry,a=e.feeds,i=e.nappies,s=e.sleeps,r=this.state,o=r.date,l=r.isLoading,d=r.reversableDelete;return n.createElement(n.Fragment,null,n.createElement(me.a,null,n.createElement(pe,null)),n.createElement(te,{isLoading:l,date:o,onChangeEntry:t,removeEntry:this.handleRemove,feeds:a,nappies:i,sleeps:s}),n.createElement(x.a,{anchorOrigin:{vertical:"bottom",horizontal:"left"},open:void 0!==d,autoHideDuration:6e3,onClose:this.closeDeleteConfirmation,ContentProps:{"aria-describedby":"message-id"},message:n.createElement("span",{id:"message-id"},"Note archived"),action:[n.createElement(j.a,{key:"undo",color:"primary",size:"small",onClick:()=>this.undoDelete(d)},"UNDO"),n.createElement(h.a,{key:"close","aria-label":"Close",color:"inherit",onClick:this.closeDeleteConfirmation},n.createElement(B.a,null))]}))}})),ue=a(314),ge=a(307),ye=a(306),Ee=a(291),be=a(249),fe=a(318),ve=a(63),De=a.n(ve),Se=a(311),Te=a(292),Ce=a(290),we=a(295);const Fe=Object(c.a)(Ee.a)`
  margin-bottom: 2rem !important;

  @media (max-width: 976px) {
    & {
      width: 100%;
    }
  }
`,Ie={amount:"",unit:A.Millilitres,note:"",time:void 0};var Oe=P()(class extends n.Component{constructor(...e){super(...e),this.state=Ie,this.handleSubmit=(e=>{e.preventDefault();const t=this.props,a=t.item,n=t.updateEntry,i=t.addEntry,s=t.onFinish,r=this.state,o=r.amount,l=r.unit,d=r.note,c=r.time;if(o)return a?void(a.type===W.Feed?(n(Object(L.a)({},a,{amount:o,unit:l,note:d,time:c||(new Date).getTime()})),s()):s()):(i({amount:o,unit:l,note:d,type:W.Feed,id:De()(),time:c||(new Date).getTime(),archived:!1}),void s());this.setState({error:"Must add an amount"})}),this.handleClear=(()=>{this.setState(Ie)}),this.handleDateChange=(e=>{this.setState({time:new Date(e.currentTarget.value).getTime()})}),this.handleAmountChange=(e=>{const t=e.currentTarget.value;null!=t&&this.setState({amount:t})}),this.handleUnitChange=(e=>{let t=e.currentTarget.value;switch(t){case A.Millilitres:this.setState({unit:A.Millilitres});break;case A.FluidOz:this.setState({unit:A.FluidOz});break;default:console.warn("Unrecognised unit type selected",t)}}),this.handleNoteChange=(e=>{const t=e.currentTarget.value;null!=t&&this.setState({note:t})})}componentWillMount(){const e=this.props.item;e&&e.type==W.Feed&&this.setState(Object(L.a)({},e))}render(){const e=this.state,t=e.amount,a=e.unit,i=e.note,s=e.time,r=e.error,o=s||(new Date).getTime(),l=`${Object(f.a)(o,"yyyy-MM-dd")}T${Object(f.a)(o,"HH:mm")}:00`;return n.createElement("form",{onSubmit:this.handleSubmit},n.createElement(Fe,null,n.createElement(Se.a,{style:{marginBottom:"1.5rem"},id:"datetime-local",label:"When",type:"datetime-local",value:l,InputLabelProps:{shrink:!0},onChange:this.handleDateChange,required:!0}),n.createElement("div",{style:{position:"relative"}},n.createElement(Te.a,{htmlFor:"feed-amount"},"Amount"),n.createElement(Ce.a,{style:{marginBottom:"1.5rem",width:"100%"},type:"number",value:t,id:"feed-amount",onChange:this.handleAmountChange}),null!=r&&""!=r&&n.createElement(we.a,{error:!0},r)),n.createElement(Se.a,{id:"feed-unit",label:"Unit",style:{marginBottom:"1.5rem"},SelectProps:{native:!0},select:!0,value:a,onChange:this.handleUnitChange},n.createElement("option",{key:A.FluidOz,selected:!0,value:A.FluidOz},A.FluidOz),n.createElement("option",{key:A.Millilitres,value:A.Millilitres},A.Millilitres)),n.createElement(Se.a,{id:"feed-note",label:"Note",style:{marginBottom:"1.5rem"},multiline:!0,fullWidth:!0,rowsMax:"4",value:i,onChange:this.handleNoteChange})),n.createElement("div",null,n.createElement(j.a,{type:"submit",variant:"contained",color:"secondary"},"Save")))}}),ke=a(251),je=a(313);const xe=Object(c.a)(Ee.a)`
  margin-bottom: 2rem !important;

  @media (max-width: 976px) {
    & {
      width: 100%;
    }
  }
`,Ne={isWee:!1,isPoop:!1,note:"",time:void 0};var Be=P()(class extends n.Component{constructor(...e){super(...e),this.state=Ne,this.handleSubmit=(e=>{e.preventDefault();const t=this.props,a=t.item,n=t.updateEntry,i=t.addEntry,s=t.onFinish,r=this.state,o=r.isWee,l=r.isPoop,d=r.note,c=r.time;if(o||l)return a?void(a.type===W.Nappy?(n(Object(L.a)({},a,{isWee:o,isPoop:l,note:d,time:c||(new Date).getTime()})),s()):s()):(i({isWee:o,isPoop:l,note:d,type:W.Nappy,id:De()(),time:c||(new Date).getTime(),archived:!1}),void s());this.setState({error:"Baby must've done a wee or a poo"})}),this.handleClear=(()=>{this.setState(Ne)}),this.handleDateChange=(e=>{this.setState({time:new Date(e.currentTarget.value).getTime()})}),this.handleCheckboxChange=((e,t)=>{const a=t.currentTarget.checked;"wee"!=e?this.setState({isPoop:a}):this.setState({isWee:a})}),this.handleNoteChange=(e=>{const t=e.currentTarget.value;null!=t&&this.setState({note:t})})}componentDidMount(){const e=this.props.item;e&&e.type==W.Nappy&&this.setState(Object(L.a)({},e))}render(){const e=this.state,t=e.isWee,a=e.isPoop,i=e.note,s=e.time,r=e.error,o=s||(new Date).getTime(),l=`${Object(f.a)(o,"yyyy-MM-dd")}T${Object(f.a)(o,"HH:mm")}:00`;return n.createElement("form",{onSubmit:this.handleSubmit},n.createElement(xe,null,n.createElement(Se.a,{style:{marginBottom:"1.5rem"},id:"datetime-local",label:"When",type:"datetime-local",value:l,InputLabelProps:{shrink:!0},onChange:this.handleDateChange,required:!0}),n.createElement(ke.a,{style:{marginTop:"1.5rem",marginBottom:"1.5rem"}},n.createElement(be.a,null,"Nappy contents \ud83e\udd22"),null!=r&&""!=r&&n.createElement(we.a,{error:!0},r),n.createElement(ye.a,{control:n.createElement(je.a,{checked:t,onChange:e=>this.handleCheckboxChange("wee",e),id:"is-wee-input",value:"wee"}),label:"Wee"}),n.createElement(ye.a,{control:n.createElement(je.a,{checked:a,onChange:e=>this.handleCheckboxChange("poop",e),id:"is-poop-input",value:"poop"}),label:"Poop"})),n.createElement(Se.a,{id:"nappy-note",label:"Note",style:{marginBottom:"1.5rem"},multiline:!0,fullWidth:!0,rowsMax:"4",value:i,onChange:this.handleNoteChange})),n.createElement("div",null,n.createElement(j.a,{type:"submit",variant:"contained",color:"secondary"},"Save")))}});const Le=Object(c.a)(Ee.a)`
  margin-bottom: 2rem !important;

  @media (max-width: 976px) {
    & {
      width: 100%;
    }
  }
`,We={note:"",time:void 0,endTime:0};var Ae=P()(class extends n.Component{constructor(...e){super(...e),this.state=We,this.handleSubmit=(e=>{e.preventDefault();const t=this.props,a=t.item,n=t.updateEntry,i=t.addEntry,s=t.onFinish,r=this.state,o=r.endTime,l=r.note,d=r.time;if(!a)return i({endTime:o,note:l,type:W.Sleep,id:De()(),time:d||(new Date).getTime(),archived:!1}),void s();a.type===W.Sleep?(n(Object(L.a)({},a,{endTime:o,note:l,time:d||(new Date).getTime()})),s()):s()}),this.handleDateChange=((e,t)=>{const a=t.currentTarget.value;if(""===a)return void this.setState({endTime:0});const n=new Date(a).getTime();"endTime"!==e?this.setState({time:n}):this.setState({endTime:n})}),this.handleNoteChange=(e=>{const t=e.currentTarget.value;null!=t&&this.setState({note:t})}),this.convertTimeToInputString=(e=>void 0===e?"":0===e?"":`${Object(f.a)(e,"yyyy-MM-dd")}T${Object(f.a)(e,"HH:mm")}:00`)}componentDidMount(){const e=this.props.item;e&&e.type==W.Sleep&&this.setState(Object(L.a)({},e))}render(){const e=this.state,t=e.endTime,a=e.note,i=e.time;return n.createElement("form",{onSubmit:this.handleSubmit},n.createElement(Le,{style:{marginBottom:"2rem"}},n.createElement(Se.a,{style:{marginBottom:"2rem"},id:"datetime",label:"Fell asleep",type:"datetime-local",value:this.convertTimeToInputString(i),InputLabelProps:{shrink:!0},onChange:e=>this.handleDateChange("time",e),required:!0}),n.createElement(Se.a,{style:{marginBottom:"2rem"},id:"end-datetime",label:"Woke up",type:"datetime-local",value:this.convertTimeToInputString(t),InputLabelProps:{shrink:!0},onChange:e=>this.handleDateChange("endTime",e)}),n.createElement(Se.a,{id:"sleep-note",label:"Note",style:{marginBottom:"1.5rem"},multiline:!0,fullWidth:!0,rowsMax:"4",value:a,onChange:this.handleNoteChange})),n.createElement("div",null,n.createElement(j.a,{type:"submit",variant:"contained",color:"secondary"},"Save")))}});const Me=c.a.div`
  padding: 2rem;
`,Ue=c.a.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
`;var Pe=class extends n.Component{constructor(...e){super(...e),this.state={selectedInputType:W.Feed,isEditingItem:!1},this.handleTypeChange=(({},e)=>{switch(e){case W.Feed:this.setState({selectedInputType:W.Feed});break;case W.Nappy:this.setState({selectedInputType:W.Nappy});break;case W.Sleep:this.setState({selectedInputType:W.Sleep});break;default:console.warn("Unrecognised update type selection",e),this.setState({selectedInputType:W.Feed})}}),this.handleCloseClick=(()=>{this.props.onFinish()}),this.renderLastEditDetails=(()=>{const e=this.props.item;if(void 0===e)return;const t=e.lastEdit;return void 0!==t?n.createElement(m.a,{variant:"subtitle1",color:"textSecondary"},"Last edited by ",t.email," (",Object(f.a)(t.time,"p"),")"):void 0})}componentDidMount(){const e=this.props.item;e&&this.setState({isEditingItem:!0,selectedInputType:e.type})}renderInput(){switch(this.state.selectedInputType){case W.Feed:return n.createElement(Oe,this.props);case W.Nappy:return n.createElement(Be,this.props);case W.Sleep:return n.createElement(Ae,this.props)}}render(){const e=this.state,t=e.isEditingItem,a=e.selectedInputType;return n.createElement(Me,null,n.createElement("div",{style:{marginBottom:"2.2rem"}},n.createElement(Ue,null,n.createElement(m.a,{variant:"h1",style:{fontSize:"2rem",marginBottom:"0.5rem"},display:"block"},t?"Edit":"Add"," an entry"),n.createElement(h.a,{style:{position:"absolute",top:"0.8rem",right:"0.8rem"},onClick:this.handleCloseClick,"aria-label":"Close"},n.createElement(fe.a,null))),t&&this.renderLastEditDetails()),!t&&n.createElement(Ee.a,{style:{marginBottom:"2rem"}},n.createElement(be.a,null,"Type"),n.createElement(ge.a,{"aria-label":"Type",name:"type",value:a,onChange:this.handleTypeChange},n.createElement(ye.a,{value:W.Feed,control:n.createElement(ue.a,null),label:"Feed",disabled:t}),n.createElement(ye.a,{value:W.Nappy,control:n.createElement(ue.a,null),label:"Nappy",disabled:t}),n.createElement(ye.a,{value:W.Sleep,control:n.createElement(ue.a,null),label:"Sleep",disabled:t}))),this.renderInput())}},ze=a(154),Re=a.n(ze),$e=a(315),He=a(308),Ke=a(309),qe=a(155),_e=a.n(qe);function Je(e){return i.a.createElement(He.a,Object.assign({direction:"up"},e))}const Ve=c.a.div`
  padding-right: 24px;
  padding-left: 24px;

  @media (max-width: 1280px) {
    padding-right: 18px;
    padding-left: 18px;
  }

  @media (max-width: 976px) {
    padding-right: 12px;
    padding-left: 12px;
  }
`,Ze=Object(f.a)(new Date,"yyyy-MM-dd");var Ye=Object(o.f)(class extends i.a.Component{constructor(...e){super(...e),this.state={isInitialisingFirebase:!1,isInputtingEntry:!1,isSignedIn:!1,entryBeingEdited:void 0},this.signInConfig={},this.unregisterAuthObserver=null,this.handleAddEntry=(()=>{this.setState({isInputtingEntry:!0,entryBeingEdited:void 0})}),this.handleChangeEntry=(e=>{this.setState({entryBeingEdited:e,isInputtingEntry:!0})}),this.handleFinishAdding=(()=>{this.setState({isInputtingEntry:!1})}),this.handleFinishEditing=(()=>{this.setState({isInputtingEntry:!1,entryBeingEdited:void 0})})}async componentWillMount(){window.addEventListener("beforeinstallprompt",e=>{console.log(e)});const e=this.props,t=e.history,a=e.location;null==D.a.parse(a.search).date&&t.replace(`?date=${Ze}`),this.signInConfig={signInFlow:"popup",signInOptions:[F.auth.EmailAuthProvider.PROVIDER_ID],callbacks:{signInSuccessWithAuthResult:()=>!1}},this.setState({isInitialisingFirebase:!0}),await k.initialise(),null==O.currentUser&&this.setState({isSignedIn:!1}),this.unregisterAuthObserver=O.onAuthStateChanged(e=>this.setState({isSignedIn:!!e,isInitialisingFirebase:!1}))}componentWillUnmount(){null!=this.unregisterAuthObserver&&this.unregisterAuthObserver()}render(){const e=this.state,t=e.isInitialisingFirebase,a=e.isInputtingEntry,n=e.entryBeingEdited,s=e.isSignedIn;return t?i.a.createElement("div",{style:{display:"flex",marginTop:"5rem"}},i.a.createElement(Q.a,{style:{marginRight:"auto",marginLeft:"auto"}})):s?i.a.createElement(Ve,null,i.a.createElement($e.a,{fullScreen:!0,TransitionComponent:Je,open:a&&!n,onClose:()=>this.setState({isInputtingEntry:!1})},i.a.createElement(Pe,{onFinish:this.handleFinishAdding})),i.a.createElement($e.a,{fullScreen:!0,TransitionComponent:Je,open:a&&!!n,onClose:()=>this.setState({isInputtingEntry:!1})},i.a.createElement(Pe,{onFinish:this.handleFinishEditing,item:n})),i.a.createElement(he,{onChangeEntry:this.handleChangeEntry}),i.a.createElement(Ke.a,{style:{position:"fixed",right:"1.5rem",bottom:"1.5rem"},onClick:this.handleAddEntry,color:"secondary","aria-label":"Add",classes:{}},i.a.createElement(_e.a,null))):i.a.createElement(Re.a,{uiConfig:this.signInConfig,firebaseAuth:O})}});const Ge=Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));function Qe(e,t){navigator.serviceWorker.register(e).then(e=>{e.onupdatefound=(()=>{const a=e.installing;null!=a&&(a.onstatechange=(()=>{"installed"===a.state&&(navigator.serviceWorker.controller?(console.log("New content is available and will be used when all tabs for this page are closed. See http://bit.ly/CRA-PWA."),t&&t.onUpdate&&t.onUpdate(e)):(console.log("Content is cached for offline use."),t&&t.onSuccess&&t.onSuccess(e)))}))})}).catch(e=>{console.error("Error during service worker registration:",e)})}var Xe=a(157),et=a(310),tt=a(105),at=a.n(tt),nt=a(106),it=a.n(nt),st=a(317),rt=a(156);const ot=Object(Xe.a)({palette:{primary:{light:at.a[300],main:at.a[500],dark:at.a[700]},secondary:{light:it.a[300],main:it.a[500],dark:it.a[700]},background:{default:"#f5f5f5"}}}),lt=()=>i.a.createElement("h1",null,"Oops, this page couldn't be found");r.a.render(i.a.createElement(l.a,{basename:"babba-tracker"},i.a.createElement(()=>i.a.createElement(y.b,{utils:rt.a},i.a.createElement(et.a,{theme:ot},i.a.createElement(st.a,null),i.a.createElement(C,null),i.a.createElement(o.c,null,i.a.createElement(o.a,{exact:!0,path:"/"},i.a.createElement(Ye,null)),i.a.createElement(o.a,{path:"*",component:lt})))),null)),document.getElementById("root")),function(e){if("serviceWorker"in navigator){if(new URL("/babba-tracker",window.location.href).origin!==window.location.origin)return;window.addEventListener("load",()=>{const t="/babba-tracker/service-worker.js";Ge?(function(e,t){fetch(e).then(a=>{const n=a.headers.get("content-type");404===a.status||null!=n&&-1===n.indexOf("javascript")?navigator.serviceWorker.ready.then(e=>{e.unregister().then(()=>{window.location.reload()})}):Qe(e,t)}).catch(()=>{console.log("No internet connection found. App is running in offline mode.")})}(t,e),navigator.serviceWorker.ready.then(()=>{console.log("This web app is being served cache-first by a service worker. To learn more, visit http://bit.ly/CRA-PWA")})):Qe(t,e)})}}()}},[[171,1,2]]]);
//# sourceMappingURL=main.a96496aa.chunk.js.map