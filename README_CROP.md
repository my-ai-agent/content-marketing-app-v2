# Next.js Mobile Crop Tool Architecture Template

## Features

- **Dedicated crop page:** `/photo/crop`
- **Percentage-based crop coordinates:** All crop box values (`x, y, width, height`) are stored as 0..1
- **Container isolation:** Crop overlay and handles are always positioned absolutely inside a fixed crop container
- **Mobile-first touch support:** Handles both mouse and touch events, normalizes to container
- **React/Next.js timing:** Uses `useLayoutEffect` and image `onLoad` to avoid SSR/hydration/layout issues
- **Canvas output:** Crop is applied using natural image size for pixel-accurate results
- **Page structure:** `/photo` (upload) → `/photo/crop` (crop) → `/photo/result` (preview)

## Usage Pattern

1. **User uploads photo** at `/photo`
2. **Image is stored** (in this template, in localStorage for simplicity)
3. **User is navigated** to `/photo/crop`
4. **CropTool** displays image, lets user move crop box (all as percent-of-image)
5. **On Apply**, crop is rendered to canvas using natural image dimensions, data URL is stored
6. **Result page** shows cropped result `/photo/result`

## Best Practices Demonstrated

- **No original photo visible behind crop tool**
- **No coordinate system drift between display and output**
- **All coordinate math is relative to the crop container**
- **React/Next.js SSR/CSR safe**
- **Mobile gestures are handled natively**
- **Easily extensible for resizing handles, aspect ratio locks, etc**

## Extension Points

- Store image/crop state in global state (e.g. Zustand, Redux, Context) for multi-step flows
- Add crop box resizing handles (logic is similar; update `width, height` as percent)
- Replace localStorage with backend or cloud storage for production
