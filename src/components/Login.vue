<template>
    <div class="login">
        <div class="login_box">
            <div class="avatar_box">
                <img src="../assets/img/logo.png">
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Login"
    }
</script>

<style scoped>
    .login {
        background-color: #2b4b6b;
        height: 100%;
    }

    .login_box {
        background-color: #fff;
        width: 450px;
        height: 300px;
        border-radius: 3px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }

   .avatar_box {
       height: 130px;
       width: 130px;
       border: solid 1px #eeeeee;
       border-radius: 50%;
       padding: 10px;
       box-shadow: 0 0 10px #dddddd;
       position: absolute;
       left: 50%;
       transform: translate(-50%, -50%);
       background-color: #ffffff;
   }

    .avatar_box img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eeeeee;
    }
</style>
