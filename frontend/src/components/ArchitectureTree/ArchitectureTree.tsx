// 1. On importe nos types (avec le mot-clé type obligatoire)
import type { ArchitectureFile, TreeStructureNode, ArchitectureGraph } from "../../types";
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

// 3. Interface pour les Props du composant principal (Mise à jour pour inclure graph)
interface ArchitectureTreeProps {
    graph: ArchitectureGraph; // <-- AJOUT DE LA PROP ICI
    onSelect: (file: ArchitectureFile) => void;
    search: string;
}

export default function ArchitectureTree({ graph, onSelect, search }: ArchitectureTreeProps) {
    // 4. L'arbre se construit désormais à partir des nœuds du graphe dynamique reçu en paramètre
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