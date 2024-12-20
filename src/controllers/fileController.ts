import { supabase } from '../database/supabaseClient';

export const uploadFile = async (req: any, res: any) => {
    try {
        // Access the buffer and file metadata
        const fileBuffer = req.file.buffer;
        const fileName = `${Date.now()}-${req.file.originalname}`;

        // Upload the file buffer to Supabase storage
        const { data, error } = await supabase.storage
            .from('uploads')
            .upload(`files/${fileName}`, fileBuffer, {
                contentType: req.file.mimetype, // Set the correct MIME type
                upsert: true, // Overwrite if file already exists
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

    res.render('files', { files: data });
};
