import parseStarName from "./parseStarName";
import { Body } from "astronomy-engine";

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

type SkyEntry = {
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

    console.log("Wikipedia search result:", page);

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

const planetData: Partial<Record<Body, SkyEntry>> = {
  [Body.Mercury]: {
    title: "Mercury",
    url: "https://en.wikipedia.org/wiki/Mercury_(planet)",
    extract: `
      Mercury is the first planet from the Sun and the smallest in the Solar System. It is a rocky planet with a trace atmosphere and a surface gravity slightly higher than that of Mars. The surface of Mercury is similar to Earth's Moon, being cratered, with an expansive rupes system generated from thrust faults, and bright ray systems, formed by ejecta. Its largest crater, Caloris Planitia, has a diameter of 1,550 km (960 mi), which is about one-third the diameter of the planet (4,880 km or 3,030 mi). Being the most inferior orbiting planet, it always appears close to the Sun in Earth's sky, either as a "morning star" or an "evening star". It is the planet with the highest delta-v required for travel from Earth, as well as to and from the other planets in the Solar System.
          
      Mercury's sidereal year (88.0 Earth days) and sidereal day (58.65 Earth days) are in a 3:2 ratio, in a spin-orbit resonance. Consequently, one solar day (sunrise to sunrise) on Mercury lasts for around 176 Earth days: twice the planet's sidereal year. This means that one side of Mercury will remain in sunlight for one Mercurian year of 88 Earth days; while during the next orbit, that side will be in darkness all the time until the next sunrise after another 88 Earth days. Above the planet's surface is an extremely tenuous exosphere and a faint magnetic field just strong enough to deflect solar winds. Combined with its high orbital eccentricity, the planet's surface has widely varying sunlight intensity and temperature, with the equatorial regions ranging from -170 °C (-270 °F) at night to 420 °C (790 °F) during sunlight. Due to its very small axial tilt, the planet's poles are permanently shadowed. This strongly suggests that water ice could be present in the craters.
        
      Like the other planets in the Solar System, Mercury formed approximately 4.5 billion years ago. There are competing hypotheses about Mercury's origins and development, some of which incorporate collision with planetesimals and rock vaporization; as of the early 2020s, many broad details of Mercury's geological history are still under investigation or pending data from space probes. Its mantle is highly homogeneous, which suggests that Mercury had a magma ocean early in its history, like the Moon. According to current models, Mercury may have a solid silicate crust and mantle overlaying a solid outer core, a deeper liquid core layer, and a solid inner core. Mercury is expected to be destroyed, along with Venus, and possibly the Earth and the Moon, when the Sun becomes a red giant in approximately seven or eight billion years.

      Mercury is a classical planet that has been observed and recognized throughout history as a planet (or wandering star). In English, it is named after the ancient Roman god Mercurius (Mercury), god of commerce and communication, and the messenger of the gods. The first successful flyby of Mercury was conducted by Mariner 10 in 1974, and it has since been visited and explored by the MESSENGER and BepiColombo orbiters. 
      `,
  },
  [Body.Venus]: {
    title: "Venus",
    url: "https://en.wikipedia.org/wiki/Venus",
    extract: `
      Venus is the second planet from the Sun. Similar in size and mass to Earth, Venus has no liquid water, and its atmosphere is far thicker and denser than that of any other rocky body in the Solar System. The atmosphere is composed mostly of carbon dioxide and has a thick cloud layer of sulfuric acid that spans the whole planet. At the mean surface level, the atmosphere reaches a temperature of 737 K (464 °C; 867 °F) and a pressure 92 times greater than Earth's at sea level, turning the lowest layer of the atmosphere into a supercritical fluid. From Earth, Venus is visible as a star-like point of light, appearing brighter than any other natural point of light in the sky, and as an inferior planet it is always relatively close to the Sun, as either the brightest "morning star" or "evening star".

      The orbits of Venus and Earth make the two planets approach each other in synodic periods of 1.6 years. In the course of this, Venus comes closer to Earth than any other planet. In interplanetary spaceflight from Earth, Venus is frequently used as a waypoint for gravity assists, offering a faster and more economical route. Venus has no moons and a very slow retrograde rotation about its axis, a result of competing forces of solar tidal locking and differential heating of Venus's massive atmosphere. As a result, a Venusian day is 116.75 Earth days long, about half a Venusian solar year, which is 224.7 Earth days long.

      Venus has a weak magnetosphere; lacking an internal dynamo, it is induced by the solar wind interacting with the atmosphere. Internally, Venus has a core, a mantle, and a crust. Internal heat escapes through active volcanism, resulting in resurfacing, instead of plate tectonics. Venus may have had liquid surface water early in its history with a habitable environment, before a runaway greenhouse effect evaporated any water and turned Venus into its present state. There are atmospheric conditions at cloud layer altitudes that are the most similar ones to Earth in the Solar System and have been identified as possibly favourable for life on Venus, with potential biomarkers found in 2020, spurring new research and missions to Venus.

      Throughout history humans across the globe have observed Venus and it has acquired particular importance in many cultures. With telescopes, the phases of Venus became discernible and, by 1613, were presented as decisive evidence disproving the then-dominant geocentric model and supporting the heliocentric model. Venus was visited for the first time in 1961 by Venera 1, which flew past the planet, achieving the first interplanetary spaceflight. The first data from Venus were returned during the second interplanetary mission, Mariner 2, in 1962. In 1967, the first interplanetary impactor, Venera 4, reached Venus, followed by the lander Venera 7 in 1970. As of 2025, Solar Orbiter is on its way to fly-by Venus in 2026, and the next mission planned to launch to Venus is the Venus Life Finder, scheduled for 2026 as well. 
      `,
  },
  [Body.Mars]: {
    title: "Mars",
    url: "https://en.wikipedia.org/wiki/Mars",
    extract: `
      Mars is the fourth planet from the Sun. It is also known as the "Red Planet", for its orange-red appearance. Mars is a desert-like rocky planet with a tenuous atmosphere that is primarily carbon dioxide (CO2). At the average surface level the atmospheric pressure is a few thousandths of Earth's, atmospheric temperature ranges from −153 to 20 °C (−243 to 68 °F), and cosmic radiation is high. Mars retains some water, in the ground as well as thinly in the atmosphere, forming cirrus clouds, fog, frost, larger polar regions of permafrost and ice caps (with seasonal CO2 snow), but no bodies of liquid surface water. Its surface gravity is roughly a third of Earth's or double that of the Moon. Its diameter, 6,779 km (4,212 mi), is about half the Earth's, or twice the Moon's, and its surface area is the size of all the dry land of Earth.

      Fine dust is prevalent across the surface and the atmosphere, being picked up and spread at the low Martian gravity even by the weak wind of the tenuous atmosphere. The terrain of Mars roughly follows a north–south divide, the Martian dichotomy, with the northern hemisphere mainly consisting of relatively flat, low lying plains, and the southern hemisphere of cratered highlands. Geologically, the planet is fairly active with marsquakes trembling underneath the ground, but also hosts many enormous volcanoes that are extinct (the tallest is Olympus Mons, 21.9 km or 13.6 mi tall), as well as one of the largest canyons in the Solar System (Valles Marineris, 4,000 km or 2,500 mi long). Mars has two natural satellites that are small and irregular in shape: Phobos and Deimos. With a significant axial tilt of 25 degrees, Mars experiences seasons, like Earth (which has an axial tilt of 23.5 degrees). A Martian solar year is equal to 1.88 Earth years (687 Earth days), a Martian solar day (sol) is equal to 24.6 hours.

      Mars formed along with the other planets approximately 4.5 billion years ago. During the martian Noachian period (4.5 to 3.5 billion years ago), its surface was marked by meteor impacts, valley formation, erosion, the possible presence of water oceans and the loss of its magnetosphere. The Hesperian period (beginning 3.5 billion years ago and ending 3.3–2.9 billion years ago) was dominated by widespread volcanic activity and flooding that carved immense outflow channels. The Amazonian period, which continues to the present, is the currently dominating and remaining influence on geological processes. Because of Mars's geological history, the possibility of past or present life on Mars remains an area of active scientific investigation, with some possible traces needing further examination.

      Being visible with the naked eye in Earth's sky as a red wandering star, Mars has been observed throughout history, acquiring diverse associations in different cultures. In 1963 the first flight to Mars took place with Mars 1, but communication was lost en route. The first successful flyby exploration of Mars was conducted in 1965 with Mariner 4. In 1971 Mariner 9 entered orbit around Mars, being the first spacecraft to orbit any body other than the Moon, Sun or Earth; following in the same year were the first uncontrolled impact (Mars 2) and first successful landing (Mars 3) on Mars. Probes have been active on Mars continuously since 1997. At times, more than ten probes have simultaneously operated in orbit or on the surface, more than at any other planet beyond Earth. Mars is an often proposed target for future crewed exploration missions, though no such mission is currently planned. 
      `,
  },
  [Body.Jupiter]: {
    title: "Jupiter",
    url: "https://en.wikipedia.org/wiki/Jupiter",
    extract: `
      Jupiter is the fifth planet from the Sun, and the largest in the Solar System. It is a gas giant with a mass nearly 2.5 times that of all the other planets in the Solar System combined and slightly less than one-thousandth the mass of the Sun. Its diameter is 11 times that of Earth and a tenth that of the Sun. Jupiter orbits the Sun at a distance of 5.20 AU (778.5 Gm), with an orbital period of 11.86 years. It is the third-brightest natural object in the Earth's night sky, after the Moon and Venus, and has been observed since prehistoric times. Its name derives from that of Jupiter, the chief deity of ancient Roman religion.

      Jupiter was the first of the Sun's planets to form, and its inward migration during the primordial phase of the Solar System affected much of the formation history of the other planets. Jupiter's atmosphere consists of 76% hydrogen and 24% helium by mass, with a denser interior. It contains traces of the elements carbon, oxygen, sulfur, neon, and compounds such as ammonia, water vapour, phosphine, hydrogen sulfide, and hydrocarbons. Jupiter's helium abundance is 80% of the Sun's, similar to Saturn's composition.

      The outer atmosphere is divided into a series of latitudinal bands, with turbulence and storms along their interacting boundaries; the most obvious result of this is the Great Red Spot, a giant storm that has been recorded since 1831. Because of its rapid rotation rate, one turn in ten hours, Jupiter is an oblate spheroid; the radius to the equator is about 7% larger than the radius to its poles. Its internal structure is believed to consist of an outer mantle of fluid metallic hydrogen and a diffuse inner core of denser material. The ongoing contraction of Jupiter's interior generates more heat than the planet receives from the Sun. Jupiter's magnetic field is the strongest and second-largest contiguous structure in the Solar System, generated by eddy currents within the fluid, metallic hydrogen core. The solar wind interacts with the magnetosphere, extending it outward and affecting Jupiter's orbit.

      At least 101 moons orbit the planet; the four largest moons—Io, Europa, Ganymede, and Callisto—orbit within the magnetosphere and are visible with common binoculars. Ganymede, the largest of the four, is larger than the planet Mercury. Jupiter is surrounded by a faint system of planetary rings. The rings of Jupiter consist mainly of dust and have three main segments: an inner torus of particles known as the halo, a relatively bright main ring, and an outer gossamer ring. The rings have a reddish colour in visible and near-infrared light. The age of the ring system is unknown, possibly dating back to Jupiter's formation. Since 1973, Jupiter has been visited by nine robotic probes: seven flybys and two dedicated orbiters (with two more en route). Jupiter-like exoplanets have also been found in other planetary systems. 
      `,
  },
  [Body.Saturn]: {
    title: "Saturn",
    url: "https://en.wikipedia.org/wiki/Saturn",
    extract: `
      Saturn is the sixth planet from the Sun and the second largest in the Solar System, after Jupiter. It is a gas giant, with an average radius of about 9 times that of Earth. It has an eighth of the average density of Earth, but is over 95 times more massive. Even though Saturn is almost as big as Jupiter, Saturn has less than a third of its mass. Saturn orbits the Sun at a distance of 9.59 AU (1,434 million km), with an orbital period of 29.45 years.

      Saturn's interior is thought to be composed of a rocky core, surrounded by a deep layer of metallic hydrogen, an intermediate layer of liquid hydrogen and liquid helium, and an outer layer of gas. Saturn has a pale yellow hue, due to ammonia crystals in its upper atmosphere. An electrical current in the metallic hydrogen layer is thought to give rise to Saturn's planetary magnetic field, which is weaker than Earth's, but has a magnetic moment 580 times that of Earth because of Saturn's greater size. Saturn's magnetic field strength is about a twentieth that of Jupiter. The outer atmosphere is generally bland and lacking in contrast, although long-lived features can appear. Wind speeds on Saturn can reach 1,800 kilometres per hour (1,100 miles per hour).

      The planet has a bright and extensive system of rings, composed mainly of ice particles, with a smaller amount of rocky debris and dust. At least 285 moons orbit the planet, of which 63 are officially named; these do not include the hundreds of moonlets in the rings. Titan, Saturn's largest moon and the second largest in the Solar System, is larger (but less massive) than the planet Mercury and is the only moon in the Solar System that has a substantial atmosphere.
      `,
  },
  [Body.Uranus]: {
    title: "Uranus",
    url: "https://en.wikipedia.org/wiki/Uranus",
    extract: `
      Uranus is the seventh planet from the Sun. It is a gaseous cyan-coloured ice giant. Most of the planet is made of water, ammonia, and methane in a supercritical phase of matter, which astronomy calls "ice" or volatiles. The planet's atmosphere has a complex layered cloud structure and has the lowest minimum temperature (49 K (−224 °C; −371 °F)) of all the Solar System's planets. It has a marked axial tilt of 82.23° with a retrograde rotation period of 17 hours and 14 minutes. This means that in an 84-Earth-year orbital period around the Sun, its poles get around 42 years of continuous sunlight, followed by 42 years of continuous darkness.

      Uranus has the third-largest diameter and fourth-largest mass among the Solar System's planets. Based on current models, inside its volatile mantle layer is a rocky core, and a thick hydrogen and helium atmosphere surrounds it. Trace amounts of hydrocarbons (thought to be produced via hydrolysis) and carbon monoxide along with carbon dioxide (thought to have originated from comets) have been detected in the upper atmosphere. There are many unexplained climate phenomena in Uranus's atmosphere, such as its peak wind speed of 900 km/h (560 mph), variations in its polar cap, and its erratic cloud formation. The planet also has very low internal heat compared to other giant planets, the cause of which remains unclear.

      Like the other giant planets, Uranus has a ring system, a magnetosphere, and many natural satellites. The extremely dark ring system reflects only about 2% of the incoming light. Uranus's 29 natural satellites include 19 known regular moons, of which 14 are small inner moons. Further out are the larger five major moons of the planet: Miranda, Ariel, Umbriel, Titania, and Oberon. Orbiting at a much greater distance from Uranus are the ten known irregular moons. The planet's magnetosphere is highly asymmetric and has many charged particles, which may be the cause of the darkening of its rings and moons.

      Uranus is visible to the naked eye, but it is very dim and moves very slowly relative to the background stars and was not classified as a planet until 1781, when it was first observed by William Herschel. About seven decades after its discovery, consensus was reached that the planet be named after the Greek god Uranus (Ouranos), one of the Greek primordial deities. As of 2026, it has been visited only once when in 1986 the Voyager 2 probe flew by the planet. Though nowadays it can be resolved and observed by telescopes, there is much desire to revisit the planet, as shown by Planetary Science Decadal Survey's decision to make the proposed Uranus Orbiter and Probe mission a top priority in the 2023–2032 survey, and the CNSA's proposal to fly by the planet with a subprobe of Tianwen-4.
      `,
  },
  [Body.Neptune]: {
    title: "Neptune",
    url: "https://en.wikipedia.org/wiki/Neptune",
    extract: `
      Neptune is the eighth and farthest known planet orbiting the Sun. It is the fourth-largest planet in the Solar System by diameter, the third-most-massive planet, and the densest giant planet. It is 17 times the mass of Earth. Compared to Uranus, its neighbouring ice giant, Neptune is slightly smaller, but more massive and denser. Being composed primarily of gases and liquids, it has no well-defined solid surface. Neptune orbits the Sun once every 164.8 years at an orbital distance of 30.1 astronomical units (4.5 billion kilometres; 2.8 billion miles). It is named after the Roman god of the sea and has the astronomical symbol ♆, representing Neptune's trident.

      Neptune is not visible to the unaided eye and is the only planet in the Solar System that was not initially observed by direct empirical observation. Rather, unexpected changes in the orbit of Uranus led Alexis Bouvard to hypothesise that its orbit was subject to gravitational perturbation by an unknown planet. After Bouvard's death, the position of Neptune was mathematically predicted from his observations, independently, by John Couch Adams and Urbain Le Verrier. Neptune was subsequently directly observed with a telescope on 23 September 1846 by Johann Gottfried Galle within a degree of the position predicted by Le Verrier. Its largest moon, Triton, was discovered shortly thereafter, though none of the planet's remaining moons were located telescopically until the 20th century.
      
      The planet's distance from Earth gives it a small apparent size, and its distance from the Sun renders it very dim, making it challenging to study with Earth-based telescopes. Only the advent of the Hubble Space Telescope and of large ground-based telescopes with adaptive optics allowed for detailed observations. Voyager 2, which flew by Neptune on 25 August 1989, remains the only spacecraft to visit the planet. Like the gas giants (Jupiter and Saturn), Neptune's atmosphere is composed primarily of hydrogen and helium, along with traces of hydrocarbons and possibly nitrogen, but contains a higher proportion of ices such as water, ammonia and methane. Similar to Uranus, its interior is primarily composed of ices and rock; both planets are normally considered "ice giants" to distinguish them. Along with Rayleigh scattering, traces of methane in the outermost regions make Neptune appear faintly blue.
      
      In contrast to the strongly seasonal atmosphere of Uranus, which can be featureless for long periods of time, Neptune's atmosphere has active and consistently visible weather patterns. At the time of the Voyager 2 flyby in 1989, the planet's southern hemisphere had a Great Dark Spot comparable to the Great Red Spot on Jupiter. In 2018, a newer main dark spot and smaller dark spot were identified and studied. These weather patterns are driven by the strongest sustained winds of any planet in the Solar System, as high as 2,100 km/h (580 m/s; 1,300 mph). Because of its great distance from the Sun, Neptune's outer atmosphere is one of the coldest places in the Solar System, with temperatures at its cloud tops approaching 55 K (−218 °C; −361 °F). Temperatures at the planet's centre are approximately 5,400 K (5,100 °C; 9,300 °F). Neptune has a faint and fragmented ring system (labelled "arcs"), discovered in 1984 and confirmed by Voyager 2.
      `,
  },
};

export function getPlanetEntry(planet: Body): SkyEntry {
  if (planetData[planet]) {
    return planetData[planet]!;
  } else {
    return {
      title: Body[planet],
      url: `#`,
      extract: "No entry found for this planet.",
    };
  }
}
