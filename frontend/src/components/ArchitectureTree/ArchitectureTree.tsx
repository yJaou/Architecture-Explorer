// 1. On importe nos types (avec le mot-clé type obligatoire)
import type { ArchitectureFile, TreeStructureNode } from "../../types";
import graph from "../../data/graph.json";
import TreeNode from "./TreeNode";

// 2. On type l'argument d'entrée (tableau de fichiers) et le retour (un nœud racine)
function buildTree(nodes: ArchitectureFile[]): TreeStructureNode {
    const root: TreeStructureNode = { 
        name: "PBLCARE",
        children: {}
    };

    nodes.forEach(node => {
        const parts = node.id.split("/");
        let current = root;

        parts.forEach((part: string, index: number) => {
            if (!current.children[part]) {
                current.children[part] = {
                    name: part,
                    children: {}
                };
            }

            current = current.children[part];

            if (index === parts.length - 1) {
                current.file = node;
            }
        });
    });

    return root;
}

// 3. Interface pour les Props du composant principal
interface ArchitectureTreeProps {
    onSelect: (file: ArchitectureFile) => void;
    search: string;
}

export default function ArchitectureTree({ onSelect, search }: ArchitectureTreeProps) {
    // graph.nodes est maintenant traité comme un tableau d'ArchitectureFile
    const tree = buildTree(graph.nodes as ArchitectureFile[]);

    return (
        <div style={{ 
            fontFamily: "var(--sans)",
            fontSize: "15px",
            userSelect: "none"
        }}>
            <TreeNode node={tree} onSelect={onSelect} search={search} />
        </div>
    );
}