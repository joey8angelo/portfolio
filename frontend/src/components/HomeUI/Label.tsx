import GlitchText from "../GlitchText";

export default function Label({ text }: { text: string }) {
  return (
    <GlitchText
      text={text}
      delay={[0, 400]}
      flickerProbability={[0.2, 0.6]}
      stepDuration={[100, 150]}
      stepProbability={[0.3, 0.4]}
      className="text-[var(--color-accent)] text-glow-xl font-[Terminus] uppercase"
      revertOnUpdate={true}
    />
  );
}
