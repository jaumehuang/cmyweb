
var require = require(['main'], function(main) {

	require(['jquery', 'commom', 'layer', 'load', 'pinyin', 'sort'], function($, commom, layer, load, pinyin, sort) {
       
		//初始化
		$(function() {
             
             GetProductBrandList(1);
             
		})
		//品牌类别
		function GetProductBrandList(page) {
			//初始化加载
            var Load= new load();
			var param = {
				PageCount: 500,
				PageIndex: page
			};
			var str = '';
			$.ajax({
				url: commom.path.httpurl + "?action=getproductbrandlist",
				method: 'get',
				dataType: "json",
				timeout:500,
				data: param,
				success: function(ret) {
					//关闭加载
					Load.hide();
					if(!ret.isError) {
						var listArry = JSON.parse(ret.Msg);
						var str = '';
						// var Brand_arr=[];
						for(var i = 0; i < listArry.length; i++) {
							// Brand_arr.push(listArry[i].Guid);
							str += '<div class="list_li clearfix sort_list" data-name='+listArry[i].Name+' data-guid='+listArry[i].Guid+'>';
							str += '<img src="' + listArry[i].Logo + '" class="fl"/>';
							str += '<div class="fl num_name">' + listArry[i].Name + '</div>';
							str += '</div>';
						}
						$(".brand_list").append(str);
						$(".brand_list").attr("data-page", param.PageIndex);
						$(".brand_list").attr("bool-page", true);
						citySort("html,body");
						//点取数据
						$("body").on("click",'.brand_list .sort_list',function(e){
							
							 e.stopPropagation();
							 var name=$(this).attr('data-name');
							 var guid=$(this).attr('data-guid');
							 commom.setItem([{'name':'brand_name','value':name},{'name':'brand','value':guid}]);
//							  window.history.back();
							 return false;
						})
						
						
					} else {

						$(".loading_more").show();
						$(".brand_list").attr("bool-page", false);
						$(".loading_more").find(".loading-time").hide();
						$(".loading_more").find(".loading_fish").show();

					}
				}
			});
		}

		//底部边界
	})
})