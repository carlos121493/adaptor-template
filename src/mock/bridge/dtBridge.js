import alert from './device/notification/alert';
import confirm from './device/notification/confirm';
import toast from './device/notification/toast';
import showPreloader from './device/notification/showPreloader';
import hidePreloader from './device/notification/hidePreloader';
import actionSheet from './device/notification/actionSheet';
import extendModal from './device/notification/extendModal';
import getPhoneInfo from './device/base/getPhoneInfo';
import setItem from './util/domainStorage/setItem';
import getItem from './util/domainStorage/getItem';
import removeItem from './util/domainStorage/removeItem';
import getGeoLocation from './device/geolocation/get';
import openLink from './biz/util/openLink';
import previewImage from './biz/util/previewImage';
import chosen from './biz/util/chosen';
import timepicker from './biz/util/timepicker';
import datepicker from './biz/util/datepicker';
import open from './biz/util/open';
import get from './biz/user/get';
import multiSelect from './biz/util/multiSelect';
import chooseMobileContacts from './biz/contact/chooseMobileContacts';
import requestAuthCode from './runtime/permission/requestAuthCode';
import lwp from './internal/request/lwp';
import ut from './biz/util/ut';

const API_LIST = [
  requestAuthCode,
  alert,
  confirm,
  toast,
  showPreloader,
  hidePreloader,
  actionSheet,
  extendModal,
  getPhoneInfo,
  setItem,
  getItem,
  removeItem,
  getGeoLocation,
  openLink,
  previewImage,
  chosen,
  timepicker,
  datepicker,
  open,
  get,
  multiSelect,
  chooseMobileContacts,
  lwp,
  ut,
];

const apiMap = API_LIST.reduce((memo, api) => {
  memo[api.name] = api; // eslint-disable-line
  return memo;
}, {});

export default {
  name: 'dtBridge',
  call: framework => (params) => {
    console.log(params); // eslint-disable-line
    const apiName = params.m;
    const api = apiMap[apiName];
    if (api) {
      api.call({
        ...framework,
        callNative: (nativeParms, cb) => {
          framework.callNative({ _apiName: apiName, ...nativeParms }, cb);
        },
      })(params);
    } else {
      throw new Error(`Unknown API error: ${apiName}`);
    }
  },
  native: outerFrameWork => ({ _apiName, ...params }, cb) => {
    const nativeApi = apiMap[_apiName].native;
    if (nativeApi) {
      nativeApi(outerFrameWork)(params, cb);
    } else {
      throw new Error(`Unknown NativeAPI error: ${_apiName}`);
    }
  },
};
