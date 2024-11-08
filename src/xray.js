import {newRulesetObject} from "./sing-box.js";

export const newRuleObject = () => {
    return {
        domainMatcher: "",
        type: "",
        domain: "",
        ip: "",
        port: "",
        sourcePort: "",
        network: "",
        source: "",
        user: "",
        inboundTag: "",
        protocol: "",
        outboundTag: "",
        balancerTag: "",
        ruleTag: ""
    }
}
export const newDnsObject = () => {
    return {
        address: "",
        port: "",
        domains: "",
        expectIPs: "",
        skipFallback: "",
        clientIP: ""
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
export const parseDnsObject = (dns) => {
    let result = newDnsObject()
    if (typeof dns === "string") {
        result.address = dns
    }else{
        Object.keys(dns).forEach(key => {
            if (key === "index" || key === "newDns" || dns[key].length === 0) {
                result[key] = dns[key]
            } else {
                result[key] = dns[key].toString()
            }
        })
    }
    return result
}
export const standardizeRuleObject = (rule) => {
    Object.keys(rule).forEach((key) => {
        if (key === "remarks" || key === "index" || key === "newRule" || rule[key].length === 0) {
            delete rule[key]
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
        if (key === "ip") {
            let arr = rule[key].split(",")
            for (let i = 0; i < arr.length; i++) {
                arr[i] = arr[i].trim()
            }
            rule[key] = arr
            return
        }
        if (key === "source") {
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
        if (key === "inboundTag") {
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
    })
}
export const standardizeDnsObject = (dns) => {
    Object.keys(dns).forEach(key => {
        if (key === "index" || key === "newDns" || dns[key].length === 0) {
            delete dns[key]
            return
        }
        if (key === "port") {
            dns[key] = parseInt(dns[key])
            return
        }
        if (key === "domains") {
            let arr = dns[key].split(",")
            for (let i = 0; i < arr.length; i++) {
                arr[i] = arr[i].trim()
            }
            dns[key] = arr
            return
        }
        if (key === "expectIPs") {
            let arr = dns[key].split(",")
            for (let i = 0; i < arr.length; i++) {
                arr[i] = arr[i].trim()
            }
            dns[key] = arr
            return
        }
        if (key === "skipFallback") {
            dns[key] = JSON.parse(dns[key])
            return
        }
    })
}
