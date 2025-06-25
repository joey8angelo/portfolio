import { Menu } from "@/components/Menu";

export default function NeuralNet() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Menu
        lightBlur
        links={[
          {
            name: "Convolutional NN",
            href: "https://github.com/joey8angelo/pynet",
          },
          {
            name: "Ground Up NN",
            href: "https://github.com/joey8angelo/NNet",
          },
          {
            name: "Source Code",
            href: "https://github.com/joey8angelo/portfolio/tree/main/public/legacy/neural-net",
          },
        ]}
        description={
          <p>
            This Neural Network Visualizer allows the user to explore how a
            neural network can process handwritten digits using a 3D
            visualization. Draw a digit with the canvas at the bottom right, and
            view each nodes weights by clicking it.
            <br />
            The weights and biases for this network were trained with my ground
            up neural network linked above. I also implemented a convolutional
            neural network for a school project, also above.
          </p>
        }
      />
      <iframe
        src="legacy/neural-net/index.html"
        style={{ width: "100%", height: "100%", border: "none" }}
      />
    </div>
  );
}
