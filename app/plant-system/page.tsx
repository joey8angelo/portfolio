import { Menu } from "@/components/Menu";
import Layout from "@/app/layout";

export default function PlantSystem() {
  return (
    <Layout>
      <div style={{ width: "100vw", height: "100vh" }}>
        <Menu
          lightBlur
          description={
            <p>
              This application uses L-systems to procedurally generate and
              render 3D models of plants and other fractal-like structures.
              L-systems are a parallel rewriting system that use a set of
              production rules to replace symbols in a string with other
              symbols, allowing for complex structures to be generated from
              simple rules.
              <br />
              The space bar will iterate the selected system, and 'r' will reset
              it to the starting axiom. Changing the system settings will copy
              the current data to the custom system, where you can modify the
              rules.
              <br />
              Refer to{" "}
              <a
                href="https://link.springer.com/chapter/10.1007/3-540-18771-5_74"
                className="underline"
              >
                this paper
              </a>{" "}
              for more information on the control symbols in the production
              rules.
            </p>
          }
          links={[
            {
              name: "Source Code",
              href: "https://github.com/joey8angelo/portfolio/tree/main/public/legacy/plant-system",
            },
          ]}
        />
        <iframe
          src="legacy/plant-system/index.html"
          style={{ width: "100%", height: "100%", border: "none" }}
        />
      </div>
    </Layout>
  );
}
