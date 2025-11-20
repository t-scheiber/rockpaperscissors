import KeyboardComponent from "@/components/KeyboardComponent";
import KeyboardShortcutsListener from "@/components/KeyboardShortcutsListener";
import { getLocale } from "next-intl/server";

export default async function KeyboardgamePage() {
  const locale = await getLocale();
  const resultUrl = `/${locale}/result`;

  return (
    <div>
      <KeyboardShortcutsListener resultUrl={resultUrl} />
      <KeyboardComponent />
    </div>
  );
}
