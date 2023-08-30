<template>
    <div class="card-item" :class="type">
        <div class="card-text">{{ text }}</div>
    </div>
</template>
  
<script>
export default {
    name: 'CardsFront',
    props: {
        type: {
            type: String,
            default: '',
        },
        text: {
            type: String,
            default: '',
        },
    },
};
</script>
  
<style scoped>
.card-item {
    min-width: 140px;
    min-height: 200px;
    border-radius: 15px;
    margin-right: 50px;
    display: flex;
    justify-content: center;
    /* 水平居中 */
    align-items: center;
    /* 垂直居中 */
}

.card-text {
    font-size: 48px;
    /* 调整字号 */
    font-weight: bold;
    /* 提高字重 */
}

.banker {
    border: 6px solid #c90c0d;
    color: #c90c0d;
}

.player {
    border: 6px solid #2d2d2d;
    color: #2d2d2d;
}
</style>
  