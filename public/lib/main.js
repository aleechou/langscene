jQuery(function($){

	$.langsceneUi.setup() ;

	console.log("LangScene has initialized.") ;






	$("div").click(function(e){
		console.log( getWordAtPoint(this, e.clientX,e.clientY) ) ;
	})

	$(document).mousemove(function(e){ console.log(e.clientX,e.clientY,e) })
	h2 = $("h2")[0] ;
	p = $("p")[1] ;
}) ;