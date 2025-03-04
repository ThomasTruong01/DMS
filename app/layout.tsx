// app/layout.tsx
import Providers from "./providers";
import "./globals.css"; // Tailwind & global styles

export const metadata = {
  title: "My DMS Next.js App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
