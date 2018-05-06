apiready = function() {

    api.setWinAttr({
        scrollEnabled: true
    });
    var systemType = api.systemType;
    if (systemType == "ios") {

        $(".equipment").css("background", '#fff');
    };

    api.showProgress({
        title: '',
        text: '加载中,请稍后...',
        modal: false
    });
    var arrList = (api.pageParam.id).split("&");

    $('.user_info img').attr("src", arrList[1]);
    $('.user_info .name').text(arrList[0]);
    $(".all_pay span").text(arrList[3]);

    var param = {
        MemLoginId: arrList[2],
        FatherMemLoginId: $api.getStorage('userData').Phone
    }

    api.ajax({
        url: httpurl + "?action=GetTeamCommission",
        method: 'get',
        dataType: "json",
        timeout: 10,
        data: {
            values: param,
        }

    }, function(ret, err) {
        // alert(ret.Msg);
        api.hideProgress();
        if (!ret.isError) {
            var arryList = JSON.parse(ret.Msg);
            var str = '';
            for (var i = 0; i < arryList.length; i++) {

                str += '<li class="list_li clearfix">';
                str += '<div class="fl">';
                str += '<div class="title_tt">' + arryList[i].ordernumber + '</div>';
                str += '<div class="time">' + arryList[i].date + '</div></div>';
                str += '<div class="fr price">￥' + arryList[i].operatemoney + '</div>';
                str += '</li>';
            };
            //  alert(str);
            $(".record .pay_list").append(str);

        } else if (err) {
          
            api.toast({
                msg: '网速不好',
                duration: 2000,
                location: 'middle'
            });
        } else {

            NodataMsg('没有相关返佣记录')
        }
    })
}
