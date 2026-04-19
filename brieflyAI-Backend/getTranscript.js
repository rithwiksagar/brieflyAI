async function transcribeAudio(audioUrl) {
    try {
        const baseUrl = "https://api.assemblyai.com";

        const headers = {
            authorization: "e03ba70de0f64fde947d1c984ffa6127",
            "content-type": "application/json",
        };

        // const audioUrl = "https://ap-northeast-1-recallai-production-bot-data.s3.amazonaws.com/_workspace-80d29628-0d22-41d7-9e72-e2db3eba31dc/recordings/eff83a8d-afe7-4c97-af89-b388bf82706f/video_mixed/d6ef9025-74b1-4797-baad-b3fb1074a763/bot/093be7a4-1ce5-44cf-b0b0-881d7058ec9c/AROA3Z2PRSQAEBKZWBVUU%3Ai-0645db35dd646e326/video.mp4?AWSAccessKeyId=ASIA3Z2PRSQAHIA3JCJH&Signature=bM%2F3ACrYA2oKQTqtTzPS5%2BoXMtc%3D&x-amz-security-token=IQoJb3JpZ2luX2VjECYaDmFwLW5vcnRoZWFzdC0xIkgwRgIhAObig4OfrxmQtTX2SP5uyZKnQtCshfQfL0cw06ega%2F64AiEAlEBikLyQHEWUbscHojiDSS7uHRjNiqH%2B0Y8PVp2sozsq1AUI7%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw4MTEzNzg3NzUwNDAiDEcX2Au5GBbe4uVCCiqoBRBBOwnm1e9y5fLaeD5cy9u16RA%2Fj6NYxWLxjVFJyyWflFTJggWlsADqhSWO33DvXU9QUL3ex5%2B5f3pL4iRiJTNyHSNQj6qe9neScnX%2B5T4ubKg7eUknm03GPASRZD4TH1ObIw23SKCF6c2gwRWhQRpPtZWs40qVwgSXFbJ4gAYzUQZ1yIhy3EOVRmvTX5KaN1vY5xB3qgTr4rm7jrDNphWl6kJuvv%2BwNENm82d3wqE53OIexbNAzjCsSPRgwtf6TYfdAkd%2FP%2FhmhTdXmPxlu92qziL3AodZZtaXXjQJ%2B9xuv2LCkZnMnlYc0G3EuK6%2BNI2vWwUJjaDDWu1hlMCE2rfe%2B%2BdLGOvIFQAVCXBEltBkzzwQbTZKPjHkPlIc0HbeVsZaFCC1wTBFIgt8yDoef8VfU3JJZmZASCl2siJFiBqgnO2Z1Oprj0zIOh1v62EA6RBATaFNFGa0Egk88OAt6Rk0iv0cckxLss2XQG9vB4SfKbfzd0kTXQ8HeLEfhV0Hn6US88XJjTxWQHcuzQMgKLCUVaf4Pv6OhIyXDsAxUPQW83QwFsHQ05EkeE7Zv80vwvQPVup48cdEJWqQOhdYgA4aqmkXXUG89te1NOFQD3BpJ1%2Bl%2B8D8ApoKnHiBKFeIO%2FaAr%2FTa1kyR6uW5jIbyD3TGK0W8QRJjGat%2FpA1YYk8F96SHYag4j4Ko2p1FKUnfTxllvpBkTirisjVuWD3SWGICZAewHChVRCgcMKNkZoiIDH2y96zDIW3V%2BIiTPpBvSN4YjqeyqqrfCtple5wjRjG0P9Mn2V6DlEO3rSIMZT4HeBQnlcdX71b%2F%2F2ByqfbxRXfyOYLdGmH41Cek23rbQrIGPi%2Fy3WZZy07s5OiMgbDZ%2FEx5amEJ6E9dmdsjElrzuXrAkmG3vQKpMOyYjs8GOrABfzi6mU8P6GW6%2FnGFnNytfCw5DTcYZQs2LeKlOyDeZJrw7yoMmMaPDZZRlKhgj44JqEex7vCQswaU%2F66slKqWesoGvsWvQ1BGIZTkY9xCthGOaEWcFbGugFs%2F9Y%2B1YI4TKCKo1Gjd36ZJRsO0YZk4jdRPXgdlCOi8sBDG3PLmaiuFpQtxBKr%2F69BF%2ByiuDIJJl6s9AB6AiUz5GtcZsaATuMe9TbBuVOLKPFq8HDvWLCA%3D&Expires=1776546108";


        // Step 1: Create transcription request
        const createRes = await fetch(`${baseUrl}/v2/transcript`, {
            method: "POST",
            headers,
            body: JSON.stringify({
                audio_url: audioUrl,
                language_detection: true,
                speech_models: ["universal-3-pro", "universal-2"],
            }),
        });

        const createData = await createRes.json();
        const transcriptId = createData.id;

        const pollingEndpoint = `${baseUrl}/v2/transcript/${transcriptId}`;

        // Step 2: Poll until completed
        while (true) {
            const pollRes = await fetch(pollingEndpoint, { headers });
            const result = await pollRes.json();

            if (result.status === "completed") {
                console.log(result.text);
                return result.text;
            }

            if (result.status === "error") {
                throw new Error(`Transcription failed: ${result.error}`);
            }

            // wait 3 seconds before next poll
            await new Promise((r) => setTimeout(r, 3000));
        }
    } catch (error) {
        return "";// return nothing if nothing captures
        console.error("Error in transcribeAudio:", error);
        throw error;
    }
}


export { transcribeAudio };

//   transcribeAudio();
//   transcribeAudio();