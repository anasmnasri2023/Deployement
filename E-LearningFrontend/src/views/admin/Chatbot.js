import React, { useState, useEffect, useRef } from "react";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [botpressLoaded, setBotpressLoaded] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    if (isOpen && !botpressLoaded) {
      loadBotpress();
      setBotpressLoaded(true);
    }
  }, [isOpen, botpressLoaded]);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      const scripts = document.querySelectorAll(
        'script[src^="https://cdn.botpress.cloud/webchat/"], script[src^="https://files.bpcontent.cloud/"]'
      );
      scripts.forEach((script) => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });
      if (window.botpressWebChat && window.botpressWebChat.destroy) {
        window.botpressWebChat.destroy();
      }
    };
  }, []);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen && !botpressLoaded) {
      loadBotpress();
      setBotpressLoaded(true);
    } else if (isOpen && window.botpressWebChat && window.botpressWebChat.destroy) {
      window.botpressWebChat.destroy();
    }
  };

  const loadBotpress = () => {
    if (
      document.querySelector(
        'script[src="https://cdn.botpress.cloud/webchat/v3.2/inject.js"]'
      )
    ) {
      initializeWebchat();
      return;
    }

    const injectScript = document.createElement("script");
    injectScript.src = "https://cdn.botpress.cloud/webchat/v3.2/inject.js";
    injectScript.async = true;

    const configScript = document.createElement("script");
    configScript.src =
      "https://files.bpcontent.cloud/2025/08/17/19/20250817191353-5QV7LCH7.js";
    configScript.defer = true;

    injectScript.onload = () => {
      document.body.appendChild(configScript);
      initializeWebchat();
    };

    document.body.appendChild(injectScript);
  };

  const initializeWebchat = () => {
    try {
      if (window.botpressWebChat && window.botpressWebChat.hide) {
        window.botpressWebChat.hide();
      }

      if (window.botpressWebChat) {
        window.botpressWebChat.init({
          clientId: "cf4f3ca8-b9f0-4b92-9abc-5af0d75a1fe0",
          botName: "Chatbot E-learning",
          containerId: "bp-webchat-container",
          showWidget: false,
          onMessage: () => playAudio(),
        });
      }
    } catch (error) {
      console.error("Error initializing Botpress Webchat:", error);
    }
  };

  const playAudio = () => {
    const audio = new Audio("https://s3-us-west-2.amazonaws.com/s.cdpn.io/3/success.mp3");
    audio.play();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Bouton flottant 🤖 */}
      <button
        onClick={toggleChat}
        className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg transition-all duration-200 hover:scale-110"
        title={isOpen ? "Fermer le chatbot" : "Ouvrir le chatbot"}
      >
        <span className="text-2xl">🤖</span>
      </button>

      {/* Conteneur du chatbot */}
      {isOpen && (
        <div
          id="bp-webchat-container"
          className="fixed bottom-20 right-6 w-80 h-96 bg-white rounded-lg shadow-xl border border-gray-200"
          style={{ minWidth: "320px", minHeight: "400px" }}
        ></div>
      )}
    </div>
  );
};

export default Chatbot;
