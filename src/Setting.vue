<template>
    <van-pull-refresh v-model="loading" @refresh="onRefresh" :pulling-text="$t('common.pulling-text')"
                      :loosing-text="$t('common.loosing-text')" :loading-text="$t('common.loading-text')">
        <!-- cell-group: xrayhelper options -->
        <van-cell-group :title="$t('setting.xrayhelper')" inset>
            <van-popover :actions="coreType" @select="changeCoreType" placement="bottom-end">
                <template #reference>
                    <van-cell :title="$t('setting.xrayhelper-core-type')"
                              title-style="max-width:35%;" :value="config.xrayHelper.coreType"
                              clickable/>
                    <div/>
                </template>
            </van-popover>
            <van-cell :title="$t('setting.xrayhelper-core-path')" title-style="max-width:35%;" :value="config.xrayHelper.corePath"
                      clickable @click="corePathEditor = true"/>
            <van-cell :title="$t('setting.xrayhelper-core-config')" title-style="max-width:35%;" :value="config.xrayHelper.coreConfig"
                      clickable @click="coreConfigEditor = true"/>
            <van-cell :title="$t('setting.xrayhelper-data-dir')" title-style="max-width:35%;" :value="config.xrayHelper.dataDir"
                      clickable @click="dataDirEditor = true"/>
            <van-cell :title="$t('setting.xrayhelper-run-dir')" title-style="max-width:35%;" :value="config.xrayHelper.runDir"
                      clickable @click="runDirEditor = true"/>
            <van-cell :title="$t('setting.xrayhelper-proxy-tag')" title-style="max-width:35%;" :value="config.xrayHelper.proxyTag"
                      clickable @click="proxyTagEditor = true"/>
            <van-cell :title="$t('setting.xrayhelper-sub-list')" title-style="max-width:35%;"
                      :value="config.xrayHelper.subList.toString()" clickable @click="subListEditor = true"/>
        </van-cell-group>
        <!-- cell-group: proxy options -->
        <van-cell-group :title="$t('setting.proxy')" inset>
            <van-popover :actions="method" @select="changeMethod" placement="bottom-end">
                <template #reference>
                    <van-cell :title="$t('setting.proxy-method')" title-style="max-width:35%;" :value="config.proxy.method" clickable/>
                    <div/>
                </template>
            </van-popover>
            <van-cell :title="$t('setting.proxy-tproxy-port')" title-style="max-width:35%;" :value="config.proxy.tproxyPort.toString()"
                      clickable @click="tproxyPortEditor = true"/>
            <van-cell :title="$t('setting.proxy-socks-port')" title-style="max-width:35%;" :value="config.proxy.socksPort.toString()"
                      clickable @click="socksPortEditor = true"/>
            <van-cell :title="$t('setting.proxy-tun-device')" title-style="max-width:35%;" :value="config.proxy.tunDevice" clickable
                      @click="tunDeviceEditor = true"/>
            <van-popover :actions="boolc" @select="changeEnableIPv6" placement="bottom-end">
                <template #reference>
                    <van-cell :title="$t('setting.proxy-enable-ipv6')" title-style="max-width:35%;"
                              :value="config.proxy.enableIPv6.toString()" clickable/>
                    <div/>
                </template>
            </van-popover>
            <van-popover :actions="boolc" @select="changeAutoDNSStrategy" placement="bottom-end">
                <template #reference>
                    <van-cell :title="$t('setting.proxy-auto-dns-strategy')" title-style="max-width:35%;"
                              :value="config.proxy.autoDNSStrategy.toString()" clickable/>
                    <div/>
                </template>
            </van-popover>
            <van-popover :actions="mode" @select="changeMode" placement="bottom-end">
                <template #reference>
                    <van-cell :title="$t('setting.proxy-mode')" title-style="max-width:35%;" :value="config.proxy.mode" clickable/>
                    <div/>
                </template>
            </van-popover>
            <van-cell :title="$t('setting.proxy-pkg-list')" title-style="max-width:35%;" :value="config.proxy.pkgList.toString()"
                      clickable @click="pkgListEditor = true"/>
            <van-cell :title="$t('setting.proxy-ap-list')" title-style="max-width:35%;" :value="config.proxy.apList.toString()"
                      clickable @click="apListEditor = true"/>
            <van-cell :title="$t('setting.proxy-ignore-list')" title-style="max-width:35%;" :value="config.proxy.ignoreList.toString()"
                      clickable @click="ignoreListEditor = true"/>
            <van-cell :title="$t('setting.proxy-intra-list')" title-style="max-width:35%;" :value="config.proxy.intraList.toString()"
                      clickable @click="intraListEditor = true"/>
        </van-cell-group>
        <!-- cell-group: clash options -->
        <van-cell-group :title="$t('setting.clash')" inset>
            <van-cell :title="$t('setting.clash-dns-port')" title-style="max-width:35%;" :value="config.clash.dnsPort.toString()"
                      clickable @click="dnsPortEditor = true"/>
            <van-cell :title="$t('setting.clash-template')" title-style="max-width:35%;" :value="config.clash.template"
                      clickable @click="templateEditor = true"/>
        </van-cell-group>
    </van-pull-refresh>
    <!-- popup: xrayhelper editors -->
    <van-popup v-model:show="corePathEditor" round :style="{ width: '90%' ,maxHeight:'85%'}" @closed="saveConfig">
        <van-field class="config" :label="$t('setting.xrayhelper-core-path')" v-model="config.xrayHelper.corePath"/>
    </van-popup>
    <van-popup v-model:show="coreConfigEditor" round :style="{ width: '90%' ,maxHeight:'85%'}" @closed="saveConfig">
        <van-field class="config" :label="$t('setting.xrayhelper-core-config')" v-model="config.xrayHelper.coreConfig"/>
    </van-popup>
    <van-popup v-model:show="dataDirEditor" round :style="{ width: '90%' ,maxHeight:'85%'}" @closed="saveConfig">
        <van-field class="config" :label="$t('setting.xrayhelper-data-dir')" v-model="config.xrayHelper.dataDir"/>
    </van-popup>
    <van-popup v-model:show="runDirEditor" round :style="{ width: '90%' ,maxHeight:'85%'}" @closed="saveConfig">
        <van-field class="config" :label="$t('setting.xrayhelper-run-dir')" v-model="config.xrayHelper.runDir"/>
    </van-popup>
    <van-popup v-model:show="proxyTagEditor" round :style="{ width: '90%' ,maxHeight:'85%'}" @closed="saveConfig">
        <van-field class="config" :label="$t('setting.xrayhelper-proxy-tag')" v-model="config.xrayHelper.proxyTag"/>
    </van-popup>
    <van-popup v-model:show="subListEditor" round :style="{ width: '90%' ,maxHeight:'85%'}" @closed="saveConfig">
        <van-cell :title="$t('setting.xrayhelper-sub-list')" title-style="max-width:100%;">
            <template #right-icon>
                <van-icon size="1.2rem" name="plus" @click="addSubList"/>
            </template>
        </van-cell>
        <van-list>
            <van-field v-for="(item, idx) in config.xrayHelper.subList" :label="idx+':'" labelWidth="1.5em" :model-value="item"
                       @update:model-value="v => editSubList(v, idx)">
                <template #right-icon>
                    <van-icon size="1rem" name="cross" @click="deleteSubList(idx)"/>
                </template>
            </van-field>
        </van-list>
    </van-popup>
    <!-- popup: proxy editors -->
    <van-popup v-model:show="tproxyPortEditor" round :style="{ width: '90%' ,maxHeight:'85%'}" @closed="saveConfig">
        <van-field class="config" :label="$t('setting.proxy-tproxy-port')" v-model.number="config.proxy.tproxyPort"/>
    </van-popup>
    <van-popup v-model:show="socksPortEditor" round :style="{ width: '90%' ,maxHeight:'85%'}" @closed="saveConfig">
        <van-field class="config" :label="$t('setting.proxy-socks-port')" v-model.number="config.proxy.socksPort"/>
    </van-popup>
    <van-popup v-model:show="tunDeviceEditor" round :style="{ width: '90%' ,maxHeight:'85%'}" @closed="saveConfig">
        <van-field class="config" :label="$t('setting.proxy-tun-device')" v-model="config.proxy.tunDevice"/>
    </van-popup>
    <van-popup v-model:show="pkgListEditor" round :style="{ width: '90%' ,maxHeight:'85%'}" @closed="saveConfig">
        <van-cell :title="$t('setting.proxy-pkg-list')" title-style="max-width:100%;">
            <template #right-icon>
                <van-icon size="1.2rem" name="plus" @click="addPkgList"/>
            </template>
        </van-cell>
        <van-list>
            <van-field v-for="(item, idx) in config.proxy.pkgList" :label="idx+':'" labelWidth="1.5em" :model-value="item"
                       @update:model-value="v => editPkgList(v, idx)">
                <template #right-icon>
                    <van-icon size="1rem" name="cross" @click="deletePkgList(idx)"/>
                </template>
            </van-field>
        </van-list>
    </van-popup>
    <van-popup v-model:show="apListEditor" round :style="{ width: '90%' ,maxHeight:'85%'}" @closed="saveConfig">
        <van-cell :title="$t('setting.proxy-ap-list')" title-style="max-width:100%;">
            <template #right-icon>
                <van-icon size="1.2rem" name="plus" @click="addApList"/>
            </template>
        </van-cell>
        <van-list>
            <van-field v-for="(item, idx) in config.proxy.apList" :label="idx+':'" labelWidth="1.5em" :model-value="item"
                       @update:model-value="v => editApList(v, idx)">
                <template #right-icon>
                    <van-icon size="1rem" name="cross" @click="deleteApList(idx)"/>
                </template>
            </van-field>
        </van-list>
    </van-popup>
    <van-popup v-model:show="ignoreListEditor" round :style="{ width: '90%' ,maxHeight:'85%'}" @closed="saveConfig">
        <van-cell :title="$t('setting.proxy-ignore-list')" title-style="max-width:100%;">
            <template #right-icon>
                <van-icon size="1.2rem" name="plus" @click="addIgnoreList"/>
            </template>
        </van-cell>
        <van-list>
            <van-field v-for="(item, idx) in config.proxy.ignoreList" :label="idx+':'" labelWidth="1.5em" :model-value="item"
                       @update:model-value="v => editIgnoreList(v, idx)">
                <template #right-icon>
                    <van-icon size="1rem" name="cross" @click="deleteIgnoreList(idx)"/>
                </template>
            </van-field>
        </van-list>
    </van-popup>
    <van-popup v-model:show="intraListEditor" round :style="{ width: '90%' ,maxHeight:'85%'}" @closed="saveConfig">
        <van-cell :title="$t('setting.proxy-intra-list')" title-style="max-width:100%;">
            <template #right-icon>
                <van-icon size="1.2rem" name="plus" @click="addIntraList"/>
            </template>
        </van-cell>
        <van-list>
            <van-field v-for="(item, idx) in config.proxy.intraList" :label="idx+':'" labelWidth="1.5em" :model-value="item"
                       @update:model-value="v => editIntraList(v, idx)">
                <template #right-icon>
                    <van-icon size="1rem" name="cross" @click="deleteIntraList(idx)"/>
                </template>
            </van-field>
        </van-list>
    </van-popup>
    <!-- popup: clash editors -->
    <van-popup v-model:show="dnsPortEditor" round :style="{ width: '90%' ,maxHeight:'85%'}" @closed="saveConfig">
        <van-field class="config" :label="$t('setting.clash-dns-port')" v-model.number="config.clash.dnsPort"/>
    </van-popup>
    <van-popup v-model:show="templateEditor" round :style="{ width: '90%' ,maxHeight:'85%'}" @closed="saveConfig">
        <van-field class="config" :label="$t('setting.clash-template')" v-model="config.clash.template"/>
    </van-popup>
