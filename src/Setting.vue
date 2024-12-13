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
            <van-cell :title="$t('setting.xrayhelper-cpu-limit')" title-style="max-width:35%;" :value="config.xrayHelper.cpuLimit.toString()"
                      clickable @click="cpuLimitEditor = true"/>
            <van-cell :title="$t('setting.xrayhelper-mem-limit')" title-style="max-width:35%;" :value="config.xrayHelper.memLimit.toString()"
                      clickable @click="memLimitEditor = true"/>
            <van-cell v-if="config.xrayHelper.coreType !== 'mihomo'" :title="$t('setting.xrayhelper-proxy-tag')" title-style="max-width:35%;" :value="config.xrayHelper.proxyTag"
                      clickable @click="proxyTagEditor = true"/>
            <van-popover v-if="config.xrayHelper.coreType !== 'mihomo'" :actions="boolc" @select="(choose) => {config.value.xrayHelper.allowInsecure = choose.value;saveConfig();}" placement="bottom-end">
                <template #reference>
                    <van-cell :title="$t('setting.xrayhelper-allow-insecure')" title-style="max-width:35%;"
                              :value="config.xrayHelper.allowInsecure.toString()" clickable/>
                    <div/>
                </template>
            </van-popover>
            <van-cell :title="$t('setting.xrayhelper-sub-list')" title-style="max-width:35%;"
                      :value="config.xrayHelper.subList.toString()" clickable @click="subListEditor = true"/>
            <van-cell :title="$t('setting.xrayhelper-user-agent')" title-style="max-width:35%;" :value="config.xrayHelper.userAgent"
                      clickable @click="userAgentEditor = true"/>
        </van-cell-group>
        <!-- cell-group: clash options -->
        <van-cell-group v-if="config.xrayHelper.coreType === 'mihomo'" :title="$t('setting.clash')" inset>
            <van-cell :title="$t('setting.clash-dns-port')" title-style="max-width:35%;" :value="config.clash.dnsPort.toString()"
                      clickable @click="clashDnsPortEditor = true"/>
            <van-cell :title="$t('setting.clash-template')" title-style="max-width:35%;" :value="config.clash.template"
                      clickable @click="clashTemplateEditor = true"/>
            <van-cell :title="$t('setting.panel-url')" title-style="max-width:35%;" :value="config.clash.panelUrl"
                      clickable @click="clashApiEditor = true"/>
        </van-cell-group>
        <!-- cell-group: adgHome options -->
        <van-cell-group :title="$t('setting.adghome')" inset>
            <van-popover :actions="boolc" @select="(choose) => {config.value.adgHome.enable = choose.value;saveConfig();}" placement="bottom-end">
                <template #reference>
                    <van-cell :title="$t('setting.adghome-enable')" title-style="max-width:35%;"
                              :value="config.adgHome.enable.toString()" clickable/>
                    <div/>
                </template>
            </van-popover>
            <van-cell v-if="config.adgHome.enable" :title="$t('setting.adghome-address')" title-style="max-width:35%;" :value="config.adgHome.address"
                      clickable @click="adgHomeAddressEditor = true"/>
            <van-cell v-if="config.adgHome.enable" :title="$t('setting.adghome-work-dir')" title-style="max-width:35%;" :value="config.adgHome.workDir"
                      clickable @click="adgHomeWorkDirEditor = true"/>
            <van-cell v-if="config.adgHome.enable" :title="$t('setting.adghome-dns-port')" title-style="max-width:35%;" :value="config.adgHome.dnsPort.toString()"
                      clickable @click="adgHomeDnsPortEditor = true"/>
        </van-cell-group>
        <!-- cell-group: proxy options -->
        <van-cell-group :title="$t('setting.proxy')" inset>
            <van-popover :actions="method" @select="(m) => {config.value.proxy.method = m.value;saveConfig();}" placement="bottom-end">
                <template #reference>
                    <van-cell :title="$t('setting.proxy-method')" title-style="max-width:35%;" :value="config.proxy.method" clickable/>
                    <div/>
                </template>
            </van-popover>
            <van-cell v-if="config.proxy.method === 'tproxy'" :title="$t('setting.proxy-tproxy-port')" title-style="max-width:35%;" :value="config.proxy.tproxyPort.toString()"
                      clickable @click="tproxyPortEditor = true"/>
            <van-cell v-if="config.proxy.method === 'tun2socks'" :title="$t('setting.proxy-socks-port')" title-style="max-width:35%;" :value="config.proxy.socksPort.toString()"
                      clickable @click="socksPortEditor = true"/>
            <van-cell v-if="config.proxy.method === 'tun2socks' || config.proxy.method === 'tun'" :title="$t('setting.proxy-tun-device')" title-style="max-width:35%;" :value="config.proxy.tunDevice" clickable
                      @click="tunDeviceEditor = true"/>
            <van-popover :actions="boolc" @select="(choose) => {config.value.proxy.enableIPv6 = choose.value;saveConfig();}" placement="bottom-end">
                <template #reference>
                    <van-cell :title="$t('setting.proxy-enable-ipv6')" title-style="max-width:35%;"
                              :value="config.proxy.enableIPv6.toString()" clickable/>
                    <div/>
                </template>
            </van-popover>
            <van-popover :actions="boolc" @select="(choose) => {config.value.proxy.autoDNSStrategy = choose.value;saveConfig();}" placement="bottom-end">
                <template #reference>
                    <van-cell :title="$t('setting.proxy-auto-dns-strategy')" title-style="max-width:35%;"
                              :value="config.proxy.autoDNSStrategy.toString()" clickable/>
                    <div/>
                </template>
            </van-popover>
            <van-popover v-if="config.proxy.method !== 'tun'" :actions="mode" @select="(m) => {config.value.proxy.mode = m.value;saveConfig();}" placement="bottom-end">
                <template #reference>
                    <van-cell :title="$t('setting.proxy-mode')" title-style="max-width:35%;" :value="config.proxy.mode" clickable/>
                    <div/>
                </template>
            </van-popover>
            <van-cell v-if="config.proxy.method !== 'tun'" :title="$t('setting.proxy-pkg-list')" title-style="max-width:35%;" :value="config.proxy.pkgList.toString()"
                      clickable @click="pkgListEditor = true"/>
            <van-cell :title="$t('setting.proxy-ap-list')" title-style="max-width:35%;" :value="config.proxy.apList.toString()"
                      clickable @click="apListEditor = true"/>
            <van-cell v-if="config.proxy.method !== 'tun'" :title="$t('setting.proxy-ignore-list')" title-style="max-width:35%;" :value="config.proxy.ignoreList.toString()"
                      clickable @click="ignoreListEditor = true"/>
            <van-cell v-if="config.proxy.method !== 'tun'" :title="$t('setting.proxy-intra-list')" title-style="max-width:35%;" :value="config.proxy.intraList.toString()"
                      clickable @click="intraListEditor = true"/>
        </van-cell-group>
    </van-pull-refresh>
    <!-- xrayhelper editors -->
    <FieldEditor :label="$t('setting.xrayhelper-core-path')" tips="tips" v-model:show="corePathEditor" v-model:field="config.xrayHelper.corePath" @closed="saveConfig"/>
    <FieldEditor :label="$t('setting.xrayhelper-core-config')" tips="tips" v-model:show="coreConfigEditor" v-model:field="config.xrayHelper.coreConfig" @closed="saveConfig"/>
    <FieldEditor :label="$t('setting.xrayhelper-data-dir')" tips="tips" v-model:show="dataDirEditor" v-model:field="config.xrayHelper.dataDir" @closed="saveConfig"/>
    <FieldEditor :label="$t('setting.xrayhelper-run-dir')" tips="tips" v-model:show="runDirEditor" v-model:field="config.xrayHelper.runDir" @closed="saveConfig"/>
    <FieldEditor number :label="$t('setting.xrayhelper-cpu-limit')" tips="tips" v-model:show="cpuLimitEditor" v-model:field="config.xrayHelper.cpuLimit" @closed="saveConfig"/>
    <FieldEditor number :label="$t('setting.xrayhelper-mem-limit')" tips="tips" v-model:show="memLimitEditor" v-model:field="config.xrayHelper.memLimit" @closed="saveConfig"/>
    <FieldEditor :label="$t('setting.xrayhelper-proxy-tag')" tips="tips" v-model:show="proxyTagEditor" v-model:field="config.xrayHelper.proxyTag" @closed="saveConfig"/>
    <ListEditor :title="$t('setting.xrayhelper-sub-list')" v-model:show="subListEditor" v-model:list="config.xrayHelper.subList" @closed="saveConfig"/>
    <FieldEditor :label="$t('setting.xrayhelper-user-agent')" tips="tips" v-model:show="userAgentEditor" v-model:field="config.xrayHelper.userAgent" @closed="saveConfig"/>
    <!-- clash editors -->
    <FieldEditor number :label="$t('setting.clash-dns-port')" tips="tips" v-model:show="clashDnsPortEditor" v-model:field="config.clash.dnsPort" @closed="saveConfig"/>
    <FieldEditor :label="$t('setting.clash-template')" tips="tips" v-model:show="clashTemplateEditor" v-model:field="config.clash.template" @closed="saveConfig"/>
    <FieldEditor :label="$t('setting.panel-url')" tips="tips" v-model:show="clashApiEditor" v-model:field="config.clash.panelUrl" @closed="saveConfig"/>
    <!-- adgHome editors -->
    <FieldEditor :label="$t('setting.adghome-address')" tips="tips" v-model:show="adgHomeAddressEditor" v-model:field="config.adgHome.address" @closed="saveConfig"/>
    <FieldEditor :label="$t('setting.adghome-work-dir')" tips="tips" v-model:show="adgHomeWorkDirEditor" v-model:field="config.adgHome.workDir" @closed="saveConfig"/>
    <FieldEditor number :label="$t('setting.adghome-dns-port')" tips="tips" v-model:show="adgHomeDnsPortEditor" v-model:field="config.adgHome.dnsPort" @closed="saveConfig"/>
    <!-- proxy editors -->
    <FieldEditor number :label="$t('setting.proxy-tproxy-port')" tips="tips" v-model:show="tproxyPortEditor" v-model:field="config.proxy.tproxyPort" @closed="saveConfig"/>
    <FieldEditor number :label="$t('setting.proxy-socks-port')" tips="tips" v-model:show="socksPortEditor" v-model:field="config.proxy.socksPort" @closed="saveConfig"/>
    <FieldEditor :label="$t('setting.proxy-tun-device')" tips="tips" v-model:show="tunDeviceEditor" v-model:field="config.proxy.tunDevice" @closed="saveConfig"/>
    <ListEditor :title="$t('setting.proxy-pkg-list')" v-model:show="pkgListEditor" v-model:list="config.proxy.pkgList" @closed="saveConfig"/>
    <ListEditor :title="$t('setting.proxy-ap-list')" v-model:show="apListEditor" v-model:list="config.proxy.apList" @closed="saveConfig"/>
    <ListEditor :title="$t('setting.proxy-ignore-list')" v-model:show="ignoreListEditor" v-model:list="config.proxy.ignoreList" @closed="saveConfig"/>
    <ListEditor :title="$t('setting.proxy-intra-list')" v-model:show="intraListEditor" v-model:list="config.proxy.intraList" @closed="saveConfig"/>
    <!-- stdout receiver -->
    <StdoutReceiver v-model:show="receiver" v-model:stdout="stdout" @closed="() => this.stdout.value = ''"/>
