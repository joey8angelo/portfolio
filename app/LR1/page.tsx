import { Menu } from "@/components/Menu";
import Layout from "@/app/layout";

export default function LR1() {
  return (
    <Layout>
      <div style={{ width: "100vw", height: "100vh" }}>
        <Menu
          lightBlur
          description={
            <p>
              LR1 parser visualizer, or Canonical LR parser is a bottom up
              parser for all deterministic context free languages, done with one
              lookahead symbol. The LR(1) parser can easily reduce the amount of
              memory required by merging similar states, making an LALR(1)
              parser. However, LALR(1) grammars have slightly less language
              recognition power, that is a smaller set of context free grammars.
            </p>
          }
          links={[
            {
              name: "Source Code",
              href: "https://github.com/joey8angelo/portfolio/tree/main/public/legacy/LR1",
            },
          ]}
        />
        <iframe
          src="legacy/LR1/index.html"
          style={{ width: "100%", height: "100%", border: "none" }}
        />
      </div>
    </Layout>
  );
}
