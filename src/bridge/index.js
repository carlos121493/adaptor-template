import navigator from './navigator';
import test from './test';
import demo from './demo';

export default (framework, abridge) => {
  return [
    ...demo,
    ...test,
    ...navigator,
  ];
}
