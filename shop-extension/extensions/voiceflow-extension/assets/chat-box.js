document.addEventListener('DOMContentLoaded', function () {
    const userID = Math.floor(Math.random() * 1000000000000000);    
    console.log('User ID:', userID);
    const VF_KEY = "VF.DM.668e8ab74739614b83262dff.zIhDF25G7evNRl29";

    function delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    const vfInteract = async (user, userAction) => {
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
    const chatContainer = document.getElementById('chat-container');
    const productName = chatContainer.dataset.productName;

    const chatBox = document.getElementById('chat-box');
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('chat-send-button');

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
        messageDiv.textContent = message;
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    async function handleAgentResponse(response) {
        for (const trace of response) {
            if (trace.type === 'text') {
                addAgentMessage(trace.payload.message);
                await delay(1000);
            } else {
                console.log('Unknown trace type, full trace below:', trace.type);
                console.log(trace);
            }
        }
    }

    function sendMessage() {
        const message = chatInput.value;
        if (message.trim() === '') return;
        chatInput.value = '';
        addUserMessage(message);
        vfSendMessage(message);
    }

    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });

    vfSendLaunch({ productName: productName });
});
