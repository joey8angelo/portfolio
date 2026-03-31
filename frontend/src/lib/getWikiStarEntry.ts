import parseStarName from "./parseStarName";

type WikiPageEntry = {
  canonicalurl: string;
  categories: { ns: number; title: string }[];
  contentmodel: string;
  editurl: string;
  extract: string;
  fullurl: string;
  index: number;
  lastrevid: number;
  length: number;
  ns: number;
  pageid: number;
  pagelanguage: string;
  pagelanguagedir: string;
  pagelanguagehtmlcode: string;
  title: string;
  touched: string;
};

type WikiStarEntry = {
  title: string;
  extract: string;
  url: string;
} | null;

const cache = new Map<number, WikiStarEntry>();

export async function getWikiStarEntry(
  hr: number,
  name: string,
): Promise<WikiStarEntry> {
  if (cache.has(hr)) {
    console.log(`Cache hit for HR ${hr}`);
    return cache.get(hr)!;
  }
  const { flamsteed, bayer, constellation } = parseStarName(name);

  const searchTitle = `"HR ${hr}" ${flamsteed || ""} ${bayer || ""} ${constellation || ""}`;

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
    exchars: "3000",
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
    const page = pages[0] as WikiPageEntry;

    const categories: string[] =
      page.categories?.map((c: { title: string }) => c.title.toLowerCase()) ||
      [];

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
    return null;
  }
}
