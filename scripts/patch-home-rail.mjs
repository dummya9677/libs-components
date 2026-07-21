import fs from 'fs';

const p = 'src/components/home/HomeRightRail.tsx';
let c = fs.readFileSync(p, 'utf8');

const replacement = `      <PromoGradientCard
        variant="rail"
        title="Multi-Agent Intelligence"
        description={\`\${env.appName} orchestrates multiple AI agents to analyze, correlate and resolve your issues faster.\`}
        imageUrl={promoImages.multiAgent || undefined}
        imageAlt="Multi-agent intelligence illustration"
        placeholderLabel="Add PNG to public/images/multi-agent-promo.png"
      />`;

const pattern =
  /      <div className="overflow-hidden rounded-xl bg-gradient-to-br from-client-primary[\s\S]*?      <\/div>\n    <\/aside>/;

if (!pattern.test(c)) {
  console.error('pattern not found');
  process.exit(1);
}

c = c.replace(pattern, `${replacement}\n    </aside>`);
fs.writeFileSync(p, c);
console.log('patched');
