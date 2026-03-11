<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

const props = defineProps({
  modelPath: { type: String, default: '/models/rose.glb' },
  rotationSpeed: { type: Number, default: 0.005 },
})

const container = ref(null)

let renderer = null
let scene = null
let camera = null
let model = null
let clock = null
let animationId = null
let resizeObserver = null
let renderTarget = null
const hovered = ref(false)
let currentPixelSize = 2.0
const basePixelSize = 2.0
const hoverPixelSize = 6.0
let stepAccumulator = 0
const stepInterval = 0.08 // seconds between each step
let asciiScene = null
let asciiCamera = null
let asciiMaterial = null

const pixelVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const pixelFragmentShader = `
  uniform sampler2D tScene;
  uniform vec2 resolution;
  uniform float pixelSize;

  varying vec2 vUv;

  void main() {
    vec2 cellUv = vec2(pixelSize) / resolution;
    vec2 cell = floor(vUv / cellUv);
    vec2 sampleUv = (cell + 0.5) * cellUv;
    vec4 color = texture2D(tScene, sampleUv);

    if (color.a < 0.01) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
      return;
    }

    vec3 bright = color.rgb * 1.8;
    gl_FragColor = vec4(min(bright, 1.0), color.a);
  }
`

onMounted(() => {
  const el = container.value
  if (!el) return

  // Scene
  scene = new THREE.Scene()

  // Camera
  camera = new THREE.PerspectiveCamera(45, el.clientWidth / el.clientHeight, 0.1, 100)

  // Renderer
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
  renderer.setClearColor(0x000000, 0)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(el.clientWidth, el.clientHeight)
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 3.0
  el.appendChild(renderer.domElement)

  // Render target for offscreen scene
  renderTarget = new THREE.WebGLRenderTarget(el.clientWidth, el.clientHeight)

  // Pixelation post-process setup
  asciiMaterial = new THREE.ShaderMaterial({
    uniforms: {
      tScene: { value: renderTarget.texture },
      resolution: { value: new THREE.Vector2(el.clientWidth, el.clientHeight) },
      pixelSize: { value: 2.0 },
    },
    vertexShader: pixelVertexShader,
    fragmentShader: pixelFragmentShader,
    transparent: true,
  })

  asciiScene = new THREE.Scene()
  asciiCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), asciiMaterial)
  asciiScene.add(quad)

  // Lighting — bright enough to show petal detail
  const ambient = new THREE.AmbientLight(0xffffff, 5.0)
  scene.add(ambient)

  const directional = new THREE.DirectionalLight(0xffffff, 4.0)
  directional.position.set(5, 8, 5)
  scene.add(directional)

  const fillLight = new THREE.DirectionalLight(0xffffff, 3.0)
  fillLight.position.set(-3, 2, -3)
  scene.add(fillLight)

  const backLight = new THREE.DirectionalLight(0xffffff, 2.0)
  backLight.position.set(0, -3, -5)
  scene.add(backLight)

  // Load model
  const loader = new GLTFLoader()
  loader.load(
    props.modelPath,
    (gltf) => {
      model = gltf.scene

      // Center model based on bounding box
      const box = new THREE.Box3().setFromObject(model)
      const center = box.getCenter(new THREE.Vector3())
      const size = box.getSize(new THREE.Vector3())
      model.position.sub(center)

      // Position camera based on model size
      const maxDim = Math.max(size.x, size.y, size.z)
      const fov = camera.fov * (Math.PI / 180)
      const dist = maxDim / (2 * Math.tan(fov / 2)) * 0.65
      // Camera slightly above, looking down at the rose
      camera.position.set(0, size.y * 0.3, dist)
      camera.lookAt(0, 0, 0)

      // Shift model down in the frame
      model.position.y -= size.y * 0.2

      // Gentle tilt — enough to show depth, not obscure petals
      model.rotation.x = 0.15

      scene.add(model)
    },
    undefined,
    (error) => {
      console.warn('Failed to load rose model:', error)
    },
  )

  // Clock for rotation
  clock = new THREE.Clock()

  // Animation loop
  function animate() {
    animationId = requestAnimationFrame(animate)
    const delta = clock.getDelta()
    if (model) {
      model.rotation.y += props.rotationSpeed * delta * 60
    }

    // Stepped pixel size transition — discrete jumps on a timer
    const targetSize = hovered.value ? hoverPixelSize : basePixelSize
    stepAccumulator += delta
    if (stepAccumulator >= stepInterval && Math.abs(targetSize - currentPixelSize) > 0.1) {
      stepAccumulator = 0
      currentPixelSize += Math.sign(targetSize - currentPixelSize) * 1.0
    }
    asciiMaterial.uniforms.pixelSize.value = Math.round(currentPixelSize)

    // Render scene to offscreen target
    renderer.setRenderTarget(renderTarget)
    renderer.render(scene, camera)

    // Render ASCII quad to screen
    renderer.setRenderTarget(null)
    renderer.render(asciiScene, asciiCamera)
  }
  animate()

  // Responsive sizing
  resizeObserver = new ResizeObserver(([entry]) => {
    const { width, height } = entry.contentRect
    if (width === 0 || height === 0) return
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
    renderTarget.setSize(width, height)
    asciiMaterial.uniforms.resolution.value.set(width, height)
  })
  resizeObserver.observe(el)

  // Hover detection
  el.addEventListener('mouseenter', () => { hovered.value = true })
  el.addEventListener('mouseleave', () => { hovered.value = false })
})

onBeforeUnmount(() => {
  if (animationId != null) cancelAnimationFrame(animationId)
  if (resizeObserver) resizeObserver.disconnect()

  if (renderTarget) renderTarget.dispose()
  if (asciiMaterial) asciiMaterial.dispose()

  if (scene) {
    scene.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose()
      if (obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => {
            m.map?.dispose()
            m.dispose()
          })
        } else {
          obj.material.map?.dispose()
          obj.material.dispose()
        }
      }
    })
  }

  if (renderer) {
    renderer.dispose()
    renderer.domElement.remove()
  }
})
</script>

<template>
  <div ref="container" class="w-full h-full cursor-pointer relative">
    <div class="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    <div
      class="absolute inset-0 flex items-center justify-center transition-opacity duration-300 pointer-events-none"
      :class="hovered ? 'opacity-100' : 'opacity-0'"
    >
      <span class="bg-black text-white text-[8px] px-3 py-1.5 font-ibm-bios inline-flex items-center gap-1.5">
        Explore
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 shrink-0" viewBox="0 0 24 24"><g fill="currentColor"><path d="M4 11v2h16v-2zm12 2v2h2v-2zm-2 2v2h2v-2zm-2 2v2h2v-2zm4-6V9h2v2z"/><path d="M14 15V7h2v8zm-2 2V5h2v12z"/></g></svg>
      </span>
    </div>
  </div>
</template>
