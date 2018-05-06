var require = require(['main'], function(main) {

	require(['jquery', 'commom', 'layer', 'load', ], function($, commom, layer, load, ) {

		//初始化加载
		$(function() {

			//初始化时间
			TimeDate();
			//监听车系
			if(commom.getItem('BrandName')) {

				$(".selectBrand").children("input").val(commom.getItem('BrandName'));
				//删除存储数据
				commom.removeItem('BrandName');
			};
			//城市列表
			$(".city").on("click", function() {

				City(function() {

					$("body").on("click", ".city_list .city_li", function(e) {

						var id = $(this).attr("data-id");
						cityList(id);

					})
				});
			});
			//提交数据
			$(".btn_in").on("click",function(){
				
				 SubmitData();
			})
		});
		//时间滑动器
		function TimeDate() {

			var time = new Date();
			//当前时间
			var Yeart = time.getFullYear();
			var year = ''
			for(var i = Yeart; i > 1980; i--) {
				year += '<option value="' + i + '">' + i + '</option>';
			}
			$(".year").append(year);
			var month = '';
			for(var i = 1; i <= 12; i++) {

				month += '<option value="' + i + '">' + i + '</option>';

			}
			$(".month").append(month);
		};
		//选择城市
		function City(callback) {

			var cityFage = true;
			//启动加载
			var Load = new load();
			$.ajax({
				url: commom.path.httpurl + "?action=GetDispatchRegion&FatherId=0",
				method: 'get',
				dataType: "json",
				timeout: 1000,
				success: function(ret) {
					//关闭加载
					Load.hide();
					// alert(ret.Msg)
					if(!ret.isError) {
						var arryList = JSON.parse(ret.Msg);
						var str = '';
						str += '<ul class="city_list">';

						for(var i = 0; i < arryList.length; i++) {
							str += '<li class="clearfix city_li" data-id="' + arryList[i].ID + '"><label for="' + arryList[i].ID + '" class="fl">' + arryList[i].Name + '</label><input type="radio" class="fr" id="' + arryList[i].ID +
								'" name="city"/><i class="icon fr"></i></li>';
						}
						str += "</ul>";
						layer.open({
							content: str
						});
						if($(".city_list").height() > 500) {
							$(".city_list").css({

								"height": "500px",
								"overflow-y": "auto"

							})
						} else {
							$(".city_list").css({

								"height": "auto",

							})
						};
						callback(true);
					}
				}
			})
		};
		//二级城市
		function cityList(ID) {

			$.ajax({

				url: commom.path.httpurl + "?action=GetDispatchRegion&FatherId=" + ID,
				method: 'get',
				dataType: "json",
				timeout: 1000,
				success: function(ret) {

					if(!ret.isError) {
						var arryList = JSON.parse(ret.Msg);
						var str = '';
						if($(".city_list").has("li")) {
							$(".city_list").find("li").remove();
							for(var i = 0; i < arryList.length; i++) {
								str += '<li class="clearfix city_li"><label for="' + arryList[i].ID + '" class="fl">' + arryList[i].Name + '</label><input type="radio" class="fr" id="' + arryList[i].ID + '" name="city"/><i class="icon fr"></i></li>';
							}
							$(".city_list").append(str);
							$(".city_list").attr('data-type', '1');
							if($(".city_list").height() > 500) {
								$(".city_list").css({
									"height": "500px",
									"overflow-y": "auto"
								})
							} else {
								$(".city_list").height($(".city_list").height());
							}

							//选中.layui-m-layer
							$(document).on("click", ".city_list li", function(e) {

								e.stopPropagation();
								if($(".city_list").attr("data-type") && $(".city_list").attr("data-type") == "1") {

									$(".Seletecity .city").text($(this).find("label").text())
									$(".layui-m-layer").remove();

								}

								return false;
							})
						}
					}
				}
			});
		};
		//提交数据集
		function SubmitData() {

			//判断数据是否为空
			var $Model = $(".va_form .models").val();
			var $year = $(".va_form .year").val();
			var $month = $(".va_form .month").val();
			var $address = $(".Seletecity .city").text();
			var $mileage = $(".inputLi input").val();
			if($Model.length == 0 || $year.length == 0 || $month.length == 0 || $address.length == 0 || $mileage.length == 0) {

				layer.open({
					content: "请填写完整资料",
					skin: 'msg',
					time: 2 //2秒后自动关闭
				});
				return false;
			}
		
			var content = '车型：' + $(".selectBrand").children("input").val() + ';' + '上牌时间：' + $(".year").val() + '年' + $(".month").val() + '月' + ';' + '地址：' + $(".Seletecity .city").text() + ';' + "里程：" + $(".inputLi input").val();
			var param = {
				MemLoginId: commom.getCookie('memlogid'),
				ProGuid: "0386496b-9e82-4669-93ce-d093b2453f40",
				Content: content,
				Type: 3
			};
			//启动加载
			var Load = new load();
			$.ajax({
				url: commom.path.httpurl + "?action=AddProductComment",
				method: 'post',
				dataType: "json",
				data: param,
				timeout: 1000,
				success: function(ret) {
                     //关闭加载
                     Load.hide();
					if(!ret.isError) {
						var str = '';
						str += '<div class="car_info submit">';
						str += '<div>我们已收到你的信息</div>';
						str += '<div>等待几分钟</div>';
						str += '<div>你将会收到估值结果的短信</div>';
						str += '</div>';
						layer.open({
							content: str,
							skin: 'msg',
							time: 3 //2秒后自动关闭
						});
						setTimeout(function() {
                          
                           window.history.back();

						}, 2000)
					} else {
						layer.open({
							content: ret.Msg,
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});
					}
				}
			})
		};
		//底部分界线
	})
})