/* UXFLIX · Capítulos animados a partir de las políticas de la metodología. */
(() => {
  'use strict';

  const escape = value => String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[character]));
  const number = value => String(value).padStart(2, '0');

  function render(episode, season = {}) {
    const policies = Array.isArray(episode.policies) ? episode.policies : [];
    const rules = Array.isArray(episode.rules) ? episode.rules : [];
    const exitCriteria = Array.isArray(episode.exitCriteria) ? episode.exitCriteria.join(' ') : episode.exitCriteria;
    const criterion = exitCriteria || rules.map(rule => rule.text).filter(Boolean).join(' ') || episode.objective;
    const criterionLabel = rules.length || exitCriteria ? 'Antes de avanzar' : 'Objetivo de la maniobra';
    const background = season.background || 'assets/8a9ea.png';

    return `<section class="episode-source-scene" data-episode-scene="${number(episode.id)}" data-scene-stage="intro" style="--episode-backdrop:url('${escape(background)}');--episode-accent:${escape(season.color || '#5429af')}">
      <header class="episode-scene-heading">
        <div class="episode-scene-kicker"><span>MANIOBRA ${number(episode.id)} <span class="episode-scene-divider">/</span> TEMPORADA ${number(episode.season)}</span><span class="episode-scene-phase">${escape(season.methodology || season.phase || season.title || 'UX/UI')}</span></div>
        <h1>${escape(episode.step || episode.title)}</h1>
        <p class="episode-scene-question">${escape(episode.question)}</p>
      </header>

      <div class="episode-scene-main">
        <div class="episode-policy-grid">
          ${policies.map((policy, index) => `<article class="episode-policy-card${index === 0 ? ' is-active' : ''}" data-policy-index="${index}">
            <div class="episode-policy-top"><span class="episode-policy-code">${escape(policy.code)}</span><span class="episode-policy-number">${number(index + 1)}</span></div>
            <p>${escape(policy.text)}</p>
            <span class="episode-policy-focus" aria-hidden="true"></span>
          </article>`).join('')}
        </div>

        <aside class="episode-wiri-pane">
          <div class="episode-wiri-stage"><span class="episode-wiri-orbit" aria-hidden="true"></span><img class="episode-wiri-portrait" src="assets/9a1b3.png" alt="Wiri"><span class="episode-wiri-star episode-wiri-star-one" aria-hidden="true">✦</span><span class="episode-wiri-star episode-wiri-star-two" aria-hidden="true">✦</span></div>
          <div class="episode-wiri-advice"><h2><span aria-hidden="true">✦</span> CONSEJO DE WIRI</h2><p>${escape(episode.tip || episode.caption || episode.objective)}</p></div>
        </aside>
      </div>

      <aside class="episode-flight-check"><h2>${escape(criterionLabel)}</h2><p>${escape(criterion)}</p></aside>

      <footer class="episode-policy-timeline"><span class="episode-timeline-label">POLÍTICAS DE LA MANIOBRA</span><div class="episode-policy-track">${policies.map((policy, index) => `<span class="episode-track-step${index === 0 ? ' is-active' : ''}" data-policy-index="${index}"><span>${escape(policy.code)}</span><i aria-hidden="true"></i></span>`).join('')}</div><span class="episode-timeline-count">${number(policies.length)} POLÍTICAS</span></footer>
    </section>`;
  }

  window.UXFLIX_EPISODE_SCENES = Object.freeze({ render });
})();
