"use client";

import { useState } from "react";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <p className="rounded-md border border-green-500/40 bg-green-50 p-4 text-sm text-green-900 dark:bg-green-950/40 dark:text-green-200">
        Mesajınız için teşekkürler. Bu form şu an demo amaçlıdır ve e-posta
        gönderimi henüz bağlanmadı — lütfen bize doğrudan{" "}
        <a href="mailto:info@yukseltpc.com" className="underline">
          info@yukseltpc.com
        </a>{" "}
        adresinden ulaşın.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="contact-name" className="text-sm font-medium">
          Ad Soyad
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          className="rounded-md border border-black/15 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-black"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="contact-email" className="text-sm font-medium">
          E-posta
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          className="rounded-md border border-black/15 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-black"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="contact-message" className="text-sm font-medium">
          Mesajınız
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          required
          className="rounded-md border border-black/15 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-black"
        />
      </div>
      <button
        type="submit"
        className="self-start rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
      >
        Gönder
      </button>
    </form>
  );
}
