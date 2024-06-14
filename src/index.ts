
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import { router as adsRouter } from "./routes/ad.router";
import connectToMongoDB from "./db";
import cron from 'node-cron';
import axios from "axios";
import { Ad } from "./models/ad.model";
import cheerio from 'cheerio';


dotenv.config();

const port = process.env.PORT || 5000;
connectToMongoDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://hw3-client.vercel.app",
    methods: ["GET", "POST"]
  }
});

app.use(express.json());
app.use(cors({
  origin: 'https://hw3-client.vercel.app'
}));

app.use('/api', adsRouter);

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});


app.get('/', (req, res) => {
  res.send('My Server is running');
});

// Schedule a task to run every hour
cron.schedule('0 * * * *', async () => {
  await webParsing();
});


const webParsing = async () => {
  try {
      const res = await axios.get('https://krisha.kz/arenda/kvartiry/');
      const htmlData = res.data;
      const $ = cheerio.load(htmlData);
     
      const cards = $('.a-card__inc');
      const ads = [];

      for(const card of cards) {
          const structuredData = {
              title: $(card).find('.a-card__title').text().replace(/\n/g, '').trim(),
              price: $(card).find('.a-card__price').text().replace(/\n/g, '').trim(),
              address: $(card).find('.a-card__subtitle').text().replace(/\n/g, '').trim(),
              preview: $(card).find('.a-card__text-preview').text().replace(/\n/g, '').trim(),
              city: $(card).find('.a-card__stats-item').text().replace(/\n/g, '').trim(),
              imageUrl: $(card).find('picture img').attr('src')
          };
          ads.push(structuredData);
      };
      console.log(ads);

      for (const ad of ads) {
        const exists = await Ad.findOne({ imageUrl: ad.imageUrl });
        if (!exists) {
            const newAd = await Ad.create(ad);
            io.emit('newAd', newAd);
        }
    }

       console.log(ads.length);        
      
  }catch(error) {
      console.error('Error: ', error);
  }
}

//cron jobs каждые 10 минут
cron.schedule('*/10 * * * *', async () => {
  console.log('Running webParsing job...');
  await webParsing();
});

server.listen(port, () => {
  console.log('Server is listening on port 5000');
});





