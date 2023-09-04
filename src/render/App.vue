<template>
  <div>
    <!-- <RefreshCard></RefreshCard> -->
    <PushCard></PushCard>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

import RefreshCard from './components/RefreshCard.vue';
import PushCard from './components/PushCard.vue';

export default defineComponent({
  name: 'Template',
  components: {
    RefreshCard,
    PushCard,
  },
  setup() {
    onMounted(() => {
    });
    return {
    };
  },
});
</script>
<style lang="scss" scoped></style>
