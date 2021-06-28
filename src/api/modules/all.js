export default {
    // Login
    login() { return "wb/login"},
    logout() { return "wb/logout"},
    updatePassword(){ return "userCenter/updatePassword" },

    // Home
    orgAll() { return "zm/org/all" }, // home1
    countDiameterByFactory() { return "device/countDiameterByFactory" }, // home1 查询压力
    queryDevices() { return "device/queryDevices"}, // home2 查询设备列表
    reason() { return "warn/notice/reason"}, // home2 查询设备列表处理信息
    saveDefault() { return "device/saveDefault" }, // home2 设置默认装置
    deal() { return "warn/notice/deal" }, // home2 处理操作
    log() { return "warn/notice/log" }, // home2 日志列表
    queryFilter() { return "filter/queryFilter" }, // home5 过滤芯查询
    queryFilterByPage() { return "filter/queryFilterByPage" }, // home5 主账号过滤芯查询
    saveFilter(){ return "filter/saveFilter" }, // home5 保存过滤芯
    updateFilter() { return "filter/updateFilter"}, // home5 修改过滤芯
    deleteFilter() { return "filter/deleteFilter"}, // home5 删除过滤芯
    // queryLinesByDevice() { return "nature/queryLinesByDevice" }, // home6
    queryMfkeyNatures() { return "nature/queryMfkeyNatures" }, // home6
    // queryPancakesByDevice() { return "nature/queryPancakesByDevice" }, // home7
    queryKeyNatures() { return "nature/queryKeyNatures " }, // home7

    // Equipment
    queryDeviceById() { return "device/queryDeviceById" }, // 查设备
    findById() { return "equipment/findById" }, // 查装置
    enshrineList() { return "enshrine/list" }, // 我的收藏
    queryNaturesByPage() { return "nature/queryNaturesByPage" }, // 设备指标列表分页
    NATURE_GROUP() { return "data/combobox/NATURE_GROUP" }, // 获取设备指标类型
    saveVisible() { return "device/saveVisible" }, // 设置属性可见
    queryLines() { return "nature/queryLines" }, // 历史数据监测
    queryNatureValues() { return "nature/queryNatureValues" }, // PI图
    natureList() { return "nature/list" },

    DEVICE_TYPE() { return "data/combobox/DEVICE_TYPE" }, //密封类型
    SEALING_FORM_TYPE() { return "data/combobox/SEALING_FORM_TYPE" }, //密封形式
    FLUSHING_TYPE() { return "data/combobox/FLUSHING_TYPE" }, //冲洗方案

    // Report
    reportList() { return "device/status/report/list" }, //文件报告列表信息
    reportDownload() { return "device/status/report" }, //下载报告信息
    
    // Home
    noticePage() { return "warn/notice/page" }, //告警信息列表
    statistics() { return "device/status/statistics" }
};