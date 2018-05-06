var require = require(['main'], function(main) {

	require(['jquery', 'commom', 'swiper', 'layer', 'load', 'lazyload'], function($, commom, swiper, layer, load, lazyload) {

		//初始化数据
		$(function() {
            //选择城市
			if(commom.getItem('city')) {

				var arr = (commom.getItem('city')).split("|");
				$(".search .location span").text(arr[0]);
				$(".location").attr("data-code", arr[1]);
				
				//				cityList(arr[0]);
			} else {
               //定位城市
				if(commom.getItem('cityName')) {

					$(".search .location span").text(commom.getItem('cityName'));
					$(".location").attr("data-code", commom.getItem('cityCode'));
				}
			}
			//轮播
			auto_banner(function(msg) {

				var mySwiper = new Swiper('.swiper-container', {
					autoplay: 3000,
					speed: 500,
					pagination: '.swiper-pagination',
					paginationClickable: true,
					loop: true,
					loopAdditionalSlides: 1,
					autoplayDisableOnInteraction: false
				});
				//推荐商品
			    recommend_good();
			    //精品商品
			    best_good();
			});
			 //推荐好友
			$(".information .recommend0").on('click', function() {

				commom.isLogin('extension');
			});
			 //好友成绩
			$(".information .ranking0").on('click', function() {

				commom.isLogin('ranking_list');
			});
			 //充值
			$(".information .recharge0").on('click', function() {

				commom.isLogin('recharge');
			});
			//购物车
			$(".qrcode").on("click",function(){
				
				 commom.isLogin('cart');
			});
			$("#footer .cart").on("click",function(){
				
				 commom.isLogin('cart');
			});
			//进入个人中心
			$("#footer .person").on("click", function() {

				commom.isLogin('person');
			});
			
		});
		//推荐商品
		function recommend_good() {
			
			var param = {
				PageIndex: 1,
				PageCount: 3,
				CategoryId: 2,
				IsShow: "IsRecommend",
				class_ele: ".recommend",

			};

			GetProductList2(param);
		};
		//精品商品
		function best_good() {
			var param = {
				PageIndex: 1,
				PageCount: 3,
				CategoryId: 2,
				IsShow: "IsBest",
				class_ele: ".boutique",

			};

			GetProductList2(param);
		};

		function GetProductList2(param) {

			$.ajax({
				url: commom.path.httpurl + "?action=getproductlist",
				method: 'get',
				dataType: "json",
				timeout: 500,
				data: param,
				success: function(ret) {
					$(param.class_ele).siblings().show();
					if(!ret.isError) {
						$(param.class_ele).parent().show();
						var arryList = JSON.parse(ret.Msg);
						var str = '';
						for(var i = 0; i < arryList.length; i++) {

							str += '<li class="list_li">';
							str += '<a class="clearfix" href="details1.html?id='+arryList[i].Guid+'" >';
							str += '<img class="fl lazy" data-original="' + arryList[i].OriginalImge + '"/>';
							str += '<div class="conten_main fl">';
							str += ' <div class="title">' + arryList[i].Name + '</div>';

							str += '<div class="price clearfix">';
					
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
							str += '<div class="fl"><span>' + arryList[i].SaleNumber + '人购买</span></div></div>';

							str += '</div></a></li>';
						};

						$(param.class_ele).append(str);
						$("img.lazy").lazyload({
							placeholder: "../image/img_load.gif",
							threshold: -50
						});
					} else {
						$(param.class_ele).parent().hide();
					};
				}
			});
		};
		//轮播图
		function auto_banner(callback) {
			//启动加载
			var Load = new load();
			$.ajax({
				url: commom.path.httpurl + '?action=getshopbanner',
				dataType: 'json',
				method: 'get',
				timeout: 500,
				success: function(ret) {
					//关闭加载
					Load.hide();
					if(!ret.isError) {

						var banner_arr = JSON.parse(ret.Msg);
						var str = '';
						str += '<div class="swiper-container"><div class="swiper-wrapper">';
						for(var i = 0; i < banner_arr.length; i++) {
							str += '<div class="swiper-slide" onclick="BannerWx(\'' + banner_arr[i].Url + '\',\'' + 'details1' + '\')">';
							str += '<img src="' + banner_arr[i].Value + '"/>'
							str += "</div>";
						};
						str += '</div><div class="swiper-pagination"></div></div>';
						$(".information").before(str);
						callback(true);
					}
				}

			});
		}
		//底部分界面
	});
})