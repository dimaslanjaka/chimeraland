import { join } from 'path'

const _args = `--type=renderer --no-sandbox --autoplay-policy=no-user-gesture-required --log-file=/media/dimaslanjaka/DATA/ProgramData/Otohits/OtohitsApp/logs/debug.log --field-trial-handle=6500724731146965368,15747076022479036310,131072 --disable-features=MimeHandlerViewInCrossProcessFrame --lang=en-US --locales-dir-path=/media/dimaslanjaka/DATA/ProgramData/Otohits/OtohitsApp/resources/locales --log-file=/media/dimaslanjaka/DATA/ProgramData/Otohits/OtohitsApp/logs/debug.log --log-severity=disable --resources-dir-path=/media/dimaslanjaka/DATA/ProgramData/Otohits/OtohitsApp/resources --user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:80.0) Gecko/20100101 Firefox/104.0.2 --num-raster-threads=2 --enable-main-frame-before-activation --service-request-channel-token=2011700786163168796 --renderer-client-id=4 --shared-files=v8_context_snapshot_data:100,v8_natives_data:101`
const ___args = [
  '--user-data-dir=' + join(__dirname, 'tmp/puppeteer_profile'),
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--disable-infobars',
  '--window-position=0,0',
  '--ignore-certifcate-errors',
  '--ignore-certifcate-errors-spki-list',
  '--ignoreHTTPSErrors=true',
  '--user-agent="Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/W.X.Y.Z‡ Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"'
]

export const defaultArg = [
  '--user-data-dir=' + join(__dirname, 'tmp/puppeteer_profile'),
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--disable-infobars',
  '--window-position=0,0',
  '--ignore-certifcate-errors',
  '--ignore-certifcate-errors-spki-list',
  '--ignoreHTTPSErrors=true',
  '--user-agent="Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/W.X.Y.Z‡ Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"'
]
