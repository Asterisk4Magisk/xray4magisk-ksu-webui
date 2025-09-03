<template>
    <van-popup v-model:show="show" round :style="{ width: '90%' ,minHeight:'30%',maxHeight:'85%'}" @closed="$emit('closed')">
        <van-cell :title="t('common.stdout')" title-style="max-width:100%;" size="large"/>
        <div class="stdout"><p>{{ stdout }}</p></div>
    </van-popup>
</template>
<script setup>
const show = defineModel('show', {type: Boolean, required: true})
const stdout = defineModel('stdout', {type: String, required: true})
</script>
<style>
.stdout {
    white-space: pre-line;
    margin-left: 1em;
    margin-right: 1em;
}
</style>