//	 	鼠标长按弹窗
var require = require(['main'], function(main) {

	require(['jquery', 'commom', 'load', 'lazyload', 'layer'], function($, commom, load, lazyload, layer) {

		$(function() {

			$(".collection .nav_list .nav_li").on("click", function() {

				$(this).addClass("active").siblings().removeClass("active");

				var $index = $(this).index();

				$(".tab_list .teb_li").eq($index).show().siblings().hide();

			});
			//初始化数据
			var collectArr = ['car', 'product', 'member'];
			for(var i = 0; i < 3; i++) {

				collectionList(collectArr[i], i);

			}
		});

		function collectionList(type, index) {

			//启动加载
			var Load = new load();
			var param = {
				MemLoginId: commom.getCookie('memlogid'),
				Type: type
			}

			$.ajax({
				url: commom.path.httpurl + "?action=GetCollect",
				method: 'get',
				dataType: "json",
				timeout: 1000,
				data: param,
				success: function(ret) {
					//关闭加载
					Load.hide();
					if(!ret.isError) {
						var arryList = JSON.parse(ret.Msg);
						var str = '';

						switch(type) {
							case 'car':
								for(var i = 0; i < arryList.length; i++) {
									str += '<li class="list_li clearfix"  onclick="window.location.href=\'' + 'details2.html?id=' + arryList[i].Guid + '\'">';
									str += '<a href="#" class="fl show_img">';
									str += '<img src="' + arryList[i].OriginalImge + '"/></a>';
									str += '<div class="list_mian fl">';
									str += '<div class="title">' + arryList[i].Name + '</div>';
									str += '<div class="price clearfix">车源号:' + arryList[i].RepertoryNumber + '</div>';
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
								$(".tab_list .teb_li").eq(0).append(str);

								break;
							case 'product':

								for(var i = 0; i < arryList.length; i++) {
									str += '<li class="list_li clearfix" onclick="window.location.href=\'' + 'details1.html?id=' + arryList[i].Guid + '\'" >';
									str += '<a href="#" class="fl show_img">';
									str += '<img src="' + arryList[i].OriginalImge + '"/></a>';
									str += '<div class="list_mian fl">';
									str += '<div class="title">' + arryList[i].Name + '</div>';
									//str += '<div class="price clearfix">' + arryList[i].RepertoryNumber + '</div>';
									str += '<div class="price clearfix">';
									if(arryList[i].MarketPrice > 10000) {
										var MarketPrice = (arryList[i].MarketPrice) / 10000;
										str += '<span class="fl">漫豆' + MarketPrice + '万</span>';
									} else {

										str += '<span class="fl">漫豆' + arryList[i].MarketPrice + '</span>';
									};
									//									if(arryList[i].MarketPrice > 10000) {
									//
									//										var MarketPrice = (arryList[i].MarketPrice) / 10000;
									//										str += '<div class="red_price fl">车豆:<span>' + MarketPrice + '万</span></div>';
									//									} else {
									//										str += '<div class="red_price fl">车豆:<span>' + arryList[i].MarketPrice + '</span></div>';
									//									};

									str += '</div></div></li>';
								}
								$(".tab_list .teb_li").eq(1).append(str);

								break;
							case 'member':

								for(var i = 0; i < arryList.length; i++) {
									str += '<li class="list_li clearfix" onclick="window.location.href=\'' + 'agent_details.html?id=' + arryList[i].Guid + '\'">';
									str += '<img src="' + arryList[i].Photo + '" class="user_photo fl" />';
									str += '<div class="user_info fl">';
									str += '<div class="name">' + arryList[i].RealName + '</div>';
									str += '<div class="power">认证车源：<span>' + arryList[i].ProductCount + '</span></div>';
									str += '</div>';
									str += '</li>';
								}

								$(".tab_list .teb_li").eq(2).append(str);

								break;
							default:
								break;
						}
					} else {

						var arr = ['没有收藏的汽车', '没有收藏的商品', '没有收藏的经纪人']
						commom.nodataMsg(arr[index], $(".tab_list .teb_li").eq(index));

					}
				},
				complete: function(XMLHttpRequest, status) { //请求完成后最终执行参数
					　　　　
					if(status == 'timeout') { //超时,status还有success,error等值的情况
						//关闭加载
						Load.hide();　　　　　　　　　
						layer.open({
							content: '请求超时,检查网络',
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});　　　　
					}　　
				}
			})
		}
	})
})