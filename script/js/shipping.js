var require = require(['main'], function(main) {

	require(['jquery', 'commom', "load","layer"], function($, commom, load,layer) {
		//初始化
		$(function() {

			storeList();
		});
		//获取店列表
		function storeList() {

			//开启加载
			var Load = new load();
			$.ajax({
				url: commom.path.httpurl + "?action=GetAgentStore",
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
							str += '<li class="list_li clearfix" data-ship=' + JSON.stringify(arryList[i]) + '>';
							str += ' <label class="tilte_p fl" for="' + i + '">' + arryList[i].Area + arryList[i].Address + '</label>';
							str += '<div class="radio_is fr">';
							str += '<input type="radio" id="' + i + '" name="shipping"/>';
							str += '<i class="icon"></i>';
							str += '</div></li>';
						};
						$(".storeList .shipping_list").append(str);
						if($(".shipping_give").eq(1).find(".shipping_list").height() >= 200) {

							$(".shipping_give").eq(1).find(".shipping_list").css({

								"height": '200px',
								"overflow-y": "auto"
							});
						};
						getLogistics();
						//提交数据

						var ship_data = '';
						var index = 0;
						$(".invioce_p .ul_list .li_li").on("click", function() {

							var $index = $(this).index();

							$(this).addClass("active").siblings().removeClass("active");
							if($index == 0) {
								$(".shipping_give").eq(0).show();
								$(".shipping_give").eq(1).hide();
								if($(".shipping_give").eq(0).find(".shipping_list").height() >= 200) {

									$(".shipping_give").eq(0).find(".shipping_list").css({

										"height": '200px',
										"overflow-y": "auto"
									});
								};
								index = 0;
							} else {
								$(".shipping_give").eq(0).hide();
								$(".shipping_give").eq(1).show();
								if($(".shipping_give").eq(1).find(".shipping_list").height() >= 200) {

									$(".shipping_give").eq(1).find(".shipping_list").css({

										"height": '200px',
										"overflow-y": "auto"
									});
								};
								index = 1;
							}

						});
						$(document).on("click", ".shipping_list .list_li ", function() {

							ship_data = $(this).attr("data-ship");
							$(".invioce_p .ul_list .li_li").eq(1).attr("ship_fl", JSON.parse(ship_data).ExpressName);

						});

						//提交数据
						$(".btn_in").on("click", function() {
							// alert(ship_data);
							//判断
							var fage = false;

							$(".shipping_list li").each(function(index, ele) {

								if($(this).find("input").is(":checked")) {

									fage = true;
								}

							});
							if(!fage) {

								layer.open({
									content: '请选择物流方式',
									skin: 'msg',
									time: 2 //2秒后自动关闭
								});
								return false;
							};
						
							commom.setItem([{"name":"ship-key1","value":$(".invioce_p .ul_list .active").attr("ship_fl")},{"name":"ship-key2","value":ship_data},
							  {"name":"ship-key3","value":$(".invioce_p .ul_list .li_li").eq(0).attr("ExpressCode")},{"name":"ship-key4","value":index}
							])

						})

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
			})
		};
		//获取物流信息
		function getLogistics() {

			var param = {
				MemLoginId: commom.getCookie('memlogid'),
				IsDefault: 1
			}
			$.ajax({
				url: commom.path.httpurl + "?action=GetMemberAddress",
				method: 'get',
				dataType: "json",
				data: param,
				timeout: 1000,
				success: function(ret) {
                
					if(!ret.isError) {
						var arryList = JSON.parse(ret.Msg);
						var str = '';
						if(arryList.length > 0) {
							var param = {
								MemLoginId: commom.getCookie('memlogid'),
								Address: arryList[0].address
							}
							// alert(param.Address);
							$.ajax({
								url: commom.path.httpurl + "?action=GetDispatch",
								method: 'get',
								dataType: "json",
								timeout:1000,
								data: param,
								success: function(ret) {
                                   
									if(!ret.isError) {
										var arryList = JSON.parse(ret.Msg);
										var str = '';
										for(var i = 0; i < arryList.length; i++) {
											if(arryList[i].ExpressName == "门店自提") {
												$(".invioce_p .ul_list .li_li").eq(0).attr("ExpressCode", arryList[i].ExpressGuid);
											} else {
												str += '<li class="list_li clearfix" data-ship=' + JSON.stringify(arryList[i]) + '>';
												str += ' <label class="tilte_p fl" for="' + arryList[i].ExpressGuid + '">' + arryList[i].ExpressName + "(" + arryList[i].ExpressValue + ")" + '</label>';
												str += '<div class="radio_is fr">';
												str += '<input type="radio" id="' + arryList[i].ExpressGuid + '" name="shipping"/>';
												str += '<i class="icon"></i>';
												str += '</div></li>';
											};

										}
										// alert(str);
										$(".wuliuList .shipping_list").append(str);
									}
								}
							})
						}
					}
				}
			})
		};

	})
})