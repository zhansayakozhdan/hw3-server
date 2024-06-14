import express from "express";
import axios from 'axios';
import cheerio from 'cheerio';
import { Ad } from "../models/ad.model";


export const webParsing = async () => {
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
            await Ad.create(ad);
        }

         console.log(ads.length);        
        
    }catch(error) {
        console.error('Error: ', error);
    }

}