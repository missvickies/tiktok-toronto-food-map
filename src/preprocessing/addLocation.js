import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const axios = require('axios');
const fs = require('fs');

const CHATGPT_API_KEY = process.env.CHATGPT_API_KEY

// Sample JSON data (replace with your actual JSON data)
const jsonDataArray = require('../data/tiktokdata.json');
const newData = require('./outputs/data_0.json');
// newData = []
noAddresses = require("./noAddress.json")

batch1 = jsonDataArray.slice(0,50) 
batch2 = jsonDataArray.slice(50,100) 
batch3 = jsonDataArray.slice(100,150) 
batch4 = jsonDataArray.slice(150,200) 
batch5 = jsonDataArray.slice(200,250)
batch6 = jsonDataArray.slice(250,300)
batch7 = jsonDataArray.slice(300,303)

async function processData() {
  const processedItems = await Promise.all(batch7.map(async (item) => {

    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: "gpt-4o",
        messages: [
        {
            role: "system",
            content: "You are a helpful assistant.I want you to recognize the restaurant name and address from tiktok posts. you will be given the description and transcripts of the video. i want you to reply in this format: restaurant name: [name], address: [address].if you cannot figure out what restaurant it is then you can put NA. if you cannot figure out the exact address then put NA. please try to search for the address"
        },
        {
            role: "user",
            content: "post:" + item.text + " \n transcript: " + item
        }
        ],
        max_tokens: 200,
        temperature: 0.7,
        n: 1
      }, {
        headers: {
          'Authorization': CHATGPT_API_KEY, 
          'Content-Type': 'application/json'
        }
      });

      res = response.data.choices[0].message.content
      restaurantName = res.split(':')[1].split(",")[0]
      restaurantAddress = res.split(':')[2]
      // console.log(response)
      console.log(restaurantName,restaurantAddress)

      return { ...item, restaurant: restaurantName, address: restaurantAddress};
    } catch (error) {
      console.error('Error processing item:', error);
      return item;
    }
  }));

    processedItems.map(async (item) => { 
      newData.push(item)
      if(item.address === " NA" && item.restaurant !== " NA" ){
        noAddresses.push(item.restaurant)
      }
    })

    const filePath = './outputs/data_0.json';

    try {
      fs.writeFileSync(filePath, JSON.stringify(newData));
      fs.writeFileSync("./noAddress.json" ,JSON.stringify(noAddresses));
      console.log('JSON data saved to file successfully.');
    } catch (error) {
      console.error('Error writing JSON data to file:', error);
    }
}

processData();
