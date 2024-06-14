import express from 'express';
import { Ad } from '../models/ad.model';

const router = express.Router();

router.get('/ads', async (req, res) => {
    try {
        const data = await Ad.find({});
        console.log('Ads retrieved');
        res.status(200).json(data);
    }catch (e) {
        console.log('Error with retrieving ads: ', e);
    }
})

router.post('/ads', async (req, res) => {
    try {
        const data = await Ad.create(req.body);
        console.log('Ads is added');
        res.status(200).json(data);
    } catch(e) {
        console.log('Error adding ad: ', e);
    }
})

router.get('/ads/:id', async (req, res) => {
    try {
        const data = await Ad.findById(req.params.id);
        console.log('Get ad by id');
        res.status(200).json(data);
    } catch(e) {
        console.log('Error getting ad by ID: ', e);
    }
});

export { router };


