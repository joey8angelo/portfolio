import { Menu } from "@/components/Menu";
import Layout from "@/app/layout";

export default function LL1() {
  return (
    <Layout>
      <div style={{ width: "100vw", height: "100vh" }}>
        <Menu
          lightBlur
          description={
            <p>
              An LL parser or Left-to-right, leftmost derivation parser, is a
              top down parser for a restricted context free language. This
              visualizer shows an LL(1) parser which has one lookahead in form
              FIRST and FOLLOW sets. The FIRST set of a nonterminal NT,
              FIRST(NT), is the set of terminals that can be the first element
              of any string derived from NT. FOLLOW(NT) is a set of terminals
              that can appear immediately to the right of NT in any derivation.
              LL(1) grammars must not have certain conflicts, such as
              FIRST/FIRST conflicts, left recursion, and FIRST/FOLLOW conflicts.
            </p>
          }
          links={[
            {
              name: "Source Code",
              href: "https://github.com/joey8angelo/portfolio/tree/main/public/legacy/LL1",
            },
          ]}
        />
        <iframe
          src="legacy/LL1/index.html"
          style={{ width: "100%", height: "100%", border: "none" }}
        />
      </div>
    </Layout>
  );
}
