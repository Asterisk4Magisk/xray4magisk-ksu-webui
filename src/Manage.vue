<template>
    <!-- clash或者singbox显示外部连接，xray模仿v2rayNG做一个丐版 -->
    <iframe v-if="iframeShow" :src="panelUrl" style="min-height: 90vh;min-width: 100vw;"
        frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="no" allowtransparency="yes"></iframe>
    <div v-if="xrayUIShow">

    </div>
</template>

<script setup>
import { ref } from 'vue'
import i18n from "./locales/i18n.js"
import YAML from "yaml"
import { callApi, readFile, saveFile, XRAYHELPER_CONFIG } from "./tools.js"

defineProps(["theme"])
const iframeShow = ref(false)
const xrayUIShow = ref(false)
//无法使用，只能看到页面，貌似涉及到ssl证书问题，除非改ksu webview规则，不然无法解决。
const panelUrl = ref('https://clash.razord.top/#/proxies')
// xrayHelper
// const coreType = [
//     { text: 'v2ray', value: 'v2ray' },
//     { text: 'xray', value: 'xray' },
//     { text: 'sing-box', value: 'sing-box' },
//     { text: 'mihomo', value: 'mihomo' },
//     { text: 'hysteria2', value: 'hysteria2' },
// ];

const getConfig = async () => {
    return await readFile(XRAYHELPER_CONFIG).then(value => {
        return YAML.parse(value)
    }).catch(ex => {
        showToast(i18n.global.t('setting.cannot-get-config') + ex)
    })
}
const initStatus = () => {
    getConfig().then(realConfig => {
        let api_url= realConfig.clash.api;
        if(api_url){
            panelUrl.value=api_url;
        }
        let coreType = realConfig.xrayHelper.coreType;
        if (coreType === "sing-box" || coreType === "mihomo") {
            iframeShow.value = true;
        // }else if(value.coreType==="xray"){
        //     iframeShow.value=false;
        } else {
            iframeShow.value = false;
            showToast(i18n.global.t('manage.not-support'))
        }
    })

}
initStatus()

</script>
