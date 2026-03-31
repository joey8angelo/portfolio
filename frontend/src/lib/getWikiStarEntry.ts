import parseStarName from "./parseStarName";

const cache = new Map<number, Awaited<ReturnType<typeof getWikiStarEntry>>>();

export async function getWikiStarEntry(hr: number, name: string) {
  if (cache.has(hr)) {
    console.log(`Cache hit for HR ${hr}`);
    return cache.get(hr)!;
  }
  const { flamsteed, bayer, constellation } = parseStarName(name);

  const searchTitle = `"HR ${hr}" ${flamsteed || ""} ${bayer || ""} ${constellation || ""}`;
  console.log("Searching Wikipedia for:", searchTitle);

  const url = new URL("https://en.wikipedia.org/w/api.php");

  const params = {
    action: "query",
    generator: "search",
    gsrsearch: searchTitle,
    gsrnamespace: "0",
    gsrlimit: "5",
    prop: "extracts|info|categories",
    exintro: "1",
    explaintext: "1",
    // exsentences: "3",
    exchars: "1500",
    inprop: "url",
    format: "json",
    origin: "*",
  };

  url.search = new URLSearchParams(params).toString();

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.query || !data.query.pages) {
      cache.set(hr, null);
      return null;
    }

    const pages = Object.values(data.query.pages);
    const page = pages[0] as any;

    const categories: string[] =
      page.categories?.map((c: any) => c.title.toLowerCase()) || [];

    const isInStarCategory = categories.some(
      (c) =>
        c.includes("star") ||
        c.includes("stellar") ||
        c.includes("constellation"),
    );

    if (!isInStarCategory) {
      console.warn(
        `Wikipedia page for "${searchTitle}" does not appear to be about a star. Categories:`,
        categories,
      );
      cache.set(hr, null);
      return null;
    }

    console.log("Wikipedia search result:", page);

    const res = {
      title: page.title,
      extract: page.extract,
      url: page.fullurl,
    };
    cache.set(hr, res);
    return res;
  } catch (err) {
    console.error("Fetch error:", err);
  }
}
