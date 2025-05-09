import React, { useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

function GLBModel({ glb }) {
  return glb ? <primitive object={glb.scene} /> : null
}

export default function GLBViewer() {
  const [glb, setGlb] = useState(null)
  const inputRef = useRef()

  const handleFile = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const url = URL.createObjectURL(file)
    const loader = new GLTFLoader()

    loader.load(
      url,
      (gltf) => {
        setGlb(gltf)
        URL.revokeObjectURL(url)
      },
      undefined,
      (error) => {
        console.error('Erro ao carregar GLB:', error)
      }
    )
  }

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <input
        type="file"
        accept=".glb"
        ref={inputRef}
        onChange={handleFile}
        style={{ position: 'absolute', zIndex: 10, top: 10, left: 10 }}
      />
      <Canvas camera={{ position: [0, 2, 5], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 7]} />
        <Environment preset="sunset" />
        <OrbitControls />
        <GLBModel glb={glb} />
      </Canvas>
    </div>
  )
}
