import getNoiseData from "@/components/particles/getNoiseData";

addEventListener("message", (event: MessageEvent) => {
  const data = getNoiseData(
    event.data.noiseSize,
    event.data.noiseOffsetX,
    event.data.noiseOffsetY,
    event.data.noiseStepX,
    event.data.noiseStepY,
    event.data.noiseStrength,
    event.data.noiseZ,
  );
  const nZ = event.data.noiseZ + event.data.noiseStepZ;
  postMessage({ data, nZ });
});
