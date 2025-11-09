import express from 'express';
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();
const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';
const TEMP_DIR = path.join(UPLOAD_DIR, 'temp');

// Ensure temp directory exists
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

// Get video metadata
router.post('/metadata', (req, res) => {
  try {
    const { videoPath } = req.body;
    const fullPath = path.join(process.cwd(), videoPath);

    ffmpeg.ffprobe(fullPath, (err, metadata) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to read video metadata', details: err.message });
      }

      const videoStream = metadata.streams.find(s => s.codec_type === 'video');
      const audioStream = metadata.streams.find(s => s.codec_type === 'audio');

      res.json({
        success: true,
        metadata: {
          duration: metadata.format.duration,
          size: metadata.format.size,
          bitRate: metadata.format.bit_rate,
          format: metadata.format.format_name,
          video: videoStream ? {
            codec: videoStream.codec_name,
            width: videoStream.width,
            height: videoStream.height,
            fps: eval(videoStream.r_frame_rate),
            bitRate: videoStream.bit_rate
          } : null,
          audio: audioStream ? {
            codec: audioStream.codec_name,
            sampleRate: audioStream.sample_rate,
            channels: audioStream.channels,
            bitRate: audioStream.bit_rate
          } : null
        }
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Trim video (remove from start/end)
router.post('/trim', async (req, res) => {
  try {
    const { videoPath, startTime = 0, endTime } = req.body;
    const inputPath = path.join(process.cwd(), videoPath);
    const outputFilename = `trimmed_${uuidv4()}.mp4`;
    const outputPath = path.join(TEMP_DIR, outputFilename);

    const command = ffmpeg(inputPath)
      .setStartTime(startTime);

    if (endTime) {
      command.setDuration(endTime - startTime);
    }

    command
      .output(outputPath)
      .videoCodec('libx264')
      .audioCodec('aac')
      .on('end', () => {
        res.json({
          success: true,
          outputPath: `/uploads/temp/${outputFilename}`,
          message: 'Video trimmed successfully'
        });
      })
      .on('error', (err) => {
        res.status(500).json({ error: 'Trimming failed', details: err.message });
      })
      .run();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cut section from video (remove middle part)
router.post('/cut', async (req, res) => {
  try {
    const { videoPath, cutStart, cutEnd } = req.body;
    const inputPath = path.join(process.cwd(), videoPath);
    const outputFilename = `cut_${uuidv4()}.mp4`;
    const outputPath = path.join(TEMP_DIR, outputFilename);

    // Create two segments and merge them
    const segment1 = path.join(TEMP_DIR, `seg1_${uuidv4()}.mp4`);
    const segment2 = path.join(TEMP_DIR, `seg2_${uuidv4()}.mp4`);

    // First segment (0 to cutStart)
    await new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .setStartTime(0)
        .setDuration(cutStart)
        .output(segment1)
        .videoCodec('libx264')
        .audioCodec('aac')
        .on('end', resolve)
        .on('error', reject)
        .run();
    });

    // Second segment (cutEnd to end)
    await new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .setStartTime(cutEnd)
        .output(segment2)
        .videoCodec('libx264')
        .audioCodec('aac')
        .on('end', resolve)
        .on('error', reject)
        .run();
    });

    // Merge segments
    ffmpeg()
      .input(segment1)
      .input(segment2)
      .on('end', () => {
        // Clean up temp segments
        fs.unlinkSync(segment1);
        fs.unlinkSync(segment2);

        res.json({
          success: true,
          outputPath: `/uploads/temp/${outputFilename}`,
          message: 'Section cut successfully'
        });
      })
      .on('error', (err) => {
        res.status(500).json({ error: 'Cutting failed', details: err.message });
      })
      .mergeToFile(outputPath);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Merge multiple videos
router.post('/merge', async (req, res) => {
  try {
    const { videoPaths } = req.body;

    if (!Array.isArray(videoPaths) || videoPaths.length < 2) {
      return res.status(400).json({ error: 'At least 2 videos required for merging' });
    }

    const outputFilename = `merged_${uuidv4()}.mp4`;
    const outputPath = path.join(TEMP_DIR, outputFilename);

    const command = ffmpeg();

    videoPaths.forEach(videoPath => {
      const fullPath = path.join(process.cwd(), videoPath);
      command.input(fullPath);
    });

    command
      .on('end', () => {
        res.json({
          success: true,
          outputPath: `/uploads/temp/${outputFilename}`,
          message: `${videoPaths.length} videos merged successfully`
        });
      })
      .on('error', (err) => {
        res.status(500).json({ error: 'Merging failed', details: err.message });
      })
      .mergeToFile(outputPath);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Change video speed
router.post('/speed', async (req, res) => {
  try {
    const { videoPath, speed = 1.0 } = req.body;
    const inputPath = path.join(process.cwd(), videoPath);
    const outputFilename = `speed_${uuidv4()}.mp4`;
    const outputPath = path.join(TEMP_DIR, outputFilename);

    const videoFilter = `setpts=${1/speed}*PTS`;
    const audioFilter = `atempo=${speed}`;

    ffmpeg(inputPath)
      .videoFilters(videoFilter)
      .audioFilters(audioFilter)
      .output(outputPath)
      .videoCodec('libx264')
      .audioCodec('aac')
      .on('end', () => {
        res.json({
          success: true,
          outputPath: `/uploads/temp/${outputFilename}`,
          message: `Video speed changed to ${speed}x`
        });
      })
      .on('error', (err) => {
        res.status(500).json({ error: 'Speed change failed', details: err.message });
      })
      .run();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Apply visual filters
router.post('/filter', async (req, res) => {
  try {
    const { videoPath, filterType, intensity = 1.0 } = req.body;
    const inputPath = path.join(process.cwd(), videoPath);
    const outputFilename = `filtered_${uuidv4()}.mp4`;
    const outputPath = path.join(TEMP_DIR, outputFilename);

    let filterString = '';

    switch (filterType) {
      case 'grayscale':
        filterString = 'hue=s=0';
        break;
      case 'sepia':
        filterString = 'colorchannelmixer=.393:.769:.189:0:.349:.686:.168:0:.272:.534:.131';
        break;
      case 'brightness':
        filterString = `eq=brightness=${intensity}`;
        break;
      case 'contrast':
        filterString = `eq=contrast=${intensity}`;
        break;
      case 'saturation':
        filterString = `eq=saturation=${intensity}`;
        break;
      case 'blur':
        filterString = `boxblur=${intensity}`;
        break;
      case 'sharpen':
        filterString = `unsharp=5:5:${intensity}:5:5:0.0`;
        break;
      case 'vignette':
        filterString = `vignette=PI/4`;
        break;
      default:
        return res.status(400).json({ error: 'Unknown filter type' });
    }

    ffmpeg(inputPath)
      .videoFilters(filterString)
      .output(outputPath)
      .videoCodec('libx264')
      .audioCodec('copy')
      .on('end', () => {
        res.json({
          success: true,
          outputPath: `/uploads/temp/${outputFilename}`,
          message: `${filterType} filter applied successfully`
        });
      })
      .on('error', (err) => {
        res.status(500).json({ error: 'Filter application failed', details: err.message });
      })
      .run();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Audio operations
router.post('/audio', async (req, res) => {
  try {
    const { videoPath, operation, value = 1.0 } = req.body;
    const inputPath = path.join(process.cwd(), videoPath);
    const outputFilename = `audio_${uuidv4()}.mp4`;
    const outputPath = path.join(TEMP_DIR, outputFilename);

    const command = ffmpeg(inputPath);

    switch (operation) {
      case 'mute':
        command.noAudio();
        break;
      case 'volume':
        command.audioFilters(`volume=${value}`);
        break;
      case 'fadeIn':
        command.audioFilters(`afade=t=in:st=0:d=${value}`);
        break;
      case 'fadeOut':
        // Need to get duration first
        return res.status(400).json({ error: 'FadeOut requires video duration' });
      case 'normalize':
        command.audioFilters('loudnorm');
        break;
      default:
        return res.status(400).json({ error: 'Unknown audio operation' });
    }

    command
      .output(outputPath)
      .videoCodec('copy')
      .audioCodec('aac')
      .on('end', () => {
        res.json({
          success: true,
          outputPath: `/uploads/temp/${outputFilename}`,
          message: `Audio ${operation} applied successfully`
        });
      })
      .on('error', (err) => {
        res.status(500).json({ error: 'Audio operation failed', details: err.message });
      })
      .run();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add text overlay
router.post('/text', async (req, res) => {
  try {
    const { videoPath, text, position = 'center', fontSize = 24, color = 'white', startTime = 0, duration } = req.body;
    const inputPath = path.join(process.cwd(), videoPath);
    const outputFilename = `text_${uuidv4()}.mp4`;
    const outputPath = path.join(TEMP_DIR, outputFilename);

    let x = '(w-text_w)/2'; // center
    let y = '(h-text_h)/2'; // center

    if (position === 'top') {
      y = '50';
    } else if (position === 'bottom') {
      y = 'h-text_h-50';
    } else if (position === 'top-left') {
      x = '50';
      y = '50';
    } else if (position === 'top-right') {
      x = 'w-text_w-50';
      y = '50';
    } else if (position === 'bottom-left') {
      x = '50';
      y = 'h-text_h-50';
    } else if (position === 'bottom-right') {
      x = 'w-text_w-50';
      y = 'h-text_h-50';
    }

    let filterString = `drawtext=text='${text}':fontsize=${fontSize}:fontcolor=${color}:x=${x}:y=${y}`;

    if (duration) {
      filterString += `:enable='between(t,${startTime},${startTime + duration})'`;
    }

    ffmpeg(inputPath)
      .videoFilters(filterString)
      .output(outputPath)
      .videoCodec('libx264')
      .audioCodec('copy')
      .on('end', () => {
        res.json({
          success: true,
          outputPath: `/uploads/temp/${outputFilename}`,
          message: 'Text overlay added successfully'
        });
      })
      .on('error', (err) => {
        res.status(500).json({ error: 'Text overlay failed', details: err.message });
      })
      .run();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crop video
router.post('/crop', async (req, res) => {
  try {
    const { videoPath, width, height, x = 0, y = 0 } = req.body;
    const inputPath = path.join(process.cwd(), videoPath);
    const outputFilename = `cropped_${uuidv4()}.mp4`;
    const outputPath = path.join(TEMP_DIR, outputFilename);

    ffmpeg(inputPath)
      .videoFilters(`crop=${width}:${height}:${x}:${y}`)
      .output(outputPath)
      .videoCodec('libx264')
      .audioCodec('copy')
      .on('end', () => {
        res.json({
          success: true,
          outputPath: `/uploads/temp/${outputFilename}`,
          message: 'Video cropped successfully'
        });
      })
      .on('error', (err) => {
        res.status(500).json({ error: 'Cropping failed', details: err.message });
      })
      .run();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Resize video
router.post('/resize', async (req, res) => {
  try {
    const { videoPath, width, height, maintainAspect = true } = req.body;
    const inputPath = path.join(process.cwd(), videoPath);
    const outputFilename = `resized_${uuidv4()}.mp4`;
    const outputPath = path.join(TEMP_DIR, outputFilename);

    let size = `${width}:${height}`;
    if (maintainAspect) {
      size = width ? `${width}:-1` : `-1:${height}`;
    }

    ffmpeg(inputPath)
      .size(size)
      .output(outputPath)
      .videoCodec('libx264')
      .audioCodec('copy')
      .on('end', () => {
        res.json({
          success: true,
          outputPath: `/uploads/temp/${outputFilename}`,
          message: 'Video resized successfully'
        });
      })
      .on('error', (err) => {
        res.status(500).json({ error: 'Resizing failed', details: err.message });
      })
      .run();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate thumbnail
router.post('/thumbnail', async (req, res) => {
  try {
    const { videoPath, timestamp = '00:00:01' } = req.body;
    const inputPath = path.join(process.cwd(), videoPath);
    const outputFilename = `thumb_${uuidv4()}.jpg`;
    const outputPath = path.join(TEMP_DIR, outputFilename);

    ffmpeg(inputPath)
      .screenshots({
        timestamps: [timestamp],
        filename: outputFilename,
        folder: TEMP_DIR,
        size: '320x240'
      })
      .on('end', () => {
        res.json({
          success: true,
          thumbnailPath: `/uploads/temp/${outputFilename}`,
          message: 'Thumbnail generated successfully'
        });
      })
      .on('error', (err) => {
        res.status(500).json({ error: 'Thumbnail generation failed', details: err.message });
      });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
