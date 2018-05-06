var require = require(['main'], function(main) {

	require(['jquery', 'commom', 'layer', 'load'], function($, commom, layer, load) {
         
         var rate = 0; //漫豆
		//初始化函数
		$(function() {

			//物流信息
			//shiping();
			//地址
			getAddress();
			//漫豆转换率
			ChangeMoney();
			//获取订单页面
			order();
			
			//发票信息
			invoice();
			
			//提交数据getPay()
			$(".pay_btn").on("click", function() {

				getPay();
			})
			
		});
		//初始化物流信息
		function shiping() {

			if(commom.getItem("ship-key1")) {

				$(".shipping_p span").text(commom.getItem("ship-key1"));

				if(commom.getItem("ship-key2") && commom.getItem("ship-key4") == 0) {

					if($(".addrees").has(".address_title") || $(".addrees").has(".add_address")) {

						$(".order_price .list_li").eq(2).find("a").html( '<span>' + 0 + '漫豆</span>');
						var ProductPrice = $(".order_price .list_li").eq(0).find("a").attr("data-ProductPrice");
						var price = $(".foot_cart .total_price span").find(".all_num ").text(ProductPrice);
						$(".address_title").remove();
						$(".addrees").find(".add_address").remove();

						var arryList = JSON.parse(commom.getItem("ship-key2"));
						str = '';
						str += '<div class="address_title clearfix" onclick="javascript:window.location.href=\'' + '../html/manage_add_address.html' + '\'">';
						str += '<i class="fl iconfont icon-zuobiao"></i>';
						str += '<div class="fl address_mian">';
						str += '<div class="clearfix item "><span class="fl name">' + arryList.Name + '</span><span class="fr phone">' + arryList.Mobile + '</span></div>';
						str += '<div class="detail item">' + arryList.Area + arryList.Address + '</div>';
						str += '</div><i class="fr iconfont icon-iconfontright"></i></div>';

						$(".addrees").append(str);
						$(".order_price .list_li").eq(2).find("a").html( '<span data-DispatchPrice='+0+'>' + 0 + '漫豆</span>');
					}

				} else if(commom.getItem("ship-key2") && commom.getItem("ship-key4") == 1) {
                    
                    
					var arryList = JSON.parse(commom.getItem("ship-key2"));
					console.log(arryList.ExpressValue)
					$(".order_price .list_li").eq(2).find("a").html( '<span data-DispatchPrice='+arryList.ExpressValue+ '>' + (arryList.ExpressValue)*rate + '漫豆</span>');
					var ProductPrice = $(".order_price .list_li").eq(0).find("a").attr("data-ProductPrice");
					var productPrice2=$(".foot_cart .total_price span").find(".all_num").attr("data-payPrice")
					var price = parseFloat(ProductPrice) + parseFloat( (arryList.ExpressValue)*rate);
					var payprice=parseFloat(productPrice2) + parseFloat(arryList.ExpressValue);
					$(".foot_cart .total_price span").find(".all_num ").text(price);
					$(".foot_cart .total_price span").find(".all_num ").attr("PaymentPrice",payprice);
					var str = '<input type="text" value="' + arryList.ExpressGuid + '" hidden="hidden" class="code"/>';
					$(".shipping_tt").append(str);
				}

				if(commom.getItem("ship-key3")) {

					var str = '<input type="text" value="' + commom.getItem("ship-key3") + '" hidden="hidden" class="code"/>';
					$(".shipping_tt").append(str);
				}
				if(commom.getItem("ship-key4") == 1) {
					var str = '<input type="text" value="' + commom.getItem("ship-key4") + '" hidden="hidden" class="ship_num"/>';
					$(".shipping_tt").append(str);
					// alert(str)
				}
			}
		};
		//发票
		function invoice() {

			if(commom.getItem("invoice-key1")) {

				var value = JSON.parse(commom.getItem("invoice-key2"));
				console.log(value);
				if(value.f1) {
					str = ''
					str += '<input type="text" class="invoice1" value="' + value.f1 + '" hidden="hidden"/>';
					str += '<input type="text" class="invoice2" value="' + value.f2 + '" hidden="hidden"/>';
					$(".myinvoice").append(str);

				}else{
					str = ''
					str += '<input type="text" class="invoice1" value="' + '' + '" hidden="hidden"/>';
					str += '<input type="text" class="invoice2" value="' +'' + '" hidden="hidden"/>';
					$(".myinvoice").append(str);
				}
				$(".myinvoice a span").text(commom.getItem("invoice-key1"));

			}
		};
				//转换漫豆
		function ChangeMoney() {
			//启动加载
			var Load = new load();
			$.ajax({
				url: commom.path.httpurl + "?action=GetRate",
				method: 'get',
				dataType: "json",
				timeout: 500,
				async: false,
				success: function(ret) {
					//关闭加载
					Load.hide();
					if(!ret.isError) {

						rate = ret.Msg
                       
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
		//获取地址
		function getAddress() {

			var str = '';
			var param = {
				MemLoginId: commom.getCookie('memlogid'),
				IsDefault: 1
			}
			$.ajax({
				url: commom.path.httpurl + "?action=GetMemberAddress",
				method: 'get',
				dataType: "json",
				data: param,
				success: function(ret) {

					// alert(ret.Msg)
					if(!ret.isError) {
						var arryList = JSON.parse(ret.Msg);

						if(arryList.length > 0) {
							if($(".addrees").has(".address_title") || $(".addrees").has(".add_address")) {
								$(".addrees").find(".address_title").remove();
								$(".addrees").find(".add_address").remove();
							}
							str += '<div class="address_title clearfix" onclick="javascript:window.location.href=\'' + '../html/manage_add_address.html' + '\'">';
							str += '<i class="fl iconfont icon-zuobiao"></i>';
							str += '<div class="fl address_mian">';
							str += '<div class="clearfix item"><span class="fl name">' + arryList[0].name + '</span><span class="fr phone">' + arryList[0].mobile + '</span></div>';
							str += '<div class="detail item">' + arryList[0].address + '</div>';
							str += '</div><i class="fr iconfont icon-iconfontright"></i></div>';
							$(".addrees .null-address").attr("data-null", "is")
						}

					} else {
						if($(".addrees").has(".address_title") || $(".addrees").has(".add_address").has()) {
							$(".addrees").find(".address_title").remove();
							$(".addrees").find(".add_address").remove();
						}
						str += '<div class="add_address clearfix" style="" onclick="javascript:window.location.href=\'' + '../html/manage_add_address.html' + '\'">';
						str += '<i class="iconfont icon-jia2 fl"></i>';
						str += '<span class="fl null-address" data-null="null">添加收货地址</span>';
						str += '</div>';
					}
					$(".addrees").append(str);
				}
			})
		};
		//获取订单页面
		function order() {
			var param = {
				MemLoginId: commom.getCookie('memlogid'),
				IsSelected: 1
			}
			$.ajax({
				url: commom.path.httpurl + "?action=GetCart",
				method: 'get',
				dataType: "json",
				timeout: 1000,
				data: param,
				success: function(ret) {
                     console.log(ret)
					if(!ret.isError) {
						var arryList = JSON.parse(ret.Msg);
						var str = '';

						for(var i = 0; i < arryList.length; i++) {

							str += '<li class="clearfix list_li">';
							str += '<a href="#" class="fl show_img" >';
							str += '<img class="fl" src="' + arryList[i].OriginalImge + '"/>';
							str += '</a>';
							str += '<div class="list_mian fl">';
							str += '<div class="title">' + arryList[i].Name + '</div>';

							str += '<div class="price clearfix">';
							str += '<div class="fl"><span>规格' + arryList[i].Attributes + '</span></div>';
							str += '<div class="fr num">X<span class="dou_num">' + arryList[i].BuyNumber + '</span></div></div>';
							str += '<div class="price clearfix">';
//							str += '<div class="fl red_price"> 漫豆：<span class="car_dou">' + arryList[i].MarketPrice + '</span></div>';
							str += '<div class="fl"><span class="red_price">' + arryList[i].MarketPrice + '漫豆</span></div>';
							str += '</div></div>';
							str += '</li>';
						}
						$(".product_list").append(str);
						var allPrice = 0;
						var payPrice=0;
						for(var i = 0; i < arryList.length; i++) {
							
							allPrice += parseFloat(arryList[i].MarketPrice) * arryList[i].BuyNumber;
                            payPrice+=parseFloat(arryList[i].ShopPrice) * arryList[i].BuyNumber;
						};
                         console.log(payPrice)
						$(".order_price .list_li").eq(0).find("a").html('<span >' + allPrice + '漫豆</span>');
						$(".order_price .list_li").eq(1).find("a").html('<span>' + 0 + '漫豆</span>');
						$(".order_price .list_li").eq(0).find("a").attr("data-ProductPrice",allPrice);
						$(".foot_cart .total_price span").find(".all_num").text(allPrice);
						$(".foot_cart .total_price span").find(".all_num").attr("data-payPrice",payPrice);
						$(".foot_cart .total_price span").find(".all_num ").attr("PaymentPrice",payPrice)
						if(allPrice % 1 == 0) {
							$(".order_price .list_li").eq(0).find("a").html('<span >' + allPrice + '.00' + '漫豆</span>');
							$(".foot_cart .total_price span").find(" .all_num").text(allPrice + '.00');
							$(".order_price .list_li").eq(0).find("a").attr("data-ProductPrice",allPrice);
							$(".foot_cart .total_price span").find(".all_num").attr("data-payPrice",payPrice);
							$(".foot_cart .total_price span").find(".all_num ").attr("PaymentPrice",payPrice);
						};
						//物流信息
			            shiping();
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
		//判断是否设置收货地址
		function IsAddress(url) {

			if($(".addrees").has(".address_title").length == 0) {
				layer.open({
					content: '请增加收货地址',
					skin: 'msg',
					time: 2 //2秒后自动关闭
				});
				return false;
			}
			api.openWin({
				name: url,
				url: url + '.html',
				allowEdit: true,
			});
		}
		//订单提交支付
		function getPay() {

			//判断
			if($(".order_list .shipping_tt a span").text() == 'undefined' || $(".order_list .shipping_tt a span").text().length == 0) {
				layer.open({
					content: '请填写配送信息',
					skin: 'msg',
					time: 2 //2秒后自动关闭
				});
				return false;
			}
			if($(".order_list .myinvoice a span").text() == 'undefined' || $(".order_list .myinvoice a span").text().length == 0) {
				layer.open({
					content: '请填写发票信息',
					skin: 'msg',
					time: 2 //2秒后自动关闭
				});
				return false;
			}

			if($(".addrees .null-address").attr("data-null") == 'null') {

				layer.open({
					content: '请填写收货地址',
					skin: 'msg',
					time: 2 //2秒后自动关闭
				});
				return false;
			};

			var param = {
				MemLoginId: commom.getCookie('memlogid'),
				ProductPrice: $(".foot_cart .total_price span").find(".all_num").attr("data-payPrice"),
				DispatchPrice: $(".order_price .list_li a").eq(2).find("span").attr('data-dispatchPrice'),
				PaymentPrice: $(".foot_cart .total_price span").find(".all_num ").attr("PaymentPrice"),
				ExpressCode: $(".shipping_tt .code").val(),
				ExpressName: $(".shipping_tt a span").text(),
				InvoiceNum: $(".myinvoice .invoice2").val(),
				InvoiceTitle: $(".myinvoice .invoice1").val(),
				Name: $(".address_title .name").text(),
				Address: $(".address_title .detail").text(),
				Tel: $(".address_title .phone").text()
			}
			//启动加载
			var Load = new load();
			$.ajax({
				url: commom.path.httpurl + "?action=AddOrderInfo",
				method: 'post',
				dataType: "json",
				data: param,
				timeout: 1000,
				success: function(ret) {
					//关闭加载
					
					Load.hide();
					if(!ret.isError) {

						var values = JSON.parse(ret.Msg);
						commom.OpenView("pay", values.OrderNumber);

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
		}
		//底部分界线
	})
})