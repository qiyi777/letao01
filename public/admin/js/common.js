$(function () {

    //ajaxStart在开始一个ajax请求时触发
    $(document).ajaxStart(function () {
        NProgress.start()
    })

    $(document).ajaxStop(function () {
        NProgress.done()
    })


    //分类管理切换
    $('.manage').on('click', function () {
        $('.classfax').slideToggle()
    })


    //左边菜单全屏切换
    $('.justify').on('click', function () {
        $('body').toggleClass('active')
        $('.lt_left').toggleClass('active')
    })


    //右侧弹出模态框
    $('.lt_right .out').on('click', function () {
        $('#myModal').modal('show')
    })


    //点击退出后台系统  发送ajax请求
    $('#primary').on('click', function () {
        // 关闭模态框
        $('#myModal').modal('hide')
        $.ajax({
            url: '/employee/employeeLogout',
            type: 'get',
            success: function (info) {
                // console.log(info);
                if (info.success) {
                    location.href = 'login.html'
                }
            }
        })
    })


})