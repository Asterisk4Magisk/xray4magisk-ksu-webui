<template>
    <!-- clash显示外部连接，xray模仿v2rayNG做一个丐版 -->
    <iframe v-if="iframeShow" :src="panelUrl" style="min-height: 85vh;min-width: 100vw;" frameborder="no" border="0"
        marginwidth="0" marginheight="0" scrolling="no" allowtransparency="yes"></iframe>
    <div v-if="xrayUIShow">
        <van-nav-bar style="top: 46px;" fixed>
            <template #left>
                <van-popover v-model:show="showPopover" :actions="actions" @select="onSelect" placement="bottom-start">
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
                        name="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxwYXRoIGZpbGw9IiMwMjg0YzciIGQ9Ik0xMSA5LjQ3VjExaDMuNzZMMTMgMTQuNTNWMTNIOS4yNHpNMTMgMUw2IDE1aDV2OGw3LTE0aC01eiIvPjwvc3ZnPg=="
                        size="1.2rem" @click="confirmSpeedtestAll()" />
                    <van-icon name="filter-o" size="1.2rem" @click="searchText = !searchText" />
                </van-space>
            </template>
        </van-nav-bar>
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh" :pulling-text="$t('common.pulling-text')"
                          :loosing-text="$t('common.loosing-text')" :loading-text="$t('common.loading-text')">
            <van-list v-model:loading="loading" :finished="finished" :finished-text="i18n.global.t('manage.no-more')"
                @load="onLoad">
                <van-checkbox-group v-model="checked">
                    <van-cell-group style="top: 46px;">
                        <van-cell v-for="(item, index) in showNodeList" :key="index" center>
                            <template #title>
                                <span class="custom-title">{{ item.remarks }}</span>
                            </template>
                            <template #label>
                                <van-space fill>
                                    <van-tag type="primary">{{ item.type }}</van-tag>
                                    <van-tag type="primary">{{ item.protocol }}</van-tag>
                                    <van-tag :color="item.color" v-show="item.show">{{ item.ping }}</van-tag>
                                </van-space>
                                <span class="custom-title">{{ item.host }}:{{ item.port }}</span>
                            </template>
                            <template #value>
                                <van-space wrap>
                                    <van-button plain hairline type="default" size="small"
                                        :loading="item.speedtestLoading" @click="clickSpeedtest(item, index)">{{ i18n.global.t('manage.speedtest') }}</van-button>
                                    <van-button plain hairline type="default" size="small" :loading="item.switchLoading"
                                        @click="switchChecked(item)">{{ item.selected? '\u0008\u0008✔\u0008\u0008':i18n.global.t('manage.switch') }}</van-button>
                                    <van-checkbox :name="index" shape="square" v-show="checkBoxShow"></van-checkbox>
                                </van-space>
                            </template>
                        </van-cell>
                        <van-back-top bottom="10vh" immediate />
                    </van-cell-group>
                </van-checkbox-group>
            </van-list>
        </van-pull-refresh>
        <!-- 负载均衡的时候出现 -->
        <!-- <van-floating-bubble icon="checked" @click="onClick" /> -->
    </div>
</template>

<script setup>
import {ref} from 'vue'
import i18n from "./locales/i18n.js"
import YAML from "yaml"
import {callApi, readFile, XRAYHELPER_CONFIG} from "./tools.js"

defineProps(["theme"])

const iframeShow = ref(false)
const nodeName = ref('')
const customNodeLength = ref(0);

const xrayUIShow = ref(false)
const checked = ref([]);
const checkBoxShow = ref(false);

const loading = ref(false);

const searchText = ref(false);
const finished = ref(false);
const refreshing = ref(false);
//
const showNodeList = ref([])
const speedTestIdList = ref([])
let allowSpeedtest = true;
const allNodeList = ref([])

