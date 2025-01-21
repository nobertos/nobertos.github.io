// deno-lint-ignore-file
import { parseFeed } from "jsr:@mikaelporttila/rss@1.0.3";

export async function blogroll(): Promise<FeedEntry[]> {
  const urls = (await Deno.readTextFile("content/blogroll.txt"))
    .split("\n")
    .filter((line) => line.trim().length > 0);
  const all_entries = (await Promise.all(urls.map(blogroll_feed))).flat();
  all_entries.sort((a, b) => b.date.getTime() - a.date.getTime());
  return all_entries;
}

export interface FeedEntry {
  title: string;
  url: string;
  date: Date;
}

async function blogroll_feed(url: string): Promise<FeedEntry[]> {
  const response = await fetch(url);
  const xml = await response.text();
  const feed = await parseFeed(xml);

  return feed.entries
    .map((entry: any) => {
      return {
        title: entry.title!.value!,
        url: (entry.links.find((it: any) => {
          it.type == "text/html" || it.href!.endsWith(".html");
        }) ?? entry.links[0])!.href!,
        date: (entry.published ?? entry.updated)!,
      };
    })
    .slice(0, 3);
}
