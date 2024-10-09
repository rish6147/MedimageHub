document.getElementById('trim-button').addEventListener('click', async () => {
    const startTime = document.getElementById('start-time').value;
    const endTime = document.getElementById('end-time').value;
    const videoId = document.getElementById('video-id').value;  // Video being trimmed
    const patientId = document.getElementById('patient-id').value;
  
    try {
      const response = await fetch('/api/videos/trim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientId,
          videoId,
          startTime,
          endTime,
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        alert('Video trimmed successfully: ' + data.video);
        // Reload or update the video preview to show the new trimmed video
      } else {
        alert('Error trimming video: ' + data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  });
  