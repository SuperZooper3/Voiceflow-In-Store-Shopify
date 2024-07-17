document.addEventListener('DOMContentLoaded', function () {
    const userID = Math.floor(Math.random() * 1000000000000000);    
    console.log('User ID:', userID);
    const VF_KEY = "VF.DM.66969025435363662b34a0a3.m57WDTlSEXjcUptB";

    function delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    const vfInteract = async (user, userAction) => {
        clearInputState();

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
            throw new Error(`HTTP error! status: ${data.status}`);
        } else {
            const postRes = await data.json();
            return postRes;
        }
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

    const chatContainer = document.getElementById('chat-container');
    const productName = chatContainer.dataset.productName;
    const pageSlug = chatContainer.dataset.pageSlug;

    const chatBox = document.getElementById('chat-box');
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
        // try to hyperlink URLs with a generous regex
        message = message.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
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