</template>

<script setup>
import {ref} from 'vue'
import i18n from "./locales/i18n.js"
import YAML from "yaml"
import {callApi, readFile, saveFile, XRAYHELPER_CONFIG} from "./tools.js"

defineProps(["theme"])
const loading = ref(false)
const boolc = [
    {text: 'true', value: true},
    {text: 'false', value: false},
];
const coreType = [
    {text: 'v2ray', value: 'v2ray'},
    {text: 'xray', value: 'xray'},
    {text: 'sing-box', value: 'sing-box'},
    {text: 'mihomo', value: 'mihomo'},
];
const changeCoreType = (core) => {
    config.value.xrayHelper.coreType = core.value
    saveConfig()
}
const method = [
    {text: 'tproxy', value: 'tproxy'},
    {text: 'tun', value: 'tun'},
    {text: 'tun2socks', value: 'tun2socks'},
];
const changeMethod = (method) => {
    config.value.proxy.method = method.value
    saveConfig()
}
const corePathEditor = ref(false)
const coreConfigEditor = ref(false)
const dataDirEditor = ref(false)
const runDirEditor = ref(false)
const proxyTagEditor = ref(false)
const subListEditor = ref(false)
const editSubList = (value, index) => {
    config.value.xrayHelper.subList[index] = value
}
const deleteSubList = (index) => {
    config.value.xrayHelper.subList.splice(index, 1)
}
const addSubList = () => {
    config.value.xrayHelper.subList.push('')
}
const tproxyPortEditor = ref(false)
const socksPortEditor = ref(false)
const tunDeviceEditor = ref(false)
const changeEnableIPv6 = (choose) => {
    config.value.proxy.enableIPv6 = choose.value
    saveConfig()
}
const changeAutoDNSStrategy = (choose) => {
    config.value.proxy.autoDNSStrategy = choose.value
    saveConfig()
}
const mode = [
    {text: 'whitelist', value: 'whitelist'},
    {text: 'blacklist', value: 'blacklist'},
];
const changeMode = (mode) => {
    config.value.proxy.mode = mode.value
    saveConfig()
}
const pkgListEditor = ref(false)
const editPkgList = (value, index) => {
    config.value.proxy.pkgList[index] = value
}
const deletePkgList = (index) => {
    config.value.proxy.pkgList.splice(index, 1)
}
const addPkgList = () => {
    config.value.proxy.pkgList.push('')
}
const apListEditor = ref(false)
const editApList = (value, index) => {
    config.value.proxy.apList[index] = value
}
const deleteApList = (index) => {
    config.value.proxy.apList.splice(index, 1)
}
const addApList = () => {
    config.value.proxy.apList.push('')
}
const ignoreListEditor = ref(false)
const editIgnoreList = (value, index) => {
    config.value.proxy.ignoreList[index] = value
}
const deleteIgnoreList = (index) => {
    config.value.proxy.ignoreList.splice(index, 1)
}
const addIgnoreList = () => {
    config.value.proxy.ignoreList.push('')
}
const intraListEditor = ref(false)
const editIntraList = (value, index) => {
    config.value.proxy.intraList[index] = value
}
const deleteIntraList = (index) => {
    config.value.proxy.intraList.splice(index, 1)
}
const addIntraList = () => {
    config.value.proxy.intraList.push('')
}
const dnsPortEditor = ref(false)
const templateEditor = ref(false)

