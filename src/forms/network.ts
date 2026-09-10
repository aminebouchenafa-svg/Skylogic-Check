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
 * Relevé OMD ED 03 – REV 17 JUL 2026.
 */
export const AIRCRAFT_REGISTRATIONS: string[] = [
  '7T-VJJ', '7T-VJK', '7T-VJL', '7T-VJM', '7T-VJN', '7T-VJO',
  '7T-VJP', '7T-VJQ', '7T-VJR', '7T-VJS', '7T-VJT', '7T-VJU',
  '7T-VKA', '7T-VKB', '7T-VKC', '7T-VKD', '7T-VKE', '7T-VKF',
  '7T-VKG', '7T-VKH', '7T-VKI', '7T-VKJ', '7T-VKK', '7T-VKL',
  '7T-VKM', '7T-VKN', '7T-VKO', '7T-VKP', '7T-VKQ', '7T-VKR',
  '7T-VKS', '7T-VKT',
]
