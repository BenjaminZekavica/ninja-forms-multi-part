!function(){var e,t,n;!function(i){function r(e,t){return E.call(e,t)}function o(e,t){var n,i,r,o,l,s,c,a,f,u,h,d=t&&t.split("/"),m=b.map,p=m&&m["*"]||{};if(e&&"."===e.charAt(0))if(t){for(e=e.split("/"),l=e.length-1,b.nodeIdCompat&&C.test(e[l])&&(e[l]=e[l].replace(C,"")),e=d.slice(0,d.length-1).concat(e),f=0;f<e.length;f+=1)if(h=e[f],"."===h)e.splice(f,1),f-=1;else if(".."===h){if(1===f&&(".."===e[2]||".."===e[0]))break;f>0&&(e.splice(f-1,2),f-=2)}e=e.join("/")}else 0===e.indexOf("./")&&(e=e.substring(2));if((d||p)&&m){for(n=e.split("/"),f=n.length;f>0;f-=1){if(i=n.slice(0,f).join("/"),d)for(u=d.length;u>0;u-=1)if(r=m[d.slice(0,u).join("/")],r&&(r=r[i])){o=r,s=f;break}if(o)break;!c&&p&&p[i]&&(c=p[i],a=f)}!o&&c&&(o=c,s=a),o&&(n.splice(0,s,o),e=n.join("/"))}return e}function l(e,t){return function(){var n=x.call(arguments,0);return"string"!=typeof n[0]&&1===n.length&&n.push(null),d.apply(i,n.concat([e,t]))}}function s(e){return function(t){return o(t,e)}}function c(e){return function(t){g[e]=t}}function a(e){if(r(v,e)){var t=v[e];delete v[e],w[e]=!0,h.apply(i,t)}if(!r(g,e)&&!r(w,e))throw new Error("No "+e);return g[e]}function f(e){var t,n=e?e.indexOf("!"):-1;return n>-1&&(t=e.substring(0,n),e=e.substring(n+1,e.length)),[t,e]}function u(e){return function(){return b&&b.config&&b.config[e]||{}}}var h,d,m,p,g={},v={},b={},w={},E=Object.prototype.hasOwnProperty,x=[].slice,C=/\.js$/;m=function(e,t){var n,i=f(e),r=i[0];return e=i[1],r&&(r=o(r,t),n=a(r)),r?e=n&&n.normalize?n.normalize(e,s(t)):o(e,t):(e=o(e,t),i=f(e),r=i[0],e=i[1],r&&(n=a(r))),{f:r?r+"!"+e:e,n:e,pr:r,p:n}},p={require:function(e){return l(e)},exports:function(e){var t=g[e];return"undefined"!=typeof t?t:g[e]={}},module:function(e){return{id:e,uri:"",exports:g[e],config:u(e)}}},h=function(e,t,n,o){var s,f,u,h,d,b,E=[],x=typeof n;if(o=o||e,"undefined"===x||"function"===x){for(t=!t.length&&n.length?["require","exports","module"]:t,d=0;d<t.length;d+=1)if(h=m(t[d],o),f=h.f,"require"===f)E[d]=p.require(e);else if("exports"===f)E[d]=p.exports(e),b=!0;else if("module"===f)s=E[d]=p.module(e);else if(r(g,f)||r(v,f)||r(w,f))E[d]=a(f);else{if(!h.p)throw new Error(e+" missing "+f);h.p.load(h.n,l(o,!0),c(f),{}),E[d]=g[f]}u=n?n.apply(g[e],E):void 0,e&&(s&&s.exports!==i&&s.exports!==g[e]?g[e]=s.exports:u===i&&b||(g[e]=u))}else e&&(g[e]=n)},e=t=d=function(e,t,n,r,o){if("string"==typeof e)return p[e]?p[e](t):a(m(e,t).f);if(!e.splice){if(b=e,b.deps&&d(b.deps,b.callback),!t)return;t.splice?(e=t,t=n,n=null):e=i}return t=t||function(){},"function"==typeof n&&(n=r,r=o),r?h(i,e,t,n):setTimeout(function(){h(i,e,t,n)},4),d},d.config=function(e){return d(e)},e._defined=g,n=function(e,t,n){if("string"!=typeof e)throw new Error("See almond README: incorrect module build, no module name");t.splice||(n=t,t=[]),r(g,e)||r(v,e)||(v[e]=[e,t,n])},n.amd={jQuery:!0}}(),n("../lib/almond",function(){}),n("views/header",[],function(){var e=Marionette.ItemView.extend({template:"#nf-tmpl-mp-header",initialize:function(e){this.listenTo(this.collection,"change:part",this.reRender),this.listenTo(this.collection,"change:errors",this.reRender)},reRender:function(){this.model=this.collection.getElement(),this.render()},templateHelpers:function(){var e=this;return{renderBreadcrumbs:function(){var t=_.template(jQuery("#nf-tmpl-mp-breadcrumbs").html()),n=_.invoke(e.collection.getVisibleParts(),"pick",["title","errors","visible"]);return t({parts:n,currentIndex:e.collection.indexOf(e.model)})},renderProgressBar:function(){var t=_.template(jQuery("#nf-tmpl-mp-progress-bar").html()),n=e.collection.getVisibleParts().indexOf(e.model),i=n/e.collection.getVisibleParts().length*100;return t({percent:i})}}},events:{"click .nf-breadcrumb":"clickBreadcrumb"},clickBreadcrumb:function(e){e.preventDefault(),this.collection.setElement(this.collection.at(jQuery(e.target).data("index")))},test:function(){console.log("RESET ERRORS!")}});return e}),n("views/footer",[],function(){var e=Marionette.ItemView.extend({template:"#nf-tmpl-mp-footer",initialize:function(e){this.listenTo(this.collection,"change:part",this.reRender)},reRender:function(){this.model=this.collection.getElement(),this.render()},templateHelpers:function(){var e=this;return{renderNextPrevious:function(){var t=_.template(jQuery("#nf-tmpl-mp-next-previous").html()),n=!1,i=!1,r=e.collection.where({visible:!0});return r.indexOf(e.model)!=r.length-1&&(n=!0),0!=r.indexOf(e.model)&&(i=!0),n||i?t({showNext:n,showPrevious:i}):""}}}});return e}),n("views/formContent",["views/header","views/footer"],function(e,t){var n=Marionette.LayoutView.extend({template:"#nf-tmpl-mp-form-content",regions:{header:".nf-mp-header",body:".nf-mp-body",footer:".nf-mp-footer"},initialize:function(e){this.formModel=e.formModel,this.collection=e.data,this.listenTo(this.collection,"change:part",this.changePart)},onShow:function(){this.header.show(new e({collection:this.collection,model:this.collection.getElement()}));var n=i.channel("formContent").request("get:viewFilters"),r=_.without(n,void 0),o=r[1];this.formContentView=o(),this.body.show(new this.formContentView({collection:this.collection.getElement().get("formContentData")})),this.footer.show(new t({collection:this.collection,model:this.collection.getElement()}))},changePart:function(){this.body.empty(),this.body.show(new this.formContentView({collection:this.collection.getElement().get("formContentData")}))},events:{"click .nf-next":"clickNext","click .nf-previous":"clickPrevious"},clickNext:function(e){e.preventDefault(),this.collection.next()},clickPrevious:function(e){e.preventDefault(),this.collection.previous()}});return n}),n("models/partModel",[],function(){var e=Backbone.Model.extend({fieldErrors:{},defaults:{errors:!1,visible:!0,validate:!1},initialize:function(){this.listenTo(this.get("formContentData"),"change:errors",this.maybeChangeActivePart),this.fieldErrors[this.cid]=[]},maybeChangeActivePart:function(e){0<e.get("errors").length?(this.set("errors",!0),this.fieldErrors[this.cid].push(e.get("key")),this.collection.getElement()!=this&&this.collection.indexOf(this.collection.getElement())>this.collection.indexOf(this)&&this.collection.setElement(this)):(this.fieldErrors[this.cid]=_.without(this.fieldErrors[this.cid],e.get("key")),0==this.fieldErrors[this.cid].length&&this.set("errors",!1))},validateFields:function(){this.get("formContentData").validateFields()}});return e}),n("models/partCollection",["models/partModel"],function(e){var t=Backbone.Collection.extend({model:e,currentElement:!1,initialize:function(){},getElement:function(){return this.currentElement||this.setElement(this.at(0),!0),this.currentElement},setElement:function(e,t){t=t||!1,(t||!this.partErrors())&&(this.currentElement=e,t||this.trigger("change:part",this))},next:function(){return this.getVisibleParts().length-1!=this.getVisibleParts().indexOf(this.getElement())&&this.setElement(this.getVisibleParts()[this.getVisibleParts().indexOf(this.getElement())+1]),this},previous:function(){return 0!=this.getVisibleParts().indexOf(this.getElement())&&this.setElement(this.getVisibleParts()[this.getVisibleParts().indexOf(this.getElement())-1]),this},partErrors:function(){return this.currentElement.get("validate")?(this.currentElement.validateFields(),this.currentElement.get("errors")):!1},validateFields:function(){_.each(this.getVisibleParts(),function(e){e.validateFields()})},getVisibleParts:function(){return this.where({visible:!0})}});return t}),n("controllers/filters",["views/formContent","models/partCollection"],function(e,t){var n=Marionette.Object.extend({initialize:function(){i.channel("formContent").request("add:viewFilter",this.getformContentView,1),i.channel("formContent").request("add:loadFilter",this.formContentLoad,1)},getformContentView:function(t){return e},formContentLoad:function(e,n){var r=new t;return _.each(e,function(e){var t=i.channel("formContent").request("get:loadFilters"),r=_.without(t,void 0),o=r[1];e.formContentData=o(e.formContentData,n,this)}),r.add(e),r}});return n}),n("controllers/loadControllers",["controllers/filters"],function(e){var t=Marionette.Object.extend({initialize:function(){new e}});return t});var i=Backbone.Radio;t(["controllers/loadControllers"],function(e){var t=Marionette.Application.extend({initialize:function(e){this.listenTo(i.channel("form"),"after:loaded",this.loadControllers)},loadControllers:function(t){new e},onStart:function(){}}),n=new t;n.start()}),n("main",function(){})}();
//# sourceMappingURL=almond.build.js.map
//# sourceMappingURL=front-end.js.map
