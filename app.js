const stateNode = document.createElement("div");
stateNode.className = "loading-state";
stateNode.textContent = "Cargando contenido del sitio...";
document.body.prepend(stateNode);

const getNode = (id) => document.getElementById(id);

const setHtml = (id, value) => {
  const node = getNode(id);
  if (node) {
    node.innerHTML = value;
  }
};

const setText = (id, value) => {
  const node = getNode(id);
  if (node) {
    node.textContent = value;
  }
};

const renderParagraphs = (targetId, paragraphs) => {
  const target = getNode(targetId);
  target.innerHTML = paragraphs.map((text) => `<p>${text}</p>`).join("");
};

const renderValues = (values) => {
  const target = getNode("values-list");
  target.innerHTML = values.map((item) => `
    <article class="value-item">
      <div class="value-icon">${item.number}</div>
      <div>
        <strong>${item.title}</strong>
        <span>${item.text}</span>
      </div>
    </article>
  `).join("");
};

const renderHero = (hero) => {
  setText("hero-eyebrow", hero.eyebrow);
  setHtml("hero-title", hero.title);
  setText("hero-script", hero.script);
  setText("hero-description", hero.description);

  const primary = getNode("hero-primary-action");
  primary.textContent = hero.primaryAction.label;
  primary.href = hero.primaryAction.href;

  const secondary = getNode("hero-secondary-action");
  secondary.textContent = hero.secondaryAction.label;
  secondary.href = hero.secondaryAction.href;

  getNode("hero-points").innerHTML = hero.points
    .map((item) => `<span>${item}</span>`)
    .join("");

  getNode("hero-card").innerHTML = hero.cards
    .map((item) => `
      <div>
        <strong>${item.title}</strong>
        <span>${item.text}</span>
      </div>
    `)
    .join("");

  getNode("hero-media").style.backgroundImage = `
    linear-gradient(180deg, rgba(10, 20, 42, 0.08), rgba(10, 20, 42, 0.4)),
    url("${hero.image}")
  `;
};

const renderServices = (services) => {
  setText("services-title", services.title);
  setText("services-lead", services.lead);

  getNode("service-pillars").innerHTML = services.pillars.map((item, index) => `
    <article class="pillar-card" data-reveal style="--delay: ${index * 90}ms; background-image:
      linear-gradient(180deg, rgba(9, 18, 34, 0.12), rgba(9, 18, 34, 0.72)),
      url('${item.image}');">
      <span>${item.tag}</span>
      <h3>${item.title}</h3>
      <p>${item.text}</p>
    </article>
  `).join("");

  getNode("legal-services").innerHTML = services.legal.map((item, index) => `
    <article class="detail-card" data-reveal style="--delay: ${index * 90}ms;">
      <strong>${item.number}</strong>
      <h3>${item.title}</h3>
      <p>${item.description}</p>
      <ul>${item.items.map((point) => `<li>${point}</li>`).join("")}</ul>
    </article>
  `).join("");
};

const renderRealty = (realty) => {
  setText("realty-eyebrow", realty.eyebrow);
  setText("realty-title", realty.title);
  setText("realty-description", realty.description);
  const realtyLink = getNode("realty-link");

  if (realtyLink && realty.cta) {
    realtyLink.textContent = realty.cta.label;
    realtyLink.href = realty.cta.href;
  }

  getNode("realty-services").innerHTML = realty.services.map((item) => `
    <article class="realty-card">
      <strong>${item.tag}</strong>
      <h3>${item.title}</h3>
      <p>${item.description}</p>
      <ul>${item.items.map((point) => `<li>${point}</li>`).join("")}</ul>
    </article>
  `).join("");

  getNode("realty-visual").style.backgroundImage = `
    linear-gradient(180deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.03)),
    url("${realty.image}")
  `;
};

const renderValueBanner = (valueProposition) => {
  setText("value-title", valueProposition.title);
  getNode("value-metrics").innerHTML = valueProposition.metrics.map((item) => `
    <article class="metric">
      <strong>${item.number}</strong>
      <span>${item.label}</span>
    </article>
  `).join("");

  getNode("value-banner").style.backgroundImage = `
    linear-gradient(180deg, rgba(16, 33, 65, 0.7), rgba(16, 33, 65, 0.82)),
    url("${valueProposition.image}")
  `;
};

const renderContact = (contact) => {
  setText("contact-title", contact.contactTitle);
  setHtml("contact-copy", contact.contactLines.map((line) => `<p>${line}</p>`).join(""));
  setText("schedule-title", contact.scheduleTitle);
  setHtml("schedule-copy", contact.scheduleLines.map((line) => `<p>${line}</p>`).join(""));
  setText("channels-title", contact.channelsTitle);
  setText("channels-copy", contact.channelsCopy);

  getNode("social-links").innerHTML = contact.social.map((item) => `
    <a href="${item.href}" aria-label="${item.label}">${item.short}</a>
  `).join("");
};

const initReveal = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  document.querySelectorAll("[data-reveal]").forEach((element) => {
    observer.observe(element);
  });
};

const renderSite = (data) => {
  document.title = data.meta.title;
  document.querySelector('meta[name="description"]').setAttribute("content", data.meta.description);

  renderHero(data.hero);

  setText("about-title", data.about.title);
  setText("about-lead", data.about.lead);
  renderParagraphs("about-body", data.about.paragraphs);
  renderValues(data.about.values);

  renderServices(data.services);
  renderRealty(data.realty);
  renderValueBanner(data.valueProposition);
  renderContact(data.contact);

  setText("footer-brand", data.footer.brand);
  setText("footer-note", data.footer.note);

  stateNode.remove();
  initReveal();
};

const renderFromFallback = () => {
  if (window.SITE_CONTENT) {
    renderSite(window.SITE_CONTENT);
    return true;
  }
  return false;
};

fetch("content.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("No se pudo cargar el archivo content.json");
    }
    return response.json();
  })
  .then(renderSite)
  .catch((error) => {
    if (renderFromFallback()) {
      return;
    }

    stateNode.className = "error-state";
    stateNode.textContent = `${error.message}. No se encontro contenido alterno para cargar el sitio.`;
  });
