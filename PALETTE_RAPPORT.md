# Rapport de quantification palette des 6 PNG lourds (Prompt 9E-bis)

> **Aucune modification n’a été effectuée dans `public/`** ni dans `src/`, `package.json`, `package-lock.json`, `index.html`, `server.ts` ou `vite.config.ts`. Les 3 variantes (`C`, `A`, `B`) ont été générées dans `archive/palette_tests/` à partir des originaux de `archive/originaux_avant_compression/` (et de la copie actuelle de `public/` pour `C`), et la page de comparaison à taille réelle se trouve dans `archive/comparaison_palette.html`.

## 1. Synthèse des poids et constat technique A vs B

- **Poids cumulé actuel dans `public/` (C)** : **12,39 Mio** (12 994 379 octets)
- **Poids cumulé variante A** (`palette: true, quality: 90, dither: 1.0`, max 1280 px) : **2,79 Mio** (2 927 976 octets, **-77,5 %** vs C)
- **Poids cumulé variante B** (`palette: true, quality: 100, colours: 256, dither: 1.0`, max 1280 px) : **2,79 Mio** (2 927 976 octets, **-77,5 %** vs C)
- **Constat vérifié par hash SHA-256 (`A === B`)** : pour les **6 fichiers**, les variantes **A** et **B** produisent des fichiers **strictement identiques octet pour octet** (256 couleurs, tramage Floyd-Steinberg `dither: 1.0`), car `sharp`/`libimagequant` utilise déjà 256 couleurs par défaut et sature ce plafond sur des illustrations aussi riches dès `quality: 90`.
- **Cas alpha (`pillar_casting_phoenix.png`)** : `hasAlpha: true` est conservé sur A, B et C ; l’inspection pixel par pixel montre que **501 676 / 501 676 pixels ont `alpha = 255`** (aucun pixel transparent ni semi-transparent), donc **`MAE Alpha = 0,000`** et **aucun liseré ni halo de transparence** sur fond clair comme sur fond sombre.

## 2. Tableau comparatif — Poids et mesures objectives (MAE RGB, RMSE, PSNR, SSIM)

> Référence de comparaison pixel par pixel : l’original de `archive/originaux_avant_compression/` redimensionné à 1280 px max (`withoutEnlargement`). Pour `Vodun Rays` (1024×1536 en C) et `Other Eyes` (768×1376 en C), C est sans perte (écart nul).

