/**
 * Réseau et flotte.
 *
 * Ces listes alimentent les suggestions de saisie : elles guident sans jamais
 * interdire une autre valeur, pour qu'un vol hors réseau reste saisissable.
 * À compléter avec les listes officielles du Training Department.
 */

/** Codes OACI proposés à la saisie d'une étape. */
export const AIRPORTS: string[] = [
  // Algérie
  'DAAG', 'DAAE', 'DAAJ', 'DAAP', 'DAAT', 'DAAV', 'DAAY', 'DABB', 'DABC', 'DABS',
  'DAOB', 'DAOF', 'DAOI', 'DAOL', 'DAON', 'DAOO', 'DAOR', 'DAOV', 'DAUA', 'DAUB',
  'DAUE', 'DAUG', 'DAUH', 'DAUI', 'DAUK', 'DAUO', 'DAUT', 'DAUU', 'DAUZ', 'DAFH',
  // Europe
  'LFPG', 'LFPO', 'LFML', 'LFLL', 'LFBO', 'LFMN', 'LFRS', 'LFSB', 'LFQQ', 'LFRB',
  'LEMD', 'LEBL', 'LEAL', 'LFBD', 'LSGG', 'LIRF', 'LIMC', 'EGLL', 'EDDF', 'EBBR',
  'LPPT', 'LTFM', 'LTBA',
  // Afrique et Moyen-Orient
  'GMMN', 'GMMX', 'DTTA', 'DTMB', 'HLLT', 'HECA', 'GOBD', 'GABS', 'DIAP', 'DNMM',
  'OEJN', 'OEMA', 'OMDB', 'OJAI', 'HAAB',
  // Amérique du Nord
  'CYUL', 'KJFK',
]

/**
 * Types exploités par la compagnie, proposés partout où un formulaire
 * demande le type avion.
 */
export const FLEET: string[] = [
  'ATR 72-500',
  'ATR 72-600',
  'B737-600 NG',
  'B737-700 NG',
  'B737-800 NG',
  'B737 MAX 8',
  'B737 MAX 9',
  'A330-200',
  'A330neo',
]

/**
 * Immatriculations de la flotte, proposées à la saisie.
 * En attente de la liste officielle : la saisie reste libre d'ici là.
 */
export const AIRCRAFT_REGISTRATIONS: string[] = []
