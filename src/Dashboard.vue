<template>
    <van-pull-refresh v-model="loading" :disabled="disablePull" @refresh="onRefresh" :pulling-text="$t('common.pulling-text')"
                      :loosing-text="$t('common.loosing-text')" :loading-text="$t('common.loading-text')">
        <!-- cell-group version -->
        <van-cell-group :title="$t('dashboard.version')" inset>
            <van-cell :title="$t('dashboard.version-module')" title-style="max-width:35%;" :value="version"
                      url="https://github.com/Asterisk4Magisk/Xray4Magisk" clickable/>
            <van-cell :title="$t('dashboard.version-dashboard')" title-style="max-width:35%;" :value="$t('common.dashboard-version')"
                      url="https://github.com/Asterisk4Magisk/xray4magisk-ksu-webui" clickable/>
        </van-cell-group>
        <!-- cell-group status -->
        <van-cell-group :title="$t('dashboard.status')" inset>
            <van-cell :title="$t('dashboard.status-core-type')" title-style="max-width:35%;" :value="status.coreType"/>
            <van-popover :actions="serviceCmd" @select="execServiceCmd" placement="bottom-end">
                <template #reference>
                    <van-cell :title="$t('dashboard.status-core-status')" title-style="max-width:35%;" :value="coreStatus" clickable/>
                    <div/>
                </template>
            </van-popover>
            <van-cell v-show="running" :title="$t('dashboard.status-core-pid')" title-style="max-width:35%;" :value="status.pid"/>
            <van-popover :actions="proxyCmd" @select="execProxyCmd" placement="bottom-end">
                <template #reference>
                    <van-cell :title="$t('dashboard.status-method')" title-style="max-width:35%;" :value="status.method" clickable/>
                </template>
            </van-popover>
        </van-cell-group>
        <!-- cell-group tool -->
        <van-cell-group :title="$t('dashboard.tool')" inset>
            <van-space/>
            <van-row :gutter="[0, 11]" justify="space-around">
                <van-col span="11">
                    <van-button plain hairline type="default" block @click="execUpdateCmd('core')">
                        {{ $t('dashboard.tool-update-core') }}
                    </van-button>
                </van-col>
                <van-col span="11">
                    <van-button plain hairline type="default" block @click="execUpdateCmd('adghome')">
                        {{ $t('dashboard.tool-update-adghome') }}
                    </van-button>
                </van-col>
                <van-col span="11">
                    <van-button plain hairline type="default" block @click="execUpdateCmd('geodata')">
                        {{ $t('dashboard.tool-update-geodata') }}
                    </van-button>
                </van-col>
                <van-col span="11">
                    <van-button plain hairline type="default" block @click="execUpdateCmd('subscribe')">
                        {{ $t('dashboard.tool-update-subscribe') }}
                    </van-button>
                </van-col>
                <van-col span="11">
                    <van-button plain hairline type="default" block @click="execUpdateCmd('yacd-meta')">
                        {{ $t('dashboard.tool-update-yacd-meta') }}
                    </van-button>
                </van-col>
                <van-col span="11">
                    <van-button plain hairline type="default" block @click="execUpdateCmd('tun2socks')">
                        {{ $t('dashboard.tool-update-tun2socks') }}
                    </van-button>
                </van-col>
                <van-col span="11">
                    <van-button plain hairline type="default" block @click="switchClicked(false)">
                        {{ $t('dashboard.tool-switch') }}
                    </van-button>
                </van-col>
                <van-col v-show="status.coreType!=='mihomo'" span="11">
                    <van-button plain hairline type="default" block @click="switchClicked(true)">
                        {{ $t('dashboard.tool-switch-custom') }}
                    </van-button>
                </van-col>
                <van-col v-show="status.coreType!=='mihomo'" span="11">
                    <van-button plain hairline type="default" block @click="switchCustomEditClicked">
                        {{ $t('dashboard.tool-switch-custom-edit') }}
                    </van-button>
                </van-col>
            </van-row>
            <van-space/>
        </van-cell-group>
        <!-- switch chooser -->
        <van-popup v-model:show="switchChooser" round :style="{ width: '90%' ,maxHeight:'85%'}" @closed="refresh">
            <van-radio-group v-model="switchChooserChecked">
                <van-cell-group inset>
                    <van-cell v-for="(item, idx) in switchResult.result" :title="item" clickable
                              @click="switchChecked(switchCustom,idx)">
                        <template #right-icon>
                            <van-radio :name="idx.toString()"/>
                        </template>
                    </van-cell>
                </van-cell-group>
            </van-radio-group>
        </van-popup>
        <!-- switch custom editor -->
        <van-popup v-model:show="switchCustomEditor" round :style="{ width: '90%' ,maxHeight:'85%'}" @closed="saveSwitchCustom">
            <van-cell :title="$t('dashboard.tool-switch-custom-edit')" title-style="max-width:100%;">
                <template #right-icon>
                    <van-icon size="1.2rem" name="plus" @click="addSwitchCustom"/>
                </template>
            </van-cell>
            <van-list>
                <van-field v-for="(item, idx) in switchCustomResult" :label="idx+':'" labelWidth="1.5em" :model-value="item"
                           @update:model-value="v => editSwitchCustom(v, idx)">
                    <template #right-icon>
                        <van-icon size="1rem" name="cross" @click="deleteSwitchCustom(idx)"/>
                    </template>
                </van-field>
            </van-list>
        </van-popup>
        <!-- stdout receiver -->
        <van-popup v-model:show="receiver" round :style="{ width: '90%' ,minHeight:'30%',maxHeight:'85%'}" @closed="refresh">
            <van-cell :title="$t('dashboard.stdout')" title-style="max-width:100%;" size="large"/>
            <div class="stdout"><p>{{ stdout }}</p></div>
        </van-popup>
    </van-pull-refresh>
