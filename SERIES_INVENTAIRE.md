# Inventaire technique et éditorial — Séries Duocumentaires & Parcours Studio

> **Objet** : État des lieux complet en lecture seule (Prompt 10A) du codebase YonyWood pour préparer un lancement centré sur **8 séries**, **2 côtés par série**, et **plusieurs personnes (communautés) par côté**.
> **Méthodologie** : Toutes les affirmations ci-dessous proviennent de la lecture directe des fichiers sources (`src/`, `server.ts`) et du contenu réel de `public/`. Aucun fichier existant n’a été modifié et aucune dépendance n’a été ajoutée.

---

## 1. Inventaire des séries et comparaison entre sources

### 1.1 Vue d’ensemble : les 4 registres parallèles des « 8 séries »

Le projet contient **8 séries diptyques** déclarées dans quatre endroits principaux (plus les équipes de production et la table d’alias) :

1. **Carrousel Studio (pilier `'duos'`)** : `STUDIO_PILLARS` (`id: 'duos'`) dans `src/data/studioPillarsData.ts:37-111` — **8 séries**.
2. **Catalogue officiel `DOCUMENTARIES`** : `INITIAL_DOCUMENTARIES` dans `src/data/mockData.ts:14-770`, exposé via `getCustomDocumentaries()` -> `DOCUMENTARIES` (`src/data/mockData.ts:772-855`).
   - C’est **exactement cette liste `DOCUMENTARIES`** qui alimente :
     - le filtre de **Réglages** (`src/components/SettingsScreen.tsx:678`),
     - le filtre **Critères** de l’en-tête (actuellement masqué via `SHOW_SERIES_FILTER_IN_HEADER = false` dans `src/config/flags.ts:11`, rendu dans `src/components/Navbar.tsx:229`),
     - les routes `/api/series` et `/api/series/:id` (`server.ts:136-154`).
   - Attention : `DOCUMENTARIES` peut être surchargé/migré côté client via `localStorage['yonywood_custom_series']` (`src/data/mockData.ts:775-866`).
3. **Duos du flux `DUOS`** : `src/data/mockData.ts:2625-2938` — **8 duos** (1 duo par série), servis aussi par `GET /api/duos` (`server.ts:157-167`) et consommés par `DuoFeedScreen.tsx:76-85`.
4. **Arbres d’affiliation `SERIES_AFFILIATION_TREES`** : `src/data/mockData.ts:3229-4104` — **6 séries seulement** (2 séries absentes).
5. **Équipes `ALL_SERIES_TEAMS`** (`src/data/seriesTeamData.ts:20-554`) et **table de correspondance `legacyToCanonical`** (`src/App.tsx:193-203`).

> **Note sur Studio Niveau 0** : Avec `SHOW_FOCUS = false` (`src/config/flags.ts:5`), `SubmitStoryScreen.tsx:30, 424-426` court-circuite le choix du pilier (`Focus` vs `Duocumentaires`) et ouvre directement `DEFAULT_DIALOGUE_PILLAR` (`id: 'duos'`), c’est-à-dire le carrousel des **8 séries**.

---

### 1.2 Tableau comparatif détaillé des 8 séries

| # Studio / # Mock | Studio (`studioPillarsData.ts`) : `id`, `title`, ligne | `DOCUMENTARIES` (`mockData.ts`) : `id`, `title`, ligne | `DUOS` (`mockData.ts`) : `id`, `documentaryId`, `documentaryTitle`, ligne | `SERIES_AFFILIATION_TREES` : `seriesId`, `seriesTitle`, ligne | Thème / Question centrale & différences clés |
|---|---|---|---|---|---|
| Studio #1 / Mock #3 | `blacks-one-amazones`<br>`Blacks One ‹ › Amazones`<br>`studioPillarsData.ts:47-53` | `blacks-one-beyond-eve`<br>`Blacks One ‹ › Amazones`<br>`mockData.ts:235-346` | `duo-blacks-one-beyond-eve-01`<br>`docId: 'blacks-one-beyond-eve'`<br>`Blacks One ‹ › Amazones`<br>`mockData.ts:2663-2679` | `blacks-one-beyond-eve`<br>`Blacks One < > Beyond Eve`<br>`mockData.ts:3594-3763` | **Thème** : Identité / souveraineté hommes noirs & femmes.<br>**Divergences** : ID différent (Studio vs Mock) ; arbre garde l’ancien nom `Beyond Eve` et le séparateur `< >` ; affiches différentes (voir §3). |
| Studio #2 / Mock #6 | `baobab-bambou`<br>`Baobabs ‹ › Bambous`<br>`studioPillarsData.ts:55-61` | `other-eyes-sixth-sense`<br>`Baobabs ‹ › Bambous`<br>`mockData.ts:556-617` | `duo-other-eyes-sixth-sense-01`<br>`docId: 'other-eyes-sixth-sense'`<br>`Baobab ‹ › Bambou` *(singulier)*<br>`mockData.ts:2717-2733` | `other-eyes-sixth-sense`<br>`Other Sights < > Third Eye`<br>`mockData.ts:3991-4103` | **Thème** : Aînés (racines) vs jeunesse (agilité) — **en conflit** avec l’ancien thème perception/clairvoyance.<br>**Divergences critiques** : ID `baobab-bambou` vs `other-eyes-sixth-sense` ; pluriel vs singulier ; `DUOS[5]` couple `codjo-blind` & `mawuna-medium` (thème voyance/Fâ) avec un texte Baobab/Bambou ; arbre entièrement resté sur `Other Sights < > Third Eye`. |
| Studio #3 / Mock #7 | `coaching-phd`<br>`Coaching ‹ › PhD`<br>`studioPillarsData.ts:63-69` | `builders-seekers`<br>`Coaching ‹ › PhD`<br>`mockData.ts:619-693` | `duo-coaching-unlimited-01`<br>`docId: 'builders-seekers'`<br>`Coaching ‹ › PhD`<br>`mockData.ts:2735-2835` | **ABSENT** *(non défini dans `SERIES_AFFILIATION_TREES`)* | **Thème** : Instinct pratique du coaching vs rigueur de thèse.<br>**Divergences** : 3 IDs différents (`coaching-phd`, `builders-seekers`, `duo-coaching-unlimited-01` / `coaching-unlimited` dans `seriesTeamData.ts:399`) ; absent des arbres d’affiliation. |
| Studio #4 / Mock #1 | `jesus-legba`<br>`Vodun Rays ‹ › Autre Foi`<br>`studioPillarsData.ts:71-77` | `jesus-legba`<br>`Vodun Rays ‹ › Autre Foi`<br>`mockData.ts:16-135` | `duo-jesus-legba-01`<br>`docId: 'jesus-legba'`<br>`Vodun Rays ‹ › Autre Foi`<br>`mockData.ts:2627-2643` | `jesus-legba`<br>`Vodun Rays ‹ › Autre Foi`<br>`mockData.ts:3231-3400` | **Thème** : Spiritualités ancestrales vs foi révélée.<br>**Seul ID unifié** (`jesus-legba`) partout. Divergences mineures : question différente entre Studio (`studioPillarsData.ts:74`) et Mock (`mockData.ts:20`), tags résiduels `Èṣù` / `Jésus` dans l’arbre (`mockData.ts:3247, 3266`). |
| Studio #5 / Mock #5 | `roots-routes`<br>`Roots < > Routes`<br>`studioPillarsData.ts:79-85` | `investors-builders`<br>`Roots < > Routes`<br>`mockData.ts:441-554` | `duo-investors-builders-01`<br>`docId: 'roots-routes'`<br>`Roots ‹ › Routes` *(guillemets ‹ ›)*<br>`mockData.ts:2699-2715` | `investors-builders`<br>`Diasporas < > Makers`<br>`mockData.ts:3898-3989` | **Thème** : Ancrage natal vs itinérance/diaspora — **mélangé** avec Investisseurs vs Bâtisseurs.<br>**Divergences critiques** : `DOCUMENTARIES[4]` garde l’ID `investors-builders` et des effigies/questions Investisseur/Bâtisseur (`mockData.ts:468-540`) ; `DUOS[4]` utilise `documentaryId: 'roots-routes'` (d’où le patch manuel dans `DuoFeedScreen.tsx:102`), l’arbre s’appelle `Diasporas < > Makers`, et le séparateur alterne `< >` vs `‹ ›`. |
| Studio #6 / Mock #4 | `fiat-luxe-builders`<br>`Fiat Luxe ‹ › Builders`<br>`studioPillarsData.ts:87-93` | `dixeat-fiat-luxe`<br>`Fiat Luxe ‹ › Builders`<br>`mockData.ts:348-439` | `duo-dixeat-fiat-luxe-01`<br>`docId: 'dixeat-fiat-luxe'`<br>`Fiat Luxe ‹ › Builders`<br>`mockData.ts:2681-2697` | `dixeat-fiat-luxe`<br>`Fiat Luxe < > Sweet Street`<br>`mockData.ts:3765-3896` | **Thème** : Haute joaillerie/détail vs architectes/bâtisseurs.<br>**Divergences critiques** : ID différent (`fiat-luxe-builders` vs `dixeat-fiat-luxe`) ; `DUOS[3]` couple Hélène Saint-Amand avec `chef-koffi` (`Sweet Street`, cuisine de rue) en lui attribuant une citation de chantier béton (`mockData.ts:2692`) ; `DOCUMENTARIES[3].questions` parle encore de goût/cuisine (`Chef Koffi`) ; l’arbre s’appelle `Fiat Luxe < > Sweet Street`. |
| Studio #7 / Mock #8 | `pictures-words`<br>`Pictures ‹ › Words`<br>`studioPillarsData.ts:95-101` | `focus-phd`<br>`Pictures ‹ › Words`<br>`mockData.ts:695-769` | `duo-focus-phd-01`<br>`docId: 'focus-phd'`<br>`Pictures ‹ › Words`<br>`mockData.ts:2837-2937` | **ABSENT** *(non défini dans `SERIES_AFFILIATION_TREES`)* | **Thème** : Image photographique vs verbe/slam.<br>**Divergences** : ID `pictures-words` vs `focus-phd` (ancien titre `Focus ‹ › PhD`) ; absent des arbres d’affiliation. |
| Studio #8 / Mock #2 | `benin-monde`<br>`Benin ‹ › Le Monde`<br>`studioPillarsData.ts:103-109` | `finagnon-qosqorico`<br>`Benin ‹ › Le Monde`<br>`mockData.ts:137-233` | `duo-finagnon-qosqorico-01`<br>`docId: 'finagnon-qosqorico'`<br>`Bénin ‹ › Le Monde` *(avec accent)*<br>`mockData.ts:2645-2661` | `finagnon-qosqorico`<br>`Benin < > ...`<br>`mockData.ts:3402-3592` | **Thème** : Attachement au territoire (Bénin vs Pérou/Monde).<br>**Divergences** : ID `benin-monde` vs `finagnon-qosqorico` ; orthographe `Benin` vs `Bénin` vs `Benin < > ...` ; question différente entre Studio (`lien intime avec la terre ou l’eau`) et Mock (`ce qui rend votre pays unique`) ; protagonistes encore tagués `Finagnon` / `Qosqorico`. |

