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
                                    <h5>` +
                        res[i].name +
                        ` <small style='margin-left: 10px'>` +
                        res[i].author +
                        `</small> <small style='margin-left: 10px'>` +
                        res[i].year +
                        `</small></h5>
                                    <p class='text-muted' style='margin-bottom: 0.5em'>` +
                        res[i].unit +
                        `</p>
                                    <p class='card-text'>` +
                        res[i].abstract +
                        `</p>
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
