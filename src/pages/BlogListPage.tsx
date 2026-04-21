import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";

interface PostListItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  cover_image_url: string | null;
}

const BlogListPage = () => {
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("id, slug, title, description, cover_image_url")
        .eq("published", true)
        .order("created_at", { ascending: false });
      setPosts(data || []);
      setLoading(false);
    })();
  }, []);

  const canonical = "https://greenhunt.net/blog";

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: posts.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://greenhunt.net/blog/${p.slug}`,
      name: p.title,
    })),
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>Blog | Greenhunt</title>
        <meta
          name="description"
          content="Articles about stooping, circular economy, waste valorization and street finds from Greenhunt."
        />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content="Blog | Greenhunt" />
        <meta
          property="og:description"
          content="Articles about stooping, circular economy, waste valorization and street finds from Greenhunt."
        />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify(itemListJsonLd)}
        </script>
      </Helmet>

      <header className="border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 py-8 flex items-center justify-between">
          <Link to="/" className="text-sm text-white/60 hover:text-white">
            ← Greenhunt
          </Link>
          <h1 className="text-3xl md:text-4xl font-permanent-marker" style={{ color: "#b4fa74" }}>
            Blog
          </h1>
          <span className="w-20" />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {loading ? (
          <p className="text-white/60">Loading…</p>
        ) : posts.length === 0 ? (
          <p className="text-white/60">No articles yet.</p>
        ) : (
          <ul className="grid gap-8 md:grid-cols-2">
            {posts.map((p) => (
              <li key={p.id}>
                <Link
                  to={`/blog/${p.slug}`}
                  className="block rounded-xl overflow-hidden bg-white/5 hover:bg-white/10 transition border border-white/10"
                >
                  {p.cover_image_url && (
                    <img
                      src={p.cover_image_url}
                      alt={p.title}
                      loading="lazy"
                      className="w-full aspect-video object-cover"
                    />
                  )}
                  <div className="p-5">
                    <h2 className="text-xl font-semibold mb-2">{p.title}</h2>
                    <p className="text-white/70 text-sm line-clamp-3">{p.description}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
};

export default BlogListPage;
