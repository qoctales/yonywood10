# Rapport de compression des images utilisées

> Compression exécutée en place sur `public/assets/` à partir de `../outils-compression/` (`sharp`), après copie de sécurité vérifiée dans `archive/originaux_avant_compression/` (173/173 fichiers). Aucun fichier de `src/`, `package.json`, `package-lock.json`, `index.html`, `server.ts` ou `vite.config.ts` n’a été modifié.

## 1. Synthèse générale

- **Fichiers traités** : **173** (170 compressés, 3 conservés tels quels)
- **Poids total avant** : **176 396 887 octets (168,23 Mio)**
- **Poids total après** : **40 155 346 octets (38,30 Mio)**
- **Gain total** : **-136 241 541 octets (-129,93 Mio / -77,24 %)**
- **Vérification noms & extensions** : **173 / 173 identiques** à `archive/originaux_avant_compression/` (aucune conversion WebP, aucun renommage)
- **Vérification intégrité (`sharp.metadata()` + `sharp.stats()`)** : **173 / 173 fichiers valides et décodables sans corruption**
- **Build & typage après compression** : `npx tsc --noEmit` = OK (0 erreur) ; `npm run build` = OK
  - `dist/` avant compression : **275 120 789 octets (262,38 Mio / 263M)**
  - `dist/` après compression : **137 878 345 octets (131,49 Mio / 132M)** (**-137 242 444 octets / -49,88 %**)
  - Précache PWA (`vite-plugin-pwa v1.3.0`) : **71 entries (2265.63 KiB)** (inchangé car aucune des 173 images de `public/assets/` n’est dans le précache SW)

## 2. Totaux par dossier

| Dossier | Fichiers | Compressés / Conservés | Poids avant | Poids après | Gain | % |
|---|---:|---:|---:|---:|---:|---:|
| `public/assets/duos/` | 18 | 18 / 0 | 16,97 Mio | 2,85 Mio | -14,12 Mio | -83,18 % |
| `public/assets/posters/` | 25 | 23 / 2 | 24,76 Mio | 11,60 Mio | -13,16 Mio | -53,14 % |
| `public/assets/protagonists/` | 24 | 24 / 0 | 22,60 Mio | 3,90 Mio | -18,71 Mio | -82,76 % |
| `public/assets/directions/` | 55 | 55 / 0 | 53,22 Mio | 8,86 Mio | -44,37 Mio | -83,36 % |
| `public/assets/doors/` | 9 | 9 / 0 | 8,08 Mio | 1,29 Mio | -6,79 Mio | -84,05 % |
| `public/assets/images/` | 41 | 40 / 1 | 39,05 Mio | 7,32 Mio | -31,74 Mio | -81,27 % |
| `public/assets/Onboardings/` | 1 | 1 / 0 | 3,54 Mio | 2,48 Mio | -1,06 Mio | -29,91 % |
| **Total général** | **173** | **170 / 3** | **168,23 Mio** | **38,30 Mio** | **-129,93 Mio** | **-77,24 %** |

## 3. Fichiers conservés tels quels (et pourquoi)

| Fichier | Poids original | Poids L9 testé | Raison exacte |
|---|---:|---:|---|
| `public/assets/posters/Vodun Rays ‹ › Autre Foi.png` | 2,54 Mio | — | PNG compressionLevel=9 plus lourd (+3.6 %) |
| `public/assets/posters/Other Eyes < > Third Eye.png` | 2,00 Mio | — | PNG compressionLevel=9 plus lourd (+17.0 %) |
| `public/assets/images/pillar_casting_phoenix.png` | 960,42 Kio | — | PNG compressionLevel=9 plus lourd (+21.5 %) |

## 4. Cas douteux signalés — PNG > 600 Ko et option `palette: true` (non appliquée)

Les 5 PNG réels encore au-dessus de 600 Ko (ainsi que `pillar_casting_phoenix.png` avec canal alpha conservé) sont des illustrations/affiches riches en **dégradés visibles** (ciels de coucher de soleil, halos lumineux, nébuleuse, carnations). Conformément à la règle (*« garde ce résultat uniquement s’il fait gagner au moins 40 % ET que le fichier n’a pas de dégradés visibles évidents (signale-moi les cas douteux au lieu de décider) »*), `palette: true` n’a **pas** été appliqué :

| Fichier | Statut appliqué | Poids actuel | Poids candidat `palette: true, q=90` | Gain supplémentaire | Observation visuelle |
|---|---|---:|---:|---:|---|
| `public/assets/Onboardings/Voyage.png` | compressé (PNG lossless compressionLevel=9) | 2,48 Mio | 593,51 Kio | -76,6 % | Dégradés visibles évidents (ciel/halo/peau) — quantification 256 couleurs non appliquée automatiquement |
| `public/assets/posters/Blacks One ‹ › Amazones.png` | compressé (PNG lossless compressionLevel=9) | 2,17 Mio | 460,09 Kio | -79,2 % | Dégradés visibles évidents (ciel/halo/peau) — quantification 256 couleurs non appliquée automatiquement |
| `public/assets/posters/Roots < > Routes.png` | compressé (PNG lossless compressionLevel=9) | 2,27 Mio | 480,19 Kio | -79,3 % | Dégradés visibles évidents (ciel/halo/peau) — quantification 256 couleurs non appliquée automatiquement |
| `public/assets/posters/Vodun Rays ‹ › Autre Foi.png` | conservé (PNG compressionLevel=9 plus lourd (+3.6 %)) | 2,54 Mio | 521,37 Kio | -79,9 % | Dégradés visibles évidents (ciel/halo/peau) — quantification 256 couleurs non appliquée automatiquement |
| `public/assets/posters/Other Eyes < > Third Eye.png` | conservé (PNG compressionLevel=9 plus lourd (+17.0 %)) | 2,00 Mio | 572,27 Kio | -72,1 % | Dégradés visibles évidents (ciel/halo/peau) — quantification 256 couleurs non appliquée automatiquement |
| `public/assets/images/pillar_casting_phoenix.png` | conservé (PNG compressionLevel=9 plus lourd (+21.5 %)) | 960,42 Kio | 231,93 Kio | -75,9 % | Dégradés visibles évidents (ciel/halo/peau) — quantification 256 couleurs non appliquée automatiquement |

