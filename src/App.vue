<template>
    <van-config-provider :theme="theme ? 'light' : 'dark'">
        <van-nav-bar :title="$t('common.module-name')" placeholder fixed>
            <template #left>
                <van-icon size="1.2rem" @click="switchTheme" :name="light"/>
            </template>
            <template #right>
                <van-popover class="localeIcon" :actions="locale" @select="switchLocale" placement="bottom-end">
                    <template #reference>
                        <van-icon size="1.2rem" :name="lang"/>
                    </template>
                </van-popover>
            </template>
        </van-nav-bar>
        <router-view v-slot="{ Component }">
            <component ref="routerViewRef" :is="Component" :theme="theme"/>
        </router-view>
        <van-tabbar route placeholder>
            <van-tabbar-item replace to="/" icon="home-o">{{ $t('common.dashboard') }}</van-tabbar-item>
            <van-tabbar-item replace to="/setting" icon="setting-o">{{ $t('common.setting') }}</van-tabbar-item>
        </van-tabbar>
    </van-config-provider>
</template>

<script setup>
import {ref} from 'vue'
import {execCmd} from './tools'
import i18n from './locales/i18n'

const theme = ref(true)
const routerViewRef = ref()
const light = "data:image/svg+xml;base64,PHN2ZyB0PSIxNzE3MTMxOTA1ODExIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjQ2MDEiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cGF0aCBkPSJNMzIwIDg1LjMzMzMzM0MyNDMuNjI2NjY3IDEzNC40IDE5MiAyMjEuMDEzMzMzIDE5MiAzMjAgMTkyIDQxOC45ODY2NjcgMjQzLjYyNjY2NyA1MDUuNiAzMjEuMjggNTU0LjY2NjY2NyAxOTAuMjkzMzMzIDU1NC42NjY2NjcgODUuMzMzMzMzIDQ0OS43MDY2NjcgODUuMzMzMzMzIDMyMCA4NS4zMzMzMzMgMTkwLjI5MzMzMyAxOTAuMjkzMzMzIDg1LjMzMzMzMyAzMjAgODUuMzMzMzMzTTgxMy42NTMzMzMgMTQ5LjMzMzMzMyA4NzQuNjY2NjY3IDIxMC4zNDY2NjcgMjEwLjM0NjY2NyA4NzQuNjY2NjY3IDE0OS4zMzMzMzMgODEzLjY1MzMzMyA4MTMuNjUzMzMzIDE0OS4zMzMzMzNNNTQ5Ljk3MzMzMyAyNTMuMDEzMzMzIDQ4Ni44MjY2NjcgMjEzLjMzMzMzMyA0MjUuMzg2NjY3IDI1NiA0NDMuMzA2NjY3IDE4My40NjY2NjcgMzg0IDEzOC4yNCA0NTguNjY2NjY3IDEzMy4xMiA0ODMuNDEzMzMzIDYyLjcyIDUxMiAxMzIuMjY2NjY3IDU4NS44MTMzMzMgMTMzLjU0NjY2NyA1MjguMjEzMzMzIDE4MS43NiA1NDkuOTczMzMzIDI1My4wMTMzMzNNNDA5LjE3MzMzMyA0MDcuMDQgMzU5LjY4IDM3NS44OTMzMzMgMzExLjg5MzMzMyA0MDkuMTczMzMzIDMyNi40IDM1Mi44NTMzMzMgMjc5Ljg5MzMzMyAzMTcuNDQgMzM3LjkyIDMxMy42IDM1Ny4xMiAyNTguNTYgMzc4Ljg4IDMxMi43NDY2NjcgNDM2LjkwNjY2NyAzMTQuMDI2NjY3IDM5Mi4xMDY2NjcgMzUxLjE0NjY2NyA0MDkuMTczMzMzIDQwNy4wNE04MTAuNjY2NjY3IDU3NkM4MTAuNjY2NjY3IDcwNS43MDY2NjcgNzA1LjcwNjY2NyA4MTAuNjY2NjY3IDU3NiA4MTAuNjY2NjY3IDUyMy45NDY2NjcgODEwLjY2NjY2NyA0NzUuNzMzMzMzIDc5My42IDQzNi45MDY2NjcgNzY1LjAxMzMzM0w3NjUuMDEzMzMzIDQzNi45MDY2NjdDNzkzLjYgNDc1LjczMzMzMyA4MTAuNjY2NjY3IDUyMy45NDY2NjcgODEwLjY2NjY2NyA1NzZNNjIyLjkzMzMzMyA4NTYuNzQ2NjY3IDc0MS4xMiA4MDcuNjggNzMwLjg4IDk1MC42MTMzMzMgNjIyLjkzMzMzMyA4NTYuNzQ2NjY3TTgwNy42OCA3NDEuNTQ2NjY3IDg1Ni43NDY2NjcgNjIzLjM2IDk1MC42MTMzMzMgNzMxLjczMzMzMyA4MDcuNjggNzQxLjU0NjY2N004NTYuNzQ2NjY3IDUyOS45MiA4MDguMTA2NjY3IDQxMS4zMDY2NjcgOTUwLjYxMzMzMyA0MjEuNTQ2NjY3IDg1Ni43NDY2NjcgNTI5LjkyTTQxMC44OCA4MDcuNjggNTI5LjA2NjY2NyA4NTYuNzQ2NjY3IDQyMS4xMiA5NTAuMTg2NjY3IDQxMC44OCA4MDcuNjhaIiBwLWlkPSI0NjAyIiBmaWxsPSIjMTk4OWZhIj48L3BhdGg+PC9zdmc+"
const lang = "data:image/svg+xml;base64,PHN2ZyB0PSIxNzE3MTMyMzU2MTg3IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjkyMjAiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cGF0aCBkPSJNODQ2LjA0IDg2Ni43N2MtMTcuMDggMi4wMy0zMi41Ny0xMC4xOC0zNC41OS0yNy4yNi0wLjIyLTEuOS0wLjI3LTMuODEtMC4xNS01Ljcxdi0xMjNjMC0zMy43My0yMi4xNy0zMy43My0zMC41My0zMy43My0yMS4yOC0wLjQ2LTM4LjkxIDE2LjQzLTM5LjM2IDM3LjcyLTAuMDEgMC40Ni0wLjAxIDAuOTIgMCAxLjM3djExNy42NmMtMC43NiAxOC45LTE2LjcxIDMzLjYxLTM1LjYxIDMyLjg0LTE3LjgzLTAuNzItMzIuMTItMTUuMDEtMzIuODQtMzIuODRWNjQ3LjY4Yy0xLjIzLTE3LjIzIDExLjc0LTMyLjE5IDI4Ljk3LTMzLjQxIDEuNjktMC4xMiAzLjM5LTAuMSA1LjA4IDAuMDVhMzEuOTUzIDMxLjk1MyAwIDAgMSAzMS4zMyAxNy43NiA4OS40MzUgODkuNDM1IDAgMCAxIDU0Ljk5LTE3Ljc2YzU0LjExIDAgODYuNDUgMzMuNTkgODYuNDUgOTAuMDNWODMzLjhhMzIuMjUgMzIuMjUgMCAwIDEtOC44OCAyMy43MiAzNC4wMjYgMzQuMDI2IDAgMCAxLTI0LjgyIDkuMzNsLTAuMDQtMC4wOHogbS0yMzMuMTItNy40NmgtMTM0LjdjLTQyLjc3IDAtNjEuODUtMTguOTYtNjEuODUtNjEuNTdWNjA4LjA3YzAtNDIuNTIgMTkuMDktNjEuNTcgNjEuODUtNjEuNTdoMTI4Ljc0YzE3LjkyIDAgMzIuNDUgMTQuNTMgMzIuNDUgMzIuNDVzLTE0LjUzIDMyLjQ1LTMyLjQ1IDMyLjQ1SDQ5MC43M2MtMS4yMi0wLjA4LTIuNDUgMC4wOS0zLjYgMC41IDAuMTMgMC0wLjE1IDAuOC0wLjE1IDIuODl2NTIuNThoMTA2YzE2LjMzLTEuNjYgMzAuOTEgMTAuMjQgMzIuNTcgMjYuNTcgMC4xNyAxLjY4IDAuMiAzLjM3IDAuMDggNS4wNiAwLjk4IDE2LjY2LTExLjczIDMwLjk3LTI4LjQgMzEuOTUtMS40MSAwLjA4LTIuODMgMC4wNy00LjI0LTAuMDVINDg2LjlWNzkxYy0wLjA0IDEuMDYgMC4wOCAyLjEzIDAuMzUgMy4xNSAxLjEyIDAuMTUgMi4yNSAwLjIzIDMuMzggMC4yNGgxMjIuMzFjMTYuOTYtMS4wNyAzMS41OCAxMS44MSAzMi42NSAyOC43NiAwLjA3IDEuMTYgMC4wOCAyLjMzIDAuMDIgMy41IDEuMzUgMTYuNjgtMTEuMDcgMzEuMy0yNy43NSAzMi42NS0xLjY0IDAuMTMtMy4yOCAwLjEzLTQuOTIgMGgtMC4wMnpNMzI3LjU0IDQ4Mi44NWMtMTcuMzYgMi4zNi0zMy4zNC05LjgtMzUuNy0yNy4xNi0wLjMtMi4yMS0wLjM3LTQuNDQtMC4yLTYuNjdWMzcwLjVoLTg1LjI3Yy00NS44NiAwLTY2LjMxLTIwLjUyLTY2LjMxLTY2LjMxdi05My44N2MwLTQ1LjU4IDIwLjUyLTY1LjkgNjYuMzEtNjUuOWg4NS4yN3YtMzEuNTNjLTEuMzgtMTcuMTEgMTEuMzctMzIuMTEgMjguNDgtMzMuNDkgMS45Mi0wLjE1IDMuODQtMC4xMyA1Ljc2IDAuMDcgMzAuMjYgMCAzNi42MyAxOC4xNyAzNi42MyAzMy40MnYzMS41OWg4Ni4wOWM0NS44NiAwIDY2LjMzIDIwLjM0IDY2LjMzIDY1Ljg4djkzLjg5YzAgNDUuODYtMjAuNTIgNjYuMjktNjYuMzMgNjYuMjloLTg2LjA1djc4LjUyYzEuMjUgMTcuNDctMTEuOSAzMi42NS0yOS4zNyAzMy45MS0xLjg4IDAuMTMtMy43NiAwLjEtNS42My0wLjF2LTAuMDJ6TTIxNy4yMSAyMTEuMjdjLTYuNDcgMC03LjA3IDAuNi03LjA3IDcuMDd2NzguMmMwIDYuNTMgMC42IDcuMTUgNy4wNyA3LjE1aDc0LjQzdi05Mi40MmgtNzQuNDN6IG0xNDUuMzUgOTIuMzhoNzUuMjljNi4yOSAwIDcuMDktMC44IDcuMDktNy4wN3YtNzguMjVjMC02LjI5LTAuOC03LjA5LTcuMDktNy4wOWgtNzUuMzF2OTIuNDJoMC4wMnogbTE1MS40MiA2NTUuOTFDMjY2LjQzIDk1OC44MiA2Ni4zNiA3NTcuNTUgNjcuMSA1MTBjMC4xLTM1IDQuMzEtNjkuODYgMTIuNTItMTAzLjg4IDQuODEtMTkgMjMuOTItMzAuNjggNDMuMDMtMjYuMjkgMTkuMSA0LjYxIDMwLjg2IDIzLjgxIDI2LjI5IDQyLjkxLTQ4LjkzIDIwMi4zMyA3NS40MiA0MDYuMDEgMjc3Ljc1IDQ1NC45NGEzNzYuOTI0IDM3Ni45MjQgMCAwIDAgODcuMjkgMTAuNTZjMTkuNjkgMC4wMiAzNS42NCAxNS45OSAzNS42MyAzNS42OS0wLjAyIDE5LjY3LTE1Ljk2IDM1LjYxLTM1LjYzIDM1LjYzeiBtMzk4LjQ5LTMxMC4wNWMtMTkuNjkgMC0zNS42Ni0xNS45Ni0zNS42Ni0zNS42NSAwLTIuOTUgMC4zNy01LjkgMS4wOS04Ljc2IDUxLjMxLTIwMS44Mi03MC43LTQwNy4wMi0yNzIuNTItNDU4LjMzLTI5Ljg5LTcuNi02MC41OS0xMS41LTkxLjQzLTExLjYyLTE5LjY4IDAtMzUuNjQtMTUuOTUtMzUuNjQtMzUuNjMgMC0xOS42OCAxNS45NS0zNS42NCAzNS42My0zNS42NGgwLjAxYzI0Ny41NyAwLjc2IDQ0Ny42NSAyMDIuMDggNDQ2Ljg5IDQ0OS42NS0wLjExIDM2LjgtNC43NiA3My40NC0xMy44MyAxMDkuMS00IDE1LjgtMTguMjMgMjYuODgtMzQuNTQgMjYuODh6IiBmaWxsPSIjMTk4OWZhIiBwLWlkPSI5MjIxIj48L3BhdGg+PC9zdmc+"
const locale = [
    {text: "English(US)", value: "en-US"},
    {text: "中文(简体)", value: "zh-CN"},]
