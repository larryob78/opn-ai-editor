import express from 'express';
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '../database/db.js';

const router = express.Router();
const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';
const EXPORTS_DIR = path.join(UPLOAD_DIR, 'exports');

// Ensure exports directory exists
if (!fs.existsSync(EXPORTS_DIR)) {
  fs.mkdirSync(EXPORTS_DIR, { recursive: true });
}

// Export video in specified format
router.post('/', async (req, res) => {
  try {
    const { videoPath, format = 'mp4', quality = 'high', projectId } = req.body;

    if (!videoPath) {
      return res.status(400).json({ error: 'Video path is required' });
    }

    const inputPath = path.join(process.cwd(), videoPath);
    const outputFilename = `export_${uuidv4()}.${format}`;
    const outputPath = path.join(EXPORTS_DIR, outputFilename);

    const command = ffmpeg(inputPath);

    // Configure based on format
    switch (format.toLowerCase()) {
      case 'mp4':
        command
          .videoCodec('libx264')
          .audioCodec('aac')
          .format('mp4');
        break;

      case 'mov':
        command
          .videoCodec('libx264')
          .audioCodec('aac')
          .format('mov');
        break;

      case 'webm':
        command
          .videoCodec('libvpx-vp9')
          .audioCodec('libopus')
          .format('webm');
        break;

      case 'avi':
        command
          .videoCodec('libx264')
          .audioCodec('mp3')
          .format('avi');
        break;

      case 'mkv':
        command
          .videoCodec('libx264')
          .audioCodec('aac')
          .format('matroska');
        break;

      default:
        return res.status(400).json({ error: 'Unsupported format. Use: mp4, mov, webm, avi, or mkv' });
    }

    // Configure quality
    switch (quality) {
      case 'low':
        command.videoBitrate('500k').audioBitrate('64k');
        break;
      case 'medium':
        command.videoBitrate('1000k').audioBitrate('128k');
        break;
      case 'high':
        command.videoBitrate('2500k').audioBitrate('192k');
        break;
      case 'ultra':
        command.videoBitrate('5000k').audioBitrate('320k');
        break;
      default:
        command.videoBitrate('2500k').audioBitrate('192k');
    }

    command
      .output(outputPath)
      .on('start', (commandLine) => {
        console.log('Export started:', commandLine);
      })
      .on('progress', (progress) => {
        console.log(`Export progress: ${progress.percent}%`);
      })
      .on('end', async () => {
        // Save export record to database if project ID provided
        if (projectId) {
          try {
            const db = getDatabase();
            const exportId = uuidv4();

            db.prepare(`
              INSERT INTO exports (id, project_id, format, file_path, created_at)
              VALUES (?, ?, ?, ?, ?)
            `).run(exportId, projectId, format, `/uploads/exports/${outputFilename}`, Date.now());
          } catch (dbError) {
            console.error('Failed to save export record:', dbError);
          }
        }

        res.json({
          success: true,
          exportPath: `/uploads/exports/${outputFilename}`,
          format,
          quality,
          message: 'Video exported successfully'
        });
      })
      .on('error', (err) => {
        console.error('Export error:', err);
        res.status(500).json({ error: 'Export failed', details: err.message });
      })
      .run();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get export history for a project
router.get('/project/:projectId', (req, res) => {
  try {
    const db = getDatabase();
    const exports = db.prepare('SELECT * FROM exports WHERE project_id = ? ORDER BY created_at DESC')
      .all(req.params.projectId);

    res.json({
      success: true,
      exports
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete export
router.delete('/:filename', (req, res) => {
  try {
    const filePath = path.join(EXPORTS_DIR, req.params.filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);

      // Also remove from database if exists
      const db = getDatabase();
      db.prepare('DELETE FROM exports WHERE file_path = ?')
        .run(`/uploads/exports/${req.params.filename}`);

      res.json({ success: true, message: 'Export deleted successfully' });
    } else {
      res.status(404).json({ error: 'Export file not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate preview (low quality, fast)
router.post('/preview', async (req, res) => {
  try {
    const { videoPath } = req.body;

    if (!videoPath) {
      return res.status(400).json({ error: 'Video path is required' });
    }

    const inputPath = path.join(process.cwd(), videoPath);
    const outputFilename = `preview_${uuidv4()}.mp4`;
    const outputPath = path.join(EXPORTS_DIR, outputFilename);

    ffmpeg(inputPath)
      .videoCodec('libx264')
      .audioCodec('aac')
      .size('640x?')
      .videoBitrate('500k')
      .audioBitrate('64k')
      .format('mp4')
      .outputOptions(['-preset ultrafast', '-crf 28'])
      .output(outputPath)
      .on('end', () => {
        res.json({
          success: true,
          previewPath: `/uploads/exports/${outputFilename}`,
          message: 'Preview generated successfully'
        });
      })
      .on('error', (err) => {
        res.status(500).json({ error: 'Preview generation failed', details: err.message });
      })
      .run();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
