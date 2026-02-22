## Packages
react-dropzone | For drag-and-drop resume file uploads
framer-motion | For smooth panel transitions and analytics animations
lucide-react | For beautiful system icons
clsx | For conditional class name joining
tailwind-merge | For merging tailwind classes safely
@radix-ui/react-popover | For inline issue suggestion popovers
@radix-ui/react-tabs | For right panel navigation tabs
@radix-ui/react-progress | For linear progress bars
recharts | For complex analytics charts (optional, using custom SVGs for rings)

## Notes
- Backend MUST implement `POST /api/parse` that accepts `multipart/form-data` with a 'resume' file field and returns `{ text: string }`. Packages needed on backend: `multer`, `pdf-parse`, `mammoth`.
- Backend MUST implement `POST /api/analyze` according to the provided schema.
- The app uses native `window.print()` with specific CSS targeting the `#printable-resume` ID for PDF export to ensure ATS compliance (selectable text, no images).
