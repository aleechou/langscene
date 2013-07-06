 
(function(window){

window.langsceneDoname || (window.langsceneDoname="www.langscene.com") ;
var urlprefix = "http://"+window.langsceneDoname+"/" ;

var scripts = [
	urlprefix+"ocframework/public/lib/3party/underscore-1.4.4.js"
	, urlprefix+"ocframework/public/lib/3party/jquery-1.9.1.min.js"
	, urlprefix+"ocframework/public/lib/3party/jquery-ui/jquery-ui.min.js"
	, urlprefix+"langscene/public/lib/wordpicker.js"
	, urlprefix+"langscene/public/lib/ui.js"
	, urlprefix+"langscene/public/lib/main.js"
] ;


for(var i=0;i<scripts.length;i++)
{
	var eleScript = document.createElement("script") ;
	eleScript.src = scripts[i] ;
	document.body.appendChild(eleScript) ;
}



var eleLink = document.createElement("link") ;
eleLink.href = urlprefix+"langscene/public/style/style.css" ;
eleLink.type="text/css" ;
eleLink.rel="stylesheet" ;
document.head.appendChild(eleLink) ;





}) (window) ;






///////////////
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









function getWordAtPoint(elem, x, y) {
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
					return(getWordAtPoint(elem.childNodes[i], x, y));
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
