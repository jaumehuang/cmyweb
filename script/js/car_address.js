var require = require(['main'], function(main) {

	require(['jquery', 'commom', 'layer', 'load', 'pinyin', 'sort'], function($, commom, layer, load, pinyin, sort) {

		//初始化数据
		$(function() {
            
            var windHeight = $(window).height();
			$('.hot_list').height(windHeight - $(".car_address .location").outerHeight() - 20);
			$('.two_list').height(windHeight - $(".car_address .location").outerHeight() - 20);
			addressList1();
			//当前定位城市
			if(commom.getCookie('cityName')){
				
				var city = commom.getCookie('cityName');
			    $(".location span").text(city);
			    
			};
			//二级地址
			$(".sort_box").on("click",'.sort_list',function(){
				
				 var id=$(this).attr('data-id');
				 var name=$(this).attr('data-name');
				 cityList2(id, name);
			})
			//选择城市
			chooseCity();
		})
		//一级地址
		function addressList1() {
			//启动加载
			var Load = new load();
			$.ajax({
				url: commom.path.httpurl + "?action=GetDispatchRegion&FatherId=0",
				method: 'get',
				dataType: "json",
				timeout: 1000,
				success: function(ret) {
					//关闭加载
					Load.hide();
					if(!ret.isError) {
						var arryList = JSON.parse(ret.Msg);
						var str = '';
						for(var i = 0; i < arryList.length; i++) {

							str += '<div class="sort_list"  data-id="'+arryList[i].ID+'" data-name="'+arryList[i].Name+'">';
							str += '<div class="num_name">' + arryList[i].Name + '</div>';
							str += '</div>';

						}
						$(".sort_box").append(str);
						$(".sort_list").eq(0).addClass("active");
						citySort("html,.hot_list");
						cityList2(1, arryList[0].Name);
						$(document).on("click", '.hot_list .sort_list', function() {

							$(this).addClass("active").siblings().removeClass("active");
						})
					}
				}
			})
		};
		//二级地址
		function cityList2(ID, province) {

			$.ajax({
				url: commom.path.httpurl + "?action=GetDispatchRegion&FatherId=" + ID,
				method: 'get',
				dataType: "json",
				timeout: 1000,
				success: function(ret) {
				    
					//  alert(ret.Msg)
					if(!ret.isError) {
						var arryList = JSON.parse(ret.Msg);
						var str = '';
						if($(".two_list").has("li")) {

							$(".two_list").find("li").remove();
							for(var i = 0; i < arryList.length; i++) {

								str += '<li class="two_li"  data-address="'+province + arryList[i].Name+'">' + arryList[i].Name + '</li>';

							}

						} else {
							for(var i = 0; i < arryList.length; i++) {

								str += '<li class="two_li" data-address="'+province + arryList[i].Name+'">' + arryList[i].Name + '</li>';
							}
						}
						$(".two_list").append(str);

					}
				}
			})
		};
		function chooseCity() {

			$(".two_list").on("click",'.two_li',function(){
				 
				 var addrees=$(this).attr('data-address');
				 commom.setItem([{'name':'address','value':addrees}]);
				
			})
		}
		//底部分界面
	})
})