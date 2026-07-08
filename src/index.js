// ============================================================
// MULTI-CHECKER BOT - VERSI FINAL
// Support: Crunchyroll, Disney+, ExpressVPN, Hotmail, Steam,
//          Netflix, Tod.tv, Netflix VM
// ============================================================

import { Bot, InlineKeyboard } from 'grammy';

// ============ KONFIGURASI ============
const ADMIN_ID = 8261522463;

// ============ DATABASE SEDERHANA ============
const db = {
    users: new Map(),
    logs: [],
    checkStatus: { running: false, total: 0, done: 0, hit: 0, bad: 0, rate: 0, err: 0 },
    sessions: new Map()
};

// ============ MENU UTAMA ============
function mainMenu() {
    return new InlineKeyboard()
        .text('🎬 Crunchyroll', 'check_crunchyroll')
        .text('🏰 Disney+', 'check_disney')
        .row()
        .text('🌐 ExpressVPN', 'check_expressvpn')
        .text('📧 Hotmail', 'check_hotmail')
        .row()
        .text('🎮 Steam', 'check_steam')
        .text('📺 Netflix', 'check_netflix')
        .row()
        .text('📱 Tod.tv', 'check_tod')
        .text('🍿 Netflix VM', 'check_netflixvm')
        .row()
        .text('📊 Status', 'status')
        .text('❌ Stop', 'stop_check')
        .row()
        .text('👤 Admin Panel', 'admin_panel');
}

// ============ ADMIN PANEL ============
function adminPanel() {
    return new InlineKeyboard()
        .text('➕ Tambah User', 'admin_add_user')
        .text('➖ Hapus User', 'admin_remove_user')
        .row()
        .text('📋 Daftar User', 'admin_list_users')
        .text('📊 Statistik', 'admin_stats')
        .row()
        .text('📝 Log', 'admin_logs')
        .text('🔙 Kembali', 'back_to_menu');
}

// ============ FUNGSI BANTUAN ============
function isUserAllowed(userId) {
    if (userId === ADMIN_ID) return true;
    return db.users.has(userId);
}

function addLog(userId, action) {
    db.logs.push({
        time: new Date().toISOString(),
        user: userId,
        action: action
    });
    if (db.logs.length > 1000) {
        db.logs = db.logs.slice(-500);
    }
}

// ============ FUNGSI CHECK AKUN ============
async function checkAccount(type, email, password) {
    // Simulasi pengecekan dengan hasil random
    // Untuk production, integrasikan script asli
    
    try {
        const random = Math.random();
        
        // Crunchyroll
        if (type === 'crunchyroll') {
            if (random < 0.05) {
                return {
                    status: 'hit',
                    details: 'Plan: MEGA FAN | Exp: 2025-12-31 | Streams: 4'
                };
            } else if (random < 0.08) {
                return {
                    status: 'hit',
                    details: 'Plan: ULTIMATE FAN | Exp: 2026-01-15 | Streams: 6'
                };
            } else {
                return { status: 'bad' };
            }
        }
        
        // Disney+
        if (type === 'disney') {
            if (random < 0.03) {
                return {
                    status: 'hit',
                    details: 'Plan: Premium | Status: Active | Exp: 2025-10-20'
                };
            } else {
                return { status: 'bad' };
            }
        }
        
        // ExpressVPN
        if (type === 'expressvpn') {
            if (random < 0.02) {
                return {
                    status: 'hit',
                    details: 'Plan: 12 Months | Exp: 2026-01-01'
                };
            } else {
                return { status: 'bad' };
            }
        }
        
        // Hotmail
        if (type === 'hotmail') {
            if (random < 0.08) {
                return {
                    status: 'hit',
                    details: 'Valid Hotmail | Verified: Yes'
                };
            } else {
                return { status: 'bad' };
            }
        }
        
        // Steam
        if (type === 'steam') {
            if (random < 0.04) {
                return {
                    status: 'hit',
                    details: 'Level: 50 | Games: 120 | Wallet: $25.50'
                };
            } else if (random < 0.06) {
                return {
                    status: 'hit',
                    details: '2FA Required | SteamID: 7656119834567891'
                };
            } else {
                return { status: 'bad' };
            }
        }
        
        // Netflix (Cookie)
        if (type === 'netflix') {
            if (random < 0.06) {
                return {
                    status: 'hit',
                    details: 'Plan: Premium | Quality: UHD 4K | Profiles: 5'
                };
            } else {
                return { status: 'bad' };
            }
        }
        
        // Tod.tv
        if (type === 'tod') {
            if (random < 0.03) {
                return {
                    status: 'hit',
                    details: 'Plan: Premium | Status: Active | Devices: 3/5'
                };
            } else {
                return { status: 'bad' };
            }
        }
        
        // Netflix VM
        if (type === 'netflixvm') {
            if (random < 0.05) {
                return {
                    status: 'hit',
                    details: 'CURRENT MEMBER | Sub: Premium'
                };
            } else if (random < 0.10) {
                return {
                    status: 'hit',
                    details: 'FORMER MEMBER | No active subscription'
                };
            } else {
                return { status: 'bad' };
            }
        }
        
        return { status: 'err' };
        
    } catch (error) {
        return { status: 'err', details: error.message };
    }
}

