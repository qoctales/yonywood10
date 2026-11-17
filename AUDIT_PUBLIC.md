# Audit des fichiers statiques (`public/` et `src/assets/`)

> Audit en lecture seule réalisé sur le dépôt (dossier `archive/` exclu). Aucun fichier existant n'a été supprimé, déplacé, renommé ni modifié.

## 1. Synthèse globale (`public/`)

| Catégorie | Fichiers | Part (%) | Poids total (octets) | Poids lisible |
|---|---:|---:|---:|---|
| **UTILISÉ** (référencé dans le code/config) | 202 | 52,5 % | 185 793 893 | 177,19 Mio |
| **INCERTAIN** (chemin dynamique) | 7 | 1,8 % | 6 681 125 | 6,37 Mio |
| **PROBABLEMENT INUTILISÉ** (aucune référence) | **176** | 45,7 % | **78 547 552** | **74,91 Mio** |
| **TOTAL `public/`** | **385** | **100,0 %** | **271 022 570** | **258,47 Mio** |

- **Total des fichiers PROBABLEMENT INUTILISÉS dans `public/`** : **176 fichiers** pour **78 547 552 octets (74,91 Mio)**, soit **29,0 %** du poids total de `public/`.
- **Observation sur les fichiers `UTILISÉ` uniquement dans du code legacy / non monté** : parmi les 202 fichiers `UTILISÉ`, **1 fichier** (`public/assets/Onboardings/Voyage.png`, 3,54 Mio) n'est référencé que dans un composant non importé par `App.tsx` (`LandingScreen` / `DemoEntrepriseSection`), et d'autres (ex. posters de `Focus/` ou variantes anciennes) apparaissent uniquement dans `LegacyMarketplaceScreen`, `PortfolioScreen` (masqués quand `SHOW_FINANCIAL_SCREENS = false`) et les fichiers `src/data/`.
- **Anomalies de chemins détectées (aucune modification faite)** : `src/data/thematicStoriesData.ts` (lignes 65, 159, 205, 251, 325, 371) utilise le préfixe `/public/assets/images/...` (invalide en HTTP car `public/` est servi à `/`) ; `vite.config.ts:116` liste `favicon.ico` dans `includeAssets`, mais `public/favicon.ico` est absent ; `src/components/SubmitStoryScreen.tsx:1296,1382` utilise `/src/assets/images/...` en fallback `onError` (servi uniquement en dev par `server.ts:403`, absent de `dist/` en production).

## 2. Totaux par dossier (`public/`, triés par poids décroissant)

| Dossier | Total fichiers | Poids total | UTILISÉ (nb / poids) | INCERTAIN (nb / poids) | PROBABLEMENT INUTILISÉ (nb / poids) |
|---|---:|---:|---:|---:|---:|
| `public/assets/posters/` | 88 | 83,52 Mio (87 574 257 o) | 33 / 31,71 Mio | 7 / 6,37 Mio | 48 / 45,44 Mio |
| `public/assets/directions/` | 55 | 53,22 Mio (55 808 898 o) | 55 / 53,22 Mio | 0 / 0 o | 0 / 0 o |
| `public/assets/images/` | 54 | 52,18 Mio (54 715 380 o) | 41 / 39,05 Mio | 0 / 0 o | 13 / 13,13 Mio |
| `public/assets/protagonists/` | 42 | 38,26 Mio (40 113 642 o) | 24 / 22,60 Mio | 0 / 0 o | 18 / 15,65 Mio |
| `public/assets/duos/` | 18 | 16,97 Mio (17 794 337 o) | 18 / 16,97 Mio | 0 / 0 o | 0 / 0 o |
| `public/assets/doors/` | 9 | 8,08 Mio (8 467 805 o) | 9 / 8,08 Mio | 0 / 0 o | 0 / 0 o |
| `public/assets/Onboardings/` | 1 | 3,54 Mio (3 711 940 o) | 1 / 3,54 Mio | 0 / 0 o | 0 / 0 o |
| `public/ (racine)` | 9 | 1,69 Mio (1 773 197 o) | 5 / 1,10 Mio | 0 / 0 o | 4 / 603,55 Kio |
| `public/assets/brand-logos/` | 32 | 974,95 Kio (998 351 o) | 16 / 935,44 Kio | 0 / 0 o | 16 / 39,51 Kio |
| `public/assets/icons/` | 76 | 61,57 Kio (63 049 o) | 0 / 0 o | 0 / 0 o | 76 / 61,57 Kio |
| `public/assets/ (racine)` | 1 | 1,67 Kio (1 714 o) | 0 / 0 o | 0 / 0 o | 1 / 1,67 Kio |

## 3. Ce qui est précaché par le Service Worker (`vite-plugin-pwa`)

D'après `vite.config.ts:114-142` (`workbox` utilise le `globPatterns` par défaut de `vite-plugin-pwa`, soit `**/*.{js,css,html}`, complété par `includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'icon.svg']` et `manifest.icons: [/icon.svg]`) et vérifié dans `dist/sw.js` :

| Fichier `public/` précaché | Poids | Origine dans la config PWA | Présent dans `dist/sw.js` |
|---|---:|---|---|
| `public/apple-touch-icon.png` | 14,00 Kio (14 304 o) | `vite.config.ts:116` (`includeAssets`) | Oui (`url:"apple-touch-icon.png"`) |
| `public/icon.svg` | 2,08 Kio (2 129 o) | `vite.config.ts:116` (`includeAssets`) et `129` (`manifest.icons`) | Oui (`url:"icon.svg"`) |

- **Bilan SW sur `public/`** : **seulement 2 fichiers sur 385** (**16 433 octets / 16,05 Kio**) issus de `public/` sont précachés par le Service Worker au premier chargement. Les **383 autres fichiers** de `public/` (images `.jpg`/`.png`/`.webp`/`.svg` de `assets/`, vidéo `sample.mp4`, `manifest.json`, etc.) ne sont **pas** précachés.
- Note : `vite.config.ts:116` déclare aussi `favicon.ico`, absent de `public/`. Le manifest généré et précaché par le SW est `manifest.webmanifest` (distinct de `public/manifest.json` référencé par `index.html:12`).

## 4. Fichiers UTILISÉS très lourds (> 300 Ko) — 182 fichiers

Seuil vérifié : `> 307 200 octets` (300 Kio) et `> 300 000 octets` (300 Ko) sélectionnent exactement les mêmes **182 fichiers** (le fichier `UTILISÉ` suivant le plus lourd pèse 99 283 octets). Aucun fichier n'a été modifié.

