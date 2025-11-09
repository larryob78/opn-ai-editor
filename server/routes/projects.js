import express from 'express';
import { getDatabase } from '../database/db.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Get all projects
router.get('/', (req, res) => {
  try {
    const db = getDatabase();
    const projects = db.prepare('SELECT * FROM projects ORDER BY updated_at DESC').all();

    const projectsWithEdits = projects.map(project => {
      const edits = db.prepare('SELECT * FROM edits WHERE project_id = ? ORDER BY created_at DESC')
        .all(project.id);

      return {
        ...project,
        metadata: project.metadata ? JSON.parse(project.metadata) : null,
        editsCount: edits.length,
        recentEdits: edits.slice(0, 3)
      };
    });

    res.json({
      success: true,
      projects: projectsWithEdits
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single project
router.get('/:id', (req, res) => {
  try {
    const db = getDatabase();
    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const edits = db.prepare('SELECT * FROM edits WHERE project_id = ? ORDER BY created_at DESC')
      .all(project.id);

    const exports = db.prepare('SELECT * FROM exports WHERE project_id = ? ORDER BY created_at DESC')
      .all(project.id);

    res.json({
      success: true,
      project: {
        ...project,
        metadata: project.metadata ? JSON.parse(project.metadata) : null,
        edits,
        exports
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new project
router.post('/', (req, res) => {
  try {
    const { name, videoPath, thumbnailPath, duration, metadata } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    const db = getDatabase();
    const id = uuidv4();
    const now = Date.now();

    const stmt = db.prepare(`
      INSERT INTO projects (id, name, created_at, updated_at, video_path, thumbnail_path, duration, metadata)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      name,
      now,
      now,
      videoPath || null,
      thumbnailPath || null,
      duration || null,
      metadata ? JSON.stringify(metadata) : null
    );

    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);

    res.json({
      success: true,
      project: {
        ...project,
        metadata: project.metadata ? JSON.parse(project.metadata) : null
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update project
router.put('/:id', (req, res) => {
  try {
    const { name, videoPath, thumbnailPath, duration, metadata } = req.body;
    const db = getDatabase();

    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const updates = [];
    const values = [];

    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }
    if (videoPath !== undefined) {
      updates.push('video_path = ?');
      values.push(videoPath);
    }
    if (thumbnailPath !== undefined) {
      updates.push('thumbnail_path = ?');
      values.push(thumbnailPath);
    }
    if (duration !== undefined) {
      updates.push('duration = ?');
      values.push(duration);
    }
    if (metadata !== undefined) {
      updates.push('metadata = ?');
      values.push(JSON.stringify(metadata));
    }

    updates.push('updated_at = ?');
    values.push(Date.now());
    values.push(req.params.id);

    const stmt = db.prepare(`UPDATE projects SET ${updates.join(', ')} WHERE id = ?`);
    stmt.run(...values);

    const updatedProject = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);

    res.json({
      success: true,
      project: {
        ...updatedProject,
        metadata: updatedProject.metadata ? JSON.parse(updatedProject.metadata) : null
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete project
router.delete('/:id', (req, res) => {
  try {
    const db = getDatabase();

    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Delete associated edits and exports (cascade will handle this with foreign keys)
    db.prepare('DELETE FROM projects WHERE id = ?').run(req.params.id);

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add edit to project
router.post('/:id/edits', (req, res) => {
  try {
    const { instruction, aiResponse, editData } = req.body;
    const db = getDatabase();

    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const editId = uuidv4();
    const now = Date.now();

    const stmt = db.prepare(`
      INSERT INTO edits (id, project_id, instruction, ai_response, edit_data, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      editId,
      req.params.id,
      instruction,
      aiResponse ? JSON.stringify(aiResponse) : null,
      editData ? JSON.stringify(editData) : null,
      now
    );

    // Update project's updated_at
    db.prepare('UPDATE projects SET updated_at = ? WHERE id = ?').run(now, req.params.id);

    const edit = db.prepare('SELECT * FROM edits WHERE id = ?').get(editId);

    res.json({
      success: true,
      edit: {
        ...edit,
        ai_response: edit.ai_response ? JSON.parse(edit.ai_response) : null,
        edit_data: edit.edit_data ? JSON.parse(edit.edit_data) : null
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get project edits
router.get('/:id/edits', (req, res) => {
  try {
    const db = getDatabase();
    const edits = db.prepare('SELECT * FROM edits WHERE project_id = ? ORDER BY created_at DESC')
      .all(req.params.id);

    const parsedEdits = edits.map(edit => ({
      ...edit,
      ai_response: edit.ai_response ? JSON.parse(edit.ai_response) : null,
      edit_data: edit.edit_data ? JSON.parse(edit.edit_data) : null
    }));

    res.json({
      success: true,
      edits: parsedEdits
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
