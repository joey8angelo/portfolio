import GlitchText from "../../GlitchText";
import useShowControls from "../../../store/useShowControls";
import GlitchTextAnimationWrapper from "../../GlitchTextAnimationWrapper";
import useAnalytics from "../../../hooks/useAnalytics";

export function LiveSkyVisualizerDescription() {
  return (
    <GlitchTextAnimationWrapper
      name="LiveSkyVisualizer"
      className="w-full h-full flex flex-col flex-1"
    >
      <div className="flex-1 flex flex-col gap-4 items-left">
        <GlitchText text="This ones easy, you're looking at it..." delay={0} />
        <span>
          <GlitchText
            text="This project is a physically accurate visualization of the sky* at a given location and time, built with "
            delay={500}
          />
          <GlitchText
            text="React Three Fiber"
            delay={0}
            className="text-[var(--color-accent)] text-glow-xl"
          />
        </span>

        <GlitchText
          text="It features all of the stars from the Yale Bright Star Catalog, all the planets, the milky way in the background and visible satellites. Each object in the sky is clickable, so learn something new about the universe!"
          delay={1000}
        />
        <span>
          <GlitchText
            text="Just because you got this far, play around with the visual controls "
            delay={500}
          />
          <button
            className="text-[var(--color-accent)] underline text-[var(--color-accent)] text-glow-xl"
            onClick={useShowControls.getState().toggleShowControls}
          >
            <GlitchText text="here" delay={0} />
          </button>
        </span>
      </div>
      <GlitchText
        text="*Without atmospheric effects, because who wants to see that?"
        delay={-9000}
        className="text-[var(--color-text-muted)] italic text-xs md:text-xs lg:text-sm"
      />
    </GlitchTextAnimationWrapper>
  );
}

export function CellularAutomatonDescription() {
  const { trackEvent } = useAnalytics();
  return (
    <GlitchTextAnimationWrapper
      name="CellularAutomaton"
      className="w-full h-full flex flex-col flex-1"
    >
      <div className="flex-1 flex flex-col gap-4 items-left">
        <GlitchText text="A GPU-accelerated 3D cellular automaton (3D 'Game of Life') with real-time volume rendering using ray voxel traversal." />
        <GlitchText
          text="Technologies"
          delay={500}
          className="text-[var(--color-accent)] text-glow-xl"
        />
        <ul className="list-inside">
          <li>
            <GlitchText
              text="- C++20 with CMake"
              delay={20}
              className="text-[var(--color-text-muted)]"
            />
          </li>
          <li>
            <GlitchText
              text="- OpenGL 4.6 - Compute shaders, 3D textures"
              delay={20}
              className="text-[var(--color-text-muted)]"
            />
          </li>
          <li>
            <GlitchText
              text="- GLFW - Windowing and input"
              delay={20}
              className="text-[var(--color-text-muted)]"
            />
          </li>
          <li>
            <GlitchText
              text="- GLAD - OpenGL loader"
              delay={20}
              className="text-[var(--color-text-muted)]"
            />
          </li>
          <li>
            <GlitchText
              text="- Dear ImGui - UI controls"
              delay={20}
              className="text-[var(--color-text-muted)]"
            />
          </li>
        </ul>
        <GlitchText
          text="How It Works"
          delay={500}
          className="text-[var(--color-accent)] text-glow-xl"
        />
        <GlitchText
          text="The GPU runs 8x8x8 work groups in parallel. Each cell counts its 26 neighbors (3D Moore neighborhood) and applies rules:"
          delay={20}
          className="text-[var(--color-text-muted)]"
        />
        <ul className="list-inside">
          <li>
            <GlitchText
              text="- Dead → Alive: 14-19 neighbors"
              delay={20}
              className="text-[var(--color-text-muted)]"
            />
          </li>
          <li>
            <GlitchText
              text="- Alive → Dead: < 13 neighbors"
              delay={20}
              className="text-[var(--color-text-muted)]"
            />
          </li>
        </ul>
      </div>

      <a
        href="https://github.com/joey8angelo/cellular-automata-3D"
        onClick={() =>
          trackEvent("Outbound Link", "Click Link", "Cellular Automaton GitHub")
        }
      >
        <GlitchText text="Learn more" />
      </a>
    </GlitchTextAnimationWrapper>
  );
}

