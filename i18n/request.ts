import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

const locales = ["en", "de"];

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as any)) notFound();
  const normalizedLocale = locale as (typeof locales)[number];

  return {
    locale: normalizedLocale,
    messages: (await import(`@/dictionaries/${normalizedLocale}.json`)).default,
  };
});

