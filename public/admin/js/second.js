
; (function () {


  var page = 1
  var pageSize = 5


  function rander() {

    $.ajax({
      url: '/category/querySecondCategoryPaging',
      type: 'get',
      data: {
        page: page,
        pageSize: pageSize,
      },
      success: function (info) {
        // console.log(info);
        //使用模板引擎
        var html = template('tmp', info)

        //渲染到表格
        $('tbody').html(html)

        //设置分页
        $('.page').bootstrapPaginator({

          //指定版本
          bootstrapMajorVersion: 3,
          //指定当前分页
          currentPage: page,
          //设置总分页数
          totalPages: Math.ceil(info.total / pageSize),
          //回调函数  给按钮指定点击事件
          onPageClicked: function (a, b, c, p) {
            //p为当前页  把page赋值给当前页
            page = p
            // 重新渲染页面
            rander()
          }
        })

      }
    })
  }

  //页面加载  执行一次
  rander()


  //点击显示模态框
  $('.default .btn').on('click', function () {

    $('#secondModal').modal('show')

    //并查询一级分类数据 添加到UL的Li中
    $.ajax({
      url: '/category/queryTopCategoryPaging',
      type: 'get',
      data: {
        page: page,
        pageSize: 100
      },
      success: function (info) {
        console.log(info);

        var html = template('tpl', info)
        //渲染到页面
        $('#down').html(html)

      }
    })


  })


  //点击选中一级分类  让一级分类名称为按钮的值
  $('#down').on('click', 'li', function () {

    var val = $(this).children().text()

    //动态设置button的值
    $('#secondModal .care').text(val)

    //当选择的时候  手动设置为成功验证
    $('form')
      .data('bootstrapValidator')
      .updateStatus('categoryId', 'VALID', )

    //设置categoryIdID值
    $('.categoryId').val($(this).data('id'))

  })

  //点击上传分类  把图片设置上去

  $("#fileupload").fileupload({
    dataType: "json",
    //e：事件对象
    //data：图片上传后的对象，通过e.result.picAddr可以获取上传后的图片地址
    done: function (e, data) {
      // console.log(data);

      //获取图片的URL地址
      var src = data.result.picAddr;

      //设置给图片盒子
      $('.imgs img').attr('src', src)

      //同时给要上传的表单也保存一份
      $('.brandLogo').val(src)

      //上传成功也手动校验成功
      $('form')
        .data('bootstrapValidator')
        .updateStatus('brandLogo', 'VALID', )

    }
  })

  // /验证表单
  $('form').bootstrapValidator({
    //指定不校验类型
    excluded: [],
    //2. 指定校验时的图标显示，默认是bootstrap风格
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    //3. 指定校验字段
    fields: {
      //验证一级分类是否为空
      categoryId: {
        validators: {
          //不能为空
          notEmpty: {
            message: '请选择一级分类'
          },
        }
      },
      //验证二级分类是否为空
      brandName: {
        validators: {
          //不能为空
          notEmpty: {
            message: '请输入二级分类'
          },
        }
      },
      //验证图片是否为空
      brandLogo: {
        validators: {
          //不能为空
          notEmpty: {
            message: '请选择图片'
          },
        }
      }
    }
  })


  //添加数据  调用ajax
  $("form").on('success.form.bv', function (e) {

    e.preventDefault();
    //使用ajax提交逻辑

    $.ajax({
      url: '/category/addSecondCategory',
      type: 'post',
      data: $('form').serialize(),
      success: function (info) {
        console.log(info);

        if(info.success){
          //重新渲染页面
          rander()

          //关闭模态框
          $('#secondModal').modal('hide')

          //清空表单
          $('form')[0].reset()

          //清空校验
          $('form')
          .data('bootstrapValidator')
          .resetForm(true)

          //清空img
          $('.imgs img').attr('src','')
          
        }
      }
    })

  })


}())