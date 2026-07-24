const API_URL = "https://ai-youtube-automation-g2ua.onrender.com/chat";

async function sendMessage() {

    const message = document.getElementById("message").value;

    const responseBox = document.getElementById("response");

    responseBox.innerHTML = "Loading...";

    try {

        const res = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: message
            })
        });

        const data = await res.json();

        responseBox.innerHTML = data.reply;

    } catch (err) {

        responseBox.innerHTML = "Error : " + err.message;

    }

}
