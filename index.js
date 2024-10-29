const axios = require('axios');
const cheerio = require('cheerio');
const nodemailer = require('nodemailer');

const fetchData = async (url) => {
    try {
        const result = await axios.get(url);
        return result.data;
    } catch (error) {
        console.error("Erro ao buscar dados:", error);
        throw error;
    }
};

const main = async () => {
    const content = await fetchData("https://stardewvalleywiki.com/Villagers");
    const $ = cheerio.load(content);
    let villagers = [];

    $('li.gallerybox').each((i, e) => {
        const title = $(e).find('.gallerytext > p > a').text();
        const avatar = "https://stardewvalleywiki.com" + $(e).find('.thumb > div > a > img').attr("src");
        const link = "https://stardewvalleywiki.com" + $(e).find('.gallerytext > p > a').attr("href");

        villagers.push({ title, avatar, link });
    });
    
    let emailContent = 'Villagers from Stardew Valley:\n\n';
    villagers.forEach(villager => {
        emailContent += `Name: ${villager.title}\nLink: ${villager.link}\nImage: ${villager.avatar}\n\n`;
    });

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, 
        auth: {
            user: 'naoexiste12345@emailteste.com',
            pass: 'naoexiste' 
        }
    });

    const mailOptions = {
        from: 'seu_email@gmail.com',
        to: 'destinatario@gmail.com',
        subject: 'Scrap de Villagers do Stardew Valley',
        text: emailContent
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email enviado: ' + info.response);
    } catch (error) {
        console.log('Erro ao enviar o email: ', error);
    }
};

main();
