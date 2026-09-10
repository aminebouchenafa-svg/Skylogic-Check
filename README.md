# SKYLOGIC CHECK

Application de notation en vol et au simulateur pour le **Fleet Training Department**.
Saisie sur tablette ou poste fixe, code couleur unique, export **PDF** prêt à être
transmis par e-mail ou WhatsApp.

## Mise en ligne

Publiée par **GitHub Pages** à chaque push sur `main` :
https://aminebouchenafa-svg.github.io/Skylogic-Check/

Le workflow écrit la version compilée dans la branche `gh-pages`, que
GitHub publie d'elle-même : aucun réglage n'est nécessaire dans le dépôt.

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

## Accès

L'application s'ouvre sur un écran d'entrée. Deux comptes sont acceptés — un
principal et un de secours — définis dans `src/lib/auth.ts`. Seule l'empreinte
SHA-256 des mots de passe y figure ; pour en changer un, remplacer son
`passwordHash` par l'empreinte du nouveau.

Ce n'est **pas une protection** : l'application est entièrement téléchargée
par le navigateur avant que cet écran ne s'affiche, son contenu est donc
lisible par qui sait le chercher. Le but est d'éviter qu'une personne de
passage ouvre l'outil. Une vraie fermeture se pose devant le site, pas dedans.

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
     `exclusiveTicks` rend les colonnes mutuellement exclusives (Oui / Non),
     `trailingColumns` ajoute des colonnes de saisie après les cases, et chaque
     colonne peut porter son propre signe et sa propre couleur.
   - `endorsement` : bloc de commentaire suivi d'un visa (nom, fonction, signature).
   - `statement` : phrase d'attestation dont les passages `{entre accolades}`
     se complètent directement dans le texte.
   - `reference` : tableau en lecture seule (barème détaillé, consignes).
   - `answers` : grille de réponses numérotées d'un questionnaire.
   - `divider` : trait de découpe séparant un volet détachable.

   Une colonne de tableau peut être de type `signature` : chaque ligne porte
   alors sa propre signature électronique, reprise dans la cellule à
   l'impression.

   Une section `result` porte soit un choix unique mis en avant (`choices`),
   soit plusieurs choix en ligne (`choiceRows`) — Pass/Fail, Completed/Not
   Completed, etc.

   Une grille `grading` peut porter plusieurs colonnes de notation
   (`gradeColumns`) : l'item reçoit alors une note par colonne — un secteur de
   vol, par exemple. La saisie se fait colonne par colonne, l'impression les
   affiche toutes.
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

Passé huit formulaires, la roue passe d'elle-même à deux niveaux : les familles
d'abord — Ligne, Simulateur, Examen, Remédiation — puis les formulaires de la
famille choisie. Le centre ramène aux familles.

Les couleurs de la roue et le code couleur de notation partagent la même
palette, définie une seule fois dans `src/index.css` (jetons `--grade-*`) et
`src/forms/scales.ts`.

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
| Simulator Console Handling Certificate | Intégré d'après le formulaire officiel D.O.A | 1 page |
| Command Upgrade – Assessment Flight | Intégré d'après le formulaire officiel D.O.A | 2 pages |
| RNAV Approaches – Initial Qualification Training | Intégré d'après le formulaire officiel D.O.A | 1 page |
| Confidential Report | Intégré d'après le formulaire officiel D.O.A | 1 page |
| CAT “C” Airfield Training Record | Intégré d'après le formulaire officiel D.O.A | 1 page |
| Training Requirement Record | Intégré d'après le formulaire officiel D.O.A | 1 page |
| Line Form | En attente du modèle | — |
| Skill Test | En attente du modèle | — |
| Remedial Training | En attente du modèle | — |

Le PDF reprend la mise en page du document papier : bandeau de titre, bloc
compagnie, tableaux à deux colonnes, *Remarks*, résultat, signatures, mention
*Reminder* et pied de page `REF. D.O.A – TRAINING DEPARTMENT`. Le logo de la
compagnie se charge dans **Réglages** et remplace le bloc texte en haut à droite.