const config = ref()

function baseConfig() {
    return {
        xrayHelper: {
            coreType: '',
            corePath: '',
            coreConfig: '',
            dataDir: '',
            runDir: '',
            proxyTag: '',
            subList: [],
        },
        proxy: {
            method: '',
            tproxyPort: 0,
            socksPort: 0,
            tunDevice: '',
            enableIPv6: false,
            autoDNSStrategy: false,
            mode: '',
            pkgList: [],
            apList: [],
            ignoreList: [],
            intraList: []
        },
        clash: {
            dnsPort: 0,
            template: ''
        }
    }
}

const getConfig = async () => {
    return await readFile(XRAYHELPER_CONFIG).then(value => {
        return YAML.parse(value)
    }).catch(ex => {
        showToast(i18n.global.t('setting.cannot-get-config') + ex)
    })
}

const saveConfig = () => {
    saveFile(YAML.stringify(config.value, {indent: 4}), XRAYHELPER_CONFIG)
}
const onRefresh = () => {
    setTimeout(() => {
        initConfig()
        loading.value = false
    }, 1000)
}
const initConfig = () => {
    let runningWarn = localStorage.getItem('runningWarn')
    if (typeof runningWarn != "undefined" && runningWarn != null) {
        runningWarn = JSON.parse(runningWarn)
    } else {
        runningWarn = true
        localStorage.setItem('runningWarn', 'true')
    }
    if (runningWarn) {
        callApi("get status").then(status => {
            if (typeof status.pid == "string" && status.pid.length > 0) {
                showConfirmDialog({
                    title: i18n.global.t('common.tips'),
                    message: i18n.global.t('setting.running-warn'),
                    confirmButtonText: i18n.global.t('common.confirm-text'),
                    cancelButtonText: i18n.global.t('common.ignore-text')
                }).catch(() => {
                    localStorage.setItem('runningWarn', 'false')
                })
            }
        })
    }
    config.value = baseConfig()
    getConfig().then(realConfig => {
        Object.assign(config.value.xrayHelper, realConfig.xrayHelper)
        Object.assign(config.value.proxy, realConfig.proxy)
        Object.assign(config.value.clash, realConfig.clash)
    })
}
initConfig()
</script>

<style>
.config {
    --van-field-label-width: 7em;
}
</style>
