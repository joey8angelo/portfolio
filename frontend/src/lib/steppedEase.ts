import gsap from "gsap";

export default function steppedEase(ease: string, steps: number) {
  const easeFn = gsap.parseEase(ease);
  return (p: number) => Math.round(easeFn(p) * steps) / steps;
}
