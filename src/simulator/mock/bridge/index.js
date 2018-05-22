import demo from './demo';

export default (framework, abridge) => {
  return [
    ...demo,
    ...Object.values(abridge),
  ];
}
