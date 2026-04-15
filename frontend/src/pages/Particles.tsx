import ParticleSimulation from "../components/ParticleSimulation/ParticleSimulation";

export default function Particles() {
  return (
    <div className="w-screen h-screen">
      <ParticleSimulation
        id="particles"
        className="w-full h-full"
        showSettings={true}
        logFps={true}
        dynamicParticleCount={false}
      />
    </div>
  );
}
