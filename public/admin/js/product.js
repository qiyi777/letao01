
$(function () {

  var page = 1
  var pageSize = 2

  function rander() {

    $.ajax({

      url: '/product/queryProductDetailList',
      type: 'get',
      data: {
        page: page,
        pageSize: pageSize
      },
      success: function (info) {
        // console.log(info);
        var html = template('tmp', info)

        //动态添加
        $('tbody').html(html)

        //设置分页
        $('#pageintor').bootstrapPaginator({
          //指定当前版本
          bootstrapMajorVersion: 3,
          //指定当前分页
          currentPage: page,
          //指定总页数
          totalPages: Math.ceil(info.total / pageSize),
          onPageClicked: function (a, b, c, p) {
            page = p
            //重新渲染页面
            rander()
          },
          //设置按钮的值
          itemTexts: function (type, page) {
            // console.log(type);
            // console.log(page);
            switch (type) {
              case 'first':
                return '首页'
              case 'last':
                return '尾页'
              case 'next':
                return '下一页'
              case 'prev':
                return '上一页'
              case 'page':
                return page
            }
          },
          //鼠标悬浮在按钮上提示消息
          tooltipTitles: function (type, page) {
            switch (type) {
              case 'first':
                return '首页'
              case 'last':
                return '尾页'
              case 'next':
                return '下一页'
              case 'prev':
                return '上一页'
              case 'page':
                return '跳转到第' + page + '页'
            }
          },
          //设置成移入小黑色的悬浮提示消息
          useBootstrapTooltip: true
        })

      }

    })
  }

  rander()

  //点击按钮  弹出模态框
  $('.add .btn').on('click', function () {

    $('#productModal').modal('show')

    //同时请求数据 渲染到二级分类框中
    $.ajax({
      url: '/category/querySecondCategoryPaging',
      type: 'get',
      data: {
        page: page,
        pageSize: 100
      },
      success: function (info) {
        console.log(info);
        var html = template('tpl', info)

        $('.ulDown').html(html)

      }
    })


  })

  //把获取的二级分类名称 追加到按钮上
  $('.ulDown').on('click', 'li', function () {
    //获取二级分类名称
    var text = $(this).children().text()

    //追加到按钮上
    $('.care').text(text)

    //获取ID添加到隐藏域中
    $('.brandId').val($(this).data('id'))

    //当点击下拉条 手动让校验变成成功的
    $('form')
    .data('bootstrapValidator')
    .updateStatus('brandId', 'VALID')

  })

  var imgs = []

  //上传图片 在图片栏展示
  $("#fileupload").fileupload({

    dataType: "json",
    //e：事件对象
    //data：图片上传后的对象，通过e.result.picAddr可以获取上传后的图片地址
    done: function (e, data) {
      console.log(data);
      //把图片的地址和图片名放入一个数组中
      imgs.push(data.result)

      //把图片信息动态添加到图片容器中
      $('<img src=' + data.result.picAddr + '>').appendTo('.imgs')

      //判断 当数组长度等于三  说明上传了三张图片  
      //这时让校验变成成功的
      if(imgs.length === 3){

        //手动让校验变成成功的
        $('form')
        .data('bootstrapValidator')
        .updateStatus('picPro', 'VALID')
      }

    }

  })

  //验证表单
  $('form').bootstrapValidator({
    //1. 指定不校验的类型，
    excluded: [],
    //2. 指定校验时的图标显示，默认是bootstrap风格
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
      //验证商品归属品牌
      brandId: {
        validators: {
          notEmpty: {
            message: '请选择二级分类'
          }
        }
      },
      //验证商品名称
      proName: {
        validators: {
          notEmpty: {
            message: '请输入商品名称'
          }
        }
      },
      //验证商品描述
      proDesc: {
        validators: {
          notEmpty: {
            message: '请输入商品描述'
          }
        }
      },
      //验证商品库存
      num: {
        validators: {
          notEmpty: {
            message: '请输入商品库存'
          },
          regexp: {
            regexp: /^[1-9][0-9]{0,3}$/,
            message: '请输入正确的商品库存(1-9999之间)'
          }
        }
      },
      //验证商品尺码
      size: {
        validators: {
          notEmpty: {
            message: '请输入商品尺码'
          },
          regexp: {
            regexp: /^(([3][2-9])|([4][0-4]))-(([3][2-9])|([4][0-4]))$/,
            message: '请输入正确的商品尺码(32-44之间)'
          }
        }
      },
      //商品原价
      oldPrice: {
        validators: {
          notEmpty: {
            message: '请输入商品原价'
          },
          regexp: {
            regexp: /^\d+$/,
            message: '请输入正确的商品原价'
          }
        }
      },
      //商品价格
      price: {
        validators: {
          notEmpty: {
            message: '请输入商品价格'
          },
          regexp: {
            regexp: /^\d+$/,
            message: '请输入正确的商品价格'
          }
        }
      },
      picPro: {
        validators: {
          notEmpty: {
            message: '请上传三张图片'
          }
        }
      }

    }
  })


  //验证成功注册事件
  $("form").on('success.form.bv', function (e) {

    e.preventDefault();
    //使用ajax提交逻辑
    //表单序列化获取所有表单数据
    var prem = $('form').serialize()

    //获取所有图片的文件地址和文件名并拼接
    prem += "&picName1="+ imgs[0].picName +"&picAddr1="+ imgs[0].picAddr
    prem += "&picName2="+ imgs[1].picName +"&picAddr2="+ imgs[1].picAddr
    prem += "&picName3="+ imgs[2].picName +"&picAddr3="+ imgs[2].picAddr

    $.ajax({
      url: '/product/addProduct',
      type: 'post',
      data: prem,
      success: function(info){
        // console.log(info);
        if(info.success){
          //重新渲染页面
          rander()

          //清空表单数据
          $('form')[0].reset()

          //清空提示数据
          $('form')
          .data('bootstrapValidator')
          .resetForm(true)

          //删除图片
          $('.imgs img').remove()

          //清空imgs数组的所有数据
          imgs = []

          //让Button的数据回到原始状态
          $('.care').text('请选择二级分类')

          //关闭模态框
          $('#productModal').modal('hide')

        }
      }
    })

  })


})