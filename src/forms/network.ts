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
  a('TIN', 'Tindouf'),
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
  a('MLH', 'Bâle-Mulhouse'),
  // Europe hors France
  a('LHR', 'Londres Heathrow'),
  a('STN', 'Londres Stansted'),
  a('LGW', 'Londres Gatwick'),
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
  a('LAD', 'Luanda'),
  // Amérique du Nord
  a('YUL', 'Montréal'),
]

/**
 * Flotte, par type exploité.
 *
 * L'immatriculation proposée découle du type choisi : demander un B737-800
 * ne doit pas faire défiler les ATR. Un type sans appareil relevé laisse la
 * liste complète.
 */
export const FLEET_BY_TYPE: Record<string, string[]> = {
  'ATR 72-500': [
    '7T-VUI', '7T-VUJ', '7T-VUK', '7T-VUL', '7T-VUM', '7T-VUN',
    '7T-VUO', '7T-VUP', '7T-VUQ', '7T-VUS', '7T-VVQ', '7T-VVR',
  ],
  'ATR 72-600': ['7T-VUA', '7T-VUT', '7T-VUV', '7T-VUW'],
  'B737-600 NG': ['7T-VJQ', '7T-VJR', '7T-VJS', '7T-VJT', '7T-VJU'],
  'B737-700 NG': ['7T-VKS', '7T-VKT'],
  'B737-800 NG': [
    '7T-VJJ', '7T-VJK', '7T-VJL', '7T-VJM', '7T-VJN', '7T-VJO', '7T-VJP',
    '7T-VKA', '7T-VKB', '7T-VKC', '7T-VKD', '7T-VKE', '7T-VKF', '7T-VKG',
    '7T-VKH', '7T-VKI', '7T-VKJ', '7T-VKK', '7T-VKL', '7T-VKM', '7T-VKN',
    '7T-VKO', '7T-VKP', '7T-VKQ', '7T-VKR',
  ],
  'B737 MAX 8': ['7T-VLQ', '7T-VLR', '7T-VLS'],
  // Pas encore réceptionnés : le type existe, sans appareil à proposer.
  'B737 MAX 9': [],
  'A330-200': [
    '7T-VJA', '7T-VJB', '7T-VJC', '7T-VJV', '7T-VJW', '7T-VJX', '7T-VJY', '7T-VJZ',
  ],
  'A330-900 neo': ['7T-VJD', '7T-VJE', '7T-VJF', '7T-VLA', '7T-VLB'],
}

/** Types exploités, proposés partout où un formulaire demande le type avion. */
export const FLEET: string[] = Object.keys(FLEET_BY_TYPE)

/**
 * Toute la flotte, chaque immatriculation accompagnée de son type : c'est ce
 * qui est proposé tant qu'aucun type n'a été choisi.
 */
export const AIRCRAFT_REGISTRATIONS: Airport[] = Object.entries(FLEET_BY_TYPE).flatMap(
  ([type, immatriculations]) => immatriculations.map((value) => ({ value, hint: type })),
)
