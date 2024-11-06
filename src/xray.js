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