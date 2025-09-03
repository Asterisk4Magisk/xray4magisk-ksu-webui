<template>
    <!-- clash显示外部连接，xray模仿v2rayNG做一个丐版 -->
    <div v-if="coreType==='mihomo'">
        <iframe :src="panelUrl" style="min-height: 88vh;min-width: 100vw;" frameborder="no" border="0"
                marginwidth="0" marginheight="0" scrolling="no" allowtransparency="yes"></iframe>
    </div>
    <div v-if="coreType==='xray'||coreType==='sing-box'">
        <van-nav-bar style="top: 46px;" fixed>
            <template #left>
                <van-popover v-model:show="showMenu" :actions="actions" @select="onSelect" placement="bottom-start">
                    <template #reference>
                        <van-icon name="wap-nav" size="1.2rem" />
                    </template>
                </van-popover>
            </template>
            <template #title>
                <van-cell-group inset>
                    <!-- clearable 在电脑上无效，手机上好使(个人感觉没必要修复,减小打包后的体积)，解决方案，https://vant-ui.github.io/vant/#/zh-CN/advanced-usage#zhuo-mian-duan-gua-pei -->
                    <van-field v-show="searchText" v-model="nodeName" center clearable
                               :placeholder="t('manage.placeholder-text')">
                        <template #button>
                            <!-- <van-button size="mini" type="primary" @click="searchNode(nodeName)">{{t('manage.search')}}</van-button> -->
                            <van-icon name="search" size="1.1rem" @click="searchNode(nodeName)" />
                        </template>
                    </van-field>
                </van-cell-group>
            </template>
            <template #right>
                <van-space wrap>
                    <van-icon
                            name="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxwYXRoIGZpbGw9IiMxOTg5ZmEiIGQ9Ik0xMSA5LjQ3VjExaDMuNzZMMTMgMTQuNTNWMTNIOS4yNHpNMTMgMUw2IDE1aDV2OGw3LTE0aC01eiIvPjwvc3ZnPg=="
                            size="1.2rem" @click="confirmSpeedtestAll()" />
                    <van-icon name="filter-o" size="1.2rem" @click="searchText = !searchText" />
                </van-space>
            </template>
        </van-nav-bar>
        <van-list v-model:loading="loading" :finished="finished" :finished-text="t('manage.no-more')">
            <van-cell-group style="top: 46px;">
                <van-cell v-for="(item, index) in showNodeList" :key="index" center>
                    <template #title>
                        <span class="custom-title">{{ item.remarks }}</span>
                    </template>
                    <template #label>
                        <van-space fill>
                            <van-tag style="white-space: nowrap;" color='#6f3381' v-if="item.custom">Custom</van-tag>
                            <van-tag style="white-space: nowrap;" color="#1989fa">{{ item.type }}</van-tag>
                            <van-tag style="white-space: nowrap;" color="#1989fa">{{ item.protocol }}</van-tag>
                            <van-tag style="white-space: nowrap;" :color="item.color" v-if="item.show">{{ item.ping }}</van-tag>
                        </van-space>
                        <span class="custom-title">{{ item.host }}:{{ item.port }}</span>
                    </template>
                    <template #value>
                        <van-space>
                            <van-button plain hairline type="default" size="small" icon="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxwYXRoIGZpbGw9IiMxOTg5ZmEiIGQ9Ik0xMSA5LjQ3VjExaDMuNzZMMTMgMTQuNTNWMTNIOS4yNHpNMTMgMUw2IDE1aDV2OGw3LTE0aC01eiIvPjwvc3ZnPg=="
                                        :loading="item.speedtestLoading" @click="clickSpeedtest(item)"/>
                            <van-button plain hairline type="default" size="small" :icon="item.selected?'data:image/svg+xml;base64,PHN2ZyB0PSIxNzI3NjI2OTM1ODI3IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjE2NzIyIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTgyOS40MTg2NjcgMjUzLjQxODY2N2E2NCA2NCAwIDAgMSA5My4zNzYgODcuNDI0bC0yLjg4IDMuMDcyLTQ2OS4zMzMzMzQgNDY5LjMzMzMzM2E2NCA2NCAwIDAgMS04Ny40MjQgMi44OGwtMy4wNzItMi44OC0yNTYtMjU2YTY0IDY0IDAgMCAxIDg3LjQyNC05My4zNzZsMy4wNzIgMi44OEw0MDUuMzMzMzMzIDY3Ny40ODI2NjdsNDI0LjA4NTMzNC00MjQuMDY0eiIgZmlsbD0iIzAwY2MwMCIgcC1pZD0iMTY3MjMiPjwvcGF0aD48L3N2Zz4=':'data:image/svg+xml;base64,PHN2ZyB0PSIxNzI3NjI3MDIwOTE2IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjE3NzkzIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTk2MCA1MTJjMCA4Ny43ODY2NjctMjAuNTIyNjY3IDE2Ni44MjY2NjctNTcuNjIxMzMzIDIzMy4xOTQ2NjdhNDA1LjcxNzMzMyA0MDUuNzE3MzMzIDAgMCAxLTE1Ny4xODQgMTU3LjE4NEM2NzguODQ4IDkzOS40OTg2NjcgNTk5Ljc4NjY2NyA5NjAgNTEyIDk2MGMtODcuNzg2NjY3IDAtMTY2LjgyNjY2Ny0yMC41MjI2NjctMjMzLjE5NDY2Ny01Ny42MjEzMzNBNDA1LjcxNzMzMyA0MDUuNzE3MzMzIDAgMCAxIDEyMS42IDc0NS4xOTQ2NjdDODQuNTAxMzMzIDY3OC44NDggNjQgNTk5Ljc4NjY2NyA2NCA1MTJjMC04Ny43ODY2NjcgMjAuNTIyNjY3LTE2Ni44MjY2NjcgNTcuNjIxMzMzLTIzMy4xOTQ2NjdBNDA1LjcxNzMzMyA0MDUuNzE3MzMzIDAgMCAxIDI3OC44MDUzMzMgMTIxLjZDMzQ1LjE1MiA4NC41MDEzMzMgNDI0LjIxMzMzMyA2NCA1MTIgNjRjODcuNzg2NjY3IDAgMTY2LjgyNjY2NyAyMC41MjI2NjcgMjMzLjE5NDY2NyA1Ny42MjEzMzNhNDA1LjcxNzMzMyA0MDUuNzE3MzMzIDAgMCAxIDE1Ny4xODQgMTU3LjE4NEM5MzkuNDk4NjY3IDM0NS4xNTIgOTYwIDQyNC4yMTMzMzMgOTYwIDUxMnogbS04NS4zMzMzMzMgMGMwLTcyLjAyMTMzMy0xNi4yNTYtMTM2Ljk4MTMzMy00Ni43NjI2NjctMTkxLjU3MzMzM2EzMjAuMzg0IDMyMC4zODQgMCAwIDAtMTI0LjM1Mi0xMjQuMzMwNjY3QzY0OC45ODEzMzMgMTY1LjU4OTMzMyA1ODQuMDIxMzMzIDE0OS4zMzMzMzMgNTEyIDE0OS4zMzMzMzNjLTcyLjAyMTMzMyAwLTEzNi45ODEzMzMgMTYuMjU2LTE5MS41NzMzMzMgNDYuNzYyNjY3YTMyMC4zODQgMzIwLjM4NCAwIDAgMC0xMjQuMzMwNjY3IDEyNC4zNTJDMTY1LjU4OTMzMyAzNzUuMDE4NjY3IDE0OS4zMzMzMzMgNDM5Ljk3ODY2NyAxNDkuMzMzMzMzIDUxMmMwIDcyLjAyMTMzMyAxNi4yNTYgMTM2Ljk4MTMzMyA0Ni43NjI2NjcgMTkxLjU3MzMzM2EzMjAuMzg0IDMyMC4zODQgMCAwIDAgMTI0LjM1MiAxMjQuMzMwNjY3QzM3NS4wMTg2NjcgODU4LjQxMDY2NyA0MzkuOTc4NjY3IDg3NC42NjY2NjcgNTEyIDg3NC42NjY2NjdjNzIuMDIxMzMzIDAgMTM2Ljk4MTMzMy0xNi4yNTYgMTkxLjU3MzMzMy00Ni43NjI2NjdhMzIwLjM4NCAzMjAuMzg0IDAgMCAwIDEyNC4zMzA2NjctMTI0LjM1MkM4NTguNDEwNjY3IDY0OC45ODEzMzMgODc0LjY2NjY2NyA1ODQuMDIxMzMzIDg3NC42NjY2NjcgNTEyeiIgZmlsbD0iIzE5ODlmYSIgcC1pZD0iMTc3OTQiPjwvcGF0aD48L3N2Zz4='"
                                        :loading="item.switchLoading" @click="switchChecked(item)"/>
                        </van-space>
                    </template>
                </van-cell>
                <van-back-top bottom="10vh" immediate />
            </van-cell-group>
        </van-list>
        <!-- switch custom editor -->
        <ListEditor :title="t('manage.edit-custom')" v-model:show="switchCustomEditor" v-model:list="switchCustomResult" @closed="saveSwitchCustom"/>
        <!-- rule manage -->
        <van-popup v-model:show="ruleManage" round :style="{ width: '90%' ,maxHeight:'85%'}">
            <van-cell :title="t('manage.rule-manage')" title-style="max-width:100%;">
                <template #right-icon>
                    <van-icon size="1.2rem" name="plus" @click="addRule"/>
                </template>
            </van-cell>
            <van-cell-group>
                <van-cell v-for="(item, index) in ruleResult" :key="index" center>
                    <template #title>
                        <span class="custom-title">{{ item.remarks }}</span>
                    </template>
                    <template #value>
                        <van-space>
                            <van-button plain hairline type="default" size="small" icon="arrow-up" @click="exchangeRule(index,index-1)"/>
                            <van-button plain hairline type="default" size="small" icon="arrow-down" @click="exchangeRule(index,index+1)"/>
                            <van-button plain hairline type="default" size="small" icon="edit" @click="editRule(index)"/>
                            <van-button plain hairline type="default" size="small" icon="cross" @click="deleteRule(index)"/>
                        </van-space>
                    </template>
                </van-cell>
            </van-cell-group>
        </van-popup>
        <!-- rule editor -->
        <van-popup v-model:show="ruleEditor" round :style="{ width: '90%' ,maxHeight:'85%'}" @closed="saveRule">
            <van-list>
                <van-cell :title="(coreType==='xray'?'outboundTag: ':'outbound: ') + ruleResult[currentRuleResult]['remarks']"
                          title-style="max-width:100%;height:2rem;font-size:1.2rem" @click="outboundSelector = true"/>
                <van-field v-for="(value, key) in ruleField"
                           type="textarea" autosize :label="key + ':'" labelWidth="7em"
                           :model-value="value" @update:model-value="v => ruleResult[currentRuleResult][key] = v"/>
            </van-list>
        </van-popup>
        <!-- outbound selector -->
        <van-popup v-model:show="outboundSelector" round :style="{ width: '90%' ,maxHeight:'85%'}">
            <van-cell-group>
                <van-cell v-for="(item) in ruleOutbound" :title="item.remarks" clickable
                          @click="ruleOutboundSelected(item)"/>
            </van-cell-group>
        </van-popup>
        <!-- ruleset manage -->
        <van-popup v-model:show="rulesetManage" round :style="{ width: '90%' ,maxHeight:'85%'}">
            <van-cell :title="t('manage.ruleset-manage')" title-style="max-width:100%;">
                <template #right-icon>
                    <van-icon size="1.2rem" name="plus" @click="addRuleset"/>
                </template>
            </van-cell>
            <van-cell-group>
                <van-cell v-for="(item, index) in rulesetResult" :key="index" center>
                    <template #title>
                        <span class="custom-title">{{ item.tag }}</span>
                    </template>
                    <template #value>
                        <van-space>
                            <van-button plain hairline type="default" size="small" icon="edit" @click="editRuleset(index)"/>
                            <van-button plain hairline type="default" size="small" icon="cross" @click="deleteRuleset(index)"/>
                        </van-space>
                    </template>
                </van-cell>
            </van-cell-group>
        </van-popup>
        <!-- ruleset editor -->
        <van-popup v-model:show="rulesetEditor" round :style="{ width: '90%' ,maxHeight:'85%'}" @closed="saveRuleset">
            <van-list>
                <van-field v-for="(value, key) in rulesetField"
                           type="textarea" autosize :label="key + ':'" labelWidth="7em"
                           :model-value="value" @update:model-value="v => rulesetResult[currentRulesetResult][key] = v"/>
            </van-list>
        </van-popup>
        <!-- dns manage -->
        <van-popup v-model:show="dnsManage" round :style="{ width: '90%' ,maxHeight:'85%'}">
            <van-cell :title="t('manage.dns-manage')" title-style="max-width:100%;">
                <template #right-icon>
                    <van-icon size="1.2rem" name="plus" @click="addDns"/>
                </template>
            </van-cell>
            <van-cell-group>
                <van-cell v-for="(item, index) in dnsResult" :key="index" center>
                    <template #title>
                        <span class="custom-title">{{ coreType==='xray'?item.address:item.tag }}</span>
                    </template>
                    <template #value>
                        <van-space>
                            <van-button plain hairline type="default" size="small" icon="edit" @click="editDns(index)"/>
                            <van-button plain hairline type="default" size="small" icon="cross" @click="deleteDns(index)"/>
                        </van-space>
                    </template>
                </van-cell>
            </van-cell-group>
        </van-popup>
        <!-- dns editor -->
        <van-popup v-model:show="dnsEditor" round :style="{ width: '90%' ,maxHeight:'85%'}" @closed="saveDns">
            <van-list>
                <van-field v-for="(value, key) in dnsField"
                           type="textarea" autosize :label="key + ':'" labelWidth="7em"
                           :model-value="value" @update:model-value="v => dnsResult[currentDnsResult][key] = v"/>
            </van-list>
        </van-popup>
        <!-- dnsrule manage -->
        <van-popup v-model:show="dnsruleManage" round :style="{ width: '90%' ,maxHeight:'85%'}">
            <van-cell :title="t('manage.dnsrule-manage')" title-style="max-width:100%;">
                <template #right-icon>
                    <van-icon size="1.2rem" name="plus" @click="addDnsrule"/>
                </template>
            </van-cell>
            <van-cell-group>
                <van-cell v-for="(item, index) in dnsruleResult" :key="index" center>
                    <template #title>
                        <span class="custom-title">{{ item.server }}</span>
                    </template>
                    <template #value>
                        <van-space>
                            <van-button plain hairline type="default" size="small" icon="arrow-up" @click="exchangeDnsrule(index,index-1)"/>
                            <van-button plain hairline type="default" size="small" icon="arrow-down" @click="exchangeDnsrule(index,index+1)"/>
                            <van-button plain hairline type="default" size="small" icon="edit" @click="editDnsrule(index)"/>
                            <van-button plain hairline type="default" size="small" icon="cross" @click="deleteDnsrule(index)"/>
                        </van-space>
                    </template>
                </van-cell>
            </van-cell-group>
        </van-popup>
        <!-- dnsrule editor -->
        <van-popup v-model:show="dnsruleEditor" round :style="{ width: '90%' ,maxHeight:'85%'}" @closed="saveDnsrule">
            <van-list>
                <van-field v-for="(value, key) in dnsruleField"
                           type="textarea" autosize :label="key + ':'" labelWidth="7em"
                           :model-value="value" @update:model-value="v => dnsruleResult[currentDnsruleResult][key] = v"/>
            </van-list>
        </van-popup>
        <!-- 负载均衡的时候出现 -->
        <!-- <van-floating-bubble icon="checked" @click="onClick" /> -->
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
import {ref, computed} from 'vue'
import YAML from "yaml"
import {callApi, readFile, saveFile, XRAYHELPER_CONFIG} from "./tools.js"
import {
    newRuleObject as newRuleObjectXray,
    parseRuleObject as parseRuleObjectXray,
    standardizeRuleObject as standardizeRuleObjectXray,
    newDnsObject as newDnsObjectXray,
    parseDnsObject as parseDnsObjectXray,
    standardizeDnsObject as standardizeDnsObjectXray,
} from "./xray.js";
import {
    newRuleObject as newRuleObjectSingbox,
    parseRuleObject as parseRuleObjectSingbox,
    standardizeRuleObject as standardizeRuleObjectSingbox,
    newRulesetObject as newRulesetObjectSingbox,
    parseRulesetObject as parseRulesetObjectSingbox,
    standardizeRulesetObject as standardizeRulesetObjectSingbox,
    newDnsObject as newDnsObjectSingbox,
    parseDnsObject as parseDnsObjectSingbox,
    standardizeDnsObject as standardizeDnsObjectSingbox,
    newDnsruleObject as newDnsruleObjectSingbox,
    parseDnsruleObject as parseDnsruleObjectSingbox,
    standardizeDnsruleObject as standardizeDnsruleObjectSingbox,
} from "./sing-box.js";
import {Buffer} from "buffer";
import ListEditor from "./components/ListEditor.vue";

