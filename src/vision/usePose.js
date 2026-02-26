import { useEffect } from "react";
import { Pose } from "@mediapipe/pose";
import { Camera } from "@mediapipe/camera_utils";

export default function usePose(webcamRef, onResults) {
  useEffect(() => {
    if (!webcamRef.current) return;

    let camera = null;
    let pose = null;
    let isActive = true;

    const init = async () => {
      // Wait until video is actually ready
      const video = webcamRef.current.video;
      if (!video) return;

      pose = new Pose({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
      });

      pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: false,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      pose.onResults((results) => {
        if (isActive) onResults(results);
      });

      camera = new Camera(video, {
        onFrame: async () => {
          if (!isActive || !video) return;
          await pose.send({ image: video });
        },
        width: 640,
        height: 480,
      });

      camera.start();
    };

    init();

    // ✅ THIS IS THE IMPORTANT CLEANUP
    return () => {
      isActive = false;

      if (camera) camera.stop();

      if (pose) pose.close();
    };
  }, [webcamRef, onResults]);
}