## 5. Note technique sur 7 fichiers `.png` déjà encodés en JPEG en interne

L’inspection par `sharp.metadata()` a révélé que **7 fichiers** nommés `.png` dans `public/assets/posters/` contenaient déjà un flux binaire **JPEG** (aucune transparence, 768 × 1376 px). Afin de respecter strictement *« Pas de conversion de format »* tout en conservant exactement leur nom et extension `.png`, ils ont été récompressés avec leur format natif (`mozjpeg`, qualité 78, progressif), réduisant chacun d’environ **86 %** (`~895 Kio → ~120 Kio`) au lieu de les convertir en PNG (~2,5 Mio) :

- `public/assets/posters/Esu < > Jesus.png` : 899,75 Kio → 125,49 Kio (-86,1 %)
- `public/assets/posters/vodun-autre-foi.png` : 899,75 Kio → 125,49 Kio (-86,1 %)
- `public/assets/posters/Blacks One < > Beyond Eve.png` : 874,55 Kio → 119,50 Kio (-86,3 %)
- `public/assets/posters/blacks-one-amazones.png` : 874,55 Kio → 119,50 Kio (-86,3 %)
- `public/assets/posters/fiat-luxe-builders.png` : 837,01 Kio → 113,45 Kio (-86,4 %)
- `public/assets/posters/Builders < > Seekers.png` : 795,30 Kio → 103,01 Kio (-87,0 %)
- `public/assets/posters/coaching-phd.png` : 795,30 Kio → 103,01 Kio (-87,0 %)

## 6. Détail complet des 173 fichiers

