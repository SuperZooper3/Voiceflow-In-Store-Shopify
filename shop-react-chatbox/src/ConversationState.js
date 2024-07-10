import {vfInteract} from './VoiceflowInteractions';
import {useState} from 'react';

const useConversationState = () => {
  const [messages, setMessages] = useState([]);
  const [choices, setChoices] = useState({});
  const [sessionSlug, setSessionSlug] = useState(Math.random().toString(36));
  const [isAwaitingResponse, setIsAwaitingResponse] = useState(false);

  const launchConversation = () => {
    if (sessionSlug) {
      userSendAction(null, {type: 'launch'});
      console.log(`Conversation started with session slug: ${sessionSlug}`);
    } else
    {
      console.log('Error: session slug not set so conversation cannot be started');
    }
  };

  const sendMessage = (message) => {
    if (message.trim()) {
      userSendAction(message,{type: 'text', payload: message});
    }
  }

  const addMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  // The choices a user can make from buttons or a choice step
  // Inside, they contain the button's name (.name), a handler (.handler)
  // and any other data that will be passed to the handler
  const userSendAction = (displayText, interactPayload) => {
    setIsAwaitingResponse(true);
    if (displayText !== null) {
      addMessage({sender: 'user', content: displayText});
    }
    const VFAnswers = vfInteract(sessionSlug, interactPayload);

    VFAnswers.then((res) => {
      for (let i = 0; i < res.length; i++) {
        addMessage({sender: 'response', content: res[i]});
        alert(res[i].payload?.message);
      }
      setIsAwaitingResponse(false);
    }, (err) => {
      console.log(err);
    });
  };

  return {
    messages,
    choices,
    isAwaitingResponse,
    launchConversation,
    sendMessage,
  };
};

export default useConversationState;
