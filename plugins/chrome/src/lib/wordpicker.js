jQuery(function($){



    // patch for document.caretRangeFromPoint)
    if (!document.caretRangeFromPoint) {
        document.caretRangeFromPoint = function(x, y) {
            var log = "";

            function inRect(x, y, rect) {
                return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
            }

            function inObject(x, y, object) {
                var rects = object.getClientRects();
                for (var i = rects.length; i--;)
                    if (inRect(x, y, rects[i]))
                        return true;
                return false;
            }

            function getTextNodes(node, x, y) {
                if (!inObject(x, y, node))
                    return [];

                var result = [];
                node = node.firstChild;
                while (node) {
                    if (node.nodeType == 3)
                        result.push(node);
                    if (node.nodeType == 1)
                        result = result.concat(getTextNodes(node, x, y));

                    node = node.nextSibling;
                }

                return result;
            }

            var element = document.elementFromPoint(x, y);
            var nodes = getTextNodes(element, x, y);
            if (!nodes.length)
                return null;
            var node = nodes[0];

            var range = document.createRange();
            range.setStart(node, 0);
            range.setEnd(node, 1);

            for (var i = nodes.length; i--;) {
                var node = nodes[i],
                    text = node.nodeValue;


                range = document.createRange();
                range.setStart(node, 0);
                range.setEnd(node, text.length);

                if (!inObject(x, y, range))
                    continue;

                for (var j = text.length; j--;) {
                    if (text.charCodeAt(j) <= 32)
                        continue;

                    range = document.createRange();
                    range.setStart(node, j);
                    range.setEnd(node, j + 1);

                    if (inObject(x, y, range)) {
                        range.setEnd(node, j);
                        return range;
                    }
                }
            }

            return range;
        };
    }


    $.fn.wordpickable = function(){


    } ;

    $.wordpicker = {

	picking: false
        , _cbs: {}

        ,  getWordAtPoint: function(elem, x, y) {
            try{
                if(elem.nodeType == elem.TEXT_NODE) {
                    var range = elem.ownerDocument.createRange();
                    range.selectNodeContents(elem);
                    var currentPos = 0;
                    var endPos = range.endOffset;
                    while(currentPos+1 < endPos) {
                        range.setStart(elem, currentPos);
                        range.setEnd(elem, currentPos+1);
                        if(range.getBoundingClientRect() && range.getBoundingClientRect().left <= x && range.getBoundingClientRect().right  >= x &&
                           range.getBoundingClientRect().top  <= y && range.getBoundingClientRect().bottom >= y) {
                            range.expand("word");
                            var ret = range.toString();
                            range.detach();
                            return(ret);
                        }
                        currentPos += 1;
                    }
                } else {
                    for(var i = 0; i < elem.childNodes.length; i++) {
                        var range = elem.childNodes[i].ownerDocument.createRange();
                        range.selectNodeContents(elem.childNodes[i]);
                        if(range.getBoundingClientRect() && range.getBoundingClientRect().left <= x && range.getBoundingClientRect().right  >= x &&
                           range.getBoundingClientRect().top  <= y && range.getBoundingClientRect().bottom >= y) {
                            range.detach();
                            return(this.getWordAtPoint(elem.childNodes[i], x, y));
                        } else {
                            range.detach();
                        }
                    }
                }
                return(null);
            }catch(e){
                console.log(e.stack) ;
                throw e ;
            }
        }

	, setup: function(){
            // text
            $(document).click(this._eventhandle.bind(this)) ;
	}

        , _eventhandle: function (event) {

            if(!this.picking)
                return ;
            if(!event || !event.originalEvent || !event.originalEvent.srcElement)
                return ;

            var word = this.getWordAtPoint(event.originalEvent.srcElement,event.originalEvent.x,event.originalEvent.y) ;

            this.emit('picked',[word,event]) ;

            event.originalEvent.cancelBubble = true ;
            event.originalEvent.stopPropagation && event.originalEvent.stopPropagation();
            return event.originalEvent.returnValue = false ;
        }

        , enable: function(){
            this.picking = true ;
        }

        , disable: function(){
            this.picking = false ;
        }

        , on: function (name,cb){
            this._cbs[name] || (this._cbs[name]=[]) ;
            this._cbs[name].push(cb) ;
        }
        , emit: function (name,args){
            if(!this._cbs[name])
                return ;
            for(var i=0;i<this._cbs[name].length;i++)
                this._cbs[name][i].apply(this,args) ;
        }
    } ;

}) ;
