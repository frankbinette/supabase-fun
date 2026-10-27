import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";

const CONTENT_DIR = path.join(process.cwd(), "content");

// Post files keep Jekyll's naming (YYYY-MM-DD-slug.md) so URLs stay the same.
const POST_FILENAME = /^(\d{4})-(\d{2})-(\d{2})-(.+)\.md$/;

export type Post = {
  slug: string;
  year: string;
  month: string;
  day: string;
  date: Date;
  title: string;
  url: string;
  externalSource?: string;
  body: string;
};

export type Note = {
  title: string;
  updateDate: Date;
  body: string;
};

export async function renderMarkdown(markdown: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify)
    .process(markdown);
  return String(file);
}

export function getPosts(): Post[] {
  const dir = path.join(CONTENT_DIR, "posts");
  return fs
    .readdirSync(dir)
    .map((filename) => filename.match(POST_FILENAME))
    .filter((match): match is RegExpMatchArray => match !== null)
    .map(([filename, year, month, day, slug]) => {
      const { data, content } = matter(fs.readFileSync(path.join(dir, filename), "utf8"));
      return {
        slug,
        year,
        month,
        day,
        date: new Date(`${year}-${month}-${day}T12:00:00Z`),
        title: data.title,
        url: data.external_url ?? `/${year}/${month}/${day}/${slug}`,
        externalSource: data.external_source,
        body: content,
      };
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}

export function getPost(year: string, month: string, day: string, slug: string): Post | undefined {
  return getPosts().find(
    (post) =>
      !post.externalSource &&
      post.year === year &&
      post.month === month &&
      post.day === day &&
      post.slug === slug,
  );
}

export function getNotes(): Note[] {
  const dir = path.join(CONTENT_DIR, "notes");
  return fs
    .readdirSync(dir)
    .filter((filename) => filename.endsWith(".md"))
    .map((filename) => {
      const { data, content } = matter(fs.readFileSync(path.join(dir, filename), "utf8"));
      return { title: data.title, updateDate: new Date(data.update_date), body: content };
    })
    .sort((a, b) => a.title.localeCompare(b.title));
}

export { formatLongDate, formatShortDate } from "./dates";
