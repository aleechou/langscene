jQuery(function($){

$.wordpicker = {

	picking: false

	, pickWord: function(){
		this.picking = true ;
		this._setupEvents() ;
	}

	, _setupEvents: function(){


		$("a,button").click(this._onLinkBtnClick) ;
	}
}

$.wordpicker._onLinkBtnClick = (function(){

	if( !this.picking )
	{
		return ;
	}

	if(event)
	{
		// 事件已经停止
		if(event.returnValue===false)
		{
			return ;
		}
		event.returnValue = false ;
	}

	// 取消浏览器默认行为
	return false ;

}).bind($.wordpicker) ;



}) ;
