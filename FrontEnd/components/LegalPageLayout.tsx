import Navbar from "@/components/MainSection/Navbar"
import Footer from "@/components/MainSection/Footer"

export function LegalPageLayout({
  title,
  updated,
  children,
}: {
  title: string
  updated: string
  children: React.ReactNode
}) {
  return (
    <div className="font-jakarta">
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="text-4xl font-black text-white md:text-5xl">{title}</h1>
        <p className="mt-3 text-sm text-white/50">Last updated: {updated}</p>
        <div className="mt-10 space-y-10 text-white/70 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-white [&_li]:leading-relaxed [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  )
}
