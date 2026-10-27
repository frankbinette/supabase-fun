// Post images and PDFs live in the public `site-assets` Storage bucket
// (uploaded from supabase/storage/site-assets).
const bucketUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/site-assets`;

export function assetUrl(path: string): string {
  return `${bucketUrl}/${path.replace(/^\/+/, "")}`;
}

// Posts still say /assets/img/... and /assets/pdf/... like the old Jekyll site; point those at Storage.
export function rewriteAssetLinks(html: string): string {
  return html.replace(/(src|href)="\/assets\/((?:img|pdf)\/[^"]+)"/g, (_, attr, path) => `${attr}="${assetUrl(path)}"`);
}
