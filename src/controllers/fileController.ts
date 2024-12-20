import { supabase } from '../database/supabaseClient';

export const uploadFile = async (req: any, res: any) => {
    try {
        const fileBuffer = req.file.buffer;
        const fileName = `${Date.now()}-${req.file.originalname}`;

        const { data, error } = await supabase.storage
            .from('uploads')
            .upload(`files/${fileName}`, fileBuffer, {
                contentType: req.file.mimetype,
                upsert: true,
            });

        if (error) {
            console.error('Error uploading to Supabase:', error);
            return res.status(500).send('Error uploading file to Supabase');
        }

        res.redirect('/files');
    } catch (err) {
        console.error('Unexpected error:', err);
        res.status(500).send('Unexpected error occurred');
    }
};

export const listFiles = async (req: any, res: any) => {
    const { data, error } = await supabase.storage.from('uploads').list('files');

    if (error) {
        return res.status(500).send('Error fetching files');
    }

    const files = data.map(file => {
        const publicUrl = supabase.storage
            .from('uploads')
            .getPublicUrl(`files/${file.name}`);

        return { ...file, download_url: publicUrl };
    });

    res.render('files', { files });
};

export const fileDetails = async (req: any, res: any) => {
    const { filename } = req.params;

    const { data, error } = await supabase.storage
        .from('uploads')
        .list('files', { search: filename });

    if (error || !data.length) {
        return res.status(404).send('File not found');
    }

    const file = data.find(f => f.name === filename);
    if (!file) {
        return res.status(404).send('File not found');
    }

    const publicUrl = 'https://vqhwuywtjlcjmkpjwuhm.supabase.co/storage/v1/object/public/uploads/files/';

    res.render('fileDetails', { file: { ...file, download_url: publicUrl } });
};

export const fileDetailsRoute = async (req: any, res: any) => {
    const { filename } = req.params;

    const { data, error } = await supabase.storage
        .from('uploads')
        .list('files', { search: filename });

    if (error || !data.length) {
        return res.status(404).send('File not found');
    }

    const file = data.find(item => item.name === filename);
    if (!file) {
        return res.status(404).send('File not found');
    }

    const publicUrl = 'https://vqhwuywtjlcjmkpjwuhm.supabase.co/storage/v1/object/public/uploads/files/';

    res.render('fileDetails', { file: { ...file, download_url: publicUrl } });
};
