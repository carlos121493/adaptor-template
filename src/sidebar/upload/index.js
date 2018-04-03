import { init as initRPC } from '@ali/dingtalk-idl-ts/lib/rpc-request';
import { MiniAppI_getMiniAppBaseInfo,
  MiniAppBuildI_ossAccessToken,
  MiniAppBuildI_build,
  MiniAppBuildI_buildStatus } from '@ali/dingtalk-idl-ts/dist/miniapp';
import md5File from 'md5-file/promise';
import AliOSS from 'ali-oss';
/**
 * 上传
 * @param
 * server // 服务器
 *  - send(event, callback)
 *  - on(event, callback)
 *  - once(event, callback)
 */
export default (server) => {
  const sendMsg = (url, headers, body) => {
    return server.run('dingTalk:sendMsg', {
      url,
      headers,
      body,
    }).then((res) => {
      if (res.code === 200) {
        return res;
      } else {
        return Promise.reject(res);
      }
    });
  };

  initRPC({
    sendMsg,
  });

  return {
    auditLink: ({ appid }) => `https://open-dev.dingtalk.com/#/miniProgramSettings/${appid}`,
    whiteListLink: ({ appid }) => `https://open-dev.dingtalk.com/#/miniProgramSettings/${appid}`,
    /**
     * 获取小程序信息
     * @param
     *  appid 用户填写的appid
     * @return
     * Promise<{
     *  stat // 'ok' | 'failed',
     *  data: {
     *    code // 错误码
     *    httpRequestList // 白名单 string[],
     *    lastVersion // 最近一次上传版本号'0.0.0'
     *    miniAppName // 小程序名称,
     *    isvAppName: '',
     *    mode: '',
     *  }
     * }>
     */
    getAppInfo: async ({ appid }) => {
      try {
        const res = await MiniAppI_getMiniAppBaseInfo(appid);
        return {
          stat: 'ok',
          data: {
            httpRequestList: res.body.httpRequestList,
            lastVersion: res.body.lastVersion,
            miniAppName: res.body.miniAppName,
            isvAppName: res.body.isvAppName,
            mode: res.body.mode,
          },
        };
      } catch (e) {
        return {
          stat: 'failed',
          data: {
            code: e.body && e.body.code,
            msg: e.body && e.body.reason,
          },
        };
      }
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
    publishToServer: async ({ formData, tarFilePath }) => {
      const { packageStream, packageMD5, packageName, appId: miniAppId, packageVersion: version, appType, extendInfo, mainUrl, subUrl, extraInfo } = formData;
      try {
        const res = await MiniAppBuildI_ossAccessToken(miniAppId);
        console.log({ res });
        const name = res.body.name;
        const store = new AliOSS.Wrapper({
          accessKeyId: res.body.accessid,
          accessKeySecret: res.body.accessKeySecret,
          bucket: 'dingtalk-miniapp-private',
          region: 'oss-cn-shanghai',
          stsToken: res.body.securityToken,
        });
        const storeName = await store.put(name, tarFilePath).then(() => {
          console.log('upload to oss success');
          return name;
        });
        const extendInfoObj = JSON.parse(extendInfo);
        if (extendInfoObj.launchParams) {
          extendInfoObj.launchParams.nboffline = 'sync';
        }
        const extendInfoStr = JSON.stringify(extendInfoObj);
        console.log({ storeName });
        const buildINfo = await md5File(tarFilePath).then((hash) => {
          console.log({ hash });
          return MiniAppBuildI_build(
            miniAppId,
            storeName,
            hash,
            packageName,
            version,
            mainUrl,
            appType,
            subUrl,
            extraInfo,
            extendInfoStr,
          );
        });
        console.log({ buildINfo });
        const packageId = buildINfo.body.taskId;
        if (packageId) {
          const buildRes = await MiniAppBuildI_buildStatus(buildINfo.body.taskId);
          console.log({ buildRes });
          const nebulaInfo = JSON.parse(decodeURIComponent(buildRes.body.buildInfo));
          nebulaInfo.packageId = packageId;
          nebulaInfo.detail = JSON.parse(decodeURIComponent(nebulaInfo.detail));
          return {
            stat: 'ok',
            data: {
              nebulaInfo,
              packageId,
              versionCreated: buildRes.body.finished ? 'true' : false,
            },
          };
        }
        // const nebulaInfo= {"packageUrl":"","detail":"{\"app_name\":\"tiny-build\",\"created\":\"2018-02-02T05:00:19.787Z\",\"finished\":null,\"log_url\":null,\"result_url\":null,\"started\":\"2018-02-02T05:00:20.723Z\",\"status\":1,\"task_id\":\"4c3d64d993ba4b65bae132e1468c7ad5\",\"log\":\"[INFO] 开始执行 下载构建包\\n\"}","version":"0.0.6","status":"1"};
      } catch (e) {
        console.log(e);
        return {
          stat: 'failed',
          msg: e.body && e.body.reason,
          data: {
            code: e.body && e.body.code,
            msg: e.body && e.body.reason,
          },
        };
      }
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
    queryPollingBuildInfo: async ({ packageId }) => {
      try {
        const res = await MiniAppBuildI_buildStatus(packageId);
        console.log({ res });
        const nebulaInfo = JSON.parse(decodeURIComponent(res.body.buildInfo));
        nebulaInfo.packageId = packageId;
        nebulaInfo.detail = JSON.parse(decodeURIComponent(nebulaInfo.detail));
        return {
          stat: 'ok',
          data: {
            nebulaInfo,
            packageId,
            versionCreated: res.body.finished ? 'true' : false,
          },
        };
      } catch (e) {
        console.log(e);
        return {
          stat: 'failed',
          data: {
            code: e.body && e.body.code,
            msg: e.body && e.body.reason,
          },
        };
      }
    },
  };
};