export function CLIRaytracerDescription() {
  const { trackEvent } = useAnalytics();
  return (
    <GlitchTextAnimationWrapper
      name="CLIRaytracer"
      className="w-full h-full flex flex-col flex-1"
    >
      <div className="flex-1 flex flex-col gap-4 items-left">
        <span>
          <GlitchText text="A simple ray tracer written in " />
          <GlitchText
            text="C++"
            className="text-[var(--color-accent)] text-glow-xl"
          />
          <GlitchText
            text=" that renders 3D scenes directly to the terminal using ASCII art. The program supports lighting, shadows, a couple geometric primitives, and obj files."
            delay={0}
          />
        </span>
        <GlitchText
          text="Key Features"
          delay={500}
          className="text-[var(--color-accent)] text-glow-xl"
        />
        <ul className="list-inside">
          <li>
            <GlitchText
              text="- Real time ascii rendering with camera controls"
              delay={20}
              className="text-[var(--color-text-muted)]"
            />
          </li>
          <li>
            <GlitchText
              text="- Acceleration with Bounding Volume Hierarchies"
              delay={20}
              className="text-[var(--color-text-muted)]"
            />
          </li>
          <li>
            <GlitchText
              text="- Basic lighting models like phong and flat shading"
              delay={20}
              className="text-[var(--color-text-muted)]"
            />
          </li>
          <li>
            <GlitchText
              text="- Custom scenes through text based scene building files"
              delay={20}
              className="text-[var(--color-text-muted)]"
            />
          </li>
        </ul>
      </div>

      <a
        href="https://github.com/joey8angelo/raytracer"
        onClick={() =>
          trackEvent("Outbound Link", "Click Link", "Raytracer GitHub")
        }
      >
        <GlitchText text="Learn more" />
      </a>
    </GlitchTextAnimationWrapper>
  );
}

export function RegularExpressionEngineDescription() {
  const { trackEvent } = useAnalytics();
  return (
    <GlitchTextAnimationWrapper
      name="RegularExpressionEngine"
      className="w-full h-full flex flex-col flex-1"
    >
      <div className="flex-1 flex flex-col gap-4 items-left">
        <span>
          <GlitchText text="This project is a " />
          <GlitchText
            text="C++"
            className="text-[var(--color-accent)] text-glow-xl"
          />
          <GlitchText text=" implementation of a regular expression engine." />
        </span>
        <span>
          <GlitchText text="I wanted to explore basic parsing techniques and study " />
          <a
            href="https://en.wikipedia.org/wiki/Finite-state_machine"
            className="underline text-[var(--color-accent)] text-glow-xl"
            onClick={() =>
              trackEvent(
                "Outbound Link",
                "Click Reference",
                "Finite State Machine Wikipedia",
              )
            }
          >
            <GlitchText text="state machines" />
          </a>
          <GlitchText
            text=". The engine supports the basic regex syntax, and extended features such as escape symbols, wildcards, character classes, range operators, and more."
            delay={500}
          />
        </span>
        <span>
          <GlitchText
            text="The NFA construction is modified from "
            delay={20}
          />
          <a
            href="https://en.wikipedia.org/wiki/Thompson%27s_construction"
            className="underline text-[var(--color-accent)] text-glow-xl"
            onClick={() =>
              trackEvent(
                "Outbound Link",
                "Click Reference",
                "Thompson Construction Wikipedia",
              )
            }
          >
            <GlitchText text="Thompson's Construction" />
          </a>
          <GlitchText
            text=" which reduces the size NFA to a single state per character/symbol."
            delay={20}
          />
        </span>
      </div>

      <a
        href="https://github.com/joey8angelo/Regex"
        onClick={() =>
          trackEvent("Outbound Link", "Click Link", "Regex Engine GitHub")
        }
      >
        <GlitchText text="Learn more" />
      </a>
    </GlitchTextAnimationWrapper>
  );
}

export function FourierApproximationDescription() {
  const { trackEvent } = useAnalytics();
  return (
    <GlitchTextAnimationWrapper
      name="FourierApproximation"
      className="w-full h-full flex flex-col flex-1"
    >
      <div className="flex-1 flex flex-col gap-4 items-left">
        <span>
          <GlitchText text="I was inspired by " />
          <a
            href="https://youtu.be/r6sGWTCMz2k?si=XbOV8G8x0HVHe2LK"
            className="underline text-[var(--color-accent)] text-glow-xl"
            onClick={() =>
              trackEvent(
                "Outbound Link",
                "Click Reference",
                "Fourier 3b1b YouTube",
              )
            }
          >
            <GlitchText text="this" />
          </a>
          <GlitchText text=" 3blue1brown video to use math to make stunning visuals with a surprisingly simple function: " />
          <span className="text-[var(--color-success)] text-glow-lg">
            <GlitchText text="ƒ" />
            <sub>
              <GlitchText text="out" />
            </sub>
          </span>
          <GlitchText text="(t)=∑" />
          <span className="text-[var(--color-danger)] text-glow-xl">
            <GlitchText text="c" />
            <sub>
              <GlitchText text="n" />
            </sub>
          </span>
          <span>
            <GlitchText text="e" />
            <sup>
              <GlitchText text="-2πit" />
            </sup>
            <GlitchText text=", where the coefficients " />
          </span>
          <span className="text-[var(--color-danger)] text-glow-xl">
            <GlitchText text="c" />
            <sub>
              <GlitchText text="n" />
            </sub>
          </span>
          <GlitchText text=" are computed with: " />
          <span className="text-[var(--color-danger)] text-glow-xl">
            <GlitchText text="c" />
            <sub>
              <GlitchText text="n" />
            </sub>
          </span>
          <GlitchText text="=∫" />
          <sub>
            <GlitchText text="0" />
          </sub>
          <sup>
            <GlitchText text="1" />
          </sup>
          <GlitchText text="ƒ" />
          <sub>
            <GlitchText text="in" />
          </sub>
          <span>
            <GlitchText text="(t)e" />
            <sup>
              <GlitchText text="-n2πit" />
            </sup>
          </span>
          <br />
        </span>
        <GlitchText
          text="The Fourier Series is a way to represent any periodic function as a sum of sines and cosines. It can also approximate non-periodic functions as well, allowing the user to draw their own picture to approximate.
        "
          delay={500}
        />
      </div>
      <a
        href="/fourier"
        onClick={() =>
          trackEvent("Project Interaction", "Launch Project", "Fourier")
        }
      >
        <GlitchText text="Learn more" />
      </a>
    </GlitchTextAnimationWrapper>
  );
}

