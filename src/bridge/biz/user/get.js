import dingMediaid from '@ali/ding-mediaid';

export default {
  name: 'biz.user.get',
  call: ({ store, server }) => async ({
    args: { corpId: inputCorpId }, onSuccess: success, onFail: fail,
  }) => {
    try {
      const corpId = inputCorpId || await store.get('corpId');
      const res = await server.run('dingTalk:profile', {});
      console.log(res);
      const { userProfileModel, orgEmployees } = res;
      const avatar = dingMediaid.mid2Url(userProfileModel.avatarMediaId);
      let corp = { orgEmployeeModel: {} };
      for (const item of orgEmployees) {
        if (corpId === item.orgDetail.corpId) {
          corp = item;
          break;
        }
      }

      success({
        id: userProfileModel.uid,
        emplId: corp.orgEmployeeModel.orgStaffId,
        nickName: userProfileModel.nick,
        corpId,
        avatar,
        isManager: corp.isAdmin,
      });
    } catch (e) {
      fail(e);
    }
  },
};
