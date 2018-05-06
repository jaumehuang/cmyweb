var require = require(['main'], function(main) {

	require(['jquery', 'commom', 'layer', 'load', 'lazyload', 'infinitescroll', 'swiper'], function($, commom, layer, load, lazyload, infinitescroll, swiper) {
		//初始化数据
		$(function() {

			var $index = commom.GetQueryString("id");
			for(var i = 1; i <= 5; i++) {
				orderList(i, 1, 0);
			}
			var mySwiper = new Swiper('.swiper-container', {
				observer: true, //修改swiper自己或子元素时，自动初始化swiper
				autoHeight: true, //高度随内容变化
				speed: 0,
				observeParents: true, //修改swiper的父元素时，自动初始化swiper
				onTransitionEnd: function(swiper) {
					$('.nav_list .nav_li').eq(mySwiper.activeIndex).addClass('on').siblings().removeClass('on');
					//var Height = $(".swiper-slide-active").height()
					var Height = $(".tab_list .con").eq(mySwiper.activeIndex).height();
					$(".swiper-wrapper").height(Height);
				}
			});
			mySwiper.slideTo($index, 100, false); //切换到第一个slide，速度为1秒
			$('.nav_list .nav_li').eq($index).addClass("on").siblings().removeClass("on");
			$('.nav_list .nav_li').on("click", function() {

				var index = $(this).index();
				$(this).addClass("on").siblings().removeClass("on");
				mySwiper.slideTo(index, 100, false); //切换到第一个slide，速度为1秒
			});
			//监听滚动高度
			$(window).scroll(function() {

				var Height = $(".tab_list .con").eq(mySwiper.activeIndex).height();
				$(".swiper-wrapper").height(Height);
			});
			//进入订单详情
			$("body").on("click", ".product_li", function() {

				var OrderNumber = $(this).attr("data-OrderNumber");
				window.location.href = "order_details1.html?id=" + OrderNumber;
			})
			//订单操作
			$("body").on("click", "button", function(e) {
				//阻止冒泡
				e.stopPropagation();
				var $self = $(this);
				if($self.attr("data-OrderNumber")) {

					var OrderNumber = $self.attr("data-OrderNumber");
					var type = $self.attr("data-type");
					HandleOrder(OrderNumber, type);
				};
				if($self.attr("data-mycomment")) {

					window.location.href = "mycomment.html?str=" + $self.attr("data-mycomment");
				}
			});
			//申请退款

			//数据刷新
			var InfiniteScroll = new infinitescroll({
				loadListFn: function() {
					
					var $index = $(".nav_list .on").index();
					var page = $(".tab_list .con").eq($index).find(".teb_li").attr("data-page");
					//InfiniteScroll.options.open = $(".all_car").attr("bool-page");
					page++;
					$(".tab_list .con").eq($index).find(".loading_more .loading-time").show();
					$(".tab_list .con").eq($index).find(".loading_more .loading_fish").hide();
					orderList($index + 1, page, 1);
       
				}
			});
		});
		//订单列表
		function orderList(index, Page, flage) {

			//启动加载
			var Load = new load();
			var param = {
				MemLoginId: commom.getCookie('memlogid'),
				PageIndex: Page,
				PageCount: 5,
				OrderStatus: index,
				BuyType: 2
			}

			$.ajax({
				url: commom.path.httpurl + "?action=GetOrderInfo",
				method: 'get',
				dataType: "json",
				data: param,
				timeout: 2000,
				success: function(ret) {

					//关闭加载
					Load.hide();

					if(!ret.isError) {

						$(".tab_list .con").eq(index - 1).find(".loading_more").show();
						$(".tab_list .con").eq(index - 1).find(".loading_more .loading-time").hide();
						$(".tab_list .con").eq(index - 1).find(".loading_more .loading_fish").show();
						var arryList = JSON.parse(ret.Msg);
						var str = '';
						for(var i = 0; i < arryList.length; i++) {
							//
							str += '<li class="product_li" data-OrderNumber="' + arryList[i].OrderNumber + '" >';
							str += '<div class="pr_title clearfix">';
							str += '<div class="fl">订单编号:<span>' + arryList[i].OrderNumber + '</span></div>';
							str += '<div class="fr">' + arryList[i].CreateTime + '</div></div>';
							var arryList2 = JSON.parse(arryList[i].OrderProduct);

							str += '<div class="list_li clearfix">'
							for(var j = 0; j < arryList2.length; j++) {

								str += '<div class="clearfix list_p_li">';
								str += '<a  class="fl show_img"  href="details1.html?id=' + arryList2[j].productGuid + '">';
								str += '<img src="' + arryList2[j].OriginalImge + '" /></a>';
								str += '<div class="list_mian fl">';
								str += '<div class="title">' + arryList2[j].Name + '</div>';
								str += '<div class="price clearfix">';
								str += '<div class="fl">规格:<span>' + arryList2[j].Attributes + '</span></div>';
								str += '<div class="fr">X' + arryList2[j].buyNumber + '</div></div>';

								str += '<div class="price">';
								str += '<div class="red_price">漫豆<span>' + arryList2[j].BuyPriceRate + '</span></div>';
								if(arryList2[j].BaskOrderStatus == 1 && arryList[i].OderStatus == 5) {

									str += '<div class="btn_comment" style="border:0;height:auto;text-align:center">已评价</div>'
								}
								if(arryList2[j].BaskOrderStatus == 0 && arryList[i].OderStatus == 5) {

									var strOrder = arryList2[j].Guid + "|" + arryList[i].OrderNumber;

									str += '<button class="btn_comment" data-mycomment="' + strOrder + '" style="height:0.75rem;width:1.5625rem" >评价</button>';
								}
								str += '</div></div></div>';

								// str+='</div></div>';
							}

							//							str += '<div class="location_address"><i class="iconfont icon-dingwei"></i>' + arryList[i].Address + '</div>';
							str += '<div class="pr_bottom clearfix" >';

							if(arryList[i].PaymentStatus == 0&&arryList[i].ShipmentStatus==0) {
//
//								str += '<span class="fl">待支付</span>';
								str += '<div class="btn_group fr">';
								str += '<button class="btn_cancel"  data-OrderNumber="' + arryList[i].OrderNumber + '" data-type="0" >取消订单</button></div>';

							}

								if(arryList[i].isBack == 0) {

									if(arryList[i].ShipmentStatus == 1) {
										var strOrder = arryList[i].Guid + "&" + arryList[i].OrderNumber;
									
										str += '<div class="btn_group fr">';
										
									} else if(arryList[i].ShipmentStatus == 0 || arryList[i].ShipmentStatus == 3) {
										var strOrder = arryList[i].Guid + "|" + arryList[i].OrderNumber;
										str += '<span class="fl">配货中</span>';
//										str += '<div class="btn_group fr">';
										//										str += '<button class="btn_comment" onclick="window.location.href="\'' + "returnMoney.html?id=" + strOrder + '\'" >申请退款</button>';
									}else if(arryList[i].ShipmentStatus==2&&arryList[i].OderStatus!=5){
										 
										 str += '<span class="fl">待结算</span>';
//										 str += '<div class="btn_group fr">';
									}
								} else {

									if(arryList[i].ProcessState == 1) {

										str += '<span class="fl">退款成功</span>';
										str += '<div class="btn_group fr">';
									} else if(arryList[i].ProcessState == 0) {

										str += '<span class="fl">拒绝退款</span>';
										str += '<div class="btn_group fr">';
									} else {

										str += '<span class="fl" >退款中:' + arryList[i].BackReason + '</span>';
										str += '<div class="btn_group fr">';
									};
								};

							if(arryList[i].OderStatus == 5) {

								//								str += '<span class="fl">已支付</span>';
								str += '<div class="btn_group fr">';
								str += '<button class="btn_pay" data-OrderNumber="' + arryList[i].OrderNumber + '" data-type="2">再次购买</button>';

							};
							str += '</div>';
							str += '</div></li>';
						}
						$(".tab_list .con").eq(index - 1).find(".teb_li .loading_more").before(str);
						$(".tab_list .con").eq(index - 1).find(".teb_li").attr("data-page", Page);
						$(".tab_list .con").eq(index - 1).find(".teb_li").attr("bool-page", true);
                         var Height = $(".swiper-slide-active").height();
                         $(".swiper-wrapper").height(Height);
					} else {
						//数据加载完毕的情况下和没有数据的情况下

						if(flage == 0) {

							NullOrder(index);

						};
						if(flage == 1) {

							$(".tab_list .con").eq(index - 1).find(".loading_more").show();
							$(".tab_list .con").eq(index - 1).find(".loading_more .loading-time").hide();
							$(".tab_list .con").eq(index - 1).find(".loading_more .loading_fish").show();
							$(".tab_list .con").eq(index - 1).find(".teb_li").attr("bool-page", false);

						};

						function NullOrder(index) {

							var str = '';
							str += '<div class="null_order">';
							str += '<img src="../image/null_order.png" class="null_img" />';
							str += '<div class="null_p">暂无订单</div>';
							str += '<div class="product_list">';
							str += '<div class="product_title clearfix"><i class="iconfont icon-aixin"></i><span class="">猜你喜欢</span></div>';
							str += '<ul class="list">';
							var param = {
								PageIndex: 1,
								PageCount: 10,
								CategoryId: 1,
								IsShow: "IsHot",
							}
							$.ajax({
								url: commom.path.httpurl + "?action=getproductlist",
								method: 'get',
								dataType: "json",
								timeout: 1000,
								data: param,
								success: function(ret) {

									if(!ret.isError) {

										var arryList = JSON.parse(ret.Msg);
										for(var i = 0; i < arryList.length; i++) {
											str += '<li class="list_li">';
											str += '<a class="clearfix"  href="details2.html?id=' + arryList[i].Guid + '">';
											str += '<img class="fl" src="' + arryList[i].OriginalImge + '"/>';
											str += '<div class="conten_main fl">';
											str += '<div class="title">' + arryList[i].Name + '</div>';
											str += '<div class="title_p ">车源号:' + arryList[i].RepertoryNumber + '</div>';
											str += '<div class="price clearfix">';
											str += '<div class="fl">指导价:</span>';
											if(arryList[i].ShopPrice > 10000) {
												var ShopPrice = (arryList[i].ShopPrice) / 10000;
												str += '<span class="red_price">' + ShopPrice + '</span>万漫豆</div></div>';
											} else {
												str += '<span class="red_price">' + arryList[i].ShopPrice + '漫豆</span></div></div>';
											};
											str += '<div class=" clearfix" style="color:#333;font-size:0.375rem">';
											if(arryList[i].MarketPrice > 10000) {
												var MarketPrice = (arryList[i].MarketPrice) / 10000;
												str += '<div class="fl">新车:<span>' + MarketPrice + '</span>万漫豆</div></div>';
											} else {
												str += '<div class="fl">新车:<span>' + arryList[i].MarketPrice + '漫豆</span></div></div>';
											};

											str += '</div></a></li>';
										}
										str += '</ul></div></div>';

										$(".tab_list .con").eq(index - 1).find(".teb_li .loading_more").before(str);

										$(".tab_list .con").eq(index - 1).find(".teb_li").attr("bool-page", false);
										var bd = document.getElementById("tabBox1-bd");
										$(".tab_list .con").eq(index - 1).find(".loading_more").show();
										$(".tab_list .con").eq(index - 1).find(".loading_more .loading-time").hide();
										$(".tab_list .con").eq(index - 1).find(".loading_more .loading_fish").show();
										var Height = $(".tab_list .con").eq(index - 1).height();
										$(".swiper-wrapper").height(Height);
									}
								}

							})
						}
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
		//取消订单
		function HandleOrder(guid, $index) {

			var $self = $(window.event.srcElement || window.event.target);
			var OperateType = ['CancelOrder', 'OverGoods', 'AgainGoods', 'ReturnMoney'];
			var OperateTxt = ['取消订单?', '确认收货?', '再次购买?', '申请退款?'];

			layer.open({
				content: OperateTxt[$index],
				btn: ['确定', '取消'],
				yes: function(index) {
					layer.close(index);
					//启动加载
					var Load = new load();
					var param = {
						MemLoginId: commom.getCookie('memlogid'),
						OperateType: OperateType[$index],
						OrderNumber: guid
					}
					// alert(JSON.stringify(param));
					$.ajax({
						url: commom.path.httpurl + "?action=OperateOrderInfo",
						method: 'post',
						dataType: "json",
						data: param,
						timeout: 1000,
						success: function(ret) {

							if(!ret.isError) {

								if($index == 2) {
									wind("cart");
									window.location.href = "webcmy/html/cart.html"
									return false;
								}
								$self.parentsUntil().eq(3).remove();
								window.location.reload();
							}
						}
					})
				}
			});
		};
		//退款失败理由
		function BackReason(str) {

			layer.open({
				content: str,
				btn: '取消'
			});
		};
		//底部加载
	})
})