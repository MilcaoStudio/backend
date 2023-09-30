const express = require('express');
const serverless = require('serverless-http');
const {
    DATABASE_URL,
    SUPABASE_KEY
} = process.env;
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(DATABASE_URL, SUPABASE_KEY);
console.info('Leaking databaseurl', DATABASE_URL);
console.info('Leaking supabase key', SUPABASE_KEY);
const api = express();

const router = express.Router();
router.get('/', (req, res) => res.send('Status: 200'));
router.get('/anime/:id/likes', async (req, res)=>{
	const { data: anime, error } = await supabase.from('anime').select('id,likes').eq('id', 1);
	console.info(anime);
	if(error) res.status(404).json({error: error});
	else res.json(anime);
});
router.post('/anime/:id/likes', async (req, res)=>{
	const id = req.params.id;
	let { data: anime, getError } = await supabase.from('anime').select('id,likes').eq('id', 1);
	console.info(anime);
	if(getError) res.status(404).json({error: getError});
	const { updateError } = await supabase.from('anime').update({ likes: ++anime.likes}).eq('id', +id);
	if(updateError) res.status(404).json({error: updateError});
	else res.json(anime);
});
api.use('/api/', router);

exports.handler = serverless(api);
