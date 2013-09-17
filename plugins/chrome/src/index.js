

(function(window){

    console.log("init LangScene") ;

    // as chrome extension
    if(typeof chrome!='undefined')
        var urlprefix = chrome.extension.getURL('') ;
    else
    {
        console.log("find url prefix") ;
    }
    console.log(urlprefix) ;

    var scripts = [
	urlprefix+"src/lib/wordpicker.js"
	, urlprefix+"src/lib/ui.js"
	, urlprefix+"src/lib/main.js"
    ] ;
    if(!window.jQuery)
        scripts.unshift(urlprefix+"src/lib/jquery-1.9.1.min.js") ;

    var now = new Date ;
    (function () {
        var src = scripts.shift() ;
        if(!src)
            return ;

	var eleScript = document.createElement("script") ;
        eleScript.defer = true ;
	eleScript.src = src + '?r='+now.getTime().toString() ;
        eleScript.onload = arguments.callee ;
	document.body.appendChild(eleScript) ;
    }) () ;


    loadStyle(urlprefix+"src/style/style.css?r="+now.getTime().toString()) ;
    function loadStyle (href) {
        var eleLink = document.createElement("link") ;
        eleLink.href = href ;
        eleLink.type="text/css" ;
        eleLink.rel="stylesheet" ;
        document.head.appendChild(eleLink) ;
    }

}) (window) ;
