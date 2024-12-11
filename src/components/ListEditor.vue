<template>
    <van-popup v-model:show="show" round :style="{ width: '90%' ,maxHeight:'85%'}" @closed="$emit('closed')">
        <van-cell :title="props.title" title-style="max-width:100%;">
            <template #right-icon>
                <van-icon size="1.2rem" name="plus" @click="addList"/>
            </template>
        </van-cell>
        <van-list>
            <van-field v-for="(item, idx) in list" :label="idx+':'" labelWidth="1.5em" :model-value="item"
                       @update:model-value="v => editList(v, idx)">
                <template #right-icon>
                    <van-icon size="1rem" name="cross" @click="deleteList(idx)"/>
                </template>
            </van-field>
        </van-list>
    </van-popup>
</template>
<script setup>
const show = defineModel('show', {type: Boolean, required: true})
const list = defineModel('list', {type: Array, required: true})
const props = defineProps(['title'])
const addList = () => {
    list.value.push('')
}
const deleteList = (index) => {
    list.value.splice(index, 1)
}
const editList = (value, index) => {
    list.value[index] = value
}
</script>
