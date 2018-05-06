
//搜索结果页，商品
var require = require(['main'], function(main) {

	require(['jquery', 'commom', 'lazyload', 'load','layer'], function($, commom, lazyload, load,layer) {
		//初始化
		$(function() {

			var Words = commom.GetQueryString('str');
			console.log(decodeURI(Words));
			//初始化搜索
			searchResult2(Words);
		})
		//搜索结果页,s商品

		function searchResult2(Words) {

			//启动加载
			var Load = new load();
			var param = {
				PageIndex: 1,
				PageCount: 50,
				CategoryId: 2,
				KeyWords: Words,
				class_ele: ".goods_list"
			}
			var str = '';
			$.ajax({
				url: commom.path.httpurl + "?action=getproductlist",
				method: 'get',
				dataType: "json",
				data: param,
				success: function(ret) {
					//关闭加载
					Load.hide();
					if(!ret.isError) {
						$(".search_pr").show();
						var arryList = JSON.parse(ret.Msg);
						str += '<div class="product_title clearfix" style="height:0"></div>';
						str += '<ul class="list" >';
						for(var i = 0; i < arryList.length; i++) {
							str += '<li class="list_li">';
							str += '<a class="clearfix" onclick="open_win(\'' + 'details1' + '\',\'' + arryList[i].Guid + '\')" >';
							str += '<img class="fl lazy" data-original="' + arryList[i].OriginalImge + '"/>';
							str += '<div class="conten_main fl">';
							str += ' <div class="title">' + arryList[i].Name + '</div>';

							str += '<div class="price clearfix">';
//							str += '<span>会员价：￥</span>';
//
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
								str += '<div class="fl">漫豆:<span style="font-size: 0.4375rem;">' + (arryList[i].MarketPrice).split(".")[0] + '</span></div>';
							};
                             str+='<div class="fr">';
                            str+='<span>返利：</span>';
                            str+='<span class="">' + arryList[i].PushMoney + '</span>漫豆</div></div>';
                            
							str += '<div class="price clearfix">';
							str += '<div class=""><span>' + arryList[i].SaleNumber + '人购买</span></div></div>';

							str += '</div></a></li>';
						}
						str += '</ul>';

						str += '<a class="more_list" href="good_list.html?id=0">';
						str += '<span>查看全部</span>';
						str += '<i class="iconfont icon-iconfontright"></i>';
						str += '</a>';
						$(param.class_ele).append(str);
						$("img.lazy").lazyload({
							placeholder: "../image/img_load.gif",
							threshold: -50
						});
					} else {

						commom.nodataMsg('搜索不到相关商品');
						$(param.class_ele).hide();
					}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
					//关闭加载
					Load.hide();
					console.log(errorThrown)
					layer.open({
						content: '数据加载失败!',
						skin: 'msg',
						time: 2 //2秒后自动关闭
					});
				}

			});
		}

		//底部分界线

	})
})