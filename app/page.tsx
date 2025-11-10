"use client";

import { useState, useRef } from "react";
import html2canvas from "html2canvas";

export default function Home() {
    const [pseudo, setPseudo] = useState("");
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState("");
    const ticketRef = useRef<HTMLDivElement>(null);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!pseudo.trim()) {
            setError("Please enter your pseudo!");
            return;
        }

        setError("");
        setGenerating(true);

        // Petit délai pour que le DOM soit mis à jour
        setTimeout(async () => {
            if (ticketRef.current) {
                // Capture l'image du ticket
                const canvas = await html2canvas(ticketRef.current, {
                    backgroundColor: null,
                    scale: 3, // meilleure résolution
                });

                // Création du lien pour télécharger l'image
                const link = document.createElement("a");
                link.download = `${pseudo}_ticket.png`;
                link.href = canvas.toDataURL("image/png");
                link.click();
            }

            setGenerating(false);
        }, 50); // très court, juste le temps que le pseudo s'affiche
    };

    return (
        <div className="h-screen w-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/bg.png')" }}>
            <div className="bg-[#080420]/90 p-8 rounded-2xl shadow-2xl w-full max-w-md text-center">
                <h1 className="text-2xl font-bold mb-2 text-[#ff3d00]">Mainnet onboarding</h1>
                <p className="text-[#c3fba5] mb-6">
                    Enter your username and generate your Mainnet ticket.
                </p>
                <form className="flex flex-col gap-4" onSubmit={handleGenerate}>
                    <input
                        type="text"
                        placeholder="Enter your username"
                        value={pseudo}
                        onChange={(e) => setPseudo(e.target.value)}
                        className="p-3 rounded-lg border border-[#ff3d00] bg-[#080420] focus:outline-none focus:ring-2 focus:ring-[#c3fba5] text-[#c3fba5] transition text-center"
                    />

                    {error && <p className="text-red-500 font-semibold">{error}</p>}

                    <button
                        type="submit"
                        className="p-3 rounded-lg bg-gradient-to-r from-[#ff3d00] to-[#c3fba5] font-bold text-black hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={generating}
                    >
                        {generating ? "Generating..." : "Get my ticket"}
                    </button>
                </form>
            </div>

            {/* Zone invisible pour capture */}
            <div className="absolute opacity-0 pointer-events-none">
                <div ref={ticketRef} className="relative w-[360px]" style={{ backgroundColor: "#fff" }}>
                    <img
                        src="/ticket.png"
                        alt="ticket"
                        className="w-[360px] rounded-lg"
                    />
                    <div className="absolute top-[143px] left-[105px] text-center text-lg font-bold text-black">
                            {pseudo}
                    </div>
                </div>
            </div>

        </div>
    );
}
