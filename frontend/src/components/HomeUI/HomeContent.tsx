import { useGSAP } from "@gsap/react";
import LabeledBox from "../LabeledBox";
import Label from "./Label";
import { useRef, useState } from "react";
import { gsap } from "gsap";
import steppedEase from "../../lib/steppedEase";
import {
  LiveSkyVisualizerDescription,
  CellularAutomatonDescription,
  CLIRaytracerDescription,
  FourierApproximationDescription,
  NeuralNetworkVisualizerDescription,
  ParticleSimulationDescription,
  RegularExpressionEngineDescription,
} from "./Projects/descriptions";
import {
  LiveSkyVisualizerDetails,
  CellularAutomatonDetails,
  CLIRaytracerDetails,
  FourierApproximationDetails,
  NeuralNetworkVisualizerDetails,
  ParticleSimulationDetails,
  RegularExpressionEngineDetails,
} from "./Projects/details";
import { createPortal } from "react-dom";
import ImgWindow from "./ImgWindow";
import ProjectListing from "./Projects/ProjectListing";

const steps = 15;

const projects = [
  {
    details: LiveSkyVisualizerDetails,
    description: <LiveSkyVisualizerDescription />,
  },
  {
    details: CellularAutomatonDetails,
    description: <CellularAutomatonDescription />,
    imgs: [
      {
        src: "images/cellular_ui.png",
        title: "UI",
        alt: "UI",
        w: 288,
        h: 433,
      },
      {
        src: "images/cellular_close.png",
        title: "Close-up",
        alt: "Close-up",
        w: 560,
        h: 365,
      },
      {
        src: "images/cellular.webm",
        title: "Demo",
        alt: "Cellular Automaton Video",
        w: 640,
        h: 360,
      },
    ],
  },
  {
    details: CLIRaytracerDetails,
    description: <CLIRaytracerDescription />,
    imgs: [
      {
        src: "images/raytracer_skull.png",
        title: "Skull",
        alt: "CLI Raytracer Skull",
        w: 523,
        h: 500,
      },
      {
        src: "images/raytracer_suzanne.png",
        title: "Suzanne",
        alt: "CLI Raytracer Suzanne",
        w: 479,
        h: 361,
      },
      {
        src: "images/raytracer_donut.webm",
        title: "Donut",
        alt: "CLI Raytracer Donut",
        w: 615,
        h: 346,
      },
    ],
  },
  {
    details: RegularExpressionEngineDetails,
    description: <RegularExpressionEngineDescription />,
  },
  {
    details: FourierApproximationDetails,
    description: <FourierApproximationDescription />,
  },
  {
    details: NeuralNetworkVisualizerDetails,
    description: <NeuralNetworkVisualizerDescription />,
  },
  {
    details: ParticleSimulationDetails,
    description: <ParticleSimulationDescription />,
  },
];

export default function HomeContent() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index);
  };
  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };
  const handleMouseDown = (index: number) => {
    if (selectedIndex === index) {
      setSelectedIndex(null);
    } else {
      const minX = window.innerWidth * 0.35;
      const maxX = window.innerWidth - 500;
      const minY = 80;
      const maxY = window.innerHeight - 400;

      const numImgs = projects[index].imgs?.length ?? 0;
      const positions = Array.from({ length: numImgs }, () => ({
        x: minX + Math.random() * (maxX - minX),
        y: minY + Math.random() * (maxY - minY),
      }));
      setImagePositions(positions);
      setSelectedIndex(index);
    }
  };

  const [imagePositions, setImagePositions] = useState<
    { x: number; y: number }[]
  >([]);

  useGSAP(() => {
    if (!lineRef.current) return;
    if (selectedIndex === null) {
      gsap.to(lineRef.current, {
        width: "0%",
        duration: 0.5,
        ease: steppedEase("power2.inOut", steps),
      });
    } else {
      gsap.to(lineRef.current, {
        width: "100%",
        duration: 0.5,
        ease: steppedEase("power2.inOut", steps),
      });
    }
  }, [selectedIndex]);

  return (
    <>
      <LabeledBox
        label={<Label text="Projects" />}
        className="m-4 flex-1 overflow-y-scroll"
      >
        <div className="w-full h-full text-xl p-8 flex flex-col gap-8 items-center">
          <ul className="w-full">
            {projects.map((project, index) => (
              <li
                key={index}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
                onMouseDown={() => handleMouseDown(index)}
              >
                <ProjectListing
                  name={project.details.name}
                  year={project.details.year}
                  num={index + 1}
                  hovered={hoveredIndex === index}
                  selected={selectedIndex === index}
                />
              </li>
            ))}
          </ul>
          <div
            ref={lineRef}
            className={`bg-[var(--color-text-muted)] h-[2px] rounded-full flex-shrink-0`}
          />
          {selectedIndex !== null && projects[selectedIndex].description}
        </div>
      </LabeledBox>

      {selectedIndex !== null &&
        createPortal(
          projects[selectedIndex].imgs?.map((img, idx) => (
            <ImgWindow
              key={`${selectedIndex}-${idx}`}
              title={img.title}
              imgSrc={img.src}
              imgAlt={img.alt}
              width={img.w}
              height={img.h}
              x={imagePositions[idx].x}
              y={imagePositions[idx].y}
              delay={idx * 0.2}
            />
          )),
          document.getElementById("main-content")!,
        )}
    </>
  );
}
