
/**
 * 获得传入AppId对应的当前版本号
 */
const getUploadMiniAppInfo = '/platform/getUploadMiniAppInfo.json';
/** 
* 轮询包 build 状态
 */
const pollBuildStatus = '/platform/rotateBuilding.json';
 /**
  * 上传
 * @param
 * server // 服务器
 *  - send(event, callback)
 *  - on(event, callback)
 *  - once(event, callback)
  */
const uploadBundle = '/platform/uploadByCode.json';

export default (server) => {
   return {
    // 到相应appid平台查看
    auditLink: ({ appid }) => `https://ceshi.com/${appid}`,
    // 到白名单平台地址
    whiteListLink: ({ appid }) => `https://ceshi.com/${appid}`,
    /**
     * 获取小程序信息
     * @param
     *  appid 用户填写的appid
     * @return
     * Promise<{
     *  stat // 'ok' | 'failed'
     *  data: {
     *    msg // 错误码
     *    httpRequestList // 白名单 string[],
     *    lastVersion // 最近一次上传版本号'0.0.0'
     *    miniAppName // 小程序名称,
     *  }
     * }>
     */
    getAppInfo: () => {
      return Promise.resolve({
        stat: 'ok', // 获取appid成功或失败，失败需提供msg信息
        data: {
          msg: '上传成功', // 错误信息
          httpRequestList: ['openhome.alipay.com'], // 白名单 string[], 列表
          lastVersion: '1.0.0', // 最近一次上传版本号'0.0.0'
          miniAppName: 'ceshi', // 小程序名称,
        }
    });
    },
    /**
    * 发起上传
    * @param
    *  tarFilePath {string} - 打包路径
    *  formData { object } - 上传参数
    *  formData {
    *    packageStream, // ''
    *    packageMD5, // md5 a64a7e363656158f032b6326379e5ab9
    *    packageName, // "dist.tar" 包名
    *    appId, // appId 用户自填
    *    packageVersion, // package版本号，如"0.1.3"
    *    extendInfo, // 启动参数 "{\"launchParams\":{\"backBehavior\":\"back\",\"waitRender\":300}}",
    *    mainUrl, // 启动页，如 "/index.html#pages/1/index"
    *    appType, // 'tinyApp'
    *    subUrl, // 无用为""
    *  }
    * @return
    * Promise<{
    *   data: {
    *     nebulaInfo // {"packageUrl":"","detail":"{\"app_name\":\"tiny-build\",\"created\":\"2018-02-02T05:00:19.787Z\",\"finished\":null,\"log_url\":null,\"result_url\":null,\"started\":\"2018-02-02T05:00:20.723Z\",\"status\":1,\"task_id\":\"4c3d64d993ba4b65bae132e1468c7ad5\",\"log\":\"[INFO] 开始执行 下载构建包\\n\"}","version":"0.0.6","status":"1"}
    *   }
    * }>
    */
    publishToServer: () => {
       return Promise.resolve({
          stat: 'ok', // 'ok' | 'failed', // 获取appid成功
          data: {
            msg: '上传成功', // 错误码
            nebulaInfo: { 
              packageId: "123",
              detail: { "log":"[INFO] mock 日志文件不必当真" } 
            }, // 上传后返回的nebula日志信息
            versionCreated: 'false', // 是否创建成功
          },
      });
    },
    /**
     * 轮训查询状态
     * @param
     *  appId
     *  packageId
     *  packageVersion
     * @return
     * Promise<{
     *  nebulaInfo // 同上
     * }>
     */
    queryPollingBuildInfo: async () => {
      return Promise.resolve({
          stat: 'ok', // 'ok' | 'failed', // 获取appid成功
          data: {
            msg: '上传成功', // 错误码
            detail: { "log":"[INFO] mock 日志文件成功啦" } , // 上传后返回的nebula日志信息
            packageId: "123",
            versionCreated: 'true', // 是否创建成功
          },
      });
    },
  };
 };
