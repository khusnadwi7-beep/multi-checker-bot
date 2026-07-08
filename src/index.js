import { Bot, webhookCallback } from 'grammy';

export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        
        // HEALTH CHECK
        if (url.pathname === '/health') {
            return new Response('OK', { status: 200 });
        }
        
        // WEBHOOK
        if (url.pathname === '/webhook') {
            try {
                // CEK BOT_TOKEN
                if (!env.BOT_TOKEN) {
                    console.error('BOT_TOKEN not set!');
                    return new Response('BOT_TOKEN not set', { status: 500 });
                }
                
                console.log('✅ Bot starting...');
                
                // BUAT BOT
                const bot = new Bot(env.BOT_TOKEN);
                
                // PERINTAH START
                bot.command('start', async (ctx) => {
                    await ctx.reply('✅ *Bot Aktif!*\n\nKirim /menu untuk melihat menu.', { parse_mode: 'Markdown' });
                });
                
                // PERINTAH MENU
                bot.command('menu', async (ctx) => {
                    await ctx.reply(
                        '📋 *Menu Utama*\n\n' +
                        '🎬 Crunchyroll\n' +
                        '🏰 Disney+\n' +
                        '🌐 ExpressVPN\n' +
                        '📧 Hotmail\n' +
                        '🎮 Steam\n' +
                        '📺 Netflix\n' +
                        '📱 Tod.tv\n' +
                        '🍿 Netflix VM\n\n' +
                        'Kirim file combo untuk mulai pengecekan.',
                        { parse_mode: 'Markdown' }
                    );
                });
                
                // HANDLE FILE
                bot.on('message:document', async (ctx) => {
                    await ctx.reply('📥 *File diterima!*', { parse_mode: 'Markdown' });
                });
                
                console.log('✅ Bot handler ready');
                
                // RETURN WEBHOOK
                return await webhookCallback(bot, 'cloudflare')(request);
                
            } catch (error) {
                console.error('❌ Error:', error);
                return new Response('Error: ' + error.message, { status: 500 });
            }
        }
        
        return new Response('Not found', { status: 404 });
    }
};
