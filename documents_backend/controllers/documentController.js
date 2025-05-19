const supabase = require('../services/supabaseService');
const { v4: uuidv4 } = require('uuid');
const streamifier = require('streamifier'); 

exports.uploadFile = async (req, res) => {
  try {
    const { parent_id } = req.body;
    const user_id = req.userId;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileName = `${uuidv4()}_${file.originalname}`;

    // ✅ Correct: Upload as Stream
    const fileStream = streamifier.createReadStream(file.buffer);

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(fileName, fileStream, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.mimetype,
      });

    if (uploadError) {
      console.error(uploadError);
      return res.status(500).json({ error: 'Error uploading file to storage' });
    }

    // Get the public URL
    const { data: { publicUrl }, error: urlError } = await supabase
      .storage
      .from('documents')
      .getPublicUrl(fileName);

    if (urlError) {
      console.error(urlError);
      return res.status(500).json({ error: 'Error generating public URL' });
    }

    // Save metadata in DB
    const { error: insertError } = await supabase
      .from('files')
      .insert([{
        user_id,
        name: file.originalname,
        type: 'file',
        url: publicUrl,
        parent_id: parent_id || null,
      }]);

    if (insertError) {
      console.error(insertError);
      return res.status(500).json({ error: 'Error saving file metadata' });
    }

    res.status(200).json({ message: 'File uploaded successfully', fileUrl: publicUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};


// Create Folder
exports.createFolder = async (req, res) => {
  try {
    const { name, parent_id } = req.body;
    const user_id = req.userId;

    if (!name) {
      return res.status(400).json({ message: 'Folder name is required' });
    }

    const { data, error } = await supabase
      .from('files')
      .insert([{
        user_id,
        name,
        type: 'folder',
        parent_id: parent_id || null,
      }])
      .select()
      .single();

    if (error) {
      console.error(error);
      return res.status(500).json({ message: 'Failed to create folder' });
    }

    res.status(201).json({ message: 'Folder created successfully', folder: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// List Files/Folders under a parent
exports.listFiles = async (req, res) => {
  try {
    const { parent_id } = req.query;
    const user_id = req.userId;

    const { data, error } = await supabase
      .from('files')
      .select('*')
      .eq('user_id', user_id)
      .eq('parent_id', parent_id || null)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      return res.status(500).json({ message: 'Failed to list files/folders' });
    }

    res.status(200).json({ files: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// 🆕 List all Files/Folders for User (Root Level)
exports.listRootFiles = async (req, res) => {
  try {
    const user_id = req.userId;

    const { data, error } = await supabase
      .from('files')
      .select('*')
      .eq('user_id', user_id)
      .is('parent_id', null)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      return res.status(500).json({ message: 'Failed to list root files/folders' });
    }

    res.status(200).json({ files: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// 🆕 Rename File/Folder
exports.renameFileOrFolder = async (req, res) => {
  try {
    const { id } = req.params;
    const { newName } = req.body;
    const user_id = req.userId;

    if (!newName) {
      return res.status(400).json({ message: 'New name is required' });
    }

    const { data: existingFile, error: findError } = await supabase
      .from('files')
      .select('user_id')
      .eq('id', id)
      .single();

    if (findError || !existingFile) {
      return res.status(404).json({ message: 'File or folder not found' });
    }

    if (existingFile.user_id !== user_id) {
      return res.status(403).json({ message: 'You are not authorized to rename this' });
    }

    const { error: updateError } = await supabase
      .from('files')
      .update({ name: newName })
      .eq('id', id);

    if (updateError) {
      console.error(updateError);
      return res.status(500).json({ message: 'Failed to rename' });
    }

    res.status(200).json({ message: 'Renamed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete File/Folder
exports.deleteFileOrFolder = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.userId;

    const { data: existingFile, error: findError } = await supabase
      .from('files')
      .select('id, user_id, url, type')
      .eq('id', id)
      .single();

    if (findError || !existingFile) {
      return res.status(404).json({ message: 'File or folder not found' });
    }

    if (existingFile.user_id !== user_id) {
      return res.status(403).json({ message: 'You are not authorized to delete this' });
    }

    if (existingFile.type === 'file' && existingFile.url) {
      const filePath = existingFile.url.split('/documents/')[1];
      await supabase.storage.from('documents').remove([filePath]);
    }

    const { error: deleteError } = await supabase
      .from('files')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error(deleteError);
      return res.status(500).json({ message: 'Failed to delete file/folder' });
    }

    res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Preview File
exports.previewFile = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.userId;

    const { data, error } = await supabase
      .from('files')
      .select('url, user_id')
      .eq('id', id)
      .single();

    if (error || !data) {
      console.error(error);
      return res.status(404).json({ message: 'File not found' });
    }

    if (data.user_id !== user_id) {
      return res.status(403).json({ message: 'You are not authorized to view this file' });
    }

    if (!data.url) {
      return res.status(404).json({ message: 'No preview available' });
    }

    res.redirect(data.url);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
