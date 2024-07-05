# TikTok Toronto Food Map
this project displays crawled data from TikTok using Apify. It maps out several tiktok foodie accounts as well as search terms related to toronto food spots.

Check out [my post](https://granite-diver-d78.notion.site/Tiktok-Food-Map-In-progress-118bf059f9364d078414fde80d900a1b?pvs=4) for more info on how this is made. 
Try it for yourself [here](https://tiktoktorontofoodmap.netlify.app/)

<img width="1234" alt="IMG_6303" src="https://github.com/missvickies/tiktok-toronto-food-map/assets/42661718/9ae2e532-f9d8-411a-9505-b5d086be6382">

Try it out here: https://tiktoktorontofoodmap.netlify.app/

## Features
- Loads tiktok videos when you hover over the image.
- Filters by popular hashtags.
  
![GIFMaker_me](https://github.com/missvickies/tiktok-toronto-food-map/assets/42661718/7daf214b-5644-4372-a450-ec6ae31a60ee)

## Data

Using Apify, I scraped videos from 10 toronto foodie accounts and one keyword query “toronto must try”. I had to be very specific in my search queries and it limited the amount of data I could have gotten. In the end, I acquired ~300 Tiktok videos.

I used the chatGPT API to recognize the locations and incorporate it back into JSON. Then, I used Mapbox's search api to locate the addresses of the mentioned restaurants in the tiktok posts.

## Optimizing Load Times

Initially, the website would lag due to the high number of images being loaded at startup. To combat this, I made sure that the pins within the viewbox were the only images and videos being loaded.

## Future Features
- Interpret subtitiles of videos to get restaurant name or locations. ~50% of the videos were missing a restaurant name and location.
- Categorize and assign appropiate hashtags to pins.