defineProps(["theme"])
const panelUrl = ref('http://127.0.0.1:65532/ui');
const dataDir = ref('/data/adb/xray/data');
const coreType = ref("")
const showMenu = ref(false);
const actions = [
    {text: t('manage.edit-custom'), value: 'edit-custom', disabled: false},
    {text: t('manage.dns-manage'), value: 'dns', disabled: false},
    {text: t('manage.rule-manage'), value: 'rule', disabled: false},
    //{text: t('manage.load-balancing'), value: 'balancing', disabled: true},
    //{text: t('manage.more-setting'), value: 'setting', disabled: true},
];
const onSelect = (action) => {
    // 左上角菜单
    if (action.value === 'edit-custom') {
        showSwitchCustomEditor()
    } else if (action.value === 'rule') {
        showRuleManage()
    } else if (action.value === 'ruleset') {
        showRulesetManage()
    } else if (action.value === 'dns') {
        showDnsManage()
    } else if (action.value === 'dnsrule') {
        showDnsruleManage()
    }
}
const loading = ref(false);
const finished = ref(false);
const nodeName = ref('')
const searchText = ref(false);

const allNodeList = ref([]);
const showNodeList = ref([]);
let allowSpeedtest = true;
const speedTestList = ref([]);
// switch custom
const switchCustomResult = ref([]);
const switchCustomEditor = ref(false);
const showSwitchCustomEditor = () => {
    readFile(`${dataDir.value}/custom.txt`).then(value => {
        switchCustomResult.value = value.trim().split(/\s+/)
        switchCustomEditor.value = true
    }).catch(() => {
        saveFile('', `${dataDir.value}/custom.txt`).then(() => {
            showSwitchCustomEditor()
        })
    })
}
const saveSwitchCustom = () => {
    let content = ""
    for (let v of switchCustomResult.value) {
        content = content + v + '\n'
    }
    saveFile(content, `${dataDir.value}/custom.txt`)
    onLoad()
}
// rule
const ruleResult = ref([])
const currentRuleResult = ref(0)
const ruleField = computed(() => {
    let result = {}
    Object.assign(result, ruleResult.value[currentRuleResult.value])
    delete result["remarks"]
    delete result["index"]
    delete result["newRule"]
    delete result["outbound"]
    delete result["outboundTag"]
    return result
})
const ruleOutbound = computed(() => {
    let result = []
    result.push({remarks: "direct(builtin)", index: "direct", virtual: true})
    result.push({remarks: "block(builtin)", index: "block", virtual: true})
    result.push({remarks: "proxy(builtin)", index: "proxy", virtual: true})
    result.push(...allNodeList.value)
    return result
})
const ruleManage = ref(false)
const ruleEditor = ref(false)
const outboundSelector = ref(false)
const showRuleManage = () => {
    ruleManage.value = true
    callApi(`get rule`).then(value => {
        ruleResult.value = value.result
        for (let i = 0; i < ruleResult.value.length; i++) {
            ruleResult.value[i].index = i
            ruleResult.value[i].newRule = false
            if (coreType.value === 'xray') {
                ruleResult.value[i] = parseRuleObjectXray(ruleResult.value[i])
                ruleResult.value[i].remarks = ruleResult.value[i].outboundTag
                if (ruleResult.value[i].outboundTag.startsWith('xrayhelper-')) {
                    let node = chooseNode(parseInt(ruleResult.value[i].outboundTag.replace('xrayhelper-', '')), false)
                    if (node) {
                        ruleResult.value[i].remarks = node.remarks
                    }
                } else if (ruleResult.value[i].outboundTag.startsWith('xrayhelpercustom-')) {
                    let node = chooseNode(parseInt(ruleResult.value[i].outboundTag.replace('xrayhelpercustom-', '')), true)
                    if (node) {
                        ruleResult.value[i].remarks = node.remarks
                    }
                }
            } else if (coreType.value === 'sing-box') {
                ruleResult.value[i] = parseRuleObjectSingbox(ruleResult.value[i])
                ruleResult.value[i].remarks = ruleResult.value[i].outbound
                if (ruleResult.value[i].outbound.startsWith('xrayhelper-')) {
                    let node = chooseNode(parseInt(ruleResult.value[i].outbound.replace('xrayhelper-', '')), false)
                    if (node) {
                        ruleResult.value[i].remarks = node.remarks
                    }
                } else if (ruleResult.value[i].outbound.startsWith('xrayhelpercustom-')) {
                    let node = chooseNode(parseInt(ruleResult.value[i].outbound.replace('xrayhelpercustom-', '')), true)
                    if (node) {
                        ruleResult.value[i].remarks = node.remarks
                    }
                }
            }
        }
    })
}
const addRule = () => {
    let rule
    if (coreType.value === 'xray') {
        rule = newRuleObjectXray()
    } else if (coreType.value === 'sing-box') {
        rule = newRuleObjectSingbox()
    }
    rule.index = ruleResult.value.length
    rule.newRule = true
    ruleResult.value.push(rule)
    editRule(ruleResult.value.length - 1)
}
const editRule = (index) => {
    currentRuleResult.value = index
    ruleEditor.value = true
}
const ruleOutboundSelected = (item) => {
    let outbound
    if (item.virtual) {
        outbound = item.index
        ruleResult.value[currentRuleResult.value].remarks = item.remarks
    } else if (item.custom) {
        outbound = "xrayhelpercustom-" + item.index
        ruleResult.value[currentRuleResult.value].remarks = chooseNode(item.index, true).remarks
    } else {
        outbound = "xrayhelper-" + item.index
        ruleResult.value[currentRuleResult.value].remarks = chooseNode(item.index, false).remarks
    }
    if (coreType.value === 'xray') {
        ruleResult.value[currentRuleResult.value].outboundTag = outbound
    } else if (coreType.value === 'sing-box') {
        ruleResult.value[currentRuleResult.value].outbound = outbound
    }
    outboundSelector.value = false
}
const exchangeRule = async (a, b) => {
    await callApi(`exchange rule ${a} ${b}`)
    showRuleManage()
}
const deleteRule = async (index) => {
    await callApi(`delete rule ${index}`)
    showRuleManage()
}
const saveRule = async () => {
    let params = []
    if (ruleResult.value[currentRuleResult.value].newRule) {
        params.push("add")
        params.push("rule")
    } else {
        params.push("set")
        params.push("rule")
        params.push(`${ruleResult.value[currentRuleResult.value].index}`)
    }
    // standardize
    if (coreType.value === 'xray') {
        standardizeRuleObjectXray(ruleResult.value[currentRuleResult.value])
    } else if (coreType.value === 'sing-box') {
        standardizeRuleObjectSingbox(ruleResult.value[currentRuleResult.value])
    }
    params.push(`${Buffer.from(JSON.stringify(ruleResult.value[currentRuleResult.value])).toString("base64")}`)
    await callApi(params)
    currentRuleResult.value = 0
    showRuleManage()
}
// ruleset
const rulesetResult = ref([])
const currentRulesetResult = ref(0)
const rulesetField = computed(() => {
    let result = {}
    Object.assign(result, rulesetResult.value[currentRulesetResult.value])
    delete result["index"]
    delete result["newRuleset"]
    return result
})
const rulesetManage = ref(false)
const rulesetEditor = ref(false)
const showRulesetManage = () => {
    rulesetManage.value = true
    callApi(`get ruleset`).then(value => {
        rulesetResult.value = value.result
        for (let i = 0; i < rulesetResult.value.length; i++) {
            rulesetResult.value[i].index = i
            rulesetResult.value[i].newRuleset = false
            rulesetResult.value[i] = parseRulesetObjectSingbox(rulesetResult.value[i])
        }
    })
}
const addRuleset = () => {
    let ruleset = newRulesetObjectSingbox()
    ruleset.index = rulesetResult.value.length
    ruleset.newRuleset = true
    rulesetResult.value.push(ruleset)
    editRuleset(rulesetResult.value.length - 1)
}
const editRuleset = (index) => {
    currentRulesetResult.value = index
    rulesetEditor.value = true
}
const deleteRuleset = async (index) => {
    await callApi(`delete ruleset ${index}`)
    showRulesetManage()
}
const saveRuleset = async () => {
    let params = []
    if (rulesetResult.value[currentRulesetResult.value].newRuleset) {
        params.push("add")
        params.push("ruleset")
    } else {
        params.push("set")
        params.push("ruleset")
        params.push(`${rulesetResult.value[currentRulesetResult.value].index}`)
    }
    // standardize
    standardizeRulesetObjectSingbox(rulesetResult.value[currentRulesetResult.value])
    params.push(`${Buffer.from(JSON.stringify(rulesetResult.value[currentRulesetResult.value])).toString("base64")}`)
    await callApi(params)
    currentRulesetResult.value = 0
    showRulesetManage()
}
// dns
const dnsResult = ref([])
const currentDnsResult = ref(0)
const dnsField = computed(() => {
    let result = {}
    Object.assign(result, dnsResult.value[currentDnsResult.value])
    delete result["index"]
    delete result["newDns"]
    return result
})
const dnsManage = ref(false)
const dnsEditor = ref(false)
const showDnsManage = () => {
    dnsManage.value = true
    callApi(`get dns`).then(value => {
        dnsResult.value = value.result
        for (let i = 0; i < dnsResult.value.length; i++) {
            if (coreType.value === "xray") {
                dnsResult.value[i] = parseDnsObjectXray(dnsResult.value[i])
            } else if (coreType.value === "sing-box") {
                dnsResult.value[i] = parseDnsObjectSingbox(dnsResult.value[i])
            }
            dnsResult.value[i].index = i
            dnsResult.value[i].newDns = false
        }
    })
}
const addDns = () => {
    let dns
    if (coreType.value === "xray") {
        dns = newDnsObjectXray()
    } else if (coreType.value === "sing-box") {
        dns = newDnsObjectSingbox()
    }
    dns.index = dnsResult.value.length
    dns.newDns = true
    dnsResult.value.push(dns)
    editDns(dnsResult.value.length - 1)
}
const editDns = (index) => {
    currentDnsResult.value = index
    dnsEditor.value = true
}
const deleteDns = async (index) => {
    await callApi(`delete dns ${index}`)
    showDnsManage()
}
const saveDns = async () => {
    let params = []
    if (dnsResult.value[currentDnsResult.value].newDns) {
        params.push("add")
        params.push("dns")
    } else {
        params.push("set")
        params.push("dns")
        params.push(`${dnsResult.value[currentDnsResult.value].index}`)
    }
    // standardize
    if (coreType.value === "xray") {
        standardizeDnsObjectXray(dnsResult.value[currentDnsResult.value])
        let k = Object.keys(dnsResult.value[currentDnsResult.value])
        if (k.length === 1 && k[0] === "address") {
            dnsResult.value[currentDnsResult.value] = dnsResult.value[currentDnsResult.value]["address"]
        }
    } else if (coreType.value === "sing-box") {
        standardizeDnsObjectSingbox(dnsResult.value[currentDnsResult.value])
    }
    params.push(`${Buffer.from(JSON.stringify(dnsResult.value[currentDnsResult.value])).toString("base64")}`)
    await callApi(params)
    currentDnsResult.value = 0
    showDnsManage()
}
// dnsrule
const dnsruleResult = ref([])
const currentDnsruleResult = ref(0)
const dnsruleField = computed(() => {
    let result = {}
    Object.assign(result, dnsruleResult.value[currentDnsruleResult.value])
    delete result["index"]
    delete result["newDnsrule"]
    return result
})
const dnsruleManage = ref(false)
const dnsruleEditor = ref(false)
const showDnsruleManage = () => {
    dnsruleManage.value = true
    callApi(`get dnsrule`).then(value => {
        dnsruleResult.value = value.result
        for (let i = 0; i < dnsruleResult.value.length; i++) {
            dnsruleResult.value[i] = parseDnsruleObjectSingbox(dnsruleResult.value[i])
            dnsruleResult.value[i].index = i
            dnsruleResult.value[i].newDnsrule = false
        }
    })
}
const addDnsrule = () => {
    let dnsrule = newDnsruleObjectSingbox()
    dnsrule.index = dnsruleResult.value.length
    dnsrule.newDnsrule = true
    dnsruleResult.value.push(dnsrule)
    editDnsrule(dnsruleResult.value.length - 1)
}
const editDnsrule = (index) => {
    currentDnsruleResult.value = index
    dnsruleEditor.value = true
}
const exchangeDnsrule = async (a, b) => {
    await callApi(`exchange dnsrule ${a} ${b}`)
    showDnsruleManage()
}
const deleteDnsrule = async (index) => {
    await callApi(`delete dnsrule ${index}`)
    showDnsruleManage()
}
const saveDnsrule = async () => {
    let params = []
    if (dnsruleResult.value[currentDnsruleResult.value].newDnsrule) {
        params.push("add")
        params.push("dnsrule")
    } else {
        params.push("set")
        params.push("dnsrule")
        params.push(`${dnsruleResult.value[currentDnsruleResult.value].index}`)
    }
    // standardize
    standardizeDnsruleObjectSingbox(dnsruleResult.value[currentDnsruleResult.value])
    params.push(`${Buffer.from(JSON.stringify(dnsruleResult.value[currentDnsruleResult.value])).toString("base64")}`)
    await callApi(params)
    currentDnsruleResult.value = 0
    showDnsruleManage()
}
// 点击切换节点按钮
const switchChecked = (item) => {
    item.switchLoading = true;
    //设置唯一ID，用于回显选中节点
    localStorage.setItem('lastSelected', item.hashId)
    let api = item.custom ? `set switch custom ${item.index}` : `set switch ${item.index}`
    callApi(api).then(value => {
        if (value.ok) {
            showToast(t('dashboard.tool-switch-success'))
        } else {
            showToast(t('dashboard.tool-switch-failed'))
        }
        for (const node of allNodeList.value) {
            if (node.selected) {
                node.selected = false
            }
        }
        item.selected = true
    }).finally(() => {
        item.switchLoading = false
    })
}
// 查找节点
const searchNode = (text) => {
    console.info('searchNode')
    showLoadingToast({
        duration: 0,
        forbidClick: true,
        message: t('manage.search'),
    });
    //不设置这个会卡一下，操作不友好，等一下下吧
    setTimeout(() => {
        try {
            console.info(`allNodeList:${allNodeList.value.length}`)
            showNodeList.value.length = 0;
            if (text === '') {
                showNodeList.value.push(...allNodeList.value);
            } else {
                const filterArr = allNodeList.value.filter(item => item.remarks.includes(text));
                showNodeList.value.push(...filterArr);
            }
            console.info(`showNodeList:${showNodeList.value.length}`)
        } catch (error) {
            console.error(error);
        }
        closeToast();
    }, 50)
}
// 选择节点
const chooseNode = (index, custom) => {
    return allNodeList.value.filter(item => item.custom === custom && item.index === index)[0]
}
// 防抖函数
let timer = null
const debounce = (func, delay = 1000, immediate = false) => {
    //闭包
    // let timer = null
    //不能用箭头函数
    return function () {
        if (timer) {
            console.info('清除定时器')
            clearTimeout(timer)
        }
        if (immediate && !timer) {
            func.apply(this, arguments)
        }
        timer = setTimeout(() => {
            func.apply(this, arguments)
        }, delay)
    }
}
const confirmSpeedtestAll = () => {
    if (!allowSpeedtest) {
        showToast(t('manage.speedtest-reject'))
    } else {
        showConfirmDialog({
            message: t('manage.speedtest-all-warn'),
        }).then(() => {
            speedtestAll()
        }).catch(() => {
            // on cancel
        });
    }
}
const speedtestAll = async () => {
    // on confirm
    const customNode = showNodeList.value.filter((node) => node.custom);
    speedTestList.value = [...customNode];
    await startSpeedtest(true);
    const subscribeNode = showNodeList.value.filter((node) => !node.custom);
    speedTestList.value = [...subscribeNode];
    await startSpeedtest(false);
}
// 测速调用
const startSpeedtest = async (custom) => {
    console.info('startSpeedtest')
    if (allowSpeedtest) {
        allowSpeedtest = false;
        let ids = [];
        let nowTest = [...speedTestList.value];
        speedTestList.value.length = 0;
        if (nowTest.length === 0) {
            allowSpeedtest = true;
            return;
        }
        for (const node of nowTest) {
            node.speedtestLoading = true;
            ids.push(node.index)
        }
        let api = custom ? `misc realping custom ${ids.join(' ')}` : `misc realping ${ids.join(' ')}`;
        await callApi(api).then(value => {
            let result = new Map(value.result.map((v) => [v.index, v.realping]));
            for (const node of nowTest) {
                node.speedtestLoading = false;
                let ping = result.get(node.index.toString());
                let color;
                if (ping === -1) {
                    color = '#646566';
                } else if (ping < 500) {
                    color = '#07c160'
                } else if (ping < 1000) {
                    color = '#d4b75c'
                } else if (ping < 2000) {
                    color = '#e67f3c'
                } else {
                    color = '#ee0a24'
                }
                node.ping = `${ping} ms`;
                node.color = color;
                node.show = true;
            }
        }).catch(ex => {
            showToast(t('manage.speedtest-failed') + ex)
        }).finally(() => {
            for (const node of nowTest) {
                node.speedtestLoading = false;
            }
            nowTest.length = 0;
            allowSpeedtest = true;
        })
    }
}
// 测速
const clickSpeedtest = (item) => {
    if (item.speedtestLoading === true || (speedTestList.value.length > 0 && speedTestList.value[0].custom !== item.custom)) {
        showToast(t('manage.speedtest-reject'));
        return;
    }
    speedTestList.value.push(item);
    item.speedtestLoading = true;
    debounce(() => {
        startSpeedtest(item.custom)
    }, 1500, false)();
    console.info('clickSpeedtest complete');
}
//编码算法
const cyrb53 = (str, seed = 0) => {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}
//将字符串转为对象
const convertObject = (arr, custom) => {
    const convertArr = [];
    const lastSelected = localStorage.getItem('lastSelected');
    for (let i = 0; i < arr.length; i++) {
        //增加额外的属性用于展示测速信息
        arr[i]['switchLoading'] = false;
        arr[i]['speedtestLoading'] = false;
        arr[i]['show'] = false;
        arr[i]['ping'] = '-';
        arr[i]['color'] = '#646566';
        arr[i]['custom'] = custom;
        arr[i]['index'] = i;
        arr[i]['hashId'] = cyrb53(JSON.stringify(arr[i]));
        arr[i]['selected'] = lastSelected == arr[i].hashId;
        convertArr.push(arr[i]);
    }
    return convertArr;
}
const initXrayData = async () => {
    await callApi(`get switch all`).then(value => {
        if (value.custom.length > 0) {
            const customData = convertObject(value.custom, true);
            allNodeList.value.push(...customData);
            showNodeList.value.push(...customData)
        }
        const nodeData = convertObject(value.result, false);
        allNodeList.value.push(...nodeData);
        showNodeList.value.push(...nodeData);
        console.info('initXrayData complete')
    }).catch(ex => {
        showToast(t('manage.load-switch-data-failed') + ex)
    })
}
const onLoad = async () => {
    console.info('onLoad');
    loading.value = true;
    finished.value = false;
    showNodeList.value = [];
    allNodeList.value = [];
    await initXrayData();
    loading.value = false;
    finished.value = true;
}
const getConfig = async () => {
    return await readFile(XRAYHELPER_CONFIG).then(value => {
        return YAML.parse(value)
    }).catch(ex => {
        showToast(t('setting.cannot-get-config') + ex)
    })
}
const initStatus = () => {
    getConfig().then(realConfig => {
        let panel_url = realConfig.clash.panelUrl;
        if (panel_url) {
            panelUrl.value = panel_url;
        }
        let data_dir = realConfig.xrayHelper.dataDir
        if (data_dir) {
            dataDir.value = data_dir;
        }
        let core_type = realConfig.xrayHelper.coreType;
        if (core_type === 'v2ray' || core_type === 'hysteria2') {
            showToast(t('manage.not-support'))
        } else if (core_type) {
            coreType.value = core_type
            if (core_type === 'sing-box') {
                actions.push({text: t('manage.dnsrule-manage'), value: 'dnsrule', disabled: false})
                actions.push({text: t('manage.ruleset-manage'), value: 'ruleset', disabled: false})
            }
            if (core_type === 'xray' || core_type === 'sing-box') {
                onLoad()
            }
        }
    })
}
initStatus()
</script>

<style>
.custom-title {
    display: inline-block;
    margin-right: 4px;
    vertical-align: middle;
    white-space: nowrap;
    max-width: 55vw;
    text-overflow: ellipsis;
    overflow: hidden;
}

.search-icon {
    font-size: 16px;
    line-height: inherit;
}
</style>
