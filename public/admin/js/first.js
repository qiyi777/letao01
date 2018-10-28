$(function () {


  //点击显示模态框
  $('.add .btn').on('click', function () {

    $('#firstModal').modal('show')

  })


  $('form').bootstrapValidator({

    feedbackIcons: {
      valid: 'glyphicon glyphicon-thumbs-up',
      invalid: 'glyphicon glyphicon-thumbs-down',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
      control: {
        validators: {
          //为空的时候
          notEmpty: {
            message: '内容不能为空'
          }
        }
      }
    }

  })

  var page = 1
  var pageSize = 5


  function rander() {

    //页面渲染
    $.ajax({
      url: '/category/queryTopCategoryPaging',
      type: 'get',
      data: {
        page: page,
        pageSize: pageSize
      },
      success: function (info) {

        // console.log(info)

        var html = template('tmp', info)

        $('tbody').html(html)

        //分页
        $('#paginator').bootstrapPaginator({
          //指定bootstrap版本
          bootstrapMajorVersion: 3,
          //指定当前页
          currentPage: page,
          //指定总页数
          totalPages: Math.ceil(info.total / pageSize),
          onPageClicked: function (a, b, c, p) {
            page = p

            rander()

          }
        })
      }
    })
  }

  rander()


  //验证成功添加
  $("form").on('success.form.bv', function (e) {

    e.preventDefault()
    //使用ajax提交逻辑

    $.ajax({
        url: '/category/addTopCategory',
        type: 'post',
        data: $('form').serialize(),
        success: function(info){
          // console.log(info);

          if(info.success){

            //关闭模态框
            $('#firstModal').modal('hide')

            //重新渲染页面
            rander()

            //清空表单和提示消息
            $('form')[0].reset()

            $('form')
            .data('bootstrapValidator')
            .resetForm(true)

          }
        }
    })

  })

})