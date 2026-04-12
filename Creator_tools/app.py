from flask import Flask, render_template, request, jsonify
import yt_dlp

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/downloader', methods=['GET', 'POST'])
def downloader():
    if request.method == 'POST':
        url = request.form['url']

        # Block YouTube (important)
        if "youtube.com" in url or "youtu.be" in url:
            return "YouTube downloads not allowed!"

        try:
            ydl_opts = {'format': 'best'}
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                ydl.download([url])
            return "Download Started!"
        except:
            return "Error downloading video"

    return render_template('downloader.html')

@app.route('/title', methods=['POST'])
def title():
    keyword = request.form['keyword']
    titles = [
        f"{keyword} 🔥 Viral Video",
        f"{keyword} | Must Watch 😱",
        f"Top {keyword} Tricks 🚀",
        f"{keyword} Shocking Moment 😳"
    ]
    return jsonify(titles)

@app.route('/hashtag', methods=['POST'])
def hashtag():
    keyword = request.form['keyword']
    tags = [
        f"#{keyword}",
        "#viral",
        "#trending",
        "#reels",
        "#explore"
    ]
    return jsonify(tags)

if __name__ == "__main__":
    app.run()
