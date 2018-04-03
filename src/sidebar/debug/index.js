
import { MiniAppI_getMiniAppBaseInfo,
  MiniAppBuildI_ossAccessToken,
  MiniAppBuildI_preViewBuild,
  MiniAppBuildI_buildStatus, MiniAppI_listOrgCurrentUser } from '@ali/dingtalk-idl-ts/dist/miniapp';
import md5File from 'md5-file/promise';
import AliOSS from 'ali-oss';
import { getQrBase64 } from 'jr-qrcode';

export default (server) => {
  return {
    disableSandBox: true,
    /**
     * @param
     * {
     *   tarFilePath // 打包路径
     *   formData: {
     *     appId // appid
     *     appType // 'tinyApp'
     *     extendInfo // {"launchParams":{"enableTabBar":"YES","enableJSC":"YES","page":"page/ui/ui","enableKeepAlive":"NO","enableWK":"YES","query":""}}
     *     extraInfo // { tinycliVersion: '2.0.0-beta.9' }
     *     idePreviewType // 'self' || 'muti' 自己活着开发者
     *     mainUrl // 入口页 /index.html#
     *     openDebugSwitch // {"enableBugme":true}
     *     packageStream // base64文件信息
     *     packageMD5 // md5文件信息
     *     packageName // 'dist.tar'
     *     packageVersion // undefined
     *     subUrl // ''
     *     userId // undefined
     *   }
     * }
     * @return
     * {
     *  stat // 'ok',
     *  data // string qrcode url
     * }
     */
    getPreviewQRCode: async ({ formData, tarFilePath, corpId }) => {
      const { packageStream, packageMD5, packageName, appId: miniAppId, packageVersion: version, appType, mainUrl, extendInfo, extraInfo, idePreviewType } = formData;
      try {
        const res = await MiniAppBuildI_ossAccessToken(miniAppId);
        console.log({ res });
        const name = `${res.body.name}.tar`;
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
        console.log({ storeName });
        const extendInfoObj = JSON.parse(extendInfo);
        if (extendInfoObj.launchParams) {
          extendInfoObj.launchParams.nboffline = 'sync';
        }
        const extendInfoStr = JSON.stringify(extendInfoObj);
        const buildINfo = await md5File(tarFilePath).then((hash) => {
          return MiniAppBuildI_preViewBuild(
            miniAppId,
            storeName,
            extraInfo,
            extendInfoStr,
            encodeURIComponent(`corpId=${corpId}`),
            idePreviewType,
            mainUrl,
          );
        });
        console.log({ buildINfo });
        if (buildINfo.body.finished) {
          return {
            stat: 'ok',
            data: getQrBase64(buildINfo.body.resultUrl),
          };
        }
        return {
          stat: 'failed',
          msg: buildINfo && buildINfo.body.reason,
          data: {
            code: buildINfo.body.code,
            msg: buildINfo.body.reason,
          },
        };
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
      // return new Promise((resolve) => {
      //   resolve({
      //     stat: 'ok',
      //     data: 'https://gw.alipayobjects.com/zos/rmsportal/CZVUNhVxZRRzEvmoJYXu.jpeg',
      //   });
      // });
    },
    /**
     * 获取设备列表
     * @param
     * {
     *  env // sandbox product
     * }
     * @return
     * {
     *  did,
     *  viewId, // 需要带worker字段才能显示
     *  sessionId,
     *  sessionId_update,
     *  firstCreated,
     *  userAgent,
     *  app: {
     *    appId
     *  }
     * }[],
     */
    getDevices: () => {
      // return new Promise((resolve) => {
      //   resolve([{
      //     did: '12345',
      //     viewId: 'worker12345',
      //     sessionId: '12345',
      //     sessionId_update: '12345',
      //     firstCreated: Date.now(),
      //     app: {
      //       appId: '2017080107989102',
      //     },
      //   }, {
      //     did: '12345',
      //     viewId: '12345',
      //     sessionId: '12345',
      //     sessionId_update: '12345',
      //     firstCreated: Date.now(),
      //     app: {
      //       appId: '2017080107989102',
      //     },
      //   }]);
      // });
    },
    /**
     * 获取log记录
     * @param
     * {
     *  env
     *  viewId
     *  did
     * }
     * @return
     * {
     *   id: '', // log的ide
     *   content: '', //  log内容
     * }[]
     */
    getLogsInfo: () => {
      // return new Promise((resolve) => {
      //   setTimeout(() => {
      //     resolve([{
      //       id: '12345',
      //       content: 'helloworld',
      //     }]);
      //   }, 2000);
      // });
    },
    /**
     * 获取企业列表
     * @param
     * appid 
     * @return
     * [{ orgName: '', corpId: '' }]
     */
    getCorpList: async ({ appid }) => {
      const res = await server.run('dingTalk:profile', {});
      const result = [];
      Array.isArray(res.orgEmployees) && res.orgEmployees.forEach((item) => {
        if (item && item.orgDetail && item.orgDetail.orgName && item.orgDetail.corpId) {
          result.push({
            orgName: item.orgDetail.orgName,
            corpId: item.orgDetail.corpId,
          });
        }
      });
      return result;
    },
  };
};
