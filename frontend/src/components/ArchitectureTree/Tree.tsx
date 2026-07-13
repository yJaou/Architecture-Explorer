import { useState } from "react";
// 1. On importe nos types purs (avec le mot-clé type obligatoire)
import type { ArchitectureFile, TreeStructureNode } from "../../types";

// Fonction utilitaire pour nettoyer le texte (enlève les accents)
const normalizeText = (text: string): string => {
    return text
        ? text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
        : "";
};

// 2. Interface stricte pour les Props de TreeNode
interface TreeNodeProps {
    node: TreeStructureNode;
    onSelect: (file: ArchitectureFile) => void;
    search: string;
}

export default function TreeNode({ node, onSelect, search }: TreeNodeProps) {
    const [open, setOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    // Un nœud est un fichier si l'objet 'file' y est rattaché
    const isFile = node.file !== undefined;
    const children = node.children ? Object.values(node.children) : [];

    // On prépare la recherche normalisée
    const cleanSearch = normalizeText(search);

    // 1. Est-ce que le nœud lui-même correspond à la recherche ?
    const currentMatches = !cleanSearch || 
        normalizeText(node.name).includes(cleanSearch) ||
        (isFile && node.file && normalizeText(node.file.type).includes(cleanSearch));

    // 2. Est-ce qu'un de ses enfants correspond à la recherche ?
    const childMatches = children.some((child) =>
        hasMatchingChild(child, cleanSearch)
    );

    const matches = currentMatches || childMatches;
    const shouldBeOpen = open || (cleanSearch ? childMatches : false);

    if (!matches) {
        return null;
    }

    const hasChildren = children.length > 0;

    const handleClick = () => {
        if (isFile && node.file) {
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

                {isFile && node.file && (
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

            {/* Rendu récursif des enfants */}
            {(open || shouldBeOpen) && children.map((child) => (
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

// Fonction de recherche récursive typée proprement
function hasMatchingChild(node: TreeStructureNode, cleanSearch: string): boolean {
    if (!cleanSearch) return true;
    
    const isFile = node.file !== undefined;
    
    if (normalizeText(node.name).includes(cleanSearch)) return true;
    if (isFile && node.file && normalizeText(node.file.type).includes(cleanSearch)) return true;

    if (node.children) {
        return Object.values(node.children).some((child) =>
            hasMatchingChild(child, cleanSearch)
        );
    }
    return false;
}