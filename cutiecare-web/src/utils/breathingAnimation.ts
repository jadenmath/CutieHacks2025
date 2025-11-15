interface GPUState {
  device: GPUDevice;
  context: GPUCanvasContext;
  pipeline: GPURenderPipeline;
  uniformBuffer: GPUBuffer;
  bindGroup: GPUBindGroup;
  startTime: number;
  animationId?: number;
}

let gpuState: GPUState | null = null;
let interactionIntensity = 0;

export function setBubbleInteractionIntensity(value: number) {
  interactionIntensity = Math.min(1, Math.max(0, value));
}

// Breathing timing function
function getBreathingPhase(t: number): number {
  const period = 12.0; // 12 second breathing cycle
  const phase = (t % period) / period;

  // 0.0-0.33: inhale
  // 0.33-0.5: hold
  // 0.5-0.83: exhale
  // 0.83-1.0: hold

  if (phase < 0.33) {
    // Inhale: ease in-out
    const t = phase / 0.33;
    return smoothStep(0.0, 1.0, t);
  } else if (phase < 0.5) {
    // Hold at peak
    return 1.0;
  } else if (phase < 0.83) {
    // Exhale: ease in-out
    const t = (phase - 0.5) / 0.33;
    return 1.0 - smoothStep(0.0, 1.0, t);
  } else {
    // Hold at bottom
    return 0.0;
  }
}

function smoothStep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

