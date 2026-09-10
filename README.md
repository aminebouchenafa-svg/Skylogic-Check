# SKYLOGIC CHECK

Application de notation en vol et au simulateur pour le **Fleet Training Department**.
Saisie sur tablette ou poste fixe, code couleur unique, export **PDF** prêt à être
transmis par e-mail ou WhatsApp.

## Mise en ligne

Publiée par **GitHub Pages** à chaque push sur `main` :
https://aminebouchenafa-svg.github.io/Skylogic-Check/

Réglage à faire une seule fois dans le dépôt — **Settings → Pages →
Build and deployment → Source : GitHub Actions**. Sans lui, le workflow
s'arrête à l'étape `configure-pages`.

Le workflow `Contrôle` ne déploie rien : il vérifie que les versions
poussées sur les branches de travail passent le lint et compilent.

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
    shared.ts        Blocs communs : remarques, résultat, signatures
    line-control.ts  Un formulaire = un fichier
    line-training.ts
    proficiency-check.ts
    index.ts         Catalogue
  components/        Moteur de saisie (FormRunner), champs, notation, signature
  lib/pdf.ts         Rendu PDF vectoriel (jsPDF)
  lib/share.ts       Téléchargement, partage natif, e-mail, WhatsApp
  lib/storage.ts     Brouillons, archive, réglages
  pages/             Poste de commande, catalogue, archive, réglages
```

### Ajouter un formulaire

1. Créer `src/forms/mon-formulaire.ts` exportant un objet `FormDef`.
2. Déclarer ses sections : `identification`, `grading`, `checklist`, `matrix`,
   `notes`, `endorsement`, `result`, `signature`. Deux sections partageant le
   même `spread` sont imprimées côte à côte, comme sur le papier.

   - `grading` : items notés sur l'échelle du formulaire.
   - `checklist` : items non notés, simplement cochés dans des colonnes
     (ex. CM 1 / CM 2) ; les lignes `heading: true` sont des intitulés de rubrique.
   - `endorsement` : bloc de commentaire suivi d'un visa (nom, fonction, signature).
3. L'ajouter au tableau `FORMS` dans `src/forms/index.ts`.

L'écran de saisie, la moyenne, l'alerte « sous le standard », le PDF et le partage
sont générés automatiquement.

## Code couleur

Échelle officielle du Training Department, identique à l'écran et dans le PDF :

| Note | Signification | Couleur |
|------|---------------|---------|
| 5 | Very Good | bleu `#4E80ED` |
| 4 | Good | vert `#52B685` |
| 3 | Required Standard | ambre `#E9A03D` |
| 2 | Poor | orange `#E87B36` |
| 1 | Unsatisfactory | rouge `#DB524C` |
| / | Not Applicable | ardoise `#5B6B85` |

À l'écran, la note est une pastille cerclée : bordure et chiffre à la couleur du
niveau, fond sombre. Dans le PDF, la case *Grading* est remplie de la même
couleur, pour qu'un formulaire rempli se lise d'un coup d'œil à l'impression.

Une note 1 ou 2 rend la rubrique *Remarks* obligatoire : le formulaire ne peut pas
être marqué terminé tant qu'elle n'est pas renseignée.

## Accueil radial

L'écran d'accueil est une roue : un secteur coloré par formulaire, son pictogramme
et son titre. Le centre affiche le formulaire survolé. Les formulaires dont le modèle
officiel n'est pas encore intégré apparaissent en veille.

Les six couleurs de la roue — azur, orange, or, émeraude, bleu roi, magenta — et le
code couleur de notation partagent la même palette, définie une seule fois dans
`src/index.css` (jetons `--grade-*`) et `src/forms/scales.ts`.

## Transmission du rapport

- **PDF** — génère et télécharge le rapport (`FTM-LC-01_NOM_2026-09-09.pdf`).
- **Partager** — sur téléphone ou tablette, ouvre la feuille de partage du système
  avec le PDF **déjà joint** (WhatsApp, Gmail, Outlook…).
- **E-mail / WhatsApp** — sur poste fixe, le PDF est téléchargé puis le message est
  pré-rempli avec le destinataire défini dans les réglages ; il reste à joindre le
  fichier.

## État des formulaires

| Formulaire | État | PDF |
|------------|------|-----|
| Line Control | Intégré d'après le formulaire officiel D.O.A | 1 page |
| Line Training | Intégré d'après le formulaire officiel D.O.A | 2 pages |
| Proficiency Check | Intégré d'après le formulaire officiel D.O.A | 1 page |
| Mandatory Check Failure Notification | Intégré d'après le formulaire officiel D.O.A | 2 pages |
| Line Form | En attente du modèle | — |
| Skill Test | En attente du modèle | — |
| Remedial Training | En attente du modèle | — |

Le PDF reprend la mise en page du document papier : bandeau de titre, bloc
compagnie, tableaux à deux colonnes, *Remarks*, résultat, signatures, mention
*Reminder* et pied de page `REF. D.O.A – TRAINING DEPARTMENT`. Le logo de la
compagnie se charge dans **Réglages** et remplace le bloc texte en haut à droite.
