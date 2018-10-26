
$(function () {

  var page = 1
  var pageSize = 5



  function rander() {

    //使用ajax获取数据
    $.ajax({
      url: '/user/queryUser',
      type: 'get',
      data: {
        page: page,
        pageSize: pageSize
      },
      success: function (info) {
        // console.log(info)
        var html = template('tmp', info)
        // console.log(html);
        $('tbody').html(html)

        //准备页码
        $('#page').bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: page,
          totalPages: Math.ceil(info.total / pageSize),
          onPageClicked: function (a, b, c, currentPage) {
            page = currentPage
            // console.log(currentPage)
            rander()
          }

        })

      }
    })
  }

  rander()

  var id = 0
  var isDelete = 0
  //点击按钮状态改变
  $('tbody').on('click', '.btn', function () {
    // console.log(1);
    //启用模态框
    $('#userModal').modal('show')

    id = $(this).parent().data('id')
    isDelete = $(this).hasClass('btn-success') ? 1 : 0

  })


  $('.primary').on('click', function () {

    //关闭模态框
    $('#userModal').modal('hide')

    $.ajax({
      url: '/user/updateUser',
      type: 'post',
      data: {
        id: id,
        isDelete: isDelete
      },
      success: function (info) {
        console.log(info);
        rander()
      }
    })
  })




})