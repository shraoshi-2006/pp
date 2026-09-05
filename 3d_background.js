// ======================================================
// 3D COSMIC UNIVERSE BACKGROUND (Three.js)
// Featuring multi-depth starfields, floating constellation geometry,
// interactive mouse parallax, reduced-motion support, and visibility pausing.
// ======================================================

(function () {
  'use strict';

  function initBackground() {
    const canvas = document.querySelector('#bg-canvas');
    if (!canvas || typeof THREE === 'undefined') {
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    // 2. WebGL Renderer with High-Performance Settings
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: !isMobile,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));

    // 3. Radial Star Texture Generator
    function createGlowStarTexture(innerColor, outerColor) {
      const size = 64;
      const starCanvas = document.createElement('canvas');
      starCanvas.width = size;
      starCanvas.height = size;

      const ctx = starCanvas.getContext('2d');
      const center = size / 2;
      const radius = size / 2 - 2;

      const gradient = ctx.createRadialGradient(center, center, 0, center, center, radius);
      gradient.addColorStop(0, innerColor || 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.2, innerColor ? innerColor.replace('1)', '0.8)') : 'rgba(255, 255, 255, 0.8)');
      gradient.addColorStop(0.55, outerColor || 'rgba(168, 85, 247, 0.35)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.beginPath();
      ctx.arc(center, center, radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      return new THREE.CanvasTexture(starCanvas);
    }

    const starTextureWhite = createGlowStarTexture('rgba(255, 255, 255, 1)', 'rgba(0, 242, 254, 0.4)');
    const starTextureCyan = createGlowStarTexture('rgba(0, 242, 254, 1)', 'rgba(168, 85, 247, 0.3)');
    const starTextureViolet = createGlowStarTexture('rgba(168, 85, 247, 1)', 'rgba(236, 72, 153, 0.3)');
    const starTextureGold = createGlowStarTexture('rgba(255, 209, 102, 1)', 'rgba(255, 107, 107, 0.3)');

    // 4. Multi-Layered Star Systems
    const farCount = isMobile ? 800 : 1600;
    const farGeo = new THREE.BufferGeometry();
    const farPos = new Float32Array(farCount * 3);
    for (let i = 0; i < farCount * 3; i += 3) {
      farPos[i] = (Math.random() - 0.5) * 140;
      farPos[i + 1] = (Math.random() - 0.5) * 140;
      farPos[i + 2] = (Math.random() - 0.5) * 80 - 20;
    }
    farGeo.setAttribute('position', new THREE.BufferAttribute(farPos, 3));
    const farMat = new THREE.PointsMaterial({
      size: 0.16,
      map: starTextureWhite,
      transparent: true,
      opacity: 0.75,
      depthWrite: false
    });
    const farStars = new THREE.Points(farGeo, farMat);
    scene.add(farStars);

    // Mid-Range Colored Cosmic Particles
    const midCount = isMobile ? 400 : 800;
    const midGeo = new THREE.BufferGeometry();
    const midPos = new Float32Array(midCount * 3);
    const midColors = new Float32Array(midCount * 3);
    const palette = [
      new THREE.Color(0x00f2fe),
      new THREE.Color(0xa855f7),
      new THREE.Color(0xffd166),
      new THREE.Color(0xffffff)
    ];

    for (let i = 0; i < midCount; i++) {
      const idx = i * 3;
      midPos[idx] = (Math.random() - 0.5) * 90;
      midPos[idx + 1] = (Math.random() - 0.5) * 90;
      midPos[idx + 2] = (Math.random() - 0.5) * 50;

      const chosenColor = palette[Math.floor(Math.random() * palette.length)];
      midColors[idx] = chosenColor.r;
      midColors[idx + 1] = chosenColor.g;
      midColors[idx + 2] = chosenColor.b;
    }
    midGeo.setAttribute('position', new THREE.BufferAttribute(midPos, 3));
    midGeo.setAttribute('color', new THREE.BufferAttribute(midColors, 3));

    const midMat = new THREE.PointsMaterial({
      size: 0.28,
      vertexColors: true,
      map: starTextureCyan,
      transparent: true,
      opacity: 0.85,
      depthWrite: false
    });
    const midStars = new THREE.Points(midGeo, midMat);
    scene.add(midStars);

    // Near Twinkling Cyber Stars
    const nearCount = isMobile ? 60 : 100;
    const nearGeo = new THREE.BufferGeometry();
    const nearPos = new Float32Array(nearCount * 3);
    for (let i = 0; i < nearCount * 3; i += 3) {
      nearPos[i] = (Math.random() - 0.5) * 60;
      nearPos[i + 1] = (Math.random() - 0.5) * 60;
      nearPos[i + 2] = (Math.random() - 0.5) * 30 + 10;
    }
    nearGeo.setAttribute('position', new THREE.BufferAttribute(nearPos, 3));
    const nearMat = new THREE.PointsMaterial({
      size: 0.52,
      map: starTextureViolet,
      transparent: true,
      opacity: 0.9,
      depthWrite: false
    });
    const nearStars = new THREE.Points(nearGeo, nearMat);
    scene.add(nearStars);

    // 5. Floating Geometric Constellation Core
    const coreGroup = new THREE.Group();

    const icoGeometry = new THREE.IcosahedronGeometry(6.5, 1);
    const icoWireframe = new THREE.WireframeGeometry(icoGeometry);
    const icoMaterial = new THREE.LineBasicMaterial({
      color: 0x904cf7,
      transparent: true,
      opacity: 0.2,
      linewidth: 1
    });
    const icoLine = new THREE.LineSegments(icoWireframe, icoMaterial);
    coreGroup.add(icoLine);

    const innerGeometry = new THREE.DodecahedronGeometry(4, 0);
    const innerWireframe = new THREE.WireframeGeometry(innerGeometry);
    const innerMaterial = new THREE.LineBasicMaterial({
      color: 0x00d4ff,
      transparent: true,
      opacity: 0.26,
      linewidth: 1
    });
    const innerLine = new THREE.LineSegments(innerWireframe, innerMaterial);
    coreGroup.add(innerLine);

    const nodesGeometry = new THREE.BufferGeometry();
    const icoVertices = icoGeometry.attributes.position.array;
    nodesGeometry.setAttribute('position', new THREE.BufferAttribute(icoVertices, 3));
    const nodesMaterial = new THREE.PointsMaterial({
      size: 0.32,
      map: starTextureGold,
      transparent: true,
      opacity: 0.65,
      depthWrite: false
    });
    const nodesPoints = new THREE.Points(nodesGeometry, nodesMaterial);
    coreGroup.add(nodesPoints);

    coreGroup.position.set(isMobile ? 0 : 15, isMobile ? 12 : 2, -10);
    scene.add(coreGroup);

    // 6. Interactive Mouse Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    if (!isMobile) {
      window.addEventListener('mousemove', (event) => {
        targetX = (event.clientX - windowHalfX) * 0.0003;
        targetY = (event.clientY - windowHalfY) * 0.0003;
      }, { passive: true });
    }

    // 7. Animation & Render Loop with Tab Visibility Pausing
    let clock = new THREE.Clock();
    let isPageVisible = true;
    let animFrameId = null;

    document.addEventListener('visibilitychange', () => {
      isPageVisible = !document.hidden;
      if (isPageVisible) {
        clock.start();
        animate();
      } else if (animFrameId) {
        cancelAnimationFrame(animFrameId);
      }
    });

    function animate() {
      if (!isPageVisible) return;

      const elapsedTime = clock.getElapsedTime();

      if (!prefersReducedMotion) {
        mouseX += (targetX - mouseX) * 0.05;
        mouseY += (targetY - mouseY) * 0.05;

        farStars.rotation.y += 0.00008;
        farStars.rotation.x += 0.00004;

        midStars.rotation.y += 0.00015;
        midStars.rotation.x -= 0.00008;

        nearStars.rotation.y += 0.00025;

        camera.position.x += (mouseX * 20 - camera.position.x) * 0.03;
        camera.position.y += (-mouseY * 20 - camera.position.y) * 0.03;
        camera.lookAt(scene.position);

        coreGroup.rotation.x = elapsedTime * 0.1 + mouseY * 1.5;
        coreGroup.rotation.y = elapsedTime * 0.15 + mouseX * 1.5;

        const pulse = 1 + Math.sin(elapsedTime * 0.7) * 0.03;
        coreGroup.scale.set(pulse, pulse, pulse);
      }

      renderer.render(scene, camera);
      animFrameId = requestAnimationFrame(animate);
    }

    animate();

    // 8. Resize Handling
    window.addEventListener('resize', () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, w < 768 ? 1.5 : 2));
      coreGroup.position.set(w < 768 ? 0 : 15, w < 768 ? 12 : 2, -10);
    }, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBackground);
  } else {
    initBackground();
  }
})();
