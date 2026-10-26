import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Title from "@/components/Title";

export const metadata: Metadata = { title: "About · Frank Binette" };

export default function About() {
  return (
    <>
      <Title title="About" />
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <hr className="py-1" />
            <p>
              Why Frank Binette? It sounds good, sounds international, sounds like a rockstar! But yeah, the name is
              François Vienneau Binette which can be a mouthful for non-French-speaking peoples.
            </p>
            <p>
              I&apos;m a Canadian data dude who started his career playing with Hadoop and is now doing analytics
              engineering with cool cloud technologies. I enjoy data warehousing, modeling, and visualization.
            </p>
            <p>
              Find me on <a href="https://www.linkedin.com/in/fvbinette/">LinkedIn</a>,{" "}
              <a href="https://github.com/frankbinette">GitHub</a>, even{" "}
              <a href="https://twitter.com/frankbinette">Twitter</a> (but rarely there.)
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
