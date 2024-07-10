import React, { useState, useEffect } from 'react';
import useConversationState from './ConversationState';

const ChatBox = () => {
  const [input, setInput] = useState('');
  const {messages, isAwaitingResponse, launchConversation, sendMessage} = useConversationState();
  const [conversationStarted, setConversationStarted] = useState(false);
  
  const handleSendMessage = () => {
    sendMessage(input);
    setInput('');
  };

  return (
    <div className="chat-box">
      {conversationStarted ? 
        <div>
            <div className="messages">
                {messages.map((msg, index) => (
                <div key={index} className="message">
                    {JSON.stringify(msg)}
                </div>
                ))}
            </div>
            {isAwaitingResponse ? <div>Waiting for response...</div> : null}
            <input
                type="text" value={input}
                onChange={(e) => setInput(e.target.value)}
            />
            <button onClick={handleSendMessage}>Send</button>
        </div>
    :
        <div>
            <button onClick={() => {
                launchConversation();
                setConversationStarted(true);
            }}>Start Conversation</button>
        </div>
      }
    </div> 
  );
};

export default ChatBox;
