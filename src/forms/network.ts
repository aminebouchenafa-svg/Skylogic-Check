/**
 * Réseau et flotte.
 *
 * Ces listes alimentent les suggestions de saisie : elles guident sans jamais
 * interdire une autre valeur, pour qu'un vol hors réseau reste saisissable.
 * À compléter avec les listes officielles du Training Department.
 */

/** Une escale proposée à la saisie : son code IATA et la ville desservie. */
export interface Airport {
  value: string
  hint: string
}

const a = (value: string, hint: string): Airport => ({ value, hint })

/**
 * Réseau Air Algérie, codes IATA.
 *
 * La liste ne fait que proposer : un vol charter ou exceptionnel s'écrit
 * directement dans le champ et est conservé tel quel.
 */
export const AIRPORTS: Airport[] = [
  // Algérie
  a('ALG', 'Alger'),
  a('ORN', 'Oran'),
  a('CZL', 'Constantine'),
  a('AAE', 'Annaba'),
  a('AZR', 'Adrar'),
  a('BLJ', 'Batna'),
  a('CBH', 'Béchar'),
  a('BJA', 'Béjaïa'),
  a('BSK', 'Biskra'),
  a('BMW', 'Bordj Badji Mokhtar'),
  a('CFK', 'Chlef'),
  a('DJG', 'Djanet'),
  a('EBH', 'El Bayadh'),
  a('ELG', 'El Goléa'),
  a('ELU', 'El Oued'),
  a('GHA', 'Ghardaïa'),
  a('HME', 'Hassi Messaoud'),
  a('INZ', 'In Salah'),
  a('IAM', 'In Amenas'),
  a('INF', 'In Guezzam'),
  a('GJL', 'Jijel'),
  a('LOO', 'Laghouat'),
  a('MZW', 'Mécheria'),
  a('OGX', 'Ouargla'),
  a('QSF', 'Sétif'),
  a('TMR', 'Tamanrasset'),
  a('TLM', 'Tlemcen'),
  a('VNE', 'Tindouf'),
  a('TGR', 'Touggourt'),
  a('TEE', 'Tébessa'),
  a('VVZ', 'Illizi'),
  // France
  a('ORY', 'Paris Orly'),
  a('CDG', 'Paris Charles-de-Gaulle'),
  a('MRS', 'Marseille'),
  a('LYS', 'Lyon'),
  a('NCE', 'Nice'),
  a('TLS', 'Toulouse'),
  a('BOD', 'Bordeaux'),
  a('LIL', 'Lille'),
  a('NTE', 'Nantes'),
  a('MPL', 'Montpellier'),
  a('SXB', 'Strasbourg'),
  a('ETZ', 'Metz / Nancy'),
  a('BSL', 'Bâle-Mulhouse'),
  // Europe hors France
  a('LHR', 'Londres Heathrow'),
  a('STN', 'Londres Stansted'),
  a('FRA', 'Francfort'),
  a('BER', 'Berlin'),
  a('BRU', 'Bruxelles'),
  a('GVA', 'Genève'),
  a('FCO', 'Rome'),
  a('MXP', 'Milan'),
  a('MAD', 'Madrid'),
  a('BCN', 'Barcelone'),
  a('ALC', 'Alicante'),
  a('VLC', 'Valence'),
  a('PMI', 'Palma de Majorque'),
  a('LIS', 'Lisbonne'),
  a('VIE', 'Vienne'),
  a('BUD', 'Budapest'),
  a('SVO', 'Moscou'),
  // Moyen-Orient et Asie
  a('DXB', 'Dubaï'),
  a('JED', 'Djeddah'),
  a('MED', 'Médine'),
  a('CAI', 'Le Caire'),
  a('IST', 'Istanbul'),
  a('AYT', 'Antalya'),
  a('AMM', 'Amman'),
  a('BEY', 'Beyrouth'),
  a('KWI', 'Koweït City'),
  a('DOH', 'Doha'),
  a('PEK', 'Pékin'),
  a('CAN', 'Canton'),
  a('PVG', 'Shanghai'),
  a('KUL', 'Kuala Lumpur'),
  a('DEL', 'New Delhi'),
  // Afrique
  a('TUN', 'Tunis'),
  a('CMN', 'Casablanca'),
  a('TIP', 'Tripoli'),
  a('NKC', 'Nouakchott'),
  a('DSS', 'Dakar'),
  a('ABJ', 'Abidjan'),
  a('NIM', 'Niamey'),
  a('OUA', 'Ouagadougou'),
  a('BKO', 'Bamako'),
  a('CKY', 'Conakry'),
  a('LOS', 'Lagos'),
  a('ABV', 'Abuja'),
  a('DLA', 'Douala'),
  a('LBV', 'Libreville'),
  a('BZV', 'Brazzaville'),
  a('NDJ', 'N’Djaména'),
  a('JNB', 'Johannesbourg'),
  a('ADD', 'Addis-Abeba'),
  a('NBJ', 'Luanda'),
  // Amérique du Nord
  a('YUL', 'Montréal'),
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
