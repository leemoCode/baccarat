<template>
    <div>
        <el-button @click="sendRequest">洗牌</el-button>
    </div>
</template>
    
<script>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus'; // 引入Element Plus的消息提示组件
const { ipcRenderer } = require('electron');

export default {
    setup() {
        // 发送请求的方法
        const sendRequest = () => {
            // 发送请求到主进程
            ipcRenderer.send('REFRESH_CARD');
        };

        // 在组件加载时发送请求
        onMounted(() => {
            sendRequest();

            // 监听主进程的响应
            ipcRenderer.on('REFRESH_CARD_SUCCESS', () => {
                console.log('洗牌完毕');

                // 使用Element Plus进行消息提示
                ElMessage({
                    message: '洗牌完毕',
                    type: 'success',
                    duration: 500
                })
            });
        });

        // 提供数据和方法给模板
        return {
            sendRequest,
        };
    },
};
</script>
  