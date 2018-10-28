
; (function () {

  $.ajax({

    url: '/category/queryTopCategory',
    type: 'get',
    success: function (info) {
      // console.log(info);
      $('.category_nav .nav').html(template('tmp', info))
    }

  })

  var id = 0;
  //点击a动态渲染数据
  $('.category_nav .nav').on('click', 'a', function () {
    //获取当前分类的ID
    id = $(this).data('id')

    rander(id)
    //点击让当前active为当前这个
    $(this).addClass('active').siblings().removeClass('active')

  })


  function rander(id) {

    $.ajax({
      url: '/category/querySecondCategory',
      type: 'get',
      data: {
        id: id
      },
      success: function (info) {
        console.log(info);
        //渲染数据
        $('.ulContent').html(template('tpl', info))

        //判断 当rows的长度为空时  说明这个分类无数据 提示即可
        if(info.rows.length === 0){
          $('<div class="category_tips">该分类下无更多品牌信息</div>').appendTo('.ulContent')
        }
      }
    })
  }

  rander(1)


}())