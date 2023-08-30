<template>
    <div class="card-container">
        <player1 />
        <banker2 />
        <player3 />
        <banker4 />
    </div>
</template>
  
<script>
import player1 from './icon/player1.vue';
import player3 from './icon/player3.vue';
import banker2 from './icon/banker2.vue';
import banker4 from './icon/banker4.vue';

export default {
    name: 'CardsBack',
    components: {
        player1,
        player3,
        banker2,
        banker4,
    },
    setup() {
        return {
        };
    },
};
</script>
  
<style scoped>
.card-container {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    /* 使用 fixed 定位元素 */
    top: 50%;
    /* 垂直居中，相对于视口的 50% */
    left: 50%;
    /* 水平居中，相对于视口的 50% */
    transform: translate(-50%, -50%);
    /* 使用 transform 属性来微调元素的位置 */
    width: 80vw;
    /* 您的元素宽度 */
    height: 80vh;
    /* 您的元素高度 */
}
</style>
  