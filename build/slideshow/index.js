(()=>{var t,e={757:(t,e,s)=>{"use strict";const n=window.wp.blocks,l=window.wp.blockEditor,r=window.wp.element,i=window.wp.compose,o=window.wp.data,c=JSON.parse('{"UU":"rw-blocks/slideshow","rE":"0.1.0"}'),a=JSON.parse('{"Z":[{"nm":"Flex horizontal","pt":"css/flex-h.css"},{"nm":"Flex vertical","pt":"css/flex-v.css"},{"nm":"Full viewport","pt":"css/abs.css"},{"nm":"Infinity horizontal","pt":"css/inf-h.css"},{"nm":"Infinity vertical","pt":"css/inf-v.css"},{"nm":"Simple slider dots horizontal","pt":"css/sim-dots.css"}]}'),d=window.wp.components,h=window.ReactJSXRuntime,u=({attributes:t,setAttributes:e,attributeKey:s,isCss:n=!0})=>{const l=/\./.test(s),[i,o]=(0,r.useState)(Object.entries(l?m(t,s):t[s]||{}));(0,r.useEffect)((()=>{o(Object.entries(l?m(t,s):t[s]||{}))}),[s,t]);const c=t=>{o(t);const l=t.reduce(((t,[e,s])=>{var l;return e&&(t[n&&!e.startsWith("--")?(l=e,l.replace(/-./g,(t=>t.charAt(1).toUpperCase()))):e]=s),t}),{});e({[s]:l})};return(0,h.jsxs)("div",{children:[i.map((([t,e],s)=>(0,h.jsxs)("div",{children:[["Property","Value"].map(((n,l)=>(0,h.jsx)(d.TextControl,{label:n,value:l?e:t,onChange:n=>((t,e,s)=>{const n=[...i];n[t]=[e,s],c(n)})(s,l?t:n,l?n:e)}))),(0,h.jsx)(d.Button,{isDestructive:!0,onClick:()=>(t=>{const e=[...i];e.splice(t,1),c(e)})(s),children:"Remove"})]},s))),(0,h.jsx)(d.Button,{primary:!0,onClick:()=>o([...i,["",""]]),children:"Add Property"})]})};class p extends React.Component{constructor(t){super(t),this.state={hasError:!1}}static getDerivedStateFromError(t){return{hasError:!0}}componentDidCatch(t,e){console.log("ErrorBoundary caught an error",t,e)}render(){return this.state.hasError?(0,h.jsx)("h1",{children:"Something went wrong."}):this.props.children}}function m(t,e,s,n){const l=e.split("."),r=l.pop(),i=l.reduce(((t,e)=>{var s;return t[e]=null!==(s=t[e])&&void 0!==s?s:{}}),t);if("set"===n)i[r]=s;else{if("rm"!==n||!i||!i.hasOwnProperty(r))return i[r];delete i[r]}}const x=[["rw-blocks/slide"]],f=(t,e,s,n)=>({l:t,u:e,r:s,d:n}),g={l:f("🡠","🡡","🡢","🡣"),n:f("🡨","🡩","🡪","🡫"),m:f("🡰","🡱","🡲","🡳"),h:f("🡸","🡹","🡺","🡻"),v:f("🢀","🢁","🢂","🢃"),z:f("🠸","🠹","🠺","🠻"),y:f("🡄","🡅","🡆","🡇"),x:f("⮜","⮝","⮞","⮟"),w:f("⮘","⮙","⮚","⮛"),u:f("🢔","🢕","🢖","🢗"),t:f("ᐊ","ᐃ","ᐅ","ᐁ"),s:f("⇚","⤊","⇛","⤋"),r:f("","⟰","","⟱"),q:f("","▲","","▼"),a:f("↞","↟","↠","↡"),b:f("⯬","⯭","⯮","⯯"),c:f("⮈","⮉","⮊","⮋"),d:f("«","","»",""),e:f("❮","","❯",""),f:f("❰","","❱","")},b=["","Ar","Ctrl","Mv","Nxt","Prv","Dots"],j=(t,e)=>Object.assign({},t,e);function v(t){const{attributes:e,edit:s}=t,{theme:n,anima:{tm:r,run:i,lp:c},gui:a,sldCss:d,sldAttr:u,btnIco:p}=e,m=s?(0,l.useBlockProps)():l.useBlockProps.save(),f=(t,s)=>e[`sld${t}${s?"Css":"Attr"}`],g=t=>({attr:f(t),css:f(t,1)});let v;if(u.className&&delete u.className,b.forEach((t=>f(t).class?delete t.class:0)),s&&t?.clientId)try{var y;let e=((t,e=null)=>(0,o.useSelect)((s=>{const{getBlocks:n}=s("core/block-editor");return(e?n(e):n()).filter((e=>e.name===t))}),[t,e]))("rw-blocks/slide",t?.clientId);v=null!==(y=e?.length)&&void 0!==y?y:v}catch(t){__o.log(t)}return(0,h.jsxs)(w,{attr:{...j(u,m)},cls:`rw-blocks-slideshow alignfull ${null!=n?n:""}`,cb:t=>!/^((wp-block-rw-blocks-\w+)| (w*(-blocks - slideshow)))$/.test(t),css:d,more:{anima:i?"":!!i,tm:r,lp:c?"":!!c,control:a?"":null,theme:n&&""!=n?n:null},children:[(0,h.jsx)(w,{cls:"slides-area",...g("Ar"),children:s?(0,h.jsx)(l.InnerBlocks,{template:x,allowedBlocks:x[0]}):(0,h.jsx)(l.InnerBlocks.Content,{})}),(0,h.jsxs)(w,{cls:"slide-ctrl",...g("Ctrl"),children:[(0,h.jsx)(w,{cls:"slide-mv",...g("Mv"),children:[["prev","Prv"],["next","Nxt"]].map(((t,s)=>(0,h.jsx)(w,{cls:t[0],more:a?{"aria-label":t[0]+" slide"}:{},...g(t[1]),children:a?(0,h.jsx)("span",{children:e[`${t[0]}Btn`][p.split("")[s]]}):""})))}),(0,h.jsx)(w,{cls:"slide-dots",more:a?{"aria-label":"Slide navigation"}:{},...g("Dots"),children:v&&a&&s?Array.from({length:v},(()=>(0,h.jsx)("div",{className:"dot"}))):null})]})]})}function y({attributes:t,edit:e}){const s=(e,s)=>({cls:"slide"+e,attr:t[`sld${s}Attr`],css:t[`sld${s}Css`]});return(0,h.jsx)(w,{...s("",""),children:(0,h.jsx)(w,{...s("-content","Ar"),children:e?(0,h.jsx)(l.InnerBlocks,{}):(0,h.jsx)(l.InnerBlocks.Content,{})})})}function w({attr:t={},cls:e="",cb:s,css:n={},children:l,more:r={}}){return(0,h.jsx)("div",{...t,className:((t,e,s)=>{const n=e?.className?.split(/\s+/g);return l=t,r="function"==typeof s&&Array.isArray(n)?n?.filter(s):s,l.split(" ").concat(r).join(" ");var l,r})(e,t,s).trim(),style:n,...r,children:l})}const k=new Map;function C(t){const{attributes:e,setAttributes:s,parentIndex:n,parentNode:i,slideCount:o}=t,[c,a]=(0,r.useState)("l");return(0,r.useEffect)((()=>{var s=t.name.split("/");if(__o.utils.type(e.theme,"emp"))return;var n,l,r=t.name.replace("/","-")+"-"+e.theme;_c("#"+r).gt||(n=`/wp-content/plugins/${s[0]}/build/${s[1]}/css/${e.theme}.css`,l=r,_c(document.head).append("link",{id:l,href:n,rel:"stylesheet"}));let i=Object.entries(g).reduce(((t,[s,n])=>{var l;let r=null!==(l=e.nextBtn)&&void 0!==l?l:e.prevBtn;return r.l==n.l&&r.u==n.u&&r.r==n.r&&r.d==n.d&&(t=s),t}),"");a(i)})),(0,h.jsx)(l.InspectorControls,{children:(0,h.jsxs)("div",{style:{padding:"0 1.3em"},children:[(0,h.jsxs)("p",{children:["parentId ",n]}),(0,h.jsxs)("p",{children:["slideCount ",o]}),(0,h.jsx)("hr",{}),(0,h.jsx)(d.SelectControl,{label:"Slideshow layouts",value:e.theme,options:Array.from(k).map((([t,e])=>({label:e.nm,value:e.pt}))),onChange:t=>s({theme:t,sldAttr:{...e.sldAttr,theme:t}})}),(0,h.jsxs)("div",{className:"flex-opt",children:[(0,h.jsx)(d.ToggleControl,{label:"GUI",checked:!!e.gui,onChange:t=>s({gui:t?1:0}),__nextHasNoMarginBottom:!0}),(0,h.jsxs)("div",{style:{display:"flex",alignItems:" stretch",justifyContent:"center"},children:[(0,h.jsx)("span",{style:{marginRight:"1em"},children:"LR"}),(0,h.jsx)(d.ToggleControl,{label:"UD",checked:"ud"==e.btnIco,onChange:t=>s({btnIco:t?"ud":"lr"})})]})]}),e.gui?(0,h.jsx)(d.SelectControl,{label:"Slideshow Arrow",value:c,options:Object.entries(g).map((t=>({label:Object.values(t[1]).join(" "),value:t[0],id:t[0]}))),onChange:(t,e)=>(a(t),s({nextBtn:g[t],prevBtn:g[t]}))}):(0,h.jsx)(h.Fragment,{}),(0,h.jsx)("hr",{}),(0,h.jsx)("div",{className:"flex-opt",children:["run","lp"].map((t=>(0,h.jsx)(d.ToggleControl,{label:"lp"==t?"loop":"animation",checked:e.anima[t]?1:0,onChange:n=>s({anima:{...e.anima,[t]:n?1:0}})})))}),(0,h.jsx)(d.TextControl,{label:"Duration per slide (sec)",value:e.anima.tm||"",placeholder:"default",type:"number",onChange:t=>s({anima:{...e.anima,tm:t}})}),(0,h.jsx)(d.PanelBody,{initialOpen:!1,title:"Styling",children:(0,h.jsx)(d.TabPanel,{tabs:[{title:"slide show",name:"show",css:""},{title:"slides area",name:"area",css:"a"},{title:"slide",name:"slide",css:"b"},{title:"slide content",name:"content",css:"c"},{title:"slide ctrl",name:"ctrl",css:"z"}],children:t=>{const n=e=>""==t.css?e:`--sld-${t.css}${e[0]}`;return(0,h.jsxs)("div",{children:[(0,h.jsxs)("div",{style:{fontWeight:"bold",textTransform:"uppercase",margin:"11px 0 0 0",fontSize:"12px}"},children:[t.title," "]}),(0,h.jsx)("div",{children:"Make sure to add the units"}),(0,h.jsx)("hr",{}),["height","width"].map((t=>{var l;return(0,h.jsx)(d.TextControl,{label:t,value:null!==(l=e.sldCss[n(t)])&&void 0!==l?l:"",placeholder:"default",onChange:l=>s({sldCss:{...e.sldCss,[n(t)]:l}})})}))]})}})}),(0,h.jsx)(A,{tabs:[...[["slide-show","slide"],["slides-area","area","Ar"],["slide-ctrl","ctrl","Ctrl"],["slide-mv","mv-area","Mv"],["next","next","Nxt"],["prev","prev","Prv"],["slide-dots","dots-area","Dots"]].map((t=>((t,n,l="")=>({title:t,name:n,sattr:s,attr:e,ky:l}))(...t)))]}),(0,h.jsxs)(d.PanelBody,{initialOpen:!1,title:"Import json block config",children:[(0,h.jsx)(d.TextControl,{label:"json config/props",onChange:t=>s({ijson:t})}),(0,h.jsx)("i",{style:{color:"red",marginBottom:"1.3em"},children:"will override"}),(0,h.jsx)(d.Button,{style:{border:"1px black solid"},onClick:()=>e.ijson.length?function(t,e){const{setAttributes:s}=e;let n;try{n=JSON.parse(t),s({...n})}catch(t){console.log("Not a valid json",t)}}(e.ijson,t):0,children:"Import Json Props"})]}),(0,h.jsx)(_,{attr:e})]})})}function _(t){const{attr:e,sattr:s}=t;return(0,h.jsx)(d.PanelBody,{initialOpen:!1,title:"Log props to console",children:(0,h.jsx)("div",{style:{width:"100%",textAlign:"center"},children:[["props to console","object",()=>console.log(e)],["props as json","json",()=>console.log(JSON.stringify(e))]].map((t=>(0,h.jsx)(d.Button,{name:"Print "+t[0],onClick:t[2],style:{width:"50%",justifyContent:"center",border:"1px black solid"},children:t[1]})))})})}function B({attributes:t,setAttributes:e,rtKey:s,skey:n,show:l,title:r,view:i}){var o;const c=l=>e({[s]:{...t[s],[n]:l}}),a={border:" 1px solid black",margin:"0px auto",alignItems:"stretch"};return(0,h.jsxs)(h.Fragment,{children:[(0,h.jsxs)(d.Button,{onClick:l,style:a,children:[(0,h.jsx)(d.ColorIndicator,{colorValue:null!==(o=t[s][n])&&void 0!==o?o:""}),(0,h.jsx)("div",{style:{marginLeft:"6px"},children:r})]}),i&&(0,h.jsxs)(d.Popover,{onFocusOutside:l,children:[(0,h.jsx)(d.TabPanel,{tabs:[{title:"solid",name:"slide"},{title:"gradient",name:"content"}],children:({name:e})=>{var l;return(0,h.jsx)(d.PanelBody,{children:"slide"==e?(0,h.jsx)(d.ColorPicker,{enableAlpha:!0,style:{height:"fit-content"},onChange:c}):(0,h.jsx)(d.GradientPicker,{onChange:c,value:/^(l|r)/.test(null!==(l=t[s][n])&&void 0!==l?l:"")?t[s][n]:null})})}}),(0,h.jsx)(d.Button,{onClick:l=>(delete t[s][n],e({[s]:{...t[s]}})),style:{...a},children:"remove"})]})]})}function A({tabs:t}){return(0,h.jsxs)(d.PanelBody,{initialOpen:!1,title:"Exterme Adv.",children:[(0,h.jsxs)("p",{style:{color:"red"},children:["You have access to ",(0,h.jsx)("strong",{children:"add|remove"})," any react prop procced with caution"]}),(0,h.jsx)(d.TabPanel,{tabs:t,children:I})]})}function I({name:t,title:e,attr:s,sattr:n,ky:l=""}){return(0,h.jsx)(d.Panel,{children:[["Styles","Set css using JS Api name","Css"],["Attributes","!! Set React props there is no safeguard !!","Attr"]].map(((t,e)=>(0,h.jsxs)(d.PanelBody,{title:t[0],initialOpen:!1,children:[(0,h.jsx)("div",{style:{color:"red"},children:t[1]}),(0,h.jsx)("br",{}),(0,h.jsx)(u,{attributes:s,setAttributes:n,attributeKey:`sld${l}${t[2]}`,isCss:0==e})]},e)))})}a.Z.map((t=>k.set(t.nm,(t.pt=t.pt.split("/")[1].split(".")[0],t)))),s(490);const N=(t,e="object")=>({type:e,default:t}),O=({i:t,c:e,a:s}={})=>N({css:null!=e?e:{},attr:null!=s?s:{},ico:t}),S=(t,e)=>Object.fromEntries(t.map(e)),P=["Css","Attr"].map((t=>S(b,(e=>[`sld${e}${t}`,N({})])))).reduce(((t,e)=>({...t,...e})),{}),$={theme:N("","string"),...P,sldType:N({}),nextBtn:N(g.l),prevBtn:N(g.l),btnIco:N("lr","string"),gui:N(1,"bool"),anima:N({run:0,tm:0,lp:0}),ijson:N("","string")};(0,n.registerBlockType)(c.UU,{attributes:$,edit(t){const{attributes:e,setAttributes:s,parentIndex:n,parentNode:l,slideCount:r}=t;return(0,h.jsxs)(p,{children:[(0,h.jsx)(C,{...t}),(0,h.jsx)(v,{...t,edit:1})]})},save:t=>(0,h.jsx)(v,{...t})}),(0,n.registerBlockType)("rw-blocks/slide",{title:"slide",version:c.rE,description:"Slide for slideshow",category:"rw-blocks",icon:"slides",parent:c.UU,attributes:{...S(["Sld","Area"],(t=>[t,O()])),...S(["","Ar"],(t=>[`sld${t}Css`,N({})])),...S(["","Ar"],(t=>[`sld${t}Attr`,N({})]))},edit:(0,i.compose)((0,o.withSelect)(((t,e)=>{const{getBlockOrder:s,getBlockIndex:n,getBlockParentsByBlockName:l,getBlocks:r,getBlocksByName:i,getBlockName:o}=t("core/block-editor"),{clientId:c}=e,a=i("rw-blocks/slideshow"),d=l(c,"rw-blocks/slideshow"),h=d.length,u=h?d[0]:-1,p=h?a.findIndex((t=>t===u)):null,m=s(u);return{prtIdx:p,prtNode:h?a[p]:null,sldCnt:h?m.filter((t=>"rw-blocks/slide"===o(t))).length:0,sldIdx:d.length?m.findIndex((t=>t===c)):null,sldshowIdx:p}})))((function(t){const{attributes:e,setAttributes:s,prtIdx:n,prtNode:i,sldCnt:o,sldIdx:c}=t,[a,d]=(0,r.useState)({sld:!1,sldAr:!1});return(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)(l.InspectorControls,{children:(0,h.jsxs)("div",{style:{padding:"1.2em"},children:[(0,h.jsxs)("p",{children:["slideshowIdx: ",n]}),(0,h.jsxs)("p",{children:["sldIdx: ",c]}),(0,h.jsxs)("p",{children:["slideCount: ",o]}),(0,h.jsx)("hr",{}),(0,h.jsxs)("div",{style:{display:"block"},children:[(0,h.jsx)("p",{children:"Base Background"}),[["","",a.sld],[" Content","Ar",a.sldAr]].map((t=>(0,h.jsx)(B,{attributes:e,setAttributes:s,title:"Slide"+t[0],rtKey:`sld${t[1]}Css`,skey:"background",show:e=>d({...a,[`sld${t[1]}`]:!t[2]}),view:t[2]})))]}),(0,h.jsx)(A,{tabs:[["slide","slide"],["content","content","Ar"]].map((t=>((t,n,l="")=>({title:t,name:n,sattr:s,attr:e,ky:l}))(...t)))}),(0,h.jsx)(_,{attr:e})]})}),(0,h.jsx)(y,{attributes:e,edit:!0})]})})),save:y})},490:()=>{"undefined"==typeof _ui&&(_ui={});const t={h:"100%",w:"100%",gu:1,th:["loop-js","loop","once","ftbk"],dot:"div",lp:0,an:0,dur:5e3,css:{slideSection:{},slidesArea:{},slide:{},slideContent:{},slideCtrl:{},slideMv:{},next:{},prev:{},slideDots:{},slideDot:{}},nxt:"<",prv:">",act:{f:"done",a:"act",r:"bk"}},{utils:{type:e},log:s}=__o;class n{static len=0;static shows={};#t=0;#e=0;get astop(){return this.#t}constructor(e,s){this.rt=e,this.idx=s;let r=_c(e);this.attr=r.nattr(["sldcf","theme","anima","tm","lp","control","class"]),function(e){var s;const{attr:n,rt:l}=e;e.cf=n.sldcf&&null!==(s=_c(n.sldcf).json("p"))&&void 0!==s?s:{};let r=["h","w","css"];for(let[s,n]of Object.entries(t))Object.hasOwn(e.cf,s)||r.includes(s)||(e.cf[s]=n)}(this);let o=this.attr;n.shows[s]&&!n.shows[s]?.rt.isSameNode(e)&&(this.anima(!1),delete n.shows[s]),n.shows[s]=this,o.tm&&e.style.setProperty("--sld-da",o.tm+"s");const c=_c(e).qy(".slide").gt?.parentNode,a=c?.children;if(a&&!this.cur&&(this.cur={idx:0,el:a[0]},_c(a[0]).class("add","act"),this.Anima={a:l(a[0])}),c.sbx=this,this.sld=a,this.dot=r.qy(".slide-dots").gt,(o.control||__o.utils.type(o?.control,"str"))&&this.cf.gu&&(!__o.utils.type(o?.control,"emp")||(o.control=!0),["next","prev"].forEach((t=>{let s=_c(e).qy("."+t);s.gt.children.length&&s.on("click",this[t].bind(this))})),this.dots(),_c(this.dot).on("click",this.#s.bind(this))),o.class=o.class.split(" "),o.class.includes("inf-h")||o.class.includes("inf-v")){if(o.theme=o.class.filter((t=>i("inf-[vh]",t)))[0],i("inf-h",o.theme)){if(c.scrollLeft<=_o.hw().w){let t=[];for(let e of a)t.push(e.cloneNode(!0));1==t.length&&t.push(t[0].cloneNode(!0)),c.append(...t)}!function(t,e,s="--sld-dml"){const{left:n}=_c(e).rect,l=_c(t).gcs(null,"marginLeft"),r=n-(parseFloat(l)||0)-40;t.parentNode.style.setProperty(s,`-${r}px`)}(a[0],a[1])}this.anima(1)}}next(t){const{cur:{idx:e},sld:s,attr:{lp:n},idx:l}=this;if(e==s.length-1&&__o.utils.type(n,"unu"))return this.#e?this.anima():0;this.goto(e<s.length-1?e+1:0)}prev(){const{cur:{idx:t},sld:e,attr:{lp:s}}=this;if(!t&&__o.utils.type(s,"unu"))return this.#e?this.anima():0;this.goto(t?t-1:e.length-1)}goto(t){const{sld:e,cur:{el:n},cf:{act:l}}=this,r=Array.from(e).findIndex((t=>t.isSameNode(n)));if(r!=(t=parseInt(t))&&t>-1&&t<e.length){const i=this.cur={el:e[t],idx:t},o=this.#n.bind(this),c=r>=t+1&&e.length-1>=t+1;r>t&&_c(n).class("add",l.r);for(let s=0;s<t;s++)_c(e[s]).class().contains("done")||o(s,{add:l.f,remove:[l.a,l.r]});let a={add:[l.a,c?l.r:0].filter((t=>t)),remove:[l.f,c?0:l.r].filter((t=>t))};s(r,t),o(t,a);for(let s=t+1;s<e.length;s++)e[s].isSameNode(i.el)||o(s,{remove:[l.a,l.f,c?0:l.r].filter((t=>t))})}}#s(t){const e=t.target,s=t=>e.classList.contains(t);if(!s("dot"))return;if(s("act"))return;const n=this.dot.children;for(let t=0;t<n.length;t++)if(n[t]==e)return this.goto(t)}static init(){const t=_c(document).all(".rw-blocks-slideshow");n.len=t.length;for(let e=0;e<t.length;e++)new n(t[e],e)}anima(t,e){const{attr:{theme:s},sld:n}=this;if(/(icon|(inf-[hv]))/.test(s))t?(_c(n[0].parentNode).on("transitionend",o),this.goto(1)):this.#t=1;else{if(this.#e&&(clearInterval(this.#e),this.#e=null),!t)return;this.#e=setInterval(this.next.bind(this),this.tm=e)}}#n=r.bind(this);dots(){const{dot:{children:t},sld:e}=this,s=__o.mknode(__o.mkEl(".dot",{})),n="length",l=t=>t[n];if(e){if(l(t)<l(e))this.dot.append(...Array.from({[n]:l(e)-l(t)},(()=>s.cloneNode())));else if(l(t)>l(e))for(let s=l(e);s<l(t);s++)t[s].remove();for(let s=0;s<l(e);s++)_c(e[s]).class().contains("act")&&(this.cur={idx:s,el:e[s]},_c(t[s]).class("add","act"));this.cur||(this.cur={idx:0,el:e[0]},this.#n(0,{add:"act"}))}}}function l(t){const s=e,n=s(t,"inst",__o)?t:_c(t),[l,r]=["anima","transi"].map((t=>n.gcs(null,t+"tion")));return{anima:!s(l,"emp"),trans:!s(r,"emp")}}function r(t,e){const{sld:s,dot:{children:n},attr:{control:l}}=this,r=_c(s[t]).class(e);l&&r._(n[t]).class(e)}function i(t,e){return new RegExp(`^(${t})$`).test(e)}function o(t){let e=t.target;if(!e.classList.contains("slide"))return;const{attr:s,astop:n,cur:l,sld:r,ani:i}=this.sbx;var c;"inf-h"==s.theme?(e.parentNode.append(e),_c(e).class("remove","done"),n?_c(this).off("transitionend",o):this.sbx.goto(1)):(!n&&"margin-top"==t.propertyName&&(c=this.sbx[l.idx==r.length-1?"goto":"next"]),c&&setTimeout(c.bind(this.sbx,0),1e3*t.elapsedTime))}_c(document).on("DOMContentLoaded",n.init),_ui.slideBox=n}},s={};function n(t){var l=s[t];if(void 0!==l)return l.exports;var r=s[t]={exports:{}};return e[t](r,r.exports,n),r.exports}n.m=e,t=[],n.O=(e,s,l,r)=>{if(!s){var i=1/0;for(d=0;d<t.length;d++){for(var[s,l,r]=t[d],o=!0,c=0;c<s.length;c++)(!1&r||i>=r)&&Object.keys(n.O).every((t=>n.O[t](s[c])))?s.splice(c--,1):(o=!1,r<i&&(i=r));if(o){t.splice(d--,1);var a=l();void 0!==a&&(e=a)}}return e}r=r||0;for(var d=t.length;d>0&&t[d-1][2]>r;d--)t[d]=t[d-1];t[d]=[s,l,r]},n.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),(()=>{var t={279:0,544:0,880:0};n.O.j=e=>0===t[e];var e=(e,s)=>{var l,r,[i,o,c]=s,a=0;if(i.some((e=>0!==t[e]))){for(l in o)n.o(o,l)&&(n.m[l]=o[l]);if(c)var d=c(n)}for(e&&e(s);a<i.length;a++)r=i[a],n.o(t,r)&&t[r]&&t[r][0](),t[r]=0;return n.O(d)},s=globalThis.webpackChunkrw_blocks=globalThis.webpackChunkrw_blocks||[];s.forEach(e.bind(null,0)),s.push=e.bind(null,s.push.bind(s))})();var l=n.O(void 0,[880],(()=>n(757)));l=n.O(l)})();