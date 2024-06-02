import { RefObject, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export const useRenderer = (canvasRef: RefObject<HTMLCanvasElement>) => {
  const { scene, fanGroup, baseFan } = useMemo(() => {
    const scene = new THREE.Scene();
    const axesHelper = new THREE.AxesHelper(100);
    scene.add(axesHelper);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const baseFan = createFan();
    const fanGroup = createFanGroup(baseFan);

    scene.add(baseFan);

    return { scene, fanGroup, baseFan };
  }, []);

  const isDown = useRef(false);
  useEffect(() => {
    window.addEventListener(
      'keydown',
      (keyEvent) => {
        switch (keyEvent.key) {
          case ' ':
            isDown.current = true;
            scene.remove(baseFan);
            scene.add(fanGroup);
            break;
          default:
        }
      },
      false
    );
    window.addEventListener(
      'keyup',
      () => {
        isDown.current = false;
        scene.remove(fanGroup);
        scene.add(baseFan);
      },
      false
    );
  }, [baseFan, fanGroup, scene]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
    renderer.setClearColor(0xcfcfcf);
    renderer.setSize(window.innerWidth, window.innerHeight);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );
    camera.position.set(60, 60, 60);

    const control = new OrbitControls(camera, canvasRef.current);
    control.target.set(0, 30, 0);
    control.saveState();
    camera.updateProjectionMatrix();
    control.update();

    let dir = 1;
    const render = () => {
      if (isDown.current) {
        fanGroup.rotation.z += 0.02;
      } else {
        if (
          baseFan.rotation.y > Math.PI / 3 ||
          baseFan.rotation.y < -Math.PI / 3
        ) {
          dir = -1 * dir;
        }
        baseFan.rotation.y += dir * 0.005;
      }

      renderer.render(scene, camera);
      requestAnimationFrame(render);
    };

    render();

    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    return () => {
      control.dispose();
      renderer.dispose();
      window.removeEventListener('resize', onResize);
    };
  }, [baseFan.rotation, canvasRef, fanGroup.rotation, scene]);
};

const createFan = () => {
  const group = new THREE.Group();

  const color = new THREE.Color(Math.random(), Math.random(), Math.random());
  const material = new THREE.MeshToonMaterial({
    color,
    transparent: true,
    opacity: 0.9,
  });

  const upperMesh = new THREE.Mesh(
    new THREE.TorusGeometry(10, 1.5, 12, 48, Math.PI),
    material
  );
  upperMesh.position.y = 70;

  const lowerMesh = new THREE.Mesh(
    new THREE.TorusGeometry(10, 1.5, 12, 48, -Math.PI),
    material
  );
  lowerMesh.position.y = 34;

  const right = new THREE.Mesh(
    new THREE.CylinderGeometry(1.5, 1.5, 36),
    material
  );
  right.position.x = 10;
  right.position.y = 52;

  const left = new THREE.Mesh(
    new THREE.CylinderGeometry(1.5, 1.5, 36),
    material
  );
  left.position.x = -10;
  left.position.y = 52;

  for (let i = -20; i < 20; i++) {
    [upperMesh, lowerMesh, right, left].forEach((mesh) => {
      const m = mesh.clone();
      m.position.z = 0.2 * i;
      group.add(m);
    });
  }

  const stand1 = new THREE.Mesh(
    new THREE.CylinderGeometry(10, 12, 5),
    material
  );
  stand1.position.y = 23;
  group.add(stand1);

  const stand2 = new THREE.Mesh(
    new THREE.CylinderGeometry(12, 12, 21),
    material
  );
  stand2.position.y = 10;
  group.add(stand2);

  return group;
};

const createFanGroup = (base: THREE.Group) => {
  const fanGroup = new THREE.Group();
  fanGroup.rotation.y = Math.PI / 4;
  for (let i = 0; i < 10; i++) {
    const f = base.clone();
    const g = new THREE.Group();
    f.position.y = 30;
    g.add(f);
    g.rotateZ((Math.PI / 5) * i);
    fanGroup.add(g);
  }

  return fanGroup;
};