export async function initWebGPU(canvas: HTMLCanvasElement): Promise<() => void> {
  if (!navigator.gpu) {
    throw new Error("WebGPU not supported");
  }

  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) {
    throw new Error("No GPU adapter found");
  }

  const device = await adapter.requestDevice();
  const context = canvas.getContext("webgpu");
  
  if (!context) {
    throw new Error("Could not get WebGPU context");
  }

  const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
  context.configure({
    device,
    format: presentationFormat,
    alphaMode: "premultiplied",
  });

  // Vertex shader - full screen quad
  const vertexShaderCode = `
    @vertex
    fn main(@builtin(vertex_index) vertexIndex: u32) -> @builtin(position) vec4f {
      var pos = array<vec2f, 6>(
        vec2f(-1.0, -1.0),
        vec2f(1.0, -1.0),
        vec2f(-1.0, 1.0),
        vec2f(-1.0, 1.0),
        vec2f(1.0, -1.0),
        vec2f(1.0, 1.0)
      );
      return vec4f(pos[vertexIndex], 0.0, 1.0);
    }
  `;

  // Fragment shader - breathing bubble with aura
  const fragmentShaderCode = `
    struct Uniforms {
      info0: vec4f, // time, resolution.x, resolution.y, breathingPhase
      info1: vec4f, // baseRadius, highlightAngle, highlightStrength, interaction
    }

    @group(0) @binding(0) var<uniform> uniforms: Uniforms;

    fn remap(value: f32, minValue: f32, maxValue: f32) -> f32 {
      return clamp((value - minValue) / (maxValue - minValue), 0.0, 1.0);
    }

    fn jellyHighlight(uv: vec2f, position: vec2f, size: f32) -> f32 {
      let dist = length(uv - position);
      return smoothstep(size, 0.0, dist);
    }

    @fragment
    fn main(@builtin(position) fragCoord: vec4f) -> @location(0) vec4f {
      let time = uniforms.info0.x;
      let resolution = uniforms.info0.yz;
      let breathingPhase = uniforms.info0.w;
  let baseRadius = uniforms.info1.x;
  let highlightAngle = uniforms.info1.y;
  let highlightStrength = uniforms.info1.z;
  let interaction = uniforms.info1.w;

      let minDimension = min(resolution.x, resolution.y);
      let uv = (fragCoord.xy - resolution * 0.5) / minDimension;
      let stretchedUV = vec2f(uv.x * 1.1, uv.y * 0.9);
      let polar = vec2f(length(stretchedUV), atan2(stretchedUV.y, stretchedUV.x));

      // Breathing scale for squishy motion
  let breathScale = 0.85 + breathingPhase * 0.2 + interaction * 0.05;
      let radius = baseRadius * breathScale;
      let softness = 0.2;

      // Subtle jelly wobble using sine ripples
      let wobble = sin((stretchedUV.x + stretchedUV.y) * 12.0 + time * 1.6) * 0.018;
      let dist = polar.x + wobble;

      // Body gradient inspired by jelly switch colors
  let gradientDir = normalize(vec2f(0.3, 0.7));
  let gradientT = remap(dot(stretchedUV, gradientDir), -0.55, 0.45);
  let coolColor = vec3f(0.1, 0.75, 0.98);
  let warmColor = vec3f(1.0, 0.36, 0.82);
      let bodyColor = mix(warmColor, coolColor, gradientT);

      // Core body intensity
      let body = smoothstep(radius + softness, radius - softness, dist);

      // Soft inner shadow for depth
  let innerShadow = smoothstep(radius * 0.8, radius * 0.2, dist);

      // Caustic sparkle pattern traveling diagonally
      let caustics = sin((stretchedUV.x * 18.0 + stretchedUV.y * 22.0) - time * 3.0) * 0.5 + 0.5;
      let causticMask = smoothstep(0.2, 0.8, body);

      // Highlight sweep similar to jelly switch sparkle
      let highlightDir = vec2f(cos(highlightAngle), sin(highlightAngle));
      let highlightCenter = highlightDir * 0.25;
  let highlight = jellyHighlight(uv, highlightCenter, 0.35 - interaction * 0.05);

      // Secondary micro highlight
      let microHighlight = jellyHighlight(uv, highlightCenter + vec2f(0.05, -0.08), 0.18);

  // Hemisphere shine to add thickness
  let hemiHighlight = pow(max(0.0, 1.0 - length(stretchedUV * vec2f(1.0, 1.3))), 2.0);

      // Traveling sheen band
  let sweepPos = fract(time * (0.25 + interaction * 0.15));
  let sweep = smoothstep(sweepPos + 0.2, sweepPos - 0.15, remap(stretchedUV.y, -0.6, 0.6));

  // Fresnel rim for glassy edge
  let normalZ = sqrt(max(0.0, 1.0 - dot(stretchedUV, stretchedUV)));
  let fresnel = pow(1.0 - clamp(normalZ, 0.0, 1.0), 2.2);

      // Rim glow for edges
      let rim = smoothstep(radius + 0.025, radius - 0.02, polar.x);
  let rimColor = mix(vec3f(1.0, 0.8, 1.0), vec3f(0.4, 0.9, 1.0), gradientT);

      // Ambient glow aura
      let auraRadius = radius + 0.08;
      let aura = smoothstep(auraRadius + 0.05, auraRadius - 0.02, polar.x);

      var color = vec3f(0.0);
      color += bodyColor * body;
      color -= vec3f(0.12, 0.08, 0.2) * innerShadow * 0.35;
  color += rimColor * rim * 0.85;
  let boostedHighlight = mix(highlightStrength, 1.1, interaction);
  color += vec3f(0.98, 0.98, 1.0) * highlight * boostedHighlight * 1.2;
  color += vec3f(1.0, 0.92, 0.85) * microHighlight * boostedHighlight * 0.8;
  color += vec3f(1.0, 0.96, 0.92) * sweep * 0.55;
  color += vec3f(0.85, 0.95, 1.2) * fresnel * 0.65;
  color += vec3f(1.0, 0.87, 0.92) * hemiHighlight * 0.5;
      color += vec3f(1.0, 0.8, 0.6) * caustics * causticMask * 0.25;
      color += vec3f(0.6, 0.7, 1.0) * aura * 0.3;

  let alpha = body + rim * 0.7 + aura * 0.35;
      alpha = clamp(alpha, 0.0, 1.0);

      return vec4f(color, alpha);
    }
  `;

  // Create shaders
  const vertexShader = device.createShaderModule({
    code: vertexShaderCode,
  });

  const fragmentShader = device.createShaderModule({
    code: fragmentShaderCode,
  });

  // Create uniform buffer
  const uniformBuffer = device.createBuffer({
    size: 8 * 4, // two vec4f packs
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  // Create bind group layout
  const bindGroupLayout = device.createBindGroupLayout({
    entries: [
      {
        binding: 0,
        visibility: GPUShaderStage.FRAGMENT,
        buffer: { type: "uniform" },
      },
    ],
  });

  // Create bind group
  const bindGroup = device.createBindGroup({
    layout: bindGroupLayout,
    entries: [
      {
        binding: 0,
        resource: { buffer: uniformBuffer },
      },
    ],
  });

  // Create pipeline
  const pipeline = device.createRenderPipeline({
    layout: device.createPipelineLayout({
      bindGroupLayouts: [bindGroupLayout],
    }),
    vertex: {
      module: vertexShader,
      entryPoint: "main",
    },
    fragment: {
      module: fragmentShader,
      entryPoint: "main",
      targets: [
        {
          format: presentationFormat,
          blend: {
            color: {
              srcFactor: "one",
              dstFactor: "one-minus-src-alpha",
              operation: "add",
            },
            alpha: {
              srcFactor: "one",
              dstFactor: "one-minus-src-alpha",
              operation: "add",
            },
          },
        },
      ],
    },
    primitive: {
      topology: "triangle-list",
    },
  });

  gpuState = {
    device,
    context,
    pipeline,
    uniformBuffer,
    bindGroup,
    startTime: performance.now() / 1000,
  };

  return () => {
    if (gpuState?.animationId) {
      cancelAnimationFrame(gpuState.animationId);
    }
    gpuState = null;
  };
}

export function runBreathingAnimation(canvas: HTMLCanvasElement, _cleanup: () => void): void {
  if (!gpuState) return;

  const render = () => {
    if (!gpuState) return;

    const currentTime = performance.now() / 1000 - gpuState.startTime;
    const breathingPhase = getBreathingPhase(currentTime);

    // Update uniforms
    const highlightAngle = currentTime * 0.9;
    const highlightStrength = 0.55 + 0.25 * Math.sin(breathingPhase * Math.PI);

    const uniformData = new Float32Array([
      currentTime,
      canvas.width,
      canvas.height,
      breathingPhase,
      0.34, // base radius for jelly profile
      highlightAngle,
      highlightStrength,
      interactionIntensity,
    ]);

    gpuState.device.queue.writeBuffer(gpuState.uniformBuffer, 0, uniformData);

    // Render
    const commandEncoder = gpuState.device.createCommandEncoder();
    const textureView = gpuState.context.getCurrentTexture().createView();

    const renderPass = commandEncoder.beginRenderPass({
      colorAttachments: [
        {
          view: textureView,
          clearValue: { r: 0, g: 0, b: 0, a: 0 },
          loadOp: "clear",
          storeOp: "store",
        },
      ],
    });

    renderPass.setPipeline(gpuState.pipeline);
    renderPass.setBindGroup(0, gpuState.bindGroup);
    renderPass.draw(6);
    renderPass.end();

    gpuState.device.queue.submit([commandEncoder.finish()]);

    gpuState.animationId = requestAnimationFrame(render);
  };

  render();
}
