// Actual function to download video using the backend
async function downloadVideo(videoUrl, videoTitle) {
    try {
        showToast('Preparing download... 📥', 'info');
        
        const response = await fetch('/direct-download', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                video_url: videoUrl,
                video_title: videoTitle
            })
        });
        
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${videoTitle}.mp4`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            showToast('Download started! Saving your video... 💾', 'success');
        } else {
            const error = await response.json();
            showToast(error.error || 'Download failed', 'error');
        }
    } catch (error) {
        console.error('Download error:', error);
        showToast('Download failed. Please try again.', 'error');
    }
}
