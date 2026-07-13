// 1. On importe nos types purs avec le mot-clé obligatoire "type"
import type { ArchitectureFile, ArchitectureGraph } from "../../types"; 

// 2. On définit l'interface stricte pour les Props du composant
interface DetailsPanelProps {
    file: ArchitectureFile | null;
    graph: ArchitectureGraph;
    onSelect: (file: ArchitectureFile) => void;
}

export default function DetailsPanel({ file, graph, onSelect }: DetailsPanelProps) {

    if (!file) {
        return (
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                color: "var(--text)",
                opacity: 0.6,
                fontStyle: "italic",
                fontFamily: "var(--sans)"
            }}>
                Select a file to view its architectural details
            </div>
        );
    }

    // Extraction dynamique des dépendances typée proprement
    const dependencies: ArchitectureFile[] = Array.from(
        new Map(
            graph.links
                .filter((link) => link.source === file.id)
                .map((link) => {
                    const node = graph.nodes.find((n) => n.id === link.target);
                    return node ? [node.id, node] : null;
                })
                // Le filtre garantit à TypeScript qu'aucun élément "null" ne passe
                .filter((item): item is [string, ArchitectureFile] => item !== null)
        ).values()
    ); 

    // Extraction dynamique des fichiers utilisateurs typée proprement
    const usedBy: ArchitectureFile[] = Array.from(
        new Map(
            graph.links
                .filter((link) => link.target === file.id)
                .map((link) => {
                    const node = graph.nodes.find((n) => n.id === link.source);
                    return node ? [node.id, node] : null;
                })
                // Le filtre garantit à TypeScript qu'aucun élément "null" ne passe
                .filter((item): item is [string, ArchitectureFile] => item !== null)
        ).values()
    );

    return (
        <div style={{ fontFamily: "var(--sans)" }}>

            {/* File Main Title */}
            <h2 style={{
                fontSize: "22px",
                fontWeight: "600",
                color: "var(--text-h)",
                margin: "0 0 16px 0",
                wordBreak: "break-word"
            }}>
                📄 {file.name}
            </h2>

            {/* Metadata Card */}
            <div style={{
                background: "var(--bg)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "28px",
                boxShadow: "var(--shadow)"
            }}>
                <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "var(--text)" }}>
                    <strong style={{ color: "var(--text-h)" }}>Type :</strong>{" "}
                    <span style={{ 
                        background: "var(--accent-bg)", 
                        color: "var(--accent)", 
                        padding: "2px 6px", 
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: "600"
                    }}>{file.type}</span>
                </p>
                <p style={{ margin: 0, fontSize: "14px", color: "var(--text)" }}>
                    <strong style={{ color: "var(--text-h)" }}>Path :</strong>
                    <code style={{ 
                        display: "block", 
                        marginTop: "6px", 
                        wordBreak: "break-all",
                        background: "var(--code-bg)",
                        padding: "6px 10px"
                    }}>
                        {file.id}
                    </code>
                </p>
            </div>

            {/* Relations Section (Extends / Implements) */}
            {file.relations && file.relations.length > 0 && (
                <div style={{ marginBottom: "24px" }}>
                    <h3 style={{ fontSize: "16px", color: "var(--text-h)", margin: "0 0 12px 0", borderBottom: "1px solid var(--border)", paddingBottom: "6px" }}>
                        🧬 Relations
                    </h3>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {file.relations.map((rel: string) => (
                            <span key={rel} style={{
                                fontSize: "12px",
                                padding: "4px 10px",
                                background: "var(--code-bg)",
                                border: "1px solid var(--border)",
                                borderRadius: "4px",
                                color: "var(--text-h)",
                                fontFamily: "var(--mono)",
                                fontWeight: "500"
                            }}>
                                {rel}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Classes Section */}
            {file.classes && file.classes.length > 0 && (
                <div style={{ marginBottom: "24px" }}>
                    <h3 style={{ fontSize: "16px", color: "var(--text-h)", margin: "0 0 12px 0", borderBottom: "1px solid var(--border)", paddingBottom: "6px" }}>
                        Classes ({file.classes.length})
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        {file.classes.map((c: string) => (
                            <div key={c} style={{
                                fontSize: "14px",
                                padding: "6px 12px",
                                background: "var(--bg)",
                                border: "1px solid var(--border)",
                                borderRadius: "6px",
                                color: "var(--accent)",
                                fontWeight: "500",
                                fontFamily: "var(--mono)"
                            }}>
                                📦 {c}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Functions Section */}
            {file.functions && file.functions.length > 0 && (
                <div style={{ marginBottom: "24px" }}>
                    <h3 style={{ fontSize: "16px", color: "var(--text-h)", margin: "0 0 12px 0", borderBottom: "1px solid var(--border)", paddingBottom: "6px" }}>
                        Functions ({file.functions.length})
                    </h3>
                    <div style={{ 
                        display: "flex", 
                        flexDirection: "column", 
                        gap: "6px",
                        maxHeight: "250px",
                        overflowY: "auto",
                        paddingRight: "4px"
                    }}>
                        {file.functions.slice(0, 30).map((f: string) => (
                            <div key={f} style={{
                                fontSize: "13px",
                                padding: "6px 12px",
                                background: "var(--bg)",
                                border: "1px solid var(--border)",
                                borderRadius: "6px",
                                color: "var(--text-h)",
                                fontFamily: "var(--mono)"
                            }}>
                                ⚙️ {f}()
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* DEPENDS ON SECTION */}
            <div style={{ marginBottom: "24px" }}>
                <h3 style={{ fontSize: "16px", color: "var(--text-h)", margin: "0 0 12px 0", borderBottom: "1px solid var(--border)", paddingBottom: "6px" }}>
                    📥 Depends On ({dependencies.length})
                </h3>
                {dependencies.length === 0 && (
                    <p style={{ opacity: 0.5, fontStyle: "italic", fontSize: "14px" }}>No detected dependencies</p>
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {dependencies.map((dep) => (
                        <div
                            key={dep.id}
                            onClick={() => onSelect && onSelect(dep)}
                            style={{
                                padding: "8px 12px",
                                background: "var(--bg)",
                                border: "1px solid var(--border)",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontSize: "13px",
                                transition: "all 0.15s ease",
                                color: "var(--text-h)"
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = "var(--accent)";
                                e.currentTarget.style.color = "var(--accent)";
                                e.currentTarget.style.background = "var(--accent-bg)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = "var(--border)";
                                e.currentTarget.style.color = "var(--text-h)";
                                e.currentTarget.style.background = "var(--bg)";
                            }}
                        >
                            📄 {dep.name}
                        </div>
                    ))}
                </div>
            </div>

            {/* USED BY SECTION */}
            <div style={{ marginBottom: "24px" }}>
                <h3 style={{ fontSize: "16px", color: "var(--text-h)", margin: "0 0 12px 0", borderBottom: "1px solid var(--border)", paddingBottom: "6px" }}>
                    📤 Used By ({usedBy.length})
                </h3>
                {usedBy.length === 0 && (
                    <p style={{ opacity: 0.5, fontStyle: "italic", fontSize: "14px" }}>No detected usages</p>
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {usedBy.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => onSelect && onSelect(item)}
                            style={{
                                padding: "8px 12px",
                                background: "var(--bg)",
                                border: "1px solid var(--border)",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontSize: "13px",
                                transition: "all 0.15s ease",
                                color: "var(--text-h)"
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = "var(--accent)";
                                e.currentTarget.style.color = "var(--accent)";
                                e.currentTarget.style.background = "var(--accent-bg)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = "var(--border)";
                                e.currentTarget.style.color = "var(--text-h)";
                                e.currentTarget.style.background = "var(--bg)";
                            }}
                        >
                            📄 {item.name}
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}