const showPopover = ref(false);
const actions = [
    { text: i18n.global.t('manage.route-manage'), value: 'routing', disabled: true },
    { text: i18n.global.t('manage.load-balancing'), value: 'balancing', disabled: true },
    { text: i18n.global.t('manage.more-setting'), value: 'setting', disabled: true },
];

const panelUrl = ref('https://clash.razord.top/#/proxies')

const getConfig = async () => {
    return await readFile(XRAYHELPER_CONFIG).then(value => {
        return YAML.parse(value)
    }).catch(ex => {
        showToast(i18n.global.t('setting.cannot-get-config') + ex)
    })
}
const switchChecked = (item) => {
    item.switchLoading = true;
    //有BUG，如果在查找的情况下就会导致
    console.info('switchChecked')
    let idx = allNodeList.value.indexOf(item);
    console.info(`realIndex:${idx}`)
    const custom = item.custom;
    //设置唯一ID，用于回显选中节点(可能重复吧，按照现有的返回数据看)
    localStorage.setItem('lastSelected', item.hashId)
    //由于自定义往前排了，所以当选择的不是自定义节点的时候就需要把序号减去自定义节点的个数来确定订阅节点到选择的到底时哪个。
    // 但是显示的时候时需要按照全量索引来判断是否选中的。
    if (!custom) {
        idx -= customNodeLength.value;
    }
    let api = custom ? `set switch custom ${idx}` : `set switch ${idx}`
    callApi(api).then(value => {
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
        item.switchLoading = false
        onRefresh()
    })
}
const onLoad = () => {
    console.info('onLoad')
    if (refreshing.value) {
        showNodeList.value = [];
        allNodeList.value = [];
        refreshing.value = false;
    }
    initXrayData();
    loading.value = false;
    finished.value = true;
}

