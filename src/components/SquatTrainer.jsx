import { useGLTF, useAnimations } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function SquatTrainer({ landmarks }) {
  const group = useRef();

  const { scene, animations } = useGLTF("/models/squat_demo.glb");

  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (actions) {
      const first = Object.keys(actions)[0];

      if (first) {
        actions[first].reset().play();
      }
    }
  }, [actions]);

  useEffect(() => {
    if (!group.current || !landmarks) return;

    // Right shoulder landmark
    const shoulder = landmarks[12];

    // Convert MediaPipe coordinates to Three.js coordinates
    const x = (shoulder.x - 0.5) * 6;
    const y = -(shoulder.y - 0.5) * 4;

    // Offset the trainer to stand beside the user
    group.current.position.set(
      x + 2,
      y - 1.5,
      0
    );
  }, [landmarks]);

  return (
    <primitive
      ref={group}
      object={scene}
      scale={1.4}
    />
  );
}