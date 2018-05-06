var require = require(['main'], function(main) {

	require(['jquery', 'commom', 'layer', 'load', 'pinyin', 'sort'], function($, commom, layer, load, pinyin, sort) {

		//初始化加载
		$(function() {

			//初始化时间
			var windHeight = $(window).height();
			$('.hot_list').height(windHeight);
			$('.two_list').height(windHeight);

			brandList1(function(arryList) {

				brandList2(arryList[0].Guid, arryList[0].Name);
			});
			
			//二级车系
			$(".sort_box").on("click",'.sort_list',function(){
				
				 var guid=$(this).attr('data-guid');
				 var name=$(this).attr('data-name');
				 brandList2(guid,name);
			});
			//提交车系
			chooseBrand();
		});
		//一级牌子
		function brandList1(callback) {

			var Load = new load();
			$.ajax({
				url: commom.path.httpurl + "?action=getproductbrandlist&pageindex=1&pagecount=500",
				method: 'get',
				dataType: "json",
				timeout: 1000,
				async:false,
				success: function(ret) {
					//关闭加载
					Load.hide();
					// alert(ret.Msg)
					if(!ret.isError) {
						var arryList = JSON.parse(ret.Msg);
						var str = '';

						for(var i = 0; i < arryList.length; i++) {

							str += '<div class="sort_list clearfix"  data-guid="'+arryList[i].Guid+'" data-name="'+arryList[i].Name+'">';
							str += '<img src="' + arryList[i].Logo + '" class="fl"/>';
							str += '<div class="num_name fl">' + arryList[i].Name + '</div>';
							str += '</div>';

						}
						$(".sort_box").append(str);
						$(".sort_list").eq(0).addClass("active");
						citySort("html,.hot_list");
						$(document).on("click", '.hot_list .sort_list', function() {

							$(this).addClass("active").siblings().removeClass("active");
						});
						callback(arryList);
					}
				}
			})
		}
		//二级车系
		function brandList2(Guid, BrandName) {

			var param = {
				//  PropName:value.key2,
				BrandGuid: Guid
			};

			$.ajax({

				url: commom.path.httpurl + "?action=getproductprop",
				method: 'get',
				dataType: "json",
				data: param,
				timeout: 1000,
				success: function(ret) {

					if(!ret.isError) {
						var arryList = JSON.parse(ret.Msg);
						var arryList2 = JSON.parse(arryList[0].PropValue);
						var str = '';
						if($(".two_list").has("li")) {

							$(".two_list").find("li").remove();
							for(var i = 0; i < arryList2.length; i++) {

								str += '<li class="two_li" data-name="'+BrandName + arryList2[i].Name+'" >' + arryList2[i].Name + '</li>';

							}

						} else {
							for(var i = 0; i < arryList2.length; i++) {

								str += '<li class="two_li" data-name="'+BrandName + arryList2[i].Name+'">' + arryList2[i].Name + '</li>';
							}
						}
						$(".two_list").append(str);

					} else {

						var str = '';
						if($(".two_list").has("li")) {

							$(".two_list").find("li").remove();
							str += '<li class="two_li" data-name="'+BrandName+'" >' + BrandName + '</li>';

						} else {

							str += '<li class="two_li" data-name="'+BrandName+'">' + BrandName + '</li>';

						};
						$(".two_list").append(str);
					}
				}
			})
		};
		function chooseBrand() {

			$(".two_list").on("click",'.two_li',function(){
				 
				 var BrandName=$(this).attr('data-name');
				 commom.setItem([{'name':'BrandName','value':BrandName}]);
			})
		};
      //底部分界线
	})
});