/* 
- Downloader Instagram By Izumi-kzx
- Descarga todo de Instagram como publicaciones, historias, reels, destacadas
- https://whatsapp.com/channel/0029VaJxgcB0bIdvuOwKTM2Y
*/
import axios from 'axios';

let handler = async (m, { conn, args }) => {
    if (!args[0]) {
        await m.react('✖️');
        return conn.reply(m.chat, `🍟 Ingresa un link de Instagram`, m);
    }

    if (!args[0].match(new RegExp('^https?:\\/\\/www\\.instagram\\.com\\/([a-zA-Z0-9_-]+)\\/.*$'))) {
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

                if (a.url.match(/\.(jpg|png|jpeg|webp|heic|tiff|bmp)$/)) {
                    images.push({
                        image: { url: a.url },
                        caption: '*✔️🍟 Downloader Instagram.*'
                    });
                } else {
                    videos.push({
                        video: { url: a.url },
                        caption: '*✔️🍟 Downloader Instagram.*'
                    });
                }
            }
        }

        if (images.length > 0) {
            await conn.sendAlbumMessage(m.chat, images, { quoted: m });
        }

        for (let video of videos) {
            await conn.sendMessage(m.chat, video, { quoted: m });
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