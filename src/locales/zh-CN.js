export const common = {
    'module-name': 'Xray4Magisk',
    'dashboard-version': "0.0.4-release",
    'pulling-text': '下拉即可刷新...',
    'loosing-text': '释放即可刷新...',
    'loading-text': '加载中...',
    'waiting-text': '等待中...',
    'success-text': '成功',
    'tips': '提示',
    'confirm-text': '确定',
    'ignore-text': '不再提醒',
    'dashboard': "仪表盘",
    'manage': "面板",
    'setting': "设置",
    'stdout': '输出',
}
export const dashboard = {
    'version': '版本',
    'version-module': '模块',
    'version-dashboard': '仪表盘',

    'status': '状态',
    'status-get-failed': '获取状态信息失败，发生异常。',
    'status-core-pid': "进程 ID",
    'status-core-status': "核心状态",
    'status-core-status-stopped': "停止",
    'status-core-status-running': "运行中",
    'status-core-type': '核心类型',
    'status-method': '代理方式',

    'tool': '工具',
    'tool-update-core': '更新核心',
    'tool-update-adghome': '更新 AdGuardHome',
    'tool-update-geodata': '更新 Geodata 数据',
    'tool-update-subscribe': '更新订阅',
    'tool-update-yacd-meta': '更新 Yacd-Meta',
    'tool-update-tun2socks': '更新 Tun2socks',
    'tool-switch': '切换 Clash 订阅',
    'tool-switch-success': '切换成功',
    'tool-switch-failed': '切换失败',
}
export const manage = {
    'not-support': '暂不支持当前核心',
    'no-more': '没有更多了',
    'edit-custom': '自定义节点',
    'rule-manage': '路由规则',
    'more-setting': '更多设置',
    'load-balancing': '负载均衡',
    'load-switch-data-failed': '加载节点信息失败，发生异常。',
    'remarks': '别名',
    'search': '查询中',
    'placeholder-text': '请输入别名',
    'speedtest-failed': '测试失败，发生异常。',
    'speedtest-reject': '耐心等待其他节点测试结束后再继续。',
    'speedtest-all-warn': '即将测试所有节点，以防机场封号！谨慎使用，确认继续?',
}
export const setting = {
    'xrayhelper': '配置项 - XrayHelper',
    'xrayhelper-core-type': '核心类型',
    'xrayhelper-core-path': '核心路径',
    'xrayhelper-core-config': '核心配置',
    'xrayhelper-data-dir': '数据目录',
    'xrayhelper-run-dir': '临时目录',
    'xrayhelper-cpu-limit': 'CPU 限制',
    'xrayhelper-mem-limit': '内存限制',
    'xrayhelper-proxy-tag': '出站代理标签',
    'xrayhelper-allow-insecure': '允许不安全节点',
    'xrayhelper-sub-list': '订阅地址',
    'xrayhelper-user-agent': 'User-Agent',

    'clash': '配置项 - Clash',
    'clash-dns-port': 'DNS 端口',
    'clash-template': '配置模板',
    'panel-url': '面板地址',

    'adghome': '配置项 - AdGuardHome',
    'adghome-enable': '启用',
    'adghome-address': '监听地址',
    'adghome-work-dir': '工作目录',
    'adghome-dns-port': 'DNS 端口',

    'proxy': '配置项 - Proxy',
    'proxy-method': '代理方式',
    'proxy-tproxy-port': '透明代理端口',
    'proxy-socks-port': 'Socks 代理端口',
    'proxy-tun-device': 'Tun 设备名',
    'proxy-enable-ipv6': '启用 IPv6',
    'proxy-auto-dns-strategy': '自动配置 DNS 策略',
    'proxy-mode': '应用名单模式',
    'proxy-pkg-list': '应用名单',
    'proxy-ap-list': '外部代理接口',
    'proxy-ignore-list': '忽略接口',
    'proxy-intra-list': '标记的内网地址',

    'cannot-get-config': '无法获取 XrayHelper 配置文件',
    'running-warn': '当前核心正在运行，强烈建议停止核心并停用代理后再修改此页配置',
    'switch-core': '检测到核心切换，是否同步切换为默认配置?',
    'core-not-found':'检测到当前核心不存在，是否现在开始下载?',
    'refresh-proxy':'配置文件已经重新载入。'
}