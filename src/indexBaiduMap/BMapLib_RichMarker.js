  1 /**
  2  * @fileoverview 百度地图的富Marker类，对外开放。
  3  * 允许用户在自定义丰富的Marker展现，并添加点击、双击、拖拽等事件。
  4  * 基于Baidu Map API 1.2。
  5  *
  6  * @author Baidu Map Api Group 
  7  * @version 1.2
  8  */
  9 /** 
 10  * @namespace BMap的所有library类均放在BMapLib命名空间下
 11  */
 12 var BMapLib = window.BMapLib = BMapLib || {};
 13 
 14 (function () {
 15     /**
 16      * 声明baidu包
 17      */
 18     var baidu = baidu || {
 19         guid: "$BAIDU$"
 20     };
 21 
 22     (function () {
 23         // 一些页面级别唯一的属性，需要挂载在window[baidu.guid]上
 24         window[baidu.guid] = {};
 25 
 26         /**
 27          * 将源对象的所有属性拷贝到目标对象中
 28          * @name baidu.extend
 29          * @function
 30          * @grammar baidu.extend(target, source)
 31          * @param {Object} target 目标对象
 32          * @param {Object} source 源对象
 33          * @returns {Object} 目标对象
 34          */
 35         baidu.extend = function (target, source) {
 36             for (var p in source) {
 37                 if (source.hasOwnProperty(p)) {
 38                     target[p] = source[p];
 39                 }
 40             }
 41             return target;
 42         };
 43 
 44         /**
 45          * @ignore
 46          * @namespace
 47          * @baidu.lang 对语言层面的封装，包括类型判断、模块扩展、继承基类以及对象自定义事件的支持。
 48          * @property guid 对象的唯一标识
 49          */
 50         baidu.lang = baidu.lang || {};
 51 
 52         /**
 53          * 返回一个当前页面的唯一标识字符串。
 54          * @function
 55          * @grammar baidu.lang.guid()
 56          * @returns {String} 当前页面的唯一标识字符串
 57          */
 58         baidu.lang.guid = function () {
 59             return "TANGRAM__" + (window[baidu.guid]._counter++).toString(36);
 60         };
 61 
 62         window[baidu.guid]._counter = window[baidu.guid]._counter || 1;
 63 
 64         /**
 65          * 所有类的实例的容器
 66          * key为每个实例的guid
 67          */
 68         window[baidu.guid]._instances = window[baidu.guid]._instances || {};
 69 
 70         /**
 71          * Tangram继承机制提供的一个基类，用户可以通过继承baidu.lang.Class来获取它的属性及方法。
 72          * @function
 73          * @name baidu.lang.Class
 74          * @grammar baidu.lang.Class(guid)
 75          * @param {string} guid	对象的唯一标识
 76          * @meta standard
 77          * @remark baidu.lang.Class和它的子类的实例均包含一个全局唯一的标识guid。
 78          * guid是在构造函数中生成的，因此，继承自baidu.lang.Class的类应该直接或者间接调用它的构造函数。<br>
 79          * baidu.lang.Class的构造函数中产生guid的方式可以保证guid的唯一性，及每个实例都有一个全局唯一的guid。
 80          */
 81         baidu.lang.Class = function (guid) {
 82             this.guid = guid || baidu.lang.guid();
 83             window[baidu.guid]._instances[this.guid] = this;
 84         };
 85 
 86         window[baidu.guid]._instances = window[baidu.guid]._instances || {};
 87 
 88         /**
 89          * 判断目标参数是否string类型或String对象
 90          * @name baidu.lang.isString
 91          * @function
 92          * @grammar baidu.lang.isString(source)
 93          * @param {Any} source 目标参数
 94          * @shortcut isString
 95          * @meta standard
 96          *             
 97          * @returns {boolean} 类型判断结果
 98          */
 99         baidu.lang.isString = function (source) {
100             return '[object String]' == Object.prototype.toString.call(source);
101         };
102         baidu.isString = baidu.lang.isString;
103 
104         /**
105          * 判断目标参数是否为function或Function实例
106          * @name baidu.lang.isFunction
107          * @function
108          * @grammar baidu.lang.isFunction(source)
109          * @param {Any} source 目标参数
110          * @returns {boolean} 类型判断结果
111          */
112         baidu.lang.isFunction = function (source) {
113             return '[object Function]' == Object.prototype.toString.call(source);
114         };
115 
116         /**
117          * 自定义的事件对象。
118          * @function
119          * @name baidu.lang.Event
120          * @grammar baidu.lang.Event(type[, target])
121          * @param {string} type	 事件类型名称。为了方便区分事件和一个普通的方法，事件类型名称必须以"on"(小写)开头。
122          * @param {Object} [target]触发事件的对象
123          * @meta standard
124          * @remark 引入该模块，会自动为Class引入3个事件扩展方法：addEventListener、removeEventListener和dispatchEvent。
125          * @see baidu.lang.Class
126          */
127         baidu.lang.Event = function (type, target) {
128             this.type = type;
129             this.returnValue = true;
130             this.target = target || null;
131             this.currentTarget = null;
132         };
133 
134         /**
135          * 注册对象的事件监听器。引入baidu.lang.Event后，Class的子类实例才会获得该方法。
136          * @grammar obj.addEventListener(type, handler[, key])
137          * @param 	{string}   type         自定义事件的名称
138          * @param 	{Function} handler      自定义事件被触发时应该调用的回调函数
139          * @param 	{string}   [key]		为事件监听函数指定的名称，可在移除时使用。如果不提供，方法会默认为它生成一个全局唯一的key。
140          * @remark 	事件类型区分大小写。如果自定义事件名称不是以小写"on"开头，该方法会给它加上"on"再进行判断，即"click"和"onclick"会被认为是同一种事件。 
141          */
142         baidu.lang.Class.prototype.addEventListener = function (type, handler, key) {
143             if (!baidu.lang.isFunction(handler)) {
144                 return;
145             }!this.__listeners && (this.__listeners = {});
146             var t = this.__listeners,
147                 id;
148             if (typeof key == "string" && key) {
149                 if (/[^\w\-]/.test(key)) {
150                     throw ("nonstandard key:" + key);
151                 } else {
152                     handler.hashCode = key;
153                     id = key;
154                 }
155             }
156             type.indexOf("on") != 0 && (type = "on" + type);
157             typeof t[type] != "object" && (t[type] = {});
158             id = id || baidu.lang.guid();
159             handler.hashCode = id;
160             t[type][id] = handler;
161         };
162 
163         /**
164          * 移除对象的事件监听器。引入baidu.lang.Event后，Class的子类实例才会获得该方法。
165          * @grammar obj.removeEventListener(type, handler)
166          * @param {string}   type     事件类型
167          * @param {Function|string} handler  要移除的事件监听函数或者监听函数的key
168          * @remark 	如果第二个参数handler没有被绑定到对应的自定义事件中，什么也不做。
169          */
170         baidu.lang.Class.prototype.removeEventListener = function (type, handler) {
171             if (baidu.lang.isFunction(handler)) {
172                 handler = handler.hashCode;
173             } else if (!baidu.lang.isString(handler)) {
174                 return;
175             }!this.__listeners && (this.__listeners = {});
176             type.indexOf("on") != 0 && (type = "on" + type);
177             var t = this.__listeners;
178             if (!t[type]) {
179                 return;
180             }
181             t[type][handler] && delete t[type][handler];
182         };
183 
184         /**
185          * 派发自定义事件，使得绑定到自定义事件上面的函数都会被执行。引入baidu.lang.Event后，Class的子类实例才会获得该方法。
186          * @grammar obj.dispatchEvent(event, options)
187          * @param {baidu.lang.Event|String} event 	Event对象，或事件名称(1.1.1起支持)
188          * @param {Object} options 扩展参数,所含属性键值会扩展到Event对象上(1.2起支持)
189          * @remark 处理会调用通过addEventListenr绑定的自定义事件回调函数之外，还会调用直接绑定到对象上面的自定义事件。
190          * 例如：<br>
191          * myobj.onMyEvent = function(){}<br>
192          * myobj.addEventListener("onMyEvent", function(){});
193          */
194         baidu.lang.Class.prototype.dispatchEvent = function (event, options) {
195             if (baidu.lang.isString(event)) {
196                 event = new baidu.lang.Event(event);
197             }!this.__listeners && (this.__listeners = {});
198             options = options || {};
199             for (var i in options) {
200                 event[i] = options[i];
201             }
202             var i, t = this.__listeners,
203                 p = event.type;
204             event.target = event.target || this;
205             event.currentTarget = this;
206             p.indexOf("on") != 0 && (p = "on" + p);
207             baidu.lang.isFunction(this[p]) && this[p].apply(this, arguments);
208             if (typeof t[p] == "object") {
209                 for (i in t[p]) {
210                     t[p][i].apply(this, arguments);
211                 }
212             }
213             return event.returnValue;
214         };
215 
216         /**
217          * @ignore
218          * @namespace baidu.dom 
219          * 操作dom的方法
220          */
221         baidu.dom = baidu.dom || {};
222 
223         /**
224          * 从文档中获取指定的DOM元素
225          * **内部方法**
226          * 
227          * @param {string|HTMLElement} id 元素的id或DOM元素
228          * @meta standard
229          * @return {HTMLElement} DOM元素，如果不存在，返回null，如果参数不合法，直接返回参数
230          */
231         baidu.dom._g = function (id) {
232             if (baidu.lang.isString(id)) {
233                 return document.getElementById(id);
234             }
235             return id;
236         };
237         baidu._g = baidu.dom._g;
238 
239         /**
240          * @ignore
241          * @namespace baidu.event 屏蔽浏览器差异性的事件封装。
242          * @property target 	事件的触发元素
243          * @property pageX 		鼠标事件的鼠标x坐标
244          * @property pageY 		鼠标事件的鼠标y坐标
245          * @property keyCode 	键盘事件的键值
246          */
247         baidu.event = baidu.event || {};
248 
249         /**
250          * 事件监听器的存储表
251          * @private
252          * @meta standard
253          */
254         baidu.event._listeners = baidu.event._listeners || [];
255 
256         /**
257          * 为目标元素添加事件监听器
258          * @name baidu.event.on
259          * @function
260          * @grammar baidu.event.on(element, type, listener)
261          * @param {HTMLElement|string|window} element 目标元素或目标元素id
262          * @param {string} type 事件类型
263          * @param {Function} listener 需要添加的监听器
264          * @remark
265          * 
266         1. 不支持跨浏览器的鼠标滚轮事件监听器添加<br>
267         2. 改方法不为监听器灌入事件对象，以防止跨iframe事件挂载的事件对象获取失败
268             
269          * @shortcut on
270          * @meta standard
271          * @see baidu.event.un
272          * @returns {HTMLElement|window} 目标元素
273          */
274         baidu.event.on = function (element, type, listener) {
275             type = type.replace(/^on/i, '');
276             element = baidu.dom._g(element);
277 
278             var realListener = function (ev) {
279                     listener.call(element, ev);
280                 },
281                 lis = baidu.event._listeners,
282                 filter = baidu.event._eventFilter,
283                 afterFilter, realType = type;
284             type = type.toLowerCase();
285             if (filter && filter[type]) {
286                 afterFilter = filter[type](element, type, realListener);
287                 realType = afterFilter.type;
288                 realListener = afterFilter.listener;
289             }
290             if (element.addEventListener) {
291                 element.addEventListener(realType, realListener, false);
292             } else if (element.attachEvent) {
293                 element.attachEvent('on' + realType, realListener);
294             }
295             lis[lis.length] = [element, type, listener, realListener, realType];
296             return element;
297         };
298         baidu.on = baidu.event.on;
299 
300         /**
301          * 为目标元素移除事件监听器
302          * @name baidu.event.un
303          * @function
304          * @grammar baidu.event.un(element, type, listener)
305          * @param {HTMLElement|string|window} element 目标元素或目标元素id
306          * @param {string} type 事件类型
307          * @param {Function} listener 需要移除的监听器
308          * @shortcut un
309          * @meta standard
310          * @see baidu.event.on
311          *             
312          * @returns {HTMLElement|window} 目标元素
313          */
314         baidu.event.un = function (element, type, listener) {
315             element = baidu.dom._g(element);
316             type = type.replace(/^on/i, '').toLowerCase();
317 
318             var lis = baidu.event._listeners,
319                 len = lis.length,
320                 isRemoveAll = !listener,
321                 item, realType, realListener;
322             while (len--) {
323                 item = lis[len];
324                 if (item[1] === type && item[0] === element && (isRemoveAll || item[2] === listener)) {
325                     realType = item[4];
326                     realListener = item[3];
327                     if (element.removeEventListener) {
328                         element.removeEventListener(realType, realListener, false);
329                     } else if (element.detachEvent) {
330                         element.detachEvent('on' + realType, realListener);
331                     }
332                     lis.splice(len, 1);
333                 }
334             }
335 
336             return element;
337         };
338         baidu.un = baidu.event.un;
339 
340         /**
341          * 阻止事件的默认行为
342          * @name baidu.event.preventDefault
343          * @function
344          * @grammar baidu.event.preventDefault(event)
345          * @param {Event} event 事件对象
346          * @meta standard
347          */
348         baidu.preventDefault = baidu.event.preventDefault = function (event) {
349             if (event.preventDefault) {
350                 event.preventDefault();
351             } else {
352                 event.returnValue = false;
353             }
354         };
355     })();
356 
357     /** 
358      * @exports RichMarker as BMapLib.RichMarker 
359      */
360     var RichMarker =
361     /**
362      * RichMarker类的构造函数
363      * @class 富Marker定义类，实现丰富的Marker展现效果。
364      * 
365      * @constructor
366      * @param {String | HTMLElement} content 用户自定义的Marker内容，可以是字符串，也可以是dom节点
367      * @param {BMap.Point} position marker的位置
368      * @param {Json} RichMarkerOptions 可选的输入参数，非必填项。可输入选项包括：<br />
369      * {"<b>anchor</b>" : {BMap.Size} Marker的的位置偏移值,
370      * <br />"<b>enableDragging</b>" : {Boolean} 是否启用拖拽，默认为false}
371      *
372      * @example <b>参考示例：</b>
373      * var map = new BMap.Map("container");
374      * map.centerAndZoom(new BMap.Point(116.309965, 40.058333), 17);
375      * var htm = "<div style='background:#E7F0F5;color:#0082CB;border:1px solid #333'>"
376      *              +     "欢迎使用百度地图！"
377      *              +     "<img src='http://map.baidu.com/img/logo-map.gif' border='0' />"
378      *              + "</div>";
379      * var point = new BMap.Point(116.30816, 40.056863);
380      * var myRichMarkerObject = new BMapLib.RichMarker(htm, point, {"anchor": new BMap.Size(-72, -84), "enableDragging": true});
381      * map.addOverlay(myRichMarkerObject);
382      */
383     BMapLib.RichMarker = function (content, position, opts) {
384             if (!content || !position || !(position instanceof BMap.Point)) {
385                 return;
386             }
387 
388             /**
389              * map对象
390              * @private
391              * @type {Map}
392              */
393             this._map = null;
394 
395             /**
396              * Marker内容
397              * @private
398              * @type {String | HTMLElement}
399              */
400             this._content = content;
401 
402             /**
403              * marker显示位置
404              * @private
405              * @type {BMap.Point}
406              */
407             this._position = position;
408 
409             /**
410              * marker主容器
411              * @private
412              * @type {HTMLElement}
413              */
414             this._container = null;
415 
416             /**
417              * marker主容器的尺寸
418              * @private
419              * @type {BMap.Size}
420              */
421             this._size = null;
422 
423             opts = opts || {};
424             /**
425              * _opts是默认参数赋值。
426              * 下面通过用户输入的opts，对默认参数赋值
427              * @private
428              * @type {Json}
429              */
430             this._opts = baidu.extend(
431             baidu.extend(this._opts || {}, {
432 
433                 /**
434                  * Marker是否可以拖拽
435                  * @private
436                  * @type {Boolean}
437                  */
438                 enableDragging: false,
439 
440                 /**
441                  * Marker的偏移量
442                  * @private
443                  * @type {BMap.Size}
444                  */
445                 anchor: new BMap.Size(0, 0)
446             }), opts);
447         }
448 
449         // 继承覆盖物类
450         RichMarker.prototype = new BMap.Overlay();
451 
452     /**
453      * 初始化，实现自定义覆盖物的initialize方法
454      * 主要生成Marker的主容器，填充自定义的内容，并附加事件
455      * 
456      * @private
457      * @param {BMap} map map实例对象
458      * @return {Dom} 返回自定义生成的dom节点
459      */
460     RichMarker.prototype.initialize = function (map) {
461         var me = this,
462             div = me._container = document.createElement("div");
463         me._map = map;
464         baidu.extend(div.style, {
465             position: "absolute",
466             zIndex: BMap.Overlay.getZIndex(me._position.lat),
467             background: "#FFF",
468             cursor: "pointer"
469         });
470         map.getPanes().labelPane.appendChild(div);
471 
472         // 给主容器添加上用户自定义的内容
473         me._appendContent();
474         // 给主容器添加事件处理
475         me._setEventDispath();
476         // 获取主容器的高宽
477         me._getContainerSize();
478 
479         return div;
480     }
481 
482     /**
483      * 为自定义的Marker设定显示位置，实现自定义覆盖物的draw方法
484      * 
485      * @private
486      */
487     RichMarker.prototype.draw = function () {
488         var map = this._map,
489             anchor = this._opts.anchor,
490             pixel = map.pointToOverlayPixel(this._position);
491         this._container.style.left = pixel.x + anchor.width + "px";
492         this._container.style.top = pixel.y + anchor.height + "px";
493     }
494 
495     /**
496      * 设置Marker可以拖拽
497      * @return 无返回值
498      * 
499      * @example <b>参考示例：</b>
500      * myRichMarkerObject.enableDragging();
501      */
502     RichMarker.prototype.enableDragging = function () {
503         this._opts.enableDragging = true;
504     }
505 
506     /**
507      * 设置Marker不能拖拽
508      * @return 无返回值
509      * 
510      * @example <b>参考示例：</b>
511      * myRichMarkerObject.disableDragging();
512      */
513     RichMarker.prototype.disableDragging = function () {
514         this._opts.enableDragging = false;
515     }
516 
517     /**
518      * 获取Marker是否能被拖拽的状态
519      * @return {Boolean} true为可以拖拽，false为不能被拖拽
520      * 
521      * @example <b>参考示例：</b>
522      * myRichMarkerObject.isDraggable();
523      */
524     RichMarker.prototype.isDraggable = function () {
525         return this._opts.enableDragging;
526     }
527 
528     /**
529      * 获取Marker的显示位置
530      * @return {BMap.Point} 显示的位置
531      * 
532      * @example <b>参考示例：</b>
533      * myRichMarkerObject.getPosition();
534      */
535     RichMarker.prototype.getPosition = function () {
536         return this._position;
537     }
538 
539     /**
540      * 设置Marker的显示位置
541      * @param {BMap.Point} position 需要设置的位置
542      * @return 无返回值
543      * 
544      * @example <b>参考示例：</b>
545      * myRichMarkerObject.setPosition(new BMap.Point(116.30816, 40.056863));
546      */
547     RichMarker.prototype.setPosition = function (position) {
548         if (!position instanceof BMap.Point) {
549             return;
550         }
551         this._position = position;
552         this.draw();
553     }
554 
555     /**
556      * 获取Marker的偏移量
557      * @return {BMap.Size} Marker的偏移量
558      * 
559      * @example <b>参考示例：</b>
560      * myRichMarkerObject.getAnchor();
561      */
562     RichMarker.prototype.getAnchor = function () {
563         return this._opts.anchor;
564     }
565 
566     /**
567      * 设置Marker的偏移量
568      * @param {BMap.Size} anchor 需要设置的偏移量
569      * @return 无返回值
570      * 
571      * @example <b>参考示例：</b>
572      * myRichMarkerObject.setAnchor(new BMap.Size(-72, -84));
573      */
574     RichMarker.prototype.setAnchor = function (anchor) {
575         if (!anchor instanceof BMap.Size) {
576             return;
577         }
578         this._opts.anchor = anchor;
579         this.draw();
580     }
581 
582     /**
583      * 添加用户的自定义的内容
584      * 
585      * @private
586      * @return 无返回值
587      */
588     RichMarker.prototype._appendContent = function () {
589         var content = this._content;
590         // 用户输入的内容是字符串，需要转化成dom节点
591         if (typeof content == "string") {
592             var div = document.createElement('DIV');
593             div.innerHTML = content;
594             if (div.childNodes.length == 1) {
595                 content = (div.removeChild(div.firstChild));
596             } else {
597                 var fragment = document.createDocumentFragment();
598                 while (div.firstChild) {
599                     fragment.appendChild(div.firstChild);
600                 }
601                 content = fragment;
602             }
603         }
604         this._container.innerHTML = "";
605         this._container.appendChild(content);
606     }
607 
608     /**
609      * 获取Marker的内容
610      * @return {String | HTMLElement} 当前内容
611      * 
612      * @example <b>参考示例：</b>
613      * myRichMarkerObject.getContent();
614      */
615     RichMarker.prototype.getContent = function () {
616         return this._content;
617     }
618 
619     /**
620      * 设置Marker的内容
621      * @param {String | HTMLElement} content 需要设置的内容
622      * @return 无返回值
623      * 
624      * @example <b>参考示例：</b>
625      * var htm = "<div style='background:#E7F0F5;color:#0082CB;border:1px solid #333'>"
626      *              +     "欢迎使用百度地图API！"
627      *              +     "<img src='http://map.baidu.com/img/logo-map.gif' border='0' />"
628      *              + "</div>";
629      * myRichMarkerObject.setContent(htm);
630      */
631     RichMarker.prototype.setContent = function (content) {
632         if (!content) {
633             return;
634         }
635         // 存储用户输入的Marker显示内容
636         this._content = content;
637         // 添加进主容器
638         this._appendContent();
639     }
640 
641     /**
642      * 获取Marker的高宽
643      * 
644      * @private
645      * @return {BMap.Size} 当前高宽
646      */
647     RichMarker.prototype._getContainerSize = function () {
648         if (!this._container) {
649             return;
650         }
651         var h = this._container.offsetHeight;
652         var w = this._container.offsetWidth;
653         this._size = new BMap.Size(w, h);
654     }
655 
656     /**
657      * 获取Marker的宽度
658      * @return {Number} 当前宽度
659      * 
660      * @example <b>参考示例：</b>
661      * myRichMarkerObject.getWidth();
662      */
663     RichMarker.prototype.getWidth = function () {
664         if (!this._size) {
665             return;
666         }
667         return this._size.width;
668     }
669 
670     /**
671      * 设置Marker的宽度
672      * @param {Number} width 需要设置的宽度
673      * @return 无返回值
674      * 
675      * @example <b>参考示例：</b>
676      * myRichMarkerObject.setWidth(300);
677      */
678     RichMarker.prototype.setWidth = function (width) {
679         if (!this._container) {
680             return;
681         }
682         this._container.style.width = width + "px";
683         this._getContainerSize();
684     }
685 
686     /**
687      * 获取Marker的高度
688      * @return {Number} 当前高度
689      * 
690      * @example <b>参考示例：</b>
691      * myRichMarkerObject.getHeight();
692      */
693     RichMarker.prototype.getHeight = function () {
694         if (!this._size) {
695             return;
696         }
697         return this._size.height;
698     }
699 
700     /**
701      * 设置Marker的高度
702      * @param {Number} height 需要设置的高度
703      * @return 无返回值
704      * 
705      * @example <b>参考示例：</b>
706      * myRichMarkerObject.setHeight(200);
707      */
708     RichMarker.prototype.setHeight = function (height) {
709         if (!this._container) {
710             return;
711         }
712         this._container.style.height = height + "px";
713         this._getContainerSize();
714     }
715 
716     /**
717      * 设置Marker的各种事件
718      * 
719      * @private
720      * @return 无返回值
721      */
722     RichMarker.prototype._setEventDispath = function () {
723         var me = this,
724             div = me._container,
725             isMouseDown = false,
726             // 鼠标是否按下，用以判断鼠标移动过程中的拖拽计算
727             startPosition = null; // 拖拽时，鼠标按下的初始位置，拖拽的辅助计算参数   
728             
729         // 通过e参数获取当前鼠标所在位置
730         function _getPositionByEvent(e) {
731             var e = window.event || e,
732                 x = e.pageX || e.clientX || 0,
733                 y = e.pageY || e.clientY || 0,
734                 pixel = new BMap.Pixel(x, y),
735                 point = me._map.pixelToPoint(pixel);
736             return {
737                 "pixel": pixel,
738                 "point": point
739             };
740         }
741 
742         // 单击事件
743         baidu.on(div, "onclick", function (e) {
744             /**
745              * 点击Marker时，派发事件的接口
746              * @name RichMarker#onclick
747              * @event
748              * @param {Event Object} e 回调函数会返回event参数，包括以下返回值：
749              * <br />{"<b>target</b> : {BMap.Overlay} 触发事件的元素,
750              * <br />"<b>type</b>：{String} 事件类型}
751              *
752              * @example <b>参考示例：</b>
753              * myRichMarkerObject.addEventListener("onclick", function(e) { 
754              *     alert(e.type);  
755              * });
756              */
757             _dispatchEvent(me, "onclick");
758             _stopAndPrevent(e);
759         });
760 
761         // 双击事件
762         baidu.on(div, "ondblclick", function (e) {
763             var position = _getPositionByEvent(e);
764             /**
765              * 双击Marker时，派发事件的接口
766              * @name RichMarker#ondblclick
767              * @event
768              * @param {Event Object} e 回调函数会返回event参数，包括以下返回值：
769              * <br />{"<b>target</b> : {BMap.Overlay} 触发事件的元素,
770              * <br />"<b>type</b>：{String} 事件类型,
771              * <br />"<b>point</b>：{BMap.Point} 鼠标的物理坐标,
772              * <br />"<b>pixel</b>：{BMap.Pixel} 鼠标的像素坐标}
773              *
774              * @example <b>参考示例：</b>
775              * myRichMarkerObject.addEventListener("ondblclick", function(e) { 
776              *     alert(e.type);  
777              * });
778              */
779             _dispatchEvent(me, "ondblclick", {
780                 "point": position.point,
781                 "pixel": position.pixel
782             });
783             _stopAndPrevent(e);
784         });
785 
786         // 鼠标移上事件
787         div.onmouseover = function (e) {
788             var position = _getPositionByEvent(e);
789             /**
790              * 鼠标移到Marker上时，派发事件的接口
791              * @name RichMarker#onmouseover
792              * @event
793              * @param {Event Object} e 回调函数会返回event参数，包括以下返回值：
794              * <br />{"<b>target</b> : {BMap.Overlay} 触发事件的元素,
795              * <br />"<b>type</b>：{String} 事件类型,
796              * <br />"<b>point</b>：{BMap.Point} 鼠标的物理坐标,
797              * <br />"<b>pixel</b>：{BMap.Pixel} 鼠标的像素坐标}
798              *
799              * @example <b>参考示例：</b>
800              * myRichMarkerObject.addEventListener("onmouseover", function(e) { 
801              *     alert(e.type);  
802              * });
803              */
804             _dispatchEvent(me, "onmouseover", {
805                 "point": position.point,
806                 "pixel": position.pixel
807             });
808             _stopAndPrevent(e);
809         }
810 
811         // 鼠标移出事件
812         div.onmouseout = function (e) {
813             var position = _getPositionByEvent(e);
814             /**
815              * 鼠标移出Marker时，派发事件的接口
816              * @name RichMarker#onmouseout
817              * @event
818              * @param {Event Object} e 回调函数会返回event参数，包括以下返回值：
819              * <br />{"<b>target</b> : {BMap.Overlay} 触发事件的元素,
820              * <br />"<b>type</b>：{String} 事件类型,
821              * <br />"<b>point</b>：{BMap.Point} 鼠标的物理坐标,
822              * <br />"<b>pixel</b>：{BMap.Pixel} 鼠标的像素坐标}
823              *
824              * @example <b>参考示例：</b>
825              * myRichMarkerObject.addEventListener("onmouseout", function(e) { 
826              *     alert(e.type);  
827              * });
828              */
829             _dispatchEvent(me, "onmouseout", {
830                 "point": position.point,
831                 "pixel": position.pixel
832             });
833             _stopAndPrevent(e);
834         }
835 
836         // 鼠标弹起事件
837         var mouseUpEvent = function (e) {
838                 var position = _getPositionByEvent(e);
839                 /**
840                  * 在Marker上弹起鼠标时，派发事件的接口
841                  * @name RichMarker#onmouseup
842                  * @event
843                  * @param {Event Object} e 回调函数会返回event参数，包括以下返回值：
844                  * <br />{"<b>target</b> : {BMap.Overlay} 触发事件的元素,
845                  * <br />"<b>type</b>：{String} 事件类型,
846                  * <br />"<b>point</b>：{BMap.Point} 鼠标的物理坐标,
847                  * <br />"<b>pixel</b>：{BMap.Pixel} 鼠标的像素坐标}
848                  *
849                  * @example <b>参考示例：</b>
850                  * myRichMarkerObject.addEventListener("onmouseup", function(e) { 
851                  *     alert(e.type);  
852                  * });
853                  */
854                 _dispatchEvent(me, "onmouseup", {
855                     "point": position.point,
856                     "pixel": position.pixel
857                 });
858 
859                 if (me._container.releaseCapture) {
860                     baidu.un(div, "onmousemove", mouseMoveEvent);
861                     baidu.un(div, "onmouseup", mouseUpEvent);
862                 } else {
863                     baidu.un(window, "onmousemove", mouseMoveEvent);
864                     baidu.un(window, "onmouseup", mouseUpEvent);
865                 }
866 
867                 // 判断是否需要进行拖拽事件的处理
868                 if (!me._opts.enableDragging) {
869                     _stopAndPrevent(e);
870                     return;
871                 }
872                 // 拖拽结束时，释放鼠标捕获
873                 me._container.releaseCapture && me._container.releaseCapture();
874                 /**
875                  * 拖拽Marker结束时，派发事件的接口
876                  * @name RichMarker#ondragend
877                  * @event
878                  * @param {Event Object} e 回调函数会返回event参数，包括以下返回值：
879                  * <br />{"<b>target</b> : {BMap.Overlay} 触发事件的元素,
880                  * <br />"<b>type</b>：{String} 事件类型,
881                  * <br />"<b>point</b>：{BMap.Point} 鼠标的物理坐标,
882                  * <br />"<b>pixel</b>：{BMap.Pixel} 鼠标的像素坐标}
883                  *
884                  * @example <b>参考示例：</b>
885                  * myRichMarkerObject.addEventListener("ondragend", function(e) { 
886                  *     alert(e.type);  
887                  * });
888                  */
889                 _dispatchEvent(me, "ondragend", {
890                     "point": position.point,
891                     "pixel": position.pixel
892                 });
893                 isMouseDown = false;
894                 startPosition = null;
895                 // 设置拖拽结束后的鼠标手型
896                 me._setCursor("dragend");
897                 // 拖拽过程中防止文字被选中
898                 me._container.style['MozUserSelect'] = '';
899                 me._container.style['KhtmlUserSelect'] = '';
900                 me._container.style['WebkitUserSelect'] = '';
901                 me._container['unselectable'] = 'off';
902                 me._container['onselectstart'] = function () {};
903 
904                 _stopAndPrevent(e);
905             }
906 
907             // 鼠标移动事件
908         var mouseMoveEvent = function (e) {
909                 // 判断是否需要进行拖拽事件的处理
910                 if (!me._opts.enableDragging || !isMouseDown) {
911                     return;
912                 }
913                 var position = _getPositionByEvent(e);
914 
915                 // 计算当前marker应该所在的位置
916                 var startPixel = me._map.pointToPixel(me._position);
917                 var x = position.pixel.x - startPosition.x + startPixel.x;
918                 var y = position.pixel.y - startPosition.y + startPixel.y;
919 
920                 startPosition = position.pixel;
921                 me._position = me._map.pixelToPoint(new BMap.Pixel(x, y));
922                 me.draw();
923                 // 设置拖拽过程中的鼠标手型
924                 me._setCursor("dragging");
925                 /**
926                  * 拖拽Marker的过程中，派发事件的接口
927                  * @name RichMarker#ondragging
928                  * @event
929                  * @param {Event Object} e 回调函数会返回event参数，包括以下返回值：
930                  * <br />{"<b>target</b> : {BMap.Overlay} 触发事件的元素,
931                  * <br />"<b>type</b>：{String} 事件类型,
932                  * <br />"<b>point</b>：{BMap.Point} 鼠标的物理坐标,
933                  * <br />"<b>pixel</b>：{BMap.Pixel} 鼠标的像素坐标}
934                  *
935                  * @example <b>参考示例：</b>
936                  * myRichMarkerObject.addEventListener("ondragging", function(e) { 
937                  *     alert(e.type);  
938                  * });
939                  */
940                 _dispatchEvent(me, "ondragging", {
941                     "point": position.point,
942                     "pixel": position.pixel
943                 });
944                 _stopAndPrevent(e);
945             }
946 
947             // 鼠标按下事件
948             baidu.on(div, "onmousedown", function (e) {
949                 var position = _getPositionByEvent(e);
950                 /**
951                  * 在Marker上按下鼠标时，派发事件的接口
952                  * @name RichMarker#onmousedown
953                  * @event
954                  * @param {Event Object} e 回调函数会返回event参数，包括以下返回值：
955                  * <br />{"<b>target</b> : {BMap.Overlay} 触发事件的元素,
956                  * <br />"<b>type</b>：{String} 事件类型,
957                  * <br />"<b>point</b>：{BMap.Point} 鼠标的物理坐标,
958                  * <br />"<b>pixel</b>：{BMap.Pixel} 鼠标的像素坐标}
959                  *
960                  * @example <b>参考示例：</b>
961                  * myRichMarkerObject.addEventListener("onmousedown", function(e) { 
962                  *     alert(e.type);  
963                  * });
964                  */
965                 _dispatchEvent(me, "onmousedown", {
966                     "point": position.point,
967                     "pixel": position.pixel
968                 });
969 
970                 if (me._container.setCapture) {
971                     baidu.on(div, "onmousemove", mouseMoveEvent);
972                     baidu.on(div, "onmouseup", mouseUpEvent);
973                 } else {
974                     baidu.on(window, "onmousemove", mouseMoveEvent);
975                     baidu.on(window, "onmouseup", mouseUpEvent);
976                 }
977 
978                 // 判断是否需要进行拖拽事件的处理
979                 if (!me._opts.enableDragging) {
980                     _stopAndPrevent(e);
981                     return;
982                 }
983                 startPosition = position.pixel;
984                 /**
985                  * 开始拖拽Marker时，派发事件的接口
986                  * @name RichMarker#ondragstart
987                  * @event
988                  * @param {Event Object} e 回调函数会返回event参数，包括以下返回值：
989                  * <br />{"<b>target</b> : {BMap.Overlay} 触发事件的元素,
990                  * <br />"<b>type</b>：{String} 事件类型,
991                  * <br />"<b>point</b>：{BMap.Point} 鼠标的物理坐标,
992                  * <br />"<b>pixel</b>：{BMap.Pixel} 鼠标的像素坐标}
993                  *
994                  * @example <b>参考示例：</b>
995                  * myRichMarkerObject.addEventListener("ondragstart", function(e) { 
996                  *     alert(e.type);  
997                  * });
998                  */
999                 _dispatchEvent(me, "ondragstart", {
1000                     "point": position.point,
1001                     "pixel": position.pixel
1002                 });
1003                 isMouseDown = true;
1004                 // 设置拖拽开始的鼠标手型
1005                 me._setCursor("dragstart");
1006                 // 拖拽开始时，设置鼠标捕获
1007                 me._container.setCapture && me._container.setCapture();
1008                 // 拖拽过程中防止文字被选中
1009                 me._container.style['MozUserSelect'] = 'none';
1010                 me._container.style['KhtmlUserSelect'] = 'none';
1011                 me._container.style['WebkitUserSelect'] = 'none';
1012                 me._container['unselectable'] = 'on';
1013                 me._container['onselectstart'] = function () {
1014                     return false;
1015                 };
1016                 _stopAndPrevent(e);
1017             });
1018     }
1019 
1020     /**
1021      * 设置拖拽过程中的手型
1022      *
1023      * @private 
1024      * @param {string} cursorType 需要设置的手型类型
1025      */
1026     RichMarker.prototype._setCursor = function (cursorType) {
1027         var cursor = '';
1028         var cursorStylies = {
1029             "moz": {
1030                 "dragstart": "-moz-grab",
1031                 "dragging": "-moz-grabbing",
1032                 "dragend": "pointer"
1033             },
1034             "other": {
1035                 "dragstart": "move",
1036                 "dragging": "move",
1037                 "dragend": "pointer"
1038             }
1039         };
1040 
1041         if (navigator.userAgent.indexOf('Gecko/') !== -1) {
1042             cursor = cursorStylies.moz[cursorType];
1043         } else {
1044             cursor = cursorStylies.other[cursorType];
1045         }
1046 
1047         if (this._container.style.cursor != cursor) {
1048             this._container.style.cursor = cursor;
1049         }
1050     }
1051 
1052     /**
1053      * 删除Marker
1054      * 
1055      * @private
1056      * @return 无返回值
1057      */
1058     RichMarker.prototype.remove = function () {
1059         _dispatchEvent(this, "onremove");
1060         // 清除主容器上的事件绑定
1061         if (this._container) {
1062             _purge(this._container);
1063         }
1064         // 删除主容器
1065         if (this._container && this._container.parentNode) {
1066             this._container.parentNode.removeChild(this._container);
1067         }
1068     }
1069 
1070     /**
1071      * 集中派发事件函数
1072      *
1073      * @private
1074      * @param {Object} instance 派发事件的实例
1075      * @param {String} type 派发的事件名
1076      * @param {Json} opts 派发事件里添加的参数，可选
1077      */
1078     function _dispatchEvent(instance, type, opts) {
1079         type.indexOf("on") != 0 && (type = "on" + type);
1080         var event = new baidu.lang.Event(type);
1081         if ( !! opts) {
1082             for (var p in opts) {
1083                 event[p] = opts[p];
1084             }
1085         }
1086         instance.dispatchEvent(event);
1087     }
1088 
1089     /**
1090      * 清理DOM事件，防止循环引用
1091      *
1092      * @type {DOM} dom 需要清理的dom对象
1093      */
1094     function _purge(dom) {
1095         if (!dom) {
1096             return;
1097         }
1098         var attrs = dom.attributes,
1099             name = "";
1100         if (attrs) {
1101             for (var i = 0, n = attrs.length; i < n; i++) {
1102                 name = attrs[i].name;
1103                 if (typeof dom[name] === "function") {
1104                     dom[name] = null;
1105                 }
1106             }
1107         }
1108         var child = dom.childnodes;
1109         if (child) {
1110             for (var i = 0, n = child.length; i < n; i++) {
1111                 _purge(dom.childnodes[i]);
1112             }
1113         }
1114     }
1115 
1116     /**
1117      * 停止事件冒泡传播
1118      *
1119      * @type {Event} e e对象
1120      */
1121     function _stopAndPrevent(e) {
1122         var e = window.event || e;
1123         e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
1124         return baidu.preventDefault(e);
1125     }
1126 })();