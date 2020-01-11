<template>
  <div class="login_content">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/ui2.jpg" alt="" />
      </div>
      
    </div>
  </div>
</template>
<script>
export default {}
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
</style>
