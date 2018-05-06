var require = require(['main'], function(main) {

	require(['jquery', 'commom', 'load','layer','lazyload', 'infinitescroll'], function($, commom, load, lazyload,layer,infinitescroll) {

		//初始化数据
		$(function() {
             
             //h获取高度
             var Height=$(window).height();
             $(".classify_list").height(Height);
              $(".classify_title").height(Height);
             //导航标题
			GetProductCategory();
			
			//页数
			var page = 1;
			//加载数据
			var InfiniteScroll = new infinitescroll({
				el:'.classify_list',
				loadListFn: function() {
					page = $(".classify_list .active").attr("data-page");
					var $index = $(".classify_list .active").attr("data-li");
					var id = $(".classify_list .active").attr("data-id");
					InfiniteScroll.options.open = $(".classify_list .active").attr("bool-page");
					page++;
					var param = {
							PageIndex: page,
							PageCount: 3,
							CategoryId: id,
							class_ele: ".classify_list .list_tab",
							// Code:"019001"
						};
					GetProductList(param, $index, 1);
				}
			})
		});
		//分类列表
		function GetProductCategory() {

			var str = '';
			var str2 = '';
			console.log(commom.path.httpurl)
			$.ajax({
				url: commom.path.httpurl + "?action=getproductcategory&CategoryLevel=2&FatherId=2",
				method: 'get',
				dataType: "json",
				timeout: 500,
				success: function(ret) {
                     console.log(ret)
					if(!ret.isError) {
						var listArry = JSON.parse(ret.Msg);
						//  var arr=[];
						for(var i = 0; i < listArry.length; i++) {
							// arr.push(listArry[i].ID);
							str += '<li class="title_li">' + listArry[i].Name + '</li>';
							str2 += '<li class="list_tab"><div class="classify_li"></div>';
							str2 += '</li>';
							indexList(listArry[i].ID, i, 0);
						};
						$(".classify_title").append(str);
						$(".classify_list").append(str2);
						$(".classify .title_li").eq(0).addClass("active");
						$(".classify .classify_list").find("li").eq(0).addClass("active");

						$(document).on("click", ".classify .title_li", function() {

							$(this).addClass("active").siblings().removeClass("active");

							var $index = $(this).index();

							$(".classify_list .list_tab").eq($index).addClass("active").siblings().removeClass("active");

						});
						//  indexList(arr[0]);
						function indexList(Categoryid, $index, type) {

							var param = {
								PageIndex: 1,
								PageCount: 3,
								CategoryId: Categoryid,
								class_ele: ".classify_list .list_tab",
								// Code:"019001"
							};
							GetProductList(param, $index, type);
						}

					} else {

					};
				}
			});
		};
		//商品列表
		function GetProductList(param, $index, type) {

			//启动加载
			var Load = new load();
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
					console.log(JSON.parse(ret.Msg))
					if(type == 1) {
                
						if(!ret.isError) {

							$(".loading_more").show();
							$(".loading_more").find(".loading-time").hide();
							$(".loading_more").find(".loading_fish").show();
							if(ret.Msg) {
								var arryList = JSON.parse(ret.Msg);
								var str = '';
								for(var j = 0; j < arryList.length; j++) {

									str += '<a class="list_tab_li" href="details1.html?id='+arryList[j].Guid+'" >';
									str += '<img class="lazy" data-original="' + arryList[j].OriginalImge + '"/>';
									str += '<div class="title">' + arryList[j].Name + '</div>';
									str += '<div class="price clearfix">';
//									if(arryList[j].ShopPrice > 10000) {
//										var ShopPrice = (arryList[j].ShopPrice) / 10000;
//										str += '	<div class="fl">会员价:￥<span class="red_price">' + ShopPrice + '万</span></div>';
//									} else {
//										str += '	<div class="fl">会员价:￥<span class="red_price">' + arryList[j].ShopPrice + '</span></div>';
//									};
									if(arryList[j].MarketPrice > 10000) {
										var MarketPrice = (arryList[j].MarketPrice) / 10000;
										str += '<div class="fl">漫豆:<span style="font-size: 0.4375rem;">' + MarketPrice + '万</span></div>';
									} else {
										str += '<div class="fl">漫豆:<span style="font-size: 0.4375rem;">' + (arryList[j].MarketPrice).split(".")[0] + '</span></div>';
									};
									str+='<div class="fr back">返利<span class="">' + arryList[j].PushMoney + '</span>漫豆</div></div>';
									str += '<div class="price clearfix">';
									str += '<div class=""><span>' + arryList[j].SaleNumber + '人购买</span></div></div>';
									str += '</a>';
								}

								$(param.class_ele).eq($index).find(".classify_li").append(str);
								$(param.class_ele).eq($index).attr("data-page", param.PageIndex);
								$(param.class_ele).eq($index).attr("data-li", $index);
								$(param.class_ele).eq($index).attr("data-id", param.CategoryId);
								$(param.class_ele).eq($index).attr("bool-page", true);
								$(param.class_ele).eq($index).find(".loading_more").show();
								$(".loading_more").find(".loading-time").hide();
								$(".loading_more").find(".loading_fish").show();

								$("img.lazy").lazyload({
									placeholder: "../image/img_load.gif",
									threshold: 600
								});

							};

						} else {
							$('.classify_list .list_tab').eq($index).attr("bool-page", false);
							$(".loading_more").css("display", "block");
							$(".loading_more").find(".loading-time").hide();
							$(".loading_more").find(".loading_fish").show();
						}

					} else if(type == 0) {

						if(!ret.isError) {

							if(ret.Msg) {
								var arryList = JSON.parse(ret.Msg);
								var str = '';
								for(var j = 0; j < arryList.length; j++) {

									str += '<a class="list_tab_li" href="details1.html?id='+arryList[j].Guid+'" >';
									str += '<img class="lazy" data-original="' + arryList[j].OriginalImge + '"/>';
									str += '<div class="title">' + arryList[j].Name + '</div>';
									str += '<div class="price clearfix">';
//									if(arryList[j].ShopPrice > 10000) {
//										var ShopPrice = (arryList[j].ShopPrice) / 10000;
//										str += '	<div class="fl">会员价:￥<span class="red_price">' + ShopPrice + '万</span></div>';
//									} else {
//										str += '	<div class="fl">会员价:￥<span class="red_price">' + arryList[j].ShopPrice + '</span></div>';
//									};
									if(arryList[j].MarketPrice > 10000) {
										var MarketPrice = (arryList[j].MarketPrice) / 10000;
										str += '<div class="fl">漫豆:<span style="font-size: 0.4375rem;">' + MarketPrice + '万</span></div>';
									} else {
										str += '<div class="fl">漫豆:<span style="font-size: 0.4375rem;">' + (arryList[j].MarketPrice).split(".")[0] + '</span></div>';
									};
									str+='<div class="fr back">返利<span class="">' + arryList[j].PushMoney + '</span>漫豆</div></div>';
									str += '<div class="price clearfix">';
									str += '<div class=""><span>' + arryList[j].SaleNumber + '人购买</span></div></div>';
									str += '</a>';

								}

								var str2 = '<div class="loading_more"><div class="loading-time"><img src="../image/loadingImg.gif" /><span>努力加载中...</span></div>';
								str2 += '<div class="loading_fish" style="display:none"><img src="../image/loading_fish.png" /><span>数据加载完毕</span></div></div>';
								$(param.class_ele).eq($index).find(".classify_li").append(str);
								$(param.class_ele).eq($index).find(".classify_li").after(str2);
								$(param.class_ele).eq($index).attr("data-page", param.PageIndex);
								$(param.class_ele).eq($index).attr("data-li", $index);
								$(param.class_ele).eq($index).attr("data-id", param.CategoryId);
								$(param.class_ele).eq($index).attr("bool-page", true);
								$(".loading_more").show();
								$(".loading_more").find(".loading-time").hide();
								$(".loading_more").find(".loading_fish").show();
								$("img.lazy").lazyload({
									placeholder: "../image/img_load.gif",
									threshold: 300
								});

							};

						} else {

							$('.classify_list .list_tab').eq($index).attr("bool-page", false);
						}
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
		//底部分界面
	})
})