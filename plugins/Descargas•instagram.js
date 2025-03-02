import axios from 'axios';

let handler = async (m, { conn, args }) => {
    if (!args[0]) {
        await m.react('✖️');
        return conn.reply(m.chat, `🍟 Ingresa un link de Instagram`, m);
    }

    if (!args[0].match(/^https?:\/\/www\.instagram\.com\/([a-zA-Z0-9_-]+)\/.*$/)) {
        await m.react('✖️');
        return conn.reply(m.chat, `☁️ Verifica que sea un link válido de Instagram`, m);
    }

    try {
        await m.react('🕑');
        let api = await axios.get(`https://apidl.asepharyana.cloud/api/downloader/igdl?url=${args[0]}`);

        let processedUrls = new Set();
        let images = [];
        let videos = [];

        for (let a of api.data.data) {
            if (!processedUrls.has(a.url)) {
                processedUrls.add(a.url);

                if (/\.(jpg|png|jpeg|webp|heic|tiff|bmp)$/.test(a.url)) {
                    images.push({
                        image: { url: a.url },
                        caption: '*✔️🍟 Downloader Instagram.*'
                    });
                } else {
                    videos.push(a.url);
                }
            }
        }

        // Enviar imágenes como álbum
        if (images.length > 0) {
            await conn.sendAlbumMessage(m.chat, images, { quoted: m });
        }

        // Enviar videos individualmente
        for (let videoUrl of videos) {
            await conn.sendMessage(m.chat, { video: { url: videoUrl }, caption: '*✔️🍟 Downloader Instagram.*' }, { quoted: m });
        }

        await m.react('✅'); 
    } catch (error) {
        console.log(error);
        await m.react('❌');
    }
};

handler.help = ['ig *<link>*'];
handler.tags = ['dl'];
handler.command = /^(ig|igdl|instagram)$/i;

export default handler;