var require = require(['main'], function(main) {

	require(['jquery', 'commom', 'layer', 'load', 'infinitescroll','pinyin','sort'], function($, commom, layer, load, infinitescroll,pinyin,sort) {

		//初始化数据
		$(function() {
			
             if (commom.getItem("cityName")) {

				$(".location_city span").text(commom.getItem("cityName"));   
			}
             cityList();
		})

		function cityList() {
			
			//启动加载
			var Load=new load();
			var str = '';
			$.ajax({
				url: commom.path.httpurl + "?action=getsuppliercity",
				method: 'get',
				dataType: "json",
				timeout: 500,
				success: function(ret) {
					//关闭加载
					Load.hide();
					if(!ret.isError) {

						var listArry = JSON.parse(ret.Msg);

						for(var i = 0; i < listArry.length; i++) {
							//  onclick="open_details(\''+ arryList[i].Guid+ '\')" >';
							var str2 = JSON.stringify(listArry[i]);
							str += '<div class="sort_list" data-name="'+listArry[i].Name+'" data-code="'+listArry[i].Code+'">';
							str += '<div class="num_name">' + listArry[i].Name + '</div>';
							str += '</div>'

						};
						$(".sort_box").append(str);
						// alert(str);
						citySort("html,body");
					}
				 }
			});
		};
		//点取城市定位
		$("body").on("click",'.sort_box .sort_list',function(e){
			
			 e.stopPropagation();
			 var name=$(this).attr('data-name');
			 var code=$(this).attr('data-code');
			 commom.setItem([{'name':'city','value':name+'|'+code}]);
			 return false;
		});
		//点击全国
		$("body").on("click",'.sort_box .country',function(e){
			
			 e.stopPropagation();
			 var name=$(this).attr('data-name');
			 var code=$(this).attr('data-code');
			 commom.setItem([{'name':'city','value':name+'|'+code}]);
			 return false;
		});
		
		//底部分界面
	})
})