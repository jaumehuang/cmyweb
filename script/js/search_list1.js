var require = require(['main'], function(main) {

	require(['jquery', 'commom', 'layer', 'lazyload', 'load'], function($, commom, layer, lazyload, load) {
		//初始化
		$(function() {

			var Words = commom.GetQueryString('str');
			console.log(decodeURI(Words));
			//初始化搜索
			searchResult1(Words);
		})
		//搜索结果页, 汽车

		function searchResult1(Words) {
			//启动加载
			var Load = new load();
			var param = {
				PageIndex: 1,
				PageCount: 50,
				CategoryId: 1,
				KeyWords: Words,
				class_ele: ".cars_list"
			}

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

					if(!ret.isError) {

						$(".search_pr").show();
						var arryList = JSON.parse(ret.Msg);

						str += '<div class="product_title clearfix" style="height:0"></div>';
						str += '<ul class="list">';
						for(var i = 0; i < arryList.length; i++) {

							str += '<li class="list_li" >';
							str += '<a class="clearfix" href="details2.html?id=' + arryList[i].Guid + '")" >';
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
						str += '</ul>';

						str += '<a class="more_list" href="car_list.html?id=0">';
						str += '<span>查看全部</span>';
						str += '<i class="iconfont icon-iconfontright"></i>';
						str += '</a>';
						$(param.class_ele).append(str);

						$("img.lazy").lazyload({
							placeholder: "../image/img_load.gif",
							threshold: -50
						});

					} else {

						$(param.class_ele).hide();
						commom.nodataMsg('搜索不到相关汽车');
					}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					//关闭加载
					Load.hide();
					console.log(XMLHttpRequest)
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