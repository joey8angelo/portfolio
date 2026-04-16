import * as THREE from "three";

export const blackbodyColor = (temperature: number) => {
  const t = temperature / 100;
  let r, g, b;

  if (t <= 66) {
    r = 255;
    g = t <= 19 ? 0 : 99.4708025861 * Math.log(t - 10) - 161.1195681661;
    b =
      t <= 19
        ? 0
        : t <= 66
          ? 138.5177312231 * Math.log(t - 10) - 305.0447927307
          : 255;
  } else {
    r = t <= 66 ? 138.5177312231 * Math.log(t - 10) - 305.0447927307 : 255;
    g = t <= 66 ? 99.4708025861 * Math.log(t - 10) - 161.1195681661 : 255;
    b =
      t <= 66
        ? t <= 19
          ? 0
          : 138.5177312231 * Math.log(t - 10) - 305.0447927307
        : 255;
  }

  return new THREE.Color(
    Math.min(Math.max(r, 0), 255) / 255,
    Math.min(Math.max(g, 0), 255) / 255,
    Math.min(Math.max(b, 0), 255) / 255,
  );
};

export const bvToColor = (bv: number) => {
  const t = 4600 * (1 / (0.92 * bv + 1.7) + 1 / (0.92 * bv + 0.62));
  return blackbodyColor(t);
};

export const getLocalSiderealTime = (lon: number) => {
  const now = new Date();
  const JD = now.getTime() / 86400000 + 2440587.5;
  const D = JD - 2451545.0;
  let gmst = (18.697374558 + 24.06570982441908 * D) % 24;
  if (gmst < 0) gmst += 24;

  const gmstRad = (gmst * Math.PI) / 12;
  const lonRad = (lon * Math.PI) / 180;

  const lst = gmstRad + lonRad;

  return Math.PI / 2 - lst;
};

export function getCelestialPoint(
  raHour: number,
  raMin: number,
  raSec: number,
  decDegrees: number,
  decMinutes: number,
  decSeconds: number,
  radius: number,
) {
  const raHours = raHour + raMin / 60 + raSec / 3600;
  const decDegreesTotal =
    Math.abs(decDegrees) + decMinutes / 60 + decSeconds / 3600;
  const decDegreesSigned = decDegrees < 0 ? -decDegreesTotal : decDegreesTotal;

  const phi = -(raHours / 24) * Math.PI * 2;
  const theta = (decDegreesSigned / 180) * Math.PI;

  const x = radius * Math.cos(theta) * Math.cos(phi);
  const y = radius * Math.sin(theta);
  const z = radius * Math.cos(theta) * Math.sin(phi);

  return new THREE.Vector3(x, y, z);
}
