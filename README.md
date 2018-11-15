# 使用 jQuery 实现 Solr 搜索的前端页面展示

## 前言

今天要做的是一个具有搜索功能的前端页面，通过调用 Solr 搜索的接口来实现搜索功能。其中为了解决跨域的问题，利用 Python 写了一个简单的 Flask 服务器来请求 Solr，而前端页面仅需请求 Flask 服务器。

之前用 Vue.js 搭建过一个数据可视化平台，本来今天的搜索只需在之前的项目中添加一个 Tab 就可以了，但是这次的要求是初学者比较容易理解和上手，所以这次我们选用了 [jQuery](https://jquery.com/) ，[Bootstrap 4](https://getbootstrap.com/) 来构建本次页面。

### jQuery —— 简化的 JavaScript

jQuery 曾经是最流行的 Web 前端 JavaScript 库，可是现在无论是国内还是国外他的使用率正在渐渐被其他的基于 [MVVM](https://www.cnblogs.com/iovec/p/7840228.html) 思想的  JavaScript 库（例如  Vue，React，Angular）所代替，随着浏览器厂商对 HTML5 规范统一遵循以及 ECMA6 在浏览器端的实现，jQuery 的使用率将会越来越低。

jQuery 是使用选择器 `$` 选取 DOM（文档对象模型，可以理解成 HTML 中的元素）对象，对其进行赋值、取值、事件绑定等操作，其实和原生的 JavaScript 的区别只在于可以更方便的选取和操作 DOM 对象，而数据和界面是在一起的。比如需要获取 label 标签的内容：`$("lable").val();` ，它还是依赖 DOM 元素的值。 

<!--more-->

### Bootstrap 4 —— 组件样式库

Bootstrap 是一个用于使用 HTML，CSS 和 JS 进行开发的开源工具包。曾经也是世界上最受欢迎的前端组件库，在网络上构建响应迅速，移动优先的项目。这次使用的是最新版的 Bootstrap 4 开发，使用 Bootstrap 4 可以非常便捷快速地构建美观的页面。Bootstrap 基于 jQuery，也就是说必须引入 jQuery 才可以使用 Bootstrap。需要注意的是 Bootstrap 的中文网已经停止更新了，最新的内容请到 [Bootstrap 英文官网](https://getbootstrap.com/) 查看。

### Iconfont —— 阿里巴巴矢量图片库

Iconfont 中可以找到很多简约好用的矢量图，这次我们使用了其中的搜索图标。

## 项目结构

为了更适用于初学者，本次没有使用例如 Yeoman 这样的脚手架构建项目，我们直接新建一个叫 `Solr-web` 的文件夹，里面的内容如下：

```
Solr-web
├── css
│   └── index.css
├── js
│   └── index.js
├── img
│   └── search-white.png
├── lib
│   ├── bootstrap-4.1.3-dist
│   └── jquery-3.3.1.min.js
├── favicon.ico
└── index.html
```

* `css` 文件夹下存放的是自己写的 CSS 文件。
* `js` 文件夹下存放的是自己写的 JavaScript 文件。
* `img` 文件夹下存放的是项目用到的图片。
* `lib` 文件夹中是需要调用的库文件，比如我们用到的 jQuery 和 Bootstrap。
* `favicon.ico` 文件是浏览器标签页中显示的小图片。
* `index.html` 主页面，本次只有一个页面，所以没有其他页面存放的文件夹。

## 编写页面

首先我们来看一下我们的目标页面结果是怎么样的：

![image-20181115171110815](http://pd4nbaja5.bkt.clouddn.com/2018-11-15-091111.png)

在加上搜索结果以后的效果：

![image-20181115182208456](http://pd4nbaja5.bkt.clouddn.com/2018-11-15-102208.png)

看上去是十分简单的，可以看到页面由三个部分组成：

1. 顶部导航栏
2. 标题
3. 搜索框
4. 搜索结果

我们先打开 `index.html` 文件，在支持 Emmt 的编辑器中输入 `!` 再按一下 Tab 键就可以看到基本的 HTML 结构已经给你生成了，添加我们需要的 CSS 和 JS 以后内容如下：

``` html
<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="shortcut icon" href="./favicon.ico" type="image/x-icon" />
    <!-- 载入CSS文件 -->
    <link rel="stylesheet" href="./lib/bootstrap-4.1.3-dist/css/bootstrap.css" />
    <link href="./css/index.css" rel="stylesheet" />
    <title>Solr 论文搜索平台</title>
</head>
<body>
    <!-- 在这里添加导航栏 -->
    <header></header>
    
    <!-- 在这里添加标题和输入框，以及输入结果的内容 -->
    <main></main>
    
    <!-- 载入JS文件，放在底部可以加快加载速度，注意jQuery要在Bootstrap之前 -->
    <script src="./lib/jquery-3.3.1.min.js"></script>
    <script src="./lib/bootstrap-4.1.3-dist/js/bootstrap.min.js"></script>
    <script src="./js/index.js"></script>
</body>
</html>
```

下面我们在 HTML 中添加顶部导航栏。找到 Bootstrap 中的 `Navbar` 组件，复制下合适的内容插入到 HTML 中，再进行一些修改：

``` html
<nav class="navbar navbar-dark bg-dark shadow-sm">
    <div class="container">
        <a class="navbar-brand" href="#">
            <img src="./img/search-white.png" width="30" height="30" class="d-inline-block align-top" />
            移动互联实验室
        </a>
    </div>
</nav>
```

然后在 Bootstrap 组件中找到 `Jumbotron` ，这个组件可以很大气地显示一些文字。复制下代码然后经过一些改动添加到 `<main></main>` 中：

``` html
<main>
    <section class="jumbotron text-center not-search">
        <div class="container">
            <h1 class="jumbotron-heading">Solr 论文搜索平台</h1>
            <!-- 在这里下面添加搜索框 -->
			
        </div>
    </section>
</main>
```

最后添加搜索框，在 Bootstrap 组件中找到 `Input group` ，这个组件有一些输入框和各种元素结合的写法，现在我们需要的是 `输入框 + 搜索按钮` ，找到相应部分做一些修改：

``` html
<div class="input-group mt-5 mb-3 position-relative">
    <input type="text" id="keyword" class="form-control keyword-input" placeholder="请输入关键词" autocomplete="off" aria-describedby="button-addon2" />
    <div class="input-group-append">
        <button id="searchPaper" class="btn btn-outline-secondary px-4" type="button">搜索</button>
    </div>
    <!-- 这里下面放联想提示框 -->
    
</div>
```

我们希望搜索框具有联想提示功能，所以我们创建一个提示框，利用的 Bootstrap 组件是 `List group` ：

``` html
<div id="suggestList" class="list-group position-absolute">
    <!-- 每一条结果将会用jQuery插入到这里 -->
</div>
```

它的样式将会是这样的：

![image-20181115175844955](http://pd4nbaja5.bkt.clouddn.com/2018-11-15-095845.png)

在输入框中的文字改变的时候我们就发送请求去查询联想，然后利用 jQuery 添加返回的内容组合成 HTML 插入到这个 id 为 `suggestList` 的 div 中。该部分的 jQuery 代码如下：

``` js
// id为keyword的输入框内容改变触发getSuggest()方法
$("#keyword").on("input propertychange", function() {
    getSuggest();
});

function getSuggest() {
    // 首先清空suggestList中原来的内容以便内容填入
    $("#suggestList").empty();
    // 向服务器请求联想词
    $.getJSON({
        url: "http://localhost:4000/suggest?key=" + $("#keyword").val(),
        success: function(result) {
            // 获取返回的数据中我们需要的部分
            res = result.suggest.mySuggester[$("#keyword").val()];
            if (res.suggestions.length) {
                // 利用for插入每一个结果
                for (i = 0; i < res.suggestions.length; i++) {
                    // 将返回的结果包装成HTML
                    suggestItem =
                        "<a class='list-group-item list-group-item-action'>" + res.suggestions[i].term + "</a>";
                    // 插入HTML到suggestList中
                    $("#suggestList").append(suggestItem);
                }
            }
        }
    });
}
```

最后我们在下方插入用于结果显示的部分：

``` html
<div id="resultSection" class="py-5 bg-light">
    <div class="container">
        <div class="row" id="result">
            <!-- 每一条结果将会用jQuery插入到这里 -->
        </div>
    </div>
</div>
```

点击搜索按钮以后触发的 jQuery 代码如下：

``` js
// id为searchPaper的按钮按下触发searchPaper()方法
$("#searchPaper").click(function() {
    keyword = $("#keyword").val();
    searchPaper(keyword);
});

function searchPaper(key) {
    // 首先清空result中的内容以便内容填入
    $("#result").empty();
    $.getJSON({
        url: "http://localhost:4000/search?key=" + key,
        success: function(result) {
            // 获取返回的数据中我们需要的部分
            res = result.response.docs;
            // 利用for插入每一个结果
            if (res.length) {
                for (i = 0; i < res.length; i++) {
                    // 将返回的结果包装成HTML
                    resultItem =
                        `
                        <div class='col-md-12 mb-4'>
                            <div class='card mb-12 shadow-sm'>
                                <div class='card-body'>
                                    <h5>` + res[i].name + ` <small style='margin-left: 10px'>` + res[i].author + `</small> <small style='margin-left: 10px'>` + res[i].year +  `</small></h5>
                                    <p class='text-muted' style='margin-bottom: 0.5em'>` + res[i].unit + `</p>
                                    <p class='card-text'>` + res[i].abstract + `</p>
                                </div>
                            </div>
                        </div>
                    `;
                    // 插入HTML到result中
                    $("#result").append(resultItem);
                }
                
                // 搜索完以后让搜索框移上去，带有动画效果
                $("section.jumbotron").animate({
                    margin: "0"
                });
                // 显示搜索结果的部分
                $("#resultSection").show();
                // 清空输入联想
                $("#suggestList").empty();
            }
        }
    });
}
```

这里基本上功能就已经都实现了，还有一些细节：

``` js
// 页面刚开始隐藏搜索结果的部分
$("#resultSection").hide();

...

// 按下联想的词就直接搜索
$(document).on("click", ".list-group-item-action", function() {
    searchPaper($(this).text());
    $("#keyword").val($(this).text());
});

// 在按下enter键的时候就搜索
$(document).keyup(function(event) {
    if (event.keyCode == 13) {
        searchPaper($("#keyword").val());
    }
});
```

到这里功能基本就完整了，在下面的完整项目代码的部分对以上代码还会有一些完善。

## 完整项目代码

### index.html

``` html
<!DOCTYPE html>
<html lang="zh">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <title>Solr 论文搜索平台</title>
    <link rel="shortcut icon" href="./favicon.ico" type="image/x-icon" />
    <link rel="stylesheet" href="./lib/bootstrap-4.1.3-dist/css/bootstrap.css" />
    <link href="./css/index.css" rel="stylesheet" />
</head>

<body>
    <header>
        <div class="collapse bg-dark" id="navbarHeader">
            <div class="container">
                <div class="row">
                    <div class="col-sm-8 col-md-7 py-4">
                        <h4 class="text-white">介绍</h4>
                        <p class="text-muted">
                            本搜索页面通过调用 Solr 搜索的接口来实现搜索功能。其中为了解决跨域的问题，
                            利用 Python 写了一个简单的 Flask 服务器来请求 Solr，而前端页面仅需请求 Flask 服务器。
                        </p>
                    </div>
                    <div class="col-sm-4 offset-md-1 py-4">
                        <h4 class="text-white">资料</h4>
                        <ul class="list-unstyled">
                            <li><a target="_blank" href="https://ryanligod.github.io/2018/11/15/2018-11-15%20%E4%BD%BF%E7%94%A8%20jQuery%20%E5%AE%9E%E7%8E%B0%20Solr%20%E6%90%9C%E7%B4%A2%E7%9A%84%E5%89%8D%E7%AB%AF%E9%A1%B5%E9%9D%A2%E5%B1%95%E7%A4%BA/"
                                    class="text-white">本页面的讲解</a></li>
                            <li><a target="_blank" href="https://github.com/RyanLiGod/Solr-web" class="text-white">本项目的 Github 地址</a></li>
                            <li><a target="_blank" href="https://callmejiagu.github.io/categories/Solr/" class="text-white">Solr 讲解</a></li>
                            <li><a target="_blank" href="https://getbootstrap.com/" class="text-white">Bootstrap 4</a></li>
                            <li><a target="_blank" href="https://jquery.com/" class="text-white">jQuery</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="navbar navbar-dark bg-dark shadow-sm">
            <div class="container d-flex justify-content-between">
                <a class="navbar-brand align-items-center" href="#">
                    <img src="./img/search-white.png" width="30" height="30" class="d-inline-block align-top" />
                    移动互联实验室
                </a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarHeader" aria-controls="navbarHeader"
                    aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
            </div>
        </div>
    </header>

    <main role="main">
        <section class="jumbotron text-center not-search">
            <div class="container">
                <h1 class="jumbotron-heading">Solr 论文搜索平台</h1>
                <div class="input-group mt-5 mb-3 position-relative">
                    <input type="text" id="keyword" class="form-control keyword-input" placeholder="请输入关键词" autocomplete="off"
                        aria-describedby="button-addon2" />
                    <div class="input-group-append">
                        <button id="searchPaper" class="btn btn-outline-secondary px-4" type="button">搜索</button>
                    </div>
                    <div id="suggestList" class="list-group position-absolute">
                            <!-- 每一条结果将会用jQuery插入到这里 -->
                    </div>
                </div>
            </div>
        </section>

        <div id="resultSection" class="py-5 bg-light">
            <div class="container">
                <div class="row" id="result">
                    <!-- 每一条结果将会用jQuery插入到这里 -->
                </div>
            </div>
        </div>
    </main>

    <script src="./lib/jquery-3.3.1.min.js"></script>
    <script src="./lib/bootstrap-4.1.3-dist/js/bootstrap.min.js"></script>
    <script src="./js/index.js"></script>
</body>

</html>
```

### index.js

``` js
$(document).ready(function() {
    // 页面刚开始隐藏搜索结果的部分
    $("#resultSection").hide();

    // id为searchPaper的按钮按下触发searchPaper()方法
    $("#searchPaper").click(function() {
        keyword = $("#keyword").val();
        searchPaper(keyword);
    });

    // id为keyword的输入框内容改变触发getSuggest()方法
    $("#keyword").on("input propertychange", function() {
        getSuggest();
    });
});

// 按下联想的词就直接搜索
$(document).on("click", ".list-group-item-action", function() {
    searchPaper($(this).text());
    $("#keyword").val($(this).text());
});

// 在按下enter键的时候就搜索
$(document).keyup(function(event) {
    if (event.keyCode == 13) {
        searchPaper($("#keyword").val());
    }
});

function searchPaper(key) {
    // 首先清空result中的内容以便内容填入
    $("#result").empty();
    $.getJSON({
        url: "http://localhost:4000/search?key=" + key,
        success: function(result) {
            // 获取返回的数据中我们需要的部分
            res = result.response.docs;
            // 利用for插入每一个结果
            if (res.length) {
                for (i = 0; i < res.length; i++) {
                    // 将返回的结果包装成HTML
                    resultItem =
                        `
                        <div class='col-md-12 mb-4'>
                            <div class='card mb-12 shadow-sm'>
                                <div class='card-body'>
                                    <h5>` + res[i].name + ` <small style='margin-left: 10px'>` + res[i].author + `</small> <small style='margin-left: 10px'>` + res[i].year +  `</small></h5>
                                    <p class='text-muted' style='margin-bottom: 0.5em'>` + res[i].unit + `</p>
                                    <p class='card-text'>` + res[i].abstract + `</p>
                                </div>
                            </div>
                        </div>
                    `;
                    // 插入HTML到result中
                    $("#result").append(resultItem);
                }
                
                // 搜索完以后让搜索框移上去，带有动画效果
                $("section.jumbotron").animate({
                    margin: "0"
                });
                // 显示搜索结果的部分
                $("#resultSection").show();
                // 清空输入联想
                $("#suggestList").empty();
            }
        }
    });
}

function getSuggest() {
    // 首先清空suggestList中原来的内容以便内容填入
    $("#suggestList").empty();
    // 向服务器请求联想词
    $.getJSON({
        url: "http://localhost:4000/suggest?key=" + $("#keyword").val(),
        success: function(result) {
            // 获取返回的数据中我们需要的部分
            res = result.suggest.mySuggester[$("#keyword").val()];
            if (res.suggestions.length) {
                // 利用for插入每一个结果
                for (i = 0; i < res.suggestions.length; i++) {
                    // 将返回的结果包装成HTML
                    suggestItem =
                        "<a class='list-group-item list-group-item-action'>" + res.suggestions[i].term + "</a>";
                    // 插入HTML到suggestList中
                    $("#suggestList").append(suggestItem);
                }
            }
        }
    });
}

```

### index.css

``` css
:root {
    --jumbotron-padding-y: 3rem;
}

.jumbotron {
    padding-top: var(--jumbotron-padding-y);
    padding-bottom: var(--jumbotron-padding-y);
    margin-bottom: 0;
    background-color: #fff;
}

@media (min-width: 768px) {
    .jumbotron {
        padding-top: calc(var(--jumbotron-padding-y) * 2);
        padding-bottom: calc(var(--jumbotron-padding-y) * 2);
    }
}

.not-search {
    margin: 15vh;
}

.jumbotron-heading {
    font-weight: 300;
}

.jumbotron .container {
    max-width: 40rem;
}

.keyword-input {
    border-radius: 0;
}

#resultSection {
    min-height: calc(100vh - 56px - 342px);
}

#suggestList {
    top: 38px;
    z-index: 2;
    width: calc(100% - 82px);
}

.list-group-item {
    cursor: pointer;
}

.list-group-item:first-child {
    border-top: none;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
}

.list-group-item-action {
    text-align: left;
    padding: 6px 12px;
}
```

顺便这里也贴一下 Flask 服务器的代码，如果 Solr 服务器和网页在同一个电脑启动，那就不需要通过 Flask 服务器这个媒介来解决跨域问题：

``` python
#!/usr/bin/env python
# -*- coding: utf-8 -*-

import requests
from flask import Flask, make_response, request

app = Flask(__name__)


@app.route('/search')
def search():
    key = request.args.get('key')
    result = requests.get('http://192.168.43.97:8983/solr/paper/select?q=%s&wt=json&indent=true' % key)
    rst = make_response(result.text)
    rst.headers['Access-Control-Allow-Origin'] = '*'
    return rst

@app.route('/suggest')
def suggest():
    key = request.args.get('key')
    result = requests.get('http://192.168.43.97:8983/solr/namewords/suggest?q=%s&wt=json&indent=true' % key)
    rst = make_response(result.text)
    rst.headers['Access-Control-Allow-Origin'] = '*'
    return rst


if __name__ == '__main__':
    app.run(host="localhost", port=4000)

```
