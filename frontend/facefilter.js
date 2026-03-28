setInterval(() => {
    fetch("/name")
        .then(res => res.json())
        .then(data => {
            document.getElementById("nameBox").innerText =
                "Detected: " + data.name;
        });
}, 500);
