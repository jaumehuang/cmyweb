var require = require(['main'], function(main) {

	require(['jquery', 'commom', 'layer', 'load'], function($, commom, layer, load) {
		//初始化数据
		$(function() {

			//购物车列表
			goodList();

			//全选
			$('body').on('click', '#Checkbox1', function() {

				checkall();
				var $self = $(this);
				var total_price_num = totalpricenum();
				var totalPrice = toDecimal2(total_price_num['price']) > 1000 ? toDecimal2(total_price_num['price']) / 10000 + '万' : toDecimal2(total_price_num['price']);
				$('.foot .all_price span').html(totalPrice);
				if($(this).prop("checked")) {

					//打包样式
					$(".foot .SubmitOrder ").eq(1).css({
						background: '#f6bc61'
					});
					//普通样式
					$(".foot .SubmitOrder ").eq(0).css({
						background: '#c10000'
					});
				} else {

					$(".foot .SubmitOrder span").eq(0).text(0);
					$(".foot .SubmitOrder span").eq(1).text(0);

				}
				//结算数量
				curputerPrice()
			})
			//点击多选框
			$('body').on('click', '.list_li .check_box input[type=checkbox]', function() {

				var $self = $(this);
				var IsShipment = $(this).attr("data-Shipment");
				//结算
				var packNum= curputerPrice()
                Ispack(IsShipment,packNum);
          
				//判断是否选择完所有商品
				var all = document.getElementById("Checkbox1");
				var sub = document.getElementsByName("subBox");
				var total_num_arr = []; //存储选中的商品

				$.each($('input[type=checkbox]:checked').parents('.list_li'), function(index, ele) {
					total_num_arr.push(ele);

				});
				//判断是否选完商品
				if(sub.length == total_num_arr.length) {

					all.checked = true;
					$(all).attr("checked", "checked");
					//打包样式
					$(".foot .SubmitOrder ").eq(1).css({
						background: '#f6bc61'
					});
					//普通样式
					$(".foot .SubmitOrder ").eq(0).css({
						background: '#c10000'
					});

				} else {

					all.checked = false;
					$(all).removeAttr("checked");

				}

			});
			//提交订单
			$(".payOrder").on("click", function() {

				SubmitOrder();
			});
			//打包
			$(".packorder").on("click", function() {

				SubmitPackage();
			})
		});
		//判断是否为打包
		function Ispack(IsShipment,packNum) {
			//判断是否为打包或者普通商品
			if(packNum.Shipment_num>0&&packNum.product_num==0){
				//打包
				$(".foot .SubmitOrder ").eq(0).css({
					background: 'rgb(152, 147, 147)'
				});
				$(".foot .SubmitOrder ").eq(0).attr("disclick", 1);
				$(".foot .SubmitOrder ").eq(1).attr("disclick", 0);
				$(".foot .SubmitOrder ").eq(1).css({
					background: '#f6bc61'
				});
				
			};
			if(packNum.product_num>0&&packNum.Shipment_num==0){
				
			
				//普通商品
				$(".foot .SubmitOrder ").eq(1).css({
					background: 'rgb(152, 147, 147)'
				});
				$(".foot .SubmitOrder ").eq(1).attr("disclick", 0);
				$(".foot .SubmitOrder ").eq(0).attr("disclick", 1);
				$(".foot .SubmitOrder ").eq(0).css({
					background: '#c10000'
				});
			};
			if(packNum.product_num>0&&packNum.Shipment_num>0){
			
					$(".foot .SubmitOrder ").eq(1).css({
						background: '#f6bc61'
					});
					//普通样式
					$(".foot .SubmitOrder ").eq(0).css({
						background: '#c10000'
					});
				$(".foot .SubmitOrder ").eq(1).attr("disclick", 0);
				$(".foot .SubmitOrder ").eq(0).attr("disclick", 0);
			};
			if(packNum.product_num==0&&packNum.Shipment_num==0){
				
				 //打包
				$(".foot .SubmitOrder ").eq(0).css({
					background: 'rgb(152, 147, 147)'
				});
				//普通商品
				$(".foot .SubmitOrder ").eq(1).css({
					background: 'rgb(152, 147, 147)'
				});
			}
			
		};
		//全选
		function checkall() {
			var all = document.getElementById("Checkbox1");
			var sub = document.getElementsByName("subBox");
			if(all.checked == true) {
				for(var i = 0; i < sub.length; i++) {
					sub[i].checked = true;
					$(sub[i]).attr("checked", "checked");
				}

			} else {
				for(var i = 0; i < sub.length; i++) {
					sub[i].checked = false;
					$(sub[i]).removeAttr("checked");
				}
			}
		};
		//结算
		function curputerPrice() {

			var total_price_num = totalpricenum();
			var totalPrice = toDecimal2(total_price_num['price']) > 1000 ? toDecimal2(total_price_num['price']) / 10000 + '万' : toDecimal2(total_price_num['price']);
			$('.foot .all_price span').html(totalPrice);
			var total_price = toDecimal2(total_price_num['price']);
			//var total_num = toDecimal2(total_price_num['num']);
			var Shipment_num = toDecimal2(total_price_num['Shipment_num']); //打包数量
			var product_num = toDecimal2(total_price_num['product_num']); //普通产品数量
			var arr1 = product_num.split(".");
			var arr2 = Shipment_num.split(".");
			$(".foot .SubmitOrder span").eq(0).text(arr1[0]);
			$(".foot .SubmitOrder span").eq(1).text(arr2[0]);
			var isPsck={
				 Shipment_num:arr2[0],
				 product_num:arr1[0]
			 }
			return isPsck
		}
		//计算数组的和
		var totalpricenum = function() {

			var totalprice_arr = []; //价格
			var totalnumber_arr = []; //数量
			var total_price_num = []; //计算价格跟数量
			var Shipment_num_arr = []; //打包数量
			var product_num_arr = []; //普通产品数量

			$.each($('input[type=checkbox]:checked').parents('.list_li'), function(index, ele) {

				var $price = $(this).find('.list_mian .price span.red_price ').text();
				var $num = $(this).find('.list_mian .price .num span').text();
				totalprice_arr.push(parseFloat($price) * parseInt($num));
				totalnumber_arr.push(parseInt($num));
				var checkEle = $(this).find("input");
				//判断是否为普通产品或打包
				if(checkEle.attr("data-Shipment") == 1) {

					Shipment_num_arr.push($num);
					product_num_arr.push(0);

				} else if(checkEle.attr("data-Shipment") == 0) {

					product_num_arr.push($num);
					Shipment_num_arr.push(0);
				}

			})

			if(totalprice_arr.length > 0) {
				total_price_num['price'] = arr_sum(totalprice_arr);
				total_price_num['num'] = arr_sum(totalnumber_arr);
				total_price_num['Shipment_num'] = arr_sum(Shipment_num_arr);
				total_price_num['product_num'] = arr_sum(product_num_arr);

			} else {
				total_price_num['price'] = 0.00;
				total_price_num['num'] = 0;
				total_price_num['Shipment_num'] = 0;
				total_price_num['product_num'] = 0;
			}
			console.log(total_price_num);
			return total_price_num;
		}

		//数组求和
		function arr_sum(arr) {
			return eval(arr.join('+'));
		}
		//保留两位小数
		function toDecimal2(x) {
			var f = parseFloat(x);
			if(isNaN(f)) {
				return false;
			}
			var f = Math.round(x * 100) / 100;
			var s = f.toString();
			var rs = s.indexOf('.');
			if(rs < 0) {
				rs = s.length;
				s += '.';
			}
			while(s.length <= rs + 2) {
				s += '0';
			}
			return s;
		};
		//提交订单
		function SubmitOrder() {

			var disclick = $(".foot .SubmitOrder ").eq(0).attr("disclick");
			
			var Load = new load();
			var GuidStr = [];
			$.each($('input[type=checkbox]:checked').parents('.list_li'), function(index, ele) {

				GuidStr.push($(ele).attr("data-guid"));

			});
			GuidStr = GuidStr.join(",");
			var param = {
				MemLoginId: commom.getCookie('memlogid'),
				Guid: GuidStr
			}

			$.ajax({
				url: commom.path.httpurl + "?action=SubmitCart",
				method: 'post',
				dataType: "json",
				timeout: 1000,
				data: param,
				success: function(ret) {

					Load.hide();
					if(!ret.isError) {

						window.location.href = 'order1.html'
					} else {

						layer.open({
							content: '打包商品和普通商品不能同时提交',
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});
					}
				}
			})
		};
		//打包
		function SubmitPackage() {

			var disclick = $(".foot .SubmitOrder ").eq(1).attr("disclick");
			
			var Load = new load();
			var GuidStr = [];
			$.each($('input[type=checkbox]:checked').parents('.list_li'), function(index, ele) {

				GuidStr.push($(ele).attr("data-guid"));

			});
			GuidStr = GuidStr.join(",");
			var param = {
				MemLoginId: commom.getCookie('memlogid'),
				Guid: GuidStr
			}
			console.log(param)
			$.ajax({
				url: commom.path.httpurl + "?action=SubmitCartIsPackage",
				method: 'post',
				dataType: "json",
				timeout: 1000,
				data: param,
				success: function(ret) {

					Load.hide();
					if(!ret.isError) {
						var arr = commom.Transformation(ret.Msg);
						window.location.href = 'order_details1.html?id=' + arr.OrderNumber;
					} else {

						layer.open({
							content: '打包商品和普通商品不能同时提交',
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});
					}
				}
			})
		};
		//购物车列表
		function goodList() {

			//启动加载
			var Load = new load();
			var param = {
				MemLoginId: commom.getCookie('memlogid'),
				// MemLoginId:1310612038,
				IsSelected: 0
			}
			$.ajax({
				url: commom.path.httpurl + "?action=GetCart",
				method: 'get',
				dataType: "json",
				timeout: 1000,
				data: param,
				success: function(ret) {

					Load.hide();
					if(!ret.isError) {
						console.log(JSON.parse(ret.Msg));
						var arryList = JSON.parse(ret.Msg);
						var str = '';
						for(var i = 0; i < arryList.length; i++) {

							str += '<li class="clearfix list_li" data-guid="' + arryList[i].Guid + '"><div class="fl check_box" >';
							str += '<input type="checkbox" name="subBox" data-Shipment=' + arryList[i].IsShipment + '>';
							str += '<i class="icon"></i>';
							str += '</div>';

							str += '<a href="details1.html?id=' + arryList[i].ProductGuid + '" class="fl show_img"  >';
							str += '<img class="fl" src="' + arryList[i].OriginalImge + '"/>';
							str += '</a>';

							str += '<div class="list_mian fl">';
							if(arryList[i].IsShipment == 1) {

								str += '<div class="title">(打包商品)' + arryList[i].Name + '</div>';
								console.log("ss")
							} else if(arryList[i].IsShipment == 0) {
								str += '<div class="title">(普通商品)' + arryList[i].Name + '</div>';
							}

							str += '<div class="price"><span>' + arryList[i].Attributes + '</span></div>';
							str += '<div class="price clearfix">';
							str += '<div class="fl red_price">漫豆<span class="red_price">' + arryList[i].BuyPriceRate + '</span></div>';
							str += '<div class="fr num">X<span>' + arryList[i].BuyNumber + '</span></div></div>';
							str += '<div class="price clearfix">';
							//							str += '<div class="fl">漫豆<span>' + arryList[i].MarketPrice + '</span></div>';
							str += '</div></div></li>';

						}
						//  alert(str);
						$(".cart .list").append(str);

					} else {
						$(".null_list").show();
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
	})
})