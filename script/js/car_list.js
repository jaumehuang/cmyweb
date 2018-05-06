//apiready = function() {
//
//			api.setWinAttr({
//				scrollEnabled: true
//			});
//			var systemType = api.systemType;
//			if (systemType == "ios") {
//
//				$(".equipment").css("background", '#fff');
//			};

var require = require(['main'], function(main) {

	require(['jquery', 'commom', 'swiper', 'layer', 'load', 'lazyload', 'infinitescroll'], function($, commom, swiper, layer, load, lazyload, infinitescroll) {
		console.log(infinitescroll);
		//初始化数据
		$(function() {

			var $index = commom.GetQueryString('id');
			var arr = [{
				"name": "优惠车",
				"IsShow": "IsHot"
			}, {
				"name": "精选车",
				"IsShow": "IsBest"
			}];

			var param2 = {
				IsShow: arr[$index].IsShow,
				PageIndex: 1,
			}
			GetProductList(param2);

			//加载数据
			var page = 1;
			var InfiniteScroll = new infinitescroll({
				loadListFn: function() {
					var param2 = {
						IsShow: arr[$index].IsShow,
						PageIndex: page,
					}
					page = $(".product_list .list").attr("data-page");
					InfiniteScroll.options.open = $(".product_list .list").attr("bool-page")
					page++;
					param2.PageIndex = page;
					GetProductList(param2);
				}
			});
		});
		//列表
		function GetProductList(arryObj) {
			//启动加载
			var Load = new load();

			var param = {
				PageCount: 6,
				CategoryId: 1,
				class_ele: ".product_list .list"
			}
			param = $.extend({}, param, arryObj);

			var str = '';
			$.ajax({
				url: commom.path.httpurl + "?action=getproductlist",
				method: 'get',
				dataType: "json",
				timeout: 500,
				data: param,
				success: function(ret) {
					//关闭加载
					Load.hide();
					$(".search_pr").show();
					if(!ret.isError) {
						$(".loading_more").show();
						$(".loading_more").find(".loading-time").hide();
						$(".loading_more").find(".loading_fish").show();
						var arryList = JSON.parse(ret.Msg);
						var str = '';
						for(var i = 0; i < arryList.length; i++) {
							str += '<li class="list_li">';
							str += '<a class="clearfix"  href="details2.html?id=' + arryList[i].Guid + '">';
							str += '<img class="fl lazy" data-original="' + arryList[i].OriginalImge + '"/>';
							str += '<div class="conten_main fl">';
							str += '<div class="title">' + arryList[i].Name + '</div>';
							str += '<div class="title_p">车源号:' + arryList[i].RepertoryNumber + '</div>';
							str += '<div class="price clearfix">';
							str += '<div class="fl">指导价:</span>';
							if(arryList[i].ShopPrice > 10000) {
								var ShopPrice = (arryList[i].ShopPrice) / 10000;
								str += '<span class="red_price">' + ShopPrice + '</span>万漫豆</div></div>';
							} else {
								str += '<span class="red_price">' + arryList[i].ShopPrice + '漫豆</span></div></div>';
							};
							str += '<div class=" clearfix" style="color:#333;font-size:0.375rem">';
							if(arryList[i].MarketPrice > 10000) {
								var MarketPrice = (arryList[i].MarketPrice) / 10000;
								str += '<div class="fl">新车:<span>' + MarketPrice + '</span>万漫豆</div></div>';
							} else {
								str += '<div class="fl">新车:<span>' + arryList[i].MarketPrice + '漫豆</span></div></div>';
							};

							str += '</div></a></li>';
						}

						$(param.class_ele).append(str);
						$(param.class_ele).attr("data-page", param.PageIndex);
						$(param.class_ele).attr("bool-page", true);
						$("img.lazy").lazyload({
							placeholder: "../image/img_load.gif",
							threshold: -50
						});
					} else {

						$(".loading_more").show();
						$(param.class_ele).attr("bool-page", false);
						$(".loading_more").find(".loading-time").hide();
						$(".loading_more").find(".loading_fish").show();
					}
				}
			});
		}
		//底部分界面
	})
})