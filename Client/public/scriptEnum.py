import os

# 🔹 Configuration : Dossier à parcourir
SOURCE_DIRECTORY = "."  # Remplace par ton dossier
OUTPUT_TS_FILE = "fileEnum.ts"  # Nom du fichier TypeScript généré
VALID_EXTENSIONS = {".png"}  # 🔥 Seuls les fichiers PNG sont pris en compte

def sanitize_enum_name(filename: str) -> str:
    """Transforme un nom de fichier en un identifiant TypeScript valide."""
    name, _ = os.path.splitext(filename)  # Supprime l'extension
    name = name.upper().replace(" ", "_").replace("-", "_")  # Remplace espaces et tirets
    name = "".join(c if c.isalnum() or c == "_" else "" for c in name)  # Supprime caractères spéciaux
    return name

def generate_enum(directory: str) -> str:
    """Parcourt le dossier et génère un enum TypeScript pour les fichiers PNG uniquement."""
    enum_entries = []

    for root, _, files in os.walk(directory):
        for file in files:
            if os.path.splitext(file)[1].lower() in VALID_EXTENSIONS:  # 🔥 Vérifie si c'est un PNG
                enum_key = sanitize_enum_name(file)
                file_path = os.path.join(root, file).replace("\\", "/")  # Normalise les chemins
                enum_entries.append(f'    {enum_key} = "{file_path}"')

    if not enum_entries:
        return "export enum FileEnum {\n    // Aucun fichier PNG trouvé\n}"

    return "export enum FileEnum {\n" + ",\n".join(enum_entries) + "\n}"

# 🔹 Génération du fichier TypeScript
if __name__ == "__main__":
    ts_enum = generate_enum(SOURCE_DIRECTORY)
    
    with open(OUTPUT_TS_FILE, "w", encoding="utf-8") as f:
        f.write(ts_enum)
    
    print(f"✅ Enum TypeScript généré : {OUTPUT_TS_FILE}")
