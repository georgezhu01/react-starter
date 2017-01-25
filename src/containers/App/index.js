import * as React from 'react';
import classNames from 'classnames/bind';
import AppTop from '../AppTop';
import AppBottom from '../AppBottom';

const cx = classNames.bind(require('./styles.scss'));

const App = ({ children }) => {
  return (
    <div>
      <div className={cx('AppTopContainer')}>
        <AppTop />
      </div>
      <div className={cx('AppMainContainer')}>
        {children}
      </div>
      <div className={cx('AppBottomContainer')}>
        <AppBottom />
      </div>
    </div>
  );
};

export default App;
