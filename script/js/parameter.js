var require = require(['main'], function(main) {

	require(['jquery', 'commom', 'layer', 'load'], function($, commom, layer, load) {
		//初始化
		$(function() {

			var guid = commom.GetQueryString('str');
			GetProduct(guid, function() {

				GetProductAttribute(guid);
			});
		});
		//详情展示
		function GetProduct(guid, callback) {
			//启动加载
			var Load = new load();
			var str = '';
			var str_details = '';
			$.ajax({
				url: commom.path.httpurl + "?action=getproduct&ProductGuid=" + guid,
				method: 'get',
				dataType: "json",
				success: function(ret) {
					//关闭加载
					Load.hide();
					if(!ret.IsError) {

						var listArry = JSON.parse(ret.Msg);

						str += '<div class="title_vv">' + listArry[0].Name + '</div>';
						str += '<div class="price"><span class="red_price">' + listArry[0].ShopPrice + '漫豆</span>';
						str += '</div>';
						$(".title_top").append(str);
						callback();
					} else {

						layer.open({
							content: ret.Msg,
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});
					}
				}
			});
		};
		//商品属性
		function GetProductAttribute(guid) {

			var str = '';
			$.ajax({
				url: commom.path.httpurl + "?action=getproductattribute&ProductGuid=" + guid,
				timeout: 500,
				method: 'get',
				dataType: "json",
				success: function(ret) {
					//  alert(ret);
					if(!ret.IsError) {

						var listArry = ret.Msg.split("{")[1];
						listArry = listArry.split("}")[0];
						listArry = listArry.split(",");
						//去掉{},等符号

						for(var i = 0; i < listArry.length; i++) {

							var pp = listArry[i];

							pp = pp.split(":");

							str += '<li class="list_li clearfix">';
							if(pp[1] == undefined || pp[1] == '') {

								str += '<span>' + '"亮点配置"' + '</span>';
								str += '<span >' + pp[0] + '</span>';
							} else {

								str += '<span>' + pp[0] + '</span>';
								str += '<span >' + pp[1] + '</span>';
							}

							str += '</li>';

						}

						$(".more_parameter").append(str);
					} else {

					}
				}
			});
		}
	})
})