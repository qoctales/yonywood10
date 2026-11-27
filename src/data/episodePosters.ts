// Client-only static ES imports of episode illustrations so Vite includes them in both dev and production bundles.
// IMPORTANT: Never import this file from server.ts or modules dynamically imported by server.ts.

import fiatLuxeQ1 from '../assets/images/fiat_luxe_q1_1795775462745.jpg';
import fiatLuxeQ2 from '../assets/images/fiat_luxe_q2_1795775462185.jpg';
import fiatLuxeQ3 from '../assets/images/fiat_luxe_q3_1795775462314.jpg';
import fiatLuxeQ4 from '../assets/images/fiat_luxe_q4_1795775462828.jpg';

import eViviQ1 from '../assets/images/e_vivi_q1_1795775463396.jpg';
import eViviQ2 from '../assets/images/e_vivi_q2_1795775464728.jpg';
import eViviQ3 from '../assets/images/e_vivi_q3_1795775463843.jpg';
import eViviQ4 from '../assets/images/e_vivi_q4_1795775463775.jpg';

import fouRireQ1 from '../assets/images/fou_rire_q1_1795775464413.jpg';
import fouRireQ2 from '../assets/images/fou_rire_q2_1795775465893.jpg';
import fouRireQ3 from '../assets/images/fou_rire_q3_1795775465512.jpg';
import fouRireQ4 from '../assets/images/fou_rire_q4_1795775466646.jpg';

import jobStoryQ1 from '../assets/images/job_story_q1_1795775467765.jpg';
import jobStoryQ2 from '../assets/images/job_story_q2_1795775685338.jpg';
import jobStoryQ3 from '../assets/images/job_story_q3_1795775685911.jpg';
import jobStoryQ4 from '../assets/images/job_story_q4_1795775468442.jpg';

import votreHonneurQ1 from '../assets/images/votre_honneur_q1_1795775469820.jpg';
import votreHonneurQ2 from '../assets/images/votre_honneur_q2_1795775586907.jpg';
import votreHonneurQ4 from '../assets/images/votre_honneur_q4_1795775587160.jpg';

import hoxoQ2 from '../assets/images/hoxo_twins_q2_1795775528796.jpg';
import hoxoQ3 from '../assets/images/hoxo_twins_q3_1795775528402.jpg';
import hoxoQ4 from '../assets/images/hoxo_twins_q4_1795775588496.jpg';

import diasporasQ1 from '../assets/images/diasporas_roots_q1_1795775686910.jpg';
import diasporasQ4 from '../assets/images/diasporas_roots_q4_1795775587763.jpg';

import hallArtsQ2 from '../assets/images/hall_arts_q2_1795775588062.jpg';
import hallArtsQ3 from '../assets/images/hall_arts_q3_1795775528161.jpg';

// Duocumentaires - Modernité ‹ › Tradition
import modAEp1 from '../assets/images/mod_a_ep1_1795775527491.jpg';
import modAEp4 from '../assets/images/mod_a_ep4_1795775587724.jpg';
import tradBEp1 from '../assets/images/trad_b_ep1_1795775527977.jpg';

// Duocumentaires - Jesus ‹ › Legba
import jesusAEp1 from '../assets/images/jesus_a_ep1_1795775527693.jpg';
import jesusAEp3 from '../assets/images/jesus_a_ep3_1795775527826.jpg';
import legbaBEp1 from '../assets/images/legba_b_ep1_1795775527979.jpg';
import legbaBEp3 from '../assets/images/legba_b_ep3_1795775527969.jpg';

// Duocumentaires - PhD ‹ › Apprentis
import phdAEp1 from '../assets/images/phd_a_ep1_1795775528007.jpg';
import phdAEp2 from '../assets/images/phd_a_ep2_1795775587773.jpg';
import apprBEp2 from '../assets/images/appr_b_ep2_1795775588128.jpg';
import apprBEp4 from '../assets/images/appr_b_ep4_1795775588369.jpg';

// Duocumentaires - Blacks One ‹ › Wowmen
import blacksAEp2 from '../assets/images/blacks_a_ep2_1795775527880.jpg';
import wowmenBEp1 from '../assets/images/wowmen_b_ep1_1795775588913.jpg';
import wowmenBEp4 from '../assets/images/wowmen_b_ep4_1795775530225.jpg';

