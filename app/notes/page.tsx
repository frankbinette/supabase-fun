import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Title from "@/components/Title";
import { formatLongDate, getNotes, renderMarkdown } from "@/lib/content";

export const metadata: Metadata = { title: "Notes · Frank Binette" };

export default async function Notes() {
  const notes = await Promise.all(
    getNotes().map(async (note) => ({ ...note, html: await renderMarkdown(note.body) })),
  );

  return (
    <>
      <Title title="Notes" subtitle="Here are some notes I took and I like to refer to." />
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="list-group list-group-horizontal-md">
              {notes.map((note) => (
                <a href={`#${note.title}`} className="list-group-item" key={note.title}>
                  {note.title}
                </a>
              ))}
            </div>
            {notes.map((note) => (
              <section key={note.title}>
                <hr />
                <h3 id={note.title}>{note.title}</h3>
                <p className="lead text-muted">Last update: {formatLongDate(note.updateDate)}</p>
                <div className="post-body" dangerouslySetInnerHTML={{ __html: note.html }} />
                <p className="text-center">
                  <a href="#" className="text-muted">Top</a>
                </p>
              </section>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
