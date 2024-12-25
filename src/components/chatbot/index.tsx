"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import styles from "./Chatbot.module.css";
import Loader from "./loader";
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

// Define the SpeechRecognition type explicitly
type SpeechRecognition = {
  continuous: boolean;
  lang: string;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
};

type SpeechRecognitionEvent = Event & {
  results: { [key: number]: { [key: number]: { transcript: string } } };
};

// Define types for message objects
type Message = {
  text: string;
  translated?: string;
  sender: "user" | "bot";
};

const Chatbot: React.FC = () => {
  // State hooks with types
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showTranslatedIndex, setShowTranslatedIndex] = useState<number | null>(null);
  const [isListening, setIsListening] = useState<boolean>(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synth = useRef(window.speechSynthesis);

  // Initialize SpeechRecognition on component mount
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.lang = "nl-NL";
      recognitionRef.current.interimResults = false;
      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };
      recognitionRef.current.onerror = (error: Event) => {
        console.error("Speech recognition error:", error);
      };
    }
  
    // Cleanup to prevent memory leaks
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
      }
    };
  }, []);
  
  useEffect(() => {
    listen();
  }, [isListening])

  const listen = () => {
    if (isListening) {
      startListening();
    } else {
      stopListening();
    }
  }

  const startListening = () => {
    if (recognitionRef.current) {
      try {
        console.log("Starting speech recognition...");
        recognitionRef.current.start();
      } catch (error) {
        console.error("Error starting SpeechRecognition:", error);
      }
    } else {
      console.warn("SpeechRecognition is not available.");
    }
  };
  
  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        console.log("Stopping speech recognition...");
        recognitionRef.current.stop();
      } catch (error) {
        console.error("Error stopping SpeechRecognition:", error);
      }
    } else {
      console.warn("SpeechRecognition is not available.");
    }
  };

  const speakText = (text: string) => {
    if (synth.current) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "nl-NL";
      synth.current.speak(utterance);
    }
  };

  const sendMessage = async () => {
    setIsLoading(true);
    if (!input.trim()) {
      setIsLoading(false);
      return;
    }

    const newMessages: Message[] = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);

    try {
      const response = await axios.post<{ detectedResponse: string, preferredResponse: string }>("/api/chat", { message: input });

      const botMessage = response.data.detectedResponse;
      setMessages([...newMessages, { text: botMessage, translated: response.data.preferredResponse, sender: "bot" }]);

      speakText(botMessage); // Speak bot's response
      setIsLoading(false);
    } catch (error) {
      const errorMessage = "Error communicating with the server.";
      setMessages([...newMessages, { text: errorMessage, sender: "bot" }]);
      speakText(errorMessage);
      setIsLoading(false);
    }

    setInput(""); // Clear the input field
  };

  const handleShowMoreClick = (index: number) => {
    setShowTranslatedIndex(index);
  };

  return (
    <div className={styles.chatbot}>
      <div className={styles.chatWindow}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`${styles.message} ${
              msg.sender === "user" ? styles.user : styles.bot
            }`}
          >
            {msg.text}
            {typeof msg.translated !== "undefined" && (
              <div>
                {showTranslatedIndex === idx ? (
                  <div>
                    {msg.translated}
                    <button onClick={() => setShowTranslatedIndex(null)}>Show Less</button>
                  </div>
                ) : (
                  <button onClick={() => handleShowMoreClick(idx)}>Show More</button>
                )}
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className={styles.chatLoader}>
            <Loader />
          </div>
        )}
      </div>
      <div className={styles.inputBox}>
        <button
          className={styles.micButton}
          onClick={() => setIsListening(!isListening)}
          // onMouseDown={startListening}
          // onMouseUp={stopListening}
        >
          {isListening ? "🎙️ Listening..." : "🎤 Speak"}
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;
