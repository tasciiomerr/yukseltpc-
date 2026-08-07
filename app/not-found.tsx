import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center">
      <h1 className="text-3xl font-bold sm:text-4xl">404</h1>
      <p className="mt-4 text-black/60 dark:text-white/60">
        Aradığınız sayfa bulunamadı. Taşınmış veya kaldırılmış olabilir.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
        >
          Ana Sayfaya Dön
        </Link>
        <Link
          href="/uyumluluk-araci"
          className="rounded-md border border-black/15 px-4 py-2 text-sm font-medium hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
        >
          Uyumluluk Aracını Dene
        </Link>
      </div>
    </div>
  );
}