const onRefresh = () => {
    // 清空列表数据
    finished.value = false;
    // 重新加载数据
    // 将 loading 设置为 true，表示处于加载状态
    loading.value = true;
    refreshing.value = true;
    onLoad();
};
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
            showNodeList.value.splice(0, showNodeList.value.length);
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
    debugger;
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
// const bigArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
// const splitArrays = splitArray(bigArray);
// console.log(splitArrays);
// for (const ss in splitArrays) {
//     console.info(ss)
// }
const confirmSpeedtestAll = () => {
    debugger
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
    // const length = 100;
    const length = showNodeList.value.length;
    speedTestIdList.value = [...Array.from({length}, (_, index) => index)];
    await startSpeedtest();
    // console.log(splitArrays);
    //     concurrencyRequest(splitArrays, 1).then(res => {
    //         console.log(res);
    //     })
}
// 测速调用
function startSpeedtest() {
    return new Promise(() => {
        let nowTest = [...speedTestIdList.value];
        console.info('startSpeedtest')
        if (allowSpeedtest) {
            let paramIds = [];
            speedTestIdList.value.length = 0;
            for (let index of nowTest) {
                let item = showNodeList.value[index];
                item.speedtestLoading = true;
                let sIndex = index;
                if (!item.custom) {
                    sIndex -= customNodeLength.value;
                }
                //后端真实ID：显示的ID
                paramIds.push({ 'index': "" + sIndex, 'sIndex': index })
            }
            if (nowTest.length === 0) {
                allowSpeedtest = true;
                return;
            }
            allowSpeedtest = false;
            callApi(`misc realping ${nowTest.join(' ')}`).then(value => {
                const mergedArr = paramIds.map((result, obj) => {
                    return { ...result, ...value.result[obj] }
                });
                for (let result of mergedArr) {
                    let ping = -1;
                    let item = showNodeList.value[result.sIndex];
                    item.speedtestLoading = false;
                    ping = result.realping;
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
                    item.ping = `${ping} ms`;
                    item.color = color;
                    item.show = true;
                }
            }).catch(ex => {
                showToast(i18n.global.t('manage.speedtest-fail') + ex)
            }).finally(() => {
                for (let realItemId of nowTest) {
                    showNodeList.value[realItemId].speedtestLoading = false;
                }
                nowTest.length = 0;
                allowSpeedtest = true;
            })
        } else {
            for (let realItemId of nowTest) {
                showNodeList.value[realItemId].speedtestLoading = false;
            }
            showToast(i18n.global.t('manage.speedtest-reject'))
        }
    })

    //     item.speedtestLoading = false;
    //     // 调用接口设置返回值。成功才显示失败显示-1
    //     // 生成50到5000之间的随机整数
    //     const ping = Math.floor(Math.random() * (5000 - 50 + 1)) + 50;
    //     let color = '#f7f8fa';
    //     // 灰色  #f7f8fa
    //     // 蓝色  #1989fa
    //     // 绿色  #07c160
    //     // 红色 #ee0a24
    //     // 黄色 #d4b75c
    //     // 橙色 e67f3c
}
// 测速
const clickSpeedtest = (item, index) => {
    speedTestIdList.value.push(index);
    item.speedtestLoading = true;
    debounce(() => { startSpeedtest() }, 1500, false)();
    console.info('clickSpeedtest')
}
//TODO 左上角菜单，未实现
const onSelect = (action) => {
    console.info(action)
    if (action.value === 'routing') {

    } else if (action.value === 'setting') {

    } else {
        if (!checkBoxShow.value) {
            checked.value = [];
        }
        checkBoxShow.value = !checkBoxShow.value;
    }
}
//编码算法
const cyrb53 = (str, seed = 0) => {
    let h1 = 0xdeadbeef
        ^ seed,
        h2 =
            0x41c6ce57
            ^ seed;
    for (let i = 0
        , ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 =
            Math.imul(h1 ^ ch, 2654435761
            );
        h2 =
            Math.imul(h2 ^ ch, 1597334677
            );
    }

    h1 =
        Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909
        );
    h2 =
        Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909
        );

    return 4294967296 * (2097151 & h2) + (h1 >>> 0
    );
};
//将字符串转为对象
const convertObject = (arr, custom) => {
    const convertArr = [];
    const lastSelected = localStorage.getItem('lastSelected');

    for (const obj of arr) {
        // const obj = {};
        // const pairs = nodeStr.split(', ');
        // for (const pair of pairs) {
        //     const [key, value] = pair.split(': ');
        //     obj[key.split(' ')[0]] = value;
        // }
        //增加额外的属性用于展示测速信息
        obj['show'] = false;
        obj['switchLoading'] = false;
        obj['speedtestLoading'] = false;
        obj['ping'] = '-';
        obj['color'] = '#f7f8fa';
        obj['custom'] = custom;
        obj['hashId'] = cyrb53(JSON.stringify(obj));
        // TODO 可能会出现多个相同节点？
        obj['selected'] = lastSelected == obj.hashId;
        convertArr.push(obj);
    }
    return convertArr;
}
const initXrayData = async () => {
    allNodeList.value.length = 0;
    //TODO 这里不包含custom，后续可以加一下
    let nodeList = await callApi(`get switch`);
    let customNodeList = await callApi(`get switch custom`);
    if (customNodeList.length > 0) {
        const customData = convertObject(customNodeList.result, true);
        allNodeList.value.push(...customData);
        showNodeList.value.push(...customData)
        customNodeLength.value = customNodeList.length;
    }
    const nodeData = convertObject(nodeList.result, false);
    showNodeList.value.push(...nodeData)
    allNodeList.value.push(...nodeData);

    console.info('initXrayData')
}
const initStatus = () => {
    getConfig().then(realConfig => {
        let api_url = realConfig.clash.api;
        if (api_url) {
            panelUrl.value = api_url;
        }
        let coreType = realConfig.xrayHelper.coreType;
        if (coreType === "mihomo") {
            iframeShow.value = true;
        } else if (coreType === "xray"||coreType === "sing-box") {
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
    margin-right: 4px;
    vertical-align: middle;
    white-space: nowrap;
}

.search-icon {
    font-size: 16px;
    line-height: inherit;
}
</style>