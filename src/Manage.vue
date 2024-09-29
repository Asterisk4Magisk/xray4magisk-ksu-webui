<template>
    <!-- clash显示外部连接，xray模仿v2rayNG做一个丐版 -->
    <div v-if="iframeShow">
        <iframe :src="panelUrl" style="min-height: 88vh;min-width: 100vw;" frameborder="no" border="0"
                marginwidth="0" marginheight="0" scrolling="no" allowtransparency="yes"></iframe>
    </div>
    <div v-if="xrayUIShow">
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
                               :placeholder="i18n.global.t('manage.placeholder-text')">
                        <template #button>
                            <!-- <van-button size="mini" type="primary" @click="searchNode(nodeName)">{{i18n.global.t('manage.search')}}</van-button> -->
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
        <van-list v-model:loading="loading" :finished="finished" :finished-text="i18n.global.t('manage.no-more')">
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
                            <van-button plain hairline type="default" size="small" :icon="item.selected?'data:image/svg+xml;base64,PHN2ZyB0PSIxNzI3NjI2OTM1ODI3IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjE2NzIyIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTgyOS40MTg2NjcgMjUzLjQxODY2N2E2NCA2NCAwIDAgMSA5My4zNzYgODcuNDI0bC0yLjg4IDMuMDcyLTQ2OS4zMzMzMzQgNDY5LjMzMzMzM2E2NCA2NCAwIDAgMS04Ny40MjQgMi44OGwtMy4wNzItMi44OC0yNTYtMjU2YTY0IDY0IDAgMCAxIDg3LjQyNC05My4zNzZsMy4wNzIgMi44OEw0MDUuMzMzMzMzIDY3Ny40ODI2NjdsNDI0LjA4NTMzNC00MjQuMDY0eiIgZmlsbD0iIzE5ODlmYSIgcC1pZD0iMTY3MjMiPjwvcGF0aD48L3N2Zz4=':'data:image/svg+xml;base64,PHN2ZyB0PSIxNzI3NjI3MDIwOTE2IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjE3NzkzIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTk2MCA1MTJjMCA4Ny43ODY2NjctMjAuNTIyNjY3IDE2Ni44MjY2NjctNTcuNjIxMzMzIDIzMy4xOTQ2NjdhNDA1LjcxNzMzMyA0MDUuNzE3MzMzIDAgMCAxLTE1Ny4xODQgMTU3LjE4NEM2NzguODQ4IDkzOS40OTg2NjcgNTk5Ljc4NjY2NyA5NjAgNTEyIDk2MGMtODcuNzg2NjY3IDAtMTY2LjgyNjY2Ny0yMC41MjI2NjctMjMzLjE5NDY2Ny01Ny42MjEzMzNBNDA1LjcxNzMzMyA0MDUuNzE3MzMzIDAgMCAxIDEyMS42IDc0NS4xOTQ2NjdDODQuNTAxMzMzIDY3OC44NDggNjQgNTk5Ljc4NjY2NyA2NCA1MTJjMC04Ny43ODY2NjcgMjAuNTIyNjY3LTE2Ni44MjY2NjcgNTcuNjIxMzMzLTIzMy4xOTQ2NjdBNDA1LjcxNzMzMyA0MDUuNzE3MzMzIDAgMCAxIDI3OC44MDUzMzMgMTIxLjZDMzQ1LjE1MiA4NC41MDEzMzMgNDI0LjIxMzMzMyA2NCA1MTIgNjRjODcuNzg2NjY3IDAgMTY2LjgyNjY2NyAyMC41MjI2NjcgMjMzLjE5NDY2NyA1Ny42MjEzMzNhNDA1LjcxNzMzMyA0MDUuNzE3MzMzIDAgMCAxIDE1Ny4xODQgMTU3LjE4NEM5MzkuNDk4NjY3IDM0NS4xNTIgOTYwIDQyNC4yMTMzMzMgOTYwIDUxMnogbS04NS4zMzMzMzMgMGMwLTcyLjAyMTMzMy0xNi4yNTYtMTM2Ljk4MTMzMy00Ni43NjI2NjctMTkxLjU3MzMzM2EzMjAuMzg0IDMyMC4zODQgMCAwIDAtMTI0LjM1Mi0xMjQuMzMwNjY3QzY0OC45ODEzMzMgMTY1LjU4OTMzMyA1ODQuMDIxMzMzIDE0OS4zMzMzMzMgNTEyIDE0OS4zMzMzMzNjLTcyLjAyMTMzMyAwLTEzNi45ODEzMzMgMTYuMjU2LTE5MS41NzMzMzMgNDYuNzYyNjY3YTMyMC4zODQgMzIwLjM4NCAwIDAgMC0xMjQuMzMwNjY3IDEyNC4zNTJDMTY1LjU4OTMzMyAzNzUuMDE4NjY3IDE0OS4zMzMzMzMgNDM5Ljk3ODY2NyAxNDkuMzMzMzMzIDUxMmMwIDcyLjAyMTMzMyAxNi4yNTYgMTM2Ljk4MTMzMyA0Ni43NjI2NjcgMTkxLjU3MzMzM2EzMjAuMzg0IDMyMC4zODQgMCAwIDAgMTI0LjM1MiAxMjQuMzMwNjY3QzM3NS4wMTg2NjcgODU4LjQxMDY2NyA0MzkuOTc4NjY3IDg3NC42NjY2NjcgNTEyIDg3NC42NjY2NjdjNzIuMDIxMzMzIDAgMTM2Ljk4MTMzMy0xNi4yNTYgMTkxLjU3MzMzMy00Ni43NjI2NjdhMzIwLjM4NCAzMjAuMzg0IDAgMCAwIDEyNC4zMzA2NjctMTI0LjM1MkM4NTguNDEwNjY3IDY0OC45ODEzMzMgODc0LjY2NjY2NyA1ODQuMDIxMzMzIDg3NC42NjY2NjcgNTEyeiIgZmlsbD0iIzE5ODlmYSIgcC1pZD0iMTc3OTQiPjwvcGF0aD48L3N2Zz4='"
                                        :loading="item.switchLoading" @click="switchChecked(item)"/>
                        </van-space>
                    </template>
                </van-cell>
                <van-back-top bottom="10vh" immediate />
            </van-cell-group>
        </van-list>
        <!-- switch custom editor -->
        <van-popup v-model:show="switchCustomEditor" round :style="{ width: '90%' ,maxHeight:'85%'}" @closed="saveSwitchCustom">
            <van-cell :title="$t('manage.edit-custom')" title-style="max-width:100%;">
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
        <!-- 负载均衡的时候出现 -->
        <!-- <van-floating-bubble icon="checked" @click="onClick" /> -->
    </div>
