var require = require(['main'], function(main) {

	require(['jquery', 'commom', 'layer', 'load', 'lazyload', 'infinitescroll', 'cookie'], function($, commom, layer, load, lazyload, infinitescroll) {
		//初始化数据
		$(function() {

			person();
			GetInformation()
			//页数
			var page = 1;
			//加载数据
			var InfiniteScroll = new infinitescroll({
				loadListFn: function() {
					page = $(".boutique").attr("data-page");
					InfiniteScroll.options.open = $(".boutique").attr("bool-page");
					$(".loading_more").find(".loading-time").show();
					$(".loading_more").find(".loading_fish").hide();
					page++;
					best_good(page);
				}
			});
		})
		//个人信息
		function person() {

			//启动加载
			var Load = new load();
			var param = {
				MemLoginId: commom.getCookie('memlogid')
			}

			$.ajax({
				url: commom.path.httpurl + "?action=GetMember",
				method: 'get',
				dataType: "json",
				timeout: 500,
				data: param,
				async: false,
				success: function(ret) {
					//关闭加载
					Load.hide();
					if(!ret.isError) {
						if($(".person .info").has("img")) {

							$(".person .info").find("img").remove();
							$(".person .info").find(".name").remove();
							$(".person .info").find(".y_code").remove();
						}
						var arryList = JSON.parse(ret.Msg);
						console.log(arryList)
						var str = '';
       
						str += '<img class="user_photo" src="' + arryList[0].Photo + '" onclick="window.location.href=\'' + 'set_person.html' + '\'"/>';
						if(arryList[0].IsAgentID == 1 && arryList[0].IsSetTemplates == 1) {
							str += '<div class="name">' + arryList[0].Mobile + '<span>渠道商</span></div>';
						} else {
							str += '<div class="name">' + arryList[0].Mobile + '<span></span></div>';
						}
						str += '<div class="y_code">邀请码:<span>' + arryList[0].Id + '</span></div>';

						$(".person .info").append(str);

						if($(".person .info img ").attr("src") == '/images/noimage.png') {

							$(".person .info img ").attr("src", "../image/logo.png");
						}

						for(var index = 2; index < 5; index++) {
							//订单数量
							GetOrderInfoCount(index);
							//打包数量
							GetPackInfoCount(index);
						}

						//购物车列表
						best_good(1);
					} else {

						layer.open({
							content: ret.Msg,
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});
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
			});

		};
		//订单数量
		function GetOrderInfoCount(index, type) {

			var param = {
				MemLoginId: commom.getCookie('memlogid'),
				OrderStatus: index,
			}
			$.ajax({
				url: commom.path.httpurl + "?action=GetOrderInfoCount",
				method: 'get',
				dataType: "json",
				timeout: 1000,
				data: param,
				success: function(ret) {

					if(!ret.isError) {
						if(ret.Msg > 0) {
							$(".order_num a").eq(index - 2).find(".num").show().text(ret.Msg);
						} else {

							$(".order_num a").eq(index - 2).find(".num").hide().text(0);
						}
					}
				}
			});
		};
		//打包数量
		function GetPackInfoCount(index, type) {

			var param = {
				MemLoginId: commom.getCookie('memlogid'),
				OrderStatus: index,
				BuyType: 2
			}
			$.ajax({
				url: commom.path.httpurl + "?action=GetOrderInfoCount",
				method: 'get',
				dataType: "json",
				timeout: 1000,
				data: param,
				success: function(ret) {
					console.log(ret)
					if(!ret.isError) {
						if(ret.Msg > 0) {
							$(".packorder a").eq(index - 2).find(".num").show().text(ret.Msg);
						} else {

							$(".packorder a").eq(index - 2).find(".num").hide().text(0);
						}
					}
				}
			});
		};
		//猜你喜欢
		function best_good(PageIndex) {
			var param = {
				PageIndex: PageIndex,
				PageCount: 3,
				CategoryId: 1,
				IsShow: "IsBest",
				Code: commom.getCookie('cityCode'),
				class_ele: ".boutique"
			};
			// 	param = $.extend({}, param, arryObj);
			GetProductList(param);
		};
		//产品列表
		function GetProductList(param) {

			var str = '';
			$.ajax({
				url: commom.path.httpurl + "?action=getproductlist",
				method: 'get',
				dataType: "json",
				timeout: 1000,
				data: param,
				success: function(ret) {
					 $(param.class_ele).siblings().show();
					if(!ret.isError) {
						$(".loading_more").show();
						$(".loading_more").find(".loading-time").hide();
						$(".loading_more").find(".loading_fish").show();
						var arryList = JSON.parse(ret.Msg);
						var str = '';
						for(var i = 0; i < arryList.length; i++) {
							str += '<li class="list_li">';
							str += '<a class="clearfix"  href="../html/details2.html?id=' + arryList[i].Guid + '")">';
							str += '<img class="fl lazy" data-original="' + arryList[i].OriginalImge + '"/>';
							str += '<div class="conten_main fl">';
							str += '<div class="title">' + arryList[i].Name + '</div>';
							str += '<div class="title_p ">车源号:' + arryList[i].RepertoryNumber + '</div>';
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

			});
		};
		//判断是否有消息
		function GetInformation() {

			var param = {

				MemLoginId: commom.getCookie('memlogid')
			}
			$.ajax({
				url: commom.path.httpurl + "?action=GetMessageCount",
				method: 'get',
				dataType: "json",
				timeout: 1000,
				data: param,
				success: function(ret) {

					if(!ret.isError) {

						$(".notice .num").show();
					}
				}
			});
		}
		//底部分界面
	});
});