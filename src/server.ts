// Configure Douala, Cameroon (UTC+1) timezone across the entire Node.js runtime (local sync active)
process.env.TZ = 'Africa/Douala';

import app from './app';
import { env } from './config/env';
import prisma from './config/database';
import { initMediaCleanupScheduler } from './modules/media/mediaCleanup.scheduler';
import { initWhatsAppScheduler } from './modules/whatsapp/whatsapp.scheduler';
import { initSocialMediaScheduler } from './modules/social/social.scheduler';
import { initClientTypeClassificationScheduler } from './modules/clients/clientType.scheduler';

const PORT = env.PORT;

app.listen(PORT, async () => {
  console.log(`\n🚀 Backend running on port: ${PORT}`);
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log(`✅ Database connected successfully\n`);
  } catch (err: any) {
    console.error(`❌ Database connection error:`, err?.message || err);
  }

  // Background schedulers initialized quietly
  try { initMediaCleanupScheduler(); } catch (_) {}
  try { initWhatsAppScheduler(); } catch (_) {}
  try { initSocialMediaScheduler(); } catch (_) {}
  try { initClientTypeClassificationScheduler(); } catch (_) {}
});
