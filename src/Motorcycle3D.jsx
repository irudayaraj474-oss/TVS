/**
 * Motorcycle3D.jsx — Three.js 3D motorcycle scene.
 * Loaded lazily via React.lazy so it never blocks initial page render.
 * Uses THREE.Timer (not deprecated THREE.Clock) to avoid Best Practices warnings.
 */
import { useState, useEffect, useRef } from "react";
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default function Motorcycle3D({ color = "#FF4500", animated = false }) {
  const mountRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const accentLightRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 400;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(-3.5, 1.8, 5.5);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.minDistance = 3.5;
    controls.maxDistance = 8.5;
    controls.maxPolarAngle = Math.PI / 2 - 0.05;
    controls.target.set(0, 0.2, 0);
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.0;

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.95));
    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight1.position.set(5, 10, 7);
    scene.add(dirLight1);
    const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight2.position.set(-5, 5, -7);
    scene.add(dirLight2);
    const accentLight = new THREE.PointLight(color, 8, 15);
    accentLight.position.set(-2.5, 1.5, -2.5);
    scene.add(accentLight);
    accentLightRef.current = accentLight;

    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    const mtlLoader = new MTLLoader();
    mtlLoader.setPath('/3d/');
    mtlLoader.load('tripo_convert_e5af03bc-e3a6-46c9-bea6-0dd340939823.mtl', (materials) => {
      materials.preload();
      const objLoader = new OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.setPath('/3d/');
      objLoader.load(
        'tripo_convert_e5af03bc-e3a6-46c9-bea6-0dd340939823.obj',
        (object) => {
          const box = new THREE.Box3().setFromObject(object);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          object.position.x += (object.position.x - center.x);
          object.position.y += (object.position.y - center.y);
          object.position.z += (object.position.z - center.z);
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 2.8 / maxDim;
          object.scale.set(scale, scale, scale);
          object.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
              if (child.material) {
                child.material.roughness = 0.4;
                child.material.metalness = 0.75;
              }
            }
          });
          modelGroup.add(object);
          setLoading(false);
        },
        (xhr) => {
          if (xhr.total > 0) setProgress(Math.round((xhr.loaded / xhr.total) * 100));
        },
        (error) => {
          console.error('Error loading 3D model:', error);
          setLoading(false);
        }
      );
    });

    const startTime = performance.now();
    let animationFrameId;
    let isVisible = true;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isVisible) return;
      const elapsed = (performance.now() - startTime) / 1000;
      if (animated && modelGroup) {
        modelGroup.position.y = Math.sin(elapsed * 1.2) * 0.08;
      }
      controls.update();
      renderer.render(scene, camera);
    };

    // Pause when page/tab is hidden
    const onVisChange = () => { isVisible = !document.hidden; };
    document.addEventListener("visibilitychange", onVisChange);

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener("visibilitychange", onVisChange);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animated]);

  useEffect(() => {
    if (accentLightRef.current) {
      accentLightRef.current.color.set(new THREE.Color(color));
    }
  }, [color]);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {loading && (
        <div style={{
          position: "absolute", inset: 0, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          background: "rgba(248,250,252,0.85)", borderRadius: 20, zIndex: 10
        }} role="status" aria-live="polite" aria-label={`Loading 3D model ${progress}%`}>
          <div style={{
            width: 44, height: 44, border: "3px solid rgba(15,23,42,0.08)",
            borderTopColor: "#FF4500", borderRadius: "50%",
            animation: "spin-slow 1s linear infinite"
          }} aria-hidden="true" />
          <div style={{ marginTop: 16, fontSize: 14, fontWeight: 700, letterSpacing: "0.05em", color: "#475569" }}>
            Loading 3D Model… {progress}%
          </div>
        </div>
      )}
      <div ref={mountRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
