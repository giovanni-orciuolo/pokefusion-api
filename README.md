## PokéFusion API

This library exposes methods to generate random fusions stolen from a shitty PHP Wordpress website and return their properties
as JSON.

Since I get content from another website, I need to actually load it. Which means that you must have a build of Google Chrome
installed (or Chromium, idk tbh)

At the moment I only retrieve the base64 of final fusion from canvas, in the future I will add a lot of fancy crap lol

Guide on how to get all the juicy stuff below
```
Goto https://japeal.com/pkm/

#xcloseBtn -> Click OR call ShowUnlock()
#fbutton -> Click OR call LoadNewFusionDelay(411, 279, 0) Parameters are the Pokémon index numbers

To get images:
#combinedNEW -> canvas.toDataURL() -> Returns base64 of final fusion sprite
#Limagediv -> style.backgroundImage -> Returns left Pokémon sprite URL, e.g. url("imagefiles/SplitParts/Gen1_Originals_0.png")
#Rimagediv -> style.backgroundImage -> Returns left Pokémon sprite URL, e.g. url("imagefiles/SplitParts/Gen1_Originals_0.png")

To get names:
#fnametxt -> innerHTML -> Returns final fusion name (string needs to be trimmed!)
#Ltxt -> innerHTML -> Returns first Pokémon name (string needs to be trimmed!)
#Rtxt -> innerHTML -> Returns second Pokémon name (string needs to be trimmed!)

To get types:
#R1Type -> src -> Returns left Pokémon first type image URL, e.g. "others/sprPKMType_5.png"
#R2Type -> src -> Returns left Pokémon second type image URL, e.g. "others/sprPKMType_5.png" 
#L1Type -> src -> Returns left Pokémon first type image URL, e.g. "others/sprPKMType_5.png"
#L2Type -> src -> Returns left Pokémon second type image URL, e.g. "others/sprPKMType_5.png"
#FusedTypeL -> src -> Returns final fusion first type image URL, e.g. "others/sprPKMType_5.png"
#FusedTypeR -> src -> Returns final fusion first type image URL, e.g. "others/sprPKMType_5.png"

(yes, if a Pokémon is pure type the two images will be equal)

To get cries:
#audio1 > #wav -> src -> Returns left Pokémon cry wav URL, e.g. "Cries/056.wav")
#audio2 > #wav -> src -> Returns right Pokémon cry wav URL, e.g. "Cries/295.wav")

To get share URL: #permalink -> value
```
