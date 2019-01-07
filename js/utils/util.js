function getCurTime (){
    return new Date().getTime();
}
/*-------------------------- +
  获取id, class, tagName
 +-------------------------- */
 var get = {
	byId: function(id) {
		return typeof id === "string" ? document.getElementById(id) : id
	},
	byClass: function(sClass, oParent) {
		var aClass = [];
		var reClass = new RegExp("(^| )" + sClass + "( |$)");
		var aElem = this.byTagName("*", oParent);
		for (var i = 0; i < aElem.length; i++) reClass.test(aElem[i].className) && aClass.push(aElem[i]);
		return aClass
	},
	byTagName: function(elem, obj) {
		return (obj || document).getElementsByTagName(elem)
	}
};
var dragMinWidth = 250;
var dragMinHeight = 124;
/*-------------------------- +
  拖拽函数
 +-------------------------- */
 function drag(oDrag, handle,oPanel)
 {
     var disX = dixY = 0;
     handle = handle || oDrag;
     handle.style.cursor = "move";
     handle.onmousedown = function (event)
     {
         var event = event || window.event;
         disX = event.clientX - oDrag.offsetLeft;
         disY = event.clientY - oDrag.offsetTop;
         
         document.onmousemove = function (event)
         {
             var event = event || window.event;
             var iL = event.clientX - disX;
             var iT = event.clientY - disY;
            //  var maxL = document.documentElement.clientWidth - oDrag.offsetWidth;
            //  var maxT = document.documentElement.clientHeight - oDrag.offsetHeight;
             var maxL = oPanel.clientWidth - oDrag.offsetWidth;
             var maxT = oPanel.clientHeight - oDrag.offsetHeight;
             
             
             iL <= 0 && (iL = 0);
             iT <= 0 && (iT = 0);
             iL >= maxL && (iL = maxL);
             iT >= maxT && (iT = maxT);
             
            //  oDrag.style.left = iL + "px";
            //  oDrag.style.top = iT + "px";
             oDrag.style.left = iL*100/oPanel.clientWidth +'%' ;
             oDrag.style.top = iT*100/oPanel.clientHeight +'%' ;
             
             return false
         };
         
         document.onmouseup = function ()
         {
             document.onmousemove = null;
             document.onmouseup = null;
             this.releaseCapture && this.releaseCapture()
         };
         this.setCapture && this.setCapture();
         return false
     };	
 }
 /*-------------------------- +
   改变大小函数
  +-------------------------- */
 function resize(oParent, handle,oPanel, isLeft, isTop, lockX, lockY)
 {
     handle.onmousedown = function (event)
     {
         var event = event || window.event;
         var disX = event.clientX - handle.offsetLeft;
         var disY = event.clientY - handle.offsetTop;	
         var iParentTop = oParent.offsetTop;
         var iParentLeft = oParent.offsetLeft;
         var iParentWidth = oParent.offsetWidth;
         var iParentHeight = oParent.offsetHeight;
         
         document.onmousemove = function (event)
         {
             var event = event || window.event;
             
             var iL = event.clientX - disX;
             var iT = event.clientY - disY;
             var maxW = oPanel.clientWidth - oParent.offsetLeft - 2;
             var maxH = oPanel.clientHeight - oParent.offsetTop - 2;			
             var iW = isLeft ? iParentWidth - iL : handle.offsetWidth + iL;
             var iH = isTop ? iParentHeight - iT : handle.offsetHeight + iT;
             
             isLeft && (oParent.style.left = iParentLeft + iL + "px");
             isTop && (oParent.style.top = iParentTop + iT + "px");
             
             iW < dragMinWidth && (iW = dragMinWidth);
             iW > maxW && (iW = maxW);
            //  lockX || (oParent.style.width = iW + "px");
             lockX || (oParent.style.width = iW*100/oPanel.clientWidth + "100%");
             
             iH < dragMinHeight && (iH = dragMinHeight);
             iH > maxH && (iH = maxH);
            //  lockY || (oParent.style.height = iH + "px");
            lockY || (oParent.style.height = iH*100/oPanel.clientHeight + "100%");
             
             if((isLeft && iW == dragMinWidth) || (isTop && iH == dragMinHeight)) document.onmousemove = null;

             return false;	
         };
         document.onmouseup = function ()
         {
             document.onmousemove = null;
             document.onmouseup = null;
             this.releaseCapture && this.releaseCapture()
         };
         this.setCapture && this.setCapture();
         return false;
     }
 };


 //================================================================================================
function getEvent(){
    //如果为ie或chrome
    if(window.event){return window.event;}
    //针对firefox
    func = getEvent.caller; //获取函数调用者
    while(func != null){
        var arg0 = func.arguments[0]; //获取调用者第一个参数
        //判断参数是否为空
        if(arg0){
            //判断arg0是否为事件对象
          if((arg0.constructor == Event || arg0.constructor == MouseEvent
            || arg0.constructor == KeyboardEvent)
            ||(typeof(arg0) == "object" && arg0.preventDefault
            && arg0.stopPropagation)){
             return arg0;
           }
        }
        //获取func调用者
        func = func.caller;
    }
    return null;
}

