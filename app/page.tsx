import Footer from "@/components/Footer";
import PostList from "@/components/PostList";
import Title from "@/components/Title";
import { getPosts } from "@/lib/content";

export default function Home() {
  return (
    <>
      <Title
        title="Hi, I'm Frank Binette"
        subtitle={`or better known as "François Vienneau Binette", my non-rockstar name.`}
      />
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <hr className="py-1" />
            <PostList posts={getPosts()} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
