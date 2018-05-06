var require = require(['main'], function(main) {

	require(['jquery', 'commom', 'layer', 'load'], function($, commom, layer, load) {
		//初始化数据
		$(function() {
			var startArr = ['待配货', '', '已取货', '未取货'];
			//启动加载
			var Load = new load();
			$.ajax({
				url: commom.path.httpurl + "?action=GetOrderInfoDetail",
				method: 'get',
				dataType: "json",
				timeout: 1000,
				data: {
					MemLoginId: commom.getCookie('memlogid'),
					OrderNumber: commom.GetQueryString('id')
				},
				success: function(ret) {
					Load.hide();
            
					if(!ret.isError) {
						var arr = commom.Transformation(ret.Msg);
						var list = commom.Transformation(arr[0].OrderProduct);
						console.log(list)
						var str2 = '';
						//订单状态
						if(arr[0].ShipmentStatus == 0) {
							
							$(".order-state .order-img").attr("src", "../image/Stocking.png");
							$(".order-state .Stocking-text").text('备货中...');
							
						}else if(arr[0].ShipmentStatus == 3){
							//打包码
							$(".order-state").hide();
							$(".qcode").show();
							$(".qcode img").attr("src",arr[0].PackageCode);
							$(".ShipmentNumber").text('打包码:'+arr[0].ShipmentNumber);
					}else if(arr[0].ShipmentStatus == 2){
							//打包码
							$(".order-state").hide();
							$(".qcode").show();
							$(".qcode img").attr("src",arr[0].PackageCode);
							$(".ShipmentNumber").text('打包码:'+arr[0].ShipmentNumber);
							$(".fash").text("将上方二维码展示给收银员即可结算");
						}else if(arr[0].OderStatus == 5){
							 
							 $(".order-state .order-img").attr("src", "../image/order1.png");
							$(".order-state .Stocking-text").text('完成订单');
							 
						}

						//产品列表
						for(var i = 0; i < list.length; i++) {

							str2 += '<li class="pr-li ">';
							str2 += '<img src="' + list[i].OriginalImge + '" />';
							str2 += '<div class="content">';
							str2 += '<div class="pr-title ellipse_two t-size-14">' + list[i].Name + '</div>';
							str2 += '<div class="clearfix t-size-12">'
							str2 += '<span class="fl">' + list[i].Attributes + '</span>';
							str2 += '<span class="fr">x' + list[i].buyNumber + '</span>';
							str2 += '</div>';
							str2 += '<div class="clearfix">';
							str2 += '<div class="fl t-size-12 c-red">' + list[i].BuyPriceRate + '漫豆</div>';
							//						str2 += '<button class="fr t-size-14 c-red btn-bg-white btn-commont">评价</button>';
							str2 += '</div>';
							str2 += '</div>';
							str2 += ' </li>';

						}
						$(".pr-list").append(str2);

						var str1 = '';
						//订单信息
						str1 += '<li class="info-li clearfix t-size-12">';
						str1 += '<span class="fl">订单号</span>';
						str1 += '<span class="fr">' + arr[0].OrderNumber + '</span>';
						str1 += '</li>';
						str1 += '<li class="info-li clearfix t-size-12">';
						str1 += '<span class="fl">订单状态</span>';
						str1 += '<span class="fr c-red">' + startArr[arr[0].ShipmentStatus] + '</span>';
						str1 += '</li>';
						//						str1 += '<li class="info-li clearfix t-size-12">';
						//						str1 += '<span class="fl">购买人</span>';
						//						str1 += '<span class="fr">'+arr[0].RealName+'</span>';
						//						str1 += '</li>';
						str1 += '<li class="info-li clearfix t-size-12">';
						str1 += '<span class="fl">联系方式</span>';
						str1 += '<span class="fr ">' + arr[0].Mobile + '</span>';
						str1 += '</li>';
						$(".info-list").append(str1);
						$(".total .c-red").text('总计:'+arr[0].AdvancepaymentPayPrice + '漫豆');
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
           //删除订单
           $("footer .btn-cancel").on('click',function(){
           
           	   handerOrder();
           })
		});
		
		//删除订单
		function handerOrder() {

			layer.open({
				content: '确定删除订单吗?',
				btn: ['确定', '取消'],
				yes: function(index) {
					layer.close(index);
					//启动加载
					var Load = new load();
					var param = {
						MemLoginId: commom.getCookie('memlogid'),
						OperateType:'CancelOrder',
						OrderNumber: commom.GetQueryString('id')
					}
					// alert(JSON.stringify(param));
					$.ajax({
						url: commom.path.httpurl + "?action=OperateOrderInfo",
						method: 'post',
						dataType: "json",
						data: param,
						timeout: 1000,
						success: function(ret) {

							if(!ret.isError) {

								window.history.back();
							}
						}
					})
				}
			});
		}

	})
})