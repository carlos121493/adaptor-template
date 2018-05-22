import styles from './mockPannel.less';

export default (title) => (content) => {
  return (<div className={styles.mockBox}>
    <div className={styles.mockTitle}>
      <h3>{title}</h3>
    </div>
    <div className={styles.mockBody}>
      {content}
    </div>
  </div>);
};
