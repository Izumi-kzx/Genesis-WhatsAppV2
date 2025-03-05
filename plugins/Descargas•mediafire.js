import axios from "axios";
import { translate } from 'bing-translate-api';

async function Ai3dGenerator(prompt) {
  try {
    let { data } = await axios.get(`https://api.artvy.ai:444/image_search?query=${encodeURIComponent(prompt + " 3D render, ultra-detailed, cinematic lighting")}`, {
      headers: {
        "Accept": "application/json, text/plain, */*",
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Cache-Control": "no-cache",
        "Pragma": "no-cache",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "es-ES,es;q=0.9",
        "Connection": "keep-alive"
      }
    });
    return JSON.stringify(data, null, 2);
  } catch (error) {
    console.error("Error al obtener los datos:", error.response ? error.response.data : error.message);
    return null;
  }
}

const handler = async (m, { conn, text }) => {
  const inputText = text.trim();
  if (!inputText) return m.reply("¡Por favor ingresa un prompt!\nEjemplo: .ai3d Mujer observando el amanecer");

  try {
    const translatedText = await translate(inputText, null, 'es');
    const spanishPrompt = translatedText.translation;

    const jsonResponse = await Ai3dGenerator(spanishPrompt);
    if (!jsonResponse) throw new Error("Error al procesar la solicitud");

    const parsedData = JSON.parse(jsonResponse);
    if (!Array.isArray(parsedData)) throw new Error("Respuesta de la API no válida");
    if (parsedData.length === 0) throw new Error("No se encontraron resultados");

    const firstImage = parsedData[0]?.image;
    if (!firstImage) throw new Error("URL de la imagen no encontrada");

    await conn.sendMessage(m.chat, {
      image: { url: firstImage },
      caption: `🎨 Render 3D: ${inputText}`
    }, { quoted: m });

  } catch (error) {
    console.error("Error:", error);
    m.reply(`❌ Error: ${error.message}`);
  }
};

handler.help = ['ai3d <texto>'];
handler.command = ['ai3d'];
handler.tags = ['ai'];
handler.limit = false;

export default handler;