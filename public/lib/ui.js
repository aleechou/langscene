jQuery(function($){

$.langsceneUi = {

	setup: function(){

		this._createUi() ;

		// 窗口尺寸改变
		var onWindowResize = (function (){
			this.$uiLangScene.css({
				top: $(window).height()/2 - this.$uiLangScene.height()/2
				, left: $(window).width() - this.$uiLangSceneBtns.width()
			} ) ;
		}).bind(this) ;
		$(window).resize(onWindowResize) ;
		onWindowResize() ;

		// 点词
		this.$uiLangSceneBtns.find(".langscene-btn-pickkword").click(function(){
			$(this).addClass("langscene-word-picking") ;
			$.wordpicker.pickWord() ;
		}) ;
	}


	, _createUi: function(){

		this.$uiLangScene =
			$(
				"<div id='langscene-ui'>" +
					"<div class='langscene-btns'>" +
						"<div class='langscene-btn-pickkword'>点词</div>" +
					"</div>" +
				"</div>"
			)
			.appendTo(document.body)
			.css({
				"position":"fixed"
				, "z-index": 10000
			}) ;
		this.$uiLangSceneBtns = this.$uiLangScene.find(".langscene-btns") ;
	}
}

}) ;