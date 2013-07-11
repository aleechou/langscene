langscene
=========

这是一个词典浏览器插件。

LangScene 提供更好的网页取词体验，点击取词而不是划词：

* 网页中的链接很难划词

* 在触屏设备中也很难划词 

此外，LangScene 允许你保存词组句型



在浏览器地址栏内输入下面的代码：
```
javascript:window.langsceneDoname="127.0.0.1:6060";var eleScript=document.createElement("script");eleScript.src="http://"+window.langsceneDoname+"/langscene/public/index.js";document.body.appendChild(eleScript);
```
