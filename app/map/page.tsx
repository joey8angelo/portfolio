import { Menu } from "@/components/Menu";
import Layout from "@/app/layout";

export default function Map() {
  return (
    <Layout>
      <div style={{ width: "100vw", height: "100vh" }}>
        <Menu
          lightBlur
          description={
            <p>
              Hash Maps, or Hash Tables, are associated containers that are
              formed with a key value and a mapped value, allowing for fast
              retrieval of elements based on their key. A hash function computes
              the index in the array to store the values. Chaining and Quadratic
              probing are collision resolution techniques. Chaining appends
              colliding keys to one another. Quadratic probing finds the next
              open bucket by computing the hash and adding i^2 until an open
              bucket is found. The success of a Hash Table depends on how well
              the hash function assigns unique keys to unique buckets.
            </p>
          }
          links={[
            {
              name: "Source Code",
              href: "https://github.com/joey8angelo/portfolio/tree/main/public/legacy/map",
            },
          ]}
        />
        <iframe
          src="legacy/map/index.html"
          style={{ width: "100%", height: "100%", border: "none" }}
        />
      </div>
    </Layout>
  );
}
