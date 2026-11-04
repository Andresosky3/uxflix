/* Authoring template for the local episode posters. */
(() => {
  'use strict';
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
  const pad = value => String(value).padStart(2, '0');
  const motifs = {
    1: ['brief', 'EL PUNTO DE PARTIDA', '<div class="cover-paper"><b>OBJETIVO</b><i></i><i></i><span class="cover-paper-metric"></span></div><span class="cover-artifact-tag">CONTEXTO + PROPÓSITO</span>'],
    2: ['requirements', 'CADA NECESIDAD CUENTA', '<div class="cover-checklist"><span><i></i><b></b></span><span><i></i><b></b></span><span><i></i><b></b></span></div><span class="cover-artifact-tag">FUENTE · TIPO · PRIORIDAD</span>'],
    3: ['references', 'EXPLORAR PARA APRENDER', '<div class="cover-reference"><span><i></i><b>01</b></span><span><i></i><b>02</b></span><span><i></i><b>03</b></span></div><span class="cover-artifact-tag">ADOPTAR + EVITAR</span>'],
    9: ['testing', 'OBSERVAR Y ESCUCHAR', '<div class="cover-users"><i></i><i></i><i></i></div><div class="cover-test-bars"><b></b><b></b><b></b></div><span class="cover-artifact-tag">TAREAS + HALLAZGOS</span>'],
    10: ['approval', 'LA REFERENCIA APROBADA', '<div class="cover-approval-paper"><i></i><i></i><i></i></div><div class="cover-seal"><i></i></div><span class="cover-artifact-tag">APROBACIÓN POR ESCRITO</span>'],
    11: ['sow', 'UNA GUÍA PARA CONSTRUIR', '<div class="cover-book"><b>SOW</b><i></i><i></i><i></i></div><span class="cover-artifact-tag">IT-F-030 + HANDOFF UX</span>'],
    12: ['development', 'DISEÑO Y DESARROLLO', '<div class="cover-dev-window"><div><i></i><i></i><i></i></div><b></b><b></b><b></b></div><span class="cover-dev-check"></span><span class="cover-artifact-tag">REVISAR + ACOMPAÑAR</span>'],
    13: ['preflight', 'ANTES DEL ESTRENO', '<div class="cover-screen"><span></span><span></span><span></span></div><div class="cover-preflight-check"><i></i></div><span class="cover-artifact-tag">VALIDAR + CORREGIR</span>'],
    14: ['launch', 'TODO LISTO PARA SALIR', '<div class="cover-launch-path"><i></i><b></b><i></i><b></b><i></i></div><span class="cover-artifact-tag">APROBAR · VERIFICAR · COMUNICAR</span>'],
    15: ['orbit', 'EL SIGUIENTE EPISODIO', '<div class="cover-backlog"><span><i></i><b></b></span><span><i></i><b></b></span><span><i></i><b></b></span></div><span class="cover-orbit-dot"></span><span class="cover-artifact-tag">TIPO · FUENTE · PRIORIDAD</span>']
  };

  function render(episode, season, compactArt) {
    // The five provided compact Figma illustrations are preserved verbatim.
    if (compactArt) return `<div class="cover-exact" data-cover-episode="${episode.id}">${compactArt}</div>`;
    const [motif, label, artifact] = motifs[episode.id] || motifs[1];
    return `<article class="cover-poster" data-cover-episode="${episode.id}" style="--cover-background:url('${escape(season.background)}');--cover-accent:${escape(season.color)}">
      <div class="cover-backdrop"></div>
      <header class="cover-kicker"><span>EPISODIO ${pad(episode.id)}</span><i></i><span>${escape(season.methodology || season.phase)}</span><b>UXFLIX</b></header>
      <div class="cover-copy"><h1>${escape(episode.title)}</h1><p>${escape(episode.step)}</p></div>
      <span class="cover-ghost-number" aria-hidden="true">${pad(episode.id)}</span>
      <div class="cover-wiri-halo"></div><img class="cover-wiri" src="assets/9a1b3.png" alt="Wiri">
      <section class="cover-artifact cover-artifact--${motif}" aria-label="${escape(label)}"><h2>${label}</h2><div class="cover-artifact-drawing">${artifact}</div></section>
      <footer class="cover-footer"><span>TEMPORADA ${pad(episode.season)}</span><i></i><span>DE LA IDEA A LA EXPERIENCIA</span></footer>
    </article>`;
  }
  window.UXFLIX_COVER_TEMPLATE = Object.freeze({ render });
})();
