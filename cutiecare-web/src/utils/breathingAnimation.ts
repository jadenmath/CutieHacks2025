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
      info1: vec4f, // baseRadius, unused
    }

    @group(0) @binding(0) var<uniform> uniforms: Uniforms;

    @fragment
    fn main(@builtin(position) fragCoord: vec4f) -> @location(0) vec4f {
      let time = uniforms.info0.x;
      let resolution = uniforms.info0.yz;
      let breathingPhase = uniforms.info0.w;
      let baseRadius = uniforms.info1.x;
      let minDimension = min(resolution.x, resolution.y);
      let uv = (fragCoord.xy - resolution * 0.5) / minDimension;
      let dist = length(uv);
      
      // Breathing animation
      let breathScale = 0.9 + breathingPhase * 0.15;
      let radius = baseRadius * breathScale;
      
      // Main bubble - radial gradient
      let bubbleIntensity = smoothstep(radius + 0.02, radius - 0.05, dist);
      let bubbleColor = vec3f(0.48, 0.23, 0.93); // Purple
      let bubbleAlpha = bubbleIntensity * 0.35 * max(0.0, 1.0 - dist / max(radius, 0.0001));
      
      // Bubble outline
      let outlineWidth = 0.01;
      let outline = smoothstep(outlineWidth, 0.0, abs(dist - radius));
      let outlineColor = vec3f(0.48, 0.23, 0.93); // Purple
      let outlineAlpha = outline * 0.8;
      
      // Aura - animated dashes
      let auraRadius = radius + 0.1 + breathingPhase * 0.08;
      let angle = atan2(uv.y, uv.x);
      let numDashes = 16.0;
      let dashPhase = fract((angle / (3.14159265 * 2.0) + time * 0.05) * numDashes);
      let dashMask = smoothstep(0.3, 0.4, dashPhase) * smoothstep(0.7, 0.6, dashPhase);
      
      let auraDist = abs(dist - auraRadius);
      let auraIntensity = smoothstep(0.03, 0.0, auraDist) * dashMask;
      let auraColor = vec3f(0.98, 0.45, 0.09); // Orange
      let auraAlpha = auraIntensity * (0.4 + breathingPhase * 0.3);
      
      // Combine layers
      var finalColor = vec3f(0.0);
      var finalAlpha = 0.0;
      
      // Add bubble
      finalColor += bubbleColor * bubbleAlpha;
      finalAlpha += bubbleAlpha;
      
      // Add outline
      finalColor += outlineColor * outlineAlpha * (1.0 - finalAlpha);
      finalAlpha += outlineAlpha * (1.0 - finalAlpha);
      
      // Add aura
      finalColor += auraColor * auraAlpha * (1.0 - finalAlpha);
      finalAlpha += auraAlpha * (1.0 - finalAlpha);
      
      return vec4f(finalColor, finalAlpha);
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
    const uniformData = new Float32Array([
      currentTime,
      canvas.width,
      canvas.height,
      breathingPhase,
      0.35, // base radius
      0,
      0,
      0,
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
