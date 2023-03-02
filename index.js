// Declare and set up Discord as well as import the dotenv.
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
})

// Declare and set up OpenGPT.
const { Configuration, OpenAIApi } = require('openai');

const openaiconfiguration = new Configuration({
    apiKey: process.env.CHATGPTTOKEN
});
const openai = new OpenAIApi(openaiconfiguration);

// What model we are using - it will probably be text-davinci-003
const modelname = "text-davinci-003";

// How creative the answers should be - 0.0 = only use defined data, 1.0 = create new data
const temperature = 0.6;

// How much text we allow in a single command. 
const tokencount = 500;

client.on('messageCreate', async (msg) => {
    console.log(msg.mentions.users);
    if (msg.author.id != '1080671932510384278') {
        if (msg.mentions.users.find(u => u.id == '1080671932510384278')) {
            try {
                askQuestion(msg);
            }
            catch (err) {
                msg.reply("There was an error processing this request. Maybe the response was too long.")
            }
        }
    }
})

async function askQuestion(msg) {
    let message = msg.content;

    // Remove us from the message we send to OpenAI - this is unnecessary and will cost additional tokens
    message = message.replace("<@1080671932510384278>", "");

    var response = await openai.createCompletion({
        "model": modelname,
        "prompt": message,
        "max_tokens": tokencount,
        "temperature": temperature,
        "n": 1
    })

    console.log(response.data.choices[0]);
    msg.reply(response.data.choices[0].text);
}

client.login(process.env.DISCORDTOKEN)