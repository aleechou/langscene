langscene
=========

这是一个词典浏览器插件。

LangScene 提供更好的网页取词体验，点击取词而不是划词：

* 网页中的链接很难划词

* 在触屏设备中也很难划词 

此外，LangScene 允许你保存词组句型的上下文网页。



在浏览器地址栏内输入下面的代码：
```
javascript:var eleScript=document.createElement("script");eleScript.src="https://github.com/aleechou/langscene/raw/master/public/index.js";eleScript.setAttribute('langscene-entrence');document.body.appendChild(eleScript);
```

localhost
```
javascript:var eleScript=document.createElement("script");eleScript.src="file:///home/alee/langscene/public/index.js";eleScript.setAttribute('langscene-entrence');document.body.appendChild(eleScript);
```
