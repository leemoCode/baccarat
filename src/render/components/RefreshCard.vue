<template>
    <div>
        <el-button v-loading.fullscreen.lock="isLoading" type="primary" @click="startLoading">
            洗牌
        </el-button>
    </div>
</template>
    
<script>
import { ref, onMounted } from 'vue';
import { ElMessage, ElLoading } from 'element-plus'; // 引入Element Plus的消息提示组件
const { ipcRenderer } = require('electron');

export default {
    setup() {
        const isLoading = ref(false);

        const startLoading = () => {
            isLoading.value = true;

            // 模拟加载持续2秒钟，然后恢复正常状态
            setTimeout(() => {
                isLoading.value = false;

                // 使用Element Plus进行消息提示
                ElMessage({
                    message: '洗牌完毕',
                    type: 'success',
                    duration: 800
                })
            }, 800);
        };

        // 发送请求的方法
        const sendRequest = () => {
            // 发送请求到主进程
            ipcRenderer.send('REFRESH_CARD');

            startLoading();
        };

        // 在组件加载时发送请求
        onMounted(() => {
            sendRequest();

            // 监听主进程的响应
            ipcRenderer.on('REFRESH_CARD_SUCCESS', () => {
                console.log('洗牌完毕');
            });
        });

        // 提供数据和方法给模板
        return {
            isLoading,
            startLoading,

            sendRequest,
        };
    },
};
</script>
  