import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GameMode, WeatherType, CameraMode, TelemetryData, ControlsState } from '../types/game';
import { soundEngine } from '../audio/engineSound';

interface RacingCanvasProps {
  isRunning: boolean;
  isPaused: boolean;
  gameMode: GameMode;
  weather: WeatherType;
  carColor: number;
  cameraMode: CameraMode;
  drs: boolean;
  controls: ControlsState;
  onUpdateTelemetry: (data: TelemetryData) => void;
  onFinishRace: (stats: { totalTime: number; bestSpeed: number; pointsEarned: number }) => void;
}

export const RacingCanvas: React.FC<RacingCanvasProps> = ({
  isRunning,
  isPaused,
  gameMode,
  weather,
  carColor,
  cameraMode,
  drs,
  controls,
  onUpdateTelemetry,
  onFinishRace,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // References to keep updated across animation loops without recreation
  const stateRef = useRef({
    isRunning,
    isPaused,
    gameMode,
    weather,
    carColor,
    cameraMode,
    drs,
    controls,
  });

  // Keep stateRef in sync
  useEffect(() => {
    stateRef.current = {
      isRunning,
      isPaused,
      gameMode,
      weather,
      carColor,
      cameraMode,
      drs,
      controls,
    };
  }, [isRunning, isPaused, gameMode, weather, carColor, cameraMode, drs, controls]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- THREE.JS INITIALIZATION ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(weather === 'rain' ? 0x596a78 : 0x91b9d3);
    scene.fog = new THREE.Fog(
      weather === 'rain' ? 0x596a78 : 0x91b9d3,
      weather === 'rain' ? 60 : 100,
      weather === 'rain' ? 340 : 520
    );

    const camera = new THREE.PerspectiveCamera(68, window.innerWidth / window.innerHeight, 0.1, 1200);
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      stencil: false,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    const clock = new THREE.Clock();

    // Lighting
    const hemiLight = new THREE.HemisphereLight(0xd9edff, 0x34402b, 2.1);
    scene.add(hemiLight);

    const sun = new THREE.DirectionalLight(0xfff2d8, 3.1);
    sun.position.set(-70, 110, 35);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.near = 10;
    sun.shadow.camera.far = 300;
    const shadowSize = 90;
    sun.shadow.camera.left = -shadowSize;
    sun.shadow.camera.right = shadowSize;
    sun.shadow.camera.top = shadowSize;
    sun.shadow.camera.bottom = -shadowSize;
    scene.add(sun);

    // --- WORLD ENVIRONMENT ---
    const groundMat = new THREE.MeshStandardMaterial({
      color: weather === 'rain' ? 0x33443e : 0x587a4a,
      roughness: 1,
    });
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(1400, 1400), groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.16;
    ground.receiveShadow = true;
    scene.add(ground);

    // Trees
    const treeGroup = new THREE.Group();
    const treeTrunkGeo = new THREE.CylinderGeometry(0.3, 0.45, 3, 7);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5a4027 });
    const crownColors = [0x28563a, 0x376a40, 0x426f3b];

    for (let i = 0; i < 140; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 100 + Math.random() * 430;
      const tree = new THREE.Group();
      const trunk = new THREE.Mesh(treeTrunkGeo, trunkMat);
      trunk.position.y = 1.5;
      trunk.castShadow = true;

      const crownGeo = new THREE.ConeGeometry(2 + Math.random() * 1.5, 5 + Math.random() * 3, 7);
      const crownMat = new THREE.MeshStandardMaterial({ color: crownColors[i % 3] });
      const crown = new THREE.Mesh(crownGeo, crownMat);
      crown.position.y = 5;
      crown.castShadow = true;

      tree.add(trunk, crown);
      tree.position.set(Math.cos(a) * r, 0, Math.sin(a) * r);
      treeGroup.add(tree);
    }
    scene.add(treeGroup);

    // Track barrier blocks
    const barrierGroup = new THREE.Group();
    const barrierColors = [0xffffff, 0xe10600, 0x111827];
    for (let i = 0; i < 28; i++) {
      const mat = new THREE.MeshStandardMaterial({ color: barrierColors[i % 3], roughness: 0.7 });
      const b = new THREE.Mesh(new THREE.BoxGeometry(2, 1.2, 1.8), mat);
      b.position.set((i - 14) * 4, 0.6, -35 - Math.random() * 16);
      b.castShadow = true;
      barrierGroup.add(b);
    }
    scene.add(barrierGroup);

    // --- TRACK GENERATION ---
    const centerPoint = (t: number) => {
      const a = t * Math.PI * 2;
      return new THREE.Vector3(Math.sin(a) * 78, 0, Math.cos(a) * 57);
    };

    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 240; i++) {
      pts.push(centerPoint(i / 240));
    }
    const trackCurve = new THREE.CatmullRomCurve3(pts, true, 'centripetal');

    const N = 480;
    const verts: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    for (let i = 0; i <= N; i++) {
      const t = i / N;
      const p = trackCurve.getPointAt(t);
      const tan = trackCurve.getTangentAt(t);
      const side = new THREE.Vector3(-tan.z, 0, tan.x).normalize();

      for (let j = 0; j < 2; j++) {
        const q = p.clone().addScaledVector(side, j ? 7 : -7);
        verts.push(q.x, 0.02, q.z);
        uvs.push(t * 24, j);
      }
    }

    for (let i = 0; i < N; i++) {
      const a = i * 2;
      indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }

    const roadGeo = new THREE.BufferGeometry();
    roadGeo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
    roadGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    roadGeo.setIndex(indices);
    roadGeo.computeVertexNormals();

    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x292d34,
      roughness: 0.82,
      side: THREE.DoubleSide,
    });
    const road = new THREE.Mesh(roadGeo, roadMat);
    road.receiveShadow = true;
    scene.add(road);

    // Curbs along sides
    const curbGeo = new THREE.BoxGeometry(1.7, 0.18, 0.8);
    const curbMatWhite = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7 });
    const curbMatRed = new THREE.MeshStandardMaterial({ color: 0xe10600, roughness: 0.7 });

    for (const side of [-1, 1]) {
      for (let i = 0; i < 240; i++) {
        const t = i / 240;
        const p = trackCurve.getPointAt(t);
        const tan = trackCurve.getTangentAt(t);
        const s = new THREE.Vector3(-tan.z, 0, tan.x).normalize();
        const q = p.clone().addScaledVector(s, side * 7.7);

        const curb = new THREE.Mesh(curbGeo, i % 2 ? curbMatWhite : curbMatRed);
        curb.position.set(q.x, 0.1, q.z);
        curb.rotation.y = Math.atan2(tan.x, tan.z);
        scene.add(curb);
      }
    }

    // Start/Finish Line
    const pStart = trackCurve.getPointAt(0);
    const tanStart = trackCurve.getTangentAt(0);
    const startLineMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
    const startLine = new THREE.Mesh(new THREE.BoxGeometry(14, 0.035, 0.8), startLineMat);
    startLine.position.set(pStart.x, 0.07, pStart.z);
    startLine.rotation.y = Math.atan2(tanStart.x, tanStart.z);
    scene.add(startLine);

    // --- CAR BUILDER ---
    function makeCar(color: number) {
      const g = new THREE.Group();
      const paint = new THREE.MeshStandardMaterial({
        color,
        metalness: 0.55,
        roughness: 0.22,
      });
      const dark = new THREE.MeshStandardMaterial({
        color: 0x10141b,
        metalness: 0.25,
        roughness: 0.45,
      });
      const carbon = new THREE.MeshStandardMaterial({
        color: 0x0a0d11,
        roughness: 0.6,
      });

      // Chassis Body
      const body = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.48, 3.8), paint);
      body.position.y = 0.65;
      body.castShadow = true;
      body.receiveShadow = true;
      g.add(body);

      // Aerodynamic Front Nose
      const nose = new THREE.Mesh(new THREE.ConeGeometry(0.65, 2.1, 4), paint);
      nose.rotation.x = Math.PI / 2;
      nose.position.set(0, 0.52, -2.35);
      nose.scale.set(1, 0.6, 1);
      nose.castShadow = true;
      g.add(nose);

      // Front Wing
      const frontWing = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.08, 0.5), carbon);
      frontWing.position.set(0, 0.38, -3.2);
      frontWing.castShadow = true;
      g.add(frontWing);

      // Cockpit / Helmet
      const cockpit = new THREE.Mesh(new THREE.SphereGeometry(0.52, 16, 10), dark);
      cockpit.scale.set(0.8, 0.5, 1.05);
      cockpit.position.set(0, 1.03, -0.25);
      cockpit.castShadow = true;
      g.add(cockpit);

      // Driver Helmet
      const helmet = new THREE.Mesh(
        new THREE.SphereGeometry(0.24, 16, 12),
        new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.8, roughness: 0.2 })
      );
      helmet.position.set(0, 1.15, -0.3);
      helmet.castShadow = true;
      g.add(helmet);

      // Rear Spoiler / Wing
      const wing = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.12, 0.45), dark);
      wing.position.set(0, 0.95, 1.75);
      wing.castShadow = true;
      g.add(wing);

      const wingPillarL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.4, 0.2), carbon);
      wingPillarL.position.set(-0.6, 0.75, 1.75);
      const wingPillarR = wingPillarL.clone();
      wingPillarR.position.x = 0.6;
      g.add(wingPillarL, wingPillarR);

      // 4 Racing Tyres & Hubs
      const hubMat = new THREE.MeshStandardMaterial({ color: 0xc4c7cb, metalness: 0.9, roughness: 0.2 });
      for (const x of [-1, 1]) {
        for (const z of [-1.25, 1.25]) {
          const w = new THREE.Mesh(new THREE.CylinderGeometry(0.39, 0.39, 0.28, 16), dark);
          w.rotation.z = Math.PI / 2;
          w.position.set(x * 1.02, 0.42, z);
          w.castShadow = true;
          g.add(w);

          const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.3, 12), hubMat);
          hub.rotation.z = Math.PI / 2;
          hub.position.copy(w.position);
          g.add(hub);
        }
      }

      // Exhaust tail light (LED rain light / DRS glow)
      const rainLight = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.12, 0.05),
        new THREE.MeshBasicMaterial({ color: 0xff0000 })
      );
      rainLight.position.set(0, 0.5, 1.95);
      g.add(rainLight);

      return { group: g, paintMat: paint, rainLight };
    }

    // Player Car
    const playerCarObj = makeCar(carColor);
    const playerCar = playerCarObj.group;
    const playerCarGroup = new THREE.Group();
    playerCarGroup.add(playerCar);
    scene.add(playerCarGroup);

    // AI Rivals
    const rivalColors = [0x00a6ff, 0xffb000, 0xeeeeee, 0x7a3cff, 0x12c987, 0xf05252, 0xf58ad0];
    const rivals = rivalColors.map((col, i) => {
      const robj = makeCar(col);
      scene.add(robj.group);
      return {
        obj: robj.group,
        t: 0.025 + i * 0.02,
        speed: 0.000072 + Math.random() * 0.000028,
        laneSide: i % 2 === 0 ? 3.4 : -3.4,
      };
    });

    // Rain Particle System
    const rainCount = 750;
    const rainPositions = new Float32Array(rainCount * 3);
    for (let i = 0; i < rainCount; i++) {
      rainPositions[i * 3] = (Math.random() - 0.5) * 170;
      rainPositions[i * 3 + 1] = Math.random() * 65;
      rainPositions[i * 3 + 2] = (Math.random() - 0.5) * 170;
    }
    const rainGeo = new THREE.BufferGeometry();
    rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPositions, 3));
    const rainMat = new THREE.PointsMaterial({
      color: 0xc5d9ee,
      size: 0.14,
      transparent: true,
      opacity: 0.75,
    });
    const rain = new THREE.Points(rainGeo, rainMat);
    scene.add(rain);
    rain.visible = weather === 'rain';

    // Game Physics State
    let speed = 0;
    let steer = 0;
    let progress = 0;
    let lap = 1;
    const lapTimes: number[] = [];
    let currentLapTime = 0;
    let raceTotalTime = 0;
    let careerPoints = +(localStorage.getItem('tapm-points') || 0);
    let bestSpeed = +(localStorage.getItem('tapm-best') || 0);

    // Reposition car at start
    const pInit = trackCurve.getPointAt(0);
    const tanInit = trackCurve.getTangentAt(0);
    playerCarGroup.position.set(pInit.x, 0, pInit.z);
    playerCarGroup.rotation.y = Math.atan2(tanInit.x, tanInit.z);

    // --- ANIMATION / PHYSICS LOOP ---
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const dt = Math.min(clock.getDelta(), 0.04);
      const {
        isRunning: currentRunning,
        isPaused: currentPaused,
        gameMode: currentMode,
        weather: currentWeather,
        cameraMode: currentCamMode,
        drs: currentDrs,
        controls: currentControls,
      } = stateRef.current;

      // Update weather effects dynamically if changed
      if (currentWeather === 'rain') {
        scene.background = new THREE.Color(0x596a78);
        if (scene.fog && scene.fog instanceof THREE.Fog) {
          scene.fog.color.set(0x596a78);
          scene.fog.near = 60;
          scene.fog.far = 340;
        }
        groundMat.color.set(0x33443e);
        rain.visible = true;
      } else {
        scene.background = new THREE.Color(0x91b9d3);
        if (scene.fog && scene.fog instanceof THREE.Fog) {
          scene.fog.color.set(0x91b9d3);
          scene.fog.near = 100;
          scene.fog.far = 520;
        }
        groundMat.color.set(0x587a4a);
        rain.visible = false;
      }

      // Update player car paint if updated
      playerCarObj.paintMat.color.setHex(stateRef.current.carColor);

      if (currentRunning && !currentPaused) {
        currentLapTime += dt;
        raceTotalTime += dt;

        const maxSpeed = currentWeather === 'rain' ? 73 : 90;

        // Acceleration & Braking
        if (currentControls.gas) {
          speed += dt * (currentDrs ? 44 : 35);
        } else {
          speed -= dt * 7.5;
        }

        if (currentControls.brake) {
          speed -= dt * 65;
        }

        speed = Math.max(0, Math.min(maxSpeed, speed));

        // Steering dynamics
        const steerDir = (currentControls.left ? 1 : 0) - (currentControls.right ? 1 : 0);
        steer += steerDir * 2.2 * dt;
        if (!currentControls.left && !currentControls.right) {
          steer *= Math.pow(0.1, dt);
        }
        steer = Math.max(-1, Math.min(1, steer));

        // Track progression
        const tstep = (speed / maxSpeed) * dt * 0.025;
        const prevProgress = progress;
        progress = (progress + tstep + steer * 0.00012 * (speed / 30)) % 1;

        // Lap crossing detection
        if (prevProgress > 0.95 && progress < 0.05 && speed > 18) {
          lapTimes.push(currentLapTime);
          currentLapTime = 0;
          lap++;

          if (lap > 3) {
            // Race finished!
            const reward = currentMode === 'career' ? 100 : 25;
            careerPoints += reward;
            localStorage.setItem('tapm-points', String(careerPoints));

            const finalKm = Math.round(speed * 3.6);
            if (finalKm > bestSpeed) {
              bestSpeed = finalKm;
              localStorage.setItem('tapm-best', String(bestSpeed));
            }

            onFinishRace({
              totalTime: raceTotalTime,
              bestSpeed,
              pointsEarned: reward,
            });
            return;
          }
        }

        // Car 3D Transform on Track Curve
        const pos = trackCurve.getPointAt(progress);
        const tan = trackCurve.getTangentAt(progress);
        const side = new THREE.Vector3(-tan.z, 0, tan.x).normalize();
        pos.addScaledVector(side, steer * 1.85);

        playerCarGroup.position.set(pos.x, 0, pos.z);
        playerCarGroup.rotation.y = Math.atan2(tan.x, tan.z) + steer * 0.14 * (speed / maxSpeed);
        playerCar.rotation.z = -steer * 0.1 * (speed / maxSpeed);

        // Update Rivals
        rivals.forEach((r, i) => {
          r.t = (r.t + r.speed * dt * (speed > 30 ? 1.08 : 0.82)) % 1;
          const rivalProgress = (r.t + progress * 0.12) % 1;
          const rp = trackCurve.getPointAt(rivalProgress);
          const rt = trackCurve.getTangentAt(rivalProgress);
          const rs = new THREE.Vector3(-rt.z, 0, rt.x).normalize();
          rp.addScaledVector(rs, r.laneSide);
          r.obj.position.set(rp.x, 0, rp.z);
          r.obj.rotation.y = Math.atan2(rt.x, rt.z);
        });

        // Camera Positioning
        const followPos = playerCarGroup.position.clone();
        const carForward = tan.clone();

        if (currentCamMode === 0) {
          // Chase Camera
          const target = followPos.clone().add(new THREE.Vector3(0, 2.6, 0));
          const camPos = followPos.clone().addScaledVector(carForward, -8.2).add(new THREE.Vector3(0, 4.3, 0));
          camera.position.lerp(camPos, 1 - Math.exp(-dt * 4.5));
          camera.lookAt(target);
        } else if (currentCamMode === 1) {
          // Cockpit / Helmet Camera
          const camPos = followPos.clone().add(new THREE.Vector3(0, 1.2, 0)).addScaledVector(carForward, 0.2);
          camera.position.copy(camPos);
          camera.lookAt(camPos.clone().addScaledVector(carForward, 15).add(new THREE.Vector3(0, -0.4, 0)));
        } else {
          // Action / Close Chase Camera
          const camPos = followPos.clone().addScaledVector(carForward, -4.2).add(new THREE.Vector3(0, 2.2, 0));
          camera.position.lerp(camPos, 1 - Math.exp(-dt * 7));
          camera.lookAt(followPos.clone().addScaledVector(carForward, 3.5));
        }

        // Rain Particles Update
        if (currentWeather === 'rain' && rain) {
          rain.position.copy(playerCarGroup.position);
          const posArr = rain.geometry.attributes.position.array as Float32Array;
          for (let i = 0; i < rainCount; i++) {
            posArr[i * 3 + 1] -= dt * 36;
            if (posArr[i * 3 + 1] < 0) {
              posArr[i * 3 + 1] = 55;
            }
          }
          rain.geometry.attributes.position.needsUpdate = true;
        }

        // Sound Update
        soundEngine.update(speed, maxSpeed, currentControls.brake, currentDrs);

        // Telemetry calculation
        const kmh = Math.round(speed * 3.6);
        const rpm = Math.round(1200 + speed * 78 + (currentDrs ? 900 : 0));
        const rpmPercent = Math.min(100, (speed / maxSpeed) * 100);
        // Dynamic position based on speed and lap progress
        const computedPos = Math.max(1, Math.min(8, 8 - Math.floor(speed / 16)));

        if (kmh > bestSpeed) {
          bestSpeed = kmh;
          localStorage.setItem('tapm-best', String(bestSpeed));
        }

        onUpdateTelemetry({
          speedKmh: kmh,
          rawSpeed: speed,
          maxSpeed,
          rpm,
          rpmPercent,
          position: computedPos,
          totalRacers: 8,
          lap: Math.min(3, lap),
          maxLaps: 3,
          drs: currentDrs,
          careerPoints,
          bestSpeed,
          lapTimes,
          currentLapTime,
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    // Window Resize Handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [weather]); // Rebuild when weather ground textures shift

  return <div ref={containerRef} className="fixed inset-0 w-full h-full overflow-hidden" />;
};
