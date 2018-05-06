var require = require(['main'], function(main) {

	require(['jquery', 'commom', 'load', 'lazyload', 'infinitescroll'], function($, commom, load, lazyload, infinitescroll) {

		//初始化数据
		$(function() {

			var $index = commom.GetQueryString('id');
			var arr = [{
				"name": "热卖推荐",
				"IsShow": "IsRecommend"
			}, {
				"name": "精选列表",
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

		function GetProductList(arryObj) {
			//启动加载
			var Load = new load();
			var param = {
				//  PageIndex:1,
				PageCount: 6,
				CategoryId: 2,
				class_ele: ".product_list .list",
			};
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
							str += '<a class="clearfix"  href="details1.html?id='+arryList[i].Guid+'">';
							str += '<img class="fl lazy" data-original="' + arryList[i].OriginalImge + '"/>';
							str += '<div class="conten_main fl">';
							str += ' <div class="title">' + arryList[i].Name + '</div>';

							str += '<div class="price clearfix">';
//							str += '<span>会员价:￥</span>';
//							if(arryList[i].ShopPrice > 10000) {
//								var ShopPrice = (arryList[i].ShopPrice) / 10000;
//								str += '<span class="red_price">' + ShopPrice + '万</span></div>';
//							} else {
//								str += '<span class="red_price">' + arryList[i].ShopPrice + '</span></div>';
//							};
							if(arryList[i].MarketPrice > 10000) {
								var MarketPrice = (arryList[i].MarketPrice) / 10000;
								str += '<div class="fl">漫豆:<span style="font-size: 0.4375rem;">' + MarketPrice + '万</span></div>';
							} else {
								str += '<div class="fl" >漫豆:<span style="font-size: 0.4375rem;">' + (arryList[i].MarketPrice).split(".")[0] + '</span></div>';
							};
							// str+='<span class="red_price">'+arryList[i].ShopPrice+'</span></div>';
							// str+='<div class="fr ">车豆：<span>'+ arryList[i].MarketPrice+'</span></div></div>';

						      str+='<div class="fr">';
                            str+='<span >返利：</span>';
                            str+='<span class="">' + arryList[i].PushMoney + '</span>漫豆</div></div>';
                            
							str += '<div class="price clearfix" style="color:#333">';
							str += '<div class=" ><span style="color: #666;">' + arryList[i].SaleNumber + '人购买</span></div></div>';

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