| Fichier | Variante | Dimensions | Poids | Gain vs C | MAE RGB (0–255) | MAE % | RMSE RGB | PSNR | SSIM (8×8) | Pixels Δ > 2 | MAE Alpha |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| `Voyage.png` | **C** | 720×1280 | 2,48 Mio | 0,0 % (actuel) | 0,000 | 0,00 % | 0,000 | ∞ (sans perte) | 1,00000 | 0,0 % | — |
| `Voyage.png` | **A** | 720×1280 | 593,51 Kio | -76,6 % | 4,179 | 1,64 % | 5,551 | 33,24 dB | 0,98410 | 90,0 % | — |
| `Voyage.png` | **B** | 720×1280 | 593,51 Kio | -76,6 % | 4,179 | 1,64 % | 5,551 | 33,24 dB | 0,98410 | 90,0 % | — |
| `Blacks One ‹ › Amazones.png` | **C** | 715×1280 | 2,17 Mio | 0,0 % (actuel) | 0,000 | 0,00 % | 0,000 | ∞ (sans perte) | 1,00000 | 0,0 % | — |
| `Blacks One ‹ › Amazones.png` | **A** | 715×1280 | 460,09 Kio | -79,2 % | 3,051 | 1,20 % | 4,320 | 35,42 dB | 0,97602 | 73,9 % | — |
| `Blacks One ‹ › Amazones.png` | **B** | 715×1280 | 460,09 Kio | -79,2 % | 3,051 | 1,20 % | 4,320 | 35,42 dB | 0,97602 | 73,9 % | — |
| `Roots < > Routes.png` | **C** | 720×1280 | 2,27 Mio | 0,0 % (actuel) | 0,000 | 0,00 % | 0,000 | ∞ (sans perte) | 1,00000 | 0,0 % | — |
| `Roots < > Routes.png` | **A** | 720×1280 | 480,19 Kio | -79,3 % | 3,677 | 1,44 % | 4,972 | 34,20 dB | 0,97100 | 85,7 % | — |
| `Roots < > Routes.png` | **B** | 720×1280 | 480,19 Kio | -79,3 % | 3,677 | 1,44 % | 4,972 | 34,20 dB | 0,97100 | 85,7 % | — |
| `Vodun Rays ‹ › Autre Foi.png` | **C** | 1024×1536 | 2,54 Mio | 0,0 % (actuel) | 0,000 | 0,00 % | 0,000 | ∞ (sans perte) | 1,00000 | 0,0 % | — |
| `Vodun Rays ‹ › Autre Foi.png` | **A** | 853×1280 | 521,37 Kio | -79,9 % | 2,994 | 1,17 % | 4,151 | 35,77 dB | 0,96793 | 80,2 % | — |
| `Vodun Rays ‹ › Autre Foi.png` | **B** | 853×1280 | 521,37 Kio | -79,9 % | 2,994 | 1,17 % | 4,151 | 35,77 dB | 0,96793 | 80,2 % | — |
| `Other Eyes < > Third Eye.png` | **C** | 768×1376 | 2,00 Mio | 0,0 % (actuel) | 0,000 | 0,00 % | 0,000 | ∞ (sans perte) | 1,00000 | 0,0 % | — |
| `Other Eyes < > Third Eye.png` | **A** | 714×1280 | 572,27 Kio | -72,1 % | 4,175 | 1,64 % | 5,535 | 33,27 dB | 0,97313 | 90,4 % | — |
| `Other Eyes < > Third Eye.png` | **B** | 714×1280 | 572,27 Kio | -72,1 % | 4,175 | 1,64 % | 5,535 | 33,27 dB | 0,97313 | 90,4 % | — |
| `pillar_casting_phoenix.png` | **C** | 574×874 | 960,42 Kio | 0,0 % (actuel) | 0,000 | 0,00 % | 0,000 | ∞ (sans perte) | 1,00000 | 0,0 % | 0,000 |
| `pillar_casting_phoenix.png` | **A** | 574×874 | 231,93 Kio | -75,9 % | 2,392 | 0,94 % | 3,305 | 37,75 dB | 0,97841 | 68,3 % | 0,000 |
| `pillar_casting_phoenix.png` | **B** | 574×874 | 231,93 Kio | -75,9 % | 2,392 | 0,94 % | 3,305 | 37,75 dB | 0,97841 | 68,3 % | 0,000 |

## 3. Recommandation par fichier et zones de banding probables

| Fichier | Recommandation | Zones sensibles au banding / tramage à surveiller dans `comparaison_palette.html` |
|---|---|---|
| `public/assets/Onboardings/Voyage.png` | **A** (ou **B**, identique) — sinon **C** uniquement si le grain dans les visages/ciels vous gêne à l’œil | Ciel bleu en haut, halo radial bleu-blanc autour du globe en bas, transitions de peau du portrait central ; le style BD/contour absorbe bien le tramage `dither: 1.0`. |
| `public/assets/posters/Blacks One ‹ › Amazones.png` | **A** (ou **B**, identique) | Dégradé bleu → orangé du ciel au coucher du soleil, disque solaire, plis clairs de la robe blanche, carnations multiples. |
| `public/assets/posters/Roots < > Routes.png` | **A** (ou **B**, identique) | Halos dorés des tracés lumineux sur la carte d’Afrique, reflet du soleil couchant sur le quai de gare, haut du ciel. |
| `public/assets/posters/Vodun Rays ‹ › Autre Foi.png` | **A** (ou **B**, identique) | Ciel bleu/doré, halo solaire à gauche, drapé blanc des deux figures. |
| `public/assets/posters/Other Eyes < > Third Eye.png` | **A** (ou **B**, identique) — à vérifier à l’œil autour du halo doré | Grand disque solaire doré central, halo énergétique autour des mains à droite, dégradés chauds rouge/or et sol brillant. |
| `public/assets/images/pillar_casting_phoenix.png` | **A** (ou **B**, identique) | Nébuleuse violette sombre en arrière-plan et lueur dorée du phénix. Canal alpha conservé (`hasAlpha: true`), 0 pixel transparent/semi-transparent (`alpha = 255` partout) : aucun halo/liseré sur bord transparent possible. |

## 4. Suite attendue

Confirmez pour chaque fichier (ou globalement) la variante à retenir (`A`, `B` ou `C`). Dès votre confirmation, les variantes choisies seront copiées dans `public/` aux mêmes noms/chemins, puis `npx tsc --noEmit` et `npm run build` seront relancés.
