var require = require(['main'], function(main) {

	require(['jquery', 'commom', 'load', 'lazyload', 'layer', 'swiper'], function($, commom, load, lazyload, layer, swiper) {

		$(function() {

			//轮播图
			var mySwiper = new Swiper('.swiper-container', {
				//				autoplay: 3000,
				speed: 500,
				pagination: '.swiper-pagination',
				paginationClickable: true,
				loop: true,
				loopAdditionalSlides: 1,
				autoplayDisableOnInteraction: false
			});
			ChangeMoney() ;
			
			var $tab_item = $('.team-tab-item');
			var $tab_content = $('.ranking_list_main .ranking_list');
			$(document).on("click", '.team-tab-item', function() {
				//  alert($(this).index());
				var temp = $(this).index();
				$(this).addClass('active').siblings().removeClass('active');
				$tab_content.eq(temp).show().siblings().hide();
			})

		});

		function ranking(index,rate) {
			var ranking = ["GetRankingList", "GetRankingListByMonth"];
			//启动加载
			var Load = new load();
			//  alert(param.MemLoginId);
			$.ajax({
				url: commom.path.httpurl + "?action=" + ranking[index],
				method: 'get',
				dataType: "json",
				timeout: 1000,
				success: function(ret) {
					Load.hide();
					if(!ret.isError) {
						var arryList = JSON.parse(ret.Msg);
						var str = '';
						for(var i = 0; i < arryList.length; i++) {

							str += '<li class="clearfloat ranking_list_li">';
							str += '<div class="show_user"><span class="fl num">' + arryList[i].Ranking + '</span>';
							str += '<img class="fl" src="' + arryList[i].Photo + '" />';
							str += '<span class="fl user">' + arryList[i].RealName + '</span></div>';
							str += '<div class="fr">漫豆' + (arryList[i].TotalCommission)*rate + '</div>';
							str += '</li>';
						};
						$(".ranking_list_main .ranking_list").eq(index).append(str);
						//遍历排名，给1-3名添加图标
						$(".ranking_list_main .ranking_list").eq(index).find('li').each(function() {

							var temp = parseInt($(this).find('.num').html());

							if(temp == 1 || temp == 2 || temp == 3) {
								var class_str = temp == 1 ? 'one' : ((temp == 2) ? 'two' : 'three');

								$(this).find('.num').html('');
								$(this).find('.num').addClass(class_str);
							};
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
		};

		function ChangeMoney() {
			//启动加载
			var Load = new load();
			$.ajax({
				url: commom.path.httpurl + "?action=GetRate",
				method: 'get',
				dataType: "json",
				timeout: 1000,
				async: false,
				success: function(ret) {
					//关闭加载
					Load.hide();
					if(!ret.isError) {

                        ranking(0,ret.Msg);
			            ranking(1,ret.Msg);
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
	})
})