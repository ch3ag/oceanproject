(() => {
  const file = document.getElementById('file');
  if (!file) return;
  file.addEventListener('change', async () => {
    const selected = file.files[0];
    if (!selected) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const image = reader.result;
      const card = document.getElementById('analysis-card');
      document.getElementById('empty-analysis').classList.add('hide');
      card.classList.remove('hide');
      document.getElementById('analysis-image').src = image;
      card.querySelector('.label').textContent = 'AI ANALYZING...';
      card.querySelector('h3').textContent = '사진을 분석하고 있습니다';
      card.querySelector('ol').innerHTML = '<li>잠시만 기다려 주세요.</li>';
      document.getElementById('analysis').scrollIntoView({ behavior: 'smooth' });
      try {
        const response = await fetch('/api/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ image }) });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Analysis failed');
        card.querySelector('.label').textContent = data.category;
        card.querySelector('h3').innerHTML = `${data.item}<br><span>${data.summary}</span>`;
        card.querySelector('ol').innerHTML = data.steps.map(step => `<li><b>${step}</b></li>`).join('');
        card.querySelector('.notice').innerHTML = `<b>주의사항</b><br>${data.warnings.map(warning => `• ${warning}`).join('<br>')}`;
      } catch (error) {
        card.querySelector('.label').textContent = 'ANALYSIS ERROR';
        card.querySelector('h3').textContent = '분석에 실패했습니다';
        card.querySelector('ol').innerHTML = `<li>${error.message}</li>`;
      }
    };
    reader.readAsDataURL(selected);
  }, true);
})();
