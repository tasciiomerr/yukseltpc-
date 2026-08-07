import { ButtonLink } from "@/components/Button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center">
      <span aria-hidden className="text-5xl">
        🧭
      </span>
      <h1 className="mt-4 text-3xl font-bold sm:text-4xl">404</h1>
      <p className="mt-4 text-foreground/60">
        Aradığınız sayfa bulunamadı. Taşınmış veya kaldırılmış olabilir.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/">Ana Sayfaya Dön</ButtonLink>
        <ButtonLink href="/uyumluluk-araci" variant="secondary">
          Uyumluluk Aracını Dene
        </ButtonLink>
      </div>
    </div>
  );
}
