import { useState } from 'react';

export default function EmotionForm({ onAnalyze }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAnalyze(text);
    setText('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        rows="4"
        placeholder="Bugün nasıl hissediyorsun?"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <br />
      <button type="submit">Analiz Et</button>
    </form>
  );
}
