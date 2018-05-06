var require = require(['main'], function(main) {

	require(['jquery', 'commom', 'layer', 'load', 'lazyload', 'infinitescroll'], function($, commom, layer, load, lazyload, infinitescroll) {
		//初始化数据
		$(function() {

			//启动加载
			var Load = new load();
			var param = {
				MemLoginId: commom.getCookie('memlogid')
			}
			//  alert(param.MemLoginId);
			$.ajax({
				url: commom.path.httpurl + "?action=GetMemberAdvancePaymentModifyLogDate",
				method: 'get',
				dataType: "json",
				timeout: 1000,
				data: param,
				success: function(ret) {
					Load.hide();
					if(!ret.isError) {
						var arryList = JSON.parse(ret.Msg);
						var str = '';
						for(var i = 0; i < arryList.length; i++) {

							str += '<div class="my_reord">';
							str += '<div class="time">' + arryList[i].date + '</div>';
							str += '<div class="clearfix pay_num">';
							str += '<span class="fl">支出：' + arryList[i].output + '漫豆</span>';
							str += '<span class="fr">收入：' + arryList[i].input + '漫豆</span>';
							str += '</div></div>';

							var param = {
								MemLoginId: commom.getCookie('memlogid'),
								Date: arryList[i].date
							}
      
							$.ajax({
								url: commom.path.httpurl + "?action=GetMemberAdvancePaymentModifyLog",
								method: 'get',
								dataType: "json",
								timeout: 1000,
								data: param,
								success: function(ret) {
								  
									if(!ret.isError) {
										var str2 = '';
										str2 += '<ul class="pay_list">';
										var arryList = JSON.parse(ret.Msg);
										for(var j = 0; j < arryList.length; j++) {
											if(arryList[j].OperateType == 1) {
												str2 += '<li class="list_li clearfix">';
												str2 += '<div class="fl"><div class="title_tt">' + arryList[j].Memo + '</div><div class="time">' + arryList[j].Date + '</div></div>';
												str2 += '<div class="fr price">+' + arryList[j].OperateMoney + '</div></li>';
											} else {
												str2 += '<li class="list_li clearfix">';
												str2 += '<div class="fl"><div class="title_tt">' + arryList[j].Memo + '</div><div class="time">' + arryList[j].Date + '</div></div>';
												str2 += '<div class="fr price">-' + arryList[j].OperateMoney + '</div></li>';
											}
										}
										str2 += '</ul>';
										$(".record .my_reord ").after(str2);
									}
								}
							});
						};

						$(".record").append(str);

					} else {
						commom.nodataMsg('没有相关交易记录');
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
		})
	})
})