import httpx
from app.config import settings


class LangflowClient:
    def __init__(self):
        self.base_url = settings.LANGFLOW_URL
        self.flow_id = settings.LANGFLOW_FLOW_ID
        self.api_key = settings.LANGFLOW_API_KEY
        self.timeout = 60.0

    async def generate_text(self, prompt: str, max_tokens: int | None = None) -> str:
        try:
            headers = {}
            if self.api_key:
                headers["x-api-key"] = self.api_key

            payload = {
                "input_value": prompt,
                "output_type": "chat",
                "input_type": "chat",
            }

            url = f"{self.base_url}/api/v1/run/{self.flow_id}?stream=false"

            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(
                    url,
                    headers=headers,
                    json=payload,
                )
                response.raise_for_status()
                result = response.json()

                # Extract the text from Langflow's response
                # This assumes a standard Langflow flow output structure
                if "outputs" in result and len(result["outputs"]) > 0:
                    output = result["outputs"][0]
                    if "outputs" in output and len(output["outputs"]) > 0:
                        message = output["outputs"][0]
                        if "results" in message and "message" in message["results"]:
                            text = message["results"]["message"]["text"]
                            if text and text.strip():
                                # Clean up the response (similar to IBMClient)
                                text = text.strip()
                                prefixes = [
                                    "Assistant:",
                                    "assistant:",
                                    "Response:",
                                    "### Response",
                                    "### Assistant",
                                ]
                                for prefix in prefixes:
                                    if text.startswith(prefix):
                                        text = text[len(prefix) :].strip()
                                # Normalize blank lines
                                while "\n\n\n" in text:
                                    text = text.replace("\n\n\n", "\n\n")
                                return text
                raise Exception("Invalid Langflow response structure")

        except httpx.HTTPStatusError as e:
            raise Exception(f"Langflow HTTP error: {e.response.status_code} - {e.response.text}")
        except httpx.TimeoutException:
            raise Exception("Langflow request timed out")
        except httpx.RequestError as e:
            raise Exception(f"Langflow connection error: {str(e)}")
        except Exception as e:
            if "Langflow" in str(e):
                raise
            raise Exception(f"Langflow error: {str(e)}")


langflow_client = LangflowClient()
