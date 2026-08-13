import Header from "@/components/Header";
import Hero from "@/components/Hero";

export default function Home() {
    return (
        <main className="min-h-screen bg-[#080B10] text-slate-100">
            <Header />

            <Hero />

            {/* Здесь позже сделаем популярные моды */}

            <footer className="border-t border-white/[0.06]">
                <div className="mx-auto max-w-7xl px-5 py-7 text-xs text-slate-600 md:px-8">
                    © 2026 MODSPACE
                </div>
            </footer>
        </main>
    );
}