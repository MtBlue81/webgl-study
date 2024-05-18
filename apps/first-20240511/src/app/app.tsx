import { useRef, useState } from 'react';
import styles from './app.module.css';

import { useRenderer } from './useRenderer';

export function App() {
  const ref = useRef(null);
  const [currentCameraIndex, setCurrentCameraIndex] = useState(0);

  const { cameraPositions } = useRenderer(ref, currentCameraIndex);

  return (
    <div>
      <canvas ref={ref} />
      <div className={styles.control}>
        <button
          onClick={() => {
            setCurrentCameraIndex((prev) => (prev === 0 ? 1 : 0));
          }}
        >
          カメラ切り替え
        </button>
        <pre>{JSON.stringify(cameraPositions, null, 2)}</pre>
      </div>
    </div>
  );
}

export default App;
