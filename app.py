# app.py
from flask import Flask, render_template, request, send_file, jsonify
import yt_dlp
import re
import random
import os
from dotenv import load_dotenv
from io import BytesIO, StringIO
import tempfile
import requests
from urllib.parse import urlparse

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Environment Variables with secure defaults
app.secret_key = os.environ.get('SECRET_KEY', os.urandom(24).hex())
app.config['DEBUG'] = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'

# Configuration from environment
MAX_VIDEO_SIZE = int(os.environ.get('MAX_VIDEO_SIZE', 50))  # MB
DOWNLOAD_TIMEOUT = int(os.environ.get('DOWNLOAD_TIMEOUT', 30))  # seconds
ALLOWED_PLATFORMS = os.environ.get('ALLOWED_PLATFORMS', 'instagram,facebook').split(',')

# Sample viral title templates for YouTube
VIRAL_TITLES = [
    "You Won't Believe What Happened When I {action}",
    "The {adj} Way to {action} in 2024",
    "STOP {action_upper} Until You Watch This",
    "How I {action_past} and Changed Everything",
    "The Truth About {topic} Nobody Tells You",
    "{number} {adj} Secrets About {topic}",
    "Why {topic} Is Going {adj_adv}",
    "I Tried {action} for 30 Days - Here's What Happened",
    "The {adj} Reality of {topic}",
    "This {topic} Hack Will Change Your Life"
]

ACTIONS = ["grow your channel", "get more views", "increase engagement", "create content", "edit videos"]
ADJECTIVES = ["ultimate", "amazing", "shocking", "incredible", "genius", "crazy", "simple", "proven"]
TOPICS = ["YouTube", "content creation", "video editing", "going viral", "monetization"]
NUMBERS = ["5", "7", "10", "15", "20"]

# Trending hashtags by category
HASHTAGS_CATEGORIES = {
    "general": ["#viral", "#trending", "#fyp", "#explore", "#instagram", "#reels", "#viralvideos", "#explorepage", "#instagood", "#trendingaudio"],
    "tech": ["#tech", "#innovation", "#future", "#gadgets", "#digital", "#technology", "#coding", "#programming", "#ai", "#machinelearning"],
    "business": ["#business", "#success", "#entrepreneur", "#marketing", "#growth", "#money", "#startup", "#motivation", "#leadership", "#wealth"],
    "lifestyle": ["#lifestyle", "#motivation", "#inspiration", "#goals", "#mindset", "#happiness", "#selfcare", "#wellness", "#fitness", "#health"]
}

def is_youtube_url(url):
    """Check if URL is from YouTube"""
    youtube_patterns = [
        r'(https?://)?(www\.)?(youtube\.com|youtu\.be)/',
        r'(https?://)?(www\.)?(m\.youtube\.com)/'
    ]
    for pattern in youtube_patterns:
        if re.match(pattern, url):
            return True
    return False

def is_allowed_platform(url):
    """Check if URL is from allowed platform"""
    url_lower = url.lower()
    for platform in ALLOWED_PLATFORMS:
        if platform.strip() in url_lower:
            return True
    return False

