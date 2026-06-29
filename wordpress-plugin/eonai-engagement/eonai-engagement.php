<?php
/**
 * Plugin Name: EONAI Engagement Tracker
 * Description: Headless engagement backend for EverydayOnAI: newsletter, views, post likes, comments, comment likes, and share tracking.
 * Version: 1.1.0
 * Author: EverydayOnAI
 * License: GPL-2.0-or-later
 */

if (!defined('ABSPATH')) {
    exit;
}

final class EONAI_Engagement_Tracker {
    const VERSION = '1.1.0';
    const META_VIEWS = 'eonai_views';
    const META_POST_LIKES = 'eonai_post_likes';
    const META_SHARES_TOTAL = 'eonai_shares_total';
    const META_COMMENT_LIKES = 'eonai_comment_likes';

    private static $instance = null;

    public static function instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }

        return self::$instance;
    }

    private function __construct() {
        add_action('rest_api_init', [$this, 'register_routes']);
        add_action('admin_menu', [$this, 'register_admin_menu']);
        add_action('admin_post_eonai_engagement_export', [$this, 'export_csv']);
        add_action('init', [$this, 'register_public_meta']);
    }

    public static function activate() {
        global $wpdb;

        require_once ABSPATH . 'wp-admin/includes/upgrade.php';

        $charset_collate = $wpdb->get_charset_collate();
        $subscribers = $wpdb->prefix . 'eonai_subscribers';
        $events = $wpdb->prefix . 'eonai_events';
        $votes = $wpdb->prefix . 'eonai_votes';

        $sql = [];

        $sql[] = "CREATE TABLE {$subscribers} (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            email varchar(190) NOT NULL,
            name varchar(190) DEFAULT '' NOT NULL,
            status varchar(30) DEFAULT 'subscribed' NOT NULL,
            consent tinyint(1) DEFAULT 0 NOT NULL,
            source varchar(100) DEFAULT '' NOT NULL,
            post_id bigint(20) unsigned DEFAULT 0 NOT NULL,
            ip_hash char(64) DEFAULT '' NOT NULL,
            user_agent_hash char(64) DEFAULT '' NOT NULL,
            meta longtext NULL,
            created_at datetime NOT NULL,
            updated_at datetime NOT NULL,
            PRIMARY KEY  (id),
            UNIQUE KEY email (email),
            KEY status (status),
            KEY post_id (post_id),
            KEY created_at (created_at)
        ) {$charset_collate};";

        $sql[] = "CREATE TABLE {$events} (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            event_type varchar(40) NOT NULL,
            post_id bigint(20) unsigned DEFAULT 0 NOT NULL,
            comment_id bigint(20) unsigned DEFAULT 0 NOT NULL,
            channel varchar(50) DEFAULT '' NOT NULL,
            url text NULL,
            visitor_hash char(64) DEFAULT '' NOT NULL,
            ip_hash char(64) DEFAULT '' NOT NULL,
            user_agent_hash char(64) DEFAULT '' NOT NULL,
            meta longtext NULL,
            created_at datetime NOT NULL,
            PRIMARY KEY  (id),
            KEY event_type (event_type),
            KEY post_id (post_id),
            KEY comment_id (comment_id),
            KEY channel (channel),
            KEY visitor_hash (visitor_hash),
            KEY created_at (created_at)
        ) {$charset_collate};";

        $sql[] = "CREATE TABLE {$votes} (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            vote_target varchar(30) NOT NULL,
            target_id bigint(20) unsigned NOT NULL,
            visitor_hash char(64) NOT NULL,
            value tinyint(1) DEFAULT 1 NOT NULL,
            created_at datetime NOT NULL,
            updated_at datetime NOT NULL,
            PRIMARY KEY  (id),
            UNIQUE KEY target_visitor (vote_target, target_id, visitor_hash),
            KEY vote_target (vote_target),
            KEY target_id (target_id)
        ) {$charset_collate};";

        foreach ($sql as $statement) {
            dbDelta($statement);
        }

        update_option('eonai_engagement_version', self::VERSION);
    }

    public function register_public_meta() {
        register_post_meta('post', self::META_VIEWS, [
            'type' => 'integer',
            'single' => true,
            'default' => 0,
            'show_in_rest' => true,
            'auth_callback' => '__return_true',
        ]);

        register_post_meta('post', self::META_POST_LIKES, [
            'type' => 'integer',
            'single' => true,
            'default' => 0,
            'show_in_rest' => true,
            'auth_callback' => '__return_true',
        ]);

        register_post_meta('post', self::META_SHARES_TOTAL, [
            'type' => 'integer',
            'single' => true,
            'default' => 0,
            'show_in_rest' => true,
            'auth_callback' => '__return_true',
        ]);
    }

    public function register_routes() {
        register_rest_route('eonai/v1', '/health', [
            'methods' => 'GET',
            'callback' => function () {
                return [
                    'ok' => true,
                    'plugin' => 'eonai-engagement-tracker',
                    'version' => self::VERSION,
                ];
            },
            'permission_callback' => '__return_true',
        ]);

        register_rest_route('eonai/v1', '/newsletter', [
            'methods' => 'POST',
            'callback' => [$this, 'handle_newsletter'],
            'permission_callback' => [$this, 'require_secret'],
        ]);

        register_rest_route('eonai/v1', '/view/(?P<post_id>\d+)', [
            'methods' => 'POST',
            'callback' => [$this, 'handle_view'],
            'permission_callback' => [$this, 'require_secret'],
        ]);

        register_rest_route('eonai/v1', '/share/(?P<post_id>\d+)', [
            'methods' => 'POST',
            'callback' => [$this, 'handle_share'],
            'permission_callback' => [$this, 'require_secret'],
        ]);

        register_rest_route('eonai/v1', '/post-like/(?P<post_id>\d+)', [
            'methods' => 'POST',
            'callback' => [$this, 'handle_post_like'],
            'permission_callback' => [$this, 'require_secret'],
        ]);

        register_rest_route('eonai/v1', '/comment-like/(?P<comment_id>\d+)', [
            'methods' => 'POST',
            'callback' => [$this, 'handle_comment_like'],
            'permission_callback' => [$this, 'require_secret'],
        ]);

        register_rest_route('eonai/v1', '/comment/(?P<post_id>\d+)', [
            'methods' => 'POST',
            'callback' => [$this, 'handle_comment_create'],
            'permission_callback' => [$this, 'require_secret'],
        ]);

        register_rest_route('eonai/v1', '/comments/(?P<post_id>\d+)', [
            'methods' => 'GET',
            'callback' => [$this, 'handle_comments_list'],
            'permission_callback' => '__return_true',
        ]);

        register_rest_route('eonai/v1', '/post-engagement/(?P<post_id>\d+)', [
            'methods' => 'GET',
            'callback' => [$this, 'handle_post_engagement'],
            'permission_callback' => '__return_true',
        ]);
    }

    public function require_secret(WP_REST_Request $request) {
        $configured = defined('EONAI_ENGAGEMENT_KEY') ? (string) EONAI_ENGAGEMENT_KEY : '';
        $provided = (string) $request->get_header('x-eonai-engagement-key');

        if (strlen($configured) < 16) {
            return new WP_Error(
                'eonai_secret_missing',
                'EONAI_ENGAGEMENT_KEY is not configured in wp-config.php.',
                ['status' => 500]
            );
        }

        if (!$provided || !hash_equals($configured, $provided)) {
            return new WP_Error('eonai_forbidden', 'Invalid engagement key.', ['status' => 403]);
        }

        return true;
    }

    public function handle_newsletter(WP_REST_Request $request) {
        global $wpdb;

        $email = sanitize_email((string) $request->get_param('email'));
        if (!$email || !is_email($email)) {
            return new WP_Error('eonai_invalid_email', 'A valid email is required.', ['status' => 400]);
        }

        $name = sanitize_text_field((string) $request->get_param('name'));
        $source = sanitize_key((string) $request->get_param('source'));
        $post_id = absint($request->get_param('post_id'));
        $consent = $request->get_param('consent') ? 1 : 0;
        $now = current_time('mysql', true);
        $table = $wpdb->prefix . 'eonai_subscribers';
        $identity = $this->identity($request);
        $meta = $this->json_meta([
            'referer' => $this->server_value('HTTP_REFERER'),
            'language' => $this->server_value('HTTP_ACCEPT_LANGUAGE'),
        ]);

        $existing_id = (int) $wpdb->get_var($wpdb->prepare(
            "SELECT id FROM {$table} WHERE email = %s",
            $email
        ));

        if ($existing_id) {
            $wpdb->update(
                $table,
                [
                    'name' => $name,
                    'status' => 'subscribed',
                    'consent' => $consent,
                    'source' => $source,
                    'post_id' => $post_id,
                    'ip_hash' => $identity['ip_hash'],
                    'user_agent_hash' => $identity['user_agent_hash'],
                    'meta' => $meta,
                    'updated_at' => $now,
                ],
                ['id' => $existing_id],
                ['%s', '%s', '%d', '%s', '%d', '%s', '%s', '%s', '%s'],
                ['%d']
            );

            return [
                'ok' => true,
                'subscriber_id' => $existing_id,
                'status' => 'updated',
            ];
        }

        $wpdb->insert(
            $table,
            [
                'email' => $email,
                'name' => $name,
                'status' => 'subscribed',
                'consent' => $consent,
                'source' => $source,
                'post_id' => $post_id,
                'ip_hash' => $identity['ip_hash'],
                'user_agent_hash' => $identity['user_agent_hash'],
                'meta' => $meta,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            ['%s', '%s', '%s', '%d', '%s', '%d', '%s', '%s', '%s', '%s', '%s']
        );

        return [
            'ok' => true,
            'subscriber_id' => (int) $wpdb->insert_id,
            'status' => 'created',
        ];
    }

    public function handle_view(WP_REST_Request $request) {
        $post_id = absint($request['post_id']);
        $post = get_post($post_id);

        if (!$post || 'publish' !== $post->post_status) {
            return new WP_Error('eonai_post_not_found', 'Post not found.', ['status' => 404]);
        }

        $counted = $this->record_event_once($request, 'view', $post_id, 0, '', '', 6 * HOUR_IN_SECONDS);

        if ($counted) {
            $views = (int) get_post_meta($post_id, self::META_VIEWS, true);
            update_post_meta($post_id, self::META_VIEWS, $views + 1);
        }

        return [
            'ok' => true,
            'counted' => $counted,
            'views' => (int) get_post_meta($post_id, self::META_VIEWS, true),
        ];
    }

    public function handle_share(WP_REST_Request $request) {
        $post_id = absint($request['post_id']);
        $post = get_post($post_id);

        if (!$post || 'publish' !== $post->post_status) {
            return new WP_Error('eonai_post_not_found', 'Post not found.', ['status' => 404]);
        }

        $channel = sanitize_key((string) $request->get_param('channel'));
        if (!$channel) {
            $channel = 'unknown';
        }

        $url = esc_url_raw((string) $request->get_param('url'));
        $counted = $this->record_event_once($request, 'share', $post_id, 0, $channel, $url, 30);

        if ($counted) {
            $total = (int) get_post_meta($post_id, self::META_SHARES_TOTAL, true);
            update_post_meta($post_id, self::META_SHARES_TOTAL, $total + 1);

            $channel_key = 'eonai_shares_' . $channel;
            $channel_count = (int) get_post_meta($post_id, $channel_key, true);
            update_post_meta($post_id, $channel_key, $channel_count + 1);
        }

        return [
            'ok' => true,
            'counted' => $counted,
            'shares' => (int) get_post_meta($post_id, self::META_SHARES_TOTAL, true),
            'channel' => $channel,
        ];
    }

    public function handle_post_like(WP_REST_Request $request) {
        $post_id = absint($request['post_id']);
        $post = get_post($post_id);

        if (!$post || 'publish' !== $post->post_status) {
            return new WP_Error('eonai_post_not_found', 'Post not found.', ['status' => 404]);
        }

        $result = $this->toggle_vote($request, 'post', $post_id);
        update_post_meta($post_id, self::META_POST_LIKES, $result['count']);

        return [
            'ok' => true,
            'liked' => $result['liked'],
            'likes' => $result['count'],
        ];
    }

    public function handle_comment_like(WP_REST_Request $request) {
        $comment_id = absint($request['comment_id']);
        $comment = get_comment($comment_id);

        if (!$comment || '1' !== (string) $comment->comment_approved) {
            return new WP_Error('eonai_comment_not_found', 'Comment not found.', ['status' => 404]);
        }

        $result = $this->toggle_vote($request, 'comment', $comment_id);
        update_comment_meta($comment_id, self::META_COMMENT_LIKES, $result['count']);

        return [
            'ok' => true,
            'liked' => $result['liked'],
            'likes' => $result['count'],
        ];
    }

    public function handle_comment_create(WP_REST_Request $request) {
        $post_id = absint($request['post_id']);
        $post = get_post($post_id);

        if (!$post || 'publish' !== $post->post_status) {
            return new WP_Error('eonai_post_not_found', 'Post not found.', ['status' => 404]);
        }

        if (!comments_open($post_id)) {
            return new WP_Error('eonai_comments_closed', 'Comments are closed for this post.', ['status' => 403]);
        }

        $content = trim(wp_kses_post((string) $request->get_param('content')));
        $google_name = sanitize_text_field((string) $request->get_param('google_name'));
        $google_email = sanitize_email((string) $request->get_param('google_email'));
        $google_picture = esc_url_raw((string) $request->get_param('google_picture'));
        $google_verified = $request->get_param('google_email_verified') ? 1 : 0;
        $author_name = $google_name;
        $author_email = $google_email;
        $parent_id = absint($request->get_param('parent_id'));

        if (!$google_verified || '' === $google_email || !is_email($google_email)) {
            return new WP_Error('eonai_google_login_required', 'Google login with a verified email is required.', ['status' => 401]);
        }

        if ('' === $content || '' === $author_name) {
            return new WP_Error('eonai_invalid_comment', 'Name and comment content are required.', ['status' => 400]);
        }

        $comment_data = [
            'comment_post_ID' => $post_id,
            'comment_author' => $author_name,
            'comment_author_email' => $author_email,
            'comment_author_url' => '',
            'comment_content' => $content,
            'comment_type' => 'comment',
            'comment_parent' => $parent_id,
            'comment_author_IP' => $this->server_value('REMOTE_ADDR'),
            'comment_agent' => $this->server_value('HTTP_USER_AGENT'),
            'comment_approved' => 0,
        ];

        $comment_id = wp_new_comment(wp_slash($comment_data), true);

        if (is_wp_error($comment_id)) {
            return $comment_id;
        }

        $comment = get_comment($comment_id);
        add_comment_meta($comment_id, 'eonai_auth_provider', 'google', true);
        add_comment_meta($comment_id, 'eonai_google_email_verified', $google_verified, true);
        add_comment_meta($comment_id, 'eonai_google_picture', $google_picture, true);

        return [
            'ok' => true,
            'comment_id' => (int) $comment_id,
            'approved' => '1' === (string) $comment->comment_approved,
            'message' => 'Comment submitted for moderation.',
        ];
    }

    public function handle_comments_list(WP_REST_Request $request) {
        $post_id = absint($request['post_id']);
        $post = get_post($post_id);

        if (!$post || 'publish' !== $post->post_status) {
            return new WP_Error('eonai_post_not_found', 'Post not found.', ['status' => 404]);
        }

        $comments = get_comments([
            'post_id' => $post_id,
            'status' => 'approve',
            'type' => 'comment',
            'order' => 'ASC',
            'number' => min(100, max(1, absint($request->get_param('per_page')) ?: 50)),
        ]);

        return [
            'ok' => true,
            'comments' => array_map([$this, 'format_comment'], $comments),
        ];
    }

    public function handle_post_engagement(WP_REST_Request $request) {
        $post_id = absint($request['post_id']);
        $post = get_post($post_id);

        if (!$post || 'publish' !== $post->post_status) {
            return new WP_Error('eonai_post_not_found', 'Post not found.', ['status' => 404]);
        }

        return [
            'ok' => true,
            'post_id' => $post_id,
            'views' => (int) get_post_meta($post_id, self::META_VIEWS, true),
            'post_likes' => (int) get_post_meta($post_id, self::META_POST_LIKES, true),
            'shares' => (int) get_post_meta($post_id, self::META_SHARES_TOTAL, true),
            'comments' => (int) get_comments_number($post_id),
            'shares_by_channel' => $this->get_share_channels($post_id),
        ];
    }

    private function format_comment(WP_Comment $comment) {
        return [
            'id' => (int) $comment->comment_ID,
            'post_id' => (int) $comment->comment_post_ID,
            'parent_id' => (int) $comment->comment_parent,
            'author_name' => get_comment_author($comment),
            'content' => wp_kses_post(get_comment_text($comment)),
            'date' => get_comment_date('c', $comment),
            'likes' => (int) get_comment_meta($comment->comment_ID, self::META_COMMENT_LIKES, true),
        ];
    }

    private function record_event_once(WP_REST_Request $request, $event_type, $post_id, $comment_id = 0, $channel = '', $url = '', $dedupe_seconds = 60) {
        global $wpdb;

        $table = $wpdb->prefix . 'eonai_events';
        $identity = $this->identity($request);
        $threshold = gmdate('Y-m-d H:i:s', time() - absint($dedupe_seconds));

        $recent_id = (int) $wpdb->get_var($wpdb->prepare(
            "SELECT id FROM {$table}
            WHERE event_type = %s
              AND post_id = %d
              AND comment_id = %d
              AND channel = %s
              AND visitor_hash = %s
              AND created_at >= %s
            LIMIT 1",
            $event_type,
            $post_id,
            $comment_id,
            $channel,
            $identity['visitor_hash'],
            $threshold
        ));

        if ($recent_id) {
            return false;
        }

        $wpdb->insert(
            $table,
            [
                'event_type' => sanitize_key($event_type),
                'post_id' => absint($post_id),
                'comment_id' => absint($comment_id),
                'channel' => sanitize_key($channel),
                'url' => esc_url_raw($url),
                'visitor_hash' => $identity['visitor_hash'],
                'ip_hash' => $identity['ip_hash'],
                'user_agent_hash' => $identity['user_agent_hash'],
                'meta' => $this->json_meta([
                    'referer' => $this->server_value('HTTP_REFERER'),
                    'language' => $this->server_value('HTTP_ACCEPT_LANGUAGE'),
                ]),
                'created_at' => current_time('mysql', true),
            ],
            ['%s', '%d', '%d', '%s', '%s', '%s', '%s', '%s', '%s', '%s']
        );

        return true;
    }

    private function toggle_vote(WP_REST_Request $request, $target, $target_id) {
        global $wpdb;

        $table = $wpdb->prefix . 'eonai_votes';
        $identity = $this->identity($request);
        $now = current_time('mysql', true);

        $existing_id = (int) $wpdb->get_var($wpdb->prepare(
            "SELECT id FROM {$table}
            WHERE vote_target = %s AND target_id = %d AND visitor_hash = %s
            LIMIT 1",
            $target,
            $target_id,
            $identity['visitor_hash']
        ));

        if ($existing_id) {
            $wpdb->delete($table, ['id' => $existing_id], ['%d']);
            $liked = false;
        } else {
            $wpdb->insert(
                $table,
                [
                    'vote_target' => sanitize_key($target),
                    'target_id' => absint($target_id),
                    'visitor_hash' => $identity['visitor_hash'],
                    'value' => 1,
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
                ['%s', '%d', '%s', '%d', '%s', '%s']
            );
            $liked = true;
        }

        $count = (int) $wpdb->get_var($wpdb->prepare(
            "SELECT COUNT(*) FROM {$table} WHERE vote_target = %s AND target_id = %d AND value = 1",
            $target,
            $target_id
        ));

        return [
            'liked' => $liked,
            'count' => $count,
        ];
    }

    private function get_share_channels($post_id) {
        global $wpdb;

        $table = $wpdb->prefix . 'eonai_events';
        $rows = $wpdb->get_results($wpdb->prepare(
            "SELECT channel, COUNT(*) AS total
            FROM {$table}
            WHERE event_type = 'share' AND post_id = %d
            GROUP BY channel
            ORDER BY total DESC",
            $post_id
        ), ARRAY_A);

        $channels = [];
        foreach ($rows as $row) {
            $channels[$row['channel'] ?: 'unknown'] = (int) $row['total'];
        }

        return $channels;
    }

    private function identity(WP_REST_Request $request) {
        $visitor_id = sanitize_text_field((string) $request->get_header('x-eonai-visitor-id'));
        $forwarded_ip = sanitize_text_field((string) $request->get_header('x-eonai-client-ip'));
        $ip = $forwarded_ip ? $forwarded_ip : $this->server_value('REMOTE_ADDR');
        $user_agent = $this->server_value('HTTP_USER_AGENT');

        if (!$visitor_id) {
            $visitor_id = $ip . '|' . $user_agent;
        }

        return [
            'visitor_hash' => $this->hash_value($visitor_id),
            'ip_hash' => $this->hash_value($ip),
            'user_agent_hash' => $this->hash_value($user_agent),
        ];
    }

    private function hash_value($value) {
        return hash_hmac('sha256', (string) $value, wp_salt('auth'));
    }

    private function json_meta($data) {
        return wp_json_encode($data, JSON_UNESCAPED_SLASHES);
    }

    private function server_value($key) {
        return isset($_SERVER[$key]) ? sanitize_text_field(wp_unslash($_SERVER[$key])) : '';
    }

    public function register_admin_menu() {
        add_menu_page(
            'EONAI Engagement',
            'EONAI Engagement',
            'manage_options',
            'eonai-engagement',
            [$this, 'render_admin_page'],
            'dashicons-chart-line',
            58
        );
    }

    public function render_admin_page() {
        if (!current_user_can('manage_options')) {
            return;
        }

        global $wpdb;

        $subscribers = $wpdb->prefix . 'eonai_subscribers';
        $events = $wpdb->prefix . 'eonai_events';
        $votes = $wpdb->prefix . 'eonai_votes';

        $subscriber_count = (int) $wpdb->get_var("SELECT COUNT(*) FROM {$subscribers}");
        $view_count = (int) $wpdb->get_var("SELECT COUNT(*) FROM {$events} WHERE event_type = 'view'");
        $share_count = (int) $wpdb->get_var("SELECT COUNT(*) FROM {$events} WHERE event_type = 'share'");
        $post_like_count = (int) $wpdb->get_var("SELECT COUNT(*) FROM {$votes} WHERE vote_target = 'post'");
        $comment_like_count = (int) $wpdb->get_var("SELECT COUNT(*) FROM {$votes} WHERE vote_target = 'comment'");

        $recent_subscribers = $wpdb->get_results(
            "SELECT email, name, source, created_at FROM {$subscribers} ORDER BY created_at DESC LIMIT 10",
            ARRAY_A
        );

        $top_shares = $wpdb->get_results(
            "SELECT post_id, COUNT(*) AS total FROM {$events}
            WHERE event_type = 'share'
            GROUP BY post_id
            ORDER BY total DESC
            LIMIT 10",
            ARRAY_A
        );

        $export_subscribers = wp_nonce_url(
            admin_url('admin-post.php?action=eonai_engagement_export&type=subscribers'),
            'eonai_engagement_export'
        );
        $export_events = wp_nonce_url(
            admin_url('admin-post.php?action=eonai_engagement_export&type=events'),
            'eonai_engagement_export'
        );
        $export_votes = wp_nonce_url(
            admin_url('admin-post.php?action=eonai_engagement_export&type=votes'),
            'eonai_engagement_export'
        );

        ?>
        <div class="wrap">
            <h1>EONAI Engagement</h1>

            <?php if (!defined('EONAI_ENGAGEMENT_KEY') || strlen((string) EONAI_ENGAGEMENT_KEY) < 16) : ?>
                <div class="notice notice-error">
                    <p><strong>Action required:</strong> Add <code>define('EONAI_ENGAGEMENT_KEY', 'your-long-secret');</code> to <code>wp-config.php</code>.</p>
                </div>
            <?php endif; ?>

            <h2>Overview</h2>
            <table class="widefat striped" style="max-width: 900px;">
                <tbody>
                    <tr><td>Subscribers</td><td><?php echo esc_html(number_format_i18n($subscriber_count)); ?></td></tr>
                    <tr><td>Tracked Views</td><td><?php echo esc_html(number_format_i18n($view_count)); ?></td></tr>
                    <tr><td>Share Clicks</td><td><?php echo esc_html(number_format_i18n($share_count)); ?></td></tr>
                    <tr><td>Post Likes</td><td><?php echo esc_html(number_format_i18n($post_like_count)); ?></td></tr>
                    <tr><td>Comment Likes</td><td><?php echo esc_html(number_format_i18n($comment_like_count)); ?></td></tr>
                </tbody>
            </table>

            <p>
                <a class="button" href="<?php echo esc_url($export_subscribers); ?>">Export Subscribers CSV</a>
                <a class="button" href="<?php echo esc_url($export_events); ?>">Export Events CSV</a>
                <a class="button" href="<?php echo esc_url($export_votes); ?>">Export Votes CSV</a>
            </p>

            <h2>Recent Subscribers</h2>
            <table class="widefat striped">
                <thead><tr><th>Email</th><th>Name</th><th>Source</th><th>Date</th></tr></thead>
                <tbody>
                    <?php foreach ($recent_subscribers as $row) : ?>
                        <tr>
                            <td><?php echo esc_html($row['email']); ?></td>
                            <td><?php echo esc_html($row['name']); ?></td>
                            <td><?php echo esc_html($row['source']); ?></td>
                            <td><?php echo esc_html($row['created_at']); ?></td>
                        </tr>
                    <?php endforeach; ?>
                    <?php if (!$recent_subscribers) : ?>
                        <tr><td colspan="4">No subscribers yet.</td></tr>
                    <?php endif; ?>
                </tbody>
            </table>

            <h2>Top Shared Posts</h2>
            <table class="widefat striped">
                <thead><tr><th>Post</th><th>Share Clicks</th></tr></thead>
                <tbody>
                    <?php foreach ($top_shares as $row) : ?>
                        <tr>
                            <td>
                                <?php
                                $title = get_the_title((int) $row['post_id']);
                                echo esc_html($title ? $title : 'Post #' . (int) $row['post_id']);
                                ?>
                            </td>
                            <td><?php echo esc_html(number_format_i18n((int) $row['total'])); ?></td>
                        </tr>
                    <?php endforeach; ?>
                    <?php if (!$top_shares) : ?>
                        <tr><td colspan="2">No share data yet.</td></tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
        <?php
    }

    public function export_csv() {
        if (!current_user_can('manage_options')) {
            wp_die('Forbidden', 403);
        }

        check_admin_referer('eonai_engagement_export');

        global $wpdb;

        $type = isset($_GET['type']) ? sanitize_key(wp_unslash($_GET['type'])) : 'subscribers';
        $allowed = ['subscribers', 'events', 'votes'];
        if (!in_array($type, $allowed, true)) {
            wp_die('Invalid export type.', 400);
        }

        $table = $wpdb->prefix . 'eonai_' . $type;
        $rows = $wpdb->get_results("SELECT * FROM {$table} ORDER BY id DESC LIMIT 5000", ARRAY_A);

        nocache_headers();
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename=eonai-' . $type . '-' . gmdate('Y-m-d') . '.csv');

        $output = fopen('php://output', 'w');
        if ($rows) {
            fputcsv($output, array_keys($rows[0]));
            foreach ($rows as $row) {
                fputcsv($output, $row);
            }
        } else {
            fputcsv($output, ['empty']);
        }
        fclose($output);
        exit;
    }
}

register_activation_hook(__FILE__, ['EONAI_Engagement_Tracker', 'activate']);
EONAI_Engagement_Tracker::instance();
