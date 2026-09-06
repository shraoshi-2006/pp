/**
 * ====================================================================
 * SHRAOXI PORTFOLIO — HIGH-PERFORMANCE FLUID CURSOR BACKGROUND
 * Real-time Navier-Stokes fluid dynamics simulation in WebGL
 * with seamless 2D Canvas fallback and Cyber-Palette integration.
 * ====================================================================
 */

(function initFluidBackground() {
  'use strict';

  // Check if reduced motion is requested
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const canvas = document.getElementById('fluid-canvas');
  if (!canvas) return;

  // Simulation Configuration
  const CONFIG = {
    SIM_RESOLUTION: 128,          // Internal simulation grid (128 = silky 60-120fps with bilinear filtering)
    DYE_RESOLUTION: 512,          // Dye resolution for crisp, glowing color trails
    DENSITY_DISSIPATION: 0.972,   // How long fluid colors linger (smooth lingering neon trails)
    VELOCITY_DISSIPATION: 0.98,   // Velocity decay
    PRESSURE_ITERATIONS: 20,      // Jacobi solver steps
    CURL: 32,                     // Vorticity / swirliness
    SPLAT_RADIUS: 0.28,           // Base radius of fluid impulse
    SPLAT_FORCE: 6000,            // Velocity force
    AMBIENT_FREQUENCY: 3200,      // Subtle ambient pulse interval (ms)
    COLOR_CYCLE_SPEED: 0.0018     // Palette transition speed
  };

  // Palette: Electric Cyan, Refined Indigo, Cyber Emerald, Neon Violet, Warm Coral
  const PALETTE = [
    { r: 0.22, g: 0.74, b: 0.97 }, // Electric Cyan (#38bdf8)
    { r: 0.39, g: 0.40, b: 0.95 }, // Refined Indigo (#6366f1)
    { r: 0.06, g: 0.73, b: 0.51 }, // Cyber Emerald (#10b981)
    { r: 0.66, g: 0.33, b: 0.97 }, // Neon Violet (#a855f7)
    { r: 0.96, g: 0.25, b: 0.37 }, // Cyber Coral (#f43f5e)
    { r: 0.49, g: 0.83, b: 0.99 }  // Bright Sky (#7dd3fc)
  ];

  function getPaletteColor(t) {
    const total = PALETTE.length;
    const index = (t % total + total) % total;
    const i = Math.floor(index);
    const f = index - i;
    const c1 = PALETTE[i];
    const c2 = PALETTE[(i + 1) % total];
    return {
      r: c1.r + (c2.r - c1.r) * f,
      g: c1.g + (c2.g - c1.g) * f,
      b: c1.b + (c2.b - c1.b) * f
    };
  }

  // Pointer state tracking
  let prevX = null;
  let prevY = null;
  const splatStack = [];
  let isTabActive = true;

  // Track document visibility to pause when inactive
  document.addEventListener('visibilitychange', () => {
    isTabActive = !document.hidden;
  });

  // Initialize WebGL context
  const gl = canvas.getContext('webgl2', { alpha: true, depth: false, antialias: false, preserveDrawingBuffer: false }) ||
             canvas.getContext('webgl', { alpha: true, depth: false, antialias: false, preserveDrawingBuffer: false }) ||
             canvas.getContext('experimental-webgl');

  if (!gl) {
    init2DFallback();
    return;
  }

  // WebGL Extensions detection
  const isWebGL2 = gl instanceof WebGL2RenderingContext;
  let extHalfFloat = gl.getExtension('OES_texture_half_float');
  let extHalfFloatLinear = gl.getExtension('OES_texture_half_float_linear');
  let extFloat = gl.getExtension('OES_texture_float');
  let extFloatLinear = gl.getExtension('OES_texture_float_linear');

  let internalFormat, format, type, filterMode = gl.LINEAR;

  if (isWebGL2) {
    gl.getExtension('EXT_color_buffer_float');
    const linearExt = gl.getExtension('OES_texture_float_linear');
    internalFormat = gl.RGBA16F;
    format = gl.RGBA;
    type = gl.HALF_FLOAT;
    filterMode = linearExt ? gl.LINEAR : gl.NEAREST;
  } else if (extHalfFloat && extHalfFloatLinear) {
    internalFormat = gl.RGBA;
    format = gl.RGBA;
    type = extHalfFloat.HALF_FLOAT_OES;
    filterMode = gl.LINEAR;
  } else if (extFloat && extFloatLinear) {
    internalFormat = gl.RGBA;
    format = gl.RGBA;
    type = gl.FLOAT;
    filterMode = gl.LINEAR;
  } else {
    // Universal 8-bit unsigned byte fallback
    internalFormat = gl.RGBA;
    format = gl.RGBA;
    type = gl.UNSIGNED_BYTE;
    filterMode = gl.LINEAR;
  }

  // Shader compilation helper
  function compileShader(shaderType, source) {
    const shader = gl.createShader(shaderType);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.warn('Shader compile failed: ', gl.getShaderInfoLog(shader));
      return null;
    }
    return shader;
  }

  function createProgram(vertexSrc, fragmentSrc) {
    const vs = compileShader(gl.VERTEX_SHADER, vertexSrc);
    const fs = compileShader(gl.FRAGMENT_SHADER, fragmentSrc);
    if (!vs || !fs) return null;

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn('Program link failed: ', gl.getProgramInfoLog(program));
      return null;
    }

    const uniforms = {};
    const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < count; i++) {
      const info = gl.getActiveUniform(program, i);
      uniforms[info.name] = gl.getUniformLocation(program, info.name);
    }

    return { program, uniforms };
  }

  // Fullscreen quad vertex shader with neighbor UV coordinates
  const baseVertexShader = `
    precision highp float;
    attribute vec2 aPosition;
    varying vec2 vUv;
    varying vec2 vL;
    varying vec2 vR;
    varying vec2 vT;
    varying vec2 vB;
    uniform vec2 uTexelSize;

    void main () {
      vUv = aPosition * 0.5 + 0.5;
      vL = vUv - vec2(uTexelSize.x, 0.0);
      vR = vUv + vec2(uTexelSize.x, 0.0);
      vT = vUv + vec2(0.0, uTexelSize.y);
      vB = vUv - vec2(0.0, uTexelSize.y);
      gl_Position = vec4(aPosition, 0.0, 1.0);
    }
  `;

  // Fragment Shaders
  const clearShader = `
    precision mediump float;
    varying vec2 vUv;
    uniform sampler2D uTexture;
    uniform float uValue;
    void main () {
      gl_FragColor = uValue * texture2D(uTexture, vUv);
    }
  `;

  const splatShader = `
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D uTarget;
    uniform float uAspectRatio;
    uniform vec3 uColor;
    uniform vec2 uPoint;
    uniform float uRadius;

    void main () {
      vec2 p = vUv - uPoint.xy;
      p.x *= uAspectRatio;
      vec3 splat = exp(-dot(p, p) / uRadius) * uColor;
      vec3 base = texture2D(uTarget, vUv).xyz;
      gl_FragColor = vec4(base + splat, 1.0);
    }
  `;

  const advectionShader = `
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D uVelocity;
    uniform sampler2D uSource;
    uniform vec2 uTexelSize;
    uniform float uDt;
    uniform float uDissipation;

    void main () {
      vec2 coord = vUv - uDt * texture2D(uVelocity, vUv).xy * uTexelSize;
      gl_FragColor = uDissipation * texture2D(uSource, coord);
    }
  `;

  const divergenceShader = `
    precision mediump float;
    varying highp vec2 vUv;
    varying highp vec2 vL;
    varying highp vec2 vR;
    varying highp vec2 vT;
    varying highp vec2 vB;
    uniform sampler2D uVelocity;

    void main () {
      float L = texture2D(uVelocity, vL).x;
      float R = texture2D(uVelocity, vR).x;
      float T = texture2D(uVelocity, vT).y;
      float B = texture2D(uVelocity, vB).y;
      float div = 0.5 * (R - L + T - B);
      gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
    }
  `;

  const curlShader = `
    precision mediump float;
    varying highp vec2 vUv;
    varying highp vec2 vL;
    varying highp vec2 vR;
    varying highp vec2 vT;
    varying highp vec2 vB;
    uniform sampler2D uVelocity;

    void main () {
      float L = texture2D(uVelocity, vL).y;
      float R = texture2D(uVelocity, vR).y;
      float T = texture2D(uVelocity, vT).x;
      float B = texture2D(uVelocity, vB).x;
      float vorticity = R - L - T + B;
      gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
    }
  `;

  const vorticityShader = `
    precision highp float;
    varying highp vec2 vUv;
    varying highp vec2 vL;
    varying highp vec2 vR;
    varying highp vec2 vT;
    varying highp vec2 vB;
    uniform sampler2D uVelocity;
    uniform sampler2D uCurl;
    uniform float uCurlScale;
    uniform float uDt;

    void main () {
      float L = texture2D(uCurl, vL).x;
      float R = texture2D(uCurl, vR).x;
      float T = texture2D(uCurl, vT).x;
      float B = texture2D(uCurl, vB).x;
      float C = texture2D(uCurl, vUv).x;

      vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
      force /= length(force) + 0.0001;
      force *= uCurlScale * C;
      force.y *= -1.0;

      vec2 vel = texture2D(uVelocity, vUv).xy;
      gl_FragColor = vec4(vel + force * uDt, 0.0, 1.0);
    }
  `;

  const pressureShader = `
    precision mediump float;
    varying highp vec2 vUv;
    varying highp vec2 vL;
    varying highp vec2 vR;
    varying highp vec2 vT;
    varying highp vec2 vB;
    uniform sampler2D uPressure;
    uniform sampler2D uDivergence;

    void main () {
      float L = texture2D(uPressure, vL).x;
      float R = texture2D(uPressure, vR).x;
      float T = texture2D(uPressure, vT).x;
      float B = texture2D(uPressure, vB).x;
      float divergence = texture2D(uDivergence, vUv).x;
      float pressure = (L + R + B + T - divergence) * 0.25;
      gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
    }
  `;

  const gradientSubtractShader = `
    precision mediump float;
    varying highp vec2 vUv;
    varying highp vec2 vL;
    varying highp vec2 vR;
    varying highp vec2 vT;
    varying highp vec2 vB;
    uniform sampler2D uPressure;
    uniform sampler2D uVelocity;

    void main () {
      float L = texture2D(uPressure, vL).x;
      float R = texture2D(uPressure, vR).x;
      float T = texture2D(uPressure, vT).x;
      float B = texture2D(uPressure, vB).x;
      vec2 velocity = texture2D(uVelocity, vUv).xy;
      velocity.xy -= vec2(R - L, T - B);
      gl_FragColor = vec4(velocity, 0.0, 1.0);
    }
  `;

  const displayShader = `
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D uTexture;

    void main () {
      vec3 c = texture2D(uTexture, vUv).rgb;
      // Vibrant cyber tone curve & smooth alpha blending
      float maxCol = max(c.r, max(c.g, c.b));
      float alpha = clamp(maxCol * 1.35, 0.0, 0.95);
      gl_FragColor = vec4(c, alpha);
    }
  `;

  // Compile programs
  const programs = {
    clear: createProgram(baseVertexShader, clearShader),
    splat: createProgram(baseVertexShader, splatShader),
    advection: createProgram(baseVertexShader, advectionShader),
    divergence: createProgram(baseVertexShader, divergenceShader),
    curl: createProgram(baseVertexShader, curlShader),
    vorticity: createProgram(baseVertexShader, vorticityShader),
    pressure: createProgram(baseVertexShader, pressureShader),
    gradSubtract: createProgram(baseVertexShader, gradientSubtractShader),
    display: createProgram(baseVertexShader, displayShader)
  };

  for (let key in programs) {
    if (!programs[key]) {
      console.warn('WebGL shader initialization failed, falling back to 2D Canvas');
      init2DFallback();
      return;
    }
  }

  // Geometry buffer
  const quadBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1,
     1, -1,
    -1,  1,
     1,  1
  ]), gl.STATIC_DRAW);

  function bindQuad(programObj) {
    gl.useProgram(programObj.program);
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    const loc = gl.getAttribLocation(programObj.program, 'aPosition');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  }

  // Framebuffer Object (FBO) creation
  function createFBO(w, h) {
    gl.activeTexture(gl.TEXTURE0);
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filterMode);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filterMode);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);

    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.viewport(0, 0, w, h);
    gl.clear(gl.COLOR_BUFFER_BIT);

    return {
      texture,
      fbo,
      width: w,
      height: h,
      attach: function (id) {
        gl.activeTexture(gl.TEXTURE0 + id);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        return id;
      }
    };
  }

  function createDoubleFBO(w, h) {
    let fbo1 = createFBO(w, h);
    let fbo2 = createFBO(w, h);

    return {
      width: w,
      height: h,
      texelSizeX: 1.0 / w,
      texelSizeY: 1.0 / h,
      read: () => fbo1,
      write: () => fbo2,
      swap: () => {
        const temp = fbo1;
        fbo1 = fbo2;
        fbo2 = temp;
      }
    };
  }

  let density, velocity, divergence, curl, pressure;

  function initFramebuffers() {
    const simRes = CONFIG.SIM_RESOLUTION;
    const dyeRes = CONFIG.DYE_RESOLUTION;

    density = createDoubleFBO(dyeRes, dyeRes);
    velocity = createDoubleFBO(simRes, simRes);
    divergence = createFBO(simRes, simRes);
    curl = createFBO(simRes, simRes);
    pressure = createDoubleFBO(simRes, simRes);
  }

  initFramebuffers();

  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const width = Math.floor(window.innerWidth * dpr);
    const height = Math.floor(window.innerHeight * dpr);

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Splat functions
  function splatVelocity(x, y, dx, dy, radiusMultiplier = 1.0) {
    bindQuad(programs.splat);
    gl.uniform1i(programs.splat.uniforms.uTarget, velocity.read().attach(0));
    gl.uniform1f(programs.splat.uniforms.uAspectRatio, canvas.width / canvas.height);
    gl.uniform2f(programs.splat.uniforms.uPoint, x, y);
    gl.uniform3f(programs.splat.uniforms.uColor, dx, dy, 0.0);
    gl.uniform1f(programs.splat.uniforms.uRadius, (CONFIG.SPLAT_RADIUS * radiusMultiplier) / 100.0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, velocity.write().fbo);
    gl.viewport(0, 0, velocity.width, velocity.height);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    velocity.swap();
  }

  function splatDye(x, y, color, radiusMultiplier = 1.0) {
    bindQuad(programs.splat);
    gl.uniform1i(programs.splat.uniforms.uTarget, density.read().attach(0));
    gl.uniform1f(programs.splat.uniforms.uAspectRatio, canvas.width / canvas.height);
    gl.uniform2f(programs.splat.uniforms.uPoint, x, y);
    gl.uniform3f(programs.splat.uniforms.uColor, color.r, color.g, color.b);
    gl.uniform1f(programs.splat.uniforms.uRadius, (CONFIG.SPLAT_RADIUS * radiusMultiplier) / 100.0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, density.write().fbo);
    gl.viewport(0, 0, density.width, density.height);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    density.swap();
  }

  function triggerSplat(x, y, dx, dy, color, power = 1.0) {
    splatVelocity(x, y, dx * power, dy * power, Math.max(0.7, power));
    splatDye(x, y, color, Math.max(0.8, power));
  }

  // Animation Step
  let lastTime = performance.now();
  let colorProgress = 0;
  let lastAmbientTime = performance.now();

  function step(time) {
    if (!isTabActive) {
      requestAnimationFrame(step);
      return;
    }

    const dt = Math.min((time - lastTime) / 1000, 0.032);
    lastTime = time;
    colorProgress += CONFIG.COLOR_CYCLE_SPEED;

    // Process splat queue
    while (splatStack.length > 0) {
      const s = splatStack.pop();
      triggerSplat(s.x, s.y, s.dx, s.dy, s.color, s.power || 1.0);
    }

    // Subtle ambient breathing so the page has gentle organic motion
    if (time - lastAmbientTime > CONFIG.AMBIENT_FREQUENCY) {
      lastAmbientTime = time;
      const angle = Math.random() * Math.PI * 2;
      const ax = 0.2 + Math.random() * 0.6;
      const ay = 0.2 + Math.random() * 0.6;
      const color = getPaletteColor(colorProgress + Math.random() * 2);
      triggerSplat(ax, ay, Math.cos(angle) * 120, Math.sin(angle) * 120, color, 0.45);
    }

    // 1. Curl
    bindQuad(programs.curl);
    gl.uniform2f(programs.curl.uniforms.uTexelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(programs.curl.uniforms.uVelocity, velocity.read().attach(0));
    gl.bindFramebuffer(gl.FRAMEBUFFER, curl.fbo);
    gl.viewport(0, 0, velocity.width, velocity.height);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    // 2. Vorticity
    bindQuad(programs.vorticity);
    gl.uniform2f(programs.vorticity.uniforms.uTexelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(programs.vorticity.uniforms.uVelocity, velocity.read().attach(0));
    gl.uniform1i(programs.vorticity.uniforms.uCurl, curl.attach(1));
    gl.uniform1f(programs.vorticity.uniforms.uCurlScale, CONFIG.CURL);
    gl.uniform1f(programs.vorticity.uniforms.uDt, dt);
    gl.bindFramebuffer(gl.FRAMEBUFFER, velocity.write().fbo);
    gl.viewport(0, 0, velocity.width, velocity.height);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    velocity.swap();

    // 3. Divergence
    bindQuad(programs.divergence);
    gl.uniform2f(programs.divergence.uniforms.uTexelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(programs.divergence.uniforms.uVelocity, velocity.read().attach(0));
    gl.bindFramebuffer(gl.FRAMEBUFFER, divergence.fbo);
    gl.viewport(0, 0, velocity.width, velocity.height);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    // 4. Clear Pressure
    bindQuad(programs.clear);
    gl.uniform1i(programs.clear.uniforms.uTexture, pressure.read().attach(0));
    gl.uniform1f(programs.clear.uniforms.uValue, 0.8);
    gl.bindFramebuffer(gl.FRAMEBUFFER, pressure.write().fbo);
    gl.viewport(0, 0, velocity.width, velocity.height);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    pressure.swap();

    // 5. Pressure Solver (Jacobi)
    bindQuad(programs.pressure);
    gl.uniform2f(programs.pressure.uniforms.uTexelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(programs.pressure.uniforms.uDivergence, divergence.attach(0));
    for (let i = 0; i < CONFIG.PRESSURE_ITERATIONS; i++) {
      gl.uniform1i(programs.pressure.uniforms.uPressure, pressure.read().attach(1));
      gl.bindFramebuffer(gl.FRAMEBUFFER, pressure.write().fbo);
      gl.viewport(0, 0, velocity.width, velocity.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      pressure.swap();
    }

    // 6. Gradient Subtract
    bindQuad(programs.gradSubtract);
    gl.uniform2f(programs.gradSubtract.uniforms.uTexelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(programs.gradSubtract.uniforms.uPressure, pressure.read().attach(0));
    gl.uniform1i(programs.gradSubtract.uniforms.uVelocity, velocity.read().attach(1));
    gl.bindFramebuffer(gl.FRAMEBUFFER, velocity.write().fbo);
    gl.viewport(0, 0, velocity.width, velocity.height);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    velocity.swap();

    // 7. Advect Velocity
    bindQuad(programs.advection);
    gl.uniform2f(programs.advection.uniforms.uTexelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(programs.advection.uniforms.uVelocity, velocity.read().attach(0));
    gl.uniform1i(programs.advection.uniforms.uSource, velocity.read().attach(0));
    gl.uniform1f(programs.advection.uniforms.uDt, dt);
    gl.uniform1f(programs.advection.uniforms.uDissipation, CONFIG.VELOCITY_DISSIPATION);
    gl.bindFramebuffer(gl.FRAMEBUFFER, velocity.write().fbo);
    gl.viewport(0, 0, velocity.width, velocity.height);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    velocity.swap();

    // 8. Advect Dye (Density)
    bindQuad(programs.advection);
    gl.uniform2f(programs.advection.uniforms.uTexelSize, density.texelSizeX, density.texelSizeY);
    gl.uniform1i(programs.advection.uniforms.uVelocity, velocity.read().attach(0));
    gl.uniform1i(programs.advection.uniforms.uSource, density.read().attach(1));
    gl.uniform1f(programs.advection.uniforms.uDt, dt);
    gl.uniform1f(programs.advection.uniforms.uDissipation, CONFIG.DENSITY_DISSIPATION);
    gl.bindFramebuffer(gl.FRAMEBUFFER, density.write().fbo);
    gl.viewport(0, 0, density.width, density.height);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    density.swap();

    // 9. Display to Viewport
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    bindQuad(programs.display);
    gl.uniform1i(programs.display.uniforms.uTexture, density.read().attach(0));
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    requestAnimationFrame(step);
  }

  requestAnimationFrame(step);

  // Initial welcome splash
  setTimeout(() => {
    const cx = 0.5;
    const cy = 0.5;
    const c1 = getPaletteColor(0);
    const c2 = getPaletteColor(2);
    splatStack.push({ x: cx - 0.08, y: cy, dx: -240, dy: 140, color: c1, power: 0.9 });
    splatStack.push({ x: cx + 0.08, y: cy, dx: 240, dy: -140, color: c2, power: 0.9 });
  }, 400);

  // Mouse / Pointer Event Listeners
  function handlePointerMove(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const x = (clientX - rect.left) / rect.width;
    const y = 1.0 - (clientY - rect.top) / rect.height; // WebGL Y is inverted

    if (prevX === null || prevY === null) {
      prevX = x;
      prevY = y;
      return;
    }

    const dx = (x - prevX) * CONFIG.SPLAT_FORCE;
    const dy = (y - prevY) * CONFIG.SPLAT_FORCE;
    const dist = Math.hypot(dx, dy);

    if (dist > 0.005) {
      colorProgress += 0.038;
      const color = getPaletteColor(colorProgress);
      const power = Math.min(1.8, 0.65 + dist * 0.00035);
      splatStack.push({ x, y, dx, dy, color, power });
    }

    prevX = x;
    prevY = y;
  }

  window.addEventListener('mousemove', (e) => {
    handlePointerMove(e.clientX, e.clientY);
  }, { passive: true });

  window.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = 1.0 - (e.clientY - rect.top) / rect.height;
    const color = getPaletteColor(colorProgress + 1.2);
    // Radial shockwave on click
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      splatStack.push({
        x: x + Math.cos(angle) * 0.012,
        y: y + Math.sin(angle) * 0.012,
        dx: Math.cos(angle) * 420,
        dy: Math.sin(angle) * 420,
        color,
        power: 1.3
      });
    }
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    prevX = null;
    prevY = null;
  });

  // Touch support for mobile / tablets
  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches.length > 0) {
      handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  window.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches.length > 0) {
      prevX = null;
      prevY = null;
      handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  // ====================================================================
  // 2D CANVAS FALLBACK ENGINE (For environments without WebGL support)
  // ====================================================================
  function init2DFallback() {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const maxParticles = 75;
    let localColorProg = 0;

    class FluidParticle {
      constructor(x, y, dx, dy, color) {
        this.x = x;
        this.y = y;
        this.vx = dx * 0.04 + (Math.random() - 0.5) * 1.5;
        this.vy = dy * 0.04 + (Math.random() - 0.5) * 1.5;
        this.radius = Math.random() * 45 + 35;
        this.alpha = 0.65;
        this.color = color;
        this.decay = Math.random() * 0.012 + 0.015;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.94;
        this.vy *= 0.94;
        this.radius += 0.8;
        this.alpha -= this.decay;
      }
      draw(c) {
        if (this.alpha <= 0) return;
        const grad = c.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
        grad.addColorStop(0, `rgba(${Math.round(this.color.r * 255)}, ${Math.round(this.color.g * 255)}, ${Math.round(this.color.b * 255)}, ${this.alpha})`);
        grad.addColorStop(1, `rgba(${Math.round(this.color.r * 255)}, ${Math.round(this.color.g * 255)}, ${Math.round(this.color.b * 255)}, 0)`);
        c.fillStyle = grad;
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        c.fill();
      }
    }

    let pLastX = 0;
    let pLastY = 0;

    window.addEventListener('mousemove', (e) => {
      const dx = e.clientX - pLastX;
      const dy = e.clientY - pLastY;
      pLastX = e.clientX;
      pLastY = e.clientY;

      localColorProg += 0.05;
      const col = getPaletteColor(localColorProg);
      if (particles.length < maxParticles) {
        particles.push(new FluidParticle(e.clientX, e.clientY, dx, dy, col));
      }
    }, { passive: true });

    function render2D() {
      ctx.clearRect(0, 0, width, height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw(ctx);
        if (p.alpha <= 0) {
          particles.splice(i, 1);
        }
      }
      requestAnimationFrame(render2D);
    }
    requestAnimationFrame(render2D);
  }

})();
