jQuery ($) ->

    $.langsceneUi =
        setup: ->
            console.log 'init langscene ui'
            @_createUi()

            $(window).resize @onWindowUpdate.bind this
            do @onWindowUpdate

            # 点击取词
            @$uiLangScene.find(".switch")
                .click =>
                    do @togglePickWord

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
                        top:  $event.pageY - @$uiPickupWord.outerHeight()
                        left: $event.pageX - @$uiPickupWord.outerWidth()/2
                @pickedUp = true

            # 点击网页任意位置
            $(document).click (event) =>
                do @$uiPickupWord.hide
                return if not @pickedUp

                # 关闭取词开关
                @pickedUp = false ;
                @$uiLangScene.find('.switch-animate')
                    .removeClass('switch-on')
                    .addClass('switch-off')

                # 选择点中的词
                if event.originalEvent.srcElement == @$uiPickupWordBtn[0]
                    console.log 'bingo!', @pickedWord
                    # 查词
                    @$uiWordPanel.find('.langscene-query input').val @pickedWord
                    do @query
                    # 弹出面板
                    do @openWordPanel

                event.originalEvent.returnValue = false

            # 快捷键
            $(document).keydown (event) =>
                # 取词开关 alt+p
                if event.altKey and event.keyCode==80
                    do @togglePickWord
                # 弹出/收起 单词面板 alt+i
                if event.altKey and event.keyCode==73
                    do @toggleWordPanel

            # 展开/收起 单词解释
            @$uiWordPanel.on 'click', 'ul li.word', (event)=>
                $des = $(event?.originalEvent?.srcElement).data '$li.des'
                console.log '???', $des, $(event?.originalEvent?.srcElement).data
                # 收起其他
                do @$uiWordPanel.find('ui li.des').not($des).hide

                # 展开/收起 点击的单词
                do $des?.toggle
                do @onWindowUpdate

        _createUi: ->

            # 取词开关
            @$uiLangScene = $("""<div id='langscene-ui'>
                    <div class="switch has-switch"><div class="switch-off switch-animate"><span class="switch-left">ON</span><label>&nbsp;</label><span class="switch-right">PICK</span></div></div>
                    <span class="wordpad-switch fui-arrow-left"></span>
                </div>""")
                .appendTo(document.body)
                .css
                    position: 'fixed'
                    'z-index': 10000
            @$uiLangScene.find('.wordpad-switch').click =>
                console.log 'switch'
                if @wordPanelOpened
                    do @closeWordPanel
                else
                    do @openWordPanel

            # 取词后 弹出的按钮
            @$uiPickupWord = $("""<div class='langscene-pickup-word'>
                <div class='langscene-pickup-btn'></div>
                </div>""")
                .appendTo document.body
            @$uiPickupWordBtn = @$uiPickupWord.find('.langscene-pickup-btn') ;

            # 单词面板
            @$uiWordPanel = $("""<div class='langscene-wordpanel'>
                <form class='langscene-query'>
                    <input type='text' >
                    <button class="query-btn">Q</button>
                </form>
                <ul class="word-list"></ul>
            </div>""").appendTo document.body
            @wordPanelOpened = false
            @$uiWordPanel.find('form').submit (event) =>
                event.originalEvent.returnValue = false
                do @query
                false

        # 窗口尺寸
        onWindowUpdate: ->
            @$uiLangScene.css
                left: $(window).outerWidth() - @$uiLangScene.outerWidth() - 10
                top: $(window).outerHeight() - @$uiLangScene.outerHeight() - 50

            @$uiWordPanel.css
                left: $(window).outerWidth() - (if @wordPanelOpened then @$uiWordPanel.outerWidth() else 0)
                top: $(window).outerHeight() - @$uiWordPanel.outerHeight() - @$uiLangScene.outerHeight() - 50 - 5

        togglePickWord: ->
            # 取消取词
            if $.wordpicker.picking
                @$uiLangScene.find(".switch").find('.switch-animate')
                    .removeClass('switch-on')
                    .addClass('switch-off')
                $.wordpicker.disable() ;
            # 开始取词
            else
                @$uiLangScene.find(".switch").find('.switch-animate')
                    .removeClass('switch-off')
                    .addClass('switch-on')
                $.wordpicker.enable() ;

        # 打开单词面板
        openWordPanel: ->
            return if @wordPanelOpened
            @wordPanelOpened = true
            @$uiWordPanel.animate
                left: $(window).width() - @$uiWordPanel.width() - 5
            @$uiLangScene.find('.wordpad-switch').removeClass('fui-arrow-left')
                .addClass 'fui-arrow-right'
            do @$uiWordPanel.find('.langscene-query input').focus

        # 关闭单词面板
        closeWordPanel: ->
            return if not @wordPanelOpened
            @wordPanelOpened = false
            @$uiWordPanel.animate
                left: $(window).width()
            @$uiLangScene.find('.wordpad-switch').removeClass('fui-arrow-right')
                .addClass 'fui-arrow-left'

        toggleWordPanel: ->
            if @wordPaenlOpened then do @closeWordPanel else do @openWordPanel

        query: ->
            word = @$uiWordPanel.find('.langscene-query input').val() ;
            console.log 'query:', word
            return if not word

            $li = $("<li class='word'>#{word}</li>").appendTo @$uiWordPanel.find('ul.word-list')
            $lides = $("<li class='des' style='display:none'>loading ...</li>").insertAfter $li
            $li.data '$li.des', $lides
            do @onWindowUpdate

            $.get "http://dict.qq.com/dict?q=#{word}"
                , (json) =>
                    eval("json="+json) ;

                    html = ''
                    console.log json
                    if not json.local?.length
                        html = 'not fount this word'
                    else
                        res = json.local[0]
                        # 解释
                        for des in res.des||[]
                            html+= "<p>"+des.p+" "+des.d+"</p>"
                        # 单三、过去式等
                        html+= "<p>" if res.mor?.length
                        for mor,i in res.mor||[]
                            html+= ';' if i
                            html+= "<span>"+mor.c+": "+mor.m+"</span>"
                        html+= "</p>" if res.mor?.length
                        # links
                        html+= """<p class=word-links>
                            <a href="http://dict.cn/#{word}" target=_blank>dict.com</a>
                            <a href="http://www.google.com.hk/search?q=#{word}" target=_blank>Google</a>
                            <a href="http://www.baidu.com/s?wd=#{word}" target=_blank>Baidu</a>
                        </p>"""

                    $lides.html html
                    do @onWindowUpdate


        pickedUp: false
        pickedWord: undefined

