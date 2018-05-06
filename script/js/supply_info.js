var require = require(['main'], function(main) {

	require(['jquery', 'commom', 'layer', 'mobiscroll', 'load'], function($, commom, layer, mobiscroll, load) {

		//初始化数据
		$(function() {

			//时间滑动时间
			PickTime();
			//车辆所在地
			$(".mycar_address").on('click', function() {

				commom.OpenView("car_address");

			});
			//监听车辆所在地
			if(commom.getItem('address')) {

				$(".car_address").val(commom.getItem('address'));
				//清除地址
				commom.removeItem('address');
			};
			//品牌车
			$(".my_brand").on('click', function() {

				commom.OpenView("buy_brand");
			});
			//监听品牌车系
			if(commom.getItem('brand')) {

				var BrandGuid = commom.getItem('brand');
				var name = commom.getItem('brand_name');
				$(".my_brand_info").val(name);
				$(".my_brand .my_brand_info").attr("data-guid", BrandGuid);
				getproductprop(BrandGuid);
				//存储牌子id
			    commom.setCookie("BrandGuid",BrandGuid);
				//清除地址
				commom.removeItem('brand');
			};
			//车辆属性
			propCar();
			//h后续计划
			$(".supply .plan").on("click", function() {

				Myplan();
			});
			//弹窗取值
			chooseValus();
			//提交数据
            $(".bottom_btn").on("click",function(){
            	    
            	      Submit();
            })
		});
		//车所有的属性
		function propCar() {
			//启动加载
			var Load = new load();
			$.ajax({
				url: commom.path.httpurl + "?action=getproductprop",
				method: 'get',
				timeout: 1000,
				dataType: "json",
				success: function(ret) {
					//关闭加载
					Load.hide();
					var str = '';

					if(!ret.isError) {
						var arryList1 = JSON.parse(ret.Msg);

						for(var i = 0; i < arryList1.length; i++) {

							str += '<div class="input_li clearfix auto_li">';
							str += '	<span class="fl">' + arryList1[i].PropName + '</span>';
							str += '<div class="fr long_li">';
							str += '<input class="buy_brand ele' + i + '" type="text" placeholder="请选择" disabled="disabled" data-id1="' + arryList1[i].ID + '"/>';
							str += '<i class="iconfont icon-iconfontright"></i>';
							str += '</div>';
							var arryList2 = JSON.parse(arryList1[i].PropValue);
							str += '<div class="prop_layer" hidden="hidden">';
							str += '<div class="car_info">';
							str += '<div class="title">' + arryList1[i].PropName + '</div>';
							str += '<ul class="info_list">';

							for(var j = 0; j < arryList2.length; j++) {

								str += '<li class="info_li" data-ele=".ele' + i + '" data-id="' + arryList2[j].ID + '">' + arryList2[j].Name + '</li>';

							}
							str += '</ul>';
							str += '</div>';
							str += '</div>';
							str += '</div>';

						}

						$(".supply .mycar_address").after(str);
						// alert(str)

						//弹窗
						$(document).on("click", ".supply .auto_li", function(e) {

							e.stopPropagation();
							var html = $(this).children(".prop_layer").html()
							layer.open({

								content: html

							});

							return false;
						})
					}
				}
			})
		};
		//时间滑动器
		function PickTime() {

			var curr = new Date().getFullYear();
			var opt = {

			}
			opt.date = {
				preset: 'date',
				minDate: new Date(1980, 3, 10, 9, 22),
				maxDate: new Date(),
				stepMinute: 5
			};

			var demo = 'date';
			$(".demos").hide();
			if(!($("#demo_" + demo).length))
				demo = 'default';

			$("#demo_" + demo).show();
			$('#test_' + demo).val('').scroller('destroy').scroller($.extend(opt['date'], {
				theme: 'android-ics light',
				mode: 'scroller',
				display: 'modal',
				lang: 'zh'
			}));
		};
		//弹窗
		function chooseValus() {

			$("body").on("click", '.info_list .info_li', function(e) {

				e.stopPropagation();
				var id = $(this).attr("data-id");
				var ele = $(this).attr("data-ele");
				$(ele).val($(this).text());
				$(ele).attr("data-id2", id);
				var $ul = $(this).parent();

				if($ul.height() > 200) {

					$ul.addClass('active');

				}
				setTimeout(function() {
					$(".layui-m-layer").remove();
				}, 50)
			})

		}
		//后续计划
		function Myplan() {

			var str = '';
			str += '<div class="car_info">';
			str += '<div class="title">后续计划</div>';
			str += '<ul class="info_list">';
			str += '<li class="info_li" data-ele=".Myplan" >团购新车</li>';
			str += '<li class="info_li" data-ele=".Myplan">买二手车</li>';
			str += '<li class="info_li" data-ele=".Myplan">不买车</li>';
			str += '</ul>';
			str += '</div>';
			layer.open({

				content: str

			});

		};
		//品牌车系
		function getproductprop(BrandGuid) {

			var param = {
				//  PropName:value.key2,
				BrandGuid: BrandGuid
			}

			$.ajax({
				url: commom.path.httpurl + "?action=getproductprop",
				method: 'get',
				dataType: "json",
				data: param,
				timeout: 1000,
				success: function(ret) {

					if(typeof($("#aid").attr("rel")) == "undefined") {

						$(".brand-li").remove();
					}
					if(!ret.isError) {

						var str = '';
						var arryList1 = JSON.parse(ret.Msg);
						str += '<div class="input_li clearfix auto_li brand-li" data-brand-li="bran-li">';
						str += '<span class="fl">' + arryList1[0].PropName + '</span>';
						str += '<div class="fr long_li">';
						str += '<input class="buy_brand eleBrand' + '" type="text" placeholder="请选择" disabled="disabled" data-id1="' + arryList1[0].ID + '" data-categoryId="' + arryList1[0].ProductCategoryID + '"/>';
						str += '<i class="iconfont icon-iconfontright"></i>';
						str += '</div>';
						var arryList2 = JSON.parse(arryList1[0].PropValue);
						str += '<div class="prop_layer" hidden="hidden">';
						str += '<div class="car_info">';
						str += '<div class="title">' + arryList1[0].PropName + '</div>';
						str += '<ul class="info_list">';

						for(var j = 0; j < arryList2.length; j++) {

							str += '<li class="info_li" onclick="chooseValus(\'' + '.eleBrand' + '\',\'' + arryList2[j].ID + '\')">' + arryList2[j].Name + '</li>';

						}
						str += '</ul>';
						str += '</div>';
						str += '</div>';
						str += '</div>';

						$(".supply .my_brand").after(str);
					}
				}
			})
		};

		// Submit()
		function Submit() {

			$(".input_li input").each(function(index, ele) {

				//   	  string+=$(ele).attr("prop")+";";
				if($(ele).val() == 'null' || $(ele).val() == '') {
					layer.open({
						content: '请完善资料',
						skin: 'msg',
						time: 2 //2秒后自动关闭
					});
					return false;
				}

			});
			var propArr = [];
			$(".auto_li .buy_brand").each(function(index, ele) {

				//   	  string+=$(ele).attr("prop")+";";
				propArr.push($(ele).attr("data-id1") + ':' + $(ele).val() + ':' + $(ele).attr("data-id2"));

			});
			//备注
			var phone =commom.GetQueryString('str');
			var Remarks = '车辆所在地:' + $(".mycar_address .car_address").val() + ';' + '车辆上牌时间:' + $(".input_li .brand_time").val() + ';' + '后续计划:' + $(".input_li .Myplan").val() + ';' + '联系电话:' + phone;
			if($(".eleBrand").attr("data-categoryId") == 3) {

				type = 3;
			} else {
				type = 1;
			}
			var param = {
				MemLoginId: commom.getCookie('memlogid'),
				ProductName: $(".carTitle .my_carTitle_info").val(),
				BrandName: $(".my_brand .my_brand_info").val(),
				BrandGuid: commom.getCookie("BrandGuid"),
				ProductCategoryID: type,
				PropData: propArr.join(';'),
				Memo: Remarks
			}

             //启动加载
            var Load =new load();
			$.ajax({
				url: commom.path.httpurl + "?action=InsertProduct",
				method: 'post',
				dataType: "json",
				timeout: 1000,
				data: param,
				success: function(ret) {
                     //关闭加载
                     Load.hide();
					// alert(ret.Msg);
					if(!ret.isError) {
						var ArryList = JSON.parse(ret.Msg)
						commom.OpenView('supply_upload_img', ArryList.Guid);

					} else {
						//提示
						layer.open({
							content: ret.Msg,
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});
					};
				}
			});

		};
		//底部分界线
	})
})