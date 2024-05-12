import puppeteer from 'puppeteer';
import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import dotenv from 'dotenv'
import session from 'express-session';
const app = express();
import connectDB from "./config/db.js";
dotenv.config();
const PORT = process.env.PORT || 1999;

connectDB(process.env.MONGO_URL)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.listen(PORT, () => {
  console.log(`listening at port http://localhost:${PORT}`);
});
import userRoutes from "./routes/userRoutes.js";

app.use(cors({
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  // allowedHeaders: ["Content-Type", "Accept"],
  preflightContinue: false,
  optionsSuccessStatus: 204,
}));
app.use("/user", userRoutes);


app.get('/:username', async (req, res) => {
  // Launch a headless browser
  try {
    const { username } = req.params

    console.log(req.params);
    const browser = await puppeteer.launch();

    // Open a new page
    const page = await browser.newPage();

    await page.setExtraHTTPHeaders({
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36'
    });

    // Navigate to your target URL
    await page.goto(`https://instrack.app/instagram/${username}`, { timeout: 60000 });

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
      const temp = {}
      temp.date = newObj.key1; // You can replace this with the actual date logic
      temp.followers = newObj.key2;
      temp.following = newObj.key3;
      temp.media = newObj.key4;
      temp.engagementRatio = newObj.key5;

      instaStats.push(temp);
    }

    const handleUsername = '#app > div > div.app-content.content > div.content-wrapper > div > div > div:nth-child(2) > div:nth-child(2) > div > div > div > div.text-left.col-md-8.col-lg-5 > div > div > div.d-flex.flex-column > h2'
    // await page.waitForSelector(handleUsername);

    const userName = await page.$eval(handleUsername, element => element.textContent)

    // console.log(username);


    const handleFollowers = '#app > div > div.app-content.content > div.content-wrapper > div > div > div:nth-child(2) > div:nth-child(2) > div > div > div > div.text-center.mt-2.mt-lg-0.col-lg-5 > div > div.d-flex.flex-column.align-items-end.justify-content-between.h-100 > div.d-flex.flex-column.w-100 > div.d-flex.align-items-start.justify-content-between.w-100 > div:nth-child(1) > h4'
    // Use page.$eval to select the element and fetch its text content
    const followersCount = await page.$eval(handleFollowers, element => element.textContent);

    const handleFollowing = '#app > div > div.app-content.content > div.content-wrapper > div > div > div:nth-child(2) > div:nth-child(2) > div > div > div > div.text-center.mt-2.mt-lg-0.col-lg-5 > div > div.d-flex.flex-column.align-items-end.justify-content-between.h-100 > div.d-flex.flex-column.w-100 > div.d-flex.align-items-start.justify-content-between.w-100 > div.d-flex.flex-column.align-items-start.mx-25 > h4'

    const followingsCount = await page.$eval(handleFollowing, element => element.textContent);

    const handlePosts = '#app > div > div.app-content.content > div.content-wrapper > div > div > div:nth-child(2) > div:nth-child(2) > div > div > div > div.text-center.mt-2.mt-lg-0.col-lg-5 > div > div.d-flex.flex-column.align-items-end.justify-content-between.h-100 > div.d-flex.flex-column.w-100 > div.d-flex.align-items-start.justify-content-between.w-100 > div:nth-child(3) > h4'

    const postsCount = await page.$eval(handlePosts, element => element.textContent);

    const handleFollowersGrowth = '#app > div > div.app-content.content > div.content-wrapper > div > div > div:nth-child(2) > div:nth-child(4) > div:nth-child(1) > div:nth-child(1) > div > div > div > div.truncate > h2'

    const followersGrowth = await page.$eval(handleFollowersGrowth, element => element.textContent);

    const handleWeeklyFollowers = '#app > div > div.app-content.content > div.content-wrapper > div > div > div:nth-child(2) > div:nth-child(4) > div:nth-child(1) > div:nth-child(2) > div > div > div > div.truncate > h2'

    const weeklyFollowers = await page.$eval(handleWeeklyFollowers, element => element.textContent);

    const handleEngagement = '#app > div > div.app-content.content > div.content-wrapper > div > div > div:nth-child(2) > div:nth-child(4) > div.row.match-height > div:nth-child(1) > div > div > div > div.truncate > h2'

    const engagementRate = await page.$eval(handleEngagement, element => element.textContent);

    const handleAvgLikes = '#app > div > div.app-content.content > div.content-wrapper > div > div > div:nth-child(2) > div:nth-child(4) > div.row.match-height > div:nth-child(2) > div > div > div > div.truncate > h2'

    const avgLikes = await page.$eval(handleAvgLikes, element => element.textContent);

    const handleAvgComments = '#app > div > div.app-content.content > div.content-wrapper > div > div > div:nth-child(2) > div:nth-child(4) > div.row.match-height > div:nth-child(3) > div > div > div > div.truncate > h2'

    const avgComments = await page.$eval(handleAvgComments, element => element.textContent);

    const handleFollowersRatio = '#app > div > div.app-content.content > div.content-wrapper > div > div > div:nth-child(2) > div:nth-child(4) > div.row.match-height > div:nth-child(5) > div > div > div > div.truncate > h2'

    const followersRatio = await page.$eval(handleFollowersRatio, element => element.textContent)

    const handleCommentRatio = '#app > div > div.app-content.content > div.content-wrapper > div > div > div:nth-child(2) > div:nth-child(4) > div.row.match-height > div:nth-child(6) > div > div > div > div.truncate > h2'

    const commentRatio = await page.$eval(handleCommentRatio, element => element.textContent)


    // Log the text content

    // Close the browser
    await browser.close();

    res.json({ followersCount, followingsCount, postsCount, followersGrowth, weeklyFollowers, engagementRate, avgLikes, avgComments, followersRatio, commentRatio, userName, instaStats });
  }
  catch (err) {
    res.send(new Error("data not found"));
  }
});
