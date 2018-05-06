var require = require(['main'], function(main) {

	require(['jquery', 'commom', 'load', 'lazyload', 'layer'], function($, commom, load, lazyload, layer) {

		$(function() {

			ranking();
		});

		function ranking() {
			//启动加载
			var Load = new load();
			var param = {
				MemLoginId: commom.getCookie('memlogid')
			}
			$.ajax({
				url: commom.path.httpurl + "?action=GetMember",
				method: 'get',
				dataType: "json",
				timeout: 1000,
				data: param,
				success: function(ret) {
                    //关闭加载
					Load.hide();　
					if(!ret.isError) {

						var arryList = JSON.parse(ret.Msg);
						var $ID = arryList[0].Id;
						var param = {
							MemLoginId: commom.getCookie('memlogid'),
							Id: $ID
						}

						$.ajax({
							url: commom.path.httpurl + "?action=GetTeamCount",
							method: 'get',
							dataType: "json",
							timeout: 1000,
							data: param,
							success: function(ret) {

								if(!ret.isError) {
									var arryList = JSON.parse(ret.Msg);
									var str = '';
									for(var i = 0; i < arryList.length - 1; i++) {

										$(".table .item_tr td").eq(i).text(arryList[i].totalcount);
									}
									//获取团队信息
									var $tab_item = $('.team-tab-item');
									var $tab_item_1 = $('.team-content-tab-item');
									var $tab_content = $('.team-content-item');
									var $tab_content_1 = $('.team-item-content-item');
									var $j = 0;
									var $k = 0;
									$tab_item.click(function() {
										var temp = $j = $(this).index();
										var child_temp = $(this).index($(this).find('active'));
										$(this).addClass('active').siblings().removeClass('active');
										$tab_content.eq(temp).addClass('active').siblings().removeClass('active');

									})
									$tab_item_1.click(function() {
										var parent_temp = $tab_content.index($(this).parents('.team-content-item'));
										var temp = $k = $(this).index();
										$(this).addClass('active').siblings().removeClass('active');
										$tab_content_1.eq(parent_temp * 2 + temp).addClass('active').siblings().removeClass('active');

									});
									for(var j = 0; j < 2; j++) {
										for(var k = 1; k >= 0; k--) {
											//  alert(j+":"+k);
											teamInof($ID, j, k);

										}
									}
									//  teamInof($ID,0,1);
									if($(".table .item_tr td").eq(0).text() == 0 && $(".table .item_tr td").eq(1).text() == 0) {

										$(".null_team").show();
									}
								}
							}
						})
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
		//获取团基本信息
		function teamInof($ID, $j, $k) {
			//从属关系1 2
			//购买与未购买的关系0 1
			var param = {
				MemLoginId: commom.getCookie('memlogid'),
				Id: $ID,
				PageIndex: 1,
				PageCount: 100,
				Level: $j + 1,
				PayType: $k
			};

			$.ajax({
				url: commom.path.httpurl + "?action=GetTeam",
				method: 'get',
				dataType: "json",
				timeout: 1000,
				data: param,
				success: function(ret) {

					if(!ret.isError) {

						var arryList = JSON.parse(ret.Msg);
						$(".team-content-item").eq($j).find(".nav_ul .my_item").eq($k - 1).find("span").text(arryList.length);
						var str = '';
						for(var i = 0; i < arryList.length; i++) {

							var str2 = arryList[i].realname + '&' + arryList[i].photo + '&' + arryList[i].memloginid + '&' + arryList[i].commission;
							str += '<div class="clearfix ranking_list_li" onclick="open_win(\'' + 'my_record' + '\',\'' + str2 + '\')">';
							str += '<div class="show_user">';
							str += '<img class="item-left" src="' + arryList[i].photo + '" />';
							str += '<span class="item-left user">' + arryList[i].realname + '</span></div>';
							str += '<div class="item-right fr">' + arryList[i].commission + '漫豆</div>';
							str += '</div>';
						}
						//从属关系,购买与未购买关系
						$(".team-content-item").eq($j).find(".team-item-content-item").eq($k - 1).append(str);
					}
				}
			})
		}
	})
})