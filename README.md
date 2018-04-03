### SDK 文档

1. login，如果需要支持登录请在server中
cygnus-pluginserver库提供了创建连接的方式
 - a.初始化
  const context = createConnection();
  context.onReady(callBack);
  callBack 为自己定义的初始化回调函数。

- b.在第一步初始化里，实例化CygnusAuth
  覆盖CygnusAuth对象
  class XXXAuth extends CygnusAuth { 
    getQRCode() {} // 登录
    getProfile() {} // 获取用户信息
    checkLogin() {} // 检测是否登录
  }

- d.监听常用方法
  ServerProtocol.profile
  ServerProtocol.checkLogin
  ServerProtocol.qrCode

- e.然后我们就可以在class里通过监听及发送和mock以及panel里进行交互了。

时序图
1.loadPlugin时，读取adapters字段（不存储避免问题）
2.遍历adapters的repository
3.显示有server的登录方式
4.点击后启动server执行getqrcode
5.扫码后进入，选择运行时环境。如果多个运行环境则将多个置入左下角（和登录不一样时需要将server关闭），将第一个server启动，并主动检测一次登录情况。
6.切换时如没将server启动，则首先将server启动。重新切换整个方案

openWindow时，第一次读取 adapter字段，加载控制

a.sdk调试方面
  两个框架提供启动入口（暂时）
b.启动
  - 初始化加载记录路径。和是否启动server状态
  - 界面上显示相应的adapter。并可选择，选择后启动（启动后（如果启动就不加载） =》 loading状态 =》 显示二维码封装）
  - 选择开启时，（是否有登录server，没有则取消）如果登录server不是初始化将重新recheckLogin
  - 切换login时将重新checkLogin

- 启动登录界面
- 启动二维码界面
- 项目选择页面
- 进入项目
- 切换项目

tiny-project --> BlackTea: init config
BlackTea --> adapter: init server
BlackTea --> tiny-project: choose adapter
BlackTea --> tiny-project: init adapter
tiny-project --> adapter: choose adapter
BlackTea --> adapter: change server
BlackTea --> tiny-project: choose adapter
tiny-project --> adapter: choose adapter
