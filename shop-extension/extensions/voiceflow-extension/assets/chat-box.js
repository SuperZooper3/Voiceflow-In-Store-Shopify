document.addEventListener('DOMContentLoaded', function () {
    const userID = `${Math.floor(Math.random() * 1000000000000000)}`;    
    console.log('User ID:', userID);
    const VF_KEY = "VF.DM.669a641e1091ccc3ed5c1b61.X0dWvrpTYfNg9hl4";
    const VF_PROJECT_ID = "66968abb6d9824424357fbc8";
    const VF_VERSION_ID = "66968abb6d9824424357fbc9";

    function delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    const vfInteract = async (user, userAction) => {
        clearInputState();
        showTypingIndicator();

        const interractionUrl = `https://general-runtime.voiceflow.com/state/user/${user}/interact`;

        const payload = {
            action: userAction,
        };

        const data = await fetch(interractionUrl, {
            headers: {
                'Authorization': VF_KEY,
                'accept': 'application/json',
                'content-type': 'application/json',
                'versionID': 'production',
            },
            method: 'POST',
            body: JSON.stringify(payload),
        });

        // check if we get the response, if there's an error, we can catch it here
        if (!data.ok) {
            throw new Error(`Interact HTTP error! status: ${data.status}`);
        }

        if (data.ok && userAction.type !== 'launch') {
            vfSaveTranscript();
        }

        const postRes = await data.json();
        
        hideTypingIndicator();
        return postRes;
    };

    const vfSendLaunch = async (payload = null) => {
        let interractPayload = {
            type: 'launch',
        };
        if (payload) {
            interractPayload = {
                type: 'launch',
                payload: payload,
            };  
        }
        vfInteract(userID, interractPayload).then((res) => {
            console.log(res);
            handleAgentResponse(res);
        });
    };

    const vfSendMessage = async (message) => {
        vfInteract(userID, { type: 'text', payload: message }).then((res) => {
            console.log(res);
            handleAgentResponse(res);
        });
    }

    const vfSendAction = async (action) => {
        console.log('Sending action:', action);
        vfInteract(userID, action).then((res) => {
            console.log(res);
            handleAgentResponse(res);
        });
    }

    const vfSaveTranscript = async () => {
        const transcriptsUrl = 'https://api.voiceflow.com/v2/transcripts';
        const transcriptsOptions = {
            method: 'PUT',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                Authorization: VF_KEY
            },
            body: JSON.stringify({projectID: VF_PROJECT_ID, versionID: VF_VERSION_ID, sessionID: `${userID}`}),
        };
        console.log('Saving transcript:', transcriptsOptions);
        const data = await fetch(transcriptsUrl, transcriptsOptions);
        console.log('Transcripts response:', data);
        if (!data.ok) {
            throw new Error(`Transcripts HTTP error! status: ${data.status}`);
        }
        const postRes = await data.json();
        return postRes;
    }

    const chatContainer = document.getElementById('chat-container');
    const productName = chatContainer.dataset.productName;
    const pageSlug = chatContainer.dataset.pageSlug;

    const chatBox = document.getElementById('chat-box');
    const typingIndicator = document.getElementById('chat-box-typing-indicator-container');
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('chat-send-button');
    const buttonDiv = document.getElementById('chat-button-box');
    const addToCartButton = document.getElementById('chat-add-to-cart');
    const shareButton = document.getElementById('chat-copy-button');

    function addUserMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'vf-message vf-message-user';
        messageDiv.textContent = message;
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function addAgentMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'vf-message vf-message-agent';
        message = message.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
        message = message.replace(/\*(.*?)\*/g, '<i>$1</i>');
        message = message.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>');
        message = message.replace(/(\n)+/g, '<br>');
        messageDiv.innerHTML = message;
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function addAgentNormalButton(buttons) {
        for (const button of buttons) {
            const buttonElement = document.createElement('button');
            buttonElement.className = 'vf-message-button';
            buttonElement.textContent = button.name;
            buttonElement.addEventListener('click', function () {
                addUserMessage(button.name);
                console.log('Button clicked:', button);
                if (button.request.payload.actions) {
                    for (const action of button.request.payload.actions) {
                        if (action.type === 'open_url') {
                            console.log('Opening URL:', action.payload.url);
                            window.open(action.payload.url, '_blank');
                        } else {
                            console.log('Unknown button action type:', action.type);
                        }
                    }
                }
                console.log('Sending action:', button.request);
                vfSendAction(button.request);
            });
            buttonDiv.appendChild(buttonElement);
        }
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function showAddToCart() {
        addToCartButton.style.display = 'block';
    }
    
    function hideAddToCart() {
        addToCartButton.style.display = 'none';
    }

    function showShareButton() {
        shareButton.style.display = 'block';
    }

    function hideShareButton() {
        shareButton.style.display = 'none';
    }

    function showTypingIndicator() {
        typingIndicator.style.display = 'block';
    }
    
    function hideTypingIndicator() {
        typingIndicator.style.display = 'none';
    }

    async function handleAgentResponse(response) {
        for (const trace of response) {
            if (trace.type === 'text') {
                addAgentMessage(trace.payload.message);
                await delay(1000);
            } else if (trace.type === 'choice') {
                addAgentNormalButton(trace.payload.buttons);
            } else if (trace.type === 'add_to_cart' || (trace.type === "trace" && trace.payload.name === "add_to_cart")) {
                showAddToCart();
            } else if (trace.type === 'share' || (trace.type === "trace" && trace.payload.name === "share")) {
                showShareButton();
            }
            else {
                console.log('Unknown trace type, full trace below:', trace.type);
            }
            console.log(trace);
        }
    }

    function sendMessage() {
        const message = chatInput.value;
        if (message.trim() === '') return;
        chatInput.value = '';
        addUserMessage(message);
        vfSendMessage(message);
    }

    function copyToClipboard() {
        const currentUrl = window.location.href;
        navigator.clipboard.writeText(currentUrl).then(function() {
            addAgentMessage('Product URL copied to clipboard');
        }, function(err) {
            addAgentMessage(`Here's the product URL: ${currentUrl}`);
        });
    }

    function clearInputState() {
        buttonDiv.innerHTML = '';
        hideAddToCart();
        hideShareButton();
    }

    sendButton.addEventListener('click', sendMessage);
    shareButton.addEventListener('click', copyToClipboard);

    chatInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });

    vfSendLaunch({ productName: productName, pageSlug: pageSlug });
});
