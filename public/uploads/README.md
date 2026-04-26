# Repo Image Directory

Drop image files (`.jpg`, `.png`, `.webp`, `.svg`) into this folder and commit them to GitHub.

## How to add an image

1. Add your image file here, e.g. `public/uploads/my-photo.jpg`
2. Edit `manifest.json` and add an entry:

```json
{
  "name": "My Photo",
  "file": "my-photo.jpg",
  "alt": "Description for accessibility / SEO",
  "category": "general"
}
```

3. Commit and push. The image will appear in the Admin → Image Picker under the **Repo Images** tab.

## Categories
`profile`, `hero`, `research`, `blog`, `general`

## Why a manifest?
The browser can't list files in a folder. The manifest tells the admin UI which files exist.
