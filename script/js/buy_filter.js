//		apiready = function() {
//
//			var systemType = api.systemType;
//			if (systemType == "ios") {
//
//				$(".equipment").css("background", '#fff');
//			};
//			api.showProgress({
//				title: '',
//				text: '加载中,请稍后...',
//				modal: false
//			});
//			propCar();
//
//		}
var require = require(['main'], function(main) {

	require(['jquery', 'commom', 'layer', 'load', 'rangeslider'], function($, commom, layer, load, rangeslider) {

		//数据初始化
		$(function() {
			//初始化车辆属性
			propCar();
		});
		//	//车所有的属性
		function propCar() {
			//初始化加载
			var Load = new load();
			$.ajax({
				url: commom.path.httpurl + "?action=getproductprop",
				method: 'get',
				dataType: "json",
				timeout: 500,
				success: function(ret) {
					//关闭加载
					Load.hide();
					if(!ret.isError) {
						var str = '';
						var objCar = [];
						var arryList2;
						var k = 1;
						var arryList1 = JSON.parse(ret.Msg);

						for(var i = 0; i < arryList1.length; i++) {

							if(arryList1[i].ShowType == 2) {
								arryList2 = JSON.parse(arryList1[i].PropValue);
								var index = arryList2[0].Name;
								for(var j = 0; j < arryList2.length; j++) {
									if(arryList2[j].Name > index) {
										index = arryList2[j].Name;
									}
								}
								str += '<div class="product_list">';
								str += '<div class="title_car">' + arryList1[i].PropName + '	</div>';
								str += '<div class="car_list ex' + k + '">';
								str += '<div class="clearfix range_slide"><output class="fl item num" data-prop="' + arryList1[i].ID + '">0</output><span class="fr item">' + index + '</span></div>';
								str += '<output></output><input type="range" value="0" min="0" max="' + index + '" data-rangeslider>';
								str += '</div></div>';
								k++;
							} else {
								str += '<div class="product_list">';
								str += '<div class="title_car">' + arryList1[i].PropName + '</div>';
								str += '<ul class="car_list clearfix">';
								arryList2 = JSON.parse(arryList1[i].PropValue);
								for(var j = 0; j < arryList2.length; j++) {

									str += '<li class="car_li" prop=' + arryList1[i].ID + ":" + arryList2[j].ID + '>';
									str += '<span>' + arryList2[j].Name + '</span>';
									// str += '<i class="iconfont icon-jia"></i>';
									str += '</li>';
								}
								str += '</ul></div>';
							}

						}
						$(".filter").append(str);

						$(function() {
							var $document = $(document);
							var selector = '[data-rangeslider]';
							var $inputRange = $(selector);

							function valueOutput(element) {
								var value = element.value;
								var output = element.parentNode.getElementsByTagName('output')[0];
								output.innerHTML = value;
							}

							for(var i = $inputRange.length - 1; i >= 0; i--) {
								valueOutput($inputRange[i]);
							};

							$document.on('input', selector, function(e) {
								valueOutput(e.target);
								filter('output');
							});

							$inputRange.rangeslider({
								polyfill: false
							});

						});
						$(document).on("click", ".filter .car_list .car_li", function() {
							$(this).toggleClass("active");
							$(this).siblings().removeClass("active");
							filter();
						});
						$(".header span.fr").on("click", function() {

							$(".filter .car_list .car_li").each(function(index, ele) {
								$(ele).removeClass("active");
							})

						})
						//点击进入下一页
						$(".foot a.fr ").on("click", function() {
							
							var str2 = filter();
							commom.setItem('filter',str2);

						});
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

		function filter(type) {
			//初始化加载
			var Load = new load();
			var arr = [];
			$(".filter .car_list .car_li").each(function(index, ele) {
				if($(ele).hasClass("active")) {

					//   	  string+=$(ele).attr("prop")+";";
					arr.push($(ele).attr("prop"));

				}
			});
			//获取进度条的值
			if(type == 'output') {

				$(".filter .car_list .num ").each(function(index, ele) {

					arr.push($(ele).attr("data-prop") + ":" + $(ele).text());
				})
			}; 
			var string = arr.join(';');
			var parm = {
				prop: string,
				CategoryId: 1,
				CityCode: commom.getCookie("cityCode")
			};
			$.ajax({
				url: commom.path.httpurl + "?action=getproductcount",
				dataType: "json",
				method: 'get',
				data: parm,
				timeout: 500,
				success: function(ret) {
					//关闭加载
					Load.hide();
					if(!ret.isError) {
						$(".foot .fl span").text(ret.Msg);
					}
				}
			});
			return string;
		}
		//底部分界面
	})
})