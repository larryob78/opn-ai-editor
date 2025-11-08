# Opn AI Editor

**Opn AI Editor** is a lightweight demonstration of a film‑editing user interface inspired by the LuminaCut AI tool. The project uses plain HTML and CSS to showcase a three‑column layout where you can:

* Create a new project by entering a name and uploading a video file
* View a list of existing projects (placeholder)
* Preview the current video and export it to MP4 or MOV (placeholder buttons)
* Enter natural‑language editing instructions and optionally generate a preview after applying your instruction

This repository contains only the front‑end interface. It does not perform actual video editing—those functions would normally require a back‑end service to process uploaded files and apply AI‑driven edits.

## Quick start

To view the interface locally:

1. Clone the repository:

   ```bash
   git clone https://github.com/larryob78/opn-ai-editor.git
   cd opn-ai-editor
   ```

2. Open `index.html` in your web browser. On most systems you can double‑click the file or run:

   ```bash
   xdg-open index.html
   ```

You should see the dark‑themed layout similar to the provided screenshot. Since this is a static prototype, the upload, export and apply buttons do not perform any actions.

## Deploying to Vercel

This project is ready to deploy on [Vercel](https://vercel.com) as a static site. Once imported into a Vercel project, Vercel will automatically serve `index.html` from the root of the repository. If you make changes to this file and push them to GitHub, Vercel will redeploy the site automatically.

## Next steps

The purpose of this prototype is to provide a foundation for a film‑editing interface. To build a fully functional editor you could:

* Integrate a back‑end service to process videos and generate preview edits based on the instruction text.
* Populate the Projects panel with saved projects and allow selection.
* Implement proper file uploads and video player controls.
* Add styling improvements or responsive design tweaks.