### 1.3 Synthèse des différences de nombre, d’ordre, de noms et d’IDs

- **Nombre** :
  - `STUDIO_PILLARS['duos'].items` : **8** séries (`studioPillarsData.ts:45-110`).
  - `DOCUMENTARIES` (et donc filtre Réglages `SettingsScreen.tsx:678` et `Navbar.tsx:229`) : **8** séries (`mockData.ts:14-770`).
  - `DUOS` : **8** duos (`mockData.ts:2625-2938`).
  - `SERIES_AFFILIATION_TREES` : **6** arbres seulement (`mockData.ts:3229-4104`) — il manque `coaching-phd`/`builders-seekers` et `pictures-words`/`focus-phd`.
  - `ALL_SERIES_TEAMS` : **9** clés principales (`mockData.ts` + `'safer-healer'` à `seriesTeamData.ts:511`) + 8 alias ajoutés en bas (`seriesTeamData.ts:546-553`).
- **Ordre différent** :
  - Studio : `1. Blacks One`, `2. Baobabs`, `3. Coaching`, `4. Vodun Rays`, `5. Roots`, `6. Fiat Luxe`, `7. Pictures`, `8. Benin`.
  - `DOCUMENTARIES` & `DUOS` & Filtre Réglages : `1. Vodun Rays`, `2. Benin`, `3. Blacks One`, `4. Fiat Luxe`, `5. Roots`, `6. Baobabs`, `7. Coaching`, `8. Pictures`.
- **Identifiants incompatibles (7 sur 8)** :
  - Seul `'jesus-legba'` est identique entre Studio et `DOCUMENTARIES`/`DUOS`.
  - Les 7 autres utilisent dans Studio de nouveaux IDs (`blacks-one-amazones`, `baobab-bambou`, `coaching-phd`, `roots-routes`, `fiat-luxe-builders`, `pictures-words`, `benin-monde`) alors que `DOCUMENTARIES` et `SettingsScreen` utilisent les anciens IDs canoniques (`blacks-one-beyond-eve`, `other-eyes-sixth-sense`, `builders-seekers`, `investors-builders`, `dixeat-fiat-luxe`, `focus-phd`, `finagnon-qosqorico`).
  - Conséquence directe dans le code : `getSeriesParts(choice)` dans `SubmitStoryScreen.tsx:110` cherche `DOCUMENTARIES.find(d => d.id === choice.id || d.slug === choice.id)`. Pour les **7 séries dont l’ID diffère**, cette recherche **échoue** et le code bascule en repli sur le découpage du titre par regex (`ligne 131`).
- **Séparateurs typographiques incohérents** : 7 séries Studio utilisent `‹ ›` mais `Roots < > Routes` utilise `< >` (`studioPillarsData.ts:80`, `mockData.ts:443`), alors que `DUOS[4]` utilise `Roots ‹ › Routes` (`mockData.ts:2702`).
- **Anciens titres résiduels en back-office** : `BACKOFFICE_APPLICATIONS` (`mockData.ts:3149, 3163, 3191, 3205`) affiche encore `FINAGNON × QOSQORICO`, `BLACKS ONE × BEYOND EVE`, `E VIVI × FIÂT LUXE`.

---

## 2. Les deux côtés de chaque série : noms, questions et représentation

### 2.1 Comment les côtés sont représentés dans les données

1. **Dans `Documentary` (`src/types.ts:265-289`)** :
   - Chaque série possède un tuple fixe **`universes: [UniverseInfo, UniverseInfo]`** (`src/types.ts:277`), contenant pour chaque côté : `name`, `tagline`, `description`, `territory`.
   - Aucune liste de participants par côté n’existe dans `Documentary`.
2. **Dans le formulaire Studio (`src/components/SubmitStoryScreen.tsx:98-164`)** :
   - `getSeriesParts(choice)` extrait deux objets génériques :
     - **`part-a`** (`number: 'Partie 1'`)
     - **`part-b`** (`number: 'Partie 2'`)
   - Enregistré sur la soumission utilisateur via `partId?: 'part-a' | 'part-b'` (`src/types.ts:577`).
3. **Dans `Protagonist` (`src/types.ts:84-85`)** :
   - Chaque protagoniste porte `documentaryId?: string` et `universeTag: string` (chaîne libre, non typée par enum ni liée à `'part-a' | 'part-b'`).
4. **Dans `Duo` & `DuoFeedScreen` (`src/types.ts:324-342`, `src/components/DuoFeedScreen.tsx:619-861`)** :
   - Un duo représente un triptyque horizontal :
     - **`idx = 0` (Volet A)** : `protagonistA` + `storyA` + `quoteA`
     - **`idx = 1` (Miroir)** : `ResonanceFaceToFaceCard` (portraits A `‹ ›` B, question centrale unique, 3 curseurs d’évaluation)
     - **`idx = 2` (Volet B)** : `protagonistB` + `storyB` + `quoteB`
5. **Dans `SeriesAffiliationTree` (`src/types.ts:418-455`, `src/data/mockData.ts:3229-4104`)** :
   - `pioneers: AffiliationPerson[]` (2 pionniers représentant chacun un côté) avec sous-arbres récursifs `invitedPeople?: AffiliationPerson[]`.

### 2.2 Un côté peut-il contenir plusieurs personnes ou une seule ?

- **Dans `DUOS` et `DuoFeedScreen`** : **UNE seule personne par côté** par fiche Duo (`protagonistA` et `protagonistB` sont des objets unitaires, `src/types.ts:330-331`). Le feed ne regroupe pas une liste communautaire côté A ni côté B.
- **Dans `PROTAGONISTS`** : Plusieurs personnes peuvent techniquement porter le même `documentaryId` + `universeTag` (ex. `sika-dossou` et `koffi-tisserand` côté Bénin dans `finagnon-qosqorico`), mais il n’existe aucune structure « communauté du côté A / côté B » exploitée par Studio ou par le feed.
- **Dans `SERIES_AFFILIATION_TREES`** : **Oui dans le schéma** (`pioneers` + `invitedPeople[]` récursifs), pensé pour représenter plusieurs personnes par côté sur plusieurs générations — **mais** ce graphe est purement statique, absent de 2 séries sur 8, et totalement déconnecté du Studio comme de `DuoFeedScreen`.

### 2.3 Détail des deux côtés et des questions par série

> **Constat général sur les questions** : Dans `STUDIO_PILLARS`, `DOCUMENTARIES` et `DUOS`, il n’y a **pas** de question distincte pour le côté A et pour le côté B : une **question centrale commune** (ou les 1 à 5 `questions[]` de `DOCUMENTARIES`) est posée aux deux côtés en miroir. Seuls quelques items de `SERIES_AFFILIATION_TREES` formulent des `episodeQuestion` distinctes par invité/pionnier.

