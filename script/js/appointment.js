var require = require(['main'], function(main) {

	require(['jquery', 'commom', 'layer', 'load', 'mobiscroll'], function($, commom, layer, load, mobiscroll) {

		//初始化数据
		$(function() {

			var guid = commom.GetQueryString('str');
			//时间滑动效果
			PickTime();
			//地区选择
			region(guid);
			//提交数据
			$(".btn_in").on('click', function() {

				Submit(guid);
			});
		})
		//时间滑动器
		function PickTime() {

			var Year = new Date().getFullYear();
			var Month = new Date().getMonth();
			var Data = new Date().getDay();
			var opt = {

			}
			//  opt.date = {
			// 	 preset: 'date',
			// 	 minDate: new Date(1980, 3, 10, 9, 22),
			// 	 maxDate: new Date(),
			// 	 stepMinute: 5
			//  };
			opt.datetime = {
				preset: 'datetime',
				minDate: new Date(),
				maxDate: new Date(Year + 10, Month, Data, 12, 12),
				stepMinute: 5
			};

			var demo = 'date';
			$(".demos").hide();
			if(!($("#demo_" + demo).length))
				demo = 'default';

			$("#demo_" + demo).show();
			$('#test_' + demo).val('').scroller('destroy').scroller($.extend(opt['datetime'], {
				theme: 'android-ics light',
				mode: 'scroller',
				display: 'modal',
				lang: 'zh'
			}));
		};
		//地区
		function region(guid) {
			$.ajax({
				url: commom.path.httpurl + "?action=getsuppliercitybyproduct&ProductGuid=" + guid,
				method: 'get',
				timeout: 1000,
				dataType: "json",
				success: function(ret) {

					if(!ret.isError) {
						var str1 = '';
						var str2 = '';
						var arryList = JSON.parse(ret.Msg);
						//   	<option value="">省级</option>
						str1 += '<option value="' + arryList[0].ShengName + '">' + arryList[0].ShengName + '</option>';
						str2 += '<option value="' + arryList[0].ShiName + '">' + arryList[0].ShiName + '</option>';
						$(".province").append(str1);
						$(".city").append(str2);
						$.ajax({
							url: commom.path.httpurl + "?action=GetDispatchRegion&FatherId=" + arryList[0].Id,
							method: 'get',
							dataType: "json",
							timeout: 1000,
							success: function(ret) {
								//  alert(ret.Msg);
								if(!ret.isError) {
									var str = '';
									var arryList = JSON.parse(ret.Msg);
									for(var i = 0; i < arryList.length; i++) {

										str += '<option value="' + arryList[i].Name + '">' + arryList[i].Name + '</option>';
									};
									$(".region").append(str);
								} else {

								}
							}
						})
					} else {}
				}
			})
		};

		function Submit(guid) {

			var $time = $(".appoint_li .datainp").val();
			var $contact = $(".appoint_li .contact").val();
			var str = '';
			$(".appoint_li select").each(function(index, ele) {
				str += $(ele).find("option:selected").val() + ";";
			})
			var contstr = "看车时间:" + $time + ";" + "联系方式：" + $contact + ";" + "看车地区:" + str;

			var param = {
				MemLoginId: commom.getCookie('memlogid'),
				ProGuid: guid,
				Content: contstr,
				Type: 4
			}
			if($time.length == 0 || $contact.length == 0 || str.length == 0) {

				layer.open({
					content: '输入框不能为空',
					skin: 'msg',
					time: 2 //2秒后自动关闭
				});
			} else if(!(/^1[3|4|5|7|8][0-9]\d{4,8}$/).test($contact)) {
				layer.open({
					content: '手机号码格式错误',
					skin: 'msg',
					time: 2 //2秒后自动关闭
				});

			} else {
				//启动加载
				var Load = new load();
				$.ajax({
					url: commom.path.httpurl + "?action=AddProductComment",
					method: 'post',
					dataType: "json",
					timeout: 1000,
					data: param,
					success: function(ret) {
						//关闭加载
						Load.hide();
						if(!ret.isError) {

							layer.open({
								content: '<p>预约成功！</p><p>请注意安排好你的时间</p>',
								skin: 'msg',
								time: 2 //2秒后自动关闭
							});
							setTimeout(function() {

								window.history.back();

							}, 1000);
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
		}
		//底部分界线

	})
})