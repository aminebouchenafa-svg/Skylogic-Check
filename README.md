# SKYLOGIC CHECK

Application de notation en vol et au simulateur pour le **Fleet Training Department**.
Saisie sur tablette ou poste fixe, code couleur unique, export **PDF** prêt à être
transmis par e-mail ou WhatsApp.

## Démarrer

```bash
npm install
npm run dev      # développement
npm run build    # build de production (dossier dist/)
npm run preview  # prévisualisation du build
```

L'application est entièrement côté client : aucun serveur, aucune base de données.
Les dossiers sont enregistrés dans le navigateur de l'appareil (`localStorage`).

## Principe : des formulaires décrits, pas codés

Le moteur construit l'écran de saisie, la validation, le code couleur et le PDF à
partir d'une **description** du formulaire. Intégrer un nouveau formulaire officiel
revient donc à écrire un fichier de données, sans toucher au reste de l'application.

```
src/
  types/form.ts      Schéma d'un formulaire (sections, champs, items notés)
  forms/
    scales.ts        Échelles de notation et code couleur
    common.ts        Blocs partagés : identification, synthèse, signatures
    line-check.ts    Un formulaire = un fichier
    index.ts         Catalogue
  components/        Moteur de saisie (FormRunner), champs, notation, signature
  lib/pdf.ts         Rendu PDF vectoriel (jsPDF)
  lib/share.ts       Téléchargement, partage natif, e-mail, WhatsApp
  lib/storage.ts     Brouillons, archive, réglages
  pages/             Poste de commande, catalogue, archive, réglages
```

### Ajouter un formulaire

1. Créer `src/forms/mon-formulaire.ts` exportant un objet `FormDef`.
2. Déclarer ses sections : `identification`, `grading`, `notes`, `signature`.
3. L'ajouter au tableau `FORMS` dans `src/forms/index.ts`.

L'écran de saisie, la moyenne, l'alerte « sous le standard », le PDF et le partage
sont générés automatiquement.

## Code couleur

Identique à l'écran, dans les indicateurs et dans le PDF :

| Note | Signification | Couleur |
|------|---------------|---------|
| 1 | Non satisfaisant | rouge |
| 2 | Sous le standard | orange |
| 3 | Standard | cyan |
| 4 | Au-dessus du standard | vert |
| 5 | Exemplaire | or |
| N/A | Non applicable | gris |

Une note 1 ou 2 déclenche une alerte demandant de renseigner l'action de remédiation.

## Transmission du rapport

- **PDF** — génère et télécharge le rapport (`FTM-LC-01_NOM_2026-09-09.pdf`).
- **Partager** — sur téléphone ou tablette, ouvre la feuille de partage du système
  avec le PDF **déjà joint** (WhatsApp, Gmail, Outlook…).
- **E-mail / WhatsApp** — sur poste fixe, le PDF est téléchargé puis le message est
  pré-rempli avec le destinataire défini dans les réglages ; il reste à joindre le
  fichier.

## État des formulaires

| Formulaire | Référence | État |
|------------|-----------|------|
| Line Check | FTM-LC-01 | Modèle de référence (compétences OACI/AESA) — à remplacer par le modèle officiel |
| Line Form | FTM-LF-01 | En attente du modèle |
| Line Training | FTM-LT-01 | En attente du modèle |
| Proficiency Check (OPC/LPC) | FTM-OPC-01 | En attente du modèle |
| Skill Test | FTM-ST-01 | En attente du modèle |
| Remedial Training | FTM-RT-01 | En attente du modèle |
