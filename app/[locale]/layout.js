import { Space_Grotesk } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import ChatBot from "@/components/ChatBot";
import ThemeProvider from "@/components/ThemeProvider";
import { BookingModalProvider } from "@/lib/bookingModalContext";
import { getDictionary } from "@/lib/dictionaries";
import { LOCALES } from "@/lib/i18n";
import "../globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

// Only /en and /mk exist; proxy.js redirects everything else onto one of them.
export const dynamicParams = false;

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  return {
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(LOCALES.map((code) => [code, `/${code}`])),
    },
  };
}

export default async function RootLayout({ children, params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    // suppressHydrationWarning: next-themes sets the theme class on <html> before React hydrates.
    <html lang={locale} className={spaceGrotesk.variable} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col bg-page text-ink">
        <ThemeProvider>
          <BookingModalProvider>
            <Navbar locale={locale} dict={dict.nav} common={dict.common} />
            <main className="flex-1">{children}</main>
            <Footer
              locale={locale}
              dict={dict.footer}
              navLabels={dict.nav.links}
              common={dict.common}
            />
            <BookingModal dict={dict.booking} common={dict.common} locale={locale} />
            <ChatBot locale={locale} dict={dict.chat} />
          </BookingModalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