export function NeuralNetworkVisualizerDescription() {
  const { trackEvent } = useAnalytics();
  return (
    <GlitchTextAnimationWrapper
      name="NeuralNetworkVisualizer"
      className="w-full h-full flex flex-col flex-1"
    >
      <div className="flex-1 flex flex-col gap-4 items-left">
        <span>
          <GlitchText text="The Neural Network is a very important concept in Machine Learning and Artificial Intelligence. I wanted to dive deep into designing one to fully understand how a neural network learns with gradient descent, how forward and backward propagation work, and the interesting optimization problems of training, such as dynamically setting the learning rate with " />
          <a
            href="https://www.ruder.io/optimizing-gradient-descent/#gradientdescentoptimizationalgorithms"
            className="underline text-[var(--color-accent)] text-glow-xl"
            onClick={() =>
              trackEvent(
                "Outbound Link",
                "Click Reference",
                "RMSProp Documentation",
              )
            }
          >
            <GlitchText text="rmsprop" delay={0} />
          </a>
          <GlitchText text="." delay={0} />
        </span>
        <GlitchText
          text="My implementation is very customizable, with options to do stochastic or batch gradient descent, applying the softMax function to the output layer, and allowing the user to define their own activation functions."
          delay={500}
        />
        <span>
          <GlitchText text="With this I was able to achieve a " />
          <span className="text-[var(--color-success)] text-glow-xl">
            <GlitchText text="96%" delay={0} />
          </span>
          <GlitchText
            text=" accuracy on the MNIST and Iris datasets."
            delay={0}
          />
        </span>
        <GlitchText
          text="The online demo visualizes the trained network for the MNIST dataset, allowing the user to draw numbers to predict."
          delay={500}
        />
      </div>

      <a
        href="/neural-net"
        onClick={() =>
          trackEvent("Project Interaction", "Launch Project", "Neural Network")
        }
      >
        <GlitchText text="Learn more" />
      </a>
    </GlitchTextAnimationWrapper>
  );
}

export function ParticleSimulationDescription() {
  const { trackEvent } = useAnalytics();
  return (
    <GlitchTextAnimationWrapper
      name="ParticleSimulation"
      className="w-full h-full flex flex-col flex-1"
    >
      <div className="flex-1 flex flex-col gap-4 items-left">
        <GlitchText text="A GPU-accelerated particle simulation with up to 10 million particles driven by simplex noise flow fields." />
        <GlitchText
          text="Key Features"
          delay={500}
          className="text-[var(--color-accent)] text-glow-xl"
        />
        <ul className="list-inside">
          <li>
            <GlitchText
              text="- WebGL2 with transform feedback shaders for GPU-based physics"
              delay={20}
              className="text-[var(--color-text-muted)]"
            />
          </li>
          <li>
            <GlitchText
              text="- Dynamic particle count auto-tuning to maintain target FPS"
              delay={20}
              className="text-[var(--color-text-muted)]"
            />
          </li>
          <li>
            <GlitchText
              text="- Web worker for noise texture computation"
              delay={20}
              className="text-[var(--color-text-muted)]"
            />
          </li>
          <li>
            <GlitchText
              text="- Real-time settings: particle count, size, color, noise strength, drag"
              delay={20}
              className="text-[var(--color-text-muted)]"
            />
          </li>
        </ul>
      </div>
      <a
        href="/particles"
        onClick={() =>
          trackEvent("Project Interaction", "Launch Project", "Particles")
        }
      >
        <GlitchText text="Learn more" />
      </a>
    </GlitchTextAnimationWrapper>
  );
}
