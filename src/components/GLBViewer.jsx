import React, { useRef, useState, Suspense } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls, Environment, useProgress, Html } from '@react-three/drei'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

function LoadingOverlay() {
  const { progress } = useProgress()
  return (
    <Html center>
      <div style={{
        background: 'rgba(0, 0, 0, 0.7)',
        padding: '12px 20px',
        borderRadius: '8px',
        color: '#fff',
        fontFamily: 'monospace'
      }}>
        Carregando... {progress.toFixed(0)}%
      </div>
    </Html>
  )
}

function GLBModel({ url }) {
  const gltf = useLoader(GLTFLoader, url)
  return <primitive object={gltf.scene} />
}

function SceneHelpers() {
  const gridRef = useRef()
  const axesRef = useRef()

  useFrame(() => {
    if (gridRef.current) gridRef.current.position.y = 0
  })

  return (
    <>
      <gridHelper ref={gridRef} args={[10, 10]} />
      <axesHelper ref={axesRef} args={[1.5]} />
    </>
  )
}

export default function GLBViewer() {
  const inputRef = useRef()
  const [fileURL, setFileURL] = useState(null)

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setFileURL(url)
  }

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
        
        <div className="" style={{ position: 'absolute', zIndex: 10, top: 10, left: 10 }}>
            <h1>GLB Viewer</h1>
            <input
                type="file"
                accept=".glb"
                ref={inputRef}
                onChange={handleFile}
            />

        </div>
      <Canvas camera={{ position: [0, 2, 5], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 7]} />
        <Environment preset="sunset" />
        <OrbitControls />
        <SceneHelpers />
        <Suspense fallback={<LoadingOverlay />}>
          {fileURL && <GLBModel url={fileURL} />}
        </Suspense>
      </Canvas>
    </div>
  )
}