//阻止事件冒泡
function cancelBubble() {
    event = getEvent();
     // Firefox chrome
  if(event.preventDefault) 
  {  
    event.preventDefault();  
    event.stopPropagation(); 
   } else 
   { 
    //ie 
    event.cancelBubble=true;  
    event.returnValue = false;
   }  
}
//========================================================================================================

/*监听div大小变化*/
var EleResize = {
    _handleResize: function (e) {
        var ele = e.target || e.srcElement;
        var trigger = ele.__resizeTrigger__;
        if (trigger) {
            var handlers = trigger.__z_resizeListeners;
            if (handlers) {
                var size = handlers.length;
                for (var i = 0; i < size; i++) {
                    var h = handlers[i];
                    var handler = h.handler;
                    var context = h.context;
                    handler.apply(context, [e]);
                }
            }
        }
    },
    _removeHandler: function (ele, handler, context) {
        var handlers = ele.__z_resizeListeners;
        if (handlers) {
            var size = handlers.length;
            for (var i = 0; i < size; i++) {
                var h = handlers[i];
                if (h.handler === handler && h.context === context) {
                    handlers.splice(i, 1);
                    return;
                }
            }
        }
    },
    _createResizeTrigger: function (ele) {
        var obj = document.createElement('object');
        obj.setAttribute('style',
            'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden;opacity: 0; pointer-events: none; z-index: -1;');
        obj.onload = EleResize._handleObjectLoad;
        obj.type = 'text/html';
        ele.appendChild(obj);
        obj.data = 'about:blank';
        return obj;
    },
    _handleObjectLoad: function (evt) {
        this.contentDocument.defaultView.__resizeTrigger__ = this.__resizeElement__;
        this.contentDocument.defaultView.addEventListener('resize', EleResize._handleResize);
    }
};
if (document.attachEvent) {
    //ie9-10
    EleResize.on = function (ele, handler, context) {
        var handlers = ele.__z_resizeListeners;
        if (!handlers) {
            handlers = [];
            ele.__z_resizeListeners = handlers;
            ele.__resizeTrigger__ = ele;
            ele.attachEvent('onresize', EleResize._handleResize);
        }
        handlers.push({
            handler: handler,
            context: context
        });
    };
    EleResize.off = function (ele, handler, context) {
        var handlers = ele.__z_resizeListeners;
        if (handlers) {
            EleResize._removeHandler(ele, handler, context);
            if (handlers.length === 0) {
                ele.detachEvent('onresize', EleResize._handleResize);
                delete  ele.__z_resizeListeners;
            }
        }
    }
} else {
    EleResize.on = function (ele, handler, context) {
        var handlers = ele.__z_resizeListeners;
        if (!handlers) {
            handlers = [];
            ele.__z_resizeListeners = handlers;

            if (getComputedStyle(ele, null).position === 'static') {
                ele.style.position = 'relative';
            }
            var obj = EleResize._createResizeTrigger(ele);
            ele.__resizeTrigger__ = obj;
            obj.__resizeElement__ = ele;
        }
        handlers.push({
            handler: handler,
            context: context
        });
    };
    EleResize.off = function (ele, handler, context) {
        var handlers = ele.__z_resizeListeners;
        if (handlers) {
            EleResize._removeHandler(ele, handler, context);
            if (handlers.length === 0) {
                var trigger = ele.__resizeTrigger__;
                if (trigger) {
                    trigger.contentDocument.defaultView.removeEventListener('resize', EleResize._handleResize);
                    ele.removeChild(trigger);
                    delete ele.__resizeTrigger__;
                }
                delete  ele.__z_resizeListeners;
            }
        }
    }
}
function initResize(boxId, containerId, oPanel) {
    var oDrag = document.getElementById(boxId);
    var oCon = document.getElementById(containerId);
    var oL = get.byClass("resizeL", oDrag)[0];
    var oT = get.byClass("resizeT", oDrag)[0];
    var oR = get.byClass("resizeR", oDrag)[0];
    var oB = get.byClass("resizeB", oDrag)[0];
    var oLT = get.byClass("resizeLT", oDrag)[0];
    var oTR = get.byClass("resizeTR", oDrag)[0];
    var oBR = get.byClass("resizeBR", oDrag)[0];
    var oLB = get.byClass("resizeLB", oDrag)[0];

    drag(oDrag, oCon, oPanel);
    //四角
    resize(oDrag, oLT, oPanel, true, true, false, false);
    resize(oDrag, oTR, oPanel, false, true, false, false);
    resize(oDrag, oBR, oPanel, false, false, false, false);
    resize(oDrag, oLB, oPanel, true, false, false, false);
    //四边
    resize(oDrag, oL, oPanel, true, false, false, true);
    resize(oDrag, oT, oPanel, false, true, true, false);
    resize(oDrag, oR, oPanel, false, false, false, true);
    resize(oDrag, oB, oPanel, false, false, true, false);
}
//============================================================================
// 数组交换
function arrChange(arr,k,j){
    var c = arr[k];
    arr[k] = arr[j];
    arr[j] = c;
    return arr;
}


/*
* 获取某个元素下标
*
*       arrays  : 传入的数组
*
*       obj     : 需要获取下标的元素
* */
function contains(arrays, obj) {
    var i = arrays.length;
    while (i--) {
        if (arrays[i] === obj) {
            return i;
        }
    }
    return false;
}