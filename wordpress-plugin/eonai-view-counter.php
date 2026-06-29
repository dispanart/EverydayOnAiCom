<?php
/**
 * Plugin Name: EverydayOnAI Real Views Counter
 * Description: REST endpoint untuk menyimpan dan membaca jumlah views artikel dari frontend Next.js.
 * Version: 1.0.0
 * Author: EverydayOnAI
 */

if (!defined('ABSPATH')) {
    exit;
}

if (!defined('EONAI_VIEW_KEY')) {
    define('EONAI_VIEW_KEY', 'GANTI_DENGAN_SECRET_RANDOM_PANJANG');
}

function eonai_views_get_post_id($request) {
    return absint($request['id']);
}

function eonai_views_is_public_post($post_id) {
    return $post_id > 0 && get_post_type($post_id) === 'post' && get_post_status($post_id) === 'publish';
}

add_action('rest_api_init', function () {
    register_rest_route('eonai/v1', '/views/(?P<id>\d+)', array(
        array(
            'methods' => WP_REST_Server::READABLE,
            'callback' => 'eonai_views_get',
            'permission_callback' => '__return_true',
        ),
        array(
            'methods' => WP_REST_Server::CREATABLE,
            'callback' => 'eonai_views_increment',
            'permission_callback' => 'eonai_views_permission',
        ),
    ));
});

function eonai_views_permission($request) {
    $provided = $request->get_header('x-eonai-view-key');
    return is_string($provided) && hash_equals(EONAI_VIEW_KEY, $provided);
}

function eonai_views_get($request) {
    $post_id = eonai_views_get_post_id($request);

    if (!eonai_views_is_public_post($post_id)) {
        return new WP_Error('eonai_post_not_found', 'Post not found', array('status' => 404));
    }

    $views = absint(get_post_meta($post_id, 'eonai_views', true));

    return rest_ensure_response(array(
        'ok' => true,
        'post_id' => $post_id,
        'views' => $views,
    ));
}

function eonai_views_increment($request) {
    $post_id = eonai_views_get_post_id($request);

    if (!eonai_views_is_public_post($post_id)) {
        return new WP_Error('eonai_post_not_found', 'Post not found', array('status' => 404));
    }

    $views = absint(get_post_meta($post_id, 'eonai_views', true));
    $views++;

    update_post_meta($post_id, 'eonai_views', $views);

    return rest_ensure_response(array(
        'ok' => true,
        'post_id' => $post_id,
        'views' => $views,
    ));
}

add_action('add_meta_boxes', function () {
    add_meta_box(
        'eonai_views_box',
        'EverydayOnAI Views',
        function ($post) {
            $views = absint(get_post_meta($post->ID, 'eonai_views', true));
            echo '<p><strong>' . esc_html(number_format_i18n($views)) . '</strong> views</p>';
            echo '<p style="color:#666">Meta key: <code>eonai_views</code></p>';
        },
        'post',
        'side',
        'default'
    );
});
