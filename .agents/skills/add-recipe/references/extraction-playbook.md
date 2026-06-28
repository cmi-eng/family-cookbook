# Extraction Playbook — per platform

How to pull a recipe from each source type, with the specific tools available. The goal every time
is the same: **title, ingredients, step-by-step method, servings/times, hero image, step images,
and a video to embed.** Then convert units (see `conversions.md`) and write the files.

> Tool note: the Apify Actor tools may need an Apify account/token (free tier ≈ US$5 credit/month,
> plenty for personal use). If an Actor isn't available, fall back to `WebFetch` on the public page
> and/or `WebSearch` to find a written version of the recipe.

---

## Websites & blogs  → `WebFetch`
The richest source. Most recipe sites embed **JSON-LD `Recipe` structured data** — the cleanest
possible input.

1. `WebFetch` the URL with a prompt like:
   > "Extract the full recipe: title, servings, prep/cook/total time, the complete ingredient list
   > with quantities, the numbered method steps, and the URL of the main recipe image. If the page
   > contains JSON-LD Recipe schema, use it."
2. If the page is JS-heavy and `WebFetch` returns little, try `WebSearch` for `"<dish> recipe <site>"`
   to find a cached/AMP version, or use the Apify website-content actor.
3. Grab the hero image URL from the result; download it (SKILL.md step 5).

## Instagram (Reels & posts)  → `apify--instagram-scraper`
Instagram recipes live in the **caption**, and the method is often only spoken in the Reel.

1. Run `apify--instagram-scraper` with the post/reel URL. It returns the caption, like/owner info,
   the display image / thumbnail, and the video URL.
2. Build the recipe from the **caption** (ingredients are usually listed there). If the caption is
   thin and the steps are only in the video, transcribe the method from what's shown/said and note
   "transcribed from video" in `notes`.
3. Hero image: download the returned thumbnail/display URL.
4. Video embed: `https://www.instagram.com/reel/<CODE>/embed` (CODE is the shortcode in the URL).

## YouTube  → `streamers--youtube-scraper`
Best case: the video has a **transcript** and the description has the ingredient list.

1. Run `streamers--youtube-scraper` on the video URL — request the description and, if supported,
   captions/transcript.
2. Ingredients: usually in the **description**. Method: reconstruct from the **transcript** (and
   description timestamps/chapters if present). Tighten rambling narration into clean numbered steps.
3. Hero image: use the YouTube thumbnail `https://img.youtube.com/vi/<ID>/maxresdefault.jpg`
   (fallback `hqdefault.jpg`).
4. Video embed: `https://www.youtube.com/embed/<ID>`.
5. If no transcript is available, `WebSearch` the video title + "recipe" to find the blog the
   creator usually links, and extract from there.

## TikTok  → `clockworks--tiktok-scraper`
Like Instagram — short caption, method in the video.

1. Run `clockworks--tiktok-scraper` on the URL → caption, cover image, video URL, sometimes
   subtitles.
2. Reconstruct ingredients + steps from caption + any subtitles. Note "transcribed from video".
3. Hero image: download the cover image.
4. Video embed: `https://www.tiktok.com/embed/v2/<VIDEO_ID>` (numeric id from the URL).

## Facebook  → `apify--facebook-posts-scraper`
1. Run the scraper on the post URL → text body, images, video.
2. Build from the post text; transcribe video method if needed.
3. Download the first image as hero. Embedding FB video is unreliable — usually leave
   `video_embed: null` and keep the link in `source.url`.

## Pinterest  → `WebFetch` (then follow through)
Pins usually point to a source blog.
1. `WebFetch` the pin URL to get the pin image and the **outbound source link**.
2. Follow the source link and extract the real recipe from there (website flow above).
3. Use the pin image as hero if the source has none.

## Twitter/X  → `apidojo--tweet-scraper`
1. Scrape the tweet → text + any media. Threads often hold the full recipe — fetch the thread.
2. Build from the text; download attached image as hero.

## Reddit  → `trudax--reddit-scraper-lite`
1. Scrape the post → title, selftext (often the full recipe), images, and top comments (sometimes
   corrections/variations worth a note).
2. Extract from the selftext.

## Pasted text / screenshot
If the user just pastes recipe text (or you read it from an image they shared), parse it directly.
Set `source.platform: "pasted"`, `source.url: ""`, and `hero_image: null` unless an image was given.

---

## When the method is only in a video (common for Reels/TikTok/Shorts)
1. Use every text signal first: caption/description, on-screen text, pinned comment, subtitles.
2. Reconstruct the steps in logical cooking order — don't just transcribe verbatim; produce clean,
   complete, cookable instructions.
3. If quantities are missing, give sensible ranges and flag them in `notes` ("amounts approximate —
   not specified in the video"). Never silently invent precise numbers.
4. Always keep the original video link in `source.url` and embed it (`video_embed`) so the cook can
   watch the technique.

## Thumbnails — always capture the finished-dish image
Every recipe should display a photo of what the dish looks like. Capture it from the source content:
- **Websites**: the recipe's main photo / JSON-LD `image` / `og:image` meta tag.
- **Instagram / TikTok**: the post **cover/display image** the scraper returns (it's a frame of the dish).
- **YouTube**: `https://img.youtube.com/vi/<ID>/maxresdefault.jpg` (fallback `hqdefault.jpg`).
- **Facebook / Twitter / Reddit**: the first attached image.
- For **video recipes, still set `hero_image`** to the cover frame so the card has a thumbnail — the
  inline player lives only on the detail page via `video_embed`.

```bash
mkdir -p images/<slug>
curl -L -s -A "Mozilla/5.0" -o images/<slug>/hero.jpg "<DISH_IMAGE_URL>"
file images/<slug>/hero.jpg   # confirm it's a real JPEG/PNG/WebP, not a 0-byte file or HTML error
```
- Social CDN image URLs can expire — download promptly, and use the `-A "Mozilla/5.0"` user-agent.
- If `curl` returns a tiny/empty file or a 403, retry once (and try the `og:image` URL) before giving
  up. Only set `hero_image: null` when there is genuinely no usable image — the site then shows a
  tasteful emoji placeholder.
- Prefer `.jpg`; if the source is `.webp`/`.png`, keep the real extension and reference it correctly.
- Pick the most appetizing **finished-dish** shot when several images exist — not raw ingredients.
