//	 	鼠标长按弹窗
var require = require(['main'], function(main) {

	require(['jquery', 'commom', 'load', 'lazyload', 'layer'], function($, commom, load, lazyload, layer) {

		$(function() {

			//	导航栏切换
			$(".collection_edit .nav_list .nav_li").on("click", function() {

				$(this).addClass("active").siblings().removeClass("active");

				var $index = $(this).index();

				$(".tab_list .teb_li").eq($index).show().siblings().hide();

			});
			//初始化数据
			var collectArr = ['car', 'product', 'member'];
			for(var i = 0; i < 3; i++) {
				collectionList(collectArr[i], i);
			};
			//删除
			Delete();
		})

		function checkall($self, $li) {

			if($self.checked == true) {

				for(var i = 0; i < $li.length; i++) {

					$($li[i]).find("input").checked = true;
					$($li[i]).find("input").attr("checked", "checked");
					$($li[i]).find("input").siblings("i").addClass("active");
				}
			} else {
				for(var i = 0; i < $li.length; i++) {

					$($li[i]).find("input").checked = false;
					$($li[i]).find("input").removeAttr("checked", "checked");
					$($li[i]).find("input").siblings("i").removeClass("active");
				}
			}
		}
		//删除
		function Delete() {

			$(".btn_delete").on("click", function() {

				var $self = $(this);
				var $li = $self.parentsUntil().eq(1).find("li");
				var DeleteArr = [];

				//询问框
				layer.open({
					content: '您确定取消该收藏？',
					btn: ['确定', '取消'],
					yes: function(index) {

						$.each($('input[type=checkbox]:checked').parents('.list_li'), function(index, ele) {
							$(ele).attr("data-guid");
							DeleteArr.push($(ele).attr("data-guid"));
						});
						var str = DeleteArr.join(",");
						DelestCollect(str);
						layer.close(index);
					}
				});

			})

		};

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
									str += '<li class="list_li clearfix" data-guid="' + arryList[i].CollectGuid + '">';
									str += '<div class="checked fl">';
									str += '<input type="checkbox" name="subBox" />';
									str += '<i class="icon"></i>';
									str += '</div>';
									str += '<a href="#" class="fl show_img" onclick="open_details(\'' + arryList[i].Guid + '\')">'
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
									str += '<div class=" clearfix" style="color:#333;font-size:0.375rem;">';
									if(arryList[i].MarketPrice > 10000) {
										var MarketPrice = (arryList[i].MarketPrice) / 10000;
										str += '<div class="fl">新车:<span>' + MarketPrice + '</span>万漫豆</div></div>';
									} else {
										str += '<div class="fl">新车:<span>' + arryList[i].MarketPrice + '漫豆</span></div></div>';
									};

									str += '</div></a></li>';
								}
								str += '<div class="null"></div>';
								$(".tab_list .teb_li").eq(0).append(str);
								break;
							case 'product':

								for(var i = 0; i < arryList.length; i++) {
									str += '<li class="list_li clearfix" data-guid="' + arryList[i].CollectGuid + '">';
									str += '<div class="checked fl">';
									str += '<input type="checkbox" name="subBox" />';
									str += '<i class="icon"></i>'
									str += '</div>';
									str += '<a href="#" class="fl show_img" onclick="open_details1(\'' + arryList[i].Guid + '\')">'
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
									
									str += '</div></div></li>';
								};
								str += '<div class="null"></div>';
								$(".tab_list .teb_li").eq(1).append(str);
								break;
							case 'member':

								for(var i = 0; i < arryList.length; i++) {
									str += '<li class="list_li clearfix user_pp" data-guid="' + arryList[i].CollectGuid + '">';
									str += '<div class="checked fl">';
									str += '<input type="checkbox" name="subBox" />';
									str += '<i class="icon"></i>'
									str += '</div>';
									str += '<img src="' + arryList[i].Photo + '" class="user_photo fl" onclick="open_win(\'' + 'agent_details' + '\',\'' + arryList[i].MemLoginId + '\')"/>';
									str += '<div class="user_info fl">';
									str += '<div class="name">' + arryList[i].RealName + '</div>';
									str += '<div class="power">认证车源:<span>' + arryList[i].ProductCount + '</span></div>';
									str += '</div>';
									str += '</li>';
								}
								str += '<div class="null"></div>';
								$(".tab_list .teb_li").eq(2).append(str);
								break;
							default:
								break;
						};
						//全选
						$(document).on("click", ".collection_foot input", function() {

							var $self = this;

							//单选
							var $li = $(this).parent().parent().siblings("li");
							if($(this).prop("checked")) {
								$(this).attr("checked", "checked");
								$(this).siblings("i").addClass("active");
							} else {
								$(this).removeAttr("checked");
								$(this).siblings("i").removeClass("active");
							}
							checkall($self, $li);
						})
						//多选
						$(document).on("click", ".tab_list .teb_li .list_li input", function() {

							var $sefl = $(this);

							var $ul_li = $sefl.parentsUntil().eq(2).find(".list_li");
							var $ulArry = [];
							var $allcheck = $sefl.parentsUntil(1).siblings(".collection_foot").find("input");

							if($sefl.prop("checked")) {
								$($sefl).attr("checked", "checked");
								$($sefl).siblings("i").addClass("active");
							} else {
								$($sefl).removeAttr("checked");
								$($sefl).siblings("i").removeClass("active");
							}

							for(var i = 0; i < $ul_li.length; i++) {

								if($($ul_li[i]).children().eq(0).find("input").prop("checked")) {

									$ulArry.push($ul_li[i]);

								}
							}
							//  console.log($ulArry);
							//判断是否选完商品
							if($ul_li.length == $ulArry.length) {

								$allcheck.checked = true;
								$($allcheck).attr("checked", "checked");
								$($allcheck).siblings("i").addClass("active");

							} else {

								$allcheck.checked = false;
								$allcheck.removeAttr("checked");
								$($allcheck).siblings("i").removeClass("active");
							}

						});
					} else {

						var arr = ['没有收藏的汽车', '没有收藏的商品', '没有收藏的经纪人'];
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
		};
		//取消收藏
		function DelestCollect(guid) {

			$.ajax({
				url: commom.path.httpurl + "?action=DeleteCollect&guid=" + guid,
				method: 'post',
				dataType: "json",
				timeout: 1000,
				success: function(ret) {

					if(!ret.isError) {

						$.each($('input[type=checkbox]:checked').parents('.list_li'), function(index, ele) {
							$(ele).remove();
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
			})
		}
	})
})