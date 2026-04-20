# Dynamic Content Debug Guide

## Current Status
- ✅ Strapi API permissions are ENABLED
- ✅ API endpoints return 200 status codes  
- ❌ Pages still show static HTML instead of dynamic content

## Quick Debug Steps

1. Open education.html, featured.html, or browse.html in browser
2. Open DevTools Console (F12)
3. Run: APITest.runFullTest()
4. Check for debug messages starting with 🔍
5. Look at Network tab for API calls

## Manual API Testing
fetch('https://womencypedia-cms.onrender.com/api/biographies?filters[featured][$eq]=true&pagination[pageSize]=3')
  .then(r => r.json())
  .then(d => console.log('Response:', d))

