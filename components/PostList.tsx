import Link from "next/link";
import { formatShortDate, type Post } from "@/lib/content";

export default function PostList({ posts }: { posts: Post[] }) {
  return (
    <ul className="list-unstyled">
      {posts.map((post) => (
        <li key={post.url}>
          <h4>
            {post.externalSource ? (
              <a href={post.url} target="_blank" rel="noopener">
                {post.title}
              </a>
            ) : (
              <Link href={post.url}>{post.title}</Link>
            )}{" "}
            <small className="text-muted">
              {formatShortDate(post.date)}
              {post.externalSource && ` · ${post.externalSource}`}
            </small>
          </h4>
        </li>
      ))}
    </ul>
  );
}
