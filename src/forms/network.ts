/**
 * Réseau et flotte.
 *
 * Ces listes alimentent les suggestions de saisie : elles guident sans jamais
 * interdire une autre valeur, pour qu'un vol hors réseau reste saisissable.
 * À compléter avec les listes officielles du Training Department.
 */

/**
 * Codes IATA proposés à la saisie d'une étape.
 *
 * Liste provisoire, en attente du relevé officiel du réseau. Elle ne fait que
 * proposer : un vol charter ou exceptionnel s'écrit directement dans le champ.
 */
export const AIRPORTS: string[] = [
  // Réseau domestique
  'ALG', 'ORN', 'CZL', 'AAE', 'TLM', 'BJA', 'GJL', 'QSF', 'BLJ', 'TEE',
  'HME', 'IAM', 'VVZ', 'OGX', 'TGR', 'ELU', 'BSK', 'GHA', 'LOO', 'ELG',
  'TMX', 'AZR', 'INZ', 'TMR', 'DJG', 'BMW', 'TIN', 'BFW', 'MZW', 'EBH',
  'CFK', 'TID', 'MUW', 'HRM',
  // Europe
  'CDG', 'ORY', 'MRS', 'LYS', 'TLS', 'NCE', 'BOD', 'LIL', 'NTE', 'MPL',
  'MLH', 'SXB', 'PGF', 'MAD', 'BCN', 'ALC', 'GVA', 'FCO', 'MXP', 'LHR',
  'FRA', 'BRU', 'LIS', 'IST',
  // Afrique et Moyen-Orient
  'CMN', 'RAK', 'TUN', 'MIR', 'DJE', 'TIP', 'CAI', 'DSS', 'BKO', 'OUA',
  'NIM', 'NKC', 'ABJ', 'LOS', 'JED', 'MED', 'DXB', 'AMM', 'BEY', 'DOH',
  // Amérique du Nord
  'YUL', 'JFK',
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
 *
 * 7T-VJJ à 7T-VKT : B737 NG et MAX 8, relevé OMD ED 03 – REV 17 JUL 2026.
 * 7T-VLQ, 7T-VLR, 7T-VLS s'y ajoutent.
 */
export const AIRCRAFT_REGISTRATIONS: string[] = [
  '7T-VJJ', '7T-VJK', '7T-VJL', '7T-VJM', '7T-VJN', '7T-VJO',
  '7T-VJP', '7T-VJQ', '7T-VJR', '7T-VJS', '7T-VJT', '7T-VJU',
  '7T-VKA', '7T-VKB', '7T-VKC', '7T-VKD', '7T-VKE', '7T-VKF',
  '7T-VKG', '7T-VKH', '7T-VKI', '7T-VKJ', '7T-VKK', '7T-VKL',
  '7T-VKM', '7T-VKN', '7T-VKO', '7T-VKP', '7T-VKQ', '7T-VKR',
  '7T-VKS', '7T-VKT',
  '7T-VLQ', '7T-VLR', '7T-VLS',
]
