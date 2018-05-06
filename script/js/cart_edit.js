var require = require(['main'], function(main) {

	require(['jquery', 'commom', 'layer', 'load'], function($, commom, layer, load) {
		//初始化数据
		$(function() {

			//购物车列表
			goodList();

			$("body").on("click", ".list_li .list_mian  .icon-jia1", function() {
				//单选框选中
				$(this).parentsUntil().eq(2).find("input[type=checkbox]").attr('checked', "checked");
				//取值
				var n = parseInt($(this).prev('input[type=text]').val()) + 1;
				var stock = $(this).prev('input[type=text]').attr("stock");
				if(n > stock) return;
				//
				$(this).prev('input[type=text]').val(n);
				var guid = $(this).prev('input[type=text]').attr("data-guid");
				var num = $(this).prev('input[type=text]').val();
				UpdateProductNum(guid, num);

			});
			//数量减少
			$("body").on("click", ".list_li .list_mian .icon-jian", function() {
				//单选框选中
				$(this).parentsUntil().eq(2).find("input[type=checkbox]").attr('checked', "checked");
				//取值
				var n = parseInt($(this).next('input[type=text]').val()) - 1;
				var stock = $(this).prev('input[type=text]').attr("stock");
				if(n < 1) return;
				//
				$(this).next('input[type=text]').val(n);
				//				$('.foot .all_price span').html(toDecimal2(total_price_num));
				//
				var guid = $(this).next('input[type=text]').attr("data-guid");
				var num = $(this).next('input[type=text]').val();
				UpdateProductNum(guid, num);
			});
			//全选
			$('body').on('click', '#Checkbox1', function() {
				checkall();
				var $self = $(this);
				var total_price_num = totalpricenum();

				$('.foot .all_price span').html(toDecimal2(total_price_num));

			})
			//点击多选框
			$('body').on('click', '.list_li .check_box input[type=checkbox]', function() {

				var $self = $(this);

				var total_price_num = totalpricenum();
				$('.foot .all_price span').html(toDecimal2(total_price_num));

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

				} else {

					all.checked = false;
					$(all).removeAttr("checked");
				}

			})
			//删除单个商品
			deleteWare();
			//删除多个商品
			$(".moredel").on("click",function(){
				
				 allDelete();
			})
		});

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
		//删除单个商品
		function deleteWare() {

			
			$("body").on("click", ".list .list_li .delete", function(e) {
                
                e.stopPropagation();
                var  $self=$(this);
				var $oder_li = $self.parent();
				var guidArr = [];
				guidArr.push($oder_li.find("input[type=text]").attr("data-guid"));
				layer.open({
					content: '确定删除该商品吗？',
					btn: ['删除', '取消'],
					yes: function(index) {

						var param = {
							MemLoginId: commom.getCookie('memlogid'),
							Guid: guidArr.join(",")
						}

						$.ajax({
							url: commom.path.httpurl + "?action=DelCart",
							method: 'post',
							dataType: "json",
							data: param,
							timeout: 1000,
							success: function(ret) {
								//  alert(ret.Msg);
								if(!ret.IsError) {

									layer.close(index);
									window.location.reload()

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
		}
		//购物车列表
		function goodList() {

			//启动加载
			var Load = new load();
			var param = {
				MemLoginId: commom.getCookie('memlogid'),
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
					// alert(ret.Msg);
					if(!ret.isError) {
						var arryList = JSON.parse(ret.Msg);
						var str = '';
						for(var i = 0; i < arryList.length; i++) {
							str += '<li class="clearfix list_li"><div class="fl check_box">';
							str += '<input type="checkbox" name="subBox" />';
							str += '<i class="icon"></i>';
							str += '</div>';

							str += '<a href="details1.html?id='+arryList[i].ProductGuid+'" class="fl show_img" >';
							str += '<img class="fl" src="' + arryList[i].OriginalImge + '"/>';
							str += '</a>';
							str += '<div class="list_mian fl">';
							str += '<div class="num clearfix">';
							str += '<i class="iconfont icon-jian"></i>';
							str += '<input type="text" value="' + arryList[i].BuyNumber + '" data-guid="' + arryList[i].Guid + '" />';
							str += '<i class="iconfont icon-jia1"></i></div>';
							str += '<div class="price"> 规格：<span>' + arryList[i].Attributes + '</span></div></div>';
							str += '<div class="delete fl">删除</div>';

						}
						//  alert(str);
						$(".cart_edit .list").append(str);

					} else {

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
		//计算数组的和
		var totalpricenum = function() {

			var totalprice_arr = [];
			var totalnumber_arr = [];
			var total_price_num = [];
			$.each($('input[type=checkbox]:checked').parents('.list_li'), function(index, ele) {

				var $num = $(this).find('.list_mian .num input[type=text]').val();

				totalnumber_arr.push(parseInt($num));

			})

			if(totalnumber_arr.length > 0) {

				total_price_num = arr_sum(totalnumber_arr);
			} else {

				total_price_num = 0;
			}
			return total_price_num;
		};

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
				//					s += '.';
			}
			//				while(s.length <= rs + 2) {
			//					s += '0';
			//				}
			return s;
		};
		//更新购物车的数量
		function UpdateProductNum(guid, num) {
			var param = {
				MemLoginId: commom.getCookie('memlogid'),
				Guid: guid,
				Num: num
			}
			$.ajax({
				url: commom.path.httpurl + "?action=UpdateCart",
				method: 'post',
				dataType: "json",
				data: param,
				timeout: 1000,
				success: function(ret) {

					if(ret) {

					};
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
		//多个商品删除
		function allDelete() {

			layer.open({
				content: '确定删除所有商品吗？',
				btn: ['删除', '取消'],
				yes: function(index) {

					var guidArr = [];
					$.each($('input[type=checkbox]:checked').parents('.list_li'), function(index, ele) {

						guidArr.push($(ele).find("input[type=text]").attr("data-guid"));
					});
					var param = {
						MemLoginId: commom.getCookie('memlogid'),
						Guid: guidArr.join(",")
					}
					$.ajax({
						url: commom.path.httpurl + "?action=DelCart",
						method: 'post',
						dataType: "json",
						timeout: 1000,
						data: param,
						success: function(ret) {
							//  alert(ret.Msg);
							if(!ret.IsError) {

								layer.close(index);
								$.each($('input[type=checkbox]:checked').parents('.list_li'), function(index, ele) {
									$(ele).remove();
								});

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
		}
	})
})