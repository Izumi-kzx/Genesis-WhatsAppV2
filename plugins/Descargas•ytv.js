import { googleImage } from '@bochilteam/scraper'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `𝗤𝘂𝗲 𝗯𝘂𝘀𝗰𝗮𝗿? 🤔️\n𝗨𝘀𝗲𝗹𝗼 𝗱𝗲 𝗹𝗮 𝘀𝗶𝗴𝘂𝗶𝗲𝗻𝘁𝗲 𝗺𝗮𝗻𝗲𝗿𝗮\n𝗘𝗷𝗲𝗺𝗽𝗹𝗼:\n*${usedPrefix + command} Loli*`

    const res_google = await googleImage(text)
    let shuffled = res_google.sort(() => 0.5 - Math.random())
    let images = shuffled.slice(0, 5).map(image => ({
        image: { url: image },
        caption: `*🔎 Resultado de: ${text}*`
    }))

    await conn.sendAlbumMessage(m.chat, images, { quoted: m })
}

handler.help = ['imagen2 *<texto>*']
handler.tags = ['internet', 'dl']
handler.command = /^(image2|imagen2)$/i

export default handler





/* import { googleImage } from '@bochilteam/scraper'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let user = global.db.data.users[m.sender]

    if (!text) throw `𝗤𝘂𝗲 𝗯𝘂𝘀𝗰𝗮𝗿? 🤔️\n𝗨𝘀𝗲𝗹𝗼 𝗱𝗲 𝗹𝗮 𝘀𝗶𝗴𝘂𝗶𝗲𝗻𝘁𝗲 𝗺𝗮𝗻𝗲𝗿𝗮\n𝗘𝗷𝗲𝗺𝗽𝗹𝗼:\n*${usedPrefix + command} Loli*`

    const res = await googleImage(text)
    let image = res.getRandom()
    let link = image

    await conn.sendMessage(m.chat, { 
        image: { url: link }, 
        caption: `*🔎 Resultado De: ${text}*`, 
        footer: dev, 
        buttons: [
            {
                buttonId: `${usedPrefix + command} ${text}`,
                buttonText: { displayText: 'Siguiente' }
            }
        ],
        viewOnce: true,
        headerType: 4
    }, { quoted: m })
}

handler.help = ['imagen *<texto>*']
handler.tags = ['internet', 'dl']
handler.command = /^(image2|imagen2)$/i

export default handler */