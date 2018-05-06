var require = require(['main'], function(main) {

	require(['jquery', 'commom', 'layer', 'load'], function($, commom, layer, load) {
		//初始化数据
		$(function() {

			bankList();

			//操作银行卡ontouchmove="gtouchmove()" ontouchstart="gtouchstart(\'' + arryList[i].Guid + '\')"
            $("body").on(".touchend",".banklist .bank_li",function(){
            	    
            	    var guid=$(this).attr("data-guid");
            	    commom.OpenView('add_bank',guid);
            }).on("touchmove",".banklist .bank_li",function(){
            	   
            	   gtouchmove();
            	   
            }).on("touchstart",".banklist .bank_li",function(){
            	    
            	    var guid=$(this).attr("data-guid");
            	     gtouchstart(guid);
            }).on("touchend",".banklist .bank_li",function(){
            	    
            	    var guid=$(this).attr("data-guid");
            	     gtouchend("add_bank", guid);
            	     
            });
		})
		//	 	鼠标长按弹窗
		var timeOutEvent = 0; //定时器
		//开始按
		function gtouchstart(guid) {
			
			timeOutEvent = setTimeout(function() {
				timeOutEvent = 0;
				//执行长按要执行的内容，如弹出菜单
				layer.open({
					content: '您确定要删除该银行卡？',
					btn: ['确定', '取消'],
					yes: function(index) {

						var param = {
							MemLoginId: commom.getCookie('memlogid'),
							BankGuid: guid
						};
						$.ajax({
							url: commom.path.httpurl + "?action=DelMemberBank",
							method: 'post',
							dataType: "json",
							timeout: 1000,
							data: param,
							success: function(ret) {

								if(!ret.isError) {
									layer.close(index);
									location.reload()
								}
							}

						})
					}
				});
			}, 500); //这里设置定时器，定义长按500毫秒触发长按事件，时间可以自己改，个人感觉500毫秒非常合适
			return false;
		};
		//手释放，如果在500毫秒内就释放，则取消长按事件，此时可以执行onclick应该执行的事件
		function gtouchend(Url, guid) {
			clearTimeout(timeOutEvent); //清除定时器
			if(timeOutEvent != 0) {
				//这里写要执行的内容（尤如onclick事件）
				 commom.OpenView(Url, guid);
			}
			return false;
		};
		//如果手指有移动，则取消所有事件，此时说明用户只是要移动而不是长按
		function gtouchmove() {
			clearTimeout(timeOutEvent); //清除定时器
			timeOutEvent = 0;

		};

		//真正长按后应该执行的内容
		function longPress(guid, $self) {

			timeOutEvent = 0;
			layer.open({
				content: '您确定要删除该银行卡？',
				btn: ['确定', '取消'],
				yes: function(index) {
					var param = {
						MemLoginId: $commom.getCookie('memlogid'),
						BankGuid: guid
					}
					var Load = new load();
					$.ajax({
						url: commom.path.httpurl + "?action=DelMemberBank",
						method: 'post',
						dataType: "json",
						timeout: 1000,
						data: param,
						success: function(ret) {

							Load.hide();
							if(!ret.isError) {
								$self.remove();
								layer.close(index);
							}
						}
					})
				}
			});
		};

		function bankList() {

			//启动加载
			var Load = new load();
			var param = {
				MemLoginId: commom.getCookie('memlogid')
			}
			//  alert(param.MemLoginId);
			$.ajax({
				url: commom.path.httpurl + "?action=GetMemberBank",
				method: 'get',
				dataType: "json",
				data: param,
				success: function(ret) {
					Load.hide();
					if(!ret.isError) {
						if($(".bank .banklist").has(".bank_li")) {

							$(".bank .banklist").find(".bank_li").remove();
						}
						var arryList = JSON.parse(ret.Msg);
						var str = '';

						for(var i = 0; i < arryList.length; i++) {
							//  <div style="width:100%; height:100px; background-color:#CCC;" ontouchstart="gtouchstart()" ontouchmove="gtouchmove()" ontouchend="gtouchend()">长按我</div>
							str += '<li class="bank_li clearfix"   data-guid="' + arryList[i].Guid + '" >';
							str += '<img src="../image/back.png" class="item-left fl" />';
							str += '<div class="item-left banklist_main fl">';
							str += '<div class="">' + arryList[i].BankAccountName + '</div>';
							str += '<div>储蓄卡</div>';
							for(var j = 0; j < arryList[i].BankAccountNumber.length - 4; j++) {
								arryList[i].BankAccountNumber = arryList[i].BankAccountNumber.replace(arryList[i].BankAccountNumber[j], '*');
							}

							str += '<div class="num">' + arryList[i].BankAccountNumber + '</div></div>';
							str += '<i class="icon"></i></li>';
						}

						$(".bank .banklist").append(str);

					}else{
						commom.nodataMsg('没有银行卡',$('.bank'));
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
	})
})