| # | Chemin | Poids (octets) | Poids | Type | Référence principale |
|---:|---|---:|---|---|---|
| 1 | `public/assets/Onboardings/Voyage.png` | 3 711 940 | 3,54 Mio | PNG | `src/components/landing/DemoEntrepriseSection.tsx:33` *(composant legacy/non monté uniquement)* |
| 2 | `public/assets/posters/Blacks One ‹ › Amazones.png` | 2 708 431 | 2,58 Mio | PNG | `src/components/LegacyMarketplaceScreen.tsx:103`, `src/data/mockData.ts:242`, `src/data/mockData.ts:243` (+1 autres) |
| 3 | `public/assets/posters/Roots < > Routes.png` | 2 671 729 | 2,55 Mio | PNG | `src/components/LegacyMarketplaceScreen.tsx:131`, `src/data/mockData.ts:448`, `src/data/mockData.ts:449` (+1 autres) |
| 4 | `public/assets/posters/Vodun Rays ‹ › Autre Foi.png` | 2 660 148 | 2,54 Mio | PNG | `src/components/LegacyMarketplaceScreen.tsx:124`, `src/data/mockData.ts:23`, `src/data/mockData.ts:24` (+1 autres) |
| 5 | `public/assets/posters/Other Eyes < > Third Eye.png` | 2 100 559 | 2,00 Mio | PNG | `src/components/PortfolioScreen.tsx:165`, `src/data/adminBackOfficeData.ts:514` |
| 6 | `public/assets/images/pillar_org_afro_1792601150815.jpg` | 1 277 746 | 1,22 Mio | JPG | `src/data/studioPillarsData.ts:811` |
| 7 | `public/assets/images/pillar_duos_afro_1792601147557.jpg` | 1 255 896 | 1,20 Mio | JPG | `src/data/studioPillarsData.ts:43` |
| 8 | `public/assets/images/pillar_soi_afro_1792601150131.jpg` | 1 255 045 | 1,20 Mio | JPG | `src/data/studioPillarsData.ts:122` |
| 9 | `public/assets/images/studio_orga_valeurs_1792608959843.jpg` | 1 213 750 | 1,16 Mio | JPG | `src/data/studioPillarsData.ts:827` |
| 10 | `public/assets/duos/chef-koffi.jpg` | 1 206 189 | 1,15 Mio | JPG | `src/components/SubmitStoryScreen.tsx:59`, `src/components/landing/DemoProductionsSection.tsx:271`, `src/data/explorerTopicsData.ts:1620` |
| 11 | `public/assets/protagonists/chef-koffi.jpg` | 1 206 189 | 1,15 Mio | JPG | `src/components/PortraitsCircleView.tsx:823`, `src/components/matrix/LivingMatrixWall.tsx:145`, `src/data/focusTopicsData.ts:366` (+10 autres) |
| 12 | `public/assets/directions/sagesses-humilite.jpg` | 1 204 525 | 1,15 Mio | JPG | `src/data/dimensionsData.ts:437`, `src/data/studioPillarsData.ts:248` |
| 13 | `public/assets/directions/sagesses-gratitude.jpg` | 1 191 970 | 1,14 Mio | JPG | `src/data/dimensionsData.ts:377`, `src/data/studioPillarsData.ts:224` |
| 14 | `public/assets/images/koffi_portonovo_1792933660999.jpg` | 1 188 058 | 1,13 Mio | JPG | `src/components/SubmitStoryScreen.tsx:74`, `src/data/mockData.ts:1061`, `src/data/mockData.ts:1172` (+3 autres) |
| 15 | `public/assets/duos/photographer-focus.jpg` | 1 174 172 | 1,12 Mio | JPG | `src/components/LegacyMarketplaceScreen.tsx:240`, `src/components/SubmitStoryScreen.tsx:78`, `src/data/matrixData.ts:2699` (+12 autres) |
| 16 | `public/assets/protagonists/photographer-focus.jpg` | 1 174 172 | 1,12 Mio | JPG | `src/data/matrixData.ts:394`, `src/data/matrixData.ts:841`, `src/data/matrixData.ts:1322` (+5 autres) |
| 17 | `public/assets/directions/sagesses-amour.jpg` | 1 170 514 | 1,12 Mio | JPG | `src/data/dimensionsData.ts:347`, `src/data/studioPillarsData.ts:192` |
| 18 | `public/assets/directions/projets-culture.jpg` | 1 169 689 | 1,12 Mio | JPG | `src/data/dimensionsData.ts:890`, `src/data/studioPillarsData.ts:716` |
| 19 | `public/assets/directions/projets-communautaire.jpg` | 1 153 833 | 1,10 Mio | JPG | `src/data/dimensionsData.ts:920`, `src/data/studioPillarsData.ts:684`, `src/data/studioPillarsData.ts:786` |
| 20 | `public/assets/directions/expertises-artisanat.jpg` | 1 148 235 | 1,10 Mio | JPG | `src/data/companyPortraitsData.ts:400`, `src/data/dimensionsData.ts:596`, `src/data/studioPillarsData.ts:340` (+1 autres) |
| 21 | `public/assets/duos/pere-matthieu.jpg` | 1 139 999 | 1,09 Mio | JPG | `src/data/matrixData.ts:209`, `src/data/seriesTeamData.ts:30`, `src/utils/lineageService.ts:146` |
| 22 | `public/assets/protagonists/pere-matthieu.jpg` | 1 139 999 | 1,09 Mio | JPG | `src/data/matrixData.ts:373`, `src/data/matrixData.ts:823`, `src/data/matrixData.ts:1304` (+5 autres) |
| 23 | `public/assets/directions/territoires-traditions.jpg` | 1 136 733 | 1,08 Mio | JPG | `src/data/companyPortraitsData.ts:639`, `src/data/dimensionsData.ts:479`, `src/data/studioPillarsData.ts:262` (+1 autres) |
| 24 | `public/sample.mp4` | 1 128 375 | 1,08 Mio | MP4 | `src/components/DuoFeedScreen.tsx:434`, `src/components/FocusScreen.tsx:568`, `src/components/FocusVideoCard.tsx:64` (+224 autres) |
| 25 | `public/assets/directions/territoires-langues.jpg` | 1 125 630 | 1,07 Mio | JPG | `src/data/dimensionsData.ts:539`, `src/data/studioPillarsData.ts:310` |
| 26 | `public/assets/doors/door-projets.jpg` | 1 121 022 | 1,07 Mio | JPG | `src/data/adminBackOfficeData.ts:227`, `src/data/dimensionsData.ts:134` |
| 27 | `public/assets/directions/personnalites-musique.jpg` | 1 120 811 | 1,07 Mio | JPG | `src/data/companyPortraitsData.ts:428`, `src/data/dimensionsData.ts:1154`, `src/data/studioPillarsData.ts:442` |
| 28 | `public/assets/protagonists/dah-zounon.jpg` | 1 119 852 | 1,07 Mio | JPG | `src/components/PortraitsCircleView.tsx:826`, `src/components/matrix/LivingMatrixWall.tsx:148`, `src/data/focusTopicsData.ts:236` (+8 autres) |
| 29 | `public/assets/directions/territoires-histoire.jpg` | 1 116 592 | 1,06 Mio | JPG | `src/data/companyPortraitsData.ts:695`, `src/data/dimensionsData.ts:509`, `src/data/studioPillarsData.ts:294` |
| 30 | `public/assets/directions/expertises-numerique.jpg` | 1 115 074 | 1,06 Mio | JPG | `src/data/companyPortraitsData.ts:358`, `src/data/dimensionsData.ts:626`, `src/data/studioPillarsData.ts:372` |
| 31 | `public/assets/directions/territoires-habitudes.jpg` | 1 113 206 | 1,06 Mio | JPG | `src/data/dimensionsData.ts:569`, `src/data/studioPillarsData.ts:326` |
| 32 | `public/assets/directions/territoires-culture.jpg` | 1 112 507 | 1,06 Mio | JPG | `src/data/companyPortraitsData.ts:526`, `src/data/dimensionsData.ts:494`, `src/data/studioPillarsData.ts:286` |
| 33 | `public/assets/directions/expertises-education.jpg` | 1 104 036 | 1,05 Mio | JPG | `src/data/dimensionsData.ts:611`, `src/data/studioPillarsData.ts:364` |
| 34 | `public/assets/protagonists/researcher-phd.jpg` | 1 103 749 | 1,05 Mio | JPG | `src/data/matrixData.ts:412`, `src/data/matrixData.ts:859`, `src/data/matrixData.ts:1340` (+5 autres) |
| 35 | `public/assets/directions/projets-ecologie.jpg` | 1 100 968 | 1,05 Mio | JPG | `src/data/companyPortraitsData.ts:442`, `src/data/dimensionsData.ts:875`, `src/data/studioPillarsData.ts:668` |
| 36 | `public/assets/images/projets_ecologie_1792086393821.jpg` | 1 100 968 | 1,05 Mio | JPG | `src/data/studioPillarsData.ts:875` |
| 37 | `public/assets/protagonists/koffi-tisserand.jpg` | 1 098 539 | 1,05 Mio | JPG | `src/components/PortfolioScreen.tsx:217`, `src/components/ProtagonistTeaserModal.tsx:77`, `src/components/matrix/LivingMatrixWall.tsx:150` (+11 autres) |
| 38 | `public/assets/images/studio_orga_origines_1792608957920.jpg` | 1 097 856 | 1,05 Mio | JPG | `src/data/studioPillarsData.ts:819` |
| 39 | `public/assets/duos/sayri-quispe.jpg` | 1 096 902 | 1,05 Mio | JPG | `src/components/SubmitStoryScreen.tsx:73`, `src/data/fourFacesFeedData.ts:85`, `src/data/thematicStoriesData.ts:150` (+1 autres) |
| 40 | `public/assets/protagonists/sayri-quispe.jpg` | 1 096 902 | 1,05 Mio | JPG | `src/components/PortfolioScreen.tsx:183`, `src/data/matrixData.ts:430`, `src/data/matrixData.ts:877` (+9 autres) |
| 41 | `public/assets/directions/expertises-design.jpg` | 1 096 841 | 1,05 Mio | JPG | `src/data/companyPortraitsData.ts:765`, `src/data/dimensionsData.ts:701`, `src/data/studioPillarsData.ts:404` |
| 42 | `public/assets/protagonists/adjovi-blandine.jpg` | 1 094 002 | 1,04 Mio | JPG | `src/components/PortraitsCircleView.tsx:822`, `src/components/landing/DemoEntrepriseSection.tsx:42`, `src/components/landing/DemoProfilPascalSection.tsx:398` (+13 autres) |
| 43 | `public/assets/directions/personnalites-legendes.jpg` | 1 091 226 | 1,04 Mio | JPG | `src/data/dimensionsData.ts:1139`, `src/data/studioPillarsData.ts:434` |
| 44 | `public/assets/images/ayaba_nectar_1792933764727.jpg` | 1 084 969 | 1,03 Mio | JPG | `src/components/SubmitStoryScreen.tsx:82`, `src/data/companyPortraitsData.ts:33`, `src/data/mockData.ts:971` (+2 autres) |
| 45 | `public/assets/directions/sagesses-solidarite.jpg` | 1 084 310 | 1,03 Mio | JPG | `src/data/companyPortraitsData.ts:554`, `src/data/dimensionsData.ts:362`, `src/data/studioPillarsData.ts:216` |
| 46 | `public/assets/images/orga_rencontres_afro_1792611454422.jpg` | 1 083 165 | 1,03 Mio | JPG | `src/data/studioPillarsData.ts:778`, `src/data/studioPillarsData.ts:851` |
| 47 | `public/assets/directions/territoires-diaspora.jpg` | 1 082 144 | 1,03 Mio | JPG | `src/data/dimensionsData.ts:554`, `src/data/studioPillarsData.ts:318` |
| 48 | `public/assets/images/home_afro_storyteller_1792193575638.jpg` | 1 080 509 | 1,03 Mio | JPG | `src/data/studioPillarsData.ts:730`, `src/data/studioPillarsData.ts:738` |
| 49 | `public/assets/directions/territoires-terroirs.jpg` | 1 077 716 | 1,03 Mio | JPG | `src/data/companyPortraitsData.ts:372`, `src/data/dimensionsData.ts:524`, `src/data/studioPillarsData.ts:302` |
| 50 | `public/assets/directions/expertises-securite.jpg` | 1 070 623 | 1,02 Mio | JPG | `src/data/dimensionsData.ts:686`, `src/data/studioPillarsData.ts:396` |
| 51 | `public/assets/posters/Benin < >.jpg` | 1 070 501 | 1,02 Mio | JPG | `src/components/PortfolioScreen.tsx:70`, `src/components/PortfolioScreen.tsx:186`, `src/components/TransactionsScreen.tsx:124` (+2 autres) |
| 52 | `public/assets/posters/benin-monde.jpg` | 1 070 501 | 1,02 Mio | JPG | `src/components/LegacyMarketplaceScreen.tsx:176`, `src/components/landing/DemoProductionsSection.tsx:85`, `src/data/dimensionsData.ts:268` (+3 autres) |
| 53 | `public/assets/images/kpedetin_joailliere_1792933718361.jpg` | 1 069 212 | 1,02 Mio | JPG | `src/components/SubmitStoryScreen.tsx:75`, `src/data/companyPortraitsData.ts:31`, `src/data/fourFacesFeedData.ts:96` (+3 autres) |
| 54 | `public/assets/images/bio_solaire_1792933744556.jpg` | 1 062 584 | 1,01 Mio | JPG | `src/data/companyPortraitsData.ts:32`, `src/data/thematicStoriesData.ts:325`, `src/services/authContext.tsx:38` (+3 autres) — ⚠️ préfixe `/public/` invalide en HTTP |
| 55 | `public/assets/directions/sagesses-resilience.jpg` | 1 061 764 | 1,01 Mio | JPG | `src/data/dimensionsData.ts:332`, `src/data/studioPillarsData.ts:184`, `src/data/studioPillarsData.ts:208` |
| 56 | `public/assets/images/studio_orga_quotidien_1792608958971.jpg` | 1 060 994 | 1,01 Mio | JPG | `src/data/studioPillarsData.ts:835` |
| 57 | `public/assets/images/fagnon_agronome_1792933698985.jpg` | 1 058 032 | 1,01 Mio | JPG | `src/components/SubmitStoryScreen.tsx:56`, `src/data/companyPortraitsData.ts:30`, `src/data/fourFacesFeedData.ts:66` (+7 autres) — ⚠️ préfixe `/public/` invalide en HTTP |
| 58 | `public/assets/directions/personnalites-arts.jpg` | 1 055 827 | 1,01 Mio | JPG | `src/data/companyPortraitsData.ts:512`, `src/data/dimensionsData.ts:1184`, `src/data/studioPillarsData.ts:458` |
| 59 | `public/assets/images/romeo_storyteller_1792933587573.jpg` | 1 052 141 | 1,00 Mio | JPG | `src/components/SubmitStoryScreen.tsx:55`, `src/data/fourFacesFeedData.ts:10`, `src/data/mockData.ts:881` (+1 autres) |
| 60 | `public/assets/posters/baobab-bambou.jpg` | 1 051 759 | 1,00 Mio | JPG | `src/components/LegacyMarketplaceScreen.tsx:220`, `src/components/landing/DemoProductionsSection.tsx:96`, `src/data/dimensionsData.ts:284` (+4 autres) |
| 61 | `public/assets/directions/marques-finance.jpg` | 1 049 818 | 1,00 Mio | JPG | `src/data/companyPortraitsData.ts:484`, `src/data/dimensionsData.ts:1082` |
| 62 | `public/assets/doors/door-marques.jpg` | 1 048 191 | 1023,62 Kio | JPG | `src/data/companyPortraitsData.ts:737`, `src/data/dimensionsData.ts:149` |
| 63 | `public/assets/duos/tobi-ganvie.jpg` | 1 045 899 | 1021,39 Kio | JPG | `src/data/explorerTopicsData.ts:1619`, `src/data/mockData.ts:2200`, `src/utils/transactionService.ts:131` |
| 64 | `public/assets/duos/tobi-houndegla.jpg` | 1 045 899 | 1021,39 Kio | JPG | `src/components/SubmitStoryScreen.tsx:66`, `src/data/fourFacesFeedData.ts:74`, `src/data/thematicStoriesData.ts:102` (+1 autres) |
| 65 | `public/assets/protagonists/tobi-ganvie.jpg` | 1 045 899 | 1021,39 Kio | JPG | `src/data/focusTopicsData.ts:397`, `src/data/matrixData.ts:484`, `src/data/matrixData.ts:931` (+6 autres) |
| 66 | `public/assets/protagonists/tobi-houndegla.jpg` | 1 045 899 | 1021,39 Kio | JPG | `src/data/explorerTopicsData.ts:1615`, `src/data/focusTopicsData.ts:284`, `src/data/matrixData.ts:502` (+10 autres) |
| 67 | `public/assets/directions/marques-beaute.jpg` | 1 037 074 | 1012,77 Kio | JPG | `src/data/companyPortraitsData.ts:386`, `src/data/dimensionsData.ts:1022` |
| 68 | `public/assets/images/recruit_videographer_1791825865262.jpg` | 1 036 198 | 1011,91 Kio | JPG | `src/data/studioPillarsData.ts:158` |
| 69 | `public/assets/images/senami_architecte_1792933801804.jpg` | 1 033 672 | 1009,45 Kio | JPG | `src/components/SubmitStoryScreen.tsx:60`, `src/data/companyPortraitsData.ts:35`, `src/data/mockData.ts:980` (+2 autres) — ⚠️ préfixe `/public/` invalide en HTTP |
| 70 | `public/assets/directions/produits-services-beaute.jpg` | 1 032 732 | 1008,53 Kio | JPG | `src/data/companyPortraitsData.ts:568`, `src/data/dimensionsData.ts:728`, `src/data/studioPillarsData.ts:574` (+1 autres) |
| 71 | `public/assets/images/romeo_dialogue_elders_1792698428934.jpg` | 1 030 946 | 1006,78 Kio | JPG | `src/components/landing/DemoProfilPascalSection.tsx:89`, `src/components/landing/DemoProfilPascalSection.tsx:153`, `src/components/landing/DemoProfilPascalSection.tsx:187` (+2 autres) |
| 72 | `public/assets/directions/projets-social.jpg` | 1 030 885 | 1006,72 Kio | JPG | `src/data/companyPortraitsData.ts:779`, `src/data/dimensionsData.ts:905`, `src/data/studioPillarsData.ts:676` |
| 73 | `public/assets/images/projets_social_1792086395729.jpg` | 1 030 885 | 1006,72 Kio | JPG | `src/data/studioPillarsData.ts:149` |
| 74 | `public/assets/directions/projets-jeux.jpg` | 1 029 031 | 1004,91 Kio | JPG | `src/data/dimensionsData.ts:860`, `src/data/studioPillarsData.ts:660` |
| 75 | `public/assets/images/studio_soi_parcours_1792608978314.jpg` | 1 028 120 | 1004,02 Kio | JPG | `src/data/studioPillarsData.ts:131` |
| 76 | `public/assets/directions/produits-services-garde-enfants.jpg` | 1 019 600 | 995,70 Kio | JPG | `src/data/dimensionsData.ts:803`, `src/data/studioPillarsData.ts:630` |
| 77 | `public/assets/doors/door-competences.jpg` | 1 015 573 | 991,77 Kio | JPG | `src/data/adminBackOfficeData.ts:213`, `src/data/companyPortraitsData.ts:681`, `src/data/dimensionsData.ts:104` |
| 78 | `public/assets/directions/sagesses-bienveillance.jpg` | 1 015 218 | 991,42 Kio | JPG | `src/data/dimensionsData.ts:407`, `src/data/studioPillarsData.ts:232` |
| 79 | `public/assets/duos/researcher-phd.jpg` | 1 007 791 | 984,17 Kio | JPG | `src/data/matrixData.ts:2717`, `src/data/mockData.ts:657`, `src/data/mockData.ts:680` (+12 autres) |
| 80 | `public/assets/posters/Focus/Lycees Behanzin et Toffa.png` | 1 000 120 | 976,68 Kio | PNG | `src/components/LegacyMarketplaceScreen.tsx:60`, `src/data/focusTopicsData.ts:189`, `src/data/studioPillarsData.ts:914` (+1 autres) |
| 81 | `public/assets/directions/projets-innovation.jpg` | 994 834 | 971,52 Kio | JPG | `src/data/companyPortraitsData.ts:470`, `src/data/dimensionsData.ts:935`, `src/data/studioPillarsData.ts:652` (+1 autres) |
| 82 | `public/assets/directions/expertises-sante.jpg` | 991 514 | 968,28 Kio | JPG | `src/data/companyPortraitsData.ts:414`, `src/data/dimensionsData.ts:671`, `src/data/studioPillarsData.ts:388` (+1 autres) |
| 83 | `public/assets/duos/fatou-diallo.jpg` | 989 432 | 966,24 Kio | JPG | `src/components/SubmitStoryScreen.tsx:80`, `src/components/landing/DemoProductionsSection.tsx:272`, `src/data/mockData.ts:471` (+6 autres) |
| 84 | `public/assets/protagonists/fatou-diallo.jpg` | 989 432 | 966,24 Kio | JPG | `src/components/matrix/LivingMatrixWall.tsx:149`, `src/data/focusTopicsData.ts:171`, `src/data/matrixData.ts:246` (+8 autres) |
| 85 | `public/assets/images/amara_andine_1792933642777.jpg` | 989 419 | 966,23 Kio | JPG | `src/components/SubmitStoryScreen.tsx:57`, `src/data/fourFacesFeedData.ts:107`, `src/data/fourFacesFeedData.ts:122` (+4 autres) |
| 86 | `public/assets/images/orga_transm_afro_1792611469008.jpg` | 988 070 | 964,91 Kio | JPG | `src/data/studioPillarsData.ts:746`, `src/data/studioPillarsData.ts:867` |
| 87 | `public/assets/directions/marques-services.jpg` | 984 435 | 961,36 Kio | JPG | `src/data/dimensionsData.ts:1097` |
| 88 | `public/assets/images/pillar_casting_phoenix.png` | 983 469 | 960,42 Kio | PNG | `src/components/SubmitStoryScreen.tsx:1525`, `src/components/SubmitStoryScreen.tsx:1783`, `src/data/studioPillarsData.ts:173` |
| 89 | `public/assets/doors/door-memoires.jpg` | 983 122 | 960,08 Kio | JPG | `src/data/adminBackOfficeData.ts:189`, `src/data/companyPortraitsData.ts:597` |
| 90 | `public/assets/doors/door-sagesses.jpg` | 983 122 | 960,08 Kio | JPG | `src/components/landing/DemoStudioSection.tsx:103`, `src/data/adminBackOfficeData.ts:175`, `src/data/companyPortraitsData.ts:611` (+2 autres) |
| 91 | `public/assets/duos/coach-office.jpg` | 980 351 | 957,37 Kio | JPG | `src/components/LegacyMarketplaceScreen.tsx:229`, `src/data/matrixData.ts:2401`, `src/data/mockData.ts:649` (+9 autres) |
| 92 | `public/assets/protagonists/coach-office.jpg` | 980 351 | 957,37 Kio | JPG | `src/data/focusTopicsData.ts:496`, `src/data/matrixData.ts:152`, `src/data/matrixData.ts:620` (+5 autres) |
| 93 | `public/assets/duos/duo_pere_matthieu_1791655226601.jpg` | 979 796 | 956,83 Kio | JPG | `src/components/SubmitStoryScreen.tsx:65`, `src/data/explorerTopicsData.ts:1623`, `src/data/fourFacesFeedData.ts:29` (+8 autres) |
| 94 | `public/assets/images/sika_tisserande_1792933605542.jpg` | 975 238 | 952,38 Kio | JPG | `src/components/SubmitStoryScreen.tsx:67`, `src/data/fourFacesFeedData.ts:40`, `src/data/mockData.ts:960` (+3 autres) |
| 95 | `public/assets/images/studio_orga_epreuves_1792608979150.jpg` | 974 973 | 952,12 Kio | JPG | `src/data/studioPillarsData.ts:843` |
| 96 | `public/assets/directions/projets-entreprise.jpg` | 972 960 | 950,16 Kio | JPG | `src/data/dimensionsData.ts:950`, `src/data/studioPillarsData.ts:700` |
| 97 | `public/assets/directions/territoires-patrimoine.jpg` | 967 561 | 944,88 Kio | JPG | `src/data/dimensionsData.ts:464`, `src/data/studioPillarsData.ts:270` |
| 98 | `public/assets/doors/door-offres.jpg` | 964 148 | 941,55 Kio | JPG | `src/data/dimensionsData.ts:119` |
| 99 | `public/assets/directions/expertises-justice.jpg` | 961 257 | 938,73 Kio | JPG | `src/data/dimensionsData.ts:656`, `src/data/studioPillarsData.ts:380`, `src/data/studioPillarsData.ts:520` |
| 100 | `public/assets/duos/codjo-blind.jpg` | 955 356 | 932,96 Kio | JPG | `src/components/LegacyMarketplaceScreen.tsx:218`, `src/components/ProfileSettingsScreen.tsx:1258`, `src/components/SubmitStoryScreen.tsx:69` (+14 autres) |
| 101 | `public/assets/protagonists/codjo-blind.jpg` | 955 356 | 932,96 Kio | JPG | `src/data/focusTopicsData.ts:89`, `src/data/focusTopicsData.ts:544`, `src/data/matrixData.ts:169` (+7 autres) |
| 102 | `public/assets/images/romeo_settling_studio_1792698427492.jpg` | 953 832 | 931,48 Kio | JPG | `src/components/landing/DemoProfilPascalSection.tsx:67`, `src/components/landing/DemoProfilPascalSection.tsx:99`, `src/components/landing/DemoProfilPascalSection.tsx:131` (+1 autres) |
| 103 | `public/assets/directions/personnalites-influenceurs.jpg` | 949 086 | 926,84 Kio | JPG | `src/data/dimensionsData.ts:1214`, `src/data/studioPillarsData.ts:474` |
| 104 | `public/assets/directions/projets-aventure.jpg` | 947 041 | 924,84 Kio | JPG | `src/data/companyPortraitsData.ts:723`, `src/data/dimensionsData.ts:965`, `src/data/studioPillarsData.ts:708` |
| 105 | `public/assets/protagonists/helene-saint-amand.jpg` | 937 917 | 915,93 Kio | JPG | `src/components/SubmitStoryScreen.tsx:61`, `src/data/focusTopicsData.ts:219`, `src/data/fourFacesFeedData.ts:141` (+11 autres) |
| 106 | `public/assets/posters/Focus/Apprentis.png` | 937 452 | 915,48 Kio | PNG | `src/components/LegacyMarketplaceScreen.tsx:67`, `src/data/focusTopicsData.ts:254`, `src/data/studioPillarsData.ts:922` (+1 autres) |
| 107 | `public/assets/images/beninois_pecheur_tobi_1792165042006.jpg` | 931 854 | 910,01 Kio | JPG | `src/data/explorerTopicsData.ts:1627`, `src/data/studioPillarsData.ts:512` |
| 108 | `public/assets/posters/Esu < > Jesus.png` | 921 340 | 899,75 Kio | PNG | `src/components/DocumentaryDetailScreen.tsx:136`, `src/components/PortfolioScreen.tsx:89`, `src/components/PortfolioScreen.tsx:203` (+1 autres) |
| 109 | `public/assets/posters/vodun-autre-foi.jpg` | 921 340 | 899,75 Kio | JPG | `src/data/mockData.ts:2639` |
| 110 | `public/assets/posters/vodun-autre-foi.png` | 921 340 | 899,75 Kio | PNG | `src/components/LegacyMarketplaceScreen.tsx:165`, `src/components/landing/DemoProductionsSection.tsx:30`, `src/data/dimensionsData.ts:188` (+2 autres) |
| 111 | `public/assets/directions/sagesses-pardon.jpg` | 918 778 | 897,24 Kio | JPG | `src/data/dimensionsData.ts:422`, `src/data/studioPillarsData.ts:240`, `src/data/studioPillarsData.ts:496` (+1 autres) |
| 112 | `public/assets/directions/produits-services-restauration.jpg` | 918 693 | 897,16 Kio | JPG | `src/data/companyPortraitsData.ts:498`, `src/data/dimensionsData.ts:743`, `src/data/dimensionsData.ts:1052` (+1 autres) |
| 113 | `public/assets/directions/produits-services-bien-etre.jpg` | 918 546 | 897,02 Kio | JPG | `src/data/companyPortraitsData.ts:667`, `src/data/dimensionsData.ts:773`, `src/data/studioPillarsData.ts:606` |
| 114 | `public/assets/protagonists/amara-tisserande.jpg` | 918 479 | 896,95 Kio | JPG | `src/components/PortraitsCircleView.tsx:825`, `src/components/ProfileSettingsScreen.tsx:333`, `src/components/matrix/LivingMatrixWall.tsx:147` (+10 autres) |
| 115 | `public/assets/directions/personnalites-cinema.jpg` | 917 486 | 895,98 Kio | JPG | `src/data/companyPortraitsData.ts:583`, `src/data/dimensionsData.ts:1169`, `src/data/studioPillarsData.ts:450` |
| 116 | `public/assets/posters/Focus/Marche Dantokpa.png` | 916 913 | 895,42 Kio | PNG | `src/components/LegacyMarketplaceScreen.tsx:46`, `src/data/focusTopicsData.ts:59`, `src/data/studioPillarsData.ts:890` (+2 autres) |
| 117 | `public/assets/posters/Focus/Danialou Sagbohan.png` | 915 837 | 894,37 Kio | PNG | `src/components/LegacyMarketplaceScreen.tsx:95`, `src/data/focusTopicsData.ts:514`, `src/data/studioPillarsData.ts:954` (+1 autres) |
| 118 | `public/assets/images/kiki_passeur_1792933820505.jpg` | 912 480 | 891,09 Kio | JPG | `src/data/companyPortraitsData.ts:36`, `src/data/mockData.ts:894`, `src/data/mockData.ts:1208` (+1 autres) — ⚠️ préfixe `/public/` invalide en HTTP |
| 119 | `public/assets/directions/expertises-business.jpg` | 910 813 | 889,47 Kio | JPG | `src/data/companyPortraitsData.ts:456`, `src/data/dimensionsData.ts:641`, `src/data/studioPillarsData.ts:356` |
| 120 | `public/assets/duos/malik-diop.jpg` | 907 633 | 886,36 Kio | JPG | `src/components/SubmitStoryScreen.tsx:70`, `src/data/fourFacesFeedData.ts:152`, `src/data/mockData.ts:901` (+2 autres) |
| 121 | `public/assets/protagonists/malik-diop.jpg` | 907 633 | 886,36 Kio | JPG | `src/components/matrix/LivingMatrixWall.tsx:151`, `src/data/focusTopicsData.ts:479`, `src/data/matrixData.ts:338` (+14 autres) |
| 122 | `public/assets/posters/Focus/Baccalaureat.png` | 907 533 | 886,26 Kio | PNG | `src/components/LegacyMarketplaceScreen.tsx:53`, `src/data/focusTopicsData.ts:124`, `src/data/studioPillarsData.ts:906` (+1 autres) |
| 123 | `public/assets/directions/produits-services-mode.jpg` | 906 227 | 884,99 Kio | JPG | `src/data/companyPortraitsData.ts:709`, `src/data/dimensionsData.ts:758`, `src/data/studioPillarsData.ts:598` |
| 124 | `public/assets/images/ps_mode_1792086355077.jpg` | 906 227 | 884,99 Kio | JPG | `src/data/studioPillarsData.ts:140` |
| 125 | `public/assets/directions/marques-tech.jpg` | 905 652 | 884,43 Kio | JPG | `src/data/dimensionsData.ts:1037` |
| 126 | `public/assets/images/marques_tech_1792086434196.jpg` | 905 652 | 884,43 Kio | JPG | `src/data/studioPillarsData.ts:859`, `src/data/thematicStoriesData.ts:65`, `src/services/authContext.tsx:279` — ⚠️ préfixe `/public/` invalide en HTTP |
| 127 | `public/assets/directions/produits-services-tourisme.jpg` | 905 540 | 884,32 Kio | JPG | `src/data/companyPortraitsData.ts:653`, `src/data/dimensionsData.ts:788`, `src/data/studioPillarsData.ts:614` |
| 128 | `public/assets/directions/marques-luxe.jpg` | 898 088 | 877,04 Kio | JPG | `src/data/companyPortraitsData.ts:625`, `src/data/dimensionsData.ts:992` |
| 129 | `public/assets/images/marques_luxe_1792086431681.jpg` | 898 088 | 877,04 Kio | JPG | `src/data/thematicStoriesData.ts:159` — ⚠️ préfixe `/public/` invalide en HTTP |
| 130 | `public/assets/images/beninoise_jeune_senan_1792165025309.jpg` | 895 866 | 874,87 Kio | JPG | `src/data/explorerTopicsData.ts:1626`, `src/data/studioPillarsData.ts:754` |
| 131 | `public/assets/protagonists/senan-agossa.jpg` | 895 866 | 874,87 Kio | JPG | `src/components/matrix/LivingMatrixWall.tsx:153`, `src/data/explorerTopicsData.ts:1614`, `src/data/focusTopicsData.ts:137` (+10 autres) |
| 132 | `public/assets/posters/Blacks One < > Beyond Eve.png` | 895 538 | 874,55 Kio | PNG | `src/components/PortfolioScreen.tsx:108`, `src/data/adminBackOfficeData.ts:470` |
| 133 | `public/assets/posters/blacks-one-amazones.png` | 895 538 | 874,55 Kio | PNG | `src/components/LegacyMarketplaceScreen.tsx:187`, `src/components/landing/DemoProductionsSection.tsx:74`, `src/data/dimensionsData.ts:252` (+3 autres) |
| 134 | `public/assets/images/romeo_lagoon_sunset_1792698428025.jpg` | 894 374 | 873,41 Kio | JPG | `src/components/landing/DemoProfilPascalSection.tsx:57`, `src/components/landing/DemoProfilPascalSection.tsx:77`, `src/components/landing/DemoProfilPascalSection.tsx:142` (+2 autres) |
| 135 | `public/assets/duos/mawuna-medium.jpg` | 891 088 | 870,20 Kio | JPG | `src/components/SubmitStoryScreen.tsx:72`, `src/data/explorerTopicsData.ts:1621`, `src/data/matrixData.ts:2121` (+5 autres) |
| 136 | `public/assets/protagonists/mawuna-medium.jpg` | 891 088 | 870,20 Kio | JPG | `src/components/matrix/LivingMatrixWall.tsx:152`, `src/data/matrixData.ts:356`, `src/data/matrixData.ts:805` (+6 autres) |
| 137 | `public/assets/duos/athlete-hurdle.jpg` | 890 939 | 870,06 Kio | JPG | `src/components/SubmitStoryScreen.tsx:79`, `src/data/matrixData.ts:2419`, `src/data/mockData.ts:2430` (+4 autres) |
| 138 | `public/assets/protagonists/athlete-hurdle.jpg` | 890 939 | 870,06 Kio | JPG | `src/data/focusTopicsData.ts:561`, `src/data/matrixData.ts:114`, `src/data/matrixData.ts:574` (+6 autres) |
| 139 | `public/assets/directions/sagesses-perseverance.jpg` | 888 328 | 867,51 Kio | JPG | `src/data/dimensionsData.ts:392`, `src/data/studioPillarsData.ts:200`, `src/data/studioPillarsData.ts:504` |
| 140 | `public/assets/duos/dah-zounon.jpg` | 888 328 | 867,51 Kio | JPG | `src/data/matrixData.ts:45`, `src/data/studioPillarsData.ts:544`, `src/utils/lineageService.ts:66` |
| 141 | `public/assets/images/beninois_sage_dossou_1792165004493.jpg` | 888 328 | 867,51 Kio | JPG | `src/data/explorerTopicsData.ts:1625` |
| 142 | `public/assets/protagonists/mahougnon-zounon.jpg` | 888 328 | 867,51 Kio | JPG | `src/data/focusTopicsData.ts:349`, `src/data/focusTopicsData.ts:527`, `src/data/matrixData.ts:319` (+7 autres) |
| 143 | `public/assets/posters/Focus/Sodabi.png` | 884 608 | 863,88 Kio | PNG | `src/components/LegacyMarketplaceScreen.tsx:74`, `src/data/focusTopicsData.ts:319`, `src/data/studioPillarsData.ts:930` (+1 autres) |
| 144 | `public/assets/duos/mahougnon_esu_portrait_1791701582891.jpg` | 884 517 | 863,79 Kio | JPG | `src/components/PortfolioScreen.tsx:200`, `src/components/SubmitStoryScreen.tsx:64`, `src/data/explorerTopicsData.ts:1613` (+12 autres) |
| 145 | `public/assets/directions/marques-sport.jpg` | 882 336 | 861,66 Kio | JPG | `src/data/dimensionsData.ts:1067` |
| 146 | `public/assets/duos/kwame-mensah.jpg` | 882 039 | 861,37 Kio | JPG | `src/components/SubmitStoryScreen.tsx:58`, `src/components/landing/DemoEntrepriseSection.tsx:52`, `src/components/landing/DemoProfilPascalSection.tsx:422` (+7 autres) |
| 147 | `public/assets/protagonists/kwame-mensah.jpg` | 882 039 | 861,37 Kio | JPG | `src/components/PortraitsCircleView.tsx:824`, `src/components/matrix/LivingMatrixWall.tsx:146`, `src/data/focusTopicsData.ts:202` (+9 autres) |
| 148 | `public/assets/directions/personnalites-engagement.jpg` | 879 883 | 859,26 Kio | JPG | `src/data/companyPortraitsData.ts:540`, `src/data/dimensionsData.ts:1124`, `src/data/studioPillarsData.ts:418` (+1 autres) |
| 149 | `public/assets/directions/personnalites-sport.jpg` | 879 592 | 858,98 Kio | JPG | `src/data/dimensionsData.ts:1199`, `src/data/studioPillarsData.ts:466` |
| 150 | `public/assets/images/romeo_arriving_cotonou_1792698426939.jpg` | 877 728 | 857,16 Kio | JPG | `src/components/landing/DemoProfilPascalSection.tsx:47`, `src/components/landing/DemoProfilPascalSection.tsx:119`, `src/components/landing/DemoProfilPascalSection.tsx:164` (+2 autres) |
| 151 | `public/assets/directions/marques-mode.jpg` | 872 260 | 851,82 Kio | JPG | `src/data/dimensionsData.ts:1007` |
| 152 | `public/assets/posters/Focus/Ganvie.png` | 868 999 | 848,63 Kio | PNG | `src/components/LegacyMarketplaceScreen.tsx:81`, `src/data/focusTopicsData.ts:384`, `src/data/studioPillarsData.ts:938` (+1 autres) |
| 153 | `public/assets/directions/produits-services-conciergerie.jpg` | 858 371 | 838,25 Kio | JPG | `src/data/companyPortraitsData.ts:751`, `src/data/dimensionsData.ts:818`, `src/data/studioPillarsData.ts:622` |
| 154 | `public/assets/posters/Fiat Luxe < > Street.jpg` | 857 103 | 837,01 Kio | JPG | `src/components/PortfolioScreen.tsx:127`, `src/data/adminBackOfficeData.ts:492` |
| 155 | `public/assets/posters/fiat-luxe-builders.png` | 857 103 | 837,01 Kio | PNG | `src/components/LegacyMarketplaceScreen.tsx:198`, `src/components/landing/DemoProductionsSection.tsx:63`, `src/data/dimensionsData.ts:236` (+3 autres) |
| 156 | `public/assets/images/pro_shoot_story.jpg` | 853 859 | 833,85 Kio | JPG | `src/components/SubmitStoryScreen.tsx:1374` |
| 157 | `public/assets/posters/Focus/Angelique Kidjo.png` | 852 486 | 832,51 Kio | PNG | `src/components/LegacyMarketplaceScreen.tsx:88`, `src/data/focusTopicsData.ts:449`, `src/data/studioPillarsData.ts:946` (+1 autres) |
| 158 | `public/assets/posters/roots-routes.jpg` | 848 929 | 829,03 Kio | JPG | `src/components/LegacyMarketplaceScreen.tsx:209`, `src/components/landing/DemoProductionsSection.tsx:41`, `src/data/dimensionsData.ts:204` (+3 autres) |
| 159 | `public/assets/directions/personnalites-foi.jpg` | 847 701 | 827,83 Kio | JPG | `src/data/dimensionsData.ts:1229`, `src/data/studioPillarsData.ts:482` |
| 160 | `public/assets/images/selfie_video_story.jpg` | 847 206 | 827,35 Kio | JPG | `src/components/EditorialBackOfficeScreen.tsx:278`, `src/components/SettingsScreen.tsx:494`, `src/components/SubmitStoryScreen.tsx:867` (+1 autres) |
| 161 | `public/assets/doors/door-personnalites.jpg` | 845 596 | 825,78 Kio | JPG | `src/data/dimensionsData.ts:164` |
| 162 | `public/assets/posters/Focus < >  PhD.jpg` | 835 090 | 815,52 Kio | JPG | `src/data/adminBackOfficeData.ts:558` |
| 163 | `public/assets/posters/pictures-words.jpg` | 835 090 | 815,52 Kio | JPG | `src/components/LegacyMarketplaceScreen.tsx:242`, `src/components/landing/DemoProductionsSection.tsx:107`, `src/data/dimensionsData.ts:300` (+6 autres) |
| 164 | `public/assets/images/dossou_logistique_1792933781153.jpg` | 833 751 | 814,21 Kio | JPG | `src/components/SubmitStoryScreen.tsx:81`, `src/data/companyPortraitsData.ts:34`, `src/data/mockData.ts:1072` (+1 autres) |
| 165 | `public/assets/duos/eleonore-vance.jpg` | 828 007 | 808,60 Kio | JPG | `src/components/SubmitStoryScreen.tsx:71`, `src/data/fourFacesFeedData.ts:163`, `src/data/thematicStoriesData.ts:56` (+1 autres) |
| 166 | `public/assets/protagonists/eleonore-vance.jpg` | 828 007 | 808,60 Kio | JPG | `src/data/focusTopicsData.ts:462`, `src/data/matrixData.ts:227`, `src/data/matrixData.ts:672` (+13 autres) |
| 167 | `public/assets/images/beninoise_femme_sika_1792164985263.jpg` | 820 480 | 801,25 Kio | JPG | `src/data/explorerTopicsData.ts:1624`, `src/data/studioPillarsData.ts:770` |
| 168 | `public/assets/protagonists/sika-dossou.jpg` | 820 480 | 801,25 Kio | JPG | `src/data/explorerTopicsData.ts:1612`, `src/data/focusTopicsData.ts:72`, `src/data/focusTopicsData.ts:267` (+8 autres) |
| 169 | `public/assets/posters/Builders < > Seekers.png` | 814 383 | 795,30 Kio | PNG | `src/data/adminBackOfficeData.ts:536` |
| 170 | `public/assets/posters/coaching-phd.png` | 814 383 | 795,30 Kio | PNG | `src/components/LegacyMarketplaceScreen.tsx:231`, `src/components/landing/DemoProductionsSection.tsx:52`, `src/data/dimensionsData.ts:220` (+5 autres) |
| 171 | `public/assets/directions/produits-services-immobilier.jpg` | 812 784 | 793,73 Kio | JPG | `src/data/dimensionsData.ts:833`, `src/data/studioPillarsData.ts:638` |
| 172 | `public/assets/protagonists/armel-hounkpatin.jpg` | 788 437 | 769,96 Kio | JPG | `src/components/landing/DemoEntrepriseSection.tsx:62`, `src/data/actionShareholdersData.ts:29`, `src/data/explorerTopicsData.ts:1617` (+10 autres) |
| 173 | `public/assets/images/senan_innovatrice_1792933679487.jpg` | 780 190 | 761,90 Kio | JPG | `src/components/SubmitStoryScreen.tsx:68`, `src/data/companyPortraitsData.ts:29`, `src/data/fourFacesFeedData.ts:51` (+3 autres) |
| 174 | `public/assets/doors/door-series.jpg` | 763 606 | 745,71 Kio | JPG | `src/data/dimensionsData.ts:59`, `src/data/proposeDoorsData.ts:189` |
| 175 | `public/assets/doors/door-territoires.jpg` | 743 425 | 726,00 Kio | JPG | `src/data/adminBackOfficeData.ts:201`, `src/data/companyPortraitsData.ts:793`, `src/data/dimensionsData.ts:89` |
| 176 | `public/assets/images/romeo_avatar_1792698425983.jpg` | 738 035 | 720,74 Kio | JPG | `src/components/ProfileLineageFrise.tsx:101`, `src/components/ProfileLineageFrise.tsx:1258`, `src/components/ProfileSettingsScreen.tsx:233` (+8 autres) |
| 177 | `public/assets/posters/Diasporas < > Makers.jpg` | 452 065 | 441,47 Kio | JPG | `src/components/PortfolioScreen.tsx:146`, `src/components/PortfolioScreen.tsx:220`, `src/data/adminBackOfficeData.ts:426` |
| 178 | `public/assets/posters/Coaching ‹ › PhD.jpg` | 371 563 | 362,85 Kio | JPG | `src/components/LegacyMarketplaceScreen.tsx:117`, `src/data/studioPillarsData.ts:67` |
| 179 | `public/assets/posters/Benin ‹ › Le Monde.jpg` | 362 464 | 353,97 Kio | JPG | `src/components/LegacyMarketplaceScreen.tsx:152`, `src/data/mockData.ts:144`, `src/data/mockData.ts:145` (+1 autres) |
| 180 | `public/assets/posters/Fiat Luxe ‹ › Builders.jpg` | 356 591 | 348,23 Kio | JPG | `src/components/LegacyMarketplaceScreen.tsx:138`, `src/data/mockData.ts:355`, `src/data/mockData.ts:356` (+1 autres) |
| 181 | `public/assets/posters/Baobabs ‹ › Bambous.jpg` | 339 133 | 331,18 Kio | JPG | `src/components/LegacyMarketplaceScreen.tsx:110`, `src/data/mockData.ts:563`, `src/data/mockData.ts:564` (+1 autres) |
| 182 | `public/assets/posters/Pictures ‹ › Words.jpg` | 331 867 | 324,09 Kio | JPG | `src/components/LegacyMarketplaceScreen.tsx:145`, `src/data/studioPillarsData.ts:99` |

