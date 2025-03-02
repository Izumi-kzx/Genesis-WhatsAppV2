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
                    videos.push({
                        video: { url: a.url },
                        caption: '*✔️🍟 Downloader Instagram.*'
                    });
                }
            }
        }

        // Verificar si hay imágenes y si sendAlbumMessage es compatible
        if (images.length > 1) {
            try {
                await conn.sendAlbumMessage(m.chat, images, { quoted: m });
            } catch (err) {
                console.log('Error en sendAlbumMessage, enviando imágenes individualmente.');
                for (let img of images) {
                    await conn.sendMessage(m.chat, img, { quoted: m });
                }
            }
        } else if (images.length === 1) {
            await conn.sendMessage(m.chat, images[0], { quoted: m });
        }

        // Enviar videos individualmente
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