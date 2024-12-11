<template>
    <van-popup v-model:show="show" round :style="{ width: '90%' ,maxHeight:'85%'}" @closed="$emit('closed')">
        <van-field v-if="number" :label="props.label" v-model.number="field" type="textarea" autosize rows="1" label-align="top" :placeholder="props.tips"/>
        <van-field v-if="!number" :label="props.label" v-model="field" type="textarea" autosize rows="1" label-align="top" :placeholder="props.tips"/>
    </van-popup>
</template>
<script setup>
const show = defineModel('show', {type: Boolean, required: true})
const field = defineModel('field', {required: true})
const props = defineProps({
    label: {type: String, required: true},
    tips: {type: String, default: ''},
    number: {type: Boolean, default: false},
})
</script>
