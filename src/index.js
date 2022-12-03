import React, { useRef, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, useTexture, Sparkles, Float } from '@react-three/drei'
import { useControls } from 'leva'
import * as THREE from 'three'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { a, useSpring } from '@react-spring/three'
import { easeExpInOut } from 'd3-ease'
import './styles.css'

function TradingCard(props) {
  const ref = useRef()

  const map = useTexture('mtg.jpeg')
  const nMap = useTexture('foil-normal3.jpeg')

  const aMap = useTexture('alpha2.jpeg')

  const { thickRange1, thickRange2, ...material } = useControls({
    color: '#fff',
    emissive: '#000',
    roughness: { value: 1, min: 0, max: 1 },
    metalness: { value: 0.9, min: 0, max: 1 },
    transmission: { value: 0, min: 0, max: 1 },
    thickness: { value: 0 },
    normalScale: { value: 0.05, min: -1, max: 1, step: 0.01 },
    envMapIntensity: { value: 1.5, min: 0, max: 2 },

    iridescence: { value: 1, min: 0, max: 1 },
    iridescenceIOR: { value: 1.4, min: 0, max: 3 }
    // thickRange1: { value: 100, min: 0, max: 1000 },
    // thickRange2: { value: 400, min: 0, max: 1000 }

    // attenuationColor: 'red',
    // attenuationDistance: 0
  })

  return (
    <group ref={ref} {...props}>
      <mesh>
        <boxGeometry args={[2.5, 4, 0.02]} />
        <meshPhysicalMaterial
          {...material}
          map={map}
          normalMap={nMap}
          normalMap-encoding={THREE.LinearEncoding}
          normalMap-wrapT={THREE.RepeatWrapping}
          normalMap-wrapS={THREE.RepeatWrapping}
          normalMap-repeat={1}
          // iridescenceMap={aMap}
          // iridescenceThicknessMap={aMap}
          // iridescenceThicknessRange={[thickRange1, thickRange2]}
          // roughnessMap={map}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

function Effects() {
  const bloomProps = useControls(
    'post.bloom',
    {
      enable: {
        value: true
      },
      luminanceThreshold: {
        value: 0.5,
        min: 0,
        max: 1,
        label: 'threshold'
      },
      luminanceSmoothing: {
        value: 0.2,
        min: 0,
        max: 1,
        label: 'smoothing'
      },
      mipmapBlur: true,
      intensity: { value: 1, min: 0, max: 10 },
      radius: { value: 1, min: 0, max: 1 },
      levels: { value: 8, min: 0, max: 8, step: 1 }
    },
    { collapsed: true }
  )

  return (
    <EffectComposer>
      <Bloom {...bloomProps} />
    </EffectComposer>
  )
}

function Scene() {
  const controls = useControls({ autoRotate: true })
  const props = useSpring({
    from: {
      'rotation-y': Math.PI * 0.1
    },
    to: [
      {
        'rotation-y': Math.PI * 1.1
      },
      {
        'rotation-y': Math.PI * 2.1
      }
    ],
    config: { duration: 2000, easing: easeExpInOut },
    delay: 1000,
    loop: true,
    pause: !controls.autoRotate
  })

  return (
    <>
      <Float speed={1} rotationIntensity={2} floatIntensity={1}>
        <a.group {...props} rotation-x={-Math.PI * 0.1}>
          <TradingCard />
        </a.group>
      </Float>
      <Sparkles scale={[3.5, 5, 0.5]} color="turquoise" />
    </>
  )
}

const container = document.getElementById('root')
createRoot(container).render(
  <Canvas gl={{ antialias: false, alpha: false }}>
    <color args={['#000']} attach="background" />
    <Suspense>
      <Scene />
      <OrbitControls />
      <Environment preset="dawn" /* files="42ND_STREET-1024.hdr"*/ />
      {/* <spotLight intensity={0} position={[5, 15, 5]} /> */}
      {/* <ambientLight /> */}
      <Effects />
    </Suspense>
  </Canvas>
)
