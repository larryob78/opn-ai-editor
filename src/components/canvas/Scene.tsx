import { Suspense, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import {
  OrbitControls,
  Grid,
  Environment,
  TransformControls,
  useGLTF,
  Center,
} from '@react-three/drei'
import * as THREE from 'three'
import { useAssetStore } from '../../stores/assetStore'
import Spinner from '../ui/Spinner'

function Model({ url, transform, isSelected, id }: {
  url: string
  transform: { position: [number, number, number]; rotation: [number, number, number]; scale: number }
  isSelected: boolean
  id: string
}) {
  const { scene } = useGLTF(url)
  const groupRef = useRef<THREE.Group>(null)
  const updateTransform = useAssetStore((state) => state.updateTransform)
  const transformMode = useAssetStore((state) => state.transformMode)

  // Clone scene to avoid issues with multiple instances
  const clonedScene = scene.clone()

  // Calculate bounding box and center the model
  useEffect(() => {
    if (groupRef.current) {
      const box = new THREE.Box3().setFromObject(clonedScene)
      const size = box.getSize(new THREE.Vector3())
      const maxDim = Math.max(size.x, size.y, size.z)
      const scale = 2 / maxDim // Normalize to fit in a 2-unit box
      clonedScene.scale.multiplyScalar(scale)

      // Center the model
      const center = box.getCenter(new THREE.Vector3())
      clonedScene.position.sub(center.multiplyScalar(scale))
    }
  }, [clonedScene])

  const handleTransformChange = () => {
    if (groupRef.current) {
      const { position, rotation, scale } = groupRef.current
      updateTransform(id, {
        position: [position.x, position.y, position.z],
        rotation: [
          THREE.MathUtils.radToDeg(rotation.x),
          THREE.MathUtils.radToDeg(rotation.y),
          THREE.MathUtils.radToDeg(rotation.z),
        ],
        scale: scale.x,
      })
    }
  }

  return (
    <>
      <group
        ref={groupRef}
        position={transform.position}
        rotation={[
          THREE.MathUtils.degToRad(transform.rotation[0]),
          THREE.MathUtils.degToRad(transform.rotation[1]),
          THREE.MathUtils.degToRad(transform.rotation[2]),
        ]}
        scale={transform.scale}
      >
        <Center>
          <primitive object={clonedScene} />
        </Center>
      </group>
      {isSelected && groupRef.current && (
        <TransformControls
          object={groupRef.current}
          mode={transformMode}
          onObjectChange={handleTransformChange}
        />
      )}
    </>
  )
}

function SceneContent() {
  const assets = useAssetStore((state) => state.assets)
  const selectedAsset = useAssetStore((state) => state.selectedAsset)
  const selectAsset = useAssetStore((state) => state.selectAsset)
  const setTransformMode = useAssetStore((state) => state.setTransformMode)

  // Keyboard shortcuts for transform modes
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      switch (e.key.toLowerCase()) {
        case 'g':
          setTransformMode('translate')
          break
        case 'r':
          setTransformMode('rotate')
          break
        case 's':
          setTransformMode('scale')
          break
        case 'escape':
          selectAsset(null)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setTransformMode, selectAsset])

  const modelAssets = assets.filter(
    (a) => (a.type === 'model' || a.type === 'scan') && a.url
  )

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <directionalLight position={[-10, 5, -5]} intensity={0.3} />

      {/* Environment for reflections */}
      <Environment preset="city" />

      {/* Ground Grid */}
      <Grid
        position={[0, -0.01, 0]}
        args={[20, 20]}
        cellSize={0.5}
        cellThickness={0.5}
        cellColor="#3f3f46"
        sectionSize={2}
        sectionThickness={1}
        sectionColor="#52525b"
        fadeDistance={20}
        fadeStrength={1}
        followCamera={false}
      />

      {/* Ground shadow catcher */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <shadowMaterial transparent opacity={0.2} />
      </mesh>

      {/* Models */}
      {modelAssets.map((asset) => (
        <Suspense key={asset.id} fallback={null}>
          <Model
            url={asset.url}
            transform={asset.transform}
            isSelected={selectedAsset?.id === asset.id}
            id={asset.id}
          />
        </Suspense>
      ))}

      {/* Camera Controls */}
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.05}
        minDistance={1}
        maxDistance={20}
        maxPolarAngle={Math.PI / 2 - 0.1}
      />
    </>
  )
}

export default function Scene() {
  return (
    <div className="w-full h-full relative">
      <Suspense
        fallback={
          <div className="absolute inset-0 flex items-center justify-center bg-bg-dark">
            <Spinner size="lg" />
          </div>
        }
      >
        <Canvas
          shadows
          camera={{ position: [5, 3, 5], fov: 50 }}
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1,
          }}
          style={{ background: '#09090b' }}
        >
          <SceneContent />
        </Canvas>
      </Suspense>

      {/* Keyboard hints */}
      <div className="absolute bottom-4 left-4 flex gap-2 text-xs text-zinc-500">
        <span className="px-2 py-1 bg-zinc-800/80 rounded">G: Move</span>
        <span className="px-2 py-1 bg-zinc-800/80 rounded">R: Rotate</span>
        <span className="px-2 py-1 bg-zinc-800/80 rounded">S: Scale</span>
        <span className="px-2 py-1 bg-zinc-800/80 rounded">Esc: Deselect</span>
      </div>
    </div>
  )
}
