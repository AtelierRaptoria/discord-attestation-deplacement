// Imports
// =============================================================================

const Discord = require("discord.js");
const config = require("./config.json");
const axios = require("axios").default;
const cron = require("cron");
const fs = require('fs');
const { PDFDocument } = require("pdf-lib");


// Variables
// =============================================================================

const client = new Discord.Client();


// Attestation de déplacement
// -----------------------------------------------------------------------------

var persons = [];
var motive = 0;
var moment = "";

const users = JSON.parse(fs.readFileSync("data/users.json"));
const emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "0️⃣"];
const motives = [
    "Aller au travail, en cours, à un examen",
    "Soins médicaux et consultations de santé",
    "Motif familial impérieux, assistance aux personnes vulnérables",
    "Convocation judiciaire ou administrative",
    "Déménagement",
    "Achats, établissements culturels ou lieux de cultes",
    "Déplacements liés au sport",
    "Animaux de compagnie"
];

const achats = JSON.parse(fs.readFileSync("data/deplacements/achats.json"));
const sport = JSON.parse(fs.readFileSync("data/deplacements/sport.json"));
const familial = JSON.parse(fs.readFileSync("data/deplacements/familial.json"));
const travailFormation = JSON.parse(fs.readFileSync("data/deplacements/travail_formation.json"));
const medical = JSON.parse(fs.readFileSync("data/deplacements/medical.json"));
const queries = achats + sport + familial + travailFormation + medical;



// Functions
// =============================================================================

async function generateAttestationPdf(person, motive, moment) {
    const now = new Date();
    const formatDate = { year: "numeric", month: '2-digit', day: "2-digit" };
    const formatHour = { hour: "2-digit", minute: "2-digit" };

    const attestationVierge = fs.readFileSync("data/attestation_vierge.pdf");
    const pdfDoc = await PDFDocument.load(attestationVierge);

    const form = pdfDoc.getForm();
    const nameField = form.getTextField("Nom Prénom 2");
    const birthDateField = form.getTextField("Date de naissance 2");
    const addressField = form.getTextField("Adresse du domicile 2");
    const dateField = form.getTextField("Date 4");
    const hourField = form.getTextField("Heure 4");
    const motiveField = form.getCheckBox(`distinction Motif ${ motive } (${ moment })`);

    nameField.setText(users[person].nom);
    birthDateField.setText(users[person].date_naissance);
    addressField.setText(users[person].domicile);
    dateField.setText(now.toLocaleDateString("fr-FR", formatDate));
    hourField.setText(now.toLocaleTimeString("fr-FR", formatHour));
    motiveField.check();

    const attestationName = `${ now.getFullYear() }${ ('0' + now.getMonth() + 1).slice(-2) }${ ('0' + now.getDate()).slice(-2) }_${ now.getHours() }${ now.getMinutes() }`;
    const newAttestationPath = `attestations/${ attestationName }_${ users[person].pseudo }.pdf`;
    fs.writeFileSync(newAttestationPath, await pdfDoc.save());

    return newAttestationPath;
}


// Ready event
// =============================================================================

client.on("ready", () => { });


// Attestation de déplacement
// =============================================================================

client.on("message", msg => {
    const channel = client.channels.cache.get(config.ATTESTATIONS_CHANNEL);
    if(msg.channel == channel) {
        if(msg.author == client.user) {
            if(msg.content.startsWith("Qui a besoin d'une attestation ? 👩‍👩‍👧‍👦")) {
                if(Object.keys(users).length < emojis.length) {
                    for(let i = 0; i < Object.keys(users).length; i++) {
                        msg.react(emojis[i])
                    }
                } else {
                    for(let i = 0; i < emojis.length; i++) {
                        msg.react(emojis[i])
                    }
                }
                const filter = (reaction, user) => {
                    return emojis.includes(reaction.emoji.name) && user.id != client.user.id;
                }
                msg.awaitReactions(filter, { max: 1, time: 30000 }).then(collected => {
                    const reaction = collected.first();
                    persons.push(Object.keys(users)[emojis.indexOf(reaction)]);
                    var emojiMotives = "";
                    for(let i = 0; i < motives.length; i++) {
                        emojiMotives += `${ emojis[i] } : ${ motives[i] }\n`;
                    }
                    channel.send(`Quel est le motif de la sortie ? 🪁\n${ emojiMotives }`);
                });
            }
            else if(msg.content.startsWith("Quel est le motif de la sortie ? 🪁")) {
                for(let i = 0; i < motives.length; i++) {
                    msg.react(emojis[i])
                }
                const filter = (reaction, user) => {
                    return emojis.includes(reaction.emoji.name) && user.id != client.user.id;
                }
                msg.awaitReactions(filter, { max: 1, time: 30000 }).then(collected => {
                    const reaction = collected.first();
                    motive = emojis.indexOf(reaction.emoji.name) + 1;
                    channel.send("Quand voulez-vous sortir ? 🚶‍♂️\n🌞 : Entre 6h et 19h\n🌙 : Entre 19h et 6h");
                });
            }
            else if(msg.content.startsWith("Quand voulez-vous sortir ? 🚶‍♂️")) {
                msg.react("🌞");
                msg.react("🌙");
                const filter = (reaction, user) => {
                    return ["🌞", "🌙"].includes(reaction.emoji.name) && user.id != client.user.id;
                }
                msg.awaitReactions(filter, { max: 1, time: 30000 }).then(async collected => {
                    const reaction = collected.first();
                    if(reaction.emoji.name === "🌞") { moment = "jour"}
                    else if(reaction.emoji.name === "🌙") { moment = "nuit" };

                    for(let person of persons) {
                        const newAttestationPath = await generateAttestationPdf(person, motive, moment);
                        const attachment = new Discord.MessageAttachment(newAttestationPath);
                        channel.send(`${ users[person].pseudo }, voici votre attestation de déplacement dérogatoire.\nPrenez soin de vous 🙂`, attachment);
                    }
                    persons = [];
                    motive = 0;
                    moment = "";
                });
            }
            else {
                return
            }
        }
        else {
            var messageClean = msg.content.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ").toLowerCase();
            if(queries.includes(messageClean)) {
                if(messageClean.startsWith("je")) {
                    persons.push(`${ msg.author.username }#${ msg.author.discriminator }`);
                    var emojiMotives = "";
                    for(let i = 0; i < motives.length; i++) {
                        emojiMotives += `${ emojis[i] } : ${ motives[i] }\n`;
                    }
                    channel.send(`Quel est le motif de la sortie ? 🪁\n${ emojiMotives }`);
                } else if(Object.keys(users).length == 2) {
                    for(let user of users) {
                        persons.push(user);
                    }
                    var emojiMotives = "";
                    for(let i = 0; i < motives.length; i++) {
                        emojiMotives += `${ emojis[i] } : ${ motives[i] }\n`;
                    }
                    channel.send(`Quel est le motif de la sortie ? 🪁\n${ emojiMotives }`);
                } else {
                    var emojisPersons = "";

                    if(Object.keys(users).length < emojis.length - 1) {
                        for(let i = 0; i < Object.keys(users).length; i++) {
                            emojisPersons += `${ emojis[i] } : ${ Object.keys(users)[i] }`
                        }
                    } else {
                        for(let i = 0; i < emojis.length; i++) {
                            emojisPersons += `${ emojis[i] } : ${ Object.keys(users)[i] }`
                        }
                    }

                    channel.send(`Qui a besoin d'une attestation ? 👩‍👩‍\n${ emojiPersons }`);
                }
            }
        }
    }
});


// Login
// =============================================================================

client.login(config.BOT_TOKEN);