1. **`jesus-legba` — *Vodun Rays ‹ › Autre Foi***
   - **Côté A** : `Vodun Rays` (`mockData.ts:29`, « Le gardien des mémoires et des seuils sacrés », Bénin : Allada, Abomey, Ouidah). *(Dans l’arbre `mockData.ts:3247` : `Èṣù`).*
   - **Côté B** : `Autre Foi` (`mockData.ts:35`, « L’espérance spirituelle et le don de soi », Bénin Littoral & Diaspora). *(Dans l’arbre `mockData.ts:3266, 3285` : `Jésus`, `Autre Foi`).*
   - **Questions** :
     - Studio (`studioPillarsData.ts:74`) : *« Comment votre rapport au sacré ou à la foi vous aide-t-il à traverser le mystère et les épreuves ? »*
     - `DOCUMENTARIES[0].centralQuestion` & `DUOS[0].centralQuestion` (`mockData.ts:20, 2636`) : *« Qu’est-ce qui, un jour, vous a fait sentir que quelque chose de plus grand que vous était présent ? »*
     - `DOCUMENTARIES[0].questions` (`mockData.ts:59-131`) : **5 questions** (*01 La Présence*, *02 L'Épreuve*, *03 La Transmission*, *04 La Personne qui vous a Changé*, *05 L'Héritage*).
     - `SERIES_AFFILIATION_TREES[0]` (`mockData.ts:3255, 3335`) : A (`01 — Racontez-nous un moment où vous avez réellement rencontré votre foi.`), B (`01 — La rencontre intime avec la grâce.`), plus questions 02 à 05 selon les invités.

2. **`benin-monde` / `finagnon-qosqorico` — *Benin ‹ › Le Monde***
   - **Côté A** : `Bénin` (`mockData.ts:150`, « La mémoire lacustre et la terre rouge », Ganvié, Grand-Popo) — appelée `'Benin'` dans Studio (`split` du titre) et `'Finagnon'` sur `PROTAGONISTS` (`koffi-tisserand`, `tobi-houndegla`) et dans l’arbre (`mockData.ts:3418`).
   - **Côté B** : `Le Monde` (`mockData.ts:156`, « L’autre rive, les cimes et les horizons en miroir », Pérou : Cusco, Vallée Sacrée, Pisac) — appelée `'Qosqorico'` sur `PROTAGONISTS` (`amara-tisserande`, `sayri-quispe`) et dans l’arbre (`mockData.ts:3519`).
   - **Questions** :
     - Studio (`studioPillarsData.ts:106`) : *« Quel est votre lien intime avec la terre ou l’eau qui nourrit votre communauté ? »*
     - `DOCUMENTARIES[1]` & `DUOS[1]` (`mockData.ts:141, 2654`) : *« Racontez un moment où vous avez compris ce qui rend votre pays unique. »*
     - `DOCUMENTARIES[1].questions` (`mockData.ts:162-229`) : **5 questions** (*01 Le Pays Unique*, *02 Partir*, *03 Revenir*, *04 Ce qui Reste*, *05 Demain*).
     - Arbre (`mockData.ts:3426, 3527`) : A (`02 — Le geste ancestral qui relie les générations.`), B (`02 — La mémoire que chaque fil garde de la montagne.`).

3. **`blacks-one-amazones` / `blacks-one-beyond-eve` — *Blacks One ‹ › Amazones***
   - **Côté A** : `Blacks One` (`mockData.ts:248`, « Le verbe souverain, le poing levé et le combat pour la justice », Dakar & Diaspora).
   - **Côté B** : `Amazones` (`mockData.ts:254`, « La puissance des femmes, la bravoure et la souveraineté collective », Abidjan, Cotonou, Ouidah & Diaspora) — mais encore nommé `'Beyond Eve'` sur `eleonore-vance` (`mockData.ts:1741`) et dans l’arbre (`mockData.ts:3690`).
   - **Questions** :
     - Studio (`studioPillarsData.ts:50`), `DOCUMENTARIES[2]` (`mockData.ts:239`) & `DUOS[2]` (`mockData.ts:2672`) : *« Comment affirmez-vous votre dignité et votre souveraineté intime face aux tempêtes de l’Histoire ? »* (Studio/Mock alignés !).
     - `DOCUMENTARIES[2].questions` (`mockData.ts:278-342`) : **5 questions** (*01 L'Identité Portée*, *02 Le Regard des Autres*, *03 CE QUE L'ON PORTE*, *04 Devenir*, *05 À Celui qui Viendra*).
     - Arbre (`mockData.ts:3618, 3698`) : A (`03 — Ce que l’on porte : Ce que l’on a reçu et qu’on refuse de poser.`), B (`03 — Racontez-nous ce que vous portez encore de votre histoire.`).

4. **`fiat-luxe-builders` / `dixeat-fiat-luxe` — *Fiat Luxe ‹ › Builders***
   - **Côté A** : `Fiat Luxe` (`mockData.ts:361`, « La haute scénographie du détail et l’orfèvrerie du millimètre », Paris, Cotonou, Milan).
   - **Côté B** : `Builders` (`mockData.ts:367`, « L’ancrage dans la matière, les structures durables et l’architecture », Cotonou, Kigali, Abidjan) — mais l’arbre (`mockData.ts:3781`) et `PROTAGONISTS` (`chef-koffi`, `mockData.ts:1824`) utilisent encore **`Sweet Street`** (cuisine de rue).
   - **Questions** :
     - Studio (`studioPillarsData.ts:90`), `DOCUMENTARIES[3]` (`mockData.ts:352`) & `DUOS[3]` (`mockData.ts:2690`) : *« L’orfèvrerie du millimètre ou la force des fondations : que construisez-vous qui résiste au temps ? »*
     - **Incohérence dans `DOCUMENTARIES[3].questions` (`mockData.ts:373-435`)** : **5 questions** encore libellées pour la cuisine/expérience (*01 La Beauté Inattendue*, *02 L'Attention*, *03 Le Détail* avec `Chef Koffi (Dantokpa)`, *04 La Surprise*, *05 CE QUE L'ON OFFRE*).

