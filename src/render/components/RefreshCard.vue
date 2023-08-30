<template>
    <div class="reload-container">
        <el-tooltip content="洗牌" placement="left">
            <reloadIcon v-loading.fullscreen.lock="isLoading" @click="startLoading" />
        </el-tooltip>
    </div>
</template>
  
<script>
import { ref, onMounted } from 'vue';
import { ElMessage, ElLoading } from 'element-plus'; // 引入Element Plus的消息提示组件
import reloadIcon from './icon/reloadIcon.vue';
const { ipcRenderer } = require('electron');

export default {
    components: {
        reloadIcon,
    },
    setup() {
        const isLoading = ref(false);

        const startLoading = () => {
            isLoading.value = true;

            // 模拟加载持续n毫秒，然后恢复正常状态
            setTimeout(() => {
                isLoading.value = false;

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
  
<style scoped>
.reload-container {
    width: 100px;
    height: 100px;
    position: fixed;
    bottom: 30px;
    right: 30px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
</style>
  