| # | Fichier | Poids avant | Poids après | Dimensions avant | Dimensions après | Gain | Statut |
|---:|---|---:|---:|---|---|---:|---|
| 1 | `public/assets/Onboardings/Voyage.png` | 3,54 Mio | 2,48 Mio | 941×1672 | 720×1280 | -29,9 % (-1,06 Mio) | compressé |
| 2 | `public/assets/posters/Blacks One ‹ › Amazones.png` | 2,58 Mio | 2,17 Mio | 937×1678 | 715×1280 | -16,2 % (-427,72 Kio) | compressé |
| 3 | `public/assets/posters/Roots < > Routes.png` | 2,55 Mio | 2,27 Mio | 940×1672 | 720×1280 | -11,0 % (-286,62 Kio) | compressé |
| 4 | `public/assets/posters/Vodun Rays ‹ › Autre Foi.png` | 2,54 Mio | 2,54 Mio | 1024×1536 | 1024×1536 | 0,0 % | conservé |
| 5 | `public/assets/posters/Other Eyes < > Third Eye.png` | 2,00 Mio | 2,00 Mio | 768×1376 | 768×1376 | 0,0 % | conservé |
| 6 | `public/assets/images/pillar_org_afro_1792601150815.jpg` | 1,22 Mio | 246,74 Kio | 768×1376 | 714×1280 | -80,2 % (-1001,06 Kio) | compressé |
| 7 | `public/assets/images/pillar_duos_afro_1792601147557.jpg` | 1,20 Mio | 230,01 Kio | 768×1376 | 714×1280 | -81,2 % (-996,45 Kio) | compressé |
| 8 | `public/assets/images/pillar_soi_afro_1792601150131.jpg` | 1,20 Mio | 219,48 Kio | 768×1376 | 714×1280 | -82,1 % (-1006,15 Kio) | compressé |
| 9 | `public/assets/images/studio_orga_valeurs_1792608959843.jpg` | 1,16 Mio | 213,61 Kio | 768×1376 | 714×1280 | -82,0 % (-971,70 Kio) | compressé |
| 10 | `public/assets/duos/chef-koffi.jpg` | 1,15 Mio | 218,55 Kio | 768×1376 | 714×1280 | -81,4 % (-959,37 Kio) | compressé |
| 11 | `public/assets/protagonists/chef-koffi.jpg` | 1,15 Mio | 218,55 Kio | 768×1376 | 714×1280 | -81,4 % (-959,37 Kio) | compressé |
| 12 | `public/assets/directions/sagesses-humilite.jpg` | 1,15 Mio | 214,09 Kio | 768×1376 | 714×1280 | -81,8 % (-962,21 Kio) | compressé |
| 13 | `public/assets/directions/sagesses-gratitude.jpg` | 1,14 Mio | 210,09 Kio | 768×1376 | 714×1280 | -82,0 % (-953,94 Kio) | compressé |
| 14 | `public/assets/images/koffi_portonovo_1792933660999.jpg` | 1,13 Mio | 216,36 Kio | 768×1376 | 714×1280 | -81,4 % (-943,86 Kio) | compressé |
| 15 | `public/assets/duos/photographer-focus.jpg` | 1,12 Mio | 209,49 Kio | 768×1376 | 714×1280 | -81,7 % (-937,17 Kio) | compressé |
| 16 | `public/assets/protagonists/photographer-focus.jpg` | 1,12 Mio | 209,49 Kio | 768×1376 | 714×1280 | -81,7 % (-937,17 Kio) | compressé |
| 17 | `public/assets/directions/sagesses-amour.jpg` | 1,12 Mio | 198,57 Kio | 768×1376 | 714×1280 | -82,6 % (-944,51 Kio) | compressé |
| 18 | `public/assets/directions/projets-culture.jpg` | 1,12 Mio | 198,81 Kio | 768×1376 | 714×1280 | -82,6 % (-943,46 Kio) | compressé |
| 19 | `public/assets/directions/projets-communautaire.jpg` | 1,10 Mio | 195,69 Kio | 768×1376 | 714×1280 | -82,6 % (-931,10 Kio) | compressé |
| 20 | `public/assets/directions/expertises-artisanat.jpg` | 1,10 Mio | 200,11 Kio | 768×1376 | 714×1280 | -82,2 % (-921,21 Kio) | compressé |
| 21 | `public/assets/duos/pere-matthieu.jpg` | 1,09 Mio | 199,38 Kio | 768×1376 | 714×1280 | -82,1 % (-913,90 Kio) | compressé |
| 22 | `public/assets/protagonists/pere-matthieu.jpg` | 1,09 Mio | 199,38 Kio | 768×1376 | 714×1280 | -82,1 % (-913,90 Kio) | compressé |
| 23 | `public/assets/directions/territoires-traditions.jpg` | 1,08 Mio | 187,63 Kio | 768×1376 | 714×1280 | -83,1 % (-922,46 Kio) | compressé |
| 24 | `public/assets/directions/territoires-langues.jpg` | 1,07 Mio | 191,00 Kio | 768×1376 | 714×1280 | -82,6 % (-908,25 Kio) | compressé |
| 25 | `public/assets/doors/door-projets.jpg` | 1,07 Mio | 193,95 Kio | 768×1376 | 714×1280 | -82,3 % (-900,79 Kio) | compressé |
| 26 | `public/assets/directions/personnalites-musique.jpg` | 1,07 Mio | 186,94 Kio | 768×1376 | 714×1280 | -82,9 % (-907,60 Kio) | compressé |
| 27 | `public/assets/protagonists/dah-zounon.jpg` | 1,07 Mio | 199,96 Kio | 768×1376 | 714×1280 | -81,7 % (-893,65 Kio) | compressé |
| 28 | `public/assets/directions/territoires-histoire.jpg` | 1,06 Mio | 194,53 Kio | 768×1376 | 714×1280 | -82,2 % (-895,89 Kio) | compressé |
| 29 | `public/assets/directions/expertises-numerique.jpg` | 1,06 Mio | 200,10 Kio | 768×1376 | 714×1280 | -81,6 % (-888,84 Kio) | compressé |
| 30 | `public/assets/directions/territoires-habitudes.jpg` | 1,06 Mio | 187,75 Kio | 768×1376 | 714×1280 | -82,7 % (-899,36 Kio) | compressé |
| 31 | `public/assets/directions/territoires-culture.jpg` | 1,06 Mio | 187,15 Kio | 768×1376 | 714×1280 | -82,8 % (-899,29 Kio) | compressé |
| 32 | `public/assets/directions/expertises-education.jpg` | 1,05 Mio | 192,53 Kio | 768×1376 | 714×1280 | -82,1 % (-885,63 Kio) | compressé |
| 33 | `public/assets/protagonists/researcher-phd.jpg` | 1,05 Mio | 201,87 Kio | 768×1376 | 714×1280 | -81,3 % (-876,01 Kio) | compressé |
| 34 | `public/assets/directions/projets-ecologie.jpg` | 1,05 Mio | 188,02 Kio | 768×1376 | 714×1280 | -82,5 % (-887,15 Kio) | compressé |
| 35 | `public/assets/images/projets_ecologie_1792086393821.jpg` | 1,05 Mio | 188,02 Kio | 768×1376 | 714×1280 | -82,5 % (-887,15 Kio) | compressé |
| 36 | `public/assets/protagonists/koffi-tisserand.jpg` | 1,05 Mio | 215,72 Kio | 896×1200 | 896×1200 | -79,9 % (-857,07 Kio) | compressé |
| 37 | `public/assets/images/studio_orga_origines_1792608957920.jpg` | 1,05 Mio | 175,08 Kio | 768×1376 | 714×1280 | -83,7 % (-897,04 Kio) | compressé |
| 38 | `public/assets/duos/sayri-quispe.jpg` | 1,05 Mio | 190,28 Kio | 768×1376 | 714×1280 | -82,2 % (-880,92 Kio) | compressé |
| 39 | `public/assets/protagonists/sayri-quispe.jpg` | 1,05 Mio | 190,28 Kio | 768×1376 | 714×1280 | -82,2 % (-880,92 Kio) | compressé |
| 40 | `public/assets/directions/expertises-design.jpg` | 1,05 Mio | 192,73 Kio | 768×1376 | 714×1280 | -82,0 % (-878,40 Kio) | compressé |
| 41 | `public/assets/protagonists/adjovi-blandine.jpg` | 1,04 Mio | 211,27 Kio | 896×1200 | 896×1200 | -80,2 % (-857,09 Kio) | compressé |
| 42 | `public/assets/directions/personnalites-legendes.jpg` | 1,04 Mio | 183,63 Kio | 768×1376 | 714×1280 | -82,8 % (-882,02 Kio) | compressé |
| 43 | `public/assets/images/ayaba_nectar_1792933764727.jpg` | 1,03 Mio | 188,31 Kio | 768×1376 | 714×1280 | -82,2 % (-871,23 Kio) | compressé |
| 44 | `public/assets/directions/sagesses-solidarite.jpg` | 1,03 Mio | 179,09 Kio | 768×1376 | 714×1280 | -83,1 % (-879,80 Kio) | compressé |
| 45 | `public/assets/images/orga_rencontres_afro_1792611454422.jpg` | 1,03 Mio | 179,14 Kio | 768×1376 | 714×1280 | -83,1 % (-878,64 Kio) | compressé |
| 46 | `public/assets/directions/territoires-diaspora.jpg` | 1,03 Mio | 177,00 Kio | 768×1376 | 714×1280 | -83,3 % (-879,78 Kio) | compressé |
| 47 | `public/assets/images/home_afro_storyteller_1792193575638.jpg` | 1,03 Mio | 185,19 Kio | 768×1376 | 714×1280 | -82,4 % (-869,99 Kio) | compressé |
| 48 | `public/assets/directions/territoires-terroirs.jpg` | 1,03 Mio | 181,21 Kio | 768×1376 | 714×1280 | -82,8 % (-871,24 Kio) | compressé |
| 49 | `public/assets/directions/expertises-securite.jpg` | 1,02 Mio | 174,12 Kio | 768×1376 | 714×1280 | -83,3 % (-871,41 Kio) | compressé |
| 50 | `public/assets/posters/Benin < >.jpg` | 1,02 Mio | 173,17 Kio | 768×1376 | 714×1280 | -83,4 % (-872,24 Kio) | compressé |
| 51 | `public/assets/posters/benin-monde.jpg` | 1,02 Mio | 173,17 Kio | 768×1376 | 714×1280 | -83,4 % (-872,24 Kio) | compressé |
| 52 | `public/assets/images/kpedetin_joailliere_1792933718361.jpg` | 1,02 Mio | 191,93 Kio | 768×1376 | 714×1280 | -81,6 % (-852,22 Kio) | compressé |
| 53 | `public/assets/images/bio_solaire_1792933744556.jpg` | 1,01 Mio | 179,17 Kio | 768×1376 | 714×1280 | -82,7 % (-858,51 Kio) | compressé |
| 54 | `public/assets/directions/sagesses-resilience.jpg` | 1,01 Mio | 162,44 Kio | 768×1376 | 714×1280 | -84,3 % (-874,44 Kio) | compressé |
| 55 | `public/assets/images/studio_orga_quotidien_1792608958971.jpg` | 1,01 Mio | 177,51 Kio | 768×1376 | 714×1280 | -82,9 % (-858,61 Kio) | compressé |
| 56 | `public/assets/images/fagnon_agronome_1792933698985.jpg` | 1,01 Mio | 182,11 Kio | 768×1376 | 714×1280 | -82,4 % (-851,12 Kio) | compressé |
| 57 | `public/assets/directions/personnalites-arts.jpg` | 1,01 Mio | 183,39 Kio | 768×1376 | 714×1280 | -82,2 % (-847,69 Kio) | compressé |
| 58 | `public/assets/images/romeo_storyteller_1792933587573.jpg` | 1,00 Mio | 188,30 Kio | 768×1376 | 714×1280 | -81,7 % (-839,19 Kio) | compressé |
| 59 | `public/assets/posters/baobab-bambou.jpg` | 1,00 Mio | 166,89 Kio | 768×1376 | 714×1280 | -83,8 % (-860,22 Kio) | compressé |
| 60 | `public/assets/directions/marques-finance.jpg` | 1,00 Mio | 181,79 Kio | 768×1376 | 714×1280 | -82,3 % (-843,42 Kio) | compressé |
| 61 | `public/assets/doors/door-marques.jpg` | 1023,62 Kio | 178,78 Kio | 768×1376 | 714×1280 | -82,5 % (-844,85 Kio) | compressé |
| 62 | `public/assets/duos/tobi-ganvie.jpg` | 1021,39 Kio | 185,63 Kio | 768×1376 | 714×1280 | -81,8 % (-835,76 Kio) | compressé |
| 63 | `public/assets/duos/tobi-houndegla.jpg` | 1021,39 Kio | 185,63 Kio | 768×1376 | 714×1280 | -81,8 % (-835,76 Kio) | compressé |
| 64 | `public/assets/protagonists/tobi-ganvie.jpg` | 1021,39 Kio | 185,63 Kio | 768×1376 | 714×1280 | -81,8 % (-835,76 Kio) | compressé |
| 65 | `public/assets/protagonists/tobi-houndegla.jpg` | 1021,39 Kio | 185,63 Kio | 768×1376 | 714×1280 | -81,8 % (-835,76 Kio) | compressé |
| 66 | `public/assets/directions/marques-beaute.jpg` | 1012,77 Kio | 172,71 Kio | 768×1376 | 714×1280 | -82,9 % (-840,06 Kio) | compressé |
| 67 | `public/assets/images/recruit_videographer_1791825865262.jpg` | 1011,91 Kio | 162,78 Kio | 768×1376 | 714×1280 | -83,9 % (-849,13 Kio) | compressé |
| 68 | `public/assets/images/senami_architecte_1792933801804.jpg` | 1009,45 Kio | 173,48 Kio | 768×1376 | 714×1280 | -82,8 % (-835,96 Kio) | compressé |
| 69 | `public/assets/directions/produits-services-beaute.jpg` | 1008,53 Kio | 166,50 Kio | 768×1376 | 714×1280 | -83,5 % (-842,02 Kio) | compressé |
| 70 | `public/assets/images/romeo_dialogue_elders_1792698428934.jpg` | 1006,78 Kio | 167,10 Kio | 768×1376 | 714×1280 | -83,4 % (-839,68 Kio) | compressé |
| 71 | `public/assets/directions/projets-social.jpg` | 1006,72 Kio | 167,75 Kio | 768×1376 | 714×1280 | -83,3 % (-838,97 Kio) | compressé |
| 72 | `public/assets/images/projets_social_1792086395729.jpg` | 1006,72 Kio | 167,75 Kio | 768×1376 | 714×1280 | -83,3 % (-838,97 Kio) | compressé |
| 73 | `public/assets/directions/projets-jeux.jpg` | 1004,91 Kio | 175,87 Kio | 768×1376 | 714×1280 | -82,5 % (-829,05 Kio) | compressé |
| 74 | `public/assets/images/studio_soi_parcours_1792608978314.jpg` | 1004,02 Kio | 164,24 Kio | 768×1376 | 714×1280 | -83,6 % (-839,78 Kio) | compressé |
| 75 | `public/assets/directions/produits-services-garde-enfants.jpg` | 995,70 Kio | 165,67 Kio | 768×1376 | 714×1280 | -83,4 % (-830,03 Kio) | compressé |
| 76 | `public/assets/doors/door-competences.jpg` | 991,77 Kio | 167,47 Kio | 768×1376 | 714×1280 | -83,1 % (-824,30 Kio) | compressé |
| 77 | `public/assets/directions/sagesses-bienveillance.jpg` | 991,42 Kio | 163,34 Kio | 768×1376 | 714×1280 | -83,5 % (-828,08 Kio) | compressé |
| 78 | `public/assets/duos/researcher-phd.jpg` | 984,17 Kio | 159,27 Kio | 768×1376 | 714×1280 | -83,8 % (-824,90 Kio) | compressé |
| 79 | `public/assets/directions/projets-innovation.jpg` | 971,52 Kio | 170,72 Kio | 768×1376 | 714×1280 | -82,4 % (-800,80 Kio) | compressé |
| 80 | `public/assets/directions/expertises-sante.jpg` | 968,28 Kio | 167,96 Kio | 768×1376 | 714×1280 | -82,7 % (-800,32 Kio) | compressé |
| 81 | `public/assets/duos/fatou-diallo.jpg` | 966,24 Kio | 155,97 Kio | 768×1376 | 714×1280 | -83,9 % (-810,27 Kio) | compressé |
| 82 | `public/assets/protagonists/fatou-diallo.jpg` | 966,24 Kio | 155,97 Kio | 768×1376 | 714×1280 | -83,9 % (-810,27 Kio) | compressé |
| 83 | `public/assets/images/amara_andine_1792933642777.jpg` | 966,23 Kio | 166,02 Kio | 768×1376 | 714×1280 | -82,8 % (-800,21 Kio) | compressé |
| 84 | `public/assets/images/orga_transm_afro_1792611469008.jpg` | 964,91 Kio | 155,13 Kio | 768×1376 | 714×1280 | -83,9 % (-809,78 Kio) | compressé |
| 85 | `public/assets/directions/marques-services.jpg` | 961,36 Kio | 168,04 Kio | 768×1376 | 714×1280 | -82,5 % (-793,32 Kio) | compressé |
| 86 | `public/assets/images/pillar_casting_phoenix.png` | 960,42 Kio | 960,42 Kio | 574×874 | 574×874 | 0,0 % | conservé |
| 87 | `public/assets/doors/door-memoires.jpg` | 960,08 Kio | 139,51 Kio | 768×1376 | 714×1280 | -85,5 % (-820,57 Kio) | compressé |
| 88 | `public/assets/doors/door-sagesses.jpg` | 960,08 Kio | 139,51 Kio | 768×1376 | 714×1280 | -85,5 % (-820,57 Kio) | compressé |
| 89 | `public/assets/duos/coach-office.jpg` | 957,37 Kio | 149,47 Kio | 768×1376 | 714×1280 | -84,4 % (-807,90 Kio) | compressé |
| 90 | `public/assets/protagonists/coach-office.jpg` | 957,37 Kio | 149,47 Kio | 768×1376 | 714×1280 | -84,4 % (-807,90 Kio) | compressé |
| 91 | `public/assets/duos/duo_pere_matthieu_1791655226601.jpg` | 956,83 Kio | 151,27 Kio | 768×1376 | 714×1280 | -84,2 % (-805,56 Kio) | compressé |
| 92 | `public/assets/images/sika_tisserande_1792933605542.jpg` | 952,38 Kio | 158,86 Kio | 768×1376 | 714×1280 | -83,3 % (-793,53 Kio) | compressé |
| 93 | `public/assets/images/studio_orga_epreuves_1792608979150.jpg` | 952,12 Kio | 152,54 Kio | 768×1376 | 714×1280 | -84,0 % (-799,58 Kio) | compressé |
| 94 | `public/assets/directions/projets-entreprise.jpg` | 950,16 Kio | 165,66 Kio | 768×1376 | 714×1280 | -82,6 % (-784,50 Kio) | compressé |
| 95 | `public/assets/directions/territoires-patrimoine.jpg` | 944,88 Kio | 144,04 Kio | 768×1376 | 714×1280 | -84,8 % (-800,84 Kio) | compressé |
| 96 | `public/assets/doors/door-offres.jpg` | 941,55 Kio | 158,89 Kio | 768×1376 | 714×1280 | -83,1 % (-782,66 Kio) | compressé |
| 97 | `public/assets/directions/expertises-justice.jpg` | 938,73 Kio | 149,73 Kio | 768×1376 | 714×1280 | -84,0 % (-789,00 Kio) | compressé |
| 98 | `public/assets/duos/codjo-blind.jpg` | 932,96 Kio | 143,66 Kio | 768×1376 | 714×1280 | -84,6 % (-789,31 Kio) | compressé |
| 99 | `public/assets/protagonists/codjo-blind.jpg` | 932,96 Kio | 143,66 Kio | 768×1376 | 714×1280 | -84,6 % (-789,31 Kio) | compressé |
| 100 | `public/assets/images/romeo_settling_studio_1792698427492.jpg` | 931,48 Kio | 147,77 Kio | 768×1376 | 714×1280 | -84,1 % (-783,70 Kio) | compressé |
| 101 | `public/assets/directions/personnalites-influenceurs.jpg` | 926,84 Kio | 148,35 Kio | 768×1376 | 714×1280 | -84,0 % (-778,49 Kio) | compressé |
| 102 | `public/assets/directions/projets-aventure.jpg` | 924,84 Kio | 130,88 Kio | 768×1376 | 714×1280 | -85,8 % (-793,97 Kio) | compressé |
| 103 | `public/assets/protagonists/helene-saint-amand.jpg` | 915,93 Kio | 147,54 Kio | 768×1376 | 714×1280 | -83,9 % (-768,40 Kio) | compressé |
| 104 | `public/assets/images/beninois_pecheur_tobi_1792165042006.jpg` | 910,01 Kio | 165,71 Kio | 896×1200 | 896×1200 | -81,8 % (-744,30 Kio) | compressé |
| 105 | `public/assets/posters/Esu < > Jesus.png` | 899,75 Kio | 125,49 Kio | 768×1376 | 714×1280 | -86,1 % (-774,25 Kio) | compressé |
| 106 | `public/assets/posters/vodun-autre-foi.jpg` | 899,75 Kio | 125,49 Kio | 768×1376 | 714×1280 | -86,1 % (-774,25 Kio) | compressé |
| 107 | `public/assets/posters/vodun-autre-foi.png` | 899,75 Kio | 125,49 Kio | 768×1376 | 714×1280 | -86,1 % (-774,25 Kio) | compressé |
| 108 | `public/assets/directions/sagesses-pardon.jpg` | 897,24 Kio | 130,42 Kio | 768×1376 | 714×1280 | -85,5 % (-766,82 Kio) | compressé |
| 109 | `public/assets/directions/produits-services-restauration.jpg` | 897,16 Kio | 149,25 Kio | 768×1376 | 714×1280 | -83,4 % (-747,91 Kio) | compressé |
| 110 | `public/assets/directions/produits-services-bien-etre.jpg` | 897,02 Kio | 147,55 Kio | 768×1376 | 714×1280 | -83,6 % (-749,47 Kio) | compressé |
| 111 | `public/assets/protagonists/amara-tisserande.jpg` | 896,95 Kio | 155,42 Kio | 896×1200 | 896×1200 | -82,7 % (-741,53 Kio) | compressé |
| 112 | `public/assets/directions/personnalites-cinema.jpg` | 895,98 Kio | 132,95 Kio | 768×1376 | 714×1280 | -85,2 % (-763,03 Kio) | compressé |
| 113 | `public/assets/images/kiki_passeur_1792933820505.jpg` | 891,09 Kio | 138,08 Kio | 768×1376 | 714×1280 | -84,5 % (-753,01 Kio) | compressé |
| 114 | `public/assets/directions/expertises-business.jpg` | 889,47 Kio | 147,45 Kio | 768×1376 | 714×1280 | -83,4 % (-742,02 Kio) | compressé |
| 115 | `public/assets/duos/malik-diop.jpg` | 886,36 Kio | 156,17 Kio | 1024×1024 | 1024×1024 | -82,4 % (-730,19 Kio) | compressé |
| 116 | `public/assets/protagonists/malik-diop.jpg` | 886,36 Kio | 156,17 Kio | 1024×1024 | 1024×1024 | -82,4 % (-730,19 Kio) | compressé |
| 117 | `public/assets/directions/produits-services-mode.jpg` | 884,99 Kio | 151,69 Kio | 768×1376 | 714×1280 | -82,9 % (-733,30 Kio) | compressé |
| 118 | `public/assets/images/ps_mode_1792086355077.jpg` | 884,99 Kio | 151,69 Kio | 768×1376 | 714×1280 | -82,9 % (-733,30 Kio) | compressé |
| 119 | `public/assets/directions/marques-tech.jpg` | 884,43 Kio | 142,31 Kio | 768×1376 | 714×1280 | -83,9 % (-742,11 Kio) | compressé |
| 120 | `public/assets/images/marques_tech_1792086434196.jpg` | 884,43 Kio | 142,31 Kio | 768×1376 | 714×1280 | -83,9 % (-742,11 Kio) | compressé |
| 121 | `public/assets/directions/produits-services-tourisme.jpg` | 884,32 Kio | 135,16 Kio | 768×1376 | 714×1280 | -84,7 % (-749,15 Kio) | compressé |
| 122 | `public/assets/directions/marques-luxe.jpg` | 877,04 Kio | 139,04 Kio | 768×1376 | 714×1280 | -84,1 % (-738,00 Kio) | compressé |
| 123 | `public/assets/images/marques_luxe_1792086431681.jpg` | 877,04 Kio | 139,04 Kio | 768×1376 | 714×1280 | -84,1 % (-738,00 Kio) | compressé |
| 124 | `public/assets/images/beninoise_jeune_senan_1792165025309.jpg` | 874,87 Kio | 144,89 Kio | 896×1200 | 896×1200 | -83,4 % (-729,98 Kio) | compressé |
| 125 | `public/assets/protagonists/senan-agossa.jpg` | 874,87 Kio | 144,89 Kio | 896×1200 | 896×1200 | -83,4 % (-729,98 Kio) | compressé |
| 126 | `public/assets/posters/Blacks One < > Beyond Eve.png` | 874,55 Kio | 119,50 Kio | 768×1376 | 714×1280 | -86,3 % (-755,05 Kio) | compressé |
| 127 | `public/assets/posters/blacks-one-amazones.png` | 874,55 Kio | 119,50 Kio | 768×1376 | 714×1280 | -86,3 % (-755,05 Kio) | compressé |
| 128 | `public/assets/images/romeo_lagoon_sunset_1792698428025.jpg` | 873,41 Kio | 124,86 Kio | 768×1376 | 714×1280 | -85,7 % (-748,55 Kio) | compressé |
| 129 | `public/assets/duos/mawuna-medium.jpg` | 870,20 Kio | 125,13 Kio | 768×1376 | 714×1280 | -85,6 % (-745,07 Kio) | compressé |
| 130 | `public/assets/protagonists/mawuna-medium.jpg` | 870,20 Kio | 125,13 Kio | 768×1376 | 714×1280 | -85,6 % (-745,07 Kio) | compressé |
| 131 | `public/assets/duos/athlete-hurdle.jpg` | 870,06 Kio | 127,14 Kio | 768×1376 | 714×1280 | -85,4 % (-742,92 Kio) | compressé |
| 132 | `public/assets/protagonists/athlete-hurdle.jpg` | 870,06 Kio | 127,14 Kio | 768×1376 | 714×1280 | -85,4 % (-742,92 Kio) | compressé |
| 133 | `public/assets/directions/sagesses-perseverance.jpg` | 867,51 Kio | 126,57 Kio | 768×1376 | 714×1280 | -85,4 % (-740,94 Kio) | compressé |
| 134 | `public/assets/duos/dah-zounon.jpg` | 867,51 Kio | 143,41 Kio | 896×1200 | 896×1200 | -83,5 % (-724,10 Kio) | compressé |
| 135 | `public/assets/images/beninois_sage_dossou_1792165004493.jpg` | 867,51 Kio | 143,41 Kio | 896×1200 | 896×1200 | -83,5 % (-724,10 Kio) | compressé |
| 136 | `public/assets/protagonists/mahougnon-zounon.jpg` | 867,51 Kio | 143,41 Kio | 896×1200 | 896×1200 | -83,5 % (-724,10 Kio) | compressé |
| 137 | `public/assets/duos/mahougnon_esu_portrait_1791701582891.jpg` | 863,79 Kio | 131,43 Kio | 768×1376 | 714×1280 | -84,8 % (-732,35 Kio) | compressé |
| 138 | `public/assets/directions/marques-sport.jpg` | 861,66 Kio | 125,37 Kio | 768×1376 | 714×1280 | -85,5 % (-736,29 Kio) | compressé |
| 139 | `public/assets/duos/kwame-mensah.jpg` | 861,37 Kio | 141,65 Kio | 768×1376 | 714×1280 | -83,6 % (-719,72 Kio) | compressé |
| 140 | `public/assets/protagonists/kwame-mensah.jpg` | 861,37 Kio | 141,65 Kio | 768×1376 | 714×1280 | -83,6 % (-719,72 Kio) | compressé |
| 141 | `public/assets/directions/personnalites-engagement.jpg` | 859,26 Kio | 123,24 Kio | 768×1376 | 714×1280 | -85,7 % (-736,02 Kio) | compressé |
| 142 | `public/assets/directions/personnalites-sport.jpg` | 858,98 Kio | 125,05 Kio | 768×1376 | 714×1280 | -85,4 % (-733,92 Kio) | compressé |
| 143 | `public/assets/images/romeo_arriving_cotonou_1792698426939.jpg` | 857,16 Kio | 119,00 Kio | 768×1376 | 714×1280 | -86,1 % (-738,16 Kio) | compressé |
| 144 | `public/assets/directions/marques-mode.jpg` | 851,82 Kio | 128,49 Kio | 768×1376 | 714×1280 | -84,9 % (-723,33 Kio) | compressé |
| 145 | `public/assets/directions/produits-services-conciergerie.jpg` | 838,25 Kio | 126,10 Kio | 768×1376 | 714×1280 | -85,0 % (-712,16 Kio) | compressé |
| 146 | `public/assets/posters/Fiat Luxe < > Street.jpg` | 837,01 Kio | 113,45 Kio | 768×1376 | 714×1280 | -86,4 % (-723,57 Kio) | compressé |
| 147 | `public/assets/posters/fiat-luxe-builders.png` | 837,01 Kio | 113,45 Kio | 768×1376 | 714×1280 | -86,4 % (-723,57 Kio) | compressé |
| 148 | `public/assets/images/pro_shoot_story.jpg` | 833,85 Kio | 118,84 Kio | 768×1376 | 714×1280 | -85,7 % (-715,01 Kio) | compressé |
| 149 | `public/assets/posters/roots-routes.jpg` | 829,03 Kio | 101,75 Kio | 768×1376 | 714×1280 | -87,7 % (-727,28 Kio) | compressé |
| 150 | `public/assets/directions/personnalites-foi.jpg` | 827,83 Kio | 116,49 Kio | 768×1376 | 714×1280 | -85,9 % (-711,34 Kio) | compressé |
| 151 | `public/assets/images/selfie_video_story.jpg` | 827,35 Kio | 122,05 Kio | 768×1376 | 714×1280 | -85,2 % (-705,30 Kio) | compressé |
| 152 | `public/assets/doors/door-personnalites.jpg` | 825,78 Kio | 125,84 Kio | 768×1376 | 714×1280 | -84,8 % (-699,94 Kio) | compressé |
| 153 | `public/assets/posters/Focus < >  PhD.jpg` | 815,52 Kio | 106,58 Kio | 768×1376 | 714×1280 | -86,9 % (-708,94 Kio) | compressé |
| 154 | `public/assets/posters/pictures-words.jpg` | 815,52 Kio | 106,58 Kio | 768×1376 | 714×1280 | -86,9 % (-708,94 Kio) | compressé |
| 155 | `public/assets/images/dossou_logistique_1792933781153.jpg` | 814,21 Kio | 117,62 Kio | 768×1376 | 714×1280 | -85,6 % (-696,59 Kio) | compressé |
| 156 | `public/assets/duos/eleonore-vance.jpg` | 808,60 Kio | 149,88 Kio | 1024×1024 | 1024×1024 | -81,5 % (-658,73 Kio) | compressé |
| 157 | `public/assets/protagonists/eleonore-vance.jpg` | 808,60 Kio | 149,88 Kio | 1024×1024 | 1024×1024 | -81,5 % (-658,73 Kio) | compressé |
| 158 | `public/assets/images/beninoise_femme_sika_1792164985263.jpg` | 801,25 Kio | 118,24 Kio | 896×1200 | 896×1200 | -85,2 % (-683,01 Kio) | compressé |
| 159 | `public/assets/protagonists/sika-dossou.jpg` | 801,25 Kio | 118,24 Kio | 896×1200 | 896×1200 | -85,2 % (-683,01 Kio) | compressé |
| 160 | `public/assets/posters/Builders < > Seekers.png` | 795,30 Kio | 103,01 Kio | 768×1376 | 714×1280 | -87,0 % (-692,29 Kio) | compressé |
| 161 | `public/assets/posters/coaching-phd.png` | 795,30 Kio | 103,01 Kio | 768×1376 | 714×1280 | -87,0 % (-692,29 Kio) | compressé |
| 162 | `public/assets/directions/produits-services-immobilier.jpg` | 793,73 Kio | 114,84 Kio | 768×1376 | 714×1280 | -85,5 % (-678,90 Kio) | compressé |
| 163 | `public/assets/protagonists/armel-hounkpatin.jpg` | 769,96 Kio | 112,76 Kio | 896×1200 | 896×1200 | -85,4 % (-657,19 Kio) | compressé |
| 164 | `public/assets/images/senan_innovatrice_1792933679487.jpg` | 761,90 Kio | 117,74 Kio | 768×1376 | 714×1280 | -84,5 % (-644,16 Kio) | compressé |
| 165 | `public/assets/doors/door-series.jpg` | 745,71 Kio | 107,97 Kio | 768×1376 | 714×1280 | -85,5 % (-637,74 Kio) | compressé |
| 166 | `public/assets/doors/door-territoires.jpg` | 726,00 Kio | 106,96 Kio | 768×1376 | 714×1280 | -85,3 % (-619,05 Kio) | compressé |
| 167 | `public/assets/images/romeo_avatar_1792698425983.jpg` | 720,74 Kio | 91,40 Kio | 1024×1024 | 1024×1024 | -87,3 % (-629,33 Kio) | compressé |
| 168 | `public/assets/posters/Diasporas < > Makers.jpg` | 441,47 Kio | 165,35 Kio | 768×1344 | 731×1280 | -62,5 % (-276,12 Kio) | compressé |
| 169 | `public/assets/posters/Coaching ‹ › PhD.jpg` | 362,85 Kio | 123,32 Kio | 768×1344 | 731×1280 | -66,0 % (-239,54 Kio) | compressé |
| 170 | `public/assets/posters/Benin ‹ › Le Monde.jpg` | 353,97 Kio | 198,89 Kio | 768×1376 | 714×1280 | -43,8 % (-155,08 Kio) | compressé |
| 171 | `public/assets/posters/Fiat Luxe ‹ › Builders.jpg` | 348,23 Kio | 116,05 Kio | 768×1344 | 731×1280 | -66,7 % (-232,19 Kio) | compressé |
| 172 | `public/assets/posters/Baobabs ‹ › Bambous.jpg` | 331,18 Kio | 105,38 Kio | 768×1344 | 731×1280 | -68,2 % (-225,81 Kio) | compressé |
| 173 | `public/assets/posters/Pictures ‹ › Words.jpg` | 324,09 Kio | 108,40 Kio | 768×1344 | 731×1280 | -66,6 % (-215,69 Kio) | compressé |
