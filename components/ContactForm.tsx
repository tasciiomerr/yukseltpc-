"use client";

import { useState } from "react";
import Button from "./Button";

const inputClassName =
  "rounded-lg border border-border-subtle bg-background px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <p className="rounded-xl border border-success-500/30 bg-success-50 p-4 text-sm text-success-700">
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
        <label
          htmlFor="contact-name"
          className="text-sm font-medium text-foreground/70"
        >
          Ad Soyad
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          className={inputClassName}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label
          htmlFor="contact-email"
          className="text-sm font-medium text-foreground/70"
        >
          E-posta
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          className={inputClassName}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label
          htmlFor="contact-message"
          className="text-sm font-medium text-foreground/70"
        >
          Mesajınız
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          required
          className={inputClassName}
        />
      </div>
      <Button type="submit" className="self-start">
        Gönder
      </Button>
    </form>
  );
}