</template>

<script setup>
import {ref} from 'vue'
import i18n from "./locales/i18n.js"
import YAML from "yaml"
import {callApi, readFile, saveFile, XRAYHELPER_CONFIG} from "./tools.js"

defineProps(["theme"])
const panelUrl = ref('http://127.0.0.1:65532/ui');
const dataDir = ref('/data/adb/xray/data');
const iframeShow = ref(false);
const xrayUIShow = ref(false);
const showMenu = ref(false);
const actions = [
    {text: i18n.global.t('manage.edit-custom'), value: 'edit-custom', disabled: false},
    {text: i18n.global.t('manage.route-manage'), value: 'routing', disabled: true},
    {text: i18n.global.t('manage.load-balancing'), value: 'balancing', disabled: true},
    {text: i18n.global.t('manage.more-setting'), value: 'setting', disabled: true},
];
const onSelect = (action) => {
    //TODO 左上角菜单
    if (action.value === 'edit-custom') {
        showSwitchCustomEditor()
    } else if (action.value === 'routing') {

    } else if (action.value === 'setting') {

    } else {

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
    saveFile(content, `${dataDir.value}/custom.txt`)
    onLoad()
}

const switchChecked = (item) => {
    item.switchLoading = true;
    //设置唯一ID，用于回显选中节点
    localStorage.setItem('lastSelected', item.hashId)
    let api = item.custom ? `set switch custom ${item.index}` : `set switch ${item.index}`
    callApi(api).then(value => {
        if (value.ok) {
            showToast(i18n.global.t('dashboard.tool-switch-success'))
        } else {
            showToast(i18n.global.t('dashboard.tool-switch-failed'))
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
        message: i18n.global.t('manage.search'),
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
        showToast(i18n.global.t('manage.speedtest-reject'))
    } else {
        showConfirmDialog({
            message: i18n.global.t('manage.speedtest-all-warn'),
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
            showToast(i18n.global.t('manage.speedtest-failed') + ex)
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
        showToast(i18n.global.t('manage.speedtest-reject'));
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
        showToast(i18n.global.t('manage.load-switch-data-failed') + ex)
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
        showToast(i18n.global.t('setting.cannot-get-config') + ex)
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
        let coreType = realConfig.xrayHelper.coreType;
        if (coreType === "mihomo") {
            iframeShow.value = true;
        } else if (coreType === "xray" || coreType === "sing-box") {
            iframeShow.value = false;
            xrayUIShow.value = true;
            onLoad();
        } else {
            iframeShow.value = false;
            showToast(i18n.global.t('manage.not-support'))
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
    max-width: 70vw;
    text-overflow: ellipsis;
    overflow: hidden;
}

.search-icon {
    font-size: 16px;
    line-height: inherit;
}
</style>
