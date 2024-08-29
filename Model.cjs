const fs=require("fs");
async function query(filename) {
	const data = fs.readFileSync(filename);
	const response = await fetch(
		"https://api-inference.huggingface.co/models/trpakov/vit-face-expression",
		{
			headers: {
				Authorization: "Bearer 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",
				"Content-Type": "application/json",
			},
			method: "POST",
			body: data,
		}
	);
	const result = await response.json();
	return result;
}

query("sad.png").then((response) => {
	console.log(JSON.stringify(response));
});