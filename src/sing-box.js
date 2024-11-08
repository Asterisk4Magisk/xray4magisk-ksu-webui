export const newRuleObject = () => {
    return {
        inbound: "",
        ip_version: "",
        network: "",
        auth_user: "",
        protocol: "",
        client: "",
        domain: "",
        domain_suffix: "",
        domain_keyword: "",
        domain_regex: "",
        source_ip_cidr: "",
        source_ip_is_private: "",
        ip_cidr: "",
        ip_is_private: "",
        source_port: "",
        source_port_range: "",
        port: "",
        port_range: "",
        process_name: "",
        process_path: "",
        process_path_regex: "",
        package_name: "",
        user: "",
        user_id: "",
        wifi_ssid: "",
        wifi_bssid: "",
        rule_set: "",
        rule_set_ip_cidr_match_source: "",
        invert: "",
        outbound: ""
    }
}
export const newRulesetObject = () => {
    return {
        type: "",
        tag: "",
        format: "",
        path: "",
        url: "",
        download_detour: "",
        update_interval: "",
    }
}
export const newDnsObject = () => {
    return {
        tag: "",
        address: "",
        address_resolver: "",
        address_strategy: "",
        strategy: "",
        detour: "",
        client_subnet: ""
    }
}
export const newDnsruleObject = () => {
    return {
        inbound: "",
        ip_version: "",
        query_type: "",
        network: "",
        auth_user: "",
        protocol: "",
        domain: "",
        domain_suffix: "",
        domain_keyword: "",
        domain_regex: "",
        source_ip_cidr: "",
        source_ip_is_private: "",
        ip_cidr: "",
        ip_is_private: "",
        source_port: "",
        source_port_range: "",
        port: "",
        port_range: "",
        process_name: "",
        process_path: "",
        process_path_regex: "",
        package_name: "",
        user: "",
        user_id: "",
        wifi_ssid: "",
        wifi_bssid: "",
        rule_set: "",
        rule_set_ip_cidr_match_source: "",
        rule_set_ip_cidr_accept_empty: "",
        invert: "",
        outbound: "",
        server: "",
        disable_cache: "",
        client_subnet: ""
    }
}
export const parseRuleObject = (rule) => {
    let result = newRuleObject()
    Object.keys(rule).forEach(key => {
        if (key === "remarks" || key === "index" || key === "newRule" || rule[key].length === 0) {
            result[key] = rule[key]
        } else {
            result[key] = rule[key].toString()
        }
    })
    return result
}
export const parseRulesetObject = (ruleset) => {
    let result = newRulesetObject()
    Object.keys(ruleset).forEach(key => {
        if (key === "index" || key === "newRuleset" || ruleset[key].length === 0) {
            result[key] = ruleset[key]
        } else {
            result[key] = ruleset[key].toString()
        }
    })
    return result
}
export const parseDnsObject = (dns) => {
    let result = newDnsObject()
    Object.keys(dns).forEach(key => {
        if (key === "index" || key === "newDns" || dns[key].length === 0) {
            result[key] = dns[key]
        } else {
            result[key] = dns[key].toString()
        }
    })
    return result
}
export const parseDnsruleObject = (rule) => {
    let result = newDnsruleObject()
    Object.keys(rule).forEach(key => {
        if (key === "index" || key === "newDnsrule" || rule[key].length === 0) {
            result[key] = rule[key]
        } else {
            result[key] = rule[key].toString()
        }
    })
    return result
}
export const standardizeRuleObject = (rule) => {
    Object.keys(rule).forEach(key => {
        if (key === "remarks" || key === "index" || key === "newRule" || rule[key].length === 0) {
            delete rule[key]
            return
        }
        if (key === "inbound") {
            let arr = rule[key].split(",")
            for (let i = 0; i < arr.length; i++) {
                arr[i] = arr[i].trim()
            }
            rule[key] = arr
            return
        }
        if (key === "ip_version") {
            rule[key] = parseInt(rule[key])
            return
        }
        if (key === "network") {
            let arr = rule[key].split(",")
            for (let i = 0; i < arr.length; i++) {
                arr[i] = arr[i].trim()
            }
            rule[key] = arr
            return
        }
        if (key === "auth_user") {
            let arr = rule[key].split(",")
            for (let i = 0; i < arr.length; i++) {
                arr[i] = arr[i].trim()
            }
            rule[key] = arr
            return
        }
        if (key === "protocol") {
            let arr = rule[key].split(",")
            for (let i = 0; i < arr.length; i++) {
                arr[i] = arr[i].trim()
            }
            rule[key] = arr
            return
        }
        if (key === "client") {
            let arr = rule[key].split(",")
            for (let i = 0; i < arr.length; i++) {
                arr[i] = arr[i].trim()
            }
            rule[key] = arr
            return
        }
        if (key === "domain") {
            let arr = rule[key].split(",")
            for (let i = 0; i < arr.length; i++) {
                arr[i] = arr[i].trim()
            }
            rule[key] = arr
            return
        }
        if (key === "domain_suffix") {
            let arr = rule[key].split(",")
            for (let i = 0; i < arr.length; i++) {
                arr[i] = arr[i].trim()
            }
            rule[key] = arr
            return
        }
        if (key === "domain_keyword") {
            let arr = rule[key].split(",")
            for (let i = 0; i < arr.length; i++) {
                arr[i] = arr[i].trim()
            }
            rule[key] = arr
            return
        }
        if (key === "domain_regex") {
            let arr = rule[key].split(",")
            for (let i = 0; i < arr.length; i++) {
                arr[i] = arr[i].trim()
            }
            rule[key] = arr
            return
        }
        if (key === "source_ip_cidr") {
            let arr = rule[key].split(",")
            for (let i = 0; i < arr.length; i++) {
                arr[i] = arr[i].trim()
            }
            rule[key] = arr
            return
        }
        if (key === "source_ip_is_private") {
            rule[key] = JSON.parse(rule[key])
            return
        }
        if (key === "ip_cidr") {
            let arr = rule[key].split(",")
            for (let i = 0; i < arr.length; i++) {
                arr[i] = arr[i].trim()
            }
            rule[key] = arr
            return
        }
        if (key === "ip_is_private") {
            rule[key] = JSON.parse(rule[key])
            return
        }
        if (key === "source_port") {
            let port = []
            for (let p of rule[key].split(",")) {
                port.push(parseInt(p.trim()))
            }
            rule[key] = port
            return
        }
        if (key === "source_port_range") {
            let arr = rule[key].split(",")
            for (let i = 0; i < arr.length; i++) {
                arr[i] = arr[i].trim()
            }
            rule[key] = arr
            return
        }
        if (key === "port") {
            let port = []
            for (let p of rule[key].split(",")) {
                port.push(parseInt(p.trim()))
            }
            rule[key] = port
            return
        }
        if (key === "port_range") {
            let arr = rule[key].split(",")
            for (let i = 0; i < arr.length; i++) {
                arr[i] = arr[i].trim()
            }
            rule[key] = arr
            return
        }
        if (key === "process_name") {
            let arr = rule[key].split(",")
            for (let i = 0; i < arr.length; i++) {
                arr[i] = arr[i].trim()
            }
            rule[key] = arr
            return
        }
        if (key === "process_path") {
            let arr = rule[key].split(",")
            for (let i = 0; i < arr.length; i++) {
                arr[i] = arr[i].trim()
            }
            rule[key] = arr
            return
        }
        if (key === "process_path_regex") {
            let arr = rule[key].split(",")
            for (let i = 0; i < arr.length; i++) {
                arr[i] = arr[i].trim()
            }
            rule[key] = arr
            return
        }
        if (key === "package_name") {
            let arr = rule[key].split(",")
            for (let i = 0; i < arr.length; i++) {
                arr[i] = arr[i].trim()
            }
            rule[key] = arr
            return
        }
        if (key === "user") {
            let arr = rule[key].split(",")
            for (let i = 0; i < arr.length; i++) {
                arr[i] = arr[i].trim()
            }
            rule[key] = arr
            return
        }
        if (key === "user_id") {
            let id = []
            for (let i of rule[key].split(",")) {
                id.push(parseInt(i.trim()))
            }
            rule[key] = id
            return
        }
        if (key === "wifi_ssid") {
            let arr = rule[key].split(",")
            for (let i = 0; i < arr.length; i++) {
                arr[i] = arr[i].trim()
            }
            rule[key] = arr
            return
        }
        if (key === "wifi_bssid") {
            let arr = rule[key].split(",")
            for (let i = 0; i < arr.length; i++) {
                arr[i] = arr[i].trim()
            }
            rule[key] = arr
            return
        }
        if (key === "rule_set") {
            let arr = rule[key].split(",")
            for (let i = 0; i < arr.length; i++) {
                arr[i] = arr[i].trim()
            }
            rule[key] = arr
            return
        }
        if (key === "rule_set_ip_cidr_match_source") {
            rule[key] = JSON.parse(rule[key])
            return
        }
        if (key === "invert") {
            rule[key] = JSON.parse(rule[key])
            return
        }
    })
}
export const standardizeRulesetObject = (ruleset) => {
    Object.keys(ruleset).forEach(key => {
        if (key === "index" || key === "newRuleset" || ruleset[key].length === 0) {
            delete ruleset[key]
        }
    })
}
export const standardizeDnsObject = (dns) => {
    Object.keys(dns).forEach(key => {
        if (key === "index" || key === "newDns" || dns[key].length === 0) {
            delete dns[key]
        }
    })
}
export const standardizeDnsruleObject = (rule) => {
    Object.keys(rule).forEach(key => {
        if (key === "index" || key === "newDnsrule" || rule[key].length === 0) {
            delete rule[key]
            return
        }
        if (key === "inbound") {
            let arr = rule[key].split(",")
            for (let i = 0; i < arr.length; i++) {
                arr[i] = arr[i].trim()
            }
            rule[key] = arr
            return
        }
        if (key === "ip_version") {
            rule[key] = parseInt(rule[key])
            return
        }
        if (key === "query_type") {
            let arr = rule[key].split(",")
            for (let i = 0; i < arr.length; i++) {
                arr[i] = arr[i].trim()
            }
            rule[key] = arr
            return
        }
        if (key === "auth_user") {
            let arr = rule[key].split(",")
            for (let i = 0; i < arr.length; i++) {
                arr[i] = arr[i].trim()
            }
            rule[key] = arr
            return
        }
        if (key === "protocol") {
            let arr = rule[key].split(",")
            for (let i = 0; i < arr.length; i++) {
                arr[i] = arr[i].trim()
            }
            rule[key] = arr
            return
        }
        if (key === "domain") {
            let arr = rule[key].split(",")
            for (let i = 0; i < arr.length; i++) {
                arr[i] = arr[i].trim()
            }
            rule[key] = arr
            return
        }
        if (key === "domain_suffix") {
            let arr = rule[key].split(",")
            for (let i = 0; i < arr.length; i++) {
                arr[i] = arr[i].trim()
            }
            rule[key] = arr
            return
        }
        if (key === "domain_keyword") {
            let arr = rule[key].split(",")
            for (let i = 0; i < arr.length; i++) {
                arr[i] = arr[i].trim()
            }
            rule[key] = arr
            return
        }
        if (key === "domain_regex") {
            let arr = rule[key].split(",")
            for (let i = 0; i < arr.length; i++) {
                arr[i] = arr[i].trim()
            }
            rule[key] = arr
            return
        }
        if (key === "source_ip_cidr") {
            let arr = rule[key].split(",")
            for (let i = 0; i < arr.length; i++) {
                arr[i] = arr[i].trim()
            }
            rule[key] = arr
            return
        }
        if (key === "source_ip_is_private") {
            rule[key] = JSON.parse(rule[key])
            return
        }
        if (key === "ip_cidr") {
            let arr = rule[key].split(",")
            for (let i = 0; i < arr.length; i++) {
                arr[i] = arr[i].trim()
            }
            rule[key] = arr
            return
        }
        if (key === "ip_is_private") {
            rule[key] = JSON.parse(rule[key])
            return
        }
        if (key === "source_port") {
            let port = []
            for (let p of rule[key].split(",")) {
                port.push(parseInt(p.trim()))
            }
            rule[key] = port
            return
        }
        if (key === "source_port_range") {
            let arr = rule[key].split(",")
            for (let i = 0; i < arr.length; i++) {
                arr[i] = arr[i].trim()
            }
            rule[key] = arr
            return
        }
        if (key === "port") {
            let port = []
            for (let p of rule[key].split(",")) {
                port.push(parseInt(p.trim()))
            }
            rule[key] = port
            return
        }
        if (key === "port_range") {
            let arr = rule[key].split(",")
            for (let i = 0; i < arr.length; i++) {
                arr[i] = arr[i].trim()
            }
            rule[key] = arr
            return
        }
        if (key === "process_name") {
            let arr = rule[key].split(",")
            for (let i = 0; i < arr.length; i++) {
                arr[i] = arr[i].trim()
            }
            rule[key] = arr
            return
        }
        if (key === "process_path") {
            let arr = rule[key].split(",")
            for (let i = 0; i < arr.length; i++) {
                arr[i] = arr[i].trim()
            }
            rule[key] = arr
            return
        }
        if (key === "process_path_regex") {
            let arr = rule[key].split(",")
            for (let i = 0; i < arr.length; i++) {
                arr[i] = arr[i].trim()
            }
            rule[key] = arr
            return
        }
        if (key === "package_name") {
            let arr = rule[key].split(",")
            for (let i = 0; i < arr.length; i++) {
                arr[i] = arr[i].trim()
            }
            rule[key] = arr
            return
        }
        if (key === "user") {
            let arr = rule[key].split(",")
            for (let i = 0; i < arr.length; i++) {
                arr[i] = arr[i].trim()
            }
            rule[key] = arr
            return
        }
        if (key === "user_id") {
            let id = []
            for (let i of rule[key].split(",")) {
                id.push(parseInt(i.trim()))
            }
            rule[key] = id
            return
        }
        if (key === "wifi_ssid") {
            let arr = rule[key].split(",")
            for (let i = 0; i < arr.length; i++) {
                arr[i] = arr[i].trim()
            }
            rule[key] = arr
            return
        }
        if (key === "wifi_bssid") {
            let arr = rule[key].split(",")
            for (let i = 0; i < arr.length; i++) {
                arr[i] = arr[i].trim()
            }
            rule[key] = arr
            return
        }
        if (key === "rule_set") {
            let arr = rule[key].split(",")
            for (let i = 0; i < arr.length; i++) {
                arr[i] = arr[i].trim()
            }
            rule[key] = arr
            return
        }
        if (key === "rule_set_ip_cidr_match_source") {
            rule[key] = JSON.parse(rule[key])
            return
        }
        if (key === "rule_set_ip_cidr_accept_empty") {
            rule[key] = JSON.parse(rule[key])
            return
        }
        if (key === "invert") {
            rule[key] = JSON.parse(rule[key])
            return
        }
        if (key === "outbound") {
            let arr = rule[key].split(",")
            for (let i = 0; i < arr.length; i++) {
                arr[i] = arr[i].trim()
            }
            rule[key] = arr
            return
        }
        if (key === "disable_cache") {
            rule[key] = JSON.parse(rule[key])
            return
        }
    })
}
