
(function(window){

    console.log("init LangScene") ;
    //window.Langscenedoname || (window.langsceneDoname="www.langscene.com") ;
    var urlprefix = window.langsceneLibUrlPrefix || '' ;

    var scripts = [
	urlprefix+"public/lib/jquery-1.9.1.min.js"
//	, urlprefix+"public/lib/jquery-ui/jquery-ui.min.js"
	, urlprefix+"public/lib/wordpicker.js"
	, urlprefix+"public/lib/ui.js"
	, urlprefix+"public/lib/main.js"
    ] ;

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


    loadStyle(urlprefix+"public/style/style.css?r="+now.getTime().toString()) ;
    function loadStyle (href) {
        var eleLink = document.createElement("link") ;
        eleLink.href = href ;
        eleLink.type="text/css" ;
        eleLink.rel="stylesheet" ;
        document.head.appendChild(eleLink) ;
    }

}) (window) ;
