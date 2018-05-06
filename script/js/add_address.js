var require = require(['main'], function(main) {

	require(['jquery', 'commom', 'layer', 'load', 'CNAddrArr', 'scs'], function($, commom, layer, load, CNAddrArr, scs) {

		//初始化
		$(function() {
            //初始化数据
				if ( commom.getItem("edit")) {
					
					var str=commom.getItem("edit");
					var allList = str.split("&");
					var allList2 = allList[3].split("-");
					$(".header span").text("编辑地址");
					$("input.name").val(allList[1]);
					$("input.phone").val(allList[2]);
					$(".addrees_p").text(allList2[0]);
					$(".addressDeails").val(allList2[1]);
					commom.removeItem("edit");
				};
			//城市联动
			$("#myAddrs").click(function() {
				var PROVINCES = [],
					startCities = [],
					startDists = [];
				//Province data，shall never change.
				addr_arr[0].forEach(function(prov) {
					PROVINCES.push({
						key: prov[0],
						val: prov[1]
					});
				});
				//init other data.
				var $input = $(this),
					dataKey = $input.attr("data-key"),
					provKey = 1, //default province 北京
					cityKey = 36, //default city 北京
					distKey = 37, //default district 北京东城区
					distStartIndex = 0, //default 0
					cityStartIndex = 0, //default 0
					provStartIndex = 0; //default 0

				if(dataKey != "" && dataKey != undefined) {
					var sArr = dataKey.split("-");
					if(sArr.length == 3) {
						provKey = sArr[0];
						cityKey = sArr[1];
						distKey = sArr[2];

					} else if(sArr.length == 2) { //such as 台湾，香港 and the like.
						provKey = sArr[0];
						cityKey = sArr[1];
					}
					startCities = getAddrsArrayById(provKey);
					startDists = getAddrsArrayById(cityKey);
					provStartIndex = getStartIndexByKeyFromStartArr(PROVINCES, provKey);
					cityStartIndex = getStartIndexByKeyFromStartArr(startCities, cityKey);
					distStartIndex = getStartIndexByKeyFromStartArr(startDists, distKey);
				}
				var navArr = [{ //3 scrollers, and the title and id will be as follows:
					title: "省",
					id: "scs_items_prov"
				}, {
					title: "市",
					id: "scs_items_city"
				}, {
					title: "区",
					id: "scs_items_dist"
				}];
				SCS.init({
					navArr: navArr,
					onOk: function(selectedKey, selectedValue) {
						$input.val(selectedValue).attr("data-key", selectedKey);
					}
				});
				var distScroller = new SCS.scrollCascadeSelect({
					el: "#" + navArr[2].id,
					dataArr: startDists,
					startIndex: distStartIndex
				});
				var cityScroller = new SCS.scrollCascadeSelect({
					el: "#" + navArr[1].id,
					dataArr: startCities,
					startIndex: cityStartIndex,
					onChange: function(selectedItem, selectedIndex) {
						distScroller.render(getAddrsArrayById(selectedItem.key), 0); //re-render distScroller when cityScroller change
					}
				});
				var provScroller = new SCS.scrollCascadeSelect({
					el: "#" + navArr[0].id,
					dataArr: PROVINCES,
					startIndex: provStartIndex,
					onChange: function(selectedItem, selectedIndex) { //re-render both cityScroller and distScroller when provScroller change
						cityScroller.render(getAddrsArrayById(selectedItem.key), 0);
						distScroller.render(getAddrsArrayById(cityScroller.getSelectedItem().key), 0);
					}
				});
			});
			//提交地址
			$(".btn_in").on("click",function(){
				 
				 add_address();
				 
			})
		})
       
		function getAddrsArrayById(id) {
			var results = [];
			if(addr_arr[id] != undefined)
				addr_arr[id].forEach(function(subArr) {
					results.push({
						key: subArr[0],
						val: subArr[1]
					});
				});
			else {
				return;
			}
			return results;
		}
		/**
		 * 通过开始的key获取开始时应该选中开始数组中哪个元素
		 *
		 * @param {Array} StartArr
		 * @param {Number|String} key
		 * @return {Number} 
		 */
		function getStartIndexByKeyFromStartArr(startArr, key) {
			var result = 0;
			if(startArr != undefined)
				startArr.forEach(function(obj, index) {
					if(obj.key == key) {
						result = index;
						return false;
					}
				});
			return result;
		};
		//add_address增加地址
		function add_address() {

			var id = commom.GetQueryString('str');
			if(id) {
				var guid = (id).split("&")[0];
				var param = {
					MemLoginId: commom.getCookie('memlogid'),
					Name: $("input.name").val(),
					ShengShi: $(".addrees_p").text(),
					Address: $(".addressDeails").val(),
					Mobile: $("input.phone").val(),
					Guid: guid
				}

			} else {
				var param = {
					MemLoginId: commom.getCookie('memlogid'),
					Name: $("input.name").val(),
					ShengShi: $(".addrees_p").val(),
					Address: $(".addressDeails").val(),
					Mobile: $("input.phone").val(),
				}
			}

			//验证手机号码
			if($("input.name").val().length == 0 || $("input.phone").val().length == 0 || $(".addrees_p").val().lenght == 0 || $(".addressDeails").val().length == 0 || $("input.phone").val().length == 0) {
				layer.open({
					content: '输入框不能为空',
					time: 2, //2秒后自动关闭
					skin: 'msg'
				});

			} else if(!(/^1[3|4|5|7|8][0-9]\d{4,8}$/).test($("input.phone").val())) {

				layer.open({
					content: '手机号码格式错误！',
					time: 2, //2秒后自动关闭
					skin: 'msg'
						
				});
			} else {
				//启动加载
				var Load = new load();
				$.ajax({
					url: commom.path.httpurl + "?action=EditAddress",
					method: 'post',
					dataType: "json",
					timeout: 500,
					data: param,
					success: function(ret) {
						//关闭加载
						Load.hide();
						if(!ret.isError) {

							layer.open({
								content: ret.Msg,
								time: 2 ,//2秒后自动关闭
								skin: 'msg'
							});
							window.history.back();
						} else {
							layer.open({
								content: ret.Msg,
								time: 2 ,//2秒后自动关闭
								skin: 'msg'
							});
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

				})
			}
		}
		//底部分界线

	})
})