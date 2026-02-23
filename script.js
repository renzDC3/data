const API_KEY = 'AIzaSyDh30gZ3wrZ2CUdfRUbartu51QRZpyOqos'; // Ensure this is valid
const GEN_AI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

// Helper function to display messages in the UI
function addMessage(text, className) {
    const chatbox = document.getElementById('chatbox');
    const msgDiv = document.createElement('div');
    msgDiv.className = className;
    msgDiv.innerText = text;
    chatbox.appendChild(msgDiv);
    
    // Auto-scroll to the bottom
    chatbox.scrollTop = chatbox.scrollHeight;
}

async function askChatbot() {
    const province = document.getElementById('provinceInput').value.trim();
    const city = document.getElementById('cityInput').value.trim();

    if (!province || !city) {
        addMessage("Please provide both Province and City.", "bot-msg");
        return;
    }

    addMessage(`Searching for branches in ${city}, ${province}...`, "user-msg");

    try {
        const response = await fetch(GEN_AI_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: `You are a Cebuana Lhuillier branch locator. 
                                     The user is looking for a branch in ${city}, ${province}, Philippines. 
                                     Provide the exact address of the branch in that area. 
                                     Be brief and accurate.` }]
                }]
            })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        // Correct path to extract text from Gemini's response
        if (data.candidates && data.candidates[0].content) {
            const aiResponse = data.candidates[0].content.parts[0].text;
            addMessage(aiResponse, "bot-msg");
        } else {
            addMessage("No results found. Please try another city.", "bot-msg");
        }

    } catch (error) {
        addMessage(`System Error: ${error.message}`, "bot-msg");
        console.error("API Error:", error);
    }
}
