# Twitter Card Validation Guide

## Quick Steps

### 1. Twitter Card Validator (Best Option)
1. Visit: https://cards-dev.twitter.com/validator
2. Enter: `https://cureonchain.org`
3. Click "Preview card"
4. Review the preview and check for any errors

**Note:** You may need to sign in with a Twitter/X account. If the validator is unavailable, use Method 2 or 3 below.

### 2. Force Refresh with Query Parameter

Add a query parameter to your URL when sharing:

```
https://cureonchain.org/?v=1
```

Or use a timestamp:

```
https://cureonchain.org/?refresh=20241230
```

When you share this URL on Twitter/X, it will be treated as a new URL and fetch fresh metadata.

### 3. Facebook Sharing Debugger (Also Refreshes Twitter Cache)

1. Visit: https://developers.facebook.com/tools/debug/
2. Enter your URL: `https://cureonchain.org`
3. Click "Debug"
4. After it fetches, click "Scrape Again" to force refresh
5. This often refreshes Twitter's cache as well

### 4. Verify Metadata in Page Source

Check that the page source contains the correct metadata:

1. Visit `https://cureonchain.org` in a browser
2. View page source (Right-click → View Page Source)
3. Look for these meta tags:

```html
<meta property="og:image" content="https://cureonchain.org/og.png" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content="https://cureonchain.org/og.png" />
```

### 5. Direct Image Check

Verify the image is accessible:

```
https://cureonchain.org/og.png
```

This should load the image directly in your browser.

## Troubleshooting

### If Preview Doesn't Update

1. **Wait 24-48 hours** - Twitter caches aggressively and may take time to refresh
2. **Use a query parameter** - Share a URL like `https://cureonchain.org/?v=2` to force a new fetch
3. **Check image requirements:**
   - Image must be at least 1200x630px (ours is configured for this)
   - Image must be under 5MB
   - Image must be publicly accessible (not behind authentication)
   - Image must be served over HTTPS

### Common Issues

- **"Image failed to load"** - Check that `/og.png` is accessible at `https://cureonchain.org/og.png`
- **"Card not found"** - Ensure metadataBase is set correctly and og:image uses absolute URL
- **Old preview showing** - Use query parameter method or wait for cache to expire

## After Deployment

1. Deploy to production
2. Verify `https://cureonchain.org/og.png` loads directly
3. Check page source for correct meta tags
4. Use Twitter Card Validator or share URL with query parameter
5. Test the preview

