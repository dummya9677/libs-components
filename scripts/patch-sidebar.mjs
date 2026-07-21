import fs from 'fs';

const p = 'src/components/layout/AppSidebar.tsx';
let c = fs.readFileSync(p, 'utf8');

const replacement = `        <div className="mx-2.5 mb-2.5 mt-auto">
          <PromoGradientCard
            variant="sidebar"
            title="Need help fast?"
            description="Ask our AI Assistant"
            imageUrl={promoImages.sidebarAssistant || undefined}
            imageAlt="AI assistant illustration"
            placeholderLabel="Add PNG to public/images/sidebar-assistant-promo.png"
            action={{
              label: 'Start a conversation →',
              onClick: () => go(\`/assistant/\${agents[0].slug}\`),
            }}
          />
        </motion.div>`;

// fix motion.div typo in replacement
const fixed = replacement.replaceAll('</motion.div>', '</div>').replaceAll('<motion.div', '<motion.div');

const pattern =
  /        <div className="mx-2\.5 mb-2\.5 mt-auto overflow-hidden rounded-xl bg-gradient-to-b from-client-primary[\s\S]*?          <\/button>\n        <\/div>/;

if (!pattern.test(c)) {
  console.error('pattern not found');
  process.exit(1);
}

c = c.replace(pattern, fixed.replaceAll('motion.div', 'motion.div').replace(/<\/?motion\.div>/g, (m) => (m.startsWith('</') ? '</div>' : '<motion.div>')));

fs.writeFileSync(p, c);
console.log('patched');
