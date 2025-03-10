import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix }) => {
    await m.react('✖️')
    if (!text) return conn.reply(m.chat, `☁️ Ingresa el texto de la canción que quieras buscar en SoundCloud`, m, fake)

    await m.react('🕒')
    let result = await soundcloudSearch(text)
    let title = result.name
    let HS = 'Responde a este mensaje con el número de la canción que quieres\n\n'
    result.forEach((t, index) => { HS += `*${index + 1}* ${t.name}\n` })
    HS += `\n\n*Ejemplo de uso: *responder al mensaje* 1`
    let { key } = await conn.reply(m.chat, HS, m)
    await m.react('✅')
    conn.SoundCloudSearch[m.sender] = { result, key, title }
}

handler.before = async (m, { conn }) => {
    conn.SoundCloudSearch = conn.SoundCloudSearch ? conn.SoundCloudSearch : {}
    if (m.isBaileys || !(m.sender in conn.SoundCloudSearch)) return

    let { result, key, title } = conn.SoundCloudSearch[m.sender]
    if (!m.quoted || m.quoted.id !== key.id || !m.text) return
    let c = m.text.trim()
    let n = Number(c)
    if (n >= 1 && n <= result.length) {
        await m.react('🕓')
        let s = result[n - 1]

        try {
            let res = await soundcloudDL(s.link)
            let thumbnail = s.imagen

            let aud = {
                audio: { url: res.download },
                mimetype: 'audio/mp4',
                fileName: `${res.title}.mp3`,
                contextInfo: {
                    externalAdReply: {
                        showAdAttribution: true,
                        mediaType: 2,
                        mediaUrl: null,
                        title: res.title,
                        sourceUrl: null,
                        thumbnail: await (await conn.getFile(thumbnail)).data
                    }
                }
            }

            await conn.sendMessage(m.chat, aud, { quoted: m })
            await m.react('✅')
            conn.sendMessage(m.chat, { delete: key })
            delete conn.SoundCloudSearch[m.sender]
        } catch (error) {
            console.error('Api DL error : ', error)
            await m.react('✖️')
            await conn.reply(m.chat, 'Error al enviar la canción', m)
        }
    } else {
        await conn.reply(m.chat, "Responde con uno de los números de la canción que quieres", m)
    }
}

handler.help = ['soundcloudsearch *<texto>*'];
handler.tags = ['search'];
handler.command = ['soundcloudsearch']

export default handler

async function soundcloudDL(url) {
    try {
        let ApiDL = await fetch(`https://api.siputzx.my.id/api/d/soundcloud?url=${encodeURIComponent(url)}`)
        let json = await ApiDL.json()

        return { download: json.data.url, title: json.data.title, imagen: json.data.thumbnail }
    } catch (error) {
        console.error('Api DL error : ', error)
    }
}

async function soundcloudSearch(q) {
    try {
        let apiS = await fetch(`https://api.siputzx.my.id/api/s/soundcloud?query=${encodeURIComponent(q)}`)
        let jsonS = await apiS.json()

        return jsonS.data.map(item => ({
            name: item.permalink,
            link: item.permalink_url,
            imagen: item.artwork_url,
        }))
    } catch (error) {
        console.error('Api Search error : ', error)
        await m.react('✖️')
    }
}