import axios from "axios";
import * as cheerio from "cheerio";
import * as url from "url";
import * as fs from "fs";

export interface ProductDetails {
  barcode: string;
  name: string;
  picUrl?: string;
}

export const search = async (
  barcode: string
): Promise<ProductDetails | undefined> => {
  // 6438428934388
  const kRuokaUrl = "k-ruoka.fi";
  const foodieUrl = "foodie.fi";

  // TODO voiko googlen jättää välistä ja tehdä suora haku kauppaan?

  const siteFilter = [kRuokaUrl, foodieUrl]
    .map((s) => "site:" + s)
    .join("+OR+");
  const queryUrl = `https://www.google.com/search?q=${barcode}+${siteFilter}`;

  const googleRes = await axios.get(queryUrl);
  const page = cheerio.load(googleRes.data);

  // /url?q=https://www.k-ruoka.fi/kauppa/tuote/pirkka-mattateippi-19mmx15mkatklaite-6438428934388&amp;sa=U&amp;ved=2ahUKEwj99prUlfPtAhUIsJ4KHW6qDDoQFjAAegQIABAB&amp;usg=AOvVaw30f30r_12w-YyNXfEiNgSG

  const links = page("a")
    .toArray()
    .map((a) => page(a).attr("href"));

  const storeResult = links.find((url) => url.startsWith("/url?q="));

  const storeLink = url.parse(storeResult, true).query.q as string;
  console.log(storeLink);

  if (storeLink.includes(kRuokaUrl)) {
    return kRuokaScraper(barcode, storeLink);
  }
  if (storeLink.includes(foodieUrl)) {
    return foodieScraper(barcode, storeLink);
  }
};

const kRuokaScraper = async (
  barcode: string,
  link: string
): Promise<ProductDetails | undefined> => {
  console.log("Fetching kruoka data", link);
  const res = await axios.get(link);
  const page = cheerio.load(res.data);

  const name = page("head title").text().split(" – ")[0];

  const meta = page("head meta").toArray();
  const imageElement = meta.find(
    (meta) => page(meta).attr("property") == "og:image"
  );
  const picUrl = page(imageElement).attr("content");

  console.log(`Found products ${name}`);

  return {
    barcode,
    name,
    picUrl,
  };
};

const foodieScraper = async (
  barcode: string,
  link: string
): Promise<ProductDetails | undefined> => {
  console.log("Fetching foodie data", link);

  // 'https://www.foodie.fi/entry/lofbergs-magnifika-brygg-kaffe-500g/7310050001753'

  const res = await axios.get(link);
  const page = cheerio.load(res.data);

  const name = page("head title").text().split(" - ")[0];

  const picUrl = page("img.product-image").attr("src");
  console.log("name", name);

  console.log("pic", picUrl);

  return {
    barcode,
    name,
    picUrl,
  };
};
