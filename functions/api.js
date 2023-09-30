const express = require('express');
const serverless = require('serverless-http');
const {
    DATABASE_URL,
    SUPABASE_KEY
} = process.env;
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(DATABASE_URL, SUPABASE_KEY);

const api = express();

const router = express.Router();
router.get('/', (req, res) => res.send('Status: 200'));
router.get('/anime/:id/likes', async (req, res)=>{
	const { likes, error } = await supabase.from('anime').select('likes').eq('id', req.params.id).maybeSingle();
	if(error) res.status(404).json({error: error});
	else res.json({likes: likes});
});
router.post('/anime/:id/likes', async (req, res)=>{
	const id = req.params.id;
	const { likes, getError } = await supabase.from('anime').select('likes').eq('id', id).maybeSingle();
	if(getError) res.status(404).json({error: getError});
	const { updateError } = await supabase.from('anime').update({ likes: ++likes}).eq('id', id);
	if(updateError) res.status(404).json({error: updateError});
	else res.json({likes: likes});
});
api.use('/api/', router);

exports.handler = serverless(api);
