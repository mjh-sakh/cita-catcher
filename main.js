const { Builder, By, Key, until } = require('selenium-webdriver');
const fs = require('fs');
const { exec } = require('child_process');
// Specify the path to the ChromeDriver executable
const chrome = require('selenium-webdriver/chrome');
const chromedriverPath = '../chromedriver/chromedriver'; // Update with your ChromeDriver path
const citaUrl = "https://icp.administracionelectronica.gob.es/icpplus/index.html";
const citaJs = './get-cita.js';

// Function to execute the script periodically

const elements = ["form", "tramiteGrupo[0]", "btnEntrar", "txtIdCitado", "btnEnviar"]

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

async  function run(isHeadless) {
    console.log("Running with ", isHeadless ? "headless mode" : "finally catch cita mode")
    const options = new chrome.Options();
    if(isHeadless) {
        options.addArguments('--headless');
    }
    const driver = new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();
    try {
        console.log("Loading...")
        await driver.get(citaUrl);
        console.log("Loaded!")
        for (const element of elements) {
            console.log("Checking element: ", element)
            await driver.wait(until.elementLocated(By.id(element)), 2000);
            await driver.executeScript(fs.readFileSync(citaJs, 'utf8'));
            console.log("Script executed")
        }

        console.log("We made it through!")

        if(isHeadless) {
            run(false)
        }
        playSound()
        await new Promise(resolve => setTimeout(resolve, 600000));
    } catch (e) {
        console.log(e)
    } finally {
        // Quit the WebDriver session
        await driver.quit();
    }
}

async function runScript() {
    while (true) {
        run(false);
        await new Promise(resolve => setTimeout(resolve, 60000 * 4));
    }
}

runScript()