5. **`roots-routes` / `investors-builders` — *Roots < > Routes***
   - **Côté A** : `Roots` (`mockData.ts:454`, « L’ancrage sur la terre natale et la fidélité aux ancêtres », Bénin) — mais `PROTAGONISTS` (`fatou-diallo`, `mockData.ts:1990`) et l’arbre (`mockData.ts:3914`) portent **`Investors`**.
   - **Côté B** : `Routes` (`mockData.ts:460`, « La traversée des frontières et le retour fécond de la diaspora », Paris, Dakar, Montréal) — mais `PROTAGONISTS` (`kwame-mensah`, `mockData.ts:2090`) et l’arbre (`mockData.ts:3955`) portent **`Builders`**.
   - **Questions** :
     - Studio (`studioPillarsData.ts:82`), `DOCUMENTARIES[4]` (`mockData.ts:445`) & `DUOS[4]` (`mockData.ts:2708`) : *« L’ancrage dans ses racines ou l’envol sur les routes : où se forge votre véritable identité ? »*
     - **Incohérence dans `DOCUMENTARIES[4].questions` (`mockData.ts:484-550`)** : **5 questions** parlant encore d’« *alliance entre financeur et bâtisseur* » (*01 Construire ses Rêves*, *02 Le Risque & La Tempête*, *03 La Rencontre Décisive*, *04 La Réalité du Terrain*, *05 L'Héritage Durable*).

6. **`baobab-bambou` / `other-eyes-sixth-sense` — *Baobabs ‹ › Bambous***
   - **Côté A** : `Baobab` (`mockData.ts:569`, « L’enracinement séculaire et la mémoire des aînés », Allada, Ouidah, Abomey) — mais l’arbre (`mockData.ts:4007`) et `DUOS[5].protagonistA` (`codjo-blind`) portent **`Other Sights`**.
   - **Côté B** : `Bambou` (`mockData.ts:575`, « L’agilité créative et l’audace de la jeunesse », Cotonou, Parakou, Porto-Novo) — mais l’arbre (`mockData.ts:4069`) et `DUOS[5].protagonistB` (`mawuna-medium`) portent **`Third Eye`**.
   - **Questions** :
     - Studio (`studioPillarsData.ts:58`), `DOCUMENTARIES[5]` (`mockData.ts:560`) & `DUOS[5]` (`mockData.ts:2726`) : *« La solidité des racines centenaires ou la souplesse du vent nouveau : quelle sagesse guide vos pas ? »*
     - `DOCUMENTARIES[5].questions` (`mockData.ts:599-613`) : **1 seule question** (*01 La Sagesse du Temps*).
     - Arbre (`mockData.ts:4015, 4077`) : *« 01 — Que voit-on quand le monde ferme les yeux ? »* (reste sur l’ancien thème).

7. **`coaching-phd` / `builders-seekers` — *Coaching ‹ › PhD***
   - **Côté A** : `Coaching` (`mockData.ts:632`, « L’impulsion du terrain, le déclic mental et le mentorat d’impact », Paris, Cotonou, Abidjan). *(Noter que `athlete-lagat` dans `PROTAGONISTS` porte encore `universeTag: 'Sans Limites'`, `mockData.ts:2477`).*
   - **Côté B** : `PhD` (`mockData.ts:638`, « La rigueur scientifique, la thèse et la preuve par la recherche », Oxford, Ouagadougou, Lyon).
   - **Questions** :
     - Studio (`studioPillarsData.ts:66`), `DOCUMENTARIES[6]` (`mockData.ts:623`) & `DUOS[6]` (`mockData.ts:2808`) : *« L’instinct pratique du terrain ou la rigueur de la thèse : comment transformez-vous le monde ? »*
     - `DOCUMENTARIES[6].questions` (`mockData.ts:662-689`) : **2 questions** (*01 Terrain ou Thèse*, *02 Le Déclic*).
     - Arbre : **inexistant**.

8. **`pictures-words` / `focus-phd` — *Pictures ‹ › Words***
   - **Côté A** : `Pictures` (`mockData.ts:708`, « L’œil aux aguets, la lumière naturelle et la mémoire sensible », Montréal, Paris, Dakar) — mais `photographer-clara` dans `PROTAGONISTS` porte `universeTag: 'Focus'` (`mockData.ts:2531`).
   - **Côté B** : `Words` (`mockData.ts:714`, « Le slam, la poésie vivante et la puissance du verbe », Cotonou, Dakar, Port-au-Prince).
   - **Questions** :
     - Studio (`studioPillarsData.ts:98`), `DOCUMENTARIES[7]` (`mockData.ts:699`) & `DUOS[7]` (`mockData.ts:2910`) : *« L’image qui fige l’instant ou le mot qui réveille la conscience : comment racontez-vous la vérité ? »*
     - `DOCUMENTARIES[7].questions` (`mockData.ts:738-765`) : **2 questions** (*01 Raconter la Vérité*, *02 Le Souffle Créateur*).
     - Arbre : **inexistant**.

---

## 3. Vidéos, photos et profils rattachés à chaque série et côté

### 3.1 Données réelles vs données de démonstration

- **Données réelles sur le serveur / dans `public/`** : **Aucune vidéo distincte par série ou par personne.** Il n’existe qu’**un seul fichier vidéo** dans tout le dossier public : **`public/sample.mp4`** (`ls -1 public/*.mp4` -> `public/sample.mp4`). Toutes les propriétés `videoUrl`, `teaserVideoUrl`, `videoAvatarUrl`, `videoPreviewUrl` de `studioPillarsData.ts`, `mockData.ts`, `fourFacesFeedData.ts`, `thematicStoriesData.ts`, `seriesTeamData.ts` et `userVideoService.ts` pointent vers **`'/sample.mp4'`**. De plus, `DuoFeedScreen.tsx:486-489` force tout lien vide ou `commondatastorage.googleapis.com` vers `'/sample.mp4'`.
- **Données de démonstration (statiques)** :
  - **12** entrées dans `PROTAGONISTS` (`mockData.ts:869-2623`), dont 1 profil fondateur hors série (`usr-admin-romeo`) et 11 liés ou associés aux séries.
  - **2** profils définis uniquement **en ligne dans `DUOS[6]` / `DUOS[7]`** (`coach-marc` dupliqué dans `DUOS[6]`, `poet-armel` absent de `PROTAGONISTS` !).
  - **3** publications `FOUR_FACES_PUBLICATIONS` (`fourFacesFeedData.ts:3-172`) utilisant toutes `/sample.mp4`.
  - **3** `INITIAL_DEMO_SUBMISSIONS` dans `userVideoService.ts:6-51` (toutes en `/sample.mp4`), dont 1 seule `universe: 'duo'` (`PENDING`, Roméo à Ganvié).
  - **19 fichiers** existent dans `public/assets/duos/` (vérifiés sur disque : `athlete-hurdle.jpg`, `chef-koffi.jpg`, `coach-office.jpg`, `codjo-blind.jpg`, `dah-zounon.jpg`, `duo_pere_matthieu_1791655226601.jpg`, `eleonore-vance.jpg`, `fatou-diallo.jpg`, `kwame-mensah.jpg`, `mahougnon_esu_portrait_1791701582891.jpg`, `malik-diop.jpg`, `mawuna-medium.jpg`, `pere-matthieu.jpg`, `photographer-focus.jpg`, `researcher-phd.jpg`, `sayri-quispe.jpg`, `tobi-ganvie.jpg`, `tobi-houndegla.jpg`).
  - Noter : dans `DUOS` et `PROTAGONISTS`, `story.videoCoverUrl` pointe vers des **images `.jpg`** (pas des `.mp4`).

### 3.2 Médias et profils série par série (côté A vs côté B)

> Abréviation : **Vidéos = `/sample.mp4` (démo unique)** partout, sauf mention contraire.

1. **`jesus-legba` (*Vodun Rays ‹ › Autre Foi*)**
   - **Affiches série** : Studio & Mock = `/assets/posters/Vodun Rays ‹ › Autre Foi.png` (`studioPillarsData.ts:75`, `mockData.ts:23`) ; `DUOS[0].coverImage` = `/assets/posters/vodun-autre-foi.jpg` (`mockData.ts:2639`) ; 5 questions illustrées par des URLs Unsplash (`mockData.ts:64,78,94,109,122`).
   - **Côté A (`Vodun Rays`)** :
     - Vidéo : `/sample.mp4` (démo).
     - `PROTAGONISTS` : **1 profil** — `dah-zounon` (Mahougnon Zounon Gbegnon, `mockData.ts:1291`), photo `/assets/duos/mahougnon_esu_portrait_1791701582891.jpg`.
     - `effigies` : `eff-1` (Mahougnon Zounon, même photo, `mockData.ts:43`).
     - `SERIES_AFFILIATION_TREES` (`mockData.ts:3239-3317`) : **2 personnes côté Vodun/Èṣù** (`dah-zounon` pionnier + invité `hounon-gbaguidi` photo `/assets/protagonists/tobi-ganvie.jpg`). *(Note : 2 autres descendants sous le pionnier `dah-zounon` — `soeur-blandine` et `frere-jean-baptiste` — sont tagués `'Jésus'`, donc côté B !)*
   - **Côté B (`Autre Foi`)** :
     - Vidéo : `/sample.mp4` (démo).
     - `PROTAGONISTS` : **1 profil** — `pere-matthieu` (Dieudonné Agonhossou, `mockData.ts:1396`), photo `/assets/duos/duo_pere_matthieu_1791655226601.jpg`.
     - `effigies` : `eff-2` (Dieudonné Dossou, même photo, `mockData.ts:51`).
     - `SERIES_AFFILIATION_TREES` (`mockData.ts:3259-3397`) : **5 personnes taguées `Jésus`/`Autre Foi`** (`pere-matthieu`, `pasteur-emmanuel` photo `tobi-houndegla.jpg`, `marie-noelle` photo `adjovi-blandine.jpg`, `theodore-cotonou` photo `amara-tisserande.jpg`, plus `soeur-blandine` photo `senan-agossa.jpg` et `frere-jean-baptiste` photo `sika-dossou.jpg` — soit **6 personnes** si on cumule les deux branches). Total arbre déclaré : `12` (`mockData.ts:3236`), effectif réel dans les nœuds = 7.

2. **`benin-monde` / `finagnon-qosqorico` (*Benin ‹ › Le Monde*)**
   - **Affiches série** : Studio & Mock = `/assets/posters/Benin ‹ › Le Monde.jpg` (`studioPillarsData.ts:107`, `mockData.ts:144`) ; `DUOS[1].coverImage` = `/assets/posters/benin-monde.jpg` (`mockData.ts:2657`) ; aucune `posterUrl` sur ses 5 questions et **`effigies` absent** sur `DOCUMENTARIES[1]`.
   - **Côté A (`Bénin` / `Finagnon`)** :
     - Vidéo : `/sample.mp4` (démo).
     - `PROTAGONISTS` : **3 profils** ont `documentaryId: 'finagnon-qosqorico'` côté Bénin :
       - `sika-dossou` (`universeTag: 'Benin'`, photo `/assets/images/sika_tisserande_1792933605542.jpg`, `mockData.ts:951`)
       - `koffi-tisserand` (`universeTag: 'Finagnon'`, photo `/assets/images/koffi_portonovo_1792933660999.jpg`, `mockData.ts:1052`)
       - `tobi-houndegla` (`universeTag: 'Finagnon'`, photo `/assets/protagonists/tobi-houndegla.jpg`, `mockData.ts:1481`, utilisé dans `DUOS[1].protagonistA`).
     - `SERIES_AFFILIATION_TREES` (`mockData.ts:3411-3509`) : **5 personnes** (`koffi-tisserand` photo `armel-hounkpatin.jpg`, `tobi-ganvie` photo `athlete-hurdle.jpg`, `amina-diallo` photo `chef-koffi.jpg`, `babacar-luthier` photo `coach-office.jpg`, `ayaba-grandpopo` photo `codjo-blind.jpg`). *(Images recyclées d’autres protagonistes !)*
   - **Côté B (`Le Monde` / `Qosqorico`)** :
     - Vidéo : `/sample.mp4` (démo).
     - `PROTAGONISTS` : **2 profils** ont `documentaryId: 'finagnon-qosqorico'` côté Pérou :
       - `amara-tisserande` (`universeTag: 'Qosqorico'`, photo `/assets/images/amara_andine_1792933642777.jpg`, `mockData.ts:1181`)
       - `sayri-quispe` (`universeTag: 'Qosqorico'`, photo `/assets/protagonists/sayri-quispe.jpg`, `mockData.ts:1564`, utilisé dans `DUOS[1].protagonistB`).
     - `SERIES_AFFILIATION_TREES` (`mockData.ts:3512-3589`) : **4 personnes** (`amara-tisserande` photo `dah-zounon.jpg`, `sayri-pisac` photo `eleonore-vance.jpg`, `nayra-fileuse` photo `fatou-diallo.jpg`, `don-huaman` photo `helene-saint-amand.jpg`). *(Images recyclées !)*

3. **`blacks-one-amazones` / `blacks-one-beyond-eve` (*Blacks One ‹ › Amazones*)**
   - **Affiches série** : Studio & Mock = `/assets/posters/Blacks One ‹ › Amazones.png` (`studioPillarsData.ts:51`, `mockData.ts:242`) ; `DUOS[2].coverImage` = `/assets/posters/blacks-one-amazones.png` (`mockData.ts:2675`).
   - **Côté A (`Blacks One`)** :
     - Vidéo : `/sample.mp4` (démo).
     - `PROTAGONISTS` : **1 profil** — `malik-diop` (photo `/assets/protagonists/malik-diop.jpg`, `mockData.ts:1647`), + `eff-bo-1` (`mockData.ts:262`).
     - `SERIES_AFFILIATION_TREES` (`mockData.ts:3603-3680`) : **4 personnes** (`malik-barou`/`Malik Diop`, `cheikh-slam` photo `koffi-tisserand.jpg`, `ousmane-beat` photo `kwame-mensah.jpg`, `ibrahima-guediawaye` photo `mahougnon-zounon.jpg`).
   - **Côté B (`Amazones` / `Beyond Eve`)** :
     - Vidéo : `/sample.mp4` (démo).
     - `PROTAGONISTS` : **1 profil** — `eleonore-vance` (`universeTag: 'Beyond Eve'`, photo `/assets/protagonists/eleonore-vance.jpg`, `mockData.ts:1730`), + `eff-be-2` (`mockData.ts:270`).
     - `SERIES_AFFILIATION_TREES` (`mockData.ts:3683-3760`) : **4 personnes** (`eleonore-saint-cloud`/`Éléonore Vance`, `fatou-bamba` photo `malik-diop.jpg`, `solene-marseille` photo `mawuna-medium.jpg`, `aicha-conteur` photo `pere-matthieu.jpg`).

4. **`fiat-luxe-builders` / `dixeat-fiat-luxe` (*Fiat Luxe ‹ › Builders*)**
   - **Affiches série** : Studio & Mock = `/assets/posters/Fiat Luxe ‹ › Builders.jpg` (`studioPillarsData.ts:91`, `mockData.ts:355`) ; `DUOS[3].coverImage` = `/assets/posters/fiat-luxe-builders.png` (`mockData.ts:2693`). **`effigies` absent** sur `DOCUMENTARIES[3]`.
   - **Côté A (`Fiat Luxe`)** :
     - Vidéo : `/sample.mp4` (démo).
     - `PROTAGONISTS` : **1 profil** — `helene-saint-amand` (`universeTag: 'Fiat Luxe'`, photo `/assets/protagonists/helene-saint-amand.jpg`, `mockData.ts:1896`).
     - `SERIES_AFFILIATION_TREES` (`mockData.ts:3835-3894`) : **3 personnes** (`helene-saint-amand` photo `senan-agossa.jpg`, `marc-antoine-sommelier` photo `sika-dossou.jpg`, `yasmine-parfumeuse` photo `tobi-ganvie.jpg`).
   - **Côté B (`Builders` — ou `Sweet Street` dans les données)** :
     - Vidéo : `/sample.mp4` (démo).
     - `PROTAGONISTS` : **0 profil réellement "Builder"** sur cet ID ! `mockData.ts:1813` rattache `chef-koffi` (`Chef Koffi Mensah`, photo `/assets/protagonists/chef-koffi.jpg`, `universeTag: 'Sweet Street'`) à `documentaryId: 'dixeat-fiat-luxe'`, et `DUOS[3]` l’utilise comme `protagonistB` ! *(Alors que `kwame-mensah`, l’éco-constructeur, est rattaché à `investors-builders`.)*
     - `SERIES_AFFILIATION_TREES` (`mockData.ts:3773-3832`) : **3 personnes `Sweet Street`** (`chef-koffi` photo `photographer-focus.jpg`, `roland-huile` photo `researcher-phd.jpg`, `felicite-epices` photo `sayri-quispe.jpg`).

5. **`roots-routes` / `investors-builders` (*Roots < > Routes*)**
   - **Affiches série** : Studio & Mock = `/assets/posters/Roots < > Routes.png` (`studioPillarsData.ts:83`, `mockData.ts:448`) ; `DUOS[4].coverImage` = `/assets/posters/roots-routes.jpg` (`mockData.ts:2711`).
   - **Côté A (`Roots` — ou `Investors` dans les données)** :
     - Vidéo : `/sample.mp4` (démo).
     - `PROTAGONISTS` : **1 profil** — `fatou-diallo` (`documentaryId: 'investors-builders'`, `universeTag: 'Investors'`, photo `/assets/duos/fatou-diallo.jpg`, `mockData.ts:1979`), + `eff-inv-1` (`mockData.ts:468`).
     - `SERIES_AFFILIATION_TREES` (`mockData.ts:3907-3945`) : **2 personnes `Investors`** (`fatou-diallo` photo `fatou-diallo.jpg`, `amadou-kane` photo `tobi-houndegla.jpg`).
   - **Côté B (`Routes` — ou `Builders` dans les données)** :
     - Vidéo : `/sample.mp4` (démo).
     - `PROTAGONISTS` : **1 profil** — `kwame-mensah` (`documentaryId: 'investors-builders'`, `universeTag: 'Builders'`, photo `/assets/duos/kwame-mensah.jpg`, `mockData.ts:2079`), + `eff-inv-2` (`mockData.ts:476`).
     - `SERIES_AFFILIATION_TREES` (`mockData.ts:3948-3986`) : **2 personnes `Builders`** (`kwame-mensah` photo `kwame-mensah.jpg`, `sena-houndete` photo `adjovi-blandine.jpg`).

6. **`baobab-bambou` / `other-eyes-sixth-sense` (*Baobabs ‹ › Bambous*)**
   - **Affiches série** : Studio & Mock = `/assets/posters/Baobabs ‹ › Bambous.jpg` (`studioPillarsData.ts:59`, `mockData.ts:563`) ; `DUOS[5].coverImage` & `questions[0].posterUrl` = `/assets/posters/baobab-bambou.jpg` (`mockData.ts:604, 2729`).
   - **Côté A (`Baobab` — ou `Other Sights` dans `PROTAGONISTS`/`DUOS`/Arbre)** :
     - Vidéo : `/sample.mp4` (démo).
     - `PROTAGONISTS` : **1 profil** — `codjo-blind` (Pascal Cossy, `universeTag: 'Other Sights'`, photo `/assets/duos/codjo-blind.jpg`, `mockData.ts:2179`).
     - `effigies` : `eff-baobab` (`Dossou Zounon`, photo `/assets/duos/codjo-blind.jpg`, `mockData.ts:583`) — profil qui n’existe pas dans `PROTAGONISTS` sous cet ID.
     - `SERIES_AFFILIATION_TREES` (`mockData.ts:4000-4059`) : **3 personnes `Other Sights`** (`codjo-blind`/`Pascal Cossi`, `cecile-artisan` photo `adjovi-blandine.jpg`, `norbert-menuisier` photo `kwame-mensah.jpg`).
   - **Côté B (`Bambou` — ou `Third Eye` dans `PROTAGONISTS`/`DUOS`/Arbre)** :
     - Vidéo : `/sample.mp4` (démo).
     - `PROTAGONISTS` : **1 profil** — `mawuna-medium` (Mawuna Houénou, `universeTag: 'Third Eye'`, photo `/assets/duos/mawuna-medium.jpg`, `mockData.ts:2293`).
     - `effigies` : `eff-bambou` (`Sénan Agossa`, photo `/assets/protagonists/senan-agossa.jpg`, `mockData.ts:591`) — qui n’a pas d’entrée propre dans `PROTAGONISTS` !
     - `SERIES_AFFILIATION_TREES` (`mockData.ts:4062-4100`) : **2 personnes `Third Eye`** (`mawuna-medium`, `na-agbessi` photo `mahougnon_esu_portrait_1791701582891.jpg`).

7. **`coaching-phd` / `builders-seekers` (*Coaching ‹ › PhD*)**
   - **Affiches série** : Studio = `/assets/posters/Coaching ‹ › PhD.jpg` (`studioPillarsData.ts:67`) ; Mock & `DUOS[6].coverImage` = `/assets/posters/coaching-phd.png` (`mockData.ts:626, 2811`).
   - **Côté A (`Coaching`)** :
     - Vidéo : `/sample.mp4` (démo).
     - `PROTAGONISTS` : `coach-marc` (Marc Valmont, `mockData.ts:2393`, photo `/assets/duos/coach-office.jpg`, **sans `documentaryId`**!), repris inline dans `DUOS[6].protagonistA` (`mockData.ts:2740`). *(Note : `athlete-lagat` `mockData.ts:2462`, photo `/assets/duos/athlete-hurdle.jpg`, est resté juste après lui sans `documentaryId` avec `universeTag: 'Sans Limites'`.)*
     - `effigies` : `eff-coach-marc` (`Coach Marc`, photo `/assets/duos/coach-office.jpg`, `mockData.ts:646`).
     - `SERIES_AFFILIATION_TREES` : **0 personne (arbre absent)**.
   - **Côté B (`PhD`)** :
     - Vidéo : `/sample.mp4` (démo).
     - `PROTAGONISTS` : `researcher-eleonore` (Dre. Éléonore Kaboré, `mockData.ts:2570`, photo `/assets/duos/researcher-phd.jpg`, **sans `documentaryId`**!), reprise inline dans `DUOS[6].protagonistB` (`mockData.ts:2773`).
     - `effigies` : `eff-dr-eleonore` (`mockData.ts:654`).
     - `SERIES_AFFILIATION_TREES` : **0 personne (arbre absent)**.

8. **`pictures-words` / `focus-phd` (*Pictures ‹ › Words*)**
   - **Affiches série** : Studio = `/assets/posters/Pictures ‹ › Words.jpg` (`studioPillarsData.ts:99`) ; Mock & `DUOS[7].coverImage` = `/assets/posters/pictures-words.jpg` (`mockData.ts:702, 2913`).
   - **Côté A (`Pictures`)** :
     - Vidéo : `/sample.mp4` (démo).
     - `PROTAGONISTS` : `photographer-clara` (Clara Valmont, `mockData.ts:2516`, photo `/assets/duos/photographer-focus.jpg`, **sans `documentaryId`**, et `universeTag: 'Focus'`), reprise inline dans `DUOS[7].protagonistA` avec `universeTag: 'Pictures'` (`mockData.ts:2856`).
     - `effigies` : `eff-clara-focus` (`mockData.ts:722`).
     - `SERIES_AFFILIATION_TREES` : **0 personne (arbre absent)**.
   - **Côté B (`Words`)** :
     - Vidéo : `/sample.mp4` (démo).
     - `PROTAGONISTS` : **0 profil** dans `PROTAGONISTS` ! `poet-armel` (Armel Hounkpatin, photo `/assets/images/fagnon_agronome_1792933698985.jpg`) existe **uniquement inline** dans `DUOS[7].protagonistB` (`mockData.ts:2875-2907`) et dans `DOCUMENTARIES[7].effigies[1]` (`eff-armel-words`, `mockData.ts:730`).
     - `SERIES_AFFILIATION_TREES` : **0 personne (arbre absent)**.

---

## 4. Parcours Studio actuel (pas à pas)

Composants impliqués : `src/components/SubmitStoryScreen.tsx` (lignes 1–2102) et `src/components/RequestVideographerScreen.tsx` (lignes 1–505).

### Étape 1 : Ouverture du Studio
- Depuis `BottomMenu` (`Studio` -> `onNavigate({ type: 'submit_story' })`), `SubmitStoryScreen` monte.
- Avec `SHOW_FOCUS = false` (`src/config/flags.ts:5`), `VISIBLE_STUDIO_PILLARS` ne contient que `['duos']` (`SubmitStoryScreen.tsx:30-36`), et l’état `activePillar` est **initialisé directement sur `DEFAULT_DIALOGUE_PILLAR`** (`id: 'duos'`, `ligne 424-426`).
- Conséquence : L’utilisateur arrive directement au **Niveau 1 (`isLevel1 === true`)**, devant le **carrousel 3D des 8 séries Duocumentaires** (`SubmitStoryScreen.tsx:1685-2025`), sans barre d’en-tête (`ligne 1175` masque le fil d’Ariane quand `isLevel1 && !SHOW_FOCUS`) et sans flèches latérales (`SHOW_CAROUSEL_ARROWS = false`, `flags.ts:14`).

### Étape 2 : Navigation et choix d’une série
- L’utilisateur fait défiler le carrousel 3D au toucher/souris (`onTouchStart/Move/End`, `onMouseDown/Move/Up`, `lignes 703-783`), au clavier (`ArrowLeft` / `ArrowRight`, `lignes 681-684`), ou en cliquant sur une carte latérale (`setCurrentIndex(idx)`, `ligne 1789`).
- Sur chaque carte (`lignes 1806-2006`) :
  - Haut droite : bouton Télé (`setPlayingCardId`) qui lance **`item.videoUrl` = `/sample.mp4`** sur la carte, plus bouton Mute (`isMuted`, `true` par défaut).
  - Bas gauche : bouton Papyrus (`Scroll`) ouvrant la modale Synopsis (`synopsisModalItem`, `lignes 2030-2081`) avec `subtitle`, `question` et `Durée : 2 minutes 56 maximum` (`getCardDurationLabel`, `lignes 166-209`).
  - Bas droite (ou clic sur la carte centrale) : bouton `Choisir` -> appelle `handleSelectFinalChoice(item)` (`lignes 578-583`), qui renseigne l’état **`selectedFinalChoice`** (un `StudioPillarItem` de `studioPillarsData.ts`, donc avec l’ID Studio).

### Étape 3 : Écran face-à-face « Télécharger sa vidéo » vs « Choisir un expert »
- Dès que `selectedFinalChoice` est non nul (`lignes 1297-1479`), deux cartes 9:16 s’affichent côte à côte :
  1. **Carte 1 — « Télécharger sa vidéo »** (`lignes 1303-1387`) : affiche `/assets/images/selfie_video_story.jpg` (ou `/sample.mp4` en aperçu via `duoPreviewVideo === 'upload'`). Le bouton `Choisir` passe `isUploadScreenActive` à `true` (`ligne 1378`).
  2. **Carte 2 — « Choisir un expert »** (`lignes 1389-1475`) : affiche `/assets/images/pro_shoot_story.jpg` (ou `/sample.mp4` via `duoPreviewVideo === 'expert'`). Le bouton `Choisir` appelle `onNavigate({ type: 'request_videographer', returnPillarId, returnCastingCategoryId, returnFinalChoiceId })` (`lignes 1463-1468`).
- **Si l’utilisateur va sur « Choisir un expert » (`RequestVideographerScreen.tsx`)** :
  - Il peut seulement feuilleter les vidéastes de `VIDEOGRAPHERS` (`mockData.ts:2947+`), lire leur `/sample.mp4`, ouvrir la modale fiche technique (`isSpecsModalOpen`), ouvrir leur portrait ou partager.
  - **Aucun bouton de sélection, réservation ou choix de côté n’existe** dans `RequestVideographerScreen.tsx` (`lignes 202-503`). Seul `Retour` ramène dans `SubmitStoryScreen` avec restauration de `selectedFinalChoice` (`SubmitStoryScreen.tsx:497-528`).

### Étape 4 : Formulaire « Télécharger sa vidéo » et choix du côté
- Affiché en page complète quand `isUploadScreenActive && selectedFinalChoice` (`lignes 923-1161`).
- **C’est UNIQUEMENT ici que le côté (A ou B) est choisi** (`lignes 967-1015`) :
  - Détecté via `isMirrorTheme = activePillar?.id === 'duos' || ...` (`ligne 924`).
  - `getSeriesParts(selectedFinalChoice)` génère les libellés des 2 boutons radio (`part-a` vs `part-b`, `lignes 975-1012`).
  - **État initial** : `selectedPartId` est pré-initialisé à **`'part-a'`** dès le montage de `SubmitStoryScreen` (`ligne 449`) et n’est jamais réinitialisé lors d’un changement de série !
- **Sélection du fichier vidéo** (`lignes 1055-1092`) :
  - `<input type="file" accept="video/mp4,video/quicktime,video/webm" onChange={(e) => { if (e.target.files && e.target.files[0]) setSelectedFileName(e.target.files[0].name); }} />` (`lignes 1056-1063`).
  - **Aucune lecture du `File`**, aucun `URL.createObjectURL`, aucun `FileReader`, aucun `FormData` ni upload réseau. Seul le **nom du fichier** est conservé en mémoire !
- **Crédits optionnels `@mention`** (`lignes 1094-1129`) :
  - 3 champs (`Réalisation`, `Protagonistes de la vidéo`, `Post-production`) piochant exclusivement dans la liste statique `PLATFORM_MEMBERS` (`lignes 66-96`, 24 personnes factices).
- **Envoi (`handleSubmitVideo`, `lignes 874-918`)** :
  - Vérifie uniquement que `selectedFileName` est non nul (et `selectedPartId` si `isMirrorTheme`, toujours vrai car défaut `'part-a'`).
  - Appelle `saveUserVideoSubmission(...)` (`src/utils/userVideoService.ts:66-81`) avec **`videoUrl: '/sample.mp4'`** en dur (`ligne 898`), `universe: activePillar?.id || 'studio'` (donc `'duos'`, **sans `seriesId`**), `partId: selectedPartId`, et le nom de la série noyé uniquement dans le texte `synopsis`.
  - Ferme le formulaire et affiche le toast de confirmation (`lignes 2084-2089`).

### Récapitulatif Réel vs Simulé & Vérifications sur la vidéo
- **Réel** : Navigation dans les 8 cartes, choix du côté `'part-a' | 'part-b'`, saisie de crédits depuis `PLATFORM_MEMBERS`, création d’une entrée JSON métadonnées dans `localStorage['yonywood_user_video_submissions']` lisible ensuite dans `SettingsScreen` (onglet Mes vidéos) et modérable localement dans `EditorialBackOfficeScreen`.
- **Simulé / Non implémenté** :
  - Aucun téléversement de fichier vidéo (le binaire choisi dans l’OS est jeté ; `videoUrl` vaut toujours `'/sample.mp4'`).
  - Aucun envoi backend (`server.ts` n’a aucune route POST pour les vidéos) ni Firestore (`submitVideoToForest` dans `src/services/firestoreService.ts:169` n’est jamais appelé depuis Studio).
  - Réservation d’un vidéaste expert inexistante dans `RequestVideographerScreen.tsx`.
- **Vérifications techniques sur la vidéo** : **ZÉRO vérification** sur la durée (alors que l’UI indique 2 min 56 max), **ZÉRO vérification** sur la taille en octets (seul un texte passif indique `"MP4, MOV (9:16 recommandé jusqu'à 500 Mo)"`, `ligne 1084`), **ZÉRO vérification** sur le ratio 9:16 ou le codec réel (uniquement `accept="video/mp4,video/quicktime,video/webm"` sur l’`<input>`, `ligne 1058`).

---

## 5. Stockage des publications vs ce que lit `DuoFeedScreen`

### 5.1 Toutes les clés / collections de stockage identifiées

| Support / Clé | Qui écrit ? | Qui lit ? | Contenu réel |
|---|---|---|---|
| `localStorage['yonywood_user_video_submissions']` (`src/utils/userVideoService.ts:4`) | `SubmitStoryScreen.tsx:890` (`saveUserVideoSubmission`), `EditorialBackOfficeScreen.tsx:62` (`updateVideoSubmissionStatus`) | `EditorialBackOfficeScreen.tsx:35,38,53`, `SettingsScreen.tsx:93,123` | Métadonnées des vidéos soumises (`videoUrl: '/sample.mp4'`, `universe: 'duos'`, `partId`, `status`). **`DuoFeedScreen` NE le lit PAS.** |
| Firestore `submitted_videos` + `localStorage['yonywood_local_submitted_videos']` (`src/services/firestoreService.ts:169-349`) | `submitVideoToForest` (défini mais **jamais appelé** dans le Studio) | `fetchSubmittedVideos`, `fetchUserSubmittedVideos` | Code prévu pour soumissions créateurs (données demo `DEFAULT_CREATOR_VIDEOS` avec `/sample.mp4`). **`DuoFeedScreen` NE le lit PAS.** |
| `localStorage['yonywood_custom_series']` (`src/data/mockData.ts:775`) | `saveCustomDocumentaries` (`mockData.ts:857`), auto-migration `getCustomDocumentaries` (`ligne 826`) | `DOCUMENTARIES` (`mockData.ts:855`) | Cache local des 8 `DOCUMENTARIES` (avec migration forcée vers `INITIAL_DOCUMENTARIES`). |
| `localStorage['yonywood_selected_series']` (`src/App.tsx:205, 233`) | `Navbar.tsx` et `SettingsScreen.tsx` via `onUpdateDocFilter` | `App.tsx:205` -> passé en `allowedSeriesIds` à `DuoFeedScreen` | Tableau d’IDs canoniques de séries cochées dans le filtre. |
| `localStorage['yonywood_eval_<duoId>']` (`src/components/ResonanceFaceToFaceCard.tsx:88, 158`) | `ResonanceFaceToFaceCard` (sliders) | `ResonanceFaceToFaceCard` | Notes utilisateur locales (`resonance`, `authenticity`, `impact`). |

### 5.2 Ce que `DuoFeedScreen` lit réellement pour afficher un duo

Dans `DuoFeedScreen.tsx:73-90` :
1. Exécute `Promise.all([apiService.getDuos(), apiService.getSeries()])` (`src/services/api.ts:38-61`).
2. `apiService.getDuos()` appelle `GET /api/duos` (`server.ts:157-167`), qui retourne le tableau **statique** `DUOS` importé de `src/data/mockData.ts:405` — et si l’API est absente/en erreur, `apiService` retourne directement `DUOS` de `src/data/mockData.ts`.
3. `apiService.getSeries()` fait de même sur `GET /api/series` -> `DOCUMENTARIES` (`src/data/mockData.ts`).
4. `DuoFeedScreen.tsx:100-106` filtre ensuite ces 8 duos statiques par `allowedSeriesIds` et par `getBlockedVideoIds()`, puis `feedItems` (`lignes 110-135`) intercale des cartes statiques `FOUR_FACES_PUBLICATIONS` (`src/data/fourFacesFeedData.ts:3`) tous les 2 duos.

**Conclusion nette** : Ce qu’un utilisateur envoie depuis Studio va dans `localStorage['yonywood_user_video_submissions']` et reste **complètement invisible dans `DuoFeedScreen`**, même après approbation dans `EditorialBackOfficeScreen`.

---

## 6. Fonctionnement détaillé de `DuoFeedScreen` (Volets A, Miroir, B & Appariement)

### 6.1 Ce qu’affichent Volet A, Miroir et Volet B

Pour une publication de type `'duo'`, `DuoFeedScreen.tsx:619-861` rend un carrousel 3D horizontal à 3 cartes (`idx = 0, 1, 2`), centré par défaut sur **`slideIndex = 1`** (`lignes 51, 151`) :

- **`idx = 0` — Volet A (`protagonistA`)** (`lignes 699-857`) :
  - **En-tête** : badge titre de la série (`formatFirstLetterOnly(currentDuo.documentaryTitle)`) en haut à gauche + bouton Télé (`setIsPlaying`) en haut à droite.
  - **Fond média** : `protagonistA.photoUrl` au repos ; au clic / lecture, lit `<video src={videoUrlA}>` où `videoUrlA = getValidVideo(pA?.videoAvatarUrl || docTeaser)` (`ligne 490`). Comme aucun `Protagonist` n’a de `videoAvatarUrl` distinct et que tous les `docTeaser` valent `'/sample.mp4'`, **Volet A joue `/sample.mp4` pour les 8 séries**.
  - **Colonne droite** : bouton Mute (en lecture), vignette du partenaire B (`goToSlide(2)`), icône Portrait (`onNavigate({ type: 'profile', protagonistId: pA.id })`), icône Partage (`VideoCardShareModal`).
  - **Bas gauche** : prénom de A + barre de progression vidéo (visible uniquement pendant la lecture).
- **`idx = 1` — Carte Miroir (`ResonanceFaceToFaceCard`, `src/components/ResonanceFaceToFaceCard.tsx:75-424`)** :
  - Fond terracotta dégradé.
  - **Haut** : badge titre de série centré + **face-à-face des deux portraits** (`protagonistA.photoUrl` et prénom à gauche, symbole `‹ ›`, `protagonistB.photoUrl` et prénom à droite). Cliquer sur un portrait bascule directement vers sa vidéo (`onNavigateToSlide(0)` ou `(2)`, `lignes 200, 228`).
  - **Bas (boîte blanche)** : deux sous-onglets (`lignes 267-303`) :
    - `Question` (actif par défaut) : affiche `duoQuestion` (`currentDuo.centralQuestion`) avec animation progressive lettre par lettre (`25 ms/caractère`, `lignes 138-146`).
    - `Évaluation` : 3 curseurs (`Résonance`, `Authenticité`, `Impact`, valeurs initiales `50% / 50%`) sauvegardés localement sous `yonywood_eval_<duoId>`.
- **`idx = 2` — Volet B (`protagonistB`)** (`lignes 699-857`) :
  - Même structure miroir que Volet A, avec `protagonistB.photoUrl`, miniature du partenaire A (`goToSlide(0)`), lien portrait `pB.id`, et vidéo `videoUrlB = getValidVideo(pB?.videoAvatarUrl || docTeaser)` (**`/sample.mp4`** partout).

### 6.2 Comment on change de duo et comment se fait l’appariement

- **Changement de duo (navigation verticale)** :
  - Swipe vertical (`Math.abs(deltaY) > Math.abs(deltaX)` sur tactile `lignes 375-381`, souris `lignes 437-443`) ou molette verticale (`handleWheel`, `lignes 256-262`) appelle `handleNextPublication()` / `handlePrevPublication()` (`lignes 154-168`), bouclant modulo `feedItems.length`.
  - En arrivant aux bornes horizontales (droite depuis `idx=2` ou gauche depuis `idx=0`), `nextSlide()` / `prevSlide()` (`lignes 176-201`) fait également avancer/reculer à la publication suivante/précédente.
- **Appariement d’un duo** :
  - Chaque duo est **apparié en dur 1-à-1** dans `DUOS` (`mockData.ts:2625-2938`) : 1 `protagonistA` spécifique face à 1 `protagonistB` spécifique (1 seul duo par série, soit 8 duos au total).
  - Il n’y a **aucun** tirage au sort, aucun algorithme d’appariement à partir de plusieurs profils du côté A et du côté B, et aucune prise en compte des soumissions Studio.

---

## 7. Navigation dans `App.tsx` et cohérence avec `BottomMenu.tsx`

- **Boutons visibles dans `BottomMenu.tsx`** (avec `SHOW_FOCUS = false` et `SHOW_PORTRAIT_IN_BAR = false` dans `src/config/flags.ts:5,8`, filtrés aux lignes `93-97`) :
  1. **`Studio`** (`{ type: 'submit_story' }`, `BottomMenu.tsx:41-50`)
  2. **`Duocumentaires`** (`{ type: 'duo_feed' }`, `BottomMenu.tsx:61-70`)
  3. **`Coproductions`** (`{ type: 'marketplace' }`, `BottomMenu.tsx:81-90`)
- **`PRIMARY_TABS` dans `App.tsx:332-338`** :
  - `[{ type: 'submit_story' }, { type: 'duo_feed' }, { type: 'marketplace' }]` (car les deux flags optionnels sont à `false`).
- **Constat (sans modification)** :
  1. **L’ordre correspond exactement** entre `PRIMARY_TABS` et les boutons de `BottomMenu.tsx` : **Studio -> Duocumentaires -> Coproductions**.
  2. **Cependant, le swipe horizontal global entre onglets (`handleGlobalTouchStart` / `handleGlobalTouchEnd`, `App.tsx:392-434`) est désactivé sur les 3 onglets principaux** : les lignes `394-400` et `409-415` font un `return` immédiat si `currentScreen.type` vaut `'submit_story'`, `'duo_feed'`, `'focus'`, `'enterprise'` ou `'marketplace'`. De fait, aucun swipe horizontal ne permet aujourd’hui de passer d’un onglet de `BottomMenu` à un autre ; `handleGlobalTouchEnd` ne peut s’exécuter que depuis certains sous-écrans non exclus (`request_videographer`, `landing`, `home`, `matrix_view`).

---

## 8. Séries incomplètes, incohérences relevées et manques pour le lancement communautaire

### 8.1 Séries incomplètes, incohérences et côtés manquants

1. **Deux séries absentes de `SERIES_AFFILIATION_TREES`** : `coaching-phd` / `builders-seekers` (*Coaching ‹ › PhD*) et `pictures-words` / `focus-phd` (*Pictures ‹ › Words*) n’ont aucun arbre ni liste communautaire (`mockData.ts:3229-4104`).
2. **Deux séries sans `effigies` dans `DOCUMENTARIES`** : `finagnon-qosqorico` (*Benin ‹ › Le Monde*, `mockData.ts:137-233`) et `dixeat-fiat-luxe` (*Fiat Luxe ‹ › Builders*, `mockData.ts:348-439`) n’ont pas de tableau `effigies`.
3. **Déséquilibre sur les `questions[]` des séries** : 5 séries ont 5 questions, `builders-seekers` et `focus-phd` n’en ont que **2** (`mockData.ts:662-689, 738-765`), et `other-eyes-sixth-sense` (*Baobabs ‹ › Bambous*) n’en a qu’**1 seule** (`mockData.ts:599-613`).
4. **7 IDs sur 8 désynchronisés entre Studio et le reste de l’app** : `SubmitStoryScreen` utilise `studioPillarsData.ts` tandis que `SettingsScreen`, `Navbar`, `DUOS` et `server.ts` utilisent les anciens IDs de `DOCUMENTARIES`. `DUOS[4]` porte même `'roots-routes'` (ID Studio) au lieu de `'investors-builders'` (`mockData.ts:2701`), forçant un patch manuel dans `DuoFeedScreen.tsx:102` et empêchant `getSeriesParts` (`SubmitStoryScreen.tsx:110`) de retrouver `DOCUMENTARIES` pour 7 séries sur 8.
5. **Séries à contenu thématique hybride / incohérent (anciens vs nouveaux concepts)** :
   - **Serie *Fiat Luxe ‹ › Builders* (`dixeat-fiat-luxe`)** : pas de véritable profil "Builder" rattaché ; `DUOS[3]` (`mockData.ts:2681-2697`) met en scène `chef-koffi` (`Sweet Street`, cuisine de rue à Dantokpa) face à `helene-saint-amand` en lui prêtant une citation d’architecte sur la « voûte en béton », ses `questions[]` parlent encore de cuisine, et l’arbre s’appelle `Fiat Luxe < > Sweet Street`.
   - **Série *Baobabs ‹ › Bambous* (`other-eyes-sixth-sense`)** : `DUOS[5]` (`mockData.ts:2717-2733`) affiche `codjo-blind` et `mawuna-medium` (thème *Other Eyes / Third Eye*), `DOCUMENTARIES[5].effigies` cite d’autres noms (`Dossou Zounon` et `Sénan Agossa`, dont le premier est absent de `PROTAGONISTS`), et l’arbre est resté `Other Sights < > Third Eye`.
   - **Série *Roots < > Routes* (`investors-builders`)** : le titre et les `universes` parlent de `Roots` et `Routes`, mais `DOCUMENTARIES[4].effigies`, `DOCUMENTARIES[4].questions`, `PROTAGONISTS` (`fatou-diallo`, `kwame-mensah`) et l’arbre `Diasporas < > Makers` parlent encore d’« Investisseur » et de « Bâtisseur ».
   - **Série *Pictures ‹ › Words* (`focus-phd`)** : aucun profil pour le côté **Words** dans `PROTAGONISTS` (`poet-armel` n’existe qu’en inline dans `DUOS[7].protagonistB` et dans `effigies`), et `photographer-clara` porte encore `universeTag: 'Focus'` sans `documentaryId`.
   - **Série *Coaching ‹ › PhD* (`builders-seekers`)** : ses 2 protagonistes (`coach-marc`, `researcher-eleonore`) n’ont pas de `documentaryId` dans `PROTAGONISTS`.
6. **Tags `universeTag` obsolètes** sur les protagonistes : `Finagnon` / `Qosqorico` (`tobi-houndegla`, `sayri-quispe`, `koffi-tisserand`, `amara-tisserande`), `Beyond Eve` (`eleonore-vance`), `Sweet Street` (`chef-koffi`), `Investors` / `Builders` (`fatou-diallo`, `kwame-mensah`), `Other Sights` / `Third Eye` (`codjo-blind`, `mawuna-medium`), `Focus` (`photographer-clara`), `Sans Limites` (`athlete-lagat`).
7. **Photos recyclées dans `SERIES_AFFILIATION_TREES`** : de nombreux nœuds de l’arbre empruntent les `.jpg` d’autres personnages (ex. `amara-tisserande` -> `dah-zounon.jpg`, `fatou-bamba` -> `malik-diop.jpg`, `norbert-menuisier` -> `kwame-mensah.jpg`).
8. **Vidéos factices uniques** : seul `/sample.mp4` existe dans `public/`.

### 8.2 Ce qui manque pour le parcours complet (Série -> Côté A/B -> Vraie vidéo -> Duos communautaires)

Pour passer du prototype actuel à un lancement communautaire fonctionnel (« choisir une série -> choisir un côté A ou B -> déposer sa vraie vidéo -> alimenter les duos de la communauté »), il manque les maillons suivants :

1. **Unification canonique des IDs, titres, côtés et questions des 8 séries** : un seul référentiel partagé entre `studioPillarsData.ts`, `mockData.ts`, `seriesTeamData.ts`, `SettingsScreen` et `App.tsx`, avec suppression des contenus hybrides (*Sweet Street*, *Investors*, *Other Sights/Third Eye*, *Beyond Eve*) sur les séries renommées, et ajout de profils réels/cohérents pour chaque côté (notamment côté *Builders* dans *Fiat Luxe ‹ › Builders*, côté *Words* dans *Pictures ‹ › Words*, et côté *Baobab/Bambou*).
2. **Sélection explicite et traçable du côté (`part-a` / `part-b` ou `sideId`) dès le parcours Studio** : aujourd’hui `selectedPartId` est figé par défaut sur `'part-a'` dans le formulaire upload (jamais demandé avant ni en cas de passage par « Choisir un expert »), et `saveUserVideoSubmission` **n’enregistre même pas d’identifiant `seriesId`** (il met `universe: 'duos'` !). Il faut stocker `{ seriesId, sideId, sideName, questionId }` de manière structurée et obligatoire.
3. **Vrai pipeline d’upload et stockage vidéo** :
   - Lire le `File` réel, valider côté client (poids max, durée max `2m56` via `<video>` `loadedmetadata`, format/ratio) puis téléverser vers un stockage objet (ex. Firebase Storage / S3 / endpoint upload) pour obtenir une vraie `videoUrl` persistante (et éventuellement une miniature) au lieu de `'/sample.mp4'`.
4. **Persistance partagée côté serveur / base de données (Firestore ou API réelle)** :
   - Brancher la soumission Studio sur une vraie collection (`submitted_videos` ou endpoint `POST /api/submissions` persistant — aujourd’hui `localStorage` est isolé au navigateur d’un seul utilisateur et `server.ts` est 100 % en mémoire statique).
5. **Passage de la modération vers la publication de duos communautaires (`EditorialBackOffice` -> `DuoFeedScreen`)** :
   - Permettre qu’une vidéo approuvée d’un membre sur un `(seriesId, sideId)` devienne une véritable **contribution communautaire rattachée à ce côté**.
   - Remplacer la dépendance exclusive aux 8 paires 1-à-1 statiques `DUOS` dans `DuoFeedScreen` par une source dynamique (Firestore / API) capable d’**apparier ou de faire naviguer plusieurs membres du côté A face à plusieurs membres du côté B** sur une même série et une même question.
6. **Finalisation du parcours « Choisir un expert »** (`RequestVideographerScreen.tsx`) : aujourd’hui cet écran n’a ni transmission du `(seriesId, sideId)` choisi, ni action de mise en relation / réservation.
