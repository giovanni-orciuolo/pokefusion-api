const puppeteer = require("puppeteer")

const SITE_URL = "https://www.japeal.com/pkm"

async function sleep(seconds) {
  return new Promise(resolve => {
    setTimeout(resolve, seconds * 1000)
  })
}

async function getRandomFusion() {
  let browser;
  try {

    browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setViewport({
      width: 1040,
      height: 780
    })
    console.log("[PokéFusion API] Launched browser through Puppeteer")

    console.log("[PokéFusion API] Navigating to " + SITE_URL)
    await page.goto(SITE_URL)

    // Page fully loaded, you can execute scripts now

    // First, let that putrid PHP Wordpress third world piece of bullcrap load all of its shit
    await sleep(1)

    // Close the Patreon dialog and make the fusion happen
    await page.evaluate(`
      ShowUnlock();
      document.getElementById("fbutton").onclick();
    `)

    // Wait another 5 seconds for the fusion
    await sleep(5)
    console.log("[PokéFusion API] Getting fusion info!")

    // Grab info about final fusion
    const result = await page.evaluate(`
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
    `)
    let fusionInfo = JSON.parse(result)

    console.log("[PokéFusion API] Taking Pokédex screenshot!")

    // Grab Pokédex entry image from page
    await page.evaluate(`changeBG9()`) // Open Pokédex
    const pokedexBase64 = await page.screenshot({
      clip: {
        x: 222,
        y: 545,
        width: 596,
        height: 410
      },
      encoding: "base64"
    });

    console.log("[PokéFusion API] Your fusion is ready!")
    return {
      ...fusionInfo,
      pokedexBase64: pokedexBase64
    }

  } catch (err) {
    console.error("[PokéFusion API] Fatal Error!", err)
  } finally {
    if (browser) { await browser.close() }
  }
}

exports.getRandomFusion = getRandomFusion
