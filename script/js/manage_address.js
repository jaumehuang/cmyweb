var require = require(['main'], function(main) {

	require(['jquery', 'commom', 'layer', 'load'], function($, commom, layer, load) {

		//初始化数据
		$(function() {

			//初始化地址
			addressList();
			//删除地址
			DeleteAddress();
			//编辑地址
			EditAddress();
		});
		//获取地址列表 、
		function addressList() {
			//启动加载
			var Load = new load();
			var param = {
				MemLoginId: commom.getCookie('memlogid'),
			}
			$.ajax({
				url: commom.path.httpurl + "?action=GetMemberAddress",
				method: 'get',
				dataType: "json",
				timeout: 1000,
				data: param,
				success: function(ret) {
					//关闭加载
					Load.hide();
					if(!ret.isError) {
						var arryList = JSON.parse(ret.Msg);
						if($(".is_address").has('.address_li')) {
							$(".is_address .address_li").remove();
						}

						var str = '';
						for(var i = 0; i < arryList.length; i++) {

							str += '<div class="address_li">';
							str += '<div class="address_top">';
							str += '<div class="clearfix"><span class="fl">' + arryList[i].name + '</span><span class="fr">' + arryList[i].mobile + '</span></div>';
							str += '<div class="clearfix">' + arryList[i].address + '</div></div>';

							str += '<div class="address_bottom clearfix">';
							if(arryList[i].IsDefault == 1) {
								str += '<div class="fl check_addresss"><input type="radio" name="_address" id="' + arryList[i].GUID + '" checked="checked" name="subBox"/><i class="icon fl"></i><label for="' + arryList[i].GUID + '" class="fl">设为默认地址</label></div>';
							} else {
								str += '<div class="fl check_addresss"><input type="radio" name="_address" id="' + arryList[i].GUID + '" name="subBox"/><i class="icon fl"></i><label for="' + arryList[i].GUID + '" class="fl">设为默认地址</label></div>';
							}

							var str2 = arryList[i].GUID + "&" + arryList[i].name + "&" + arryList[i].mobile + "&" + arryList[i].address;
							str += '<div class="fr"><a href="#"  class="EditAddress" data-str="' + str2 + '"><i class="iconfont icon-bianji1 "></i><span class="">编辑</span></a><a href="#" class="Delete" ><i class="iconfont icon-shanchu"></i><span>删除</span></a></div>';
							str += '</div></div>';

						}
						$(".is_address").append(str);

						//修改默认地址
						$(document).on("click", ".is_address .address_bottom .check_addresss", function() {
							var guid = $(this).find("input[type=radio]").attr("id");
							defaultAddress(guid);
						})
					} else {

						$(".null_address").show();
					}
				},
				complete: function(XMLHttpRequest, status) { //请求完成后最终执行参数
					　　　　
					if(status == 'timeout') { //超时,status还有success,error等值的情况
						//关闭加载
						Load.hide();　
						layer.open({
							content: '请求超时,网络不好',
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});　　　　
					}　　
				}
			});
		};
		//设置默认地址
		function defaultAddress(guid) {

			var param = {
				MemLoginId: commom.getCookie('memlogid'),
				Guid: guid,
			}
			$.ajax({
				url: commom.path.httpurl + "?action=UpdateAddressIsDefault",
				method: 'post',
				dataType: "json",
				timeout: 1000,
				data: param,
				success: function(ret) {

				}
			})
		};
		//删除地址
		function DeleteAddress() {

			$(".is_address").on("click", ".address_li .Delete", function() {
                
				var $self = $(this);
				layer.open({
					content: '确定删除该地址？',
					btn: ['确定', '取消'],
					yes: function(index) {
						var guid = $self.parentsUntil().eq(3).find("input[type=radio]").attr("id");
						var param = {
							MemLoginId: commom.getCookie('memlogid'),
							Guid: guid,
						}
						$.ajax({
							url: commom.path.httpurl + "?action=DelAddress",
							method: 'post',
							dataType: "json",
							timeout: 1000,
							data: param,
							success: function(ret) {

								if(!ret.isError) {

									layer.close(index);
									$self.parentsUntil().eq(2).remove();
								} else {

									layer.open({
										content: ret.Msg,
										skin: 'msg',
										time: 2 //2秒后自动关闭
									});
								}
							}
						})
					} 
				});
			})
		};
		//编辑地址
		function EditAddress() {

			$(".is_address").on("click", ".address_li .EditAddress", function() {

				var str= $(this).attr("data-str");
				commom.setItem([{"name":"edit","value":str}]);
				commom.OpenView('add_address',str);
			})

		}
	})
})