const switchLocale = (locale) => {
    i18n.global.locale = locale.value
    localStorage.setItem('locale', locale.value)
}
const switchTheme = () => {
    theme.value = !theme.value
    localStorage.setItem('theme', theme.value)
}
const initTheme = () => {
    execCmd('settings get secure ui_night_mode').then(v => {
        // 0 for follow system
        // 1 for Light Mode
        // 2 for Dark Mode
        if (v === '1') {
            theme.value = true;
        } else if (v === '2') {
            theme.value = false;
        }
        localStorage.setItem('theme', theme.value)
    })
    const cacheTheme = localStorage.getItem('theme')
    if (typeof cacheTheme != "undefined" && cacheTheme != null) {
        theme.value = JSON.parse(cacheTheme)
    }
}
const initI18n = () => {
    const cacheLocale = localStorage.getItem('locale')
    if (typeof cacheLocale != "undefined" && cacheLocale != null) {
        i18n.global.locale = cacheLocale
        return
    }
    let locale
    switch (navigator.language) {
        case 'en':
            locale = 'en-US'
            break
        case 'zh-CN':
            locale = 'zh-CN'
            break
        default:
            locale = 'en-US'
    }
    i18n.global.locale = locale
    localStorage.setItem('locale', locale)
}
initTheme()
initI18n()
</script>

<style>
.van-theme-dark body {
    color: #f5f5f5;
    background-color: black;
}

.van-theme-light body {
    background-color: rgb(240, 240, 240);
}

.van-popover__wrapper {
    width: 100%;
    height: 39%;
}

.van-cell__value {
    span {
        white-space: nowrap;
        display: inline-block;
    }
}
</style>
