import { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar/SearchBar";
import ArchitectureTree from "./components/ArchitectureTree/ArchitectureTree";
import DetailsPanel from "./components/DetailsPanel/DetailsPanel";
// 1. On renomme l'import brut du JSON pour pouvoir le typer proprement
import graphData from "./data/graph.json";
// 2. On importe nos interfaces depuis ton fichier types.ts
import type { ArchitectureFile, ArchitectureGraph } from "./types";
// 3. On force TypeScript à reconnaître la structure exacte de ton JSON
const graph = graphData as ArchitectureGraph;

function App(){
    // 4. On remplace <any> par notre type strict (le fichier est soit une structure valide, soit null)
    const [selectedFile, setSelectedFile] = useState<ArchitectureFile | null>(null);
    const [search, setSearch] = useState("");
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [darkMode]);

    return (
        <div style={{ 
            display: "flex",
            position: "relative",
            minHeight: "100vh",
            background: "var(--bg)",
            color: "var(--text)"
        }}>

            {/* Dark Mode Toggle Button */}
            <button 
                onClick={() => setDarkMode(!darkMode)}
                style={{
                    position: "absolute",
                    top: "24px",
                    right: "24px",
                    padding: "8px 14px",
                    cursor: "pointer",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    background: "var(--code-bg)",
                    color: "var(--text-h)",
                    fontFamily: "var(--sans)",
                    fontWeight: "500",
                    fontSize: "14px",
                    boxShadow: "var(--shadow)",
                    zIndex: 10
                }}
            >
                {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>

            {/* Left Column: Explorer */}
            <div style={{ 
                width: "50%",
                padding: "40px",
                boxSizing: "border-box",
                textAlign: "left"
            }}>
                <h1 style={{ 
                    fontSize: "28px",
                    fontWeight: "700",
                    letterSpacing: "-0.5px",
                    margin: "0 0 24px 0",
                    color: "var(--text-h)",
                    fontFamily: "var(--heading)"
                }}>
                    Software Architecture Explorer
                </h1>

                <SearchBar 
                    value={search}
                    onChange={setSearch}
                />

                <div style={{ marginTop: "24px" }}>
                    <ArchitectureTree 
                        onSelect={setSelectedFile}
                        search={search}
                    />
                </div>
            </div>

            {/* Right Column: Architectural Details */}
            <div style={{
                width: "50%",
                borderLeft: "1px solid var(--border)",
                padding: "40px",
                boxSizing: "border-box",
                background: "var(--social-bg)",
                textAlign: "left"
            }}>
                <DetailsPanel 
                 file={selectedFile}
                 graph={graph}
                 onSelect={setSelectedFile}
                />
            </div>

        </div>
    );
}

export default App;