import { useEffect, useRef } from "react";
import { Camera } from "@mediapipe/camera_utils";
import { Pose } from "@mediapipe/pose";

export default function usePose(webcamRef, onResults) {
  const onResultsRef = useRef(onResults);

  useEffect(() => {
    onResultsRef.current = onResults;
  }, [onResults]);

  useEffect(() => {
    let camera = null;
    let pose = null;
    let isActive = true;

    const startPose = async () => {
      if (!webcamRef.current || !webcamRef.current.video) return;

      const video = webcamRef.current.video;

      pose = new Pose({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
      });

      pose.setOptions({
        modelComplexity: 0,
        smoothLandmarks: true,
        enableSegmentation: false,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      pose.onResults((results) => {
        if (isActive) {
          onResultsRef.current(results);
        }
      });

      camera = new Camera(video, {
        onFrame: async () => {
          if (!isActive || !pose || !video) return;

          try {
            await pose.send({ image: video });
          } catch (error) {
            console.warn("Pose frame skipped:", error);
          }
        },
        width: 480,
        height: 360,
      });

      camera.start();
    };

    const timer = setTimeout(startPose, 500);

    return () => {
      isActive = false;
      clearTimeout(timer);

      if (camera) {
        camera.stop();
      }

      if (pose) {
        pose.close();
      }
    };
  }, [webcamRef]);
}