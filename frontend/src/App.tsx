import { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar/SearchBar";
import ArchitectureTree from "./components/ArchitectureTree/ArchitectureTree";
import DetailsPanel from "./components/DetailsPanel/DetailsPanel";
import type { ArchitectureFile, ArchitectureGraph } from "./types";

// 1. Labels translated to English
const BRANCH_OPTIONS = [
    { value: "empty", label: "Select a branch..." },
    { value: "graph-master", label: "Branch: master" },
    { value: "graph-create-map-feature-visualisation", label: "Branch: create-map-feature-visualisation" },
    { value: "graph-ART_Code-Updates", label: "Branch: ART_Code-Updates" },
    { value: "graph-ART_Code_Updates_2", label: "Branch: ART_Code_Updates_2" },
];

function App() {
    // 2. State initialized to "empty" to display nothing on refresh
    const [currentGraph, setCurrentGraph] = useState<ArchitectureGraph | null>(null);
    const [selectedBranch, setSelectedBranch] = useState("empty");
    
    const [selectedFile, setSelectedFile] = useState<ArchitectureFile | null>(null);
    const [search, setSearch] = useState("");
    const [darkMode, setDarkMode] = useState(false);

    // 3. Dynamic loading handling the "empty" selection
    useEffect(() => {
        if (selectedBranch === "empty") {
            setCurrentGraph(null);
            setSelectedFile(null);
            return;
        }

        import(`./data/${selectedBranch}.json`)
            .then((module) => {
                setCurrentGraph(module.default as ArchitectureGraph);
                setSelectedFile(null); 
            })
            .catch((err) => {
                console.error("Error loading branch data:", err);
                setCurrentGraph(null);
            });
    }, [selectedBranch]);

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

            {/* Top Right Buttons Container */}
            <div style={{
                position: "absolute",
                top: "24px",
                right: "24px",
                display: "flex",
                gap: "12px",
                zIndex: 10
            }}>
                {/* Branch Selector */}
                <select
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    style={{
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
                        outline: "none"
                    }}
                >
                    {BRANCH_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                {/* Dark Mode Toggle Button */}
                <button 
                    onClick={() => setDarkMode(!darkMode)}
                    style={{
                        padding: "8px 14px",
                        cursor: "pointer",
                        borderRadius: "8px",
                        border: "1px solid var(--border)",
                        background: "var(--code-bg)",
                        color: "var(--text-h)",
                        fontFamily: "var(--sans)",
                        fontWeight: "500",
                        fontSize: "14px",
                        boxShadow: "var(--shadow)"
                    }}
                >
                    {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
                </button>
            </div>

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

                {/* 4. Strict condition: Tree is hidden if no branch is selected */}
                <div style={{ marginTop: "24px" }}>
                    {currentGraph ? (
                        <ArchitectureTree 
                            graph={currentGraph}
                            onSelect={setSelectedFile}
                            search={search}
                        />
                    ) : (
                        <p style={{ color: "var(--text-muted)", fontFamily: "var(--sans)", fontStyle: "italic" }}>
                            Please select a branch to display the architecture.
                        </p>
                    )}
                </div>
            </div>

            {/* Right Column: Architectural Details */}
            <div style={{
                width: "50%",
                borderLeft: "1px solid var(--border)",
                padding: "8px 40px 40px 40px",
                boxSizing: "border-box",
                background: "var(--social-bg)",
                textAlign: "left"
            }}>
                {/* 5. Details are hidden and translated if no branch is selected */}
                {currentGraph ? (
                    <DetailsPanel 
                        file={selectedFile}
                        graph={currentGraph}
                        onSelect={setSelectedFile}
                    />
                ) : (
                    <p style={{ color: "var(--text-muted)", fontFamily: "var(--sans)", fontStyle: "italic", marginTop: "72px" }}>
                        Please select a branch to view details.
                    </p>
                )}
            </div>

        </div>
    );
}

export default App;