$(function(){

    //初始化插件
    $('form').bootstrapValidator({

      feedbackIcons: {
        valid: 'glyphicon glyphicon-thumbs-up',
        invalid: 'glyphicon glyphicon-thumbs-down',
        validating: 'glyphicon glyphicon-refresh'
      },
      //验证用户名
      fields: {
        username : {
          validators: {
            //为空的时候
            notEmpty : {
              message : '用户名不能为空'
            },
            stringLength : {
              min : 2,
              max : 6,
              message : '用户名长度必须在2-6位之间'
            },
            callback:{
              message : "用户名不存在"
            }
          }
        },

        password: {
          validators: {
            notEmpty: {
              message : '密码不能为空'
            },
            stringLength : {
              min : 6,
              max : 12,
              message : '密码长度必须在6-12位之间'
            },
            callback : {
              message : '密码错误'
            }
          }
        }

      }

    })

    //使用ajax验证表单

    $('form').on('success.form.bv',function(e){

        //阻止表单的默认事件
        e.preventDefault();

        $.ajax({
          url: "/employee/employeeLogin",
          type : 'post',
          data : $('form').serialize(),
          success : function(info){

            // 正确跳转
              if(info.success){
                location.href = 'index.html';
              }

              // console.log(info);
              //用户名错误
              if(info.error === 1000){
                $('form')
                .data('bootstrapValidator')
                .updateStatus('username', 'INVALID', 'callback' );
              }

              //密码错误
              if(info.error === 1001){
                $('form').data('bootstrapValidator')
                .updateStatus('password', 'INVALID', 'callback');
              }

              

          }
        })

    })


    //点击重置按钮让表单清空
    $('[type=reset]').on('click',function(){
        
        $('form')
        .data('bootstrapValidator')
        .resetForm(true);
      
    })

})