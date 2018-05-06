
var require = require(['main'], function(main) {

	require(['jquery', 'commom', 'layer', 'load', 'lazyload', 'infinitescroll'], function($, commom, layer, load, lazyload, infinitescroll) {

		//初始化数据
		$(function() {

			newsList();
			
		})
		//文章详情
		function newsList() {
			//启动加载
			var Load = new load();

			$.ajax({
				url: commom.path.httpurl + "?action=GetArticle&guid=" + commom.GetQueryString('id'),
				method: 'get',
				dataType: "json",
				timeout: 500,
				success: function(ret) {

					Load.hide();
					if(!ret.isError) {
						var arryList = JSON.parse(ret.Msg);
						var str = '';
						str += '<div class="news_title">' + arryList[0].Title + '</div>';;
						str += '<div class="update_time clearfix">';
						str += '<div class="fl">' + arryList[0].CreateTime + '</div><span class="fl">' + arryList[0].ClickCount + '人浏览</span></div>'
						str += '<div class="new_content">' + arryList[0].Content + '</div>';
						$(".news_mian").append(str);
						//推荐商品
						recommend_good();
					}
				}
			})
		};
		//推荐商品
		function recommend_good() {
			var param = {
				PageIndex: 1,
				PageCount: 10,
				CategoryId: 2,
				IsShow: "IsRecommend",
				class_ele: ".product_list .list ",

			};
			GetProductList(param);
		};

		function GetProductList(param) {
			var str = '';
			$.ajax({
				url: commom.path.httpurl + "?action=getproductlist",
				method: 'get',
				dataType: "json",
				timeout: 500,
				data: param,
				success: function(ret) {
					//  alert(ret.Msg);
					if(ret) {
						var arryList = JSON.parse(ret.Msg);
						var str = '';
						for(var i = 0; i < arryList.length; i++) {

							str += '<li class="list_li">';
							str += '<a class="clearfix" href="details2.html?id='+arryList[i].Guid+'">';
							str += '<img class="fl" src="' + arryList[i].OriginalImge + '"/>';
							str += '<div class="conten_main fl">';
							str += ' <div class="title">' + arryList[i].Name + '</div>';

							str += '<div class="price clearfix"><div class="fl">';
							str += '<span>会员价:￥</span>';
							if(arryList[i].ShopPrice > 10000) {
								var ShopPrice = (arryList[i].ShopPrice) / 10000;
								str += '<span class="red_price">' + ShopPrice + '</span>万</div>';
							} else {
								str += '<span class="red_price">' + arryList[i].ShopPrice + '</span></div>';
							};
							if(arryList[i].MarketPrice > 10000) {
								var MarketPrice = (arryList[i].MarketPrice) / 10000;
								str += '<div class="fr">车豆:<span>' + MarketPrice + '万</span></div></div>';
							} else {
								str += '<div class="fr">车豆:<span>' + (arryList[i].MarketPrice).split(".")[0] + '</span></div></div>';
							};
							//  str+='<span class="red_price">'+arryList[i].ShopPrice+'</span>万</div>';
							//  str+='<div class="fr">车豆：<span>'+ arryList[i].MarketPrice+'</span></div></div>';

							str += '<div class="price clearfix"><div class="fl">';
							str += '<span>返利:</span>';
							str += '<span class="red_price">' + arryList[i].PushMoney + '</span>车豆</div>';
							str += '<div class="fr"><span>' + arryList[i].SaleNumber + '人购买</span></div></div>';

							str += '</div></a></li>';
						}

						$(param.class_ele).append(str);

					};
				}
			});
		}
		
		//底部分界线

	})
})