// ============ FUNGSI PROCESS CHECKER ============
async function processChecker(ctx, checker, lines) {
    const checkerNames = {
        'crunchyroll': 'Crunchyroll',
        'disney': 'Disney+',
        'expressvpn': 'ExpressVPN',
        'hotmail': 'Hotmail',
        'steam': 'Steam',
        'netflix': 'Netflix',
        'tod': 'Tod.tv',
        'netflixvm': 'Netflix VM'
    };
    
    // Setup status
    db.checkStatus = {
        running: true,
        total: lines.length,
        done: 0,
        hit: 0,
        bad: 0,
        rate: 0,
        err: 0
    };
    
    // Kirim pesan mulai
    let progressMsg = await ctx.reply(
        `🚀 *Memulai pengecekan ${checkerNames[checker] || checker}*\n\n` +
        `📊 Total: ${lines.length} akun\n` +
        `⏳ Mohon tunggu...\n\n` +
        `Gunakan /menu untuk kembali.`,
        { parse_mode: 'Markdown' }
    );
    
    // Proses setiap akun
    let results = [];
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const [email, password] = line.split(':', 2);
        
        // Update status
        db.checkStatus.done = i + 1;
        
        // Lakukan pengecekan
        const result = await checkAccount(checker, email.trim(), password.trim());
        
        if (result.status === 'hit') {
            db.checkStatus.hit++;
            const hitMsg = `✅ *HIT Found!*\n\n` +
                `📧 ${email}\n` +
                `🔑 ${password}\n` +
                `📋 ${result.details || ''}\n\n` +
                `@baron_saplar`;
            
            await ctx.reply(hitMsg, { parse_mode: 'Markdown' });
            results.push(`✅ ${email}:${password} | ${result.details || ''}`);
            
        } else if (result.status === 'bad') {
            db.checkStatus.bad++;
        } else if (result.status === 'rate') {
            db.checkStatus.rate++;
        } else {
            db.checkStatus.err++;
        }
        
        // Update progress setiap 10 akun
        if (i % 10 === 0 || i === lines.length - 1) {
            const progress = Math.round(((i + 1) / lines.length) * 100);
            try {
                await ctx.api.editMessageText(
                    ctx.chat.id,
                    progressMsg.message_id,
                    `🚀 *Pengecekan ${checkerNames[checker] || checker}*\n\n` +
                    `📊 Progress: ${i + 1}/${lines.length} (${progress}%)\n` +
                    `✅ HIT: ${db.checkStatus.hit}\n` +
                    `❌ BAD: ${db.checkStatus.bad}\n` +
                    `⏳ RATE: ${db.checkStatus.rate}\n` +
                    `⚠️ ERR: ${db.checkStatus.err}`,
                    { parse_mode: 'Markdown' }
                );
            } catch (e) {}
        }
        
        // Delay untuk menghindari rate limit
        await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    // Selesai
    db.checkStatus.running = false;
    
    const summary = `✅ *Pengecekan Selesai!*\n\n` +
        `📊 Total: ${lines.length}\n` +
        `✅ HIT: ${db.checkStatus.hit}\n` +
        `❌ BAD: ${db.checkStatus.bad}\n` +
        `⏳ RATE: ${db.checkStatus.rate}\n` +
        `⚠️ ERR: ${db.checkStatus.err}\n\n` +
        `@baron_saplar`;
    
    await ctx.reply(summary, { parse_mode: 'Markdown' });
    
    // Kirim file hasil jika ada HIT
    if (results.length > 0) {
        const fileContent = results.join('\n');
        const buffer = new Blob([fileContent], { type: 'text/plain' });
        await ctx.replyWithDocument(buffer, {
            filename: `hits_${checker}_${Date.now()}.txt`,
            caption: `✅ ${results.length} akun HIT ditemukan!`
        });
    }
    
    // Kirim menu kembali
    await ctx.reply(
        '📋 *Kembali ke menu utama*',
        {
            parse_mode: 'Markdown',
            reply_markup: mainMenu()
        }
    );
}

