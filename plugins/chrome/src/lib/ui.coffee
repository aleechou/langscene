jQuery () ->

    $.langsceneUi =
        setup: ->
            console.log 'init langscene ui'
            @_createUi()

            # 窗口尺寸
            onWindowResize = =>
                @$uiLangScene.css
                    top: $(window).height() - @$uiLangScene.height()
                    left: $(window).width() - @$uiLangSceneBtns.width() - 10

            $(window).resize onWindowResize
            onWindowResize()

            # 点击取词
            @$uiLangSceneBtns.find(".langscene-btn-pickword")
                .click ->
                    # 取消取词
                    if $.wordpicker.picking
                        $(this).removeClass('langscene-btn-pickword-picking')
                            .text '取消'
                        $.wordpicker.disable() ;
                    # 开始取词
                    else
                        $(this).addClass('langscene-btn-pickword-picking')
                            .text '取词'
                        $.wordpicker.enable() ;

                    # 取消click事件传递，避免触发取词
                    false

            $.wordpicker.on 'picked', (word,$event)=>
                return if not word
                @pickedWord = word
                do $.wordpicker.disable
                @$uiPickupWordBtn.text word
                @$uiPickupWord
                    .show()
                    .css
                        top:  $event.pageY - @$uiPickupWord.outerHeight() - 10
                        left: $event.pageX - @$uiPickupWord.outerWidth()/2
                @pickedUp = true

            # 点击网页任意位置
            $(document).click (event) =>
                do @$uiPickupWord.hide
                return if not @pickedUp
                @pickedUp = false ;
                # 选择点中的词
                if event.originalEvent.srcElement == @$uiPickupWordBtn[0]
                    console.log 'bingo!', @pickedWord

                event.originalEvent.returnValue = false

        _createUi: ->

            @$uiLangScene = $("""<div id='langscene-ui'>
                    <div class='langscene-btns'>
                        <div class='langscene-btn-pickword'></div>
                    </div>
                </div>""")
                .appendTo(document.body)
                .css
                    position: 'fixed'
                    'z-index': 10000

            @$uiLangSceneBtns = @$uiLangScene.find '.langscene-btns'

            @$uiPickupWord = $("""<div class='langscene-pickup-word'>
                <div class='langscene-pickup-btn'></div>
                </div>""")
                .appendTo document.body

            @$uiPickupWordBtn = @$uiPickupWord.find('.langscene-pickup-btn') ;


        pickedUp: false
        pickedWord: undefined
