import Vector from "@/components/particles/vector";
import { perlin3D } from "@/components/particles/noise";

export default function getNoiseData(
  noiseSize: number,
  noiseOffsetX: number,
  noiseOffsetY: number,
  noiseStepX: number,
  noiseStepY: number,
  noiseStrength: number,
  noiseZ: number,
) {
  const data = new Float32Array(noiseSize * noiseSize * 2);

  let xpos = noiseOffsetX;
  for (let x = 0; x < noiseSize; x++) {
    let ypos = noiseOffsetY;
    for (let y = 0; y < noiseSize * 2; y += 2) {
      let v = new Vector(0, 0);
      v.setFromAngle(perlin3D(xpos, ypos, noiseZ) * Math.PI * 4);
      v.setMag(noiseStrength);
      data[noiseSize * 2 * x + y] = v.x;
      data[noiseSize * 2 * x + y + 1] = v.y;
      ypos += noiseStepY;
    }
    xpos += noiseStepX;
  }

  return data;
}
