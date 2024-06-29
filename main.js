const { Builder, By, Key, until } = require('selenium-webdriver');
const fs = require('fs');
const { exec } = require('child_process');
// Specify the path to the ChromeDriver executable
const chrome = require('selenium-webdriver/chrome');
const {TimeoutError} = require("selenium-webdriver/lib/error");
const citaUrl = "https://icp.administracionelectronica.gob.es/icpplus/index.html";
const citaJs = './get-cita.js';
const { notifyTelegram, alert, sendFile } = require('./bot');

// Function to execute the script periodically

const elements = ["form", "tramiteGrupo[0]", "btnEntrar", "txtIdCitado", "btnEnviar"];

const user_agents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/88.0.4324.96 Mobile/15E148 Safari/604.1",
]

let agentIndex = 0;

function getUserAgent() {
    if(agentIndex >= user_agents.length) {
        agentIndex = 0;
    }
    return user_agents.at(agentIndex++);
}

async function heartbeat(){
    await notifyTelegram("I'm still alive!");
}

function playSound() {
    // Replace 'sound.mp3' with the path to your MP3 file
    const soundFile = './sound.mp3';

    // Execute the system command to play the sound
    exec(`afplay ${soundFile}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error playing sound: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }
        console.log(`Sound played successfully`);
    });
}

async  function run() {
    console.log("Running... ")
    const options = new chrome.Options();
    options.addArguments(`--user-data-dir=/tmp/user-agent-string-${agentIndex}`);
    options.addArguments("--disable-extensions");
    options.addArguments(`--user-agent=${getUserAgent()}`);
    options.addArguments('--blink-settings=imagesEnabled=false');
    // options.addArguments('--headless');

    agentIndex++;
    const driver = new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    async function take_snapshot() {
        const screenshot = await driver.takeScreenshot();
        const file_path = `./tmp/screenshot${new Date().toISOString()}.png`
        fs.writeFileSync(file_path, screenshot, 'base64');
        return file_path
    }

    try {
        console.log(new Date().toISOString(), "| Loading...")
        await driver.get(citaUrl);

        try {
            await driver.wait(until.elementLocated(By.xpath('//*[contains(text(), "Too Many Requests")]')), 2000);
            console.log("Too many requests, waiting...")
            await new Promise(resolve => setTimeout(resolve, 10 * 60 * 1000));
            return
        } catch (error) {
            console.log("Loaded!")
        }

        for (const element of elements) {
            console.log("Checking element: ", element)
            await driver.wait(until.elementLocated(By.id(element)), 4000);
            await driver.executeScript(fs.readFileSync(citaJs, 'utf8'));
            console.log("Script executed")
        }

        console.log("We made it through!")

        const notifyPromise = alert();
        playSound();
        const snapshot_path = await take_snapshot();
        await sendFile(snapshot_path);

        await notifyPromise;
        await new Promise(resolve => setTimeout(resolve, 30 * 60 * 1000));
    } catch (e) {
        if(e instanceof TimeoutError) {
            console.log("Nope, no luck...")
        } else {
            console.log(e)
        }
    } finally {
        // Quit the WebDriver session
        await driver.quit();
    }
}

async function runScript() {
    await heartbeat();
    let counter = 0;
    while (true) {
        counter++;
        console.log("Staring attempt: ", counter)
        if(counter % 20 === 0) {await heartbeat()}
        await run(false);
        const min_wait = 2 * 60 * 1000;
        const max_wait = 4 * 60 * 1000;
        const delay = Math.floor(Math.random() * (max_wait - min_wait) + min_wait);
        await new Promise(resolve => setTimeout(resolve, delay));
    }
}

runScript()
