
var require = require(['main'], function(main) {

	require(['jquery', 'commom', 'layer', 'load', 'lazyload', 'infinitescroll'], function($, commom, layer, load, lazyload, infinitescroll) {
		//初始化
		$(function() {  
              newsList(1);
             //加载数据
            var page=1;
			var InfiniteScroll = new infinitescroll({
				loadListFn: function() {
				    page = $(".list").attr("data-page");
					InfiniteScroll.options.open = $(".list").attr("bool-page");
					page++;
					newsList(page)
				}
			})
		});
		//文章列表
		function newsList(PageIndex) {
			//启动加载
			var Load = new load();
			var param = {
				PageIndex: PageIndex,
				PageCount: 6,
			}
			$.ajax({
				url: commom.path.httpurl + "?action=GetArticleList",
				method: 'get',
				dataType: "json",
				timeout: 500,
				data: param,
				success: function(ret) {
					//关闭加载
					Load.hide();
					if(!ret.isError) {
						$(".loading_more").show();
						$(".loading_more").find(".loading-time").hide();
						$(".loading_more").find(".loading_fish").show();
						var arryList = JSON.parse(ret.Msg);
						var str = '';
						for(var i = 0; i < arryList.length; i++) {

							str += '<li class="list_li">';
							str += '<a href="news_detail.html?id='+arryList[i].Guid+'" class="clearfix">';
							str += '<img data-original="' + arryList[i].Image + '" class="fl lazy" />'
							str += '<div class="conten_main fl">';
							str += '<div class="title">' + arryList[i].Title + '</div>';
							str += '<div class="clearfix mian_bottom"><div class="fl">' + arryList[i].CreateTime + '</div><div class="fr">' + arryList[i].ClickCount + '人浏览</div></div></div></a></li>';
						}
						$(".list").append(str);
						$(".list").attr("data-page", param.PageIndex);
						$(".list").attr("bool-page", true);
						$("img.lazy").lazyload({
							placeholder: "../image/img_load.gif",
							threshold: -50
						});
					} else {

						$(".list").attr("bool-page", false);
						$(".loading_more").show();
						$(".loading_more").find(".loading-time").hide();
						$(".loading_more").find(".loading_fish").show();

					}
				}
			})
		}
       //底部分界面
	})
})