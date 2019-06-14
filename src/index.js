const chromeLauncher = require("chrome-launcher")
const CRI = require("chrome-remote-interface")
const sharp = require("sharp")

const SITE_URL = "https://www.japeal.com/pkm"

async function launchChrome() {
  return await chromeLauncher.launch({
    chromeFlags: [
      '--disable-gpu',
      '--headless',
      '--window-size=1040,780'
    ]
  })
}

async function sleep(seconds) {
  return new Promise(resolve => {
    setTimeout(resolve, seconds * 1000)
  })
}

async function getRandomFusion() {
  let client, chrome;
  try {

    chrome = await launchChrome()
    client = await CRI({
      port: chrome.port
    })

    const {
      Network,
      Page,
      Security,
      DOM,
      Runtime,
    } = client

    Security.certificateError(({eventId}) => {
      Security.handleCertificateError({
        eventId,
        action: 'continue'
      });
    });

    await Promise.all([
      Network.enable(),
      Page.enable(),
      Security.enable(),
      Runtime.enable(),
      DOM.enable(),
    ])
    await Security.setOverrideCertificateErrors({override: true});

    // noinspection JSCheckFunctionSignatures
    await Page.navigate({ url: SITE_URL })
    await Page.loadEventFired();

    // Page fully loaded, you can execute scripts now

    // First, let that putrid PHP Wordpress third world piece of bullcrap load all of its shit
    await sleep(1)

    // Close the Patreon dialog and make the fusion happen
    await Runtime.evaluate({expression: `
      ShowUnlock();
      document.getElementById("fbutton").onclick();
    `})

    // Wait another 5 seconds for the fusion
    await sleep(5)

    // Grab info about final fusion
    const { result } = await Runtime.evaluate({expression: `
    function grabFusionInfo() {
      var fusionIndexes = document.getElementById('fbutton').onclick.toString()
        .replace('function onclick(event) {', '')
        .replace('}', '').replace('LoadNewFusionDelay(', '')
        .replace(')', '').trim().split(',');
      return JSON.stringify({
        leftPkmnIndex: parseInt(fusionIndexes[0]),
        rightPkmnIndex: parseInt(fusionIndexes[1]),
        fusionBase64: document.getElementById('combinedNEW').toDataURL(),
        fusionName: document.getElementById('fnametxt').innerHTML.trim(),
      })
    }
    grabFusionInfo()
    `})
    let fusionInfo = JSON.parse(result.value)

    // Grab Pokédex entry image from page
    await Runtime.evaluate({expression: "changeBG9()"}) // Open Pokédex
    const { data } = await Page.captureScreenshot(); // 214, 200 -> 596, 409.81

    const croppedPokedex = await sharp(Buffer.from(data, 'base64'))
      .extract({
        width: 596, height: 410,
        left: 214, top: 200
      })
      .toBuffer()

    fusionInfo = {
      ...fusionInfo,
      pokedexBase64: Buffer.from(croppedPokedex).toString("base64")
    }
    console.log(fusionInfo)

  } catch (err) {
    console.error("Fatal error during loadClient()", err)
  } finally {
    if (client) { await client.close() }
    if (chrome) { await chrome.kill() }
  }
}

exports.getRandomFusion = getRandomFusion
