import parseStarName from "./parseStarName";
import { getPlanetData } from "./planetData";
import { satelliteData } from "./satelliteData";

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

export type SkyEntry = {
  title: string;
  extract: string;
  url: string;
} | null;

const cache = new Map<number, SkyEntry>();

/*
 * Gets the Wikipedia entry for a star given its HR number and name. Uses the
 * MediaWiki API to search for the star and retrieves its extract and URL.
 */
export async function getStarEntry(
  hr: number,
  name: string,
): Promise<SkyEntry> {
  if (cache.has(hr)) {
    console.log(`Cache hit for HR ${hr}`);
    return cache.get(hr)!;
  }

  // Construct the search phrase
  // must include HR number and uses the flamsteed, bayer, and constellation
  // info from the ybsc Name field to increase the chances of finding the correct star
  const { flamsteed, bayer, constellation } = parseStarName(name);
  const searchTitle = `"HR ${hr}" ${flamsteed || ""} ${bayer || ""} ${constellation || ""}`;

  const url = new URL("https://en.wikipedia.org/w/api.php");
  const params = {
    action: "query",
    generator: "search",
    gsrsearch: searchTitle,
    gsrnamespace: "0", // only search in the main/article namespace
    gsrlimit: "1", // only get the top search result
    prop: "extracts|info|categories", // get the extract, URL, and categories of the page
    exintro: "1", // only get the introduction extract
    explaintext: "1", // get plain text extract without HTML
    inprop: "url", // include the full URL of the page
    format: "json",
    origin: "*",
  };
  url.search = new URLSearchParams(params).toString();

  try {
    const response = await fetch(url);
    const data = await response.json();

    // No pages found
    if (!data.query || !data.query.pages) {
      cache.set(hr, null);
      return null;
    }

    const pages = Object.values(data.query.pages);
    const page = pages[0] as WikiPageEntry;

    // Check if the page categories indicate it is a star
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

    const res = {
      title: page.title.toLowerCase().replace(/ \(star\)/, ""),
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

export function getPlanetEntry(id: number): SkyEntry {
  const data = getPlanetData(id);
  if (data) {
    return data.skyEntry;
  } else {
    return {
      title: `Planet ${id}`,
      url: `#`,
      extract:
        "THIS IS BAD, THIS SHOULD NEVER HAPPEN. YOU DID SOMETHING WRONG BUSTER.",
    };
  }
}

export function getSatelliteEntry(id: number, name: string): SkyEntry {
  const satData = (
    satelliteData as Record<number, { url: string; extract: string }>
  )[id];
  return {
    title: name,
    url: satData?.url || "#",
    extract: satData?.extract || "No information found",
  };
}