## 5. Vérification des références dynamiques (`INCERTAIN`)

Recherche effectuée sur tous les littéraux gabarits, concaténations (`+`), `encodeURI(...)`, `import.meta.glob(...)`, CSS `url(...)` et tableaux de données dans `src/`, `scripts/`, `index.html`, `vite.config.ts`, `server.ts` et `public/manifest.json` :

1. **`src/components/MatrixExplorer.tsx:1835`** : `activeCoverImage={activeCategory === 'series' ? (activeTopicItem?.photoUrl || `/assets/posters/${selectedSeriesId}.png`) : ...}`. Cette construction dynamique peut résoudre des `.png` dans `public/assets/posters/` non cités en dur. Les **7 fichiers** correspondants à des identifiants de séries connus sans référence directe en dur sont classés **`INCERTAIN`** :
   - `public/assets/posters/benin-monde.png` (1,02 Mio) — Chemin dynamique `src/components/MatrixExplorer.tsx:1835` (`/assets/posters/${selectedSeriesId}.png`) pour la série `benin-monde` (fallback si `photoUrl` absent).
   - `public/assets/posters/finagnon-qosqorico.png` (1,02 Mio) — Chemin dynamique `src/components/MatrixExplorer.tsx:1835` (`/assets/posters/${selectedSeriesId}.png`) pour la série `finagnon-qosqorico` (fallback si `photoUrl` absent).
   - `public/assets/posters/other-eyes-sixth-sense.png` (1,00 Mio) — Chemin dynamique `src/components/MatrixExplorer.tsx:1835` (`/assets/posters/${selectedSeriesId}.png`) pour la série `other-eyes-sixth-sense` (fallback si `photoUrl` absent).
   - `public/assets/posters/jesus-legba.png` (899,75 Kio) — Chemin dynamique `src/components/MatrixExplorer.tsx:1835` (`/assets/posters/${selectedSeriesId}.png`) pour la série `jesus-legba` (fallback si `photoUrl` absent).
   - `public/assets/posters/blacks-one-beyond-eve.png` (874,55 Kio) — Chemin dynamique `src/components/MatrixExplorer.tsx:1835` (`/assets/posters/${selectedSeriesId}.png`) pour la série `blacks-one-beyond-eve` (fallback si `photoUrl` absent).
   - `public/assets/posters/dixeat-fiat-luxe.png` (837,01 Kio) — Chemin dynamique `src/components/MatrixExplorer.tsx:1835` (`/assets/posters/${selectedSeriesId}.png`) pour la série `dixeat-fiat-luxe` (fallback si `photoUrl` absent).
   - `public/assets/posters/investors-builders.png` (795,30 Kio) — Chemin dynamique `src/components/MatrixExplorer.tsx:1835` (`/assets/posters/${selectedSeriesId}.png`) pour la série `investors-builders` (fallback si `photoUrl` absent).
2. **`public/assets/icons/` (76 fichiers SVG)** : aucune référence ni construction dynamique trouvée dans `src/`. Les icônes de l'Astrolabe sont intégrées en SVG inline dans `src/components/DimensionIcon.tsx` (`SVG_ICONS_INNER`), rendant les SVG statiques de `public/assets/icons/` probablement inutilisés.
3. **`public/assets/brand-logos/*.svg` (16 SVG)** : aucune référence ni construction dynamique trouvée ; `src/data/companyPortraitsData.ts` utilise uniquement les 16 versions `.png`.
4. **`public/assets/posters/*.webp` (15 WebP)** : aucune référence ni substitution `.webp` trouvée dans le code.

## 6. Inventaire complet des 385 fichiers de `public/` (triés par poids décroissant)

