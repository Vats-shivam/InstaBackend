const puppeteer = require("puppeteer");
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());

app.get('/',async (req,res) => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      // await page.goto('https://www.instagram.com/accounts/login/');

      // Agregar encabezados para simular el comportamiento de un navegador real
      await page.setExtraHTTPHeaders({
             'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36'
      });
  
      // const usernameSelector = '#loginForm > div > div:nth-child(1) > div > label > input';
      // const passwordSelector = '#loginForm > div > div:nth-child(2) > div > label > input';
  
      // await page.waitForSelector(usernameSelector);
      // await page.waitForSelector(passwordSelector);
      // const username="vatssshivam2023";
      // const password="Vats@2002";
      // await page.type(usernameSelector, username); // Reemplaza con tu usuario
      // await page.type(passwordSelector, password); // Reemplaza con tu contraseña
  
      // await page.click('#loginForm > div > div:nth-child(3) > button > div');
      // await page.waitForNavigation();
  

      // await page.goto('https://www.instagram.com/'+username+'/?next=%2F');
      await page.goto(`https://www.instagram.com/${'sachintendulkar'}/`);

// Wait for the username header to be present
await page.waitForSelector('header > section h1');

// check username exists or not exists
let isUsernameNotFound = await page.evaluate(() => {
    // check selector exists
    if (document.getElementsByTagName('h2')[0]) {
        // check selector text content
        if (document.getElementsByTagName('h2')[0].textContent == "Sorry, this page isn't available.") {
            return true;
        }
    }
});

if (isUsernameNotFound) {
    console.log('Account not exists!');

    // close browser
    await browser.close();
    return;
}

// Wait for the username header to be present
await page.waitForSelector('header > section h2');

// get username
let username = await page.evaluate(() => {
    return document.querySelectorAll('header > section h2')[0].textContent;
});


// // Wait for the username picture to be present
await page.waitForSelector('header img');

// // get username picture URL
let usernamePictureUrl = await page.evaluate(() => {
     return document.querySelectorAll('header img')[0].getAttribute('src');
 });

// // Wait for the posts count to be present
// await page.waitForSelector('header > section > ul > li span');

// // get number of total posts
let postsCount = await page.evaluate(() => {
     return document.querySelectorAll('header > section > ul > li span')[0].textContent.replace(/\,/g, '');
});

// // Wait for the followers count to be present
await page.waitForSelector('header > section > ul > li span');

// // get number of total followers
let followersCount = await page.evaluate(() => {
     const temp=document.querySelectorAll('header > section > ul > li')[1];
     return temp.querySelector('span').textContent;
 });

// // Wait for the followings count to be present
// await page.waitForSelector('header > section > ul > li span');

// // get number of total followings
 let followingsCount = await page.evaluate(() => {
     return document.querySelectorAll('header > section > ul > li')[2].querySelector('span').textContent;
 });

// // Wait for the bio name to be present
// await page.waitForSelector('header > section h1');

// // get bio name
let name = await page.evaluate(() => {
     // check selector exists
     if (document.querySelectorAll('header > section h1')[1]) {
         return document.querySelectorAll('header > section h1')[1].textContent;
     } else {
         return '';
     }
 });

// // Wait for the recent posts to be present
await page.waitForSelector('div[style*="flex-direction"] div > a');

// // get recent posts (array of url and photo)
let recentPosts = await page.evaluate(() => {
    let results = [];

    // loop on recent posts selector
    document.querySelectorAll('div[style*="flex-direction"] div > a').forEach((el) => {
        // init the post object (for recent posts)
        let post = {};

        // fill the post object with URL and photo data
        post.url = 'https://www.instagram.com' + el.getAttribute('href');
        post.photo = el.querySelector('img').getAttribute('src');

        // add the object to results array (by push operation)
        results.push(post);
    });


    // recentPosts will contain data from results
    return results;
});

await browser.close();

// display the result to console
res.json({
    username,
    usernamePictureUrl,
    postsCount,
    followersCount,
    followingsCount,
    name,
    recentPosts,
    });

});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});