</template>

<script setup>
import {ref} from 'vue'
import i18n from "./locales/i18n.js"
import YAML from "yaml"
import {callApi, readFile,execCmdWithExitCode,execXrayHelperCmd, saveFile, XRAYHELPER_CONFIG} from "./tools.js"
import ListEditor from "./components/ListEditor.vue";
import StdoutReceiver from "./components/StdoutReceiver.vue";
import FieldEditor from "./components/FieldEditor.vue";

defineProps(["theme"])
const loading = ref(false)
const stdout = ref(i18n.global.t('common.waiting-text'))
const receiver = ref(false)
const boolc = [
    {text: 'true', value: true},
    {text: 'false', value: false},
];
// xrayHelper
const coreType = [
    {text: 'v2ray', value: 'v2ray'},
    {text: 'xray', value: 'xray'},
    {text: 'sing-box', value: 'sing-box'},
    {text: 'mihomo', value: 'mihomo'},
    {text: 'hysteria2', value: 'hysteria2'},
];
const changeCoreType = (core) => {
    config.value.xrayHelper.coreType = core.value
    saveConfig()
    showConfirmDialog({
        message: i18n.global.t('setting.switch-core')
    }).then(() => {
        const basePath = '/data/adb/xray'
        const binPath = `${basePath}/bin/${core.value}`
        config.value.xrayHelper.corePath = binPath
        switch (core.value) {
            case 'v2ray':
                config.value.xrayHelper.coreConfig = `${basePath}/v2rayconfs/config.json`
                break;
            case 'xray':
                config.value.xrayHelper.coreConfig = `${basePath}/confs/`
                break;
            case 'sing-box':
                config.value.xrayHelper.coreConfig = `${basePath}/singconfs/`
                break;
            case 'mihomo':
                config.value.xrayHelper.coreConfig = `${basePath}/mihomoconfs/`
                config.value.clash.template = `${basePath}/mihomoconfs/template.yaml`
                break;
            case 'hysteria2':
                config.value.xrayHelper.coreConfig = `${basePath}/hy2confs/config.yaml`
                break;
            default:
                break;
        }
        saveConfig()
        checkCoreBin(binPath)
    }).catch(() => {
        () => resolve(true)
    });
}
const checkCoreBin = (corePath) => {
    execCmdWithExitCode(`ls ${corePath}`).then(errno => {
        if(errno!==0){
            showConfirmDialog({
                message: i18n.global.t('setting.core-not-found'),
            }).then(() => {
                // on close
                receiver.value = true
                setTimeout(() => {
                    execXrayHelperCmd("update core").then(value => {
                        stdout.value = value
                    })
                }, 300)
            }).catch(() => {() => resolve(true)});
        }
    })
}
const corePathEditor = ref(false)
const coreConfigEditor = ref(false)
const dataDirEditor = ref(false)
const runDirEditor = ref(false)
const cpuLimitEditor = ref(false)
const memLimitEditor = ref(false)
const proxyTagEditor = ref(false)
const subListEditor = ref(false)
const userAgentEditor = ref(false)
// clash
const clashDnsPortEditor = ref(false)
const clashTemplateEditor = ref(false)
const clashApiEditor = ref(false)
// adgHome
const adgHomeAddressEditor = ref(false)
const adgHomeWorkDirEditor = ref(false)
const adgHomeDnsPortEditor = ref(false)
// proxy
const method = [
    {text: 'tproxy', value: 'tproxy'},
    {text: 'tun', value: 'tun'},
    {text: 'tun2socks', value: 'tun2socks'},
];
const tproxyPortEditor = ref(false)
const socksPortEditor = ref(false)
const tunDeviceEditor = ref(false)
const mode = [
    {text: 'whitelist', value: 'whitelist'},
    {text: 'blacklist', value: 'blacklist'},
];
const pkgListEditor = ref(false)
const apListEditor = ref(false)
const ignoreListEditor = ref(false)
const intraListEditor = ref(false)

const config = ref()
function baseConfig() {
    return {
        xrayHelper: {
            coreType: '',
            corePath: '',
            coreConfig: '',
            dataDir: '',
            runDir: '',
            cpuLimit: 0,
            memLimit: 0,
            proxyTag: '',
            allowInsecure: false,
            subList: [],
            userAgent: '',
        },
        clash: {
            dnsPort: 0,
            template: '',
            panelUrl: ''
        },
        adgHome: {
            enable: false,
            address: '',
            workDir: '',
            dnsPort: 0
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
    setTimeout(() => {
        callApi("get status").then(value => {
            if (value.pid.length > 0) {
                execXrayHelperCmd("proxy refresh").then(() => {
                    showToast(i18n.global.t('setting.refresh-proxy'))
                })
            }
        })
    }, 50)
}
const onRefresh = () => {
    setTimeout(() => {
        initConfig()
        loading.value = false
    }, 500)
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
        Object.assign(config.value.clash, realConfig.clash)
        Object.assign(config.value.adgHome, realConfig.adgHome)
        Object.assign(config.value.proxy, realConfig.proxy)
    })
}
initConfig()
</script>
<style>
</style>
