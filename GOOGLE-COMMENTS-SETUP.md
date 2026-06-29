# Google Login Comments Setup

This project includes the EONAI Engagement integration for headless WordPress.

## WordPress

1. Upload and activate `eonai-engagement-plugin-v1.1.0.zip` in WordPress.
2. Add this to `wp-config.php`:

```php
define('EONAI_ENGAGEMENT_KEY', 'replace-with-a-long-random-secret');
```

3. In WordPress admin:

```text
Settings -> Discussion -> Comment must be manually approved
```

Comments submitted from the website are also forced to pending review by the plugin.

## Vercel Environment Variables

```env
WORDPRESS_REST_URL=https://wp.everydayonai.com
EONAI_ENGAGEMENT_KEY=replace-with-the-same-secret-from-wp-config
AUTH_SECRET=replace-with-random-auth-secret
AUTH_URL=https://everydayonai.com
AUTH_GOOGLE_ID=replace-with-google-client-id
AUTH_GOOGLE_SECRET=replace-with-google-client-secret
```

## Google Cloud OAuth

Create a Web OAuth client and add this redirect URI:

```text
https://everydayonai.com/api/auth/callback/google
```

Add this JavaScript origin:

```text
https://everydayonai.com
```

## Deploy Note

The website uses `next-auth` for Google login. Keep this dependency in `package.json`:

```json
"next-auth": "5.0.0-beta.22"
```

After pushing to GitHub, redeploy Vercel.