def download_video(url):
    """Get video info using yt-dlp and return direct download URL"""
    try:
        # Check if it's a YouTube URL
        if is_youtube_url(url):
            return None, "YouTube videos are not allowed due to copyright restrictions. Please use Instagram or Facebook links."
        
        # Check if platform is allowed
        if not is_allowed_platform(url):
            return None, f"Only {', '.join(ALLOWED_PLATFORMS)} videos are allowed. Please provide a valid URL."
        
        ydl_opts = {
            'quiet': True,
            'no_warnings': True,
            'extract_flat': False,
            'format': 'best[height<=720]',  # Limit to 720p for faster downloads
            'timeout': DOWNLOAD_TIMEOUT,
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            
            # Check if it's Instagram or Facebook
            if 'instagram.com' in url.lower() or 'facebook.com' in url.lower() or 'fb.com' in url.lower() or 'fb.watch' in url.lower():
                # Get best video URL
                video_url = None
                if 'entries' in info:
                    info = info['entries'][0]
                
                # Try to get the best quality video URL
                if 'url' in info:
                    video_url = info['url']
                elif 'requested_formats' in info and info['requested_formats']:
                    video_url = info['requested_formats'][0]['url']
                elif 'formats' in info:
                    # Get the best quality video with both video and audio
                    for f in info['formats']:
                        if f.get('vcodec') != 'none' and f.get('acodec') != 'none':
                            video_url = f['url']
                            break
                    # If no combined format, get best video only
                    if not video_url:
                        for f in info['formats']:
                            if f.get('vcodec') != 'none':
                                video_url = f['url']
                                break
                
                if not video_url:
                    return None, "Could not extract video URL. Please try another video."
                
                # Check file size (approximate)
                if 'filesize' in info and info['filesize']:
                    file_size_mb = info['filesize'] / (1024 * 1024)
                    if file_size_mb > MAX_VIDEO_SIZE:
                        return None, f"Video is too large ({file_size_mb:.1f}MB). Maximum size is {MAX_VIDEO_SIZE}MB."
                
                # Clean title for filename
                safe_title = re.sub(r'[^\w\s-]', '', info.get('title', 'Video'))
                safe_title = re.sub(r'[-\s]+', '-', safe_title)
                
                return {
                    'title': safe_title,
                    'url': video_url,
                    'thumbnail': info.get('thumbnail', ''),
                    'duration': info.get('duration', 0)
                }, None
            else:
                return None, f"Please provide {', '.join(ALLOWED_PLATFORMS)} video links only"
                
    except yt_dlp.utils.DownloadError as e:
        error_msg = str(e)
        if "private" in error_msg.lower():
            return None, "This video is private or not accessible"
        elif "unavailable" in error_msg.lower():
            return None, "Video is unavailable"
        elif "login" in error_msg.lower():
            return None, "This video requires login. Please use a public video."
        elif "timeout" in error_msg.lower():
            return None, "Download timed out. Please try again."
        else:
            return None, f"Unable to download video: {error_msg[:100]}"
    except Exception as e:
        return None, f"An error occurred: {str(e)}"

def generate_title(action=None, topic=None):
    """Generate a viral YouTube title"""
    template = random.choice(VIRAL_TITLES)
    
    title_data = {
        'action': random.choice(ACTIONS),
        'action_upper': random.choice(ACTIONS).upper(),
        'action_past': random.choice(['Tried This', 'Discovered', 'Mastered', 'Learned']),
        'adj': random.choice(ADJECTIVES),
        'adj_adv': random.choice(['Viral', 'Mainstream', 'Crazy', 'Insane']),
        'topic': random.choice(TOPICS),
        'number': random.choice(NUMBERS)
    }
    
    # Override with custom values if provided
    if action and action.strip():
        title_data['action'] = action.lower().strip()
        title_data['action_upper'] = action.upper().strip()
    if topic and topic.strip():
        title_data['topic'] = topic.strip()
    
    title = template.format(**title_data)
    
    # Add emojis randomly for extra clickbait
    if random.choice([True, False]):
        emojis = ['🔥', '💯', '🚀', '😱', '🤯', '💪', '✨', '🎯']
        title = f"{random.choice(emojis)} {title} {random.choice(emojis)}"
    
    return title

def generate_hashtags(category="general", count=10):
    """Generate trending hashtags"""
    hashtags = []
    
    # Get hashtags from selected category
    if category in HASHTAGS_CATEGORIES:
        hashtags.extend(HASHTAGS_CATEGORIES[category])
    
    # Add some random popular hashtags
    popular = ["#viral", "#trending", "#fyp", "#explorepage", "#reelsinstagram", "#instagood", "#photooftheday"]
    hashtags.extend(popular)
    
    # Remove duplicates and limit to count
    hashtags = list(dict.fromkeys(hashtags))[:count]
    
    return hashtags

@app.route('/')
def index():
    """Homepage"""
    return render_template('index.html')

@app.route('/downloader', methods=['GET', 'POST'])
def downloader():
    """Video downloader page"""
    video_info = None
    error = None
    
    if request.method == 'POST':
        url = request.form.get('url', '').strip()
        
        if not url:
            error = "Please enter a video URL"
        else:
            video_info, error = download_video(url)
    
    return render_template('downloader.html', video_info=video_info, error=error)

@app.route('/direct-download', methods=['POST'])
def direct_download():
    """Direct endpoint to download video file"""
    try:
        data = request.get_json()
        video_url = data.get('video_url')
        video_title = data.get('video_title', 'video')
        
        if not video_url:
            return jsonify({'error': 'No video URL provided'}), 400
        
        # Stream the video directly to the client
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        response = requests.get(video_url, headers=headers, stream=True)
        
        if response.status_code == 200:
            # Send the video file
            return send_file(
                BytesIO(response.content),
                as_attachment=True,
                download_name=f"{video_title}.mp4",
                mimetype='video/mp4'
            )
        else:
            return jsonify({'error': 'Failed to download video'}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/title', methods=['GET', 'POST'])
def title_generator():
    """YouTube title generator page"""
    titles = []
    action = None
    topic = None
    
    if request.method == 'POST':
        action = request.form.get('action', '').strip()
        topic = request.form.get('topic', '').strip()
        
        # Generate 5 titles
        for _ in range(5):
            title = generate_title(action if action else None, topic if topic else None)
            titles.append(title)
    
    return render_template('title.html', titles=titles, action=action, topic=topic)

@app.route('/hashtag', methods=['GET', 'POST'])
def hashtag_generator():
    """Hashtag generator page"""
    hashtags = []
    category = "general"
    
    if request.method == 'POST':
        category = request.form.get('category', 'general')
        hashtags = generate_hashtags(category, 10)
    
    return render_template('hashtag.html', hashtags=hashtags, category=category)

@app.route('/download-hashtags', methods=['POST'])
def download_hashtags():
    """Download hashtags as a text file"""
    try:
        data = request.get_json()
        hashtags = data.get('hashtags', [])
        category = data.get('category', 'general')
        
        if not hashtags:
            return jsonify({'error': 'No hashtags to download'}), 400
        
        # Create file content
        content = f"""Creator Toolkit Hub - Hashtags Generated
Category: {category.upper()}
Date: {__import__('datetime').datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
Total Hashtags: {len(hashtags)}

Hashtags:
{chr(10).join(hashtags)}

Tips for using hashtags:
- Use 5-10 hashtags per post
- Mix popular and niche-specific tags
- Create a branded hashtag
- Research competitor hashtags

Generated by Creator Toolkit Hub
"""
        
        # Create a temporary file
        temp_file = tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False)
        temp_file.write(content)
        temp_file.close()
        
        # Send file
        return send_file(
            temp_file.name,
            as_attachment=True,
            download_name=f"hashtags_{category}_{__import__('datetime').datetime.now().strftime('%Y%m%d_%H%M%S')}.txt",
            mimetype='text/plain'
        )
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Health check endpoint for Render
@app.route('/health')
def health_check():
    return {"status": "healthy", "platforms": ALLOWED_PLATFORMS}, 200

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=app.config['DEBUG'])