// ============ MAIN WORKER ============
export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        
        // ============ HEALTH CHECK ============
        if (url.pathname === '/health') {
            return new Response('OK', { status: 200 });
        }
        
        // ============ WEBHOOK ============
        if (url.pathname === '/webhook') {
            try {
                // CEK BOT_TOKEN
                if (!env.BOT_TOKEN) {
                    console.error('BOT_TOKEN not set!');
                    return new Response('BOT_TOKEN not set', { status: 500 });
                }
                
                console.log('🚀 Bot starting...');
                const bot = new Bot(env.BOT_TOKEN);
                
                // ============ START COMMAND ============
                bot.command('start', async (ctx) => {
                    const userId = ctx.from.id;
                    console.log('📨 Start command from:', userId);
                    
                    // Cek akses user
                    if (!isUserAllowed(userId)) {
                        return await ctx.reply(
                            '❌ *Akses Ditolak!*\n\n' +
                            'Kamu tidak memiliki akses ke bot ini.\n' +
                            'Hubungi @baron_saplar untuk mendapatkan akses.',
                            { parse_mode: 'Markdown' }
                        );
                    }
                    
                    await ctx.reply(
                        '🎬 *Selamat Datang di Multi-Checker Bot!*\n\n' +
                        '📌 Pilih layanan yang ingin diperiksa di bawah ini:\n\n' +
                        '📤 *Cara Penggunaan:*\n' +
                        '1. Pilih layanan checker\n' +
                        '2. Kirim file combo (format: email:password)\n' +
                        '3. Tunggu hasil pengecekan\n\n' +
                        '🔗 *Channel:* @baron_saplar',
                        {
                            parse_mode: 'Markdown',
                            reply_markup: mainMenu()
                        }
                    );
                });
                
                // ============ MENU COMMAND ============
                bot.command('menu', async (ctx) => {
                    const userId = ctx.from.id;
                    if (!isUserAllowed(userId)) {
                        return await ctx.reply('❌ Akses Ditolak!');
                    }
                    
                    await ctx.reply(
                        '📋 *Menu Utama*\n\nPilih layanan yang ingin diperiksa:',
                        {
                            parse_mode: 'Markdown',
                            reply_markup: mainMenu()
                        }
                    );
                });
                
                // ============ ADMIN COMMAND ============
                bot.command('admin', async (ctx) => {
                    if (ctx.from.id !== ADMIN_ID) {
                        return await ctx.reply('❌ Akses Ditolak!');
                    }
                    
                    await ctx.reply(
                        '🔐 *Panel Admin*\n\nPilih aksi yang ingin dilakukan:',
                        {
                            parse_mode: 'Markdown',
                            reply_markup: adminPanel()
                        }
                    );
                });
                
                // ============ CANCEL COMMAND ============
                bot.command('cancel', async (ctx) => {
                    const userId = ctx.from.id;
                    if (db.sessions.has(userId)) {
                        db.sessions.delete(userId);
                        await ctx.reply('❌ Proses dibatalkan.');
                    } else {
                        await ctx.reply('ℹ️ Tidak ada proses yang berjalan.');
                    }
                });
                
                // ============ CALLBACK QUERY ============
                bot.on('callback_query:data', async (ctx) => {
                    const userId = ctx.from.id;
                    const data = ctx.callbackQuery.data;
                    
                    await ctx.answerCallbackQuery();
                    
                    // Cek akses user
                    if (!data.startsWith('admin_') && !isUserAllowed(userId)) {
                        return await ctx.reply('❌ Akses Ditolak!');
                    }
                    
                    console.log('📌 Callback:', data, 'from:', userId);
                    
                    // ============ MENU CHECKER ============
                    if (data.startsWith('check_')) {
                        const checker = data.replace('check_', '');
                        const checkerNames = {
                            'crunchyroll': 'Crunchyroll',
                            'disney': 'Disney+',
                            'expressvpn': 'ExpressVPN',
                            'hotmail': 'Hotmail',
                            'steam': 'Steam',
                            'netflix': 'Netflix (Cookie)',
                            'tod': 'Tod.tv',
                            'netflixvm': 'Netflix VM'
                        };
                        
                        db.sessions.set(userId, { action: 'check', checker: checker });
                        
                        let format = 'Format: `email:password` (satu per baris)';
                        if (checker === 'netflix') {
                            format = 'Format cookie Netscape atau JSON';
                        }
                        
                        await ctx.editMessageText(
                            `📤 *Kirim file combo ${checkerNames[checker] || checker}*\n\n` +
                            `${format}\n\n` +
                            'Ketik /cancel untuk membatalkan.',
                            { parse_mode: 'Markdown' }
                        );
                        return;
                    }
                    
                    // ============ STATUS ============
                    if (data === 'status') {
                        const status = db.checkStatus;
                        if (!status.running) {
                            await ctx.reply('ℹ️ Tidak ada pengecekan yang sedang berjalan.');
                            return;
                        }
                        
                        const progress = status.total > 0 ? Math.round((status.done / status.total) * 100) : 0;
                        
                        await ctx.reply(
                            `📊 *Status Pengecekan*\n\n` +
                            `📈 Progress: ${status.done}/${status.total} (${progress}%)\n` +
                            `✅ HIT: ${status.hit}\n` +
                            `❌ BAD: ${status.bad}\n` +
                            `⏳ RATE: ${status.rate}\n` +
                            `⚠️ ERR: ${status.err}`,
                            { parse_mode: 'Markdown' }
                        );
                        return;
                    }
                    
                    // ============ STOP ============
                    if (data === 'stop_check') {
                        db.checkStatus.running = false;
                        await ctx.reply('⏹️ *Pengecekan dihentikan.*', { parse_mode: 'Markdown' });
                        return;
                    }
                    
                    // ============ BACK TO MENU ============
                    if (data === 'back_to_menu') {
                        await ctx.editMessageText(
                            '📋 *Menu Utama*\n\nPilih layanan yang ingin diperiksa:',
                            {
                                parse_mode: 'Markdown',
                                reply_markup: mainMenu()
                            }
                        );
                        return;
                    }
                    
                    // ============ ADMIN PANEL ============
                    if (data === 'admin_panel') {
                        if (userId !== ADMIN_ID) {
                            return await ctx.reply('❌ Akses Ditolak!');
                        }
                        
                        await ctx.editMessageText(
                            '🔐 *Panel Admin*\n\nPilih aksi yang ingin dilakukan:',
                            {
                                parse_mode: 'Markdown',
                                reply_markup: adminPanel()
                            }
                        );
                        return;
                    }
                    
                    // ============ ADMIN: TAMBAH USER ============
                    if (data === 'admin_add_user') {
                        if (userId !== ADMIN_ID) return;
                        
                        db.sessions.set(userId, { action: 'admin_add_user' });
                        await ctx.editMessageText(
                            '📝 *Tambah User*\n\n' +
                            'Kirim ID Telegram user yang ingin ditambahkan.\n' +
                            'Contoh: `123456789`\n\n' +
                            'Ketik /cancel untuk membatalkan.',
                            { parse_mode: 'Markdown' }
                        );
                        return;
                    }
                    
                    // ============ ADMIN: HAPUS USER ============
                    if (data === 'admin_remove_user') {
                        if (userId !== ADMIN_ID) return;
                        
                        db.sessions.set(userId, { action: 'admin_remove_user' });
                        await ctx.editMessageText(
                            '🗑️ *Hapus User*\n\n' +
                            'Kirim ID Telegram user yang ingin dihapus.\n' +
                            'Contoh: `123456789`\n\n' +
                            'Ketik /cancel untuk membatalkan.',
                            { parse_mode: 'Markdown' }
                        );
                        return;
                    }
                    
                    // ============ ADMIN: DAFTAR USER ============
                    if (data === 'admin_list_users') {
                        if (userId !== ADMIN_ID) return;
                        
                        const userList = Array.from(db.users.values());
                        if (userList.length === 0) {
                            await ctx.editMessageText(
                                '📋 *Daftar User*\n\nBelum ada user terdaftar.',
                                { parse_mode: 'Markdown' }
                            );
                            return;
                        }
                        
                        let text = '📋 *Daftar User*\n\n';
                        userList.forEach((u, i) => {
                            text += `${i+1}. ID: \`${u.id}\`\n`;
                            text += `   Username: @${u.username || 'N/A'}\n`;
                            text += `   Paket: ${u.package || 'N/A'}\n`;
                            text += `   Expired: ${u.expired || 'N/A'}\n\n`;
                        });
                        
                        await ctx.editMessageText(text, { parse_mode: 'Markdown' });
                        return;
                    }
                    
                    // ============ ADMIN: STATISTIK ============
                    if (data === 'admin_stats') {
                        if (userId !== ADMIN_ID) return;
                        
                        const status = db.checkStatus;
                        const totalUsers = db.users.size;
                        
                        let text = '📊 *Statistik Bot*\n\n';
                        text += `👥 Total User: ${totalUsers}\n`;
                        text += `🔄 Pengecekan: ${status.running ? '✅ Aktif' : '❌ Tidak Aktif'}\n`;
                        text += `📈 Total Combo: ${status.total || 0}\n`;
                        text += `✅ HIT: ${status.hit || 0}\n`;
                        text += `❌ BAD: ${status.bad || 0}\n`;
                        text += `⏳ RATE: ${status.rate || 0}\n`;
                        text += `⚠️ ERR: ${status.err || 0}`;
                        
                        await ctx.editMessageText(text, { parse_mode: 'Markdown' });
                        return;
                    }
                    
                    // ============ ADMIN: LOG ============
                    if (data === 'admin_logs') {
                        if (userId !== ADMIN_ID) return;
                        
                        const logs = db.logs.slice(-20);
                        if (logs.length === 0) {
                            await ctx.editMessageText(
                                '📝 *Log Penggunaan*\n\nBelum ada log.',
                                { parse_mode: 'Markdown' }
                            );
                            return;
                        }
                        
                        let text = '📝 *Log Penggunaan (20 terakhir)*\n\n';
                        logs.forEach(log => {
                            text += `🕐 ${log.time}\n`;
                            text += `👤 User: ${log.user}\n`;
                            text += `📋 Aksi: ${log.action}\n\n`;
                        });
                        
                        await ctx.editMessageText(text, { parse_mode: 'Markdown' });
                        return;
                    }
                });
                
                // ============ HANDLER TEXT ============
                bot.on('message:text', async (ctx) => {
                    const userId = ctx.from.id;
                    const text = ctx.message.text;
                    const session = db.sessions.get(userId);
                    
                    if (!session) return;
                    
                    // ============ ADMIN: TAMBAH USER ============
                    if (session.action === 'admin_add_user' && userId === ADMIN_ID) {
                        const targetId = parseInt(text);
                        if (isNaN(targetId)) {
                            await ctx.reply('❌ Format salah! Kirim ID numerik.');
                            return;
                        }
                        
                        // Tampilkan pilihan paket
                        const keyboard = new InlineKeyboard()
                            .text('📅 1 Minggu', `package_7_${targetId}`)
                            .text('📅 1 Bulan', `package_30_${targetId}`)
                            .row()
                            .text('♾️ Lifetime', `package_0_${targetId}`)
                            .text('❌ Batal', 'back_to_menu');
                        
                        await ctx.reply(
                            `✅ User ID \`${targetId}\` ditemukan.\n\n` +
                            `Pilih paket subscription:`,
                            {
                                parse_mode: 'Markdown',
                                reply_markup: keyboard
                            }
                        );
                        
                        db.sessions.delete(userId);
                        return;
                    }
                    
                    // ============ ADMIN: HAPUS USER ============
                    if (session.action === 'admin_remove_user' && userId === ADMIN_ID) {
                        const targetId = parseInt(text);
                        if (isNaN(targetId)) {
                            await ctx.reply('❌ Format salah! Kirim ID numerik.');
                            return;
                        }
                        
                        if (db.users.has(targetId)) {
                            db.users.delete(targetId);
                            addLog(userId, `Menghapus user ${targetId}`);
                            await ctx.reply(`✅ User \`${targetId}\` berhasil dihapus!`, { parse_mode: 'Markdown' });
                        } else {
                            await ctx.reply(`❌ User \`${targetId}\` tidak ditemukan!`, { parse_mode: 'Markdown' });
                        }
                        
                        db.sessions.delete(userId);
                        return;
                    }
                });
                
                // ============ HANDLER FILE ============
                bot.on('message:document', async (ctx) => {
                    const userId = ctx.from.id;
                    const session = db.sessions.get(userId);
                    
                    if (!session || session.action !== 'check') {
                        return;
                    }
                    
                    const checker = session.checker;
                    const file = ctx.message.document;
                    
                    // Cek ekstensi file
                    if (!file.file_name.endsWith('.txt')) {
                        await ctx.reply('⚠️ Harap kirim file dengan ekstensi .txt');
                        return;
                    }
                    
                    await ctx.reply('📥 *Mengunduh file...*', { parse_mode: 'Markdown' });
                    
                    try {
                        // Download file
                        const fileLink = await ctx.api.getFile(file.file_id);
                        const response = await fetch(`https://api.telegram.org/file/bot${env.BOT_TOKEN}/${fileLink.file_path}`);
                        const content = await response.text();
                        
                        // Parse combo
                        const lines = content.split('\n')
                            .map(line => line.trim())
                            .filter(line => line.includes(':'));
                        
                        if (lines.length === 0) {
                            await ctx.reply('❌ File tidak valid. Pastikan formatnya benar.');
                            db.sessions.delete(userId);
                            return;
                        }
                        
                        // Mulai pengecekan
                        await processChecker(ctx, checker, lines);
                        
                    } catch (error) {
                        await ctx.reply(`❌ Error: ${error.message}`);
                    }
                    
                    db.sessions.delete(userId);
                });
                
                // ============ HANDLER PACKAGE SELECTION ============
                bot.on('callback_query:data', async (ctx) => {
                    const data = ctx.callbackQuery.data;
                    
                    if (data.startsWith('package_')) {
                        const parts = data.split('_');
                        const days = parseInt(parts[1]);
                        const targetId = parseInt(parts[2]);
                        
                        await ctx.answerCallbackQuery();
                        
                        const packageNames = {
                            7: '1 Minggu',
                            30: '1 Bulan',
                            0: 'Lifetime'
                        };
                        
                        const packageName = packageNames[days] || `${days} Hari`;
                        
                        // Tambahkan user
                        const userInfo = {
                            id: targetId,
                            username: ctx.from.username || '',
                            package: packageName,
                            expired: days === 0 ? 'Selamanya' : `${days} hari`
                        };
                        
                        db.users.set(targetId, userInfo);
                        addLog(ADMIN_ID, `Menambahkan user ${targetId} dengan paket ${packageName}`);
                        
                        await ctx.editMessageText(
                            `✅ *User Berhasil Ditambahkan!*\n\n` +
                            `ID: \`${targetId}\`\n` +
                            `Paket: ${packageName}\n` +
                            `Berlaku: ${days === 0 ? 'Selamanya' : `${days} hari`}`,
                            { parse_mode: 'Markdown' }
                        );
                        
                        // Notifikasi ke user
                        try {
                            await ctx.api.sendMessage(
                                targetId,
                                `🎉 *Selamat! Kamu telah diberikan akses ke Multi-Checker Bot!*\n\n` +
                                `📦 Paket: ${packageName}\n` +
                                `📅 Berlaku: ${days === 0 ? 'Selamanya' : `${days} hari`}\n\n` +
                                `Gunakan /start untuk mulai menggunakan bot.`,
                                { parse_mode: 'Markdown' }
                            );
                        } catch (e) {}
                        
                        return;
                    }
                });
                
                // ============ ERROR HANDLER ============
                bot.catch((error) => {
                    console.error('❌ Bot error:', error);
                });
                
                console.log('✅ Bot handler ready');
                return await bot.handle(request);
                
            } catch (error) {
                console.error('❌ FATAL ERROR:', error);
                return new Response('Error: ' + error.message, { status: 500 });
            }
        }
        
        return new Response('Not found', { status: 404 });
    }
};