// Duocumentaires - Bambous ‹ › Irokos
import bambousAEp3 from '../assets/images/bambous_a_ep3_1795775587753.jpg';
import bambousAEp4 from '../assets/images/bambous_a_ep4_1795775587860.jpg';
import irokosBEp1 from '../assets/images/irokos_b_ep1_1795775527377.jpg';
import irokosBEp2 from '../assets/images/irokos_b_ep2_1795775527074.jpg';
import irokosBEp4 from '../assets/images/irokos_b_ep4_1795775588355.jpg';

// Duocumentaires - Horizons ‹ › Benin
import horizAEp2 from '../assets/images/horiz_a_ep2_1795775528186.jpg';
import horizAEp3 from '../assets/images/horiz_a_ep3_1795775587079.jpg';
import beninBEp1 from '../assets/images/benin_b_ep1_1795775588062.jpg';
import beninBEp3 from '../assets/images/benin_b_ep3_1795775589089.jpg';

// Duocumentaires - Builders ‹ › Coachs
import buildAEp1 from '../assets/images/build_a_ep1_1795775527495.jpg';
import coachBEp2 from '../assets/images/coach_b_ep2_1795775589125.jpg';
import coachBEp3 from '../assets/images/coach_b_ep3_1795775527413.jpg';

// Duocumentaires - Images ‹ › Paroles
import imagesAEp2 from '../assets/images/images_a_ep2_1795775588733.jpg';
import imagesAEp4 from '../assets/images/images_a_ep4_1795775588169.jpg';
import parolesBEp2 from '../assets/images/paroles_b_ep2_1795775527222.jpg';

export type FocusQuestionKey = 'q1' | 'q2' | 'q3' | 'q4';
export type DuoEpisodeKey = 'ep1' | 'ep2' | 'ep3' | 'ep4';

export const FOCUS_EPISODE_POSTERS: Record<string, Partial<Record<FocusQuestionKey, string>>> = {
  'fiat-luxe': {
    q1: fiatLuxeQ1,
    q2: fiatLuxeQ2,
    q3: fiatLuxeQ3,
    q4: fiatLuxeQ4
  },
  'e-vivi': {
    q1: eViviQ1,
    q2: eViviQ2,
    q3: eViviQ3,
    q4: eViviQ4
  },
  'pour-rire': {
    q1: fouRireQ1,
    q2: fouRireQ2,
    q3: fouRireQ3,
    q4: fouRireQ4
  },
  cv: {
    q1: jobStoryQ1,
    q2: jobStoryQ2,
    q3: jobStoryQ3,
    q4: jobStoryQ4
  },
  'votre-honneur': {
    q1: votreHonneurQ1,
    q2: votreHonneurQ2,
    q4: votreHonneurQ4
  },
  hoxo: {
    q2: hoxoQ2,
    q3: hoxoQ3,
    q4: hoxoQ4
  },
  diasporas: {
    q1: diasporasQ1,
    q4: diasporasQ4
  },
  artistes: {
    q2: hallArtsQ2,
    q3: hallArtsQ3
  }
};

export const DUO_EPISODE_POSTERS: Record<
  string,
  Partial<Record<DuoEpisodeKey, { partA?: string; partB?: string }>>
> = {
  'modernite-tradition': {
    ep1: { partA: modAEp1, partB: tradBEp1 },
    ep4: { partA: modAEp4 }
  },
  'jesus-legba': {
    ep1: { partA: jesusAEp1, partB: legbaBEp1 },
    ep3: { partA: jesusAEp3, partB: legbaBEp3 }
  },
  'phd-apprentis': {
    ep1: { partA: phdAEp1 },
    ep2: { partA: phdAEp2, partB: apprBEp2 },
    ep4: { partB: apprBEp4 }
  },
  'blacks-one-wowmen': {
    ep1: { partB: wowmenBEp1 },
    ep2: { partA: blacksAEp2 },
    ep4: { partB: wowmenBEp4 }
  },
  'bambous-irokos': {
    ep1: { partB: irokosBEp1 },
    ep2: { partB: irokosBEp2 },
    ep3: { partA: bambousAEp3 },
    ep4: { partA: bambousAEp4, partB: irokosBEp4 }
  },
  'horizons-benin': {
    ep1: { partB: beninBEp1 },
    ep2: { partA: horizAEp2 },
    ep3: { partA: horizAEp3, partB: beninBEp3 }
  },
  'builders-coachs': {
    ep1: { partA: buildAEp1 },
    ep2: { partB: coachBEp2 },
    ep3: { partB: coachBEp3 }
  },
  'regards-paroles': {
    ep2: { partA: imagesAEp2, partB: parolesBEp2 },
    ep4: { partA: imagesAEp4 }
  }
};
