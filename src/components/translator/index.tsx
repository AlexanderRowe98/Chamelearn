import { useState } from 'react';
import { translateText } from '@/utils/awsTranslate';
import './translator.css'; // Import the CSS file
import { FaArrowsRotate } from 'react-icons/fa6';

const Translator = () => {
  const [inputText, setInputText] = useState<string>("");
  const [translatedText, setTranslatedText] = useState<string>("");
  const [sourceLang, setSourceLang] = useState<string>("en");
  const [targetLang, setTargetLang] = useState<string>("nl");
  const [sourceLangFull, setSourceLangFull] = useState<string>("English");
  const [targetLangFull, setTargetLangFull] = useState<string>("Dutch");
  const [error, setError] = useState<string | null>(null); // To handle errors

  const handleTranslate = async () => {
    setError(null); // Reset any previous error message
    try {
      const result = await translateText(inputText, sourceLang, targetLang);
      setTranslatedText(result);
    } catch (error) {
      setError("Error translating text. Please try again.");
      console.error(error); // Log the error for debugging
    }
  };

  const toggleDirection = () => {
    if (sourceLang === 'en') {
      setSourceLang('nl');
      setTargetLang('en');
      setSourceLangFull('Dutch');
      setTargetLangFull('English');
    } else {
      setSourceLang('en');
      setTargetLang('nl');
      setSourceLangFull('English');
      setTargetLangFull('Dutch');
    }
  }

  return (
    <div className="translator-container">
      <div className="language-direction-container">
        <div className='language-direction-container--item'>
          <span className='language-direction-text'>{sourceLangFull}</span>
        </div>
        <div className='language-direction-container--item'>
          <FaArrowsRotate size={20} onClick={toggleDirection}/>
        </div>
        <div className='language-direction-container--item'>
          <span className='language-direction-text'>{targetLangFull}</span>
        </div>    
      </div>
      <textarea
        placeholder={sourceLang === 'en' ? 'Enter text to translate' : 'Voer tekst in om te vertalen'}
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        rows={4}
        cols={50}
      ></textarea>
      
      <button onClick={handleTranslate} className='button'>Translate</button>

      {/* Show error message if exists */}
      {error && <div className="error-message">{error}</div>}

      {/* Show translated text in styled container */}
      {translatedText && (
        <div className="translated-container">
            <h3>Translated Text</h3>
            <p>{translatedText}</p>
        </div>
      )}
    </div>
  );
};

export default Translator;
