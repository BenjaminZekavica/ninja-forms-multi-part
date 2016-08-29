!function(){var e,t,n;!function(i){function r(e,t){return y.call(e,t)}function l(e,t){var n,i,r,l,o,a,s,c,d,u,h,f=t&&t.split("/"),p=w.map,g=p&&p["*"]||{};if(e&&"."===e.charAt(0))if(t){for(e=e.split("/"),o=e.length-1,w.nodeIdCompat&&j.test(e[o])&&(e[o]=e[o].replace(j,"")),e=f.slice(0,f.length-1).concat(e),d=0;d<e.length;d+=1)if(h=e[d],"."===h)e.splice(d,1),d-=1;else if(".."===h){if(1===d&&(".."===e[2]||".."===e[0]))break;d>0&&(e.splice(d-1,2),d-=2)}e=e.join("/")}else 0===e.indexOf("./")&&(e=e.substring(2));if((f||g)&&p){for(n=e.split("/"),d=n.length;d>0;d-=1){if(i=n.slice(0,d).join("/"),f)for(u=f.length;u>0;u-=1)if(r=p[f.slice(0,u).join("/")],r&&(r=r[i])){l=r,a=d;break}if(l)break;!s&&g&&g[i]&&(s=g[i],c=d)}!l&&s&&(l=s,a=c),l&&(n.splice(0,a,l),e=n.join("/"))}return e}function o(e,t){return function(){var n=b.call(arguments,0);return"string"!=typeof n[0]&&1===n.length&&n.push(null),f.apply(i,n.concat([e,t]))}}function a(e){return function(t){return l(t,e)}}function s(e){return function(t){m[e]=t}}function c(e){if(r(v,e)){var t=v[e];delete v[e],C[e]=!0,h.apply(i,t)}if(!r(m,e)&&!r(C,e))throw new Error("No "+e);return m[e]}function d(e){var t,n=e?e.indexOf("!"):-1;return n>-1&&(t=e.substring(0,n),e=e.substring(n+1,e.length)),[t,e]}function u(e){return function(){return w&&w.config&&w.config[e]||{}}}var h,f,p,g,m={},v={},w={},C={},y=Object.prototype.hasOwnProperty,b=[].slice,j=/\.js$/;p=function(e,t){var n,i=d(e),r=i[0];return e=i[1],r&&(r=l(r,t),n=c(r)),r?e=n&&n.normalize?n.normalize(e,a(t)):l(e,t):(e=l(e,t),i=d(e),r=i[0],e=i[1],r&&(n=c(r))),{f:r?r+"!"+e:e,n:e,pr:r,p:n}},g={require:function(e){return o(e)},exports:function(e){var t=m[e];return"undefined"!=typeof t?t:m[e]={}},module:function(e){return{id:e,uri:"",exports:m[e],config:u(e)}}},h=function(e,t,n,l){var a,d,u,h,f,w,y=[],b=typeof n;if(l=l||e,"undefined"===b||"function"===b){for(t=!t.length&&n.length?["require","exports","module"]:t,f=0;f<t.length;f+=1)if(h=p(t[f],l),d=h.f,"require"===d)y[f]=g.require(e);else if("exports"===d)y[f]=g.exports(e),w=!0;else if("module"===d)a=y[f]=g.module(e);else if(r(m,d)||r(v,d)||r(C,d))y[f]=c(d);else{if(!h.p)throw new Error(e+" missing "+d);h.p.load(h.n,o(l,!0),s(d),{}),y[f]=m[d]}u=n?n.apply(m[e],y):void 0,e&&(a&&a.exports!==i&&a.exports!==m[e]?m[e]=a.exports:u===i&&w||(m[e]=u))}else e&&(m[e]=n)},e=t=f=function(e,t,n,r,l){if("string"==typeof e)return g[e]?g[e](t):c(p(e,t).f);if(!e.splice){if(w=e,w.deps&&f(w.deps,w.callback),!t)return;t.splice?(e=t,t=n,n=null):e=i}return t=t||function(){},"function"==typeof n&&(n=r,r=l),r?h(i,e,t,n):setTimeout(function(){h(i,e,t,n)},4),f},f.config=function(e){return f(e)},e._defined=m,n=function(e,t,n){if("string"!=typeof e)throw new Error("See almond README: incorrect module build, no module name");t.splice||(n=t,t=[]),r(m,e)||r(v,e)||(v[e]=[e,t,n])},n.amd={jQuery:!0}}(),n("../lib/almond",function(){}),n("models/partModel",[],function(){var e=Backbone.Model.extend({defaults:{formContentData:[],order:0,type:"part",clean:!0,title:"Part Title"},initialize:function(){this.on("change:title",this.unclean),this.filterFormContentData(),this.listenTo(this.get("formContentData"),"change:order",this.sortFormContentData);var e=i.channel("fields").request("get:collection");this.listenTo(e,"remove",this.triggerRemove)},unclean:function(){this.set("clean",!1)},sortFormContentData:function(){this.get("formContentData").sort()},triggerRemove:function(e){jQuery.isArray(this.get("formContentData"))&&this.filterFormContentData(),this.get("formContentData").trigger("remove:field",e)},filterFormContentData:function(){var e=i.channel("formContent").request("get:loadFilters"),t=_.without(e,void 0),n=t[1];this.set("formContentData",n(this.get("formContentData")))}});return e}),n("models/partCollection",["models/partModel"],function(e){var t=Backbone.Collection.extend({model:e,currentElement:!1,comparator:"order",initialize:function(e,t){e=e||[],this.on("remove",this.afterRemove),this.on("add",this.afterAdd),this.maybeChangeBuilderClass(e.length)},afterRemove:function(e,t,n){this.changeCurrentPart(e,t,n),this.maybeChangeBuilderClass(e,t,n),i.channel("app").request("close:drawer")},afterAdd:function(e){this.at(0).get("clean")&&2==this.length?(this.listenToOnce(i.channel("drawer"),"closed",this.afterFirstDrawerClose,e),this.openFirstDrawer(this.at(0))):(this.openDrawer(e),this.setElement(e),this.maybeChangeBuilderClass(e))},afterFirstDrawerClose:function(){var e=this.at(_.max(this.pluck("order"))),t=i.channel("mp").request("get:settingGroupCollection"),n=t.get("primary").get("settings").findWhere({name:"title"});n.set("label",n.get("oldLabel")),this.openDrawer(e),this.setElement(e),this.maybeChangeBuilderClass(e)},maybeChangeBuilderClass:function(e,t,n){!0==e instanceof Backbone.Model&&(e=this.length),this.changeBuilderClass(e>1)},openFirstDrawer:function(e){var t=i.channel("mp").request("get:settingGroupCollection"),n=t.get("primary").get("settings").findWhere({name:"title"});n.set("oldLabel",n.get("label")),n.set("label","Give your first part a title"),i.channel("app").request("open:drawer","editSettings",{model:e,groupCollection:t}),i.channel("drawer").on("opened",this.focusTitle)},openDrawer:function(e){var t=i.channel("mp").request("get:settingGroupCollection");i.channel("app").request("open:drawer","editSettings",{model:e,groupCollection:t}),i.channel("drawer").on("opened",this.focusTitle)},focusTitle:function(){var e=i.channel("app").request("get:drawerEl");jQuery(e).find("#title").select(),jQuery(e).find("#title").focus(),i.channel("drawer").off("opened",this.focusTitle)},changeBuilderClass:function(e){var t=i.channel("app").request("get:builderEl");e?jQuery(t).addClass("nf-has-parts"):jQuery(t).removeClass("nf-has-parts")},changeCurrentPart:function(e,t,n){this.getElement()==e?0==n.index?this.setElement(this.at(0)):this.setElement(this.at(n.index-1)):1==this.length&&this.setElement(this.at(0))},append:function(e){e=e||{};var t=this.length-1;return e=_.extend({order:t},e),this.add(e)},getElement:function(){return this.currentElement||this.setElement(this.at(0),!0),this.currentElement},setElement:function(e,t){if(e!=this.currentElement&&(t=t||!1,this.previousElement=this.currentElement,this.currentElement=e,!t)){var n=i.channel("app").request("get:currentDrawer");if(n&&"editSettings"==n.get("id")){var r=i.channel("mp").request("get:settingGroupCollection");i.channel("app").request("open:drawer","editSettings",{model:e,groupCollection:r})}this.trigger("change:part",this)}},next:function(){return this.hasNext()&&this.setElement(this.at(this.indexOf(this.getElement())+1)),this},previous:function(){return this.hasPrevious()&&this.setElement(this.at(this.indexOf(this.getElement())-1)),this},hasNext:function(){return 0==this.length?!1:this.length-1!=this.indexOf(this.getElement())},hasPrevious:function(){return 0==this.length?!1:0!=this.indexOf(this.getElement())},getFormContentData:function(){return this.getElement().get("formContentData")},updateOrder:function(){this.each(function(e,t){e.set("order",t)}),this.sort()},append:function(e){var t=_.max(this.pluck("order"))+1;return e instanceof Backbone.Model?e.set("order",t):e.order=t,this.add(e)}});return t}),n("controllers/data",["models/partCollection"],function(e){var t=Marionette.Object.extend({initialize:function(){i.channel("mp").reply("init:partCollection",this.initPartCollection,this),i.channel("mp").reply("get:collection",this.getCollection,this),this.listenTo(i.channel("fields"),"add:field",this.addField)},initPartCollection:function(e){this.collection=e},getCollection:function(){return this.collection},addField:function(e){this.collection.getFormContentData().trigger("add:field",e),1==this.collection.getFormContentData().length&&this.collection.getFormContentData().trigger("reset")}});return t}),n("controllers/clickControls",[],function(){var e=Marionette.Object.extend({initialize:function(){this.listenTo(i.channel("mp"),"click:previous",this.clickPrevious),this.listenTo(i.channel("mp"),"click:next",this.clickNext),this.listenTo(i.channel("mp"),"click:new",this.clickNew),this.listenTo(i.channel("mp"),"click:part",this.clickPart),this.listenTo(i.channel("setting-name-mp_remove"),"click:extra",this.clickRemove),this.listenTo(i.channel("setting-name-mp_duplicate"),"click:extra",this.clickDuplicate)},clickPrevious:function(e){var t=i.channel("mp").request("get:collection");t.previous()},clickNext:function(e){var t=i.channel("mp").request("get:collection");t.next()},clickNew:function(e){var t=i.channel("mp").request("get:collection"),n=t.append({});i.channel("app").request("update:setting","clean",!1),i.channel("app").request("update:db");var r={object:"Part",label:n.get("title"),change:"Added",dashicon:"plus-alt"},l={collection:n.collection};i.channel("changes").request("register:change","addPart",n,null,r,l)},clickPart:function(e,t){if(t==t.collection.getElement(t)){var n=i.channel("mp").request("get:settingGroupCollection");i.channel("app").request("open:drawer","editSettings",{model:t,groupCollection:n})}else t.collection.setElement(t)},clickRemove:function(e,t,n,i){n.collection.remove(n)},clickDuplicate:function(e,t,n,r){var l=i.channel("app").request("clone:modelDeep",n);n.collection.add(l),l.set("order",n.get("order")),n.collection.updateOrder(),n.collection.setElement(l)}});return e}),n("controllers/gutterDroppables",[],function(){var e=Marionette.Object.extend({initialize:function(){this.listenTo(i.channel("mp"),"over:gutter",this.over),this.listenTo(i.channel("mp"),"out:gutter",this.out),this.listenTo(i.channel("mp"),"drop:rightGutter",this.dropRight),this.listenTo(i.channel("mp"),"drop:leftGutter",this.dropLeft)},over:function(e,t){jQuery("#nf-main").find(".nf-fields-sortable-placeholder").addClass("nf-sortable-removed").removeClass("nf-fields-sortable-placeholder"),e.item=e.draggable,i.channel("app").request("over:fieldsSortable",e)},out:function(e,t){jQuery("#nf-main").find(".nf-sortable-removed").addClass("nf-fields-sortable-placeholder"),e.item=e.draggable,i.channel("app").request("out:fieldsSortable",e)},drop:function(e,t,n){e.draggable.dropping=!0,e.item=e.draggable,i.channel("app").request("out:fieldsSortable",e),i.channel("fields").request("sort:fields",null,null,!1)},dropLeft:function(e,t){if(this.drop(e,t,"left"),t.hasPrevious())if(jQuery(e.draggable).hasClass("nf-field-wrap")){var n=i.channel("fields").request("get:field",jQuery(e.draggable).data("id"));t.getFormContentData().trigger("remove:field",n),t.at(t.indexOf(t.getElement())-1).get("formContentData").trigger("append:field",n)}else if(jQuery(e.draggable).hasClass("nf-field-type-draggable")){var r=jQuery(e.draggable).data("id"),n=this.addField(r,t);t.at(t.indexOf(t.getElement())-1).get("formContentData").trigger("append:field",n)}else{i.channel("fields").request("sort:staging");var l=i.channel("fields").request("get:staging");_.each(l.models,function(e,n){var i=this.addField(e.get("slug"),t);t.at(t.indexOf(t.getElement())-1).get("formContentData").trigger("append:field",i)},this),i.channel("fields").request("clear:staging")}},dropRight:function(e,t){if(this.drop(e,t),jQuery(e.draggable).hasClass("nf-field-wrap")){var n=i.channel("fields").request("get:field",jQuery(e.draggable).data("id"));if(t.hasNext())t.getFormContentData().trigger("remove:field",n),t.at(t.indexOf(t.getElement())+1).get("formContentData").trigger("append:field",n);else{var r=t.getElement();t.getFormContentData().trigger("remove:field",n);var l=t.append({formContentData:[n.get("key")]});t.setElement(l),i.channel("app").request("update:setting","clean",!1),i.channel("app").request("update:db");var o={object:"Part",label:l.get("title"),change:"Added",dashicon:"plus-alt"},a={collection:l.collection,oldPart:r,fieldModel:n};i.channel("changes").request("register:change","addPart",l,null,o,a)}}else{if(jQuery(e.draggable).hasClass("nf-field-type-draggable")){var s=jQuery(e.draggable).data("id"),n=this.addField(s,t);if(t.hasNext())return t.at(t.indexOf(t.getElement())+1).get("formContentData").trigger("append:field",n),!1;var l=t.append({formContentData:[n.get("key")]});t.setElement(l),i.channel("app").request("update:setting","clean",!1),i.channel("app").request("update:db");var o={object:"Part",label:l.get("title"),change:"Added",dashicon:"plus-alt"},a={collection:l.collection};i.channel("changes").request("register:change","addPart",l,null,o,a);return l}i.channel("fields").request("sort:staging");var c=i.channel("fields").request("get:staging"),d=[];if(_.each(c.models,function(e,n){var i=this.addField(e.get("slug"),t);t.hasNext()?t.at(t.indexOf(t.getElement())+1).get("formContentData").trigger("append:field",i):d.push(i.get("key"))},this),!t.hasNext()){var l=t.append({formContentData:d});t.setElement(l),i.channel("app").request("update:setting","clean",!1),i.channel("app").request("update:db");var o={object:"Part",label:l.get("title"),change:"Added",dashicon:"plus-alt"},a={collection:l.collection};i.channel("changes").request("register:change","addPart",l,null,o,a)}i.channel("fields").request("clear:staging")}},addField:function(e,t){var n=i.channel("fields").request("get:type",e),r=i.channel("fields").request("add",{label:n.get("nicename"),type:e});return t.getFormContentData().trigger("remove:field",r),r},changePart:function(e,t){t.next(),jQuery(e.helper).draggable()}});return e}),n("controllers/partSettings",[],function(e){var t=Marionette.Object.extend({initialize:function(){this.setupCollection(),i.channel("mp").reply("get:settingGroupCollection",this.getCollection,this)},setupCollection:function(){var e=i.channel("app").request("get:settingGroupCollectionDefinition");this.collection=new e([{id:"primary",label:"",display:!0,priority:100,settings:[{name:"title",type:"textbox",label:"Part Title",width:"full"},{name:"mp_remove",type:"html",width:"one-half",value:'<a href="#" class="extra">Remove Part</a>'},{name:"mp_duplicate",type:"html",width:"one-half",value:'<a href="#" class="extra">Duplicate Part</a>'}]}])},getCollection:function(){return this.collection}});return t}),n("controllers/partDroppable",[],function(){var e=Marionette.Object.extend({initialize:function(){this.listenTo(i.channel("mp"),"over:part",this.over),this.listenTo(i.channel("mp"),"out:part",this.out),this.listenTo(i.channel("mp"),"drop:part",this.drop)},over:function(e,t,n,r){jQuery("#nf-main").find(".nf-fields-sortable-placeholder").addClass("nf-sortable-removed").removeClass("nf-fields-sortable-placeholder"),t.item=t.draggable,jQuery(t.draggable).hasClass("nf-field-type-draggable")||jQuery(t.draggable).hasClass("nf-stage")?i.channel("app").request("over:fieldsSortable",t):jQuery(t.helper).css({width:"300px",height:"50px",opacity:"0.7"})},out:function(e,t,n,r){if(jQuery("#nf-main").find(".nf-sortable-removed").addClass("nf-fields-sortable-placeholder"),t.item=t.draggable,jQuery(t.draggable).hasClass("nf-field-type-draggable")||jQuery(t.draggable).hasClass("nf-stage"))i.channel("app").request("out:fieldsSortable",t);else{var l=i.channel("fields").request("get:sortableEl"),o=jQuery(l).width();jQuery(l).height();jQuery(t.helper).css({width:o,height:"",opacity:""})}},drop:function(e,t,n,r){t.draggable.dropping=!0,t.item=t.draggable,i.channel("app").request("out:fieldsSortable",t),jQuery(t.draggable).effect("transfer",{to:jQuery(r.el)},500),jQuery(t.draggable).hasClass("nf-field-wrap")?this.dropField(e,t,n,r):jQuery(t.draggable).hasClass("nf-field-type-draggable")?this.dropNewField(e,t,n,r):jQuery(t.draggable).hasClass("nf-stage")&&this.dropStaging(e,t,n,r)},dropField:function(e,t,n,r){i.channel("fields").request("sort:fields",null,null,!1),i.channel("app").request("out:fieldsSortable",t);var l=i.channel("fields").request("get:field",jQuery(t.draggable).data("id"));n.collection.getFormContentData().trigger("remove:field",l),n.get("formContentData").trigger("append:field",l)},dropNewField:function(e,t,n,i){var r=jQuery(t.draggable).data("id"),l=this.addField(r,n.collection);n.get("formContentData").trigger("append:field",l)},dropStaging:function(e,t,n,r){i.channel("fields").request("sort:staging");var l=i.channel("fields").request("get:staging");_.each(l.models,function(e,t){var i=this.addField(e.get("slug"),n.collection);n.get("formContentData").trigger("append:field",i)},this),i.channel("fields").request("clear:staging")},addField:function(e,t){var n=i.channel("fields").request("get:type",e),r=i.channel("fields").request("add",{label:n.get("nicename"),type:e});return t.getFormContentData().trigger("remove:field",r),r}});return e}),n("controllers/partSortable",[],function(){var e=Marionette.Object.extend({initialize:function(){this.listenTo(i.channel("mp"),"start:partSortable",this.start),this.listenTo(i.channel("mp"),"stop:partSortable",this.stop),this.listenTo(i.channel("mp"),"update:partSortable",this.update)},start:function(e,t,n,i){jQuery(t.item).hasClass("nf-field-type-draggable")||jQuery(t.item).hasClass("nf-stage")||(jQuery(t.item).css("opacity","0.5").show(),jQuery(t.helper).css("opacity","0.75"))},stop:function(e,t,n,i){jQuery(t.item).hasClass("nf-field-type-draggable")||jQuery(t.item).hasClass("nf-stage")||jQuery(t.item).css("opacity","")},update:function(e,t,n,i){jQuery(t.item).css("opacity","");var r=_.without(jQuery(i.el).sortable("toArray"),"");_.each(r,function(e,t){n.get({cid:e}).set("order",t)},this),n.sort()}});return e}),n("controllers/undo",[],function(){var e=Marionette.Object.extend({initialize:function(){i.channel("changes").reply("undo:addPart",this.undoAddPart,this)},undoAddPart:function(e,t){var n=e.get("model"),r=e.get("data"),l=r.collection;l.remove(n),"undefined"!=typeof r.fieldModel&&r.oldPart.get("formContentData").trigger("add:field",r.fieldModel);var o=i.channel("changes").request("get:collection");o.remove(o.filter({model:n})),this.maybeRemoveChange(e,t)},maybeRemoveChange:function(e,t){var t="undefined"!=typeof t?t:!1;if(!t){i.channel("app").request("update:db");var n=i.channel("changes").request("get:collection");n.remove(e),0==n.length&&(i.channel("app").request("update:setting","clean",!0),i.channel("app").request("close:drawer"))}}});return e}),n("controllers/loadControllers",["controllers/data","controllers/clickControls","controllers/gutterDroppables","controllers/partSettings","controllers/partDroppable","controllers/partSortable","controllers/undo"],function(e,t,n,i,r,l,o){var a=Marionette.Object.extend({initialize:function(){new e,new t,new n,new i,new r,new l,new o}});return a}),n("views/drawerItem",[],function(){var e=Marionette.ItemView.extend({tagName:"li",template:"#nf-tmpl-mp-drawer-item",initialize:function(){this.listenTo(this.model,"change:title",this.render),this.listenTo(this.model.collection,"change:part",this.maybeChangeActive)},maybeChangeActive:function(){jQuery(this.el).removeClass("active"),this.model==this.model.collection.getElement()&&jQuery(this.el).addClass("active")},attributes:function(){return{id:this.model.cid}},onShow:function(){var e=this;jQuery(this.el).droppable({activeClass:"mp-drag-active",hoverClass:"mp-drag-hover",accept:".nf-field-type-draggable, .nf-field-wrap, .nf-stage",tolerance:"pointer",over:function(t,n){i.channel("mp").trigger("over:part",t,n,e.model,e)},out:function(t,n){i.channel("mp").trigger("out:part",t,n,e.model,e)},drop:function(t,n){i.channel("mp").trigger("drop:part",t,n,e.model,e)}}),this.maybeChangeActive()},events:{click:"click"},click:function(e){i.channel("mp").trigger("click:part",e,this.model)},templateHelpers:function(){var e=this;return{getIndex:function(){return e.model.collection.indexOf(e.model)+1}}}});return e}),n("views/drawerCollection",["views/drawerItem"],function(e){var t=Marionette.CollectionView.extend({tagName:"ul",childView:e,reorderOnSort:!0,onShow:function(){var e=this;jQuery(this.el).sortable({items:"li:not(.no-sort)",helper:"clone",update:function(t,n){i.channel("mp").trigger("update:partSortable",t,n,e.collection,e)},start:function(t,n){i.channel("mp").trigger("start:partSortable",t,n,e.collection,e)},stop:function(t,n){i.channel("mp").trigger("stop:partSortable",t,n,e.collection,e)}})}});return t}),n("views/drawerLayout",["views/drawerCollection"],function(e){var t=Marionette.LayoutView.extend({tagName:"div",template:"#nf-tmpl-mp-drawer-layout",regions:{viewport:"#nf-mp-drawer-viewport"},initialize:function(){jQuery(window).on("resize",{context:this},this.resizeEvent),this.listenTo(i.channel("drawer"),"before:open",this.beforeDrawerOpen),this.listenTo(i.channel("drawer"),"before:close",this.beforeDrawerClose)},onBeforeDestroy:function(){jQuery(window).off("resize",this.resizeViewport)},onShow:function(){var t=this;this.viewport.show(new e({collection:this.collection})),jQuery(this.el).find(".nf-mp-drawer-scroll-previous").click(function(e){jQuery(t.viewport.el).animate({scrollLeft:"-=400"},"slow")}),jQuery(this.el).find(".nf-mp-drawer-scroll-next").click(function(e){jQuery(t.viewport.el).animate({scrollLeft:"+=400"},"slow")})},onAttach:function(){var e=157;jQuery(this.viewport.el).find("li").each(function(){e+=jQuery(this).outerWidth()}),jQuery(this.viewport.el).find("ul").width(e),this.resizeViewport(this.viewport.el)},resizeEvent:function(e){e.data.context.resizeViewport(e.data.context.viewport.el)},beforeDrawerClose:function(){var e=jQuery(window).width()-140;jQuery(this.viewport.el).animate({width:e},500)},beforeDrawerOpen:function(){var e=i.channel("app").request("get:drawerEl"),t=jQuery(e).width()-60;jQuery(this.viewport.el).animate({width:t},300)},resizeViewport:function(e,t){t=t||jQuery(window).width()-140,jQuery(e).width(t)}});return t}),n("views/layout",["views/drawerLayout"],function(e){var t=Marionette.LayoutView.extend({tagName:"div",template:"#nf-tmpl-mp-layout",regions:{mainContent:"#nf-mp-main-content",drawer:"#nf-mp-drawer"},initialize:function(){this.listenTo(this.collection,"change:part",this.changePart)},onShow:function(){this.drawer.show(new e({collection:this.collection}));var t=i.channel("formContent").request("get:viewFilters"),n=_.without(t,void 0),r=n[1];this.formContentView=r(),0==this.collection.length&&this.collection.add({},{silent:!0}),this.mainContent.show(new this.formContentView({collection:this.collection.getFormContentData()}))},changePart:function(){var e=this.collection.indexOf(this.collection.getElement()),t=this.collection.indexOf(this.collection.previousElement);if(e>t)var n="left",i="right";else var n="right",i="left";var r=this;jQuery(this.mainContent.el).hide("slide",{direction:n},300,function(){r.mainContent.empty(),r.mainContent.show(new r.formContentView({collection:r.collection.getFormContentData()}))}),jQuery(r.mainContent.el).show("slide",{direction:i},200)}});return t}),n("views/gutterLeft",[],function(){var e=Marionette.ItemView.extend({tagName:"div",template:"#nf-tmpl-mp-gutter-left",events:{"click .fa":"clickPrevious"},initialize:function(){this.collection=i.channel("mp").request("get:collection"),this.listenTo(this.collection,"change:part",this.render),this.listenTo(this.collection,"sort",this.render),this.listenTo(this.collection,"remove",this.render)},onRender:function(){var e=this;jQuery(this.el).find(".fa").droppable({tolerance:"pointer",hoverClass:"mp-circle-over",activeClass:"mp-circle-active",accept:".nf-field-type-draggable, .nf-field-wrap, .nf-stage",over:function(t,n){i.channel("mp").trigger("over:gutter",n,e.collection)},out:function(t,n){i.channel("mp").trigger("out:gutter",n,e.collection)},drop:function(t,n){i.channel("mp").trigger("drop:leftGutter",n,e.collection)}})},clickPrevious:function(e){i.channel("mp").trigger("click:previous",e)},templateHelpers:function(){var e=this;return{hasPrevious:function(){return e.collection.hasPrevious()}}},changePart:function(e){e.collection.previous()}});return e}),n("views/gutterRight",[],function(){var e=Marionette.ItemView.extend({tagName:"div",template:"#nf-tmpl-mp-gutter-right",events:{"click .next":"clickNext","click .new":"clickNew"},initialize:function(){this.collection=i.channel("mp").request("get:collection"),this.listenTo(this.collection,"change:part",this.render),this.listenTo(this.collection,"sort",this.render),this.listenTo(this.collection,"remove",this.render),this.listenTo(this.collection,"add",this.render),this.listenTo(i.channel("fields"),"add:field",this.render)},test:function(){console.log("test test test")},onRender:function(){var e=this;jQuery(this.el).find(".fa").droppable({tolerance:"pointer",hoverClass:"mp-circle-over",activeClass:"mp-circle-active",accept:".nf-field-type-draggable, .nf-field-wrap, .nf-stage",over:function(t,n){i.channel("mp").trigger("over:gutter",n,e.collection)},out:function(t,n){i.channel("mp").trigger("out:gutter",n,e.collection)},drop:function(t,n){i.channel("mp").trigger("drop:rightGutter",n,e.collection)}})},clickNext:function(e){i.channel("mp").trigger("click:next",e)},clickNew:function(e){i.channel("mp").trigger("click:new",e)},templateHelpers:function(){var e=this;return{hasNext:function(){return e.collection.hasNext()},hasContent:function(){return 0!=i.channel("fields").request("get:collection").length}}},changePart:function(e){e.collection.next()}});return e}),n("views/mainContentEmpty",[],function(){var e=Marionette.ItemView.extend({tagName:"div",template:"#nf-tmpl-mp-main-content-fields-empty",onBeforeDestroy:function(){jQuery(this.el).parent().removeClass("nf-fields-empty-droppable").droppable("destroy")},onRender:function(){this.$el=this.$el.children(),this.$el.unwrap(),this.setElement(this.$el)},onShow:function(){jQuery(this.el).parent().hasClass("ui-sortable")&&jQuery(this.el).parent().sortable("destroy"),jQuery(this.el).parent().addClass("nf-fields-empty-droppable"),jQuery(this.el).parent().droppable({accept:function(e){return jQuery(e).hasClass("nf-stage")||jQuery(e).hasClass("nf-field-type-button")?!0:void 0},activeClass:"nf-droppable-active",hoverClass:"nf-droppable-hover",tolerance:"pointer",over:function(e,t){t.item=t.draggable,i.channel("app").request("over:fieldsSortable",t)},out:function(e,t){t.item=t.draggable,i.channel("app").request("out:fieldsSortable",t)},drop:function(e,t){t.item=t.draggable,i.channel("app").request("receive:fieldsSortable",t);var n=i.channel("fields").request("get:collection");n.trigger("reset",n)}})}});return e}),n("controllers/filters",["views/layout","views/gutterLeft","views/gutterRight","views/mainContentEmpty","models/partCollection"],function(e,t,n,r,l){var o=Marionette.Object.extend({initialize:function(){this.listenTo(i.channel("app"),"after:loadViews",this.addFilters)},addFilters:function(){i.channel("formContentGutters").request("add:leftFilter",this.getLeftView,1,this),i.channel("formContentGutters").request("add:rightFilter",this.getRightView,1,this),i.channel("formContent").request("add:viewFilter",this.getContentView,1),i.channel("formContent").request("add:saveFilter",this.formContentSave,1),i.channel("formContent").request("add:loadFilter",this.formContentLoad,1),this.emptyView()},getLeftView:function(){return t},getRightView:function(){return n},formContentLoad:function(e){if(!0==e instanceof Backbone.Collection)return e;var t=new l(e);return i.channel("mp").request("init:partCollection",t),t},getContentView:function(){return e},formContentSave:function(e){var t=i.channel("app").request("clone:collectionDeep",e),n=i.channel("formContent").request("get:saveFilters");return t.each(function(e){var t=_.without(n,void 0),i=t[1];e.set("formContentData",i(e.get("formContentData")))}),t.toJSON()},emptyView:function(){this.defaultMainContentEmptyView=i.channel("views").request("get:mainContentEmpty"),i.channel("views").reply("get:mainContentEmpty",this.getMainContentEmpty,this)},getMainContentEmpty:function(){return 1==i.channel("mp").request("get:collection").length?this.defaultMainContentEmptyView:r}});return o});var i=Backbone.Radio;t(["controllers/loadControllers","controllers/filters"],function(e,t){var n=Marionette.Application.extend({initialize:function(e){this.listenTo(i.channel("app"),"after:loadControllers",this.loadControllers)},loadControllers:function(){new e},onStart:function(){new t}}),r=new n;r.start()}),n("main",function(){})}();
//# sourceMappingURL=almond.build.js.map
//# sourceMappingURL=builder.js.map
