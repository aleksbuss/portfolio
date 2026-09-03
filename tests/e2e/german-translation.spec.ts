import { test, expect } from '@playwright/test';

test.describe('Comprehensive German (DE) Translation Audit', () => {
  test('every section translates fully and accurately to German', async ({ page }) => {
    test.slow();
    await page.addInitScript(() => {
      sessionStorage.setItem('skip_boot', '1');
    });
    await page.goto('/');

    // Switch to German
    const langBtn = page.locator('#langBtn');
    await langBtn.click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'de');

    // 1. Navigation
    await expect(page.locator('.sysbtn[data-key="the-way"] .lbl')).toHaveText('Der Weg');
    await expect(page.locator('.sysbtn[data-key="ledger"] .lbl')).toHaveText('Register');
    await expect(page.locator('.sysbtn[data-key="systems"] .lbl')).toHaveText('Systeme');
    await expect(page.locator('.sysbtn[data-key="approach"] .lbl')).toHaveText('Arbeitsweise');
    await expect(page.locator('.sysbar-cta .lbl')).toHaveText('Interview anfragen →');

    // 2. Hero Section
    await expect(page.locator('[data-i18n="hero.marker.left"]')).toContainText('AGENTIC AI ARCHITEKTUR');
    await expect(page.locator('[data-i18n="hero.marker.right"]')).toContainText('VERFÜGBAR ZUR EINSTELLUNG');
    await expect(page.locator('#heroName .first .typed-name')).toHaveText('Autonome KI-Systeme,', { timeout: 12000 });
    await expect(page.locator('#heroName .last .typed-name')).toHaveText('für die Produktion entwickelt.', { timeout: 12000 });
    await expect(page.locator('[data-i18n="hero.tagline"]')).toContainText('Entwickler von Orchestra');
    await expect(page.locator('[data-i18n="hero.tagline"]')).toContainText('5.400+ automatisierte Tests');
    await expect(page.locator('[data-i18n="hero.pill1"]')).toHaveText('Orchestra MoA (4.100+ Tests)');
    await expect(page.locator('[data-i18n="hero.pill2"]')).toHaveText('4take FastMCP Rat (Pytest)');
    await expect(page.locator('[data-i18n="hero.pill3"]')).toHaveText('5 Produktionssysteme live');
    await expect(page.locator('[data-i18n="hero.pill4"]')).toHaveText('Hof / Saale, Deutschland');
    await expect(page.locator('[data-i18n="hero.interview"]')).toHaveText('Interview anfragen');
    await expect(page.locator('[data-i18n="hero.explore"]')).toHaveText('Systeme erkunden →');
    await expect(page.locator('[data-i18n="hero.cv"]')).toHaveText('Lebenslauf herunterladen');
    await expect(page.locator('[data-i18n="hero.foot.loc.lbl"]')).toHaveText('Standort');
    await expect(page.locator('[data-i18n="hero.foot.loc.val"]')).toContainText('Hof / Saale, Bayern, Deutschland');

    // 3. Section § I — At a glance
    await expect(page.locator('#index .eyebrow')).toHaveText('§ I — Auf einen Blick');
    await expect(page.locator('#index .section-title')).toContainText('Eine kurze Bilanz');
    await expect(page.locator('#index .metric:nth-child(1) .lbl')).toHaveText('Produktionssysteme');
    await expect(page.locator('#index .metric:nth-child(1) .det')).toContainText('Alle solo deployt & live');
    await expect(page.locator('#index .metric:nth-child(2) .lbl')).toHaveText('Automatisierte Tests');
    await expect(page.locator('#index .metric:nth-child(3) .lbl')).toHaveText('Von null auf fünf live');
    await expect(page.locator('#index .metric:nth-child(4) .lbl')).toHaveText('Gesprochene Sprachen');

    // 4. Section § II — The Way
    await expect(page.locator('#story .eyebrow')).toHaveText('§ II — Der Weg');
    await expect(page.locator('#story .section-title')).toContainText('Vierzehn Jahre in der Logistik');
    await expect(page.locator('#story .story-left .lede')).toContainText('Ich nahm nicht den konventionellen Weg');
    await expect(page.locator('#story .story-left p:nth-of-type(2)')).toContainText('Tesco Carlisle');
    await expect(page.locator('#story .story-left p:nth-of-type(3)')).toContainText('Tel-Ran Berlin');
    await expect(page.locator('.story-pull')).toContainText('Selbstdisziplin ist die Fähigkeit');
    await expect(page.locator('#story .tl-row:nth-child(1) .ttl')).toHaveText('Logistik, UK & Deutschland');
    await expect(page.locator('#story .tl-row:nth-child(2) .ttl')).toHaveText('Frontend-Entwickler · Tel-Ran Berlin');
    await expect(page.locator('#story .tl-row:nth-child(3) .ttl')).toHaveText('KI-Systemdesign & Engineering-Selbststudium');
    await expect(page.locator('#story .tl-row:nth-child(4) .ttl')).toHaveText('Engineering & Betrieb · 5 Produktionssysteme');
    await expect(page.locator('#story .tl-row:nth-child(5) .ttl')).toHaveText('Offen für Ihr Team');

    // 5. Section § III — Approach
    await expect(page.locator('#values .eyebrow')).toHaveText('§ III — Arbeitsweise');
    await expect(page.locator('#values .section-title')).toContainText('Was ich entwickle');
    await expect(page.locator('#values .value:nth-child(1) .vix')).toHaveText('01. Liefer-Tempo');
    await expect(page.locator('#values .value:nth-child(2) .vix')).toHaveText('02. Voller Stack');
    await expect(page.locator('#values .value:nth-child(3) .vix')).toHaveText('03. KI-nativ');

    // 6. Section § IV — Systems · Selected
    await expect(page.locator('#projects .eyebrow')).toHaveText('§ IV — Systeme · Auswahl');
    await expect(page.locator('#projects .section-title')).toContainText('Produktive Systeme');
    await expect(page.locator('.proj:nth-child(1) .proj-meta .badge')).toHaveText('Flaggschiff-System');
    await expect(page.locator('.proj:nth-child(1) .proj-cta')).toHaveText('Fallstudie lesen →');

    // 7. Case Study Modal in German
    await page.locator('.proj:nth-child(1) .proj-cta').click();
    const modal = page.locator('#caseModal');
    await expect(modal).toBeVisible();
    await expect(modal.locator('.case-section').nth(0).locator('.case-eyebrow')).toHaveText('Problemstellung');
    await expect(modal.locator('.case-section').nth(1).locator('.case-eyebrow')).toHaveText('Lösung');
    await expect(modal.locator('.case-section').nth(2).locator('.case-eyebrow')).toHaveText('Architektur');
    await expect(modal.locator('.case-section').nth(3).locator('.case-eyebrow')).toHaveText('Kernpunkte');
    await expect(modal.locator('.case-section').nth(4).locator('.case-eyebrow')).toHaveText('Technologie-Stack');
    await expect(page.locator('#caseModalClose')).toHaveAttribute('aria-label', 'Fallstudie schließen');
    await page.locator('#caseModalClose').click();
    await expect(modal).not.toBeVisible();

    // 8. Section § V — Toolkit & Stack
    await expect(page.locator('#stack .eyebrow')).toHaveText('§ V — Werkzeuge & Stack');
    await expect(page.locator('#stack .section-title')).toContainText('Produktions-Stack');
    await expect(page.locator('#stack .stack-row:nth-child(1) .ttl')).toContainText('KI · LLM · Agenten');
    await expect(page.locator('.langs .lang:nth-child(1) .name')).toHaveText('Russisch');
    await expect(page.locator('.langs .lang:nth-child(1) .lvl')).toHaveText('Muttersprache');
    await expect(page.locator('.langs .lang:nth-child(4) .name')).toHaveText('Deutsch');

    // 9. Section § VI — Connect & Hire
    await expect(page.locator('.contact-eye')).toHaveText('§ VI — Kontakt & Engagement');
    await expect(page.locator('.contact-h')).toContainText('Bauen wir etwas, das');
    await expect(page.locator('.contact-cell:nth-child(1) .lbl')).toHaveText('Direkte E-Mail');

    // 10. Footer
    await expect(page.locator('footer div:nth-child(2)')).toContainText('ALLE 5 SYSTEME BETRIEBSBEREIT · 5.400+ TESTS ERFOLGREICH');
  });
});
