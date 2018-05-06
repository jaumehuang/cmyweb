
var require = require(['main'], function(main) {

	require(['jquery', 'commom', 'swiper', 'layer', 'load'], function($, commom, swiper, layer, load) {

		var fage = true; //判断是否收藏成功
		//初始化
		$(function() {

			var CurrentDate;
			var CurrentPrice;
			var guid = commom.GetQueryString('id');
			auto_banner(guid, function() {
				//轮播图
				var mySwiper = new Swiper('.swiper-container', {
					autoplay: 3000,
					speed: 500,
					pagination: '.swiper-pagination',
					paginationClickable: true,
					loop: true,
					loopAdditionalSlides: 1,
					autoplayDisableOnInteraction: false,
				});
				//商品详情
				GetProduct(guid);
			});

			//查看更多参数
			$(".details_title .more_parl").on('click', function() {

				commom.OpenView('parameter', guid);
			});
			//经纪人更多信息
			$(".Agent").on('click', '.agent', function() {

				commom.OpenView('agent_details', $(this).attr('data-adminid'));

			});
			//收藏
			collection(guid);
			//讲价
			$(".bargain").on('click',function(){
				
			     bargain(guid);
			});
			//预约看车
			$(".prodel").on('click',function(){
				
				appointment(guid);
			})
			
		})

		//多图轮播
		function auto_banner(guid, callback) {
			//启动加载
			var Load = new load();
			var str = '';
			$.ajax({
				url: commom.path.httpurl + "?action=getproductimages&ProductGuid=" + guid,
				method: 'get',
				dataType: "json",
				success: function(ret) {
					//关闭加载
					Load.hide();
					if(!ret.IsError) {

						var banner_arr = JSON.parse(ret.Msg);
						var str = '';
						str += '<div class="swiper-container">	<div class="swiper-wrapper">';
						for(var i = 0; i < banner_arr.length; i++) {
							str += '<div class="swiper-slide">';
							str += '<img src="' + banner_arr[i].OriginalImge + '" onclick="imageBrowser(\'' + banner_arr[i].OriginalImge + '\')"/>'
							str += "</div>";
						}
						str += '</div><div class="swiper-pagination"></div><div class="Repertory_bg"><div class="RepertoryNumber"></div></div></div>';
						$(".title_top").before(str);
						callback(true);

					} else {

						layer.open({
							content: ret.msg,
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});
					}
				}
			});
		};

		//详情展示
		function GetProduct(guid) {

			var str = '';
			$.ajax({
				url: commom.path.httpurl + "?action=getproduct&ProductGuid=" + guid,
				method: 'get',
				dataType: "json",
				success: function(ret) {
             
					if(!ret.IsError) {

						var listArry = JSON.parse(ret.Msg);
						CurrentDate = listArry[0].ModifyTime;
						CurrentPrice = listArry[0].ShopPrice - listArry[0].CostPrice;
						//利润
						GetProductCommissionDiscount();
						str += '<div class="title_p">' + listArry[0].Name + '</div>';
						str += '<div class="clearfix">';
						if(listArry[0].ShopPrice > 10000) {
							var ShopPrice = (listArry[0].ShopPrice) / 10000;
							var MarketPrice = (listArry[0].MarketPrice) / 10000;
							str += '<div class="price fl">指导价:<span class="price_txt"><span class="red_price">' + ShopPrice + '万漫豆</span></span></div>';
							
						    
						} else {
							str += '<div class="price fl">指导价:<span class="price_txt"><span class="red_price">' + listArry[0].ShopPrice + '漫豆</span></span></div>';
							
						};

						str += '<div class="vip_price">上架日期:<span class="">' + listArry[0].ModifyTime.split(" ")[0] + '</span></div></div>';
                        str += '<div class="clearfix">';
						if(listArry[0].MarketPrice > 10000) {
							
							var MarketPrice = (listArry[0].MarketPrice) / 10000;
							str += '<div class="price fl" style="text-decoration: line-through;color:#666" >新车指导价:<span class="price_txt" style="color:#666">￥<span class="" style="color:#666">' + MarketPrice + '万漫豆(含税)</span></span></div>';
						    
						} else {
							
							str += '<div class="price fl" style="text-decoration: line-through;color:#666" >新车指导价:<span class="price_txt" style="color:#666">￥<span class="" style="color:#666">' + listArry[0].MarketPrice +'漫豆(含税)</span></span></div>';
						};
						str += '</div>';
						$(".title_top").append(str);

						var $Title_bottom = $(".title_bottom");
						$Title_bottom.html(listArry[0].Detail)

						$Title_bottom.find("img").each(function(index, ele) {

							$(ele).attr("onclick", "imageBrowser('" + $(ele).attr("src") + "')");

						});
						if(listArry[0].CostPrice > 10000) {
							var CostPrice = (listArry[0].CostPrice) / 10000;
							$(".low_price").text(CostPrice + '万漫豆');
						} else {
							$(".low_price").text(listArry[0].CostPrice+'漫豆');
						}
						if((listArry[0].ShopPrice - listArry[0].CostPrice) > 10000) {

							var profit = (listArry[0].ShopPrice - listArry[0].CostPrice) / 10000;
							$(".details_title .profit").text(profit + '万漫豆');
						} else {
							$(".details_title .profit").text(listArry[0].ShopPrice - listArry[0].CostPrice+'漫豆');
						}

						$(".Repertory_bg .RepertoryNumber").text("车源号：" + listArry[0].RepertoryNumber);
						//获取经纪人信息

						if(listArry[0].CreateUser) {

							Agent(listArry[0].CreateUser);
						}

					} else {

						layer.open({
							content: ret.msg,
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});
					}
				}
			});
		};

		//佣金天数折扣
		function GetProductCommissionDiscount() {

			$.ajax({
				url: commom.path.httpurl + "?action=getproductcommissiondiscount&CurrentDate=" + CurrentDate + "&CurrentPrice=" + CurrentPrice,
				method: 'get',
				dataType: "json",
				success: function(ret) {
					if(!ret.IsError) {

						var $profit = $(".details_title .profit").text();
						var str = '';
						var arrList = JSON.parse(ret.Msg);
						for(var i = 0; i < arrList.length; i++) {
							if(arrList[i].IsCurrent == "1") {
								str += '<li class="list_li clearfix">';
								str += '<span class="active fl">' + arrList[i].Days + '(' + arrList[i].Date + '内)</span>';
								if(arrList[i].Commission > 10000) {

									var Commission = (arrList[i].Commission) / 10000;
									str += '<span class="active fl">' + arrList[i].Discount + '%' + '分成' + ':'  + Commission + '万漫豆</span>';
								} else {
									str += '<span class="active fl">' + arrList[i].Discount + '%' + '分成' + ':'  + arrList[i].Commission + '漫豆</span>';
								}

								str += '</li>';
							} else {
								str += '<li class="list_li clearfix">';
								str += '<span class="fl">' + arrList[i].Days + '(' + arrList[i].Date + '内)</span>';
								if(arrList[i].Commission > 10000) {

									var Commission = (arrList[i].Commission) / 10000;
									str += '<span class=" fl">' + arrList[i].Discount + '%' + '分成' + ':'  + Commission + '万漫豆</span>';
								} else {
									str += '<span class=" fl">' + arrList[i].Discount + '%' + '分成' + ':'  + arrList[i].Commission + '漫豆</span>';
								}
								str += '</li>';
							}

						}
                        
						$(".price_list").append(str);
						//判断日期
					} else {

						layer.open({
							content: ret.msg,
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});

					}
				}
			});
		}
		//经纪人信息
		function Agent(admin) {
			$.ajax({
				url: commom.path.httpurl + "?action=Getmember&MemLoginID=" + admin,
				method: 'get',
				dataType: "json",
				success: function(ret) {
					//  alert(ret.isError)
					if(!ret.isError) {
						$(".Agent").show();
						var listArry = JSON.parse(ret.Msg);
						//
						var str = '';
						str += '<div class="title">经纪人信息</div>';
						str += '<div class="agent clearfix" data-adminid=' + admin + '>';
						str += '<img src="' + listArry[0].Photo + '" class="fl"/>';
						str += '<div class="fl user_li">';
						str += '<div class="user_name">' + listArry[0].RealName + '</div>';
						str += '<div class="user_tt">认证车源：<span>' + listArry[0].ProductCount + '</span></div></div>';
						str += '<i class="iconfont icon-iconfontright fr"></i></div>';
						$(".Agent").append(str);
					} else {
						//						layer.open({
						//							content: ret.msg,
						//							skin: 'msg',
						//							time: 2 //2秒后自动关闭
						//						});
					}
				}
			})
		};
		//收藏
		function collection(guid) {

			InitProductCollect(guid)
			$(".details_foot .call_phone ").on('click', function() {
				//判断是否登录
				commom.isLogin();
				var $self = $(this);
				if(fage) {

					UpdateProductCollect(0, guid, 1);

				} else {

					UpdateProductCollect(1, guid, 0);
				};
			})

		};
		//初始化收藏
		function InitProductCollect(guid) {
			//判断是否登录
			var is = typeof commom.getCookie('memlogid') == 'string' ? true : false;
			if(!is) {
				return false;
			}
			//初始化收藏数据
			var param = {
				MemLoginId: commom.getCookie('memlogid'),
				ProductGuid: guid,
			}
			//  alert(JSON.stringify(param))
			$.ajax({
				url: commom.path.httpurl + "?action=GetProductCollect",
				method: 'get',
				dataType: "json",
				timeout: 500,
				data: param,
				success: function(ret) {

					if(!ret.isError) {

						$(".details_foot .call_phone ").children("i").addClass("icon-xing").removeClass("icon-fav");
						$(".details_foot .call_phone ").children("i").css("color", "#d20000");
						fage = false;
					}
				}
			});
		};
		//提交收藏数据
		function UpdateProductCollect(type, guid, index) {

			//启动加载
			var Load = new load();
			var param = {
				MemLoginId: commom.getCookie('memlogid'),
				ProductGuid: guid,
				IsCollect: type
			};
			$.ajax({
				url: commom.path.httpurl + "?action=UpdateProductCollect",
				method: 'post',
				dataType: "json",
				timeout: 500,
				data: param,
				success: function(ret) {
					//关闭加载
					Load.hide();
					if(!ret.isError) {

						//提示
						if(index == 1) {
							layer.open({
								content: '收藏成功',
								skin: 'msg',
								time: 2 //2秒后自动关闭
							});
							$(".details_foot .call_phone ").children("i").addClass("icon-xing").removeClass("icon-fav");
							$(".details_foot .call_phone ").children("i").css("color", "#d20000");
							fage = false;
						} else if(index == 0) {
							layer.open({
								content: '取消收藏',
								skin: 'msg',
								time: 2 //2秒后自动关闭
							});
							$(".details_foot .call_phone ").children("i").addClass("icon-fav").removeClass("icon-xing");
							$(".details_foot .call_phone ").children("i").css("color", "#666");
							fage = true;
						}

					} else {

						layer.open({
							content: '收藏失败',
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});
					}
				}
			})
		};
		//讲价
		function bargain(guid) {

			//判断是否登录
			var is = typeof commom.getCookie('memlogid') == 'string' ? true : false;
			if(!is) {

				window.location.href = 'login.html';
				return false;
			}
			//启动加载
			var Load = new load();
			$.ajax({
				url: commom.path.httpurl + "?action=getproduct&ProductGuid=" + guid,
				method: 'get',
				timeout: 500,
				dataType: "json",
				success: function(ret) {
					Load.hide();
					if(!ret.IsError) {

						var listArry = JSON.parse(ret.Msg);
						var str = '';
						str += '<div class="bargain">';
						str += '<div class="title">我们帮你将出价通知卖家</div>';
						str += '<div class="text_red">卖家标价<span>' + listArry[0].ShopPrice + '漫豆</span></div>';
						str += '<div class="text_p">价格合理，立即预约看车</div>';
						str += '<div class="clearfix form_li"><span class="fl">意向价格</span><input type="text" class="fl" /></div>';
						str += '<div class="clearfix form_li"><span class="fl">联系方式</span><input type="text" class="fl" /></div>';
						str += '</div>';
						layer.open({
							content: str,
							btn: ['提交', '取消'],
							yes: function(index) {

								var $phone = $(".bargain .form_li").eq(1).find("input").val();
								var $contact = $(".bargain .form_li").eq(0).find("input").val();
								var contstr = $(".bargain .form_li").eq(0).text() + ":" + $contact + ";" + $(".bargain .form_li").eq(1).text() + ":" + $phone;

								var param = {
									MemLoginId: commom.getCookie('memlogid'),
									ProGuid: guid,
									Content: contstr,
									Type: 2
								}
								//验证方式
								if($contact.length == 0 || $phone.length == 0) {

									//提示
									layer.open({
										content: "输入框不能为空",
										skin: 'msg',
										time: 2 //2秒后自动关闭
									});
								} else if(!(/^1[3|4|5|7|8][0-9]\d{4,8}$/).test($phone)) {

									//提示
									layer.open({
										content: "手机号码格式错误！",
										skin: 'msg',
										time: 2 //2秒后自动关闭
									});
								} else {
									//启动加载
									var Load = new load();
									$.ajax({
										url: commom.path.httpurl + "?action=addProductcomment",
										method: 'post',
										dataType: "json",
										timeout: 500,
										data: param,
										success: function(ret) {
                                            //关闭加载
											Load.hide();
											if(!ret.IsError) {
												//  layer.close(index);//关掉弹窗
												layer.open({
													content: '提交成功,我们会尽快回复你。',
													skin: 'msg',
													time: 2 //2秒后自动关闭
												});
											} else {
												//提示
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
						});

					} else {
						//提示
						layer.open({
							content: ret.Msg,
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});
					}
				}
			});
		};

		//预约看车
        function appointment(guid) {
            
            //判断是否登录
            commom.isLogin('appointment',guid);
        }
		//底部边界线 
	})
})