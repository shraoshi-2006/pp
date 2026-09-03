// ======================================================
// 3D COSMIC UNIVERSE BACKGROUND (Three.js)
// Featuring multi-depth starfields, floating constellation geometry,
// interactive mouse parallax, and adaptive theme responsiveness.
// ======================================================

(function () {
  'use strict';

  function initBackground() {
    const canvas = document.querySelector('#bg-canvas');
    if (!canvas || typeof THREE === 'undefined') {
      return;
    }

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    // 2. WebGL Renderer with High-Performance Settings
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

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
    // Layer A: Far Ambient Starfield
    const farCount = 2000;
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

    // Layer B: Mid-Range Colored Cosmic Particles
    const midCount = 900;
    const midGeo = new THREE.BufferGeometry();
    const midPos = new Float32Array(midCount * 3);
    const midColors = new Float32Array(midCount * 3);
    const palette = [
      new THREE.Color(0x00f2fe), // Electric Cyan
      new THREE.Color(0xa855f7), // Neon Violet
      new THREE.Color(0xffd166), // Celestial Gold
      new THREE.Color(0xffffff)  // Pure White
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

    // Layer C: Near Twinkling Cyber Stars
    const nearCount = 120;
    const nearGeo = new THREE.BufferGeometry();
    const nearPos = new Float32Array(nearCount * 3);
    for (let i = 0; i < nearCount * 3; i += 3) {
      nearPos[i] = (Math.random() - 0.5) * 60;
      nearPos[i + 1] = (Math.random() - 0.5) * 60;
      nearPos[i + 2] = (Math.random() - 0.5) * 30 + 10;
    }
    nearGeo.setAttribute('position', new THREE.BufferAttribute(nearPos, 3));
    const nearMat = new THREE.PointsMaterial({
      size: 0.55,
      map: starTextureViolet,
      transparent: true,
      opacity: 0.9,
      depthWrite: false
    });
    const nearStars = new THREE.Points(nearGeo, nearMat);
    scene.add(nearStars);

    // 5. Floating Geometric Constellation Core (3D Wireframe Icosahedron & Node Lattice)
    const coreGroup = new THREE.Group();

    // Outer Wireframe Icosahedron
    const icoGeometry = new THREE.IcosahedronGeometry(7, 1);
    const icoWireframe = new THREE.WireframeGeometry(icoGeometry);
    const icoMaterial = new THREE.LineBasicMaterial({
      color: 0x904cf7,
      transparent: true,
      opacity: 0.22,
      linewidth: 1
    });
    const icoLine = new THREE.LineSegments(icoWireframe, icoMaterial);
    coreGroup.add(icoLine);

    // Inner Concentric Dodecahedron
    const innerGeometry = new THREE.DodecahedronGeometry(4.2, 0);
    const innerWireframe = new THREE.WireframeGeometry(innerGeometry);
    const innerMaterial = new THREE.LineBasicMaterial({
      color: 0x00d4ff,
      transparent: true,
      opacity: 0.28,
      linewidth: 1
    });
    const innerLine = new THREE.LineSegments(innerWireframe, innerMaterial);
    coreGroup.add(innerLine);

    // Constellation Vertex Node Spheres
    const nodesGeometry = new THREE.BufferGeometry();
    const icoVertices = icoGeometry.attributes.position.array;
    nodesGeometry.setAttribute('position', new THREE.BufferAttribute(icoVertices, 3));
    const nodesMaterial = new THREE.PointsMaterial({
      size: 0.35,
      map: starTextureGold,
      transparent: true,
      opacity: 0.7,
      depthWrite: false
    });
    const nodesPoints = new THREE.Points(nodesGeometry, nodesMaterial);
    coreGroup.add(nodesPoints);

    // Position Constellation Core in upper-right 3D space
    coreGroup.position.set(16, 2, -10);
    scene.add(coreGroup);

    // 6. Interactive Mouse Parallax Tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    window.addEventListener('mousemove', (event) => {
      targetX = (event.clientX - windowHalfX) * 0.0004;
      targetY = (event.clientY - windowHalfY) * 0.0004;
    }, { passive: true });

    // 7. Theme Adaptation System
    function applyThemeToThree(theme) {
      const isLight = theme === 'light';
      farMat.opacity = isLight ? 0.35 : 0.75;
      midMat.opacity = isLight ? 0.45 : 0.85;
      nearMat.opacity = isLight ? 0.5 : 0.9;
      icoMaterial.opacity = isLight ? 0.12 : 0.22;
      innerMaterial.opacity = isLight ? 0.16 : 0.28;
      nodesMaterial.opacity = isLight ? 0.4 : 0.7;
    }

    // Observe data-theme changes on html
    const themeObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
          applyThemeToThree(currentTheme);
        }
      });
    });
    themeObserver.observe(document.documentElement, { attributes: true });
    applyThemeToThree(document.documentElement.getAttribute('data-theme') || 'dark');

    // 8. Animation & Render Loop
    let clock = new THREE.Clock();

    function animate() {
      const elapsedTime = clock.getElapsedTime();

      // Smooth interpolation for mouse parallax
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      // Organic rotation for star layers
      farStars.rotation.y += 0.0001;
      farStars.rotation.x += 0.00005;

      midStars.rotation.y += 0.0002;
      midStars.rotation.x -= 0.0001;

      nearStars.rotation.y += 0.0003;
      nearStars.rotation.x += 0.00015;

      // Parallax mouse responsiveness
      camera.position.x += (mouseX * 25 - camera.position.x) * 0.04;
      camera.position.y += (-mouseY * 25 - camera.position.y) * 0.04;
      camera.lookAt(scene.position);

      // Core constellation rotation & breathing pulse
      coreGroup.rotation.x = elapsedTime * 0.12 + mouseY * 2;
      coreGroup.rotation.y = elapsedTime * 0.18 + mouseX * 2;
      coreGroup.rotation.z = Math.sin(elapsedTime * 0.2) * 0.15;

      const pulse = 1 + Math.sin(elapsedTime * 0.8) * 0.04;
      coreGroup.scale.set(pulse, pulse, pulse);

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    animate();

    // 9. Resize Handling
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBackground);
  } else {
    initBackground();
  }
})();
