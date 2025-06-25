"use client";

import React, { useRef, useEffect, useState } from "react";
import ParticleSimulation from "@/components/ParticleSimulation";
import { Menu } from "@/components/Menu";
import { TextScramble, TextScrambleHandle } from "@/components/TextScramble";
import Project from "@/components/Project";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Home() {
  const mainDivRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<TextScrambleHandle>(null);
  const locationRef = useRef<TextScrambleHandle>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const localHint = localStorage.getItem("showHint");
    if (localHint && localHint === "false") {
      setScrolled(true);
    }
    const handleScroll = () => {
      if (!scrolled) {
        setScrolled(true);
      }
      const position = mainDivRef.current?.scrollTop || 0;
      if (position === 0) {
        nameRef.current?.growAll();
        locationRef.current?.growAll();
      } else {
        nameRef.current?.shrinkAll();
        locationRef.current?.shrinkAll();
      }
    };
    mainDivRef.current = document.getElementById("main-app") as HTMLDivElement;
    mainDivRef.current.addEventListener("scroll", handleScroll);
    return () => {
      mainDivRef.current?.removeEventListener("scroll", handleScroll);
      nameRef.current = null;
      locationRef.current = null;
      mainDivRef.current = null;
    };
  }, []);

  function scrollToTop() {
    mainDivRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }

  const projects = [
    {
      title: "Raytracer",
      link: "https://github.com/joey8angelo/raytracer",
      description: (
        <p>
          A simple raytracer built in C++ that renders 3D scenes in real time
          directly to the terminal using ASCII art. This project highlights the
          theoretical concepts of ray tracing, including ray-object
          intersection, shading, and lighting. The raytracer supports loading
          scenes from text files, rendering meshes, spheres, and planes. The
          program accelerates ray-object intersection using bounding volume
          hierarchies (BVH) and CPU multithreading. I hope to accelerate the
          raytracer further using CUDA.
        </p>
      ),
      images: [
        { src: "/monkey.gif", alt: "Image 1" },
        { src: "/donut.gif", alt: "Image 2" },
      ],
    },
    {
      title: "Plant System",
      link: "/plant-system",
      description: (
        <p>
          This web application uses L-systems to generate and render 3D
          structures. An L-system is a parallel rewriting system that can be
          used to model the growth processes of plants and other fractal-like
          structures. The L-system is defined by a set of production rules that
          specify how to replace symbols in a string with other symbols. The
          system uses special control symbols in the production to control how
          the structure is rendered in 3D space.
        </p>
      ),
      images: [
        { src: "/tree.png", alt: "Plant 1" },
        { src: "/tree2.png", alt: "Plant 2" },
        { src: "/bush.png", alt: "Plant 3" },
      ],
    },
    {
      title: "Fourier Series",
      link: "/fourier-series",
      description: (
        <p>
          I was inspired by{" "}
          <a
            href="https://youtu.be/r6sGWTCMz2k?si=XbOV8G8x0HVHe2LK"
            className="underline"
          >
            this
          </a>{" "}
          3blue1brown video to use math to make stunning visuals with a
          surprisingly simple function{" "}
          <span style={{ color: "green" }}>
            &fnof;<sub>out</sub>
          </span>
          (t)=&sum;
          <span style={{ color: "red" }}>
            c<sub>n</sub>
          </span>
          e<sup>-2&pi;it</sup>, where the coefficients{" "}
          <span style={{ color: "red" }}>
            c<sub>n</sub>
          </span>{" "}
          are computed from the input function{" "}
          <span style={{ color: "red" }}>
            c<sub>n</sub>
          </span>
          =&int;<sub>0</sub>
          <sup>1</sup>&fnof;<sub>in</sub>(t)e<sup>-n2&pi;it</sup>.<br />
          The Fourier Series is a way to represent any periodic function as a
          sum of sines and cosines. It can also approximate non-periodic
          functions as well, allowing the user to draw their own picture to
          approximate.
        </p>
      ),
      images: [
        { src: "/square_wave.gif", alt: "Square Wave" },
        { src: "/heart.gif", alt: "Fourier Series Heart" },
      ],
    },
    {
      title: "Neural Network",
      link: "/neural-net",
      description: (
        <p>
          The Neural Network is a very important concept in Machine Learning and
          Artificial Intelligence. I wanted to dive deep into designing one to
          fully understand how a neural network learns with gradient descent,
          how forward and backward propagation work, and the interesting
          optimization problems of training, such as dynamically setting the
          learning rate with{" "}
          <a
            href="https://www.ruder.io/optimizing-gradient-descent/#gradientdescentoptimizationalgorithms"
            className="underline"
          >
            rmsprop
          </a>
          .<br />
          My implementation is very customizable, with options to do stochastic
          or batch gradient descent, applying the softMax function to the output
          layer, and allowing the user to define their own activation functions.
          With this I was able to achieve a
          <span style={{ color: "red" }}> 96% </span>
          accuracy on the MNIST and Iris datasets.
          <br />
          The online demo visualizes the trained network for the MNIST dataset,
          allowing the user to draw numbers to predict.
        </p>
      ),
      images: [{ src: "/neural-net.gif", alt: "Neural Network Demo" }],
    },
    {
      title: "Regex",
      link: "https://github.com/joey8angelo/Regex",
      description: (
        <p>
          This project is a C++ implementation of a regular expression engine. I
          wanted to explore basic parsing techniques and study{" "}
          <a
            href="https://en.wikipedia.org/wiki/Finite-state_machine"
            className="underline"
          >
            state machines
          </a>
          . The engine supports the basic regex syntax shown in the first image,
          and extended features such as escape symbols, wildcards, character
          classes, range operators, and more. The NFA construction is modified
          from{" "}
          <a
            href="https://en.wikipedia.org/wiki/Thompson%27s_construction"
            className="underline"
          >
            Thompson's Construction
          </a>{" "}
          which reduces the size NFA to a single state per character/symbol. The
          second image shows an example of the constructed NFA with reduced
          states, while the third shows a more textbook NFA construction.
        </p>
      ),
      images: [
        { src: "/regex1.png", alt: "Regex Syntax" },
        { src: "/regex2.png", alt: "Regex NFA Reduced" },
        { src: "/regex3.png", alt: "Regex NFA Full" },
      ],
    },
    {
      title: "Other Projects",
      link: "#",
      description: (
        <p>
          I have lots of other projects on my{" "}
          <a href="https://github.com/joey8angelo" className="underline">
            GitHub
          </a>
          . Some of my other fun web projects include an{" "}
          <a href="/LL1" className="underline">
            LL(1) Parser Generator
          </a>
          , an{" "}
          <a href="/LR1" className="underline">
            LR/LALR(1) Parser Generator
          </a>
          , a{" "}
          <a href="/map" className="underline">
            Hash Map Visualizer
          </a>
          , and of course the{" "}
          <a href="/particles" className="underline">
            Particle Simulation
          </a>{" "}
          that is the background of this page.
        </p>
      ),
    },
  ];
  return (
    <>
      <div
        id="main-app"
        className="snap-y snap-proximity w-screen h-screen overflow-y-scroll overflow-x-hidden"
      >
        <section className="w-screen h-screen snap-center relative">
          <TextScramble
            className="font-extrabold cursor-default text-3xl lg:text-6xl absolute top-40 left-15 w-fit h-fit"
            text="JOSEPH D'ANGELO"
            ref={nameRef}
            shrinkSpeed={10}
            shrinkOffset={5}
            growSpeed={2}
            growOffset={30}
          />
          <TextScramble
            className="font-extrabold text-right cursor-default text-3xl lg:text-6xl
            absolute bottom-40 right-15 w-fit h-fit"
            text="LOS ANGELES CA"
            ref={locationRef}
            shrinkSpeed={10}
            shrinkOffset={5}
            growSpeed={2}
            growOffset={30}
          />
          {!scrolled && (
            <motion.div
              className="absolute bottom-2 left-15"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              vvv scroll down vvv
            </motion.div>
          )}
        </section>
        {projects.map((project, index) => (
          <Project
            key={index}
            className="w-screen h-screen snap-center"
            title={project.title}
            link={project.link}
            description={project.description}
            images={project.images}
            linkHint={index === 0}
          />
        ))}
        <div className="relative w-screen h-screen snap-center">
          <div
            className="absolute bottom-10 right-10 flex row items-center cursor-pointer"
            onClick={scrollToTop}
          >
            <Image
              className="w-fit h-fit"
              src="/gummy.png"
              alt="Gummy Bart"
              width={64}
              height={64}
            />
            <p>
              You made it all the way to the end :)
              <br />
              Did you like the website? Let me know, my email is in the menu at
              the top right.
              <br />
              Click to go back to the top.
            </p>
          </div>
        </div>
      </div>
      <Menu
        links={[
          { name: "Change The Background", href: "/particles" },
          {
            name: "Source Code",
            href: "https://github.com/joey8angelo/portfolio",
          },
        ]}
        description={
          <p>
            Hi! I'm Joey, a Master's student at UCR studying Computer Science. I
            enjoy building high performance and creative applications. I also
            love to read and play video games, so contact me with the link above
            and let me know your favorite book or game!
          </p>
        }
      />
      <ParticleSimulation
        className="fixed top-0 left-0 w-screen h-screen -z-1"
        id="background_sim"
        particleCount={524288}
      />
    </>
  );
}
