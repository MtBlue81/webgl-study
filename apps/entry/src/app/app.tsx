import styles from './app.module.css';

import { Route, Routes, NavLink } from 'react-router-dom';

import {Page as FirstPage} from '@reports/first-20240511'
import { Redirect } from './redirect';

export function App() {

  return (
    <div>
      <div className={styles.nav}>
        <NavLink to="20240511">1st(2024/05/11)</NavLink>
        <a href='https://github.com/MtBlue81/webgl-study' target='_blank' rel="noreferrer">Code</a>
      </div>
      
      <Routes>
        <Route
          path="20240511"
          element={<FirstPage/>}
        />
        <Route index element={<Redirect/>}/>
      </Routes>
    </div>
  );
}

export default App;