| # | Chemin | Poids (octets) | Poids | Statut | Précache SW | Référence (`fichier:ligne`) / Explication |
|---:|---|---:|---|---|---|---|
| 1 | `public/assets/Onboardings/Voyage.png` | 3 711 940 | 3,54 Mio | **UTILISÉ** | Non | `src/components/landing/DemoEntrepriseSection.tsx:33` *(composant legacy/non monté uniquement)* |
| 2 | `public/assets/posters/Blacks One ‹ › Amazones.png` | 2 708 431 | 2,58 Mio | **UTILISÉ** | Non | `src/components/LegacyMarketplaceScreen.tsx:103`, `src/data/mockData.ts:242`, `src/data/mockData.ts:243` (+1 autres) |
| 3 | `public/assets/posters/Coaching < > Sans Limites.png` | 2 705 293 | 2,58 Mio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/posters/Coaching < > Unlimited.png`). |
| 4 | `public/assets/posters/Coaching < > Unlimited.png` | 2 705 293 | 2,58 Mio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/posters/Coaching < > Sans Limites.png`). |
| 5 | `public/assets/posters/coaching-sans-limites.png` | 2 705 293 | 2,58 Mio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/posters/Coaching < > Sans Limites.png`). |
| 6 | `public/assets/posters/coaching-unlimited.png` | 2 705 293 | 2,58 Mio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/posters/Coaching < > Sans Limites.png`). |
| 7 | `public/assets/posters/Investors < > Builders.png` | 2 689 812 | 2,57 Mio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 8 | `public/assets/posters/Roots < > Routes.png` | 2 671 729 | 2,55 Mio | **UTILISÉ** | Non | `src/components/LegacyMarketplaceScreen.tsx:131`, `src/data/mockData.ts:448`, `src/data/mockData.ts:449` (+1 autres) |
| 9 | `public/assets/posters/Vodun Rays ‹ › Autre Foi.png` | 2 660 148 | 2,54 Mio | **UTILISÉ** | Non | `src/components/LegacyMarketplaceScreen.tsx:124`, `src/data/mockData.ts:23`, `src/data/mockData.ts:24` (+1 autres) |
| 10 | `public/assets/posters/jesus-esu.png` | 2 660 148 | 2,54 Mio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/posters/Vodun Rays ‹ › Autre Foi.png`). |
| 11 | `public/assets/posters/Finagnon < > Qosqorico.png` | 2 478 629 | 2,36 Mio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 12 | `public/assets/posters/Focus < >  PhD.png` | 2 436 863 | 2,32 Mio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 13 | `public/assets/posters/E Vivi < > Fiat Luxe.png` | 2 281 961 | 2,18 Mio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/posters/e-vivi-fiat-luxe.png`). |
| 14 | `public/assets/posters/e-vivi-fiat-luxe.png` | 2 281 961 | 2,18 Mio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/posters/E Vivi < > Fiat Luxe.png`). |
| 15 | `public/assets/posters/Other Eyes < > Third Eye.png` | 2 100 559 | 2,00 Mio | **UTILISÉ** | Non | `src/components/PortfolioScreen.tsx:165`, `src/data/adminBackOfficeData.ts:514` |
| 16 | `public/assets/posters/Other eyes < > Sixth sense.png` | 2 100 559 | 2,00 Mio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/posters/Other Eyes < > Third Eye.png`). |
| 17 | `public/assets/posters/other-eyes-third-eye.png` | 2 100 559 | 2,00 Mio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/posters/Other Eyes < > Third Eye.png`). |
| 18 | `public/assets/images/pillar_org_afro_1792601150815.jpg` | 1 277 746 | 1,22 Mio | **UTILISÉ** | Non | `src/data/studioPillarsData.ts:811` |
| 19 | `public/assets/images/pillar_duos_afro_1792601147557.jpg` | 1 255 896 | 1,20 Mio | **UTILISÉ** | Non | `src/data/studioPillarsData.ts:43` |
| 20 | `public/assets/images/pillar_soi_afro_1792601150131.jpg` | 1 255 045 | 1,20 Mio | **UTILISÉ** | Non | `src/data/studioPillarsData.ts:122` |
| 21 | `public/assets/images/koffi_tisserand_1792933625628.jpg` | 1 252 057 | 1,19 Mio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 22 | `public/assets/images/studio_orga_valeurs_1792608959843.jpg` | 1 213 750 | 1,16 Mio | **UTILISÉ** | Non | `src/data/studioPillarsData.ts:827` |
| 23 | `public/assets/duos/chef-koffi.jpg` | 1 206 189 | 1,15 Mio | **UTILISÉ** | Non | `src/components/SubmitStoryScreen.tsx:59`, `src/components/landing/DemoProductionsSection.tsx:271`, `src/data/explorerTopicsData.ts:1620` |
| 24 | `public/assets/protagonists/chef-koffi.jpg` | 1 206 189 | 1,15 Mio | **UTILISÉ** | Non | `src/components/PortraitsCircleView.tsx:823`, `src/components/matrix/LivingMatrixWall.tsx:145`, `src/data/focusTopicsData.ts:366` (+10 autres) |
| 25 | `public/assets/directions/sagesses-humilite.jpg` | 1 204 525 | 1,15 Mio | **UTILISÉ** | Non | `src/data/dimensionsData.ts:437`, `src/data/studioPillarsData.ts:248` |
| 26 | `public/assets/images/marques_alimentation_1792086435220.jpg` | 1 197 031 | 1,14 Mio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 27 | `public/assets/directions/sagesses-gratitude.jpg` | 1 191 970 | 1,14 Mio | **UTILISÉ** | Non | `src/data/dimensionsData.ts:377`, `src/data/studioPillarsData.ts:224` |
| 28 | `public/assets/images/koffi_portonovo_1792933660999.jpg` | 1 188 058 | 1,13 Mio | **UTILISÉ** | Non | `src/components/SubmitStoryScreen.tsx:74`, `src/data/mockData.ts:1061`, `src/data/mockData.ts:1172` (+3 autres) |
| 29 | `public/assets/duos/photographer-focus.jpg` | 1 174 172 | 1,12 Mio | **UTILISÉ** | Non | `src/components/LegacyMarketplaceScreen.tsx:240`, `src/components/SubmitStoryScreen.tsx:78`, `src/data/matrixData.ts:2699` (+12 autres) |
| 30 | `public/assets/protagonists/photographer-focus.jpg` | 1 174 172 | 1,12 Mio | **UTILISÉ** | Non | `src/data/matrixData.ts:394`, `src/data/matrixData.ts:841`, `src/data/matrixData.ts:1322` (+5 autres) |
| 31 | `public/assets/directions/sagesses-amour.jpg` | 1 170 514 | 1,12 Mio | **UTILISÉ** | Non | `src/data/dimensionsData.ts:347`, `src/data/studioPillarsData.ts:192` |
| 32 | `public/assets/directions/projets-culture.jpg` | 1 169 689 | 1,12 Mio | **UTILISÉ** | Non | `src/data/dimensionsData.ts:890`, `src/data/studioPillarsData.ts:716` |
| 33 | `public/assets/directions/projets-communautaire.jpg` | 1 153 833 | 1,10 Mio | **UTILISÉ** | Non | `src/data/dimensionsData.ts:920`, `src/data/studioPillarsData.ts:684`, `src/data/studioPillarsData.ts:786` |
| 34 | `public/assets/directions/expertises-artisanat.jpg` | 1 148 235 | 1,10 Mio | **UTILISÉ** | Non | `src/data/companyPortraitsData.ts:400`, `src/data/dimensionsData.ts:596`, `src/data/studioPillarsData.ts:340` (+1 autres) |
| 35 | `public/assets/images/expertises_artisanat_1792085293909.jpg` | 1 148 235 | 1,10 Mio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/directions/expertises-artisanat.jpg`). |
| 36 | `public/assets/duos/pere-matthieu.jpg` | 1 139 999 | 1,09 Mio | **UTILISÉ** | Non | `src/data/matrixData.ts:209`, `src/data/seriesTeamData.ts:30`, `src/utils/lineageService.ts:146` |
| 37 | `public/assets/protagonists/pere-matthieu.jpg` | 1 139 999 | 1,09 Mio | **UTILISÉ** | Non | `src/data/matrixData.ts:373`, `src/data/matrixData.ts:823`, `src/data/matrixData.ts:1304` (+5 autres) |
| 38 | `public/assets/directions/territoires-traditions.jpg` | 1 136 733 | 1,08 Mio | **UTILISÉ** | Non | `src/data/companyPortraitsData.ts:639`, `src/data/dimensionsData.ts:479`, `src/data/studioPillarsData.ts:262` (+1 autres) |
| 39 | `public/assets/images/territoires_traditions_1792085253556.jpg` | 1 136 733 | 1,08 Mio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/directions/territoires-traditions.jpg`). |
| 40 | `public/sample.mp4` | 1 128 375 | 1,08 Mio | **UTILISÉ** | Non | `src/components/DuoFeedScreen.tsx:434`, `src/components/FocusScreen.tsx:568`, `src/components/FocusVideoCard.tsx:64` (+224 autres) |
| 41 | `public/assets/directions/territoires-langues.jpg` | 1 125 630 | 1,07 Mio | **UTILISÉ** | Non | `src/data/dimensionsData.ts:539`, `src/data/studioPillarsData.ts:310` |
| 42 | `public/assets/doors/door-projets.jpg` | 1 121 022 | 1,07 Mio | **UTILISÉ** | Non | `src/data/adminBackOfficeData.ts:227`, `src/data/dimensionsData.ts:134` |
| 43 | `public/assets/directions/personnalites-musique.jpg` | 1 120 811 | 1,07 Mio | **UTILISÉ** | Non | `src/data/companyPortraitsData.ts:428`, `src/data/dimensionsData.ts:1154`, `src/data/studioPillarsData.ts:442` |
| 44 | `public/assets/protagonists/dah-zounon.jpg` | 1 119 852 | 1,07 Mio | **UTILISÉ** | Non | `src/components/PortraitsCircleView.tsx:826`, `src/components/matrix/LivingMatrixWall.tsx:148`, `src/data/focusTopicsData.ts:236` (+8 autres) |
| 45 | `public/assets/directions/territoires-histoire.jpg` | 1 116 592 | 1,06 Mio | **UTILISÉ** | Non | `src/data/companyPortraitsData.ts:695`, `src/data/dimensionsData.ts:509`, `src/data/studioPillarsData.ts:294` |
| 46 | `public/assets/directions/expertises-numerique.jpg` | 1 115 074 | 1,06 Mio | **UTILISÉ** | Non | `src/data/companyPortraitsData.ts:358`, `src/data/dimensionsData.ts:626`, `src/data/studioPillarsData.ts:372` |
| 47 | `public/assets/directions/territoires-habitudes.jpg` | 1 113 206 | 1,06 Mio | **UTILISÉ** | Non | `src/data/dimensionsData.ts:569`, `src/data/studioPillarsData.ts:326` |
| 48 | `public/assets/directions/territoires-culture.jpg` | 1 112 507 | 1,06 Mio | **UTILISÉ** | Non | `src/data/companyPortraitsData.ts:526`, `src/data/dimensionsData.ts:494`, `src/data/studioPillarsData.ts:286` |
| 49 | `public/assets/directions/expertises-education.jpg` | 1 104 036 | 1,05 Mio | **UTILISÉ** | Non | `src/data/dimensionsData.ts:611`, `src/data/studioPillarsData.ts:364` |
| 50 | `public/assets/protagonists/researcher-phd.jpg` | 1 103 749 | 1,05 Mio | **UTILISÉ** | Non | `src/data/matrixData.ts:412`, `src/data/matrixData.ts:859`, `src/data/matrixData.ts:1340` (+5 autres) |
| 51 | `public/assets/directions/projets-ecologie.jpg` | 1 100 968 | 1,05 Mio | **UTILISÉ** | Non | `src/data/companyPortraitsData.ts:442`, `src/data/dimensionsData.ts:875`, `src/data/studioPillarsData.ts:668` |
| 52 | `public/assets/images/projets_ecologie_1792086393821.jpg` | 1 100 968 | 1,05 Mio | **UTILISÉ** | Non | `src/data/studioPillarsData.ts:875` |
| 53 | `public/assets/protagonists/koffi-tisserand.jpg` | 1 098 539 | 1,05 Mio | **UTILISÉ** | Non | `src/components/PortfolioScreen.tsx:217`, `src/components/ProtagonistTeaserModal.tsx:77`, `src/components/matrix/LivingMatrixWall.tsx:150` (+11 autres) |
| 54 | `public/assets/images/studio_orga_origines_1792608957920.jpg` | 1 097 856 | 1,05 Mio | **UTILISÉ** | Non | `src/data/studioPillarsData.ts:819` |
| 55 | `public/assets/duos/sayri-quispe.jpg` | 1 096 902 | 1,05 Mio | **UTILISÉ** | Non | `src/components/SubmitStoryScreen.tsx:73`, `src/data/fourFacesFeedData.ts:85`, `src/data/thematicStoriesData.ts:150` (+1 autres) |
| 56 | `public/assets/protagonists/sayri-quispe.jpg` | 1 096 902 | 1,05 Mio | **UTILISÉ** | Non | `src/components/PortfolioScreen.tsx:183`, `src/data/matrixData.ts:430`, `src/data/matrixData.ts:877` (+9 autres) |
| 57 | `public/assets/directions/expertises-design.jpg` | 1 096 841 | 1,05 Mio | **UTILISÉ** | Non | `src/data/companyPortraitsData.ts:765`, `src/data/dimensionsData.ts:701`, `src/data/studioPillarsData.ts:404` |
| 58 | `public/assets/protagonists/adjovi-blandine.jpg` | 1 094 002 | 1,04 Mio | **UTILISÉ** | Non | `src/components/PortraitsCircleView.tsx:822`, `src/components/landing/DemoEntrepriseSection.tsx:42`, `src/components/landing/DemoProfilPascalSection.tsx:398` (+13 autres) |
| 59 | `public/assets/directions/personnalites-legendes.jpg` | 1 091 226 | 1,04 Mio | **UTILISÉ** | Non | `src/data/dimensionsData.ts:1139`, `src/data/studioPillarsData.ts:434` |
| 60 | `public/assets/images/ayaba_nectar_1792933764727.jpg` | 1 084 969 | 1,03 Mio | **UTILISÉ** | Non | `src/components/SubmitStoryScreen.tsx:82`, `src/data/companyPortraitsData.ts:33`, `src/data/mockData.ts:971` (+2 autres) |
| 61 | `public/assets/directions/sagesses-solidarite.jpg` | 1 084 310 | 1,03 Mio | **UTILISÉ** | Non | `src/data/companyPortraitsData.ts:554`, `src/data/dimensionsData.ts:362`, `src/data/studioPillarsData.ts:216` |
| 62 | `public/assets/protagonists/pascal-parcours-fa.jpg` | 1 083 493 | 1,03 Mio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 63 | `public/assets/images/orga_rencontres_afro_1792611454422.jpg` | 1 083 165 | 1,03 Mio | **UTILISÉ** | Non | `src/data/studioPillarsData.ts:778`, `src/data/studioPillarsData.ts:851` |
| 64 | `public/assets/directions/territoires-diaspora.jpg` | 1 082 144 | 1,03 Mio | **UTILISÉ** | Non | `src/data/dimensionsData.ts:554`, `src/data/studioPillarsData.ts:318` |
| 65 | `public/assets/images/home_afro_storyteller_1792193575638.jpg` | 1 080 509 | 1,03 Mio | **UTILISÉ** | Non | `src/data/studioPillarsData.ts:730`, `src/data/studioPillarsData.ts:738` |
| 66 | `public/assets/directions/territoires-terroirs.jpg` | 1 077 716 | 1,03 Mio | **UTILISÉ** | Non | `src/data/companyPortraitsData.ts:372`, `src/data/dimensionsData.ts:524`, `src/data/studioPillarsData.ts:302` |
| 67 | `public/assets/directions/expertises-securite.jpg` | 1 070 623 | 1,02 Mio | **UTILISÉ** | Non | `src/data/dimensionsData.ts:686`, `src/data/studioPillarsData.ts:396` |
| 68 | `public/assets/posters/Benin < >.jpg` | 1 070 501 | 1,02 Mio | **UTILISÉ** | Non | `src/components/PortfolioScreen.tsx:70`, `src/components/PortfolioScreen.tsx:186`, `src/components/TransactionsScreen.tsx:124` (+2 autres) |
| 69 | `public/assets/posters/Finagnon < > Qosqorico.jpg` | 1 070 501 | 1,02 Mio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/posters/Benin < >.jpg`). |
| 70 | `public/assets/posters/benin-monde.jpg` | 1 070 501 | 1,02 Mio | **UTILISÉ** | Non | `src/components/LegacyMarketplaceScreen.tsx:176`, `src/components/landing/DemoProductionsSection.tsx:85`, `src/data/dimensionsData.ts:268` (+3 autres) |
| 71 | `public/assets/posters/benin-monde.png` | 1 070 501 | 1,02 Mio | **INCERTAIN** | Non | Chemin dynamique `src/components/MatrixExplorer.tsx:1835` (`/assets/posters/${selectedSeriesId}.png`) pour la série `benin-monde` (fallback si `photoUrl` absent). |
| 72 | `public/assets/posters/finagnon-qosqorico.png` | 1 070 501 | 1,02 Mio | **INCERTAIN** | Non | Chemin dynamique `src/components/MatrixExplorer.tsx:1835` (`/assets/posters/${selectedSeriesId}.png`) pour la série `finagnon-qosqorico` (fallback si `photoUrl` absent). |
| 73 | `public/assets/images/kpedetin_joailliere_1792933718361.jpg` | 1 069 212 | 1,02 Mio | **UTILISÉ** | Non | `src/components/SubmitStoryScreen.tsx:75`, `src/data/companyPortraitsData.ts:31`, `src/data/fourFacesFeedData.ts:96` (+3 autres) |
| 74 | `public/assets/images/bio_solaire_1792933744556.jpg` | 1 062 584 | 1,01 Mio | **UTILISÉ** | Non | `src/data/companyPortraitsData.ts:32`, `src/data/thematicStoriesData.ts:325`, `src/services/authContext.tsx:38` (+3 autres) — ⚠️ préfixe `/public/` invalide en HTTP |
| 75 | `public/assets/directions/sagesses-resilience.jpg` | 1 061 764 | 1,01 Mio | **UTILISÉ** | Non | `src/data/dimensionsData.ts:332`, `src/data/studioPillarsData.ts:184`, `src/data/studioPillarsData.ts:208` |
| 76 | `public/assets/images/sagesses_resilience_1792083778313.jpg` | 1 061 764 | 1,01 Mio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/directions/sagesses-resilience.jpg`). |
| 77 | `public/assets/protagonists/pascal-produits-paniers.jpg` | 1 061 166 | 1,01 Mio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 78 | `public/assets/images/studio_orga_quotidien_1792608958971.jpg` | 1 060 994 | 1,01 Mio | **UTILISÉ** | Non | `src/data/studioPillarsData.ts:835` |
| 79 | `public/assets/images/fagnon_agronome_1792933698985.jpg` | 1 058 032 | 1,01 Mio | **UTILISÉ** | Non | `src/components/SubmitStoryScreen.tsx:56`, `src/data/companyPortraitsData.ts:30`, `src/data/fourFacesFeedData.ts:66` (+7 autres) — ⚠️ préfixe `/public/` invalide en HTTP |
| 80 | `public/assets/directions/personnalites-arts.jpg` | 1 055 827 | 1,01 Mio | **UTILISÉ** | Non | `src/data/companyPortraitsData.ts:512`, `src/data/dimensionsData.ts:1184`, `src/data/studioPillarsData.ts:458` |
| 81 | `public/assets/images/pers_arts_1792086472940.jpg` | 1 055 827 | 1,01 Mio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/directions/personnalites-arts.jpg`). |
| 82 | `public/assets/images/pillar_routes_afro_1792601148651.jpg` | 1 053 393 | 1,00 Mio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 83 | `public/assets/images/romeo_storyteller_1792933587573.jpg` | 1 052 141 | 1,00 Mio | **UTILISÉ** | Non | `src/components/SubmitStoryScreen.tsx:55`, `src/data/fourFacesFeedData.ts:10`, `src/data/mockData.ts:881` (+1 autres) |
| 84 | `public/assets/posters/Other eyes < > Sixth sense.jpg` | 1 051 759 | 1,00 Mio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/posters/baobab-bambou.jpg`). |
| 85 | `public/assets/posters/baobab-bambou.jpg` | 1 051 759 | 1,00 Mio | **UTILISÉ** | Non | `src/components/LegacyMarketplaceScreen.tsx:220`, `src/components/landing/DemoProductionsSection.tsx:96`, `src/data/dimensionsData.ts:284` (+4 autres) |
| 86 | `public/assets/posters/other-eyes-sixth-sense.png` | 1 051 759 | 1,00 Mio | **INCERTAIN** | Non | Chemin dynamique `src/components/MatrixExplorer.tsx:1835` (`/assets/posters/${selectedSeriesId}.png`) pour la série `other-eyes-sixth-sense` (fallback si `photoUrl` absent). |
| 87 | `public/assets/directions/marques-finance.jpg` | 1 049 818 | 1,00 Mio | **UTILISÉ** | Non | `src/data/companyPortraitsData.ts:484`, `src/data/dimensionsData.ts:1082` |
| 88 | `public/assets/images/marques_finance_1792086436922.jpg` | 1 049 818 | 1,00 Mio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/directions/marques-finance.jpg`). |
| 89 | `public/assets/doors/door-marques.jpg` | 1 048 191 | 1023,62 Kio | **UTILISÉ** | Non | `src/data/companyPortraitsData.ts:737`, `src/data/dimensionsData.ts:149` |
| 90 | `public/assets/duos/tobi-ganvie.jpg` | 1 045 899 | 1021,39 Kio | **UTILISÉ** | Non | `src/data/explorerTopicsData.ts:1619`, `src/data/mockData.ts:2200`, `src/utils/transactionService.ts:131` |
| 91 | `public/assets/duos/tobi-houndegla.jpg` | 1 045 899 | 1021,39 Kio | **UTILISÉ** | Non | `src/components/SubmitStoryScreen.tsx:66`, `src/data/fourFacesFeedData.ts:74`, `src/data/thematicStoriesData.ts:102` (+1 autres) |
| 92 | `public/assets/protagonists/tobi-ganvie.jpg` | 1 045 899 | 1021,39 Kio | **UTILISÉ** | Non | `src/data/focusTopicsData.ts:397`, `src/data/matrixData.ts:484`, `src/data/matrixData.ts:931` (+6 autres) |
| 93 | `public/assets/protagonists/tobi-houndegla.jpg` | 1 045 899 | 1021,39 Kio | **UTILISÉ** | Non | `src/data/explorerTopicsData.ts:1615`, `src/data/focusTopicsData.ts:284`, `src/data/matrixData.ts:502` (+10 autres) |
| 94 | `public/assets/directions/marques-beaute.jpg` | 1 037 074 | 1012,77 Kio | **UTILISÉ** | Non | `src/data/companyPortraitsData.ts:386`, `src/data/dimensionsData.ts:1022` |
| 95 | `public/assets/images/recruit_videographer_1791825865262.jpg` | 1 036 198 | 1011,91 Kio | **UTILISÉ** | Non | `src/data/studioPillarsData.ts:158` |
| 96 | `public/assets/images/senami_architecte_1792933801804.jpg` | 1 033 672 | 1009,45 Kio | **UTILISÉ** | Non | `src/components/SubmitStoryScreen.tsx:60`, `src/data/companyPortraitsData.ts:35`, `src/data/mockData.ts:980` (+2 autres) — ⚠️ préfixe `/public/` invalide en HTTP |
| 97 | `public/assets/directions/produits-services-beaute.jpg` | 1 032 732 | 1008,53 Kio | **UTILISÉ** | Non | `src/data/companyPortraitsData.ts:568`, `src/data/dimensionsData.ts:728`, `src/data/studioPillarsData.ts:574` (+1 autres) |
| 98 | `public/assets/images/ps_beaute_1792086353881.jpg` | 1 032 732 | 1008,53 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/directions/produits-services-beaute.jpg`). |
| 99 | `public/assets/images/romeo_dialogue_elders_1792698428934.jpg` | 1 030 946 | 1006,78 Kio | **UTILISÉ** | Non | `src/components/landing/DemoProfilPascalSection.tsx:89`, `src/components/landing/DemoProfilPascalSection.tsx:153`, `src/components/landing/DemoProfilPascalSection.tsx:187` (+2 autres) |
| 100 | `public/assets/directions/projets-social.jpg` | 1 030 885 | 1006,72 Kio | **UTILISÉ** | Non | `src/data/companyPortraitsData.ts:779`, `src/data/dimensionsData.ts:905`, `src/data/studioPillarsData.ts:676` |
| 101 | `public/assets/images/projets_social_1792086395729.jpg` | 1 030 885 | 1006,72 Kio | **UTILISÉ** | Non | `src/data/studioPillarsData.ts:149` |
| 102 | `public/assets/directions/projets-jeux.jpg` | 1 029 031 | 1004,91 Kio | **UTILISÉ** | Non | `src/data/dimensionsData.ts:860`, `src/data/studioPillarsData.ts:660` |
| 103 | `public/assets/images/studio_soi_parcours_1792608978314.jpg` | 1 028 120 | 1004,02 Kio | **UTILISÉ** | Non | `src/data/studioPillarsData.ts:131` |
| 104 | `public/assets/directions/produits-services-garde-enfants.jpg` | 1 019 600 | 995,70 Kio | **UTILISÉ** | Non | `src/data/dimensionsData.ts:803`, `src/data/studioPillarsData.ts:630` |
| 105 | `public/assets/doors/door-competences.jpg` | 1 015 573 | 991,77 Kio | **UTILISÉ** | Non | `src/data/adminBackOfficeData.ts:213`, `src/data/companyPortraitsData.ts:681`, `src/data/dimensionsData.ts:104` |
| 106 | `public/assets/protagonists/pascal-produits-tissage.jpg` | 1 015 546 | 991,74 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 107 | `public/assets/directions/sagesses-bienveillance.jpg` | 1 015 218 | 991,42 Kio | **UTILISÉ** | Non | `src/data/dimensionsData.ts:407`, `src/data/studioPillarsData.ts:232` |
| 108 | `public/assets/protagonists/pascal-projets-charpente.jpg` | 1 015 196 | 991,40 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 109 | `public/assets/duos/researcher-phd.jpg` | 1 007 791 | 984,17 Kio | **UTILISÉ** | Non | `src/data/matrixData.ts:2717`, `src/data/mockData.ts:657`, `src/data/mockData.ts:680` (+12 autres) |
| 110 | `public/assets/posters/Focus/Lycees Behanzin et Toffa.png` | 1 000 120 | 976,68 Kio | **UTILISÉ** | Non | `src/components/LegacyMarketplaceScreen.tsx:60`, `src/data/focusTopicsData.ts:189`, `src/data/studioPillarsData.ts:914` (+1 autres) |
| 111 | `public/assets/directions/projets-innovation.jpg` | 994 834 | 971,52 Kio | **UTILISÉ** | Non | `src/data/companyPortraitsData.ts:470`, `src/data/dimensionsData.ts:935`, `src/data/studioPillarsData.ts:652` (+1 autres) |
| 112 | `public/assets/images/projets_innovation_1792086397919.jpg` | 994 834 | 971,52 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/directions/projets-innovation.jpg`). |
| 113 | `public/assets/directions/expertises-sante.jpg` | 991 514 | 968,28 Kio | **UTILISÉ** | Non | `src/data/companyPortraitsData.ts:414`, `src/data/dimensionsData.ts:671`, `src/data/studioPillarsData.ts:388` (+1 autres) |
| 114 | `public/assets/duos/fatou-diallo.jpg` | 989 432 | 966,24 Kio | **UTILISÉ** | Non | `src/components/SubmitStoryScreen.tsx:80`, `src/components/landing/DemoProductionsSection.tsx:272`, `src/data/mockData.ts:471` (+6 autres) |
| 115 | `public/assets/protagonists/fatou-diallo.jpg` | 989 432 | 966,24 Kio | **UTILISÉ** | Non | `src/components/matrix/LivingMatrixWall.tsx:149`, `src/data/focusTopicsData.ts:171`, `src/data/matrixData.ts:246` (+8 autres) |
| 116 | `public/assets/images/amara_andine_1792933642777.jpg` | 989 419 | 966,23 Kio | **UTILISÉ** | Non | `src/components/SubmitStoryScreen.tsx:57`, `src/data/fourFacesFeedData.ts:107`, `src/data/fourFacesFeedData.ts:122` (+4 autres) |
| 117 | `public/assets/images/orga_transm_afro_1792611469008.jpg` | 988 070 | 964,91 Kio | **UTILISÉ** | Non | `src/data/studioPillarsData.ts:746`, `src/data/studioPillarsData.ts:867` |
| 118 | `public/assets/directions/marques-services.jpg` | 984 435 | 961,36 Kio | **UTILISÉ** | Non | `src/data/dimensionsData.ts:1097` |
| 119 | `public/assets/images/pillar_casting_phoenix.png` | 983 469 | 960,42 Kio | **UTILISÉ** | Non | `src/components/SubmitStoryScreen.tsx:1525`, `src/components/SubmitStoryScreen.tsx:1783`, `src/data/studioPillarsData.ts:173` |
| 120 | `public/assets/doors/door-memoires.jpg` | 983 122 | 960,08 Kio | **UTILISÉ** | Non | `src/data/adminBackOfficeData.ts:189`, `src/data/companyPortraitsData.ts:597` |
| 121 | `public/assets/doors/door-sagesses.jpg` | 983 122 | 960,08 Kio | **UTILISÉ** | Non | `src/components/landing/DemoStudioSection.tsx:103`, `src/data/adminBackOfficeData.ts:175`, `src/data/companyPortraitsData.ts:611` (+2 autres) |
| 122 | `public/assets/duos/coach-office.jpg` | 980 351 | 957,37 Kio | **UTILISÉ** | Non | `src/components/LegacyMarketplaceScreen.tsx:229`, `src/data/matrixData.ts:2401`, `src/data/mockData.ts:649` (+9 autres) |
| 123 | `public/assets/protagonists/coach-office.jpg` | 980 351 | 957,37 Kio | **UTILISÉ** | Non | `src/data/focusTopicsData.ts:496`, `src/data/matrixData.ts:152`, `src/data/matrixData.ts:620` (+5 autres) |
| 124 | `public/assets/duos/duo_pere_matthieu_1791655226601.jpg` | 979 796 | 956,83 Kio | **UTILISÉ** | Non | `src/components/SubmitStoryScreen.tsx:65`, `src/data/explorerTopicsData.ts:1623`, `src/data/fourFacesFeedData.ts:29` (+8 autres) |
| 125 | `public/assets/images/duo_pere_matthieu_1791655226601.jpg` | 979 796 | 956,83 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/duos/duo_pere_matthieu_1791655226601.jpg`). |
| 126 | `public/assets/protagonists/duo_pere_matthieu_1791655226601.jpg` | 979 796 | 956,83 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/duos/duo_pere_matthieu_1791655226601.jpg`). |
| 127 | `public/assets/images/sika_tisserande_1792933605542.jpg` | 975 238 | 952,38 Kio | **UTILISÉ** | Non | `src/components/SubmitStoryScreen.tsx:67`, `src/data/fourFacesFeedData.ts:40`, `src/data/mockData.ts:960` (+3 autres) |
| 128 | `public/assets/images/studio_orga_epreuves_1792608979150.jpg` | 974 973 | 952,12 Kio | **UTILISÉ** | Non | `src/data/studioPillarsData.ts:843` |
| 129 | `public/assets/directions/projets-entreprise.jpg` | 972 960 | 950,16 Kio | **UTILISÉ** | Non | `src/data/dimensionsData.ts:950`, `src/data/studioPillarsData.ts:700` |
| 130 | `public/assets/directions/territoires-patrimoine.jpg` | 967 561 | 944,88 Kio | **UTILISÉ** | Non | `src/data/dimensionsData.ts:464`, `src/data/studioPillarsData.ts:270` |
| 131 | `public/assets/doors/door-offres.jpg` | 964 148 | 941,55 Kio | **UTILISÉ** | Non | `src/data/dimensionsData.ts:119` |
| 132 | `public/assets/directions/expertises-justice.jpg` | 961 257 | 938,73 Kio | **UTILISÉ** | Non | `src/data/dimensionsData.ts:656`, `src/data/studioPillarsData.ts:380`, `src/data/studioPillarsData.ts:520` |
| 133 | `public/assets/duos/codjo-blind.jpg` | 955 356 | 932,96 Kio | **UTILISÉ** | Non | `src/components/LegacyMarketplaceScreen.tsx:218`, `src/components/ProfileSettingsScreen.tsx:1258`, `src/components/SubmitStoryScreen.tsx:69` (+14 autres) |
| 134 | `public/assets/protagonists/codjo-blind.jpg` | 955 356 | 932,96 Kio | **UTILISÉ** | Non | `src/data/focusTopicsData.ts:89`, `src/data/focusTopicsData.ts:544`, `src/data/matrixData.ts:169` (+7 autres) |
| 135 | `public/assets/images/romeo_settling_studio_1792698427492.jpg` | 953 832 | 931,48 Kio | **UTILISÉ** | Non | `src/components/landing/DemoProfilPascalSection.tsx:67`, `src/components/landing/DemoProfilPascalSection.tsx:99`, `src/components/landing/DemoProfilPascalSection.tsx:131` (+1 autres) |
| 136 | `public/assets/directions/personnalites-influenceurs.jpg` | 949 086 | 926,84 Kio | **UTILISÉ** | Non | `src/data/dimensionsData.ts:1214`, `src/data/studioPillarsData.ts:474` |
| 137 | `public/assets/directions/projets-aventure.jpg` | 947 041 | 924,84 Kio | **UTILISÉ** | Non | `src/data/companyPortraitsData.ts:723`, `src/data/dimensionsData.ts:965`, `src/data/studioPillarsData.ts:708` |
| 138 | `public/assets/protagonists/pascal-projets-inauguration.jpg` | 944 749 | 922,61 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 139 | `public/assets/protagonists/helene-saint-amand.jpg` | 937 917 | 915,93 Kio | **UTILISÉ** | Non | `src/components/SubmitStoryScreen.tsx:61`, `src/data/focusTopicsData.ts:219`, `src/data/fourFacesFeedData.ts:141` (+11 autres) |
| 140 | `public/assets/posters/Focus/Apprentis.png` | 937 452 | 915,48 Kio | **UTILISÉ** | Non | `src/components/LegacyMarketplaceScreen.tsx:67`, `src/data/focusTopicsData.ts:254`, `src/data/studioPillarsData.ts:922` (+1 autres) |
| 141 | `public/assets/protagonists/pascal-projets-classe.jpg` | 933 941 | 912,05 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 142 | `public/assets/images/beninois_pecheur_tobi_1792165042006.jpg` | 931 854 | 910,01 Kio | **UTILISÉ** | Non | `src/data/explorerTopicsData.ts:1627`, `src/data/studioPillarsData.ts:512` |
| 143 | `public/assets/posters/Esu < > Jesus.jpg` | 921 340 | 899,75 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/posters/Esu < > Jesus.png`). |
| 144 | `public/assets/posters/Esu < > Jesus.png` | 921 340 | 899,75 Kio | **UTILISÉ** | Non | `src/components/DocumentaryDetailScreen.tsx:136`, `src/components/PortfolioScreen.tsx:89`, `src/components/PortfolioScreen.tsx:203` (+1 autres) |
| 145 | `public/assets/posters/jesus-legba.png` | 921 340 | 899,75 Kio | **INCERTAIN** | Non | Chemin dynamique `src/components/MatrixExplorer.tsx:1835` (`/assets/posters/${selectedSeriesId}.png`) pour la série `jesus-legba` (fallback si `photoUrl` absent). |
| 146 | `public/assets/posters/vodun-autre-foi.jpg` | 921 340 | 899,75 Kio | **UTILISÉ** | Non | `src/data/mockData.ts:2639` |
| 147 | `public/assets/posters/vodun-autre-foi.png` | 921 340 | 899,75 Kio | **UTILISÉ** | Non | `src/components/LegacyMarketplaceScreen.tsx:165`, `src/components/landing/DemoProductionsSection.tsx:30`, `src/data/dimensionsData.ts:188` (+2 autres) |
| 148 | `public/assets/protagonists/pascal-besoins-coton.jpg` | 921 246 | 899,65 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 149 | `public/assets/directions/sagesses-pardon.jpg` | 918 778 | 897,24 Kio | **UTILISÉ** | Non | `src/data/dimensionsData.ts:422`, `src/data/studioPillarsData.ts:240`, `src/data/studioPillarsData.ts:496` (+1 autres) |
| 150 | `public/assets/images/sagesses_pardon_1792083785141.jpg` | 918 778 | 897,24 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/directions/sagesses-pardon.jpg`). |
| 151 | `public/assets/directions/produits-services-restauration.jpg` | 918 693 | 897,16 Kio | **UTILISÉ** | Non | `src/data/companyPortraitsData.ts:498`, `src/data/dimensionsData.ts:743`, `src/data/dimensionsData.ts:1052` (+1 autres) |
| 152 | `public/assets/directions/produits-services-bien-etre.jpg` | 918 546 | 897,02 Kio | **UTILISÉ** | Non | `src/data/companyPortraitsData.ts:667`, `src/data/dimensionsData.ts:773`, `src/data/studioPillarsData.ts:606` |
| 153 | `public/assets/protagonists/amara-tisserande.jpg` | 918 479 | 896,95 Kio | **UTILISÉ** | Non | `src/components/PortraitsCircleView.tsx:825`, `src/components/ProfileSettingsScreen.tsx:333`, `src/components/matrix/LivingMatrixWall.tsx:147` (+10 autres) |
| 154 | `public/assets/directions/personnalites-cinema.jpg` | 917 486 | 895,98 Kio | **UTILISÉ** | Non | `src/data/companyPortraitsData.ts:583`, `src/data/dimensionsData.ts:1169`, `src/data/studioPillarsData.ts:450` |
| 155 | `public/assets/posters/Focus/Marche Dantokpa.png` | 916 913 | 895,42 Kio | **UTILISÉ** | Non | `src/components/LegacyMarketplaceScreen.tsx:46`, `src/data/focusTopicsData.ts:59`, `src/data/studioPillarsData.ts:890` (+2 autres) |
| 156 | `public/assets/posters/Focus/Danialou Sagbohan.png` | 915 837 | 894,37 Kio | **UTILISÉ** | Non | `src/components/LegacyMarketplaceScreen.tsx:95`, `src/data/focusTopicsData.ts:514`, `src/data/studioPillarsData.ts:954` (+1 autres) |
| 157 | `public/assets/protagonists/pascal-produits-consultation.jpg` | 914 821 | 893,38 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 158 | `public/assets/images/kiki_passeur_1792933820505.jpg` | 912 480 | 891,09 Kio | **UTILISÉ** | Non | `src/data/companyPortraitsData.ts:36`, `src/data/mockData.ts:894`, `src/data/mockData.ts:1208` (+1 autres) — ⚠️ préfixe `/public/` invalide en HTTP |
| 159 | `public/assets/directions/expertises-business.jpg` | 910 813 | 889,47 Kio | **UTILISÉ** | Non | `src/data/companyPortraitsData.ts:456`, `src/data/dimensionsData.ts:641`, `src/data/studioPillarsData.ts:356` |
| 160 | `public/assets/duos/malik-diop.jpg` | 907 633 | 886,36 Kio | **UTILISÉ** | Non | `src/components/SubmitStoryScreen.tsx:70`, `src/data/fourFacesFeedData.ts:152`, `src/data/mockData.ts:901` (+2 autres) |
| 161 | `public/assets/protagonists/malik-diop.jpg` | 907 633 | 886,36 Kio | **UTILISÉ** | Non | `src/components/matrix/LivingMatrixWall.tsx:151`, `src/data/focusTopicsData.ts:479`, `src/data/matrixData.ts:338` (+14 autres) |
| 162 | `public/assets/posters/Focus/Baccalaureat.png` | 907 533 | 886,26 Kio | **UTILISÉ** | Non | `src/components/LegacyMarketplaceScreen.tsx:53`, `src/data/focusTopicsData.ts:124`, `src/data/studioPillarsData.ts:906` (+1 autres) |
| 163 | `public/assets/directions/produits-services-mode.jpg` | 906 227 | 884,99 Kio | **UTILISÉ** | Non | `src/data/companyPortraitsData.ts:709`, `src/data/dimensionsData.ts:758`, `src/data/studioPillarsData.ts:598` |
| 164 | `public/assets/images/ps_mode_1792086355077.jpg` | 906 227 | 884,99 Kio | **UTILISÉ** | Non | `src/data/studioPillarsData.ts:140` |
| 165 | `public/assets/directions/marques-tech.jpg` | 905 652 | 884,43 Kio | **UTILISÉ** | Non | `src/data/dimensionsData.ts:1037` |
| 166 | `public/assets/images/marques_tech_1792086434196.jpg` | 905 652 | 884,43 Kio | **UTILISÉ** | Non | `src/data/studioPillarsData.ts:859`, `src/data/thematicStoriesData.ts:65`, `src/services/authContext.tsx:279` — ⚠️ préfixe `/public/` invalide en HTTP |
| 167 | `public/assets/directions/produits-services-tourisme.jpg` | 905 540 | 884,32 Kio | **UTILISÉ** | Non | `src/data/companyPortraitsData.ts:653`, `src/data/dimensionsData.ts:788`, `src/data/studioPillarsData.ts:614` |
| 168 | `public/assets/directions/marques-luxe.jpg` | 898 088 | 877,04 Kio | **UTILISÉ** | Non | `src/data/companyPortraitsData.ts:625`, `src/data/dimensionsData.ts:992` |
| 169 | `public/assets/images/marques_luxe_1792086431681.jpg` | 898 088 | 877,04 Kio | **UTILISÉ** | Non | `src/data/thematicStoriesData.ts:159` — ⚠️ préfixe `/public/` invalide en HTTP |
| 170 | `public/assets/images/beninoise_jeune_senan_1792165025309.jpg` | 895 866 | 874,87 Kio | **UTILISÉ** | Non | `src/data/explorerTopicsData.ts:1626`, `src/data/studioPillarsData.ts:754` |
| 171 | `public/assets/protagonists/senan-agossa.jpg` | 895 866 | 874,87 Kio | **UTILISÉ** | Non | `src/components/matrix/LivingMatrixWall.tsx:153`, `src/data/explorerTopicsData.ts:1614`, `src/data/focusTopicsData.ts:137` (+10 autres) |
| 172 | `public/assets/posters/Blacks One < > Beyond Eve.png` | 895 538 | 874,55 Kio | **UTILISÉ** | Non | `src/components/PortfolioScreen.tsx:108`, `src/data/adminBackOfficeData.ts:470` |
| 173 | `public/assets/posters/blacks-one-amazones.jpg` | 895 538 | 874,55 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/posters/Blacks One < > Beyond Eve.png`). |
| 174 | `public/assets/posters/blacks-one-amazones.png` | 895 538 | 874,55 Kio | **UTILISÉ** | Non | `src/components/LegacyMarketplaceScreen.tsx:187`, `src/components/landing/DemoProductionsSection.tsx:74`, `src/data/dimensionsData.ts:252` (+3 autres) |
| 175 | `public/assets/posters/blacks-one-beyond-eve.png` | 895 538 | 874,55 Kio | **INCERTAIN** | Non | Chemin dynamique `src/components/MatrixExplorer.tsx:1835` (`/assets/posters/${selectedSeriesId}.png`) pour la série `blacks-one-beyond-eve` (fallback si `photoUrl` absent). |
| 176 | `public/assets/images/romeo_lagoon_sunset_1792698428025.jpg` | 894 374 | 873,41 Kio | **UTILISÉ** | Non | `src/components/landing/DemoProfilPascalSection.tsx:57`, `src/components/landing/DemoProfilPascalSection.tsx:77`, `src/components/landing/DemoProfilPascalSection.tsx:142` (+2 autres) |
| 177 | `public/assets/protagonists/pascal-besoins-outils.jpg` | 893 785 | 872,84 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 178 | `public/assets/duos/mawuna-medium.jpg` | 891 088 | 870,20 Kio | **UTILISÉ** | Non | `src/components/SubmitStoryScreen.tsx:72`, `src/data/explorerTopicsData.ts:1621`, `src/data/matrixData.ts:2121` (+5 autres) |
| 179 | `public/assets/protagonists/mawuna-medium.jpg` | 891 088 | 870,20 Kio | **UTILISÉ** | Non | `src/components/matrix/LivingMatrixWall.tsx:152`, `src/data/matrixData.ts:356`, `src/data/matrixData.ts:805` (+6 autres) |
| 180 | `public/assets/duos/athlete-hurdle.jpg` | 890 939 | 870,06 Kio | **UTILISÉ** | Non | `src/components/SubmitStoryScreen.tsx:79`, `src/data/matrixData.ts:2419`, `src/data/mockData.ts:2430` (+4 autres) |
| 181 | `public/assets/protagonists/athlete-hurdle.jpg` | 890 939 | 870,06 Kio | **UTILISÉ** | Non | `src/data/focusTopicsData.ts:561`, `src/data/matrixData.ts:114`, `src/data/matrixData.ts:574` (+6 autres) |
| 182 | `public/assets/directions/sagesses-perseverance.jpg` | 888 328 | 867,51 Kio | **UTILISÉ** | Non | `src/data/dimensionsData.ts:392`, `src/data/studioPillarsData.ts:200`, `src/data/studioPillarsData.ts:504` |
| 183 | `public/assets/duos/dah-zounon.jpg` | 888 328 | 867,51 Kio | **UTILISÉ** | Non | `src/data/matrixData.ts:45`, `src/data/studioPillarsData.ts:544`, `src/utils/lineageService.ts:66` |
| 184 | `public/assets/images/beninois_sage_dossou_1792165004493.jpg` | 888 328 | 867,51 Kio | **UTILISÉ** | Non | `src/data/explorerTopicsData.ts:1625` |
| 185 | `public/assets/protagonists/mahougnon-zounon.jpg` | 888 328 | 867,51 Kio | **UTILISÉ** | Non | `src/data/focusTopicsData.ts:349`, `src/data/focusTopicsData.ts:527`, `src/data/matrixData.ts:319` (+7 autres) |
| 186 | `public/assets/posters/Focus/Sodabi.png` | 884 608 | 863,88 Kio | **UTILISÉ** | Non | `src/components/LegacyMarketplaceScreen.tsx:74`, `src/data/focusTopicsData.ts:319`, `src/data/studioPillarsData.ts:930` (+1 autres) |
| 187 | `public/assets/duos/mahougnon_esu_portrait_1791701582891.jpg` | 884 517 | 863,79 Kio | **UTILISÉ** | Non | `src/components/PortfolioScreen.tsx:200`, `src/components/SubmitStoryScreen.tsx:64`, `src/data/explorerTopicsData.ts:1613` (+12 autres) |
| 188 | `public/assets/images/mahougnon_esu_portrait_1791701582891.jpg` | 884 517 | 863,79 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/duos/mahougnon_esu_portrait_1791701582891.jpg`). |
| 189 | `public/assets/protagonists/mahougnon_esu_portrait_1791701582891.jpg` | 884 517 | 863,79 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/duos/mahougnon_esu_portrait_1791701582891.jpg`). |
| 190 | `public/assets/directions/marques-sport.jpg` | 882 336 | 861,66 Kio | **UTILISÉ** | Non | `src/data/dimensionsData.ts:1067` |
| 191 | `public/assets/duos/kwame-mensah.jpg` | 882 039 | 861,37 Kio | **UTILISÉ** | Non | `src/components/SubmitStoryScreen.tsx:58`, `src/components/landing/DemoEntrepriseSection.tsx:52`, `src/components/landing/DemoProfilPascalSection.tsx:422` (+7 autres) |
| 192 | `public/assets/protagonists/kwame-mensah.jpg` | 882 039 | 861,37 Kio | **UTILISÉ** | Non | `src/components/PortraitsCircleView.tsx:824`, `src/components/matrix/LivingMatrixWall.tsx:146`, `src/data/focusTopicsData.ts:202` (+9 autres) |
| 193 | `public/assets/directions/personnalites-engagement.jpg` | 879 883 | 859,26 Kio | **UTILISÉ** | Non | `src/data/companyPortraitsData.ts:540`, `src/data/dimensionsData.ts:1124`, `src/data/studioPillarsData.ts:418` (+1 autres) |
| 194 | `public/assets/directions/personnalites-sport.jpg` | 879 592 | 858,98 Kio | **UTILISÉ** | Non | `src/data/dimensionsData.ts:1199`, `src/data/studioPillarsData.ts:466` |
| 195 | `public/assets/images/romeo_arriving_cotonou_1792698426939.jpg` | 877 728 | 857,16 Kio | **UTILISÉ** | Non | `src/components/landing/DemoProfilPascalSection.tsx:47`, `src/components/landing/DemoProfilPascalSection.tsx:119`, `src/components/landing/DemoProfilPascalSection.tsx:164` (+2 autres) |
| 196 | `public/assets/protagonists/pascal-projets-transmission.jpg` | 875 618 | 855,10 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 197 | `public/assets/protagonists/pascal-produits-artisanat.jpg` | 874 525 | 854,03 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 198 | `public/assets/directions/marques-mode.jpg` | 872 260 | 851,82 Kio | **UTILISÉ** | Non | `src/data/dimensionsData.ts:1007` |
| 199 | `public/assets/posters/Focus/Ganvie.png` | 868 999 | 848,63 Kio | **UTILISÉ** | Non | `src/components/LegacyMarketplaceScreen.tsx:81`, `src/data/focusTopicsData.ts:384`, `src/data/studioPillarsData.ts:938` (+1 autres) |
| 200 | `public/assets/protagonists/pascal-parcours-marche.jpg` | 866 064 | 845,77 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 201 | `public/assets/directions/produits-services-conciergerie.jpg` | 858 371 | 838,25 Kio | **UTILISÉ** | Non | `src/data/companyPortraitsData.ts:751`, `src/data/dimensionsData.ts:818`, `src/data/studioPillarsData.ts:622` |
| 202 | `public/assets/posters/Fiat Luxe < > Street.jpg` | 857 103 | 837,01 Kio | **UTILISÉ** | Non | `src/components/PortfolioScreen.tsx:127`, `src/data/adminBackOfficeData.ts:492` |
| 203 | `public/assets/posters/dixeat-fiat-luxe.png` | 857 103 | 837,01 Kio | **INCERTAIN** | Non | Chemin dynamique `src/components/MatrixExplorer.tsx:1835` (`/assets/posters/${selectedSeriesId}.png`) pour la série `dixeat-fiat-luxe` (fallback si `photoUrl` absent). |
| 204 | `public/assets/posters/fiat-luxe-builders.jpg` | 857 103 | 837,01 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/posters/Fiat Luxe < > Street.jpg`). |
| 205 | `public/assets/posters/fiat-luxe-builders.png` | 857 103 | 837,01 Kio | **UTILISÉ** | Non | `src/components/LegacyMarketplaceScreen.tsx:198`, `src/components/landing/DemoProductionsSection.tsx:63`, `src/data/dimensionsData.ts:236` (+3 autres) |
| 206 | `public/assets/images/pro_shoot_story.jpg` | 853 859 | 833,85 Kio | **UTILISÉ** | Non | `src/components/SubmitStoryScreen.tsx:1374` |
| 207 | `public/assets/posters/Focus/Angelique Kidjo.png` | 852 486 | 832,51 Kio | **UTILISÉ** | Non | `src/components/LegacyMarketplaceScreen.tsx:88`, `src/data/focusTopicsData.ts:449`, `src/data/studioPillarsData.ts:946` (+1 autres) |
| 208 | `public/assets/posters/Roots < > Routes.jpg` | 848 929 | 829,03 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/posters/roots-routes.jpg`). |
| 209 | `public/assets/posters/roots-routes.jpg` | 848 929 | 829,03 Kio | **UTILISÉ** | Non | `src/components/LegacyMarketplaceScreen.tsx:209`, `src/components/landing/DemoProductionsSection.tsx:41`, `src/data/dimensionsData.ts:204` (+3 autres) |
| 210 | `public/assets/directions/personnalites-foi.jpg` | 847 701 | 827,83 Kio | **UTILISÉ** | Non | `src/data/dimensionsData.ts:1229`, `src/data/studioPillarsData.ts:482` |
| 211 | `public/assets/images/selfie_video_story.jpg` | 847 206 | 827,35 Kio | **UTILISÉ** | Non | `src/components/EditorialBackOfficeScreen.tsx:278`, `src/components/SettingsScreen.tsx:494`, `src/components/SubmitStoryScreen.tsx:867` (+1 autres) |
| 212 | `public/assets/doors/door-personnalites.jpg` | 845 596 | 825,78 Kio | **UTILISÉ** | Non | `src/data/dimensionsData.ts:164` |
| 213 | `public/assets/protagonists/pascal-besoins-partenaires.jpg` | 838 766 | 819,11 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 214 | `public/assets/posters/Focus < >  PhD.jpg` | 835 090 | 815,52 Kio | **UTILISÉ** | Non | `src/data/adminBackOfficeData.ts:558` |
| 215 | `public/assets/posters/focus-phd.jpg` | 835 090 | 815,52 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/posters/Focus < >  PhD.jpg`). |
| 216 | `public/assets/posters/pictures-words.jpg` | 835 090 | 815,52 Kio | **UTILISÉ** | Non | `src/components/LegacyMarketplaceScreen.tsx:242`, `src/components/landing/DemoProductionsSection.tsx:107`, `src/data/dimensionsData.ts:300` (+6 autres) |
| 217 | `public/assets/images/dossou_logistique_1792933781153.jpg` | 833 751 | 814,21 Kio | **UTILISÉ** | Non | `src/components/SubmitStoryScreen.tsx:81`, `src/data/companyPortraitsData.ts:34`, `src/data/mockData.ts:1072` (+1 autres) |
| 218 | `public/assets/duos/eleonore-vance.jpg` | 828 007 | 808,60 Kio | **UTILISÉ** | Non | `src/components/SubmitStoryScreen.tsx:71`, `src/data/fourFacesFeedData.ts:163`, `src/data/thematicStoriesData.ts:56` (+1 autres) |
| 219 | `public/assets/protagonists/eleonore-vance.jpg` | 828 007 | 808,60 Kio | **UTILISÉ** | Non | `src/data/focusTopicsData.ts:462`, `src/data/matrixData.ts:227`, `src/data/matrixData.ts:672` (+13 autres) |
| 220 | `public/assets/images/beninoise_femme_sika_1792164985263.jpg` | 820 480 | 801,25 Kio | **UTILISÉ** | Non | `src/data/explorerTopicsData.ts:1624`, `src/data/studioPillarsData.ts:770` |
| 221 | `public/assets/protagonists/sika-dossou.jpg` | 820 480 | 801,25 Kio | **UTILISÉ** | Non | `src/data/explorerTopicsData.ts:1612`, `src/data/focusTopicsData.ts:72`, `src/data/focusTopicsData.ts:267` (+8 autres) |
| 222 | `public/assets/posters/Builders < > Seekers.png` | 814 383 | 795,30 Kio | **UTILISÉ** | Non | `src/data/adminBackOfficeData.ts:536` |
| 223 | `public/assets/posters/coaching-phd.jpg` | 814 383 | 795,30 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/posters/Builders < > Seekers.png`). |
| 224 | `public/assets/posters/coaching-phd.png` | 814 383 | 795,30 Kio | **UTILISÉ** | Non | `src/components/LegacyMarketplaceScreen.tsx:231`, `src/components/landing/DemoProductionsSection.tsx:52`, `src/data/dimensionsData.ts:220` (+5 autres) |
| 225 | `public/assets/posters/investors-builders.png` | 814 383 | 795,30 Kio | **INCERTAIN** | Non | Chemin dynamique `src/components/MatrixExplorer.tsx:1835` (`/assets/posters/${selectedSeriesId}.png`) pour la série `investors-builders` (fallback si `photoUrl` absent). |
| 226 | `public/assets/directions/produits-services-immobilier.jpg` | 812 784 | 793,73 Kio | **UTILISÉ** | Non | `src/data/dimensionsData.ts:833`, `src/data/studioPillarsData.ts:638` |
| 227 | `public/assets/protagonists/armel-hounkpatin.jpg` | 788 437 | 769,96 Kio | **UTILISÉ** | Non | `src/components/landing/DemoEntrepriseSection.tsx:62`, `src/data/actionShareholdersData.ts:29`, `src/data/explorerTopicsData.ts:1617` (+10 autres) |
| 228 | `public/assets/protagonists/pascal-besoins-appel.jpg` | 788 232 | 769,76 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 229 | `public/assets/images/senan_innovatrice_1792933679487.jpg` | 780 190 | 761,90 Kio | **UTILISÉ** | Non | `src/components/SubmitStoryScreen.tsx:68`, `src/data/companyPortraitsData.ts:29`, `src/data/fourFacesFeedData.ts:51` (+3 autres) |
| 230 | `public/assets/protagonists/pascal-parcours-crepuscule.jpg` | 775 098 | 756,93 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 231 | `public/assets/doors/door-series.jpg` | 763 606 | 745,71 Kio | **UTILISÉ** | Non | `src/data/dimensionsData.ts:59`, `src/data/proposeDoorsData.ts:189` |
| 232 | `public/assets/protagonists/pascal-parcours-pirogue.jpg` | 747 529 | 730,01 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 233 | `public/assets/doors/door-territoires.jpg` | 743 425 | 726,00 Kio | **UTILISÉ** | Non | `src/data/adminBackOfficeData.ts:201`, `src/data/companyPortraitsData.ts:793`, `src/data/dimensionsData.ts:89` |
| 234 | `public/assets/images/romeo_avatar_1792698425983.jpg` | 738 035 | 720,74 Kio | **UTILISÉ** | Non | `src/components/ProfileLineageFrise.tsx:101`, `src/components/ProfileLineageFrise.tsx:1258`, `src/components/ProfileSettingsScreen.tsx:233` (+8 autres) |
| 235 | `public/assets/posters/Blacks One < > Beyond Eve.jpg` | 587 150 | 573,39 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/posters/blacks-one-beyond-eve.jpg`). |
| 236 | `public/assets/posters/blacks-one-beyond-eve.jpg` | 587 150 | 573,39 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/posters/Blacks One < > Beyond Eve.jpg`). |
| 237 | `public/assets/posters/finagnon-qosqorico.jpg` | 584 099 | 570,41 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 238 | `public/assets/posters/Coaching < > Unlimited.jpg` | 562 861 | 549,67 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/posters/coaching-unlimited.jpg`). |
| 239 | `public/assets/posters/coaching-unlimited.jpg` | 562 861 | 549,67 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/posters/Coaching < > Unlimited.jpg`). |
| 240 | `public/assets/posters/Investors < > Builders.jpg` | 520 306 | 508,11 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/posters/investors-builders.jpg`). |
| 241 | `public/assets/posters/investors-builders.jpg` | 520 306 | 508,11 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/posters/Investors < > Builders.jpg`). |
| 242 | `public/roots-routes.jpg` | 506 995 | 495,11 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 243 | `public/assets/posters/E Vivi < > Fiat Luxe.jpg` | 491 545 | 480,02 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/posters/dixeat-fiat-luxe.jpg`). |
| 244 | `public/assets/posters/dixeat-fiat-luxe.jpg` | 491 545 | 480,02 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/posters/E Vivi < > Fiat Luxe.jpg`). |
| 245 | `public/assets/posters/jesus-esu.jpg` | 461 048 | 450,24 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 246 | `public/assets/posters/Diasporas < > Makers.jpg` | 452 065 | 441,47 Kio | **UTILISÉ** | Non | `src/components/PortfolioScreen.tsx:146`, `src/components/PortfolioScreen.tsx:220`, `src/data/adminBackOfficeData.ts:426` |
| 247 | `public/assets/posters/other-eyes-sixth-sense.webp` | 433 770 | 423,60 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 248 | `public/assets/posters/Coaching ‹ › PhD.jpg` | 371 563 | 362,85 Kio | **UTILISÉ** | Non | `src/components/LegacyMarketplaceScreen.tsx:117`, `src/data/studioPillarsData.ts:67` |
| 249 | `public/assets/posters/Benin ‹ › Le Monde.jpg` | 362 464 | 353,97 Kio | **UTILISÉ** | Non | `src/components/LegacyMarketplaceScreen.tsx:152`, `src/data/mockData.ts:144`, `src/data/mockData.ts:145` (+1 autres) |
| 250 | `public/assets/posters/Fiat Luxe ‹ › Builders.jpg` | 356 591 | 348,23 Kio | **UTILISÉ** | Non | `src/components/LegacyMarketplaceScreen.tsx:138`, `src/data/mockData.ts:355`, `src/data/mockData.ts:356` (+1 autres) |
| 251 | `public/assets/posters/Baobabs ‹ › Bambous.jpg` | 339 133 | 331,18 Kio | **UTILISÉ** | Non | `src/components/LegacyMarketplaceScreen.tsx:110`, `src/data/mockData.ts:563`, `src/data/mockData.ts:564` (+1 autres) |
| 252 | `public/assets/posters/Pictures ‹ › Words.jpg` | 331 867 | 324,09 Kio | **UTILISÉ** | Non | `src/components/LegacyMarketplaceScreen.tsx:145`, `src/data/studioPillarsData.ts:99` |
| 253 | `public/assets/posters/Blacks One < > Beyond Eve.webp` | 331 748 | 323,97 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/posters/blacks-one-beyond-eve.webp`). |
| 254 | `public/assets/posters/blacks-one-beyond-eve.webp` | 331 748 | 323,97 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/posters/Blacks One < > Beyond Eve.webp`). |
| 255 | `public/assets/posters/Coaching < > Unlimited.webp` | 331 730 | 323,96 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/posters/coaching-unlimited.webp`). |
| 256 | `public/assets/posters/coaching-unlimited.webp` | 331 730 | 323,96 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/posters/Coaching < > Unlimited.webp`). |
| 257 | `public/assets/posters/Investors < > Builders.webp` | 305 806 | 298,64 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/posters/investors-builders.webp`). |
| 258 | `public/assets/posters/investors-builders.webp` | 305 806 | 298,64 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/posters/Investors < > Builders.webp`). |
| 259 | `public/assets/posters/Finagnon < > Qosqorico.webp` | 305 668 | 298,50 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/posters/finagnon-qosqorico.webp`). |
| 260 | `public/assets/posters/finagnon-qosqorico.webp` | 305 668 | 298,50 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/posters/Finagnon < > Qosqorico.webp`). |
| 261 | `public/assets/posters/Esu < > Jesus.webp` | 277 824 | 271,31 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/posters/jesus-esu.webp`). |
| 262 | `public/assets/posters/jesus-esu.webp` | 277 824 | 271,31 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/posters/Esu < > Jesus.webp`). |
| 263 | `public/assets/posters/jesus-legba.webp` | 277 824 | 271,31 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/posters/Esu < > Jesus.webp`). |
| 264 | `public/assets/posters/E Vivi < > Fiat Luxe.webp` | 256 348 | 250,34 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/posters/dixeat-fiat-luxe.webp`). |
| 265 | `public/assets/posters/dixeat-fiat-luxe.webp` | 256 348 | 250,34 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/posters/E Vivi < > Fiat Luxe.webp`). |
| 266 | `public/assets/posters/e-vivi-fiat-luxe.webp` | 256 348 | 250,34 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/posters/E Vivi < > Fiat Luxe.webp`). |
| 267 | `public/assets/posters/Other eyes < > Sixth sense.webp` | 235 316 | 229,80 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 268 | `public/assets/posters/Focus < >  PhD.webp` | 154 006 | 150,40 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/posters/focus-phd.webp`). |
| 269 | `public/assets/posters/focus-phd.webp` | 154 006 | 150,40 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/posters/Focus < >  PhD.webp`). |
| 270 | `public/assets/brand-logos/logo-etoile-royale.png` | 99 283 | 96,96 Kio | **UTILISÉ** | Non | `src/data/companyPortraitsData.ts:293` |
| 271 | `public/assets/brand-logos/logo-union-africaine.png` | 95 698 | 93,46 Kio | **UTILISÉ** | Non | `src/data/companyPortraitsData.ts:229` |
| 272 | `public/assets/brand-logos/logo-tambour-turquoise.png` | 91 259 | 89,12 Kio | **UTILISÉ** | Non | `src/data/companyPortraitsData.ts:341` |
| 273 | `public/assets/brand-logos/logo-masque-ancestral.png` | 84 566 | 82,58 Kio | **UTILISÉ** | Non | `src/data/companyPortraitsData.ts:325` |
| 274 | `public/assets/brand-logos/logo-mandala-terre.png` | 83 549 | 81,59 Kio | **UTILISÉ** | Non | `src/data/companyPortraitsData.ts:277` |
| 275 | `public/assets/brand-logos/logo-lion-majestueux.png` | 60 039 | 58,63 Kio | **UTILISÉ** | Non | `src/data/companyPortraitsData.ts:213` |
| 276 | `public/assets/brand-logos/logo-empreinte-afrique.png` | 59 136 | 57,75 Kio | **UTILISÉ** | Non | `src/data/companyPortraitsData.ts:133` |
| 277 | `public/assets/brand-logos/logo-helios-spirale.png` | 54 457 | 53,18 Kio | **UTILISÉ** | Non | `src/data/companyPortraitsData.ts:117` |
| 278 | `public/logo YonyWood.png` | 50 590 | 49,40 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/logo-yonywood-clean.png`). |
| 279 | `public/logo-yonywood-clean.png` | 50 590 | 49,40 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/logo YonyWood.png`). |
| 280 | `public/assets/brand-logos/logo-bouclier-terroir.png` | 48 047 | 46,92 Kio | **UTILISÉ** | Non | `src/components/PortraitsCircleView.tsx:752`, `src/data/companyPortraitsData.ts:101` |
| 281 | `public/assets/brand-logos/logo-reine-turban.png` | 47 411 | 46,30 Kio | **UTILISÉ** | Non | `src/data/companyPortraitsData.ts:197` |
| 282 | `public/assets/brand-logos/logo-force-elephant.png` | 45 498 | 44,43 Kio | **UTILISÉ** | Non | `src/data/companyPortraitsData.ts:245` |
| 283 | `public/assets/brand-logos/logo-lion-crepuscule.png` | 44 522 | 43,48 Kio | **UTILISÉ** | Non | `src/data/companyPortraitsData.ts:261` |
| 284 | `public/assets/brand-logos/logo-ondes-harmonie.png` | 39 742 | 38,81 Kio | **UTILISÉ** | Non | `src/data/companyPortraitsData.ts:149` |
| 285 | `public/assets/brand-logos/logo-apex-athletic.png` | 38 686 | 37,78 Kio | **UTILISÉ** | Non | `src/data/companyPortraitsData.ts:181` |
| 286 | `public/assets/brand-logos/logo-rythme-djembe.png` | 34 141 | 33,34 Kio | **UTILISÉ** | Non | `src/data/companyPortraitsData.ts:309` |
| 287 | `public/assets/brand-logos/logo-afrique-multiverse.png` | 31 861 | 31,11 Kio | **UTILISÉ** | Non | `src/data/companyPortraitsData.ts:165` |
| 288 | `public/apple-touch-icon.png` | 14 304 | 13,97 Kio | **UTILISÉ** | Oui | `index.html:11`, `vite.config.ts:116` |
| 289 | `public/YonyWood_logo_final.svg` | 9 889 | 9,66 Kio | **UTILISÉ** | Non | `src/components/LandingScreen.tsx:77`, `src/components/Navbar.tsx:30` |
| 290 | `public/YonyWood_logotype.svg` | 9 859 | 9,63 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 291 | `public/assets/icons/lignee.svg` | 8 173 | 7,98 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 292 | `public/assets/icons/parcours-de-vie.svg` | 8 140 | 7,95 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 293 | `public/assets/icons/produits-services.svg` | 8 096 | 7,91 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 294 | `public/assets/icons/projets.svg` | 8 076 | 7,89 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 295 | `public/assets/icons/besoins.svg` | 8 038 | 7,85 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 296 | `public/assets/brand-logos/logo-acoustique.svg` | 3 500 | 3,42 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 297 | `public/assets/brand-logos/logo-technologie.svg` | 3 064 | 2,99 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 298 | `public/assets/brand-logos/logo-sante.svg` | 2 778 | 2,71 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 299 | `public/assets/brand-logos/logo-energie.svg` | 2 699 | 2,64 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 300 | `public/assets/brand-logos/logo-joaillerie.svg` | 2 680 | 2,62 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 301 | `public/assets/brand-logos/logo-telecom.svg` | 2 563 | 2,50 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 302 | `public/assets/brand-logos/logo-fintech.svg` | 2 545 | 2,49 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 303 | `public/assets/brand-logos/logo-cinema.svg` | 2 436 | 2,38 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 304 | `public/assets/brand-logos/logo-alimentation.svg` | 2 381 | 2,33 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 305 | `public/assets/brand-logos/logo-boisson.svg` | 2 341 | 2,29 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 306 | `public/assets/brand-logos/logo-voyage.svg` | 2 331 | 2,28 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 307 | `public/assets/brand-logos/logo-textile.svg` | 2 315 | 2,26 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 308 | `public/assets/brand-logos/logo-architecture.svg` | 2 311 | 2,26 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 309 | `public/assets/brand-logos/logo-ecologie.svg` | 2 233 | 2,18 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 310 | `public/assets/brand-logos/logo-mobilite.svg` | 2 166 | 2,12 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 311 | `public/icon.svg` | 2 129 | 2,08 Kio | **UTILISÉ** | Oui | `index.html:10`, `vite.config.ts:116`, `vite.config.ts:129` (+1 autres) |
| 312 | `public/assets/brand-logos/logo-sport.svg` | 2 113 | 2,06 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 313 | `public/assets/logo-yonywood.svg` | 1 714 | 1,67 Kio | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 314 | `public/manifest.json` | 466 | 466 o | **UTILISÉ** | Non | `index.html:12` |
| 315 | `public/assets/icons/13-savoir-faire/contes-recits.svg` | 432 | 432 o | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/icons/savoir-faire/contes-recits.svg`). |
| 316 | `public/assets/icons/savoir-faire/contes-recits.svg` | 432 | 432 o | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/icons/13-savoir-faire/contes-recits.svg`). |
| 317 | `public/assets/icons/01-sagesses/spiritualite.svg` | 410 | 410 o | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 318 | `public/assets/icons/15-moments-de-vie/secrets-gardes.svg` | 404 | 404 o | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/icons/moments-de-vie/secrets-gardes.svg`). |
| 319 | `public/assets/icons/moments-de-vie/secrets-gardes.svg` | 404 | 404 o | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/icons/15-moments-de-vie/secrets-gardes.svg`). |
| 320 | `public/assets/icons/05-projets/culture.svg` | 395 | 395 o | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 321 | `public/assets/icons/04-produits-services/services-personne.svg` | 392 | 392 o | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 322 | `public/assets/icons/01-sagesses/exil.svg` | 378 | 378 o | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 323 | `public/assets/icons/04-produits-services/transport-loisirs.svg` | 374 | 374 o | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 324 | `public/assets/icons/01-sagesses/famille.svg` | 371 | 371 o | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 325 | `public/assets/icons/01-sagesses/travail.svg` | 367 | 367 o | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 326 | `public/assets/icons/01-sagesses/amour-couple.svg` | 354 | 354 o | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 327 | `public/assets/icons/02-territoires/pays-origine.svg` | 350 | 350 o | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 328 | `public/assets/icons/15-moments-de-vie/age-adulte.svg` | 350 | 350 o | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/icons/moments-de-vie/age-adulte.svg`). |
| 329 | `public/assets/icons/moments-de-vie/age-adulte.svg` | 350 | 350 o | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/icons/15-moments-de-vie/age-adulte.svg`). |
| 330 | `public/assets/icons/06-marques/banque-assurance.svg` | 348 | 348 o | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 331 | `public/assets/icons/13-savoir-faire/musique-danse.svg` | 348 | 348 o | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/icons/savoir-faire/musique-danse.svg`). |
| 332 | `public/assets/icons/savoir-faire/musique-danse.svg` | 348 | 348 o | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/icons/13-savoir-faire/musique-danse.svg`). |
| 333 | `public/assets/icons/05-projets/innovation.svg` | 346 | 346 o | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 334 | `public/assets/icons/03-expertises/education.svg` | 345 | 345 o | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 335 | `public/assets/icons/03-expertises/arts-medias.svg` | 342 | 342 o | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 336 | `public/assets/icons/01-sagesses/_dimension.svg` | 341 | 341 o | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 337 | `public/assets/icons/03-expertises/droit-finance.svg` | 336 | 336 o | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 338 | `public/assets/icons/03-expertises/agriculture.svg` | 334 | 334 o | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 339 | `public/assets/icons/05-projets/education-sport.svg` | 334 | 334 o | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 340 | `public/assets/icons/05-projets/communautaire.svg` | 332 | 332 o | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 341 | `public/assets/icons/01-sagesses/reinvention.svg` | 331 | 331 o | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 342 | `public/assets/icons/05-projets/projets-de-vie.svg` | 327 | 327 o | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 343 | `public/assets/icons/01-sagesses/argent.svg` | 323 | 323 o | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 344 | `public/assets/icons/02-territoires/patrimoine.svg` | 322 | 322 o | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 345 | `public/assets/icons/02-territoires/_dimension.svg` | 319 | 319 o | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 346 | `public/assets/icons/02-territoires/villes.svg` | 314 | 314 o | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 347 | `public/assets/icons/04-produits-services/bien-etre.svg` | 314 | 314 o | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 348 | `public/assets/icons/04-produits-services/beaute.svg` | 313 | 313 o | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 349 | `public/assets/icons/13-savoir-faire/remedes-traditionnels.svg` | 308 | 308 o | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/icons/savoir-faire/remedes-traditionnels.svg`). |
| 350 | `public/assets/icons/savoir-faire/remedes-traditionnels.svg` | 308 | 308 o | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/icons/13-savoir-faire/remedes-traditionnels.svg`). |
| 351 | `public/assets/icons/04-produits-services/_dimension.svg` | 306 | 306 o | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 352 | `public/assets/icons/04-produits-services/numerique.svg` | 306 | 306 o | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 353 | `public/assets/icons/02-territoires/terroirs.svg` | 305 | 305 o | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 354 | `public/assets/icons/05-projets/_dimension.svg` | 304 | 304 o | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 355 | `public/assets/icons/06-marques/alimentation-boissons.svg` | 304 | 304 o | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 356 | `public/assets/icons/13-savoir-faire/rituels.svg` | 304 | 304 o | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/icons/savoir-faire/rituels.svg`). |
| 357 | `public/assets/icons/savoir-faire/rituels.svg` | 304 | 304 o | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/icons/13-savoir-faire/rituels.svg`). |
| 358 | `public/assets/icons/04-produits-services/mode.svg` | 303 | 303 o | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 359 | `public/assets/icons/02-territoires/traditions.svg` | 301 | 301 o | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 360 | `public/assets/icons/02-territoires/villages.svg` | 301 | 301 o | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 361 | `public/assets/icons/15-moments-de-vie/regrets-fiertes.svg` | 301 | 301 o | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/icons/moments-de-vie/regrets-fiertes.svg`). |
| 362 | `public/assets/icons/moments-de-vie/regrets-fiertes.svg` | 301 | 301 o | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/icons/15-moments-de-vie/regrets-fiertes.svg`). |
| 363 | `public/assets/icons/05-projets/entreprises.svg` | 300 | 300 o | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 364 | `public/assets/icons/03-expertises/artisanat.svg` | 299 | 299 o | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 365 | `public/assets/icons/05-projets/humanitaire.svg` | 299 | 299 o | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 366 | `public/assets/icons/02-territoires/vie-etranger.svg` | 298 | 298 o | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 367 | `public/assets/icons/04-produits-services/maison.svg` | 294 | 294 o | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 368 | `public/assets/icons/06-marques/_dimension.svg` | 294 | 294 o | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 369 | `public/assets/icons/01-sagesses/epreuves.svg` | 291 | 291 o | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 370 | `public/assets/icons/03-expertises/commerce.svg` | 283 | 283 o | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 371 | `public/assets/icons/03-expertises/sante.svg` | 277 | 277 o | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 372 | `public/assets/icons/13-savoir-faire/langues-dialectes.svg` | 277 | 277 o | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/icons/savoir-faire/langues-dialectes.svg`). |
| 373 | `public/assets/icons/savoir-faire/langues-dialectes.svg` | 277 | 277 o | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/icons/13-savoir-faire/langues-dialectes.svg`). |
| 374 | `public/assets/icons/15-moments-de-vie/grands-tournants.svg` | 273 | 273 o | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/icons/moments-de-vie/grands-tournants.svg`). |
| 375 | `public/assets/icons/moments-de-vie/grands-tournants.svg` | 273 | 273 o | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/icons/15-moments-de-vie/grands-tournants.svg`). |
| 376 | `public/assets/icons/05-projets/environnement.svg` | 272 | 272 o | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 377 | `public/assets/icons/02-territoires/nature.svg` | 257 | 257 o | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 378 | `public/assets/icons/04-produits-services/alimentation.svg` | 253 | 253 o | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 379 | `public/assets/icons/15-moments-de-vie/retraite.svg` | 248 | 248 o | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/icons/moments-de-vie/retraite.svg`). |
| 380 | `public/assets/icons/moments-de-vie/retraite.svg` | 248 | 248 o | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/icons/15-moments-de-vie/retraite.svg`). |
| 381 | `public/assets/icons/03-expertises/_dimension.svg` | 241 | 241 o | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 382 | `public/assets/icons/03-expertises/technologie.svg` | 239 | 239 o | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 383 | `public/assets/icons/06-marques/emblematiques.svg` | 237 | 237 o | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée dans le code ni dans les données. |
| 384 | `public/assets/icons/13-savoir-faire/techniques-agricoles.svg` | 230 | 230 o | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/icons/savoir-faire/techniques-agricoles.svg`). |
| 385 | `public/assets/icons/savoir-faire/techniques-agricoles.svg` | 230 | 230 o | **PROBABLEMENT INUTILISÉ** | Non | Aucune référence trouvée (doublon binaire de `public/assets/icons/13-savoir-faire/techniques-agricoles.svg`). |

