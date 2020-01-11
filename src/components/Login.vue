<template>
  <div class="login_content">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/ui2.jpg" alt="" />
      </div>
      <el-form :model="loginForm" :rules="loginRules" ref="loginFormRef">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="el-icon-user-solid"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="el-icon-unlock" show-password></el-input>
        </el-form-item>
        <el-form-item class="btn">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 表单数据
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 表单验证规则
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 11, message: '长度在 3 到 11 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 点击重置按钮触发的函数
    resetLoginForm() {
      // 调用elementUI中的重置表单方法
      this.$refs.loginFormRef.resetFields()
    },
    // 点击登录按钮
    login() {
      // 先进行表单预验证
      this.$refs.loginFormRef.validate(async valid => {
        // valid 表示验证的结果 Boolean
        if (!valid) {
          // 如果失败
          return
        }
        // 验证成功 发送请求
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) return this.$msg.error('请输入正确的用户或密码')
        console.log(res)
        this.$msg.success('登录成功！')
        /* 
          1.将登录成功之后的token，保存到sessionStorage中
              项目中除了登录之外的其他API接口，必须在登录之后才能访问
              token只应在当前网站打开期间生效，所以保存在sessionStorage中
          2.通过编程式导航跳转到后台主页 路由地址是/home
        */
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>
<style lang="less" scoped>
.login_content {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .avatar_box {
    height: 130px;
    width: 130px;
    border: 3px solid #eee;
    border-radius: 50%;
    background-color: #eee;
    position: absolute;
    left: 50%;
    transform: translate(-50%);
    top: -50px;
    img {
      width: 100%;
      border-radius: 50%;
    }
  }
}
.btn {
  display: flex;
  justify-content: flex-end;
}
.el-form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>
