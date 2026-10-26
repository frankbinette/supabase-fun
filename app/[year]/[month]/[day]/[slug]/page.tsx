import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Title from "@/components/Title";
import { formatLongDate, getPost, getPosts, renderMarkdown } from "@/lib/content";

type Params = Promise<{ year: string; month: string; day: string; slug: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return getPosts()
    .filter((post) => !post.externalSource)
    .map(({ year, month, day, slug }) => ({ year, month, day, slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { year, month, day, slug } = await params;
  const post = getPost(year, month, day, slug);
  return { title: post ? `${post.title} · Frank Binette` : "Frank Binette" };
}

export default async function PostPage({ params }: { params: Params }) {
  const { year, month, day, slug } = await params;
  const post = getPost(year, month, day, slug);
  if (!post) notFound();
  const html = await renderMarkdown(post.body);

  return (
    <>
      <Title title={post.title} date={formatLongDate(post.date)} />
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <hr className="py-1" />
            <div className="post-body" dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        </div>
      </div>
      <Footer withNav />
    </>
  );
}
