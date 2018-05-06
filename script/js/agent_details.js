var require = require(['main'], function(main) {

	require(['jquery', 'commom', 'layer', 'load', 'lazyload', 'infinitescroll'], function($, commom, layer, load, lazyload, infinitescroll) {

		var fage = true; //判断是否收藏成功
		$(function() {

			var guid = commom.GetQueryString('str');
			Agent(guid, function() {

				GetAgentProduct(guid, 1);
			});
			//页数
			var page = 1;
			//加载数据
			var InfiniteScroll = new infinitescroll({
				loadListFn: function() {
					page = $(".product_list .list").attr("data-page");
					InfiniteScroll.options.open = $(".product_list .list").attr("bool-page");
					page++;
					GetAgentProduct(guid, page)
				}
			});
			//收藏
			collection(guid);

		})

		function Agent(guid, callback) {

			$.ajax({
				url: commom.path.httpurl + "?action=getmember&memloginid=" + guid,
				method: 'get',
				dataType: "json",
				success: function(ret) {

					if(!ret.IsError) {
						var listArry = JSON.parse(ret.Msg);
						$(".loading_more").show();
						$(".loading_more").find(".loading-time").hide();
						$(".loading_more").find(".loading_fish").show();
						var str = '';
						str += '<div class="agent clearfix" onclick="open_win(\'' + 'agent_details' + '\',\'' + guid + '\')">';
						str += '<img src="' + listArry[0].Photo + '" class="fl"/>';
						str += '<div class="fl user_li">';
						str += '<div class="user_name">' + listArry[0].RealName + '</div>';
						str += '<div class="user_tt">认证车源:<span>' + listArry[0].ProductCount + '</span></div></div>';
						str += '</div>';
						$(".Agent").append(str);
						callback();
					} else {

					}
				}
			})
		};
		//经纪人商品
		function GetAgentProduct(guid, page) {

			var param = {
				PageIndex: page,
				PageCount: 6,
				MemLoginID: guid
			}
			//启动加载
			var Load = new load();

			$.ajax({
				url: commom.path.httpurl + "?action=GetMemberProduct",
				method: 'get',
				dataType: "json",
				timeout: 500,
				data: param,
				success: function(ret) {
					//关闭加载
					Load.hide();
					if(!ret.isError) {
						$(".loading_more").show();
						$(".loading_more").find(".loading-time").hide();
						$(".loading_more").find(".loading_fish").show();
						var arryList = JSON.parse(ret.Msg);
						var str = '';
						for(var i = 0; i < arryList.length; i++) {

							str += '<li class="list_li">';
							str += '<a class="clearfix" href="../html/details2.html?id=' + arryList[i].Guid + '")">';
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

						};

						$(".product_list .list").append(str);
						$(".product_list .list").attr("data-page", param.PageIndex);
						$(".product_list .list").attr("bool-page", true);
						$("img.lazy").lazyload({
							placeholder: "../image/img_load.gif",
							threshold: -50
						});
						//collection(guid);
					} else {

						$(".loading_more").show();
						$(".product_list .list").attr("bool-page", false);
						$(".loading_more").find(".loading-time").hide();
						$(".loading_more").find(".loading_fish").show();
					}
				}
			})
		};
		//收藏
		function collection(guid) {

			InitProductCollect(guid)
			$(document).on("click", ".Agent i.fr", function() {
				//判断是否登录
				commom.isLogin();
				var $self = $(this);
				if(fage) {

					UpdateProductCollect(0, guid, 1);

				} else {

					UpdateProductCollect(1, guid, 0);
				};
			})

		};
		//初始化收藏
		function InitProductCollect(guid) {
			//判断是否登录
			var is = typeof commom.getCookie('memlogid') == 'string' ? true : false;
			if(!is) {
				return false;
			}
			//初始化收藏数据
			var param = {
				MemLoginId: commom.getCookie('memlogid'),
				AgentId: guid,
			}
			//  alert(JSON.stringify(param))
			$.ajax({
				url: commom.path.httpurl + "?action=GetProductCollect",
				method: 'get',
				dataType: "json",
				timeout: 500,
				data: param,
				success: function(ret) {

					if(!ret.isError) {

						$(".Agent i.fr").addClass("icon-xing").removeClass("icon-fav");
						$(".Agent i.fr").css("color", "#d20000");
						fage = false;
					}
				}
			});
		};
		//提交收藏数据
		function UpdateProductCollect(type, guid, index) {

			//启动加载
			var Load = new load();
			var param = {
				MemLoginId: commom.getCookie('memlogid'),
				AgentId: guid,
				IsCollect: type
			};
			$.ajax({
				url: commom.path.httpurl + "?action=UpdateProductCollect",
				method: 'post',
				dataType: "json",
				timeout: 500,
				data: param,
				success: function(ret) {
					//关闭加载
					Load.hide();
					if(!ret.isError) {
						$(".Agent i.fr").addClass("icon-xing").removeClass("icon-fav");
						$(".Agent i.fr").css("color", "#d20000");
						//提示
						if(index == 1) {
							layer.open({
								content: '收藏成功',
								skin: 'msg',
								time: 2 //2秒后自动关闭
							});
							$(".Agent i.fr").addClass("icon-xing").removeClass("icon-fav");
							$(".Agent i.fr").css("color", "#d20000");
							fage = false;
						} else if(index == 0) {
							layer.open({
								content: '取消收藏',
								skin: 'msg',
								time: 2 //2秒后自动关闭
							});
							$(".Agent i.fr").addClass("icon-fav").removeClass("icon-xing");
							$(".Agent i.fr").css("color", "#666");
							fage = true;
						}

					} else {

						layer.open({
							content: '收藏失败',
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});
					}
				}
			})
		}
		//底部分界线
	})
})