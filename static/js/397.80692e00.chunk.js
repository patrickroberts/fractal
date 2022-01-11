!function(){"use strict";var e={397:function(e,t,n){var r={};n.r(r),n.d(r,{render:function(){return x},setup:function(){return z}});var i,u,p=n(196),o=n(324);(i||(i={})).validate=function(e,t){if("object"!==typeof e||null===e)return t.push(["input",e,'object \n  with properties\n    - "width": \n        type: number\n    - "height": \n        type: number\n    - "zoom": \n        type: number\n    - "center": \n        type: string\n    - "julia" (optional): \n        type: string\n    - "iterate": \n        type: string\n    - "iterations": \n        type: number\n    - "escape": \n        type: number\n    - "seed": \n        type: string\n    - "red": \n        type: string\n    - "green": \n        type: string\n    - "blue": \n        type: string']),!1;var n=!0;return"number"!==typeof e.width&&(t.push(['input["width"]',e.width,"type: number"]),n=!1),"number"!==typeof e.height&&(t.push(['input["height"]',e.height,"type: number"]),n=!1),"number"!==typeof e.zoom&&(t.push(['input["zoom"]',e.zoom,"type: number"]),n=!1),"string"!==typeof e.center&&(t.push(['input["center"]',e.center,"type: string"]),n=!1),void 0!==e.julia&&"string"!==typeof e.julia&&(t.push(['input["julia"]',e.julia,"type: string"]),n=!1),"string"!==typeof e.iterate&&(t.push(['input["iterate"]',e.iterate,"type: string"]),n=!1),"number"!==typeof e.iterations&&(t.push(['input["iterations"]',e.iterations,"type: number"]),n=!1),"number"!==typeof e.escape&&(t.push(['input["escape"]',e.escape,"type: number"]),n=!1),"string"!==typeof e.seed&&(t.push(['input["seed"]',e.seed,"type: string"]),n=!1),"string"!==typeof e.red&&(t.push(['input["red"]',e.red,"type: string"]),n=!1),"string"!==typeof e.green&&(t.push(['input["green"]',e.green,"type: string"]),n=!1),"string"!==typeof e.blue&&(t.push(['input["blue"]',e.blue,"type: string"]),n=!1),n},(u||(u={})).validate=function(e,t){if("object"!==typeof e||null===e)return t.push(["input",e,'object \n  with properties\n    - "width": \n        type: number\n    - "height": \n        type: number\n    - "zoom": \n        type: number\n    - "center": \n        type: string\n    - "julia" (optional): \n        type: string\n    - "iterate": \n        type: string\n    - "iterations": \n        type: number\n    - "escape": \n        type: number\n    - "seed": \n        type: string\n    - "red": \n        type: string\n    - "green": \n        type: string\n    - "blue": \n        type: string']),!1;var n=!0;return"number"!==typeof e.width&&(t.push(['input["width"]',e.width,"type: number"]),n=!1),"number"!==typeof e.height&&(t.push(['input["height"]',e.height,"type: number"]),n=!1),"number"!==typeof e.zoom&&(t.push(['input["zoom"]',e.zoom,"type: number"]),n=!1),"string"!==typeof e.center&&(t.push(['input["center"]',e.center,"type: string"]),n=!1),void 0!==e.julia&&"string"!==typeof e.julia&&(t.push(['input["julia"]',e.julia,"type: string"]),n=!1),"string"!==typeof e.iterate&&(t.push(['input["iterate"]',e.iterate,"type: string"]),n=!1),"number"!==typeof e.iterations&&(t.push(['input["iterations"]',e.iterations,"type: number"]),n=!1),"number"!==typeof e.escape&&(t.push(['input["escape"]',e.escape,"type: number"]),n=!1),"string"!==typeof e.seed&&(t.push(['input["seed"]',e.seed,"type: string"]),n=!1),"string"!==typeof e.red&&(t.push(['input["red"]',e.red,"type: string"]),n=!1),"string"!==typeof e.green&&(t.push(['input["green"]',e.green,"type: string"]),n=!1),"string"!==typeof e.blue&&(t.push(['input["blue"]',e.blue,"type: string"]),n=!1),n};var a,s,c,f,y,l,g,h,d,m,b,v,j,w=function(e){var t=[];if(!function(e,t){return u.validate(e,t)||i.validate(e,t)}(e,t)){var n=(0,o.Z)(t[0],3),r=n[0],p=n[1],a=n[2];throw new TypeError("Expected ".concat(r," to be ").concat(a,"; got ").concat(p))}return e},z=function(e){u.validate(e,[])||(i.validate(e,[])||w(e),e={width:e.width,height:e.height,zoom:e.zoom,center:e.center,julia:e.c,iterate:e.iterate,iterations:e.iterations,escape:e.escape,seed:"2*pi*(n-(".concat(e.potential,"))/N"),red:"255/2*(sin(seed)+1)",green:"255/2*(sin(seed+2*pi/3)+1)",blue:"255/2*(sin(seed+4*pi/3)+1)"});var t={re:function(e){return(0,p.cartesian)(e.real,0)},im:function(e){return(0,p.cartesian)(e.imag,0)},abs:function(e){return(0,p.cartesian)(e.abs,0)},arg:function(e){return(0,p.cartesian)(e.arg,0)}};a=e.width,s=e.height,c=e.zoom,f=(0,p.compile)(e.center)(),l=(0,p.compile)(e.iterate,t),g=e.iterations,h=e.escape*e.escape,t.N=(0,p.cartesian)(g,0),d=(0,p.compile)(e.seed,t),m=(0,p.compile)(e.red,t),b=(0,p.compile)(e.green,t),v=(0,p.compile)(e.blue,t),y=void 0===e.julia?e.julia:(0,p.compile)(e.julia)()},x=function(e){for(var t=e.length,n=e.x,r=e.y,i=a/2,u=s/2,o=new ImageData(t,1),j=o.data,w=f,z=w.real,x=w.imag,O={c:y},k={},S={},M=0;M<t;++M){var P=0;for(O.z=(0,p.cartesian)(z+(n+M-i)/c,x+(r-u)/c),y||(O.c=O.z);P<g&&!(O.z.norm>h);)O.z=l(O),++P;P<g&&(k.z=O.z,k.n=(0,p.cartesian)(P,0),S.seed=d(k),j[4*M]=m(S).real,j[4*M+1]=b(S).real,j[4*M+2]=v(S).real),j[4*M+3]=255}return o},O=n(861),k=n(757),S=n.n(k);!function(e){e[e.resolve=0]="resolve",e[e.reject=1]="reject"}(j||(j={}));var M=[],P=function(){return M},_={};!function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:_,n=function(){var n=(0,O.Z)(S().mark((function n(r){var i,u,p,o,a,s,c,f;return S().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return i=r.data,u=i[0],p=i[1],o=i[2],a=e[u],s=t[u],c=void 0===s?P:s,n.prev=3,n.next=6,a.apply(void 0,o);case 6:f=n.sent,postMessage([p,j.resolve,f],c(f)),n.next=13;break;case 10:n.prev=10,n.t0=n.catch(3),postMessage([p,j.reject,n.t0]);case 13:case"end":return n.stop()}}),n,null,[[3,10]])})));return function(e){return n.apply(this,arguments)}}();addEventListener("message",n)}(r,{render:function(e){return[e.data.buffer]}})}},t={};function n(r){var i=t[r];if(void 0!==i)return i.exports;var u=t[r]={exports:{}};return e[r].call(u.exports,u,u.exports,n),u.exports}n.m=e,n.x=function(){var e=n.O(void 0,[914],(function(){return n(397)}));return e=n.O(e)},function(){var e=[];n.O=function(t,r,i,u){if(!r){var p=1/0;for(c=0;c<e.length;c++){r=e[c][0],i=e[c][1],u=e[c][2];for(var o=!0,a=0;a<r.length;a++)(!1&u||p>=u)&&Object.keys(n.O).every((function(e){return n.O[e](r[a])}))?r.splice(a--,1):(o=!1,u<p&&(p=u));if(o){e.splice(c--,1);var s=i();void 0!==s&&(t=s)}}return t}u=u||0;for(var c=e.length;c>0&&e[c-1][2]>u;c--)e[c]=e[c-1];e[c]=[r,i,u]}}(),n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,{a:t}),t},n.d=function(e,t){for(var r in t)n.o(t,r)&&!n.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},n.f={},n.e=function(e){return Promise.all(Object.keys(n.f).reduce((function(t,r){return n.f[r](e,t),t}),[]))},n.u=function(e){return"static/js/"+e+".95eface2.chunk.js"},n.miniCssF=function(e){},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.p="/fractal/",function(){var e={397:1};n.f.i=function(t,r){e[t]||importScripts(n.p+n.u(t))};var t=self.webpackChunkfractal=self.webpackChunkfractal||[],r=t.push.bind(t);t.push=function(t){var i=t[0],u=t[1],p=t[2];for(var o in u)n.o(u,o)&&(n.m[o]=u[o]);for(p&&p(n);i.length;)e[i.pop()]=1;r(t)}}(),function(){var e=n.x;n.x=function(){return n.e(914).then(e)}}();n.x()}();
//# sourceMappingURL=397.80692e00.chunk.js.map