## 7. Annexe — Autre dossier d'assets lourd : `src/assets/images/`

- **Volume total** : **63 fichiers** pour **62 959 658 octets (60,04 Mio)**.
- **Doublons de `public/`** : **61 fichiers sur 63** (**58,20 Mio**) sont des copies binaires exactes de fichiers déjà présents dans `public/`.
- **Utilisation réelle** : aucun `import` statique ES trouvé ; seuls **2 fichiers** sont référencés par URL directe `/src/assets/images/...` dans `src/components/SubmitStoryScreen.tsx:1296,1382` (servis uniquement en développement via `server.ts:403`, non copiés dans `dist/`). Les **61 autres fichiers** (58,42 Mio) n'ont aucune référence.

| # | Chemin | Poids (octets) | Poids | Statut | Explication / Référence |
|---:|---|---:|---|---|---|
| 1 | `src/assets/images/pillar_org_afro_1792601150815.jpg` | 1 277 746 | 1,22 Mio | **PROBABLEMENT INUTILISÉ** | Aucune référence (doublon binaire de `public/assets/images/pillar_org_afro_1792601150815.jpg`) |
| 2 | `src/assets/images/pillar_duos_afro_1792601147557.jpg` | 1 255 896 | 1,20 Mio | **PROBABLEMENT INUTILISÉ** | Aucune référence (doublon binaire de `public/assets/images/pillar_duos_afro_1792601147557.jpg`) |
| 3 | `src/assets/images/pillar_soi_afro_1792601150131.jpg` | 1 255 045 | 1,20 Mio | **PROBABLEMENT INUTILISÉ** | Aucune référence (doublon binaire de `public/assets/images/pillar_soi_afro_1792601150131.jpg`) |
| 4 | `src/assets/images/koffi_tisserand_1792933625628.jpg` | 1 252 057 | 1,19 Mio | **PROBABLEMENT INUTILISÉ** | Aucune référence (doublon binaire de `public/assets/images/koffi_tisserand_1792933625628.jpg`) |
| 5 | `src/assets/images/studio_orga_valeurs_1792608959843.jpg` | 1 213 750 | 1,16 Mio | **PROBABLEMENT INUTILISÉ** | Aucune référence (doublon binaire de `public/assets/images/studio_orga_valeurs_1792608959843.jpg`) |
| 6 | `src/assets/images/marques_alimentation_1792086435220.jpg` | 1 197 031 | 1,14 Mio | **PROBABLEMENT INUTILISÉ** | Aucune référence (doublon binaire de `public/assets/images/marques_alimentation_1792086435220.jpg`) |
| 7 | `src/assets/images/koffi_portonovo_1792933660999.jpg` | 1 188 058 | 1,13 Mio | **PROBABLEMENT INUTILISÉ** | Aucune référence (doublon binaire de `public/assets/images/koffi_portonovo_1792933660999.jpg`) |
| 8 | `src/assets/images/expertises_artisanat_1792085293909.jpg` | 1 148 235 | 1,10 Mio | **PROBABLEMENT INUTILISÉ** | Aucune référence (doublon binaire de `public/assets/directions/expertises-artisanat.jpg`) |
| 9 | `src/assets/images/territoires_traditions_1792085253556.jpg` | 1 136 733 | 1,08 Mio | **PROBABLEMENT INUTILISÉ** | Aucune référence (doublon binaire de `public/assets/directions/territoires-traditions.jpg`) |
| 10 | `src/assets/images/projets_ecologie_1792086393821.jpg` | 1 100 968 | 1,05 Mio | **PROBABLEMENT INUTILISÉ** | Aucune référence (doublon binaire de `public/assets/directions/projets-ecologie.jpg`) |
| 11 | `src/assets/images/studio_orga_origines_1792608957920.jpg` | 1 097 856 | 1,05 Mio | **PROBABLEMENT INUTILISÉ** | Aucune référence (doublon binaire de `public/assets/images/studio_orga_origines_1792608957920.jpg`) |
| 12 | `src/assets/images/ayaba_nectar_1792933764727.jpg` | 1 084 969 | 1,03 Mio | **PROBABLEMENT INUTILISÉ** | Aucune référence (doublon binaire de `public/assets/images/ayaba_nectar_1792933764727.jpg`) |
| 13 | `src/assets/images/orga_rencontres_afro_1792611454422.jpg` | 1 083 165 | 1,03 Mio | **PROBABLEMENT INUTILISÉ** | Aucune référence (doublon binaire de `public/assets/images/orga_rencontres_afro_1792611454422.jpg`) |
| 14 | `src/assets/images/home_afro_storyteller_1792193575638.jpg` | 1 080 509 | 1,03 Mio | **PROBABLEMENT INUTILISÉ** | Aucune référence (doublon binaire de `public/assets/images/home_afro_storyteller_1792193575638.jpg`) |
| 15 | `src/assets/images/benin_monde_poster_1793362370966.jpg` | 1 070 501 | 1,02 Mio | **PROBABLEMENT INUTILISÉ** | Aucune référence (doublon binaire de `public/assets/posters/Benin < >.jpg`) |
| 16 | `src/assets/images/kpedetin_joailliere_1792933718361.jpg` | 1 069 212 | 1,02 Mio | **PROBABLEMENT INUTILISÉ** | Aucune référence (doublon binaire de `public/assets/images/kpedetin_joailliere_1792933718361.jpg`) |
| 17 | `src/assets/images/bio_solaire_1792933744556.jpg` | 1 062 584 | 1,01 Mio | **PROBABLEMENT INUTILISÉ** | Aucune référence (doublon binaire de `public/assets/images/bio_solaire_1792933744556.jpg`) |
| 18 | `src/assets/images/sagesses_resilience_1792083778313.jpg` | 1 061 764 | 1,01 Mio | **PROBABLEMENT INUTILISÉ** | Aucune référence (doublon binaire de `public/assets/directions/sagesses-resilience.jpg`) |
| 19 | `src/assets/images/studio_orga_quotidien_1792608958971.jpg` | 1 060 994 | 1,01 Mio | **PROBABLEMENT INUTILISÉ** | Aucune référence (doublon binaire de `public/assets/images/studio_orga_quotidien_1792608958971.jpg`) |
| 20 | `src/assets/images/fagnon_agronome_1792933698985.jpg` | 1 058 032 | 1,01 Mio | **PROBABLEMENT INUTILISÉ** | Aucune référence (doublon binaire de `public/assets/images/fagnon_agronome_1792933698985.jpg`) |
| 21 | `src/assets/images/pers_arts_1792086472940.jpg` | 1 055 827 | 1,01 Mio | **PROBABLEMENT INUTILISÉ** | Aucune référence (doublon binaire de `public/assets/directions/personnalites-arts.jpg`) |
| 22 | `src/assets/images/pillar_routes_afro_1792601148651.jpg` | 1 053 393 | 1,00 Mio | **PROBABLEMENT INUTILISÉ** | Aucune référence (doublon binaire de `public/assets/images/pillar_routes_afro_1792601148651.jpg`) |
| 23 | `src/assets/images/romeo_storyteller_1792933587573.jpg` | 1 052 141 | 1,00 Mio | **PROBABLEMENT INUTILISÉ** | Aucune référence (doublon binaire de `public/assets/images/romeo_storyteller_1792933587573.jpg`) |
| 24 | `src/assets/images/baobab_bambou_poster_1793362372337.jpg` | 1 051 759 | 1,00 Mio | **PROBABLEMENT INUTILISÉ** | Aucune référence (doublon binaire de `public/assets/posters/Other eyes < > Sixth sense.jpg`) |
| 25 | `src/assets/images/marques_finance_1792086436922.jpg` | 1 049 818 | 1,00 Mio | **PROBABLEMENT INUTILISÉ** | Aucune référence (doublon binaire de `public/assets/directions/marques-finance.jpg`) |
| 26 | `src/assets/images/recruit_videographer_1791825865262.jpg` | 1 036 198 | 1011,91 Kio | **PROBABLEMENT INUTILISÉ** | Aucune référence (doublon binaire de `public/assets/images/recruit_videographer_1791825865262.jpg`) |
| 27 | `src/assets/images/senami_architecte_1792933801804.jpg` | 1 033 672 | 1009,45 Kio | **PROBABLEMENT INUTILISÉ** | Aucune référence (doublon binaire de `public/assets/images/senami_architecte_1792933801804.jpg`) |
| 28 | `src/assets/images/ps_beaute_1792086353881.jpg` | 1 032 732 | 1008,53 Kio | **PROBABLEMENT INUTILISÉ** | Aucune référence (doublon binaire de `public/assets/directions/produits-services-beaute.jpg`) |
| 29 | `src/assets/images/romeo_dialogue_elders_1792698428934.jpg` | 1 030 946 | 1006,78 Kio | **PROBABLEMENT INUTILISÉ** | Aucune référence (doublon binaire de `public/assets/images/romeo_dialogue_elders_1792698428934.jpg`) |
| 30 | `src/assets/images/projets_social_1792086395729.jpg` | 1 030 885 | 1006,72 Kio | **PROBABLEMENT INUTILISÉ** | Aucune référence (doublon binaire de `public/assets/directions/projets-social.jpg`) |
| 31 | `src/assets/images/baobab_bambou_poster_1793360913718.jpg` | 1 029 577 | 1005,45 Kio | **PROBABLEMENT INUTILISÉ** | Aucune référence trouvée (unique) |
| 32 | `src/assets/images/studio_soi_parcours_1792608978314.jpg` | 1 028 120 | 1004,02 Kio | **PROBABLEMENT INUTILISÉ** | Aucune référence (doublon binaire de `public/assets/images/studio_soi_parcours_1792608978314.jpg`) |
| 33 | `src/assets/images/projets_innovation_1792086397919.jpg` | 994 834 | 971,52 Kio | **PROBABLEMENT INUTILISÉ** | Aucune référence (doublon binaire de `public/assets/directions/projets-innovation.jpg`) |
| 34 | `src/assets/images/amara_andine_1792933642777.jpg` | 989 419 | 966,23 Kio | **PROBABLEMENT INUTILISÉ** | Aucune référence (doublon binaire de `public/assets/images/amara_andine_1792933642777.jpg`) |
| 35 | `src/assets/images/orga_transm_afro_1792611469008.jpg` | 988 070 | 964,91 Kio | **PROBABLEMENT INUTILISÉ** | Aucune référence (doublon binaire de `public/assets/images/orga_transm_afro_1792611469008.jpg`) |
| 36 | `src/assets/images/duo_pere_matthieu_1791655226601.jpg` | 979 796 | 956,83 Kio | **PROBABLEMENT INUTILISÉ** | Aucune référence (doublon binaire de `public/assets/duos/duo_pere_matthieu_1791655226601.jpg`) |
| 37 | `src/assets/images/sika_tisserande_1792933605542.jpg` | 975 238 | 952,38 Kio | **PROBABLEMENT INUTILISÉ** | Aucune référence (doublon binaire de `public/assets/images/sika_tisserande_1792933605542.jpg`) |
| 38 | `src/assets/images/studio_orga_epreuves_1792608979150.jpg` | 974 973 | 952,12 Kio | **PROBABLEMENT INUTILISÉ** | Aucune référence (doublon binaire de `public/assets/images/studio_orga_epreuves_1792608979150.jpg`) |
| 39 | `src/assets/images/romeo_settling_studio_1792698427492.jpg` | 953 832 | 931,48 Kio | **PROBABLEMENT INUTILISÉ** | Aucune référence (doublon binaire de `public/assets/images/romeo_settling_studio_1792698427492.jpg`) |
| 40 | `src/assets/images/beninois_pecheur_tobi_1792165042006.jpg` | 931 854 | 910,01 Kio | **PROBABLEMENT INUTILISÉ** | Aucune référence (doublon binaire de `public/assets/images/beninois_pecheur_tobi_1792165042006.jpg`) |
| 41 | `src/assets/images/vodun_autre_foi_poster_1793362366126.jpg` | 921 340 | 899,75 Kio | **PROBABLEMENT INUTILISÉ** | Aucune référence (doublon binaire de `public/assets/posters/Esu < > Jesus.jpg`) |
| 42 | `src/assets/images/sagesses_pardon_1792083785141.jpg` | 918 778 | 897,24 Kio | **PROBABLEMENT INUTILISÉ** | Aucune référence (doublon binaire de `public/assets/directions/sagesses-pardon.jpg`) |
| 43 | `src/assets/images/kiki_passeur_1792933820505.jpg` | 912 480 | 891,09 Kio | **PROBABLEMENT INUTILISÉ** | Aucune référence (doublon binaire de `public/assets/images/kiki_passeur_1792933820505.jpg`) |
| 44 | `src/assets/images/ps_mode_1792086355077.jpg` | 906 227 | 884,99 Kio | **PROBABLEMENT INUTILISÉ** | Aucune référence (doublon binaire de `public/assets/directions/produits-services-mode.jpg`) |
| 45 | `src/assets/images/marques_tech_1792086434196.jpg` | 905 652 | 884,43 Kio | **PROBABLEMENT INUTILISÉ** | Aucune référence (doublon binaire de `public/assets/directions/marques-tech.jpg`) |
| 46 | `src/assets/images/pictures_words_poster_1793360914575.jpg` | 903 527 | 882,35 Kio | **PROBABLEMENT INUTILISÉ** | Aucune référence trouvée (unique) |
| 47 | `src/assets/images/marques_luxe_1792086431681.jpg` | 898 088 | 877,04 Kio | **PROBABLEMENT INUTILISÉ** | Aucune référence (doublon binaire de `public/assets/directions/marques-luxe.jpg`) |
| 48 | `src/assets/images/beninoise_jeune_senan_1792165025309.jpg` | 895 866 | 874,87 Kio | **PROBABLEMENT INUTILISÉ** | Aucune référence (doublon binaire de `public/assets/images/beninoise_jeune_senan_1792165025309.jpg`) |
| 49 | `src/assets/images/blacks_one_amazones_poster_1793362370283.jpg` | 895 538 | 874,55 Kio | **PROBABLEMENT INUTILISÉ** | Aucune référence (doublon binaire de `public/assets/posters/Blacks One < > Beyond Eve.png`) |
| 50 | `src/assets/images/romeo_lagoon_sunset_1792698428025.jpg` | 894 374 | 873,41 Kio | **PROBABLEMENT INUTILISÉ** | Aucune référence (doublon binaire de `public/assets/images/romeo_lagoon_sunset_1792698428025.jpg`) |
| 51 | `src/assets/images/beninois_sage_dossou_1792165004493.jpg` | 888 328 | 867,51 Kio | **PROBABLEMENT INUTILISÉ** | Aucune référence (doublon binaire de `public/assets/duos/dah-zounon.jpg`) |
| 52 | `src/assets/images/mahougnon_esu_portrait_1791701582891.jpg` | 884 517 | 863,79 Kio | **PROBABLEMENT INUTILISÉ** | Aucune référence (doublon binaire de `public/assets/duos/mahougnon_esu_portrait_1791701582891.jpg`) |
| 53 | `src/assets/images/romeo_arriving_cotonou_1792698426939.jpg` | 877 728 | 857,16 Kio | **PROBABLEMENT INUTILISÉ** | Aucune référence (doublon binaire de `public/assets/images/romeo_arriving_cotonou_1792698426939.jpg`) |
| 54 | `src/assets/images/fiat_luxe_builders_poster_1793362370103.jpg` | 857 103 | 837,01 Kio | **PROBABLEMENT INUTILISÉ** | Aucune référence (doublon binaire de `public/assets/posters/Fiat Luxe < > Street.jpg`) |
| 55 | `src/assets/images/pro_shoot_story_1792918744384.jpg` | 853 859 | 833,85 Kio | **UTILISÉ (dev uniquement)** | `src/components/SubmitStoryScreen.tsx:1382` — servi uniquement en dev (`server.ts:403`), 404 en prod |
| 56 | `src/assets/images/roots_routes_poster_1793362366794.jpg` | 848 929 | 829,03 Kio | **PROBABLEMENT INUTILISÉ** | Aucune référence (doublon binaire de `public/assets/posters/Roots < > Routes.jpg`) |
| 57 | `src/assets/images/selfie_video_story_1792918744207.jpg` | 847 206 | 827,35 Kio | **UTILISÉ (dev uniquement)** | `src/components/SubmitStoryScreen.tsx:1296` — servi uniquement en dev (`server.ts:403`), 404 en prod |
| 58 | `src/assets/images/pictures_words_poster_1793362372137.jpg` | 835 090 | 815,52 Kio | **PROBABLEMENT INUTILISÉ** | Aucune référence (doublon binaire de `public/assets/posters/Focus < >  PhD.jpg`) |
| 59 | `src/assets/images/dossou_logistique_1792933781153.jpg` | 833 751 | 814,21 Kio | **PROBABLEMENT INUTILISÉ** | Aucune référence (doublon binaire de `public/assets/images/dossou_logistique_1792933781153.jpg`) |
| 60 | `src/assets/images/beninoise_femme_sika_1792164985263.jpg` | 820 480 | 801,25 Kio | **PROBABLEMENT INUTILISÉ** | Aucune référence (doublon binaire de `public/assets/images/beninoise_femme_sika_1792164985263.jpg`) |
| 61 | `src/assets/images/coaching_phd_poster_1793362368488.jpg` | 814 383 | 795,30 Kio | **PROBABLEMENT INUTILISÉ** | Aucune référence (doublon binaire de `public/assets/posters/Builders < > Seekers.png`) |
| 62 | `src/assets/images/senan_innovatrice_1792933679487.jpg` | 780 190 | 761,90 Kio | **PROBABLEMENT INUTILISÉ** | Aucune référence (doublon binaire de `public/assets/images/senan_innovatrice_1792933679487.jpg`) |
| 63 | `src/assets/images/romeo_avatar_1792698425983.jpg` | 738 035 | 720,74 Kio | **PROBABLEMENT INUTILISÉ** | Aucune référence (doublon binaire de `public/assets/images/romeo_avatar_1792698425983.jpg`) |
