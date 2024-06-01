import {exec} from 'kernelsu'
import {Buffer} from 'buffer/'

export const XRAYHELPER = "/data/adb/xray/bin/xrayhelper"
export const XRAYHELPER_CONFIG = "/data/adb/xray/xrayhelper.yml"

export const execCmd = async (cmd) => {
    console.info(cmd)
    const {errno, stdout} = await exec(cmd, {cwd: '/'})
    if (errno === 0) {
        // success
        console.log(stdout)
        return stdout
    }
}
export const execCmdWithError = async (cmd) => {
    console.info(cmd)
    const {errno, stdout, stderr} = await exec(cmd, {cwd: '/'})
    if (errno === 0) {
        // success
        console.log(stdout)
        return stdout
    } else {
        console.info(stderr)
        return `${stdout}\n${stderr}`
    }
}
export const readFile = async (filePath) => {
    return Buffer.from(await execCmd(`base64 -w 0 ${filePath}`), "base64").toString('utf-8')
}
export const saveFile = (content, filePath) => {
    execCmd(`echo ${Buffer.from(content).toString("base64")} | base64 -d > ${filePath}`)
}
export const callApi = async (api) => {
    return JSON.parse(await execCmd(`su -c ${XRAYHELPER} -c ${XRAYHELPER_CONFIG} api ${api}`))
}
export const execXrayHelperCmd = (cmd) => {
    return execCmdWithError(`su -c ${XRAYHELPER} -c ${XRAYHELPER_CONFIG} -t 5 ${cmd}`)
}
