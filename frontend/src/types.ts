// Structure d'un fichier (nœud) issu de ton graph.json
export interface ArchitectureFile {
    id: string;
    name: string;
    type: string;
    classes?: string[];
    functions?: string[];
    relations?: string[];
}

// Structure globale de ton fichier graph.json
export interface ArchitectureGraph {
    nodes: ArchitectureFile[];
    links: {
        source: string;
        target: string;
        type?: string;
    }[];
}

// Structure d'un nœud de l'arbre (utilisé dans buildTree)
export interface TreeStructureNode {
    name: string;
    children: { [key: string]: TreeStructureNode };
    file?: ArchitectureFile;
}