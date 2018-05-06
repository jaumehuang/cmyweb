var require = require(['main'], function(main) {

	require(['jquery', 'commom', 'layer', 'load', 'lazyload', 'infinitescroll'], function($, commom, layer, load, lazyload, infinitescroll) {

		//初始化
		$(function() {

			//初始化筛选数据
			var cityNme = '';
			var cityCode = '';
			screenList(1, 1);
			if(commom.getItem("cityName")) {

				cityNme = commom.getItem("cityName");
				cityCode = commom.getItem("cityCode");
			}
			//					//手动选择城市
			if(commom.getItem('city')) {

				var arr = (commom.getItem('city')).split("|");
				cityNme = arr[0];
				cityCode = arr[1];

			}
			//					console.log(commom.getItem('city'))
			var code = $(".location_p").attr("data-code", cityCode);
			$(".location_p span").text(cityNme);
			var openBool = true;
			//					//获取品牌
			if(commom.getItem('brand') || commom.getItem('filter') || commom.getItem("cityName")) {

				if(commom.getItem('brand')) {

					openBool = false;

				};
				if(commom.getItem('brand')) {

					var carBrand = {

						"BrandGuid": commom.getItem('brand')
					}
					$(".product_list .list").attr("data-prop", JSON.stringify(carBrand));
					carList(carBrand, 1, 1);
					//删除存储数据
					commom.removeItem('brand');
					//					return false;
				} else if(commom.getItem("cityName") && openBool) {

					if(commom.GetQueryString('str')) {

						var obj = commom.Transformation(commom.GetQueryString('str'));
						//显示上一页面传参的数据
						$(".product_list .list").attr("data-prop", commom.GetQueryString('str'));
						carList(obj, 1, 1);
					} else {
						//默认定位汽车列表
						carList({
							"cityCode": cityCode
						}, 1, 0);
						var cityCode = {

							"cityCode": cityCode
						}
						$(".product_list .list").attr("data-prop", JSON.stringify(cityCode));
					}
				}
				//属性筛选
				if(commom.getItem('filter')) {

					var Prop = {
						"Prop": commom.getItem('filter'),
					}

					$(".product_list .list").attr("data-prop", JSON.stringify(Prop));
					carList(Prop, 1, 1);
					//删除存储数据
					commom.removeItem('filter');
					//					return false;
				};

			} else {
				console.log('22')
				carList('', 1, 1);
			}
			var flag = true;
			//效果切换
			$(".switch").on("click", function() {

				if($(".product_list .list").hasClass("buycar_type")) {

					$(".product_list .list").removeClass("buycar_type");

				} else {

					$(".product_list .list").addClass("buycar_type");
				}

			});
			$(".buycar .search_list a").on("click", function(e) {

				e.stopPropagation();
				var $self = $(this);
				$self.children(".title").css("color", "#0090ff");
				$self.siblings().children(".title").css("color", "#333");
				$self.children(".sortList").slideToggle(300, function() {
					if($self.children(".sortList").css("display") == 'none') {
						$(".mask").hide();
					}
				});
				$self.siblings().children(".sortList").hide();
				$(".mask").show();

				if($self.is(".brand_list") || $self.is(".screen_list")) {
					$(".mask").hide();
				}
				//								return false;
			});
			$(".mask").on("click", function() {

				$(".buycar .search_list a .sortList").hide();
				$(this).hide();
			});

			var page = 1;
			//加载数据
			var InfiniteScroll = new infinitescroll({
				loadListFn: function() {
					page = $(".product_list .list").attr("data-page");
					InfiniteScroll.options.open = $(".product_list .list").attr("bool-page");
					page++;
					var code = $(".location").attr("data-code");
					var prop = $(".product_list .list").attr("data-prop");
					if(prop == '' || prop == null || prop == 'undefined') {

						var param = {
							PageIndex: page,
							PageCount: 2,
							CategoryId: 1,
							cityCode: '',
							class_ele: ".product_list .list"
						};
						GetProductList(param, 0);
					} else {

						var param = {
							PageIndex: page,
							PageCount: 6,
							CategoryId: 1,
							cityCode: $(".location_p").attr("data-code"),
							class_ele: ".product_list .list"
						};

						param = $.extend({}, param, JSON.parse(prop));
						GetProductList(param, 0);
					};
				}
			});
            //购物车
			$("#footer .cart").on("click",function(){
				
				 commom.isLogin('cart');
			});
			//进入个人中心
			$("#footer .person").on("click", function() {

				commom.isLogin('person');
			});
		});
		////显示上一页面传参的数据
		function carList(arryObj, PageIndex, type) {

			var param = {
				PageIndex: PageIndex,
				PageCount: 6,
				CategoryId: 1,
				cityCode: $(".location_p").attr("data-code"),
				class_ele: ".product_list .list"
			};
			$(param.class_ele).attr("bool-page", true);
			param = $.extend({}, param, arryObj);
			GetProductList(param, type);

		};
		//筛选
		function GetProductList(param, type) {
			//启动加载
			var Load = new load();
			var str = '';
			$.ajax({
				url: commom.path.httpurl + "?action=getproductlist",
				method: 'get',
				dataType: "json",
				timeout: 1000,
				data: param,
				success: function(ret) {
					console.log(ret);
					//关闭加载
					Load.hide();
					if(type == 1) {

						if(!ret.isError) {

							$(".loading_more").show();
							$(".loading_more").find(".loading-time").hide();
							$(".loading_more").find(".loading_fish").show();
							$(".null_list").hide();
							var arryList = JSON.parse(ret.Msg);
							var str = '';
							if($(param.class_ele).has("li")) {

								$.each($(param.class_ele).children("li"), function(index, ele) {
									$(ele).remove();
								});

								for(var i = 0; i < arryList.length; i++) {
									str += '<li class="list_li">';
									str += '<a class="clearfix" href="details2.html?id=' + arryList[i].Guid + '"  >';
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
							}
							$(param.class_ele).append(str);
							$(param.class_ele).attr("data-page", param.PageIndex);
							$("img.lazy").lazyload({
								placeholder: "../image/img_load.gif",
								threshold: -50
							});
						} else {

							$(".loading_more").show();
							$(".loading_more").find(".loading-time").hide();
							$(".loading_more").find(".loading_fish").show();;
							if($(param.class_ele).has("li")) {

								$.each($(param.class_ele).children("li"), function(index, ele) {
									$(ele).remove();
								});
							}
							$(".loading_more").hide();
							$(".null_list").show();
						}
					}
					if(type == 0) {

						if(!ret.isError) {
							$(".loading_more").show();
							$(".loading_more").find(".loading-time").hide();
							$(".loading_more").find(".loading_fish").show();
							var arryList = JSON.parse(ret.Msg);
							var str = '';
							for(var i = 0; i < arryList.length; i++) {
								str += '<li class="list_li">';
								str += '<a class="clearfix" href="details2.html?id=' + arryList[i].Guid + '" >';
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
								str += '<div class=" clearfix" style="color:#333">';
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
							$(".loading_more").find(".loading-time").hide();
							$(".loading_more").find(".loading_fish").show();
							$(param.class_ele).attr("bool-page", false);
						}
					}
				},
				complete: function(XMLHttpRequest, status) { //请求完成后最终执行参数
					　　　　
					if(status == 'timeout') { //超时,status还有success,error等值的情况
						　
						Load.hide();
						layer.open({
							content: '数据请求超时,请检查网络,重新上拉刷新!',
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});　　　　
					}　　
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					//关闭加载
					Load.hide();
					layer.open({
						content: '数据加载失败,请重上拉刷新数据!',
						skin: 'msg',
						time: 2 //2秒后自动关闭
					});
				}
			});
		};

		//筛选车辆
		function screenList(PageIndex, type) {
			//价格 
			var priceArry = [{
				"OrderId": "Desc"
			}, {
				"MinShopPrice": 0,
				"MaxShopPrice": 30000
			}, {
				"MinShopPrice": 30000,
				"MaxShopPrice": 50000
			}, {
				"MinShopPrice": 50000,
				"MaxShopPrice": 70000
			}, {
				"MinShopPrice": 70000,
				"MaxShopPrice": 90000
			}, {
				"MinShopPrice": 90000,
				"MaxShopPrice": 120000
			}, {
				"MinShopPrice": 120000,
				"MaxShopPrice": 160000
			}, {
				"MinShopPrice": 160000,
				"MaxShopPrice": 200000
			}, {
				"MinShopPrice": 200000,
				"MaxShopPrice": 20000000
			}];
			$(".price_list").find("li").on("click", function() {

				$(this).addClass("active").siblings().removeClass("active");
				var $index = $(this).index();

				$(".mask").hide();
				var param = {
					PageIndex: PageIndex,
					PageCount: 5,
					CategoryId: 1,
					Code: $(".location_p").attr("data-code"),
					class_ele: ".product_list .list"
				};
				$(param.class_ele).attr("bool-page", true);
				param = $.extend({}, param, priceArry[$index]);

				$(".product_list .list").attr("data-prop", JSON.stringify(priceArry[$index]));
				GetProductList(param, type);

			});
			//排序
			var intellArry = [{
				"OrderId": "Desc"
			}, {
				"IsShow": "IsNew"
			}, {
				"DescString": "shopprice",
				"Desc": "Asc"
			}, {
				"DescString": "shopprice",
				"Desc": "Desc"
			}, {
				"autoage": "Asc"
			}, {
				"mileage": "Asc"
			}];
			$(".intelligence").find("li").on("click", function() {

				$(this).css("color", "#0090ff").siblings().css("color", "#333");
				var $index = $(this).index();
				$(".mask").hide();

				var param = {
					PageIndex: PageIndex,
					PageCount: 6,
					CategoryId: 1,
					Code: $(".location_p").attr("data-code"),
					class_ele: ".product_list .list"
					// descstring:"shopprice",
					// desc:"asc"
				};
				$(param.class_ele).attr("bool-page", true);
				param = $.extend({}, param, intellArry[$index]);

				$(".product_list .list").attr("data-prop", JSON.stringify(intellArry[$index]));
				GetProductList(param, type);

			})

		};
		//底部分界面,	
	})
})