import puppeteer from 'puppeteer';

const fetch = async function (){
  // Launch a headless browser
  const browser = await puppeteer.launch();
  
  // Open a new page
  const page = await browser.newPage();

  await page.setExtraHTTPHeaders({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36'
});

  // Navigate to your target URL
  await page.goto('https://instrack.app/instagram/thestevenmellor',{ timeout: 60000});

  const handleRow = '#app > div > div.app-content.content > div.content-wrapper > div > div > div:nth-child(2) > div:nth-child(7) > div > div.card-body.pb-0 > div > table > tbody > tr > td'
  
  const tdArray = await page.$$eval(handleRow, tds => {
    // Extract text content from each td element
    return Array.from(tds, td => td.textContent.trim());
  });

  // Log the array of text content
  // console.log('Text Content of TDs in Table:', tdArray[]);

  const instaStats = [];

  for (let i = 0; i < tdArray.length; i += 5) {
    const currentChunk = tdArray.slice(i, i + 5);
    const newObj = {};

    currentChunk.forEach((element, index) => {
      newObj[`key${index + 1}`] = element;
    });
    const temp ={}
    temp.date = newObj.key1; // You can replace this with the actual date logic
    temp.followers = newObj.key2;
    temp.following = newObj.key3;
    temp.media = newObj.key4;
    temp.engagementRatio = newObj.key5;

    instaStats.push(temp);
  }
  console.log(instaStats);
  // res.json( {username,followersCount,followingsCount,postsCount,followersGrowth,weeklyFollowers,engagementRate,avgLikes,avgComments,followersRatio,commentRatio});
};
fetch();