# Clean Up Existing Duplicates

If you already have duplicate insights in your database, follow these steps:

## Option 1: Use the API Cleanup Endpoint

Visit this URL in your browser (replace with your actual deployment URL):

```
https://your-app.vercel.app/api/insights/cleanup
```

POST request with your username:
```bash
curl -X POST https://your-app.vercel.app/api/insights/cleanup \
  -H "Content-Type: application/json" \
  -d '{"username": "your_username"}'
```

## Option 2: Direct Database Query

If you have PostgreSQL access, run this SQL:

```sql
-- Remove duplicates, keep only the newest of each title+type
DELETE FROM insights 
WHERE id IN (
  SELECT id 
  FROM (
    SELECT id, 
           ROW_NUMBER() OVER (PARTITION BY title, type, user_id ORDER BY timestamp DESC) AS rn
    FROM insights
  ) t
  WHERE t.rn > 1
);
```

## Option 3: Fresh Start (Onboard Again)

1. Logout from AURA
2. Login again
3. The app will fetch deduplicated data automatically
4. If duplicates persist, logout and clear browser cache, then login

## Prevention

The fix is now deployed - all future insights will be deduplicated automatically at 3 levels:
- ✅ Before saving (frontend)
- ✅ After loading (frontend)
- ✅ During bulk insert (backend)
