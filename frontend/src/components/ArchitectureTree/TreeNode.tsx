import { useState } from "react";

// Fonction utilitaire pour nettoyer le texte (enlève les accents)
const normalizeText = (text: string) => {
    return text
        ? text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
        : "";
};

export default function TreeNode({
    node,
    onSelect,
    search
}: any) {

    const [open, setOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const isFile = node.file !== undefined;
    const children = node.children ? Object.values(node.children) : [];

    // On prépare la recherche normalisée (sans accents, en minuscules)
    const cleanSearch = normalizeText(search);

    // 1. Est-ce que le nœud lui-même correspond à la recherche ?
    const currentMatches = !cleanSearch || 
        normalizeText(node.name).includes(cleanSearch) ||
        (isFile && normalizeText(node.file.type).includes(cleanSearch)); // Permet de chercher par extension (ex: "php")

    // 2. Est-ce qu'un de ses enfants (ou sous-enfants) correspond ?
    const childMatches = children.some((child: any) =>
        hasMatchingChild(child, cleanSearch)
    );

    // Le nœud doit s'afficher si lui-même ou un de ses enfants correspond
    const matches = currentMatches || childMatches;

    // Force l'ouverture automatique du dossier si la recherche correspond à un enfant caché
    const shouldBeOpen = open || (cleanSearch ? childMatches : false);

    if (!matches) {
        return null;
    }

    const hasChildren = children.length > 0;

    const handleClick = () => {
        if (isFile) {
            onSelect(node.file);
        }
        if (hasChildren) {
            setOpen(!open);
        }
    };

    return (
        <div style={{
            marginLeft: 16,
            borderLeft: "1px dashed var(--border)",
            paddingLeft: 8
        }}>
            <div
                onClick={handleClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    cursor: "pointer",
                    padding: "6px 8px",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    background: isHovered ? "var(--accent-bg)" : "transparent",
                    color: isHovered ? "var(--accent)" : "var(--text-h)",
                    transition: "all 0.15s ease",
                    fontSize: "14px",
                    fontFamily: "var(--sans)",
                    margin: "2px 0"
                }}
            >
                <span style={{ fontSize: "16px" }}>
                    {isFile ? "📄" : shouldBeOpen ? "📂" : "📁"}
                </span>

                <span style={{ 
                    fontWeight: isFile ? "400" : "500",
                    wordBreak: "break-all"
                }}>
                    {node.name}
                </span>

                {isFile && (
                    <span style={{
                        marginLeft: "auto",
                        fontSize: "11px",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        opacity: 0.6,
                        color: isHovered ? "var(--accent)" : "var(--text)",
                        background: "var(--code-bg)",
                        padding: "2px 6px",
                        borderRadius: "4px"
                    }}>
                        {node.file.type}
                    </span>
                )}
            </div>

            {/* Rendu des enfants - s'affiche si ouvert manuellement OU si la recherche match un enfant */}
            {(open || shouldBeOpen) && children.map((child: any) => (
                <TreeNode
                    key={child.name}
                    node={child}
                    onSelect={onSelect}
                    search={search}
                />
            ))}
        </div>
    );
}

// Fonction de recherche récursive améliorée
function hasMatchingChild(node: any, cleanSearch: string): boolean {
    if (!cleanSearch) return true;
    
    const isFile = node.file !== undefined;
    
    if (normalizeText(node.name).includes(cleanSearch)) return true;
    if (isFile && normalizeText(node.file.type).includes(cleanSearch)) return true;

    if (node.children) {
        return Object.values(node.children).some((child: any) =>
            hasMatchingChild(child, cleanSearch)
        );
    }
    return false;
}