</template>

<script setup>
import {ref} from 'vue';
import {callApi, execCmd, execXrayHelperCmd, readFile, saveFile} from "./tools.js";
import i18n from "./locales/i18n.js"

defineProps(["theme"]);
const MODULE_PROP = "/data/adb/modules/xray4magisk/module.prop"
const loading = ref(false)
const disablePull = ref(false)
const running = ref(false)
const receiver = ref(false)
const switchCustom = ref(false)
const switchChooser = ref(false)
const switchChooserChecked = ref("")
const switchResult = ref({result: []})
const switchCustomResult = ref([])
const stdout = ref(i18n.global.t('common.waiting-text'))
const version = ref("")
const status = ref({api: "", coreType: "mihomo", pid: "", method: "", dataDir: ""})
const coreStatus = ref(i18n.global.t('dashboard.status-core-status-stopped'))

const switchCustomEditor = ref(false)
const switchCustomEditClicked = () => {
    readFile(`${status.value.dataDir}/custom.txt`).then(value => {
        switchCustomResult.value = value.trim().split(/\s+/)
        switchCustomEditor.value = true
    }).catch(() => {
        saveFile('', `${status.value.dataDir}/custom.txt`).then(() => {
            switchCustomEditClicked()
        })
    })
}
const editSwitchCustom = (value, index) => {
    switchCustomResult.value[index] = value
}
const deleteSwitchCustom = (index) => {
    switchCustomResult.value.splice(index, 1)
}
const addSwitchCustom = () => {
    switchCustomResult.value.push('')
}
const saveSwitchCustom = () => {
    let content = ""
    for (let v of switchCustomResult.value) {
        content = content + v + '\n'
    }
    saveFile(content, `${status.value.dataDir}/custom.txt`)
}
const serviceCmd = [
    {text: 'start', value: 'start'},
    {text: 'stop', value: 'stop'},
    {text: 'restart', value: 'restart'},
    {text: 'status', value: 'status'},
]
const execServiceCmd = (operation) => {
    receiver.value = true
    disablePull.value = true
    setTimeout(() => {
        execXrayHelperCmd("service " + operation.value).then(value => {
            stdout.value = value
        })
    }, 300)
}
const proxyCmd = [
    {text: 'enable', value: 'enable'},
    {text: 'disable', value: 'disable'},
    {text: 'refresh', value: 'refresh'},
]
const execProxyCmd = (operation) => {
    receiver.value = true
    disablePull.value = true
    setTimeout(() => {
        execXrayHelperCmd("proxy " + operation.value).then(value => {
            stdout.value = value
        })
    }, 300)
}
const execUpdateCmd = (comp) => {
    receiver.value = true
    disablePull.value = true
    setTimeout(() => {
        execXrayHelperCmd("update " + comp).then(value => {
            stdout.value = value
        })
    }, 300)
}
const switchClicked = async (custom) => {
    disablePull.value = true
    switchChooser.value = true
    switchCustom.value = custom
    switchResult.value = custom ? await callApi(`get switch custom`) : await callApi(`get switch`)
    let idx = custom ? localStorage.getItem('switchCustomIdx') : localStorage.getItem('switchIdx')
    if (typeof idx != "undefined" && idx != null) {
        switchChooserChecked.value = idx
    } else {
        switchChooserChecked.value = ""
    }
}
const switchChecked = (custom, idx) => {
    let api = custom ? `set switch custom ${idx}` : `set switch ${idx}`
    callApi(api).then(value => {
        switchChooser.value = false
        if (custom) {
            localStorage.setItem('switchCustomIdx', idx)
            localStorage.removeItem('switchIdx')
        } else {
            localStorage.setItem('switchIdx', idx)
            localStorage.removeItem('switchCustomIdx')
        }
        if (value.ok) {
            showToast(i18n.global.t('dashboard.tool-switch-success'))
        } else {
            showToast(i18n.global.t('dashboard.tool-switch-failed'))
        }
    })
}
const refresh = () => {
    version.value = ""
    status.value = {api: "", coreType: "mihomo", pid: "", method: "", dataDir: ""}
    running.value = false
    coreStatus.value = i18n.global.t('dashboard.status-core-status-stopped')
    stdout.value = i18n.global.t('common.waiting-text')
    disablePull.value = false
    initVersion()
    initStatus()
}
const onRefresh = () => {
    setTimeout(() => {
        refresh()
        loading.value = false
    }, 500)
};
const initVersion = () => {
    execCmd("grep version= " + MODULE_PROP).then(value => {
        version.value = value.split('=')[1]
    })
}
const initStatus = () => {
    callApi("get status").then(value => {
        status.value = value
        if (status.value.pid.length > 0) {
            running.value = true
            coreStatus.value = i18n.global.t('dashboard.status-core-status-running')
        }
    })
}
initVersion()
initStatus()
</script>

<style>
.stdout {
    white-space: pre-line;
    margin-left: 1em;
    margin-right: 1em;
}
</style>
