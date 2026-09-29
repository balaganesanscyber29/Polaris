// POLARIS: Interactive 3D Polar Station Digital Twin (Three.js WebGL)
// Renders Bharati/Maitri/Himadri Polar Base, dynamic rotating wind turbines, bifacial solar field,
// glowing microgrid power conduits, blizzard snow particle physics, and Aurora Australis.

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function PolarStation3D({
  station,
  windSpeedKmh = 35,
  isKatabaticStorm = false,
  isPolarNight = false,
  isDeIcing = false,
  onSelectComponent,
  activeComponentId
}) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const animationFrameRef = useRef(null);
  const turbineRotorsRef = useRef([]);
  const snowParticlesRef = useRef(null);
  const energyPulsesRef = useRef([]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene Setup
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 450;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Polar Fog & Background
    const fogColor = isPolarNight ? 0x050a14 : (isKatabaticStorm ? 0x1e293b : 0x0b172a);
    scene.background = new THREE.Color(fogColor);
    scene.fog = new THREE.FogExp2(fogColor, isKatabaticStorm ? 0.025 : 0.012);

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 500);
    camera.position.set(38, 22, 45);
    camera.lookAt(0, 4, 0);

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // Clear previous children
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // 4. Lighting & Polar Celestial Glow
    const ambientLight = new THREE.AmbientLight(
      isPolarNight ? 0x1e293b : 0xd0e8ff,
      isPolarNight ? 0.4 : 0.7
    );
    scene.add(ambientLight);

    // Polar Low-Angle Sun Light
    const sunLight = new THREE.DirectionalLight(
      isPolarNight ? 0x38bdf8 : 0xfff2cc,
      isPolarNight ? 0.2 : (isKatabaticStorm ? 0.4 : 1.4)
    );
    sunLight.position.set(50, 18, 30);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 120;
    sunLight.shadow.camera.left = -35;
    sunLight.shadow.camera.right = 35;
    sunLight.shadow.camera.top = 35;
    sunLight.shadow.camera.bottom = -35;
    scene.add(sunLight);

    // Aurora Australis / Ambient Cyan Glow
    const auroraLight = new THREE.PointLight(0x00f2fe, 1.2, 80);
    auroraLight.position.set(-15, 30, -20);
    scene.add(auroraLight);

    // 5. Antarctic Terrain (Snow & Ice Bedrock)
    const terrainGeo = new THREE.PlaneGeometry(140, 140, 48, 48);
    // Add subtle snow drift elevation
    const pos = terrainGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vy = pos.getY(i);
      const vz = Math.sin(vx * 0.08) * Math.cos(vy * 0.08) * 0.8 + Math.sin(vx * 0.2) * 0.3;
      pos.setZ(i, vz);
    }
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0xedf4fc,
      roughness: 0.65,
      metalness: 0.1,
    });
    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    terrain.rotation.x = -Math.PI / 2;
    terrain.position.y = -0.5;
    terrain.receiveShadow = true;
    scene.add(terrain);

    // 6. Bharati-style Main Research Station (Aerodynamic Pod Elevated on Stilts)
    const stationGroup = new THREE.Group();
    stationGroup.userData = { id: 'station-main', name: 'Main Station Pod' };

    // Pod Body (Futuristic metallic shell)
    const podGeo = new THREE.BoxGeometry(18, 5, 9);
    const podMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.7,
      roughness: 0.25,
    });
    const podMesh = new THREE.Mesh(podGeo, podMat);
    podMesh.position.y = 5.5;
    podMesh.castShadow = true;
    podMesh.receiveShadow = true;
    stationGroup.add(podMesh);

    // Panoramic Observation Windows with warm glowing interior
    const windowGeo = new THREE.BoxGeometry(18.1, 1.8, 4.5);
    const windowMat = new THREE.MeshStandardMaterial({
      color: 0x0ea5e9,
      emissive: 0x0369a1,
      emissiveIntensity: 0.7,
      roughness: 0.1,
      metalness: 0.9,
    });
    const windowMesh = new THREE.Mesh(windowGeo, windowMat);
    windowMesh.position.set(0, 6.2, 2.3);
    stationGroup.add(windowMesh);

    // Aerodynamic Beveled Roof
    const roofGeo = new THREE.ConeGeometry(7, 2, 4);
    roofGeo.rotateY(Math.PI / 4);
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.set(0, 8.8, 0);
    roof.scale.set(1.4, 0.8, 1);
    stationGroup.add(roof);

    // Elevated Hydraulic Stilts (4 structural columns preventing snow drifting)
    const stiltPositions = [
      [-7, 2.5, -3.5],
      [7, 2.5, -3.5],
      [-7, 2.5, 3.5],
      [7, 2.5, 3.5],
    ];
    const stiltGeo = new THREE.CylinderGeometry(0.35, 0.45, 5, 12);
    const stiltMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.85, roughness: 0.3 });

    stiltPositions.forEach(stiltPos => {
      const stilt = new THREE.Mesh(stiltGeo, stiltMat);
      stilt.position.set(stiltPos[0], stiltPos[1], stiltPos[2]);
      stilt.castShadow = true;
      stationGroup.add(stilt);
    });

    // Satellite Radome Dome on Station Roof
    const radomeGeo = new THREE.SphereGeometry(1.4, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.55);
    const radomeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
    const radome = new THREE.Mesh(radomeGeo, radomeMat);
    radome.position.set(-6, 8.2, 0);
    stationGroup.add(radome);

    scene.add(stationGroup);

    // 7. Bifacial Solar PV Field
    const solarGroup = new THREE.Group();
    solarGroup.userData = { id: 'solar-pv', name: 'Bifacial Solar Field' };
    const panelGeo = new THREE.BoxGeometry(4.2, 0.15, 2.4);
    const panelMat = new THREE.MeshStandardMaterial({
      color: 0x034c8c,
      emissive: 0x002244,
      metalness: 0.9,
      roughness: 0.15,
    });
    const panelFrameMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8 });

    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 2; c++) {
        const pGroup = new THREE.Group();
        const panel = new THREE.Mesh(panelGeo, panelMat);
        panel.castShadow = true;
        pGroup.add(panel);

        // Mounting pole
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2, 8), panelFrameMat);
        pole.position.set(0, -1, 0);
        pGroup.add(pole);

        pGroup.position.set(-18 + c * 5.5, 2, -10 + r * 5);
        pGroup.rotation.x = 0.5; // Steep tilt angle
        solarGroup.add(pGroup);
      }
    }
    scene.add(solarGroup);

    // 8. Wind Turbines (VAWT / HAWT)
    const turbineRotors = [];
    const turbinePositions = [
      { x: 16, z: -14, type: 'vawt', name: 'VAWT-1' },
      { x: 24, z: -8, type: 'vawt', name: 'VAWT-2' },
      { x: 20, z: 8, type: 'hawt', name: 'HAWT-3' },
    ];

    turbinePositions.forEach((tp, idx) => {
      const tGroup = new THREE.Group();
      tGroup.userData = { id: `turbine-${idx + 1}`, name: tp.name };

      // Tower Mast
      const mastGeo = new THREE.CylinderGeometry(0.3, 0.5, 14, 16);
      const mastMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.6, roughness: 0.3 });
      const mast = new THREE.Mesh(mastGeo, mastMat);
      mast.position.y = 7;
      mast.castShadow = true;
      tGroup.add(mast);

      if (tp.type === 'vawt') {
        // Vertical Axis Wind Turbine Rotor
        const rotorGroup = new THREE.Group();
        rotorGroup.position.y = 12;

        const bladeGeo = new THREE.CylinderGeometry(0.08, 0.08, 6, 8);
        const bladeMat = new THREE.MeshStandardMaterial({
          color: isDeIcing ? 0xf59e0b : 0x00f2fe,
          emissive: isDeIcing ? 0x78350f : 0x0369a1,
          metalness: 0.7,
        });

        for (let b = 0; b < 3; b++) {
          const bAngle = (b * Math.PI * 2) / 3;
          const blade = new THREE.Mesh(bladeGeo, bladeMat);
          blade.position.set(Math.cos(bAngle) * 1.8, 0, Math.sin(bAngle) * 1.8);
          rotorGroup.add(blade);

          // Support strut
          const strutGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.8, 6);
          strutGeo.rotateZ(Math.PI / 2);
          const strut = new THREE.Mesh(strutGeo, mastMat);
          strut.position.set(Math.cos(bAngle) * 0.9, 0, Math.sin(bAngle) * 0.9);
          strut.rotation.y = -bAngle;
          rotorGroup.add(strut);
        }

        tGroup.add(rotorGroup);
        turbineRotors.push({ group: rotorGroup, isVertical: true });

      } else {
        // Horizontal Axis Wind Turbine Rotor
        const nacelleGeo = new THREE.BoxGeometry(1.8, 1, 1);
        const nacelle = new THREE.Mesh(nacelleGeo, mastMat);
        nacelle.position.set(0, 14, 0);
        tGroup.add(nacelle);

        const hubRotorGroup = new THREE.Group();
        hubRotorGroup.position.set(0.9, 14, 0);

        const hub = new THREE.Mesh(new THREE.SphereGeometry(0.5, 12, 12), mastMat);
        hubRotorGroup.add(hub);

        const bladeGeo = new THREE.BoxGeometry(0.3, 5.5, 0.08);
        const bladeMat = new THREE.MeshStandardMaterial({
          color: isDeIcing ? 0xf59e0b : 0xf8fafc,
          metalness: 0.5,
        });

        for (let b = 0; b < 3; b++) {
          const bAngle = (b * Math.PI * 2) / 3;
          const blade = new THREE.Mesh(bladeGeo, bladeMat);
          blade.position.set(0, Math.cos(bAngle) * 2.8, Math.sin(bAngle) * 2.8);
          blade.rotation.x = bAngle;
          blade.castShadow = true;
          hubRotorGroup.add(blade);
        }

        tGroup.add(hubRotorGroup);
        turbineRotors.push({ group: hubRotorGroup, isVertical: false });
      }

      tGroup.position.set(tp.x, 0, tp.z);
      scene.add(tGroup);
    });
    turbineRotorsRef.current = turbineRotors;

    // 9. BESS Thermal Container Unit
    const bessGroup = new THREE.Group();
    bessGroup.userData = { id: 'bess-bank', name: 'BESS Battery Container' };
    const bessGeo = new THREE.BoxGeometry(7, 3.2, 3.5);
    const bessMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      metalness: 0.4,
      roughness: 0.5,
    });
    const bessMesh = new THREE.Mesh(bessGeo, bessMat);
    bessMesh.position.set(-8, 1.6, 15);
    bessMesh.castShadow = true;
    bessGroup.add(bessMesh);

    // Status LED light strip on BESS
    const ledGeo = new THREE.BoxGeometry(6.8, 0.2, 0.1);
    const ledMat = new THREE.MeshBasicMaterial({ color: 0x34d399 });
    const ledMesh = new THREE.Mesh(ledGeo, ledMat);
    ledMesh.position.set(-8, 2.6, 16.8);
    bessGroup.add(ledMesh);
    scene.add(bessGroup);

    // 10. Diesel / Multi-Fuel Genset & CHP Exhaust Heat Recovery House
    const genGroup = new THREE.Group();
    genGroup.userData = { id: 'genset-plant', name: 'CHP Genset Building' };
    const genGeo = new THREE.BoxGeometry(8, 3.8, 5);
    const genMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7, roughness: 0.3 });
    const genMesh = new THREE.Mesh(genGeo, genMat);
    genMesh.position.set(12, 1.9, 16);
    genMesh.castShadow = true;
    genGroup.add(genMesh);

    // CHP Thermal Exhaust Pipe connecting to main building
    const pipeCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(12, 3.8, 16),
      new THREE.Vector3(8, 4.5, 10),
      new THREE.Vector3(4, 5.2, 4),
      new THREE.Vector3(0, 5.5, 0),
    ]);
    const pipeGeo = new THREE.TubeGeometry(pipeCurve, 20, 0.25, 8, false);
    const pipeMat = new THREE.MeshStandardMaterial({
      color: 0xf97316,
      emissive: 0xc2410c,
      emissiveIntensity: 0.6,
      metalness: 0.6,
    });
    const pipeMesh = new THREE.Mesh(pipeGeo, pipeMat);
    scene.add(pipeMesh);
    scene.add(genGroup);

    // 11. Blizzard / Snow Particle Physics System
    const snowCount = isKatabaticStorm ? 2500 : 800;
    const snowGeo = new THREE.BufferGeometry();
    const snowPositions = new Float32Array(snowCount * 3);
    const snowVelocities = new Float32Array(snowCount * 3);

    for (let s = 0; s < snowCount * 3; s += 3) {
      snowPositions[s] = (Math.random() - 0.5) * 100;
      snowPositions[s + 1] = Math.random() * 45;
      snowPositions[s + 2] = (Math.random() - 0.5) * 100;

      snowVelocities[s] = -(Math.random() * 0.8 + 0.4) * (windSpeedKmh / 20); // Drift horizontally with wind
      snowVelocities[s + 1] = -(Math.random() * 0.4 + 0.2); // Fall speed
      snowVelocities[s + 2] = (Math.random() - 0.5) * 0.2;
    }

    snowGeo.setAttribute('position', new THREE.BufferAttribute(snowPositions, 3));
    const snowMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: isKatabaticStorm ? 0.45 : 0.25,
      transparent: true,
      opacity: isKatabaticStorm ? 0.9 : 0.6,
    });

    const snowParticles = new THREE.Points(snowGeo, snowMat);
    scene.add(snowParticles);
    snowParticlesRef.current = { points: snowParticles, velocities: snowVelocities };

    // 12. Microgrid Laser Energy Pulses (Animated Flow Particles)
    const energyPaths = [
      // Solar to Station
      new THREE.CatmullRomCurve3([new THREE.Vector3(-18, 2, -10), new THREE.Vector3(-10, 3, -4), new THREE.Vector3(0, 5, 0)]),
      // Wind to Station
      new THREE.CatmullRomCurve3([new THREE.Vector3(18, 3, -10), new THREE.Vector3(10, 4, -4), new THREE.Vector3(0, 5, 0)]),
      // BESS to Station
      new THREE.CatmullRomCurve3([new THREE.Vector3(-8, 2, 15), new THREE.Vector3(-4, 3, 8), new THREE.Vector3(0, 5, 0)]),
    ];

    const pulseMeshes = energyPaths.map((curve, idx) => {
      const pulseGeo = new THREE.SphereGeometry(0.4, 8, 8);
      const pulseMat = new THREE.MeshBasicMaterial({ color: idx === 2 ? 0x10b981 : 0x00f2fe });
      const pulse = new THREE.Mesh(pulseGeo, pulseMat);
      scene.add(pulse);
      return { mesh: pulse, curve, progress: (idx * 0.33) % 1.0 };
    });
    energyPulsesRef.current = pulseMeshes;

    // 13. Orbit Mouse Controls (Drag to Rotate, Scroll to Zoom)
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let camSpherical = { radius: 65, theta: 0.8, phi: 1.1 };

    const updateCameraPosition = () => {
      camSpherical.phi = Math.max(0.15, Math.min(Math.PI / 2.1, camSpherical.phi));
      camera.position.x = camSpherical.radius * Math.sin(camSpherical.phi) * Math.sin(camSpherical.theta);
      camera.position.y = camSpherical.radius * Math.cos(camSpherical.phi);
      camera.position.z = camSpherical.radius * Math.sin(camSpherical.phi) * Math.cos(camSpherical.theta);
      camera.lookAt(0, 4, 0);
    };
    updateCameraPosition();

    const onMouseDown = (e) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouseX;
      const dy = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      camSpherical.theta -= dx * 0.007;
      camSpherical.phi -= dy * 0.007;
      updateCameraPosition();
    };

    const onMouseUp = () => { isDragging = false; };
    const onWheel = (e) => {
      e.preventDefault();
      camSpherical.radius += e.deltaY * 0.05;
      camSpherical.radius = Math.max(25, Math.min(110, camSpherical.radius));
      updateCameraPosition();
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel, { passive: false });

    // 14. Click Raycasting for Component Selection
    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2();

    const onClick = (e) => {
      const rect = container.getBoundingClientRect();
      mouseVector.x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
      mouseVector.y = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;

      raycaster.setFromCamera(mouseVector, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        let parent = intersects[0].object;
        while (parent && !parent.userData?.id && parent.parent) {
          parent = parent.parent;
        }
        if (parent && parent.userData?.id && onSelectComponent) {
          onSelectComponent(parent.userData.id);
        }
      }
    };
    container.addEventListener('click', onClick);

    // 15. Render Loop
    let clock = new THREE.Clock();
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const speedRps = (windSpeedKmh / 3.6) * 0.12;

      // Rotate Turbines
      turbineRotors.forEach(r => {
        if (r.isVertical) {
          r.group.rotation.y += speedRps * delta * 5;
        } else {
          r.group.rotation.x += speedRps * delta * 5;
        }
      });

      // Animate Snow Particles
      if (snowParticlesRef.current) {
        const pArr = snowParticlesRef.current.points.geometry.attributes.position.array;
        const vArr = snowParticlesRef.current.velocities;
        for (let i = 0; i < pArr.length; i += 3) {
          pArr[i] += vArr[i] * delta * 60;
          pArr[i + 1] += vArr[i + 1] * delta * 60;
          pArr[i + 2] += vArr[i + 2] * delta * 60;

          // Reset fallen / blown away snow
          if (pArr[i + 1] < -0.5 || Math.abs(pArr[i]) > 50) {
            pArr[i] = (Math.random() - 0.5) * 100;
            pArr[i + 1] = 40 + Math.random() * 5;
            pArr[i + 2] = (Math.random() - 0.5) * 100;
          }
        }
        snowParticlesRef.current.points.geometry.attributes.position.needsUpdate = true;
      }

      // Animate Energy Laser Pulses
      energyPulsesRef.current.forEach(p => {
        p.progress = (p.progress + delta * 0.4) % 1.0;
        const point = p.curve.getPoint(p.progress);
        p.mesh.position.copy(point);
      });

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('wheel', onWheel);
      container.removeEventListener('click', onClick);
      if (rendererRef.current?.domElement && container.contains(rendererRef.current.domElement)) {
        container.removeChild(rendererRef.current.domElement);
      }
      renderer.dispose();
    };
  }, [station, windSpeedKmh, isKatabaticStorm, isPolarNight, isDeIcing]);

  return (
    <div className="relative w-full h-full min-h-[420px] rounded-2xl overflow-hidden glass-panel border border-cyan-500/30">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      
      {/* 3D Viewport Controls & HUD Overlay */}
      <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-cyan-500/20 text-xs flex items-center space-x-2 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        <span className="font-mono text-cyan-300 font-semibold">3D DIGITAL TWIN (WebGL)</span>
        <span className="text-slate-400">| Drag to Rotate | Scroll to Zoom</span>
      </div>

      {/* Extreme Weather Indicator Badge */}
      {isKatabaticStorm && (
        <div className="absolute top-3 right-3 bg-rose-950/90 text-rose-300 border border-rose-500/40 px-3 py-1.5 rounded-lg text-xs font-mono flex items-center space-x-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-rose-500" />
          <span>KATABATIC BLIZZARD REGIME ACTIVE ({windSpeedKmh} km/h)</span>
        </div>
      )}

      {/* Quick Component Inspector Legend */}
      <div className="absolute bottom-3 left-3 right-3 bg-slate-950/75 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-700/60 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => onSelectComponent && onSelectComponent('station-main')}
            className="flex items-center space-x-1.5 text-slate-300 hover:text-cyan-300 transition-colors"
          >
            <span className="w-2.5 h-2.5 rounded-sm bg-cyan-500" />
            <span>Main Pod</span>
          </button>
          <button
            onClick={() => onSelectComponent && onSelectComponent('solar-pv')}
            className="flex items-center space-x-1.5 text-slate-300 hover:text-amber-300 transition-colors"
          >
            <span className="w-2.5 h-2.5 rounded-sm bg-blue-500" />
            <span>Bifacial PV ({station.energySystem.solarPV.capacityKwp} kWp)</span>
          </button>
          <button
            onClick={() => onSelectComponent && onSelectComponent('turbine-1')}
            className="flex items-center space-x-1.5 text-slate-300 hover:text-teal-300 transition-colors"
          >
            <span className="w-2.5 h-2.5 rounded-sm bg-cyan-300" />
            <span>Wind Array ({station.energySystem.windTurbines.reduce((s, w) => s + w.capacityKw, 0)} kW)</span>
          </button>
          <button
            onClick={() => onSelectComponent && onSelectComponent('bess-bank')}
            className="flex items-center space-x-1.5 text-slate-300 hover:text-emerald-300 transition-colors"
          >
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
            <span>BESS Bank ({station.energySystem.bess.capacityKwh} kWh)</span>
          </button>
          <button
            onClick={() => onSelectComponent && onSelectComponent('genset-plant')}
            className="flex items-center space-x-1.5 text-slate-300 hover:text-orange-300 transition-colors"
          >
            <span className="w-2.5 h-2.5 rounded-sm bg-orange-500" />
            <span>CHP Genset (42% Heat Recovery)</span>
          </button>
        </div>
        <div className="text-slate-400 font-mono text-[11px]">
          Click any 3D node to inspect telemetry
        </div>
      </div>
    </div>
  );
}
