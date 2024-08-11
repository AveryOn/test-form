<template>
    <div class="main">
        <formComp />
    </div>
</template>

<script setup>
import formComp from '@/components/formComp.vue';

</script>

<style scoped>
.main {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
    background-color: var(--basic-bg);
}
</style>