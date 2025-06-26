import Layout from "@/app/layout";
import { Menu } from "@/components/Menu";
import { Metadata } from "next";
import ParticleSimulation from "@/components/ParticleSimulation";

export const metadata: Metadata = {
  title: "Particle Simulation Settings - Joseph D'Angelo",
};

export default function Page() {
  return (
    <Layout>
      <Menu />
      <ParticleSimulation
        className="fixed top-0 left-0 w-screen h-screen -z-1"
        id="background_sim"
        particleCount={524288}
        showSettings
        logFps
        targetFps={60}
      />
    </Layout>
  );
}
