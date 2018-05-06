var require = require(['main'], function(main) {

	require(['jquery', 'commom', 'swiper', 'layer', 'load', 'lazyload', 'infinitescroll', 'cookie'], function($, commom, swiper, layer, load, lazyload, infinitescroll) {

		//初始化数据
		$(function() {

			//选择城市
			if(commom.getItem('city') != null) {
				//  
				var arr = (commom.getItem('city')).split("|");
				$(".location").attr("data-code", arr[1]);
				$(".location").find("span").text(arr[0]);
				cityList();
				console.log(commom.getItem('city'))
			} else {
				//            
				if(commom.getItem('cityName')) {
					//已经定位				  
					cityList(commom.getItem('cityName'));
					$(".location").attr("data-code", '');
					$(".location").find("span").text(commom.getItem('cityName'));
					cityList();
				} else {
                    //定位中
					//城市列表
					$(".location").attr("data-code", '');
					cityList();
					LoctionCity(function(msg) {

						var arr = [{
							'name': 'cityName',
							'value': '全国'
						}];
						//存储城市及编码
						commom.setItem(arr);

					});
					//
				}
			};
			//			//初始化品牌栏
			GetProductBrandList();
			//轮播
			auto_banner(function(msg) {

				var mySwiper = new Swiper('.swiper-container', {
					autoplay: 3000,
					speed: 500,
					pagination: '.swiper-pagination',
					paginationClickable: true,
					loop: true,
					loopAdditionalSlides: 1,
					autoplayDisableOnInteraction: false,

				});
			});
			//			//页数
			var page = 1;
			//加载数据
			var InfiniteScroll = new infinitescroll({
				loadListFn: function() {
					page = $(".all_car").attr("data-page");
					InfiniteScroll.options.open = $(".all_car").attr("bool-page");
					page++;
					var code = $(".location").attr("data-code");
					all_good(page, code, 1);
				}
			});
			//悬浮窗
			$(window).scroll(function(event) {

				var winPos = $(window).scrollTop();
				if(winPos > 20) {
					$(".float_btn").show();
					$(".float_btn").on("click", function() {
						$(window).scrollTop(0);
						$(this).hide();
					})
				} else {
					$(".float_btn").hide();
				}

			});

			//进入个人中心
			$("#footer .person").on("click", function() {

				commom.isLogin('person');
			});
			//进入购物车
			$("#footer .cart").on("click", function() {

				commom.isLogin('cart');
			});
			//我要卖车
			$(".information .sellcar").on('click', function() {

				commom.isLogin('sell_car');
			});
			//申请渠道商
			$(".information .trader").on('click', function() {

				commom.isLogin('channel_trader');
			});
			//推荐好友
			$(".information .recommend").on('click', function() {

				commom.isLogin('extension');
			});
		});
		//城市定位
		function LoctionCity(callback) {

			var geolocation = new BMap.Geolocation();
			// 创建地理编码实例    
			var myGeo = new BMap.Geocoder();
			geolocation.getCurrentPosition(function(r) {
				if(this.getStatus() == BMAP_STATUS_SUCCESS) {
					var pt = r.point;
					// 根据坐标得到地址描述  
					myGeo.getLocation(pt, function(result) {
						if(result) {
							var addComp = result.addressComponents;
							$(".location").find("span").text('全国');
							callback(addComp.city);
						};
					});
				};
			});
		};
		//城市列表
		function cityList() {
			
           var code=$(".location").attr("data-code");
			//热门商品；
			hot_good(code, 0);
			//精品商品
			best_good(code, 0);
			//所有商品
			all_good(1, code, 0);
			//准新车传参
			gradeCar();
			//价位传参
			priceList();
		};
		//轮播图
		function auto_banner(callback) {
			//启动加载
			var Load = new load();
			$.ajax({
				url: commom.path.httpurl + '?action=getdefaultbanner',
				dataType: 'json',
				method: 'get',
				//				async: false,
				timeout: 1000,
				success: function(ret) {
					//关闭加载
					Load.hide();
					if(!ret.isError) {

						var banner_arr = JSON.parse(ret.Msg);
						var str = '';
						str += '<div class="swiper-container">	<div class="swiper-wrapper">';
						for(var i = 0; i < banner_arr.length; i++) {
							str += '<div class="swiper-slide" onclick="BannerWx(\'' + banner_arr[i].Url + '\',\'' + 'details2' + '\')">';
							str += '<img src="' + banner_arr[i].Value + '"/>'
							str += "</div>";
						}
						str += '</div><div class="swiper-pagination"></div></div>'
						$(".car_title").before(str);
						callback();

					} else {

						layer.open({
							content: ret.msg,
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
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					//关闭加载
					Load.hide();
					layer.open({
						content: '数据加载失败,请重新刷新数据!',
						skin: 'msg',
						time: 2 //2秒后自动关闭
					});
				}
			});
		};
		//品牌栏
		function GetProductBrandList() {

			var str = '';
			$.ajax({

				url: commom.path.httpurl + "?action=getproductbrandlist&pageindex=1&pagecount=20&isrecommend=1",
				method: 'get',
				dataType: "json",
				timeout: 1000,
				success: function(ret) {

					if(!ret.isError) {
						var Brand_arr = [];
						var listArry = JSON.parse(ret.Msg);

						for(var i = 0; i < listArry.length; i++) {

							Brand_arr.push({
								"BrandGuid": listArry[i].Guid
							});
							str += '<a class="fl">';
							str += '<img src="' + listArry[i].Logo + '"/>';
							str += '<span>' + listArry[i].Name + '</span>';
							str == '</a>';
						};

						$(".title_li3").append(str);
						$(document).on("click", ".title_li3 a", function() {
							var $index = $(this).index();

							var str = JSON.stringify(Brand_arr[$index]);
							commom.OpenView("buycar_frm", str);

						});
					} else if(err) {

						layer.open({
							content: ret.msg,
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});
					};
				}
			});
		};
		//优惠商品
		function hot_good(code, type) {
			var param = {
				PageIndex: 1,
				PageCount: 3,
				CategoryId: 1,
				IsShow: "IsHot",
				class_ele: ".hot",
				cityCode: code
			};
			//  param = $.extend({}, param, arryObj);

			GetProductList(param, type);
		};
		//精品车
		function best_good(code, type) {
			var param = {
				PageIndex: 1,
				PageCount: 3,
				CategoryId: 1,
				IsShow: "IsBest",
				cityCode: code,
				class_ele: ".boutique"
			};
			// 	param = $.extend({}, param, arryObj);
			GetProductList(param, type);
		};
		//所有汽车产品
		function all_good(PageIndex, code, type) {
			var param = {
				PageIndex: PageIndex,
				PageCount: 8,
				CategoryId: 1,
				class_ele: ".all_car",
				cityCode: code,
			};

			GetProductList(param, type);
		};
		//产品列表
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
					//关闭加载
					Load.hide();
					//滑动刷新
					if(type == 1) {
						updateDate(1);
					} else {
						updateDate(0);

					};

					//更新数据
					function updateDate(type) {

						if(!ret.isError) {
							$(param.class_ele).siblings().show();
						
							$(".loading_more").show();
							$(".loading_more").find(".loading-time").hide();
							$(".loading_more").find(".loading_fish").show();
							var arryList = JSON.parse(ret.Msg);
							var str = '';

							for(var i = 0; i < arryList.length; i++) {
								str += '<li class="list_li" >';
								str += '<a class="clearfix" href="../html/details2.html?id=' + arryList[i].Guid + '")" >';
								str += '<img class="fl lazy" data-original="' + arryList[i].OriginalImge + '" />';
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
							};

							$(param.class_ele).append(str);
							$(param.class_ele).attr("data-page", param.PageIndex);
							$(param.class_ele).attr("bool-page", true);
							$("img.lazy").lazyload({
								placeholder: "../image/img_load.gif",
								threshold: -50
							});
						} else {
							if(type == 0) {

								$(param.class_ele).siblings().hide();

							};
							$(".loading_more").show();
							$(param.class_ele).attr("bool-page", false);
							$(".loading_more").find(".loading-time").hide();
							$(".loading_more").find(".loading_fish").show();

						};

					};
				},
				　complete: function(XMLHttpRequest, status) { //请求完成后最终执行参数
					　　　　
					if(status == 'timeout') { //超时,status还有success,error等值的情况
						//关闭加载
						Load.hide();　　　　　　　　　
						layer.open({
							content: '请求超时,检查网络,重新上拉刷新!',
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});　　　　
					}　　
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					//关闭加载
					Load.hide();
					layer.open({
						content: '数据加载失败,请重新上拉刷新数据!',
						skin: 'msg',
						time: 2 //2秒后自动关闭
					});
				}
			});
		};
		// 价位传参
		function priceList() {

			var arry = [{
				"MinShopPrice": 0,
				"MaxShopPrice": 100000
			}, {
				"MinShopPrice": 100000,
				"MaxShopPrice": 200000
			}, {
				"MinShopPrice": 200000,
				"MaxShopPrice": 300000
			}, {
				"MinShopPrice": 300000,
				"MaxShopPrice": 10000000
			}];

			$(".title_li2 a").on("click", function() {

				var $index = $(this).index();
				var str = JSON.stringify(arry[$index]);
				commom.OpenView("buycar_frm", str);

			})

		}
		//准新车传参
		function gradeCar() {
			$.ajax({

				url: commom.path.httpurl + "?action=getproductprop&PropName=新旧",
				method: 'get',
				dataType: "json",
				success: function(ret) {

					if(!ret.isError) {
						var objCar = [];
						var arryList2;
						var arryList1 = JSON.parse(ret.Msg);
						arryList2 = JSON.parse(arryList1[0].PropValue);

						for(var j = 0; j < arryList2.length; j++) {
							objCar.push({
								"prop": arryList1[0].ID + ":" + arryList2[j].ID
							});
						}

						$(".car_title .title_li1 a").on('click', function() {
							var $index = $(this).index();
							commom.OpenView("buycar_frm", JSON.stringify(objCar[$index]));
						})

					} else {

						layer.open({
							content: ret.msg,
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});
					}
				}
			});
		}
		//底部分界线
	});
});