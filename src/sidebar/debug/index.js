export default (server) => {
  return {
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
    getPreviewQRCode: ({ tarFilePath, formData }) => {
      return new Promise((resolve) => {
        resolve({
          stat: 'ok',
          data: 'https://gw.alipayobjects.com/zos/rmsportal/CZVUNhVxZRRzEvmoJYXu.jpeg',
        });
      });
    },
  };
};
