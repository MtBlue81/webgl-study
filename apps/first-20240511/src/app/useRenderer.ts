import { RefObject, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const initialCameraPositions = [
  {
    x: 30,
    y: 30,
    z: 30,
  },
  {
    x: 0,
    y: 10,
    z: 10,
  },
];

export const useRenderer = (
  canvasRef: RefObject<HTMLCanvasElement>,
  currentCameraIndex: number
) => {
  const cameras = useRef<THREE.PerspectiveCamera[]>([]);
  const controls = useRef<OrbitControls | null>(null);
  const [cameraPositions, setCameraPositions] = useState(
    initialCameraPositions.map((position) => ({ ...position }))
  );

  const scene = useMemo(() => {
    const scene = new THREE.Scene();
    const axesHelper = new THREE.AxesHelper(100);
    scene.add(axesHelper);

    const geometry = new THREE.BoxGeometry();

    for (let i = 0; i < 150; i++) {
      const color = new THREE.Color(
        Math.random(),
        Math.random(),
        Math.random()
      );
      const material = new THREE.MeshToonMaterial({
        color,
        transparent: true,
        opacity: 0.8,
      });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.x = Math.random() * 50 - 25;
      cube.position.y = Math.random() * 50 - 25;
      cube.position.z = Math.random() * 50 - 25;
      scene.add(cube);
    }
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    return scene;
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
    renderer.setClearColor(0xcfcfcf);
    renderer.setSize(window.innerWidth, window.innerHeight);

    initialCameraPositions.forEach((position) => {
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        10000
      );
      camera.position.set(position.x, position.y, position.z);
      cameras.current.push(camera);
    });

    const otherCameraMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.5),
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );
    const otherCameraPosition = (
      cameras.current.find(
        (camera) => camera !== cameras.current[currentCameraIndex]
      ) as THREE.PerspectiveCamera
    ).position;
    otherCameraMesh.position.set(
      otherCameraPosition.x,
      otherCameraPosition.y,
      otherCameraPosition.z
    );
    scene.add(otherCameraMesh);

    controls.current = new OrbitControls(
      cameras.current[currentCameraIndex],
      canvasRef.current
    );
    controls.current.addEventListener('change', (e) => {
      const currentCamera = cameras.current[currentCameraIndex];
      setCameraPositions((prev) => {
        const next = [...prev];
        next[currentCameraIndex] = { ...currentCamera.position };
        return next;
      });
    });

    const render = () => {
      if (cameras.current[currentCameraIndex]) {
        renderer.render(scene, cameras.current[currentCameraIndex]);
      }
      requestAnimationFrame(render);
    };

    render();

    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      cameras.current.forEach((camera) => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
      });
    };
    window.addEventListener('resize', onResize);

    return () => {
      controls.current?.dispose();
      renderer.dispose();
      window.removeEventListener('resize', onResize);
      scene.remove(otherCameraMesh);
    };
  }, [canvasRef, currentCameraIndex, scene]);

  return {
    cameraPositions,
  };
};
