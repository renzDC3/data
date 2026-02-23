// Replace with your actual key from https://aistudio.google.com/
const API_KEY = 'AIzaSyDh30gZ3wrZ2CUdfRUbartu51QRZpyOqos'; 
const GEN_AI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

async function askChatbot() {
    const province = document.getElementById('provinceInput').value.trim();
    const city = document.getElementById('cityInput').value.trim();
    const chatbox = document.getElementById('chatbox');

    if (!province || !city) {
        addMessage("Please provide both Province and City.", "bot-msg");
        return;
    }

    const userPrompt = `Cebuana branch "${province}" province, "${city}" city. Provide the exact address.`;
    addMessage(userPrompt, "user-msg");

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

        // Check for API-specific errors (like wrong key)
        if (data.error) {
            throw new Error(data.error.message);
        }

        const aiResponse = data.candidates[0].content.parts[0].text;
        addMessage(aiResponse, "bot-msg");

    } catch (error) {
        addMessage(`Error: ${error.message}`, "bot-msg");
        console.error("Detailed Error:", error);
    }
}
