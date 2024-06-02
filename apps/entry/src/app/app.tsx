import styles from './app.module.css';

import { Route, Routes, NavLink } from 'react-router-dom';

import {Page as FirstPage} from '@reports/first-20240511'
import {Page as SecondPage} from '@reports/second-20240525'

export function App() {

  return (
    <div>
      <div className={styles.nav}>
        <NavLink to="20240511">1st(2024/05/11)</NavLink>
        <NavLink to="20240525">2nd(2024/05/25)</NavLink>
        <a href='https://github.com/MtBlue81/webgl-study' target='_blank' rel="noreferrer">Code</a>
      </div>
      
      <Routes>
        <Route
          path="20240511"
          element={<FirstPage/>}
        />
        <Route
          path="20240525"
          element={<SecondPage/>}
        />
      </Routes>
    </div>
  );
}

export default App;
