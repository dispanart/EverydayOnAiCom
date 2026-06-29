# EverydayOnAI Real Views Counter

Upload `eonai-view-counter.php` ke folder WordPress:

`wp-content/plugins/eonai-view-counter/eonai-view-counter.php`

Lalu edit bagian ini di file plugin:

`define('EONAI_VIEW_KEY', 'GANTI_DENGAN_SECRET_RANDOM_PANJANG');`

Isi dengan secret yang sama seperti environment variable `EONAI_VIEW_KEY` di Vercel.

Endpoint yang akan tersedia:

- `GET /wp-json/eonai/v1/views/{postId}`
- `POST /wp-json/eonai/v1/views/{postId}` dengan header `x-eonai-view-key`

Jumlah views disimpan di post meta WordPress: `eonai_views`.
